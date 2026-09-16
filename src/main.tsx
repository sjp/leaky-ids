import { App } from "./app.tsx";
import { hydrate, prerender as ssr } from "preact-iso";

export const Main = () => {
  return <App />;
};

if (typeof window !== "undefined") {
  const root = document.querySelector("#app");
  if (!root) {
    throw new Error("Could not find the #app element to hydrate into");
  }
  hydrate(<Main />, root);
}

export const prerender = (_data: unknown) => {
  return ssr(<Main />);
};
