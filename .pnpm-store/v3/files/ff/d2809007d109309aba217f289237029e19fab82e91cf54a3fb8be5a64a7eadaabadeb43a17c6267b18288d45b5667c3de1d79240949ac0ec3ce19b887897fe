/**
 * react-table
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

var React = require('react');
var index = require('../../table-core/build/esm/index.js');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

//
function flexRender(Comp, props) {
  return !Comp ? null : isReactComponent(Comp) ? /*#__PURE__*/React__namespace.createElement(Comp, props) : Comp;
}

function isReactComponent(component) {
  return isClassComponent(component) || typeof component === 'function' || isExoticComponent(component);
}

function isClassComponent(component) {
  return typeof component === 'function' && (() => {
    const proto = Object.getPrototypeOf(component);
    return proto.prototype && proto.prototype.isReactComponent;
  })();
}

function isExoticComponent(component) {
  return typeof component === 'object' && typeof component.$$typeof === 'symbol' && ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description);
}

function useReactTable(options) {
  // Compose in the generic options to the user options
  const resolvedOptions = {
    state: {},
    // Dummy state
    onStateChange: () => {},
    // noop
    renderFallbackValue: null,
    ...options
  }; // Create a new table and store it in state

  const [tableRef] = React__namespace.useState(() => ({
    current: index.createTable(resolvedOptions)
  })); // By default, manage table state here using the table's initial state

  const [state, setState] = React__namespace.useState(() => tableRef.current.initialState); // Compose the default state above with any user state. This will allow the user
  // to only control a subset of the state if desired.

  tableRef.current.setOptions(prev => ({ ...prev,
    ...options,
    state: { ...state,
      ...options.state
    },
    // Similarly, we'll maintain both our internal state and any user-provided
    // state.
    onStateChange: updater => {
      setState(updater);
      options.onStateChange == null ? void 0 : options.onStateChange(updater);
    }
  }));
  return tableRef.current;
}

exports.ColumnSizing = index.ColumnSizing;
exports.Expanding = index.Expanding;
exports.Filters = index.Filters;
exports.Grouping = index.Grouping;
exports.Headers = index.Headers;
exports.Ordering = index.Ordering;
exports.Pagination = index.Pagination;
exports.Pinning = index.Pinning;
exports.RowSelection = index.RowSelection;
exports.Sorting = index.Sorting;
exports.Visibility = index.Visibility;
exports.aggregationFns = index.aggregationFns;
exports.buildHeaderGroups = index.buildHeaderGroups;
exports.createCell = index.createCell;
exports.createColumn = index.createColumn;
exports.createColumnHelper = index.createColumnHelper;
exports.createRow = index.createRow;
exports.createTable = index.createTable;
exports.defaultColumnSizing = index.defaultColumnSizing;
exports.expandRows = index.expandRows;
exports.filterFns = index.filterFns;
exports.flattenBy = index.flattenBy;
exports.functionalUpdate = index.functionalUpdate;
exports.getCoreRowModel = index.getCoreRowModel;
exports.getExpandedRowModel = index.getExpandedRowModel;
exports.getFacetedMinMaxValues = index.getFacetedMinMaxValues;
exports.getFacetedRowModel = index.getFacetedRowModel;
exports.getFacetedUniqueValues = index.getFacetedUniqueValues;
exports.getFilteredRowModel = index.getFilteredRowModel;
exports.getGroupedRowModel = index.getGroupedRowModel;
exports.getPaginationRowModel = index.getPaginationRowModel;
exports.getSortedRowModel = index.getSortedRowModel;
exports.isFunction = index.isFunction;
exports.isRowSelected = index.isRowSelected;
exports.isSubRowSelected = index.isSubRowSelected;
exports.makeStateUpdater = index.makeStateUpdater;
exports.memo = index.memo;
exports.noop = index.noop;
exports.orderColumns = index.orderColumns;
exports.passiveEventSupported = index.passiveEventSupported;
exports.reSplitAlphaNumeric = index.reSplitAlphaNumeric;
exports.selectRowsFn = index.selectRowsFn;
exports.shouldAutoRemoveFilter = index.shouldAutoRemoveFilter;
exports.sortingFns = index.sortingFns;
exports.flexRender = flexRender;
exports.useReactTable = useReactTable;
//# sourceMappingURL=index.js.map
