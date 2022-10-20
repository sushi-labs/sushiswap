function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Parser } from "../Parser.js";
import { numericPatterns } from "../constants.js";
import { parseNumericPattern, parseNDigits } from "../utils.js";
export class Hour0To11Parser extends Parser {
  constructor() {
    super(...arguments);

    _defineProperty(this, "priority", 70);

    _defineProperty(this, "incompatibleTokens", ['h', 'H', 'k', 't', 'T']);
  }

  parse(dateString, token, match) {
    switch (token) {
      case 'K':
        return parseNumericPattern(numericPatterns.hour11h, dateString);

      case 'Ko':
        return match.ordinalNumber(dateString, {
          unit: 'hour'
        });

      default:
        return parseNDigits(token.length, dateString);
    }
  }

  validate(_date, value) {
    return value >= 0 && value <= 11;
  }

  set(date, _flags, value) {
    var isPM = date.getUTCHours() >= 12;

    if (isPM && value < 12) {
      date.setUTCHours(value + 12, 0, 0, 0);
    } else {
      date.setUTCHours(value, 0, 0, 0);
    }

    return date;
  }

}