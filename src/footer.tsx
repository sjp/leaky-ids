import { GitHubIcon } from "./icons/github-icon";
import "./root.css";

export const Footer = () => {
  return (
    <footer>
      <a href="https://sjp.co.nz" target="_blank" rel="noreferrer noopener">
        Built by sjp
      </a>{" "}
      <a
        href="https://github.com/sjp/getwifi-web"
        class="secondary"
        target="_blank"
        rel="noreferrer noopener"
      >
        <GitHubIcon />
      </a>
    </footer>
  );
};
