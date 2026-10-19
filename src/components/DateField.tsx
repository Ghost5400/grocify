// src/components/DateField.tsx
import React, { useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerChangeEvent,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isSameDay,
  isToday,
  parseISO,
  startOfDay,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { formatDateDisplay, ISO_DATE_FORMAT } from '@/utils/date';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface DateFieldProps {
  value?: string; // YYYY-MM-DD
  onChange: (isoDate: string) => void;
  label?: string;
  error?: string | boolean;
  helperText?: string;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  suggestedDays?: number;
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
  suggestedDays,
}: DateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [iosTempDate, setIosTempDate] = useState<Date>(
    value ? parseISO(value) : new Date()
  );

  // Web in-app calendar state
  const [calendarMonth, setCalendarMonth] = useState<Date>(() =>
    value ? startOfMonth(parseISO(value)) : startOfMonth(new Date())
  );
  const [selectedWebDate, setSelectedWebDate] = useState<Date | null>(() =>
    value ? parseISO(value) : null
  );

  const displayValue = value ? formatDateDisplay(value) : '';
  const hasError = Boolean(error);
  const errorMessage =
    typeof error === 'string' ? error : 'Pick today or a later date';

  const handleOpenPicker = () => {
    const initialDate = value ? parseISO(value) : new Date();
    setIosTempDate(initialDate);
    setSelectedWebDate(value ? initialDate : null);
    setCalendarMonth(startOfMonth(initialDate));
    setShowPicker(true);
  };

  const handleAndroidValueChange = (
    _event: DateTimePickerChangeEvent,
    selectedDate: Date
  ) => {
    setShowPicker(false);
    if (selectedDate) {
      onChange(format(selectedDate, ISO_DATE_FORMAT));
    }
  };

  const handleAndroidDismiss = () => {
    setShowPicker(false);
  };

  const handleIosConfirm = () => {
    onChange(format(iosTempDate, ISO_DATE_FORMAT));
    setShowPicker(false);
  };

  // Web calendar helpers
  const today = useMemo(() => startOfDay(new Date()), []);

  const daysInMonth = useMemo(() => {
    const monthStart = startOfMonth(calendarMonth);
    const monthEnd = endOfMonth(calendarMonth);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [calendarMonth]);

  const leadingBlanks = useMemo(() => {
    const firstDayIndex = getDay(startOfMonth(calendarMonth)); // 0 = Sunday
    return Array.from({ length: firstDayIndex });
  }, [calendarMonth]);

  const handleSelectWebDate = (date: Date) => {
    setSelectedWebDate(date);
    onChange(format(date, ISO_DATE_FORMAT));
    setShowPicker(false);
  };

  const handleQuickPreset = (daysToAdd: number) => {
    const target = addDays(today, daysToAdd);
    setSelectedWebDate(target);
    setCalendarMonth(startOfMonth(target));
    onChange(format(target, ISO_DATE_FORMAT));
    setShowPicker(false);
  };

  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={[styles.label, typography.label]}>{label}</Text> : null}

      <Pressable
        testID={testID || 'date-field-trigger'}
        onPress={handleOpenPicker}
        accessibilityRole="button"
        accessibilityLabel={
          value ? `${label}: ${displayValue}` : `${label}: ${placeholder}`
        }
        style={[styles.field, hasError && styles.fieldError]}
      >
        <CalendarDays
          size={24}
          color="#2F4A47"
          strokeWidth={2}
          style={styles.icon}
        />
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

      {/* Android Native Picker */}
      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          testID="android-date-picker"
          value={value ? parseISO(value) : new Date()}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onValueChange={handleAndroidValueChange}
          onDismiss={handleAndroidDismiss}
        />
      )}

      {/* iOS Native Bottom Sheet */}
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

      {/* Web & Universal Interactive Calendar Modal */}
      {showPicker && Platform.OS === 'web' && (
        <Modal
          visible={showPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPicker(false)}
        >
          <Pressable
            style={styles.webBackdrop}
            onPress={() => setShowPicker(false)}
          >
            <AnimatedPressable
              entering={FadeInDown.duration(220)}
              style={styles.webModalCard}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <View style={styles.webHeader}>
                <View style={styles.webHeaderTitleRow}>
                  <CalendarDays size={20} color="#2F4A47" strokeWidth={2.2} />
                  <Text style={[styles.webHeaderTitle, typography.titleMd]}>
                    Select Expiry Date
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Close calendar"
                  style={styles.webCloseBtn}
                >
                  <X size={20} color={colors.ink.title} />
                </TouchableOpacity>
              </View>

              {/* Quick Preset Chips */}
              <View style={styles.quickPresetsContainer}>
                <Text style={styles.quickPresetsLabel}>Quick pick:</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.quickPresetsRow}
                >
                  {suggestedDays ? (
                    <TouchableOpacity
                      onPress={() => handleQuickPreset(suggestedDays)}
                      style={[styles.presetChip, styles.presetChipSuggested]}
                      accessibilityRole="button"
                    >
                      <Text style={styles.presetChipTextSuggested}>
                        ⭐ Suggested ({suggestedDays}d)
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  <TouchableOpacity
                    onPress={() => handleQuickPreset(3)}
                    style={styles.presetChip}
                    accessibilityRole="button"
                  >
                    <Text style={styles.presetChipText}>+3 days</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleQuickPreset(7)}
                    style={styles.presetChip}
                    accessibilityRole="button"
                  >
                    <Text style={styles.presetChipText}>+1 week</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleQuickPreset(14)}
                    style={styles.presetChip}
                    accessibilityRole="button"
                  >
                    <Text style={styles.presetChipText}>+2 weeks</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleQuickPreset(30)}
                    style={styles.presetChip}
                    accessibilityRole="button"
                  >
                    <Text style={styles.presetChipText}>+1 month</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* Month Navigation */}
              <View style={styles.monthNavRow}>
                <TouchableOpacity
                  onPress={() => setCalendarMonth((prev) => subMonths(prev, 1))}
                  style={styles.navArrowBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Previous month"
                >
                  <ChevronLeft size={20} color={colors.ink.title} />
                </TouchableOpacity>

                <Text style={[styles.monthTitleText, typography.label]}>
                  {format(calendarMonth, 'MMMM yyyy')}
                </Text>

                <TouchableOpacity
                  onPress={() => setCalendarMonth((prev) => addMonths(prev, 1))}
                  style={styles.navArrowBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Next month"
                >
                  <ChevronRight size={20} color={colors.ink.title} />
                </TouchableOpacity>
              </View>

              {/* Days of Week Header */}
              <View style={styles.weekHeaderRow}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                  <View key={i} style={styles.weekDayHeaderCell}>
                    <Text style={styles.weekDayHeaderText}>{d}</Text>
                  </View>
                ))}
              </View>

              {/* Days Grid */}
              <View style={styles.daysGrid}>
                {leadingBlanks.map((_, i) => (
                  <View key={`blank-${i}`} style={styles.dayCellWrapper} />
                ))}

                {daysInMonth.map((day) => {
                  const dayStart = startOfDay(day);
                  const isPast = isBefore(dayStart, today);
                  const isChosen =
                    selectedWebDate && isSameDay(dayStart, selectedWebDate);
                  const isTodayDate = isToday(dayStart);

                  return (
                    <View key={day.toISOString()} style={styles.dayCellWrapper}>
                      <TouchableOpacity
                        disabled={isPast}
                        onPress={() => handleSelectWebDate(dayStart)}
                        style={[
                          styles.dayButton,
                          isTodayDate && styles.dayButtonToday,
                          isChosen && styles.dayButtonChosen,
                          isPast && styles.dayButtonPast,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={format(day, 'd MMMM yyyy')}
                      >
                        <Text
                          style={[
                            styles.dayButtonText,
                            isChosen && styles.dayButtonTextChosen,
                            isPast && styles.dayButtonTextPast,
                            isTodayDate && !isChosen && styles.dayButtonTextToday,
                          ]}
                        >
                          {format(day, 'd')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>

              {/* Close / Action Footer */}
              <View style={styles.webFooter}>
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                  style={styles.webCancelBtn}
                  accessibilityRole="button"
                >
                  <Text style={styles.webCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </AnimatedPressable>
          </Pressable>
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
    cursor: 'pointer' as any,
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

  // Web in-app calendar styles
  webBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  webModalCard: {
    backgroundColor: colors.canvas,
    borderRadius: 24,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1.5,
    borderColor: colors.field.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  webHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  webHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webHeaderTitle: {
    color: colors.ink.title,
    fontWeight: '700',
  },
  webCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  quickPresetsContainer: {
    marginBottom: spacing.md,
  },
  quickPresetsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ink.label,
    marginBottom: 6,
  },
  quickPresetsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.field.bg,
    borderWidth: 1,
    borderColor: colors.field.border,
  },
  presetChipSuggested: {
    backgroundColor: '#DDEBD6',
    borderColor: colors.brand.forest,
  },
  presetChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink.title,
  },
  presetChipTextSuggested: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.brand.forest,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: 4,
  },
  monthTitleText: {
    color: colors.ink.title,
    fontSize: 16,
    fontWeight: '700',
  },
  navArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.field.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.field.border,
  },
  weekHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  weekDayHeaderCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: 4,
  },
  weekDayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.placeholder,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCellWrapper: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButton: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  dayButtonToday: {
    borderWidth: 1.5,
    borderColor: colors.brand.forest,
  },
  dayButtonChosen: {
    backgroundColor: colors.brand.forest,
  },
  dayButtonPast: {
    opacity: 0.25,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.ink.title,
  },
  dayButtonTextToday: {
    fontWeight: '700',
    color: colors.brand.forest,
  },
  dayButtonTextChosen: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dayButtonTextPast: {
    color: colors.placeholder,
  },
  webFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
    paddingTop: spacing.xs,
  },
  webCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  webCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink.slateSoft,
  },
});
