// Hardcoded menu items for the MVP

import { MenuItem } from '@/types';

export const menuItems: MenuItem[] = [
  {
    id: 'burger',
    name: 'Double Burger',
    description: 'Juicy double patty with cheese, lettuce, and special sauce',
    price: 10,
    image: '🍔',
  },
  {
    id: 'drink',
    name: 'Drink',
    description: 'Refreshing cold beverage',
    price: 3,
    image: '🥤',
  },
];

export function getMenuItem(id: string): MenuItem | undefined {
  return menuItems.find(item => item.id === id);
}

