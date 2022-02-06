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
                  var darkMode = window.localStorage.getItem("color-theme") === "dark";
                
                  if (query.matches || darkMode) {
                    document.documentElement.classList.add("dark");
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
