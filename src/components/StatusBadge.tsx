// src/components/StatusBadge.tsx
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react-native';
import { ItemStatus } from '@/domain/types';
import { getStatus, getStatusLabel } from '@/domain/status';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export interface StatusBadgeProps {
  status?: ItemStatus;
  label?: string;
  expiryDate?: string;
  reminderDays?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function StatusBadge({
  status: propStatus,
  label: propLabel,
  expiryDate,
  reminderDays = 2,
  style,
  testID,
}: StatusBadgeProps) {
  let resolvedStatus: ItemStatus = 'fresh';
  let resolvedLabel = '';

  if (propStatus && propLabel) {
    resolvedStatus = propStatus;
    resolvedLabel = propLabel;
  } else if (expiryDate) {
    resolvedStatus = getStatus({ expiryDate, reminderDays });
    resolvedLabel = getStatusLabel(expiryDate);
  } else {
    resolvedStatus = propStatus || 'fresh';
    resolvedLabel = propLabel || 'Fresh';
  }

  const theme = colors.status[resolvedStatus];

  const renderIcon = () => {
    switch (resolvedStatus) {
      case 'fresh':
        return <CheckCircle size={16} color={theme.fg} strokeWidth={2.2} />;
      case 'expiringSoon':
        return <Clock size={16} color={theme.fg} strokeWidth={2.2} />;
      case 'expired':
        return <AlertCircle size={16} color={theme.fg} strokeWidth={2.2} />;
    }
  };

  return (
    <View
      testID={testID || 'status-badge'}
      style={[
        styles.badge,
        { backgroundColor: theme.bg },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${resolvedLabel}`}
    >
      {renderIcon()}
      <Text
        testID="status-badge-text"
        style={[
          styles.text,
          typography.caption,
          { color: theme.fg },
        ]}
      >
        {resolvedLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 28,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
