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

