// ws/events/handleReadChat.js

async function handleReadChat({ userId, data, prisma }) {
    const { senderId } = data; // contactId is the other user
  
    try {
      // Reset unread message count (example assumes such a table/field exists)
      await prisma.chatContact.updateMany({
        where: {
          id: parseInt(senderId),
        },
        data: {
          unread: 0,
        },
      });
  
      console.log(`✅ ReadChat: messageCount reset for ${userId} with ${senderId}`);
    } catch (err) {
      console.error('❌ Error updating messageCount:', err);
    }
  }
  
  module.exports = { handleReadChat };
  