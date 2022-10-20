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
  getDefaultOptions: table => {
    return {
      onRowSelectionChange: utils.makeStateUpdater('rowSelection', table),
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableSubRowSelection: true // enableGroupingRowSelection: false,
      // isAdditiveSelectEvent: (e: unknown) => !!e.metaKey,
      // isInclusiveSelectEvent: (e: unknown) => !!e.shiftKey,

    };
  },
  createTable: table => {
    return {
      setRowSelection: updater => table.options.onRowSelectionChange == null ? void 0 : table.options.onRowSelectionChange(updater),
      resetRowSelection: defaultState => {
        var _table$initialState$r;

        return table.setRowSelection(defaultState ? {} : (_table$initialState$r = table.initialState.rowSelection) != null ? _table$initialState$r : {});
      },
      toggleAllRowsSelected: value => {
        table.setRowSelection(old => {
          value = typeof value !== 'undefined' ? value : !table.getIsAllRowsSelected();
          const rowSelection = { ...old
          };
          const preGroupedFlatRows = table.getPreGroupedRowModel().flatRows; // We don't use `mutateRowIsSelected` here for performance reasons.
          // All of the rows are flat already, so it wouldn't be worth it

          if (value) {
            preGroupedFlatRows.forEach(row => {
              if (!row.getCanSelect()) {
                return;
              }

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
      toggleAllPageRowsSelected: value => table.setRowSelection(old => {
        const resolvedValue = typeof value !== 'undefined' ? value : !table.getIsAllPageRowsSelected();
        const rowSelection = { ...old
        };
        table.getRowModel().rows.forEach(row => {
          mutateRowIsSelected(rowSelection, row.id, resolvedValue, table);
        });
        return rowSelection;
      }),
      // addRowSelectionRange: rowId => {
      //   const {
      //     rows,
      //     rowsById,
      //     options: { selectGroupingRows, selectSubRows },
      //   } = table
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
      //   table.rows.forEach(row => {
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
      //   table.setRowSelection(selectedRowIds)
      // },
      getPreSelectedRowModel: () => table.getCoreRowModel(),
      getSelectedRowModel: utils.memo(() => [table.getState().rowSelection, table.getCoreRowModel()], (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            rows: [],
            flatRows: [],
            rowsById: {}
          };
        }

        return selectRowsFn(table, rowModel);
      }, {
        key: process.env.NODE_ENV === 'development' && 'getSelectedRowModel',
        debug: () => {
          var _table$options$debugA;

          return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugTable;
        }
      }),
      getFilteredSelectedRowModel: utils.memo(() => [table.getState().rowSelection, table.getFilteredRowModel()], (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            rows: [],
            flatRows: [],
            rowsById: {}
          };
        }

        return selectRowsFn(table, rowModel);
      }, {
        key: process.env.NODE_ENV === 'production' && 'getFilteredSelectedRowModel',
        debug: () => {
          var _table$options$debugA2;

          return (_table$options$debugA2 = table.options.debugAll) != null ? _table$options$debugA2 : table.options.debugTable;
        }
      }),
      getGroupedSelectedRowModel: utils.memo(() => [table.getState().rowSelection, table.getSortedRowModel()], (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            rows: [],
            flatRows: [],
            rowsById: {}
          };
        }

        return selectRowsFn(table, rowModel);
      }, {
        key: process.env.NODE_ENV === 'production' && 'getGroupedSelectedRowModel',
        debug: () => {
          var _table$options$debugA3;

          return (_table$options$debugA3 = table.options.debugAll) != null ? _table$options$debugA3 : table.options.debugTable;
        }
      }),
      ///
      // getGroupingRowCanSelect: rowId => {
      //   const row = table.getRow(rowId)
      //   if (!row) {
      //     throw new Error()
      //   }
      //   if (typeof table.options.enableGroupingRowSelection === 'function') {
      //     return table.options.enableGroupingRowSelection(row)
      //   }
      //   return table.options.enableGroupingRowSelection ?? false
      // },
      getIsAllRowsSelected: () => {
        const preFilteredFlatRows = table.getPreFilteredRowModel().flatRows;
        const {
          rowSelection
        } = table.getState();
        let isAllRowsSelected = Boolean(preFilteredFlatRows.length && Object.keys(rowSelection).length);

        if (isAllRowsSelected) {
          if (preFilteredFlatRows.some(row => row.getCanSelect() && !rowSelection[row.id])) {
            isAllRowsSelected = false;
          }
        }

        return isAllRowsSelected;
      },
      getIsAllPageRowsSelected: () => {
        const paginationFlatRows = table.getPaginationRowModel().flatRows;
        const {
          rowSelection
        } = table.getState();
        let isAllPageRowsSelected = !!paginationFlatRows.length;

        if (isAllPageRowsSelected && paginationFlatRows.some(row => !rowSelection[row.id])) {
          isAllPageRowsSelected = false;
        }

        return isAllPageRowsSelected;
      },
      getIsSomeRowsSelected: () => {
        var _table$getState$rowSe;

        const totalSelected = Object.keys((_table$getState$rowSe = table.getState().rowSelection) != null ? _table$getState$rowSe : {}).length;
        return totalSelected > 0 && totalSelected < table.getCoreRowModel().flatRows.length;
      },
      getIsSomePageRowsSelected: () => {
        const paginationFlatRows = table.getPaginationRowModel().flatRows;
        return table.getIsAllPageRowsSelected() ? false : paginationFlatRows.some(d => d.getIsSelected() || d.getIsSomeSelected());
      },
      getToggleAllRowsSelectedHandler: () => {
        return e => {
          table.toggleAllRowsSelected(e.target.checked);
        };
      },
      getToggleAllPageRowsSelectedHandler: () => {
        return e => {
          table.toggleAllPageRowsSelected(e.target.checked);
        };
      }
    };
  },
  createRow: (row, table) => {
    return {
      toggleSelected: value => {
        const isSelected = row.getIsSelected();
        table.setRowSelection(old => {
          value = typeof value !== 'undefined' ? value : !isSelected;

          if (isSelected === value) {
            return old;
          }

          const selectedRowIds = { ...old
          };
          mutateRowIsSelected(selectedRowIds, row.id, value, table);
          return selectedRowIds;
        });
      },
      getIsSelected: () => {
        const {
          rowSelection
        } = table.getState();
        return isRowSelected(row, rowSelection);
      },
      getIsSomeSelected: () => {
        const {
          rowSelection
        } = table.getState();
        return isSubRowSelected(row, rowSelection) === 'some';
      },
      getIsAllSubRowsSelected: () => {
        const {
          rowSelection
        } = table.getState();
        return isSubRowSelected(row, rowSelection) === 'all';
      },
      getCanSelect: () => {
        var _table$options$enable;

        if (typeof table.options.enableRowSelection === 'function') {
          return table.options.enableRowSelection(row);
        }

        return (_table$options$enable = table.options.enableRowSelection) != null ? _table$options$enable : true;
      },
      getCanSelectSubRows: () => {
        var _table$options$enable2;

        if (typeof table.options.enableSubRowSelection === 'function') {
          return table.options.enableSubRowSelection(row);
        }

        return (_table$options$enable2 = table.options.enableSubRowSelection) != null ? _table$options$enable2 : true;
      },
      getCanMultiSelect: () => {
        var _table$options$enable3;

        if (typeof table.options.enableMultiRowSelection === 'function') {
          return table.options.enableMultiRowSelection(row);
        }

        return (_table$options$enable3 = table.options.enableMultiRowSelection) != null ? _table$options$enable3 : true;
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

const mutateRowIsSelected = (selectedRowIds, id, value, table) => {
  var _row$subRows;

  const row = table.getRow(id); // const isGrouped = row.getIsGrouped()
  // if ( // TODO: enforce grouping row selection rules
  //   !isGrouped ||
  //   (isGrouped && table.options.enableGroupingRowSelection)
  // ) {

  if (value) {
    if (!row.getCanMultiSelect()) {
      Object.keys(selectedRowIds).forEach(key => delete selectedRowIds[key]);
    }

    if (row.getCanSelect()) {
      selectedRowIds[id] = true;
    }
  } else {
    delete selectedRowIds[id];
  } // }


  if ((_row$subRows = row.subRows) != null && _row$subRows.length && row.getCanSelectSubRows()) {
    row.subRows.forEach(row => mutateRowIsSelected(selectedRowIds, row.id, value, table));
  }
};

function selectRowsFn(table, rowModel) {
  const rowSelection = table.getState().rowSelection;
  const newSelectedFlatRows = [];
  const newSelectedRowsById = {}; // Filters top level and nested rows

  const recurseRows = function (rows, depth) {

    return rows.map(row => {
      var _row$subRows2;

      const isSelected = isRowSelected(row, rowSelection);

      if (isSelected) {
        newSelectedFlatRows.push(row);
        newSelectedRowsById[row.id] = row;
      }

      if ((_row$subRows2 = row.subRows) != null && _row$subRows2.length) {
        row = { ...row,
          subRows: recurseRows(row.subRows)
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
function isRowSelected(row, selection) {
  var _selection$row$id;

  return (_selection$row$id = selection[row.id]) != null ? _selection$row$id : false;
}
function isSubRowSelected(row, selection, table) {
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
    return allChildrenSelected ? 'all' : someSelected ? 'some' : false;
  }

  return false;
}

exports.RowSelection = RowSelection;
exports.isRowSelected = isRowSelected;
exports.isSubRowSelected = isSubRowSelected;
exports.selectRowsFn = selectRowsFn;
//# sourceMappingURL=RowSelection.js.map
