;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2846],
  {
    59142: (e, o) => {
      var l, n, i
      ;(n = [o]),
        (l = (e) => {
          function o(e) {
            if (Array.isArray(e)) {
              for (var o = 0, l = Array(e.length); o < e.length; o++)
                l[o] = e[o]
              return l
            }
            return Array.from(e)
          }
          Object.defineProperty(e, '__esModule', { value: !0 })
          var l = !1
          if ('undefined' != typeof window) {
            var n = {
              get passive() {
                l = !0
              },
            }
            window.addEventListener('testPassive', null, n),
              window.removeEventListener('testPassive', null, n)
          }
          var i =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            t = [],
            r = !1,
            a = -1,
            s = void 0,
            c = void 0,
            v = (e) =>
              t.some(
                (o) =>
                  !(!o.options.allowTouchMove || !o.options.allowTouchMove(e)),
              ),
            d = (e) => {
              var o = e || window.event
              return (
                !!v(o.target) ||
                1 < o.touches.length ||
                (o.preventDefault && o.preventDefault(), !1)
              )
            },
            h = () => {
              setTimeout(() => {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== s &&
                    ((document.body.style.overflow = s), (s = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, n) => {
            if (i) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !t.some((o) => o.targetElement === e)) {
                var h = { targetElement: e, options: n || {} }
                ;(t = [].concat(o(t), [h])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (a = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (o) => {
                    var l, n, i, t
                    1 === o.targetTouches.length &&
                      ((n = e),
                      (t = (l = o).targetTouches[0].clientY - a),
                      !v(l.target) &&
                        ((n && 0 === n.scrollTop && 0 < t) ||
                        ((i = n) &&
                          i.scrollHeight - i.scrollTop <= i.clientHeight &&
                          t < 0)
                          ? d(l)
                          : l.stopPropagation()))
                  }),
                  r ||
                    (document.addEventListener(
                      'touchmove',
                      d,
                      l ? { passive: !1 } : void 0,
                    ),
                    (r = !0))
              }
            } else {
              ;(u = n),
                setTimeout(() => {
                  if (void 0 === c) {
                    var e = !!u && !0 === u.reserveScrollBarGap,
                      o =
                        window.innerWidth - document.documentElement.clientWidth
                    e &&
                      0 < o &&
                      ((c = document.body.style.paddingRight),
                      (document.body.style.paddingRight = o + 'px'))
                  }
                  void 0 === s &&
                    ((s = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var m = { targetElement: e, options: n || {} }
              t = [].concat(o(t), [m])
            }
            var u
          }),
            (e.clearAllBodyScrollLocks = () => {
              i
                ? (t.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  r &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      l ? { passive: !1 } : void 0,
                    ),
                    (r = !1)),
                  (t = []),
                  (a = -1))
                : (h(), (t = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (i) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (t = t.filter((o) => o.targetElement !== e)),
                  r &&
                    0 === t.length &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      l ? { passive: !1 } : void 0,
                    ),
                    (r = !1))
              } else
                1 === t.length && t[0].targetElement === e
                  ? (h(), (t = []))
                  : (t = t.filter((o) => o.targetElement !== e))
            })
        }),
        void 0 === (i = 'function' == typeof l ? l.apply(o, n) : l) ||
          (e.exports = i)
    },
    14877: (e) => {
      e.exports = {
        favorite: 'favorite-_FRQhM5Y',
        hovered: 'hovered-_FRQhM5Y',
        disabled: 'disabled-_FRQhM5Y',
        active: 'active-_FRQhM5Y',
        checked: 'checked-_FRQhM5Y',
      }
    },
    50238: (e, o, l) => {
      l.d(o, {
        useRovingTabindexElement: () => r,
      })
      var n = l(50959),
        i = l(39416),
        t = l(16838)
      function r(e, o = []) {
        const [l, r] = (0, n.useState)(!1),
          a = (0, i.useFunctionalRefObject)(e)
        return (
          (0, n.useLayoutEffect)(() => {
            if (!t.PLATFORM_ACCESSIBILITY_ENABLED) return
            const e = a.current
            if (null === e) return
            const o = (e) => {
              switch (e.type) {
                case 'roving-tabindex:main-element':
                  r(!0)
                  break
                case 'roving-tabindex:secondary-element':
                  r(!1)
              }
            }
            return (
              e.addEventListener('roving-tabindex:main-element', o),
              e.addEventListener('roving-tabindex:secondary-element', o),
              () => {
                e.removeEventListener('roving-tabindex:main-element', o),
                  e.removeEventListener('roving-tabindex:secondary-element', o)
              }
            )
          }, o),
          [a, t.PLATFORM_ACCESSIBILITY_ENABLED ? (l ? 0 : -1) : void 0]
        )
      }
    },
    36189: (e, o, l) => {
      l.d(o, { FavoriteButton: () => d })
      var n = l(11542),
        i = l(50959),
        t = l(97754),
        r = l(9745),
        a = l(39146),
        s = l(48010),
        c = l(14877)
      const v = {
        add: n.t(null, void 0, l(44629)),
        remove: n.t(null, void 0, l(72482)),
      }
      function d(e) {
        const { className: o, isFilled: l, isActive: n, onClick: d, ...h } = e
        return i.createElement(r.Icon, {
          ...h,
          className: t(
            c.favorite,
            'apply-common-tooltip',
            l && c.checked,
            n && c.active,
            o,
          ),
          icon: l ? a : s,
          onClick: d,
          title: l ? v.remove : v.add,
        })
      }
    },
    86656: (e, o, l) => {
      l.d(o, { TouchScrollContainer: () => a })
      var n = l(50959),
        i = l(59142),
        t = l(50151),
        r = l(49483)
      const a = (0, n.forwardRef)((e, o) => {
        const { children: l, ...t } = e,
          a = (0, n.useRef)(null)
        return (
          (0, n.useImperativeHandle)(o, () => a.current),
          (0, n.useLayoutEffect)(() => {
            if (r.CheckMobile.iOS())
              return (
                null !== a.current &&
                  (0, i.disableBodyScroll)(a.current, { allowTouchMove: s(a) }),
                () => {
                  null !== a.current && (0, i.enableBodyScroll)(a.current)
                }
              )
          }, []),
          n.createElement('div', { ref: a, ...t }, l)
        )
      })
      function s(e) {
        return (o) => {
          const l = (0, t.ensureNotNull)(e.current),
            n = document.activeElement
          return (
            !l.contains(o) || (null !== n && l.contains(n) && n.contains(o))
          )
        }
      }
    },
    71468: (e, o, l) => {
      function n(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function i(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      l.d(o, { becomeMainElement: () => n, becomeSecondaryElement: () => i })
    },
    87872: (e, o, l) => {
      l.d(o, { drawingToolsIcons: () => n })
      const n = {
        SyncDrawing: l(99088),
        arrow: l(63743),
        cursor: l(18953),
        dot: l(72196),
        performance: '',
        drawginmode: l(53950),
        drawginmodeActive: l(1532),
        eraser: l(27999),
        group: l(19799),
        hideAllDrawings: l(45820),
        hideAllDrawingsActive: l(84959),
        hideAllIndicators: l(42321),
        hideAllIndicatorsActive: l(75895),
        hideAllDrawingTools: l(93756),
        hideAllDrawingToolsActive: l(42650),
        hideAllPositionsTools: l(57313),
        hideAllPositionsToolsActive: l(65162),
        lockAllDrawings: l(91244),
        lockAllDrawingsActive: l(65186),
        magnet: l(68385),
        heart: l(10862),
        smile: l(7636),
        sticker: l(62567),
        strongMagnet: l(46049),
        measure: l(88518),
        removeAllDrawingTools: l(35149),
        showObjectsTree: l(36515),
        zoom: l(6894),
        'zoom-out': l(45360),
      }
    },
    80982: (e, o, l) => {
      l.d(o, {
        isLineToolsGroupWithSections: () => r,
        lineTools: () => t,
        lineToolsFlat: () => a,
      })
      var n = l(11542),
        i = l(1722)
      const t = [
        {
          id: 'linetool-group-cursors',
          title: n.t(null, void 0, l(82401)),
          items: [
            { name: 'cursor' },
            { name: 'dot' },
            { name: 'arrow' },
            { name: 'eraser' },
            null,
          ].filter(i.isExistent),
          trackLabel: null,
        },
        {
          id: 'linetool-group-trend-line',
          title: n.t(null, void 0, l(18794)),
          sections: [
            {
              title: n.t(null, void 0, l(83182)),
              items: [
                { name: 'LineToolTrendLine' },
                { name: 'LineToolRay' },
                { name: 'LineToolInfoLine' },
                { name: 'LineToolExtended' },
                { name: 'LineToolTrendAngle' },
                { name: 'LineToolHorzLine' },
                { name: 'LineToolHorzRay' },
                { name: 'LineToolVertLine' },
                { name: 'LineToolCrossLine' },
              ],
            },
            {
              title: n.t(null, void 0, l(19022)),
              items: [
                { name: 'LineToolParallelChannel' },
                { name: 'LineToolRegressionTrend' },
                { name: 'LineToolFlatBottom' },
                { name: 'LineToolDisjointAngle' },
              ],
            },
            {
              title: n.t(null, void 0, l(73359)),
              items: [
                { name: 'LineToolPitchfork' },
                { name: 'LineToolSchiffPitchfork2' },
                { name: 'LineToolSchiffPitchfork' },
                { name: 'LineToolInsidePitchfork' },
              ],
            },
          ],
          trackLabel: null,
        },
        {
          id: 'linetool-group-gann-and-fibonacci',
          title: n.t(null, void 0, l(5816)),
          sections: [
            {
              title: n.t(null, void 0, l(22305)),
              items: [
                { name: 'LineToolFibRetracement' },
                { name: 'LineToolTrendBasedFibExtension' },
                { name: 'LineToolFibChannel' },
                { name: 'LineToolFibTimeZone' },
                { name: 'LineToolFibSpeedResistanceFan' },
                { name: 'LineToolTrendBasedFibTime' },
                { name: 'LineToolFibCircles' },
                { name: 'LineToolFibSpiral' },
                { name: 'LineToolFibSpeedResistanceArcs' },
                { name: 'LineToolFibWedge' },
                { name: 'LineToolPitchfan' },
              ],
            },
            {
              title: n.t(null, void 0, l(43884)),
              items: [
                { name: 'LineToolGannSquare' },
                { name: 'LineToolGannFixed' },
                { name: 'LineToolGannComplex' },
                { name: 'LineToolGannFan' },
              ],
            },
          ],
          trackLabel: null,
        },
        {
          id: 'linetool-group-patterns',
          title: n.t(null, void 0, l(19693)),
          sections: [
            {
              title: n.t(null, void 0, l(19693)),
              items: [
                { name: 'LineTool5PointsPattern' },
                { name: 'LineToolCypherPattern' },
                { name: 'LineToolHeadAndShoulders' },
                { name: 'LineToolABCD' },
                { name: 'LineToolTrianglePattern' },
                { name: 'LineToolThreeDrivers' },
              ],
            },
            {
              title: n.t(null, void 0, l(88280)),
              items: [
                { name: 'LineToolElliottImpulse' },
                { name: 'LineToolElliottCorrection' },
                { name: 'LineToolElliottTriangle' },
                { name: 'LineToolElliottDoubleCombo' },
                { name: 'LineToolElliottTripleCombo' },
              ],
            },
            {
              title: n.t(null, void 0, l(50025)),
              items: [
                { name: 'LineToolCircleLines' },
                { name: 'LineToolTimeCycles' },
                { name: 'LineToolSineLine' },
              ],
            },
          ],
          trackLabel: null,
        },
        {
          id: 'linetool-group-prediction-and-measurement',
          title: n.t(null, void 0, l(97100)),
          sections: [
            {
              title: n.t(null, void 0, l(87086)),
              items: [
                { name: 'LineToolRiskRewardLong' },
                { name: 'LineToolRiskRewardShort' },
                { name: 'LineToolPrediction' },
                { name: 'LineToolBarsPattern' },
                { name: 'LineToolGhostFeed' },
                { name: 'LineToolProjection' },
              ].filter(i.isExistent),
            },
            {
              title: n.t(null, void 0, l(89967)),
              items: [
                { name: 'LineToolAnchoredVWAP' },
                { name: 'LineToolFixedRangeVolumeProfile' },
                null,
              ].filter(i.isExistent),
            },
            {
              title: n.t(null, void 0, l(79961)),
              items: [
                { name: 'LineToolPriceRange' },
                { name: 'LineToolDateRange' },
                { name: 'LineToolDateAndPriceRange' },
              ],
            },
          ],
          trackLabel: null,
        },
        {
          id: 'linetool-group-geometric-shapes',
          title: n.t(null, void 0, l(22146)),
          sections: [
            {
              title: n.t(null, void 0, l(55939)),
              items: [
                { name: 'LineToolBrush' },
                { name: 'LineToolHighlighter' },
              ],
            },
            {
              title: n.t(null, void 0, l(23969)),
              items: [
                { name: 'LineToolArrowMarker' },
                { name: 'LineToolArrow' },
                { name: 'LineToolArrowMarkUp' },
                { name: 'LineToolArrowMarkDown' },
                { name: 'LineToolArrowMarkLeft' },
                { name: 'LineToolArrowMarkRight' },
              ].filter(i.isExistent),
            },
            {
              title: n.t(null, void 0, l(25792)),
              items: [
                {
                  name: 'LineToolRectangle',
                },
                { name: 'LineToolRotatedRectangle' },
                { name: 'LineToolPath' },
                { name: 'LineToolCircle' },
                { name: 'LineToolEllipse' },
                { name: 'LineToolPolyline' },
                { name: 'LineToolTriangle' },
                { name: 'LineToolArc' },
                { name: 'LineToolBezierQuadro' },
                { name: 'LineToolBezierCubic' },
              ],
            },
          ],
          trackLabel: null,
        },
        {
          id: 'linetool-group-annotation',
          title: n.t(null, void 0, l(19661)),
          sections: [
            {
              title: n.t(null, void 0, l(20916)),
              items: [
                { name: 'LineToolText' },
                { name: 'LineToolTextAbsolute' },
                { name: 'LineToolNote' },
                { name: 'LineToolNoteAbsolute' },
                { name: 'LineToolCallout' },
                { name: 'LineToolComment' },
                { name: 'LineToolPriceLabel' },
                { name: 'LineToolPriceNote' },
                { name: 'LineToolSignpost' },
                { name: 'LineToolFlagMark' },
              ],
            },
            {
              title: n.t(null, void 0, l(39176)),
              items: [null, null, null].filter(i.isExistent),
            },
          ],
          trackLabel: null,
        },
      ]
      function r(e) {
        return 'sections' in e
      }
      const a = t.flatMap((e) =>
        r(e) ? e.sections.flatMap((e) => e.items) : e.items,
      )
    },
    78036: (e, o, l) => {
      l.d(o, { lineToolsInfo: () => f })
      var n = l(50151),
        i = l(11542),
        t = l(61814),
        r = (l(42053), l(57673)),
        a = l(87872)
      const s = {
        SyncDrawing: i.t(null, void 0, l(36551)),
        arrow: i.t(null, void 0, l(96237)),
        cursor: i.t(null, void 0, l(29908)),
        dot: i.t(null, void 0, l(60925)),
        performance: i.t(null, void 0, l(79165)),
        drawginmode: i.t(null, void 0, l(49421)),
        eraser: i.t(null, void 0, l(99289)),
        group: i.t(null, void 0, l(91977)),
        hideAllDrawings: i.t(null, void 0, l(17517)),
        lockAllDrawings: i.t(null, void 0, l(37057)),
        magnet: i.t(null, void 0, l(37140)),
        measure: i.t(null, void 0, l(59607)),
        removeAllDrawingTools: i.t(null, void 0, l(76091)),
        showObjectsTree: i.t(null, void 0, l(51072)),
        zoom: i.t(null, void 0, l(38925)),
        'zoom-out': i.t(null, void 0, l(49895)),
      }
      var c = l(59656),
        v = l(68335),
        d = l(86972)
      const h = (0, v.humanReadableModifiers)(v.Modifiers.Shift, !1),
        m = (0, v.humanReadableModifiers)(v.Modifiers.Alt, !1),
        u = (0, v.humanReadableModifiers)(v.Modifiers.Mod, !1),
        g = { keys: [h], text: i.t(null, void 0, l(40234)) },
        L = { keys: [h], text: i.t(null, void 0, l(68125)) },
        w = { keys: [h], text: i.t(null, void 0, l(81591)) },
        T = {
          LineTool5PointsPattern: {},
          LineToolABCD: {},
          LineToolArc: {},
          LineToolArrow: {},
          LineToolArrowMarkDown: {},
          LineToolArrowMarkLeft: {},
          LineToolArrowMarkRight: {},
          LineToolArrowMarkUp: {},
          LineToolBalloon: {},
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
          LineToolDisjointAngle: { hotKey: (0, t.hotKeySerialize)(g) },
          LineToolElliottCorrection: {},
          LineToolElliottDoubleCombo: {},
          LineToolElliottImpulse: {},
          LineToolElliottTriangle: {},
          LineToolElliottTripleCombo: {},
          LineToolEllipse: { hotKey: (0, t.hotKeySerialize)(L) },
          LineToolExtended: {},
          LineToolFibChannel: {},
          LineToolFibCircles: { hotKey: (0, t.hotKeySerialize)(L) },
          LineToolFibRetracement: {},
          LineToolFibSpeedResistanceArcs: {},
          LineToolFibSpeedResistanceFan: { hotKey: (0, t.hotKeySerialize)(w) },
          LineToolFibSpiral: {},
          LineToolFibTimeZone: {},
          LineToolFibWedge: {},
          LineToolFlagMark: {},
          LineToolFlatBottom: { hotKey: (0, t.hotKeySerialize)(g) },
          LineToolAnchoredVWAP: {},
          LineToolGannComplex: {},
          LineToolGannFixed: {},
          LineToolGannFan: {},
          LineToolGannSquare: {
            hotKey: (0, t.hotKeySerialize)({
              keys: [h],
              text: i.t(null, void 0, l(10289)),
            }),
          },
          LineToolHeadAndShoulders: {},
          LineToolHorzLine: {
            hotKey: (0, t.hotKeySerialize)({
              keys: [m, 'H'],
              text: '{0} + {1}',
            }),
          },
          LineToolHorzRay: {},
          LineToolIcon: {},
          LineToolEmoji: {},
          LineToolInsidePitchfork: {},
          LineToolNote: {},
          LineToolNoteAbsolute: {},
          LineToolSignpost: {},
          LineToolParallelChannel: { hotKey: (0, t.hotKeySerialize)(g) },
          LineToolPitchfan: {},
          LineToolPitchfork: {},
          LineToolPolyline: {},
          LineToolPath: {},
          LineToolPrediction: {},
          LineToolPriceLabel: {},
          LineToolPriceNote: { hotKey: (0, t.hotKeySerialize)(g) },
          LineToolArrowMarker: {},
          LineToolPriceRange: {},
          LineToolProjection: {},
          LineToolRay: {},
          LineToolRectangle: {
            hotKey: (0, t.hotKeySerialize)({
              keys: [h],
              text: i.t(null, void 0, l(81591)),
            }),
          },
          LineToolCircle: {},
          LineToolRegressionTrend: {},
          LineToolRiskRewardLong: {},
          LineToolRiskRewardShort: {},
          LineToolFixedRangeVolumeProfile: {},
          LineToolRotatedRectangle: { hotKey: (0, t.hotKeySerialize)(g) },
          LineToolSchiffPitchfork: {},
          LineToolSchiffPitchfork2: {},
          LineToolSineLine: {},
          LineToolText: {},
          LineToolTextAbsolute: {},
          LineToolThreeDrivers: {},
          LineToolTimeCycles: {},
          LineToolTrendAngle: { hotKey: (0, t.hotKeySerialize)(g) },
          LineToolTrendBasedFibExtension: {},
          LineToolTrendBasedFibTime: {},
          LineToolTrendLine: { hotKey: (0, t.hotKeySerialize)(g) },
          LineToolInfoLine: {},
          LineToolTriangle: {},
          LineToolTrianglePattern: {},
          LineToolVertLine: {
            hotKey: (0, t.hotKeySerialize)({
              keys: [m, 'V'],
              text: '{0} + {1}',
            }),
          },
          LineToolCrossLine: {},
          LineToolHighlighter: {},
          LineToolGhostFeed: {},
          SyncDrawing: { iconActive: a.drawingToolsIcons.SyncDrawingActive },
          arrow: {},
          cursor: {},
          dot: {},
          drawginmode: { iconActive: a.drawingToolsIcons.drawginmodeActive },
          eraser: {},
          group: {},
          hideAllDrawings: {
            iconActive: a.drawingToolsIcons.hideAllDrawingsActive,
            hotKey: (0, t.hotKeySerialize)({
              keys: [u, m, 'H'],
              text: '{0} + {1} + {2}',
            }),
          },
          lockAllDrawings: {
            iconActive: a.drawingToolsIcons.lockAllDrawingsActive,
          },
          magnet: {
            hotKey: (0, t.hotKeySerialize)({ keys: [u], text: '{0}' }),
          },
          measure: {
            hotKey: (0, t.hotKeySerialize)({
              keys: [h],
              text: i.t(null, void 0, l(32868)),
            }),
          },
          removeAllDrawingTools: {},
          showObjectsTree: {},
          zoom: {},
          'zoom-out': {},
        }
      const f = {}
      Object.entries(T)
        .map(([e, o]) => {
          var l, i
          const t =
            null !== (l = r.lineToolsIcons[e]) && void 0 !== l
              ? l
              : a.drawingToolsIcons[e]
          ;(0, n.assert)(!!t, `Icon is not defined for drawing "${e}"`)
          const v =
            null !== (i = c.lineToolsLocalizedNames[e]) && void 0 !== i
              ? i
              : s[e]
          ;(0, n.assert)(
            !!v,
            `Localized name is not defined for drawing "${e}"`,
          )
          return {
            ...o,
            name: e,
            icon: t,
            localizedName: v,
            selectHotkey: d.lineToolsSelectHotkeys[e],
          }
        })
        .forEach((e) => {
          f[e.name] = e
        })
    },
    71810: (e, o, l) => {
      l.d(o, { LinetoolsFavoritesStore: () => s })
      var n = l(57898),
        i = l(56840)
      const t = ['LineToolBalloon'],
        r = !1
      var a, s
      !((e) => {
        function o() {
          var o, n
          e.favorites = []
          let s = !1
          const c = Boolean(
              void 0 === (0, i.getValue)('chart.favoriteDrawings'),
            ),
            v = (0, i.getJSON)('chart.favoriteDrawings', [])
          if (0 === v.length && c && 'undefined' != typeof window) {
            const e = JSON.parse(
              null !==
                (n =
                  null === (o = window.urlParams) || void 0 === o
                    ? void 0
                    : o.favorites) && void 0 !== n
                ? n
                : '{}',
            ).drawingTools
            e && Array.isArray(e) && v.push(...e)
          }
          v.forEach((o, n) => {
            const i = o.tool || o
            l(i)
              ? t.includes(i)
                ? (s = !0)
                : e.favorites.push(i)
              : r && r.includes(i) && e.hiddenToolsPositions.set(i, n)
          }),
            s && a(),
            e.favoritesSynced.fire()
        }
        function l(e) {
          return 'string' == typeof e && '' !== e && !(r && r.includes(e))
        }
        function a(o) {
          const l = e.favorites.slice()
          e.hiddenToolsPositions.forEach((e, o) => {
            l.splice(e, 0, o)
          }),
            (0, i.setJSON)('chart.favoriteDrawings', l, o)
        }
        ;(e.favorites = []),
          (e.favoritesSynced = new n.Delegate()),
          (e.hiddenToolsPositions = new Map()),
          (e.favoriteIndex = (o) => e.favorites.indexOf(o)),
          (e.isValidLineToolName = l),
          (e.saveFavorites = a),
          o(),
          i.onSync.subscribe(null, o)
      })(a || (a = {})),
        ((e) => {
          function o(e) {
            return a.isValidLineToolName(e)
          }
          function l() {
            return a.favorites.length
          }
          function i(e) {
            return -1 !== a.favoriteIndex(e)
          }
          ;(e.favoriteAdded = new n.Delegate()),
            (e.favoriteRemoved = new n.Delegate()),
            (e.favoriteMoved = new n.Delegate()),
            (e.favoritesSynced = a.favoritesSynced),
            (e.favorites = () => a.favorites.slice()),
            (e.isValidLineToolName = o),
            (e.favoritesCount = l),
            (e.favorite = (e) => (e < 0 || e >= l() ? '' : a.favorites[e])),
            (e.addFavorite = (l, n) =>
              !(i(l) || !o(l) || 'performance' === l) &&
              (a.favorites.push(l),
              a.saveFavorites(n),
              e.favoriteAdded.fire(l),
              !0)),
            (e.removeFavorite = (o, l) => {
              const n = a.favoriteIndex(o)
              if (-1 === n) return !1
              a.favorites.splice(n, 1)
              const i = a.hiddenToolsPositions
              return (
                i.forEach((e, o) => {
                  e > n && i.set(o, e - 1)
                }),
                a.saveFavorites(l),
                e.favoriteRemoved.fire(o),
                !0
              )
            }),
            (e.isFavorite = i),
            (e.moveFavorite = (n, i, t) => {
              if (i < 0 || i >= l() || !o(n)) return !1
              const r = a.favoriteIndex(n)
              if (-1 === r || i === r) return !1
              const s = a.hiddenToolsPositions
              return (
                s.forEach((e, o) => {
                  r < e && i > e ? e-- : i < e && r > e && e++, s.set(o, e)
                }),
                a.favorites.splice(r, 1),
                a.favorites.splice(i, 0, n),
                a.saveFavorites(t),
                e.favoriteMoved.fire(n, r, i),
                !0
              )
            })
        })(s || (s = {}))
    },
    19799: (e) => {
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
    1532: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M23.002 23C23 23 23 18.003 23 18.003L15.998 18C16 18 16 22.997 16 22.997l7.002.003zM15 18.003A1 1 0 0 1 15.998 17h7.004c.551 0 .998.438.998 1.003v4.994A1 1 0 0 1 23.002 24h-7.004A.993.993 0 0 1 15 22.997v-4.994z"/><path d="M19 20h1v2h-1z"/><path fill-rule="nonzero" d="M22 17.5v-2a2.5 2.5 0 0 0-5 0v2h1v-2a1.5 1.5 0 0 1 3 0v2h1z"/><g fill-rule="nonzero"><path d="M3 14.707A1 1 0 0 1 3.293 14L14.439 2.854a1.5 1.5 0 0 1 2.122 0l2.585 2.585a1.5 1.5 0 0 1 0 2.122L8 18.707a1 1 0 0 1-.707.293H4a1 1 0 0 1-1-1v-3.293zm1 0V18h3.293L18.439 6.854a.5.5 0 0 0 0-.708l-2.585-2.585a.5.5 0 0 0-.708 0L4 14.707z"/><path d="M13.146 4.854l4 4 .708-.708-4-4zm-9 9l4 4 .708-.708-4-4z"/><path d="M15.146 6.146l-9 9 .708.708 9-9z"/></g></g></svg>'
    },
    53950: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M23.002 23C23 23 23 18.003 23 18.003L15.998 18C16 18 16 22.997 16 22.997l7.002.003zM15 18.003A1 1 0 0 1 15.998 17h7.004c.551 0 .998.438.998 1.003v4.994A1 1 0 0 1 23.002 24h-7.004A.993.993 0 0 1 15 22.997v-4.994z"/><path d="M19 20h1v2h-1z"/><path fill-rule="nonzero" d="M22 14.5a2.5 2.5 0 0 0-5 0v3h1v-3a1.5 1.5 0 0 1 3 0v.5h1v-.5z"/><g fill-rule="nonzero"><path d="M3 14.707A1 1 0 0 1 3.293 14L14.439 2.854a1.5 1.5 0 0 1 2.122 0l2.585 2.585a1.5 1.5 0 0 1 0 2.122L8 18.707a1 1 0 0 1-.707.293H4a1 1 0 0 1-1-1v-3.293zm1 0V18h3.293L18.439 6.854a.5.5 0 0 0 0-.708l-2.585-2.585a.5.5 0 0 0-.708 0L4 14.707z"/><path d="M13.146 4.854l4 4 .708-.708-4-4zm-9 9l4 4 .708-.708-4-4z"/><path d="M15.146 6.146l-9 9 .708.708 9-9z"/></g></g></svg>'
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
    14665: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16" width="10" height="16"><path d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"/></svg>'
    },
    39146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>'
    },
    48010: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>'
    },
  },
])
