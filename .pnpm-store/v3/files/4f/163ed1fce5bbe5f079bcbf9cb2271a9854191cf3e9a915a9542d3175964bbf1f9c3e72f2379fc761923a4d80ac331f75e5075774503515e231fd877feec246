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
      onColumnSizingChange: utils.makeStateUpdater('columnSizing', table),
      onColumnSizingInfoChange: utils.makeStateUpdater('columnSizingInfo', table)
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

exports.ColumnSizing = ColumnSizing;
exports.defaultColumnSizing = defaultColumnSizing;
exports.passiveEventSupported = passiveEventSupported;
//# sourceMappingURL=ColumnSizing.js.map
