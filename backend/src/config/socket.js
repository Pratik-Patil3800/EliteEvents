const socketIO = require('socket.io');

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    // console.log('Client connected');

    socket.on('joinEvent', (eventId) => {
      socket.join(`event-${eventId}`);
    });

    socket.on('leaveEvent', (eventId) => {
      socket.leave(`event-${eventId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports = initializeSocket;