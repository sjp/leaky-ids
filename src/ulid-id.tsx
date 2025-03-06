export interface UlidIdProps {
  id: string;
  timestamp: Date;
}

export const UlidId = ({ id, timestamp }: UlidIdProps) => {
  return (
    <>
      {id} {timestamp}
    </>
  );
};
