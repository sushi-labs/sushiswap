"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = intervalToDuration;

var _index = _interopRequireDefault(require("../add/index.js"));

var _index2 = _interopRequireDefault(require("../differenceInDays/index.js"));

var _index3 = _interopRequireDefault(require("../differenceInHours/index.js"));

var _index4 = _interopRequireDefault(require("../differenceInMinutes/index.js"));

var _index5 = _interopRequireDefault(require("../differenceInMonths/index.js"));

var _index6 = _interopRequireDefault(require("../differenceInSeconds/index.js"));

var _index7 = _interopRequireDefault(require("../differenceInYears/index.js"));

var _index8 = _interopRequireDefault(require("../toDate/index.js"));

var _index9 = _interopRequireDefault(require("../_lib/requiredArgs/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @name intervalToDuration
 * @category Common Helpers
 * @summary Convert interval to duration
 *
 * @description
 * Convert a interval object to a duration object.
 *
 * @param {Interval} interval - the interval to convert to duration
 *
 * @returns {Duration} The duration Object
 * @throws {TypeError} Requires 2 arguments
 * @throws {RangeError} `start` must not be Invalid Date
 * @throws {RangeError} `end` must not be Invalid Date
 * @throws {RangeError} The start of an interval cannot be after its end
 *
 * @example
 * // Get the duration between January 15, 1929 and April 4, 1968.
 * intervalToDuration({
 *   start: new Date(1929, 0, 15, 12, 0, 0),
 *   end: new Date(1968, 3, 4, 19, 5, 0)
 * })
 * // => { years: 39, months: 2, days: 20, hours: 7, minutes: 5, seconds: 0 }
 */
function intervalToDuration(interval) {
  (0, _index9.default)(1, arguments);
  var start = (0, _index8.default)(interval.start);
  var end = (0, _index8.default)(interval.end);
  if (isNaN(start.getTime())) throw new RangeError('Start Date is invalid');
  if (isNaN(end.getTime())) throw new RangeError('End Date is invalid');

  if (start > end) {
    throw new RangeError('The start of an interval cannot be after its end');
  }

  var duration = {
    years: (0, _index7.default)(end, start)
  };
  var remainingMonths = (0, _index.default)(start, {
    years: duration.years
  });
  duration.months = (0, _index5.default)(end, remainingMonths);
  var remainingDays = (0, _index.default)(remainingMonths, {
    months: duration.months
  });
  duration.days = (0, _index2.default)(end, remainingDays);
  var remainingHours = (0, _index.default)(remainingDays, {
    days: duration.days
  });
  duration.hours = (0, _index3.default)(end, remainingHours);
  var remainingMinutes = (0, _index.default)(remainingHours, {
    hours: duration.hours
  });
  duration.minutes = (0, _index4.default)(end, remainingMinutes);
  var remainingSeconds = (0, _index.default)(remainingMinutes, {
    minutes: duration.minutes
  });
  duration.seconds = (0, _index6.default)(end, remainingSeconds);
  return duration;
}

module.exports = exports.default;