import { Order } from '@/types';

export async function uploadOrderMetadata(order: Order): Promise<string> {
  // Simulación de espera (latencia de red)
  await new Promise(resolve => setTimeout(resolve, 150));

  // Devolvemos una URL simulada de Arkiv
  return `arkiv://orders/${order.id}/proof`;
}