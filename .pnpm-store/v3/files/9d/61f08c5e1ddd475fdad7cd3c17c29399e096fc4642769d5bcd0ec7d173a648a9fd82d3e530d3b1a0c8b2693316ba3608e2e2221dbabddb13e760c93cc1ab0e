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

var aggregationFns = require('../aggregationFns.js');
var utils = require('../utils.js');

//
const Grouping = {
  getDefaultColumnDef: () => {
    return {
      aggregatedCell: props => {
        var _props$getValue;

        return ((_props$getValue = props.getValue()) == null ? void 0 : _props$getValue.toString == null ? void 0 : _props$getValue.toString()) ?? null;
      },
      aggregationFn: 'auto'
    };
  },
  getInitialState: state => {
    return {
      grouping: [],
      ...state
    };
  },
  getDefaultOptions: table => {
    return {
      onGroupingChange: utils.makeStateUpdater('grouping', table),
      groupedColumnMode: 'reorder'
    };
  },
  createColumn: (column, table) => {
    return {
      toggleGrouping: () => {
        table.setGrouping(old => {
          // Find any existing grouping for this column
          if (old != null && old.includes(column.id)) {
            return old.filter(d => d !== column.id);
          }

          return [...(old ?? []), column.id];
        });
      },
      getCanGroup: () => {
        return column.columnDef.enableGrouping ?? true ?? table.options.enableGrouping ?? true ?? !!column.accessorFn;
      },
      getIsGrouped: () => {
        var _table$getState$group;

        return (_table$getState$group = table.getState().grouping) == null ? void 0 : _table$getState$group.includes(column.id);
      },
      getGroupedIndex: () => {
        var _table$getState$group2;

        return (_table$getState$group2 = table.getState().grouping) == null ? void 0 : _table$getState$group2.indexOf(column.id);
      },
      getToggleGroupingHandler: () => {
        const canGroup = column.getCanGroup();
        return () => {
          if (!canGroup) return;
          column.toggleGrouping();
        };
      },
      getAutoAggregationFn: () => {
        const firstRow = table.getCoreRowModel().flatRows[0];
        const value = firstRow == null ? void 0 : firstRow.getValue(column.id);

        if (typeof value === 'number') {
          return aggregationFns.aggregationFns.sum;
        }

        if (Object.prototype.toString.call(value) === '[object Date]') {
          return aggregationFns.aggregationFns.extent;
        }
      },
      getAggregationFn: () => {
        var _table$options$aggreg;

        if (!column) {
          throw new Error();
        }

        return utils.isFunction(column.columnDef.aggregationFn) ? column.columnDef.aggregationFn : column.columnDef.aggregationFn === 'auto' ? column.getAutoAggregationFn() : ((_table$options$aggreg = table.options.aggregationFns) == null ? void 0 : _table$options$aggreg[column.columnDef.aggregationFn]) ?? aggregationFns.aggregationFns[column.columnDef.aggregationFn];
      }
    };
  },
  createTable: table => {
    return {
      setGrouping: updater => table.options.onGroupingChange == null ? void 0 : table.options.onGroupingChange(updater),
      resetGrouping: defaultState => {
        var _table$initialState;

        table.setGrouping(defaultState ? [] : ((_table$initialState = table.initialState) == null ? void 0 : _table$initialState.grouping) ?? []);
      },
      getPreGroupedRowModel: () => table.getFilteredRowModel(),
      getGroupedRowModel: () => {
        if (!table._getGroupedRowModel && table.options.getGroupedRowModel) {
          table._getGroupedRowModel = table.options.getGroupedRowModel(table);
        }

        if (table.options.manualGrouping || !table._getGroupedRowModel) {
          return table.getPreGroupedRowModel();
        }

        return table._getGroupedRowModel();
      }
    };
  },
  createRow: row => {
    return {
      getIsGrouped: () => !!row.groupingColumnId,
      _groupingValuesCache: {}
    };
  },
  createCell: (cell, column, row, table) => {

    return {
      getIsGrouped: () => column.getIsGrouped() && column.id === row.groupingColumnId,
      getIsPlaceholder: () => !cell.getIsGrouped() && column.getIsGrouped(),
      getIsAggregated: () => {
        var _row$subRows;

        return !cell.getIsGrouped() && !cell.getIsPlaceholder() && !!((_row$subRows = row.subRows) != null && _row$subRows.length);
      }
    };
  }
};
function orderColumns(leafColumns, grouping, groupedColumnMode) {
  if (!(grouping != null && grouping.length) || !groupedColumnMode) {
    return leafColumns;
  }

  const nonGroupingColumns = leafColumns.filter(col => !grouping.includes(col.id));

  if (groupedColumnMode === 'remove') {
    return nonGroupingColumns;
  }

  const groupingColumns = grouping.map(g => leafColumns.find(col => col.id === g)).filter(Boolean);
  return [...groupingColumns, ...nonGroupingColumns];
}

exports.Grouping = Grouping;
exports.orderColumns = orderColumns;
//# sourceMappingURL=Grouping.js.map
