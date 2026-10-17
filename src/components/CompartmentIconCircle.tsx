// src/components/CompartmentIconCircle.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Leaf, Package, Snowflake } from 'lucide-react-native';
import { CompartmentId } from '@/domain/types';
import { compartmentTheme, radius } from '@/theme/tokens';

export interface CompartmentIconCircleProps {
  compartment: CompartmentId;
  size?: 28 | 44 | 52 | number;
}

export function CompartmentIconCircle({
  compartment,
  size = 44,
}: CompartmentIconCircleProps) {
  const theme = compartmentTheme[compartment];
  const iconSize = size <= 28 ? 16 : size >= 52 ? 26 : 22;


  const renderIcon = () => {
    switch (compartment) {
      case 'freezer':
        return <Snowflake size={iconSize} color={theme.onAccent} strokeWidth={2} />;
      case 'packed':
        return <Package size={iconSize} color={theme.onAccent} strokeWidth={2} />;
      case 'veggies':
        return <Leaf size={iconSize} color={theme.onAccent} strokeWidth={2} />;
    }
  };

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          backgroundColor: theme.accent,
        },
      ]}
      accessibilityRole="image"
      accessibilityLabel={`${compartment} icon`}
    >
      {/* Top glossy inner highlight */}
      <View style={[styles.glossHighlight, { width: size * 0.76 }]} />
      {renderIcon()}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  glossHighlight: {
    position: 'absolute',
    top: 2,
    height: '42%',
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
});
