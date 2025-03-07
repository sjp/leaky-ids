import { Timestamp } from "./timestamp";

export interface UlidIdProps {
  id: string;
  timestamp: Date;
}

export const UlidId = ({ id, timestamp }: UlidIdProps) => {
  return (
    <article>
      <header>
        <h2 style={{ textAlign: "center" }}>Yes! ⚠</h2>
      </header>
      <p>
        Your ID <code>{id}</code> is a valid{" "}
        <a
          href="https://github.com/ulid/spec"
          target="_blank"
          rel="noopener noreferrer"
        >
          ULID
        </a>
        . This means we can determine when it was created.
      </p>
      <Timestamp timestamp={timestamp} />
      <p>
        In most cases knowing the creation date is not sensitive information.
        However, if that information is sensitive you may wish to hide it. For
        example competitors may be able to use this information to determine the
        volume of traffic on a service.
      </p>
    </article>
  );
};
