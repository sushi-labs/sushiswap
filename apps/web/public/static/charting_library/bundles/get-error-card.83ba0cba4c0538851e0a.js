;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [139],
  {
    30509: (e) => {
      e.exports = {
        errorCard: 'errorCard-S9sXvhAu',
        errorCard__icon: 'errorCard__icon-S9sXvhAu',
        errorCard_size_big: 'errorCard_size_big-S9sXvhAu',
        errorCard__message: 'errorCard__message-S9sXvhAu',
        errorCard_limitWidth: 'errorCard_limitWidth-S9sXvhAu',
        errorCard__link: 'errorCard__link-S9sXvhAu',
        errorCardRendererContainer: 'errorCardRendererContainer-S9sXvhAu',
      }
    },
    9745: (e, r, t) => {
      t.d(r, { Icon: () => i })
      var o = t(50959)
      const i = o.forwardRef((e, r) => {
        const { icon: t = '', ...i } = e
        return o.createElement('span', {
          ...i,
          ref: r,
          dangerouslySetInnerHTML: { __html: t },
        })
      })
    },
    81200: (e, r, t) => {
      t.r(r),
        t.d(r, {
          ErrorCard: () => v,
          ErrorCardRenderer: () => g,
          ResizableErrorCard: () => _,
        })
      var o = t(50959),
        i = t(962),
        n = t(43370),
        s = t(97754),
        a = t.n(s),
        d = t(9745),
        l = (t(11542), t(14483)),
        h = t(29540),
        c = t(11425),
        m = t(30509)
      const u = {
        ghost: {
          1: (0, l.enabled)('hide_image_invalid_symbol') ? void 0 : h,
          2: (0, l.enabled)('hide_image_invalid_symbol') ? void 0 : c,
        },
        'stop-hand': { 1: void 0, 2: void 0 },
      }
      const v = o.forwardRef((e, r) => {
        const {
            icon: t,
            message: i,
            size: n = 1,
            rawHtml: s = !1,
            doNotLimitWidth: l,
            solutionId: h,
          } = e,
          c = o.useMemo(
            () =>
              t &&
              ((e, r) => {
                if (0 !== r) return u[e][r]
              })(t, n),
            [t, n],
          )
        return o.createElement(
          'div',
          {
            ref: r,
            className: a()(
              m.errorCard,
              2 === n && m.errorCard_size_big,
              !l && m.errorCard_limitWidth,
            ),
          },
          c &&
            o.createElement(d.Icon, { icon: c, className: m.errorCard__icon }),
          s
            ? o.createElement('div', {
                className: m.errorCard__message,
                dangerouslySetInnerHTML: { __html: i },
              })
            : o.createElement('div', { className: m.errorCard__message }, i),
          null,
        )
      })
      function _(e) {
        const {
            icon: r,
            message: t,
            rawHtml: i,
            doNotLimitWidth: s,
            maxWidth: a = 200,
            maxHeight: d = 200,
            offsetHeight: l = 0,
            solutionId: h,
          } = e,
          c = o.useRef(null),
          [m, u] = o.useState(1)
        return (
          o.useEffect(() => {
            const e = c.current
            if (e) {
              const r = new ResizeObserver((0, n.default)(_, 150))
              return r.observe(e), () => r.disconnect()
            }
          }, [a, d, l]),
          o.createElement(v, {
            ref: c,
            message: t,
            icon: r,
            size: m,
            rawHtml: i,
            doNotLimitWidth: s,
            solutionId: h,
          })
        )
        function _() {
          const e = c.current
          if (!e) return
          const r = e.clientHeight + l
          r < 105 ? u(0) : e.clientWidth < a || r < d ? u(1) : u(2)
        }
      }
      class g {
        constructor() {
          this._state = {
            message: null,
            rawHtml: !1,
            doNotLimitWidth: !1,
            icon: void 0,
            backgroundColor: null,
            textColor: null,
            maxWidth: 200,
            maxHeight: 200,
            offsetHeight: 0,
            solutionId: void 0,
          }
          const e = document.createElement('div')
          e.classList.add(m.errorCardRendererContainer), (this.container = e)
        }
        destroy() {
          i.unmountComponentAtNode(this.container)
        }
        update(e) {
          ;(this._state = Object.assign({}, this._state, e)),
            this._updateContainer(),
            this._render()
        }
        _updateContainer() {
          const { backgroundColor: e, textColor: r } = this._state
          this.container.style.setProperty('--backgroundColor', e),
            this.container.style.setProperty('--textColor', r)
        }
        _render() {
          const {
            message: e,
            icon: r,
            rawHtml: t,
            doNotLimitWidth: n,
            maxWidth: s,
            maxHeight: a,
            offsetHeight: d,
            solutionId: l,
          } = this._state
          i.render(
            e
              ? o.createElement(_, {
                  message: e,
                  icon: r,
                  rawHtml: t,
                  doNotLimitWidth: n,
                  maxWidth: s,
                  maxHeight: a,
                  offsetHeight: d,
                  solutionId: l,
                })
              : o.createElement(o.Fragment, null),
            this.container,
          )
        }
      }
    },
    11425: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><path fill="currentColor" fill-rule="evenodd" d="M23 39a36 36 0 0 1 72 0v13.15l15.1 8.44 2.16 1.2-1.64 1.86-12.85 14.59 3.73 4.03L98.57 85 95 81.13V117H77v-12H67v9H50V95H40v22H23V81.28l-3.8 3.61-2.76-2.9 4.05-3.84-12.77-14.5-1.64-1.86 2.16-1.2L23 52.34V39Zm72 36.33 10.98-12.46L95 56.73v18.6ZM23 56.92v18.03L12.35 62.87 23 56.92ZM59 7a32 32 0 0 0-32 32v74h9V91h18v19h9v-9h18v12h10V39A32 32 0 0 0 59 7Zm-7 36a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm19 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>'
    },
    29540: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72"><path fill="currentColor" d="M15 24a21 21 0 1 1 42 0v7.41l8.97 5.01 1.08.6-.82.94-7.77 8.82 2.34 2.53-1.47 1.36L57 48.15V69H46v-7h-6v5h-9V56h-6v13H15V48.15l-2.33 2.52-1.47-1.36 2.35-2.53-7.78-8.82-.82-.93 1.08-.6L15 31.4V24Zm0 9.7-6.9 3.87L15 45.4V33.7Zm42 11.7 6.91-7.83-6.9-3.87v11.7ZM36 5a19 19 0 0 0-19 19v43h6V54h10v11h5v-5h10v7h7V24A19 19 0 0 0 36 5Zm-5 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM42.5 26a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/></svg>'
    },
  },
])
