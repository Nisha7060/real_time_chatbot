import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { VerifyToken } from '@/utils/auth';

const prisma = new PrismaClient();

// GET /api/chat-contact
export async function GET(req) {
  try {
    // Verify user from token (assuming userId is returned)
    const data = await VerifyToken(req);
    const userId = Number(data.userId);

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all chat contacts for this user
    const contacts = await prisma.chatContact.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        updated_at: 'desc',
      },
      select: {
        id: true,
        name: true,
        mobile: true,
        lastMessage: true,
        lastMessageType: true,
        messageCount: true,
        created_at: true,
        updated_at: true,
        mapped_id: true,
      },
    });

    return NextResponse.json(contacts, { status: 200 });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ message: 'Failed to fetch contacts', error: error.message }, { status: 500 });
  }
}
