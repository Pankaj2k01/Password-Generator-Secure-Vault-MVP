import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { withAuth } from '@/lib/authMiddleware';
import { ObjectId } from 'mongodb';

// PUT - Update a vault item
export const PUT = withAuth(async (req: NextRequest, user) => {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const { encryptedData } = await req.json();

    if (!encryptedData) {
      return NextResponse.json(
        { error: 'Encrypted data is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('password-vault');
    const vaultItems = db.collection('vault_items');

    const result = await vaultItems.updateOne(
      { _id: new ObjectId(id), userId: user.id },
      {
        $set: {
          encryptedData,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Item not found or not authorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item updated successfully',
    });
  } catch (error) {
    console.error('Update vault item error:', error);
    return NextResponse.json(
      { error: 'Failed to update vault item' },
      { status: 500 }
    );
  }
});

// DELETE - Delete a vault item
export const DELETE = withAuth(async (req: NextRequest, user) => {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('password-vault');
    const vaultItems = db.collection('vault_items');

    const result = await vaultItems.deleteOne({
      _id: new ObjectId(id),
      userId: user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Item not found or not authorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('Delete vault item error:', error);
    return NextResponse.json(
      { error: 'Failed to delete vault item' },
      { status: 500 }
    );
  }
});