const withTM = require("next-transpile-modules")(["ui"]);

module.exports = withTM({
  basePath: "/analytics",
  reactStrictMode: true,
});
