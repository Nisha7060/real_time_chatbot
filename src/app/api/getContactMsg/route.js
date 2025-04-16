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
  
      // Fetch all messages between the user and contact (both ways)
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: Number(userData.userId),
              receiverId: contactId,
            },
            {
              senderId: contactId,
              receiverId: Number(userData.userId),
            },
          ],
        },
        orderBy: {
          created_at: 'asc',
        },
      });
  
      return NextResponse.json(messages, { status: 200 });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      return NextResponse.json({ message: 'Failed to fetch messages', error: error.message }, { status: 500 });
    }
  }
  