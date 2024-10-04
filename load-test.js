import { check } from 'k6';
import ws from 'k6/ws';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 1000 },  // Ramp up to 1000 users in 1 minute
    { duration: '5m', target: 1000 },  // Hold at 1000 users for 5 minutes
    { duration: '1m', target: 0 },     // Ramp down to 0 users
  ],
};

export default function () {
  let url = 'ws://next-client-check.com';
  let res = ws.connect(url, function (socket) {
    socket.on('open', function () {
      console.log('Connected');
      socket.send('Hello WebSocket');
    });

    socket.on('message', function (data) {
      console.log('Received message: ', data);
    });

    socket.on('close', function () {
      console.log('Disconnected');
    });

    socket.on('error', function (e) {
      console.log('WebSocket error: ', e);
    });
  });

  check(res, { 'status is 101': (r) => r && r.status === 101 });
  sleep(1);  // Simulate user waiting for 1 second
}