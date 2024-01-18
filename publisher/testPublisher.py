import paho.mqtt.client as mqtt 
import time
import socket
import json
from random import randrange

broker_hostname = socket.gethostbyname('broker')
port = 1883 
print("broker host name " + broker_hostname)

def on_connect(client, userdata, flags, return_code):
    if return_code == 0:
        print("connected")
    else:
        print("could not connect, return code:", return_code)

# Client name
client = mqtt.Client("SweetHomeTelemetrics")

client.username_pw_set(username="device", password="admin")
client.on_connect = on_connect

client.connect(broker_hostname, port)
client.loop_start()

#topic name
topic = "telemetry"
cpt = 0
time_sleep = 10
try:
    while cpt < 100:
        if cpt > 60 and cpt < 62:
            time_sleep = 20
            
        time.sleep(time_sleep)
        cpt += 1
        temp1 = randrange(18, 22)
        temp2 = randrange(19, 22)

        humid1 = randrange(50, 65)
        humid2 = randrange(50, 65)

        lumGarage = randrange(0, 2)
        
        telemetryData = {'telemetry' :[ {'deviceName':'Temp Chambre1', 'value':temp1}
                    , {'deviceName':'Temp Chambre2', 'value':humid1}
                    , {'deviceName':'Humid Chambre1', 'value':temp2}
                    , {'deviceName':'Humid Chambre2', 'value':humid2}
                    , {'deviceName':'Fen Chambre1', 'value':0}
                    , {'deviceName':'Fen Chambre2', 'value':1}
                    , {'deviceName':'Lum Garage', 'value':0}
                   ]}

        result = client.publish(topic, json.dumps(telemetryData))
        status = result[0]
        if status == 0:
            print("Message "+ json.dumps(telemetryData) + " is published to topic " + topic)
        else:
            print("Failed to send message to topic " + topic)
            if not client.is_connected():
                print("Client not connected, exiting...")
                break
finally:
    client.disconnect()
    client.loop_stop()