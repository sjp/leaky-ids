import { expect, test } from "vitest";
import { prerender } from "../main";

// Runs in the default node environment, as Vite's prerender step does.
test("prerenders the full page without a DOM", async () => {
  const { html } = await prerender({});
  expect(html).toContain("Is my ID leaky?");
  expect(html).toContain("Enter your ID");
  expect(html).toContain("Built by sjp");
  expect(html).toContain("https://github.com/sjp/leaky-ids");
  // No system preference can be read on the server, so the toggle starts light
  expect(html).toContain("theme-toggle--untoggled");
});
