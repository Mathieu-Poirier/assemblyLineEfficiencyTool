import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private socket: any;
  public data: any[] = []; // Array to store data over time
  public partsMadePerMinute: number | null = null;
  public svg: any;
  public xScale: any;
  public yScale: any;

  @ViewChild('chartContainer', { static: true }) private chartContainer!: ElementRef;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.socket.on('connect', () => {
      console.log('Connected to the server');
      this.createChart();
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

        // Update the data array
        this.data.push(this.partsMadePerMinute);

        // Update the chart
        this.updateChart();
      }

      previousData = data;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
  }

  private createChart() {
    // Use Angular renderer to access the SVG container
    const element = this.chartContainer.nativeElement;

    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add any additional initialization code for your chart here
    this.svg = svg;
    
  }
  
  private updateChart() {
    const maxBars = 10;
  
    // Assuming a simple bar chart
    const barWidth = 40;
    const barPadding = 10;
  
    const xScale = d3.scaleLinear()
      .domain([0, this.data.length - 1])
      .range([0, this.data.length * (barWidth + barPadding)]);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(this.data)])
      .range([400, 0]);
  
    // Select all existing bars
    const bars = this.svg.selectAll('rect')
      .data(this.data);
  
    // Exit: Remove bars that don't have data
    bars.exit().remove();
  
    // Enter: Add new bars for new data
    const newBars = bars.enter()
      .append('rect')
      .attr('fill', 'blue');
  
    // Update: Update the position and height of existing bars
    bars.merge(newBars)
      .attr('x', (__: any, i: number) => xScale(i))
      .attr('y', (d: number) => yScale(d))
      .attr('width', barWidth)
      .attr('height', (d: number) => 400 - yScale(d));
    
    this.svg.select('.x-axis')
      .call(d3.axisBottom(xScale));

    this.svg.select('.y-axis')
      .call(d3.axisLeft(yScale));
    
      // Ensure not more than maxBars are displayed
    if (this.data.length > maxBars) {
      this.data.shift();
    }
    
  }  
}

