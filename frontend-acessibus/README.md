# Acessibus Frontend

This repository contains the Expo-powered React Native frontend for the Acessibus app.
The app has been migrated to TypeScript and uses React Navigation, Axios, and Expo libraries.

## Features

- Expo React Native app
- TypeScript support with strict type checking
- Authentication flow with login, signup, user profile, favorites, and recents
- Axios-based API client to communicate with backend services
- Context-based auth state management
- Navigation using React Navigation native stack
- Voice and media support via Expo libraries

## Prerequisites

- Node.js installed
- Expo CLI installed globally or via `npx`
- Backend API available and reachable from the device/emulator

## Environment Variables

The frontend uses a `.env` file for runtime configuration.
Create a `.env` file in `frontend-acessibus/` with at least:

```env
REACT_APP_API_URL=http://localhost:3000
```

### Notes

- `REACT_APP_API_URL` should point to the backend server base URL.
- When testing on a physical device, use your machine IP address instead of `localhost`.
- Expo automatically loads `.env` variables into the app if configured.

## Install Dependencies

From `frontend-acessibus/`:

```bash
npm install
```

## Run the App

Launch the Expo development environment:

```bash
npm start
```

Then choose a target device:

- `a` to open on Android emulator/device
- `i` to open on iOS simulator/device
- Scan the QR code with Expo Go for physical devices

## Type Checking and Linting

Run TypeScript type checking:

```bash
npm run type-check
```

Run ESLint over source files:

```bash
npm run lint
```

## Project Structure

- `App.tsx` - root app component and navigation setup
- `src/context/AuthContext.tsx` - auth state provider
- `src/screens/` - app screens for login, home, recents, favorites, user, and update
- `src/services/Api.ts` - Axios instance configured with `REACT_APP_API_URL`
- `src/types/` - shared TypeScript interfaces and navigation typings

## Notes

- The app uses Expo SDK 54 with React 19 and React Native 0.81.4.
- Ensure backend routes are available before testing auth-related flows.
- If you update `tsconfig.json` paths, restart the Metro bundler to apply changes.
