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
const defaultPageIndex = 0;
const defaultPageSize = 10;

const getDefaultPaginationState = () => ({
  pageIndex: defaultPageIndex,
  pageSize: defaultPageSize
});

const Pagination = {
  getInitialState: state => {
    return { ...state,
      pagination: { ...getDefaultPaginationState(),
        ...(state == null ? void 0 : state.pagination)
      }
    };
  },
  getDefaultOptions: table => {
    return {
      onPaginationChange: utils.makeStateUpdater('pagination', table)
    };
  },
  createTable: table => {
    let registered = false;
    let queued = false;
    return {
      _autoResetPageIndex: () => {
        if (!registered) {
          table._queue(() => {
            registered = true;
          });

          return;
        }

        if (table.options.autoResetAll ?? table.options.autoResetPageIndex ?? !table.options.manualPagination) {
          if (queued) return;
          queued = true;

          table._queue(() => {
            table.resetPageIndex();
            queued = false;
          });
        }
      },
      setPagination: updater => {
        const safeUpdater = old => {
          let newState = utils.functionalUpdate(updater, old);
          return newState;
        };

        return table.options.onPaginationChange == null ? void 0 : table.options.onPaginationChange(safeUpdater);
      },
      resetPagination: defaultState => {
        table.setPagination(defaultState ? getDefaultPaginationState() : table.initialState.pagination ?? getDefaultPaginationState());
      },
      setPageIndex: updater => {
        table.setPagination(old => {
          let pageIndex = utils.functionalUpdate(updater, old.pageIndex);
          const maxPageIndex = typeof table.options.pageCount === 'undefined' || table.options.pageCount === -1 ? Number.MAX_SAFE_INTEGER : table.options.pageCount - 1;
          pageIndex = Math.min(Math.max(0, pageIndex), maxPageIndex);
          return { ...old,
            pageIndex
          };
        });
      },
      resetPageIndex: defaultState => {
        var _table$initialState, _table$initialState$p;

        table.setPageIndex(defaultState ? defaultPageIndex : ((_table$initialState = table.initialState) == null ? void 0 : (_table$initialState$p = _table$initialState.pagination) == null ? void 0 : _table$initialState$p.pageIndex) ?? defaultPageIndex);
      },
      resetPageSize: defaultState => {
        var _table$initialState2, _table$initialState2$;

        table.setPageSize(defaultState ? defaultPageSize : ((_table$initialState2 = table.initialState) == null ? void 0 : (_table$initialState2$ = _table$initialState2.pagination) == null ? void 0 : _table$initialState2$.pageSize) ?? defaultPageSize);
      },
      setPageSize: updater => {
        table.setPagination(old => {
          const pageSize = Math.max(1, utils.functionalUpdate(updater, old.pageSize));
          const topRowIndex = old.pageSize * old.pageIndex;
          const pageIndex = Math.floor(topRowIndex / pageSize);
          return { ...old,
            pageIndex,
            pageSize
          };
        });
      },
      setPageCount: updater => table.setPagination(old => {
        let newPageCount = utils.functionalUpdate(updater, table.options.pageCount ?? -1);

        if (typeof newPageCount === 'number') {
          newPageCount = Math.max(-1, newPageCount);
        }

        return { ...old,
          pageCount: newPageCount
        };
      }),
      getPageOptions: utils.memo(() => [table.getPageCount()], pageCount => {
        let pageOptions = [];

        if (pageCount && pageCount > 0) {
          pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i);
        }

        return pageOptions;
      }, {
        key: process.env.NODE_ENV === 'development' && 'getPageOptions',
        debug: () => table.options.debugAll ?? table.options.debugTable
      }),
      getCanPreviousPage: () => table.getState().pagination.pageIndex > 0,
      getCanNextPage: () => {
        const {
          pageIndex
        } = table.getState().pagination;
        const pageCount = table.getPageCount();

        if (pageCount === -1) {
          return true;
        }

        if (pageCount === 0) {
          return false;
        }

        return pageIndex < pageCount - 1;
      },
      previousPage: () => {
        return table.setPageIndex(old => old - 1);
      },
      nextPage: () => {
        return table.setPageIndex(old => {
          return old + 1;
        });
      },
      getPrePaginationRowModel: () => table.getExpandedRowModel(),
      getPaginationRowModel: () => {
        if (!table._getPaginationRowModel && table.options.getPaginationRowModel) {
          table._getPaginationRowModel = table.options.getPaginationRowModel(table);
        }

        if (table.options.manualPagination || !table._getPaginationRowModel) {
          return table.getPrePaginationRowModel();
        }

        return table._getPaginationRowModel();
      },
      getPageCount: () => {
        return table.options.pageCount ?? Math.ceil(table.getPrePaginationRowModel().rows.length / table.getState().pagination.pageSize);
      }
    };
  }
};

exports.Pagination = Pagination;
//# sourceMappingURL=Pagination.js.map
