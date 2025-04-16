import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { VerifyToken } from '@/utils/auth';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Verify token and get user data (e.g., current logged-in user)
    const data = await VerifyToken(req);

    // Parse request body
    const body = await req.json();
    const { userId } = body;

    // Validate input
    if (!userId) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    // Check if the user being added exists
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Create the contact
    const contact = await prisma.chatContact.create({
      data: {
        name: user.name,
        mobile: user.mobile,
        user_id: Number(data.userId),  // creator's ID
        mapped_id: Number(userId),     // person being added
      },
    });

    return NextResponse.json({message:"Chat Successfully Start..",data:contact}, { status: 201 });

  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ message: 'Error creating contact', error: error.message }, { status: 500 });
  }
}
