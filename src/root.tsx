import { useState } from "preact/hooks";
import { Header } from "./header";
import { Footer } from "./footer";

export const Root = () => {
  const [, setUserId] = useState("");

  return (
    <>
      <Header />
      <main class="container">
        <section>
          <article>
            <header>
              <h1 style={{ textAlign: "center" }}>This is the main header</h1>
            </header>
            <p>This is a call-to-action text</p>
          </article>
        </section>
        <section>
          <div class="grid">
            <div>
              <form autocomplete="off">
                <fieldset>
                  <label>
                    Enter your ID
                    <input
                      name="user-id"
                      autofocus={true}
                      type="text"
                      onInput={(evt) => {
                        setUserId(evt.currentTarget.value);
                      }}
                    />
                  </label>
                </fieldset>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
