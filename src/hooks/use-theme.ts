import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";

export type Theme = "light" | "dark";

type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }
    return defaultValue;
  });

  // Handles the change event of the media query.
  const handleChange = () => {
    setMatches(getMatches(query));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: this is sourced from elsewhere and the dependency set is correct
  useLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Use deprecated `addListener` and `removeListener` to support Safari < 14
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
  }, [query]);

  return matches;
}

const useSystemDarkModePreference = (): Theme => {
  return useMediaQuery("(prefers-color-scheme: dark)") ? "dark" : "light";
};

export const useTheme = () => {
  const htmlRef = useRef(document.querySelector("html"));
  const systemTheme = useSystemDarkModePreference();

  const [theme, setTheme] = useState(systemTheme);

  useEffect(() => {
    setTheme(systemTheme);
  }, [systemTheme]);

  useEffect(() => {
    if (!htmlRef.current) {
      return;
    }

    htmlRef.current.dataset.theme = theme;
  }, [theme]);

  return {
    theme,
    systemTheme,
    setTheme,
  };
};
