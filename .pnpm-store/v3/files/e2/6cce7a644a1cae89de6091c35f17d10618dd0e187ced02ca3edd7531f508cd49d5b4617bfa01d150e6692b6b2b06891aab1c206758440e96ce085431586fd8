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
function createHeader(table, column, options) {
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
    getContext: () => ({
      table,
      header: header,
      column
    })
  };

  table._features.forEach(feature => {
    Object.assign(header, feature.createHeader == null ? void 0 : feature.createHeader(header, table));
  });

  return header;
}

const Headers = {
  createTable: table => {
    return {
      // Header Groups
      getHeaderGroups: utils.memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allColumns, leafColumns, left, right) => {
        var _left$map$filter, _right$map$filter;

        const leftColumns = (_left$map$filter = left == null ? void 0 : left.map(columnId => leafColumns.find(d => d.id === columnId)).filter(Boolean)) != null ? _left$map$filter : [];
        const rightColumns = (_right$map$filter = right == null ? void 0 : right.map(columnId => leafColumns.find(d => d.id === columnId)).filter(Boolean)) != null ? _right$map$filter : [];
        const centerColumns = leafColumns.filter(column => !(left != null && left.includes(column.id)) && !(right != null && right.includes(column.id)));
        const headerGroups = buildHeaderGroups(allColumns, [...leftColumns, ...centerColumns, ...rightColumns], table);
        return headerGroups;
      }, {
        key: process.env.NODE_ENV === 'development' && 'getHeaderGroups',
        debug: () => {
          var _table$options$debugA;

          return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugHeaders;
        }
      }),
      getCenterHeaderGroups: utils.memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allColumns, leafColumns, left, right) => {
        leafColumns = leafColumns.filter(column => !(left != null && left.includes(column.id)) && !(right != null && right.includes(column.id)));
        return buildHeaderGroups(allColumns, leafColumns, table, 'center');
      }, {
        key: process.env.NODE_ENV === 'development' && 'getCenterHeaderGroups',
        debug: () => {
          var _table$options$debugA2;

          return (_table$options$debugA2 = table.options.debugAll) != null ? _table$options$debugA2 : table.options.debugHeaders;
        }
      }),
      getLeftHeaderGroups: utils.memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.left], (allColumns, leafColumns, left) => {
        var _left$map$filter2;

        const orderedLeafColumns = (_left$map$filter2 = left == null ? void 0 : left.map(columnId => leafColumns.find(d => d.id === columnId)).filter(Boolean)) != null ? _left$map$filter2 : [];
        return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'left');
      }, {
        key: process.env.NODE_ENV === 'development' && 'getLeftHeaderGroups',
        debug: () => {
          var _table$options$debugA3;

          return (_table$options$debugA3 = table.options.debugAll) != null ? _table$options$debugA3 : table.options.debugHeaders;
        }
      }),
      getRightHeaderGroups: utils.memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.right], (allColumns, leafColumns, right) => {
        var _right$map$filter2;

        const orderedLeafColumns = (_right$map$filter2 = right == null ? void 0 : right.map(columnId => leafColumns.find(d => d.id === columnId)).filter(Boolean)) != null ? _right$map$filter2 : [];
        return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'right');
      }, {
        key: process.env.NODE_ENV === 'development' && 'getRightHeaderGroups',
        debug: () => {
          var _table$options$debugA4;

          return (_table$options$debugA4 = table.options.debugAll) != null ? _table$options$debugA4 : table.options.debugHeaders;
        }
      }),
      // Footer Groups
      getFooterGroups: utils.memo(() => [table.getHeaderGroups()], headerGroups => {
        return [...headerGroups].reverse();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getFooterGroups',
        debug: () => {
          var _table$options$debugA5;

          return (_table$options$debugA5 = table.options.debugAll) != null ? _table$options$debugA5 : table.options.debugHeaders;
        }
      }),
      getLeftFooterGroups: utils.memo(() => [table.getLeftHeaderGroups()], headerGroups => {
        return [...headerGroups].reverse();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getLeftFooterGroups',
        debug: () => {
          var _table$options$debugA6;

          return (_table$options$debugA6 = table.options.debugAll) != null ? _table$options$debugA6 : table.options.debugHeaders;
        }
      }),
      getCenterFooterGroups: utils.memo(() => [table.getCenterHeaderGroups()], headerGroups => {
        return [...headerGroups].reverse();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getCenterFooterGroups',
        debug: () => {
          var _table$options$debugA7;

          return (_table$options$debugA7 = table.options.debugAll) != null ? _table$options$debugA7 : table.options.debugHeaders;
        }
      }),
      getRightFooterGroups: utils.memo(() => [table.getRightHeaderGroups()], headerGroups => {
        return [...headerGroups].reverse();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getRightFooterGroups',
        debug: () => {
          var _table$options$debugA8;

          return (_table$options$debugA8 = table.options.debugAll) != null ? _table$options$debugA8 : table.options.debugHeaders;
        }
      }),
      // Flat Headers
      getFlatHeaders: utils.memo(() => [table.getHeaderGroups()], headerGroups => {
        return headerGroups.map(headerGroup => {
          return headerGroup.headers;
        }).flat();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getFlatHeaders',
        debug: () => {
          var _table$options$debugA9;

          return (_table$options$debugA9 = table.options.debugAll) != null ? _table$options$debugA9 : table.options.debugHeaders;
        }
      }),
      getLeftFlatHeaders: utils.memo(() => [table.getLeftHeaderGroups()], left => {
        return left.map(headerGroup => {
          return headerGroup.headers;
        }).flat();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getLeftFlatHeaders',
        debug: () => {
          var _table$options$debugA10;

          return (_table$options$debugA10 = table.options.debugAll) != null ? _table$options$debugA10 : table.options.debugHeaders;
        }
      }),
      getCenterFlatHeaders: utils.memo(() => [table.getCenterHeaderGroups()], left => {
        return left.map(headerGroup => {
          return headerGroup.headers;
        }).flat();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getCenterFlatHeaders',
        debug: () => {
          var _table$options$debugA11;

          return (_table$options$debugA11 = table.options.debugAll) != null ? _table$options$debugA11 : table.options.debugHeaders;
        }
      }),
      getRightFlatHeaders: utils.memo(() => [table.getRightHeaderGroups()], left => {
        return left.map(headerGroup => {
          return headerGroup.headers;
        }).flat();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getRightFlatHeaders',
        debug: () => {
          var _table$options$debugA12;

          return (_table$options$debugA12 = table.options.debugAll) != null ? _table$options$debugA12 : table.options.debugHeaders;
        }
      }),
      // Leaf Headers
      getCenterLeafHeaders: utils.memo(() => [table.getCenterFlatHeaders()], flatHeaders => {
        return flatHeaders.filter(header => {
          var _header$subHeaders;

          return !((_header$subHeaders = header.subHeaders) != null && _header$subHeaders.length);
        });
      }, {
        key: process.env.NODE_ENV === 'development' && 'getCenterLeafHeaders',
        debug: () => {
          var _table$options$debugA13;

          return (_table$options$debugA13 = table.options.debugAll) != null ? _table$options$debugA13 : table.options.debugHeaders;
        }
      }),
      getLeftLeafHeaders: utils.memo(() => [table.getLeftFlatHeaders()], flatHeaders => {
        return flatHeaders.filter(header => {
          var _header$subHeaders2;

          return !((_header$subHeaders2 = header.subHeaders) != null && _header$subHeaders2.length);
        });
      }, {
        key: process.env.NODE_ENV === 'development' && 'getLeftLeafHeaders',
        debug: () => {
          var _table$options$debugA14;

          return (_table$options$debugA14 = table.options.debugAll) != null ? _table$options$debugA14 : table.options.debugHeaders;
        }
      }),
      getRightLeafHeaders: utils.memo(() => [table.getRightFlatHeaders()], flatHeaders => {
        return flatHeaders.filter(header => {
          var _header$subHeaders3;

          return !((_header$subHeaders3 = header.subHeaders) != null && _header$subHeaders3.length);
        });
      }, {
        key: process.env.NODE_ENV === 'development' && 'getRightLeafHeaders',
        debug: () => {
          var _table$options$debugA15;

          return (_table$options$debugA15 = table.options.debugAll) != null ? _table$options$debugA15 : table.options.debugHeaders;
        }
      }),
      getLeafHeaders: utils.memo(() => [table.getLeftHeaderGroups(), table.getCenterHeaderGroups(), table.getRightHeaderGroups()], (left, center, right) => {
        var _left$0$headers, _left$, _center$0$headers, _center$, _right$0$headers, _right$;

        return [...((_left$0$headers = (_left$ = left[0]) == null ? void 0 : _left$.headers) != null ? _left$0$headers : []), ...((_center$0$headers = (_center$ = center[0]) == null ? void 0 : _center$.headers) != null ? _center$0$headers : []), ...((_right$0$headers = (_right$ = right[0]) == null ? void 0 : _right$.headers) != null ? _right$0$headers : [])].map(header => {
          return header.getLeafHeaders();
        }).flat();
      }, {
        key: process.env.NODE_ENV === 'development' && 'getLeafHeaders',
        debug: () => {
          var _table$options$debugA16;

          return (_table$options$debugA16 = table.options.debugAll) != null ? _table$options$debugA16 : table.options.debugHeaders;
        }
      })
    };
  }
};
function buildHeaderGroups(allColumns, columnsToGroup, table, headerFamily) {
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

      if (latestPendingParentHeader && (latestPendingParentHeader == null ? void 0 : latestPendingParentHeader.column) === column) {
        // This column is repeated. Add it as a sub header to the next batch
        latestPendingParentHeader.subHeaders.push(headerToGroup);
      } else {
        // This is a new header. Let's create it
        const header = createHeader(table, column, {
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

  const bottomHeaders = columnsToGroup.map((column, index) => createHeader(table, column, {
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
