// Core data types for FoodCh3in

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in USD
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  walletAddress: string;
  items: MenuItem[];
  total: number;
  status: 'pending' | 'paid' | 'minted' | 'failed';
  checkoutId?: string;
  tokenId?: string;
  createdAt: Date;
  paidAt?: Date;
}

export interface Ticket {
  tokenId: string;
  orderId: string;
  owner: string; // wallet address
  consumed: boolean;
  metadataUrl?: string;
  consumedAt?: Date;
  createdAt: Date;
}

export interface Wallet {
  email: string;
  address: string;
  createdAt: Date;
}

export interface CheckoutResponse {
  checkoutId: string;
  checkoutUrl: string;
  orderId: string;
}

export interface TicketStatus {
  tokenId: string;
  owner: string;
  consumed: boolean;
  metadataUrl?: string;
  order?: Order;
}

export interface WebhookPayload {
  orderId: string;
  status: 'succeeded' | 'failed';
  checkoutId: string;
  timestamp: string;
}

