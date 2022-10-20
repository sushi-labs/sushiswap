const { parse } = require('graphql');
const { readFileSync } = require('fs');

const VALID_EXTENSIONS = ['graphql', 'graphqls', 'gql', 'gqls'];

function handleModule(m, filename) {
  const content = readFileSync(filename, 'utf-8');

  m.exports = parse(content);
}

VALID_EXTENSIONS.forEach(ext => {
  require.extensions[`.${ext}`] = handleModule;
});
