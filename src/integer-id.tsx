// returns 3 exactly
const getExampleIncrementingUserIds = (id: bigint) => {
  return [id, id + 1n, id + 2n];
};

export interface IntegerIdProps {
  id: bigint;
}

export const IntegerId = ({ id }: IntegerIdProps) => {
  const exampleIncrementingIds = getExampleIncrementingUserIds(id).map((n) => n.toString());

  return (
    <article>
      <header>
        <h2 style={{ textAlign: "center" }}>Yes! ⚠</h2>
      </header>
      <p>
        Your ID <code>{id.toString()}</code> might be an auto-incrementing integer, commonly used in
        databases as unique identifiers.
      </p>
      <p>
        When using an auto-incrementing integer, you can leak information on how many entities in
        your database exist for a entity type. For example, if you have a user ID of{" "}
        <code>12345</code>, then it is highly likely there are at least 12,345 users for the given
        application. This can be used by competitors to work out how many users your application
        might have, the number of orders your application might process, etc.
      </p>
      <p>
        Malicious users may also use this information to perform an &ldquo;enumeration
        attack&rdquo;, by browsing to pages like <code>/user/{exampleIncrementingIds[0]}</code>
        and incrementing to <code>/user/{exampleIncrementingIds[1]}</code>,{" "}
        <code>/user/{exampleIncrementingIds[2]}</code> and so on. If a web application is not
        adequately secured this can leak further information.
      </p>
    </article>
  );
};
