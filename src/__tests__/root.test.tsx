// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Root } from "../root";
import { act, mount } from "./dom";
import { mockMatchMedia } from "./match-media";

beforeEach(() => {
  vi.useFakeTimers();
  mockMatchMedia(false);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const typeId = (container: HTMLElement, value: string) => {
  const input = container.querySelector<HTMLInputElement>("input[name='user-id']");
  if (!input) {
    throw new Error("ID input not rendered");
  }
  act(() => {
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

test("shows no result before an ID is entered", () => {
  const { container, unmount } = mount(<Root />);
  expect(container.textContent).toContain("Enter your ID");
  expect(container.textContent).not.toContain("Yes!");
  expect(container.textContent).not.toContain("No known pattern");
  unmount();
});

test("shows the result for an entered ID after the debounce delay", () => {
  const { container, unmount } = mount(<Root />);
  typeId(container, "  01956e98-8470-70ac-a4f3-febf7dc79f22  ");
  expect(container.textContent).not.toContain("v7 UUID");

  act(() => {
    vi.advanceTimersByTime(500);
  });
  expect(container.textContent).toContain("v7 UUID");
  // Surrounding whitespace is trimmed before parsing
  expect(container.querySelector("article code")?.textContent).toBe(
    "01956e98-8470-70ac-a4f3-febf7dc79f22",
  );
  unmount();
});

test("hides the result again when the input is cleared", () => {
  const { container, unmount } = mount(<Root />);
  typeId(container, "12345");
  act(() => {
    vi.advanceTimersByTime(500);
  });
  expect(container.textContent).toContain("auto-incrementing integer");

  typeId(container, "   ");
  act(() => {
    vi.advanceTimersByTime(500);
  });
  expect(container.textContent).not.toContain("auto-incrementing integer");
  unmount();
});

test("submitting the form does not navigate", () => {
  const { container, unmount } = mount(<Root />);
  const event = new Event("submit", { bubbles: true, cancelable: true });
  act(() => {
    container.querySelector("form")?.dispatchEvent(event);
  });
  expect(event.defaultPrevented).toBe(true);
  unmount();
});
