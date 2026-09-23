import { afterEach, beforeEach, vi } from "vitest";

// Parsers reject IDs dated more than a day ahead of Date.now(), so tests that
// parse IDs pin the clock to keep results independent of when they run.
export const NOW = new Date("2025-06-01T00:00:00.000Z");

export const ONE_DAY_MS = 86400000;

export const freezeClock = () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: NOW });
  });

  afterEach(() => {
    vi.useRealTimers();
  });
};
