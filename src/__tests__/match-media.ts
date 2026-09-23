import { vi } from "vitest";

class FakeMediaQueryList extends EventTarget implements MediaQueryList {
  readonly media = "";
  onchange = null;
  matches: boolean;

  constructor(matches: boolean) {
    super();
    this.matches = matches;
  }

  addListener() {
    throw new Error("addListener is deprecated and should not be used");
  }

  removeListener() {
    throw new Error("removeListener is deprecated and should not be used");
  }
}

// A controllable stand-in for window.matchMedia that reports a single
// `matches` value for every query and lets tests fire "change" events.
export const mockMatchMedia = (initial: boolean) => {
  const mediaQueryList = new FakeMediaQueryList(initial);
  vi.spyOn(window, "matchMedia").mockReturnValue(mediaQueryList);

  return {
    mediaQueryList,
    setMatches: (next: boolean) => {
      mediaQueryList.matches = next;
      mediaQueryList.dispatchEvent(new Event("change"));
    },
  };
};
