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
  getDefaultOptions: instance => {
    return {
      onSortingChange: utils.makeStateUpdater('sorting', instance),
      isMultiSortEvent: e => {
        return e.shiftKey;
      }
    };
  },
  createColumn: (column, instance) => {
    return {
      getAutoSortingFn: () => {
        const firstRows = instance.getFilteredRowModel().flatRows.slice(10);
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
        const firstRow = instance.getFilteredRowModel().flatRows[0];
        const value = firstRow == null ? void 0 : firstRow.getValue(column.id);

        if (typeof value === 'string') {
          return 'asc';
        }

        return 'desc';
      },
      getSortingFn: () => {
        var _ref;

        const userSortingFn = instance.options.sortingFns;

        if (!column) {
          throw new Error();
        }

        return utils.isFunction(column.columnDef.sortingFn) ? column.columnDef.sortingFn : column.columnDef.sortingFn === 'auto' ? column.getAutoSortingFn() : (_ref = userSortingFn == null ? void 0 : userSortingFn[column.columnDef.sortingFn]) != null ? _ref : sortingFns.sortingFns[column.columnDef.sortingFn];
      },
      toggleSorting: (desc, multi) => {
        // if (column.columns.length) {
        //   column.columns.forEach((c, i) => {
        //     if (c.id) {
        //       instance.toggleColumnSorting(c.id, undefined, multi || !!i)
        //     }
        //   })
        //   return
        // }
        instance.setSorting(old => {
          var _ref2, _column$columnDef$sor, _instance$options$ena, _instance$options$ena2;

          // Find any existing sorting for this column
          const existingSorting = old == null ? void 0 : old.find(d => d.id === column.id);
          const existingIndex = old == null ? void 0 : old.findIndex(d => d.id === column.id);
          const hasDescDefined = typeof desc !== 'undefined' && desc !== null;
          let newSorting = []; // What should we do with this sort action?

          let sortAction;

          if (column.getCanMultiSort() && multi) {
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
          }

          const sortDescFirst = (_ref2 = (_column$columnDef$sor = column.columnDef.sortDescFirst) != null ? _column$columnDef$sor : instance.options.sortDescFirst) != null ? _ref2 : column.getAutoSortDir() === 'desc'; // Handle toggle states that will remove the sorting

          if (sortAction === 'toggle' && ( // Must be toggling
          (_instance$options$ena = instance.options.enableSortingRemoval) != null ? _instance$options$ena : true) && // If enableSortRemove, enable in general
          !hasDescDefined && ( // Must not be setting desc
          multi ? (_instance$options$ena2 = instance.options.enableMultiRemove) != null ? _instance$options$ena2 : true : true) && ( // If multi, don't allow if enableMultiRemove
          existingSorting != null && existingSorting.desc // Finally, detect if it should indeed be removed
          ? !sortDescFirst : sortDescFirst)) {
            sortAction = 'remove';
          }

          if (sortAction === 'replace') {
            newSorting = [{
              id: column.id,
              desc: hasDescDefined ? desc : !!sortDescFirst
            }];
          } else if (sortAction === 'add' && old != null && old.length) {
            var _instance$options$max;

            newSorting = [...old, {
              id: column.id,
              desc: hasDescDefined ? desc : !!sortDescFirst
            }]; // Take latest n columns

            newSorting.splice(0, newSorting.length - ((_instance$options$max = instance.options.maxMultiSortColCount) != null ? _instance$options$max : Number.MAX_SAFE_INTEGER));
          } else if (sortAction === 'toggle' && old != null && old.length) {
            // This flips (or sets) the
            newSorting = old.map(d => {
              if (d.id === column.id) {
                return { ...d,
                  desc: hasDescDefined ? desc : !(existingSorting != null && existingSorting.desc)
                };
              }

              return d;
            });
          } else if (sortAction === 'remove' && old != null && old.length) {
            newSorting = old.filter(d => d.id !== column.id);
          }

          return newSorting;
        });
      },
      getCanSort: () => {
        var _column$columnDef$ena, _instance$options$ena3;

        return ((_column$columnDef$ena = column.columnDef.enableSorting) != null ? _column$columnDef$ena : true) && ((_instance$options$ena3 = instance.options.enableSorting) != null ? _instance$options$ena3 : true) && !!column.accessorFn;
      },
      getCanMultiSort: () => {
        var _ref3, _column$columnDef$ena2;

        return (_ref3 = (_column$columnDef$ena2 = column.columnDef.enableMultiSort) != null ? _column$columnDef$ena2 : instance.options.enableMultiSort) != null ? _ref3 : !!column.accessorFn;
      },
      getIsSorted: () => {
        var _instance$getState$so;

        const columnSort = (_instance$getState$so = instance.getState().sorting) == null ? void 0 : _instance$getState$so.find(d => d.id === column.id);
        return !columnSort ? false : columnSort.desc ? 'desc' : 'asc';
      },
      getSortIndex: () => {
        var _instance$getState$so2, _instance$getState$so3;

        return (_instance$getState$so2 = (_instance$getState$so3 = instance.getState().sorting) == null ? void 0 : _instance$getState$so3.findIndex(d => d.id === column.id)) != null ? _instance$getState$so2 : -1;
      },
      clearSorting: () => {
        //clear sorting for just 1 column
        instance.setSorting(old => old != null && old.length ? old.filter(d => d.id !== column.id) : []);
      },
      getToggleSortingHandler: () => {
        const canSort = column.getCanSort();
        return e => {
          if (!canSort) return;
          e.persist == null ? void 0 : e.persist();
          column.toggleSorting == null ? void 0 : column.toggleSorting(undefined, column.getCanMultiSort() ? instance.options.isMultiSortEvent == null ? void 0 : instance.options.isMultiSortEvent(e) : false);
        };
      }
    };
  },
  createInstance: instance => {
    return {
      setSorting: updater => instance.options.onSortingChange == null ? void 0 : instance.options.onSortingChange(updater),
      resetSorting: defaultState => {
        var _instance$initialStat, _instance$initialStat2;

        instance.setSorting(defaultState ? [] : (_instance$initialStat = (_instance$initialStat2 = instance.initialState) == null ? void 0 : _instance$initialStat2.sorting) != null ? _instance$initialStat : []);
      },
      getPreSortedRowModel: () => instance.getFilteredRowModel(),
      getSortedRowModel: () => {
        if (!instance._getSortedRowModel && instance.options.getSortedRowModel) {
          instance._getSortedRowModel = instance.options.getSortedRowModel(instance);
        }

        if (instance.options.manualSorting || !instance._getSortedRowModel) {
          return instance.getPreSortedRowModel();
        }

        return instance._getSortedRowModel();
      }
    };
  }
};

exports.Sorting = Sorting;
//# sourceMappingURL=Sorting.js.map
