'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Order } from '@/types';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import axios from 'axios';
import styles from '@/styles/pages/checkout.module.scss';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const checkoutId = searchParams.get('checkoutId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated' && orderId) {
      fetchOrder();
    }
  }, [status, orderId, router]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders?orderId=${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Order not found');
      router.push('/menu');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (processing) return;

    setProcessing(true);
    try {
      const response = await axios.post('/api/checkout/simulate', {
        orderId,
        checkoutId,
      });

      const { tokenId } = response.data;
      router.push(`/ticket/${tokenId}`);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (status === 'loading' || loading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <Card style={{ maxWidth: '42rem', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '1.25rem', color: '#dc2626' }}>Order not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
        <h1 className={styles.title}>Checkout</h1>

        <Card style={{ marginBottom: '1.5rem' }} className={styles.orderSummary}>
          <h2>Order Summary</h2>
          
          <div className={styles.orderItems}>
            {order.items.map((item, index) => (
              <div key={index} className={styles.orderItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemIcon}>{item.image}</span>
                  <div>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemDescription}>{item.description}</p>
                  </div>
                </div>
                <span className={styles.itemPrice}>${item.price}</span>
              </div>
            ))}
          </div>

          <div className={styles.orderTotal}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalAmount}>${order.total}</span>
          </div>
        </Card>

        <Card style={{ marginBottom: '1.5rem' }} className={styles.paymentMethod}>
          <h2>Payment Method</h2>
          <p>
            In production, this would be Crossmint's secure checkout flow.
            For this demo, we'll simulate a successful payment.
          </p>
          <div className={styles.demoWarning}>
            <p>
              ⚠️ Demo Mode: Clicking the button below will simulate a successful payment
              and mint your ticket NFT.
            </p>
          </div>
        </Card>

        <Button
          size="lg"
          className={styles.payButton}
          onClick={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <span className={styles.buttonContent}>
              <div className={styles.spinner}></div>
              Processing Payment...
            </span>
          ) : (
            '💳 Pay with Card (Sandbox)'
          )}
        </Button>

        <p className={styles.footer}>
          Secure payment powered by Crossmint • NFT minted on testnet
        </p>
      </div>
    </div>
  );
}
