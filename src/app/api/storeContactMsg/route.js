import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { VerifyToken } from '@/utils/auth';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const userData = await VerifyToken(req); // Authenticated user
    const body = await req.json();
    const { receiverId, content, mediaUrl, mediaType } = body;

    const message = await prisma.message.create({
      data: {
        senderId: Number(userData.userId),
        receiverId: Number(receiverId),
        content,
        mediaUrl,
        mediaType,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Message creation failed:', error);
    return NextResponse.json({ message: 'Message creation failed', error: error.message }, { status: 500 });
  }
}
