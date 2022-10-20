const { parse } = require('graphql');

module.exports = {
  process(fileData) {
    return {code: `module.exports = ${JSON.stringify(parse(fileData))}`};
  }
};
