// @vitest-environment happy-dom
import { afterEach, expect, test, vi } from "vitest";
import { Header } from "../header";
import { act, mount } from "./dom";
import { mockMatchMedia } from "./match-media";

afterEach(() => {
  vi.restoreAllMocks();
  delete document.documentElement.dataset.theme;
});

test("toggles between light and dark themes", () => {
  mockMatchMedia(false);
  const { container, unmount } = mount(<Header />);
  const button = container.querySelector<HTMLButtonElement>("button[aria-label='Toggle Theme']");
  expect(button).not.toBeNull();
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(button?.classList.contains("theme-toggle--untoggled")).toBe(true);

  act(() => {
    button?.click();
  });
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(button?.classList.contains("theme-toggle--toggled")).toBe(true);

  act(() => {
    button?.click();
  });
  expect(document.documentElement.dataset.theme).toBe("light");
  unmount();
});

test("starts in dark mode when the system prefers it", () => {
  mockMatchMedia(true);
  const { container, unmount } = mount(<Header />);
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(container.querySelector("button")?.classList.contains("theme-toggle--toggled")).toBe(true);
  unmount();
});
