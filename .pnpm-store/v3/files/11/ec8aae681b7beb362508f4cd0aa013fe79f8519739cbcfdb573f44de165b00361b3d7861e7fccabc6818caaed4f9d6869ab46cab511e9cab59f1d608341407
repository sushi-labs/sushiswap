'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var propTypes = require('prop-types');

var debounce = function debounce(fn, time) {
  var timeout = void 0;

  return function () {
    var _this = this,
        _arguments = arguments;

    var functionCall = function functionCall() {
      return fn.apply(_this, _arguments);
    };

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};

// https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id#6860916

var guidGenerator = (function () {
  var S4 = function S4() {
    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
  };
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
});

function getHighest(elements) {
  var highest = 0;
  elements.forEach(function (el) {
    if (el.rect && el.rect.height > highest) {
      highest = el.rect.height;
    }
  });
  return highest;
}

function nextTriggerOnMount(_ref) {
  var rect = _ref.rect,
      mode = _ref.mode,
      prevOffset = _ref.prevOffset,
      position = _ref.position,
      direction = _ref.direction,
      width = _ref.width;

  if (mode !== 'chain') return false;
  switch (direction) {
    case 'toRight':
      return position.from > 0;
    case 'toLeft':
    default:
      return rect.width + position.from <= width;
  }
}

function getFromOffset(_ref) {
  var rect = _ref.rect,
      offset = _ref.offset,
      direction = _ref.direction;

  switch (direction) {
    case 'toRight':
      return offset - rect.width;
    case 'toLeft':
    default:
      return offset;
  }
}

function getFrom(_ref2) {
  var index = _ref2.index,
      rect = _ref2.rect,
      offset = _ref2.offset,
      width = _ref2.width,
      direction = _ref2.direction;

  if (index === 0) return offset;

  if (typeof offset === 'number') {
    return getFromOffset({ rect: rect, offset: offset, direction: direction });
  }

  switch (direction) {
    case 'toRight':
      return -rect.width;
    case 'toLeft':
    default:
      return width;
  }
}

function getTo(_ref3) {
  var rect = _ref3.rect,
      width = _ref3.width,
      direction = _ref3.direction;

  switch (direction) {
    case 'toRight':
      return width;
    case 'toLeft':
    default:
      return -rect.width;
  }
}

function getNext(_ref4) {
  var mode = _ref4.mode,
      from = _ref4.from,
      direction = _ref4.direction,
      rect = _ref4.rect,
      width = _ref4.width;

  var start = from || 0;

  switch (mode) {
    case 'await':
      switch (direction) {
        case 'toRight':
          return width;
        case 'toLeft':
        default:
          return -rect.width;
      }
    case 'smooth':
      switch (direction) {
        case 'toRight':
          return rect.width > width ? 0 : width - rect.width;
        case 'toLeft':
        default:
          return rect.width > width ? width - rect.width : 0;
      }
    case 'chain':
    default:
      switch (direction) {
        case 'toRight':
          return 0;
        case 'toLeft':
        default:
          return rect.width + start > width ? width - rect.width : width - rect.left - rect.width;
      }
  }
}

var getPosition = (function (_ref5) {
  var mode = _ref5.mode,
      index = _ref5.index,
      rect = _ref5.rect,
      offset = _ref5.offset,
      width = _ref5.width,
      direction = _ref5.direction;

  var from = getFrom({ index: index, rect: rect, offset: offset, width: width, direction: direction });
  var to = getTo({ rect: rect, width: width, direction: direction });
  return {
    from: from,
    to: to,
    next: getNext({ mode: mode, from: from, direction: direction, rect: rect, width: width })
  };
});

function getNextOffset(_ref) {
  var from = _ref.from,
      rect = _ref.rect,
      direction = _ref.direction;

  switch (direction) {
    case 'toRight':
      {
        return from;
      }
    case 'toLeft':
    default:
      {
        return from + rect.width;
      }
  }
}

function getStartOffset(_ref) {
  var offset = _ref.offset,
      rect = _ref.rect,
      direction = _ref.direction,
      width = _ref.width;

  if (offset === 'run-in') {
    switch (direction) {
      case 'toRight':
        return -rect.width;
      case 'toLeft':
      default:
        return width;
    }
  }
  if (typeof offset === 'string') {
    var offsetRelative = Number(offset.replace('%', ''));
    if (offsetRelative) return width / 100 * offsetRelative;
  }
  return offset;
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var TickerElement = function (_React$Component) {
  inherits(TickerElement, _React$Component);

  function TickerElement() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, TickerElement);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = TickerElement.__proto__ || Object.getPrototypeOf(TickerElement)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      children: _this.props.children({
        index: _this.props.index
      }),
      move: _this.props.move,
      position: { from: undefined, to: undefined, next: undefined },
      offset: _this.props.offset,
      rect: null
    }, _this.x = 0, _this.isMoving = false, _this.nextTriggered = false, _this.elementRef = React.createRef(), _this.raf = null, _this.componentDidMount = function () {
      _this.setPosition(true);
      _this.observer = new MutationObserver(_this.onMutation);
      _this.observer.observe(_this.elementRef.current, { characterData: true, childList: true, subtree: true });
    }, _this.componentWillUnmount = function () {
      _this.observer.disconnect();
    }, _this.onMutation = function () {
      _this.setPosition();
    }, _this.componentDidUpdate = function (prevProps, prevState) {
      if (!_this.x && prevState.position.from !== _this.state.position.from) {
        _this.x = _this.state.position.from;
        _this.elementRef.current.style.transform = 'translate3d(' + _this.x + 'px, 0, 0)';
      }
      if (_this.x !== _this.state.position.from && prevProps.prevRect && _this.props.prevRect && prevProps.prevRect.width !== _this.props.prevRect.width) {
        if (_this.props.offset) {
          _this.x = _this.x + (_this.props.offset - prevProps.offset);
        } else {
          _this.x = _this.x + (_this.props.prevRect.width - prevProps.prevRect.width);
        }
        _this.elementRef.current.style.transform = 'translate3d(' + _this.x + 'px, 0, 0)';
      }
      if (_this.props.move && !prevProps.start && _this.props.start) {
        _this.animate();
      }
      if (_this.props.start && !prevProps.move && _this.props.move) {
        _this.animate();
      }
      if (prevProps.move && !_this.props.move) {
        _this.isMoving = false;
        window.cancelAnimationFrame(_this.raf);
      }
    }, _this.setPosition = function (isMount) {
      var _this$props = _this.props,
          mode = _this$props.mode,
          width = _this$props.width,
          id = _this$props.id,
          onNext = _this$props.onNext,
          direction = _this$props.direction,
          index = _this$props.index,
          setRect = _this$props.setRect;


      var rect = _this.elementRef.current.getBoundingClientRect();
      if (rect.width === 0) return;

      var offset = _this.props.index === 0 ? getStartOffset({ offset: _this.props.offset, rect: rect, direction: direction, width: width }) : _this.props.offset;

      var position = getPosition({ mode: mode, rect: rect, index: index, offset: offset, width: width, direction: direction });

      setRect({
        index: _this.props.index,
        rect: rect,
        offset: offset,
        nextOffset: getNextOffset({ from: position.from, rect: rect, direction: direction })
      });

      if (isMount) {
        var nextTriggerOnMount$$1 = nextTriggerOnMount({ mode: mode, rect: rect, position: position, offset: offset, direction: direction, width: width });
        if (nextTriggerOnMount$$1) {
          onNext({
            id: id,
            index: index,
            rect: rect,
            nextOffset: getNextOffset({ from: position.from, rect: rect, direction: direction })
          });
        }
        if (!nextTriggerOnMount$$1 && (offset || index === 0)) {
          onNext({ id: id, index: index, rect: rect });
        }
        _this.nextTriggered = nextTriggerOnMount$$1;
      }

      _this.setState({
        rect: rect,
        offset: offset,
        position: position
      });
    }, _this.shouldTriggerNext = function () {
      if (_this.nextTriggered) return false;
      return _this.props.direction === 'toLeft' ? _this.x <= _this.state.position.next : _this.x >= _this.state.position.next;
    }, _this.triggerNext = function () {
      if (_this.shouldTriggerNext()) {
        // if (this.props.index === 5) console.log(this.x)
        _this.nextTriggered = true;
        _this.props.onNext({
          id: _this.props.id,
          index: _this.props.index,
          rect: _this.state.rect
        });
      }
    }, _this.shouldFinish = function () {
      switch (_this.props.direction) {
        case 'toRight':
          return _this.x >= _this.state.position.to;
        case 'toLeft':
        default:
          return _this.x <= _this.state.position.to;
      }
    }, _this.animate = function () {
      if (_this.isMoving) return;
      _this.isMoving = true;

      var prevTimestamp = null;

      var step = function step(timestamp) {
        if (!_this.isMoving) return;
        if (!_this.elementRef.current) return;

        var progress = prevTimestamp ? timestamp - prevTimestamp : 0;

        _this.x = _this.props.direction === 'toLeft' ? _this.x - progress / 100 * _this.props.speed : _this.x + progress / 100 * _this.props.speed;
        _this.elementRef.current.style.transform = 'translate3d(' + _this.x + 'px, 0, 0)';
        _this.triggerNext();

        if (_this.shouldFinish()) {
          _this.isMoving = false;
          prevTimestamp = null;
          _this.props.onFinish(_this.props.id);
        } else {
          prevTimestamp = timestamp;
          _this.raf = window.requestAnimationFrame(step);
        }
      };
      _this.raf = window.requestAnimationFrame(step);
    }, _this.render = function () {
      return React.createElement(
        'div',
        {
          className: 'ticker__element',
          style: {
            willChange: 'transform',
            position: 'absolute',
            left: 0,
            top: 0,
            transform: 'translate3d(' + _this.x + 'px, 0, 0)'
          },
          ref: _this.elementRef
        },
        _this.state.children
      );
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  return TickerElement;
}(React.Component);

TickerElement.propTypes = {
  children: propTypes.oneOfType([propTypes.node, propTypes.func]).isRequired,
  direction: propTypes.string.isRequired,
  speed: propTypes.number.isRequired,
  id: propTypes.string.isRequired,
  index: propTypes.number.isRequired,
  mode: propTypes.string.isRequired,
  move: propTypes.bool.isRequired,
  onNext: propTypes.func.isRequired,
  onFinish: propTypes.func.isRequired,
  setRect: propTypes.func.isRequired,
  start: propTypes.bool.isRequired,

  offset: propTypes.oneOfType([propTypes.number, propTypes.string]),
  prevRect: propTypes.object,
  width: propTypes.number
};
TickerElement.defaultProps = {
  offset: undefined,
  width: undefined,
  prevRect: null
};

var getDefaultState = function getDefaultState(offset, width) {
  return {
    elements: [{
      id: guidGenerator(),
      index: 0,
      height: 0,
      start: false,
      offset: offset,
      rect: null,
      prevRect: null
    }],
    width: width,
    height: 0
  };
};

var Ticker = function (_React$Component) {
  inherits(Ticker, _React$Component);

  function Ticker() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, Ticker);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Ticker.__proto__ || Object.getPrototypeOf(Ticker)).call.apply(_ref, [this].concat(args))), _this), _this.next = null, _this.state = getDefaultState(_this.props.offset), _this.tickerRef = React.createRef(), _this.dOnResize = debounce(function () {
      return _this.onResize();
    }, 150), _this.componentDidMount = function () {
      _this.setState({
        width: _this.tickerRef.current.offsetWidth,
        height: _this.props.height
      });
      window.addEventListener('resize', _this.dOnResize);
    }, _this.componentWillUnmount = function () {
      window.removeEventListener('resize', _this.dOnResize);
    }, _this.setRect = function (_ref2) {
      var index = _ref2.index,
          rect = _ref2.rect,
          offset = _ref2.offset,
          nextOffset = _ref2.nextOffset;

      _this.setState(function (prevState) {
        var elements = prevState.elements.map(function (el) {
          var newEl = el;
          if (el.index === index) newEl.rect = rect;
          // next element
          if (el.index === index + 1) {
            newEl.prevRect = rect;
            if (newEl.offset) {
              newEl.offset = nextOffset;
            }
          }
          return newEl;
        });
        return {
          elements: elements,
          height: _this.props.height ? prevState.height : getHighest(elements)
        };
      });
    }, _this.onResize = function () {
      if (!_this.tickerRef.current || _this.tickerRef.current.offsetWidth === _this.state.width) return;
      _this.setState(_extends({}, getDefaultState(_this.props.offset, _this.tickerRef.current.offsetWidth), {
        height: _this.props.height
      }));
    }, _this.onFinish = function (id) {
      _this.props.onFinish();
      _this.setState(function (prevState) {
        return {
          elements: prevState.elements.filter(function (el) {
            return el.id !== id;
          })
        };
      });
    }, _this.onNext = function (_ref3) {
      var id = _ref3.id,
          index = _ref3.index,
          rect = _ref3.rect,
          nextOffset = _ref3.nextOffset;

      _this.props.onNext(index);

      _this.setState(function (prevState) {
        return {
          elements: [].concat(toConsumableArray(prevState.elements.map(function (el) {
            var newEl = el;
            if (el.index === index) newEl.rect = rect;
            if (el.index === 0 || el.offset || newEl.index === index + 1) {
              newEl.start = true;
            }
            return newEl;
            // create new element
          })), [{
            id: guidGenerator(),
            index: prevState.elements[prevState.elements.length - 1].index + 1,
            height: 0,
            start: false,
            offset: nextOffset,
            rect: null,
            prevRect: rect
          }])
        };
      });
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(Ticker, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        'div',
        {
          className: 'ticker',
          ref: this.tickerRef,
          style: {
            position: 'relative',
            overflow: 'hidden',
            height: this.state.height && this.state.height + 'px'
          }
        },
        this.state.width && this.state.elements.map(function (el) {
          return React.createElement(
            TickerElement,
            {
              key: el.id,
              id: el.id,
              index: el.index,
              start: el.start,
              offset: el.offset,
              prevRect: el.prevRect,

              direction: _this2.props.direction,
              mode: _this2.props.mode,
              move: _this2.props.move,
              speed: _this2.props.speed,

              onFinish: _this2.onFinish,
              onNext: _this2.onNext,
              setRect: _this2.setRect,
              width: _this2.state.width
            },
            _this2.props.children
          );
        })
      );
    }
  }]);
  return Ticker;
}(React.Component);

Ticker.propTypes = {
  children: propTypes.oneOfType([propTypes.node, propTypes.func]).isRequired,

  direction: propTypes.string,
  mode: propTypes.string,
  move: propTypes.bool,
  offset: propTypes.oneOfType([propTypes.number, propTypes.string]),
  speed: propTypes.number,
  height: propTypes.oneOfType([propTypes.number, propTypes.string]),
  onNext: propTypes.func,
  onFinish: propTypes.func
};
Ticker.defaultProps = {
  offset: 0,
  speed: 5,
  direction: 'toLeft',
  mode: 'chain',
  move: true,
  height: undefined,
  onNext: function onNext() {},
  onFinish: function onFinish() {}
};

module.exports = Ticker;
//# sourceMappingURL=index.js.map
