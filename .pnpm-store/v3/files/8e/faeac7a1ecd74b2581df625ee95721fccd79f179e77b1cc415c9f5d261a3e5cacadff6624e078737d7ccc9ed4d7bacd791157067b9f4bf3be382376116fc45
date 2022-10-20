'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var shared = require('@react-spring/shared');
var animated$1 = require('@react-spring/animated');
var core = require('@react-spring/core');

const primitives = ['Arc', 'Arrow', 'Circle', 'Ellipse', 'FastLayer', 'Group', 'Image', 'Label', 'Layer', 'Line', 'Path', 'Rect', 'RegularPolygon', 'Ring', 'Shape', 'Sprite', 'Star', 'Tag', 'Text', 'TextPath', 'Transformer', 'Wedge'];

shared.Globals.assign({
  createStringInterpolator: shared.createStringInterpolator,
  colors: shared.colors
});
const host = animated$1.createHost(primitives, {
  applyAnimatedValues(instance, props) {
    if (!instance.nodeType) return false;

    instance._applyProps(instance, props);
  }

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
