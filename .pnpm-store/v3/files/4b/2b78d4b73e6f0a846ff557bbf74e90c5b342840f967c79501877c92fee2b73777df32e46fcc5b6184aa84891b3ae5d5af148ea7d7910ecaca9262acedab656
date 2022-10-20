"use strict";

exports.__esModule = true;
exports.default = exports.useWindowScroll = void 0;

var _throttle = /*#__PURE__*/require("@react-hook/throttle");

var _event = /*#__PURE__*/_interopRequireDefault( /*#__PURE__*/require("@react-hook/event"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const win = typeof window === 'undefined' ? null : window;

const getScrollY = () => win.scrollY !== void 0 ? win.scrollY : win.pageYOffset === void 0 ? 0 : win.pageYOffset;

const useWindowScroll = (fps = 30) => {
  const state = (0, _throttle.useThrottle)(typeof window === 'undefined' ? 0 : getScrollY, fps, true);
  (0, _event.default)(win, 'scroll', () => state[1](getScrollY()));
  return state[0];
};

exports.useWindowScroll = useWindowScroll;
var _default = useWindowScroll;
exports.default = _default;