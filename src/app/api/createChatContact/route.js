import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { VerifyToken } from '@/utils/auth';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await VerifyToken(req);
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    const currentUserId = Number(data.userId);
    const targetUserId = Number(userId);

    if (currentUserId === targetUserId) {
      return NextResponse.json({ message: 'Cannot create chat with yourself' }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
    });

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if contact already exists
    const existingContacts = await prisma.chatContact.findMany({
      where: {
        OR: [
          { user_id: currentUserId, mapped_id: targetUserId },
          { user_id: targetUserId, mapped_id: currentUserId },
        ],
      },
    });

    const userToTargetExists = existingContacts?.find(
      (c) => c.user_id === currentUserId && c.mapped_id === targetUserId
    );
    const targetToUserExists = existingContacts.find(
      (c) => c.user_id === targetUserId && c.mapped_id === currentUserId
    );

    if (userToTargetExists && targetToUserExists) {
      return NextResponse.json(
        { message: 'Chat already exists', data: [userToTargetExists, targetToUserExists] },
        { status: 200 }
      );
    }

    // Create both contacts first without mapped_id
    const contact1 = await prisma.chatContact.create({
      data: {
        name: targetUser.name,
        mobile: targetUser.mobile,
        user_id: currentUserId,
        mapped_id: targetUserId,
      },
    });

    const contact2 = await prisma.chatContact.create({
      data: {
        name: currentUser.name,
        mobile: currentUser.mobile,
        user_id: targetUserId,
        mapped_id: currentUserId,
      },
    });

    // Now update mapped_id for both contacts
    const updatedContact1 = await prisma.chatContact.update({
      where: { id: contact1.id },
      data: { mapped_id: contact2.id },
    });

    const updatedContact2 = await prisma.chatContact.update({
      where: { id: contact2.id },
      data: { mapped_id: contact1.id },
    });

    return NextResponse.json(
      { message: 'Chat started', data: [updatedContact1, updatedContact2] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating chat contacts:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
