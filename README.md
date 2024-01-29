# Assembly Line Efficiency Tool
## I. Abstract
The Assembly Line Efficiency Tool is a project that facilitates accessible and insightful monitoring of assembly line efficiency. Leveraging real-time data from a WebSocket connection, this Angular-based tool visualizes key metrics, such as "Parts Made Per Minute," in a dynamic D3.js-powered chart. The tool is designed for users interested in real-time tracking of manufacturing performance on the assembly line.

## II. Introduction
In manufacturing environments, tracking assembly line efficiency is crucial for optimizing production processes. The Assembly Line Efficiency Tool provides a visual representation of production metrics, enabling quick insights into the performance of the assembly line. By utilizing Angular for the frontend, Socket.IO for real-time communication, and D3.js for dynamic chart rendering, this tool offers a user-friendly interface for monitoring production metrics.

## III. Implementation
Technologies Used
Angular: Frontend framework for building the user interface.
Socket.IO: Enables real-time bidirectional event-based communication.
D3.js: JavaScript library for dynamic data visualization.
### Components
WebSocket Connection
Establishes a WebSocket connection to receive real-time data updates from the server.
Real-time Data Visualization
Utilizes D3.js to dynamically render a bar chart representing "Parts Made Per Minute" over time.

## IV. Usage
Prerequisites
- Android keyboard scanner
- Node.js and npm installed on the machine.
- Angular.js
### Installation
- Clone the repository.
- Navigate to the project directory.
- Add your PostgreSQL URI.
- Run npm install to install dependencies.
- Run ng serve to start the development server.
- Use the PySimpleGUI app to scan a barcode.
### Accessing the Tool
- Open a web browser and navigate to http://localhost:4200/ to access the Assembly Line Efficiency Tool.

## V. Acknowledgments
This project utilizes Angular, Socket.IO, and D3.js, acknowledging the contributions of their respective communities.

## VI. Author
This project was created by Mathieu Poirier
