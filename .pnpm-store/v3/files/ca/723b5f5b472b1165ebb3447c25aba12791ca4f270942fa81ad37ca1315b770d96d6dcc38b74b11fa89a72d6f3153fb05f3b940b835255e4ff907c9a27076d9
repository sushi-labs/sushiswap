'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Zdog = require('react-zdog');
var core = require('@react-spring/core');
var shared = require('@react-spring/shared');
var animated$1 = require('@react-spring/animated');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var Zdog__namespace = /*#__PURE__*/_interopNamespace(Zdog);

const primitives = {
  Anchor: Zdog__namespace.Anchor,
  Shape: Zdog__namespace.Shape,
  Group: Zdog__namespace.Group,
  Rect: Zdog__namespace.Rect,
  RoundedRect: Zdog__namespace.RoundedRect,
  Ellipse: Zdog__namespace.Ellipse,
  Polygon: Zdog__namespace.Polygon,
  Hemisphere: Zdog__namespace.Hemisphere,
  Cylinder: Zdog__namespace.Cylinder,
  Cone: Zdog__namespace.Cone,
  Box: Zdog__namespace.Box
};

core.Globals.assign({
  createStringInterpolator: shared.createStringInterpolator,
  colors: shared.colors
});
const host = animated$1.createHost(primitives, {
  applyAnimatedValues: Zdog.applyProps
});
const animated = host.animated;

exports.a = animated;
exports.animated = animated;
Object.keys(core).forEach(function (k) {
  if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () {
      return core[k];
    }
  });
});
