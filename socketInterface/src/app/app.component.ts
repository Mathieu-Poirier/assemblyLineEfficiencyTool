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

    const margin = { top: 40, right: 20, bottom: 50, left: 50 };
    const marginTitle = { top: 200 }; // Adjust this margin for the title
    const width = 700 
    const height = 500

    const svg = d3.select(element)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom + marginTitle.top)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top + marginTitle.top})`);


    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', -marginTitle.top / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white') // Set text color to white
      .style('font-size', '1.5em')
      .style('font-weight', 'bold')
      .style('font-family', 'sans-serif') // Replace 'Your Modern Font' with the desired font
      .text('Parts Made Per Minute');

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
      .attr('fill', 'orange');
  
    // Update: Update the position and height of existing bars
    bars.merge(newBars)
      .transition()
      .duration(200) // Set the duration of the transition (in milliseconds)
      .ease(d3.easeCubicInOut) // Set easing function (e.g., bounceOut)
      .attr('x', (__: any, i: number) => xScale(i))
      .attr('y', (d: number) => yScale(d))
      .attr('width', barWidth)
      .attr('height', (d: number) => 400 - yScale(d));
    
    const textLabels = this.svg.selectAll('.bar-label')
      .data(this.data);
  
    textLabels.exit().remove(); // Remove text labels for bars that don't have data
  
    textLabels.enter()
    .append('text')
    .attr('class', 'bar-label')
    .attr('fill', 'white')
    .attr('text-anchor', 'middle')
    .attr('x', (__: any, i: number) => xScale(i) + barWidth / 2)
    .attr('y', (d: number) => yScale(d) - 5) // Adjust this value to control the distance from the top of the bar
    .text((d: number) => Math.round(d).toString());

  // Update: Update the position of text labels
  textLabels.transition()
    .duration(200)
    .ease(d3.easeCubicInOut)
    .attr('x', (__: any, i: number) => xScale(i) + barWidth / 2)
    .attr('y', (d: number) => yScale(d) - 5) // Update the y-position based on yScale
    .text((d: number) => Math.round(d).toString()); // Display rounded parts made per minute values
  
    
      // Ensure not more than maxBars are displayed
    if (this.data.length > maxBars) {
      this.data.shift();
    }
  }  
}

