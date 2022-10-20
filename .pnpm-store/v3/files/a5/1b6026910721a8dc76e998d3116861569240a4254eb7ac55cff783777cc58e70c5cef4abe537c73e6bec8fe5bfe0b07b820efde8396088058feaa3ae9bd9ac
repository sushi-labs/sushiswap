/* jshint esversion: 6 */

module.exports = (data, separator = '&', oxfordComma = false) => {
  const input = [].concat(data);
  const items = input.length;
  const lastItem = input.pop();
  if (input.length) {
    return`${input.join(', ')}${oxfordComma && items > 2 ? ',': ''} ${separator} ${lastItem}`.trim();
  } else {
    return lastItem;
  }
};
