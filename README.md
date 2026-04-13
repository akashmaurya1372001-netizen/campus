# Campus Pulse AI

🚀 Smart University Feedback & Poll Platform

A scalable, modern, real-time MERN application where students and professionals can post issues, create polls, and analyze campus trends with AI-enhanced insights.

## Features

- **Real-time Updates**: Powered by Socket.io for live feed updates.
- **AI Sentiment Analysis**: Automatically classifies issues as positive, negative, or urgent.
- **AI Poll Generator**: Generates poll options based on a topic.
- **AI Moderation**: Blocks toxic or inappropriate comments.
- **Analytics Dashboard**: Visualizes vote distributions and trending posts.
- **Role-based Access**: Differentiates between students and professionals.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Zustand, React Router, Chart.js
- **Backend**: Node.js, Express, MongoDB (In-memory fallback), Socket.io
- **AI**: Google Gemini API

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   MONGO_URI=your_mongodb_uri # Optional, uses in-memory DB if not provided
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

### Running the App

Start the development server (runs both frontend and backend concurrently):

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Deployment

The app is configured to be deployed as a single full-stack application.
Build the app using:

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```

# Deployment Guide

## Production Build

1. **Build Frontend and Backend:**

   ```sh
   npm run build:all
   ```

   - This creates the frontend in `dist/` and compiles backend to `backend-dist/`.

2. **Set Environment Variables:**
   - Create a `.env` file in the project root with:
     ```env
     NODE_ENV=production
     PORT=3000
     MONGO_URI=your_production_mongodb_uri
     JWT_SECRET=your_jwt_secret
     GEMINI_API_KEY=your_google_gemini_api_key
     ```

3. **Start the Production Server:**
   ```sh
   npm run start:prod
   ```

   - This runs the backend from `backend-dist/server.js` and serves the frontend from `dist/`.

## Scripts

- `npm run build:all` – Build frontend and backend for production
- `npm run start:prod` – Start production server
- `npm run clean` – Remove build outputs

## Notes

- All API endpoints are available under `/api/*`.
- The frontend is served at the root (`/`).
- WebSocket and socket.io work out of the box in production.

## Vercel Deployment

1. Refactor backend endpoints into `/api` as serverless functions (see `/api/posts.ts`, `/api/auth.ts`n).
2. Build the frontend: `npm run build` (Vercel will do this automatically).
3. Push to GitHub and connect your repo to Vercel.
4. Set environment variables (`MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, etc.) in the Vercel dashboard.
5. Add `vercel.json` for routing.
6. WebSockets/socket.io are NOT supported on Vercel serverless. For real-time, use a third-party service or a different backend host.

See `/api/posts.ts` and `/api/auth.ts` for Vercel-compatible API handler examples.
