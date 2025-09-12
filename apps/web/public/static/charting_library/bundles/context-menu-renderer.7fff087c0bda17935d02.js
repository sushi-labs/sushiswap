;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1584],
  {
    97754: (t, e) => {
      var n
      !(() => {
        var r = {}.hasOwnProperty
        function o() {
          for (var t = [], e = 0; e < arguments.length; e++) {
            var n = arguments[e]
            if (n) {
              var i = typeof n
              if ('string' === i || 'number' === i) t.push(n)
              else if (Array.isArray(n) && n.length) {
                var s = o.apply(null, n)
                s && t.push(s)
              } else if ('object' === i)
                for (var u in n) r.call(n, u) && n[u] && t.push(u)
            }
          }
          return t.join(' ')
        }
        t.exports
          ? ((o.default = o), (t.exports = o))
          : void 0 === (n = (() => o).apply(e, [])) || (t.exports = n)
      })()
    },
    39416: (t, e, n) => {
      n.d(e, { useFunctionalRefObject: () => i })
      var r = n(50959),
        o = n(43010)
      function i(t) {
        const e = (0, r.useMemo)(
            () =>
              ((t) => {
                const e = (n) => {
                  t(n), (e.current = n)
                }
                return (e.current = null), e
              })((t) => {
                u.current(t)
              }),
            [],
          ),
          n = (0, r.useRef)(null),
          i = (e) => {
            if (null === e) return s(n.current, e), void (n.current = null)
            n.current !== t && ((n.current = t), s(n.current, e))
          },
          u = (0, r.useRef)(i)
        return (
          (u.current = i),
          (0, o.useIsomorphicLayoutEffect)(() => {
            if (null !== e.current)
              return u.current(e.current), () => u.current(null)
          }, [t]),
          e
        )
      }
      function s(t, e) {
        null !== t && ('function' == typeof t ? t(e) : (t.current = e))
      }
    },
    27267: (t, e, n) => {
      function r(t, e, n, r, o) {
        function i(o) {
          if (t > o.timeStamp) return
          const i = o.target
          void 0 !== n &&
            null !== e &&
            null !== i &&
            i.ownerDocument === r &&
            (e.contains(i) || n(o))
        }
        return (
          o.click && r.addEventListener('click', i, !1),
          o.mouseDown && r.addEventListener('mousedown', i, !1),
          o.touchEnd && r.addEventListener('touchend', i, !1),
          o.touchStart && r.addEventListener('touchstart', i, !1),
          () => {
            r.removeEventListener('click', i, !1),
              r.removeEventListener('mousedown', i, !1),
              r.removeEventListener('touchend', i, !1),
              r.removeEventListener('touchstart', i, !1)
          }
        )
      }
      n.d(e, { addOutsideEventListener: () => r })
    },
    90186: (t, e, n) => {
      function r(t) {
        return i(t, s)
      }
      function o(t) {
        return i(t, u)
      }
      function i(t, e) {
        const n = Object.entries(t).filter(e),
          r = {}
        for (const [t, e] of n) r[t] = e
        return r
      }
      function s(t) {
        const [e, n] = t
        return 0 === e.indexOf('data-') && 'string' == typeof n
      }
      function u(t) {
        return 0 === t[0].indexOf('aria-')
      }
      n.d(e, {
        filterAriaProps: () => o,
        filterDataProps: () => r,
        filterProps: () => i,
        isAriaAttribute: () => u,
        isDataAttribute: () => s,
      })
    },
    52778: (t, e, n) => {
      n.d(e, { OutsideEvent: () => o })
      var r = n(36383)
      function o(t) {
        const { children: e, ...n } = t
        return e((0, r.useOutsideEvent)(n))
      }
    },
    86431: (t, e, n) => {
      n.d(e, { makeOverlapable: () => i })
      var r = n(50959),
        o = n(42842)
      function i(t, e) {
        return class extends r.PureComponent {
          render() {
            const { isOpened: n, root: i } = this.props
            if (!n) return null
            const s = r.createElement(t, {
              ...this.props,
              ref: this.props.componentRef,
              zIndex: 150,
            })
            return 'parent' === i
              ? s
              : r.createElement(o.Portal, { shouldTrapFocus: e }, s)
          }
        }
      }
    },
    11785: (t, e, n) => {
      n.r(e), n.d(e, { ContextMenuRenderer: () => a })
      var r = n(50959),
        o = n(32227),
        i = n(91561),
        s = n(63273),
        u = n(50655)
      class a {
        constructor(t, e, n, o) {
          ;(this._root = document.createElement('div')),
            (this._isShown = !1),
            (this._manager = null),
            (this._props = {
              isOpened: !1,
              items: t,
              position: { x: 0, y: 0 },
              menuStatName: e.statName,
              mode: e.mode,
              'data-name': e['data-name'],
              isKeyboardEvent: e.isKeyboardEvent,
            }),
            (this._onDestroy = n),
            (this._onShow = o),
            (this._activeElement = document.activeElement),
            (this._returnFocus = e.returnFocus),
            (this._takeFocus = e.takeFocus),
            (this._menuElementRef = r.createRef()),
            (this._doNotCloseOn = e.doNotCloseOn),
            e.manager && (this._manager = e.manager)
        }
        show(t) {
          this._onShow && this._onShow(),
            (this._isShown = !0),
            this._render({
              ...this._props,
              position: (e) => {
                const {
                  contentWidth: n,
                  contentHeight: r,
                  availableWidth: o,
                  availableHeight: i,
                } = e
                let u
                if (void 0 !== t.box) u = t.box
                else {
                  u = {
                    x: t.touches?.[0].clientX ?? t.clientX,
                    y: t.touches?.[0].clientY ?? t.clientY,
                    w: 0,
                    h: 0,
                  }
                }
                const a = t.marginX ?? 0,
                  c = t.marginY ?? 0
                let l, h
                switch (
                  ((l =
                    void 0 === t.attachToXBy
                      ? (0, s.isRtl)()
                        ? 'right'
                        : 'left'
                      : 'auto' === t.attachToXBy
                        ? (0, s.isRtl)()
                          ? u.x - a - n >= 0
                            ? 'right'
                            : 'left'
                          : u.x + u.w + a + n <= o
                            ? 'left'
                            : 'right'
                        : t.attachToXBy),
                  l)
                ) {
                  case 'left':
                    h = u.x + u.w + a
                    break
                  case 'right':
                    h = u.x - n - a
                }
                let d,
                  f = t.attachToYBy ?? 'auto'
                'auto-strict' === f &&
                  (f = i < u.y + u.h + c + r ? 'bottom' : 'top')
                let m = u.y
                switch (f) {
                  case 'top':
                    ;(m = u.y + u.h + c), (d = r > i - m ? i - m : void 0)
                    break
                  case 'bottom':
                    ;(m = Math.max(0, u.y - c - r)),
                      (d = 0 === m ? u.y - c : void 0)
                }
                return { x: h, y: m, overrideHeight: d }
              },
              isOpened: !0,
              onClose: () => {
                this.hide(), this._unmount()
              },
              doNotCloseOn: this._doNotCloseOn,
              takeFocus: this._takeFocus,
              menuElementReference: this._menuElementRef,
            })
        }
        hide() {
          ;(this._isShown = !1), this._render({ ...this._props, isOpened: !1 })
        }
        isShown() {
          return this._isShown
        }
        _unmount() {
          ;(this._isShown = !1),
            o.unmountComponentAtNode(this._root),
            this._onDestroy && this._onDestroy(),
            this._returnFocus &&
              this._activeElement instanceof HTMLElement &&
              this._activeElement.focus({ preventScroll: !0 })
        }
        _render(t) {
          o.render(
            r.createElement(
              u.SlotContext.Provider,
              { value: this._manager },
              r.createElement(i.OverlapContextMenu, { ...t }),
            ),
            this._root,
          )
        }
      }
    },
    55698: (t, e, n) => {
      n.d(e, { nanoid: () => r })
      const r = (t = 21) =>
        crypto
          .getRandomValues(new Uint8Array(t))
          .reduce(
            (t, e) =>
              (t +=
                (e &= 63) < 36
                  ? e.toString(36)
                  : e < 62
                    ? (e - 26).toString(36).toUpperCase()
                    : e > 62
                      ? '-'
                      : '_'),
            '',
          )
    },
  },
])
