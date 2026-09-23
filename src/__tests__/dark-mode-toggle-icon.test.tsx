// @vitest-environment happy-dom
import { expect, test, vi } from "vitest";
import { Classic } from "../icons/dark-mode-toggle-icon";
import { act, mount } from "./dom";

const getButton = (container: HTMLElement) => {
  const button = container.querySelector("button");
  if (!button) {
    throw new Error("toggle button not rendered");
  }
  return button;
};

test("renders defaults when no props are given", () => {
  const { container, unmount } = mount(<Classic />);
  const button = getButton(container);
  expect(button.getAttribute("title")).toBe("Toggle theme");
  expect(button.getAttribute("aria-label")).toBe("Toggle theme");
  expect(button.classList.contains("theme-toggle")).toBe(true);
  expect(button.classList.contains("theme-toggle--toggled")).toBe(false);
  expect(button.classList.contains("theme-toggle--untoggled")).toBe(false);
  expect(button.style.getPropertyValue("--theme-toggle__classic--duration")).toBe("500ms");
  expect(container.querySelector("clipPath")?.id).toBe("a");
  unmount();
});

test("applies modifier classes, custom duration, id prefix and children", () => {
  const { container, unmount } = mount(
    <Classic toggled forceMotion reversed duration={250} idPrefix="x-" className="secondary">
      <span>child</span>
    </Classic>,
  );
  const button = getButton(container);
  for (const cls of [
    "theme-toggle--toggled",
    "theme-toggle--force-motion",
    "theme-toggle--reversed",
    "secondary",
  ]) {
    expect(button.classList.contains(cls)).toBe(true);
  }
  expect(button.style.getPropertyValue("--theme-toggle__classic--duration")).toBe("250ms");
  expect(container.querySelector("clipPath")?.id).toBe("x-a");
  expect(container.querySelector("g")?.outerHTML).toContain("url(#x-a)");
  expect(button.querySelector("span")?.textContent).toBe("child");
  unmount();
});

test("marks an explicitly untoggled button", () => {
  const { container, unmount } = mount(<Classic toggled={false} />);
  expect(getButton(container).classList.contains("theme-toggle--untoggled")).toBe(true);
  unmount();
});

test.each([
  [undefined, true],
  [false, true],
  [true, false],
])("clicking when toggled=%s reports toggled=%s", (toggled, expected) => {
  const onToggled = vi.fn<(toggled: boolean) => void>();
  const { container, unmount } = mount(<Classic toggled={toggled} onToggled={onToggled} />);
  act(() => {
    getButton(container).click();
  });
  expect(onToggled).toHaveBeenCalledExactlyOnceWith(expected);
  unmount();
});

test("clicking without a handler does nothing", () => {
  const { container, unmount } = mount(<Classic />);
  expect(() => {
    getButton(container).click();
  }).not.toThrow();
  unmount();
});
