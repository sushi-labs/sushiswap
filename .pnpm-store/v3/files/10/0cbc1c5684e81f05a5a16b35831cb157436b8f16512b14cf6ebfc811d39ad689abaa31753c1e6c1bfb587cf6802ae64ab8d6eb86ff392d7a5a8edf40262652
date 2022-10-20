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

function getSortedRowModel() {
  return table => utils.memo(() => [table.getState().sorting, table.getPreSortedRowModel()], (sorting, rowModel) => {
    if (!rowModel.rows.length || !(sorting != null && sorting.length)) {
      return rowModel;
    }

    const sortingState = table.getState().sorting;
    const sortedFlatRows = []; // Filter out sortings that correspond to non existing columns

    const availableSorting = sortingState.filter(sort => table.getColumn(sort.id).getCanSort());
    const columnInfoById = {};
    availableSorting.forEach(sortEntry => {
      const column = table.getColumn(sortEntry.id);
      columnInfoById[sortEntry.id] = {
        sortUndefined: column.columnDef.sortUndefined,
        invertSorting: column.columnDef.invertSorting,
        sortingFn: column.getSortingFn()
      };
    });

    const sortData = rows => {
      // This will also perform a stable sorting using the row index
      // if needed.
      const sortedData = rows.slice();
      sortedData.sort((rowA, rowB) => {
        for (let i = 0; i < availableSorting.length; i += 1) {
          var _sortEntry$desc;

          const sortEntry = availableSorting[i];
          const columnInfo = columnInfoById[sortEntry.id];
          const isDesc = (_sortEntry$desc = sortEntry == null ? void 0 : sortEntry.desc) != null ? _sortEntry$desc : false;

          if (columnInfo.sortUndefined) {
            const aValue = rowA.getValue(sortEntry.id);
            const bValue = rowB.getValue(sortEntry.id);
            const aUndefined = typeof aValue === 'undefined';
            const bUndefined = typeof bValue === 'undefined';

            if (aUndefined || bUndefined) {
              return aUndefined && bUndefined ? 0 : aUndefined ? columnInfo.sortUndefined : -columnInfo.sortUndefined;
            }
          } // This function should always return in ascending order


          let sortInt = columnInfo.sortingFn(rowA, rowB, sortEntry.id);

          if (sortInt !== 0) {
            if (isDesc) {
              sortInt *= -1;
            }

            if (columnInfo.invertSorting) {
              sortInt *= -1;
            }

            return sortInt;
          }
        }

        return rowA.index - rowB.index;
      }); // If there are sub-rows, sort them

      sortedData.forEach(row => {
        sortedFlatRows.push(row);

        if (!row.subRows || row.subRows.length <= 1) {
          return;
        }

        row.subRows = sortData(row.subRows);
      });
      return sortedData;
    };

    return {
      rows: sortData(rowModel.rows),
      flatRows: sortedFlatRows,
      rowsById: rowModel.rowsById
    };
  }, {
    key: process.env.NODE_ENV === 'development' && 'getSortedRowModel',
    debug: () => {
      var _table$options$debugA;

      return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugTable;
    },
    onChange: () => {
      table._autoResetPageIndex();
    }
  });
}

exports.getSortedRowModel = getSortedRowModel;
//# sourceMappingURL=getSortedRowModel.js.map
