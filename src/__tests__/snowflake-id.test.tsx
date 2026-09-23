// @vitest-environment happy-dom
import { expect, test } from "vitest";
import { SnowflakeId } from "../snowflake-id";
import { parseSnowflakeId } from "../parsing";
import { freezeClock } from "./clock";
import { act, mount } from "./dom";

freezeClock();

const ID = "1060911982267932672";

const mountSnowflake = () => {
  const parsed = parseSnowflakeId(ID);
  if (!parsed) {
    throw new Error(`expected ${ID} to parse as a snowflake`);
  }
  return mount(<SnowflakeId id={parsed.id} candidates={parsed.candidates} />);
};

const getSelect = (container: HTMLElement) => {
  const select = container.querySelector("select");
  if (!select) {
    throw new Error("platform select not rendered");
  }
  return select;
};

const changeSelect = (select: HTMLSelectElement, value: string) => {
  act(() => {
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
};

test("switching platform shows that platform's decoded date", () => {
  const { container, unmount } = mountSnowflake();
  const select = getSelect(container);
  expect(select.value).toBe("twitter");
  expect(container.textContent).toContain("2018-11-09T15:08:22.021Z");

  changeSelect(select, "discord");
  expect(select.value).toBe("discord");
  expect(container.textContent).toContain("2023-01-06T13:25:27.364Z");

  changeSelect(select, "instagram");
  expect(container.textContent).toContain("2015-08-27T15:49:45.403Z");
  unmount();
});

test("ignores a selection that is not one of the candidates", () => {
  const { container, unmount } = mountSnowflake();
  const select = getSelect(container);
  const before = container.querySelector("td")?.textContent;

  changeSelect(select, "mastodon");
  expect(container.querySelector("td")?.textContent).toBe(before);
  unmount();
});
