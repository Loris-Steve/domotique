require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require('http');
const mqtt = require('mqtt');

const telemetrys = require("./app/controllers/telemetry.controller.js");

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: '*' }
});

const options = {
  clientId: 'my_new_server_client',
  username: 'device',
  password: 'admin'
};
const addresseQTT = "172.20.0.2"; // !mettre la bonne adresse vers le serveur mqtt (l'adresse est aussi afficher par un console.log dans le terminal du mqtt : broker host name ...)
const client = mqtt.connect(`mqtt://${addresseQTT}:1883`, options); 

var corsOptions = {
  origin: ['http://localhost:4200', process.env.CLIENT_ORIGIN, 'http://localhost:8081','http://127.0.0.1:8888']
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// ----- socket io ------------------

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});
console.log("socket add");
//--------------------------------
//--------------------------------

const topicTelemetry = 'telemetry';
const topicAlert = 'alert';
const message = 'test message';

client.on('connect', () => {
  console.log(`Is client connected: ${client.connected}`);    
  // subscribe to a topicTelemetry
  client.subscribe(topicTelemetry);
  client.subscribe(topicAlert);
  
  if (client.connected === true) {
      console.log(`message: ${message}, topicTelemetry: ${topicTelemetry}`); 
      // publish message        
      //client.publish(topicTelemetry, message);
  }

});

// receive a message from the subscribed topicTelemetry
client.on('message',(topic, messageReceived) => {

  // Check which topic the message is received from
  if (topic === topicTelemetry) {
    
    const telemetryData = JSON.parse(messageReceived);
    console.log('telemetryData :>> ', telemetryData.telemetry);
    console.log('telemetryData first element :>> ', telemetryData?.telemetry[0]);
    // add one element
    if(telemetryData?.telemetry[0]){ 

      telemetrys.addTelemetry(telemetryData.telemetry[0]);
      // add all data
      // telemetryData.telemetry.array.forEach(element => {
        //   telemetrys.addTelemetry(element);
        // });
      }
    io.emit('message', { topic: topic, message: messageReceived.toString() });
  } else if (topic === topicAlert) {
    // Handle messages from the "alert" topic
    // Do something with the alert message
    io.emit('message', { topic: topic, message: messageReceived.toString() });
  }
});

// error handling
client.on('error',(error) => {
  console.error(error);
  process.exit(1);
});
// ----------------------------------------

const db = require("./app/models");

console.log(db.url);

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/telemetry.routes")(app);

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});