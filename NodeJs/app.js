// Base directory global
global.__basedir = __dirname;

const config = require(__basedir + '/config/config.json');
const mysql = require(__basedir + '/model/mysql.js');

const express = require('express');
const http = require('node:http');
const socketIO = require('socket.io');
const crypto = require('node:crypto');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new socketIO.Server(server, { maxHttpBufferSize: 1e8 });

app.use(express.json());
app.use(cors());

// Sockets
const sockets = {};

function getAvailableSocket() {
  if(Object.keys(sockets).length === 0) {
    return null;
  }

  // Get available socekt (Less busy)
  let availableSocket = null;

  for(let key in sockets) {
    if(
      availableSocket === null ||
      sockets[availableSocket].jobs.length > sockets[key].jobs.length
    ) {
      availableSocket = key;
    }
  }

  return availableSocket;
};

// Web requests
app.get('/images', async (req, res) => {
  // Fetch data
  const [rows, fields] = await mysql.query('SELECT id, path FROM images ORDER BY id ASC');

  res.json({images: rows});
});

app.get('/images/:imageId', async (req, res) => {
  // Fetch data
  const [rows, fields] = await mysql.query('SELECT id, path FROM images WHERE id = ?', [req.params.imageId]);

  if(rows === null) {
    res.json({'error': 'Couldn\'t fetch data for the given imageId'});

    return
  }

  const imagePath = rows[0].path;

  // Available socket
  let socketId = getAvailableSocket();
  let jobId = crypto.randomUUID();

  if(socketId === null) {
    res.json({'error': 'No available worker.'})
  } else {
    // Register job
    sockets[socketId].jobs.push(jobId);

    new Promise((resolve, reject) => {
      console.log(`[Socket] (${socketId}) Emit event 'image_placeholder_start'`);
      
      io.to(socketId).emit('image_placeholder_start', {jobId, imageId: req.params.imageId, imagePath});

      sockets[socketId].connection.once('image_placeholder_end', (data) => {
        if(jobId === data.jobId) {
          console.log(`[Socket] (${socketId}) Received event 'image_placeholder_end'`);
          
          resolve(data);
        }
      })
    }).then((response) => {
      // Unregister job
      const index = sockets[socketId].jobs.indexOf(response.jobId);

      if (index > -1) {
        sockets[socketId].jobs.splice(index, 1);
      }

      res.json(response);
    });
  }
});

app.post('/images', async (req, res) => {
  // Fetch data
  const [rows, fields] = await mysql.query('SELECT id, path FROM images WHERE id = ?', [req.body.imageId]);

  if(rows === null) {
    res.json({'error': 'Couldn\'t fetch data for the given imageId'});

    return
  }

  const imagePath = rows[0].path;

  // Available socket
  let socketId = getAvailableSocket();
  let jobId = crypto.randomUUID();

  if(socketId === null) {
    res.json({'error': 'No available worker.'})
  } else {
    // Register job
    sockets[socketId].jobs.push(jobId);

    new Promise((resolve, reject) => {
      console.log(`[Socket] (${socketId}) Emit event 'image_processing_start'`);
      
      // Adjust values of image
      const factor = 54.62;

      req.body.position.x = parseInt(req.body.position.x * factor);
      req.body.position.y = parseInt(req.body.position.y * factor);
      req.body.size.width = parseInt(req.body.size.width * factor);
      req.body.size.height = parseInt(req.body.size.height * factor);

      io.to(socketId).emit('image_processing_start', {jobId, imagePath, ...req.body});

      sockets[socketId].connection.once('image_processing_end', (data) => {
        if(jobId === data.jobId) {
          console.log(`[Socket] (${socketId}) Received event 'image_processing_end'`);
          
          resolve(data);
        }
      })
    }).then((response) => {
      // Unregister job
      const index = sockets[socketId].jobs.indexOf(response.jobId);

      if (index > -1) {
        sockets[socketId].jobs.splice(index, 1);
      }

      res.json(response);
    });
  }
});

// Socket IO
io.on('connection', (socket) => {
  // Handshaking
  socket.on('handshake', (secret) => {
    console.log(`[Socket] (${socket.id}) Handshaking started`);

    if(secret !== config.secret) {
      console.log(`[Socket] (${socket.id}) Handshaking error, secret mismatch`);

      socket.disconnect();

      return;
    }

    // Register socket
    sockets[socket.id] = {
      connection: socket,
      jobs: []
    };

    console.log(`[Socket] (${socket.id}) Successful handshaking, registering connection`);
    socket.emit('handshake_success');
  });

  // Unregister event
  socket.on('disconnect', (reason) => {
    // Unregister socket
    delete sockets[socket.id];

    console.log(`[Socket] (${socket.id}) Unregistering connection`);
  });
});

server.listen(config.server.port, config.server.host, () => {
  console.log(`[Server] Running at http://${config.server.host}:${config.server.port}`);
});
