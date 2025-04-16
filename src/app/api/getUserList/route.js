import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // assuming prisma client is exported from here
import { VerifyToken } from '@/utils/auth';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req) {
  try {

    const data = await VerifyToken(req);

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: Number(data.userId),
        },
      },
      select: {
        id: true,
        name: true,
        mobile: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('[GET_CONTACTS_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch contacts' }, { status: 500 });
  }
}
