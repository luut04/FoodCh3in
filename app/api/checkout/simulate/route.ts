import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/checkout/simulate
 * Simulate a successful payment (triggers webhook internally)
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

    const body = await req.json();
    const { orderId, checkoutId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId is required' },
        { status: 400 }
      );
    }

    // Simulate payment by calling the webhook endpoint
    const webhookUrl = new URL('/api/webhooks/crossmint', req.url);
    const webhookResponse = await fetch(webhookUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        checkoutId,
        status: 'succeeded',
        timestamp: new Date().toISOString(),
      }),
    });

    const webhookData = await webhookResponse.json();

    if (!webhookResponse.ok) {
      throw new Error('Webhook failed: ' + JSON.stringify(webhookData));
    }

    return NextResponse.json({
      success: true,
      tokenId: webhookData.tokenId,
      message: 'Payment simulated successfully',
    });
  } catch (error) {
    console.error('Error in /api/checkout/simulate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

