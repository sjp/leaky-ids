export interface UuidV7IdProps {
  id: string;
  timestamp: Date;
}

export const UuidV7Id = ({ id, timestamp }: UuidV7IdProps) => {
  return (
    <>
      This ID is a UUID v7 id: {id}. It was generated at: {timestamp}
    </>
  );
};
