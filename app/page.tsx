'use client';

import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import styles from '@/styles/pages/home.module.scss';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/menu');
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
      <div className={styles.hero}>
        <div style={{ marginBottom: '3rem' }}>
          <h1>FoodCh3in</h1>
          <p className={styles.tagline}>
            Buy food tickets with your credit card, receive an NFT without even knowing what a wallet is.
          </p>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.icon}>🎫</div>
            <h3>Easy Purchase</h3>
            <p>Buy tickets with your credit card, no crypto knowledge needed</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.icon}>🔐</div>
            <h3>Secure NFTs</h3>
            <p>Your ticket is an NFT stored securely on the blockchain</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.icon}>⚡</div>
            <h3>Instant Access</h3>
            <p>Get your ticket immediately after payment</p>
          </div>
        </div>

        <div className={styles.cta}>
          <Button
            size="lg"
            onClick={() => signIn('google', { callbackUrl: '/menu' })}
            style={{ fontSize: '1.25rem', padding: '1.25rem 3rem' }}
          >
            🚀 Login with Google
          </Button>
          <p>No wallet setup required • No crypto experience needed</p>
        </div>

        <div className={styles.demoBadge}>
          <span>🎪 Hackathon MVP Demo</span>
        </div>
      </div>
    </div>
  );
}
