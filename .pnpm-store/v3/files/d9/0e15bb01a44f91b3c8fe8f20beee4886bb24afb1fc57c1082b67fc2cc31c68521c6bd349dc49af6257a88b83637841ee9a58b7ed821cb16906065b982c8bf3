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

//
const Visibility = {
  getInitialState: state => {
    return {
      columnVisibility: {},
      ...state
    };
  },
  getDefaultOptions: table => {
    return {
      onColumnVisibilityChange: utils.makeStateUpdater('columnVisibility', table)
    };
  },
  createColumn: (column, table) => {
    return {
      toggleVisibility: value => {
        if (column.getCanHide()) {
          table.setColumnVisibility(old => ({ ...old,
            [column.id]: value ?? !column.getIsVisible()
          }));
        }
      },
      getIsVisible: () => {
        var _table$getState$colum;

        return ((_table$getState$colum = table.getState().columnVisibility) == null ? void 0 : _table$getState$colum[column.id]) ?? true;
      },
      getCanHide: () => {
        return (column.columnDef.enableHiding ?? true) && (table.options.enableHiding ?? true);
      },
      getToggleVisibilityHandler: () => {
        return e => {
          column.toggleVisibility == null ? void 0 : column.toggleVisibility(e.target.checked);
        };
      }
    };
  },
  createRow: (row, table) => {
    return {
      _getAllVisibleCells: utils.memo(() => [row.getAllCells(), table.getState().columnVisibility], cells => {
        return cells.filter(cell => cell.column.getIsVisible());
      }, {
        key: process.env.NODE_ENV === 'production' && 'row._getAllVisibleCells',
        debug: () => table.options.debugAll ?? table.options.debugRows
      }),
      getVisibleCells: utils.memo(() => [row.getLeftVisibleCells(), row.getCenterVisibleCells(), row.getRightVisibleCells()], (left, center, right) => [...left, ...center, ...right], {
        key: process.env.NODE_ENV === 'development' && 'row.getVisibleCells',
        debug: () => table.options.debugAll ?? table.options.debugRows
      })
    };
  },
  createTable: table => {
    const makeVisibleColumnsMethod = (key, getColumns) => {
      return utils.memo(() => [getColumns(), getColumns().filter(d => d.getIsVisible()).map(d => d.id).join('_')], columns => {
        return columns.filter(d => d.getIsVisible == null ? void 0 : d.getIsVisible());
      }, {
        key,
        debug: () => table.options.debugAll ?? table.options.debugColumns
      });
    };

    return {
      getVisibleFlatColumns: makeVisibleColumnsMethod('getVisibleFlatColumns', () => table.getAllFlatColumns()),
      getVisibleLeafColumns: makeVisibleColumnsMethod('getVisibleLeafColumns', () => table.getAllLeafColumns()),
      getLeftVisibleLeafColumns: makeVisibleColumnsMethod('getLeftVisibleLeafColumns', () => table.getLeftLeafColumns()),
      getRightVisibleLeafColumns: makeVisibleColumnsMethod('getRightVisibleLeafColumns', () => table.getRightLeafColumns()),
      getCenterVisibleLeafColumns: makeVisibleColumnsMethod('getCenterVisibleLeafColumns', () => table.getCenterLeafColumns()),
      setColumnVisibility: updater => table.options.onColumnVisibilityChange == null ? void 0 : table.options.onColumnVisibilityChange(updater),
      resetColumnVisibility: defaultState => {
        table.setColumnVisibility(defaultState ? {} : table.initialState.columnVisibility ?? {});
      },
      toggleAllColumnsVisible: value => {
        value = value ?? !table.getIsAllColumnsVisible();
        table.setColumnVisibility(table.getAllLeafColumns().reduce((obj, column) => ({ ...obj,
          [column.id]: !value ? !(column.getCanHide != null && column.getCanHide()) : value
        }), {}));
      },
      getIsAllColumnsVisible: () => !table.getAllLeafColumns().some(column => !(column.getIsVisible != null && column.getIsVisible())),
      getIsSomeColumnsVisible: () => table.getAllLeafColumns().some(column => column.getIsVisible == null ? void 0 : column.getIsVisible()),
      getToggleAllColumnsVisibilityHandler: () => {
        return e => {
          var _target;

          table.toggleAllColumnsVisible((_target = e.target) == null ? void 0 : _target.checked);
        };
      }
    };
  }
};

exports.Visibility = Visibility;
//# sourceMappingURL=Visibility.js.map
