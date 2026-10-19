/* eslint-disable @typescript-eslint/no-require-imports */
// jest.setup.js
// Setup file for Jest tests under Expo / React Native

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  return {
    __esModule: true,
    default: {
      View,
      Text,
      createAnimatedComponent: (c) => c,
    },
    useSharedValue: (init) => ({ value: init }),
    useAnimatedStyle: (fn) => fn(),
    withTiming: (toValue, _opts, cb) => { if (cb) cb(true); return toValue; },
    withSpring: (toValue) => toValue,
    withSequence: (...args) => args[0],
    runOnJS: (fn) => fn,
    Easing: {
      bezier: () => () => 0,
      linear: () => 0,
    },
    useReducedMotion: () => false,
  };
});

// Mock lucide-react-native via Proxy
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        return function MockLucideIcon(props) {
          return React.createElement(View, {
            ...props,
            testID: props.testID || `icon-${String(prop)}`,
          });
        };
      },
    }
  );
});

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const svgEl = (name) =>
    function SvgElement(props) {
      return React.createElement(View, { testID: props.testID || `svg-${name}` });
    };
  return {
    __esModule: true,
    default: svgEl('Svg'),
    Svg: svgEl('Svg'),
    Path: svgEl('Path'),
    Circle: svgEl('Circle'),
    Ellipse: svgEl('Ellipse'),
    Line: svgEl('Line'),
    Polygon: svgEl('Polygon'),
    Polyline: svgEl('Polyline'),
    Rect: svgEl('Rect'),
    G: svgEl('G'),
    Text: svgEl('Text'),
    Use: svgEl('Use'),
    Image: svgEl('Image'),
    Symbol: svgEl('Symbol'),
    Defs: svgEl('Defs'),
    LinearGradient: svgEl('LinearGradient'),
    RadialGradient: svgEl('RadialGradient'),
    Stop: svgEl('Stop'),
    ClipPath: svgEl('ClipPath'),
    Pattern: svgEl('Pattern'),
    Mask: svgEl('Mask'),
  };
});

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Mock @react-native-community/datetimepicker
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockDateTimePicker(props) {
    return React.createElement(View, { ...props, testID: props.testID || 'mock-datetimepicker' });
  };
});

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const insets = { top: 0, left: 0, right: 0, bottom: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(insets),
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 393, height: 852 }),
  };
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    GestureHandlerRootView: ({ children, style }) =>
      React.createElement(View, { style, testID: 'gesture-handler-root-view' }, children),
    Swipeable: ({ children, renderRightActions }) =>
      React.createElement(
        View,
        { testID: 'mock-swipeable' },
        children,
        renderRightActions ? renderRightActions() : null
      ),
    PanGestureHandler: ({ children }) => children,
    TapGestureHandler: ({ children }) => children,
    State: {},
    Directions: {},
  };
});

// Mock react-native-gesture-handler/ReanimatedSwipeable
jest.mock('react-native-gesture-handler/ReanimatedSwipeable', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockComponent = React.forwardRef(function MockReanimatedSwipeable(props, ref) {
    const mockMethods = {
      close: jest.fn(),
      openRight: jest.fn(),
      openLeft: jest.fn(),
      reset: jest.fn(),
    };
    if (ref && typeof ref === 'object') {
      ref.current = mockMethods;
    }
    return React.createElement(
      View,
      { testID: props.testID || 'mock-reanimated-swipeable' },
      props.children,
      props.renderRightActions
        ? props.renderRightActions(null, null, mockMethods)
        : null
    );
  });
  return {
    __esModule: true,
    default: MockComponent,
  };
});

// Mock expo-notifications
jest.mock('expo-notifications', () => {
  const listeners = [];
  return {
    setNotificationHandler: jest.fn(),
    setNotificationChannelAsync: jest.fn().mockResolvedValue({}),
    getNotificationChannelsAsync: jest.fn().mockResolvedValue([]),
    scheduleNotificationAsync: jest.fn().mockResolvedValue('mock-notification-id-123'),
    cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(undefined),
    cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue(undefined),
    getAllScheduledNotificationsAsync: jest.fn().mockResolvedValue([]),
    getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted', granted: true }),
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted', granted: true }),
    getLastNotificationResponseAsync: jest.fn().mockResolvedValue(null),
    clearLastNotificationResponseAsync: jest.fn().mockResolvedValue(undefined),
    addNotificationResponseReceivedListener: jest.fn((cb) => {
      listeners.push(cb);
      return {
        remove: jest.fn(() => {
          const index = listeners.indexOf(cb);
          if (index !== -1) listeners.splice(index, 1);
        }),
      };
    }),
    addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
    SchedulableTriggerInputTypes: {
      DATE: 'date',
      TIME_INTERVAL: 'timeInterval',
      DAILY: 'daily',
      WEEKLY: 'weekly',
      MONTHLY: 'monthly',
      YEARLY: 'yearly',
    },
    AndroidImportance: {
      UNKNOWN: 0,
      UNSPECIFIED: 1,
      NONE: 2,
      MIN: 3,
      LOW: 4,
      DEFAULT: 5,
      HIGH: 6,
      MAX: 7,
    },
    DEFAULT_ACTION_IDENTIFIER: 'expo.modules.notifications.actions.DEFAULT',
  };
});
