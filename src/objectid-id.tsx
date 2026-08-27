import { TimeBasedId } from "./time-based-id";

export interface ObjectIdProps {
  id: string;
  timestamp: Date;
}

export const ObjectId = ({ id, timestamp }: ObjectIdProps) => (
  <TimeBasedId
    id={id}
    timestamp={timestamp}
    formatName="MongoDB ObjectId"
    formatHref="https://www.mongodb.com/docs/manual/reference/method/ObjectId/"
  />
);
