// ports only the decoding parts of the ulid JS package

// These values should NEVER change. If
// they do, we're no longer making ulids!
const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford's Base32
const ENCODING_LEN = ENCODING.length;
const TIME_MAX = 2 ** 48 - 1;
const TIME_LEN = 10;
const RANDOM_LEN = 16;

export interface LibError extends Error {
  source: string;
}

const createError = (message: string): LibError => {
  const err = new Error(message) as LibError;
  err.source = "ulid";
  return err;
};

export const decodeTime = (id: string): number => {
  if (id.length !== TIME_LEN + RANDOM_LEN) {
    throw createError("malformed ulid");
  }
  const time = id
    .substr(0, TIME_LEN)
    .split("")
    .reverse()
    .reduce((carry, char, index) => {
      const encodingIndex = ENCODING.indexOf(char);
      if (encodingIndex === -1) {
        throw createError(`invalid character found: ${char}`);
      }
      return carry + encodingIndex * ENCODING_LEN ** index;
    }, 0);
  if (time > TIME_MAX) {
    throw createError("malformed ulid, timestamp too large");
  }
  return time;
};
