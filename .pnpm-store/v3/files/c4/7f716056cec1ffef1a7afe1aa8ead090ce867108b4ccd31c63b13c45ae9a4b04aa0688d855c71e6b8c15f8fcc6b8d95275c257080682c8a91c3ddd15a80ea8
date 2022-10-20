/**
 * table-core
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const includesString = (row, columnId, filterValue) => {
  const search = filterValue.toLowerCase();
  return row.getValue(columnId).toLowerCase().includes(search);
};

includesString.autoRemove = val => testFalsey(val);

const includesStringSensitive = (row, columnId, filterValue) => {
  return row.getValue(columnId).includes(filterValue);
};

includesStringSensitive.autoRemove = val => testFalsey(val);

const equalsString = (row, columnId, filterValue) => {
  return row.getValue(columnId).toLowerCase() === filterValue.toLowerCase();
};

equalsString.autoRemove = val => testFalsey(val);

const arrIncludes = (row, columnId, filterValue) => {
  return row.getValue(columnId).includes(filterValue);
};

arrIncludes.autoRemove = val => testFalsey(val) || !(val != null && val.length);

const arrIncludesAll = (row, columnId, filterValue) => {
  return !filterValue.some(val => !row.getValue(columnId).includes(val));
};

arrIncludesAll.autoRemove = val => testFalsey(val) || !(val != null && val.length);

const arrIncludesSome = (row, columnId, filterValue) => {
  return filterValue.some(val => row.getValue(columnId).includes(val));
};

arrIncludesSome.autoRemove = val => testFalsey(val) || !(val != null && val.length);

const equals = (row, columnId, filterValue) => {
  return row.getValue(columnId) === filterValue;
};

equals.autoRemove = val => testFalsey(val);

const weakEquals = (row, columnId, filterValue) => {
  return row.getValue(columnId) == filterValue;
};

weakEquals.autoRemove = val => testFalsey(val);

const inNumberRange = (row, columnId, filterValue) => {
  let [min, max] = filterValue;
  const rowValue = row.getValue(columnId);
  return rowValue >= min && rowValue <= max;
};

inNumberRange.resolveFilterValue = val => {
  let [unsafeMin, unsafeMax] = val;
  let parsedMin = typeof unsafeMin !== 'number' ? parseFloat(unsafeMin) : unsafeMin;
  let parsedMax = typeof unsafeMax !== 'number' ? parseFloat(unsafeMax) : unsafeMax;
  let min = unsafeMin === null || Number.isNaN(parsedMin) ? -Infinity : parsedMin;
  let max = unsafeMax === null || Number.isNaN(parsedMax) ? Infinity : parsedMax;

  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }

  return [min, max];
};

inNumberRange.autoRemove = val => testFalsey(val) || testFalsey(val[0]) && testFalsey(val[1]); // Export


const filterFns = {
  includesString,
  includesStringSensitive,
  equalsString,
  arrIncludes,
  arrIncludesAll,
  arrIncludesSome,
  equals,
  weakEquals,
  inNumberRange
};

// Utils
function testFalsey(val) {
  return val === undefined || val === null || val === '';
}

exports.filterFns = filterFns;
//# sourceMappingURL=filterFns.js.map
