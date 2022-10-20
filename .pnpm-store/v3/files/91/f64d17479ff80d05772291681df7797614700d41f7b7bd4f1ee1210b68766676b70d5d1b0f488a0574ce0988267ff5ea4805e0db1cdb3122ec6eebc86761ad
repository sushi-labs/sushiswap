function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Parser } from "../Parser.js";
import { numericPatterns } from "../constants.js";
import { parseNumericPattern, parseNDigits } from "../utils.js";
export class Hour0to23Parser extends Parser {
  constructor() {
    super(...arguments);

    _defineProperty(this, "priority", 70);

    _defineProperty(this, "incompatibleTokens", ['a', 'b', 'h', 'K', 'k', 't', 'T']);
  }

  parse(dateString, token, match) {
    switch (token) {
      case 'H':
        return parseNumericPattern(numericPatterns.hour23h, dateString);

      case 'Ho':
        return match.ordinalNumber(dateString, {
          unit: 'hour'
        });

      default:
        return parseNDigits(token.length, dateString);
    }
  }

  validate(_date, value) {
    return value >= 0 && value <= 23;
  }

  set(date, _flags, value) {
    date.setUTCHours(value, 0, 0, 0);
    return date;
  }

}