;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [380],
  {
    73174: (e, t, i) => {
      i.r(t),
        i.d(t, {
          getCoordinateXMetaInfo: () => _,
          getCoordinateYMetaInfo: () => v,
          getCoordinatesPropertiesDefinitions: () => T,
          getSelectionCoordinatesPropertyDefinition: () => P,
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
        d = i(64147),
        u = i(12988),
        h = i(91682)
      const p = -5e4,
        g = 15e3,
        m = new r.TranslatedString(
          'change price Y coordinate',
          n.t(null, void 0, i(11737)),
        ),
        f = new r.TranslatedString(
          'change bar X coordinate',
          n.t(null, void 0, i(2066)),
        ),
        b = new r.TranslatedString('move drawings', n.t(null, void 0, i(76261)))
      function v(e, t, i) {
        return {
          property: (0, c.convertToDefinitionProperty)(e, t.price, m),
          info: { typeY: 1, stepY: i },
        }
      }
      function _(e, t) {
        return {
          property: (0, c.convertToDefinitionProperty)(e, t.bar, f),
          info: {
            typeX: 0,
            minX: new d.WatchedValue(p),
            maxX: new d.WatchedValue(g),
            stepX: new d.WatchedValue(1),
          },
        }
      }
      function T(e, t, i, o, n, r) {
        const l = _(e, t),
          s = v(e, t, o)
        return (0, c.createCoordinatesPropertyDefinition)(
          { x: l.property, y: s.property },
          {
            id: (0, h.removeSpaces)(`${r}Coordinates${n}`),
            title: n,
            ...l.info,
            ...s.info,
          },
        )
      }
      const S = /^([+*\-\/]?)((?:\d*)|(?:\d+\.\d*))$/
      function x(e, t, i) {
        const n = new u.Property(''),
          r = (0, c.makeProxyDefinitionProperty)(n.weakReference())
        return (
          (r.setValue = (r) => {
            try {
              const n = r.match(S)
              if (!n) return
              const [, l, s] = n
              if (!s.length) return
              const c = i(Number.parseFloat(s))
              if ('/' === l && (0 === c.price || 0 === c.index)) return
              t.withMacro(b, () => {
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
      function P(e, t) {
        const o = x(e, t, (e) => ({ index: e })),
          r = x(e, t, (e) => ({ price: e }))
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
      i.d(t, { createTextStyleDefinition: () => C })
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
        d = new n.TranslatedString(
          'change {toolName} text font bold',
          o.t(null, void 0, i(24701)),
        ),
        u = new n.TranslatedString(
          'change {toolName} text font italic',
          o.t(null, void 0, i(42694)),
        ),
        h = new n.TranslatedString(
          'change {toolName} text',
          o.t(null, void 0, i(66668)),
        ),
        p = new n.TranslatedString(
          'change {toolName} labels alignment vertical',
          o.t(null, void 0, i(31689)),
        ),
        g = new n.TranslatedString(
          'change {toolName} labels alignment horizontal',
          o.t(null, void 0, i(88277)),
        ),
        m = new n.TranslatedString(
          'change {toolName} labels direction',
          o.t(null, void 0, i(61160)),
        ),
        f = new n.TranslatedString(
          'change {toolName} text background visibility',
          o.t(null, void 0, i(31133)),
        ),
        b = new n.TranslatedString(
          'change {toolName} text background color',
          o.t(null, void 0, i(22231)),
        ),
        v = new n.TranslatedString(
          'change {toolName} text border visibility',
          o.t(null, void 0, i(58704)),
        ),
        _ = new n.TranslatedString(
          'change {toolName} text border width',
          o.t(null, void 0, i(35423)),
        ),
        T = new n.TranslatedString(
          'change {toolName} text border color',
          o.t(null, void 0, i(36666)),
        ),
        S = new n.TranslatedString(
          'change {toolName} text wrap',
          o.t(null, void 0, i(39587)),
        ),
        x = o.t(null, void 0, i(79468)),
        P = o.t(null, void 0, i(38408)),
        y = o.t(null, void 0, i(7560))
      function C(e, t, i, o) {
        const n = {},
          C = {
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
              d.format({ toolName: i }),
            )),
          void 0 !== t.italic &&
            (n.italic = (0, r.convertToDefinitionProperty)(
              e,
              t.italic,
              u.format({ toolName: i }),
            )),
          void 0 !== t.text &&
            ((n.text = (0, r.convertToDefinitionProperty)(
              e,
              t.text,
              h.format({ toolName: i }),
            )),
            (C.isEditable = Boolean(o.isEditable)),
            (C.isMultiLine = Boolean(o.isMultiLine))),
          void 0 !== t.vertLabelsAlign &&
            ((n.alignmentVertical = (0, r.convertToDefinitionProperty)(
              e,
              t.vertLabelsAlign,
              p.format({ toolName: i }),
            )),
            (C.alignmentVerticalItems = o.alignmentVerticalItems)),
          void 0 !== t.horzLabelsAlign &&
            ((n.alignmentHorizontal = (0, r.convertToDefinitionProperty)(
              e,
              t.horzLabelsAlign,
              g.format({ toolName: i }),
            )),
            (C.alignmentHorizontalItems = o.alignmentHorizontalItems)),
          void 0 !== t.textOrientation &&
            (n.orientation = (0, r.convertToDefinitionProperty)(
              e,
              t.textOrientation,
              m.format({ toolName: i }),
            )),
          void 0 !== t.backgroundVisible &&
            (n.backgroundVisible = (0, r.convertToDefinitionProperty)(
              e,
              t.backgroundVisible,
              f.format({ toolName: i }),
            )),
          void 0 !== t.backgroundColor)
        ) {
          let o = null
          void 0 !== t.backgroundTransparency && (o = t.backgroundTransparency),
            (n.backgroundColor = (0, r.getColorDefinitionProperty)(
              e,
              t.backgroundColor,
              o,
              b.format({ toolName: i }),
            ))
        }
        return (
          (void 0 === t.backgroundVisible && void 0 === t.backgroundColor) ||
            (C.backgroundTitle =
              (o.customTitles && o.customTitles.backgroundTitle) || x),
          void 0 !== t.borderVisible &&
            (n.borderVisible = (0, r.convertToDefinitionProperty)(
              e,
              t.borderVisible,
              v.format({ toolName: i }),
            )),
          void 0 !== t.borderWidth &&
            (n.borderWidth = (0, r.convertToDefinitionProperty)(
              e,
              t.borderWidth,
              _.format({ toolName: i }),
            )),
          void 0 !== t.borderColor &&
            (n.borderColor = (0, r.getColorDefinitionProperty)(
              e,
              t.borderColor,
              null,
              T.format({ toolName: i }),
            )),
          (void 0 === t.borderVisible &&
            void 0 === t.borderColor &&
            void 0 === t.borderWidth) ||
            (C.borderTitle =
              (o.customTitles && o.customTitles.borderTitle) || P),
          void 0 !== t.wrap &&
            ((n.wrap = (0, r.convertToDefinitionProperty)(
              e,
              t.wrap,
              S.format({ toolName: i }),
            )),
            (C.wrapTitle = (o.customTitles && o.customTitles.wrapTitle) || y)),
          (0, r.createTextPropertyDefinition)(n, C)
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
    27916: (e, t, i) => {
      i.d(t, {
        LineSourcePaneView: () => m,
        createLineSourcePaneViewPoint: () => g,
        thirdPointCursorType: () => p,
      })
      var o = i(19625),
        n = i(50151),
        r = i(69186),
        l = i(56468),
        s = i(11064),
        a = i(36036),
        c = i(72791),
        d = i(17330)
      const u = o.colorsPalette['color-tv-blue-600']
      var h
      function p(e, t) {
        const i = t.x - e.x,
          o = t.y - e.y,
          n = Math.abs(Math.atan2(i, o))
        return n > Math.PI / 4 && n < (3 * Math.PI) / 4
          ? c.PaneCursorType.VerticalResize
          : c.PaneCursorType.HorizontalResize
      }
      function g(e, t) {
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
      })(h || (h = {}))
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
            o = null !== i ? i.firstValue() : null
          return null === o ? null : t.priceToCoordinate(e, o)
        }
        anchorColor() {
          return u
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
          const o = this._source.points(),
            n = i.map((e, t) => {
              const i = o[t],
                n = (0, a.lineSourcePaneViewPointToLineAnchorPoint)(e)
              return (
                i && ((n.snappingPrice = i.price), (n.snappingIndex = i.index)),
                n
              )
            })
          e.append(this.createLineAnchor({ ...t, points: n }, 0))
        }
        createLineAnchor(e, t) {
          const i = e.points.map((e) => e.point)
          if (this.isLocked()) {
            const o = this._getSelectionRenderer(t)
            return (
              o.setData({
                bgColors: this._lineAnchorColors(i),
                points: e.points,
                visible: this.areAnchorsVisible(),
                hittestResult: l.HitTarget.Regular,
                barSpacing: this._model.timeScale().barSpacing(),
              }),
              o
            )
          }
          const o = (0, r.lastMouseOrTouchEventInfo)().isTouch,
            n = this._getLineAnchorRenderer(t),
            s = this.isHoveredSource()
              ? (this._model.lastHittestData()?.pointIndex ?? null)
              : null
          return (
            n.setData({
              ...e,
              color: this.anchorColor(),
              backgroundColors: this._lineAnchorColors(i),
              hoveredPointIndex: s,
              linePointBeingEdited: this.isBeingEdited()
                ? this._model.linePointBeingEdited()
                : null,
              radius: this._anchorRadius(),
              strokeWidth: o ? h.TouchStrokeWidth : h.RegularStrokeWidth,
              selected: this.isSelectedSource(),
              selectedStrokeWidth: o
                ? h.TouchSelectedStrokeWidth
                : h.RegularSelectedStrokeWidth,
              visible: this.areAnchorsVisible(),
              clickHandler: e.clickHandler,
            }),
            n
          )
        }
        _anchorRadius() {
          return (0, r.lastMouseOrTouchEventInfo)().isTouch
            ? h.TouchAnchorRadius
            : h.RegularAnchorRadius
        }
        _lineAnchorColors(e) {
          const t = (0, n.ensureNotNull)(
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
                i && this._points.push(g(i, t))
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
            this._selectionRenderers.push(new s.SelectionRenderer())
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
    31761: (e, t, i) => {
      i.d(t, { alignByAngle: () => n })
      var o = i(30699)
      function n(e) {
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
    36875: (e, t, i) => {
      i.r(t), i.d(t, { LineToolPriceNote: () => ie })
      var o = i(50151),
        n = i(29875),
        r = i(19625),
        l = i(24633),
        s = i(30699),
        a = i(6590),
        c = i(73305),
        d = i(31229),
        u = i(32679),
        h = i(11402),
        p = i(38039)
      const g = {
          intervalsVisibilities: { ...d.intervalsVisibilitiesDefaults },
          showLabel: !1,
          horzLabelsAlign: s.HorizontalAlign.Center,
          vertLabelsAlign: s.VerticalAlign.Bottom,
          fontSize: 14,
          bold: !1,
          italic: !1,
          priceLabelFontSize: 12,
          priceLabelBold: !1,
          priceLabelItalic: !1,
        },
        m = (0, r.getHexColorByName)('color-tv-blue-500'),
        f = {
          lineColor: m,
          textColor: m,
          priceLabelBackgroundColor: m,
          priceLabelBorderColor: m,
          priceLabelTextColor: (0, r.getHexColorByName)('color-white'),
        },
        b = new Map([
          [l.StdTheme.Light, f],
          [l.StdTheme.Dark, f],
        ]),
        v = (0, u.extractThemedColors)(
          (0, o.ensureDefined)(b.get(l.StdTheme.Light)),
          (0, o.ensureDefined)(b.get(l.StdTheme.Dark)),
        ),
        _ = (0, u.extractAllPropertiesKeys)(
          (0, o.ensureDefined)(b.get(l.StdTheme.Light)),
        ),
        T = (0, u.extractAllPropertiesKeys)(g),
        S = [
          ...new Set([
            ..._,
            ...T,
            ...a.commonLineToolPropertiesStateKeys,
            'text',
          ]),
        ],
        x = [...new Set([..._, ...T, 'text'])]
      class P extends p.LineDataSourceProperty {
        constructor(e) {
          super(e),
            this.hasChild('text') || this.addProperty('text', ''),
            this.addChild(
              'linesColors',
              new c.LineToolColorsProperty([
                (0, o.ensureDefined)(this.child('lineColor')),
              ]),
            ),
            this.addChild(
              'backgroundsColors',
              new c.LineToolColorsProperty([
                (0, o.ensureDefined)(this.child('priceLabelBackgroundColor')),
              ]),
            ),
            this.addChild(
              'textsColors',
              new c.LineToolColorsProperty([
                (0, o.ensureDefined)(this.child('priceLabelTextColor')),
              ]),
            )
        }
        static create(e, t) {
          return new this({
            defaultName: 'linetoolpricenote',
            factoryDefaultsSupplier: () =>
              (0, h.factoryDefaultsForCurrentTheme)(g, b),
            nonThemedDefaultsKeys: T,
            themedDefaultsKeys: _,
            allStateKeys: S,
            themedColors: v,
            templateKeys: x,
            replaceThemedColorsOnThemeChange: !0,
            state: t,
            theme: e,
          })
        }
      }
      var y,
        C,
        w = i(44672),
        L = i(86441),
        A = i(95201),
        D = i(17330),
        k = i(27916),
        R = i(36036),
        M = i(4652),
        V = i(51056),
        I = i(7114),
        N = i(15938),
        z = i(69186),
        B = i(56468),
        H = i(37743),
        W = i(61993),
        E = i(31761)
      !((e) => {
        e[(e.Label = 1)] = 'Label'
      })(y || (y = {})),
        ((e) => {
          ;(e[(e.Tolerance = 3)] = 'Tolerance'),
            (e[(e.TouchTolerance = 20)] = 'TouchTolerance'),
            (e[(e.LineWidth = 1)] = 'LineWidth'),
            (e[(e.CircleRadius = 2)] = 'CircleRadius'),
            (e[(e.CircleStrokeWidth = 1)] = 'CircleStrokeWidth'),
            (e[(e.BackgroundRoundRect = 4)] = 'BackgroundRoundRect'),
            (e[(e.PriceLabelFontSize = 12)] = 'PriceLabelFontSize'),
            (e[(e.LabelVertPadding = 6)] = 'LabelVertPadding'),
            (e[(e.LabelHorzPadding = 8)] = 'LabelHorzPadding')
        })(C || (C = {}))
      class F {
        constructor() {
          ;(this._data = null),
            (this._priceLabelRenderer = new D.TextRenderer(
              void 0,
              new B.HitTestResult(B.HitTarget.MovePoint, {
                areaName: B.AreaName.Style,
                activeItem: 1,
              }),
            )),
            (this._hittest = new B.HitTestResult(B.HitTarget.MovePoint, {
              areaName: B.AreaName.Style,
            }))
        }
        setData(e) {
          this._data = e
          const t = e.points[0],
            i = e.points[1],
            o = Math.round((180 * Math.atan2(i.y - t.y, i.x - t.x)) / Math.PI)
          this._priceLabelRenderer.setData({
            ...(0, E.alignByAngle)(o),
            points: [i],
            text: e.text,
            color: e.textColor,
            font: N.CHART_FONT_FAMILY,
            fontSize: e.fontSize,
            bold: e.bold,
            italic: e.italic,
            offsetX: 0,
            offsetY: 0,
            borderColor: e.borderColor,
            borderWidth: 1,
            backgroundColor: e.backgroundColor,
            backgroundRoundRect: 4,
            boxPaddingVert: 6,
            boxPaddingHorz: 8,
          })
        }
        setHitTest(e) {
          this._hittest = e
        }
        draw(e, t) {
          const i = this._data
          if (null === i || i.points.length < 2) return
          e.save()
          const { horizontalPixelRatio: o, verticalPixelRatio: n } = t,
            r = Math.round(i.points[0].x * o),
            l = Math.round(i.points[0].y * n),
            s = Math.round(i.points[1].x * o),
            a = Math.round(i.points[1].y * n)
          ;(e.lineCap = 'round'),
            (0, H.setLineStyle)(e, V.LINESTYLE_SOLID),
            (e.strokeStyle = i.lineColor),
            (e.fillStyle = i.lineColor),
            (e.lineWidth = Math.round(1 * o))
          const c = (0, W.fillScaledRadius)(2, o)
          ;(0, H.createCircle)(e, r, l, c),
            e.fill(),
            void 0 !== i.excludeBoundaries &&
              (e.save(), (0, I.addExclusionArea)(e, t, i.excludeBoundaries)),
            (0, H.drawLine)(e, r, l, s, a),
            void 0 !== i.excludeBoundaries && e.restore(),
            this._priceLabelRenderer.draw(e, t)
          const d = 1 * o
          ;(e.strokeStyle = i.circleBorderColor), (e.lineWidth = d)
          const u = c + d / 2
          ;(0, H.createCircle)(e, r, l, u), e.stroke(), e.restore()
        }
        hitTest(e) {
          const t = this._data
          if (null === t) return null
          const i = (0, z.lastMouseOrTouchEventInfo)().isTouch ? 20 : 3
          return (0, M.distanceToSegment)(t.points[0], t.points[1], e)
            .distance <= i
            ? this._hittest
            : this._priceLabelRenderer.hitTest(e)
        }
      }
      class O extends k.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._renderer = new A.CompositeRenderer()),
            (this._priceNoteRenderer = new F()),
            (this._customLabelRenderer = new D.TextRenderer())
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
          const n = (0, o.ensureNotNull)(
            this._source.ownerSource(),
          ).firstValue()
          if (null === n) return
          const l = this._source.properties().childs(),
            a = this._model.dark().value()
              ? r.colorsPalette['color-cold-gray-900']
              : r.colorsPalette['color-white'],
            c = this._source.points()[0].price,
            d = {
              text: t.formatPrice(c, n),
              points: i,
              lineColor: l.lineColor.value(),
              circleBorderColor: a,
              backgroundColor: l.priceLabelBackgroundColor.value(),
              borderColor: l.priceLabelBorderColor.value(),
              textColor: l.priceLabelTextColor.value(),
              fontSize: l.priceLabelFontSize.value(),
              bold: l.priceLabelBold.value(),
              italic: l.priceLabelItalic.value(),
            }
          if (l.showLabel && l.showLabel.value()) {
            const t = i[0],
              o = i[1],
              n = t.x < o.x ? t : o,
              r = n === t ? o : t,
              a = l.vertLabelsAlign.value(),
              c = l.horzLabelsAlign.value()
            let u
            u =
              'left' === c
                ? n.clone()
                : 'right' === c
                  ? r.clone()
                  : new L.Point((t.x + o.x) / 2, (t.y + o.y) / 2)
            const h = Math.atan((r.y - n.y) / (r.x - n.x)),
              p = {
                points: [u],
                text: l.text.value(),
                color: l.textColor.value(),
                vertAlign: a,
                horzAlign: c,
                font: N.CHART_FONT_FAMILY,
                offsetX: 0,
                offsetY: 0,
                bold: l.bold.value(),
                italic: l.italic.value(),
                fontsize: l.fontSize.value(),
                forceTextAlign: !0,
                angle: h,
              }
            if (
              (this._customLabelRenderer.setData(p),
              this._renderer.append(this._customLabelRenderer),
              a === s.VerticalAlign.Middle)
            ) {
              const {
                mediaSize: { width: t, height: i },
              } = e
              d.excludeBoundaries =
                (0, D.getTextBoundaries)(this._customLabelRenderer, t, i) ??
                void 0
            }
          }
          this._renderer.append(this._priceNoteRenderer),
            this._priceNoteRenderer.setData(d),
            this._renderer.append(
              this.createLineAnchor(
                {
                  points: i.map(R.mapLineSourcePaneViewPointToLineAnchorPoint),
                },
                0,
              ),
            )
        }
      }
      var K = i(11542),
        Y = i(45126),
        X = i(91335),
        $ = i(18009),
        U = i(32097),
        q = i(91682)
      const G = new Y.TranslatedString(
          'change {title} line color',
          K.t(null, void 0, i(7455)),
        ),
        j = K.t(null, void 0, i(95170)),
        J = K.t(null, void 0, i(70320)),
        Q = K.t(null, void 0, i(97575)),
        Z = K.t(null, void 0, i(34974)),
        ee = K.t(null, void 0, i(73863))
      class te extends $.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, q.removeSpaces)(t),
            o = new Y.TranslatedString(t, this._source.translatedType()),
            n = (0, U.createColorPropertyDefinition)(
              {
                color: (0, U.getColorDefinitionProperty)(
                  this._propertyApplier,
                  e.lineColor,
                  null,
                  G.format({ title: o }),
                ),
              },
              { id: `${i}LineColor`, title: Q },
            )
          return {
            definitions: [
              (0, X.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.priceLabelTextColor,
                  fontSize: e.priceLabelFontSize,
                  bold: e.priceLabelBold,
                  italic: e.priceLabelItalic,
                  backgroundColor: e.priceLabelBackgroundColor,
                  borderColor: e.priceLabelBorderColor,
                },
                o,
                {
                  isEditable: !1,
                  isMultiLine: !1,
                  customTitles: {
                    text: j,
                    borderTitle: Z,
                    backgroundTitle: ee,
                  },
                },
              ),
              n,
            ],
          }
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, X.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  showText: e.showLabel,
                  textColor: e.textColor,
                  fontSize: e.fontSize,
                },
                new Y.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: J } },
              ),
            ],
          }
        }
      }
      class ie extends n.LineDataSource {
        constructor(e, t, i, o) {
          super(
            e,
            t ?? ie.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            o,
          ),
            (this._labelMovingDelta = null),
            this._setPaneViews([new O(this, e)])
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Price Note'
        }
        template() {
          return this._properties.template()
        }
        startMoving(e, t, i) {
          if (1 === t) {
            if (this.isSourceHidden()) return
            const i = (0, o.ensureDefined)(e.logical),
              n = this.points()[1]
            ;(this._labelMovingDelta = {
              index: n.index - i.index,
              price: n.price - i.price,
            }),
              this.startChanging(t, i)
          } else (this._labelMovingDelta = null), super.startMoving(e, t, i)
        }
        move(e, t, i) {
          if (null !== this._labelMovingDelta) {
            const t = (0, o.ensureDefined)(e.logical),
              n = {
                index: t.index + this._labelMovingDelta.index,
                price: t.price + this._labelMovingDelta.price,
              }
            this.setPoint(1, n, i),
              this.updateAllViews((0, w.sourceChangeEvent)(this.id()))
          } else super.move(e, t, i)
        }
        endMoving(e, t, i) {
          return null !== this._labelMovingDelta
            ? ((this._labelMovingDelta = null), this.endChanging(!1, e))
            : super.endMoving(e, t, i)
        }
        snapTo45DegreesAvailable() {
          return !0
        }
        static createProperties(e, t) {
          const i = P.create(e, t)
          return this._configureProperties(i), i
        }
        _normalizePoint(e, t) {
          return 0 === t
            ? (super._normalizePointWithoutOffset(e) ??
                super._normalizePoint(e, t))
            : super._normalizePoint(e, t)
        }
        async _getPropertyDefinitionsViewModelClass() {
          return te
        }
        static _addCollectedProperties(e) {}
      }
    },
    36036: (e, t, i) => {
      i.d(t, {
        LineAnchorRenderer: () => b,
        lineSourcePaneViewPointToLineAnchorPoint: () => v,
        mapLineSourcePaneViewPointToLineAnchorPoint: () => _,
      })
      var o = i(86441),
        n = i(34026),
        r = i(50151),
        l = i(37743),
        s = i(37265),
        a = i(56468),
        c = i(72791),
        d = i(61993),
        u = i(30125)
      function h(e, t, i, o) {
        const { point: n } = t,
          r = i + o / 2
        ;(0, l.drawRoundRect)(e, n.x - r, n.y - r, 2 * r, 2 * r, (i + o) / 2),
          e.closePath(),
          (e.lineWidth = o)
      }
      function p(e, t, i, o) {
        ;(e.globalAlpha = 0.2), h(e, t, i, o), e.stroke(), (e.globalAlpha = 1)
      }
      function g(e, t, i, o) {
        h(e, t, i - o, o), e.fill(), e.stroke()
      }
      function m(e, t, i, o) {
        const { point: n } = t
        ;(e.globalAlpha = 0.2),
          e.beginPath(),
          e.arc(n.x, n.y, i + o / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = o),
          e.stroke(),
          (e.globalAlpha = 1)
      }
      function f(e, t, i, o) {
        const { point: n } = t
        e.beginPath(),
          e.arc(n.x, n.y, i - o / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = o),
          e.fill(),
          e.stroke()
      }
      class b extends u.BitmapCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = e ?? null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data || this._data.disableInteractions) return null
          const { radius: t, points: i } = this._data,
            o = t + (0, d.interactionTolerance)().anchor
          for (const t of i) {
            if (t.point.subtract(e).length() <= o)
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
            this._data.points.some((t) => (0, n.pointInBox)(t.point, e))
          )
        }
        _drawImpl(e) {
          if (null === this._data || !this._data.visible) return
          const t = [],
            i = [],
            o = [],
            n = []
          for (let e = 0; e < this._data.points.length; ++e) {
            const r = this._data.points[e],
              l = this._data.backgroundColors[e]
            r.square ? (t.push(r), i.push(l)) : (o.push(r), n.push(l))
          }
          t.length && this._drawPoints(e, t, i, g, p),
            o.length && this._drawPoints(e, o, n, f, m)
        }
        _drawPoints(e, t, i, n, l) {
          const {
              context: a,
              horizontalPixelRatio: c,
              verticalPixelRatio: d,
            } = e,
            u = (0, r.ensureNotNull)(this._data),
            h = u.radius
          let p = Math.max(1, Math.floor((u.strokeWidth || 2) * c))
          u.selected && (p += Math.max(1, Math.floor(c / 2)))
          const g = Math.max(1, Math.floor(c))
          let m = Math.round(h * c * 2)
          m % 2 != g % 2 && (m += 1)
          const f = (g % 2) / 2
          a.strokeStyle = u.color
          for (let e = 0; e < t.length; ++e) {
            const r = t[e]
            if (
              !(
                (0, s.isInteger)(r.pointIndex) &&
                u.linePointBeingEdited === r.pointIndex
              )
            ) {
              a.fillStyle = i[e]
              if (
                (n(
                  a,
                  {
                    ...r,
                    point: new o.Point(
                      Math.round(r.point.x * c) + f,
                      Math.round(r.point.y * d) + f,
                    ),
                  },
                  m / 2,
                  p,
                ),
                !u.disableInteractions)
              ) {
                if (
                  null !== u.hoveredPointIndex &&
                  r.pointIndex === u.hoveredPointIndex
                ) {
                  const e = Math.max(1, Math.floor(u.selectedStrokeWidth * c))
                  let t = Math.round(h * c * 2)
                  t % 2 != g % 2 && (t += 1)
                  l(
                    a,
                    {
                      ...r,
                      point: new o.Point(
                        Math.round(r.point.x * c) + f,
                        Math.round(r.point.y * d) + f,
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
      function v(e, t = e.pointIndex, i, o, n, r, l, s, a, c) {
        return {
          point: e,
          pointIndex: t,
          cursorType: i,
          square: o,
          hitTarget: n,
          snappingPrice: r,
          snappingIndex: l,
          nonDiscreteIndex: s,
          activeItem: a,
          possibleMovingDirections: c,
        }
      }
      function _(e) {
        return v(e)
      }
    },
    11402: (e, t, i) => {
      i.d(t, { factoryDefaultsForCurrentTheme: () => a })
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
