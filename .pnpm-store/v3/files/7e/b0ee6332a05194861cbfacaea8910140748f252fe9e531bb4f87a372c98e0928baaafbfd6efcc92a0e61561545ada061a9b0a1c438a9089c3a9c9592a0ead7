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
var column = require('./column.js');
var headers = require('./headers.js');
var ColumnSizing = require('../features/ColumnSizing.js');
var Expanding = require('../features/Expanding.js');
var Filters = require('../features/Filters.js');
var Grouping = require('../features/Grouping.js');
var Ordering = require('../features/Ordering.js');
var Pagination = require('../features/Pagination.js');
var Pinning = require('../features/Pinning.js');
var RowSelection = require('../features/RowSelection.js');
var Sorting = require('../features/Sorting.js');
var Visibility = require('../features/Visibility.js');

const features = [headers.Headers, Visibility.Visibility, Ordering.Ordering, Pinning.Pinning, Filters.Filters, Sorting.Sorting, Grouping.Grouping, Expanding.Expanding, Pagination.Pagination, RowSelection.RowSelection, ColumnSizing.ColumnSizing]; //

function createTable(options) {
  if (options.debugAll || options.debugTable) {
    console.info('Creating Table Instance...');
  }

  let table = {
    _features: features
  };

  const defaultOptions = table._features.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultOptions == null ? void 0 : feature.getDefaultOptions(table));
  }, {});

  const mergeOptions = options => {
    if (table.options.mergeOptions) {
      return table.options.mergeOptions(defaultOptions, options);
    }

    return { ...defaultOptions,
      ...options
    };
  };

  const coreInitialState = {};
  let initialState = { ...coreInitialState,
    ...(options.initialState ?? {})
  };

  table._features.forEach(feature => {
    initialState = (feature.getInitialState == null ? void 0 : feature.getInitialState(initialState)) ?? initialState;
  });

  const queued = [];
  let queuedTimeout = false;
  const coreInstance = {
    _features: features,
    options: { ...defaultOptions,
      ...options
    },
    initialState,
    _queue: cb => {
      queued.push(cb);

      if (!queuedTimeout) {
        queuedTimeout = true; // Schedule a microtask to run the queued callbacks after
        // the current call stack (render, etc) has finished.

        Promise.resolve().then(() => {
          while (queued.length) {
            queued.shift()();
          }

          queuedTimeout = false;
        }).catch(error => setTimeout(() => {
          throw error;
        }));
      }
    },
    reset: () => {
      table.setState(table.initialState);
    },
    setOptions: updater => {
      const newOptions = utils.functionalUpdate(updater, table.options);
      table.options = mergeOptions(newOptions);
    },
    getState: () => {
      return table.options.state;
    },
    setState: updater => {
      table.options.onStateChange == null ? void 0 : table.options.onStateChange(updater);
    },
    _getRowId: (row, index, parent) => (table.options.getRowId == null ? void 0 : table.options.getRowId(row, index, parent)) ?? `${parent ? [parent.id, index].join('.') : index}`,
    getCoreRowModel: () => {
      if (!table._getCoreRowModel) {
        table._getCoreRowModel = table.options.getCoreRowModel(table);
      }

      return table._getCoreRowModel();
    },
    // The final calls start at the bottom of the model,
    // expanded rows, which then work their way up
    getRowModel: () => {
      return table.getPaginationRowModel();
    },
    getRow: id => {
      const row = table.getRowModel().rowsById[id];

      if (!row) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(`getRow expected an ID, but got ${id}`);
        }

        throw new Error();
      }

      return row;
    },
    _getDefaultColumnDef: utils.memo(() => [table.options.defaultColumn], defaultColumn => {
      defaultColumn = defaultColumn ?? {};
      return {
        header: props => {
          const resolvedColumnDef = props.header.column.columnDef;

          if (resolvedColumnDef.accessorKey) {
            return resolvedColumnDef.accessorKey;
          }

          if (resolvedColumnDef.accessorFn) {
            return resolvedColumnDef.id;
          }

          return null;
        },
        // footer: props => props.header.column.id,
        cell: props => {
          var _props$renderValue;

          return ((_props$renderValue = props.renderValue()) == null ? void 0 : _props$renderValue.toString == null ? void 0 : _props$renderValue.toString()) ?? null;
        },
        ...table._features.reduce((obj, feature) => {
          return Object.assign(obj, feature.getDefaultColumnDef == null ? void 0 : feature.getDefaultColumnDef());
        }, {}),
        ...defaultColumn
      };
    }, {
      debug: () => table.options.debugAll ?? table.options.debugColumns,
      key: process.env.NODE_ENV === 'development' && 'getDefaultColumnDef'
    }),
    _getColumnDefs: () => table.options.columns,
    getAllColumns: utils.memo(() => [table._getColumnDefs()], columnDefs => {
      const recurseColumns = function (columnDefs, parent, depth) {
        if (depth === void 0) {
          depth = 0;
        }

        return columnDefs.map(columnDef => {
          const column$1 = column.createColumn(table, columnDef, depth, parent);
          const groupingColumnDef = columnDef;
          column$1.columns = groupingColumnDef.columns ? recurseColumns(groupingColumnDef.columns, column$1, depth + 1) : [];
          return column$1;
        });
      };

      return recurseColumns(columnDefs);
    }, {
      key: process.env.NODE_ENV === 'development' && 'getAllColumns',
      debug: () => table.options.debugAll ?? table.options.debugColumns
    }),
    getAllFlatColumns: utils.memo(() => [table.getAllColumns()], allColumns => {
      return allColumns.flatMap(column => {
        return column.getFlatColumns();
      });
    }, {
      key: process.env.NODE_ENV === 'development' && 'getAllFlatColumns',
      debug: () => table.options.debugAll ?? table.options.debugColumns
    }),
    _getAllFlatColumnsById: utils.memo(() => [table.getAllFlatColumns()], flatColumns => {
      return flatColumns.reduce((acc, column) => {
        acc[column.id] = column;
        return acc;
      }, {});
    }, {
      key: process.env.NODE_ENV === 'development' && 'getAllFlatColumnsById',
      debug: () => table.options.debugAll ?? table.options.debugColumns
    }),
    getAllLeafColumns: utils.memo(() => [table.getAllColumns(), table._getOrderColumnsFn()], (allColumns, orderColumns) => {
      let leafColumns = allColumns.flatMap(column => column.getLeafColumns());
      return orderColumns(leafColumns);
    }, {
      key: process.env.NODE_ENV === 'development' && 'getAllLeafColumns',
      debug: () => table.options.debugAll ?? table.options.debugColumns
    }),
    getColumn: columnId => {
      const column = table._getAllFlatColumnsById()[columnId];

      if (!column) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[Table] Column with id ${columnId} does not exist.`);
        }

        throw new Error();
      }

      return column;
    }
  };
  Object.assign(table, coreInstance);

  table._features.forEach(feature => {
    return Object.assign(table, feature.createTable == null ? void 0 : feature.createTable(table));
  });

  return table;
}

exports.createTable = createTable;
//# sourceMappingURL=table.js.map
