// In-memory store for orders
// Replace with a real database in production

import { Order, Ticket } from '@/types';

class OrdersStore {
  private orders: Map<string, Order> = new Map();
  private tickets: Map<string, Ticket> = new Map();

  // Orders
  createOrder(order: Order): Order {
    this.orders.set(order.id, order);
    return order;
  }

  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  updateOrder(orderId: string, updates: Partial<Order>): Order | undefined {
    const order = this.orders.get(orderId);
    if (!order) return undefined;
    
    const updated = { ...order, ...updates };
    this.orders.set(orderId, updated);
    return updated;
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  // Tickets
  createTicket(ticket: Ticket): Ticket {
    this.tickets.set(ticket.tokenId, ticket);
    return ticket;
  }

  getTicket(tokenId: string): Ticket | undefined {
    return this.tickets.get(tokenId);
  }

  updateTicket(tokenId: string, updates: Partial<Ticket>): Ticket | undefined {
    const ticket = this.tickets.get(tokenId);
    if (!ticket) return undefined;
    
    const updated = { ...ticket, ...updates };
    this.tickets.set(tokenId, updated);
    return updated;
  }

  getAllTickets(): Ticket[] {
    return Array.from(this.tickets.values());
  }
}

// Singleton instance
export const ordersStore = new OrdersStore();

