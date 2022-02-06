import "../theme/styles/globals.css";
import { FC, useEffect } from "react";
import type { AppProps } from "next/app";
import Background from "app/components/Background";
import { ThemeProvider } from "theme/ThemeContext";

const Noop: FC = ({ children }) => <>{children}</>;

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const Layout = (Component as any).Layout || Noop;

  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);

  return (
    <ThemeProvider>
      <Background>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </Background>
    </ThemeProvider>
  );
};

export default MyApp;
