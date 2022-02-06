const withTM = require("next-transpile-modules")(["ui", "config"]);

module.exports = withTM({
  reactStrictMode: false,
});
