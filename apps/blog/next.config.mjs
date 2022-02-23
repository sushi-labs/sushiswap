import transpileModules from "next-transpile-modules";

const withTranspileModules = transpileModules(["ui"]);

export default withTranspileModules({
  basePath: "/blog",
  reactStrictMode: true,
  swcMinify: true,
});
