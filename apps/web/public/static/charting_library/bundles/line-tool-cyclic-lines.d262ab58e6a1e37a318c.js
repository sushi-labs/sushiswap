;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9445],
  {
    73174: (e, t, i) => {
      i.r(t),
        i.d(t, {
          getCoordinateXMetaInfo: () => v,
          getCoordinateYMetaInfo: () => S,
          getCoordinatesPropertiesDefinitions: () => P,
          getSelectionCoordinatesPropertyDefinition: () => x,
        })
      var n = i(50151),
        o = i(11542),
        r = i(45126),
        s = i(44672),
        l = i(60265)
      class a extends l.UndoCommand {
        constructor({ lineToolId: e, chartModel: t, newPositionPoints: i }) {
          super(null),
            (this._pointState = null),
            (this._lineToolId = e),
            (this._model = t),
            (this._newPositionPoints = i)
        }
        redo() {
          const e = (0, n.ensureNotNull)(
            this._model.dataSourceForId(this._lineToolId),
          )
          ;(this._pointState = [e.normalizedPoints(), e.points()]),
            e.startChanging(),
            e.moveLineTool(this._newPositionPoints),
            this._model.updateSource(e),
            e.updateAllViews((0, s.sourceChangeEvent)(e.id())),
            e.syncMultichartState(e.endChanging(!0, !1))
        }
        undo() {
          if (this._pointState) {
            const e = (0, n.ensureNotNull)(
              this._model.dataSourceForId(this._lineToolId),
            )
            e.startChanging(),
              e.restorePoints(...this._pointState),
              this._model.updateSource(e),
              e.updateAllViews((0, s.sourceChangeEvent)(e.id())),
              e.syncMultichartState(e.endChanging(!0, !1))
          }
        }
      }
      var d = i(32097),
        c = i(64147),
        h = i(12988),
        u = i(91682)
      const p = -5e4,
        _ = 15e3,
        f = new r.TranslatedString(
          'change price Y coordinate',
          o.t(null, void 0, i(11737)),
        ),
        m = new r.TranslatedString(
          'change bar X coordinate',
          o.t(null, void 0, i(2066)),
        ),
        g = new r.TranslatedString('move drawings', o.t(null, void 0, i(76261)))
      function S(e, t, i) {
        return {
          property: (0, d.convertToDefinitionProperty)(e, t.price, f),
          info: { typeY: 1, stepY: i },
        }
      }
      function v(e, t) {
        return {
          property: (0, d.convertToDefinitionProperty)(e, t.bar, m),
          info: {
            typeX: 0,
            minX: new c.WatchedValue(p),
            maxX: new c.WatchedValue(_),
            stepX: new c.WatchedValue(1),
          },
        }
      }
      function P(e, t, i, n, o, r) {
        const s = v(e, t),
          l = S(e, t, n)
        return (0, d.createCoordinatesPropertyDefinition)(
          { x: s.property, y: l.property },
          {
            id: (0, u.removeSpaces)(`${r}Coordinates${o}`),
            title: o,
            ...s.info,
            ...l.info,
          },
        )
      }
      const y = /^([+*\-\/]?)((?:\d*)|(?:\d+\.\d*))$/
      function T(e, t, i) {
        const o = new h.Property(''),
          r = (0, d.makeProxyDefinitionProperty)(o.weakReference())
        return (
          (r.setValue = (r) => {
            try {
              const o = r.match(y)
              if (!o) return
              const [, s, l] = o
              if (!l.length) return
              const d = i(Number.parseFloat(l))
              if ('/' === s && (0 === d.price || 0 === d.index)) return
              t.withMacro(g, () => {
                e.filter((e) => !e.isSourceHidden()).forEach((e) => {
                  const i = e.points()
                  let o
                  switch (s) {
                    case '': {
                      const e = (0, n.ensureDefined)(i[0])
                      let { index: t = e.index, price: r = e.price } = d
                      ;(r -= e.price),
                        (t -= e.index),
                        (o = i.map((e) => ({
                          ...e,
                          index: e.index + t,
                          price: e.price + r,
                        })))
                      break
                    }
                    case '-':
                    case '+': {
                      let { index: e = 0, price: t = 0 } = d
                      '-' === s && ((e *= -1), (t *= -1)),
                        (o = i.map((i) => ({
                          ...i,
                          index: i.index + e,
                          price: i.price + t,
                        })))
                      break
                    }
                    case '*': {
                      const { index: e = 1, price: t = 1 } = d
                      o = i.map((i) => ({
                        ...i,
                        index: i.index * e,
                        price: i.price * t,
                      }))
                      break
                    }
                    case '/': {
                      const { index: e = 1, price: t = 1 } = d
                      o = i.map((i) => ({
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
                      newPositionPoints: o,
                    }),
                  )
                })
              })
            } finally {
              o.setValue('', !0)
            }
          }),
          r
        )
      }
      function x(e, t) {
        const n = T(e, t, (e) => ({ index: e })),
          r = T(e, t, (e) => ({ price: e }))
        return (0, d.createSelectionCoordinatesPropertyDefinition)(
          { x: n, y: r },
          {
            id: 'SourcesCoordinates',
            title: o.t(null, void 0, i(44272)),
            mathOperationsX: '+',
            mathOperationsY: '+/*',
            modeX: 'integer',
            modeY: 'float',
          },
        )
      }
    },
    53749: (e, t, i) => {
      i.d(t, { createLineStyleDefinition: () => S })
      var n = i(11542),
        o = i(45126),
        r = i(32097),
        s = i(91682)
      const l = new o.TranslatedString(
          'change {toolName} line visibility',
          n.t(null, void 0, i(24550)),
        ),
        a = new o.TranslatedString(
          'change {toolName} line width',
          n.t(null, void 0, i(19541)),
        ),
        d = new o.TranslatedString(
          'change {toolName} line style',
          n.t(null, void 0, i(66429)),
        ),
        c = new o.TranslatedString(
          'change {toolName} line color',
          n.t(null, void 0, i(24059)),
        ),
        h = new o.TranslatedString(
          'change {toolName} line extending left',
          n.t(null, void 0, i(18773)),
        ),
        u = new o.TranslatedString(
          'change {toolName} line left end',
          n.t(null, void 0, i(21474)),
        ),
        p = new o.TranslatedString(
          'change {toolName} line extending right',
          n.t(null, void 0, i(43823)),
        ),
        _ = new o.TranslatedString(
          'change {toolName} line right end',
          n.t(null, void 0, i(54827)),
        ),
        f = n.t(null, void 0, i(3554)),
        m = n.t(null, void 0, i(61856)),
        g = n.t(null, void 0, i(87430))
      function S(e, t, i, n, o) {
        const S = {},
          v = {
            id: `${(0, s.removeSpaces)(i.originalText())}${n}`,
            title: (o && o.line) || f,
          }
        return (
          void 0 !== t.showLine &&
            (S.checked = (0, r.convertToDefinitionProperty)(
              e,
              t.showLine,
              l.format({ toolName: i }),
            )),
          void 0 !== t.lineWidth &&
            (S.width = (0, r.convertToDefinitionProperty)(
              e,
              t.lineWidth,
              a.format({ toolName: i }),
            )),
          void 0 !== t.lineStyle &&
            (S.style = (0, r.convertToDefinitionProperty)(
              e,
              t.lineStyle,
              d.format({ toolName: i }),
            )),
          void 0 !== t.lineColor &&
            (S.color = (0, r.getColorDefinitionProperty)(
              e,
              t.lineColor,
              null,
              c.format({ toolName: i }),
            )),
          void 0 !== t.extendLeft &&
            ((S.extendLeft = (0, r.convertToDefinitionProperty)(
              e,
              t.extendLeft,
              h.format({ toolName: i }),
            )),
            (v.extendLeftTitle = (o && o.extendLeftTitle) || m)),
          void 0 !== t.leftEnd &&
            (S.leftEnd = (0, r.convertToDefinitionProperty)(
              e,
              t.leftEnd,
              u.format({ toolName: i }),
            )),
          void 0 !== t.extendRight &&
            ((S.extendRight = (0, r.convertToDefinitionProperty)(
              e,
              t.extendRight,
              p.format({ toolName: i }),
            )),
            (v.extendRightTitle = (o && o.extendRightTitle) || g)),
          void 0 !== t.rightEnd &&
            (S.rightEnd = (0, r.convertToDefinitionProperty)(
              e,
              t.rightEnd,
              _.format({ toolName: i }),
            )),
          (0, r.createLinePropertyDefinition)(S, v)
        )
      }
    },
    3868: (e, t, i) => {
      i.r(t), i.d(t, { CyclicAndSineLinesPatternDefinitionsViewModel: () => a })
      var n = i(11542),
        o = i(45126),
        r = i(53749),
        s = i(18009)
      const l = n.t(null, void 0, i(56982))
      class a extends s.LineDataSourceDefinitionsViewModel {
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
                { line: l },
              ),
            ],
          }
        }
      }
    },
    9093: (e, t, i) => {
      i.r(t), i.d(t, { LineToolCyclicLines: () => A })
      var n = i(29875),
        o = i(86441),
        r = i(95201),
        s = i(49857),
        l = i(91046),
        a = i(27916),
        d = i(95173),
        c = i(36036),
        h = i(56468),
        u = i(51056)
      class p extends a.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._coordinates = []),
            (this._trendRenderer = new l.TrendLineRenderer()),
            (this._renderer = new r.CompositeRenderer())
        }
        renderer(e) {
          return this._invalidated && this._updateImpl(e), this._renderer
        }
        _updateImpl(e) {
          if (
            (super._updateImpl(e),
            this._renderer.clear(),
            this._source.points().length < 2)
          )
            return
          const t = this._model.timeScale(),
            i = this._source.priceScale()
          if (!i || i.isEmpty() || t.isEmpty()) return
          const n = this._source.points()[0],
            r = this._source.points()[1],
            l = r ? r.index - n.index : 1
          if (((this._coordinates = []), 0 === l)) return
          const a = t.visibleBarsStrictRange()
          if (null === a) return
          if (l > 0) {
            for (let e = n.index; e <= a.lastBar(); e += l)
              this._coordinates.push(t.indexToCoordinate(e))
          } else {
            for (let e = n.index; e >= a.firstBar(); e += l)
              this._coordinates.push(t.indexToCoordinate(e))
          }
          if (this._points.length < 2) return
          const p = this._source.properties().childs(),
            _ = {
              points: this._points,
              color: '#808080',
              linewidth: 1,
              linestyle: u.LINESTYLE_DASHED,
              extendleft: !1,
              extendright: !1,
              leftend: s.LineEnd.Normal,
              rightend: s.LineEnd.Normal,
            }
          this._trendRenderer.setData(_),
            this._renderer.append(this._trendRenderer)
          for (let e = 0; e < this._coordinates.length; e++) {
            const t = {
                x: this._coordinates[e],
                color: p.linecolor.value(),
                linewidth: p.linewidth.value(),
                linestyle: p.linestyle.value(),
              },
              i = new d.VerticalLineRenderer()
            i.setData(t), this._renderer.append(i)
          }
          if (2 === this._source.points().length) {
            const e = this._points.map((e) => ({
              point: e,
              pointIndex: e.pointIndex,
            }))
            this._renderer.append(this.createLineAnchor({ points: e }, 0))
          } else
            this._renderer.append(
              this.createLineAnchor(
                {
                  points: [
                    (0, c.lineSourcePaneViewPointToLineAnchorPoint)(
                      new o.Point(this._points[0].x, i.height() / 2),
                      void 0,
                      void 0,
                      void 0,
                      h.HitTarget.MovePoint,
                    ),
                  ],
                },
                1,
              ),
            )
        }
      }
      var _ = i(3868),
        f = i(50151),
        m = i(24633),
        g = i(31229),
        S = i(6590),
        v = i(32679),
        P = i(11402),
        y = i(38039),
        T = i(73305)
      const x = {
          intervalsVisibilities: { ...g.intervalsVisibilitiesDefaults },
          linewidth: 2,
          linestyle: u.LINESTYLE_SOLID,
        },
        w = { linecolor: '#80ccdb' },
        b = new Map([
          [m.StdTheme.Light, w],
          [m.StdTheme.Dark, w],
        ]),
        D = (0, v.extractThemedColors)(
          (0, f.ensureDefined)(b.get(m.StdTheme.Light)),
          (0, f.ensureDefined)(b.get(m.StdTheme.Dark)),
        ),
        L = (0, v.extractAllPropertiesKeys)(
          (0, f.ensureDefined)(b.get(m.StdTheme.Light)),
        ),
        C = (0, v.extractAllPropertiesKeys)(x),
        R = [...new Set([...L, ...C, ...S.commonLineToolPropertiesStateKeys])]
      class I extends y.LineDataSourceProperty {
        constructor(e) {
          super(e),
            this.addChild(
              'linesColors',
              new T.LineToolColorsProperty([
                (0, f.ensureDefined)(this.child('linecolor')),
              ]),
            ),
            this.addChild(
              'linesWidths',
              new T.LineToolWidthsProperty([
                (0, f.ensureDefined)(this.child('linewidth')),
              ]),
            )
        }
        static create(e, t) {
          return new this({
            defaultName: 'linetoolcirclelines',
            factoryDefaultsSupplier: () =>
              (0, P.factoryDefaultsForCurrentTheme)(x, b),
            nonThemedDefaultsKeys: C,
            themedDefaultsKeys: L,
            allStateKeys: R,
            themedColors: D,
            replaceThemedColorsOnThemeChange: !0,
            state: t,
            theme: e,
          })
        }
      }
      class A extends n.LineDataSource {
        constructor(e, t, i, n) {
          super(
            e,
            t ?? A.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            n,
          ),
            this._setPaneViews([new p(this, e)])
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Cyclic Lines'
        }
        template() {
          return this._properties.template()
        }
        static createProperties(e, t) {
          const i = I.create(e, t)
          return this._configureProperties(i), i
        }
        async _getPropertyDefinitionsViewModelClass() {
          return _.CyclicAndSineLinesPatternDefinitionsViewModel
        }
        static _addCollectedProperties(e) {}
      }
    },
    6590: (e, t, i) => {
      i.d(t, { commonLineToolPropertiesStateKeys: () => n })
      const n = [
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
      var o, r, s
      !((e) => {
        ;(e[(e.NotShared = 0)] = 'NotShared'),
          (e[(e.SharedInLayout = 1)] = 'SharedInLayout'),
          (e[(e.GloballyShared = 2)] = 'GloballyShared')
      })(o || (o = {})),
        ((e) => {
          ;(e.BeforeAllAction = 'BeforeAll'), (e.CustomAction = 'CustomAction')
        })(r || (r = {})),
        ((e) => {
          ;(e.FloatingToolbarButton = 'FloatingToolbarButton'),
            (e.Default = 'Default')
        })(s || (s = {}))
    },
    27916: (e, t, i) => {
      i.d(t, {
        LineSourcePaneView: () => f,
        createLineSourcePaneViewPoint: () => _,
        thirdPointCursorType: () => p,
      })
      var n = i(19625),
        o = i(50151),
        r = i(69186),
        s = i(56468),
        l = i(11064),
        a = i(36036),
        d = i(72791),
        c = i(17330)
      const h = n.colorsPalette['color-tv-blue-600']
      var u
      function p(e, t) {
        const i = t.x - e.x,
          n = t.y - e.y,
          o = Math.abs(Math.atan2(i, n))
        return o > Math.PI / 4 && o < (3 * Math.PI) / 4
          ? d.PaneCursorType.VerticalResize
          : d.PaneCursorType.HorizontalResize
      }
      function _(e, t) {
        return (e.pointIndex = t), e
      }
      !((e) => {
        ;(e[(e.RegularAnchorRadius = 6)] = 'RegularAnchorRadius'),
          (e[(e.TouchAnchorRadius = 13)] = 'TouchAnchorRadius'),
          (e[(e.RegularStrokeWidth = 1)] = 'RegularStrokeWidth'),
          (e[(e.TouchStrokeWidth = 3)] = 'TouchStrokeWidth'),
          (e[(e.RegularSelectedStrokeWidth = 3)] =
            'RegularSelectedStrokeWidth'),
          (e[(e.TouchSelectedStrokeWidth = 0)] = 'TouchSelectedStrokeWidth')
      })(u || (u = {}))
      class f {
        constructor(e, t) {
          ;(this._invalidated = !0),
            (this._points = []),
            (this._middlePoint = null),
            (this._selectionRenderers = []),
            (this._lineAnchorRenderers = []),
            (this._source = e),
            (this._model = t)
        }
        priceToCoordinate(e) {
          const t = this._source.priceScale()
          if (null === t) return null
          const i = this._source.ownerSource(),
            n = null !== i ? i.firstValue() : null
          return null === n ? null : t.priceToCoordinate(e, n)
        }
        anchorColor() {
          return h
        }
        isHoveredSource() {
          return this._source === this._model.hoveredSource()
        }
        isSelectedSource() {
          return this._model.selection().isSelected(this._source)
        }
        isBeingEdited() {
          return this._model.lineBeingEdited() === this._source
        }
        isEditMode() {
          return !this._model.isSnapshot()
        }
        areAnchorsVisible() {
          return (
            ((this.isHoveredSource() && !this.isLocked()) ||
              this.isSelectedSource()) &&
            this.isEditMode()
          )
        }
        update() {
          this._invalidated = !0
        }
        isLocked() {
          return Boolean(this._source.isLocked && this._source.isLocked())
        }
        addAnchors(e, t = {}) {
          let i = this._getPoints()
          this._model.lineBeingCreated() === this._source &&
            (i = i.slice(0, -1))
          const n = this._source.points(),
            o = i.map((e, t) => {
              const i = n[t],
                o = (0, a.lineSourcePaneViewPointToLineAnchorPoint)(e)
              return (
                i && ((o.snappingPrice = i.price), (o.snappingIndex = i.index)),
                o
              )
            })
          e.append(this.createLineAnchor({ ...t, points: o }, 0))
        }
        createLineAnchor(e, t) {
          const i = e.points.map((e) => e.point)
          if (this.isLocked()) {
            const n = this._getSelectionRenderer(t)
            return (
              n.setData({
                bgColors: this._lineAnchorColors(i),
                points: e.points,
                visible: this.areAnchorsVisible(),
                hittestResult: s.HitTarget.Regular,
                barSpacing: this._model.timeScale().barSpacing(),
              }),
              n
            )
          }
          const n = (0, r.lastMouseOrTouchEventInfo)().isTouch,
            o = this._getLineAnchorRenderer(t),
            l = this.isHoveredSource()
              ? (this._model.lastHittestData()?.pointIndex ?? null)
              : null
          return (
            o.setData({
              ...e,
              color: this.anchorColor(),
              backgroundColors: this._lineAnchorColors(i),
              hoveredPointIndex: l,
              linePointBeingEdited: this.isBeingEdited()
                ? this._model.linePointBeingEdited()
                : null,
              radius: this._anchorRadius(),
              strokeWidth: n ? u.TouchStrokeWidth : u.RegularStrokeWidth,
              selected: this.isSelectedSource(),
              selectedStrokeWidth: n
                ? u.TouchSelectedStrokeWidth
                : u.RegularSelectedStrokeWidth,
              visible: this.areAnchorsVisible(),
              clickHandler: e.clickHandler,
            }),
            o
          )
        }
        _anchorRadius() {
          return (0, r.lastMouseOrTouchEventInfo)().isTouch
            ? u.TouchAnchorRadius
            : u.RegularAnchorRadius
        }
        _lineAnchorColors(e) {
          const t = (0, o.ensureNotNull)(
            this._model.paneForSource(this._source),
          ).height()
          return e.map((e) =>
            this._model.backgroundColorAtYPercentFromTop(e.y / t),
          )
        }
        _updateImpl(e) {
          this._points = []
          this._model.timeScale().isEmpty() ||
            (this._validatePriceScale() &&
              (this._source.points().forEach((e, t) => {
                const i = this._source.pointToScreenPoint(e)
                i && this._points.push(_(i, t))
              }),
              2 === this._points.length &&
                (this._middlePoint = this._source.calcMiddlePoint(
                  this._points[0],
                  this._points[1],
                )),
              (this._invalidated = !1)))
        }
        _validatePriceScale() {
          const e = this._source.priceScale()
          return null !== e && !e.isEmpty()
        }
        _getSource() {
          return this._source
        }
        _getPoints() {
          return this._points
        }
        _getModel() {
          return this._model
        }
        _height() {
          const e = this._source.priceScale()
          return null !== e ? e.height() : 0
        }
        _width() {
          return this._model.timeScale().width()
        }
        _needLabelExclusionPath(e, t) {
          const i = this._source.properties().childs()
          return (
            'middle' === (t ?? i.vertLabelsAlign.value()) &&
            (0, c.needTextExclusionPath)(e)
          )
        }
        _addAlertRenderer(
          e,
          t,
          i = this._source.properties().linecolor.value(),
        ) {}
        _getAlertRenderer(
          e,
          t = this._source.properties().linecolor.value(),
          i,
        ) {
          return null
        }
        _getSelectionRenderer(e) {
          while (this._selectionRenderers.length <= e)
            this._selectionRenderers.push(new l.SelectionRenderer())
          return this._selectionRenderers[e]
        }
        _getLineAnchorRenderer(e) {
          while (this._lineAnchorRenderers.length <= e)
            this._lineAnchorRenderers.push(new a.LineAnchorRenderer())
          return this._lineAnchorRenderers[e]
        }
      }
    },
    38039: (e, t, i) => {
      i.d(t, { LineDataSourceProperty: () => l })
      var n = i(90054),
        o = i(16738),
        r = i(50151),
        s = i(32679)
      class l extends s.DefaultProperty {
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
          return (0, s.extractState)(this.state(), this._templateKeys, [])
        }
        applyTemplate(e) {
          this.mergeAndFire(
            (0, s.extractState)(
              (0, o.default)(
                (0, n.default)(this._factoryDefaultsSupplier()),
                e,
              ),
              this._templateKeys,
            ),
          )
        }
      }
    },
    36036: (e, t, i) => {
      i.d(t, {
        LineAnchorRenderer: () => g,
        lineSourcePaneViewPointToLineAnchorPoint: () => S,
        mapLineSourcePaneViewPointToLineAnchorPoint: () => v,
      })
      var n = i(86441),
        o = i(34026),
        r = i(50151),
        s = i(37743),
        l = i(37265),
        a = i(56468),
        d = i(72791),
        c = i(61993),
        h = i(30125)
      function u(e, t, i, n) {
        const { point: o } = t,
          r = i + n / 2
        ;(0, s.drawRoundRect)(e, o.x - r, o.y - r, 2 * r, 2 * r, (i + n) / 2),
          e.closePath(),
          (e.lineWidth = n)
      }
      function p(e, t, i, n) {
        ;(e.globalAlpha = 0.2), u(e, t, i, n), e.stroke(), (e.globalAlpha = 1)
      }
      function _(e, t, i, n) {
        u(e, t, i - n, n), e.fill(), e.stroke()
      }
      function f(e, t, i, n) {
        const { point: o } = t
        ;(e.globalAlpha = 0.2),
          e.beginPath(),
          e.arc(o.x, o.y, i + n / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = n),
          e.stroke(),
          (e.globalAlpha = 1)
      }
      function m(e, t, i, n) {
        const { point: o } = t
        e.beginPath(),
          e.arc(o.x, o.y, i - n / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = n),
          e.fill(),
          e.stroke()
      }
      class g extends h.BitmapCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = e ?? null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data || this._data.disableInteractions) return null
          const { radius: t, points: i } = this._data,
            n = t + (0, c.interactionTolerance)().anchor
          for (const t of i) {
            if (t.point.subtract(e).length() <= n)
              return new a.HitTestResult(
                t.hitTarget ?? a.HitTarget.ChangePoint,
                {
                  areaName: a.AreaName.AnchorPoint,
                  pointIndex: t.pointIndex,
                  cursorType: t.cursorType ?? d.PaneCursorType.Default,
                  activeItem: t.activeItem,
                  snappingPrice: t.snappingPrice,
                  snappingIndex: t.snappingIndex,
                  nonDiscreteIndex: t.nonDiscreteIndex,
                  possibleMovingDirections: t.possibleMovingDirections,
                  clickHandler: this._data.clickHandler,
                  tapHandler: this._data.clickHandler,
                },
              )
          }
          return null
        }
        doesIntersectWithBox(e) {
          return (
            null !== this._data &&
            this._data.points.some((t) => (0, o.pointInBox)(t.point, e))
          )
        }
        _drawImpl(e) {
          if (null === this._data || !this._data.visible) return
          const t = [],
            i = [],
            n = [],
            o = []
          for (let e = 0; e < this._data.points.length; ++e) {
            const r = this._data.points[e],
              s = this._data.backgroundColors[e]
            r.square ? (t.push(r), i.push(s)) : (n.push(r), o.push(s))
          }
          t.length && this._drawPoints(e, t, i, _, p),
            n.length && this._drawPoints(e, n, o, m, f)
        }
        _drawPoints(e, t, i, o, s) {
          const {
              context: a,
              horizontalPixelRatio: d,
              verticalPixelRatio: c,
            } = e,
            h = (0, r.ensureNotNull)(this._data),
            u = h.radius
          let p = Math.max(1, Math.floor((h.strokeWidth || 2) * d))
          h.selected && (p += Math.max(1, Math.floor(d / 2)))
          const _ = Math.max(1, Math.floor(d))
          let f = Math.round(u * d * 2)
          f % 2 != _ % 2 && (f += 1)
          const m = (_ % 2) / 2
          a.strokeStyle = h.color
          for (let e = 0; e < t.length; ++e) {
            const r = t[e]
            if (
              !(
                (0, l.isInteger)(r.pointIndex) &&
                h.linePointBeingEdited === r.pointIndex
              )
            ) {
              a.fillStyle = i[e]
              if (
                (o(
                  a,
                  {
                    ...r,
                    point: new n.Point(
                      Math.round(r.point.x * d) + m,
                      Math.round(r.point.y * c) + m,
                    ),
                  },
                  f / 2,
                  p,
                ),
                !h.disableInteractions)
              ) {
                if (
                  null !== h.hoveredPointIndex &&
                  r.pointIndex === h.hoveredPointIndex
                ) {
                  const e = Math.max(1, Math.floor(h.selectedStrokeWidth * d))
                  let t = Math.round(u * d * 2)
                  t % 2 != _ % 2 && (t += 1)
                  s(
                    a,
                    {
                      ...r,
                      point: new n.Point(
                        Math.round(r.point.x * d) + m,
                        Math.round(r.point.y * c) + m,
                      ),
                    },
                    t / 2,
                    e,
                  )
                }
              }
            }
          }
        }
      }
      function S(e, t = e.pointIndex, i, n, o, r, s, l, a, d) {
        return {
          point: e,
          pointIndex: t,
          cursorType: i,
          square: n,
          hitTarget: o,
          snappingPrice: r,
          snappingIndex: s,
          nonDiscreteIndex: l,
          activeItem: a,
          possibleMovingDirections: d,
        }
      }
      function v(e) {
        return S(e)
      }
    },
    11402: (e, t, i) => {
      i.d(t, { factoryDefaultsForCurrentTheme: () => a })
      var n = i(16738),
        o = i(90054),
        r = i(50151),
        s = i(45345),
        l = i(24633)
      function a(e, t) {
        const i = s.watchedTheme.value() ?? l.StdTheme.Light,
          a = (0, o.default)(e)
        return (0, n.default)(a, (0, r.ensureDefined)(t.get(i))), a
      }
    },
  },
])
