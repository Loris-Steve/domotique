import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:6868/api/telemetries/';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [HttpClientModule,CommonModule, AsyncPipe, MatIconModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {

  telemetries : any[] = []

  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
  }

  retrieveTelemetrys(): void {
    console.log("get all");
    this.getAll()
      .subscribe({
        next: (data) => {
          this.telemetries = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(baseUrl);
    
  }

}
