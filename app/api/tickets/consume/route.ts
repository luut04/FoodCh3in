import { NextRequest, NextResponse } from 'next/server';
import { ordersStore } from '@/lib/ordersStore';
import { consumeTicket } from '@/lib/chain';
import { markTicketConsumed } from '@/lib/arkiv';

/**
 * POST /api/tickets/consume
 * Mark a ticket as consumed
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tokenId } = body;

    if (!tokenId) {
      return NextResponse.json(
        { error: 'tokenId is required' },
        { status: 400 }
      );
    }

    // Get ticket from store
    const ticket = ordersStore.getTicket(tokenId);

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Check if already consumed
    if (ticket.consumed) {
      return NextResponse.json(
        { error: 'Ticket already consumed' },
        { status: 400 }
      );
    }

    // Mark as consumed on-chain
    const { txHash } = await consumeTicket(tokenId);

    // Mark as consumed in Arkiv
    await markTicketConsumed(tokenId);

    // Update ticket in store
    ordersStore.updateTicket(tokenId, {
      consumed: true,
      consumedAt: new Date(),
    });

    console.log('[Consume] Ticket consumed:', { tokenId, txHash });

    return NextResponse.json({
      success: true,
      tokenId,
      consumed: true,
      txHash,
    });
  } catch (error) {
    console.error('Error in /api/tickets/consume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

