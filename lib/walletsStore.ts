// In-memory store for wallets
// Replace with real Crossmint integration in production

import { Wallet } from '@/types';

class WalletsStore {
  private wallets: Map<string, Wallet> = new Map();

  getOrCreateWallet(email: string): Wallet {
    const existing = this.wallets.get(email);
    if (existing) {
      return existing;
    }

    // Create a fake wallet address
    const randomHex = Math.random().toString(16).substring(2, 42).padEnd(40, '0');
    const address = `0xFAKE${randomHex}`.substring(0, 42);

    const wallet: Wallet = {
      email,
      address,
      createdAt: new Date(),
    };

    this.wallets.set(email, wallet);
    return wallet;
  }

  getWallet(email: string): Wallet | undefined {
    return this.wallets.get(email);
  }

  getAllWallets(): Wallet[] {
    return Array.from(this.wallets.values());
  }
}

// Singleton instance
export const walletsStore = new WalletsStore();

