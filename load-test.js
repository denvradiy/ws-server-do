import { check, sleep } from 'k6';
import ws from 'k6/ws';

export default function () {
  const url = 'wss://next-client-check.com'; // Replace with your WebSocket server URL
  const response = ws.connect(url, {}, function (socket) {
    socket.on('open', function () {
      console.log('Connected to WebSocket server');

      // Example of sending a message
      socket.send(JSON.stringify({ type: 'ping' }));

      // Receiving messages
      socket.on('message', function (msg) {
      });

      // // Hold the connection for 3 minutes (180 seconds)
      // sleep(120);
      //
      // socket.close(); // Close connection after the hold time
    });

    socket.on('close', function () {
      console.log('Disconnected from WebSocket server');
    });

    socket.on('error', function (e) {
      console.log(`Error: ${e.message}`);
    });
  });

  check(response, {
    'is status 101': (r) => r && r.status === 101,
  });
}

// Load test configuration
export let options = {
  stages: [
    { duration: '1m', target: 3800 }, // Instantaneously ramp up to 1000 users
    { duration: '2m', target: 3800 },  // Hold 1000 users for 3 minutes
    { duration: '1m', target: 0 },     // Ramp down to 0 users in 1 minute
  ],
};
