import { Timestamp } from "./timestamp";

export interface UuidV7IdProps {
  id: string;
  timestamp: Date;
}

export const UuidV7Id = ({ id, timestamp }: UuidV7IdProps) => {
  return (
    <article>
      <header>
        <h2 style={{ textAlign: "center" }}>Yes! ⚠</h2>
      </header>
      <p>
        Your ID <code>{id}</code> is a valid{" "}
        <a
          href="https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_7_(timestamp_and_random)"
          target="_blank"
          rel="noopener noreferrer"
        >
          v7 UUID
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
