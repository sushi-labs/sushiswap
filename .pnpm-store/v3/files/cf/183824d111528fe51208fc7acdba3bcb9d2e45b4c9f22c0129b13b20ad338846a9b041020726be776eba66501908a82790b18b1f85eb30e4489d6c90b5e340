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
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TableCore = {}));
})(this, (function (exports) { 'use strict';

  // Is this type a tuple?
  // If this type is a tuple, what indices are allowed?
  ///
  function functionalUpdate(updater, input) {
    return typeof updater === 'function' ? updater(input) : updater;
  }
  function noop() {//
  }
  function makeStateUpdater(key, instance) {
    return updater => {
      instance.setState(old => {
        return { ...old,
          [key]: functionalUpdate(updater, old[key])
        };
      });
    };
  }
  function isFunction(d) {
    return d instanceof Function;
  }
  function flattenBy(arr, getChildren) {
    const flat = [];

    const recurse = subArr => {
      subArr.forEach(item => {
        flat.push(item);
        const children = getChildren(item);

        if (children != null && children.length) {
          recurse(children);
        }
      });
    };

    recurse(arr);
    return flat;
  }
  function memo(getDeps, fn, opts) {
    let deps = [];
    let result;
    return () => {
      let depTime;
      if (opts.key && opts.debug) depTime = Date.now();
      const newDeps = getDeps();
      const depsChanged = newDeps.length !== deps.length || newDeps.some((dep, index) => deps[index] !== dep);

      if (!depsChanged) {
        return result;
      }

      deps = newDeps;
      let resultTime;
      if (opts.key && opts.debug) resultTime = Date.now();
      result = fn(...newDeps);
      opts == null ? void 0 : opts.onChange == null ? void 0 : opts.onChange(result);

      if (opts.key && opts.debug) {
        if (opts != null && opts.debug()) {
          const depEndTime = Math.round((Date.now() - depTime) * 100) / 100;
          const resultEndTime = Math.round((Date.now() - resultTime) * 100) / 100;
          const resultFpsPercentage = resultEndTime / 16;

          const pad = (str, num) => {
            str = String(str);

            while (str.length < num) {
              str = ' ' + str;
            }

            return str;
          };

          console.info(`%c⏱ ${pad(resultEndTime, 5)} /${pad(depEndTime, 5)} ms`, `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0, Math.min(120 - 120 * resultFpsPercentage, 120))}deg 100% 31%);`, opts == null ? void 0 : opts.key);
        }
      }

      return result;
    };
  }

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
      {
        throw new Error(resolvedColumnDef.accessorFn ? `Columns require an id when using an accessorFn` : `Columns require an id when using a non-string header`);
      }
    }

    let column = {
      id: `${String(id)}`,
      accessorFn,
      parent: parent,
      depth,
      columnDef: resolvedColumnDef,
      columns: [],
      getFlatColumns: memo(() => [true], () => {
        var _column$columns;

        return [column, ...((_column$columns = column.columns) == null ? void 0 : _column$columns.flatMap(d => d.getFlatColumns()))];
      }, {
        key: "development" === 'production' ,
        debug: () => table.options.debugAll ?? table.options.debugColumns
      }),
      getLeafColumns: memo(() => [table._getOrderColumnsFn()], orderColumns => {
        var _column$columns2;

        if ((_column$columns2 = column.columns) != null && _column$columns2.length) {
          let leafColumns = column.columns.flatMap(column => column.getLeafColumns());
          return orderColumns(leafColumns);
        }

        return [column];
      }, {
        key: "development" === 'production' ,
        debug: () => table.options.debugAll ?? table.options.debugColumns
      })
    };
    column = table._features.reduce((obj, feature) => {
      return Object.assign(obj, feature.createColumn == null ? void 0 : feature.createColumn(column, table));
    }, column); // Yes, we have to convert table to uknown, because we know more than the compiler here.

    return column;
  }

  //
  function createHeader(table, column, options) {
    const id = options.id ?? column.id;
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
        getHeaderGroups: memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allColumns, leafColumns, left, right) => {
          const leftColumns = (left == null ? void 0 : left.map(columnId => leafColumns.find(d => d.id === columnId)).filter(Boolean)) ?? [];
          const rightColumns = (right == null ? void 0 : right.map(columnId => leafColumns.find(d => d.id === columnId)).filter(Boolean)) ?? [];
          const centerColumns = leafColumns.filter(column => !(left != null && left.includes(column.id)) && !(right != null && right.includes(column.id)));
          const headerGroups = buildHeaderGroups(allColumns, [...leftColumns, ...centerColumns, ...rightColumns], table);
          return headerGroups;
        }, {
          key: 'getHeaderGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        }),
        getCenterHeaderGroups: memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allColumns, leafColumns, left, right) => {
          leafColumns = leafColumns.filter(column => !(left != null && left.includes(column.id)) && !(right != null && right.includes(column.id)));
          return buildHeaderGroups(allColumns, leafColumns, table, 'center');
        }, {
          key: 'getCenterHeaderGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        }),
        getLeftHeaderGroups: memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.left], (allColumns, leafColumns, left) => {
          const orderedLeafColumns = (left == null ? void 0 : left.map(columnId => leafColumns.find(d => d.id === columnId)).filter(Boolean)) ?? [];
          return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'left');
        }, {
          key: 'getLeftHeaderGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        }),
        getRightHeaderGroups: memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.right], (allColumns, leafColumns, right) => {
          const orderedLeafColumns = (right == null ? void 0 : right.map(columnId => leafColumns.find(d => d.id === columnId)).filter(Boolean)) ?? [];
          return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'right');
        }, {
          key: 'getRightHeaderGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        }),
        // Footer Groups
        getFooterGroups: memo(() => [table.getHeaderGroups()], headerGroups => {
          return [...headerGroups].reverse();
        }, {
          key: 'getFooterGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        }),
        getLeftFooterGroups: memo(() => [table.getLeftHeaderGroups()], headerGroups => {
          return [...headerGroups].reverse();
        }, {
          key: 'getLeftFooterGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        }),
        getCenterFooterGroups: memo(() => [table.getCenterHeaderGroups()], headerGroups => {
          return [...headerGroups].reverse();
        }, {
          key: 'getCenterFooterGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        }),
        getRightFooterGroups: memo(() => [table.getRightHeaderGroups()], headerGroups => {
          return [...headerGroups].reverse();
        }, {
          key: 'getRightFooterGroups',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        }),
        // Flat Headers
        getFlatHeaders: memo(() => [table.getHeaderGroups()], headerGroups => {
          return headerGroups.map(headerGroup => {
            return headerGroup.headers;
          }).flat();
        }, {
          key: 'getFlatHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        }),
        getLeftFlatHeaders: memo(() => [table.getLeftHeaderGroups()], left => {
          return left.map(headerGroup => {
            return headerGroup.headers;
          }).flat();
        }, {
          key: 'getLeftFlatHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        }),
        getCenterFlatHeaders: memo(() => [table.getCenterHeaderGroups()], left => {
          return left.map(headerGroup => {
            return headerGroup.headers;
          }).flat();
        }, {
          key: 'getCenterFlatHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        }),
        getRightFlatHeaders: memo(() => [table.getRightHeaderGroups()], left => {
          return left.map(headerGroup => {
            return headerGroup.headers;
          }).flat();
        }, {
          key: 'getRightFlatHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        }),
        // Leaf Headers
        getCenterLeafHeaders: memo(() => [table.getCenterFlatHeaders()], flatHeaders => {
          return flatHeaders.filter(header => {
            var _header$subHeaders;

            return !((_header$subHeaders = header.subHeaders) != null && _header$subHeaders.length);
          });
        }, {
          key: 'getCenterLeafHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        }),
        getLeftLeafHeaders: memo(() => [table.getLeftFlatHeaders()], flatHeaders => {
          return flatHeaders.filter(header => {
            var _header$subHeaders2;

            return !((_header$subHeaders2 = header.subHeaders) != null && _header$subHeaders2.length);
          });
        }, {
          key: 'getLeftLeafHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        }),
        getRightLeafHeaders: memo(() => [table.getRightFlatHeaders()], flatHeaders => {
          return flatHeaders.filter(header => {
            var _header$subHeaders3;

            return !((_header$subHeaders3 = header.subHeaders) != null && _header$subHeaders3.length);
          });
        }, {
          key: 'getRightLeafHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        }),
        getLeafHeaders: memo(() => [table.getLeftHeaderGroups(), table.getCenterHeaderGroups(), table.getRightHeaderGroups()], (left, center, right) => {
          var _left$, _center$, _right$;

          return [...(((_left$ = left[0]) == null ? void 0 : _left$.headers) ?? []), ...(((_center$ = center[0]) == null ? void 0 : _center$.headers) ?? []), ...(((_right$ = right[0]) == null ? void 0 : _right$.headers) ?? [])].map(header => {
            return header.getLeafHeaders();
          }).flat();
        }, {
          key: 'getLeafHeaders',
          debug: () => table.options.debugAll ?? table.options.debugHeaders
        })
      };
    }
  };
  function buildHeaderGroups(allColumns, columnsToGroup, table, headerFamily) {
    var _headerGroups$;

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
        id: [headerFamily, `${depth}`].filter(Boolean).join('_'),
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
            placeholderId: isPlaceholder ? `${pendingParentHeaders.filter(d => d.column === column).length}` : undefined,
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

    recurseHeadersForSpans(((_headerGroups$ = headerGroups[0]) == null ? void 0 : _headerGroups$.headers) ?? []);
    return headerGroups;
  }

  //
  const defaultColumnSizing = {
    size: 150,
    minSize: 20,
    maxSize: Number.MAX_SAFE_INTEGER
  };

  const getDefaultColumnSizingInfoState = () => ({
    startOffset: null,
    startSize: null,
    deltaOffset: null,
    deltaPercentage: null,
    isResizingColumn: false,
    columnSizingStart: []
  });

  const ColumnSizing = {
    getDefaultColumnDef: () => {
      return defaultColumnSizing;
    },
    getInitialState: state => {
      return {
        columnSizing: {},
        columnSizingInfo: getDefaultColumnSizingInfoState(),
        ...state
      };
    },
    getDefaultOptions: table => {
      return {
        columnResizeMode: 'onEnd',
        onColumnSizingChange: makeStateUpdater('columnSizing', table),
        onColumnSizingInfoChange: makeStateUpdater('columnSizingInfo', table)
      };
    },
    createColumn: (column, table) => {
      return {
        getSize: () => {
          const columnSize = table.getState().columnSizing[column.id];
          return Math.min(Math.max(column.columnDef.minSize ?? defaultColumnSizing.minSize, columnSize ?? column.columnDef.size ?? defaultColumnSizing.size), column.columnDef.maxSize ?? defaultColumnSizing.maxSize);
        },
        getStart: position => {
          const columns = !position ? table.getVisibleLeafColumns() : position === 'left' ? table.getLeftVisibleLeafColumns() : table.getRightVisibleLeafColumns();
          const index = columns.findIndex(d => d.id === column.id);

          if (index > 0) {
            const prevSiblingColumn = columns[index - 1];
            return prevSiblingColumn.getStart(position) + prevSiblingColumn.getSize();
          }

          return 0;
        },
        resetSize: () => {
          table.setColumnSizing(_ref => {
            let {
              [column.id]: _,
              ...rest
            } = _ref;
            return rest;
          });
        },
        getCanResize: () => {
          return (column.columnDef.enableResizing ?? true) && (table.options.enableColumnResizing ?? true);
        },
        getIsResizing: () => {
          return table.getState().columnSizingInfo.isResizingColumn === column.id;
        }
      };
    },
    createHeader: (header, table) => {
      return {
        getSize: () => {
          let sum = 0;

          const recurse = header => {
            if (header.subHeaders.length) {
              header.subHeaders.forEach(recurse);
            } else {
              sum += header.column.getSize() ?? 0;
            }
          };

          recurse(header);
          return sum;
        },
        getStart: () => {
          if (header.index > 0) {
            const prevSiblingHeader = header.headerGroup.headers[header.index - 1];
            return prevSiblingHeader.getStart() + prevSiblingHeader.getSize();
          }

          return 0;
        },
        getResizeHandler: () => {
          const column = table.getColumn(header.column.id);
          const canResize = column.getCanResize();
          return e => {
            if (!canResize) {
              return;
            }
            e.persist == null ? void 0 : e.persist();

            if (isTouchStartEvent(e)) {
              // lets not respond to multiple touches (e.g. 2 or 3 fingers)
              if (e.touches && e.touches.length > 1) {
                return;
              }
            }

            const startSize = header.getSize();
            const columnSizingStart = header ? header.getLeafHeaders().map(d => [d.column.id, d.column.getSize()]) : [[column.id, column.getSize()]];
            const clientX = isTouchStartEvent(e) ? Math.round(e.touches[0].clientX) : e.clientX;

            const updateOffset = (eventType, clientXPos) => {
              if (typeof clientXPos !== 'number') {
                return;
              }

              let newColumnSizing = {};
              table.setColumnSizingInfo(old => {
                const deltaOffset = clientXPos - ((old == null ? void 0 : old.startOffset) ?? 0);
                const deltaPercentage = Math.max(deltaOffset / ((old == null ? void 0 : old.startSize) ?? 0), -0.999999);
                old.columnSizingStart.forEach(_ref2 => {
                  let [columnId, headerSize] = _ref2;
                  newColumnSizing[columnId] = Math.round(Math.max(headerSize + headerSize * deltaPercentage, 0) * 100) / 100;
                });
                return { ...old,
                  deltaOffset,
                  deltaPercentage
                };
              });

              if (table.options.columnResizeMode === 'onChange' || eventType === 'end') {
                table.setColumnSizing(old => ({ ...old,
                  ...newColumnSizing
                }));
              }
            };

            const onMove = clientXPos => updateOffset('move', clientXPos);

            const onEnd = clientXPos => {
              updateOffset('end', clientXPos);
              table.setColumnSizingInfo(old => ({ ...old,
                isResizingColumn: false,
                startOffset: null,
                startSize: null,
                deltaOffset: null,
                deltaPercentage: null,
                columnSizingStart: []
              }));
            };

            const mouseEvents = {
              moveHandler: e => onMove(e.clientX),
              upHandler: e => {
                document.removeEventListener('mousemove', mouseEvents.moveHandler);
                document.removeEventListener('mouseup', mouseEvents.upHandler);
                onEnd(e.clientX);
              }
            };
            const passiveIfSupported = passiveEventSupported() ? {
              passive: false
            } : false;

            if (isTouchStartEvent(e)) ; else {
              document.addEventListener('mousemove', mouseEvents.moveHandler, passiveIfSupported);
              document.addEventListener('mouseup', mouseEvents.upHandler, passiveIfSupported);
            }

            table.setColumnSizingInfo(old => ({ ...old,
              startOffset: clientX,
              startSize,
              deltaOffset: 0,
              deltaPercentage: 0,
              columnSizingStart,
              isResizingColumn: column.id
            }));
          };
        }
      };
    },
    createTable: table => {
      return {
        setColumnSizing: updater => table.options.onColumnSizingChange == null ? void 0 : table.options.onColumnSizingChange(updater),
        setColumnSizingInfo: updater => table.options.onColumnSizingInfoChange == null ? void 0 : table.options.onColumnSizingInfoChange(updater),
        resetColumnSizing: defaultState => {
          table.setColumnSizing(defaultState ? {} : table.initialState.columnSizing ?? {});
        },
        resetHeaderSizeInfo: defaultState => {
          table.setColumnSizingInfo(defaultState ? getDefaultColumnSizingInfoState() : table.initialState.columnSizingInfo ?? getDefaultColumnSizingInfoState());
        },
        getTotalSize: () => {
          var _table$getHeaderGroup;

          return ((_table$getHeaderGroup = table.getHeaderGroups()[0]) == null ? void 0 : _table$getHeaderGroup.headers.reduce((sum, header) => {
            return sum + header.getSize();
          }, 0)) ?? 0;
        },
        getLeftTotalSize: () => {
          var _table$getLeftHeaderG;

          return ((_table$getLeftHeaderG = table.getLeftHeaderGroups()[0]) == null ? void 0 : _table$getLeftHeaderG.headers.reduce((sum, header) => {
            return sum + header.getSize();
          }, 0)) ?? 0;
        },
        getCenterTotalSize: () => {
          var _table$getCenterHeade;

          return ((_table$getCenterHeade = table.getCenterHeaderGroups()[0]) == null ? void 0 : _table$getCenterHeade.headers.reduce((sum, header) => {
            return sum + header.getSize();
          }, 0)) ?? 0;
        },
        getRightTotalSize: () => {
          var _table$getRightHeader;

          return ((_table$getRightHeader = table.getRightHeaderGroups()[0]) == null ? void 0 : _table$getRightHeader.headers.reduce((sum, header) => {
            return sum + header.getSize();
          }, 0)) ?? 0;
        }
      };
    }
  };
  let passiveSupported = null;
  function passiveEventSupported() {
    if (typeof passiveSupported === 'boolean') return passiveSupported;
    let supported = false;

    try {
      const options = {
        get passive() {
          supported = true;
          return false;
        }

      };

      const noop = () => {};

      window.addEventListener('test', noop, options);
      window.removeEventListener('test', noop);
    } catch (err) {
      supported = false;
    }

    passiveSupported = supported;
    return passiveSupported;
  }

  function isTouchStartEvent(e) {
    return e.type === 'touchstart';
  }

  //
  const Expanding = {
    getInitialState: state => {
      return {
        expanded: {},
        ...state
      };
    },
    getDefaultOptions: table => {
      return {
        onExpandedChange: makeStateUpdater('expanded', table),
        paginateExpandedRows: true
      };
    },
    createTable: table => {
      let registered = false;
      let queued = false;
      return {
        _autoResetExpanded: () => {
          if (!registered) {
            table._queue(() => {
              registered = true;
            });

            return;
          }

          if (table.options.autoResetAll ?? table.options.autoResetExpanded ?? !table.options.manualExpanding) {
            if (queued) return;
            queued = true;

            table._queue(() => {
              table.resetExpanded();
              queued = false;
            });
          }
        },
        setExpanded: updater => table.options.onExpandedChange == null ? void 0 : table.options.onExpandedChange(updater),
        toggleAllRowsExpanded: expanded => {
          if (expanded ?? !table.getIsAllRowsExpanded()) {
            table.setExpanded(true);
          } else {
            table.setExpanded({});
          }
        },
        resetExpanded: defaultState => {
          var _table$initialState;

          table.setExpanded(defaultState ? {} : ((_table$initialState = table.initialState) == null ? void 0 : _table$initialState.expanded) ?? {});
        },
        getCanSomeRowsExpand: () => {
          return table.getRowModel().flatRows.some(row => row.getCanExpand());
        },
        getToggleAllRowsExpandedHandler: () => {
          return e => {
            e.persist == null ? void 0 : e.persist();
            table.toggleAllRowsExpanded();
          };
        },
        getIsSomeRowsExpanded: () => {
          const expanded = table.getState().expanded;
          return expanded === true || Object.values(expanded).some(Boolean);
        },
        getIsAllRowsExpanded: () => {
          const expanded = table.getState().expanded; // If expanded is true, save some cycles and return true

          if (typeof expanded === 'boolean') {
            return expanded === true;
          }

          if (!Object.keys(expanded).length) {
            return false;
          } // If any row is not expanded, return false


          if (table.getRowModel().flatRows.some(row => !row.getIsExpanded())) {
            return false;
          } // They must all be expanded :shrug:


          return true;
        },
        getExpandedDepth: () => {
          let maxDepth = 0;
          const rowIds = table.getState().expanded === true ? Object.keys(table.getRowModel().rowsById) : Object.keys(table.getState().expanded);
          rowIds.forEach(id => {
            const splitId = id.split('.');
            maxDepth = Math.max(maxDepth, splitId.length);
          });
          return maxDepth;
        },
        getPreExpandedRowModel: () => table.getSortedRowModel(),
        getExpandedRowModel: () => {
          if (!table._getExpandedRowModel && table.options.getExpandedRowModel) {
            table._getExpandedRowModel = table.options.getExpandedRowModel(table);
          }

          if (table.options.manualExpanding || !table._getExpandedRowModel) {
            return table.getPreExpandedRowModel();
          }

          return table._getExpandedRowModel();
        }
      };
    },
    createRow: (row, table) => {
      return {
        toggleExpanded: expanded => {
          table.setExpanded(old => {
            const exists = old === true ? true : !!(old != null && old[row.id]);
            let oldExpanded = {};

            if (old === true) {
              Object.keys(table.getRowModel().rowsById).forEach(rowId => {
                oldExpanded[rowId] = true;
              });
            } else {
              oldExpanded = old;
            }

            expanded = expanded ?? !exists;

            if (!exists && expanded) {
              return { ...oldExpanded,
                [row.id]: true
              };
            }

            if (exists && !expanded) {
              const {
                [row.id]: _,
                ...rest
              } = oldExpanded;
              return rest;
            }

            return old;
          });
        },
        getIsExpanded: () => {
          const expanded = table.getState().expanded;
          return !!((table.options.getIsRowExpanded == null ? void 0 : table.options.getIsRowExpanded(row)) ?? (expanded === true || expanded != null && expanded[row.id]));
        },
        getCanExpand: () => {
          var _row$subRows;

          return (table.options.getRowCanExpand == null ? void 0 : table.options.getRowCanExpand(row)) ?? ((table.options.enableExpanding ?? true) && !!((_row$subRows = row.subRows) != null && _row$subRows.length));
        },
        getToggleExpandedHandler: () => {
          const canExpand = row.getCanExpand();
          return () => {
            if (!canExpand) return;
            row.toggleExpanded();
          };
        }
      };
    }
  };

  const includesString = (row, columnId, filterValue) => {
    var _row$getValue;

    const search = filterValue.toLowerCase();
    return (_row$getValue = row.getValue(columnId)) == null ? void 0 : _row$getValue.toLowerCase().includes(search);
  };

  includesString.autoRemove = val => testFalsey(val);

  const includesStringSensitive = (row, columnId, filterValue) => {
    var _row$getValue2;

    return (_row$getValue2 = row.getValue(columnId)) == null ? void 0 : _row$getValue2.includes(filterValue);
  };

  includesStringSensitive.autoRemove = val => testFalsey(val);

  const equalsString = (row, columnId, filterValue) => {
    var _row$getValue3;

    return ((_row$getValue3 = row.getValue(columnId)) == null ? void 0 : _row$getValue3.toLowerCase()) === filterValue.toLowerCase();
  };

  equalsString.autoRemove = val => testFalsey(val);

  const arrIncludes = (row, columnId, filterValue) => {
    var _row$getValue4;

    return (_row$getValue4 = row.getValue(columnId)) == null ? void 0 : _row$getValue4.includes(filterValue);
  };

  arrIncludes.autoRemove = val => testFalsey(val) || !(val != null && val.length);

  const arrIncludesAll = (row, columnId, filterValue) => {
    return !filterValue.some(val => {
      var _row$getValue5;

      return !((_row$getValue5 = row.getValue(columnId)) != null && _row$getValue5.includes(val));
    });
  };

  arrIncludesAll.autoRemove = val => testFalsey(val) || !(val != null && val.length);

  const arrIncludesSome = (row, columnId, filterValue) => {
    return filterValue.some(val => {
      var _row$getValue6;

      return (_row$getValue6 = row.getValue(columnId)) == null ? void 0 : _row$getValue6.includes(val);
    });
  };

  arrIncludesSome.autoRemove = val => testFalsey(val) || !(val != null && val.length);

  const equals = (row, columnId, filterValue) => {
    return row.getValue(columnId) === filterValue;
  };

  equals.autoRemove = val => testFalsey(val);

  const weakEquals = (row, columnId, filterValue) => {
    return row.getValue(columnId) == filterValue;
  };

  weakEquals.autoRemove = val => testFalsey(val);

  const inNumberRange = (row, columnId, filterValue) => {
    let [min, max] = filterValue;
    const rowValue = row.getValue(columnId);
    return rowValue >= min && rowValue <= max;
  };

  inNumberRange.resolveFilterValue = val => {
    let [unsafeMin, unsafeMax] = val;
    let parsedMin = typeof unsafeMin !== 'number' ? parseFloat(unsafeMin) : unsafeMin;
    let parsedMax = typeof unsafeMax !== 'number' ? parseFloat(unsafeMax) : unsafeMax;
    let min = unsafeMin === null || Number.isNaN(parsedMin) ? -Infinity : parsedMin;
    let max = unsafeMax === null || Number.isNaN(parsedMax) ? Infinity : parsedMax;

    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }

    return [min, max];
  };

  inNumberRange.autoRemove = val => testFalsey(val) || testFalsey(val[0]) && testFalsey(val[1]); // Export


  const filterFns = {
    includesString,
    includesStringSensitive,
    equalsString,
    arrIncludes,
    arrIncludesAll,
    arrIncludesSome,
    equals,
    weakEquals,
    inNumberRange
  };

  // Utils
  function testFalsey(val) {
    return val === undefined || val === null || val === '';
  }

  //
  const Filters = {
    getDefaultColumnDef: () => {
      return {
        filterFn: 'auto'
      };
    },
    getInitialState: state => {
      return {
        columnFilters: [],
        globalFilter: undefined,
        // filtersProgress: 1,
        // facetProgress: {},
        ...state
      };
    },
    getDefaultOptions: table => {
      return {
        onColumnFiltersChange: makeStateUpdater('columnFilters', table),
        onGlobalFilterChange: makeStateUpdater('globalFilter', table),
        filterFromLeafRows: false,
        globalFilterFn: 'auto',
        getColumnCanGlobalFilter: column => {
          var _table$getCoreRowMode, _table$getCoreRowMode2;

          const value = (_table$getCoreRowMode = table.getCoreRowModel().flatRows[0]) == null ? void 0 : (_table$getCoreRowMode2 = _table$getCoreRowMode._getAllCellsByColumnId()[column.id]) == null ? void 0 : _table$getCoreRowMode2.getValue();
          return typeof value === 'string' || typeof value === 'number';
        }
      };
    },
    createColumn: (column, table) => {
      return {
        getAutoFilterFn: () => {
          const firstRow = table.getCoreRowModel().flatRows[0];
          const value = firstRow == null ? void 0 : firstRow.getValue(column.id);

          if (typeof value === 'string') {
            return filterFns.includesString;
          }

          if (typeof value === 'number') {
            return filterFns.inNumberRange;
          }

          if (typeof value === 'boolean') {
            return filterFns.equals;
          }

          if (value !== null && typeof value === 'object') {
            return filterFns.equals;
          }

          if (Array.isArray(value)) {
            return filterFns.arrIncludes;
          }

          return filterFns.weakEquals;
        },
        getFilterFn: () => {
          var _table$options$filter;

          return isFunction(column.columnDef.filterFn) ? column.columnDef.filterFn : column.columnDef.filterFn === 'auto' ? column.getAutoFilterFn() : ((_table$options$filter = table.options.filterFns) == null ? void 0 : _table$options$filter[column.columnDef.filterFn]) ?? filterFns[column.columnDef.filterFn];
        },
        getCanFilter: () => {
          return (column.columnDef.enableColumnFilter ?? true) && (table.options.enableColumnFilters ?? true) && (table.options.enableFilters ?? true) && !!column.accessorFn;
        },
        getCanGlobalFilter: () => {
          return (column.columnDef.enableGlobalFilter ?? true) && (table.options.enableGlobalFilter ?? true) && (table.options.enableFilters ?? true) && ((table.options.getColumnCanGlobalFilter == null ? void 0 : table.options.getColumnCanGlobalFilter(column)) ?? true) && !!column.accessorFn;
        },
        getIsFiltered: () => column.getFilterIndex() > -1,
        getFilterValue: () => {
          var _table$getState$colum, _table$getState$colum2;

          return (_table$getState$colum = table.getState().columnFilters) == null ? void 0 : (_table$getState$colum2 = _table$getState$colum.find(d => d.id === column.id)) == null ? void 0 : _table$getState$colum2.value;
        },
        getFilterIndex: () => {
          var _table$getState$colum3;

          return ((_table$getState$colum3 = table.getState().columnFilters) == null ? void 0 : _table$getState$colum3.findIndex(d => d.id === column.id)) ?? -1;
        },
        setFilterValue: value => {
          table.setColumnFilters(old => {
            const filterFn = column.getFilterFn();
            const previousfilter = old == null ? void 0 : old.find(d => d.id === column.id);
            const newFilter = functionalUpdate(value, previousfilter ? previousfilter.value : undefined); //

            if (shouldAutoRemoveFilter(filterFn, newFilter, column)) {
              return (old == null ? void 0 : old.filter(d => d.id !== column.id)) ?? [];
            }

            const newFilterObj = {
              id: column.id,
              value: newFilter
            };

            if (previousfilter) {
              return (old == null ? void 0 : old.map(d => {
                if (d.id === column.id) {
                  return newFilterObj;
                }

                return d;
              })) ?? [];
            }

            if (old != null && old.length) {
              return [...old, newFilterObj];
            }

            return [newFilterObj];
          });
        },
        _getFacetedRowModel: table.options.getFacetedRowModel && table.options.getFacetedRowModel(table, column.id),
        getFacetedRowModel: () => {
          if (!column._getFacetedRowModel) {
            return table.getPreFilteredRowModel();
          }

          return column._getFacetedRowModel();
        },
        _getFacetedUniqueValues: table.options.getFacetedUniqueValues && table.options.getFacetedUniqueValues(table, column.id),
        getFacetedUniqueValues: () => {
          if (!column._getFacetedUniqueValues) {
            return new Map();
          }

          return column._getFacetedUniqueValues();
        },
        _getFacetedMinMaxValues: table.options.getFacetedMinMaxValues && table.options.getFacetedMinMaxValues(table, column.id),
        getFacetedMinMaxValues: () => {
          if (!column._getFacetedMinMaxValues) {
            return undefined;
          }

          return column._getFacetedMinMaxValues();
        } // () => [column.getFacetedRowModel()],
        // facetedRowModel => getRowModelMinMaxValues(facetedRowModel, column.id),

      };
    },
    createRow: (row, table) => {
      return {
        columnFilters: {},
        columnFiltersMeta: {}
      };
    },
    createTable: table => {
      return {
        getGlobalAutoFilterFn: () => {
          return filterFns.includesString;
        },
        getGlobalFilterFn: () => {
          var _table$options$filter2;

          const {
            globalFilterFn: globalFilterFn
          } = table.options;
          return isFunction(globalFilterFn) ? globalFilterFn : globalFilterFn === 'auto' ? table.getGlobalAutoFilterFn() : ((_table$options$filter2 = table.options.filterFns) == null ? void 0 : _table$options$filter2[globalFilterFn]) ?? filterFns[globalFilterFn];
        },
        setColumnFilters: updater => {
          const leafColumns = table.getAllLeafColumns();

          const updateFn = old => {
            var _functionalUpdate;

            return (_functionalUpdate = functionalUpdate(updater, old)) == null ? void 0 : _functionalUpdate.filter(filter => {
              const column = leafColumns.find(d => d.id === filter.id);

              if (column) {
                const filterFn = column.getFilterFn();

                if (shouldAutoRemoveFilter(filterFn, filter.value, column)) {
                  return false;
                }
              }

              return true;
            });
          };

          table.options.onColumnFiltersChange == null ? void 0 : table.options.onColumnFiltersChange(updateFn);
        },
        setGlobalFilter: updater => {
          table.options.onGlobalFilterChange == null ? void 0 : table.options.onGlobalFilterChange(updater);
        },
        resetGlobalFilter: defaultState => {
          table.setGlobalFilter(defaultState ? undefined : table.initialState.globalFilter);
        },
        resetColumnFilters: defaultState => {
          var _table$initialState;

          table.setColumnFilters(defaultState ? [] : ((_table$initialState = table.initialState) == null ? void 0 : _table$initialState.columnFilters) ?? []);
        },
        getPreFilteredRowModel: () => table.getCoreRowModel(),
        getFilteredRowModel: () => {
          if (!table._getFilteredRowModel && table.options.getFilteredRowModel) {
            table._getFilteredRowModel = table.options.getFilteredRowModel(table);
          }

          if (table.options.manualFiltering || !table._getFilteredRowModel) {
            return table.getPreFilteredRowModel();
          }

          return table._getFilteredRowModel();
        },
        _getGlobalFacetedRowModel: table.options.getFacetedRowModel && table.options.getFacetedRowModel(table, '__global__'),
        getGlobalFacetedRowModel: () => {
          if (table.options.manualFiltering || !table._getGlobalFacetedRowModel) {
            return table.getPreFilteredRowModel();
          }

          return table._getGlobalFacetedRowModel();
        },
        _getGlobalFacetedUniqueValues: table.options.getFacetedUniqueValues && table.options.getFacetedUniqueValues(table, '__global__'),
        getGlobalFacetedUniqueValues: () => {
          if (!table._getGlobalFacetedUniqueValues) {
            return new Map();
          }

          return table._getGlobalFacetedUniqueValues();
        },
        _getGlobalFacetedMinMaxValues: table.options.getFacetedMinMaxValues && table.options.getFacetedMinMaxValues(table, '__global__'),
        getGlobalFacetedMinMaxValues: () => {
          if (!table._getGlobalFacetedMinMaxValues) {
            return;
          }

          return table._getGlobalFacetedMinMaxValues();
        }
      };
    }
  };
  function shouldAutoRemoveFilter(filterFn, value, column) {
    return (filterFn && filterFn.autoRemove ? filterFn.autoRemove(value, column) : false) || typeof value === 'undefined' || typeof value === 'string' && !value;
  }

  const sum = (columnId, _leafRows, childRows) => {
    // It's faster to just add the aggregations together instead of
    // process leaf nodes individually
    return childRows.reduce((sum, next) => {
      const nextValue = next.getValue(columnId);
      return sum + (typeof nextValue === 'number' ? nextValue : 0);
    }, 0);
  };

  const min = (columnId, _leafRows, childRows) => {
    let min;
    childRows.forEach(row => {
      const value = row.getValue(columnId);

      if (value != null && (min > value || min === undefined && value >= value)) {
        min = value;
      }
    });
    return min;
  };

  const max = (columnId, _leafRows, childRows) => {
    let max;
    childRows.forEach(row => {
      const value = row.getValue(columnId);

      if (value != null && (max < value || max === undefined && value >= value)) {
        max = value;
      }
    });
    return max;
  };

  const extent = (columnId, _leafRows, childRows) => {
    let min;
    let max;
    childRows.forEach(row => {
      const value = row.getValue(columnId);

      if (value != null) {
        if (min === undefined) {
          if (value >= value) min = max = value;
        } else {
          if (min > value) min = value;
          if (max < value) max = value;
        }
      }
    });
    return [min, max];
  };

  const mean = (columnId, leafRows) => {
    let count = 0;
    let sum = 0;
    leafRows.forEach(row => {
      let value = row.getValue(columnId);

      if (value != null && (value = +value) >= value) {
        ++count, sum += value;
      }
    });
    if (count) return sum / count;
    return;
  };

  const median = (columnId, leafRows) => {
    if (!leafRows.length) {
      return;
    }

    let min = 0;
    let max = 0;
    leafRows.forEach(row => {
      let value = row.getValue(columnId);

      if (typeof value === 'number') {
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    });
    return (min + max) / 2;
  };

  const unique = (columnId, leafRows) => {
    return Array.from(new Set(leafRows.map(d => d.getValue(columnId))).values());
  };

  const uniqueCount = (columnId, leafRows) => {
    return new Set(leafRows.map(d => d.getValue(columnId))).size;
  };

  const count = (_columnId, leafRows) => {
    return leafRows.length;
  };

  const aggregationFns = {
    sum,
    min,
    max,
    extent,
    mean,
    median,
    unique,
    uniqueCount,
    count
  };

  //
  const Grouping = {
    getDefaultColumnDef: () => {
      return {
        aggregatedCell: props => {
          var _props$getValue;

          return ((_props$getValue = props.getValue()) == null ? void 0 : _props$getValue.toString == null ? void 0 : _props$getValue.toString()) ?? null;
        },
        aggregationFn: 'auto'
      };
    },
    getInitialState: state => {
      return {
        grouping: [],
        ...state
      };
    },
    getDefaultOptions: table => {
      return {
        onGroupingChange: makeStateUpdater('grouping', table),
        groupedColumnMode: 'reorder'
      };
    },
    createColumn: (column, table) => {
      return {
        toggleGrouping: () => {
          table.setGrouping(old => {
            // Find any existing grouping for this column
            if (old != null && old.includes(column.id)) {
              return old.filter(d => d !== column.id);
            }

            return [...(old ?? []), column.id];
          });
        },
        getCanGroup: () => {
          return column.columnDef.enableGrouping ?? true ?? table.options.enableGrouping ?? true ?? !!column.accessorFn;
        },
        getIsGrouped: () => {
          var _table$getState$group;

          return (_table$getState$group = table.getState().grouping) == null ? void 0 : _table$getState$group.includes(column.id);
        },
        getGroupedIndex: () => {
          var _table$getState$group2;

          return (_table$getState$group2 = table.getState().grouping) == null ? void 0 : _table$getState$group2.indexOf(column.id);
        },
        getToggleGroupingHandler: () => {
          const canGroup = column.getCanGroup();
          return () => {
            if (!canGroup) return;
            column.toggleGrouping();
          };
        },
        getAutoAggregationFn: () => {
          const firstRow = table.getCoreRowModel().flatRows[0];
          const value = firstRow == null ? void 0 : firstRow.getValue(column.id);

          if (typeof value === 'number') {
            return aggregationFns.sum;
          }

          if (Object.prototype.toString.call(value) === '[object Date]') {
            return aggregationFns.extent;
          }
        },
        getAggregationFn: () => {
          var _table$options$aggreg;

          if (!column) {
            throw new Error();
          }

          return isFunction(column.columnDef.aggregationFn) ? column.columnDef.aggregationFn : column.columnDef.aggregationFn === 'auto' ? column.getAutoAggregationFn() : ((_table$options$aggreg = table.options.aggregationFns) == null ? void 0 : _table$options$aggreg[column.columnDef.aggregationFn]) ?? aggregationFns[column.columnDef.aggregationFn];
        }
      };
    },
    createTable: table => {
      return {
        setGrouping: updater => table.options.onGroupingChange == null ? void 0 : table.options.onGroupingChange(updater),
        resetGrouping: defaultState => {
          var _table$initialState;

          table.setGrouping(defaultState ? [] : ((_table$initialState = table.initialState) == null ? void 0 : _table$initialState.grouping) ?? []);
        },
        getPreGroupedRowModel: () => table.getFilteredRowModel(),
        getGroupedRowModel: () => {
          if (!table._getGroupedRowModel && table.options.getGroupedRowModel) {
            table._getGroupedRowModel = table.options.getGroupedRowModel(table);
          }

          if (table.options.manualGrouping || !table._getGroupedRowModel) {
            return table.getPreGroupedRowModel();
          }

          return table._getGroupedRowModel();
        }
      };
    },
    createRow: row => {
      return {
        getIsGrouped: () => !!row.groupingColumnId,
        _groupingValuesCache: {}
      };
    },
    createCell: (cell, column, row, table) => {

      return {
        getIsGrouped: () => column.getIsGrouped() && column.id === row.groupingColumnId,
        getIsPlaceholder: () => !cell.getIsGrouped() && column.getIsGrouped(),
        getIsAggregated: () => {
          var _row$subRows;

          return !cell.getIsGrouped() && !cell.getIsPlaceholder() && !!((_row$subRows = row.subRows) != null && _row$subRows.length);
        }
      };
    }
  };
  function orderColumns(leafColumns, grouping, groupedColumnMode) {
    if (!(grouping != null && grouping.length) || !groupedColumnMode) {
      return leafColumns;
    }

    const nonGroupingColumns = leafColumns.filter(col => !grouping.includes(col.id));

    if (groupedColumnMode === 'remove') {
      return nonGroupingColumns;
    }

    const groupingColumns = grouping.map(g => leafColumns.find(col => col.id === g)).filter(Boolean);
    return [...groupingColumns, ...nonGroupingColumns];
  }

  //
  const Ordering = {
    getInitialState: state => {
      return {
        columnOrder: [],
        ...state
      };
    },
    getDefaultOptions: table => {
      return {
        onColumnOrderChange: makeStateUpdater('columnOrder', table)
      };
    },
    createTable: table => {
      return {
        setColumnOrder: updater => table.options.onColumnOrderChange == null ? void 0 : table.options.onColumnOrderChange(updater),
        resetColumnOrder: defaultState => {
          table.setColumnOrder(defaultState ? [] : table.initialState.columnOrder ?? []);
        },
        _getOrderColumnsFn: memo(() => [table.getState().columnOrder, table.getState().grouping, table.options.groupedColumnMode], (columnOrder, grouping, groupedColumnMode) => columns => {
          // Sort grouped columns to the start of the column list
          // before the headers are built
          let orderedColumns = []; // If there is no order, return the normal columns

          if (!(columnOrder != null && columnOrder.length)) {
            orderedColumns = columns;
          } else {
            const columnOrderCopy = [...columnOrder]; // If there is an order, make a copy of the columns

            const columnsCopy = [...columns]; // And make a new ordered array of the columns
            // Loop over the columns and place them in order into the new array

            while (columnsCopy.length && columnOrderCopy.length) {
              const targetColumnId = columnOrderCopy.shift();
              const foundIndex = columnsCopy.findIndex(d => d.id === targetColumnId);

              if (foundIndex > -1) {
                orderedColumns.push(columnsCopy.splice(foundIndex, 1)[0]);
              }
            } // If there are any columns left, add them to the end


            orderedColumns = [...orderedColumns, ...columnsCopy];
          }

          return orderColumns(orderedColumns, grouping, groupedColumnMode);
        }, {
          key: 'getOrderColumnsFn' // debug: () => table.options.debugAll ?? table.options.debugTable,

        })
      };
    }
  };

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
        onPaginationChange: makeStateUpdater('pagination', table)
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
            let newState = functionalUpdate(updater, old);
            return newState;
          };

          return table.options.onPaginationChange == null ? void 0 : table.options.onPaginationChange(safeUpdater);
        },
        resetPagination: defaultState => {
          table.setPagination(defaultState ? getDefaultPaginationState() : table.initialState.pagination ?? getDefaultPaginationState());
        },
        setPageIndex: updater => {
          table.setPagination(old => {
            let pageIndex = functionalUpdate(updater, old.pageIndex);
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
            const pageSize = Math.max(1, functionalUpdate(updater, old.pageSize));
            const topRowIndex = old.pageSize * old.pageIndex;
            const pageIndex = Math.floor(topRowIndex / pageSize);
            return { ...old,
              pageIndex,
              pageSize
            };
          });
        },
        setPageCount: updater => table.setPagination(old => {
          let newPageCount = functionalUpdate(updater, table.options.pageCount ?? -1);

          if (typeof newPageCount === 'number') {
            newPageCount = Math.max(-1, newPageCount);
          }

          return { ...old,
            pageCount: newPageCount
          };
        }),
        getPageOptions: memo(() => [table.getPageCount()], pageCount => {
          let pageOptions = [];

          if (pageCount && pageCount > 0) {
            pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i);
          }

          return pageOptions;
        }, {
          key: 'getPageOptions',
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

  //
  const getDefaultPinningState = () => ({
    left: [],
    right: []
  });

  const Pinning = {
    getInitialState: state => {
      return {
        columnPinning: getDefaultPinningState(),
        ...state
      };
    },
    getDefaultOptions: table => {
      return {
        onColumnPinningChange: makeStateUpdater('columnPinning', table)
      };
    },
    createColumn: (column, table) => {
      return {
        pin: position => {
          const columnIds = column.getLeafColumns().map(d => d.id).filter(Boolean);
          table.setColumnPinning(old => {
            if (position === 'right') {
              return {
                left: ((old == null ? void 0 : old.left) ?? []).filter(d => !(columnIds != null && columnIds.includes(d))),
                right: [...((old == null ? void 0 : old.right) ?? []).filter(d => !(columnIds != null && columnIds.includes(d))), ...columnIds]
              };
            }

            if (position === 'left') {
              return {
                left: [...((old == null ? void 0 : old.left) ?? []).filter(d => !(columnIds != null && columnIds.includes(d))), ...columnIds],
                right: ((old == null ? void 0 : old.right) ?? []).filter(d => !(columnIds != null && columnIds.includes(d)))
              };
            }

            return {
              left: ((old == null ? void 0 : old.left) ?? []).filter(d => !(columnIds != null && columnIds.includes(d))),
              right: ((old == null ? void 0 : old.right) ?? []).filter(d => !(columnIds != null && columnIds.includes(d)))
            };
          });
        },
        getCanPin: () => {
          const leafColumns = column.getLeafColumns();
          return leafColumns.some(d => (d.columnDef.enablePinning ?? true) && (table.options.enablePinning ?? true));
        },
        getIsPinned: () => {
          const leafColumnIds = column.getLeafColumns().map(d => d.id);
          const {
            left,
            right
          } = table.getState().columnPinning;
          const isLeft = leafColumnIds.some(d => left == null ? void 0 : left.includes(d));
          const isRight = leafColumnIds.some(d => right == null ? void 0 : right.includes(d));
          return isLeft ? 'left' : isRight ? 'right' : false;
        },
        getPinnedIndex: () => {
          var _table$getState$colum, _table$getState$colum2;

          const position = column.getIsPinned();
          return position ? ((_table$getState$colum = table.getState().columnPinning) == null ? void 0 : (_table$getState$colum2 = _table$getState$colum[position]) == null ? void 0 : _table$getState$colum2.indexOf(column.id)) ?? -1 : 0;
        }
      };
    },
    createRow: (row, table) => {
      return {
        getCenterVisibleCells: memo(() => [row._getAllVisibleCells(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allCells, left, right) => {
          const leftAndRight = [...(left ?? []), ...(right ?? [])];
          return allCells.filter(d => !leftAndRight.includes(d.column.id));
        }, {
          key: "development" === 'production' ,
          debug: () => table.options.debugAll ?? table.options.debugRows
        }),
        getLeftVisibleCells: memo(() => [row._getAllVisibleCells(), table.getState().columnPinning.left,,], (allCells, left) => {
          const cells = (left ?? []).map(columnId => allCells.find(cell => cell.column.id === columnId)).filter(Boolean).map(d => ({ ...d,
            position: 'left'
          }));
          return cells;
        }, {
          key: "development" === 'production' ,
          debug: () => table.options.debugAll ?? table.options.debugRows
        }),
        getRightVisibleCells: memo(() => [row._getAllVisibleCells(), table.getState().columnPinning.right], (allCells, right) => {
          const cells = (right ?? []).map(columnId => allCells.find(cell => cell.column.id === columnId)).filter(Boolean).map(d => ({ ...d,
            position: 'right'
          }));
          return cells;
        }, {
          key: "development" === 'production' ,
          debug: () => table.options.debugAll ?? table.options.debugRows
        })
      };
    },
    createTable: table => {
      return {
        setColumnPinning: updater => table.options.onColumnPinningChange == null ? void 0 : table.options.onColumnPinningChange(updater),
        resetColumnPinning: defaultState => {
          var _table$initialState;

          return table.setColumnPinning(defaultState ? getDefaultPinningState() : ((_table$initialState = table.initialState) == null ? void 0 : _table$initialState.columnPinning) ?? getDefaultPinningState());
        },
        getIsSomeColumnsPinned: position => {
          var _pinningState$positio;

          const pinningState = table.getState().columnPinning;

          if (!position) {
            var _pinningState$left, _pinningState$right;

            return Boolean(((_pinningState$left = pinningState.left) == null ? void 0 : _pinningState$left.length) || ((_pinningState$right = pinningState.right) == null ? void 0 : _pinningState$right.length));
          }

          return Boolean((_pinningState$positio = pinningState[position]) == null ? void 0 : _pinningState$positio.length);
        },
        getLeftLeafColumns: memo(() => [table.getAllLeafColumns(), table.getState().columnPinning.left], (allColumns, left) => {
          return (left ?? []).map(columnId => allColumns.find(column => column.id === columnId)).filter(Boolean);
        }, {
          key: 'getLeftLeafColumns',
          debug: () => table.options.debugAll ?? table.options.debugColumns
        }),
        getRightLeafColumns: memo(() => [table.getAllLeafColumns(), table.getState().columnPinning.right], (allColumns, right) => {
          return (right ?? []).map(columnId => allColumns.find(column => column.id === columnId)).filter(Boolean);
        }, {
          key: 'getRightLeafColumns',
          debug: () => table.options.debugAll ?? table.options.debugColumns
        }),
        getCenterLeafColumns: memo(() => [table.getAllLeafColumns(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allColumns, left, right) => {
          const leftAndRight = [...(left ?? []), ...(right ?? [])];
          return allColumns.filter(d => !leftAndRight.includes(d.id));
        }, {
          key: 'getCenterLeafColumns',
          debug: () => table.options.debugAll ?? table.options.debugColumns
        })
      };
    }
  };

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
        onRowSelectionChange: makeStateUpdater('rowSelection', table),
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
        resetRowSelection: defaultState => table.setRowSelection(defaultState ? {} : table.initialState.rowSelection ?? {}),
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
        getSelectedRowModel: memo(() => [table.getState().rowSelection, table.getCoreRowModel()], (rowSelection, rowModel) => {
          if (!Object.keys(rowSelection).length) {
            return {
              rows: [],
              flatRows: [],
              rowsById: {}
            };
          }

          return selectRowsFn(table, rowModel);
        }, {
          key: 'getSelectedRowModel',
          debug: () => table.options.debugAll ?? table.options.debugTable
        }),
        getFilteredSelectedRowModel: memo(() => [table.getState().rowSelection, table.getFilteredRowModel()], (rowSelection, rowModel) => {
          if (!Object.keys(rowSelection).length) {
            return {
              rows: [],
              flatRows: [],
              rowsById: {}
            };
          }

          return selectRowsFn(table, rowModel);
        }, {
          key: "development" === 'production' ,
          debug: () => table.options.debugAll ?? table.options.debugTable
        }),
        getGroupedSelectedRowModel: memo(() => [table.getState().rowSelection, table.getSortedRowModel()], (rowSelection, rowModel) => {
          if (!Object.keys(rowSelection).length) {
            return {
              rows: [],
              flatRows: [],
              rowsById: {}
            };
          }

          return selectRowsFn(table, rowModel);
        }, {
          key: "development" === 'production' ,
          debug: () => table.options.debugAll ?? table.options.debugTable
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
          const preGroupedFlatRows = table.getFilteredRowModel().flatRows;
          const {
            rowSelection
          } = table.getState();
          let isAllRowsSelected = Boolean(preGroupedFlatRows.length && Object.keys(rowSelection).length);

          if (isAllRowsSelected) {
            if (preGroupedFlatRows.some(row => row.getCanSelect() && !rowSelection[row.id])) {
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
          const totalSelected = Object.keys(table.getState().rowSelection ?? {}).length;
          return totalSelected > 0 && totalSelected < table.getFilteredRowModel().flatRows.length;
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
          if (typeof table.options.enableRowSelection === 'function') {
            return table.options.enableRowSelection(row);
          }

          return table.options.enableRowSelection ?? true;
        },
        getCanSelectSubRows: () => {
          if (typeof table.options.enableSubRowSelection === 'function') {
            return table.options.enableSubRowSelection(row);
          }

          return table.options.enableSubRowSelection ?? true;
        },
        getCanMultiSelect: () => {
          if (typeof table.options.enableMultiRowSelection === 'function') {
            return table.options.enableMultiRowSelection(row);
          }

          return table.options.enableMultiRowSelection ?? true;
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
    return selection[row.id] ?? false;
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

  const reSplitAlphaNumeric = /([0-9]+)/gm;

  const alphanumeric = (rowA, rowB, columnId) => {
    return compareAlphanumeric(toString(rowA.getValue(columnId)).toLowerCase(), toString(rowB.getValue(columnId)).toLowerCase());
  };

  const alphanumericCaseSensitive = (rowA, rowB, columnId) => {
    return compareAlphanumeric(toString(rowA.getValue(columnId)), toString(rowB.getValue(columnId)));
  }; // The text filter is more basic (less numeric support)
  // but is much faster


  const text = (rowA, rowB, columnId) => {
    return compareBasic(toString(rowA.getValue(columnId)).toLowerCase(), toString(rowB.getValue(columnId)).toLowerCase());
  }; // The text filter is more basic (less numeric support)
  // but is much faster


  const textCaseSensitive = (rowA, rowB, columnId) => {
    return compareBasic(toString(rowA.getValue(columnId)), toString(rowB.getValue(columnId)));
  };

  const datetime = (rowA, rowB, columnId) => {
    const a = rowA.getValue(columnId);
    const b = rowB.getValue(columnId); // Can handle nullish values
    // Use > and < because == (and ===) doesn't work with
    // Date objects (would require calling getTime()).

    return a > b ? 1 : a < b ? -1 : 0;
  };

  const basic = (rowA, rowB, columnId) => {
    return compareBasic(rowA.getValue(columnId), rowB.getValue(columnId));
  }; // Utils


  function compareBasic(a, b) {
    return a === b ? 0 : a > b ? 1 : -1;
  }

  function toString(a) {
    if (typeof a === 'number') {
      if (isNaN(a) || a === Infinity || a === -Infinity) {
        return '';
      }

      return String(a);
    }

    if (typeof a === 'string') {
      return a;
    }

    return '';
  } // Mixed sorting is slow, but very inclusive of many edge cases.
  // It handles numbers, mixed alphanumeric combinations, and even
  // null, undefined, and Infinity


  function compareAlphanumeric(aStr, bStr) {
    // Split on number groups, but keep the delimiter
    // Then remove falsey split values
    const a = aStr.split(reSplitAlphaNumeric).filter(Boolean);
    const b = bStr.split(reSplitAlphaNumeric).filter(Boolean); // While

    while (a.length && b.length) {
      const aa = a.shift();
      const bb = b.shift();
      const an = parseInt(aa, 10);
      const bn = parseInt(bb, 10);
      const combo = [an, bn].sort(); // Both are string

      if (isNaN(combo[0])) {
        if (aa > bb) {
          return 1;
        }

        if (bb > aa) {
          return -1;
        }

        continue;
      } // One is a string, one is a number


      if (isNaN(combo[1])) {
        return isNaN(an) ? -1 : 1;
      } // Both are numbers


      if (an > bn) {
        return 1;
      }

      if (bn > an) {
        return -1;
      }
    }

    return a.length - b.length;
  } // Exports


  const sortingFns = {
    alphanumeric,
    alphanumericCaseSensitive,
    text,
    textCaseSensitive,
    datetime,
    basic
  };

  //
  const Sorting = {
    getInitialState: state => {
      return {
        sorting: [],
        ...state
      };
    },
    getDefaultColumnDef: () => {
      return {
        sortingFn: 'auto'
      };
    },
    getDefaultOptions: table => {
      return {
        onSortingChange: makeStateUpdater('sorting', table),
        isMultiSortEvent: e => {
          return e.shiftKey;
        }
      };
    },
    createColumn: (column, table) => {
      return {
        getAutoSortingFn: () => {
          const firstRows = table.getFilteredRowModel().flatRows.slice(10);
          let isString = false;

          for (const row of firstRows) {
            const value = row == null ? void 0 : row.getValue(column.id);

            if (Object.prototype.toString.call(value) === '[object Date]') {
              return sortingFns.datetime;
            }

            if (typeof value === 'string') {
              isString = true;

              if (value.split(reSplitAlphaNumeric).length > 1) {
                return sortingFns.alphanumeric;
              }
            }
          }

          if (isString) {
            return sortingFns.text;
          }

          return sortingFns.basic;
        },
        getAutoSortDir: () => {
          const firstRow = table.getFilteredRowModel().flatRows[0];
          const value = firstRow == null ? void 0 : firstRow.getValue(column.id);

          if (typeof value === 'string') {
            return 'asc';
          }

          return 'desc';
        },
        getSortingFn: () => {
          var _table$options$sortin;

          if (!column) {
            throw new Error();
          }

          return isFunction(column.columnDef.sortingFn) ? column.columnDef.sortingFn : column.columnDef.sortingFn === 'auto' ? column.getAutoSortingFn() : ((_table$options$sortin = table.options.sortingFns) == null ? void 0 : _table$options$sortin[column.columnDef.sortingFn]) ?? sortingFns[column.columnDef.sortingFn];
        },
        toggleSorting: (desc, multi) => {
          // if (column.columns.length) {
          //   column.columns.forEach((c, i) => {
          //     if (c.id) {
          //       table.toggleColumnSorting(c.id, undefined, multi || !!i)
          //     }
          //   })
          //   return
          // }
          // this needs to be outside of table.setSorting to be in sync with rerender
          const nextSortingOrder = column.getNextSortingOrder();
          const hasManualValue = typeof desc !== 'undefined' && desc !== null;
          table.setSorting(old => {
            // Find any existing sorting for this column
            const existingSorting = old == null ? void 0 : old.find(d => d.id === column.id);
            const existingIndex = old == null ? void 0 : old.findIndex(d => d.id === column.id);
            let newSorting = []; // What should we do with this sort action?

            let sortAction;
            let nextDesc = hasManualValue ? desc : nextSortingOrder === 'desc'; // Multi-mode

            if (old != null && old.length && column.getCanMultiSort() && multi) {
              if (existingSorting) {
                sortAction = 'toggle';
              } else {
                sortAction = 'add';
              }
            } else {
              // Normal mode
              if (old != null && old.length && existingIndex !== old.length - 1) {
                sortAction = 'replace';
              } else if (existingSorting) {
                sortAction = 'toggle';
              } else {
                sortAction = 'replace';
              }
            } // Handle toggle states that will remove the sorting


            if (sortAction === 'toggle') {
              // If we are "actually" toggling (not a manual set value), should we remove the sorting?
              if (!hasManualValue) {
                // Is our intention to remove?
                if (!nextSortingOrder) {
                  sortAction = 'remove';
                }
              }
            }

            if (sortAction === 'add') {
              newSorting = [...old, {
                id: column.id,
                desc: nextDesc
              }]; // Take latest n columns

              newSorting.splice(0, newSorting.length - (table.options.maxMultiSortColCount ?? Number.MAX_SAFE_INTEGER));
            } else if (sortAction === 'toggle') {
              // This flips (or sets) the
              newSorting = old.map(d => {
                if (d.id === column.id) {
                  return { ...d,
                    desc: nextDesc
                  };
                }

                return d;
              });
            } else if (sortAction === 'remove') {
              newSorting = old.filter(d => d.id !== column.id);
            } else {
              newSorting = [{
                id: column.id,
                desc: nextDesc
              }];
            }

            return newSorting;
          });
        },
        getFirstSortDir: () => {
          const sortDescFirst = column.columnDef.sortDescFirst ?? table.options.sortDescFirst ?? column.getAutoSortDir() === 'desc';
          return sortDescFirst ? 'desc' : 'asc';
        },
        getNextSortingOrder: multi => {
          const firstSortDirection = column.getFirstSortDir();
          const isSorted = column.getIsSorted();

          if (!isSorted) {
            return firstSortDirection;
          }

          if (isSorted !== firstSortDirection && (table.options.enableSortingRemoval ?? true) && ( // If enableSortRemove, enable in general
          multi ? table.options.enableMultiRemove ?? true : true) // If multi, don't allow if enableMultiRemove))
          ) {
            return false;
          }

          return isSorted === 'desc' ? 'asc' : 'desc';
        },
        getCanSort: () => {
          return (column.columnDef.enableSorting ?? true) && (table.options.enableSorting ?? true) && !!column.accessorFn;
        },
        getCanMultiSort: () => {
          return column.columnDef.enableMultiSort ?? table.options.enableMultiSort ?? !!column.accessorFn;
        },
        getIsSorted: () => {
          var _table$getState$sorti;

          const columnSort = (_table$getState$sorti = table.getState().sorting) == null ? void 0 : _table$getState$sorti.find(d => d.id === column.id);
          return !columnSort ? false : columnSort.desc ? 'desc' : 'asc';
        },
        getSortIndex: () => {
          var _table$getState$sorti2;

          return ((_table$getState$sorti2 = table.getState().sorting) == null ? void 0 : _table$getState$sorti2.findIndex(d => d.id === column.id)) ?? -1;
        },
        clearSorting: () => {
          //clear sorting for just 1 column
          table.setSorting(old => old != null && old.length ? old.filter(d => d.id !== column.id) : []);
        },
        getToggleSortingHandler: () => {
          const canSort = column.getCanSort();
          return e => {
            if (!canSort) return;
            e.persist == null ? void 0 : e.persist();
            column.toggleSorting == null ? void 0 : column.toggleSorting(undefined, column.getCanMultiSort() ? table.options.isMultiSortEvent == null ? void 0 : table.options.isMultiSortEvent(e) : false);
          };
        }
      };
    },
    createTable: table => {
      return {
        setSorting: updater => table.options.onSortingChange == null ? void 0 : table.options.onSortingChange(updater),
        resetSorting: defaultState => {
          var _table$initialState;

          table.setSorting(defaultState ? [] : ((_table$initialState = table.initialState) == null ? void 0 : _table$initialState.sorting) ?? []);
        },
        getPreSortedRowModel: () => table.getGroupedRowModel(),
        getSortedRowModel: () => {
          if (!table._getSortedRowModel && table.options.getSortedRowModel) {
            table._getSortedRowModel = table.options.getSortedRowModel(table);
          }

          if (table.options.manualSorting || !table._getSortedRowModel) {
            return table.getPreSortedRowModel();
          }

          return table._getSortedRowModel();
        }
      };
    }
  };

  //
  const Visibility = {
    getInitialState: state => {
      return {
        columnVisibility: {},
        ...state
      };
    },
    getDefaultOptions: table => {
      return {
        onColumnVisibilityChange: makeStateUpdater('columnVisibility', table)
      };
    },
    createColumn: (column, table) => {
      return {
        toggleVisibility: value => {
          if (column.getCanHide()) {
            table.setColumnVisibility(old => ({ ...old,
              [column.id]: value ?? !column.getIsVisible()
            }));
          }
        },
        getIsVisible: () => {
          var _table$getState$colum;

          return ((_table$getState$colum = table.getState().columnVisibility) == null ? void 0 : _table$getState$colum[column.id]) ?? true;
        },
        getCanHide: () => {
          return (column.columnDef.enableHiding ?? true) && (table.options.enableHiding ?? true);
        },
        getToggleVisibilityHandler: () => {
          return e => {
            column.toggleVisibility == null ? void 0 : column.toggleVisibility(e.target.checked);
          };
        }
      };
    },
    createRow: (row, table) => {
      return {
        _getAllVisibleCells: memo(() => [row.getAllCells(), table.getState().columnVisibility], cells => {
          return cells.filter(cell => cell.column.getIsVisible());
        }, {
          key: "development" === 'production' ,
          debug: () => table.options.debugAll ?? table.options.debugRows
        }),
        getVisibleCells: memo(() => [row.getLeftVisibleCells(), row.getCenterVisibleCells(), row.getRightVisibleCells()], (left, center, right) => [...left, ...center, ...right], {
          key: 'row.getVisibleCells',
          debug: () => table.options.debugAll ?? table.options.debugRows
        })
      };
    },
    createTable: table => {
      const makeVisibleColumnsMethod = (key, getColumns) => {
        return memo(() => [getColumns(), getColumns().filter(d => d.getIsVisible()).map(d => d.id).join('_')], columns => {
          return columns.filter(d => d.getIsVisible == null ? void 0 : d.getIsVisible());
        }, {
          key,
          debug: () => table.options.debugAll ?? table.options.debugColumns
        });
      };

      return {
        getVisibleFlatColumns: makeVisibleColumnsMethod('getVisibleFlatColumns', () => table.getAllFlatColumns()),
        getVisibleLeafColumns: makeVisibleColumnsMethod('getVisibleLeafColumns', () => table.getAllLeafColumns()),
        getLeftVisibleLeafColumns: makeVisibleColumnsMethod('getLeftVisibleLeafColumns', () => table.getLeftLeafColumns()),
        getRightVisibleLeafColumns: makeVisibleColumnsMethod('getRightVisibleLeafColumns', () => table.getRightLeafColumns()),
        getCenterVisibleLeafColumns: makeVisibleColumnsMethod('getCenterVisibleLeafColumns', () => table.getCenterLeafColumns()),
        setColumnVisibility: updater => table.options.onColumnVisibilityChange == null ? void 0 : table.options.onColumnVisibilityChange(updater),
        resetColumnVisibility: defaultState => {
          table.setColumnVisibility(defaultState ? {} : table.initialState.columnVisibility ?? {});
        },
        toggleAllColumnsVisible: value => {
          value = value ?? !table.getIsAllColumnsVisible();
          table.setColumnVisibility(table.getAllLeafColumns().reduce((obj, column) => ({ ...obj,
            [column.id]: !value ? !(column.getCanHide != null && column.getCanHide()) : value
          }), {}));
        },
        getIsAllColumnsVisible: () => !table.getAllLeafColumns().some(column => !(column.getIsVisible != null && column.getIsVisible())),
        getIsSomeColumnsVisible: () => table.getAllLeafColumns().some(column => column.getIsVisible == null ? void 0 : column.getIsVisible()),
        getToggleAllColumnsVisibilityHandler: () => {
          return e => {
            var _target;

            table.toggleAllColumnsVisible((_target = e.target) == null ? void 0 : _target.checked);
          };
        }
      };
    }
  };

  const features = [Headers, Visibility, Ordering, Pinning, Filters, Sorting, Grouping, Expanding, Pagination, RowSelection, ColumnSizing]; //

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
        const newOptions = functionalUpdate(updater, table.options);
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
          {
            throw new Error(`getRow expected an ID, but got ${id}`);
          }
        }

        return row;
      },
      _getDefaultColumnDef: memo(() => [table.options.defaultColumn], defaultColumn => {
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
        key: 'getDefaultColumnDef'
      }),
      _getColumnDefs: () => table.options.columns,
      getAllColumns: memo(() => [table._getColumnDefs()], columnDefs => {
        const recurseColumns = function (columnDefs, parent, depth) {
          if (depth === void 0) {
            depth = 0;
          }

          return columnDefs.map(columnDef => {
            const column = createColumn(table, columnDef, depth, parent);
            const groupingColumnDef = columnDef;
            column.columns = groupingColumnDef.columns ? recurseColumns(groupingColumnDef.columns, column, depth + 1) : [];
            return column;
          });
        };

        return recurseColumns(columnDefs);
      }, {
        key: 'getAllColumns',
        debug: () => table.options.debugAll ?? table.options.debugColumns
      }),
      getAllFlatColumns: memo(() => [table.getAllColumns()], allColumns => {
        return allColumns.flatMap(column => {
          return column.getFlatColumns();
        });
      }, {
        key: 'getAllFlatColumns',
        debug: () => table.options.debugAll ?? table.options.debugColumns
      }),
      _getAllFlatColumnsById: memo(() => [table.getAllFlatColumns()], flatColumns => {
        return flatColumns.reduce((acc, column) => {
          acc[column.id] = column;
          return acc;
        }, {});
      }, {
        key: 'getAllFlatColumnsById',
        debug: () => table.options.debugAll ?? table.options.debugColumns
      }),
      getAllLeafColumns: memo(() => [table.getAllColumns(), table._getOrderColumnsFn()], (allColumns, orderColumns) => {
        let leafColumns = allColumns.flatMap(column => column.getLeafColumns());
        return orderColumns(leafColumns);
      }, {
        key: 'getAllLeafColumns',
        debug: () => table.options.debugAll ?? table.options.debugColumns
      }),
      getColumn: columnId => {
        const column = table._getAllFlatColumnsById()[columnId];

        if (!column) {
          {
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

  function createCell(table, row, column, columnId) {
    const getRenderValue = () => cell.getValue() ?? table.options.renderFallbackValue;

    const cell = {
      id: `${row.id}_${column.id}`,
      row,
      column,
      getValue: () => row.getValue(columnId),
      renderValue: getRenderValue,
      getContext: memo(() => [table, column, row, cell], (table, column, row, cell) => ({
        table,
        column,
        row,
        cell: cell,
        getValue: cell.getValue,
        renderValue: cell.renderValue
      }), {
        key: 'cell.getContext',
        debug: () => table.options.debugAll
      })
    };

    table._features.forEach(feature => {
      Object.assign(cell, feature.createCell == null ? void 0 : feature.createCell(cell, column, row, table));
    }, {});

    return cell;
  }

  const createRow = (table, id, original, rowIndex, depth, subRows) => {
    let row = {
      id,
      index: rowIndex,
      original,
      depth,
      _valuesCache: {},
      getValue: columnId => {
        if (row._valuesCache.hasOwnProperty(columnId)) {
          return row._valuesCache[columnId];
        }

        const column = table.getColumn(columnId);

        if (!column.accessorFn) {
          return undefined;
        }

        row._valuesCache[columnId] = column.accessorFn(row.original, rowIndex);
        return row._valuesCache[columnId];
      },
      renderValue: columnId => row.getValue(columnId) ?? table.options.renderFallbackValue,
      subRows: subRows ?? [],
      getLeafRows: () => flattenBy(row.subRows, d => d.subRows),
      getAllCells: memo(() => [table.getAllLeafColumns()], leafColumns => {
        return leafColumns.map(column => {
          return createCell(table, row, column, column.id);
        });
      }, {
        key: 'row.getAllCells',
        debug: () => table.options.debugAll ?? table.options.debugRows
      }),
      _getAllCellsByColumnId: memo(() => [row.getAllCells()], allCells => {
        return allCells.reduce((acc, cell) => {
          acc[cell.column.id] = cell;
          return acc;
        }, {});
      }, {
        key: "development" === 'production' ,
        debug: () => table.options.debugAll ?? table.options.debugRows
      })
    };

    for (let i = 0; i < table._features.length; i++) {
      const feature = table._features[i];
      Object.assign(row, feature == null ? void 0 : feature.createRow == null ? void 0 : feature.createRow(row, table));
    }

    return row;
  };

  // type Person = {
  //   firstName: string
  //   lastName: string
  //   age: number
  //   visits: number
  //   status: string
  //   progress: number
  //   createdAt: Date
  //   nested: {
  //     foo: [
  //       {
  //         bar: 'bar'
  //       }
  //     ]
  //     bar: { subBar: boolean }[]
  //     baz: {
  //       foo: 'foo'
  //       bar: {
  //         baz: 'baz'
  //       }
  //     }
  //   }
  // }
  // const test: DeepKeys<Person> = 'nested.foo.0.bar'
  // const test2: DeepKeys<Person> = 'nested.bar'
  // const helper = createColumnHelper<Person>()
  // helper.accessor('nested.foo', {
  //   cell: info => info.getValue(),
  // })
  // helper.accessor('nested.foo.0.bar', {
  //   cell: info => info.getValue(),
  // })
  // helper.accessor('nested.bar', {
  //   cell: info => info.getValue(),
  // })
  function createColumnHelper() {
    return {
      accessor: (accessor, column) => {
        return typeof accessor === 'function' ? { ...column,
          accessorFn: accessor
        } : { ...column,
          accessorKey: accessor
        };
      },
      display: column => column,
      group: column => column
    };
  }

  function getCoreRowModel() {
    return table => memo(() => [table.options.data], data => {
      const rowModel = {
        rows: [],
        flatRows: [],
        rowsById: {}
      };

      const accessRows = function (originalRows, depth, parent) {
        if (depth === void 0) {
          depth = 0;
        }

        const rows = [];

        for (let i = 0; i < originalRows.length; i++) {
          // This could be an expensive check at scale, so we should move it somewhere else, but where?
          // if (!id) {
          //   if ("development" !== 'production') {
          //     throw new Error(`getRowId expected an ID, but got ${id}`)
          //   }
          // }
          // Make the row
          const row = createRow(table, table._getRowId(originalRows[i], i, parent), originalRows[i], i, depth); // Keep track of every row in a flat array

          rowModel.flatRows.push(row); // Also keep track of every row by its ID

          rowModel.rowsById[row.id] = row; // Push table row into parent

          rows.push(row); // Get the original subrows

          if (table.options.getSubRows) {
            var _row$originalSubRows;

            row.originalSubRows = table.options.getSubRows(originalRows[i], i); // Then recursively access them

            if ((_row$originalSubRows = row.originalSubRows) != null && _row$originalSubRows.length) {
              row.subRows = accessRows(row.originalSubRows, depth + 1, row);
            }
          }
        }

        return rows;
      };

      rowModel.rows = accessRows(data);
      return rowModel;
    }, {
      key: 'getRowModel',
      debug: () => table.options.debugAll ?? table.options.debugTable,
      onChange: () => {
        table._autoResetPageIndex();
      }
    });
  }

  function filterRows(rows, filterRowImpl, table) {
    if (table.options.filterFromLeafRows) {
      return filterRowModelFromLeafs(rows, filterRowImpl, table);
    }

    return filterRowModelFromRoot(rows, filterRowImpl, table);
  }
  function filterRowModelFromLeafs(rowsToFilter, filterRow, table) {
    const newFilteredFlatRows = [];
    const newFilteredRowsById = {};

    const recurseFilterRows = function (rowsToFilter, depth) {

      const rows = []; // Filter from children up first

      for (let i = 0; i < rowsToFilter.length; i++) {
        var _row$subRows;

        let row = rowsToFilter[i];

        if ((_row$subRows = row.subRows) != null && _row$subRows.length) {
          const newRow = createRow(table, row.id, row.original, row.index, row.depth);
          newRow.columnFilters = row.columnFilters;
          newRow.subRows = recurseFilterRows(row.subRows);

          if (!newRow.subRows.length) {
            continue;
          }

          row = newRow;
        }

        if (filterRow(row)) {
          rows.push(row);
          newFilteredRowsById[row.id] = row;
          newFilteredRowsById[i] = row;
        }
      }

      return rows;
    };

    return {
      rows: recurseFilterRows(rowsToFilter),
      flatRows: newFilteredFlatRows,
      rowsById: newFilteredRowsById
    };
  }
  function filterRowModelFromRoot(rowsToFilter, filterRow, table) {
    const newFilteredFlatRows = [];
    const newFilteredRowsById = {}; // Filters top level and nested rows

    const recurseFilterRows = function (rowsToFilter, depth) {

      // Filter from parents downward first
      const rows = []; // Apply the filter to any subRows

      for (let i = 0; i < rowsToFilter.length; i++) {
        let row = rowsToFilter[i];
        const pass = filterRow(row);

        if (pass) {
          var _row$subRows2;

          if ((_row$subRows2 = row.subRows) != null && _row$subRows2.length) {
            const newRow = createRow(table, row.id, row.original, row.index, row.depth);
            newRow.subRows = recurseFilterRows(row.subRows);
            row = newRow;
          }

          rows.push(row);
          newFilteredFlatRows.push(row);
          newFilteredRowsById[row.id] = row;
        }
      }

      return rows;
    };

    return {
      rows: recurseFilterRows(rowsToFilter),
      flatRows: newFilteredFlatRows,
      rowsById: newFilteredRowsById
    };
  }

  function getFilteredRowModel() {
    return table => memo(() => [table.getPreFilteredRowModel(), table.getState().columnFilters, table.getState().globalFilter], (rowModel, columnFilters, globalFilter) => {
      if (!rowModel.rows.length || !(columnFilters != null && columnFilters.length) && !globalFilter) {
        for (let i = 0; i < rowModel.flatRows.length; i++) {
          rowModel.flatRows[i].columnFilters = {};
          rowModel.flatRows[i].columnFiltersMeta = {};
        }

        return rowModel;
      }

      const resolvedColumnFilters = [];
      const resolvedGlobalFilters = [];
      (columnFilters ?? []).forEach(d => {
        const column = table.getColumn(d.id);

        if (!column) {
          {
            console.warn(`Table: Could not find a column to filter with columnId: ${d.id}`);
          }
        }

        const filterFn = column.getFilterFn();

        if (!filterFn) {
          {
            console.warn(`Could not find a valid 'column.filterFn' for column with the ID: ${column.id}.`);
          }

          return;
        }

        resolvedColumnFilters.push({
          id: d.id,
          filterFn,
          resolvedValue: (filterFn.resolveFilterValue == null ? void 0 : filterFn.resolveFilterValue(d.value)) ?? d.value
        });
      });
      const filterableIds = columnFilters.map(d => d.id);
      const globalFilterFn = table.getGlobalFilterFn();
      const globallyFilterableColumns = table.getAllLeafColumns().filter(column => column.getCanGlobalFilter());

      if (globalFilter && globalFilterFn && globallyFilterableColumns.length) {
        filterableIds.push('__global__');
        globallyFilterableColumns.forEach(column => {
          resolvedGlobalFilters.push({
            id: column.id,
            filterFn: globalFilterFn,
            resolvedValue: (globalFilterFn.resolveFilterValue == null ? void 0 : globalFilterFn.resolveFilterValue(globalFilter)) ?? globalFilter
          });
        });
      }

      let currentColumnFilter;
      let currentGlobalFilter; // Flag the prefiltered row model with each filter state

      for (let j = 0; j < rowModel.flatRows.length; j++) {
        const row = rowModel.flatRows[j];
        row.columnFilters = {};

        if (resolvedColumnFilters.length) {
          for (let i = 0; i < resolvedColumnFilters.length; i++) {
            currentColumnFilter = resolvedColumnFilters[i];
            const id = currentColumnFilter.id; // Tag the row with the column filter state

            row.columnFilters[id] = currentColumnFilter.filterFn(row, id, currentColumnFilter.resolvedValue, filterMeta => {
              row.columnFiltersMeta[id] = filterMeta;
            });
          }
        }

        if (resolvedGlobalFilters.length) {
          for (let i = 0; i < resolvedGlobalFilters.length; i++) {
            currentGlobalFilter = resolvedGlobalFilters[i];
            const id = currentGlobalFilter.id; // Tag the row with the first truthy global filter state

            if (currentGlobalFilter.filterFn(row, id, currentGlobalFilter.resolvedValue, filterMeta => {
              row.columnFiltersMeta[id] = filterMeta;
            })) {
              row.columnFilters.__global__ = true;
              break;
            }
          }

          if (row.columnFilters.__global__ !== true) {
            row.columnFilters.__global__ = false;
          }
        }
      }

      const filterRowsImpl = row => {
        // Horizontally filter rows through each column
        for (let i = 0; i < filterableIds.length; i++) {
          if (row.columnFilters[filterableIds[i]] === false) {
            return false;
          }
        }

        return true;
      }; // Filter final rows using all of the active filters


      return filterRows(rowModel.rows, filterRowsImpl, table);
    }, {
      key: 'getFilteredRowModel',
      debug: () => table.options.debugAll ?? table.options.debugTable,
      onChange: () => {
        table._autoResetPageIndex();
      }
    });
  }

  function getFacetedRowModel() {
    return (table, columnId) => memo(() => [table.getPreFilteredRowModel(), table.getState().columnFilters, table.getState().globalFilter, table.getFilteredRowModel()], (preRowModel, columnFilters, globalFilter) => {
      if (!preRowModel.rows.length || !(columnFilters != null && columnFilters.length) && !globalFilter) {
        return preRowModel;
      }

      const filterableIds = [...columnFilters.map(d => d.id).filter(d => d !== columnId), globalFilter ? '__global__' : undefined].filter(Boolean);

      const filterRowsImpl = row => {
        // Horizontally filter rows through each column
        for (let i = 0; i < filterableIds.length; i++) {
          if (row.columnFilters[filterableIds[i]] === false) {
            return false;
          }
        }

        return true;
      };

      return filterRows(preRowModel.rows, filterRowsImpl, table);
    }, {
      key: 'getFacetedRowModel_' + columnId,
      debug: () => table.options.debugAll ?? table.options.debugTable,
      onChange: () => {}
    });
  }

  function getFacetedUniqueValues() {
    return (table, columnId) => memo(() => [table.getColumn(columnId).getFacetedRowModel()], facetedRowModel => {
      let facetedUniqueValues = new Map();

      for (let i = 0; i < facetedRowModel.flatRows.length; i++) {
        var _facetedRowModel$flat;

        const value = (_facetedRowModel$flat = facetedRowModel.flatRows[i]) == null ? void 0 : _facetedRowModel$flat.getValue(columnId);

        if (facetedUniqueValues.has(value)) {
          facetedUniqueValues.set(value, (facetedUniqueValues.get(value) ?? 0) + 1);
        } else {
          facetedUniqueValues.set(value, 1);
        }
      }

      return facetedUniqueValues;
    }, {
      key: 'getFacetedUniqueValues_' + columnId,
      debug: () => table.options.debugAll ?? table.options.debugTable,
      onChange: () => {}
    });
  }

  function getFacetedMinMaxValues() {
    return (table, columnId) => memo(() => [table.getColumn(columnId).getFacetedRowModel()], facetedRowModel => {
      var _facetedRowModel$flat;

      const firstValue = (_facetedRowModel$flat = facetedRowModel.flatRows[0]) == null ? void 0 : _facetedRowModel$flat.getValue(columnId);

      if (typeof firstValue === 'undefined') {
        return undefined;
      }

      let facetedMinMaxValues = [firstValue, firstValue];

      for (let i = 0; i < facetedRowModel.flatRows.length; i++) {
        const value = facetedRowModel.flatRows[i].getValue(columnId);

        if (value < facetedMinMaxValues[0]) {
          facetedMinMaxValues[0] = value;
        } else if (value > facetedMinMaxValues[1]) {
          facetedMinMaxValues[1] = value;
        }
      }

      return facetedMinMaxValues;
    }, {
      key: 'getFacetedMinMaxValues_' + columnId,
      debug: () => table.options.debugAll ?? table.options.debugTable,
      onChange: () => {}
    });
  }

  function getSortedRowModel() {
    return table => memo(() => [table.getState().sorting, table.getPreSortedRowModel()], (sorting, rowModel) => {
      if (!rowModel.rows.length || !(sorting != null && sorting.length)) {
        return rowModel;
      }

      const sortingState = table.getState().sorting;
      const sortedFlatRows = []; // Filter out sortings that correspond to non existing columns

      const availableSorting = sortingState.filter(sort => table.getColumn(sort.id).getCanSort());
      const columnInfoById = {};
      availableSorting.forEach(sortEntry => {
        const column = table.getColumn(sortEntry.id);
        columnInfoById[sortEntry.id] = {
          sortUndefined: column.columnDef.sortUndefined,
          invertSorting: column.columnDef.invertSorting,
          sortingFn: column.getSortingFn()
        };
      });

      const sortData = rows => {
        // This will also perform a stable sorting using the row index
        // if needed.
        const sortedData = rows.slice();
        sortedData.sort((rowA, rowB) => {
          for (let i = 0; i < availableSorting.length; i += 1) {
            const sortEntry = availableSorting[i];
            const columnInfo = columnInfoById[sortEntry.id];
            const isDesc = (sortEntry == null ? void 0 : sortEntry.desc) ?? false;

            if (columnInfo.sortUndefined) {
              const aValue = rowA.getValue(sortEntry.id);
              const bValue = rowB.getValue(sortEntry.id);
              const aUndefined = typeof aValue === 'undefined';
              const bUndefined = typeof bValue === 'undefined';

              if (aUndefined || bUndefined) {
                return aUndefined && bUndefined ? 0 : aUndefined ? columnInfo.sortUndefined : -columnInfo.sortUndefined;
              }
            } // This function should always return in ascending order


            let sortInt = columnInfo.sortingFn(rowA, rowB, sortEntry.id);

            if (sortInt !== 0) {
              if (isDesc) {
                sortInt *= -1;
              }

              if (columnInfo.invertSorting) {
                sortInt *= -1;
              }

              return sortInt;
            }
          }

          return rowA.index - rowB.index;
        }); // If there are sub-rows, sort them

        sortedData.forEach(row => {
          sortedFlatRows.push(row);

          if (!row.subRows || row.subRows.length <= 1) {
            return;
          }

          row.subRows = sortData(row.subRows);
        });
        return sortedData;
      };

      return {
        rows: sortData(rowModel.rows),
        flatRows: sortedFlatRows,
        rowsById: rowModel.rowsById
      };
    }, {
      key: 'getSortedRowModel',
      debug: () => table.options.debugAll ?? table.options.debugTable,
      onChange: () => {
        table._autoResetPageIndex();
      }
    });
  }

  function getGroupedRowModel() {
    return table => memo(() => [table.getState().grouping, table.getPreGroupedRowModel()], (grouping, rowModel) => {
      if (!rowModel.rows.length || !grouping.length) {
        return rowModel;
      } // Filter the grouping list down to columns that exist


      const existingGrouping = grouping.filter(columnId => table.getColumn(columnId));
      const groupedFlatRows = [];
      const groupedRowsById = {}; // const onlyGroupedFlatRows: Row[] = [];
      // const onlyGroupedRowsById: Record<RowId, Row> = {};
      // const nonGroupedFlatRows: Row[] = [];
      // const nonGroupedRowsById: Record<RowId, Row> = {};
      // Recursively group the data

      const groupUpRecursively = function (rows, depth, parentId) {
        if (depth === void 0) {
          depth = 0;
        }

        // Grouping depth has been been met
        // Stop grouping and simply rewrite thd depth and row relationships
        if (depth >= existingGrouping.length) {
          return rows.map(row => {
            row.depth = depth;
            groupedFlatRows.push(row);
            groupedRowsById[row.id] = row;

            if (row.subRows) {
              row.subRows = groupUpRecursively(row.subRows, depth + 1);
            }

            return row;
          });
        }

        const columnId = existingGrouping[depth]; // Group the rows together for this level

        const rowGroupsMap = groupBy(rows, columnId); // Peform aggregations for each group

        const aggregatedGroupedRows = Array.from(rowGroupsMap.entries()).map((_ref, index) => {
          let [groupingValue, groupedRows] = _ref;
          let id = `${columnId}:${groupingValue}`;
          id = parentId ? `${parentId}>${id}` : id; // First, Recurse to group sub rows before aggregation

          const subRows = groupUpRecursively(groupedRows, depth + 1, id); // Flatten the leaf rows of the rows in this group

          const leafRows = depth ? flattenBy(groupedRows, row => row.subRows) : groupedRows;
          const row = createRow(table, id, leafRows[0].original, index, depth);
          Object.assign(row, {
            groupingColumnId: columnId,
            groupingValue,
            subRows,
            leafRows,
            getValue: columnId => {
              // Don't aggregate columns that are in the grouping
              if (existingGrouping.includes(columnId)) {
                if (row._valuesCache.hasOwnProperty(columnId)) {
                  return row._valuesCache[columnId];
                }

                if (groupedRows[0]) {
                  row._valuesCache[columnId] = groupedRows[0].getValue(columnId) ?? undefined;
                }

                return row._valuesCache[columnId];
              }

              if (row._groupingValuesCache.hasOwnProperty(columnId)) {
                return row._groupingValuesCache[columnId];
              } // Aggregate the values


              const column = table.getColumn(columnId);
              const aggregateFn = column.getAggregationFn();

              if (aggregateFn) {
                row._groupingValuesCache[columnId] = aggregateFn(columnId, leafRows, groupedRows);
                return row._groupingValuesCache[columnId];
              }
            }
          });
          subRows.forEach(subRow => {
            groupedFlatRows.push(subRow);
            groupedRowsById[subRow.id] = subRow; // if (subRow.getIsGrouped?.()) {
            //   onlyGroupedFlatRows.push(subRow);
            //   onlyGroupedRowsById[subRow.id] = subRow;
            // } else {
            //   nonGroupedFlatRows.push(subRow);
            //   nonGroupedRowsById[subRow.id] = subRow;
            // }
          });
          return row;
        });
        return aggregatedGroupedRows;
      };

      const groupedRows = groupUpRecursively(rowModel.rows, 0, '');
      groupedRows.forEach(subRow => {
        groupedFlatRows.push(subRow);
        groupedRowsById[subRow.id] = subRow; // if (subRow.getIsGrouped?.()) {
        //   onlyGroupedFlatRows.push(subRow);
        //   onlyGroupedRowsById[subRow.id] = subRow;
        // } else {
        //   nonGroupedFlatRows.push(subRow);
        //   nonGroupedRowsById[subRow.id] = subRow;
        // }
      });
      return {
        rows: groupedRows,
        flatRows: groupedFlatRows,
        rowsById: groupedRowsById
      };
    }, {
      key: 'getGroupedRowModel',
      debug: () => table.options.debugAll ?? table.options.debugTable,
      onChange: () => {
        table._queue(() => {
          table._autoResetExpanded();

          table._autoResetPageIndex();
        });
      }
    });
  }

  function groupBy(rows, columnId) {
    const groupMap = new Map();
    return rows.reduce((map, row) => {
      const resKey = `${row.getValue(columnId)}`;
      const previous = map.get(resKey);

      if (!previous) {
        map.set(resKey, [row]);
      } else {
        map.set(resKey, [...previous, row]);
      }

      return map;
    }, groupMap);
  }

  function getExpandedRowModel() {
    return table => memo(() => [table.getState().expanded, table.getPreExpandedRowModel(), table.options.paginateExpandedRows], (expanded, rowModel, paginateExpandedRows) => {
      if (!rowModel.rows.length || expanded !== true && !Object.keys(expanded ?? {}).length) {
        return rowModel;
      }

      if (!paginateExpandedRows) {
        // Only expand rows at this point if they are being paginated
        return rowModel;
      }

      return expandRows(rowModel);
    }, {
      key: 'getExpandedRowModel',
      debug: () => table.options.debugAll ?? table.options.debugTable
    });
  }
  function expandRows(rowModel) {
    const expandedRows = [];

    const handleRow = row => {
      var _row$subRows;

      expandedRows.push(row);

      if ((_row$subRows = row.subRows) != null && _row$subRows.length && row.getIsExpanded()) {
        row.subRows.forEach(handleRow);
      }
    };

    rowModel.rows.forEach(handleRow);
    return {
      rows: expandedRows,
      flatRows: rowModel.flatRows,
      rowsById: rowModel.rowsById
    };
  }

  function getPaginationRowModel(opts) {
    return table => memo(() => [table.getState().pagination, table.getPrePaginationRowModel(), table.options.paginateExpandedRows ? undefined : table.getState().expanded], (pagination, rowModel) => {
      if (!rowModel.rows.length) {
        return rowModel;
      }

      const {
        pageSize,
        pageIndex
      } = pagination;
      let {
        rows,
        flatRows,
        rowsById
      } = rowModel;
      const pageStart = pageSize * pageIndex;
      const pageEnd = pageStart + pageSize;
      rows = rows.slice(pageStart, pageEnd);
      let paginatedRowModel;

      if (!table.options.paginateExpandedRows) {
        paginatedRowModel = expandRows({
          rows,
          flatRows,
          rowsById
        });
      } else {
        paginatedRowModel = {
          rows,
          flatRows,
          rowsById
        };
      }

      paginatedRowModel.flatRows = [];

      const handleRow = row => {
        paginatedRowModel.flatRows.push(row);

        if (row.subRows.length) {
          row.subRows.forEach(handleRow);
        }
      };

      paginatedRowModel.rows.forEach(handleRow);
      return paginatedRowModel;
    }, {
      key: 'getPaginationRowModel',
      debug: () => table.options.debugAll ?? table.options.debugTable
    });
  }

  exports.ColumnSizing = ColumnSizing;
  exports.Expanding = Expanding;
  exports.Filters = Filters;
  exports.Grouping = Grouping;
  exports.Headers = Headers;
  exports.Ordering = Ordering;
  exports.Pagination = Pagination;
  exports.Pinning = Pinning;
  exports.RowSelection = RowSelection;
  exports.Sorting = Sorting;
  exports.Visibility = Visibility;
  exports.aggregationFns = aggregationFns;
  exports.buildHeaderGroups = buildHeaderGroups;
  exports.createCell = createCell;
  exports.createColumn = createColumn;
  exports.createColumnHelper = createColumnHelper;
  exports.createRow = createRow;
  exports.createTable = createTable;
  exports.defaultColumnSizing = defaultColumnSizing;
  exports.expandRows = expandRows;
  exports.filterFns = filterFns;
  exports.flattenBy = flattenBy;
  exports.functionalUpdate = functionalUpdate;
  exports.getCoreRowModel = getCoreRowModel;
  exports.getExpandedRowModel = getExpandedRowModel;
  exports.getFacetedMinMaxValues = getFacetedMinMaxValues;
  exports.getFacetedRowModel = getFacetedRowModel;
  exports.getFacetedUniqueValues = getFacetedUniqueValues;
  exports.getFilteredRowModel = getFilteredRowModel;
  exports.getGroupedRowModel = getGroupedRowModel;
  exports.getPaginationRowModel = getPaginationRowModel;
  exports.getSortedRowModel = getSortedRowModel;
  exports.isFunction = isFunction;
  exports.isRowSelected = isRowSelected;
  exports.isSubRowSelected = isSubRowSelected;
  exports.makeStateUpdater = makeStateUpdater;
  exports.memo = memo;
  exports.noop = noop;
  exports.orderColumns = orderColumns;
  exports.passiveEventSupported = passiveEventSupported;
  exports.reSplitAlphaNumeric = reSplitAlphaNumeric;
  exports.selectRowsFn = selectRowsFn;
  exports.shouldAutoRemoveFilter = shouldAutoRemoveFilter;
  exports.sortingFns = sortingFns;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.development.js.map
