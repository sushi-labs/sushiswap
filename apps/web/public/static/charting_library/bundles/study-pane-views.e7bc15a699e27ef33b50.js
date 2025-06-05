;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [507],
  {
    596184: (t, e, i) => {
      i.d(e, { PolygonRenderer: () => p })
      var s = i(934026),
        r = i(204652),
        n = i(305227),
        a = i(243939),
        o = i(353795),
        l = i(32240),
        d = i(104947),
        h = i(466093),
        c = i(741253),
        u = i(549696)
      class p extends d.MediaCoordinatesPaneRenderer {
        constructor(t) {
          super(),
            (this._data = null),
            (this._backHittest = new o.HitTestResult(
              o.HitTarget.MovePointBackground,
            )),
            (this._points = []),
            (this._hittest =
              null != t ? t : new o.HitTestResult(o.HitTarget.MovePoint))
        }
        setData(t) {
          ;(this._data = t), (this._points = t.points)
        }
        hitTest(t) {
          if (
            null === this._data ||
            (void 0 !== this._data.mouseTouchable && !this._data.mouseTouchable)
          )
            return null
          const e = Math.max(
              (0, h.interactionTolerance)().line,
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
          var e, i
          const s = t.context,
            r = this._points.length
          if (null === this._data || 0 === r) return
          if (1 === r)
            return void this._drawPoint(
              s,
              this._points[0],
              this._data.linewidth / 2,
              this._data.color,
            )
          s.beginPath()
          const o =
              this._data.linestyle === u.LINESTYLE_SOLID ? 'round' : 'butt',
            d = null !== (e = this._data.linecap) && void 0 !== e ? e : o
          ;(s.lineCap = d),
            (s.strokeStyle = this._data.color),
            (s.lineWidth = this._data.linewidth),
            (s.lineJoin =
              null !== (i = this._data.linejoin) && void 0 !== i ? i : 'round'),
            (0, c.setLineStyle)(s, this._data.linestyle)
          const h = this._points[0]
          s.moveTo(h.x, h.y)
          for (const t of this._points) s.lineTo(t.x, t.y)
          if (
            (this._data.filled &&
              this._data.fillBackground &&
              ((s.fillStyle = (0, l.generateColor)(
                this._data.backcolor,
                this._data.transparency,
              )),
              s.fill()),
            this._data.filled && !this._data.skipClosePath && s.closePath(),
            r > 1)
          ) {
            if (this._data.leftend === a.LineEnd.Arrow) {
              const t = this._correctArrowPoints(
                this._points[1],
                this._points[0],
                s.lineWidth,
                d,
              )
              ;(0, n.drawArrow)(t[0], t[1], s, s.lineWidth, 1)
            }
            if (this._data.rightend === a.LineEnd.Arrow) {
              const t = this._correctArrowPoints(
                this._points[r - 2],
                this._points[r - 1],
                s.lineWidth,
                d,
              )
              ;(0, n.drawArrow)(t[0], t[1], s, s.lineWidth, 1)
            }
          }
          this._data.linewidth > 0 && s.stroke()
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
    470393: (t, e, i) => {
      i.r(e), i.d(e, { BackgroundPaneView: () => l })
      var s = i(650151),
        r = i(734792),
        n = i(620218),
        a = i(32240)
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
            r = e.pixelRatio,
            o = Math.round(i.x1 * r),
            l = Math.round(i.x2 * r)
          ;(0, n.fillRect)(t, o, 0, l - o, e.physicalHeight, s)
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
        update() {
          this._invalidated = !0
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
            let l, d
            t.forEach((t) => {
              const i =
                  null !== t.start
                    ? t.start
                    : (0, s.ensureNotNull)(e.points().range().value())
                        .firstIndex,
                o = t.stop
              if (o < n || a < i) return
              let h = e.indexToCoordinate(i) - 0.5 * e.barSpacing()
              const c = e.indexToCoordinate(o) + 0.5 * e.barSpacing()
              d === i - 1 && (h = l || h),
                (l = c),
                (d = o),
                (h < 0 && c < 0) ||
                  (h > e.width() && c > e.width()) ||
                  this._data.push({
                    x1: h,
                    x2: c,
                    color: r.color.value(),
                    transparency: r.transparency.value(),
                  })
            })
          })
        }
      }
    },
    635135: (t, e, i) => {
      i.r(e), i.d(e, { HHistPaneView: () => y })
      var s = i(724377),
        r = i(650151),
        n = i(353795),
        a = i(767822),
        o = i(734792),
        l = i(787672),
        d = i(86441),
        h = i(620218),
        c = i(357407),
        u = i(526019)
      function p(t, e) {
        return { min: Math.min(t, e), max: Math.max(t, e) }
      }
      class f {
        constructor(t) {
          this._data = t
        }
        hitTest(t, e) {
          const i = this._data
          for (const s of i.histograms) {
            if (s.yRange.min >= t.y || t.y >= s.yRange.max) continue
            let r = null
            for (const o of s.bars) {
              const l = i.styles[o.styleId]
              if (!l.visible) continue
              if (
                l.location === a.HHistLocation.Absolute &&
                (s.xRange.min >= t.x || t.x >= s.xRange.max)
              )
                continue
              null === r &&
                ((r = 0),
                s.bars.forEach((t) => {
                  const e = t.subBarValues.reduce((t, e) => t + e)
                  r = Math.max(r, e)
                }))
              const d = _(s.xRange, l, e.cssWidth),
                { xBasePoint: h, sign: c, xRangeWidth: u } = d,
                p = Math.max(
                  (l.percentWidth * u) / 100 - o.subBarValues.length,
                  0,
                )
              let f = h
              for (let e = 0; e < o.subBarValues.length; e++) {
                const i = o.y,
                  s = o.y + o.height,
                  a = f,
                  l = a + c * ((p * o.subBarValues[e]) / r)
                if (
                  ((f = l),
                  ((t.x >= a && t.x <= l) || (t.x >= l && t.x <= a)) &&
                    t.y >= i &&
                    t.y <= s)
                )
                  return new n.HitTestResult(n.HitTarget.Regular)
              }
            }
          }
          return null
        }
        draw(t, e) {
          const i = this._data,
            r = e.pixelRatio
          t.save(),
            i.histograms.forEach((n) => {
              if (i.histBoxBgColor) {
                t.beginPath(), (t.fillStyle = i.histBoxBgColor)
                const e = Math.round(n.xRange.min * r),
                  s = Math.round(n.yRange.min * r),
                  a = Math.round(n.xRange.max * r) - e,
                  o = Math.round(n.yRange.max * r) - s
                t.rect(e, s, a, o), t.fill()
              }
              const a = []
              let o = 0,
                l = 0
              n.bars.forEach((t) => {
                const e = t.subBarValues.reduce((t, e) => t + e)
                ;(o = Math.max(o, e)), (l += t.height)
              })
              const d = l / n.bars.length,
                h = ((t, e) =>
                  Math.floor(t * e) >= 1 * e ? Math.floor(e) : 0)(d, r),
                c = []
              if (
                (n.bars.forEach((s) => {
                  const l = i.styles[s.styleId]
                  if (!l.visible) return
                  if (l.showValues && l.addToTotalValue)
                    for (let t = 0; t < s.subBarValues.length; t++)
                      a[t] = (a[t] || 0) + s.subBarValues[t]
                  const d = _(n.xRange, l, e.cssWidth),
                    { xBasePoint: u, sign: p, xRangeWidth: f } = d
                  if (s.y > e.cssHeight || s.y + s.height < 0) return
                  const m = Math.max(
                    (l.percentWidth * f) / 100 - s.subBarValues.length,
                    0,
                  )
                  let x = u
                  for (let e = 0; e < s.subBarValues.length; e++) {
                    const i = s.y,
                      n = s.y + s.height,
                      a = x,
                      d = a + p * ((m * s.subBarValues[e]) / o)
                    if (Math.abs(d - a) < 0.5) continue
                    ;(x = d), t.beginPath(), (t.fillStyle = l.colors[e])
                    const c = Math.round(a * r),
                      u = Math.round(i * r),
                      f = Math.round(d * r) - c,
                      _ = Math.max(Math.round(n * r) - u - h, 1)
                    t.rect(c, u, f, _), t.fill()
                  }
                  if (!l.showValues) return
                  const y = v(s.displayedValues, l.direction),
                    w = g(f, s.y, s.height, d, l, y)
                  c.push(w)
                }),
                a.length > 0)
              ) {
                const t = i.styles[n.bars[0].styleId],
                  r = _(n.xRange, t, e.cssWidth),
                  o = v(a, t.direction),
                  l = n.bars[n.bars.length - 1],
                  h = g(r.xRangeWidth, l.y + l.height, d, r, t, o)
                ;(h.color = (0, s.shiftColor)(h.color, 1.5)), c.push(h)
              }
              const u = Math.min(...c.map((t) => t.fontSize))
              if (u >= 7.5) for (const i of c) (i.fontSize = u), m(t, e, i)
            }),
            t.restore()
        }
      }
      function _(t, e, i) {
        const s = e.location === a.HHistLocation.Absolute,
          r = e.location === a.HHistLocation.Relative,
          n = e.direction === a.HHistDirection.LeftToRight,
          o = e.direction === a.HHistDirection.RightToLeft
        let l, d
        if (s && n) (l = t.min), (d = 1)
        else if (s && o) (l = t.max), (d = -1)
        else if (r && n) (l = 0), (d = 1)
        else {
          if (!r || !o)
            throw new Error(
              `Unknown location/direction values: ${e.location}/${e.direction}`,
            )
          ;(l = i), (d = -1)
        }
        var h
        return {
          xBasePoint: l,
          sign: d,
          xRangeWidth: r ? i : (h = t).max - h.min,
        }
      }
      function v(t, e) {
        e === a.HHistDirection.RightToLeft && (t = t.slice()).reverse()
        const i = new c.VolumeFormatter()
        return t.map((t) => i.format(t)).join('x')
      }
      function g(t, e, i, s, r, n) {
        const { fontSize: o, verticalOffset: l } = ((t, e, i) => ({
            fontSize: Math.min(
              Math.round((1.7 * t) / i.length),
              Math.round(0.6 * e),
            ),
            verticalOffset: 0.7 * e,
          }))(t, i, n),
          h = r.direction === a.HHistDirection.LeftToRight ? 'left' : 'right',
          { xBasePoint: c, sign: u } = s,
          p = c + 3 * u,
          f = e + l
        return {
          text: n,
          color: r.valuesColor,
          fontSize: o,
          align: h,
          point: new d.Point(p, f),
        }
      }
      function m(t, e, i) {
        const { text: s, color: r, fontSize: n, align: a, point: o } = i
        ;(t.font = `${n}px ${u.CHART_FONT_FAMILY}`),
          (t.fillStyle = r),
          (t.textAlign = a),
          (0, h.drawScaled)(t, e.pixelRatio, e.pixelRatio, () =>
            t.fillText(s, o.x, o.y),
          )
      }
      var x = i(32240)
      class y {
        constructor(t, e, i, s, r = !1, n = !1) {
          ;(this._invalidated = !0),
            (this._histBoxBgStyle = null),
            (this._provider = t),
            (this._model = e),
            (this._histBoxBgStyle = null != s ? s : null),
            (this._extendToBarsEndings = r),
            (this._alwaysVisible = n),
            (this._rendererData = { histograms: [], styles: {} }),
            (this._textData = []),
            (this._hhistRenderer = new f(this._rendererData))
        }
        update() {
          this._invalidated = !0
        }
        renderer() {
          this._invalidated &&
            (this._updateViewInternal(), (this._invalidated = !1))
          const t = new o.CompositeRenderer()
          t.append(this._hhistRenderer)
          for (const e of this._textData)
            t.append(
              new l.TextRenderer(e, new n.HitTestResult(n.HitTarget.Regular)),
            )
          return t
        }
        _resetRenderersData() {
          ;(this._rendererData.histograms = []),
            (this._rendererData.styles = {}),
            (this._rendererData.histBoxBgColor = void 0),
            (this._textData = [])
        }
        _prepareStyles() {
          var t, e
          const i = (0, r.ensureDefined)(this._provider.graphicsInfo().hhists),
            s = Object.keys(i),
            n = (0, r.ensureDefined)(
              this._provider.properties().childs().graphics.childs().hhists,
            ),
            o =
              (null ===
                (e =
                  null === (t = this._provider.properties().child('inputs')) ||
                  void 0 === t
                    ? void 0
                    : t.child('volume')) || void 0 === e
                ? void 0
                : e.value()) === a.HHistVolumeMode.Delta
          for (const t of s) {
            const e = (0, r.ensureDefined)(n.childs()[t]).childs(),
              s = (0, r.ensureDefined)(i[t])
            if (o)
              (this._rendererData.styles[t + 'UpDominate'] = {
                colors: w(e.colors[0].value(), e.transparencies[0].value()),
                visible: e.visible.value(),
                percentWidth: e.percentWidth.value(),
                location: s.location,
                direction: e.direction.value(),
                showValues: e.showValues.value(),
                addToTotalValue: !1,
                valuesColor: e.valuesColor.value(),
              }),
                (this._rendererData.styles[t + 'DownDominate'] = {
                  colors: w(e.colors[1].value(), e.transparencies[1].value()),
                  visible: e.visible.value(),
                  percentWidth: e.percentWidth.value(),
                  location: s.location,
                  direction: e.direction.value(),
                  showValues: e.showValues.value(),
                  addToTotalValue: !1,
                  valuesColor: e.valuesColor.value(),
                })
            else {
              const i = (0, x.generateColor)(
                  e.colors[0].value(),
                  e.transparencies[0].value(),
                ),
                r = e.colors[1]
                  ? (0, x.generateColor)(
                      e.colors[1].value(),
                      e.transparencies[1].value(),
                    )
                  : i
              this._rendererData.styles[t] = {
                colors: [i, r],
                visible: e.visible.value(),
                percentWidth: e.percentWidth.value(),
                location: s.location,
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
            (0, r.ensureDefined)(i).forEach((i, s) => {
              let r = 1 / 0,
                o = -1 / 0
              i.forEach((t) => {
                ;(r = Math.min(r, t.firstBarTime)),
                  (o = Math.max(o, t.lastBarTime))
              }),
                (!this._alwaysVisible && (o < n || r > a)) ||
                  this._updateDataForRenderers(i, t, e)
            })
        }
        _updateDataForRenderers(t, e, i) {
          var s, n
          if (t.size <= 0) return
          let o = null
          if (
            (t.forEach((t) => {
              o = o || t
            }),
            null === o)
          )
            return
          let l = o
          t.forEach((t) => {
            t.priceLow < l.priceLow && (l = t)
          })
          const d =
              (null ===
                (n =
                  null === (s = this._provider.properties().child('inputs')) ||
                  void 0 === s
                    ? void 0
                    : s.child('volume')) || void 0 === n
                ? void 0
                : n.value()) === a.HHistVolumeMode.Delta,
            h = ((t, e, i) => {
              const s = i ? e.barSpacing() / 2 : 0
              return p(
                e.indexToCoordinate(t.firstBarTime) - s,
                e.indexToCoordinate(t.lastBarTime) + s,
              )
            })(o, i, this._extendToBarsEndings),
            c = (0, r.ensureNotNull)(this._provider.firstValue()),
            u = []
          t.forEach((t) => {
            null == t.rate[t.rate.length - 1] && t.rate.splice(-1, 1)
            let i = [],
              s = [],
              r = t.styleId
            if (d) {
              const [e, n, a] =
                t.rate[0] > t.rate[1]
                  ? [t.rate[1], t.rate[0], 'UpDominate']
                  : [t.rate[0], t.rate[1], 'DownDominate']
              ;(i = [n - e, e, e]), (s = [n - e]), (r += a)
            } else (i = t.rate), (s = t.rate)
            const n = ((t, e, i) =>
              p(
                e.priceToCoordinate(t.priceHigh, i),
                e.priceToCoordinate(t.priceLow, i),
              ))(t, e, c)
            u.push({
              height: n.max - n.min,
              y: n.min,
              subBarValues: i,
              displayedValues: s,
              styleId: r,
            })
          }),
            u.sort((t, e) => t.y - e.y),
            this._rendererData.histograms.push({
              xRange: h,
              yRange: p(u[0].y, u[u.length - 1].y + u[u.length - 1].height),
              bars: u,
            })
        }
      }
      function w(t, e) {
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
    145802: (t, e, i) => {
      i.r(e), i.d(e, { HorizLinePaneView: () => o })
      var s = i(650151),
        r = i(353795),
        n = i(734792),
        a = i(591014)
      class o {
        constructor(t, e, i, s = !1) {
          ;(this._data = []),
            (this._invalidated = !0),
            (this._provider = t),
            (this._model = e),
            (this._extendToBarsEndings = s),
            (this._hitTestResult =
              void 0 !== i
                ? new r.HitTestResult(r.HitTarget.Custom, i)
                : new r.HitTestResult(r.HitTarget.Regular))
        }
        update() {
          this._invalidated = !0
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
            l = this._extendToBarsEndings ? e.barSpacing() / 2 : 0,
            d = (0, s.ensureDefined)(
              this._provider.properties().childs().graphics.childs().horizlines,
            )
          i.forEach((i, r) => {
            const h = (0, s.ensureDefined)(d.childs()[r]).childs()
            h.visible.value() &&
              i.forEach((i) => {
                const r = i.startIndex,
                  d = i.endIndex
                ;(!i.extendRight && Math.max(r, d) < a) ||
                  (!i.extendLeft && Math.min(r, d) > o) ||
                  this._data.push({
                    y: t.priceToCoordinate((0, s.ensureDefined)(i.level), n),
                    left: i.extendLeft ? void 0 : e.indexToCoordinate(r) - l,
                    right: i.extendRight ? void 0 : e.indexToCoordinate(d) + l,
                    color: h.color.value(),
                    linewidth: h.width.value(),
                    linestyle: h.style.value(),
                  })
              })
          })
        }
      }
    },
    53955: (t, e, i) => {
      i.r(e), i.d(e, { PolygonPaneView: () => d })
      var s = i(650151),
        r = i(86441),
        n = i(353795),
        a = i(734792),
        o = i(549696),
        l = i(596184)
      class d {
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
        update() {
          this._invalidated = !0
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
            d = n.lastBar(),
            h = (0, s.ensureDefined)(
              this._provider.properties().childs().graphics.childs().polygons,
            ),
            c = (0, s.ensureDefined)(this._provider.graphicsInfo().polygons)
          i.forEach((i, n) => {
            const u = (0, s.ensureDefined)(h.childs()[n]).childs(),
              p = (0, s.ensureDefined)(c[n])
            100 !== u.transparency.value() &&
              i.forEach((i) => {
                let n = 1 / 0,
                  h = -1 / 0
                for (const t of i.points) {
                  const e = t.index + (t.offset || 0)
                  ;(n = Math.min(n, e)), (h = Math.max(h, e))
                }
                if (h < l || d < n) return
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
                  mouseTouchable: p.mouseTouchable,
                })
              })
          })
        }
      }
    },
    131539: (t, e, i) => {
      i.r(e), i.d(e, { VertLinePaneView: () => l })
      var s = i(650151),
        r = i(353795),
        n = i(694454),
        a = i(734792),
        o = i(820151)
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
        update() {
          this._invalidated = !0
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
            d = a.lastBar(),
            h = (0, s.ensureDefined)(
              this._provider.properties().childs().graphics.childs().vertlines,
            )
          r.forEach((r, a) => {
            const c = (0, s.ensureDefined)(h.childs()[a]).childs(),
              u = (0, s.ensureDefined)(i[a])
            if (!c.visible.value()) return
            let p = 0
            switch (u.halign) {
              case n.HAlign.Left:
                p = -e.barSpacing() / 2
                break
              case n.HAlign.Right:
                p = e.barSpacing() / 2
            }
            r.forEach((i) => {
              const r = i.index
              r < l ||
                d < r ||
                this._data.push({
                  x: e.indexToCoordinate(r) + p,
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
