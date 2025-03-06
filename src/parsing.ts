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

export const parseIntegerId = (input: string): ParseResult<number> => {
  if (!input) {
    return IntegerParseFailure;
  }

  const num = Number.parseInt(input, 10);
  if (!num) {
    return IntegerParseFailure;
  }

  const isInt = Number.isInteger(num);
  if (!isInt) {
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

  const timestamp = getTimestampFromUlid(input);
  if (!timestamp) {
    return null;
  }

  return { id: input, timestamp: new Date(timestamp) };
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
  const timestamp = getTimestampFromUuidV7(input);
  if (!timestamp) {
    return null;
  }

  return { id: input, timestamp: new Date(timestamp) };
};
