// __tests__/components/ShelfPreview.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ShelfPreview } from '@/components/fridge/ShelfPreview';
import { Item } from '@/domain/types';

const mockItem = (id: string, name: string): Item => ({
  id,
  catalogId: name.toLowerCase(),
  name,
  compartment: 'veggies',
  imageKey: name.toLowerCase(),
  quantity: 1,
  expiryDate: '2026-12-30',
  reminderDays: 2,
  notificationId: null,
  addedAt: new Date().toISOString(),
});

describe('ShelfPreview Component', () => {
  it('renders "Empty" label when there are no items', async () => {
    await render(<ShelfPreview compartment="veggies" items={[]} />);

    expect(screen.getByTestId('shelf-empty-state')).toBeTruthy();
    expect(screen.getByText('Empty')).toBeTruthy();
  });

  it('renders items when items array is provided', async () => {
    const items = [
      mockItem('1', 'Tomato'),
      mockItem('2', 'Cucumber'),
      mockItem('3', 'Carrot'),
    ];

    await render(<ShelfPreview compartment="veggies" items={items} />);

    expect(screen.queryByText('Empty')).toBeNull();
    expect(screen.getByTestId('shelf-item-1')).toBeTruthy();
    expect(screen.getByTestId('shelf-item-2')).toBeTruthy();
    expect(screen.getByTestId('shelf-item-3')).toBeTruthy();
  });

  it('limits rendering to maxVisible items (default 6)', async () => {
    const items = Array.from({ length: 8 }, (_, i) =>
      mockItem(`item-${i + 1}`, `Item ${i + 1}`)
    );

    await render(<ShelfPreview compartment="veggies" items={items} />);

    expect(screen.getByTestId('shelf-item-item-1')).toBeTruthy();
    expect(screen.getByTestId('shelf-item-item-6')).toBeTruthy();
    expect(screen.queryByTestId('shelf-item-item-7')).toBeNull();
  });
});
