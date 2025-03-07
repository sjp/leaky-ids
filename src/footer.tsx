import { GitHubIcon } from "./icons/github-icon";

export const Footer = () => {
  return (
    <footer>
      <a href="https://sjp.co.nz" target="_blank" rel="noreferrer noopener">
        Built by sjp
      </a>{" "}
      <a
        href="https://github.com/sjp/leaky-ids"
        class="secondary"
        target="_blank"
        rel="noreferrer noopener"
      >
        <GitHubIcon />
      </a>
    </footer>
  );
};
