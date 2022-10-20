'use strict';

/**
 * Parse a full text comment to an object that can be easly consumed
 * @param comment full text comment
 */
module.exports = function (comment) {
  // remove comments definers
  // the comments can be multiline of single line
  if (comment.substring(0, 3) === '/**') {
    // if it is a multiline, remove line breaks, "/**"" (the comment begin)
    // "*/"" (the comment end), and "* @" at the begining of each comment
    comment = comment.replace(/(\r|\n|\/\*\*|\*\/|\*(?=[ ]?@))/g, '');
  } else if (comment.substring(0, 3) === '///') {
    // if it is a single line,
    // remove just line breakers and "///" (the comment begin)
    comment = comment.replace(/(\r|\n|\/\/\/)/g, '');
  }

  // split text by comment type
  var splitComments = comment.split(/@(title|author|notice|dev|param|return)/g);
  // let's start a map
  var resultComments = {};

  // iterate through all the split comments
  // start in the second result (because the first one is usually nothing)
  // then iterate each two elements, because since the split is done using
  // the natspec type
  for (var x = 1; x < splitComments.length; x += 2) {
    var key = splitComments[x];
    var value = splitComments[x + 1].trim();

    // if the comment if type 'param' we need to extract the first word
    // which is the variable name
    if (key === 'param') {
      var sep = value.indexOf(' ');
      var paramName = value.substring(0, sep);
      var paramValue = value.substring(sep + 1);

      if (resultComments['params'] == null) {
        resultComments['params'] = {};
      }

      resultComments['params'][paramName] = paramValue;
    } else {
      // finally, if the value was found, update it
      resultComments[key] = value;
    }
  }
  return resultComments;
};