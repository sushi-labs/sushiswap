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

//
function createTableFactory(opts) {
  return () => createTable(undefined, undefined, opts);
} // A lot of returns in here are `as any` for a reason. Unless you
// can find a better way to do this, then don't worry about them

function createTable(_, __, options) {
  const table = {
    generics: undefined,
    options: options != null ? options : {
      render: (() => {
        throw new Error('');
      })()
    },
    // setGenerics: () => table as any,
    setRowType: () => table,
    setTableMetaType: () => table,
    setColumnMetaType: () => table,
    setFilterMetaType: () => table,
    setOptions: newOptions => createTable(_, __, { ...options,
      ...newOptions
    }),
    createDisplayColumn: column => ({ ...column,
      columnDefType: 'display'
    }),
    createGroup: column => ({ ...column,
      columnDefType: 'group'
    }),
    createDataColumn: (accessor, column) => {
      column = { ...column,
        columnDefType: 'data',
        id: column.id
      };

      if (typeof accessor === 'string') {
        var _column$id;

        return { ...column,
          id: (_column$id = column.id) != null ? _column$id : accessor,
          accessorKey: accessor
        };
      }

      if (typeof accessor === 'function') {
        return { ...column,
          accessorFn: accessor
        };
      }

      throw new Error('Invalid accessor');
    },
    createOptions: options => options
  };
  return table;
}

exports.createTableFactory = createTableFactory;
//# sourceMappingURL=createTable.js.map
