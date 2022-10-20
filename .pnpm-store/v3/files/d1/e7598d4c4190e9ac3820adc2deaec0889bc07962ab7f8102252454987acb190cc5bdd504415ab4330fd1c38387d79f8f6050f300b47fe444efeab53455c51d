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
var getExpandedRowModel = require('./getExpandedRowModel.js');

function getPaginationRowModel(opts) {
  return table => utils.memo(() => [table.getState().pagination, table.getPrePaginationRowModel()], (pagination, rowModel) => {
    if (!rowModel.rows.length) {
      return rowModel;
    }

    const {
      pageSize,
      pageIndex
    } = pagination;
    let {
      rows,
      flatRows,
      rowsById
    } = rowModel;
    const pageStart = pageSize * pageIndex;
    const pageEnd = pageStart + pageSize;
    rows = rows.slice(pageStart, pageEnd);
    let paginatedRowModel;

    if (!table.options.paginateExpandedRows) {
      paginatedRowModel = getExpandedRowModel.expandRows({
        rows,
        flatRows,
        rowsById
      });
    } else {
      paginatedRowModel = {
        rows,
        flatRows,
        rowsById
      };
    }

    paginatedRowModel.flatRows = [];

    const handleRow = row => {
      paginatedRowModel.flatRows.push(row);

      if (row.subRows.length) {
        row.subRows.forEach(handleRow);
      }
    };

    paginatedRowModel.rows.forEach(handleRow);
    return paginatedRowModel;
  }, {
    key: process.env.NODE_ENV === 'development' && 'getPaginationRowModel',
    debug: () => {
      var _table$options$debugA;

      return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugTable;
    }
  });
}

exports.getPaginationRowModel = getPaginationRowModel;
//# sourceMappingURL=getPaginationRowModel.js.map
