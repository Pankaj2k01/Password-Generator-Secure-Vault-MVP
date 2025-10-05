import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { AuthUser } from '@/types';

export function withAuth(handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'No token provided' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const user = verifyToken(token);

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }

      return handler(req, user);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}