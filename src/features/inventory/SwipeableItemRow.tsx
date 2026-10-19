// src/features/inventory/SwipeableItemRow.tsx
// Swipeable Item Row with 80pt delete action per UIUX.md Section 9.3 and Kickoff Phase 5

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Trash2 } from 'lucide-react-native';
import { ItemRow } from '@/components/ItemRow';
import { Item } from '@/domain/types';
import {
  colors,
  elevation,
  radius,
} from '@/theme/tokens';

export interface SwipeableItemRowProps {
  item: Item;
  onPress: (item: Item) => void;
  onDelete: (item: Item) => void;
  testID?: string;
}

export const SwipeableItemRow = React.memo(function SwipeableItemRow({
  item,
  onPress,
  onDelete,
  testID,
}: SwipeableItemRowProps) {
  const swipeableRef = React.useRef<SwipeableMethods>(null);

  const renderRightActions = (
    _progress: unknown,
    _drag: unknown,
    swipeable?: SwipeableMethods
  ) => {
    const handleSwipeDelete = () => {
      if (swipeable) {
        swipeable.close();
      } else if (swipeableRef.current) {
        swipeableRef.current.close();
      }
      onDelete(item);
    };

    return (
      <View style={styles.rightActionsWrapper}>
        <TouchableOpacity
          testID={`swipe-delete-btn-${item.id}`}
          onPress={handleSwipeDelete}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${item.name}`}
          style={[styles.deleteButton, elevation.elev1]}
        >
          <Trash2 size={24} color={colors.white} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View testID={testID} style={styles.container}>
      <ReanimatedSwipeable
        ref={swipeableRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        overshootRight={false}
        renderRightActions={(prog, drag, swipeable) =>
          renderRightActions(prog, drag, swipeable || swipeableRef.current || undefined)
        }
      >
        <ItemRow
          testID={`item-row-${item.id}`}
          name={item.name}
          quantity={item.quantity}
          expiryDate={item.expiryDate}
          compartment={item.compartment}
          reminderDays={item.reminderDays}
          catalogId={item.catalogId || undefined}
          onPress={() => onPress(item)}
        />
      </ReanimatedSwipeable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 76,
    width: '100%',
  },
  rightActionsWrapper: {
    width: 88,
    height: 76,
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 80,
    height: 76,
    borderRadius: radius.lg, // 24
    backgroundColor: colors.status.expired.fg, // #B23B30
    justifyContent: 'center',
    alignItems: 'center',
  },
});
