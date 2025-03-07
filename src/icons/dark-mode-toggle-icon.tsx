import type { CSSProperties, PropsWithChildren } from "preact/compat";
import type { ComponentProps } from "preact";

interface CoreHtmlProps extends PropsWithChildren {
  className?: string;
  title?: string;
  type?: string;
  "aria-label"?: string;
}

interface BaseToggleProps extends CoreHtmlProps {
  toggled?: boolean;
  onToggled?: (toggled: boolean) => void;
  duration?: number;
  reversed?: boolean;
  forceMotion?: boolean;
  idPrefix?: string;
  svgProps?: ComponentProps<"svg">;
}

type ToggleProps = BaseToggleProps;

export const Classic = ({
  onToggled,
  toggled,
  duration = 500,
  reversed = false,
  title = "Toggle theme",
  forceMotion = false,
  idPrefix = "",
  "aria-label": ariaLabel = "Toggle theme",
  className,
  children,
}: ToggleProps) => {
  const classes = [
    "theme-toggle",
    toggled !== undefined && toggled ? "theme-toggle--toggled" : undefined,
    toggled !== undefined && !toggled ? "theme-toggle--untoggled" : undefined,
    forceMotion ? "theme-toggle--force-motion" : undefined,
    reversed ? "theme-toggle--reversed" : undefined,
    className,
  ].join(" ");
  const style: CSSProperties = {
    "--theme-toggle__classic--duration": `${duration}ms`,
  };

  const handleClick = () => {
    onToggled?.(!toggled);
  };

  return (
    <button
      type="button"
      class={classes}
      aria-label={ariaLabel}
      title={title}
      onClick={handleClick}
      style={style}
    >
      {children}
      {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
          class="theme-toggle__classic"
          viewBox="0 0 24 24"
        >
          <clipPath id={`${idPrefix || ""}a`}>
            <path d="M0 0h25a1 1 0 0 0 10 10v14H0Z" />
          </clipPath>
          <g
            stroke="currentColor"
            strokeLinecap="round"
            clipPath={`url(#${idPrefix || ""}a)`}
          >
            <circle cx={12} cy={12} r={5} />
            <path
              fill="none"
              strokeLinejoin="round"
              strokeMiterlimit={0}
              strokeWidth={2}
              d="M12 1.4v2.4m8.3-.1-2.5 2.5m4.8 5.8h-2.4M12 22.6v-2.4M1.4 12h2.4m16.5 8.3-2.5-2.5M3.7 20.3l2.5-2.5M3.7 3.7l2.5 2.5"
              paintOrder="stroke markers fill"
            />
          </g>
        </svg>
      }
    </button>
  );
};
