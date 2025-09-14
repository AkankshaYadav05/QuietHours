import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth.js';
import { createQuietBlock, getUserQuietBlocks } from '../../../lib/services/quietBlocks.js';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const blocks = await getUserQuietBlocks(user.userId);
    return NextResponse.json({ blocks });
  } catch (error) {
    console.error('Get blocks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { title, description, startTime, endTime } = await request.json();

    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Title, start time, and end time are required' },
        { status: 400 }
      );
    }

    const block = await createQuietBlock(user.userId, {
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    return NextResponse.json({ block });
  } catch (error) {
    console.error('Create block error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}