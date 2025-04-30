// ws/eventHandlers.js

const { handleSendChat } = require('./events/handleSendChat');
const { handleReadChat } = require('./events/handleReadChat');
const { handleReport } = require('./events/handleReport');

function handleEventFromClient(ws, userId, message, connectedUsers, prisma) {
  const { event_name, event_data } = message;

  switch (event_name) {
    case 'ping':
      ws.send(JSON.stringify({ event: 'pong', data: { message: 'pong' } }));
      break;

    case 'SendChat':
      handleSendChat({ senderUserId: userId, data: event_data, connectedUsers, prisma });
      break;

    case 'ReadChat':
      handleReadChat({ userId, data: event_data, prisma });
      break;

    case 'Report':
      handleReport({ userId, data: event_data, connectedUsers, prisma });
      break;

    default:
      ws.send(JSON.stringify({ event: 'error', data: { message: 'Unknown event' } }));
  }
}

module.exports = { handleEventFromClient };
