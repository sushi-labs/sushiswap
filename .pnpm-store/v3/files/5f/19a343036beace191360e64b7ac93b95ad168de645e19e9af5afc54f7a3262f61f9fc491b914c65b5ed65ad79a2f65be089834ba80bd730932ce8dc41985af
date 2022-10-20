function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Parser } from "../Parser.js";
import { numericPatterns } from "../constants.js";
import { parseNumericPattern, parseNDigits } from "../utils.js";
import setUTCISOWeek from "../../../_lib/setUTCISOWeek/index.js";
import startOfUTCISOWeek from "../../../_lib/startOfUTCISOWeek/index.js"; // ISO week of year

export class ISOWeekParser extends Parser {
  constructor() {
    super(...arguments);

    _defineProperty(this, "priority", 100);

    _defineProperty(this, "incompatibleTokens", ['y', 'Y', 'u', 'q', 'Q', 'M', 'L', 'w', 'd', 'D', 'e', 'c', 't', 'T']);
  }

  parse(dateString, token, match) {
    switch (token) {
      case 'I':
        return parseNumericPattern(numericPatterns.week, dateString);

      case 'Io':
        return match.ordinalNumber(dateString, {
          unit: 'week'
        });

      default:
        return parseNDigits(token.length, dateString);
    }
  }

  validate(_date, value) {
    return value >= 1 && value <= 53;
  }

  set(date, _flags, value) {
    return startOfUTCISOWeek(setUTCISOWeek(date, value));
  }

}