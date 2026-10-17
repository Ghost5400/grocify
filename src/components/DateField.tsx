// src/components/DateField.tsx
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { format, parseISO } from 'date-fns';
import { CalendarDays } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { formatDateDisplay, getTodayIso, ISO_DATE_FORMAT } from '@/utils/date';

export interface DateFieldProps {
  value?: string; // YYYY-MM-DD
  onChange: (isoDate: string) => void;
  label?: string;
  error?: string | boolean;
  helperText?: string;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function DateField({
  value,
  onChange,
  label = 'Expiry date',
  error,
  helperText = "We'll remind you before it expires.",
  placeholder = 'DD / MM / YYYY',
  style,
  testID,
}: DateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [iosTempDate, setIosTempDate] = useState<Date>(
    value ? parseISO(value) : new Date()
  );

  const displayValue = value ? formatDateDisplay(value) : '';
  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : 'Pick today or a later date';

  const handleOpenPicker = () => {
    setIosTempDate(value ? parseISO(value) : new Date());
    setShowPicker(true);
  };

  const handleAndroidChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowPicker(false);
    if (event.type === 'set' && selectedDate) {
      onChange(format(selectedDate, ISO_DATE_FORMAT));
    }
  };

  const handleIosConfirm = () => {
    onChange(format(iosTempDate, ISO_DATE_FORMAT));
    setShowPicker(false);
  };

  const handleWebChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      onChange(event.target.value);
    }
  };

  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={[styles.label, typography.label]}>{label}</Text> : null}

      <Pressable
        testID={testID || 'date-field-trigger'}
        onPress={handleOpenPicker}
        accessibilityRole="button"
        accessibilityLabel={value ? `${label}: ${displayValue}` : `${label}: ${placeholder}`}
        style={[
          styles.field,
          hasError && styles.fieldError,
        ]}
      >
        <CalendarDays size={24} color="#2F4A47" strokeWidth={2} style={styles.icon} />
        <Text
          testID="date-field-text"
          style={[
            styles.valueText,
            typography.fieldValue,
            !displayValue && styles.placeholderText,
          ]}
        >
          {displayValue || placeholder}
        </Text>

        {Platform.OS === 'web' && (
          <input
            type="date"
            min={getTodayIso()}
            value={value || ''}
            onChange={handleWebChange}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
            }}
            aria-label={label}
          />
        )}
      </Pressable>

      {/* Helper text or Error message */}
      <Text
        testID="date-field-helper"
        style={[
          styles.helperText,
          typography.caption,
          hasError && styles.helperError,
        ]}
      >
        {hasError ? errorMessage : helperText}
      </Text>

      {/* Native Pickers */}
      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          testID="android-date-picker"
          value={value ? parseISO(value) : new Date()}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={handleAndroidChange}
        />
      )}

      {showPicker && Platform.OS === 'ios' && (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                  style={styles.modalButton}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="ios-date-picker-done"
                  onPress={handleIosConfirm}
                  style={styles.modalButton}
                >
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                testID="ios-date-picker"
                value={iosTempDate}
                mode="date"
                display="spinner"
                minimumDate={new Date()}
                onChange={(_event, date) => {
                  if (date) setIosTempDate(date);
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    color: colors.ink.label,
    marginBottom: spacing.xs,
    textAlign: 'left',
  },
  field: {
    width: '100%',
    height: 52,
    borderRadius: radius.md, // 18
    backgroundColor: colors.field.bg,
    borderWidth: 1.5,
    borderColor: colors.field.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg, // 16
    position: 'relative',
  },
  fieldError: {
    borderColor: colors.status.expired.fg, // #B23B30
  },
  icon: {
    marginRight: spacing.md, // 12 gap
  },
  valueText: {
    color: colors.ink.title,
    flex: 1,
  },
  placeholderText: {
    color: colors.placeholder,
  },
  helperText: {
    color: colors.ink.helper,
    marginTop: 6,
    textAlign: 'center',
  },
  helperError: {
    color: colors.status.expired.fg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.canvas,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: spacing.huge,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.rim.base,
  },
  modalButton: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: colors.ink.slateSoft,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.brand.forest,
  },
});
