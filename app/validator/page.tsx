'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TicketStatus } from '@/types';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import axios from 'axios';
import styles from '@/styles/pages/validator.module.scss';

export default function ValidatorPage() {
  const searchParams = useSearchParams();
  const urlTokenId = searchParams.get('tokenId');

  const [tokenId, setTokenId] = useState(urlTokenId || '');
  const [ticket, setTicket] = useState<TicketStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consuming, setConsuming] = useState(false);

  useEffect(() => {
    if (urlTokenId) {
      checkTicket(urlTokenId);
    }
  }, [urlTokenId]);

  const checkTicket = async (id: string) => {
    if (!id) {
      setError('Please enter a token ID');
      return;
    }

    setLoading(true);
    setError(null);
    setTicket(null);

    try {
      const response = await axios.get(`/api/tickets/${id}`);
      setTicket(response.data);
    } catch (err: any) {
      console.error('Error checking ticket:', err);
      setError(err.response?.data?.error || 'Ticket not found');
    } finally {
      setLoading(false);
    }
  };

  const consumeTicket = async () => {
    if (!tokenId || !ticket || consuming) return;

    if (ticket.consumed) {
      alert('This ticket has already been consumed');
      return;
    }

    setConsuming(true);
    try {
      await axios.post('/api/tickets/consume', { tokenId });
      await checkTicket(tokenId);
      alert('✅ Ticket consumed successfully!');
    } catch (err: any) {
      console.error('Error consuming ticket:', err);
      alert(err.response?.data?.error || 'Failed to consume ticket');
    } finally {
      setConsuming(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
        <h1 className={styles.title}>🔍 Ticket Validator</h1>

        <Card style={{ marginBottom: '1.5rem' }} className={styles.checkCard}>
          <h2>Check Ticket</h2>
          
          <div className={styles.form}>
            <div>
              <label>Token ID</label>
              <input
                type="text"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="Enter token ID"
              />
            </div>

            <Button
              onClick={() => checkTicket(tokenId)}
              disabled={loading || !tokenId}
            >
              {loading ? 'Checking...' : 'Check Ticket'}
            </Button>

            <div className={styles.demoNote}>
              <p>
                💡 In production, this page would have a QR scanner.
                For this demo, you can manually enter the token ID or use the URL parameter.
              </p>
            </div>
          </div>
        </Card>

        {error && (
          <Card className={styles.errorCard}>
            <div className={styles.errorContent}>
              <span className={styles.errorIcon}>❌</span>
              <div>
                <h3>Error</h3>
                <p>{error}</p>
              </div>
            </div>
          </Card>
        )}

        {loading && <Loading />}

        {ticket && !loading && (
          <>
            <Card className={`${styles.statusCard} ${ticket.consumed ? styles.consumed : styles.active}`}>
              <div className={styles.statusHeader}>
                <h2>Ticket Status</h2>
                <span className={`${styles.badge} ${ticket.consumed ? styles.consumed : styles.active}`}>
                  {ticket.consumed ? '🔴 CONSUMED' : '✅ ACTIVE'}
                </span>
              </div>

              <div className={styles.ticketInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Token ID</span>
                  <span className={styles.value}>{ticket.tokenId}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Owner</span>
                  <span className={`${styles.value} ${styles.cyan}`}>
                    {ticket.owner.slice(0, 8)}...{ticket.owner.slice(-6)}
                  </span>
                </div>
              </div>

              {ticket.order && (
                <div className={styles.orderSection}>
                  <h3>Order Details</h3>
                  <div className={styles.orderItems}>
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
                </div>
              )}
            </Card>

            {!ticket.consumed && (
              <Button
                onClick={consumeTicket}
                disabled={consuming}
                className={styles.actionButton}
                size="lg"
              >
                {consuming ? (
                  <span className={styles.buttonContent}>
                    <div className={styles.spinner}></div>
                    Consuming Ticket...
                  </span>
                ) : (
                  '✅ Mark as Consumed'
                )}
              </Button>
            )}

            {ticket.consumed && (
              <Card className={styles.warningCard}>
                <p>
                  ⚠️ This ticket has already been used and cannot be redeemed again
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
