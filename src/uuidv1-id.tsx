import { Timestamp } from "./timestamp";

export interface UuidV1IdProps {
  id: string;
  timestamp: Date;
}

export const UuidV1Id = ({ id, timestamp }: UuidV1IdProps) => {
  return (
    <article>
      <header>
        <h2 style={{ textAlign: "center" }}>Yes! ⚠</h2>
      </header>
      <p>
        Your ID <code>{id}</code> is a valid{" "}
        <a
          href="https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address)"
          target="_blank"
          rel="noopener noreferrer"
        >
          v1 UUID
        </a>
        . This means we can determine when it was created.
      </p>
      <Timestamp timestamp={timestamp} />
      <p>
        In most cases knowing the creation date is not sensitive information.
        However, if that information is sensitive you may wish to hide it. Note
        that UUIDv1 also contains MAC address information which may reveal the
        machine that generated it.
      </p>
    </article>
  );
};
