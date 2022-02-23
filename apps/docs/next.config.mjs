import transpileModules from "next-transpile-modules";

const withTranspileModules = transpileModules(["ui"]);

export default withTranspileModules({
  basePath: "/docs",
  reactStrictMode: true,
  swcMinify: true,
});
