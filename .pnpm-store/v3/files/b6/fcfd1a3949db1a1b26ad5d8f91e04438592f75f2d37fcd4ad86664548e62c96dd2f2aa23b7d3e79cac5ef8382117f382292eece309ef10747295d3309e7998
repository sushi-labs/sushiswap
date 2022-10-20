function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Parser } from "../Parser.js";
import { timezonePatterns } from "../constants.js";
import { parseTimezonePattern } from "../utils.js"; // Timezone (ISO-8601)

export class ISOTimezoneParser extends Parser {
  constructor() {
    super(...arguments);

    _defineProperty(this, "priority", 10);

    _defineProperty(this, "incompatibleTokens", ['t', 'T', 'X']);
  }

  parse(dateString, token) {
    switch (token) {
      case 'x':
        return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);

      case 'xx':
        return parseTimezonePattern(timezonePatterns.basic, dateString);

      case 'xxxx':
        return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);

      case 'xxxxx':
        return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);

      case 'xxx':
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