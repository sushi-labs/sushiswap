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

function createColumn(table, columnDef, depth, parent) {
  const defaultColumn = table._getDefaultColumnDef();

  const resolvedColumnDef = { ...defaultColumn,
    ...columnDef
  };
  const accessorKey = resolvedColumnDef.accessorKey;
  let id = resolvedColumnDef.id ?? (accessorKey ? accessorKey.replace('.', '_') : undefined) ?? (typeof resolvedColumnDef.header === 'string' ? resolvedColumnDef.header : undefined);
  let accessorFn;

  if (resolvedColumnDef.accessorFn) {
    accessorFn = resolvedColumnDef.accessorFn;
  } else if (accessorKey) {
    // Support deep accessor keys
    if (accessorKey.includes('.')) {
      accessorFn = originalRow => {
        let result = originalRow;

        for (const key of accessorKey.split('.')) {
          result = result[key];
        }

        return result;
      };
    } else {
      accessorFn = originalRow => originalRow[resolvedColumnDef.accessorKey];
    }
  }

  if (!id) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(resolvedColumnDef.accessorFn ? `Columns require an id when using an accessorFn` : `Columns require an id when using a non-string header`);
    }

    throw new Error();
  }

  let column = {
    id: `${String(id)}`,
    accessorFn,
    parent: parent,
    depth,
    columnDef: resolvedColumnDef,
    columns: [],
    getFlatColumns: utils.memo(() => [true], () => {
      var _column$columns;

      return [column, ...((_column$columns = column.columns) == null ? void 0 : _column$columns.flatMap(d => d.getFlatColumns()))];
    }, {
      key: process.env.NODE_ENV === 'production' && 'column.getFlatColumns',
      debug: () => table.options.debugAll ?? table.options.debugColumns
    }),
    getLeafColumns: utils.memo(() => [table._getOrderColumnsFn()], orderColumns => {
      var _column$columns2;

      if ((_column$columns2 = column.columns) != null && _column$columns2.length) {
        let leafColumns = column.columns.flatMap(column => column.getLeafColumns());
        return orderColumns(leafColumns);
      }

      return [column];
    }, {
      key: process.env.NODE_ENV === 'production' && 'column.getLeafColumns',
      debug: () => table.options.debugAll ?? table.options.debugColumns
    })
  };
  column = table._features.reduce((obj, feature) => {
    return Object.assign(obj, feature.createColumn == null ? void 0 : feature.createColumn(column, table));
  }, column); // Yes, we have to convert table to uknown, because we know more than the compiler here.

  return column;
}

exports.createColumn = createColumn;
//# sourceMappingURL=column.js.map
