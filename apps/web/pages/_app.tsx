import "../theme/styles/globals.css";
import { FC, useEffect } from "react";
import type { AppProps } from "next/app";
import Background from "app/components/Background";
import { ThemeProvider } from "theme/ThemeContext";
import { ChainId } from "@sushiswap/core-sdk";
import dynamic from "next/dynamic";

const NetworkGuard = dynamic(
  () => import("../components/guards/NetworkGuard"),
  { ssr: false }
);

const Noop: FC = ({ children }) => <>{children}</>;

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const Layout = (Component as any).Layout || Noop;

  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);

  return (
    <ThemeProvider>
      <NetworkGuard networks={[ChainId.ETHEREUM, ChainId.FANTOM, ChainId.BSC]}>
        <Background>
          <Layout pageProps={pageProps}>
            <Component {...pageProps} />
          </Layout>
        </Background>
      </NetworkGuard>
    </ThemeProvider>
  );
};

export default MyApp;
