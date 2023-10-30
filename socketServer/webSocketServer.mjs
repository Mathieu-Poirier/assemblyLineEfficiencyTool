import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import pg from 'pg';
import cors from 'cors';


const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
});

app.options('*', cors({ origin: 'http://localhost:4200' }));
app.use(cors());


// Database configuration
const dbConfig = {
  user: 'postgres',
  host: '127.0.0.1',
  database: 'postgres',
  password: 'yo',
  port: 5432,
};

const pool = new pg.Pool(dbConfig);

// WebSocket event to send data to connected clients
function sendUpdatedData(data) {
  io.emit('dataUpdate', data);
}

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('A client connected');
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Listen for PostgreSQL LISTEN/NOTIFY events
pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }

function calculatePartsMadePerMinute(data) {
    const currentTime = new Date().getTime();
    const timeDifference = (currentTime - data.timestamp) / 60000; // Convert to minutes
    const partsMadePerMinute = data.parts_made / timeDifference;
    return partsMadePerMinute;
  }
  

  // Add a listener for the "data_update" channel
  client.query('LISTEN data_update');

  client.on('notification', (notification) => {
    if (notification.channel === 'data_update') {
      // Handle the data update here, fetch the updated data from the database
      // In this example, we query the database for the updated data
      client.query('SELECT parts_made, timestamp FROM efficiency', (err, result) => {
        if (!err && result.rows.length > 0) {
          const updatedData = result.rows[0];
          sendUpdatedData(updatedData);
        }
      });
    }
  });
});

// Your app configuration and routes will go here

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});