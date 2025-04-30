const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { handleEventFromClient } = require('./eventHandlers');

const prisma = new PrismaClient();

const JWT_SECRET = "96f942a5a819f24570cb79883f9243059fd280da8496af687fccdaf1ef082edbd79c30e70a3c7f21dad0e71365fff86d712ee5ccde74d82670d9e8721bbd59f2";

let wss;
let connectedUsers = {}; // { userId: ws }

function createWebSocketServer(server) {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('🔵 New client connected');
    let userId = null;
    ws.on('message', async (message) => {
      try {
        const parsed = JSON.parse(message);
        console.log("<><><parsed><><>",parsed);
        console.log("<><><userId><><>",userId);

        // Register event: authenticates the user via JWT
        if (parsed?.event_name === 'register') {
          const token = parsed.data?.token;
          if (token) {
            try {
              const decoded = jwt.verify(token, JWT_SECRET);
              userId = decoded.userId;

              if (userId) {
                connectedUsers[userId] = ws;
                console.log(`📝 Registered user: ${userId}`);

                ws.send(JSON.stringify({
                  event: 'connected',
                  data: { userId }
                }));
              } else {
                ws.send(JSON.stringify({ event: 'error', data: { message: 'Invalid token' } }));
              }
            } catch (err) {
              console.error('❌ JWT verification failed:', err);
              ws.send(JSON.stringify({ event: 'error', data: { message: 'Invalid token' } }));
            }
          } else {
            ws.send(JSON.stringify({ event: 'error', data: { message: 'Token missing' } }));
          }
        }

        // Handle all other custom events
        else if (userId) {
          await handleEventFromClient(ws, userId, parsed, connectedUsers, prisma);
        } else {
          ws.send(JSON.stringify({ event: 'error', data: { message: 'User not registered' } }));
        }
      } catch (err) {
        console.error('❌ Failed to parse incoming message:', err);
        ws.send(JSON.stringify({ event: 'error', data: { message: 'Malformed message' } }));
      }
    });

    ws.on('close', () => {
      console.log('🔴 Client disconnected');
      if (userId && connectedUsers[userId]) {
        delete connectedUsers[userId];
        console.log(`🗑️ Removed user: ${userId}`);
      }
    });
  });
}

// Send custom events to specific users
function sendEventToUser(userId, event, data) {
  const ws = connectedUsers[userId];
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify({ event, data }));
  }
}

module.exports = {
  createWebSocketServer,
  sendEventToUser,
  connectedUsers, // Optional: expose if you want to access externally
};
