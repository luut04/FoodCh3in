import { NextRequest, NextResponse } from 'next/server';
import { ordersStore } from '@/lib/ordersStore';
import { uploadOrderMetadata } from '@/lib/arkiv';
import { mintTicket } from '@/lib/chain';
import { Ticket } from '@/types';

/**
 * POST /api/webhooks/crossmint
 * Webhook endpoint for Crossmint payment notifications
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status, checkoutId } = body;

    console.log('[Webhook] Received:', { orderId, status, checkoutId });

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId is required' },
        { status: 400 }
      );
    }

    // Get the order
    const order = ordersStore.getOrder(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Handle payment succeeded
    if (status === 'succeeded') {
      // Update order status
      ordersStore.updateOrder(orderId, {
        status: 'paid',
        paidAt: new Date(),
      });

      // Upload metadata to IPFS/Arkiv
      const tokenURI = await uploadOrderMetadata(order);

      // Mint the ticket NFT
      const { tokenId, txHash } = await mintTicket(order.walletAddress, tokenURI);

      console.log('[Webhook] Minted ticket:', { tokenId, txHash });

      // Update order with token info
      ordersStore.updateOrder(orderId, {
        status: 'minted',
        tokenId,
      });

      // Create ticket record
      const ticket: Ticket = {
        tokenId,
        orderId: order.id,
        owner: order.walletAddress,
        consumed: false,
        metadataUrl: tokenURI,
        createdAt: new Date(),
      };

      ordersStore.createTicket(ticket);

      return NextResponse.json({
        success: true,
        tokenId,
        txHash,
      });
    }

    // Handle payment failed
    if (status === 'failed') {
      ordersStore.updateOrder(orderId, {
        status: 'failed',
      });

      return NextResponse.json({
        success: true,
        message: 'Order marked as failed',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook received',
    });
  } catch (error) {
    console.error('Error in /api/webhooks/crossmint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

