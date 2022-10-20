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
const getDefaultPinningState = () => ({
  left: [],
  right: []
});

const Pinning = {
  getInitialState: state => {
    return {
      columnPinning: getDefaultPinningState(),
      ...state
    };
  },
  getDefaultOptions: table => {
    return {
      onColumnPinningChange: utils.makeStateUpdater('columnPinning', table)
    };
  },
  createColumn: (column, table) => {
    return {
      pin: position => {
        const columnIds = column.getLeafColumns().map(d => d.id).filter(Boolean);
        table.setColumnPinning(old => {
          var _old$left3, _old$right3;

          if (position === 'right') {
            var _old$left, _old$right;

            return {
              left: ((_old$left = old == null ? void 0 : old.left) != null ? _old$left : []).filter(d => !(columnIds != null && columnIds.includes(d))),
              right: [...((_old$right = old == null ? void 0 : old.right) != null ? _old$right : []).filter(d => !(columnIds != null && columnIds.includes(d))), ...columnIds]
            };
          }

          if (position === 'left') {
            var _old$left2, _old$right2;

            return {
              left: [...((_old$left2 = old == null ? void 0 : old.left) != null ? _old$left2 : []).filter(d => !(columnIds != null && columnIds.includes(d))), ...columnIds],
              right: ((_old$right2 = old == null ? void 0 : old.right) != null ? _old$right2 : []).filter(d => !(columnIds != null && columnIds.includes(d)))
            };
          }

          return {
            left: ((_old$left3 = old == null ? void 0 : old.left) != null ? _old$left3 : []).filter(d => !(columnIds != null && columnIds.includes(d))),
            right: ((_old$right3 = old == null ? void 0 : old.right) != null ? _old$right3 : []).filter(d => !(columnIds != null && columnIds.includes(d)))
          };
        });
      },
      getCanPin: () => {
        const leafColumns = column.getLeafColumns();
        return leafColumns.some(d => {
          var _d$columnDef$enablePi, _table$options$enable;

          return ((_d$columnDef$enablePi = d.columnDef.enablePinning) != null ? _d$columnDef$enablePi : true) && ((_table$options$enable = table.options.enablePinning) != null ? _table$options$enable : true);
        });
      },
      getIsPinned: () => {
        const leafColumnIds = column.getLeafColumns().map(d => d.id);
        const {
          left,
          right
        } = table.getState().columnPinning;
        const isLeft = leafColumnIds.some(d => left == null ? void 0 : left.includes(d));
        const isRight = leafColumnIds.some(d => right == null ? void 0 : right.includes(d));
        return isLeft ? 'left' : isRight ? 'right' : false;
      },
      getPinnedIndex: () => {
        var _table$getState$colum, _table$getState$colum2, _table$getState$colum3;

        const position = column.getIsPinned();
        return position ? (_table$getState$colum = (_table$getState$colum2 = table.getState().columnPinning) == null ? void 0 : (_table$getState$colum3 = _table$getState$colum2[position]) == null ? void 0 : _table$getState$colum3.indexOf(column.id)) != null ? _table$getState$colum : -1 : 0;
      }
    };
  },
  createRow: (row, table) => {
    return {
      getCenterVisibleCells: utils.memo(() => [row._getAllVisibleCells(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allCells, left, right) => {
        const leftAndRight = [...(left != null ? left : []), ...(right != null ? right : [])];
        return allCells.filter(d => !leftAndRight.includes(d.column.id));
      }, {
        key: process.env.NODE_ENV === 'production' && 'row.getCenterVisibleCells',
        debug: () => {
          var _table$options$debugA;

          return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugRows;
        }
      }),
      getLeftVisibleCells: utils.memo(() => [row._getAllVisibleCells(), table.getState().columnPinning.left,,], (allCells, left) => {
        const cells = (left != null ? left : []).map(columnId => allCells.find(cell => cell.column.id === columnId)).filter(Boolean).map(d => ({ ...d,
          position: 'left'
        }));
        return cells;
      }, {
        key: process.env.NODE_ENV === 'production' && 'row.getLeftVisibleCells',
        debug: () => {
          var _table$options$debugA2;

          return (_table$options$debugA2 = table.options.debugAll) != null ? _table$options$debugA2 : table.options.debugRows;
        }
      }),
      getRightVisibleCells: utils.memo(() => [row._getAllVisibleCells(), table.getState().columnPinning.right], (allCells, right) => {
        const cells = (right != null ? right : []).map(columnId => allCells.find(cell => cell.column.id === columnId)).filter(Boolean).map(d => ({ ...d,
          position: 'left'
        }));
        return cells;
      }, {
        key: process.env.NODE_ENV === 'production' && 'row.getRightVisibleCells',
        debug: () => {
          var _table$options$debugA3;

          return (_table$options$debugA3 = table.options.debugAll) != null ? _table$options$debugA3 : table.options.debugRows;
        }
      })
    };
  },
  createTable: table => {
    return {
      setColumnPinning: updater => table.options.onColumnPinningChange == null ? void 0 : table.options.onColumnPinningChange(updater),
      resetColumnPinning: defaultState => {
        var _table$initialState$c, _table$initialState;

        return table.setColumnPinning(defaultState ? getDefaultPinningState() : (_table$initialState$c = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.columnPinning) != null ? _table$initialState$c : getDefaultPinningState());
      },
      getIsSomeColumnsPinned: position => {
        var _pinningState$positio;

        const pinningState = table.getState().columnPinning;

        if (!position) {
          var _pinningState$left, _pinningState$right;

          return Boolean(((_pinningState$left = pinningState.left) == null ? void 0 : _pinningState$left.length) || ((_pinningState$right = pinningState.right) == null ? void 0 : _pinningState$right.length));
        }

        return Boolean((_pinningState$positio = pinningState[position]) == null ? void 0 : _pinningState$positio.length);
      },
      getLeftLeafColumns: utils.memo(() => [table.getAllLeafColumns(), table.getState().columnPinning.left], (allColumns, left) => {
        return (left != null ? left : []).map(columnId => allColumns.find(column => column.id === columnId)).filter(Boolean);
      }, {
        key: process.env.NODE_ENV === 'development' && 'getLeftLeafColumns',
        debug: () => {
          var _table$options$debugA4;

          return (_table$options$debugA4 = table.options.debugAll) != null ? _table$options$debugA4 : table.options.debugColumns;
        }
      }),
      getRightLeafColumns: utils.memo(() => [table.getAllLeafColumns(), table.getState().columnPinning.right], (allColumns, right) => {
        return (right != null ? right : []).map(columnId => allColumns.find(column => column.id === columnId)).filter(Boolean);
      }, {
        key: process.env.NODE_ENV === 'development' && 'getRightLeafColumns',
        debug: () => {
          var _table$options$debugA5;

          return (_table$options$debugA5 = table.options.debugAll) != null ? _table$options$debugA5 : table.options.debugColumns;
        }
      }),
      getCenterLeafColumns: utils.memo(() => [table.getAllLeafColumns(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allColumns, left, right) => {
        const leftAndRight = [...(left != null ? left : []), ...(right != null ? right : [])];
        return allColumns.filter(d => !leftAndRight.includes(d.id));
      }, {
        key: process.env.NODE_ENV === 'development' && 'getCenterLeafColumns',
        debug: () => {
          var _table$options$debugA6;

          return (_table$options$debugA6 = table.options.debugAll) != null ? _table$options$debugA6 : table.options.debugColumns;
        }
      })
    };
  }
};

exports.Pinning = Pinning;
//# sourceMappingURL=Pinning.js.map
