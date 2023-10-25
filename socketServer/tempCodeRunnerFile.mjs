import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import pg from 'pg';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

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

  // Add a listener for the "data_update" channel
  client.query('LISTEN data_update');

  client.on('notification', (notification) => {
    if (notification.channel === 'data_update') {
      // Handle the data update here, fetch the updated data from the database
      // In this example, we query the database for the updated data
      client.query('SELECT parts_made FROM efficiency', (err, result) => {
        if (!err) {
          sendUpdatedData(result.rows[0]);
        }
      });
    }
  });
});

// Your app configuration and routes will go here