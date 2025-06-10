;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8090],
  {
    73174: (e, t, i) => {
      i.r(t),
        i.d(t, {
          getCoordinateXMetaInfo: () => P,
          getCoordinateYMetaInfo: () => S,
          getCoordinatesPropertiesDefinitions: () => y,
          getSelectionCoordinatesPropertyDefinition: () => w,
        })
      var n = i(50151),
        r = i(11542),
        o = i(45126),
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
      var c = i(32097),
        d = i(64147),
        h = i(12988),
        u = i(91682)
      const p = -5e4,
        _ = 15e3,
        m = new o.TranslatedString(
          'change price Y coordinate',
          r.t(null, void 0, i(11737)),
        ),
        g = new o.TranslatedString(
          'change bar X coordinate',
          r.t(null, void 0, i(2066)),
        ),
        f = new o.TranslatedString('move drawings', r.t(null, void 0, i(76261)))
      function S(e, t, i) {
        return {
          property: (0, c.convertToDefinitionProperty)(e, t.price, m),
          info: { typeY: 1, stepY: i },
        }
      }
      function P(e, t) {
        return {
          property: (0, c.convertToDefinitionProperty)(e, t.bar, g),
          info: {
            typeX: 0,
            minX: new d.WatchedValue(p),
            maxX: new d.WatchedValue(_),
            stepX: new d.WatchedValue(1),
          },
        }
      }
      function y(e, t, i, n, r, o) {
        const s = P(e, t),
          l = S(e, t, n)
        return (0, c.createCoordinatesPropertyDefinition)(
          { x: s.property, y: l.property },
          {
            id: (0, u.removeSpaces)(`${o}Coordinates${r}`),
            title: r,
            ...s.info,
            ...l.info,
          },
        )
      }
      const v = /^([+*\-\/]?)((?:\d*)|(?:\d+\.\d*))$/
      function T(e, t, i) {
        const r = new h.Property(''),
          o = (0, c.makeProxyDefinitionProperty)(r.weakReference())
        return (
          (o.setValue = (o) => {
            try {
              const r = o.match(v)
              if (!r) return
              const [, s, l] = r
              if (!l.length) return
              const c = i(Number.parseFloat(l))
              if ('/' === s && (0 === c.price || 0 === c.index)) return
              t.withMacro(f, () => {
                e.filter((e) => !e.isSourceHidden()).forEach((e) => {
                  const i = e.points()
                  let r
                  switch (s) {
                    case '': {
                      const e = (0, n.ensureDefined)(i[0])
                      let { index: t = e.index, price: o = e.price } = c
                      ;(o -= e.price),
                        (t -= e.index),
                        (r = i.map((e) => ({
                          ...e,
                          index: e.index + t,
                          price: e.price + o,
                        })))
                      break
                    }
                    case '-':
                    case '+': {
                      let { index: e = 0, price: t = 0 } = c
                      '-' === s && ((e *= -1), (t *= -1)),
                        (r = i.map((i) => ({
                          ...i,
                          index: i.index + e,
                          price: i.price + t,
                        })))
                      break
                    }
                    case '*': {
                      const { index: e = 1, price: t = 1 } = c
                      r = i.map((i) => ({
                        ...i,
                        index: i.index * e,
                        price: i.price * t,
                      }))
                      break
                    }
                    case '/': {
                      const { index: e = 1, price: t = 1 } = c
                      r = i.map((i) => ({
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
                      newPositionPoints: r,
                    }),
                  )
                })
              })
            } finally {
              r.setValue('', !0)
            }
          }),
          o
        )
      }
      function w(e, t) {
        const n = T(e, t, (e) => ({ index: e })),
          o = T(e, t, (e) => ({ price: e }))
        return (0, c.createSelectionCoordinatesPropertyDefinition)(
          { x: n, y: o },
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
    22717: (e, t, i) => {
      i.r(t), i.d(t, { LineToolFibSpiral: () => Y })
      var n = i(29875),
        r = i(19625),
        o = i(50151),
        s = i(24633),
        l = i(51056),
        a = i(31229),
        c = i(6590),
        d = i(32679),
        h = i(11402),
        u = i(38039),
        p = i(73305)
      const _ = {
          intervalsVisibilities: { ...a.intervalsVisibilitiesDefaults },
          counterclockwise: !1,
          linewidth: 2,
          linestyle: l.LINESTYLE_SOLID,
        },
        m = { linecolor: (0, r.getHexColorByName)('color-sky-blue-500') },
        g = new Map([
          [s.StdTheme.Light, m],
          [s.StdTheme.Dark, m],
        ]),
        f = (0, d.extractThemedColors)(
          (0, o.ensureDefined)(g.get(s.StdTheme.Light)),
          (0, o.ensureDefined)(g.get(s.StdTheme.Dark)),
        ),
        S = (0, d.extractAllPropertiesKeys)(
          (0, o.ensureDefined)(g.get(s.StdTheme.Light)),
        ),
        P = (0, d.extractAllPropertiesKeys)(_),
        y = [...new Set([...S, ...P, ...c.commonLineToolPropertiesStateKeys])]
      class v extends u.LineDataSourceProperty {
        constructor(e) {
          super(e),
            this.addChild(
              'linesColors',
              new p.LineToolColorsProperty([
                (0, o.ensureDefined)(this.child('linecolor')),
              ]),
            ),
            this.addChild(
              'linesWidths',
              new p.LineToolWidthsProperty([
                (0, o.ensureDefined)(this.child('linewidth')),
              ]),
            )
        }
        static create(e, t) {
          return new this({
            defaultName: 'linetoolfibspiral',
            factoryDefaultsSupplier: () =>
              (0, h.factoryDefaultsForCurrentTheme)(_, g),
            nonThemedDefaultsKeys: P,
            themedDefaultsKeys: S,
            allStateKeys: y,
            themedColors: f,
            replaceThemedColorsOnThemeChange: !0,
            state: t,
            theme: e,
          })
        }
      }
      var T = i(95201),
        w = i(49857),
        b = i(91046),
        x = i(27916),
        k = i(56468),
        C = i(37743),
        D = i(61993),
        I = i(75919)
      const M = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
      class R extends I.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data || this._data.points.length < 2) return null
          const t = this._data.points[0],
            i = this._data.points[1].subtract(t),
            n = e.subtract(t),
            r = i.normalized(),
            o = r.transposed(),
            s = n.normalized()
          let l = Math.acos(r.dotProduct(s))
          Math.asin(o.dotProduct(s)) < 0 && (l = 2 * Math.PI - l)
          const a = this._data.counterclockwise ? -1 : 1,
            c = n.length(),
            d = (0, D.interactionTolerance)().curve
          for (let e = 0; e < 4; e++) {
            const t = (a * l) / (0.5 * Math.PI)
            let n = this._continiusFib(t + 4 * e)
            if (null !== n && ((n = (n * i.length()) / 5), Math.abs(n - c) < d))
              return new k.HitTestResult(k.HitTarget.MovePoint)
          }
          return null
        }
        _drawImpl(e) {
          if (null === this._data || this._data.points.length < 2) return
          const t = e.context
          ;(t.lineCap = 'round'), (t.strokeStyle = this._data.color)
          const i = this._data.points[0],
            n = this._data.points[1]
          t.translate(i.x, i.y)
          let r = n.subtract(i)
          const o = r.length()
          r = r.normalized()
          let s = Math.acos(r.x)
          Math.asin(r.y) < 0 && (s = 2 * Math.PI - s),
            t.rotate(s),
            t.scale(o / 5, o / 5),
            (t.lineWidth = this._data.linewidth),
            (0, C.setLineStyle)(t, this._data.linestyle)
          const l = Math.PI / 100
          t.moveTo(0, 0)
          const a = this._data.counterclockwise ? -1 : 1
          for (let e = 0; e < 50 * (M.length - 1); e++) {
            const i = a * e * l,
              n = this._continiusFib(e / 50)
            if (null === n) break
            const r = Math.cos(i) * n,
              o = Math.sin(i) * n
            t.lineTo(r, o)
          }
          t.scale(5 / o, 5 / o), t.rotate(-s), t.stroke()
        }
        _continiusFib(e) {
          const t = Math.floor(e),
            i = Math.ceil(e)
          if (i >= M.length) return null
          let n = e - t
          n = Math.pow(n, 1.15)
          return M[t] + (M[i] - M[t]) * n
        }
      }
      class A extends x.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._trendLineRenderer = new b.TrendLineRenderer()),
            (this._spiralRenderer = new R()),
            (this._renderer = null)
        }
        renderer(e) {
          return this._invalidated && this._updateImpl(e), this._renderer
        }
        _updateImpl(e) {
          if (
            (super._updateImpl(e),
            (this._renderer = null),
            this._points.length < 2)
          )
            return
          const t = new T.CompositeRenderer(),
            i = this._source.properties().childs()
          {
            const e = {
              points: [this._points[0], this._points[1]],
              color: i.linecolor.value(),
              linewidth: i.linewidth.value(),
              linestyle: i.linestyle.value(),
              extendleft: !1,
              extendright: !0,
              leftend: w.LineEnd.Normal,
              rightend: w.LineEnd.Normal,
            }
            this._trendLineRenderer.setData(e),
              t.append(this._trendLineRenderer)
          }
          {
            const e = {
              points: this._points,
              color: i.linecolor.value(),
              linewidth: i.linewidth.value(),
              linestyle: i.linestyle.value(),
              counterclockwise: i.counterclockwise.value(),
            }
            this._spiralRenderer.setData(e), t.append(this._spiralRenderer)
          }
          this.addAnchors(t), (this._renderer = t)
        }
      }
      var L = i(11542),
        V = i(45126),
        W = i(32097),
        E = i(18009),
        F = i(91682)
      const H = new V.TranslatedString(
          'change {title} line color',
          L.t(null, void 0, i(7455)),
        ),
        N = new V.TranslatedString(
          'change {title} line width',
          L.t(null, void 0, i(46040)),
        ),
        B = new V.TranslatedString(
          'change {title} line style',
          L.t(null, void 0, i(30843)),
        ),
        K = new V.TranslatedString(
          'change {title} counterclockwise',
          L.t(null, void 0, i(60003)),
        ),
        z = L.t(null, void 0, i(3554)),
        O = L.t(null, void 0, i(33004))
      class X extends E.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, F.removeSpaces)(t),
            n = new V.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, W.createLinePropertyDefinition)(
                {
                  color: (0, W.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.linecolor,
                    null,
                    H.format({ title: n }),
                  ),
                  width: (0, W.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.linewidth,
                    N.format({ title: n }),
                  ),
                  style: (0, W.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.linestyle,
                    B.format({ title: n }),
                  ),
                },
                { id: `${i}Line`, title: z },
              ),
              (0, W.createCheckablePropertyDefinition)(
                {
                  checked: (0, W.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.counterclockwise,
                    K.format({ title: n }),
                  ),
                },
                { id: `${i}Counterclockwise`, title: O },
              ),
            ],
          }
        }
      }
      class Y extends n.LineDataSource {
        constructor(e, t, i, n) {
          super(
            e,
            t ?? Y.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            n,
          ),
            this._setPaneViews([new A(this, e)])
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Fib Spiral'
        }
        template() {
          return this._properties.template()
        }
        static createProperties(e, t) {
          const i = v.create(e, t)
          return this._configureProperties(i), i
        }
        async _getPropertyDefinitionsViewModelClass() {
          return X
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
      var r, o, s
      !((e) => {
        ;(e[(e.NotShared = 0)] = 'NotShared'),
          (e[(e.SharedInLayout = 1)] = 'SharedInLayout'),
          (e[(e.GloballyShared = 2)] = 'GloballyShared')
      })(r || (r = {})),
        ((e) => {
          ;(e.BeforeAllAction = 'BeforeAll'), (e.CustomAction = 'CustomAction')
        })(o || (o = {})),
        ((e) => {
          ;(e.FloatingToolbarButton = 'FloatingToolbarButton'),
            (e.Default = 'Default')
        })(s || (s = {}))
    },
    27916: (e, t, i) => {
      i.d(t, {
        LineSourcePaneView: () => m,
        createLineSourcePaneViewPoint: () => _,
        thirdPointCursorType: () => p,
      })
      var n = i(19625),
        r = i(50151),
        o = i(69186),
        s = i(56468),
        l = i(11064),
        a = i(36036),
        c = i(72791),
        d = i(17330)
      const h = n.colorsPalette['color-tv-blue-600']
      var u
      function p(e, t) {
        const i = t.x - e.x,
          n = t.y - e.y,
          r = Math.abs(Math.atan2(i, n))
        return r > Math.PI / 4 && r < (3 * Math.PI) / 4
          ? c.PaneCursorType.VerticalResize
          : c.PaneCursorType.HorizontalResize
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
      class m {
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
            r = i.map((e, t) => {
              const i = n[t],
                r = (0, a.lineSourcePaneViewPointToLineAnchorPoint)(e)
              return (
                i && ((r.snappingPrice = i.price), (r.snappingIndex = i.index)),
                r
              )
            })
          e.append(this.createLineAnchor({ ...t, points: r }, 0))
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
          const n = (0, o.lastMouseOrTouchEventInfo)().isTouch,
            r = this._getLineAnchorRenderer(t),
            l = this.isHoveredSource()
              ? (this._model.lastHittestData()?.pointIndex ?? null)
              : null
          return (
            r.setData({
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
            r
          )
        }
        _anchorRadius() {
          return (0, o.lastMouseOrTouchEventInfo)().isTouch
            ? u.TouchAnchorRadius
            : u.RegularAnchorRadius
        }
        _lineAnchorColors(e) {
          const t = (0, r.ensureNotNull)(
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
            (0, d.needTextExclusionPath)(e)
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
        r = i(16738),
        o = i(50151),
        s = i(32679)
      class l extends s.DefaultProperty {
        constructor({ templateKeys: e, ...t }) {
          super({
            ignoreAllowSavingDefaults: !0,
            saveNonDefaultUserPreferencesOnly: !0,
            ...t,
          }),
            (this._templateKeys = (0, o.ensureDefined)(
              e || this._allDefaultsKeys,
            ))
        }
        template() {
          return (0, s.extractState)(this.state(), this._templateKeys, [])
        }
        applyTemplate(e) {
          this.mergeAndFire(
            (0, s.extractState)(
              (0, r.default)(
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
        LineAnchorRenderer: () => f,
        lineSourcePaneViewPointToLineAnchorPoint: () => S,
        mapLineSourcePaneViewPointToLineAnchorPoint: () => P,
      })
      var n = i(86441),
        r = i(34026),
        o = i(50151),
        s = i(37743),
        l = i(37265),
        a = i(56468),
        c = i(72791),
        d = i(61993),
        h = i(30125)
      function u(e, t, i, n) {
        const { point: r } = t,
          o = i + n / 2
        ;(0, s.drawRoundRect)(e, r.x - o, r.y - o, 2 * o, 2 * o, (i + n) / 2),
          e.closePath(),
          (e.lineWidth = n)
      }
      function p(e, t, i, n) {
        ;(e.globalAlpha = 0.2), u(e, t, i, n), e.stroke(), (e.globalAlpha = 1)
      }
      function _(e, t, i, n) {
        u(e, t, i - n, n), e.fill(), e.stroke()
      }
      function m(e, t, i, n) {
        const { point: r } = t
        ;(e.globalAlpha = 0.2),
          e.beginPath(),
          e.arc(r.x, r.y, i + n / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = n),
          e.stroke(),
          (e.globalAlpha = 1)
      }
      function g(e, t, i, n) {
        const { point: r } = t
        e.beginPath(),
          e.arc(r.x, r.y, i - n / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = n),
          e.fill(),
          e.stroke()
      }
      class f extends h.BitmapCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = e ?? null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data || this._data.disableInteractions) return null
          const { radius: t, points: i } = this._data,
            n = t + (0, d.interactionTolerance)().anchor
          for (const t of i) {
            if (t.point.subtract(e).length() <= n)
              return new a.HitTestResult(
                t.hitTarget ?? a.HitTarget.ChangePoint,
                {
                  areaName: a.AreaName.AnchorPoint,
                  pointIndex: t.pointIndex,
                  cursorType: t.cursorType ?? c.PaneCursorType.Default,
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
            this._data.points.some((t) => (0, r.pointInBox)(t.point, e))
          )
        }
        _drawImpl(e) {
          if (null === this._data || !this._data.visible) return
          const t = [],
            i = [],
            n = [],
            r = []
          for (let e = 0; e < this._data.points.length; ++e) {
            const o = this._data.points[e],
              s = this._data.backgroundColors[e]
            o.square ? (t.push(o), i.push(s)) : (n.push(o), r.push(s))
          }
          t.length && this._drawPoints(e, t, i, _, p),
            n.length && this._drawPoints(e, n, r, g, m)
        }
        _drawPoints(e, t, i, r, s) {
          const {
              context: a,
              horizontalPixelRatio: c,
              verticalPixelRatio: d,
            } = e,
            h = (0, o.ensureNotNull)(this._data),
            u = h.radius
          let p = Math.max(1, Math.floor((h.strokeWidth || 2) * c))
          h.selected && (p += Math.max(1, Math.floor(c / 2)))
          const _ = Math.max(1, Math.floor(c))
          let m = Math.round(u * c * 2)
          m % 2 != _ % 2 && (m += 1)
          const g = (_ % 2) / 2
          a.strokeStyle = h.color
          for (let e = 0; e < t.length; ++e) {
            const o = t[e]
            if (
              !(
                (0, l.isInteger)(o.pointIndex) &&
                h.linePointBeingEdited === o.pointIndex
              )
            ) {
              a.fillStyle = i[e]
              if (
                (r(
                  a,
                  {
                    ...o,
                    point: new n.Point(
                      Math.round(o.point.x * c) + g,
                      Math.round(o.point.y * d) + g,
                    ),
                  },
                  m / 2,
                  p,
                ),
                !h.disableInteractions)
              ) {
                if (
                  null !== h.hoveredPointIndex &&
                  o.pointIndex === h.hoveredPointIndex
                ) {
                  const e = Math.max(1, Math.floor(h.selectedStrokeWidth * c))
                  let t = Math.round(u * c * 2)
                  t % 2 != _ % 2 && (t += 1)
                  s(
                    a,
                    {
                      ...o,
                      point: new n.Point(
                        Math.round(o.point.x * c) + g,
                        Math.round(o.point.y * d) + g,
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
      function S(e, t = e.pointIndex, i, n, r, o, s, l, a, c) {
        return {
          point: e,
          pointIndex: t,
          cursorType: i,
          square: n,
          hitTarget: r,
          snappingPrice: o,
          snappingIndex: s,
          nonDiscreteIndex: l,
          activeItem: a,
          possibleMovingDirections: c,
        }
      }
      function P(e) {
        return S(e)
      }
    },
    11402: (e, t, i) => {
      i.d(t, { factoryDefaultsForCurrentTheme: () => a })
      var n = i(16738),
        r = i(90054),
        o = i(50151),
        s = i(45345),
        l = i(24633)
      function a(e, t) {
        const i = s.watchedTheme.value() ?? l.StdTheme.Light,
          a = (0, r.default)(e)
        return (0, n.default)(a, (0, o.ensureDefined)(t.get(i))), a
      }
    },
  },
])
