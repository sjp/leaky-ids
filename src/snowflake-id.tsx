import { useState } from "react";
import { Timestamp } from "./timestamp";
import {
  SNOWFLAKE_EPOCHS,
  getSnowflakeTimestamp,
  type SnowflakePlatform,
} from "./parsing";

export interface SnowflakeIdProps {
  id: string;
  platforms: SnowflakePlatform[];
}

export const SnowflakeId = ({ id, platforms }: SnowflakeIdProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<SnowflakePlatform>(
    platforms[0]
  );

  const timestamp = getSnowflakeTimestamp(id, selectedPlatform);

  return (
    <article>
      <header>
        <h2 style={{ textAlign: "center" }}>Yes! ⚠</h2>
      </header>
      <p>
        Your ID <code>{id}</code> is a valid{" "}
        <a
          href="https://en.wikipedia.org/wiki/Snowflake_ID"
          target="_blank"
          rel="noopener noreferrer"
        >
          Snowflake ID
        </a>
        . This means we can determine when it was created.
      </p>

      {platforms.length > 1 && (
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="platform-select">
            <strong>Select platform:</strong>
          </label>
          <select
            id="platform-select"
            value={selectedPlatform}
            onChange={(e) =>
              setSelectedPlatform(e.currentTarget.value as SnowflakePlatform)
            }
            style={{
              marginLeft: "0.5rem",
              padding: "0.25rem 0.5rem",
              fontSize: "1rem",
            }}
          >
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {SNOWFLAKE_EPOCHS[platform].name}
              </option>
            ))}
          </select>
        </div>
      )}

      {platforms.length === 1 && (
        <p>
          <strong>Platform:</strong> {SNOWFLAKE_EPOCHS[selectedPlatform].name}
        </p>
      )}

      {timestamp && <Timestamp timestamp={timestamp} />}

      <p>
        In most cases knowing the creation date is not sensitive information.
        However, if that information is sensitive you may wish to hide it.
        Snowflake IDs are commonly used by Twitter, Discord, Instagram,
        Mastodon, and other high-scale systems.
      </p>
    </article>
  );
};
