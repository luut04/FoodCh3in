import { NextResponse } from 'next/server';
import { ordersStore } from '@/lib/ordersStore';

export async function GET() {
  // 1. Sacamos todos los tickets de la memoria
  const tickets = ordersStore.getAllTickets();
  
  // 2. En una app real, filtraríamos por usuario logueado.
  // En la demo, devolvemos TODOS para que se vea lleno.
  const myTickets = tickets.map(t => {
    const order = ordersStore.getOrder(t.orderId);
    return {
      ...t,
      itemName: order?.items[0].name || "Producto Desconocido",
      itemPrice: order?.total || 0
    };
  });

  return NextResponse.json({ tickets: myTickets });
}