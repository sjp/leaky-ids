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
              <h1 style={{ textAlign: "center" }}>Is my ID leaky?</h1>
            </header>
            <p>Check to see whether the identifier you use in your application can leak information to competitors, customers, or malicious adversaries.</p>
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
                        setUserId(evt.currentTarget.value.trim());
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
