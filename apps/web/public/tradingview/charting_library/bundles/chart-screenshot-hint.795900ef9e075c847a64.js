;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [92],
  {
    45350: (e) => {
      e.exports = {
        'nav-button': 'nav-button-znwuaSC1',
        link: 'link-znwuaSC1',
        background: 'background-znwuaSC1',
        icon: 'icon-znwuaSC1',
        'flip-icon': 'flip-icon-znwuaSC1',
        'size-large': 'size-large-znwuaSC1',
        'preserve-paddings': 'preserve-paddings-znwuaSC1',
        'size-medium': 'size-medium-znwuaSC1',
        'size-small': 'size-small-znwuaSC1',
        'size-xsmall': 'size-xsmall-znwuaSC1',
        'size-xxsmall': 'size-xxsmall-znwuaSC1',
        'visually-hidden': 'visually-hidden-znwuaSC1',
      }
    },
    48535: (e) => {
      e.exports = {
        container: 'container-TCHLKPuQ',
        'container-danger': 'container-danger-TCHLKPuQ',
        'light-title': 'light-title-TCHLKPuQ',
        'light-icon': 'light-icon-TCHLKPuQ',
        icon: 'icon-TCHLKPuQ',
        header: 'header-TCHLKPuQ',
        'light-container-danger': 'light-container-danger-TCHLKPuQ',
        'container-warning': 'container-warning-TCHLKPuQ',
        'light-container-warning': 'light-container-warning-TCHLKPuQ',
        'container-success': 'container-success-TCHLKPuQ',
        'light-container-success': 'light-container-success-TCHLKPuQ',
        'container-default': 'container-default-TCHLKPuQ',
        'light-container-default': 'light-container-default-TCHLKPuQ',
        'text-wrap': 'text-wrap-TCHLKPuQ',
        'light-text-wrap': 'light-text-wrap-TCHLKPuQ',
        'close-button': 'close-button-TCHLKPuQ',
        'light-close-button': 'light-close-button-TCHLKPuQ',
        informerBody: 'informerBody-TCHLKPuQ',
        mainProblem: 'mainProblem-TCHLKPuQ',
        'header-inline': 'header-inline-TCHLKPuQ',
        'header-new-line': 'header-new-line-TCHLKPuQ',
      }
    },
    44777: (e) => {
      e.exports = {
        container: 'container-Q8oybhDM',
        centerElement: 'centerElement-Q8oybhDM',
        notice: 'notice-Q8oybhDM',
        noticeShowed: 'noticeShowed-Q8oybhDM',
      }
    },
    57340: (e, t, n) => {
      n.d(t, { CloseButton: () => d })
      var r = n(50959),
        i = n(64388),
        o = n(17105),
        a = n(15130),
        s = n(38822),
        l = n(63346),
        c = n(34983)
      function u(e = 'large') {
        switch (e) {
          case 'large':
            return o
          case 'medium':
          default:
            return a
          case 'small':
            return s
          case 'xsmall':
            return l
          case 'xxsmall':
            return c
        }
      }
      const d = r.forwardRef((e, t) =>
        r.createElement(i.NavButton, { ...e, ref: t, icon: u(e.size) }),
      )
    },
    64388: (e, t, n) => {
      n.d(t, { NavButton: () => c })
      var r = n(50959),
        i = n(97754),
        o = n(9745),
        a = n(45350)
      function s(e) {
        const {
          size: t = 'large',
          preservePaddings: n,
          isLink: r,
          flipIconOnRtl: o,
          className: s,
        } = e
        return i(
          a['nav-button'],
          a[`size-${t}`],
          n && a['preserve-paddings'],
          o && a['flip-icon'],
          r && a.link,
          s,
        )
      }
      function l(e) {
        const { children: t, icon: n } = e
        return r.createElement(
          r.Fragment,
          null,
          r.createElement('span', { className: a.background }),
          r.createElement(o.Icon, {
            icon: n,
            className: a.icon,
            'aria-hidden': !0,
          }),
          t && r.createElement('span', { className: a['visually-hidden'] }, t),
        )
      }
      const c = (0, r.forwardRef)((e, t) => {
        const {
          icon: n,
          type: i = 'button',
          preservePaddings: o,
          flipIconOnRtl: a,
          size: c,
          'aria-label': u,
          ...d
        } = e
        return r.createElement(
          'button',
          { ...d, className: s({ ...e, children: u }), ref: t, type: i },
          r.createElement(l, { icon: n }, u),
        )
      })
      c.displayName = 'NavButton'
      var u = n(21593),
        d = n(53017)
      ;(0, r.forwardRef)((e, t) => {
        const { icon: n, renderComponent: i, 'aria-label': o, ...a } = e,
          c = null != i ? i : u.CustomComponentDefaultLink
        return r.createElement(
          c,
          {
            ...a,
            className: s({ ...e, children: o, isLink: !0 }),
            reference: (0, d.isomorphicRef)(t),
          },
          r.createElement(l, { icon: n }, o),
        )
      }).displayName = 'NavAnchorButton'
    },
    38952: (e, t, n) => {
      function r(e) {
        const { reference: t, ...n } = e
        return { ...n, ref: t }
      }
      n.d(t, { renameRef: () => r })
    },
    21593: (e, t, n) => {
      n.d(t, { CustomComponentDefaultLink: () => o })
      var r = n(50959),
        i = n(38952)
      function o(e) {
        return r.createElement('a', { ...(0, i.renameRef)(e) })
      }
      r.PureComponent
    },
    9745: (e, t, n) => {
      n.d(t, { Icon: () => i })
      var r = n(50959)
      const i = r.forwardRef((e, t) => {
        const { icon: n = '', ...i } = e
        return r.createElement('span', {
          ...i,
          ref: t,
          dangerouslySetInnerHTML: { __html: n },
        })
      })
    },
    90186: (e, t, n) => {
      function r(e) {
        return o(e, a)
      }
      function i(e) {
        return o(e, s)
      }
      function o(e, t) {
        const n = Object.entries(e).filter(t),
          r = {}
        for (const [e, t] of n) r[e] = t
        return r
      }
      function a(e) {
        const [t, n] = e
        return 0 === t.indexOf('data-') && 'string' == typeof n
      }
      function s(e) {
        return 0 === e[0].indexOf('aria-')
      }
      n.d(t, {
        filterAriaProps: () => i,
        filterDataProps: () => r,
        filterProps: () => o,
        isAriaAttribute: () => s,
        isDataAttribute: () => a,
      })
    },
    53017: (e, t, n) => {
      function r(e) {
        return (t) => {
          e.forEach((e) => {
            'function' == typeof e ? e(t) : null != e && (e.current = t)
          })
        }
      }
      function i(e) {
        return r([e])
      }
      n.d(t, { isomorphicRef: () => i, mergeRefs: () => r })
    },
    89168: (e, t, n) => {
      n.r(t), n.d(t, { ChartScreenshotHintRenderer: () => C })
      var r = n(50959),
        i = n(962),
        o = n(12481),
        a = n(97754),
        s = n(9745),
        l = n(57340),
        c = n(90186),
        u = n(30162),
        d = n(27941),
        h = n(99084),
        m = n(48535),
        w = n.n(m)
      const g = { danger: u, warning: u, success: h, default: d }
      function p(e) {
        const {
          informerIntent: t,
          content: n,
          className: i,
          header: o,
          isIconShown: u = !0,
          isCloseButtonShown: d,
          icon: h,
          onCloseClick: m,
          closeButtonLabel: p = 'Close',
          headerPlacement: f = 'inline',
          children: v,
          isLight: C,
        } = e
        return r.createElement(
          'div',
          {
            className: a(
              w().container,
              w()[`container-${t}`],
              C && w()[`light-container-${t}`],
              i,
            ),
            ...(0, c.filterDataProps)(e),
            ...(0, c.filterAriaProps)(e),
          },
          r.createElement(
            'div',
            { className: w().informerBody },
            n &&
              r.createElement(
                'div',
                { className: w().mainProblem },
                u &&
                  r.createElement(s.Icon, {
                    className: a(w().icon, C && w()['light-icon']),
                    icon: null != h ? h : g[t],
                  }),
                r.createElement(
                  'div',
                  {
                    className: a(w()['text-wrap'], C && w()['light-text-wrap']),
                  },
                  o &&
                    r.createElement(
                      'span',
                      {
                        className: a(
                          C && w()['light-title'],
                          w().header,
                          w()[`header-${C ? 'new-line' : f}`],
                        ),
                      },
                      o,
                    ),
                  r.createElement('span', null, ' ', n),
                ),
              ),
            v,
          ),
          d &&
            r.createElement(l.CloseButton, {
              'aria-label': p,
              onClick: m,
              className: a(C && w()['light-close-button'], w()['close-button']),
              size: C ? 'xxsmall' : 'xsmall',
              preservePaddings: !C,
            }),
        )
      }
      var f = n(44777)
      function v(e) {
        const {
            text: t,
            style: n,
            hideTimeout: i,
            informerIntent: o = 'success',
          } = e,
          s = ((e) => {
            const [t, n] = (0, r.useState)(!1)
            return (
              (0, r.useLayoutEffect)(() => {
                const t = setTimeout(() => n(!0), 50),
                  r = setTimeout(() => n(!1), null != e ? e : 2500)
                return () => {
                  clearTimeout(t), clearTimeout(r)
                }
              }, []),
              t
            )
          })(i)
        return r.createElement(
          'div',
          { className: f.container, style: n },
          r.createElement(
            'div',
            { className: f.centerElement },
            r.createElement(p, {
              content: t,
              informerIntent: o,
              className: a(f.notice, s && f.noticeShowed),
            }),
          ),
        )
      }
      class C {
        constructor(e, t) {
          ;(this._showed = !1),
            (this._wrap = document.createElement('div')),
            (this._container = e),
            (this._debouncedHide = (0, o.default)(() => this.hide(), 3e3)),
            (this._bottomPadding = t.bottomPadding)
        }
        show(e) {
          this._wrap &&
            !this._showed &&
            ((this._showed = !0),
            this._container.append(this._wrap),
            i.render(
              r.createElement(v, {
                text: e,
                style: this._bottomPadding ? { bottom: 70 } : void 0,
              }),
              this._wrap,
            ),
            this._debouncedHide())
        }
        hide() {
          this._wrap &&
            ((this._showed = !1),
            i.unmountComponentAtNode(this._wrap),
            this._wrap.remove())
        }
        destroy() {
          this.hide(), delete this._wrap
        }
      }
    },
    99084: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm3.87-12.15c.36.2.49.66.28 1.02l-4 7a.75.75 0 0 1-1.18.16l-3-3a.75.75 0 1 1 1.06-1.06l2.3 2.3 3.52-6.14a.75.75 0 0 1 1.02-.28Z"/></svg>'
    },
    30162: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM9 4c-.79 0-1.38.7-1.25 1.48l.67 4.03a.59.59 0 0 0 1.16 0l.67-4.03A1.27 1.27 0 0 0 9 4Zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>'
    },
    27941: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM8 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm1 2c.49 0 1 .59 1 1v3.01c0 .42-.51.99-1 .99s-1-.57-1-.99V9c0-.41.51-1 1-1Z"/></svg>'
    },
    17105: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 21 21m0-21-21 21"/></svg>'
    },
    15130: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 15 15m0-15-15 15"/></svg>'
    },
    38822: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 11 11m0-11-11 11"/></svg>'
    },
    63346: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 9 9m0-9-9 9"/></svg>'
    },
    34983: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="10" height="10"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 7 7m0-7-7 7"/></svg>'
    },
  },
])
