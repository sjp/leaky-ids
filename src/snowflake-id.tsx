import { useState } from "preact/hooks";
import { TimeBasedId } from "./time-based-id";
import { SNOWFLAKE_EPOCHS, type SnowflakeCandidate } from "./parsing";

export interface SnowflakeIdProps {
  id: string;
  candidates: SnowflakeCandidate[];
}

export const SnowflakeId = ({ id, candidates }: SnowflakeIdProps) => {
  const [selected, setSelected] = useState<SnowflakeCandidate>(candidates[0]);

  return (
    <TimeBasedId
      id={id}
      timestamp={selected.timestamp}
      formatName="Snowflake ID"
      formatHref="https://en.wikipedia.org/wiki/Snowflake_ID"
    >
      {candidates.length > 1 ? (
        <div style={{ marginBottom: "1rem" }}>
          <label for="platform-select">
            <strong>Select platform:</strong>
          </label>
          <select
            id="platform-select"
            value={selected.platform}
            onChange={(e) => {
              const platform = e.currentTarget.value;
              const next = candidates.find((c) => c.platform === platform);
              if (next) setSelected(next);
            }}
            style={{ marginLeft: "0.5rem", padding: "0.25rem 0.5rem", fontSize: "1rem" }}
          >
            {candidates.map(({ platform }) => (
              <option key={platform} value={platform}>
                {SNOWFLAKE_EPOCHS[platform].name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>
          <strong>Platform:</strong> {SNOWFLAKE_EPOCHS[selected.platform].name}
        </p>
      )}
      <p>
        Snowflake IDs are commonly used by Twitter, Discord, Instagram, Mastodon, and other
        high-scale systems. The layout (and therefore the decoded date) differs per platform.
      </p>
    </TimeBasedId>
  );
};
