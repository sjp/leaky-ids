# Is My ID Leaky

A small web application, intended to determine whether identifiers used in an application reveal unwanted information.

## CLI Commands

* `npm install`: Installs dependencies
* `npm run dev`: Run a development, HMR server
* `npm run build`: Production-ready build
* `npm run preview`: Run a production-like server
* `npm run lint`: Scans code for potential issues via linting
* `npm run test-dev`: Continuously runs tests, watching for changes
* `npm run test`: Runs all unit tests once

## Features

* Dark mode
* ULID identifiers detected and parsed
* UUID v7 identifiers similarly
* Auto-incrementing integers also handled.

## Tools and Libraries

This project is small in scope, intended mostly for educational purposes.

It is largely built using the following:

* [Preact](https://preactjs.com/)
* [Vite](https://vite.dev/)
* [Pico CSS](https://picocss.com/)
* [Biome](https://biomejs.dev/)

The choice of many of these libraries was to minimise the bundle size as much as possible.

Additionally the application is pre-rendered for fast initial page loads.
