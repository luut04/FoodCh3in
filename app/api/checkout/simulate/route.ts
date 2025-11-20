import { NextResponse } from 'next/server';
import { ordersStore } from '@/lib/ordersStore';
import { Ticket } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, checkoutId } = body;

    // 1. Validamos que la orden exista
    const order = ordersStore.getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. SIMULACIÓN DE INFRAESTRUCTURA (Crossmint + Arkiv)
    const mockTokenId = "NFT-" + Math.floor(Math.random() * 100000);
    const mockArkivLink = `arkiv://orders/${orderId}/proof`;
    const mockWallet = "0x" + Math.random().toString(16).slice(2, 40); // Wallet simulada del usuario

    // 3. ACTUALIZAMOS LA ORDEN (Usando tu método updateOrder)
    ordersStore.updateOrder(orderId, {
      status: 'minted',
      tokenId: mockTokenId,
      paidAt: new Date()
    });

    // 4. CREAMOS EL TICKET (Usando tu método createTicket)
    // ¡Esto es crucial! Si no creamos el ticket aquí, la página siguiente dará error.
    const newTicket: Ticket = {
      tokenId: mockTokenId,
      orderId: orderId,
      owner: order.walletAddress || mockWallet,
      consumed: false,
      metadataUrl: mockArkivLink,
      createdAt: new Date()
    };

    ordersStore.createTicket(newTicket);

    console.log(`✅ Ticket creado: ${mockTokenId} para Orden: ${orderId}`);

    return NextResponse.json({ 
      success: true, 
      tokenId: mockTokenId 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}
