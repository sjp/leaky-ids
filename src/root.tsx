import { useState } from "preact/hooks";
import { Header } from "./header";
import { Footer } from "./footer";
import { IdInformation } from "./id-information";
import { useDebounce } from "./hooks/use-debounce";

export const Root = () => {
  const [userId, setUserId] = useState("");
  const debouncedUserId = useDebounce(userId, 500);

  return (
    <>
      <Header />
      <main class="container">
        <section>
          <article>
            <header>
              <h1 style={{ textAlign: "center" }}>Is my ID leaky?</h1>
            </header>
            <p>
              Check to see whether the identifier you use in your application
              can leak information to competitors, customers, or malicious
              adversaries.
            </p>
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
        {!!debouncedUserId && (
          <section>
            <IdInformation id={debouncedUserId} />
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};
