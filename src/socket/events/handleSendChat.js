async function handleSendChat({ senderUserId, data, connectedUsers, prisma }) {
    const { recipientUserId, msg, type, media_type = null, uuid } = data;
  
    try {
      // Get contact mapping for recipient
      const recipientContact = await prisma.chatContact.findUnique({
        where: { id: recipientUserId },
        select: { mapped_id: true },
      });
  
      if (!recipientContact) {
        console.error('❌ Invalid recipient contact');
        return;
      }
  
      const senderMappedId = recipientContact.mapped_id;
  
      // Save message
      const savedMessage = await prisma.message.create({
        data: {
          msg,
          type,
          msg_type: media_type,
          uuid,
          senderId: senderMappedId,
          receiverId: recipientUserId,
        },
      });
  
      // Add message direction for client
      savedMessage.type = 'Incoming';
  
      // Lookup sender's user_id based on senderId
      const senderContact = await prisma.chatContact.findFirst({
        where: {
          id: senderMappedId,
        },
        select: {
          user_id: true,
        },
      });
  
      const actualSenderUserId = senderContact?.user_id;
  
      // Emit to recipient if online
      const recipientSocket = connectedUsers[actualSenderUserId];
      if (recipientSocket) {
        recipientSocket.send(JSON.stringify({
          event: 'Incoming',
          data: savedMessage,
        }));
      }
  
      console.log(`📤 Message sent from user_id=${actualSenderUserId} to contact_id=${recipientUserId}`);
    } catch (err) {
      console.error('❌ Error in handleSendChat:', err);
    }
  }
  
  module.exports = { handleSendChat };
  