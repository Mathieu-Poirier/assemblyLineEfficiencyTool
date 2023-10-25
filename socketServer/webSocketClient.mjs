import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); 

socket.on('connect', () => {
  console.log('Connected to the server');
});

socket.on('dataUpdate', (data) => {
  console.log('Received updated data:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});
