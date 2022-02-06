import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                try {
                  var query = window.matchMedia("(prefers-color-scheme: dark)");
                  var darkMode = window.localStorage.getItem("darkMode") === "true";
                
                  if (darkMode) {
                    document.documentElement.classList.add("dark-theme");
                  }
                } catch (e) {
                  // Silence
                }
              `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
