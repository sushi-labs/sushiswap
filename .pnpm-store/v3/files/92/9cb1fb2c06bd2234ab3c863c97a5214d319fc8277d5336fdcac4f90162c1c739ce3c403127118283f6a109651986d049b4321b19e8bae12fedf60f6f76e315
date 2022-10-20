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
var cell = require('./cell.js');

const createRow = (table, id, original, rowIndex, depth, subRows) => {
  let row = {
    id,
    index: rowIndex,
    original,
    depth,
    _valuesCache: {},
    getValue: columnId => {
      if (row._valuesCache.hasOwnProperty(columnId)) {
        return row._valuesCache[columnId];
      }

      const column = table.getColumn(columnId);

      if (!column.accessorFn) {
        return undefined;
      }

      row._valuesCache[columnId] = column.accessorFn(row.original, rowIndex);
      return row._valuesCache[columnId];
    },
    renderValue: columnId => {
      var _row$getValue;

      return (_row$getValue = row.getValue(columnId)) != null ? _row$getValue : table.options.renderFallbackValue;
    },
    subRows: subRows != null ? subRows : [],
    getLeafRows: () => utils.flattenBy(row.subRows, d => d.subRows),
    getAllCells: utils.memo(() => [table.getAllLeafColumns()], leafColumns => {
      return leafColumns.map(column => {
        return cell.createCell(table, row, column, column.id);
      });
    }, {
      key: process.env.NODE_ENV === 'development' && 'row.getAllCells',
      debug: () => {
        var _table$options$debugA;

        return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugRows;
      }
    }),
    _getAllCellsByColumnId: utils.memo(() => [row.getAllCells()], allCells => {
      return allCells.reduce((acc, cell) => {
        acc[cell.column.id] = cell;
        return acc;
      }, {});
    }, {
      key: process.env.NODE_ENV === 'production' && 'row.getAllCellsByColumnId',
      debug: () => {
        var _table$options$debugA2;

        return (_table$options$debugA2 = table.options.debugAll) != null ? _table$options$debugA2 : table.options.debugRows;
      }
    })
  };

  for (let i = 0; i < table._features.length; i++) {
    const feature = table._features[i];
    Object.assign(row, feature == null ? void 0 : feature.createRow == null ? void 0 : feature.createRow(row, table));
  }

  return row;
};

exports.createRow = createRow;
//# sourceMappingURL=row.js.map
