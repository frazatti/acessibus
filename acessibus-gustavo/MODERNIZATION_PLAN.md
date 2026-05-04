# Gustavo Project Modernization Plan

## Objective
Modernize the `acessibus-gustavo` Expo mobile app so it becomes production-ready for blind and low-vision users accessing public transit. The goal is to keep Gustavo's mobile app as the primary product, improve accessibility, add TypeScript, harden backend services, and adopt a clean modular structure.

## Goals
- Keep Gustavo's Expo React Native app as the main product base.
- Add TypeScript incrementally across frontend and backend.
- Improve accessibility and voice-first UX.
- Harden the backend with validation, secure auth, and production configuration.
- Preserve only useful UI/UX patterns from Nicolás’ prototype.
- Treat browser-only Gemini live audio and Firebase auth as future enhancements.

## High-Level Phases
1. Project cleanup and baseline validation
2. TypeScript conversion and code quality
3. UX/accessibility modernization
4. Backend hardening and API alignment
5. Testing, CI, and production readiness
6. Future enhancements and agent integration

---

## Phase 1: Project Cleanup and Baseline Validation

### 1.1 Keep the right codebase
- Use the code in `acessibus-gustavo/` as the primary app.
- Do not replace Gustavo’s app with Nicolás’ full web project.
- Keep only the useful Nicolas references in `frontend-acessibus/src/nicolas-app/`.

### 1.2 Verify current core flows
- Confirm the following flows work end-to-end:
  - authentication (`/auth/login`, `/user`, `/user` update)
  - voice transcription (`/transcribe`)
  - line search (`/linha/search`)
  - recents/favorites (`/recents`, `/favorites`, `/favorite`)
- Confirm `Home.js` voice flow works with audio capture, backend upload, transcription, and TTS.

### 1.3 Prepare project scaffolding
- Add README sections describing the mobile app architecture.
- Add a `docs/` or `acessibus-gustavo/docs/` note that this is the main product.
- Remove or mark unused code if it is no longer part of the modernization path.

---

## Phase 2: TypeScript Conversion and Code Quality

### 2.1 Convert frontend to TypeScript
- Rename key files to `.tsx` and `.ts` as needed.
- Start with shared modules:
  - `src/context/AuthContext.js` → `AuthContext.tsx`
  - `src/services/Api.js` → `Api.ts`
  - `src/screens/*.js` → `.tsx`
  - `src/screens/Home.js` first, then other screens.
- Add explicit types for:
  - auth state and user objects
  - API responses
  - screen props and navigation props

### 2.2 Convert backend to TypeScript
- Optionally convert Express backend to TypeScript if time allows.
- Start with typed service layers and repositories.
- Add type definitions for:
  - request bodies
  - response objects
  - middleware payloads
  - Prisma models if using generated types

### 2.3 Add linting and formatting
- Add or improve ESLint configuration.
- Add Prettier or use built-in formatting.
- Ensure lint rules cover react-native, TypeScript, and code style.
- Add a `lint` command and run it before merges.

### 2.4 Improve file structure
- Extract repeated layout into reusable components:
  - `Header`
  - `BottomNav`
  - `ScreenLayout`
- Move common button and text styles into shared modules.
- Use a centralized `src/constants/` or `src/theme/` for colors and spacing.

---

## Phase 3: UX and Accessibility Modernization

### 3.1 Improve voice-first experience
- Ensure the Home screen is clearly voice-focused.
- Use large tappable microphone button and accessible labels.
- Add more accessible status text for recording states:
  - listening
  - processing
  - success
  - error
- Make the voice interaction screen speak results reliably.

### 3.2 Improve screen accessibility
- Add `accessibilityLabel` and `accessibilityRole` everywhere.
- Add proper touch target sizes (>44x44) for buttons.
- Ensure the app works well with TalkBack / VoiceOver.
- Use simple and clear text for all messages.

### 3.3 Align UI with product flows
- Confirm the following screens exist and follow docs:
  - Home (voice search)
  - Login / Sign up
  - Profile
  - Update profile
  - Recents
  - Favorites
- Standardize navigation and header across screens.
- Use a shared bottom menu if it improves discoverability.

### 3.4 Keep useful Nicolás ideas
- Reuse `Header.tsx` and `FooterNav.tsx` as design inspiration.
- Reuse `WaveformDisplay.tsx` concept for a native waveform component.
- Reuse type concepts from `types.ts` and `constants.ts`.
- Do not use full web UI markup or Tailwind classes.

---

## Phase 4: Backend Hardening and API Alignment

### 4.1 Secure auth and session handling
- Keep JWT auth and secure storage.
- Add token expiration and refresh logic if possible.
- Improve sign-out to clear only auth-related storage.
- Add backend validation: sanitize email, password, and image data.

### 4.2 Improve API stability
- Add central error handling middleware on backend.
- Add input validation for all sensitive routes:
  - `/auth/login`
  - `/user` update
  - `/transcribe`
  - `/linha/search`
  - `/favorite`
- Confirm status codes align with expected flows:
  - `401` for unauthorized
  - `400` for bad requests
  - `404` for not found
  - `500` for server error

### 4.3 Improve production configuration
- Use environment variables for:
  - API base URL
  - JWT secret
  - database URL
  - Google Cloud Speech credentials
- Avoid hardcoded device-specific IP addresses in `Api.js`.
- Use `.env` files with `.env.example` for safe defaults.

### 4.4 Update backend routes/documentation
- Confirm existing routes are documented:
  - `POST /auth/login`
  - `POST /user`
  - `PUT /user`
  - `GET /user`
  - `POST /transcribe`
  - `POST /linha/search`
  - `GET /recents`
  - `GET /favorites`
  - `POST /favorite`
- Consider adding a route alias `POST /search/audio` if you want direct docs parity.

---

## Phase 5: Testing, CI, and Production Readiness

### 5.1 Add tests
- Add frontend unit tests for:
  - auth context
  - Home screen voice behavior
  - reusable components
- Add backend tests for auth, search, and recents/favorites.
- Use Jest or similar tooling.

### 5.2 Add CI checks
- Add a lint step.
- Add a type-check step.
- Add a test step.
- Add a basic build/test workflow for the backend if possible.

### 5.3 Add production readiness items
- Add a `README.md` section describing running the mobile and backend apps.
- Add a `dev` workflow for Expo and backend simultaneously.
- Add a `release` or `build` step for the mobile app.
- Confirm the backend can run in a production-like environment.

---

## Phase 6: Future Enhancements

### 6.1 Advanced voice assistant
- Keep `acessibus-nicolas/src/services/geminiService.ts` as a future enhancement, not current code.
- Add it later if you want a browser-native Gemini live voice feature.
- For mobile, consider a server-side Gemini integration instead of direct Expo browser audio.

### 6.2 Agent and transit intelligence
- Keep `agent/acessibus/agent.py` as a separate transit assistant prototype.
- Plan integration later if you want an AI assistant for route guidance.

### 6.3 Optional Firebase features
- Firebase is optional, not required.
- Use Firebase later only if you want social login or managed auth.
- Do not migrate Firebase auth now.

---

## Recommended Task Breakdown

### Step 1: TypeScript and code quality ✅ COMPLETED
- ✅ Created `tsconfig.json`.
- ✅ Converted `src/context/AuthContext.js` → `AuthContext.tsx`.
- ✅ Converted `src/services/Api.js` → `Api.ts`.
- ✅ Converted `src/screens/Home.js` → `Home.tsx`.
- ✅ Added `.eslintrc.json` for code quality.
- ✅ Added `.prettierrc` for code formatting.
- ✅ Updated `package.json` with TS and linting dev dependencies.

**Next**: Convert remaining screens (`LoginScreen.js`, `SignUp.js`, `Recents.js`, `Favorites.js`, `User.js`, `UpdateUser.js`) to `.tsx`. Run `npm install` to ensure dependencies are available.

### Step 2: Accessibility and UX
- Add accessibility labels and roles.
- Standardize the header/footer.
- Add voice state copy and fallback TTS.
- Ensure `Home` has a clear voice capture flow.

### Step 3: Backend improvements
- Add input validation and centralized error handling.
- Move config into environment variables.
- Replace hardcoded base URLs with env-driven configuration.

### Step 4: Testing
- Add tests for auth state and screen flows.
- Add API tests for backend endpoints.
- Add CI lint/type/test pipeline.

### Step 5: Release readiness
- Add `README` instructions.
- Verify mobile app runs in Expo with correct backend connectivity.
- Verify backend runs in a production-like configuration.

---

## Notes
- The current app already has the right product direction: voice-first interaction, mobile access, and user recents/favorites.
- The modernization plan is primarily about making the existing Gustavo app robust, typed, accessible, and production-ready.
- Nicolás’ project should remain only as inspiration, not as a direct migration source.

---

## Useful file references
- `acessibus-gustavo/frontend-acessibus/App.js`
- `acessibus-gustavo/frontend-acessibus/src/context/AuthContext.js`
- `acessibus-gustavo/frontend-acessibus/src/screens/Home.js`
- `acessibus-gustavo/frontend-acessibus/src/services/Api.js`
- `acessibus-gustavo/backend-acessibus/api/routes/VoiceRoutes.js`
- `acessibus-gustavo/backend-acessibus/api/controllers/VoiceController.js`
- `acessibus-gustavo/backend-acessibus/api/services/VoiceService.js`
- `acessibus-gustavo/backend-acessibus/api/routes/LinhaRoutes.js`
- `acessibus-gustavo/backend-acessibus/api/controllers/LinhaController.js`
- `acessibus-gustavo/frontend-acessibus/src/nicolas-app/` (reference only)
