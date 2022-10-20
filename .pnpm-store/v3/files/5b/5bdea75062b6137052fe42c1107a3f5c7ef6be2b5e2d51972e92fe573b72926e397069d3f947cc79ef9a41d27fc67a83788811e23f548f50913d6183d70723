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

const createRow = (instance, id, original, rowIndex, depth, subRows) => {
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

      const column = instance.getColumn(columnId);

      if (!column.accessorFn) {
        return undefined;
      }

      row._valuesCache[columnId] = column.accessorFn(row.original, rowIndex);
      return row._valuesCache[columnId];
    },
    subRows: subRows != null ? subRows : [],
    getLeafRows: () => utils.flattenBy(row.subRows, d => d.subRows),
    getAllCells: utils.memo(() => [instance.getAllLeafColumns()], leafColumns => {
      return leafColumns.map(column => {
        return cell.createCell(instance, row, column, column.id);
      });
    }, {
      key: process.env.NODE_ENV === 'development' && 'row.getAllCells',
      debug: () => {
        var _instance$options$deb;

        return (_instance$options$deb = instance.options.debugAll) != null ? _instance$options$deb : instance.options.debugRows;
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
        var _instance$options$deb2;

        return (_instance$options$deb2 = instance.options.debugAll) != null ? _instance$options$deb2 : instance.options.debugRows;
      }
    })
  };

  for (let i = 0; i < instance._features.length; i++) {
    const feature = instance._features[i];
    Object.assign(row, feature == null ? void 0 : feature.createRow == null ? void 0 : feature.createRow(row, instance));
  }

  return row;
};

exports.createRow = createRow;
//# sourceMappingURL=row.js.map
