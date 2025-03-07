import { useCallback } from "preact/hooks";
import { useTheme } from "./hooks/use-theme";
import { Classic } from "./icons/dark-mode-toggle-icon";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const isToggled = theme === "dark";
  const toggleTheme = useCallback(
    (toggled: boolean) => {
      setTheme(toggled ? "dark" : "light");
    },
    [setTheme]
  );

  return (
    <header>
      <div
        class="container"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <strong
          style={{ marginBottom: "var(--pico-spacing)", textWrap: "nowrap" }}
        >
          Is my ID leaky?
        </strong>
        <div
          class="container"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "var(--pico-spacing)",
          }}
        >
          <Classic
            title="Toggle Theme"
            aria-label="Toggle Theme"
            toggled={isToggled}
            // biome-ignore lint/suspicious/noReactSpecificProps: for compat with react, this must be className, even though preact supports class
            className="secondary"
            onToggled={toggleTheme}
          />
        </div>
      </div>
    </header>
  );
};
