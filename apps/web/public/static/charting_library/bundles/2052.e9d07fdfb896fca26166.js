;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2052],
  {
    45300: (e) => {
      e.exports = {}
    },
    66076: (e) => {
      e.exports = {
        'default-drawer-min-top-distance': '100px',
        wrap: 'wrap-_HnK0UIN',
        positionBottom: 'positionBottom-_HnK0UIN',
        backdrop: 'backdrop-_HnK0UIN',
        drawer: 'drawer-_HnK0UIN',
        positionLeft: 'positionLeft-_HnK0UIN',
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
    34587: (e) => {
      e.exports = { icon: 'icon-WB2y0EnP', dropped: 'dropped-WB2y0EnP' }
    },
    39416: (e, t, o) => {
      o.d(t, { useFunctionalRefObject: () => i })
      var n = o(50959),
        r = o(43010)
      function i(e) {
        const t = (0, n.useMemo)(
            () =>
              ((e) => {
                const t = (o) => {
                  e(o), (t.current = o)
                }
                return (t.current = null), t
              })((e) => {
                s.current(e)
              }),
            [],
          ),
          o = (0, n.useRef)(null),
          i = (t) => {
            if (null === t) return a(o.current, t), void (o.current = null)
            o.current !== e && ((o.current = e), a(o.current, t))
          },
          s = (0, n.useRef)(i)
        return (
          (s.current = i),
          (0, r.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return s.current(t.current), () => s.current(null)
          }, [e]),
          t
        )
      }
      function a(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    43010: (e, t, o) => {
      o.d(t, { useIsomorphicLayoutEffect: () => r })
      var n = o(50959)
      function r(e, t) {
        ;('undefined' == typeof window ? n.useEffect : n.useLayoutEffect)(e, t)
      }
    },
    27267: (e, t, o) => {
      function n(e, t, o, n, r) {
        function i(r) {
          if (e > r.timeStamp) return
          const i = r.target
          void 0 !== o &&
            null !== t &&
            null !== i &&
            i.ownerDocument === n &&
            (t.contains(i) || o(r))
        }
        return (
          r.click && n.addEventListener('click', i, !1),
          r.mouseDown && n.addEventListener('mousedown', i, !1),
          r.touchEnd && n.addEventListener('touchend', i, !1),
          r.touchStart && n.addEventListener('touchstart', i, !1),
          () => {
            n.removeEventListener('click', i, !1),
              n.removeEventListener('mousedown', i, !1),
              n.removeEventListener('touchend', i, !1),
              n.removeEventListener('touchstart', i, !1)
          }
        )
      }
      o.d(t, { addOutsideEventListener: () => n })
    },
    90186: (e, t, o) => {
      function n(e) {
        return i(e, a)
      }
      function r(e) {
        return i(e, s)
      }
      function i(e, t) {
        const o = Object.entries(e).filter(t),
          n = {}
        for (const [e, t] of o) n[e] = t
        return n
      }
      function a(e) {
        const [t, o] = e
        return 0 === t.indexOf('data-') && 'string' == typeof o
      }
      function s(e) {
        return 0 === e[0].indexOf('aria-')
      }
      o.d(t, {
        filterAriaProps: () => r,
        filterDataProps: () => n,
        filterProps: () => i,
        isAriaAttribute: () => s,
        isDataAttribute: () => a,
      })
    },
    76460: (e, t, o) => {
      function n(e) {
        return 0 === e.detail
      }
      o.d(t, { isKeyboardClick: () => n })
    },
    50238: (e, t, o) => {
      o.d(t, { useRovingTabindexElement: () => a })
      var n = o(50959),
        r = o(39416),
        i = o(16838)
      function a(e, t = []) {
        const [o, a] = (0, n.useState)(!1),
          s = (0, r.useFunctionalRefObject)(e)
        return (
          (0, n.useLayoutEffect)(() => {
            if (!i.PLATFORM_ACCESSIBILITY_ENABLED) return
            const e = s.current
            if (null === e) return
            const t = (e) => {
              switch (e.type) {
                case 'roving-tabindex:main-element':
                  a(!0)
                  break
                case 'roving-tabindex:secondary-element':
                  a(!1)
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
          [s, i.PLATFORM_ACCESSIBILITY_ENABLED ? (o ? 0 : -1) : void 0]
        )
      }
    },
    76068: (e, t, o) => {
      o.d(t, { CircleLogo: () => a, hiddenCircleLogoClass: () => i })
      var n = o(50959),
        r = o(58492)
      o(45300)
      const i = 'tv-circle-logo--visually-hidden'
      function a(e) {
        var t, o
        const i = (0, r.getStyleClasses)(e.size, e.className),
          a =
            null !== (o = null !== (t = e.alt) && void 0 !== t ? t : e.title) &&
            void 0 !== o
              ? o
              : ''
        return (0, r.isCircleLogoWithUrlProps)(e)
          ? n.createElement('img', {
              className: i,
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
                className: i,
                title: e.title,
                'aria-label': e['aria-label'],
                'aria-hidden': e['aria-hidden'],
              },
              e.placeholderLetter,
            )
      }
    },
    58492: (e, t, o) => {
      o.d(t, { getStyleClasses: () => r, isCircleLogoWithUrlProps: () => i })
      var n = o(97754)
      function r(e, t) {
        return n('tv-circle-logo', `tv-circle-logo--${e}`, t)
      }
      function i(e) {
        return 'logoUrl' in e && void 0 !== e.logoUrl && 0 !== e.logoUrl.length
      }
    },
    37558: (e, t, o) => {
      o.d(t, { DrawerContext: () => a, DrawerManager: () => i })
      var n = o(50959),
        r = o(99054)
      class i extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._isBodyFixed = !1),
            (this._addDrawer = (e) => {
              this.setState((t) => ({ stack: [...t.stack, e] }))
            }),
            (this._removeDrawer = (e) => {
              this.setState((t) => ({ stack: t.stack.filter((t) => t !== e) }))
            }),
            (this.state = { stack: [] })
        }
        componentDidUpdate(e, t) {
          !t.stack.length &&
            this.state.stack.length &&
            ((0, r.setFixedBodyState)(!0), (this._isBodyFixed = !0)),
            t.stack.length &&
              !this.state.stack.length &&
              this._isBodyFixed &&
              ((0, r.setFixedBodyState)(!1), (this._isBodyFixed = !1))
        }
        componentWillUnmount() {
          this.state.stack.length &&
            this._isBodyFixed &&
            (0, r.setFixedBodyState)(!1)
        }
        render() {
          return n.createElement(
            a.Provider,
            {
              value: {
                addDrawer: this._addDrawer,
                removeDrawer: this._removeDrawer,
                currentDrawer: this.state.stack.length
                  ? this.state.stack[this.state.stack.length - 1]
                  : null,
              },
            },
            this.props.children,
          )
        }
      }
      const a = n.createContext(null)
    },
    41590: (e, t, o) => {
      o.d(t, { Drawer: () => h })
      var n = o(50959),
        r = o(50151),
        i = o(97754),
        a = o(36174),
        s = o(42842),
        l = o(37558),
        c = o(29197),
        d = o(86656),
        u = o(66076)
      function h(e) {
        const {
            position: t = 'Bottom',
            onClose: o,
            children: d,
            className: h,
            theme: m = u,
          } = e,
          f = (0, r.ensureNotNull)((0, n.useContext)(l.DrawerContext)),
          [v] = (0, n.useState)(() => (0, a.randomHash)()),
          g = (0, n.useRef)(null),
          b = (0, n.useContext)(c.CloseDelegateContext)
        return (
          (0, n.useLayoutEffect)(
            () => (
              (0, r.ensureNotNull)(g.current).focus({ preventScroll: !0 }),
              b.subscribe(f, o),
              f.addDrawer(v),
              () => {
                f.removeDrawer(v), b.unsubscribe(f, o)
              }
            ),
            [],
          ),
          n.createElement(
            s.Portal,
            null,
            n.createElement(
              'div',
              { className: i(u.wrap, u[`position${t}`]) },
              v === f.currentDrawer &&
                n.createElement('div', { className: u.backdrop, onClick: o }),
              n.createElement(
                p,
                {
                  className: i(m.drawer, u[`position${t}`], h),
                  ref: g,
                  'data-name': e['data-name'],
                },
                d,
              ),
            ),
          )
        )
      }
      const p = (0, n.forwardRef)((e, t) => {
        const { className: o, ...r } = e
        return n.createElement(d.TouchScrollContainer, {
          className: i(u.drawer, o),
          tabIndex: -1,
          ref: t,
          ...r,
        })
      })
    },
    16396: (e, t, o) => {
      o.d(t, { DEFAULT_POPUP_MENU_ITEM_THEME: () => c, PopupMenuItem: () => u })
      var n = o(50959),
        r = o(97754),
        i = o(51768),
        a = o(59064),
        s = o(76068),
        l = o(71986)
      const c = l
      function d(e) {
        e.stopPropagation()
      }
      function u(e) {
        const {
            id: t,
            role: o,
            className: c,
            title: u,
            labelRowClassName: h,
            labelClassName: p,
            toolboxClassName: m,
            shortcut: f,
            forceShowShortcuts: v,
            icon: g,
            iconClassname: b,
            isActive: E,
            isDisabled: w,
            isHovered: C,
            appearAsDisabled: k,
            label: D,
            link: x,
            showToolboxOnHover: y,
            showToolboxOnFocus: N,
            target: T,
            rel: _,
            toolbox: O,
            reference: M,
            onMouseOut: L,
            onMouseOver: B,
            onKeyDown: F,
            suppressToolboxClick: A = !0,
            theme: S = l,
            tabIndex: P,
            tagName: I,
            renderComponent: R,
            roundedIcon: W,
            iconAriaProps: U,
            circleLogo: j,
            dontClosePopup: H,
            onClick: Q,
            onClickArg: z,
            trackEventObject: K,
            trackMouseWheelClick: q,
            trackRightClick: V,
            ...G
          } = e,
          J = (0, n.useRef)(null),
          $ = (0, n.useMemo)(
            () =>
              ((e) => {
                function t(t) {
                  const { reference: o, ...r } = t,
                    i = null != e ? e : r.href ? 'a' : 'div',
                    a =
                      'a' === i
                        ? r
                        : ((e) => {
                            const {
                              download: t,
                              href: o,
                              hrefLang: n,
                              media: r,
                              ping: i,
                              rel: a,
                              target: s,
                              type: l,
                              referrerPolicy: c,
                              ...d
                            } = e
                            return d
                          })(r)
                  return n.createElement(i, { ...a, ref: o })
                }
                return (t.displayName = `DefaultComponent(${e})`), t
              })(I),
            [I],
          ),
          Y = null != R ? R : $
        return n.createElement(
          Y,
          {
            ...G,
            id: t,
            role: o,
            className: r(c, S.item, g && S.withIcon, {
              [S.isActive]: E,
              [S.isDisabled]: w || k,
              [S.hovered]: C,
            }),
            title: u,
            href: x,
            target: T,
            rel: _,
            reference: (e) => {
              ;(J.current = e), 'function' == typeof M && M(e)
              'object' == typeof M && (M.current = e)
            },
            onClick: (e) => {
              if (w) return
              K && (0, i.trackEvent)(K.category, K.event, K.label)
              Q && Q(z, e)
              H || (0, a.globalCloseMenu)()
            },
            onContextMenu: (e) => {
              K &&
                V &&
                (0, i.trackEvent)(K.category, K.event, `${K.label}_rightClick`)
            },
            onMouseUp: (e) => {
              if (1 === e.button && x && K) {
                let e = K.label
                q && (e += '_mouseWheelClick'),
                  (0, i.trackEvent)(K.category, K.event, e)
              }
            },
            onMouseOver: B,
            onMouseOut: L,
            onKeyDown: F,
            tabIndex: P,
          },
          j &&
            n.createElement(s.CircleLogo, {
              ...U,
              className: l['disclosure-item-circle-logo'],
              size: 'xxxsmall',
              logoUrl: j.logoUrl,
              placeholderLetter: j.placeholderLetter,
            }),
          g &&
            n.createElement('span', {
              'aria-label': U && U['aria-label'],
              'aria-hidden': U && Boolean(U['aria-hidden']),
              className: r(S.icon, W && l['round-icon'], b),
              dangerouslySetInnerHTML: { __html: g },
            }),
          n.createElement(
            'span',
            { className: r(S.labelRow, h) },
            n.createElement('span', { className: r(S.label, p) }, D),
          ),
          (void 0 !== f || v) &&
            n.createElement(
              'span',
              { className: S.shortcut },
              (X = f) && X.split('+').join(' + '),
            ),
          void 0 !== O &&
            n.createElement(
              'span',
              {
                onClick: A ? d : void 0,
                className: r(m, S.toolbox, {
                  [S.showOnHover]: y,
                  [S.showOnFocus]: N,
                }),
              },
              O,
            ),
        )
        var X
      }
    },
    20520: (e, t, o) => {
      o.d(t, { PopupMenu: () => h })
      var n = o(50959),
        r = o(962),
        i = o(62942),
        a = o(42842),
        s = o(27317),
        l = o(29197)
      const c = n.createContext(void 0)
      var d = o(36383)
      const u = n.createContext({ setMenuMaxWidth: !1 })
      function h(e) {
        const {
            controller: t,
            children: o,
            isOpened: h,
            closeOnClickOutside: p = !0,
            doNotCloseOn: m,
            onClickOutside: f,
            onClose: v,
            onKeyboardClose: g,
            'data-name': b = 'popup-menu-container',
            ...E
          } = e,
          w = (0, n.useContext)(l.CloseDelegateContext),
          C = n.useContext(u),
          k = (0, n.useContext)(c),
          D = (0, d.useOutsideEvent)({
            handler: (e) => {
              f && f(e)
              if (!p) return
              const t = (0, i.default)(m) ? m() : null == m ? [] : [m]
              if (t.length > 0 && e.target instanceof Node)
                for (const o of t) {
                  const t = r.findDOMNode(o)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              v()
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
                { ref: D, style: { pointerEvents: 'auto' } },
                n.createElement(
                  s.Menu,
                  {
                    ...E,
                    onClose: v,
                    onKeyboardClose: g,
                    onScroll: (t) => {
                      const { onScroll: o } = e
                      o && o(t)
                    },
                    customCloseDelegate: w,
                    customRemeasureDelegate: k,
                    ref: t,
                    'data-name': b,
                    limitMaxWidth: C.setMenuMaxWidth,
                  },
                  o,
                ),
              ),
            )
          : null
      }
    },
    10381: (e, t, o) => {
      o.d(t, { ToolWidgetCaret: () => l })
      var n = o(50959),
        r = o(97754),
        i = o(9745),
        a = o(34587),
        s = o(578)
      function l(e) {
        const { dropped: t, className: o } = e
        return n.createElement(i.Icon, {
          className: r(o, a.icon, { [a.dropped]: t }),
          icon: s,
        })
      }
    },
    86656: (e, t, o) => {
      o.d(t, { TouchScrollContainer: () => s })
      var n = o(50959),
        r = o(59142),
        i = o(50151),
        a = o(49483)
      const s = (0, n.forwardRef)((e, t) => {
        const { children: o, ...i } = e,
          s = (0, n.useRef)(null)
        return (
          (0, n.useImperativeHandle)(t, () => s.current),
          (0, n.useLayoutEffect)(() => {
            if (a.CheckMobile.iOS())
              return (
                null !== s.current &&
                  (0, r.disableBodyScroll)(s.current, { allowTouchMove: l(s) }),
                () => {
                  null !== s.current && (0, r.enableBodyScroll)(s.current)
                }
              )
          }, []),
          n.createElement('div', { ref: s, ...i }, o)
        )
      })
      function l(e) {
        return (t) => {
          const o = (0, i.ensureNotNull)(e.current),
            n = document.activeElement
          return (
            !o.contains(t) || (null !== n && o.contains(n) && n.contains(t))
          )
        }
      }
    },
    78029: (e) => {
      e.exports = {
        button: 'button-GwQQdU8S',
        hover: 'hover-GwQQdU8S',
        clicked: 'clicked-GwQQdU8S',
        isInteractive: 'isInteractive-GwQQdU8S',
        accessible: 'accessible-GwQQdU8S',
        isGrouped: 'isGrouped-GwQQdU8S',
        isActive: 'isActive-GwQQdU8S',
        isOpened: 'isOpened-GwQQdU8S',
        isDisabled: 'isDisabled-GwQQdU8S',
        text: 'text-GwQQdU8S',
        icon: 'icon-GwQQdU8S',
        endIcon: 'endIcon-GwQQdU8S',
      }
    },
    2869: (e) => {
      e.exports = { button: 'button-xNqEcuN2' }
    },
    42919: (e) => {
      e.exports = {
        button: 'button-merBkM5y',
        hover: 'hover-merBkM5y',
        clicked: 'clicked-merBkM5y',
        accessible: 'accessible-merBkM5y',
        arrow: 'arrow-merBkM5y',
        arrowWrap: 'arrowWrap-merBkM5y',
        isOpened: 'isOpened-merBkM5y',
      }
    },
    81261: (e, t, o) => {
      o.d(t, {
        focusFirstMenuItem: () => c,
        handleAccessibleMenuFocus: () => s,
        handleAccessibleMenuKeyDown: () => l,
        queryMenuElements: () => h,
      })
      var n = o(16838),
        r = o(71468),
        i = o(68335)
      const a = [37, 39, 38, 40]
      function s(e, t) {
        e.target &&
          n.PLATFORM_ACCESSIBILITY_ENABLED &&
          e.relatedTarget === t.current &&
          c(e.target)
      }
      function l(e) {
        var t
        if (!n.PLATFORM_ACCESSIBILITY_ENABLED) return
        if (e.defaultPrevented) return
        const o = (0, i.hashFromEvent)(e)
        if (!a.includes(o)) return
        const s = document.activeElement
        if (!(document.activeElement instanceof HTMLElement)) return
        const l = h(e.currentTarget).sort(n.navigationOrderComparator)
        if (0 === l.length) return
        const c =
          document.activeElement.closest('[data-role="menuitem"]') ||
          (null === (t = document.activeElement.parentElement) || void 0 === t
            ? void 0
            : t.querySelector('[data-role="menuitem"]'))
        if (!(c instanceof HTMLElement)) return
        const m = l.indexOf(c)
        if (-1 === m) return
        const f = p(c),
          v = f.indexOf(document.activeElement),
          g = -1 !== v,
          b = (e) => {
            s && (0, r.becomeSecondaryElement)(s),
              (0, r.becomeMainElement)(e),
              e.focus()
          }
        switch ((0, n.mapKeyCodeToDirection)(o)) {
          case 'inlinePrev':
            if (!f.length) return
            e.preventDefault(),
              b(0 === v ? l[m] : g ? d(f, v, -1) : f[f.length - 1])
            break
          case 'inlineNext':
            if (!f.length) return
            e.preventDefault(),
              v === f.length - 1 ? b(l[m]) : b(g ? d(f, v, 1) : f[0])
            break
          case 'blockPrev': {
            e.preventDefault()
            const t = d(l, m, -1)
            if (g) {
              const e = u(t, v)
              b(e || t)
              break
            }
            b(t)
            break
          }
          case 'blockNext': {
            e.preventDefault()
            const t = d(l, m, 1)
            if (g) {
              const e = u(t, v)
              b(e || t)
              break
            }
            b(t)
          }
        }
      }
      function c(e) {
        const [t] = h(e)
        t && ((0, r.becomeMainElement)(t), t.focus())
      }
      function d(e, t, o) {
        return e[(t + e.length + o) % e.length]
      }
      function u(e, t) {
        const o = p(e)
        return o.length ? o[(t + o.length) % o.length] : null
      }
      function h(e) {
        return Array.from(
          e.querySelectorAll(
            '[data-role="menuitem"]:not([disabled]):not([aria-disabled])',
          ),
        ).filter((0, n.createScopedVisibleElementFilter)(e))
      }
      function p(e) {
        return Array.from(
          e.querySelectorAll('[tabindex]:not([disabled]):not([aria-disabled])'),
        ).filter((0, n.createScopedVisibleElementFilter)(e))
      }
    },
    71468: (e, t, o) => {
      function n(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function r(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      o.d(t, { becomeMainElement: () => n, becomeSecondaryElement: () => r })
    },
    12811: (e, t, o) => {
      o.d(t, {
        HorizontalAttachEdge: () => r,
        HorizontalDropDirection: () => a,
        VerticalAttachEdge: () => n,
        VerticalDropDirection: () => i,
        getPopupPositioner: () => c,
      })
      var n,
        r,
        i,
        a,
        s = o(50151)
      !((e) => {
        ;(e[(e.Top = 0)] = 'Top'),
          (e[(e.Bottom = 1)] = 'Bottom'),
          (e[(e.AutoStrict = 2)] = 'AutoStrict')
      })(n || (n = {})),
        ((e) => {
          ;(e[(e.Left = 0)] = 'Left'), (e[(e.Right = 1)] = 'Right')
        })(r || (r = {})),
        ((e) => {
          ;(e[(e.FromTopToBottom = 0)] = 'FromTopToBottom'),
            (e[(e.FromBottomToTop = 1)] = 'FromBottomToTop')
        })(i || (i = {})),
        ((e) => {
          ;(e[(e.FromLeftToRight = 0)] = 'FromLeftToRight'),
            (e[(e.FromRightToLeft = 1)] = 'FromRightToLeft')
        })(a || (a = {}))
      const l = {
        verticalAttachEdge: n.Bottom,
        horizontalAttachEdge: r.Left,
        verticalDropDirection: i.FromTopToBottom,
        horizontalDropDirection: a.FromLeftToRight,
        verticalMargin: 0,
        horizontalMargin: 0,
        matchButtonAndListboxWidths: !1,
      }
      function c(e, t) {
        return (o) => {
          var c, d
          const { contentWidth: u, contentHeight: h, availableHeight: p } = o,
            m = (0, s.ensureNotNull)(e).getBoundingClientRect(),
            {
              horizontalAttachEdge: f = l.horizontalAttachEdge,
              horizontalDropDirection: v = l.horizontalDropDirection,
              horizontalMargin: g = l.horizontalMargin,
              verticalMargin: b = l.verticalMargin,
              matchButtonAndListboxWidths: E = l.matchButtonAndListboxWidths,
            } = t
          let w =
              null !== (c = t.verticalAttachEdge) && void 0 !== c
                ? c
                : l.verticalAttachEdge,
            C =
              null !== (d = t.verticalDropDirection) && void 0 !== d
                ? d
                : l.verticalDropDirection
          w === n.AutoStrict &&
            (p < m.y + m.height + b + h
              ? ((w = n.Top), (C = i.FromBottomToTop))
              : ((w = n.Bottom), (C = i.FromTopToBottom)))
          const k = w === n.Top ? -1 * b : b,
            D = f === r.Right ? m.right : m.left,
            x = w === n.Top ? m.top : m.bottom,
            y = {
              x: D - (v === a.FromRightToLeft ? u : 0) + g,
              y: x - (C === i.FromBottomToTop ? h : 0) + k,
            }
          return E && (y.overrideWidth = m.width), y
        }
      }
    },
    31409: (e, t, o) => {
      o.d(t, {
        DEFAULT_TOOL_WIDGET_BUTTON_THEME: () => s,
        ToolWidgetButton: () => l,
      })
      var n = o(50959),
        r = o(97754),
        i = o(9745),
        a = o(78029)
      const s = a,
        l = n.forwardRef((e, t) => {
          const {
              tag: o = 'div',
              icon: s,
              endIcon: l,
              isActive: c,
              isOpened: d,
              isDisabled: u,
              isGrouped: h,
              isHovered: p,
              isClicked: m,
              onClick: f,
              text: v,
              textBeforeIcon: g,
              title: b,
              theme: E = a,
              className: w,
              forceInteractive: C,
              inactive: k,
              'data-name': D,
              'data-tooltip': x,
              ...y
            } = e,
            N = r(w, E.button, (b || x) && 'apply-common-tooltip', {
              [E.isActive]: c,
              [E.isOpened]: d,
              [E.isInteractive]: (C || Boolean(f)) && !u && !k,
              [E.isDisabled]: Boolean(u || k),
              [E.isGrouped]: h,
              [E.hover]: p,
              [E.clicked]: m,
            }),
            T =
              s &&
              ('string' == typeof s
                ? n.createElement(i.Icon, { className: E.icon, icon: s })
                : n.cloneElement(s, {
                    className: r(E.icon, s.props.className),
                  }))
          return 'button' === o
            ? n.createElement(
                'button',
                {
                  ...y,
                  ref: t,
                  type: 'button',
                  className: r(N, E.accessible),
                  disabled: u && !k,
                  onClick: f,
                  title: b,
                  'data-name': D,
                  'data-tooltip': x,
                },
                g &&
                  v &&
                  n.createElement(
                    'div',
                    { className: r('js-button-text', E.text) },
                    v,
                  ),
                T,
                !g &&
                  v &&
                  n.createElement(
                    'div',
                    { className: r('js-button-text', E.text) },
                    v,
                  ),
              )
            : n.createElement(
                'div',
                {
                  ...y,
                  ref: t,
                  'data-role': 'button',
                  className: N,
                  onClick: u ? void 0 : f,
                  title: b,
                  'data-name': D,
                  'data-tooltip': x,
                },
                g &&
                  v &&
                  n.createElement(
                    'div',
                    { className: r('js-button-text', E.text) },
                    v,
                  ),
                T,
                !g &&
                  v &&
                  n.createElement(
                    'div',
                    { className: r('js-button-text', E.text) },
                    v,
                  ),
                l && n.createElement(i.Icon, { icon: l, className: a.endIcon }),
              )
        })
    },
    50813: (e, t, o) => {
      o.d(t, { ToolWidgetIconButton: () => s })
      var n = o(50959),
        r = o(97754),
        i = o(31409),
        a = o(2869)
      const s = n.forwardRef((e, t) => {
        const { className: o, id: s, ...l } = e
        return n.createElement(i.ToolWidgetButton, {
          id: s,
          'data-name': s,
          ...l,
          ref: t,
          className: r(o, a.button),
        })
      })
    },
    8087: (e, t, o) => {
      o.d(t, { ToolWidgetMenu: () => v })
      var n = o(50959),
        r = o(97754),
        i = o(3343),
        a = o(20520),
        s = o(10381),
        l = o(90186),
        c = o(37558),
        d = o(41590),
        u = o(12811),
        h = o(90692),
        p = o(14483),
        m = o(76460),
        f = o(42919)
      class v extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._wrapperRef = null),
            (this._controller = n.createRef()),
            (this._handleWrapperRef = (e) => {
              ;(this._wrapperRef = e),
                this.props.reference && this.props.reference(e)
            }),
            (this._handleOpen = () => {
              var e
              'div' !== this.props.tag &&
                (null === (e = this._controller.current) ||
                  void 0 === e ||
                  e.focus())
            }),
            (this._handleClick = (e) => {
              ;(p.enabled('skip_event_target_check') ||
                e.target instanceof Node) &&
                e.currentTarget.contains(e.target) &&
                (this._handleToggleDropdown(void 0, (0, m.isKeyboardClick)(e)),
                this.props.onClick &&
                  this.props.onClick(e, !this.state.isOpened))
            }),
            (this._handleToggleDropdown = (e, t = !1) => {
              const { onClose: o, onOpen: n } = this.props,
                { isOpened: r } = this.state,
                i = 'boolean' == typeof e ? e : !r
              this.setState({ isOpened: i, shouldReturnFocus: !!i && t }),
                i && n && n(),
                !i && o && o()
            }),
            (this._handleClose = () => {
              this.close()
            }),
            (this._handleKeyDown = (e) => {
              var t
              const { orientation: o = 'horizontal' } = this.props
              if (e.defaultPrevented) return
              if (!(e.target instanceof Node)) return
              const n = (0, i.hashFromEvent)(e)
              if (e.currentTarget.contains(e.target))
                switch (n) {
                  case 40:
                    if ('div' === this.props.tag || 'horizontal' !== o) return
                    if (this.state.isOpened) return
                    e.preventDefault(), this._handleToggleDropdown(!0, !0)
                    break
                  case 27:
                    if (!this.state.isOpened || !this.props.closeOnEsc) return
                    e.preventDefault(),
                      e.stopPropagation(),
                      this._handleToggleDropdown(!1)
                }
              else {
                if ('div' === this.props.tag) return
                switch (n) {
                  case 27: {
                    e.preventDefault()
                    const { shouldReturnFocus: o } = this.state
                    this._handleToggleDropdown(!1),
                      o &&
                        (null === (t = this._wrapperRef) ||
                          void 0 === t ||
                          t.focus())
                    break
                  }
                }
              }
            }),
            (this.state = { isOpened: !1, shouldReturnFocus: !1 })
        }
        render() {
          const {
              tag: e = 'div',
              id: t,
              arrow: o,
              content: i,
              isDisabled: a,
              isDrawer: c,
              isShowTooltip: d,
              title: u,
              className: p,
              hotKey: m,
              theme: f,
              drawerBreakpoint: v,
              tabIndex: g,
              isClicked: b,
            } = this.props,
            { isOpened: E } = this.state,
            w = r(p, f.button, {
              'apply-common-tooltip': d || !a,
              [f.isDisabled]: a,
              [f.isOpened]: E,
              [f.clicked]: b,
            })
          return 'button' === e
            ? n.createElement(
                'button',
                {
                  type: 'button',
                  id: t,
                  className: r(w, f.accessible),
                  disabled: a,
                  onClick: this._handleClick,
                  title: u,
                  'data-tooltip-hotkey': m,
                  ref: this._handleWrapperRef,
                  onKeyDown: this._handleKeyDown,
                  tabIndex: g,
                  ...(0, l.filterDataProps)(this.props),
                  ...(0, l.filterAriaProps)(this.props),
                },
                i,
                o &&
                  n.createElement(
                    'div',
                    { className: f.arrow },
                    n.createElement(
                      'div',
                      { className: f.arrowWrap },
                      n.createElement(s.ToolWidgetCaret, { dropped: E }),
                    ),
                  ),
                this.state.isOpened &&
                  (v
                    ? n.createElement(h.MatchMedia, { rule: v }, (e) =>
                        this._renderContent(e),
                      )
                    : this._renderContent(c)),
              )
            : n.createElement(
                'div',
                {
                  id: t,
                  className: w,
                  onClick: a ? void 0 : this._handleClick,
                  title: u,
                  'data-tooltip-hotkey': m,
                  ref: this._handleWrapperRef,
                  'data-role': 'button',
                  tabIndex: g,
                  onKeyDown: this._handleKeyDown,
                  ...(0, l.filterDataProps)(this.props),
                },
                i,
                o &&
                  n.createElement(
                    'div',
                    { className: f.arrow },
                    n.createElement(
                      'div',
                      { className: f.arrowWrap },
                      n.createElement(s.ToolWidgetCaret, { dropped: E }),
                    ),
                  ),
                this.state.isOpened &&
                  (v
                    ? n.createElement(h.MatchMedia, { rule: v }, (e) =>
                        this._renderContent(e),
                      )
                    : this._renderContent(c)),
              )
        }
        close() {
          this._handleToggleDropdown(!1)
        }
        focus() {
          var e
          null === (e = this._wrapperRef) || void 0 === e || e.focus()
        }
        update() {
          null !== this._controller.current && this._controller.current.update()
        }
        _renderContent(e) {
          const {
              menuDataName: t,
              minWidth: o,
              menuClassName: r,
              maxHeight: i,
              drawerPosition: s = 'Bottom',
              children: l,
            } = this.props,
            { isOpened: h } = this.state,
            p = {
              horizontalMargin: this.props.horizontalMargin || 0,
              verticalMargin: this.props.verticalMargin || 2,
              verticalAttachEdge: this.props.verticalAttachEdge,
              horizontalAttachEdge: this.props.horizontalAttachEdge,
              verticalDropDirection: this.props.verticalDropDirection,
              horizontalDropDirection: this.props.horizontalDropDirection,
              matchButtonAndListboxWidths:
                this.props.matchButtonAndListboxWidths,
            },
            m = Boolean(h && e && s),
            f = ((e) => 'function' == typeof e)(l) ? l({ isDrawer: m }) : l
          return m
            ? n.createElement(
                c.DrawerManager,
                null,
                n.createElement(
                  d.Drawer,
                  { onClose: this._handleClose, position: s, 'data-name': t },
                  f,
                ),
              )
            : n.createElement(
                a.PopupMenu,
                {
                  reference: this.props.menuReference,
                  controller: this._controller,
                  closeOnClickOutside: this.props.closeOnClickOutside,
                  doNotCloseOn: this,
                  isOpened: h,
                  minWidth: o,
                  onClose: this._handleClose,
                  position: (0, u.getPopupPositioner)(this._wrapperRef, p),
                  className: r,
                  maxHeight: i,
                  'data-name': t,
                  tabIndex: 'div' !== this.props.tag ? -1 : void 0,
                  onOpen: this._handleOpen,
                  onKeyDown: this.props.onMenuKeyDown,
                  onFocus: this.props.onMenuFocus,
                },
                f,
              )
        }
      }
      v.defaultProps = { arrow: !0, closeOnClickOutside: !0, theme: f }
    },
    578: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>'
    },
  },
])
