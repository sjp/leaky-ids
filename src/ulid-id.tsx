import { TimeBasedId } from "./time-based-id";

export interface UlidIdProps {
  id: string;
  timestamp: Date;
}

export const UlidId = ({ id, timestamp }: UlidIdProps) => (
  <TimeBasedId
    id={id}
    timestamp={timestamp}
    formatName="ULID"
    formatHref="https://github.com/ulid/spec"
  />
);
