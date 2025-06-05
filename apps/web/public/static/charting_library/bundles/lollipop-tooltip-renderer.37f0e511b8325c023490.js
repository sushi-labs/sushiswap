;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9039],
  {
    259142: (e, t) => {
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
            i = !1,
            a = -1,
            s = void 0,
            c = void 0,
            u = (e) =>
              l.some(
                (t) =>
                  !(!t.options.allowTouchMove || !t.options.allowTouchMove(e)),
              ),
            p = (e) => {
              var t = e || window.event
              return (
                !!u(t.target) ||
                1 < t.touches.length ||
                (t.preventDefault && t.preventDefault(), !1)
              )
            },
            d = () => {
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
                var d = { targetElement: e, options: n || {} }
                ;(l = [].concat(t(l), [d])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (a = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var o, n, r, l
                    1 === t.targetTouches.length &&
                      ((n = e),
                      (l = (o = t).targetTouches[0].clientY - a),
                      !u(o.target) &&
                        ((n && 0 === n.scrollTop && 0 < l) ||
                        ((r = n) &&
                          r.scrollHeight - r.scrollTop <= r.clientHeight &&
                          l < 0)
                          ? p(o)
                          : o.stopPropagation()))
                  }),
                  i ||
                    (document.addEventListener(
                      'touchmove',
                      p,
                      o ? { passive: !1 } : void 0,
                    ),
                    (i = !0))
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
                  i &&
                    (document.removeEventListener(
                      'touchmove',
                      p,
                      o ? { passive: !1 } : void 0,
                    ),
                    (i = !1)),
                  (l = []),
                  (a = -1))
                : (d(), (l = []))
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
                  i &&
                    0 === l.length &&
                    (document.removeEventListener(
                      'touchmove',
                      p,
                      o ? { passive: !1 } : void 0,
                    ),
                    (i = !1))
              } else
                1 === l.length && l[0].targetElement === e
                  ? (d(), (l = []))
                  : (l = l.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (r = 'function' == typeof o ? o.apply(t, n) : o) ||
          (e.exports = r)
    },
    758222: (e) => {
      e.exports = {
        'light-button': 'light-button-bYDQcOkp',
        link: 'link-bYDQcOkp',
        content: 'content-bYDQcOkp',
        'visually-hidden': 'visually-hidden-bYDQcOkp',
        nowrap: 'nowrap-bYDQcOkp',
        'ellipsis-container': 'ellipsis-container-bYDQcOkp',
        'text-wrap-container': 'text-wrap-container-bYDQcOkp',
        'text-wrap-with-ellipsis': 'text-wrap-with-ellipsis-bYDQcOkp',
        icon: 'icon-bYDQcOkp',
        'force-direction-ltr': 'force-direction-ltr-bYDQcOkp',
        'force-direction-rtl': 'force-direction-rtl-bYDQcOkp',
        'with-grouped': 'with-grouped-bYDQcOkp',
        'variant-quiet-primary': 'variant-quiet-primary-bYDQcOkp',
        selected: 'selected-bYDQcOkp',
        'typography-regular16px': 'typography-regular16px-bYDQcOkp',
        'typography-medium16px': 'typography-medium16px-bYDQcOkp',
        'typography-regular14px': 'typography-regular14px-bYDQcOkp',
        'typography-semibold14px': 'typography-semibold14px-bYDQcOkp',
        'typography-semibold16px': 'typography-semibold16px-bYDQcOkp',
        'size-xsmall': 'size-xsmall-bYDQcOkp',
        'with-start-icon': 'with-start-icon-bYDQcOkp',
        'with-end-icon': 'with-end-icon-bYDQcOkp',
        'no-content': 'no-content-bYDQcOkp',
        wrap: 'wrap-bYDQcOkp',
        'size-small': 'size-small-bYDQcOkp',
        'size-medium': 'size-medium-bYDQcOkp',
        'variant-primary': 'variant-primary-bYDQcOkp',
        'color-gray': 'color-gray-bYDQcOkp',
        caret: 'caret-bYDQcOkp',
        grouped: 'grouped-bYDQcOkp',
        pills: 'pills-bYDQcOkp',
        active: 'active-bYDQcOkp',
        'disable-active-on-touch': 'disable-active-on-touch-bYDQcOkp',
        'disable-active-state-styles': 'disable-active-state-styles-bYDQcOkp',
        'color-green': 'color-green-bYDQcOkp',
        'color-red': 'color-red-bYDQcOkp',
        'variant-secondary': 'variant-secondary-bYDQcOkp',
        'variant-ghost': 'variant-ghost-bYDQcOkp',
      }
    },
    966076: (e) => {
      e.exports = {
        'default-drawer-min-top-distance': '100px',
        wrap: 'wrap-_HnK0UIN',
        positionBottom: 'positionBottom-_HnK0UIN',
        backdrop: 'backdrop-_HnK0UIN',
        drawer: 'drawer-_HnK0UIN',
        positionLeft: 'positionLeft-_HnK0UIN',
      }
    },
    959189: (e, t, o) => {
      function n(e, t) {
        return (
          t ||
          null == e ||
          (('string' == typeof e || Array.isArray(e)) && 0 === e.length)
        )
      }
      o.d(t, { isIconOnly: () => n })
    },
    418920: (e, t, o) => {
      o.d(t, { LightButtonContent: () => v, useLightButtonClasses: () => h })
      var n = o(50959),
        r = o(497754),
        l = o(601198),
        i = o(72571),
        a = o(234539),
        s = o(959189),
        c = o(380327)
      const u = n.createContext({ isInButtonGroup: !1, isGroupPrimary: !1 })
      var p = o(602948),
        d = o(758222),
        m = o.n(d)
      const h = (e, t) => {
        const o = (0, n.useContext)(a.CustomBehaviourContext),
          l = (0, n.useContext)(c.ControlGroupContext),
          { isInButtonGroup: i, isGroupPrimary: p } = (0, n.useContext)(u),
          {
            className: d,
            isSelected: h,
            children: v,
            startIcon: f,
            showCaret: g,
            endIcon: y,
            forceDirection: b,
            iconOnly: w,
            color: C = 'gray',
            variant: x = 'primary',
            size: E = 'medium',
            enableActiveStateStyles: k = o.enableActiveStateStyles,
            typography: O,
            isLink: T = !1,
            textWrap: D,
            isPills: N,
            isActive: S,
          } = e,
          Q =
            m()[
              `typography-${((e, t, o) => {
                if (o) {
                  const e = o.replace(/^\D+/g, '')
                  return t ? `semibold${e}` : o
                }
                return 'xsmall' === e
                  ? t
                    ? 'semibold14px'
                    : 'regular14px'
                  : 'small' === e || 'medium' === e
                    ? t
                      ? 'semibold16px'
                      : 'regular16px'
                    : ''
              })(E, h || N, O || void 0)}`
            ]
        return r(
          d,
          m()['light-button'],
          T && m().link,
          S && m().active,
          h && m().selected,
          (0, s.isIconOnly)(v, w) && m()['no-content'],
          f && m()['with-start-icon'],
          (g || y) && m()['with-end-icon'],
          t && m()['with-grouped'],
          b && m()[`force-direction-${b}`],
          m()[`variant-${p ? 'primary' : x}`],
          m()[`color-${p ? 'gray' : C}`],
          m()[`size-${E}`],
          Q,
          !k && m()['disable-active-state-styles'],
          l.isGrouped && m().grouped,
          D && m().wrap,
          i && m()['disable-active-on-touch'],
          N && m().pills,
        )
      }
      function v(e) {
        const {
          startIcon: t,
          endIcon: o,
          showCaret: a,
          iconOnly: c,
          ellipsis: u = !0,
          textWrap: d,
          tooltipText: h,
          children: v,
        } = e
        return n.createElement(
          n.Fragment,
          null,
          t && n.createElement(i.Icon, { className: m().icon, icon: t }),
          !(0, s.isIconOnly)(v, c) &&
            n.createElement(
              'span',
              {
                className: r(
                  m().content,
                  !d && m().nowrap,
                  'apply-overflow-tooltip',
                  'apply-overflow-tooltip--check-children-recursively',
                  'apply-overflow-tooltip--allow-text',
                ),
                'data-overflow-tooltip-text':
                  null != h ? h : (0, l.getTextForTooltip)(v),
              },
              d || u
                ? n.createElement(
                    n.Fragment,
                    null,
                    n.createElement(
                      'span',
                      {
                        className: r(
                          !d && u && m()['ellipsis-container'],
                          d && m()['text-wrap-container'],
                          d && u && m()['text-wrap-with-ellipsis'],
                        ),
                      },
                      v,
                    ),
                    n.createElement(
                      'span',
                      { className: m()['visually-hidden'], 'aria-hidden': !0 },
                      v,
                    ),
                  )
                : n.createElement(
                    n.Fragment,
                    null,
                    v,
                    n.createElement(
                      'span',
                      { className: m()['visually-hidden'], 'aria-hidden': !0 },
                      v,
                    ),
                  ),
            ),
          (o || a) &&
            ((e) =>
              n.createElement(i.Icon, {
                className: r(m().icon, e.showCaret && m().caret),
                icon: e.showCaret ? p : e.endIcon,
              }))(e),
        )
      }
    },
    943158: (e, t, o) => {
      o.d(t, { LightButton: () => i })
      var n = o(50959),
        r = o(380327),
        l = o(418920)
      function i(e) {
        const { isGrouped: t } = n.useContext(r.ControlGroupContext),
          {
            reference: o,
            className: i,
            isSelected: a,
            children: s,
            startIcon: c,
            iconOnly: u,
            ellipsis: p,
            showCaret: d,
            forceDirection: m,
            endIcon: h,
            color: v,
            variant: f,
            size: g,
            enableActiveStateStyles: y,
            typography: b,
            textWrap: w = !1,
            maxLines: C,
            style: x = {},
            isPills: E,
            isActive: k,
            tooltipText: O,
            ...T
          } = e,
          D = w ? (null != C ? C : 2) : 1,
          N = D > 0 ? { ...x, '--ui-lib-light-button-content-max-lines': D } : x
        return n.createElement(
          'button',
          {
            ...T,
            className: (0, l.useLightButtonClasses)(
              {
                className: i,
                isSelected: a,
                children: s,
                startIcon: c,
                iconOnly: u,
                showCaret: d,
                forceDirection: m,
                endIcon: h,
                color: v,
                variant: f,
                size: g,
                enableActiveStateStyles: y,
                typography: b,
                textWrap: w,
                isPills: E,
                isActive: k,
              },
              t,
            ),
            ref: o,
            style: N,
          },
          n.createElement(
            l.LightButtonContent,
            {
              showCaret: d,
              startIcon: c,
              endIcon: h,
              iconOnly: u,
              ellipsis: p,
              textWrap: w,
              tooltipText: O,
            },
            s,
          ),
        )
      }
    },
    380327: (e, t, o) => {
      o.d(t, { ControlGroupContext: () => n })
      const n = o(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    234539: (e, t, o) => {
      o.d(t, { CustomBehaviourContext: () => n })
      const n = (0, o(50959).createContext)({ enableActiveStateStyles: !0 })
      n.displayName = 'CustomBehaviourContext'
    },
    778199: (e, t, o) => {
      function n(e, t, o, n, r) {
        function l(r) {
          if (e > r.timeStamp) return
          const l = r.target
          void 0 !== o &&
            null !== t &&
            null !== l &&
            l.ownerDocument === n &&
            (t.contains(l) || o(r))
        }
        return (
          r.click && n.addEventListener('click', l, !1),
          r.mouseDown && n.addEventListener('mousedown', l, !1),
          r.touchEnd && n.addEventListener('touchend', l, !1),
          r.touchStart && n.addEventListener('touchstart', l, !1),
          () => {
            n.removeEventListener('click', l, !1),
              n.removeEventListener('mousedown', l, !1),
              n.removeEventListener('touchend', l, !1),
              n.removeEventListener('touchstart', l, !1)
          }
        )
      }
      o.d(t, { addOutsideEventListener: () => n })
    },
    72571: (e, t, o) => {
      o.d(t, { Icon: () => r })
      var n = o(50959)
      const r = n.forwardRef((e, t) => {
        const { icon: o = '', ...r } = e
        return n.createElement('span', {
          ...r,
          ref: t,
          dangerouslySetInnerHTML: { __html: o },
        })
      })
    },
    601198: (e, t, o) => {
      o.d(t, { getTextForTooltip: () => i })
      var n = o(50959)
      const r = (e) => (0, n.isValidElement)(e) && Boolean(e.props.children),
        l = (e) =>
          null == e || 'boolean' == typeof e || '{}' === JSON.stringify(e)
            ? ''
            : e.toString() + ' ',
        i = (e) =>
          Array.isArray(e) || (0, n.isValidElement)(e)
            ? n.Children.toArray(e)
                .reduce((e, t) => {
                  let o = ''
                  return (
                    (o =
                      (0, n.isValidElement)(t) && r(t)
                        ? i(t.props.children)
                        : (0, n.isValidElement)(t) && !r(t)
                          ? ''
                          : l(t)),
                    e.concat(o)
                  )
                }, '')
                .trim()
            : l(e)
    },
    163694: (e, t, o) => {
      o.d(t, { DrawerContext: () => i, DrawerManager: () => l })
      var n = o(50959),
        r = o(285089)
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
            i.Provider,
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
      const i = n.createContext(null)
    },
    759339: (e, t, o) => {
      o.d(t, { Drawer: () => d })
      var n = o(50959),
        r = o(650151),
        l = o(497754),
        i = o(189904),
        a = o(813113),
        s = o(163694),
        c = o(28466),
        u = o(742554),
        p = o(966076)
      function d(e) {
        const {
            position: t = 'Bottom',
            onClose: o,
            children: u,
            className: d,
            theme: h = p,
          } = e,
          v = (0, r.ensureNotNull)((0, n.useContext)(s.DrawerContext)),
          [f] = (0, n.useState)(() => (0, i.randomHash)()),
          g = (0, n.useRef)(null),
          y = (0, n.useContext)(c.CloseDelegateContext)
        return (
          (0, n.useLayoutEffect)(
            () => (
              (0, r.ensureNotNull)(g.current).focus({ preventScroll: !0 }),
              y.subscribe(v, o),
              v.addDrawer(f),
              () => {
                v.removeDrawer(f), y.unsubscribe(v, o)
              }
            ),
            [],
          ),
          n.createElement(
            a.Portal,
            null,
            n.createElement(
              'div',
              { className: l(p.wrap, p[`position${t}`]) },
              f === v.currentDrawer &&
                n.createElement('div', { className: p.backdrop, onClick: o }),
              n.createElement(
                m,
                {
                  className: l(h.drawer, p[`position${t}`], d),
                  ref: g,
                  'data-name': e['data-name'],
                },
                u,
              ),
            ),
          )
        )
      }
      const m = (0, n.forwardRef)((e, t) => {
        const { className: o, ...r } = e
        return n.createElement(u.TouchScrollContainer, {
          className: l(p.drawer, o),
          tabIndex: -1,
          ref: t,
          ...r,
        })
      })
    },
    683614: (e, t, o) => {
      o.d(t, { useVisibility: () => r })
      var n = o(50959)
      function r(e, t, o) {
        ;(0, n.useEffect)(() => {
          const n = new IntersectionObserver(
            (e) => {
              e[e.length - 1].intersectionRatio < 0.25 ? o() : t()
            },
            {
              threshold: [0, 0.25, 0.5, 0.75, 1],
              root: null,
              rootMargin: '0px',
            },
          )
          return e.current && n.observe(e.current), () => n.disconnect()
        }, [])
      }
    },
    624216: (e, t, o) => {
      o.d(t, {
        PopupMenu: () => d,
      })
      var n = o(50959),
        r = o(500962),
        l = o(162942),
        i = o(813113),
        a = o(510618),
        s = o(28466)
      const c = n.createContext(void 0)
      var u = o(908783)
      const p = n.createContext({ setMenuMaxWidth: !1 })
      function d(e) {
        const {
            controller: t,
            children: o,
            isOpened: d,
            closeOnClickOutside: m = !0,
            doNotCloseOn: h,
            onClickOutside: v,
            onClose: f,
            onKeyboardClose: g,
            'data-name': y = 'popup-menu-container',
            ...b
          } = e,
          w = (0, n.useContext)(s.CloseDelegateContext),
          C = n.useContext(p),
          x = (0, n.useContext)(c),
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
              f()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return d
          ? n.createElement(
              i.Portal,
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
                  a.Menu,
                  {
                    ...b,
                    onClose: f,
                    onKeyboardClose: g,
                    onScroll: (t) => {
                      const { onScroll: o } = e
                      o && o(t)
                    },
                    customCloseDelegate: w,
                    customRemeasureDelegate: x,
                    ref: t,
                    'data-name': y,
                    limitMaxWidth: C.setMenuMaxWidth,
                  },
                  o,
                ),
              ),
            )
          : null
      }
    },
    734602: (e, t, o) => {
      o.d(t, { useGlobalCloseOnScrollAndCustomEvents: () => l })
      var n = o(50959),
        r = o(370981)
      function l(e) {
        ;(0, n.useEffect)(() => {
          return (
            (e = i),
            window.addEventListener('scroll', e),
            () => window.removeEventListener('scroll', e)
          )
          var e
        }, []),
          (0, n.useEffect)(() => {
            if (e.length)
              return ((e, t) => {
                for (const o of e) o.subscribe(null, t)
                return () => {
                  for (const o of e) o.unsubscribe(null, t)
                }
              })(e, i)
          }, e)
      }
      function i() {
        ;(0, r.globalCloseMenu)()
      }
    },
    914090: (e, t, o) => {
      o.d(t, { TooltipPopup: () => s })
      var n = o(50959),
        r = o(624216),
        l = o(370981),
        i = o(180185),
        a = o(372605)
      const s = (0, n.forwardRef)((e, t) => {
        const {
            onClose: o,
            onForceClose: s,
            onClickOutside: c,
            className: u,
            ...p
          } = e,
          d = (0, n.useRef)(null)
        ;(0, n.useEffect)(
          () => (
            l.globalCloseDelegate.subscribe(null, s),
            () => {
              l.globalCloseDelegate.unsubscribe(null, s)
            }
          ),
          [s],
        )
        const m = (0, n.useCallback)(
            (e) => {
              27 === (0, i.hashFromEvent)(e) && (e.preventDefault(), s())
            },
            [s],
          ),
          h = (0, n.useCallback)(() => {
            d.current && d.current.focus({ preventScroll: !0 })
          }, [])
        return n.createElement(
          r.PopupMenu,
          {
            className: u,
            isOpened: !0,
            tabIndex: -1,
            reference: (e) => {
              'function' == typeof t
                ? t(e)
                : (0, a.isObject)(t) && (t.current = e),
                (d.current = e)
            },
            onClose: o,
            onClickOutside: c,
            onKeyDown: m,
            onOpen: h,
            ...p,
          },
          e.children,
        )
      })
      s.displayName = 'TooltipPopup'
    },
    742554: (e, t, o) => {
      o.d(t, { TouchScrollContainer: () => a })
      var n = o(50959),
        r = o(259142),
        l = o(650151),
        i = o(601227)
      const a = (0, n.forwardRef)((e, t) => {
        const { children: o, ...l } = e,
          a = (0, n.useRef)(null)
        return (
          (0, n.useImperativeHandle)(t, () => a.current),
          (0, n.useLayoutEffect)(() => {
            if (i.CheckMobile.iOS())
              return (
                null !== a.current &&
                  (0, r.disableBodyScroll)(a.current, { allowTouchMove: s(a) }),
                () => {
                  null !== a.current && (0, r.enableBodyScroll)(a.current)
                }
              )
          }, []),
          n.createElement('div', { ref: a, ...l }, o)
        )
      })
      function s(e) {
        return (t) => {
          const o = (0, l.ensureNotNull)(e.current),
            n = document.activeElement
          return (
            !o.contains(t) || (null !== n && o.contains(n) && n.contains(t))
          )
        }
      }
    },
    493173: (e, t, o) => {
      function n(e, t, o = {}) {
        return Object.assign(
          {},
          e,
          ((e, t, o = {}) => {
            const n = Object.assign({}, t)
            for (const r of Object.keys(t)) {
              const l = o[r] || r
              l in e && (n[r] = [e[l], t[r]].join(' '))
            }
            return n
          })(e, t, o),
        )
      }
      o.d(t, { mergeThemes: () => n })
    },
    825105: (e) => {
      e.exports = {
        drawer: 'drawer-xBKhVqal',
        drawerItem: 'drawerItem-xBKhVqal',
        menuWrap: 'menuWrap-xBKhVqal',
        scrollWrap: 'scrollWrap-xBKhVqal',
        menuBox: 'menuBox-xBKhVqal',
        card: 'card-xBKhVqal',
        cardRow: 'cardRow-xBKhVqal',
        mini: 'mini-xBKhVqal',
        fadeTop: 'fadeTop-xBKhVqal',
        fadeBottom: 'fadeBottom-xBKhVqal',
      }
    },
    895795: (e) => {
      e.exports = {
        lollipopTooltipTitle: 'lollipopTooltipTitle-hkWvPxQc',
        lollipopTooltipTitle_minimal: 'lollipopTooltipTitle_minimal-hkWvPxQc',
        lollipopTooltipTitle__title: 'lollipopTooltipTitle__title-hkWvPxQc',
        lollipopTooltipTitle_mobile: 'lollipopTooltipTitle_mobile-hkWvPxQc',
        lollipopTooltipTitle__icon: 'lollipopTooltipTitle__icon-hkWvPxQc',
      }
    },
    713668: (e) => {
      e.exports = {
        content: 'content-tm3FiOQl',
        contentWithTab: 'contentWithTab-tm3FiOQl',
        group: 'group-tm3FiOQl',
        subtitle: 'subtitle-tm3FiOQl',
        text: 'text-tm3FiOQl',
        tabsWrapper: 'tabsWrapper-tm3FiOQl',
        tabsContentWrapper: 'tabsContentWrapper-tm3FiOQl',
        groupIcon: 'groupIcon-tm3FiOQl',
        beforeMarketOpen: 'beforeMarketOpen-tm3FiOQl',
        afterMarketClose: 'afterMarketClose-tm3FiOQl',
        groupTitle: 'groupTitle-tm3FiOQl',
        groupRow: 'groupRow-tm3FiOQl',
        groupCell: 'groupCell-tm3FiOQl',
        mob: 'mob-tm3FiOQl',
        mini: 'mini-tm3FiOQl',
        generalContent: 'generalContent-tm3FiOQl',
      }
    },
    698793: (e, t, o) => {
      o.r(t), o.d(t, { showLollipopTooltip: () => Q })
      var n = o(50959),
        r = o(500962),
        l = o(650151),
        i = o(497754),
        a = o.n(i),
        s = o(683614),
        c = o(930052),
        u = o(759339),
        p = o(163694),
        d = o(914090),
        m = o(734602),
        h = o(493173),
        v = o(510618),
        f = o(72571),
        g = o(895795)
      function y(e) {
        const { title: t, icon: o, iconStyle: r, className: l, cardType: i } = e
        return n.createElement(
          'div',
          {
            className: a()(
              g.lollipopTooltipTitle,
              [
                'mob' === i && g.lollipopTooltipTitle_mobile,
                'mini' === i && g.lollipopTooltipTitle_minimal,
              ],
              l,
            ),
          },
          o &&
            n.createElement(f.Icon, {
              icon: o,
              className: g.lollipopTooltipTitle__icon,
              style: r,
            }),
          n.createElement(
            'span',
            { className: g.lollipopTooltipTitle__title },
            t,
          ),
        )
      }
      var b = o(943158)
      function w(e) {
        const { text: t, onClick: o } = e
        return n.createElement(
          b.LightButton,
          { onClick: o, size: 'xsmall' },
          ' ',
          t,
          ' ',
        )
      }
      var C,
        x = o(713668)
      function E(e) {
        const {
          name: t,
          value: o,
          style: r,
          valueStyle: l,
          onValueClick: i,
          valueRightIcon: s,
          className: c,
        } = e
        return n.createElement(
          'div',
          { className: a()(x.groupRow, c), style: r },
          t &&
            n.createElement(
              'div',
              { className: x.groupCell },
              n.createElement('span', { className: x.text }, t),
            ),
          n.createElement(
            'div',
            { className: x.groupCell },
            n.createElement(
              'span',
              { className: x.text, style: l, onClick: i },
              o,
            ),
            s &&
              n.createElement(f.Icon, {
                icon: s.iconContent,
                className: a()(
                  x.groupIcon,
                  s.iconClass,
                  'apply-common-tooltip',
                ),
                title: s.tooltipText,
              }),
          ),
        )
      }
      function k(e) {
        const { content: t = [], subTitle: o, cardRowClass: r } = e,
          l = t.map((e, t) => {
            const { title: o, content: r } = e
            return n.createElement(
              'div',
              { key: `group${t}`, className: x.group },
              o && n.createElement('span', { className: x.groupTitle }, o),
              r.map((e, t) =>
                n.createElement(E, { key: `contentRow${t}`, ...e }),
              ),
            )
          }),
          i =
            'string' == typeof o
              ? o
              : o.map((e, t) =>
                  n.createElement(E, { key: `subTitle${t}`, ...e }),
                )
        return n.createElement(
          'div',
          { className: r },
          n.createElement('span', { className: x.subtitle }, i),
          l.length > 0 && n.createElement('div', null, l),
        )
      }
      !((e) => {
        ;(e[(e.BeforeMarketOpen = x.beforeMarketOpen)] = 'BeforeMarketOpen'),
          (e[(e.AfterMarketClose = x.afterMarketClose)] = 'AfterMarketClose')
      })(C || (C = {}))
      function O(e) {
        var t
        const { cardType: o, anchor: r, title: l, tooltipIcon: i, ...s } = e,
          c = o ? a()(x.content, x[o]) : x.content,
          u = (0, n.useMemo)(() => {
            var t
            return l && i
              ? {
                  color:
                    null === (t = e.style) || void 0 === t ? void 0 : t.color,
                }
              : void 0
          }, [
            !!l,
            !!i,
            null === (t = e.style) || void 0 === t ? void 0 : t.color,
          ])
        return n.createElement(
          'div',
          { className: c },
          l &&
            n.createElement(y, {
              title: l,
              icon: i,
              iconStyle: u,
              cardType: o,
            }),
          'common' === s.type && n.createElement(k, { ...s }),
          r &&
            ('mob' !== o || !r.hideInMobileMode) &&
            n.createElement(
              'div',
              { className: x.group },
              n.createElement(w, { ...r }),
            ),
        )
      }
      var T = o(825105)
      const D = (0, h.mergeThemes)(v.DEFAULT_MENU_THEME, {
        menuWrap: T.menuWrap,
        menuBox: T.menuBox,
      })
      function N(e) {
        const {
            tooltips: t,
            onClose: o,
            onForceClose: r,
            onClickOutside: l,
            position: i,
            customCloseSubscriptions: h = [],
            showScrollFades: v,
            cardType: f,
            doNotCloseOn: g,
          } = e,
          y = (0, n.useRef)(null),
          b = (0, n.useRef)(null),
          w = (0, n.useRef)(null),
          C = (0, n.useRef)(null),
          [x, E] = (0, n.useState)('100%'),
          k = (e) => {
            null !== e && E(`${e.clientWidth}px`)
          },
          [N, S] = (0, n.useState)(!1)
        ;(0, s.useVisibility)(
          w,
          () => S(!1),
          () => S(!0),
        )
        const Q = { display: N ? 'block' : 'none', width: x },
          [B, I] = (0, n.useState)(!1)
        ;(0, s.useVisibility)(
          C,
          () => I(!1),
          () => I(!0),
        )
        const M = { display: B ? 'block' : 'none', width: x }
        ;(0, m.useGlobalCloseOnScrollAndCustomEvents)(h)
        const F = f ? a()(T.card, T[f]) : T.card
        return n.createElement(
          p.DrawerManager,
          null,
          n.createElement(
            c.MatchMedia,
            { rule: 'screen and (max-width: 419px)' },
            (e) =>
              e
                ? n.createElement(
                    u.Drawer,
                    {
                      className: T.drawer,
                      onClose: r || o,
                      position: 'Bottom',
                    },
                    t.map((e, t) =>
                      n.createElement(
                        'div',
                        { key: `${t}`, className: T.drawerItem },
                        n.createElement(O, { cardType: 'mob', ...e }),
                      ),
                    ),
                  )
                : n.createElement(
                    d.TooltipPopup,
                    {
                      position: i,
                      theme: D,
                      onClose: o,
                      onForceClose: r || o,
                      onClickOutside: l,
                      doNotCloseOn: g,
                    },
                    v &&
                      n.createElement(
                        n.Fragment,
                        null,
                        n.createElement('div', {
                          ref: y,
                          className: T.fadeTop,
                          style: Q,
                        }),
                        n.createElement('div', { ref: w }),
                      ),
                    n.createElement(
                      'div',
                      { ref: k },
                      t.map((e, t) => {
                        var o
                        return n.createElement(
                          'div',
                          {
                            key: `${t}`,
                            className: F,
                            style: {
                              borderColor:
                                null === (o = e.style) || void 0 === o
                                  ? void 0
                                  : o.color,
                            },
                          },
                          n.createElement(O, { cardType: f, ...e }),
                        )
                      }),
                    ),
                    v &&
                      n.createElement(
                        n.Fragment,
                        null,
                        n.createElement('div', { ref: C }),
                        n.createElement('div', {
                          ref: b,
                          className: T.fadeBottom,
                          style: M,
                        }),
                      ),
                  ),
          ),
        )
      }
      let S = null
      function Q(e) {
        if (!e.items.length) return () => {}
        const t = {
          tooltips: e.items,
          onClose: B,
          onForceClose: () => {
            B(), 'function' == typeof e.onCustomClose && e.onCustomClose()
          },
          onClickOutside: e.onClickOutside,
          doNotCloseOn: e.doNotCloseOn,
          position: I.bind(null, e.position),
          customCloseSubscriptions: e.customCloseSubscriptions,
          showScrollFades: e.showScrollFades,
          cardType: e.cardType,
        }
        return (
          null === S &&
            ((S = document.createElement('div')), document.body.appendChild(S)),
          r.render(n.createElement(N, { ...t }), S),
          B
        )
      }
      function B() {
        null !== S && (r.unmountComponentAtNode(S), S.remove(), (S = null))
      }
      function I(e, t) {
        const { contentWidth: o, contentHeight: n } = t,
          r = e.target,
          i = r.getBoundingClientRect(),
          a = i.width - e.targetSize.width,
          s = i.height - e.targetSize.height,
          c = (0, l.ensureNotNull)(r.closest('.chart-container')),
          u = c.getBoundingClientRect(),
          p = (0, l.ensureNotNull)(c.parentElement).getBoundingClientRect(),
          d = i.left + e.point.x + a,
          m = Math.round(d - o / 2),
          h = Math.min(m + o, u.right, p.right)
        let v,
          f,
          g = Math.max(h - o, u.left, p.left)
        g + o >= p.right && (g = p.right - o)
        const y = u.bottom - (i.top + e.point.y + s),
          b = u.height - y - e.marginTop
        return (
          b < n
            ? ((f = e.marginTop + u.top), (v = Math.max(b, 0)))
            : (f = u.height + u.top - y - n),
          { x: g, y: f, overrideHeight: v }
        )
      }
    },
    602948: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.92 7.83 9 12.29l5.08-4.46-1-1.13L9 10.29l-4.09-3.6-.99 1.14Z"/></svg>'
    },
    925931: (e, t, o) => {
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
