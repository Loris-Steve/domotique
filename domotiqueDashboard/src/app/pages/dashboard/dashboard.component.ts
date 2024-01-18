import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject } from 'rxjs';

import { io } from "socket.io-client";

const baseUrl = 'http://localhost:6868/api/telemetries';
const socketUrl = 'http://localhost:6868/';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AsyncPipe, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  telemetries : any[] = []
  
  socket = io(socketUrl);
  public alert : string = "";

  public telemetry$: BehaviorSubject<string> = new BehaviorSubject('');
  
  constructor() {
    //this.getNewMessage();
    //this.sendMessage("test xxx");
  }  

  public sendMessage(message:string) {
    console.log("send");
    this.socket.emit('message', message);
  }

  public getNewMessage = () => {
    this.socket.on('message', (message) =>{
      //console.log('message :>> ', message);
      if (message && message.topic && message.topic == "telemetry"){
        const data = JSON.parse(message.message);
          console.log('data :>> ', data);
          this.telemetries = data.telemetry
      }
      else if (message && message.topic && message.topic == "alert"){
        const data = JSON.parse(message.message);
          console.log('alert data :>> ', data);
          //this.alert = data.alert?.toString()
          this.alert = data.alert?.map((alert:any) => alert.deviceName + ' : ' + alert.value)
      }
      else{
        console.log("not !!");
      }
      if (message && message.topic && message.topic == "alert"){
        
      }
      // this.telemetry$.asObservable().subscribe((telemetryList : any) => {
      //   this.telemetries = telemetryList
      // })
    });
    
  };

  ngOnDestroy() {
    // Cleanup tasks when the component is destroyed
    if (this.socket) {
      this.socket.disconnect();  // Disconnect from the socket
      //this.socket = null;        // Clear the socket instance
    }
  }

}

// const deviceList = 
// [{"deviceName": "Temp Chambre1", "value": 20},
//  {"deviceName": "Temp Chambre2", "value": 53},
//  {"deviceName": "Humid Chambre1", "value": 20},
//  {"deviceName": "Humid Chambre2", "value": 64},
//  {"deviceName": "Lum Garage", "value": 0}
// ]
