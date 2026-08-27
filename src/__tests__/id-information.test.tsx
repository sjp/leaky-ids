import { expect, test } from "vite-plus/test";
import { render } from "preact-render-to-string";
import { IdInformation } from "../id-information";

const renderId = (id: string) => render(<IdInformation id={id} />);

test("renders the unknown result for an opaque ID", () => {
  const html = renderId("743022e7-1748-4f1a-ab7a-89c7d6e9ec42"); // v4 UUID
  expect(html).toContain("No known pattern detected");
  expect(html).not.toContain("Yes!");
});

test("renders a v7 UUID with its creation date", () => {
  const html = renderId("01956e98-8470-70ac-a4f3-febf7dc79f22");
  expect(html).toContain("v7 UUID");
  expect(html).toContain("2025-03-07T03:14:04.016Z");
});

test("renders a v1 UUID with node and clock sequence", () => {
  const html = renderId("6ba7b810-9dad-11d1-80b4-00c04fd430c8");
  expect(html).toContain("v1 UUID");
  expect(html).toContain("1998-02-04T22:13:53.151Z");
  expect(html).toContain("00:c0:4f:d4:30:c8");
  expect(html).toContain("likely a real MAC address");
});

test("renders a ULID", () => {
  const html = renderId("01JNQ93PPZC36WYPHSNPNKB1FP");
  expect(html).toContain("ULID");
  expect(html).toContain("2025-03-07T03:06:47.391Z");
});

test("renders a KSUID", () => {
  const html = renderId("0ujtsYcgvSTl8PAuAdqWYSMnLOv");
  expect(html).toContain("KSUID");
  expect(html).toContain("2017-10-10T04:00:47.000Z");
});

test("renders a MongoDB ObjectId", () => {
  const html = renderId("507f1f77bcf86cd799439011");
  expect(html).toContain("MongoDB ObjectId");
  expect(html).toContain("2012-10-17T21:13:27.000Z");
});

test("renders an auto-incrementing integer with enumeration examples", () => {
  const html = renderId("12345");
  expect(html).toContain("auto-incrementing integer");
  expect(html).toContain("</code> and incrementing to <code>/user/12346</code>");
  expect(html).toContain("/user/12347");
});

test("renders large integers exactly", () => {
  const html = renderId("99999999999999999999999");
  expect(html).toContain("/user/100000000000000000000000");
  expect(html).not.toContain("e+");
});

test("renders every plausible interpretation of an ambiguous ID", () => {
  // Valid as a Snowflake for several platforms, and as a plain integer
  const html = renderId("1060911982267932672");
  expect(html).toContain("matches 2 known formats");
  expect(html).toContain("Snowflake ID");
  expect(html).toContain("platform-select");
  expect(html).toContain("auto-incrementing integer");
});

test("renders a single-platform Snowflake without a selector", () => {
  // Decodes to 2029 under the Twitter layout, so only Instagram is plausible
  const html = renderId("2500000000000000000");
  expect(html).toContain("<strong>Platform:</strong> Instagram");
  expect(html).not.toContain("platform-select");
  expect(html).toContain("2021-02-02T05:20:45.597Z");
});
