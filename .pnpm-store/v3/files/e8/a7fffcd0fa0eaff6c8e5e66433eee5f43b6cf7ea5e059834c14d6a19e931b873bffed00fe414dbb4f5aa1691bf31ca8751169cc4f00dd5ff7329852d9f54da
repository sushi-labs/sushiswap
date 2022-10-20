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
  getDefaultOptions: instance => {
    return {
      onColumnPinningChange: utils.makeStateUpdater('columnPinning', instance)
    };
  },
  createColumn: (column, instance) => {
    return {
      pin: position => {
        const columnIds = column.getLeafColumns().map(d => d.id).filter(Boolean);
        instance.setColumnPinning(old => {
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
          var _d$columnDef$enablePi, _instance$options$ena;

          return ((_d$columnDef$enablePi = d.columnDef.enablePinning) != null ? _d$columnDef$enablePi : true) && ((_instance$options$ena = instance.options.enablePinning) != null ? _instance$options$ena : true);
        });
      },
      getIsPinned: () => {
        const leafColumnIds = column.getLeafColumns().map(d => d.id);
        const {
          left,
          right
        } = instance.getState().columnPinning;
        const isLeft = leafColumnIds.some(d => left == null ? void 0 : left.includes(d));
        const isRight = leafColumnIds.some(d => right == null ? void 0 : right.includes(d));
        return isLeft ? 'left' : isRight ? 'right' : false;
      },
      getPinnedIndex: () => {
        var _instance$getState$co, _instance$getState$co2, _instance$getState$co3;

        const position = column.getIsPinned();
        return position ? (_instance$getState$co = (_instance$getState$co2 = instance.getState().columnPinning) == null ? void 0 : (_instance$getState$co3 = _instance$getState$co2[position]) == null ? void 0 : _instance$getState$co3.indexOf(column.id)) != null ? _instance$getState$co : -1 : 0;
      }
    };
  },
  createRow: (row, instance) => {
    return {
      getCenterVisibleCells: utils.memo(() => [row._getAllVisibleCells(), instance.getState().columnPinning.left, instance.getState().columnPinning.right], (allCells, left, right) => {
        const leftAndRight = [...(left != null ? left : []), ...(right != null ? right : [])];
        return allCells.filter(d => !leftAndRight.includes(d.column.id));
      }, {
        key: process.env.NODE_ENV === 'production' && 'row.getCenterVisibleCells',
        debug: () => {
          var _instance$options$deb;

          return (_instance$options$deb = instance.options.debugAll) != null ? _instance$options$deb : instance.options.debugRows;
        }
      }),
      getLeftVisibleCells: utils.memo(() => [row._getAllVisibleCells(), instance.getState().columnPinning.left,,], (allCells, left) => {
        const cells = (left != null ? left : []).map(columnId => allCells.find(cell => cell.column.id === columnId)).filter(Boolean).map(d => ({ ...d,
          position: 'left'
        }));
        return cells;
      }, {
        key: process.env.NODE_ENV === 'production' && 'row.getLeftVisibleCells',
        debug: () => {
          var _instance$options$deb2;

          return (_instance$options$deb2 = instance.options.debugAll) != null ? _instance$options$deb2 : instance.options.debugRows;
        }
      }),
      getRightVisibleCells: utils.memo(() => [row._getAllVisibleCells(), instance.getState().columnPinning.right], (allCells, right) => {
        const cells = (right != null ? right : []).map(columnId => allCells.find(cell => cell.column.id === columnId)).filter(Boolean).map(d => ({ ...d,
          position: 'left'
        }));
        return cells;
      }, {
        key: process.env.NODE_ENV === 'production' && 'row.getRightVisibleCells',
        debug: () => {
          var _instance$options$deb3;

          return (_instance$options$deb3 = instance.options.debugAll) != null ? _instance$options$deb3 : instance.options.debugRows;
        }
      })
    };
  },
  createInstance: instance => {
    return {
      setColumnPinning: updater => instance.options.onColumnPinningChange == null ? void 0 : instance.options.onColumnPinningChange(updater),
      resetColumnPinning: defaultState => {
        var _instance$initialStat, _instance$initialStat2;

        return instance.setColumnPinning(defaultState ? getDefaultPinningState() : (_instance$initialStat = (_instance$initialStat2 = instance.initialState) == null ? void 0 : _instance$initialStat2.columnPinning) != null ? _instance$initialStat : getDefaultPinningState());
      },
      getIsSomeColumnsPinned: position => {
        var _pinningState$positio;

        const pinningState = instance.getState().columnPinning;

        if (!position) {
          var _pinningState$left, _pinningState$right;

          return Boolean(((_pinningState$left = pinningState.left) == null ? void 0 : _pinningState$left.length) || ((_pinningState$right = pinningState.right) == null ? void 0 : _pinningState$right.length));
        }

        return Boolean((_pinningState$positio = pinningState[position]) == null ? void 0 : _pinningState$positio.length);
      },
      getLeftLeafColumns: utils.memo(() => [instance.getAllLeafColumns(), instance.getState().columnPinning.left], (allColumns, left) => {
        return (left != null ? left : []).map(columnId => allColumns.find(column => column.id === columnId)).filter(Boolean);
      }, {
        key: process.env.NODE_ENV === 'development' && 'getLeftLeafColumns',
        debug: () => {
          var _instance$options$deb4;

          return (_instance$options$deb4 = instance.options.debugAll) != null ? _instance$options$deb4 : instance.options.debugColumns;
        }
      }),
      getRightLeafColumns: utils.memo(() => [instance.getAllLeafColumns(), instance.getState().columnPinning.right], (allColumns, right) => {
        return (right != null ? right : []).map(columnId => allColumns.find(column => column.id === columnId)).filter(Boolean);
      }, {
        key: process.env.NODE_ENV === 'development' && 'getRightLeafColumns',
        debug: () => {
          var _instance$options$deb5;

          return (_instance$options$deb5 = instance.options.debugAll) != null ? _instance$options$deb5 : instance.options.debugColumns;
        }
      }),
      getCenterLeafColumns: utils.memo(() => [instance.getAllLeafColumns(), instance.getState().columnPinning.left, instance.getState().columnPinning.right], (allColumns, left, right) => {
        const leftAndRight = [...(left != null ? left : []), ...(right != null ? right : [])];
        return allColumns.filter(d => !leftAndRight.includes(d.id));
      }, {
        key: process.env.NODE_ENV === 'development' && 'getCenterLeafColumns',
        debug: () => {
          var _instance$options$deb6;

          return (_instance$options$deb6 = instance.options.debugAll) != null ? _instance$options$deb6 : instance.options.debugColumns;
        }
      })
    };
  }
};

exports.Pinning = Pinning;
//# sourceMappingURL=Pinning.js.map
