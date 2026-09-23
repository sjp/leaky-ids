// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { useDebounce } from "../hooks/use-debounce";
import { act, mount } from "./dom";

const Debounced = ({ value, delay }: { value: string; delay: number }) => (
  <output>{useDebounce(value, delay)}</output>
);

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test("returns the initial value immediately", () => {
  const { container, unmount } = mount(<Debounced value="a" delay={500} />);
  expect(container.textContent).toBe("a");
  unmount();
});

test("only updates once the delay has elapsed", () => {
  const { container, rerender, unmount } = mount(<Debounced value="a" delay={500} />);

  rerender(<Debounced value="b" delay={500} />);
  act(() => {
    vi.advanceTimersByTime(499);
  });
  expect(container.textContent).toBe("a");

  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(container.textContent).toBe("b");
  unmount();
});

test("restarts the delay when the value changes again", () => {
  const { container, rerender, unmount } = mount(<Debounced value="a" delay={500} />);

  rerender(<Debounced value="b" delay={500} />);
  act(() => {
    vi.advanceTimersByTime(400);
  });
  rerender(<Debounced value="c" delay={500} />);
  act(() => {
    vi.advanceTimersByTime(400);
  });
  // "b" was superseded before its timer fired
  expect(container.textContent).toBe("a");

  act(() => {
    vi.advanceTimersByTime(100);
  });
  expect(container.textContent).toBe("c");
  unmount();
});

test("clears the pending timer on unmount", () => {
  const { unmount } = mount(<Debounced value="a" delay={500} />);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
