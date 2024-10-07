const express = require('express');
const { Server, OPEN } = require('ws');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const IDLE_TIMEOUT_MS = 30000;  // Close idle connections after 30 seconds
const BROADCAST_INTERVAL_MS = 1000;  // Send time update every second

const app = express();
app.use(cors());
app.use(express.json());

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

// Store client connection metadata, such as last activity timestamp
const clients = new Map();

// Update message that can be broadcast to clients
let message = new Date().toTimeString();

// Update message through POST request
app.post('/update-message', (req, res) => {
  const { mswa } = req.body;
  message = mswa;  // Update global message

  // Broadcast message to all connected clients
  broadcast({ mswa });

  res.send({ status: `Message updated: ${mswa}` });
});

// Serve index.html
app.use((req, res) => res.sendFile(INDEX, { root: __dirname }));

// Handle WebSocket connection
wss.on('connection', (ws) => {
  // Store the connection with the current timestamp
  const clientMeta = { lastActivity: Date.now() };
  clients.set(ws, clientMeta);

  // Send the initial message upon connection
  ws.send(message);

  // Set up ping-pong to detect dead connections
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
    clients.get(ws).lastActivity = Date.now();  // Update last activity timestamp
  });

  // Handle incoming messages (if any)
  ws.on('message', (message) => {
    clientMeta.lastActivity = Date.now();  // Update last activity on message
    // Process the message as needed (message handling logic goes here)
    console.log(`Received message: ${message}`);
  });

  // Handle connection closure
  ws.on('close', () => {
    clients.delete(ws);  // Remove client from the map
  });

  // Handle errors to prevent crashes
  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
    ws.terminate();
  });
});

// Broadcast message to all active clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Periodically send the current time to all connected clients
setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);

// Clean up idle connections and implement heartbeat
const cleanUpConnections = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) {
      return ws.terminate();  // Close dead connections
    }

    ws.isAlive = false;
    ws.ping();  // Send ping, expecting a pong response

    // Close connections that have been idle for too long
    const clientMeta = clients.get(ws);
    if (clientMeta && Date.now() - clientMeta.lastActivity > IDLE_TIMEOUT_MS) {
      ws.terminate();
    }
  });
}, 10000);  // Run cleanup every 10 seconds

// Gracefully handle server shutdown
process.on('SIGINT', () => {
  console.log("Shutting down server...");
  clearInterval(cleanUpConnections);  // Stop the cleanup interval
  wss.clients.forEach((ws) => ws.terminate());  // Close all WebSocket connections
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
