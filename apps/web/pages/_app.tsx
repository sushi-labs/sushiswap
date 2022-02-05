import "../theme/styles/globals.css";
import { FC, useEffect } from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "../theme";
import Background from "app/components/Background";

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
