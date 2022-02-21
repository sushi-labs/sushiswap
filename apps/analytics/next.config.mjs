import transpileModules from "next-transpile-modules";

const withTranspileModules = transpileModules(["ui", "config"]);

export default withTranspileModules({
  basePath: "/analytics",
  reactStrictMode: true,
  swcMinify: true,
});
