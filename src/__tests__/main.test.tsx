// @vitest-environment happy-dom
import { afterEach, expect, test, vi } from "vitest";
import { mockMatchMedia } from "./match-media";

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.resetModules();
});

test("throws when there is no #app element to hydrate", async () => {
  await expect(import("../main")).rejects.toThrow("Could not find the #app element");
});

test("hydrates the app into #app", async () => {
  mockMatchMedia(false);
  const app = document.createElement("div");
  app.id = "app";
  document.body.append(app);

  await import("../main");
  await vi.waitFor(() => {
    expect(app.querySelector("input[name='user-id']")).not.toBeNull();
  });
});
