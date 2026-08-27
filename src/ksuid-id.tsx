import { TimeBasedId } from "./time-based-id";

export interface KsuidIdProps {
  id: string;
  timestamp: Date;
}

export const KsuidId = ({ id, timestamp }: KsuidIdProps) => (
  <TimeBasedId
    id={id}
    timestamp={timestamp}
    formatName="KSUID"
    formatHref="https://github.com/segmentio/ksuid"
    formatSuffix="(K-Sortable Unique Identifier)"
  />
);
