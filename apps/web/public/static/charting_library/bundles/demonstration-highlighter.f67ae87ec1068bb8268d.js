;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [360],
  {
    70849: (t, e, i) => {
      i.d(e, { BrushBasePaneView: () => c })
      var n = i(86441),
        o = i(74011),
        r = i(11064),
        s = i(95201),
        a = i(36036),
        l = i(56468),
        h = i(27916)
      class c extends h.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._polygonRenderer = new o.PolygonRenderer()),
            (this._renderer = new s.CompositeRenderer())
        }
        renderer(t) {
          return this._invalidated && this._updateImpl(t), this._renderer
        }
        _updateImpl(t) {
          super._updateImpl(t)
          const e = Math.max(1, this._source.smooth()),
            i = this._points
          if (0 === i.length) return void this._renderer.clear()
          const n = [i[0]]
          for (let t = 1; t < i.length; t++) {
            const o = i[t].subtract(i[t - 1]),
              r = o.length(),
              s = Math.min(5, Math.floor(r / e)),
              a = o.normalized().scaled(r / s)
            for (let e = 0; e < s - 1; e++) n.push(i[t - 1].add(a.scaled(e)))
            n.push(i[t])
          }
          this._points = this._smoothArray(n, e)
          const o = this._createPolygonRendererData()
          if (
            (this._polygonRenderer.setData(o),
            (this._renderer = new s.CompositeRenderer()),
            this._renderer.append(this._polygonRenderer),
            this._source.finished() && this._addAnchors())
          ) {
            const t = o.points.length
            if (t > 0) {
              const e =
                  1 !== t ? [o.points[0], o.points[t - 1]] : [o.points[0]],
                i = new r.SelectionRenderer({
                  points: e.map(a.mapLineSourcePaneViewPointToLineAnchorPoint),
                  bgColors: this._lineAnchorColors(e),
                  visible: this.areAnchorsVisible(),
                  hittestResult: l.HitTarget.Regular,
                  barSpacing: this._getModel().timeScale().barSpacing(),
                })
              this._renderer.append(i)
            }
          }
        }
        _addAnchors() {
          return !0
        }
        _smoothArray(t, e) {
          if (1 === t.length) return t
          const i = new Array(t.length)
          for (let o = 0; o < t.length; o++) {
            let r = new n.Point(0, 0)
            for (let i = 0; i < e; i++) {
              const e = Math.max(o - i, 0),
                n = Math.min(o + i, t.length - 1)
              ;(r = r.add(t[e])), (r = r.add(t[n]))
            }
            i[o] = r.scaled(0.5 / e)
          }
          return i.push(t[t.length - 1]), i
        }
      }
    },
    13506: (t, e, i) => {
      i.r(e), i.d(e, { LineToolDemonstrationHighlighter: () => h })
      var n = i(92184),
        o = i(32679),
        r = i(64195),
        s = i(51056),
        a = i(70849)
      class l extends a.BrushBasePaneView {
        _createPolygonRendererData() {
          return {
            points: this._points,
            color: this._source.color(),
            linewidth: this._source.width(),
            backcolor: 'rgba(0, 0, 0, 0)',
            fillBackground: !1,
            linestyle: s.LINESTYLE_SOLID,
            filled: !1,
            globalAlpha: 1 - this._source.animationProgress(),
            disableInteractions: !0,
          }
        }
        _addAnchors() {
          return !1
        }
      }
      class h extends r.LineToolBrushBase {
        constructor(t, e, i, o) {
          super(
            t,
            h.createProperties(t.backgroundTheme().spawnOwnership()),
            !1,
            (0, n.randomHash)(),
          ),
            (this._creationTime = null),
            (this._color = e),
            (this._width = i),
            (this._visibilityTime = o),
            this._setPaneViews([new l(this, t)])
        }
        smooth() {
          return 5
        }
        color() {
          return this._color
        }
        width() {
          return this._width
        }
        name() {
          return 'Presentation highlighter'
        }
        canBeHidden() {
          return !1
        }
        finish() {
          super.finish(), (this._creationTime = performance.now())
        }
        animationProgress() {
          if (null === this._creationTime) return 0
          const t =
            (performance.now() - this._creationTime) / this._visibilityTime
          return Math.min(1, t)
        }
        static createProperties(t) {
          const e = new o.DefaultProperty({
            defaultName: '',
            useUserPreferences: !1,
            state: void 0,
            theme: t,
          })
          return this._configureProperties(e), e
        }
        _ignoreSourceEvent(t) {
          return (
            'data-source-change' === t.type &&
            t.sourceId !== this.model().crosshairSource().id()
          )
        }
      }
    },
    27916: (t, e, i) => {
      i.d(e, {
        LineSourcePaneView: () => g,
        createLineSourcePaneViewPoint: () => p,
        thirdPointCursorType: () => _,
      })
      var n = i(19625),
        o = i(50151),
        r = i(69186),
        s = i(56468),
        a = i(11064),
        l = i(36036),
        h = i(72791),
        c = i(17330)
      const d = n.colorsPalette['color-tv-blue-600']
      var u
      function _(t, e) {
        const i = e.x - t.x,
          n = e.y - t.y,
          o = Math.abs(Math.atan2(i, n))
        return o > Math.PI / 4 && o < (3 * Math.PI) / 4
          ? h.PaneCursorType.VerticalResize
          : h.PaneCursorType.HorizontalResize
      }
      function p(t, e) {
        return (t.pointIndex = e), t
      }
      !((t) => {
        ;(t[(t.RegularAnchorRadius = 6)] = 'RegularAnchorRadius'),
          (t[(t.TouchAnchorRadius = 13)] = 'TouchAnchorRadius'),
          (t[(t.RegularStrokeWidth = 1)] = 'RegularStrokeWidth'),
          (t[(t.TouchStrokeWidth = 3)] = 'TouchStrokeWidth'),
          (t[(t.RegularSelectedStrokeWidth = 3)] =
            'RegularSelectedStrokeWidth'),
          (t[(t.TouchSelectedStrokeWidth = 0)] = 'TouchSelectedStrokeWidth')
      })(u || (u = {}))
      class g {
        constructor(t, e) {
          ;(this._invalidated = !0),
            (this._points = []),
            (this._middlePoint = null),
            (this._selectionRenderers = []),
            (this._lineAnchorRenderers = []),
            (this._source = t),
            (this._model = e)
        }
        priceToCoordinate(t) {
          const e = this._source.priceScale()
          if (null === e) return null
          const i = this._source.ownerSource(),
            n = null !== i ? i.firstValue() : null
          return null === n ? null : e.priceToCoordinate(t, n)
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
        addAnchors(t, e = {}) {
          let i = this._getPoints()
          this._model.lineBeingCreated() === this._source &&
            (i = i.slice(0, -1))
          const n = this._source.points(),
            o = i.map((t, e) => {
              const i = n[e],
                o = (0, l.lineSourcePaneViewPointToLineAnchorPoint)(t)
              return (
                i && ((o.snappingPrice = i.price), (o.snappingIndex = i.index)),
                o
              )
            })
          t.append(this.createLineAnchor({ ...e, points: o }, 0))
        }
        createLineAnchor(t, e) {
          const i = t.points.map((t) => t.point)
          if (this.isLocked()) {
            const n = this._getSelectionRenderer(e)
            return (
              n.setData({
                bgColors: this._lineAnchorColors(i),
                points: t.points,
                visible: this.areAnchorsVisible(),
                hittestResult: s.HitTarget.Regular,
                barSpacing: this._model.timeScale().barSpacing(),
              }),
              n
            )
          }
          const n = (0, r.lastMouseOrTouchEventInfo)().isTouch,
            o = this._getLineAnchorRenderer(e),
            a = this.isHoveredSource()
              ? (this._model.lastHittestData()?.pointIndex ?? null)
              : null
          return (
            o.setData({
              ...t,
              color: this.anchorColor(),
              backgroundColors: this._lineAnchorColors(i),
              hoveredPointIndex: a,
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
              clickHandler: t.clickHandler,
            }),
            o
          )
        }
        _anchorRadius() {
          return (0, r.lastMouseOrTouchEventInfo)().isTouch
            ? u.TouchAnchorRadius
            : u.RegularAnchorRadius
        }
        _lineAnchorColors(t) {
          const e = (0, o.ensureNotNull)(
            this._model.paneForSource(this._source),
          ).height()
          return t.map((t) =>
            this._model.backgroundColorAtYPercentFromTop(t.y / e),
          )
        }
        _updateImpl(t) {
          this._points = []
          this._model.timeScale().isEmpty() ||
            (this._validatePriceScale() &&
              (this._source.points().forEach((t, e) => {
                const i = this._source.pointToScreenPoint(t)
                i && this._points.push(p(i, e))
              }),
              2 === this._points.length &&
                (this._middlePoint = this._source.calcMiddlePoint(
                  this._points[0],
                  this._points[1],
                )),
              (this._invalidated = !1)))
        }
        _validatePriceScale() {
          const t = this._source.priceScale()
          return null !== t && !t.isEmpty()
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
          const t = this._source.priceScale()
          return null !== t ? t.height() : 0
        }
        _width() {
          return this._model.timeScale().width()
        }
        _needLabelExclusionPath(t, e) {
          const i = this._source.properties().childs()
          return (
            'middle' === (e ?? i.vertLabelsAlign.value()) &&
            (0, c.needTextExclusionPath)(t)
          )
        }
        _addAlertRenderer(
          t,
          e,
          i = this._source.properties().linecolor.value(),
        ) {}
        _getAlertRenderer(
          t,
          e = this._source.properties().linecolor.value(),
          i,
        ) {
          return null
        }
        _getSelectionRenderer(t) {
          while (this._selectionRenderers.length <= t)
            this._selectionRenderers.push(new a.SelectionRenderer())
          return this._selectionRenderers[t]
        }
        _getLineAnchorRenderer(t) {
          while (this._lineAnchorRenderers.length <= t)
            this._lineAnchorRenderers.push(new l.LineAnchorRenderer())
          return this._lineAnchorRenderers[t]
        }
      }
    },
    36036: (t, e, i) => {
      i.d(e, {
        LineAnchorRenderer: () => f,
        lineSourcePaneViewPointToLineAnchorPoint: () => m,
        mapLineSourcePaneViewPointToLineAnchorPoint: () => S,
      })
      var n = i(86441),
        o = i(34026),
        r = i(50151),
        s = i(37743),
        a = i(37265),
        l = i(56468),
        h = i(72791),
        c = i(61993),
        d = i(30125)
      function u(t, e, i, n) {
        const { point: o } = e,
          r = i + n / 2
        ;(0, s.drawRoundRect)(t, o.x - r, o.y - r, 2 * r, 2 * r, (i + n) / 2),
          t.closePath(),
          (t.lineWidth = n)
      }
      function _(t, e, i, n) {
        ;(t.globalAlpha = 0.2), u(t, e, i, n), t.stroke(), (t.globalAlpha = 1)
      }
      function p(t, e, i, n) {
        u(t, e, i - n, n), t.fill(), t.stroke()
      }
      function g(t, e, i, n) {
        const { point: o } = e
        ;(t.globalAlpha = 0.2),
          t.beginPath(),
          t.arc(o.x, o.y, i + n / 2, 0, 2 * Math.PI, !0),
          t.closePath(),
          (t.lineWidth = n),
          t.stroke(),
          (t.globalAlpha = 1)
      }
      function P(t, e, i, n) {
        const { point: o } = e
        t.beginPath(),
          t.arc(o.x, o.y, i - n / 2, 0, 2 * Math.PI, !0),
          t.closePath(),
          (t.lineWidth = n),
          t.fill(),
          t.stroke()
      }
      class f extends d.BitmapCoordinatesPaneRenderer {
        constructor(t) {
          super(), (this._data = t ?? null)
        }
        setData(t) {
          this._data = t
        }
        hitTest(t) {
          if (null === this._data || this._data.disableInteractions) return null
          const { radius: e, points: i } = this._data,
            n = e + (0, c.interactionTolerance)().anchor
          for (const e of i) {
            if (e.point.subtract(t).length() <= n)
              return new l.HitTestResult(
                e.hitTarget ?? l.HitTarget.ChangePoint,
                {
                  areaName: l.AreaName.AnchorPoint,
                  pointIndex: e.pointIndex,
                  cursorType: e.cursorType ?? h.PaneCursorType.Default,
                  activeItem: e.activeItem,
                  snappingPrice: e.snappingPrice,
                  snappingIndex: e.snappingIndex,
                  nonDiscreteIndex: e.nonDiscreteIndex,
                  possibleMovingDirections: e.possibleMovingDirections,
                  clickHandler: this._data.clickHandler,
                  tapHandler: this._data.clickHandler,
                },
              )
          }
          return null
        }
        doesIntersectWithBox(t) {
          return (
            null !== this._data &&
            this._data.points.some((e) => (0, o.pointInBox)(e.point, t))
          )
        }
        _drawImpl(t) {
          if (null === this._data || !this._data.visible) return
          const e = [],
            i = [],
            n = [],
            o = []
          for (let t = 0; t < this._data.points.length; ++t) {
            const r = this._data.points[t],
              s = this._data.backgroundColors[t]
            r.square ? (e.push(r), i.push(s)) : (n.push(r), o.push(s))
          }
          e.length && this._drawPoints(t, e, i, p, _),
            n.length && this._drawPoints(t, n, o, P, g)
        }
        _drawPoints(t, e, i, o, s) {
          const {
              context: l,
              horizontalPixelRatio: h,
              verticalPixelRatio: c,
            } = t,
            d = (0, r.ensureNotNull)(this._data),
            u = d.radius
          let _ = Math.max(1, Math.floor((d.strokeWidth || 2) * h))
          d.selected && (_ += Math.max(1, Math.floor(h / 2)))
          const p = Math.max(1, Math.floor(h))
          let g = Math.round(u * h * 2)
          g % 2 != p % 2 && (g += 1)
          const P = (p % 2) / 2
          l.strokeStyle = d.color
          for (let t = 0; t < e.length; ++t) {
            const r = e[t]
            if (
              !(
                (0, a.isInteger)(r.pointIndex) &&
                d.linePointBeingEdited === r.pointIndex
              )
            ) {
              l.fillStyle = i[t]
              if (
                (o(
                  l,
                  {
                    ...r,
                    point: new n.Point(
                      Math.round(r.point.x * h) + P,
                      Math.round(r.point.y * c) + P,
                    ),
                  },
                  g / 2,
                  _,
                ),
                !d.disableInteractions)
              ) {
                if (
                  null !== d.hoveredPointIndex &&
                  r.pointIndex === d.hoveredPointIndex
                ) {
                  const t = Math.max(1, Math.floor(d.selectedStrokeWidth * h))
                  let e = Math.round(u * h * 2)
                  e % 2 != p % 2 && (e += 1)
                  s(
                    l,
                    {
                      ...r,
                      point: new n.Point(
                        Math.round(r.point.x * h) + P,
                        Math.round(r.point.y * c) + P,
                      ),
                    },
                    e / 2,
                    t,
                  )
                }
              }
            }
          }
        }
      }
      function m(t, e = t.pointIndex, i, n, o, r, s, a, l, h) {
        return {
          point: t,
          pointIndex: e,
          cursorType: i,
          square: n,
          hitTarget: o,
          snappingPrice: r,
          snappingIndex: s,
          nonDiscreteIndex: a,
          activeItem: l,
          possibleMovingDirections: h,
        }
      }
      function S(t) {
        return m(t)
      }
    },
    74011: (t, e, i) => {
      i.d(e, { PolygonRenderer: () => p })
      var n = i(34026),
        o = i(4652),
        r = i(91046),
        s = i(49857),
        a = i(56468),
        l = i(19063),
        h = i(75919),
        c = i(61993),
        d = i(37743),
        u = i(51056),
        _ = i(64034)
      class p extends h.MediaCoordinatesPaneRenderer {
        constructor(t) {
          super(),
            (this._data = null),
            (this._backHittest = new a.HitTestResult(
              a.HitTarget.MovePointBackground,
            )),
            (this._points = []),
            (this._hittest = t ?? new a.HitTestResult(a.HitTarget.MovePoint))
        }
        setData(t) {
          ;(this._data = t), (this._points = t.points)
        }
        hitTest(t) {
          if (null === this._data || this._data.disableInteractions) return null
          const e = Math.max(
              (0, c.interactionTolerance)().line,
              Math.ceil(this._data.linewidth / 2),
            ),
            i = this._points.length
          if (1 === i) {
            return (0, n.pointInCircle)(t, this._points[0], e)
              ? this._hittest
              : null
          }
          for (let n = 1; n < i; n++) {
            const i = this._points[n - 1],
              r = this._points[n]
            if ((0, o.distanceToSegment)(i, r, t).distance <= e)
              return this._hittest
          }
          if (this._data.filled && this._data.fillBackground && i > 0) {
            const n = this._points[0],
              r = this._points[i - 1]
            if ((0, o.distanceToSegment)(n, r, t).distance <= e)
              return this._hittest
          }
          return this._data.filled &&
            this._data.fillBackground &&
            (0, n.pointInPolygon)(t, this._data.points)
            ? this._backHittest
            : null
        }
        _drawImpl(t) {
          const e = t.context,
            i = this._points.length
          if (null === this._data || 0 === i) return
          const n = e.globalAlpha
          try {
            if (
              (void 0 !== this._data.globalAlpha &&
                (e.globalAlpha = this._data.globalAlpha),
              1 === i)
            )
              return void this._drawPoint(
                e,
                this._points[0],
                this._data.linewidth / 2,
                this._data.color,
              )
            e.beginPath()
            const t =
                this._data.linestyle === u.LINESTYLE_SOLID ? 'round' : 'butt',
              n = this._data.linecap ?? t
            ;(e.lineCap = n),
              (e.strokeStyle = this._data.color),
              (e.lineWidth = this._data.linewidth),
              (e.lineJoin = this._data.linejoin ?? 'round'),
              (0, d.setLineStyle)(e, this._data.linestyle)
            const o = this._points[0]
            e.moveTo(o.x, o.y)
            for (const t of this._points) e.lineTo(t.x, t.y)
            if (
              (this._data.filled &&
                this._data.fillBackground &&
                ((e.fillStyle = (0, l.generateColor)(
                  this._data.backcolor,
                  this._data.transparency,
                )),
                e.fill()),
              this._data.filled && !this._data.skipClosePath && e.closePath(),
              i > 1)
            ) {
              if (this._data.leftend === s.LineEnd.Arrow) {
                const t = this._correctArrowPoints(
                  this._points[1],
                  this._points[0],
                  e.lineWidth,
                  n,
                )
                ;(0, r.drawArrow)(
                  t[0],
                  t[1],
                  e,
                  e.lineWidth,
                  _.dpr1PixelRatioInfo,
                )
              }
              if (this._data.rightend === s.LineEnd.Arrow) {
                const t = this._correctArrowPoints(
                  this._points[i - 2],
                  this._points[i - 1],
                  e.lineWidth,
                  n,
                )
                ;(0, r.drawArrow)(
                  t[0],
                  t[1],
                  e,
                  e.lineWidth,
                  _.dpr1PixelRatioInfo,
                )
              }
            }
            this._data.linewidth > 0 && e.stroke()
          } finally {
            e.globalAlpha = n
          }
        }
        _drawPoint(t, e, i, n) {
          0 !== i &&
            (t.beginPath(),
            (t.fillStyle = n),
            t.arc(e.x, e.y, i, 0, 2 * Math.PI, !0),
            t.fill(),
            t.closePath())
        }
        _correctArrowPoints(t, e, i, n) {
          const o = e.subtract(t),
            r = o.length()
          if ('butt' === n || r < 1) return [t, e]
          const s = r + i / 2
          return [t, o.scaled(s / r).add(t)]
        }
      }
    },
  },
])
