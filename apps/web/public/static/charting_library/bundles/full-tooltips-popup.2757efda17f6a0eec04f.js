;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8643],
  {
    59142: (e, t) => {
      var o, n, r
      ;(n = [t]),
        (o = (e) => {
          function t(e) {
            if (Array.isArray(e)) {
              for (var t = 0, o = Array(e.length); t < e.length; t++)
                o[t] = e[t]
              return o
            }
            return Array.from(e)
          }
          Object.defineProperty(e, '__esModule', { value: !0 })
          var o = !1
          if ('undefined' != typeof window) {
            var n = {
              get passive() {
                o = !0
              },
            }
            window.addEventListener('testPassive', null, n),
              window.removeEventListener('testPassive', null, n)
          }
          var r =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            l = [],
            a = !1,
            i = -1,
            s = void 0,
            c = void 0,
            u = (e) =>
              l.some(
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
            p = () => {
              setTimeout(() => {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== s &&
                    ((document.body.style.overflow = s), (s = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, n) => {
            if (r) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !l.some((t) => t.targetElement === e)) {
                var p = { targetElement: e, options: n || {} }
                ;(l = [].concat(t(l), [p])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (i = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var o, n, r, l
                    1 === t.targetTouches.length &&
                      ((n = e),
                      (l = (o = t).targetTouches[0].clientY - i),
                      !u(o.target) &&
                        ((n && 0 === n.scrollTop && 0 < l) ||
                        ((r = n) &&
                          r.scrollHeight - r.scrollTop <= r.clientHeight &&
                          l < 0)
                          ? d(o)
                          : o.stopPropagation()))
                  }),
                  a ||
                    (document.addEventListener(
                      'touchmove',
                      d,
                      o ? { passive: !1 } : void 0,
                    ),
                    (a = !0))
              }
            } else {
              ;(h = n),
                setTimeout(() => {
                  if (void 0 === c) {
                    var e = !!h && !0 === h.reserveScrollBarGap,
                      t =
                        window.innerWidth - document.documentElement.clientWidth
                    e &&
                      0 < t &&
                      ((c = document.body.style.paddingRight),
                      (document.body.style.paddingRight = t + 'px'))
                  }
                  void 0 === s &&
                    ((s = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var m = { targetElement: e, options: n || {} }
              l = [].concat(t(l), [m])
            }
            var h
          }),
            (e.clearAllBodyScrollLocks = () => {
              r
                ? (l.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  a &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      o ? { passive: !1 } : void 0,
                    ),
                    (a = !1)),
                  (l = []),
                  (i = -1))
                : (p(), (l = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (r) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (l = l.filter((t) => t.targetElement !== e)),
                  a &&
                    0 === l.length &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      o ? { passive: !1 } : void 0,
                    ),
                    (a = !1))
              } else
                1 === l.length && l[0].targetElement === e
                  ? (p(), (l = []))
                  : (l = l.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (r = 'function' == typeof o ? o.apply(t, n) : o) ||
          (e.exports = r)
    },
    88317: (e) => {
      e.exports = {
        pills: 'pills-PVWoXu5j',
        primary: 'primary-PVWoXu5j',
        gray: 'gray-PVWoXu5j',
        selected: 'selected-PVWoXu5j',
        grouped: 'grouped-PVWoXu5j',
        active: 'active-PVWoXu5j',
        disableActiveOnTouch: 'disableActiveOnTouch-PVWoXu5j',
        disableActiveStateStyles: 'disableActiveStateStyles-PVWoXu5j',
        withGrouped: 'withGrouped-PVWoXu5j',
        'quiet-primary': 'quiet-primary-PVWoXu5j',
        green: 'green-PVWoXu5j',
        red: 'red-PVWoXu5j',
        blue: 'blue-PVWoXu5j',
        secondary: 'secondary-PVWoXu5j',
        ghost: 'ghost-PVWoXu5j',
      }
    },
    1538: (e) => {
      e.exports = {
        lightButton: 'lightButton-bYDQcOkp',
        link: 'link-bYDQcOkp',
        ltr: 'ltr-bYDQcOkp',
        rtl: 'rtl-bYDQcOkp',
        'typography-regular16px': 'typography-regular16px-bYDQcOkp',
        'typography-medium16px': 'typography-medium16px-bYDQcOkp',
        'typography-regular14px': 'typography-regular14px-bYDQcOkp',
        'typography-semibold14px': 'typography-semibold14px-bYDQcOkp',
        'typography-semibold16px': 'typography-semibold16px-bYDQcOkp',
        content: 'content-bYDQcOkp',
        visuallyHidden: 'visuallyHidden-bYDQcOkp',
        nowrap: 'nowrap-bYDQcOkp',
        ellipsisContainer: 'ellipsisContainer-bYDQcOkp',
        textWrapContainer: 'textWrapContainer-bYDQcOkp',
        textWrapWithEllipsis: 'textWrapWithEllipsis-bYDQcOkp',
        slot: 'slot-bYDQcOkp',
        caret: 'caret-bYDQcOkp',
        activeCaret: 'activeCaret-bYDQcOkp',
        xsmall: 'xsmall-bYDQcOkp',
        withStartSlot: 'withStartSlot-bYDQcOkp',
        withEndSlot: 'withEndSlot-bYDQcOkp',
        noContent: 'noContent-bYDQcOkp',
        wrap: 'wrap-bYDQcOkp',
        small: 'small-bYDQcOkp',
        medium: 'medium-bYDQcOkp',
      }
    },
    36718: (e) => {
      e.exports = {
        'default-drawer-min-top-distance': '100px',
        wrap: 'wrap-_HnK0UIN',
        positionBottom: 'positionBottom-_HnK0UIN',
        backdrop: 'backdrop-_HnK0UIN',
        drawer: 'drawer-_HnK0UIN',
        positionLeft: 'positionLeft-_HnK0UIN',
      }
    },
    27011: (e, t, o) => {
      function n(e, t) {
        return (
          t ||
          null == e ||
          (('string' == typeof e || Array.isArray(e)) && 0 === e.length)
        )
      }
      o.d(t, { isIconOnly: () => n })
    },
    9038: (e, t, o) => {
      o.d(t, { useLightButtonClasses: () => c })
      var n = o(50959),
        r = o(97754),
        l = o(17946),
        a = o(27011),
        i = o(86332)
      const s = n.createContext({ isInButtonGroup: !1, isGroupPrimary: !1 }),
        c = (e, t, o) => {
          const c = (0, n.useContext)(l.CustomBehaviourContext),
            {
              className: u,
              isSelected: d,
              children: p,
              showCaret: m,
              forceDirection: h,
              iconOnly: v,
              color: g = 'gray',
              variant: y = 'primary',
              size: f = 'medium',
              enableActiveStateStyles: x = c.enableActiveStateStyles,
              typography: b,
              isLink: w = !1,
              textWrap: C,
              isPills: E,
              isActive: S,
              startSlot: W,
              endSlot: k,
            } = t,
            D =
              e[
                `typography-${((e, t, o) => {
                  if (o) {
                    const e = o.replace(/^\D+/g, '')
                    return t ? `semibold${e}` : o
                  }
                  switch (e) {
                    case 'xsmall':
                      return t ? 'semibold14px' : 'regular14px'
                    case 'small':
                    case 'medium':
                      return t ? 'semibold16px' : 'regular16px'
                    default:
                      return ''
                  }
                })(f, d || E, b || void 0)}`
              ],
            O = (0, n.useContext)(i.ControlGroupContext),
            { isInButtonGroup: B, isGroupPrimary: N } = (0, n.useContext)(s)
          return r(
            u,
            e.lightButton,
            w && e.link,
            S && e.active,
            d && e.selected,
            (0, a.isIconOnly)(p, v) && e.noContent,
            !!W && e.withStartSlot,
            (m || !!k) && e.withEndSlot,
            o && e.withGrouped,
            h && e[h],
            e[N ? 'primary' : y],
            e[N ? 'gray' : g],
            e[f],
            D,
            !x && e.disableActiveStateStyles,
            O.isGrouped && e.grouped,
            C && e.wrap,
            B && e.disableActiveOnTouch,
            E && e.pills,
          )
        }
    },
    66860: (e, t, o) => {
      o.d(t, { LightButtonContent: () => p })
      var n = o(50959),
        r = o(97754),
        l = o(34094),
        a = o(27011),
        i = o(9745),
        s = o(2948),
        c = o(1538),
        u = o.n(c)
      const d = (e) =>
        n.createElement(i.Icon, {
          className: r(u().caret, e && u().activeCaret),
          icon: s,
        })
      function p(e) {
        const {
          showCaret: t,
          iconOnly: o,
          ellipsis: i = !0,
          textWrap: s,
          tooltipText: c,
          children: p,
          endSlot: m,
          startSlot: h,
          isActiveCaret: v,
        } = e
        ;[m, t].filter((e) => !!e)
        return n.createElement(
          n.Fragment,
          null,
          h &&
            n.createElement(
              'span',
              { className: r(u().slot, u().startSlot) },
              h,
            ),
          !(0, a.isIconOnly)(p, o) &&
            n.createElement(
              'span',
              {
                className: r(
                  u().content,
                  !s && u().nowrap,
                  'apply-overflow-tooltip',
                  'apply-overflow-tooltip--check-children-recursively',
                  'apply-overflow-tooltip--allow-text',
                ),
                'data-overflow-tooltip-text': c ?? (0, l.getTextForTooltip)(p),
              },
              s || i
                ? n.createElement(
                    n.Fragment,
                    null,
                    n.createElement(
                      'span',
                      {
                        className: r(
                          !s && i && u().ellipsisContainer,
                          s && u().textWrapContainer,
                          s && i && u().textWrapWithEllipsis,
                        ),
                      },
                      p,
                    ),
                    n.createElement(
                      'span',
                      { className: u().visuallyHidden, 'aria-hidden': !0 },
                      p,
                    ),
                  )
                : n.createElement(
                    n.Fragment,
                    null,
                    p,
                    n.createElement(
                      'span',
                      { className: u().visuallyHidden, 'aria-hidden': !0 },
                      p,
                    ),
                  ),
            ),
          m &&
            n.createElement('span', { className: r(u().slot, u().endSlot) }, m),
          t && d(v),
        )
      }
    },
    15893: (e, t, o) => {
      o.d(t, { LightButton: () => d })
      var n = o(50959),
        r = o(86332),
        l = o(9038),
        a = o(66860),
        i = o(1538),
        s = o.n(i),
        c = o(88317),
        u = o.n(c)
      function d(e) {
        const { isGrouped: t } = n.useContext(r.ControlGroupContext),
          {
            reference: o,
            className: i,
            isSelected: c,
            children: d,
            iconOnly: p,
            ellipsis: m,
            showCaret: h,
            forceDirection: v,
            endSlot: g,
            startSlot: y,
            color: f,
            variant: x,
            size: b,
            enableActiveStateStyles: w,
            typography: C,
            textWrap: E = !1,
            maxLines: S,
            style: W = {},
            isPills: k,
            isActive: D,
            tooltipText: O,
            role: B,
            ...N
          } = e,
          I = E ? (S ?? 2) : 1,
          P = I > 0 ? { ...W, '--ui-lib-light-button-content-max-lines': I } : W
        return n.createElement(
          'button',
          {
            ...N,
            className: (0, l.useLightButtonClasses)(
              { ...u(), ...s() },
              {
                className: i,
                isSelected: c,
                children: d,
                iconOnly: p,
                showCaret: h,
                forceDirection: v,
                endSlot: g,
                startSlot: y,
                color: f,
                variant: x,
                size: b,
                enableActiveStateStyles: w,
                typography: C,
                textWrap: E,
                isPills: k,
                isActive: D,
              },
              t,
            ),
            ref: o,
            style: P,
            role: B,
          },
          n.createElement(
            a.LightButtonContent,
            {
              showCaret: h,
              isActiveCaret: h && (k || D || c),
              iconOnly: p,
              ellipsis: m,
              textWrap: E,
              tooltipText: O,
              endSlot: g,
              startSlot: y,
            },
            d,
          ),
        )
      }
    },
    86332: (e, t, o) => {
      o.d(t, { ControlGroupContext: () => n })
      const n = o(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    17946: (e, t, o) => {
      o.d(t, { CustomBehaviourContext: () => n })
      const n = (0, o(50959).createContext)({ enableActiveStateStyles: !0 })
      n.displayName = 'CustomBehaviourContext'
    },
    34094: (e, t, o) => {
      o.d(t, { getTextForTooltip: () => a })
      var n = o(50959)
      const r = (e) => (0, n.isValidElement)(e) && Boolean(e.props.children),
        l = (e) =>
          null == e || 'boolean' == typeof e || '{}' === JSON.stringify(e)
            ? ''
            : e.toString() + ' ',
        a = (e) =>
          Array.isArray(e) || (0, n.isValidElement)(e)
            ? n.Children.toArray(e)
                .reduce((e, t) => {
                  let o = ''
                  return (
                    (o =
                      (0, n.isValidElement)(t) && r(t)
                        ? a(t.props.children)
                        : (0, n.isValidElement)(t) && !r(t)
                          ? ''
                          : l(t)),
                    e.concat(o)
                  )
                }, '')
                .trim()
            : l(e)
    },
    37558: (e, t, o) => {
      o.d(t, { DrawerContext: () => a, DrawerManager: () => l })
      var n = o(50959),
        r = o(99054)
      class l extends n.PureComponent {
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
      o.d(t, { Drawer: () => m })
      var n = o(50959),
        r = o(50151),
        l = o(97754),
        a = o(92184),
        i = o(42842),
        s = o(37558),
        c = o(29197),
        u = o(86656),
        d = o(36718)
      var p
      function m(e) {
        const {
            position: t = 'Bottom',
            onClose: o,
            children: u,
            reference: p,
            className: m,
            theme: v = d,
          } = e,
          g = (0, r.ensureNotNull)((0, n.useContext)(s.DrawerContext)),
          [y] = (0, n.useState)(() => (0, a.randomHash)()),
          f = (0, n.useRef)(null),
          x = (0, n.useContext)(c.CloseDelegateContext)
        return (
          (0, n.useLayoutEffect)(
            () => (
              (0, r.ensureNotNull)(f.current).focus({ preventScroll: !0 }),
              x.subscribe(g, o),
              g.addDrawer(y),
              () => {
                g.removeDrawer(y), x.unsubscribe(g, o)
              }
            ),
            [],
          ),
          n.createElement(
            i.Portal,
            null,
            n.createElement(
              'div',
              { ref: p, className: l(d.wrap, d[`position${t}`]) },
              y === g.currentDrawer &&
                n.createElement('div', { className: d.backdrop, onClick: o }),
              n.createElement(
                h,
                {
                  className: l(v.drawer, d[`position${t}`], m),
                  ref: f,
                  'data-name': e['data-name'],
                },
                u,
              ),
            ),
          )
        )
      }
      !((e) => {
        ;(e.Left = 'Left'), (e.Bottom = 'Bottom')
      })(p || (p = {}))
      const h = (0, n.forwardRef)((e, t) => {
        const { className: o, ...r } = e
        return n.createElement(u.TouchScrollContainer, {
          className: l(d.drawer, o),
          tabIndex: -1,
          ref: t,
          ...r,
        })
      })
    },
    20520: (e, t, o) => {
      o.d(t, { PopupMenu: () => p })
      var n = o(50959),
        r = o(32227),
        l = o(88987),
        a = o(42842),
        i = o(27317),
        s = o(29197)
      const c = n.createContext(void 0)
      var u = o(36383)
      const d = n.createContext({ setMenuMaxWidth: !1 })
      function p(e) {
        const {
            controller: t,
            children: o,
            isOpened: p,
            closeOnClickOutside: m = !0,
            doNotCloseOn: h,
            onClickOutside: v,
            onClose: g,
            onKeyboardClose: y,
            'data-name': f = 'popup-menu-container',
            ...x
          } = e,
          b = (0, n.useContext)(s.CloseDelegateContext),
          w = n.useContext(d),
          C = (0, n.useContext)(c),
          E = (0, u.useOutsideEvent)({
            handler: (e) => {
              v && v(e)
              if (!m) return
              const t = (0, l.default)(h) ? h() : null == h ? [] : [h]
              if (t.length > 0 && e.target instanceof Node)
                for (const o of t) {
                  const t = r.findDOMNode(o)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              g()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return p
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
                { ref: E, style: { pointerEvents: 'auto' } },
                n.createElement(
                  i.Menu,
                  {
                    ...x,
                    onClose: g,
                    onKeyboardClose: y,
                    onScroll: (t) => {
                      const { onScroll: o } = e
                      o && o(t)
                    },
                    customCloseDelegate: b,
                    customRemeasureDelegate: C,
                    ref: t,
                    'data-name': f,
                    limitMaxWidth: w.setMenuMaxWidth,
                    'data-tooltip-show-on-focus': 'true',
                  },
                  o,
                ),
              ),
            )
          : null
      }
    },
    86656: (e, t, o) => {
      o.d(t, { TouchScrollContainer: () => c })
      var n = o(50959),
        r = o(59142),
        l = o(50151),
        a = o(49483)
      const i = CSS.supports('overscroll-behavior', 'none')
      let s = 0
      const c = (0, n.forwardRef)((e, t) => {
        const { children: o, ...l } = e,
          c = (0, n.useRef)(null)
        return (
          (0, n.useImperativeHandle)(t, () => c.current),
          (0, n.useLayoutEffect)(() => {
            if (a.CheckMobile.iOS())
              return (
                s++,
                null !== c.current &&
                  (i
                    ? 1 === s &&
                      (document.body.style.overscrollBehavior = 'none')
                    : (0, r.disableBodyScroll)(c.current, {
                        allowTouchMove: u(c),
                      })),
                () => {
                  s--,
                    null !== c.current &&
                      (i
                        ? 0 === s &&
                          (document.body.style.overscrollBehavior = '')
                        : (0, r.enableBodyScroll)(c.current))
                }
              )
          }, []),
          n.createElement('div', { ref: c, ...l }, o)
        )
      })
      function u(e) {
        return (t) => {
          const o = (0, l.ensureNotNull)(e.current),
            n = document.activeElement
          return (
            !o.contains(t) || (null !== n && o.contains(n) && n.contains(t))
          )
        }
      }
    },
    59617: (e) => {
      e.exports = {
        'css-value-small-size': '18px',
        'css-value-medium-size': '22px',
        'css-value-large-size': '28px',
        'css-value-border-radius-small-size': '9px',
        'css-value-border-radius-medium-size': '11px',
        'css-value-border-radius-large-size': '8px',
        'css-value-vertical-padding-size': '16px',
        'css-value-horizontal-padding-size': '16px',
        'css-value-vertical-padding-size-first': '11px',
        'css-value-vertical-padding-size-last': '10px',
        popupWidget: 'popupWidget-Wu2pIo3E',
        large: 'large-Wu2pIo3E',
        mobile: 'mobile-Wu2pIo3E',
        desc: 'desc-Wu2pIo3E',
        icon: 'icon-Wu2pIo3E',
        small: 'small-Wu2pIo3E',
        medium: 'medium-Wu2pIo3E',
        title: 'title-Wu2pIo3E',
        text: 'text-Wu2pIo3E',
        item: 'item-Wu2pIo3E',
        boldItem: 'boldItem-Wu2pIo3E',
        action: 'action-Wu2pIo3E',
        actionBtn: 'actionBtn-Wu2pIo3E',
        additionalWidget: 'additionalWidget-Wu2pIo3E',
      }
    },
    12048: (e, t, o) => {
      o.r(t), o.d(t, { render: () => S })
      var n = o(50959),
        r = o(32227),
        l = o(20520),
        a = o(90692),
        i = o(41590),
        s = o(37558),
        c = o(92184),
        u = o(97754),
        d = o(50151),
        p = o(9745),
        m = o(15893),
        h = o(77975),
        v = o(37265),
        g = o(58994),
        y = o(59617)
      const f = new WeakMap(),
        x = new WeakMap()
      function b(e) {
        const t = (0, h.useWatchedValueReadonly)({ watchedValue: e.info })
        if (null === t) return null
        const o = t.map((t) => {
          const {
            title: o,
            titleColor: r,
            icon: l,
            iconClassName: a,
            html: i,
            action: s,
            size: h,
            solutionId: b,
          } = t
          f.has(t) || f.set(t, (0, c.randomHash)())
          let w = []
          return (
            void 0 !== e.additionalWidgets &&
              (w = e.additionalWidgets.map(
                (t) => (
                  x.has(t) || x.set(t, (0, c.randomHash)()),
                  t.renderer(
                    (0, d.ensureDefined)(x.get(t)),
                    y.additionalWidget,
                    e.onClose,
                  )
                ),
              )),
            n.createElement(
              'div',
              {
                key: f.get(t),
                className: u(y.popupWidget, y[h], e.isMobile && y.mobile),
                'data-test-id': t.dataTestId,
              },
              n.createElement(p.Icon, {
                className: u(y.icon, a, g[h], y[h]),
                style: { '--custom-status-color': r || void 0 },
                icon: l || void 0,
              }),
              n.createElement(
                'div',
                { className: y.desc },
                n.createElement(
                  'span',
                  {
                    style: { color: r || void 0 },
                    className: u(y.title, y[h]),
                  },
                  n.createElement('span', null, o),
                  !1,
                ),
                i &&
                  n.createElement(
                    'p',
                    { className: u(y.text, y[h]) },
                    i.map((e, t) => {
                      let o, r
                      return (
                        (0, v.isObject)(e)
                          ? ((o = e.text), (r = e.bold))
                          : (o = e),
                        n.createElement('span', {
                          key: `html_item_${t}`,
                          className: u(y.item, r && y.boldItem),
                          dangerouslySetInnerHTML: { __html: o },
                        })
                      )
                    }),
                  ),
                s &&
                  n.createElement(
                    m.LightButton,
                    {
                      className: y.actionBtn,
                      onClick: () => {
                        e.onClose(), s?.onClick()
                      },
                      size: 'xsmall',
                      tooltipText: s.tooltip,
                    },
                    s.text,
                  ),
                w,
              ),
            )
          )
        })
        return n.createElement(n.Fragment, null, o)
      }
      const w = new WeakMap()
      function C(e) {
        const {
          statusWidgetInfos: t,
          matchMediaRule: o = '(min-width: 441px)',
        } = e
        return n.createElement(
          s.DrawerManager,
          null,
          n.createElement(a.MatchMedia, { rule: o }, (o) =>
            o
              ? n.createElement(
                  l.PopupMenu,
                  {
                    isOpened: !0,
                    onClose: e.onClose,
                    position: e.position,
                    doNotCloseOn: e.rendererButton,
                  },
                  n.createElement(E, {
                    widgetInfo: t,
                    onClose: e.onClose,
                    isMobile: !o,
                  }),
                )
              : n.createElement(
                  i.Drawer,
                  { onClose: e.onClose, position: 'Bottom' },
                  n.createElement(E, {
                    widgetInfo: t,
                    onClose: e.onClose,
                    isMobile: !o,
                  }),
                ),
          ),
        )
      }
      function E(e) {
        return n.createElement(
          n.Fragment,
          null,
          e.widgetInfo
            .filter((e) => e.visible.value())
            .map(
              (t) => (
                w.has(t) || w.set(t, (0, c.randomHash)()),
                n.createElement(b, {
                  key: w.get(t),
                  info: t.model.fullInfo(),
                  onClose: e.onClose,
                  additionalWidgets: t.additionalWidgets,
                  isMobile: e.isMobile,
                })
              ),
            ),
        )
      }
      function S(e) {
        const { opened: t, container: o, ...l } = e
        t
          ? r.render(n.createElement(C, { ...l }), o)
          : r.unmountComponentAtNode(o)
      }
    },
    2948: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.92 7.83 9 12.29l5.08-4.46-1-1.13L9 10.29l-4.09-3.6-.99 1.14Z"/></svg>'
    },
    55698: (e, t, o) => {
      o.d(t, { nanoid: () => n })
      const n = (e = 21) =>
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
  },
])
