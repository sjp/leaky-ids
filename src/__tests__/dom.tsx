import type { ComponentChild } from "preact";
import { render } from "preact";
import { act as preactAct } from "preact/test-utils";

// preact's act() returns a thenable even for synchronous callbacks; these
// tests only ever use it synchronously, so the result is deliberately ignored.
export const act = (callback: () => void) => {
  void preactAct(callback);
};

// Minimal mount helper for tests running under the happy-dom environment.
export const mount = (vnode: ComponentChild) => {
  const container = document.createElement("div");
  document.body.append(container);
  act(() => {
    render(vnode, container);
  });

  return {
    container,
    rerender: (next: ComponentChild) => {
      act(() => {
        render(next, container);
      });
    },
    unmount: () => {
      act(() => {
        render(null, container);
      });
      container.remove();
    },
  };
};
