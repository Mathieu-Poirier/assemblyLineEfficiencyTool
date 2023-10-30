import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private socket: any;
  public partsMadePerMinute: number | null = null;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.socket.on('connect', () => {
      console.log('Connected to the server');
    });

    let previousData: any = null; // Variable to store the previous data

    this.socket.on('dataUpdate', (data: any) => {
      console.log('Received updated data:', data);

      if (!previousData || data.timestamp === null) {
        console.log('Parts Made Per Minute: null');
        this.partsMadePerMinute = null;
      } else {
        const partsDifference = data.parts_made - previousData.parts_made;
        const timeDifference =
          (new Date(data.timestamp).getTime() - new Date(previousData.timestamp).getTime()) / 60000; // Convert to minutes
        const partsMadePerMinute = partsDifference / timeDifference;
        console.log('Parts Made Per Minute:', partsMadePerMinute);
        this.partsMadePerMinute = partsMadePerMinute;
      }

      previousData = data;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
  }
}
