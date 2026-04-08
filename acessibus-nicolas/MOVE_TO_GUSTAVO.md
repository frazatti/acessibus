# Move to Gustavo's project

The following files and features in this directory are the main candidates to migrate into Gustavo's mobile app:

- `acessibus/src/services/geminiService.ts` — Gemini real-time voice session logic, audio encoding/decoding, and model interaction
- `acessibus/src/pages/HomePage.tsx` — Live voice/chat UI and Gemini session handling
- `acessibus/src/components/WaveformDisplay.tsx` — Audio waveform visualization for voice interaction
- `acessibus/src/components/Header.tsx` and `acessibus/src/components/FooterNav.tsx` — navigation and mobile-like app structure
- `acessibus/src/pages/Auth.ts` and `acessibus/src/pages/firebase.ts` — authentication flow logic (adjusted to mobile backend auth)
- `acessibus/src/pages/SignInPage.tsx`, `RegisterPage.tsx`, `ProfilePage.tsx`, `RecentsPage.tsx`, `FavoritesPage.tsx` — mobile UI pages/user flows
- `acessibus/src/constants.ts` and `acessibus/src/types.ts` — shared mock data definitions and type models

> NOTE: This is a migration guide comment file. After moving the relevant functionality into Gustavo's project, this file can be deleted.
