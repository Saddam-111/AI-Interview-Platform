const connectedUsers = new Map();
const interviewRooms = new Map();

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('authenticate', (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;
      console.log(`User ${userId} authenticated`);
    });

    socket.on('join-interview', (interviewId) => {
      socket.join(`interview-${interviewId}`);
      
      if (!interviewRooms.has(interviewId)) {
        interviewRooms.set(interviewId, new Set());
      }
      interviewRooms.get(interviewId).add(socket.id);
      
      socket.to(`interview-${interviewId}`).emit('user-joined', {
        socketId: socket.id,
        users: interviewRooms.get(interviewId).size
      });
    });

    socket.on('leave-interview', (interviewId) => {
      socket.leave(`interview-${interviewId}`);
      
      if (interviewRooms.has(interviewId)) {
        interviewRooms.get(interviewId).delete(socket.id);
      }

      socket.to(`interview-${interviewId}`).emit('user-left', {
        socketId: socket.id,
        users: interviewRooms.get(interviewId)?.size || 0
      });
    });

    socket.on('start-recording', (data) => {
      const { interviewId, stream } = data;
      socket.to(`interview-${interviewId}`).emit('recording-started', {
        timestamp: Date.now()
      });
    });

    socket.on('recording-data', (data) => {
      const { interviewId, chunk } = data;
      socket.to(`interview-${interviewId}`).emit('recording-chunk', {
        chunk,
        timestamp: Date.now()
      });
    });

    socket.on('behavior-event', (data) => {
      const { interviewId, event, details } = data;
      io.to(`interview-${interviewId}`).emit('behavior-update', {
        userId: socket.userId,
        event,
        details,
        timestamp: Date.now()
      });
    });

    socket.on('tab-switch', (data) => {
      const { interviewId } = data;
      io.to(`interview-${interviewId}`).emit('tab-switch-detected', {
        userId: socket.userId,
        timestamp: Date.now()
      });
    });

    socket.on('voice-data', (data) => {
      const { interviewId, transcript } = data;
      socket.to(`interview-${interviewId}`).emit('voice-transcript', {
        userId: socket.userId,
        transcript,
        timestamp: Date.now()
      });
    });

    socket.on('code-change', (data) => {
      const { interviewId, code, language } = data;
      socket.to(`interview-${interviewId}`).emit('code-update', {
        userId: socket.userId,
        code,
        language,
        timestamp: Date.now()
      });
    });

    socket.on('submit-answer', (data) => {
      const { interviewId, answer } = data;
      io.to(`interview-${interviewId}`).emit('answer-submitted', {
        userId: socket.userId,
        answer,
        timestamp: Date.now()
      });
    });

    socket.on('next-question', (data) => {
      const { interviewId, questionIndex } = data;
      io.to(`interview-${interviewId}`).emit('question-changed', {
        questionIndex,
        timestamp: Date.now()
      });
    });

    socket.on('interview-complete', (data) => {
      const { interviewId } = data;
      io.to(`interview-${interviewId}`).emit('interview-ended', {
        timestamp: Date.now()
      });
    });

    socket.on('request-help', (data) => {
      const { interviewId } = data;
      io.to(`interview-${interviewId}`).emit('help-requested', {
        userId: socket.userId,
        timestamp: Date.now()
      });
    });

    socket.on('ping-interview', (data) => {
      const { interviewId } = data;
      socket.to(`interview-${interviewId}`).emit('pong-interview', {
        timestamp: Date.now()
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
      }

      interviewRooms.forEach((users, interviewId) => {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          io.to(`interview-${interviewId}`).emit('user-left', {
            socketId: socket.id,
            users: users.size
          });
        }
      });
    });
  });

  return io;
};

export const sendToUser = (io, userId, event, data) => {
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

export const broadcastToInterview = (io, interviewId, event, data) => {
  io.to(`interview-${interviewId}`).emit(event, data);
};