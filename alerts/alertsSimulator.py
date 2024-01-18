import paho.mqtt.client as mqtt 
import time
import socket
import json
from random import randrange

broker_hostname = socket.gethostbyname('broker')
port = 1883 

def on_connect(client, userdata, flags, return_code):
    if return_code == 0:
        print("connected")
    else:
        print("could not connect, return code:", return_code)

client = mqtt.Client("SweetHomeAlerts")

client.username_pw_set(username="device", password="admin")
client.on_connect = on_connect

client.connect(broker_hostname, port)
client.loop_start()

# Topic name
topic = "alert"
        
while True:
    alertMov1Data = {'alert' :[ {'deviceName':'Mov Jardin', 'value':1}]}

    result = client.publish(topic, json.dumps(alertMov1Data))
    
    print("Message "+ json.dumps(alertMov1Data) + " is published to topic " + topic)

    time.sleep(30)
