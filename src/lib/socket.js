// /lib/socket.js
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    const io = new Server(res.socket.server, {
      path: '/api/socket_io',
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('send_message', async ({ senderId, receiverId, content, mediaUrl, mediaType }) => {
        try {
          const message = await prisma.message.create({
            data: {
              senderId,
              receiverId,
              content,
              mediaUrl,
              mediaType,
            },
          });

          await prisma.user.update({
            where: { id: receiverId },
            data: {
              lastMessage: content || mediaUrl,
              lastMessageType: mediaType || 'TEXT',
              messageCount: { increment: 1 },
            },
          });

          io.to(receiverId).emit('receive_message', message);
        } catch (error) {
          console.error('Message send error:', error);
        }
      });

      socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
      });
    });
  }
  res.end();
}

// /pages/api/socket_io.js
export { default } from '@/lib/socket';
