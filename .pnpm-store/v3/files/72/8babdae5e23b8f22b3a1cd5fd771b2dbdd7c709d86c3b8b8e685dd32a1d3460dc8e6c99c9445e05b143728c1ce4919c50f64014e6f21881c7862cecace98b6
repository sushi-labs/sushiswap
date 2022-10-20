'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var reactNative = require('react-native');
var animated$1 = require('@react-spring/animated');
var shared = require('@react-spring/shared');
var core = require('@react-spring/core');

const primitives = {
  View: reactNative.View,
  Text: reactNative.Text,
  Image: reactNative.Image
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

class AnimatedTransform extends animated$1.AnimatedObject {
  constructor(source) {
    super(source);
  }

  getValue() {
    return this.source ? this.source.map(source => {
      const transform = {};
      shared.eachProp(source, (source, key) => {
        transform[key] = shared.getFluidValue(source);
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
    shared.each(source, transform => shared.eachProp(transform, this._addToPayload, payload));
    return Array.from(payload);
  }

}

class AnimatedStyle extends animated$1.AnimatedObject {
  constructor(style) {
    super(style);
  }

  setValue(style) {
    super.setValue(style && style.transform ? _extends({}, style, {
      transform: new AnimatedTransform(style.transform)
    }) : style);
  }

}

shared.Globals.assign({
  batchedUpdates: require('react-native').unstable_batchedUpdates,
  createStringInterpolator: shared.createStringInterpolator,
  colors: shared.colors
});
const host = animated$1.createHost(primitives, {
  applyAnimatedValues(instance, props) {
    if (shared.is.und(props.children) && instance.setNativeProps) {
      instance.setNativeProps(props);
      return true;
    }

    return false;
  },

  createAnimatedStyle(styles) {
    styles = reactNative.StyleSheet.flatten(styles);

    if (shared.is.obj(styles.shadowOffset)) {
      styles.shadowOffset = new animated$1.AnimatedObject(styles.shadowOffset);
    }

    return new AnimatedStyle(styles);
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
