import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/mongodb.js';
import { hashPassword, generateToken } from '../../../../lib/auth.js';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await users.insertOne(user);
    const userId = result.insertedId.toString();

    // Generate token
    const token = generateToken({
      userId,
      email,
      name,
    });

    return NextResponse.json({
      token,
      user: { userId, email, name },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}