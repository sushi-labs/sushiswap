function debounce(fn) {
  let waitTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let timeout;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (!waitTime) return fn(...args);
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      fn(...args);
    }, waitTime);
  };
}

export { debounce as d };
