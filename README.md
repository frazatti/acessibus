# Acessibus

Acessibus is an accessibility-focused mobility support platform that connects users with bus line information, user interactions, favorite routes, and voice-based features. This repository contains both the frontend Expo app and the backend Express + TypeScript API service.

## Project Objective

The goal of Acessibus is to provide a mobile-friendly experience for users to:
- authenticate and manage their profile
- browse and favorite bus lines
- review recent interactions
- use voice functionality for audio capture and transcription
- access the backend API securely via JWT authentication

## Repository Structure

- `frontend-acessibus/` - Expo React Native frontend migrated to TypeScript
- `backend-acessibus/` - Express backend with Prisma, JWT auth, and Google Speech integration
- `agent/` - local agent support files
- `docs/` - product requirements and screen documentation

## Getting Started

1. Set up the backend first by configuring `backend-acessibus/.env` and running `npm install`.
2. Set up the frontend by configuring `frontend-acessibus/.env` and running `npm install`.
3. Start the backend API and then launch the Expo frontend.

## Notes

- The frontend uses `REACT_APP_API_URL` to connect to the backend.
- The backend relies on `DATABASE_URL`, `JWT_SECRET`, and `GOOGLE_APPLICATION_CREDENTIALS`.
- Each package folder includes its own `README.md` with detailed installation and runtime instructions.

