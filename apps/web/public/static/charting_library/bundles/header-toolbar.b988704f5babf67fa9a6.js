;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3005],
  {
    97754: (e, t) => {
      var n
      !(() => {
        var r = {}.hasOwnProperty
        function s() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t]
            if (n) {
              var i = typeof n
              if ('string' === i || 'number' === i) e.push(n)
              else if (Array.isArray(n) && n.length) {
                var a = s.apply(null, n)
                a && e.push(a)
              } else if ('object' === i)
                for (var o in n) r.call(n, o) && n[o] && e.push(o)
            }
          }
          return e.join(' ')
        }
        e.exports
          ? ((s.default = s), (e.exports = s))
          : void 0 === (n = (() => s).apply(t, [])) || (e.exports = n)
      })()
    },
    46913: (e) => {
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
    39416: (e, t, n) => {
      n.d(t, { useFunctionalRefObject: () => i })
      var r = n(50959),
        s = n(43010)
      function i(e) {
        const t = (0, r.useMemo)(
            () =>
              ((e) => {
                const t = (n) => {
                  e(n), (t.current = n)
                }
                return (t.current = null), t
              })((e) => {
                o.current(e)
              }),
            [],
          ),
          n = (0, r.useRef)(null),
          i = (t) => {
            if (null === t) return a(n.current, t), void (n.current = null)
            n.current !== e && ((n.current = e), a(n.current, t))
          },
          o = (0, r.useRef)(i)
        return (
          (o.current = i),
          (0, s.useIsomorphicLayoutEffect)(() => {
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
    43010: (e, t, n) => {
      n.d(t, { useIsomorphicLayoutEffect: () => s })
      var r = n(50959)
      function s(e, t) {
        ;('undefined' == typeof window ? r.useEffect : r.useLayoutEffect)(e, t)
      }
    },
    67842: (e, t, n) => {
      n.d(t, { useResizeObserver: () => a })
      var r = n(50959),
        s = n(43010),
        i = n(39416)
      function a(e, t = []) {
        const { callback: n, ref: a = null } = ((e) =>
            'function' == typeof e ? { callback: e } : e)(e),
          o = (0, r.useRef)(null),
          l = (0, r.useRef)(n)
        l.current = n
        const c = (0, i.useFunctionalRefObject)(a),
          u = (0, r.useCallback)(
            (e) => {
              c(e),
                null !== o.current &&
                  (o.current.disconnect(), null !== e && o.current.observe(e))
            },
            [c, o],
          )
        return (
          (0, s.useIsomorphicLayoutEffect)(
            () => (
              (o.current = new ResizeObserver((e, t) => {
                l.current(e, t)
              })),
              c.current && u(c.current),
              () => {
                o.current?.disconnect()
              }
            ),
            [c, ...t],
          ),
          u
        )
      }
    },
    9745: (e, t, n) => {
      n.d(t, { Icon: () => s })
      var r = n(50959)
      const s = r.forwardRef((e, t) => {
        const {
            icon: n = '',
            title: s,
            ariaLabel: i,
            ariaLabelledby: a,
            ariaHidden: o,
            ...l
          } = e,
          c = !!(s || i || a)
        return r.createElement('span', {
          role: 'img',
          ...l,
          ref: t,
          'aria-label': i,
          'aria-labelledby': a,
          'aria-hidden': o || !c,
          title: s,
          dangerouslySetInnerHTML: { __html: n },
        })
      })
    },
    47201: (e, t, n) => {
      function r(...e) {
        return (t) => {
          for (const n of e) void 0 !== n && n(t)
        }
      }
      n.d(t, { createSafeMulticastEventHandler: () => r })
    },
    42142: (e, t, n) => {
      n.d(t, { FragmentMap: () => s })
      var r = n(50959)
      function s(e) {
        if (e.map) {
          return r.Children.toArray(e.children).map(e.map)
        }
        return e.children
      }
    },
    45601: (e, t, n) => {
      n.d(t, { Measure: () => s })
      var r = n(67842)
      function s(e) {
        const { children: t, onResize: n } = e
        return t((0, r.useResizeObserver)(n || (() => {}), [null === n]))
      }
    },
    70412: (e, t, n) => {
      n.d(t, {
        hoverMouseEventFilter: () => i,
        useAccurateHover: () => a,
        useHover: () => s,
      })
      var r = n(50959)
      function s() {
        const [e, t] = (0, r.useState)(!1)
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
        const [t, n] = (0, r.useState)(!1)
        return (
          (0, r.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return
              const r = e.current.contains(t.target)
              n(r)
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
    6132: (e, t, n) => {
      var r = n(22134)
      function s() {}
      function i() {}
      ;(i.resetWarningCache = s),
        (e.exports = () => {
          function e(e, t, n, s, i, a) {
            if (a !== r) {
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
          var n = {
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
            resetWarningCache: s,
          }
          return (n.PropTypes = n), n
        })
    },
    19036: (e, t, n) => {
      e.exports = n(6132)()
    },
    22134: (e) => {
      e.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
    },
    13818: (e) => {
      e.exports = {
        group: 'group-MBOVGQRI',
        separator: 'separator-MBOVGQRI',
        noLeftDecoration: 'noLeftDecoration-MBOVGQRI',
        noRightDecoration: 'noRightDecoration-MBOVGQRI',
        noMinimalWidth: 'noMinimalWidth-MBOVGQRI',
        separatorWrap: 'separatorWrap-MBOVGQRI',
      }
    },
    32169: (e) => {
      e.exports = { separator: 'separator-xVhBjD5m' }
    },
    58312: (e) => {
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
    87730: (e) => {
      e.exports = { wrap: 'wrap-_psvpUP2', icon: 'icon-_psvpUP2' }
    },
    8297: (e) => {
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
    57177: (e, t, n) => {
      var r
      function s(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function i(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      n.d(t, { becomeMainElement: () => s, becomeSecondaryElement: () => i }),
        ((e) => {
          ;(e.MainElement = 'roving-tabindex:main-element'),
            (e.SecondaryElement = 'roving-tabindex:secondary-element')
        })(r || (r = {}))
    },
    42014: (e, t, n) => {
      n.d(t, { INTERVALS: () => s })
      var r = n(11542)
      const s = [
        { name: '', label: r.t(null, { context: 'interval' }, n(79930)) },
        { name: 'H', label: r.t(null, { context: 'interval' }, n(35157)) },
        { name: 'D', label: r.t(null, { context: 'interval' }, n(23970)) },
        { name: 'W', label: r.t(null, { context: 'interval' }, n(7938)) },
        {
          name: 'M',
          label: r.t(null, { context: 'interval' }, n(18193)),
        },
      ]
    },
    6190: (e, t, n) => {
      n.d(t, { Toolbar: () => d })
      var r = n(50959),
        s = n(50151),
        i = n(47201),
        a = n(3343),
        o = n(19291),
        l = n(57177),
        c = n(39416),
        u = n(7047)
      const d = (0, r.forwardRef)((e, t) => {
        const {
            onKeyDown: n,
            orientation: d,
            blurOnEscKeydown: h = !0,
            blurOnClick: m = !0,
            ...p
          } = e,
          v = (0, c.useFunctionalRefObject)(t)
        return (
          (0, r.useLayoutEffect)(() => {
            const e = (0, s.ensureNotNull)(v.current),
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
          r.createElement('div', {
            ...u.MouseClickAutoBlurHandler.attributes(m),
            ...p,
            role: 'toolbar',
            'aria-orientation': d,
            ref: v,
            onKeyDown: (0, i.createSafeMulticastEventHandler)((e) => {
              if (e.defaultPrevented) return
              if (!(document.activeElement instanceof HTMLElement)) return
              const t = (0, a.hashFromEvent)(e)
              if (h && 27 === t)
                return e.preventDefault(), void document.activeElement.blur()
              if ('vertical' !== d && 37 !== t && 39 !== t) return
              if ('vertical' === d && 38 !== t && 40 !== t) return
              const n = e.currentTarget,
                r = (0, o.queryFocusableElements)(n).sort(
                  o.navigationOrderComparator,
                )
              if (0 === r.length) return
              const s = r.indexOf(document.activeElement)
              if (-1 === s) return
              e.preventDefault()
              const i = () => {
                  const e = (s + r.length - 1) % r.length
                  ;(0, l.becomeSecondaryElement)(r[s]),
                    (0, l.becomeMainElement)(r[e]),
                    r[e].focus()
                },
                c = () => {
                  const e = (s + r.length + 1) % r.length
                  ;(0, l.becomeSecondaryElement)(r[s]),
                    (0, l.becomeMainElement)(r[e]),
                    r[e].focus()
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
            }, n),
            'data-tooltip-show-on-focus': 'true',
          })
        )
      })
    },
    39214: (e, t, n) => {
      n.r(t), n.d(t, { HeaderToolbarRenderer: () => Fe })
      var r = n(50959),
        s = n(32227),
        i = n(50151),
        a = n(97754),
        o = n.n(a),
        l = n(85459),
        c = n.n(l),
        u = n(20057),
        d = n(83873),
        h = n(63193),
        m = n(56570),
        p = n(76422),
        v = n(19036),
        f = n(32563),
        g = n(42142),
        S = n(32169)
      function b(e) {
        return r.createElement('div', {
          className: o()(S.separator, e.className),
        })
      }
      var y = n(13818)
      function C(e) {
        const {
          children: t,
          className: n,
          noLeftDecoration: s,
          noRightDecoration: i,
          noMinimalWidth: o,
          onClick: l,
          removeSeparator: c,
        } = e
        return r.createElement(
          r.Fragment,
          null,
          !c &&
            r.createElement(
              'div',
              { className: y.separatorWrap },
              r.createElement(b, { className: y.separator }),
            ),
          r.createElement(
            'div',
            {
              className: a(n, y.group, {
                [y.noMinimalWidth]: o,
                [y.noLeftDecoration]: s,
                [y.noRightDecoration]: i,
              }),
              onClick: l,
            },
            t,
          ),
        )
      }
      var E = n(45601),
        _ = n(11542),
        w = n(9745),
        M = n(87730),
        R = n(45820)
      const k = { text: _.t(null, void 0, n(48161)) }
      function I(e) {
        return r.createElement(
          'div',
          { className: M.wrap },
          r.createElement(w.Icon, { className: M.icon, icon: R }),
          k.text,
        )
      }
      var V = n(61119),
        F = n(78871),
        O = n(63273),
        W = n(61380),
        L = n(46913)
      const N = {
        isVisibleScrollbar: !0,
        shouldMeasure: !0,
        hideButtonsFrom: 1,
      }
      function T(e) {
        return r.createElement('div', {
          className: a(L.fadeLeft, e.className, { [L.isVisible]: e.isVisible }),
        })
      }
      function B(e) {
        return r.createElement('div', {
          className: a(L.fadeRight, e.className, {
            [L.isVisible]: e.isVisible,
          }),
        })
      }
      function A(e) {
        return r.createElement(x, { ...e, className: L.scrollLeft })
      }
      function D(e) {
        return r.createElement(x, { ...e, className: L.scrollRight })
      }
      function x(e) {
        return r.createElement(
          'div',
          {
            className: a(e.className, { [L.isVisible]: e.isVisible }),
            onClick: e.onClick,
          },
          r.createElement(
            'div',
            { className: L.iconWrap },
            r.createElement(w.Icon, { icon: W, className: L.icon }),
          ),
        )
      }
      const P = ((e = A, t = D, n = T, s = B) => {
        var o
        return (
          ((o = class extends r.PureComponent {
            constructor(e) {
              super(e),
                (this._scroll = r.createRef()),
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
                    shouldDecreaseWidthContent: n,
                    buttonsWidthIfDecreasedWidthContent: r,
                  } = this.props
                  n && r
                    ? this.setState({ widthContent: t.width + 2 * r })
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
                    n = this.isAtLeft(),
                    r = this.isAtRight()
                  n || e
                    ? n && e && this.setState({ isVisibleLeftButton: !1 })
                    : this.setState({ isVisibleLeftButton: !0 }),
                    r || t
                      ? r && t && this.setState({ isVisibleRightButton: !1 })
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
                ? (0, O.isRtl)()
                  ? (0, O.getLTRScrollLeft)(this._scroll.current)
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
            animateTo(e, t = F.dur) {
              const n = this._scroll.current
              n &&
                ((0, O.isRtl)() && (e = (0, O.getLTRScrollLeftOffset)(n, e)),
                t <= 0
                  ? (n.scrollLeft = Math.round(e))
                  : (0, V.doAnimate)({
                      onStep(e, t) {
                        n.scrollLeft = Math.round(t)
                      },
                      from: n.scrollLeft,
                      to: Math.round(e),
                      easing: F.easingFunc.easeInOutCubic,
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
                b = d && h
              return r.createElement(
                E.Measure,
                { onResize: u ? this._handleResizeWrap : null },
                (d) =>
                  r.createElement(
                    'div',
                    {
                      className: L.wrapOverflow,
                      onMouseOver: m,
                      onMouseOut: p,
                      ref: d,
                    },
                    r.createElement(
                      'div',
                      { className: a(L.wrap, b ? L.wrapWithArrowsOuting : '') },
                      r.createElement(
                        'div',
                        {
                          className: a(L.scrollWrap, v, {
                            [L.noScrollBar]: !o,
                          }),
                          onScroll: this._handleScroll,
                          ref: this._scroll,
                        },
                        r.createElement(
                          E.Measure,
                          { onResize: u ? this._handleResizeContent : null },
                          i,
                        ),
                      ),
                      l && r.createElement(n, { isVisible: S, className: f }),
                      l && r.createElement(s, { isVisible: g, className: f }),
                      c &&
                        r.createElement(e, {
                          onClick: this._handleScrollLeft,
                          isVisible: S,
                        }),
                      c &&
                        r.createElement(t, {
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
          }).defaultProps = N),
          o
        )
      })(A, D, T, B)
      var H,
        q = n(14729)
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
      })(H || (H = {}))
      var z = n(70412),
        G = n(77151),
        X = n(6190),
        U = n(8297)
      const Q = (0, G.registryContextType)(),
        Y = m.enabled('widget')
      class j extends r.PureComponent {
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
                { onWidthChange: n } = this.props
              n && n(t)
            }),
            (this._handleMeasureAvailableSpace = (e) => {
              const { onAvailableSpaceChange: t } = this.props
              t && t(e.width)
            }),
            (this._processCustoms = (e) => {
              const { isFake: t, displayMode: n } = this.props,
                { tools: s } = this.context
              return e.map((e) =>
                r.createElement(
                  C,
                  { key: e.id },
                  ((e) => {
                    switch (e.type) {
                      case 'Button':
                        return r.createElement(s.Custom, {
                          ...e.params,
                          isFake: t,
                        })
                      case 'TradingViewStyledButton':
                        return r.createElement(
                          s.CustomTradingViewStyledButton,
                          { ...e.params, className: U.button, displayMode: n },
                        )
                      case 'Dropdown':
                        return r.createElement(s.Dropdown, {
                          displayMode: n,
                          params: e.params,
                        })
                      default:
                        return null
                    }
                  })(e),
                ),
              )
            }),
            (this._fixLastGroup = (e, t, n) => {
              if (t === n.length - 1 && r.isValidElement(e) && e.type === C) {
                const t =
                  void 0 !== this.context.tools.Publish && !this.props.readOnly
                return r.cloneElement(e, { noRightDecoration: t })
              }
              return e
            }),
            (0, G.validateRegistry)(t, { tools: v.any.isRequired }),
            (this.state = { isHovered: !1 })
        }
        render() {
          const { tools: e } = this.context,
            {
              features: t,
              displayMode: n,
              chartSaver: s,
              studyMarket: i,
              readOnly: o,
              saveLoadSyncEmitter: l,
              leftCustomElements: c,
              rightCustomElements: u,
              showScrollbarWhen: d,
              isFake: h = !1,
            } = this.props,
            { isHovered: p } = this.state,
            v = this._processCustoms(c),
            S = this._processCustoms(u),
            b = d.includes(n)
          return r.createElement(
            X.Toolbar,
            {
              className: a(U.inner, { [U.fake]: h }),
              onContextMenu: q.preventDefaultForContextMenu,
              'data-is-fake-main-panel': h,
              'aria-hidden': h,
            },
            r.createElement(
              P,
              {
                isVisibleFade: f.mobiletouch && b,
                isVisibleButtons: !f.mobiletouch && b && p,
                isVisibleScrollbar: !1,
                shouldMeasure: !h,
                onMouseOver: this._handleMouseOver,
                onMouseOut: this._handleMouseOut,
                onMeasureWrap: this._handleMeasureAvailableSpace,
              },
              (c) =>
                r.createElement(
                  'div',
                  { className: U.content, ref: c, role: 'none' },
                  r.createElement(
                    E.Measure,
                    { onResize: h ? this._handleInnerResize : null },
                    (c) =>
                      r.createElement(
                        'div',
                        { className: U.innerWrap, ref: c },
                        r.createElement(
                          g.FragmentMap,
                          { map: this._fixLastGroup },
                          !o &&
                            r.Children.toArray([
                              (e.SymbolSearch || (!Y && e.Compare)) &&
                                r.createElement(
                                  C,
                                  { key: 'symbol' },
                                  e.SymbolSearch &&
                                    r.createElement(e.SymbolSearch, {
                                      id: h ? void 0 : H.SymbolSearch,
                                      isActionsVisible:
                                        t.allowSymbolSearchSpread,
                                    }),
                                  e.Compare &&
                                    r.createElement(e.Compare, {
                                      id: h ? void 0 : H.Compare,
                                      className: U.button,
                                      displayMode: n,
                                    }),
                                ),
                              e.DateRange &&
                                r.createElement(
                                  C,
                                  { key: 'range' },
                                  r.createElement(e.DateRange, null),
                                ),
                              e.Intervals &&
                                r.createElement(
                                  C,
                                  { key: 'intervals' },
                                  r.createElement(e.Intervals, {
                                    id: h ? void 0 : H.Intervals,
                                    isShownQuicks: t.allowFavoriting,
                                    isFavoritingAllowed: t.allowFavoriting,
                                    displayMode: n,
                                    isFake: h,
                                  }),
                                ),
                              e.Bars &&
                                r.createElement(
                                  C,
                                  { key: 'styles' },
                                  r.createElement(e.Bars, {
                                    id: h ? void 0 : H.ChartStyles,
                                    isShownQuicks: t.allowFavoriting,
                                    isFavoritingAllowed: t.allowFavoriting,
                                    displayMode: n,
                                    isFake: h,
                                  }),
                                ),
                              Y &&
                                e.Compare &&
                                !e.SymbolSearch &&
                                r.createElement(
                                  C,
                                  { key: 'compare' },
                                  r.createElement(e.Compare, {
                                    id: h ? void 0 : H.Compare,
                                    className: U.button,
                                    displayMode: n,
                                  }),
                                ),
                              e.Indicators &&
                                r.createElement(
                                  C,
                                  { key: 'indicators' },
                                  r.createElement(e.Indicators, {
                                    id: h ? void 0 : H.Indicators,
                                    className: U.button,
                                    studyMarket: i,
                                    displayMode: n,
                                  }),
                                  e.Templates &&
                                    r.createElement(e.Templates, {
                                      id: h ? void 0 : H.StudyTemplates,
                                      isShownQuicks: t.allowFavoriting,
                                      isFavoritingAllowed: t.allowFavoriting,
                                      displayMode: n,
                                    }),
                                ),
                              e.Alert &&
                                r.createElement(
                                  C,
                                  { key: 'alert' },
                                  r.createElement(e.Alert, {
                                    id: h ? void 0 : H.Alerts,
                                    className: U.button,
                                    displayMode: n,
                                  }),
                                  e.Replay &&
                                    r.createElement(e.Replay, {
                                      id: h ? void 0 : H.Replay,
                                      className: U.button,
                                      displayMode: n,
                                    }),
                                ),
                              e.AlertReferral &&
                                !m.enabled('hide_alert_referral_tool') &&
                                r.createElement(
                                  C,
                                  { key: 'alert-referral' },
                                  r.createElement(e.AlertReferral, {
                                    className: U.button,
                                    displayMode: n,
                                  }),
                                ),
                              e.ScalePercentage &&
                                r.createElement(
                                  C,
                                  { key: 'percentage' },
                                  r.createElement(e.ScalePercentage, null),
                                ),
                              e.ScaleLogarithm &&
                                r.createElement(
                                  C,
                                  { key: 'logarithm' },
                                  r.createElement(e.ScaleLogarithm, null),
                                ),
                              ...v,
                            ]),
                          ((e) => {
                            const t = e.findIndex(
                              (e) =>
                                r.isValidElement(e) &&
                                !!e.key &&
                                -1 !==
                                  e.key.toString().indexOf('view-only-badge'),
                            )
                            return (
                              [t]
                                .filter((e) => e >= 0)
                                .forEach((t) => {
                                  e = r.Children.map(e, (e, n) => {
                                    if (r.isValidElement(e)) {
                                      switch ([t - 1, t, t + 1].indexOf(n)) {
                                        case 0:
                                          const t = { noRightDecoration: !0 }
                                          e = r.cloneElement(e, t)
                                          break
                                        case 1:
                                          const n = {
                                            noLeftDecoration: !0,
                                            noRightDecoration: !0,
                                          }
                                          e = r.cloneElement(e, n)
                                          break
                                        case 2:
                                          const s = { noLeftDecoration: !0 }
                                          e = r.cloneElement(e, s)
                                      }
                                    }
                                    return e
                                  })
                                }),
                              e
                            )
                          })(
                            r.Children.toArray([
                              o &&
                                r.createElement(
                                  C,
                                  {
                                    key: 'view-only-badge',
                                    removeSeparator: !0,
                                  },
                                  r.createElement(I, null),
                                ),
                              !o &&
                                e.UndoRedo &&
                                r.createElement(
                                  C,
                                  { key: 'undo-redo' },
                                  r.createElement(e.UndoRedo, {
                                    id: h ? void 0 : H.UndoRedo,
                                  }),
                                ),
                              r.createElement(C, {
                                removeSeparator: !0,
                                key: 'gap-1',
                                className: a(U.fill, h && U.collapse),
                              }),
                              (e.Layout || e.SaveLoad) &&
                                r.createElement(
                                  C,
                                  { key: 'layout', removeSeparator: !0 },
                                  !o &&
                                    e.Layout &&
                                    r.createElement(e.Layout, {
                                      id: h ? void 0 : H.Layouts,
                                    }),
                                  e.SaveLoad &&
                                    r.createElement(e.SaveLoad, {
                                      id: h ? void 0 : H.SaveLoad,
                                      chartSaver: s,
                                      isReadOnly: o,
                                      displayMode: n,
                                      isFake: h,
                                      stateSyncEmitter: l,
                                    }),
                                ),
                              e.SaveLoadReferral &&
                                r.createElement(
                                  C,
                                  { key: 'save-load-referral' },
                                  r.createElement(e.SaveLoadReferral, {
                                    isReadOnly: o,
                                    displayMode: n,
                                  }),
                                ),
                              t.showLaunchInPopupButton &&
                                e.OpenPopup &&
                                !m.enabled('hide_open_popup_button') &&
                                r.createElement(
                                  C,
                                  { key: 'popup' },
                                  r.createElement(e.OpenPopup, null),
                                ),
                              !o &&
                                (e.Properties ||
                                  e.Fullscreen ||
                                  (!Y && e.Screenshot)) &&
                                r.createElement(
                                  C,
                                  { key: 'properties' },
                                  !o &&
                                    e.QuickSearch &&
                                    r.createElement(e.QuickSearch, {
                                      id: h ? void 0 : H.QuickSearch,
                                      className: U.iconButton,
                                    }),
                                  !o &&
                                    e.Properties &&
                                    r.createElement(e.Properties, {
                                      id: h ? void 0 : H.Properties,
                                      className: U.iconButton,
                                    }),
                                  r.createElement(
                                    r.Fragment,
                                    null,
                                    !o &&
                                      e.Fullscreen &&
                                      r.createElement(
                                        C,
                                        {
                                          key: 'fullscreen',
                                          onClick:
                                            this._trackFullscreenButtonClick,
                                          removeSeparator: !0,
                                        },
                                        r.createElement(e.Fullscreen, {
                                          id: h ? void 0 : H.Fullscreen,
                                        }),
                                      ),
                                    !Y &&
                                      e.Screenshot &&
                                      r.createElement(e.Screenshot, {
                                        id: h ? void 0 : H.Screenshot,
                                        className: U.iconButton,
                                      }),
                                  ),
                                ),
                              Y &&
                                !o &&
                                e.Fullscreen &&
                                r.createElement(
                                  C,
                                  {
                                    key: 'fullscreen',
                                    onClick: this._trackFullscreenButtonClick,
                                    removeSeparator: !0,
                                  },
                                  r.createElement(e.Fullscreen, {
                                    id: h ? void 0 : H.Fullscreen,
                                  }),
                                ),
                              Y &&
                                e.Screenshot &&
                                r.createElement(
                                  C,
                                  { key: 'screenshot', removeSeparator: !0 },
                                  r.createElement(e.Screenshot, {
                                    id: h ? void 0 : H.Screenshot,
                                    className: U.iconButton,
                                  }),
                                ),
                              !o &&
                                e.Publish &&
                                !m.enabled('hide_publish_button') &&
                                r.createElement(
                                  C,
                                  {
                                    key: 'publish',
                                    className: U.mobilePublish,
                                    removeSeparator: !0,
                                  },
                                  r.createElement(e.Publish, {
                                    id: h ? void 0 : H.PublishMobile,
                                  }),
                                ),
                              ...S,
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
              !m.enabled('hide_publish_button') &&
              r.createElement(e.Publish, {
                id: H.PublishDesktop,
                className: U.desktopPublish,
              }),
          )
        }
        _trackFullscreenButtonClick() {
          0
        }
      }
      var K
      ;(j.contextType = Q),
        ((e) => {
          ;(e[(e.Left = 0)] = 'Left'),
            (e[(e.Self = 1)] = 'Self'),
            (e[(e.Right = 2)] = 'Right')
        })(K || (K = {}))
      var J = n(64147),
        $ = n(59063)
      class Z extends $.CommonJsonStoreService {
        constructor(e, t, n = []) {
          super(e, t, 'FAVORITE_CHART_STYLES_CHANGED', 'StyleWidget.quicks', n)
        }
      }
      var ee = n(10074),
        te = n(97144)
      class ne extends $.AbstractJsonStoreService {
        constructor(e, t, n) {
          super(e, t, 'FAVORITE_INTERVALS_CHANGED', 'IntervalWidget.quicks', n)
        }
        _serialize(e) {
          return (0, te.uniq)(e.map(ee.normalizeIntervalString))
        }
        _deserialize(e) {
          return (0, te.uniq)(
            (0, ee.convertResolutionsFromSettings)(e)
              .filter(ee.isResolutionMultiplierValid)
              .map(ee.normalizeIntervalString),
          )
        }
      }
      var re = n(82992),
        se = n(52033),
        ie = n(56840),
        ae = n(21097)
      class oe extends $.AbstractJsonStoreService {
        constructor(e, t, n = []) {
          super(e, t, 'CUSTOM_INTERVALS_CHANGED', 'IntervalWidget.intervals', n)
        }
        set(e, t) {
          const n = () => {
            super.set(e, t)
          }
          e.length, this.get().length, n()
        }
        _serialize(e) {
          return (0, te.uniq)(e.map(ee.normalizeIntervalString))
        }
        _deserialize(e) {
          return (0, te.uniq)([
            ...(0, ee.convertResolutionsFromSettings)(e)
              .filter(ee.isResolutionMultiplierValid)
              .map(ee.normalizeIntervalString),
          ])
        }
      }
      const le = new oe(ae.TVXWindowEvents, ie)
      var ce = n(42014)
      class ue {
        constructor(e) {
          ;(this._customIntervalsService = le),
            (this._supportedIntervalsMayChange = new se.Delegate()),
            (this._fireSupportedIntervalsMayChange = () => {
              this._supportedIntervalsMayChange.fire()
            }),
            (this._resolutionGetter = () => []),
            (this._resolutionGetter = e),
            re.linking.supportedResolutions.subscribe(
              this._fireSupportedIntervalsMayChange,
            ),
            re.linking.range.subscribe(this._fireSupportedIntervalsMayChange),
            re.linking.seconds.subscribe(this._fireSupportedIntervalsMayChange),
            re.linking.ticks.subscribe(this._fireSupportedIntervalsMayChange),
            re.linking.intraday.subscribe(
              this._fireSupportedIntervalsMayChange,
            ),
            re.linking.dataFrequencyResolution.subscribe(
              this._fireSupportedIntervalsMayChange,
            )
        }
        destroy() {
          re.linking.supportedResolutions.unsubscribe(
            this._fireSupportedIntervalsMayChange,
          ),
            re.linking.range.unsubscribe(this._fireSupportedIntervalsMayChange),
            re.linking.seconds.unsubscribe(
              this._fireSupportedIntervalsMayChange,
            ),
            re.linking.ticks.unsubscribe(this._fireSupportedIntervalsMayChange),
            re.linking.intraday.unsubscribe(
              this._fireSupportedIntervalsMayChange,
            ),
            re.linking.dataFrequencyResolution.unsubscribe(
              this._fireSupportedIntervalsMayChange,
            )
        }
        getDefaultIntervals() {
          return this._resolutionGetter
            ? this._resolutionGetter().map(ee.normalizeIntervalString)
            : []
        }
        getCustomIntervals() {
          return this._customIntervalsService.get()
        }
        add(e, t, n) {
          if (!this.isValidInterval(e, t)) return null
          const r = (0, ee.normalizeIntervalString)(`${e}${t}`),
            s = this.getCustomIntervals()
          return this._isIntervalDefault(r) || s.includes(r)
            ? null
            : (this._customIntervalsService.set(
                (0, ee.sortResolutions)([...s, r]),
              ),
              r)
        }
        remove(e) {
          this._customIntervalsService.set(
            this.getCustomIntervals().filter((t) => t !== e),
          )
        }
        isValidInterval(e, t) {
          return (0, ee.isResolutionMultiplierValid)(`${e}${t}`)
        }
        isSupportedInterval(e) {
          return (0, ee.isAvailable)(e)
        }
        supportedIntervalsMayChange() {
          return this._supportedIntervalsMayChange
        }
        getOnChange() {
          return this._customIntervalsService.getOnChange()
        }
        getPossibleIntervals() {
          return ce.INTERVALS
        }
        getResolutionUtils() {
          return {
            getMaxResolutionValue: ee.getMaxResolutionValue,
            getTranslatedResolutionModel: ee.getTranslatedResolutionModel,
            mergeResolutions: ee.mergeResolutions,
            sortResolutions: ee.sortResolutions,
          }
        }
        _isIntervalDefault(e) {
          return this.getDefaultIntervals().includes(e)
        }
      }
      var de = n(72894)
      function he(e) {
        return e.replace(/(@[^-]+-[^-]+).*$/, '$1')
      }
      const me = {}
      let pe = null
      class ve {
        constructor(e = ie) {
          ;(this._favorites = []),
            (this._favoritesChanged = new se.Delegate()),
            (this._settings = e),
            ae.TVXWindowEvents.on('StudyFavoritesChanged', (e) => {
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
          this._favorites.push(ge(t)),
            this._favoritesChanged.fire(t),
            this._saveFavs()
        }
        removeFavorite(e) {
          const t = this.favId(e),
            n = this._findFavIndex(t)
          ;-1 !== n &&
            (this._favorites.splice(n, 1), this._favoritesChanged.fire(t)),
            this._saveFavs()
        }
        favId(e) {
          return he(e)
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
          return null === pe && (pe = new ve()), pe
        }
        static create(e) {
          return new ve(e)
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
            ae.TVXWindowEvents.emit(
              'StudyFavoritesChanged',
              JSON.stringify({ favorites: e }),
            )
        }
        _stateToSave() {
          return this._favorites.map(fe)
        }
        _loadFromState(e) {
          ;(this._favorites = e.map((e) =>
            ge(((e) => (e in me ? me[e] : e))(e)),
          )),
            this._favoritesChanged.fire()
        }
        _findFavIndex(e) {
          return this._favorites.findIndex((t) => e === fe(t))
        }
      }
      function fe(e) {
        return 'java' === e.type ? e.studyId : e.pineId
      }
      function ge(e) {
        return isPineIdString(e)
          ? { type: 'pine', pineId: e }
          : { type: 'java', studyId: e }
      }
      var Se = n(85049)
      const be = {
        [Se.ResolutionKind.Ticks]: !1,
        [Se.ResolutionKind.Seconds]: !1,
        [Se.ResolutionKind.Minutes]: !1,
        [Se.SpecialResolutionKind.Hours]: !1,
        [Se.ResolutionKind.Days]: !1,
        [Se.ResolutionKind.Range]: !1,
      }
      class ye extends $.CommonJsonStoreService {
        constructor(e, t, n = be) {
          super(
            e,
            t,
            'INTERVALS_MENU_VIEW_STATE_CHANGED',
            'IntervalWidget.menu.viewState',
            n,
          )
        }
        isAllowed(e) {
          return Object.keys(be).includes(e)
        }
      }
      const Ce = {
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
        Ee = ['1', '30', '60']
      function _e(e = []) {
        let t = e.map((e) => Ce[e]) || [1, 4, 5, 6]
        return m.enabled('widget') && (t = [0, 1, 3]), t
      }
      function we(e = []) {
        return (0, ee.mergeResolutions)(
          e,
          m.enabled('star_some_intervals_by_default') ? Ee : [],
        )
      }
      new ne(ae.TVXWindowEvents, ie, we()), new Z(ae.TVXWindowEvents, ie, _e())
      const Me = {
        tools: v.any.isRequired,
        isFundamental: v.any,
        chartApiInstance: v.any,
        availableTimeFrames: v.any,
        chartWidgetCollection: v.any,
        windowMessageService: v.any,
        favoriteChartStylesService: v.any,
        favoriteIntervalsService: v.any,
        intervalService: v.any,
        recentStudyTemplatesService: v.any,
        studyTemplates: v.any,
        chartChangesWatcher: v.any,
        saveChartService: v.any,
        sharingChartService: v.any,
        loadChartService: v.any,
        chartWidget: v.any,
        favoriteScriptsModel: v.any,
        intervalsMenuViewStateService: v.any,
        templatesMenuViewStateService: v.any,
        openGlobalSearch: v.any,
        snapshotUrl: v.any,
      }
      var Re = n(49481),
        ke = n(58312)
      const Ie = []
      class Ve extends r.PureComponent {
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
            windowMessageService: n,
            chartWidgetCollection: r,
            chartApiInstance: s,
            availableTimeFrames: a,
            isFundamental: o,
            favoriteIntervalsService: l,
            favoriteChartStylesService: d,
            recentStudyTemplatesService: h,
            studyTemplates: p,
            saveChartService: v,
            sharingChartService: f,
            loadChartService: g,
            snapshotUrl: S,
            openGlobalSearch: b,
          } = e
          ;(this._showScrollbarWhen = (0, i.ensureDefined)(
            e.allowedModes,
          ).slice(-1)),
            (this._panelWidthChangeHandlers = {
              full: this._handleFullWidthChange,
              medium: this._handleFavoritesWidthChange,
              small: this._handleCollapseWidthChange,
            })
          const { chartChangesWatcher: y } = e
          this._chartChangesWatcher = y
          const C = _e(this.props.defaultFavoriteStyles)
          this._favoriteChartStylesService =
            d || new Z(ae.TVXWindowEvents, ie, C)
          const E = we(this.props.defaultFavoriteIntervals)
          ;(this._favoriteIntervalsService =
            l || new ne(ae.TVXWindowEvents, ie, E)),
            (this._intervalsMenuViewStateService = new ye(
              ae.TVXWindowEvents,
              ie,
            )),
            (this._intervalService = new ue(s.defaultResolutions)),
            (this._registry = {
              tools: t,
              isFundamental: o,
              chartWidgetCollection: r,
              windowMessageService: n,
              chartApiInstance: s,
              availableTimeFrames: a,
              recentStudyTemplatesService: h,
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
              chartWidget: r.activeChartWidget.value(),
              favoriteScriptsModel: ve.getInstance(),
              templatesMenuViewStateService:
                this._templatesMenuVuewStateService,
              snapshotUrl: S,
              openGlobalSearch: b,
            }),
            (this.state = {
              isVisible: !0,
              availableWidth: 0,
              displayMode: 'full',
              measureValid: !1,
              leftCustomElements: [],
              rightCustomElements: [],
            }),
            (this._readOnly = r.readOnly()),
            (this._features = {
              allowFavoriting: m.enabled('items_favoriting'),
              showIdeasButton: Boolean(this.props.ideas),
              showLaunchInPopupButton: Boolean(this.props.popupButton),
              allowSymbolSearchSpread:
                m.enabled('header_symbol_search') &&
                m.enabled('show_spread_operators'),
              allowToolbarHiding: m.enabled('collapsible_header'),
            }),
            (this._setDisplayMode = (0, u.default)(this._setDisplayMode, 100)),
            this._negotiateResizer()
        }
        componentDidUpdate(e, t) {
          const { isVisible: n, measureValid: r } = this.state
          n !== t.isVisible &&
            (p.emit('toggle_header', n), this._negotiateResizer()),
            r || this._setDisplayMode()
        }
        render() {
          const { resizerBridge: e, allowedModes: t, ...n } = this.props,
            {
              displayMode: s,
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
              ...n,
            },
            d = { ...u, isFake: !0, showScrollbarWhen: Ie },
            h = (0, i.ensureDefined)(t),
            m = this.props.tools.PublishButtonManager || r.Fragment
          return r.createElement(
            G.RegistryProvider,
            { value: this._registry, validation: Me },
            r.createElement(
              m,
              null,
              r.createElement(
                'div',
                {
                  className: a(ke.toolbar, { [ke.isHidden]: !o }),
                  onClick: this.props.onClick,
                },
                r.createElement(
                  'div',
                  { className: ke.overflowWrap },
                  h.map((e) =>
                    r.createElement(j, {
                      key: e,
                      displayMode: e,
                      onWidthChange: this._panelWidthChangeHandlers[e],
                      ...d,
                    }),
                  ),
                  r.createElement(j, {
                    key: 'live',
                    showScrollbarWhen: this._showScrollbarWhen,
                    displayMode: s,
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
        removeButton(e) {
          const { leftCustomElements: t, rightCustomElements: n } = this.state
          if ((0, d.default)(e)) this._removeCustomElementToState(e)
          else {
            const r = (t) => 'element' in t.params && t.params.element === e,
              s = t.find(r)?.id ?? n.find(r)?.id
            ;(0, h.default)(s) || this._removeCustomElementToState(s)
          }
        }
        addDropdown(e, t) {
          const { leftCustomElements: n, rightCustomElements: r } = this.state,
            s = { type: 'Dropdown', id: e, params: t }
          'left' === t.align
            ? this.setState({ leftCustomElements: [...n, s] })
            : this.setState({ rightCustomElements: [...r, s] })
        }
        updateDropdown(e, t) {
          const n = (t) => 'Dropdown' === t.type && t.id === e,
            r =
              this.state.leftCustomElements.find(n) ||
              this.state.rightCustomElements.find(n)
          void 0 !== r &&
            ((r.params = { ...r.params, ...t }),
            this.setState({
              leftCustomElements: this.state.leftCustomElements.slice(),
              rightCustomElements: this.state.rightCustomElements.slice(),
            }))
        }
        removeDropdown(e) {
          const t = (t) => 'Dropdown' === t.type && t.id !== e,
            n = this.state.leftCustomElements.filter(t),
            r = this.state.rightCustomElements.filter(t)
          this.setState({ leftCustomElements: n, rightCustomElements: r })
        }
        _negotiateResizer() {
          this.props.resizerBridge.negotiateHeight(
            this.state.isVisible
              ? de.HEADER_TOOLBAR_HEIGHT_EXPANDED
              : de.HEADER_TOOLBAR_HEIGHT_COLLAPSED,
          )
        }
        _setDisplayMode() {
          const { availableWidth: e } = this.state,
            { allowedModes: t } = this.props,
            n = {
              full: this._fullWidth,
              medium: this._favoritesWidth,
              small: this._collapseWidth,
            },
            r = (0, i.ensureDefined)(t)
          let s = r.map((e) => n[e]).findIndex((t) => e >= t)
          ;-1 === s && (s = r.length - 1)
          const a = r[s]
          this.setState({ measureValid: !0, displayMode: a })
        }
        _addCustomHTMLButton(e, t = 'left') {
          const n = new J.WatchedValue(0),
            r = (0, Re.parseHtmlElement)(
              `<div class="apply-common-tooltip ${ke.customButton}">`,
            ),
            s = {
              type: 'Button',
              id: e,
              params: { key: Number(new Date()), element: r, width: n },
            }
          return this._addCustomElementToState(t, s), r
        }
        _addCustomTradingViewStyledButton(e, t) {
          const n = {
            type: 'TradingViewStyledButton',
            id: e,
            params: {
              key: Number(new Date()),
              text: t.text,
              title: t.title,
              onClick: t.onClick,
            },
          }
          this._addCustomElementToState(t.align, n)
        }
        _addCustomElementToState(e, t) {
          const { leftCustomElements: n, rightCustomElements: r } = this.state
          'left' === e
            ? this.setState({ leftCustomElements: [...n, t] })
            : this.setState({ rightCustomElements: [...r, t] })
        }
        _removeCustomElementToState(e) {
          this.setState({
            leftCustomElements: this.state.leftCustomElements.filter(
              (t) => t.id !== e,
            ),
            rightCustomElements: this.state.rightCustomElements.filter(
              (t) => t.id !== e,
            ),
          })
        }
      }
      Ve.defaultProps = { allowedModes: ['full', 'medium'] }
      class Fe {
        constructor(e, t) {
          ;(this._component = null),
            (this._handleRef = (e) => {
              this._component = e
            }),
            (this._container = e),
            s.render(
              r.createElement(Ve, { ...t, ref: this._handleRef }),
              this._container,
            )
        }
        destroy() {
          s.unmountComponentAtNode(this._container)
        }
        getComponent() {
          return (0, i.ensureNotNull)(this._component)
        }
      }
    },
    77151: (e, t, n) => {
      n.d(t, {
        RegistryProvider: () => l,
        registryContextType: () => c,
        validateRegistry: () => o,
      })
      var r = n(50959),
        s = n(19036),
        i = n.n(s)
      const a = r.createContext({})
      function o(e, t) {
        i().checkPropTypes(t, e, 'context', 'RegistryContext')
      }
      function l(e) {
        const { validation: t, value: n } = e
        return o(n, t), r.createElement(a.Provider, { value: n }, e.children)
      }
      function c() {
        return a
      }
    },
    61380: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" width="20" height="10"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M2 1l8 8 8-8"/></svg>'
    },
    45820: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.56 14a10.05 10.05 0 00.52.91c.41.69 1.04 1.6 1.85 2.5C8.58 19.25 10.95 21 14 21c3.05 0 5.42-1.76 7.07-3.58A17.18 17.18 0 0023.44 14a9.47 9.47 0 00-.52-.91c-.41-.69-1.04-1.6-1.85-2.5C19.42 8.75 17.05 7 14 7c-3.05 0-5.42 1.76-7.07 3.58A17.18 17.18 0 004.56 14zM24 14l.45-.21-.01-.03a7.03 7.03 0 00-.16-.32c-.11-.2-.28-.51-.5-.87-.44-.72-1.1-1.69-1.97-2.65C20.08 7.99 17.45 6 14 6c-3.45 0-6.08 2-7.8 3.92a18.18 18.18 0 00-2.64 3.84v.02h-.01L4 14l-.45-.21-.1.21.1.21L4 14l-.45.21.01.03a5.85 5.85 0 00.16.32c.11.2.28.51.5.87.44.72 1.1 1.69 1.97 2.65C7.92 20.01 10.55 22 14 22c3.45 0 6.08-2 7.8-3.92a18.18 18.18 0 002.64-3.84v-.02h.01L24 14zm0 0l.45.21.1-.21-.1-.21L24 14zm-10-3a3 3 0 100 6 3 3 0 000-6zm-4 3a4 4 0 118 0 4 4 0 01-8 0z"/></svg>'
    },
  },
])
