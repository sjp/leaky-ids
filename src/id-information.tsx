import { UnknownId } from "./unknown-id";
import { IntegerId } from "./integer-id";
import {
  parseIntegerId,
  parseUlidId,
  parseUuidV7Id,
  parseUuidV1Id,
  parseSnowflakeId,
  parseKsuidId,
  parseObjectId,
} from "./parsing";
import { UlidId } from "./ulid-id";
import { UuidV7Id } from "./uuidv7-id";
import { UuidV1Id } from "./uuidv1-id";
import { SnowflakeId } from "./snowflake-id";
import { KsuidId } from "./ksuid-id";
import { ObjectId } from "./objectid-id";

export interface IdProps {
  id: string;
}

export const IdInformation = ({ id }: IdProps) => {
  const uuidv7ParseResult = parseUuidV7Id(id);
  if (uuidv7ParseResult) {
    return (
      <UuidV7Id
        id={uuidv7ParseResult.id}
        timestamp={uuidv7ParseResult.timestamp}
      />
    );
  }

  const uuidv1ParseResult = parseUuidV1Id(id);
  if (uuidv1ParseResult) {
    return (
      <UuidV1Id
        id={uuidv1ParseResult.id}
        timestamp={uuidv1ParseResult.timestamp}
      />
    );
  }

  const ulidParseResult = parseUlidId(id);
  if (ulidParseResult) {
    return (
      <UlidId id={ulidParseResult.id} timestamp={ulidParseResult.timestamp} />
    );
  }

  const ksuidParseResult = parseKsuidId(id);
  if (ksuidParseResult) {
    return (
      <KsuidId
        id={ksuidParseResult.id}
        timestamp={ksuidParseResult.timestamp}
      />
    );
  }

  const snowflakeParseResult = parseSnowflakeId(id);
  if (snowflakeParseResult) {
    return (
      <SnowflakeId
        id={snowflakeParseResult.id}
        platforms={snowflakeParseResult.platforms}
      />
    );
  }

  const objectIdParseResult = parseObjectId(id);
  if (objectIdParseResult) {
    return (
      <ObjectId
        id={objectIdParseResult.id}
        timestamp={objectIdParseResult.timestamp}
      />
    );
  }

  const intParseResult = parseIntegerId(id);
  if (intParseResult.success && intParseResult.result) {
    return <IntegerId id={intParseResult.result} />;
  }

  return <UnknownId id={id} />;
};
