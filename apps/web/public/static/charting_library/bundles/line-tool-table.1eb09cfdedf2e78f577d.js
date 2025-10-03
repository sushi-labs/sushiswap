;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [319],
  {
    73174: (e, t, i) => {
      i.r(t),
        i.d(t, {
          getCoordinateXMetaInfo: () => T,
          getCoordinateYMetaInfo: () => _,
          getCoordinatesPropertiesDefinitions: () => b,
          getSelectionCoordinatesPropertyDefinition: () => y,
        })
      var o = i(50151),
        n = i(11542),
        r = i(45126),
        l = i(44672),
        s = i(60265)
      class a extends s.UndoCommand {
        constructor({ lineToolId: e, chartModel: t, newPositionPoints: i }) {
          super(null),
            (this._pointState = null),
            (this._lineToolId = e),
            (this._model = t),
            (this._newPositionPoints = i)
        }
        redo() {
          const e = (0, o.ensureNotNull)(
            this._model.dataSourceForId(this._lineToolId),
          )
          ;(this._pointState = [e.normalizedPoints(), e.points()]),
            e.startChanging(),
            e.moveLineTool(this._newPositionPoints),
            this._model.updateSource(e),
            e.updateAllViews((0, l.sourceChangeEvent)(e.id())),
            e.syncMultichartState(e.endChanging(!0, !1))
        }
        undo() {
          if (this._pointState) {
            const e = (0, o.ensureNotNull)(
              this._model.dataSourceForId(this._lineToolId),
            )
            e.startChanging(),
              e.restorePoints(...this._pointState),
              this._model.updateSource(e),
              e.updateAllViews((0, l.sourceChangeEvent)(e.id())),
              e.syncMultichartState(e.endChanging(!0, !1))
          }
        }
      }
      var c = i(32097),
        h = i(64147),
        d = i(12988),
        u = i(91682)
      const p = -5e4,
        m = 15e3,
        g = new r.TranslatedString(
          'change price Y coordinate',
          n.t(null, void 0, i(11737)),
        ),
        x = new r.TranslatedString(
          'change bar X coordinate',
          n.t(null, void 0, i(2066)),
        ),
        f = new r.TranslatedString('move drawings', n.t(null, void 0, i(76261)))
      function _(e, t, i) {
        return {
          property: (0, c.convertToDefinitionProperty)(e, t.price, g),
          info: { typeY: 1, stepY: i },
        }
      }
      function T(e, t) {
        return {
          property: (0, c.convertToDefinitionProperty)(e, t.bar, x),
          info: {
            typeX: 0,
            minX: new h.WatchedValue(p),
            maxX: new h.WatchedValue(m),
            stepX: new h.WatchedValue(1),
          },
        }
      }
      function b(e, t, i, o, n, r) {
        const l = T(e, t),
          s = _(e, t, o)
        return (0, c.createCoordinatesPropertyDefinition)(
          { x: l.property, y: s.property },
          {
            id: (0, u.removeSpaces)(`${r}Coordinates${n}`),
            title: n,
            ...l.info,
            ...s.info,
          },
        )
      }
      const C = /^([+*\-\/]?)((?:\d*)|(?:\d+\.\d*))$/
      function v(e, t, i) {
        const n = new d.Property(''),
          r = (0, c.makeProxyDefinitionProperty)(n.weakReference())
        return (
          (r.setValue = (r) => {
            try {
              const n = r.match(C)
              if (!n) return
              const [, l, s] = n
              if (!s.length) return
              const c = i(Number.parseFloat(s))
              if ('/' === l && (0 === c.price || 0 === c.index)) return
              t.withMacro(f, () => {
                e.filter((e) => !e.isSourceHidden()).forEach((e) => {
                  const i = e.points()
                  let n
                  switch (l) {
                    case '': {
                      const e = (0, o.ensureDefined)(i[0])
                      let { index: t = e.index, price: r = e.price } = c
                      ;(r -= e.price),
                        (t -= e.index),
                        (n = i.map((e) => ({
                          ...e,
                          index: e.index + t,
                          price: e.price + r,
                        })))
                      break
                    }
                    case '-':
                    case '+': {
                      let { index: e = 0, price: t = 0 } = c
                      '-' === l && ((e *= -1), (t *= -1)),
                        (n = i.map((i) => ({
                          ...i,
                          index: i.index + e,
                          price: i.price + t,
                        })))
                      break
                    }
                    case '*': {
                      const { index: e = 1, price: t = 1 } = c
                      n = i.map((i) => ({
                        ...i,
                        index: i.index * e,
                        price: i.price * t,
                      }))
                      break
                    }
                    case '/': {
                      const { index: e = 1, price: t = 1 } = c
                      n = i.map((i) => ({
                        ...i,
                        index: i.index / e,
                        price: i.price / t,
                      }))
                      break
                    }
                  }
                  t.undoHistory().pushUndoCommand(
                    new a({
                      lineToolId: e.id(),
                      chartModel: t.model(),
                      newPositionPoints: n,
                    }),
                  )
                })
              })
            } finally {
              n.setValue('', !0)
            }
          }),
          r
        )
      }
      function y(e, t) {
        const o = v(e, t, (e) => ({ index: e })),
          r = v(e, t, (e) => ({ price: e }))
        return (0, c.createSelectionCoordinatesPropertyDefinition)(
          { x: o, y: r },
          {
            id: 'SourcesCoordinates',
            title: n.t(null, void 0, i(44272)),
            mathOperationsX: '+',
            mathOperationsY: '+/*',
            modeX: 'integer',
            modeY: 'float',
          },
        )
      }
    },
    91335: (e, t, i) => {
      i.d(t, { createTextStyleDefinition: () => P })
      var o = i(11542),
        n = i(45126),
        r = i(32097),
        l = i(91682)
      const s = new n.TranslatedString(
          'change {toolName} text visibility',
          o.t(null, void 0, i(56634)),
        ),
        a = new n.TranslatedString(
          'change {toolName} text color',
          o.t(null, void 0, i(64500)),
        ),
        c = new n.TranslatedString(
          'change {toolName} text font size',
          o.t(null, void 0, i(21781)),
        ),
        h = new n.TranslatedString(
          'change {toolName} text font bold',
          o.t(null, void 0, i(24701)),
        ),
        d = new n.TranslatedString(
          'change {toolName} text font italic',
          o.t(null, void 0, i(42694)),
        ),
        u = new n.TranslatedString(
          'change {toolName} text',
          o.t(null, void 0, i(66668)),
        ),
        p = new n.TranslatedString(
          'change {toolName} labels alignment vertical',
          o.t(null, void 0, i(31689)),
        ),
        m = new n.TranslatedString(
          'change {toolName} labels alignment horizontal',
          o.t(null, void 0, i(88277)),
        ),
        g = new n.TranslatedString(
          'change {toolName} labels direction',
          o.t(null, void 0, i(61160)),
        ),
        x = new n.TranslatedString(
          'change {toolName} text background visibility',
          o.t(null, void 0, i(31133)),
        ),
        f = new n.TranslatedString(
          'change {toolName} text background color',
          o.t(null, void 0, i(22231)),
        ),
        _ = new n.TranslatedString(
          'change {toolName} text border visibility',
          o.t(null, void 0, i(58704)),
        ),
        T = new n.TranslatedString(
          'change {toolName} text border width',
          o.t(null, void 0, i(35423)),
        ),
        b = new n.TranslatedString(
          'change {toolName} text border color',
          o.t(null, void 0, i(36666)),
        ),
        C = new n.TranslatedString(
          'change {toolName} text wrap',
          o.t(null, void 0, i(39587)),
        ),
        v = o.t(null, void 0, i(79468)),
        y = o.t(null, void 0, i(38408)),
        w = o.t(null, void 0, i(7560))
      function P(e, t, i, o) {
        const n = {},
          P = {
            id: `${(0, l.removeSpaces)(i.originalText())}Text`,
            title: (o.customTitles && o.customTitles.text) || '',
          }
        if (
          (void 0 !== t.showText &&
            (n.checked = (0, r.convertToDefinitionProperty)(
              e,
              t.showText,
              s.format({ toolName: i }),
            )),
          void 0 !== t.textColor &&
            (n.color = (0, r.getColorDefinitionProperty)(
              e,
              t.textColor,
              t.transparency || null,
              a.format({ toolName: i }),
            )),
          void 0 !== t.fontSize &&
            (n.size = (0, r.convertToDefinitionProperty)(
              e,
              t.fontSize,
              c.format({ toolName: i }),
            )),
          void 0 !== t.bold &&
            (n.bold = (0, r.convertToDefinitionProperty)(
              e,
              t.bold,
              h.format({ toolName: i }),
            )),
          void 0 !== t.italic &&
            (n.italic = (0, r.convertToDefinitionProperty)(
              e,
              t.italic,
              d.format({ toolName: i }),
            )),
          void 0 !== t.text &&
            ((n.text = (0, r.convertToDefinitionProperty)(
              e,
              t.text,
              u.format({ toolName: i }),
            )),
            (P.isEditable = Boolean(o.isEditable)),
            (P.isMultiLine = Boolean(o.isMultiLine))),
          void 0 !== t.vertLabelsAlign &&
            ((n.alignmentVertical = (0, r.convertToDefinitionProperty)(
              e,
              t.vertLabelsAlign,
              p.format({ toolName: i }),
            )),
            (P.alignmentVerticalItems = o.alignmentVerticalItems)),
          void 0 !== t.horzLabelsAlign &&
            ((n.alignmentHorizontal = (0, r.convertToDefinitionProperty)(
              e,
              t.horzLabelsAlign,
              m.format({ toolName: i }),
            )),
            (P.alignmentHorizontalItems = o.alignmentHorizontalItems)),
          void 0 !== t.textOrientation &&
            (n.orientation = (0, r.convertToDefinitionProperty)(
              e,
              t.textOrientation,
              g.format({ toolName: i }),
            )),
          void 0 !== t.backgroundVisible &&
            (n.backgroundVisible = (0, r.convertToDefinitionProperty)(
              e,
              t.backgroundVisible,
              x.format({ toolName: i }),
            )),
          void 0 !== t.backgroundColor)
        ) {
          let o = null
          void 0 !== t.backgroundTransparency && (o = t.backgroundTransparency),
            (n.backgroundColor = (0, r.getColorDefinitionProperty)(
              e,
              t.backgroundColor,
              o,
              f.format({ toolName: i }),
            ))
        }
        return (
          (void 0 === t.backgroundVisible && void 0 === t.backgroundColor) ||
            (P.backgroundTitle =
              (o.customTitles && o.customTitles.backgroundTitle) || v),
          void 0 !== t.borderVisible &&
            (n.borderVisible = (0, r.convertToDefinitionProperty)(
              e,
              t.borderVisible,
              _.format({ toolName: i }),
            )),
          void 0 !== t.borderWidth &&
            (n.borderWidth = (0, r.convertToDefinitionProperty)(
              e,
              t.borderWidth,
              T.format({ toolName: i }),
            )),
          void 0 !== t.borderColor &&
            (n.borderColor = (0, r.getColorDefinitionProperty)(
              e,
              t.borderColor,
              null,
              b.format({ toolName: i }),
            )),
          (void 0 === t.borderVisible &&
            void 0 === t.borderColor &&
            void 0 === t.borderWidth) ||
            (P.borderTitle =
              (o.customTitles && o.customTitles.borderTitle) || y),
          void 0 !== t.wrap &&
            ((n.wrap = (0, r.convertToDefinitionProperty)(
              e,
              t.wrap,
              C.format({ toolName: i }),
            )),
            (P.wrapTitle = (o.customTitles && o.customTitles.wrapTitle) || w)),
          (0, r.createTextPropertyDefinition)(n, P)
        )
      }
    },
    23720: (e, t, i) => {
      i.r(t),
        i.d(t, {
          FibTimezoneDefinitionsViewModel: () => V,
          availableAlignmentHorizontalItems: () => S,
          availableAlignmentVerticalItems: () => P,
        })
      var o = i(50151),
        n = i(11542),
        r = i(45126),
        l = i(32097),
        s = i(18009),
        a = i(30699),
        c = i(64147),
        h = i(91682),
        d = i(95166)
      const u = new r.TranslatedString(
          'change {title} level {index} line visibility',
          n.t(null, void 0, i(51403)),
        ),
        p = new r.TranslatedString(
          'change {title} level {index} line color',
          n.t(null, void 0, i(664)),
        ),
        m = new r.TranslatedString(
          'change {title} level {index} line width',
          n.t(null, void 0, i(97870)),
        ),
        g = new r.TranslatedString(
          'change {title} level {index} line style',
          n.t(null, void 0, i(64707)),
        ),
        x = new r.TranslatedString(
          'change {title} level {index} line coeff',
          n.t(null, void 0, i(27154)),
        ),
        f = new r.TranslatedString(
          'change {title} all lines color',
          n.t(null, void 0, i(59577)),
        ),
        _ = new r.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(30839)),
        ),
        T = new r.TranslatedString(
          'change {title} background transparency',
          n.t(null, void 0, i(13783)),
        ),
        b = new r.TranslatedString(
          'change {title} labels visibility',
          n.t(null, void 0, i(93340)),
        ),
        C = new r.TranslatedString(
          'change {title} labels alignment',
          n.t(null, void 0, i(55612)),
        ),
        v = n.t(null, void 0, i(28683)),
        y = n.t(null, void 0, i(79468)),
        w = n.t(null, void 0, i(5119)),
        P = [
          {
            id: a.VerticalAlign.Bottom,
            value: a.VerticalAlign.Top,
            title: n.t(null, void 0, i(97118)),
          },
          {
            id: a.VerticalAlign.Middle,
            value: a.VerticalAlign.Middle,
            title: n.t(null, void 0, i(68833)),
          },
          {
            id: a.VerticalAlign.Top,
            value: a.VerticalAlign.Bottom,
            title: n.t(null, void 0, i(27567)),
          },
        ],
        S = [
          {
            id: a.HorizontalAlign.Left,
            value: a.HorizontalAlign.Left,
            title: n.t(null, void 0, i(11626)),
          },
          {
            id: a.HorizontalAlign.Center,
            value: a.HorizontalAlign.Center,
            title: n.t(null, void 0, i(24197)),
          },
          {
            id: a.HorizontalAlign.Right,
            value: a.HorizontalAlign.Right,
            title: n.t(null, void 0, i(50421)),
          },
        ]
      class V extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, h.removeSpaces)(i),
            s = new r.TranslatedString(i, this._source.translatedType()),
            a = this._source.levelsCount()
          for (let i = 1; i <= a; i++) {
            const o = t[`level${i}`].childs(),
              r = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.visible,
                    u.format({ title: s, index: i }),
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    o.color,
                    null,
                    p.format({ title: s, index: i }),
                  ),
                  width: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.linewidth,
                    m.format({ title: s, index: i }),
                  ),
                  style: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.linestyle,
                    g.format({ title: s, index: i }),
                  ),
                  level: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.coeff,
                    x.format({ title: s, index: i }),
                  ),
                },
                { id: `${n}LineLevel${i}` },
              )
            e.push(r)
          }
          const V = (0, l.createColorPropertyDefinition)(
            {
              color: (0, l.getColorDefinitionProperty)(
                this._propertyApplier,
                new d.CollectibleColorPropertyUndoWrapper(
                  (0, o.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                f.format({ title: s }),
                !0,
              ),
            },
            { id: `${n}AllLineColor`, title: v },
          )
          e.push(V)
          const I = (0, l.createTransparencyPropertyDefinition)(
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
            { id: `${n}Background`, title: y },
          )
          e.push(I)
          const D = (0, l.createTwoOptionsPropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.showLabels,
                b.format({ title: s }),
              ),
              option1: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.horzLabelsAlign,
                C.format({ title: s }),
              ),
              option2: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.vertLabelsAlign,
                C.format({ title: s }),
              ),
            },
            {
              id: `${n}Labels`,
              title: w,
              optionsItems1: new c.WatchedValue(S),
              optionsItems2: new c.WatchedValue(P),
            },
          )
          return e.push(D), { definitions: e }
        }
      }
    },
    95166: (e, t, i) => {
      i.d(t, {
        CollectibleColorPropertyDirectWrapper: () => s,
        CollectibleColorPropertyUndoWrapper: () => l,
      })
      var o = i(50151),
        n = i(12988)
      class r extends n.Property {
        constructor(e) {
          super(),
            (this._listenersMappers = []),
            (this._isProcess = !1),
            (this._baseProperty = e)
        }
        destroy() {
          this._baseProperty.destroy(), super.destroy()
        }
        value() {
          const e = this._baseProperty.value()
          return 'mixed' === e ? '' : e
        }
        visible() {
          return this._baseProperty.visible()
        }
        setValue(e) {
          ;(this._isProcess = !0),
            this._baseProperty.setValue('' === e ? 'mixed' : e, void 0, {
              applyValue: this._applyValue.bind(this),
            }),
            (this._isProcess = !1),
            this._listenersMappers.forEach((e) => {
              e.method.call(e.obj, this, '')
            })
        }
        subscribe(e, t) {
          const i = (i) => {
              this._isProcess || t.call(e, this, '')
            },
            o = { obj: e, method: t, callback: i }
          this._listenersMappers.push(o), this._baseProperty.subscribe(e, i)
        }
        unsubscribe(e, t) {
          const i = (0, o.ensureDefined)(
            this._listenersMappers.find((i) => i.obj === e && i.method === t)
              ?.callback,
          )
          this._baseProperty.unsubscribe(e, i)
        }
        unsubscribeAll(e) {
          this._baseProperty.unsubscribeAll(e)
        }
      }
      class l extends r {
        constructor(e, t, i) {
          super(e), (this._propertyApplier = t), (this._undoText = i)
        }
        _applyValue(e, t) {
          this._propertyApplier.setProperty(e, t, this._undoText)
        }
      }
      class s extends r {
        _applyValue(e, t) {
          e.setValue(t)
        }
      }
    },
    6590: (e, t, i) => {
      i.d(t, { commonLineToolPropertiesStateKeys: () => o })
      const o = [
        'symbolStateVersion',
        'zOrderVersion',
        'frozen',
        'title',
        'interval',
        'symbol',
        'currencyId',
        'unitId',
        'visible',
        'intervalsVisibilities.ticks',
        'intervalsVisibilities.seconds',
        'intervalsVisibilities.secondsFrom',
        'intervalsVisibilities.secondsTo',
        'intervalsVisibilities.minutes',
        'intervalsVisibilities.minutesFrom',
        'intervalsVisibilities.minutesTo',
        'intervalsVisibilities.hours',
        'intervalsVisibilities.hoursFrom',
        'intervalsVisibilities.hoursTo',
        'intervalsVisibilities.days',
        'intervalsVisibilities.daysFrom',
        'intervalsVisibilities.daysTo',
        'intervalsVisibilities.weeks',
        'intervalsVisibilities.weeksFrom',
        'intervalsVisibilities.weeksTo',
        'intervalsVisibilities.months',
        'intervalsVisibilities.monthsFrom',
        'intervalsVisibilities.monthsTo',
        'intervalsVisibilities.ranges',
      ]
      var n, r, l
      !((e) => {
        ;(e[(e.NotShared = 0)] = 'NotShared'),
          (e[(e.SharedInLayout = 1)] = 'SharedInLayout'),
          (e[(e.GloballyShared = 2)] = 'GloballyShared')
      })(n || (n = {})),
        ((e) => {
          ;(e.BeforeAllAction = 'BeforeAll'), (e.CustomAction = 'CustomAction')
        })(r || (r = {})),
        ((e) => {
          ;(e.FloatingToolbarButton = 'FloatingToolbarButton'),
            (e.Default = 'Default')
        })(l || (l = {}))
    },
    38039: (e, t, i) => {
      i.d(t, { LineDataSourceProperty: () => s })
      var o = i(90054),
        n = i(16738),
        r = i(50151),
        l = i(32679)
      class s extends l.DefaultProperty {
        constructor({ templateKeys: e, ...t }) {
          super({
            ignoreAllowSavingDefaults: !0,
            saveNonDefaultUserPreferencesOnly: !0,
            ...t,
          }),
            (this._templateKeys = (0, r.ensureDefined)(
              e || this._allDefaultsKeys,
            ))
        }
        template() {
          return (0, l.extractState)(this.state(), this._templateKeys, [])
        }
        applyTemplate(e) {
          this.mergeAndFire(
            (0, l.extractState)(
              (0, n.default)(
                (0, o.default)(this._factoryDefaultsSupplier()),
                e,
              ),
              this._templateKeys,
            ),
          )
        }
      }
    },
    56176: (e, t, i) => {
      i.r(t), i.d(t, { LineToolTable: () => Oe })
      var o = i(50151),
        n = i(86441),
        r = i(7029),
        l = i(42752),
        s = i(29875),
        a = i(24362),
        c = i(49156),
        h = i(24633),
        d = i(32679),
        u = i(11402),
        p = i(30699),
        m = i(31229),
        g = i(38039),
        x = i(6590),
        f = i(12988),
        _ = i(73305),
        T = i(7114),
        b = i(2844),
        C = i(68979),
        v = i(15938)
      class y {
        constructor(e) {
          ;(this._textWidthCache = new b.TextWidthCache(1e3)), this.setFont(e)
        }
        setFont(e) {
          ;(this._fontSize = e),
            (this._font = (0, C.makeFont)(e, v.CHART_FONT_FAMILY))
        }
        font() {
          return this._font
        }
        textWidthCache() {
          return this._textWidthCache
        }
        getSymbolWidth() {
          return (0, T.measureText)('0', this._font, this._textWidthCache).width
        }
        getSymbolHeight() {
          return this._fontSize
        }
      }
      var w = i(17330)
      function P(e, t) {
        return Math.max(e - 16 - 2, t.getSymbolWidth())
      }
      function S(e, t, i) {
        const o = (0, w.wordWrap)(
            e,
            i.font(),
            i.textWidthCache(),
            !0,
            t,
          ).length,
          n = i.getSymbolHeight()
        return o * n + (o - 1) * (n * (1.3 - 1)) + 16 + 2
      }
      function V(e) {
        return e.getSymbolHeight() + 16 + 1
      }
      function I(e) {
        return e.getSymbolWidth() + 16 + 2
      }
      function D(e, t, i, o) {
        let n = 0
        for (let e = 0; e < i; e++) n += t[e]
        const r = t[i]
        return [Math.round((e + n) * o), Math.round((e + n + r) * o)]
      }
      const {
          colorWhite: A,
          colorColdGray200: R,
          colorColdGray650: H,
          colorColdGray900: W,
        } = c.colors,
        E = {
          intervalsVisibilities: { ...m.intervalsVisibilitiesDefaults },
          fontSize: 14,
          horzAlign: p.HorizontalAlign.Left,
          anchored: !1,
        },
        z = new Map([
          [
            h.StdTheme.Light,
            { backgroundColor: A, borderColor: R, textColor: W },
          ],
          [
            h.StdTheme.Dark,
            { backgroundColor: W, borderColor: H, textColor: R },
          ],
        ]),
        L = (0, d.extractThemedColors)(
          (0, o.ensureDefined)(z.get(h.StdTheme.Light)),
          (0, o.ensureDefined)(z.get(h.StdTheme.Dark)),
        ),
        M = (0, d.extractAllPropertiesKeys)(
          (0, o.ensureDefined)(z.get(h.StdTheme.Light)),
        ),
        N = (0, d.extractAllPropertiesKeys)(E),
        k = [
          ...new Set([
            ...M,
            ...N,
            'rowsCount',
            'colsCount',
            'cells.*',
            'columnWidths.*',
            'rowHeights.*',
          ]),
        ],
        B = [...new Set([...k, ...x.commonLineToolPropertiesStateKeys])]
      class F extends g.LineDataSourceProperty {
        constructor(e) {
          if ((super(e), (this._tableTextCache = new y(14)), !e.state)) {
            const e = 3,
              t = 3,
              i = []
            for (let o = 0; o < e; o++) i.push(new Array(t).fill(''))
            const o = new Array(t).fill(120),
              n = new Array(e).fill(0)
            this.recreateCellsPropsByState({
              rowsCount: e,
              colsCount: t,
              cells: i,
              columnWidths: o,
              rowHeights: n,
            })
          }
          this.addChild(
            'linesColors',
            new _.LineToolColorsProperty([
              (0, o.ensureDefined)(this.child('borderColor')),
            ]),
          ),
            this.addChild(
              'textsColors',
              new _.LineToolColorsProperty([
                (0, o.ensureDefined)(this.child('textColor')),
              ]),
            ),
            this.addChild(
              'backgroundsColors',
              new _.LineToolColorsProperty([
                (0, o.ensureDefined)(this.child('backgroundColor')),
              ]),
            ),
            this.addChild('editableText', new f.Property(''))
        }
        recreateCellsPropsByState(e) {
          const {
            cells: t,
            colsCount: i,
            rowsCount: o,
            columnWidths: n,
            rowHeights: r,
          } = e
          this.removeProperty('rowsCount'),
            this.removeProperty('colsCount'),
            this.removeProperty('cells'),
            this.removeProperty('columnWidths'),
            this.removeProperty('rowHeights'),
            this.addChild('rowsCount', new f.Property(o)),
            this.addChild('colsCount', new f.Property(i)),
            this.addChild('cells', new f.Property(t)),
            this.addChild('columnWidths', new f.Property(n)),
            this.addChild('rowHeights', new f.Property(r)),
            this.childs().rowsCount.fireChanged(),
            this.childs().colsCount.fireChanged(),
            this.childs().cells.fireChanged(),
            this.childs().columnWidths.fireChanged(),
            this.childs().rowHeights.fireChanged()
        }
        setTableTextCache(e) {
          this._tableTextCache = e
        }
        columnWidthValues() {
          const { colsCount: e, columnWidths: t } = this.childs(),
            i = t.childs()
          return Array.from({ length: e.value() }, (e, t) => i[t].value())
        }
        rowHeightValues() {
          const { rowsCount: e, rowHeights: t } = this.childs(),
            i = t.childs()
          return Array.from({ length: e.value() }, (e, t) => i[t].value())
        }
        setColumnWidthValues(e) {
          const t = this.childs(),
            i = t.colsCount.value(),
            o = I(this._tableTextCache)
          for (let n = 0; n < i; n++)
            t.columnWidths.childs()[n].setValue(Math.max(e[n], o))
        }
        setRowHeightValues(e) {
          const t = this.childs(),
            i = t.rowsCount.value(),
            o = V(this._tableTextCache)
          for (let n = 0; n < i; n++)
            t.rowHeights.childs()[n].setValue(Math.max(e[n], o))
        }
        cellsValues() {
          const { rowsCount: e, colsCount: t, cells: i } = this.childs(),
            o = i.childs()
          return Array.from({ length: e.value() }, (e, i) =>
            Array.from({ length: t.value() }, (e, t) =>
              o[i].childs()[t].value(),
            ),
          )
        }
        static create(e, t) {
          return new this({
            defaultName: 'linetooltable',
            factoryDefaultsSupplier: () =>
              (0, u.factoryDefaultsForCurrentTheme)(E, z),
            nonThemedDefaultsKeys: N,
            themedDefaultsKeys: M,
            allStateKeys: B,
            themedColors: L,
            replaceThemedColorsOnThemeChange: !0,
            state: t,
            theme: e,
            templateKeys: k,
          })
        }
      }
      var O,
        K = i(69186),
        $ = i(56468),
        U = i(95201),
        X = i(32211),
        Y = i(19063),
        G = i(72791),
        j = i(32563),
        q = i(62689)
      !((e) => {
        ;(e[(e.TopLeft = 0)] = 'TopLeft'),
          (e[(e.BottomLeft = 1)] = 'BottomLeft'),
          (e[(e.TopRight = 2)] = 'TopRight'),
          (e[(e.BottomRight = 3)] = 'BottomRight'),
          (e[(e.ResizeVirtualAnchorBase = 1024)] = 'ResizeVirtualAnchorBase')
      })(O || (O = {}))
      var J,
        Q = i(34026),
        Z = i(61993),
        ee = i(30125),
        te = i(37743),
        ie = i(97085)
      function oe(e) {
        if (e < O.ResizeVirtualAnchorBase) return { row: null, column: null }
        const t = e - O.ResizeVirtualAnchorBase,
          i = Math.floor(t / O.ResizeVirtualAnchorBase),
          o = t % O.ResizeVirtualAnchorBase
        return { row: 0 === i ? null : i - 1, column: 0 === o ? null : o - 1 }
      }
      function ne(e) {
        return null === e.row && null === e.column
          ? null
          : O.ResizeVirtualAnchorBase +
              (null === e.row ? 0 : e.row + 1) * O.ResizeVirtualAnchorBase +
              (null === e.column ? 0 : e.column + 1)
      }
      !((e) => {
        e[(e.EdgeHighlightWidth = 7)] = 'EdgeHighlightWidth'
      })(J || (J = {}))
      const re = c.colors.colorTvBlue500Alpha20,
        le = c.colors.colorTvBlue500
      class se extends ee.BitmapCoordinatesPaneRenderer {
        constructor() {
          super(...arguments),
            (this._data = null),
            (this._cellsHitTestData = [])
        }
        setData(e) {
          this._data = e
        }
        setCellsHitTestData(e) {
          this._cellsHitTestData = e
        }
        hitTest(e, t) {
          if (!this._data) return null
          const { horizontalPixelRatio: i, verticalPixelRatio: r } = t,
            {
              activeEdge: l,
              changeSize: s,
              changeOnlyActiveEdge: a,
              cells: c,
            } = this._data,
            { x: h, y: d } = c.topLeft,
            { x: u, y: p } = c.bottomRight,
            m = d / r,
            g = h / i,
            x = p / r,
            f = u / i
          {
            let t = null,
              h = null
            const d = (0, Z.interactionTolerance)().line
            for (const i of c.cells) {
              const { bottom: o, rowIndex: l } = i[0],
                s = o / r
              if (
                ((t = (0, Q.pointInBox)(
                  e,
                  (0, n.box)((0, n.point)(g, s - d), (0, n.point)(f, s + d)),
                )
                  ? l
                  : null),
                null !== t)
              )
                break
            }
            for (const t of c.cells[0]) {
              const { right: o, columnIndex: r } = t,
                l = o / i
              if (
                ((h = (0, Q.pointInBox)(
                  e,
                  (0, n.box)((0, n.point)(l - d, m), (0, n.point)(l + d, x)),
                )
                  ? r
                  : null),
                null !== h)
              )
                break
            }
            if (s && (null !== h || null !== t)) {
              const e = { row: t, column: h },
                i =
                  null !== h && null !== t
                    ? G.PaneCursorType.Default
                    : null !== h
                      ? G.PaneCursorType.HorizontalResize
                      : G.PaneCursorType.VerticalResize
              return new $.HitTestResult(
                a && h !== l.column && t !== l.row
                  ? $.HitTarget.MovePoint
                  : $.HitTarget.ChangePoint,
                {
                  cursorType: i,
                  activeItem: e,
                  pointIndex: (0, o.ensureNotNull)(ne(e)),
                  nonDiscreteIndex: !0,
                },
              )
            }
          }
          for (const t of c.cells)
            for (const o of t) {
              const {
                  left: t,
                  right: l,
                  top: s,
                  bottom: a,
                  rowIndex: c,
                  columnIndex: h,
                } = o,
                d = s / r,
                u = t / i,
                p = a / r,
                m = l / i
              if (
                (0, Q.pointInBox)(
                  e,
                  (0, n.box)((0, n.point)(u, d), (0, n.point)(m, p)),
                )
              )
                return new $.HitTestResult($.HitTarget.MovePoint, {
                  ...this._cellsHitTestData[c]?.[h],
                  activeItem: { rowIndex: c, columnIndex: h },
                })
            }
          return (0, Q.pointInBox)(
            e,
            (0, n.box)((0, n.point)(g, m), (0, n.point)(f, x)),
          )
            ? new $.HitTestResult($.HitTarget.MovePoint)
            : null
        }
        _drawImpl(e) {
          if (null === this._data) return
          const t = e.context,
            i = this._data
          !((e, t) => {
            e.fillStyle = t.backgroundColor
            const { x: i, y: o } = t.cells.topLeft,
              { x: n, y: r } = t.cells.bottomRight
            e.fillRect(i, o, n - i, r - o)
          })(t, i),
            ((e, t) => {
              const i = (0, Z.roundToMax)(1 * e.horizontalPixelRatio),
                o = (0, Z.roundToMax)(1 * e.verticalPixelRatio),
                n = e.context
              n.fillStyle = t.borderColor
              const [r, l] = t.editableCell || [-1, -1]
              let [s, a] = t.selectableCell || [-1, -1]
              r === s && l === a && ((s = -1), (a = -1))
              for (const c of t.cells.cells)
                for (const h of c) {
                  const {
                    left: c,
                    right: d,
                    top: u,
                    bottom: p,
                    columnIndex: m,
                    rowIndex: g,
                  } = h
                  if (
                    (0 === g && n.fillRect(c, u, d - c, o),
                    0 === m && n.fillRect(c, u, i, p - u),
                    n.fillRect(c, p, d - c, o),
                    n.fillRect(d, u, i, p - u),
                    (r === g && l === m) || (s === g && a === m))
                  ) {
                    const r = (0, Z.roundToMax)(2 * e.horizontalPixelRatio),
                      l = (0, Z.roundToMax)(2 * e.verticalPixelRatio)
                    ;(n.fillStyle = le),
                      [
                        [c + i, u + o, d - c - i, l],
                        [c + i, p - l, d - c - i, l],
                        [c + i, u + o, r, p - u - o],
                        [d - r, u + o, r, p - u - o],
                      ].forEach(([e, t, i, o]) => {
                        n.fillRect(e, t, i, o)
                      }),
                      (n.fillStyle = t.borderColor)
                  }
                }
            })(e, i),
            ((e, t, i) => {
              if (null === t.activeEdge.row && null === t.activeEdge.column)
                return
              const o = Math.max(1, Math.round(7 * i.horizontalPixelRatio))
              if (
                ((e.strokeStyle = re),
                (e.lineWidth = o),
                null !== t.activeEdge.column)
              ) {
                const i = t.cells.cells[0][t.activeEdge.column]
                ;(0, te.drawVerticalLine)(
                  e,
                  i.right,
                  t.cells.topLeft.y,
                  t.cells.bottomRight.y,
                )
              }
              if (null !== t.activeEdge.row) {
                const i = t.cells.cells[t.activeEdge.row][0]
                ;(0, te.drawHorizontalLine)(
                  e,
                  i.bottom,
                  t.cells.topLeft.x,
                  t.cells.bottomRight.x,
                )
              }
            })(t, i, e)
        }
      }
      class ae extends X.InplaceTextLineSourcePaneView {
        constructor(e, t, i, o, r, l) {
          super(e, t, o, r, l),
            (this._renderer = new U.CompositeRenderer()),
            (this._cellsTextRenderers = []),
            (this._lastRenderingInfo = null),
            (this._tryActivateEditMode = (e, t) => {
              this.closeTextEditor(),
                this._source.setInplaceEditableCellIndexes(e),
                super._tryActivateEditMode(e, t)
            }),
            (this._anchorClickHandler = () => {
              this._source.setInplaceEditableCellIndexes([-1, -1])
            }),
            (this._tableTextCache = i),
            (this._anchorPoints = Array.from({ length: 4 }, (e, t) => ({
              point: (0, n.point)(Number.NaN, Number.NaN),
              pointIndex: t,
              cursorType:
                t === O.TopLeft || t === O.BottomRight
                  ? G.PaneCursorType.DiagonalNwSeResize
                  : G.PaneCursorType.DiagonalNeSwResize,
              hitTarget: $.HitTarget.ChangePoint,
              nonDiscreteIndex: t === O.TopRight || t === O.BottomRight,
            }))),
            (this._tableRenderer = new se()),
            this._source.setAdditionalCursorData(
              () => {
                const e = this._getTextEditableRenderer()
                return e
                  ? {
                      color: this._source.editableTextStyle().cursorColor,
                      ...e.getTextInfo(),
                    }
                  : {
                      color: this._source.editableTextStyle().cursorColor,
                      lineSpacing: 0,
                      lineHeight: 0,
                    }
              },
              (e) => {
                const t = this._getTextEditableRenderer()
                return t
                  ? t.positionToCoordinate(e)
                  : { x: 0, y: 0, lineNumber: 0 }
              },
            )
        }
        renderer(e) {
          return (
            (this._lastRenderingInfo = e),
            this._invalidated && this._updateImpl(e),
            this._renderer
          )
        }
        lastRenderingInfo() {
          return this._lastRenderingInfo
        }
        _updateImpl(e) {
          super._updateImpl(e), this._renderer.clear()
          const t = this._source.priceScale()
          if (!t || t.isEmpty()) return
          if (
            !this._points ||
            (this._source.isFixed() && void 0 === this._source.fixedPoint())
          )
            return
          const i = this._source.isFixed()
            ? [(0, o.ensureDefined)(this._source.fixedPoint())]
            : this._points
          if (i.length < 1) return
          const [r] = i,
            l = this._source.properties(),
            s = l.childs(),
            a = (0, K.lastMouseOrTouchEventInfo)().isTouch
          let c = { column: null, row: null }
          if (
            (a
              ? this._source.model().selection().dataSources()[0]
              : this._source.model().hoveredSource()) === this._source
          ) {
            const e = j.mobiletouch
                ? this._source.model().lastSelectedHittestData()
                : this._source.model().lastHittestData(),
              t = e?.activeItem
            ;((e) => (0, ie.isObject)(e) && 'row' in e && 'column' in e)(t) &&
              (c = t)
          }
          const h = {
            columnWidths: this._source.columnWidths(),
            rowHeights: this._source.rowHeights(),
            texts: l.cellsValues(),
            leftTop: r,
            borderColor: s.borderColor.value(),
            backgroundColor: s.backgroundColor.value(),
            textColor: s.textColor.value(),
            fontSize: s.fontSize.value(),
            horzAlign: s.horzAlign.value(),
          }
          this._updateTextRenderers(e, h)
          const d = this._rawPrecalculatedData(h, e)
          this._tableRenderer.setData({
            ...h,
            editableCell: this._getTextEditableCellIndexes(),
            selectableCell: this._getSelectableCellIndexes(),
            cells: d,
            activeEdge: c,
            changeSize: this._model.selection().isSelected(this._source),
            changeOnlyActiveEdge: a,
          }),
            this._setTextRendererPositions(d, e),
            this._renderer.append(this._tableRenderer),
            this._cellsTextRenderers.forEach((e) =>
              e.forEach((e) => this._renderer.append(e)),
            )
          const { x: u, y: p } = d.topLeft,
            { x: m, y: g } = d.bottomRight,
            { horizontalPixelRatio: x, verticalPixelRatio: f } = e,
            _ = u / x,
            T = p / f,
            b = m / x,
            C = g / f,
            v = this._source.isFixed()
          ;(this._anchorPoints[O.TopLeft].point = (0, n.point)(_, T)),
            (this._anchorPoints[O.TopLeft].nonDiscreteIndex = v),
            (this._anchorPoints[O.BottomLeft].point = (0, n.point)(_, C)),
            (this._anchorPoints[O.BottomLeft].nonDiscreteIndex = v),
            (this._anchorPoints[O.TopRight].point = (0, n.point)(b, T)),
            (this._anchorPoints[O.BottomRight].point = (0, n.point)(b, C)),
            this._renderer.append(
              this.createLineAnchor(
                {
                  points: this._anchorPoints,
                  clickHandler: this._anchorClickHandler,
                },
                0,
              ),
            ),
            this._model.selection().isSelected(this._source) ||
              (this.closeTextEditor(),
              this._source.setInplaceEditableCellIndexes([-1, -1]))
        }
        _activateEditMode(e) {
          super._activateEditMode(e)
          const t = this._getTextEditableRenderer()
          null !== t &&
            (t.setCursorType(this._textCursorType()),
            this._updateInplaceText(t.getTextInfo()))
        }
        _textColorForCell([e, t]) {
          const i = this._source.properties().childs().textColor.value()
          let o
          return (
            (o = this._isEditableCell([e, t])
              ? this._text()
              : this._source.cellText(e, t)),
            o ? i : (0, Y.generateColor)(i, 50, !0)
          )
        }
        _isEditableCell([e, t]) {
          const i = this._getTextEditableCellIndexes()
          return i[0] === e && i[1] === t
        }
        _updateTextRenderers(e, t) {
          if (t)
            if (
              this._cellsTextRenderers.length !== t.texts.length ||
              this._cellsTextRenderers[0].length !== t.texts[0].length
            ) {
              const e = [],
                i = []
              for (let o = 0; o < t.texts.length; o++) {
                const n = t.texts[o],
                  r = [],
                  l = []
                for (let e = 0; e < n.length; e++) {
                  const i = (0, X.inplaceEditHandlers)(
                    this._tryActivateEditMode.bind(this, [o, e]),
                  )
                  l.push(i),
                    r.push(
                      new q.LineToolTextRenderer(
                        {
                          text: n[e],
                          font: v.CHART_FONT_FAMILY,
                          fontSize: t.fontSize,
                          lineHeight: 1.3,
                          color: this._textColorForCell([o, e]),
                          horzAlign: t.horzAlign,
                          vertAlign: p.VerticalAlign.Top,
                          wordWrapWidth: P(
                            t.columnWidths[e],
                            this._tableTextCache,
                          ),
                          offsetX: 1,
                          offsetY: 1,
                          boxPadding: 8,
                        },
                        new $.HitTestResult($.HitTarget.MovePoint, i),
                      ),
                    )
                }
                e.push(r), i.push(l)
              }
              ;(this._cellsTextRenderers = e),
                this._tableRenderer.setCellsHitTestData(i)
            } else {
              const { height: i, width: n } = e.mediaSize,
                r = this._getTextEditableRenderer()
              t.texts.forEach((e, l) => {
                e.forEach((e, s) => {
                  const a = this._cellsTextRenderers[l][s]
                  let c = {
                    ...(0, o.ensureNotNull)(a.data()),
                    text: e,
                    selectionHighlight: void 0,
                    fontSize: t.fontSize,
                    color: this._textColorForCell([l, s]),
                    horzTextAlign: t.horzAlign,
                    horzAlign: t.horzAlign,
                    wordWrapWidth: P(t.columnWidths[s], this._tableTextCache),
                    boxPadding: 8,
                  }
                  r === a &&
                    ((c = {
                      ...c,
                      ...this._inplaceTextHighlight(),
                      text: this._text(),
                    }),
                    a.isOutOfScreen(n, i)
                      ? this.closeTextEditor()
                      : this._updateInplaceText(a.getTextInfo())),
                    a.setData(c),
                    a.setCursorType(this._textCursorType())
                })
              })
            }
        }
        _setTextRendererPositions(e, t) {
          const i = this._source.properties().childs().horzAlign.value(),
            { horizontalPixelRatio: o, verticalPixelRatio: r } = t
          this._cellsTextRenderers.forEach((t, l) => {
            t.forEach((t, s) => {
              const { left: a, right: c, top: h, bottom: d } = e.cells[l][s]
              t.setPoint(
                (0, n.point)(
                  (a +
                    ('right' === i
                      ? c - a
                      : 'center' === i
                        ? (c - a) / 2
                        : 0)) /
                    o,
                  h / r,
                ),
              )
              const u = t.data()
              null !== u &&
                t.setData({
                  ...u,
                  boxWidth: (c - a) / o - 1,
                  boxHeight: Math.max((d - h) / r, t.measure().height),
                })
            })
          })
        }
        _rawPrecalculatedData(e, t) {
          const i = this._cellsTextRenderers.map((t, i) =>
              Math.max(...t.map((e) => e.measure().height), e.rowHeights[i]),
            ),
            o = e.columnWidths.map((i, o) =>
              D(e.leftTop.x, e.columnWidths, o, t.horizontalPixelRatio),
            ),
            r = i.map((o, n) => D(e.leftTop.y, i, n, t.verticalPixelRatio)),
            l = i.map((t, i) =>
              e.columnWidths.map((t, n) => {
                const [l, s] = o[n],
                  [a, c] = r[i]
                return {
                  left: l,
                  right: s,
                  top: a,
                  bottom: c,
                  columnIndex: n,
                  rowIndex: i,
                  text: e.texts[i][n],
                }
              }),
            )
          return {
            topLeft: (0, n.point)(o[0][0], r[0][0]),
            bottomRight: (0, n.point)(o[o.length - 1][1], r[r.length - 1][1]),
            cells: l,
          }
        }
        _getTextEditableCellIndexes() {
          return this._isTextEditMode()
            ? this._getSelectableCellIndexes()
            : [-1, -1]
        }
        _getSelectableCellIndexes() {
          return this._source.inplaceEditableCellIndexes()
        }
        _getTextEditableRenderer() {
          const [e, t] = this._getTextEditableCellIndexes()
          return -1 === e && -1 === t ? null : this._cellsTextRenderers[e]?.[t]
        }
      }
      var ce = i(11542),
        he = i(45126),
        de = i(91335),
        ue = i(18009),
        pe = i(32097),
        me = i(91682),
        ge = i(64147),
        xe = i(23720)
      const fe = new he.TranslatedString(
          'change {title} background color',
          ce.t(null, void 0, i(49765)),
        ),
        _e = new he.TranslatedString(
          'change {title} border color',
          ce.t(null, void 0, i(69437)),
        ),
        Te = new he.TranslatedString(
          'change {title} texts alignment',
          ce.t(null, void 0, i(71665)),
        ),
        be = ce.t(null, void 0, i(79468)),
        Ce = ce.t(null, void 0, i(38408)),
        ve = ce.t(null, void 0, i(70320)),
        ye = ce.t(null, void 0, i(25485))
      class we extends ue.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, me.removeSpaces)(t),
            o = new he.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, pe.createColorPropertyDefinition)(
                {
                  color: (0, pe.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    null,
                    fe.format({ title: o }),
                  ),
                },
                { id: `${i}BackgroundColor`, title: be },
              ),
              (0, pe.createColorPropertyDefinition)(
                {
                  color: (0, pe.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.borderColor,
                    null,
                    _e.format({ title: o }),
                  ),
                },
                { id: `${i}BorderColor`, title: Ce },
              ),
              (0, de.createTextStyleDefinition)(
                this._propertyApplier,
                { textColor: e.textColor, fontSize: e.fontSize },
                o,
                { isEditable: !0, isMultiLine: !0, customTitles: { text: ve } },
              ),
              (0, pe.createOptionsPropertyDefinition)(
                {
                  option: (0, pe.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.horzAlign,
                    Te.format({ title: o }),
                  ),
                },
                {
                  id: `${i}TextAlignment`,
                  title: ye,
                  options: new ge.WatchedValue(
                    xe.availableAlignmentHorizontalItems,
                  ),
                },
              ),
            ],
          }
        }
      }
      var Pe = i(29981),
        Se = i(44672),
        Ve = i(64034)
      class Ie extends a.InplaceTextUndoCommand {
        constructor(e, t, i, o, n) {
          super(e, t, i, o),
            (this._cellIndexes = [-1, -1]),
            (this._cellIndexes = n)
        }
        _textProperty(e) {
          const [t, i] = this._cellIndexes
          return (
            (0, o.assert)(-1 !== t, "rowIndex shouldn't be -1"),
            (0, o.assert)(-1 !== i, "columnIndex shouldn't be -1"),
            e.properties().childs().cells.childs()[t].childs()[i]
          )
        }
      }
      var De = i(60265),
        Ae = i(85719)
      const Re = new he.TranslatedString(
          'add column to right',
          r.t(null, void 0, i(48499)),
        ),
        He = new he.TranslatedString(
          'add row below',
          r.t(null, void 0, i(48407)),
        ),
        We = new he.TranslatedString(
          'remove column',
          r.t(null, void 0, i(80240)),
        ),
        Ee = new he.TranslatedString('remove row', r.t(null, void 0, i(4553)))
      class ze extends De.UndoCommand {
        constructor(e, t, i, o) {
          super(o, !0, !Ae.lineToolsDoNotAffectChartInvalidation),
            (this._sourceId = t.id()),
            (this._model = e),
            (this._operationType = i)
          const { rowsCount: n, colsCount: r } = t.properties().state()
          ;(this._rowsCountPropsState = n),
            (this._colsCountPropsState = r),
            (this._columnWidthsPropsState = t.properties().columnWidthValues()),
            (this._rowHeightsPropsState = t.properties().rowHeightValues()),
            (this._cellsPropsState = t.properties().cellsValues()),
            (this._inplaceEditCellIndexes = t.inplaceEditableCellIndexes())
        }
        undo() {
          const e = this._source()
          e
            .properties()
            .recreateCellsPropsByState({
              cells: this._cellsPropsState,
              colsCount: this._colsCountPropsState,
              rowsCount: this._rowsCountPropsState,
              columnWidths: this._columnWidthsPropsState,
              rowHeights: this._rowHeightsPropsState,
            }),
            e.setInplaceEditableCellIndexes(this._inplaceEditCellIndexes, !0)
        }
        _source() {
          return (0, o.ensureNotNull)(
            this._model.dataSourceForId(this._sourceId),
          )
        }
      }
      class Le extends ze {
        constructor(e, t, i) {
          super(e, t, i, 1 === i ? Re : He)
        }
        redo() {
          this._source().insertCells(
            this._operationType,
            this._inplaceEditCellIndexes,
          )
        }
      }
      class Me extends ze {
        constructor(e, t, i) {
          super(e, t, i, 1 === i ? We : Ee)
        }
        redo() {
          this._source().removeCells(
            this._operationType,
            this._inplaceEditCellIndexes,
          )
        }
      }
      function Ne(e, t, i) {
        let o = (0, Pe.sum)(e)
        const n = (0, Pe.sum)(t)
        let r = Math.max(i, n)
        if (o === r) return [...e]
        if (r < o)
          for (let i = 0; i < e.length; i++)
            e[i] === t[i] && ((o -= e[i]), (r -= e[i]))
        const l = r / o,
          s = e.map((e, i) => Math.max(t[i], e * l))
        return (0, Pe.sum)(s) > r + 0.01 ? Ne(s, t, i) : s
      }
      const ke = new he.TranslatedString(
          'change the column width',
          r.t(null, void 0, i(26391)),
        ),
        Be = new he.TranslatedString(
          'change the row height',
          r.t(null, void 0, i(21863)),
        ),
        Fe = new he.TranslatedString(
          'resize the cell',
          r.t(null, void 0, i(24849)),
        )
      class Oe extends a.InplaceTextLineDataSource {
        constructor(e, t, i, o) {
          const n =
            t ?? Oe.createProperties(e.backgroundTheme().spawnOwnership())
          super(e, n, i, o),
            (this._hasEditableCoordinates = new ge.WatchedValue(!1)),
            (this._widthsSnapshot = null),
            (this._inplaceEditCellIndexes = [-1, -1]),
            (this._tablePaneView = null),
            (this._contextMenu = null),
            (this._tableTextCache = new y(
              this._properties.childs().fontSize.value(),
            )),
            this._properties.childs().fontSize.subscribe(this, (e) => {
              this._tableTextCache.setFont(e.value()),
                this._properties.setColumnWidthValues(
                  this._properties.columnWidthValues(),
                ),
                this.updateAllViews((0, Se.sourceChangeEvent)(this.id())),
                this._model.updateSource(this)
            }),
            this._properties.setTableTextCache(this._tableTextCache),
            (this._tablePaneView = new ae(
              this,
              e,
              this._tableTextCache,
              this._openTextEditor.bind(this),
              this._closeTextEditor.bind(this),
              this.onSelectionChange.bind(this),
            )),
            this._setPaneViews([this._tablePaneView]),
            this.setInplaceEditableCellIndexes([-1, -1], !0),
            n
              .childs()
              .anchored.subscribe(this, this._onAnchoredChange.bind(this))
        }
        destroy() {
          this._properties.childs().fontSize.unsubscribeAll(this),
            this._contextMenu?.then((e) => e.hide()),
            super.destroy()
        }
        pointsCount() {
          return 1
        }
        name() {
          return 'Table'
        }
        isFixed() {
          return this._properties.childs().anchored.value()
        }
        anchorable() {
          return !0
        }
        properties() {
          return this._properties
        }
        template() {
          return this._properties.template()
        }
        snapTo45DegreesAvailable() {
          return !1
        }
        getPoint(e) {
          const t = this._topLeftPoint()
          if (e === O.TopLeft) return t
          const i = this.pointToScreenPoint(t)
          let o = null
          if (i) {
            const e = this.columnWidths(),
              t = this.rowHeights(),
              r = i.add((0, n.point)((0, Pe.sum)(e), (0, Pe.sum)(t)))
            o = this.screenPointToPoint(r)
          }
          if (!o) return null
          switch (e) {
            case O.TopRight:
              return { ...t, index: o.index }
            case O.BottomRight:
              return { ...o }
            case O.BottomLeft:
              return { ...t, price: o.price }
          }
          return null
        }
        inplaceEditableCellIndexes() {
          return this._inplaceEditCellIndexes
        }
        setInplaceEditableCellIndexes(e, t = !1) {
          const [i, o] = this._inplaceEditCellIndexes,
            [n, r] = e
          if (!t && i === n && o === r) return
          this._destroyEditableTextSubscriptions?.()
          const l = this.properties().childs().editableText,
            s = {}
          if (-1 !== n && -1 !== r) {
            const e = this.properties().childs().cells.childs()[n].childs()[r]
            l.setValue(e.value()),
              l.subscribe(s, () => e.setValue(l.value())),
              e.subscribe(s, () => l.setValue(e.value())),
              (this._destroyEditableTextSubscriptions = () => {
                l.unsubscribeAll(s), e.unsubscribeAll(s)
              })
          }
          ;(this._inplaceEditCellIndexes = [n, r]),
            this._editableText.setValue(l.value()),
            this.updateAllViews((0, Se.sourceChangeEvent)(this.id())),
            this._model.updateSource(this)
        }
        switchActiveCell(e = !1) {
          let [t, i] = this._inplaceEditCellIndexes
          if (-1 === t && -1 === i) return !1
          const { colsCount: o, rowsCount: n } = this.properties().state(),
            r = o * n,
            l = (t * o + i + (e ? r - 1 : 1)) % r
          return (
            (t = Math.floor(l / o) % n),
            (i = l % o),
            this._saveEditedText(),
            this.setInplaceEditableCellIndexes([t, i], !0),
            !0
          )
        }
        insertCells(e, t) {
          const i = this.properties().state()
          let { rowsCount: o, colsCount: n } = i
          const r = this.properties().cellsValues(),
            l = this.properties().columnWidthValues(),
            s = this.properties().rowHeightValues()
          let [a, c] = t ?? this._inplaceEditCellIndexes,
            h = !1
          switch (
            (-1 === a && -1 === c && ((h = !0), (a = o - 1), (c = n - 1)), e)
          ) {
            case 0:
              const e = a + 1,
                t = new Array(n).fill('')
              e >= o ? r.push(t) : r.splice(e, 0, t), s.splice(e, 0, 0), o++
              break
            case 1:
              const i = c + 1
              for (const e of r) e.splice(i, 0, '')
              l.splice(i, 0, 120), n++
          }
          this._properties.recreateCellsPropsByState({
            rowsCount: o,
            colsCount: n,
            columnWidths: l,
            rowHeights: s,
            cells: r,
          }),
            this.setInplaceEditableCellIndexes(h ? [-1, -1] : [a, c], !0)
        }
        isRemoveCellsAvailable(e) {
          const t = this._properties.cellsValues()
          return (0 !== e || 1 !== t.length) && (1 !== e || 1 !== t[0].length)
        }
        removeCells(e, t) {
          const [i, o] = t ?? this._inplaceEditCellIndexes
          if (-1 === i && -1 === o) return
          let { rowsCount: n, colsCount: r } = this.properties().state()
          const l = this.properties().cellsValues(),
            s = this.properties().columnWidthValues(),
            a = this.properties().rowHeightValues()
          switch (e) {
            case 0:
              l.splice(i, 1), a.splice(i, 1), n--
              break
            case 1:
              for (const e of l) e.splice(o, 1)
              s.splice(o, 1), r--
          }
          this._properties.recreateCellsPropsByState({
            rowsCount: n,
            colsCount: r,
            columnWidths: s,
            rowHeights: a,
            cells: l,
          })
          const c = Math.min(i, n - 1),
            h = Math.min(o, r - 1)
          this.setInplaceEditableCellIndexes([c, h], !0)
        }
        async additionalActions(e, t = 'Default') {
          let o = []
          return (
            'Default' === t &&
              (o = (
                await Promise.all([i.e(1629), i.e(620)]).then(i.bind(i, 99758))
              ).tableActions(this, e)),
            { actions: o, placement: 'BeforeAll' }
          )
        }
        editableTextProperties() {
          return {
            text: this.properties().childs().editableText,
            textColor: this.properties().childs().textColor,
          }
        }
        cellText(e, t) {
          return this.properties()
            .childs()
            .cells.childs()
            [e].childs()
            [t].value()
        }
        changePointUndoText(e) {
          const { row: t, column: i } = oe(e)
          return null === t && null === i
            ? s.changePointUndoText
            : null === t
              ? ke
              : null === i
                ? Be
                : Fe
        }
        startChanging(e, t) {
          this.isFixed() && this.restoreFixedPoint()
          const [i, n] = this.columnWidths(!0),
            [r, l] = this.rowHeights(!0),
            s = (0, Pe.sum)(i),
            a = (0, Pe.sum)(r),
            c = (0, Pe.sum)(l)
          e ??= O.TopLeft
          const h = this._topLeftPoint(),
            d = (0, o.ensureNotNull)(this.priceScale()),
            u = (0, o.ensure)(this.ownerSource()?.firstValue()),
            p = d.priceToCoordinate(h.price, u),
            m = d.coordinateToPrice(p + a, u),
            g = this._model.timeScale().indexToCoordinate(h.index),
            x = this._model.timeScale().coordinateToFloatIndex(g + s)
          switch (e) {
            case O.BottomLeft:
              t = { index: h.index, price: m }
              break
            case O.TopRight:
              t = { index: x, price: h.price }
              break
            case O.BottomRight:
              t = { index: x, price: m }
              break
            default:
              t = { ...h }
          }
          ;(this._widthsSnapshot = {
            columnWidths: i,
            columnMinWidths: n,
            rowHeights: r,
            rowMinHeights: l,
            minTotalHeight: c,
            totalWidth: s,
            totalHeight: a,
            startPoint: { ...t },
            topLeftPoint: h,
          }),
            super.startChanging(e, t)
        }
        setPoint(e, t, i, r) {
          const l = this._model.timeScale(),
            s = (0, o.ensureNotNull)(this.priceScale()),
            a = (0, o.ensure)(this.ownerSource()?.firstValue()),
            c = this._model.mainSeries().interval(),
            h = (0, o.ensureNotNull)(this._widthsSnapshot),
            d = (0, o.ensureNotNull)(this.pointToScreenPoint(h.startPoint))
          let u = (0, o.ensureNotNull)(this.pointToScreenPoint(t))
          const {
              totalWidth: p,
              totalHeight: m,
              columnWidths: g,
              columnMinWidths: x,
              rowHeights: f,
              rowMinHeights: _,
            } = h,
            T = this._topLeftPoint(),
            b = (0, o.ensureNotNull)(this.pointToScreenPoint(T)),
            C = e === O.TopLeft || e === O.BottomLeft,
            v = e === O.TopLeft || e === O.TopRight,
            y = d.add((0, n.point)(C ? p : -p, v ? m : -m)),
            w = I(this._tableTextCache)
          let { x: D, y: A } = u
          if (!r) {
            const e = w * h.columnWidths.length,
              t = h.minTotalHeight
            ;(D = C ? Math.min(u.x, y.x - e) : Math.max(u.x, y.x + e)),
              (A = v ? Math.min(u.y, y.y - t) : Math.max(u.y, y.y + t)),
              (u = (0, n.point)(D, A))
          }
          const R = this.isFixed(),
            H =
              C && !R
                ? Math.floor(l.coordinateToFloatIndex(D))
                : l.coordinateToFloatIndex(D)
          D = l.indexToCoordinate(H)
          const W = s.coordinateToPrice(A, a),
            E = d.x - D,
            z = d.y - A
          switch (e) {
            case O.TopLeft:
              R
                ? this.addFixedPoint(u)
                : this._setPoint(0, { ...t, price: W, index: H, interval: c }),
                r ||
                  (this._properties.setColumnWidthValues(
                    this._correctColumnWidths(Ne(g, x, p + E), h),
                  ),
                  this._properties.setRowHeightValues(Ne(f, _, m + z)))
              break
            case O.BottomLeft:
              R
                ? this.addFixedPoint((0, n.point)(u.x, b.y))
                : this._setPoint(0, {
                    ...t,
                    index: H,
                    price: T.price,
                    interval: c,
                  }),
                r ||
                  (this._properties.setColumnWidthValues(
                    this._correctColumnWidths(Ne(g, x, p + E), h),
                  ),
                  this._properties.setRowHeightValues(Ne(f, _, m - z)))
              break
            case O.TopRight:
              R
                ? this.addFixedPoint((0, n.point)(b.x, u.y))
                : this._setPoint(0, {
                    ...t,
                    price: W,
                    index: T.index,
                    interval: c,
                  }),
                r ||
                  (this._properties.setColumnWidthValues(Ne(g, x, p - E)),
                  this._properties.setRowHeightValues(Ne(f, _, m + z)))
              break
            case O.BottomRight:
              r ||
                (this._properties.setColumnWidthValues(Ne(g, x, p - E)),
                this._properties.setRowHeightValues(Ne(f, _, m - z)))
          }
          if (e >= O.ResizeVirtualAnchorBase) {
            const { column: t, row: i } = oe(e)
            if (null !== t) {
              const e = (0, Pe.sum)(g.slice(0, t)) + b.x,
                i = Math.max(w, u.x - e),
                o = g.map((e, o) => (o === t ? i : e))
              this._properties.setColumnWidthValues(o)
            }
            if (null !== i) {
              const e = (0, Pe.sum)(f.slice(0, i)) + b.y
              let t = V(this._tableTextCache)
              for (let e = 0; e < g.length; e++)
                t = Math.max(
                  t,
                  S(
                    this.cellText(i, e),
                    P(g[e], this._tableTextCache),
                    this._tableTextCache,
                  ),
                )
              const o = Math.max(t, u.y - e),
                n = f.map((e, t) => (t === i ? o : e))
              this._properties.setRowHeightValues(n)
            }
          } else;
        }
        columnWidths(e) {
          const t = this._properties.columnWidthValues()
          if (!e) return t
          const i = I(this._tableTextCache),
            o = t.map((e) => i)
          return [t, o]
        }
        rowHeights(e) {
          const t = this.properties().rowHeightValues(),
            i = this.columnWidths(),
            o = [],
            n = t.map((t, n) => {
              let r = V(this._tableTextCache),
                l = Math.max(t, r)
              for (
                let e = 0;
                e < this.properties().childs().colsCount.value();
                e++
              ) {
                const t = S(
                  this.cellText(n, e),
                  P(i[e], this._tableTextCache),
                  this._tableTextCache,
                )
                ;(l = Math.max(l, t)), (r = Math.max(r, t))
              }
              return e && o.push(r), l
            })
          return e ? [n, o] : n
        }
        endChanging(e, t, i) {
          return (this._widthsSnapshot = null), super.endChanging(e, t, i)
        }
        async onContextMenu(e) {
          null === this._contextMenu &&
            (this._contextMenu = Promise.all([i.e(1629), i.e(620)])
              .then(i.bind(i, 91218))
              .then((t) =>
                t.showTableContextMenu(
                  this,
                  () => {
                    this._contextMenu = null
                  },
                  e,
                ),
              ))
        }
        insertCellsUndoCommand(e) {
          return new Le(this.model(), this, e)
        }
        removeCellsUndoCommand(e) {
          return this.isRemoveCellsAvailable(e)
            ? new Me(this.model(), this, e)
            : null
        }
        static createProperties(e, t) {
          const i = F.create(e, t)
          return this._configureProperties(i), i
        }
        _changeEditableTextUndoCommand(e, t) {
          return new Ie(
            this._model,
            this,
            e,
            t,
            (0, o.ensureNotNull)(this._inplaceEditCellIndexes),
          )
        }
        async _getPropertyDefinitionsViewModelClass() {
          return we
        }
        _createDataSourceBackgroundColorWV() {
          return (0, l.convertPropertyToWatchedValue)(
            this.properties().childs().backgroundColor,
          ).ownership()
        }
        static _addCollectedProperties(e) {}
        _topLeftPoint() {
          return this.isFixed()
            ? (0, o.ensureNotNull)(
                this.screenPointToPoint(
                  (0, o.ensureDefined)(this._fixedPoint),
                  !0,
                ),
              )
            : this._points[0]
        }
        _correctColumnWidths(e, t) {
          const i = (
              this._tablePaneView?.lastRenderingInfo() ?? Ve.dpr1PixelRatioInfo
            ).horizontalPixelRatio,
            n = (0, o.ensureNotNull)(this.pointToScreenPoint(t.topLeftPoint)).x,
            [, r] = D(n, t.columnWidths, t.columnMinWidths.length - 1, i),
            l = (0, o.ensureNotNull)(
              this.pointToScreenPoint(this._topLeftPoint()),
            ).x,
            s = (0, Pe.sum)(e),
            a = r / i - l
          return (e[e.length - 1] += a - s), e
        }
      }
    },
    62689: (e, t, i) => {
      i.d(t, { LineToolTextRenderer: () => n })
      var o = i(17330)
      class n extends o.TextRenderer {
        getTextInfo() {
          const e = this._getInternalData(),
            t = this.fontStyle(),
            i = this._getFontInfo()
          return {
            ...e,
            lineHeight: this.lineHeight(),
            lineSpacing: this.lineSpacing(),
            font: t,
            fontSize: i.fontSize,
            centerRotation: this.centerTextRotation() ?? void 0,
          }
        }
        setCursorType(e) {
          this._hitTest.data()?.cursorType !== e &&
            this._hitTest.mergeData({ cursorType: e })
        }
      }
    },
    11402: (e, t, i) => {
      i.d(t, {
        factoryDefaultsForCurrentTheme: () => a,
      })
      var o = i(16738),
        n = i(90054),
        r = i(50151),
        l = i(45345),
        s = i(24633)
      function a(e, t) {
        const i = l.watchedTheme.value() ?? s.StdTheme.Light,
          a = (0, n.default)(e)
        return (0, o.default)(a, (0, r.ensureDefined)(t.get(i))), a
      }
    },
  },
])
