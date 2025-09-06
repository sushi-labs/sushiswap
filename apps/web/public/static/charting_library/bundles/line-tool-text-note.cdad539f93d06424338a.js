;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9123],
  {
    73174: (e, t, i) => {
      i.r(t),
        i.d(t, {
          getCoordinateXMetaInfo: () => b,
          getCoordinateYMetaInfo: () => v,
          getCoordinatesPropertiesDefinitions: () => T,
          getSelectionCoordinatesPropertyDefinition: () => _,
        })
      var o = i(50151),
        r = i(11542),
        n = i(45126),
        l = i(44672),
        a = i(60265)
      class s extends a.UndoCommand {
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
      var d = i(32097),
        c = i(64147),
        h = i(12988),
        u = i(91682)
      const g = -5e4,
        p = 15e3,
        f = new n.TranslatedString(
          'change price Y coordinate',
          r.t(null, void 0, i(11737)),
        ),
        m = new n.TranslatedString(
          'change bar X coordinate',
          r.t(null, void 0, i(2066)),
        ),
        x = new n.TranslatedString('move drawings', r.t(null, void 0, i(76261)))
      function v(e, t, i) {
        return {
          property: (0, d.convertToDefinitionProperty)(e, t.price, f),
          info: { typeY: 1, stepY: i },
        }
      }
      function b(e, t) {
        return {
          property: (0, d.convertToDefinitionProperty)(e, t.bar, m),
          info: {
            typeX: 0,
            minX: new c.WatchedValue(g),
            maxX: new c.WatchedValue(p),
            stepX: new c.WatchedValue(1),
          },
        }
      }
      function T(e, t, i, o, r, n) {
        const l = b(e, t),
          a = v(e, t, o)
        return (0, d.createCoordinatesPropertyDefinition)(
          { x: l.property, y: a.property },
          {
            id: (0, u.removeSpaces)(`${n}Coordinates${r}`),
            title: r,
            ...l.info,
            ...a.info,
          },
        )
      }
      const C = /^([+*\-\/]?)((?:\d*)|(?:\d+\.\d*))$/
      function y(e, t, i) {
        const r = new h.Property(''),
          n = (0, d.makeProxyDefinitionProperty)(r.weakReference())
        return (
          (n.setValue = (n) => {
            try {
              const r = n.match(C)
              if (!r) return
              const [, l, a] = r
              if (!a.length) return
              const d = i(Number.parseFloat(a))
              if ('/' === l && (0 === d.price || 0 === d.index)) return
              t.withMacro(x, () => {
                e.filter((e) => !e.isSourceHidden()).forEach((e) => {
                  const i = e.points()
                  let r
                  switch (l) {
                    case '': {
                      const e = (0, o.ensureDefined)(i[0])
                      let { index: t = e.index, price: n = e.price } = d
                      ;(n -= e.price),
                        (t -= e.index),
                        (r = i.map((e) => ({
                          ...e,
                          index: e.index + t,
                          price: e.price + n,
                        })))
                      break
                    }
                    case '-':
                    case '+': {
                      let { index: e = 0, price: t = 0 } = d
                      '-' === l && ((e *= -1), (t *= -1)),
                        (r = i.map((i) => ({
                          ...i,
                          index: i.index + e,
                          price: i.price + t,
                        })))
                      break
                    }
                    case '*': {
                      const { index: e = 1, price: t = 1 } = d
                      r = i.map((i) => ({
                        ...i,
                        index: i.index * e,
                        price: i.price * t,
                      }))
                      break
                    }
                    case '/': {
                      const { index: e = 1, price: t = 1 } = d
                      r = i.map((i) => ({
                        ...i,
                        index: i.index / e,
                        price: i.price / t,
                      }))
                      break
                    }
                  }
                  t.undoHistory().pushUndoCommand(
                    new s({
                      lineToolId: e.id(),
                      chartModel: t.model(),
                      newPositionPoints: r,
                    }),
                  )
                })
              })
            } finally {
              r.setValue('', !0)
            }
          }),
          n
        )
      }
      function _(e, t) {
        const o = y(e, t, (e) => ({ index: e })),
          n = y(e, t, (e) => ({ price: e }))
        return (0, d.createSelectionCoordinatesPropertyDefinition)(
          { x: o, y: n },
          {
            id: 'SourcesCoordinates',
            title: r.t(null, void 0, i(44272)),
            mathOperationsX: '+',
            mathOperationsY: '+/*',
            modeX: 'integer',
            modeY: 'float',
          },
        )
      }
    },
    91335: (e, t, i) => {
      i.d(t, { createTextStyleDefinition: () => S })
      var o = i(11542),
        r = i(45126),
        n = i(32097),
        l = i(91682)
      const a = new r.TranslatedString(
          'change {toolName} text visibility',
          o.t(null, void 0, i(56634)),
        ),
        s = new r.TranslatedString(
          'change {toolName} text color',
          o.t(null, void 0, i(64500)),
        ),
        d = new r.TranslatedString(
          'change {toolName} text font size',
          o.t(null, void 0, i(21781)),
        ),
        c = new r.TranslatedString(
          'change {toolName} text font bold',
          o.t(null, void 0, i(24701)),
        ),
        h = new r.TranslatedString(
          'change {toolName} text font italic',
          o.t(null, void 0, i(42694)),
        ),
        u = new r.TranslatedString(
          'change {toolName} text',
          o.t(null, void 0, i(66668)),
        ),
        g = new r.TranslatedString(
          'change {toolName} labels alignment vertical',
          o.t(null, void 0, i(31689)),
        ),
        p = new r.TranslatedString(
          'change {toolName} labels alignment horizontal',
          o.t(null, void 0, i(88277)),
        ),
        f = new r.TranslatedString(
          'change {toolName} labels direction',
          o.t(null, void 0, i(61160)),
        ),
        m = new r.TranslatedString(
          'change {toolName} text background visibility',
          o.t(null, void 0, i(31133)),
        ),
        x = new r.TranslatedString(
          'change {toolName} text background color',
          o.t(null, void 0, i(22231)),
        ),
        v = new r.TranslatedString(
          'change {toolName} text border visibility',
          o.t(null, void 0, i(58704)),
        ),
        b = new r.TranslatedString(
          'change {toolName} text border width',
          o.t(null, void 0, i(35423)),
        ),
        T = new r.TranslatedString(
          'change {toolName} text border color',
          o.t(null, void 0, i(36666)),
        ),
        C = new r.TranslatedString(
          'change {toolName} text wrap',
          o.t(null, void 0, i(39587)),
        ),
        y = o.t(null, void 0, i(79468)),
        _ = o.t(null, void 0, i(38408)),
        w = o.t(null, void 0, i(7560))
      function S(e, t, i, o) {
        const r = {},
          S = {
            id: `${(0, l.removeSpaces)(i.originalText())}Text`,
            title: (o.customTitles && o.customTitles.text) || '',
          }
        if (
          (void 0 !== t.showText &&
            (r.checked = (0, n.convertToDefinitionProperty)(
              e,
              t.showText,
              a.format({ toolName: i }),
            )),
          void 0 !== t.textColor &&
            (r.color = (0, n.getColorDefinitionProperty)(
              e,
              t.textColor,
              t.transparency || null,
              s.format({ toolName: i }),
            )),
          void 0 !== t.fontSize &&
            (r.size = (0, n.convertToDefinitionProperty)(
              e,
              t.fontSize,
              d.format({ toolName: i }),
            )),
          void 0 !== t.bold &&
            (r.bold = (0, n.convertToDefinitionProperty)(
              e,
              t.bold,
              c.format({ toolName: i }),
            )),
          void 0 !== t.italic &&
            (r.italic = (0, n.convertToDefinitionProperty)(
              e,
              t.italic,
              h.format({ toolName: i }),
            )),
          void 0 !== t.text &&
            ((r.text = (0, n.convertToDefinitionProperty)(
              e,
              t.text,
              u.format({ toolName: i }),
            )),
            (S.isEditable = Boolean(o.isEditable)),
            (S.isMultiLine = Boolean(o.isMultiLine))),
          void 0 !== t.vertLabelsAlign &&
            ((r.alignmentVertical = (0, n.convertToDefinitionProperty)(
              e,
              t.vertLabelsAlign,
              g.format({ toolName: i }),
            )),
            (S.alignmentVerticalItems = o.alignmentVerticalItems)),
          void 0 !== t.horzLabelsAlign &&
            ((r.alignmentHorizontal = (0, n.convertToDefinitionProperty)(
              e,
              t.horzLabelsAlign,
              p.format({ toolName: i }),
            )),
            (S.alignmentHorizontalItems = o.alignmentHorizontalItems)),
          void 0 !== t.textOrientation &&
            (r.orientation = (0, n.convertToDefinitionProperty)(
              e,
              t.textOrientation,
              f.format({ toolName: i }),
            )),
          void 0 !== t.backgroundVisible &&
            (r.backgroundVisible = (0, n.convertToDefinitionProperty)(
              e,
              t.backgroundVisible,
              m.format({ toolName: i }),
            )),
          void 0 !== t.backgroundColor)
        ) {
          let o = null
          void 0 !== t.backgroundTransparency && (o = t.backgroundTransparency),
            (r.backgroundColor = (0, n.getColorDefinitionProperty)(
              e,
              t.backgroundColor,
              o,
              x.format({ toolName: i }),
            ))
        }
        return (
          (void 0 === t.backgroundVisible && void 0 === t.backgroundColor) ||
            (S.backgroundTitle =
              (o.customTitles && o.customTitles.backgroundTitle) || y),
          void 0 !== t.borderVisible &&
            (r.borderVisible = (0, n.convertToDefinitionProperty)(
              e,
              t.borderVisible,
              v.format({ toolName: i }),
            )),
          void 0 !== t.borderWidth &&
            (r.borderWidth = (0, n.convertToDefinitionProperty)(
              e,
              t.borderWidth,
              b.format({ toolName: i }),
            )),
          void 0 !== t.borderColor &&
            (r.borderColor = (0, n.getColorDefinitionProperty)(
              e,
              t.borderColor,
              null,
              T.format({ toolName: i }),
            )),
          (void 0 === t.borderVisible &&
            void 0 === t.borderColor &&
            void 0 === t.borderWidth) ||
            (S.borderTitle =
              (o.customTitles && o.customTitles.borderTitle) || _),
          void 0 !== t.wrap &&
            ((r.wrap = (0, n.convertToDefinitionProperty)(
              e,
              t.wrap,
              C.format({ toolName: i }),
            )),
            (S.wrapTitle = (o.customTitles && o.customTitles.wrapTitle) || w)),
          (0, n.createTextPropertyDefinition)(r, S)
        )
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
      var r, n, l
      !((e) => {
        ;(e[(e.NotShared = 0)] = 'NotShared'),
          (e[(e.SharedInLayout = 1)] = 'SharedInLayout'),
          (e[(e.GloballyShared = 2)] = 'GloballyShared')
      })(r || (r = {})),
        ((e) => {
          ;(e.BeforeAllAction = 'BeforeAll'), (e.CustomAction = 'CustomAction')
        })(n || (n = {})),
        ((e) => {
          ;(e.FloatingToolbarButton = 'FloatingToolbarButton'),
            (e.Default = 'Default')
        })(l || (l = {}))
    },
    38039: (e, t, i) => {
      i.d(t, { LineDataSourceProperty: () => a })
      var o = i(90054),
        r = i(16738),
        n = i(50151),
        l = i(32679)
      class a extends l.DefaultProperty {
        constructor({ templateKeys: e, ...t }) {
          super({
            ignoreAllowSavingDefaults: !0,
            saveNonDefaultUserPreferencesOnly: !0,
            ...t,
          }),
            (this._templateKeys = (0, n.ensureDefined)(
              e || this._allDefaultsKeys,
            ))
        }
        template() {
          return (0, l.extractState)(this.state(), this._templateKeys, [])
        }
        applyTemplate(e) {
          this.mergeAndFire(
            (0, l.extractState)(
              (0, r.default)(
                (0, o.default)(this._factoryDefaultsSupplier()),
                e,
              ),
              this._templateKeys,
            ),
          )
        }
      }
    },
    31761: (e, t, i) => {
      i.d(t, { alignByAngle: () => r })
      var o = i(30699)
      function r(e) {
        let t, i
        return (
          e >= -135 && e <= -45
            ? ((t = o.HorizontalAlign.Center), (i = o.VerticalAlign.Bottom))
            : e > -45 && e < 45
              ? ((t = o.HorizontalAlign.Left), (i = o.VerticalAlign.Middle))
              : e >= 45 && e <= 135
                ? ((t = o.HorizontalAlign.Center), (i = o.VerticalAlign.Top))
                : ((t = o.HorizontalAlign.Right), (i = o.VerticalAlign.Middle)),
          { horzAlign: t, vertAlign: i }
        )
      }
    },
    46902: (e, t, i) => {
      i.r(t), i.d(t, { LineToolTextNote: () => ce })
      var o = i(42752),
        r = i(50151),
        n = i(24633),
        l = i(49156),
        a = i(31229),
        s = i(6590),
        d = i(32679),
        c = i(11402),
        h = i(38039),
        u = i(73305)
      const g = {
          intervalsVisibilities: { ...a.intervalsVisibilitiesDefaults },
          drawBackground: !0,
          drawBorder: !1,
          fontSize: 14,
          bold: !1,
          italic: !1,
        },
        p = new Map([
          [
            n.StdTheme.Light,
            {
              lineColor: l.colors.colorColdGray900,
              backgroundColor: l.colors.colorWhite,
              borderColor: l.colors.colorColdGray150,
              textColor: l.colors.colorColdGray900,
            },
          ],
          [
            n.StdTheme.Dark,
            {
              lineColor: l.colors.colorColdGray200,
              backgroundColor: l.colors.colorColdGray800,
              borderColor: l.colors.colorColdGray700,
              textColor: l.colors.colorColdGray200,
            },
          ],
        ]),
        f = (0, d.extractThemedColors)(
          (0, r.ensureDefined)(p.get(n.StdTheme.Light)),
          (0, r.ensureDefined)(p.get(n.StdTheme.Dark)),
        ),
        m = (0, d.extractAllPropertiesKeys)(
          (0, r.ensureDefined)(p.get(n.StdTheme.Light)),
        ),
        x = (0, d.extractAllPropertiesKeys)(g),
        v = [
          ...new Set([
            ...m,
            ...x,
            ...s.commonLineToolPropertiesStateKeys,
            'text',
          ]),
        ],
        b = [...new Set([...m, ...x, 'text'])]
      class T extends h.LineDataSourceProperty {
        constructor(e) {
          super(e),
            this.hasChild('text') || this.addProperty('text', ''),
            this.addChild(
              'linesColors',
              new u.LineToolColorsProperty([
                (0, r.ensureDefined)(this.child('lineColor')),
              ]),
            ),
            this.addChild(
              'backgroundsColors',
              new u.LineToolColorsProperty([
                (0, r.ensureDefined)(this.child('backgroundColor')),
              ]),
            ),
            this.addChild(
              'textsColors',
              new u.LineToolColorsProperty([
                (0, r.ensureDefined)(this.child('textColor')),
              ]),
            )
        }
        static create(e, t) {
          return new this({
            defaultName: 'linetooltextnote',
            factoryDefaultsSupplier: () =>
              (0, c.factoryDefaultsForCurrentTheme)(g, p),
            nonThemedDefaultsKeys: x,
            themedDefaultsKeys: m,
            allStateKeys: v,
            themedColors: f,
            templateKeys: b,
            replaceThemedColorsOnThemeChange: !0,
            state: t,
            theme: e,
          })
        }
      }
      var C,
        y,
        _ = i(24362),
        w = i(19625),
        S = i(95201),
        D = i(36036),
        P = i(32211),
        k = i(86441),
        A = i(34026),
        V = i(4652),
        L = i(63273),
        R = i(30125),
        N = i(56468),
        M = i(37743),
        I = i(61993),
        z = i(17330),
        H = i(30699),
        B = i(15938),
        F = i(70262),
        W = i(31761)
      !((e) => {
        e[(e.Label = 1)] = 'Label'
      })(C || (C = {})),
        ((e) => {
          ;(e[(e.CircleRadius = 2)] = 'CircleRadius'),
            (e[(e.RoundRectRadius = 4)] = 'RoundRectRadius'),
            (e[(e.LabelVertPadding = 6)] = 'LabelVertPadding'),
            (e[(e.LabelHorzPadding = 8)] = 'LabelHorzPadding'),
            (e[(e.TextMargins = 2)] = 'TextMargins'),
            (e[(e.Blur = 4)] = 'Blur'),
            (e[(e.ShadowOffsetY = 2)] = 'ShadowOffsetY')
        })(y || (y = {}))
      class O extends R.BitmapCoordinatesPaneRenderer {
        constructor(e) {
          super(),
            (this._data = null),
            (this._textLabelRenderer = new z.TextRenderer()),
            (this._textInfoCache = null),
            (this._lineHitTest = new N.HitTestResult(N.HitTarget.MovePoint)),
            (this._textHitTest =
              e ||
              new N.HitTestResult(N.HitTarget.MovePoint, {
                areaName: N.AreaName.Text,
              })),
            this._textHitTest.mergeData({ activeItem: C.Label })
        }
        setData(e) {
          null === this._data ||
            (this._data.textData.text === e.textData.text &&
              this._data.textData.fontSize === e.textData.fontSize) ||
            (this._textInfoCache = null),
            (this._data = e)
          const t = e.points[1]
          this._textLabelRenderer.setData({
            horzAlign: H.HorizontalAlign.Left,
            vertAlign: H.VerticalAlign.Middle,
            points: [t],
            text: e.textData.text || ' ',
            color: e.textData.color,
            font: B.CHART_FONT_FAMILY,
            fontSize: e.textData.fontSize,
            bold: e.textData.bold,
            italic: e.textData.italic,
            offsetX: 0,
            offsetY: 0,
            borderColor: e.drawBorder ? e.borderColor : void 0,
            borderWidth: 1,
            backgroundColor: e.drawBackground ? e.backgroundColor : void 0,
            backgroundRoundRect: y.RoundRectRadius,
            boxPaddingVert: y.LabelVertPadding,
            boxPaddingHorz: y.LabelHorzPadding,
            boxShadow:
              e.drawBorder || e.drawBackground
                ? {
                    shadowColor: e.shadowColor,
                    shadowBlur: y.Blur,
                    shadowOffsetY: y.ShadowOffsetY,
                  }
                : void 0,
            selectionHighlight: e.textData.selectionHighlight,
          })
          const i = this._textLabelRenderer.rect(),
            o = e.points[0],
            r = e.points[1],
            n = Math.round((180 * Math.atan2(r.y - o.y, r.x - o.x)) / Math.PI),
            l = (0, W.alignByAngle)(n)
          let a = e.points[1]
          switch (l.horzAlign) {
            case H.HorizontalAlign.Center:
              a = a.add((0, k.point)(0.5 * -i.width, 0))
              break
            case H.HorizontalAlign.Right:
              a = a.add((0, k.point)(-i.width, 0))
          }
          switch (l.vertAlign) {
            case H.VerticalAlign.Top:
              a = a.add((0, k.point)(0, 0.5 * i.height))
              break
            case H.VerticalAlign.Bottom:
              a = a.add((0, k.point)(0, 0.5 * -i.height))
          }
          this._textLabelRenderer.setPoint(a)
        }
        setCursorType(e) {
          this._textHitTest.mergeData({ cursorType: e })
        }
        hitTest(e) {
          const t = this._data
          if (null === t || t.points.length < 2) return null
          const i = (0, I.interactionTolerance)().line + 0.5,
            o = t.points[0],
            r = t.points[1]
          if ((0, V.distanceToSegment)(o, r, e).distance <= i)
            return this._lineHitTest
          const n = this._textLabelRenderer.rect(),
            l = (0, k.box)(
              (0, k.point)(n.x, n.y),
              (0, k.point)(n.x + n.width, n.y + n.height),
            )
          return (0, A.pointInBox)(e, l) ? this._textHitTest : null
        }
        getTextInfo() {
          const e = (0, r.ensureNotNull)(this._data),
            t = (0, L.isRtl)() ? 'right' : 'left',
            i = y.RoundRectRadius,
            o = y.TextMargins,
            n = (0, r.ensureNotNull)(this._calcTextSize()),
            l = this._textLabelRenderer.rect(),
            a = (0, r.ensureDefined)(
              this._textLabelRenderer.data()?.points?.[0],
            ).add((0, k.point)(0, 0.5 * -l.height)),
            { totalWidth: s, totalHeight: d } = n,
            c = i + o
          return {
            font: B.CHART_FONT_FAMILY,
            fontSize: e.textData.fontSize,
            lineHeight: Math.ceil(e.textData.fontSize),
            lineSpacing: 0,
            textTop: a.y + c,
            textBottom: a.y + d - c,
            textLeft: a.x + c,
            textRight: a.x + s - c,
            textAlign: t,
          }
        }
        positionToCoordinate(e, t) {
          const i = (0, r.ensureNotNull)(this._data),
            o = this.getTextInfo(),
            n = this._textLabelRenderer.getLinesInfo(),
            {
              x: l,
              y: a,
              lineNumber: s,
            } = (0, F.getSymbolCoordinatesInfo)({
              symbolPosition: t,
              textWidth: o.textRight - o.textLeft,
              textByLines: n.linesIncludingHidden,
              lineHeight: i.textData.fontSize,
              font: B.CHART_FONT_FAMILY,
              textAlign: o.textAlign,
            })
          return { x: l + o.textLeft, y: a + o.textTop, lineNumber: s }
        }
        _drawImpl(e) {
          const t = this._data
          if (null === t || t.points.length < 2) return
          const { context: i } = e,
            o = t.points[0],
            r = t.points[1]
          ;(i.strokeStyle = t.lineColor),
            (i.lineWidth = Math.max(1, Math.floor(e.horizontalPixelRatio))),
            i.beginPath()
          const [n, l] = (0, M.addPixelPerfectLineToPath)(
            i,
            o.x,
            o.y,
            r.x,
            r.y,
            e,
          )
          i.stroke()
          const a = Math.round(y.CircleRadius * e.horizontalPixelRatio)
          ;(i.fillStyle = t.lineColor),
            i.beginPath(),
            i.arc(n, l, a, 0, 2 * Math.PI, !1),
            i.fill(),
            i.beginPath(),
            (i.strokeStyle = t.circleBorderColor),
            (i.lineWidth = 1)
          const s = Math.round(
            y.CircleRadius * e.horizontalPixelRatio +
              0.5 * e.horizontalPixelRatio,
          )
          i.arc(n, l, s, 0, 2 * Math.PI, !1),
            i.stroke(),
            this._textLabelRenderer.draw(i, e)
        }
        _calcTextSize() {
          if (null === this._data || this._data.points.length < 2) return null
          if (null === this._textInfoCache) {
            const e = this._textLabelRenderer.getLinesInfo(),
              t = this._data.textData.fontSize * e.lines.length,
              i = e.linesMaxWidth,
              o = y.RoundRectRadius,
              r = 2 * y.TextMargins + 2 * o
            this._textInfoCache = {
              textWidth: i,
              textHeight: t,
              totalWidth: i + r,
              totalHeight: t + r,
            }
          }
          return this._textInfoCache
        }
      }
      var E = i(19063)
      const Y = (0, E.generateColor)(
          (0, w.getHexColorByName)('color-black'),
          80,
        ),
        K = (0, E.generateColor)((0, w.getHexColorByName)('color-black'), 60)
      class G extends P.InplaceTextLineSourcePaneView {
        constructor(e, t, i, o, r) {
          super(e, t, i, o, r),
            (this._renderer = new S.CompositeRenderer()),
            (this._noteRenderer = new O(
              new N.HitTestResult(
                N.HitTarget.MovePoint,
                (0, P.inplaceEditHandlers)(
                  this._tryActivateEditMode.bind(this, null),
                ),
              ),
            )),
            this._source.setAdditionalCursorData(
              () => ({
                color: this._source.editableTextStyle().cursorColor,
                ...this._noteRenderer.getTextInfo(),
              }),
              this._noteRenderer.positionToCoordinate.bind(
                this._noteRenderer,
                !0,
              ),
            )
        }
        renderer(e) {
          return this._invalidated && this._updateImpl(e), this._renderer
        }
        _updateImpl(e) {
          super._updateImpl(e), this._renderer.clear()
          const t = this._source.priceScale()
          if (!t || t.isEmpty()) return
          const i = this._points
          if (i.length < 2) return
          if (
            null ===
            (0, r.ensureNotNull)(this._source.ownerSource()).firstValue()
          )
            return
          const o = this._source.properties().childs(),
            n = this._model.dark().value()
              ? l.colors.colorColdGray850
              : l.colors.colorWhite,
            a = this._model.dark().value() ? K : Y,
            s = {
              textData: {
                fontSize: o.fontSize.value(),
                text: this._textData(),
                color: this._textColor(),
                bold: o.bold.value(),
                italic: o.italic.value(),
                selectionHighlight:
                  this._inplaceTextHighlight().selectionHighlight,
              },
              shadowColor: a,
              points: i,
              lineColor: o.lineColor.value(),
              drawBackground: o.drawBackground.value(),
              drawBorder: o.drawBorder.value(),
              backgroundColor: o.backgroundColor.value(),
              borderColor: o.borderColor.value(),
              circleBorderColor: n,
            }
          this._renderer.append(this._noteRenderer),
            this._noteRenderer.setData(s),
            this._noteRenderer.setCursorType(this._textCursorType()),
            this._renderer.append(
              this.createLineAnchor(
                {
                  points: i.map(D.mapLineSourcePaneViewPointToLineAnchorPoint),
                },
                0,
              ),
            ),
            this._updateInplaceText(this._noteRenderer.getTextInfo())
        }
      }
      var X = i(11542),
        $ = i(45126),
        U = i(91335),
        j = i(18009),
        q = i(32097),
        J = i(91682)
      const Q = new $.TranslatedString(
          'change {title} line color',
          X.t(null, void 0, i(7455)),
        ),
        Z = new $.TranslatedString(
          'change {title} background visibility',
          X.t(null, void 0, i(30839)),
        ),
        ee = new $.TranslatedString(
          'change {title} background color',
          X.t(null, void 0, i(49765)),
        ),
        te = new $.TranslatedString(
          'change {title} border visibility',
          X.t(null, void 0, i(19298)),
        ),
        ie = new $.TranslatedString(
          'change {title} border color',
          X.t(null, void 0, i(69437)),
        ),
        oe = X.t(null, void 0, i(70320)),
        re = X.t(null, void 0, i(97575)),
        ne = X.t(null, void 0, i(34974)),
        le = X.t(null, void 0, i(73863))
      class ae extends j.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, J.removeSpaces)(t),
            o = new $.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, q.createColorPropertyDefinition)(
                {
                  checked: (0, q.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.drawBackground,
                    Z.format({ title: o }),
                  ),
                  color: (0, q.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    null,
                    ee.format({ title: o }),
                  ),
                },
                { id: (0, J.removeSpaces)(`${t}BackgroundColor`), title: le },
              ),
              (0, q.createColorPropertyDefinition)(
                {
                  checked: (0, q.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.drawBorder,
                    te.format({ title: o }),
                  ),
                  color: (0, q.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.borderColor,
                    null,
                    ie.format({ title: o }),
                  ),
                },
                { id: (0, J.removeSpaces)(`${t}BorderColor`), title: ne },
              ),
              (0, q.createColorPropertyDefinition)(
                {
                  color: (0, q.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.lineColor,
                    null,
                    Q.format({ title: o }),
                  ),
                },
                { id: `${i}LineColor`, title: re },
              ),
            ],
          }
        }
        _textPropertyDefinitions() {
          const {
            backgroundColor: e,
            borderColor: t,
            ...i
          } = this._source.properties().childs()
          return {
            definitions: [
              (0, U.createTextStyleDefinition)(
                this._propertyApplier,
                { ...i, textColor: i.textColor, fontSize: i.fontSize },
                new $.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: oe } },
              ),
            ],
          }
        }
      }
      var se = i(44672)
      class de {
        constructor(e, t) {
          ;(this._labelMovingDelta = null),
            (this._line = e),
            (this._itemIndex = t)
        }
        startMoving(e, t, i) {
          if (t === this._itemIndex) {
            if (this._line.isSourceHidden()) return !0
            const i = (0, r.ensureDefined)(e.logical),
              o = this._line.points()[1]
            return (
              (this._labelMovingDelta = {
                index: o.index - i.index,
                price: o.price - i.price,
              }),
              this._line.startChanging(t, i),
              !0
            )
          }
          return (this._labelMovingDelta = null), !1
        }
        move(e, t, i) {
          if (null !== this._labelMovingDelta) {
            const t = (0, r.ensureDefined)(e.logical),
              o = {
                index: t.index + this._labelMovingDelta.index,
                price: t.price + this._labelMovingDelta.price,
              }
            return (
              this._line.setPoint(1, o, i),
              this._line.updateAllViews(
                (0, se.sourceChangeEvent)(this._line.id()),
              ),
              !0
            )
          }
          return !1
        }
        endMoving(e, t, i) {
          return null !== this._labelMovingDelta
            ? ((this._labelMovingDelta = null), this._line.endChanging(!1, e))
            : null
        }
      }
      class ce extends _.InplaceTextLineDataSource {
        constructor(e, t, i, o) {
          super(
            e,
            t ?? ce.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            o,
          ),
            (this._moveAsChangeBehavior = new de(this, C.Label)),
            this._setPaneViews([
              new G(
                this,
                e,
                this._openTextEditor.bind(this),
                this._closeTextEditor.bind(this),
                this.onSelectionChange.bind(this),
              ),
            ])
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Note'
        }
        removeIfEditableTextIsEmpty() {
          return !0
        }
        activateEditingOnCreation() {
          return !0
        }
        shouldBeRemovedOnDeselect() {
          const e = this._properties.childs().text.value().trim()
          return this._points.length === this.pointsCount() && '' === e
        }
        editableTextProperties() {
          const e = this.properties().childs()
          return { text: e.text, textColor: e.textColor }
        }
        template() {
          return this._properties.template()
        }
        startMoving(e, t, i) {
          this._moveAsChangeBehavior.startMoving(e, t, i) ||
            super.startMoving(e, t, i)
        }
        move(e, t, i) {
          this._moveAsChangeBehavior.move(e, t, i) || super.move(e, t, i)
        }
        endMoving(e, t, i) {
          return (
            this._moveAsChangeBehavior.endMoving(e, t, i) ??
            super.endMoving(e, t, i)
          )
        }
        snapTo45DegreesAvailable() {
          return !0
        }
        static createProperties(e, t) {
          const i = T.create(e, t)
          return this._configureProperties(i), i
        }
        async _getPropertyDefinitionsViewModelClass() {
          return ae
        }
        _createDataSourceBackgroundColorWV() {
          return (0, o.convertPropertyToWatchedValue)(
            this.properties().childs().backgroundColor,
          ).ownership()
        }
      }
    },
    11402: (e, t, i) => {
      i.d(t, { factoryDefaultsForCurrentTheme: () => s })
      var o = i(16738),
        r = i(90054),
        n = i(50151),
        l = i(45345),
        a = i(24633)
      function s(e, t) {
        const i = l.watchedTheme.value() ?? a.StdTheme.Light,
          s = (0, r.default)(e)
        return (0, o.default)(s, (0, n.ensureDefined)(t.get(i))), s
      }
    },
  },
])
