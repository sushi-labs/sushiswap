;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3168],
  {
    252130: (e, t, n) => {
      n.d(t, { useIsMounted: () => o })
      var s = n(50959)
      const o = () => {
        const e = (0, s.useRef)(!1)
        return (
          (0, s.useEffect)(
            () => (
              (e.current = !0),
              () => {
                e.current = !1
              }
            ),
            [],
          ),
          e
        )
      }
    },
    531570: (e, t, n) => {
      n.r(t), n.d(t, { PartiallyClosingDialogRenderer: () => i })
      var s = n(500962),
        o = n(50959),
        r = n(973044)
      const a = o.lazy(async () => ({
          default: (
            await Promise.all([
              n.e(580),
              n.e(8194),
              n.e(7845),
              n.e(4474),
              n.e(4014),
              n.e(7125),
              n.e(5001),
            ]).then(n.bind(n, 648017))
          ).PartiallyClosingDialog,
        })),
        l = (0, r.withDialogLazyLoad)(a)
      class i {
        constructor() {
          ;(this.close = (e) => {
            null == e || e(), s.unmountComponentAtNode(this._root)
          }),
            (this._root = document.createElement('div'))
        }
        open(e) {
          const { onClose: t, ...n } = e
          s.render(
            o.createElement(l, {
              isOpen: !0,
              onClose: () => this.close(t),
              ...n,
            }),
            this._root,
          )
        }
      }
    },
    973044: (e, t, n) => {
      n.d(t, { withDialogLazyLoad: () => r })
      var s = n(50959),
        o = n(252130)
      function r(e) {
        return (t) => {
          const n = (0, o.useIsMounted)()
          return (((e) => {
            const [t, n] = (0, s.useState)(!1)
            return (
              (0, s.useEffect)(() => {
                !t && e && n(!0)
              }, [e]),
              t
            )
          })(t.isOpen) ||
            t.isOpen) &&
            n
            ? s.createElement(
                s.Suspense,
                { fallback: null },
                s.createElement(e, { ...t }),
              )
            : null
        }
      }
    },
  },
])
