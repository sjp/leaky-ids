import { useEffect, useLayoutEffect, useState } from "preact/hooks";

export type Theme = "light" | "dark";

const getMatches = (query: string): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(query).matches;
};

type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

export function useMediaQuery(
  query: string,
  { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {},
): boolean {
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
  const systemTheme = useSystemDarkModePreference();

  const [theme, setTheme] = useState(systemTheme);

  useEffect(() => {
    setTheme(systemTheme);
  }, [systemTheme]);

  // Effects only run on the client, so document.documentElement (the <html>
  // element) is always available here -- no ref or query needed.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return {
    theme,
    systemTheme,
    setTheme,
  };
};
