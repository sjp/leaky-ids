import { Timestamp } from "./timestamp";

export interface ObjectIdProps {
  id: string;
  timestamp: Date;
}

export const ObjectId = ({ id, timestamp }: ObjectIdProps) => {
  return (
    <article>
      <header>
        <h2 style={{ textAlign: "center" }}>Yes! ⚠</h2>
      </header>
      <p>
        Your ID <code>{id}</code> is a valid{" "}
        <a
          href="https://www.mongodb.com/docs/manual/reference/method/ObjectId/"
          target="_blank"
          rel="noopener noreferrer"
        >
          MongoDB ObjectId
        </a>
        . This means we can determine when it was created.
      </p>
      <Timestamp timestamp={timestamp} />
      <p>
        In most cases knowing the creation date is not sensitive information.
        However, if that information is sensitive you may wish to hide it.
      </p>
    </article>
  );
};
