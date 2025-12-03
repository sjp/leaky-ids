import { expect, test } from "vitest";
import {
  parseIntegerId,
  parseUlidId,
  parseUuidV7Id,
  parseUuidV1Id,
  parseSnowflakeId,
  parseKsuidId,
  parseObjectId,
  getSnowflakeTimestamp,
} from "../parsing";

test("parseIntegerId - parses basic integer", () => {
  const result = parseIntegerId("123");
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(123);
});

test("parseIntegerId - parses large integer", () => {
  const result = parseIntegerId(Number.MAX_SAFE_INTEGER.toString());
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(Number.MAX_SAFE_INTEGER);
});

test.each(["", "  "])(
  "parseIntegerId - handles empty input: '%s'",
  (input) => {
    const result = parseIntegerId(input);
    expect(result.success).toBeFalsy();
    expect(result.result).toBeNull();
  }
);

test.each(["a", "b", "NaN", "1.3", "12,345"])(
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

test.each(["", "  "])(
  "parseUlidId - handles empty input: '%s'",
  (input) => {
    const result = parseUlidId(input);
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

test.each(["", "  "])(
  "parseUuidV7Id - handles empty input: '%s'",
  (input) => {
    const result = parseUuidV7Id(input);
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

// UUIDv1 tests
test.each([
  "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
  "6BA7B810-9DAD-11D1-80B4-00C04FD430C8", // uppercase
  "6ba7b8109dad11d180b400c04fd430c8", // no hyphens
])("parseUuidV1Id - parses valid v1 UUIDs", (uuid) => {
  const result = parseUuidV1Id(uuid);
  expect(result).toBeTruthy();
  expect(result?.id).toBe(uuid);
  expect(result?.timestamp).toBeTruthy();
});

test.each(["", "  "])(
  "parseUuidV1Id - handles empty input: '%s'",
  (input) => {
    const result = parseUuidV1Id(input);
    expect(result).toBeNull();
  }
);

test.each([
  "not-a-uuid",
  "743022e7-1748-4f1a-ab7a-89c7d6e9ec42", // v4 ID
  "01956e96-c283-702e-9e6d-1e94c85ce6a6", // v7 ID
])("parseUuidV1Id - non-v1 UUID values return null: '%s'", (input) => {
  const result = parseUuidV1Id(input);
  expect(result).toBeNull();
});

// Snowflake ID tests
test.each([
  "175928847299117063", // Twitter snowflake
  "1234567890123456789", // Generic snowflake
  "1060911982267932672", // Discord snowflake
])("parseSnowflakeId - parses valid Snowflake IDs", (snowflake) => {
  const result = parseSnowflakeId(snowflake);
  expect(result).toBeTruthy();
  expect(result?.id).toBe(snowflake);
  expect(result?.platforms).toBeTruthy();
  expect(result?.platforms.length).toBeGreaterThan(0);
});

test.each(["", "  "])(
  "parseSnowflakeId - handles empty input: '%s'",
  (input) => {
    const result = parseSnowflakeId(input);
    expect(result).toBeNull();
  }
);

test.each([
  "not-a-snowflake",
  "123", // too short
  "abc123",
  "12345678901234567890123", // too long
])("parseSnowflakeId - invalid values return null: '%s'", (input) => {
  const result = parseSnowflakeId(input);
  expect(result).toBeNull();
});

test("parseSnowflakeId - parses Instagram ID", () => {
  // Instagram media ID (example from public post)
  const instagramId = "1234567890123456789"; // Generic valid format
  const result = parseSnowflakeId(instagramId);
  expect(result).toBeTruthy();
  expect(result?.id).toBe(instagramId);
  expect(result?.platforms).toContain("instagram");
});

test("parseSnowflakeId - parses Mastodon ID", () => {
  // Mastodon uses snowflakes starting from Jan 1, 2017
  // An ID from late 2022 would be around 109000000000000000
  const mastodonId = "109300000000000000";
  const result = parseSnowflakeId(mastodonId);
  expect(result).toBeTruthy();
  expect(result?.id).toBe(mastodonId);
  expect(result?.platforms).toContain("mastodon");
});

test("parseSnowflakeId - correctly identifies Discord ID", () => {
  // This Discord ID would give 2012 if interpreted as Twitter (before Discord existed)
  const discordId = "265206645645246464";
  const result = parseSnowflakeId(discordId);
  expect(result).toBeTruthy();
  expect(result?.id).toBe(discordId);
  expect(result?.platforms).toContain("discord");
  
  // Verify the timestamp when using Discord epoch
  const timestamp = getSnowflakeTimestamp(discordId, "discord");
  expect(timestamp?.getFullYear()).toBe(2017);
});

// KSUID tests
test.each([
  "0ujtsYcgvSTl8PAuAdqWYSMnLOv",
  "0uk1Hbc9dQ9pxyTqJ93IUrfhdGq",
  "0ujzPyRiIAffKhBux4fvXYAGOPJ",
])("parseKsuidId - parses valid KSUIDs", (ksuid) => {
  const result = parseKsuidId(ksuid);
  expect(result).toBeTruthy();
  expect(result?.id).toBe(ksuid);
  expect(result?.timestamp).toBeTruthy();
});

test.each(["", "  "])("parseKsuidId - handles empty input: '%s'", (input) => {
  const result = parseKsuidId(input);
  expect(result).toBeNull();
});

test.each([
  "not-a-ksuid",
  "123",
  "0ujtsYcgvSTl8PAuAdqWYSMnLOv!", // invalid char
  "0ujtsYcgvSTl8PAuAdqWYSMnLO", // too short
])("parseKsuidId - invalid values return null: '%s'", (input) => {
  const result = parseKsuidId(input);
  expect(result).toBeNull();
});

// MongoDB ObjectId tests
test.each([
  "507f1f77bcf86cd799439011",
  "507f191e810c19729de860ea",
  "65a1f2e3b4c5d6e7f8901234",
  "507F1F77BCF86CD799439011", // uppercase
])("parseObjectId - parses valid ObjectIds", (objectId) => {
  const result = parseObjectId(objectId);
  expect(result).toBeTruthy();
  expect(result?.id).toBe(objectId);
  expect(result?.timestamp).toBeTruthy();
});

test.each(["", "  "])(
  "parseObjectId - handles empty input: '%s'",
  (input) => {
    const result = parseObjectId(input);
    expect(result).toBeNull();
  }
);

test.each([
  "not-an-objectid",
  "507f1f77bcf86cd79943901", // too short
  "507f1f77bcf86cd799439011a", // too long
  "507f1f77bcf86cd79943901g", // invalid hex
])("parseObjectId - invalid values return null: '%s'", (input) => {
  const result = parseObjectId(input);
  expect(result).toBeNull();
});