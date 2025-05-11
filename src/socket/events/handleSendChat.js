async function handleSendChat({ senderUserId, data, connectedUsers, prisma }) {
    const { recipientUserId, msg, type, media_type = null, uuid } = data;
  
    try {
      // Get recipient's contact (where we save the message)
      const recipientContact = await prisma.chatContact.findUnique({
        where: { id: recipientUserId },
        select: { mapped_id: true ,user_id:true},
      });
  
      if (!recipientContact) {
        console.error('❌ Invalid recipient contact');
        return;
      }
  
      const senderMappedId = recipientContact.mapped_id;
      const senderUser_id = recipientContact.user_id;
  
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
  
      // Update recipient's chatContact
      await prisma.chatContact.update({
        where: { id: recipientUserId },
        data: {
          last_msg: msg,
          last_msg_type: media_type || type,
          last_msg_status: 'read',
          last_msg_time: new Date(),
        },
      });
  
      // Update sender's chatContact (their view of the chat)
      await prisma.chatContact.update({
        where: { id: senderMappedId },
        data: {
          last_msg: msg,
          last_msg_type: media_type || type,
          last_msg_status: 'read',
          unread:{ increment: 1 }, // No unread for sender
          last_msg_time: new Date(),
        },
      });
  
      // Add message direction for recipient
      savedMessage.type = 'Incoming';
  
      // Get sender's user_id to emit the message
      const senderContact = await prisma.chatContact.findFirst({
        where: {
          id: senderMappedId,
        },
        select: {
          user_id: true,
        },
      });
  
      const actualSenderUserId = senderContact?.user_id;
      console.log("<><>senderContact<><>",senderContact)
      // Emit to recipient if online
      const recipientSocket = connectedUsers[actualSenderUserId];
      const senderSocket = connectedUsers[senderUser_id];


      if (recipientSocket) {
        recipientSocket.send(JSON.stringify({
          event: 'Incoming',
          data: savedMessage,
        }));
      }

      if (recipientSocket) {
        senderSocket.send(JSON.stringify(
          {
            event: 'Report',
            data: {
              type:"Report",
              messageId:uuid,
              receiverId:recipientUserId,
              status:"delivered",
            },
          }
        ));
         // Update recipient's chatContact
         await prisma.chatContact.update({
          where: {id:savedMessage?.id },
          data: {
            status:"delivered",
          },
        });

      }
  
      console.log(`📤 Message sent from user_id=${actualSenderUserId} to contact_id=${recipientUserId}`);
    } catch (err) {
      console.error('❌ Error in handleSendChat:', err);
    }
  }
  
  module.exports = { handleSendChat };
