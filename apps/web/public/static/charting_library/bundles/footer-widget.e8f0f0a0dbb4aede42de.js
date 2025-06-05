;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7707],
  {
    259142: (e, t) => {
      var n, i, o
      ;(i = [t]),
        (n = (e) => {
          function t(e) {
            if (Array.isArray(e)) {
              for (var t = 0, n = Array(e.length); t < e.length; t++)
                n[t] = e[t]
              return n
            }
            return Array.from(e)
          }
          Object.defineProperty(e, '__esModule', { value: !0 })
          var n = !1
          if ('undefined' != typeof window) {
            var i = {
              get passive() {
                n = !0
              },
            }
            window.addEventListener('testPassive', null, i),
              window.removeEventListener('testPassive', null, i)
          }
          var o =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            a = [],
            r = !1,
            s = -1,
            l = void 0,
            c = void 0,
            u = (e) =>
              a.some(
                (t) =>
                  !(!t.options.allowTouchMove || !t.options.allowTouchMove(e)),
              ),
            d = (e) => {
              var t = e || window.event
              return (
                !!u(t.target) ||
                1 < t.touches.length ||
                (t.preventDefault && t.preventDefault(), !1)
              )
            },
            m = () => {
              setTimeout(() => {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== l &&
                    ((document.body.style.overflow = l), (l = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, i) => {
            if (o) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !a.some((t) => t.targetElement === e)) {
                var m = { targetElement: e, options: i || {} }
                ;(a = [].concat(t(a), [m])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (s = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var n, i, o, a
                    1 === t.targetTouches.length &&
                      ((i = e),
                      (a = (n = t).targetTouches[0].clientY - s),
                      !u(n.target) &&
                        ((i && 0 === i.scrollTop && 0 < a) ||
                        ((o = i) &&
                          o.scrollHeight - o.scrollTop <= o.clientHeight &&
                          a < 0)
                          ? d(n)
                          : n.stopPropagation()))
                  }),
                  r ||
                    (document.addEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (r = !0))
              }
            } else {
              ;(v = i),
                setTimeout(() => {
                  if (void 0 === c) {
                    var e = !!v && !0 === v.reserveScrollBarGap,
                      t =
                        window.innerWidth - document.documentElement.clientWidth
                    e &&
                      0 < t &&
                      ((c = document.body.style.paddingRight),
                      (document.body.style.paddingRight = t + 'px'))
                  }
                  void 0 === l &&
                    ((l = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var h = { targetElement: e, options: i || {} }
              a = [].concat(t(a), [h])
            }
            var v
          }),
            (e.clearAllBodyScrollLocks = () => {
              o
                ? (a.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  r &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (r = !1)),
                  (a = []),
                  (s = -1))
                : (m(), (a = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (o) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (a = a.filter((t) => t.targetElement !== e)),
                  r &&
                    0 === a.length &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (r = !1))
              } else
                1 === a.length && a[0].targetElement === e
                  ? (m(), (a = []))
                  : (a = a.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (o = 'function' == typeof n ? n.apply(t, i) : n) ||
          (e.exports = o)
    },
    718736: (e, t, n) => {
      n.d(t, { useFunctionalRefObject: () => a })
      var i = n(50959),
        o = n(855393)
      function a(e) {
        const t = (0, i.useMemo)(
            () =>
              ((e) => {
                const t = (n) => {
                  e(n), (t.current = n)
                }
                return (t.current = null), t
              })((e) => {
                s.current(e)
              }),
            [],
          ),
          n = (0, i.useRef)(null),
          a = (t) => {
            if (null === t) return r(n.current, t), void (n.current = null)
            n.current !== e && ((n.current = e), r(n.current, t))
          },
          s = (0, i.useRef)(a)
        return (
          (s.current = a),
          (0, o.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return s.current(t.current), () => s.current(null)
          }, [e]),
          t
        )
      }
      function r(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    855393: (e, t, n) => {
      n.d(t, { useIsomorphicLayoutEffect: () => o })
      var i = n(50959)
      function o(e, t) {
        ;('undefined' == typeof window ? i.useEffect : i.useLayoutEffect)(e, t)
      }
    },
    72571: (e, t, n) => {
      n.d(t, { Icon: () => o })
      var i = n(50959)
      const o = i.forwardRef((e, t) => {
        const { icon: n = '', ...o } = e
        return i.createElement('span', {
          ...o,
          ref: t,
          dangerouslySetInnerHTML: { __html: n },
        })
      })
    },
    111706: (e, t, n) => {
      function i(e) {
        return 0 === e.detail
      }
      n.d(t, { isKeyboardClick: () => i })
    },
    269842: (e, t, n) => {
      function i(...e) {
        return (t) => {
          for (const n of e) void 0 !== n && n(t)
        }
      }
      n.d(t, { createSafeMulticastEventHandler: () => i })
    },
    865266: (e, t, n) => {
      n.d(t, { useRovingTabindexElement: () => r })
      var i = n(50959),
        o = n(718736),
        a = n(892932)
      function r(e, t = []) {
        const [n, r] = (0, i.useState)(!1),
          s = (0, o.useFunctionalRefObject)(e)
        return (
          (0, i.useLayoutEffect)(() => {
            if (!a.PLATFORM_ACCESSIBILITY_ENABLED) return
            const e = s.current
            if (null === e) return
            const t = (e) => {
              switch (e.type) {
                case 'roving-tabindex:main-element':
                  r(!0)
                  break
                case 'roving-tabindex:secondary-element':
                  r(!1)
              }
            }
            return (
              e.addEventListener('roving-tabindex:main-element', t),
              e.addEventListener('roving-tabindex:secondary-element', t),
              () => {
                e.removeEventListener('roving-tabindex:main-element', t),
                  e.removeEventListener('roving-tabindex:secondary-element', t)
              }
            )
          }, t),
          [s, a.PLATFORM_ACCESSIBILITY_ENABLED ? (n ? 0 : -1) : void 0]
        )
      }
    },
    47102: (e) => {
      e.exports = {
        accessible: 'accessible-NQERJsv9',
        active: 'active-NQERJsv9',
      }
    },
    502869: (e) => {
      e.exports = { button: 'button-xNqEcuN2' }
    },
    311138: (e) => {
      e.exports = { tab: 'tab-jJ_D7IlA', accessible: 'accessible-jJ_D7IlA' }
    },
    560881: (e) => {
      e.exports = {
        tabbar: 'tabbar-n3UmcVi3',
        tabs: 'tabs-n3UmcVi3',
        fakeTabs: 'fakeTabs-n3UmcVi3',
        tab: 'tab-n3UmcVi3',
        menuButtonWrap: 'menuButtonWrap-n3UmcVi3',
        hover: 'hover-n3UmcVi3',
        clicked: 'clicked-n3UmcVi3',
        active: 'active-n3UmcVi3',
        title: 'title-n3UmcVi3',
        titleText: 'titleText-n3UmcVi3',
        menuButton: 'menuButton-n3UmcVi3',
      }
    },
    265577: (e) => {
      e.exports = { 'css-value-footer-widget-horizontal-margin': '4px' }
    },
    163787: (e) => {
      e.exports = {
        footerPanel: 'footerPanel-dA6R3Y1X',
        buttons: 'buttons-dA6R3Y1X',
        hidden: 'hidden-dA6R3Y1X',
        button: 'button-dA6R3Y1X',
        firstButton: 'firstButton-dA6R3Y1X',
        overlap: 'overlap-dA6R3Y1X',
      }
    },
    179807: (e, t, n) => {
      n.d(t, {
        focusFirstMenuItem: () => c,
        handleAccessibleMenuFocus: () => s,
        handleAccessibleMenuKeyDown: () => l,
        queryMenuElements: () => m,
      })
      var i = n(892932),
        o = n(27164),
        a = n(180185)
      const r = [37, 39, 38, 40]
      function s(e, t) {
        e.target &&
          i.PLATFORM_ACCESSIBILITY_ENABLED &&
          e.relatedTarget === t.current &&
          c(e.target)
      }
      function l(e) {
        var t
        if (!i.PLATFORM_ACCESSIBILITY_ENABLED) return
        if (e.defaultPrevented) return
        const n = (0, a.hashFromEvent)(e)
        if (!r.includes(n)) return
        const s = document.activeElement
        if (!(document.activeElement instanceof HTMLElement)) return
        const l = m(e.currentTarget).sort(i.navigationOrderComparator)
        if (0 === l.length) return
        const c =
          document.activeElement.closest('[data-role="menuitem"]') ||
          (null === (t = document.activeElement.parentElement) || void 0 === t
            ? void 0
            : t.querySelector('[data-role="menuitem"]'))
        if (!(c instanceof HTMLElement)) return
        const v = l.indexOf(c)
        if (-1 === v) return
        const p = h(c),
          f = p.indexOf(document.activeElement),
          g = -1 !== f,
          b = (e) => {
            s && (0, o.becomeSecondaryElement)(s),
              (0, o.becomeMainElement)(e),
              e.focus()
          }
        switch ((0, i.mapKeyCodeToDirection)(n)) {
          case 'inlinePrev':
            if (!p.length) return
            e.preventDefault(),
              b(0 === f ? l[v] : g ? u(p, f, -1) : p[p.length - 1])
            break
          case 'inlineNext':
            if (!p.length) return
            e.preventDefault(),
              f === p.length - 1 ? b(l[v]) : b(g ? u(p, f, 1) : p[0])
            break
          case 'blockPrev': {
            e.preventDefault()
            const t = u(l, v, -1)
            if (g) {
              const e = d(t, f)
              b(e || t)
              break
            }
            b(t)
            break
          }
          case 'blockNext': {
            e.preventDefault()
            const t = u(l, v, 1)
            if (g) {
              const e = d(t, f)
              b(e || t)
              break
            }
            b(t)
          }
        }
      }
      function c(e) {
        const [t] = m(e)
        t && ((0, o.becomeMainElement)(t), t.focus())
      }
      function u(e, t, n) {
        return e[(t + e.length + n) % e.length]
      }
      function d(e, t) {
        const n = h(e)
        return n.length ? n[(t + n.length) % n.length] : null
      }
      function m(e) {
        return Array.from(
          e.querySelectorAll(
            '[data-role="menuitem"]:not([disabled]):not([aria-disabled])',
          ),
        ).filter((0, i.createScopedVisibleElementFilter)(e))
      }
      function h(e) {
        return Array.from(
          e.querySelectorAll('[tabindex]:not([disabled]):not([aria-disabled])'),
        ).filter((0, i.createScopedVisibleElementFilter)(e))
      }
    },
    27164: (e, t, n) => {
      function i(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function o(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      n.d(t, { becomeMainElement: () => i, becomeSecondaryElement: () => o })
    },
    869194: (e, t, n) => {
      n.d(t, { useMouseClickAutoBlur: () => r })
      var i = n(50959),
        o = n(111706),
        a = n(892932)
      function r(e, t = !0) {
        ;(0, i.useEffect)(() => {
          if (!a.PLATFORM_ACCESSIBILITY_ENABLED || !t) return
          const n = (t) => {
            const n = e.current
            null !== n &&
              document.activeElement instanceof HTMLElement &&
              ((0, o.isKeyboardClick)(t) ||
                (n.contains(document.activeElement) &&
                  'INPUT' !== document.activeElement.tagName &&
                  document.activeElement.blur()))
          }
          return (
            window.addEventListener('click', n, !0),
            () => window.removeEventListener('click', n, !0)
          )
        }, [t])
      }
    },
    137869: (e, t, n) => {
      n.d(t, { AccessibleMenuItem: () => d })
      var i = n(50959),
        o = n(497754),
        a = n.n(o),
        r = n(930202),
        s = n(865266),
        l = n(892932),
        c = n(192063),
        u = n(47102)
      function d(e) {
        const { className: t, ...n } = e,
          [o, d] = (0, s.useRovingTabindexElement)(null)
        return i.createElement(c.PopupMenuItem, {
          ...n,
          className: a()(
            l.PLATFORM_ACCESSIBILITY_ENABLED && u.accessible,
            e.isActive && u.active,
            t,
          ),
          reference: o,
          tabIndex: d,
          onKeyDown: (e) => {
            if (
              !l.PLATFORM_ACCESSIBILITY_ENABLED ||
              e.target !== e.currentTarget
            )
              return
            const t = (0, r.hashFromEvent)(e)
            ;(13 !== t && 32 !== t) ||
              (e.preventDefault(),
              o.current instanceof HTMLElement && o.current.click())
          },
          'data-role': l.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          'aria-disabled':
            (l.PLATFORM_ACCESSIBILITY_ENABLED && e.isDisabled) || void 0,
        })
      }
    },
    395907: (e, t, n) => {
      n.d(t, { ToolWidgetIconButton: () => s })
      var i = n(50959),
        o = n(497754),
        a = n(747633),
        r = n(502869)
      const s = i.forwardRef((e, t) => {
        const { className: n, id: s, ...l } = e
        return i.createElement(a.ToolWidgetButton, {
          id: s,
          'data-name': s,
          ...l,
          ref: t,
          className: o(n, r.button),
        })
      })
    },
    332913: (e, t, n) => {
      n.d(t, { ToolbarIconButton: () => s })
      var i = n(50959),
        o = n(865266),
        a = n(892932),
        r = n(395907)
      const s = (0, i.forwardRef)((e, t) => {
        const { tooltip: n, ...s } = e,
          [l, c] = (0, o.useRovingTabindexElement)(t)
        return i.createElement(r.ToolWidgetIconButton, {
          'aria-label': a.PLATFORM_ACCESSIBILITY_ENABLED ? n : void 0,
          ...s,
          tag: a.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
          ref: l,
          tabIndex: c,
          'data-tooltip': n,
        })
      })
    },
    53431: (e, t, n) => {
      n.d(t, { ToolbarMenuButton: () => u })
      var i = n(50959),
        o = n(718736),
        a = n(518799),
        r = n(865266),
        s = n(892932),
        l = n(869194),
        c = n(179807)
      const u = (0, i.forwardRef)((e, t) => {
        const { tooltip: n, menuReference: u = null, ...d } = e,
          [m, h] = (0, r.useRovingTabindexElement)(null),
          v = (0, o.useFunctionalRefObject)(u)
        return (
          (0, l.useMouseClickAutoBlur)(v),
          i.createElement(a.ToolWidgetMenu, {
            'aria-label': s.PLATFORM_ACCESSIBILITY_ENABLED ? n : void 0,
            ...d,
            ref: t,
            tag: s.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
            reference: m,
            tabIndex: h,
            'data-tooltip': n,
            menuReference: v,
            onMenuKeyDown: c.handleAccessibleMenuKeyDown,
            onMenuFocus: (e) => (0, c.handleAccessibleMenuFocus)(e, m),
          })
        )
      })
    },
    622614: (e, t, n) => {
      n.d(t, { Toolbar: () => d })
      var i = n(50959),
        o = n(650151),
        a = n(269842),
        r = n(930202),
        s = n(892932),
        l = n(27164),
        c = n(718736),
        u = n(869194)
      const d = (0, i.forwardRef)((e, t) => {
        const {
            onKeyDown: n,
            orientation: d,
            blurOnEscKeydown: m = !0,
            blurOnClick: h = !0,
            ...v
          } = e,
          p = s.PLATFORM_ACCESSIBILITY_ENABLED
            ? { role: 'toolbar', 'aria-orientation': d }
            : {},
          f = (0, c.useFunctionalRefObject)(t)
        return (
          (0, i.useLayoutEffect)(() => {
            if (!s.PLATFORM_ACCESSIBILITY_ENABLED) return
            const e = (0, o.ensureNotNull)(f.current),
              t = () => {
                const t = (0, s.queryTabbableElements)(e).sort(
                  s.navigationOrderComparator,
                )
                if (0 === t.length) {
                  const [t] = (0, s.queryFocusableElements)(e).sort(
                    s.navigationOrderComparator,
                  )
                  if (void 0 === t) return
                  ;(0, l.becomeMainElement)(t)
                }
                if (t.length > 1) {
                  const [, ...e] = t
                  for (const t of e) (0, l.becomeSecondaryElement)(t)
                }
              }
            return (
              window.addEventListener('keyboard-navigation-activation', t),
              () =>
                window.removeEventListener('keyboard-navigation-activation', t)
            )
          }, []),
          (0, u.useMouseClickAutoBlur)(f, h),
          i.createElement('div', {
            ...v,
            ...p,
            ref: f,
            onKeyDown: (0, a.createSafeMulticastEventHandler)((e) => {
              if (!s.PLATFORM_ACCESSIBILITY_ENABLED) return
              if (e.defaultPrevented) return
              if (!(document.activeElement instanceof HTMLElement)) return
              const t = (0, r.hashFromEvent)(e)
              if (m && 27 === t)
                return e.preventDefault(), void document.activeElement.blur()
              if ('vertical' !== d && 37 !== t && 39 !== t) return
              if ('vertical' === d && 38 !== t && 40 !== t) return
              const n = e.currentTarget,
                i = (0, s.queryFocusableElements)(n).sort(
                  s.navigationOrderComparator,
                )
              if (0 === i.length) return
              const o = i.indexOf(document.activeElement)
              if (-1 === o) return
              e.preventDefault()
              const a = () => {
                  const e = (o + i.length - 1) % i.length
                  ;(0, l.becomeSecondaryElement)(i[o]),
                    (0, l.becomeMainElement)(i[e]),
                    i[e].focus()
                },
                c = () => {
                  const e = (o + i.length + 1) % i.length
                  ;(0, l.becomeSecondaryElement)(i[o]),
                    (0, l.becomeMainElement)(i[e]),
                    i[e].focus()
                }
              switch ((0, s.mapKeyCodeToDirection)(t)) {
                case 'inlinePrev':
                  'vertical' !== d && a()
                  break
                case 'inlineNext':
                  'vertical' !== d && c()
                  break
                case 'blockPrev':
                  'vertical' === d && a()
                  break
                case 'blockNext':
                  'vertical' === d && c()
              }
            }, n),
          })
        )
      })
    },
    17212: (e, t, n) => {
      n.d(t, { FooterToolbarTab: () => c })
      var i = n(50959),
        o = n(497754),
        a = n.n(o),
        r = n(865266),
        s = n(892932),
        l = n(311138)
      function c(e) {
        const { tooltip: t, children: n, className: o, ...c } = e,
          [u, d] = (0, r.useRovingTabindexElement)(null),
          m = s.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div'
        return i.createElement(
          m,
          {
            'aria-label': s.PLATFORM_ACCESSIBILITY_ENABLED ? t : void 0,
            ...c,
            ref: u,
            tabIndex: d,
            type: s.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : void 0,
            'data-tooltip': t,
            className: a()(
              l.tab,
              s.PLATFORM_ACCESSIBILITY_ENABLED && l.accessible,
              o,
            ),
          },
          n,
        )
      }
    },
    754738: (e, t, n) => {
      n.r(t), n.d(t, { FooterWidgetRenderer: () => x })
      var i = n(50959),
        o = n(500962),
        a = n(497754),
        r = n(53431),
        s = n(137869),
        l = n(72571),
        c = n(650151),
        u = n(32133),
        d = n(17212),
        m = n(560881)
      class h extends i.PureComponent {
        constructor() {
          super(...arguments),
            (this._ref = (e) => {
              const { name: t, reference: n } = this.props
              n && n(t, e)
            }),
            (this._onToggle = () => {
              this._toggleWidget()
            }),
            (this._activationCallback = () => {
              this._toggleWidget(!0)
            })
        }
        render() {
          const {
              name: e,
              isActive: t,
              title: n,
              customTitleComponent: o,
              buttonOpenTooltip: r,
              buttonCloseTooltip: s,
              dataName: l,
              className: c,
            } = this.props,
            u = t ? s : r,
            h = o
          return i.createElement(
            'div',
            {
              className: a(m.tab, h && m.customTab, t && m.active, c),
              ref: this._ref,
            },
            h
              ? i.createElement(h, {
                  onClick: this._onToggle,
                  activationCallback: this._activationCallback,
                  isActive: t,
                  dataName: l,
                  tooltip: u,
                })
              : i.createElement(
                  d.FooterToolbarTab,
                  {
                    onClick: this._onToggle,
                    className: a(m.title, u && 'apply-common-tooltip'),
                    'data-name': this.props.dataName,
                    'data-active': t,
                    'aria-pressed': t,
                    tooltip: u,
                  },
                  i.createElement('span', { className: m.titleText }, n || e),
                ),
          )
        }
        _toggleWidget(e) {
          const { name: t, onToggle: n, _gaEvent: i } = this.props
          i && (0, u.trackEvent)('Platform widgets', i), n(t, e)
        }
      }
      var v = n(844996)
      class p extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._fakeTabs = {}),
            (this._fakeMenuButton = null),
            (this._resizeObserver = null),
            (this._refFakeTabs = (e, t) => {
              var n
              ;(this._fakeTabs[e] = t),
                t &&
                  (null === (n = this._resizeObserver) ||
                    void 0 === n ||
                    n.observe(t))
            }),
            (this._handleMeasure = () => {
              this._resize(this.props.width)
            }),
            (this._refFakeMenuButton = (e) => {
              this._fakeMenuButton = e
            }),
            (this._resize = (e) => {
              if (!e) return
              const t = (0, c.ensureNotNull)(this._fakeMenuButton).offsetWidth,
                { activeWidgetName: n } = this.props
              let i = [],
                o = [],
                a = 0
              'string' == typeof n &&
                ((o = [n]),
                (a = (0, c.ensureNotNull)(this._fakeTabs[n]).offsetWidth))
              const r = this.props.widgets.map((e) => e.name),
                s = r.filter((e) => e !== n)
              let l = !1
              s.forEach((n) => {
                if (!this._fakeTabs[n]) return
                const s = (0, c.ensureNotNull)(this._fakeTabs[n]).offsetWidth,
                  u = r.length - o.length == 1 ? e : e - t
                !l && a + s < u ? ((a += s), o.push(n)) : ((l = !0), i.push(n))
              }),
                0 === o.length &&
                  ((o = [r[0]]), (i = i.filter((e) => e !== r[0]))),
                (o = r.filter((e) => o.includes(e))),
                this.setState({ visibleTabs: o, hiddenTabs: i })
            }),
            (this._onToggle = (e, t) => {
              void 0 !== e &&
                (this._trackButtonClick(e),
                (0, o.flushSync)(() => this.props.setActiveWidget(e, t)),
                this._resize(this.props.width))
            }),
            (this._onMenuItemClick = (e) => {
              this._onToggle(e, !0)
            }),
            (this._handleMenuClick = () => {
              this._trackButtonClick('menu'), this._toggleMenu()
            }),
            (this._toggleMenu = () => {
              this.setState((e) => ({ isMenuOpened: !e.isMenuOpened }))
            }),
            (this._trackButtonClick = (e) => {
              0
            }),
            (this._resizeObserver = new ResizeObserver(this._handleMeasure)),
            (this.state = { visibleTabs: [], hiddenTabs: [], isMenuOpened: !1 })
        }
        componentDidMount() {
          this._resize(this.props.width)
        }
        componentDidUpdate(e) {
          const { widgets: t, activeWidgetName: n, width: i } = this.props
          ;(e.widgets === t && e.activeWidgetName === n && e.width === i) ||
            this._resize(i)
        }
        componentWillUnmount() {
          var e
          null === (e = this._resizeObserver) || void 0 === e || e.disconnect()
        }
        getMinWidth() {
          const e = this.props.activeWidgetName || this.props.widgets[0].name
          return (
            (0, c.ensureNotNull)(this._fakeTabs[e]).offsetWidth +
            (0, c.ensureNotNull)(this._fakeMenuButton).offsetWidth
          )
        }
        render() {
          const { visibleTabs: e } = this.state,
            { widgets: t } = this.props,
            n = t.filter((t) => e.includes(t.name))
          return i.createElement(
            'div',
            { className: m.tabbar },
            i.createElement(
              'div',
              { className: m.tabs },
              this._renderTabs(n, !1),
            ),
            i.createElement(
              'div',
              { className: a(m.tabs, m.fakeTabs) },
              this._renderTabs(t, !0),
            ),
          )
        }
        _renderTabs(e, t) {
          const { activeWidgetName: n, widgets: o } = this.props,
            { hiddenTabs: c, isMenuOpened: u } = this.state,
            d = e.map((e) =>
              i.createElement(h, {
                ...e,
                key: e.name,
                isActive: n === e.name,
                onToggle: this._onToggle,
                dataName: t ? void 0 : e.name,
                reference: t ? this._refFakeTabs : void 0,
                className: 'screener' === e.name && m.screenerTab,
              }),
            )
          return (
            (t || c.length > 0) &&
              d.push(
                i.createElement(
                  'div',
                  {
                    key: 'menu-button',
                    className: m.menuButtonWrap,
                    ref: t ? this._refFakeMenuButton : void 0,
                  },
                  i.createElement(
                    r.ToolbarMenuButton,
                    {
                      className: a(m.menuButton, u && m.active),
                      onClick: this._handleMenuClick,
                      content: i.createElement(l.Icon, { icon: v }),
                      arrow: !1,
                    },
                    o
                      .filter((e) => c.includes(e.name))
                      .map((e) =>
                        i.createElement(s.AccessibleMenuItem, {
                          key: e.name,
                          onClick: this._onMenuItemClick,
                          onClickArg: e.name,
                          label: e.title || e.name,
                        }),
                      ),
                  ),
                ),
              ),
            d
          )
        }
      }
      var f = n(199663),
        g = n(265577)
      const b = Number.parseInt(g['css-value-footer-widget-horizontal-margin'])
      var E = n(609838),
        _ = n(332913),
        M = n(544460),
        T = n(19182),
        w = n(978592),
        A = n(587257),
        I = n(163787)
      const L = E.t(null, void 0, n(368144)),
        C = E.t(null, void 0, n(670151)),
        k = E.t(null, void 0, n(402949)),
        B = E.t(null, void 0, n(298205))
      class S extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._updateMode = () => {
              this.setState({ mode: this.props.mode.value() })
            }),
            (this.state = { mode: e.mode.value() })
        }
        componentDidMount() {
          this.props.mode.subscribe(this._updateMode)
        }
        componentWillUnmount() {
          this.props.mode.unsubscribe(this._updateMode)
        }
        render() {
          const { toggleMinimize: e, toggleMaximize: t } = this.props,
            { mode: n } = this.state,
            o = 'minimized' === n,
            r = 'maximized' === n
          return i.createElement(
            i.Fragment,
            null,
            i.createElement(_.ToolbarIconButton, {
              className: a(I.button, I.firstButton),
              tooltip: o ? L : C,
              onClick: e,
              'data-name': 'toggle-visibility-button',
              'data-active': o,
              icon: i.createElement(l.Icon, { icon: o ? T : M }),
            }),
            i.createElement(_.ToolbarIconButton, {
              className: a(I.button),
              tooltip: r ? B : k,
              onClick: t,
              'data-name': 'toggle-maximize-button',
              'data-active': r,
              icon: i.createElement(l.Icon, { icon: r ? A : w }),
            }),
          )
        }
      }
      var N = n(622614)
      class y extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._buttons = null),
            (this._refButtons = (e) => {
              this._buttons = e
            }),
            (this._handleMode = (e) => {
              this.setState({ isOpened: 'minimized' !== e })
            }),
            (this._handleOverlap = (e) => {
              this.setState({ isOverlap: e })
            }),
            (this._handleActiveWidgetName = (e) => {
              const { resizerBridge: t } = this.props
              this.setState({ activeWidgetName: e }, () =>
                this._resize(t.width.value()),
              )
            }),
            (this._setActiveWidget = (e, t, n) => {
              this.props.bottomWidgetBar.toggleWidget(e, t, n)
            }),
            (this._resize = (e) => {
              e && ((e -= b + b), this.setState({ width: e }))
            })
          const { bottomWidgetBar: t, resizerBridge: n } = this.props
          this.state = {
            isOpened: 'minimized' !== t.mode().value(),
            isOverlap: t.isOverlap().value(),
            activeWidgetName: t.activeWidget().value(),
            width: n.width.value(),
          }
        }
        componentDidMount() {
          const { bottomWidgetBar: e, resizerBridge: t } = this.props
          e.mode().subscribe(this._handleMode),
            e.isOverlap().subscribe(this._handleOverlap),
            e
              .activeWidget()
              .subscribe(this._handleActiveWidgetName, { callWithLast: !0 }),
            t.width.subscribe(this._resize),
            this._resize(t.width.value())
        }
        componentWillUnmount() {
          const { bottomWidgetBar: e, resizerBridge: t } = this.props
          e.mode().unsubscribe(this._handleMode),
            e.isOverlap().unsubscribe(this._handleOverlap),
            e.activeWidget().unsubscribe(this._handleActiveWidgetName),
            t.width.unsubscribe(this._resize)
        }
        render() {
          const { bottomWidgetBar: e } = this.props,
            { isOverlap: t, activeWidgetName: n, width: o } = this.state,
            r = this._buttons ? this._buttons.offsetWidth : 0,
            s = e.enabledWidgets(),
            l = 'minimized' !== e.mode().value() && n
          return i.createElement(
            N.Toolbar,
            {
              id: 'footer-chart-panel',
              className: a(I.footerPanel, t && I.overlap),
              onContextMenu: f.preventDefault,
            },
            i.createElement(p, {
              widgets: s,
              activeWidgetName: l,
              setActiveWidget: this._setActiveWidget,
              settingsActiveWidget: n,
              close: e.close,
              width: o - r,
            }),
            i.createElement(
              'div',
              { className: I.buttons, ref: this._refButtons },
              i.createElement(S, {
                toggleMinimize: e.toggleMinimize,
                toggleMaximize: e.toggleMaximize,
                mode: e.mode(),
              }),
            ),
          )
        }
      }
      class x {
        constructor(e, t, n) {
          ;(this._component = null),
            (this._handleRef = (e) => (this._component = e)),
            (this._container = e)
          const a = i.createElement(y, {
            resizerBridge: t,
            bottomWidgetBar: n,
            ref: this._handleRef,
          })
          o.render(a, this._container)
        }
        getComponent() {
          return (0, c.ensureNotNull)(this._component)
        }
        destroy() {
          o.unmountComponentAtNode(this._container)
        }
      }
    },
    978592: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M19.32 6H8.68A2.68 2.68 0 0 0 6 8.68V11h1V8.68C7 7.75 7.75 7 8.68 7h10.64c.93 0 1.68.75 1.68 1.68V11h1V8.68C22 7.2 20.8 6 19.32 6ZM7 19.32c0 .93.75 1.68 1.68 1.68h10.64c.93 0 1.68-.75 1.68-1.68V17h1v2.32C22 20.8 20.8 22 19.32 22H8.68A2.68 2.68 0 0 1 6 19.32V17h1v2.32Z"/></svg>'
    },
    587257: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M19.32 17H8.68A2.68 2.68 0 0 0 6 19.68V22h1v-2.32c0-.93.75-1.68 1.68-1.68h10.64c.93 0 1.68.75 1.68 1.68V22h1v-2.32C22 18.2 20.8 17 19.32 17ZM7 8.32C7 9.25 7.75 10 8.68 10h10.64c.93 0 1.68-.75 1.68-1.68V6h1v2.32C22 9.8 20.8 11 19.32 11H8.68A2.68 2.68 0 0 1 6 8.32V6h1v2.32Z"/></svg>'
    },
    544460: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path fill="currentColor" d="M7 20h14v1H7z"/></svg>'
    },
    19182: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="12" fill="none"><path stroke="currentColor" d="M1 8l8.5-6.5L18 8"/></svg>'
    },
    844996: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M7.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM5 14.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm9.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM12 14.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm9.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM19 14.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z"/></svg>'
    },
    925931: (e, t, n) => {
      n.d(t, { nanoid: () => i })
      const i = (e = 21) =>
        crypto
          .getRandomValues(new Uint8Array(e))
          .reduce(
            (e, t) =>
              (e +=
                (t &= 63) < 36
                  ? t.toString(36)
                  : t < 62
                    ? (t - 26).toString(36).toUpperCase()
                    : t > 62
                      ? '-'
                      : '_'),
            '',
          )
    },
    670151: (e) => {
      e.exports = {
        ar: ['إخفاء اللوحة'],
        ca_ES: 'Hide panel',
        cs: 'Hide panel',
        de: ['Panel verbergen'],
        el: 'Hide panel',
        en: 'Hide panel',
        es: ['Ocultar el panel'],
        fa: 'Hide panel',
        fr: ['Masquer le panneau'],
        he_IL: ['הסתר פאנל'],
        hu_HU: 'Hide panel',
        id_ID: ['Sembunyikan panel'],
        it: ['Nascondi pannello'],
        ja: ['パネルを非表示'],
        ko: ['패널 숨기기'],
        ms_MY: ['Sembunyi panel'],
        nl_NL: 'Hide panel',
        pl: ['Ukryj panel'],
        pt: ['Ocultar painel'],
        ro: 'Hide panel',
        ru: ['Скрыть панель'],
        sv: ['Dölj panel'],
        th: ['ซ่อนพาเนล'],
        tr: ['Paneli gizle'],
        vi: ['Ẩn bảng điều khiển'],
        zh: ['隐藏面板'],
        zh_TW: ['隱藏面板'],
      }
    },
    402949: (e) => {
      e.exports = {
        ar: ['تكبير اللوحة'],
        ca_ES: 'Maximize panel',
        cs: 'Maximize panel',
        de: ['Panel maximieren'],
        el: 'Maximize panel',
        en: 'Maximize panel',
        es: ['Maximizar el panel'],
        fa: 'Maximize panel',
        fr: ['Maximiser le panneau'],
        he_IL: ['הגדל את הפאנל'],
        hu_HU: 'Maximize panel',
        id_ID: ['Perbesar panel'],
        it: ['Massimizza pannello'],
        ja: ['パネルを最大化'],
        ko: ['패널 최대화'],
        ms_MY: ['Maksimumkan panel'],
        nl_NL: 'Maximize panel',
        pl: ['Maksymalizuj panel'],
        pt: ['Maximizar painel'],
        ro: 'Maximize panel',
        ru: ['Развернуть панель'],
        sv: ['Maximera panel'],
        th: ['พาเนลสูงสุด'],
        tr: ['Paneli büyüt'],
        vi: ['Phóng to bảng điều khiển'],
        zh: ['最大化面板'],
        zh_TW: ['最大化面板'],
      }
    },
    298205: (e) => {
      e.exports = {
        ar: ['تصغير اللوحة'],
        ca_ES: 'Minimize panel',
        cs: 'Minimize panel',
        de: ['Panel minimieren'],
        el: 'Minimize panel',
        en: 'Minimize panel',
        es: ['Minimizar el panel'],
        fa: 'Minimize panel',
        fr: ['Minimiser le panneau'],
        he_IL: ['צמצם את הפאנל'],
        hu_HU: 'Minimize panel',
        id_ID: ['Perkecil panel'],
        it: ['Minimizza pannello'],
        ja: ['パネルを最小化'],
        ko: ['패널 최소화'],
        ms_MY: ['Minimumkan panel'],
        nl_NL: 'Minimize panel',
        pl: ['Minimalizuj panel'],
        pt: ['Minimizar painel'],
        ro: 'Minimize panel',
        ru: ['Свернуть панель'],
        sv: ['Minimera panel'],
        th: ['พาเนลต่ำสุด'],
        tr: ['Paneli simge durumuna küçült'],
        vi: ['Thu nhỏ bảng điều khiển'],
        zh: ['最小化面板'],
        zh_TW: ['最小化面板'],
      }
    },
    368144: (e) => {
      e.exports = {
        ar: ['عرض اللوحة'],
        ca_ES: 'Show panel',
        cs: 'Show panel',
        de: ['Panel anzeigen'],
        el: 'Show panel',
        en: 'Show panel',
        es: ['Mostrar el panel'],
        fa: 'Show panel',
        fr: ['Afficher le panneau'],
        he_IL: ['הצג פאנל'],
        hu_HU: 'Show panel',
        id_ID: ['Tampilkan panel'],
        it: ['Mostra pannello'],
        ja: ['パネルを表示'],
        ko: ['패널 보이기'],
        ms_MY: ['Tunjuk panel'],
        nl_NL: 'Show panel',
        pl: ['Pokaż panel'],
        pt: ['Mostrar painel'],
        ro: 'Show panel',
        ru: ['Показать панель'],
        sv: ['Visa panel'],
        th: ['แสดงพาเนล'],
        tr: ['Paneli göster'],
        vi: ['Hiển thị bảng điều khiển'],
        zh: ['显示面板'],
        zh_TW: ['顯示面板'],
      }
    },
  },
])
