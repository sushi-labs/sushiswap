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

function filterRows(rows, filterRowImpl, table) {
  if (table.options.filterFromLeafRows) {
    return filterRowModelFromLeafs(rows, filterRowImpl, table);
  }

  return filterRowModelFromRoot(rows, filterRowImpl, table);
}
function filterRowModelFromLeafs(rowsToFilter, filterRow, table) {
  const newFilteredFlatRows = [];
  const newFilteredRowsById = {};

  const recurseFilterRows = function (rowsToFilter, depth) {

    const rows = []; // Filter from children up first

    for (let i = 0; i < rowsToFilter.length; i++) {
      var _row$subRows;

      let row$1 = rowsToFilter[i];

      if ((_row$subRows = row$1.subRows) != null && _row$subRows.length) {
        const newRow = row.createRow(table, row$1.id, row$1.original, row$1.index, row$1.depth);
        newRow.columnFilters = row$1.columnFilters;
        newRow.subRows = recurseFilterRows(row$1.subRows);

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
function filterRowModelFromRoot(rowsToFilter, filterRow, table) {
  const newFilteredFlatRows = [];
  const newFilteredRowsById = {}; // Filters top level and nested rows

  const recurseFilterRows = function (rowsToFilter, depth) {

    // Filter from parents downward first
    const rows = []; // Apply the filter to any subRows

    for (let i = 0; i < rowsToFilter.length; i++) {
      let row$1 = rowsToFilter[i];
      const pass = filterRow(row$1);

      if (pass) {
        var _row$subRows2;

        if ((_row$subRows2 = row$1.subRows) != null && _row$subRows2.length) {
          const newRow = row.createRow(table, row$1.id, row$1.original, row$1.index, row$1.depth);
          newRow.subRows = recurseFilterRows(row$1.subRows);
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
