import { decodeTime } from "./ulid";
import { version as uuidVersion, validate as uuidValidate } from "uuid";

export interface ParseResult<T> {
  success: boolean;
  result: T | null;
}

const IntegerParseFailure: ParseResult<number> = {
  success: false,
  result: null,
};

const ASCII_NUMERIC_CHARS_ONLY = /^\d+$/;

export const parseIntegerId = (input: string): ParseResult<number> => {
  if (!input) {
    return IntegerParseFailure;
  }

  if (!input.match(ASCII_NUMERIC_CHARS_ONLY)) {
    return IntegerParseFailure;
  }

  const num = Number.parseInt(input, 10);
  if (!Number.isInteger(num) || Number.isNaN(num)) {
    return IntegerParseFailure;
  }

  if (num < 1) {
    return IntegerParseFailure;
  }

  return { success: true, result: num };
};

interface TimeBasedId {
  id: string;
  timestamp: Date;
}

const getTimestampFromUlid = (input: string): number | null => {
  try {
    return decodeTime(input); // throws when invalid
  } catch {
    return null;
  }
};

export const parseUlidId = (input: string): TimeBasedId | null => {
  if (!input) {
    return null;
  }

  const timestamp = getTimestampFromUlid(input.toUpperCase());
  if (!timestamp) {
    return null;
  }

  return { id: input, timestamp: new Date(timestamp) };
};

// hyphen-stripped UUIDs are just UUIDs without hyphen separators
// e.g. the following are equivalent:
// - 01956e96-c283-702e-9e6d-1e94c85ce6a6
// - 01956e96c283702e9e6d1e94c85ce6a6
const HYPHEN_STRIPPED_UUID = /^(.{8})(.{4})(.{4})(.{4})(.{12})$/;
const HYPHEN_STRIPPED_UUID_LENGTH = 32; // e.g.

const normalizeUuid = (input: string): string => {
  return input.length === HYPHEN_STRIPPED_UUID_LENGTH
    ? input.replace(HYPHEN_STRIPPED_UUID, "$1-$2-$3-$4-$5")
    : input;
};

const getTimestampFromUuidV7 = (input: string): number | null => {
  if (!uuidValidate(input)) {
    return null;
  }
  if (uuidVersion(input) !== 7) {
    return null;
  }

  // first 12 chars represent ms since epoch (in hex)
  const timestampHex = input.replaceAll("-", "").substring(0, 12);
  return Number.parseInt(timestampHex, 16);
};

export const parseUuidV7Id = (input: string): TimeBasedId | null => {
  if (!input) {
    return null;
  }

  const normalizedUuid = normalizeUuid(input);

  const timestamp = getTimestampFromUuidV7(normalizedUuid);
  if (!timestamp) {
    return null;
  }

  return { id: input, timestamp: new Date(timestamp) };
};

// UUIDv1 parsing
const getTimestampFromUuidV1 = (input: string): number | null => {
  if (!uuidValidate(input)) {
    return null;
  }
  if (uuidVersion(input) !== 1) {
    return null;
  }

  // UUIDv1 stores timestamp as 100-nanosecond intervals since Oct 15, 1582
  const hex = input.replaceAll("-", "");
  const timeLow = hex.substring(0, 8);
  const timeMid = hex.substring(8, 12);
  const timeHi = hex.substring(12, 16);
  
  // Extract the 60-bit timestamp (remove version bits)
  const timeHiFiltered = (Number.parseInt(timeHi, 16) & 0x0fff).toString(16).padStart(4, "0");
  const timestampHex = timeHiFiltered + timeMid + timeLow;
  const timestamp100ns = BigInt(`0x${timestampHex}`);
  
  // Convert to milliseconds and adjust for epoch difference
  const GREGORIAN_EPOCH_OFFSET = 122192928000000000n; // Oct 15, 1582 to Jan 1, 1970 in 100ns units
  const timestampMs = Number((timestamp100ns - GREGORIAN_EPOCH_OFFSET) / 10000n);
  
  return timestampMs;
};

export const parseUuidV1Id = (input: string): TimeBasedId | null => {
  if (!input) {
    return null;
  }

  const normalizedUuid = normalizeUuid(input);
  const timestamp = getTimestampFromUuidV1(normalizedUuid);
  
  if (!timestamp || timestamp < 0) {
    return null;
  }

  return { id: input, timestamp: new Date(timestamp) };
};

// Snowflake ID parsing (Twitter, Discord, Instagram, Mastodon, etc.)
// Snowflake IDs are 64-bit integers with timestamp in the first 41-42 bits
const SNOWFLAKE_REGEX = /^\d{15,20}$/; // Snowflakes are typically 17-19 digits

export type SnowflakePlatform = "twitter" | "discord" | "instagram" | "mastodon";

export interface SnowflakeEpoch {
  name: string;
  epoch: number;
  platform: SnowflakePlatform;
}

export const SNOWFLAKE_EPOCHS: Record<SnowflakePlatform, SnowflakeEpoch> = {
  twitter: {
    name: "Twitter",
    epoch: 1288834974657, // Nov 4, 2010, 01:42:54 UTC
    platform: "twitter",
  },
  discord: {
    name: "Discord",
    epoch: 1420070400000, // Jan 1, 2015 00:00:00 UTC
    platform: "discord",
  },
  instagram: {
    name: "Instagram",
    epoch: 1314220021721, // Aug 25, 2011, 00:00:21.721 UTC
    platform: "instagram",
  },
  mastodon: {
    name: "Mastodon",
    epoch: 1483228800000, // Jan 1, 2017 00:00:00 UTC
    platform: "mastodon",
  },
};

export interface SnowflakeIdResult {
  id: string;
  platforms: SnowflakePlatform[];
}

export const parseSnowflakeId = (input: string): SnowflakeIdResult | null => {
  if (!input || !SNOWFLAKE_REGEX.test(input)) {
    return null;
  }

  const snowflake = BigInt(input);
  const extractedTimestamp = Number(snowflake >> 22n);
  
  const now = Date.now();
  const oneDayFuture = now + 86400000;
  
  // Check which platforms give valid timestamps
  const validPlatforms: SnowflakePlatform[] = [];
  
  for (const [platform, config] of Object.entries(SNOWFLAKE_EPOCHS)) {
    const timestamp = extractedTimestamp + config.epoch;
    if (timestamp >= config.epoch && timestamp < oneDayFuture) {
      validPlatforms.push(platform as SnowflakePlatform);
    }
  }
  
  if (validPlatforms.length === 0) {
    return null;
  }
  
  return { id: input, platforms: validPlatforms };
};

export const getSnowflakeTimestamp = (
  input: string,
  platform: SnowflakePlatform
): Date | null => {
  if (!input || !SNOWFLAKE_REGEX.test(input)) {
    return null;
  }
  
  const snowflake = BigInt(input);
  const extractedTimestamp = Number(snowflake >> 22n);
  const epochConfig = SNOWFLAKE_EPOCHS[platform];
  
  const timestamp = extractedTimestamp + epochConfig.epoch;
  return new Date(timestamp);
};

// KSUID parsing (K-Sortable Unique Identifier)
// 27-character base62 string, first 4 bytes are timestamp
const KSUID_REGEX = /^[0-9A-Za-z]{27}$/;
const KSUID_EPOCH = 1400000000; // May 14, 2014 (in seconds)
const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const base62Decode = (input: string): bigint | null => {
  try {
    let result = 0n;
    for (const char of input) {
      const value = BASE62_CHARS.indexOf(char);
      if (value === -1) return null;
      result = result * 62n + BigInt(value);
    }
    return result;
  } catch {
    return null;
  }
};

export const parseKsuidId = (input: string): TimeBasedId | null => {
  if (!input || !KSUID_REGEX.test(input)) {
    return null;
  }

  const decoded = base62Decode(input);
  if (!decoded) {
    return null;
  }

  // Extract first 32 bits (4 bytes) for timestamp
  const timestampSeconds = Number(decoded >> 128n);
  const timestampMs = (timestampSeconds + KSUID_EPOCH) * 1000;
  
  // Validate timestamp is reasonable
  if (timestampMs < KSUID_EPOCH * 1000 || timestampMs > Date.now() + 86400000) {
    return null;
  }

  return { id: input, timestamp: new Date(timestampMs) };
};

// MongoDB ObjectId parsing
// 24-character hex string, first 4 bytes are Unix timestamp
const OBJECTID_REGEX = /^[0-9a-fA-F]{24}$/;

export const parseObjectId = (input: string): TimeBasedId | null => {
  if (!input || !OBJECTID_REGEX.test(input)) {
    return null;
  }

  // First 8 hex chars (4 bytes) are the timestamp in seconds since Unix epoch
  const timestampHex = input.substring(0, 8);
  const timestampSeconds = Number.parseInt(timestampHex, 16);
  const timestampMs = timestampSeconds * 1000;

  // Validate timestamp is reasonable (after 2000, before far future)
  if (timestampMs < 946684800000 || timestampMs > Date.now() + 86400000) {
    return null;
  }

  return { id: input, timestamp: new Date(timestampMs) };
};