import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { walletsStore } from '@/lib/walletsStore';

/**
 * POST /api/auth/wallet
 * Get or create a wallet for the authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const wallet = walletsStore.getOrCreateWallet(session.user.email);

    return NextResponse.json({
      walletAddress: wallet.address,
      email: wallet.email,
    });
  } catch (error) {
    console.error('Error in /api/auth/wallet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/wallet
 * Get wallet for the authenticated user (if exists)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const wallet = walletsStore.getWallet(session.user.email);

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      walletAddress: wallet.address,
      email: wallet.email,
    });
  } catch (error) {
    console.error('Error in /api/auth/wallet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

