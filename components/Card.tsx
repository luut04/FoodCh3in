import React from 'react';
import styles from '@/styles/Card.module.scss';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div className={`${styles.card} ${hover ? styles.hover : ''} ${className}`}>
      {children}
    </div>
  );
}
