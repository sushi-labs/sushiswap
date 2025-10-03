;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1313],
  {
    27916: (e, t, n) => {
      n.d(t, {
        LineSourcePaneView: () => g,
        createLineSourcePaneViewPoint: () => _,
        thirdPointCursorType: () => p,
      })
      var i = n(19625),
        o = n(50151),
        r = n(69186),
        s = n(56468),
        l = n(11064),
        a = n(36036),
        d = n(72791),
        h = n(17330)
      const c = i.colorsPalette['color-tv-blue-600']
      var u
      function p(e, t) {
        const n = t.x - e.x,
          i = t.y - e.y,
          o = Math.abs(Math.atan2(n, i))
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
      class g {
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
          return c
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
                o = (0, a.lineSourcePaneViewPointToLineAnchorPoint)(e)
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
            l = this.isHoveredSource()
              ? (this._model.lastHittestData()?.pointIndex ?? null)
              : null
          return (
            o.setData({
              ...e,
              color: this.anchorColor(),
              backgroundColors: this._lineAnchorColors(n),
              hoveredPointIndex: l,
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
                n && this._points.push(_(n, t))
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
    43176: (e, t, n) => {
      n.r(t), n.d(t, { LineToolPitchfan: () => w })
      var i = n(50151),
        o = n(11542),
        r = n(15399),
        s = n(45126),
        l = n(85719),
        a = n(29875),
        d = n(73305),
        h = n(56641),
        c = n(56468),
        u = n(65395),
        p = n(95201),
        _ = n(36036),
        g = n(49857),
        P = n(91046),
        f = n(27916)
      class v extends f.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._medianRenderer = new P.TrendLineRenderer()),
            (this._sideRenderer = new P.TrendLineRenderer()),
            (this._renderer = null),
            (this._medianPoint = null)
        }
        renderer(e) {
          return this._invalidated && this._updateImpl(e), this._renderer
        }
        _updateImpl(e) {
          super._updateImpl(e), (this._renderer = null)
          const t = this._points.length
          if (0 === t) return
          const [n] = this._points
          if (
            ((this._medianPoint = (0,
            _.lineSourcePaneViewPointToLineAnchorPoint)(
              3 === t
                ? this._points[1].add(this._points[2]).scaled(0.5)
                : 2 === t
                  ? this._points[1]
                  : n,
              3,
            )),
            t < 2)
          )
            return
          if (!this._medianPoint) return
          const i = new p.CompositeRenderer(),
            o = this._source.properties().childs(),
            r = o.median.childs(),
            s = {
              points: [n, this._medianPoint.point],
              color: r.color.value(),
              linewidth: r.linewidth.value(),
              linestyle: r.linestyle.value(),
              extendleft: !1,
              extendright: !0,
              leftend: g.LineEnd.Normal,
              rightend: g.LineEnd.Normal,
            }
          if (
            (this._medianRenderer.setData(s),
            i.append(this._medianRenderer),
            t < 3)
          )
            return this.addAnchors(i), void (this._renderer = i)
          const l = {
            points: [this._points[1], this._points[2]],
            color: r.color.value(),
            linewidth: r.linewidth.value(),
            linestyle: r.linestyle.value(),
            extendleft: !1,
            extendright: !1,
            leftend: g.LineEnd.Normal,
            rightend: g.LineEnd.Normal,
          }
          this._sideRenderer.setData(l), i.append(this._sideRenderer)
          let a = 0
          const d = this._points[2].subtract(this._points[1]).scaled(0.5),
            h = o.fillBackground.value(),
            f = o.transparency.value()
          for (let e = 0; e <= 8; e++) {
            const t = 'level' + e,
              o = this._source.properties().child(t)
            if (o?.childs().visible.value()) {
              const t = this._medianPoint.point.addScaled(
                  d,
                  o.childs().coeff.value(),
                ),
                r = this._medianPoint.point.addScaled(
                  d,
                  -o.childs().coeff.value(),
                )
              if (h) {
                {
                  const e = {
                      p1: n,
                      p2: t,
                      p3: n,
                      p4: this._medianPoint.point.addScaled(d, a),
                      color: o.childs().color.value(),
                      transparency: f,
                      hittestOnBackground: !0,
                      extendLeft: !1,
                    },
                    r = new u.ChannelRenderer()
                  r.setData(e), i.append(r)
                }
                {
                  const e = {
                      p1: n,
                      p2: r,
                      p3: n,
                      p4: this._medianPoint.point.addScaled(d, -a),
                      color: o.childs().color.value(),
                      transparency: f,
                      hittestOnBackground: !0,
                      extendLeft: !1,
                    },
                    t = new u.ChannelRenderer()
                  t.setData(e), i.append(t)
                }
              }
              a = o.childs().coeff.value()
              {
                const r = {
                    points: [n, t],
                    color: o.childs().color.value(),
                    linewidth: o.childs().linewidth.value(),
                    linestyle: o.childs().linestyle.value(),
                    extendleft: !1,
                    extendright: !0,
                    leftend: g.LineEnd.Normal,
                    rightend: g.LineEnd.Normal,
                  },
                  s = new P.TrendLineRenderer()
                s.setData(r),
                  s.setHitTest(
                    new c.HitTestResult(c.HitTarget.MovePoint, void 0, e),
                  ),
                  i.append(s)
              }
              {
                const t = {
                    points: [n, r],
                    color: o.childs().color.value(),
                    linewidth: o.childs().linewidth.value(),
                    linestyle: o.childs().linestyle.value(),
                    extendleft: !1,
                    extendright: !0,
                    leftend: g.LineEnd.Normal,
                    rightend: g.LineEnd.Normal,
                  },
                  s = new P.TrendLineRenderer()
                s.setData(t),
                  s.setHitTest(
                    new c.HitTestResult(c.HitTarget.MovePoint, void 0, e),
                  ),
                  i.append(s)
              }
            }
          }
          this.addAnchors(i), (this._renderer = i)
        }
      }
      const m = new s.TranslatedString(
        'erase level line',
        o.t(null, void 0, n(77114)),
      )
      var S
      !((e) => {
        e[(e.LevelsCount = 8)] = 'LevelsCount'
      })(S || (S = {}))
      class w extends a.LineDataSource {
        constructor(e, t, n, i) {
          super(
            e,
            t ?? w.createProperties(e.backgroundTheme().spawnOwnership()),
            n,
            i,
          ),
            this._setPaneViews([new v(this, this._model)])
        }
        levelsCount() {
          return 8
        }
        pointsCount() {
          return 3
        }
        name() {
          return 'Pitchfan'
        }
        processErase(e, t) {
          const n = 'level' + t,
            o = (0, i.ensureDefined)(this.properties().child(n)).childs()
              .visible
          e.setProperty(o, !1, m, l.lineToolsDoNotAffectChartInvalidation)
        }
        static createProperties(e, t) {
          const n = new r.LevelsProperty({
            defaultName: 'linetoolpitchfan',
            state: t,
            map: { range: [0, 8] },
            theme: e,
          })
          return this._configureProperties(n), n
        }
        async _getPropertyDefinitionsViewModelClass() {
          return h.PitchBaseDefinitionsViewModel
        }
        static _configureProperties(e) {
          super._configureProperties(e)
          const t = [e.childs().median.childs().linewidth],
            n = [e.childs().median.childs().color]
          for (let o = 0; o <= 8; o++) {
            const r = (0, i.ensureDefined)(e.child('level' + o))
            t.push((0, i.ensureDefined)(r.child('linewidth'))),
              n.push((0, i.ensureDefined)(r.child('color')))
          }
          e.addChild('linesColors', new d.LineToolColorsProperty(n)),
            e.addChild('linesWidths', new d.LineToolWidthsProperty(t))
        }
      }
    },
    65395: (e, t, n) => {
      n.d(t, { ChannelRenderer: () => c })
      var i = n(50151),
        o = n(86441),
        r = n(34026),
        s = n(4652),
        l = n(56468),
        a = n(37743),
        d = n(19063),
        h = n(75919)
      class c extends h.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e, t) {
          if (null === this._data || !this._data.hittestOnBackground)
            return null
          const n = this._visiblePolygon(t.mediaSize)
          return null !== n && (0, r.pointInPolygon)(e, n)
            ? new l.HitTestResult(l.HitTarget.MovePointBackground)
            : null
        }
        _drawImpl(e) {
          if (null === this._data) return
          const t = e.context,
            n = this._visiblePolygon(e.mediaSize)
          if (null !== n) {
            t.beginPath(), t.moveTo(n[0].x, n[0].y)
            for (let e = 1; e < n.length; e++) t.lineTo(n[e].x, n[e].y)
            ;(t.fillStyle = (0, d.generateColor)(
              this._data.color,
              this._data.transparency,
              !0,
            )),
              t.fill()
          }
        }
        _visiblePolygon(e) {
          const t = (0, i.ensureNotNull)(this._data),
            n = t.p1,
            r = t.p2,
            l = t.p3,
            d = t.p4
          if (
            (0, o.equalPoints)(n, r) ||
            (0, o.equalPoints)(l, d) ||
            ((0, s.distanceToLine)(n, r, l).distance < 1e-6 &&
              (0, s.distanceToLine)(n, r, d).distance < 1e-6)
          )
            return null
          if (e.width <= 0 || e.height <= 0) return null
          let h = [
            new o.Point(0, 0),
            new o.Point(e.width, 0),
            new o.Point(e.width, e.height),
            new o.Point(0, e.height),
          ]
          return (
            (h = (0, a.clipPolygonByEdge)(h, n, r, [d, l])),
            (h = (0, a.clipPolygonByEdge)(h, d, l, [n, r])),
            (0, o.equalPoints)(l, n) ||
              t.extendLeft ||
              (h = (0, a.clipPolygonByEdge)(h, l, n, [r, d])),
            h
          )
        }
      }
    },
    36036: (e, t, n) => {
      n.d(t, {
        LineAnchorRenderer: () => f,
        lineSourcePaneViewPointToLineAnchorPoint: () => v,
        mapLineSourcePaneViewPointToLineAnchorPoint: () => m,
      })
      var i = n(86441),
        o = n(34026),
        r = n(50151),
        s = n(37743),
        l = n(37265),
        a = n(56468),
        d = n(72791),
        h = n(61993),
        c = n(30125)
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
      function _(e, t, n, i) {
        u(e, t, n - i, i), e.fill(), e.stroke()
      }
      function g(e, t, n, i) {
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
      class f extends c.BitmapCoordinatesPaneRenderer {
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
            n = [],
            i = [],
            o = []
          for (let e = 0; e < this._data.points.length; ++e) {
            const r = this._data.points[e],
              s = this._data.backgroundColors[e]
            r.square ? (t.push(r), n.push(s)) : (i.push(r), o.push(s))
          }
          t.length && this._drawPoints(e, t, n, _, p),
            i.length && this._drawPoints(e, i, o, P, g)
        }
        _drawPoints(e, t, n, o, s) {
          const {
              context: a,
              horizontalPixelRatio: d,
              verticalPixelRatio: h,
            } = e,
            c = (0, r.ensureNotNull)(this._data),
            u = c.radius
          let p = Math.max(1, Math.floor((c.strokeWidth || 2) * d))
          c.selected && (p += Math.max(1, Math.floor(d / 2)))
          const _ = Math.max(1, Math.floor(d))
          let g = Math.round(u * d * 2)
          g % 2 != _ % 2 && (g += 1)
          const P = (_ % 2) / 2
          a.strokeStyle = c.color
          for (let e = 0; e < t.length; ++e) {
            const r = t[e]
            if (
              !(
                (0, l.isInteger)(r.pointIndex) &&
                c.linePointBeingEdited === r.pointIndex
              )
            ) {
              a.fillStyle = n[e]
              if (
                (o(
                  a,
                  {
                    ...r,
                    point: new i.Point(
                      Math.round(r.point.x * d) + P,
                      Math.round(r.point.y * h) + P,
                    ),
                  },
                  g / 2,
                  p,
                ),
                !c.disableInteractions)
              ) {
                if (
                  null !== c.hoveredPointIndex &&
                  r.pointIndex === c.hoveredPointIndex
                ) {
                  const e = Math.max(1, Math.floor(c.selectedStrokeWidth * d))
                  let t = Math.round(u * d * 2)
                  t % 2 != _ % 2 && (t += 1)
                  s(
                    a,
                    {
                      ...r,
                      point: new i.Point(
                        Math.round(r.point.x * d) + P,
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
      function v(e, t = e.pointIndex, n, i, o, r, s, l, a, d) {
        return {
          point: e,
          pointIndex: t,
          cursorType: n,
          square: i,
          hitTarget: o,
          snappingPrice: r,
          snappingIndex: s,
          nonDiscreteIndex: l,
          activeItem: a,
          possibleMovingDirections: d,
        }
      }
      function m(e) {
        return v(e)
      }
    },
  },
])
