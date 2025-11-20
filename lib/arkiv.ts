import { NextResponse } from 'next/server';
import { ordersStore } from '@/lib/ordersStore';
import { uploadOrderMetadata } from '@/lib/arkiv'; // <--- Usamos el simulador de Arkiv
import { Ticket } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body; // Solo necesitamos el ID de la orden

    console.log(`💳 [SIMULATION] Iniciando Checkout para Orden: ${orderId}`);

    // 1. BUSCAR: ¿Existe la orden?
    const order = ordersStore.getOrder(orderId);
    if (!order) {
      console.error(" Orden no encontrada");
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. ARKIV: Subimos los datos (Simulado)
    // Esto llama al archivo lib/arkiv.ts y espera 150ms
    const arkivURI = await uploadOrderMetadata(order);
    console.log(`🗄️ [ARKIV] Metadata guardada: ${arkivURI}`);

    // 3. CROSSMINT: Generamos IDs falsos (Simulado)
    const mockTokenId = "NFT-" + Math.floor(Math.random() * 100000);
    const mockWallet = "0x" + Math.random().toString(16).slice(2, 40); 

    // 4. ACTUALIZAR: Marcamos la orden como pagada en memoria
    ordersStore.updateOrder(orderId, {
      status: 'minted',
      tokenId: mockTokenId,
      paidAt: new Date()
    });

    // 5. CREAR TICKET: Guardamos el ticket en memoria para la próxima pantalla
    const newTicket: Ticket = {
      tokenId: mockTokenId,
      orderId: orderId,
      owner: order.walletAddress || mockWallet,
      consumed: false,
      metadataUrl: arkivURI, // <--- Guardamos el link de Arkiv
      createdAt: new Date()
    };

    ordersStore.createTicket(newTicket);

    console.log(` [SUCCESS] Ticket creado: ${mockTokenId}`);

    // 6. RESPONDER: Le decimos al frontend "Todo OK"
    return NextResponse.json({ 
      success: true, 
      tokenId: mockTokenId 
    });

  } catch (error) {
    console.error("Error en simulación:", error);
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}

