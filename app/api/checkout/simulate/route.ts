import { NextResponse } from 'next/server';

// COMENTARIO: Este archivo simula ser el servidor de Crossmint y Arkiv.
// Recibe la orden de pago del Frontend y devuelve un NFT falso.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, userEmail, amount } = body;

    console.log(`💳 Procesando pago de ${amount} para ${userEmail}...`);

    // 1. SIMULACIÓN ARKIV
    // Aquí normalmente subiríamos el JSON a Arkiv Network.
    // Generamos un link falso que parece real.
    const mockArkivLink = `arkiv://orders/${orderId}/immutable_proof`;

    // 2. SIMULACIÓN CROSSMINT
    // Aquí normalmente Crossmint mintea el NFT.
    // Generamos un ID de Token al azar.
    const mockTokenId = "NFT-" + Math.floor(Math.random() * 100000);

    // Devolvemos éxito al Frontend
    return NextResponse.json({
      success: true,
      tokenId: mockTokenId,
      message: "Pago procesado y NFT minteado",
      proof: mockArkivLink
    });

  } catch (error) {
    return NextResponse.json({ error: 'Error en el servidor simulado' }, { status: 500 });
  }
}

