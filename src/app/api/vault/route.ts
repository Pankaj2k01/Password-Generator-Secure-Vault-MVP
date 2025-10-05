import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { withAuth } from '@/lib/authMiddleware';

// GET - Fetch all vault items for a user
export const GET = withAuth(async (req: NextRequest, user) => {
  try {
    const client = await clientPromise;
    const db = client.db('password-vault');
    const vaultItems = db.collection('vault_items');

    const items = await vaultItems.find({ userId: user.id }).toArray();

    return NextResponse.json({
      success: true,
      items: items.map(item => ({
        _id: item._id.toString(),
        userId: item.userId,
        encryptedData: item.encryptedData,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Fetch vault items error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vault items' },
      { status: 500 }
    );
  }
});

// POST - Create a new vault item
export const POST = withAuth(async (req: NextRequest, user) => {
  try {
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

    const result = await vaultItems.insertOne({
      userId: user.id,
      encryptedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const now = new Date();

    return NextResponse.json({
      success: true,
      item: {
        _id: result.insertedId.toString(),
        userId: user.id,
        encryptedData,
        createdAt: now,
        updatedAt: now,
      },
    });
  } catch (error) {
    console.error('Create vault item error:', error);
    return NextResponse.json(
      { error: 'Failed to create vault item' },
      { status: 500 }
    );
  }
});