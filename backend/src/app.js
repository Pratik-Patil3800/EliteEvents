require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/database');
const initializeSocket = require('./config/socket');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

app.set('io', io);

app.use(cors({
  origin: [
    'https://elite-events-cyan.vercel.app',
    'http://elite-events-cyan.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

  app.use(express.json());
  

  app.use('/api/auth', authRoutes);
  app.use('/api/events', eventRoutes);
  

  connectDB();
  
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  module.exports = app;