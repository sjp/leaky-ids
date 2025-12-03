import { Timestamp } from "./timestamp";

export interface KsuidIdProps {
  id: string;
  timestamp: Date;
}

export const KsuidId = ({ id, timestamp }: KsuidIdProps) => {
  return (
    <article>
      <header>
        <h2 style={{ textAlign: "center" }}>Yes! ⚠</h2>
      </header>
      <p>
        Your ID <code>{id}</code> is a valid{" "}
        <a
          href="https://github.com/segmentio/ksuid"
          target="_blank"
          rel="noopener noreferrer"
        >
          KSUID
        </a>{" "}
        (K-Sortable Unique Identifier). This means we can determine when it was
        created.
      </p>
      <Timestamp timestamp={timestamp} />
      <p>
        In most cases knowing the creation date is not sensitive information.
        However, if that information is sensitive you may wish to hide it.
      </p>
    </article>
  );
};
