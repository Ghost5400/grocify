// src/components/TextButton.tsx
import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { colors, typography } from '@/theme/tokens';

export interface TextButtonProps {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  color?: string;
  testID?: string;
}

export function TextButton({
  label,
  onPress,
  style,
  textStyle,
  color = colors.ink.title,
  testID,
}: TextButtonProps) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,
          typography.button,
          { color },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.7,
  },
});
