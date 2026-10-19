// __tests__/features/inventory/InventoryHeader.test.tsx
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react-native';
import { InventoryHeader } from '@/features/inventory/InventoryHeader';

describe('InventoryHeader', () => {
  const mockBack = jest.fn();
  const mockAdd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders compartment name, icon circle, count chip, and + button', async () => {
    await render(
      <InventoryHeader
        compartment="veggies"
        itemCount={4}
        onBack={mockBack}
        onAdd={mockAdd}
      />
    );

    expect(screen.getByTestId('inventory-header-title')).toHaveTextContent('Veggies');
    expect(screen.getByTestId('inventory-count-chip')).toHaveTextContent('4 items');
    expect(screen.getByTestId('inventory-header-back')).toBeTruthy();
    expect(screen.getByTestId('inventory-header-add')).toBeTruthy();
  });

  it('displays singular "1 item" when itemCount is 1', async () => {
    await render(
      <InventoryHeader
        compartment="freezer"
        itemCount={1}
        onBack={mockBack}
        onAdd={mockAdd}
      />
    );

    expect(screen.getByTestId('inventory-header-title')).toHaveTextContent('Freezer');
    expect(screen.getByTestId('inventory-count-chip')).toHaveTextContent('1 item');
  });

  it('calls onBack when back button is pressed', async () => {
    await render(
      <InventoryHeader
        compartment="packed"
        itemCount={0}
        onBack={mockBack}
        onAdd={mockAdd}
      />
    );

    fireEvent.press(screen.getByTestId('inventory-header-back'));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('calls onAdd when + button is pressed', async () => {
    await render(
      <InventoryHeader
        compartment="veggies"
        itemCount={2}
        onBack={mockBack}
        onAdd={mockAdd}
      />
    );

    fireEvent.press(screen.getByTestId('inventory-header-add'));
    expect(mockAdd).toHaveBeenCalledTimes(1);
  });
});
