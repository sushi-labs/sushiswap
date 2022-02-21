import transpileModules from "next-transpile-modules";

const withTranspileModules = transpileModules(["ui", "config"]);

export default withTranspileModules({
  basePath: "/docs",
  reactStrictMode: true,
  swcMinify: true,
});
