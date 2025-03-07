import { UnknownId } from "./unknown-id";
import { IntegerId } from "./integer-id";
import { parseIntegerId, parseUlidId, parseUuidV7Id } from "./parsing";
import { UlidId } from "./ulid-id";
import { UuidV7Id } from "./uuidv7-id";

export interface IdProps {
  id: string;
}

export const IdInformation = ({ id }: IdProps) => {
  const intParseResult = parseIntegerId(id);
  if (intParseResult.success && intParseResult.result) {
    return <IntegerId id={intParseResult.result} />;
  }

  const uuidv7ParseResult = parseUuidV7Id(id);
  if (uuidv7ParseResult) {
    return (
      <UuidV7Id
        id={uuidv7ParseResult.id}
        timestamp={uuidv7ParseResult.timestamp}
      />
    );
  }

  const ulidParseResult = parseUlidId(id);
  if (ulidParseResult) {
    return (
      <UlidId id={ulidParseResult.id} timestamp={ulidParseResult.timestamp} />
    );
  }

  return <UnknownId id={id} />;
};
