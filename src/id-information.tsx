import type { ComponentChild } from "preact";
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

// Each entry tries one format; the order reflects how specific the format is,
// so the most confident interpretation is rendered first.
const INTERPRETATIONS: Array<(id: string) => ComponentChild | null> = [
  (id) => {
    const r = parseUuidV7Id(id);
    return r && <UuidV7Id key="uuidv7" id={r.id} timestamp={r.timestamp} />;
  },
  (id) => {
    const r = parseUuidV1Id(id);
    return (
      r && (
        <UuidV1Id
          key="uuidv1"
          id={r.id}
          timestamp={r.timestamp}
          node={r.node}
          isRandomNode={r.isRandomNode}
          clockSequence={r.clockSequence}
        />
      )
    );
  },
  (id) => {
    const r = parseUlidId(id);
    return r && <UlidId key="ulid" id={r.id} timestamp={r.timestamp} />;
  },
  (id) => {
    const r = parseKsuidId(id);
    return r && <KsuidId key="ksuid" id={r.id} timestamp={r.timestamp} />;
  },
  (id) => {
    const r = parseSnowflakeId(id);
    // key by id so switching to a different snowflake remounts the component and
    // resets the selected-platform state (which is initialized from platforms[0]).
    return r && <SnowflakeId key={`snowflake-${r.id}`} id={r.id} platforms={r.platforms} />;
  },
  (id) => {
    const r = parseObjectId(id);
    return r && <ObjectId key="objectid" id={r.id} timestamp={r.timestamp} />;
  },
  (id) => {
    const r = parseIntegerId(id);
    return r.success && r.result !== null && <IntegerId key="integer" id={r.result} />;
  },
];

export const IdInformation = ({ id }: IdProps) => {
  // An ID can plausibly be more than one thing (e.g. an 18-digit number is both
  // a Snowflake and an auto-incrementing integer), so show every match rather
  // than only the first.
  const matches = INTERPRETATIONS.map((interpret) => interpret(id)).filter(Boolean);

  if (matches.length === 0) {
    return <UnknownId id={id} />;
  }

  return (
    <>
      {matches.length > 1 && (
        <p>
          This ID matches {matches.length} known formats. Each possible interpretation is shown
          below.
        </p>
      )}
      {matches}
    </>
  );
};
