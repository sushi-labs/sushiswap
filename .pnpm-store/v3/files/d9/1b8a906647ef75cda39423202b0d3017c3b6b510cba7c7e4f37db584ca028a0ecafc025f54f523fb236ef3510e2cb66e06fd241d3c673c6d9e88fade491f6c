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

var sortingFns = require('../sortingFns.js');
var utils = require('../utils.js');

//
const Sorting = {
  getInitialState: state => {
    return {
      sorting: [],
      ...state
    };
  },
  getDefaultColumnDef: () => {
    return {
      sortingFn: 'auto'
    };
  },
  getDefaultOptions: table => {
    return {
      onSortingChange: utils.makeStateUpdater('sorting', table),
      isMultiSortEvent: e => {
        return e.shiftKey;
      }
    };
  },
  createColumn: (column, table) => {
    return {
      getAutoSortingFn: () => {
        const firstRows = table.getFilteredRowModel().flatRows.slice(10);
        let isString = false;

        for (const row of firstRows) {
          const value = row == null ? void 0 : row.getValue(column.id);

          if (Object.prototype.toString.call(value) === '[object Date]') {
            return sortingFns.sortingFns.datetime;
          }

          if (typeof value === 'string') {
            isString = true;

            if (value.split(sortingFns.reSplitAlphaNumeric).length > 1) {
              return sortingFns.sortingFns.alphanumeric;
            }
          }
        }

        if (isString) {
          return sortingFns.sortingFns.text;
        }

        return sortingFns.sortingFns.basic;
      },
      getAutoSortDir: () => {
        const firstRow = table.getFilteredRowModel().flatRows[0];
        const value = firstRow == null ? void 0 : firstRow.getValue(column.id);

        if (typeof value === 'string') {
          return 'asc';
        }

        return 'desc';
      },
      getSortingFn: () => {
        var _table$options$sortin;

        if (!column) {
          throw new Error();
        }

        return utils.isFunction(column.columnDef.sortingFn) ? column.columnDef.sortingFn : column.columnDef.sortingFn === 'auto' ? column.getAutoSortingFn() : ((_table$options$sortin = table.options.sortingFns) == null ? void 0 : _table$options$sortin[column.columnDef.sortingFn]) ?? sortingFns.sortingFns[column.columnDef.sortingFn];
      },
      toggleSorting: (desc, multi) => {
        // if (column.columns.length) {
        //   column.columns.forEach((c, i) => {
        //     if (c.id) {
        //       table.toggleColumnSorting(c.id, undefined, multi || !!i)
        //     }
        //   })
        //   return
        // }
        // this needs to be outside of table.setSorting to be in sync with rerender
        const nextSortingOrder = column.getNextSortingOrder();
        const hasManualValue = typeof desc !== 'undefined' && desc !== null;
        table.setSorting(old => {
          // Find any existing sorting for this column
          const existingSorting = old == null ? void 0 : old.find(d => d.id === column.id);
          const existingIndex = old == null ? void 0 : old.findIndex(d => d.id === column.id);
          let newSorting = []; // What should we do with this sort action?

          let sortAction;
          let nextDesc = hasManualValue ? desc : nextSortingOrder === 'desc'; // Multi-mode

          if (old != null && old.length && column.getCanMultiSort() && multi) {
            if (existingSorting) {
              sortAction = 'toggle';
            } else {
              sortAction = 'add';
            }
          } else {
            // Normal mode
            if (old != null && old.length && existingIndex !== old.length - 1) {
              sortAction = 'replace';
            } else if (existingSorting) {
              sortAction = 'toggle';
            } else {
              sortAction = 'replace';
            }
          } // Handle toggle states that will remove the sorting


          if (sortAction === 'toggle') {
            // If we are "actually" toggling (not a manual set value), should we remove the sorting?
            if (!hasManualValue) {
              // Is our intention to remove?
              if (!nextSortingOrder) {
                sortAction = 'remove';
              }
            }
          }

          if (sortAction === 'add') {
            newSorting = [...old, {
              id: column.id,
              desc: nextDesc
            }]; // Take latest n columns

            newSorting.splice(0, newSorting.length - (table.options.maxMultiSortColCount ?? Number.MAX_SAFE_INTEGER));
          } else if (sortAction === 'toggle') {
            // This flips (or sets) the
            newSorting = old.map(d => {
              if (d.id === column.id) {
                return { ...d,
                  desc: nextDesc
                };
              }

              return d;
            });
          } else if (sortAction === 'remove') {
            newSorting = old.filter(d => d.id !== column.id);
          } else {
            newSorting = [{
              id: column.id,
              desc: nextDesc
            }];
          }

          return newSorting;
        });
      },
      getFirstSortDir: () => {
        const sortDescFirst = column.columnDef.sortDescFirst ?? table.options.sortDescFirst ?? column.getAutoSortDir() === 'desc';
        return sortDescFirst ? 'desc' : 'asc';
      },
      getNextSortingOrder: multi => {
        const firstSortDirection = column.getFirstSortDir();
        const isSorted = column.getIsSorted();

        if (!isSorted) {
          return firstSortDirection;
        }

        if (isSorted !== firstSortDirection && (table.options.enableSortingRemoval ?? true) && ( // If enableSortRemove, enable in general
        multi ? table.options.enableMultiRemove ?? true : true) // If multi, don't allow if enableMultiRemove))
        ) {
          return false;
        }

        return isSorted === 'desc' ? 'asc' : 'desc';
      },
      getCanSort: () => {
        return (column.columnDef.enableSorting ?? true) && (table.options.enableSorting ?? true) && !!column.accessorFn;
      },
      getCanMultiSort: () => {
        return column.columnDef.enableMultiSort ?? table.options.enableMultiSort ?? !!column.accessorFn;
      },
      getIsSorted: () => {
        var _table$getState$sorti;

        const columnSort = (_table$getState$sorti = table.getState().sorting) == null ? void 0 : _table$getState$sorti.find(d => d.id === column.id);
        return !columnSort ? false : columnSort.desc ? 'desc' : 'asc';
      },
      getSortIndex: () => {
        var _table$getState$sorti2;

        return ((_table$getState$sorti2 = table.getState().sorting) == null ? void 0 : _table$getState$sorti2.findIndex(d => d.id === column.id)) ?? -1;
      },
      clearSorting: () => {
        //clear sorting for just 1 column
        table.setSorting(old => old != null && old.length ? old.filter(d => d.id !== column.id) : []);
      },
      getToggleSortingHandler: () => {
        const canSort = column.getCanSort();
        return e => {
          if (!canSort) return;
          e.persist == null ? void 0 : e.persist();
          column.toggleSorting == null ? void 0 : column.toggleSorting(undefined, column.getCanMultiSort() ? table.options.isMultiSortEvent == null ? void 0 : table.options.isMultiSortEvent(e) : false);
        };
      }
    };
  },
  createTable: table => {
    return {
      setSorting: updater => table.options.onSortingChange == null ? void 0 : table.options.onSortingChange(updater),
      resetSorting: defaultState => {
        var _table$initialState;

        table.setSorting(defaultState ? [] : ((_table$initialState = table.initialState) == null ? void 0 : _table$initialState.sorting) ?? []);
      },
      getPreSortedRowModel: () => table.getGroupedRowModel(),
      getSortedRowModel: () => {
        if (!table._getSortedRowModel && table.options.getSortedRowModel) {
          table._getSortedRowModel = table.options.getSortedRowModel(table);
        }

        if (table.options.manualSorting || !table._getSortedRowModel) {
          return table.getPreSortedRowModel();
        }

        return table._getSortedRowModel();
      }
    };
  }
};

exports.Sorting = Sorting;
//# sourceMappingURL=Sorting.js.map
