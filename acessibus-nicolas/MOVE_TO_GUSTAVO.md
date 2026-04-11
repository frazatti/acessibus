# Move to Gustavo's project

This file is a migration reference, not a full source transplant. The recommended approach is:

1. Keep Gustavo's Expo mobile app as the primary codebase.
2. Use Nicolás' app only as a source of UI/UX ideas, type models, and navigation concepts.
3. Do not migrate browser-only Gemini live audio code or Firebase auth directly.

## Useful items for migration

- `acessibus/src/components/Header.tsx` and `acessibus/src/components/FooterNav.tsx`
  - Good navigation and profile button patterns.
  - Useful as inspiration for mobile header and bottom navigation components.
- `acessibus/src/components/WaveformDisplay.tsx`
  - Good voice-listening visualization concept.
  - Reuse as a design idea for an Expo-compatible animated waveform.
- `acessibus/src/pages/HomePage.tsx`
  - Useful UX reference for a voice-first home screen with big controls and clear status text.
  - Keep the interaction flow concept, but reimplement using Gustavo's mobile audio recording and backend transcription.
- `acessibus/src/constants.ts` and `acessibus/src/types.ts`
  - Useful type/data model ideas for bus lines, user state, recents, and favorites.

## Not recommended to migrate now

- `acessibus/src/services/geminiService.ts`
  - Browser Web Audio + Gemini live session code is not directly portable to Expo mobile.
  - Keep it as a future enhancement, not part of the current migration.
- `acessibus/src/pages/Auth.ts` and `acessibus/src/pages/firebase.ts`
  - Firebase auth is a different architecture from Gustavo's current backend.
  - Do not migrate the Firebase flow unless you intentionally switch the whole app to Firebase.
- Full web UI and Tailwind markup
  - The web-specific React/Tailwind structure is not reusable in React Native.
  - Only the UX concepts should be preserved.

## Migration strategy

- Phase 1: Modernize Gustavo's mobile app
  - Keep Gustavo's current Expo app, voice recording, backend `/transcribe`, search, recents, favorites, and profile flows.
  - Add TypeScript incrementally, starting with shared components, context, and service layers.
  - Improve accessibility, voice feedback, and error handling.

- Phase 2: Extract design and UX ideas from Nicolás
  - Reuse the bottom navigation, header/profile pattern, and voice screen layout as inspiration.
  - Reuse type modeling ideas from `types.ts` and `constants.ts`.

- Phase 3: Future enhancement
  - Treat `geminiService.ts` as a separate future feature for advanced voice assistant capabilities.
  - Treat `agent/acessibus/agent.py` as an independent transit assistant prototype.

> NOTE: This is a migration guide comment file. After moving the relevant functionality into Gustavo's project, this file can be deleted.
