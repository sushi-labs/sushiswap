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
  getDefaultOptions: instance => {
    return {
      columnResizeMode: 'onEnd',
      onColumnSizingChange: utils.makeStateUpdater('columnSizing', instance),
      onColumnSizingInfoChange: utils.makeStateUpdater('columnSizingInfo', instance)
    };
  },
  createColumn: (column, instance) => {
    return {
      getSize: () => {
        var _column$columnDef$min, _ref, _column$columnDef$max;

        const columnSize = instance.getState().columnSizing[column.id];
        return Math.min(Math.max((_column$columnDef$min = column.columnDef.minSize) != null ? _column$columnDef$min : defaultColumnSizing.minSize, (_ref = columnSize != null ? columnSize : column.columnDef.size) != null ? _ref : defaultColumnSizing.size), (_column$columnDef$max = column.columnDef.maxSize) != null ? _column$columnDef$max : defaultColumnSizing.maxSize);
      },
      getStart: position => {
        const columns = !position ? instance.getVisibleLeafColumns() : position === 'left' ? instance.getLeftVisibleLeafColumns() : instance.getRightVisibleLeafColumns();
        const index = columns.findIndex(d => d.id === column.id);

        if (index > 0) {
          const prevSiblingColumn = columns[index - 1];
          return prevSiblingColumn.getStart(position) + prevSiblingColumn.getSize();
        }

        return 0;
      },
      resetSize: () => {
        instance.setColumnSizing(_ref2 => {
          let {
            [column.id]: _,
            ...rest
          } = _ref2;
          return rest;
        });
      },
      getCanResize: () => {
        var _column$columnDef$ena, _instance$options$ena;

        return ((_column$columnDef$ena = column.columnDef.enableResizing) != null ? _column$columnDef$ena : true) && ((_instance$options$ena = instance.options.enableColumnResizing) != null ? _instance$options$ena : true);
      },
      getIsResizing: () => {
        return instance.getState().columnSizingInfo.isResizingColumn === column.id;
      }
    };
  },
  createHeader: (header, instance) => {
    return {
      getSize: () => {
        let sum = 0;

        const recurse = header => {
          if (header.subHeaders.length) {
            header.subHeaders.forEach(recurse);
          } else {
            var _header$column$getSiz;

            sum += (_header$column$getSiz = header.column.getSize()) != null ? _header$column$getSiz : 0;
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
        const column = instance.getColumn(header.column.id);
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
            instance.setColumnSizingInfo(old => {
              var _old$startOffset, _old$startSize;

              const deltaOffset = clientXPos - ((_old$startOffset = old == null ? void 0 : old.startOffset) != null ? _old$startOffset : 0);
              const deltaPercentage = Math.max(deltaOffset / ((_old$startSize = old == null ? void 0 : old.startSize) != null ? _old$startSize : 0), -0.999999);
              old.columnSizingStart.forEach(_ref3 => {
                let [columnId, headerSize] = _ref3;
                newColumnSizing[columnId] = Math.round(Math.max(headerSize + headerSize * deltaPercentage, 0) * 100) / 100;
              });
              return { ...old,
                deltaOffset,
                deltaPercentage
              };
            });

            if (instance.options.columnResizeMode === 'onChange' || eventType === 'end') {
              instance.setColumnSizing(old => ({ ...old,
                ...newColumnSizing
              }));
            }
          };

          const onMove = clientXPos => updateOffset('move', clientXPos);

          const onEnd = clientXPos => {
            updateOffset('end', clientXPos);
            instance.setColumnSizingInfo(old => ({ ...old,
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

          instance.setColumnSizingInfo(old => ({ ...old,
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
  createInstance: instance => {
    return {
      setColumnSizing: updater => instance.options.onColumnSizingChange == null ? void 0 : instance.options.onColumnSizingChange(updater),
      setColumnSizingInfo: updater => instance.options.onColumnSizingInfoChange == null ? void 0 : instance.options.onColumnSizingInfoChange(updater),
      resetColumnSizing: defaultState => {
        var _instance$initialStat;

        instance.setColumnSizing(defaultState ? {} : (_instance$initialStat = instance.initialState.columnSizing) != null ? _instance$initialStat : {});
      },
      resetHeaderSizeInfo: defaultState => {
        var _instance$initialStat2;

        instance.setColumnSizingInfo(defaultState ? getDefaultColumnSizingInfoState() : (_instance$initialStat2 = instance.initialState.columnSizingInfo) != null ? _instance$initialStat2 : getDefaultColumnSizingInfoState());
      },
      getTotalSize: () => {
        var _instance$getHeaderGr, _instance$getHeaderGr2;

        return (_instance$getHeaderGr = (_instance$getHeaderGr2 = instance.getHeaderGroups()[0]) == null ? void 0 : _instance$getHeaderGr2.headers.reduce((sum, header) => {
          return sum + header.getSize();
        }, 0)) != null ? _instance$getHeaderGr : 0;
      },
      getLeftTotalSize: () => {
        var _instance$getLeftHead, _instance$getLeftHead2;

        return (_instance$getLeftHead = (_instance$getLeftHead2 = instance.getLeftHeaderGroups()[0]) == null ? void 0 : _instance$getLeftHead2.headers.reduce((sum, header) => {
          return sum + header.getSize();
        }, 0)) != null ? _instance$getLeftHead : 0;
      },
      getCenterTotalSize: () => {
        var _instance$getCenterHe, _instance$getCenterHe2;

        return (_instance$getCenterHe = (_instance$getCenterHe2 = instance.getCenterHeaderGroups()[0]) == null ? void 0 : _instance$getCenterHe2.headers.reduce((sum, header) => {
          return sum + header.getSize();
        }, 0)) != null ? _instance$getCenterHe : 0;
      },
      getRightTotalSize: () => {
        var _instance$getRightHea, _instance$getRightHea2;

        return (_instance$getRightHea = (_instance$getRightHea2 = instance.getRightHeaderGroups()[0]) == null ? void 0 : _instance$getRightHea2.headers.reduce((sum, header) => {
          return sum + header.getSize();
        }, 0)) != null ? _instance$getRightHea : 0;
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
