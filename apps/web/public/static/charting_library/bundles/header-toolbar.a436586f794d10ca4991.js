;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3005],
  {
    164553: (e) => {
      e.exports = {
        wrap: 'wrap-wXGVFOC9',
        wrapWithArrowsOuting: 'wrapWithArrowsOuting-wXGVFOC9',
        wrapOverflow: 'wrapOverflow-wXGVFOC9',
        scrollWrap: 'scrollWrap-wXGVFOC9',
        noScrollBar: 'noScrollBar-wXGVFOC9',
        icon: 'icon-wXGVFOC9',
        scrollLeft: 'scrollLeft-wXGVFOC9',
        scrollRight: 'scrollRight-wXGVFOC9',
        isVisible: 'isVisible-wXGVFOC9',
        iconWrap: 'iconWrap-wXGVFOC9',
        fadeLeft: 'fadeLeft-wXGVFOC9',
        fadeRight: 'fadeRight-wXGVFOC9',
      }
    },
    718736: (e, t, s) => {
      s.d(t, { useFunctionalRefObject: () => i })
      var n = s(50959),
        r = s(855393)
      function i(e) {
        const t = (0, n.useMemo)(
            () =>
              ((e) => {
                const t = (s) => {
                  e(s), (t.current = s)
                }
                return (t.current = null), t
              })((e) => {
                o.current(e)
              }),
            [],
          ),
          s = (0, n.useRef)(null),
          i = (t) => {
            if (null === t) return a(s.current, t), void (s.current = null)
            s.current !== e && ((s.current = e), a(s.current, t))
          },
          o = (0, n.useRef)(i)
        return (
          (o.current = i),
          (0, r.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return o.current(t.current), () => o.current(null)
          }, [e]),
          t
        )
      }
      function a(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    975228: (e, t, s) => {
      s.d(t, {
        hoverMouseEventFilter: () => i,
        useAccurateHover: () => a,
        useHover: () => r,
      })
      var n = s(50959)
      function r() {
        const [e, t] = (0, n.useState)(!1)
        return [
          e,
          {
            onMouseOver: (e) => {
              i(e) && t(!0)
            },
            onMouseOut: (e) => {
              i(e) && t(!1)
            },
          },
        ]
      }
      function i(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function a(e) {
        const [t, s] = (0, n.useState)(!1)
        return (
          (0, n.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return
              const n = e.current.contains(t.target)
              s(n)
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
    855393: (e, t, s) => {
      s.d(t, { useIsomorphicLayoutEffect: () => r })
      var n = s(50959)
      function r(e, t) {
        ;('undefined' == typeof window ? n.useEffect : n.useLayoutEffect)(e, t)
      }
    },
    664332: (e, t, s) => {
      s.d(t, { useResizeObserver: () => o })
      var n = s(50959),
        r = s(159255),
        i = s(855393),
        a = s(718736)
      function o(e, t = []) {
        const { callback: s, ref: o = null } = ((e) =>
            'function' == typeof e ? { callback: e } : e)(e),
          l = (0, n.useRef)(null),
          c = (0, n.useRef)(s)
        c.current = s
        const u = (0, a.useFunctionalRefObject)(o),
          d = (0, n.useCallback)(
            (e) => {
              u(e),
                null !== l.current &&
                  (l.current.disconnect(), null !== e && l.current.observe(e))
            },
            [u, l],
          )
        return (
          (0, i.useIsomorphicLayoutEffect)(
            () => (
              (l.current = new r.default((e, t) => {
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
    72571: (e, t, s) => {
      s.d(t, { Icon: () => r })
      var n = s(50959)
      const r = n.forwardRef((e, t) => {
        const { icon: s = '', ...r } = e
        return n.createElement('span', {
          ...r,
          ref: t,
          dangerouslySetInnerHTML: { __html: s },
        })
      })
    },
    111706: (e, t, s) => {
      function n(e) {
        return 0 === e.detail
      }
      s.d(t, { isKeyboardClick: () => n })
    },
    269842: (e, t, s) => {
      function n(...e) {
        return (t) => {
          for (const s of e) void 0 !== s && s(t)
        }
      }
      s.d(t, { createSafeMulticastEventHandler: () => n })
    },
    670086: (e, t, s) => {
      s.d(t, { FragmentMap: () => r })
      var n = s(50959)
      function r(e) {
        if (e.map) {
          return n.Children.toArray(e.children).map(e.map)
        }
        return e.children
      }
    },
    438980: (e, t, s) => {
      s.d(t, {
        Measure: () => r,
      })
      var n = s(664332)
      function r(e) {
        const { children: t, onResize: s } = e
        return t((0, n.useResizeObserver)(s || (() => {}), [null === s]))
      }
    },
    522224: (e, t, s) => {
      s.d(t, {
        hoverMouseEventFilter: () => n.hoverMouseEventFilter,
        useAccurateHover: () => n.useAccurateHover,
        useHover: () => n.useHover,
      })
      var n = s(975228)
    },
    906132: (e, t, s) => {
      var n = s(522134)
      function r() {}
      function i() {}
      ;(i.resetWarningCache = r),
        (e.exports = () => {
          function e(e, t, s, r, i, a) {
            if (a !== n) {
              var o = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types',
              )
              throw ((o.name = 'Invariant Violation'), o)
            }
          }
          function t() {
            return e
          }
          e.isRequired = e
          var s = {
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
            checkPropTypes: i,
            resetWarningCache: r,
          }
          return (s.PropTypes = s), s
        })
    },
    719036: (e, t, s) => {
      e.exports = s(906132)()
    },
    522134: (e) => {
      e.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
    },
    721043: (e) => {
      e.exports = {
        group: 'group-MBOVGQRI',
        separator: 'separator-MBOVGQRI',
        noLeftDecoration: 'noLeftDecoration-MBOVGQRI',
        noRightDecoration: 'noRightDecoration-MBOVGQRI',
        noMinimalWidth: 'noMinimalWidth-MBOVGQRI',
        separatorWrap: 'separatorWrap-MBOVGQRI',
      }
    },
    63869: (e) => {
      e.exports = { separator: 'separator-xVhBjD5m' }
    },
    120694: (e) => {
      e.exports = {
        'css-value-header-toolbar-height': '38px',
        toolbar: 'toolbar-qqNP9X6e',
        isHidden: 'isHidden-qqNP9X6e',
        overflowWrap: 'overflowWrap-qqNP9X6e',
        customButton: 'customButton-qqNP9X6e',
        hover: 'hover-qqNP9X6e',
        clicked: 'clicked-qqNP9X6e',
      }
    },
    759468: (e) => {
      e.exports = { wrap: 'wrap-_psvpUP2', icon: 'icon-_psvpUP2' }
    },
    740620: (e) => {
      e.exports = {
        'css-value-header-toolbar-height': '38px',
        innerWrap: 'innerWrap-OhqNVIYA',
        inner: 'inner-OhqNVIYA',
        fake: 'fake-OhqNVIYA',
        fill: 'fill-OhqNVIYA',
        collapse: 'collapse-OhqNVIYA',
        button: 'button-OhqNVIYA',
        iconButton: 'iconButton-OhqNVIYA',
        hidden: 'hidden-OhqNVIYA',
        content: 'content-OhqNVIYA',
        desktopPublish: 'desktopPublish-OhqNVIYA',
        mobilePublish: 'mobilePublish-OhqNVIYA',
      }
    },
    27164: (e, t, s) => {
      function n(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function r(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      s.d(t, { becomeMainElement: () => n, becomeSecondaryElement: () => r })
    },
    869194: (e, t, s) => {
      s.d(t, { useMouseClickAutoBlur: () => a })
      var n = s(50959),
        r = s(111706),
        i = s(892932)
      function a(e, t = !0) {
        ;(0, n.useEffect)(() => {
          if (!i.PLATFORM_ACCESSIBILITY_ENABLED || !t) return
          const s = (t) => {
            const s = e.current
            null !== s &&
              document.activeElement instanceof HTMLElement &&
              ((0, r.isKeyboardClick)(t) ||
                (s.contains(document.activeElement) &&
                  'INPUT' !== document.activeElement.tagName &&
                  document.activeElement.blur()))
          }
          return (
            window.addEventListener('click', s, !0),
            () => window.removeEventListener('click', s, !0)
          )
        }, [t])
      }
    },
    479289: (e, t, s) => {
      s.d(t, { INTERVALS: () => r })
      var n = s(609838)
      const r = [
        { name: '', label: n.t(null, { context: 'interval' }, s(537830)) },
        { name: 'H', label: n.t(null, { context: 'interval' }, s(705285)) },
        { name: 'D', label: n.t(null, { context: 'interval' }, s(306174)) },
        { name: 'W', label: n.t(null, { context: 'interval' }, s(725042)) },
        { name: 'M', label: n.t(null, { context: 'interval' }, s(179410)) },
      ]
    },
    622614: (e, t, s) => {
      s.d(t, { Toolbar: () => d })
      var n = s(50959),
        r = s(650151),
        i = s(269842),
        a = s(930202),
        o = s(892932),
        l = s(27164),
        c = s(718736),
        u = s(869194)
      const d = (0, n.forwardRef)((e, t) => {
        const {
            onKeyDown: s,
            orientation: d,
            blurOnEscKeydown: h = !0,
            blurOnClick: m = !0,
            ...p
          } = e,
          v = o.PLATFORM_ACCESSIBILITY_ENABLED
            ? { role: 'toolbar', 'aria-orientation': d }
            : {},
          f = (0, c.useFunctionalRefObject)(t)
        return (
          (0, n.useLayoutEffect)(() => {
            if (!o.PLATFORM_ACCESSIBILITY_ENABLED) return
            const e = (0, r.ensureNotNull)(f.current),
              t = () => {
                const t = (0, o.queryTabbableElements)(e).sort(
                  o.navigationOrderComparator,
                )
                if (0 === t.length) {
                  const [t] = (0, o.queryFocusableElements)(e).sort(
                    o.navigationOrderComparator,
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
          (0, u.useMouseClickAutoBlur)(f, m),
          n.createElement('div', {
            ...p,
            ...v,
            ref: f,
            onKeyDown: (0, i.createSafeMulticastEventHandler)((e) => {
              if (!o.PLATFORM_ACCESSIBILITY_ENABLED) return
              if (e.defaultPrevented) return
              if (!(document.activeElement instanceof HTMLElement)) return
              const t = (0, a.hashFromEvent)(e)
              if (h && 27 === t)
                return e.preventDefault(), void document.activeElement.blur()
              if ('vertical' !== d && 37 !== t && 39 !== t) return
              if ('vertical' === d && 38 !== t && 40 !== t) return
              const s = e.currentTarget,
                n = (0, o.queryFocusableElements)(s).sort(
                  o.navigationOrderComparator,
                )
              if (0 === n.length) return
              const r = n.indexOf(document.activeElement)
              if (-1 === r) return
              e.preventDefault()
              const i = () => {
                  const e = (r + n.length - 1) % n.length
                  ;(0, l.becomeSecondaryElement)(n[r]),
                    (0, l.becomeMainElement)(n[e]),
                    n[e].focus()
                },
                c = () => {
                  const e = (r + n.length + 1) % n.length
                  ;(0, l.becomeSecondaryElement)(n[r]),
                    (0, l.becomeMainElement)(n[e]),
                    n[e].focus()
                }
              switch ((0, o.mapKeyCodeToDirection)(t)) {
                case 'inlinePrev':
                  'vertical' !== d && i()
                  break
                case 'inlineNext':
                  'vertical' !== d && c()
                  break
                case 'blockPrev':
                  'vertical' === d && i()
                  break
                case 'blockNext':
                  'vertical' === d && c()
              }
            }, s),
          })
        )
      })
    },
    325154: (e, t, s) => {
      s.r(t), s.d(t, { HeaderToolbarRenderer: () => Le })
      var n = s(50959),
        r = s(500962),
        i = s(650151),
        a = s(497754),
        o = s.n(a),
        l = s(685459),
        c = s.n(l),
        u = s(343370),
        d = s(156963),
        h = s(559410),
        m = s(719036),
        p = s(972535),
        v = s(670086),
        f = s(63869)
      function g(e) {
        return n.createElement('div', {
          className: o()(f.separator, e.className),
        })
      }
      var S = s(721043)
      function y(e) {
        const {
          children: t,
          className: s,
          noLeftDecoration: r,
          noRightDecoration: i,
          noMinimalWidth: o,
          onClick: l,
          removeSeparator: c,
        } = e
        return n.createElement(
          n.Fragment,
          null,
          !c &&
            n.createElement(
              'div',
              { className: S.separatorWrap },
              n.createElement(g, { className: S.separator }),
            ),
          n.createElement(
            'div',
            {
              className: a(s, S.group, {
                [S.noMinimalWidth]: o,
                [S.noLeftDecoration]: r,
                [S.noRightDecoration]: i,
              }),
              onClick: l,
            },
            t,
          ),
        )
      }
      var _ = s(438980),
        E = s(609838),
        b = s(72571),
        C = s(759468),
        w = s(245820)
      const M = { text: E.t(null, void 0, s(255646)) }
      function I(e) {
        return n.createElement(
          'div',
          { className: C.wrap },
          n.createElement(b.Icon, { className: C.icon, icon: w }),
          M.text,
        )
      }
      var k = s(350136),
        R = s(49630),
        V = s(710263),
        L = s(661380),
        F = s(164553)
      const O = {
        isVisibleScrollbar: !0,
        shouldMeasure: !0,
        hideButtonsFrom: 1,
      }
      function T(e) {
        return n.createElement('div', {
          className: a(F.fadeLeft, e.className, { [F.isVisible]: e.isVisible }),
        })
      }
      function W(e) {
        return n.createElement('div', {
          className: a(F.fadeRight, e.className, {
            [F.isVisible]: e.isVisible,
          }),
        })
      }
      function N(e) {
        return n.createElement(B, { ...e, className: F.scrollLeft })
      }
      function A(e) {
        return n.createElement(B, { ...e, className: F.scrollRight })
      }
      function B(e) {
        return n.createElement(
          'div',
          {
            className: a(e.className, { [F.isVisible]: e.isVisible }),
            onClick: e.onClick,
          },
          n.createElement(
            'div',
            { className: F.iconWrap },
            n.createElement(b.Icon, { icon: L, className: F.icon }),
          ),
        )
      }
      const D = ((e = N, t = A, s = T, r = W) => {
        var o
        return (
          ((o = class extends n.PureComponent {
            constructor(e) {
              super(e),
                (this._scroll = n.createRef()),
                (this._handleScrollLeft = () => {
                  if (this.props.onScrollButtonClick)
                    return void this.props.onScrollButtonClick('left')
                  const e =
                    this.props.scrollStepSize || this.state.widthWrap - 50
                  this.animateTo(Math.max(0, this.currentPosition() - e))
                }),
                (this._handleScrollRight = () => {
                  if (this.props.onScrollButtonClick)
                    return void this.props.onScrollButtonClick('right')
                  const e =
                    this.props.scrollStepSize || this.state.widthWrap - 50
                  this.animateTo(
                    Math.min(
                      (this.state.widthContent || 0) -
                        (this.state.widthWrap || 0),
                      this.currentPosition() + e,
                    ),
                  )
                }),
                (this._handleResizeWrap = ([e]) => {
                  const t = e.target.getBoundingClientRect()
                  this.props.onMeasureWrap && this.props.onMeasureWrap(t),
                    this.setState({ widthWrap: t.width }),
                    this._checkButtonsVisibility()
                }),
                (this._handleResizeContent = ([e]) => {
                  const t = e.target.getBoundingClientRect()
                  this.props.onMeasureContent && this.props.onMeasureContent(t)
                  const {
                    shouldDecreaseWidthContent: s,
                    buttonsWidthIfDecreasedWidthContent: n,
                  } = this.props
                  s && n
                    ? this.setState({ widthContent: t.width + 2 * n })
                    : this.setState({ widthContent: t.width })
                }),
                (this._handleScroll = () => {
                  const { onScroll: e } = this.props
                  e &&
                    e(
                      this.currentPosition(),
                      this.isAtLeft(),
                      this.isAtRight(),
                    ),
                    this._checkButtonsVisibility()
                }),
                (this._checkButtonsVisibility = () => {
                  const { isVisibleLeftButton: e, isVisibleRightButton: t } =
                      this.state,
                    s = this.isAtLeft(),
                    n = this.isAtRight()
                  s || e
                    ? s && e && this.setState({ isVisibleLeftButton: !1 })
                    : this.setState({ isVisibleLeftButton: !0 }),
                    n || t
                      ? n && t && this.setState({ isVisibleRightButton: !1 })
                      : this.setState({ isVisibleRightButton: !0 })
                }),
                (this.state = {
                  widthContent: 0,
                  widthWrap: 0,
                  isVisibleRightButton: !1,
                  isVisibleLeftButton: !1,
                })
            }
            componentDidMount() {
              this._checkButtonsVisibility()
            }
            componentDidUpdate(e, t) {
              ;(t.widthWrap === this.state.widthWrap &&
                t.widthContent === this.state.widthContent) ||
                this._handleScroll()
            }
            currentPosition() {
              return this._scroll.current
                ? (0, V.isRtl)()
                  ? (0, V.getLTRScrollLeft)(this._scroll.current)
                  : this._scroll.current.scrollLeft
                : 0
            }
            isAtLeft() {
              return (
                !this._isOverflowed() ||
                this.currentPosition() <=
                  (0, i.ensureDefined)(this.props.hideButtonsFrom)
              )
            }
            isAtRight() {
              return (
                !this._isOverflowed() ||
                this.currentPosition() + this.state.widthWrap >=
                  this.state.widthContent -
                    (0, i.ensureDefined)(this.props.hideButtonsFrom)
              )
            }
            animateTo(e, t = R.dur) {
              const s = this._scroll.current
              s &&
                ((0, V.isRtl)() && (e = (0, V.getLTRScrollLeftOffset)(s, e)),
                t <= 0
                  ? (s.scrollLeft = Math.round(e))
                  : (0, k.doAnimate)({
                      onStep(e, t) {
                        s.scrollLeft = Math.round(t)
                      },
                      from: s.scrollLeft,
                      to: Math.round(e),
                      easing: R.easingFunc.easeInOutCubic,
                      duration: t,
                    }))
            }
            render() {
              const {
                  children: i,
                  isVisibleScrollbar: o,
                  isVisibleFade: l,
                  isVisibleButtons: c,
                  shouldMeasure: u,
                  shouldDecreaseWidthContent: d,
                  buttonsWidthIfDecreasedWidthContent: h,
                  onMouseOver: m,
                  onMouseOut: p,
                  scrollWrapClassName: v,
                  fadeClassName: f,
                } = this.props,
                { isVisibleRightButton: g, isVisibleLeftButton: S } =
                  this.state,
                y = d && h
              return n.createElement(
                _.Measure,
                { onResize: u ? this._handleResizeWrap : null },
                (d) =>
                  n.createElement(
                    'div',
                    {
                      className: F.wrapOverflow,
                      onMouseOver: m,
                      onMouseOut: p,
                      ref: d,
                    },
                    n.createElement(
                      'div',
                      { className: a(F.wrap, y ? F.wrapWithArrowsOuting : '') },
                      n.createElement(
                        'div',
                        {
                          className: a(F.scrollWrap, v, {
                            [F.noScrollBar]: !o,
                          }),
                          onScroll: this._handleScroll,
                          ref: this._scroll,
                        },
                        n.createElement(
                          _.Measure,
                          { onResize: u ? this._handleResizeContent : null },
                          i,
                        ),
                      ),
                      l && n.createElement(s, { isVisible: S, className: f }),
                      l && n.createElement(r, { isVisible: g, className: f }),
                      c &&
                        n.createElement(e, {
                          onClick: this._handleScrollLeft,
                          isVisible: S,
                        }),
                      c &&
                        n.createElement(t, {
                          onClick: this._handleScrollRight,
                          isVisible: g,
                        }),
                    ),
                  ),
              )
            }
            _isOverflowed() {
              const { widthContent: e, widthWrap: t } = this.state
              return e > t
            }
          }).defaultProps = O),
          o
        )
      })(N, A, T, W)
      var P,
        x = s(199663)
      !((e) => {
        ;(e.SymbolSearch = 'header-toolbar-symbol-search'),
          (e.Intervals = 'header-toolbar-intervals'),
          (e.ChartStyles = 'header-toolbar-chart-styles'),
          (e.Compare = 'header-toolbar-compare'),
          (e.Indicators = 'header-toolbar-indicators'),
          (e.StudyTemplates = 'header-toolbar-study-templates'),
          (e.Dropdown = 'header-toolbar-dropdown'),
          (e.Alerts = 'header-toolbar-alerts'),
          (e.Layouts = 'header-toolbar-layouts'),
          (e.SaveLoad = 'header-toolbar-save-load'),
          (e.UndoRedo = 'header-toolbar-undo-redo'),
          (e.Properties = 'header-toolbar-properties'),
          (e.QuickSearch = 'header-toolbar-quick-search'),
          (e.PublishDesktop = 'header-toolbar-publish-desktop'),
          (e.PublishMobile = 'header-toolbar-publish-mobile'),
          (e.Fullscreen = 'header-toolbar-fullscreen'),
          (e.Screenshot = 'header-toolbar-screenshot'),
          (e.Replay = 'header-toolbar-replay'),
          (e.Financials = 'header-toolbar-financials')
      })(P || (P = {}))
      var z = s(522224),
        H = s(261401),
        q = s(622614),
        G = s(892932),
        X = s(740620)
      const Y = (0, H.registryContextType)(),
        U = d.enabled('widget')
      class j extends n.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._handleMouseOver = (e) => {
              ;(0, z.hoverMouseEventFilter)(e) &&
                this.setState({ isHovered: !0 })
            }),
            (this._handleMouseOut = (e) => {
              ;(0, z.hoverMouseEventFilter)(e) &&
                this.setState({ isHovered: !1 })
            }),
            (this._handleInnerResize = ([e]) => {
              const t = e.contentRect.width,
                { onWidthChange: s } = this.props
              s && s(t)
            }),
            (this._handleMeasureAvailableSpace = (e) => {
              const { onAvailableSpaceChange: t } = this.props
              t && t(e.width)
            }),
            (this._processCustoms = (e) => {
              const { isFake: t, displayMode: s } = this.props,
                { tools: r } = this.context
              return e.map((e) =>
                n.createElement(
                  y,
                  { key: e.id },
                  ((e) => {
                    switch (e.type) {
                      case 'Button':
                        return n.createElement(r.Custom, {
                          ...e.params,
                          isFake: t,
                        })
                      case 'TradingViewStyledButton':
                        return n.createElement(
                          r.CustomTradingViewStyledButton,
                          { ...e.params, className: X.button, displayMode: s },
                        )
                      case 'Dropdown':
                        return n.createElement(r.Dropdown, {
                          displayMode: s,
                          params: e.params,
                        })
                      default:
                        return null
                    }
                  })(e),
                ),
              )
            }),
            (this._fixLastGroup = (e, t, s) => {
              if (t === s.length - 1 && n.isValidElement(e) && e.type === y) {
                const t =
                  void 0 !== this.context.tools.Publish && !this.props.readOnly
                return n.cloneElement(e, { noRightDecoration: t })
              }
              return e
            }),
            (0, H.validateRegistry)(t, { tools: m.any.isRequired }),
            (this.state = { isHovered: !1 })
        }
        render() {
          const { tools: e } = this.context,
            {
              features: t,
              displayMode: s,
              chartSaver: r,
              studyMarket: i,
              readOnly: o,
              saveLoadSyncEmitter: l,
              leftCustomElements: c,
              rightCustomElements: u,
              showScrollbarWhen: d,
              isFake: h = !1,
            } = this.props,
            { isHovered: m } = this.state,
            f = this._processCustoms(c),
            g = this._processCustoms(u),
            S = d.includes(s)
          return n.createElement(
            q.Toolbar,
            {
              className: a(X.inner, { [X.fake]: h }),
              onContextMenu: x.preventDefaultForContextMenu,
              'data-is-fake-main-panel': h,
              'aria-hidden': G.PLATFORM_ACCESSIBILITY_ENABLED ? h : void 0,
            },
            n.createElement(
              D,
              {
                isVisibleFade: p.mobiletouch && S,
                isVisibleButtons: !p.mobiletouch && S && m,
                isVisibleScrollbar: !1,
                shouldMeasure: !h,
                onMouseOver: this._handleMouseOver,
                onMouseOut: this._handleMouseOut,
                onMeasureWrap: this._handleMeasureAvailableSpace,
              },
              (c) =>
                n.createElement(
                  'div',
                  {
                    className: X.content,
                    ref: c,
                    role: G.PLATFORM_ACCESSIBILITY_ENABLED ? 'none' : void 0,
                  },
                  n.createElement(
                    _.Measure,
                    { onResize: h ? this._handleInnerResize : null },
                    (c) =>
                      n.createElement(
                        'div',
                        { className: X.innerWrap, ref: c },
                        n.createElement(
                          v.FragmentMap,
                          { map: this._fixLastGroup },
                          !o &&
                            n.Children.toArray([
                              (e.SymbolSearch || (!U && e.Compare)) &&
                                n.createElement(
                                  y,
                                  { key: 'symbol' },
                                  e.SymbolSearch &&
                                    n.createElement(e.SymbolSearch, {
                                      id: h ? void 0 : P.SymbolSearch,
                                      isActionsVisible:
                                        t.allowSymbolSearchSpread,
                                    }),
                                  e.Compare &&
                                    n.createElement(e.Compare, {
                                      id: h ? void 0 : P.Compare,
                                      className: X.button,
                                      displayMode: s,
                                    }),
                                ),
                              e.DateRange &&
                                n.createElement(
                                  y,
                                  { key: 'range' },
                                  n.createElement(e.DateRange, null),
                                ),
                              e.Intervals &&
                                n.createElement(
                                  y,
                                  { key: 'intervals' },
                                  n.createElement(e.Intervals, {
                                    id: h ? void 0 : P.Intervals,
                                    isShownQuicks: t.allowFavoriting,
                                    isFavoritingAllowed: t.allowFavoriting,
                                    displayMode: s,
                                    isFake: h,
                                  }),
                                ),
                              e.Bars &&
                                n.createElement(
                                  y,
                                  { key: 'styles' },
                                  n.createElement(e.Bars, {
                                    id: h ? void 0 : P.ChartStyles,
                                    isShownQuicks: t.allowFavoriting,
                                    isFavoritingAllowed: t.allowFavoriting,
                                    displayMode: s,
                                    isFake: h,
                                  }),
                                ),
                              U &&
                                e.Compare &&
                                !e.SymbolSearch &&
                                n.createElement(
                                  y,
                                  { key: 'compare' },
                                  n.createElement(e.Compare, {
                                    id: h ? void 0 : P.Compare,
                                    className: X.button,
                                    displayMode: s,
                                  }),
                                ),
                              e.Indicators &&
                                n.createElement(
                                  y,
                                  { key: 'indicators' },
                                  n.createElement(e.Indicators, {
                                    id: h ? void 0 : P.Indicators,
                                    className: X.button,
                                    studyMarket: i,
                                    displayMode: s,
                                  }),
                                  e.Templates &&
                                    n.createElement(e.Templates, {
                                      id: h ? void 0 : P.StudyTemplates,
                                      isShownQuicks: t.allowFavoriting,
                                      isFavoritingAllowed: t.allowFavoriting,
                                      displayMode: s,
                                    }),
                                ),
                              e.Alert &&
                                n.createElement(
                                  y,
                                  { key: 'alert' },
                                  n.createElement(e.Alert, {
                                    id: h ? void 0 : P.Alerts,
                                    className: X.button,
                                    displayMode: s,
                                  }),
                                  e.Replay &&
                                    n.createElement(e.Replay, {
                                      id: h ? void 0 : P.Replay,
                                      className: X.button,
                                      displayMode: s,
                                    }),
                                ),
                              e.AlertReferral &&
                                n.createElement(
                                  y,
                                  { key: 'alert-referral' },
                                  n.createElement(e.AlertReferral, {
                                    className: X.button,
                                    displayMode: s,
                                  }),
                                ),
                              e.ScalePercentage &&
                                n.createElement(
                                  y,
                                  { key: 'percentage' },
                                  n.createElement(e.ScalePercentage, null),
                                ),
                              e.ScaleLogarithm &&
                                n.createElement(
                                  y,
                                  { key: 'logarithm' },
                                  n.createElement(e.ScaleLogarithm, null),
                                ),
                              ...f,
                            ]),
                          ((e) => {
                            const t = e.findIndex(
                              (e) =>
                                n.isValidElement(e) &&
                                !!e.key &&
                                -1 !==
                                  e.key.toString().indexOf('view-only-badge'),
                            )
                            return (
                              [t]
                                .filter((e) => e >= 0)
                                .forEach((t) => {
                                  e = n.Children.map(e, (e, s) => {
                                    if (n.isValidElement(e)) {
                                      switch ([t - 1, t, t + 1].indexOf(s)) {
                                        case 0:
                                          const t = { noRightDecoration: !0 }
                                          e = n.cloneElement(e, t)
                                          break
                                        case 1:
                                          const s = {
                                            noLeftDecoration: !0,
                                            noRightDecoration: !0,
                                          }
                                          e = n.cloneElement(e, s)
                                          break
                                        case 2:
                                          const r = { noLeftDecoration: !0 }
                                          e = n.cloneElement(e, r)
                                      }
                                    }
                                    return e
                                  })
                                }),
                              e
                            )
                          })(
                            n.Children.toArray([
                              o &&
                                n.createElement(
                                  y,
                                  {
                                    key: 'view-only-badge',
                                    removeSeparator: !0,
                                  },
                                  n.createElement(I, null),
                                ),
                              !o &&
                                e.UndoRedo &&
                                n.createElement(
                                  y,
                                  { key: 'undo-redo' },
                                  n.createElement(e.UndoRedo, {
                                    id: h ? void 0 : P.UndoRedo,
                                  }),
                                ),
                              n.createElement(y, {
                                removeSeparator: !0,
                                key: 'gap-1',
                                className: a(X.fill, h && X.collapse),
                              }),
                              (e.Layout || e.SaveLoad) &&
                                n.createElement(
                                  y,
                                  { key: 'layout', removeSeparator: !0 },
                                  !o &&
                                    e.Layout &&
                                    n.createElement(e.Layout, {
                                      id: h ? void 0 : P.Layouts,
                                    }),
                                  e.SaveLoad &&
                                    n.createElement(e.SaveLoad, {
                                      id: h ? void 0 : P.SaveLoad,
                                      chartSaver: r,
                                      isReadOnly: o,
                                      displayMode: s,
                                      isFake: h,
                                      stateSyncEmitter: l,
                                    }),
                                ),
                              e.SaveLoadReferral &&
                                n.createElement(
                                  y,
                                  { key: 'save-load-referral' },
                                  n.createElement(e.SaveLoadReferral, {
                                    isReadOnly: o,
                                    displayMode: s,
                                  }),
                                ),
                              t.showLaunchInPopupButton &&
                                e.OpenPopup &&
                                n.createElement(
                                  y,
                                  { key: 'popup' },
                                  n.createElement(e.OpenPopup, null),
                                ),
                              !o &&
                                (e.Properties ||
                                  e.Fullscreen ||
                                  (!U && e.Screenshot)) &&
                                n.createElement(
                                  y,
                                  { key: 'properties' },
                                  !o &&
                                    e.QuickSearch &&
                                    n.createElement(e.QuickSearch, {
                                      id: h ? void 0 : P.QuickSearch,
                                      className: X.iconButton,
                                    }),
                                  !o &&
                                    e.Properties &&
                                    n.createElement(e.Properties, {
                                      id: h ? void 0 : P.Properties,
                                      className: X.iconButton,
                                    }),
                                  n.createElement(
                                    n.Fragment,
                                    null,
                                    !o &&
                                      e.Fullscreen &&
                                      n.createElement(
                                        y,
                                        {
                                          key: 'fullscreen',
                                          onClick:
                                            this._trackFullscreenButtonClick,
                                          removeSeparator: !0,
                                        },
                                        n.createElement(e.Fullscreen, {
                                          id: h ? void 0 : P.Fullscreen,
                                        }),
                                      ),
                                    !U &&
                                      e.Screenshot &&
                                      n.createElement(e.Screenshot, {
                                        id: h ? void 0 : P.Screenshot,
                                        className: X.iconButton,
                                      }),
                                  ),
                                ),
                              U &&
                                !o &&
                                e.Fullscreen &&
                                n.createElement(
                                  y,
                                  {
                                    key: 'fullscreen',
                                    onClick: this._trackFullscreenButtonClick,
                                    removeSeparator: !0,
                                  },
                                  n.createElement(e.Fullscreen, {
                                    id: h ? void 0 : P.Fullscreen,
                                  }),
                                ),
                              U &&
                                e.Screenshot &&
                                n.createElement(
                                  y,
                                  { key: 'screenshot', removeSeparator: !0 },
                                  n.createElement(e.Screenshot, {
                                    id: h ? void 0 : P.Screenshot,
                                    className: X.iconButton,
                                  }),
                                ),
                              !o &&
                                e.Publish &&
                                n.createElement(
                                  y,
                                  {
                                    key: 'publish',
                                    className: X.mobilePublish,
                                    removeSeparator: !0,
                                  },
                                  n.createElement(e.Publish, {
                                    id: h ? void 0 : P.PublishMobile,
                                  }),
                                ),
                              ...g,
                            ]),
                          ),
                        ),
                      ),
                  ),
                ),
            ),
            e.Publish &&
              !o &&
              !h &&
              n.createElement(e.Publish, {
                id: P.PublishDesktop,
                className: X.desktopPublish,
              }),
          )
        }
        _trackFullscreenButtonClick() {
          0
        }
      }
      j.contextType = Y
      var K = s(650802),
        Q = s(584776)
      class J extends Q.CommonJsonStoreService {
        constructor(e, t, s = []) {
          super(e, t, 'FAVORITE_CHART_STYLES_CHANGED', 'StyleWidget.quicks', s)
        }
      }
      var $ = s(739343),
        Z = s(992741)
      class ee extends Q.AbstractJsonStoreService {
        constructor(e, t, s) {
          super(e, t, 'FAVORITE_INTERVALS_CHANGED', 'IntervalWidget.quicks', s)
        }
        _serialize(e) {
          return (0, Z.uniq)(e.map($.normalizeIntervalString))
        }
        _deserialize(e) {
          return (0, Z.uniq)(
            (0, $.convertResolutionsFromSettings)(e)
              .filter($.isResolutionMultiplierValid)
              .map($.normalizeIntervalString),
          )
        }
      }
      var te = s(688401),
        se = s(466052),
        ne = s(870122),
        re = s(717866)
      class ie extends Q.AbstractJsonStoreService {
        constructor(e, t, s = []) {
          super(e, t, 'CUSTOM_INTERVALS_CHANGED', 'IntervalWidget.intervals', s)
        }
        set(e, t) {
          e.length, this.get().length, super.set(e, t)
        }
        _serialize(e) {
          return (0, Z.uniq)(e.map($.normalizeIntervalString))
        }
        _deserialize(e) {
          return (0, Z.uniq)(
            (0, $.convertResolutionsFromSettings)(e)
              .filter($.isResolutionMultiplierValid)
              .map($.normalizeIntervalString),
          )
        }
      }
      const ae = new ie(re.TVXWindowEvents, ne)
      var oe = s(479289)
      class le {
        constructor(e) {
          ;(this._customIntervalsService = ae),
            (this._supportedIntervalsMayChange = new se.Delegate()),
            (this._fireSupportedIntervalsMayChange = () => {
              this._supportedIntervalsMayChange.fire()
            }),
            (this._chartApiInstance = e),
            te.linking.supportedResolutions.subscribe(
              this._fireSupportedIntervalsMayChange,
            ),
            te.linking.range.subscribe(this._fireSupportedIntervalsMayChange),
            te.linking.seconds.subscribe(this._fireSupportedIntervalsMayChange),
            te.linking.ticks.subscribe(this._fireSupportedIntervalsMayChange),
            te.linking.intraday.subscribe(
              this._fireSupportedIntervalsMayChange,
            ),
            te.linking.dataFrequencyResolution.subscribe(
              this._fireSupportedIntervalsMayChange,
            )
        }
        destroy() {
          te.linking.supportedResolutions.unsubscribe(
            this._fireSupportedIntervalsMayChange,
          ),
            te.linking.range.unsubscribe(this._fireSupportedIntervalsMayChange),
            te.linking.seconds.unsubscribe(
              this._fireSupportedIntervalsMayChange,
            ),
            te.linking.ticks.unsubscribe(this._fireSupportedIntervalsMayChange),
            te.linking.intraday.unsubscribe(
              this._fireSupportedIntervalsMayChange,
            ),
            te.linking.dataFrequencyResolution.unsubscribe(
              this._fireSupportedIntervalsMayChange,
            )
        }
        getDefaultIntervals() {
          return null === this._chartApiInstance
            ? []
            : this._chartApiInstance
                .defaultResolutions()
                .map($.normalizeIntervalString)
        }
        getCustomIntervals() {
          return this._customIntervalsService.get()
        }
        add(e, t, s) {
          if (!this.isValidInterval(e, t)) return null
          const n = (0, $.normalizeIntervalString)(`${e}${t}`),
            r = this.getCustomIntervals()
          return this._isIntervalDefault(n) || r.includes(n)
            ? null
            : (this._customIntervalsService.set(
                (0, $.sortResolutions)([...r, n]),
              ),
              n)
        }
        remove(e) {
          this._customIntervalsService.set(
            this.getCustomIntervals().filter((t) => t !== e),
          )
        }
        isValidInterval(e, t) {
          return (0, $.isResolutionMultiplierValid)(`${e}${t}`)
        }
        isSupportedInterval(e) {
          return (0, $.isAvailable)(e)
        }
        supportedIntervalsMayChange() {
          return this._supportedIntervalsMayChange
        }
        getOnChange() {
          return this._customIntervalsService.getOnChange()
        }
        getPossibleIntervals() {
          return oe.INTERVALS
        }
        getResolutionUtils() {
          return {
            getMaxResolutionValue: $.getMaxResolutionValue,
            getTranslatedResolutionModel: $.getTranslatedResolutionModel,
            mergeResolutions: $.mergeResolutions,
            sortResolutions: $.sortResolutions,
          }
        }
        _isIntervalDefault(e) {
          return this.getDefaultIntervals().includes(e)
        }
      }
      var ce = s(632863),
        ue = s(771737),
        de = s(29257)
      const he = {}
      let me = null
      class pe {
        constructor(e = ne) {
          ;(this._favorites = []),
            (this._favoritesChanged = new se.Delegate()),
            (this._settings = e),
            re.TVXWindowEvents.on('StudyFavoritesChanged', (e) => {
              const t = JSON.parse(e)
              this._loadFromState(t.favorites || [])
            }),
            this._settings.onSync.subscribe(this, this._loadFavs),
            this._loadFavs()
        }
        isFav(e) {
          const t = this.favId(e)
          return -1 !== this._findFavIndex(t)
        }
        toggleFavorite(e) {
          this.isFav(e) ? this.removeFavorite(e) : this.addFavorite(e)
        }
        addFavorite(e) {
          const t = this.favId(e)
          this._favorites.push(fe(t)),
            this._favoritesChanged.fire(t),
            this._saveFavs()
        }
        removeFavorite(e) {
          const t = this.favId(e),
            s = this._findFavIndex(t)
          ;-1 !== s &&
            (this._favorites.splice(s, 1), this._favoritesChanged.fire(t)),
            this._saveFavs()
        }
        favId(e) {
          return (0, de.isPineIdString)(e)
            ? e
            : (0, de.extractPineId)(e) || (0, ue.extractStudyId)(e)
        }
        favorites() {
          return this._favorites
        }
        favoritePineIds() {
          return this._favorites
            .filter((e) => 'pine' === e.type)
            .map((e) => e.pineId)
        }
        favoritesChanged() {
          return this._favoritesChanged
        }
        static getInstance() {
          return null === me && (me = new pe()), me
        }
        static create(e) {
          return new pe(e)
        }
        _loadFavs() {
          const e = this._settings.getJSON('studyMarket.favorites', [])
          this._loadFromState(e)
        }
        _saveFavs() {
          const e = this._stateToSave()
          this._settings.setJSON('studyMarket.favorites', e, {
            forceFlush: !0,
          }),
            re.TVXWindowEvents.emit(
              'StudyFavoritesChanged',
              JSON.stringify({ favorites: e }),
            )
        }
        _stateToSave() {
          return this._favorites.map(ve)
        }
        _loadFromState(e) {
          ;(this._favorites = e.map((e) =>
            fe(((e) => (e in he ? he[e] : e))(e)),
          )),
            this._favoritesChanged.fire()
        }
        _findFavIndex(e) {
          return this._favorites.findIndex((t) => e === ve(t))
        }
      }
      function ve(e) {
        return 'java' === e.type ? e.studyId : e.pineId
      }
      function fe(e) {
        return (0, de.isPineIdString)(e)
          ? { type: 'pine', pineId: e }
          : { type: 'java', studyId: e }
      }
      var ge = s(628589)
      const Se = {
        [ge.ResolutionKind.Ticks]: !1,
        [ge.ResolutionKind.Seconds]: !1,
        [ge.ResolutionKind.Minutes]: !1,
        [ge.SpecialResolutionKind.Hours]: !1,
        [ge.ResolutionKind.Days]: !1,
        [ge.ResolutionKind.Range]: !1,
      }
      class ye extends Q.CommonJsonStoreService {
        constructor(e, t, s = Se) {
          super(
            e,
            t,
            'INTERVALS_MENU_VIEW_STATE_CHANGED',
            'IntervalWidget.menu.viewState',
            s,
          )
        }
        isAllowed(e) {
          return Object.keys(Se).includes(e)
        }
      }
      var _e = s(868649)
      const Ee = {
          Area: 3,
          'HLC area': 16,
          Bars: 0,
          Candles: 1,
          'Heiken Ashi': 8,
          'Hollow Candles': 9,
          Line: 2,
          Renko: 4,
          Kagi: 5,
          'Point & figure': 6,
          'Line Break': 7,
          Baseline: 10,
          LineWithMarkers: 14,
          Stepline: 15,
          Columns: 13,
          'High-low': 12,
        },
        be = ['1', '30', '60']
      function Ce(e = []) {
        let t = e.map((e) => Ee[e]) || [1, 4, 5, 6]
        return d.enabled('widget') && (t = [0, 1, 3]), t
      }
      function we(e = []) {
        return (0, $.mergeResolutions)(
          e,
          d.enabled('star_some_intervals_by_default') ? be : [],
        )
      }
      new ee(re.TVXWindowEvents, ne, we()),
        new J(re.TVXWindowEvents, ne, Ce()),
        new _e.FavoriteStudyTemplateService(re.TVXWindowEvents, ne)
      const Me = {
        tools: m.any.isRequired,
        isFundamental: m.any,
        chartApiInstance: m.any,
        availableTimeFrames: m.any,
        chartWidgetCollection: m.any,
        windowMessageService: m.any,
        favoriteChartStylesService: m.any,
        favoriteIntervalsService: m.any,
        intervalService: m.any,
        favoriteStudyTemplatesService: m.any,
        studyTemplates: m.any,
        chartChangesWatcher: m.any,
        saveChartService: m.any,
        sharingChartService: m.any,
        loadChartService: m.any,
        chartWidget: m.any,
        favoriteScriptsModel: m.any,
        intervalsMenuViewStateService: m.any,
        templatesMenuViewStateService: m.any,
        openGlobalSearch: m.any,
        snapshotUrl: m.any,
      }
      var Ie = s(98454),
        ke = s(120694)
      const Re = []
      class Ve extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._saveLoadSyncEmitter = new (c())()),
            (this._handleFullWidthChange = (e) => {
              ;(this._fullWidth = e), this.setState({ measureValid: !1 })
            }),
            (this._handleFavoritesWidthChange = (e) => {
              ;(this._favoritesWidth = e), this.setState({ measureValid: !1 })
            }),
            (this._handleCollapseWidthChange = (e) => {
              ;(this._collapseWidth = e), this.setState({ measureValid: !1 })
            }),
            (this._handleMeasure = (e) => {
              this.setState({ availableWidth: e, measureValid: !1 })
            })
          const {
            tools: t,
            windowMessageService: s,
            chartWidgetCollection: n,
            chartApiInstance: r,
            availableTimeFrames: a,
            isFundamental: o,
            favoriteIntervalsService: l,
            favoriteChartStylesService: h,
            favoriteStudyTemplatesService: m,
            studyTemplates: p,
            saveChartService: v,
            sharingChartService: f,
            loadChartService: g,
            snapshotUrl: S,
            openGlobalSearch: y,
          } = e
          ;(this._showScrollbarWhen = (0, i.ensureDefined)(
            e.allowedModes,
          ).slice(-1)),
            (this._panelWidthChangeHandlers = {
              full: this._handleFullWidthChange,
              medium: this._handleFavoritesWidthChange,
              small: this._handleCollapseWidthChange,
            })
          const { chartChangesWatcher: _ } = e
          this._chartChangesWatcher = _
          const E = Ce(this.props.defaultFavoriteStyles)
          this._favoriteChartStylesService =
            h || new J(re.TVXWindowEvents, ne, E)
          const b = we(this.props.defaultFavoriteIntervals)
          ;(this._favoriteIntervalsService =
            l || new ee(re.TVXWindowEvents, ne, b)),
            (this._intervalsMenuViewStateService = new ye(
              re.TVXWindowEvents,
              ne,
            )),
            (this._intervalService = new le(r)),
            (this._registry = {
              tools: t,
              isFundamental: o,
              chartWidgetCollection: n,
              windowMessageService: s,
              chartApiInstance: r,
              availableTimeFrames: a,
              favoriteStudyTemplatesService: m,
              studyTemplates: p,
              saveChartService: v,
              sharingChartService: f,
              loadChartService: g,
              intervalsMenuViewStateService:
                this._intervalsMenuViewStateService,
              favoriteChartStylesService: this._favoriteChartStylesService,
              favoriteIntervalsService: this._favoriteIntervalsService,
              intervalService: this._intervalService,
              chartChangesWatcher: this._chartChangesWatcher,
              chartWidget: n.activeChartWidget.value(),
              favoriteScriptsModel: pe.getInstance(),
              templatesMenuViewStateService:
                this._templatesMenuVuewStateService,
              snapshotUrl: S,
              openGlobalSearch: y,
            }),
            (this.state = {
              isVisible: !0,
              availableWidth: 0,
              displayMode: 'full',
              measureValid: !1,
              leftCustomElements: [],
              rightCustomElements: [],
            }),
            (this._readOnly = n.readOnly()),
            (this._features = {
              allowFavoriting: d.enabled('items_favoriting'),
              showIdeasButton: Boolean(this.props.ideas),
              showLaunchInPopupButton: Boolean(this.props.popupButton),
              allowSymbolSearchSpread:
                d.enabled('header_symbol_search') &&
                d.enabled('show_spread_operators'),
              allowToolbarHiding: d.enabled('collapsible_header'),
            }),
            (this._setDisplayMode = (0, u.default)(this._setDisplayMode, 100)),
            this._negotiateResizer()
        }
        componentDidUpdate(e, t) {
          const { isVisible: s, measureValid: n } = this.state
          s !== t.isVisible &&
            (h.emit('toggle_header', s), this._negotiateResizer()),
            n || this._setDisplayMode()
        }
        render() {
          const { resizerBridge: e, allowedModes: t, ...s } = this.props,
            {
              displayMode: r,
              isVisible: o,
              leftCustomElements: l,
              rightCustomElements: c,
            } = this.state,
            u = {
              features: this._features,
              readOnly: this._readOnly,
              isFake: !1,
              saveLoadSyncEmitter: this._saveLoadSyncEmitter,
              leftCustomElements: l,
              rightCustomElements: c,
              ...s,
            },
            d = { ...u, isFake: !0, showScrollbarWhen: Re },
            h = (0, i.ensureDefined)(t),
            m = this.props.tools.PublishButtonManager || n.Fragment
          return n.createElement(
            H.RegistryProvider,
            { value: this._registry, validation: Me },
            n.createElement(
              m,
              null,
              n.createElement(
                'div',
                {
                  className: a(ke.toolbar, { [ke.isHidden]: !o }),
                  onClick: this.props.onClick,
                },
                n.createElement(
                  'div',
                  { className: ke.overflowWrap },
                  h.map((e) =>
                    n.createElement(j, {
                      key: e,
                      displayMode: e,
                      onWidthChange: this._panelWidthChangeHandlers[e],
                      ...d,
                    }),
                  ),
                  n.createElement(j, {
                    key: 'live',
                    showScrollbarWhen: this._showScrollbarWhen,
                    displayMode: r,
                    onAvailableSpaceChange: this._handleMeasure,
                    ...u,
                  }),
                ),
              ),
            ),
          )
        }
        addButton(e, t) {
          if (!t.useTradingViewStyle)
            return this._addCustomHTMLButton(e, t.align)
          this._addCustomTradingViewStyledButton(e, t)
        }
        addDropdown(e, t) {
          const { leftCustomElements: s, rightCustomElements: n } = this.state,
            r = { type: 'Dropdown', id: e, params: t }
          'left' === t.align
            ? this.setState({ leftCustomElements: [...s, r] })
            : this.setState({ rightCustomElements: [...n, r] })
        }
        updateDropdown(e, t) {
          const s = (t) => 'Dropdown' === t.type && t.id === e,
            n =
              this.state.leftCustomElements.find(s) ||
              this.state.rightCustomElements.find(s)
          void 0 !== n &&
            ((n.params = { ...n.params, ...t }),
            this.setState({
              leftCustomElements: this.state.leftCustomElements.slice(),
              rightCustomElements: this.state.rightCustomElements.slice(),
            }))
        }
        removeDropdown(e) {
          const t = (t) => 'Dropdown' === t.type && t.id !== e,
            s = this.state.leftCustomElements.filter(t),
            n = this.state.rightCustomElements.filter(t)
          this.setState({ leftCustomElements: s, rightCustomElements: n })
        }
        _negotiateResizer() {
          this.props.resizerBridge.negotiateHeight(
            this.state.isVisible
              ? ce.HEADER_TOOLBAR_HEIGHT_EXPANDED
              : ce.HEADER_TOOLBAR_HEIGHT_COLLAPSED,
          )
        }
        _setDisplayMode() {
          const { availableWidth: e } = this.state,
            { allowedModes: t } = this.props,
            s = {
              full: this._fullWidth,
              medium: this._favoritesWidth,
              small: this._collapseWidth,
            },
            n = (0, i.ensureDefined)(t)
          let r = n.map((e) => s[e]).findIndex((t) => e >= t)
          ;-1 === r && (r = n.length - 1)
          const a = n[r]
          this.setState({ measureValid: !0, displayMode: a })
        }
        _addCustomHTMLButton(e, t = 'left') {
          const s = new K.WatchedValue(0),
            n = (0, Ie.parseHtmlElement)(
              `<div class="apply-common-tooltip ${ke.customButton}">`,
            ),
            r = {
              type: 'Button',
              id: e,
              params: { key: Number(new Date()), element: n, width: s },
            }
          return this._addCustomElementToState(t, r), n
        }
        _addCustomTradingViewStyledButton(e, t) {
          const s = {
            type: 'TradingViewStyledButton',
            id: e,
            params: {
              key: Number(new Date()),
              text: t.text,
              title: t.title,
              onClick: t.onClick,
            },
          }
          this._addCustomElementToState(t.align, s)
        }
        _addCustomElementToState(e, t) {
          const { leftCustomElements: s, rightCustomElements: n } = this.state
          'left' === e
            ? this.setState({ leftCustomElements: [...s, t] })
            : this.setState({ rightCustomElements: [...n, t] })
        }
      }
      Ve.defaultProps = { allowedModes: ['full', 'medium'] }
      class Le {
        constructor(e, t) {
          ;(this._component = null),
            (this._handleRef = (e) => {
              this._component = e
            }),
            (this._container = e),
            r.render(
              n.createElement(Ve, { ...t, ref: this._handleRef }),
              this._container,
            )
        }
        destroy() {
          r.unmountComponentAtNode(this._container)
        }
        getComponent() {
          return (0, i.ensureNotNull)(this._component)
        }
      }
    },
    261401: (e, t, s) => {
      s.d(t, {
        RegistryProvider: () => l,
        registryContextType: () => c,
        validateRegistry: () => o,
      })
      var n = s(50959),
        r = s(719036),
        i = s.n(r)
      const a = n.createContext({})
      function o(e, t) {
        i().checkPropTypes(t, e, 'context', 'RegistryContext')
      }
      function l(e) {
        const { validation: t, value: s } = e
        return o(s, t), n.createElement(a.Provider, { value: s }, e.children)
      }
      function c() {
        return a
      }
    },
    661380: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" width="20" height="10"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M2 1l8 8 8-8"/></svg>'
    },
    245820: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.56 14a10.05 10.05 0 00.52.91c.41.69 1.04 1.6 1.85 2.5C8.58 19.25 10.95 21 14 21c3.05 0 5.42-1.76 7.07-3.58A17.18 17.18 0 0023.44 14a9.47 9.47 0 00-.52-.91c-.41-.69-1.04-1.6-1.85-2.5C19.42 8.75 17.05 7 14 7c-3.05 0-5.42 1.76-7.07 3.58A17.18 17.18 0 004.56 14zM24 14l.45-.21-.01-.03a7.03 7.03 0 00-.16-.32c-.11-.2-.28-.51-.5-.87-.44-.72-1.1-1.69-1.97-2.65C20.08 7.99 17.45 6 14 6c-3.45 0-6.08 2-7.8 3.92a18.18 18.18 0 00-2.64 3.84v.02h-.01L4 14l-.45-.21-.1.21.1.21L4 14l-.45.21.01.03a5.85 5.85 0 00.16.32c.11.2.28.51.5.87.44.72 1.1 1.69 1.97 2.65C7.92 20.01 10.55 22 14 22c3.45 0 6.08-2 7.8-3.92a18.18 18.18 0 002.64-3.84v-.02h.01L24 14zm0 0l.45.21.1-.21-.1-.21L24 14zm-10-3a3 3 0 100 6 3 3 0 000-6zm-4 3a4 4 0 118 0 4 4 0 01-8 0z"/></svg>'
    },
    306174: (e) => {
      e.exports = {
        ar: ['أيام'],
        ca_ES: ['dies'],
        cs: 'days',
        de: ['Tage'],
        el: 'days',
        en: 'days',
        es: ['días'],
        fa: 'days',
        fr: ['jours'],
        he_IL: ['ימים'],
        hu_HU: ['nap'],
        id_ID: ['hari'],
        it: ['giorni'],
        ja: ['日'],
        ko: ['날'],
        ms_MY: ['hari'],
        nl_NL: 'days',
        pl: ['dni'],
        pt: ['dias'],
        ro: 'days',
        ru: ['дни'],
        sv: ['dagar'],
        th: ['วัน'],
        tr: ['gün'],
        vi: ['ngày'],
        zh: ['日'],
        zh_TW: ['天'],
      }
    },
    705285: (e) => {
      e.exports = {
        ar: ['ساعات'],
        ca_ES: ['hores'],
        cs: 'hours',
        de: ['Stunden'],
        el: 'hours',
        en: 'hours',
        es: ['horas'],
        fa: 'hours',
        fr: ['heures'],
        he_IL: ['שעות'],
        hu_HU: ['óra'],
        id_ID: ['jam'],
        it: ['ore'],
        ja: ['時間'],
        ko: ['시'],
        ms_MY: ['jam'],
        nl_NL: 'hours',
        pl: ['godziny'],
        pt: ['horas'],
        ro: 'hours',
        ru: ['часы'],
        sv: ['timmar'],
        th: ['ชั่วโมง'],
        tr: ['saat'],
        vi: ['giờ'],
        zh: ['小时'],
        zh_TW: ['小時'],
      }
    },
    179410: (e) => {
      e.exports = {
        ar: ['شهور'],
        ca_ES: ['mesos'],
        cs: 'months',
        de: ['Monate'],
        el: 'months',
        en: 'months',
        es: ['meses'],
        fa: 'months',
        fr: ['mois'],
        he_IL: ['חודשים'],
        hu_HU: ['hónap'],
        id_ID: ['bulan'],
        it: ['mesi'],
        ja: ['月'],
        ko: ['달'],
        ms_MY: ['bulan'],
        nl_NL: 'months',
        pl: ['miesiące'],
        pt: ['meses'],
        ro: 'months',
        ru: ['месяцы'],
        sv: ['månader'],
        th: ['เดือน'],
        tr: ['ay'],
        vi: ['tháng'],
        zh: ['个月'],
        zh_TW: ['個月'],
      }
    },
    537830: (e) => {
      e.exports = {
        ar: ['دقائق'],
        ca_ES: ['minuts'],
        cs: 'minutes',
        de: ['Minuten'],
        el: 'minutes',
        en: 'minutes',
        es: ['minutos'],
        fa: 'minutes',
        fr: 'minutes',
        he_IL: ['דקות'],
        hu_HU: ['perc'],
        id_ID: ['menit'],
        it: ['minuti'],
        ja: ['分'],
        ko: ['분'],
        ms_MY: ['minit'],
        nl_NL: 'minutes',
        pl: ['minuty'],
        pt: ['minutos'],
        ro: 'minutes',
        ru: ['минуты'],
        sv: ['minuter'],
        th: ['นาที'],
        tr: ['dakika'],
        vi: ['phút'],
        zh: ['分钟'],
        zh_TW: ['分鐘'],
      }
    },
    725042: (e) => {
      e.exports = {
        ar: ['أسابيع'],
        ca_ES: ['setmanes'],
        cs: 'weeks',
        de: ['Wochen'],
        el: 'weeks',
        en: 'weeks',
        es: ['semanas'],
        fa: 'weeks',
        fr: ['semaines'],
        he_IL: ['שבועות'],
        hu_HU: ['hét'],
        id_ID: ['minggu'],
        it: ['settimane'],
        ja: ['週'],
        ko: ['주'],
        ms_MY: ['minggu'],
        nl_NL: 'weeks',
        pl: ['tygodnie'],
        pt: ['semanas'],
        ro: 'weeks',
        ru: ['недели'],
        sv: ['veckor'],
        th: ['สัปดาห์'],
        tr: ['hafta'],
        vi: ['tuần'],
        zh: ['周'],
        zh_TW: ['周'],
      }
    },
    255646: (e) => {
      e.exports = {
        ar: ['وضع العرض فقط'],
        ca_ES: ['Mode només lectura'],
        cs: 'View Only Mode',
        de: ['Ansichtsmodus'],
        el: 'View Only Mode',
        en: 'View Only Mode',
        es: ['Modo sólo lectura'],
        fa: 'View Only Mode',
        fr: ['Mode Voir uniquement'],
        he_IL: ['מצב תצוגה בלבד'],
        hu_HU: 'View Only Mode',
        id_ID: ['Mode Hanya Melihat'],
        it: ['Modalità di sola visualizzazione'],
        ja: ['表示専用モード'],
        ko: ['뷰 온리 모드'],
        ms_MY: ['Mod Lihat Sahaja'],
        nl_NL: 'View Only Mode',
        pl: ['Tryb Podglądu'],
        pt: ['Modo de Visualização'],
        ro: 'View Only Mode',
        ru: ['Режим "Только просмотр"'],
        sv: ['Endast visningsläge'],
        th: ['โหมดแบบดูอย่างเดียว'],
        tr: ['Sadece Görme Modu'],
        vi: ['Chế độ chỉ xem'],
        zh: ['仅查看模式'],
        zh_TW: ['僅查看模式'],
      }
    },
  },
])
