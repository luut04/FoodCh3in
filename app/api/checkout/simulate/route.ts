import { NextResponse } from 'next/server';
import { ordersStore } from '@/lib/ordersStore';
import { uploadOrderMetadata } from '@/lib/arkiv';
import { Ticket } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, checkoutId } = body;

    console.log(`💳 Iniciando Checkout para Orden: ${orderId}`);

    // 1. Validamos que la orden exista en nuestra memoria
    const order = ordersStore.getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. ARKIV: Subimos los datos y obtenemos el link inmutable
    // Usamos el archivo arkiv.ts en lugar de hardcodear
    const arkivURI = await uploadOrderMetadata(order);
    console.log(`🗄️ Datos guardados en Arkiv: ${arkivURI}`);

    // 3. CROSSMINT: Simulamos que creamos el NFT
    const mockTokenId = "NFT-" + Math.floor(Math.random() * 100000);
    const mockWallet = "0x" + Math.random().toString(16).slice(2, 40); 

    // 4. ACTUALIZAMOS LA ORDEN (Pagada y Minteada)
    ordersStore.updateOrder(orderId, {
      status: 'minted',
      tokenId: mockTokenId,
      paidAt: new Date()
    });

    // 5. CREAMOS EL TICKET (La prueba de propiedad)
    const newTicket: Ticket = {
      tokenId: mockTokenId,
      orderId: orderId,
      owner: order.walletAddress || mockWallet,
      consumed: false,
      metadataUrl: arkivURI, // <--- Guardamos el link
      createdAt: new Date()
    };

    ordersStore.createTicket(newTicket);

    console.log(`✅ Ticket creado exitosamente: ${mockTokenId}`);

    return NextResponse.json({ 
      success: true, 
      tokenId: mockTokenId 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}
