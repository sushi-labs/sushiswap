function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Parser } from "../Parser.js";
import { parseAnyDigitsSigned } from "../utils.js";
export class TimestampSecondsParser extends Parser {
  constructor() {
    super(...arguments);

    _defineProperty(this, "priority", 40);

    _defineProperty(this, "incompatibleTokens", '*');
  }

  parse(dateString) {
    return parseAnyDigitsSigned(dateString);
  }

  set(_date, _flags, value) {
    return [new Date(value * 1000), {
      timestampIsSet: true
    }];
  }

}