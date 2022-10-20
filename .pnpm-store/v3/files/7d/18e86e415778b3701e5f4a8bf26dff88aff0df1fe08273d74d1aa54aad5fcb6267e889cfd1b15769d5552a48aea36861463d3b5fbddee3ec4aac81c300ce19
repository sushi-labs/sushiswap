module.exports = function strykerConf(config) {
  config.set({
    mutator: {
      name: 'javascript',
      excludedMutations: ['BooleanSubstitution', 'StringLiteral', 'ArrayLiteral', 'ObjectLiteral']
    },
    mutate: ['lib/rules/**/*.js', '!lib/rules/index.js', '!lib/rules/align/**/*.js'],
    packageManager: 'npm',
    reporters: ['clear-text', 'progress'],
    testRunner: 'mocha',
    transpilers: [],
    coverageAnalysis: 'all',
    mochaOptions: {
      files: ['test/**/*.js']
    }
  })
}
