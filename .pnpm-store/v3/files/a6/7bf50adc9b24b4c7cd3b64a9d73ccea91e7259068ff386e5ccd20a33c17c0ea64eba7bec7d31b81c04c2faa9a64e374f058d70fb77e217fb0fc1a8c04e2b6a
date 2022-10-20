"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Popup;

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

function Popup(props) {
  var showArrow = props.showArrow,
      arrowContent = props.arrowContent,
      children = props.children,
      prefixCls = props.prefixCls,
      id = props.id,
      overlayInnerStyle = props.overlayInnerStyle,
      className = props.className,
      style = props.style;
  return /*#__PURE__*/React.createElement("div", {
    className: (0, _classnames.default)("".concat(prefixCls, "-content"), className),
    style: style
  }, showArrow !== false && /*#__PURE__*/React.createElement("div", {
    className: "".concat(prefixCls, "-arrow"),
    key: "arrow"
  }, arrowContent), /*#__PURE__*/React.createElement("div", {
    className: "".concat(prefixCls, "-inner"),
    id: id,
    role: "tooltip",
    style: overlayInnerStyle
  }, typeof children === 'function' ? children() : children));
}