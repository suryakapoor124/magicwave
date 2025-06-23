#!/bin/bash

echo "🧹 Clearing all caches..."
npm cache clean --force
rm -rf .expo
rm -rf node_modules/.cache
rm -rf ~/.expo/android-*

echo "🔄 Fixing dependencies..."
npx expo install --fix

echo "🚀 Starting fresh build..."
echo "Run this command manually:"
echo "eas build --clear-cache -p android --profile preview"

echo "✅ Cache cleared! Now run the build command above."
