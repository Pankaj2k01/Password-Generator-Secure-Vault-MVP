import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hashPassword, validateEmail, validatePassword, generateToken } from '@/lib/auth';
import { generateSalt } from '@/lib/encryption';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long and contain at least one letter and one number' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('password-vault');
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password and generate salt for encryption
    const hashedPassword = await hashPassword(password);
    const encryptionSalt = generateSalt();

    // Create user
    const result = await users.insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      encryptionSalt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userId = result.insertedId.toString();
    const token = generateToken({ id: userId, email: email.toLowerCase() });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: userId,
        email: email.toLowerCase(),
      },
      encryptionSalt,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}