
# Mobile Setup Instructions

## Setup Steps

1. **Export to GitHub**: Click "Export to GitHub" button and clone your repository
2. **Install dependencies**: Run `npm install`
3. **Initialize Capacitor**: Run `npx cap init` (already configured)
4. **Add iOS platform**: Run `npx cap add ios`
5. **Build the project**: Run `npm run build`
6. **Sync with native platforms**: Run `npx cap sync`
7. **Run on iOS**: Run `npx cap run ios` (requires macOS with Xcode)

## Development Workflow

- After making changes in Lovable, pull from GitHub
- Run `npm run build` to build the latest changes
- Run `npx cap sync` to sync changes to native platforms
- Use `npx cap run ios` to test on device/simulator

## Features Included

- ✅ Responsive design optimized for mobile
- ✅ Safe area insets for iPhone notch/Dynamic Island
- ✅ Touch-friendly interface
- ✅ iOS-specific optimizations
- ✅ Splash screen configuration
- ✅ Native app performance

## Requirements

- macOS with Xcode (for iOS development)
- iOS Simulator or physical iOS device
- Apple Developer Account (for device testing)

Read more: https://lovable.dev/blogs/TODO
