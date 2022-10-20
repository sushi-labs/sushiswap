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

function getExpandedRowModel() {
  return table => utils.memo(() => [table.getState().expanded, table.getPreExpandedRowModel(), table.options.paginateExpandedRows], (expanded, rowModel, paginateExpandedRows) => {
    if (!rowModel.rows.length || // Do not expand if rows are not included in pagination
    !paginateExpandedRows || expanded !== true && !Object.keys(expanded != null ? expanded : {}).length) {
      return rowModel;
    }

    return expandRows(rowModel);
  }, {
    key: process.env.NODE_ENV === 'development' && 'getExpandedRowModel',
    debug: () => {
      var _table$options$debugA;

      return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugTable;
    }
  });
}
function expandRows(rowModel, table) {
  const expandedRows = [];

  const handleRow = row => {
    var _row$subRows;

    expandedRows.push(row);

    if ((_row$subRows = row.subRows) != null && _row$subRows.length && row.getIsExpanded()) {
      row.subRows.forEach(handleRow);
    }
  };

  rowModel.rows.forEach(handleRow);
  return {
    rows: expandedRows,
    flatRows: rowModel.flatRows,
    rowsById: rowModel.rowsById
  };
}

exports.expandRows = expandRows;
exports.getExpandedRowModel = getExpandedRowModel;
//# sourceMappingURL=getExpandedRowModel.js.map
