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

var utils = require('../utils.js');

function getFacetedMinMaxValues() {
  return (table, columnId) => utils.memo(() => [table.getColumn(columnId).getFacetedRowModel()], facetedRowModel => {
    var _facetedRowModel$flat;

    const firstValue = (_facetedRowModel$flat = facetedRowModel.flatRows[0]) == null ? void 0 : _facetedRowModel$flat.getValue(columnId);

    if (typeof firstValue === 'undefined') {
      return undefined;
    }

    let facetedMinMaxValues = [firstValue, firstValue];

    for (let i = 0; i < facetedRowModel.flatRows.length; i++) {
      const value = facetedRowModel.flatRows[i].getValue(columnId);

      if (value < facetedMinMaxValues[0]) {
        facetedMinMaxValues[0] = value;
      } else if (value > facetedMinMaxValues[1]) {
        facetedMinMaxValues[1] = value;
      }
    }

    return facetedMinMaxValues;
  }, {
    key: process.env.NODE_ENV === 'development' && 'getFacetedMinMaxValues_' + columnId,
    debug: () => table.options.debugAll ?? table.options.debugTable,
    onChange: () => {}
  });
}

exports.getFacetedMinMaxValues = getFacetedMinMaxValues;
//# sourceMappingURL=getFacetedMinMaxValues.js.map
