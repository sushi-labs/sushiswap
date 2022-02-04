import "../styles/globals.css";
import { FC, useEffect } from "react";
import type { AppProps } from "next/app";

const Noop: FC = ({ children }) => <>{children}</>;

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const Layout = (Component as any).Layout || Noop;

  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);

  return (
    <Layout pageProps={pageProps}>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
