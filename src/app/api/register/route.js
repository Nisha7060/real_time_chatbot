// /app/api/auth/register/route.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  const { name, mobile, password, confirmPassword } = await req.json();

  if (password !== confirmPassword) {
    return Response.json({ error: 'Passwords do not match' }, { status: 400 });
  }

  const userExists = await prisma.user.findUnique({ where: { mobile } });
  if (userExists) {
    return Response.json({ error: 'Mobile already registered' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, mobile, password: hashedPassword },
  });

  return Response.json({ message: 'User registered successfully', user });
}