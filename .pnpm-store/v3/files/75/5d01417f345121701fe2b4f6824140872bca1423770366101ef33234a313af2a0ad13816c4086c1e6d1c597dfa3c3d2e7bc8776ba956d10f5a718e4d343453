"use strict";

exports.__esModule = true;
exports.default = useSamplesAlongPath;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function getSamples(restrictToPath, transform, precision) {
  if (precision === void 0) {
    precision = 1;
  }

  if (!restrictToPath) return [];
  var samples = [];
  var pathLength = restrictToPath.getTotalLength();

  for (var sampleLength = 0; sampleLength <= pathLength; sampleLength += precision) {
    var sample = restrictToPath.getPointAtLength(sampleLength);
    var transformedSample = sample.matrixTransform(transform);
    samples.push(transformedSample);
  }

  return samples;
}
/** Return samples along a path, relative to the parent SVG  */


function useSamplesAlongPath(restrictToPath) {
  var samples = (0, _react.useMemo)(function () {
    if (!restrictToPath) return [];
    var transform = restrictToPath.getCTM() || new DOMMatrix();
    return getSamples(restrictToPath, transform); // The path can transform without triggering a re-render,
    // so we need to update the samples whenever the length changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restrictToPath == null ? void 0 : restrictToPath.getTotalLength()]);
  return samples;
}