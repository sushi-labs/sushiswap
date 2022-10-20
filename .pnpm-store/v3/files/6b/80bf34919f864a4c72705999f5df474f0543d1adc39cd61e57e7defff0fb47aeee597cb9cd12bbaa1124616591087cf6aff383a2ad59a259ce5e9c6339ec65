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

function getFacetedUniqueValues() {
  return (table, columnId) => utils.memo(() => [table.getColumn(columnId).getFacetedRowModel()], facetedRowModel => {
    let facetedUniqueValues = new Map();

    for (let i = 0; i < facetedRowModel.flatRows.length; i++) {
      var _facetedRowModel$flat;

      const value = (_facetedRowModel$flat = facetedRowModel.flatRows[i]) == null ? void 0 : _facetedRowModel$flat.getValue(columnId);

      if (facetedUniqueValues.has(value)) {
        var _facetedUniqueValues$;

        facetedUniqueValues.set(value, ((_facetedUniqueValues$ = facetedUniqueValues.get(value)) != null ? _facetedUniqueValues$ : 0) + 1);
      } else {
        facetedUniqueValues.set(value, 1);
      }
    }

    return facetedUniqueValues;
  }, {
    key: process.env.NODE_ENV === 'development' && 'getFacetedUniqueValues_' + columnId,
    debug: () => {
      var _table$options$debugA;

      return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugTable;
    },
    onChange: () => {}
  });
}

exports.getFacetedUniqueValues = getFacetedUniqueValues;
//# sourceMappingURL=getFacetedUniqueValues.js.map
