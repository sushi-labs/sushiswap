;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4010],
  {
    678370: (e) => {
      e.exports = {
        'intent-default': 'intent-default-EZuD3gZZ',
        'intent-danger': 'intent-danger-EZuD3gZZ',
        'intent-warning': 'intent-warning-EZuD3gZZ',
        'intent-success': 'intent-success-EZuD3gZZ',
        'icon-wrapper-size-small': 'icon-wrapper-size-small-EZuD3gZZ',
        'icon-wrapper-size-medium': 'icon-wrapper-size-medium-EZuD3gZZ',
        'icon-wrapper-size-large': 'icon-wrapper-size-large-EZuD3gZZ',
        'icon-wrapper': 'icon-wrapper-EZuD3gZZ',
        icon: 'icon-EZuD3gZZ',
      }
    },
    342335: (e) => {
      e.exports = {
        'icon-wrapper': 'icon-wrapper-dikdewwx',
        'with-tooltip': 'with-tooltip-dikdewwx',
        'no-active-state': 'no-active-state-dikdewwx',
      }
    },
    187962: (e, t, o) => {
      o.d(t, { IconQuestionInformation: () => b })
      var n = o(50959),
        r = o(497754),
        a = o(800417),
        i = o(72571),
        c = o(482353),
        l = o(527941),
        s = o(499084),
        u = o(530162),
        p = o(678370),
        m = o.n(p)
      const d = 'small',
        f = { info: l, question: c, check: s, exclamation: u }
      function w(e, t) {
        return t ? f[t] : 'success' === e ? f.check : f.exclamation
      }
      const h = n.forwardRef((e, t) =>
          n.createElement('span', {
            ...e,
            ref: t,
            className: r(e.className, m()['no-active-state']),
          }),
        ),
        v = n.forwardRef((e, t) => {
          const {
            icon: o,
            intent: c = 'default',
            ariaLabel: l,
            tooltip: s,
            className: u,
            renderComponent: p = h,
            tabIndex: f = 0,
            size: v = d,
            onFocus: g,
            onBlur: Z,
            onClick: E,
            ...k
          } = e
          return n.createElement(
            p,
            {
              className: r(
                u,
                m()['icon-wrapper'],
                m()[`intent-${c}`],
                m()[`icon-wrapper-size-${v}`],
              ),
              title: s,
              'aria-label': l,
              ref: t,
              tabIndex: f,
              onFocus: g,
              onBlur: Z,
              onClick: E,
              ...(0, a.filterDataProps)(k),
            },
            n.createElement(i.Icon, {
              'aria-hidden': !0,
              icon: w(c, o),
              className: m().icon,
            }),
          )
        })
      var g = o(804395)
      var Z = o(718736)
      function E(e, t = null) {
        const {
            showTooltip: o,
            hideTooltip: r,
            onClick: a,
            doNotShowTooltipOnTouch: i = !1,
          } = e,
          c = (0, Z.useFunctionalRefObject)(t),
          l = (() => {
            const [e, t] = (0, n.useState)(!1)
            return (
              (0, n.useEffect)(() => {
                t(g.mobiletouch)
              }, []),
              e
            )
          })(),
          s = l && i ? void 0 : e.tooltip
        ;(0, n.useEffect)(() => {
          const e = () => {
            var e
            null === (e = null == c ? void 0 : c.current) ||
              void 0 === e ||
              e.blur()
          }
          return (
            document.addEventListener('scroll', e, !0),
            () => document.removeEventListener('scroll', e, !0)
          )
        }, [c])
        return {
          onBlur: (0, n.useCallback)(
            (e) => {
              r && r()
            },
            [r],
          ),
          onFocus: (0, n.useCallback)(
            (e) => {
              !e.target.matches(':hover') &&
                o &&
                e.target.matches(':focus-visible') &&
                o(e.currentTarget, { tooltipDelay: 200 })
            },
            [o],
          ),
          onClick: (0, n.useCallback)(
            (e) => {
              var t
              l &&
                (null === (t = null == c ? void 0 : c.current) ||
                  void 0 === t ||
                  t.focus()),
                a && a(e)
            },
            [a, c, l],
          ),
          tooltip: s,
          className: void 0 !== s ? 'apply-common-tooltip' : void 0,
          ref: c,
        }
      }
      var k = o(744471),
        C = o(342335),
        N = o.n(C)
      const b = (0, n.forwardRef)((e, t) => {
        const {
            className: o,
            onClick: a = k.tooltipClickHandler,
            doNotShowTooltipOnTouch: i,
            ...c
          } = e,
          {
            tooltip: l,
            className: s,
            ...u
          } = E(
            {
              tooltip: e.tooltip,
              doNotShowTooltipOnTouch: i,
              showTooltip: k.showOnElement,
              hideTooltip: k.hide,
              onClick: a,
            },
            t,
          )
        return n.createElement(v, {
          className: r(o, N()['icon-wrapper'], l && N()['with-tooltip'], s),
          tooltip: l,
          ...c,
          ...u,
        })
      })
      ;(0, n.forwardRef)((e, t) => {
        const { href: o, rel: r, target: a, ...i } = e,
          c = (0, n.useMemo)(
            () =>
              (0, n.forwardRef)((e, t) =>
                n.createElement('a', {
                  href: o,
                  rel: r,
                  target: a,
                  ref: t,
                  ...e,
                }),
              ),
            [o, r, a],
          )
        return n.createElement(b, {
          ...i,
          renderComponent: c,
          ref: t,
          doNotShowTooltipOnTouch: !0,
        })
      }),
        (0, n.forwardRef)((e, t) => {
          const { className: o, withActiveState: a, ...i } = e,
            c = (0, n.useMemo)(
              () =>
                (0, n.forwardRef)((e, t) =>
                  n.createElement('button', { ...e, ref: t, type: 'button' }),
                ),
              [],
            )
          return n.createElement(b, {
            ...i,
            className: r(o, !a && N()['no-active-state']),
            renderComponent: c,
            ref: t,
          })
        })
    },
    498565: (e) => {
      e.exports = { informer: 'informer-j2_OJJT2' }
    },
    913894: (e, t, o) => {
      o.r(t), o.d(t, { TradingInformerImpl: () => l })
      var n = o(50959),
        r = o(497754),
        a = o.n(r),
        i = o(187962),
        c = o(498565)
      function l(e) {
        const { informerMessage: t, className: o } = e
        return void 0 === t
          ? n.createElement(n.Fragment, null)
          : n.createElement(i.IconQuestionInformation, {
              tooltip: t,
              ariaLabel: t,
              icon: 'info',
              className: a()(c.informer, o),
            })
      }
    },
    482353: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM6 7.5a3 3 0 1 1 6 0c0 .96-.6 1.48-1.17 1.98-.55.48-1.08.95-1.08 1.77h-1.5c0-1.37.7-1.9 1.33-2.38.49-.38.92-.71.92-1.37C10.5 6.67 9.82 6 9 6s-1.5.67-1.5 1.5H6Z"/></svg>'
    },
  },
])
