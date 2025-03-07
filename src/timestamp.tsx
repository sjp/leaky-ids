const getTimeZoneName = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export interface TimestampProps {
  timestamp: Date;
}

export const Timestamp = ({ timestamp }: TimestampProps) => {
  const tz = getTimeZoneName();

  return (
    <table>
      <tbody style={{ textAlign: "left" }}>
        <tr>
          <th scope="row">Creation Date</th>
          <td>{timestamp.toISOString()}</td>
        </tr>
        <tr>
          <th scope="row">Local Date</th>
          <td>
            {timestamp.toLocaleString()} ({tz})
          </td>
        </tr>
      </tbody>
    </table>
  );
};
