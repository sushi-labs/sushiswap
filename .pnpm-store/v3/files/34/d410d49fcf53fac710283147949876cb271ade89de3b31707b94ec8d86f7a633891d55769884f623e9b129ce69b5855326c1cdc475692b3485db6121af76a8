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

var row = require('../core/row.js');

function filterRows(rows, filterRowImpl, instance) {
  if (instance.options.filterFromLeafRows) {
    return filterRowModelFromLeafs(rows, filterRowImpl, instance);
  }

  return filterRowModelFromRoot(rows, filterRowImpl, instance);
}
function filterRowModelFromLeafs(rowsToFilter, filterRow, instance) {
  const newFilteredFlatRows = [];
  const newFilteredRowsById = {};
  let row$1;
  let newRow;

  const recurseFilterRows = function (rowsToFilter, depth) {
    if (depth === void 0) {
      depth = 0;
    }

    const rows = []; // Filter from children up first

    for (let i = 0; i < rowsToFilter.length; i++) {
      var _row$subRows;

      row$1 = rowsToFilter[i];

      if ((_row$subRows = row$1.subRows) != null && _row$subRows.length) {
        newRow = row.createRow(instance, row$1.id, row$1.original, row$1.index, row$1.depth);
        newRow.columnFilters = row$1.columnFilters;
        newRow.subRows = recurseFilterRows(row$1.subRows, depth + 1);

        if (!newRow.subRows.length) {
          continue;
        }

        row$1 = newRow;
      }

      if (filterRow(row$1)) {
        rows.push(row$1);
        newFilteredRowsById[row$1.id] = row$1;
        newFilteredRowsById[i] = row$1;
      }
    }

    return rows;
  };

  return {
    rows: recurseFilterRows(rowsToFilter),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById
  };
}
function filterRowModelFromRoot(rowsToFilter, filterRow, instance) {
  const newFilteredFlatRows = [];
  const newFilteredRowsById = {};
  let rows;
  let row$1;
  let newRow; // Filters top level and nested rows

  const recurseFilterRows = function (rowsToFilter, depth) {
    if (depth === void 0) {
      depth = 0;
    }

    // Filter from parents downward first
    rows = []; // Apply the filter to any subRows

    for (let i = 0; i < rowsToFilter.length; i++) {
      row$1 = rowsToFilter[i];
      const pass = filterRow(row$1);

      if (pass) {
        var _row$subRows2;

        if ((_row$subRows2 = row$1.subRows) != null && _row$subRows2.length) {
          newRow = row.createRow(instance, row$1.id, row$1.original, row$1.index, row$1.depth);
          newRow.subRows = recurseFilterRows(row$1.subRows, depth + 1);
          row$1 = newRow;
        }

        rows.push(row$1);
        newFilteredFlatRows.push(row$1);
        newFilteredRowsById[row$1.id] = row$1;
      }
    }

    return rows;
  };

  return {
    rows: recurseFilterRows(rowsToFilter),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById
  };
}

exports.filterRowModelFromLeafs = filterRowModelFromLeafs;
exports.filterRowModelFromRoot = filterRowModelFromRoot;
exports.filterRows = filterRows;
//# sourceMappingURL=filterRowsUtils.js.map
