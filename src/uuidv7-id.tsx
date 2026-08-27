import { TimeBasedId } from "./time-based-id";

export interface UuidV7IdProps {
  id: string;
  timestamp: Date;
}

export const UuidV7Id = ({ id, timestamp }: UuidV7IdProps) => (
  <TimeBasedId
    id={id}
    timestamp={timestamp}
    formatName="v7 UUID"
    formatHref="https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_7_(timestamp_and_random)"
  />
);
