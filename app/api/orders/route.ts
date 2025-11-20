import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ordersStore } from '@/lib/ordersStore';
import { walletsStore } from '@/lib/walletsStore';
import { createCheckout } from '@/lib/crossmint';
import { Order } from '@/types';

/**
 * POST /api/orders
 * Create a new order and checkout session
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
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    // Get or create wallet for user
    const wallet = walletsStore.getOrCreateWallet(session.user.email);

    // Calculate total
    const total = items.reduce((sum: number, item: any) => sum + item.price, 0);

    // Create order
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const order: Order = {
      id: orderId,
      userId: session.user.id || session.user.email,
      userEmail: session.user.email,
      walletAddress: wallet.address,
      items,
      total,
      status: 'pending',
      createdAt: new Date(),
    };

    ordersStore.createOrder(order);

    // Create checkout session
    const checkout = await createCheckout(order);

    // Update order with checkout info
    ordersStore.updateOrder(orderId, {
      checkoutId: checkout.checkoutId,
    });

    return NextResponse.json({
      orderId: order.id,
      checkoutId: checkout.checkoutId,
      checkoutUrl: checkout.checkoutUrl,
      total: order.total,
    });
  } catch (error) {
    console.error('Error in /api/orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders?orderId=xxx
 * Get order details
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

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId is required' },
        { status: 400 }
      );
    }

    const order = ordersStore.getOrder(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify user owns this order
    if (order.userEmail !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error in /api/orders GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

