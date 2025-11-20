'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './Button';
import styles from '@/styles/Navbar.module.scss';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span>FoodCh3in</span>
        </Link>

        <div className={styles.actions}>
          {session ? (
            <>
              <Link href="/menu">
                <Button variant="secondary" size="sm">
                  Menu
                </Button>
              </Link>
              <span className={styles.email}>
                {session.user?.email}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/">
              <Button variant="primary" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
