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

function createCell(table, row, column, columnId) {
  const getRenderValue = () => cell.getValue() ?? table.options.renderFallbackValue;

  const cell = {
    id: `${row.id}_${column.id}`,
    row,
    column,
    getValue: () => row.getValue(columnId),
    renderValue: getRenderValue,
    getContext: utils.memo(() => [table, column, row, cell], (table, column, row, cell) => ({
      table,
      column,
      row,
      cell: cell,
      getValue: cell.getValue,
      renderValue: cell.renderValue
    }), {
      key: process.env.NODE_ENV === 'development' && 'cell.getContext',
      debug: () => table.options.debugAll
    })
  };

  table._features.forEach(feature => {
    Object.assign(cell, feature.createCell == null ? void 0 : feature.createCell(cell, column, row, table));
  }, {});

  return cell;
}

exports.createCell = createCell;
//# sourceMappingURL=cell.js.map
