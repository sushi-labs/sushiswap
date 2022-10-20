import { Globals, createStringInterpolator, colors } from '@react-spring/shared';
import { createHost } from '@react-spring/animated';
export * from '@react-spring/core';

const primitives = ['Arc', 'Arrow', 'Circle', 'Ellipse', 'FastLayer', 'Group', 'Image', 'Label', 'Layer', 'Line', 'Path', 'Rect', 'RegularPolygon', 'Ring', 'Shape', 'Sprite', 'Star', 'Tag', 'Text', 'TextPath', 'Transformer', 'Wedge'];

Globals.assign({
  createStringInterpolator,
  colors
});
const host = createHost(primitives, {
  applyAnimatedValues(instance, props) {
    if (!instance.nodeType) return false;

    instance._applyProps(instance, props);
  }

});
const animated = host.animated;

export { animated as a, animated };
