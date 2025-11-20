'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { TicketStatus } from '@/types';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { QRCode } from '@/components/QRCode';
import { Loading } from '@/components/Loading';
import axios from 'axios';
import styles from '@/styles/pages/ticket.module.scss';

export default function TicketPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const tokenId = params.tokenId as string;

  const [ticket, setTicket] = useState<TicketStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated' && tokenId) {
      fetchTicket();
    }
  }, [status, tokenId, router]);

  const fetchTicket = async () => {
    try {
      const response = await axios.get(`/api/tickets/${tokenId}`);
      setTicket(response.data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      alert('Ticket not found');
      router.push('/menu');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <Loading />;
  }

  if (!ticket) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <Card style={{ maxWidth: '42rem', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '1.25rem', color: '#dc2626' }}>Ticket not found</p>
        </Card>
      </div>
    );
  }

  const qrValue = typeof window !== 'undefined' 
    ? `${window.location.origin}/validator?tokenId=${tokenId}` 
    : '';

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
        <div className={styles.success}>
          <div className={styles.icon}>🎉</div>
          <h1>Payment Successful!</h1>
          <p>Your ticket NFT has been minted</p>
        </div>

        <Card className={styles.ticketCard}>
          <div className={styles.ticketHeader}>
            <h2>Your Ticket</h2>
            <span className={`${styles.badge} ${ticket.consumed ? styles.consumed : styles.active}`}>
              {ticket.consumed ? '🔴 Consumed' : '✅ Active'}
            </span>
          </div>

          {ticket.order && (
            <div className={styles.orderDetails}>
              {ticket.order.items.map((item, index) => (
                <div key={index} className={styles.orderItem}>
                  <div className={styles.itemInfo}>
                    <span>{item.image}</span>
                    <span>{item.name}</span>
                  </div>
                  <span className={styles.price}>${item.price}</span>
                </div>
              ))}
              <div className={styles.orderTotal}>
                <span>Total</span>
                <span>${ticket.order.total}</span>
              </div>
            </div>
          )}

          <div className={styles.nftInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Token ID</span>
              <span className={styles.value}>{tokenId}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Owner</span>
              <span className={`${styles.value} ${styles.cyan}`}>
                {ticket.owner.slice(0, 6)}...{ticket.owner.slice(-4)}
              </span>
            </div>
            {ticket.order && (
              <div className={styles.infoRow}>
                <span className={styles.label}>Order ID</span>
                <span className={`${styles.value} ${styles.small}`}>
                  {ticket.order.id}
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card className={styles.qrSection}>
          <h3>Present this QR code to the vendor</h3>
          {qrValue && <QRCode value={qrValue} size={256} />}
          <p>The vendor will scan this code to validate and redeem your ticket</p>
        </Card>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => router.push('/menu')}
          >
            ← Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
