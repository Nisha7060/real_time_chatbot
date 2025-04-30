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
    const userMobile = Number(data.username);

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all chat contacts for this user
    const contacts = await prisma.chatContact.findMany({
      where: {
        OR: [
          { user_id: userId },
        ],
        NOT: {
          mobile: userMobile.toString(), // replace `userMobile` with the mobile you want to exclude
        }
      },
      orderBy: {
        updated_at: 'desc',
      }
    });

    return NextResponse.json(contacts, { status: 200 });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ message: 'Failed to fetch contacts', error: error.message }, { status: 500 });
  }
}
