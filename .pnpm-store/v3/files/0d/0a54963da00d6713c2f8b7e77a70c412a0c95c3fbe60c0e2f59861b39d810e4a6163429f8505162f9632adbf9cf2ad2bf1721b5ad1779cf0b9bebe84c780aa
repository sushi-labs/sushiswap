function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Parser } from "../Parser.js";
import { parseNDigits, normalizeTwoDigitYear, mapValue } from "../utils.js";
import getUTCWeekYear from "../../../_lib/getUTCWeekYear/index.js";
import startOfUTCWeek from "../../../_lib/startOfUTCWeek/index.js";
// Local week-numbering year
export class LocalWeekYearParser extends Parser {
  constructor() {
    super(...arguments);

    _defineProperty(this, "priority", 130);

    _defineProperty(this, "incompatibleTokens", ['y', 'R', 'u', 'Q', 'q', 'M', 'L', 'I', 'd', 'D', 'i', 't', 'T']);
  }

  parse(dateString, token, match) {
    var valueCallback = function (year) {
      return {
        year: year,
        isTwoDigitYear: token === 'YY'
      };
    };

    switch (token) {
      case 'Y':
        return mapValue(parseNDigits(4, dateString), valueCallback);

      case 'Yo':
        return mapValue(match.ordinalNumber(dateString, {
          unit: 'year'
        }), valueCallback);

      default:
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
    }
  }

  validate(_date, value) {
    return value.isTwoDigitYear || value.year > 0;
  }

  set(date, flags, value, options) {
    var currentYear = getUTCWeekYear(date, options);

    if (value.isTwoDigitYear) {
      var normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
      date.setUTCFullYear(normalizedTwoDigitYear, 0, options.firstWeekContainsDate);
      date.setUTCHours(0, 0, 0, 0);
      return startOfUTCWeek(date, options);
    }

    var year = !('era' in flags) || flags.era === 1 ? value.year : 1 - value.year;
    date.setUTCFullYear(year, 0, options.firstWeekContainsDate);
    date.setUTCHours(0, 0, 0, 0);
    return startOfUTCWeek(date, options);
  }

}