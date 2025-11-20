import { NextRequest, NextResponse } from 'next/server';
import { ordersStore } from '@/lib/ordersStore';
import { getTicketOwner, isTicketConsumed } from '@/lib/chain';

/**
 * GET /api/tickets/[tokenId]
 * Get ticket status
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await params;

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

    // Get order details
    const order = ordersStore.getOrder(ticket.orderId);

    // Get on-chain status
    const owner = await getTicketOwner(tokenId);
    const consumed = await isTicketConsumed(tokenId);

    return NextResponse.json({
      tokenId: ticket.tokenId,
      owner: owner || ticket.owner,
      consumed,
      metadataUrl: ticket.metadataUrl,
      order: order ? {
        id: order.id,
        items: order.items,
        total: order.total,
        userEmail: order.userEmail,
      } : undefined,
    });
  } catch (error) {
    console.error('Error in /api/tickets/[tokenId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

