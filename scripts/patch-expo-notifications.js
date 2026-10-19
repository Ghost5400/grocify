// scripts/patch-expo-notifications.js
/* eslint-disable @typescript-eslint/no-require-imports */
// Patches expo-notifications to prevent crashing in Expo Go on Android where ExpoTopicSubscriptionModule is absent.

const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(
  __dirname,
  '../node_modules/expo-notifications/build/TopicSubscriptionModule.android.js'
);

if (fs.existsSync(targetFile)) {
  const content = fs.readFileSync(targetFile, 'utf8');
  const targetPattern = "export default requireNativeModule('ExpoTopicSubscriptionModule');";

  if (content.includes(targetPattern)) {
    const replacement = `import { requireOptionalNativeModule } from 'expo-modules-core';

const fallbackModule = {
    addListener: () => { },
    removeListeners: () => { },
    subscribeToTopicAsync: () => {
        return Promise.resolve(null);
    },
    unsubscribeFromTopicAsync: () => {
        return Promise.resolve(null);
    },
};

const nativeModule = requireOptionalNativeModule('ExpoTopicSubscriptionModule');
export default nativeModule ?? fallbackModule;`;

    const newContent = content.replace(
      "import { requireNativeModule } from 'expo-modules-core';\n" + targetPattern,
      replacement
    );

    fs.writeFileSync(targetFile, newContent, 'utf8');
    console.log('[patch-expo-notifications] Successfully patched TopicSubscriptionModule.android.js');
  } else {
    console.log('[patch-expo-notifications] TopicSubscriptionModule.android.js already patched or using different syntax');
  }
} else {
  console.log('[patch-expo-notifications] expo-notifications not found, skipping patch');
}
