# Acessibus Backend

This repository contains the backend server for the Acessibus app.
It is an Express + TypeScript service that exposes user, line, interaction, and voice routes.

## Features

- Express API server with JSON body parsing and request logging
- CORS enabled for cross-origin requests
- Prisma + MariaDB datasource powered by `DATABASE_URL`
- JWT-based auth support using `JWT_SECRET`
- Google Speech integration via `GOOGLE_APPLICATION_CREDENTIALS`
- File upload support with Multer for voice transcription
- Test support with Vitest

## Prerequisites

- Node.js installed
- MySQL / MariaDB database available
- Google Cloud project with Speech-to-Text enabled
- Service account key JSON for Google credentials

## Environment Variables

Create a `.env` file in `backend-acessibus/` with the following values:

```env
DATABASE_URL="mysql://root:admin@localhost:3306/db_acessibus"
JWT_SECRET="your-jwt-secret"
GOOGLE_APPLICATION_CREDENTIALS="./google-credentials.json"
PORT=3000
```

### Notes
- `DATABASE_URL` must point to your MariaDB/MySQL database.
- `JWT_SECRET` is used for signing and verifying JSON Web Tokens.
- `GOOGLE_APPLICATION_CREDENTIALS` should point to the downloaded Google Cloud service account JSON file.
- `PORT` is optional; the default is `3000`.

## Google Credentials Setup

1. Open the Google Cloud Console: https://console.cloud.google.com
2. Create or select a project.
3. Enable **Cloud Speech-to-Text API**.
4. Go to **IAM & Admin > Service Accounts**.
5. Create a new service account.
6. Assign the **Cloud Speech Client** role or equivalent.
7. Create a new JSON key and download it.
8. Save the file to `backend-acessibus/google-credentials.json`.
9. Set `GOOGLE_APPLICATION_CREDENTIALS="./google-credentials.json"` in `.env`.

> Do not commit the JSON key to git.

## Install Dependencies

From `backend-acessibus/`:

```bash
npm install
```

## Running the Server

Start the development server with:

```bash
npm run dev
```

This runs `tsx watch server.ts` and serves the backend on `http://localhost:3000` by default.

## API Entry Points

The backend routes are mounted in `app.ts`:

- `/` user routes (`api/routes/UsuarioRoutes.ts`)
- `/` line routes (`api/routes/LinhaRoutes.ts`)
- `/` interaction routes (`api/routes/InteracaoRoutes.ts`)
- `/` voice routes (`api/routes/VoiceRoutes.ts`)

A 404 JSON response is returned for unknown routes.

## Database Configuration

Prisma uses `prisma.config.ts` and loads `DATABASE_URL` from the environment.

If you need to run Prisma commands, install Prisma globally or use npx:

```bash
npx prisma generate
npx prisma migrate dev
```

## Testing

Run tests with:

```bash
npm test
```

Or watch tests with:

```bash
npm run test:watch
```

## Useful Files

- `app.ts`: Express app creation and middleware setup
- `server.ts`: App startup and port configuration
- `prisma.config.ts`: Prisma datasource config
- `api/`: API routes/controllers middleware
- `tests/`: unit and integration tests

## Notes

- The backend uses `dotenv/config` to load `.env` automatically.
- The server logs incoming requests and request bodies when present.
- The backend listens on `0.0.0.0`, so it is accessible from the local network.
