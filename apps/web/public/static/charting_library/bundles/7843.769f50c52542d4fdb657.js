;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7843],
  {
    56057: (e) => {
      e.exports = {
        logo: 'logo-PsAlMQQF',
        hidden: 'hidden-PsAlMQQF',
        xxceptionallysmalldonotusebrv1023:
          'xxceptionallysmalldonotusebrv1023-PsAlMQQF',
        xxxsmall: 'xxxsmall-PsAlMQQF',
        xxsmall: 'xxsmall-PsAlMQQF',
        xsmall: 'xsmall-PsAlMQQF',
        small: 'small-PsAlMQQF',
        medium: 'medium-PsAlMQQF',
        large: 'large-PsAlMQQF',
        xlarge: 'xlarge-PsAlMQQF',
        xxlarge: 'xxlarge-PsAlMQQF',
        xxxlarge: 'xxxlarge-PsAlMQQF',
        skeleton: 'skeleton-PsAlMQQF',
        letter: 'letter-PsAlMQQF',
      }
    },
    55679: (e) => {
      e.exports = {
        wrapper: 'wrapper-TJ9ObuLF',
        animated: 'animated-TJ9ObuLF',
        pulsation: 'pulsation-TJ9ObuLF',
      }
    },
    96108: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': '(max-width: 768px)',
        'small-height-breakpoint': '(max-height: 360px)',
        'tablet-small-breakpoint': '(max-width: 440px)',
      }
    },
    9059: (e) => {
      e.exports = {
        'tablet-small-breakpoint': '(max-width: 440px)',
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
    53885: (e, o, t) => {
      t.d(o, { getStyleClasses: () => a, isCircleLogoWithUrlProps: () => s })
      var l = t(97754),
        i = t(52292),
        n = t(56057),
        r = t.n(n)
      function a(e, o = 2, t) {
        return l(
          r().logo,
          r()[e],
          t,
          0 === o || 1 === o
            ? l(i.skeletonTheme.wrapper, r().skeleton)
            : r().letter,
          1 === o && i.skeletonTheme.animated,
        )
      }
      function s(e) {
        return (
          'logoUrl' in e &&
          null !== e.logoUrl &&
          void 0 !== e.logoUrl &&
          0 !== e.logoUrl.length
        )
      }
    },
    39416: (e, o, t) => {
      t.d(o, { useFunctionalRefObject: () => n })
      var l = t(50959),
        i = t(43010)
      function n(e) {
        const o = (0, l.useMemo)(
            () =>
              ((e) => {
                const o = (t) => {
                  e(t), (o.current = t)
                }
                return (o.current = null), o
              })((e) => {
                a.current(e)
              }),
            [],
          ),
          t = (0, l.useRef)(null),
          n = (o) => {
            if (null === o) return r(t.current, o), void (t.current = null)
            t.current !== e && ((t.current = e), r(t.current, o))
          },
          a = (0, l.useRef)(n)
        return (
          (a.current = n),
          (0, i.useIsomorphicLayoutEffect)(() => {
            if (null !== o.current)
              return a.current(o.current), () => a.current(null)
          }, [e]),
          o
        )
      }
      function r(e, o) {
        null !== e && ('function' == typeof e ? e(o) : (e.current = o))
      }
    },
    27267: (e, o, t) => {
      function l(e, o, t, l, i) {
        function n(i) {
          if (e > i.timeStamp) return
          const n = i.target
          void 0 !== t &&
            null !== o &&
            null !== n &&
            n.ownerDocument === l &&
            (o.contains(n) || t(i))
        }
        return (
          i.click && l.addEventListener('click', n, !1),
          i.mouseDown && l.addEventListener('mousedown', n, !1),
          i.touchEnd && l.addEventListener('touchend', n, !1),
          i.touchStart && l.addEventListener('touchstart', n, !1),
          () => {
            l.removeEventListener('click', n, !1),
              l.removeEventListener('mousedown', n, !1),
              l.removeEventListener('touchend', n, !1),
              l.removeEventListener('touchstart', n, !1)
          }
        )
      }
      t.d(o, { addOutsideEventListener: () => l })
    },
    52292: (e, o, t) => {
      t.d(o, { skeletonTheme: () => i })
      var l = t(55679)
      const i = l
    },
    90186: (e, o, t) => {
      function l(e) {
        return n(e, r)
      }
      function i(e) {
        return n(e, a)
      }
      function n(e, o) {
        const t = Object.entries(e).filter(o),
          l = {}
        for (const [e, o] of t) l[e] = o
        return l
      }
      function r(e) {
        const [o, t] = e
        return 0 === o.indexOf('data-') && 'string' == typeof t
      }
      function a(e) {
        return 0 === e[0].indexOf('aria-')
      }
      t.d(o, {
        filterAriaProps: () => i,
        filterDataProps: () => l,
        filterProps: () => n,
        isAriaAttribute: () => a,
        isDataAttribute: () => r,
      })
    },
    24437: (e, o, t) => {
      t.d(o, { DialogBreakpoints: () => i })
      var l = t(96108)
      const i = {
        SmallHeight: l['small-height-breakpoint'],
        TabletSmall: l['tablet-small-breakpoint'],
        TabletNormal: l['tablet-normal-breakpoint'],
      }
    },
    59695: (e, o, t) => {
      t.d(o, { CircleLogo: () => a, hiddenCircleLogoClass: () => r })
      var l = t(50959),
        i = t(53885),
        n = t(56057)
      const r = t.n(n)().hidden
      function a(e) {
        const o = (0, i.isCircleLogoWithUrlProps)(e),
          [t, n] = (0, l.useState)(0),
          r = (0, l.useRef)(null),
          a = (0, i.getStyleClasses)(e.size, t, e.className),
          s = e.alt ?? e.title ?? '',
          c = o ? s[0] : e.placeholderLetter
        return (
          (0, l.useEffect)(() => n((r.current?.complete ?? !o) ? 2 : 1), [o]),
          o && 3 !== t
            ? l.createElement('img', {
                ref: r,
                className: a,
                crossOrigin: '',
                src: e.logoUrl,
                alt: s,
                title: e.title,
                loading: e.loading,
                onLoad: () => n(2),
                onError: () => n(3),
                'aria-label': e['aria-label'],
                'aria-hidden': e['aria-hidden'],
              })
            : l.createElement(
                'span',
                {
                  className: a,
                  title: e.title,
                  'aria-label': e['aria-label'],
                  'aria-hidden': e['aria-hidden'],
                },
                c,
              )
        )
      }
    },
    77975: (e, o, t) => {
      t.d(o, { useWatchedValueReadonly: () => i })
      var l = t(50959)
      const i = (e, o = !1, t = []) => {
        const i = 'watchedValue' in e ? e.watchedValue : void 0,
          n = 'defaultValue' in e ? e.defaultValue : e.watchedValue.value(),
          [r, a] = (0, l.useState)(i ? i.value() : n)
        return (
          (o ? l.useLayoutEffect : l.useEffect)(() => {
            if (i) {
              a(i.value())
              const e = (e) => a(e)
              return i.subscribe(e), () => i.unsubscribe(e)
            }
            return () => {}
          }, [i, ...t]),
          r
        )
      }
    },
    16396: (e, o, t) => {
      t.d(o, { DEFAULT_POPUP_MENU_ITEM_THEME: () => h, PopupMenuItem: () => d })
      var l = t(50959),
        i = t(97754),
        n = t(51768),
        r = t(59064),
        a = t(59695),
        s = t(76460),
        c = t(9059)
      const h = c
      function v(e) {
        e.stopPropagation()
      }
      function d(e) {
        const {
            id: o,
            role: t,
            className: h,
            title: d,
            labelRowClassName: u,
            labelClassName: g,
            toolboxClassName: m,
            shortcut: w,
            forceShowShortcuts: f,
            icon: p,
            iconClassname: L,
            isActive: x,
            isDisabled: T,
            isHovered: z,
            appearAsDisabled: b,
            label: M,
            link: A,
            showToolboxOnHover: y,
            showToolboxOnFocus: C,
            target: k,
            rel: P,
            toolbox: E,
            toolboxRole: F,
            reference: S,
            onMouseOut: D,
            onMouseOver: K,
            onKeyDown: V,
            suppressToolboxClick: N = !0,
            theme: R = c,
            tabIndex: H,
            tagName: O,
            renderComponent: B,
            roundedIcon: I,
            iconAriaProps: Q,
            circleLogo: Z,
            dontClosePopup: j,
            onClick: J,
            onClickArg: q,
            trackEventObject: U,
            trackMouseWheelClick: W,
            trackRightClick: G,
            ..._
          } = e,
          $ = (0, l.useRef)(null),
          X = (0, l.useMemo)(
            () =>
              ((e) => {
                function o(o) {
                  const { reference: t, ...i } = o,
                    n = e ?? (i.href ? 'a' : 'div'),
                    r =
                      'a' === n
                        ? i
                        : ((e) => {
                            const {
                              download: o,
                              href: t,
                              hrefLang: l,
                              media: i,
                              ping: n,
                              rel: r,
                              target: a,
                              type: s,
                              referrerPolicy: c,
                              ...h
                            } = e
                            return h
                          })(i)
                  return l.createElement(n, { ...r, ref: t })
                }
                return (o.displayName = `DefaultComponent(${e})`), o
              })(O),
            [O],
          ),
          Y = B ?? X
        return l.createElement(
          Y,
          {
            ..._,
            id: o,
            role: t,
            className: i(h, R.item, p && R.withIcon, {
              [R.isActive]: x,
              [R.isDisabled]: T || b,
              [R.hovered]: z,
            }),
            title: d,
            href: A,
            target: k,
            rel: P,
            reference: (e) => {
              ;($.current = e), 'function' == typeof S && S(e)
              'object' == typeof S && (S.current = e)
            },
            onClick: (e) => {
              if (T) return
              U && (0, n.trackEvent)(U.category, U.event, U.label)
              J && J(q, e)
              j ||
                (e.currentTarget.dispatchEvent(
                  new CustomEvent('popup-menu-close-event', {
                    bubbles: !0,
                    detail: {
                      clickType: (0, s.isKeyboardClick)(e)
                        ? 'keyboard'
                        : 'mouse',
                    },
                  }),
                ),
                (0, r.globalCloseMenu)())
            },
            onContextMenu: (e) => {
              U &&
                G &&
                (0, n.trackEvent)(U.category, U.event, `${U.label}_rightClick`)
            },
            onMouseUp: (e) => {
              if (1 === e.button && A && U) {
                let e = U.label
                W && (e += '_mouseWheelClick'),
                  (0, n.trackEvent)(U.category, U.event, e)
              }
            },
            onMouseOver: K,
            onMouseOut: D,
            onKeyDown: V,
            tabIndex: H,
          },
          Z &&
            l.createElement(a.CircleLogo, {
              ...Q,
              className: c['disclosure-item-circle-logo'],
              size: 'xxxsmall',
              logoUrl: Z.logoUrl,
              placeholderLetter:
                'placeholderLetter' in Z ? Z.placeholderLetter : void 0,
            }),
          p &&
            l.createElement('span', {
              'aria-label': Q && Q['aria-label'],
              'aria-hidden': Q && Boolean(Q['aria-hidden']),
              className: i(R.icon, I && c['round-icon'], L),
              dangerouslySetInnerHTML: { __html: p },
            }),
          l.createElement(
            'span',
            { className: i(R.labelRow, u) },
            l.createElement('span', { className: i(R.label, g) }, M),
          ),
          (void 0 !== w || f) &&
            l.createElement(
              'span',
              { className: R.shortcut },
              (ee = w) && ee.split('+').join(' + '),
            ),
          void 0 !== E &&
            l.createElement(
              'span',
              {
                role: F,
                onClick: N ? v : void 0,
                className: i(m, R.toolbox, {
                  [R.showOnHover]: y,
                  [R.showOnFocus]: C,
                }),
              },
              E,
            ),
        )
        var ee
      }
    },
    20520: (e, o, t) => {
      t.d(o, { PopupMenu: () => d })
      var l = t(50959),
        i = t(32227),
        n = t(88987),
        r = t(42842),
        a = t(27317),
        s = t(29197)
      const c = l.createContext(void 0)
      var h = t(36383)
      const v = l.createContext({ setMenuMaxWidth: !1 })
      function d(e) {
        const {
            controller: o,
            children: t,
            isOpened: d,
            closeOnClickOutside: u = !0,
            doNotCloseOn: g,
            onClickOutside: m,
            onClose: w,
            onKeyboardClose: f,
            'data-name': p = 'popup-menu-container',
            ...L
          } = e,
          x = (0, l.useContext)(s.CloseDelegateContext),
          T = l.useContext(v),
          z = (0, l.useContext)(c),
          b = (0, h.useOutsideEvent)({
            handler: (e) => {
              m && m(e)
              if (!u) return
              const o = (0, n.default)(g) ? g() : null == g ? [] : [g]
              if (o.length > 0 && e.target instanceof Node)
                for (const t of o) {
                  const o = i.findDOMNode(t)
                  if (o instanceof Node && o.contains(e.target)) return
                }
              w()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return d
          ? l.createElement(
              r.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              l.createElement(
                'span',
                { ref: b, style: { pointerEvents: 'auto' } },
                l.createElement(
                  a.Menu,
                  {
                    ...L,
                    onClose: w,
                    onKeyboardClose: f,
                    onScroll: (o) => {
                      const { onScroll: t } = e
                      t && t(o)
                    },
                    customCloseDelegate: x,
                    customRemeasureDelegate: z,
                    ref: o,
                    'data-name': p,
                    limitMaxWidth: T.setMenuMaxWidth,
                    'data-tooltip-show-on-focus': 'true',
                  },
                  t,
                ),
              ),
            )
          : null
      }
    },
    26448: (e) => {
      e.exports = {
        accessible: 'accessible-NQERJsv9',
        active: 'active-NQERJsv9',
      }
    },
    58658: (e) => {
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
    10838: (e, o, t) => {
      t.d(o, { AccessibleMenuItem: () => h })
      var l = t(50959),
        i = t(97754),
        n = t.n(i),
        r = t(3343),
        a = t(50238),
        s = t(16396),
        c = t(26448)
      function h(e) {
        const { className: o, ...t } = e,
          [i, h] = (0, a.useRovingTabindexElement)(null)
        return l.createElement(s.PopupMenuItem, {
          ...t,
          className: n()(c.accessible, e.isActive && c.active, o),
          reference: i,
          tabIndex: h,
          onKeyDown: (e) => {
            if (e.target !== e.currentTarget) return
            const o = (0, r.hashFromEvent)(e)
            ;(13 !== o && 32 !== o) ||
              (e.preventDefault(),
              i.current instanceof HTMLElement && i.current.click())
          },
          'data-role': 'menuitem',
          'aria-disabled': e.isDisabled || void 0,
          toolboxRole: 'toolbar',
        })
      }
    },
    29835: (e, o, t) => {
      t.d(o, { ToolButton: () => a })
      var l = t(50959),
        i = t(97754),
        n = t(9745),
        r = t(58658)
      const a = (0, l.forwardRef)((e, o) => {
        const {
            id: t,
            activeClass: a,
            children: s,
            className: c,
            icon: h,
            isActive: v,
            isGrayed: d,
            isHidden: u,
            isTransparent: g,
            theme: m = r,
            onClick: w,
            onKeyDown: f,
            buttonHotKey: p,
            tooltipPosition: L = 'vertical',
            tag: x = 'div',
            tabIndex: T,
            tooltip: z,
            ...b
          } = e,
          M = 'button' === e.tag
        return l.createElement(
          x,
          {
            'aria-label': M ? z : void 0,
            ...b,
            id: t,
            type: M ? 'button' : void 0,
            className: i(
              m.button,
              c,
              v && a,
              {
                'apply-common-tooltip': Boolean(z),
                'common-tooltip-vertical': Boolean(z) && 'vertical' === L,
                [m.isActive]: v,
                [m.isGrayed]: d,
                [m.isHidden]: u,
                [m.isTransparent]: g,
              },
              M && m.accessible,
            ),
            onClick: w,
            onKeyDown: f,
            'data-role': M ? void 0 : 'button',
            ref: o,
            tabIndex: T,
            'data-tooltip-hotkey': p,
            'aria-pressed': M ? v : void 0,
            'data-tooltip': z,
          },
          l.createElement(
            'div',
            { className: m.bg },
            h &&
              ('string' == typeof h
                ? l.createElement(n.Icon, { className: m.icon, icon: h })
                : l.createElement('span', { className: m.icon }, h)),
            s,
          ),
        )
      })
    },
    84243: (e, o, t) => {
      t.d(o, { drawingToolsIcons: () => l })
      const l = {
        SyncDrawing: t(99088),
        arrow: t(63743),
        cursor: t(18953),
        dot: t(72196),
        demonstration: t(54780),
        performance: '',
        drawginmode: t(52459),
        drawginmodeActive: t(63975),
        eraser: t(27999),
        group: t(34059),
        hideAllDrawings: t(45820),
        hideAllDrawingsActive: t(84959),
        hideAllIndicators: t(42321),
        hideAllIndicatorsActive: t(75895),
        hideAllDrawingTools: t(93756),
        hideAllDrawingToolsActive: t(42650),
        hideAllPositionsTools: t(57313),
        hideAllPositionsToolsActive: t(65162),
        lockAllDrawings: t(91244),
        lockAllDrawingsActive: t(65186),
        magnet: t(68385),
        heart: t(10862),
        smile: t(7636),
        sticker: t(62567),
        strongMagnet: t(46049),
        measure: t(88518),
        removeAllDrawingTools: t(93544),
        showObjectsTree: t(36515),
        zoom: t(6894),
        'zoom-out': t(45360),
      }
    },
    2627: (e, o, t) => {
      t.d(o, { lineToolsInfo: () => L })
      var l = t(50151),
        i = t(11542),
        n = t(61814),
        r = (t(21251), t(98626)),
        a = t(84243)
      const s = {
        SyncDrawing: i.t(null, void 0, t(59377)),
        arrow: i.t(null, void 0, t(11858)),
        cursor: i.t(null, void 0, t(6969)),
        demonstration: i.t(null, void 0, t(14939)),
        dot: i.t(null, void 0, t(57157)),
        performance: i.t(null, void 0, t(35553)),
        drawginmode: i.t(null, void 0, t(62518)),
        eraser: i.t(null, void 0, t(8727)),
        group: i.t(null, void 0, t(3154)),
        hideAllDrawings: i.t(null, void 0, t(52563)),
        lockAllDrawings: i.t(null, void 0, t(79451)),
        magnet: i.t(null, void 0, t(81396)),
        measure: i.t(null, void 0, t(91563)),
        removeAllDrawingTools: i.t(null, void 0, t(57118)),
        showObjectsTree: i.t(null, void 0, t(85786)),
        zoom: i.t(null, void 0, t(55774)),
        'zoom-out': i.t(null, void 0, t(37310)),
      }
      var c = t(98523),
        h = t(68335),
        v = t(17402)
      const d = (0, h.humanReadableModifiers)(h.Modifiers.Shift, !1).trim(),
        u = (0, h.humanReadableModifiers)(h.Modifiers.Alt, !1).trim(),
        g = (0, h.humanReadableModifiers)(h.Modifiers.Mod, !1).trim(),
        m = { keys: [d], text: i.t(null, void 0, t(23369)) },
        w = { keys: [d], text: i.t(null, void 0, t(13798)) },
        f = { keys: [d], text: i.t(null, void 0, t(10539)) },
        p = {
          LineTool5PointsPattern: {},
          LineToolABCD: {},
          LineToolArc: {},
          LineToolArrow: {},
          LineToolArrowMarkDown: {},
          LineToolArrowMarkLeft: {},
          LineToolArrowMarkRight: {},
          LineToolArrowMarkUp: {},
          LineToolComment: {},
          LineToolBarsPattern: {},
          LineToolBezierCubic: {},
          LineToolBezierQuadro: {},
          LineToolBrush: {},
          LineToolCallout: {},
          LineToolCircleLines: {},
          LineToolCypherPattern: {},
          LineToolDateAndPriceRange: {},
          LineToolDateRange: {},
          LineToolDisjointAngle: { hotKey: (0, n.hotKeySerialize)(m) },
          LineToolElliottCorrection: {},
          LineToolElliottDoubleCombo: {},
          LineToolElliottImpulse: {},
          LineToolElliottTriangle: {},
          LineToolElliottTripleCombo: {},
          LineToolEllipse: { hotKey: (0, n.hotKeySerialize)(w) },
          LineToolExtended: {},
          LineToolFibChannel: {},
          LineToolFibCircles: { hotKey: (0, n.hotKeySerialize)(w) },
          LineToolFibRetracement: {},
          LineToolFibSpeedResistanceArcs: {},
          LineToolFibSpeedResistanceFan: { hotKey: (0, n.hotKeySerialize)(f) },
          LineToolFibSpiral: {},
          LineToolFibTimeZone: {},
          LineToolFibWedge: {},
          LineToolFlagMark: {},
          LineToolFlatBottom: { hotKey: (0, n.hotKeySerialize)(m) },
          LineToolAnchoredVWAP: {},
          LineToolGannComplex: {},
          LineToolGannFixed: {},
          LineToolGannFan: {},
          LineToolGannSquare: {
            hotKey: (0, n.hotKeySerialize)({
              keys: [d],
              text: i.t(null, void 0, t(83042)),
            }),
          },
          LineToolHeadAndShoulders: {},
          LineToolHorzLine: {
            hotKey: (0, n.hotKeySerialize)({
              keys: [u, 'H'],
              text: '{0} + {1}',
            }),
          },
          LineToolHorzRay: {},
          LineToolIcon: {},
          LineToolImage: {},
          LineToolEmoji: {},
          LineToolInsidePitchfork: {},
          LineToolNote: {},
          LineToolSignpost: {},
          LineToolParallelChannel: { hotKey: (0, n.hotKeySerialize)(m) },
          LineToolPitchfan: {},
          LineToolPitchfork: {},
          LineToolPolyline: {},
          LineToolPath: {},
          LineToolPrediction: {},
          LineToolPriceLabel: {},
          LineToolPriceNote: { hotKey: (0, n.hotKeySerialize)(m) },
          LineToolTextNote: {},
          LineToolArrowMarker: {},
          LineToolPriceRange: {},
          LineToolProjection: {},
          LineToolRay: {},
          LineToolRectangle: {
            hotKey: (0, n.hotKeySerialize)({
              keys: [d],
              text: i.t(null, void 0, t(10539)),
            }),
          },
          LineToolCircle: {},
          LineToolRegressionTrend: {},
          LineToolRiskRewardLong: {},
          LineToolRiskRewardShort: {},
          LineToolFixedRangeVolumeProfile: {},
          LineToolRotatedRectangle: { hotKey: (0, n.hotKeySerialize)(m) },
          LineToolSchiffPitchfork: {},
          LineToolSchiffPitchfork2: {},
          LineToolSineLine: {},
          LineToolText: {},
          LineToolTextAbsolute: {},
          LineToolThreeDrivers: {},
          LineToolTimeCycles: {},
          LineToolTrendAngle: { hotKey: (0, n.hotKeySerialize)(m) },
          LineToolTrendBasedFibExtension: {},
          LineToolTrendBasedFibTime: {},
          LineToolTrendLine: { hotKey: (0, n.hotKeySerialize)(m) },
          LineToolInfoLine: {},
          LineToolTriangle: {},
          LineToolTrianglePattern: {},
          LineToolVertLine: {
            hotKey: (0, n.hotKeySerialize)({
              keys: [u, 'V'],
              text: '{0} + {1}',
            }),
          },
          LineToolCrossLine: {},
          LineToolHighlighter: {},
          LineToolGhostFeed: {},
          LineToolTable: {},
          SyncDrawing: { iconActive: a.drawingToolsIcons.SyncDrawingActive },
          arrow: {},
          cursor: {},
          dot: {},
          demonstration: {
            hotKey: (0, n.hotKeySerialize)({
              keys: [u],
              text: i.t(null, void 0, t(42633)),
            }),
          },
          drawginmode: { iconActive: a.drawingToolsIcons.drawginmodeActive },
          eraser: {},
          group: {},
          hideAllDrawings: {
            iconActive: a.drawingToolsIcons.hideAllDrawingsActive,
            hotKey: (0, n.hotKeySerialize)({
              keys: [g, u, 'H'],
              text: '{0} + {1} + {2}',
            }),
          },
          lockAllDrawings: {
            iconActive: a.drawingToolsIcons.lockAllDrawingsActive,
          },
          magnet: {
            hotKey: (0, n.hotKeySerialize)({ keys: [g], text: '{0}' }),
          },
          measure: {
            hotKey: (0, n.hotKeySerialize)({
              keys: [d],
              text: i.t(null, void 0, t(92949)),
            }),
          },
          removeAllDrawingTools: {},
          showObjectsTree: {},
          zoom: {},
          'zoom-out': {},
        }
      const L = {}
      Object.entries(p)
        .map(([e, o]) => {
          const t = r.lineToolsIcons[e] ?? a.drawingToolsIcons[e]
          ;(0, l.assert)(!!t, `Icon is not defined for drawing "${e}"`)
          const i = c.lineToolsLocalizedNames[e] ?? s[e]
          ;(0, l.assert)(
            !!i,
            `Localized name is not defined for drawing "${e}"`,
          )
          return {
            ...o,
            name: e,
            icon: t,
            localizedName: i,
            selectHotkey: v.lineToolsSelectHotkeys[e],
          }
        })
        .forEach((e) => {
          L[e.name] = e
        })
    },
    26744: (e, o, t) => {
      t.d(o, { LinetoolsFavoritesStore: () => c })
      var l = t(52033),
        i = t(37265),
        n = t(56840)
      const r = ['LineToolBalloon', 'LineToolNoteAbsolute', null, null].filter(
          i.isExistent,
        ),
        a = !1
      var s, c
      !((e) => {
        function o() {
          e.favorites = []
          let o = !1
          const l = Boolean(
              void 0 === (0, n.getValue)('chart.favoriteDrawings'),
            ),
            s = (0, n.getJSON)('chart.favoriteDrawings', [])
          if (0 === s.length && l && 'undefined' != typeof window) {
            const e = JSON.parse(
              window.urlParams?.favorites ?? '{}',
            ).drawingTools
            e && Array.isArray(e) && s.push(...e)
          }
          s.forEach((l, i) => {
            const n = l.tool || l
            t(n)
              ? r.includes(n)
                ? (o = !0)
                : e.favorites.push(n)
              : a && a.includes(n) && e.hiddenToolsPositions.set(n, i)
          }),
            o && i(),
            e.favoritesSynced.fire()
        }
        function t(e) {
          return 'string' == typeof e && '' !== e && !(a && a.includes(e))
        }
        function i(o) {
          const t = e.favorites.slice()
          e.hiddenToolsPositions.forEach((e, o) => {
            t.splice(e, 0, o)
          }),
            (0, n.setJSON)('chart.favoriteDrawings', t, o)
        }
        ;(e.favorites = []),
          (e.favoritesSynced = new l.Delegate()),
          (e.hiddenToolsPositions = new Map()),
          (e.favoriteIndex = (o) => e.favorites.indexOf(o)),
          (e.isValidLineToolName = t),
          (e.saveFavorites = i),
          o(),
          n.onSync.subscribe(null, o)
      })(s || (s = {})),
        ((e) => {
          function o(e) {
            return s.isValidLineToolName(e)
          }
          function t() {
            return s.favorites.length
          }
          function i(e) {
            return -1 !== s.favoriteIndex(e)
          }
          ;(e.favoriteAdded = new l.Delegate()),
            (e.favoriteRemoved = new l.Delegate()),
            (e.favoriteMoved = new l.Delegate()),
            (e.favoritesSynced = s.favoritesSynced),
            (e.favorites = () => s.favorites.slice()),
            (e.isValidLineToolName = o),
            (e.favoritesCount = t),
            (e.favorite = (e) => (e < 0 || e >= t() ? '' : s.favorites[e])),
            (e.addFavorite = (t, l) =>
              !(i(t) || !o(t) || 'performance' === t) &&
              (s.favorites.push(t),
              s.saveFavorites(l),
              e.favoriteAdded.fire(t),
              !0)),
            (e.removeFavorite = (o, t) => {
              const l = s.favoriteIndex(o)
              if (-1 === l) return !1
              s.favorites.splice(l, 1)
              const i = s.hiddenToolsPositions
              return (
                i.forEach((e, o) => {
                  e > l && i.set(o, e - 1)
                }),
                s.saveFavorites(t),
                e.favoriteRemoved.fire(o),
                !0
              )
            }),
            (e.isFavorite = i),
            (e.moveFavorite = (l, i, n) => {
              if (i < 0 || i >= t() || !o(l)) return !1
              const r = s.favoriteIndex(l)
              if (-1 === r || i === r) return !1
              const a = s.hiddenToolsPositions
              return (
                a.forEach((e, o) => {
                  r < e && i > e ? e-- : i < e && r > e && e++, a.set(o, e)
                }),
                s.favorites.splice(r, 1),
                s.favorites.splice(i, 0, l),
                s.saveFavorites(n),
                e.favoriteMoved.fire(l, r, i),
                !0
              )
            })
        })(c || (c = {}))
    },
    54780: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="m11.26 21 3.65-4.78 6.09-.66L10 8zm3.09-5.71-2.33 3.05-.8-8.3 7.02 4.82z"/><path fill-rule="evenodd" d="M25 14a11 11 0 1 1-22 0 11 11 0 0 1 22 0m-1 0a10 10 0 1 1-20 0 10 10 0 0 1 20 0"/></svg>'
    },
    52459: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M17.27 4.56a2.5 2.5 0 0 0-3.54 0l-.58.59-9 9-1 1-.15.14V20h4.7l.15-.15 1-1 9-9 .59-.58a2.5 2.5 0 0 0 0-3.54l-1.17-1.17Zm-2.83.7a1.5 1.5 0 0 1 2.12 0l1.17 1.18a1.5 1.5 0 0 1 0 2.12l-.23.23-3.3-3.29.24-.23Zm-.94.95 3.3 3.29-8.3 8.3-3.3-3.3 8.3-8.3Zm-9 9 3.3 3.29-.5.5H4v-3.3l.5-.5Zm16.5.29a1.5 1.5 0 0 0-3 0V18h4.5c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5v-4c0-.83.67-1.5 1.5-1.5h.5v-2.5a2.5 2.5 0 0 1 5 0v.5h-1v-.5ZM16.5 19a.5.5 0 0 0-.5.5v4c0 .28.22.5.5.5h6a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5h-6Zm2.5 4v-2h1v2h-1Z"/></svg>'
    },
    63975: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M17.27 4.56a2.5 2.5 0 0 0-3.54 0l-.58.59-9 9-1 1-.15.14V20h4.7l.15-.15 1-1 9-9 .59-.58a2.5 2.5 0 0 0 0-3.54l-1.17-1.17Zm-2.83.7a1.5 1.5 0 0 1 2.12 0l1.17 1.18a1.5 1.5 0 0 1 0 2.12l-.23.23-3.3-3.29.24-.23Zm-.94.95 3.3 3.29-8.3 8.3-3.3-3.3 8.3-8.3Zm-9 9 3.3 3.29-.5.5H4v-3.3l.5-.5Zm16.5.29a1.5 1.5 0 0 0-3 0V18h3v-2.5Zm1 0V18h.5c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5v-4c0-.83.67-1.5 1.5-1.5h.5v-2.5a2.5 2.5 0 0 1 5 0ZM16.5 19a.5.5 0 0 0-.5.5v4c0 .28.22.5.5.5h6a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5h-6Zm2.5 4v-2h1v2h-1Z"/></svg>'
    },
    34059: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30"><path fill="currentColor" d="M5.5 13A2.5 2.5 0 0 0 3 15.5 2.5 2.5 0 0 0 5.5 18 2.5 2.5 0 0 0 8 15.5 2.5 2.5 0 0 0 5.5 13zm9.5 0a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 15 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 15 13zm9.5 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"/></svg>'
    },
    63743: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M11.682 16.09l3.504 6.068 1.732-1-3.497-6.057 3.595-2.1L8 7.74v10.512l3.682-2.163zm-.362 1.372L7 20V6l12 7-4.216 2.462 3.5 6.062-3.464 2-3.5-6.062z"/></svg>'
    },
    18953: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path d="M18 15h8v-1h-8z"/><path d="M14 18v8h1v-8zM14 3v8h1v-8zM3 15h8v-1h-8z"/></g></svg>'
    },
    72196: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><circle fill="currentColor" cx="14" cy="14" r="3"/></svg>'
    },
    27999: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 31" width="29" height="31"><g fill="currentColor" fill-rule="nonzero"><path d="M15.3 22l8.187-8.187c.394-.394.395-1.028.004-1.418l-4.243-4.243c-.394-.394-1.019-.395-1.407-.006l-11.325 11.325c-.383.383-.383 1.018.007 1.407l1.121 1.121h7.656zm-9.484-.414c-.781-.781-.779-2.049-.007-2.821l11.325-11.325c.777-.777 2.035-.78 2.821.006l4.243 4.243c.781.781.78 2.048-.004 2.832l-8.48 8.48h-8.484l-1.414-1.414z"/><path d="M13.011 22.999h7.999v-1h-7.999zM13.501 11.294l6.717 6.717.707-.707-6.717-6.717z"/></g></svg>'
    },
    10862: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M24.13 14.65a6.2 6.2 0 0 0-.46-9.28c-2.57-2.09-6.39-1.71-8.75.6l-.92.91-.92-.9c-2.36-2.32-6.18-2.7-8.75-.61a6.2 6.2 0 0 0-.46 9.28l9.07 8.92c.58.57 1.53.57 2.12 0l9.07-8.92Zm-9.77 8.2 9.07-8.91a5.2 5.2 0 0 0-.39-7.8c-2.13-1.73-5.38-1.45-7.42.55L14 8.29l-1.62-1.6c-2.03-2-5.29-2.28-7.42-.55a5.2 5.2 0 0 0-.4 7.8l9.08 8.91c.2.2.52.2.72 0Z"/></svg>'
    },
    68385: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M14 10a2 2 0 0 0-2 2v11H6V12c0-4.416 3.584-8 8-8s8 3.584 8 8v11h-6V12a2 2 0 0 0-2-2zm-3 2a3 3 0 0 1 6 0v10h4V12c0-3.864-3.136-7-7-7s-7 3.136-7 7v10h4V12z"/><path d="M6.5 18h5v1h-5zm10 0h5v1h-5z"/></g></svg>'
    },
    88518: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" d="M2 9.75a1.5 1.5 0 0 0-1.5 1.5v5.5a1.5 1.5 0 0 0 1.5 1.5h24a1.5 1.5 0 0 0 1.5-1.5v-5.5a1.5 1.5 0 0 0-1.5-1.5zm0 1h3v2.5h1v-2.5h3.25v3.9h1v-3.9h3.25v2.5h1v-2.5h3.25v3.9h1v-3.9H22v2.5h1v-2.5h3a.5.5 0 0 1 .5.5v5.5a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-5.5a.5.5 0 0 1 .5-.5z" transform="rotate(-45 14 14)"/></svg>'
    },
    36515: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path fill-rule="nonzero" d="M14 18.634l-.307-.239-7.37-5.73-2.137-1.665 9.814-7.633 9.816 7.634-.509.394-1.639 1.269-7.667 5.969zm7.054-6.759l1.131-.876-8.184-6.366-8.186 6.367 1.123.875 7.063 5.491 7.054-5.492z"/><path d="M7 14.5l-1 .57 8 6.43 8-6.5-1-.5-7 5.5z"/><path d="M7 17.5l-1 .57 8 6.43 8-6.5-1-.5-7 5.5z"/></g></svg>'
    },
    7636: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M4.05 14a9.95 9.95 0 1 1 19.9 0 9.95 9.95 0 0 1-19.9 0ZM14 3a11 11 0 1 0 0 22 11 11 0 0 0 0-22Zm-3 13.03a.5.5 0 0 1 .64.3 2.5 2.5 0 0 0 4.72 0 .5.5 0 0 1 .94.34 3.5 3.5 0 0 1-6.6 0 .5.5 0 0 1 .3-.64Zm.5-4.53a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>'
    },
    62567: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M7 4h14a3 3 0 0 1 3 3v11c0 .34-.03.67-.08 1H20.3c-1.28 0-2.31.97-2.31 2.24V24H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm12 19.92A6 6 0 0 0 23.66 20H20.3c-.77 0-1.31.48-1.31 1.24v2.68ZM3 7a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v11a7 7 0 0 1-7 7H7a4 4 0 0 1-4-4V7Zm8 9.03a.5.5 0 0 1 .64.3 2.5 2.5 0 0 0 4.72 0 .5.5 0 0 1 .94.34 3.5 3.5 0 0 1-6.6 0 .5.5 0 0 1 .3-.64Zm.5-4.53a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>'
    },
    46049: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="nonzero" d="M14 5a7 7 0 0 0-7 7v3h4v-3a3 3 0 1 1 6 0v3h4v-3a7 7 0 0 0-7-7zm7 11h-4v3h4v-3zm-10 0H7v3h4v-3zm-5-4a8 8 0 1 1 16 0v8h-6v-8a2 2 0 1 0-4 0v8H6v-8zm3.293 11.294l-1.222-2.037.858-.514 1.777 2.963-2 1 1.223 2.037-.858.514-1.778-2.963 2-1zm9.778-2.551l.858.514-1.223 2.037 2 1-1.777 2.963-.858-.514 1.223-2.037-2-1 1.777-2.963z"/></svg>'
    },
    99088: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path fill-rule="nonzero" d="M15.039 5.969l-.019-.019-2.828 2.828.707.707 2.474-2.474c1.367-1.367 3.582-1.367 4.949 0s1.367 3.582 0 4.949l-2.474 2.474.707.707 2.828-2.828-.019-.019c1.415-1.767 1.304-4.352-.334-5.99-1.638-1.638-4.224-1.749-5.99-.334zM5.97 15.038l-.019-.019 2.828-2.828.707.707-2.475 2.475c-1.367 1.367-1.367 3.582 0 4.949s3.582 1.367 4.949 0l2.474-2.474.707.707-2.828 2.828-.019-.019c-1.767 1.415-4.352 1.304-5.99-.334-1.638-1.638-1.749-4.224-.334-5.99z"/><path d="M10.485 16.141l5.656-5.656.707.707-5.656 5.656z"/></g></svg>'
    },
    42650: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M19.76 6.07l-.7.7a13.4 13.4 0 011.93 2.47c.19.3.33.55.42.72l.03.04-.03.04a15 15 0 01-2.09 2.9c-1.47 1.6-3.6 3.12-6.32 3.12-.98 0-1.88-.2-2.7-.52l-.77.76c1.03.47 2.18.76 3.47.76 3.12 0 5.5-1.75 7.06-3.44a16 16 0 002.38-3.38v-.02h.01L22 10l.45.22.1-.22-.1-.22L22 10l.45-.22-.01-.02a5.1 5.1 0 00-.15-.28 16 16 0 00-2.53-3.41zM6.24 13.93l.7-.7-.27-.29a15 15 0 01-2.08-2.9L4.56 10l.03-.04a15 15 0 012.09-2.9c1.47-1.6 3.6-3.12 6.32-3.12.98 0 1.88.2 2.7.52l.77-.76A8.32 8.32 0 0013 2.94c-3.12 0-5.5 1.75-7.06 3.44a16 16 0 00-2.38 3.38v.02h-.01L4 10l-.45-.22-.1.22.1.22L4 10l-.45.22.01.02a5.5 5.5 0 00.15.28 16 16 0 002.53 3.41zm6.09-.43a3.6 3.6 0 004.24-4.24l-.93.93a2.6 2.6 0 01-2.36 2.36l-.95.95zm-1.97-3.69l-.93.93a3.6 3.6 0 014.24-4.24l-.95.95a2.6 2.6 0 00-2.36 2.36zm11.29 7.84l-.8.79a1.5 1.5 0 000 2.12l.59.59a1.5 1.5 0 002.12 0l1.8-1.8-.71-.7-1.8 1.79a.5.5 0 01-.7 0l-.59-.59a.5.5 0 010-.7l.8-.8-.71-.7zm-5.5 3.5l.35.35-.35-.35.01-.02.02-.02.02-.02a4.68 4.68 0 01.65-.5c.4-.27 1-.59 1.65-.59.66 0 1.28.33 1.73.77.44.45.77 1.07.77 1.73a2.5 2.5 0 01-.77 1.73 2.5 2.5 0 01-1.73.77h-4a.5.5 0 01-.42-.78l1-1.5 1-1.5a.5.5 0 01.07-.07zm.74.67a3.46 3.46 0 01.51-.4c.35-.24.75-.42 1.1-.42.34 0 .72.17 1.02.48.3.3.48.68.48 1.02 0 .34-.17.72-.48 1.02-.3.3-.68.48-1.02.48h-3.07l.49-.72.97-1.46zM21.2 2.5L5.5 18.2l-.7-.7L20.5 1.8l.7.7z"/></svg>'
    },
    75895: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" d="M16.47 3.7A8.32 8.32 0 0013 2.94c-3.12 0-5.5 1.75-7.06 3.44a16 16 0 00-2.38 3.38v.02h-.01L4 10l-.45-.22-.1.22.1.22L4 10l-.45.22.01.02a5.5 5.5 0 00.15.28 16 16 0 002.53 3.41l.7-.7-.27-.29a15 15 0 01-2.08-2.9L4.56 10l.03-.04a15 15 0 012.09-2.9c1.47-1.6 3.6-3.12 6.32-3.12.98 0 1.88.2 2.7.52l.77-.76zm-7.04 7.04l.93-.93a2.6 2.6 0 012.36-2.36l.95-.95a3.6 3.6 0 00-4.24 4.24zm.1 5.56c1.03.47 2.18.76 3.47.76 3.12 0 5.5-1.75 7.06-3.44a16 16 0 002.38-3.38v-.02h.01L22 10l.45.22.1-.22-.1-.22L22 10l.45-.22-.01-.02-.02-.03-.01-.03a9.5 9.5 0 00-.57-1 16 16 0 00-2.08-2.63l-.7.7.27.29a15.01 15.01 0 012.08 2.9l.03.04-.03.04a15 15 0 01-2.09 2.9c-1.47 1.6-3.6 3.12-6.32 3.12-.98 0-1.88-.2-2.7-.52l-.77.76zm2.8-2.8a3.6 3.6 0 004.24-4.24l-.93.93a2.6 2.6 0 01-2.36 2.36l-.95.95zm7.9 3.73c-.12.12-.23.35-.23.77v2h1v1h-1v2c0 .58-.14 1.1-.52 1.48-.38.38-.9.52-1.48.52s-1.1-.14-1.48-.52c-.38-.38-.52-.9-.52-1.48h1c0 .42.1.65.23.77.12.12.35.23.77.23.42 0 .65-.1.77-.23.12-.12.23-.35.23-.77v-2h-1v-1h1v-2c0-.58.14-1.1.52-1.48.38-.38.9-.52 1.48-.52s1.1.14 1.48.52c.38.38.52.9.52 1.48h-1c0-.42-.1-.65-.23-.77-.12-.12-.35-.23-.77-.23-.42 0-.65.1-.77.23zm2.56 6.27l-1.14-1.15.7-.7 1.15 1.14 1.15-1.14.7.7-1.14 1.15 1.14 1.15-.7.7-1.15-1.14-1.15 1.14-.7-.7 1.14-1.15zM21.2 2.5L5.5 18.2l-.7-.7L20.5 1.8l.7.7z"/></svg>'
    },
    65162: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M5.5 18.2L21.2 2.5l-.7-.7L4.8 17.5l.7.7zM19.05 6.78l.71-.7a14.26 14.26 0 0 1 2.08 2.64 14.26 14.26 0 0 1 .6 1.05v.02h.01L22 10l.45.22-.01.02a5.18 5.18 0 0 1-.15.28 16 16 0 0 1-2.23 3.1c-1.56 1.69-3.94 3.44-7.06 3.44-1.29 0-2.44-.3-3.47-.76l.76-.76c.83.32 1.73.52 2.71.52 2.73 0 4.85-1.53 6.33-3.12a15.01 15.01 0 0 0 2.08-2.9l.03-.04-.03-.04a15 15 0 0 0-2.36-3.18zM22 10l.45-.22.1.22-.1.22L22 10zM6.94 13.23l-.7.7a14.24 14.24 0 0 1-2.08-2.64 14.28 14.28 0 0 1-.6-1.05v-.02h-.01L4 10l-.45-.22.01-.02a5.55 5.55 0 0 1 .15-.28 16 16 0 0 1 2.23-3.1C7.5 4.69 9.88 2.94 13 2.94c1.29 0 2.44.3 3.47.76l-.76.76A7.27 7.27 0 0 0 13 3.94c-2.73 0-4.85 1.53-6.33 3.12a15 15 0 0 0-2.08 2.9l-.03.04.03.04a15.01 15.01 0 0 0 2.36 3.18zM4 10l-.45.22-.1-.22.1-.22L4 10zm9 3.56c-.23 0-.46-.02-.67-.06l.95-.95a2.6 2.6 0 0 0 2.36-2.36l.93-.93a3.6 3.6 0 0 1-3.57 4.3zm-3.57-2.82l.93-.93a2.6 2.6 0 0 1 2.36-2.36l.95-.95a3.6 3.6 0 0 0-4.24 4.24zM17.5 21.9l3.28 2.18a.5.5 0 1 1-.56.84L17.5 23.1l-2.72 1.82a.5.5 0 1 1-.56-.84l3.28-2.18zM18.58 19.22a.5.5 0 0 1 .7-.14L22 20.9l2.72-1.82a.5.5 0 0 1 .56.84L22 22.1l-3.28-2.18a.5.5 0 0 1-.14-.7z"/></svg>'
    },
    65186: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M14 6a3 3 0 0 0-3 3v3h6V9a3 3 0 0 0-3-3zm4 6V9a4 4 0 0 0-8 0v3H8.5A2.5 2.5 0 0 0 6 14.5v7A2.5 2.5 0 0 0 8.5 24h11a2.5 2.5 0 0 0 2.5-2.5v-7a2.5 2.5 0 0 0-2.5-2.5H18zm-5 5a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm-6-2.5c0-.83.67-1.5 1.5-1.5h11c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 7 21.5v-7z"/></svg>'
    },
    91244: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M14 6a3 3 0 0 0-3 3v3h8.5a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 6 21.5v-7A2.5 2.5 0 0 1 8.5 12H10V9a4 4 0 0 1 8 0h-1a3 3 0 0 0-3-3zm-1 11a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm-6-2.5c0-.83.67-1.5 1.5-1.5h11c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 7 21.5v-7z"/></svg>'
    },
    45820: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.56 14a10.05 10.05 0 00.52.91c.41.69 1.04 1.6 1.85 2.5C8.58 19.25 10.95 21 14 21c3.05 0 5.42-1.76 7.07-3.58A17.18 17.18 0 0023.44 14a9.47 9.47 0 00-.52-.91c-.41-.69-1.04-1.6-1.85-2.5C19.42 8.75 17.05 7 14 7c-3.05 0-5.42 1.76-7.07 3.58A17.18 17.18 0 004.56 14zM24 14l.45-.21-.01-.03a7.03 7.03 0 00-.16-.32c-.11-.2-.28-.51-.5-.87-.44-.72-1.1-1.69-1.97-2.65C20.08 7.99 17.45 6 14 6c-3.45 0-6.08 2-7.8 3.92a18.18 18.18 0 00-2.64 3.84v.02h-.01L4 14l-.45-.21-.1.21.1.21L4 14l-.45.21.01.03a5.85 5.85 0 00.16.32c.11.2.28.51.5.87.44.72 1.1 1.69 1.97 2.65C7.92 20.01 10.55 22 14 22c3.45 0 6.08-2 7.8-3.92a18.18 18.18 0 002.64-3.84v-.02h.01L24 14zm0 0l.45.21.1-.21-.1-.21L24 14zm-10-3a3 3 0 100 6 3 3 0 000-6zm-4 3a4 4 0 118 0 4 4 0 01-8 0z"/></svg>'
    },
    93756: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M5 10.76l-.41-.72-.03-.04.03-.04a15 15 0 012.09-2.9c1.47-1.6 3.6-3.12 6.32-3.12 2.73 0 4.85 1.53 6.33 3.12a15.01 15.01 0 012.08 2.9l.03.04-.03.04a15 15 0 01-2.09 2.9c-1.47 1.6-3.6 3.12-6.32 3.12-2.73 0-4.85-1.53-6.33-3.12a15 15 0 01-1.66-2.18zm17.45-.98L22 10l.45.22-.01.02a5.04 5.04 0 01-.15.28 16.01 16.01 0 01-2.23 3.1c-1.56 1.69-3.94 3.44-7.06 3.44-3.12 0-5.5-1.75-7.06-3.44a16 16 0 01-2.38-3.38v-.02h-.01L4 10l-.45-.22.01-.02a5.4 5.4 0 01.15-.28 16 16 0 012.23-3.1C7.5 4.69 9.88 2.94 13 2.94c3.12 0 5.5 1.75 7.06 3.44a16.01 16.01 0 012.38 3.38v.02h.01zM22 10l.45-.22.1.22-.1.22L22 10zM3.55 9.78L4 10l-.45.22-.1-.22.1-.22zm6.8.22A2.6 2.6 0 0113 7.44 2.6 2.6 0 0115.65 10 2.6 2.6 0 0113 12.56 2.6 2.6 0 0110.35 10zM13 6.44A3.6 3.6 0 009.35 10 3.6 3.6 0 0013 13.56c2 0 3.65-1.58 3.65-3.56A3.6 3.6 0 0013 6.44zm7.85 12l.8-.8.7.71-.79.8a.5.5 0 000 .7l.59.59c.2.2.5.2.7 0l1.8-1.8.7.71-1.79 1.8a1.5 1.5 0 01-2.12 0l-.59-.59a1.5 1.5 0 010-2.12zM16.5 21.5l-.35-.35a.5.5 0 00-.07.07l-1 1.5-1 1.5a.5.5 0 00.42.78h4a2.5 2.5 0 001.73-.77A2.5 2.5 0 0021 22.5a2.5 2.5 0 00-.77-1.73A2.5 2.5 0 0018.5 20a3.1 3.1 0 00-1.65.58 5.28 5.28 0 00-.69.55v.01h-.01l.35.36zm.39.32l-.97 1.46-.49.72h3.07c.34 0 .72-.17 1.02-.48.3-.3.48-.68.48-1.02 0-.34-.17-.72-.48-1.02-.3-.3-.68-.48-1.02-.48-.35 0-.75.18-1.1.42a4.27 4.27 0 00-.51.4z"/></svg>'
    },
    42321: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M5 10.76a13.27 13.27 0 01-.41-.72L4.56 10l.03-.04a15 15 0 012.08-2.9c1.48-1.6 3.6-3.12 6.33-3.12s4.85 1.53 6.33 3.12a15.01 15.01 0 012.08 2.9l.03.04-.03.04a15 15 0 01-2.08 2.9c-1.48 1.6-3.6 3.12-6.33 3.12s-4.85-1.53-6.33-3.12a15 15 0 01-1.66-2.18zm17.45-.98L22 10l.45.22-.01.02a14.3 14.3 0 01-.6 1.05c-.4.64-1 1.48-1.78 2.33-1.56 1.7-3.94 3.44-7.06 3.44s-5.5-1.75-7.06-3.44a16 16 0 01-2.23-3.1 9.39 9.39 0 01-.15-.28v-.02h-.01L4 10l-.45-.22.01-.02a5.59 5.59 0 01.15-.28 16 16 0 012.23-3.1C7.5 4.69 9.87 2.94 13 2.94c3.12 0 5.5 1.75 7.06 3.44a16 16 0 012.23 3.1 9.5 9.5 0 01.15.28v.01l.01.01zM22 10l.45-.22.1.22-.1.22L22 10zM3.55 9.78L4 10l-.45.22-.1-.22.1-.22zm6.8.22A2.6 2.6 0 0113 7.44 2.6 2.6 0 0115.65 10 2.6 2.6 0 0113 12.56 2.6 2.6 0 0110.35 10zM13 6.44A3.6 3.6 0 009.35 10c0 1.98 1.65 3.56 3.65 3.56s3.65-1.58 3.65-3.56A3.6 3.6 0 0013 6.44zM20 18c0-.42.1-.65.23-.77.12-.13.35-.23.77-.23.42 0 .65.1.77.23.13.12.23.35.23.77h1c0-.58-.14-1.1-.52-1.48-.38-.38-.9-.52-1.48-.52s-1.1.14-1.48.52c-.37.38-.52.9-.52 1.48v2h-1v1h1v2c0 .42-.1.65-.23.77-.12.13-.35.23-.77.23-.42 0-.65-.1-.77-.23-.13-.12-.23-.35-.23-.77h-1c0 .58.14 1.1.52 1.48.38.37.9.52 1.48.52s1.1-.14 1.48-.52c.37-.38.52-.9.52-1.48v-2h1v-1h-1v-2zm1.65 4.35l1.14 1.15-1.14 1.15.7.7 1.15-1.14 1.15 1.14.7-.7-1.14-1.15 1.14-1.15-.7-.7-1.15 1.14-1.15-1.14-.7.7z"/></svg>'
    },
    57313: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.5 10a8.46 8.46 0 0 0 .46.8c.38.6.94 1.4 1.68 2.19 1.48 1.6 3.62 3.13 6.36 3.13s4.88-1.53 6.36-3.13A15.07 15.07 0 0 0 21.5 10a7.41 7.41 0 0 0-.46-.8c-.38-.6-.94-1.4-1.68-2.19-1.48-1.6-3.62-3.13-6.36-3.13S8.12 5.4 6.64 7A15.07 15.07 0 0 0 4.5 10zM22 10l.41-.19-.4.19zm0 0l.41.19-.4-.19zm.41.19l.09-.19-.09-.19-.01-.02a6.86 6.86 0 0 0-.15-.28c-.1-.18-.25-.45-.45-.76-.4-.64-.99-1.48-1.77-2.32C18.47 4.74 16.11 3 13 3 9.89 3 7.53 4.74 5.97 6.43A15.94 15.94 0 0 0 3.6 9.79v.02h-.01L3.5 10l.09.19.01.02a6.59 6.59 0 0 0 .15.28c.1.18.25.45.45.76.4.64.99 1.48 1.77 2.32C7.53 15.26 9.89 17 13 17c3.11 0 5.47-1.74 7.03-3.43a15.94 15.94 0 0 0 2.37-3.36v-.02h.01zM4 10l-.41-.19.4.19zm9-2.63c-1.5 0-2.7 1.18-2.7 2.63s1.2 2.63 2.7 2.63c1.5 0 2.7-1.18 2.7-2.63S14.5 7.37 13 7.37zM9.4 10C9.4 8.07 11 6.5 13 6.5s3.6 1.57 3.6 3.5S15 13.5 13 13.5A3.55 3.55 0 0 1 9.4 10zm8.1 11.9l3.28 2.18a.5.5 0 1 1-.56.84L17.5 23.1l-2.72 1.82a.5.5 0 1 1-.56-.84l3.28-2.18zm1.78-2.82a.5.5 0 0 0-.56.84L22 22.1l3.28-2.18a.5.5 0 1 0-.56-.84L22 20.9l-2.72-1.82z"/></svg>'
    },
    6894: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17.646 18.354l4 4 .708-.708-4-4z"/><path d="M12.5 21a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17zm0-1a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"/><path d="M9 13h7v-1H9z"/><path d="M13 16V9h-1v7z"/></svg>'
    },
    45360: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17.646 18.354l4 4 .708-.708-4-4z"/><path d="M12.5 21a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17zm0-1a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"/><path d="M9 13h7v-1H9z"/></svg>'
    },
  },
])
