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
const Expanding = {
  getInitialState: state => {
    return {
      expanded: {},
      ...state
    };
  },
  getDefaultOptions: table => {
    return {
      onExpandedChange: utils.makeStateUpdater('expanded', table),
      paginateExpandedRows: true
    };
  },
  createTable: table => {
    let registered = false;
    let queued = false;
    return {
      _autoResetExpanded: () => {
        if (!registered) {
          table._queue(() => {
            registered = true;
          });

          return;
        }

        if (table.options.autoResetAll ?? table.options.autoResetExpanded ?? !table.options.manualExpanding) {
          if (queued) return;
          queued = true;

          table._queue(() => {
            table.resetExpanded();
            queued = false;
          });
        }
      },
      setExpanded: updater => table.options.onExpandedChange == null ? void 0 : table.options.onExpandedChange(updater),
      toggleAllRowsExpanded: expanded => {
        if (expanded ?? !table.getIsAllRowsExpanded()) {
          table.setExpanded(true);
        } else {
          table.setExpanded({});
        }
      },
      resetExpanded: defaultState => {
        var _table$initialState;

        table.setExpanded(defaultState ? {} : ((_table$initialState = table.initialState) == null ? void 0 : _table$initialState.expanded) ?? {});
      },
      getCanSomeRowsExpand: () => {
        return table.getRowModel().flatRows.some(row => row.getCanExpand());
      },
      getToggleAllRowsExpandedHandler: () => {
        return e => {
          e.persist == null ? void 0 : e.persist();
          table.toggleAllRowsExpanded();
        };
      },
      getIsSomeRowsExpanded: () => {
        const expanded = table.getState().expanded;
        return expanded === true || Object.values(expanded).some(Boolean);
      },
      getIsAllRowsExpanded: () => {
        const expanded = table.getState().expanded; // If expanded is true, save some cycles and return true

        if (typeof expanded === 'boolean') {
          return expanded === true;
        }

        if (!Object.keys(expanded).length) {
          return false;
        } // If any row is not expanded, return false


        if (table.getRowModel().flatRows.some(row => !row.getIsExpanded())) {
          return false;
        } // They must all be expanded :shrug:


        return true;
      },
      getExpandedDepth: () => {
        let maxDepth = 0;
        const rowIds = table.getState().expanded === true ? Object.keys(table.getRowModel().rowsById) : Object.keys(table.getState().expanded);
        rowIds.forEach(id => {
          const splitId = id.split('.');
          maxDepth = Math.max(maxDepth, splitId.length);
        });
        return maxDepth;
      },
      getPreExpandedRowModel: () => table.getSortedRowModel(),
      getExpandedRowModel: () => {
        if (!table._getExpandedRowModel && table.options.getExpandedRowModel) {
          table._getExpandedRowModel = table.options.getExpandedRowModel(table);
        }

        if (table.options.manualExpanding || !table._getExpandedRowModel) {
          return table.getPreExpandedRowModel();
        }

        return table._getExpandedRowModel();
      }
    };
  },
  createRow: (row, table) => {
    return {
      toggleExpanded: expanded => {
        table.setExpanded(old => {
          const exists = old === true ? true : !!(old != null && old[row.id]);
          let oldExpanded = {};

          if (old === true) {
            Object.keys(table.getRowModel().rowsById).forEach(rowId => {
              oldExpanded[rowId] = true;
            });
          } else {
            oldExpanded = old;
          }

          expanded = expanded ?? !exists;

          if (!exists && expanded) {
            return { ...oldExpanded,
              [row.id]: true
            };
          }

          if (exists && !expanded) {
            const {
              [row.id]: _,
              ...rest
            } = oldExpanded;
            return rest;
          }

          return old;
        });
      },
      getIsExpanded: () => {
        const expanded = table.getState().expanded;
        return !!((table.options.getIsRowExpanded == null ? void 0 : table.options.getIsRowExpanded(row)) ?? (expanded === true || expanded != null && expanded[row.id]));
      },
      getCanExpand: () => {
        var _row$subRows;

        return (table.options.getRowCanExpand == null ? void 0 : table.options.getRowCanExpand(row)) ?? ((table.options.enableExpanding ?? true) && !!((_row$subRows = row.subRows) != null && _row$subRows.length));
      },
      getToggleExpandedHandler: () => {
        const canExpand = row.getCanExpand();
        return () => {
          if (!canExpand) return;
          row.toggleExpanded();
        };
      }
    };
  }
};

exports.Expanding = Expanding;
//# sourceMappingURL=Expanding.js.map
