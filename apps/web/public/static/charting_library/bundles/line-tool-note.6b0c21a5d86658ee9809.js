;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3248],
  {
    73174: (e, t, o) => {
      o.r(t),
        o.d(t, {
          getCoordinateXMetaInfo: () => x,
          getCoordinateYMetaInfo: () => b,
          getCoordinatesPropertiesDefinitions: () => v,
          getSelectionCoordinatesPropertyDefinition: () => C,
        })
      var i = o(50151),
        r = o(11542),
        n = o(45126),
        a = o(44672),
        l = o(60265)
      class s extends l.UndoCommand {
        constructor({ lineToolId: e, chartModel: t, newPositionPoints: o }) {
          super(null),
            (this._pointState = null),
            (this._lineToolId = e),
            (this._model = t),
            (this._newPositionPoints = o)
        }
        redo() {
          const e = (0, i.ensureNotNull)(
            this._model.dataSourceForId(this._lineToolId),
          )
          ;(this._pointState = [e.normalizedPoints(), e.points()]),
            e.startChanging(),
            e.moveLineTool(this._newPositionPoints),
            this._model.updateSource(e),
            e.updateAllViews((0, a.sourceChangeEvent)(e.id())),
            e.syncMultichartState(e.endChanging(!0, !1))
        }
        undo() {
          if (this._pointState) {
            const e = (0, i.ensureNotNull)(
              this._model.dataSourceForId(this._lineToolId),
            )
            e.startChanging(),
              e.restorePoints(...this._pointState),
              this._model.updateSource(e),
              e.updateAllViews((0, a.sourceChangeEvent)(e.id())),
              e.syncMultichartState(e.endChanging(!0, !1))
          }
        }
      }
      var d = o(32097),
        c = o(64147),
        h = o(12988),
        u = o(91682)
      const p = -5e4,
        g = 15e3,
        f = new n.TranslatedString(
          'change price Y coordinate',
          r.t(null, void 0, o(11737)),
        ),
        m = new n.TranslatedString(
          'change bar X coordinate',
          r.t(null, void 0, o(2066)),
        ),
        T = new n.TranslatedString('move drawings', r.t(null, void 0, o(76261)))
      function b(e, t, o) {
        return {
          property: (0, d.convertToDefinitionProperty)(e, t.price, f),
          info: { typeY: 1, stepY: o },
        }
      }
      function x(e, t) {
        return {
          property: (0, d.convertToDefinitionProperty)(e, t.bar, m),
          info: {
            typeX: 0,
            minX: new c.WatchedValue(p),
            maxX: new c.WatchedValue(g),
            stepX: new c.WatchedValue(1),
          },
        }
      }
      function v(e, t, o, i, r, n) {
        const a = x(e, t),
          l = b(e, t, i)
        return (0, d.createCoordinatesPropertyDefinition)(
          { x: a.property, y: l.property },
          {
            id: (0, u.removeSpaces)(`${n}Coordinates${r}`),
            title: r,
            ...a.info,
            ...l.info,
          },
        )
      }
      const y = /^([+*\-\/]?)((?:\d*)|(?:\d+\.\d*))$/
      function w(e, t, o) {
        const r = new h.Property(''),
          n = (0, d.makeProxyDefinitionProperty)(r.weakReference())
        return (
          (n.setValue = (n) => {
            try {
              const r = n.match(y)
              if (!r) return
              const [, a, l] = r
              if (!l.length) return
              const d = o(Number.parseFloat(l))
              if ('/' === a && (0 === d.price || 0 === d.index)) return
              t.withMacro(T, () => {
                e.filter((e) => !e.isSourceHidden()).forEach((e) => {
                  const o = e.points()
                  let r
                  switch (a) {
                    case '': {
                      const e = (0, i.ensureDefined)(o[0])
                      let { index: t = e.index, price: n = e.price } = d
                      ;(n -= e.price),
                        (t -= e.index),
                        (r = o.map((e) => ({
                          ...e,
                          index: e.index + t,
                          price: e.price + n,
                        })))
                      break
                    }
                    case '-':
                    case '+': {
                      let { index: e = 0, price: t = 0 } = d
                      '-' === a && ((e *= -1), (t *= -1)),
                        (r = o.map((o) => ({
                          ...o,
                          index: o.index + e,
                          price: o.price + t,
                        })))
                      break
                    }
                    case '*': {
                      const { index: e = 1, price: t = 1 } = d
                      r = o.map((o) => ({
                        ...o,
                        index: o.index * e,
                        price: o.price * t,
                      }))
                      break
                    }
                    case '/': {
                      const { index: e = 1, price: t = 1 } = d
                      r = o.map((o) => ({
                        ...o,
                        index: o.index / e,
                        price: o.price / t,
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
      function C(e, t) {
        const i = w(e, t, (e) => ({ index: e })),
          n = w(e, t, (e) => ({ price: e }))
        return (0, d.createSelectionCoordinatesPropertyDefinition)(
          { x: i, y: n },
          {
            id: 'SourcesCoordinates',
            title: r.t(null, void 0, o(44272)),
            mathOperationsX: '+',
            mathOperationsY: '+/*',
            modeX: 'integer',
            modeY: 'float',
          },
        )
      }
    },
    91335: (e, t, o) => {
      o.d(t, { createTextStyleDefinition: () => P })
      var i = o(11542),
        r = o(45126),
        n = o(32097),
        a = o(91682)
      const l = new r.TranslatedString(
          'change {toolName} text visibility',
          i.t(null, void 0, o(56634)),
        ),
        s = new r.TranslatedString(
          'change {toolName} text color',
          i.t(null, void 0, o(64500)),
        ),
        d = new r.TranslatedString(
          'change {toolName} text font size',
          i.t(null, void 0, o(21781)),
        ),
        c = new r.TranslatedString(
          'change {toolName} text font bold',
          i.t(null, void 0, o(24701)),
        ),
        h = new r.TranslatedString(
          'change {toolName} text font italic',
          i.t(null, void 0, o(42694)),
        ),
        u = new r.TranslatedString(
          'change {toolName} text',
          i.t(null, void 0, o(66668)),
        ),
        p = new r.TranslatedString(
          'change {toolName} labels alignment vertical',
          i.t(null, void 0, o(31689)),
        ),
        g = new r.TranslatedString(
          'change {toolName} labels alignment horizontal',
          i.t(null, void 0, o(88277)),
        ),
        f = new r.TranslatedString(
          'change {toolName} labels direction',
          i.t(null, void 0, o(61160)),
        ),
        m = new r.TranslatedString(
          'change {toolName} text background visibility',
          i.t(null, void 0, o(31133)),
        ),
        T = new r.TranslatedString(
          'change {toolName} text background color',
          i.t(null, void 0, o(22231)),
        ),
        b = new r.TranslatedString(
          'change {toolName} text border visibility',
          i.t(null, void 0, o(58704)),
        ),
        x = new r.TranslatedString(
          'change {toolName} text border width',
          i.t(null, void 0, o(35423)),
        ),
        v = new r.TranslatedString(
          'change {toolName} text border color',
          i.t(null, void 0, o(36666)),
        ),
        y = new r.TranslatedString(
          'change {toolName} text wrap',
          i.t(null, void 0, o(39587)),
        ),
        w = i.t(null, void 0, o(79468)),
        C = i.t(null, void 0, o(38408)),
        S = i.t(null, void 0, o(7560))
      function P(e, t, o, i) {
        const r = {},
          P = {
            id: `${(0, a.removeSpaces)(o.originalText())}Text`,
            title: (i.customTitles && i.customTitles.text) || '',
          }
        if (
          (void 0 !== t.showText &&
            (r.checked = (0, n.convertToDefinitionProperty)(
              e,
              t.showText,
              l.format({ toolName: o }),
            )),
          void 0 !== t.textColor &&
            (r.color = (0, n.getColorDefinitionProperty)(
              e,
              t.textColor,
              t.transparency || null,
              s.format({ toolName: o }),
            )),
          void 0 !== t.fontSize &&
            (r.size = (0, n.convertToDefinitionProperty)(
              e,
              t.fontSize,
              d.format({ toolName: o }),
            )),
          void 0 !== t.bold &&
            (r.bold = (0, n.convertToDefinitionProperty)(
              e,
              t.bold,
              c.format({ toolName: o }),
            )),
          void 0 !== t.italic &&
            (r.italic = (0, n.convertToDefinitionProperty)(
              e,
              t.italic,
              h.format({ toolName: o }),
            )),
          void 0 !== t.text &&
            ((r.text = (0, n.convertToDefinitionProperty)(
              e,
              t.text,
              u.format({ toolName: o }),
            )),
            (P.isEditable = Boolean(i.isEditable)),
            (P.isMultiLine = Boolean(i.isMultiLine))),
          void 0 !== t.vertLabelsAlign &&
            ((r.alignmentVertical = (0, n.convertToDefinitionProperty)(
              e,
              t.vertLabelsAlign,
              p.format({ toolName: o }),
            )),
            (P.alignmentVerticalItems = i.alignmentVerticalItems)),
          void 0 !== t.horzLabelsAlign &&
            ((r.alignmentHorizontal = (0, n.convertToDefinitionProperty)(
              e,
              t.horzLabelsAlign,
              g.format({ toolName: o }),
            )),
            (P.alignmentHorizontalItems = i.alignmentHorizontalItems)),
          void 0 !== t.textOrientation &&
            (r.orientation = (0, n.convertToDefinitionProperty)(
              e,
              t.textOrientation,
              f.format({ toolName: o }),
            )),
          void 0 !== t.backgroundVisible &&
            (r.backgroundVisible = (0, n.convertToDefinitionProperty)(
              e,
              t.backgroundVisible,
              m.format({ toolName: o }),
            )),
          void 0 !== t.backgroundColor)
        ) {
          let i = null
          void 0 !== t.backgroundTransparency && (i = t.backgroundTransparency),
            (r.backgroundColor = (0, n.getColorDefinitionProperty)(
              e,
              t.backgroundColor,
              i,
              T.format({ toolName: o }),
            ))
        }
        return (
          (void 0 === t.backgroundVisible && void 0 === t.backgroundColor) ||
            (P.backgroundTitle =
              (i.customTitles && i.customTitles.backgroundTitle) || w),
          void 0 !== t.borderVisible &&
            (r.borderVisible = (0, n.convertToDefinitionProperty)(
              e,
              t.borderVisible,
              b.format({ toolName: o }),
            )),
          void 0 !== t.borderWidth &&
            (r.borderWidth = (0, n.convertToDefinitionProperty)(
              e,
              t.borderWidth,
              x.format({ toolName: o }),
            )),
          void 0 !== t.borderColor &&
            (r.borderColor = (0, n.getColorDefinitionProperty)(
              e,
              t.borderColor,
              null,
              v.format({ toolName: o }),
            )),
          (void 0 === t.borderVisible &&
            void 0 === t.borderColor &&
            void 0 === t.borderWidth) ||
            (P.borderTitle =
              (i.customTitles && i.customTitles.borderTitle) || C),
          void 0 !== t.wrap &&
            ((r.wrap = (0, n.convertToDefinitionProperty)(
              e,
              t.wrap,
              y.format({ toolName: o }),
            )),
            (P.wrapTitle = (i.customTitles && i.customTitles.wrapTitle) || S)),
          (0, n.createTextPropertyDefinition)(r, P)
        )
      }
    },
    6590: (e, t, o) => {
      o.d(t, { commonLineToolPropertiesStateKeys: () => i })
      const i = [
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
      var r, n, a
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
        })(a || (a = {}))
    },
    38039: (e, t, o) => {
      o.d(t, { LineDataSourceProperty: () => l })
      var i = o(90054),
        r = o(16738),
        n = o(50151),
        a = o(32679)
      class l extends a.DefaultProperty {
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
          return (0, a.extractState)(this.state(), this._templateKeys, [])
        }
        applyTemplate(e) {
          this.mergeAndFire(
            (0, a.extractState)(
              (0, r.default)(
                (0, i.default)(this._factoryDefaultsSupplier()),
                e,
              ),
              this._templateKeys,
            ),
          )
        }
      }
    },
    40258: (e, t, o) => {
      o.r(t), o.d(t, { LineToolNote: () => ae, LineToolNoteAbsolute: () => le })
      var i = o(94784),
        r = o(11542),
        n = o(45126),
        a = o(91335),
        l = o(18009),
        s = o(32097),
        d = o(91682)
      const c = new n.TranslatedString(
          'change {title} background color',
          r.t(null, void 0, o(49765)),
        ),
        h = r.t(null, void 0, o(74872))
      class u extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            o = new n.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.markerColor,
                    null,
                    c.format({ title: o }),
                  ),
                },
                { id: (0, d.removeSpaces)(`${t}LabelColor`), title: h },
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
                  textColor: e.textColor,
                  fontSize: e.fontSize,
                  bold: e.bold,
                  italic: e.italic,
                  text: e.text,
                  backgroundVisible: e.drawBackground,
                  backgroundColor: e.backgroundColor,
                  backgroundTransparency: e.backgroundTransparency,
                  borderVisible: e.drawBorder,
                  borderColor: e.borderColor,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { isEditable: !0, isMultiLine: !0 },
              ),
            ],
          }
        }
      }
      var p,
        g,
        f = o(50151),
        m = o(19625),
        T = o(19063),
        b = o(68979),
        x = o(95201),
        v = o(11064),
        y = o(56468),
        w = o(15938),
        C = o(17330),
        S = o(2844),
        P = o(36036),
        _ = o(32211),
        D = o(86441),
        k = o(34026),
        V = o(63273),
        N = o(7114),
        M = o(64034),
        I = o(12027),
        L = o(70262),
        A = o(64099)
      function B(e) {
        const {
            ctx: t,
            renderingInfo: o,
            left: i,
            top: r,
            width: n,
            height: a,
            point: l,
            caretPos: s,
            mode: d,
          } = e,
          { horizontalPixelRatio: c, verticalPixelRatio: h } = o,
          u = (Math.max(1, Math.floor(c)) % 2) / 2,
          p = Math.round(l.x * c) + u,
          g = 0 === d ? Math.max(1, 1 * Math.floor(c)) : 0,
          f = Math.round(i * c) + g / 2,
          m = Math.round(r * h) + g / 2,
          T = Math.round(a * h) - g,
          b = Math.round(n * c) - g,
          x = Math.round(12 * c),
          v = Math.round(10 * h),
          y = p - x / 2,
          w = p + x / 2,
          C = Math.atan(10 / 6),
          S = 4 * Math.cos(C),
          P = 4 * Math.sin(C),
          _ = 4 * c
        if (
          (t.beginPath(),
          t.moveTo(f, m + _),
          t.arcTo(f, m, f + _, m, _),
          'top' === s)
        ) {
          const e = m,
            o = m - v
          t.lineTo(y - _, e),
            t.arcTo(y, e, y + S, e - P, _),
            t.lineTo(p - 1.2 * S, o + 1.2 * P),
            t.arcTo(p, o, p + 1.2 * S, o + 1.2 * P, 1.2 * S),
            t.lineTo(w - S, e - P),
            t.arcTo(w, e, w + _, e, _)
        }
        if (
          (t.lineTo(f + b - _, m),
          t.arcTo(f + b, m, f + b, m + _, _),
          t.lineTo(f + b, m + T - _),
          t.arcTo(f + b, m + T, f + b - _, m + T, _),
          'bottom' === s)
        ) {
          const e = m + T,
            o = e + v
          t.lineTo(w + _, e),
            t.arcTo(w, e, w - S, e + P, _),
            t.lineTo(p + 1.2 * S, o - 1.2 * P),
            t.arcTo(p, o, p - 1.2 * S, o - 1.2 * P, 1.2 * S),
            t.lineTo(y + S, e + P),
            t.arcTo(y, e, y - _, e, _)
        }
        t.lineTo(f + _, m + T),
          t.arcTo(f, m + T, f, m + T - _, _),
          t.closePath()
      }
      !((e) => {
        ;(e[(e.MinTooltipWidth = 20)] = 'MinTooltipWidth'),
          (e[(e.TooltipMinWidth = 236)] = 'TooltipMinWidth'),
          (e[(e.TooltipVertMargin = 13)] = 'TooltipVertMargin'),
          (e[(e.TooltipHorzPadding = 12)] = 'TooltipHorzPadding'),
          (e[(e.TooltipVertPadding = 12)] = 'TooltipVertPadding'),
          (e[(e.TooltipLineSpacing = 5)] = 'TooltipLineSpacing'),
          (e[(e.TooltipBorderLineWidth = 1)] = 'TooltipBorderLineWidth'),
          (e[(e.TooltipBorderRadius = 4)] = 'TooltipBorderRadius'),
          (e[(e.TooltipApexBorderRadiusCoeff = 1.2)] =
            'TooltipApexBorderRadiusCoeff'),
          (e[(e.CorrectPositionYDistance = 10)] = 'CorrectPositionYDistance'),
          (e[(e.CorrectPositionXDistance = 10)] = 'CorrectPositionXDistance'),
          (e[(e.CaretWidth = 12)] = 'CaretWidth'),
          (e[(e.CaretHeight = 10)] = 'CaretHeight'),
          (e[(e.NoCaretEdgeXDistance = 24)] = 'NoCaretEdgeXDistance'),
          (e[(e.ShadowBlur = 4)] = 'ShadowBlur'),
          (e[(e.ShadowOffsetX = 0)] = 'ShadowOffsetX'),
          (e[(e.ShadowOffsetY = 2)] = 'ShadowOffsetY'),
          (e[(e.SpaceBetweenMarkerAndTooltipTolerance = 8)] =
            'SpaceBetweenMarkerAndTooltipTolerance')
      })(p || (p = {})),
        ((e) => {
          ;(e[(e.Stroke = 0)] = 'Stroke'), (e[(e.Fill = 1)] = 'Fill')
        })(g || (g = {}))
      const z = (0, I.svgRenderer)(A)
      class H {
        constructor(e) {
          ;(this._data = null),
            (this._tooltipHitTest = new y.HitTestResult(y.HitTarget.MovePoint, {
              ...e,
              areaName: y.AreaName.Text,
            }))
        }
        setData(e) {
          this._data = e
        }
        setCursorType(e) {
          this._tooltipHitTest.mergeData({ cursorType: e })
        }
        draw(e, t) {
          if (null === this._data) return
          const { horizontalPixelRatio: o, verticalPixelRatio: i } = t,
            r = (Math.max(1, Math.floor(o)) % 2) / 2,
            n = (Math.max(1, Math.floor(i)) % 2) / 2,
            { point: a, markerColor: l } = this._data,
            s = Math.round(a.x * o) + r,
            d = Math.round(a.y * i) + n,
            c = z.viewBox()
          ;(e.fillStyle = l),
            z.render(e, {
              targetViewBox: {
                x: s - (o * c.width) / 2,
                y: d - o * c.height,
                width: o * c.width,
                height: o * c.height,
              },
              doNotApplyColors: !0,
            }),
            this._data.tooltipVisible && this._drawTooltipOn(e, t)
        }
        hitTest(e, t) {
          if (null !== this._data) {
            const {
                point: t,
                left: o,
                top: i,
                width: r,
                height: n,
                tooltipVisible: a,
              } = this._data,
              l = t.x,
              s = t.y,
              d = z.viewBox(),
              c = (0, D.box)(
                (0, D.point)(l - d.width / 2, s - d.height),
                (0, D.point)(l + d.width / 2, s),
              )
            if ((0, k.pointInBox)(e, c))
              return new y.HitTestResult(y.HitTarget.MovePoint)
            if (a) {
              const t = (0, D.box)(
                (0, D.point)(o, i),
                (0, D.point)(o + r, i + n),
              )
              if ((0, k.pointInBox)(e, t)) return this._tooltipHitTest
              const a = t.min.y < c.min.y ? t.max.y : c.max.y,
                l = t.min.y < c.min.y ? c.min.y : t.min.y,
                s = (0, D.box)(
                  (0, D.point)(c.min.x - 8, a),
                  (0, D.point)(c.max.x + 8, l),
                )
              if ((0, k.pointInBox)(e, s))
                return new y.HitTestResult(y.HitTarget.MovePoint)
            }
          }
          return null
        }
        getTextInfo() {
          const {
            font: e,
            fontSize: t,
            width: o,
            left: i,
            top: r,
            height: n,
            lineSpacing: a,
          } = (0, f.ensureNotNull)(this._data)
          return {
            font: e,
            fontSize: t,
            lineHeight: t,
            lineSpacing: a,
            textTop: r + 12,
            textBottom: r + n - 12,
            textLeft: i + 12,
            textRight: i + o - 12,
            textAlign: (0, V.isRtl)() ? 'right' : 'left',
          }
        }
        positionToCoordinate(e, t) {
          const o = (0, f.ensureNotNull)(this._data),
            i = this.getTextInfo(),
            {
              x: r,
              y: n,
              lineNumber: a,
            } = (0, L.getSymbolCoordinatesInfo)({
              symbolPosition: t,
              textWidth: i.textRight - i.textLeft,
              textByLines: o.linesIncludingHidden,
              lineHeight: o.fontSize,
              lineSpacing: o.lineSpacing,
              font: o.font,
              textAlign: i.textAlign,
            })
          return { x: r + i.textLeft, y: n + i.textTop, lineNumber: a }
        }
        _drawTooltipOn(e, t) {
          e.save()
          const o = (0, f.ensureNotNull)(this._data),
            {
              point: i,
              textColor: r,
              font: n,
              fontSize: a,
              backgroundColor: l,
              borderColor: s,
              boxShadowColor: d,
              width: c,
              textWidth: h,
              left: u,
              top: p,
              height: g,
              lineSpacing: m,
              caretPos: T,
              lines: b,
              selectionHighlight: x,
            } = o
          e.font = n
          const { horizontalPixelRatio: v, verticalPixelRatio: y } = t
          if (l) {
            e.fillStyle = l
            let o = !1
            d &&
              (e.save(),
              (e.shadowColor = d),
              (e.shadowBlur = 4),
              (e.shadowOffsetX = 0),
              (e.shadowOffsetY = 2),
              (o = !0)),
              B({
                ctx: e,
                renderingInfo: t,
                left: u,
                top: p,
                width: c,
                height: g,
                point: i,
                caretPos: T,
                mode: 1,
              }),
              e.fill(),
              o && e.restore()
          }
          s &&
            ((e.lineWidth = Math.max(1, 1 * Math.floor(v))),
            (e.strokeStyle = s),
            B({
              ctx: e,
              renderingInfo: t,
              left: u,
              top: p,
              width: c,
              height: g,
              point: i,
              caretPos: T,
              mode: 0,
            }),
            e.stroke()),
            (e.textBaseline = 'middle'),
            (e.fillStyle = r),
            (e.textAlign = (0, V.isRtl)() ? 'right' : 'left')
          const w = u + 12 + (0, N.calcTextHorizontalShift)(e, h)
          let C = p + 12 + a / 2
          ;(0, N.drawScaled)(e, v, y, () => {
            if (x) {
              const t = this.positionToCoordinate(!1, x.start),
                i = this.positionToCoordinate(!1, x.end),
                r = this.getTextInfo()
              ;(0, L.drawSelection)(e, M.dpr1PixelRatioInfo, {
                lines: o.linesIncludingHidden,
                selectionStart: t,
                selectionEnd: i,
                left: r.textLeft,
                right: r.textRight,
                color: x.color,
                font: n,
                lineHeight: a,
                lineSpacing: m,
              })
            }
            for (const t of b) e.fillText(t, w, C), (C += a + m)
          }),
            e.restore()
        }
      }
      const R = (0, T.generateColor)(
          (0, m.getHexColorByName)('color-black'),
          80,
        ),
        W = (0, T.generateColor)((0, m.getHexColorByName)('color-black'), 60)
      class F extends _.InplaceTextLineSourcePaneView {
        constructor(e, t, o, i, r) {
          super(e, t, o, i, r),
            (this._renderer = null),
            (this._textWidthCache = new S.TextWidthCache()),
            (this._noteRenderer = new H(
              (0, _.inplaceEditHandlers)(
                this._tryActivateEditMode.bind(this, null),
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
        isLabelVisible() {
          return this.isHoveredSource() || this.isSelectedSource()
        }
        renderer(e) {
          return this._invalidated && this._updateImpl(e), this._renderer
        }
        _updateImpl(e) {
          super._updateImpl(e), (this._renderer = null)
          const t = this._getSource()
          if (
            !this._points ||
            (this._source.isFixed() && void 0 === t.fixedPoint())
          )
            return
          const o = this._source.isFixed()
            ? [(0, f.ensureDefined)(t.fixedPoint())]
            : this._points
          if (o.length < 1) return
          const i = new x.CompositeRenderer(),
            r = this.isLabelVisible(),
            n = this._source.properties().childs(),
            a = (0, b.makeFont)(
              n.fontSize.value(),
              w.CHART_FONT_FAMILY,
              n.italic.value() ? 'italic' : void 0,
              n.bold.value() ? 'bold' : void 0,
            )
          let l, s
          n.drawBackground.value() &&
            ((l = (0, T.generateColor)(
              n.backgroundColor.value(),
              n.backgroundTransparency.value(),
            )),
            (s = this._model.dark().value() ? W : R))
          const d = Math.min(236, e.mediaSize.width),
            c = d - 24,
            h = o[0],
            { mediaSize: u } = e,
            p = (0, C.wordWrap)(
              this._textData(),
              a,
              this._textWidthCache,
              !1,
              c,
            ),
            g = p.filter((e) => !e.hidden).map((e) => e.text),
            m = n.fontSize.value()
          let S = g.length * m + 24
          g.length > 1 && (S += 5 * (g.length - 1))
          let _ = Math.round(h.x - d / 2)
          const D = z.viewBox()
          let k = Math.round(h.y - D.height - S - 13)
          const V = h.x < 24 || h.x + 24 > u.width
          let N = V ? null : 'top'
          k < 10 ? (k = h.y + 13) : V || (N = 'bottom'),
            _ < 10 ? (_ = 10) : _ + d + 10 > u.width && (_ = u.width - d - 10),
            this._noteRenderer.setData({
              linesIncludingHidden: p,
              lines: g,
              font: a,
              fontSize: m,
              backgroundColor: l,
              boxShadowColor: s,
              borderColor: n.drawBorder.value()
                ? n.borderColor.value()
                : void 0,
              textColor: this._textColor(),
              markerColor: n.markerColor.value(),
              point: h,
              tooltipVisible: r,
              width: d,
              height: S,
              left: _,
              top: k,
              caretPos: N,
              lineSpacing: 5,
              textWidth: c,
              ...this._inplaceTextHighlight(),
            }),
            this._noteRenderer.setCursorType(this._textCursorType()),
            this._updateInplaceText(this._noteRenderer.getTextInfo()),
            i.append(this._noteRenderer),
            i.append(
              new v.SelectionRenderer({
                points: o.map(P.mapLineSourcePaneViewPointToLineAnchorPoint),
                bgColors: this._lineAnchorColors(o),
                visible: this.areAnchorsVisible(),
                barSpacing: this._model.timeScale().barSpacing(),
                hittestResult: y.HitTarget.MovePoint,
              }),
            ),
            (this._renderer = i)
        }
      }
      var O = o(42752),
        E = o(43042),
        K = o(88960),
        X = o(24362),
        Y = o(24633),
        $ = o(12988),
        U = o(32679),
        G = o(11402),
        Z = o(6590),
        j = o(38039)
      const q = {
          intervalsVisibilities: { ...o(31229).intervalsVisibilitiesDefaults },
          fontSize: 14,
          bold: !1,
          italic: !1,
          drawBackground: !0,
          drawBorder: !1,
        },
        J = new Map([
          [
            Y.StdTheme.Light,
            {
              textColor: m.colorsPalette['color-cold-gray-900'],
              backgroundColor: m.colorsPalette['color-white'],
              backgroundTransparency: 0,
              borderColor: m.colorsPalette['color-cold-gray-150'],
              markerColor: m.colorsPalette['color-tv-blue-500'],
            },
          ],
          [
            Y.StdTheme.Dark,
            {
              textColor: m.colorsPalette['color-cold-gray-200'],
              backgroundColor: m.colorsPalette['color-cold-gray-800'],
              backgroundTransparency: 0,
              borderColor: m.colorsPalette['color-cold-gray-700'],
              markerColor: m.colorsPalette['color-tv-blue-500'],
            },
          ],
        ]),
        Q = (0, U.extractThemedColors)(
          (0, f.ensureDefined)(J.get(Y.StdTheme.Light)),
          (0, f.ensureDefined)(J.get(Y.StdTheme.Dark)),
        ),
        ee = (0, U.extractAllPropertiesKeys)(
          (0, f.ensureDefined)(J.get(Y.StdTheme.Light)),
        ),
        te = (0, U.extractAllPropertiesKeys)(q),
        oe = [
          ...new Set([
            ...ee,
            ...te,
            ...Z.commonLineToolPropertiesStateKeys,
            'text',
            'anchored',
          ]),
        ],
        ie = [...new Set([...ee, ...te, 'text'])]
      class re extends j.LineDataSourceProperty {
        constructor(e, t) {
          super(t),
            this.hasChild('text') || this.addProperty('text', ''),
            t.state?.anchored || this.addChild('anchored', new $.Property(e))
        }
        static create(e, t, o, i) {
          return new this(t, {
            defaultName: e,
            factoryDefaultsSupplier: () =>
              (0, G.factoryDefaultsForCurrentTheme)(q, J),
            nonThemedDefaultsKeys: te,
            themedDefaultsKeys: ee,
            allStateKeys: oe,
            themedColors: Q,
            templateKeys: ie,
            replaceThemedColorsOnThemeChange: !0,
            state: i,
            theme: o,
          })
        }
      }
      var ne
      !((e) => {
        e[(e.Version = 1)] = 'Version'
      })(ne || (ne = {}))
      class ae extends X.InplaceTextLineDataSource {
        constructor(e, t, o, i) {
          const r =
            t ?? ae.createProperties(e.backgroundTheme().spawnOwnership())
          super(e, r, o, i),
            (this.version = 1),
            this._setPaneViews([
              new F(
                this,
                this._model,
                this._openTextEditor.bind(this),
                this._closeTextEditor.bind(this),
                this.onSelectionChange.bind(this),
              ),
            ]),
            r
              .childs()
              .anchored.subscribe(this, this._onAnchoredChange.bind(this)),
            (this._hasEditableCoordinates = (0, K.combine)(
              (e) => !e,
              (0, E.createWVFromProperty)(
                this.properties().childs().anchored,
              ).ownership(),
            ))
        }
        destroy() {
          this._hasEditableCoordinates.destroy(), super.destroy()
        }
        pointsCount() {
          return 1
        }
        name() {
          return 'Pin'
        }
        isFixed() {
          return this._properties.childs().anchored.value()
        }
        anchorable() {
          return !0
        }
        template() {
          return this._properties.template()
        }
        activateEditingOnCreation() {
          return !0
        }
        editableTextProperties() {
          const e = this.properties().childs()
          return { text: e.text, textColor: e.textColor }
        }
        static createProperties(e, t) {
          null != t &&
            void 0 !== t.markerColor &&
            void 0 === t.borderColor &&
            (t.borderColor = t.markerColor)
          const o = re.create(
            this._defaultsKey(),
            this._anchoredDefaultValue(),
            e,
            t,
          )
          return this._configureProperties(o), o
        }
        _normalizePoint(e, t) {
          return (
            super._normalizePointWithoutOffset(e) ?? super._normalizePoint(e, t)
          )
        }
        async _getPropertyDefinitionsViewModelClass() {
          return u
        }
        _createDataSourceBackgroundColorWV() {
          const e = (0, i.generateColorCached)(),
            { backgroundColor: t, backgroundTransparency: o } =
              this.properties().childs()
          return (0, K.combine)(
            () => e(t.value(), o.value()),
            (0, O.convertPropertyToWatchedValue)(t).ownership(),
            (0, O.convertPropertyToWatchedValue)(o).ownership(),
          ).ownership()
        }
        static _defaultsKey() {
          return 'linetoolnote'
        }
        static _anchoredDefaultValue() {
          return !1
        }
      }
      class le extends ae {
        constructor(e, t, o, i) {
          super(
            e,
            t ?? le.createProperties(e.backgroundTheme().spawnOwnership()),
            o,
            i,
          )
        }
        name() {
          return 'Anchored Note'
        }
        static _defaultsKey() {
          return 'linetoolnoteabsolute'
        }
        static _anchoredDefaultValue() {
          return !0
        }
      }
    },
    11402: (e, t, o) => {
      o.d(t, { factoryDefaultsForCurrentTheme: () => s })
      var i = o(16738),
        r = o(90054),
        n = o(50151),
        a = o(45345),
        l = o(24633)
      function s(e, t) {
        const o = a.watchedTheme.value() ?? l.StdTheme.Light,
          s = (0, r.default)(e)
        return (0, i.default)(s, (0, n.ensureDefined)(t.get(o))), s
      }
    },
    64099: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 30" width="24" height="30"><path fill="#2962FF" fill-rule="evenodd" d="m12 30 .88-.77C20.25 22.73 24 17.07 24 12.09 24 5.04 18.54 0 12 0S0 5.04 0 12.1c0 4.97 3.75 10.64 11.12 17.13L12 30Zm0-13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/></svg>'
    },
  },
])
