const express = require('express');
const {Server, OPEN} = require('ws');
const cors = require('cors');

const messages = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
];

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
// const IDLE_TIMEOUT_MS = 30000;  // Close idle connections after 30 seconds
const WALLET_BROADCAST_INTERVAL = 500;
const SEND_DATE_INTERVAL = 10000;

const app = express();
app.use(cors());
app.use(express.json());

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({server});

// Store client connection metadata, such as last activity timestamp
// const clients = new Map();

let isBroadcastingMswa = false; // Flag to control whether to send mswa array
let messageIndex = 0; // Keep track of which wallet to send next

// Update message through POST request (Start sending mswa array)
app.post('/start', (req, res) => {
  const {mswa} = req.body;

  if (mswa === 'start') {
    isBroadcastingMswa = true;  // Start broadcasting mswa array
    res.send({status: 'Started broadcasting mswa data'});
  } else {
    res.status(400).send({status: 'Invalid mswa value'});
  }
});

// Stop sending mswa array
app.post('/stop', (req, res) => {
  const {mswa} = req.body;

  if (mswa === 'stop') {
    isBroadcastingMswa = false;  // Stop broadcasting mswa array
    res.send({status: 'Stopped broadcasting mswa data'});
  } else {
    res.status(400).send({status: 'Invalid mswa value'});
  }
});

// Serve index.html
app.use((req, res) => res.sendFile(INDEX, {root: __dirname}));

// Handle WebSocket connection
wss.on('connection', (ws) => {
  // Store the connection with the current timestamp
  // const clientMeta = { lastActivity: Date.now() };
  // clients.set(ws, clientMeta);

  // Send the initial message upon connection
  ws.send(new Date().toTimeString());

  // If mswa broadcasting is active, start sending wallets to the new client
  if (isBroadcastingMswa) {
    sendNextWallet(ws); // Send next wallet to the new client immediately
  }

  // Set up ping-pong to detect dead connections
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
    // clients.get(ws).lastActivity = Date.now();  // Update last activity timestamp
  });

  // Handle incoming messages (if any)
  ws.on('message', (message) => {
    // clientMeta.lastActivity = Date.now();  // Update last activity on message
    console.log(`Received message: ${message}`);
  });

  // Handle connection closure
  ws.on('close', () => {
    // clients.delete(ws);  // Remove client from the map
  });

  // Handle errors to prevent crashes
  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
    ws.terminate();
  });
});

// Send the next wallet from the array to a specific client
const sendNextWallet = (ws) => {
  if (ws.readyState === OPEN) {
    ws.send(JSON.stringify({mswa: messages[messageIndex]}));
  }
  messageIndex = (messageIndex + 1) % messages.length; // Loop back to start after the last wallet
};

// Broadcast mswa array if broadcasting is enabled
setInterval(() => {
  if (isBroadcastingMswa && messages.length > 0) {
    // Send the next wallet from the array to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === OPEN) {
        sendNextWallet(client);
      }
    });
  }
}, WALLET_BROADCAST_INTERVAL);

// Periodically send the current time to all connected clients
setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState === OPEN) {
      client.send(new Date().toTimeString());  // Send time to all connected clients
    }
  });
}, SEND_DATE_INTERVAL);

// // Clean up idle connections and implement heartbeat
// const cleanUpConnections = setInterval(() => {
//   wss.clients.forEach((ws) => {
//     if (!ws.isAlive) {
//       return ws.terminate();  // Close dead connections
//     }
//
//     ws.isAlive = false;
//     ws.ping();  // Send ping, expecting a pong response
//
//     // Close connections that have been idle for too long
//     const clientMeta = clients.get(ws);
//     if (clientMeta && Date.now() - clientMeta.lastActivity > IDLE_TIMEOUT_MS) {
//       ws.terminate();
//     }
//   });
// }, 15000);  // Run cleanup every 10 seconds

// Gracefully handle server shutdown
// process.on('SIGINT', () => {
//   console.log("Shutting down server...");
//   clearInterval(cleanUpConnections);  // Stop the cleanup interval
//   clearInterval(broadcastMswa);       // Stop the mswa broadcasting interval
//   wss.clients.forEach((ws) => ws.terminate());  // Close all WebSocket connections
//   server.close(() => {
//     console.log("Server closed.");
//     process.exit(0);
//   });
// });
