# Is My ID Leaky

A small web application, intended to determine whether identifiers used in an application reveal unwanted information.

## CLI Commands

- `npm install`: Installs dependencies
- `npm run dev`: Run a development, HMR server
- `npm run build`: Production-ready build
- `npm run preview`: Run a production-like server
- `npm run lint`: Scans code for potential issues via linting
- `npm run test-dev`: Continuously runs tests, watching for changes
- `npm run test`: Runs all unit tests once

## Features

- Dark mode
- Detects and decodes the following identifier formats:
  - UUID v7 (creation time)
  - UUID v1 (creation time, node/MAC address, clock sequence)
  - ULID (creation time)
  - KSUID (creation time)
  - MongoDB ObjectId (creation time)
  - Snowflake IDs for Twitter, Discord, Instagram and Mastodon (creation time, per-platform layouts)
  - Auto-incrementing integers (record counts, enumeration)
- Shows every plausible interpretation when an ID matches more than one format
- Explains what the tool cannot detect when no pattern is found

## Tools and Libraries

This project is small in scope, intended mostly for educational purposes.

It is largely built using the following:

- [Preact](https://preactjs.com/)
- [Vite](https://vite.dev/)
- [Pico CSS](https://picocss.com/)
- [Biome](https://biomejs.dev/)

The choice of many of these libraries was to minimise the bundle size as much as possible.

Additionally the application is pre-rendered for fast initial page loads.
