;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2878],
  {
    488803: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
      }
    },
    645300: (e) => {
      e.exports = {}
    },
    210888: (e) => {
      e.exports = { 'default-drawer-min-top-distance': '100px' }
    },
    333963: (e) => {
      e.exports = {
        item: 'item-zwyEh4hn',
        label: 'label-zwyEh4hn',
        labelRow: 'labelRow-zwyEh4hn',
        toolbox: 'toolbox-zwyEh4hn',
      }
    },
    671986: (e) => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        item: 'item-jFqVJoPk',
        hovered: 'hovered-jFqVJoPk',
        isDisabled: 'isDisabled-jFqVJoPk',
        isActive: 'isActive-jFqVJoPk',
        shortcut: 'shortcut-jFqVJoPk',
        toolbox: 'toolbox-jFqVJoPk',
        withIcon: 'withIcon-jFqVJoPk',
        'round-icon': 'round-icon-jFqVJoPk',
        icon: 'icon-jFqVJoPk',
        labelRow: 'labelRow-jFqVJoPk',
        label: 'label-jFqVJoPk',
        showOnHover: 'showOnHover-jFqVJoPk',
        'disclosure-item-circle-logo': 'disclosure-item-circle-logo-jFqVJoPk',
        showOnFocus: 'showOnFocus-jFqVJoPk',
      }
    },
    718736: (e, t, o) => {
      o.d(t, { useFunctionalRefObject: () => s })
      var n = o(50959),
        i = o(855393)
      function s(e) {
        const t = (0, n.useMemo)(
            () =>
              ((e) => {
                const t = (o) => {
                  e(o), (t.current = o)
                }
                return (t.current = null), t
              })((e) => {
                a.current(e)
              }),
            [],
          ),
          o = (0, n.useRef)(null),
          s = (t) => {
            if (null === t) return r(o.current, t), void (o.current = null)
            o.current !== e && ((o.current = e), r(o.current, t))
          },
          a = (0, n.useRef)(s)
        return (
          (a.current = s),
          (0, i.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return a.current(t.current), () => a.current(null)
          }, [e]),
          t
        )
      }
      function r(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    975228: (e, t, o) => {
      o.d(t, {
        hoverMouseEventFilter: () => s,
        useAccurateHover: () => r,
        useHover: () => i,
      })
      var n = o(50959)
      function i() {
        const [e, t] = (0, n.useState)(!1)
        return [
          e,
          {
            onMouseOver: (e) => {
              s(e) && t(!0)
            },
            onMouseOut: (e) => {
              s(e) && t(!1)
            },
          },
        ]
      }
      function s(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function r(e) {
        const [t, o] = (0, n.useState)(!1)
        return (
          (0, n.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return
              const n = e.current.contains(t.target)
              o(n)
            }
            return (
              document.addEventListener('mouseover', t),
              () => document.removeEventListener('mouseover', t)
            )
          }, []),
          t
        )
      }
    },
    855393: (e, t, o) => {
      o.d(t, { useIsomorphicLayoutEffect: () => i })
      var n = o(50959)
      function i(e, t) {
        ;('undefined' == typeof window ? n.useEffect : n.useLayoutEffect)(e, t)
      }
    },
    778199: (e, t, o) => {
      function n(e, t, o, n, i) {
        function s(i) {
          if (e > i.timeStamp) return
          const s = i.target
          void 0 !== o &&
            null !== t &&
            null !== s &&
            s.ownerDocument === n &&
            (t.contains(s) || o(i))
        }
        return (
          i.click && n.addEventListener('click', s, !1),
          i.mouseDown && n.addEventListener('mousedown', s, !1),
          i.touchEnd && n.addEventListener('touchend', s, !1),
          i.touchStart && n.addEventListener('touchstart', s, !1),
          () => {
            n.removeEventListener('click', s, !1),
              n.removeEventListener('mousedown', s, !1),
              n.removeEventListener('touchend', s, !1),
              n.removeEventListener('touchstart', s, !1)
          }
        )
      }
      o.d(t, { addOutsideEventListener: () => n })
    },
    664332: (e, t, o) => {
      o.d(t, { useResizeObserver: () => a })
      var n = o(50959),
        i = o(159255),
        s = o(855393),
        r = o(718736)
      function a(e, t = []) {
        const { callback: o, ref: a = null } = ((e) =>
            'function' == typeof e ? { callback: e } : e)(e),
          l = (0, n.useRef)(null),
          c = (0, n.useRef)(o)
        c.current = o
        const u = (0, r.useFunctionalRefObject)(a),
          d = (0, n.useCallback)(
            (e) => {
              u(e),
                null !== l.current &&
                  (l.current.disconnect(), null !== e && l.current.observe(e))
            },
            [u, l],
          )
        return (
          (0, s.useIsomorphicLayoutEffect)(
            () => (
              (l.current = new i.default((e, t) => {
                c.current(e, t)
              })),
              u.current && d(u.current),
              () => {
                var e
                null === (e = l.current) || void 0 === e || e.disconnect()
              }
            ),
            [u, ...t],
          ),
          d
        )
      }
    },
    72571: (e, t, o) => {
      o.d(t, { Icon: () => i })
      var n = o(50959)
      const i = n.forwardRef((e, t) => {
        const { icon: o = '', ...i } = e
        return n.createElement('span', {
          ...i,
          ref: t,
          dangerouslySetInnerHTML: { __html: o },
        })
      })
    },
    800417: (e, t, o) => {
      function n(e) {
        return s(e, r)
      }
      function i(e) {
        return s(e, a)
      }
      function s(e, t) {
        const o = Object.entries(e).filter(t),
          n = {}
        for (const [e, t] of o) n[e] = t
        return n
      }
      function r(e) {
        const [t, o] = e
        return 0 === t.indexOf('data-') && 'string' == typeof o
      }
      function a(e) {
        return 0 === e[0].indexOf('aria-')
      }
      o.d(t, {
        filterAriaProps: () => i,
        filterDataProps: () => n,
        filterProps: () => s,
        isAriaAttribute: () => a,
        isDataAttribute: () => r,
      })
    },
    111706: (e, t, o) => {
      function n(e) {
        return 0 === e.detail
      }
      o.d(t, { isKeyboardClick: () => n })
    },
    269842: (e, t, o) => {
      function n(...e) {
        return (t) => {
          for (const o of e) void 0 !== o && o(t)
        }
      }
      o.d(t, { createSafeMulticastEventHandler: () => n })
    },
    996038: (e, t, o) => {
      o.d(t, { DialogBreakpoints: () => i })
      var n = o(488803)
      const i = {
        SmallHeight: n['small-height-breakpoint'],
        TabletSmall: n['tablet-small-breakpoint'],
        TabletNormal: n['tablet-normal-breakpoint'],
      }
    },
    438980: (e, t, o) => {
      o.d(t, { Measure: () => i })
      var n = o(664332)
      function i(e) {
        const { children: t, onResize: o } = e
        return t((0, n.useResizeObserver)(o || (() => {}), [null === o]))
      }
    },
    578601: (e, t, o) => {
      o.d(t, { useRowsNavigation: () => c })
      var n = o(50959),
        i = o(650151),
        s = o(892932),
        r = o(180185),
        a = o(27164)
      const l = [37, 39, 38, 40]
      function c(e) {
        const t = (0, n.useRef)(null)
        return (
          (0, n.useLayoutEffect)(() => {
            if (!s.PLATFORM_ACCESSIBILITY_ENABLED) return
            const e = (0, i.ensureNotNull)(t.current),
              o = () => {
                const o = (0, s.queryTabbableElements)(e).sort(
                  s.navigationOrderComparator,
                )
                if (
                  0 === o.length ||
                  (o[0].parentElement &&
                    !h(o[0].parentElement, (0, i.ensureNotNull)(t.current)))
                ) {
                  const n = ((e) => {
                    const o = d(e)
                      .sort(s.navigationOrderComparator)
                      .find((e) => h(e, (0, i.ensureNotNull)(t.current)))
                    if (!o) return null
                    const n = Array.from(o.children)
                    if (!n.length) return null
                    return n[0]
                  })(e)
                  if (null === n) return
                  if (((0, a.becomeMainElement)(n), o.length > 0))
                    for (const e of o) (0, a.becomeSecondaryElement)(e)
                }
              }
            return (
              window.addEventListener('keyboard-navigation-activation', o),
              o(),
              () =>
                window.removeEventListener('keyboard-navigation-activation', o)
            )
          }, []),
          [
            t,
            (t) => {
              if (!s.PLATFORM_ACCESSIBILITY_ENABLED) return
              if (t.defaultPrevented) return
              const o = (0, r.hashFromEvent)(t)
              if (!l.includes(o)) return
              const n = document.activeElement
              if (!(n instanceof HTMLElement)) return
              const i = t.currentTarget
              let a, c
              if (e) {
                const e = n.parentElement
                ;(a = e ? Array.from(e.children) : []), (c = a.indexOf(n))
              } else
                (a = ((h = i),
                Array.from(
                  h.querySelectorAll(
                    'button:not([disabled]):not([aria-disabled])',
                  ),
                ).filter((0, s.createScopedVisibleElementFilter)(h))).sort(
                  s.navigationOrderComparator,
                )),
                  (c = a.indexOf(n))
              var h
              if (0 === a.length || -1 === c) return
              const v = (0, s.mapKeyCodeToDirection)(o)
              switch (v) {
                case 'inlinePrev':
                  if ((t.preventDefault(), !e && 0 === c)) break
                  m(u(a, c, -1))
                  break
                case 'inlineNext':
                  if ((t.preventDefault(), !e && c === a.length - 1)) break
                  m(u(a, c, 1))
                  break
                case 'blockPrev':
                case 'blockNext':
                  ;((o) => {
                    if (!document.activeElement) return
                    const n = d(i),
                      s = document.activeElement.parentElement
                    if (!s) return
                    const r = Array.from(s.children).indexOf(
                      document.activeElement,
                    )
                    if (-1 === r) return
                    const a =
                      n['blockNext' === o ? n.indexOf(s) + 1 : n.indexOf(s) - 1]
                    if (!a) return
                    t.preventDefault()
                    const l = Array.from(a.children)
                    l.length && (!e && r <= l.length - 1 ? m(l[r]) : m(l[0]))
                  })(v)
              }
            },
          ]
        )
      }
      function u(e, t, o) {
        return e[(t + e.length + o) % e.length]
      }
      function d(e) {
        return Array.from(e.querySelectorAll('[data-role="row"]')).filter(
          (0, s.createScopedVisibleElementFilter)(e),
        )
      }
      function h(e, t) {
        const o = (0, i.ensureNotNull)(e.parentElement).offsetTop,
          n = o + (0, i.ensureNotNull)(e.parentElement).clientHeight,
          s = t.scrollTop,
          r = s + t.clientHeight
        return o >= s && n <= r
      }
      function m(e) {
        document.activeElement &&
          (0, a.becomeSecondaryElement)(document.activeElement),
          (0, a.becomeMainElement)(e),
          e.focus()
      }
    },
    636080: (e, t, o) => {
      o.d(t, { CircleLogo: () => r, hiddenCircleLogoClass: () => s })
      var n = o(50959),
        i = o(439067)
      o(645300)
      const s = 'tv-circle-logo--visually-hidden'
      function r(e) {
        var t, o
        const s = (0, i.getStyleClasses)(e.size, e.className),
          r =
            null !== (o = null !== (t = e.alt) && void 0 !== t ? t : e.title) &&
            void 0 !== o
              ? o
              : ''
        return (0, i.isCircleLogoWithUrlProps)(e)
          ? n.createElement('img', {
              className: s,
              crossOrigin: '',
              src: e.logoUrl,
              alt: r,
              title: e.title,
              loading: e.loading,
              'aria-label': e['aria-label'],
              'aria-hidden': e['aria-hidden'],
            })
          : n.createElement(
              'span',
              {
                className: s,
                title: e.title,
                'aria-label': e['aria-label'],
                'aria-hidden': e['aria-hidden'],
              },
              e.placeholderLetter,
            )
      }
    },
    439067: (e, t, o) => {
      o.d(t, { getStyleClasses: () => i, isCircleLogoWithUrlProps: () => s })
      var n = o(497754)
      function i(e, t) {
        return n('tv-circle-logo', `tv-circle-logo--${e}`, t)
      }
      function s(e) {
        return 'logoUrl' in e && void 0 !== e.logoUrl && 0 !== e.logoUrl.length
      }
    },
    840976: (e, t, o) => {
      o.d(t, { useEnsuredContext: () => s })
      var n = o(50959),
        i = o(650151)
      function s(e) {
        return (0, i.ensureNotNull)((0, n.useContext)(e))
      }
    },
    522224: (e, t, o) => {
      o.d(t, {
        hoverMouseEventFilter: () => n.hoverMouseEventFilter,
        useAccurateHover: () => n.useAccurateHover,
        useHover: () => n.useHover,
      })
      var n = o(975228)
    },
    102478: (e, t, o) => {
      o.d(t, { useResizeObserver: () => n.useResizeObserver })
      var n = o(664332)
    },
    297265: (e, t, o) => {
      o.d(t, { useWatchedValueReadonly: () => i })
      var n = o(50959)
      const i = (e, t = !1) => {
        const o = 'watchedValue' in e ? e.watchedValue : void 0,
          i = 'defaultValue' in e ? e.defaultValue : e.watchedValue.value(),
          [s, r] = (0, n.useState)(o ? o.value() : i)
        return (
          (t ? n.useLayoutEffect : n.useEffect)(() => {
            if (o) {
              r(o.value())
              const e = (e) => r(e)
              return o.subscribe(e), () => o.unsubscribe(e)
            }
            return () => {}
          }, [o]),
          s
        )
      }
    },
    901317: (e, t, o) => {
      o.d(t, { useWatchedValue: () => i })
      var n = o(50959)
      const i = (e) => {
        const [t, o] = (0, n.useState)(e.value())
        return (
          (0, n.useEffect)(() => {
            const t = (e) => o(e)
            return e.subscribe(t), () => e.unsubscribe(t)
          }, [e]),
          [t, (t) => e.setValue(t)]
        )
      }
    },
    192063: (e, t, o) => {
      o.d(t, { DEFAULT_POPUP_MENU_ITEM_THEME: () => c, PopupMenuItem: () => d })
      var n = o(50959),
        i = o(497754),
        s = o(32133),
        r = o(370981),
        a = o(636080),
        l = o(671986)
      const c = l
      function u(e) {
        e.stopPropagation()
      }
      function d(e) {
        const {
            id: t,
            role: o,
            className: c,
            title: d,
            labelRowClassName: h,
            labelClassName: m,
            toolboxClassName: v,
            shortcut: p,
            forceShowShortcuts: b,
            icon: g,
            iconClassname: f,
            isActive: C,
            isDisabled: _,
            isHovered: E,
            appearAsDisabled: T,
            label: w,
            link: x,
            showToolboxOnHover: S,
            showToolboxOnFocus: k,
            target: F,
            rel: y,
            toolbox: A,
            reference: M,
            onMouseOut: I,
            onMouseOver: N,
            onKeyDown: L,
            suppressToolboxClick: D = !0,
            theme: B = l,
            tabIndex: W,
            tagName: O,
            renderComponent: V,
            roundedIcon: R,
            iconAriaProps: P,
            circleLogo: H,
            dontClosePopup: j,
            onClick: z,
            onClickArg: U,
            trackEventObject: Z,
            trackMouseWheelClick: K,
            trackRightClick: G,
            ...J
          } = e,
          q = (0, n.useRef)(null),
          Y = (0, n.useMemo)(
            () =>
              ((e) => {
                function t(t) {
                  const { reference: o, ...i } = t,
                    s = null != e ? e : i.href ? 'a' : 'div',
                    r =
                      'a' === s
                        ? i
                        : ((e) => {
                            const {
                              download: t,
                              href: o,
                              hrefLang: n,
                              media: i,
                              ping: s,
                              rel: r,
                              target: a,
                              type: l,
                              referrerPolicy: c,
                              ...u
                            } = e
                            return u
                          })(i)
                  return n.createElement(s, { ...r, ref: o })
                }
                return (t.displayName = `DefaultComponent(${e})`), t
              })(O),
            [O],
          ),
          $ = null != V ? V : Y
        return n.createElement(
          $,
          {
            ...J,
            id: t,
            role: o,
            className: i(c, B.item, g && B.withIcon, {
              [B.isActive]: C,
              [B.isDisabled]: _ || T,
              [B.hovered]: E,
            }),
            title: d,
            href: x,
            target: F,
            rel: y,
            reference: (e) => {
              ;(q.current = e), 'function' == typeof M && M(e)
              'object' == typeof M && (M.current = e)
            },
            onClick: (e) => {
              if (_) return
              Z && (0, s.trackEvent)(Z.category, Z.event, Z.label)
              z && z(U, e)
              j || (0, r.globalCloseMenu)()
            },
            onContextMenu: (e) => {
              Z &&
                G &&
                (0, s.trackEvent)(Z.category, Z.event, `${Z.label}_rightClick`)
            },
            onMouseUp: (e) => {
              if (1 === e.button && x && Z) {
                let e = Z.label
                K && (e += '_mouseWheelClick'),
                  (0, s.trackEvent)(Z.category, Z.event, e)
              }
            },
            onMouseOver: N,
            onMouseOut: I,
            onKeyDown: L,
            tabIndex: W,
          },
          H &&
            n.createElement(a.CircleLogo, {
              ...P,
              className: l['disclosure-item-circle-logo'],
              size: 'xxxsmall',
              logoUrl: H.logoUrl,
              placeholderLetter: H.placeholderLetter,
            }),
          g &&
            n.createElement('span', {
              'aria-label': P && P['aria-label'],
              'aria-hidden': P && Boolean(P['aria-hidden']),
              className: i(B.icon, R && l['round-icon'], f),
              dangerouslySetInnerHTML: { __html: g },
            }),
          n.createElement(
            'span',
            { className: i(B.labelRow, h) },
            n.createElement('span', { className: i(B.label, m) }, w),
          ),
          (void 0 !== p || b) &&
            n.createElement(
              'span',
              { className: B.shortcut },
              (Q = p) && Q.split('+').join(' + '),
            ),
          void 0 !== A &&
            n.createElement(
              'span',
              {
                onClick: D ? u : void 0,
                className: i(v, B.toolbox, {
                  [B.showOnHover]: S,
                  [B.showOnFocus]: k,
                }),
              },
              A,
            ),
        )
        var Q
      }
    },
    614417: (e, t, o) => {
      o.d(t, { multilineLabelWithIconAndToolboxTheme: () => r })
      var n = o(493173),
        i = o(671986),
        s = o(333963)
      const r = (0, n.mergeThemes)(i, s)
    },
    624216: (e, t, o) => {
      o.d(t, { PopupMenu: () => h })
      var n = o(50959),
        i = o(500962),
        s = o(162942),
        r = o(813113),
        a = o(510618),
        l = o(28466)
      const c = n.createContext(void 0)
      var u = o(908783)
      const d = n.createContext({ setMenuMaxWidth: !1 })
      function h(e) {
        const {
            controller: t,
            children: o,
            isOpened: h,
            closeOnClickOutside: m = !0,
            doNotCloseOn: v,
            onClickOutside: p,
            onClose: b,
            onKeyboardClose: g,
            'data-name': f = 'popup-menu-container',
            ...C
          } = e,
          _ = (0, n.useContext)(l.CloseDelegateContext),
          E = n.useContext(d),
          T = (0, n.useContext)(c),
          w = (0, u.useOutsideEvent)({
            handler: (e) => {
              p && p(e)
              if (!m) return
              const t = (0, s.default)(v) ? v() : null == v ? [] : [v]
              if (t.length > 0 && e.target instanceof Node)
                for (const o of t) {
                  const t = i.findDOMNode(o)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              b()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return h
          ? n.createElement(
              r.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              n.createElement(
                'span',
                { ref: w, style: { pointerEvents: 'auto' } },
                n.createElement(
                  a.Menu,
                  {
                    ...C,
                    onClose: b,
                    onKeyboardClose: g,
                    onScroll: (t) => {
                      const { onScroll: o } = e
                      o && o(t)
                    },
                    customCloseDelegate: _,
                    customRemeasureDelegate: T,
                    ref: t,
                    'data-name': f,
                    limitMaxWidth: E.setMenuMaxWidth,
                  },
                  o,
                ),
              ),
            )
          : null
      }
    },
    906132: (e, t, o) => {
      var n = o(522134)
      function i() {}
      function s() {}
      ;(s.resetWarningCache = i),
        (e.exports = () => {
          function e(e, t, o, i, s, r) {
            if (r !== n) {
              var a = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types',
              )
              throw ((a.name = 'Invariant Violation'), a)
            }
          }
          function t() {
            return e
          }
          e.isRequired = e
          var o = {
            array: e,
            bool: e,
            func: e,
            number: e,
            object: e,
            string: e,
            symbol: e,
            any: e,
            arrayOf: t,
            element: e,
            elementType: e,
            instanceOf: t,
            node: e,
            objectOf: t,
            oneOf: t,
            oneOfType: t,
            shape: t,
            exact: t,
            checkPropTypes: s,
            resetWarningCache: i,
          }
          return (o.PropTypes = o), o
        })
    },
    719036: (e, t, o) => {
      e.exports = o(906132)()
    },
    522134: (e) => {
      e.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
    },
    47102: (e) => {
      e.exports = {
        accessible: 'accessible-NQERJsv9',
        active: 'active-NQERJsv9',
      }
    },
    189089: (e) => {
      e.exports = { button: 'button-LkmyTVRc', active: 'active-LkmyTVRc' }
    },
    154784: (e) => {
      e.exports = {
        button: 'button-KTgbfaP5',
        hover: 'hover-KTgbfaP5',
        clicked: 'clicked-KTgbfaP5',
        bg: 'bg-KTgbfaP5',
        icon: 'icon-KTgbfaP5',
        isActive: 'isActive-KTgbfaP5',
        isTransparent: 'isTransparent-KTgbfaP5',
        isGrayed: 'isGrayed-KTgbfaP5',
        isHidden: 'isHidden-KTgbfaP5',
        accessible: 'accessible-KTgbfaP5',
      }
    },
    922878: (e) => {
      e.exports = {
        dropdown: 'dropdown-pbhJWNrt',
        buttonWrap: 'buttonWrap-pbhJWNrt',
        control: 'control-pbhJWNrt',
        arrow: 'arrow-pbhJWNrt',
        arrowIcon: 'arrowIcon-pbhJWNrt',
        isOpened: 'isOpened-pbhJWNrt',
        hover: 'hover-pbhJWNrt',
        isGrayed: 'isGrayed-pbhJWNrt',
        accessible: 'accessible-pbhJWNrt',
      }
    },
    144242: (e) => {
      e.exports = { title: 'title-u3QJgF_p' }
    },
    27334: (e) => {
      e.exports = {
        container: 'container-Wp9adlfh',
        mirror: 'mirror-Wp9adlfh',
        background: 'background-Wp9adlfh',
        arrow: 'arrow-Wp9adlfh',
      }
    },
    246173: (e) => {
      e.exports = { item: 'item-uxNfqe_g', label: 'label-uxNfqe_g' }
    },
    933603: (e) => {
      e.exports = {
        drawingToolbar: 'drawingToolbar-BfVZxb4b',
        isHidden: 'isHidden-BfVZxb4b',
        inner: 'inner-BfVZxb4b',
        group: 'group-BfVZxb4b',
        lastGroup: 'lastGroup-BfVZxb4b',
        fill: 'fill-BfVZxb4b',
      }
    },
    22231: (e) => {
      e.exports = {
        toggleButton: 'toggleButton-OhcB9eH7',
        collapsed: 'collapsed-OhcB9eH7',
        background: 'background-OhcB9eH7',
        arrow: 'arrow-OhcB9eH7',
      }
    },
    420274: (e) => {
      e.exports = { item: 'item-yfwdxbRo', hovered: 'hovered-yfwdxbRo' }
    },
    412451: (e) => {
      e.exports = {
        desktopSize: 'desktopSize-l1SzP6TV',
        smallSize: 'smallSize-l1SzP6TV',
        tabs: 'tabs-l1SzP6TV',
        categories: 'categories-l1SzP6TV',
      }
    },
    478227: (e) => {
      e.exports = { sticker: 'sticker-aZclaNCs' }
    },
    923091: (e) => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        stickerRow: 'stickerRow-KUOIljqV',
      }
    },
    662270: (e) => {
      e.exports = { wrapper: 'wrapper-FNeSdxed' }
    },
    37531: (e) => {
      e.exports = { drawer: 'drawer-PzCssz1z', menuBox: 'menuBox-PzCssz1z' }
    },
    285470: (e) => {
      e.exports = {
        toolButtonMagnet: 'toolButtonMagnet-wg76fIbD',
        toolButtonMagnet__menuItem: 'toolButtonMagnet__menuItem-wg76fIbD',
        toolButtonMagnet__hintPlaceholder:
          'toolButtonMagnet__hintPlaceholder-wg76fIbD',
      }
    },
    390949: (e) => {
      e.exports = { sectionTitle: 'sectionTitle-Srvnqigs' }
    },
    530261: (e) => {
      e.exports = {
        wrap: 'wrap-Z4M3tWHb',
        scrollWrap: 'scrollWrap-Z4M3tWHb',
        noScrollBar: 'noScrollBar-Z4M3tWHb',
        content: 'content-Z4M3tWHb',
        icon: 'icon-Z4M3tWHb',
        scrollBot: 'scrollBot-Z4M3tWHb',
        scrollTop: 'scrollTop-Z4M3tWHb',
        isVisible: 'isVisible-Z4M3tWHb',
        iconWrap: 'iconWrap-Z4M3tWHb',
        fadeBot: 'fadeBot-Z4M3tWHb',
        fadeTop: 'fadeTop-Z4M3tWHb',
      }
    },
    455619: (e) => {
      e.exports = { iconContainer: 'iconContainer-dmpvVypS' }
    },
    137869: (e, t, o) => {
      o.d(t, { AccessibleMenuItem: () => d })
      var n = o(50959),
        i = o(497754),
        s = o.n(i),
        r = o(930202),
        a = o(865266),
        l = o(892932),
        c = o(192063),
        u = o(47102)
      function d(e) {
        const { className: t, ...o } = e,
          [i, d] = (0, a.useRovingTabindexElement)(null)
        return n.createElement(c.PopupMenuItem, {
          ...o,
          className: s()(
            l.PLATFORM_ACCESSIBILITY_ENABLED && u.accessible,
            e.isActive && u.active,
            t,
          ),
          reference: i,
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
              i.current instanceof HTMLElement && i.current.click())
          },
          'data-role': l.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          'aria-disabled':
            (l.PLATFORM_ACCESSIBILITY_ENABLED && e.isDisabled) || void 0,
        })
      }
    },
    347041: (e, t, o) => {
      o.d(t, { MenuFavoriteButton: () => u })
      var n = o(50959),
        i = o(497754),
        s = o.n(i),
        r = o(865266),
        a = o(892932),
        l = o(577687),
        c = o(189089)
      function u(e) {
        const { tooltip: t, onClick: o, ...i } = e,
          [u, d] = (0, r.useRovingTabindexElement)(null)
        return a.PLATFORM_ACCESSIBILITY_ENABLED
          ? n.createElement(
              'button',
              {
                ref: u,
                tabIndex: d,
                onClick: o,
                className: s()(c.button, i.isActive && c.active),
                type: 'button',
              },
              n.createElement(l.FavoriteButton, {
                'aria-label': t,
                ...i,
                'data-tooltip': t,
              }),
            )
          : n.createElement(l.FavoriteButton, { ...e, 'data-tooltip': t })
      }
    },
    864549: (e, t, o) => {
      o.d(t, { ToolButton: () => a })
      var n = o(50959),
        i = o(497754),
        s = o(72571),
        r = o(154784)
      const a = (0, n.forwardRef)((e, t) => {
        const {
            id: o,
            activeClass: a,
            children: l,
            className: c,
            icon: u,
            isActive: d,
            isGrayed: h,
            isHidden: m,
            isTransparent: v,
            theme: p = r,
            onClick: b,
            onKeyDown: g,
            buttonHotKey: f,
            tooltipPosition: C = 'vertical',
            tag: _ = 'div',
            tabIndex: E,
            tooltip: T,
            ...w
          } = e,
          x = 'button' === e.tag
        return n.createElement(
          _,
          {
            'aria-label': x ? T : void 0,
            ...w,
            id: o,
            type: x ? 'button' : void 0,
            className: i(
              p.button,
              c,
              d && a,
              {
                'apply-common-tooltip': Boolean(T),
                'common-tooltip-vertical': Boolean(T) && 'vertical' === C,
                [p.isActive]: d,
                [p.isGrayed]: h,
                [p.isHidden]: m,
                [p.isTransparent]: v,
              },
              x && p.accessible,
            ),
            onClick: b,
            onKeyDown: g,
            'data-role': x ? void 0 : 'button',
            ref: t,
            tabIndex: E,
            'data-tooltip-hotkey': f,
            'aria-pressed': x ? d : void 0,
            'data-tooltip': T,
          },
          n.createElement(
            'div',
            { className: p.bg },
            u &&
              ('string' == typeof u
                ? n.createElement(s.Icon, { className: p.icon, icon: u })
                : n.createElement('span', { className: p.icon }, u)),
            l,
          ),
        )
      })
    },
    163915: (e, t, o) => {
      o.d(t, { ToolWidgetMenuSummary: () => r })
      var n = o(50959),
        i = o(497754),
        s = o(144242)
      function r(e) {
        return n.createElement(
          'div',
          { className: i(e.className, s.title) },
          e.children,
        )
      }
    },
    960732: (e, t, o) => {
      o.d(t, {
        DEFAULT_VERTICAL_TOOLBAR_HIDER_THEME: () => a,
        VerticalToolbarHider: () => c,
      })
      var n = o(50959),
        i = o(497754),
        s = o(199663),
        r = o(27334)
      const a = r,
        l = 'http://www.w3.org/2000/svg'
      function c(e) {
        const { direction: t, theme: o = r } = e
        return n.createElement(
          'svg',
          {
            xmlns: l,
            width: '9',
            height: '27',
            viewBox: '0 0 9 27',
            className: i(o.container, 'right' === t ? o.mirror : null),
            onContextMenu: s.preventDefault,
          },
          n.createElement(
            'g',
            { fill: 'none', fillRule: 'evenodd' },
            n.createElement('path', {
              className: o.background,
              d: 'M4.5.5a4 4 0 0 1 4 4v18a4 4 0 1 1-8 0v-18a4 4 0 0 1 4-4z',
            }),
            n.createElement('path', {
              className: o.arrow,
              d: 'M5.5 10l-2 3.5 2 3.5',
            }),
          ),
        )
      }
    },
    667990: (e, t, o) => {
      o.r(t), o.d(t, { DrawingToolbarRenderer: () => uo })
      var n = o(50959),
        i = o(500962),
        s = o(650151),
        r = o(497754),
        a = o.n(r),
        l = o(972535),
        c = o(870122),
        u = o(156963),
        d = o(683471),
        h = o(559410),
        m = o(466052),
        v = o(601227),
        p = o(69111),
        b = o(526122)
      class g {
        constructor(e) {
          this._drawingsAccess = e || { tools: [], type: 'black' }
        }
        isToolEnabled(e) {
          const t = this._findTool(e)
          return (
            !(!t || !t.grayed) ||
            ('black' === this._drawingsAccess.type ? !t : !!t)
          )
        }
        isToolGrayed(e) {
          const t = this._findTool(e)
          return Boolean(t && t.grayed)
        }
        _findTool(e) {
          return this._drawingsAccess.tools.find((t) => t.name === e)
        }
      }
      var f = o(907815),
        C = o(971298),
        _ = o(19139),
        E = o(376202),
        T = o(370981),
        w = o(864549),
        x = o(892932),
        S = o(865266)
      function k(e) {
        const [t, o] = (0, S.useRovingTabindexElement)(null)
        return n.createElement(w.ToolButton, {
          ...e,
          ref: t,
          tag: x.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
          tabIndex: o,
        })
      }
      function F(e) {
        const {
          id: t,
          action: o,
          isActive: i,
          isHidden: s,
          isTransparent: r,
          toolName: a,
        } = e
        return n.createElement(k, {
          id: t,
          icon: b.lineToolsInfo[a].icon,
          isActive: i,
          isHidden: s,
          isTransparent: r,
          onClick: o,
          tooltip: b.lineToolsInfo[a].localizedName,
          'data-name': a,
        })
      }
      var y,
        A = o(609838),
        M = o(800417),
        I = o(901317),
        N = o(650802)
      !((e) => {
        ;(e.Icons = 'icons'), (e.Emojis = 'emojis'), (e.Stickers = 'stickers')
      })(y || (y = {}))
      const L = c.getValue('ToolButtonIcons.LastCategory', y.Emojis),
        D = new N.WatchedValue(L)
      function B() {
        const [e, t] = (0, I.useWatchedValue)(D)
        return [
          e,
          (0, n.useCallback)(
            (e) => {
              t(e),
                ((e) => {
                  c.setValue('ToolButtonIcons.LastCategory', e)
                })(e)
            },
            [t],
          ),
        ]
      }
      var W = o(543454),
        O = o(662270)
      function V(e) {
        return n.createElement('div', { className: O.wrapper }, e.text)
      }
      var R = o(679112),
        P = o(151609),
        H = o(922976),
        j = o(670616),
        z = o(918042),
        U = o(44986),
        Z = o(683778),
        K = o(548748)
      const G = [
          '0xF087',
          '0xF088',
          '0xF164',
          '0xF165',
          '0xF0A4',
          '0xF0A5',
          '0xF007',
          '0xF0A6',
          '0xF0A7',
          '0xF118',
          '0xF11A',
          '0xF119',
          '0xF183',
        ],
        J = [
          '0xF153',
          '0xF154',
          '0xF155',
          '0xF156',
          '0xF157',
          '0xF158',
          '0xF159',
          '0xF195',
          '0xF15A',
        ],
        q = [
          '0xF060',
          '0xF061',
          '0xF062',
          '0xF063',
          '0xF053',
          '0xF054',
          '0xF077',
          '0xF078',
          '0xF07D',
          '0xF07E',
          '0xF0A9',
          '0xF0AA',
          '0xF0AB',
          '0xF0D9',
          '0xF0DA',
          '0xF0D7',
          '0xF0D8',
          '0xF102',
          '0xF103',
          '0xF104',
          '0xF105',
          '0xF106',
          '0xF107',
          '0xF137',
          '0xF139',
          '0xF13A',
          '0xF112',
          '0xF064',
          '0xF148',
          '0xF149',
          '0xF177',
          '0xF178',
          '0xF175',
          '0xF176',
          '0xF01A',
          '0xF01B',
          '0xF065',
          '0xF066',
        ],
        Y = [
          '0xF11D',
          '0xF11E',
          '0xF024',
          '0xF004',
          '0xF005',
          '0xF006',
          '0xF046',
          '0xF00C',
          '0xF00D',
          '0xF011',
          '0xF012',
          '0xF021',
          '0xF01E',
          '0xF192',
          '0xF041',
          '0xF14A',
          '0xF055',
          '0xF056',
          '0xF057',
          '0xF059',
          '0xF058',
          '0xF05A',
          '0xF05B',
          '0xF05C',
          '0xF05D',
          '0xF05E',
          '0xF067',
          '0xF068',
          '0xF069',
          '0xF06A',
          '0xF071',
          '0xF06E',
          '0xF070',
          '0xF075',
          '0xF08A',
          '0xF0A3',
          '0xF0E5',
          '0xF110',
          '0xF111',
          '0xF123',
          '0xF124',
          '0xF10C',
          '0xF128',
          '0xF129',
          '0xF12A',
          '0xF140',
          '0xF113',
          '0xF17C',
          '0xF179',
        ],
        $ = ['0xF06C', '0xF185', '0xF186', '0xF188', '0xF0E7'],
        Q = [
          '0xF000',
          '0xF002',
          '0xF00E',
          '0xF015',
          '0xF017',
          '0xF030',
          '0xF013',
          '0xF043',
          '0xF06B',
          '0xF072',
          '0xF076',
          '0xF080',
          '0xF084',
          '0xF040',
          '0xF0A1',
          '0xF0A2',
          '0xF0D6',
          '0xF0E3',
          '0xF0EB',
          '0xF0F3',
          '0xF135',
          '0xF13D',
          '0xF2FE',
        ],
        X = [...G, ...J, ...q, ...Y, ...$, ...Q].map((e) => +e),
        ee = new Set(X)
      const te = [
          {
            title: A.t(null, { context: 'emoji_group' }, o(415426)),
            emojis: [],
            content: n.createElement(W.IconItem, { icon: U }),
          },
          {
            title: A.t(null, { context: 'emoji_group' }, o(433628)),
            emojis: G,
            content: n.createElement(W.IconItem, { icon: Z }),
          },
          {
            title: A.t(null, { context: 'emoji_group' }, o(877011)),
            emojis: Y,
            content: n.createElement(W.IconItem, { icon: j }),
          },
          {
            title: A.t(null, { context: 'emoji_group' }, o(111739)),
            emojis: $,
            content: n.createElement(W.IconItem, { icon: K }),
          },
          {
            title: A.t(null, { context: 'emoji_group' }, o(814281)),
            emojis: J,
            content: n.createElement(W.IconItem, { icon: H }),
          },
          {
            title: A.t(null, { context: 'emoji_group' }, o(572302)),
            emojis: Q,
            content: n.createElement(W.IconItem, { icon: z }),
          },
          {
            title: A.t(null, { context: 'emoji_group' }, o(157792)),
            emojis: q,
            content: n.createElement(W.IconItem, { icon: P }),
          },
        ],
        oe = {
          [y.Icons]: R.drawingToolsIcons.heart,
          [y.Emojis]: R.drawingToolsIcons.smile,
          [y.Stickers]: R.drawingToolsIcons.sticker,
        },
        ne = [
          {
            title: y.Emojis,
            content: n.createElement(V, { text: A.t(null, void 0, o(719570)) }),
          },
          {
            title: y.Stickers,
            content: n.createElement(V, { text: A.t(null, void 0, o(84121)) }),
          },
          {
            title: y.Icons,
            content: n.createElement(V, { text: A.t(null, void 0, o(792464)) }),
          },
        ]
      var ie = o(72571),
        se = o(930202),
        re = o(624216),
        ae = o(510618),
        le = o(111706),
        ce = o(759339),
        ue = o(493173),
        de = o(179807),
        he = o(214665)
      const me = o(922878),
        ve = (0, n.forwardRef)((e, t) => {
          const {
              buttonActiveClass: o,
              buttonClass: i,
              buttonIcon: s,
              buttonTitle: a,
              buttonHotKey: c,
              dropdownTooltip: u,
              children: d,
              isActive: h,
              isGrayed: m,
              onClickWhenGrayed: v,
              checkable: p,
              isSmallTablet: b,
              theme: g = me,
              onClickButton: f,
              onArrowClick: C,
              openDropdownByClick: _,
              onMenuFocus: E = de.handleAccessibleMenuFocus,
              onMenuKeyDown: T = de.handleAccessibleMenuKeyDown,
              ...k
            } = e,
            F = (0, ue.mergeThemes)(ae.DEFAULT_MENU_THEME, {
              menuBox: g.menuBox,
            }),
            y = x.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
            [A, M] = (0, n.useState)(!1),
            [I, N] = (0, n.useState)(!1),
            L = (0, n.useRef)(null),
            D = (0, n.useRef)(null),
            B = (0, n.useRef)(null),
            W = (0, n.useRef)(0),
            O = (0, n.useRef)(0),
            [V, R] = (0, S.useRovingTabindexElement)(null),
            [P, H] = (0, S.useRovingTabindexElement)(null)
          return (
            (0, n.useImperativeHandle)(t, () => ({ open: () => M(!0) }), []),
            n.createElement(
              'div',
              {
                ...k,
                className: r(g.dropdown, {
                  [g.isGrayed]: m,
                  [g.isActive]: h,
                  [g.isOpened]: A,
                }),
                onClick: m ? v : void 0,
                onKeyDown: (e) => {
                  var t
                  if (
                    e.defaultPrevented ||
                    !(e.target instanceof Node) ||
                    !x.PLATFORM_ACCESSIBILITY_ENABLED
                  )
                    return
                  const o = (0, se.hashFromEvent)(e)
                  if (e.currentTarget.contains(e.target) || 27 !== o) return
                  e.preventDefault(),
                    j(!1),
                    I &&
                      (null === (t = null == P ? void 0 : P.current) ||
                        void 0 === t ||
                        t.focus())
                },
                ref: L,
              },
              n.createElement(
                'div',
                { ref: D, className: g.control },
                n.createElement(
                  'div',
                  {
                    ...(() => {
                      if (!m)
                        return l.mobiletouch
                          ? p
                            ? { onTouchStart: Z, onTouchEnd: G, onTouchMove: K }
                            : { onClick: U }
                          : { onMouseDown: Z, onMouseUp: J }
                      return {}
                    })(),
                    className: r(
                      g.buttonWrap,
                      x.PLATFORM_ACCESSIBILITY_ENABLED && g.accessible,
                    ),
                  },
                  n.createElement(w.ToolButton, {
                    activeClass: o,
                    className: r(i, g.button),
                    icon: s,
                    isActive: h,
                    isGrayed: m,
                    isTransparent: !p,
                    ref: V,
                    tag: y,
                    tabIndex: R,
                    onClick: (e) => {
                      if (!(0, le.isKeyboardClick)(e)) return
                      _ ? j(!0, !0) : null == f || f()
                    },
                    tooltip: a,
                    buttonHotKey: c,
                    'data-tooltip-delay': 1500,
                    tooltipPosition: 'vertical',
                  }),
                ),
                !m &&
                  !l.mobiletouch &&
                  n.createElement(
                    y,
                    {
                      className: r(
                        g.arrow,
                        u && 'apply-common-tooltip common-tooltip-vertical',
                        x.PLATFORM_ACCESSIBILITY_ENABLED && g.accessible,
                      ),
                      onClick: (e) => {
                        null == C || C(), j(void 0, (0, le.isKeyboardClick)(e))
                      },
                      onKeyDown: (e) => {
                        if (
                          e.defaultPrevented ||
                          !(e.target instanceof Node) ||
                          !x.PLATFORM_ACCESSIBILITY_ENABLED
                        )
                          return
                        const t = (0, se.hashFromEvent)(e)
                        if (e.currentTarget.contains(e.target))
                          switch (t) {
                            case 39:
                              if (A) return
                              e.preventDefault(), j(!0, !0)
                              break
                            case 27:
                              if (!A) return
                              e.preventDefault(), j(!1)
                          }
                      },
                      type: x.PLATFORM_ACCESSIBILITY_ENABLED
                        ? 'button'
                        : void 0,
                      'data-role': x.PLATFORM_ACCESSIBILITY_ENABLED
                        ? void 0
                        : 'menu-handle',
                      ref: P,
                      tabIndex: H,
                      'aria-pressed': x.PLATFORM_ACCESSIBILITY_ENABLED
                        ? h
                        : void 0,
                      'aria-label': x.PLATFORM_ACCESSIBILITY_ENABLED
                        ? u
                        : void 0,
                      'data-tooltip': u,
                    },
                    n.createElement(ie.Icon, {
                      className: g.arrowIcon,
                      icon: he,
                    }),
                  ),
              ),
              !m &&
                (b
                  ? A &&
                    n.createElement(
                      ce.Drawer,
                      { className: g.drawer, onClose: z, position: 'Bottom' },
                      d,
                    )
                  : n.createElement(
                      re.PopupMenu,
                      {
                        theme: F,
                        doNotCloseOn: () => {
                          if (null === L.current) return []
                          return [L.current]
                        },
                        isOpened: A,
                        onClose: z,
                        position: () => {
                          if (!D || !D.current) return { x: 0, y: 0 }
                          const e = D.current.getBoundingClientRect()
                          return { x: e.left + e.width + 1, y: e.top - 6 }
                        },
                        onKeyDown: T,
                        onFocus: (e) => E(e, P),
                        controller: B,
                        onOpen: () => {
                          var e
                          if (!x.PLATFORM_ACCESSIBILITY_ENABLED) return
                          null === (e = B.current) || void 0 === e || e.focus()
                        },
                        tabIndex: x.PLATFORM_ACCESSIBILITY_ENABLED
                          ? -1
                          : void 0,
                      },
                      d,
                    )),
            )
          )
          function j(e, t = !1) {
            const o = void 0 !== e ? e : !A
            M(o), N(!!o && t)
          }
          function z() {
            j(!1)
          }
          function U() {
            f && f(), j()
          }
          function Z() {
            if (l.mobiletouch && !p) !O.current && f && f()
            else {
              if (W.current)
                return clearTimeout(W.current), (W.current = 0), void j(!0)
              W.current = setTimeout(() => {
                ;(W.current = 0), !O.current && f && f()
              }, 175)
            }
            O.current = setTimeout(() => {
              ;(O.current = 0), j(!0)
            }, 300)
          }
          function K() {
            clearTimeout(O.current),
              (O.current = 0),
              clearTimeout(W.current),
              (W.current = 0)
          }
          function G(e) {
            e.cancelable && e.preventDefault(), J()
          }
          function J() {
            O.current &&
              (clearTimeout(O.current),
              (O.current = 0),
              A
                ? j(!1)
                : p || A || l.mobiletouch || (!h && !_)
                  ? !W.current && f && f()
                  : j(!0))
          }
        })
      var pe = o(499547),
        be = o(65559),
        ge = o(584776),
        fe = o(717866)
      class Ce extends ge.CommonJsonStoreService {
        constructor(e, t, o, n, i = 18) {
          super(fe.TVXWindowEvents, c, e, t, []),
            (this._onChangeDrawingState = () => {
              const e = d[this._drawingType].value()
              this._promote(e)
            }),
            (this._sanitizer = o),
            (this._drawingType = n),
            (this._maxRecentCount = i),
            d[this._drawingType].subscribe(this._onChangeDrawingState)
        }
        destroy() {
          d[this._drawingType].unsubscribe(this._onChangeDrawingState),
            super.destroy()
        }
        _deserialize(e) {
          const t = this._sanitizer(e)
          return this._removeUnavailableRecents(e, t)
        }
        _removeUnavailableRecents(e, t) {
          return (
            Array.isArray(e)
              ? e.length > this._maxRecentCount &&
                (t = e.slice(0, this._maxRecentCount))
              : (t = []),
            t
          )
        }
        _promote(e) {
          let t = [...this.get()]
          const o = t.indexOf(e)
          ;-1 !== o && t.splice(o, 1),
            (t = [e, ...t.slice(0, this._maxRecentCount - 1)]),
            this.set(t)
        }
      }
      const _e = new Ce(
        'RECENT_ICONS_CHANGED',
        'linetoolicon.recenticons',
        (e) => e.filter((e) => ee.has(e)),
        'iconTool',
      )
      var Ee = o(455619)
      function Te(e) {
        const { fallback: t, ...o } = e
        return n.createElement(
          n.Suspense,
          { fallback: null != t ? t : null },
          n.createElement(we, { ...o }),
        )
      }
      const we = n.lazy(async () => {
        const { getSvgContentForCharCode: e } = await o
          .e(7987)
          .then(o.bind(o, 408027))
        return {
          default: (t) => {
            var o
            const { charCode: i } = t,
              s = null !== (o = e(i)) && void 0 !== o ? o : void 0
            return n.createElement(ie.Icon, {
              icon: s,
              className: Ee.iconContainer,
            })
          },
        }
      })
      var xe = o(420274)
      var Se = o(611005)
      const ke = new Ce(
          'RECENT_EMOJIS_CHANGED',
          'linetoolemoji.recents',
          Se.removeUnavailableEmoji,
          'emojiTool',
        ),
        Fe = [
          'elon',
          'doge',
          'dislike',
          'yolo',
          'whale',
          'wagmi',
          'tendies',
          'short',
          'rugged',
          'shill',
          'rekt',
          'sell',
          'paper-hands',
          'og',
          'fud',
          'gm',
          'ngmi',
          'moon',
          'love',
          'lambo',
          'ethereum',
          'look',
          'diamond-hand',
          'leap',
          'like',
          'few',
          'bitcoin',
          'bag-holder',
          'buy-the-dip',
          'buy',
          'hodl',
        ]
      var ye = o(537603),
        Ae = o(90624)
      const Me = new Set(Fe)
      const Ie = [
          {
            title: A.t(null, { context: 'emoji_group' }, o(415426)),
            emojis: [],
            content: n.createElement(W.IconItem, { icon: ye }),
          },
          {
            title: 'TradingView',
            emojis: Fe,
            content: n.createElement(W.IconItem, { icon: Ae }),
          },
        ],
        Ne = new Ce(
          'RECENT_STICKERS_CHANGED',
          'linetoolsticker.recents',
          (e) => e.filter((e) => Me.has(e)),
          'stickerTool',
          3,
        )
      var Le = o(840976),
        De = o(168233),
        Be = o(478227)
      var We = o(723407),
        Oe = o(923091)
      const Ve = {
        [y.Icons]: {
          service: _e,
          toolName: 'LineToolIcon',
          ItemComponent: (e) => {
            const { emoji: t, className: o } = e
            return n.createElement(
              'div',
              { className: a()(xe.item, o) },
              n.createElement(Te, { charCode: Number(t) }),
            )
          },
          icons: te,
          onEmojiSelect: (e) => {
            d.iconTool.setValue(Number(e)), d.tool.setValue('LineToolIcon')
          },
        },
        [y.Emojis]: {
          service: ke,
          toolName: 'LineToolEmoji',
          icons: Se.emojiGroups,
          onEmojiSelect: (e) => {
            d.emojiTool.setValue(e), d.tool.setValue('LineToolEmoji')
          },
        },
        [y.Stickers]: {
          service: Ne,
          toolName: 'LineToolSticker',
          ItemComponent: (e) => {
            const { emoji: t } = e,
              { size: i } = (0, Le.useEnsuredContext)(
                De.EmojiListContentContext,
              ),
              [s, r] = (0, n.useState)()
            return (
              (0, n.useEffect)(() => {
                o.e(5598)
                  .then(o.bind(o, 685683))
                  .then(({ getSvgContentForSticker: e }) => {
                    const o = e(t)
                    o && r(o)
                  })
              }, []),
              n.createElement(ie.Icon, {
                className: Be.sticker,
                icon: null !== s ? s : void 0,
                style: { width: `${i}px`, height: `${i}px` },
              })
            )
          },
          RowComponent: (e) =>
            n.createElement(We.EmojisRow, { ...e, className: Oe.stickerRow }),
          icons: Ie,
          onEmojiSelect: (e) => {
            d.stickerTool.setValue(e), d.tool.setValue('LineToolSticker')
          },
          getEmojiSize: (e) => (e ? 78 : 112),
        },
      }
      var Re = o(412451)
      function Pe(e) {
        const {
            isSmallTablet: t,
            maxHeight: o,
            activeTab: i,
            setActiveTab: s,
          } = e,
          a = Ve[i],
          {
            service: l,
            ItemComponent: c,
            RowComponent: u,
            onEmojiSelect: d,
            getEmojiSize: h,
          } = a,
          m = h && h(t),
          [v, p] = (0, n.useState)(He(a))
        return (
          (0, n.useLayoutEffect)(() => {
            const e = {},
              t = () => {
                const e = He(a)
                p(e)
              }
            return (
              t(),
              l.getOnChange().subscribe(e, t),
              () => {
                l.getOnChange().unsubscribeAll(e)
              }
            )
          }, [a]),
          n.createElement(
            'div',
            { style: { maxHeight: o } },
            n.createElement(pe.EmojiList, {
              className: r(Re.desktopSize, t && Re.smallSize),
              emojis: v,
              onSelect: (e) => {
                d(e), (0, T.globalCloseMenu)()
              },
              ItemComponent: c,
              RowComponent: u,
              height: o,
              category: i,
              emojiSize: m,
            }),
            n.createElement(be.GroupTabs, {
              className: Re.tabs,
              tabClassName: Re.categories,
              tabs: ne,
              activeTab: i,
              onTabClick: (e) => {
                s(e)
              },
            }),
          )
        )
      }
      function He(e) {
        const { icons: t, service: o } = e,
          n = [...t],
          i = o.get()
        return (
          (n[0].emojis = i.map((e) => String(e))),
          n.filter((e) => e.emojis.length)
        )
      }
      var je = o(180185),
        ze = o(210888),
        Ue = o(37531)
      const Ze = {
          icon: A.t(null, void 0, o(326579)),
          dropdownTooltip: A.t(null, void 0, o(792464)),
        },
        Ke = (0, ue.mergeThemes)(me, {
          menuBox: Ue.menuBox,
          drawer: Ue.drawer,
        }),
        Ge = Number.parseInt(ze['default-drawer-min-top-distance'])
      function Je(e) {
        const { isGrayed: t, isSmallTablet: o } = e,
          i = (0, M.filterDataProps)(e),
          [s, r] = B(),
          [a] = (0, I.useWatchedValue)(d.tool),
          { toolName: l } = Ve[s]
        return n.createElement(
          ve,
          {
            theme: Ke,
            buttonIcon: oe[s],
            buttonTitle: Ze.icon,
            dropdownTooltip: Ze.dropdownTooltip,
            isActive: a === l,
            isGrayed: t,
            isSmallTablet: o,
            onClickButton: () => {
              c()
            },
            onClickWhenGrayed: () =>
              (0, h.emit)('onGrayedObjectClicked', {
                type: 'drawing',
                name: b.lineToolsInfo[l].localizedName,
              }),
            onArrowClick: () => {
              c('menu')
            },
            openDropdownByClick: !0,
            onMenuFocus: qe,
            onMenuKeyDown: (e) => {
              if (!x.PLATFORM_ACCESSIBILITY_ENABLED) return
              if (e.defaultPrevented) return
              const t = (0, je.hashFromEvent)(e)
              ;(9 !== t && t !== je.Modifiers.Shift + 9) ||
                (0, x.updateTabIndexes)()
            },
            ...i,
          },
          n.createElement(Pe, {
            isSmallTablet: o,
            maxHeight: o ? Math.min(679, window.innerHeight - Ge) : 679,
            activeTab: s,
            setActiveTab: r,
          }),
        )
        function c(e) {
          0
        }
      }
      function qe(e) {
        if (!e.target || !x.PLATFORM_ACCESSIBILITY_ENABLED) return
        const t = e.currentTarget
        e.target === t &&
          ((0, x.updateTabIndexes)(),
          setTimeout(() => {
            if (document.activeElement !== t) return
            const [e] = (0, x.queryTabbableElements)(t).sort(
              x.navigationOrderComparator,
            )
            e && e.focus()
          }))
      }
      var Ye = o(602164)
      class $e extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._handleClick = () => {
              this.props.saveDefaultOnChange &&
                (0, Ye.saveDefaultProperties)(!0)
              const e = !this.props.property.value()
              this.props.property.setValue(e),
                this.props.saveDefaultOnChange &&
                  (0, Ye.saveDefaultProperties)(!1),
                this.props.onClick && this.props.onClick(e)
            }),
            (this.state = { isActive: this.props.property.value() })
        }
        componentDidMount() {
          this.props.property.subscribe(this, this._onChange)
        }
        componentWillUnmount() {
          this.props.property.unsubscribe(this, this._onChange)
        }
        render() {
          const { toolName: e } = this.props,
            { isActive: t } = this.state,
            o = b.lineToolsInfo[e]
          return n.createElement(k, {
            icon: t && o.iconActive ? o.iconActive : o.icon,
            isActive: t,
            onClick: this._handleClick,
            tooltip: o.localizedName,
            buttonHotKey: o.hotKey,
            'data-name': e,
          })
        }
        _onChange(e) {
          this.setState({ isActive: e.value() })
        }
      }
      class Qe extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._handleClick = () => {
              var e, t
              d.tool.setValue(this.props.toolName),
                null === (t = (e = this.props).onClick) ||
                  void 0 === t ||
                  t.call(e)
            }),
            (this._onChange = () => {
              this.setState({
                isActive: d.tool.value() === this.props.toolName,
              })
            }),
            (this.state = { isActive: d.tool.value() === this.props.toolName })
        }
        componentDidMount() {
          d.tool.subscribe(this._onChange)
        }
        componentWillUnmount() {
          d.tool.unsubscribe(this._onChange)
        }
        render() {
          const { toolName: e } = this.props,
            { isActive: t } = this.state,
            o = b.lineToolsInfo[e]
          return n.createElement(k, {
            icon: b.lineToolsInfo[e].icon,
            isActive: t,
            isTransparent: !0,
            onClick: this._handleClick,
            tooltip: o.localizedName,
            buttonHotKey: o.hotKey,
            'data-name': e,
          })
        }
      }
      class Xe extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._boundUndoModel = null),
            (this._handleClick = () => {
              const e = this._activeChartWidget()
              e.hasModel() && e.model().zoomFromViewport()
            }),
            (this._syncUnzoomButton = () => {
              const e = this._activeChartWidget()
              let t = !1
              if (e.hasModel()) {
                const o = e.model()
                this._boundUndoModel !== o &&
                  (this._boundUndoModel &&
                    this._boundUndoModel
                      .zoomStack()
                      .onChange()
                      .unsubscribe(null, this._syncUnzoomButton),
                  o
                    .zoomStack()
                    .onChange()
                    .subscribe(null, this._syncUnzoomButton),
                  (this._boundUndoModel = o)),
                  (t = !o.zoomStack().isEmpty())
              } else e.withModel(null, this._syncUnzoomButton)
              this.setState({ isVisible: t })
            }),
            (this.state = { isVisible: !1 })
        }
        componentDidMount() {
          this.props.chartWidgetCollection.activeChartWidget.subscribe(
            this._syncUnzoomButton,
            { callWithLast: !0 },
          )
        }
        componentWillUnmount() {
          this.props.chartWidgetCollection.activeChartWidget.unsubscribe(
            this._syncUnzoomButton,
          )
        }
        render() {
          return this.state.isVisible
            ? n.createElement(F, {
                action: this._handleClick,
                isTransparent: !0,
                toolName: 'zoom-out',
              })
            : n.createElement('div', null)
        }
        _activeChartWidget() {
          return this.props.chartWidgetCollection.activeChartWidget.value()
        }
      }
      var et = o(917850),
        tt = o(110495),
        ot = o(163915),
        nt = o(347041),
        it = o(137869),
        st = o(614417),
        rt = o(919577),
        at = o(390949)
      function lt(e) {
        return 'name' in e
      }
      class ct extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._onChangeDrawingState = () => {
              const e = this._getActiveToolName()
              this.setState({ current: e || this.state.current, isActive: !!e })
            }),
            (this._handleClickButton = () => {
              this._trackClick()
              const { current: e } = this.state
              !v.CheckMobile.any() && e && this._selectTool(e)
            }),
            (this._handleClickItem = (e) => {
              this._selectTool(e)
            }),
            (this._handleGrayedClick = (e) => {
              ;(0, h.emit)('onGrayedObjectClicked', {
                type: 'drawing',
                name: b.lineToolsInfo[e].localizedName,
              })
            }),
            (this._handleClickFavorite = (e) => {
              this.state.favState && this.state.favState[e]
                ? tt.LinetoolsFavoritesStore.removeFavorite(e)
                : tt.LinetoolsFavoritesStore.addFavorite(e)
            }),
            (this._onAddFavorite = (e) => {
              this.setState({
                favState: {
                  ...this.state.favState,
                  [e]: !0,
                },
              })
            }),
            (this._onRemoveFavorite = (e) => {
              this.setState({ favState: { ...this.state.favState, [e]: !1 } })
            }),
            (this._onSyncFavorites = () => {
              this.setState({ favState: this._composeFavState() })
            }),
            (this._handleArrowClick = () => {
              this._trackClick('menu')
            }),
            (this._trackClick = (e) => {
              const { trackLabel: t } = this.props
            })
          const t = this._getActiveToolName()
          this.state = {
            current: t || this._firstNonGrayedTool(),
            favState: this._composeFavState(),
            isActive: !!t,
          }
        }
        componentDidMount() {
          d.tool.subscribe(this._onChangeDrawingState),
            tt.LinetoolsFavoritesStore.favoriteAdded.subscribe(
              null,
              this._onAddFavorite,
            ),
            tt.LinetoolsFavoritesStore.favoriteRemoved.subscribe(
              null,
              this._onRemoveFavorite,
            ),
            tt.LinetoolsFavoritesStore.favoritesSynced.subscribe(
              null,
              this._onSyncFavorites,
            )
        }
        componentWillUnmount() {
          d.tool.unsubscribe(this._onChangeDrawingState),
            tt.LinetoolsFavoritesStore.favoriteAdded.unsubscribe(
              null,
              this._onAddFavorite,
            ),
            tt.LinetoolsFavoritesStore.favoriteRemoved.unsubscribe(
              null,
              this._onRemoveFavorite,
            ),
            tt.LinetoolsFavoritesStore.favoritesSynced.unsubscribe(
              null,
              this._onSyncFavorites,
            )
        }
        componentDidUpdate(e, t) {
          e.lineTools !== this.props.lineTools &&
            this.setState({ favState: this._composeFavState() })
        }
        render() {
          const { current: e, favState: t, isActive: o } = this.state
          if (!e) return n.createElement(n.Fragment, null)
          const {
              favoriting: i,
              grayedTools: s,
              lineTools: r,
              dropdownTooltip: a,
              isSmallTablet: l,
            } = this.props,
            c = this._showShortcuts(),
            u = b.lineToolsInfo[e],
            d = (0, M.filterDataProps)(this.props)
          return n.createElement(
            'span',
            null,
            n.createElement(
              ve,
              {
                buttonIcon: u.icon,
                buttonTitle: u.localizedName,
                buttonHotKey: u.hotKey,
                dropdownTooltip: a,
                isActive: o,
                onClickButton: this._handleClickButton,
                onArrowClick: this._handleArrowClick,
                isSmallTablet: l,
                ...d,
              },
              r.map((r, a) => {
                var u, d
                if ('title' in r)
                  return n.createElement(
                    n.Fragment,
                    { key: r.title },
                    a > 0 ? n.createElement(et.PopupMenuSeparator, null) : null,
                    n.createElement(
                      ot.ToolWidgetMenuSummary,
                      { className: at.sectionTitle },
                      r.title,
                    ),
                  )
                const { name: h } = r,
                  m =
                    null ===
                      (d =
                        null === (u = b.lineToolsInfo[h]) || void 0 === u
                          ? void 0
                          : u.selectHotkey) || void 0 === d
                      ? void 0
                      : d.hash,
                  v = b.lineToolsInfo[h],
                  p = s[h]
                return n.createElement(it.AccessibleMenuItem, {
                  key: h,
                  'data-name': h,
                  theme: l ? st.multilineLabelWithIconAndToolboxTheme : void 0,
                  dontClosePopup: p,
                  forceShowShortcuts: c,
                  shortcut: !l && m ? (0, je.humanReadableHash)(m) : void 0,
                  icon: v.icon,
                  isActive: o && e === h,
                  appearAsDisabled: p,
                  label: v.localizedName,
                  showToolboxOnFocus: x.PLATFORM_ACCESSIBILITY_ENABLED,
                  onClick: p ? this._handleGrayedClick : this._handleClickItem,
                  onClickArg: h,
                  showToolboxOnHover: !t[h],
                  toolbox:
                    i && !p
                      ? n.createElement(nt.MenuFavoriteButton, {
                          isActive: o && e === h,
                          isFilled: t[h],
                          onClick: () => this._handleClickFavorite(h),
                        })
                      : void 0,
                })
              }),
            ),
          )
        }
        _firstNonGrayedTool() {
          var e
          const { grayedTools: t, lineTools: o } = this.props
          return null === (e = o.find((e) => lt(e) && !t[e.name])) ||
            void 0 === e
            ? void 0
            : e.name
        }
        _showShortcuts() {
          return this.props.lineTools.some((e) => 'hotkeyHash' in e)
        }
        _getActiveToolName() {
          var e
          return null ===
            (e = this.props.lineTools.find(
              (e) => lt(e) && e.name === d.tool.value(),
            )) || void 0 === e
            ? void 0
            : e.name
        }
        async _selectTool(e) {
          d.tool.setValue(e)
        }
        _composeFavState() {
          const e = {}
          return (
            this.props.lineTools.forEach((t) => {
              lt(t) &&
                (e[t.name] = tt.LinetoolsFavoritesStore.isFavorite(t.name))
            }),
            e
          )
        }
      }
      var ut = o(32133),
        dt = o(192063),
        ht = o(246173)
      const mt = (0, ue.mergeThemes)(dt.DEFAULT_POPUP_MENU_ITEM_THEME, ht)
      var vt = o(593194)
      const pt = !1
      class bt extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._handleRemoveToolClick = () => {
              l.mobiletouch || this._handleRemoveDrawings(), ft()
            }),
            (this._handleRemoveDrawings = () => {
              gt('remove drawing'),
                this.props.chartWidgetCollection.activeChartWidget
                  .value()
                  .removeAllDrawingTools()
            }),
            (this._handleRemoveStudies = () => {
              gt('remove indicator'),
                this.props.chartWidgetCollection.activeChartWidget
                  .value()
                  .removeAllStudies()
            }),
            (this._handleRemoveAll = () => {
              gt('remove all'),
                this.props.chartWidgetCollection.activeChartWidget
                  .value()
                  .removeAllStudiesDrawingTools()
            }),
            (this._handleActiveChartWidgetChanged = (e) => {
              this._activeChartWidget &&
                this._unsubscribeToModelChanges(this._activeChartWidget),
                e && this._subscribeToModelChanges(e),
                (this._activeChartWidget = e),
                this._handleCollectionChanged()
            }),
            (this._handleCollectionChanged = () => {
              this.setState(this._getActualState())
            }),
            (this._getActualState = () => {
              if (
                !this._activeChartWidget ||
                !this._activeChartWidget.hasModel()
              )
                return { numOfDrawings: 0, numOfIndicators: 0 }
              const e = this._activeChartWidget.model().dataSources(),
                t = e
                  .filter(rt.isLineTool)
                  .filter((e) => e.isActualSymbol() && e.isUserDeletable()),
                o = e
                  .filter(vt.isStudy)
                  .filter((e) => e.removeByRemoveAllStudies())
              return { numOfDrawings: t.length, numOfIndicators: o.length }
            }),
            (this._activeChartWidget =
              this.props.chartWidgetCollection.activeChartWidget.value()),
            (this.state = this._getActualState())
        }
        componentDidMount() {
          this.props.chartWidgetCollection.activeChartWidget.subscribe(
            this._handleActiveChartWidgetChanged,
            { callWithLast: !0 },
          )
        }
        componentWillUnmount() {
          this._activeChartWidget &&
            this._unsubscribeToModelChanges(this._activeChartWidget),
            this.props.chartWidgetCollection.activeChartWidget.unsubscribe(
              this._handleActiveChartWidgetChanged,
            )
        }
        render() {
          const e = this.props.isSmallTablet ? mt : void 0,
            { numOfDrawings: t, numOfIndicators: i } = this.state,
            s = A.t(
              null,
              {
                plural: '{amount} drawings',
                count: t,
                replace: { amount: t.toString() },
              },
              o(293030),
            ),
            r = A.t(
              null,
              {
                plural: '{amount} indicators',
                count: i,
                replace: { amount: i.toString() },
              },
              o(580437),
            ),
            a = A.t(null, { replace: { drawings: s } }, o(630513)),
            l = A.t(null, { replace: { indicators: r } }, o(355084)),
            c = A.t(
              null,
              { replace: { drawings: s, indicators: r } },
              o(710049),
            )
          return n.createElement(
            ve,
            {
              buttonIcon: b.lineToolsInfo[this.props.toolName].icon,
              buttonTitle: a,
              onClickButton: this._handleRemoveToolClick,
              isSmallTablet: this.props.isSmallTablet,
              'data-name': this.props.toolName,
              onArrowClick: this._handleArrowClick,
              openDropdownByClick: pt,
            },
            n.createElement(it.AccessibleMenuItem, {
              'data-name': 'remove-drawing-tools',
              label: a,
              onClick: this._handleRemoveDrawings,
              theme: e,
            }),
            n.createElement(it.AccessibleMenuItem, {
              'data-name': 'remove-studies',
              label: l,
              onClick: this._handleRemoveStudies,
              theme: e,
            }),
            n.createElement(it.AccessibleMenuItem, {
              'data-name': 'remove-all',
              label: c,
              onClick: this._handleRemoveAll,
              theme: e,
            }),
          )
        }
        _handleArrowClick() {
          ft('menu')
        }
        _subscribeToModelChanges(e) {
          e.withModel(this, () => {
            this._handleCollectionChanged(),
              e
                .model()
                .model()
                .dataSourceCollectionChanged()
                .subscribe(this, this._handleCollectionChanged)
          })
        }
        _unsubscribeToModelChanges(e) {
          e.hasModel() &&
            e
              .model()
              .model()
              .dataSourceCollectionChanged()
              .unsubscribe(this, this._handleCollectionChanged),
            e.modelCreated().unsubscribeAll(this)
        }
      }
      function gt(e) {
        ;(0, ut.trackEvent)('GUI', 'Chart Left Toolbar', e)
      }
      function ft(e) {
        0
      }
      var Ct = o(812297),
        _t = o(126309)
      const Et = n.createContext({ hideMode: 'drawings', isActive: !1 })
      function Tt(e) {
        const {
            hideMode: t,
            option: { label: o, dataName: i, getBoxedValue: s },
            isSmallTablet: r,
            onClick: a,
          } = e,
          { hideMode: l, isActive: c } = (0, n.useContext)(Et),
          u = null == s ? void 0 : s()
        return 'all' === t || u
          ? n.createElement(it.AccessibleMenuItem, {
              label: o,
              isActive: l === t && c,
              onClick: () => {
                a(t, (0, Ct.toggleHideMode)(t))
              },
              'data-name': i,
              theme: r ? mt : void 0,
            })
          : n.createElement(n.Fragment, null)
      }
      const wt = {
        drawings: {
          active: R.drawingToolsIcons.hideAllDrawingToolsActive,
          inactive: R.drawingToolsIcons.hideAllDrawingTools,
        },
        indicators: {
          active: R.drawingToolsIcons.hideAllIndicatorsActive,
          inactive: R.drawingToolsIcons.hideAllIndicators,
        },
        positions: {
          active: R.drawingToolsIcons.hideAllPositionsToolsActive,
          inactive: R.drawingToolsIcons.hideAllPositionsTools,
        },
        all: {
          active: R.drawingToolsIcons.hideAllDrawingsActive,
          inactive: R.drawingToolsIcons.hideAllDrawings,
        },
      }
      function xt(e) {
        const { isSmallTablet: t } = e,
          [{ isActive: o, hideMode: i }, r] = (0, n.useState)(() => ({
            isActive: !1,
            hideMode: (0, Ct.getSavedHideMode)(),
          }))
        ;(0, n.useEffect)(
          () => (
            _t.hideStateChange.subscribe(null, r),
            () => {
              _t.hideStateChange.unsubscribe(null, r)
            }
          ),
          [],
        )
        const a = b.lineToolsInfo.hideAllDrawings,
          {
            trackLabel: l,
            tooltip: c,
            dataName: u,
          } = (0, s.ensureDefined)((0, Ct.getHideOptions)().get(i)),
          d = wt[i][o ? 'active' : 'inactive'],
          h = o ? c.active : c.inactive
        return n.createElement(
          ve,
          {
            buttonIcon: d,
            buttonTitle: h,
            buttonHotKey: a.hotKey,
            onClickButton: () => {
              ;(0, Ct.toggleHideMode)(i), St(l, !o), kt(o ? 'on' : 'off')
            },
            isSmallTablet: t,
            isActive: o,
            checkable: !0,
            'data-name': 'hide-all',
            'data-type': u,
            onArrowClick: () => {
              kt('menu')
            },
          },
          n.createElement(
            Et.Provider,
            { value: { isActive: o, hideMode: i } },
            Array.from((0, Ct.getHideOptions)()).map(([e, o]) =>
              n.createElement(Tt, {
                key: e,
                hideMode: e,
                option: o,
                isSmallTablet: t,
                onClick: m,
              }),
            ),
          ),
        )
        function m(e, t) {
          St(
            (0, s.ensureDefined)((0, Ct.getHideOptions)().get(e)).trackLabel,
            t,
          )
        }
      }
      function St(e, t) {
        ;(0, ut.trackEvent)(
          'GUI',
          'Chart Left Toolbar',
          `${e} ${t ? 'on' : 'off'}`,
        )
      }
      function kt(e) {
        0
      }
      var Ft = o(149123),
        yt = o(751445)
      const At = A.t(null, void 0, o(149616))
      class Mt extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._instance = null),
            (this._promise = null),
            (this._bindedForceUpdate = () => this.forceUpdate()),
            (this._handleClick = () => {
              null !== this._instance &&
                (this._instance.isVisible()
                  ? (this._instance.hideAndSaveSettingsValue(),
                    this._trackClick(!1))
                  : (this._instance.showAndSaveSettingsValue(),
                    this._trackClick(!0)))
            })
        }
        componentDidMount() {
          const e = (this._promise = (0, s.ensureNotNull)(
            (0, Ft.getFavoriteDrawingToolbarPromise)(),
          ))
          e.then((t) => {
            this._promise === e &&
              ((this._instance = t),
              this._instance.canBeShown().subscribe(this._bindedForceUpdate),
              this._instance.visibility().subscribe(this._bindedForceUpdate),
              this.forceUpdate())
          })
        }
        componentWillUnmount() {
          ;(this._promise = null),
            null !== this._instance &&
              (this._instance.canBeShown().unsubscribe(this._bindedForceUpdate),
              this._instance.visibility().unsubscribe(this._bindedForceUpdate),
              (this._instance = null))
        }
        render() {
          return null !== this._instance && this._instance.canBeShown().value()
            ? n.createElement(k, {
                id: this.props.id,
                icon: yt,
                isActive: this._instance.isVisible(),
                onClick: this._handleClick,
                tooltip: At,
              })
            : null
        }
        _trackClick(e) {
          0
        }
      }
      var It = o(297265),
        Nt = o(175421),
        Lt = o(980363),
        Dt = o(285470)
      const Bt = {
        [Nt.MagnetMode.WeakMagnet]: {
          id: Nt.MagnetMode.WeakMagnet,
          name: 'weakMagnet',
          icon: R.drawingToolsIcons.magnet,
          localizedName: A.t(null, void 0, o(245265)),
        },
        [Nt.MagnetMode.StrongMagnet]: {
          id: Nt.MagnetMode.StrongMagnet,
          name: 'strongMagnet',
          icon: R.drawingToolsIcons.strongMagnet,
          localizedName: A.t(null, void 0, o(685422)),
        },
      }
      function Wt(e) {
        const { isSmallTablet: t } = e,
          o = (0, It.useWatchedValueReadonly)({
            watchedValue: (0, Lt.magnetEnabled)(),
          }),
          i = (0, It.useWatchedValueReadonly)({
            watchedValue: (0, Lt.magnetMode)(),
          })
        return n.createElement(
          'div',
          { className: Dt.toolButtonMagnet },
          n.createElement(
            ve,
            {
              'data-name': 'magnet-button',
              buttonIcon: Bt[i].icon,
              buttonTitle: b.lineToolsInfo.magnet.localizedName,
              isActive: o,
              onClickButton: () => {
                const e = !o
                ;(0, ut.trackEvent)(
                  'GUI',
                  'Chart Left Toolbar',
                  'magnet mode ' + (e ? 'on' : 'off'),
                ),
                  !1
                ;(0, Lt.setIsMagnetEnabled)(e)
              },
              buttonHotKey: b.lineToolsInfo.magnet.hotKey,
              checkable: !0,
              isSmallTablet: t,
              onArrowClick: () => {
                0
              },
            },
            Object.values(Bt).map(
              ({ id: e, name: r, localizedName: a, icon: l }) =>
                n.createElement(it.AccessibleMenuItem, {
                  key: e,
                  className: t ? Dt.toolButtonMagnet__menuItem : void 0,
                  'data-name': r,
                  icon: l,
                  isActive: o && i === e,
                  label: a,
                  onClick: s,
                  onClickArg: e,
                }),
            ),
          ),
          !1,
        )
        function s(e) {
          void 0 !== e &&
            ((0, ut.trackEvent)(
              'GUI',
              'Magnet mode',
              e === Nt.MagnetMode.WeakMagnet ? 'Weak' : 'Strong',
            ),
            (0, Lt.setMagnetMode)(e))
        }
      }
      var Ot
      !((e) => {
        ;(e.Screenshot = 'drawing-toolbar-screenshot'),
          (e.FavoriteDrawings = 'drawing-toolbar-favorite-drawings'),
          (e.ObjectTree = 'drawing-toolbar-object-tree')
      })(Ot || (Ot = {}))
      var Vt = o(522224),
        Rt = o(199663),
        Pt = o(119930),
        Ht = o(28466),
        jt = o(622614),
        zt = o(380348)
      class Ut extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._syncVisibleState = () => {
              this.setState({ isVisible: this._isMultipleLayout() })
            }),
            (this.state = { isVisible: this._isMultipleLayout() })
        }
        componentDidMount() {
          this.props.layout.subscribe(this._syncVisibleState)
        }
        componentWillUnmount() {
          this.props.layout.unsubscribe(this._syncVisibleState)
        }
        render() {
          return this.state.isVisible
            ? this.props.children
            : n.createElement('div', null)
        }
        _isMultipleLayout() {
          return (0, zt.isMultipleLayout)(this.props.layout.value())
        }
      }
      var Zt = o(960732),
        Kt = o(22231)
      const Gt = (0, ue.mergeThemes)(
          Zt.DEFAULT_VERTICAL_TOOLBAR_HIDER_THEME,
          Kt,
        ),
        Jt = {
          hide: A.t(null, void 0, o(396411)),
          show: A.t(null, void 0, o(563354)),
        }
      class qt extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._toggleVisibility = () => {
              C.isDrawingToolbarVisible.setValue(
                !C.isDrawingToolbarVisible.value(),
              )
            })
        }
        render() {
          const { toolbarVisible: e, 'data-name': t } = this.props
          return n.createElement(
            'div',
            {
              className: r(
                Gt.toggleButton,
                'apply-common-tooltip common-tooltip-vertical',
                !e && Gt.collapsed,
              ),
              onClick: this._toggleVisibility,
              title: e ? Jt.hide : Jt.show,
              'data-name': t,
              'data-value': e ? 'visible' : 'collapsed',
            },
            n.createElement(Zt.VerticalToolbarHider, {
              direction: e ? 'left' : 'right',
              theme: e ? void 0 : Gt,
            }),
          )
        }
      }
      var Yt = o(163694),
        $t = o(996038),
        Qt = o(930052)
      const Xt = { chartWidgetCollection: o(719036).any.isRequired }
      var eo = o(261401),
        to = o(933603)
      const oo = u.enabled('right_toolbar'),
        no = u.enabled('keep_object_tree_widget_in_right_toolbar'),
        io = (0, v.onWidget)(),
        so = new m.Delegate(),
        ro = ut.trackEvent.bind(null, 'GUI', 'Chart Left Toolbar'),
        ao = (e, t) => ro(`${e} ${t ? 'on' : 'off'}`)
      class lo extends n.PureComponent {
        constructor(e) {
          var t
          super(e),
            (this._grayedTools = {}),
            (this._handleMeasureClick = () => {
              co('measure')
            }),
            (this._handleZoomInClick = () => {
              co('zoom in')
            }),
            (this._handleDrawingClick = (e) => {
              ao('drawing mode', e), co('drawing mode', e ? 'on' : 'off')
            }),
            (this._handleLockClick = (e) => {
              ao('lock all drawing', e), co('lock', e ? 'on' : 'off')
            }),
            (this._handleSyncClick = (e) => {
              ao('sync', e), co('sync', e ? 'on' : 'off')
            }),
            (this._handleObjectsTreeClick = () => {
              this._activeChartWidget().showObjectsTreeDialog(),
                co('object tree')
            }),
            (this._handleMouseOver = (e) => {
              ;(0, Vt.hoverMouseEventFilter)(e) &&
                this.setState({ isHovered: !0 })
            }),
            (this._handleMouseOut = (e) => {
              ;(0, Vt.hoverMouseEventFilter)(e) &&
                this.setState({ isHovered: !1 })
            }),
            (this._handleChangeVisibility = (e) => {
              this.setState({ isVisible: e })
            }),
            (this._handleEsc = () => {
              d.resetToCursor(!0)
            }),
            (this._handleWidgetbarSettled = (e) => {
              var t
              this.setState({
                isWidgetbarVisible: Boolean(
                  null === (t = window.widgetbar) || void 0 === t
                    ? void 0
                    : t.visible().value(),
                ),
                widgetbarSettled: e,
              })
            }),
            (this._handleWidgetbarVisible = (e) => {
              this.setState({ isWidgetbarVisible: e })
            }),
            d.init(),
            (this._toolsFilter = new g(this.props.drawingsAccess)),
            (this._filteredLineTools = f.lineTools.reduce((e, t) => {
              const { id: o, title: n, trackLabel: i } = t,
                s = (e) =>
                  this._toolsFilter.isToolEnabled(
                    b.lineToolsInfo[e.name].localizedName,
                  ),
                r = []
              return (
                (0, f.isLineToolsGroupWithSections)(t)
                  ? t.sections.forEach((e) => {
                      const t = e.items.filter(s)
                      t.length && r.push({ title: e.title }, ...t)
                    })
                  : r.push(...t.items.filter(s)),
                r.length &&
                  e.push({ id: o, title: n, trackLabel: i, items: r }),
                e
              )
            }, [])),
            this._filteredLineTools.forEach((e) => {
              e.items.forEach((e) => {
                'title' in e ||
                  (this._grayedTools[e.name] = this._toolsFilter.isToolGrayed(
                    b.lineToolsInfo[e.name].localizedName,
                  ))
              })
            }),
            (this.state = {
              isHovered: !1,
              isVisible: C.isDrawingToolbarVisible.value(),
              isWidgetbarVisible: Boolean(
                null === (t = window.widgetbar) || void 0 === t
                  ? void 0
                  : t.visible().value(),
              ),
              widgetbarSettled: void 0 !== window.widgetbar,
            }),
            (this._features = {
              favoriting:
                !this.props.readOnly && !io && u.enabled('items_favoriting'),
              multicharts: u.enabled('support_multicharts'),
              tools: !io || u.enabled('charting_library_base'),
            }),
            (this._registry = {
              chartWidgetCollection: this.props.chartWidgetCollection,
            }),
            this._negotiateResizer()
        }
        componentDidMount() {
          var e
          C.isDrawingToolbarVisible.subscribe(this._handleChangeVisibility),
            T.globalCloseDelegate.subscribe(this, this._handleGlobalClose),
            (this._tool = d.tool.spawn()),
            this._tool.subscribe(this._updateHotkeys.bind(this)),
            this._initHotkeys(),
            this.props.widgetbarSettled &&
              (this.props.widgetbarSettled.subscribe(
                this,
                this._handleWidgetbarSettled,
              ),
              v.CheckMobile.any() &&
                (null === (e = window.widgetbar) ||
                  void 0 === e ||
                  e.visible().subscribe(this._handleWidgetbarVisible)))
        }
        componentWillUnmount() {
          var e
          null === (e = window.widgetbar) ||
            void 0 === e ||
            e.visible().unsubscribe(this._handleWidgetbarVisible),
            C.isDrawingToolbarVisible.unsubscribe(this._handleChangeVisibility),
            T.globalCloseDelegate.unsubscribe(this, this._handleGlobalClose),
            this._tool.destroy(),
            this._hotkeys.destroy()
        }
        componentDidUpdate(e, t) {
          var o
          const { isVisible: n, widgetbarSettled: i } = this.state
          n !== t.isVisible &&
            (h.emit('toggle_sidebar', !n),
            c.setValue('ChartDrawingToolbarWidget.visible', n),
            this._negotiateResizer()),
            t.widgetbarSettled !== i &&
              i &&
              v.CheckMobile.any() &&
              (null === (o = window.widgetbar) ||
                void 0 === o ||
                o.visible().subscribe(this._handleWidgetbarVisible))
        }
        render() {
          const {
              bgColor: e,
              chartWidgetCollection: t,
              readOnly: o,
            } = this.props,
            { isHovered: i, isVisible: s } = this.state,
            a = { backgroundColor: e && `#${e}` }
          let c
          c = n.createElement(qt, {
            toolbarVisible: s,
            'data-name': 'toolbar-drawing-toggle-button',
          })
          const h = () =>
            !!this._features.tools &&
            !(!u.enabled('show_object_tree') || (no && !oo)) &&
            (!u.enabled('right_toolbar') ||
              (!this.state.isWidgetbarVisible && v.CheckMobile.any()) ||
              (0, p.isOnMobileAppPage)('new'))
          return n.createElement(
            eo.RegistryProvider,
            { validation: Xt, value: this._registry },
            n.createElement(
              Ht.CloseDelegateContext.Provider,
              { value: so },
              n.createElement(
                Yt.DrawerManager,
                null,
                n.createElement(
                  Qt.MatchMedia,
                  { rule: $t.DialogBreakpoints.TabletSmall },
                  (e) =>
                    n.createElement(
                      jt.Toolbar,
                      {
                        id: 'drawing-toolbar',
                        className: r(to.drawingToolbar, { [to.isHidden]: !s }),
                        style: a,
                        onClick: this.props.onClick,
                        onContextMenu: Rt.preventDefaultForContextMenu,
                        orientation: 'vertical',
                      },
                      n.createElement(
                        _.VerticalScroll,
                        {
                          onScroll: this._handleGlobalClose,
                          isVisibleFade: l.mobiletouch,
                          isVisibleButtons: !l.mobiletouch && i,
                          isVisibleScrollbar: !1,
                          onMouseOver: this._handleMouseOver,
                          onMouseOut: this._handleMouseOut,
                        },
                        n.createElement(
                          'div',
                          { className: to.inner },
                          !o &&
                            n.createElement(
                              'div',
                              { className: to.group, style: a },
                              this._filteredLineTools.map((o) =>
                                n.createElement(ct, {
                                  key: o.id,
                                  'data-name': o.id,
                                  chartWidgetCollection: t,
                                  favoriting:
                                    this._features.favoriting &&
                                    !(
                                      'linetool-group-cursors' === o.id &&
                                      (0, p.isOnMobileAppPage)('any')
                                    ),
                                  grayedTools: this._grayedTools,
                                  dropdownTooltip: o.title,
                                  lineTools: o.items,
                                  isSmallTablet: e,
                                  trackLabel: o.trackLabel,
                                }),
                              ),
                              this._toolsFilter.isToolEnabled('Font Icons') &&
                                n.createElement(Je, {
                                  'data-name': 'linetool-group-font-icons',
                                  isGrayed: this._grayedTools['Font Icons'],
                                  isSmallTablet: e,
                                }),
                            ),
                          !o &&
                            n.createElement(
                              'div',
                              { className: to.group, style: a },
                              n.createElement(Qe, {
                                toolName: 'measure',
                                onClick: this._handleMeasureClick,
                              }),
                              n.createElement(Qe, {
                                toolName: 'zoom',
                                onClick: this._handleZoomInClick,
                              }),
                              n.createElement(Xe, { chartWidgetCollection: t }),
                            ),
                          !o &&
                            n.createElement(
                              'div',
                              { className: to.group, style: a },
                              n.createElement(Wt, { isSmallTablet: e }),
                              this._features.tools &&
                                n.createElement($e, {
                                  property: d.properties().childs()
                                    .stayInDrawingMode,
                                  saveDefaultOnChange: !0,
                                  toolName: 'drawginmode',
                                  onClick: this._handleDrawingClick,
                                }),
                              this._features.tools &&
                                n.createElement($e, {
                                  property: d.lockDrawings(),
                                  toolName: 'lockAllDrawings',
                                  onClick: this._handleLockClick,
                                }),
                              this._features.tools &&
                                n.createElement(xt, { isSmallTablet: e }),
                              this._features.tools &&
                                this._features.multicharts &&
                                n.createElement(
                                  Ut,
                                  { layout: t.layout },
                                  n.createElement($e, {
                                    property: d.drawOnAllCharts(),
                                    saveDefaultOnChange: !0,
                                    toolName: 'SyncDrawing',
                                    onClick: this._handleSyncClick,
                                  }),
                                ),
                            ),
                          !o &&
                            this._features.tools &&
                            n.createElement(
                              'div',
                              { className: to.group, style: a },
                              n.createElement(bt, {
                                chartWidgetCollection: t,
                                isSmallTablet: e,
                                toolName: 'removeAllDrawingTools',
                              }),
                            ),
                          n.createElement('div', {
                            className: to.fill,
                            style: a,
                          }),
                          !o &&
                            (this._features.tools || !1) &&
                            n.createElement(
                              'div',
                              {
                                className: r(to.group, to.lastGroup),
                                style: a,
                              },
                              !1,
                              this._features.tools &&
                                this._features.favoriting &&
                                n.createElement(Mt, {
                                  id: Ot.FavoriteDrawings,
                                }),
                              h() &&
                                n.createElement(F, {
                                  id: Ot.ObjectTree,
                                  action: this._handleObjectsTreeClick,
                                  toolName: 'showObjectsTree',
                                }),
                            ),
                        ),
                      ),
                    ),
                ),
                c,
              ),
            ),
          )
        }
        _activeChartWidget() {
          return this.props.chartWidgetCollection.activeChartWidget.value()
        }
        _negotiateResizer() {
          const e = Pt.TOOLBAR_WIDTH_COLLAPSED
          this.props.resizerBridge.negotiateWidth(
            this.state.isVisible ? Pt.TOOLBAR_WIDTH_EXPANDED : e,
          )
        }
        _handleGlobalClose() {
          so.fire()
        }
        _updateHotkeys() {
          this._hotkeys.promote()
        }
        _initHotkeys() {
          ;(this._hotkeys = E.createGroup({ desc: 'Drawing Toolbar' })),
            this._hotkeys.add({
              desc: 'Reset',
              hotkey: 27,
              handler: () => this._handleEsc(),
              isDisabled: () => d.toolIsCursor(d.tool.value()),
            })
        }
      }
      function co(e, t) {
        0
      }
      class uo {
        constructor(e, t) {
          ;(this._component = null),
            (this._handleRef = (e) => {
              this._component = e
            }),
            (this._container = e),
            i.render(
              n.createElement(lo, { ...t, ref: this._handleRef }),
              this._container,
            )
        }
        destroy() {
          i.unmountComponentAtNode(this._container)
        }
        getComponent() {
          return (0, s.ensureNotNull)(this._component)
        }
      }
    },
    19139: (e, t, o) => {
      o.d(t, { VerticalScroll: () => h })
      var n = o(50959),
        i = o(497754),
        s = o.n(i),
        r = o(72571),
        a = o(350136),
        l = o(49630),
        c = o(438980),
        u = o(530261),
        d = o(661380)
      class h extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._scroll = null),
            (this._handleScrollTop = () => {
              this.animateTo(
                Math.max(
                  0,
                  this.currentPosition() - (this.state.heightWrap - 50),
                ),
              )
            }),
            (this._handleScrollBot = () => {
              this.animateTo(
                Math.min(
                  (this.state.heightContent || 0) -
                    (this.state.heightWrap || 0),
                  this.currentPosition() + (this.state.heightWrap - 50),
                ),
              )
            }),
            (this._handleResizeWrap = ([e]) => {
              this.setState({ heightWrap: e.contentRect.height })
            }),
            (this._handleResizeContent = ([e]) => {
              this.setState({ heightContent: e.contentRect.height })
            }),
            (this._handleScroll = () => {
              const { onScroll: e } = this.props
              e && e(this.currentPosition(), this.isAtTop(), this.isAtBot()),
                this._checkButtonsVisibility()
            }),
            (this._checkButtonsVisibility = () => {
              const { isVisibleTopButton: e, isVisibleBotButton: t } =
                  this.state,
                o = this.isAtTop(),
                n = this.isAtBot()
              o || e
                ? o && e && this.setState({ isVisibleTopButton: !1 })
                : this.setState({ isVisibleTopButton: !0 }),
                n || t
                  ? n && t && this.setState({ isVisibleBotButton: !1 })
                  : this.setState({ isVisibleBotButton: !0 })
            }),
            (this.state = {
              heightContent: 0,
              heightWrap: 0,
              isVisibleBotButton: !1,
              isVisibleTopButton: !1,
            })
        }
        componentDidMount() {
          this._checkButtonsVisibility()
        }
        componentDidUpdate(e, t) {
          ;(t.heightWrap === this.state.heightWrap &&
            t.heightContent === this.state.heightContent) ||
            this._handleScroll()
        }
        currentPosition() {
          return this._scroll ? this._scroll.scrollTop : 0
        }
        isAtTop() {
          return this.currentPosition() <= 1
        }
        isAtBot() {
          return (
            this.currentPosition() + this.state.heightWrap >=
            this.state.heightContent - 1
          )
        }
        animateTo(e, t = l.dur) {
          const o = this._scroll
          o &&
            (0, a.doAnimate)({
              onStep(e, t) {
                o.scrollTop = t
              },
              from: o.scrollTop,
              to: Math.round(e),
              easing: l.easingFunc.easeInOutCubic,
              duration: t,
            })
        }
        render() {
          const {
              children: e,
              isVisibleScrollbar: t,
              isVisibleFade: o,
              isVisibleButtons: i,
              onMouseOver: a,
              onMouseOut: l,
            } = this.props,
            {
              heightContent: h,
              heightWrap: m,
              isVisibleBotButton: v,
              isVisibleTopButton: p,
            } = this.state
          return n.createElement(
            c.Measure,
            { onResize: this._handleResizeWrap },
            (b) =>
              n.createElement(
                'div',
                { className: u.wrap, onMouseOver: a, onMouseOut: l, ref: b },
                n.createElement(
                  'div',
                  {
                    className: s()(u.scrollWrap, { [u.noScrollBar]: !t }),
                    onScroll: this._handleScroll,
                    ref: (e) => (this._scroll = e),
                  },
                  n.createElement(
                    c.Measure,
                    { onResize: this._handleResizeContent },
                    (t) =>
                      n.createElement(
                        'div',
                        { className: u.content, ref: t },
                        e,
                      ),
                  ),
                ),
                o &&
                  n.createElement('div', {
                    className: s()(u.fadeTop, { [u.isVisible]: p && h > m }),
                  }),
                o &&
                  n.createElement('div', {
                    className: s()(u.fadeBot, { [u.isVisible]: v && h > m }),
                  }),
                i &&
                  n.createElement(
                    'div',
                    {
                      className: s()(u.scrollTop, {
                        [u.isVisible]: p && h > m,
                      }),
                      onClick: this._handleScrollTop,
                    },
                    n.createElement(
                      'div',
                      { className: u.iconWrap },
                      n.createElement(r.Icon, { icon: d, className: u.icon }),
                    ),
                  ),
                i &&
                  n.createElement(
                    'div',
                    {
                      className: s()(u.scrollBot, {
                        [u.isVisible]: v && h > m,
                      }),
                      onClick: this._handleScrollBot,
                    },
                    n.createElement(
                      'div',
                      { className: u.iconWrap },
                      n.createElement(r.Icon, { icon: d, className: u.icon }),
                    ),
                  ),
              ),
          )
        }
      }
      h.defaultProps = { isVisibleScrollbar: !0 }
    },
    261401: (e, t, o) => {
      o.d(t, {
        RegistryProvider: () => l,
        registryContextType: () => c,
        validateRegistry: () => a,
      })
      var n = o(50959),
        i = o(719036),
        s = o.n(i)
      const r = n.createContext({})
      function a(e, t) {
        s().checkPropTypes(t, e, 'context', 'RegistryContext')
      }
      function l(e) {
        const { validation: t, value: o } = e
        return a(o, t), n.createElement(r.Provider, { value: o }, e.children)
      }
      function c() {
        return r
      }
    },
    661380: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" width="20" height="10"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M2 1l8 8 8-8"/></svg>'
    },
    751445: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.103.687a1 1 0 0 1 1.794 0l2.374 4.81 5.309.772a1 1 0 0 1 .554 1.706l-3.841 3.745.906 5.287a1 1 0 0 1-1.45 1.054L10 15.565 5.252 18.06A1 1 0 0 1 3.8 17.007l.907-5.287L.866 7.975a1 1 0 0 1 .554-1.706l5.31-.771L9.102.688zM10 1.13L7.393 6.412l-5.829.847 4.218 4.111-.996 5.806L10 14.436l5.214 2.74-.996-5.805 4.218-4.112-5.83-.847L10 1.13z"/></svg>'
    },
    151609: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.31 14.5a1.07 1.07 0 0 1 0-1.5L13 4.3c.42-.41 1.1-.41 1.52 0l.99 1c.42.42.41 1.11-.02 1.53l-5.38 5.12h12.83c.6 0 1.07.48 1.07 1.07v1.43c0 .6-.48 1.07-1.07 1.07H10.1l5.38 5.13c.44.41.45 1.1.02 1.53l-1 .99c-.41.42-1.1.42-1.5 0L4.3 14.5Zm7.97 9.38-8.67-8.67c-.81-.8-.82-2.12 0-2.93l8.68-8.67c.8-.81 2.12-.82 2.92 0l1 .99c.82.82.8 2.16-.04 2.96l-3.57 3.4h10.33c1.14 0 2.07.93 2.07 2.07v1.43c0 1.15-.93 2.07-2.07 2.07H12.6l3.57 3.4c.84.8.86 2.14.03 2.97l-.99.99c-.8.8-2.12.8-2.93 0Z"/></svg>'
    },
    922976: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M4.87 4.52a.5.5 0 0 1 .61.35L6.91 10h5.47l1.03-4.67c.14-.63 1.04-.63 1.18 0L15.62 10h5.47l1.43-5.13a.5.5 0 0 1 .96.26L22.13 10H25a.5.5 0 0 1 0 1h-3.15l-.83 3H25a.5.5 0 0 1 0 1h-4.26l-2.15 7.75c-.17.6-1.03.58-1.16-.03L15.7 15h-3.42l-1.72 7.72c-.13.6-1 .63-1.16.03L7.26 15H3a.5.5 0 1 1 0-1h3.98l-.83-3H3a.5.5 0 1 1 0-1h2.87L4.52 5.13a.5.5 0 0 1 .35-.61ZM7.19 11l.83 3h3.47l.66-3H7.2Zm5.99 0-.67 3h2.98l-.67-3h-1.64Zm1.42-1L14 7.3l-.6 2.7h1.2Zm1.25 1 .66 3h3.47l.83-3h-4.96Zm3.85 4h-2.97l1.32 5.94L19.7 15Zm-8.43 0H8.3l1.65 5.94L11.27 15Z"/></svg>'
    },
    670616: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M7.5 24v-5.5m0 0s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1v-6m-14 6v-6m0 0v-6s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1v6m-14 0s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1"/></svg>'
    },
    548748: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M14.08 3.73c.1.16.1.37 0 .54a9.4 9.4 0 0 0 3.35 13.26 9.9 9.9 0 0 0 6.49 1.18.5.5 0 0 1 .5.76 10.67 10.67 0 0 1-3.83 3.64 10.91 10.91 0 0 1-14.28-3.3A10.44 10.44 0 0 1 8.69 5.56a10.86 10.86 0 0 1 4.9-2.06.5.5 0 0 1 .49.22Zm8.3 15.61v.5c-1.91 0-3.8-.5-5.45-1.44a10.64 10.64 0 0 1-3.95-3.97 10.4 10.4 0 0 1-.3-9.72 9.6 9.6 0 0 0-6.37 5.39 9.39 9.39 0 0 0 .83 9.14 9.7 9.7 0 0 0 3.6 3.17 9.92 9.92 0 0 0 12.21-2.59c-.19.02-.38.02-.57.02v-.5Z"/></svg>'
    },
    918042: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M6 11.69C6 7.46 9.56 4 14 4c4.44 0 8 3.46 8 7.69 0 2.63-1.2 4.93-3.25 6.31H14.5v-5H18v-1h-8v1h3.5v5H9.14A8.06 8.06 0 0 1 6 11.69Zm2 6.67a9.1 9.1 0 0 1-3-6.67C5 6.87 9.05 3 14 3s9 3.87 9 8.69a8.51 8.51 0 0 1-3 6.62V22h-2v3h-8v-3H8v-3.64ZM11 22v2h6v-2h-6Zm-2-1v-2h10v2H9Z"/></svg>'
    },
    44986: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M6 14.5C6 9.78 9.78 6 14.5 6c4.72 0 8.5 3.78 8.5 8.5 0 4.72-3.78 8.5-8.5 8.5A8.46 8.46 0 0 1 6 14.5ZM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5ZM14 16V9h1v6h4v1h-5Z"/></svg>'
    },
    683778: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M6 14.5C6 9.78 9.78 6 14.5 6c4.72 0 8.5 3.78 8.5 8.5 0 4.72-3.78 8.5-8.5 8.5A8.46 8.46 0 0 1 6 14.5ZM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5ZM12 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm4 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm-6 4-.43.26v.01l.03.03a3.55 3.55 0 0 0 .3.4 5.7 5.7 0 0 0 9.22 0 5.42 5.42 0 0 0 .28-.4l.02-.03v-.01L19 17l-.43-.26v.02a2.45 2.45 0 0 1-.24.32c-.17.21-.43.5-.78.79a4.71 4.71 0 0 1-6.88-.8 4.32 4.32 0 0 1-.23-.31l-.01-.02L10 17Z"/></svg>'
    },
    90624: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 112" width="28" height="28"><path fill="#fff" d="M63.42 93.22a37.13 37.13 0 1 0 .01-74.27 37.13 37.13 0 0 0-.01 74.27Z"/><path fill="#fff" d="M45.48 48.85c-.71.04-1.96 0-3.17.2-2.36.41-4.72.85-7.03 1.51a30.65 30.65 0 0 0-4.87 2.02c-1.9.9-3.74 1.93-5.59 2.94-.66.36-.71.86-.16 1.39.53.53 1.1 1.01 1.7 1.44 2.43 1.63 4.91 3.15 7.3 4.85 2.77 1.95 5.86 3.03 8.95 4.03 3.5 1.14 7.15.85 10.72.38 4.05-.54 8.1-1.3 11.9-2.96 2.17-.95 4.21-2.22 6.27-3.44.88-.5.86-.86.08-1.5-1.59-1.28-3.16-2.6-4.82-3.78-3.73-2.66-7.65-4.85-12.05-6a29.47 29.47 0 0 0-9.23-1.08Zm6.56-21.95v8.8c0 1.1-.02 2.18-.03 3.27 0 .86.33 1.39 1.14 1.47.38.04.77.06 1.16.11 2.8.35 3.14.13 3.99-2.86.77-2.7 1.47-5.44 2.22-8.15.31-1.12.5-1.18 1.5-.79 1.98.78 3.95 1.58 5.94 2.32.77.29 1.03.6.7 1.56-.98 2.94-1.86 5.92-2.77 8.89-.09.28-.15.57-.21.86-.42 2.02-.37 2.12 1.37 2.8.25.1.5.21.74.34.51.3.91.26 1.38-.19 2.34-2.22 4.75-4.34 7.05-6.6.74-.73 1.57-.62 2.16-.04A83.06 83.06 0 0 1 82 42.52c.64.73.6 1.52-.04 2.3a273.4 273.4 0 0 1-4.69 5.62c-.46.53-.44.98-.02 1.44 1.46 1.55 2.93 3.1 4.4 4.63 1.1 1.13 2.21 2.24 3.3 3.37 1.05 1.07 1.12 1.67.06 2.77-1.44 1.5-2.86 3.08-4.51 4.23a87.09 87.09 0 0 1-10 6.28 32.38 32.38 0 0 1-12.28 3.5c-4.54.36-9.07.43-13.57-.15a59.04 59.04 0 0 1-9.69-2.07 38.4 38.4 0 0 1-8.35-3.83 51.59 51.59 0 0 1-5.8-4.13 73.78 73.78 0 0 1-6.18-5.38c-1.29-1.3-2.33-2.9-3.38-4.46-.58-.84-.06-1.55.59-2.1 1.14-.96 2.32-1.9 3.42-2.9.72-.65.95-.96 1.62-1.67.5-.53.43-1.02-.07-1.51-1.3-1.3-1.52-1.76-2.83-3.07-.6-.59-.74-1.1-.07-1.79 1.66-1.72 4.35-4.22 5.97-5.98.8-.86.9-.82 1.7.12 1.6 1.9 2.12 2.97 3.78 4.83.87.98 1.19 1.55 2.5 1.04 2.37-.95 1.76-.7 1.05-3.35-.64-2.37-1-2.96-1.72-5.3-.08-.26-.17-.5-.23-.75-.33-1.2-.3-1.33.8-1.7 2.06-.68 5.56-1.72 7.62-2.4.8-.27 1.16.18 1.39.93.73 2.55 1.01 3.38 1.77 5.92.2.72.48 1.41.84 2.05.7 1.18 1.13 1.4 2.27 1.36 1.96-.07 2.24-.3 2.24-2.45 0-3.1-.06-6.21-.14-9.32-.04-1.53-.07-1.62 1.34-1.66 2.3-.06 4.61-.02 6.96-.02"/><path fill="#2962FF" d="M63.42 90.92a34.26 34.26 0 1 0 .01-68.52 34.26 34.26 0 0 0-.01 68.52Z"/><path fill="#FF5200" d="M45.69 49.83c-.67.03-1.83 0-2.95.17-2.2.35-4.4.72-6.54 1.28-1.56.4-3.06 1.05-4.53 1.7-1.76.77-3.47 1.64-5.2 2.49-.6.3-.66.73-.15 1.17.5.45 1.03.86 1.59 1.22 2.26 1.37 4.56 2.66 6.79 4.1 2.57 1.64 5.45 2.55 8.31 3.4 3.26.96 6.65.72 9.98.32 3.76-.46 7.52-1.1 11.06-2.5 2.01-.8 3.92-1.88 5.82-2.9.82-.44.8-.74.08-1.27-1.48-1.09-2.94-2.2-4.48-3.2-3.47-2.25-7.11-4.1-11.2-5.06a30.03 30.03 0 0 0-8.59-.91v-.01Zm6.09-18.54v7.44l-.02 2.76c0 .72.3 1.17 1.05 1.24.36.03.73.05 1.08.1 2.6.29 2.92.1 3.71-2.43.72-2.28 1.37-4.59 2.07-6.88.29-.94.45-1 1.4-.66 1.84.66 3.66 1.33 5.52 1.95.7.25.95.52.64 1.32-.9 2.48-1.72 5-2.57 7.5-.08.25-.14.5-.2.74-.38 1.7-.34 1.79 1.28 2.37.23.08.47.17.7.28.47.26.84.22 1.27-.16 2.18-1.87 4.42-3.67 6.56-5.58.69-.61 1.46-.52 2-.03a73.41 73.41 0 0 1 3.37 3.24c.6.6.56 1.28-.03 1.94-1.44 1.6-2.89 3.18-4.37 4.74-.43.46-.4.83-.01 1.22a340.4 340.4 0 0 0 4.1 3.91c1 .96 2.04 1.9 3.06 2.85.97.9 1.03 1.41.05 2.34-1.34 1.26-2.66 2.6-4.2 3.57a82.59 82.59 0 0 1-9.29 5.3 32.44 32.44 0 0 1-11.42 2.97c-4.22.3-8.43.36-12.62-.13a59.71 59.71 0 0 1-9-1.75c-2.76-.77-5.3-1.91-7.77-3.24a48.2 48.2 0 0 1-5.39-3.49c-2-1.4-3.92-2.92-5.75-4.54-1.2-1.09-2.17-2.45-3.15-3.76-.53-.72-.05-1.31.55-1.78 1.06-.82 2.16-1.6 3.18-2.45.67-.55 1.27-1.17 1.9-1.77.46-.45.4-.86-.07-1.28l-3.64-3.32c-.55-.5-.68-.93-.05-1.51 1.53-1.46 3.01-2.98 4.52-4.46.74-.72.84-.7 1.58.1 1.5 1.61 2.98 3.24 4.51 4.8.82.84 1.75 1.09 2.96.65 2.21-.8 2.3-.73 1.63-2.97-.6-2-1.32-3.96-2-5.93-.07-.22-.16-.42-.21-.63-.3-1.02-.28-1.12.74-1.43 1.92-.59 3.85-1.11 5.77-1.69.75-.23 1.08.15 1.3.78.67 2.16 1.33 4.32 2.04 6.46.18.61.44 1.2.78 1.74.66 1 1.72.98 2.78.94 1.83-.06 2.09-.25 2.09-2.07 0-2.62-.06-5.25-.13-7.87-.04-1.3-.07-1.37 1.24-1.4 2.14-.06 4.29-.02 6.47-.02"/><path fill="#FDD600" d="m53.5 54.08.15-.32c-.5-.49-.91-1.15-1.5-1.44a9.83 9.83 0 0 0-6.84-.8c-1.95.5-3.23 1.92-4.14 3.57-.98 1.8-1.33 3.8-.09 5.64.54.8 1.38 1.44 2.16 2.04a6.98 6.98 0 0 0 10.61-2.68c.4-.87.27-1.18-.66-1.48-.98-.31-1.98-.59-2.96-.9-.65-.22-1.31-.44-1.31-1.3 0-.82.53-1.15 1.24-1.35 1.12-.3 2.23-.65 3.34-.97Zm-7.81-4.25c3.23-.15 5.9.29 8.58.92 4.08.96 7.73 2.8 11.21 5.06 1.54.99 3 2.1 4.48 3.2.72.53.74.82-.08 1.26-1.91 1.03-3.82 2.1-5.82 2.9-3.54 1.4-7.3 2.04-11.07 2.5-3.32.4-6.72.65-9.97-.31-2.87-.85-5.74-1.76-8.32-3.41-2.22-1.43-4.52-2.72-6.78-4.1a12 12 0 0 1-1.6-1.21c-.5-.45-.45-.86.17-1.18 1.72-.86 3.43-1.72 5.19-2.48 1.48-.65 2.97-1.3 4.52-1.7 2.16-.56 4.35-.93 6.55-1.28 1.12-.18 2.28-.14 2.94-.18"/><path fill="#1D1D1B" d="M53.5 54.08c-1.11.33-2.22.67-3.34.98-.71.19-1.24.52-1.24 1.34 0 .86.67 1.1 1.3 1.3.99.32 1.99.6 2.97.9.93.3 1.05.61.66 1.49a6.98 6.98 0 0 1-10.62 2.68 9.18 9.18 0 0 1-2.16-2.04c-1.24-1.85-.9-3.85.1-5.65.9-1.65 2.18-3.07 4.13-3.57a9.84 9.84 0 0 1 6.84.8c.6.3 1.01.95 1.5 1.44l-.15.33"/></svg>'
    },
  },
])
