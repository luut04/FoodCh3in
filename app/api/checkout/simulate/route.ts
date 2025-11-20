import { NextResponse } from 'next/server';
import { ordersStore } from '@/lib/ordersStore';
import { uploadOrderMetadata } from '@/lib/arkiv'; 
import { Ticket, Order } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    console.log(`💳 [SIMULATION] Iniciando Checkout para Orden: ${orderId}`);

    // 1. BUSCAR: ¿Existe la orden en memoria?
    let order = ordersStore.getOrder(orderId);

    // --- PARCHE SALVAVIDAS ---
    // Si reiniciaste el server y se borró la memoria, la creamos acá para que no falle.
    if (!order) {
      console.warn("⚠️ Orden no encontrada. Creando respaldo...");
      const fallbackOrder: Order = {
        id: orderId,
        userId: "user-demo",
        userEmail: "demo@hackaton.com",
        walletAddress: "0x123...abc",
        items: [{ id: "1", name: "Hamburguesa (Demo)", description: "Auto-generada", price: 10.00 }],
        total: 10.00,
        status: 'pending',
        createdAt: new Date()
      };
      order = ordersStore.createOrder(fallbackOrder);
    }

    // 2. ARKIV: Subimos los datos (Simulado)
    const arkivURI = await uploadOrderMetadata(order);

    // 3. CROSSMINT: Generamos IDs falsos (Simulado)
    const mockTokenId = "NFT-" + Math.floor(Math.random() * 100000);
    const mockWallet = "0x" + Math.random().toString(16).slice(2, 40); 

    // 4. ACTUALIZAR: Marcamos la orden como pagada
    ordersStore.updateOrder(orderId, {
      status: 'minted',
      tokenId: mockTokenId,
      paidAt: new Date()
    });

    // 5. CREAR TICKET: Guardamos el ticket
    const newTicket: Ticket = {
      tokenId: mockTokenId,
      orderId: orderId,
      owner: order.walletAddress || mockWallet,
      consumed: false,
      metadataUrl: arkivURI,
      createdAt: new Date()
    };

    ordersStore.createTicket(newTicket);

    console.log(`✅ [SUCCESS] Ticket creado: ${mockTokenId}`);

    return NextResponse.json({ 
      success: true, 
      tokenId: mockTokenId 
    });

  } catch (error) {
    console.error("💥 Error en simulación:", error);
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}