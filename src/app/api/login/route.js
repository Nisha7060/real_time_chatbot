// /app/api/auth/login/route.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req) {
  const { mobile, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { mobile } });
  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign({ userId: user.id, username: user.mobile }, process.env.AUTH_SECRET, { expiresIn: '1D' });

  return Response.json({ message: 'Login successful', user ,token:token});
}