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

var row = require('../core/row.js');
var utils = require('../utils.js');

function getGroupedRowModel() {
  return table => utils.memo(() => [table.getState().grouping, table.getPreGroupedRowModel()], (grouping, rowModel) => {
    if (!rowModel.rows.length || !grouping.length) {
      return rowModel;
    } // Filter the grouping list down to columns that exist


    const existingGrouping = grouping.filter(columnId => table.getColumn(columnId));
    const groupedFlatRows = [];
    const groupedRowsById = {}; // const onlyGroupedFlatRows: Row[] = [];
    // const onlyGroupedRowsById: Record<RowId, Row> = {};
    // const nonGroupedFlatRows: Row[] = [];
    // const nonGroupedRowsById: Record<RowId, Row> = {};
    // Recursively group the data

    const groupUpRecursively = function (rows, depth, parentId) {
      if (depth === void 0) {
        depth = 0;
      }

      // Grouping depth has been been met
      // Stop grouping and simply rewrite thd depth and row relationships
      if (depth >= existingGrouping.length) {
        return rows.map(row => {
          row.depth = depth;
          groupedFlatRows.push(row);
          groupedRowsById[row.id] = row;

          if (row.subRows) {
            row.subRows = groupUpRecursively(row.subRows, depth + 1);
          }

          return row;
        });
      }

      const columnId = existingGrouping[depth]; // Group the rows together for this level

      const rowGroupsMap = groupBy(rows, columnId); // Peform aggregations for each group

      const aggregatedGroupedRows = Array.from(rowGroupsMap.entries()).map((_ref, index) => {
        let [groupingValue, groupedRows] = _ref;
        let id = `${columnId}:${groupingValue}`;
        id = parentId ? `${parentId}>${id}` : id; // First, Recurse to group sub rows before aggregation

        const subRows = groupUpRecursively(groupedRows, depth + 1, id); // Flatten the leaf rows of the rows in this group

        const leafRows = depth ? utils.flattenBy(groupedRows, row => row.subRows) : groupedRows;
        const row$1 = row.createRow(table, id, leafRows[0].original, index, depth);
        Object.assign(row$1, {
          groupingColumnId: columnId,
          groupingValue,
          subRows,
          leafRows,
          getValue: columnId => {
            // Don't aggregate columns that are in the grouping
            if (existingGrouping.includes(columnId)) {
              if (row$1._valuesCache.hasOwnProperty(columnId)) {
                return row$1._valuesCache[columnId];
              }

              if (groupedRows[0]) {
                row$1._valuesCache[columnId] = groupedRows[0].getValue(columnId) ?? undefined;
              }

              return row$1._valuesCache[columnId];
            }

            if (row$1._groupingValuesCache.hasOwnProperty(columnId)) {
              return row$1._groupingValuesCache[columnId];
            } // Aggregate the values


            const column = table.getColumn(columnId);
            const aggregateFn = column.getAggregationFn();

            if (aggregateFn) {
              row$1._groupingValuesCache[columnId] = aggregateFn(columnId, leafRows, groupedRows);
              return row$1._groupingValuesCache[columnId];
            }
          }
        });
        subRows.forEach(subRow => {
          groupedFlatRows.push(subRow);
          groupedRowsById[subRow.id] = subRow; // if (subRow.getIsGrouped?.()) {
          //   onlyGroupedFlatRows.push(subRow);
          //   onlyGroupedRowsById[subRow.id] = subRow;
          // } else {
          //   nonGroupedFlatRows.push(subRow);
          //   nonGroupedRowsById[subRow.id] = subRow;
          // }
        });
        return row$1;
      });
      return aggregatedGroupedRows;
    };

    const groupedRows = groupUpRecursively(rowModel.rows, 0, '');
    groupedRows.forEach(subRow => {
      groupedFlatRows.push(subRow);
      groupedRowsById[subRow.id] = subRow; // if (subRow.getIsGrouped?.()) {
      //   onlyGroupedFlatRows.push(subRow);
      //   onlyGroupedRowsById[subRow.id] = subRow;
      // } else {
      //   nonGroupedFlatRows.push(subRow);
      //   nonGroupedRowsById[subRow.id] = subRow;
      // }
    });
    return {
      rows: groupedRows,
      flatRows: groupedFlatRows,
      rowsById: groupedRowsById
    };
  }, {
    key: process.env.NODE_ENV === 'development' && 'getGroupedRowModel',
    debug: () => table.options.debugAll ?? table.options.debugTable,
    onChange: () => {
      table._queue(() => {
        table._autoResetExpanded();

        table._autoResetPageIndex();
      });
    }
  });
}

function groupBy(rows, columnId) {
  const groupMap = new Map();
  return rows.reduce((map, row) => {
    const resKey = `${row.getValue(columnId)}`;
    const previous = map.get(resKey);

    if (!previous) {
      map.set(resKey, [row]);
    } else {
      map.set(resKey, [...previous, row]);
    }

    return map;
  }, groupMap);
}

exports.getGroupedRowModel = getGroupedRowModel;
//# sourceMappingURL=getGroupedRowModel.js.map
