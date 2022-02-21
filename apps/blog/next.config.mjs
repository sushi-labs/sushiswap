import transpileModules from "next-transpile-modules";

const withTranspileModules = transpileModules(["ui", "config"]);

export default withTranspileModules({
  basePath: "/blog",
  reactStrictMode: true,
  swcMinify: true,
});
