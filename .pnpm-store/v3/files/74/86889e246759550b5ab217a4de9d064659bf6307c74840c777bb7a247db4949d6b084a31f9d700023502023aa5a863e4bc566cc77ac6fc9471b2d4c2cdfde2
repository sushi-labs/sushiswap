import { View, Text, Image, StyleSheet } from 'react-native';
import { AnimatedObject, createHost } from '@react-spring/animated';
import { eachProp, getFluidValue, each, Globals, createStringInterpolator, colors, is } from '@react-spring/shared';
export * from '@react-spring/core';

const primitives = {
  View: View,
  Text: Text,
  Image: Image
};

function _extends() {
  _extends = Object.assign || function (target) {
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

  return _extends.apply(this, arguments);
}

class AnimatedTransform extends AnimatedObject {
  constructor(source) {
    super(source);
  }

  getValue() {
    return this.source ? this.source.map(source => {
      const transform = {};
      eachProp(source, (source, key) => {
        transform[key] = getFluidValue(source);
      });
      return transform;
    }) : [];
  }

  setValue(source) {
    this.source = source;
    this.payload = this._makePayload(source);
  }

  _makePayload(source) {
    if (!source) return [];
    const payload = new Set();
    each(source, transform => eachProp(transform, this._addToPayload, payload));
    return Array.from(payload);
  }

}

class AnimatedStyle extends AnimatedObject {
  constructor(style) {
    super(style);
  }

  setValue(style) {
    super.setValue(style && style.transform ? _extends({}, style, {
      transform: new AnimatedTransform(style.transform)
    }) : style);
  }

}

Globals.assign({
  batchedUpdates: require('react-native').unstable_batchedUpdates,
  createStringInterpolator,
  colors
});
const host = createHost(primitives, {
  applyAnimatedValues(instance, props) {
    if (is.und(props.children) && instance.setNativeProps) {
      instance.setNativeProps(props);
      return true;
    }

    return false;
  },

  createAnimatedStyle(styles) {
    styles = StyleSheet.flatten(styles);

    if (is.obj(styles.shadowOffset)) {
      styles.shadowOffset = new AnimatedObject(styles.shadowOffset);
    }

    return new AnimatedStyle(styles);
  }

});
const animated = host.animated;

export { animated as a, animated };
