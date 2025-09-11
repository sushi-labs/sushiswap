;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5529],
  {
    73174: (e, t, n) => {
      n.r(t),
        n.d(t, {
          getCoordinateXMetaInfo: () => f,
          getCoordinateYMetaInfo: () => S,
          getCoordinatesPropertiesDefinitions: () => x,
          getSelectionCoordinatesPropertyDefinition: () => T,
        })
      var i = n(50151),
        o = n(11542),
        r = n(45126),
        s = n(44672),
        a = n(60265)
      class l extends a.UndoCommand {
        constructor({ lineToolId: e, chartModel: t, newPositionPoints: n }) {
          super(null),
            (this._pointState = null),
            (this._lineToolId = e),
            (this._model = t),
            (this._newPositionPoints = n)
        }
        redo() {
          const e = (0, i.ensureNotNull)(
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
            const e = (0, i.ensureNotNull)(
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
      var c = n(32097),
        h = n(64147),
        d = n(12988),
        u = n(91682)
      const p = -5e4,
        g = 15e3,
        _ = new r.TranslatedString(
          'change price Y coordinate',
          o.t(null, void 0, n(11737)),
        ),
        P = new r.TranslatedString(
          'change bar X coordinate',
          o.t(null, void 0, n(2066)),
        ),
        m = new r.TranslatedString('move drawings', o.t(null, void 0, n(76261)))
      function S(e, t, n) {
        return {
          property: (0, c.convertToDefinitionProperty)(e, t.price, _),
          info: { typeY: 1, stepY: n },
        }
      }
      function f(e, t) {
        return {
          property: (0, c.convertToDefinitionProperty)(e, t.bar, P),
          info: {
            typeX: 0,
            minX: new h.WatchedValue(p),
            maxX: new h.WatchedValue(g),
            stepX: new h.WatchedValue(1),
          },
        }
      }
      function x(e, t, n, i, o, r) {
        const s = f(e, t),
          a = S(e, t, i)
        return (0, c.createCoordinatesPropertyDefinition)(
          { x: s.property, y: a.property },
          {
            id: (0, u.removeSpaces)(`${r}Coordinates${o}`),
            title: o,
            ...s.info,
            ...a.info,
          },
        )
      }
      const v = /^([+*\-\/]?)((?:\d*)|(?:\d+\.\d*))$/
      function w(e, t, n) {
        const o = new d.Property(''),
          r = (0, c.makeProxyDefinitionProperty)(o.weakReference())
        return (
          (r.setValue = (r) => {
            try {
              const o = r.match(v)
              if (!o) return
              const [, s, a] = o
              if (!a.length) return
              const c = n(Number.parseFloat(a))
              if ('/' === s && (0 === c.price || 0 === c.index)) return
              t.withMacro(m, () => {
                e.filter((e) => !e.isSourceHidden()).forEach((e) => {
                  const n = e.points()
                  let o
                  switch (s) {
                    case '': {
                      const e = (0, i.ensureDefined)(n[0])
                      let { index: t = e.index, price: r = e.price } = c
                      ;(r -= e.price),
                        (t -= e.index),
                        (o = n.map((e) => ({
                          ...e,
                          index: e.index + t,
                          price: e.price + r,
                        })))
                      break
                    }
                    case '-':
                    case '+': {
                      let { index: e = 0, price: t = 0 } = c
                      '-' === s && ((e *= -1), (t *= -1)),
                        (o = n.map((n) => ({
                          ...n,
                          index: n.index + e,
                          price: n.price + t,
                        })))
                      break
                    }
                    case '*': {
                      const { index: e = 1, price: t = 1 } = c
                      o = n.map((n) => ({
                        ...n,
                        index: n.index * e,
                        price: n.price * t,
                      }))
                      break
                    }
                    case '/': {
                      const { index: e = 1, price: t = 1 } = c
                      o = n.map((n) => ({
                        ...n,
                        index: n.index / e,
                        price: n.price / t,
                      }))
                      break
                    }
                  }
                  t.undoHistory().pushUndoCommand(
                    new l({
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
      function T(e, t) {
        const i = w(e, t, (e) => ({ index: e })),
          r = w(e, t, (e) => ({ price: e }))
        return (0, c.createSelectionCoordinatesPropertyDefinition)(
          { x: i, y: r },
          {
            id: 'SourcesCoordinates',
            title: o.t(null, void 0, n(44272)),
            mathOperationsX: '+',
            mathOperationsY: '+/*',
            modeX: 'integer',
            modeY: 'float',
          },
        )
      }
    },
    39374: (e, t, n) => {
      n.r(t), n.d(t, { LineToolEmoji: () => I })
      var i = n(19365),
        o = n(9343),
        r = n(84906),
        s = n(928),
        a = n(12027),
        l = n(22329),
        c = n(90054),
        h = n(16738),
        d = n(38039),
        u = n(31229),
        p = n(32679),
        g = n(6590)
      const _ = {
          intervalsVisibilities: { ...u.intervalsVisibilitiesDefaults },
          size: 40,
        },
        P = { emoji: '😀', angle: 0.5 * Math.PI },
        m = (0, p.extractAllPropertiesKeys)(_),
        S = (0, p.extractAllPropertiesKeys)(P),
        f = [...new Set([...S, ...m, ...g.commonLineToolPropertiesStateKeys])]
      class x extends d.LineDataSourceProperty {
        constructor(e) {
          super(e)
        }
        static create(e, t, n) {
          return new this({
            defaultName: 'linetoolemoji',
            factoryDefaultsSupplier: () => (0, c.default)(_),
            nonThemedDefaultsKeys: m,
            themedDefaultsKeys: [],
            state: (0, h.default)({}, P, { emoji: n }, t ?? {}),
            allStateKeys: f,
            theme: e,
          })
        }
      }
      var v = n(18009),
        w = n(68498)
      class T extends w.SvgIconPaneView {
        _iconColor() {
          return null
        }
      }
      const y = (0, o.getLogger)('Chart.LineToolEmoji')
      var C
      !((e) => {
        e[(e.Version = 1)] = 'Version'
      })(C || (C = {}))
      class I extends l.LineToolSvgIconBase {
        constructor(e, t, n, i) {
          super(
            e,
            t ?? I.createProperties(e.backgroundTheme().spawnOwnership()),
            n,
            i,
          ),
            (this.version = 1),
            this._loadViews()
        }
        name() {
          return 'Emoji'
        }
        template() {
          return this.properties().template()
        }
        static createProperties(e, t) {
          const n = x.create(e, t, s.emojiTool.value())
          return I._configureProperties(n), n
        }
        async _getPropertyDefinitionsViewModelClass() {
          return v.LineDataSourceDefinitionsViewModel
        }
        async _loadViews() {
          const e = this._properties.childs().emoji.value(),
            t = (0, i.getTwemojiUrl)(e, 'svg')
          try {
            const n = await (0, r.fetch)(t).then((e) => e.text())
            if (!this._isDestroyed) {
              ;(this._svgContent = n), this._onIconChanged.fire()
              const t = (0, a.svgRenderer)(n)
              null === t &&
                y.logWarn(`Couldn't create svg renderer for emoji ${e}`),
                this._setPaneViews([new T(this, this._model, t)])
            }
          } catch (t) {
            y.logWarn(`An error ocurred while loading emoji content ${e}: ${t}`)
          }
        }
      }
    },
    27916: (e, t, n) => {
      n.d(t, {
        LineSourcePaneView: () => _,
        createLineSourcePaneViewPoint: () => g,
        thirdPointCursorType: () => p,
      })
      var i = n(19625),
        o = n(50151),
        r = n(69186),
        s = n(56468),
        a = n(11064),
        l = n(36036),
        c = n(72791),
        h = n(17330)
      const d = i.colorsPalette['color-tv-blue-600']
      var u
      function p(e, t) {
        const n = t.x - e.x,
          i = t.y - e.y,
          o = Math.abs(Math.atan2(n, i))
        return o > Math.PI / 4 && o < (3 * Math.PI) / 4
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
      })(u || (u = {}))
      class _ {
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
          const n = this._source.ownerSource(),
            i = null !== n ? n.firstValue() : null
          return null === i ? null : t.priceToCoordinate(e, i)
        }
        anchorColor() {
          return d
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
          let n = this._getPoints()
          this._model.lineBeingCreated() === this._source &&
            (n = n.slice(0, -1))
          const i = this._source.points(),
            o = n.map((e, t) => {
              const n = i[t],
                o = (0, l.lineSourcePaneViewPointToLineAnchorPoint)(e)
              return (
                n && ((o.snappingPrice = n.price), (o.snappingIndex = n.index)),
                o
              )
            })
          e.append(this.createLineAnchor({ ...t, points: o }, 0))
        }
        createLineAnchor(e, t) {
          const n = e.points.map((e) => e.point)
          if (this.isLocked()) {
            const i = this._getSelectionRenderer(t)
            return (
              i.setData({
                bgColors: this._lineAnchorColors(n),
                points: e.points,
                visible: this.areAnchorsVisible(),
                hittestResult: s.HitTarget.Regular,
                barSpacing: this._model.timeScale().barSpacing(),
              }),
              i
            )
          }
          const i = (0, r.lastMouseOrTouchEventInfo)().isTouch,
            o = this._getLineAnchorRenderer(t),
            a = this.isHoveredSource()
              ? (this._model.lastHittestData()?.pointIndex ?? null)
              : null
          return (
            o.setData({
              ...e,
              color: this.anchorColor(),
              backgroundColors: this._lineAnchorColors(n),
              hoveredPointIndex: a,
              linePointBeingEdited: this.isBeingEdited()
                ? this._model.linePointBeingEdited()
                : null,
              radius: this._anchorRadius(),
              strokeWidth: i ? u.TouchStrokeWidth : u.RegularStrokeWidth,
              selected: this.isSelectedSource(),
              selectedStrokeWidth: i
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
                const n = this._source.pointToScreenPoint(e)
                n && this._points.push(g(n, t))
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
          const n = this._source.properties().childs()
          return (
            'middle' === (t ?? n.vertLabelsAlign.value()) &&
            (0, h.needTextExclusionPath)(e)
          )
        }
        _addAlertRenderer(
          e,
          t,
          n = this._source.properties().linecolor.value(),
        ) {}
        _getAlertRenderer(
          e,
          t = this._source.properties().linecolor.value(),
          n,
        ) {
          return null
        }
        _getSelectionRenderer(e) {
          while (this._selectionRenderers.length <= e)
            this._selectionRenderers.push(new a.SelectionRenderer())
          return this._selectionRenderers[e]
        }
        _getLineAnchorRenderer(e) {
          while (this._lineAnchorRenderers.length <= e)
            this._lineAnchorRenderers.push(new l.LineAnchorRenderer())
          return this._lineAnchorRenderers[e]
        }
      }
    },
    22329: (e, t, n) => {
      n.d(t, { LineToolSvgIconBase: () => h })
      var i,
        o = n(50151),
        r = n(86441),
        s = n(25422),
        a = n(52033),
        l = n(29875),
        c = n(64147)
      !((e) => {
        e[(e.AnchorLimit = 80)] = 'AnchorLimit'
      })(i || (i = {}))
      class h extends l.LineDataSource {
        constructor(e, t, n, i) {
          super(e, t, n, i),
            (this._onIconChanged = new a.Delegate()),
            (this._svgContent = null),
            (this._hasEditableCoordinates = new c.WatchedValue(!1)),
            (this._changePointData = null),
            this._loadViews()
        }
        pointsCount() {
          return 1
        }
        getAnchorLimit() {
          return 80
        }
        getChangePointForSync(e) {
          return null
        }
        startChanging(e, t) {
          const n = (0, o.ensureNotNull)(
              this.pointToScreenPoint(this._points[0]),
            ),
            i = this.properties().childs(),
            a = i.size.value()
          let l
          if (t) l = (0, o.ensureNotNull)(this.pointToScreenPoint(t))
          else {
            let e = new r.Point(0, Math.max(80, a) / 2)
            const t = (0, s.rotationMatrix)(i.angle.value())
            ;(e = (0, s.transformPoint)(t, e)), (l = n.add(e))
          }
          const c = n.subtract(l).length()
          ;(this._changePointData = {
            centerPoint: n,
            initialLength: c,
            initialSize: a,
          }),
            super.startChanging(e, t)
        }
        setPoint(e, t, n) {
          const {
              centerPoint: i,
              initialLength: r,
              initialSize: s,
            } = (0, o.ensureNotNull)(this._changePointData),
            a = (0, o.ensureNotNull)(this.pointToScreenPoint(t)),
            l = this.properties().childs()
          if (0 === e || 1 === e) {
            const t = a.subtract(i).normalized()
            let n = Math.acos(-t.x)
            Math.asin(t.y) > 0 && (n = 2 * Math.PI - n),
              0 === e && (n += Math.PI),
              l.angle.setValue(n)
          } else {
            const e = s * (i.subtract(a).length() / r)
            l.size.setValue(e)
          }
        }
        getSourceIcon() {
          const e = this.svgContent()
          return null === e ? null : { type: 'svgContent', content: e }
        }
        onSourceIconChanged() {
          return this._onIconChanged
        }
        svgContent() {
          return this._svgContent
        }
        static _configureProperties(e) {
          super._configureProperties(e), e.addExcludedKey('angle', 1)
        }
      }
    },
    36036: (e, t, n) => {
      n.d(t, {
        LineAnchorRenderer: () => m,
        lineSourcePaneViewPointToLineAnchorPoint: () => S,
        mapLineSourcePaneViewPointToLineAnchorPoint: () => f,
      })
      var i = n(86441),
        o = n(34026),
        r = n(50151),
        s = n(37743),
        a = n(37265),
        l = n(56468),
        c = n(72791),
        h = n(61993),
        d = n(30125)
      function u(e, t, n, i) {
        const { point: o } = t,
          r = n + i / 2
        ;(0, s.drawRoundRect)(e, o.x - r, o.y - r, 2 * r, 2 * r, (n + i) / 2),
          e.closePath(),
          (e.lineWidth = i)
      }
      function p(e, t, n, i) {
        ;(e.globalAlpha = 0.2), u(e, t, n, i), e.stroke(), (e.globalAlpha = 1)
      }
      function g(e, t, n, i) {
        u(e, t, n - i, i), e.fill(), e.stroke()
      }
      function _(e, t, n, i) {
        const { point: o } = t
        ;(e.globalAlpha = 0.2),
          e.beginPath(),
          e.arc(o.x, o.y, n + i / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = i),
          e.stroke(),
          (e.globalAlpha = 1)
      }
      function P(e, t, n, i) {
        const { point: o } = t
        e.beginPath(),
          e.arc(o.x, o.y, n - i / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = i),
          e.fill(),
          e.stroke()
      }
      class m extends d.BitmapCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = e ?? null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data || this._data.disableInteractions) return null
          const { radius: t, points: n } = this._data,
            i = t + (0, h.interactionTolerance)().anchor
          for (const t of n) {
            if (t.point.subtract(e).length() <= i)
              return new l.HitTestResult(
                t.hitTarget ?? l.HitTarget.ChangePoint,
                {
                  areaName: l.AreaName.AnchorPoint,
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
            this._data.points.some((t) => (0, o.pointInBox)(t.point, e))
          )
        }
        _drawImpl(e) {
          if (null === this._data || !this._data.visible) return
          const t = [],
            n = [],
            i = [],
            o = []
          for (let e = 0; e < this._data.points.length; ++e) {
            const r = this._data.points[e],
              s = this._data.backgroundColors[e]
            r.square ? (t.push(r), n.push(s)) : (i.push(r), o.push(s))
          }
          t.length && this._drawPoints(e, t, n, g, p),
            i.length && this._drawPoints(e, i, o, P, _)
        }
        _drawPoints(e, t, n, o, s) {
          const {
              context: l,
              horizontalPixelRatio: c,
              verticalPixelRatio: h,
            } = e,
            d = (0, r.ensureNotNull)(this._data),
            u = d.radius
          let p = Math.max(1, Math.floor((d.strokeWidth || 2) * c))
          d.selected && (p += Math.max(1, Math.floor(c / 2)))
          const g = Math.max(1, Math.floor(c))
          let _ = Math.round(u * c * 2)
          _ % 2 != g % 2 && (_ += 1)
          const P = (g % 2) / 2
          l.strokeStyle = d.color
          for (let e = 0; e < t.length; ++e) {
            const r = t[e]
            if (
              !(
                (0, a.isInteger)(r.pointIndex) &&
                d.linePointBeingEdited === r.pointIndex
              )
            ) {
              l.fillStyle = n[e]
              if (
                (o(
                  l,
                  {
                    ...r,
                    point: new i.Point(
                      Math.round(r.point.x * c) + P,
                      Math.round(r.point.y * h) + P,
                    ),
                  },
                  _ / 2,
                  p,
                ),
                !d.disableInteractions)
              ) {
                if (
                  null !== d.hoveredPointIndex &&
                  r.pointIndex === d.hoveredPointIndex
                ) {
                  const e = Math.max(1, Math.floor(d.selectedStrokeWidth * c))
                  let t = Math.round(u * c * 2)
                  t % 2 != g % 2 && (t += 1)
                  s(
                    l,
                    {
                      ...r,
                      point: new i.Point(
                        Math.round(r.point.x * c) + P,
                        Math.round(r.point.y * h) + P,
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
      function S(e, t = e.pointIndex, n, i, o, r, s, a, l, c) {
        return {
          point: e,
          pointIndex: t,
          cursorType: n,
          square: i,
          hitTarget: o,
          snappingPrice: r,
          snappingIndex: s,
          nonDiscreteIndex: a,
          activeItem: l,
          possibleMovingDirections: c,
        }
      }
      function f(e) {
        return S(e)
      }
    },
  },
])
