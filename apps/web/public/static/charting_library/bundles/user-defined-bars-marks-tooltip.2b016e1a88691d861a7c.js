;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8020],
  {
    778199: (t, e, i) => {
      function o(t, e, i, o, n) {
        function s(n) {
          if (t > n.timeStamp) return
          const s = n.target
          void 0 !== i &&
            null !== e &&
            null !== s &&
            s.ownerDocument === o &&
            (e.contains(s) || i(n))
        }
        return (
          n.click && o.addEventListener('click', s, !1),
          n.mouseDown && o.addEventListener('mousedown', s, !1),
          n.touchEnd && o.addEventListener('touchend', s, !1),
          n.touchStart && o.addEventListener('touchstart', s, !1),
          () => {
            o.removeEventListener('click', s, !1),
              o.removeEventListener('mousedown', s, !1),
              o.removeEventListener('touchend', s, !1),
              o.removeEventListener('touchstart', s, !1)
          }
        )
      }
      i.d(e, { addOutsideEventListener: () => o })
    },
    908783: (t, e, i) => {
      i.d(e, { useOutsideEvent: () => s })
      var o = i(50959),
        n = i(778199)
      function s(t) {
        const {
            click: e,
            mouseDown: i,
            touchEnd: s,
            touchStart: r,
            handler: c,
            reference: h,
            ownerDocument: d = document,
          } = t,
          a = (0, o.useRef)(null),
          u = (0, o.useRef)(new CustomEvent('timestamp').timeStamp)
        return (
          (0, o.useLayoutEffect)(() => {
            const t = { click: e, mouseDown: i, touchEnd: s, touchStart: r },
              o = h ? h.current : a.current
            return (0, n.addOutsideEventListener)(u.current, o, c, d, t)
          }, [e, i, s, r, c]),
          h || a
        )
      }
    },
    346315: (t) => {
      t.exports = {
        css_value_arrow_size: '13',
        tooltip: 'tooltip-eSLcXvvL',
        show: 'show-eSLcXvvL',
        right: 'right-eSLcXvvL',
      }
    },
    449844: (t) => {
      t.exports = { text: 'text-hF57_4zZ' }
    },
    221116: (t, e, i) => {
      i.r(e), i.d(e, { TooltipRenderer: () => h })
      var o = i(50959),
        n = i(500962),
        s = i(908783),
        r = i(346315)
      const c = Number.parseInt(r.css_value_arrow_size)
      class h {
        constructor(t) {
          ;(this._container = null),
            (this._props = null),
            (this._deferredActions = { hideItemTime: 0 }),
            (this._updatePosition = () => {
              if (null === this._props || null === this._container) return
              const { width: t, height: e } =
                  this._tooltipContainer.getBoundingClientRect(),
                i = this._container.getBoundingClientRect(),
                o = Math.round(this._props.itemSize / 2),
                n = Math.min(8, o)
              let s = !1,
                h = this._props.x - t - o - c - n
              h < 0 && ((h = this._props.x + o + c + n), (s = !0))
              const d = i.height
              let a = Math.max(0, this._props.y - e / 2)
              a > 0 && (a = Math.min(a, d - e)),
                this._tooltipContainer.classList.toggle(r.right, s),
                (this._tooltipContainer.style.top = `${a}px`),
                (this._tooltipContainer.style.left = `${h}px`)
            }),
            (this._tooltipFactory = t),
            (this._tooltipContainer = document.createElement('div')),
            this._tooltipContainer.classList.add(r.tooltip)
        }
        destroy() {
          this._unmountComponent()
        }
        contains(t) {
          return this._tooltipContainer.contains(t)
        }
        hide(t) {
          ;(this._deferredActions.hideItemTime = performance.now()),
            this._clearTimeouts(),
            t
              ? this._tooltipContainer.classList.remove(r.show)
              : (this._deferredActions.hideItemTimerId = setTimeout(() => {
                  this._tooltipContainer.classList.remove(r.show)
                }, 100))
        }
        show(t) {
          this._clearTimeouts(),
            performance.now() < this._deferredActions.hideItemTime + 100
              ? this._showImpl(t)
              : (this._deferredActions.showItemTimerId = setTimeout(
                  () => this._showImpl(t),
                  400,
                ))
        }
        _showImpl(t) {
          ;(this._props = t),
            this._render(t),
            this._clearTimeouts(),
            this._tooltipContainer.classList.add(r.show)
        }
        _render(t) {
          const e = t.container
          this._container !== e &&
            (this._unmountComponent(),
            (this._container = e),
            this._container.appendChild(this._tooltipContainer)),
            n.render(
              o.createElement(d, {
                handler: t.onClickOutside,
                child: o.createElement(this._tooltipFactory, t.factoryProps),
              }),
              this._tooltipContainer,
              this._updatePosition,
            )
        }
        _unmountComponent() {
          null !== this._container &&
            (n.unmountComponentAtNode(this._tooltipContainer),
            this._tooltipContainer.remove(),
            (this._container = null),
            this._clearTimeouts())
        }
        _clearTimeouts() {
          void 0 !== this._deferredActions.showItemTimerId &&
            (clearTimeout(this._deferredActions.showItemTimerId),
            (this._deferredActions.showItemTimerId = void 0)),
            void 0 !== this._deferredActions.hideItemTimerId &&
              (clearTimeout(this._deferredActions.hideItemTimerId),
              (this._deferredActions.hideItemTimerId = void 0))
        }
      }
      function d(t) {
        const { handler: e, child: i } = t,
          n = (0, s.useOutsideEvent)({
            mouseDown: !0,
            touchStart: !0,
            handler: e,
          })
        return o.createElement('div', { ref: n }, i)
      }
    },
    480338: (t, e, i) => {
      i.r(e), i.d(e, { UserDefinedBarsMarksTooltip: () => s })
      var o = i(50959),
        n = i(449844)
      function s(t) {
        const { text: e } = t
        return o.createElement('div', { className: n.text }, e)
      }
    },
  },
])
