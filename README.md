# takeUflow

Mobile-first DSA practice tracker built with React + TypeScript + Vite.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## Features

- 115 DSA problems across 16 topics
- Track solved problems with localStorage
- Streak tracking
- Notes per problem
- Bookmarks
- Search and filter by difficulty, topic, company
- Focus Mode — one problem at a time, fullscreen
- Dark and light mode
- PWA — installable on mobile
- Fully offline after first load

## Stack

- React 18
- TypeScript
- Vite
- Zustand (state + localStorage)
- vite-plugin-pwa (PWA + offline)
- Google Fonts (Syne + DM Mono)

## Project Structure

```
src/
  data/         problems.json
  store/        useStore.ts (Zustand)
  types/        index.ts
  components/   reusable UI
  pages/        5 screens
  hooks/        useStreak, useProgress, useSearch
  utils/        helpers
```
