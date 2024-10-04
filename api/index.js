const express = require('express');
const {Server, OPEN} = require('ws');
const cors = require('cors');  // Import the cors package

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const app = express();
app.use(cors());  // Allow all origins by default
app.use(express.json());  // To parse JSON request bodies

app.post('/update-message', (req, res) => {
  const {mswa} = req.body;
  message = mswa;

  wss.clients.forEach(client => {
    if (client.readyState === OPEN) {
      client.send(JSON.stringify({mswa: mswa}));
    }
  });

  res.send({status: `Message updated: ${mswa}`});
});

app.use((req, res) => res.sendFile(INDEX, {root: __dirname}));

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({server});

let message = "Default message";

wss.on('connection', (ws) => {
  ws.send(message);

  ws.on('message', (data) => {
    message = data;
    wss.clients.forEach(client => {
      if (client.readyState === OPEN) {
        client.send(message);
      }
    });
  });
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);