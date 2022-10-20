function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Parser } from "../Parser.js";
import { timezonePatterns } from "../constants.js";
import { parseTimezonePattern } from "../utils.js"; // Timezone (ISO-8601. +00:00 is `'Z'`)

export class ISOTimezoneWithZParser extends Parser {
  constructor() {
    super(...arguments);

    _defineProperty(this, "priority", 10);

    _defineProperty(this, "incompatibleTokens", ['t', 'T', 'x']);
  }

  parse(dateString, token) {
    switch (token) {
      case 'X':
        return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);

      case 'XX':
        return parseTimezonePattern(timezonePatterns.basic, dateString);

      case 'XXXX':
        return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);

      case 'XXXXX':
        return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);

      case 'XXX':
      default:
        return parseTimezonePattern(timezonePatterns.extended, dateString);
    }
  }

  set(date, flags, value) {
    if (flags.timestampIsSet) {
      return date;
    }

    return new Date(date.getTime() - value);
  }

}