export interface DefaultIdProps {
  id: string;
}

export const UnknownId = ({ id }: DefaultIdProps) => {
  return (
    <article>
      <header>
        <h2 style={{ textAlign: "center" }}>No known pattern detected ✅</h2>
      </header>
      <p>
        The ID <code>{id}</code> doesn&rsquo;t match any of the identifier formats this tool knows
        about, so nothing obvious (creation time, record count, generating machine) can be read from
        it.
      </p>
      <p>
        That is a good sign, but not a guarantee. This tool cannot detect every way an identifier
        can leak information. In particular:
      </p>
      <ul>
        <li>
          Obfuscated sequential IDs (e.g.{" "}
          <a href="https://sqids.org/" target="_blank" rel="noopener noreferrer">
            Sqids
          </a>
          /Hashids, or base64-encoded integers) look random but are reversible, so they still reveal
          counts and allow enumeration.
        </li>
        <li>
          Time-based formats not yet recognised here (such as cuid, xid, or Firebase push IDs) embed
          a creation timestamp.
        </li>
        <li>
          IDs derived from personal data (a hash of an email address, a username, a national ID
          number) can be guessed or correlated even when they look opaque.
        </li>
      </ul>
      <p>
        If your ID is a v4 UUID, a nanoid, or a similar cryptographically random value, it is
        generally safe to expose publicly.
      </p>
    </article>
  );
};
