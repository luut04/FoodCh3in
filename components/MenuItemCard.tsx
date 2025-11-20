'use client';

import { MenuItem } from '@/types';
import { Card } from './Card';
import { Button } from './Button';
import styles from '@/styles/MenuItemCard.module.scss';

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
  return (
    <Card hover className={styles.menuCard}>
      <div className={styles.image}>{item.image}</div>
      <h3 className={styles.name}>{item.name}</h3>
      <p className={styles.description}>{item.description}</p>
      <div className={styles.footer}>
        <span className={styles.price}>${item.price}</span>
        <Button onClick={() => onSelect(item)} size="sm">
          Buy Ticket
        </Button>
      </div>
    </Card>
  );
}
