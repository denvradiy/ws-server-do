import { check, sleep } from 'k6';
import ws from 'k6/ws';

export default function () {
  const url = 'ws://your-websocket-server-url'; // Replace with your WebSocket server URL
  const response = ws.connect(url, {}, function (socket) {
    socket.on('open', function () {
      console.log('Connected to WebSocket server');

      // Example of sending a message
      socket.send(JSON.stringify({ type: 'ping' }));

      // Receiving messages
      socket.on('message', function (msg) {
        console.log(`Received message: ${msg}`);
      });

      // Close the connection after a delay
      sleep(1); // Wait for 1 second before closing
      socket.close();
    });

    socket.on('close', function () {
      console.log('Disconnected from WebSocket server');
    });

    socket.on('error', function (e) {
      console.log(`Error: ${e.error()}`);
    });
  });

  check(response, {
    'is status 101': (r) => r && r.status === 101,
  });
}

export let options = {
  vus: 1000, // Number of virtual users
  duration: '30s', // Duration of the test
};
