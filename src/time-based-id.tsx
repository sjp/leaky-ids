import type { ComponentChildren } from "preact";
import { Timestamp } from "./timestamp";

export interface TimeBasedIdProps {
  id: string;
  timestamp: Date;
  // Human-readable format name, e.g. "ULID"
  formatName: string;
  // Link to the format's specification or documentation
  formatHref: string;
  // Optional text placed directly after the format link, e.g. an expansion of an acronym
  formatSuffix?: string;
  // Extra detail rendered between the timestamp and the closing advice
  children?: ComponentChildren;
}

// Shared layout for every identifier format whose only (or main) leak is an
// embedded creation timestamp.
export const TimeBasedId = ({
  id,
  timestamp,
  formatName,
  formatHref,
  formatSuffix,
  children,
}: TimeBasedIdProps) => {
  return (
    <article>
      <header>
        <h2 style={{ textAlign: "center" }}>Yes! ⚠</h2>
      </header>
      <p>
        Your ID <code>{id}</code> is a valid{" "}
        <a href={formatHref} target="_blank" rel="noopener noreferrer">
          {formatName}
        </a>
        {formatSuffix ? ` ${formatSuffix}` : ""}. This means we can determine when it was created.
      </p>
      <Timestamp timestamp={timestamp} />
      {children}
      <p>
        In most cases knowing the creation date is not sensitive information. However, if that
        information is sensitive you may wish to hide it.
      </p>
    </article>
  );
};
