// ws/events/handleReport.js

async function handleReport({ userId, data, connectedUsers, prisma }) {
    const { messageId,receiverId,senderId, status } = data;
  
    try {
      const updated = await prisma.message.update({
        where: { id: parseInt(messageId) },
        data: { status }, // assume a 'status' field exists
      });
  
      // Notify sender if online
      const senderSocket = connectedUsers[updated.senderId];
      if (senderSocket) {
        senderSocket.send(JSON.stringify({
          event: 'Report',
          data: {
            type:"Report",
            messageId:updated.uuid,
            receiverId,
            status,
          },
        }));
      }
  
      console.log(`✅ Message status updated for ${messageId}`);
    } catch (err) {
      console.error('❌ Error updating message status:', err);
    }
  }
  
  module.exports = { handleReport };
  