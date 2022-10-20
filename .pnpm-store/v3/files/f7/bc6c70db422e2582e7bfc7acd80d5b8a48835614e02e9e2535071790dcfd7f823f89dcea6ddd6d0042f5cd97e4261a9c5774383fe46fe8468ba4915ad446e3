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
const RowSelection = {
  getInitialState: state => {
    return {
      rowSelection: {},
      ...state
    };
  },
  getDefaultOptions: instance => {
    return {
      onRowSelectionChange: utils.makeStateUpdater('rowSelection', instance),
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableSubRowSelection: true // enableGroupingRowSelection: false,
      // isAdditiveSelectEvent: (e: unknown) => !!e.metaKey,
      // isInclusiveSelectEvent: (e: unknown) => !!e.shiftKey,

    };
  },
  createInstance: instance => {
    return {
      setRowSelection: updater => instance.options.onRowSelectionChange == null ? void 0 : instance.options.onRowSelectionChange(updater),
      resetRowSelection: defaultState => {
        var _instance$initialStat;

        return instance.setRowSelection(defaultState ? {} : (_instance$initialStat = instance.initialState.rowSelection) != null ? _instance$initialStat : {});
      },
      toggleAllRowsSelected: value => {
        instance.setRowSelection(old => {
          value = typeof value !== 'undefined' ? value : !instance.getIsAllRowsSelected();
          const rowSelection = { ...old
          };
          const preGroupedFlatRows = instance.getPreGroupedRowModel().flatRows; // We don't use `mutateRowIsSelected` here for performance reasons.
          // All of the rows are flat already, so it wouldn't be worth it

          if (value) {
            preGroupedFlatRows.forEach(row => {
              rowSelection[row.id] = true;
            });
          } else {
            preGroupedFlatRows.forEach(row => {
              delete rowSelection[row.id];
            });
          }

          return rowSelection;
        });
      },
      toggleAllPageRowsSelected: value => instance.setRowSelection(old => {
        typeof value !== 'undefined' ? value : !instance.getIsAllPageRowsSelected();
        const rowSelection = { ...old
        };
        instance.getRowModel().rows.forEach(row => {
          mutateRowIsSelected(rowSelection, row.id, value, instance);
        });
        return rowSelection;
      }),
      // addRowSelectionRange: rowId => {
      //   const {
      //     rows,
      //     rowsById,
      //     options: { selectGroupingRows, selectSubRows },
      //   } = instance
      //   const findSelectedRow = (rows: Row[]) => {
      //     let found
      //     rows.find(d => {
      //       if (d.getIsSelected()) {
      //         found = d
      //         return true
      //       }
      //       const subFound = findSelectedRow(d.subRows || [])
      //       if (subFound) {
      //         found = subFound
      //         return true
      //       }
      //       return false
      //     })
      //     return found
      //   }
      //   const firstRow = findSelectedRow(rows) || rows[0]
      //   const lastRow = rowsById[rowId]
      //   let include = false
      //   const selectedRowIds = {}
      //   const addRow = (row: Row) => {
      //     mutateRowIsSelected(selectedRowIds, row.id, true, {
      //       rowsById,
      //       selectGroupingRows: selectGroupingRows!,
      //       selectSubRows: selectSubRows!,
      //     })
      //   }
      //   instance.rows.forEach(row => {
      //     const isFirstRow = row.id === firstRow.id
      //     const isLastRow = row.id === lastRow.id
      //     if (isFirstRow || isLastRow) {
      //       if (!include) {
      //         include = true
      //       } else if (include) {
      //         addRow(row)
      //         include = false
      //       }
      //     }
      //     if (include) {
      //       addRow(row)
      //     }
      //   })
      //   instance.setRowSelection(selectedRowIds)
      // },
      getPreSelectedRowModel: () => instance.getCoreRowModel(),
      getSelectedRowModel: utils.memo(() => [instance.getState().rowSelection, instance.getCoreRowModel()], (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            rows: [],
            flatRows: [],
            rowsById: {}
          };
        }

        return selectRowsFn(instance, rowModel);
      }, {
        key: process.env.NODE_ENV === 'development' && 'getSelectedRowModel',
        debug: () => {
          var _instance$options$deb;

          return (_instance$options$deb = instance.options.debugAll) != null ? _instance$options$deb : instance.options.debugTable;
        }
      }),
      getFilteredSelectedRowModel: utils.memo(() => [instance.getState().rowSelection, instance.getFilteredRowModel()], (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            rows: [],
            flatRows: [],
            rowsById: {}
          };
        }

        return selectRowsFn(instance, rowModel);
      }, {
        key: process.env.NODE_ENV === 'production' && 'getFilteredSelectedRowModel',
        debug: () => {
          var _instance$options$deb2;

          return (_instance$options$deb2 = instance.options.debugAll) != null ? _instance$options$deb2 : instance.options.debugTable;
        }
      }),
      getGroupedSelectedRowModel: utils.memo(() => [instance.getState().rowSelection, instance.getGroupedRowModel()], (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            rows: [],
            flatRows: [],
            rowsById: {}
          };
        }

        return selectRowsFn(instance, rowModel);
      }, {
        key: process.env.NODE_ENV === 'production' && 'getGroupedSelectedRowModel',
        debug: () => {
          var _instance$options$deb3;

          return (_instance$options$deb3 = instance.options.debugAll) != null ? _instance$options$deb3 : instance.options.debugTable;
        }
      }),
      ///
      // getGroupingRowCanSelect: rowId => {
      //   const row = instance.getRow(rowId)
      //   if (!row) {
      //     throw new Error()
      //   }
      //   if (typeof instance.options.enableGroupingRowSelection === 'function') {
      //     return instance.options.enableGroupingRowSelection(row)
      //   }
      //   return instance.options.enableGroupingRowSelection ?? false
      // },
      getIsAllRowsSelected: () => {
        const preFilteredFlatRows = instance.getPreFilteredRowModel().flatRows;
        const {
          rowSelection
        } = instance.getState();
        let isAllRowsSelected = Boolean(preFilteredFlatRows.length && Object.keys(rowSelection).length);

        if (isAllRowsSelected) {
          if (preFilteredFlatRows.some(row => !rowSelection[row.id])) {
            isAllRowsSelected = false;
          }
        }

        return isAllRowsSelected;
      },
      getIsAllPageRowsSelected: () => {
        const paginationFlatRows = instance.getPaginationRowModel().flatRows;
        const {
          rowSelection
        } = instance.getState();
        let isAllPageRowsSelected = !!paginationFlatRows.length;

        if (isAllPageRowsSelected && paginationFlatRows.some(row => !rowSelection[row.id])) {
          isAllPageRowsSelected = false;
        }

        return isAllPageRowsSelected;
      },
      getIsSomeRowsSelected: () => {
        var _instance$getState$ro;

        return !instance.getIsAllRowsSelected() && !!Object.keys((_instance$getState$ro = instance.getState().rowSelection) != null ? _instance$getState$ro : {}).length;
      },
      getIsSomePageRowsSelected: () => {
        const paginationFlatRows = instance.getPaginationRowModel().flatRows;
        return instance.getIsAllPageRowsSelected() ? false : !!(paginationFlatRows != null && paginationFlatRows.length);
      },
      getToggleAllRowsSelectedHandler: () => {
        return e => {
          instance.toggleAllRowsSelected(e.target.checked);
        };
      },
      getToggleAllPageRowsSelectedHandler: () => {
        return e => {
          instance.toggleAllPageRowsSelected(e.target.checked);
        };
      }
    };
  },
  createRow: (row, instance) => {
    return {
      toggleSelected: value => {
        const isSelected = row.getIsSelected();
        instance.setRowSelection(old => {
          value = typeof value !== 'undefined' ? value : !isSelected;

          if (isSelected === value) {
            return old;
          }

          const selectedRowIds = { ...old
          };
          mutateRowIsSelected(selectedRowIds, row.id, value, instance);
          return selectedRowIds;
        });
      },
      getIsSelected: () => {
        const {
          rowSelection
        } = instance.getState();
        return isRowSelected(row, rowSelection) === true;
      },
      getIsSomeSelected: () => {
        const {
          rowSelection
        } = instance.getState();
        return isRowSelected(row, rowSelection) === 'some';
      },
      getCanSelect: () => {
        var _instance$options$ena;

        if (typeof instance.options.enableRowSelection === 'function') {
          return instance.options.enableRowSelection(row);
        }

        return (_instance$options$ena = instance.options.enableRowSelection) != null ? _instance$options$ena : true;
      },
      getCanSelectSubRows: () => {
        var _instance$options$ena2;

        if (typeof instance.options.enableSubRowSelection === 'function') {
          return instance.options.enableSubRowSelection(row);
        }

        return (_instance$options$ena2 = instance.options.enableSubRowSelection) != null ? _instance$options$ena2 : true;
      },
      getCanMultiSelect: () => {
        var _instance$options$ena3;

        if (typeof instance.options.enableMultiRowSelection === 'function') {
          return instance.options.enableMultiRowSelection(row);
        }

        return (_instance$options$ena3 = instance.options.enableMultiRowSelection) != null ? _instance$options$ena3 : true;
      },
      getToggleSelectedHandler: () => {
        const canSelect = row.getCanSelect();
        return e => {
          var _target;

          if (!canSelect) return;
          row.toggleSelected((_target = e.target) == null ? void 0 : _target.checked);
        };
      }
    };
  }
};

const mutateRowIsSelected = (selectedRowIds, id, value, instance) => {
  var _row$subRows;

  const row = instance.getRow(id);
  row.getIsGrouped(); // if ( // TODO: enforce grouping row selection rules
  //   !isGrouped ||
  //   (isGrouped && instance.options.enableGroupingRowSelection)
  // ) {

  if (value) {
    selectedRowIds[id] = true;
  } else {
    delete selectedRowIds[id];
  } // }


  if ((_row$subRows = row.subRows) != null && _row$subRows.length && row.getCanSelectSubRows()) {
    row.subRows.forEach(row => mutateRowIsSelected(selectedRowIds, row.id, value, instance));
  }
};

function selectRowsFn(instance, rowModel) {
  const rowSelection = instance.getState().rowSelection;
  const newSelectedFlatRows = [];
  const newSelectedRowsById = {}; // Filters top level and nested rows

  const recurseRows = function (rows, depth) {
    if (depth === void 0) {
      depth = 0;
    }

    return rows.map(row => {
      var _row$subRows2;

      const isSelected = isRowSelected(row, rowSelection) === true;

      if (isSelected) {
        newSelectedFlatRows.push(row);
        newSelectedRowsById[row.id] = row;
      }

      if ((_row$subRows2 = row.subRows) != null && _row$subRows2.length) {
        row = { ...row,
          subRows: recurseRows(row.subRows, depth + 1)
        };
      }

      if (isSelected) {
        return row;
      }
    }).filter(Boolean);
  };

  return {
    rows: recurseRows(rowModel.rows),
    flatRows: newSelectedFlatRows,
    rowsById: newSelectedRowsById
  };
}
function isRowSelected(row, selection, instance) {
  if (selection[row.id]) {
    return true;
  }

  if (row.subRows && row.subRows.length) {
    let allChildrenSelected = true;
    let someSelected = false;
    row.subRows.forEach(subRow => {
      // Bail out early if we know both of these
      if (someSelected && !allChildrenSelected) {
        return;
      }

      if (isRowSelected(subRow, selection)) {
        someSelected = true;
      } else {
        allChildrenSelected = false;
      }
    });
    return allChildrenSelected ? true : someSelected ? 'some' : false;
  }

  return false;
}

exports.RowSelection = RowSelection;
exports.isRowSelected = isRowSelected;
exports.selectRowsFn = selectRowsFn;
//# sourceMappingURL=RowSelection.js.map
