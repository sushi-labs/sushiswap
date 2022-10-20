'use strict';

var antlr4 = require('./antlr4/index');

function ErrorListener() {
  antlr4.error.ErrorListener.call(this);
  this._errors = [];
}

ErrorListener.prototype = Object.create(antlr4.error.ErrorListener.prototype);
ErrorListener.prototype.constructor = ErrorListener;

ErrorListener.prototype.syntaxError = function (recognizer, offendingSymbol, line, column, message) {
  this._errors.push({ message: message, line: line, column: column });
};

ErrorListener.prototype.getErrors = function () {
  return this._errors;
};

ErrorListener.prototype.hasErrors = function () {
  return this._errors.length > 0;
};

module.exports = ErrorListener;