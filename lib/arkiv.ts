// Mocked Arkiv SDK wrapper for NFT metadata and state management
// Replace with real Arkiv SDK in production

import { Order } from '@/types';

/**
 * Upload order metadata to IPFS/Arkiv and return the tokenURI
 * In production, this would call Arkiv's metadata storage API
 */
export async function uploadOrderMetadata(order: Order): Promise<string> {
  console.log('[MOCK] Arkiv.uploadOrderMetadata:', order.id);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // In production, this would call:
  // const metadata = {
  //   name: `FoodCh3in Ticket #${order.id}`,
  //   description: `Food ticket for ${order.items.map(i => i.name).join(', ')}`,
  //   image: 'ipfs://...',
  //   attributes: [
  //     { trait_type: 'Order ID', value: order.id },
  //     { trait_type: 'Total', value: order.total },
  //     { trait_type: 'Status', value: 'Active' },
  //   ],
  // };
  // const { uri } = await arkivSDK.metadata.upload(metadata);
  // return uri;
  
  // Return a mock IPFS URI
  const mockCid = `Qm${Math.random().toString(36).substring(2, 15)}`;
  return `ipfs://${mockCid}`;
}

/**
 * Mark a ticket as consumed in Arkiv's state layer
 * In production, this would update the NFT's dynamic state
 */
export async function markTicketConsumed(tokenId: string): Promise<void> {
  console.log('[MOCK] Arkiv.markTicketConsumed:', tokenId);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // In production, this would call:
  // await arkivSDK.state.update(tokenId, { consumed: true, consumedAt: Date.now() });
}

/**
 * Get the current state of a ticket from Arkiv
 * In production, this would fetch the NFT's dynamic state
 */
export async function getTicketState(tokenId: string): Promise<{
  consumed: boolean;
  consumedAt?: number;
}> {
  console.log('[MOCK] Arkiv.getTicketState:', tokenId);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // In production, this would call:
  // const state = await arkivSDK.state.get(tokenId);
  // return state;
  
  // For mock, return default state
  return {
    consumed: false,
  };
}

