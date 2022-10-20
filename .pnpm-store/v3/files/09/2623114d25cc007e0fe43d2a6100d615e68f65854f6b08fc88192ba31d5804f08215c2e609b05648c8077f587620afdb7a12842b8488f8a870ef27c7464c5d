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
  return instance => utils.memo(() => [instance.getState().pagination, instance.getPrePaginationRowModel()], (pagination, rowModel) => {
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

    if (!instance.options.paginateExpandedRows) {
      return getExpandedRowModel.expandRows({
        rows,
        flatRows,
        rowsById
      });
    }

    return {
      rows,
      flatRows,
      rowsById
    };
  }, {
    key: process.env.NODE_ENV === 'development' && 'getPaginationRowModel',
    debug: () => {
      var _instance$options$deb;

      return (_instance$options$deb = instance.options.debugAll) != null ? _instance$options$deb : instance.options.debugTable;
    }
  });
}

exports.getPaginationRowModel = getPaginationRowModel;
//# sourceMappingURL=getPaginationRowModel.js.map
