[English](README_EN.md)

# Qwik 2048 Game

A classic 2048 number game built with the Qwik framework.

## Features

- Uses Qwik framework in CSR (Client Side Rendering) mode
- Complete 2048 game logic implementation
- Supports keyboard controls (arrow keys)
- Chinese interface
- Responsive design

## Game Rules

1. Use arrow keys to move the tiles
2. When two tiles with the same number collide, they merge into one
3. Goal: Create the number 2048!

## Tech Stack

- **Framework**: Qwik 1.14.1
- **Build Tool**: Vite 7.0.4
- **Type Checking**: TypeScript 5.8.3
- **Development Mode**: CSR (Client Side Rendering)

## Project Structure

```
src/
├── app.tsx          # Main app component with 2048 game logic
├── app.css          # Stylesheet
├── main.tsx         # App entry point
├── index.css        # Global styles
├── vite-env.d.ts    # Vite type declarations
└── assets/          # Static assets
    └── qwik.svg     # Qwik icon
```

## Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## More Info

Learn more about Qwik: [Qwik Official Site](https://qwik.dev)
Join the community: [Discord](https://qwik.dev/chat)
