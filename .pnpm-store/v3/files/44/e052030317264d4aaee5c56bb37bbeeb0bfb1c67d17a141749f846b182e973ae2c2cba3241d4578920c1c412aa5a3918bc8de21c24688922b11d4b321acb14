import * as Zdog from 'react-zdog';
import { applyProps } from 'react-zdog';
import { Globals } from '@react-spring/core';
export * from '@react-spring/core';
import { createStringInterpolator, colors } from '@react-spring/shared';
import { createHost } from '@react-spring/animated';

const primitives = {
  Anchor: Zdog.Anchor,
  Shape: Zdog.Shape,
  Group: Zdog.Group,
  Rect: Zdog.Rect,
  RoundedRect: Zdog.RoundedRect,
  Ellipse: Zdog.Ellipse,
  Polygon: Zdog.Polygon,
  Hemisphere: Zdog.Hemisphere,
  Cylinder: Zdog.Cylinder,
  Cone: Zdog.Cone,
  Box: Zdog.Box
};

Globals.assign({
  createStringInterpolator,
  colors
});
const host = createHost(primitives, {
  applyAnimatedValues: applyProps
});
const animated = host.animated;

export { animated as a, animated };
