import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth.js';
import { deleteQuietBlock } from '../../../../lib/services/quietBlocks.js';

export async function DELETE(request, { params }) {
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

    const success = await deleteQuietBlock(user.userId, params.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete block error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}