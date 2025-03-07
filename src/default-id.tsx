export interface DefaultIdProps {
  id: string;
}

export const DefaultId = ({ id }: DefaultIdProps) => {
  return (
    <article>
      <header>
        <h2 style={{ textAlign: "center" }}>No! ✅</h2>
      </header>
      <p>
        I couldn't work out an obvious pattern to the ID {id}. This is probably
        safe to use publicly.
      </p>
    </article>
  );
};
