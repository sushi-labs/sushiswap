;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2878],
  {
    88803: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
      }
    },
    45300: (e) => {
      e.exports = {}
    },
    10888: (e) => {
      e.exports = { 'default-drawer-min-top-distance': '100px' }
    },
    33963: (e) => {
      e.exports = {
        item: 'item-zwyEh4hn',
        label: 'label-zwyEh4hn',
        labelRow: 'labelRow-zwyEh4hn',
        toolbox: 'toolbox-zwyEh4hn',
      }
    },
    71986: (e) => {
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
    92910: (e) => {
      e.exports = {
        separator: 'separator-QjUlCDId',
        small: 'small-QjUlCDId',
        normal: 'normal-QjUlCDId',
        large: 'large-QjUlCDId',
      }
    },
    39416: (e, t, o) => {
      o.d(t, { useFunctionalRefObject: () => s })
      var n = o(50959),
        i = o(43010)
      function s(e) {
        const t = (0, n.useMemo)(
            () =>
              ((e) => {
                const t = (o) => {
                  e(o), (t.current = o)
                }
                return (t.current = null), t
              })((e) => {
                r.current(e)
              }),
            [],
          ),
          o = (0, n.useRef)(null),
          s = (t) => {
            if (null === t) return a(o.current, t), void (o.current = null)
            o.current !== e && ((o.current = e), a(o.current, t))
          },
          r = (0, n.useRef)(s)
        return (
          (r.current = s),
          (0, i.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return r.current(t.current), () => r.current(null)
          }, [e]),
          t
        )
      }
      function a(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    43010: (e, t, o) => {
      o.d(t, { useIsomorphicLayoutEffect: () => i })
      var n = o(50959)
      function i(e, t) {
        ;('undefined' == typeof window ? n.useEffect : n.useLayoutEffect)(e, t)
      }
    },
    27267: (e, t, o) => {
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
    67842: (e, t, o) => {
      o.d(t, { useResizeObserver: () => r })
      var n = o(50959),
        i = o(59255),
        s = o(43010),
        a = o(39416)
      function r(e, t = []) {
        const { callback: o, ref: r = null } = ((e) =>
            'function' == typeof e ? { callback: e } : e)(e),
          l = (0, n.useRef)(null),
          c = (0, n.useRef)(o)
        c.current = o
        const u = (0, a.useFunctionalRefObject)(r),
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
    90186: (e, t, o) => {
      function n(e) {
        return s(e, a)
      }
      function i(e) {
        return s(e, r)
      }
      function s(e, t) {
        const o = Object.entries(e).filter(t),
          n = {}
        for (const [e, t] of o) n[e] = t
        return n
      }
      function a(e) {
        const [t, o] = e
        return 0 === t.indexOf('data-') && 'string' == typeof o
      }
      function r(e) {
        return 0 === e[0].indexOf('aria-')
      }
      o.d(t, {
        filterAriaProps: () => i,
        filterDataProps: () => n,
        filterProps: () => s,
        isAriaAttribute: () => r,
        isDataAttribute: () => a,
      })
    },
    76460: (e, t, o) => {
      function n(e) {
        return 0 === e.detail
      }
      o.d(t, { isKeyboardClick: () => n })
    },
    47201: (e, t, o) => {
      function n(...e) {
        return (t) => {
          for (const o of e) void 0 !== o && o(t)
        }
      }
      o.d(t, { createSafeMulticastEventHandler: () => n })
    },
    24437: (e, t, o) => {
      o.d(t, { DialogBreakpoints: () => i })
      var n = o(88803)
      const i = {
        SmallHeight: n['small-height-breakpoint'],
        TabletSmall: n['tablet-small-breakpoint'],
        TabletNormal: n['tablet-normal-breakpoint'],
      }
    },
    45601: (e, t, o) => {
      o.d(t, { Measure: () => i })
      var n = o(67842)
      function i(e) {
        const { children: t, onResize: o } = e
        return t((0, n.useResizeObserver)(o || (() => {}), [null === o]))
      }
    },
    59369: (e, t, o) => {
      o.d(t, { useRowsNavigation: () => c })
      var n = o(50959),
        i = o(50151),
        s = o(16838),
        a = o(68335),
        r = o(71468)
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
                  if (((0, r.becomeMainElement)(n), o.length > 0))
                    for (const e of o) (0, r.becomeSecondaryElement)(e)
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
              const o = (0, a.hashFromEvent)(t)
              if (!l.includes(o)) return
              const n = document.activeElement
              if (!(n instanceof HTMLElement)) return
              const i = t.currentTarget
              let r, c
              if (e) {
                const e = n.parentElement
                ;(r = e ? Array.from(e.children) : []), (c = r.indexOf(n))
              } else
                (r = ((h = i),
                Array.from(
                  h.querySelectorAll(
                    'button:not([disabled]):not([aria-disabled])',
                  ),
                ).filter((0, s.createScopedVisibleElementFilter)(h))).sort(
                  s.navigationOrderComparator,
                )),
                  (c = r.indexOf(n))
              var h
              if (0 === r.length || -1 === c) return
              const v = (0, s.mapKeyCodeToDirection)(o)
              switch (v) {
                case 'inlinePrev':
                  if ((t.preventDefault(), !e && 0 === c)) break
                  m(u(r, c, -1))
                  break
                case 'inlineNext':
                  if ((t.preventDefault(), !e && c === r.length - 1)) break
                  m(u(r, c, 1))
                  break
                case 'blockPrev':
                case 'blockNext':
                  ;((o) => {
                    if (!document.activeElement) return
                    const n = d(i),
                      s = document.activeElement.parentElement
                    if (!s) return
                    const a = Array.from(s.children).indexOf(
                      document.activeElement,
                    )
                    if (-1 === a) return
                    const r =
                      n['blockNext' === o ? n.indexOf(s) + 1 : n.indexOf(s) - 1]
                    if (!r) return
                    t.preventDefault()
                    const l = Array.from(r.children)
                    l.length && (!e && a <= l.length - 1 ? m(l[a]) : m(l[0]))
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
          a = s + t.clientHeight
        return o >= s && n <= a
      }
      function m(e) {
        document.activeElement &&
          (0, r.becomeSecondaryElement)(document.activeElement),
          (0, r.becomeMainElement)(e),
          e.focus()
      }
    },
    76068: (e, t, o) => {
      o.d(t, { CircleLogo: () => a, hiddenCircleLogoClass: () => s })
      var n = o(50959),
        i = o(58492)
      o(45300)
      const s = 'tv-circle-logo--visually-hidden'
      function a(e) {
        var t, o
        const s = (0, i.getStyleClasses)(e.size, e.className),
          a =
            null !== (o = null !== (t = e.alt) && void 0 !== t ? t : e.title) &&
            void 0 !== o
              ? o
              : ''
        return (0, i.isCircleLogoWithUrlProps)(e)
          ? n.createElement('img', {
              className: s,
              crossOrigin: '',
              src: e.logoUrl,
              alt: a,
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
    58492: (e, t, o) => {
      o.d(t, { getStyleClasses: () => i, isCircleLogoWithUrlProps: () => s })
      var n = o(97754)
      function i(e, t) {
        return n('tv-circle-logo', `tv-circle-logo--${e}`, t)
      }
      function s(e) {
        return 'logoUrl' in e && void 0 !== e.logoUrl && 0 !== e.logoUrl.length
      }
    },
    77762: (e, t, o) => {
      o.d(t, { useEnsuredContext: () => s })
      var n = o(50959),
        i = o(50151)
      function s(e) {
        return (0, i.ensureNotNull)((0, n.useContext)(e))
      }
    },
    70412: (e, t, o) => {
      o.d(t, {
        hoverMouseEventFilter: () => s,
        useAccurateHover: () => a,
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
      function a(e) {
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
    29006: (e, t, o) => {
      o.d(t, { useResizeObserver: () => n.useResizeObserver })
      var n = o(67842)
    },
    77975: (e, t, o) => {
      o.d(t, { useWatchedValueReadonly: () => i })
      var n = o(50959)
      const i = (e, t = !1) => {
        const o = 'watchedValue' in e ? e.watchedValue : void 0,
          i = 'defaultValue' in e ? e.defaultValue : e.watchedValue.value(),
          [s, a] = (0, n.useState)(o ? o.value() : i)
        return (
          (t ? n.useLayoutEffect : n.useEffect)(() => {
            if (o) {
              a(o.value())
              const e = (e) => a(e)
              return o.subscribe(e), () => o.unsubscribe(e)
            }
            return () => {}
          }, [o]),
          s
        )
      }
    },
    16396: (e, t, o) => {
      o.d(t, { DEFAULT_POPUP_MENU_ITEM_THEME: () => c, PopupMenuItem: () => d })
      var n = o(50959),
        i = o(97754),
        s = o(51768),
        a = o(59064),
        r = o(76068),
        l = o(71986)
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
            showToolboxOnHover: k,
            showToolboxOnFocus: S,
            target: F,
            rel: A,
            toolbox: y,
            reference: M,
            onMouseOut: I,
            onMouseOver: N,
            onKeyDown: L,
            suppressToolboxClick: B = !0,
            theme: D = l,
            tabIndex: W,
            tagName: O,
            renderComponent: R,
            roundedIcon: P,
            iconAriaProps: V,
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
                    a =
                      'a' === s
                        ? i
                        : ((e) => {
                            const {
                              download: t,
                              href: o,
                              hrefLang: n,
                              media: i,
                              ping: s,
                              rel: a,
                              target: r,
                              type: l,
                              referrerPolicy: c,
                              ...u
                            } = e
                            return u
                          })(i)
                  return n.createElement(s, { ...a, ref: o })
                }
                return (t.displayName = `DefaultComponent(${e})`), t
              })(O),
            [O],
          ),
          $ = null != R ? R : Y
        return n.createElement(
          $,
          {
            ...J,
            id: t,
            role: o,
            className: i(c, D.item, g && D.withIcon, {
              [D.isActive]: C,
              [D.isDisabled]: _ || T,
              [D.hovered]: E,
            }),
            title: d,
            href: x,
            target: F,
            rel: A,
            reference: (e) => {
              ;(q.current = e), 'function' == typeof M && M(e)
              'object' == typeof M && (M.current = e)
            },
            onClick: (e) => {
              if (_) return
              Z && (0, s.trackEvent)(Z.category, Z.event, Z.label)
              z && z(U, e)
              j || (0, a.globalCloseMenu)()
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
            n.createElement(r.CircleLogo, {
              ...V,
              className: l['disclosure-item-circle-logo'],
              size: 'xxxsmall',
              logoUrl: H.logoUrl,
              placeholderLetter: H.placeholderLetter,
            }),
          g &&
            n.createElement('span', {
              'aria-label': V && V['aria-label'],
              'aria-hidden': V && Boolean(V['aria-hidden']),
              className: i(D.icon, P && l['round-icon'], f),
              dangerouslySetInnerHTML: { __html: g },
            }),
          n.createElement(
            'span',
            { className: i(D.labelRow, h) },
            n.createElement('span', { className: i(D.label, m) }, w),
          ),
          (void 0 !== p || b) &&
            n.createElement(
              'span',
              { className: D.shortcut },
              (Q = p) && Q.split('+').join(' + '),
            ),
          void 0 !== y &&
            n.createElement(
              'span',
              {
                onClick: B ? u : void 0,
                className: i(v, D.toolbox, {
                  [D.showOnHover]: k,
                  [D.showOnFocus]: S,
                }),
              },
              y,
            ),
        )
        var Q
      }
    },
    81332: (e, t, o) => {
      o.d(t, { multilineLabelWithIconAndToolboxTheme: () => a })
      var n = o(40173),
        i = o(71986),
        s = o(33963)
      const a = (0, n.mergeThemes)(i, s)
    },
    51613: (e, t, o) => {
      o.d(t, { PopupMenuSeparator: () => r })
      var n = o(50959),
        i = o(97754),
        s = o.n(i),
        a = o(92910)
      function r(e) {
        const { size: t = 'normal', className: o, ariaHidden: i = !1 } = e
        return n.createElement('div', {
          className: s()(
            a.separator,
            'small' === t && a.small,
            'normal' === t && a.normal,
            'large' === t && a.large,
            o,
          ),
          role: 'separator',
          'aria-hidden': i,
        })
      }
    },
    20520: (e, t, o) => {
      o.d(t, { PopupMenu: () => h })
      var n = o(50959),
        i = o(962),
        s = o(62942),
        a = o(42842),
        r = o(27317),
        l = o(29197)
      const c = n.createContext(void 0)
      var u = o(36383)
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
              a.Portal,
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
                  r.Menu,
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
    6132: (e, t, o) => {
      var n = o(22134)
      function i() {}
      function s() {}
      ;(s.resetWarningCache = i),
        (e.exports = () => {
          function e(e, t, o, i, s, a) {
            if (a !== n) {
              var r = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types',
              )
              throw ((r.name = 'Invariant Violation'), r)
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
    19036: (e, t, o) => {
      e.exports = o(6132)()
    },
    22134: (e) => {
      e.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
    },
    47102: (e) => {
      e.exports = {
        accessible: 'accessible-NQERJsv9',
        active: 'active-NQERJsv9',
      }
    },
    89089: (e) => {
      e.exports = { button: 'button-LkmyTVRc', active: 'active-LkmyTVRc' }
    },
    54784: (e) => {
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
    22878: (e) => {
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
    44242: (e) => {
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
    46173: (e) => {
      e.exports = { item: 'item-uxNfqe_g', label: 'label-uxNfqe_g' }
    },
    99537: (e) => {
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
    20274: (e) => {
      e.exports = { item: 'item-yfwdxbRo', hovered: 'hovered-yfwdxbRo' }
    },
    12451: (e) => {
      e.exports = {
        desktopSize: 'desktopSize-l1SzP6TV',
        smallSize: 'smallSize-l1SzP6TV',
        tabs: 'tabs-l1SzP6TV',
        categories: 'categories-l1SzP6TV',
      }
    },
    78227: (e) => {
      e.exports = { sticker: 'sticker-aZclaNCs' }
    },
    23091: (e) => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        stickerRow: 'stickerRow-KUOIljqV',
      }
    },
    62270: (e) => {
      e.exports = { wrapper: 'wrapper-FNeSdxed' }
    },
    37531: (e) => {
      e.exports = { drawer: 'drawer-PzCssz1z', menuBox: 'menuBox-PzCssz1z' }
    },
    85470: (e) => {
      e.exports = {
        toolButtonMagnet: 'toolButtonMagnet-wg76fIbD',
        toolButtonMagnet__menuItem: 'toolButtonMagnet__menuItem-wg76fIbD',
        toolButtonMagnet__hintPlaceholder:
          'toolButtonMagnet__hintPlaceholder-wg76fIbD',
      }
    },
    90949: (e) => {
      e.exports = { sectionTitle: 'sectionTitle-Srvnqigs' }
    },
    30261: (e) => {
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
    55619: (e) => {
      e.exports = { iconContainer: 'iconContainer-dmpvVypS' }
    },
    81351: (e, t, o) => {
      o.d(t, { AccessibleMenuItem: () => d })
      var n = o(50959),
        i = o(97754),
        s = o.n(i),
        a = o(3343),
        r = o(50238),
        l = o(16838),
        c = o(16396),
        u = o(47102)
      function d(e) {
        const { className: t, ...o } = e,
          [i, d] = (0, r.useRovingTabindexElement)(null)
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
            const t = (0, a.hashFromEvent)(e)
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
    12165: (e, t, o) => {
      o.d(t, { MenuFavoriteButton: () => u })
      var n = o(50959),
        i = o(97754),
        s = o.n(i),
        a = o(50238),
        r = o(16838),
        l = o(36189),
        c = o(89089)
      function u(e) {
        const { tooltip: t, onClick: o, ...i } = e,
          [u, d] = (0, a.useRovingTabindexElement)(null)
        return r.PLATFORM_ACCESSIBILITY_ENABLED
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
    66427: (e, t, o) => {
      o.d(t, { ToolButton: () => r })
      var n = o(50959),
        i = o(97754),
        s = o(9745),
        a = o(54784)
      const r = (0, n.forwardRef)((e, t) => {
        const {
            id: o,
            activeClass: r,
            children: l,
            className: c,
            icon: u,
            isActive: d,
            isGrayed: h,
            isHidden: m,
            isTransparent: v,
            theme: p = a,
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
              d && r,
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
    82962: (e, t, o) => {
      o.d(t, { ToolWidgetMenuSummary: () => a })
      var n = o(50959),
        i = o(97754),
        s = o(44242)
      function a(e) {
        return n.createElement(
          'div',
          { className: i(e.className, s.title) },
          e.children,
        )
      }
    },
    75038: (e, t, o) => {
      o.r(t), o.d(t, { DrawingToolbarRenderer: () => go })
      var n = o(50959),
        i = o(962),
        s = o(50151),
        a = o(97754),
        r = o.n(a),
        l = o(32563),
        c = o(56840),
        u = o(14483),
        d = o(88348),
        h = o(76422),
        m = o(57898),
        v = o(49483),
        p = o(84015),
        b = o(78036)
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
      var f = o(80982),
        C = o(14873),
        _ = o(9745),
        E = o(88275),
        T = o(61345),
        w = o(45601),
        x = o(30261),
        k = o(61380)
      class S extends n.PureComponent {
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
        animateTo(e, t = T.dur) {
          const o = this._scroll
          o &&
            (0, E.doAnimate)({
              onStep(e, t) {
                o.scrollTop = t
              },
              from: o.scrollTop,
              to: Math.round(e),
              easing: T.easingFunc.easeInOutCubic,
              duration: t,
            })
        }
        render() {
          const {
              children: e,
              isVisibleScrollbar: t,
              isVisibleFade: o,
              isVisibleButtons: i,
              onMouseOver: s,
              onMouseOut: a,
            } = this.props,
            {
              heightContent: l,
              heightWrap: c,
              isVisibleBotButton: u,
              isVisibleTopButton: d,
            } = this.state
          return n.createElement(
            w.Measure,
            { onResize: this._handleResizeWrap },
            (h) =>
              n.createElement(
                'div',
                { className: x.wrap, onMouseOver: s, onMouseOut: a, ref: h },
                n.createElement(
                  'div',
                  {
                    className: r()(x.scrollWrap, { [x.noScrollBar]: !t }),
                    onScroll: this._handleScroll,
                    ref: (e) => (this._scroll = e),
                  },
                  n.createElement(
                    w.Measure,
                    { onResize: this._handleResizeContent },
                    (t) =>
                      n.createElement(
                        'div',
                        { className: x.content, ref: t },
                        e,
                      ),
                  ),
                ),
                o &&
                  n.createElement('div', {
                    className: r()(x.fadeTop, { [x.isVisible]: d && l > c }),
                  }),
                o &&
                  n.createElement('div', {
                    className: r()(x.fadeBot, { [x.isVisible]: u && l > c }),
                  }),
                i &&
                  n.createElement(
                    'div',
                    {
                      className: r()(x.scrollTop, {
                        [x.isVisible]: d && l > c,
                      }),
                      onClick: this._handleScrollTop,
                    },
                    n.createElement(
                      'div',
                      { className: x.iconWrap },
                      n.createElement(_.Icon, { icon: k, className: x.icon }),
                    ),
                  ),
                i &&
                  n.createElement(
                    'div',
                    {
                      className: r()(x.scrollBot, {
                        [x.isVisible]: u && l > c,
                      }),
                      onClick: this._handleScrollBot,
                    },
                    n.createElement(
                      'div',
                      { className: x.iconWrap },
                      n.createElement(_.Icon, { icon: k, className: x.icon }),
                    ),
                  ),
              ),
          )
        }
      }
      S.defaultProps = { isVisibleScrollbar: !0 }
      var F = o(4741),
        A = o(59064),
        y = o(66427),
        M = o(16838),
        I = o(50238)
      function N(e) {
        const [t, o] = (0, I.useRovingTabindexElement)(null)
        return n.createElement(y.ToolButton, {
          ...e,
          ref: t,
          tag: M.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
          tabIndex: o,
        })
      }
      function L(e) {
        const {
          id: t,
          action: o,
          isActive: i,
          isHidden: s,
          isTransparent: a,
          toolName: r,
        } = e
        return n.createElement(N, {
          id: t,
          icon: b.lineToolsInfo[r].icon,
          isActive: i,
          isHidden: s,
          isTransparent: a,
          onClick: o,
          tooltip: b.lineToolsInfo[r].localizedName,
          'data-name': r,
        })
      }
      var B = o(11542),
        D = o(90186)
      const W = (e) => {
        const [t, o] = (0, n.useState)(e.value())
        return (
          (0, n.useEffect)(() => {
            const t = (e) => o(e)
            return e.subscribe(t), () => e.unsubscribe(t)
          }, [e]),
          [t, (t) => e.setValue(t)]
        )
      }
      var O,
        R = o(97145)
      !((e) => {
        ;(e.Icons = 'icons'), (e.Emojis = 'emojis'), (e.Stickers = 'stickers')
      })(O || (O = {}))
      const P = c.getValue('ToolButtonIcons.LastCategory', O.Emojis),
        V = new R.WatchedValue(P)
      function H() {
        const [e, t] = W(V)
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
      var j = o(99616),
        z = o(62270)
      function U(e) {
        return n.createElement('div', { className: z.wrapper }, e.text)
      }
      var Z = o(87872),
        K = o(51609),
        G = o(22976),
        J = o(70616),
        q = o(18042),
        Y = o(44986),
        $ = o(83778),
        Q = o(48748)
      const X = [
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
        ee = [
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
        te = [
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
        oe = [
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
        ne = ['0xF06C', '0xF185', '0xF186', '0xF188', '0xF0E7'],
        ie = [
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
        se = [...X, ...ee, ...te, ...oe, ...ne, ...ie].map((e) => +e),
        ae = new Set(se)
      const re = [
          {
            title: B.t(null, { context: 'emoji_group' }, o(15426)),
            emojis: [],
            content: n.createElement(j.IconItem, { icon: Y }),
          },
          {
            title: B.t(null, { context: 'emoji_group' }, o(33628)),
            emojis: X,
            content: n.createElement(j.IconItem, { icon: $ }),
          },
          {
            title: B.t(null, { context: 'emoji_group' }, o(77011)),
            emojis: oe,
            content: n.createElement(j.IconItem, { icon: J }),
          },
          {
            title: B.t(null, { context: 'emoji_group' }, o(11739)),
            emojis: ne,
            content: n.createElement(j.IconItem, { icon: Q }),
          },
          {
            title: B.t(null, { context: 'emoji_group' }, o(14281)),
            emojis: ee,
            content: n.createElement(j.IconItem, { icon: G }),
          },
          {
            title: B.t(null, { context: 'emoji_group' }, o(72302)),
            emojis: ie,
            content: n.createElement(j.IconItem, { icon: q }),
          },
          {
            title: B.t(null, { context: 'emoji_group' }, o(57792)),
            emojis: te,
            content: n.createElement(j.IconItem, { icon: K }),
          },
        ],
        le = {
          [O.Icons]: Z.drawingToolsIcons.heart,
          [O.Emojis]: Z.drawingToolsIcons.smile,
          [O.Stickers]: Z.drawingToolsIcons.sticker,
        },
        ce = [
          {
            title: O.Emojis,
            content: n.createElement(U, { text: B.t(null, void 0, o(19570)) }),
          },
          {
            title: O.Stickers,
            content: n.createElement(U, { text: B.t(null, void 0, o(84121)) }),
          },
          {
            title: O.Icons,
            content: n.createElement(U, { text: B.t(null, void 0, o(92464)) }),
          },
        ]
      var ue = o(3343),
        de = o(20520),
        he = o(27317),
        me = o(76460),
        ve = o(41590),
        pe = o(40173),
        be = o(81261),
        ge = o(14665)
      const fe = o(22878),
        Ce = (0, n.forwardRef)((e, t) => {
          const {
              buttonActiveClass: o,
              buttonClass: i,
              buttonIcon: s,
              buttonTitle: r,
              buttonHotKey: c,
              dropdownTooltip: u,
              children: d,
              isActive: h,
              isGrayed: m,
              onClickWhenGrayed: v,
              checkable: p,
              isSmallTablet: b,
              theme: g = fe,
              onClickButton: f,
              onArrowClick: C,
              openDropdownByClick: E,
              onMenuFocus: T = be.handleAccessibleMenuFocus,
              onMenuKeyDown: w = be.handleAccessibleMenuKeyDown,
              ...x
            } = e,
            k = (0, pe.mergeThemes)(he.DEFAULT_MENU_THEME, {
              menuBox: g.menuBox,
            }),
            S = M.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
            [F, A] = (0, n.useState)(!1),
            [N, L] = (0, n.useState)(!1),
            B = (0, n.useRef)(null),
            D = (0, n.useRef)(null),
            W = (0, n.useRef)(null),
            O = (0, n.useRef)(0),
            R = (0, n.useRef)(0),
            [P, V] = (0, I.useRovingTabindexElement)(null),
            [H, j] = (0, I.useRovingTabindexElement)(null)
          return (
            (0, n.useImperativeHandle)(t, () => ({ open: () => A(!0) }), []),
            n.createElement(
              'div',
              {
                ...x,
                className: a(g.dropdown, {
                  [g.isGrayed]: m,
                  [g.isActive]: h,
                  [g.isOpened]: F,
                }),
                onClick: m ? v : void 0,
                onKeyDown: (e) => {
                  var t
                  if (
                    e.defaultPrevented ||
                    !(e.target instanceof Node) ||
                    !M.PLATFORM_ACCESSIBILITY_ENABLED
                  )
                    return
                  const o = (0, ue.hashFromEvent)(e)
                  if (e.currentTarget.contains(e.target) || 27 !== o) return
                  e.preventDefault(),
                    z(!1),
                    N &&
                      (null === (t = null == H ? void 0 : H.current) ||
                        void 0 === t ||
                        t.focus())
                },
                ref: B,
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
                            ? { onTouchStart: K, onTouchEnd: J, onTouchMove: G }
                            : { onClick: Z }
                          : { onMouseDown: K, onMouseUp: q }
                      return {}
                    })(),
                    className: a(
                      g.buttonWrap,
                      M.PLATFORM_ACCESSIBILITY_ENABLED && g.accessible,
                    ),
                  },
                  n.createElement(y.ToolButton, {
                    activeClass: o,
                    className: a(i, g.button),
                    icon: s,
                    isActive: h,
                    isGrayed: m,
                    isTransparent: !p,
                    ref: P,
                    tag: S,
                    tabIndex: V,
                    onClick: (e) => {
                      if (!(0, me.isKeyboardClick)(e)) return
                      E ? z(!0, !0) : null == f || f()
                    },
                    tooltip: r,
                    buttonHotKey: c,
                    'data-tooltip-delay': 1500,
                    tooltipPosition: 'vertical',
                  }),
                ),
                !m &&
                  !l.mobiletouch &&
                  n.createElement(
                    S,
                    {
                      className: a(
                        g.arrow,
                        u && 'apply-common-tooltip common-tooltip-vertical',
                        M.PLATFORM_ACCESSIBILITY_ENABLED && g.accessible,
                      ),
                      onClick: (e) => {
                        null == C || C(), z(void 0, (0, me.isKeyboardClick)(e))
                      },
                      onKeyDown: (e) => {
                        if (
                          e.defaultPrevented ||
                          !(e.target instanceof Node) ||
                          !M.PLATFORM_ACCESSIBILITY_ENABLED
                        )
                          return
                        const t = (0, ue.hashFromEvent)(e)
                        if (e.currentTarget.contains(e.target))
                          switch (t) {
                            case 39:
                              if (F) return
                              e.preventDefault(), z(!0, !0)
                              break
                            case 27:
                              if (!F) return
                              e.preventDefault(), z(!1)
                          }
                      },
                      type: M.PLATFORM_ACCESSIBILITY_ENABLED
                        ? 'button'
                        : void 0,
                      'data-role': M.PLATFORM_ACCESSIBILITY_ENABLED
                        ? void 0
                        : 'menu-handle',
                      ref: H,
                      tabIndex: j,
                      'aria-pressed': M.PLATFORM_ACCESSIBILITY_ENABLED
                        ? h
                        : void 0,
                      'aria-label': M.PLATFORM_ACCESSIBILITY_ENABLED
                        ? u
                        : void 0,
                      'data-tooltip': u,
                    },
                    n.createElement(_.Icon, {
                      className: g.arrowIcon,
                      icon: ge,
                    }),
                  ),
              ),
              !m &&
                (b
                  ? F &&
                    n.createElement(
                      ve.Drawer,
                      { className: g.drawer, onClose: U, position: 'Bottom' },
                      d,
                    )
                  : n.createElement(
                      de.PopupMenu,
                      {
                        theme: k,
                        doNotCloseOn: () => {
                          if (null === B.current) return []
                          return [B.current]
                        },
                        isOpened: F,
                        onClose: U,
                        position: () => {
                          if (!D || !D.current) return { x: 0, y: 0 }
                          const e = D.current.getBoundingClientRect()
                          return { x: e.left + e.width + 1, y: e.top - 6 }
                        },
                        onKeyDown: w,
                        onFocus: (e) => T(e, H),
                        controller: W,
                        onOpen: () => {
                          var e
                          if (!M.PLATFORM_ACCESSIBILITY_ENABLED) return
                          null === (e = W.current) || void 0 === e || e.focus()
                        },
                        tabIndex: M.PLATFORM_ACCESSIBILITY_ENABLED
                          ? -1
                          : void 0,
                      },
                      d,
                    )),
            )
          )
          function z(e, t = !1) {
            const o = void 0 !== e ? e : !F
            A(o), L(!!o && t)
          }
          function U() {
            z(!1)
          }
          function Z() {
            f && f(), z()
          }
          function K() {
            if (l.mobiletouch && !p) !R.current && f && f()
            else {
              if (O.current)
                return clearTimeout(O.current), (O.current = 0), void z(!0)
              O.current = setTimeout(() => {
                ;(O.current = 0), !R.current && f && f()
              }, 175)
            }
            R.current = setTimeout(() => {
              ;(R.current = 0), z(!0)
            }, 300)
          }
          function G() {
            clearTimeout(R.current),
              (R.current = 0),
              clearTimeout(O.current),
              (O.current = 0)
          }
          function J(e) {
            e.cancelable && e.preventDefault(), q()
          }
          function q() {
            R.current &&
              (clearTimeout(R.current),
              (R.current = 0),
              F
                ? z(!1)
                : p || F || l.mobiletouch || (!h && !E)
                  ? !O.current && f && f()
                  : z(!0))
          }
        })
      var _e = o(38297),
        Ee = o(85034),
        Te = o(68456),
        we = o(21097)
      class xe extends Te.CommonJsonStoreService {
        constructor(e, t, o, n, i = 18) {
          super(we.TVXWindowEvents, c, e, t, []),
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
      const ke = new xe(
        'RECENT_ICONS_CHANGED',
        'linetoolicon.recenticons',
        (e) => e.filter((e) => ae.has(e)),
        'iconTool',
      )
      var Se = o(55619)
      function Fe(e) {
        const { fallback: t, ...o } = e
        return n.createElement(
          n.Suspense,
          { fallback: null != t ? t : null },
          n.createElement(Ae, { ...o }),
        )
      }
      const Ae = n.lazy(async () => {
        const { getSvgContentForCharCode: e } = await o
          .e(7987)
          .then(o.bind(o, 1383))
        return {
          default: (t) => {
            var o
            const { charCode: i } = t,
              s = null !== (o = e(i)) && void 0 !== o ? o : void 0
            return n.createElement(_.Icon, {
              icon: s,
              className: Se.iconContainer,
            })
          },
        }
      })
      var ye = o(20274)
      var Me = o(173)
      const Ie = new xe(
          'RECENT_EMOJIS_CHANGED',
          'linetoolemoji.recents',
          Me.removeUnavailableEmoji,
          'emojiTool',
        ),
        Ne = [
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
      var Le = o(37603),
        Be = o(90624)
      const De = new Set(Ne)
      const We = [
          {
            title: B.t(null, { context: 'emoji_group' }, o(15426)),
            emojis: [],
            content: n.createElement(j.IconItem, { icon: Le }),
          },
          {
            title: 'TradingView',
            emojis: Ne,
            content: n.createElement(j.IconItem, { icon: Be }),
          },
        ],
        Oe = new xe(
          'RECENT_STICKERS_CHANGED',
          'linetoolsticker.recents',
          (e) => e.filter((e) => De.has(e)),
          'stickerTool',
          3,
        )
      var Re = o(77762),
        Pe = o(47291),
        Ve = o(78227)
      var He = o(26601),
        je = o(23091)
      const ze = {
        [O.Icons]: {
          service: ke,
          toolName: 'LineToolIcon',
          ItemComponent: (e) => {
            const { emoji: t, className: o } = e
            return n.createElement(
              'div',
              { className: r()(ye.item, o) },
              n.createElement(Fe, { charCode: Number(t) }),
            )
          },
          icons: re,
          onEmojiSelect: (e) => {
            d.iconTool.setValue(Number(e)), d.tool.setValue('LineToolIcon')
          },
        },
        [O.Emojis]: {
          service: Ie,
          toolName: 'LineToolEmoji',
          icons: Me.emojiGroups,
          onEmojiSelect: (e) => {
            d.emojiTool.setValue(e), d.tool.setValue('LineToolEmoji')
          },
        },
        [O.Stickers]: {
          service: Oe,
          toolName: 'LineToolSticker',
          ItemComponent: (e) => {
            const { emoji: t } = e,
              { size: i } = (0, Re.useEnsuredContext)(
                Pe.EmojiListContentContext,
              ),
              [s, a] = (0, n.useState)()
            return (
              (0, n.useEffect)(() => {
                o.e(5598)
                  .then(o.bind(o, 31235))
                  .then(({ getSvgContentForSticker: e }) => {
                    const o = e(t)
                    o && a(o)
                  })
              }, []),
              n.createElement(_.Icon, {
                className: Ve.sticker,
                icon: null !== s ? s : void 0,
                style: { width: `${i}px`, height: `${i}px` },
              })
            )
          },
          RowComponent: (e) =>
            n.createElement(He.EmojisRow, { ...e, className: je.stickerRow }),
          icons: We,
          onEmojiSelect: (e) => {
            d.stickerTool.setValue(e), d.tool.setValue('LineToolSticker')
          },
          getEmojiSize: (e) => (e ? 78 : 112),
        },
      }
      var Ue = o(12451)
      function Ze(e) {
        const {
            isSmallTablet: t,
            maxHeight: o,
            activeTab: i,
            setActiveTab: s,
          } = e,
          r = ze[i],
          {
            service: l,
            ItemComponent: c,
            RowComponent: u,
            onEmojiSelect: d,
            getEmojiSize: h,
          } = r,
          m = h && h(t),
          [v, p] = (0, n.useState)(Ke(r))
        return (
          (0, n.useLayoutEffect)(() => {
            const e = {},
              t = () => {
                const e = Ke(r)
                p(e)
              }
            return (
              t(),
              l.getOnChange().subscribe(e, t),
              () => {
                l.getOnChange().unsubscribeAll(e)
              }
            )
          }, [r]),
          n.createElement(
            'div',
            { style: { maxHeight: o } },
            n.createElement(_e.EmojiList, {
              className: a(Ue.desktopSize, t && Ue.smallSize),
              emojis: v,
              onSelect: (e) => {
                d(e), (0, A.globalCloseMenu)()
              },
              ItemComponent: c,
              RowComponent: u,
              height: o,
              category: i,
              emojiSize: m,
            }),
            n.createElement(Ee.GroupTabs, {
              className: Ue.tabs,
              tabClassName: Ue.categories,
              tabs: ce,
              activeTab: i,
              onTabClick: (e) => {
                s(e)
              },
            }),
          )
        )
      }
      function Ke(e) {
        const { icons: t, service: o } = e,
          n = [...t],
          i = o.get()
        return (
          (n[0].emojis = i.map((e) => String(e))),
          n.filter((e) => e.emojis.length)
        )
      }
      var Ge = o(68335),
        Je = o(10888),
        qe = o(37531)
      const Ye = {
          icon: B.t(null, void 0, o(26579)),
          dropdownTooltip: B.t(null, void 0, o(92464)),
        },
        $e = (0, pe.mergeThemes)(fe, {
          menuBox: qe.menuBox,
          drawer: qe.drawer,
        }),
        Qe = Number.parseInt(Je['default-drawer-min-top-distance'])
      function Xe(e) {
        const { isGrayed: t, isSmallTablet: o } = e,
          i = (0, D.filterDataProps)(e),
          [s, a] = H(),
          [r] = W(d.tool),
          { toolName: l } = ze[s]
        return n.createElement(
          Ce,
          {
            theme: $e,
            buttonIcon: le[s],
            buttonTitle: Ye.icon,
            dropdownTooltip: Ye.dropdownTooltip,
            isActive: r === l,
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
            onMenuFocus: et,
            onMenuKeyDown: (e) => {
              if (!M.PLATFORM_ACCESSIBILITY_ENABLED) return
              if (e.defaultPrevented) return
              const t = (0, Ge.hashFromEvent)(e)
              ;(9 !== t && t !== Ge.Modifiers.Shift + 9) ||
                (0, M.updateTabIndexes)()
            },
            ...i,
          },
          n.createElement(Ze, {
            isSmallTablet: o,
            maxHeight: o ? Math.min(679, window.innerHeight - Qe) : 679,
            activeTab: s,
            setActiveTab: a,
          }),
        )
        function c(e) {
          0
        }
      }
      function et(e) {
        if (!e.target || !M.PLATFORM_ACCESSIBILITY_ENABLED) return
        const t = e.currentTarget
        e.target === t &&
          ((0, M.updateTabIndexes)(),
          setTimeout(() => {
            if (document.activeElement !== t) return
            const [e] = (0, M.queryTabbableElements)(t).sort(
              M.navigationOrderComparator,
            )
            e && e.focus()
          }))
      }
      var tt = o(46100)
      class ot extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._handleClick = () => {
              this.props.saveDefaultOnChange &&
                (0, tt.saveDefaultProperties)(!0)
              const e = !this.props.property.value()
              this.props.property.setValue(e),
                this.props.saveDefaultOnChange &&
                  (0, tt.saveDefaultProperties)(!1),
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
          return n.createElement(N, {
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
      class nt extends n.PureComponent {
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
          return n.createElement(N, {
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
      class it extends n.PureComponent {
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
            ? n.createElement(L, {
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
      var st = o(51613),
        at = o(71810),
        rt = o(82962),
        lt = o(12165),
        ct = o(81351),
        ut = o(81332),
        dt = o(92249),
        ht = o(90949)
      function mt(e) {
        return 'name' in e
      }
      class vt extends n.PureComponent {
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
                ? at.LinetoolsFavoritesStore.removeFavorite(e)
                : at.LinetoolsFavoritesStore.addFavorite(e)
            }),
            (this._onAddFavorite = (e) => {
              this.setState({ favState: { ...this.state.favState, [e]: !0 } })
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
            at.LinetoolsFavoritesStore.favoriteAdded.subscribe(
              null,
              this._onAddFavorite,
            ),
            at.LinetoolsFavoritesStore.favoriteRemoved.subscribe(
              null,
              this._onRemoveFavorite,
            ),
            at.LinetoolsFavoritesStore.favoritesSynced.subscribe(
              null,
              this._onSyncFavorites,
            )
        }
        componentWillUnmount() {
          d.tool.unsubscribe(this._onChangeDrawingState),
            at.LinetoolsFavoritesStore.favoriteAdded.unsubscribe(
              null,
              this._onAddFavorite,
            ),
            at.LinetoolsFavoritesStore.favoriteRemoved.unsubscribe(
              null,
              this._onRemoveFavorite,
            ),
            at.LinetoolsFavoritesStore.favoritesSynced.unsubscribe(
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
              lineTools: a,
              dropdownTooltip: r,
              isSmallTablet: l,
            } = this.props,
            c = this._showShortcuts(),
            u = b.lineToolsInfo[e],
            d = (0, D.filterDataProps)(this.props)
          return n.createElement(
            'span',
            null,
            n.createElement(
              Ce,
              {
                buttonIcon: u.icon,
                buttonTitle: u.localizedName,
                buttonHotKey: u.hotKey,
                dropdownTooltip: r,
                isActive: o,
                onClickButton: this._handleClickButton,
                onArrowClick: this._handleArrowClick,
                isSmallTablet: l,
                ...d,
              },
              a.map((a, r) => {
                var u, d
                if ('title' in a)
                  return n.createElement(
                    n.Fragment,
                    { key: a.title },
                    r > 0 ? n.createElement(st.PopupMenuSeparator, null) : null,
                    n.createElement(
                      rt.ToolWidgetMenuSummary,
                      { className: ht.sectionTitle },
                      a.title,
                    ),
                  )
                const { name: h } = a,
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
                return n.createElement(ct.AccessibleMenuItem, {
                  key: h,
                  'data-name': h,
                  theme: l ? ut.multilineLabelWithIconAndToolboxTheme : void 0,
                  dontClosePopup: p,
                  forceShowShortcuts: c,
                  shortcut: !l && m ? (0, Ge.humanReadableHash)(m) : void 0,
                  icon: v.icon,
                  isActive: o && e === h,
                  appearAsDisabled: p,
                  label: v.localizedName,
                  showToolboxOnFocus: M.PLATFORM_ACCESSIBILITY_ENABLED,
                  onClick: p ? this._handleGrayedClick : this._handleClickItem,
                  onClickArg: h,
                  showToolboxOnHover: !t[h],
                  toolbox:
                    i && !p
                      ? n.createElement(lt.MenuFavoriteButton, {
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
          return null === (e = o.find((e) => mt(e) && !t[e.name])) ||
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
              (e) => mt(e) && e.name === d.tool.value(),
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
              mt(t) &&
                (e[t.name] = at.LinetoolsFavoritesStore.isFavorite(t.name))
            }),
            e
          )
        }
      }
      var pt = o(51768),
        bt = o(16396),
        gt = o(46173)
      const ft = (0, pe.mergeThemes)(bt.DEFAULT_POPUP_MENU_ITEM_THEME, gt)
      var Ct = o(28853)
      const _t = !1
      class Et extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._handleRemoveToolClick = () => {
              l.mobiletouch || this._handleRemoveDrawings(), wt()
            }),
            (this._handleRemoveDrawings = () => {
              Tt('remove drawing'),
                this.props.chartWidgetCollection.activeChartWidget
                  .value()
                  .removeAllDrawingTools()
            }),
            (this._handleRemoveStudies = () => {
              Tt('remove indicator'),
                this.props.chartWidgetCollection.activeChartWidget
                  .value()
                  .removeAllStudies()
            }),
            (this._handleRemoveAll = () => {
              Tt('remove all'),
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
                  .filter(dt.isLineTool)
                  .filter((e) => e.isActualSymbol() && e.isUserDeletable()),
                o = e
                  .filter(Ct.isStudy)
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
          const e = this.props.isSmallTablet ? ft : void 0,
            { numOfDrawings: t, numOfIndicators: i } = this.state,
            s = B.t(
              null,
              {
                plural: '{amount} drawings',
                count: t,
                replace: { amount: t.toString() },
              },
              o(93030),
            ),
            a = B.t(
              null,
              {
                plural: '{amount} indicators',
                count: i,
                replace: { amount: i.toString() },
              },
              o(80437),
            ),
            r = B.t(null, { replace: { drawings: s } }, o(30513)),
            l = B.t(null, { replace: { indicators: a } }, o(55084)),
            c = B.t(null, { replace: { drawings: s, indicators: a } }, o(10049))
          return n.createElement(
            Ce,
            {
              buttonIcon: b.lineToolsInfo[this.props.toolName].icon,
              buttonTitle: r,
              onClickButton: this._handleRemoveToolClick,
              isSmallTablet: this.props.isSmallTablet,
              'data-name': this.props.toolName,
              onArrowClick: this._handleArrowClick,
              openDropdownByClick: _t,
            },
            n.createElement(ct.AccessibleMenuItem, {
              'data-name': 'remove-drawing-tools',
              label: r,
              onClick: this._handleRemoveDrawings,
              theme: e,
            }),
            n.createElement(ct.AccessibleMenuItem, {
              'data-name': 'remove-studies',
              label: l,
              onClick: this._handleRemoveStudies,
              theme: e,
            }),
            n.createElement(ct.AccessibleMenuItem, {
              'data-name': 'remove-all',
              label: c,
              onClick: this._handleRemoveAll,
              theme: e,
            }),
          )
        }
        _handleArrowClick() {
          wt('menu')
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
      function Tt(e) {
        ;(0, pt.trackEvent)('GUI', 'Chart Left Toolbar', e)
      }
      function wt(e) {
        0
      }
      var xt = o(90995),
        kt = o(14881)
      const St = n.createContext({ hideMode: 'drawings', isActive: !1 })
      function Ft(e) {
        const {
            hideMode: t,
            option: { label: o, dataName: i, getBoxedValue: s },
            isSmallTablet: a,
            onClick: r,
          } = e,
          { hideMode: l, isActive: c } = (0, n.useContext)(St),
          u = null == s ? void 0 : s()
        return 'all' === t || u
          ? n.createElement(ct.AccessibleMenuItem, {
              label: o,
              isActive: l === t && c,
              onClick: () => {
                r(t, (0, xt.toggleHideMode)(t))
              },
              'data-name': i,
              theme: a ? ft : void 0,
            })
          : n.createElement(n.Fragment, null)
      }
      const At = {
        drawings: {
          active: Z.drawingToolsIcons.hideAllDrawingToolsActive,
          inactive: Z.drawingToolsIcons.hideAllDrawingTools,
        },
        indicators: {
          active: Z.drawingToolsIcons.hideAllIndicatorsActive,
          inactive: Z.drawingToolsIcons.hideAllIndicators,
        },
        positions: {
          active: Z.drawingToolsIcons.hideAllPositionsToolsActive,
          inactive: Z.drawingToolsIcons.hideAllPositionsTools,
        },
        all: {
          active: Z.drawingToolsIcons.hideAllDrawingsActive,
          inactive: Z.drawingToolsIcons.hideAllDrawings,
        },
      }
      function yt(e) {
        const { isSmallTablet: t } = e,
          [{ isActive: o, hideMode: i }, a] = (0, n.useState)(() => ({
            isActive: !1,
            hideMode: (0, xt.getSavedHideMode)(),
          }))
        ;(0, n.useEffect)(
          () => (
            kt.hideStateChange.subscribe(null, a),
            () => {
              kt.hideStateChange.unsubscribe(null, a)
            }
          ),
          [],
        )
        const r = b.lineToolsInfo.hideAllDrawings,
          {
            trackLabel: l,
            tooltip: c,
            dataName: u,
          } = (0, s.ensureDefined)((0, xt.getHideOptions)().get(i)),
          d = At[i][o ? 'active' : 'inactive'],
          h = o ? c.active : c.inactive
        return n.createElement(
          Ce,
          {
            buttonIcon: d,
            buttonTitle: h,
            buttonHotKey: r.hotKey,
            onClickButton: () => {
              ;(0, xt.toggleHideMode)(i), Mt(l, !o), It(o ? 'on' : 'off')
            },
            isSmallTablet: t,
            isActive: o,
            checkable: !0,
            'data-name': 'hide-all',
            'data-type': u,
            onArrowClick: () => {
              It('menu')
            },
          },
          n.createElement(
            St.Provider,
            { value: { isActive: o, hideMode: i } },
            Array.from((0, xt.getHideOptions)()).map(([e, o]) =>
              n.createElement(Ft, {
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
          Mt(
            (0, s.ensureDefined)((0, xt.getHideOptions)().get(e)).trackLabel,
            t,
          )
        }
      }
      function Mt(e, t) {
        ;(0, pt.trackEvent)(
          'GUI',
          'Chart Left Toolbar',
          `${e} ${t ? 'on' : 'off'}`,
        )
      }
      function It(e) {
        0
      }
      var Nt = o(241),
        Lt = o(51445)
      const Bt = B.t(null, void 0, o(49616))
      class Dt extends n.PureComponent {
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
            (0, Nt.getFavoriteDrawingToolbarPromise)(),
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
            ? n.createElement(N, {
                id: this.props.id,
                icon: Lt,
                isActive: this._instance.isVisible(),
                onClick: this._handleClick,
                tooltip: Bt,
              })
            : null
        }
        _trackClick(e) {
          0
        }
      }
      var Wt = o(77975),
        Ot = o(36147),
        Rt = o(18540),
        Pt = o(85470)
      const Vt = {
        [Ot.MagnetMode.WeakMagnet]: {
          id: Ot.MagnetMode.WeakMagnet,
          name: 'weakMagnet',
          icon: Z.drawingToolsIcons.magnet,
          localizedName: B.t(null, void 0, o(45265)),
        },
        [Ot.MagnetMode.StrongMagnet]: {
          id: Ot.MagnetMode.StrongMagnet,
          name: 'strongMagnet',
          icon: Z.drawingToolsIcons.strongMagnet,
          localizedName: B.t(null, void 0, o(85422)),
        },
      }
      function Ht(e) {
        const { isSmallTablet: t } = e,
          o = (0, Wt.useWatchedValueReadonly)({
            watchedValue: (0, Rt.magnetEnabled)(),
          }),
          i = (0, Wt.useWatchedValueReadonly)({
            watchedValue: (0, Rt.magnetMode)(),
          })
        return n.createElement(
          'div',
          { className: Pt.toolButtonMagnet },
          n.createElement(
            Ce,
            {
              'data-name': 'magnet-button',
              buttonIcon: Vt[i].icon,
              buttonTitle: b.lineToolsInfo.magnet.localizedName,
              isActive: o,
              onClickButton: () => {
                const e = !o
                ;(0, pt.trackEvent)(
                  'GUI',
                  'Chart Left Toolbar',
                  'magnet mode ' + (e ? 'on' : 'off'),
                ),
                  !1
                ;(0, Rt.setIsMagnetEnabled)(e)
              },
              buttonHotKey: b.lineToolsInfo.magnet.hotKey,
              checkable: !0,
              isSmallTablet: t,
              onArrowClick: () => {
                0
              },
            },
            Object.values(Vt).map(
              ({ id: e, name: a, localizedName: r, icon: l }) =>
                n.createElement(ct.AccessibleMenuItem, {
                  key: e,
                  className: t ? Pt.toolButtonMagnet__menuItem : void 0,
                  'data-name': a,
                  icon: l,
                  isActive: o && i === e,
                  label: r,
                  onClick: s,
                  onClickArg: e,
                }),
            ),
          ),
          !1,
        )
        function s(e) {
          void 0 !== e &&
            ((0, pt.trackEvent)(
              'GUI',
              'Magnet mode',
              e === Ot.MagnetMode.WeakMagnet ? 'Weak' : 'Strong',
            ),
            (0, Rt.setMagnetMode)(e))
        }
      }
      var jt
      !((e) => {
        ;(e.Screenshot = 'drawing-toolbar-screenshot'),
          (e.FavoriteDrawings = 'drawing-toolbar-favorite-drawings'),
          (e.ObjectTree = 'drawing-toolbar-object-tree')
      })(jt || (jt = {}))
      var zt = o(70412),
        Ut = o(21861),
        Zt = o(9438),
        Kt = o(29197),
        Gt = o(54079),
        Jt = o(27334)
      const qt = Jt,
        Yt = 'http://www.w3.org/2000/svg'
      function $t(e) {
        const { direction: t, theme: o = Jt } = e
        return n.createElement(
          'svg',
          {
            xmlns: Yt,
            width: '9',
            height: '27',
            viewBox: '0 0 9 27',
            className: a(o.container, 'right' === t ? o.mirror : null),
            onContextMenu: Ut.preventDefault,
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
      var Qt = o(22231)
      const Xt = (0, pe.mergeThemes)(qt, Qt),
        eo = {
          hide: B.t(null, void 0, o(96411)),
          show: B.t(null, void 0, o(63354)),
        }
      class to extends n.PureComponent {
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
              className: a(
                Xt.toggleButton,
                'apply-common-tooltip common-tooltip-vertical',
                !e && Xt.collapsed,
              ),
              onClick: this._toggleVisibility,
              title: e ? eo.hide : eo.show,
              'data-name': t,
              'data-value': e ? 'visible' : 'collapsed',
            },
            n.createElement($t, {
              direction: e ? 'left' : 'right',
              theme: e ? void 0 : Xt,
            }),
          )
        }
      }
      var oo = o(37558),
        no = o(24437),
        io = o(90692)
      const so = { chartWidgetCollection: o(19036).any.isRequired }
      var ao = o(95366),
        ro = o(99537)
      const lo = u.enabled('right_toolbar'),
        co = u.enabled('keep_object_tree_widget_in_right_toolbar'),
        uo = (0, v.onWidget)(),
        ho = new m.Delegate(),
        mo = pt.trackEvent.bind(null, 'GUI', 'Chart Left Toolbar'),
        vo = (e, t) => mo(`${e} ${t ? 'on' : 'off'}`)
      class po extends n.PureComponent {
        constructor(e) {
          var t
          super(e),
            (this._grayedTools = {}),
            (this._handleMeasureClick = () => {
              bo('measure')
            }),
            (this._handleZoomInClick = () => {
              bo('zoom in')
            }),
            (this._handleDrawingClick = (e) => {
              vo('drawing mode', e), bo('drawing mode', e ? 'on' : 'off')
            }),
            (this._handleLockClick = (e) => {
              vo('lock all drawing', e), bo('lock', e ? 'on' : 'off')
            }),
            (this._handleSyncClick = (e) => {
              vo('sync', e), bo('sync', e ? 'on' : 'off')
            }),
            (this._handleObjectsTreeClick = () => {
              this._activeChartWidget().showObjectsTreeDialog(),
                bo('object tree')
            }),
            (this._handleMouseOver = (e) => {
              ;(0, zt.hoverMouseEventFilter)(e) &&
                this.setState({ isHovered: !0 })
            }),
            (this._handleMouseOut = (e) => {
              ;(0, zt.hoverMouseEventFilter)(e) &&
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
                a = []
              return (
                (0, f.isLineToolsGroupWithSections)(t)
                  ? t.sections.forEach((e) => {
                      const t = e.items.filter(s)
                      t.length && a.push({ title: e.title }, ...t)
                    })
                  : a.push(...t.items.filter(s)),
                a.length &&
                  e.push({ id: o, title: n, trackLabel: i, items: a }),
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
                !this.props.readOnly && !uo && u.enabled('items_favoriting'),
              multicharts: u.enabled('support_multicharts'),
              tools: !uo || u.enabled('charting_library_base'),
            }),
            (this._registry = {
              chartWidgetCollection: this.props.chartWidgetCollection,
            }),
            this._negotiateResizer()
        }
        componentDidMount() {
          var e
          C.isDrawingToolbarVisible.subscribe(this._handleChangeVisibility),
            A.globalCloseDelegate.subscribe(this, this._handleGlobalClose),
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
            A.globalCloseDelegate.unsubscribe(this, this._handleGlobalClose),
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
            r = { backgroundColor: e && `#${e}` }
          let c
          c = n.createElement(to, {
            toolbarVisible: s,
            'data-name': 'toolbar-drawing-toggle-button',
          })
          const h = () =>
            !!this._features.tools &&
            !(!u.enabled('show_object_tree') || (co && !lo))
          return n.createElement(
            ao.RegistryProvider,
            { validation: so, value: this._registry },
            n.createElement(
              Kt.CloseDelegateContext.Provider,
              { value: ho },
              n.createElement(
                oo.DrawerManager,
                null,
                n.createElement(
                  io.MatchMedia,
                  { rule: no.DialogBreakpoints.TabletSmall },
                  (e) =>
                    n.createElement(
                      Gt.Toolbar,
                      {
                        id: 'drawing-toolbar',
                        className: a(ro.drawingToolbar, { [ro.isHidden]: !s }),
                        style: r,
                        onClick: this.props.onClick,
                        onContextMenu: Ut.preventDefaultForContextMenu,
                        orientation: 'vertical',
                      },
                      n.createElement(
                        S,
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
                          { className: ro.inner },
                          !o &&
                            n.createElement(
                              'div',
                              { className: ro.group, style: r },
                              this._filteredLineTools.map((o) =>
                                n.createElement(vt, {
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
                                n.createElement(Xe, {
                                  'data-name': 'linetool-group-font-icons',
                                  isGrayed: this._grayedTools['Font Icons'],
                                  isSmallTablet: e,
                                }),
                            ),
                          !o &&
                            n.createElement(
                              'div',
                              { className: ro.group, style: r },
                              n.createElement(nt, {
                                toolName: 'measure',
                                onClick: this._handleMeasureClick,
                              }),
                              n.createElement(nt, {
                                toolName: 'zoom',
                                onClick: this._handleZoomInClick,
                              }),
                              n.createElement(it, { chartWidgetCollection: t }),
                            ),
                          !o &&
                            n.createElement(
                              'div',
                              { className: ro.group, style: r },
                              n.createElement(Ht, { isSmallTablet: e }),
                              this._features.tools &&
                                n.createElement(ot, {
                                  property: d.properties().childs()
                                    .stayInDrawingMode,
                                  saveDefaultOnChange: !0,
                                  toolName: 'drawginmode',
                                  onClick: this._handleDrawingClick,
                                }),
                              this._features.tools &&
                                n.createElement(ot, {
                                  property: d.lockDrawings(),
                                  toolName: 'lockAllDrawings',
                                  onClick: this._handleLockClick,
                                }),
                              this._features.tools &&
                                n.createElement(yt, { isSmallTablet: e }),
                              !1,
                            ),
                          !o &&
                            this._features.tools &&
                            n.createElement(
                              'div',
                              { className: ro.group, style: r },
                              n.createElement(Et, {
                                chartWidgetCollection: t,
                                isSmallTablet: e,
                                toolName: 'removeAllDrawingTools',
                              }),
                            ),
                          n.createElement('div', {
                            className: ro.fill,
                            style: r,
                          }),
                          !o &&
                            (this._features.tools || !1) &&
                            n.createElement(
                              'div',
                              {
                                className: a(ro.group, ro.lastGroup),
                                style: r,
                              },
                              !1,
                              this._features.tools &&
                                this._features.favoriting &&
                                n.createElement(Dt, {
                                  id: jt.FavoriteDrawings,
                                }),
                              h() &&
                                n.createElement(L, {
                                  id: jt.ObjectTree,
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
          const e = Zt.TOOLBAR_WIDTH_COLLAPSED
          this.props.resizerBridge.negotiateWidth(
            this.state.isVisible ? Zt.TOOLBAR_WIDTH_EXPANDED : e,
          )
        }
        _handleGlobalClose() {
          ho.fire()
        }
        _updateHotkeys() {
          this._hotkeys.promote()
        }
        _initHotkeys() {
          ;(this._hotkeys = F.createGroup({ desc: 'Drawing Toolbar' })),
            this._hotkeys.add({
              desc: 'Reset',
              hotkey: 27,
              handler: () => this._handleEsc(),
              isDisabled: () => d.toolIsCursor(d.tool.value()),
            })
        }
      }
      function bo(e, t) {
        0
      }
      class go {
        constructor(e, t) {
          ;(this._component = null),
            (this._handleRef = (e) => {
              this._component = e
            }),
            (this._container = e),
            i.render(
              n.createElement(po, { ...t, ref: this._handleRef }),
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
    95366: (e, t, o) => {
      o.d(t, {
        RegistryProvider: () => l,
        registryContextType: () => c,
        validateRegistry: () => r,
      })
      var n = o(50959),
        i = o(19036),
        s = o.n(i)
      const a = n.createContext({})
      function r(e, t) {
        s().checkPropTypes(t, e, 'context', 'RegistryContext')
      }
      function l(e) {
        const { validation: t, value: o } = e
        return r(o, t), n.createElement(a.Provider, { value: o }, e.children)
      }
      function c() {
        return a
      }
    },
    61380: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" width="20" height="10"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M2 1l8 8 8-8"/></svg>'
    },
    51445: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.103.687a1 1 0 0 1 1.794 0l2.374 4.81 5.309.772a1 1 0 0 1 .554 1.706l-3.841 3.745.906 5.287a1 1 0 0 1-1.45 1.054L10 15.565 5.252 18.06A1 1 0 0 1 3.8 17.007l.907-5.287L.866 7.975a1 1 0 0 1 .554-1.706l5.31-.771L9.102.688zM10 1.13L7.393 6.412l-5.829.847 4.218 4.111-.996 5.806L10 14.436l5.214 2.74-.996-5.805 4.218-4.112-5.83-.847L10 1.13z"/></svg>'
    },
    51609: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.31 14.5a1.07 1.07 0 0 1 0-1.5L13 4.3c.42-.41 1.1-.41 1.52 0l.99 1c.42.42.41 1.11-.02 1.53l-5.38 5.12h12.83c.6 0 1.07.48 1.07 1.07v1.43c0 .6-.48 1.07-1.07 1.07H10.1l5.38 5.13c.44.41.45 1.1.02 1.53l-1 .99c-.41.42-1.1.42-1.5 0L4.3 14.5Zm7.97 9.38-8.67-8.67c-.81-.8-.82-2.12 0-2.93l8.68-8.67c.8-.81 2.12-.82 2.92 0l1 .99c.82.82.8 2.16-.04 2.96l-3.57 3.4h10.33c1.14 0 2.07.93 2.07 2.07v1.43c0 1.15-.93 2.07-2.07 2.07H12.6l3.57 3.4c.84.8.86 2.14.03 2.97l-.99.99c-.8.8-2.12.8-2.93 0Z"/></svg>'
    },
    22976: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M4.87 4.52a.5.5 0 0 1 .61.35L6.91 10h5.47l1.03-4.67c.14-.63 1.04-.63 1.18 0L15.62 10h5.47l1.43-5.13a.5.5 0 0 1 .96.26L22.13 10H25a.5.5 0 0 1 0 1h-3.15l-.83 3H25a.5.5 0 0 1 0 1h-4.26l-2.15 7.75c-.17.6-1.03.58-1.16-.03L15.7 15h-3.42l-1.72 7.72c-.13.6-1 .63-1.16.03L7.26 15H3a.5.5 0 1 1 0-1h3.98l-.83-3H3a.5.5 0 1 1 0-1h2.87L4.52 5.13a.5.5 0 0 1 .35-.61ZM7.19 11l.83 3h3.47l.66-3H7.2Zm5.99 0-.67 3h2.98l-.67-3h-1.64Zm1.42-1L14 7.3l-.6 2.7h1.2Zm1.25 1 .66 3h3.47l.83-3h-4.96Zm3.85 4h-2.97l1.32 5.94L19.7 15Zm-8.43 0H8.3l1.65 5.94L11.27 15Z"/></svg>'
    },
    70616: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M7.5 24v-5.5m0 0s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1v-6m-14 6v-6m0 0v-6s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1v6m-14 0s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1"/></svg>'
    },
    48748: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M14.08 3.73c.1.16.1.37 0 .54a9.4 9.4 0 0 0 3.35 13.26 9.9 9.9 0 0 0 6.49 1.18.5.5 0 0 1 .5.76 10.67 10.67 0 0 1-3.83 3.64 10.91 10.91 0 0 1-14.28-3.3A10.44 10.44 0 0 1 8.69 5.56a10.86 10.86 0 0 1 4.9-2.06.5.5 0 0 1 .49.22Zm8.3 15.61v.5c-1.91 0-3.8-.5-5.45-1.44a10.64 10.64 0 0 1-3.95-3.97 10.4 10.4 0 0 1-.3-9.72 9.6 9.6 0 0 0-6.37 5.39 9.39 9.39 0 0 0 .83 9.14 9.7 9.7 0 0 0 3.6 3.17 9.92 9.92 0 0 0 12.21-2.59c-.19.02-.38.02-.57.02v-.5Z"/></svg>'
    },
    18042: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M6 11.69C6 7.46 9.56 4 14 4c4.44 0 8 3.46 8 7.69 0 2.63-1.2 4.93-3.25 6.31H14.5v-5H18v-1h-8v1h3.5v5H9.14A8.06 8.06 0 0 1 6 11.69Zm2 6.67a9.1 9.1 0 0 1-3-6.67C5 6.87 9.05 3 14 3s9 3.87 9 8.69a8.51 8.51 0 0 1-3 6.62V22h-2v3h-8v-3H8v-3.64ZM11 22v2h6v-2h-6Zm-2-1v-2h10v2H9Z"/></svg>'
    },
    44986: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M6 14.5C6 9.78 9.78 6 14.5 6c4.72 0 8.5 3.78 8.5 8.5 0 4.72-3.78 8.5-8.5 8.5A8.46 8.46 0 0 1 6 14.5ZM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5ZM14 16V9h1v6h4v1h-5Z"/></svg>'
    },
    83778: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M6 14.5C6 9.78 9.78 6 14.5 6c4.72 0 8.5 3.78 8.5 8.5 0 4.72-3.78 8.5-8.5 8.5A8.46 8.46 0 0 1 6 14.5ZM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5ZM12 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm4 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm-6 4-.43.26v.01l.03.03a3.55 3.55 0 0 0 .3.4 5.7 5.7 0 0 0 9.22 0 5.42 5.42 0 0 0 .28-.4l.02-.03v-.01L19 17l-.43-.26v.02a2.45 2.45 0 0 1-.24.32c-.17.21-.43.5-.78.79a4.71 4.71 0 0 1-6.88-.8 4.32 4.32 0 0 1-.23-.31l-.01-.02L10 17Z"/></svg>'
    },
    90624: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 112" width="28" height="28"><path fill="#fff" d="M63.42 93.22a37.13 37.13 0 1 0 .01-74.27 37.13 37.13 0 0 0-.01 74.27Z"/><path fill="#fff" d="M45.48 48.85c-.71.04-1.96 0-3.17.2-2.36.41-4.72.85-7.03 1.51a30.65 30.65 0 0 0-4.87 2.02c-1.9.9-3.74 1.93-5.59 2.94-.66.36-.71.86-.16 1.39.53.53 1.1 1.01 1.7 1.44 2.43 1.63 4.91 3.15 7.3 4.85 2.77 1.95 5.86 3.03 8.95 4.03 3.5 1.14 7.15.85 10.72.38 4.05-.54 8.1-1.3 11.9-2.96 2.17-.95 4.21-2.22 6.27-3.44.88-.5.86-.86.08-1.5-1.59-1.28-3.16-2.6-4.82-3.78-3.73-2.66-7.65-4.85-12.05-6a29.47 29.47 0 0 0-9.23-1.08Zm6.56-21.95v8.8c0 1.1-.02 2.18-.03 3.27 0 .86.33 1.39 1.14 1.47.38.04.77.06 1.16.11 2.8.35 3.14.13 3.99-2.86.77-2.7 1.47-5.44 2.22-8.15.31-1.12.5-1.18 1.5-.79 1.98.78 3.95 1.58 5.94 2.32.77.29 1.03.6.7 1.56-.98 2.94-1.86 5.92-2.77 8.89-.09.28-.15.57-.21.86-.42 2.02-.37 2.12 1.37 2.8.25.1.5.21.74.34.51.3.91.26 1.38-.19 2.34-2.22 4.75-4.34 7.05-6.6.74-.73 1.57-.62 2.16-.04A83.06 83.06 0 0 1 82 42.52c.64.73.6 1.52-.04 2.3a273.4 273.4 0 0 1-4.69 5.62c-.46.53-.44.98-.02 1.44 1.46 1.55 2.93 3.1 4.4 4.63 1.1 1.13 2.21 2.24 3.3 3.37 1.05 1.07 1.12 1.67.06 2.77-1.44 1.5-2.86 3.08-4.51 4.23a87.09 87.09 0 0 1-10 6.28 32.38 32.38 0 0 1-12.28 3.5c-4.54.36-9.07.43-13.57-.15a59.04 59.04 0 0 1-9.69-2.07 38.4 38.4 0 0 1-8.35-3.83 51.59 51.59 0 0 1-5.8-4.13 73.78 73.78 0 0 1-6.18-5.38c-1.29-1.3-2.33-2.9-3.38-4.46-.58-.84-.06-1.55.59-2.1 1.14-.96 2.32-1.9 3.42-2.9.72-.65.95-.96 1.62-1.67.5-.53.43-1.02-.07-1.51-1.3-1.3-1.52-1.76-2.83-3.07-.6-.59-.74-1.1-.07-1.79 1.66-1.72 4.35-4.22 5.97-5.98.8-.86.9-.82 1.7.12 1.6 1.9 2.12 2.97 3.78 4.83.87.98 1.19 1.55 2.5 1.04 2.37-.95 1.76-.7 1.05-3.35-.64-2.37-1-2.96-1.72-5.3-.08-.26-.17-.5-.23-.75-.33-1.2-.3-1.33.8-1.7 2.06-.68 5.56-1.72 7.62-2.4.8-.27 1.16.18 1.39.93.73 2.55 1.01 3.38 1.77 5.92.2.72.48 1.41.84 2.05.7 1.18 1.13 1.4 2.27 1.36 1.96-.07 2.24-.3 2.24-2.45 0-3.1-.06-6.21-.14-9.32-.04-1.53-.07-1.62 1.34-1.66 2.3-.06 4.61-.02 6.96-.02"/><path fill="#2962FF" d="M63.42 90.92a34.26 34.26 0 1 0 .01-68.52 34.26 34.26 0 0 0-.01 68.52Z"/><path fill="#FF5200" d="M45.69 49.83c-.67.03-1.83 0-2.95.17-2.2.35-4.4.72-6.54 1.28-1.56.4-3.06 1.05-4.53 1.7-1.76.77-3.47 1.64-5.2 2.49-.6.3-.66.73-.15 1.17.5.45 1.03.86 1.59 1.22 2.26 1.37 4.56 2.66 6.79 4.1 2.57 1.64 5.45 2.55 8.31 3.4 3.26.96 6.65.72 9.98.32 3.76-.46 7.52-1.1 11.06-2.5 2.01-.8 3.92-1.88 5.82-2.9.82-.44.8-.74.08-1.27-1.48-1.09-2.94-2.2-4.48-3.2-3.47-2.25-7.11-4.1-11.2-5.06a30.03 30.03 0 0 0-8.59-.91v-.01Zm6.09-18.54v7.44l-.02 2.76c0 .72.3 1.17 1.05 1.24.36.03.73.05 1.08.1 2.6.29 2.92.1 3.71-2.43.72-2.28 1.37-4.59 2.07-6.88.29-.94.45-1 1.4-.66 1.84.66 3.66 1.33 5.52 1.95.7.25.95.52.64 1.32-.9 2.48-1.72 5-2.57 7.5-.08.25-.14.5-.2.74-.38 1.7-.34 1.79 1.28 2.37.23.08.47.17.7.28.47.26.84.22 1.27-.16 2.18-1.87 4.42-3.67 6.56-5.58.69-.61 1.46-.52 2-.03a73.41 73.41 0 0 1 3.37 3.24c.6.6.56 1.28-.03 1.94-1.44 1.6-2.89 3.18-4.37 4.74-.43.46-.4.83-.01 1.22a340.4 340.4 0 0 0 4.1 3.91c1 .96 2.04 1.9 3.06 2.85.97.9 1.03 1.41.05 2.34-1.34 1.26-2.66 2.6-4.2 3.57a82.59 82.59 0 0 1-9.29 5.3 32.44 32.44 0 0 1-11.42 2.97c-4.22.3-8.43.36-12.62-.13a59.71 59.71 0 0 1-9-1.75c-2.76-.77-5.3-1.91-7.77-3.24a48.2 48.2 0 0 1-5.39-3.49c-2-1.4-3.92-2.92-5.75-4.54-1.2-1.09-2.17-2.45-3.15-3.76-.53-.72-.05-1.31.55-1.78 1.06-.82 2.16-1.6 3.18-2.45.67-.55 1.27-1.17 1.9-1.77.46-.45.4-.86-.07-1.28l-3.64-3.32c-.55-.5-.68-.93-.05-1.51 1.53-1.46 3.01-2.98 4.52-4.46.74-.72.84-.7 1.58.1 1.5 1.61 2.98 3.24 4.51 4.8.82.84 1.75 1.09 2.96.65 2.21-.8 2.3-.73 1.63-2.97-.6-2-1.32-3.96-2-5.93-.07-.22-.16-.42-.21-.63-.3-1.02-.28-1.12.74-1.43 1.92-.59 3.85-1.11 5.77-1.69.75-.23 1.08.15 1.3.78.67 2.16 1.33 4.32 2.04 6.46.18.61.44 1.2.78 1.74.66 1 1.72.98 2.78.94 1.83-.06 2.09-.25 2.09-2.07 0-2.62-.06-5.25-.13-7.87-.04-1.3-.07-1.37 1.24-1.4 2.14-.06 4.29-.02 6.47-.02"/><path fill="#FDD600" d="m53.5 54.08.15-.32c-.5-.49-.91-1.15-1.5-1.44a9.83 9.83 0 0 0-6.84-.8c-1.95.5-3.23 1.92-4.14 3.57-.98 1.8-1.33 3.8-.09 5.64.54.8 1.38 1.44 2.16 2.04a6.98 6.98 0 0 0 10.61-2.68c.4-.87.27-1.18-.66-1.48-.98-.31-1.98-.59-2.96-.9-.65-.22-1.31-.44-1.31-1.3 0-.82.53-1.15 1.24-1.35 1.12-.3 2.23-.65 3.34-.97Zm-7.81-4.25c3.23-.15 5.9.29 8.58.92 4.08.96 7.73 2.8 11.21 5.06 1.54.99 3 2.1 4.48 3.2.72.53.74.82-.08 1.26-1.91 1.03-3.82 2.1-5.82 2.9-3.54 1.4-7.3 2.04-11.07 2.5-3.32.4-6.72.65-9.97-.31-2.87-.85-5.74-1.76-8.32-3.41-2.22-1.43-4.52-2.72-6.78-4.1a12 12 0 0 1-1.6-1.21c-.5-.45-.45-.86.17-1.18 1.72-.86 3.43-1.72 5.19-2.48 1.48-.65 2.97-1.3 4.52-1.7 2.16-.56 4.35-.93 6.55-1.28 1.12-.18 2.28-.14 2.94-.18"/><path fill="#1D1D1B" d="M53.5 54.08c-1.11.33-2.22.67-3.34.98-.71.19-1.24.52-1.24 1.34 0 .86.67 1.1 1.3 1.3.99.32 1.99.6 2.97.9.93.3 1.05.61.66 1.49a6.98 6.98 0 0 1-10.62 2.68 9.18 9.18 0 0 1-2.16-2.04c-1.24-1.85-.9-3.85.1-5.65.9-1.65 2.18-3.07 4.13-3.57a9.84 9.84 0 0 1 6.84.8c.6.3 1.01.95 1.5 1.44l-.15.33"/></svg>'
    },
  },
])
