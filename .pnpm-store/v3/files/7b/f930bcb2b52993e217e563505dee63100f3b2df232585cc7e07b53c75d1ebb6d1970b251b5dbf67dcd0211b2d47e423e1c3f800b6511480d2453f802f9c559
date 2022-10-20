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
function createHeader(instance, column, options) {
  var _options$id;

  const id = (_options$id = options.id) != null ? _options$id : column.id;
  let header = {
    id,
    column,
    index: options.index,
    isPlaceholder: !!options.isPlaceholder,
    placeholderId: options.placeholderId,
    depth: options.depth,
    subHeaders: [],
    colSpan: 0,
    rowSpan: 0,
    headerGroup: null,
    getLeafHeaders: () => {
      const leafHeaders = [];

      const recurseHeader = h => {
        if (h.subHeaders && h.subHeaders.length) {
          h.subHeaders.map(recurseHeader);
        }

        leafHeaders.push(h);
      };

      recurseHeader(header);
      return leafHeaders;
    },
    renderHeader: () => column.columnDef.header ? instance._render(column.columnDef.header, {
      instance,
      header: header,
      column
    }) : null,
    renderFooter: () => column.columnDef.footer ? instance._render(column.columnDef.footer, {
      instance,
      header: header,
      column
    }) : null
  };

  instance._features.forEach(feature => {
    Object.assign(header, feature.createHeader == null ? void 0 : feature.createHeader(header, instance));
  });

  return header;
}

const Headers = {
  createInstance: instance => {
    return {
      // Header Groups
      getHeaderGroups: utils.memo(() => [instance.getAllColumns(), instance.getVisibleLeafColumns(), instance.getState().columnPinning.left, instance.getState().columnPinning.right], (allColumns, leafColumns, left, right) => {
        var _left$map$filter, _right$map$filter;

        const leftColumns = (_left$map$filter = left == null ? void 0 : left.map(columnId => leafColumns.find(d => d.id === columnId)).filter(Boolean)) != null ? _left$map$filter : [];
        const rightColumns = (_right$map$filter = right == null ? void 0 : right.map(columnId => leafColumns.find(d => d.id === columnId)).filter(Boolean)) != null ? _right$map$filter : [];
        const centerColumns = leafColumns.filter(column => !(left != null && left.includes(column.id)) && !(right != null && right.includes(column.id)));
        const headerGroups = buildHeaderGroups(allColumns, [...leftColumns, ...centerColumns, ...rightColumns], instance);
        return headerGroups;
      }, {
        key: process.env.NODE_ENV === 'development' && 'getHeaderGroups',
        debug: () => {
          var _instance$options$deb;

          return (_instance$options$deb = instance.options.debugAll) != null ? _instance$options$deb : instance.options.debugHeaders;
        }
      }),
      getCenterHeaderGroups: utils.memo(() => [instance.getAllColumns(), instance.getVisibleLeafColumns(), instance.getState().columnPinning.left, instance.getState().columnPinning.right], (allColumns, leafColumns, left, right) => {
        leafColumns = leafColumns.filter(column => !(left != null && left.includes(column.id)) && !(right != null && right.includes(column.id)));
        return buildHeaderGroups(allColumns, leafColumns, instance, 'center');
      }, {
        key: process.env.NODE_ENV === 'development' && 'getCenterHeaderGroups',
        debug: () => {
          var _instance$options$deb2;

          return (_instance$options$deb2 = instance.options.debugAll) != null ? _instance$options$deb2 : instance.options.debugHeaders;
        }
      }),
      getLeftHeaderGroups: utils.memo(() => [instance.getAllColumns(), instance.getVisibleLeafColumns(), instance.getState().columnPinning.left], (allColumns, leafColumns, left) => {
        var _left$map$filter2;

        const orderedLeafColumns = (_left$map$filter2 = left == null ? void 0 : left.map(columnId => leafColumns.find(d => d.id === columnId)).filter(Boolean)) != null ? _left$map$filter2 : [];
        return buildHeaderGroups(allColumns, orderedLeafColumns, instance, 'left');
      }, {
        key: process.env.NODE_ENV === 'development' && 'getLeftHeaderGroups',
        debug: () => {
          var _instance$options$deb3;

          return (_instance$options$deb3 = instance.options.debugAll) != null ? _instance$options$deb3 : instance.options.debugHeaders;
        }
      }),
      getRightHeaderGroups: utils.memo(() => [instance.getAllColumns(), instance.getVisibleLeafColumns(), instance.getState().columnPinning.right], (allColumns, leafColumns, right) => {
        var _right$map$filter2;

        const orderedLeafColumns = (_right$map$filter2 = right == null ? void 0 : right.map(columnId => leafColumns.find(d => d.id === columnId)).filter(Boolean)) != null ? _right$map$filter2 : [];
        return buildHeaderGroups(allColumns, orderedLeafColumns, instance, 'right');
      }, {
        key: process.env.NODE_ENV === 'development' && 'getRightHeaderGroups',
        debug: () => {
          var _instance$options$deb4;

          return (_instance$options$deb4 = instance.options.debugAll) != null ? _instance$options$deb4 : instance.options.debugHeaders;
        }
      }),
      // Footer Groups
      getFooterGroups: utils.memo(() => [instance.getHeaderGroups()], headerGroups => {
        return [...headerGroups].reverse();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getFooterGroups',
        debug: () => {
          var _instance$options$deb5;

          return (_instance$options$deb5 = instance.options.debugAll) != null ? _instance$options$deb5 : instance.options.debugHeaders;
        }
      }),
      getLeftFooterGroups: utils.memo(() => [instance.getLeftHeaderGroups()], headerGroups => {
        return [...headerGroups].reverse();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getLeftFooterGroups',
        debug: () => {
          var _instance$options$deb6;

          return (_instance$options$deb6 = instance.options.debugAll) != null ? _instance$options$deb6 : instance.options.debugHeaders;
        }
      }),
      getCenterFooterGroups: utils.memo(() => [instance.getCenterHeaderGroups()], headerGroups => {
        return [...headerGroups].reverse();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getCenterFooterGroups',
        debug: () => {
          var _instance$options$deb7;

          return (_instance$options$deb7 = instance.options.debugAll) != null ? _instance$options$deb7 : instance.options.debugHeaders;
        }
      }),
      getRightFooterGroups: utils.memo(() => [instance.getRightHeaderGroups()], headerGroups => {
        return [...headerGroups].reverse();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getRightFooterGroups',
        debug: () => {
          var _instance$options$deb8;

          return (_instance$options$deb8 = instance.options.debugAll) != null ? _instance$options$deb8 : instance.options.debugHeaders;
        }
      }),
      // Flat Headers
      getFlatHeaders: utils.memo(() => [instance.getHeaderGroups()], headerGroups => {
        return headerGroups.map(headerGroup => {
          return headerGroup.headers;
        }).flat();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getFlatHeaders',
        debug: () => {
          var _instance$options$deb9;

          return (_instance$options$deb9 = instance.options.debugAll) != null ? _instance$options$deb9 : instance.options.debugHeaders;
        }
      }),
      getLeftFlatHeaders: utils.memo(() => [instance.getLeftHeaderGroups()], left => {
        return left.map(headerGroup => {
          return headerGroup.headers;
        }).flat();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getLeftFlatHeaders',
        debug: () => {
          var _instance$options$deb10;

          return (_instance$options$deb10 = instance.options.debugAll) != null ? _instance$options$deb10 : instance.options.debugHeaders;
        }
      }),
      getCenterFlatHeaders: utils.memo(() => [instance.getCenterHeaderGroups()], left => {
        return left.map(headerGroup => {
          return headerGroup.headers;
        }).flat();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getCenterFlatHeaders',
        debug: () => {
          var _instance$options$deb11;

          return (_instance$options$deb11 = instance.options.debugAll) != null ? _instance$options$deb11 : instance.options.debugHeaders;
        }
      }),
      getRightFlatHeaders: utils.memo(() => [instance.getRightHeaderGroups()], left => {
        return left.map(headerGroup => {
          return headerGroup.headers;
        }).flat();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getRightFlatHeaders',
        debug: () => {
          var _instance$options$deb12;

          return (_instance$options$deb12 = instance.options.debugAll) != null ? _instance$options$deb12 : instance.options.debugHeaders;
        }
      }),
      // Leaf Headers
      getCenterLeafHeaders: utils.memo(() => [instance.getCenterFlatHeaders()], flatHeaders => {
        return flatHeaders.filter(header => {
          var _header$subHeaders;

          return !((_header$subHeaders = header.subHeaders) != null && _header$subHeaders.length);
        });
      }, {
        key: process.env.NODE_ENV === 'development' && 'getCenterLeafHeaders',
        debug: () => {
          var _instance$options$deb13;

          return (_instance$options$deb13 = instance.options.debugAll) != null ? _instance$options$deb13 : instance.options.debugHeaders;
        }
      }),
      getLeftLeafHeaders: utils.memo(() => [instance.getLeftFlatHeaders()], flatHeaders => {
        return flatHeaders.filter(header => {
          var _header$subHeaders2;

          return !((_header$subHeaders2 = header.subHeaders) != null && _header$subHeaders2.length);
        });
      }, {
        key: process.env.NODE_ENV === 'development' && 'getLeftLeafHeaders',
        debug: () => {
          var _instance$options$deb14;

          return (_instance$options$deb14 = instance.options.debugAll) != null ? _instance$options$deb14 : instance.options.debugHeaders;
        }
      }),
      getRightLeafHeaders: utils.memo(() => [instance.getRightFlatHeaders()], flatHeaders => {
        return flatHeaders.filter(header => {
          var _header$subHeaders3;

          return !((_header$subHeaders3 = header.subHeaders) != null && _header$subHeaders3.length);
        });
      }, {
        key: process.env.NODE_ENV === 'development' && 'getRightLeafHeaders',
        debug: () => {
          var _instance$options$deb15;

          return (_instance$options$deb15 = instance.options.debugAll) != null ? _instance$options$deb15 : instance.options.debugHeaders;
        }
      }),
      getLeafHeaders: utils.memo(() => [instance.getLeftHeaderGroups(), instance.getCenterHeaderGroups(), instance.getRightHeaderGroups()], (left, center, right) => {
        var _left$0$headers, _left$, _center$0$headers, _center$, _right$0$headers, _right$;

        return [...((_left$0$headers = (_left$ = left[0]) == null ? void 0 : _left$.headers) != null ? _left$0$headers : []), ...((_center$0$headers = (_center$ = center[0]) == null ? void 0 : _center$.headers) != null ? _center$0$headers : []), ...((_right$0$headers = (_right$ = right[0]) == null ? void 0 : _right$.headers) != null ? _right$0$headers : [])].map(header => {
          return header.getLeafHeaders();
        }).flat();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getLeafHeaders',
        debug: () => {
          var _instance$options$deb16;

          return (_instance$options$deb16 = instance.options.debugAll) != null ? _instance$options$deb16 : instance.options.debugHeaders;
        }
      })
    };
  }
};
function buildHeaderGroups(allColumns, columnsToGroup, instance, headerFamily) {
  var _headerGroups$0$heade, _headerGroups$;

  // Find the max depth of the columns:
  // build the leaf column row
  // build each buffer row going up
  //    placeholder for non-existent level
  //    real column for existing level
  let maxDepth = 0;

  const findMaxDepth = function (columns, depth) {
    if (depth === void 0) {
      depth = 1;
    }

    maxDepth = Math.max(maxDepth, depth);
    columns.filter(column => column.getIsVisible()).forEach(column => {
      var _column$columns;

      if ((_column$columns = column.columns) != null && _column$columns.length) {
        findMaxDepth(column.columns, depth + 1);
      }
    }, 0);
  };

  findMaxDepth(allColumns);
  let headerGroups = [];

  const createHeaderGroup = (headersToGroup, depth) => {
    // The header group we are creating
    const headerGroup = {
      depth,
      id: [headerFamily, "" + depth].filter(Boolean).join('_'),
      headers: []
    }; // The parent columns we're going to scan next

    const pendingParentHeaders = []; // Scan each column for parents

    headersToGroup.forEach(headerToGroup => {
      // What is the latest (last) parent column?
      const latestPendingParentHeader = [...pendingParentHeaders].reverse()[0];
      const isLeafHeader = headerToGroup.column.depth === headerGroup.depth;
      let column;
      let isPlaceholder = false;

      if (isLeafHeader && headerToGroup.column.parent) {
        // The parent header is new
        column = headerToGroup.column.parent;
      } else {
        // The parent header is repeated
        column = headerToGroup.column;
        isPlaceholder = true;
      }

      if ((latestPendingParentHeader == null ? void 0 : latestPendingParentHeader.column) === column) {
        // This column is repeated. Add it as a sub header to the next batch
        latestPendingParentHeader.subHeaders.push(headerToGroup);
      } else {
        // This is a new header. Let's create it
        const header = createHeader(instance, column, {
          id: [headerFamily, depth, column.id, headerToGroup == null ? void 0 : headerToGroup.id].filter(Boolean).join('_'),
          isPlaceholder,
          placeholderId: isPlaceholder ? "" + pendingParentHeaders.filter(d => d.column === column).length : undefined,
          depth,
          index: pendingParentHeaders.length
        }); // Add the headerToGroup as a subHeader of the new header

        header.subHeaders.push(headerToGroup); // Add the new header to the pendingParentHeaders to get grouped
        // in the next batch

        pendingParentHeaders.push(header);
      }

      headerGroup.headers.push(headerToGroup);
      headerToGroup.headerGroup = headerGroup;
    });
    headerGroups.push(headerGroup);

    if (depth > 0) {
      createHeaderGroup(pendingParentHeaders, depth - 1);
    }
  };

  const bottomHeaders = columnsToGroup.map((column, index) => createHeader(instance, column, {
    depth: maxDepth,
    index
  }));
  createHeaderGroup(bottomHeaders, maxDepth - 1);
  headerGroups.reverse(); // headerGroups = headerGroups.filter(headerGroup => {
  //   return !headerGroup.headers.every(header => header.isPlaceholder)
  // })

  const recurseHeadersForSpans = headers => {
    const filteredHeaders = headers.filter(header => header.column.getIsVisible());
    return filteredHeaders.map(header => {
      let colSpan = 0;
      let rowSpan = 0;
      let childRowSpans = [0];

      if (header.subHeaders && header.subHeaders.length) {
        childRowSpans = [];
        recurseHeadersForSpans(header.subHeaders).forEach(_ref => {
          let {
            colSpan: childColSpan,
            rowSpan: childRowSpan
          } = _ref;
          colSpan += childColSpan;
          childRowSpans.push(childRowSpan);
        });
      } else {
        colSpan = 1;
      }

      const minChildRowSpan = Math.min(...childRowSpans);
      rowSpan = rowSpan + minChildRowSpan;
      header.colSpan = colSpan;
      header.rowSpan = rowSpan;
      return {
        colSpan,
        rowSpan
      };
    });
  };

  recurseHeadersForSpans((_headerGroups$0$heade = (_headerGroups$ = headerGroups[0]) == null ? void 0 : _headerGroups$.headers) != null ? _headerGroups$0$heade : []);
  return headerGroups;
}

exports.Headers = Headers;
exports.buildHeaderGroups = buildHeaderGroups;
//# sourceMappingURL=headers.js.map
