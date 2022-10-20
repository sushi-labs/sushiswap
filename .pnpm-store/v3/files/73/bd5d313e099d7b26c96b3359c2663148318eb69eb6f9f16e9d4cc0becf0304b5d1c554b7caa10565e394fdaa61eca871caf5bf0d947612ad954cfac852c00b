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
var Grouping = require('./Grouping.js');

//
const Ordering = {
  getInitialState: state => {
    return {
      columnOrder: [],
      ...state
    };
  },
  getDefaultOptions: table => {
    return {
      onColumnOrderChange: utils.makeStateUpdater('columnOrder', table)
    };
  },
  createTable: table => {
    return {
      setColumnOrder: updater => table.options.onColumnOrderChange == null ? void 0 : table.options.onColumnOrderChange(updater),
      resetColumnOrder: defaultState => {
        var _table$initialState$c;

        table.setColumnOrder(defaultState ? [] : (_table$initialState$c = table.initialState.columnOrder) != null ? _table$initialState$c : []);
      },
      _getOrderColumnsFn: utils.memo(() => [table.getState().columnOrder, table.getState().grouping, table.options.groupedColumnMode], (columnOrder, grouping, groupedColumnMode) => columns => {
        // Sort grouped columns to the start of the column list
        // before the headers are built
        let orderedColumns = []; // If there is no order, return the normal columns

        if (!(columnOrder != null && columnOrder.length)) {
          orderedColumns = columns;
        } else {
          const columnOrderCopy = [...columnOrder]; // If there is an order, make a copy of the columns

          const columnsCopy = [...columns]; // And make a new ordered array of the columns
          // Loop over the columns and place them in order into the new array

          while (columnsCopy.length && columnOrderCopy.length) {
            const targetColumnId = columnOrderCopy.shift();
            const foundIndex = columnsCopy.findIndex(d => d.id === targetColumnId);

            if (foundIndex > -1) {
              orderedColumns.push(columnsCopy.splice(foundIndex, 1)[0]);
            }
          } // If there are any columns left, add them to the end


          orderedColumns = [...orderedColumns, ...columnsCopy];
        }

        return Grouping.orderColumns(orderedColumns, grouping, groupedColumnMode);
      }, {
        key: process.env.NODE_ENV === 'development' && 'getOrderColumnsFn' // debug: () => table.options.debugAll ?? table.options.debugTable,

      })
    };
  }
};

exports.Ordering = Ordering;
//# sourceMappingURL=Ordering.js.map
