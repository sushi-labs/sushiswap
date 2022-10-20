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
  getDefaultOptions: instance => {
    return {
      onPaginationChange: utils.makeStateUpdater('pagination', instance)
    };
  },
  createInstance: instance => {
    let registered = false;
    let queued = false;
    return {
      _autoResetPageIndex: () => {
        var _ref, _instance$options$aut;

        if (!registered) {
          instance._queue(() => {
            registered = true;
          });

          return;
        }

        if ((_ref = (_instance$options$aut = instance.options.autoResetAll) != null ? _instance$options$aut : instance.options.autoResetPageIndex) != null ? _ref : !instance.options.manualPagination) {
          if (queued) return;
          queued = true;

          instance._queue(() => {
            instance.resetPageIndex();
            queued = false;
          });
        }
      },
      setPagination: updater => {
        const safeUpdater = old => {
          let newState = utils.functionalUpdate(updater, old);
          return newState;
        };

        return instance.options.onPaginationChange == null ? void 0 : instance.options.onPaginationChange(safeUpdater);
      },
      resetPagination: defaultState => {
        var _instance$initialStat;

        instance.setPagination(defaultState ? getDefaultPaginationState() : (_instance$initialStat = instance.initialState.pagination) != null ? _instance$initialStat : getDefaultPaginationState());
      },
      setPageIndex: updater => {
        instance.setPagination(old => {
          let pageIndex = utils.functionalUpdate(updater, old.pageIndex);
          const maxPageIndex = typeof old.pageCount !== 'undefined' ? old.pageCount - 1 : Number.MAX_SAFE_INTEGER;
          pageIndex = Math.min(Math.max(0, pageIndex), maxPageIndex);
          return { ...old,
            pageIndex
          };
        });
      },
      resetPageIndex: defaultState => {
        var _instance$initialStat2, _instance$initialStat3, _instance$initialStat4;

        instance.setPageIndex(defaultState ? defaultPageIndex : (_instance$initialStat2 = (_instance$initialStat3 = instance.initialState) == null ? void 0 : (_instance$initialStat4 = _instance$initialStat3.pagination) == null ? void 0 : _instance$initialStat4.pageIndex) != null ? _instance$initialStat2 : defaultPageIndex);
      },
      resetPageSize: defaultState => {
        var _instance$initialStat5, _instance$initialStat6, _instance$initialStat7;

        instance.setPageSize(defaultState ? defaultPageSize : (_instance$initialStat5 = (_instance$initialStat6 = instance.initialState) == null ? void 0 : (_instance$initialStat7 = _instance$initialStat6.pagination) == null ? void 0 : _instance$initialStat7.pageSize) != null ? _instance$initialStat5 : defaultPageSize);
      },
      setPageSize: updater => {
        instance.setPagination(old => {
          const pageSize = Math.max(1, utils.functionalUpdate(updater, old.pageSize));
          const topRowIndex = old.pageSize * old.pageIndex;
          const pageIndex = Math.floor(topRowIndex / pageSize);
          return { ...old,
            pageIndex,
            pageSize
          };
        });
      },
      setPageCount: updater => instance.setPagination(old => {
        var _old$pageCount;

        let newPageCount = utils.functionalUpdate(updater, (_old$pageCount = old.pageCount) != null ? _old$pageCount : -1);

        if (typeof newPageCount === 'number') {
          newPageCount = Math.max(-1, newPageCount);
        }

        return { ...old,
          pageCount: newPageCount
        };
      }),
      getPageOptions: utils.memo(() => [instance.getState().pagination.pageSize, instance.getState().pagination.pageCount], (pageSize, pageCount) => {
        let pageOptions = [];

        if (pageCount && pageCount > 0) {
          pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i);
        }

        return pageOptions;
      }, {
        key: process.env.NODE_ENV === 'development' && 'getPageOptions',
        debug: () => {
          var _instance$options$deb;

          return (_instance$options$deb = instance.options.debugAll) != null ? _instance$options$deb : instance.options.debugTable;
        }
      }),
      getCanPreviousPage: () => instance.getState().pagination.pageIndex > 0,
      getCanNextPage: () => {
        const {
          pageIndex
        } = instance.getState().pagination;
        const pageCount = instance.getPageCount();

        if (pageCount === -1) {
          return true;
        }

        if (pageCount === 0) {
          return false;
        }

        return pageIndex < pageCount - 1;
      },
      previousPage: () => {
        return instance.setPageIndex(old => old - 1);
      },
      nextPage: () => {
        return instance.setPageIndex(old => {
          return old + 1;
        });
      },
      getPrePaginationRowModel: () => instance.getExpandedRowModel(),
      getPaginationRowModel: () => {
        if (!instance._getPaginationRowModel && instance.options.getPaginationRowModel) {
          instance._getPaginationRowModel = instance.options.getPaginationRowModel(instance);
        }

        if (instance.options.manualPagination || !instance._getPaginationRowModel) {
          return instance.getPrePaginationRowModel();
        }

        return instance._getPaginationRowModel();
      },
      getPageCount: () => {
        const {
          pageCount
        } = instance.getState().pagination;

        if (typeof pageCount !== 'undefined') {
          return pageCount;
        }

        return Math.ceil(instance.getPrePaginationRowModel().rows.length / instance.getState().pagination.pageSize);
      }
    };
  }
};

exports.Pagination = Pagination;
//# sourceMappingURL=Pagination.js.map
