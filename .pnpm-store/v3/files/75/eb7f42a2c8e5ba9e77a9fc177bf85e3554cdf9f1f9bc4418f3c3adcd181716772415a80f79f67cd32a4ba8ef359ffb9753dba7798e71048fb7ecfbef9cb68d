function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Parser } from "../Parser.js";
import { numericPatterns } from "../constants.js";
import { parseNumericPattern, parseNDigits } from "../utils.js";
import setUTCWeek from "../../../_lib/setUTCWeek/index.js";
import startOfUTCWeek from "../../../_lib/startOfUTCWeek/index.js"; // Local week of year

export class LocalWeekParser extends Parser {
  constructor() {
    super(...arguments);

    _defineProperty(this, "priority", 100);

    _defineProperty(this, "incompatibleTokens", ['y', 'R', 'u', 'q', 'Q', 'M', 'L', 'I', 'd', 'D', 'i', 't', 'T']);
  }

  parse(dateString, token, match) {
    switch (token) {
      case 'w':
        return parseNumericPattern(numericPatterns.week, dateString);

      case 'wo':
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

  set(date, _flags, value, options) {
    return startOfUTCWeek(setUTCWeek(date, value, options), options);
  }

}