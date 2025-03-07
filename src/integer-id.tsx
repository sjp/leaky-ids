// very rare but handling the case where someone
// may have used a number that is not safely incrementable in JS
// e.g. if they use Number.MAX_SAFE_INTEGER we cannot increment than that
const isDoubleIncrementable = (id: number) => {
  return id <= Number.MAX_SAFE_INTEGER - 2;
};

const FALLBACK_USER_ID = 12345;

// returns 3 exactly
const getExampleIncrementingUserIds = (id: number) => {
  const resolvedId = isDoubleIncrementable(id) ? id : FALLBACK_USER_ID;
  return [resolvedId, resolvedId + 1, resolvedId + 2];
};

export interface IntegerIdProps {
  id: number;
}

export const IntegerId = ({ id }: IntegerIdProps) => {
  const exampleIncrementingIds = getExampleIncrementingUserIds(id);

  return (
    <article>
      <header>
        <h2 style={{ textAlign: "center" }}>Yes! ⚠</h2>
      </header>
      <p>
        Your ID <code>{id}</code> might be an auto-incrementing integer,
        commonly used in databases as unique identifiers.
      </p>
      <p>
        When using an auto-incrementing integer, you can leak information on how
        many entities in your database exist for a entity type. For example, if
        you have a user ID of <code>12345</code>, then it is highly likely there
        are at least 12,345 users for the given application. This can be used by
        competitors to work out how many users your application might have, the
        number of orders your application might process, etc.
      </p>
      <p>
        Malicious users may also use this information to perform an
        &ldquo;enumeration attack&rdquo;, by browsing to pages like{" "}
        <code>/user/{exampleIncrementingIds[0]}</code>
        and incrementing to <code>/user/{exampleIncrementingIds[1]}</code>,{" "}
        <code>/user/{exampleIncrementingIds[2]}</code> and so on. If a web
        application is not adequately secured this can leak further information.
      </p>
    </article>
  );
};
