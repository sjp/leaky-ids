import { decodeTime } from "ulid";
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

  if (!input.match(ASCII_NUMERIC_CHARS_ONLY))
    return IntegerParseFailure;

  const num = Number.parseInt(input, 10);
  if (!num) {
    return IntegerParseFailure;
  }

  const isInt = Number.isInteger(Number.parseFloat(input));
  if (!isInt) {
    return IntegerParseFailure;
  }

  // consider 1 to be the natural starting point for sequential ids
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
}

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
