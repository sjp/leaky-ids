export interface IntegerIdProps {
  id: number;
}

export const IntegerId = ({ id }: IntegerIdProps) => {
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
        "enumeration" attack, by browsing to pages like <code>/user/12345</code>
        and incrementing to <code>/user/12346</code>, <code>/user/12347</code>{" "}
        and so on. If a web application is not adequately secured this can leak
        further information.
      </p>
    </article>
  );
};
