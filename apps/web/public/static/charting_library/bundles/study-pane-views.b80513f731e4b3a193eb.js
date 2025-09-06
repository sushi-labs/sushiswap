;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [507],
  {
    74011: (t, e, i) => {
      i.d(e, { PolygonRenderer: () => f })
      var s = i(34026),
        r = i(4652),
        n = i(91046),
        a = i(49857),
        o = i(56468),
        l = i(19063),
        h = i(75919),
        d = i(61993),
        c = i(37743),
        u = i(51056),
        p = i(64034)
      class f extends h.MediaCoordinatesPaneRenderer {
        constructor(t) {
          super(),
            (this._data = null),
            (this._backHittest = new o.HitTestResult(
              o.HitTarget.MovePointBackground,
            )),
            (this._points = []),
            (this._hittest = t ?? new o.HitTestResult(o.HitTarget.MovePoint))
        }
        setData(t) {
          ;(this._data = t), (this._points = t.points)
        }
        hitTest(t) {
          if (null === this._data || this._data.disableInteractions) return null
          const e = Math.max(
              (0, d.interactionTolerance)().line,
              Math.ceil(this._data.linewidth / 2),
            ),
            i = this._points.length
          if (1 === i) {
            return (0, s.pointInCircle)(t, this._points[0], e)
              ? this._hittest
              : null
          }
          for (let s = 1; s < i; s++) {
            const i = this._points[s - 1],
              n = this._points[s]
            if ((0, r.distanceToSegment)(i, n, t).distance <= e)
              return this._hittest
          }
          if (this._data.filled && this._data.fillBackground && i > 0) {
            const s = this._points[0],
              n = this._points[i - 1]
            if ((0, r.distanceToSegment)(s, n, t).distance <= e)
              return this._hittest
          }
          return this._data.filled &&
            this._data.fillBackground &&
            (0, s.pointInPolygon)(t, this._data.points)
            ? this._backHittest
            : null
        }
        _drawImpl(t) {
          const e = t.context,
            i = this._points.length
          if (null === this._data || 0 === i) return
          const s = e.globalAlpha
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
              s = this._data.linecap ?? t
            ;(e.lineCap = s),
              (e.strokeStyle = this._data.color),
              (e.lineWidth = this._data.linewidth),
              (e.lineJoin = this._data.linejoin ?? 'round'),
              (0, c.setLineStyle)(e, this._data.linestyle)
            const r = this._points[0]
            e.moveTo(r.x, r.y)
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
              if (this._data.leftend === a.LineEnd.Arrow) {
                const t = this._correctArrowPoints(
                  this._points[1],
                  this._points[0],
                  e.lineWidth,
                  s,
                )
                ;(0, n.drawArrow)(
                  t[0],
                  t[1],
                  e,
                  e.lineWidth,
                  p.dpr1PixelRatioInfo,
                )
              }
              if (this._data.rightend === a.LineEnd.Arrow) {
                const t = this._correctArrowPoints(
                  this._points[i - 2],
                  this._points[i - 1],
                  e.lineWidth,
                  s,
                )
                ;(0, n.drawArrow)(
                  t[0],
                  t[1],
                  e,
                  e.lineWidth,
                  p.dpr1PixelRatioInfo,
                )
              }
            }
            this._data.linewidth > 0 && e.stroke()
          } finally {
            e.globalAlpha = s
          }
        }
        _drawPoint(t, e, i, s) {
          0 !== i &&
            (t.beginPath(),
            (t.fillStyle = s),
            t.arc(e.x, e.y, i, 0, 2 * Math.PI, !0),
            t.fill(),
            t.closePath())
        }
        _correctArrowPoints(t, e, i, s) {
          const r = e.subtract(t),
            n = r.length()
          if ('butt' === s || n < 1) return [t, e]
          const a = n + i / 2
          return [t, r.scaled(a / n).add(t)]
        }
      }
    },
    55269: (t, e, i) => {
      i.r(e), i.d(e, { BackgroundPaneView: () => l })
      var s = i(50151),
        r = i(95201),
        n = i(7114),
        a = i(19063)
      class o {
        constructor(t) {
          this._data = t
        }
        hitTest(t) {
          return null
        }
        draw(t, e) {}
        drawBackground(t, e) {
          const i = this._data,
            s = (0, a.generateColor)(this._data.color, this._data.transparency),
            r = Math.round(i.x1 * e.horizontalPixelRatio),
            o = Math.round(i.x2 * e.verticalPixelRatio)
          ;(0, n.fillRect)(t, r, 0, o - r, e.bitmapSize.height, s)
        }
      }
      class l {
        constructor(t, e, i) {
          ;(this._data = []),
            (this._invalidated = !0),
            (this._provider = t),
            (this._model = e),
            (this._data = [])
        }
        update(t) {
          'hover-change' !== t.type && (this._invalidated = !0)
        }
        renderer() {
          this._invalidated &&
            (this._updateViewInternal(), (this._invalidated = !1))
          const t = new r.CompositeRenderer()
          for (const e of this._data) t.append(new o(e))
          return t
        }
        _updateViewInternal() {
          this._data = []
          const t = this._provider.priceScale(),
            e = this._model.timeScale()
          if (!t || t.isEmpty() || e.isEmpty()) return
          const i = this._provider.graphics().backgrounds()
          if (0 === i.size) return
          const r = this._model.timeScale().visibleBarsStrictRange()
          if (null === r) return
          const n = r.firstBar(),
            a = r.lastBar(),
            o = (0, s.ensureDefined)(
              this._provider.properties().childs().graphics.childs()
                .backgrounds,
            )
          i.forEach((t, i) => {
            const r = (0, s.ensureDefined)(o.childs()[i]).childs()
            if (!r.visible.value()) return
            let l, h
            t.forEach((t) => {
              const i =
                  null !== t.start
                    ? t.start
                    : (0, s.ensureNotNull)(e.points().range().value())
                        .firstIndex,
                o = t.stop
              if (o < n || a < i) return
              let d = e.barBorders(i).left
              const c = e.barBorders(o).right
              h === i - 1 && (d = l || d),
                (l = c),
                (h = o),
                (d < 0 && c < 0) ||
                  (d > e.width() && c > e.width()) ||
                  this._data.push({
                    x1: d,
                    x2: c,
                    color: r.color.value(),
                    transparency: r.transparency.value(),
                  })
            })
          })
        }
      }
    },
    56208: (t, e, i) => {
      i.r(e), i.d(e, { HHistPaneView: () => w })
      var s = i(24377),
        r = i(50151),
        n = i(9233),
        a = i(95201),
        o = i(86441),
        l = i(7114),
        h = i(56468),
        d = i(74079),
        c = i(15938)
      function u(t, e) {
        return { min: Math.min(t, e), max: Math.max(t, e) }
      }
      const p = (0, d.getVolumeFormatter)()
      class f {
        constructor(t) {
          this._data = t
        }
        hitTest(t, e) {
          const i = this._data
          for (const s of i.histograms) {
            if (s.yRange.min >= t.y || t.y >= s.yRange.max) continue
            let r = null
            for (const a of s.bars) {
              const o = i.styles[a.styleId]
              if (!o.visible) continue
              if (
                o.location === n.HHistLocation.Absolute &&
                (s.xRange.min >= t.x || t.x >= s.xRange.max)
              )
                continue
              null === r &&
                ((r = 0),
                s.bars.forEach((t) => {
                  const e = t.subBarValues.reduce((t, e) => t + e)
                  r = Math.max(r, e)
                }))
              const l = _(s.xRange, o, e.mediaSize.width),
                { xBasePoint: d, sign: c, xRangeWidth: u } = l,
                p = Math.max(
                  (o.percentWidth * u) / 100 - a.subBarValues.length,
                  0,
                )
              let f = d
              for (let e = 0; e < a.subBarValues.length; e++) {
                const i = a.y,
                  s = a.y + a.height,
                  n = f,
                  o = n + c * ((p * a.subBarValues[e]) / r)
                if (
                  ((f = o),
                  ((t.x >= n && t.x <= o) || (t.x >= o && t.x <= n)) &&
                    t.y >= i &&
                    t.y <= s)
                )
                  return new h.HitTestResult(h.HitTarget.Regular)
              }
            }
          }
          return null
        }
        draw(t, e) {
          const i = this._data,
            { horizontalPixelRatio: r, verticalPixelRatio: n } = e
          t.save(),
            i.histograms.forEach((a) => {
              if (i.histBoxBgColor) {
                t.beginPath(), (t.fillStyle = i.histBoxBgColor)
                const e = Math.round(a.xRange.min * r),
                  s = Math.round(a.yRange.min * n),
                  o = Math.round(a.xRange.max * r) - e,
                  l = Math.round(a.yRange.max * n) - s
                t.rect(e, s, o, l), t.fill()
              }
              const o = []
              let l = 0,
                h = 0
              a.bars.forEach((t) => {
                const e = t.subBarValues.reduce((t, e) => t + e)
                ;(l = Math.max(l, e)), (h += t.height)
              })
              const d = h / a.bars.length,
                c = ((t, e) => {
                  const i = Math.floor(t * e)
                  return i >= 1 * e ? Math.floor(e) : 0
                })(d, r),
                u = []
              if (
                (a.bars.forEach((s) => {
                  const h = i.styles[s.styleId]
                  if (!h.visible) return
                  if (h.showValues && h.addToTotalValue)
                    for (let t = 0; t < s.subBarValues.length; t++)
                      o[t] = (o[t] || 0) + s.subBarValues[t]
                  const d = _(a.xRange, h, e.mediaSize.width),
                    { xBasePoint: p, sign: f, xRangeWidth: m } = d
                  if (s.y > e.mediaSize.height || s.y + s.height < 0) return
                  const y = Math.max(
                    (h.percentWidth * m) / 100 - s.subBarValues.length,
                    0,
                  )
                  let x = p
                  for (let e = 0; e < s.subBarValues.length; e++) {
                    const i = s.y,
                      a = s.y + s.height,
                      o = x,
                      d = o + f * ((y * s.subBarValues[e]) / l)
                    if (Math.abs(d - o) < 0.5) continue
                    ;(x = d), t.beginPath(), (t.fillStyle = h.colors[e])
                    const u = Math.round(o * r),
                      p = Math.round(i * n),
                      _ = Math.round(d * r) - u,
                      g = Math.max(Math.round(a * n) - p - c, 1)
                    t.rect(u, p, _, g), t.fill()
                  }
                  if (!h.showValues) return
                  const w = g(s.displayedValues, h.direction),
                    b = v(m, s.y, s.height, d, h, w)
                  u.push(b)
                }),
                o.length > 0)
              ) {
                const t = i.styles[a.bars[0].styleId],
                  r = _(a.xRange, t, e.mediaSize.width),
                  n = g(o, t.direction),
                  l = a.bars[a.bars.length - 1],
                  h = v(r.xRangeWidth, l.y + l.height, d, r, t, n)
                ;(h.color = (0, s.shiftColor)(h.color, 1.5)), u.push(h)
              }
              const p = Math.min(...u.map((t) => t.fontSize))
              if (p >= 7.5) for (const i of u) (i.fontSize = p), m(t, e, i)
            }),
            t.restore()
        }
      }
      function _(t, e, i) {
        const s = e.location === n.HHistLocation.Absolute,
          r = e.location === n.HHistLocation.Relative,
          a = e.direction === n.HHistDirection.LeftToRight,
          o = e.direction === n.HHistDirection.RightToLeft
        let l, h
        if (s && a) (l = t.min), (h = 1)
        else if (s && o) (l = t.max), (h = -1)
        else if (r && a) (l = 0), (h = 1)
        else {
          if (!r || !o)
            throw new Error(
              `Unknown location/direction values: ${e.location}/${e.direction}`,
            )
          ;(l = i), (h = -1)
        }
        var d
        return {
          xBasePoint: l,
          sign: h,
          xRangeWidth: r ? i : (d = t).max - d.min,
        }
      }
      function g(t, e) {
        return (
          e === n.HHistDirection.RightToLeft && (t = t.slice()).reverse(),
          t.map((t) => p.format(t)).join('x')
        )
      }
      function v(t, e, i, s, r, a) {
        const { fontSize: l, verticalOffset: h } = ((t, e, i) => ({
            fontSize: Math.min(
              Math.round((1.7 * t) / i.length),
              Math.round(0.6 * e),
            ),
            verticalOffset: 0.7 * e,
          }))(t, i, a),
          d = r.direction === n.HHistDirection.LeftToRight ? 'left' : 'right',
          { xBasePoint: c, sign: u } = s,
          p = c + 3 * u,
          f = e + h
        return {
          text: a,
          color: r.valuesColor,
          fontSize: l,
          align: d,
          point: new o.Point(p, f),
        }
      }
      function m(t, e, i) {
        const { text: s, color: r, fontSize: n, align: a, point: o } = i
        ;(t.font = `${n}px ${c.CHART_FONT_FAMILY}`),
          (t.fillStyle = r),
          (t.textAlign = a),
          (0, l.drawScaled)(
            t,
            e.horizontalPixelRatio,
            e.verticalPixelRatio,
            () => t.fillText(s, o.x, o.y),
          )
      }
      var y,
        x = i(19063)
      !((t) => {
        ;(t.UpDominatePostfix = 'UpDominate'),
          (t.DownDominatePostfix = 'DownDominate')
      })(y || (y = {}))
      class w {
        constructor(t, e, i, s, r = !1, n = () => null, a = !1) {
          ;(this._invalidated = !0),
            (this._histBoxBgStyle = null),
            (this._provider = t),
            (this._model = e),
            (this._histBoxBgStyle = s ?? null),
            (this._alternateLeftIndex = n),
            (this._extendToBarsEndings = r),
            (this._alwaysVisible = a),
            (this._rendererData = { histograms: [], styles: {} }),
            (this._hhistRenderer = new f(this._rendererData))
        }
        update(t) {
          'hover-change' !== t.type && (this._invalidated = !0)
        }
        renderer() {
          this._invalidated &&
            (this._updateViewInternal(), (this._invalidated = !1))
          const t = new a.CompositeRenderer()
          return t.append(this._hhistRenderer), t
        }
        _resetRenderersData() {
          ;(this._rendererData.histograms = []),
            (this._rendererData.styles = {}),
            (this._rendererData.histBoxBgColor = void 0)
        }
        _prepareStyles() {
          const t = (0, r.ensureDefined)(this._provider.graphicsInfo().hhists),
            e = Object.keys(t),
            i = (0, r.ensureDefined)(
              this._provider.properties().childs().graphics.childs().hhists,
            ),
            s =
              this._provider
                .properties()
                .child('inputs')
                ?.child('volume')
                ?.value() === n.HHistVolumeMode.Delta
          for (const n of e) {
            const e = (0, r.ensureDefined)(i.childs()[n]).childs(),
              a = (0, r.ensureDefined)(t[n])
            if (s)
              (this._rendererData.styles[n + 'UpDominate'] = {
                colors: b(e.colors[0].value(), e.transparencies[0].value()),
                visible: e.visible.value(),
                percentWidth: e.percentWidth.value(),
                location: a.location,
                direction: e.direction.value(),
                showValues: e.showValues.value(),
                addToTotalValue: !1,
                valuesColor: e.valuesColor.value(),
              }),
                (this._rendererData.styles[n + 'DownDominate'] = {
                  colors: b(e.colors[1].value(), e.transparencies[1].value()),
                  visible: e.visible.value(),
                  percentWidth: e.percentWidth.value(),
                  location: a.location,
                  direction: e.direction.value(),
                  showValues: e.showValues.value(),
                  addToTotalValue: !1,
                  valuesColor: e.valuesColor.value(),
                })
            else {
              const t = (0, x.generateColor)(
                  e.colors[0].value(),
                  e.transparencies[0].value(),
                ),
                i = e.colors[1]
                  ? (0, x.generateColor)(
                      e.colors[1].value(),
                      e.transparencies[1].value(),
                    )
                  : t
              this._rendererData.styles[n] = {
                colors: [t, i],
                visible: e.visible.value(),
                percentWidth: e.percentWidth.value(),
                location: a.location,
                direction: e.direction.value(),
                showValues: e.showValues.value(),
                addToTotalValue: !0,
                valuesColor: e.valuesColor.value(),
              }
            }
          }
          if (this._histBoxBgStyle) {
            const t = this._histBoxBgStyle.childs()
            this._rendererData.histBoxBgColor = (0, x.generateColor)(
              t.color.value(),
              t.transparency.value(),
            )
          }
        }
        _updateViewInternal() {
          this._resetRenderersData()
          const t = this._provider.priceScale(),
            e = this._model.timeScale()
          if (!t || t.isEmpty() || e.isEmpty()) return
          if (null === this._provider.firstValue()) return
          const i = this._provider.graphics().hhistsByTimePointIndex()
          if (0 === i.size) return
          const s = e.visibleBarsStrictRange()
          if (null === s) return
          const n = s.firstBar(),
            a = s.lastBar()
          this._prepareStyles(),
            (0, r.ensureDefined)(i).forEach((i) => {
              let s = 1 / 0,
                r = -1 / 0
              for (const t of i) {
                const e = this._hhistFirstBarTime(t)
                if (null === e) return
                ;(s = Math.min(s, e)), (r = Math.max(r, t.lastBarTime))
              }
              ;(!this._alwaysVisible && (r < n || s > a)) ||
                this._updateDataForRenderers(i, t, e)
            })
        }
        _updateDataForRenderers(t, e, i) {
          if (t.size <= 0) return
          let s = null
          if (
            (t.forEach((t) => {
              s = s || t
            }),
            null === s)
          )
            return
          let a = s
          t.forEach((t) => {
            t.priceLow < a.priceLow && (a = t)
          })
          const o =
              this._provider
                .properties()
                .child('inputs')
                ?.child('volume')
                ?.value() === n.HHistVolumeMode.Delta,
            l = ((t, e, i, s) => {
              const r = e.barBorders(t.firstBarTime ?? s),
                n = e.barBorders(t.lastBarTime)
              return i ? u(r.left, n.right) : u(r.center, n.center)
            })(
              s,
              i,
              this._extendToBarsEndings,
              (0, r.ensureNotNull)(this._hhistFirstBarTime(s)),
            ),
            h = (0, r.ensureNotNull)(this._provider.firstValue()),
            d = []
          t.forEach((t) => {
            null == t.rate[t.rate.length - 1] && t.rate.splice(-1, 1)
            let i = [],
              s = [],
              r = t.styleId
            if (o) {
              const [e, n, a] =
                t.rate[0] > t.rate[1]
                  ? [t.rate[1], t.rate[0], 'UpDominate']
                  : [t.rate[0], t.rate[1], 'DownDominate']
              ;(i = [n - e, e, e]), (s = [n - e]), (r += a)
            } else (i = t.rate), (s = t.rate)
            const n = ((t, e, i) =>
              u(
                e.priceToCoordinate(t.priceHigh, i),
                e.priceToCoordinate(t.priceLow, i),
              ))(t, e, h)
            d.push({
              height: n.max - n.min,
              y: n.min,
              subBarValues: i,
              displayedValues: s,
              styleId: r,
            })
          }),
            d.sort((t, e) => t.y - e.y),
            this._rendererData.histograms.push({
              xRange: l,
              yRange: u(d[0].y, d[d.length - 1].y + d[d.length - 1].height),
              bars: d,
            })
        }
        _hhistFirstBarTime(t) {
          return t.firstBarTime ?? this._alternateLeftIndex()
        }
      }
      function b(t, e) {
        let i
        if ((0, x.isHexColor)(t)) i = 100 - e
        else {
          const r = (0, s.tryParseRgba)(t)
          i = 100 - (null !== r ? (0, x.alphaToTransparency)(r[3]) : e)
        }
        return [
          (0, x.generateColor)(t, 100 - i, !0),
          (0, x.generateColor)(t, 100 - i / 2, !0),
          (0, x.generateColor)(t, 100 - i / 4, !0),
        ]
      }
    },
    95258: (t, e, i) => {
      i.r(e), i.d(e, { HorizLinePaneView: () => o })
      var s = i(50151),
        r = i(56468),
        n = i(95201),
        a = i(50600)
      class o {
        constructor(t, e, i, s = !1, n = () => null) {
          ;(this._data = []),
            (this._invalidated = !0),
            (this._provider = t),
            (this._model = e),
            (this._extendToBarsEndings = s),
            (this._alternateStartIndex = n),
            (this._hitTestResult =
              void 0 !== i
                ? new r.HitTestResult(r.HitTarget.Custom, i)
                : new r.HitTestResult(r.HitTarget.Regular))
        }
        update(t) {
          'hover-change' !== t.type && (this._invalidated = !0)
        }
        renderer() {
          this._invalidated &&
            (this._updateViewInternal(), (this._invalidated = !1))
          const t = new n.CompositeRenderer()
          for (const e of this._data) {
            const i = new a.HorizontalLineRenderer()
            i.setData(e), i.setHitTest(this._hitTestResult), t.append(i)
          }
          return t
        }
        _updateViewInternal() {
          this._data = []
          const t = this._provider.priceScale(),
            e = this._model.timeScale()
          if (!t || t.isEmpty() || e.isEmpty()) return
          const i = this._provider.graphics().horizlines()
          if (0 === i.size) return
          const r = this._model.timeScale().visibleBarsStrictRange()
          if (null === r) return
          const n = this._provider.firstValue()
          if (null === n) return
          const a = r.firstBar(),
            o = r.lastBar(),
            l = (0, s.ensureDefined)(
              this._provider.properties().childs().graphics.childs().horizlines,
            )
          i.forEach((i, r) => {
            const h = (0, s.ensureDefined)(l.childs()[r]).childs()
            h.visible.value() &&
              i.forEach((i) => {
                const r = i.startIndex ?? this._alternateStartIndex(),
                  l = i.endIndex
                if (null === r) return
                if (
                  (!i.extendRight && Math.max(r, l) < a) ||
                  (!i.extendLeft && Math.min(r, l) > o)
                )
                  return
                let d, c
                if (!i.extendLeft) {
                  const t = e.barBorders(r)
                  d = this._extendToBarsEndings ? t.left : t.center
                }
                if (!i.extendRight) {
                  const t = e.barBorders(l)
                  c = this._extendToBarsEndings ? t.right : t.center
                }
                this._data.push({
                  y: t.priceToCoordinate((0, s.ensureDefined)(i.level), n),
                  left: d,
                  right: c,
                  color: h.color.value(),
                  linewidth: h.width.value(),
                  linestyle: h.style.value(),
                })
              })
          })
        }
      }
    },
    38332: (t, e, i) => {
      i.r(e), i.d(e, { PolygonPaneView: () => h })
      var s = i(50151),
        r = i(86441),
        n = i(56468),
        a = i(95201),
        o = i(51056),
        l = i(74011)
      class h {
        constructor(t, e, i) {
          ;(this._data = []),
            (this._invalidated = !0),
            (this._provider = t),
            (this._model = e),
            (this._hitTestResult =
              void 0 !== i
                ? new n.HitTestResult(n.HitTarget.Custom, i)
                : new n.HitTestResult(n.HitTarget.Regular))
        }
        update(t) {
          'hover-change' !== t.type && (this._invalidated = !0)
        }
        renderer() {
          this._invalidated &&
            (this._updateViewInternal(), (this._invalidated = !1))
          const t = new a.CompositeRenderer()
          for (const e of this._data) {
            const i = new l.PolygonRenderer(this._hitTestResult)
            i.setData(e), t.append(i)
          }
          return t
        }
        _updateViewInternal() {
          this._data = []
          const t = this._provider.priceScale(),
            e = this._model.timeScale()
          if (!t || t.isEmpty() || e.isEmpty()) return
          const i = this._provider.graphics().polygons()
          if (0 === i.size) return
          const n = this._model.timeScale().visibleBarsStrictRange()
          if (null === n) return
          const a = this._provider.firstValue()
          if (null === a) return
          const l = n.firstBar(),
            h = n.lastBar(),
            d = (0, s.ensureDefined)(
              this._provider.properties().childs().graphics.childs().polygons,
            ),
            c = (0, s.ensureDefined)(this._provider.graphicsInfo().polygons)
          i.forEach((i, n) => {
            const u = (0, s.ensureDefined)(d.childs()[n]).childs(),
              p = (0, s.ensureDefined)(c[n])
            100 !== u.transparency.value() &&
              i.forEach((i) => {
                let n = 1 / 0,
                  d = -1 / 0
                for (const t of i.points) {
                  const e = t.index + (t.offset || 0)
                  ;(n = Math.min(n, e)), (d = Math.max(d, e))
                }
                if (d < l || h < n) return
                const c = i.points.map((i) => {
                  const n = e.indexToCoordinate(i.index + (i.offset || 0)),
                    o = t.priceToCoordinate((0, s.ensureDefined)(i.level), a)
                  return new r.Point(n, o)
                })
                this._data.push({
                  points: c,
                  color: u.color.value(),
                  backcolor: u.color.value(),
                  linewidth: p.showBorder ? 1 : 0,
                  linestyle: o.LINESTYLE_SOLID,
                  filled: !0,
                  fillBackground: !0,
                  transparency: u.transparency.value(),
                  disableInteractions: !p.mouseTouchable,
                })
              })
          })
        }
      }
    },
    51914: (t, e, i) => {
      i.r(e), i.d(e, { VertLinePaneView: () => l })
      var s = i(50151),
        r = i(56468),
        n = i(85904),
        a = i(95201),
        o = i(95173)
      class l {
        constructor(t, e, i) {
          ;(this._data = []),
            (this._invalidated = !0),
            (this._provider = t),
            (this._model = e),
            (this._hitTestResult =
              void 0 !== i
                ? new r.HitTestResult(r.HitTarget.Custom, i)
                : new r.HitTestResult(r.HitTarget.Regular))
        }
        update(t) {
          'hover-change' !== t.type && (this._invalidated = !0)
        }
        renderer() {
          this._invalidated &&
            (this._updateViewInternal(), (this._invalidated = !1))
          const t = new a.CompositeRenderer()
          for (const e of this._data) {
            const i = new o.VerticalLineRenderer()
            i.setData(e), i.setHitTest(this._hitTestResult), t.append(i)
          }
          return t
        }
        _updateViewInternal() {
          this._data = []
          const t = this._provider.priceScale(),
            e = this._model.timeScale()
          if (!t || t.isEmpty() || e.isEmpty()) return
          const i = this._provider.graphicsInfo().vertlines,
            r = this._provider.graphics().vertlines()
          if (0 === r.size || void 0 === i) return
          const a = this._model.timeScale().visibleBarsStrictRange()
          if (null === a) return
          const o = this._provider.firstValue()
          if (null === o) return
          const l = a.firstBar(),
            h = a.lastBar(),
            d = (0, s.ensureDefined)(
              this._provider.properties().childs().graphics.childs().vertlines,
            )
          r.forEach((r, a) => {
            const c = (0, s.ensureDefined)(d.childs()[a]).childs(),
              u = (0, s.ensureDefined)(i[a])
            c.visible.value() &&
              r.forEach((i) => {
                const r = i.index
                if (r < l || h < r) return
                const { left: a, center: d, right: p } = e.barBorders(r)
                let f
                switch (u.halign) {
                  case n.HAlign.Left:
                    f = a
                    break
                  case n.HAlign.Right:
                    f = p
                    break
                  default:
                    f = d
                }
                this._data.push({
                  x: f,
                  top: i.extendTop
                    ? void 0
                    : t.priceToCoordinate((0, s.ensureDefined)(i.endPrice), o),
                  bottom: i.extendBottom
                    ? void 0
                    : t.priceToCoordinate(
                        (0, s.ensureDefined)(i.startPrice),
                        o,
                      ),
                  color: c.color.value(),
                  linewidth: c.width.value(),
                  linestyle: c.style.value(),
                })
              })
          })
        }
      }
    },
  },
])
