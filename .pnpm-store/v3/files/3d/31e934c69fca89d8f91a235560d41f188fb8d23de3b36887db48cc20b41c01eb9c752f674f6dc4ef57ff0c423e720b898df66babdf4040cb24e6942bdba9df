import * as React from 'react';
import classNames from 'classnames';
export default function Popup(props) {
  var showArrow = props.showArrow,
      arrowContent = props.arrowContent,
      children = props.children,
      prefixCls = props.prefixCls,
      id = props.id,
      overlayInnerStyle = props.overlayInnerStyle,
      className = props.className,
      style = props.style;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames("".concat(prefixCls, "-content"), className),
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