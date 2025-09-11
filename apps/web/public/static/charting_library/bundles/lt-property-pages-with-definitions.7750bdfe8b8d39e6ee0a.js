;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8537, 5231],
  {
    52305: (e, t, i) => {
      i.d(t, {
        convertToInt: () => r,
        floor: () => o,
        limitedPrecision: () => l,
      })
      var n = i(73866)
      function o(e) {
        return Math.floor(e)
      }
      function r(e) {
        return Number.parseInt(String(e))
      }
      function l(e) {
        const t = new n.LimitedPrecisionNumericFormatter(e, !0)
        return (e) => {
          if (null === e) return e
          const i = t.parse(t.format(e))
          return i.res ? i.value : null
        }
      }
    },
    88924: (e, t, i) => {
      i.d(t, { getLinesStylesPropertiesDefinitions: () => y })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(32097),
        s = i(91682)
      const a = new o.TranslatedString(
          'change {title} price label visibility',
          n.t(null, void 0, i(98822)),
        ),
        c = new o.TranslatedString(
          'change {title} extension',
          n.t(null, void 0, i(10390)),
        ),
        d = new o.TranslatedString(
          'change {title} time label visibility',
          n.t(null, void 0, i(66960)),
        ),
        p = n.t(null, void 0, i(97273)),
        u = n.t(null, void 0, i(56822)),
        h = n.t(null, void 0, i(1337))
      function y(e, t, i) {
        const n = (0, s.removeSpaces)(i.originalText()),
          o = [],
          y = (0, r.createLineStyleDefinition)(
            e,
            {
              lineColor: t.linecolor,
              lineWidth: t.linewidth,
              lineStyle: t.linestyle,
            },
            i,
            'Line',
          )
        if ((o.push(y), 'showPrice' in t)) {
          const r = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                e,
                t.showPrice,
                a.format({ title: i }),
              ),
            },
            { id: `${n}ShowPrice`, title: p },
          )
          o.push(r)
        }
        if ('extendLine' in t) {
          const r = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                e,
                t.extendLine,
                c.format({ title: i }),
              ),
            },
            { id: `${n}ExtendLine`, title: h },
          )
          o.push(r)
        }
        if ('showTime' in t) {
          const r = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                e,
                t.showTime,
                d.format({ title: i }),
              ),
            },
            { id: `${n}ShowTime`, title: u },
          )
          o.push(r)
        }
        return { definitions: o }
      }
    },
    72707: (e, t, i) => {
      i.r(t), i.d(t, { getSelectionStylePropertiesDefinitions: () => f })
      var n = i(11542),
        o = i(73305),
        r = i(46112),
        l = i(45126),
        s = i(32097)
      const a = new l.TranslatedString(
          'lines width',
          n.t(null, void 0, i(41594)),
        ),
        c = new l.TranslatedString('lines style', n.t(null, void 0, i(96400))),
        d = new l.TranslatedString('lines color', n.t(null, void 0, i(24621))),
        p = new l.TranslatedString(
          'backgrounds color',
          n.t(null, void 0, i(61218)),
        ),
        u = new l.TranslatedString(
          'backgrounds filled',
          n.t(null, void 0, i(48433)),
        ),
        h = new l.TranslatedString('text color', n.t(null, void 0, i(44461))),
        y = new l.TranslatedString('show price', n.t(null, void 0, i(59012)))
      function f(e, t) {
        const l = []
        if ('linesWidths' in e || 'linestyle' in e || 'linesColors' in e) {
          const p = (0, s.createLinePropertyDefinition)(
            {
              width: e.linesWidths
                ? new r.CollectiblePropertyUndoWrapper(
                    new o.LineToolCollectedProperty(e.linesWidths),
                    a,
                    t,
                  )
                : void 0,
              style: e.linestyle
                ? new r.CollectiblePropertyUndoWrapper(
                    new o.LineToolCollectedProperty(e.linestyle),
                    c,
                    t,
                  )
                : void 0,
              color: e.linesColors
                ? new r.CollectiblePropertyUndoWrapper(
                    new o.LineToolCollectedProperty(e.linesColors),
                    d,
                    t,
                  )
                : void 0,
            },
            { id: 'LineStyles', title: n.t(null, void 0, i(3554)) },
          )
          l.push(p)
        }
        if (
          'showPrice' in e ||
          'showPriceLabels' in e ||
          'axisLabelVisible' in e
        ) {
          const {
              showPrice: a = [],
              showPriceLabels: c = [],
              axisLabelVisible: d = [],
            } = e,
            p = (0, s.createCheckablePropertyDefinition)(
              {
                checked: new r.CollectiblePropertyUndoWrapper(
                  new o.LineToolCollectedProperty([...a, ...c, ...d]),
                  y,
                  t,
                ),
              },
              { id: 'ShowPrice', title: n.t(null, void 0, i(97273)) },
            )
          l.push(p)
        }
        if ('backgroundsColors' in e) {
          const a = (0, s.createColorPropertyDefinition)(
            {
              checked: e.fillBackground
                ? new r.CollectiblePropertyUndoWrapper(
                    new o.LineToolCollectedProperty(e.fillBackground),
                    u,
                    t,
                  )
                : void 0,
              color: new r.CollectiblePropertyUndoWrapper(
                new o.LineToolCollectedProperty(e.backgroundsColors),
                p,
                t,
              ),
            },
            { id: 'BackgroundColors', title: n.t(null, void 0, i(79468)) },
          )
          l.push(a)
        }
        if ('textsColors' in e) {
          const a = (0, s.createLinePropertyDefinition)(
            {
              color: new r.CollectiblePropertyUndoWrapper(
                new o.LineToolCollectedProperty(e.textsColors),
                h,
                t,
              ),
            },
            { id: 'TextColors', title: n.t(null, void 0, i(70320)) },
          )
          l.push(a)
        }
        return { definitions: l }
      }
    },
    34412: (e, t, i) => {
      i.d(t, { getTrendLineToolsStylePropertiesDefinitions: () => W })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(32097),
        s = i(64147),
        a = i(39429),
        c = i(91682)
      const d = new o.TranslatedString(
          'change {title} middle point visibility',
          n.t(null, void 0, i(27470)),
        ),
        p = new o.TranslatedString(
          'change {title} price labels visibility',
          n.t(null, void 0, i(343)),
        ),
        u = new o.TranslatedString(
          'change {title} price range visibility',
          n.t(null, void 0, i(63962)),
        ),
        h = new o.TranslatedString(
          'change {title} percent change visibility',
          n.t(null, void 0, i(87246)),
        ),
        y = new o.TranslatedString(
          'change {title} change in pips visibility',
          n.t(null, void 0, i(81340)),
        ),
        f = new o.TranslatedString(
          'change {title} bars range visibility',
          n.t(null, void 0, i(98845)),
        ),
        g = new o.TranslatedString(
          'change {title} date/time range visibility',
          n.t(null, void 0, i(37563)),
        ),
        v = new o.TranslatedString(
          'change {title} distance visibility',
          n.t(null, void 0, i(45153)),
        ),
        _ = new o.TranslatedString(
          'change {title} angle visibility',
          n.t(null, void 0, i(59288)),
        ),
        T = new o.TranslatedString(
          'change {title} always show stats',
          n.t(null, void 0, i(80390)),
        ),
        w = new o.TranslatedString(
          'change {title} stats position',
          n.t(null, void 0, i(86722)),
        ),
        P = [
          { value: a.StatsPosition.Left, title: n.t(null, void 0, i(11626)) },
          { value: a.StatsPosition.Center, title: n.t(null, void 0, i(24197)) },
          { value: a.StatsPosition.Right, title: n.t(null, void 0, i(50421)) },
          { value: a.StatsPosition.Auto, title: n.t(null, void 0, i(21469)) },
        ],
        D = n.t(null, void 0, i(12516)),
        m = n.t(null, void 0, i(42747)),
        S = n.t(null, void 0, i(16053)),
        b = n.t(null, void 0, i(62362)),
        C = n.t(null, void 0, i(73525)),
        x = n.t(null, void 0, i(4518)),
        L = n.t(null, void 0, i(89073)),
        A = n.t(null, void 0, i(62374)),
        k = n.t(null, void 0, i(3369)),
        V = n.t(null, void 0, i(390)),
        M = n.t(null, void 0, i(93857)),
        $ = n.t(null, void 0, i(26754))
      function W(e, t, i, n) {
        const o = (0, c.removeSpaces)(i.originalText()),
          a = [],
          W = t,
          B = (0, r.createLineStyleDefinition)(
            e,
            {
              ...W,
              lineColor: t.linecolor,
              lineWidth: t.linewidth,
              lineStyle: t.linestyle,
            },
            i,
            'Line',
          )
        a.push(B)
        const R = (0, l.createCheckablePropertyDefinition)(
          {
            checked: (0, l.convertToDefinitionProperty)(
              e,
              t.showMiddlePoint,
              d.format({ title: i }),
            ),
          },
          { id: `${o}MiddlePoint`, title: (n && n.middlePoint) || D },
        )
        a.push(R)
        const z = (0, l.createCheckablePropertyDefinition)(
          {
            checked: (0, l.convertToDefinitionProperty)(
              e,
              t.showPriceLabels,
              p.format({ title: i }),
            ),
          },
          {
            id: `${o}ShowPriceLabels`,
            title: (n && n.showPriceLabelsTitle) || m,
          },
        )
        a.push(z)
        const N = [],
          I = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                e,
                t.showPriceRange,
                u.format({ title: i }),
              ),
            },
            { id: `${o}PriceRange`, title: (n && n.priceRange) || b },
          )
        N.push(I)
        const E = (0, l.createCheckablePropertyDefinition)(
          {
            checked: (0, l.convertToDefinitionProperty)(
              e,
              t.showPercentPriceRange,
              h.format({ title: i }),
            ),
          },
          { id: `${o}PercentChange`, title: (n && n.percentChange) || C },
        )
        N.push(E)
        const O = (0, l.createCheckablePropertyDefinition)(
          {
            checked: (0, l.convertToDefinitionProperty)(
              e,
              t.showPipsPriceRange,
              y.format({ title: i }),
            ),
          },
          { id: `${o}PipsChange`, title: (n && n.pipsChange) || x },
        )
        N.push(O)
        const U = (0, l.createCheckablePropertyDefinition)(
          {
            checked: (0, l.convertToDefinitionProperty)(
              e,
              t.showBarsRange,
              f.format({ title: i }),
            ),
          },
          { id: `${o}BarsRange`, title: (n && n.barRange) || L },
        )
        if ((N.push(U), 'showDateTimeRange' in t)) {
          const r = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                e,
                t.showDateTimeRange,
                g.format({ title: i }),
              ),
            },
            { id: `${o}DateTimeRange`, title: (n && n.dateTimeRange) || A },
          )
          N.push(r)
        }
        if ('showDistance' in t) {
          const r = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                e,
                t.showDistance,
                v.format({ title: i }),
              ),
            },
            { id: `${o}Distance`, title: (n && n.distance) || k },
          )
          N.push(r)
        }
        if ('showAngle' in t) {
          const r = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                e,
                t.showAngle,
                _.format({ title: i }),
              ),
            },
            { id: `${o}Angle`, title: (n && n.angle) || V },
          )
          N.push(r)
        }
        const G = (0, l.createCheckablePropertyDefinition)(
          {
            checked: (0, l.convertToDefinitionProperty)(
              e,
              t.alwaysShowStats,
              T.format({ title: i }),
            ),
          },
          { id: `${o}ShowStats`, title: (n && n.showStats) || M },
        )
        N.push(G)
        const F = (0, l.createOptionsPropertyDefinition)(
          {
            option: (0, l.convertToDefinitionProperty)(
              e,
              t.statsPosition,
              w.format({ title: i }),
            ),
          },
          {
            id: `${o}StatsPosition`,
            title: (n && n.statsPosition) || S,
            options: new s.WatchedValue(P),
          },
        )
        return (
          N.push(F),
          a.push(
            (0, l.createPropertyDefinitionsGeneralGroup)(
              N,
              `${o}StatsGroup`,
              $,
            ),
          ),
          { definitions: a }
        )
      }
    },
    91335: (e, t, i) => {
      i.d(t, { createTextStyleDefinition: () => b })
      var n = i(11542),
        o = i(45126),
        r = i(32097),
        l = i(91682)
      const s = new o.TranslatedString(
          'change {toolName} text visibility',
          n.t(null, void 0, i(56634)),
        ),
        a = new o.TranslatedString(
          'change {toolName} text color',
          n.t(null, void 0, i(64500)),
        ),
        c = new o.TranslatedString(
          'change {toolName} text font size',
          n.t(null, void 0, i(21781)),
        ),
        d = new o.TranslatedString(
          'change {toolName} text font bold',
          n.t(null, void 0, i(24701)),
        ),
        p = new o.TranslatedString(
          'change {toolName} text font italic',
          n.t(null, void 0, i(42694)),
        ),
        u = new o.TranslatedString(
          'change {toolName} text',
          n.t(null, void 0, i(66668)),
        ),
        h = new o.TranslatedString(
          'change {toolName} labels alignment vertical',
          n.t(null, void 0, i(31689)),
        ),
        y = new o.TranslatedString(
          'change {toolName} labels alignment horizontal',
          n.t(null, void 0, i(88277)),
        ),
        f = new o.TranslatedString(
          'change {toolName} labels direction',
          n.t(null, void 0, i(61160)),
        ),
        g = new o.TranslatedString(
          'change {toolName} text background visibility',
          n.t(null, void 0, i(31133)),
        ),
        v = new o.TranslatedString(
          'change {toolName} text background color',
          n.t(null, void 0, i(22231)),
        ),
        _ = new o.TranslatedString(
          'change {toolName} text border visibility',
          n.t(null, void 0, i(58704)),
        ),
        T = new o.TranslatedString(
          'change {toolName} text border width',
          n.t(null, void 0, i(35423)),
        ),
        w = new o.TranslatedString(
          'change {toolName} text border color',
          n.t(null, void 0, i(36666)),
        ),
        P = new o.TranslatedString(
          'change {toolName} text wrap',
          n.t(null, void 0, i(39587)),
        ),
        D = n.t(null, void 0, i(79468)),
        m = n.t(null, void 0, i(38408)),
        S = n.t(null, void 0, i(7560))
      function b(e, t, i, n) {
        const o = {},
          b = {
            id: `${(0, l.removeSpaces)(i.originalText())}Text`,
            title: (n.customTitles && n.customTitles.text) || '',
          }
        if (
          (void 0 !== t.showText &&
            (o.checked = (0, r.convertToDefinitionProperty)(
              e,
              t.showText,
              s.format({ toolName: i }),
            )),
          void 0 !== t.textColor &&
            (o.color = (0, r.getColorDefinitionProperty)(
              e,
              t.textColor,
              t.transparency || null,
              a.format({ toolName: i }),
            )),
          void 0 !== t.fontSize &&
            (o.size = (0, r.convertToDefinitionProperty)(
              e,
              t.fontSize,
              c.format({ toolName: i }),
            )),
          void 0 !== t.bold &&
            (o.bold = (0, r.convertToDefinitionProperty)(
              e,
              t.bold,
              d.format({ toolName: i }),
            )),
          void 0 !== t.italic &&
            (o.italic = (0, r.convertToDefinitionProperty)(
              e,
              t.italic,
              p.format({ toolName: i }),
            )),
          void 0 !== t.text &&
            ((o.text = (0, r.convertToDefinitionProperty)(
              e,
              t.text,
              u.format({ toolName: i }),
            )),
            (b.isEditable = Boolean(n.isEditable)),
            (b.isMultiLine = Boolean(n.isMultiLine))),
          void 0 !== t.vertLabelsAlign &&
            ((o.alignmentVertical = (0, r.convertToDefinitionProperty)(
              e,
              t.vertLabelsAlign,
              h.format({ toolName: i }),
            )),
            (b.alignmentVerticalItems = n.alignmentVerticalItems)),
          void 0 !== t.horzLabelsAlign &&
            ((o.alignmentHorizontal = (0, r.convertToDefinitionProperty)(
              e,
              t.horzLabelsAlign,
              y.format({ toolName: i }),
            )),
            (b.alignmentHorizontalItems = n.alignmentHorizontalItems)),
          void 0 !== t.textOrientation &&
            (o.orientation = (0, r.convertToDefinitionProperty)(
              e,
              t.textOrientation,
              f.format({ toolName: i }),
            )),
          void 0 !== t.backgroundVisible &&
            (o.backgroundVisible = (0, r.convertToDefinitionProperty)(
              e,
              t.backgroundVisible,
              g.format({ toolName: i }),
            )),
          void 0 !== t.backgroundColor)
        ) {
          let n = null
          void 0 !== t.backgroundTransparency && (n = t.backgroundTransparency),
            (o.backgroundColor = (0, r.getColorDefinitionProperty)(
              e,
              t.backgroundColor,
              n,
              v.format({ toolName: i }),
            ))
        }
        return (
          (void 0 === t.backgroundVisible && void 0 === t.backgroundColor) ||
            (b.backgroundTitle =
              (n.customTitles && n.customTitles.backgroundTitle) || D),
          void 0 !== t.borderVisible &&
            (o.borderVisible = (0, r.convertToDefinitionProperty)(
              e,
              t.borderVisible,
              _.format({ toolName: i }),
            )),
          void 0 !== t.borderWidth &&
            (o.borderWidth = (0, r.convertToDefinitionProperty)(
              e,
              t.borderWidth,
              T.format({ toolName: i }),
            )),
          void 0 !== t.borderColor &&
            (o.borderColor = (0, r.getColorDefinitionProperty)(
              e,
              t.borderColor,
              null,
              w.format({ toolName: i }),
            )),
          (void 0 === t.borderVisible &&
            void 0 === t.borderColor &&
            void 0 === t.borderWidth) ||
            (b.borderTitle =
              (n.customTitles && n.customTitles.borderTitle) || m),
          void 0 !== t.wrap &&
            ((o.wrap = (0, r.convertToDefinitionProperty)(
              e,
              t.wrap,
              P.format({ toolName: i }),
            )),
            (b.wrapTitle = (n.customTitles && n.customTitles.wrapTitle) || S)),
          (0, r.createTextPropertyDefinition)(o, b)
        )
      }
    },
    67675: (e, t, i) => {
      i.r(t), i.d(t, { ArrowMarkDefinitionsViewModel: () => p })
      var n = i(11542),
        o = i(45126),
        r = i(91335),
        l = i(18009),
        s = i(32097)
      const a = new o.TranslatedString(
          'change arrow color',
          n.t(null, void 0, i(77931)),
        ),
        c = n.t(null, void 0, i(70320)),
        d = n.t(null, void 0, i(11858))
      class p extends l.LineDataSourceDefinitionsViewModel {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, r.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  text: e.text,
                  showText: e.showLabel,
                  textColor: e.color,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                },
                new o.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: c } },
              ),
            ],
          }
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.arrowColor,
                    null,
                    a,
                  ),
                },
                { id: 'ArrowColor', title: d },
              ),
            ],
          }
        }
      }
    },
    86658: (e, t, i) => {
      i.r(t), i.d(t, { ArrowMarkerDefinitionsViewModel: () => u })
      var n = i(11542),
        o = i(45126),
        r = i(32097),
        l = i(18009),
        s = i(91682),
        a = i(91335)
      const c = new o.TranslatedString(
          'change {title} color',
          n.t(null, void 0, i(49442)),
        ),
        d = n.t(null, void 0, i(47370)),
        p = n.t(null, void 0, i(70320))
      class u extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new o.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, r.createColorPropertyDefinition)(
                {
                  color: (0, r.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    null,
                    c.format({ title: i }),
                  ),
                },
                { id: (0, s.removeSpaces)(`${t}Color`), title: d },
              ),
            ],
          }
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, a.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  text: e.text,
                  showText: e.showLabel,
                  textColor: e.textColor,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                },
                new o.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: p } },
              ),
            ],
          }
        }
      }
    },
    1847: (e, t, i) => {
      i.r(t), i.d(t, { BarsPatternDefinitionsViewModel: () => w })
      var n = i(11542),
        o = i(45126),
        r = i(18009),
        l = i(32097),
        s = i(64147),
        a = i(67467),
        c = i(52305),
        d = i(91682)
      const p = new o.TranslatedString(
          'change {title} color',
          n.t(null, void 0, i(49442)),
        ),
        u = new o.TranslatedString(
          'change {title} mode',
          n.t(null, void 0, i(57462)),
        ),
        h = new o.TranslatedString(
          'change {title} mirrored',
          n.t(null, void 0, i(85198)),
        ),
        y = new o.TranslatedString(
          'change {title} flipped',
          n.t(null, void 0, i(10643)),
        ),
        f = n.t(null, void 0, i(47370)),
        g = n.t(null, void 0, i(3214)),
        v = n.t(null, void 0, i(28941)),
        _ = n.t(null, void 0, i(63271)),
        T = [
          {
            value: a.LineToolBarsPatternMode.Bars,
            title: n.t(null, void 0, i(49275)),
          },
          {
            value: a.LineToolBarsPatternMode.OpenClose,
            title: n.t(null, void 0, i(98136)),
          },
          {
            value: a.LineToolBarsPatternMode.Line,
            title: n.t(null, void 0, i(30216)),
          },
          {
            value: a.LineToolBarsPatternMode.LineOpen,
            title: n.t(null, void 0, i(80332)),
          },
          {
            value: a.LineToolBarsPatternMode.LineHigh,
            title: n.t(null, void 0, i(18387)),
          },
          {
            value: a.LineToolBarsPatternMode.LineLow,
            title: n.t(null, void 0, i(53880)),
          },
          {
            value: a.LineToolBarsPatternMode.LineHL2,
            title: n.t(null, void 0, i(32982)),
          },
        ]
      class w extends r.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new o.TranslatedString(t, this._source.translatedType()),
            n = (0, d.removeSpaces)(t)
          return {
            definitions: [
              (0, l.createColorPropertyDefinition)(
                {
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.color,
                    null,
                    p.format({ title: i }),
                  ),
                },
                { id: `${n}Color`, title: f },
              ),
              (0, l.createOptionsPropertyDefinition)(
                {
                  option: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.mode,
                    u.format({ title: i }),
                    [c.convertToInt],
                  ),
                },
                { id: `${n}Mode`, title: g, options: new s.WatchedValue(T) },
              ),
              (0, l.createCheckablePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.mirrored,
                    h.format({ title: i }),
                  ),
                },
                { id: `${n}Mirrored`, title: v },
              ),
              (0, l.createCheckablePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.flipped,
                    y.format({ title: i }),
                  ),
                },
                { id: `${n}Flipped`, title: _ },
              ),
            ],
          }
        }
      }
    },
    32364: (e, t, i) => {
      i.r(t), i.d(t, { BrushDefinitionsViewModel: () => u })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(18009),
        s = i(32097),
        a = i(91682)
      const c = new o.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(30839)),
        ),
        d = new o.TranslatedString(
          'change {title} background color',
          n.t(null, void 0, i(49765)),
        ),
        p = n.t(null, void 0, i(79468))
      class u extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new o.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  lineColor: e.linecolor,
                  lineWidth: e.linewidth,
                  leftEnd: e.leftEnd,
                  rightEnd: e.rightEnd,
                },
                i,
                'Line',
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    c.format({ title: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    d.format({ title: i }),
                  ),
                },
                { id: (0, a.removeSpaces)(`${t}BackgroundColor`), title: p },
              ),
            ],
          }
        }
        _coordinatesPropertyDefinitions() {
          return null
        }
      }
    },
    29908: (e, t, i) => {
      i.r(t), i.d(t, { CalloutDefinitionsViewModel: () => l })
      var n = i(91335),
        o = i(18009),
        r = i(45126)
      class l extends o.LineDataSourceDefinitionsViewModel {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, n.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.color,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                  text: e.text,
                  backgroundColor: e.backgroundColor,
                  backgroundTransparency: e.transparency,
                  borderColor: e.bordercolor,
                  borderWidth: e.linewidth,
                  wrap: e.wordWrap,
                },
                new r.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { isEditable: !0, isMultiLine: !0 },
              ),
            ],
          }
        }
      }
    },
    9805: (e, t, i) => {
      i.r(t), i.d(t, { CrossLineDefinitionsViewModel: () => c })
      var n = i(11542),
        o = i(45126),
        r = i(18009),
        l = i(88924),
        s = i(91335)
      const a = n.t(null, void 0, i(70320))
      class c extends r.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return (0, l.getLinesStylesPropertiesDefinitions)(
            this._propertyApplier,
            e,
            new o.TranslatedString(
              this._source.name(),
              this._source.translatedType(),
            ),
          )
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          if ('showLabel' in e) {
            return {
              definitions: [
                (0, s.createTextStyleDefinition)(
                  this._propertyApplier,
                  {
                    ...e,
                    showText: e.showLabel,
                    textColor: e.textcolor,
                    fontSize: e.fontsize,
                  },
                  new o.TranslatedString(
                    this._source.name(),
                    this._source.translatedType(),
                  ),
                  {
                    isEditable: !0,
                    isMultiLine: !0,
                    customTitles: { text: a },
                  },
                ),
              ],
            }
          }
          return null
        }
      }
    },
    3868: (e, t, i) => {
      i.r(t), i.d(t, { CyclicAndSineLinesPatternDefinitionsViewModel: () => a })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(18009)
      const s = n.t(null, void 0, i(56982))
      class a extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  lineColor: e.linecolor,
                  lineWidth: e.linewidth,
                  lineStyle: e.linestyle,
                },
                new o.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                'Line',
                { line: s },
              ),
            ],
          }
        }
      }
    },
    70491: (e, t, i) => {
      i.r(t), i.d(t, { ElliottPatternDefinitionsViewModel: () => f })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(18009),
        s = i(32097),
        a = i(64147),
        c = i(91682)
      const d = new o.TranslatedString(
          'change {title} color',
          n.t(null, void 0, i(49442)),
        ),
        p = new o.TranslatedString(
          'change {title} degree',
          n.t(null, void 0, i(86650)),
        ),
        u = n.t(null, void 0, i(47370)),
        h = n.t(null, void 0, i(32998)),
        y = n.t(null, void 0, i(23403))
      class f extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new o.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.color,
                    null,
                    d.format({ title: i }),
                  ),
                },
                { id: (0, c.removeSpaces)(`${t}BackgroundColor`), title: u },
              ),
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                { showLine: e.showWave, lineWidth: e.linewidth },
                i,
                'Line',
                { line: h },
              ),
              (0, s.createOptionsPropertyDefinition)(
                {
                  option: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.degree,
                    p.format({ title: i }),
                  ),
                },
                {
                  id: `${t}Degree`,
                  title: y,
                  options: new a.WatchedValue(
                    this._source.availableDegreesValues(),
                  ),
                },
              ),
            ],
          }
        }
      }
    },
    99458: (e, t, i) => {
      i.r(t),
        i.d(t, {
          EllipseCircleDefinitionsViewModel: () => a,
        })
      var n = i(11542),
        o = i(45126),
        r = i(91335),
        l = i(90490)
      const s = n.t(null, void 0, i(70320))
      class a extends l.GeneralFiguresDefinitionsViewModelBase {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, r.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.textColor,
                  text: e.text,
                  bold: e.bold,
                  italic: e.italic,
                  fontSize: e.fontSize,
                  showText: e.showLabel,
                },
                new o.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: s } },
              ),
            ],
          }
        }
      }
    },
    41618: (e, t, i) => {
      i.r(t), i.d(t, { FibCirclesDefinitionsViewModel: () => b })
      var n = i(50151),
        o = i(11542),
        r = i(45126),
        l = i(53749),
        s = i(32097),
        a = i(18009),
        c = i(91682),
        d = i(95166)
      const p = new r.TranslatedString(
          'change {title} level {index} line visibility',
          o.t(null, void 0, i(51403)),
        ),
        u = new r.TranslatedString(
          'change {title} levels visibility',
          o.t(null, void 0, i(54517)),
        ),
        h = new r.TranslatedString(
          'change {title} level {index} line color',
          o.t(null, void 0, i(664)),
        ),
        y = new r.TranslatedString(
          'change {title} level {index} line width',
          o.t(null, void 0, i(97870)),
        ),
        f = new r.TranslatedString(
          'change {title} level {index} line coeff',
          o.t(null, void 0, i(27154)),
        ),
        g = new r.TranslatedString(
          'change {title} all lines color',
          o.t(null, void 0, i(59577)),
        ),
        v = new r.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(30839)),
        ),
        _ = new r.TranslatedString(
          'change {title} background transparency',
          o.t(null, void 0, i(13783)),
        ),
        T = new r.TranslatedString(
          'change {title} coeffs as percents visibility',
          o.t(null, void 0, i(31753)),
        ),
        w = o.t(null, void 0, i(51574)),
        P = o.t(null, void 0, i(28683)),
        D = o.t(null, void 0, i(79468)),
        m = o.t(null, void 0, i(79650)),
        S = o.t(null, void 0, i(53912))
      class b extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            o = (0, c.removeSpaces)(i),
            a = new r.TranslatedString(i, this._source.translatedType()),
            b = t.trendline.childs(),
            C = (0, l.createLineStyleDefinition)(
              this._propertyApplier,
              {
                showLine: b.visible,
                lineColor: b.color,
                lineStyle: b.linestyle,
                lineWidth: b.linewidth,
              },
              a,
              'TrendLine',
              { line: w },
            )
          e.push(C)
          const x = this._source.levelsCount()
          for (let i = 1; i <= x; i++) {
            const n = t[`level${i}`].childs(),
              r = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.visible,
                    p.format({ title: a, index: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    n.color,
                    null,
                    h.format({ title: a, index: i }),
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.linewidth,
                    y.format({ title: a, index: i }),
                  ),
                  level: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.coeff,
                    f.format({ title: a, index: i }),
                  ),
                },
                { id: `${o}LineLevel${i}` },
              )
            e.push(r)
          }
          const L = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new d.CollectibleColorPropertyUndoWrapper(
                  (0, n.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                g.format({ title: a }),
                !0,
              ),
            },
            { id: `${o}AllLineColor`, title: P },
          )
          e.push(L)
          const A = (0, s.createTransparencyPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                v.format({ title: a }),
              ),
              transparency: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                _.format({ title: a }),
              ),
            },
            { id: `${o}Background`, title: D },
          )
          e.push(A)
          const k = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.showCoeffs,
                u.format({ title: a }),
              ),
            },
            { id: `${o}Levels`, title: m },
          )
          e.push(k)
          const V = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.coeffsAsPercents,
                T.format({ title: a }),
              ),
            },
            { id: `${o}Percentage`, title: S },
          )
          return e.push(V), { definitions: e }
        }
      }
    },
    75450: (e, t, i) => {
      i.r(t), i.d(t, { FibDrawingsWith24LevelsDefinitionsViewModel: () => j })
      var n = i(50151),
        o = i(11542),
        r = i(45126),
        l = i(53749),
        s = i(32097),
        a = i(18009),
        c = i(30699),
        d = i(23720),
        p = i(64147),
        u = i(91682),
        h = i(95166)
      const y = new r.TranslatedString(
          'change {title} level {index} line visibility',
          o.t(null, void 0, i(51403)),
        ),
        f = new r.TranslatedString(
          'change {title} level {index} line color',
          o.t(null, void 0, i(664)),
        ),
        g = new r.TranslatedString(
          'change {title} level {index} line coeff',
          o.t(null, void 0, i(27154)),
        ),
        v = new r.TranslatedString(
          'change {title} all lines color',
          o.t(null, void 0, i(59577)),
        ),
        _ = new r.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(30839)),
        ),
        T = new r.TranslatedString(
          'change {title} background transparency',
          o.t(null, void 0, i(13783)),
        ),
        w = new r.TranslatedString(
          'change {title} reverse',
          o.t(null, void 0, i(50762)),
        ),
        P = new r.TranslatedString(
          'change {title} prices visibility',
          o.t(null, void 0, i(4714)),
        ),
        D = new r.TranslatedString(
          'change {title} labels alignment',
          o.t(null, void 0, i(55612)),
        ),
        m = new r.TranslatedString(
          'change {title} text alignment',
          o.t(null, void 0, i(55134)),
        ),
        S = new r.TranslatedString(
          'change {title} text visibility',
          o.t(null, void 0, i(30353)),
        ),
        b = new r.TranslatedString(
          'change {title} labels font size',
          o.t(null, void 0, i(19658)),
        ),
        C = new r.TranslatedString(
          'change {title} style',
          o.t(null, void 0, i(98463)),
        ),
        x = new r.TranslatedString(
          'change {title} fib levels based on log scale',
          o.t(null, void 0, i(85509)),
        ),
        L = o.t(null, void 0, i(51574)),
        A = o.t(null, void 0, i(36937)),
        k = o.t(null, void 0, i(68461)),
        V = o.t(null, void 0, i(25112)),
        M = o.t(null, void 0, i(79192)),
        $ = o.t(null, void 0, i(25188)),
        W = o.t(null, void 0, i(64489)),
        B = o.t(null, void 0, i(29416)),
        R = o.t(null, void 0, i(79650)),
        z = o.t(null, void 0, i(5119)),
        N = o.t(null, void 0, i(70320)),
        I = o.t(null, void 0, i(2573)),
        E = o.t(null, void 0, i(28683)),
        O = o.t(null, void 0, i(79468)),
        U = o.t(null, void 0, i(66086)),
        G = [
          { id: 'values', value: !1, title: o.t(null, void 0, i(60092)) },
          { id: 'percents', value: !0, title: o.t(null, void 0, i(33120)) },
        ],
        F = [
          {
            id: c.VerticalAlign.Top,
            value: c.VerticalAlign.Bottom,
            title: o.t(null, void 0, i(97118)),
          },
          {
            id: c.VerticalAlign.Middle,
            value: c.VerticalAlign.Middle,
            title: o.t(null, void 0, i(68833)),
          },
          {
            id: c.VerticalAlign.Bottom,
            value: c.VerticalAlign.Top,
            title: o.t(null, void 0, i(27567)),
          },
        ],
        H = [8, 10, 11, 12, 14, 16, 18, 20, 22, 24].map((e) => ({
          title: String(e),
          value: e,
        }))
      class j extends a.LineDataSourceDefinitionsViewModel {
        constructor(e, t) {
          super(e, t), (this._disabledBasedOnLog = null)
          if (
            'fibLevelsBasedOnLogScale' in this._source.properties().childs()
          ) {
            const e = this._source.priceScale()
            null !== e &&
              ((this._disabledBasedOnLog = new p.WatchedValue(
                Boolean(!e.mode().log),
              )),
              this._createPropertyRages(),
              e.modeChanged().subscribe(this, (e, t) => {
                null !== this._disabledBasedOnLog &&
                  this._disabledBasedOnLog.setValue(Boolean(!t.log))
              }))
          }
        }
        destroy() {
          super.destroy()
          const e = this._source.priceScale()
          null !== e && e.modeChanged().unsubscribeAll(this)
        }
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties(),
            i = t.childs(),
            o = this._source.name(),
            a = (0, u.removeSpaces)(o),
            c = new r.TranslatedString(o, this._source.translatedType())
          if ('trendline' in i) {
            const t = i.trendline.childs(),
              n = (0, l.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  showLine: t.visible,
                  lineColor: t.color,
                  lineStyle: t.linestyle,
                  lineWidth: t.linewidth,
                },
                c,
                'TrendLine',
                { line: L },
              )
            e.push(n)
          }
          const j = i.levelsStyle.childs(),
            Y = { lineStyle: j.linestyle, lineWidth: j.linewidth },
            X = { line: A }
          'extendLines' in i &&
            ((Y.extendRight = i.extendLines), (X.extendRightTitle = M)),
            'extendLinesLeft' in i &&
              ((Y.extendLeft = i.extendLinesLeft), (X.extendLeftTitle = $)),
            'extendRight' in i &&
              ((Y.extendRight = i.extendRight), (X.extendRightTitle = k)),
            'extendLeft' in i &&
              ((Y.extendLeft = i.extendLeft), (X.extendLeftTitle = V))
          const K = (0, l.createLineStyleDefinition)(
            this._propertyApplier,
            Y,
            c,
            'LevelsStyleLine',
            X,
          )
          e.push(K)
          const q = [],
            J = this._source.levelsCount()
          for (let e = 1; e <= J; e++) {
            const t = i[`level${e}`].childs(),
              n = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    t.visible,
                    y.format({ title: c, index: e }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    t.color,
                    null,
                    f.format({ title: c, index: e }),
                  ),
                  level: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    t.coeff,
                    g.format({ title: c, index: e }),
                  ),
                },
                { id: `${a}LineLevel${e}` },
              )
            q.push(n)
          }
          const Q = (0, s.createPropertyDefinitionsLeveledLinesGroup)(
            q,
            `${a}LeveledLinesGroup`,
          )
          e.push((0, s.createPropertyDefinitionsGeneralGroup)([Q], `${a}Group`))
          const Z = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new h.CollectibleColorPropertyUndoWrapper(
                  (0, n.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                v.format({ title: c }),
                !0,
              ),
            },
            { id: `${a}AllLineColor`, title: E },
          )
          e.push(Z)
          const ee = (0, s.createTransparencyPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.fillBackground,
                _.format({ title: c }),
              ),
              transparency: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.transparency,
                T.format({ title: c }),
              ),
            },
            { id: `${a}Background`, title: O },
          )
          e.push(ee)
          const te = i
          if ('reverse' in te) {
            const t = (0, s.createCheckablePropertyDefinition)(
              {
                checked: (0, s.convertToDefinitionProperty)(
                  this._propertyApplier,
                  te.reverse,
                  w.format({ title: c }),
                ),
              },
              { id: `${a}Reverse`, title: W },
            )
            e.push(t)
          }
          const ie = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.showPrices,
                P.format({ title: c }),
              ),
            },
            { id: `${a}Prices`, title: B },
          )
          e.push(ie)
          const ne = (0, s.createOptionsPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.showCoeffs,
                C.format({ title: c }),
              ),
              option: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.coeffsAsPercents,
                C.format({ title: c }),
              ),
            },
            { id: `${a}PitchStyle`, title: R, options: new p.WatchedValue(G) },
          )
          e.push(ne)
          const oe = (0, s.createTwoOptionsPropertyDefinition)(
            {
              option1: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.horzLabelsAlign,
                D.format({ title: c }),
              ),
              option2: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.vertLabelsAlign,
                D.format({ title: c }),
              ),
            },
            {
              id: `${a}Alignment`,
              title: z,
              optionsItems1: new p.WatchedValue(
                d.availableAlignmentHorizontalItems,
              ),
              optionsItems2: new p.WatchedValue(F),
            },
          )
          e.push(oe)
          const re = t.child('showText'),
            le = t.child('horzTextAlign'),
            se = t.child('vertTextAlign')
          if (re && le && se) {
            const t = (0, s.createTwoOptionsPropertyDefinition)(
              {
                checked: (0, s.convertToDefinitionProperty)(
                  this._propertyApplier,
                  re,
                  S.format({ title: c }),
                ),
                option1: (0, s.convertToDefinitionProperty)(
                  this._propertyApplier,
                  le,
                  m.format({ title: c }),
                ),
                option2: (0, s.convertToDefinitionProperty)(
                  this._propertyApplier,
                  se,
                  m.format({ title: c }),
                ),
              },
              {
                id: `${a}Text`,
                title: N,
                optionsItems1: new p.WatchedValue(
                  d.availableAlignmentHorizontalItems,
                ),
                optionsItems2: new p.WatchedValue(F),
              },
            )
            e.push(t)
          }
          const ae = (0, s.createOptionsPropertyDefinition)(
            {
              option: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.labelFontSize,
                b.format({ title: c }),
              ),
            },
            { id: `${a}FontSize`, title: I, options: new p.WatchedValue(H) },
          )
          if (
            (e.push(ae),
            'fibLevelsBasedOnLogScale' in i &&
              null !== this._disabledBasedOnLog)
          ) {
            const t = (0, s.createCheckablePropertyDefinition)(
              {
                disabled: (0, s.convertFromWVToDefinitionProperty)(
                  this._propertyApplier,
                  this._disabledBasedOnLog,
                  x.format({ title: c }),
                ),
                checked: (0, s.convertToDefinitionProperty)(
                  this._propertyApplier,
                  i.fibLevelsBasedOnLogScale,
                  x.format({ title: c }),
                ),
              },
              { id: `${a}BasedOnLog`, title: U },
            )
            e.push(t)
          }
          return { definitions: e }
        }
      }
    },
    23720: (e, t, i) => {
      i.r(t),
        i.d(t, {
          FibTimezoneDefinitionsViewModel: () => x,
          availableAlignmentHorizontalItems: () => C,
          availableAlignmentVerticalItems: () => b,
        })
      var n = i(50151),
        o = i(11542),
        r = i(45126),
        l = i(32097),
        s = i(18009),
        a = i(30699),
        c = i(64147),
        d = i(91682),
        p = i(95166)
      const u = new r.TranslatedString(
          'change {title} level {index} line visibility',
          o.t(null, void 0, i(51403)),
        ),
        h = new r.TranslatedString(
          'change {title} level {index} line color',
          o.t(null, void 0, i(664)),
        ),
        y = new r.TranslatedString(
          'change {title} level {index} line width',
          o.t(null, void 0, i(97870)),
        ),
        f = new r.TranslatedString(
          'change {title} level {index} line style',
          o.t(null, void 0, i(64707)),
        ),
        g = new r.TranslatedString(
          'change {title} level {index} line coeff',
          o.t(null, void 0, i(27154)),
        ),
        v = new r.TranslatedString(
          'change {title} all lines color',
          o.t(null, void 0, i(59577)),
        ),
        _ = new r.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(30839)),
        ),
        T = new r.TranslatedString(
          'change {title} background transparency',
          o.t(null, void 0, i(13783)),
        ),
        w = new r.TranslatedString(
          'change {title} labels visibility',
          o.t(null, void 0, i(93340)),
        ),
        P = new r.TranslatedString(
          'change {title} labels alignment',
          o.t(null, void 0, i(55612)),
        ),
        D = o.t(null, void 0, i(28683)),
        m = o.t(null, void 0, i(79468)),
        S = o.t(null, void 0, i(5119)),
        b = [
          {
            id: a.VerticalAlign.Bottom,
            value: a.VerticalAlign.Top,
            title: o.t(null, void 0, i(97118)),
          },
          {
            id: a.VerticalAlign.Middle,
            value: a.VerticalAlign.Middle,
            title: o.t(null, void 0, i(68833)),
          },
          {
            id: a.VerticalAlign.Top,
            value: a.VerticalAlign.Bottom,
            title: o.t(null, void 0, i(27567)),
          },
        ],
        C = [
          {
            id: a.HorizontalAlign.Left,
            value: a.HorizontalAlign.Left,
            title: o.t(null, void 0, i(11626)),
          },
          {
            id: a.HorizontalAlign.Center,
            value: a.HorizontalAlign.Center,
            title: o.t(null, void 0, i(24197)),
          },
          {
            id: a.HorizontalAlign.Right,
            value: a.HorizontalAlign.Right,
            title: o.t(null, void 0, i(50421)),
          },
        ]
      class x extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            o = (0, d.removeSpaces)(i),
            s = new r.TranslatedString(i, this._source.translatedType()),
            a = this._source.levelsCount()
          for (let i = 1; i <= a; i++) {
            const n = t[`level${i}`].childs(),
              r = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.visible,
                    u.format({ title: s, index: i }),
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    n.color,
                    null,
                    h.format({ title: s, index: i }),
                  ),
                  width: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.linewidth,
                    y.format({ title: s, index: i }),
                  ),
                  style: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.linestyle,
                    f.format({ title: s, index: i }),
                  ),
                  level: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.coeff,
                    g.format({ title: s, index: i }),
                  ),
                },
                { id: `${o}LineLevel${i}` },
              )
            e.push(r)
          }
          const x = (0, l.createColorPropertyDefinition)(
            {
              color: (0, l.getColorDefinitionProperty)(
                this._propertyApplier,
                new p.CollectibleColorPropertyUndoWrapper(
                  (0, n.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                v.format({ title: s }),
                !0,
              ),
            },
            { id: `${o}AllLineColor`, title: D },
          )
          e.push(x)
          const L = (0, l.createTransparencyPropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                _.format({ title: s }),
              ),
              transparency: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                T.format({ title: s }),
              ),
            },
            { id: `${o}Background`, title: m },
          )
          e.push(L)
          const A = (0, l.createTwoOptionsPropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.showLabels,
                w.format({ title: s }),
              ),
              option1: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.horzLabelsAlign,
                P.format({ title: s }),
              ),
              option2: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.vertLabelsAlign,
                P.format({ title: s }),
              ),
            },
            {
              id: `${o}Labels`,
              title: S,
              optionsItems1: new c.WatchedValue(C),
              optionsItems2: new c.WatchedValue(b),
            },
          )
          return e.push(A), { definitions: e }
        }
      }
    },
    11138: (e, t, i) => {
      i.r(t), i.d(t, { FlagMarkDefinitionsViewModel: () => c })
      var n = i(11542),
        o = i(45126),
        r = i(18009),
        l = i(32097)
      const s = new o.TranslatedString(
          'change flag color',
          n.t(null, void 0, i(77883)),
        ),
        a = n.t(null, void 0, i(33885))
      class c extends r.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, l.createColorPropertyDefinition)(
                {
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.flagColor,
                    null,
                    s,
                  ),
                },
                { id: 'FlagColor', title: a },
              ),
            ],
          }
        }
      }
    },
    53894: (e, t, i) => {
      i.r(t),
        i.d(t, {
          GannComplexAndFixedDefinitionsViewModel: () => z,
          isGannComplexLineTool: () => R,
        })
      var n = i(50151),
        o = i(11542),
        r = i(45126),
        l = i(91335),
        s = i(32097),
        a = i(18009),
        c = i(99083),
        d = i(64147),
        p = i(52305),
        u = i(91682),
        h = i(95166)
      const y = new r.TranslatedString(
          'change {title} level {index} line visibility',
          o.t(null, void 0, i(51403)),
        ),
        f = new r.TranslatedString(
          'change {title} level {index} line color',
          o.t(null, void 0, i(664)),
        ),
        g = new r.TranslatedString(
          'change {title} level {index} line width',
          o.t(null, void 0, i(97870)),
        ),
        v = new r.TranslatedString(
          'change {title} all lines color',
          o.t(null, void 0, i(59577)),
        ),
        _ = new r.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(30839)),
        ),
        T = new r.TranslatedString(
          'change {title} background transparency',
          o.t(null, void 0, i(13783)),
        ),
        w = new r.TranslatedString(
          'change {title} reverse',
          o.t(null, void 0, i(50762)),
        ),
        P = new r.TranslatedString(
          'change {title} fan {index} line visibility',
          o.t(null, void 0, i(28833)),
        ),
        D = new r.TranslatedString(
          'change {title} fan {index} line color',
          o.t(null, void 0, i(62500)),
        ),
        m = new r.TranslatedString(
          'change {title} fan {index} line width',
          o.t(null, void 0, i(45732)),
        ),
        S = new r.TranslatedString(
          'change {title} arcs {index} line visibility',
          o.t(null, void 0, i(4313)),
        ),
        b = new r.TranslatedString(
          'change {title} arcs {index} line color',
          o.t(null, void 0, i(95582)),
        ),
        C = new r.TranslatedString(
          'change {title} arcs {index} line width',
          o.t(null, void 0, i(8745)),
        ),
        x = new r.TranslatedString(
          'change top margin',
          o.t(null, void 0, i(74883)),
        ),
        L = o.t(null, void 0, i(64489)),
        A = o.t(null, void 0, i(28683)),
        k = o.t(null, void 0, i(79468)),
        V = o.t(null, void 0, i(78393)),
        M = o.t(null, void 0, i(27177)),
        $ = o.t(null, void 0, i(79650)),
        W = o.t(null, void 0, i(84885)),
        B = o.t(null, void 0, i(59129))
      function R(e) {
        return e instanceof c.LineToolGannComplex
      }
      class z extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            o = (0, u.removeSpaces)(i),
            a = new r.TranslatedString(i, this._source.translatedType()),
            c = [],
            z = t.levels.childCount()
          for (let e = 0; e < z; e++) {
            const i = t.levels.childs()[e].childs(),
              n = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    y.format({ title: a, index: e }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    f.format({ title: a, index: e }),
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.width,
                    g.format({ title: a, index: e }),
                  ),
                },
                { id: `${o}LineLevel${e}`, title: `${e}` },
              )
            c.push(n)
          }
          const N = (0, s.createPropertyDefinitionsLeveledLinesGroup)(
            c,
            `${o}LeveledLinesGroup`,
          )
          e.push(
            (0, s.createPropertyDefinitionsGeneralGroup)(
              [N],
              `${o}LevelGroup`,
              $,
            ),
          )
          const I = [],
            E = t.fanlines.childCount()
          for (let e = 0; e < E; e++) {
            const i = t.fanlines.childs()[e].childs(),
              n = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    P.format({ title: a, index: e }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    D.format({ title: a, index: e }),
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.width,
                    m.format({ title: a, index: e }),
                  ),
                },
                {
                  id: `${o}FanLineLevel${e}`,
                  title: `${i.x.value()}x${i.y.value()}`,
                },
              )
            I.push(n)
          }
          const O = (0, s.createPropertyDefinitionsLeveledLinesGroup)(
            I,
            `${o}FanLeveledLinesGroup`,
          )
          e.push(
            (0, s.createPropertyDefinitionsGeneralGroup)(
              [O],
              `${o}FanLinesGroup`,
              W,
            ),
          )
          const U = [],
            G = t.arcs.childCount()
          for (let e = 0; e < G; e++) {
            const i = t.arcs.childs()[e].childs(),
              n = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    S.format({ title: a, index: e }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    b.format({ title: a, index: e }),
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.width,
                    C.format({ title: a, index: e }),
                  ),
                },
                {
                  id: `${o}ArcsLineLevel${e}`,
                  title: `${i.x.value()}x${i.y.value()}`,
                },
              )
            U.push(n)
          }
          const F = (0, s.createPropertyDefinitionsLeveledLinesGroup)(
            U,
            `${o}ArcsLeveledLinesGroup`,
          )
          e.push(
            (0, s.createPropertyDefinitionsGeneralGroup)(
              [F],
              `${o}ArcsLinesGroup`,
              B,
            ),
          )
          const H = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new h.CollectibleColorPropertyUndoWrapper(
                  (0, n.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  v.format({ title: a }),
                ),
                null,
                null,
              ),
            },
            { id: `${o}AllLineColor`, title: A },
          )
          e.push(H)
          const j = t.arcsBackground.childs(),
            Y = (0, s.createTransparencyPropertyDefinition)(
              {
                checked: (0, s.convertToDefinitionProperty)(
                  this._propertyApplier,
                  j.fillBackground,
                  _.format({ title: a }),
                ),
                transparency: (0, s.convertToDefinitionProperty)(
                  this._propertyApplier,
                  j.transparency,
                  T.format({ title: a }),
                ),
              },
              { id: `${o}Background`, title: k },
            )
          e.push(Y)
          const X = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.reverse,
                w.format({ title: a }),
              ),
            },
            { id: `${o}Reverse`, title: L },
          )
          if ((e.push(X), R(this._source))) {
            const t = this._source,
              i = t.properties().childs(),
              n = (0, s.createNumberPropertyDefinition)(
                {
                  value: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.scaleRatio,
                    x,
                    [
                      (0, p.limitedPrecision)(7),
                      (e) =>
                        null !== e
                          ? Number.parseFloat(
                              t.getScaleRatioFormatter().format(e, {
                                ignoreLocaleNumberFormat: !0,
                              }),
                            )
                          : null,
                    ],
                  ),
                },
                {
                  id: 'scaleRatio',
                  title: V,
                  min: new d.WatchedValue(1e-7),
                  max: new d.WatchedValue(1e8),
                  step: new d.WatchedValue(t.getScaleRatioStep()),
                },
              )
            e.push(n)
            const o = i.labelsStyle.childs(),
              r = (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  showText: i.showLabels,
                  fontSize: o.fontSize,
                  bold: o.bold,
                  italic: o.italic,
                },
                a,
                { customTitles: { text: M } },
              )
            e.push(r)
          }
          return { definitions: e }
        }
      }
    },
    72443: (e, t, i) => {
      i.r(t), i.d(t, { GannFanDefinitionsViewModel: () => P })
      var n = i(50151),
        o = i(11542),
        r = i(45126),
        l = i(32097),
        s = i(18009),
        a = i(91682),
        c = i(95166)
      const d = new r.TranslatedString(
          'change {title} level {index} line visibility',
          o.t(null, void 0, i(51403)),
        ),
        p = new r.TranslatedString(
          'change {title} level {index} line color',
          o.t(null, void 0, i(664)),
        ),
        u = new r.TranslatedString(
          'change {title} level {index} line width',
          o.t(null, void 0, i(97870)),
        ),
        h = new r.TranslatedString(
          'change {title} level {index} line style',
          o.t(null, void 0, i(64707)),
        ),
        y = new r.TranslatedString(
          'change {title} all lines color',
          o.t(null, void 0, i(59577)),
        ),
        f = new r.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(30839)),
        ),
        g = new r.TranslatedString(
          'change {title} background transparency',
          o.t(null, void 0, i(13783)),
        ),
        v = new r.TranslatedString(
          'change {title} labels visibility',
          o.t(null, void 0, i(93340)),
        ),
        _ = o.t(null, void 0, i(28683)),
        T = o.t(null, void 0, i(79468)),
        w = o.t(null, void 0, i(5119))
      class P extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            o = (0, a.removeSpaces)(i),
            s = new r.TranslatedString(i, this._source.translatedType()),
            P = this._source.levelsCount()
          for (let i = 1; i <= P; i++) {
            const n = t[`level${i}`].childs(),
              r = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.visible,
                    d.format({ title: s, index: i }),
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    n.color,
                    null,
                    p.format({ title: s, index: i }),
                  ),
                  width: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.linewidth,
                    u.format({ title: s, index: i }),
                  ),
                  style: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.linestyle,
                    h.format({ title: s, index: i }),
                  ),
                },
                {
                  id: `${o}LineLevel${i}`,
                  title: `${n.coeff1.value()}/${n.coeff2.value()}`,
                },
              )
            e.push(r)
          }
          const D = (0, l.createColorPropertyDefinition)(
            {
              color: (0, l.getColorDefinitionProperty)(
                this._propertyApplier,
                new c.CollectibleColorPropertyUndoWrapper(
                  (0, n.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                y.format({ title: s }),
              ),
            },
            { id: `${o}AllLineColor`, title: _ },
          )
          e.push(D)
          const m = (0, l.createTransparencyPropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                f.format({ title: s }),
              ),
              transparency: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                g.format({ title: s }),
              ),
            },
            { id: `${o}Background`, title: T },
          )
          e.push(m)
          const S = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.showLabels,
                v.format({ title: s }),
              ),
            },
            { id: `${o}Labels`, title: w },
          )
          return e.push(S), { definitions: e }
        }
      }
    },
    27340: (e, t, i) => {
      i.r(t), i.d(t, { GannSquareDefinitionsViewModel: () => $ })
      var n = i(50151),
        o = i(11542),
        r = i(45126),
        l = i(32097),
        s = i(18009),
        a = i(91682),
        c = i(95166)
      const d = new r.TranslatedString(
          'change {title} level {index} line visibility',
          o.t(null, void 0, i(51403)),
        ),
        p = new r.TranslatedString(
          'change {title} level {index} line color',
          o.t(null, void 0, i(664)),
        ),
        u = new r.TranslatedString(
          'change {title} level {index} line coeff',
          o.t(null, void 0, i(27154)),
        ),
        h = new r.TranslatedString(
          'change {title} all lines color',
          o.t(null, void 0, i(59577)),
        ),
        y = new r.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(30839)),
        ),
        f = new r.TranslatedString(
          'change {title} background transparency',
          o.t(null, void 0, i(13783)),
        ),
        g = new r.TranslatedString(
          'change {title} reverse',
          o.t(null, void 0, i(50762)),
        ),
        v = new r.TranslatedString(
          'change {title} left labels visibility',
          o.t(null, void 0, i(63021)),
        ),
        _ = new r.TranslatedString(
          'change {title} right labels visibility',
          o.t(null, void 0, i(8390)),
        ),
        T = new r.TranslatedString(
          'change {title} top labels visibility',
          o.t(null, void 0, i(81301)),
        ),
        w = new r.TranslatedString(
          'change {title} bottom labels visibility',
          o.t(null, void 0, i(62130)),
        ),
        P = new r.TranslatedString(
          'change {title} fans visibility',
          o.t(null, void 0, i(15972)),
        ),
        D = new r.TranslatedString(
          'change {title} fans line color',
          o.t(null, void 0, i(1716)),
        ),
        m = o.t(null, void 0, i(28683)),
        S = o.t(null, void 0, i(79468)),
        b = o.t(null, void 0, i(58557)),
        C = o.t(null, void 0, i(58476)),
        x = o.t(null, void 0, i(65e3)),
        L = o.t(null, void 0, i(28971)),
        A = o.t(null, void 0, i(74939)),
        k = o.t(null, void 0, i(17129)),
        V = o.t(null, void 0, i(36335)),
        M = o.t(null, void 0, i(64489))
      class $ extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            o = (0, a.removeSpaces)(i),
            s = new r.TranslatedString(i, this._source.translatedType()),
            $ = [],
            W = this._source.hLevelsCount()
          for (let e = 1; e <= W; e++) {
            const i = t[`hlevel${e}`].childs(),
              n = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    d.format({ title: s, index: e }),
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    p.format({ title: s, index: e }),
                  ),
                  level: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.coeff,
                    u.format({ title: s, index: e }),
                  ),
                },
                { id: `${o}HLineLevel${e}` },
              )
            $.push(n)
          }
          const B = (0, l.createPropertyDefinitionsLeveledLinesGroup)(
              $,
              `${o}HLeveledLinesGroup`,
            ),
            R = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showLeftLabels,
                  v.format({ title: s }),
                ),
              },
              { id: `${o}LeftLabels`, title: x },
            ),
            z = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showRightLabels,
                  _.format({ title: s }),
                ),
              },
              { id: `${o}RightLabels`, title: L },
            ),
            N = (0, l.createTransparencyPropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.fillHorzBackground,
                  y.format({ title: s }),
                ),
                transparency: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.horzTransparency,
                  f.format({ title: s }),
                ),
              },
              { id: `${o}BackgroundH`, title: S },
            ),
            I = (0, l.createPropertyDefinitionsGeneralGroup)(
              [B, R, z, N],
              `${o}HLevelGroup`,
              b,
            )
          e.push(I)
          const E = [],
            O = this._source.vLevelsCount()
          for (let e = 1; e <= O; e++) {
            const i = t[`vlevel${e}`].childs(),
              n = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    d.format({ title: s, index: e }),
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    p.format({ title: s, index: e }),
                  ),
                  level: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.coeff,
                    u.format({ title: s, index: e }),
                  ),
                },
                { id: `${o}VLineLevel${e}` },
              )
            E.push(n)
          }
          const U = (0, l.createPropertyDefinitionsLeveledLinesGroup)(
              E,
              `${o}VLeveledLinesGroup`,
            ),
            G = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showTopLabels,
                  T.format({ title: s }),
                ),
              },
              { id: `${o}TopLabels`, title: A },
            ),
            F = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showBottomLabels,
                  w.format({ title: s }),
                ),
              },
              { id: `${o}BottomLabels`, title: k },
            ),
            H = (0, l.createTransparencyPropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.fillVertBackground,
                  y.format({ title: s }),
                ),
                transparency: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.vertTransparency,
                  f.format({ title: s }),
                ),
              },
              { id: `${o}BackgroundV`, title: S },
            ),
            j = (0, l.createPropertyDefinitionsGeneralGroup)(
              [U, G, F, H],
              `${o}VLevelGroup`,
              C,
            )
          e.push(j)
          const Y = (0, l.createColorPropertyDefinition)(
            {
              color: (0, l.getColorDefinitionProperty)(
                this._propertyApplier,
                new c.CollectibleColorPropertyUndoWrapper(
                  (0, n.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                h.format({ title: s }),
                !0,
              ),
            },
            { id: `${o}AllLineColor`, title: m },
          )
          e.push(Y)
          const X = t.fans.childs(),
            K = (0, l.createColorPropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  X.visible,
                  P.format({ title: s }),
                ),
                color: (0, l.getColorDefinitionProperty)(
                  this._propertyApplier,
                  X.color,
                  null,
                  D.format({ title: s }),
                ),
              },
              { id: `${o}FansLines`, title: V },
            )
          e.push(K)
          const q = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.reverse,
                g.format({ title: s }),
              ),
            },
            { id: `${o}Reverse`, title: M },
          )
          return e.push(q), { definitions: e }
        }
      }
    },
    86622: (e, t, i) => {
      i.r(t), i.d(t, { GeneralBezierDefinitionsViewModel: () => u })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(18009),
        s = i(32097),
        a = i(91682)
      const c = new o.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(30839)),
        ),
        d = new o.TranslatedString(
          'change {title} background color',
          n.t(null, void 0, i(49765)),
        ),
        p = n.t(null, void 0, i(79468))
      class u extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new o.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._undoModel,
                {
                  lineColor: e.linecolor,
                  lineWidth: e.linewidth,
                  lineStyle: e.linestyle,
                  extendLeft: e.extendLeft,
                  extendRight: e.extendRight,
                  leftEnd: e.leftEnd,
                  rightEnd: e.rightEnd,
                },
                i,
                'Line',
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._undoModel,
                    e.fillBackground,
                    c.format({ title: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._undoModel,
                    e.backgroundColor,
                    e.transparency,
                    d.format({ title: i }),
                  ),
                },
                { id: (0, a.removeSpaces)(`${t}BackgroundColor`), title: p },
              ),
            ],
          }
        }
      }
    },
    14336: (e, t, i) => {
      i.r(t), i.d(t, { GeneralDatePriceRangeDefinitionsViewModel: () => x })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(91335),
        s = i(18009),
        a = i(32097),
        c = i(91682)
      const d = new o.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(30839)),
        ),
        p = new o.TranslatedString(
          'change {title} background color',
          n.t(null, void 0, i(49765)),
        ),
        u = new o.TranslatedString(
          'change {title} extend top',
          n.t(null, void 0, i(30126)),
        ),
        h = new o.TranslatedString(
          'change {title} extend bottom',
          n.t(null, void 0, i(59665)),
        ),
        y = new o.TranslatedString(
          'change {title} extend left',
          n.t(null, void 0, i(35139)),
        ),
        f = new o.TranslatedString(
          'change {title} volume visibility',
          n.t(null, void 0, i(36336)),
        ),
        g = n.t(null, void 0, i(3554)),
        v = n.t(null, void 0, i(38408)),
        _ = n.t(null, void 0, i(79468)),
        T = n.t(null, void 0, i(71397)),
        w = n.t(null, void 0, i(76410)),
        P = n.t(null, void 0, i(25112)),
        D = n.t(null, void 0, i(68461)),
        m = n.t(null, void 0, i(74872)),
        S = n.t(null, void 0, i(73863)),
        b = n.t(null, void 0, i(70320)),
        C = n.t(null, void 0, i(37644))
      class x extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, c.removeSpaces)(i),
            s = new o.TranslatedString(i, this._source.translatedType()),
            b = (0, r.createLineStyleDefinition)(
              this._propertyApplier,
              { lineColor: t.linecolor, lineWidth: t.linewidth },
              s,
              'Line',
              { line: g },
            )
          e.push(b)
          const x = Object.hasOwn(t, 'borderWidth')
          if (x) {
            const i = (0, r.createLineStyleDefinition)(
              this._propertyApplier,
              {
                showLine: t.drawBorder,
                lineColor: t.borderColor,
                lineWidth: t.borderWidth,
              },
              s,
              'Border',
              { line: v },
            )
            e.push(i)
          }
          const L = (0, a.createColorPropertyDefinition)(
            {
              checked: (0, a.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                d.format({ title: s }),
              ),
              color: (0, a.getColorDefinitionProperty)(
                this._propertyApplier,
                t.backgroundColor,
                t.backgroundTransparency,
                p.format({ title: s }),
              ),
            },
            { id: `${n}BackgroundColor`, title: _ },
          )
          e.push(L)
          const A = ((e) => Object.hasOwn(e, 'extendTop'))(t)
          if (A) {
            const i = (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    t.extendTop,
                    u.format({ title: s }),
                  ),
                },
                { id: `${n}ExtendTop`, title: T },
              ),
              o = (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    t.extendBottom,
                    h.format({ title: s }),
                  ),
                },
                { id: `${n}ExtendBottom`, title: w },
              )
            e.push(i, o)
          }
          if (((e) => Object.hasOwn(e, 'extendLeft'))(t)) {
            const i = (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    t.extendLeft,
                    y.format({ title: s }),
                  ),
                },
                { id: `${n}extendLeft`, title: P },
              ),
              o = (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    t.extendRight,
                    h.format({ title: s }),
                  ),
                },
                { id: `${n}ExtendBottom`, title: D },
              )
            e.push(i, o)
          }
          const k = (0, l.createTextStyleDefinition)(
            this._propertyApplier,
            {
              textColor: t.textcolor,
              backgroundColor: t.labelBackgroundColor,
              backgroundTransparency: t.backgroundTransparency,
              fontSize: t.fontsize,
              backgroundVisible: t.fillLabelBackground,
            },
            s,
            {
              isEditable: !0,
              isMultiLine: !0,
              customTitles: { text: m, backgroundTitle: S },
            },
          )
          if ((e.push(k), x || A)) {
            const i = (0, a.createCheckablePropertyDefinition)(
              {
                checked: (0, a.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showVolume,
                  f.format({ title: s }),
                ),
              },
              { id: `${n}ShowVolume`, title: C },
            )
            e.push(i)
          }
          return { definitions: e }
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs().customText.childs()
          return {
            definitions: [
              (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  showText: e.visible,
                  textColor: e.color,
                  fontSize: e.fontsize,
                },
                new o.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: b } },
              ),
            ],
          }
        }
      }
    },
    90490: (e, t, i) => {
      i.r(t),
        i.d(t, {
          GeneralFiguresDefinitionsViewModel: () => y,
          GeneralFiguresDefinitionsViewModelBase: () => h,
        })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(18009),
        s = i(32097),
        a = i(91682)
      const c = new o.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(30839)),
        ),
        d = new o.TranslatedString(
          'change {title} background color',
          n.t(null, void 0, i(49765)),
        ),
        p = n.t(null, void 0, i(38408)),
        u = n.t(null, void 0, i(79468))
      class h extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new o.TranslatedString(t, this._source.translatedType()),
            n = (0, r.createLineStyleDefinition)(
              this._propertyApplier,
              {
                lineColor: e.color,
                lineWidth: e.linewidth,
                lineStyle: e.linestyle,
              },
              i,
              'Line',
              { line: p },
            ),
            l = 'transparency' in e ? e.transparency : null
          return {
            definitions: [
              n,
              (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    c.format({ title: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    l,
                    d.format({ title: i }),
                  ),
                },
                { id: (0, a.removeSpaces)(`${t}BackgroundColor`), title: u },
              ),
            ],
          }
        }
      }
      class y extends h {}
    },
    41585: (e, t, i) => {
      i.r(t), i.d(t, { GeneralTrendFiguresDefinitionsViewModel: () => v })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(91335),
        s = i(18009),
        a = i(32097),
        c = i(30699),
        d = i(91682)
      const p = new o.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(30839)),
        ),
        u = new o.TranslatedString(
          'change {title} background color',
          n.t(null, void 0, i(49765)),
        ),
        h = [
          { value: c.VerticalAlign.Bottom, title: n.t(null, void 0, i(97118)) },
          { value: c.VerticalAlign.Middle, title: n.t(null, void 0, i(91612)) },
          { value: c.VerticalAlign.Top, title: n.t(null, void 0, i(27567)) },
        ],
        y = n.t(null, void 0, i(70320)),
        f = n.t(null, void 0, i(29416)),
        g = n.t(null, void 0, i(79468))
      class v extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new o.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  lineColor: e.linecolor,
                  lineWidth: e.linewidth,
                  lineStyle: e.linestyle,
                },
                i,
                'Line',
              ),
              (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  showText: e.showPrices,
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                },
                i,
                { customTitles: { text: f } },
              ),
              (0, a.createColorPropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    p.format({ title: i }),
                  ),
                  color: (0, a.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    u.format({ title: i }),
                  ),
                },
                { id: (0, d.removeSpaces)(`${t}Background`), title: g },
              ),
            ],
          }
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.labelTextColor,
                  text: e.labelText,
                  bold: e.labelBold,
                  italic: e.labelItalic,
                  fontSize: e.labelFontSize,
                  horzLabelsAlign: e.labelHorzAlign,
                  vertLabelsAlign: e.labelVertAlign,
                  showText: e.labelVisible,
                },
                new o.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                {
                  isEditable: !0,
                  isMultiLine: !0,
                  alignmentVerticalItems: h,
                  customTitles: { text: y },
                },
              ),
            ],
          }
        }
      }
    },
    9786: (e, t, i) => {
      i.r(t), i.d(t, { GhostFeedDefinitionsViewModel: () => b })
      var n = i(11542),
        o = i(45126),
        r = i(18009),
        l = i(32097),
        s = i(64147),
        a = i(91682)
      const c = new o.TranslatedString(
          'change {title} candle up color',
          n.t(null, void 0, i(21631)),
        ),
        d = new o.TranslatedString(
          'change {title} candle down color',
          n.t(null, void 0, i(80022)),
        ),
        p = new o.TranslatedString(
          'change {title} candle border visibility',
          n.t(null, void 0, i(88530)),
        ),
        u = new o.TranslatedString(
          'change {title} candle border up color',
          n.t(null, void 0, i(97345)),
        ),
        h = new o.TranslatedString(
          'change {title} candle border down color',
          n.t(null, void 0, i(81139)),
        ),
        y = new o.TranslatedString(
          'change {title} candle wick visibility',
          n.t(null, void 0, i(85382)),
        ),
        f = new o.TranslatedString(
          'change {title} candle wick color',
          n.t(null, void 0, i(33589)),
        ),
        g = new o.TranslatedString(
          'change {title} transparency',
          n.t(null, void 0, i(51085)),
        ),
        v = new o.TranslatedString(
          'change {title} average HL value',
          n.t(null, void 0, i(39393)),
        ),
        _ = new o.TranslatedString(
          'change {title} variance value',
          n.t(null, void 0, i(23171)),
        ),
        T = n.t(null, void 0, i(45054)),
        w = n.t(null, void 0, i(333)),
        P = n.t(null, void 0, i(32163)),
        D = n.t(null, void 0, i(19788)),
        m = n.t(null, void 0, i(52648)),
        S = n.t(null, void 0, i(29566))
      class b extends r.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, a.removeSpaces)(t),
            n = new o.TranslatedString(t, this._source.translatedType()),
            r = e.candleStyle.childs()
          return {
            definitions: [
              (0, l.createTwoColorsPropertyDefinition)(
                {
                  color1: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.upColor,
                    null,
                    c.format({ title: n }),
                  ),
                  color2: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.downColor,
                    null,
                    d.format({ title: n }),
                  ),
                },
                { id: `${i}Candle2Colors`, title: T },
              ),
              (0, l.createTwoColorsPropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.drawBorder,
                    p.format({ title: n }),
                  ),
                  color1: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.borderUpColor,
                    null,
                    u.format({ title: n }),
                  ),
                  color2: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.borderDownColor,
                    null,
                    h.format({ title: n }),
                  ),
                },
                { id: `${i}CandleBorder2Colors`, title: w },
              ),
              (0, l.createColorPropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.drawWick,
                    y.format({ title: n }),
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.wickColor,
                    null,
                    f.format({ title: n }),
                  ),
                },
                { id: `${i}CandleWickColor`, title: P },
              ),
              (0, l.createTransparencyPropertyDefinition)(
                {
                  transparency: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.transparency,
                    g.format({ title: n }),
                  ),
                },
                { id: `${i}Transparency`, title: D },
              ),
            ],
          }
        }
        _inputsPropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, a.removeSpaces)(t),
            n = new o.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, l.createNumberPropertyDefinition)(
                {
                  value: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.averageHL,
                    v.format({ title: n }),
                  ),
                },
                {
                  id: `${i}AvgHL`,
                  title: m,
                  type: 0,
                  min: new s.WatchedValue(1),
                  max: new s.WatchedValue(5e4),
                  step: new s.WatchedValue(1),
                },
              ),
              (0, l.createNumberPropertyDefinition)(
                {
                  value: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.variance,
                    _.format({ title: n }),
                  ),
                },
                {
                  id: `${i}Variance`,
                  title: S,
                  type: 0,
                  min: new s.WatchedValue(1),
                  max: new s.WatchedValue(100),
                  step: new s.WatchedValue(1),
                },
              ),
            ],
          }
        }
      }
    },
    14542: (e, t, i) => {
      i.r(t), i.d(t, { HighlighterDefinitionsViewModel: () => u })
      var n = i(11542),
        o = i(91682),
        r = i(45126),
        l = i(64147),
        s = i(32097),
        a = i(53749),
        c = i(18009)
      const d = new r.TranslatedString(
          'change {title} width',
          n.t(null, void 0, i(60111)),
        ),
        p = [8, 12, 20, 32, 48, 64, 80, 96].map((e) => ({
          value: e,
          title: `${e.toString()}px`,
        }))
      class u extends c.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            c = new r.TranslatedString(t, this._source.translatedType()),
            u = (0, o.removeSpaces)(t)
          return {
            definitions: [
              (0, a.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.linecolor },
                c,
                'Line',
              ),
              (0, s.createOptionsPropertyDefinition)(
                {
                  option: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.width,
                    d.format({ title: c }),
                  ),
                },
                {
                  id: `${u}Thickness`,
                  title: n.t(null, void 0, i(54971)),
                  options: new l.WatchedValue(p),
                },
              ),
            ],
          }
        }
        _coordinatesPropertyDefinitions() {
          return null
        }
      }
    },
    84190: (e, t, i) => {
      i.r(t), i.d(t, { HorizontalLineDefinitionsViewModel: () => h })
      var n = i(11542),
        o = i(45126),
        r = i(32097),
        l = i(73174),
        s = i(91682),
        a = i(18009),
        c = i(88924),
        d = i(91335)
      const p = n.t(null, void 0, i(70320)),
        u = n.t(null, { context: 'linetool point' }, i(37814))
      class h extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return (0, c.getLinesStylesPropertiesDefinitions)(
            this._propertyApplier,
            e,
            new o.TranslatedString(
              this._source.name(),
              this._source.translatedType(),
            ),
          )
        }
        _coordinatesPropertyDefinitions() {
          const e = this._source.pointsProperty().childs().points[0].childs(),
            t = this._getYCoordinateStepWV(),
            i = (0, l.getCoordinateYMetaInfo)(this._propertyApplier, e, t)
          return {
            definitions: [
              (0, r.createCoordinatesPropertyDefinition)(
                { y: i.property },
                {
                  id: (0, s.removeSpaces)(`${this._source.name()}Point`),
                  title: u,
                  ...i.info,
                },
              ),
            ],
          }
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, d.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  showText: e.showLabel,
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  textOrientation: e.textOrientation,
                },
                new o.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: p } },
              ),
            ],
          }
        }
      }
    },
    22707: (e, t, i) => {
      i.r(t), i.d(t, { HorizontalRayDefinitionsViewModel: () => c })
      var n = i(11542),
        o = i(45126),
        r = i(18009),
        l = i(88924),
        s = i(91335)
      const a = n.t(null, void 0, i(70320))
      class c extends r.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return (0, l.getLinesStylesPropertiesDefinitions)(
            this._propertyApplier,
            e,
            new o.TranslatedString(
              this._source.name(),
              this._source.translatedType(),
            ),
          )
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, s.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  showText: e.showLabel,
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  textOrientation: e.textOrientation,
                },
                new o.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: a } },
              ),
            ],
          }
        }
      }
    },
    19532: (e, t, i) => {
      i.r(t), i.d(t, { IconsDefinitionsViewModel: () => d })
      var n = i(11542),
        o = i(45126),
        r = i(18009),
        l = i(32097),
        s = i(91682)
      const a = new o.TranslatedString(
          'change {title} color',
          n.t(null, void 0, i(49442)),
        ),
        c = n.t(null, void 0, i(47370))
      class d extends r.LineDataSourceDefinitionsViewModel {
        constructor(e, t) {
          super(e, t)
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new o.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, l.createColorPropertyDefinition)(
                {
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.color,
                    null,
                    a.format({ title: i }),
                  ),
                },
                { id: (0, s.removeSpaces)(`${t}Color`), title: c },
              ),
            ],
          }
        }
      }
    },
    65504: (e, t, i) => {
      i.r(t), i.d(t, { ImageDefinitionsViewModel: () => f })
      var n = i(11542),
        o = i(45126),
        r = i(32097),
        l = i(18009),
        s = i(18181),
        a = i(12988)
      const c = new o.TranslatedString(
          'change image',
          n.t(null, void 0, i(83842)),
        ),
        d = new o.TranslatedString(
          'change image transparency',
          n.t(null, void 0, i(65309)),
        ),
        p = n.t(null, void 0, i(68065)),
        u = n.t(null, void 0, i(19788)),
        h = n.t(null, void 0, i(81169))
      function y(e) {
        return null !== (0, s.buildAbsoluteUserImageUrl)(e) ? '' : h
      }
      class f extends l.LineDataSourceDefinitionsViewModel {
        destroy() {
          this._source.properties().childs().url.unsubscribeAll(this),
            super.destroy()
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          if (void 0 === this._customErrorProperty) {
            const t = new a.Property(y(e.url.value()))
            ;(this._customErrorProperty = t),
              e.url.subscribe(this, (e) => {
                t.setValue(y(e.value()))
              })
          }
          return {
            definitions: [
              (0, r.createImagePropertyDefinition)(
                {
                  url: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    this._source.absoluteUserImageUrl(),
                    c,
                  ),
                  transparency: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.transparency,
                    d,
                  ),
                },
                { id: 'image', title: p },
              ),
              (0, r.createTransparencyPropertyDefinition)(
                {
                  transparency: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.transparency,
                    d,
                  ),
                },
                { id: 'imageTransparency', title: u },
              ),
            ],
          }
        }
      }
    },
    73653: (e, t, i) => {
      i.r(t), i.d(t, { ParallelChannelDefinitionsViewModel: () => x })
      var n = i(11542),
        o = i(50151),
        r = i(45126),
        l = i(32097),
        s = i(30699),
        a = i(18009),
        c = i(91335),
        d = i(91682),
        p = i(73174),
        u = i(14608)
      const h = new r.TranslatedString(
          'change {title} extending left',
          n.t(null, void 0, i(58052)),
        ),
        y = new r.TranslatedString(
          'change {title} extending right',
          n.t(null, void 0, i(74867)),
        ),
        f = new r.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(30839)),
        ),
        g = new r.TranslatedString(
          'change {title} background color',
          n.t(null, void 0, i(49765)),
        ),
        v = [
          { value: s.VerticalAlign.Bottom, title: n.t(null, void 0, i(97118)) },
          { value: s.VerticalAlign.Middle, title: n.t(null, void 0, i(91612)) },
          { value: s.VerticalAlign.Top, title: n.t(null, void 0, i(27567)) },
        ],
        _ = n.t(null, void 0, i(70320)),
        T = n.t(null, void 0, i(61856)),
        w = n.t(null, void 0, i(87430)),
        P = n.t(null, void 0, i(79468)),
        D = new r.TranslatedString(
          'change {title} level {index} line visibility',
          n.t(null, void 0, i(51403)),
        ),
        m = new r.TranslatedString(
          'change {title} level {index} line color',
          n.t(null, void 0, i(664)),
        ),
        S = new r.TranslatedString(
          'change {title} level {index} line width',
          n.t(null, void 0, i(97870)),
        ),
        b = new r.TranslatedString(
          'change {title} level {index} line style',
          n.t(null, void 0, i(64707)),
        ),
        C = new r.TranslatedString(
          'change {title} level {index} line coeff',
          n.t(null, void 0, i(27154)),
        )
      class x extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties(),
            i = t.childs(),
            n = this._source.name(),
            s = (0, d.removeSpaces)(n),
            a = new r.TranslatedString(n, this._source.translatedType()),
            c = this._source.levelsCount()
          for (let i = 1; i <= c; i++) {
            const n = (0, o.ensureDefined)(t.child(`level${i}`)).childs(),
              r = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.visible,
                    D.format({ title: a, index: i }),
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    n.color,
                    null,
                    m.format({ title: a, index: i }),
                  ),
                  width: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.lineWidth,
                    S.format({ title: a, index: i }),
                  ),
                  style: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.lineStyle,
                    b.format({ title: a, index: i }),
                  ),
                  level: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.coeff,
                    C.format({ title: a, index: i }),
                  ),
                },
                { id: `${s}LineLevel${i}`, locked: 2 === i || 6 === i },
              )
            e.push(r)
          }
          return (
            e.push(
              (0, l.createCheckablePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.extendLeft,
                    h.format({ title: a }),
                  ),
                },
                { id: `${s}ExtendLeft`, title: T },
              ),
            ),
            e.push(
              (0, l.createCheckablePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.extendRight,
                    y.format({ title: a }),
                  ),
                },
                { id: `${s}ExtendRight`, title: w },
              ),
            ),
            e.push(
              (0, l.createColorPropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.fillBackground,
                    f.format({ title: a }),
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.backgroundColor,
                    i.transparency,
                    g.format({ title: a }),
                  ),
                },
                { id: `${s}Background`, title: P },
              ),
            ),
            { definitions: e }
          )
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, c.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.labelTextColor,
                  text: e.labelText,
                  bold: e.labelBold,
                  italic: e.labelItalic,
                  fontSize: e.labelFontSize,
                  horzLabelsAlign: e.labelHorzAlign,
                  vertLabelsAlign: e.labelVertAlign,
                  showText: e.labelVisible,
                },
                new r.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                {
                  isEditable: !0,
                  isMultiLine: !0,
                  alignmentVerticalItems: v,
                  customTitles: { text: _ },
                },
              ),
            ],
          }
        }
        _coordinatesPropertyDefinitions() {
          const e = this._source.points().slice(0, 2),
            t = this._source.pointsProperty().childs().points,
            o = [],
            s = this._getYCoordinateStepWV()
          return (
            e.forEach((e, i) => {
              const n = t[i].childs()
              n &&
                o.push(
                  (0, p.getCoordinatesPropertiesDefinitions)(
                    this._propertyApplier,
                    n,
                    e,
                    s,
                    a.pointPriceBarTitle.format({ count: (i + 1).toString() }),
                    this._source.name(),
                  ),
                )
            }),
            o.push(
              (0, u.createNumberPropertyDefinition)(
                {
                  value: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    this._source.priceOffsetProperty(),
                    new r.TranslatedString(
                      'Change price offset',
                      n.t(null, void 0, i(9074)),
                    ),
                  ),
                },
                { id: 'PriceOffset', title: 'Price offset', type: 1, step: s },
              ),
            ),
            { definitions: o }
          )
        }
      }
    },
    39878: (e, t, i) => {
      i.r(t), i.d(t, { PathDefinitionsViewModel: () => a })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(18009)
      const s = n.t(null, void 0, i(3554))
      class a extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  lineColor: e.lineColor,
                  lineWidth: e.lineWidth,
                  lineStyle: e.lineStyle,
                  leftEnd: e.leftEnd,
                  rightEnd: e.rightEnd,
                },
                new o.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                'Line',
                { line: s },
              ),
            ],
          }
        }
        _coordinatesPropertyDefinitions() {
          return null
        }
      }
    },
    35737: (e, t, i) => {
      i.r(t), i.d(t, { PatternWithBackgroundDefinitionViewModel: () => f })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(91335),
        s = i(18009),
        a = i(32097),
        c = i(91682)
      const d = new o.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(30839)),
        ),
        p = new o.TranslatedString(
          'change {title} background color',
          n.t(null, void 0, i(49765)),
        ),
        u = n.t(null, void 0, i(74872)),
        h = n.t(null, void 0, i(38408)),
        y = n.t(null, void 0, i(79468))
      class f extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new o.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                },
                i,
                { isEditable: !0, isMultiLine: !0, customTitles: { text: u } },
              ),
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.color, lineWidth: e.linewidth },
                i,
                'Line',
                { line: h },
              ),
              (0, a.createColorPropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    d.format({ title: i }),
                  ),
                  color: (0, a.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    p.format({ title: i }),
                  ),
                },
                { id: (0, c.removeSpaces)(`${t}BackgroundColor`), title: y },
              ),
            ],
          }
        }
      }
    },
    66085: (e, t, i) => {
      i.r(t), i.d(t, { PatternWithoutBackgroundDefinitionsViewModel: () => d })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(91335),
        s = i(18009)
      const a = n.t(null, void 0, i(74872)),
        c = n.t(null, void 0, i(38408))
      class d extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = new o.TranslatedString(
              this._source.name(),
              this._source.translatedType(),
            )
          return {
            definitions: [
              (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                },
                t,
                { isEditable: !0, isMultiLine: !0, customTitles: { text: a } },
              ),
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.color, lineWidth: e.linewidth },
                t,
                'Line',
                { line: c },
              ),
            ],
          }
        }
      }
    },
    10258: (e, t, i) => {
      i.r(t), i.d(t, { PitchForkDefinitionsViewModel: () => u })
      var n = i(11542),
        o = i(45126),
        r = i(32097),
        l = i(56641),
        s = i(96333),
        a = i(64147)
      const c = new o.TranslatedString(
          'change {title} style',
          n.t(null, void 0, i(98463)),
        ),
        d = n.t(null, void 0, i(92516)),
        p = [
          {
            value: s.LineToolPitchforkStyle.Original,
            title: n.t(null, void 0, i(46005)),
          },
          {
            value: s.LineToolPitchforkStyle.Schiff2,
            title: n.t(null, void 0, i(69904)),
          },
          {
            value: s.LineToolPitchforkStyle.Schiff,
            title: n.t(null, void 0, i(70382)),
          },
          {
            value: s.LineToolPitchforkStyle.Inside,
            title: n.t(null, void 0, i(91612)),
          },
        ]
      class u extends l.PitchBaseDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = super._stylePropertyDefinitions(),
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = new o.TranslatedString(i, this._source.translatedType()),
            l = (0, r.createOptionsPropertyDefinition)(
              {
                option: (0, r.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.style,
                  c.format({ title: n }),
                ),
              },
              {
                id: `${i}PitchStyle`,
                title: d,
                options: new a.WatchedValue(p),
              },
            )
          return e.definitions.push(l), e
        }
      }
    },
    16963: (e, t, i) => {
      i.r(t), i.d(t, { PolylinesDefinitionsViewModel: () => h })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(18009),
        s = i(32097),
        a = i(91682)
      const c = new o.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(30839)),
        ),
        d = new o.TranslatedString(
          'change {title} background color',
          n.t(null, void 0, i(49765)),
        ),
        p = n.t(null, void 0, i(38408)),
        u = n.t(null, void 0, i(79468))
      class h extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new o.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.linecolor, lineWidth: e.linewidth },
                i,
                'Line',
                { line: p },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    c.format({ title: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    d.format({ title: i }),
                  ),
                },
                { id: (0, a.removeSpaces)(`${t}BackgroundColor`), title: u },
              ),
            ],
          }
        }
        _coordinatesPropertyDefinitions() {
          return null
        }
      }
    },
    26486: (e, t, i) => {
      i.r(t), i.d(t, { PredictionDefinitionsViewModel: () => A })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(18009),
        s = i(32097),
        a = i(91682)
      const c = new o.TranslatedString(
          'change {title} source text color',
          n.t(null, void 0, i(45833)),
        ),
        d = new o.TranslatedString(
          'change {title} source background color',
          n.t(null, void 0, i(63047)),
        ),
        p = new o.TranslatedString(
          'change {title} source border color',
          n.t(null, void 0, i(93889)),
        ),
        u = new o.TranslatedString(
          'change {title} target text color',
          n.t(null, void 0, i(32230)),
        ),
        h = new o.TranslatedString(
          'change {title} target background color',
          n.t(null, void 0, i(25987)),
        ),
        y = new o.TranslatedString(
          'change {title} target border color',
          n.t(null, void 0, i(24138)),
        ),
        f = new o.TranslatedString(
          'change {title} success text color',
          n.t(null, void 0, i(71715)),
        ),
        g = new o.TranslatedString(
          'change {title} success background color',
          n.t(null, void 0, i(80428)),
        ),
        v = new o.TranslatedString(
          'change {title} failure text color',
          n.t(null, void 0, i(58406)),
        ),
        _ = new o.TranslatedString(
          'change {title} failure background color',
          n.t(null, void 0, i(91321)),
        ),
        T = n.t(null, void 0, i(88479)),
        w = n.t(null, void 0, i(14279)),
        P = n.t(null, void 0, i(64598)),
        D = n.t(null, void 0, i(59264)),
        m = n.t(null, void 0, i(95631)),
        S = n.t(null, void 0, i(79622)),
        b = n.t(null, void 0, i(23971)),
        C = n.t(null, void 0, i(90431)),
        x = n.t(null, void 0, i(71525)),
        L = n.t(null, void 0, i(28357))
      class A extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, a.removeSpaces)(t),
            n = new o.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.linecolor, lineWidth: e.linewidth },
                n,
                'Line',
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.sourceTextColor,
                    null,
                    c.format({ title: n }),
                  ),
                },
                { id: `${i}SourceTextColor`, title: T },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.sourceBackColor,
                    e.transparency,
                    d.format({ title: n }),
                  ),
                },
                { id: `${i}SourceBackgroundColor`, title: w },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.sourceStrokeColor,
                    null,
                    p.format({ title: n }),
                  ),
                },
                { id: `${i}SourceBorderColor`, title: P },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.targetTextColor,
                    null,
                    u.format({ title: n }),
                  ),
                },
                { id: `${i}TargetTextColor`, title: D },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.targetBackColor,
                    null,
                    h.format({ title: n }),
                  ),
                },
                { id: `${i}TargetBackgroundColor`, title: m },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.targetStrokeColor,
                    null,
                    y.format({ title: n }),
                  ),
                },
                { id: `${i}TargetBorderColor`, title: S },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.successTextColor,
                    null,
                    f.format({ title: n }),
                  ),
                },
                { id: `${i}SuccessTextColor`, title: b },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.successBackground,
                    null,
                    g.format({ title: n }),
                  ),
                },
                { id: `${i}SuccessBackgroundColor`, title: C },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.failureTextColor,
                    null,
                    v.format({ title: n }),
                  ),
                },
                { id: `${i}FailureTextColor`, title: x },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.failureBackground,
                    null,
                    _.format({ title: n }),
                  ),
                },
                { id: `${i}FailureBackgroundColor`, title: L },
              ),
            ],
          }
        }
      }
    },
    89785: (e, t, i) => {
      i.r(t), i.d(t, { PriceLabelDefinitionsViewModel: () => a })
      var n = i(11542),
        o = i(45126),
        r = i(91335),
        l = i(18009)
      const s = n.t(null, void 0, i(70320))
      class a extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, r.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.color,
                  fontSize: e.fontsize,
                  backgroundColor: e.backgroundColor,
                  backgroundTransparency: e.transparency,
                  borderColor: e.borderColor,
                },
                new o.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { customTitles: { text: s } },
              ),
            ],
          }
        }
      }
    },
    48306: (e, t, i) => {
      i.r(t), i.d(t, { ProjectionDefinitionsViewModel: () => h })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(18009),
        s = i(32097),
        a = i(91682)
      const c = new o.TranslatedString(
          'change {title} background color 1',
          n.t(null, void 0, i(2788)),
        ),
        d = new o.TranslatedString(
          'change {title} background color 2',
          n.t(null, void 0, i(47108)),
        ),
        p = n.t(null, void 0, i(38408)),
        u = n.t(null, void 0, i(79468))
      class h extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new o.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, s.createTwoColorsPropertyDefinition)(
                {
                  color1: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.color1,
                    e.transparency,
                    c.format({ title: i }),
                  ),
                  color2: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.color2,
                    e.transparency,
                    d.format({ title: i }),
                  ),
                },
                { id: (0, a.removeSpaces)(`${t}Background2Color`), title: u },
              ),
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  lineColor: e.trendline.childs().color,
                  lineWidth: e.linewidth,
                },
                i,
                'Line',
                { line: p },
              ),
            ],
          }
        }
      }
    },
    15041: (e, t, i) => {
      i.r(t), i.d(t, { RectangleDefinitionsViewModel: () => _ })
      var n = i(11542),
        o = i(45126),
        r = i(91682),
        l = i(30699),
        s = i(32097),
        a = i(53749),
        c = i(90490),
        d = i(91335)
      const p = new o.TranslatedString(
          'change {title} extending left',
          n.t(null, void 0, i(58052)),
        ),
        u = new o.TranslatedString(
          'change {title} extending right',
          n.t(null, void 0, i(74867)),
        ),
        h = n.t(null, void 0, i(70320)),
        y = n.t(null, void 0, i(25112)),
        f = n.t(null, void 0, i(68461)),
        g = n.t(null, void 0, i(68286)),
        v = [
          { value: l.VerticalAlign.Bottom, title: n.t(null, void 0, i(97118)) },
          { value: l.VerticalAlign.Middle, title: n.t(null, void 0, i(91612)) },
          { value: l.VerticalAlign.Top, title: n.t(null, void 0, i(27567)) },
        ]
      class _ extends c.GeneralFiguresDefinitionsViewModelBase {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new o.TranslatedString(t, this._source.translatedType()),
            n = super._stylePropertyDefinitions(),
            l = e.middleLine.childs(),
            c = (0, a.createLineStyleDefinition)(
              this._propertyApplier,
              {
                showLine: l.showLine,
                lineColor: l.lineColor,
                lineWidth: l.lineWidth,
                lineStyle: l.lineStyle,
              },
              i,
              t,
              { line: g },
            ),
            d = n.definitions.findIndex(
              (e) => e.id === (0, r.removeSpaces)(`${t}BackgroundColor`),
            )
          d < 0 ? n.definitions.push(c) : n.definitions.splice(d, 0, c)
          const h = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                e.extendRight,
                u.format({ title: i }),
              ),
            },
            { id: `${t}ExtendRight`, title: f },
          )
          n.definitions.push(h)
          const v = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                e.extendLeft,
                p.format({ title: i }),
              ),
            },
            { id: `${t}ExtendLeft`, title: y },
          )
          return n.definitions.push(v), n
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, d.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.textColor,
                  text: e.text,
                  bold: e.bold,
                  italic: e.italic,
                  fontSize: e.fontSize,
                  horzLabelsAlign: e.horzLabelsAlign,
                  vertLabelsAlign: e.vertLabelsAlign,
                  showText: e.showLabel,
                },
                new o.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                {
                  isEditable: !0,
                  isMultiLine: !0,
                  alignmentVerticalItems: v,
                  customTitles: { text: h },
                },
              ),
            ],
          }
        }
      }
    },
    2243: (e, t, i) => {
      i.r(t), i.d(t, { RiskRewardDefinitionsViewModel: () => F })
      var n = i(91682),
        o = i(11542),
        r = i(45126),
        l = i(53749),
        s = i(91335),
        a = i(18009),
        c = i(32097),
        d = i(76386),
        p = i(64147)
      const u = new r.TranslatedString(
          'change {title} stop color',
          o.t(null, void 0, i(26598)),
        ),
        h = new r.TranslatedString(
          'change {title} target color',
          o.t(null, void 0, i(10504)),
        ),
        y = new r.TranslatedString(
          'change {title} price labels visibility',
          o.t(null, void 0, i(343)),
        ),
        f = new r.TranslatedString(
          'change {title} compact stats mode',
          o.t(null, void 0, i(49904)),
        ),
        g = new r.TranslatedString(
          'change {title} always show stats',
          o.t(null, void 0, i(80390)),
        ),
        v = new r.TranslatedString(
          'change {title} account size',
          o.t(null, void 0, i(99232)),
        ),
        _ =
          (new r.TranslatedString(
            'change {title} currency',
            o.t(null, void 0, i(91600)),
          ),
          new r.TranslatedString(
            'change {title} lot size',
            o.t(null, void 0, i(54087)),
          )),
        T = new r.TranslatedString(
          'change {title} risk',
          o.t(null, void 0, i(79875)),
        ),
        w = new r.TranslatedString(
          'change {title} risk display mode',
          o.t(null, void 0, i(60308)),
        ),
        P = new r.TranslatedString(
          'change {title} entry price',
          o.t(null, void 0, i(91534)),
        ),
        D = new r.TranslatedString(
          'change {title} profit level',
          o.t(null, void 0, i(64330)),
        ),
        m = new r.TranslatedString(
          'change {title} profit price',
          o.t(null, void 0, i(12073)),
        ),
        S = new r.TranslatedString(
          'change {title} stop level',
          o.t(null, void 0, i(45438)),
        ),
        b = new r.TranslatedString(
          'change {title} stop price',
          o.t(null, void 0, i(27503)),
        ),
        C = o.t(null, void 0, i(56982)),
        x = o.t(null, void 0, i(33310)),
        L = o.t(null, void 0, i(3560)),
        A = o.t(null, void 0, i(70320)),
        k = o.t(null, void 0, i(89735)),
        V = o.t(null, void 0, i(24821)),
        M = o.t(null, void 0, i(83840)),
        $ = o.t(null, void 0, i(6002)),
        W = o.t(null, void 0, i(67852)),
        B = o.t(null, void 0, i(23814)),
        R = o.t(null, void 0, i(97668)),
        z = o.t(null, void 0, i(74045)),
        N = o.t(null, void 0, i(63886)),
        I = o.t(null, void 0, i(93857)),
        E = o.t(null, void 0, i(42747)),
        O = o.t(null, void 0, i(75106)),
        U = o.t(null, void 0, i(87145))
      function G(e) {
        return [
          { value: d.RiskDisplayMode.Percentage, title: O },
          { value: d.RiskDisplayMode.Money, title: e || U },
        ]
      }
      class F extends a.LineDataSourceDefinitionsViewModel {
        constructor(e, t) {
          super(e, t)
          const i = this._source.properties().childs(),
            n = i.riskDisplayMode.value()
          ;(this._riskMaxWV = new p.WatchedValue(this._getRiskMax(n))),
            (this._riskStepWV = new p.WatchedValue(this._getRiskStep(n))),
            (this._riskPrecisionWV = new p.WatchedValue(
              this._getRiskPrecision(n),
            )),
            (this._riskUnitWV = new p.WatchedValue(this._getRiskUnit())),
            (this._riskUnitOptionsWV = new p.WatchedValue(
              this._getRiskUnitOptions(),
            )),
            (this._lotSizeStepWV = new p.WatchedValue(this._getLotSizeStep())),
            this._createPropertyRages(),
            i.riskDisplayMode.subscribe(this, (e) =>
              this._onRiskDisplayChanged(e),
            ),
            i.accountSize.subscribe(this, () => this._onAccountSizeChanged()),
            i.lotSize.subscribe(this, () => this._onLotSizeChanged()),
            this._undoModel
              .model()
              .mainSeries()
              .dataEvents()
              .symbolResolved()
              .subscribe(this, this._onSymbolInfoChanged)
        }
        destroy() {
          super.destroy()
          const e = this._source.properties().childs()
          e.riskDisplayMode.unsubscribeAll(this),
            e.accountSize.unsubscribeAll(this),
            e.lotSize.unsubscribeAll(this),
            this._undoModel
              .model()
              .mainSeries()
              .dataEvents()
              .symbolResolved()
              .unsubscribeAll(this)
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, n.removeSpaces)(t),
            o = new r.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, l.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.linecolor, lineWidth: e.linewidth },
                o,
                'Line',
                { line: C },
              ),
              (0, c.createColorPropertyDefinition)(
                {
                  color: (0, c.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.stopBackground,
                    e.stopBackgroundTransparency,
                    u.format({ title: o }),
                  ),
                },
                { id: `${i}StopColor`, title: x },
              ),
              (0, c.createColorPropertyDefinition)(
                {
                  color: (0, c.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.profitBackground,
                    e.profitBackgroundTransparency,
                    h.format({ title: o }),
                  ),
                },
                { id: `${i}ProfitColor`, title: L },
              ),
              (0, s.createTextStyleDefinition)(
                this._propertyApplier,
                { textColor: e.textcolor, fontSize: e.fontsize },
                o,
                { isEditable: !0, isMultiLine: !0, customTitles: { text: A } },
              ),
              (0, c.createCheckablePropertyDefinition)(
                {
                  checked: (0, c.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.showPriceLabels,
                    y.format({ title: o }),
                  ),
                },
                { id: `${i}ShowPriceLabels`, title: E },
              ),
              (0, c.createCheckablePropertyDefinition)(
                {
                  checked: (0, c.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.compact,
                    f.format({ title: o }),
                  ),
                },
                { id: `${i}CompactMode`, title: k },
              ),
              (0, c.createCheckablePropertyDefinition)(
                {
                  checked: (0, c.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.alwaysShowStats,
                    g.format({ title: o }),
                  ),
                },
                { id: `${i}AlwaysShowStats`, title: I },
              ),
            ],
          }
        }
        _inputsPropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, n.removeSpaces)(t),
            o = new r.TranslatedString(t, this._source.translatedType()),
            l = this._getYCoordinateStepWV()
          let s
          s = (0, c.createNumberPropertyDefinition)(
            {
              value: (0, c.convertToDefinitionProperty)(
                this._propertyApplier,
                e.accountSize,
                v.format({ title: o }),
              ),
            },
            {
              id: `${i}AccountSize`,
              title: R,
              type: 1,
              min: new p.WatchedValue(1e-9),
              max: new p.WatchedValue(1e9),
              step: new p.WatchedValue(1),
              unit: this._riskUnitWV,
            },
          )
          const a = (0, c.createNumberPropertyDefinition)(
              {
                value: (0, c.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.lotSize,
                  _.format({ title: o }),
                ),
              },
              {
                id: `${i}LotSize`,
                title: z,
                type: 1,
                min: new p.WatchedValue(1e-9),
                max: new p.WatchedValue(1e8),
                step: this._lotSizeStepWV,
              },
            ),
            d = (0, c.createNumberPropertyDefinition)(
              {
                value: (0, c.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.risk,
                  T.format({ title: o }),
                  [(e) => Number.parseFloat(e)],
                ),
                unitOptionsValue: (0, c.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.riskDisplayMode,
                  w.format({ title: o }),
                ),
              },
              {
                id: `${i}Risk`,
                title: N,
                type: 1,
                min: new p.WatchedValue(1e-9),
                max: this._riskMaxWV,
                precision: this._riskPrecisionWV,
                step: this._riskStepWV,
                unitOptions: this._riskUnitOptionsWV,
              },
            ),
            u = (0, c.createNumberPropertyDefinition)(
              {
                value: (0, c.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.entryPrice,
                  P.format({ title: o }),
                ),
              },
              { id: `${i}EntryPrice`, title: $, type: 1, step: l },
            ),
            h = (0, c.createPropertyDefinitionsGeneralGroup)(
              [s, a, d, u],
              `${i}AccountRisk`,
            ),
            y = (0, c.createNumberPropertyDefinition)(
              {
                value: (0, c.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.profitLevel,
                  D.format({ title: o }),
                ),
              },
              {
                id: `${i}ProfitLevelTicks`,
                title: V,
                type: 0,
                min: new p.WatchedValue(0),
                max: new p.WatchedValue(1e9),
                step: new p.WatchedValue(1),
              },
            ),
            f = (0, c.createNumberPropertyDefinition)(
              {
                value: (0, c.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.targetPrice,
                  m.format({ title: o }),
                  [(e) => e, (e) => this._source.prepareProfitPrice(e)],
                ),
              },
              { id: `${i}ProfitLevelPrice`, title: M, type: 1, step: l },
            ),
            g = (0, c.createPropertyDefinitionsGeneralGroup)(
              [y, f],
              `${i}ProfitLevel`,
              W,
            ),
            C = (0, c.createNumberPropertyDefinition)(
              {
                value: (0, c.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.stopLevel,
                  S.format({ title: o }),
                ),
              },
              {
                id: `${i}StopLevelTicks`,
                title: V,
                type: 0,
                min: new p.WatchedValue(0),
                max: new p.WatchedValue(1e9),
                step: new p.WatchedValue(1),
              },
            ),
            x = (0, c.createNumberPropertyDefinition)(
              {
                value: (0, c.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.stopPrice,
                  b.format({ title: o }),
                  [(e) => e, (e) => this._source.prepareStopPrice(e)],
                ),
              },
              { id: `${i}StopLevelPrice`, title: M, type: 1, step: l },
            )
          return {
            definitions: [
              h,
              g,
              (0, c.createPropertyDefinitionsGeneralGroup)(
                [C, x],
                `${i}StopLevel`,
                B,
              ),
            ],
          }
        }
        _coordinatesPropertyDefinitions() {
          return null
        }
        _onRiskDisplayChanged(e) {
          const t = e.value()
          this._riskMaxWV.setValue(this._getRiskMax(t)),
            this._riskStepWV.setValue(this._getRiskStep(t)),
            this._riskPrecisionWV.setValue(this._getRiskPrecision(t))
        }
        _onAccountSizeChanged() {
          this._riskMaxWV.setValue(
            this._getRiskMax(
              this._source.properties().childs().riskDisplayMode.value(),
            ),
          )
        }
        _onLotSizeChanged() {
          this._lotSizeStepWV.setValue(this._getLotSizeStep())
        }
        _onSymbolInfoChanged() {
          this._riskUnitWV.setValue(this._getRiskUnit()),
            this._riskUnitOptionsWV.setValue(this._getRiskUnitOptions())
        }
        _getRiskMax(e) {
          return e === d.RiskDisplayMode.Percentage
            ? 100
            : this._source.properties().childs().accountSize.value()
        }
        _getRiskStep(e) {
          return e === d.RiskDisplayMode.Percentage ? 0.01 : 1
        }
        _getRiskPrecision(e) {
          if (e === d.RiskDisplayMode.Percentage) return 2
        }
        _getLotSizeStep() {
          const e = this._source.properties().childs().lotSize.value()
          if (e % 1 == 0) return 1
          const t = e.toString(),
            i = t.split('.')
          if (2 === i.length) return Number(`1e-${i[1].length}`)
          {
            const e = /\d+e-(\d+)/.exec(t)
            if (null !== e) return Number(`1e-${e[1]}`)
          }
          return this._lotSizeStepWV.value()
        }
        _getRiskUnit() {
          const e = this._undoModel.model().mainSeries().symbolInfo()
          return (null !== e && e.currency_code) || ''
        }
        _getRiskUnitOptions() {
          const e = this._undoModel.model().mainSeries().symbolInfo()
          return null !== e ? G(e.currency_code) : G()
        }
      }
    },
    91051: (e, t, i) => {
      i.r(t), i.d(t, { SignpostDefinitionsViewModel: () => v })
      var n = i(11542),
        o = i(45126),
        r = i(91682),
        l = i(64147),
        s = i(32097),
        a = i(91335),
        c = i(73174),
        d = i(18009)
      const p = new o.TranslatedString(
          'change vertical position Y coordinate',
          n.t(null, void 0, i(69183)),
        ),
        u = new o.TranslatedString(
          'change {title} emoji visibility',
          n.t(null, void 0, i(53274)),
        ),
        h = new o.TranslatedString(
          'change {title} image background color',
          n.t(null, void 0, i(86993)),
        ),
        y = new o.TranslatedString(
          'change {title} emoji',
          n.t(null, void 0, i(73247)),
        ),
        f = n.t(null, { context: 'linetool point' }, i(87476)),
        g = n.t(null, void 0, i(71310))
      class v extends d.LineDataSourceDefinitionsViewModel {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, a.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  text: e.text,
                  fontSize: e.fontSize,
                  bold: e.bold,
                  italic: e.italic,
                },
                new o.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { isEditable: !0, isMultiLine: !0 },
              ),
            ],
          }
        }
        _coordinatesPropertyDefinitions() {
          const e = this._source.pointsProperty().childs().points[0].childs(),
            t = this._source.name(),
            i = (0, c.getCoordinateXMetaInfo)(this._propertyApplier, e),
            n = {
              property: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                e.price,
                p,
              ),
              info: {
                typeY: 1,
                stepY: new l.WatchedValue(1),
                minY: new l.WatchedValue(-100),
                maxY: new l.WatchedValue(100),
              },
            }
          return {
            definitions: [
              (0, s.createCoordinatesPropertyDefinition)(
                { x: i.property, y: n.property },
                {
                  id: (0, r.removeSpaces)(`${t}Coordinates${f}`),
                  title: f,
                  ...i.info,
                  ...n.info,
                },
              ),
            ],
          }
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new o.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, s.createEmojiPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.showImage,
                    u.format({ title: i }),
                  ),
                  backgroundColor: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.plateColor,
                    null,
                    h.format({ title: i }),
                  ),
                  emoji: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.emoji,
                    y.format({ title: i }),
                  ),
                },
                { id: (0, r.removeSpaces)(`${t}Emoji${g}`), title: g },
              ),
            ],
          }
        }
      }
    },
    27975: (e, t, i) => {
      i.r(t), i.d(t, { TextDefinitionsViewModel: () => l })
      var n = i(91335),
        o = i(18009),
        r = i(45126)
      class l extends o.LineDataSourceDefinitionsViewModel {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, n.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.color,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                  text: e.text,
                  backgroundVisible: e.fillBackground,
                  backgroundColor: e.backgroundColor,
                  backgroundTransparency: e.backgroundTransparency,
                  borderVisible: e.drawBorder,
                  borderColor: e.borderColor,
                  wrap: e.wordWrap,
                },
                new r.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { isEditable: !0, isMultiLine: !0 },
              ),
            ],
          }
        }
      }
    },
    84437: (e, t, i) => {
      i.r(t),
        i.d(t, {
          TimeCyclesPatternDefinitionsViewModel: () => h,
        })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        l = i(18009),
        s = i(32097),
        a = i(91682)
      const c = new o.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(30839)),
        ),
        d = new o.TranslatedString(
          'change {title} background color',
          n.t(null, void 0, i(49765)),
        ),
        p = n.t(null, void 0, i(3554)),
        u = n.t(null, void 0, i(79468))
      class h extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new o.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  lineColor: e.linecolor,
                  lineWidth: e.linewidth,
                  lineStyle: e.linestyle,
                },
                i,
                'Line',
                { line: p },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    c.format({ title: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    d.format({ title: i }),
                  ),
                },
                { id: (0, a.removeSpaces)(`${t}BackgroundColor`), title: u },
              ),
            ],
          }
        }
      }
    },
    30574: (e, t, i) => {
      i.r(t), i.d(t, { TrendAngleDefinitionsViewModel: () => y })
      var n = i(11542),
        o = i(45126),
        r = i(32097),
        l = i(18009),
        s = i(64147),
        a = i(73174),
        c = i(34412)
      const d = new o.TranslatedString(
          'change angle',
          n.t(null, void 0, i(3894)),
        ),
        p = n.t(null, void 0, i(390)),
        u = n.t(null, void 0, i(70320)),
        h = n.t(null, { context: 'linetool point' }, i(6737))
      class y extends l.LineDataSourceDefinitionsViewModel {
        _coordinatesPropertyDefinitions() {
          const e = this._source.points(),
            t = [],
            i = this._source.pointsProperty().childs().points[0].childs(),
            n = this._getYCoordinateStepWV()
          t.push(
            (0, a.getCoordinatesPropertiesDefinitions)(
              this._propertyApplier,
              i,
              e[0],
              n,
              h,
              this._source.name(),
            ),
          )
          const o = (0, r.createNumberPropertyDefinition)(
            {
              value: (0, r.convertToDefinitionProperty)(
                this._propertyApplier,
                this._source.properties().childs().angle,
                d,
              ),
            },
            {
              id: 'TrendLineAngleCoordinate',
              title: p,
              min: new s.WatchedValue(-360),
              max: new s.WatchedValue(360),
              step: new s.WatchedValue(1),
            },
          )
          return t.push(o), { definitions: t }
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return (0, c.getTrendLineToolsStylePropertiesDefinitions)(
            this._propertyApplier,
            e,
            new o.TranslatedString(
              this._source.name(),
              this._source.translatedType(),
            ),
            { text: u },
          )
        }
      }
    },
    46662: (e, t, i) => {
      i.r(t), i.d(t, { TrendBasedFibTimeDefinitionsViewModel: () => x })
      var n = i(50151),
        o = i(11542),
        r = i(45126),
        l = i(53749),
        s = i(32097),
        a = i(18009),
        c = i(23720),
        d = i(64147),
        p = i(91682),
        u = i(95166)
      const h = new r.TranslatedString(
          'change {title} level {index} line visibility',
          o.t(null, void 0, i(51403)),
        ),
        y = new r.TranslatedString(
          'change {title} level {index} line color',
          o.t(null, void 0, i(664)),
        ),
        f = new r.TranslatedString(
          'change {title} level {index} line width',
          o.t(null, void 0, i(97870)),
        ),
        g = new r.TranslatedString(
          'change {title} level {index} line style',
          o.t(null, void 0, i(64707)),
        ),
        v = new r.TranslatedString(
          'change {title} level {index} line coeff',
          o.t(null, void 0, i(27154)),
        ),
        _ = new r.TranslatedString(
          'change {title} all lines color',
          o.t(null, void 0, i(59577)),
        ),
        T = new r.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(30839)),
        ),
        w = new r.TranslatedString(
          'change {title} background transparency',
          o.t(null, void 0, i(13783)),
        ),
        P = new r.TranslatedString(
          'change {title} labels visibility',
          o.t(null, void 0, i(93340)),
        ),
        D = new r.TranslatedString(
          'change {title} labels alignment',
          o.t(null, void 0, i(55612)),
        ),
        m = o.t(null, void 0, i(51574)),
        S = o.t(null, void 0, i(28683)),
        b = o.t(null, void 0, i(79468)),
        C = o.t(null, void 0, i(5119))
      class x extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties(),
            i = t.childs(),
            o = this._source.name(),
            a = (0, p.removeSpaces)(o),
            x = new r.TranslatedString(o, this._source.translatedType()),
            L = i.trendline.childs(),
            A = (0, l.createLineStyleDefinition)(
              this._propertyApplier,
              {
                showLine: L.visible,
                lineColor: L.color,
                lineStyle: L.linestyle,
                lineWidth: L.linewidth,
              },
              x,
              'TrendLine',
              { line: m },
            )
          e.push(A)
          const k = this._source.levelsCount()
          for (let i = 1; i <= k; i++) {
            const o = (0, n.ensureDefined)(t.child(`level${i}`)).childs(),
              r = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.visible,
                    h.format({ title: x, index: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    o.color,
                    null,
                    y.format({ title: x, index: i }),
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.linewidth,
                    f.format({ title: x, index: i }),
                  ),
                  style: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.linestyle,
                    g.format({ title: x, index: i }),
                  ),
                  level: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.coeff,
                    v.format({ title: x, index: i }),
                  ),
                },
                { id: `${a}LineLevel${i}` },
              )
            e.push(r)
          }
          const V = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new u.CollectibleColorPropertyUndoWrapper(
                  (0, n.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                _.format({ title: x }),
                !0,
              ),
            },
            { id: `${a}AllLineColor`, title: S },
          )
          e.push(V)
          const M = (0, s.createTransparencyPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.fillBackground,
                T.format({ title: x }),
              ),
              transparency: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.transparency,
                w.format({ title: x }),
              ),
            },
            { id: `${a}Background`, title: b },
          )
          e.push(M)
          const $ = (0, s.createTwoOptionsPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.showCoeffs,
                P.format({ title: x }),
              ),
              option1: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.horzLabelsAlign,
                D.format({ title: x }),
              ),
              option2: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.vertLabelsAlign,
                D.format({ title: x }),
              ),
            },
            {
              id: `${a}Labels`,
              title: C,
              optionsItems1: new d.WatchedValue(
                c.availableAlignmentHorizontalItems,
              ),
              optionsItems2: new d.WatchedValue(
                c.availableAlignmentVerticalItems,
              ),
            },
          )
          return e.push($), { definitions: e }
        }
      }
    },
    26360: (e, t, i) => {
      i.r(t), i.d(t, { TrendLineDefinitionsViewModel: () => c })
      var n = i(11542),
        o = i(45126),
        r = i(18009),
        l = i(34412),
        s = i(91335)
      const a = n.t(null, void 0, i(70320))
      class c extends r.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return (0, l.getTrendLineToolsStylePropertiesDefinitions)(
            this._propertyApplier,
            e,
            new o.TranslatedString(
              this._source.name(),
              this._source.translatedType(),
            ),
          )
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, s.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  showText: e.showLabel,
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                },
                new o.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: a } },
              ),
            ],
          }
        }
      }
    },
    34353: (e, t, i) => {
      i.r(t), i.d(t, { VerticalLineDefinitionsViewModel: () => h })
      var n = i(11542),
        o = i(45126),
        r = i(32097),
        l = i(73174),
        s = i(88924),
        a = i(91682),
        c = i(18009),
        d = i(91335)
      const p = n.t(null, void 0, i(70320)),
        u = n.t(null, { context: 'linetool point' }, i(26381))
      class h extends c.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return (0, s.getLinesStylesPropertiesDefinitions)(
            this._propertyApplier,
            e,
            new o.TranslatedString(
              this._source.name(),
              this._source.translatedType(),
            ),
          )
        }
        _coordinatesPropertyDefinitions() {
          const e = this._source.pointsProperty().childs().points[0].childs(),
            t = (0, l.getCoordinateXMetaInfo)(this._propertyApplier, e)
          return {
            definitions: [
              (0, r.createCoordinatesPropertyDefinition)(
                { x: t.property },
                {
                  id: (0, a.removeSpaces)(`${this._source.name()}Point1`),
                  title: u,
                  ...t.info,
                },
              ),
            ],
          }
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, d.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  showText: e.showLabel,
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  textOrientation: e.textOrientation,
                },
                new o.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: p } },
              ),
            ],
          }
        }
      }
    },
    27873: (e, t, i) => {
      i.r(t), i.d(t, { AnchoredVWAPDefinitionsViewModel: () => U })
      var n = i(11542),
        o = i(45126),
        r = (i(21251), i(32097)),
        l = i(31507),
        s = i(91682),
        a = i(1183)
      const c = new o.TranslatedString(
          'change {title} VWAP line color',
          n.t(null, void 0, i(83030)),
        ),
        d = new o.TranslatedString(
          'change {title} VWAP line width',
          n.t(null, void 0, i(47479)),
        ),
        p = new o.TranslatedString(
          'change {title} lower band #1 line visibility',
          n.t(null, void 0, i(87716)),
        ),
        u = new o.TranslatedString(
          'change {title} lower band #1 line color',
          n.t(null, void 0, i(67450)),
        ),
        h = new o.TranslatedString(
          'change {title} lower band #1 line width',
          n.t(null, void 0, i(43181)),
        ),
        y = new o.TranslatedString(
          'change {title} upper band #1 line visibility',
          n.t(null, void 0, i(44828)),
        ),
        f = new o.TranslatedString(
          'change {title} upper band #1 line color',
          n.t(null, void 0, i(27326)),
        ),
        g = new o.TranslatedString(
          'change {title} upper band #1 line width',
          n.t(null, void 0, i(1353)),
        ),
        v = new o.TranslatedString(
          'change {title} lower band #2 line visibility',
          n.t(null, void 0, i(94308)),
        ),
        _ = new o.TranslatedString(
          'change {title} lower band #2 line color',
          n.t(null, void 0, i(35092)),
        ),
        T = new o.TranslatedString(
          'change {title} lower band #2 line width',
          n.t(null, void 0, i(8873)),
        ),
        w = new o.TranslatedString(
          'change {title} upper band #2 line visibility',
          n.t(null, void 0, i(93075)),
        ),
        P = new o.TranslatedString(
          'change {title} upper band #2 line color',
          n.t(null, void 0, i(12138)),
        ),
        D = new o.TranslatedString(
          'change {title} upper band #2 line width',
          n.t(null, void 0, i(7943)),
        ),
        m = new o.TranslatedString(
          'change {title} lower band #3 line visibility',
          n.t(null, void 0, i(32442)),
        ),
        S = new o.TranslatedString(
          'change {title} lower band #3 line color',
          n.t(null, void 0, i(68180)),
        ),
        b = new o.TranslatedString(
          'change {title} lower band #3 line width',
          n.t(null, void 0, i(3476)),
        ),
        C = new o.TranslatedString(
          'change {title} upper band #3 line visibility',
          n.t(null, void 0, i(15698)),
        ),
        x = new o.TranslatedString(
          'change {title} upper band #3 line color',
          n.t(null, void 0, i(51780)),
        ),
        L = new o.TranslatedString(
          'change {title} upper band #3 line width',
          n.t(null, void 0, i(27414)),
        ),
        A = new o.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(30839)),
        ),
        k = new o.TranslatedString(
          'change {title} background color',
          n.t(null, void 0, i(49765)),
        ),
        V = new o.TranslatedString(
          'change {title} price visibility',
          n.t(null, void 0, i(727)),
        ),
        M = n.t(null, void 0, i(5682)),
        $ = n.t(null, void 0, i(71571)),
        W = n.t(null, void 0, i(21315)),
        B = n.t(null, void 0, i(91889)),
        R = n.t(null, void 0, i(65448)),
        z = n.t(null, void 0, i(83301)),
        N = n.t(null, void 0, i(64848)),
        I = n.t(null, void 0, i(58375)),
        E = n.t(null, void 0, i(97273))
      function O(e, t, i, n, o, l, s, c, d) {
        return (0, r.createLinePropertyDefinition)(
          {
            checked: (0, r.convertToDefinitionProperty)(
              e,
              new a.StudyPlotVisibleProperty(t.display),
              i.format({ title: d }),
            ),
            color: (0, r.getColorDefinitionProperty)(
              e,
              t.color,
              t.transparency ?? null,
              n.format({ title: d }),
            ),
            width: (0, r.convertToDefinitionProperty)(
              e,
              t.linewidth,
              o.format({ title: d }),
            ),
          },
          { id: `${c}${s}`, title: l },
        )
      }
      class U extends l.StudyLineDataSourceDefinitionsViewModel {
        constructor(e, t) {
          super(e, t)
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, s.removeSpaces)(t),
            n = new o.TranslatedString(t, this._source.translatedType()),
            l = e.styles.childs().VWAP.childs(),
            a = [
              (0, r.createLinePropertyDefinition)(
                {
                  color: (0, r.getColorDefinitionProperty)(
                    this._propertyApplier,
                    l.color,
                    l.transparency ?? null,
                    c.format({ title: n }),
                  ),
                  width: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    l.linewidth,
                    d.format({ title: n }),
                  ),
                },
                { id: `${i}VWAPLine`, title: M },
              ),
            ],
            U = this._source.metaInfo()
          if (U.styles?.UpperBand && U.styles?.LowerBand) {
            const t = e.styles.childs().LowerBand.childs(),
              o = O(
                this._propertyApplier,
                t,
                p,
                u,
                h,
                $,
                'LowerBandLine',
                i,
                n,
              ),
              r = e.styles.childs().UpperBand.childs(),
              l = O(this._propertyApplier, r, y, f, g, W, 'UpperBandLine', i, n)
            a.push(o, l)
          }
          if (U?.area) {
            const t = e.areaBackground.childs(),
              o = (0, r.createLinePropertyDefinition)(
                {
                  checked: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    t.fillBackground,
                    A.format({ title: n }),
                  ),
                  color: (0, r.getColorDefinitionProperty)(
                    this._propertyApplier,
                    t.backgroundColor,
                    t.transparency,
                    k.format({ title: n }),
                  ),
                },
                { id: `${i}Background`, title: I },
              )
            a.push(o)
          }
          if (
            U.styles?.UpperBand_2 &&
            U.styles?.LowerBand_2 &&
            U.styles?.UpperBand_3 &&
            U.styles?.LowerBand_3
          ) {
            const t = e.styles.childs().LowerBand_2.childs(),
              o = O(
                this._propertyApplier,
                t,
                v,
                _,
                T,
                B,
                'LowerBand2Line',
                i,
                n,
              ),
              r = e.styles.childs().UpperBand_2.childs(),
              l = O(
                this._propertyApplier,
                r,
                w,
                P,
                D,
                R,
                'UpperBand2Line',
                i,
                n,
              ),
              s = e.styles.childs().LowerBand_3.childs(),
              c = O(
                this._propertyApplier,
                s,
                m,
                S,
                b,
                z,
                'LowerBand3Line',
                i,
                n,
              ),
              d = e.styles.childs().UpperBand_3.childs(),
              p = O(
                this._propertyApplier,
                d,
                C,
                x,
                L,
                N,
                'UpperBand3Line',
                i,
                n,
              )
            a.push(o, l, c, p)
          }
          const G = (0, r.createCheckablePropertyDefinition)(
            {
              checked: (0, r.convertToDefinitionProperty)(
                this._propertyApplier,
                e.axisLabelVisible,
                V.format({ title: n }),
              ),
            },
            { id: `${i}ShowPrice`, title: E },
          )
          return a.push(G), { definitions: a }
        }
        _coordinatesPropertyDefinitions() {
          return null
        }
      }
    },
    31507: (e, t, i) => {
      i.r(t), i.d(t, { StudyLineDataSourceDefinitionsViewModel: () => d })
      var n = i(11542),
        o = (i(21251), i(52033)),
        r = i(32097),
        l = i(18009),
        s = i(28388),
        a = i(73174),
        c = i(91682)
      class d extends l.LineDataSourceDefinitionsViewModel {
        constructor(e, t) {
          super(e, t)
        }
        _inputsPropertyDefinitions() {
          return {
            definitions: [
              (0, r.createStudyInputsPropertyDefinition)(
                {},
                {
                  id: 'StudyInputs',
                  inputs: new s.MetaInfoHelper(
                    this._source.metaInfo(),
                  ).getUserEditableInputs(),
                  inputsTabProperty: this._source.properties(),
                  model: this._undoModel,
                  studyMetaInfo: this._source.metaInfo(),
                  source: {
                    isInputsStudy: !0,
                    symbolsResolved: () => new o.Delegate(),
                    resolvedSymbolInfoBySymbol: (e) => null,
                  },
                },
              ),
            ],
          }
        }
        _coordinatesPropertyDefinitions() {
          const e = this._source.points(),
            t = this._source.pointsProperty().childs().points,
            o = []
          return (
            e.forEach((e, l) => {
              const s = t[l].childs()
              if (!s) return
              const d = (0, a.getCoordinateXMetaInfo)(this._propertyApplier, s)
              o.push(
                (0, r.createCoordinatesPropertyDefinition)(
                  { x: d.property },
                  {
                    id: (0, c.removeSpaces)(`${this._source.name()}Point${l}`),
                    title: n
                      .t(null, { context: 'linetool point' }, i(13616))
                      .format({ count: (l + 1).toString() }),
                    ...d.info,
                  },
                ),
              )
            }),
            { definitions: o }
          )
        }
      }
    },
    12121: (e, t, i) => {
      i.d(t, { createPropertiesObject: () => s })
      var n = i(37265),
        o = i(15399)
      function r(e, t, i) {
        for (const o of Object.keys(e.levels ?? {}))
          if (e.levels[o] && (0, n.isSameType)(e.levels[o], t.typecheck())) {
            let n = t.tpl()
            i.names.forEach((i, r) => {
              n = t.fill('' + r, i, e.levels[o], n)
            }),
              (e.levels[o] = n)
          }
        return e
      }
      class l extends o.LevelsProperty {
        constructor(e, t, i) {
          super({
            defaultName: e,
            state: i,
            map: { names: ['width', 'color', 'visible'] },
            levelsIterator: r,
            theme: t,
          })
        }
      }
      function s(e, t, i) {
        return new l(e, t, i)
      }
    },
    99083: (e, t, i) => {
      i.r(t), i.d(t, { LineToolGannComplex: () => u })
      var n,
        o = i(86441),
        r = i(50151),
        l = i(73866),
        s = i(29875),
        a = i(59769),
        c = i(12121),
        d = i(73305),
        p = i(15938)
      !((e) => {
        ;(e[(e.ScaleRatioStep = 1e-7)] = 'ScaleRatioStep'),
          (e[(e.ScaleRatioPrecision = 7)] = 'ScaleRatioPrecision'),
          (e.ScaleRatioInitialValue = '')
      })(n || (n = {}))
      class u extends s.LineDataSource {
        constructor(e, t, n, o) {
          super(
            e,
            t ?? u.createProperties(e.backgroundTheme().spawnOwnership()),
            n,
            o,
          ),
            (this.version = 2),
            (this._scaleRatioFormatter = new l.LimitedPrecisionNumericFormatter(
              7,
            )),
            (this.version = 2),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 73017))
              .then(({ GannComplexPaneView: e }) => {
                this._setPaneViews([new e(this, this.model())])
              })
          const r = this.properties()
          this._adjustScaleRatio(r),
            r.subscribe(this, this._adjustScaleRatio),
            r.childs().scaleRatio.subscribe(this, this._correctFirstPoint),
            this._syncStateExclusions.push('scaleRatio'),
            r
              .onRestoreFactoryDefaults()
              .subscribe(this, this._handleRestoringFactoryDefaults),
            this._onTemplateApplying.subscribe(
              this,
              this._handleTemplateApplying,
            ),
            this._onTemplateApplied.subscribe(this, this._correctFirstPoint)
        }
        migrateVersion(e, t, i) {
          1 === e &&
            (this._points.length >= this.pointsCount()
              ? setTimeout(() => this._migratePoint())
              : this._timePoint.length >= this.pointsCount() &&
                this._pointAdded.subscribe(this, this._migratePoint))
        }
        destroy() {
          const e = this.properties()
          e.unsubscribe(this, this._adjustScaleRatio),
            e.childs().scaleRatio.unsubscribe(this, this._correctFirstPoint),
            e
              .onRestoreFactoryDefaults()
              .unsubscribe(this, this._handleRestoringFactoryDefaults),
            this._onTemplateApplying.unsubscribe(
              this,
              this._handleTemplateApplying,
            ),
            this._onTemplateApplied.unsubscribe(this, this._correctFirstPoint),
            super.destroy()
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Gann Square'
        }
        addPoint(e, t, i) {
          this._points.length > 1 && this._points.pop()
          const n = super.addPoint(e, t, i),
            o = this.priceScale()
          return (
            !(0, r.ensureNotNull)(o).isLog() && n && this._correctFirstPoint(),
            n
          )
        }
        setPoint(e, t, i) {
          super.setPoint(e, t, i),
            void 0 !== i && i.shift()
              ? this._correctPoint(e)
              : this._correctScaleRatio()
        }
        setLastPoint(e, t) {
          const i = this.priceScale()
          return (
            (0, r.ensureNotNull)(i).isLog() ||
              ((this._points[1] = {
                ...e,
                interval: this._model.mainSeries().interval(),
              }),
              this._correctPoint(1)),
            super.setLastPoint(e, t)
          )
        }
        isReversed() {
          return this.properties().childs().reverse.value()
        }
        levelsCount() {
          return this.properties().childs().levels.childCount()
        }
        levels() {
          const e = [],
            t = this.properties().childs(),
            i = t.levels.childCount()
          for (let n = 0; n < i; n++) {
            const i = t.levels.childs()[n].childs()
            e.push({
              index: n,
              visible: i.visible.value(),
              color: i.color.value(),
              width: i.width.value(),
            })
          }
          return e
        }
        fanLinesCount() {
          return this.properties().childs().fanlines.childCount()
        }
        fanLines() {
          const e = [],
            t = this.properties().childs(),
            i = t.fanlines.childCount()
          for (let n = 0; n < i; n++) {
            const i = t.fanlines.childs()[n].childs()
            e.push({
              index: n,
              visible: i.visible.value(),
              x: i.x.value(),
              y: i.y.value(),
              color: i.color.value(),
              width: i.width.value(),
            })
          }
          return e
        }
        arcsCount() {
          return this.properties().childs().arcs.childCount()
        }
        arcs() {
          const e = [],
            t = this.properties().childs(),
            i = t.arcs.childCount()
          for (let n = 0; n < i; n++) {
            const i = t.arcs.childs()[n].childs()
            e.push({
              index: n,
              visible: i.visible.value(),
              x: i.x.value(),
              y: i.y.value(),
              color: i.color.value(),
              width: i.width.value(),
            })
          }
          return e
        }
        arcsBackgroundTransparency() {
          return this.properties()
            .childs()
            .arcsBackground.childs()
            .transparency.value()
        }
        isArcsBackgroundFilled() {
          return this.properties()
            .childs()
            .arcsBackground.childs()
            .fillBackground.value()
        }
        isLabelsVisible() {
          return this.properties().childs().showLabels.value()
        }
        getLabelsStyle() {
          const e = this.properties().childs(),
            { fontSize: t, bold: i, italic: n } = e.labelsStyle.childs(),
            o = e.levels.childCount()
          return {
            textColor: e.levels.childs()[o - 1].childs().color.value(),
            font: p.CHART_FONT_FAMILY,
            fontSize: t.value(),
            bold: i.value(),
            italic: n.value(),
          }
        }
        getScaleRatioStep() {
          return 1e-7
        }
        getScaleRatioFormatter() {
          return this._scaleRatioFormatter
        }
        getPriceDiff() {
          const e = this.points()
          if (e.length < 2) return null
          const [t, i] = e
          return i.price - t.price
        }
        getIndexDiff() {
          const e = this.points()
          if (e.length < 2) return null
          const [t, i] = e
          return i.index - t.index
        }
        getScaleRatio() {
          const e = this.getPriceDiff(),
            t = this.getIndexDiff()
          return null !== e && null !== t && 0 !== t ? Math.abs(e / t) : null
        }
        static createProperties(e, t) {
          const i = (0, c.createPropertiesObject)('linetoolganncomplex', e, t)
          return this._configureProperties(i), i
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            i.e(6406),
            i.e(3889),
            i.e(8009),
            i.e(8056),
            i.e(8537),
          ])
            .then(i.bind(i, 53894))
            .then((e) => e.GannComplexAndFixedDefinitionsViewModel)
        }
        static _configureProperties(e) {
          super._configureProperties(e), e.addExcludedKey('scaleRatio', 1)
          const t = [],
            i = [],
            n = e.childs()
          {
            const e = n.levels.childCount()
            for (let o = 0; o < e; o++) {
              const e = n.levels.childs()[o].childs()
              t.push(e.width), i.push(e.color)
            }
          }
          {
            const e = n.fanlines.childCount()
            for (let o = 0; o < e; o++) {
              const e = n.fanlines.childs()[o].childs()
              t.push(e.width), i.push(e.color)
            }
          }
          {
            const e = n.arcs.childCount()
            for (let o = 0; o < e; o++) {
              const e = n.arcs.childs()[o].childs()
              t.push(e.width), i.push(e.color)
            }
          }
          e.addChild('linesColors', new d.LineToolColorsProperty(i)),
            e.addChild('linesWidths', new d.LineToolWidthsProperty(t))
        }
        _correctScaleRatio() {
          const e = this.properties().childs(),
            t = this.getScaleRatio()
          e.scaleRatio.setValue(t)
        }
        _getAdjustedScaleRatio() {
          const e = this.model().mainSeries().priceScale(),
            t = this.model().timeScale()
          return (0, a.scaleRatio)(t, e)
        }
        _adjustScaleRatio(e) {
          const t = e.scaleRatio.value()
          ;('' !== t && null !== t) ||
            e.scaleRatio.setValue(this._getAdjustedScaleRatio())
        }
        _correctPoint(e) {
          if (this._points.length < 2) return
          const t = this.getIndexDiff()
          if (null === t) return
          const i = this.properties().childs().scaleRatio.value()
          if (null !== i) {
            const n = this._points[e],
              o = 0 === e ? this._points[1] : this._points[0],
              r = n.price - o.price > 0,
              l = n.index - o.index > 0
            let s = (r && !l) || (!r && l) ? -1 : 1
            0 === e && (s = -s),
              (n.price = o.price + s * t * i),
              this._pointChanged.fire(e)
          }
          this._normalizePoints()
        }
        _correctFirstPoint() {
          this._correctPoint(this.isReversed() ? 0 : 1)
        }
        _handleRestoringFactoryDefaults() {
          this.properties()
            .childs()
            .scaleRatio.setValue(this._getAdjustedScaleRatio())
        }
        _handleTemplateApplying(e) {
          '' === e.scaleRatio && (e.scaleRatio = this._getAdjustedScaleRatio())
        }
        _migratePoint() {
          if (this.points().length < this.pointsCount()) return
          const e = this._getScreenPoints()
          if (null === e) return
          const t = (0, r.ensureNotNull)(this.screenPointToPoint(e[1]))
          this.setPoint(1, t),
            this._pointAdded.unsubscribe(this, this._migratePoint)
        }
        _getScreenPoints() {
          const e = this._calcAngle()
          if (null === e) return null
          let [t, i] = this.points()
          this.isReversed() && ([t, i] = [i, t])
          const n = (0, r.ensureNotNull)(this.pointToScreenPoint(t)),
            l = (0, r.ensureNotNull)(this.pointToScreenPoint(i)),
            s = Math.sqrt(Math.pow(n.x - l.x, 2) + Math.pow(n.y - l.y, 2)),
            a = new o.Point(Math.cos(e), -Math.sin(e)),
            c = a.normalized(),
            d = c.x < 0 ? -1 : 1,
            p = c.y < 0 ? -1 : 1
          return [n.addScaled(a, s), n.add(new o.Point(5 * s * d, 5 * s * p))]
        }
        _calcAngle() {
          const [e, t] = this.points(),
            i = (0, r.ensureNotNull)(this.pointToScreenPoint(e))
          let n = (0, r.ensureNotNull)(this.pointToScreenPoint(t)).subtract(i)
          if (n.length() > 0) {
            n = n.normalized()
            let e = Math.acos(n.x)
            return n.y > 0 && (e = -e), e
          }
          return null
        }
      }
    },
    18181: (e, t, i) => {
      i.r(t),
        i.d(t, {
          LineToolImage: () => V,
          OriginPoints: () => C,
          buildAbsoluteUserImageUrl: () => A,
        })
      var n = i(50151),
        o = i(86441),
        r = i(9343),
        l = i(32679),
        s = i(12988),
        a = i(29875),
        c = i(44672),
        d = i(56840),
        p = i(51768),
        u = i(22980),
        h = i(11542),
        y = i(49483),
        f = i(68335),
        g = i(56570)
      const v = h.t(null, void 0, i(15402))
      var _ = i(77788),
        T = i(928)
      async function w(e, t) {
        return (async (e) => {
          const [t] = await Promise.all([
            Promise.all([
              i.e(5862),
              i.e(3703),
              i.e(4524),
              i.e(7939),
              i.e(9258),
              i.e(5387),
              i.e(6445),
              i.e(9325),
              i.e(8222),
              i.e(2440),
              i.e(8544),
              i.e(5058),
              i.e(2227),
              i.e(3746),
              i.e(9418),
              i.e(7038),
            ]).then(i.bind(i, 14653)),
          ])
          return t.renderImageDialog(e)
        })({ onConfirm: e, onClose: t })
      }
      let P = null
      function D(e) {
        if ('LineToolImage' !== e) return P?.then((e) => e()), void (P = null)
        ;(0, u.runOrSigninWithFeature)(
          () => {
            T.tool.setValue('LineToolImage'),
              (P = w(m, () => {
                P?.then((e) => e()),
                  (P = null),
                  'LineToolImage' === T.tool.value() && (0, T.resetToCursor)(!0)
              })),
              (0, p.trackEvent)('Image', 'Open image dialog')
          },
          { feature: 'drawings', source: 'Change drawing tool state' },
        )
      }
      function m(e) {
        const t = (0, _.chartWidgetCollectionService)()
        if (null === t) return
        const o = !Boolean(d.getBool('hint.pasteImage')),
          r = t.activeChartWidget.value()
        var l, s
        r
          .model()
          .pasteImageAsLineTool(
            e.url,
            e.blobUrl,
            (0, n.ensureNotNull)(
              r.model().model().paneForSource(r.model().mainSeries()),
            ),
            e.transparency,
          ),
          o &&
            ((l = t.getContainer()),
            (s = 'hint.pasteImage'),
            g.enabled('popup_hints') &&
              !y.CheckMobile.any() &&
              Promise.all([i.e(1737), i.e(2227), i.e(6166)])
                .then(i.bind(i, 5015))
                .then((e) => {
                  const t = new e.ChartEventHintRenderer(l),
                    i = v.format({
                      shortcut: (0, f.humanReadableHash)(f.Modifiers.Mod + 86),
                    })
                  let n = null
                  t.show(i, () => {
                    null !== n &&
                      (clearTimeout(n),
                      (n = null),
                      d.setValue(s, !0, { forceFlush: !0 }))
                  }),
                    (n = setTimeout(() => {
                      ;(n = null), t.hide()
                    }, 5e3))
                }))
      }
      var S = i(64147)
      const b = (0, r.getLogger)('Chart.LineToolImage')
      var C
      function x(e) {
        return e.toLowerCase().startsWith('blob:')
      }
      function L(e) {
        return e.toLowerCase().startsWith('data:')
      }
      !((e) => {
        ;(e[(e.LeftTopAnchor = 0)] = 'LeftTopAnchor'),
          (e[(e.RightTopAnchor = 1)] = 'RightTopAnchor'),
          (e[(e.LeftBottomAnchor = 2)] = 'LeftBottomAnchor'),
          (e[(e.RightBottomAnchor = 3)] = 'RightBottomAnchor'),
          (e[(e.Center = 4)] = 'Center')
      })(C || (C = {}))
      window.AWS_BBS3_DOMAIN
      function A(e) {
        return x(e) || L(e) ? e : null
      }
      function k(e) {
        return L(e) ? e : new URL(e).pathname
      }
      class V extends a.LineDataSource {
        constructor(e, t, n, o) {
          super(
            e,
            t || V.createProperties(e.backgroundTheme().spawnOwnership()),
            n,
            o,
          ),
            (this._hasEditableCoordinates = new S.WatchedValue(!1)),
            (this._image = null),
            (this._originPoint = 4)
          const r = this.properties().childs().url
          ;(this._absoluteUserImageUrl = new s.Property(
            A(this.properties().childs().url.value()) ?? '',
          )),
            this._absoluteUserImageUrl.subscribe(this, (e) => {
              const t = e.value()
              if (x(t)) return
              const i = A(t)
              null !== i && r.setValue(k(i))
            }),
            r.subscribe(this, () => {
              const e = A(r.value())
              null !== e && this._absoluteUserImageUrl.setValue(e)
            }),
            this._loadImage(),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 26087))
              .then(({ ImagePaneView: t }) => {
                this._setPaneViews([new t(this, e)])
              }),
            this.properties()
              .childs()
              .url.subscribe(this, () => {
                this._loadImage()
              })
        }
        absoluteUserImageUrl() {
          return this._absoluteUserImageUrl
        }
        cssWidth() {
          return this.properties().childs().cssWidth.value()
        }
        cssHeight() {
          return this.properties().childs().cssHeight.value()
        }
        angle() {
          return this.properties().childs().angle.value()
        }
        originPoint() {
          return this._originPoint
        }
        dOffsetX() {
          return this._dOffsetX || 0
        }
        pointsCount() {
          return 1
        }
        name() {
          return 'Image'
        }
        image() {
          return this._image
        }
        setBlobImageUrl(e) {
          this._image
        }
        getChangePointForSync(e) {
          return null
        }
        pointToScreenPoint({ index: e, price: t }, i = 0) {
          const r = this._model.timeScale(),
            l = (0, n.ensureNotNull)(this.priceScale()),
            s = (0, n.ensureNotNull)(
              (0, n.ensureNotNull)(this.ownerSource()).firstValue(),
            ),
            a = r.indexToCoordinate(e) + i,
            c = l.priceToCoordinate(t, s)
          return new o.Point(a, c)
        }
        setPoint(e, t, i) {
          if (null === this._image) return
          const { width: o, height: r } = this._image,
            l = (0, n.ensureNotNull)(this.pointToScreenPoint(t)),
            s = (0, n.ensureNotNull)(
              this.pointToScreenPoint(this._points[0], this.dOffsetX()),
            ),
            a = Math.max(Math.abs(s.x - l.x) / o, Math.abs(s.y - l.y) / r),
            c = Math.round(o * a),
            d = Math.round(r * a),
            p = this.properties().childs()
          p.cssWidth.setValue(c),
            p.cssHeight.setValue(d),
            this.propertiesChanged()
        }
        startChanging(e, t) {
          super.startChanging(e, t),
            this._changeOriginPoint(V._oppositePoints[e])
        }
        endChanging(e, t) {
          return this._changeOriginPoint(4), super.endChanging(e, t)
        }
        getPoint() {
          return null
        }
        syncLineStyleState() {
          const e = super.syncLineStyleState()
          return !e.url && this._blobUrl && (e.blobUrl = this._blobUrl), e
        }
        restoreExternalState(e) {
          const { blobUrl: t, ...i } = e
          t && this.setBlobImageUrl(t), super.restoreExternalState(i)
        }
        isSavedInChart() {
          return (
            super.isSavedInChart() && '' !== this.absoluteUserImageUrl().value()
          )
        }
        static createProperties(e, t) {
          const i = new l.DefaultProperty({
            defaultName: 'linetoolimage',
            state: t,
            theme: e,
          })
          return this._configureProperties(i), i
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              i.e(6406),
              i.e(3889),
              i.e(8009),
              i.e(8056),
              i.e(8537),
            ]).then(i.bind(i, 65504))
          ).ImageDefinitionsViewModel
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.hasChild('url') || e.addChild('url', new s.Property('')),
            e.addExcludedKey('url', 1),
            e.addExcludedKey('cssWidth', 1),
            e.addExcludedKey('cssHeight', 1),
            e.addExcludedKey('angle', 1)
        }
        _loadImage() {
          const e = this.properties(),
            t = (0, n.ensureDefined)(e.child('url')).value()
          t && this._createImage(t)
        }
        _changeOriginPoint(e) {
          const t = this.originPoint(),
            i =
              4 === t
                ? V._correctOriginDirections[e]
                : V._correctOriginDirections[V._oppositePoints[t]],
            r = this.properties().childs().cssWidth.value() / 2,
            l = this.properties().childs().cssHeight.value() / 2,
            [s] = this._points,
            a = (0, n.ensureNotNull)(this.pointToScreenPoint(s)),
            c = new o.Point(a.x + r * i[0], a.y + l * i[1]),
            d = (0, n.ensureNotNull)(this.screenPointToPoint(c))
          ;(this._dOffsetX =
            4 === t
              ? c.x - (0, n.ensureNotNull)(this.pointToScreenPoint(d)).x
              : void 0),
            (s.index = d.index),
            (s.price = d.price),
            (this._originPoint = e)
        }
        _createImage(e) {
          const t = x(e),
            i = A(e)
          if (null === i) return void b.logWarn(`Invalid image URL: ${e}`)
          if (i === this._image?.src) return
          const o = document.createElement('img')
          ;(o.crossOrigin = 'anonymous'),
            (o.src = i),
            o.addEventListener('load', () => {
              this._image = o
              const e = this._model,
                r = this.properties().childs()
              if (!t) {
                const e = k(i)
                r.url.setValue(e), (this._blobUrl = void 0)
              }
              if (r.cssWidth.value() && r.cssHeight.value())
                return void this._model.updateSource(this)
              const l = e.timeScale().width() / 4,
                s = (0, n.ensureNotNull)(this.priceScale()).height() / 4,
                a = o.naturalWidth,
                d = o.naturalHeight,
                p = Math.min(1, l / a),
                u = Math.min(1, s / d),
                h = Math.min(p, u),
                y = Math.round(h * a),
                f = Math.round(h * d)
              r.cssWidth.setValue(y),
                r.cssHeight.setValue(f),
                this.updateAllViews((0, c.sourceChangeEvent)(this.id())),
                this._model.updateSource(this)
            }),
            o.addEventListener('error', () => {
              this.model().removeSource(this)
            })
        }
      }
      ;(V._correctOriginDirections = [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
        [0, 0],
      ]),
        (V._oppositePoints = [3, 2, 1, 0, 4]),
        (0, T.runOnDrawingStateReady)(() => {
          T.tool.subscribe(D)
        })
    },
    76386: (e, t, i) => {
      var n
      i.d(t, { RiskDisplayMode: () => n }),
        ((e) => {
          ;(e.Percentage = 'percents'), (e.Money = 'money')
        })(n || (n = {}))
    },
    1183: (e, t, i) => {
      i.d(t, { StudyPlotVisibleProperty: () => r })
      var n = i(34776),
        o = i(23073)
      class r extends o.PropertyBase {
        constructor(e) {
          super(),
            (this._displayProperty = e),
            this._displayProperty.subscribe(
              this,
              this._displayPropertyValueChanged,
            )
        }
        destroy() {
          this._displayProperty.unsubscribe(
            this,
            this._displayPropertyValueChanged,
          ),
            this._listeners.destroy()
        }
        value() {
          return 0 !== this._displayProperty.value()
        }
        setValue(e, t) {
          this._displayProperty.setValue(e ? 15 : 0)
        }
        setValueSilently(e) {
          this._displayProperty.setValueSilently(e ? 15 : 0)
        }
        storeStateIfUndefined() {
          return !1
        }
        weakReference() {
          return (0, n.weakReference)(this)
        }
        ownership() {
          return (0, n.ownership)(this)
        }
        _displayPropertyValueChanged() {
          this.fireChanged()
        }
      }
    },
  },
])
