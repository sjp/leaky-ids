export interface UuidV7IdProps {
  id: string;
  timestamp: Date;
}

export const UuidV7Id = ({ id, timestamp }: UuidV7IdProps) => {
  return (
    <>
      {id} {timestamp}
    </>
  );
};
