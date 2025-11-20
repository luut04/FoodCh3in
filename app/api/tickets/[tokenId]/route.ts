import { NextResponse } from 'next/server';
import { ordersStore } from '@/lib/ordersStore';
import { TicketStatus } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { tokenId: string } }
) {
  const tokenId = params.tokenId;

  // 1. Buscamos el Ticket usando TU store
  const ticket = ordersStore.getTicket(tokenId);

  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  // 2. Buscamos la Orden asociada para tener los detalles (hamburguesa, precio, etc)
  const order = ordersStore.getOrder(ticket.orderId);

  // 3. Construimos la respuesta 'TicketStatus' que espera tu frontend
  const responseData: TicketStatus = {
    tokenId: ticket.tokenId,
    owner: ticket.owner,
    consumed: ticket.consumed,
    metadataUrl: ticket.metadataUrl,
    order: order // Si la orden existe, se envía completa, si no undefined
  };

  return NextResponse.json(responseData);
}
