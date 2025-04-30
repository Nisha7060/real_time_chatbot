import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { VerifyToken } from '@/utils/auth';

const prisma = new PrismaClient();


export async function POST(req) {
    try {
      const userData = await VerifyToken(req); // Authenticated user

      const body = await req.json();

      const {contactId } = body;
  
      if (!contactId) {
        return NextResponse.json({ message: 'Missing contactId' }, { status: 400 });
      }
      
      const contacts = await prisma.chatContact.findMany({
        where:{ 
            id: contactId 
        },
        select: {
          id: true,
          mapped_id: true,
        },
      });
      console.log("<><>>contacts<><>",contacts);
      if (!contacts) {
        return NextResponse.json({ message: 'Missing mapped_id' }, { status: 400 });
      }
      
      const   currect_contact = contacts[0]?.mapped_id; 

      // Fetch all messages between the user and contact (both ways)
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: Number(currect_contact),
              receiverId: contactId,
            },
            {
              senderId: contactId,
              receiverId: Number(currect_contact),
            },
          ],
        },
        orderBy: {
          created_at: 'asc',
        },
      });

      const updatedMessages = messages.map((msg) => ({
        ...msg,
        type: msg.senderId === Number(currect_contact) ? 'Outgoing' : 'Incoming',
      }));
  
      return NextResponse.json(updatedMessages, { status: 200 });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      return NextResponse.json({ message: 'Failed to fetch messages', error: error.message }, { status: 500 });
    }
  }
  