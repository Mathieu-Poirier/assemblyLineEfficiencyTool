import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); 

socket.on('connect', () => {
  console.log('Connected to the server');
});

let previousData = null; // Variable to store the previous data

socket.on('dataUpdate', (data) => {
  console.log('Received updated data:', data);

  // Check if this is the first update or if timestamp is null
  if (!previousData || data.timestamp === null) {
    console.log('Parts Made Per Minute: null');
  } else {
    const partsDifference = data.parts_made - previousData.parts_made;
    const timeDifference = (new Date(data.timestamp) - new Date(previousData.timestamp)) / 60000; // Convert to minutes
    const partsMadePerMinute = partsDifference / timeDifference;
    console.log('Parts Made Per Minute:', partsMadePerMinute);
  }

  previousData = data; // Update the previous data for the next calculation
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});
