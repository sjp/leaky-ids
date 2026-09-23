import { expect, test } from "vitest";
import { decodeTime } from "../ulid";

test("decodeTime - decodes the timestamp of a valid ULID", () => {
  expect(decodeTime("01JNQ93PPZC36WYPHSNPNKB1FP")).toBe(Date.UTC(2025, 2, 7, 3, 6, 47, 391));
});

test("decodeTime - decodes the maximum timestamp", () => {
  expect(decodeTime("7ZZZZZZZZZZZZZZZZZZZZZZZZZ")).toBe(2 ** 48 - 1);
});

test.each(["", "01JNQ93PPZC36WYPHSNPNKB1F", "01JNQ93PPZC36WYPHSNPNKB1FPX"])(
  "decodeTime - rejects input of the wrong length: '%s'",
  (input) => {
    expect(() => decodeTime(input)).toThrow("malformed ulid");
  },
);

test.each(["01JNQ93PPUC36WYPHSNPNKB1FP", "01jnq93ppzc36wyphsnpnkb1fp"])(
  "decodeTime - rejects characters outside Crockford base32: '%s'",
  (input) => {
    expect(() => decodeTime(input)).toThrow("invalid character found");
  },
);

test("decodeTime - rejects timestamps beyond 48 bits", () => {
  expect(() => decodeTime("80000000000000000000000000")).toThrow("timestamp too large");
});

test("decodeTime - tags errors with the ulid source", () => {
  expect(() => decodeTime("")).toThrow(expect.objectContaining({ source: "ulid" }));
});
