export interface UlidIdProps {
  id: string;
  timestamp: Date;
}

export const UlidId = ({ id, timestamp }: UlidIdProps) => {
  return (
    <>
      This ID is a ULID id: {id}. It was generated at: {timestamp}
    </>
  );
};
