'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MenuItem } from '@/types';
import { menuItems } from '@/lib/menu';
import { MenuItemCard } from '@/components/MenuItemCard';
import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import axios from 'axios';
import styles from '@/styles/pages/menu.module.scss';

export default function MenuPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wallet, setWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated') {
      fetchWallet();
    }
  }, [status, router]);

  const fetchWallet = async () => {
    try {
      const response = await axios.post('/api/auth/wallet');
      setWallet(response.data.walletAddress);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTicket = async (item: MenuItem) => {
    if (purchasing) return;

    setPurchasing(true);
    try {
      const orderResponse = await axios.post('/api/orders', {
        items: [item],
      });

      const { orderId, checkoutId } = orderResponse.data;
      router.push(`/checkout/${orderId}?checkoutId=${checkoutId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (status === 'loading' || loading) {
    return <Loading />;
  }

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div className={styles.header}>
          <h1>Food Menu</h1>
          <Card>
            <div className={styles.userInfo}>
              <div className={styles.infoBlock}>
                <p>Logged in as</p>
                <p className={styles.email}>{session?.user?.email}</p>
              </div>
              <div className={styles.infoBlock}>
                <p>Your Wallet</p>
                <p className={styles.wallet}>
                  {wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : 'Loading...'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className={styles.menuGrid}>
          {menuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onSelect={handleBuyTicket}
            />
          ))}
        </div>

        {purchasing && (
          <div className={styles.modal}>
            <Card className={styles.modalContent}>
              <Loading />
              <p>Creating your order...</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
