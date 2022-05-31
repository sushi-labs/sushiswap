module.exports = {
  catalogs: [
    {
      path: '<rootDir>/locale/{locale}',
      include: ['<rootDir>/src'],
      exclude: ['**/node_modules/**'],
    },
  ],
  // compileNamespace: 'cjs',
  // extractBabelOptions: {},
  fallbackLocales: {},
  format: 'minimal',
  formatOptions: { origins: false, lineNumbers: false },
  sourceLocale: 'en',
  locales: [
    'de',
    'en',
    'es',
    'it',
    'ro',
    'ru',
    'vi',
    'zh_CN',
    'zh_TW',
    'ko',
    'ja',
    'fr',
    'fa',
    'pt_BR',
    'hi',
    'tr',
    'el',
    'pl',
  ],
  orderBy: 'messageId',
  pseudoLocale: '',
  rootDir: '.',
  runtimeConfigModule: {
    i18n: ['@lingui/core', 'i18n'],
    Trans: ['@lingui/react', 'Trans'],
  },
}

// For reference

// var defaultConfig = {
//   catalogs: [{
//     path: pathJoinPosix("<rootDir>", "locale", "{locale}", "messages"),
//     include: ["<rootDir>"],
//     exclude: ["*/node_modules/*"]
//   }],
//   catalogsMergePath: "",
//   compileNamespace: "cjs",
//   compilerBabelOptions: {
//     minified: true,
//     jsescOption: {
//       minimal: true
//     }
//   },
//   extractBabelOptions: {
//     plugins: [],
//     presets: []
//   },
//   fallbackLocales: {},
//   format: "po",
//   formatOptions: {
//     origins: true,
//     lineNumbers: true
//   },
//   locales: [],
//   orderBy: "messageId",
//   pseudoLocale: "",
//   rootDir: ".",
//   runtimeConfigModule: ["@lingui/core", "i18n"],
//   sourceLocale: ""
// };

// var exampleConfig = _objectSpread(_objectSpread({}, defaultConfig), {}, {
//   runtimeConfigModule: (0, _jestValidate.multipleValidOptions)({
//     i18n: ["@lingui/core", "i18n"],
//     Trans: ["@lingui/react", "Trans"]
//   }, ["@lingui/core", "i18n"]),
//   fallbackLocales: (0, _jestValidate.multipleValidOptions)({}, {
//     "en-US": "en"
//   }, {
//     "en-US": ["en"]
//   }, {
//     default: "en"
//   }, false),
//   extractBabelOptions: {
//     extends: "babelconfig.js",
//     rootMode: "rootmode",
//     plugins: ["plugin"],
//     presets: ["preset"]
//   }
// });
