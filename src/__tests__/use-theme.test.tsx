// @vitest-environment happy-dom
import { afterEach, expect, test, vi } from "vitest";
import { render as renderToString } from "preact-render-to-string";
import { useMediaQuery, useTheme } from "../hooks/use-theme";
import { act, mount } from "./dom";
import { mockMatchMedia } from "./match-media";

afterEach(() => {
  vi.restoreAllMocks();
  delete document.documentElement.dataset.theme;
});

const MediaQuery = (props: { initializeWithValue?: boolean; defaultValue?: boolean }) => (
  <output>{String(useMediaQuery("(prefers-color-scheme: dark)", props))}</output>
);

test("useMediaQuery - reflects the current media query state", () => {
  mockMatchMedia(true);
  const { container, unmount } = mount(<MediaQuery />);
  expect(container.textContent).toBe("true");
  unmount();
});

test("useMediaQuery - updates when the media query changes", () => {
  const media = mockMatchMedia(false);
  const { container, unmount } = mount(<MediaQuery />);
  expect(container.textContent).toBe("false");

  act(() => {
    media.setMatches(true);
  });
  expect(container.textContent).toBe("true");
  unmount();
});

test("useMediaQuery - removes its listener on unmount", () => {
  const { mediaQueryList } = mockMatchMedia(false);
  const removeEventListener = vi.spyOn(mediaQueryList, "removeEventListener");
  const { unmount } = mount(<MediaQuery />);
  expect(removeEventListener).not.toHaveBeenCalled();
  unmount();
  expect(removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
});

test("useMediaQuery - uses the default value until effects run when not initializing", () => {
  mockMatchMedia(false);
  // Server rendering never runs effects, exposing the initial state.
  expect(renderToString(<MediaQuery initializeWithValue={false} defaultValue />)).toContain("true");
  expect(renderToString(<MediaQuery initializeWithValue={false} />)).toContain("false");
});

const ThemeProbe = () => {
  const { theme, systemTheme, setTheme } = useTheme();
  return (
    <>
      <output>{`${theme}/${systemTheme}`}</output>
      <button
        type="button"
        onClick={() => {
          setTheme("dark");
        }}
      >
        dark
      </button>
    </>
  );
};

test("useTheme - follows the system preference", () => {
  const media = mockMatchMedia(true);
  const { container, unmount } = mount(<ThemeProbe />);
  expect(container.querySelector("output")?.textContent).toBe("dark/dark");
  expect(document.documentElement.dataset.theme).toBe("dark");

  act(() => {
    media.setMatches(false);
  });
  expect(container.querySelector("output")?.textContent).toBe("light/light");
  expect(document.documentElement.dataset.theme).toBe("light");
  unmount();
});

test("useTheme - can be overridden independently of the system preference", () => {
  const media = mockMatchMedia(false);
  const { container, unmount } = mount(<ThemeProbe />);

  act(() => {
    container.querySelector("button")?.click();
  });
  expect(container.querySelector("output")?.textContent).toBe("dark/light");
  expect(document.documentElement.dataset.theme).toBe("dark");

  // A later system change takes precedence again
  act(() => {
    media.setMatches(true);
  });
  act(() => {
    media.setMatches(false);
  });
  expect(container.querySelector("output")?.textContent).toBe("light/light");
  unmount();
});
