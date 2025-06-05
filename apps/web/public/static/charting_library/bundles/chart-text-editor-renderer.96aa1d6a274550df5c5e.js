;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5592],
  {
    43982: (e, t, n) => {
      n.d(t, { useProperty: () => u })
      var o = n(50959)
      const u = (e) => {
        const [t, n] = (0, o.useState)(e.value())
        return (
          (0, o.useEffect)(() => {
            const t = (e) => {
              n(e.value())
            }
            t(e)
            const o = {}
            return e.subscribe(o, t), () => e.unsubscribe(o, t)
          }, [e]),
          t
        )
      }
    },
    77975: (e, t, n) => {
      n.d(t, { useWatchedValueReadonly: () => u })
      var o = n(50959)
      const u = (e, t = !1, n = []) => {
        const u = 'watchedValue' in e ? e.watchedValue : void 0,
          a = 'defaultValue' in e ? e.defaultValue : e.watchedValue.value(),
          [r, c] = (0, o.useState)(u ? u.value() : a)
        return (
          (t ? o.useLayoutEffect : o.useEffect)(() => {
            if (u) {
              c(u.value())
              const e = (e) => c(e)
              return u.subscribe(e), () => u.unsubscribe(e)
            }
            return () => {}
          }, [u, ...n]),
          r
        )
      }
    },
    29185: (e, t, n) => {
      n.d(t, { useWatchedValue: () => u })
      var o = n(50959)
      const u = (e, t = []) => {
        const [n, u] = (0, o.useState)(e.value())
        return (
          (0, o.useEffect)(() => {
            const t = (e) => u(e)
            return e.subscribe(t), () => e.unsubscribe(t)
          }, [e, ...t]),
          [n, (t) => e.setValue(t)]
        )
      }
    },
    5390: (e) => {
      e.exports = { padding: '2', textArea: 'textArea-pBDekXDd' }
    },
    99514: (e, t, n) => {
      n.r(t),
        n.d(t, {
          closeChartEditorText: () => _,
          updateChartEditorText: () => x,
        })
      var o = n(50959),
        u = n(32227),
        a = n(50151),
        r = n(14729),
        c = n(77975),
        i = n(29185),
        s = n(43982),
        l = n(68335),
        d = n(12988),
        f = n(5390)
      const v = Number.parseInt(f.padding),
        h = new Map([
          ['10b_2', 0.15],
          ['10bi_2', 0.15],
          ['12_3', 0.8],
          ['12b_2', 0.5],
          ['12bi_2', 0.45],
          ['14b_2', 0.65],
          ['14bi_2', 0.65],
          ['16_2.5', 0.8],
          ['16b_2', 0.8],
          ['16bi_2', 0.75],
          ['16b_2.5', 0.8],
          ['16bi_2.5', 0.75],
          ['16bi_3', 0.65],
          ['20_2', 1],
          ['20b_2', 0.8],
          ['20bi_2', 0.75],
          ['20bi_3', 0.55],
          ['20_2.5', 0.25],
          ['20_3', 0.8],
          ['24_2.5', 0.95],
          ['24_3', 0.95],
          ['28_2', 1.4],
          ['28_2.5', 1.38],
          ['28_3', 1.38],
          ['32_2', 1.6],
          ['32_2.5', 1.6],
          ['32_3', 1.6],
        ]),
        b = new d.Property(!1)
      function p(e) {
        const {
            text: t,
            wordWrap: n = b,
            textInfo: u,
            placeholder: d,
            forbidLineBreaks: p,
            maxLength: _,
            onClose: x,
            onSelectionChange: m,
            onContextMenu: g,
          } = e,
          [w, E] = (0, i.useWatchedValue)(t),
          S = (0, s.useProperty)(n),
          C = (0, c.useWatchedValueReadonly)({ watchedValue: u }),
          {
            font: V,
            fontSize: y,
            textLeft: M,
            textTop: R,
            textBottom: L,
            textRight: P,
            textAlign: k,
            centerRotation: A,
            lineSpacing: D,
          } = (0, a.ensureNotNull)((0, a.ensureDefined)(C)),
          W = Math.ceil(P - M) + 1,
          B = Math.ceil(L - R)
        let N,
          F,
          T = 0
        void 0 === A || 0 === A.angle
          ? ((N = Math.round(R)), (F = Math.round(M)))
          : ((F = A.x - W / 2), (N = A.y - B / 2), (T = A.angle))
        const I = V.includes('bold') ? 'b' : '',
          $ = V.includes('italic') ? 'i' : '',
          z =
            devicePixelRatio <= 2 || devicePixelRatio >= 3
              ? devicePixelRatio
              : devicePixelRatio < 2.5
                ? 2
                : 2.5,
          H = h.get(y + I + $ + '_' + z),
          K = (0, o.useRef)(null),
          [U, X] = (0, o.useState)(!0),
          j = (0, o.useMemo)(() => performance.now(), [])
        return (
          (0, o.useEffect)(() => {
            const e = () => {
              const e = K.current
              e && m({ start: e.selectionStart, end: e.selectionEnd })
            }
            return (
              document.addEventListener('mousemove', e),
              document.addEventListener('touchmove', e),
              e(),
              () => {
                document.removeEventListener('mousemove', e),
                  document.removeEventListener('touchmove', e)
              }
            )
          }, []),
          o.createElement('textarea', {
            ref: K,
            placeholder: d,
            style: {
              width: W + 2 * v,
              height: B + 2 * v,
              top: N - v,
              left: F - v,
              font: V,
              lineHeight: `${y + D}px`,
              textAlign: k,
              letterSpacing: S ? H + 'px' : 'normal',
              rotate: T ? `${T}rad` : void 0,
            },
            maxLength: _,
            className: f.textArea,
            'data-name': 'text-editor',
            value: w,
            onClick: (e) => q(e),
            onMouseDown: (e) =>
              ((e) => {
                X(!1), q(e)
              })(e),
            onMouseUp: (e) =>
              ((e) => {
                if (U) return void X(!1)
                q(e)
              })(e),
            onChange: (e) => E(e.target.value),
            onFocus: (e) =>
              ((e) => {
                const t = w.length
                e.setSelectionRange(t, t)
              })(e.target),
            onBlur: x,
            onKeyDown: (e) => {
              const t = (0, l.hashFromEvent)(e)
              ;(27 === t || (p && 13 === t)) && K.current?.blur()
            },
            onSelect: (e) => {
              const t = e.target
              m({ start: t.selectionStart, end: t.selectionEnd })
            },
            onContextMenu: async (e) => {
              if (!g) return
              ;(0, r.preventDefault)(e), g(e)
            },
            autoFocus: !0,
          })
        )
        function q(e) {
          performance.now() - j > 500 && e.stopPropagation()
        }
      }
      function _(e) {
        u.unmountComponentAtNode(e)
      }
      function x(e, t) {
        u.render(o.createElement(p, { ...t }), e)
      }
    },
  },
])
