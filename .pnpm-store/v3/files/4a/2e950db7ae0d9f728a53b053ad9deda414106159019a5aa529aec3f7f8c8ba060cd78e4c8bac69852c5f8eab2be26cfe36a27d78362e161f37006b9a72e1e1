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
var filterRowsUtils = require('./filterRowsUtils.js');

function getFacetedRowModel() {
  return (table, columnId) => utils.memo(() => [table.getPreFilteredRowModel(), table.getState().columnFilters, table.getState().globalFilter, table.getFilteredRowModel()], (preRowModel, columnFilters, globalFilter) => {
    if (!preRowModel.rows.length || !(columnFilters != null && columnFilters.length) && !globalFilter) {
      return preRowModel;
    }

    const filterableIds = [...columnFilters.map(d => d.id).filter(d => d !== columnId), globalFilter ? '__global__' : undefined].filter(Boolean);

    const filterRowsImpl = row => {
      // Horizontally filter rows through each column
      for (let i = 0; i < filterableIds.length; i++) {
        if (row.columnFilters[filterableIds[i]] === false) {
          return false;
        }
      }

      return true;
    };

    return filterRowsUtils.filterRows(preRowModel.rows, filterRowsImpl, table);
  }, {
    key: process.env.NODE_ENV === 'development' && 'getFacetedRowModel_' + columnId,
    debug: () => {
      var _table$options$debugA;

      return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugTable;
    },
    onChange: () => {}
  });
}

exports.getFacetedRowModel = getFacetedRowModel;
//# sourceMappingURL=getFacetedRowModel.js.map
