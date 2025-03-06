export interface DefaultIdProps {
  id: string;
}

export const DefaultId = ({ id }: DefaultIdProps) => {
  return (
    <>
      I couldn't work out an obvious pattern to the ID {id}. This is probably
      safe to use publicly.
    </>
  );
};
