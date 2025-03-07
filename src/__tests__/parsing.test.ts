import { expect, test } from "vitest";
import { parseIntegerId, parseUlidId, parseUuidV7Id } from "../parsing";
import { validate } from "uuid";

test("parseIntegerId - parses basic integer", () => {
  const result = parseIntegerId("123");
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(123);
});

test("parseIntegerId - parses large integer", () => {
  const result = parseIntegerId("9223372036854775807"); // max signed 64-bit integer
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(9223372036854775807);
});

test("parseIntegerId - parses very large integer", () => {
  const result = parseIntegerId("92233720368547758070000"); // exceeds max 64-bit integer
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(92233720368547758070000);
});

test.each([null, undefined, "", "  "])(
  "parseIntegerId - handles empty/missing input: '%s'",
  (input) => {
    const result = parseIntegerId(input!);
    expect(result.success).toBeFalsy();
    expect(result.result).toBeNull();
  }
);

test.each(["a", "b", "NaN", "1.3"])(
  "parseIntegerId - non-integer values return false: '%s'",
  (input) => {
    const result = parseIntegerId(input);
    expect(result.success).toBeFalsy();
    expect(result.result).toBeNull();
  }
);

test.each(["0", "-1", "-9999", "-90238490432849034890"])(
  "parseIntegerId - integers less than 1 return false: '%s'",
  (input) => {
    const result = parseIntegerId(input);
    expect(result.success).toBeFalsy();
    expect(result.result).toBeNull();
  }
);

test.each([
  "01JNQ954H97KBKW8A65RVR1N89",
  "01JNQ954H9WR4BDETQXA6YWN1D",
  "01JNQ954H9YWDHX9N8MTJT2HAR",
  // lowered
  "01jnq954h97kbkw8a65rvr1n89",
  "01jnq954h9wr4bdetqxa6ywn1d",
  "01jnq954h9ywdhx9n8mtjt2har",
])("parseUlidId - parses valid ULIDs", (ulid) => {
  const result = parseUlidId(ulid);
  expect(result).toBeTruthy();
  expect(result?.id).toBe(ulid);
  expect(result?.timestamp).toBeTruthy();
});

test("parseUlidId - parses ULID timestamp", () => {
  const ulid = "01JNQ93PPZC36WYPHSNPNKB1FP";
  const result = parseUlidId(ulid);
  expect(result).toBeTruthy();
  expect(result?.id).toBe(ulid);
  expect(result?.timestamp?.toISOString()).toBe("2025-03-07T03:06:47.391Z");
});

test.each([null, undefined, "", "  "])(
  "parseUlidId - handles empty/missing input: '%s'",
  (input) => {
    const result = parseUlidId(input!);
    expect(result).toBeNull();
  }
);

test.each(["a", "b", "-01JNQ954H97KBKW8A65RVR1N89", "not-a-ulid"])(
  "parseUlidId - non-ULID values return null: '%s'",
  (input) => {
    const result = parseUlidId(input);
    expect(result).toBeNull();
  }
);

test.each([
  "01956e96-c283-702e-9e6d-1e94c85ce6a6",
  "01956e96-c283-702e-9e6d-2050794fe006",
  "01956e96-c283-702e-9e6d-25288997c6c5",
  // upper-cased
  "01956E96-C283-702E-9E6D-1E94C85CE6A6",
  "01956E96-C283-702E-9E6D-2050794FE006",
  "01956E96-C283-702E-9E6D-25288997C6C5",
  // no '-'
  "01956e96c283702e9e6d1e94c85ce6a6",
  "01956e96c283702e9e6d2050794fe006",
  "01956e96c283702e9e6d25288997c6c5",
])("parseUuidV7Id - parses valid v7 UUIDs", (uuid) => {
  const result = parseUuidV7Id(uuid);
  expect(result).toBeTruthy();
  expect(result?.id).toBe(uuid);
  expect(result?.timestamp).toBeTruthy();
});

test("parseUuidV7Id - parses v7 UUID timestamp", () => {
  const uuid = "01956e98-8470-70ac-a4f3-febf7dc79f22";
  const result = parseUuidV7Id(uuid);
  expect(result).toBeTruthy();
  expect(result?.id).toBe(uuid);
  expect(result?.timestamp?.toISOString()).toBe("2025-03-07T03:14:04.016Z");
});

test.each([null, undefined, "", "  "])(
  "parseUuidV7Id - handles empty/missing input: '%s'",
  (input) => {
    const result = parseUuidV7Id(input!);
    expect(result).toBeFalsy();
  }
);

test.each([
  "a",
  "b",
  "-01JNQ954H97KBKW8A65RVR1N89",
  "not-a-uuid",
  "743022e7-1748-4f1a-ab7a-89c7d6e9ec42", // v4 ID
])("parseUuidV7Id - non-v7 UUID values return null: '%s'", (input) => {
  const result = parseUuidV7Id(input);
  expect(result).toBeNull();
});
