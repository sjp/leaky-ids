import { decodeTime } from "./ulid";
import { version as uuidVersion, validate as uuidValidate } from "uuid";

export interface ParseResult<T> {
  success: boolean;
  result: T | null;
}

const IntegerParseFailure: ParseResult<bigint> = {
  success: false,
  result: null,
};

const ASCII_NUMERIC_CHARS_ONLY = /^\d+$/;

// Integers are parsed as BigInt so that IDs beyond Number.MAX_SAFE_INTEGER
// (e.g. 64-bit database keys) are preserved exactly rather than rounded.
export const parseIntegerId = (input: string): ParseResult<bigint> => {
  if (!input) {
    return IntegerParseFailure;
  }

  if (!ASCII_NUMERIC_CHARS_ONLY.test(input)) {
    return IntegerParseFailure;
  }

  const num = BigInt(input);
  if (num < 1n) {
    return IntegerParseFailure;
  }

  return { success: true, result: num };
};

const ONE_DAY_MS = 86400000;

// Time-based IDs embed a creation timestamp. A decoded timestamp in the future
// means the input merely *looks* like the format (e.g. a random string that
// happens to be valid Crockford base32), so it should not be reported as a match.
const isPlausibleTimestamp = (timestampMs: number): boolean => {
  return timestampMs <= Date.now() + ONE_DAY_MS;
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
  if (timestamp === null || !isPlausibleTimestamp(timestamp)) {
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
  if (timestamp === null || !isPlausibleTimestamp(timestamp)) {
    return null;
  }

  return { id: input, timestamp: new Date(timestamp) };
};

// UUIDv1 parsing
export interface UuidV1Result extends TimeBasedId {
  // The 48-bit node field, formatted as a MAC address (e.g. 00:c0:4f:d4:30:c8).
  node: string;
  // RFC 4122 §4.5: a node that was randomly generated (rather than taken from a
  // network card) has the multicast bit -- least-significant bit of the first
  // octet -- set, since real unicast MAC addresses never do.
  isRandomNode: boolean;
  clockSequence: number;
}

const getTimestampFromUuidV1 = (hex: string): number => {
  // UUIDv1 stores timestamp as 100-nanosecond intervals since Oct 15, 1582
  const timeLow = hex.substring(0, 8);
  const timeMid = hex.substring(8, 12);
  const timeHi = hex.substring(12, 16);

  // Extract the 60-bit timestamp (remove version bits)
  const timeHiFiltered = (Number.parseInt(timeHi, 16) & 0x0fff).toString(16).padStart(4, "0");
  const timestampHex = timeHiFiltered + timeMid + timeLow;
  const timestamp100ns = BigInt(`0x${timestampHex}`);

  // Convert to milliseconds and adjust for epoch difference
  const GREGORIAN_EPOCH_OFFSET = 122192928000000000n; // Oct 15, 1582 to Jan 1, 1970 in 100ns units
  return Number((timestamp100ns - GREGORIAN_EPOCH_OFFSET) / 10000n);
};

const getNodeFromUuidV1 = (hex: string): { node: string; isRandomNode: boolean } => {
  const nodeHex = hex.substring(20, 32).toLowerCase();
  const octets = nodeHex.match(/.{2}/g) ?? [];
  const firstOctet = Number.parseInt(octets[0] ?? "0", 16);
  return {
    node: octets.join(":"),
    isRandomNode: (firstOctet & 0x01) === 1,
  };
};

const getClockSequenceFromUuidV1 = (hex: string): number => {
  // 14 bits: the clock_seq_hi_and_reserved octet (minus the 2 variant bits)
  // followed by clock_seq_low.
  return Number.parseInt(hex.substring(16, 20), 16) & 0x3fff;
};

export const parseUuidV1Id = (input: string): UuidV1Result | null => {
  if (!input) {
    return null;
  }

  const normalizedUuid = normalizeUuid(input);
  if (!uuidValidate(normalizedUuid) || uuidVersion(normalizedUuid) !== 1) {
    return null;
  }

  const hex = normalizedUuid.replaceAll("-", "");
  const timestamp = getTimestampFromUuidV1(hex);
  if (timestamp < 0 || !isPlausibleTimestamp(timestamp)) {
    return null;
  }

  return {
    id: input,
    timestamp: new Date(timestamp),
    ...getNodeFromUuidV1(hex),
    clockSequence: getClockSequenceFromUuidV1(hex),
  };
};

// Snowflake ID parsing (Twitter, Discord, Instagram, Mastodon, etc.)
// Snowflake IDs are 64-bit integers whose high bits are a millisecond timestamp.
// The layout differs per platform: the epoch the timestamp counts from, and how
// many low bits (worker/shard/sequence) sit below it.
const SNOWFLAKE_REGEX = /^\d{15,20}$/; // Snowflakes are typically 17-19 digits

export type SnowflakePlatform = "twitter" | "discord" | "instagram" | "mastodon";

export interface SnowflakeEpoch {
  name: string;
  platform: SnowflakePlatform;
  // Milliseconds since the Unix epoch that the embedded timestamp counts from.
  epoch: number;
  // Number of low bits below the timestamp.
  shift: number;
  // Earliest date at which the platform could have issued an ID. Used to reject
  // coincidental matches (plain integers that decode to a date near the epoch).
  notBefore: number;
}

export const SNOWFLAKE_EPOCHS: Record<SnowflakePlatform, SnowflakeEpoch> = {
  twitter: {
    name: "Twitter",
    platform: "twitter",
    // 41 bits timestamp | 10 bits worker | 12 bits sequence
    epoch: 1288834974657, // Nov 4, 2010, 01:42:54 UTC
    shift: 22,
    notBefore: Date.UTC(2011, 0, 1),
  },
  discord: {
    name: "Discord",
    platform: "discord",
    // 42 bits timestamp | 5 bits worker | 5 bits process | 12 bits sequence
    epoch: 1420070400000, // Jan 1, 2015 00:00:00 UTC
    shift: 22,
    notBefore: Date.UTC(2016, 0, 1),
  },
  instagram: {
    name: "Instagram",
    platform: "instagram",
    // 41 bits timestamp | 13 bits shard | 10 bits sequence
    epoch: 1314220021721, // Aug 25, 2011, 00:00:21.721 UTC
    shift: 23,
    notBefore: Date.UTC(2012, 0, 1),
  },
  mastodon: {
    name: "Mastodon",
    platform: "mastodon",
    // 48 bits Unix timestamp | 16 bits sequence
    epoch: 0,
    shift: 16,
    notBefore: Date.UTC(2017, 0, 1),
  },
};

export interface SnowflakeIdResult {
  id: string;
  platforms: SnowflakePlatform[];
}

const decodeSnowflakeTimestamp = (input: string, config: SnowflakeEpoch): number | null => {
  const extracted = Number(BigInt(input) >> BigInt(config.shift));

  // A zero offset carries no timestamp signal: the decoded date would land
  // exactly on the platform epoch, which no real ID does.
  if (extracted <= 0) {
    return null;
  }

  return extracted + config.epoch;
};

export const parseSnowflakeId = (input: string): SnowflakeIdResult | null => {
  if (!input || !SNOWFLAKE_REGEX.test(input)) {
    return null;
  }

  // Check which platforms give a plausible creation date: after the platform
  // existed and not in the future. The notBefore floor rules out short numeric
  // strings whose decoded date lands near an epoch (those are far more likely
  // to be plain auto-incrementing integers than real IDs).
  const validPlatforms: SnowflakePlatform[] = [];

  for (const config of Object.values(SNOWFLAKE_EPOCHS)) {
    const timestamp = decodeSnowflakeTimestamp(input, config);
    if (timestamp !== null && timestamp >= config.notBefore && isPlausibleTimestamp(timestamp)) {
      validPlatforms.push(config.platform);
    }
  }

  if (validPlatforms.length === 0) {
    return null;
  }

  return { id: input, platforms: validPlatforms };
};

export const getSnowflakeTimestamp = (input: string, platform: SnowflakePlatform): Date | null => {
  if (!input || !SNOWFLAKE_REGEX.test(input)) {
    return null;
  }

  const timestamp = decodeSnowflakeTimestamp(input, SNOWFLAKE_EPOCHS[platform]);
  return timestamp === null ? null : new Date(timestamp);
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
  if (decoded === null) {
    return null;
  }

  // A KSUID is a 160-bit value, but 27 base62 chars can encode slightly more
  // than 2^160; anything past that range is malformed, not a real KSUID.
  if (decoded >= 1n << 160n) {
    return null;
  }

  // Extract the high 32 bits (first 4 bytes) for the timestamp. By construction
  // this is >= the KSUID epoch (May 2014), so only the future bound needs checking.
  const timestampSeconds = Number(decoded >> 128n);
  const timestampMs = (timestampSeconds + KSUID_EPOCH) * 1000;

  if (!isPlausibleTimestamp(timestampMs)) {
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
  if (timestampMs < 946684800000 || !isPlausibleTimestamp(timestampMs)) {
    return null;
  }

  return { id: input, timestamp: new Date(timestampMs) };
};
