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
    withTiming: (toValue) => toValue,
    withSpring: (toValue) => toValue,
    withSequence: (...args) => args[0],
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
  return {
    __esModule: true,
    default: function SvgMock(props) {
      return React.createElement(View, props);
    },
    Svg: function SvgMock(props) {
      return React.createElement(View, props);
    },
    Defs: function DefsMock(props) {
      return React.createElement(View, props);
    },
    LinearGradient: function LinearGradientMock(props) {
      return React.createElement(View, props);
    },
    Stop: function StopMock(props) {
      return React.createElement(View, props);
    },
    Rect: function RectMock(props) {
      return React.createElement(View, props);
    },
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
