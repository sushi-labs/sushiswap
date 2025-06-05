;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1583],
  {
    82161: (e, t, i) => {
      i.d(t, { splitThousands: () => r })
      var n = i(50335)
      function r(e, t = '&nbsp;') {
        let i = e + ''
        ;-1 !== i.indexOf('e') &&
          (i = ((e) =>
            (0, n.fixComputationError)(e)
              .toFixed(10)
              .replace(/\.?0+$/, ''))(Number(e)))
        const r = i.split('.')
        return (
          r[0].replace(/\B(?=(\d{3})+(?!\d))/g, t) + (r[1] ? '.' + r[1] : '')
        )
      }
    },
    24424: (e, t, i) => {
      i.r(t), i.d(t, { Pattern5pointsPaneView: () => _ })
      var n = i(79849),
        r = i(73436),
        s = i(19266),
        o = i(80657),
        a = i(10695),
        l = i(99031),
        d = i(87663),
        h = i(18807),
        c = i(79797),
        u = i(79191),
        p = i(46501)
      class _ extends u.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._abRetracement = Number.NaN),
            (this._bcRetracement = Number.NaN),
            (this._cdRetracement = Number.NaN),
            (this._xdRetracement = Number.NaN),
            (this._numericFormatter = new d.NumericFormatter()),
            (this._bcRetracementTrend = new l.TrendLineRenderer()),
            (this._xdRetracementTrend = new l.TrendLineRenderer()),
            (this._xbTrend = new l.TrendLineRenderer()),
            (this._bdTrend = new l.TrendLineRenderer()),
            (this._polylineRenderer = new c.PolygonRenderer(
              new h.HitTestResult(h.HitTarget.MovePoint),
            )),
            (this._mainTriangleRenderer = new a.TriangleRenderer()),
            (this._triangleRendererPoints234 = new a.TriangleRenderer()),
            (this._xbLabelRenderer = new o.TextRenderer()),
            (this._acLabelRenderer = new o.TextRenderer()),
            (this._bdLabelRenderer = new o.TextRenderer()),
            (this._xdLabelRenderer = new o.TextRenderer()),
            (this._textRendererALabel = new o.TextRenderer()),
            (this._textRendererBLabel = new o.TextRenderer()),
            (this._textRendererCLabel = new o.TextRenderer()),
            (this._textRendererDLabel = new o.TextRenderer()),
            (this._textRendererXLabel = new o.TextRenderer()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            this._updateBaseData(),
            (this._renderer = null),
            this._points.length < 2)
          )
            return
          const e = this._source.properties().childs(),
            t = new s.CompositeRenderer(),
            i = (t, i) => ({
              points: [t],
              text: i,
              color: e.textcolor.value(),
              vertAlign: 'middle',
              horzAlign: 'center',
              font: p.CHART_FONT_FAMILY,
              offsetX: 0,
              offsetY: 0,
              bold: e.bold && e.bold.value(),
              italic: e.italic && e.italic.value(),
              fontsize: e.fontsize.value(),
              backgroundColor: e.color.value(),
              backgroundRoundRect: 4,
            }),
            o = (t, i) => ({
              points: [t, i],
              color: e.color.value(),
              linewidth: 1,
              linestyle: n.LINESTYLE_DOTTED,
              extendleft: !1,
              extendright: !1,
              leftend: r.LineEnd.Normal,
              rightend: r.LineEnd.Normal,
            }),
            [a, l, d, h, c] = this._points,
            u = {
              points: [a, l, this._points.length < 3 ? l : d],
              color: 'rgba(0, 0, 0, 0)',
              linewidth: e.linewidth.value(),
              backcolor: e.backgroundColor.value(),
              fillBackground: e.fillBackground.value(),
              transparency: e.transparency.value(),
            }
          if (
            (this._mainTriangleRenderer.setData(u),
            t.append(this._mainTriangleRenderer),
            this._points.length > 3)
          ) {
            const i = {
              points: [d, h, 5 === this._points.length ? c : h],
              color: 'rgba(0, 0, 0, 0)',
              linewidth: e.linewidth.value(),
              backcolor: e.backgroundColor.value(),
              fillBackground: e.fillBackground.value(),
              transparency: e.transparency.value(),
            }
            this._triangleRendererPoints234.setData(i),
              t.append(this._triangleRendererPoints234)
          }
          const _ = {
            points: this._points,
            color: e.color.value(),
            linewidth: e.linewidth.value(),
            backcolor: e.backgroundColor.value(),
            fillBackground: !1,
            linestyle: n.LINESTYLE_SOLID,
            filled: !1,
          }
          if (
            (this._polylineRenderer.setData(_),
            t.append(this._polylineRenderer),
            this._points.length >= 3)
          ) {
            const e = i(
              a.add(d).scaled(0.5),
              this._numericFormatter.format(this._abRetracement),
            )
            this._xbLabelRenderer.setData(e),
              t.append(this._xbLabelRenderer),
              this._xbTrend.setData(o(a, d)),
              t.append(this._xbTrend)
          }
          if (this._points.length >= 4) {
            this._bcRetracementTrend.setData(o(l, h)),
              t.append(this._bcRetracementTrend)
            const e = i(
              l.add(h).scaled(0.5),
              this._numericFormatter.format(this._bcRetracement),
            )
            this._acLabelRenderer.setData(e), t.append(this._acLabelRenderer)
          }
          if (this._points.length >= 5) {
            const e = i(
              d.add(c).scaled(0.5),
              this._numericFormatter.format(this._cdRetracement),
            )
            this._bdLabelRenderer.setData(e),
              t.append(this._bdLabelRenderer),
              this._xdRetracementTrend.setData(o(a, c)),
              t.append(this._xdRetracementTrend)
            const n = i(
              a.add(c).scaled(0.5),
              this._numericFormatter.format(this._xdRetracement),
            )
            this._xdLabelRenderer.setData(n),
              t.append(this._xdLabelRenderer),
              this._bdTrend.setData(o(d, c)),
              t.append(this._bdTrend)
          }
          const g = i(a, 'X')
          l.y > a.y
            ? ((g.vertAlign = 'bottom'), (g.offsetY = 5))
            : ((g.vertAlign = 'top'), (g.offsetY = 5)),
            this._textRendererXLabel.setData(g),
            t.append(this._textRendererXLabel)
          const f = i(l, 'A')
          if (
            (l.y < a.y
              ? ((f.vertAlign = 'bottom'), (f.offsetY = 5))
              : ((f.vertAlign = 'top'), (f.offsetY = 5)),
            this._textRendererALabel.setData(f),
            t.append(this._textRendererALabel),
            this._points.length > 2)
          ) {
            const e = i(d, 'B')
            d.y < l.y
              ? ((e.vertAlign = 'bottom'), (e.offsetY = 5))
              : ((e.vertAlign = 'top'), (e.offsetY = 5)),
              this._textRendererBLabel.setData(e),
              t.append(this._textRendererBLabel)
          }
          if (this._points.length > 3) {
            const e = i(h, 'C')
            h.y < d.y
              ? ((e.vertAlign = 'bottom'), (e.offsetY = 5))
              : ((e.vertAlign = 'top'), (e.offsetY = 5)),
              this._textRendererCLabel.setData(e),
              t.append(this._textRendererCLabel)
          }
          if (this._points.length > 4) {
            const e = i(c, 'D')
            c.y < h.y
              ? ((e.vertAlign = 'bottom'), (e.offsetY = 5))
              : ((e.vertAlign = 'top'), (e.offsetY = 5)),
              this._textRendererDLabel.setData(e),
              t.append(this._textRendererDLabel)
          }
          this.addAnchors(t), (this._renderer = t)
        }
        _updateBaseData() {
          if (this._source.points().length >= 3) {
            const [e, t, i] = this._source.points()
            this._abRetracement =
              Math.round(
                1e3 * Math.abs((i.price - t.price) / (t.price - e.price)),
              ) / 1e3
          }
          if (this._source.points().length >= 4) {
            const [, e, t, i] = this._source.points()
            this._bcRetracement =
              Math.round(
                1e3 * Math.abs((i.price - t.price) / (t.price - e.price)),
              ) / 1e3
          }
          if (this._source.points().length >= 5) {
            const [e, t, i, n, r] = this._source.points()
            ;(this._cdRetracement =
              Math.round(
                1e3 * Math.abs((r.price - n.price) / (n.price - i.price)),
              ) / 1e3),
              (this._xdRetracement =
                Math.round(
                  1e3 * Math.abs((r.price - t.price) / (t.price - e.price)),
                ) / 1e3)
          }
        }
      }
    },
    5480: (e, t, i) => {
      i.r(t), i.d(t, { ABCDPaneView: () => p })
      var n = i(79849),
        r = i(19266),
        s = i(87663),
        o = i(99031),
        a = i(80657),
        l = i(73436),
        d = i(79797),
        h = i(18807),
        c = i(79191),
        u = i(46501)
      class p extends c.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._numericFormatter = new s.NumericFormatter()),
            (this._abRetracementTrend = new o.TrendLineRenderer()),
            (this._cdRetracementTrend = new o.TrendLineRenderer()),
            (this._polylineRenderer = new d.PolygonRenderer(
              new h.HitTestResult(h.HitTarget.MovePoint),
            )),
            (this._abLabelRenderer = new a.TextRenderer()),
            (this._cdLabelRenderer = new a.TextRenderer()),
            (this._textRendererALabel = new a.TextRenderer()),
            (this._textRendererBLabel = new a.TextRenderer()),
            (this._textRendererCLabel = new a.TextRenderer()),
            (this._textRendererDLabel = new a.TextRenderer()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          if ((super._updateImpl(), this._points.length < 2))
            return void (this._renderer = null)
          const e = this._source.properties().childs(),
            t = new r.CompositeRenderer(),
            i = (t, i) => ({
              points: [t],
              text: i,
              color: e.textcolor.value(),
              vertAlign: 'middle',
              horzAlign: 'center',
              font: u.CHART_FONT_FAMILY,
              offsetX: 0,
              offsetY: 0,
              bold: e.bold && e.bold.value(),
              italic: e.italic && e.italic.value(),
              fontsize: e.fontsize.value(),
              backgroundColor: e.color.value(),
              backgroundRoundRect: 4,
            }),
            s = (t, i) => ({
              points: [t, i],
              color: e.color.value(),
              linewidth: e.linewidth.value(),
              linestyle: n.LINESTYLE_DOTTED,
              extendleft: !1,
              extendright: !1,
              leftend: l.LineEnd.Normal,
              rightend: l.LineEnd.Normal,
            }),
            [o, a, d, h] = this._points,
            c = {
              points: this._points,
              color: e.color.value(),
              linewidth: e.linewidth.value(),
              linestyle: n.LINESTYLE_SOLID,
              fillBackground: !1,
              filled: !1,
              backcolor: 'rgba(0, 0, 0, 0)',
            }
          this._polylineRenderer.setData(c), t.append(this._polylineRenderer)
          const p = i(o, 'A')
          a.y > o.y
            ? ((p.vertAlign = 'bottom'), (p.offsetY = 5))
            : ((p.vertAlign = 'top'), (p.offsetY = 5)),
            this._textRendererALabel.setData(p),
            t.append(this._textRendererALabel)
          const _ = i(a, 'B')
          if (
            (a.y < o.y
              ? ((_.vertAlign = 'bottom'), (_.offsetY = 5))
              : ((_.vertAlign = 'top'), (_.offsetY = 5)),
            this._textRendererBLabel.setData(_),
            t.append(this._textRendererBLabel),
            this._points.length > 2)
          ) {
            const e = i(d, 'C')
            d.y < a.y
              ? ((e.vertAlign = 'bottom'), (e.offsetY = 5))
              : ((e.vertAlign = 'top'), (e.offsetY = 5)),
              this._textRendererCLabel.setData(e),
              t.append(this._textRendererCLabel)
          }
          if (this._points.length > 3) {
            const e = i(h, 'D')
            h.y < d.y
              ? ((e.vertAlign = 'bottom'), (e.offsetY = 5))
              : ((e.vertAlign = 'top'), (e.offsetY = 5)),
              this._textRendererDLabel.setData(e),
              t.append(this._textRendererDLabel)
          }
          if (this._points.length >= 3) {
            this._abRetracementTrend.setData(s(o, d)),
              t.append(this._abRetracementTrend)
            const e = o.add(d).scaled(0.5),
              [n, r, a] = this._source.points(),
              l =
                Math.round(
                  1e3 * Math.abs((a.price - r.price) / (r.price - n.price)),
                ) / 1e3,
              h = i(e, this._numericFormatter.format(l))
            this._abLabelRenderer.setData(h), t.append(this._abLabelRenderer)
          }
          if (this._points.length >= 4) {
            this._cdRetracementTrend.setData(s(a, h)),
              t.append(this._cdRetracementTrend)
            const e = a.add(h).scaled(0.5),
              [, n, r, o] = this._source.points(),
              l =
                Math.round(
                  1e3 * Math.abs((o.price - r.price) / (r.price - n.price)),
                ) / 1e3,
              d = i(e, this._numericFormatter.format(l))
            this._cdLabelRenderer.setData(d), t.append(this._cdLabelRenderer)
          }
          this.addAnchors(t), (this._renderer = t)
        }
      }
    },
    33295: (e, t, i) => {
      i.d(t, { AlertableLineSourcePaneView: () => r })
      var n = i(79191)
      class r extends n.LineSourcePaneView {
        _addAlertRenderer(e, t) {}
        _getAlertRenderer(
          e,
          t = this._source.properties().linecolor.value(),
          i,
        ) {
          return null
        }
      }
    },
    37803: (e, t, i) => {
      i.r(t), i.d(t, { ArcPaneView: () => _ })
      var n = i(4652),
        r = i(86441),
        s = i(25422),
        o = i(66103),
        a = i(19266),
        l = i(79191),
        d = i(87095),
        h = i(18807),
        c = i(15187),
        u = i(45197)
      class p extends c.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        setData(e) {
          this._data = { ...e, angleFrom: 0, angleTo: Math.PI, clockwise: !1 }
        }
        hitTest(e) {
          if (null === this._data || this._data.points.length < 3) return null
          const t = (0, u.interactionTolerance)().curve,
            i = this._data.points[0],
            o = this._data.points[1]
          let a = this._data.points[2],
            l = (0, n.distanceToLine)(i, o, a).distance
          if (l < 1)
            return (
              (l = (0, n.distanceToLine)(i, o, e).distance),
              l < t ? new h.HitTestResult(h.HitTarget.MovePoint) : null
            )
          const d = o.subtract(i),
            c = d.length(),
            p = i.add(o).scaled(0.5)
          let _ = a.subtract(p).normalized()
          a = p.add(_.scaled(l))
          const g = d.x / c,
            f = d.y / c
          let v = Math.acos(g)
          f < 0 && (v = -v)
          let x = (0, s.translationMatrix)(-i.x, -i.y)
          ;(e = (0, s.transformPoint)(x, e)),
            (x = (0, s.rotationMatrix)(-v)),
            (e = (0, s.transformPoint)(x, e)),
            (_ = (0, s.transformPoint)(x, _))
          const m = 1 - Math.sqrt(3) / 2
          if (
            ((x = (0, s.scalingMatrix)(1, (c * m) / l)),
            (e = (0, s.transformPoint)(x, e)),
            (_ = (0, s.transformPoint)(x, _)),
            e.y * _.y < 0)
          )
            return null
          let w
          w =
            e.y < 0
              ? new r.Point(0.5 * c, (c * Math.sqrt(3)) / 2)
              : new r.Point(0.5 * c, (-c * Math.sqrt(3)) / 2)
          const R = e.subtract(w).length()
          return Math.abs(R - c) <= t
            ? new h.HitTestResult(h.HitTarget.MovePoint)
            : null
        }
        _drawImpl(e) {
          if (null === this._data || this._data.points.length < 2) return
          const t = e.context,
            i = this._data.points[0],
            o = this._data.points[1]
          if (this._data.points.length < 3)
            return (
              (t.strokeStyle = this._data.color),
              (t.lineWidth = this._data.linewidth),
              t.beginPath(),
              t.moveTo(i.x, i.y),
              t.lineTo(o.x, o.y),
              void t.stroke()
            )
          let a = this._data.points[2]
          const l = (0, n.distanceToLine)(i, o, a).distance
          if (l < 1)
            return (
              (t.strokeStyle = this._data.color),
              (t.lineWidth = this._data.linewidth),
              t.beginPath(),
              t.moveTo(i.x, i.y),
              t.lineTo(o.x, o.y),
              void t.stroke()
            )
          const h = o.subtract(i),
            c = i.add(o).scaled(0.5),
            u = new r.Point(-h.y, h.x).normalized()
          ;(a = c.add(u.scaled(l))),
            (t.strokeStyle = this._data.color),
            (t.lineWidth = this._data.linewidth)
          const p = h.length(),
            _ = h.x / p,
            g = h.y / p
          let f = Math.acos(_)
          g < 0 && (f = -f)
          let v = this._data.points[2],
            x = (0, s.translationMatrix)(-c.x, -c.y)
          ;(v = (0, s.transformPoint)(x, v)),
            (x = (0, s.rotationMatrix)(-f)),
            (v = (0, s.transformPoint)(x, v)),
            (x = (0, s.scalingMatrix)(1, p / (2 * l))),
            (v = (0, s.transformPoint)(x, v)),
            v.y < 0 ? (this._data.clockwise = !0) : (this._data.clockwise = !1),
            t.save(),
            t.beginPath(),
            t.translate(i.x, i.y),
            t.rotate(f)
          const m = 1 - Math.sqrt(3) / 2
          t.scale(1, l / (p * m)),
            this._data.clockwise
              ? t.arc(
                  0.5 * p,
                  (p * Math.sqrt(3)) / 2,
                  p,
                  (-2 * Math.PI) / 3,
                  -Math.PI / 3,
                  !1,
                )
              : t.arc(
                  0.5 * p,
                  (-p * Math.sqrt(3)) / 2,
                  p,
                  Math.PI / 3,
                  (2 * Math.PI) / 3,
                  !1,
                ),
            t.restore(),
            t.stroke(),
            this._data.fillBackground &&
              ((t.fillStyle = (0, d.generateColor)(
                this._data.backcolor,
                this._data.transparency,
              )),
              t.fill())
        }
      }
      class _ extends l.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._arcRenderer = new p()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            (this._renderer = null),
            0 === this._points.length)
          )
            return
          const e = this._source.properties().childs(),
            t = {
              points: this._points,
              color: e.color.value(),
              linewidth: e.linewidth.value(),
              backcolor: e.backgroundColor.value(),
              fillBackground: e.fillBackground.value(),
              transparency: e.transparency.value(),
            }
          this._arcRenderer.setData(t)
          const i = new a.CompositeRenderer()
          ;(this._renderer = i), i.append(this._arcRenderer)
          const d = [],
            h = t.points[0],
            c = new r.Point(h.x, h.y)
          if (((c.data = 0), d.push(c), 1 === t.points.length)) return
          const u = t.points[1],
            p = new r.Point(u.x, u.y)
          if (((p.data = 1), 2 === t.points.length))
            return void this.addAnchors(i)
          d.push(p)
          let _ = t.points[2]
          const g = (0, n.distanceToLine)(h, u, _).distance,
            f = u.subtract(h),
            v = h.add(u).scaled(0.5),
            x = new r.Point(-f.y, f.x).normalized()
          _ = v.add(x.scaled(g))
          const m = v.add(x.scaled(-g)),
            w = f.length(),
            R = f.x / w,
            y = f.y / w
          let b = Math.acos(R)
          y < 0 && (b = -b)
          let T = t.points[2],
            P = (0, s.translationMatrix)(-v.x, -v.y)
          ;(T = (0, s.transformPoint)(P, T)),
            (P = (0, s.rotationMatrix)(-b)),
            (T = (0, s.transformPoint)(P, T)),
            (P = (0, s.scalingMatrix)(1, w / (2 * g))),
            (T = (0, s.transformPoint)(P, T))
          const L = T.y >= 0 ? new r.Point(_.x, _.y) : new r.Point(m.x, m.y)
          ;(L.data = 2), d.push(L)
          const C = [
            o.PaneCursorType.Default,
            o.PaneCursorType.Default,
            (0, l.thirdPointCursorType)(h, u),
          ]
          i.append(this.createLineAnchor({ points: d, pointsCursorType: C }, 0))
        }
      }
    },
    93011: (e, t, i) => {
      i.r(t), i.d(t, { ArrowMarkPaneView: () => u })
      var n = i(46501),
        r = i(79191),
        s = i(19266),
        o = i(80101),
        a = i(80657),
        l = i(18807),
        d = i(34026),
        h = i(37160)
      class c {
        constructor() {
          this._data = null
        }
        setData(e) {
          this._data = e
        }
        draw(e, t) {
          if (null !== this._data) {
            switch (
              (e.save(), (e.fillStyle = this._data.color), this._data.direction)
            ) {
              case 'up':
              case 'down':
                !((e, t, i, n) => {
                  const r = Math.max(1, Math.floor(n)) % 2 ? 0.5 : 0,
                    s = 'up' === i ? 1 : -1,
                    o = s * Math.round(12 * n),
                    a = (0, h.ceiledEven)(19.5 * n) / 2 + r,
                    l = s * Math.round(10 * n),
                    d = (0, h.ceiledEven)(10 * n) / 2 + r,
                    c = Math.round(t.x * n) + r,
                    u = Math.round(t.y * n)
                  e.beginPath(),
                    e.moveTo(c, u),
                    e.lineTo(c + a, u + o),
                    e.lineTo(c + d, u + o),
                    e.lineTo(c + d, u + o + l),
                    e.lineTo(c - d, u + o + l),
                    e.lineTo(c - d, u + o),
                    e.lineTo(c - a, u + o),
                    e.moveTo(c, u),
                    e.fill()
                })(e, this._data.point, this._data.direction, t.pixelRatio)
                break
              case 'left':
              case 'right':
                !((e, t, i, n) => {
                  const r = Math.max(1, Math.floor(n)) % 2 ? 0.5 : 0,
                    s = 'left' === i ? 1 : -1,
                    o = s * Math.round(12 * n) + r,
                    a = (0, h.ceiledEven)(19.5 * n) / 2 + r,
                    l = s * Math.round(22 * n) + r,
                    d = (0, h.ceiledEven)(10 * n) / 2 + r,
                    c = Math.round(t.x * n) + r,
                    u = Math.round(t.y * n) + r
                  e.beginPath(),
                    e.moveTo(c, u),
                    e.lineTo(c + o, u + a),
                    e.lineTo(c + o, u + d),
                    e.lineTo(c + l, u + d),
                    e.lineTo(c + l, u - d),
                    e.lineTo(c + o, u - d),
                    e.lineTo(c + o, u - a),
                    e.moveTo(c, u),
                    e.fill()
                })(e, this._data.point, this._data.direction, t.pixelRatio)
            }
            e.restore()
          }
        }
        hitTest(e) {
          if (null === this._data) return null
          let t, i, n, r
          switch (this._data.direction) {
            case 'up':
              ;(t = this._data.point.x - 9.75),
                (n = t + 19.5),
                (i = this._data.point.y),
                (r = i + 12 + 10)
              break
            case 'down':
              ;(t = this._data.point.x - 9.75),
                (n = t + 19.5),
                (r = this._data.point.y),
                (i = r - 12 - 10)
              break
            case 'left':
              ;(t = this._data.point.x),
                (n = t + 12 + 10),
                (i = this._data.point.y - 9.75),
                (r = i + 19.5)
              break
            case 'right':
              ;(n = this._data.point.x),
                (t = n - 12 - 10),
                (i = this._data.point.y - 9.75),
                (r = i + 19.5)
          }
          return e.x < t || e.x > n || e.y < i || e.y > r
            ? null
            : new l.HitTestResult(l.HitTarget.MovePoint)
        }
        doesIntersectWithBox(e) {
          return null !== this._data && (0, d.pointInBox)(this._data.point, e)
        }
      }
      class u extends r.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._arrowMarkRenderer = new c()),
            (this._textRenderer = new a.TextRenderer()),
            (this._renderer = null),
            (this._anchorsOffset = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            (this._renderer = null),
            1 !== this._points.length)
          )
            return
          const e = this._getSource(),
            t = e.properties().childs(),
            i = this._getModel()
          this._arrowMarkRenderer.setData({
            point: this._points[0],
            direction: e.direction(),
            color: t.arrowColor.value(),
          }),
            (this._renderer = new s.CompositeRenderer()),
            this._renderer.append(this._arrowMarkRenderer),
            '' !== t.text.value() &&
              t.showLabel.value() &&
              (this._textRenderer.setData({
                points: this._points,
                font: n.CHART_FONT_FAMILY,
                bold: t.bold.value(),
                italic: t.italic.value(),
                fontSize: t.fontsize.value(),
                text: t.text.value(),
                color: t.color.value(),
                ...e.textAlignParams(),
              }),
              this._renderer.append(this._textRenderer))
          const r = [
            this._anchorsOffset
              ? this._points[0].add(this._anchorsOffset)
              : this._points[0].clone(),
          ]
          this._renderer.append(
            new o.SelectionRenderer({
              points: r,
              bgColors: this._lineAnchorColors(r),
              visible: this.areAnchorsVisible(),
              barSpacing: i.timeScale().barSpacing(),
              hittestResult: l.HitTarget.MovePoint,
            }),
          )
        }
      }
    },
    97747: (e, t, i) => {
      i.r(t), i.d(t, { ArrowMarkerPaneView: () => _ })
      var n = i(79191),
        r = i(19266),
        s = i(80657),
        o = i(86441),
        a = i(15187),
        l = i(18807),
        d = i(45197)
      function h(e) {
        if (e < 92) return 18
        let t = 0.25 * e
        return (
          (t = Math.min(t, 106)),
          (t = Math.max(t, 18)),
          (t = Math.min(t, 0.9 * e)),
          t
        )
      }
      class c extends a.MediaCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = e)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (this._data.points.length < 2) return null
          let t = this._data.points[0],
            i = this._data.points[1].subtract(t)
          const n = i.length()
          i = this._data.points[1].subtract(this._data.points[0])
          i.length() < 22 &&
            ((t = this._data.points[1].addScaled(i.normalized(), -22)),
            (i = this._data.points[1].subtract(t)))
          const r = e.subtract(t),
            s = i.dotProduct(r) / n
          if (s < 0 || s > n) return null
          const o = i.scaled(1 / n),
            a = t.addScaled(o, s),
            h = e.subtract(a),
            c = (0, d.interactionTolerance)().line,
            u = this._hittestGeometry(n)
          for (let e = u.length - 2; e >= 0; e--) {
            const t = u[e]
            if (s >= t.x) {
              const i = u[e + 1],
                n = i.x - t.x,
                r = i.y - t.y,
                o = (s - t.x) / n,
                a = t.y + r * o
              return h.length() <= a + c
                ? new l.HitTestResult(l.HitTarget.MovePoint)
                : null
            }
          }
          return h.length() < 3
            ? new l.HitTestResult(l.HitTarget.MovePoint)
            : null
        }
        _drawImpl(e) {
          if (this._data.points.length < 2) return
          const t = e.context
          ;(t.fillStyle = this._data.color),
            (t.strokeStyle = this._data.color),
            (t.lineJoin = 'round'),
            (t.lineCap = 'round')
          let i = this._data.points[1].subtract(this._data.points[0])
          const n = i.length()
          let r = this._data.points[0]
          n < 22 &&
            ((r = this._data.points[1].addScaled(i.normalized(), -22)),
            (i = this._data.points[1].subtract(r)))
          const s = new o.Point(i.y, -i.x).normalized(),
            a = this._arrowGeometry(i.length()),
            l = i.normalized()
          ;(t.lineWidth = ((e) => {
            let t = Math.round(0.02 * e)
            return (t = Math.min(t, 5)), (t = Math.max(t, 2)), t
          })(i.length())),
            t.beginPath(),
            t.moveTo(r.x, r.y)
          for (let e = 0; e < a.length; e++) {
            const i = a[e],
              n = r.addScaled(l, i.x).addScaled(s, i.y)
            t.lineTo(n.x, n.y)
          }
          t.lineTo(this._data.points[1].x, this._data.points[1].y)
          for (let e = a.length - 1; e >= 0; e--) {
            const i = a[e],
              n = r.addScaled(l, i.x).addScaled(s, -i.y)
            t.lineTo(n.x, n.y)
          }
          t.lineTo(r.x, r.y), t.stroke(), t.fill()
        }
        _arrowGeometry(e) {
          const t = h(e),
            i = [],
            n = e >= 35 ? 0.1 : 0
          return (
            i.push(new o.Point(0, 0)),
            i.push(new o.Point(e - t + t * n, (1.22 * t) / 4)),
            i.push(new o.Point(e - t, (1.22 * t) / 2)),
            i.push(new o.Point(e, 0)),
            i
          )
        }
        _hittestGeometry(e) {
          const t = h(e),
            i = []
          return (
            i.push(new o.Point(0, 0)),
            i.push(new o.Point(e - t, (1.22 * t) / 4)),
            i.push(new o.Point(e - t, (1.22 * t) / 2)),
            i.push(new o.Point(e, 0)),
            i
          )
        }
      }
      var u = i(70531),
        p = i(46501)
      class _ extends n.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._textRendererData = {
              text: '',
              color: '',
              vertAlign: 'middle',
              horzAlign: 'center',
              font: '',
              offsetX: 10,
              offsetY: 10,
              points: [],
              forceTextAlign: !0,
            }),
            (this._arrowRendererData = { points: [], color: '' }),
            (this._ellipseRendererData = {
              color: '',
              linewidth: 0,
              points: [],
              fillBackground: !0,
              backcolor: '',
              noHitTestOnBackground: !0,
            }),
            (this._drawAsCircle = !1),
            (this._textRenderer = new s.TextRenderer(this._textRendererData)),
            (this._arrowRenderer = new c(this._arrowRendererData)),
            (this._ellipseRenderer = new u.EllipseRendererSimple(
              this._ellipseRendererData,
            ))
        }
        renderer(e, t) {
          this._invalidated && this._updateImpl()
          const i = new r.CompositeRenderer()
          this._drawAsCircle
            ? i.append(this._ellipseRenderer)
            : i.append(this._arrowRenderer)
          const n = this._getSource().properties().childs()
          return (
            this._textRendererData.points &&
              this._textRendererData.points.length > 0 &&
              n.showLabel.value() &&
              (this._textRenderer.setData({ ...this._textRendererData }),
              i.append(this._textRenderer)),
            this.addAnchors(i),
            i
          )
        }
        _updateImpl() {
          super._updateImpl()
          const e = this._getPoints(),
            t = this._getSource().properties().childs()
          if (
            ((this._arrowRendererData.color = t.backgroundColor.value()),
            (this._arrowRendererData.points = e),
            (this._textRendererData.text = t.text.value()),
            (this._textRendererData.color = t.textColor.value()),
            (this._textRendererData.font = p.CHART_FONT_FAMILY),
            (this._textRendererData.bold = t.bold.value()),
            (this._textRendererData.italic = t.italic.value()),
            (this._textRendererData.fontsize = t.fontsize.value()),
            e.length >= 2)
          ) {
            const i = this._getSource().points(),
              n = i[0].index - i[1].index,
              r = i[0].price - i[1].price
            if (
              ((this._drawAsCircle = 0 === n && Math.abs(r) < 1e-8),
              (this._textRendererData.points = [e[0]]),
              this._drawAsCircle)
            ) {
              ;(this._textRendererData.horzAlign = 'left'),
                (this._textRendererData.vertAlign = 'middle')
              const i = new o.Point(e[0].x - 9, e[0].y - 9),
                n = new o.Point(e[0].x + 9, e[0].y + 9)
              ;(this._ellipseRendererData.points = [i, n]),
                (this._ellipseRendererData.backcolor =
                  t.backgroundColor.value()),
                (this._ellipseRendererData.color = t.backgroundColor.value())
            } else {
              const t = e[1].subtract(e[0])
              Math.abs(t.x) >= Math.abs(t.y)
                ? (e[1].x > e[0].x
                    ? (this._textRendererData.horzAlign = 'right')
                    : (this._textRendererData.horzAlign = 'left'),
                  (this._textRendererData.vertAlign = 'middle'))
                : (e[1].y > e[0].y
                    ? (this._textRendererData.vertAlign = 'bottom')
                    : (this._textRendererData.vertAlign = 'top'),
                  (this._textRendererData.horzAlign = 'center'))
            }
          }
        }
      }
    },
    74718: (e, t, i) => {
      i.r(t), i.d(t, { BalloonPaneView: () => f })
      var n = i(29764),
        r = i(87095),
        s = i(46501),
        o = i(79191),
        a = i(86441),
        l = i(34026),
        d = i(38223),
        h = i(74359),
        c = i(15187),
        u = i(18807)
      class p extends c.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments),
            (this._geometryCache = {
              innerHeight: Number.NaN,
              textHorizontalPadding: Number.NaN,
              innerWidth: Number.NaN,
              paddingLeft: Number.NaN,
            }),
            (this._geomertryCacheInvalidated = !0),
            (this._data = null)
        }
        setData(e) {
          ;(this._data = e), (this._geomertryCacheInvalidated = !0)
        }
        hitTest(e, t) {
          if (null === this._data || 0 === this._data.points.length) return null
          const i =
              this._data.points[0].x - (this._geometryCache.paddingLeft + 20),
            n = this._data.points[0].y - (this._geometryCache.innerHeight + 9),
            r = (0, a.box)(
              new a.Point(i, n),
              new a.Point(
                i + this._geometryCache.innerWidth,
                n + this._geometryCache.innerHeight,
              ),
            )
          return (0, l.pointInBox)(e, r)
            ? new u.HitTestResult(u.HitTarget.MovePoint, {
                areaName: u.AreaName.Text,
              })
            : null
        }
        _drawImpl(e) {
          if (null === this._data || 0 === this._data.points.length) return
          const t = e.context
          t.font = this._data.font
          const i = this._measureInfo(t, this._data.label, this._data.fontSize),
            {
              paddingLeft: n,
              innerHeight: r,
              innerWidth: s,
              textHorizontalPadding: o,
            } = i
          t.textAlign = (0, d.isRtl)() ? 'right' : 'left'
          const a = this._data.points[0].x - (n + 20),
            l = this._data.points[0].y - (r + 9)
          t.translate(a, l),
            t.beginPath(),
            t.moveTo(24, r),
            t.lineTo(15, r),
            t.arcTo(-1e3, 0, 1e3, 0, r / 2),
            t.lineTo(s - 15, 0),
            t.arcTo(1e3, r, -1e3, r, r / 2),
            t.lineTo(33, r),
            t.quadraticCurveTo(33, r + 4, 35, r + 9),
            t.quadraticCurveTo(27, r + 6, 24, r),
            (t.fillStyle = this._data.backgroundColor),
            t.fill(),
            (t.strokeStyle = this._data.borderColor),
            (t.lineWidth = 2),
            t.stroke(),
            t.closePath(),
            (t.textBaseline = 'middle'),
            (t.fillStyle = this._data.color),
            t.fillText(this._data.label, n + o, r / 2)
        }
        _measureInfo(e, t, i) {
          if (this._geomertryCacheInvalidated) {
            const n = e.measureText(t),
              r = i,
              s = 15,
              o = Math.round(r / 1.3),
              a = n.width + 2 * s,
              l = r + 2 * o,
              d = (0, h.calcTextHorizontalShift)(e, n.width)
            ;(this._geometryCache = {
              paddingLeft: s,
              innerWidth: a,
              innerHeight: l,
              textHorizontalPadding: d,
            }),
              (this._geomertryCacheInvalidated = !1)
          }
          return this._geometryCache
        }
      }
      var _ = i(19266),
        g = i(80101)
      class f extends o.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._balloonRenderer = new p()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl(e, t) {
          super._updateImpl(e, t)
          const i = this._source.properties().childs(),
            o = {
              points: this._points,
              color: i.color.value(),
              borderColor: i.borderColor.value(),
              backgroundColor: (0, r.generateColor)(
                i.backgroundColor.value(),
                i.transparency.value(),
              ),
              font: (0, n.makeFont)(i.fontsize.value(), s.CHART_FONT_FAMILY),
              fontSize: i.fontsize.value(),
              label: i.text.value(),
            }
          if ((this._balloonRenderer.setData(o), 1 === o.points.length)) {
            const e = new _.CompositeRenderer()
            return (
              e.append(this._balloonRenderer),
              e.append(
                new g.SelectionRenderer({
                  points: o.points,
                  bgColors: this._lineAnchorColors(o.points),
                  visible: this.areAnchorsVisible(),
                  barSpacing: this._model.timeScale().barSpacing(),
                  hittestResult: u.HitTarget.MovePoint,
                }),
              ),
              void (this._renderer = e)
            )
          }
          this._renderer = this._balloonRenderer
        }
      }
    },
    45371: (e, t, i) => {
      i.r(t), i.d(t, { BarsPatternPaneView: () => x })
      var n = i(86441),
        r = i(33013),
        s = i(79849),
        o = i(87095),
        a = i(18807),
        l = i(19266),
        d = i(73436),
        h = i(1149),
        c = i(72739),
        u = i(99031),
        p = i(71254),
        _ = i(79191),
        g = i(99987)
      const f = r.colorsPalette['color-cold-gray-500'],
        v = {
          [g.LineToolBarsPatternMode.Bars]: (e) => [e[2], e[3]],
          [g.LineToolBarsPatternMode.Line]: (e) => e[4],
          [g.LineToolBarsPatternMode.OpenClose]: (e) => [e[1], e[4]],
          [g.LineToolBarsPatternMode.LineOpen]: (e) => e[1],
          [g.LineToolBarsPatternMode.LineHigh]: (e) => e[2],
          [g.LineToolBarsPatternMode.LineLow]: (e) => e[3],
          [g.LineToolBarsPatternMode.LineHL2]: (e) => (e[2] + e[3]) / 2,
        }
      class x extends _.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._vertLineRenderer1 = new p.VerticalLineRenderer()),
            (this._vertLineRenderer2 = new p.VerticalLineRenderer()),
            (this._medianRenderer = new u.TrendLineRenderer()),
            (this._renderer = null)
        }
        renderer() {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          var e, t
          if (
            (super._updateImpl(),
            (this._renderer = null),
            this._points.length < 2)
          )
            return
          const i = this._source.priceScale(),
            r =
              null !==
                (t =
                  null === (e = this._source.ownerSource()) || void 0 === e
                    ? void 0
                    : e.firstValue()) && void 0 !== t
                ? t
                : null
          if (!i || i.isEmpty() || null === r) return
          const u = this._source.points(),
            p = this._source.pattern(),
            _ = p.length,
            x = new l.CompositeRenderer()
          if (_ > 0 && 2 === u.length) {
            const e = this._source.properties().childs(),
              t = e.mode.value(),
              l = e.color.value(),
              d = Math.abs((this._points[0].x - this._points[1].x) / (_ - 1)),
              f = this._source.getScale(),
              m = (e) => i.priceToCoordinate(e, r) * f,
              [{ index: w }, { index: R }] = u,
              y = w < R ? this._points[0] : this._points[1],
              [b, T] = this._source.points(),
              P = w < R ? b.index : T.index,
              L = y.x,
              C = y.y - m(this._source.firstPatternPrice())
            if (
              t === g.LineToolBarsPatternMode.Bars ||
              t === g.LineToolBarsPatternMode.OpenClose
            ) {
              const e = v[t]
              for (let t = 0; t < _; t++) {
                const i = Math.round(L + t * d + 0.5),
                  r = e(p[t]).map(
                    (e, t) =>
                      new n.Point(i + (2 * t - 1), Math.round(m(e)) + C),
                  ),
                  s = new c.RectangleRenderer()
                s.setData({
                  points: r,
                  color: l,
                  backcolor: l,
                  linewidth: 1,
                  fillBackground: !0,
                  transparency: 10,
                  extendLeft: !1,
                  extendRight: !1,
                }),
                  x.append(s)
              }
              x.append(this.createLineAnchor({ points: this._points }, 0))
            } else {
              const e = v[t],
                i = p.map((t, i) => {
                  const n = Math.round(L + i * d + 0.5)
                  return {
                    timePointIndex: P + i,
                    center: n,
                    left: Number.NaN,
                    right: Number.NaN,
                    y: m(e(t)) + C,
                  }
                })
              x.append(
                new h.PaneRendererLine({
                  barSpacing: d,
                  items: i,
                  lineColor: (0, o.generateColor)(l, 10),
                  lineStyle: s.LINESTYLE_SOLID,
                  lineWidth: 2,
                  hittest: new a.HitTestResult(a.HitTarget.MovePoint),
                  simpleMode: !0,
                  withMarkers: !1,
                  skipHoles: !0,
                }),
              ),
                x.append(this.createLineAnchor({ points: this._points }, 1))
            }
          } else
            this._vertLineRenderer1.setData({
              x: this._points[0].x,
              color: f,
              linewidth: 1,
              linestyle: s.LINESTYLE_SOLID,
            }),
              x.append(this._vertLineRenderer1),
              this._vertLineRenderer2.setData({
                x: this._points[1].x,
                color: f,
                linewidth: 1,
                linestyle: s.LINESTYLE_SOLID,
              }),
              x.append(this._vertLineRenderer2),
              this._medianRenderer.setData({
                points: this._points,
                color: f,
                linewidth: 1,
                linestyle: s.LINESTYLE_SOLID,
                extendleft: !1,
                extendright: !1,
                leftend: d.LineEnd.Normal,
                rightend: d.LineEnd.Normal,
              }),
              x.append(this._medianRenderer)
          this._renderer = x
        }
      }
    },
    56853: (e, t, i) => {
      i.r(t), i.d(t, { BezierCubicPaneView: () => v })
      var n = i(87095),
        r = i(79191),
        s = i(15187),
        o = i(18807),
        a = i(2436),
        l = i(99031),
        d = i(73436),
        h = i(54364),
        c = i(45197),
        u = i(68441)
      class p extends s.MediaCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = e || null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e, t) {
          const i = this._data
          if (null === i) return null
          if (4 === i.points.length) {
            const t = (0, c.interactionTolerance)().curve,
              [n, r, s, l] = i.points,
              d = l.subtract(n),
              u = s.subtract(d.scaled(0.25)),
              p = s.add(d.scaled(0.25)),
              _ = r.subtract(s),
              g = l.subtract(_.scaled(0.25)),
              f = l.add(_.scaled(0.25))
            if (
              (0, a.quadroBezierHitTest)(s, n, u, e, t) ||
              (0, a.cubicBezierHitTest)(s, p, g, l, e, t) ||
              (0, a.quadroBezierHitTest)(l, r, f, e, t)
            )
              return new o.HitTestResult(o.HitTarget.MovePoint)
            let v = (0, h.hitTestExtendedPoints)(e, t, i.extendLeftPoints)
            return (
              null === v &&
                (v = (0, h.hitTestExtendedPoints)(e, t, i.extendRightPoints)),
              v
            )
          }
          return null
        }
        _drawImpl(e) {
          if (null === this._data) return
          const t = e.context
          ;(t.lineCap = 'round'),
            (t.strokeStyle = this._data.color),
            (t.lineWidth = this._data.lineWidth),
            (0, u.setLineStyle)(t, this._data.lineStyle)
          const i = this._data.points[0],
            n = this._data.points[1]
          if (2 === this._data.points.length)
            t.beginPath(),
              t.moveTo(i.x, i.y),
              t.lineTo(n.x, n.y),
              t.stroke(),
              this._data.leftEnd === d.LineEnd.Arrow &&
                (0, l.drawArrow)(n, i, t, t.lineWidth, 1),
              this._data.rightEnd === d.LineEnd.Arrow &&
                (0, l.drawArrow)(i, n, t, t.lineWidth, 1)
          else {
            const e = this._data.points[2],
              r = this._data.points[3],
              s = r.subtract(i),
              o = e.subtract(s.scaled(0.25)),
              a = e.add(s.scaled(0.25)),
              c = n.subtract(e),
              u = r.subtract(c.scaled(0.25)),
              p = r.add(c.scaled(0.25))
            this._data.fillBack &&
              this._data.points.length > 2 &&
              ((t.fillStyle = this._data.backColor),
              t.beginPath(),
              t.moveTo(i.x, i.y),
              t.quadraticCurveTo(o.x, o.y, e.x, e.y),
              t.bezierCurveTo(a.x, a.y, u.x, u.y, r.x, r.y),
              t.quadraticCurveTo(p.x, p.y, n.x, n.y),
              t.fill()),
              t.beginPath(),
              (0, h.buildExtendedSegments)(t, this._data.extendLeftPoints),
              t.moveTo(i.x, i.y),
              t.quadraticCurveTo(o.x, o.y, e.x, e.y),
              t.bezierCurveTo(a.x, a.y, u.x, u.y, r.x, r.y),
              t.quadraticCurveTo(p.x, p.y, n.x, n.y),
              (0, h.buildExtendedSegments)(t, this._data.extendRightPoints),
              this._data.leftEnd === d.LineEnd.Arrow &&
                (0, l.drawArrow)(o, i, t, t.lineWidth, 1),
              this._data.rightEnd === d.LineEnd.Arrow &&
                (0, l.drawArrow)(p, n, t, t.lineWidth, 1),
              t.stroke()
          }
        }
      }
      var _ = i(19266),
        g = i(33730),
        f = i(50151)
      class v extends r.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._bezierCubicRenderer = new p()),
            (this._renderer = null),
            (this._extendedSegmentLeftCache = null),
            (this._extendedSegmentRightCache = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          if (
            (super._updateImpl(e, t),
            (this._renderer = null),
            this._points.length < 2)
          )
            return
          const i = this._source.properties().childs()
          let r = [],
            s = []
          if (4 === this._source.points().length) {
            const n = (0, f.ensureNotNull)(
                this._source.pointToScreenPoint(this._source.points()[0]),
              ),
              o = (0, f.ensureNotNull)(
                this._source.pointToScreenPoint(this._source.points()[1]),
              ),
              a = (0, f.ensureNotNull)(
                this._source.pointToScreenPoint(this._source.points()[2]),
              ),
              l = (0, f.ensureNotNull)(
                this._source.pointToScreenPoint(this._source.points()[3]),
              ),
              d = l.subtract(n),
              h = a.subtract(d.scaled(0.25)),
              c = o.subtract(a),
              u = l.add(c.scaled(0.25))
            i.extendLeft.value() &&
              (r = this._extendSegmentLeft(a, n, h, t, e)),
              i.extendRight.value() &&
                (s = this._extendSegmentRight(l, o, u, t, e))
          }
          const o = this._points.slice(),
            a = this._source.controlPoints()
          null !== a &&
            (o.push(
              (0, f.ensureNotNull)(this._source.pointToScreenPoint(a[0])),
            ),
            o.push((0, f.ensureNotNull)(this._source.pointToScreenPoint(a[1]))))
          const l = {
            points: o,
            color: i.linecolor.value(),
            lineWidth: i.linewidth.value(),
            lineStyle: i.linestyle.value(),
            leftEnd: i.leftEnd.value(),
            rightEnd: i.rightEnd.value(),
            fillBack: i.fillBackground.value(),
            backColor: (0, n.generateColor)(
              i.backgroundColor.value(),
              i.transparency.value(),
            ),
            extendLeftPoints: r,
            extendRightPoints: s,
          }
          this._bezierCubicRenderer.setData(l)
          const d = new _.CompositeRenderer()
          d.append(this._bezierCubicRenderer),
            this.addAnchors(d),
            (this._renderer = d)
        }
        _extendSegmentLeft(e, t, i, n, r) {
          return (
            (0, g.cacheIsValid)(
              this._extendedSegmentLeftCache,
              e,
              t,
              i,
              n,
              r,
            ) ||
              (this._extendedSegmentLeftCache = {
                p1: e,
                p2: t,
                p3: i,
                width: n,
                height: r,
                segment: (0, a.extendQuadroBezier)(e, t, i, n, r),
              }),
            (0, f.ensureNotNull)(this._extendedSegmentLeftCache).segment
          )
        }
        _extendSegmentRight(e, t, i, n, r) {
          return (
            (0, g.cacheIsValid)(
              this._extendedSegmentRightCache,
              e,
              t,
              i,
              n,
              r,
            ) ||
              (this._extendedSegmentRightCache = {
                p1: e,
                p2: t,
                p3: i,
                width: n,
                height: r,
                segment: (0, a.extendQuadroBezier)(e, t, i, n, r),
              }),
            (0, f.ensureNotNull)(this._extendedSegmentRightCache).segment
          )
        }
      }
    },
    33730: (e, t, i) => {
      i.r(t), i.d(t, { BezierQuadroPaneView: () => h, cacheIsValid: () => d })
      var n = i(50151),
        r = i(87095),
        s = i(79191),
        o = i(19266),
        a = i(2436),
        l = i(54364)
      function d(e, t, i, n, r, s) {
        return (
          null !== e &&
          e.p1.x === t.x &&
          e.p1.y === t.y &&
          e.p2.x === i.x &&
          e.p2.y === i.y &&
          e.p3.x === n.x &&
          e.p3.y === n.y &&
          e.width === r &&
          e.height === s
        )
      }
      class h extends s.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._bezierQuadroRenderer = new l.BezierQuadroRenderer()),
            (this._renderer = null),
            (this._extendedSegmentLeftCache = null),
            (this._extendedSegmentRightCache = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          if (
            (super._updateImpl(e, t),
            (this._renderer = null),
            this._points.length < 2)
          )
            return
          const i = this._source.properties().childs()
          let s = [],
            a = []
          if (3 === this._source.points().length) {
            const r = (0, n.ensureNotNull)(
                this._source.pointToScreenPoint(this._source.points()[0]),
              ),
              o = (0, n.ensureNotNull)(
                this._source.pointToScreenPoint(this._source.points()[1]),
              ),
              l = (0, n.ensureNotNull)(
                this._source.pointToScreenPoint(this._source.points()[2]),
              ),
              d = o.subtract(r),
              h = l.subtract(d.scaled(0.25)),
              c = l.add(d.scaled(0.25))
            i.extendLeft.value() &&
              (s = this._extendSegmentLeft(l, r, h, t, e)),
              i.extendRight.value() &&
                (a = this._extendSegmentRight(l, o, c, t, e))
          }
          const l = this._points.slice(),
            d = this._source.controlPoint()
          null !== d &&
            l.push((0, n.ensureNotNull)(this._source.pointToScreenPoint(d)))
          const h = {
            points: l,
            color: i.linecolor.value(),
            lineWidth: i.linewidth.value(),
            lineStyle: i.linestyle.value(),
            leftEnd: i.leftEnd.value(),
            rightEnd: i.rightEnd.value(),
            fillBack: i.fillBackground.value(),
            backColor: (0, r.generateColor)(
              i.backgroundColor.value(),
              i.transparency.value(),
            ),
            extendLeftSegments: s,
            extendRightSegments: a,
          }
          this._bezierQuadroRenderer.setData(h)
          const c = new o.CompositeRenderer()
          c.append(this._bezierQuadroRenderer),
            this.addAnchors(c),
            (this._renderer = c)
        }
        _extendSegmentLeft(e, t, i, r, s) {
          return (
            d(this._extendedSegmentLeftCache, e, t, i, r, s) ||
              (this._extendedSegmentLeftCache = {
                p1: e,
                p2: t,
                p3: i,
                width: r,
                height: s,
                segment: (0, a.extendQuadroBezier)(e, t, i, r, s),
              }),
            (0, n.ensureNotNull)(this._extendedSegmentLeftCache).segment
          )
        }
        _extendSegmentRight(e, t, i, r, s) {
          return (
            d(this._extendedSegmentRightCache, e, t, i, r, s) ||
              (this._extendedSegmentRightCache = {
                p1: e,
                p2: t,
                p3: i,
                width: r,
                height: s,
                segment: (0, a.extendQuadroBezier)(e, t, i, r, s),
              }),
            (0, n.ensureNotNull)(this._extendedSegmentRightCache).segment
          )
        }
      }
    },
    54364: (e, t, i) => {
      i.d(t, {
        BezierQuadroRenderer: () => p,
        buildExtendedSegments: () => u,
        hitTestExtendedPoints: () => c,
      })
      var n = i(4652),
        r = i(15187),
        s = i(73436),
        o = i(18807),
        a = i(2436),
        l = i(99031),
        d = i(45197),
        h = i(68441)
      function c(e, t, i) {
        for (const r of i)
          for (let i = 1; i < r.length; i++) {
            const s = r[i - 1],
              a = r[i]
            if ((0, n.distanceToSegment)(s, a, e).distance < t)
              return new o.HitTestResult(o.HitTarget.MovePoint)
          }
        return null
      }
      function u(e, t) {
        for (let i = 0; i < t.length; i++) {
          const n = t[i],
            r = n[0]
          e.moveTo(r.x, r.y)
          for (let t = 1; t < n.length; t++) {
            const i = n[t]
            e.lineTo(i.x, i.y)
          }
        }
      }
      class p extends r.MediaCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = e || null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e, t) {
          if (null !== this._data && 3 === this._data.points.length) {
            const t = (0, d.interactionTolerance)().curve,
              [i, n, r] = this._data.points,
              s = n.subtract(i),
              l = r.subtract(s.scaled(0.25)),
              h = r.add(s.scaled(0.25))
            if (
              (0, a.quadroBezierHitTest)(r, i, l, e, t) ||
              (0, a.quadroBezierHitTest)(r, n, h, e, t)
            )
              return new o.HitTestResult(o.HitTarget.MovePoint)
            let u = c(e, t, this._data.extendLeftSegments)
            return (
              null === u && (u = c(e, t, this._data.extendRightSegments)), u
            )
          }
          return null
        }
        _drawImpl(e) {
          if (null === this._data) return
          const [t, i, n] = this._data.points,
            r = e.context
          if (
            ((r.lineCap = 'round'),
            (r.strokeStyle = this._data.color),
            (r.lineWidth = this._data.lineWidth),
            (0, h.setLineStyle)(r, this._data.lineStyle),
            2 === this._data.points.length)
          )
            r.beginPath(), r.moveTo(t.x, t.y), r.lineTo(i.x, i.y), r.stroke()
          else {
            const e = i.subtract(t),
              o = n.subtract(e.scaled(0.25)),
              a = n.add(e.scaled(0.25))
            this._data.fillBack &&
              this._data.points.length > 2 &&
              ((r.fillStyle = this._data.backColor),
              r.beginPath(),
              r.moveTo(t.x, t.y),
              r.quadraticCurveTo(o.x, o.y, n.x, n.y),
              r.quadraticCurveTo(a.x, a.y, i.x, i.y),
              r.fill()),
              r.beginPath(),
              u(r, this._data.extendLeftSegments),
              r.moveTo(t.x, t.y),
              r.quadraticCurveTo(o.x, o.y, n.x, n.y),
              r.quadraticCurveTo(a.x, a.y, i.x, i.y),
              u(r, this._data.extendRightSegments),
              this._data.leftEnd === s.LineEnd.Arrow &&
                (0, l.drawArrow)(o, t, r, r.lineWidth, 1),
              this._data.rightEnd === s.LineEnd.Arrow &&
                (0, l.drawArrow)(a, i, r, r.lineWidth, 1),
              r.stroke()
          }
        }
      }
    },
    26049: (e, t, i) => {
      i.d(t, { BrushBasePaneView: () => d })
      var n = i(86441),
        r = i(79797),
        s = i(80101),
        o = i(19266),
        a = i(18807),
        l = i(79191)
      class d extends l.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._polygonRenderer = new r.PolygonRenderer()),
            (this._renderer = new o.CompositeRenderer())
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          super._updateImpl()
          const e = Math.max(1, this._source.smooth()),
            t = this._points
          if (0 === t.length) return void this._renderer.clear()
          const i = [t[0]]
          for (let n = 1; n < t.length; n++) {
            const r = t[n].subtract(t[n - 1]),
              s = r.length(),
              o = Math.min(5, Math.floor(s / e)),
              a = r.normalized().scaled(s / o)
            for (let e = 0; e < o - 1; e++) i.push(t[n - 1].add(a.scaled(e)))
            i.push(t[n])
          }
          this._points = this._smoothArray(i, e)
          const n = this._createPolygonRendererData()
          if (
            (this._polygonRenderer.setData(n),
            (this._renderer = new o.CompositeRenderer()),
            this._renderer.append(this._polygonRenderer),
            this._source.finished())
          ) {
            const e = n.points.length
            if (e > 0) {
              const t =
                  1 !== e ? [n.points[0], n.points[e - 1]] : [n.points[0]],
                i = new s.SelectionRenderer({
                  points: t,
                  bgColors: this._lineAnchorColors(t),
                  visible: this.areAnchorsVisible(),
                  hittestResult: a.HitTarget.Regular,
                  barSpacing: this._getModel().timeScale().barSpacing(),
                })
              this._renderer.append(i)
            }
          }
        }
        _smoothArray(e, t) {
          if (1 === e.length) return e
          const i = new Array(e.length)
          for (let r = 0; r < e.length; r++) {
            let s = new n.Point(0, 0)
            for (let i = 0; i < t; i++) {
              const t = Math.max(r - i, 0),
                n = Math.min(r + i, e.length - 1)
              ;(s = s.add(e[t])), (s = s.add(e[n]))
            }
            i[r] = s.scaled(0.5 / t)
          }
          return i.push(e[e.length - 1]), i
        }
      }
    },
    48188: (e, t, i) => {
      i.r(t), i.d(t, { BrushPaneView: () => s })
      var n = i(79849),
        r = i(26049)
      class s extends r.BrushBasePaneView {
        _createPolygonRendererData() {
          const e = this._source.properties().childs(),
            t = {
              points: this._points,
              color: e.linecolor.value(),
              linewidth: e.linewidth.value(),
              linestyle: n.LINESTYLE_SOLID,
              skipClosePath: !0,
              leftend: e.leftEnd.value(),
              rightend: e.rightEnd.value(),
              filled: !1,
              fillBackground: !1,
              backcolor: e.backgroundColor.value(),
            }
          return (
            e.fillBackground.value() &&
              this._model.lineBeingCreated() !== this._source &&
              ((t.filled = !0),
              (t.fillBackground = !0),
              (t.transparency = e.transparency.value())),
            t
          )
        }
      }
    },
    70326: (e, t, i) => {
      i.r(t), i.d(t, { CalloutPaneView: () => v })
      var n = i(86441),
        r = i(50151),
        s = i(29764),
        o = i(19266),
        a = i(46501),
        l = i(38223),
        d = i(87095),
        h = i(74359),
        c = i(15187),
        u = i(18807)
      class p extends c.MediaCoordinatesPaneRenderer {
        constructor() {
          super(),
            (this._data = null),
            (this._textSizeCache = {
              totalHeight: Number.NaN,
              totalWidth: Number.NaN,
            })
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data || this._data.points.length < 2) return null
          const t = this._data.points[0],
            i = this._data.points[1]
          if (t.subtract(e).length() < 3)
            return new u.HitTestResult(u.HitTarget.ChangePoint)
          const n = i.x - this._textSizeCache.totalWidth / 2,
            r = i.y - this._textSizeCache.totalHeight / 2
          return e.x >= n &&
            e.x <= n + this._textSizeCache.totalWidth &&
            e.y >= r &&
            e.y <= r + this._textSizeCache.totalHeight
            ? new u.HitTestResult(u.HitTarget.MovePoint, {
                areaName: u.AreaName.Text,
              })
            : null
        }
        _drawImpl(e) {
          if (null === this._data || this._data.points.length < 2) return
          const t = this._data.points[0].clone(),
            i = this._data.points[1].clone(),
            n = e.context
          ;(n.lineCap = 'round'),
            (n.strokeStyle = this._data.bordercolor),
            (n.lineWidth = this._data.linewidth),
            (n.textBaseline = 'bottom'),
            (n.font = this._data.textData.font)
          const r =
              this._data.textData.fontSize * this._data.textData.lines.length,
            s = this._data.textData.maxWidth,
            o = s + 20,
            a = r + 20
          ;(this._textSizeCache.totalWidth = o),
            (this._textSizeCache.totalHeight = a)
          let c = i.x - o / 2,
            u = i.y - a / 2,
            p = 0
          const _ = s + 4 > 16,
            g = r + 4 > 16
          n.textAlign = (0, l.isRtl)() ? 'right' : 'left'
          const f = (0, h.calcTextHorizontalShift)(n, s)
          t.x > c + o ? (p = 20) : t.x > c && (p = 10),
            t.y > u + a ? (p += 2) : t.y > u && (p += 1),
            n.translate(c, u),
            (t.x -= c),
            (t.y -= u),
            (i.x -= c),
            (i.y -= u),
            n.beginPath(),
            n.moveTo(8, 0),
            10 === p
              ? _
                ? (n.lineTo(i.x - 8, 0),
                  n.lineTo(t.x, t.y),
                  n.lineTo(i.x + 8, 0),
                  n.lineTo(o - 8, 0))
                : (n.lineTo(t.x, t.y), n.lineTo(o - 8, 0))
              : n.lineTo(o - 8, 0),
            20 === p
              ? (n.lineTo(t.x, t.y), n.lineTo(o, 8))
              : n.arcTo(o, 0, o, 8, 8),
            21 === p
              ? g
                ? (n.lineTo(o, i.y - 8),
                  n.lineTo(t.x, t.y),
                  n.lineTo(o, i.y + 8),
                  n.lineTo(o, a - 8))
                : (n.lineTo(t.x, t.y), n.lineTo(o, a - 8))
              : n.lineTo(o, a - 8),
            22 === p
              ? (n.lineTo(t.x, t.y), n.lineTo(o - 8, a))
              : n.arcTo(o, a, o - 8, a, 8),
            12 === p
              ? _
                ? (n.lineTo(i.x + 8, a),
                  n.lineTo(t.x, t.y),
                  n.lineTo(i.x - 8, a),
                  n.lineTo(8, a))
                : (n.lineTo(t.x, t.y), n.lineTo(8, a))
              : n.lineTo(8, a),
            2 === p
              ? (n.lineTo(t.x, t.y), n.lineTo(0, a - 8))
              : n.arcTo(0, a, 0, a - 8, 8),
            1 === p
              ? g
                ? (n.lineTo(0, i.y + 8),
                  n.lineTo(t.x, t.y),
                  n.lineTo(0, i.y - 8),
                  n.lineTo(0, 8))
                : (n.lineTo(t.x, t.y), n.lineTo(0, 8))
              : n.lineTo(0, 8),
            0 === p
              ? (n.lineTo(t.x, t.y), n.lineTo(8, 0))
              : n.arcTo(0, 0, 8, 0, 8),
            n.stroke(),
            (n.fillStyle = (0, d.generateColor)(
              this._data.backcolor,
              this._data.transparency,
            )),
            n.fill(),
            (n.fillStyle = this._data.color),
            (u = 10 + this._data.textData.fontSize),
            (c = 10 + f)
          for (const e of this._data.textData.lines)
            n.fillText(e, c, u), (u += this._data.textData.fontSize)
        }
      }
      var _ = i(79191),
        g = i(80657)
      let f = null
      class v extends _.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._calloutRenderer = new p()),
            (this._renderer = new o.CompositeRenderer())
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            this._source.calculatePoint2(),
            this._renderer.clear(),
            !this._points[0])
          )
            return
          if (this._points.length < 2) return
          const e = this._source.properties().childs(),
            t = this._points[0],
            i =
              t.x +
              this._source.getBarOffset() *
                this._model.timeScale().barSpacing(),
            s = new n.Point(i, this._points[1].y),
            o = this._fontStyle(),
            a = e.wordWrap.value() ? e.wordWrapWidth.value() : void 0,
            l = (0, g.wordWrap)(e.text.value(), o, a)
          let d
          d =
            void 0 !== a
              ? a
              : l.reduce(
                  (e, t) =>
                    Math.max(
                      e,
                      ((e, t) => {
                        if (null === f) {
                          const e = document.createElement('canvas')
                          ;(e.width = 0),
                            (e.height = 0),
                            (f = (0, r.ensureNotNull)(e.getContext('2d')))
                        }
                        return (f.font = t), f.measureText(e).width
                      })(t, o),
                    ),
                  0,
                )
          const h = {
            points: [t, s],
            color: e.color.value(),
            linewidth: e.linewidth.value(),
            backcolor: e.backgroundColor.value(),
            transparency: e.transparency.value(),
            textData: {
              lines: l,
              maxWidth: d,
              font: o,
              fontSize: e.fontsize.value(),
            },
            bordercolor: e.bordercolor.value(),
          }
          if (
            (this._calloutRenderer.setData(h),
            this._renderer.append(this._calloutRenderer),
            this._renderer.append(this.createLineAnchor({ points: [t] }, 0)),
            void 0 !== a)
          ) {
            const e = h.points[1],
              t = new n.Point(e.x + a / 2 + 8 + 2, e.y)
            ;(t.data = 1),
              this._renderer.append(this.createLineAnchor({ points: [t] }, 1))
          }
        }
        _fontStyle() {
          const e = this._source.properties().childs(),
            t =
              (e.bold.value() ? 'bold ' : '') +
              (e.italic.value() ? 'italic ' : ''),
            i = e.fontsize.value()
          return (0, s.makeFont)(i, a.CHART_FONT_FAMILY, t)
        }
      }
    },
    79104: (e, t, i) => {
      i.r(t), i.d(t, { CirclePaneView: () => c })
      var n = i(46501),
        r = i(80657),
        s = i(19266),
        o = i(79191),
        a = i(18807),
        l = i(34026),
        d = i(45197)
      class h {
        constructor(e) {
          this._data = null != e ? e : null
        }
        setData(e) {
          this._data = e
        }
        draw(e, t) {
          if (null === this._data) return
          const {
            center: i,
            radius: n,
            lineWidth: r,
            color: s,
            fillBackground: o,
            backColor: a,
          } = this._data
          e.save()
          const l = t.pixelRatio,
            d = Math.max(1, Math.floor(l)),
            h = (d % 2) / 2,
            c = Math.round(i.x * l) + h,
            u = Math.round(i.y * l) + h,
            p = Math.round(c + n * l),
            _ = Math.max(1, Math.floor(r * l)),
            g = p - c - _
          o &&
            g > 0 &&
            ((e.fillStyle = a),
            e.beginPath(),
            e.moveTo(c + g, u),
            e.arc(c, u, g, 0, 2 * Math.PI, !1),
            e.fill())
          const f = Math.max(d / 2, p - c - _ / 2)
          ;(e.strokeStyle = s),
            (e.lineWidth = _),
            e.beginPath(),
            e.moveTo(c + f, u),
            e.arc(c, u, f, 0, 2 * Math.PI, !1),
            e.stroke(),
            e.restore()
        }
        hitTest(e, t) {
          if (null === this._data) return null
          const { center: i, radius: n } = this._data,
            r = (0, d.interactionTolerance)().curve
          if (!(0, l.pointInCircle)(e, i, n + r)) return null
          const s =
            n > r && (0, l.pointInCircle)(e, i, n - r)
              ? a.HitTarget.MovePointBackground
              : a.HitTarget.MovePoint
          return new a.HitTestResult(s)
        }
      }
      class c extends o.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._circleRenderer = new h()),
            (this._textRenderer = new r.TextRenderer()),
            (this._renderer = new s.CompositeRenderer())
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          var e
          if (
            (super._updateImpl(),
            this._renderer.clear(),
            this._points.length < 2)
          )
            return
          const t = this._source.properties().childs(),
            [i, n] = this._points
          this._circleRenderer.setData({
            center: i,
            radius: Math.sqrt((n.x - i.x) ** 2 + (n.y - i.y) ** 2),
            color: t.color.value(),
            lineWidth: t.linewidth.value(),
            backColor: t.backgroundColor.value(),
            fillBackground: t.fillBackground.value(),
          }),
            this._renderer.append(this._circleRenderer),
            t.showLabel.value() &&
              (null === (e = t.text) || void 0 === e ? void 0 : e.value()) &&
              (this._updateTextRenderer(),
              this._renderer.append(this._textRenderer)),
            this.addAnchors(this._renderer, {
              hittestResult: [a.HitTarget.MovePoint, a.HitTarget.ChangePoint],
            })
        }
        _updateTextRenderer() {
          const {
              text: e,
              textColor: t,
              fontSize: i,
              bold: r,
              italic: s,
            } = this._source.properties().childs(),
            [o, a] = this._points,
            l = o.subtract(a).length() * Math.sqrt(2),
            d = {
              points: [o],
              text: e.value(),
              color: t.value(),
              fontSize: i.value(),
              font: n.CHART_FONT_FAMILY,
              bold: r.value(),
              italic: s.value(),
              wordWrapWidth: l,
              maxHeight: l,
              offsetX: 0,
              offsetY: 0,
              horzAlign: 'center',
              vertAlign: 'middle',
              forceTextAlign: !0,
            }
          this._textRenderer.setData(d)
        }
      }
    },
    37662: (e, t, i) => {
      i.r(t), i.d(t, { CommentPaneView: () => f })
      var n = i(29764),
        r = i(87095),
        s = i(46501),
        o = i(79191),
        a = i(19266),
        l = i(86441),
        d = i(34026),
        h = i(38223),
        c = i(74359),
        u = i(15187),
        p = i(18807),
        _ = i(68441)
      class g extends u.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments),
            (this._geometryCache = {
              innerHeight: Number.NaN,
              textHorizontalPadding: Number.NaN,
              innerWidth: Number.NaN,
              paddingLeft: Number.NaN,
            }),
            (this._geomertryCacheInvalidated = !0),
            (this._data = null)
        }
        setData(e) {
          ;(this._data = e), (this._geomertryCacheInvalidated = !0)
        }
        hitTest(e, t) {
          if (null === this._data || 0 === this._data.points.length) return null
          const i = this._data.points[0].x,
            n = this._data.points[0].y - this._geometryCache.innerHeight,
            r = (0, l.box)(
              new l.Point(i, n),
              new l.Point(
                i + this._geometryCache.innerWidth,
                n + this._geometryCache.innerHeight,
              ),
            )
          return (0, d.pointInBox)(e, r)
            ? new p.HitTestResult(p.HitTarget.MovePoint, {
                areaName: p.AreaName.Text,
              })
            : null
        }
        _drawImpl(e) {
          if (null === this._data || 0 === this._data.points.length) return
          const t = e.context
          ;(t.font = this._data.font),
            (t.textAlign = (0, h.isRtl)() ? 'right' : 'left')
          const i = this._measureInfo(t, this._data.label, this._data.fontSize),
            {
              paddingLeft: n,
              innerHeight: r,
              innerWidth: s,
              textHorizontalPadding: o,
            } = i,
            a = Math.min(s, r) / 2,
            l = this._data.points[0].x,
            d = this._data.points[0].y - r
          t.translate(l, d),
            (0, _.drawRoundRect)(t, 0, 0, s, r, [a, a, a, 2]),
            (t.fillStyle = this._data.backgroundColor),
            t.fill(),
            (t.strokeStyle = this._data.borderColor),
            (t.lineWidth = 2),
            t.stroke(),
            t.closePath(),
            (t.textBaseline = 'middle'),
            (t.fillStyle = this._data.color),
            t.fillText(this._data.label, n + o, r / 2)
        }
        _measureInfo(e, t, i) {
          if (this._geomertryCacheInvalidated) {
            const n = e.measureText(t),
              r = i,
              s = 12,
              o = Math.round(r / 1.3),
              a = n.width + 2 * s,
              l = r + 2 * o,
              d = (0, c.calcTextHorizontalShift)(e, n.width)
            ;(this._geometryCache = {
              paddingLeft: s,
              innerWidth: a,
              innerHeight: l,
              textHorizontalPadding: d,
            }),
              (this._geomertryCacheInvalidated = !1)
          }
          return this._geometryCache
        }
      }
      class f extends o.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._commentRenderer = new g()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl(e, t) {
          super._updateImpl(e, t)
          const i = this._source.properties().childs(),
            o = {
              points: this._points,
              color: i.color.value(),
              borderColor: i.borderColor.value(),
              backgroundColor: (0, r.generateColor)(
                i.backgroundColor.value(),
                i.transparency.value(),
              ),
              font: (0, n.makeFont)(i.fontsize.value(), s.CHART_FONT_FAMILY),
              fontSize: i.fontsize.value(),
              label: i.text.value(),
            }
          if ((this._commentRenderer.setData(o), 1 === o.points.length)) {
            const e = new a.CompositeRenderer()
            return (
              e.append(this._commentRenderer),
              e.append(this.createLineAnchor({ points: o.points }, 0)),
              void (this._renderer = e)
            )
          }
          this._renderer = this._commentRenderer
        }
      }
    },
    51084: (e, t, i) => {
      i.r(t), i.d(t, { CrossLinePaneView: () => l })
      var n = i(79191),
        r = i(74997),
        s = i(71254),
        o = i(19266),
        a = i(18807)
      class l extends n.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._renderer = null),
            (this._horizLineRenderer = new r.HorizontalLineRenderer()),
            (this._vertLineRenderer = new s.VerticalLineRenderer()),
            this._horizLineRenderer.setHitTest(
              new a.HitTestResult(a.HitTarget.MovePoint),
            )
        }
        update() {
          this._invalidated = !0
        }
        renderer() {
          return (
            this._invalidated && (this._updateImpl(), (this._invalidated = !1)),
            this._renderer
          )
        }
        _updateImpl() {
          super._updateImpl(), (this._renderer = null)
          const e = this._getPoints()
          if (0 === e.length) return
          const t = {
            color: this._getSource().lineColor(),
            linestyle: this._getSource().lineStyle(),
            linewidth: this._getSource().lineWidth(),
            x: e[0].x,
            y: e[0].y,
          }
          this._horizLineRenderer.setData(t),
            this._horizLineRenderer.setHitTest(
              new a.HitTestResult(a.HitTarget.MovePoint, {
                snappingPrice: this._source.points()[0].price,
              }),
            ),
            this._vertLineRenderer.setData(t),
            this._vertLineRenderer.setHitTest(
              new a.HitTestResult(a.HitTarget.MovePoint, {
                snappingIndex: this._source.points()[0].index,
              }),
            )
          const i = new o.CompositeRenderer()
          i.append(this._horizLineRenderer),
            i.append(this._vertLineRenderer),
            this.addAnchors(i),
            (this._renderer = i)
        }
      }
    },
    47346: (e, t, i) => {
      i.r(t), i.d(t, { LineToolCyclicLinesPaneView: () => c })
      var n = i(86441),
        r = i(19266),
        s = i(73436),
        o = i(99031),
        a = i(79191),
        l = i(71254),
        d = i(18807),
        h = i(79849)
      class c extends a.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._coordinates = []),
            (this._trendRenderer = new o.TrendLineRenderer()),
            (this._renderer = new r.CompositeRenderer())
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          if (
            (super._updateImpl(),
            this._renderer.clear(),
            this._source.points().length < 2)
          )
            return
          const i = this._model.timeScale(),
            r = this._source.priceScale()
          if (!r || r.isEmpty() || i.isEmpty()) return
          const o = this._source.points()[0],
            a = this._source.points()[1],
            c = a ? a.index - o.index : 1
          if (((this._coordinates = []), 0 === c)) return
          const u = i.visibleBarsStrictRange()
          if (null === u) return
          if (c > 0) {
            for (let e = o.index; e <= u.lastBar(); e += c)
              this._coordinates.push(i.indexToCoordinate(e))
          } else {
            for (let e = o.index; e >= u.firstBar(); e += c)
              this._coordinates.push(i.indexToCoordinate(e))
          }
          if (this._points.length < 2) return
          const p = this._source.properties().childs(),
            _ = {
              points: this._points,
              color: '#808080',
              linewidth: 1,
              linestyle: h.LINESTYLE_DASHED,
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
              i = new l.VerticalLineRenderer()
            i.setData(t), this._renderer.append(i)
          }
          if (2 === this._source.points().length) {
            const e = this._points
            this._renderer.append(this.createLineAnchor({ points: e }, 0))
          } else
            this._renderer.append(
              this.createLineAnchor(
                {
                  points: [new n.Point(this._points[0].x, r.height() / 2)],
                  hittestResult: d.HitTarget.MovePoint,
                },
                1,
              ),
            )
        }
      }
    },
    25615: (e, t, i) => {
      i.r(t), i.d(t, { CypherPaneView: () => r })
      var n = i(24424)
      class r extends n.Pattern5pointsPaneView {
        _updateBaseData() {
          if (this._source.points().length >= 3) {
            const [e, t, i] = this._source.points()
            this._abRetracement =
              Math.round(
                1e3 * Math.abs((i.price - t.price) / (t.price - e.price)),
              ) / 1e3
          }
          if (this._source.points().length >= 4) {
            const [e, t, , i] = this._source.points()
            this._bcRetracement =
              Math.round(
                1e3 * Math.abs((i.price - e.price) / (t.price - e.price)),
              ) / 1e3
          }
          if (this._source.points().length >= 5) {
            const [e, , t, i, n] = this._source.points()
            ;(this._cdRetracement =
              Math.round(
                1e3 * Math.abs((n.price - i.price) / (i.price - t.price)),
              ) / 1e3),
              (this._xdRetracement =
                Math.round(
                  1e3 * Math.abs((n.price - i.price) / (e.price - i.price)),
                ) / 1e3)
          }
        }
      }
    },
    99734: (e, t, i) => {
      i.d(t, { DateAndPriceRangeBasePaneView: () => a })
      var n = i(86441),
        r = i(46501),
        s = i(80657),
        o = i(79191)
      class a extends o.LineSourcePaneView {
        constructor() {
          super(...arguments), (this._customTextrenderer = new s.TextRenderer())
        }
        _updateCustomTextRenderer(e, t) {
          const i = this._source.properties().childs().customText.childs()
          if (i.visible.value() && i.text.value().length > 0) {
            const [o, a] = this._points,
              l = Math.round((o.y + a.y) / 2),
              d = new n.Point(o.x, l),
              h = new n.Point(a.x, l),
              c = d.x < h.x ? d : h,
              u = c === d ? h : d,
              p = 'middle',
              _ = 'center',
              g = new n.Point((d.x + h.x) / 2, (d.y + h.y) / 2),
              f = Math.atan((u.y - c.y) / (u.x - c.x)),
              v = {
                points: [g],
                text: i.text.value(),
                color: i.color.value(),
                vertAlign: p,
                horzAlign: _,
                font: r.CHART_FONT_FAMILY,
                offsetX: 0,
                offsetY: 0,
                bold: i.bold.value(),
                italic: i.italic.value(),
                fontsize: i.fontsize.value(),
                forceTextAlign: !0,
                angle: f,
              }
            return (
              this._customTextrenderer.setData(v),
              this._needLabelExclusionPath(this._customTextrenderer, 'middle')
                ? (0, s.getTextBoundaries)(this._customTextrenderer, t, e)
                : null
            )
          }
          return this._customTextrenderer.setData(null), null
        }
      }
    },
    54306: (e, t, i) => {
      i.r(t), i.d(t, { DateAndPriceRangePaneView: () => T })
      var n = i(50151),
        r = i(86441),
        s = i(11542),
        o = i(38223),
        a = i(80657),
        l = i(72739),
        d = i(99031),
        h = i(19266),
        c = i(93572),
        u = i(79849),
        p = i(73436),
        _ = i(2043),
        g = i(57322),
        f = i(98596),
        v = i(46501),
        x = i(99734)
      const m = new _.TimeSpanFormatter(),
        w = new c.PercentageFormatter(),
        R = new f.VolumeFormatter(),
        y = s.t(null, void 0, i(33355)),
        b = s.t(null, { context: 'study' }, i(32819))
      class T extends x.DateAndPriceRangeBasePaneView {
        constructor() {
          super(...arguments),
            (this._distanceLineRenderer = new d.TrendLineRenderer()),
            (this._distancePriceRenderer = new d.TrendLineRenderer()),
            (this._backgroundRenderer = new l.RectangleRenderer()),
            (this._borderRenderer = new l.RectangleRenderer()),
            (this._textRenderer = new a.TextRenderer()),
            (this._renderer = new h.CompositeRenderer()),
            (this._pipFormatter = null),
            (this._lastSymbolInfo = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          var i, s, l
          if (
            (super._updateImpl(),
            this._renderer.clear(),
            this._points.length < 2 || this._source.points().length < 2)
          )
            return
          const d = this._source.properties().childs()
          d.fillBackground &&
            d.fillBackground.value() &&
            (this._backgroundRenderer.setData({
              points: this._points,
              color: 'white',
              linewidth: 0,
              backcolor: d.backgroundColor.value(),
              fillBackground: !0,
              transparency: d.backgroundTransparency.value(),
              extendLeft: !1,
              extendRight: !1,
            }),
            this._renderer.append(this._backgroundRenderer))
          const [h, c] = this._points
          d.drawBorder.value() &&
            (this._borderRenderer.setData({
              points: this._points,
              color: d.borderColor.value(),
              linewidth: d.borderWidth.value(),
              fillBackground: !1,
              extendLeft: !1,
              extendRight: !1,
              backcolor: '',
            }),
            this._renderer.append(this._borderRenderer))
          const _ = d.drawBorder.value() ? d.borderWidth.value() / 2 : 0,
            f = this._updateCustomTextRenderer(e, t),
            x = Math.round((h.y + c.y) / 2),
            T = new r.Point(h.x + Math.sign(c.x - h.x) * _, x),
            P = new r.Point(c.x + Math.sign(h.x - c.x) * _, x)
          this._distanceLineRenderer.setData({
            points: [T, P],
            color: d.linecolor.value(),
            linewidth: d.linewidth.value(),
            linestyle: u.LINESTYLE_SOLID,
            extendleft: !1,
            extendright: !1,
            leftend: p.LineEnd.Normal,
            rightend:
              Math.abs(h.x - c.x) >= 25 * d.linewidth.value()
                ? p.LineEnd.Arrow
                : p.LineEnd.Normal,
            excludeBoundaries: null != f ? f : void 0,
          }),
            this._renderer.append(this._distanceLineRenderer)
          const L = Math.round((h.x + c.x) / 2),
            C = new r.Point(L, h.y + Math.sign(c.y - h.y) * _),
            S = new r.Point(L, c.y + Math.sign(h.y - c.y) * _)
          this._distancePriceRenderer.setData({
            points: [C, S],
            color: d.linecolor.value(),
            linewidth: d.linewidth.value(),
            linestyle: u.LINESTYLE_SOLID,
            extendleft: !1,
            extendright: !1,
            leftend: p.LineEnd.Normal,
            rightend:
              Math.abs(C.y - S.y) >= 25 * d.linewidth.value()
                ? p.LineEnd.Arrow
                : p.LineEnd.Normal,
            excludeBoundaries: null != f ? f : void 0,
          }),
            this._renderer.append(this._distancePriceRenderer)
          const M = this._source.points()[0].price,
            I = this._source.points()[1].price,
            A = I - M,
            k = (100 * A) / Math.abs(M),
            N = this._source.points()[0].index,
            D = this._source.points()[1].index,
            B = D - N,
            z = (0, o.forceLTRStr)(B + ''),
            E = this._model.timeScale().indexToUserTime(N),
            H = this._model.timeScale().indexToUserTime(D)
          let V = ''
          if (E && H) {
            const e = (H.valueOf() - E.valueOf()) / 1e3
            V = ', ' + (0, o.startWithLTR)(m.format(e))
          }
          const O = this._model.mainSeries().symbolInfo()
          O &&
            O !== this._lastSymbolInfo &&
            ((this._pipFormatter = new g.PipFormatter(
              O.pricescale,
              O.minmov,
              O.type,
              O.minmove2,
              O.typespecs,
            )),
            (this._lastSymbolInfo = O))
          const W = (0, n.ensureNotNull)(
              this._source.ownerSource(),
            ).formatter(),
            F =
              (null !==
                (s =
                  null === (i = W.formatChange) || void 0 === i
                    ? void 0
                    : i.call(W, I, M)) && void 0 !== s
                ? s
                : W.format(A)) +
              ' (' +
              w.format(Math.round(100 * k) / 100) +
              ') ' +
              (this._pipFormatter ? this._pipFormatter.format(A) : '')
          let Y = (0, o.forceLTRStr)(F) + '\n' + y.format({ count: z }) + V
          const j = this._source.volume()
          let U
          Number.isNaN(j) || (Y += `\n${b} ${R.format(j)}`),
            (U =
              I > M
                ? new r.Point(0.5 * (h.x + c.x), c.y - 2 * d.fontsize.value())
                : new r.Point(
                    0.5 * (h.x + c.x),
                    c.y + 0.7 * d.fontsize.value(),
                  ))
          const q = { x: 0, y: 10 },
            Q = d.fontsize.value(),
            Z = {
              points: [U],
              text: Y,
              color: d.textcolor.value(),
              font: v.CHART_FONT_FAMILY,
              offsetX: q.x,
              offsetY: q.y,
              padding: 8,
              vertAlign: 'middle',
              horzAlign: 'center',
              fontsize: Q,
              backgroundRoundRect: 4,
              backgroundHorzInflate: 0.4 * Q,
              backgroundVertInflate: 0.2 * Q,
            }
          ;(null === (l = d.fillLabelBackground) || void 0 === l
            ? void 0
            : l.value()) &&
            ((Z.boxShadow = {
              shadowColor: d.shadow.value(),
              shadowBlur: 4,
              shadowOffsetY: 1,
            }),
            (Z.backgroundColor = d.labelBackgroundColor.value())),
            this._textRenderer.setData(Z)
          const X = this._textRenderer.measure(),
            G = (0, a.calculateLabelPosition)(X, h, c, q, e)
          this._textRenderer.setPoints([G]),
            this._renderer.append(this._textRenderer),
            this._renderer.append(this._customTextrenderer),
            this.addAnchors(this._renderer)
        }
        _needLabelExclusionPath(e) {
          return e.getLinesInfo().lines.length > 0
        }
      }
    },
    55762: (e, t, i) => {
      i.r(t), i.d(t, { DateRangePaneView: () => m })
      var n = i(86441),
        r = i(11542),
        s = i(38223),
        o = i(80657),
        a = i(72739),
        l = i(99031),
        d = i(19266),
        h = i(79849),
        c = i(73436),
        u = i(2043),
        p = i(98596),
        _ = i(46501),
        g = i(99734)
      const f = new p.VolumeFormatter(),
        v = r.t(null, void 0, i(33355)),
        x = r.t(null, { context: 'study' }, i(32819))
      class m extends g.DateAndPriceRangeBasePaneView {
        constructor() {
          super(...arguments),
            (this._leftBorderRenderer = new l.TrendLineRenderer()),
            (this._rightBorderRenderer = new l.TrendLineRenderer()),
            (this._distancePriceRenderer = new l.TrendLineRenderer()),
            (this._backgroundRenderer = new a.RectangleRenderer()),
            (this._textRenderer = new o.TextRenderer()),
            (this._renderer = new d.CompositeRenderer())
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          var i
          if (
            (super._updateImpl(),
            this._renderer.clear(),
            this._points.length < 2 || this._source.points().length < 2)
          )
            return
          const r = this._source.properties().childs(),
            a = r.extendTop.value(),
            l = r.extendBottom.value(),
            [d, p] = this._points,
            g = a ? 0 : Math.min(d.y, p.y),
            m = l ? this._height() : Math.max(d.y, p.y)
          r.fillBackground.value() &&
            (this._backgroundRenderer.setData({
              points: [new n.Point(d.x, g), new n.Point(p.x, m)],
              color: 'white',
              linewidth: 0,
              backcolor: r.backgroundColor.value(),
              fillBackground: !0,
              transparency: r.backgroundTransparency.value(),
              extendLeft: !1,
              extendRight: !1,
            }),
            this._renderer.append(this._backgroundRenderer))
          const w = (e, t, i) => {
            e.setData({
              points: [t, i],
              color: r.linecolor.value(),
              linewidth: r.linewidth.value(),
              linestyle: h.LINESTYLE_SOLID,
              extendleft: !1,
              extendright: !1,
              leftend: c.LineEnd.Normal,
              rightend: c.LineEnd.Normal,
            }),
              this._renderer.append(e)
          }
          w(this._leftBorderRenderer, new n.Point(d.x, g), new n.Point(d.x, m)),
            w(
              this._rightBorderRenderer,
              new n.Point(p.x, g),
              new n.Point(p.x, m),
            )
          const R = Math.round((d.y + p.y) / 2),
            y = new n.Point(d.x, R),
            b = new n.Point(p.x, R),
            T = this._updateCustomTextRenderer(e, t)
          this._distancePriceRenderer.setData({
            points: [y, b],
            color: r.linecolor.value(),
            linewidth: r.linewidth.value(),
            linestyle: h.LINESTYLE_SOLID,
            extendleft: !1,
            extendright: !1,
            leftend: c.LineEnd.Normal,
            rightend:
              Math.abs(y.x - b.x) >= 15 * r.linewidth.value()
                ? c.LineEnd.Arrow
                : c.LineEnd.Normal,
            excludeBoundaries: null != T ? T : void 0,
          }),
            this._renderer.append(this._distancePriceRenderer)
          const P = this._source.points()[0].index,
            L = this._source.points()[1].index,
            C = L - P,
            S = this._model.timeScale().indexToUserTime(P),
            M = this._model.timeScale().indexToUserTime(L)
          let I = ''
          if (S && M) {
            const e = (M.valueOf() - S.valueOf()) / 1e3
            I = ', ' + (0, s.startWithLTR)(new u.TimeSpanFormatter().format(e))
          }
          const A = this._source.volume(),
            k = Number.isNaN(A) ? '' : `\n${x} ${f.format(A)}`,
            N = v.format({ count: (0, s.forceLTRStr)(C.toString()) }) + I + k,
            D = { x: 0, y: 10 },
            B = r.fontsize.value(),
            z = {
              text: N,
              color: r.textcolor.value(),
              font: _.CHART_FONT_FAMILY,
              offsetX: D.x,
              offsetY: D.y,
              padding: 8,
              vertAlign: 'middle',
              horzAlign: 'center',
              fontsize: B,
              backgroundRoundRect: 4,
              backgroundHorzInflate: 0.4 * B,
              backgroundVertInflate: 0.2 * B,
            }
          ;(null === (i = r.fillLabelBackground) || void 0 === i
            ? void 0
            : i.value()) &&
            ((z.boxShadow = {
              shadowColor: r.shadow.value(),
              shadowBlur: 4,
              shadowOffsetY: 1,
            }),
            (z.backgroundColor = r.labelBackgroundColor.value())),
            this._textRenderer.setData(z)
          const E = this._textRenderer.measure(),
            H = (0, o.calculateLabelPosition)(E, d, p, D, e)
          this._textRenderer.setPoints([H]),
            this._renderer.append(this._textRenderer),
            this._renderer.append(this._customTextrenderer),
            this.addAnchors(this._renderer)
        }
      }
    },
    53288: (e, t, i) => {
      i.r(t), i.d(t, { DisjointChannelPaneView: () => _ })
      var n = i(50151),
        r = i(86441),
        s = i(49483),
        o = i(23966),
        a = i(99031),
        l = i(80657),
        d = i(19266),
        h = i(66103),
        c = i(46501),
        u = i(33295)
      const p = [
        h.PaneCursorType.Default,
        h.PaneCursorType.Default,
        h.PaneCursorType.VerticalResize,
        h.PaneCursorType.Default,
      ]
      class _ extends u.AlertableLineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._trendLineRendererPoints12 = new a.TrendLineRenderer()),
            (this._trendLineRendererPoints43 = new a.TrendLineRenderer()),
            (this._disjointChannelRenderer = new o.DisjointChannelRenderer()),
            (this._p1LabelRenderer = new l.TextRenderer()),
            (this._p2LabelRenderer = new l.TextRenderer()),
            (this._p3LabelRenderer = new l.TextRenderer()),
            (this._p4LabelRenderer = new l.TextRenderer()),
            (this._labelTextRenderer = new l.TextRenderer()),
            (this._renderer = new d.CompositeRenderer())
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          var i
          if (
            (super._updateImpl(),
            this._renderer.clear(),
            this._source.points().length < 2)
          )
            return
          const o = this._source.priceScale(),
            a =
              null === (i = this._source.ownerSource()) || void 0 === i
                ? void 0
                : i.firstValue()
          if (!o || null == a) return
          const [l, d, h] = this._source.points(),
            u = o.formatPrice(l.price, a),
            _ = o.formatPrice(d.price, a)
          let g, f
          if (h) {
            g = o.formatPrice(h.price, a)
            const e = d.price - l.price
            f = o.formatPrice(h.price + e, a)
          }
          if (this._points.length < 2) return
          const v = this._source.properties().childs(),
            [x, m] = this._points
          let w, R
          if (this._points.length >= 3) {
            ;(w = (0, r.point)(m.x, this._points[2].y)),
              (w.data = 2),
              (w.square = !0)
            const e = m.y - x.y
            if (
              ((R = (0, r.point)(x.x, w.y + e)),
              (R.data = 3),
              v.fillBackground.value())
            ) {
              const e = v.extendLeft.value(),
                t = v.extendRight.value()
              this._disjointChannelRenderer.setData({
                extendleft: e,
                extendright: t,
                points: [x, m, w, R],
                backcolor: v.backgroundColor.value(),
                transparency: v.transparency.value(),
                hittestOnBackground: s.CheckMobile.any(),
              }),
                this._renderer.append(this._disjointChannelRenderer)
            }
            v.labelVisible.value() &&
              v.labelText.value() &&
              this._renderer.append(this._getLabelTextRenderer(x, m, R, w))
          }
          const y = (e, t) => ({
              points: [e, t],
              color: v.linecolor.value(),
              linewidth: v.linewidth.value(),
              linestyle: v.linestyle.value(),
              extendleft: v.extendLeft.value(),
              extendright: v.extendRight.value(),
              leftend: v.leftEnd.value(),
              rightend: v.rightEnd.value(),
            }),
            b = (e, t, i, n, r, s) => {
              v.showPrices.value() &&
                (e.setData({
                  points: [i],
                  text: r,
                  color: v.textcolor.value(),
                  horzAlign: i.x > n.x ? 'left' : 'right',
                  vertAlign: 'middle',
                  font: c.CHART_FONT_FAMILY,
                  offsetX: 6,
                  offsetY: 0,
                  boxPadding: 0,
                  bold: v.bold.value(),
                  italic: v.italic.value(),
                  fontsize: v.fontsize.value(),
                  forceTextAlign: !0,
                }),
                this._renderer.append(e),
                t.setData({
                  points: [n],
                  text: s,
                  color: v.textcolor.value(),
                  horzAlign: i.x < n.x ? 'left' : 'right',
                  vertAlign: 'middle',
                  font: c.CHART_FONT_FAMILY,
                  offsetX: 6,
                  offsetY: 0,
                  boxPadding: 0,
                  bold: v.bold.value(),
                  italic: v.italic.value(),
                  fontsize: v.fontsize.value(),
                  forceTextAlign: !0,
                }),
                this._renderer.append(t))
            }
          if (
            (this._trendLineRendererPoints12.setData(y(x, m)),
            this._renderer.append(this._trendLineRendererPoints12),
            b(this._p1LabelRenderer, this._p2LabelRenderer, x, m, u, _),
            !w || !R)
          )
            return void this.addAnchors(this._renderer)
          this._trendLineRendererPoints43.setData(y(R, w)),
            this._renderer.append(this._trendLineRendererPoints43),
            b(
              this._p3LabelRenderer,
              this._p4LabelRenderer,
              w,
              R,
              (0, n.ensureDefined)(g),
              (0, n.ensureDefined)(f),
            )
          const T = [x, m, w, R]
          this._model.lineBeingCreated() === this._source && T.pop(),
            this._renderer.append(
              this.createLineAnchor({ points: T, pointsCursorType: p }, 0),
            ),
            x && m && this._addAlertRenderer(this._renderer, [x, m])
        }
        _getLabelTextRenderer(e, t, i, n) {
          const r = this._source.properties().childs()
          let s, o
          const a = r.labelFontSize.value() / 3
          let l = 0
          switch (r.labelVertAlign.value()) {
            case 'bottom':
              e.y < i.y ? ((s = e), (o = t)) : ((s = i), (o = n))
              break
            case 'top':
              e.y > i.y ? ((s = e), (o = t)) : ((s = i), (o = n))
              break
            case 'middle':
              ;(s = e.add(i).scaled(0.5)), (o = t.add(n).scaled(0.5)), (l = a)
          }
          const d = s.x < o.x ? s : o,
            h = d === s ? o : s
          let u
          switch (r.labelHorzAlign.value()) {
            case 'left':
              u = d
              break
            case 'right':
              u = h
              break
            default:
              u = d.add(h).scaled(0.5)
          }
          return (
            this._labelTextRenderer.setData({
              points: [u],
              color: r.labelTextColor.value(),
              fontSize: r.labelFontSize.value(),
              text: r.labelText.value(),
              font: c.CHART_FONT_FAMILY,
              bold: r.labelBold.value(),
              italic: r.labelItalic.value(),
              vertAlign: r.labelVertAlign.value(),
              horzAlign: r.labelHorzAlign.value(),
              offsetX: 0,
              offsetY: 0,
              boxPaddingVert: a,
              boxPaddingHorz: l,
              forceTextAlign: !0,
              angle: Math.atan((d.y - h.y) / (d.x - h.x)),
            }),
            this._labelTextRenderer
          )
        }
      }
    },
    14417: (e, t, i) => {
      i.r(t), i.d(t, { ElliottLabelsPaneView: () => v })
      var n = i(79191),
        r = i(19266),
        s = i(37160),
        o = i(87095),
        a = i(79849),
        l = i(18807),
        d = i(86441),
        h = i(34026),
        c = i(74359),
        u = i(29764)
      class p {
        constructor(e, t) {
          ;(this._data = e), (this._hitTestResult = t)
        }
        hitTest(e) {
          const t = this._center(),
            i = this._data.circleRadius,
            n = {
              min: new d.Point(t.x - i, t.y - i),
              max: new d.Point(t.x + i, t.y + i),
            }
          return (0, h.pointInBox)(e, n) ? this._hitTestResult : null
        }
        draw(e, t) {
          e.save()
          const i = t.pixelRatio,
            n = (Math.max(1, Math.floor(i)) % 2) / 2,
            r = this._center(),
            s = Math.round(r.x * i) + n,
            o = Math.round(r.y * i) + n
          if (this._data.showCircle) {
            const t =
              Math.round(s + this._data.circleRadius * i) -
              s -
              (this._data.circleBorderWidth * i) / 2
            ;(e.strokeStyle = this._data.color),
              (e.lineWidth = this._data.circleBorderWidth * i),
              e.beginPath(),
              e.moveTo(s + t, o),
              e.arc(s, o, t, 0, 2 * Math.PI, !1),
              e.stroke()
          }
          ;(e.font = (0, u.makeFont)(
            this._data.fontSize,
            this._data.font,
            this._data.bold ? 'bold' : void 0,
          )),
            (e.textBaseline = 'middle'),
            (e.textAlign = 'center'),
            (e.fillStyle = this._data.color),
            (0, c.drawScaled)(e, i, i, () => {
              e.fillText(
                this._data.letter,
                s / i,
                o / i + 0.05 * this._data.fontSize,
              )
            }),
            e.restore()
        }
        _center() {
          const e = 'bottom' === this._data.vertAlign ? -1 : 1,
            t =
              this._data.point.y +
              e * this._data.yOffset +
              e * this._data.circleRadius,
            i = this._data.point.x
          return new d.Point(i, t)
        }
      }
      var _ = i(46501),
        g = i(79797)
      const f = {
        4: { font: 24, circle: 36, circleBorderWidth: 1, bold: !0 },
        3: { font: 20, circle: 28, circleBorderWidth: 1, bold: !1 },
        2: { font: 18, circle: 22, circleBorderWidth: 1, bold: !1 },
        1: { font: 16, circle: 22, circleBorderWidth: 1, bold: !1 },
        0: { font: 11, circle: 14, circleBorderWidth: 1, bold: !0 },
      }
      class v extends n.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._renderer = null),
            (this._polylineRenderer = new g.PolygonRenderer())
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          var e
          super._updateImpl(), (this._renderer = null)
          const t = this._source.properties().childs(),
            i = this._source.priceScale(),
            n = this._model.timeScale(),
            d =
              null === (e = this._source.ownerSource()) || void 0 === e
                ? void 0
                : e.firstValue()
          if (!i || i.isEmpty() || n.isEmpty() || null == d) return
          const h = new r.CompositeRenderer()
          if (t.showWave.value()) {
            const e = {
              points: this._points,
              color: (0, o.generateColor)(t.color.value(), 0),
              linewidth: t.linewidth.value(),
              linestyle: a.LINESTYLE_SOLID,
              fillBackground: !1,
              filled: !1,
              backcolor: 'rgba(0, 0, 0, 0)',
              linejoin: 'round',
            }
            this._polylineRenderer.setData(e), h.append(this._polylineRenderer)
          }
          const c = this.areAnchorsVisible() ? 0 : 1
          let u = 1
          if (this._points.length > 2) {
            const e = this._points[2],
              t = this._points[1]
            u = (0, s.sign)(e.y - t.y)
          }
          let g = 0
          this._model.lineBeingCreated() === this._source && (g = 1)
          const v = (0, o.resetTransparency)(t.color.value())
          for (let e = 0; e < this._points.length - g; e++, u = -u) {
            if (e < c) continue
            const t = this._source.label(e)
            let i = t.label
            const n = 'circle' === t.decoration
            'brackets' === t.decoration && (i = '(' + i + ')')
            const r = f[t.group],
              s = new l.HitTestResult(l.HitTarget.ChangePoint, {
                pointIndex: e,
              })
            h.append(
              new p(
                {
                  point: this._points[e],
                  letter: i,
                  color: v,
                  font: _.CHART_FONT_FAMILY,
                  fontSize: r.font,
                  bold: r.bold,
                  showCircle: n,
                  circleRadius: r.circle / 2,
                  circleBorderWidth: r.circleBorderWidth,
                  yOffset: 10,
                  vertAlign: 1 === u ? 'top' : 'bottom',
                },
                s,
              ),
            )
          }
          const x = []
          for (let e = 0; e < this._points.length; e++) {
            const t = this._points[e].clone()
            ;(t.data = e), x.push(t)
          }
          this._model.lineBeingCreated() === this._source && x.pop(),
            h.append(this.createLineAnchor({ points: x }, 0)),
            (this._renderer = h)
        }
      }
    },
    11756: (e, t, i) => {
      i.r(t), i.d(t, { EllipsePaneView: () => v })
      var n = i(4652),
        r = i(86441),
        s = i(5531),
        o = i(46501),
        a = i(80657),
        l = i(66103),
        d = i(19266),
        h = i(79191),
        c = i(25422),
        u = i(87095),
        p = i(18807),
        _ = i(15187),
        g = i(45197)
      class f extends _.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        setData(e) {
          this._data = {
            ...e,
            angleFrom: 0,
            angleTo: 2 * Math.PI,
            clockwise: !1,
          }
        }
        hitTest(e) {
          if (null === this._data || this._data.points.length < 3) return null
          const t = this._data.points[0],
            i = this._data.points[1]
          let s = this._data.points[2]
          const o = (0, n.distanceToLine)(t, i, s).distance,
            a = i.subtract(t),
            l = t.add(i).scaled(0.5),
            d = new r.Point(-a.y, a.x).normalized()
          s = l.add(d.scaled(o))
          const h = a.length(),
            u = a.x / h,
            _ = a.y / h
          let f = Math.acos(u)
          _ < 0 && (f = -f)
          let v = (0, c.translationMatrix)(-l.x, -l.y)
          e = (0, c.transformPoint)(v, e)
          let x = (0, c.transformPoint)(v, this._data.points[2])
          ;(v = (0, c.rotationMatrix)(-f)),
            (e = (0, c.transformPoint)(v, e)),
            (x = (0, c.transformPoint)(v, x)),
            (v = (0, c.scalingMatrix)(1, h / (2 * o))),
            (e = (0, c.transformPoint)(v, e)),
            (x = (0, c.transformPoint)(v, x))
          const m = e.length(),
            w = (0, g.interactionTolerance)().curve
          return Math.abs(m - 0.5 * h) <= w
            ? new p.HitTestResult(p.HitTarget.MovePoint)
            : this._data.fillBackground &&
                !this._data.noHitTestOnBackground &&
                m <= 0.5 * h
              ? new p.HitTestResult(p.HitTarget.MovePointBackground)
              : null
        }
        _drawImpl(e) {
          if (null === this._data || this._data.points.length < 2) return
          const t = this._data.points[0],
            i = this._data.points[1],
            s = e.context
          if (this._data.points.length < 3)
            return (
              (s.strokeStyle = this._data.color),
              (s.lineWidth = this._data.linewidth),
              s.beginPath(),
              s.moveTo(t.x, t.y),
              s.lineTo(i.x, i.y),
              void s.stroke()
            )
          let o = this._data.points[2]
          const a = (0, n.distanceToLine)(t, i, o).distance
          if (a < 1)
            return (
              (s.strokeStyle = this._data.color),
              (s.lineWidth = this._data.linewidth),
              s.beginPath(),
              s.moveTo(t.x, t.y),
              s.lineTo(i.x, i.y),
              void s.stroke()
            )
          const l = i.subtract(t),
            d = t.add(i).scaled(0.5),
            h = new r.Point(-l.y, l.x).normalized()
          ;(o = d.add(h.scaled(a))),
            (s.strokeStyle = this._data.color),
            (s.lineWidth = this._data.linewidth)
          const p = l.length(),
            _ = l.x / p,
            g = l.y / p
          let f = Math.acos(_)
          g < 0 && (f = -f)
          let v = this._data.points[2],
            x = (0, c.translationMatrix)(-d.x, -d.y)
          ;(v = (0, c.transformPoint)(x, v)),
            (x = (0, c.rotationMatrix)(-f)),
            (v = (0, c.transformPoint)(x, v)),
            (x = (0, c.scalingMatrix)(1, p / (2 * a))),
            (v = (0, c.transformPoint)(x, v)),
            v.y < 0 ? (this._data.clockwise = !0) : (this._data.clockwise = !1),
            s.save(),
            s.beginPath(),
            s.translate(d.x, d.y),
            s.rotate(f),
            s.scale(1, (2 * a) / p),
            s.arc(
              0,
              0,
              0.5 * p,
              this._data.angleFrom,
              this._data.angleTo,
              this._data.clockwise,
            ),
            s.restore(),
            s.stroke(),
            this._data.fillBackground &&
              ((s.fillStyle = (0, u.generateColor)(
                this._data.backcolor,
                this._data.transparency,
              )),
              s.fill())
        }
      }
      class v extends h.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._ellipseRenderer = new f()),
            (this._textRenderer = new a.TextRenderer()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          var e
          if (
            (super._updateImpl(),
            (this._renderer = null),
            this._points.length < 2)
          )
            return
          const t = this._source.properties().childs(),
            i = {
              points: this._points,
              color: t.color.value(),
              linewidth: t.linewidth.value(),
              backcolor: t.backgroundColor.value(),
              fillBackground: t.fillBackground.value(),
              transparency: t.transparency.value(),
              noHitTestOnBackground: !1,
            }
          this._ellipseRenderer.setData(i)
          const s = new d.CompositeRenderer()
          s.append(this._ellipseRenderer)
          const o = i.points[0],
            a = i.points[1]
          if (2 === this._points.length)
            return this.addAnchors(s), void (this._renderer = s)
          let c = i.points[2]
          const u = (0, n.distanceToLine)(o, a, c).distance,
            p = a.subtract(o),
            _ = o.add(a).scaled(0.5),
            g = new r.Point(-p.y, p.x).normalized()
          c = _.add(g.scaled(u))
          const f = _.add(g.scaled(-u)),
            v = new r.Point(o.x, o.y)
          v.data = 0
          const x = new r.Point(a.x, a.y)
          x.data = 1
          const m = new r.Point(c.x, c.y)
          m.data = 2
          const w = new r.Point(f.x, f.y)
          ;(w.data = 3),
            t.showLabel.value() &&
              (null === (e = t.text) || void 0 === e ? void 0 : e.value()) &&
              this._updateTextRenderer(v, x, m, w) &&
              s.append(this._textRenderer)
          const R = (0, h.thirdPointCursorType)(v, x),
            y = [l.PaneCursorType.Default, l.PaneCursorType.Default, R, R]
          s.append(
            this.createLineAnchor(
              { points: [v, x, m, w], pointsCursorType: y },
              0,
            ),
          ),
            (this._renderer = s)
        }
        _updateTextRenderer(e, t, i, n) {
          if (t.subtract(e).length() < 1e-5 || n.subtract(i).length() < 1e-5)
            return !1
          const a = (0, s.intersectLines)(
            (0, r.lineThroughPoints)(e, t),
            (0, r.lineThroughPoints)(i, n),
          )
          if (!a) return !1
          const {
              text: l,
              textColor: d,
              fontSize: h,
              bold: c,
              italic: u,
            } = this._source.properties().childs(),
            p = Math.sqrt(2),
            _ = {
              points: [a],
              text: l.value(),
              color: d.value(),
              fontSize: h.value(),
              font: o.CHART_FONT_FAMILY,
              bold: c.value(),
              italic: u.value(),
              wordWrapWidth: e.subtract(t).length() / p,
              maxHeight: n.subtract(i).length() / p,
              angle: Math.atan((e.y - t.y) / (e.x - t.x)),
              offsetX: 0,
              offsetY: 0,
              horzAlign: 'center',
              vertAlign: 'middle',
              forceTextAlign: !0,
            }
          return this._textRenderer.setData(_), !0
        }
      }
    },
    63451: (e, t, i) => {
      i.r(t), i.d(t, { EmojiPaneView: () => r })
      var n = i(50761)
      class r extends n.SvgIconPaneView {
        _iconColor() {
          return null
        }
      }
    },
    82080: (e, t, i) => {
      i.r(t), i.d(t, { ExecutionPaneView: () => d })
      var n = i(86441),
        r = i(79191),
        s = i(18807),
        o = i(15187)
      class a extends o.MediaCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = null != e ? e : null)
        }
        hitTest(e, t) {
          if (null === this._data) return null
          const i = Math.round(this._data.point.x),
            n = Math.round(this._data.point.y),
            r = this._data.arrowHeight
          let o, a
          if (
            ('buy' === this._data.direction
              ? ((o = n), (a = n + r))
              : ((o = n - r), (a = n)),
            e.x >= i - 2 && e.x <= i + 2 && e.y >= o && e.y <= a)
          ) {
            const e = this._data.tooltip
            return new s.HitTestResult(s.HitTarget.Custom, {
              tooltip:
                '' !== e
                  ? { text: e, rect: { x: i, y: o, w: 2, h: a - o } }
                  : void 0,
            })
          }
          return null
        }
        setData(e) {
          this._data = e
        }
        _drawImpl(e) {
          const t = e.context
          if (null === this._data) return
          const i = Math.round(this._data.point.x),
            n = Math.round(this._data.point.y)
          !((e, t, i, n, r, s) => {
            e.save(),
              (e.strokeStyle = n),
              (e.fillStyle = n),
              e.translate(t - 2, i),
              'buy' !== r && (e.rotate(Math.PI), e.translate(-4, 0)),
              e.beginPath(),
              e.moveTo(2, s),
              e.lineTo(2, 0),
              e.moveTo(0, 2),
              e.lineTo(2, 0),
              e.lineTo(4, 2),
              e.stroke(),
              e.restore()
          })(
            t,
            i,
            n,
            this._data.arrowColor,
            this._data.direction,
            this._data.arrowHeight,
          )
          const {
              arrowHeight: r,
              arrowSpacing: s,
              fontHeight: o,
              direction: a,
              text: l,
              font: d,
              textColor: h,
            } = this._data,
            c = ((e, t, i) => {
              if (0 === t.length) return 0
              e.save(), (e.font = i)
              const n = e.measureText(t).width
              return e.restore(), 5 + n
            })(t, l, d)
          if (0 !== c) {
            const e = 'buy' === a ? n + r + s : n - r - s - o
            !((e, t, i, n, r, s, o, a) => {
              if (!s) return
              e.save(),
                (e.textAlign = 'center'),
                (e.textBaseline = 'middle'),
                (e.font = o),
                (e.fillStyle = a)
              const l = t + n / 2,
                d = i + r / 2
              e.fillText(s, l, d - 1), e.restore()
            })(t, Math.round(i + 0.5 - c / 2), e, c, o, l, d, h)
          }
        }
      }
      var l = i(47043)
      class d extends r.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._executionRenderer = new a()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          var i
          super._updateImpl(e, t), (this._renderer = null)
          const r = this._source,
            s = r.points()
          if (0 === s.length) return
          const o = r.adapter(),
            a = r.model().timeScale(),
            d =
              null === (i = r.model().paneForSource(r)) || void 0 === i
                ? void 0
                : i.executionsPositionController()
          if (!d) return
          const h = d.getXYCoordinate(o, a, s[0].index)
          !isFinite(h.y) ||
            h.y < 0 ||
            h.y > e ||
            h.x < 0 ||
            (this._executionRenderer.setData({
              point: new n.Point(h.x, h.y),
              arrowColor: o.getArrowColor(),
              arrowHeight: o.getArrowHeight(),
              direction: o.getDirection(),
              tooltip: o.getTooltip(),
              arrowSpacing: o.getArrowSpacing(),
              fontHeight: l.fontHeight(o.getFont()),
              text: o.getText(),
              textColor: o.getTextColor(),
              font: o.getFont(),
            }),
            (this._renderer = this._executionRenderer))
        }
      }
    },
    46406: (e, t, i) => {
      i.r(t), i.d(t, { FibChannelPaneView: () => u })
      var n = i(50151),
        r = i(87095),
        s = i(73436),
        o = i(19266),
        a = i(64308),
        l = i(99031),
        d = i(134),
        h = i(80657)
      class c extends a.ParallelChannelRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        _drawLine(e, t, i, n) {
          var r
          const s =
            null === (r = this._data) || void 0 === r
              ? void 0
              : r.excludeBoundaries
          if (void 0 !== s) {
            e.save(), e.beginPath(), e.rect(0, 0, n.width, n.height)
            for (let t = 0; t < s.length; t++) {
              const { x: i, y: n } = s[t]
              0 !== t ? e.lineTo(i, n) : e.moveTo(i, n)
            }
            e.closePath(), e.clip('evenodd')
          }
          super._drawLine(e, t, i, n), void 0 !== s && e.restore()
        }
      }
      class u extends d.LineToolPaneViewFibWithLabels {
        constructor() {
          super(...arguments),
            (this._baseLineRenderer = new l.TrendLineRenderer()),
            (this._lastLevelTrendRenderer = new l.TrendLineRenderer()),
            (this._renderer = null),
            (this._norm = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          var i, a, l
          super._updateImpl()
          const d = this._source.priceScale()
          if (null === d) return
          this._renderer = null
          const u =
            null === (i = this._source.ownerSource()) || void 0 === i
              ? void 0
              : i.firstValue()
          if (null == u) return
          3 === this._points.length &&
            3 === this._source.points().length &&
            (this._norm = this._points[2].subtract(this._points[0]))
          const p = new o.CompositeRenderer()
          if (this._points.length < 2)
            return this.addAnchors(p), void (this._renderer = p)
          const _ = this._source.properties().childs(),
            g = this._points[0],
            f = this._points[1]
          if (this._points.length < 3) {
            const e = {
              points: [g, f],
              color: _.level1.childs().color.value(),
              linewidth: _.levelsStyle.childs().linewidth.value(),
              linestyle: _.levelsStyle.childs().linestyle.value(),
              extendleft: _.extendLeft.value(),
              extendright: _.extendRight.value(),
              leftend: s.LineEnd.Normal,
              rightend: s.LineEnd.Normal,
            }
            return (
              this._baseLineRenderer.setData(e),
              p.append(this._baseLineRenderer),
              this.addAnchors(p),
              void (this._renderer = p)
            )
          }
          const v = this._source.levelsCount(),
            x = (0, n.ensureNotNull)(this._norm)
          for (let i = 1; i < v; i++) {
            const s = (0, n.ensureDefined)(
              this._source.properties().child('level' + i),
            ).childs()
            if (!s.visible.value()) continue
            let o = null
            for (let e = i + 1; e <= v; e++) {
              const t = (0, n.ensureDefined)(
                this._source.properties().child('level' + e),
              ).childs()
              if (t.visible.value()) {
                o = t
                break
              }
            }
            if (!o) break
            const l = x.scaled(s.coeff.value()),
              m = g.add(l),
              w = f.add(l),
              R = x.scaled(o.coeff.value()),
              y = g.add(R),
              b = f.add(R),
              T = s.color.value(),
              P = _.extendLeft.value(),
              L = _.extendRight.value(),
              C = _.levelsStyle.childs().linestyle.value(),
              S = _.levelsStyle.childs().linewidth.value(),
              M = d.coordinateToPrice(m.y, u),
              I = this._updateLabelForLevel({
                i: i - 1,
                levelIndex: i,
                leftPoint: m,
                rightPoint: w,
                price: M,
                color: T,
                horzAlign: _.horzLabelsAlign.value(),
                vertAlign: _.vertLabelsAlign.value(),
              })
            let A
            null !== I &&
              (p.append(I),
              (A =
                null !== (a = (0, h.getTextBoundaries)(I, t, e)) && void 0 !== a
                  ? a
                  : void 0))
            const k = {
                line1: { color: T, lineStyle: C, lineWidth: S, points: [m, w] },
                line2: { color: T, lineStyle: C, lineWidth: S, points: [y, b] },
                extendLeft: P,
                extendRight: L,
                backColor: (0, r.generateColor)(T, _.transparency.value(), !0),
                skipTopLine: !0,
                fillBackground: _.fillBackground.value(),
                hittestOnBackground: !0,
                excludeBoundaries: A,
              },
              N = new c()
            N.setData(k), p.append(N)
          }
          let m = null
          for (let e = v; e >= 1; e--) {
            if (
              (0, n.ensureDefined)(this._source.properties().child('level' + e))
                .childs()
                .visible.value()
            ) {
              m = e
              break
            }
          }
          if (null !== m) {
            const i = (0, n.ensureDefined)(
              this._source.properties().child('level' + m),
            ).childs()
            if (i.visible.value()) {
              const n = x.scaled(i.coeff.value()),
                r = g.add(n),
                o = f.add(n),
                a = d.coordinateToPrice(r.y, u),
                c = this._updateLabelForLevel({
                  i: m - 1,
                  levelIndex: m,
                  leftPoint: r,
                  rightPoint: o,
                  price: a,
                  color: i.color.value(),
                  horzAlign: _.horzLabelsAlign.value(),
                  vertAlign: _.vertLabelsAlign.value(),
                })
              let v
              null !== c &&
                (p.append(c),
                (v =
                  null !== (l = (0, h.getTextBoundaries)(c, t, e)) &&
                  void 0 !== l
                    ? l
                    : void 0))
              const w = {
                points: [r, o],
                color: i.color.value(),
                linewidth: _.levelsStyle.childs().linewidth.value(),
                linestyle: _.levelsStyle.childs().linestyle.value(),
                extendleft: _.extendLeft.value(),
                extendright: _.extendRight.value(),
                leftend: s.LineEnd.Normal,
                rightend: s.LineEnd.Normal,
                excludeBoundaries: v,
              }
              this._lastLevelTrendRenderer.setData(w),
                p.append(this._lastLevelTrendRenderer)
            }
          }
          this.addAnchors(p), (this._renderer = p)
        }
      }
    },
    13616: (e, t, i) => {
      var n = i(86441).Point
      const { LineToolPaneViewFibWithLabels: r } = i(134)
      var s = i(99031).TrendLineRenderer,
        o = i(18807).HitTestResult,
        a = i(18807).HitTarget,
        l = i(19266).CompositeRenderer,
        d = i(70531).EllipseRendererSimple,
        h = i(73436).LineEnd
      t.FibCirclesPaneView = class extends r {
        constructor(e, t) {
          super(e, t),
            (this._trendLineRenderer = new s()),
            (this._renderer = null)
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            (this._renderer = null),
            !(this._source.points().length < 2 || this._points.length < 2) &&
              this._source.priceScale() &&
              !this._source.priceScale().isEmpty() &&
              !this._model.timeScale().isEmpty())
          ) {
            var e = this._points[0],
              t = this._points[1]
            this._center = e.add(t).scaled(0.5)
            var i = Math.abs(t.x - e.x),
              r = Math.abs(t.y - e.y)
            this._levels = []
            for (
              var s = this._source.properties(),
                c = this._source.levelsCount(),
                u = 1;
              u <= c;
              u++
            ) {
              var p = s['level' + u]
              if (p.visible.value()) {
                var _ = p.coeff.value(),
                  g = p.color.value(),
                  f = []
                f.push(
                  new n(
                    this._center.x - 0.5 * i * _,
                    this._center.y - 0.5 * r * _,
                  ),
                ),
                  f.push(
                    new n(
                      this._center.x + 0.5 * i * _,
                      this._center.y + 0.5 * r * _,
                    ),
                  )
                var v = new n(this._center.x, this._center.y + 0.5 * r * _)
                this._levels.push({
                  color: g,
                  points: f,
                  labelPoint: v,
                  linewidth: p.linewidth.value(),
                  linestyle: p.linestyle.value(),
                  index: u,
                })
              }
            }
            if (!(this._points.length < 2)) {
              var x = new l(),
                m = s.fillBackground.value(),
                w = s.transparency.value()
              for (u = 0; u < this._levels.length; u++) {
                var R = this._levels[u],
                  y = {}
                ;(y.points = R.points),
                  (y.color = R.color),
                  (y.linewidth = R.linewidth),
                  (y.backcolor = R.color),
                  u > 0 && (y.wholePoints = this._levels[u - 1].points),
                  (y.fillBackground = m),
                  (y.transparency = w)
                var b = new o(a.MovePoint, null, R.index)
                x.append(new d(y, b))
                const e = this._updateLabelForLevel({
                  i: u,
                  levelIndex: R.index,
                  color: R.color,
                  price: 0,
                  vertAlign: 'middle',
                  horzAlign: 'left',
                  leftPoint: this._levels[u].labelPoint,
                  rightPoint: this._levels[u].labelPoint,
                })
                null !== e && x.append(e)
              }
              if (s.trendline.visible.value()) {
                var T = {
                  points: [this._points[0], this._points[1]],
                  width: this._model.timeScale().width(),
                  height: this._source.priceScale().height(),
                  color: s.trendline.color.value(),
                  linewidth: s.trendline.linewidth.value(),
                  linestyle: s.trendline.linestyle.value(),
                  extendleft: !1,
                  extendright: !1,
                  leftend: h.Normal,
                  rightend: h.Normal,
                }
                this._trendLineRenderer.setData(T),
                  x.append(this._trendLineRenderer)
              }
              this.addAnchors(x), (this._renderer = x)
            }
          }
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
      }
    },
    26702: (e, t, i) => {
      i.d(t, { fibLevelCoordinate: () => r, fibLevelPrice: () => s })
      var n = i(50151)
      function r(e, t, i, r, s, o) {
        if (o)
          return Math.round(
            (0, n.ensureDefined)(e.coordinate) +
              (0, n.ensureDefined)(t.coordinate) * i,
          )
        const a = e.price + t.price * i
        return r.priceToCoordinate(a, s)
      }
      function s(e, t, i, r, s, o) {
        if (!o) return e.price + t.price * i
        const a =
          (0, n.ensureDefined)(e.coordinate) +
          (0, n.ensureDefined)(t.coordinate) * i
        return r.coordinateToPrice(a, s)
      }
    },
    95994: (e, t, i) => {
      i.r(t), i.d(t, { FibRetracementPaneView: () => u })
      var n = i(86441),
        r = i(72739),
        s = i(99031),
        o = i(80657),
        a = i(18807),
        l = i(19266),
        d = i(73436),
        h = i(26702),
        c = i(134)
      class u extends c.LineToolPaneViewFibWithLabels {
        constructor(e, t) {
          super(e, t),
            (this._trendLineRenderer = new s.TrendLineRenderer()),
            (this._renderer = new l.CompositeRenderer()),
            (this._levels = [])
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          var i, l
          if (
            (super._updateImpl(),
            this._renderer.clear(),
            this._source.points().length < 2)
          )
            return
          const c = this._source.priceScale()
          if (!c || c.isEmpty() || this._model.timeScale().isEmpty()) return
          const u =
            null === (i = this._source.ownerSource()) || void 0 === i
              ? void 0
              : i.firstValue()
          if (null == u) return
          const [p, _] = this._source.points(),
            g = this._source.properties().childs(),
            f = g.reverse.value()
          if (this._points.length < 2) return
          const v = this._points[0],
            x = this._points[1],
            m = Math.min(v.x, x.x),
            w = Math.max(v.x, x.x),
            R = g.fillBackground.value(),
            y = g.transparency.value(),
            b = g.extendLinesLeft.value(),
            T = g.extendLines.value(),
            P = c.isLog() && g.fibLevelsBasedOnLogScale.value(),
            L = !((m > t && !b) || (w < 0 && !T))
          this._levels = []
          const C = f ? p.price : _.price,
            S = f ? _.price : p.price,
            M = S - C,
            I = c.priceToCoordinate(C, u),
            A = { price: C, coordinate: I },
            k = { price: M, coordinate: c.priceToCoordinate(S, u) - I },
            N = this._source.levelsCount()
          for (let e = 1; e <= N; e++) {
            const t = g['level' + e].childs()
            if (!t || !t.visible.value()) continue
            const i = t.coeff.value(),
              n = (0, h.fibLevelCoordinate)(A, k, i, c, u, P),
              r = (0, h.fibLevelPrice)(A, k, i, c, u, P)
            this._levels.push({
              color: t.color.value(),
              y: n,
              price: r,
              linewidth: g.levelsStyle.childs().linewidth.value(),
              linestyle: g.levelsStyle.childs().linestyle.value(),
              index: e,
            })
          }
          if (R && L)
            for (let e = 0; e < this._levels.length; e++)
              if (e > 0 && R) {
                const t = this._levels[e - 1],
                  i = {
                    points: [
                      new n.Point(m, this._levels[e].y),
                      new n.Point(w, t.y),
                    ],
                    color: this._levels[e].color,
                    linewidth: 0,
                    backcolor: this._levels[e].color,
                    fillBackground: !0,
                    transparency: y,
                    extendLeft: b,
                    extendRight: T,
                  },
                  s = new r.RectangleRenderer(void 0, void 0, !0)
                s.setData(i), this._renderer.append(s)
              }
          let D = m,
            B = w
          D === B && (b && (D -= 1), T && (B += 1))
          for (let i = 0; i < this._levels.length; i++) {
            const r = new n.Point(D, this._levels[i].y),
              h = new n.Point(B, this._levels[i].y),
              c = this._updateLabelForLevel({
                i,
                levelIndex: this._levels[i].index,
                leftPoint: r,
                rightPoint: h,
                price: this._levels[i].price,
                color: this._levels[i].color,
                extendLeft: b,
                extendRight: T,
                horzAlign: g.horzLabelsAlign.value(),
                vertAlign: g.vertLabelsAlign.value(),
              })
            if (
              (null === c || c.isOutOfScreen(t, e) || this._renderer.append(c),
              L)
            ) {
              let n
              null !== c &&
                'middle' === g.vertLabelsAlign.value() &&
                (n =
                  null !== (l = (0, o.getTextBoundaries)(c, t, e)) &&
                  void 0 !== l
                    ? l
                    : void 0)
              const u = {
                  points: [r, h],
                  color: this._levels[i].color,
                  linewidth: this._levels[i].linewidth,
                  linestyle: this._levels[i].linestyle,
                  extendleft: b,
                  extendright: T,
                  leftend: d.LineEnd.Normal,
                  rightend: d.LineEnd.Normal,
                  excludeBoundaries: n,
                },
                p = new s.TrendLineRenderer()
              p.setData(u),
                p.setHitTest(
                  new a.HitTestResult(
                    a.HitTarget.MovePoint,
                    { snappingPrice: this._levels[i].price },
                    this._levels[i].index,
                  ),
                ),
                this._renderer.append(p)
            }
          }
          const z = g.trendline.childs()
          if (z.visible.value() && L) {
            const i = {
              points: [this._points[0], this._points[1]],
              width: t,
              height: e,
              color: z.color.value(),
              linewidth: z.linewidth.value(),
              linestyle: z.linestyle.value(),
              extendleft: !1,
              extendright: !1,
              leftend: d.LineEnd.Normal,
              rightend: d.LineEnd.Normal,
            }
            this._trendLineRenderer.setData(i),
              this._renderer.append(this._trendLineRenderer)
          }
          this.addAnchors(this._renderer)
        }
      }
    },
    91331: (e, t, i) => {
      i.r(t), i.d(t, { FibSpeedResistanceArcsPaneView: () => _ })
      var n = i(86441),
        r = i(37160),
        s = i(18807),
        o = i(19266),
        a = i(73436),
        l = i(99031),
        d = i(87095),
        h = i(45197),
        c = i(15187)
      class u extends c.MediaCoordinatesPaneRenderer {
        constructor(e, t, i) {
          super(),
            (this._data = e),
            (this._hittest = t || new s.HitTestResult(s.HitTarget.MovePoint)),
            (this._backHittest =
              i || new s.HitTestResult(s.HitTarget.MovePointBackground))
        }
        hitTest(e) {
          const t = this._data
          if (null === t) return null
          if ((0, r.sign)(e.y - t.center.y) !== t.dir && !t.fullCircles)
            return null
          const i = e.subtract(t.center).length(),
            n = (0, h.interactionTolerance)().curve
          return Math.abs(i - t.radius) < n
            ? this._hittest
            : t.hittestOnBackground && Math.abs(i) <= t.radius + n
              ? this._backHittest
              : null
        }
        _drawImpl(e) {
          const t = this._data
          if (null === t) return
          const i = e.context
          ;(i.lineCap = 'round'),
            (i.strokeStyle = t.color),
            (i.lineWidth = t.linewidth),
            i.translate(t.center.x, t.center.y),
            i.beginPath(),
            t.fullCircles
              ? i.arc(0, 0, t.radius, 2 * Math.PI, 0, !1)
              : t.dir > 0
                ? i.arc(0, 0, t.radius, 0, Math.PI, !1)
                : i.arc(0, 0, t.radius, Math.PI, 0, !1),
            i.stroke(),
            t.fillBackground &&
              (t.radius2 &&
                (t.fullCircles
                  ? i.arc(0, 0, t.radius2, 2 * Math.PI, 0, !0)
                  : t.dir > 0
                    ? i.arc(0, 0, t.radius2, Math.PI, 0, !0)
                    : i.arc(0, 0, t.radius2, 0, Math.PI, !0)),
              (i.fillStyle = (0, d.generateColor)(t.color, t.transparency, !0)),
              i.fill())
        }
      }
      var p = i(134)
      class _ extends p.LineToolPaneViewFibWithLabels {
        constructor() {
          super(...arguments),
            (this._trendLineRenderer = new l.TrendLineRenderer()),
            (this._renderer = null),
            (this._levels = [])
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          var e
          if (
            (super._updateImpl(),
            (this._renderer = null),
            this._points.length < 2)
          )
            return
          const t = this._source.priceScale()
          if (!t || t.isEmpty() || this._model.timeScale().isEmpty()) return
          if (
            null ==
            (null === (e = this._source.ownerSource()) || void 0 === e
              ? void 0
              : e.firstValue())
          )
            return
          const i = this._points[0],
            l = this._points[1],
            d = i.subtract(l).length()
          this._levels = []
          const h = this._source.properties().childs(),
            c = this._source.levelsCount()
          for (let e = 1; e <= c; e++) {
            const t = 'level' + e,
              s = this._source.properties().child(t).childs()
            if (!s.visible.value()) continue
            const o = s.coeff.value(),
              a = s.color.value(),
              h = Math.abs(l.subtract(i).length() * o),
              c = (0, r.sign)(l.y - i.y),
              u = new n.Point(i.x, i.y + c * d * Math.abs(o))
            this._levels.push({
              color: a,
              radius: h,
              dir: c,
              labelPoint: u,
              linewidth: s.linewidth.value(),
              linestyle: s.linestyle.value(),
              index: e,
            })
          }
          if (this._points.length < 2) return
          const p = new o.CompositeRenderer(),
            _ = h.fillBackground.value(),
            g = h.transparency.value()
          for (let e = 0; e < this._levels.length; e++) {
            const t = this._levels[e],
              n = {
                center: i,
                color: t.color,
                linewidth: t.linewidth,
                radius: t.radius,
                dir: t.dir,
                transparency: g,
                fillBackground: _,
                hittestOnBackground: !0,
                fullCircles: h.fullCircles.value(),
                radius2: e > 0 ? this._levels[e - 1].radius : void 0,
              },
              r = new s.HitTestResult(s.HitTarget.MovePoint, void 0, t.index)
            p.append(new u(n, r))
            const o = this._updateLabelForLevel({
              i: e,
              levelIndex: this._levels[e].index,
              leftPoint: this._levels[e].labelPoint,
              rightPoint: this._levels[e].labelPoint,
              price: 0,
              color: this._levels[e].color,
              horzAlign: 'left',
              vertAlign: 'middle',
            })
            null !== o && p.append(o)
          }
          const f = h.trendline.childs()
          if (f.visible.value()) {
            const e = {
              points: [this._points[0], this._points[1]],
              color: f.color.value(),
              linewidth: f.linewidth.value(),
              linestyle: f.linestyle.value(),
              extendleft: !1,
              extendright: !1,
              leftend: a.LineEnd.Normal,
              rightend: a.LineEnd.Normal,
            }
            this._trendLineRenderer.setData(e),
              p.append(this._trendLineRenderer)
          }
          this.addAnchors(p), (this._renderer = p)
        }
      }
    },
    80724: (e, t, i) => {
      i.r(t), i.d(t, { FibSpeedResistanceFanPaneView: () => _ })
      var n = i(50151),
        r = i(86441),
        s = i(87663),
        o = i(18807),
        a = i(14146),
        l = i(19266),
        d = i(73436),
        h = i(80657),
        c = i(99031),
        u = i(79191),
        p = i(46501)
      class _ extends u.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._numericFormatter = new s.NumericFormatter()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            (this._renderer = null),
            this._source.points().length < 2)
          )
            return
          const e = this._source.priceScale(),
            t = (0, n.ensureNotNull)(this._source.ownerSource()).firstValue()
          if (
            null === t ||
            !e ||
            e.isEmpty() ||
            this._model.timeScale().isEmpty()
          )
            return
          if (this._points.length < 2) return
          const i = this._source.points()[0],
            s = this._source.points()[1],
            u = this._source.properties().childs(),
            _ = u.reverse.value(),
            g = [],
            f = _ ? s.price - i.price : i.price - s.price,
            v = _ ? i.price : s.price
          for (let i = 1; i <= 7; i++) {
            const n = 'hlevel' + i,
              r = this._source.properties().child(n).childs()
            if (!r.visible.value()) continue
            const s = r.coeff.value(),
              o = r.color.value(),
              a = v + s * f,
              l = e.priceToCoordinate(a, t)
            g.push({ coeff: s, color: o, y: l, index: i })
          }
          const x = [],
            m = _ ? s.index - i.index : i.index - s.index,
            w = _ ? i.index : s.index
          for (let e = 1; e <= 7; e++) {
            const t = 'vlevel' + e,
              i = this._source.properties().child(t).childs()
            if (!i.visible.value()) continue
            const n = i.coeff.value(),
              r = i.color.value(),
              s = Math.round(w + n * m),
              o = this._model.timeScale().indexToCoordinate(s)
            x.push({ coeff: n, color: r, x: o, index: e })
          }
          const R = new l.CompositeRenderer(),
            y = this._points[0],
            b = this._points[1],
            T = Math.min(y.x, b.x),
            P = Math.min(y.y, b.y),
            L = Math.max(y.x, b.x),
            C = Math.max(y.y, b.y),
            S = u.grid.childs().color.value(),
            M = u.grid.childs().linewidth.value(),
            I = u.grid.childs().linestyle.value()
          for (let e = 0; e < g.length; e++) {
            const t = new r.Point(T, g[e].y),
              i = new r.Point(L, g[e].y)
            if (u.grid.childs().visible.value()) {
              const e = {
                  points: [t, i],
                  color: S,
                  linewidth: M,
                  linestyle: I,
                  extendleft: !1,
                  extendright: !1,
                  leftend: d.LineEnd.Normal,
                  rightend: d.LineEnd.Normal,
                },
                n = new c.TrendLineRenderer()
              n.setData(e), R.append(n)
            }
            if (u.showLeftLabels.value()) {
              const i = {
                points: [t],
                text: this._numericFormatter.format(g[e].coeff),
                color: g[e].color,
                vertAlign: 'middle',
                horzAlign: 'right',
                font: p.CHART_FONT_FAMILY,
                offsetX: 5,
                offsetY: 0,
                fontsize: 12,
                forceTextAlign: !0,
              }
              R.append(new h.TextRenderer(i))
            }
            if (u.showRightLabels.value()) {
              const t = {
                points: [i],
                text: this._numericFormatter.format(g[e].coeff),
                color: g[e].color,
                vertAlign: 'middle',
                horzAlign: 'left',
                font: p.CHART_FONT_FAMILY,
                offsetX: 5,
                offsetY: 0,
                fontsize: 12,
                forceTextAlign: !0,
              }
              R.append(new h.TextRenderer(t))
            }
          }
          for (let e = 0; e < x.length; e++) {
            const t = new r.Point(x[e].x, P),
              i = new r.Point(x[e].x, C)
            if (u.grid.childs().visible.value()) {
              const e = {
                  points: [t, i],
                  color: S,
                  linewidth: M,
                  linestyle: I,
                  extendleft: !1,
                  extendright: !1,
                  leftend: d.LineEnd.Normal,
                  rightend: d.LineEnd.Normal,
                },
                n = new c.TrendLineRenderer()
              n.setData(e), R.append(n)
            }
            if (u.showTopLabels.value()) {
              const i = {
                points: [t],
                text: this._numericFormatter.format(x[e].coeff),
                color: x[e].color,
                vertAlign: 'bottom',
                horzAlign: 'center',
                font: p.CHART_FONT_FAMILY,
                offsetX: 0,
                offsetY: 5,
                fontsize: 12,
              }
              R.append(new h.TextRenderer(i))
            }
            if (u.showBottomLabels.value()) {
              const t = {
                points: [i],
                text: this._numericFormatter.format(x[e].coeff),
                color: x[e].color,
                vertAlign: 'top',
                horzAlign: 'center',
                font: p.CHART_FONT_FAMILY,
                offsetX: 0,
                offsetY: 5,
                fontsize: 12,
              }
              R.append(new h.TextRenderer(t))
            }
          }
          const A = u.fillBackground.value(),
            k = u.transparency.value()
          for (let e = 0; e < g.length; e++) {
            const t = new r.Point(b.x, g[e].y)
            if (e > 0 && A) {
              const i = {
                  p1: y,
                  p2: t,
                  p3: y,
                  p4: new r.Point(b.x, g[e - 1].y),
                  color: g[e].color,
                  transparency: k,
                  hittestOnBackground: !0,
                  extendLeft: !1,
                },
                n = new a.ChannelRenderer()
              n.setData(i), R.append(n)
            }
            {
              const i = {
                  points: [y, t],
                  color: g[e].color,
                  linewidth: u.linewidth.value(),
                  linestyle: u.linestyle.value(),
                  extendleft: !1,
                  extendright: !0,
                  leftend: d.LineEnd.Normal,
                  rightend: d.LineEnd.Normal,
                },
                n = new c.TrendLineRenderer()
              n.setData(i),
                n.setHitTest(
                  new o.HitTestResult(o.HitTarget.MovePoint, void 0, {
                    type: 'h',
                    index: g[e].index,
                  }),
                ),
                R.append(n)
            }
          }
          for (let e = 0; e < x.length; e++) {
            const t = new r.Point(x[e].x, b.y)
            if (e > 0 && A) {
              const i = {
                  p1: y,
                  p2: t,
                  p3: y,
                  p4: new r.Point(x[e - 1].x, b.y),
                  color: x[e].color,
                  transparency: k,
                  hittestOnBackground: !0,
                  extendLeft: !1,
                },
                n = new a.ChannelRenderer()
              n.setData(i), R.append(n)
            }
            {
              const i = {
                  points: [y, t],
                  color: x[e].color,
                  linewidth: u.linewidth.value(),
                  linestyle: u.linestyle.value(),
                  extendleft: !1,
                  extendright: !0,
                  leftend: d.LineEnd.Normal,
                  rightend: d.LineEnd.Normal,
                },
                n = new c.TrendLineRenderer()
              n.setData(i),
                n.setHitTest(
                  new o.HitTestResult(o.HitTarget.MovePoint, void 0, {
                    type: 'v',
                    index: x[e].index,
                  }),
                ),
                R.append(n)
            }
          }
          this.addAnchors(R), (this._renderer = R)
        }
      }
    },
    47056: (e, t, i) => {
      i.r(t), i.d(t, { FibSpiralPaneView: () => p })
      var n = i(19266),
        r = i(73436),
        s = i(99031),
        o = i(79191),
        a = i(18807),
        l = i(68441),
        d = i(45197),
        h = i(15187)
      const c = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
      class u extends h.MediaCoordinatesPaneRenderer {
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
            s = r.transposed(),
            o = n.normalized()
          let l = Math.acos(r.dotProduct(o))
          Math.asin(s.dotProduct(o)) < 0 && (l = 2 * Math.PI - l)
          const h = this._data.counterclockwise ? -1 : 1,
            c = n.length(),
            u = (0, d.interactionTolerance)().curve
          for (let e = 0; e < 4; e++) {
            const t = (h * l) / (0.5 * Math.PI)
            let n = this._continiusFib(t + 4 * e)
            if (null !== n && ((n = (n * i.length()) / 5), Math.abs(n - c) < u))
              return new a.HitTestResult(a.HitTarget.MovePoint)
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
          const s = r.length()
          r = r.normalized()
          let o = Math.acos(r.x)
          Math.asin(r.y) < 0 && (o = 2 * Math.PI - o),
            t.rotate(o),
            t.scale(s / 5, s / 5),
            (t.lineWidth = this._data.linewidth),
            (0, l.setLineStyle)(t, this._data.linestyle)
          const a = Math.PI / 100
          t.moveTo(0, 0)
          const d = this._data.counterclockwise ? -1 : 1
          for (let e = 0; e < 50 * (c.length - 1); e++) {
            const i = d * e * a,
              n = this._continiusFib(e / 50)
            if (null === n) break
            const r = Math.cos(i) * n,
              s = Math.sin(i) * n
            t.lineTo(r, s)
          }
          t.scale(5 / s, 5 / s), t.rotate(-o), t.stroke()
        }
        _continiusFib(e) {
          const t = Math.floor(e),
            i = Math.ceil(e)
          if (i >= c.length) return null
          let n = e - t
          n = Math.pow(n, 1.15)
          return c[t] + (c[i] - c[t]) * n
        }
      }
      class p extends o.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._trendLineRenderer = new s.TrendLineRenderer()),
            (this._spiralRenderer = new u()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            (this._renderer = null),
            this._points.length < 2)
          )
            return
          const e = new n.CompositeRenderer(),
            t = this._source.properties().childs()
          {
            const i = {
              points: [this._points[0], this._points[1]],
              color: t.linecolor.value(),
              linewidth: t.linewidth.value(),
              linestyle: t.linestyle.value(),
              extendleft: !1,
              extendright: !0,
              leftend: r.LineEnd.Normal,
              rightend: r.LineEnd.Normal,
            }
            this._trendLineRenderer.setData(i),
              e.append(this._trendLineRenderer)
          }
          {
            const i = {
              points: this._points,
              color: t.linecolor.value(),
              linewidth: t.linewidth.value(),
              linestyle: t.linestyle.value(),
              counterclockwise: t.counterclockwise.value(),
            }
            this._spiralRenderer.setData(i), e.append(this._spiralRenderer)
          }
          this.addAnchors(e), (this._renderer = e)
        }
      }
    },
    54498: (e, t, i) => {
      i.r(t), i.d(t, { FibTimeZonePaneView: () => p })
      var n = i(86441),
        r = i(71254),
        s = i(80657),
        o = i(72739),
        a = i(99031),
        l = i(18807),
        d = i(19266),
        h = i(73436),
        c = i(46501),
        u = i(79191)
      class p extends u.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._levels = []),
            (this._trendRenderer = new a.TrendLineRenderer()),
            (this._renderer = new d.CompositeRenderer())
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          var i
          if (
            (super._updateImpl(),
            this._renderer.clear(),
            this._source.points().length < 1)
          )
            return
          const a = this._model.timeScale()
          if (a.isEmpty()) return
          const [d, u] = this._source.points(),
            p = this._source.properties().childs(),
            _ = d.index
          if (null === a.visibleBarsStrictRange()) return
          this._levels = []
          const g = u ? u.index - d.index : 1
          for (let e = 1; e <= 11; e++) {
            const t = p['level' + e].childs()
            if (!t.visible.value()) continue
            const i = Math.round(_ + t.coeff.value() * g),
              n = {
                index: e,
                x: a.indexToCoordinate(i),
                color: t.color.value(),
                width: t.linewidth.value(),
                style: t.linestyle.value(),
                text: String(t.coeff.value()),
              }
            this._levels.push(n)
          }
          if (p.fillBackground.value()) {
            const t = p.transparency.value()
            for (let i = 1; i < this._levels.length; i++) {
              const r = this._levels[i - 1],
                s = {
                  points: [
                    new n.Point(this._levels[i].x, 0),
                    new n.Point(r.x, e),
                  ],
                  color: this._levels[i].color,
                  linewidth: 0,
                  backcolor: this._levels[i].color,
                  fillBackground: !0,
                  transparency: t,
                  extendLeft: !1,
                  extendRight: !1,
                },
                a = new o.RectangleRenderer(void 0, void 0, !0)
              a.setData(s), this._renderer.append(a)
            }
          }
          let f = p.horzLabelsAlign.value()
          f = 'left' === f ? 'right' : 'right' === f ? 'left' : 'center'
          const v = p.vertLabelsAlign.value()
          for (let o = 0; o < this._levels.length; o++) {
            let a
            const d = this._levels[o].color
            if (p.showLabels.value()) {
              let r
              switch (v) {
                case 'top':
                  r = new n.Point(this._levels[o].x, 0)
                  break
                case 'middle':
                  r = new n.Point(this._levels[o].x, 0.5 * e)
                  break
                default:
                  r = new n.Point(this._levels[o].x, e)
              }
              const l = {
                  points: [r],
                  text: this._levels[o].text,
                  color: d,
                  vertAlign: v,
                  horzAlign: f,
                  font: c.CHART_FONT_FAMILY,
                  offsetX: 2,
                  offsetY: 0,
                  fontsize: 12,
                },
                h = new s.TextRenderer(l)
              this._needLabelExclusionPath(h) &&
                (a =
                  null !== (i = (0, s.getTextBoundaries)(h, t, e)) &&
                  void 0 !== i
                    ? i
                    : void 0),
                this._renderer.append(h)
            }
            const h = {
                x: this._levels[o].x,
                color: d,
                linewidth: this._levels[o].width,
                linestyle: this._levels[o].style,
                excludeBoundaries: a,
              },
              u = new l.HitTestResult(
                l.HitTarget.MovePoint,
                void 0,
                this._levels[o].index,
              ),
              _ = new r.VerticalLineRenderer()
            _.setData(h), _.setHitTest(u), this._renderer.append(_)
          }
          if (2 === this._points.length) {
            const e = p.trendline.childs(),
              t = {
                points: [this._points[0], this._points[1]],
                color: e.color.value(),
                linewidth: e.linewidth.value(),
                linestyle: e.linestyle.value(),
                extendleft: !1,
                extendright: !1,
                leftend: h.LineEnd.Normal,
                rightend: h.LineEnd.Normal,
              }
            this._trendRenderer.setData(t),
              this._renderer.append(this._trendRenderer)
          }
          2 === this._source.points().length
            ? this._renderer.append(
                this.createLineAnchor({ points: this._points }, 0),
              )
            : this._points.length > 0 &&
              this._renderer.append(
                this.createLineAnchor(
                  {
                    points: [new n.Point(this._points[0].x, e / 2)],
                    hittestResult: l.HitTarget.MovePoint,
                  },
                  0,
                ),
              )
        }
        _needLabelExclusionPath(e) {
          return (
            'center' ===
            this._source.properties().childs().horzLabelsAlign.value()
          )
        }
      }
    },
    60322: (e, t, i) => {
      i.r(t), i.d(t, { FibWedgePaneView: () => c })
      var n = i(50151),
        r = i(86441),
        s = i(134),
        o = i(99031),
        a = i(18807),
        l = i(19266),
        d = i(81139),
        h = i(73436)
      class c extends s.LineToolPaneViewFibWithLabels {
        constructor() {
          super(...arguments),
            (this._renderer = null),
            (this._levels = []),
            (this._baseTrendRenderer = new o.TrendLineRenderer()),
            (this._edgeTrendRenderer = new o.TrendLineRenderer())
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            (this._renderer = null),
            (this._levels = []),
            this._points.length < 3)
          )
            return void this._updateRenderer()
          const [e, t, i] = this._points,
            s = t.subtract(e).normalized(),
            o = i.subtract(e).normalized(),
            a = new r.Point(1, 0),
            l = new r.Point(0, 1)
          let d = Math.acos(s.dotProduct(a))
          s.dotProduct(l) < 0 && (d = 2 * Math.PI - d)
          let h = Math.acos(o.dotProduct(a))
          if (
            (o.dotProduct(l) < 0 && (h = 2 * Math.PI - h),
            h < d && ([d, h] = [h, d]),
            Math.abs(d - h) > Math.PI)
          ) {
            const e = Math.min(d, h)
            ;(d = Math.max(d, h)), (h = e + 2 * Math.PI)
          }
          const c = this._source.properties()
          for (let i = 1; i <= this._source.levelsCount(); i++) {
            const r = 'level' + i,
              a = (0, n.ensureDefined)(c.child(r))
            if (!a.childs().visible.value()) continue
            const l = a.childs().coeff.value(),
              d = a.childs().color.value(),
              h = Math.abs(t.subtract(e).length() * l),
              u = s.add(o).scaled(0.5).normalized().scaled(h),
              p = e.add(u)
            this._levels.push({
              coeff: l,
              color: d,
              radius: h,
              labelPoint: p,
              p1: e.add(s.scaled(h)),
              p2: e.add(o.scaled(h)),
              linewidth: a.childs().linewidth.value(),
              linestyle: a.childs().linestyle.value(),
              index: i,
            })
          }
          this._points.length < 2 || this._updateRenderer(d, h)
        }
        _updateRenderer(e = Number.NaN, t = Number.NaN) {
          if (this._points.length < 2) return
          const i = new l.CompositeRenderer(),
            n = this._source.properties().childs(),
            [r, s] = this._points,
            o = n.trendline.childs().visible.value()
              ? n.trendline.childs().linewidth.value()
              : 0,
            c = n.trendline.childs().linestyle.value()
          if (
            (this._baseTrendRenderer.setData({
              points: [r, s],
              color: n.trendline.childs().color.value(),
              linewidth: o,
              linestyle: c,
              extendleft: !1,
              extendright: !1,
              leftend: h.LineEnd.Normal,
              rightend: h.LineEnd.Normal,
            }),
            i.append(this._baseTrendRenderer),
            this._points.length < 3)
          )
            return this.addAnchors(i), void (this._renderer = i)
          let u = this._points[2]
          const p = u.data,
            _ = s.subtract(r).length(),
            g = u.subtract(r).normalized()
          ;(u = r.add(g.scaled(_))),
            (u.data = p),
            this._edgeTrendRenderer.setData({
              points: [r, u],
              color: n.trendline.childs().color.value(),
              linewidth: o,
              linestyle: c,
              extendleft: !1,
              extendright: !1,
              leftend: h.LineEnd.Normal,
              rightend: h.LineEnd.Normal,
            }),
            i.append(this._edgeTrendRenderer)
          for (let r = this._levels.length - 1; r >= 0; r--) {
            const s = this._levels[r],
              o = new d.ArcWedgeRenderer()
            o.setData({
              center: this._points[0],
              radius: s.radius,
              prevRadius: r > 0 ? this._levels[r - 1].radius : 0,
              color: s.color,
              linewidth: s.linewidth,
              angle1: e,
              angle2: t,
              p1: s.p1,
              p2: s.p2,
              fillBackground: n.fillBackground.value(),
              transparency: n.transparency.value(),
              color1: '',
              color2: '',
            }),
              o.setHitTest(
                new a.HitTestResult(a.HitTarget.MovePoint, void 0, s.index),
              ),
              i.append(o)
            const l = this._updateLabelForLevel({
              i: r,
              levelIndex: s.index,
              color: s.color,
              leftPoint: s.labelPoint,
              rightPoint: s.labelPoint,
              price: 0,
              horzAlign: 'left',
              vertAlign: 'middle',
            })
            null !== l && i.append(l)
          }
          const f = [r, s]
          this._model.lineBeingCreated() !== this._source && f.push(u),
            i.append(this.createLineAnchor({ points: f }, 0)),
            (this._renderer = i)
        }
      }
    },
    13227: (e, t, i) => {
      i.r(t), i.d(t, { FlagMarkPaneView: () => c })
      var n = i(79191),
        r = i(19266),
        s = i(80101),
        o = i(18807),
        a = i(34026),
        l = i(68441),
        d = i(15187)
      class h extends d.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data) return null
          const { x: t, y: i } = this._data.point
          return e.x < t || e.x > t + 20 || e.y < i - 22 || e.y > i
            ? null
            : new o.HitTestResult(o.HitTarget.MovePoint)
        }
        doesIntersectWithBox(e) {
          return null !== this._data && (0, a.pointInBox)(this._data.point, e)
        }
        _drawImpl(e) {
          if (null === this._data) return
          const t = e.context
          t.translate(
            Math.round(this._data.point.x) - 0.5,
            Math.round(this._data.point.y - 22) - 0.5,
          ),
            (t.fillStyle = '#434651'),
            (0, l.drawRoundRect)(t, 0, 0, 2, 22, 1),
            t.fill(),
            (t.fillStyle = this._data.color),
            t.beginPath(),
            t.moveTo(6.87, 0),
            t.bezierCurveTo(5.62, 0, 4.46, 0.23, 3.32, 0.69),
            t.bezierCurveTo(3.26, 0.71, 3.2, 0.75, 3.15, 0.8),
            t.bezierCurveTo(3.06, 0.89, 3, 1.02, 3, 1.16),
            t.lineTo(3, 1.19),
            t.lineTo(3, 12.5),
            t.bezierCurveTo(3, 12.8, 3.3, 13.02, 3.59, 12.93),
            t.bezierCurveTo(4.61, 12.64, 5.94, 12.44, 6.87, 12.44),
            t.bezierCurveTo(8.5, 12.44, 10.09, 12.83, 11.63, 13.21),
            t.bezierCurveTo(13.19, 13.6, 14.79, 14, 16.45, 14),
            t.bezierCurveTo(17.59, 14, 18.65, 13.81, 19.69, 13.43),
            t.bezierCurveTo(19.88, 13.36, 20, 13.18, 20, 12.98),
            t.lineTo(20, 1.19),
            t.bezierCurveTo(20, 1.06, 19.83, 0.93, 19.66, 0.99),
            t.bezierCurveTo(18.63, 1.38, 17.58, 1.56, 16.45, 1.56),
            t.bezierCurveTo(14.82, 1.56, 13.23, 1.17, 11.69, 0.79),
            t.bezierCurveTo(10.14, 0.4, 8.53, 0, 6.87, 0),
            t.closePath(),
            t.fill()
        }
      }
      class c extends n.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._flagMarkRenderer = new h()),
            (this._renderer = null),
            (this._anchorsOffset = null)
        }
        setAnchors(e) {
          this._anchorsOffset = e
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            (this._renderer = null),
            1 !== this._points.length)
          )
            return
          this._flagMarkRenderer.setData({
            point: this._points[0],
            color: this._getSource().properties().childs().flagColor.value(),
          })
          const e = this._getModel()
          ;(this._renderer = new r.CompositeRenderer()),
            this._renderer.append(this._flagMarkRenderer)
          const t = [
            this._anchorsOffset
              ? this._points[0].add(this._anchorsOffset)
              : this._points[0].clone(),
          ]
          this._renderer.append(
            new s.SelectionRenderer({
              points: t,
              bgColors: this._lineAnchorColors(t),
              visible: this.areAnchorsVisible(),
              barSpacing: e.timeScale().barSpacing(),
              hittestResult: o.HitTarget.MovePoint,
            }),
          )
        }
      }
    },
    85377: (e, t, i) => {
      i.r(t), i.d(t, { FlatBottomPaneView: () => u })
      var n = i(50151),
        r = i(86441),
        s = i(49483),
        o = i(23966),
        a = i(99031),
        l = i(80657),
        d = i(19266),
        h = i(46501),
        c = i(33295)
      class u extends c.AlertableLineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._trendLineRendererPoints12 = new a.TrendLineRenderer()),
            (this._trendLineRendererPoints43 = new a.TrendLineRenderer()),
            (this._disjointChannelRenderer = new o.DisjointChannelRenderer()),
            (this._p1LabelRenderer = new l.TextRenderer()),
            (this._p2LabelRenderer = new l.TextRenderer()),
            (this._p3LabelRenderer = new l.TextRenderer()),
            (this._p4LabelRenderer = new l.TextRenderer()),
            (this._labelTextRenderer = new l.TextRenderer()),
            (this._renderer = new d.CompositeRenderer())
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          var e
          if (
            (super._updateImpl(),
            this._renderer.clear(),
            this._source.points().length < 2)
          )
            return
          const t = this._source.priceScale(),
            i =
              null === (e = this._source.ownerSource()) || void 0 === e
                ? void 0
                : e.firstValue()
          if (!t || null == i) return
          const [o, a] = this._source.points(),
            l = t.formatPrice(o.price, i),
            d = t.formatPrice(a.price, i)
          let c
          if (3 === this._source.points().length) {
            const e = this._source.points()[2]
            c = t.formatPrice(e.price, i)
          }
          if (this._points.length < 2) return
          const [u, p] = this._points
          let _, g
          const f = this._source.properties().childs()
          if (3 === this._points.length) {
            if (
              ((_ = (0, r.point)(p.x, this._points[2].y)),
              (_.data = 2),
              (g = (0, r.point)(u.x, _.y)),
              (g.data = 3),
              f.fillBackground.value())
            ) {
              const e = f.extendLeft.value(),
                t = f.extendRight.value()
              this._disjointChannelRenderer.setData({
                extendleft: e,
                extendright: t,
                points: [u, p, _, g],
                backcolor: f.backgroundColor.value(),
                transparency: f.transparency.value(),
                hittestOnBackground: s.CheckMobile.any(),
              }),
                this._renderer.append(this._disjointChannelRenderer)
            }
            f.labelVisible.value() &&
              f.labelText.value() &&
              this._renderer.append(this._getLabelTextRenderer(u, p, g, _))
          }
          const v = (e, t) => ({
            points: [e, t],
            color: f.linecolor.value(),
            linewidth: f.linewidth.value(),
            linestyle: f.linestyle.value(),
            extendleft: f.extendLeft.value(),
            extendright: f.extendRight.value(),
            leftend: f.leftEnd.value(),
            rightend: f.rightEnd.value(),
          })
          if (
            (this._trendLineRendererPoints12.setData(v(u, p)),
            this._renderer.append(this._trendLineRendererPoints12),
            2 === this._points.length)
          )
            return void this.addAnchors(this._renderer)
          const x = (e, t, i, n, r, s) => {
            f.showPrices.value() &&
              (e.setData({
                points: [i],
                text: r,
                color: f.textcolor.value(),
                horzAlign: i.x > n.x ? 'left' : 'right',
                vertAlign: 'middle',
                font: h.CHART_FONT_FAMILY,
                offsetX: 6,
                offsetY: 0,
                boxPadding: 0,
                bold: f.bold.value(),
                italic: f.italic.value(),
                fontsize: f.fontsize.value(),
                forceTextAlign: !0,
              }),
              this._renderer.append(e),
              t.setData({
                points: [n],
                text: s,
                color: f.textcolor.value(),
                horzAlign: i.x < n.x ? 'left' : 'right',
                vertAlign: 'middle',
                font: h.CHART_FONT_FAMILY,
                offsetX: 6,
                offsetY: 0,
                boxPadding: 0,
                bold: f.bold.value(),
                italic: f.italic.value(),
                fontsize: f.fontsize.value(),
                forceTextAlign: !0,
              }),
              this._renderer.append(t))
          }
          if (
            (x(this._p1LabelRenderer, this._p2LabelRenderer, u, p, l, d),
            !_ || !g)
          )
            return void this.addAnchors(this._renderer)
          this._trendLineRendererPoints43.setData(v(g, _)),
            this._renderer.append(this._trendLineRendererPoints43),
            x(
              this._p3LabelRenderer,
              this._p4LabelRenderer,
              _,
              g,
              (0, n.ensureDefined)(c),
              (0, n.ensureDefined)(c),
            )
          const m = [u, p, _, g]
          this._model.lineBeingCreated() === this._source && m.pop(),
            this._renderer.append(this.createLineAnchor({ points: m }, 0)),
            u && p && this._addAlertRenderer(this._renderer, [u, p])
        }
        _getLabelTextRenderer(e, t, i, n) {
          const r = this._source.properties().childs()
          let s, o
          const a = r.labelFontSize.value() / 3
          let l = 0
          switch (r.labelVertAlign.value()) {
            case 'bottom':
              e.y < i.y ? ((s = e), (o = t)) : ((s = i), (o = n))
              break
            case 'top':
              e.y > i.y ? ((s = e), (o = t)) : ((s = i), (o = n))
              break
            case 'middle':
              ;(s = e.add(i).scaled(0.5)), (o = t.add(n).scaled(0.5)), (l = a)
          }
          const d = s.x < o.x ? s : o,
            c = d === s ? o : s
          let u
          switch (r.labelHorzAlign.value()) {
            case 'left':
              u = d
              break
            case 'right':
              u = c
              break
            default:
              u = d.add(c).scaled(0.5)
          }
          return (
            this._labelTextRenderer.setData({
              points: [u],
              color: r.labelTextColor.value(),
              fontSize: r.labelFontSize.value(),
              text: r.labelText.value(),
              font: h.CHART_FONT_FAMILY,
              bold: r.labelBold.value(),
              italic: r.labelItalic.value(),
              vertAlign: r.labelVertAlign.value(),
              horzAlign: r.labelHorzAlign.value(),
              offsetX: 0,
              offsetY: 0,
              boxPaddingVert: a,
              boxPaddingHorz: l,
              forceTextAlign: !0,
              angle: Math.atan((d.y - c.y) / (d.x - c.x)),
            }),
            this._labelTextRenderer
          )
        }
      }
    },
    27271: (e, t, i) => {
      i.d(t, { GannArcRenderer: () => a })
      var n = i(86441),
        r = i(87095),
        s = i(18807),
        o = i(15187)
      class a extends o.MediaCoordinatesPaneRenderer {
        constructor() {
          super(), (this._data = null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data) return null
          e = e.subtract(this._data.center)
          const t = this._data.edge.subtract(this._data.center),
            i = t.y / t.x
          e = new n.Point(e.x, e.y / i)
          let r = this._data.point.subtract(this._data.center)
          r = new n.Point(r.x, r.y / i)
          const o = r.length(),
            a = e.length()
          let l = this._data.prevPoint.subtract(this._data.center)
          l = new n.Point(l.x, l.y / i)
          const d = l.length()
          return Math.abs(a - o) < 5 && t.x * e.x >= 0 && t.y * e.y >= 0
            ? new s.HitTestResult(s.HitTarget.MovePoint)
            : this._data.fillBack &&
                a >= d &&
                a <= o &&
                t.x * e.x >= 0 &&
                t.y * e.y >= 0
              ? new s.HitTestResult(s.HitTarget.MovePointBackground)
              : null
        }
        _drawImpl(e) {
          if (null === this._data) return
          const t = e.context
          ;(t.lineCap = 'butt'),
            (t.strokeStyle = this._data.color),
            (t.lineWidth = this._data.linewidth),
            t.translate(this._data.center.x, this._data.center.y)
          const i = this._data.edge.subtract(this._data.center),
            s = i.y / i.x
          let o = this._data.point.subtract(this._data.center)
          o = new n.Point(o.x, o.y / s)
          let a = o.length(),
            l = this._data.prevPoint.subtract(this._data.center)
          l = new n.Point(l.x, l.y / s)
          let d = l.length()
          t.scale(1, s)
          const h = Math.abs(this._data.edge.x - this._data.center.x)
          if (Math.abs(a) > h) {
            const e = Math.sign(this._data.edge.x - this._data.center.x) * h
            t.rect(0, 0, e, e), t.clip()
          }
          this._data.fillBack &&
            (this._data.point.x < this._data.center.x && ((a = -a), (d = -d)),
            t.beginPath(),
            t.moveTo(d, 0),
            t.lineTo(a, 0),
            t.arcTo(a, a, 0, a, Math.abs(a)),
            t.lineTo(0, d),
            t.arcTo(d, d, d, 0, Math.abs(d)),
            (t.fillStyle = (0, r.generateColor)(
              this._data.color,
              this._data.transparency,
              !0,
            )),
            t.fill()),
            t.beginPath(),
            this._data.point.x > this._data.center.x
              ? t.arc(0, 0, Math.abs(a), 0, Math.PI / 2, !1)
              : t.arc(0, 0, Math.abs(a), -Math.PI / 2, -Math.PI, !0),
            t.scale(1, 1 / s),
            t.stroke()
        }
      }
    },
    99631: (e, t, i) => {
      i.r(t), i.d(t, { GannComplexPaneView: () => u })
      var n = i(86441),
        r = i(79191),
        s = i(99031),
        o = i(80657),
        a = i(19266),
        l = i(73436),
        d = i(79849),
        h = i(27271),
        c = i(38223)
      class u extends r.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._verticalLevelsRenderers = []),
            (this._horizontalLevelsRenderers = []),
            (this._fanRenderers = []),
            (this._arcRenderers = []),
            (this._priceDiffTextRenderer = new o.TextRenderer()),
            (this._indexDiffTextRenderer = new o.TextRenderer()),
            (this._ratioTextRenderer = new o.TextRenderer()),
            (this._renderer = null),
            this._initRenderers()
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          super._updateImpl(), (this._renderer = null)
          const e = new a.CompositeRenderer(),
            t = this._getPoints()
          if (t.length < 2) return this.addAnchors(e), void (this._renderer = e)
          let [i, n] = t
          const r = this._getSource(),
            s = r.isReversed()
          s && ([n, i] = t)
          const o = n.x - i.x,
            l = n.y - i.y,
            d = i,
            h = n,
            c = this._getModel(),
            u = {
              barsCoordsRange: o,
              priceCoordsRange: l,
              startPoint: d,
              endPoint: h,
              p1: i,
              p2: n,
              isLabelsVisible: r.isLabelsVisible(),
              reversed: s,
            }
          this._prepareLevels(e, u),
            this._prepareFanLines(e, u),
            this._prepareArcs(e, u),
            this._prepareLabels(e, u)
          const p = [i, n]
          c.lineBeingCreated() === r && p.pop(),
            e.append(this.createLineAnchor({ points: p }, 0)),
            (this._renderer = e)
        }
        _initRenderers() {
          const e = this._getSource(),
            t = e.levelsCount()
          for (let e = 0; e < t; e++)
            this._verticalLevelsRenderers.push(new s.TrendLineRenderer()),
              this._horizontalLevelsRenderers.push(new s.TrendLineRenderer())
          const i = e.fanLinesCount()
          for (let e = 0; e < i; e++)
            this._fanRenderers.push(new s.TrendLineRenderer())
          const n = e.arcsCount()
          for (let e = 0; e < n; e++)
            this._arcRenderers.push(new h.GannArcRenderer())
        }
        _prepareLevels(e, t) {
          const {
              startPoint: i,
              endPoint: r,
              barsCoordsRange: s,
              priceCoordsRange: o,
            } = t,
            a = this._getSource().levels()
          for (const t of a) {
            if (!t.visible) continue
            const a = t.index / 5,
              h = i.x + a * s,
              c = {
                points: [new n.Point(h, i.y), new n.Point(h, r.y)],
                color: t.color,
                linewidth: t.width,
                linestyle: d.LINESTYLE_SOLID,
                extendleft: !1,
                extendright: !1,
                leftend: l.LineEnd.Normal,
                rightend: l.LineEnd.Normal,
              },
              u = this._verticalLevelsRenderers[t.index]
            u.setData(c), e.append(u)
            const p = i.y + a * o,
              _ = {
                points: [new n.Point(i.x, p), new n.Point(r.x, p)],
                color: t.color,
                linewidth: t.width,
                linestyle: d.LINESTYLE_SOLID,
                extendleft: !1,
                extendright: !1,
                leftend: l.LineEnd.Normal,
                rightend: l.LineEnd.Normal,
              },
              g = this._horizontalLevelsRenderers[t.index]
            g.setData(_), e.append(g)
          }
        }
        _prepareFanLines(e, t) {
          const {
              p1: i,
              startPoint: r,
              endPoint: s,
              barsCoordsRange: o,
              priceCoordsRange: a,
            } = t,
            h = this._getSource().fanLines()
          for (const t of h) {
            if (!t.visible) continue
            const h = t.x,
              c = t.y
            let u, p
            if (h > c) {
              u = s.x
              const e = c / h
              p = r.y + e * a
            } else {
              p = s.y
              const e = h / c
              u = r.x + e * o
            }
            const _ = {
                points: [i, new n.Point(u, p)],
                color: t.color,
                linewidth: t.width,
                linestyle: d.LINESTYLE_SOLID,
                extendleft: !1,
                extendright: !1,
                leftend: l.LineEnd.Normal,
                rightend: l.LineEnd.Normal,
              },
              g = this._fanRenderers[t.index]
            g.setData(_), e.append(g)
          }
        }
        _prepareArcs(e, t) {
          const {
            p1: i,
            startPoint: r,
            endPoint: s,
            barsCoordsRange: o,
            priceCoordsRange: a,
          } = t
          let l = i
          const d = this._getSource(),
            h = d.isArcsBackgroundFilled(),
            c = d.arcsBackgroundTransparency(),
            u = d.arcs()
          for (const t of u) {
            if (!t.visible) continue
            const i = t.x / 5,
              d = t.y / 5,
              u = r.x + i * o,
              p = r.y + d * a,
              _ = {
                center: r,
                point: new n.Point(u, p),
                edge: s,
                color: t.color,
                linewidth: t.width,
                fillBack: h,
                transparency: c,
                prevPoint: l,
              },
              g = this._arcRenderers[t.index]
            g.setData(_), e.append(g), (l = _.point)
          }
        }
        _prepareLabels(e, t) {
          const { p1: i, p2: r, isLabelsVisible: s, reversed: o } = t
          if (!s) return
          const a = this._getSource(),
            l = a.ownerSource()
          let d = a.getPriceDiff(),
            h = a.getIndexDiff()
          if (null === d || null === h || null === l) return
          o && ((d = -d), (h = -h))
          const u = new n.Point(i.x, r.y),
            p = (0, c.forceLTRStr)(l.formatter().format(d)),
            _ = this._getLabelData(u, p)
          ;(_.horzAlign = h > 0 ? 'right' : 'left'),
            (_.vertAlign = d > 0 ? 'bottom' : 'top'),
            (_.offsetX = 10),
            (_.offsetY = d > 0 ? 8 : 10),
            (_.forceTextAlign = !0),
            this._priceDiffTextRenderer.setData(_),
            e.append(this._priceDiffTextRenderer)
          const g = new n.Point(r.x, i.y),
            f = (0, c.forceLTRStr)(h.toString()),
            v = this._getLabelData(g, f)
          ;(v.horzAlign = h > 0 ? 'left' : 'right'),
            (v.vertAlign = d > 0 ? 'top' : 'bottom'),
            (v.offsetX = 10),
            (v.offsetY = d > 0 ? 10 : 8),
            (v.forceTextAlign = !0),
            this._indexDiffTextRenderer.setData(v),
            e.append(this._indexDiffTextRenderer)
          const x = a.getScaleRatio()
          if (null === x) return
          const m = a.getScaleRatioFormatter(),
            w = (0, c.forceLTRStr)(m.format(x)),
            R = this._getLabelData(r, w)
          ;(R.horzAlign = h > 0 ? 'left' : 'right'),
            (R.vertAlign = d > 0 ? 'bottom' : 'top'),
            (R.offsetX = 10),
            (R.offsetY = d > 0 ? 8 : 10),
            (R.forceTextAlign = !0),
            this._ratioTextRenderer.setData(R),
            e.append(this._ratioTextRenderer)
        }
        _getLabelData(e, t) {
          const i = this._getSource(),
            {
              textColor: n,
              font: r,
              fontSize: s,
              bold: o,
              italic: a,
            } = i.getLabelsStyle()
          return {
            points: [e],
            backgroundColor: 'transparent',
            text: t,
            font: r,
            bold: o,
            italic: a,
            fontsize: s,
            color: n,
            vertAlign: 'top',
            horzAlign: 'center',
            offsetX: 0,
            offsetY: 0,
            backgroundRoundRect: 4,
          }
        }
      }
    },
    25438: (e, t, i) => {
      i.r(t), i.d(t, { GannFanPaneView: () => u })
      var n = i(86441),
        r = i(18807),
        s = i(14146),
        o = i(19266),
        a = i(73436),
        l = i(80657),
        d = i(99031),
        h = i(79191),
        c = i(46501)
      class u extends h.LineSourcePaneView {
        constructor() {
          super(...arguments), (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            (this._renderer = null),
            this._source.points().length < 2)
          )
            return
          const e = this._source.priceScale()
          if (!e || e.isEmpty() || this._model.timeScale().isEmpty()) return
          if (this._points.length < 2) return
          const t = this._points[0],
            i = this._points[1],
            h = [],
            u = i.x - t.x,
            p = i.y - t.y,
            _ = this._source.properties().childs()
          for (let e = 1; e <= 9; e++) {
            const n = 'level' + e,
              r = this._source.properties().child(n).childs()
            if (!r.visible.value()) continue
            const s = r.coeff1.value(),
              o = r.coeff2.value(),
              a = s / o,
              l = r.color.value(),
              d = s + '/' + o
            let c, _
            s > o
              ? ((c = i.x), (_ = t.y + p / a))
              : ((c = t.x + u * a), (_ = i.y)),
              h.push({
                label: d,
                color: l,
                x: c,
                y: _,
                linewidth: r.linewidth.value(),
                linestyle: r.linestyle.value(),
                index: e,
              })
          }
          const g = new o.CompositeRenderer(),
            f = _.fillBackground.value(),
            v = _.transparency.value()
          for (let e = 0; e < h.length; e++) {
            const i = new n.Point(h[e].x, h[e].y)
            if (f)
              if (h[e].index < 4) {
                const r = {
                    p1: t,
                    p2: i,
                    p3: t,
                    p4: new n.Point(h[e + 1].x, h[e + 1].y),
                    color: h[e].color,
                    transparency: v,
                    hittestOnBackground: !0,
                    extendLeft: !1,
                  },
                  o = new s.ChannelRenderer()
                o.setData(r), g.append(o)
              } else if (h[e].index > 4 && e > 0) {
                const r = {
                    p1: t,
                    p2: i,
                    p3: t,
                    p4: new n.Point(h[e - 1].x, h[e - 1].y),
                    color: h[e].color,
                    transparency: v,
                    hittestOnBackground: !0,
                    extendLeft: !1,
                  },
                  o = new s.ChannelRenderer()
                o.setData(r), g.append(o)
              }
            {
              const n = {
                  points: [t, i],
                  color: h[e].color,
                  linewidth: h[e].linewidth,
                  linestyle: h[e].linestyle,
                  extendleft: !1,
                  extendright: !0,
                  leftend: a.LineEnd.Normal,
                  rightend: a.LineEnd.Normal,
                },
                s = new d.TrendLineRenderer()
              s.setData(n),
                s.setHitTest(
                  new r.HitTestResult(
                    r.HitTarget.MovePoint,
                    void 0,
                    h[e].index,
                  ),
                ),
                g.append(s)
            }
            if (_.showLabels.value()) {
              const t = {
                points: [i],
                text: h[e].label,
                color: h[e].color,
                vertAlign: 'middle',
                horzAlign: 'left',
                font: c.CHART_FONT_FAMILY,
                offsetX: 0,
                offsetY: 5,
                fontsize: 12,
              }
              g.append(new l.TextRenderer(t))
            }
          }
          this.addAnchors(g), (this._renderer = g)
        }
      }
    },
    57583: (e, t, i) => {
      i.r(t), i.d(t, { GannFixedPaneView: () => h })
      var n = i(86441),
        r = i(79191),
        s = i(99031),
        o = i(19266),
        a = i(73436),
        l = i(79849),
        d = i(27271)
      class h extends r.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._verticalLevelsRenderers = []),
            (this._horizontalLevelsRenderers = []),
            (this._fanRenderers = []),
            (this._arcRenderers = []),
            (this._renderer = null),
            this._initRenderers()
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          super._updateImpl(), (this._renderer = null)
          const e = this._getSource(),
            t = this._getPoints(),
            i = e.getScreenPoints()
          if (t.length < 2 || i.length < 2) return
          const [n, r] = i
          ;(t[1] = n), (t[1].data = 1), (t[2] = r)
          const s = this._getPoints(),
            a = new o.CompositeRenderer()
          if (s.length < 2) return this.addAnchors(a), void (this._renderer = a)
          const l = s[0],
            d = 3 === s.length ? s[2] : s[1],
            h = d.x - l.x,
            c = d.y - l.y,
            u = l,
            p = d,
            _ = this._getModel(),
            g = {
              barsCoordsRange: h,
              priceCoordsRange: c,
              startPoint: u,
              endPoint: p,
              p1: l,
              p2: d,
            }
          this._prepareLevels(a, g),
            this._prepareFanLines(a, g),
            this._prepareArcs(a, g)
          const f = [l, s[1]]
          _.lineBeingCreated() === e && f.pop(),
            a.append(this.createLineAnchor({ points: f }, 0)),
            (this._renderer = a)
        }
        _initRenderers() {
          const e = this._getSource(),
            t = e.levelsCount()
          for (let e = 0; e < t; e++)
            this._verticalLevelsRenderers.push(new s.TrendLineRenderer()),
              this._horizontalLevelsRenderers.push(new s.TrendLineRenderer())
          const i = e.fanLinesCount()
          for (let e = 0; e < i; e++)
            this._fanRenderers.push(new s.TrendLineRenderer())
          const n = e.arcsCount()
          for (let e = 0; e < n; e++)
            this._arcRenderers.push(new d.GannArcRenderer())
        }
        _prepareLevels(e, t) {
          const {
              startPoint: i,
              endPoint: r,
              barsCoordsRange: s,
              priceCoordsRange: o,
            } = t,
            d = this._getSource().levels()
          for (const t of d) {
            if (!t.visible) continue
            const d = t.index / 5,
              h = i.x + d * s,
              c = {
                points: [new n.Point(h, i.y), new n.Point(h, r.y)],
                color: t.color,
                linewidth: t.width,
                linestyle: l.LINESTYLE_SOLID,
                extendleft: !1,
                extendright: !1,
                leftend: a.LineEnd.Normal,
                rightend: a.LineEnd.Normal,
              },
              u = this._verticalLevelsRenderers[t.index]
            u.setData(c), e.append(u)
            const p = i.y + d * o,
              _ = {
                points: [new n.Point(i.x, p), new n.Point(r.x, p)],
                color: t.color,
                linewidth: t.width,
                linestyle: l.LINESTYLE_SOLID,
                extendleft: !1,
                extendright: !1,
                leftend: a.LineEnd.Normal,
                rightend: a.LineEnd.Normal,
              },
              g = this._horizontalLevelsRenderers[t.index]
            g.setData(_), e.append(g)
          }
        }
        _prepareFanLines(e, t) {
          const {
              p1: i,
              startPoint: r,
              endPoint: s,
              barsCoordsRange: o,
              priceCoordsRange: d,
            } = t,
            h = this._getSource().fanLines()
          for (const t of h) {
            if (!t.visible) continue
            const h = t.x,
              c = t.y
            let u, p
            if (h > c) {
              u = s.x
              const e = c / h
              p = r.y + e * d
            } else {
              p = s.y
              const e = h / c
              u = r.x + e * o
            }
            const _ = {
                points: [i, new n.Point(u, p)],
                color: t.color,
                linewidth: t.width,
                linestyle: l.LINESTYLE_SOLID,
                extendleft: !1,
                extendright: !1,
                leftend: a.LineEnd.Normal,
                rightend: a.LineEnd.Normal,
              },
              g = this._fanRenderers[t.index]
            g.setData(_), e.append(g)
          }
        }
        _prepareArcs(e, t) {
          const {
            p1: i,
            startPoint: r,
            endPoint: s,
            barsCoordsRange: o,
            priceCoordsRange: a,
          } = t
          let l = i
          const d = this._getSource(),
            h = d.isArcsBackgroundFilled(),
            c = d.arcsBackgroundTransparency(),
            u = d.arcs()
          for (const t of u) {
            if (!t.visible) continue
            const i = t.x / 5,
              d = t.y / 5,
              u = r.x + i * o,
              p = r.y + d * a,
              _ = {
                center: r,
                point: new n.Point(u, p),
                edge: s,
                color: t.color,
                linewidth: t.width,
                fillBack: h,
                transparency: c,
                prevPoint: l,
              },
              g = this._arcRenderers[t.index]
            g.setData(_), e.append(g), (l = _.point)
          }
        }
      }
    },
    97449: (e, t, i) => {
      var n = i(86441).Point,
        r = i(79191).LineSourcePaneView,
        s = i(80657).TextRenderer,
        o = i(72739).RectangleRenderer,
        a = i(99031).TrendLineRenderer,
        l = i(19266).CompositeRenderer,
        d = i(87663).NumericFormatter,
        h = i(73436).LineEnd,
        c = i(46501)
      t.GannSquarePaneView = class extends r {
        constructor(e, t) {
          super(e, t),
            (this._numericFormatter = new d()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            (this._renderer = null),
            !(this._source.points().length < 2) &&
              this._source.priceScale() &&
              !this._source.priceScale().isEmpty() &&
              !this._model.timeScale().isEmpty())
          ) {
            var e = this._source.points()[0],
              t = this._source.points()[1],
              i = (S = this._source.properties()).reverse && S.reverse.value()
            this._hlevels = []
            for (
              var r = i ? e.price - t.price : t.price - e.price,
                d = i ? t.price : e.price,
                u = this._source.ownerSource().firstValue(),
                p = 1;
              p <= 7;
              p++
            ) {
              if ((w = S['hlevel' + p]).visible.value()) {
                var _ = w.coeff.value(),
                  g = w.color.value(),
                  f = d + _ * r,
                  v = this._source.priceScale().priceToCoordinate(f, u)
                this._hlevels.push({ coeff: _, color: g, y: v })
              }
            }
            this._vlevels = []
            var x = i ? e.index - t.index : t.index - e.index,
              m = i ? t.index : e.index
            for (p = 1; p <= 7; p++) {
              var w
              if ((w = S['vlevel' + p]).visible.value()) {
                ;(_ = w.coeff.value()), (g = w.color.value())
                var R = Math.round(m + _ * x),
                  y = this._model.timeScale().indexToCoordinate(R)
                this._vlevels.push({ coeff: _, color: g, x: y })
              }
            }
            if (
              ((this._hfans = []), (this._vfans = []), S.fans.visible.value())
            )
              for (p = 1; p <= 7; p++) {
                ;(R = Math.round(m + S['hlevel' + p].coeff.value() * x)),
                  (f = d + S['vlevel' + p].coeff.value() * r)
                this._hfans.push(this._model.timeScale().indexToCoordinate(R)),
                  this._vfans.push(
                    this._source.priceScale().priceToCoordinate(f, u),
                  )
              }
            var b = new l()
            if (this._points.length < 2)
              return this.addAnchors(b), void (this._renderer = b)
            ;(e = this._points[0]), (t = this._points[1])
            var T = Math.min(e.x, t.x),
              P = Math.min(e.y, t.y),
              L = Math.max(e.x, t.x),
              C = Math.max(e.y, t.y),
              S = this._source.properties(),
              M = this._source.properties().fillHorzBackground.value(),
              I = this._source.properties().horzTransparency.value(),
              A = this._source.properties().fillVertBackground.value(),
              k = this._source.properties().vertTransparency.value()
            for (p = 0; p < this._hlevels.length; p++) {
              if (p > 0 && M) {
                var N = this._hlevels[p - 1]
                ;(e = new n(T, this._hlevels[p].y)), (t = new n(L, N.y))
                ;((E = {}).points = [e, t]),
                  (E.color = this._hlevels[p].color),
                  (E.linewidth = 0),
                  (E.backcolor = this._hlevels[p].color),
                  (E.fillBackground = !0),
                  (E.transparency = I),
                  (E.extendLeft = !1),
                  (E.extendRight = !1),
                  (V = new o(void 0, void 0, !0)).setData(E),
                  b.append(V)
              }
              var D = {
                points: [
                  (e = new n(T, this._hlevels[p].y)),
                  (t = new n(L, this._hlevels[p].y)),
                ],
                width: this._model.timeScale().width(),
                height: this._source.priceScale().height(),
                color: this._hlevels[p].color,
                linewidth: S.linewidth.value(),
                linestyle: S.linestyle.value(),
                extendleft: !1,
                extendright: !1,
                leftend: h.Normal,
                rightend: h.Normal,
              }
              if (
                ((V = new a()).setData(D),
                b.append(V),
                S.showLeftLabels.value())
              ) {
                var B = {
                  points: [e],
                  text: this._numericFormatter.format(this._hlevels[p].coeff),
                  color: this._hlevels[p].color,
                  vertAlign: 'middle',
                  horzAlign: 'right',
                  font: c.CHART_FONT_FAMILY,
                  offsetX: 5,
                  offsetY: 0,
                  fontsize: 12,
                  forceTextAlign: !0,
                }
                b.append(new s(B))
              }
              if (S.showRightLabels.value()) {
                var z = {
                  points: [t],
                  text: this._numericFormatter.format(this._hlevels[p].coeff),
                  color: this._hlevels[p].color,
                  vertAlign: 'middle',
                  horzAlign: 'left',
                  font: c.CHART_FONT_FAMILY,
                  offsetX: 5,
                  offsetY: 0,
                  fontsize: 12,
                }
                b.append(new s(z))
              }
            }
            for (p = 0; p < this._vlevels.length; p++) {
              ;(e = new n(this._vlevels[p].x, P)),
                (t = new n(this._vlevels[p].x, C))
              if (p > 0 && A) {
                N = this._vlevels[p - 1]
                var E,
                  H = new n(N.x, P)
                ;((E = {}).points = [H, t]),
                  (E.color = this._vlevels[p].color),
                  (E.linewidth = 0),
                  (E.backcolor = this._vlevels[p].color),
                  (E.fillBackground = !0),
                  (E.transparency = k),
                  (E.extendLeft = !1),
                  (E.extendRight = !1),
                  (V = new o(void 0, void 0, !0)).setData(E),
                  b.append(V)
              }
              var V
              D = {
                points: [e, t],
                width: this._model.timeScale().width(),
                height: this._source.priceScale().height(),
                color: this._vlevels[p].color,
                linewidth: S.linewidth.value(),
                linestyle: S.linestyle.value(),
                extendleft: !1,
                extendright: !1,
                leftend: h.Normal,
                rightend: h.Normal,
              }
              if (
                ((V = new a()).setData(D), b.append(V), S.showTopLabels.value())
              ) {
                var O = {
                  points: [e],
                  text: this._numericFormatter.format(this._vlevels[p].coeff),
                  color: this._vlevels[p].color,
                  vertAlign: 'bottom',
                  horzAlign: 'center',
                  font: c.CHART_FONT_FAMILY,
                  offsetX: 0,
                  offsetY: 3,
                  fontsize: 12,
                }
                b.append(new s(O))
              }
              if (S.showBottomLabels.value()) {
                var W = {
                  points: [t],
                  text: this._numericFormatter.format(this._vlevels[p].coeff),
                  color: this._vlevels[p].color,
                  vertAlign: 'top',
                  horzAlign: 'center',
                  font: c.CHART_FONT_FAMILY,
                  offsetX: 0,
                  offsetY: 5,
                  fontsize: 12,
                }
                b.append(new s(W))
              }
            }
            var F = this
            U(b, this._hfans, !0), U(b, this._vfans, !1)
            var Y = new n(this._points[0].x, this._points[1].y)
            Y.data = 2
            var j = new n(this._points[1].x, this._points[0].y)
            ;(j.data = 3),
              b.append(
                this.createLineAnchor({ points: [...this._points, Y, j] }, 0),
              ),
              (this._renderer = b)
          }
          function U(e, t, i) {
            var r = new n(T, P),
              s = new n(L, P),
              o = new n(T, C),
              l = new n(L, C),
              d = {
                width: F._model.timeScale().width(),
                height: F._source.priceScale().height(),
                color: S.fans.color.value(),
                linewidth: S.linewidth.value(),
                linestyle: S.linestyle.value(),
                extendleft: !1,
                extendright: !1,
                leftend: h.Normal,
                rightend: h.Normal,
              }
            function c(t) {
              var i = new a()
              i.setData(Object.assign({}, d, { points: t })), e.append(i)
            }
            for (var u = 0; u < t.length; ++u) {
              var p = i ? C : t[u],
                _ = i ? P : t[u],
                g = i ? t[u] : T,
                f = i ? t[u] : L,
                v = new n(f, p),
                x = new n(g, p),
                m = new n(f, _),
                w = new n(g, _)
              c([o, m]), c([l, w]), c([r, v]), c([s, x])
            }
          }
        }
      }
    },
    55715: (e, t, i) => {
      i.r(t), i.d(t, { GhostFeedPaneView: () => _ })
      var n = i(33013),
        r = i(79849),
        s = i(1722),
        o = i(18807),
        a = i(19266),
        l = i(45197),
        d = i(73436),
        h = i(99031),
        c = i(836),
        u = i(79191)
      const p = n.colorsPalette['color-cold-gray-500']
      class _ extends u.LineSourcePaneView {
        constructor() {
          super(...arguments), (this._renderer = null), (this._segments = [])
        }
        renderer() {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          var e, t
          super._updateImpl(), (this._renderer = null), (this._segments = [])
          const i = this._source.priceScale(),
            n =
              null !==
                (t =
                  null === (e = this._source.ownerSource()) || void 0 === e
                    ? void 0
                    : e.firstValue()) && void 0 !== t
                ? t
                : null
          if (
            this._points.length < 2 ||
            null === i ||
            i.isEmpty() ||
            null === n
          )
            return
          const u = this._source.points(),
            _ = this._source.properties().childs(),
            g = _.candleStyle.childs()
          this._segments = this._source
            .segments()
            .map((e, t) => {
              if (t >= this._points.length - 1) return null
              const r = this._points[t].x,
                s = u[t].price,
                o = u[t + 1].price,
                a = i.priceToCoordinate(s, n),
                l = i.priceToCoordinate(o, n),
                d = u[t + 1].index - u[t].index,
                h = this._model.timeScale().barSpacing() * Math.sign(d),
                c = (l - a) / (e.bars().length - 1),
                p = g.upColor.value(),
                _ = g.downColor.value(),
                f = g.borderUpColor.value(),
                v = g.borderDownColor.value()
              return {
                bars: e.bars().map((e, t) => {
                  const s = a + t * c,
                    o = i.coordinateToPrice(s, n),
                    l = e.c >= e.o
                  return {
                    time: r + t * h,
                    exactTime: r + t * h,
                    open: i.priceToCoordinate(o + e.o, n),
                    high: i.priceToCoordinate(o + e.h, n),
                    low: i.priceToCoordinate(o + e.l, n),
                    close: i.priceToCoordinate(o + e.c, n),
                    color: l ? p : _,
                    borderColor: l ? f : v,
                    hollow: !1,
                  }
                }),
              }
            })
            .filter(s.notNull)
          const f = new a.CompositeRenderer()
          for (let e = 1; e < this._points.length; e++) {
            const t = {
                points: [this._points[e - 1], this._points[e]],
                color: p,
                linewidth: 1,
                linestyle: r.LINESTYLE_SOLID,
                extendleft: !1,
                extendright: !1,
                leftend: d.LineEnd.Normal,
                rightend: d.LineEnd.Normal,
              },
              i = new h.TrendLineRenderer()
            i.setData(t),
              i.setHitTest(new o.HitTestResult(o.HitTarget.MovePoint)),
              f.append(i)
          }
          const v = g.drawWick.value(),
            x = g.drawBorder.value(),
            m = g.borderColor.value(),
            w = g.wickColor.value(),
            R = new a.CompositeRenderer()
          R.setGlobalAlpha(1 - _.transparency.value() / 100)
          const y = this._model.timeScale().barSpacing()
          for (let e = 0; e < this._segments.length; e++) {
            const t = {
              bars: this._segments[e].bars,
              barSpacing: y,
              wickVisible: v,
              bodyVisible: !0,
              borderVisible: x,
              borderColor: m,
              wickColor: w,
              barWidth: (0, l.optimalBarWidth)(y),
              hittest: new o.HitTestResult(o.HitTarget.MovePoint),
            }
            R.append(new c.PaneRendererCandles(t))
          }
          f.append(R), this.addAnchors(f), (this._renderer = f)
        }
      }
    },
    45495: (e, t, i) => {
      i.r(t), i.d(t, { LineToolHeadAndShouldersPaneView: () => g })
      var n = i(5531),
        r = i(11542),
        s = i(79849),
        o = i(99031),
        a = i(10695),
        l = i(80657),
        d = i(19266),
        h = i(73436),
        c = i(79797),
        u = i(79191),
        p = i(46501)
      const _ = {
        leftShoulder: r.t(null, void 0, i(68589)),
        rightShoulder: r.t(null, void 0, i(78934)),
        head: r.t(null, void 0, i(63706)),
      }
      class g extends u.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._trendLineRenderer = new o.TrendLineRenderer()),
            (this._triangleRendererPoints234 = new a.TriangleRenderer()),
            (this._intersect1Renderer = new a.TriangleRenderer()),
            (this._intersect2Renderer = new a.TriangleRenderer()),
            (this._polyLineRenderer = new c.PolygonRenderer()),
            (this._leftShoulderLabelRenderer = new l.TextRenderer()),
            (this._headLabelRenderer = new l.TextRenderer()),
            (this._rightShoulderLabelRenderer = new l.TextRenderer()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          let e, t
          super._updateImpl(), (this._renderer = null)
          const [i, r, o, a, l, c, u] = this._points
          if (this._points.length >= 5) {
            const s = (0, n.intersectLineSegments)(o, l, i, r)
            if (null !== s) {
              const t = l.subtract(o)
              e = o.add(t.scaled(s))
            }
            if (7 === this._points.length) {
              const e = (0, n.intersectLineSegments)(o, l, c, u)
              if (null !== e) {
                const i = l.subtract(o)
                t = o.add(i.scaled(e))
              }
            }
          }
          if (this._points.length < 2) return
          const g = this._source.properties().childs(),
            f = new d.CompositeRenderer(),
            v = (e, t) => ({
              points: [e],
              text: t,
              color: g.textcolor.value(),
              horzAlign: 'center',
              vertAlign: 'middle',
              font: p.CHART_FONT_FAMILY,
              offsetX: 0,
              offsetY: 0,
              bold: g.bold && g.bold.value(),
              italic: g.italic && g.italic.value(),
              fontsize: g.fontsize.value(),
              backgroundColor: g.color.value(),
              backgroundRoundRect: 4,
            }),
            x = (e, t, i) => ({
              points: [e, t, i],
              color: 'rgba(0, 0, 0, 0)',
              linewidth: 0,
              backcolor: g.backgroundColor.value(),
              fillBackground: g.fillBackground.value(),
              transparency: g.transparency.value(),
            }),
            m = {
              points: this._points,
              color: g.color.value(),
              linewidth: g.linewidth.value(),
              linestyle: s.LINESTYLE_SOLID,
              backcolor: 'rgba(0, 0, 0, 0)',
              fillBackground: !1,
              filled: !1,
            }
          if (
            (this._polyLineRenderer.setData(m),
            f.append(this._polyLineRenderer),
            this._points.length >= 5)
          ) {
            let i,
              n,
              r = !1,
              d = !1
            e ? (i = e) : ((i = o), (r = !0)), t ? (n = t) : ((n = l), (d = !0))
            const c = {
              points: [i, n],
              color: g.color.value(),
              linewidth: g.linewidth.value(),
              linestyle: s.LINESTYLE_DOTTED,
              extendleft: !1,
              extendright: !1,
              leftend: h.LineEnd.Normal,
              rightend: h.LineEnd.Normal,
            }
            ;(c.extendleft = r),
              (c.extendright = d),
              this._trendLineRenderer.setData(c),
              f.append(this._trendLineRenderer)
            const u = x(o, a, l)
            this._triangleRendererPoints234.setData(u),
              f.append(this._triangleRendererPoints234)
          }
          if (e) {
            const t = x(e, r, o)
            this._intersect1Renderer.setData(t),
              f.append(this._intersect1Renderer)
          }
          if (t) {
            const e = x(l, c, t)
            this._intersect2Renderer.setData(e),
              f.append(this._intersect2Renderer)
          }
          if (this._points.length >= 2) {
            const e = v(r, _.leftShoulder)
            r.y < i.y
              ? ((e.vertAlign = 'bottom'), (e.offsetY = 5))
              : ((e.vertAlign = 'top'), (e.offsetY = 5)),
              this._leftShoulderLabelRenderer.setData(e),
              f.append(this._leftShoulderLabelRenderer)
          }
          if (this._points.length >= 4) {
            const e = v(a, _.head)
            a.y < o.y
              ? ((e.vertAlign = 'bottom'), (e.offsetY = 5))
              : ((e.vertAlign = 'top'), (e.offsetY = 5)),
              this._headLabelRenderer.setData(e),
              f.append(this._headLabelRenderer)
          }
          if (this._points.length >= 6) {
            const e = v(c, _.rightShoulder)
            c.y < l.y
              ? ((e.vertAlign = 'bottom'), (e.offsetY = 5))
              : ((e.vertAlign = 'top'), (e.offsetY = 5)),
              this._rightShoulderLabelRenderer.setData(e),
              f.append(this._rightShoulderLabelRenderer)
          }
          this.addAnchors(f), (this._renderer = f)
        }
      }
    },
    75427: (e, t, i) => {
      i.r(t), i.d(t, { HighlighterPaneView: () => s })
      var n = i(79849),
        r = i(26049)
      class s extends r.BrushBasePaneView {
        _createPolygonRendererData() {
          const e = this._source.properties().childs()
          return {
            points: this._points,
            color: e.linecolor.value(),
            linewidth: 20,
            backcolor: 'rgba(0, 0, 0, 0)',
            fillBackground: !1,
            linestyle: n.LINESTYLE_SOLID,
            filled: !1,
            transparency: e.transparency.value(),
          }
        }
      }
    },
    74660: (e, t, i) => {
      i.r(t), i.d(t, { HorzLinePaneView: () => u })
      var n = i(86441),
        r = i(18807),
        s = i(66103),
        o = i(80657),
        a = i(74997),
        l = i(19266),
        d = i(46501),
        h = i(33295)
      const c = [s.PaneCursorType.VerticalResize]
      class u extends h.AlertableLineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._renderer = null),
            (this._labelRenderer = new o.TextRenderer()),
            (this._lineRenderer = new a.HorizontalLineRenderer()),
            this._lineRenderer.setHitTest(
              new r.HitTestResult(r.HitTarget.MovePoint),
            )
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          var i
          if (
            (super._updateImpl(e, t),
            (this._renderer = null),
            0 === this._points.length)
          )
            return
          const s = this._source.properties().childs(),
            a = new l.CompositeRenderer()
          let h,
            u = !0
          if (
            s.showLabel.value() &&
            1 === this._points.length &&
            s.text.value().length > 0
          ) {
            const r = s.vertLabelsAlign.value(),
              l = s.horzLabelsAlign.value()
            let c = 0,
              p = 0
            'left' === l
              ? (p = 3)
              : 'right' === l
                ? ((p = this._model.timeScale().width()), (c = 3))
                : (p = this._model.timeScale().width() / 2)
            const _ = {
              points: [new n.Point(p, this._points[0].y)],
              text: s.text.value(),
              color: s.textcolor.value(),
              vertAlign: r,
              horzAlign: l,
              font: d.CHART_FONT_FAMILY,
              offsetX: c,
              offsetY: 0,
              bold: s.bold.value(),
              italic: s.italic.value(),
              fontsize: s.fontsize.value(),
              forceTextAlign: !0,
            }
            this._labelRenderer.setData(_),
              a.append(this._labelRenderer),
              this._needLabelExclusionPath(this._labelRenderer) &&
                (h =
                  null !==
                    (i = (0, o.getTextBoundaries)(this._labelRenderer, t, e)) &&
                  void 0 !== i
                    ? i
                    : void 0),
              (u = this._labelRenderer.isOutOfScreen(t, e))
          }
          const p = {
            y: this._points[0].y,
            color: s.linecolor.value(),
            linewidth: s.linewidth.value(),
            linestyle: s.linestyle.value(),
            excludeBoundaries: h,
          }
          this._lineRenderer.setData(p),
            this._lineRenderer.setHitTest(
              new r.HitTestResult(r.HitTarget.MovePoint, {
                snappingPrice: this._source.points()[0].price,
              }),
            )
          const _ = p.linewidth / 2 + 1
          if (
            ((u = u && (p.y < -_ || p.y > e + _)),
            a.append(this._lineRenderer),
            !u)
          ) {
            if (1 === this._points.length) {
              const e = new n.Point(t / 2, this._points[0].y)
              ;(e.data = 0),
                (e.square = !0),
                a.append(
                  this.createLineAnchor(
                    { points: [e], pointsCursorType: c },
                    0,
                  ),
                )
            }
            if (1 === this._points.length) {
              const e = new n.Point(
                this._model.timeScale().width() / 2,
                this._points[0].y,
              )
              this._addAlertRenderer(a, [e])
            }
            this._renderer = a
          }
        }
      }
    },
    57964: (e, t, i) => {
      i.r(t), i.d(t, { HorzRayPaneView: () => g })
      var n = i(86441),
        r = i(19266),
        s = i(80657),
        o = i(46501),
        a = i(18807),
        l = i(33295),
        d = i(68441),
        h = i(45197),
        c = i(74359),
        u = i(59590),
        p = i(79849)
      class _ extends u.BitmapCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data || 0 === this._data.points.length) return null
          if (e.x < this._data.points[0].x) return null
          const t = (0, h.interactionTolerance)().line
          return Math.abs(e.y - this._data.points[0].y) <= t
            ? new a.HitTestResult(this._data.hitTestResult, {
                snappingPrice: this._data.snappingPrice,
              })
            : null
        }
        _drawImpl(e) {
          if (null === this._data || 0 === this._data.points.length) return
          const {
              context: t,
              horizontalPixelRatio: i,
              verticalPixelRatio: n,
              bitmapSize: r,
            } = e,
            s = r.width,
            o = this._data.points[0].y,
            a = Math.max(0, this._data.points[0].x),
            l = Math.max(s, this._data.points[0].x)
          ;(t.lineCap =
            void 0 === this._data.linestyle ||
            this._data.linestyle === p.LINESTYLE_SOLID
              ? 'round'
              : 'butt'),
            (t.strokeStyle = this._data.color),
            (t.lineWidth = Math.max(1, Math.floor(this._data.linewidth * i))),
            void 0 !== this._data.linestyle &&
              (0, d.setLineStyle)(t, this._data.linestyle)
          const h = this._data.excludeBoundaries
          void 0 !== h && (0, c.addExclusionAreaByScope)(e, h),
            (0, d.drawHorizontalLine)(
              t,
              Math.round(o * n),
              Math.round(a * i),
              Math.round(l * i),
            )
        }
      }
      class g extends l.AlertableLineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._horzRayRenderer = new _()),
            (this._labelRenderer = new s.TextRenderer()),
            (this._renderer = null),
            (this._horzRayRenderer = new _()),
            (this._labelRenderer = new s.TextRenderer()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          var i
          if (
            (super._updateImpl(),
            (this._renderer = null),
            0 === this._points.length)
          )
            return
          const l = this._source.properties().childs(),
            d = new r.CompositeRenderer()
          let h,
            c = this._points[0].clone()
          if (l.showLabel.value() && 1 === this._points.length) {
            const r = l.vertLabelsAlign.value(),
              a = l.horzLabelsAlign.value(),
              u = 0
            let p = 0
            const _ = l.text.value(),
              g = l.bold.value(),
              f = l.italic.value(),
              v = o.CHART_FONT_FAMILY,
              x = l.fontsize.value()
            if ('right' === a) {
              const e = this._labelRenderer.measure().width,
                t = this._model.timeScale().width()
              c.x + e + 3 >= t
                ? (c = c.add((0, n.point)(e + 3, 0)))
                : ((c = (0, n.point)(t, c.y)), (p = 3))
            } else
              'center' === a &&
                (c = (0, n.point)(
                  (c.x + this._model.timeScale().width()) / 2,
                  c.y,
                ))
            const m = {
              points: [c],
              text: _,
              color: l.textcolor.value(),
              vertAlign: r,
              horzAlign: a,
              font: v,
              offsetX: p,
              offsetY: u,
              bold: g,
              italic: f,
              fontsize: x,
              forceTextAlign: !0,
            }
            this._labelRenderer.setData(m),
              d.append(this._labelRenderer),
              this._needLabelExclusionPath(this._labelRenderer) &&
                (h =
                  null !==
                    (i = (0, s.getTextBoundaries)(this._labelRenderer, t, e)) &&
                  void 0 !== i
                    ? i
                    : void 0)
          }
          const u = {
            points: this._points,
            color: l.linecolor.value(),
            linewidth: l.linewidth.value(),
            linestyle: l.linestyle.value(),
            hitTestResult: a.HitTarget.MovePoint,
            snappingPrice: this._source.points()[0].price,
            excludeBoundaries: h,
          }
          this._horzRayRenderer.setData(u),
            d.append(this._horzRayRenderer),
            this.addAnchors(d),
            1 === this._points.length &&
              this._addAlertRenderer(d, [u.points[0]]),
            (this._renderer = d)
        }
      }
    },
    48273: (e, t, i) => {
      i.r(t), i.d(t, { IconPaneView: () => r })
      var n = i(50761)
      class r extends n.SvgIconPaneView {
        _iconColor() {
          return this._source.properties().childs().color.value()
        }
      }
    },
    79191: (e, t, i) => {
      i.d(t, { LineSourcePaneView: () => _, thirdPointCursorType: () => p })
      var n = i(33013),
        r = i(50151),
        s = i(38325),
        o = i(18807),
        a = i(80101),
        l = i(79059),
        d = i(66103),
        h = i(80657)
      const c = n.colorsPalette['color-tv-blue-600']
      var u
      function p(e, t) {
        const i = t.x - e.x,
          n = t.y - e.y,
          r = Math.abs(Math.atan2(i, n))
        return r > Math.PI / 4 && r < (3 * Math.PI) / 4
          ? d.PaneCursorType.VerticalResize
          : d.PaneCursorType.HorizontalResize
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
          const i = this._source.ownerSource(),
            n = null !== i ? i.firstValue() : null
          return null === n ? null : t.priceToCoordinate(e, n)
        }
        currentPoint() {
          return this._model.crossHairSource().currentPoint()
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
        addAnchors(e, t) {
          let i = this._points
          this._model.lineBeingCreated() === this._source &&
            (i = i.slice(0, -1))
          const n = i.map((e, t) => {
            const i = this._source.points()[t],
              n = e
            return (
              (n.snappingPrice = null == i ? void 0 : i.price),
              (n.snappingIndex = null == i ? void 0 : i.index),
              n
            )
          })
          e.append(
            this.createLineAnchor({ ...(null != t ? t : {}), points: n }, 0),
          )
        }
        createLineAnchor(e, t) {
          var i
          if (this.isLocked()) {
            const i = this._getSelectionRenderer(t)
            return (
              i.setData({
                bgColors: this._lineAnchorColors(e.points),
                points: e.points,
                visible: this.areAnchorsVisible(),
                hittestResult: o.HitTarget.Regular,
                barSpacing: this._model.timeScale().barSpacing(),
              }),
              i
            )
          }
          const n = (0, s.lastMouseOrTouchEventInfo)().isTouch,
            r = this._getLineAnchorRenderer(t)
          return (
            r.setData({
              ...e,
              color: this.anchorColor(),
              backgroundColors: this._lineAnchorColors(e.points),
              currentPoint: this.currentPoint(),
              linePointBeingEdited: this.isBeingEdited()
                ? this._model.linePointBeingEdited()
                : null,
              hittestResult:
                null !== (i = e.hittestResult) && void 0 !== i
                  ? i
                  : o.HitTarget.ChangePoint,
              radius: this._anchorRadius(),
              strokeWidth: n ? u.TouchStrokeWidth : u.RegularStrokeWidth,
              selected: this.isSelectedSource(),
              selectedStrokeWidth: n
                ? u.TouchSelectedStrokeWidth
                : u.RegularSelectedStrokeWidth,
              visible: this.areAnchorsVisible(),
            }),
            r
          )
        }
        _anchorRadius() {
          return (0, s.lastMouseOrTouchEventInfo)().isTouch
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
        _updateImpl(e, t) {
          this._points = []
          if (this._model.timeScale().isEmpty()) return
          if (!this._validatePriceScale()) return
          const i = this._source.points()
          for (let e = 0; e < i.length; e++) {
            const t = i[e],
              n = this._source.pointToScreenPoint(t)
            if (!n) return
            const r = n
            ;(r.data = e), this._points.push(r)
          }
          2 === this._points.length &&
            (this._middlePoint = this._source.calcMiddlePoint(
              this._points[0],
              this._points[1],
            )),
            (this._invalidated = !1)
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
            'middle' === (null != t ? t : i.vertLabelsAlign.value()) &&
            (0, h.needTextExclusionPath)(e)
          )
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
    99058: (e, t, i) => {
      i.r(t), i.d(t, { LineToolBeingCreatedPaneView: () => c })
      var n = i(33013),
        r = i(79191),
        s = i(79849),
        o = i(73436),
        a = i(19266),
        l = i(71254),
        d = i(99031)
      const h = n.colorsPalette['color-cold-gray-500']
      class c extends r.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._lineRenderer1 = new l.VerticalLineRenderer()),
            (this._lineRenderer2 = new l.VerticalLineRenderer()),
            (this._medianRenderer = new d.TrendLineRenderer()),
            (this._renderer = null)
        }
        renderer() {
          return (
            this._invalidated && (this._updateImpl(), (this._invalidated = !1)),
            this._renderer
          )
        }
        _updateImpl() {
          super._updateImpl(), (this._renderer = null)
          const e = this._getPoints()
          if (e.length < 1) return
          this._renderer = new a.CompositeRenderer()
          const [t, i] = e
          this._lineRenderer1.setData({
            x: t.x,
            color: h,
            linewidth: 1,
            linestyle: s.LINESTYLE_SOLID,
          }),
            this._renderer.append(this._lineRenderer1),
            e.length > 1 &&
              (this._lineRenderer2.setData({
                x: i.x,
                color: h,
                linewidth: 1,
                linestyle: s.LINESTYLE_SOLID,
              }),
              this._medianRenderer.setData({
                points: [t, i],
                color: h,
                linewidth: 1,
                linestyle: s.LINESTYLE_SOLID,
                extendleft: !1,
                extendright: !1,
                leftend: o.LineEnd.Normal,
                rightend: o.LineEnd.Normal,
              }),
              this._renderer.append(this._lineRenderer2),
              this._renderer.append(this._medianRenderer))
        }
      }
    },
    134: (e, t, i) => {
      i.r(t), i.d(t, { LineToolPaneViewFibWithLabels: () => d })
      var n = i(86441),
        r = i(79191),
        s = i(80657),
        o = i(87663),
        a = i(93572),
        l = i(46501)
      class d extends r.LineSourcePaneView {
        constructor(e, t) {
          super(e, t), (this._labelsRenderers = {})
          for (let t = 0; t < e.levelsCount(); t++)
            this._labelsRenderers[t] = new s.TextRenderer()
          ;(this._numericFormatter = new o.NumericFormatter()),
            (this._percentageFormatter = new a.PercentageFormatter())
        }
        _updateLabelForLevel({
          i: e,
          levelIndex: t,
          leftPoint: i,
          rightPoint: r,
          price: s,
          color: o,
          horzAlign: a,
          vertAlign: d,
          extendLeft: h = !1,
          extendRight: c = !1,
        }) {
          var u, p, _, g, f
          const v = this._labelsRenderers[e]
          if (void 0 === v) return null
          const x = this._source.priceScale()
          if (!x) return null
          const m = this._source.properties(),
            w = Boolean(
              null === (u = m.showCoeffs) || void 0 === u ? void 0 : u.value(),
            ),
            R = Boolean(
              null === (p = m.showPrices) || void 0 === p ? void 0 : p.value(),
            )
          if (!w && !R) return null
          const y =
            null === (_ = this._source.ownerSource()) || void 0 === _
              ? void 0
              : _.firstValue()
          if (null == y) return null
          const b = !(
            (i.x > this._model.timeScale().width() && !h) ||
            (r.x < 0 && !c)
          )
          let T,
            P,
            L = a
          switch (L) {
            case 'left':
              ;(P = i.y), h ? (T = b ? 0 : r.x) : ((T = i.x), (L = 'right'))
              break
            case 'right':
              ;(P = r.y),
                c
                  ? (T = b ? this._model.timeScale().width() : i.x)
                  : ((T = r.x), (L = 'left'))
              break
            default:
              ;(T = (i.x + r.x) / 2), (P = (i.y + r.y) / 2)
          }
          const C = m['level' + t].coeff.value()
          let S = ''
          if (w) {
            S +=
              null !==
                (f =
                  null === (g = m.coeffsAsPercents) || void 0 === g
                    ? void 0
                    : g.value()) &&
              void 0 !== f &&
              f
                ? this._percentageFormatter.format(100 * C, !1, 2)
                : this._numericFormatter.format(C)
          }
          return (
            R && (S += ' (' + x.formatPrice(s, y) + ')'),
            v.setData({
              points: [new n.Point(T, P)],
              text: S,
              color: o,
              vertAlign: d,
              horzAlign: L,
              offsetX: 4,
              offsetY: 0,
              font: l.CHART_FONT_FAMILY,
              fontSize: m.labelFontSize ? m.labelFontSize.value() : 12,
            }),
            v
          )
        }
      }
    },
    34658: (e, t, i) => {
      i.r(t), i.d(t, { NotePaneView: () => m })
      var n = i(50151),
        r = i(79191),
        s = i(19266),
        o = i(80101),
        a = i(18807),
        l = i(46501),
        d = i(80657),
        h = i(87095),
        c = i(38223),
        u = i(74359),
        p = i(57352),
        _ = i(27714),
        g = i(86441),
        f = i(34026)
      class v {
        constructor(e) {
          ;(this._data = null),
            (this._sourceCanvas = null),
            (this._translate = new g.Point(0, 0)),
            (this._renderParams = e)
        }
        destroy() {
          var e
          null === (e = this._sourceCanvas) || void 0 === e || e.remove()
        }
        renderParams() {
          return this._renderParams
        }
        update(e) {
          var t, i
          ;(t = this._data),
            (i = e),
            (null === t ||
              t.markerColor !== i.markerColor ||
              t.borderColor !== i.borderColor ||
              t.width !== i.width ||
              t.height !== i.height) &&
              this._createSource(e.width, e.height, e.markerColor),
            (this._data = e)
        }
        drawOn(e) {
          const t = (0, n.ensureNotNull)(this._data),
            i = new g.Point(Math.round(t.point.x), Math.round(t.point.y)).add(
              this._translate,
            )
          e.drawImage(
            (0, n.ensureNotNull)(this._sourceCanvas),
            Math.round(i.x * this._renderParams.pixelRatio),
            Math.round(i.y * this._renderParams.pixelRatio),
            Math.round(t.width * this._renderParams.pixelRatio),
            Math.round(t.height * this._renderParams.pixelRatio),
          )
        }
        hasPoint(e) {
          const t = (0, n.ensureNotNull)(this._data),
            i = t.point.add(this._translate),
            r = new g.Point(t.point.x - this._translate.x, t.point.y)
          return (0, f.pointInBox)(e, (0, g.box)(i, r))
        }
        _createSource(e, t, i) {
          ;(this._sourceCanvas = (0, u.createDisconnectedCanvas)(
            document,
            (0, _.size)({ width: e, height: t }),
            this._renderParams.pixelRatio,
          )),
            (this._translate = new g.Point(-e / 2, 0.5 - t)),
            this._translate.x % 1 == 0 &&
              (this._translate = new g.Point(
                this._translate.x + 0.5,
                this._translate.y,
              ))
          const r = (0, n.ensureNotNull)(this._sourceCanvas.getContext('2d')),
            { pixelRatio: s } = this._renderParams
          ;(0, u.drawScaled)(r, s, s, () => {
            const n = 0.6 * e
            ;(r.fillStyle = i),
              r.beginPath(),
              r.moveTo(e / 2, t),
              r.quadraticCurveTo(e, e / 1.15, e, e / 2),
              r.arc(e / 2, e / 2, e / 2, 0, Math.PI, !0),
              r.quadraticCurveTo(0, e / 1.15, e / 2, t),
              r.fill(),
              (r.globalCompositeOperation = 'destination-out'),
              r.beginPath(),
              r.moveTo((e - n) / 2, e / 2),
              r.arc(e / 2, e / 2, n / 2, 0, 2 * Math.PI),
              r.fill()
          })
        }
      }
      class x {
        constructor() {
          ;(this._source = null), (this._data = null)
        }
        setData(e) {
          ;(this._data = e), this._source && this._source.update(e)
        }
        draw(e, t) {
          var i
          if (null === this._data) return
          ;(null !== this._source &&
            (0, p.areEqualPaneRenderParams)(this._source.renderParams(), t)) ||
            (null === (i = this._source) || void 0 === i || i.destroy(),
            (this._source = new v(t)),
            this._source.update(this._data))
          this._source.drawOn(e),
            this._data.tooltipVisible && this._drawTooltipOn(e, t)
        }
        hitTest(e) {
          return null !== this._data &&
            null !== this._source &&
            this._source.hasPoint(e)
            ? new a.HitTestResult(a.HitTarget.MovePoint)
            : null
        }
        _drawTooltipOn(e, t) {
          e.save(), e.translate(0.5, 0.5)
          const i = (0, n.ensureNotNull)(this._data),
            r = String(i.text).replace(/^\s+|\s+$/g, '')
          e.font =
            (i.bold ? 'bold ' : '') +
            (i.italic ? 'italic ' : '') +
            i.fontSize +
            'px ' +
            i.font
          const s = Math.max(20, Math.min(i.tooltipWidth, t.cssWidth)),
            o = s - 2 * i.tooltipPadding,
            a = (0, d.wordWrap)(r, e.font, o),
            l = i.point,
            p = i.tooltipLineSpacing
          let _ = s,
            g = a.length * i.fontSize + 2 * i.tooltipPadding
          a.length > 1 && (g += (a.length - 1) * p)
          let f = Math.round(l.x - _ / 2),
            v = Math.round(l.y - i.height - g - 8)
          const x = l.x < 20 || l.x + 20 > i.vpWidth
          let m = x ? null : 'top',
            w = x ? 0 : Math.round(l.x)
          v < 10 ? (v = l.y + 13) : (m = 'bottom'),
            f < 10
              ? (f += Math.abs(f - 10))
              : f + _ + 10 > i.vpWidth && (f -= f + _ + 10 - i.vpWidth),
            (e.fillStyle = (0, h.generateColor)(
              i.backgroundColor,
              i.backgroundTransparency,
            )),
            (e.strokeStyle = i.borderColor),
            (e.lineWidth = 1),
            e.beginPath()
          const R = Math.round(f * t.pixelRatio),
            y = Math.round(v * t.pixelRatio)
          ;(w = Math.round(w * t.pixelRatio)),
            (g = Math.round(g * t.pixelRatio)),
            (_ = Math.round(_ * t.pixelRatio))
          const b = Math.round(7 * t.pixelRatio)
          e.moveTo(R, y),
            x ||
              'top' !== m ||
              (e.lineTo(w - b, y), e.lineTo(w, y - b), e.lineTo(w + b, y)),
            e.lineTo(R + _, y),
            e.lineTo(R + _, y + g),
            x ||
              'bottom' !== m ||
              (e.lineTo(w + b, y + g),
              e.lineTo(w, y + g + b),
              e.lineTo(w - b, y + g)),
            e.lineTo(R, y + g),
            e.closePath(),
            e.fill(),
            e.stroke(),
            (e.textBaseline = 'middle'),
            (e.fillStyle = i.textColor),
            (e.textAlign = (0, c.isRtl)() ? 'right' : 'left')
          const T = (0, u.calcTextHorizontalShift)(e, o),
            P = f + i.tooltipPadding + T
          let L = v + i.tooltipPadding + i.fontSize / 2
          ;(0, u.drawScaled)(e, t.pixelRatio, t.pixelRatio, () => {
            for (let t = 0; t < a.length; t++)
              e.fillText(a[t].replace(/^\s+/, ''), P, L), (L += i.fontSize + p)
          }),
            e.restore()
        }
      }
      class m extends r.LineSourcePaneView {
        constructor(e, t) {
          super(e, t), (this._renderer = null), (this._noteRenderer = new x())
        }
        isLabelVisible() {
          return this.isHoveredSource() || this.isSelectedSource()
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          super._updateImpl(), (this._renderer = null)
          const e = this._getSource(),
            t = this._source.isFixed()
              ? [(0, n.ensureDefined)(e.fixedPoint())]
              : this._points
          if (t.length < 1) return
          const i = new s.CompositeRenderer(),
            r = this.isLabelVisible(),
            d = this._source.properties().childs(),
            h = {
              text: d.text.value(),
              bold: d.bold.value(),
              italic: d.italic.value(),
              font: l.CHART_FONT_FAMILY,
              fontSize: d.fontSize.value(),
              backgroundColor: d.backgroundColor.value(),
              backgroundTransparency: d.backgroundTransparency.value(),
              borderColor: d.borderColor.value(),
              textColor: d.textColor.value(),
              markerColor: d.markerColor.value(),
              point: t[0],
              width: 24,
              height: 32,
              tooltipVisible: r,
              vpWidth: this._model.timeScale().width(),
              tooltipWidth: e.getTooltipWidth(),
              tooltipPadding: e.getTooltipPadding(),
              tooltipLineSpacing: e.getTooltipLineSpacing(),
            }
          this._noteRenderer.setData(h),
            i.append(this._noteRenderer),
            i.append(
              new o.SelectionRenderer({
                points: t,
                bgColors: this._lineAnchorColors(t),
                visible: this.areAnchorsVisible(),
                barSpacing: this._model.timeScale().barSpacing(),
                hittestResult: a.HitTarget.MovePoint,
              }),
            ),
            (this._renderer = i)
        }
      }
    },
    14002: (e, t, i) => {
      function n(e, t, i) {
        const n = t - i
        if ('percentage' === e.getLineLengthUnit()) {
          const r = Math.max((e.getLineLength() / 100) * t, 1),
            s = Math.round(t - Math.min(n, r))
          return { right: s, left: s - i }
        }
        const r = e.getLineLength()
        if (r < 0) {
          const e = Math.round(Math.min(n, -1 * r))
          return { left: e, right: e + i }
        }
        {
          const e = Math.round(t - Math.min(n, r))
          return { right: e, left: e - i }
        }
      }
      i.d(t, { orderLineLocation: () => n })
    },
    61144: (e, t, i) => {
      i.r(t), i.d(t, { OrderPaneView: () => x })
      var n = i(86441),
        r = i(79191),
        s = i(19266),
        o = i(11542),
        a = i(82161),
        l = i(68441),
        d = i(15187),
        h = i(18807),
        c = i(53180),
        u = i(47043),
        p = i(14002)
      const _ = o.t(null, void 0, i(33241)),
        g = o.t(null, void 0, i(16075))
      class f extends d.MediaCoordinatesPaneRenderer {
        constructor(e) {
          super(),
            (this._data = null),
            (this._cache = {}),
            (this._data = null),
            (this._adapter = e)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e, t) {
          if (null === this._data || 0 === this._data.points.length) return null
          const i = this._cache
          if (e.y < i.top || e.y > i.bottom) return null
          if (this._adapter.getBlocked() && e.x >= i.left && e.x < i.right)
            return new h.HitTestResult(h.HitTarget.Custom, {})
          if (
            this._adapter.getEditable() &&
            e.x >= i.left &&
            e.x < i.bodyRight
          ) {
            const e = this._adapter.hasMoveCallback()
              ? h.HitTarget.MovePoint
              : h.HitTarget.Regular
            return 0 === this._adapter.getTooltip().length
              ? new h.HitTestResult(e)
              : new h.HitTestResult(e, {
                  tooltip: {
                    text: this._adapter.getTooltip(),
                    forceHideOnMove: this._adapter.hasMoveCallback(),
                    rect: {
                      x: i.left,
                      y: i.top,
                      w: i.bodyRight - i.left,
                      h: i.bottom - i.top,
                    },
                  },
                })
          }
          return this._adapter.getEditable() &&
            e.x >= i.bodyRight &&
            e.x < i.quantityRight
            ? this._adapter.hasModifyCallback()
              ? new h.HitTestResult(h.HitTarget.Custom, {
                  clickHandler: this._adapter.callOnModify.bind(this._adapter),
                  tapHandler: this._adapter.callOnModify.bind(this._adapter),
                  tooltip: {
                    text:
                      this._adapter.getModifyTooltip() ||
                      (0, c.appendEllipsis)(_),
                    rect: {
                      x: i.bodyRight,
                      y: i.top,
                      w: i.quantityRight - i.bodyRight,
                      h: i.bottom - i.top,
                    },
                  },
                })
              : new h.HitTestResult(h.HitTarget.Regular)
            : this._adapter.getCancellable() &&
                e.x >= i.quantityRight &&
                e.x < i.right
              ? new h.HitTestResult(h.HitTarget.Custom, {
                  clickHandler: this._adapter.callOnCancel.bind(this._adapter),
                  tapHandler: this._adapter.callOnCancel.bind(this._adapter),
                  tooltip: {
                    text: this._adapter.getCancelTooltip() || g,
                    rect: {
                      x: i.quantityRight,
                      y: i.top,
                      w: i.right - i.quantityRight,
                      h: i.bottom - i.top,
                    },
                  },
                })
              : null
        }
        _drawImpl(e) {
          if (
            null === this._data ||
            !this._data.points ||
            this._data.points.length < 1
          )
            return
          const t = e.context,
            i = e.mediaSize.width,
            n = this._bodyWidth(t),
            r = this._quantityWidth(t),
            s = n + r + this._cancelButtonWidth(),
            { left: o, right: a } = (0, p.orderLineLocation)(
              this._adapter,
              i,
              s,
            ),
            l = Math.round(this._data.points[0].y),
            d = Math.round(l - (this._height() + 1) / 2)
          ;(this._cache.bodyRight = o + n),
            (this._cache.quantityRight = o + n + r),
            (this._cache.top = d),
            (this._cache.bottom = d + this._height()),
            (this._cache.left = o),
            (this._cache.right = a),
            this._drawLines(t, o, a, l, i)
          let h = !1
          0 !== n &&
            (this._drawBody(t, o, d),
            this._adapter.hasMoveCallback() && this._drawMovePoints(t, o, d),
            this._drawBodyText(t, o, d),
            (h = !0)),
            0 !== r &&
              (this._drawQuantity(t, o + n, d, h),
              this._drawQuantityText(t, o + n, d),
              (h = !0)),
            0 !== this._cancelButtonWidth() &&
              this._drawCancelButton(t, o + n + r, d, h)
        }
        _height() {
          return Math.max(
            20,
            1 +
              Math.max(
                u.fontHeight(this._adapter.getBodyFont()),
                u.fontHeight(this._adapter.getQuantityFont()),
              ),
          )
        }
        _bodyWidth(e) {
          if (0 === this._adapter.getText().length) return 0
          e.save(), (e.font = this._adapter.getBodyFont())
          const t = e.measureText(this._adapter.getText()).width
          return e.restore(), Math.round(20 + t)
        }
        _getQuantity() {
          return (0, a.splitThousands)(this._adapter.getQuantity(), ' ')
        }
        _quantityWidth(e) {
          if (0 === this._getQuantity().length) return 0
          e.save(), (e.font = this._adapter.getQuantityFont())
          const t = e.measureText(this._getQuantity()).width
          return e.restore(), Math.round(Math.max(this._height(), 10 + t))
        }
        _cancelButtonWidth() {
          return this._adapter.isOnCancelCallbackPresent() ? this._height() : 0
        }
        _drawLines(e, t, i, n, r) {
          e.save(),
            (e.strokeStyle = this._adapter.getLineColor()),
            (0, l.setLineStyle)(e, this._adapter.getLineStyle()),
            (e.lineWidth = this._adapter.getLineWidth()),
            (0, l.drawLine)(e, i, n, r, n),
            this._adapter.getExtendLeft() && (0, l.drawLine)(e, 0, n, t, n),
            e.restore()
        }
        _drawMovePoints(e, t, i) {
          e.save(),
            (e.strokeStyle = this._adapter.getBodyBorderColor()),
            (e.fillStyle = this._adapter.getBodyBorderColor())
          const n = t + 4,
            r = n + 2,
            s = Math.floor((this._height() - 10) / 2) + 1
          for (let t = 0; t < s; ++t) {
            const s = i + 5 + 2 * t
            ;(0, l.drawLine)(e, n, s, r, s)
          }
          e.restore()
        }
        _drawBody(e, t, i) {
          ;(e.strokeStyle = this._adapter.getBodyBorderColor()),
            (e.fillStyle = this._adapter.getBodyBackgroundColor())
          const n = this._bodyWidth(e),
            r = this._height()
          e.fillRect(t + 0.5, i + 0.5, n - 1, r - 1), e.strokeRect(t, i, n, r)
        }
        _drawBodyText(e, t, i) {
          ;(e.textAlign = 'center'),
            (e.textBaseline = 'middle'),
            (e.font = this._adapter.getBodyFont()),
            (e.fillStyle = this._adapter.getBodyTextColor())
          const n = t + this._bodyWidth(e) / 2,
            r = i + this._height() / 2
          e.fillText(this._adapter.getText(), 5 + n - 2, r)
        }
        _drawQuantity(e, t, i, n) {
          e.save(),
            (e.strokeStyle = this._adapter.getQuantityBorderColor()),
            (e.fillStyle = this._adapter.getQuantityBackgroundColor())
          const r = this._quantityWidth(e),
            s = this._height()
          e.fillRect(t + 0.5, i + 0.5, r - 1, s - 1),
            n &&
              e.clip &&
              (e.beginPath(), e.rect(t + 0.5, i - 0.5, r + 1, s + 1), e.clip()),
            e.strokeRect(t, i, r, s),
            e.restore()
        }
        _drawQuantityText(e, t, i) {
          e.save(),
            (e.textAlign = 'center'),
            (e.textBaseline = 'middle'),
            (e.font = this._adapter.getQuantityFont()),
            (e.fillStyle = this._adapter.getQuantityTextColor())
          const n = t + this._quantityWidth(e) / 2,
            r = i + this._height() / 2
          e.fillText(this._getQuantity(), n, r), e.restore()
        }
        _drawCancelButton(e, t, i, r) {
          ;(e.strokeStyle = this._adapter.getCancelButtonBorderColor()),
            (e.fillStyle = this._adapter.getCancelButtonBackgroundColor())
          const s = this._cancelButtonWidth(),
            o = this._height()
          e.fillRect(t + 0.5, i + 0.5, s - 1, o - 1),
            this._adapter.getBlocked() &&
              ((e.fillStyle = 'rgba(140, 140, 140, 0.75)'),
              e.fillRect(t + 0.5, i + 0.5, s - 1, o - 1)),
            e.save(),
            r &&
              e.clip &&
              (e.beginPath(), e.rect(t + 0.5, i - 0.5, s + 1, o + 1), e.clip()),
            e.strokeRect(t, i, s, o),
            e.restore()
          const a = t + s,
            d = i + o
          e.strokeStyle = this._adapter.getCancelButtonIconColor()
          const h = (this._cancelButtonWidth() - 8) / 2,
            c = (this._height() - 8) / 2
          ;(0, l.drawPoly)(
            e,
            [new n.Point(t + h, i + c), new n.Point(a - h, d - c)],
            !0,
          ),
            (0, l.drawPoly)(
              e,
              [new n.Point(a - h, i + c), new n.Point(t + h, d - c)],
              !0,
            )
        }
      }
      var v = i(80101)
      class x extends r.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._renderer = new s.CompositeRenderer()),
            (this._selectionRenderer = new v.SelectionRenderer()),
            (this._selectionData = null),
            (this._adapter = e.adapter()),
            (this._orderRenderer = new f(e.adapter())),
            this._renderer.append(this._orderRenderer),
            this._renderer.append(this._selectionRenderer)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(t), this._renderer
        }
        _updateImpl(e) {
          if (
            (super._updateImpl(),
            (this._selectionData = null),
            this.isSelectedSource() && this._points.length > 0)
          ) {
            const t = this._points[0].y,
              i = e - 3.5 - 1,
              r = this._adapter.hasMoveCallback()
                ? h.HitTarget.MovePoint
                : h.HitTarget.Regular,
              s = [new n.Point(i, t)]
            this._selectionData = {
              barSpacing: this._model.timeScale().barSpacing(),
              points: s,
              bgColors: this._lineAnchorColors(s),
              hittestResult: r,
              visible: !0,
            }
          }
          this._orderRenderer.setData({ points: this._points }),
            this._selectionRenderer.setData(this._selectionData)
        }
      }
    },
    26013: (e, t, i) => {
      i.r(t), i.d(t, { ParallelChannelPaneView: () => u })
      var n = i(86441),
        r = i(87095),
        s = i(46501),
        o = i(66103),
        a = i(19266),
        l = i(64308),
        d = i(33295),
        h = i(80657)
      const c = [
        o.PaneCursorType.Default,
        o.PaneCursorType.Default,
        o.PaneCursorType.Default,
        o.PaneCursorType.Default,
        o.PaneCursorType.VerticalResize,
        o.PaneCursorType.VerticalResize,
      ]
      class u extends d.AlertableLineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._channelRenderer = new l.ParallelChannelRenderer()),
            (this._labelTextRenderer = new h.TextRenderer()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          super._updateImpl(), (this._renderer = null)
          const e = this._source.priceScale()
          if (!e || e.isEmpty()) return
          if (0 === this._source.points().length) return
          if (this._points.length <= 1) return
          const t = this._source.properties().childs(),
            i = this._points[0],
            s = this._points[1]
          let o = null,
            l = null,
            d = null,
            h = null
          if (3 === this._points.length) {
            const e = this._points[2].y - this._points[0].y
            ;(o = i.add((0, n.point)(0, e))),
              (l = s.add((0, n.point)(0, e))),
              t.showMidline.value() &&
                ((d = i.add(o).scaled(0.5)), (h = s.add(l).scaled(0.5)))
          }
          const u = t.linewidth.value(),
            p = t.linestyle.value(),
            _ = t.linecolor.value(),
            g = {
              line1: { color: _, lineStyle: p, lineWidth: u, points: [i, s] },
              line2:
                null === o || null === l
                  ? void 0
                  : { color: _, lineStyle: p, lineWidth: u, points: [o, l] },
              middleLine:
                null === d || null === h
                  ? void 0
                  : {
                      color: t.midlinecolor.value(),
                      lineStyle: t.midlinestyle.value(),
                      lineWidth: t.midlinewidth.value(),
                      points: [d, h],
                    },
              extendLeft: t.extendLeft.value(),
              extendRight: t.extendRight.value(),
              fillBackground: t.fillBackground.value(),
              backColor: (0, r.generateColor)(
                t.backgroundColor.value(),
                t.transparency.value(),
              ),
              hittestOnBackground: !0,
            }
          this._channelRenderer.setData(g)
          const f = new a.CompositeRenderer()
          f.append(this._channelRenderer)
          const v = this._getLabelTextRenderer(i, s, o, l)
          v && f.append(v)
          const x = []
          if (
            (this._points[0] && x.push(this._points[0]),
            this._points[1] && x.push(this._points[1]),
            o && l)
          ) {
            const e = o
            ;(e.data = 2), x.push(e)
            const t = l
            ;(t.data = 3), x.push(t)
            const i = o.add(l).scaled(0.5)
            ;(i.data = 4), (i.square = !0), x.push(i)
            const n = x[0].add(x[1]).scaled(0.5)
            ;(n.data = 5), (n.square = !0), x.push(n)
          }
          const m = 3 === this._points.length && !o
          if (
            (this._model.lineBeingCreated() !== this._source ||
              m ||
              (x.pop(), x.pop()),
            f.append(
              this.createLineAnchor({ points: x, pointsCursorType: c }, 0),
            ),
            this._points.length >= 2)
          ) {
            const e = this._points
            this._addAlertRenderer(f, [e[0], e[1]])
          }
          this._renderer = f
        }
        _getLabelTextRenderer(e, t, i, n) {
          const r = this._source.properties().childs()
          if (!r.labelVisible.value() || !r.labelText.value()) return null
          let o, a
          const l = r.labelFontSize.value() / 3
          let d = 0
          switch (r.labelVertAlign.value()) {
            case 'bottom':
              !i || !n || e.y < i.y ? ((o = e), (a = t)) : ((o = i), (a = n))
              break
            case 'top':
              !i || !n || e.y > i.y ? ((o = e), (a = t)) : ((o = i), (a = n))
              break
            case 'middle':
              i && n
                ? ((o = e.add(i).scaled(0.5)), (a = t.add(n).scaled(0.5)))
                : ((o = e), (a = t)),
                (d = l)
          }
          const h = o.x < a.x ? o : a,
            c = h === o ? a : o
          let u, p
          switch (r.labelHorzAlign.value()) {
            case 'left':
              p = h
              break
            case 'right':
              p = c
              break
            default:
              p = h.add(c).scaled(0.5)
          }
          switch (r.labelVertAlign.value()) {
            case 'bottom':
              u = 'bottom'
              break
            case 'top':
              u = 'top'
              break
            case 'middle':
              u = r.showMidline.value() ? 'bottom' : 'middle'
          }
          return (
            this._labelTextRenderer.setData({
              points: [p],
              color: r.labelTextColor.value(),
              fontSize: r.labelFontSize.value(),
              text: r.labelText.value(),
              font: s.CHART_FONT_FAMILY,
              bold: r.labelBold.value(),
              italic: r.labelItalic.value(),
              vertAlign: u,
              horzAlign: r.labelHorzAlign.value(),
              offsetX: 0,
              offsetY: 0,
              boxPaddingVert: l,
              boxPaddingHorz: d,
              forceTextAlign: !0,
              angle: Math.atan((h.y - c.y) / (h.x - c.x)),
            }),
            this._labelTextRenderer
          )
        }
      }
    },
    62801: (e, t, i) => {
      i.r(t), i.d(t, { PathPaneView: () => o })
      var n = i(79797),
        r = i(19266),
        s = i(79191)
      class o extends s.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._polygonRenderer = new n.PolygonRenderer()),
            (this._renderer = new r.CompositeRenderer())
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          super._updateImpl(), this._renderer.clear()
          const e = this._source.properties().childs(),
            t = {
              points: this._points,
              color: e.lineColor.value(),
              linewidth: e.lineWidth.value(),
              linestyle: e.lineStyle.value(),
              leftend: e.leftEnd.value(),
              rightend: e.rightEnd.value(),
              filled: !1,
              backcolor: '',
              fillBackground: !1,
              transparency: 0,
            }
          this._polygonRenderer.setData(t),
            this._renderer.append(this._polygonRenderer),
            this.addAnchors(this._renderer)
        }
      }
    },
    87202: (e, t, i) => {
      i.r(t), i.d(t, { PitchfanLinePaneView: () => d })
      var n = i(18807),
        r = i(14146),
        s = i(19266),
        o = i(73436),
        a = i(99031),
        l = i(79191)
      class d extends l.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._medianRenderer = new a.TrendLineRenderer()),
            (this._sideRenderer = new a.TrendLineRenderer()),
            (this._renderer = null),
            (this._medianPoint = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            (this._renderer = null),
            0 === this._points.length)
          )
            return
          if (
            (3 === this._points.length
              ? ((this._medianPoint = this._points[1]
                  .add(this._points[2])
                  .scaled(0.5)),
                (this._medianPoint.data = 3))
              : 2 === this._points.length
                ? ((this._medianPoint = this._points[1].clone()),
                  (this._medianPoint.data = 3))
                : ((this._medianPoint = this._points[0].clone()),
                  (this._medianPoint.data = 3)),
            this._points.length < 2)
          )
            return
          if (!this._medianPoint) return
          const e = new s.CompositeRenderer(),
            t = this._source.properties().childs(),
            i = t.median.childs(),
            l = {
              points: [this._points[0], this._medianPoint],
              color: i.color.value(),
              linewidth: i.linewidth.value(),
              linestyle: i.linestyle.value(),
              extendleft: !1,
              extendright: !0,
              leftend: o.LineEnd.Normal,
              rightend: o.LineEnd.Normal,
            }
          if (
            (this._medianRenderer.setData(l),
            e.append(this._medianRenderer),
            this._points.length < 3)
          )
            return this.addAnchors(e), void (this._renderer = e)
          const d = {
            points: [this._points[1], this._points[2]],
            color: i.color.value(),
            linewidth: i.linewidth.value(),
            linestyle: i.linestyle.value(),
            extendleft: !1,
            extendright: !1,
            leftend: o.LineEnd.Normal,
            rightend: o.LineEnd.Normal,
          }
          this._sideRenderer.setData(d), e.append(this._sideRenderer)
          let h = 0
          const c = this._points[2].subtract(this._points[1]).scaled(0.5),
            u = t.fillBackground.value(),
            p = t.transparency.value()
          for (let t = 0; t <= 8; t++) {
            const i = 'level' + t,
              s = this._source.properties().child(i)
            if (s.childs().visible.value()) {
              const i = this._medianPoint.addScaled(
                  c,
                  s.childs().coeff.value(),
                ),
                l = this._medianPoint.addScaled(c, -s.childs().coeff.value())
              if (u) {
                {
                  const t = {
                      p1: this._points[0],
                      p2: i,
                      p3: this._points[0],
                      p4: this._medianPoint.addScaled(c, h),
                      color: s.childs().color.value(),
                      transparency: p,
                      hittestOnBackground: !0,
                      extendLeft: !1,
                    },
                    n = new r.ChannelRenderer()
                  n.setData(t), e.append(n)
                }
                {
                  const t = {
                      p1: this._points[0],
                      p2: l,
                      p3: this._points[0],
                      p4: this._medianPoint.addScaled(c, -h),
                      color: s.childs().color.value(),
                      transparency: p,
                      hittestOnBackground: !0,
                      extendLeft: !1,
                    },
                    i = new r.ChannelRenderer()
                  i.setData(t), e.append(i)
                }
              }
              h = s.childs().coeff.value()
              {
                const r = {
                    points: [this._points[0], i],
                    color: s.childs().color.value(),
                    linewidth: s.childs().linewidth.value(),
                    linestyle: s.childs().linestyle.value(),
                    extendleft: !1,
                    extendright: !0,
                    leftend: o.LineEnd.Normal,
                    rightend: o.LineEnd.Normal,
                  },
                  l = new a.TrendLineRenderer()
                l.setData(r),
                  l.setHitTest(
                    new n.HitTestResult(n.HitTarget.MovePoint, void 0, t),
                  ),
                  e.append(l)
              }
              {
                const i = {
                    points: [this._points[0], l],
                    color: s.childs().color.value(),
                    linewidth: s.childs().linewidth.value(),
                    linestyle: s.childs().linestyle.value(),
                    extendleft: !1,
                    extendright: !0,
                    leftend: o.LineEnd.Normal,
                    rightend: o.LineEnd.Normal,
                  },
                  r = new a.TrendLineRenderer()
                r.setData(i),
                  r.setHitTest(
                    new n.HitTestResult(n.HitTarget.MovePoint, void 0, t),
                  ),
                  e.append(r)
              }
            }
          }
          this.addAnchors(e), (this._renderer = e)
        }
      }
    },
    95337: (e, t, i) => {
      i.r(t),
        i.d(t, {
          InsidePitchforkLinePaneView: () => p,
          PitchforkLinePaneView: () => h,
          SchiffPitchfork2LinePaneView: () => u,
          SchiffPitchforkLinePaneView: () => c,
        })
      var n = i(86441),
        r = i(18807),
        s = i(14146),
        o = i(19266),
        a = i(73436),
        l = i(99031),
        d = i(79191)
      class h extends d.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._medianRenderer = new l.TrendLineRenderer()),
            (this._sideRenderer = new l.TrendLineRenderer()),
            (this._renderer = null),
            (this._medianPoint = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          super._updateImpl(),
            (this._renderer = null),
            0 !== this._points.length &&
              (3 === this._points.length
                ? ((this._medianPoint = this._points[1]
                    .add(this._points[2])
                    .scaled(0.5)),
                  (this._medianPoint.data = 3))
                : 2 === this._points.length
                  ? ((this._medianPoint = this._points[1].clone()),
                    (this._medianPoint.data = 3))
                  : ((this._medianPoint = this._points[0].clone()),
                    (this._medianPoint.data = 3)),
              this._updateRenderer())
        }
        _updateRenderer() {
          if (this._points.length < 2) return
          if (!this._medianPoint) return
          const e = this._source.properties(),
            t = e.childs().median.childs(),
            i = new o.CompositeRenderer(),
            n = {
              points: [this._points[0], this._medianPoint],
              color: t.color.value(),
              linewidth: t.linewidth.value(),
              linestyle: t.linestyle.value(),
              extendleft: e.childs().extendLines.value(),
              extendright: !0,
              leftend: a.LineEnd.Normal,
              rightend: a.LineEnd.Normal,
            }
          if (
            (this._medianRenderer.setData(n),
            i.append(this._medianRenderer),
            this._points.length < 3)
          )
            return this.addAnchors(i), void (this._renderer = i)
          const d = {
            points: [this._points[1], this._points[2]],
            color: t.color.value(),
            linewidth: t.linewidth.value(),
            linestyle: t.linestyle.value(),
            extendleft: !1,
            extendright: !1,
            leftend: a.LineEnd.Normal,
            rightend: a.LineEnd.Normal,
          }
          this._sideRenderer.setData(d), i.append(this._sideRenderer)
          const h = this._points[2].subtract(this._points[1]).scaled(0.5),
            c = this._medianPoint.subtract(this._points[0])
          let u = 0
          const p = e.childs().fillBackground.value(),
            _ = e.childs().transparency.value()
          for (let t = 0; t <= 8; t++) {
            const n = 'level' + t,
              o = e.childs()[n]
            if (o.childs().visible.value()) {
              const n = this._medianPoint.addScaled(
                  h,
                  o.childs().coeff.value(),
                ),
                d = n.add(c),
                g = this._medianPoint.addScaled(h, -o.childs().coeff.value()),
                f = g.add(c)
              if (p) {
                {
                  const t = this._medianPoint.addScaled(h, u),
                    r = {
                      p1: n,
                      p2: d,
                      p3: t,
                      p4: t.add(c),
                      color: o.childs().color.value(),
                      transparency: _,
                      hittestOnBackground: !0,
                      extendLeft: e.childs().extendLines.value(),
                    },
                    a = new s.ChannelRenderer()
                  a.setData(r), i.append(a)
                }
                {
                  const t = this._medianPoint.addScaled(h, -u),
                    n = {
                      p1: g,
                      p2: f,
                      p3: t,
                      p4: t.add(c),
                      color: o.childs().color.value(),
                      transparency: _,
                      hittestOnBackground: !0,
                      extendLeft: e.childs().extendLines.value(),
                    },
                    r = new s.ChannelRenderer()
                  r.setData(n), i.append(r)
                }
              }
              u = o.childs().coeff.value()
              const v = {
                  points: [n, d],
                  color: o.childs().color.value(),
                  linewidth: o.childs().linewidth.value(),
                  linestyle: o.childs().linestyle.value(),
                  extendleft: e.childs().extendLines.value(),
                  extendright: !0,
                  leftend: a.LineEnd.Normal,
                  rightend: a.LineEnd.Normal,
                },
                x = new l.TrendLineRenderer()
              x.setData(v),
                x.setHitTest(
                  new r.HitTestResult(r.HitTarget.MovePoint, void 0, t),
                ),
                i.append(x)
              const m = {
                  points: [g, f],
                  color: o.childs().color.value(),
                  linewidth: o.childs().linewidth.value(),
                  linestyle: o.childs().linestyle.value(),
                  extendleft: e.childs().extendLines.value(),
                  extendright: !0,
                  leftend: a.LineEnd.Normal,
                  rightend: a.LineEnd.Normal,
                },
                w = new l.TrendLineRenderer()
              w.setData(m),
                w.setHitTest(
                  new r.HitTestResult(r.HitTarget.MovePoint, void 0, t),
                ),
                i.append(w)
            }
          }
          this.addAnchors(i), (this._renderer = i)
        }
      }
      class c extends h {
        constructor() {
          super(...arguments),
            (this._modifiedBase = null),
            (this._backSideRenderer = new l.TrendLineRenderer())
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateRenderer() {
          if (this._points.length < 2) return
          this._calcMofifiedBase()
          const e = this._source.properties(),
            t = new o.CompositeRenderer(),
            i = e.childs().median.childs()
          {
            const e = {
              points: [this._points[0], this._points[1]],
              color: i.color.value(),
              linewidth: i.linewidth.value(),
              linestyle: i.linestyle.value(),
              extendleft: !1,
              extendright: !1,
              leftend: a.LineEnd.Normal,
              rightend: a.LineEnd.Normal,
            }
            if (
              (this._backSideRenderer.setData(e),
              t.append(this._backSideRenderer),
              !this._medianPoint || !this._modifiedBase)
            )
              return this.addAnchors(t), void (this._renderer = t)
          }
          {
            const n = {
              points: [this._modifiedBase, this._medianPoint],
              color: i.color.value(),
              linewidth: i.linewidth.value(),
              linestyle: i.linestyle.value(),
              extendleft: e.childs().extendLines.value(),
              extendright: !0,
              leftend: a.LineEnd.Normal,
              rightend: a.LineEnd.Normal,
            }
            if (
              (this._medianRenderer.setData(n),
              t.append(this._medianRenderer),
              this._points.length < 3)
            )
              return this.addAnchors(t), void (this._renderer = t)
          }
          {
            const e = {
              points: [this._points[1], this._points[2]],
              color: i.color.value(),
              linewidth: i.linewidth.value(),
              linestyle: i.linestyle.value(),
              extendleft: !1,
              extendright: !1,
              leftend: a.LineEnd.Normal,
              rightend: a.LineEnd.Normal,
            }
            this._sideRenderer.setData(e), t.append(this._sideRenderer)
          }
          {
            const i = this._points[2].subtract(this._points[1]).scaled(0.5),
              n = this._medianPoint.subtract(this._modifiedBase)
            let o = 0
            const d = e.childs().fillBackground.value(),
              h = e.childs().transparency.value()
            for (let c = 0; c <= 8; c++) {
              const u = 'level' + c,
                p = e.child(u)
              if (p.childs().visible.value()) {
                const u = this._medianPoint.addScaled(
                    i,
                    p.childs().coeff.value(),
                  ),
                  _ = u.add(n),
                  g = this._medianPoint.addScaled(i, -p.childs().coeff.value()),
                  f = g.add(n)
                if (d) {
                  const r = this._medianPoint.addScaled(i, o)
                  {
                    const i = {
                        p1: u,
                        p2: _,
                        p3: r,
                        p4: r.add(n),
                        color: p.childs().color.value(),
                        transparency: h,
                        hittestOnBackground: !0,
                        extendLeft: e.childs().extendLines.value(),
                      },
                      o = new s.ChannelRenderer()
                    o.setData(i), t.append(o)
                  }
                  {
                    const r = this._medianPoint.addScaled(i, -o),
                      a = {
                        p1: g,
                        p2: f,
                        p3: r,
                        p4: r.add(n),
                        color: p.childs().color.value(),
                        transparency: h,
                        hittestOnBackground: !0,
                        extendLeft: e.childs().extendLines.value(),
                      },
                      l = new s.ChannelRenderer()
                    l.setData(a), t.append(l)
                  }
                }
                o = p.childs().coeff.value()
                const v = {
                    points: [u, _],
                    color: p.childs().color.value(),
                    linewidth: p.childs().linewidth.value(),
                    linestyle: p.childs().linestyle.value(),
                    extendleft: e.childs().extendLines.value(),
                    extendright: !0,
                    leftend: a.LineEnd.Normal,
                    rightend: a.LineEnd.Normal,
                  },
                  x = new l.TrendLineRenderer()
                x.setData(v),
                  x.setHitTest(
                    new r.HitTestResult(r.HitTarget.MovePoint, void 0, c),
                  ),
                  t.append(x)
                const m = {
                    points: [g, f],
                    color: p.childs().color.value(),
                    linewidth: p.childs().linewidth.value(),
                    linestyle: p.childs().linestyle.value(),
                    extendleft: e.childs().extendLines.value(),
                    extendright: !0,
                    leftend: a.LineEnd.Normal,
                    rightend: a.LineEnd.Normal,
                  },
                  w = new l.TrendLineRenderer()
                w.setData(m),
                  w.setHitTest(
                    new r.HitTestResult(r.HitTarget.MovePoint, void 0, c),
                  ),
                  t.append(w)
              }
            }
          }
          this.addAnchors(t), (this._renderer = t)
        }
        _calcMofifiedBase() {
          this._points.length > 1 &&
            (this._modifiedBase = this._points[0]
              .add(this._points[1])
              .scaled(0.5))
        }
      }
      class u extends c {
        _calcMofifiedBase() {
          if (this._points.length > 2) {
            const e = this._points[0].x,
              t = 0.5 * (this._points[0].y + this._points[1].y),
              i = new n.Point(e, t)
            this._modifiedBase = i
          }
        }
      }
      class p extends h {
        constructor() {
          super(...arguments),
            (this._backSideRenderer = new l.TrendLineRenderer()),
            (this._centerRenderer = new l.TrendLineRenderer()),
            (this._modifiedBase = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateRenderer() {
          if (
            (this._points.length > 1 &&
              (this._modifiedBase = this._points[0]
                .add(this._points[1])
                .scaled(0.5)),
            this._points.length < 2)
          )
            return
          const e = new o.CompositeRenderer()
          if (!this._medianPoint || !this._modifiedBase)
            return void this.addAnchors(e)
          const t = this._source.properties(),
            i = t.childs().median.childs()
          if (3 === this._points.length) {
            const t = {
              points: [this._modifiedBase, this._points[2]],
              color: i.color.value(),
              linewidth: i.linewidth.value(),
              linestyle: i.linestyle.value(),
              extendleft: !1,
              extendright: !1,
              leftend: a.LineEnd.Normal,
              rightend: a.LineEnd.Normal,
            }
            this._medianRenderer.setData(t), e.append(this._medianRenderer)
          }
          {
            const t = {
              points: [this._points[0], this._points[1]],
              color: i.color.value(),
              linewidth: i.linewidth.value(),
              linestyle: i.linestyle.value(),
              extendleft: !1,
              extendright: !1,
              leftend: a.LineEnd.Normal,
              rightend: a.LineEnd.Normal,
            }
            if (
              (this._backSideRenderer.setData(t),
              e.append(this._backSideRenderer),
              this._points.length < 3)
            )
              return this.addAnchors(e), void (this._renderer = e)
          }
          {
            const t = {
              points: [this._points[1], this._points[2]],
              color: i.color.value(),
              linewidth: i.linewidth.value(),
              linestyle: i.linestyle.value(),
              extendleft: !1,
              extendright: !1,
              leftend: a.LineEnd.Normal,
              rightend: a.LineEnd.Normal,
            }
            this._sideRenderer.setData(t), e.append(this._sideRenderer)
          }
          {
            const n = this._points[2].subtract(this._points[1]).scaled(0.5),
              o = this._points[2].subtract(this._modifiedBase)
            let d = 0
            const h = t.childs().fillBackground.value(),
              c = t.childs().transparency.value(),
              u = {
                points: [this._medianPoint, this._medianPoint.add(o)],
                color: i.color.value(),
                linewidth: i.linewidth.value(),
                linestyle: i.linestyle.value(),
                extendleft: t.childs().extendLines.value(),
                extendright: !0,
                leftend: a.LineEnd.Normal,
                rightend: a.LineEnd.Normal,
              }
            this._centerRenderer.setData(u), e.append(this._centerRenderer)
            for (let i = 0; i <= 8; i++) {
              const u = 'level' + i,
                p = t.child(u).childs()
              if (p.visible.value()) {
                const u = this._medianPoint.addScaled(n, p.coeff.value()),
                  _ = u.add(o),
                  g = this._medianPoint.addScaled(n, -p.coeff.value()),
                  f = g.add(o)
                if (h) {
                  {
                    const i = this._medianPoint.addScaled(n, d),
                      r = {
                        p1: u,
                        p2: _,
                        p3: i,
                        p4: i.add(o),
                        color: p.color.value(),
                        transparency: c,
                        hittestOnBackground: !0,
                        extendLeft: t.childs().extendLines.value(),
                      },
                      a = new s.ChannelRenderer()
                    a.setData(r), e.append(a)
                  }
                  {
                    const i = this._medianPoint.addScaled(n, -d),
                      r = {
                        p1: g,
                        p2: f,
                        p3: i,
                        p4: i.add(o),
                        color: p.color.value(),
                        transparency: c,
                        hittestOnBackground: !0,
                        extendLeft: t.childs().extendLines.value(),
                      },
                      a = new s.ChannelRenderer()
                    a.setData(r), e.append(a)
                  }
                }
                d = p.coeff.value()
                const v = {
                    points: [u, _],
                    color: p.color.value(),
                    linewidth: p.linewidth.value(),
                    linestyle: p.linestyle.value(),
                    extendleft: t.childs().extendLines.value(),
                    extendright: !0,
                    leftend: a.LineEnd.Normal,
                    rightend: a.LineEnd.Normal,
                  },
                  x = new l.TrendLineRenderer()
                x.setData(v),
                  x.setHitTest(
                    new r.HitTestResult(r.HitTarget.MovePoint, void 0, i),
                  ),
                  e.append(x)
                const m = {
                    points: [g, f],
                    color: p.color.value(),
                    linewidth: p.linewidth.value(),
                    linestyle: p.linestyle.value(),
                    extendleft: t.childs().extendLines.value(),
                    extendright: !0,
                    leftend: a.LineEnd.Normal,
                    rightend: a.LineEnd.Normal,
                  },
                  w = new l.TrendLineRenderer()
                w.setData(m),
                  w.setHitTest(
                    new r.HitTestResult(r.HitTarget.MovePoint, void 0, i),
                  ),
                  e.append(w)
              }
            }
          }
          this.addAnchors(e), (this._renderer = e)
        }
      }
    },
    50253: (e, t, i) => {
      i.r(t),
        i.d(t, {
          PolylinePaneView: () => o,
        })
      var n = i(79797),
        r = i(19266),
        s = i(79191)
      class o extends s.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._polygonRenderer = new n.PolygonRenderer()),
            (this._renderer = new r.CompositeRenderer())
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          super._updateImpl(), this._renderer.clear()
          const e = this._source.properties().childs(),
            t = {
              points: this._points,
              color: e.linecolor.value(),
              linewidth: e.linewidth.value(),
              linestyle: e.linestyle.value(),
              filled: e.filled.value(),
              backcolor: e.backgroundColor.value(),
              fillBackground: e.fillBackground.value(),
              transparency: e.transparency.value(),
            }
          this._polygonRenderer.setData(t),
            this._renderer.append(this._polygonRenderer),
            this.addAnchors(this._renderer)
        }
      }
    },
    46258: (e, t, i) => {
      var n = i(79191).LineSourcePaneView,
        r = i(47043),
        s = i(18807).HitTestResult,
        o = i(18807).HitTarget,
        a = i(82161).splitThousands,
        l = i(38223),
        d = i(53180).appendEllipsis,
        h = i(15187).MediaCoordinatesPaneRenderer,
        c = i(14002).orderLineLocation
      const { setLineStyle: u, drawLine: p, drawPoly: _ } = i(68441),
        { LINESTYLE_SOLID: g } = i(79849)
      class f extends h {
        constructor(e, t) {
          super(), (this._data = null), (this._cache = e), (this._adapter = t)
        }
        setData(e) {
          this._data = e
        }
        _height() {
          return Math.max(
            20,
            1 +
              Math.max(
                r.fontHeight(this._adapter.getBodyFont()),
                r.fontHeight(this._adapter.getQuantityFont()),
              ),
          )
        }
        _bodyWidth(e) {
          if (0 === this._adapter.getText().length) return 0
          e.save(), (e.font = this._adapter.getBodyFont())
          var t = e.measureText(this._adapter.getText()).width
          return e.restore(), Math.round(10 + t)
        }
        _getQuantity() {
          var e = this._adapter.getQuantity()
          return isNaN(e) ? e : a(this._adapter.getQuantity(), ' ')
        }
        _quantityWidth(e) {
          if (0 === this._getQuantity().length) return 0
          e.save(), (e.font = this._adapter.getQuantityFont())
          var t = e.measureText(this._getQuantity()).width
          return e.restore(), Math.round(Math.max(this._height(), 10 + t))
        }
        _reverseButtonWidth() {
          return this._adapter.isOnReverseCallbackPresent() ? this._height() : 0
        }
        _closeButtonWidth() {
          return this._adapter.isOnCloseCallbackPresent() ? this._height() : 0
        }
        _drawLines(e, t, i, n, r) {
          e.save(),
            (e.strokeStyle = this._adapter.getLineColor()),
            u(e, this._adapter.getLineStyle()),
            (e.lineWidth = this._adapter.getLineWidth()),
            p(e, i, n, r, n),
            this._adapter.getExtendLeft() && p(e, 0, n, t, n),
            e.restore()
        }
        _drawBody(e, t, i) {
          ;(e.strokeStyle = this._adapter.getBodyBorderColor()),
            (e.fillStyle = this._adapter.getBodyBackgroundColor())
          var n = this._bodyWidth(e),
            r = this._height()
          e.fillRect(t + 0.5, i + 0.5, n - 1, r - 1), e.strokeRect(t, i, n, r)
        }
        _drawBodyText(e, t, i) {
          e.save(),
            (e.textAlign = 'center'),
            (e.textBaseline = 'middle'),
            (e.font = this._adapter.getBodyFont()),
            (e.fillStyle = this._adapter.getBodyTextColor())
          var n = t + this._bodyWidth(e) / 2,
            r = i + this._height() / 2
          e.fillText(this._adapter.getText(), n, r), e.restore()
        }
        _drawQuantity(e, t, i) {
          ;(e.strokeStyle = this._adapter.getQuantityBorderColor()),
            (e.fillStyle = this._adapter.getQuantityBackgroundColor())
          var n = this._quantityWidth(e),
            r = this._height()
          e.fillRect(t + 0.5, i + 0.5, n - 1, r - 1), e.strokeRect(t, i, n, r)
        }
        _drawQuantityText(e, t, i) {
          e.save(),
            (e.textAlign = 'center'),
            (e.textBaseline = 'middle'),
            (e.font = this._adapter.getQuantityFont()),
            (e.fillStyle = this._adapter.getQuantityTextColor())
          var n = t + this._quantityWidth(e) / 2,
            r = i + this._height() / 2
          e.fillText(l.startWithLTR(this._getQuantity() + ''), n, r),
            e.restore()
        }
        _drawReverseButton(e, t, i) {
          e.save(),
            (e.strokeStyle = this._adapter.getReverseButtonBorderColor()),
            (e.fillStyle = this._adapter.getReverseButtonBackgroundColor())
          var n = this._reverseButtonWidth(),
            r = this._height()
          e.fillRect(t + 0.5, i + 0.5, n - 1, r - 1),
            e.strokeRect(t, i, n, r),
            (e.strokeStyle = this._adapter.getReverseButtonIconColor())
          var s = (e, t) => {
              u(e, g), p(e, 0, 0, 0, t), p(e, -1, 1, 1, 1), p(e, -2, 2, 2, 2)
            },
            o = t + Math.round((this._reverseButtonWidth() - 6) / 2),
            a = i + 5
          e.save(),
            e.translate(o, a),
            s(e, 10),
            e.translate(6, 10),
            e.rotate(Math.PI),
            s(e, 10),
            e.restore(),
            this._adapter._blocked &&
              ((e.fillStyle = 'rgba(140, 140, 140, 0.75)'),
              e.fillRect(t + 0.5, i + 0.5, n - 1, r - 1)),
            e.restore()
        }
        _drawCloseButton(e, t, i) {
          e.save(),
            (e.strokeStyle = this._adapter.getCloseButtonBorderColor()),
            (e.fillStyle = this._adapter.getCloseButtonBackgroundColor())
          var n = this._closeButtonWidth(),
            r = this._height()
          e.fillRect(t + 0.5, i + 0.5, n - 1, r - 1), e.strokeRect(t, i, n, r)
          var s = t + n,
            o = i + r
          e.strokeStyle = this._adapter.getCloseButtonIconColor()
          var a = (this._closeButtonWidth() - 8) / 2,
            l = (this._height() - 8) / 2
          _(
            e,
            [
              { x: t + a, y: i + l },
              { x: s - a, y: o - l },
            ],
            !0,
          ),
            _(
              e,
              [
                { x: s - a, y: i + l },
                { x: t + a, y: o - l },
              ],
              !0,
            ),
            this._adapter._blocked &&
              ((e.fillStyle = 'rgba(140, 140, 140, 0.75)'),
              e.fillRect(t + 0.5, i + 0.5, n - 1, r - 1)),
            e.restore()
        }
        _drawImpl(e) {
          if (
            null === this._data ||
            !this._data.points ||
            this._data.points.length < 1
          )
            return
          var t = e.context,
            i = this._data.width,
            n = this._bodyWidth(t),
            r = this._quantityWidth(t),
            s = this._reverseButtonWidth(t),
            o = n + r + s + this._closeButtonWidth()
          const { left: a, right: l } = c(this._adapter, i, o)
          var d = Math.round(this._data.points[0].y),
            h = Math.round(d - (this._height() + 1) / 2)
          ;(this._cache.bodyRight = a + n),
            (this._cache.quantityRight = this._cache.bodyRight + r),
            (this._cache.reverseButtonRight = this._cache.quantityRight + s),
            (this._cache.top = h),
            (this._cache.bottom = h + this._height()),
            (this._cache.left = a),
            (this._cache.right = l),
            this._drawLines(t, a, l, d, i),
            0 !== n && (this._drawBody(t, a, h), this._drawBodyText(t, a, h)),
            0 !== r &&
              (this._drawQuantity(t, this._cache.bodyRight, h),
              this._drawQuantityText(t, this._cache.bodyRight, h)),
            0 !== s && this._drawReverseButton(t, this._cache.quantityRight, h),
            0 !== this._closeButtonWidth() &&
              this._drawCloseButton(t, this._cache.reverseButtonRight, h)
        }
        hitTest(e) {
          return null === this._data ||
            0 === this._data.points.length ||
            e.y < this._cache.top ||
            e.y > this._cache.bottom ||
            e.x < this._cache.left ||
            this._cache.right < e.x
            ? null
            : this._adapter._blocked
              ? new s(o.Custom, {})
              : e.x >= this._cache.bodyRight &&
                  e.x < this._cache.quantityRight &&
                  this._adapter._onModifyCallback
                ? new s(o.Custom, {
                    clickHandler: this._adapter.callOnModify.bind(
                      this._adapter,
                    ),
                    tapHandler: this._adapter.callOnModify.bind(this._adapter),
                    tooltip: {
                      text:
                        this._adapter.getProtectTooltip() ||
                        d(i.tf(null, void 0, i(11810))),
                      rect: {
                        x: this._cache.bodyRight,
                        y: this._cache.top,
                        w: this._cache.quantityRight - this._cache.bodyRight,
                        h: this._cache.bottom - this._cache.top,
                      },
                    },
                  })
                : e.x >= this._cache.quantityRight &&
                    e.x < this._cache.reverseButtonRight
                  ? new s(o.Custom, {
                      clickHandler: this._adapter.callOnReverse.bind(
                        this._adapter,
                      ),
                      tapHandler: this._adapter.callOnReverse.bind(
                        this._adapter,
                      ),
                      tooltip: {
                        text:
                          this._adapter.getReverseTooltip() ||
                          i.tf(null, void 0, i(19780)),
                        rect: {
                          x: this._cache.quantityRight,
                          y: this._cache.top,
                          w:
                            this._cache.reverseButtonRight -
                            this._cache.quantityRight,
                          h: this._cache.bottom - this._cache.top,
                        },
                      },
                    })
                  : e.x >= this._cache.reverseButtonRight &&
                      e.x < this._cache.right
                    ? new s(o.Custom, {
                        clickHandler: this._adapter.callOnClose.bind(
                          this._adapter,
                        ),
                        tapHandler: this._adapter.callOnClose.bind(
                          this._adapter,
                        ),
                        tooltip: {
                          text:
                            this._adapter.getCloseTooltip() ||
                            i.tf(null, void 0, i(37431)),
                          rect: {
                            x: this._cache.reverseButtonRight,
                            y: this._cache.top,
                            w:
                              this._cache.right -
                              this._cache.reverseButtonRight,
                            h: this._cache.bottom - this._cache.top,
                          },
                        },
                      })
                    : new s(o.Custom, {
                        clickHandler: () => {},
                        tapHandler: () => {},
                        tooltip: {
                          text: this._adapter.getTooltip(),
                          rect: {
                            x: this._cache.left,
                            y: this._cache.top,
                            w: this._cache.bodyRight - this._cache.left,
                            h: this._cache.bottom - this._cache.top,
                          },
                        },
                      })
        }
      }
      t.PositionPaneView = class extends n {
        constructor(e, t) {
          super(e, t),
            (this._rendererCache = {}),
            (this._renderer = new f(this._rendererCache, e._adapter))
        }
        renderer(e, t) {
          return (
            this._invalidated && this._updateImpl(),
            this._renderer.setData({
              points: this._points,
              width: this._model.timeScale().width(),
            }),
            this._renderer
          )
        }
      }
    },
    75061: (e, t, i) => {
      var n = i(86441).Point,
        r = i(79191).LineSourcePaneView,
        s = i(36274).Interval,
        o = i(18807).HitTestResult,
        a = i(18807).HitTarget,
        l = i(19266).CompositeRenderer,
        d = i(12767).getImage,
        h = i(37160),
        c = i(93572).PercentageFormatter,
        u = i(53741).DateFormatter,
        p = i(79206).TimeFormatter,
        _ = i(79206).hourMinuteFormat,
        g = i(79206).hourMinuteSecondFormat,
        f = i(2043).TimeSpanFormatter,
        v = i(87095),
        x = i(21316),
        m = i(74359).calcTextHorizontalShift,
        w = i(38223).isRtl,
        R = i(68441).drawRoundRect,
        y = i(29764).makeFont,
        b = i(15187).MediaCoordinatesPaneRenderer,
        T = i(38223),
        P = T.forceLTRStr,
        L = T.startWithLTR,
        C = i(46501).CHART_FONT_FAMILY
      class S extends b {
        constructor() {
          super(),
            (this._data = null),
            (this._font = C),
            (this._targetFontSize1 = 14),
            (this._targetFontSize2 = 11),
            (this._sourceFontSize1 = 12),
            (this._sourceFontSize2 = 10),
            (this._arrowOffset = 6),
            (this._arrowWidth = 5),
            (this._arrowHeight = 5),
            (this._radius = 3),
            (this._sourceWidth = void 0),
            (this._sourceHeight = void 0),
            (this._sourceRectLeftOffset = void 0),
            (this._targetWidth = void 0),
            (this._targetHeight = void 0),
            (this._targetRectLeftOffset = void 0)
        }
        setData(e) {
          this._data = e
        }
        drawBalloon(e, t, i, r, s, o) {
          var a = o || 20
          if ((e.beginPath(), 'down' === s)) {
            var l = new n(
              t.x - a,
              t.y - this._arrowOffset - this._arrowHeight - r,
            )
            return (
              e.moveTo(l.x + this._radius, l.y),
              e.lineTo(l.x + i - this._radius, l.y),
              e.arcTo(l.x + i, l.y, l.x + i, l.y + this._radius, this._radius),
              e.lineTo(l.x + i, l.y + r - this._radius),
              e.arcTo(
                l.x + i,
                l.y + r,
                l.x + i - this._radius,
                l.y + r,
                this._radius,
              ),
              e.lineTo(l.x + a + this._arrowWidth, l.y + r),
              e.lineTo(l.x + a, l.y + r + this._arrowHeight),
              e.lineTo(l.x + a - this._arrowWidth, l.y + r),
              e.lineTo(l.x + this._radius, l.y + r),
              e.arcTo(l.x, l.y + r, l.x, l.y + r - this._radius, this._radius),
              e.lineTo(l.x, l.y + this._radius),
              e.arcTo(l.x, l.y, l.x + this._radius, l.y, this._radius),
              l
            )
          }
          var d = new n(
            t.x - a,
            t.y + this._arrowOffset + this._arrowHeight + r,
          )
          return (
            e.moveTo(d.x + this._radius, d.y),
            e.lineTo(d.x + i - this._radius, d.y),
            e.arcTo(d.x + i, d.y, d.x + i, d.y - this._radius, this._radius),
            e.lineTo(d.x + i, d.y - r + this._radius),
            e.arcTo(
              d.x + i,
              d.y - r,
              d.x + i - this._radius,
              d.y - r,
              this._radius,
            ),
            e.lineTo(d.x + a + this._arrowWidth, d.y - r),
            e.lineTo(d.x + a, d.y - r - this._arrowHeight),
            e.lineTo(d.x + a - this._arrowWidth, d.y - r),
            e.lineTo(d.x + this._radius, d.y - r),
            e.arcTo(d.x, d.y - r, d.x, d.y - r + this._radius, this._radius),
            e.lineTo(d.x, d.y - this._radius),
            e.arcTo(d.x, d.y, d.x + this._radius, d.y, this._radius),
            new n(d.x, d.y - r)
          )
        }
        drawTargetLabel(e) {
          e.save(), e.translate(0.5, 0.5)
          var t = y(this._targetFontSize1, this._font, 'normal'),
            n = y(this._targetFontSize2, this._font, 'normal'),
            r = this._data.targetLine1,
            s = this._data.targetLine2,
            o = this._data.targetLine3,
            a = this._data.targetLine4
          e.font = t
          var l = e.measureText(r).width,
            d = e.measureText(s).width,
            h = e.measureText(' ').width
          e.font = n
          var c = e.measureText(o).width,
            u = e.measureText(a).width,
            p = e.measureText(' ').width,
            _ = (this._data.clockWhite && this._data.clockWhite.width) || 0
          ;(this._targetWidth = Math.max(l + d + h, c + u + _ + 2 * p) + 8 + 4),
            (this._targetHeight =
              this._targetFontSize1 + this._targetFontSize2 + 9 + 4)
          var g = this._data.points[1],
            f = g.x + this._targetWidth - e.canvas.width + 5
          this._targetRectLeftOffset = Math.max(
            20,
            Math.min(this._targetWidth - 15, f),
          )
          var b = 'up' === this._data.direction ? 'down' : 'up',
            T = this.drawBalloon(
              e,
              g,
              this._targetWidth,
              this._targetHeight,
              b,
              this._targetRectLeftOffset,
            )
          ;(e.fillStyle = v.generateColor(
            this._data.targetBackColor,
            this._data.transparency,
          )),
            e.fill(),
            (e.lineWidth = 2),
            (e.strokeStyle = v.generateColor(
              this._data.targetStrokeColor,
              this._data.transparency,
            )),
            e.stroke()
          e.beginPath(),
            e.arc(g.x, g.y, 3, 0, 2 * Math.PI, !1),
            (e.fillStyle = this._data.centersColor),
            e.fill(),
            (e.textBaseline = 'top'),
            (e.fillStyle = this._data.targetTextColor)
          var P = 2 + T.x + 4,
            L = 2 + T.y + 3,
            C = this._targetWidth - 8 - 4
          ;(e.font = t), (e.textAlign = w() ? 'right' : 'left')
          var S = m(e, C - d - h)
          e.fillText(r, P + S, L)
          var M = m(e, C - l)
          e.fillText(s, P + l + h + M, L), (e.font = n)
          var I = L + this._targetFontSize1 + 3,
            A = m(e, C - u - _ - p)
          e.fillText(o, P + A, I)
          var k = m(e, C - c - p - _ - u)
          this._data.clockWhite &&
            e.drawImage(this._data.clockWhite, P + c + p + k, I + 1)
          var N = m(e, C - c - _)
          if ((e.fillText(a, P + c + _ + 2 * p + N, I), this._data.status)) {
            var D, B, z, E
            switch (
              ((e.font = y(this._targetFontSize1, this._font, 'bold')),
              this._data.status)
            ) {
              case x.AlertStatus.Success:
                ;(D = i.tf(null, void 0, i(26787))),
                  (B = v.generateColor(
                    this._data.successBackground,
                    this._data.transparency,
                  )),
                  (z = this._data.successTextColor),
                  (E = this._data.successIcon)
                break
              case x.AlertStatus.Failure:
                ;(D = i.tf(null, void 0, i(968))),
                  (B = v.generateColor(
                    this._data.failureBackground,
                    this._data.transparency,
                  )),
                  (z = this._data.failureTextColor),
                  (E = this._data.failureIcon)
            }
            var H = this._targetFontSize1 + 4,
              V = e.measureText(D).width,
              O = Math.round((this._targetWidth - V) / 2),
              W = m(e, V)
            ;(e.fillStyle = B),
              'up' === this._data.direction
                ? (R(e, T.x - 1, T.y - H - 2, this._targetWidth + 2, H, 5),
                  e.fill(),
                  (e.fillStyle = z),
                  e.fillText(D, T.x + O + W, T.y - H + 1),
                  E &&
                    e.drawImage(
                      E,
                      T.x + O - E.width - 4,
                      T.y - H - 2 + Math.abs(H - E.height) / 2,
                    ))
                : (R(
                    e,
                    T.x - 1,
                    T.y + this._targetHeight + 2,
                    this._targetWidth + 2,
                    H,
                    5,
                  ),
                  e.fill(),
                  (e.fillStyle = z),
                  e.fillText(D, T.x + O + W, T.y + this._targetHeight + 5),
                  E &&
                    e.drawImage(
                      E,
                      T.x + O - E.width - 4,
                      T.y +
                        this._targetHeight +
                        10 -
                        Math.abs(H - E.height) / 2,
                    )),
              e.restore()
          } else e.restore()
        }
        drawStartLabel(e) {
          e.save(), e.translate(0.5, 0.5)
          var t = y(this._sourceFontSize1, this._font, 'normal'),
            i = y(this._sourceFontSize2, this._font, 'normal')
          e.font = t
          var n = e.measureText(this._data.sourceLine1).width
          e.font = i
          var r = e.measureText(this._data.sourceLine2).width
          ;(this._sourceWidth = Math.max(n, r) + 6 + 4),
            (this._sourceHeight =
              this._sourceFontSize1 + this._sourceFontSize2 + 6 + 4)
          var s = this._data.points[0],
            o = s.x + this._sourceWidth - e.canvas.width + 5
          this._sourceRectLeftOffset = Math.max(
            20,
            Math.min(this._sourceWidth - 15, o),
          )
          var a = this.drawBalloon(
            e,
            s,
            this._sourceWidth,
            this._sourceHeight,
            this._data.direction,
            this._sourceRectLeftOffset,
          )
          ;(e.fillStyle = v.generateColor(
            this._data.sourceBackColor,
            this._data.transparency,
          )),
            e.fill(),
            (e.lineWidth = 2),
            (e.strokeStyle = v.generateColor(
              this._data.sourceStrokeColor,
              this._data.transparency,
            )),
            e.stroke(),
            (e.textAlign = w() ? 'right' : 'left'),
            (e.textBaseline = 'top'),
            (e.fillStyle = this._data.sourceTextColor)
          var l = m(e, this._sourceWidth - 6 - 4),
            d = 2 + a.x + 3 + l,
            h = 2 + a.y + 2
          ;(e.font = t),
            e.fillText(this._data.sourceLine1, d, h),
            (e.font = i),
            e.fillText(this._data.sourceLine2, d, h + this._sourceFontSize1 + 2)
          e.beginPath(),
            e.arc(s.x, s.y, 3, 0, 2 * Math.PI, !1),
            (e.fillStyle = this._data.centersColor),
            e.fill(),
            e.restore()
        }
        _drawImpl(e) {
          if (!(null === this._data || this._data.points.length < 2)) {
            var t = e.context
            ;(t.lineCap = 'butt'),
              (t.strokeStyle = this._data.color),
              (t.lineWidth = this._data.linewidth),
              (t.lineStyle = this._data.linestyle)
            var i = this._data.points[0],
              n = this._data.points[1],
              r = n.subtract(i)
            Math.abs(r.x) < 1 || Math.abs(r.y) < 1
              ? (t.beginPath(),
                t.moveTo(i.x, i.y),
                t.lineTo(n.x, n.y),
                t.stroke())
              : (t.save(),
                t.beginPath(),
                t.translate(i.x, i.y),
                t.scale(1, r.y / r.x),
                t.moveTo(0, 0),
                t.arcTo(r.x, 0, r.x, r.x, Math.abs(r.x)),
                t.lineTo(r.x, r.x),
                t.restore(),
                t.stroke()),
              this.drawTargetLabel(t),
              this.drawStartLabel(t)
            var s = Math.max(8, 4 * this._data.linewidth)
            t.fillStyle = this._data.color
            var o = r.y < 0 ? 1 : -1
            if (Math.abs(r.x) < 1 || Math.abs(r.y) < 1)
              var a = Math.atan(r.x / r.y)
            else {
              var l,
                d,
                h = Math.abs(r.x),
                c = Math.abs(r.y),
                u = 0,
                p = Math.PI / 2,
                _ = (u + p) / 2
              if (r.length() > s)
                for (;;) {
                  ;(l = h * Math.sin(_)), (d = c * (1 - Math.cos(_)))
                  var g = Math.sqrt((l - h) * (l - h) + (d - c) * (d - c))
                  if (Math.abs(g - s) < 1) break
                  g > s ? (u = _) : (p = _), (_ = (u + p) / 2)
                }
              ;(a = Math.atan((h - l) / (c - d))), r.x * r.y < 0 && (a = -a)
            }
            t.save(),
              t.beginPath(),
              t.translate(n.x, n.y),
              t.rotate(-a),
              t.moveTo(0, 0),
              t.lineTo(-s / 2, o * s),
              t.lineTo(s / 2, o * s),
              t.lineTo(0, 0),
              t.restore(),
              t.fill()
          }
        }
        targetLabelHitTest(e) {
          if (
            void 0 === this._targetWidth ||
            void 0 === this._targetHeight ||
            void 0 === this._targetRectLeftOffset
          )
            return null
          var t = this._targetHeight + this._arrowHeight
          this._data.status && (t += this._targetFontSize1 + 10)
          var i = 'up' === this._data.direction ? -1 : 1,
            n = this._radius,
            r = this._data.points[1],
            s = r.x - this._targetRectLeftOffset,
            l = r.y + i * n,
            d = r.y + i * (t + n),
            h = Math.min(l, d),
            c = Math.max(l, d)
          return e.x >= s &&
            e.x <= s + this._targetWidth &&
            e.y >= h &&
            e.y <= c
            ? new o(a.MovePoint)
            : null
        }
        sourceLabelHitTest(e) {
          if (
            void 0 === this._sourceHeight ||
            void 0 === this._sourceWidth ||
            void 0 === this._sourceRectLeftOffset
          )
            return null
          var t = 'up' === this._data.direction ? 1 : -1,
            i = this._radius,
            n = this._data.points[0],
            r = n.x - this._sourceRectLeftOffset,
            s = n.y + i * t,
            l = n.y + (i + this._sourceHeight + this._arrowHeight) * t,
            d = Math.min(s, l),
            h = Math.max(s, l)
          return e.x >= r &&
            e.x <= r + this._sourceWidth &&
            e.y >= d &&
            e.y <= h
            ? new o(a.MovePoint)
            : null
        }
        hitTest(e) {
          if (null === this._data || this._data.points.length < 2) return null
          var t = this._data.points[0],
            i = this._data.points[1],
            n = i.subtract(t),
            r = ((n = i.subtract(t)), e.subtract(t)),
            s = Math.abs(n.x),
            l = Math.abs(n.y),
            d = h.sign(n.y) * (l - l * Math.sqrt(1 - (r.x * r.x) / (s * s)))
          if (Math.abs(d - r.y) < 3) return new o(a.MovePoint)
          var c = this.targetLabelHitTest(e)
          return c || this.sourceLabelHitTest(e)
        }
      }
      t.PredictionPaneView = class extends r {
        constructor(e, t) {
          super(e, t), (this._pendingIcons = 3)
          var n = this
          function r() {
            ;(n._pendingIcons -= 1),
              0 === n._pendingIcons && n._source.model().updateSource(n._source)
          }
          ;(this._clockWhite = null),
            (this._successIcon = null),
            (this._failureIcon = null),
            d('prediction-clock-white', i(99620)).then((e) => {
              ;(n._clockWhite = e), r()
            }),
            d('prediction-success-white', i(14012)).then((e) => {
              ;(n._successIcon = e), r()
            }),
            d('prediction-failure-white', i(88249)).then((e) => {
              ;(n._failureIcon = e), r()
            }),
            (this._percentageFormatter = new c()),
            (this._predictionRenderer = new S()),
            (this._renderer = null)
        }
        iconsReady() {
          return 0 === this._pendingIcons
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            (this._renderer = null),
            (this._targetLine1 = ''),
            (this._targetLine2 = ''),
            (this._targetLine3 = ''),
            (this._targetLine4 = ''),
            !(this._source.points().length < 2)) &&
            this._source.priceScale()
          ) {
            var e = this._source.ownerSource().formatter(),
              t = this._source.points()[1],
              n = this._source.points()[0]
            this._targetLine3 = P(e.format(t.price))
            var r = t.price - n.price,
              o = (r / Math.abs(n.price)) * 100
            this._targetLine1 = P(
              e.format(r) + ' (' + this._percentageFormatter.format(o) + ')',
            )
            var a = this._model.timeScale().indexToUserTime(n.index),
              d = this._model.timeScale().indexToUserTime(t.index)
            n.time &&
              t.time &&
              ((a = TradingView.isString(n.time)
                ? new Date(Date.parse(n.time))
                : n.time),
              (d = TradingView.isString(t.time)
                ? new Date(Date.parse(t.time))
                : t.time))
            var h = this._model.mainSeries().isDWM(),
              c = s.parse(this._model.mainSeries().interval()),
              v = c.isSeconds() || c.isTicks()
            if (d && a) {
              ;(this._targetLine4 = new u().format(d)),
                h ||
                  (this._targetLine4 =
                    this._targetLine4 + '  ' + new p(v ? g : _).format(d))
              var m = (d.valueOf() - a.valueOf()) / 1e3
              this._targetLine2 =
                i.tf(null, { context: 'dates' }, i(91481)) +
                ' ' +
                L(new f().format(m))
            }
            ;(this._sourceLine1 = e.format(n.price)), (this._sourceLine2 = '')
            var w = this._model.timeScale().indexToUserTime(n.index)
            w &&
              ((this._sourceLine2 = new u().format(w)),
              h ||
                (this._sourceLine2 =
                  this._sourceLine2 + ' ' + new p(v ? g : _).format(w))),
              (this._direction =
                this._source.direction() === x.Direction.Up ? 'up' : 'down'),
              (this._finished =
                this._model.lineBeingCreated() !== this._source &&
                this._model.lineBeingEdited() !== this._source &&
                !this._model.sourcesBeingMoved().includes(this._source))
            var R = {}
            ;(R.points = this._points),
              (R.color = this._source.properties().linecolor.value()),
              (R.linewidth = this._source.properties().linewidth.value()),
              (R.targetLine1 = this._targetLine1),
              (R.targetLine2 = this._targetLine2),
              (R.targetLine3 = this._targetLine3),
              (R.targetLine4 = this._targetLine4),
              (R.status = this._source.properties().status.value()),
              (R.transparency = this._source.properties().transparency.value()),
              (R.targetBackColor = this._source
                .properties()
                .targetBackColor.value()),
              (R.targetStrokeColor = this._source
                .properties()
                .targetStrokeColor.value()),
              (R.targetTextColor = this._source
                .properties()
                .targetTextColor.value()),
              (R.sourceBackColor = this._source
                .properties()
                .sourceBackColor.value()),
              (R.sourceStrokeColor = this._source
                .properties()
                .sourceStrokeColor.value()),
              (R.sourceTextColor = this._source
                .properties()
                .sourceTextColor.value()),
              (R.successBackground = this._source
                .properties()
                .successBackground.value()),
              (R.successTextColor = this._source
                .properties()
                .successTextColor.value()),
              (R.failureBackground = this._source
                .properties()
                .failureBackground.value()),
              (R.failureTextColor = this._source
                .properties()
                .failureTextColor.value()),
              (R.intermediateBackColor = this._source
                .properties()
                .intermediateBackColor.value()),
              (R.intermediateTextColor = this._source
                .properties()
                .intermediateTextColor.value()),
              (R.sourceLine1 = this._sourceLine1),
              (R.sourceLine2 = this._sourceLine2),
              (R.direction = this._direction),
              (R.clockWhite = this._clockWhite),
              (R.successIcon = this._successIcon),
              (R.failureIcon = this._failureIcon),
              (R.finished = this._finished),
              (R.centersColor = this._model.backgroundCounterColor().value()),
              this._predictionRenderer.setData(R)
            var y = new l()
            y.append(this._predictionRenderer),
              this.addAnchors(y),
              (this._renderer = y)
          }
        }
      }
    },
    86583: (e, t, i) => {
      var n = i(86441),
        r = n.Point,
        s = n.box,
        o = i(34026).pointInBox,
        a = i(79191).LineSourcePaneView,
        l = i(80101).SelectionRenderer,
        d = i(18807).HitTestResult,
        h = i(18807).HitTarget,
        c = i(19266).CompositeRenderer,
        u = i(87095),
        p = i(74359).calcTextHorizontalShift,
        _ = i(38223).isRtl,
        g = i(15187).MediaCoordinatesPaneRenderer,
        f = i(46501)
      class v extends g {
        constructor(e, t) {
          super(),
            (this._data = null),
            (this._measureCache = e),
            (this._chartModel = t),
            (this._points = null)
        }
        setData(e) {
          ;(this._data = e), (this._points = e.points)
        }
        _drawImpl(e) {
          if (
            null !== this._data &&
            null !== this._points &&
            0 !== this._points.length
          ) {
            var t = e.context
            t.font = [
              this._data.fontWeight,
              this._data.fontSize + 'px',
              this._data.fontFamily,
            ].join(' ')
            var i = t.measureText(this._data.label)
            i.height = this._data.fontSize
            var n = 10,
              r = 5,
              s = i.width + 2 * n,
              o = i.height + 2 * r,
              a = this._points[0].x - -9,
              l = this._points[0].y - (o + 15)
            t.textAlign = _() ? 'right' : 'left'
            var d = p(t, i.width)
            this._measureCache &&
              Object.assign(this._measureCache, {
                innerWidth: s,
                innerHeight: o,
                tailLeft: -9,
                tailHeight: 15,
              }),
              t.translate(0.5 + a, 0.5 + l),
              t.beginPath(),
              t.moveTo(12, o),
              t.lineTo(-9, o + 15),
              t.lineTo(-10, o + 15 - 1),
              t.lineTo(5, o),
              t.lineTo(3, o),
              t.arcTo(0, o, 0, 0, 3),
              t.lineTo(0, 3),
              t.arcTo(0, 0, s, 0, 3),
              t.lineTo(s - 3, 0),
              t.arcTo(s, 0, s, o, 3),
              t.lineTo(s, o - 3),
              t.arcTo(s, o, 0, o, 3),
              t.lineTo(12, o),
              (t.fillStyle = u.generateColor(
                this._data.backgroundColor,
                this._data.transparency,
              )),
              t.fill(),
              (t.strokeStyle = this._data.borderColor),
              (t.lineWidth = 2),
              t.stroke(),
              t.closePath(),
              (t.textBaseline = 'alphabetic'),
              (t.fillStyle = this._data.color),
              t.fillText(
                this._data.label,
                n + d,
                o / 2 + Math.floor(0.35 * this._data.fontSize),
              ),
              t.translate(-0.5, -0.5),
              t.beginPath(),
              t.arc(-9, o + 15, 2.5, 0, 2 * Math.PI, !1),
              (t.fillStyle = u.generateColor(
                this._data.borderColor,
                this._data.transparency,
              )),
              t.fill(),
              (t.strokeStyle = this._chartModel.backgroundColor().value()),
              (t.lineWidth = 1),
              t.stroke(),
              t.closePath()
          }
        }
        hitTest(e) {
          if (
            null === this._data ||
            null === this._points ||
            0 === this._points.length
          )
            return null
          var t = this._points[0].x - this._measureCache.tailLeft,
            i =
              this._points[0].y -
              (this._measureCache.innerHeight + this._measureCache.tailHeight),
            n = s(
              new r(t, i),
              new r(
                t + this._measureCache.innerWidth,
                i + this._measureCache.innerHeight,
              ),
            )
          return o(e, n) ? new d(h.MovePoint) : null
        }
      }
      t.PriceLabelPaneView = class extends a {
        constructor(e, t, i) {
          super(e, t),
            (this._rendererCache = {}),
            (this._priceLabelRenderer = new v(this._rendererCache, t)),
            (this._renderer = null)
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            (this._renderer = null),
            this._source.points().length > 0)
          ) {
            var e = this._source.points()[0].price,
              t = this._source.priceScale()
            if (!t || t.isEmpty()) return
            var i = this._source.ownerSource().firstValue()
            this._priceLabel = t.formatPrice(e, i)
          }
          var n = {}
          if (
            ((n.points = this._points),
            (n.borderColor = this._source.properties().borderColor.value()),
            (n.backgroundColor = this._source
              .properties()
              .backgroundColor.value()),
            (n.color = this._source.properties().color.value()),
            (n.fontWeight = this._source.properties().fontWeight.value()),
            (n.fontSize = this._source.properties().fontsize.value()),
            (n.fontFamily = f.CHART_FONT_FAMILY),
            (n.transparency = this._source.properties().transparency.value()),
            (n.label = this._priceLabel),
            this._priceLabelRenderer.setData(n),
            1 === n.points.length)
          ) {
            var r = new c()
            return (
              r.append(this._priceLabelRenderer),
              r.append(
                new l({
                  points: n.points,
                  bgColors: this._lineAnchorColors(n.points),
                  visible: this.areAnchorsVisible(),
                }),
              ),
              void (this._renderer = r)
            )
          }
          this._renderer = this._priceLabelRenderer
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
      }
    },
    29734: (e, t, i) => {
      i.r(t), i.d(t, { PriceNotePaneView: () => m })
      var n = i(50151),
        r = i(86441),
        s = i(33013),
        o = i(19266),
        a = i(80657),
        l = i(79191),
        d = i(4652),
        h = i(79849),
        c = i(74359),
        u = i(46501),
        p = i(38325),
        _ = i(18807),
        g = i(68441),
        f = i(45197)
      function v(e) {
        let t, i
        return (
          e >= -135 && e <= -45
            ? ((t = 'center'), (i = 'bottom'))
            : e > -45 && e < 45
              ? ((t = 'left'), (i = 'middle'))
              : e >= 45 && e <= 135
                ? ((t = 'center'), (i = 'top'))
                : ((t = 'right'), (i = 'middle')),
          { horzAlign: t, vertAlign: i }
        )
      }
      class x {
        constructor() {
          ;(this._data = null),
            (this._priceLabelRenderer = new a.TextRenderer(
              void 0,
              new _.HitTestResult(_.HitTarget.MovePoint, {
                areaName: _.AreaName.Style,
                activeItem: 1,
              }),
            )),
            (this._hittest = new _.HitTestResult(_.HitTarget.MovePoint, {
              areaName: _.AreaName.Style,
            }))
        }
        setData(e) {
          this._data = e
          const t = e.points[0],
            i = e.points[1],
            n = Math.round((180 * Math.atan2(i.y - t.y, i.x - t.x)) / Math.PI)
          this._priceLabelRenderer.setData({
            ...v(n),
            points: [i],
            text: e.text,
            color: e.textColor,
            font: u.CHART_FONT_FAMILY,
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
          const n = t.pixelRatio,
            r = Math.round(i.points[0].x * n),
            s = Math.round(i.points[0].y * n),
            o = Math.round(i.points[1].x * n),
            a = Math.round(i.points[1].y * n)
          ;(e.lineCap = 'round'),
            (0, g.setLineStyle)(e, h.LINESTYLE_SOLID),
            (e.strokeStyle = i.lineColor),
            (e.fillStyle = i.lineColor),
            (e.lineWidth = Math.round(1 * n))
          const l = (0, f.fillScaledRadius)(2, n)
          ;(0, g.createCircle)(e, r, s, l),
            e.fill(),
            void 0 !== i.excludeBoundaries &&
              (e.save(), (0, c.addExclusionArea)(e, t, i.excludeBoundaries)),
            (0, g.drawLine)(e, r, s, o, a),
            void 0 !== i.excludeBoundaries && e.restore(),
            this._priceLabelRenderer.draw(e, t)
          const d = 1 * n
          ;(e.strokeStyle = i.circleBorderColor), (e.lineWidth = d)
          const u = l + d / 2
          ;(0, g.createCircle)(e, r, s, u), e.stroke(), e.restore()
        }
        hitTest(e) {
          const t = this._data
          if (null === t) return null
          const i = (0, p.lastMouseOrTouchEventInfo)().isTouch ? 20 : 3
          return (0, d.distanceToSegment)(t.points[0], t.points[1], e)
            .distance <= i
            ? this._hittest
            : this._priceLabelRenderer.hitTest(e)
        }
      }
      class m extends l.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._renderer = new o.CompositeRenderer()),
            (this._priceNoteRenderer = new x()),
            (this._customLabelRenderer = new a.TextRenderer())
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          var i
          super._updateImpl(), this._renderer.clear()
          const o = this._source.priceScale()
          if (!o || o.isEmpty()) return
          const l = this._points
          if (l.length < 2) return
          const d = (0, n.ensureNotNull)(
            this._source.ownerSource(),
          ).firstValue()
          if (null === d) return
          const h = this._source.properties().childs(),
            c = this._model.dark().value()
              ? s.colorsPalette['color-cold-gray-900']
              : s.colorsPalette['color-white'],
            p = this._source.points()[0].price,
            _ = {
              text: o.formatPrice(p, d),
              points: l,
              lineColor: h.lineColor.value(),
              circleBorderColor: c,
              backgroundColor: h.priceLabelBackgroundColor.value(),
              borderColor: h.priceLabelBorderColor.value(),
              textColor: h.priceLabelTextColor.value(),
              fontSize: h.priceLabelFontSize.value(),
              bold: h.priceLabelBold.value(),
              italic: h.priceLabelItalic.value(),
            }
          if (h.showLabel && h.showLabel.value()) {
            const n = l[0],
              s = l[1],
              o = n.x < s.x ? n : s,
              d = o === n ? s : n,
              c = h.vertLabelsAlign.value(),
              p = h.horzLabelsAlign.value()
            let g
            g =
              'left' === p
                ? o.clone()
                : 'right' === p
                  ? d.clone()
                  : new r.Point((n.x + s.x) / 2, (n.y + s.y) / 2)
            const f = Math.atan((d.y - o.y) / (d.x - o.x)),
              v = {
                points: [g],
                text: h.text.value(),
                color: h.textColor.value(),
                vertAlign: c,
                horzAlign: p,
                font: u.CHART_FONT_FAMILY,
                offsetX: 0,
                offsetY: 0,
                bold: h.bold.value(),
                italic: h.italic.value(),
                fontsize: h.fontSize.value(),
                forceTextAlign: !0,
                angle: f,
              }
            this._customLabelRenderer.setData(v),
              this._renderer.append(this._customLabelRenderer),
              'middle' === c &&
                (_.excludeBoundaries =
                  null !==
                    (i = (0, a.getTextBoundaries)(
                      this._customLabelRenderer,
                      t,
                      e,
                    )) && void 0 !== i
                    ? i
                    : void 0)
          }
          this._renderer.append(this._priceNoteRenderer),
            this._priceNoteRenderer.setData(_),
            this._renderer.append(this.createLineAnchor({ points: l }, 0))
        }
      }
    },
    61416: (e, t, i) => {
      i.r(t), i.d(t, { PriceRangePaneView: () => v })
      var n = i(50151),
        r = i(86441),
        s = i(38223),
        o = i(80657),
        a = i(72739),
        l = i(99031),
        d = i(19266),
        h = i(93572),
        c = i(79849),
        u = i(73436),
        p = i(57322),
        _ = i(46501),
        g = i(99734)
      const f = new h.PercentageFormatter()
      class v extends g.DateAndPriceRangeBasePaneView {
        constructor() {
          super(...arguments),
            (this._topBorderRenderer = new l.TrendLineRenderer()),
            (this._bottomBorderRenderer = new l.TrendLineRenderer()),
            (this._distanceRenderer = new l.TrendLineRenderer()),
            (this._backgroundRenderer = new a.RectangleRenderer()),
            (this._labelRenderer = new o.TextRenderer()),
            (this._renderer = new d.CompositeRenderer()),
            (this._pipFormatter = null),
            (this._lastSymbolInfo = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          var i, a, l
          if (
            (super._updateImpl(),
            this._renderer.clear(),
            this._points.length < 2 || this._source.points().length < 2)
          )
            return
          const d = this._source.properties().childs(),
            h = d.extendLeft.value(),
            g = d.extendRight.value(),
            [v, x] = this._points,
            m = Math.min(v.x, x.x),
            w = Math.max(v.x, x.x)
          d.fillBackground.value() &&
            (this._backgroundRenderer.setData({
              points: [new r.Point(m, v.y), new r.Point(w, x.y)],
              color: 'white',
              linewidth: 0,
              backcolor: d.backgroundColor.value(),
              fillBackground: !0,
              transparency: d.backgroundTransparency.value(),
              extendLeft: h,
              extendRight: g,
            }),
            this._renderer.append(this._backgroundRenderer))
          const R = (e, t, i) => {
            e.setData({
              points: [t, i],
              color: d.linecolor.value(),
              linewidth: d.linewidth.value(),
              linestyle: c.LINESTYLE_SOLID,
              extendleft: h,
              extendright: g,
              leftend: u.LineEnd.Normal,
              rightend: u.LineEnd.Normal,
            }),
              this._renderer.append(e)
          }
          let y = m,
            b = w
          y === b && (h && (y -= 1), g && (b += 1)),
            R(
              this._topBorderRenderer,
              new r.Point(y, v.y),
              new r.Point(b, v.y),
            ),
            R(
              this._bottomBorderRenderer,
              new r.Point(y, x.y),
              new r.Point(b, x.y),
            )
          const T = Math.round((v.x + x.x) / 2),
            P = new r.Point(T, v.y),
            L = new r.Point(T, x.y),
            C = this._updateCustomTextRenderer(e, t)
          this._distanceRenderer.setData({
            points: [P, L],
            color: d.linecolor.value(),
            linewidth: d.linewidth.value(),
            linestyle: c.LINESTYLE_SOLID,
            extendleft: !1,
            extendright: !1,
            leftend: u.LineEnd.Normal,
            rightend:
              Math.abs(P.y - L.y) >= 15 * d.linewidth.value()
                ? u.LineEnd.Arrow
                : u.LineEnd.Normal,
            excludeBoundaries: null != C ? C : void 0,
          }),
            this._renderer.append(this._distanceRenderer)
          const S = this._source.points()[0].price,
            M = this._source.points()[1].price,
            I = M - S,
            A = (100 * I) / Math.abs(S),
            k = this._model.mainSeries().symbolInfo()
          k &&
            k !== this._lastSymbolInfo &&
            ((this._pipFormatter = new p.PipFormatter(
              k.pricescale,
              k.minmov,
              k.type,
              k.minmove2,
              k.typespecs,
            )),
            (this._lastSymbolInfo = k))
          const N = (0, n.ensureNotNull)(
              this._source.ownerSource(),
            ).formatter(),
            D =
              null !==
                (a =
                  null === (i = N.formatChange) || void 0 === i
                    ? void 0
                    : i.call(N, M, S)) && void 0 !== a
                ? a
                : N.format(I),
            B = (0, s.forceLTRStr)(
              D +
                ' (' +
                f.format(A) +
                ') ' +
                (this._pipFormatter ? this._pipFormatter.format(I) : ''),
            )
          let z
          z =
            M > S
              ? new r.Point(0.5 * (v.x + x.x), x.y - 2 * d.fontsize.value())
              : new r.Point(0.5 * (v.x + x.x), x.y + 0.7 * d.fontsize.value())
          const E = { x: 0, y: 10 },
            H = d.fontsize.value(),
            V = {
              points: [z],
              text: B,
              color: d.textcolor.value(),
              font: _.CHART_FONT_FAMILY,
              offsetX: E.x,
              offsetY: E.y,
              padding: 8,
              vertAlign: 'middle',
              horzAlign: 'center',
              fontsize: H,
              backgroundRoundRect: 4,
              backgroundHorzInflate: 0.4 * H,
              backgroundVertInflate: 0.2 * H,
            }
          ;(null === (l = d.fillLabelBackground) || void 0 === l
            ? void 0
            : l.value()) &&
            ((V.boxShadow = {
              shadowColor: d.shadow.value(),
              shadowBlur: 4,
              shadowOffsetY: 1,
            }),
            (V.backgroundColor = d.labelBackgroundColor.value())),
            this._labelRenderer.setData(V)
          const O = this._labelRenderer.measure(),
            W = (0, o.calculateLabelPosition)(O, v, x, E, e)
          this._labelRenderer.setPoints([W]),
            this._renderer.append(this._labelRenderer),
            this._renderer.append(this._customTextrenderer),
            this.addAnchors(this._renderer)
        }
        _needLabelExclusionPath(e) {
          return e.getLinesInfo().lines.length > 0
        }
      }
    },
    75219: (e, t, i) => {
      i.r(t), i.d(t, { ProjectionLinePaneView: () => l })
      var n = i(81139),
        r = i(60322),
        s = i(99031),
        o = i(19266),
        a = i(73436)
      class l extends r.FibWedgePaneView {
        constructor(e, t) {
          super(e, t),
            (this._arcWedgeRenderer = new n.ArcWedgeRenderer()),
            (this._baseTrendRenderer = new s.TrendLineRenderer()),
            (this._edgeTrendRenderer = new s.TrendLineRenderer()),
            (this._arcWedgeRenderer = new n.ArcWedgeRenderer())
        }
        _updateRenderer(e = Number.NaN, t = Number.NaN) {
          if (this._points.length < 2) return
          const i = new o.CompositeRenderer(),
            n = this._source.properties().childs(),
            r = this._points,
            s = r[0],
            l = r[1],
            d = n.trendline.childs().color.value(),
            h = n.linewidth.value(),
            c = n.trendline.childs().linestyle.value()
          if (
            (this._baseTrendRenderer.setData({
              points: [s, l],
              color: d,
              linewidth: h,
              linestyle: c,
              extendleft: !1,
              extendright: !1,
              leftend: a.LineEnd.Normal,
              rightend: a.LineEnd.Normal,
            }),
            i.append(this._baseTrendRenderer),
            this._points.length < 3)
          )
            return this.addAnchors(i), void (this._renderer = i)
          let u = r[2]
          const p = u.data,
            _ = l.subtract(s).length(),
            g = u.subtract(s).normalized()
          ;(u = s.add(g.scaled(_))),
            (u.data = p),
            this._edgeTrendRenderer.setData({
              points: [s, u],
              color: d,
              linewidth: h,
              linestyle: c,
              extendleft: !1,
              extendright: !1,
              leftend: a.LineEnd.Normal,
              rightend: a.LineEnd.Normal,
            }),
            i.append(this._edgeTrendRenderer)
          const f = this._levels[0]
          this._arcWedgeRenderer.setData({
            center: this._points[0],
            radius: f.radius,
            prevRadius: 0,
            color: d,
            color1: n.color1.value(),
            color2: n.color2.value(),
            linewidth: h,
            angle1: e,
            angle2: t,
            p1: f.p1,
            p2: f.p2,
            fillBackground: n.fillBackground.value(),
            transparency: n.transparency.value(),
            gradient: !0,
          }),
            i.append(this._arcWedgeRenderer),
            this.addAnchors(i),
            (this._renderer = i)
        }
      }
    },
    31320: (e, t, i) => {
      i.r(t), i.d(t, { RectanglePaneView: () => h })
      var n = i(86441),
        r = i(46501),
        s = i(72739),
        o = i(19266),
        a = i(80657),
        l = i(79191),
        d = i(66103)
      class h extends l.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._rectangleRenderer = new s.RectangleRenderer()),
            (this._textRenderer = new a.TextRenderer()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          var i
          if (
            (super._updateImpl(),
            (this._renderer = null),
            this._points.length < 2)
          )
            return
          const s = this._getSource().properties().childs(),
            l = {
              points: this._points,
              color: s.color.value(),
              linewidth: s.linewidth.value(),
              backcolor: s.backgroundColor.value(),
              fillBackground: s.fillBackground.value(),
              transparency: s.transparency.value(),
              extendLeft: s.extendLeft.value(),
              extendRight: s.extendRight.value(),
            },
            d = new o.CompositeRenderer()
          d.append(this._rectangleRenderer)
          const h = this._points[0],
            c = this._points[1]
          if (s.showLabel.value()) {
            const e = Math.min(h.x, c.x),
              t = Math.max(h.x, c.x),
              i = Math.min(h.y, c.y),
              o = Math.max(h.y, c.y)
            let a, l, u, p
            const _ = s.fontSize.value() / 3
            let g,
              f,
              v = 0
            switch (s.vertLabelsAlign.value()) {
              case 'middle':
                ;(p = (i + o) / 2), (l = 'middle'), (v = _)
                break
              case 'top':
                ;(p = o), (l = 'top')
                break
              case 'bottom':
                ;(p = i), (l = 'bottom')
            }
            switch (s.horzLabelsAlign.value()) {
              case 'center':
                ;(u = (e + t) / 2), (a = 'center')
                break
              case 'left':
                ;(u = e), (a = 'left')
                break
              case 'right':
                ;(u = t), (a = 'right')
            }
            'middle' === l && ((g = t - e - 2 * v), (f = o - i))
            const x = {
              points: [new n.Point(u, p)],
              text: s.text.value(),
              fontSize: s.fontSize.value(),
              font: r.CHART_FONT_FAMILY,
              bold: s.bold.value(),
              italic: s.italic.value(),
              horzAlign: a,
              vertAlign: l,
              color: s.textColor.value(),
              wordWrapWidth: g,
              maxHeight: f,
              offsetX: 0,
              offsetY: 0,
              boxPaddingVert: _,
              boxPaddingHorz: v,
              forceTextAlign: !0,
              forceCalculateMaxLineWidth: !0,
            }
            this._textRenderer.setData(x), d.append(this._textRenderer)
          }
          if (s.middleLine.childs().showLine.value()) {
            let n
            s.showLabel.value() &&
              'middle' === s.vertLabelsAlign.value() &&
              (0, a.needTextExclusionPath)(this._textRenderer) &&
              (n =
                null !==
                  (i = (0, a.getTextBoundaries)(this._textRenderer, t, e)) &&
                void 0 !== i
                  ? i
                  : void 0)
            const {
              lineColor: r,
              lineWidth: o,
              lineStyle: d,
            } = s.middleLine.state()
            l.middleLine = {
              lineColor: r,
              lineWidth: o,
              lineStyle: d,
              excludeBoundaries: n,
            }
          }
          this._rectangleRenderer.setData(l),
            this._addAnchors(h, c, d),
            (this._renderer = d)
        }
        _addAnchors(e, t, i) {
          const r = new n.Point(e.x, t.y)
          r.data = 2
          const s = new n.Point(t.x, e.y)
          s.data = 3
          const o = new n.Point(e.x, 0.5 * (e.y + t.y))
          o.data = 4
          const a = new n.Point(t.x, 0.5 * (e.y + t.y))
          a.data = 5
          const l = new n.Point(0.5 * (e.x + t.x), e.y)
          l.data = 6
          const h = new n.Point(0.5 * (e.x + t.x), t.y)
          ;(h.data = 7), [o, a, l, h].forEach((e) => (e.square = !0))
          const c = e.x - t.x,
            u = e.y - t.y,
            p = Math.sign(c * u),
            _ = [
              p < 0
                ? d.PaneCursorType.DiagonalNeSwResize
                : d.PaneCursorType.DiagonalNwSeResize,
              p < 0
                ? d.PaneCursorType.DiagonalNeSwResize
                : d.PaneCursorType.DiagonalNwSeResize,
              p > 0
                ? d.PaneCursorType.DiagonalNeSwResize
                : d.PaneCursorType.DiagonalNwSeResize,
              p > 0
                ? d.PaneCursorType.DiagonalNeSwResize
                : d.PaneCursorType.DiagonalNwSeResize,
              d.PaneCursorType.HorizontalResize,
              d.PaneCursorType.HorizontalResize,
              d.PaneCursorType.VerticalResize,
              d.PaneCursorType.VerticalResize,
            ]
          i.append(
            this.createLineAnchor(
              { points: [e, t, r, s, o, a, l, h], pointsCursorType: _ },
              0,
            ),
          )
        }
      }
    },
    5374: (e, t, i) => {
      i.r(t), i.d(t, { RegressionTrendPaneView: () => g })
      var n = i(50151),
        r = i(87095),
        s = i(18807),
        o = i(19266),
        a = i(64308),
        l = i(80657),
        d = i(99031),
        h = i(80101),
        c = i(86441),
        u = i(73436),
        p = i(46501)
      var _ = i(79191)
      class g extends _.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._data = null),
            (this._pearsonsLabelRenderer = new l.TextRenderer()),
            (this._renderer = null),
            (this._renderer = null)
        }
        renderer() {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          super._updateImpl(),
            (this._data = ((e, t) => {
              const i = { lines: [], pearsons: null }
              if (!t.properties().visible.value()) return i
              const r = e.timeScale(),
                s = t.priceScale(),
                o = e.mainSeries().firstBar()
              if (!s || s.isEmpty() || r.isEmpty() || !o) return i
              const a = t.startIndex(),
                l = t.endIndex()
              if (null === a || null === l) return i
              const d = [t.baseLine(), t.downLine(), t.upLine()],
                h = Math.round(r.indexToCoordinate(a)),
                _ = Math.round(r.indexToCoordinate(l)),
                g = t.properties(),
                f = [g.styles.baseLine, g.styles.downLine, g.styles.upLine],
                v = o[4]
              for (let r = 0; r < d.length; r++) {
                if (1 != (1 & f[r].display.value())) continue
                const o = (0, n.ensureNotNull)(d[r]).startPrice,
                  a = (0, n.ensureNotNull)(d[r]).endPrice
                if (void 0 === o || void 0 === a) continue
                const l = s.priceToCoordinate(o, v),
                  p = s.priceToCoordinate(a, v),
                  x = new c.Point(h, l),
                  m = new c.Point(_, p),
                  w = f[r].color.value(),
                  R = f[r].linewidth.value(),
                  y = f[r].linestyle.value(),
                  b = {
                    points: [x, m],
                    width: e.timeScale().width(),
                    height: (0, n.ensureNotNull)(t.priceScale()).height(),
                    color: w,
                    linewidth: R,
                    linestyle: y,
                    extendleft: !1,
                    extendright: g.styles.extendLines.value(),
                    leftend: u.LineEnd.Normal,
                    rightend: u.LineEnd.Normal,
                  }
                i.lines.push(b)
              }
              const x = (0, n.ensureNotNull)(t.downLine())
              if (g.styles.showPearsons.value() && void 0 !== x.startPrice) {
                const e = s.priceToCoordinate(x.startPrice, v),
                  n = new c.Point(h, e)
                i.pearsons = {
                  points: [n],
                  text: '' + t.pearsons(),
                  color: g.styles.downLine.color.value(),
                  vertAlign: 'top',
                  horzAlign: 'center',
                  font: p.CHART_FONT_FAMILY,
                  offsetX: 0,
                  offsetY: 4,
                  fontsize: 12,
                }
              }
              return i
            })(this._model, this._source)),
            (this._renderer = null)
          const e = new o.CompositeRenderer()
          let t = []
          const i = [
              this._data.lines[1],
              this._data.lines[0],
              this._data.lines[2],
            ].filter((e) => !!e),
            l = this._source
              .properties()
              .childs()
              .styles.childs()
              .transparency.value()
          for (let t = 1; t < i.length; t++) {
            const n = i[t].color,
              o = i[t].linewidth,
              d = i[t].linestyle,
              h = i[t].extendright,
              c = {
                line1: {
                  color: n,
                  lineStyle: d,
                  lineWidth: o,
                  points: [i[t].points[0], i[t].points[1]],
                },
                line2: {
                  color: n,
                  lineStyle: d,
                  lineWidth: o,
                  points: [i[t - 1].points[0], i[t - 1].points[1]],
                },
                extendLeft: !1,
                extendRight: h,
                backColor: (0, r.generateColor)(i[t].color, l),
                skipLines: !0,
                fillBackground: !0,
              },
              u = new a.ParallelChannelRenderer(
                new s.HitTestResult(s.HitTarget.Regular),
              )
            u.setData(c), e.append(u)
          }
          const _ = this._getTransparencyResetLines()
          for (let n = 0; n < i.length; n++) {
            const r = new d.TrendLineRenderer()
            r.setData(_[n]),
              r.setHitTest(new s.HitTestResult(s.HitTarget.Regular)),
              e.append(r),
              0 !== n && (t = t.concat(i[n].points))
          }
          this._data.pearsons &&
            ((this._data.pearsons.color = (0, r.resetTransparency)(
              this._data.pearsons.color,
            )),
            this._pearsonsLabelRenderer.setData(this._data.pearsons),
            e.append(this._pearsonsLabelRenderer)),
            this._data.lines.length >= 1 &&
              e.append(
                new h.SelectionRenderer({
                  points: t,
                  bgColors: this._lineAnchorColors(t),
                  visible: this.areAnchorsVisible(),
                  hittestResult: s.HitTarget.Regular,
                  barSpacing: this._model.timeScale().barSpacing(),
                }),
              ),
            (this._renderer = e)
        }
        _getTransparencyResetLines() {
          return (0, n.ensureNotNull)(this._data).lines.map((e) => ({
            ...e,
            color: (0, r.resetTransparency)(e.color),
          }))
        }
      }
    },
    56457: (e, t, i) => {
      i.r(t), i.d(t, { RiskRewardPaneView: () => A })
      var n = i(86441),
        r = i(50151),
        s = i(11542),
        o = i(79191),
        a = i(99031),
        l = i(80657),
        d = i(72739),
        h = i(18807),
        c = i(19266),
        u = i(93572),
        p = i(87663),
        _ = i(57322),
        g = i(87095),
        f = i(73436),
        v = i(95539),
        x = i(38223),
        m = i(66103),
        w = i(88145),
        R = i(46501),
        y = i(79849)
      const b = [
          m.PaneCursorType.Default,
          m.PaneCursorType.HorizontalResize,
          m.PaneCursorType.VerticalResize,
          m.PaneCursorType.VerticalResize,
        ],
        T = s.t(null, void 0, i(72892)),
        P = s.t(null, { context: 'line_tool_position' }, i(50140)),
        L = s.t(null, { context: 'line_tool_position' }, i(44143)),
        C = s.t(null, void 0, i(53115)),
        S = s.t(null, void 0, i(438)),
        M = s.t(null, void 0, i(15166)),
        I = s.t(null, void 0, i(87061))
      class A extends o.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._percentageFormatter = new u.PercentageFormatter()),
            (this._numericFormatter = new p.NumericFormatter()),
            (this._pipFormatter = null),
            (this._lastSymbolInfo = null),
            (this._entryLineRenderer = new a.TrendLineRenderer()),
            (this._stopLineRenderer = new a.TrendLineRenderer()),
            (this._targetLineRenderer = new a.TrendLineRenderer()),
            (this._positionLineRenderer = new a.TrendLineRenderer()),
            (this._fullStopBgRenderer = new d.RectangleRenderer(
              new h.HitTestResult(h.HitTarget.MovePoint),
              new h.HitTestResult(h.HitTarget.MovePoint),
            )),
            (this._stopBgRenderer = new d.RectangleRenderer(
              new h.HitTestResult(h.HitTarget.MovePoint),
              new h.HitTestResult(h.HitTarget.MovePoint),
            )),
            (this._fullTargetBgRenderer = new d.RectangleRenderer(
              new h.HitTestResult(h.HitTarget.MovePoint),
              new h.HitTestResult(h.HitTarget.MovePoint),
            )),
            (this._targetBgRenderer = new d.RectangleRenderer(
              new h.HitTestResult(h.HitTarget.MovePoint),
              new h.HitTestResult(h.HitTarget.MovePoint),
            )),
            (this._stopLabelRenderer = new l.TextRenderer()),
            (this._middleLabelRenderer = new l.TextRenderer()),
            (this._profitLabelRenderer = new l.TextRenderer()),
            (this._renderer = new c.CompositeRenderer())
        }
        isLabelVisible() {
          return (
            this.isHoveredSource() ||
            this.isSelectedSource() ||
            this._source.properties().childs().alwaysShowStats.value()
          )
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          super._updateImpl(e, t), this._renderer.clear()
          const i = this._model.timeScale(),
            s = this._source.priceScale()
          if (!s || s.isEmpty() || i.isEmpty()) return
          const o = this._source.points()
          if (o.length < 2 || this._points.length < 2) return
          const a = (0, r.ensureNotNull)(this._source.ownerSource()),
            l = null == a ? void 0 : a.barsProvider().bars()
          if (!l || l.isEmpty()) return
          if (null === l.last()) return
          const d = 4 === o.length,
            h = this._source.lastBarData()
          if (!h) return
          const c = h.closePrice,
            u = this._source.stopPrice(),
            p = this._source.profitPrice(),
            g = this._source.calculatePL(c),
            f = a.symbolSource().symbolInfo()
          if (!f) return
          const x = a.firstValue()
          if (null === x) return
          const m = this._points[v.RiskRewardPointIndex.Entry].y,
            w = s.priceToCoordinate(u, x),
            R = s.priceToCoordinate(p, x),
            y = s.priceToCoordinate(h.closePrice, x),
            T = i.indexToCoordinate(h.index),
            P = this._points[v.RiskRewardPointIndex.Entry].x,
            L = this._points[v.RiskRewardPointIndex.ActualEntry]
              ? this._points[v.RiskRewardPointIndex.ActualEntry].x
              : this._points[v.RiskRewardPointIndex.Close].x,
            C = this._points[v.RiskRewardPointIndex.ActualClose]
              ? this._points[v.RiskRewardPointIndex.ActualClose].x
              : this._points[v.RiskRewardPointIndex.Close].x,
            S = this._points[v.RiskRewardPointIndex.Close].x,
            M = this._source.entryPrice(),
            I = this._source.stopPrice(),
            A = this._source.profitPrice(),
            k = {
              pl: g,
              isClosed: d,
              entryLevel: m,
              stopLevel: w,
              profitLevel: R,
              closeLevel: y,
              closeBar: T,
              left: P,
              entryX: L,
              right: C,
              edge: S,
              entryPrice: M,
              stopPrice: I,
              profitPrice: A,
              currentPrice: c,
            }
          let N = S < -5 || P > t + 5
          if (
            (this._createBackgroundRenderers(k, this._renderer),
            this._createLinesRenderers(k, this._renderer),
            this._createLabelsRenderers(k, this._renderer, f),
            f !== this._lastSymbolInfo &&
              ((this._pipFormatter = new _.PipFormatter(
                f.pricescale,
                f.minmov,
                f.type,
                f.minmove2,
                f.typespecs,
              )),
              (this._lastSymbolInfo = f)),
            (N = [
              this._profitLabelRenderer,
              this._stopLabelRenderer,
              this._middleLabelRenderer,
            ].reduce((i, n) => i && n.isOutOfScreen(t, e), N)),
            N)
          )
            return
          const D = this._points[0].clone()
          ;(D.data = 0), (D.snappingPrice = M)
          const B = new n.Point(P, w)
          ;(B.data = 2), (B.square = !0), (B.snappingPrice = I)
          const z = new n.Point(P, R)
          ;(z.data = 3), (z.square = !0), (z.snappingPrice = A)
          const E = new n.Point(S, D.y)
          ;(E.data = 1), (E.square = !0), (E.snappingIndex = h.index)
          const H = { points: [D, E, B, z], pointsCursorType: b }
          this._renderer.append(this.createLineAnchor(H, 0))
        }
        _createBackgroundRenderers(e, t) {
          const i = this._source.properties().childs()
          {
            const t = {
              points: [
                new n.Point(e.left, e.entryLevel),
                new n.Point(e.edge, e.stopLevel),
              ],
              color: 'white',
              linewidth: 0,
              backcolor: i.stopBackground.value(),
              fillBackground: !0,
              transparency: i.stopBackgroundTransparency.value(),
              extendLeft: !1,
              extendRight: !1,
            }
            this._fullStopBgRenderer.setData(t),
              this._renderer.append(this._fullStopBgRenderer)
          }
          if (e.pl < 0 && e.entryX !== e.right) {
            const t = new n.Point(e.entryX, e.entryLevel),
              r = new n.Point(e.right, e.closeLevel),
              s = 0.01 * i.stopBackgroundTransparency.value(),
              o = 100 - 100 * (1 - s * s * s),
              a = {
                points: [t, r],
                color: 'white',
                linewidth: 0,
                backcolor: i.stopBackground.value(),
                fillBackground: !0,
                transparency: o,
                extendLeft: !1,
                extendRight: !1,
              }
            this._stopBgRenderer.setData(a),
              this._renderer.append(this._stopBgRenderer)
          }
          {
            const t = {
              points: [
                new n.Point(e.left, e.entryLevel),
                new n.Point(e.edge, e.profitLevel),
              ],
              color: 'white',
              linewidth: 0,
              backcolor: i.profitBackground.value(),
              fillBackground: !0,
              transparency: i.profitBackgroundTransparency.value(),
              extendLeft: !1,
              extendRight: !1,
            }
            this._fullTargetBgRenderer.setData(t),
              this._renderer.append(this._fullTargetBgRenderer)
          }
          if (e.pl > 0 && e.entryX !== e.right) {
            const t = new n.Point(e.entryX, e.entryLevel),
              r = new n.Point(e.right, e.closeLevel),
              s = 0.01 * i.profitBackgroundTransparency.value(),
              o = 100 - 100 * (1 - s * s * s),
              a = {
                points: [t, r],
                color: 'white',
                linewidth: 0,
                backcolor: i.profitBackground.value(),
                fillBackground: !0,
                transparency: o,
                extendLeft: !1,
                extendRight: !1,
              }
            this._targetBgRenderer.setData(a),
              this._renderer.append(this._targetBgRenderer)
          }
        }
        _createLinesRenderers(e, t) {
          const i = this._source.properties().childs(),
            r = (e, t, n, r) => {
              const s = {
                points: [t, n],
                color: null != r ? r : i.linecolor.value(),
                linewidth: i.linewidth.value(),
                linestyle: y.LINESTYLE_SOLID,
                extendleft: !1,
                extendright: !1,
                leftend: f.LineEnd.Normal,
                rightend: f.LineEnd.Normal,
              }
              e.setData(s), this._renderer.append(e)
            }
          if (this._points[v.RiskRewardPointIndex.ActualEntry]) {
            const t = {
              points: [
                this._points[v.RiskRewardPointIndex.ActualEntry],
                e.isClosed
                  ? this._points[v.RiskRewardPointIndex.ActualClose]
                  : new n.Point(e.closeBar, e.closeLevel),
              ],
              color: this._source.properties().childs().linecolor.value(),
              linewidth: 1,
              linestyle: y.LINESTYLE_DASHED,
              extendleft: !1,
              extendright: !1,
              leftend: f.LineEnd.Normal,
              rightend: f.LineEnd.Arrow,
            }
            this._positionLineRenderer.setData(t),
              this._renderer.append(this._positionLineRenderer)
          }
          {
            const t = new n.Point(
                e.left,
                this._points[v.RiskRewardPointIndex.Entry].y,
              ),
              i = new n.Point(
                e.edge,
                this._points[v.RiskRewardPointIndex.Entry].y,
              )
            r(this._entryLineRenderer, t, i)
          }
          {
            const t = new n.Point(e.left, e.stopLevel),
              s = new n.Point(e.edge, e.stopLevel)
            r(this._stopLineRenderer, t, s, i.stopBackground.value())
          }
          {
            const t = new n.Point(e.left, e.profitLevel),
              s = new n.Point(e.edge, e.profitLevel)
            r(this._targetLineRenderer, t, s, i.profitBackground.value())
          }
        }
        _addCenterLabel(e, t, i) {
          const n = this._source.properties().childs(),
            r = {
              font: R.CHART_FONT_FAMILY,
              offsetX: 3,
              horzAlign: 'center',
              backgroundRoundRect: 4,
              backgroundHorzInflate: 4,
              points: [i.p],
              text: i.txt,
              color: n.textcolor.value(),
              offsetY: i.offsetY,
              vertAlign: i.vertAlign,
              backgroundColor: (0, g.resetTransparency)(i.color),
              fontsize: n.fontsize.value(),
              borderColor: i.border,
            }
          return t.setData(r), e.append(t), r
        }
        _creareMiddleLabel(e, t, i) {
          const {
              entryPrice: s,
              profitPrice: o,
              stopPrice: a,
              currentPrice: l,
              pl: d,
              left: h,
              edge: c,
              isClosed: u,
            } = e,
            p = Math.abs(s - o) / Math.abs(s - a),
            _ = this._source.properties().childs(),
            g = (0, r.ensureNotNull)(this._source.ownerSource()),
            f = new n.Point((h + c) / 2, Math.round(this._points[0].y))
          let v = '',
            x = ''
          const m = this._numericFormatter.format(Math.round(100 * p) / 100)
          if (this._points[1]) {
            const e = g.formatter()
            if (e.formatChange) {
              const t = Math.max(l, s),
                i = Math.min(l, s)
              x = d >= 0 ? e.formatChange(t, i) : e.formatChange(i, t)
            } else x = e.format(d)
          }
          const R = _.qty.value() / _.lotSize.value(),
            y =
              'futures' === i.type ||
              (0, w.hasCryptoTypespec)(i.typespecs || [])
                ? Math.round(1e3 * R) / 1e3
                : Math.floor(R)
          if (_.compact.value())
            (v += x ? x + ' ~ ' : ''), (v += y + '\n'), (v += m)
          else {
            const e = u ? L : P
            ;(v += x ? T.format({ status: e, pnl: x }) + ', ' : ''),
              (v += I.format({ qty: '' + y }) + '\n'),
              (v += C.format({ ratio: m }) + ' ')
          }
          let b = _.linecolor.value()
          return (
            d < 0
              ? (b = _.stopBackground.value())
              : d > 0 && (b = _.profitBackground.value()),
            this._addCenterLabel(t, this._middleLabelRenderer, {
              p: f,
              txt: v,
              color: b,
              vertAlign: 'middle',
              offsetY: 0,
              border: 'white',
            })
          )
        }
        _createStopLabel(e, t) {
          var i, s
          const {
              stopPrice: o,
              entryPrice: a,
              left: l,
              edge: d,
              stopLevel: h,
            } = e,
            c = this._source.properties().childs(),
            u = (0, r.ensureNotNull)(this._source.ownerSource()),
            p = Math.abs(o - a),
            _ = Math.round((1e4 * p) / a) / 100,
            g = new n.Point((l + d) / 2, h)
          let f = ''
          const v = u.formatter(),
            m =
              null !==
                (s =
                  null === (i = v.formatChange) || void 0 === i
                    ? void 0
                    : i.call(v, Math.max(o, a), Math.min(o, a))) && void 0 !== s
                ? s
                : v.format(p),
            w = this._percentageFormatter.format(_)
          return (
            (f = c.compact.value()
              ? m + ' (' + w + ') ' + c.amountStop.value()
              : S.format({
                  stopChange: (0, x.forceLTRStr)(m),
                  stopChangePercent: (0, x.forceLTRStr)(
                    this._percentageFormatter.format(_),
                  ),
                  stopChangePip: this._pipFormatter
                    ? (0, x.forceLTRStr)(this._pipFormatter.format(p))
                    : '',
                  amount: (0, x.forceLTRStr)('' + c.amountStop.value()),
                })),
            this._addCenterLabel(t, this._stopLabelRenderer, {
              p: g,
              txt: f,
              color: c.stopBackground.value(),
              vertAlign: a < o ? 'bottom' : 'top',
              offsetY: 0,
            })
          )
        }
        _createTargetLabel(e, t) {
          var i, s
          const {
              profitPrice: o,
              entryPrice: a,
              stopPrice: l,
              left: d,
              edge: h,
              profitLevel: c,
            } = e,
            u = this._source.properties().childs(),
            p = (0, r.ensureNotNull)(this._source.ownerSource()),
            _ = Math.abs(o - a),
            g = Math.round((1e4 * _) / a) / 100,
            f = new n.Point((d + h) / 2, c)
          let v = ''
          const m = p.formatter(),
            w =
              null !==
                (s =
                  null === (i = m.formatChange) || void 0 === i
                    ? void 0
                    : i.call(m, Math.max(o, a), Math.min(o, a))) && void 0 !== s
                ? s
                : m.format(_),
            R = this._percentageFormatter.format(g)
          return (
            (v = u.compact.value()
              ? w + ' (' + R + ') ' + u.amountTarget.value()
              : M.format({
                  profitChange: w,
                  profitChangePercent: (0, x.forceLTRStr)(
                    this._percentageFormatter.format(g),
                  ),
                  profitChangePip: this._pipFormatter
                    ? (0, x.forceLTRStr)(this._pipFormatter.format(_))
                    : '',
                  amount: (0, x.forceLTRStr)('' + u.amountTarget.value()),
                })),
            this._addCenterLabel(t, this._profitLabelRenderer, {
              p: f,
              txt: v,
              color: u.profitBackground.value(),
              vertAlign: a < l ? 'top' : 'bottom',
              offsetY: 0,
            })
          )
        }
        _createLabelsRenderers(e, t, i) {
          var s
          if (!this.isLabelVisible()) return
          const o = this._creareMiddleLabel(e, t, i),
            a = this._createStopLabel(e, t),
            l = this._createTargetLabel(e, t),
            d = [
              this._profitLabelRenderer,
              this._stopLabelRenderer,
              this._middleLabelRenderer,
            ].reduce((e, t) => Math.max(e, t.measure().width), 0),
            h = e.edge - e.left,
            c = this._anchorRadius()
          if (
            h - d - c <= 8 &&
            (l && ((l.offsetY += c + 8), this._profitLabelRenderer.setData(l)),
            a && ((a.offsetY += c + 8), this._stopLabelRenderer.setData(a)),
            o)
          ) {
            let t
            if (
              null === (s = this._source.priceScale()) || void 0 === s
                ? void 0
                : s.isLog()
            ) {
              const i = Math.abs(this._points[0].y - e.stopLevel)
              t = Math.abs(this._points[0].y - e.profitLevel) > i ? -1 : 1
            } else {
              const i = Math.abs(e.stopPrice - e.entryPrice)
              t = Math.abs(e.profitPrice - e.entryPrice) > i ? -1 : 1
            }
            const i = e.profitLevel < e.stopLevel ? 1 : -1,
              a = (0, r.ensureDefined)(o.points)[0].add(
                new n.Point(
                  0,
                  i *
                    t *
                    (0.5 * this._middleLabelRenderer.measure().height + c + 8),
                ),
              )
            ;(o.points = [a]), this._middleLabelRenderer.setData(o)
          }
        }
      }
    },
    55832: (e, t, i) => {
      var n = i(86441).Point,
        r = i(4652).distanceToLine,
        s = i(79191).LineSourcePaneView,
        o = i(79191).thirdPointCursorType,
        a = i(99031).TrendLineRenderer,
        l = i(79797).PolygonRenderer,
        d = i(19266).CompositeRenderer,
        h = i(73436).LineEnd,
        c = i(66103).PaneCursorType
      const { LINESTYLE_SOLID: u } = i(79849)
      t.RotatedRectanglePaneView = class extends s {
        constructor(e, t) {
          super(e, t),
            (this._poligonRenderer = new l()),
            (this._renderer = null)
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            (this._renderer = null),
            (this._distance = 0),
            3 === this._points.length &&
              (this._distance = r(
                this._points[0],
                this._points[1],
                this._points[2],
              ).distance),
            0 !== this._points.length)
          ) {
            var e,
              t,
              i,
              s,
              l = new d(),
              p = this._source.properties(),
              _ = this._points[0],
              g = this._points[1]
            if (2 === this._points.length) {
              ;((v = {}).points = this._points),
                (v.floatPoints = this._floatPoints),
                (v.width = this._model.timeScale().width()),
                (v.height = this._source.priceScale().height()),
                (v.color = p.color.value()),
                (v.linewidth = 1),
                (v.linestyle = u),
                (v.extendleft = !1),
                (v.extendright = !1),
                (v.leftend = h.Normal),
                (v.rightend = h.Normal)
              var f = new a()
              f.setData(v), l.append(f)
            } else if (3 === this._points.length) {
              var v,
                x = g.subtract(_),
                m = new n(x.y, -x.x).normalized().scaled(this._distance),
                w = m.scaled(-1)
              ;(e = _.add(m)),
                (t = g.add(m)),
                (i = _.add(w)),
                (s = g.add(w)),
                ((v = {}).points = [e, t, s, i]),
                (v.color = p.color.value()),
                (v.linewidth = this._source.properties().linewidth.value()),
                (v.linestyle = u),
                (v.filled = !0),
                (v.backcolor = p.backgroundColor.value()),
                (v.fillBackground = p.fillBackground.value()),
                (v.transparency = p.transparency.value()),
                this._poligonRenderer.setData(v),
                l.append(this._poligonRenderer)
            }
            var R = []
            R.push(_), this._points.length >= 2 && R.push(g)
            var y = [c.Default, c.Default]
            if (3 === this._points.length) {
              ;(e.data = 2),
                (i.data = 2),
                (t.data = 2),
                (s.data = 2),
                R.push(e, i, t, s)
              var b = o(_, g)
              y.push(b, b, b, b)
            }
            l.append(
              this.createLineAnchor({ points: R, pointsCursorType: y }, 0),
            ),
              (this._renderer = l)
          }
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
      }
    },
    26294: (e, t, i) => {
      i.r(t), i.d(t, { SignpostPaneView: () => L })
      var n = i(86441),
        r = i(33013),
        s = i(19266),
        o = i(66103),
        a = i(18807),
        l = i(79191),
        d = i(85573),
        h = i(46501),
        c = i(4652),
        u = i(34026),
        p = i(50151),
        _ = i(38325),
        g = i(80657),
        f = i(45197)
      function v(e) {
        return void 0 === e ? 0 : e.poleTailHeight + 2 * e.circleRadius
      }
      function x(e) {
        return e.poleStartY
      }
      function m(e) {
        return e.inverseAnchorPosition
          ? e.anchorY
          : e.anchorY + (e.labelHeight + v(e.plate)) * e.direction
      }
      function w(e) {
        return e.inverseAnchorPosition
          ? e.anchorY + v(e.plate) * e.direction
          : e.anchorY + e.labelHeight * e.direction
      }
      class R {
        constructor(e, t) {
          ;(this._data = null),
            (this._hitTestResult = e),
            (this._phantomMode = Boolean(t))
        }
        setData(e) {
          if (null === e) return void (this._data = null)
          this._data = {
            ...e,
            labelHeight: 0,
            labelRenderer: new g.TextRenderer(),
          }
          const t = this._data,
            i = t.label,
            r = {
              offsetX: 0,
              offsetY: 0,
              points: [new n.Point(t.x, t.anchorY)],
              forceCalculateMaxLineWidth: !0,
              vertAlign: -1 === i.labelDirection ? 'bottom' : 'top',
              horzAlign: 'center',
              horzTextAlign: 'center',
              font: i.labelFont,
              fontSize: i.labelFontSize,
              bold: i.labelFontBold,
              italic: i.labelFontItalic,
              backgroundRoundRect: i.labelBorderRadius,
              padding: i.labelPadding,
              boxPaddingVert: i.labelBoxPaddingVert,
              boxPaddingHorz: i.labelBoxPaddingHorz,
              wordWrapWidth: i.labelWordWrapWidth,
              color: i.labelColor,
              borderColor: i.labelBorderColor,
              borderWidth: 1,
              backgroundColor: i.labelBackgroundColor,
              text: i.text,
            }
          if (
            (t.labelRenderer.setData(r),
            (this._data.labelHeight =
              this._data.labelRenderer.measure().height),
            t.inverseAnchorPosition)
          ) {
            const e = (0, p.ensureDefined)(r.points)
            r.points = [new n.Point(e[0].x, w(t))]
          } else {
            const e =
              1 === t.direction
                ? Math.min(t.poleStartY - this._data.labelHeight, t.anchorY)
                : Math.max(t.poleStartY + this._data.labelHeight, t.anchorY)
            t.anchorY !== e &&
              ((t.anchorY = e), (r.points = [new n.Point(t.x, e)]))
          }
          t.labelRenderer.setData(r)
        }
        itemAnchorY() {
          return null === this._data ? null : this._data.anchorY
        }
        hitTest(e, t) {
          if (null === this._data) return null
          const [i, r, s] = ((e, t) => {
            const i = (0, _.lastMouseOrTouchEventInfo)().isTouch ? 20 : 3,
              r = e.x,
              s = e.plate,
              o =
                (0, c.distanceToSegment)(
                  new n.Point(r, x(e)),
                  new n.Point(r, m(e)),
                  t,
                ).distance < i
            let a = !1
            if (!o && void 0 !== s) {
              const o = e.inverseAnchorPosition
                ? e.anchorY + s.circleRadius * e.direction
                : e.anchorY +
                  (e.labelHeight + s.poleTailHeight + s.circleRadius) *
                    e.direction
              a =
                s.circleRadius > 0 &&
                (0, u.pointInCircle)(t, new n.Point(r, o), s.circleRadius + i)
            }
            return [o, a, !o && !a && null !== e.labelRenderer.hitTest(t)]
          })(this._data, e)
          if (i || r || s) {
            const e = {
              hideCrosshairLinesOnHover: !0,
              activeItem:
                i || r ? this._data.itemIndex : this._data.label.labelIndex,
            }
            return (
              s
                ? (e.areaName = a.AreaName.Text)
                : r && (e.areaName = a.AreaName.Style),
              new a.HitTestResult(this._hitTestResult, e)
            )
          }
          return null
        }
        draw(e, t) {
          if (null === this._data) return
          e.save(), this._phantomMode && (e.globalAlpha = 0.5)
          const { poleColor: i, emojiRadius: n } = this._data,
            r = t.pixelRatio,
            s = Math.max(1, Math.floor(r)),
            o = s % 2 ? 0.5 : 0
          e.beginPath(), (e.strokeStyle = i), (e.lineWidth = s)
          const a = Math.round(this._data.x * r) + o
          e.moveTo(a, Math.round(x(this._data) * r)),
            e.lineTo(a, Math.round(m(this._data) * r)),
            void 0 !== this._data.plate &&
              0 !== this._data.plate.poleTailHeight &&
              (e.moveTo(a, Math.round(w(this._data) * r)),
              e.lineTo(
                a,
                Math.round(
                  ((e) => {
                    var t, i
                    const n =
                      null !==
                        (i =
                          null === (t = e.plate) || void 0 === t
                            ? void 0
                            : t.poleTailHeight) && void 0 !== i
                        ? i
                        : 0
                    return e.inverseAnchorPosition
                      ? w(e) - n * e.direction
                      : w(e) + n * e.direction
                  })(this._data) * r,
                ),
              )),
            e.stroke(),
            void 0 !== this._data.plate &&
              ((e, t, i, n, r) => {
                const s = r.pixelRatio,
                  {
                    circleRadius: o,
                    poleTailHeight: a,
                    circleBorderColor: l,
                    circleBackgroundColor: d,
                  } = i
                ;(e.strokeStyle = l), (e.fillStyle = d)
                const h = (0, f.fillScaledRadius)(o, s),
                  c = Math.round(t.x * s),
                  u = t.inverseAnchorPosition
                    ? Math.round(t.anchorY * s) +
                      Math.round(o * s) * t.direction
                    : Math.round(t.anchorY * s) +
                      Math.round((t.labelHeight + a + o) * s) * t.direction,
                  p = (Math.max(1, Math.floor(s)) % 2) / 2,
                  _ = c + p,
                  g = u + p
                if (
                  ((e.shadowOffsetY = 1),
                  (e.shadowColor = i.shadowColor),
                  (e.shadowBlur = 4),
                  e.beginPath(),
                  e.arc(_, g, h, 0, 2 * Math.PI, !0),
                  e.closePath(),
                  e.fill(),
                  (e.shadowColor = 'transparent'),
                  t.svgRenderer)
                ) {
                  const i = 2 * (0, f.fillScaledRadius)(n, s)
                  t.svgRenderer.render(e, {
                    targetViewBox: {
                      x: _ - i / 2,
                      y: g - i / 2,
                      width: i,
                      height: i,
                    },
                  })
                }
                const v = Math.round(i.circleBorderWidth * s),
                  x = (0, f.strokeScaledRadius)(o, s, v)
                if (
                  ((e.lineWidth = v),
                  e.beginPath(),
                  e.arc(_, g, x, 0, 2 * Math.PI, !0),
                  e.closePath(),
                  e.stroke(),
                  i.outsideBorderWidth)
                ) {
                  e.save()
                  const t = Math.round(i.outsideBorderWidth * s),
                    n = x + v / 2 + t / 2
                  ;(e.lineWidth = t),
                    (e.strokeStyle = i.outsideBorderColor),
                    e.beginPath(),
                    e.arc(_, g, n, 0, 2 * Math.PI, !0),
                    e.closePath(),
                    e.stroke(),
                    e.restore()
                }
              })(e, this._data, this._data.plate, n, t),
            this._data.labelRenderer.draw(e, t),
            e.restore()
        }
      }
      var y = i(68616),
        b = i(69798)
      const T = {
          circleBorderColor: (0, r.getHexColorByName)('color-cold-gray-900'),
          labelBackgroundColor: (0, r.getHexColorByName)('color-cold-gray-900'),
          labelBorderColor: (0, r.getHexColorByName)('color-cold-gray-800'),
          labelTextColor: (0, r.getHexColorByName)('color-cold-gray-200'),
          poleColor: (0, r.getHexColorByName)('color-cold-gray-500'),
          shadowColor: 'rgba(0,0,0,0.4)',
          selectionColor: (0, r.getHexColorByName)('color-tv-blue-500'),
        },
        P = {
          circleBorderColor: (0, r.getHexColorByName)('color-white'),
          labelBackgroundColor: (0, r.getHexColorByName)('color-white'),
          labelBorderColor: (0, r.getHexColorByName)('color-cold-gray-150'),
          labelTextColor: (0, r.getHexColorByName)('color-cold-gray-900'),
          poleColor: (0, r.getHexColorByName)('color-cold-gray-500'),
          shadowColor: 'rgba(0,0,0,0.2)',
          selectionColor: (0, r.getHexColorByName)('color-tv-blue-500'),
        }
      class L extends l.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._renderer = new s.CompositeRenderer()),
            (this._emojiCache = null),
            (this._destroyed = !1),
            (this._signpostRenderer = new R(
              a.HitTarget.MovePoint,
              e.isPhantom(),
            )),
            e.properties().childs().emoji.subscribe(this, this._updateEmoji),
            this._updateEmoji()
        }
        destroy() {
          this._source.properties().childs().emoji.unsubscribeAll(this),
            (this._destroyed = !0)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          if (
            (super._updateImpl(),
            this._renderer.clear(),
            !this._updateTimelineRenderer(e))
          )
            return
          if (
            (this._renderer.append(this._signpostRenderer),
            this._source.isPhantom())
          )
            return
          const i = this._itemAnchorY()
          if (null === i) return
          const r = this._points[0],
            s = new n.Point(r.x, i)
          ;(s.data = r.data),
            (s.square = !0),
            this._renderer.append(
              this.createLineAnchor(
                {
                  points: [s],
                  pointsCursorType: [o.PaneCursorType.VerticalResize],
                },
                0,
              ),
            )
        }
        _itemAnchorY() {
          return this._signpostRenderer.itemAnchorY()
        }
        _updateTimelineRenderer(e) {
          var t
          const i = this._source.ownerSource()
          if (null === i) return !1
          const n = this._model.timeScale(),
            r = i.priceScale(),
            s = i.firstValue()
          if (n.isEmpty() || null === r || r.isEmpty() || null === s) return !1
          const o = this._model.dark().value() ? T : P,
            a = this._model.mainSeries(),
            l = this._source.properties().childs(),
            c = l.position.value(),
            u = this._source.customEvent(),
            p =
              i === a
                ? (0, d.getSeriesPosition)(a, u)
                : (0, d.getNoDataPosition)(u, r, s)
          if (null === p) return !1
          const _ = n.indexToCoordinate(p.index),
            g = r.priceToCoordinate(p.price, s),
            f = l.showImage.value()
          let v = (0, d.positionToCoordinate)(c, e, g, p.positionPointDirection)
          v >= -1e-10 && v <= e + 1e-10 && (v = Math.min(e - 2, Math.max(2, v)))
          const x = p.visualDirection !== p.positionPointDirection,
            m = p.visualDirection,
            w = {
              emojiRadius: 16,
              poleColor: o.poleColor,
              svgRenderer:
                null === (t = this._emojiCache) || void 0 === t
                  ? void 0
                  : t.emojiSvgRenderer,
              itemIndex: 1,
              label: {
                labelIndex: 1,
                labelDirection: p.positionPointDirection,
                labelFont: h.CHART_FONT_FAMILY,
                labelFontSize: l.fontSize.value(),
                labelFontBold: l.bold.value(),
                labelFontItalic: l.italic.value(),
                labelBorderRadius: 4,
                labelPadding: 3,
                labelBoxPaddingVert: 6,
                labelBoxPaddingHorz: 8,
                labelWordWrapWidth: 134,
                labelColor: o.labelTextColor,
                labelBorderColor: o.labelBorderColor,
                labelBackgroundColor: o.labelBackgroundColor,
                text: l.text.value(),
              },
              x: _,
              anchorY: v,
              poleStartY: p.poleStartY,
              direction: m * (x ? -1 : 1),
              inverseAnchorPosition: x,
            }
          return (
            f &&
              (w.plate = {
                circleBackgroundColor: l.backgroundsColors.value(),
                outsideBorderWidth: 0,
                circleBorderColor: o.circleBorderColor,
                circleBorderWidth: 1,
                poleTailHeight: l.text.value() ? 10 : 0,
                circleRadius: 35,
                shadowColor: o.shadowColor,
                outsideBorderColor: o.selectionColor,
              }),
            this._signpostRenderer.setData(w),
            !0
          )
        }
        async _updateEmoji() {
          var e
          const t = this._source.properties().childs().emoji.value()
          if (null !== this._emojiCache && this._emojiCache.emoji === t) return
          null !== this._emojiCache &&
            (null === (e = this._emojiCache.abortController) ||
              void 0 === e ||
              e.abort(),
            (this._emojiCache.abortController = void 0))
          const n = (0, y.getTwemojiUrl)(t, 'svg'),
            r = new AbortController(),
            s = (0, b.fetch)(n, { signal: r.signal }).then((e) => e.text()),
            o = { emoji: t, abortController: r }
          this._emojiCache = o
          const [a, { svgRenderer: l }] = await Promise.all([
            s,
            i.e(2616).then(i.bind(i, 50765)),
          ])
          !this._destroyed &&
            o.abortController &&
            ((o.emojiSvgRenderer = l(a)),
            this._model.updateSource(this._source))
        }
      }
    },
    5362: (e, t, i) => {
      i.r(t), i.d(t, { SineLinePaneView: () => h })
      var n = i(86441),
        r = i(79191),
        s = i(19266),
        o = i(15187),
        a = i(18807),
        l = i(68441)
      class d extends o.MediaCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = e)
        }
        hitTest(e, t) {
          const i = ((e.x - this._data.point.x) * Math.PI) / this._data.width
          let n = (Math.sin(i - Math.PI / 2) * this._data.height) / 2
          return (
            (n = this._data.point.y + n + this._data.height / 2),
            Math.abs(n - e.y) <= 3
              ? new a.HitTestResult(a.HitTarget.MovePoint)
              : null
          )
        }
        _drawImpl(e) {
          const t = e.context
          ;(t.strokeStyle = this._data.color),
            (t.lineWidth = this._data.lineWidth),
            (0, l.setLineStyle)(t, this._data.lineStyle),
            t.beginPath(),
            t.moveTo(this._data.point.x, this._data.point.y)
          const i = Math.max(1, this._data.width / 30),
            n = e.mediaSize.width - this._data.point.x + i
          for (let e = 1; e <= n; e += i) {
            const i = (e * Math.PI) / this._data.width,
              n = (Math.sin(i - Math.PI / 2) * this._data.height) / 2
            t.lineTo(
              this._data.point.x + e,
              this._data.point.y + n + this._data.height / 2,
            )
          }
          t.stroke()
        }
      }
      class h extends r.LineSourcePaneView {
        constructor(e, t) {
          super(e, t), (this._renderer = new s.CompositeRenderer())
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          if (
            (super._updateImpl(),
            this._renderer.clear(),
            this._points.length < 2)
          )
            return
          const [i, r] = this._source.points()
          if (0 === 2 * Math.abs(i.index - r.index))
            return void this.addAnchors(this._renderer)
          const [s, o] = this._points,
            a = Math.abs(s.x - o.x),
            l = o.y - s.y,
            h = this._source.properties().childs(),
            c = h.linewidth.value()
          if ((s.y < -c && o.y < -c) || (s.y > e + c && o.y > e + c)) return
          const u = 2 * a,
            p =
              s.x > 0
                ? s.x - Math.ceil(s.x / u) * u
                : s.x + Math.floor(-s.x / u) * u,
            _ = {
              point: new n.Point(p, s.y),
              width: a,
              height: l,
              color: h.linecolor.value(),
              lineWidth: h.linewidth.value(),
              lineStyle: h.linestyle.value(),
            }
          this._renderer.append(new d(_)), this.addAnchors(this._renderer)
        }
      }
    },
    15378: (e, t, i) => {
      i.r(t), i.d(t, { StickerPaneView: () => r })
      var n = i(50761)
      class r extends n.SvgIconPaneView {
        _iconColor() {
          return null
        }
      }
    },
    44666: (e, t, i) => {
      i.r(t), i.d(t, { StudyLineDataSourceAnchorsPaneView: () => r })
      var n = i(79191)
      class r extends n.LineSourcePaneView {
        renderer() {
          return (
            this._invalidated && (this._updateImpl(), (this._invalidated = !1)),
            this.createLineAnchor({ points: this._getPoints() }, 0)
          )
        }
      }
    },
    50761: (e, t, i) => {
      i.d(t, { SvgIconPaneView: () => g })
      var n = i(86441),
        r = i(25422),
        s = i(50151),
        o = i(87095),
        a = i(19266),
        l = i(66103),
        d = i(79191),
        h = i(33013),
        c = i(15187),
        u = i(18807)
      const p = (0, h.getHexColorByName)('color-tv-blue-600')
      class _ extends c.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e, t) {
          if (null === this._data) return null
          const { size: i, angle: n, point: s } = this._data,
            o = (0, r.rotationMatrix)(-n),
            a = (0, r.transformPoint)(o, e.subtract(s))
          return Math.abs(a.y) <= i / 2 && Math.abs(a.x) <= i / 2
            ? new u.HitTestResult(u.HitTarget.MovePoint)
            : null
        }
        isOutOfScreen(e, t) {
          if (null === this._data) return !0
          const { size: i, point: n, angle: r } = this._data
          let s
          return (
            (s = r % (Math.PI / 2) == 0 ? i / 2 : Math.sqrt(i ** 2 * 2) / 2),
            n.x + s < 0 || n.x - s > t || n.y + s < 0 || n.y - s > e
          )
        }
        _drawImpl(e) {
          if (null === this._data) return
          const {
              size: t,
              svg: i,
              point: n,
              angle: r,
              color: s,
              background: o,
              selected: a,
            } = this._data,
            l = e.context
          l.translate(n.x, n.y)
          const d = r - Math.PI / 2
          l.rotate(d)
          const h = t / 2
          a &&
            ((l.fillStyle = o),
            (l.strokeStyle = p),
            l.beginPath(),
            l.rect(-h, -h, t, t),
            l.closePath(),
            l.fill(),
            l.stroke()),
            i &&
              (l.translate(-h, -h),
              null !== s && (l.fillStyle = s),
              i.render(l, {
                targetViewBox: { x: 0, y: 0, width: t, height: t },
                doNotApplyColors: null !== s,
              }))
        }
      }
      class g extends d.LineSourcePaneView {
        constructor(e, t, i) {
          super(e, t),
            (this._iconRenderer = new _()),
            (this._renderer = new a.CompositeRenderer()),
            (this._svg = i)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          if (
            (super._updateImpl(),
            this._renderer.clear(),
            this._points.length < 1)
          )
            return
          const i = this._source.properties().childs(),
            s = i.size.value(),
            o = {
              point: this._points[0],
              color: this._iconColor(),
              size: s,
              svg: this._svg,
              angle: i.angle.value(),
              selected: this.areAnchorsVisible(),
              background: this._calculateBackgroundColor(),
            }
          this._iconRenderer.setData(o),
            this._iconRenderer.isOutOfScreen(e, t) ||
              this._renderer.append(this._iconRenderer)
          const a = this._points[0],
            h = this._source.getAnchorLimit()
          let c = new n.Point(Math.max(h, s) / 2, 0),
            u = new n.Point(0, Math.max(h, s) / 2)
          const p = (0, r.rotationMatrix)(i.angle.value())
          ;(c = (0, r.transformPoint)(p, c)), (u = (0, r.transformPoint)(p, u))
          const _ = a.add(c)
          ;(_.data = 0), (_.nonDiscreteIndex = !0)
          const g = a.subtract(c)
          ;(g.data = 1), (g.nonDiscreteIndex = !0)
          const f = a.add(u)
          ;(f.data = 2), (f.square = !0), (f.nonDiscreteIndex = !0)
          const v = a.subtract(u)
          ;(v.data = 3), (v.square = !0), (v.nonDiscreteIndex = !0)
          const x = (0, d.thirdPointCursorType)(_, g),
            m = [l.PaneCursorType.Default, l.PaneCursorType.Default, x, x]
          this._renderer.append(
            this.createLineAnchor(
              { points: [_, g, f, v], pointsCursorType: m },
              0,
            ),
          )
        }
        _calculateBackgroundColor() {
          return (0, o.generateColor)(
            this._model.backgroundColorAtYPercentFromTop(
              this._points[0].y /
                (0, s.ensureNotNull)(
                  this._model.paneForSource(this._source),
                ).height(),
            ),
            60,
            !0,
          )
        }
      }
    },
    62912: (e, t, i) => {
      i.r(t), i.d(t, { TextPaneView: () => _ })
      var n = i(50151),
        r = i(86441),
        s = i(46501),
        o = i(66103),
        a = i(80657),
        l = i(19266),
        d = i(80101),
        h = i(78211),
        c = i(18807),
        u = i(79191)
      const p = [o.PaneCursorType.HorizontalResize]
      class _ extends u.LineSourcePaneView {
        constructor(e, t, i, n, r, s, o, l) {
          super(e, t),
            (this._textRenderer = new a.TextRenderer()),
            (this._noSelection = !1),
            (this._renderer = null),
            (this._offsetX = i),
            (this._offsetY = n),
            (this._vertAlign = r),
            (this._horzAlign = s),
            (this._forceTextAlign = Boolean(o)),
            (this._noSelection = !1),
            (this._renderer = null),
            (this._recalculateSourcePointsOnFirstUpdate = l)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        disableSelection() {
          this._noSelection = !0
        }
        isEditMode() {
          return !this._getModel().readOnly()
        }
        _updateImpl(e, t) {
          super._updateImpl(e, t), (this._renderer = null)
          const i = this._getSource(),
            o = i.priceScale()
          if (!o || o.isEmpty()) return
          const a = i.properties().childs(),
            u = this._getModel(),
            _ = {
              text: a.text.value(),
              color: a.color.value(),
              fontSize: a.fontsize.value(),
              boxPadding: a.fontsize.value() / 6,
              font: s.CHART_FONT_FAMILY,
              vertAlign: this._vertAlign || 'top',
              horzAlign: this._horzAlign || 'left',
              offsetX: this._offsetX || 0,
              offsetY: this._offsetY || 0,
              forceTextAlign: this._forceTextAlign,
            }
          if (
            ((_.points = i.isFixed()
              ? [(0, n.ensureDefined)(i.fixedPoint())]
              : this._points),
            a.fillBackground &&
              a.fillBackground.value() &&
              (_.backgroundColor = a.backgroundColor.value()),
            a.drawBorder &&
              a.drawBorder.value() &&
              (_.borderColor = a.borderColor.value()),
            a.wordWrap &&
              a.wordWrap.value() &&
              (_.wordWrapWidth = a.wordWrapWidth.value()),
            (_.bold = a.bold && a.bold.value()),
            (_.italic = a.italic && a.italic.value()),
            (_.highlightBorder = u.selection().isSelected(i)),
            !i.isFixed() && a.fixedSize && !a.fixedSize.value())
          ) {
            _.scaleX = u.timeScale().barSpacing() / i.barSpacing()
            const e = (0, n.ensureNotNull)(o.priceRange())
            let t = o.height() / e.length()
            const r = o.logFormula()
            i.isPriceDencityLog() &&
              !o.isLog() &&
              (t =
                o.height() /
                ((0, h.toLog)(e.maxValue(), r) -
                  (0, h.toLog)(e.minValue(), r))),
              !i.isPriceDencityLog() &&
                o.isLog() &&
                (t =
                  o.height() /
                  ((0, h.fromLog)(e.maxValue(), r) -
                    (0, h.fromLog)(e.minValue(), r)))
            const s = i.priceDencity()
            void 0 !== s && (_.scaleY = t / s),
              (void 0 === s || void 0 === _.scaleY || _.scaleY <= 0) &&
                delete _.scaleY
          }
          if (
            (this._textRenderer.setData(_),
            this._textRenderer.isOutOfScreen(t, e))
          )
            return
          const g = 1 === _.points.length
          if (g && void 0 !== this._recalculateSourcePointsOnFirstUpdate) {
            this._renderer = null
            const e = this._textRenderer.measure()
            return (
              this._recalculateSourcePointsOnFirstUpdate(e.width, e.height),
              void (this._recalculateSourcePointsOnFirstUpdate = void 0)
            )
          }
          if (g && !this._noSelection) {
            const e = new l.CompositeRenderer()
            e.append(this._textRenderer)
            const t = _.points[0].clone(),
              i = this._textRenderer.measure(),
              n = i.width,
              s = i.height
            if (_.wordWrapWidth) {
              const i = new r.Point(t.x + n, t.y + s / 2)
              ;(i.data = 1),
                e.append(
                  this.createLineAnchor(
                    { points: [i], pointsCursorType: p },
                    1,
                  ),
                )
            }
            const o = new r.Point(t.x + n / 2, t.y + s)
            return (
              (o.data = 0),
              e.append(
                new d.SelectionRenderer({
                  points: [o],
                  bgColors: this._lineAnchorColors([o]),
                  visible: this.areAnchorsVisible(),
                  hittestResult: c.HitTarget.MovePoint,
                  barSpacing: u.timeScale().barSpacing(),
                }),
              ),
              void (this._renderer = e)
            )
          }
          this._renderer = this._textRenderer
        }
      }
    },
    90042: (e, t, i) => {
      i.r(t), i.d(t, { LineToolThreeDrivesPaneView: () => u })
      var n = i(79849),
        r = i(19266),
        s = i(80657),
        o = i(87663),
        a = i(99031),
        l = i(73436),
        d = i(79797),
        h = i(79191),
        c = i(46501)
      class u extends h.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._numericFormatter = new o.NumericFormatter()),
            (this._retrace1LabelRenderer = new s.TextRenderer()),
            (this._retrace12LabelRenderer = new s.TextRenderer()),
            (this._polyLineRenderer = new d.PolygonRenderer()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          super._updateImpl(), (this._renderer = null)
          let e = Number.NaN,
            t = Number.NaN
          if (this._source.points().length >= 4) {
            const [, t, i, n] = this._source.points()
            e =
              Math.round(
                100 * Math.abs((n.price - i.price) / (i.price - t.price)),
              ) / 100
          }
          if (this._source.points().length >= 6) {
            const [, , , e, i, n] = this._source.points()
            t =
              Math.round(
                100 * Math.abs((n.price - i.price) / (i.price - e.price)),
              ) / 100
          }
          if (this._points.length < 2) return
          const i = this._source.properties().childs(),
            s = new r.CompositeRenderer(),
            o = (e, t) => ({
              points: [e],
              text: t,
              color: i.textcolor.value(),
              vertAlign: 'middle',
              horzAlign: 'center',
              font: c.CHART_FONT_FAMILY,
              offsetX: 0,
              offsetY: 0,
              bold: i.bold && i.bold.value(),
              italic: i.italic && i.italic.value(),
              fontsize: i.fontsize.value(),
              backgroundColor: i.color.value(),
              backgroundRoundRect: 4,
            }),
            d = (e, t) => ({
              points: [e, t],
              color: i.color.value(),
              linewidth: i.linewidth.value(),
              linestyle: n.LINESTYLE_DOTTED,
              extendleft: !1,
              extendright: !1,
              leftend: l.LineEnd.Normal,
              rightend: l.LineEnd.Normal,
            }),
            h = {
              points: this._points,
              color: i.color.value(),
              linewidth: i.linewidth.value(),
              linestyle: n.LINESTYLE_SOLID,
              leftend: l.LineEnd.Normal,
              rightend: l.LineEnd.Normal,
              backcolor: 'rgba(0, 0, 0, 0)',
              fillBackground: !1,
              filled: !1,
            }
          if (
            (this._polyLineRenderer.setData(h),
            s.append(this._polyLineRenderer),
            !isNaN(e))
          ) {
            const t = new a.TrendLineRenderer()
            t.setData(d(this._points[1], this._points[3])), s.append(t)
            const i = o(
              this._points[1].add(this._points[3]).scaled(0.5),
              this._numericFormatter.format(e),
            )
            this._retrace1LabelRenderer.setData(i),
              s.append(this._retrace1LabelRenderer)
          }
          if (!isNaN(t)) {
            const e = new a.TrendLineRenderer()
            e.setData(d(this._points[3], this._points[5])), s.append(e)
            const i = o(
              this._points[5].add(this._points[3]).scaled(0.5),
              this._numericFormatter.format(t),
            )
            this._retrace12LabelRenderer.setData(i),
              s.append(this._retrace12LabelRenderer)
          }
          this.addAnchors(s), (this._renderer = s)
        }
      }
    },
    65557: (e, t, i) => {
      i.r(t), i.d(t, { TimeCyclesPaneView: () => c })
      var n = i(86441),
        r = i(19266),
        s = i(79191),
        o = i(87095),
        a = i(18807),
        l = i(68441),
        d = i(15187)
      class h extends d.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data || e.y > this._data.point.y) return null
          if (
            e.x < this._data.point.x ||
            e.x > this._data.point.x + this._data.width
          )
            return null
          const t = new n.Point(
            this._data.point.x + this._data.width / 2,
            this._data.point.y,
          )
          let i = e.subtract(t)
          const r = this._data.height / this._data.width
          i = new n.Point(i.x, i.y / r)
          const s = i.length()
          return Math.abs(s - this._data.width / 2) < 3
            ? new a.HitTestResult(a.HitTarget.MovePoint)
            : null
        }
        _drawImpl(e) {
          if (null === this._data) return
          const t = e.context
          ;(t.strokeStyle = this._data.color),
            (t.lineWidth = this._data.linewidth),
            (0, l.setLineStyle)(t, this._data.linestyle),
            t.save(),
            t.translate(this._data.point.x + 1, this._data.point.y),
            t.scale(this._data.width, this._data.height),
            t.beginPath(),
            t.arc(0.5, 0, 0.5, Math.PI, 0, !1),
            t.restore(),
            t.stroke(),
            this._data.fillBackground &&
              ((t.fillStyle = (0, o.generateColor)(
                this._data.backcolor,
                this._data.transparency,
              )),
              t.fill())
        }
      }
      class c extends s.LineSourcePaneView {
        constructor() {
          super(...arguments), (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          if (
            (super._updateImpl(),
            (this._renderer = null),
            this._points.length < 2)
          )
            return
          const e = this._source.points(),
            t = e[0],
            i = e[1],
            s = Math.min(t.index, i.index),
            o = Math.max(t.index, i.index),
            a = o - s,
            l = this._points[0],
            d = this._points[1],
            c = Math.abs(l.x - d.x),
            u = new r.CompositeRenderer(),
            p = this._source.properties().childs(),
            _ = this._model.timeScale()
          if (0 === a) return
          let g = Math.min(l.x, d.x)
          const f = []
          for (let e = s; g > -c; e -= a)
            (g = _.indexToCoordinate(e)), f.push(g)
          g = Math.max(l.x, d.x)
          for (let e = o; g < _.width(); e += a)
            (g = _.indexToCoordinate(e)), f.push(g)
          for (let e = 0; e < f.length; e++) {
            const t = {
                point: new n.Point(f[e], l.y),
                width: c,
                height: c,
                color: p.linecolor.value(),
                linewidth: p.linewidth.value(),
                linestyle: p.linestyle.value(),
                fillBackground: p.fillBackground.value(),
                backcolor: p.backgroundColor.value(),
                transparency: p.transparency.value(),
              },
              i = new h()
            i.setData(t), u.append(i)
          }
          this.addAnchors(u), (this._renderer = u)
        }
      }
    },
    67998: (e, t, i) => {
      i.r(t), i.d(t, { TrendAnglePaneView: () => m })
      var n = i(50151),
        r = i(86441),
        s = i(5531),
        o = i(34026),
        a = i(38223),
        l = i(18807),
        d = i(73436),
        h = i(9155),
        c = i(80657),
        u = i(99031),
        p = i(80101),
        _ = i(46501),
        g = i(21477),
        f = i(15187)
      class v extends f.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          return null
        }
        _drawImpl(e) {
          if (null === this._data) return
          const t = e.context
          t.translate(this._data.point.x, this._data.point.y),
            (t.strokeStyle = this._data.color),
            t.setLineDash([1, 2])
          const i = this._data.size
          t.beginPath(),
            t.moveTo(0, 0),
            t.lineTo(i, 0),
            t.arc(0, 0, i, 0, -this._data.angle, this._data.angle > 0),
            t.stroke()
        }
      }
      var x = i(48063)
      class m extends x.TrendToolWithStatsPaneView {
        constructor(e, t) {
          super(e, t),
            (this._secondPoint = null),
            (this._trendRenderer = new u.TrendLineRenderer()),
            (this._angleRenderer = new v()),
            (this._angleLabelRenderer = new c.TextRenderer())
        }
        _getPointsForStats() {
          return [
            this._points[0],
            (0, n.ensureNotNull)(this._middlePoint),
            (0, n.ensureNotNull)(this._secondPoint),
          ]
        }
        _updateImpl(e, t) {
          var i
          this._renderer.clear(), super._updateImpl()
          const n = this._source,
            c = n.angle()
          if (this._points.length > 0 && null !== c) {
            const e = Math.cos(c),
              t = -Math.sin(c),
              i = new r.Point(e, t)
            ;(this._secondPoint = this._points[0].addScaled(i, n.distance())),
              (this._middlePoint = this._source.calcMiddlePoint(
                this._points[0],
                this._secondPoint,
              ))
          }
          this._invalidated = !1
          const u = this._source.priceScale(),
            f = this._model.timeScale()
          if (!u || u.isEmpty() || f.isEmpty()) return
          if (null === this._model.timeScale().visibleBarsStrictRange()) return
          if (this._source.points().length < 2) return
          if (this._points.length < 2 || null === this._secondPoint) return
          const v = this._points[0],
            x = this._points[1],
            m = this._source.properties().childs()
          m.showBarsRange.value() ||
            m.showPriceRange.value() ||
            m.showPercentPriceRange.value() ||
            m.showPipsPriceRange.value() ||
            ((this._label = null),
            this._labelData && (this._labelData.text = ''))
          const w = m.linecolor.value(),
            R = {
              points: [v, this._secondPoint],
              color: w,
              linewidth: m.linewidth.value(),
              linestyle: m.linestyle.value(),
              extendleft: m.extendLeft.value(),
              extendright: m.extendRight.value(),
              leftend: d.LineEnd.Normal,
              rightend: d.LineEnd.Normal,
            }
          this._trendRenderer.setData(R),
            this._renderer.append(this._trendRenderer)
          const y = (0, r.box)(new r.Point(0, 0), new r.Point(t, e))
          let b = !1
          m.statsPosition.value() === h.StatsPosition.Auto &&
            (b = (0, r.equalPoints)(v, x)
              ? !(0, o.pointInBox)(v, y)
              : null ===
                (0, s.intersectLineSegmentAndBox)((0, r.lineSegment)(v, x), y))
          if (
            (this.isHoveredSource() ||
              this.isSelectedSource() ||
              m.alwaysShowStats.value()) &&
            !b &&
            2 === this._points.length
          ) {
            const e = new g.PaneRendererCachedImage(this, 0)
            this._renderer.append(e)
          }
          const T =
            (this.isHoveredSource() || this.isSelectedSource()) &&
            m.showMiddlePoint.value()
          this._middlePoint &&
            this._renderer.append(
              new p.SelectionRenderer({
                points: [this._middlePoint],
                bgColors: this._lineAnchorColors([this._middlePoint]),
                color: w,
                visible: T && this.areAnchorsVisible(),
                hittestResult: l.HitTarget.Regular,
                barSpacing: 0,
              }),
            )
          const P = {
            point: v,
            angle: null !== (i = n.angle()) && void 0 !== i ? i : 0,
            color: m.linecolor.value(),
            size: 50,
          }
          this._angleRenderer.setData(P),
            this._renderer.append(this._angleRenderer)
          const L = Math.round((180 * P.angle) / Math.PI) + 'º',
            C = {
              points: [new r.Point(v.x + 50, v.y)],
              text: (0, a.forceLTRStr)(L),
              color: m.textcolor.value(),
              horzAlign: 'left',
              font: _.CHART_FONT_FAMILY,
              offsetX: 5,
              offsetY: 0,
              bold: m.bold.value(),
              italic: m.italic.value(),
              fontsize: m.fontsize.value(),
              vertAlign: 'middle',
            }
          this._angleLabelRenderer.setData(C),
            this._renderer.append(this._angleLabelRenderer),
            R.points.length >= 2 &&
              this._addAlertRenderer(this._renderer, R.points)
          const S = new r.Point(this._secondPoint.x, this._secondPoint.y)
          ;(S.data = 1),
            this._renderer.append(this.createLineAnchor({ points: [v, S] }, 0))
        }
      }
    },
    38058: (e, t, i) => {
      i.r(t), i.d(t, { TrendBasedFibExtensionPaneView: () => u })
      var n = i(86441),
        r = i(72739),
        s = i(99031),
        o = i(18807),
        a = i(19266),
        l = i(73436),
        d = i(26702),
        h = i(80657),
        c = i(134)
      class u extends c.LineToolPaneViewFibWithLabels {
        constructor(e, t) {
          super(e, t),
            (this._trendLineRendererPoints12 = new s.TrendLineRenderer()),
            (this._trendLineRendererPoints23 = new s.TrendLineRenderer()),
            (this._rectangleRenderers = {}),
            (this._hlevelLineRenderers = {}),
            (this._renderer = new a.CompositeRenderer()),
            (this._levels = [])
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(t, e), this._renderer
        }
        _updateImpl(e, t) {
          var i, a
          if (
            (super._updateImpl(),
            this._renderer.clear(),
            this._points.length < 2)
          )
            return
          const [c, u] = this._points,
            p = this._source.properties().childs()
          if (3 === this._source.points().length) {
            const e = this._source.priceScale()
            if (!e || e.isEmpty() || this._model.timeScale().isEmpty()) return
            const t =
              null === (i = this._source.ownerSource()) || void 0 === i
                ? void 0
                : i.firstValue()
            if (null == t) return
            const [n, r, s] = this._source.points()
            let o = !1
            p.reverse && p.reverse.value() && (o = p.reverse.value()),
              (this._levels = [])
            const a = o ? n.price : r.price,
              l = o ? r.price : n.price,
              h = a - l
            let c, u, _
            const g = e.isLog() && p.fibLevelsBasedOnLogScale.value()
            if (g) {
              c = e.priceToCoordinate(a, t)
              ;(u = c - e.priceToCoordinate(l, t)),
                (_ = e.priceToCoordinate(s.price, t))
            }
            const f = { price: s.price, coordinate: _ },
              v = { price: h, coordinate: u },
              x = this._source.levelsCount()
            for (let i = 1; i <= x; i++) {
              const n = p['level' + i].childs()
              if (!n.visible.value()) continue
              const r = n.coeff.value(),
                s = n.color.value(),
                o = (0, d.fibLevelCoordinate)(f, v, r, e, t, g),
                a = (0, d.fibLevelPrice)(f, v, r, e, t, g)
              this._levels.push({
                color: s,
                price: a,
                y: o,
                linewidth: p.levelsStyle.childs().linewidth.value(),
                linestyle: p.levelsStyle.childs().linestyle.value(),
                index: i,
              })
            }
          }
          const _ = p.trendline.childs()
          if (_.visible.value()) {
            const e = {
              points: [c, u],
              color: _.color.value(),
              linewidth: _.linewidth.value(),
              linestyle: _.linestyle.value(),
              extendleft: !1,
              extendright: !1,
              leftend: l.LineEnd.Normal,
              rightend: l.LineEnd.Normal,
            }
            this._trendLineRendererPoints12.setData(e),
              this._renderer.append(this._trendLineRendererPoints12)
          }
          if (this._points.length < 3)
            return void this.addAnchors(this._renderer)
          const g = this._points[2]
          if (_.visible.value()) {
            const e = {
              points: [u, g],
              color: _.color.value(),
              linewidth: _.linewidth.value(),
              linestyle: _.linestyle.value(),
              extendleft: !1,
              extendright: !1,
              leftend: l.LineEnd.Normal,
              rightend: l.LineEnd.Normal,
            }
            this._trendLineRendererPoints23.setData(e),
              this._renderer.append(this._trendLineRendererPoints23)
          }
          const f = Math.min(g.x, u.x),
            v = Math.max(g.x, u.x),
            x = p.fillBackground.value(),
            m = p.transparency.value(),
            w = p.extendLinesLeft.value(),
            R = p.extendLines.value()
          if (x)
            for (let e = 0; e < this._levels.length; e++)
              if (e > 0 && x) {
                const t = this._levels[e - 1],
                  i = {
                    points: [
                      new n.Point(f, this._levels[e].y),
                      new n.Point(v, t.y),
                    ],
                    color: this._levels[e].color,
                    linewidth: 0,
                    backcolor: this._levels[e].color,
                    fillBackground: !0,
                    transparency: m,
                    extendLeft: w,
                    extendRight: R,
                  }
                Object.hasOwn(this._rectangleRenderers, e) ||
                  (this._rectangleRenderers[e] = new r.RectangleRenderer(
                    void 0,
                    void 0,
                    !0,
                  ))
                const s = this._rectangleRenderers[e]
                s.setData(i), this._renderer.append(s)
              }
          let y = f,
            b = v
          y === b && (w && (y -= 1), R && (b += 1))
          for (let i = 0; i < this._levels.length; i++) {
            const r = new n.Point(y, this._levels[i].y),
              d = new n.Point(b, this._levels[i].y)
            let c
            const u = this._updateLabelForLevel({
              i,
              levelIndex: this._levels[i].index,
              leftPoint: r,
              rightPoint: d,
              price: this._levels[i].price,
              color: this._levels[i].color,
              extendLeft: w,
              extendRight: R,
              horzAlign: p.horzLabelsAlign.value(),
              vertAlign: p.vertLabelsAlign.value(),
            })
            null !== u &&
              (this._renderer.append(u),
              'middle' === p.vertLabelsAlign.value() &&
                (c =
                  null !== (a = (0, h.getTextBoundaries)(u, e, t)) &&
                  void 0 !== a
                    ? a
                    : void 0))
            const _ = {
              points: [r, d],
              color: this._levels[i].color,
              linewidth: this._levels[i].linewidth,
              linestyle: this._levels[i].linestyle,
              extendleft: w,
              extendright: R,
              leftend: l.LineEnd.Normal,
              rightend: l.LineEnd.Normal,
              excludeBoundaries: c,
            }
            Object.hasOwn(this._hlevelLineRenderers, i) ||
              (this._hlevelLineRenderers[i] = new s.TrendLineRenderer())
            const g = this._hlevelLineRenderers[i]
            g.setData(_),
              g.setHitTest(
                new o.HitTestResult(
                  o.HitTarget.MovePoint,
                  { snappingPrice: this._levels[i].price },
                  this._levels[i].index,
                ),
              ),
              this._renderer.append(g)
          }
          this.addAnchors(this._renderer)
        }
      }
    },
    33482: (e, t, i) => {
      i.r(t), i.d(t, { TrendBasedFibTimePaneView: () => p })
      var n = i(86441),
        r = i(71254),
        s = i(80657),
        o = i(72739),
        a = i(99031),
        l = i(18807),
        d = i(19266),
        h = i(73436),
        c = i(46501),
        u = i(79191)
      class p extends u.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._trendLineRendererPoints12 = new a.TrendLineRenderer()),
            (this._trendLineRendererPoints23 = new a.TrendLineRenderer()),
            (this._renderer = new d.CompositeRenderer()),
            (this._levels = [])
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _updateImpl(e, t) {
          var i
          super._updateImpl(), this._renderer.clear()
          const a = this._source.properties().childs()
          if (3 === this._source.points().length) {
            const e = this._model.timeScale()
            if (e.isEmpty()) return
            const [t, i, n] = this._source.points()
            if (((this._levels = []), i.index === t.index)) return
            const r = i.index - t.index,
              s = n.index
            if (null === e.visibleBarsStrictRange()) return
            for (let t = 1; t <= 11; t++) {
              const i = a['level' + t].childs()
              if (!i.visible.value()) continue
              const n = i.coeff.value(),
                o = i.color.value(),
                l = Math.round(s + n * r),
                d = {
                  x: e.indexToCoordinate(l),
                  coeff: n,
                  color: o,
                  linewidth: i.linewidth.value(),
                  linestyle: i.linestyle.value(),
                  index: t,
                  text: String(n),
                }
              this._levels.push(d)
            }
          }
          if (this._points.length < 2) return
          const u = new d.CompositeRenderer(),
            [p, _] = this._points,
            g = a.trendline.childs()
          if (g.visible.value()) {
            const e = {
              points: [p, _],
              color: g.color.value(),
              linewidth: g.linewidth.value(),
              linestyle: g.linestyle.value(),
              extendleft: !1,
              extendright: !1,
              leftend: h.LineEnd.Normal,
              rightend: h.LineEnd.Normal,
            }
            this._trendLineRendererPoints12.setData(e),
              u.append(this._trendLineRendererPoints12)
          }
          if (this._points.length < 3)
            return this.addAnchors(u), void (this._renderer = u)
          const f = this._points[2]
          if (g.visible.value()) {
            const e = {
              points: [_, f],
              color: g.color.value(),
              linewidth: g.linewidth.value(),
              linestyle: g.linestyle.value(),
              extendleft: !1,
              extendright: !1,
              leftend: h.LineEnd.Normal,
              rightend: h.LineEnd.Normal,
            }
            this._trendLineRendererPoints23.setData(e),
              u.append(this._trendLineRendererPoints23)
          }
          if (a.fillBackground.value()) {
            const t = a.transparency.value()
            for (let i = 1; i < this._levels.length; i++) {
              const r = this._levels[i - 1],
                s = {
                  points: [
                    new n.Point(r.x, 0),
                    new n.Point(this._levels[i].x, e),
                  ],
                  color: this._levels[i].color,
                  linewidth: 0,
                  backcolor: this._levels[i].color,
                  fillBackground: !0,
                  transparency: t,
                  extendLeft: !1,
                  extendRight: !1,
                },
                a = new o.RectangleRenderer(void 0, void 0, !0)
              a.setData(s), u.append(a)
            }
          }
          let v = a.horzLabelsAlign.value()
          v = 'left' === v ? 'right' : 'right' === v ? 'left' : 'center'
          const x = a.vertLabelsAlign.value(),
            m = a.showCoeffs.value()
          for (let o = 0; o < this._levels.length; o++) {
            let a
            if (m) {
              let r
              switch (x) {
                case 'top':
                  r = new n.Point(this._levels[o].x, 0)
                  break
                case 'middle':
                  r = new n.Point(this._levels[o].x, 0.5 * e)
                  break
                default:
                  r = new n.Point(this._levels[o].x, e)
              }
              const l = {
                  points: [r],
                  text: this._levels[o].text,
                  color: this._levels[o].color,
                  vertAlign: x,
                  horzAlign: v,
                  font: c.CHART_FONT_FAMILY,
                  offsetX: 2,
                  offsetY: 0,
                  fontsize: 12,
                },
                d = new s.TextRenderer(l)
              this._needLabelExclusionPath(d) &&
                (a =
                  null !== (i = (0, s.getTextBoundaries)(d, t, e)) &&
                  void 0 !== i
                    ? i
                    : void 0),
                u.append(d)
            }
            const d = {
                x: this._levels[o].x,
                color: this._levels[o].color,
                linewidth: this._levels[o].linewidth,
                linestyle: this._levels[o].linestyle,
                excludeBoundaries: a,
              },
              h = new l.HitTestResult(
                l.HitTarget.MovePoint,
                void 0,
                this._levels[o].index,
              ),
              p = new r.VerticalLineRenderer()
            p.setData(d), p.setHitTest(h), u.append(p)
          }
          this.addAnchors(u), (this._renderer = u)
        }
        _needLabelExclusionPath(e) {
          return (
            'center' ===
            this._source.properties().childs().horzLabelsAlign.value()
          )
        }
      }
    },
    96310: (e, t, i) => {
      i.r(t), i.d(t, { TrendLinePaneView: () => g })
      var n = i(50151),
        r = i(86441),
        s = i(34026),
        o = i(5531),
        a = i(21477),
        l = i(80657),
        d = i(9155),
        h = i(80101),
        c = i(99031),
        u = i(46501),
        p = i(18807),
        _ = i(48063)
      class g extends _.TrendToolWithStatsPaneView {
        constructor() {
          super(...arguments),
            (this._trendRenderer = new c.TrendLineRenderer()),
            (this._labelRenderer = new l.TextRenderer())
        }
        _getPointsForStats() {
          return [
            this._points[0],
            (0, n.ensureNotNull)(this._middlePoint),
            this._points[1],
          ]
        }
        _updateImpl(e, t) {
          var i
          this._renderer.clear(), (this._invalidated = !1)
          const n = this._source.priceScale(),
            c = this._model.timeScale()
          if (!n || n.isEmpty() || c.isEmpty()) return
          const _ = this._model.timeScale().visibleBarsStrictRange()
          if (null === _) return
          const g = this._source.points()
          if (g.length < 2) return
          const f = g[0],
            v = g[1],
            x = this._source.properties().childs()
          if (
            f.index < _.firstBar() &&
            v.index < _.firstBar() &&
            !x.extendLeft.value() &&
            !x.extendRight.value()
          )
            return
          if ((super._updateImpl(), this._points.length < 2)) return
          x.showPriceRange.value() ||
            x.showPercentPriceRange.value() ||
            x.showPipsPriceRange.value() ||
            x.showBarsRange.value() ||
            x.showDateTimeRange.value() ||
            x.showDistance.value() ||
            x.showAngle.value() ||
            ((this._label = null),
            this._labelData && (this._labelData.text = ''))
          const m = this._points[0],
            w = this._points[1]
          let R
          if (x.showLabel && x.showLabel.value() && x.text.value().length > 0) {
            const n = m.x < w.x ? m : w,
              s = n === m ? w : m,
              o = x.vertLabelsAlign.value(),
              a = x.horzLabelsAlign.value()
            let d
            d =
              'left' === a
                ? n.clone()
                : 'right' === a
                  ? s.clone()
                  : new r.Point((m.x + w.x) / 2, (m.y + w.y) / 2)
            const h = Math.atan((s.y - n.y) / (s.x - n.x)),
              c = {
                points: [d],
                text: x.text.value(),
                color: x.textcolor.value(),
                vertAlign: o,
                horzAlign: a,
                font: u.CHART_FONT_FAMILY,
                offsetX: 0,
                offsetY: 0,
                bold: x.bold.value(),
                italic: x.italic.value(),
                fontsize: x.fontsize.value(),
                forceTextAlign: !0,
                angle: h,
              }
            this._labelRenderer.setData(c),
              this._renderer.append(this._labelRenderer),
              this._needLabelExclusionPath(this._labelRenderer) &&
                (R =
                  null !==
                    (i = (0, l.getTextBoundaries)(this._labelRenderer, t, e)) &&
                  void 0 !== i
                    ? i
                    : void 0)
          }
          const y = x.linecolor.value(),
            b = {
              points: this._points,
              color: y,
              linewidth: x.linewidth.value(),
              linestyle: x.linestyle.value(),
              extendleft: x.extendLeft.value(),
              extendright: x.extendRight.value(),
              leftend: x.leftEnd.value(),
              rightend: x.rightEnd.value(),
              excludeBoundaries: R,
            }
          this._trendRenderer.setData(b),
            this._renderer.append(this._trendRenderer)
          const T = (0, r.box)(new r.Point(0, 0), new r.Point(t, e))
          let P = !1
          x.statsPosition.value() === d.StatsPosition.Auto &&
            (P = (0, r.equalPoints)(m, w)
              ? !(0, s.pointInBox)(m, T)
              : null ===
                (0, o.intersectLineSegmentAndBox)((0, r.lineSegment)(m, w), T))
          if (
            (((this.isHoveredSource() || this.isSelectedSource()) &&
              this.isEditMode()) ||
              x.alwaysShowStats.value()) &&
            !P &&
            2 === this._points.length
          ) {
            const e = new a.PaneRendererCachedImage(this, 0)
            this._renderer.append(e)
          }
          const L =
            (this.isHoveredSource() || this.isSelectedSource()) &&
            x.showMiddlePoint.value()
          this._middlePoint &&
            this._renderer.append(
              new h.SelectionRenderer({
                points: [this._middlePoint],
                bgColors: this._lineAnchorColors([this._middlePoint]),
                color: y,
                visible: L && this.areAnchorsVisible(),
                hittestResult: p.HitTarget.Regular,
                barSpacing: 0,
              }),
            ),
            this.addAnchors(this._renderer),
            b.points.length >= 2 &&
              this._addAlertRenderer(this._renderer, b.points)
        }
      }
    },
    48063: (e, t, i) => {
      i.d(t, { TrendToolWithStatsPaneView: () => W })
      var n = i(50151),
        r = i(86441),
        s = i(5531),
        o = i(11542),
        a = i(38223),
        l = i(19266),
        d = i(93572),
        h = i(87663),
        c = i(2043),
        u = i(57322),
        p = i(57352),
        _ = i(27714),
        g = i(34026),
        f = i(49483),
        v = i(80657),
        x = i(18807),
        m = i(68441),
        w = i(1722),
        R = i(74359),
        y = i(57898)
      class b {
        constructor(e, t, i) {
          ;(this._ready = !1),
            (this._img = ((e, t, i) => {
              const n = new Image()
              return (
                (n.width = t), (n.height = t), (n.onload = i), (n.src = e), n
              )
            })(e, t, () => {
              ;(this._ready = !0), i()
            }))
        }
        ready() {
          return this._ready
        }
        image() {
          return this._img
        }
      }
      let T = null
      const P = 18,
        L = new (class {
          constructor(e, t) {
            ;(this._icons = new Map()),
              (this._onAllIconsLoaded = new y.Delegate()),
              (this._pendingLoading = e.length)
            const i = () => {
              0 == --this._pendingLoading && this._onAllIconsLoaded.fire()
            }
            e.forEach((e) => {
              const n = this._icons.get(e.name) || new Map()
              n.set(e.theme, new b(e.imageData, t, i)),
                this._icons.set(e.name, n)
            })
          }
          getIcon(e, t) {
            return (0, n.ensureDefined)(
              (0, n.ensureDefined)(this._icons.get(e)).get(t),
            )
          }
          onAllIconsReady() {
            return this._onAllIconsLoaded
          }
        })(
          [
            {
              name: 'angle',
              theme: 'dark',
              imageData:
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zLjQ5OTk5IDE1SDIuNjU3NzFMMy4wNjEwNCAxNC4yNjA2TDkuMDYxMDQgMy4yNjA1N0w5LjMwMDQ2IDIuODIxNjJMMTAuMTc4NCAzLjMwMDQ4TDkuOTM4OTMgMy43Mzk0Mkw3LjUxMzg1IDguMTg1NDJDMTAuNTYyMSA5LjY3MjA1IDEwLjk0NTEgMTIuNjI2MSAxMC45OTMxIDE0SDE0LjVIMTVWMTVIMTQuNUgzLjQ5OTk5Wk05Ljk5MTk3IDE0QzkuOTQyMzYgMTIuNzI1OSA5LjU4NjI5IDEwLjI4OCA3LjAzNDM1IDkuMDY0NDlMNC4zNDIyNiAxNEg5Ljk5MTk3WiIgZmlsbD0iI0Y4RjlGRCIvPgo8L3N2Zz4K',
            },
            {
              name: 'angle',
              theme: 'light',
              imageData:
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMy40OTk5OSAxNUgyLjY1NzcxTDMuMDYxMDQgMTQuMjYwNkw5LjA2MTA0IDMuMjYwNTdMOS4zMDA0NiAyLjgyMTYyTDEwLjE3ODQgMy4zMDA0OEw5LjkzODkzIDMuNzM5NDJMNy41MTM4NSA4LjE4NTQyQzEwLjU2MjEgOS42NzIwNSAxMC45NDUxIDEyLjYyNjEgMTAuOTkzMSAxNEgxNC41SDE1VjE1SDE0LjVIMy40OTk5OVpNOS45OTE5NyAxNEM5Ljk0MjM2IDEyLjcyNTkgOS41ODYyOSAxMC4yODggNy4wMzQzNSA5LjA2NDQ5TDQuMzQyMjYgMTRIOS45OTE5N1oiIGZpbGw9IiMyQTJFMzkiLz4NCjwvc3ZnPg0K',
            },
            {
              name: 'barsRange',
              theme: 'dark',
              imageData:
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMiAzVjMuNVY1SDFWNlYxM1YxNEgyVjE1LjVWMTZIM1YxNS41VjE0SDRWMTNWNlY1SDNWMy41VjNIMlpNOC4yMDcxMSA3LjVMNy44NTM1NSA3Ljg1MzU1TDYuNzA3MTEgOUgxMS4yOTI5TDEwLjE0NjQgNy44NTM1NUw5Ljc5Mjg5IDcuNUwxMC41IDYuNzkyODlMMTAuODUzNiA3LjE0NjQ1TDEyLjg1MzYgOS4xNDY0NUwxMy4yMDcxIDkuNUwxMi44NTM2IDkuODUzNTVMMTAuODUzNiAxMS44NTM2TDEwLjUgMTIuMjA3MUw5Ljc5Mjg5IDExLjVMMTAuMTQ2NCAxMS4xNDY0TDExLjI5MjkgMTBINi43MDcxMUw3Ljg1MzU1IDExLjE0NjRMOC4yMDcxMSAxMS41TDcuNSAxMi4yMDcxTDcuMTQ2NDUgMTEuODUzNkw1LjE0NjQ1IDkuODUzNTVMNC43OTI4OSA5LjVMNS4xNDY0NSA5LjE0NjQ1TDcuMTQ2NDUgNy4xNDY0NUw3LjUgNi43OTI4OUw4LjIwNzExIDcuNVpNMyA2SDJWMTNIM1Y2Wk0xNSAzLjVWM0gxNlYzLjVWNUgxN1Y2VjEzVjE0SDE2VjE1LjVWMTZIMTVWMTUuNVYxNEgxNFYxM1Y2VjVIMTVWMy41Wk0xNSA2SDE2VjEzSDE1VjZaIiBmaWxsPSIjRjhGOUZEIi8+DQo8L3N2Zz4NCg==',
            },
            {
              name: 'barsRange',
              theme: 'light',
              imageData:
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMiAzVjMuNVY1SDFWNlYxM1YxNEgyVjE1LjVWMTZIM1YxNS41VjE0SDRWMTNWNlY1SDNWMy41VjNIMlpNOC4yMDcxMSA3LjVMNy44NTM1NSA3Ljg1MzU1TDYuNzA3MTEgOUgxMS4yOTI5TDEwLjE0NjQgNy44NTM1NUw5Ljc5Mjg5IDcuNUwxMC41IDYuNzkyODlMMTAuODUzNiA3LjE0NjQ1TDEyLjg1MzYgOS4xNDY0NUwxMy4yMDcxIDkuNUwxMi44NTM2IDkuODUzNTVMMTAuODUzNiAxMS44NTM2TDEwLjUgMTIuMjA3MUw5Ljc5Mjg5IDExLjVMMTAuMTQ2NCAxMS4xNDY0TDExLjI5MjkgMTBINi43MDcxMUw3Ljg1MzU1IDExLjE0NjRMOC4yMDcxMSAxMS41TDcuNSAxMi4yMDcxTDcuMTQ2NDUgMTEuODUzNkw1LjE0NjQ1IDkuODUzNTVMNC43OTI4OSA5LjVMNS4xNDY0NSA5LjE0NjQ1TDcuMTQ2NDUgNy4xNDY0NUw3LjUgNi43OTI4OUw4LjIwNzExIDcuNVpNMyA2SDJWMTNIM1Y2Wk0xNSAzLjVWM0gxNlYzLjVWNUgxN1Y2VjEzVjE0SDE2VjE1LjVWMTZIMTVWMTUuNVYxNEgxNFYxM1Y2VjVIMTVWMy41Wk0xNSA2SDE2VjEzSDE1VjZaIiBmaWxsPSIjMkEyRTM5Ii8+DQo8L3N2Zz4NCg==',
            },
            {
              name: 'priceRange',
              theme: 'dark',
              imageData:
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMyAySDMuNUgxMy41SDE0VjNIMTMuNUgzLjVIM1YyWk04LjUgMy43OTI4OUw4Ljg1MzU1IDQuMTQ2NDVMMTAuODUzNiA2LjE0NjQ1TDExLjIwNzEgNi41TDEwLjUgNy4yMDcxMUwxMC4xNDY0IDYuODUzNTVMOSA1LjcwNzExVjEyLjI5MjlMMTAuMTQ2NCAxMS4xNDY0TDEwLjUgMTAuNzkyOUwxMS4yMDcxIDExLjVMMTAuODUzNiAxMS44NTM2TDguODUzNTUgMTMuODUzNkw4LjUgMTQuMjA3MUw4LjE0NjQ1IDEzLjg1MzZMNi4xNDY0NSAxMS44NTM2TDUuNzkyODkgMTEuNUw2LjUgMTAuNzkyOUw2Ljg1MzU1IDExLjE0NjRMOCAxMi4yOTI5VjUuNzA3MTFMNi44NTM1NSA2Ljg1MzU1TDYuNSA3LjIwNzExTDUuNzkyODkgNi41TDYuMTQ2NDUgNi4xNDY0NUw4LjE0NjQ1IDQuMTQ2NDVMOC41IDMuNzkyODlaTTMuNSAxNkgzVjE1SDMuNUgxMy41SDE0VjE2SDEzLjVIMy41WiIgZmlsbD0iI0Y4RjlGRCIvPg0KPC9zdmc+DQo=',
            },
            {
              name: 'priceRange',
              theme: 'light',
              imageData:
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMyAySDMuNUgxMy41SDE0VjNIMTMuNUgzLjVIM1YyWk04LjUgMy43OTI4OUw4Ljg1MzU1IDQuMTQ2NDVMMTAuODUzNiA2LjE0NjQ1TDExLjIwNzEgNi41TDEwLjUgNy4yMDcxMUwxMC4xNDY0IDYuODUzNTVMOSA1LjcwNzExVjEyLjI5MjlMMTAuMTQ2NCAxMS4xNDY0TDEwLjUgMTAuNzkyOUwxMS4yMDcxIDExLjVMMTAuODUzNiAxMS44NTM2TDguODUzNTUgMTMuODUzNkw4LjUgMTQuMjA3MUw4LjE0NjQ1IDEzLjg1MzZMNi4xNDY0NSAxMS44NTM2TDUuNzkyODkgMTEuNUw2LjUgMTAuNzkyOUw2Ljg1MzU1IDExLjE0NjRMOCAxMi4yOTI5VjUuNzA3MTFMNi44NTM1NSA2Ljg1MzU1TDYuNSA3LjIwNzExTDUuNzkyODkgNi41TDYuMTQ2NDUgNi4xNDY0NUw4LjE0NjQ1IDQuMTQ2NDVMOC41IDMuNzkyODlaTTMuNSAxNkgzVjE1SDMuNUgxMy41SDE0VjE2SDEzLjVIMy41WiIgZmlsbD0iIzJBMkUzOSIvPg0KPC9zdmc+DQo=',
            },
          ],
          P,
        ),
        C = new Map()
      class S {
        constructor(e, t, i) {
          ;(this._fontSize = 0),
            (this._preRendered = !1),
            (this._boundingBox = null),
            (this._rect = null),
            (this._padding = null),
            (this._textPoint = null),
            (this._textSizeCache = t),
            (this._data = e),
            (this._fontSize = e.fontSize ? e.fontSize : 12),
            (this._lineSpacing =
              (0, w.isNumber)(this._data.lineSpacing) && this._data.lineSpacing
                ? this._data.lineSpacing
                : 0),
            (e.lines = this._lines =
              null === e.text
                ? []
                : (0, v.wordWrap)(e.text, this.fontStyle(), e.wordWrapWidth)),
            (this._hittest = i || new x.HitTestResult(x.HitTarget.MovePoint))
        }
        fontStyle() {
          return `${this._data.bold ? 'bold ' : ''}${this._data.italic ? 'italic ' : ''}${this._fontSize}px ${this._data.font}`
        }
        draw(e, t) {
          if (0 === this._data.points.length || null === this._data.text)
            return { width: 0 }
          this._preRender()
          const i = this._fontSize + this._lineSpacing
          ;(e.textBaseline = 'top'), (e.font = this.fontStyle())
          const r = (0, n.ensureNotNull)(this._rect)
          if (this._rect) {
            if (
              (('right' !== this._data.horzAlign &&
                'center' !== this._data.horzAlign) ||
                (!0 !== this._data.doNotAlignText &&
                  (e.textAlign =
                    'right' === this._data.horzAlign ? 'end' : 'center')),
              this._data.backgroundRoundRect
                ? ((0, m.drawRoundRect)(
                    e,
                    r.x,
                    r.y,
                    r.w,
                    r.h,
                    this._data.backgroundRoundRect,
                  ),
                  (e.fillStyle = this._data.backgroundColor),
                  e.fill(),
                  (e.globalAlpha = 1))
                : ((e.fillStyle = this._data.backgroundColor),
                  e.fillRect(r.x, r.y, r.w, r.h),
                  (e.globalAlpha = 1)),
              this._data.icons)
            ) {
              let s = 0
              const o = Math.ceil((P - this._fontSize) / 2),
                a = (0, n.ensureNotNull)(this._padding)
              for (const n of this._data.icons) {
                const l = Math.round(r.x + a.left),
                  d = Math.round(r.y + a.top + i * s - o)
                this._drawIcon(e, l, d, n, Boolean(this._data.isDark), t),
                  (s += 1)
              }
            }
          } else
            'right' === this._data.horzAlign
              ? (e.textAlign = 'end')
              : 'center' === this._data.horzAlign && (e.textAlign = 'center')
          const s = (0, n.ensureNotNull)(this._textPoint),
            o = s.x
          let a = s.y
          e.fillStyle = this._data.color
          for (const t of this._lines) e.fillText(t, o, a), (a += i)
          return { width: r.w + 2 }
        }
        hitTest(e) {
          return 0 === this._data.points.length
            ? null
            : (this._preRender(),
              this._boundingBox && (0, g.pointInBox)(e, this._boundingBox)
                ? this._hittest
                : null)
        }
        _preRender() {
          if (this._preRendered) return
          const e = (() => {
              if (null !== T) return T
              const e = (0, R.createDisconnectedCanvas)(
                document,
                (0, _.size)({ width: 0, height: 0 }),
              )
              return (T = (0, R.getPrescaledContext2D)(e)), T
            })(),
            t = this._data.points[0].x
          let i = t
          const n = this._data.points[0].y
          let s = n
          const o = this._fontSize,
            a = this._lineSpacing,
            l = (o + a) * this._lines.length - a
          ;(e.textBaseline = 'top'), (e.font = this.fontStyle())
          const d = []
          let h
          if (this._data.wordWrapWidth) {
            h = this._data.wordWrapWidth
            for (let e = 0; e < this._lines.length; e++)
              d.push(this._data.wordWrapWidth)
          } else {
            h = 0
            for (let t = 0; t < this._lines.length; t++) {
              const i = e.measureText(this._lines[t]).width
              d.push(i), (h = Math.max(h, i))
            }
          }
          const c = {
              top: this._data.paddingTop,
              right: this._data.paddingRight,
              bottom: this._data.paddingBottom,
              left: this._data.paddingLeft,
            },
            u = {
              x: Math.floor(t),
              y: Math.floor(n),
              w: Math.ceil(h + c.left + c.right),
              h: Math.ceil(l + c.top + c.bottom),
            }
          if (((i += c.left), (s += c.top), this._data.icons)) {
            const e =
              void 0 !== this._data.textPadding
                ? this._data.textPadding
                : Math.round(o / 2)
            ;(i += P + e), (u.w += P + e)
          }
          if (
            'bottom' === this._data.vertAlign ||
            'middle' === this._data.vertAlign
          ) {
            const e =
              'middle' === this._data.vertAlign
                ? n - u.h / 2
                : n - u.h - (u.y - n)
            ;(s += e - u.y), (u.y = e)
          }
          if (
            'right' === this._data.horzAlign ||
            'center' === this._data.horzAlign
          ) {
            const n =
              'center' === this._data.horzAlign
                ? t - u.w / 2
                : t - u.w - (u.x - t)
            ;(i += n - u.x),
              (u.x = n),
              !0 !== this._data.doNotAlignText &&
                ('right' === this._data.horzAlign
                  ? ((e.textAlign = 'end'), (i += h))
                  : ((e.textAlign = 'center'), (i += h / 2)))
          }
          u.w % 2 != 0 && u.w++,
            (u.x += 0.5),
            (u.y += 0.5),
            (this._boundingBox = (0, r.box)(
              new r.Point(u.x, u.y),
              new r.Point(u.x + u.w, u.y + u.h),
            )),
            (this._rect = u),
            (this._padding = c),
            (this._textPoint = { x: i, y: s }),
            this._textSizeCache && (this._textSizeCache.widths = d),
            (this._preRendered = !0)
        }
        _drawIcon(e, t, i, r, s, o) {
          const a = `${r}${this._data.isDark}${o.pixelRatio}`
          let l = C.get(a)
          if (!l) {
            ;(l = document.createElement('canvas')),
              (l.width = P * o.pixelRatio),
              (l.height = P * o.pixelRatio),
              (l.style.width = '18px'),
              (l.style.height = '18px')
            const e = (0, n.ensureNotNull)(l.getContext('2d'))
            e.setTransform(1, 0, 0, 1, 0, 0),
              f.isEdge || e.scale(o.pixelRatio, o.pixelRatio)
            const t = L.getIcon(r, s ? 'dark' : 'light')
            t.ready() && (e.drawImage(t.image(), 0, 0), C.set(a, l))
          }
          e.drawImage(l, t - 0.5, i - 0.5, P, P)
        }
      }
      var M,
        I = i(46501),
        A = i(33295),
        k = i(59224)
      !((e) => {
        ;(e.offset = 8),
          (e.fontSize = 12),
          (e.lineSpacing = 16),
          (e.rectRadius = 4),
          (e.bgColorLight = 'rgba(227,242,253,0.9)'),
          (e.bgColorDark = 'rgba(67,70,81,0.9)'),
          (e.textColorLight = '#2A2E39'),
          (e.textColorDark = '#F8F9FD'),
          (e.textPadding = 10),
          (e.paddingTopBottom = 13),
          (e.paddingLeftRight = 10)
      })(M || (M = {}))
      var N = M.fontSize,
        D = M.lineSpacing,
        B = M.paddingTopBottom
      const z = (0, k.getLogger)('Chart.LineToolTrendLine')
      function E(e, t) {
        return (
          !(!e && !t) &&
          (Boolean(e) !== Boolean(t) ||
            e.index !== t.index ||
            e.price !== t.price)
        )
      }
      function H(e, t) {
        return (
          !(!e && !t) &&
          (Boolean(e) !== Boolean(t) || e.valueOf() !== t.valueOf())
        )
      }
      class V {
        constructor(e) {
          ;(this._sourcesToRow = new Map()),
            (this._rowsToSources = new Map()),
            (this._currentWidth = 400),
            (this._actualCapacity = 1),
            (this._currentSymbol = ''),
            (this._params = e)
          const t = D,
            i = N + t
          ;(this._maxRowHeight = 3 * i - t + 2 * B + 2), this._recreateCanvas()
        }
        destroy() {
          delete this._canvas, delete this._ctx
        }
        canvas() {
          return this._canvas
        }
        topByRow(e) {
          return e * this._maxRowHeight
        }
        rowHeight(e) {
          const t = (0, n.ensureDefined)(this._rowsToSources.get(e)),
            i = (0, n.ensureDefined)(this._sourcesToRow.get(t)).effectiveState
          return null !== i ? i.realRowHeight : this._maxRowHeight
        }
        rowWidth(e) {
          const t = (0, n.ensureDefined)(this._rowsToSources.get(e))
          return (0, n.ensureDefined)(this._sourcesToRow.get(t)).width
        }
        currentWidth() {
          return this._currentWidth
        }
        updateSource(e, t) {
          const i = e.properties().symbol.value()
          this._currentSymbol !== i &&
            (z.logDebug(
              'TrendLineCache. Clearing canvas because of changing symbol from ' +
                this._currentSymbol +
                ' to ' +
                i,
            ),
            (this._currentSymbol = i),
            this._sourcesToRow.clear(),
            this._rowsToSources.clear())
          const r = e.id()
          let s = this._sourcesToRow.get(r)
          if (void 0 === s) {
            const e = this._findEmptyRow(r)
            ;(s = { effectiveState: null, rowIndex: e, width: 0 }),
              this._sourcesToRow.set(r, s),
              this._rowsToSources.set(e, r)
          }
          const o = s.effectiveState,
            a = this._effectiveState(e)
          if (
            !((e, t) => {
              if (null !== e && null === t) return !1
              if (null === e && null !== t) return !1
              const i = (0, n.ensureNotNull)(e),
                r = (0, n.ensureNotNull)(t)
              if (E(i.p1, r.p1)) return !1
              if (E(i.p2, r.p2)) return !1
              if (
                i.dark !== r.dark ||
                i.showBars !== r.showBars ||
                i.showTimeRange !== r.showTimeRange ||
                i.showDistance !== r.showDistance ||
                i.showPriceRange !== r.showPriceRange ||
                i.showPercentPriceRange !== r.showPercentPriceRange ||
                i.showPipsPriceRange !== r.showPipsPriceRange ||
                i.showAngle !== r.showAngle
              )
                return !1
              if (i.showAngle || i.showDistance) {
                if (i.priceRange.min !== r.priceRange.min) return !1
                if (i.priceRange.max !== r.priceRange.max) return !1
                if (i.barSpacing !== r.barSpacing) return !1
              }
              return (
                !H(i.leftUserTime, r.leftUserTime) &&
                !H(i.rightUserTime, r.rightUserTime)
              )
            })(o, a)
          ) {
            const e = t()
            this._repaintSource(r, s.rowIndex, e), (s.effectiveState = a)
          }
          return s
        }
        _findEmptyRow(e) {
          let t = 0
          while (void 0 !== this._rowsToSources.get(t)) t++
          return (
            this._rowsToSources.set(t, e),
            t >= this._actualCapacity &&
              (this._actualCapacity++, this._recreateCanvas()),
            t
          )
        }
        _effectiveState(e) {
          var t, i
          const r = e.properties(),
            s = r.showBarsRange && r.showBarsRange.value(),
            o = r.showDateTimeRange && r.showDateTimeRange.value(),
            a = r.showDistance && r.showDistance.value(),
            l = r.showPriceRange && r.showPriceRange.value(),
            d =
              null === (t = r.showPercentPriceRange) || void 0 === t
                ? void 0
                : t.value(),
            h =
              null === (i = r.showPipsPriceRange) || void 0 === i
                ? void 0
                : i.value(),
            c = r.showAngle && r.showAngle.value()
          let u = 0
          ;(s || o || a) && u++, c && u++, (l || d || h) && u++
          const p = (N + D) * u - D + 2 * B + 2,
            _ = e.points()[0],
            g = e.points()[1],
            f = e.model()
          return {
            p1: Object.assign({}, _),
            p2: Object.assign({}, g),
            leftUserTime: _ ? f.timeScale().indexToUserTime(_.index) : null,
            rightUserTime: g ? f.timeScale().indexToUserTime(g.index) : null,
            props: e.properties(),
            showBars: s,
            showTimeRange: o,
            showDistance: a,
            showPriceRange: l,
            showPipsPriceRange: h,
            showPercentPriceRange: d,
            showAngle: c,
            dark: e.model().dark().value(),
            priceRange: (0, n.ensureNotNull)(
              (0, n.ensureNotNull)(e.priceScale()).priceRange(),
            ).state(),
            barSpacing: e.model().timeScale().barSpacing(),
            realRowHeight: p,
          }
        }
        _repaintSource(e, t, i) {
          ;(i.points[0] = new r.Point(0, 0)),
            delete i.horzAlign,
            delete i.vertAlign
          const { pixelRatio: s } = this._params
          ;(0, R.drawScaled)(this._ctx, s, s, () => {
            this._ctx.translate(0.5, this.topByRow(t) + 0.5),
              this._ctx.clearRect(0, 0, this._currentWidth, this._maxRowHeight)
            const r = new S(i, { widths: [] }).draw(this._ctx, this._params)
            ;(0, n.ensureDefined)(this._sourcesToRow.get(e)).width = r.width
          })
        }
        _recreateCanvas() {
          ;(this._canvas = (0, n.ensureNotNull)(
            document.createElement('canvas'),
          )),
            (this._canvas.width = this._currentWidth * this._params.pixelRatio),
            (this._canvas.height =
              this._maxRowHeight *
              this._actualCapacity *
              this._params.pixelRatio),
            (this._ctx = (0, n.ensureNotNull)(this._canvas.getContext('2d'))),
            (this._ctx.font = `${N}px ${I.CHART_FONT_FAMILY}`),
            this._sourcesToRow.clear(),
            this._rowsToSources.clear()
        }
      }
      var O = i(9155)
      class W extends A.AlertableLineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._renderer = new l.CompositeRenderer()),
            (this._labelData = null),
            (this._label = null),
            (this._percentageFormatter = new d.PercentageFormatter()),
            (this._numericFormatter = new h.NumericFormatter()),
            (this._pipFormatter = null),
            (this._lastSymbolInfo = null),
            (this._cache = null),
            (this._cacheDrawParams = null),
            (this._cacheInvalidated = !0),
            (this._statCache = null),
            (this._iconsReady = !1),
            L.onAllIconsReady().subscribe(this, () => {
              this._cache && (this._cache.destroy(), (this._cache = null)),
                (this._iconsReady = !0),
                t.lightUpdate()
            })
        }
        destroy() {
          this._cache && (this._cache.destroy(), (this._cache = null)),
            L.onAllIconsReady().unsubscribeAll(this)
        }
        iconsReady() {
          return this._iconsReady
        }
        update() {
          super.update(), (this._cacheInvalidated = !0)
        }
        getCacheCanvas(e) {
          return this._createCacheIfRequired(e).canvas()
        }
        getCacheRects(e, t) {
          const i = this._createCacheIfRequired(e),
            o = (0, n.ensureNotNull)(this._statCache),
            a = this._source.properties().childs().statsPosition.value(),
            l = this._getPointsForStats(),
            d = {
              left: 0,
              top: i.topByRow(o.rowIndex),
              width: i.rowWidth(o.rowIndex),
              height: i.rowHeight(o.rowIndex),
            },
            h = a === O.StatsPosition.Auto ? O.StatsPosition.Center : a
          let c = l[h].x + 10,
            u = l[h].y
          const p =
            (this._points[1].y < this._points[0].y &&
              this._points[1].x < this._points[0].x) ||
            (this._points[1].y > this._points[0].y &&
              this._points[1].x > this._points[0].x)
          p ? (u -= 10 + d.height) : (u += 10),
            a !== O.StatsPosition.Auto ||
              (0, r.equalPoints)(
                l[O.StatsPosition.Left],
                l[O.StatsPosition.Right],
              ) ||
              (c < 0
                ? (c = 0)
                : c + d.width > e.cssWidth && (c = e.cssWidth - d.width),
              u < 0
                ? (u = 0)
                : u + d.height > e.cssHeight && (u = e.cssHeight - d.height),
              (0, s.intersectLineSegmentAndBox)(
                (0, r.lineSegment)(
                  l[O.StatsPosition.Left],
                  l[O.StatsPosition.Right],
                ),
                (0, r.box)(
                  (0, r.point)(c, u),
                  (0, r.point)(c + d.width, u + d.height),
                ),
              ) &&
                ((u = p ? l[h].y + 10 : l[h].y - 10 - d.height),
                (c =
                  Math.min(l[O.StatsPosition.Center].x, e.cssWidth) - d.width)))
          return {
            cacheRect: d,
            targetRect: {
              left: Math.floor(c),
              top: Math.floor(u),
              width: d.width,
              height: d.height,
            },
          }
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _createCacheIfRequired(e) {
          return (
            (null !== this._cache &&
              null !== this._cacheDrawParams &&
              (0, p.areEqualPaneRenderParams)(e, this._cacheDrawParams)) ||
              (this._cache && this._cache.destroy(),
              (this._cache = new V(e)),
              (this._statCache = this._cache.updateSource(this._source, () =>
                this._statLabelData(),
              )),
              (this._cacheDrawParams = e),
              (this._cacheInvalidated = !1)),
            this._cacheInvalidated &&
              ((this._statCache = this._cache.updateSource(this._source, () =>
                this._statLabelData(),
              )),
              (this._cacheInvalidated = !1)),
            this._cache
          )
        }
        _updateImpl(e, t) {
          super._updateImpl(e, t)
        }
        _priceRange() {
          var e, t
          const [i, r] = this._source.points(),
            s = this._source.properties().childs(),
            o = s.showPriceRange.value(),
            a = s.showPercentPriceRange.value(),
            l = s.showPipsPriceRange.value(),
            d = (0, n.ensureNotNull)(this._source.ownerSource())
          let h
          if (this._source.priceScale() && (o || a || l)) {
            const n = [],
              s = r.price - i.price
            if (o || a) {
              const l = s / Math.abs(i.price),
                h = []
              if (o) {
                const n = d.formatter(),
                  o =
                    null !==
                      (t =
                        null === (e = n.formatChange) || void 0 === e
                          ? void 0
                          : e.call(n, r.price, i.price)) && void 0 !== t
                      ? t
                      : n.format(s)
                h.push(o)
              }
              if (a) {
                const e = this._percentageFormatter.format(100 * l)
                h.push(o ? `(${e})` : e)
              }
              n.push(h.join(' '))
            }
            const c = this._model.mainSeries().symbolInfo()
            c &&
              c !== this._lastSymbolInfo &&
              ((this._pipFormatter = new u.PipFormatter(
                c.pricescale,
                c.minmov,
                c.type,
                c.minmove2,
                c.typespecs,
              )),
              (this._lastSymbolInfo = c)),
              l && this._pipFormatter && n.push(this._pipFormatter.format(s)),
              (h = n.join(', '))
          }
          return h
        }
        _statLabelData() {
          const [e, t] = this._source.points(),
            r = this._source.properties().childs(),
            s = []
          let l, d, h, u, p
          const _ = this._priceRange()
          void 0 !== _ && s.push('priceRange')
          const g = r.showBarsRange.value(),
            f = r.showDateTimeRange && r.showDateTimeRange.value(),
            v = r.showDistance && r.showDistance.value(),
            x = r.showAngle && r.showAngle.value()
          if (x || v) {
            const i = (0, n.ensureNotNull)(this._source.pointToScreenPoint(e))
            ;(u = (0, n.ensureNotNull)(
              this._source.pointToScreenPoint(t),
            ).subtract(i)),
              (p = Math.round(1e5 * u.length()) / 1e5)
          }
          if (g || f || v) {
            if (
              ((l = ''),
              g &&
                ((h = t.index - e.index),
                (l += o
                  .t(null, void 0, i(33355))
                  .format({ count: (0, a.forceLTRStr)(String(h)) }))),
              f)
            ) {
              const i = this._model.timeScale().indexToUserTime(e.index),
                n = this._model.timeScale().indexToUserTime(t.index)
              if (i && n) {
                const e = (n.valueOf() - i.valueOf()) / 1e3,
                  t = (0, a.startWithLTR)(new c.TimeSpanFormatter().format(e))
                t && (l += g ? ' (' + t + ')' : t)
              }
            }
            v &&
              (l && (l += ', '),
              (l += o
                .t(null, void 0, i(26273))
                .format({
                  number: (0, a.forceLTRStr)(
                    this._numericFormatter.format(Math.round(Number(p))),
                  ),
                }))),
              l && s.push('barsRange')
          }
          if (x) {
            let e
            void 0 !== p &&
              p > 0 &&
              void 0 !== u &&
              ((u = u.normalized()), (e = Math.acos(u.x)), u.y > 0 && (e = -e)),
              'number' != typeof e ||
                isNaN(e) ||
                ((d = Math.round((180 * e) / Math.PI) + 'º'), s.push('angle'))
          }
          this._label =
            [(0, a.forceLTRStr)(_), l, d].filter((e) => null != e).join('\n') ||
            null
          const m = this._model.dark().value(),
            w = m ? 'rgba(67,70,81,0.9)' : 'rgba(227,242,253,0.9)',
            R = m ? '#F8F9FD' : '#2A2E39',
            y = {
              points: [this._points[1]],
              text: this._label,
              color: R,
              isDark: m,
              font: I.CHART_FONT_FAMILY,
              fontSize: 12,
              lineSpacing: 16,
              backgroundColor: w,
              backgroundRoundRect: 4,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 13,
              paddingBottom: 13,
              textPadding: 10,
              doNotAlignText: !0,
              icons: s,
              bold: !1,
              italic: !1,
              lines: [],
              wordWrapWidth: 0,
            }
          return (
            this._points[1].y < this._points[0].y && (y.vertAlign = 'bottom'),
            this._points[1].x < this._points[0].x && (y.horzAlign = 'right'),
            (this._labelData = y),
            y
          )
        }
      }
    },
    23545: (e, t, i) => {
      i.r(t), i.d(t, { LineToolTrianglePatternPaneView: () => p })
      var n = i(50151),
        r = i(86441),
        s = i(79849),
        o = i(19266),
        a = i(99031),
        l = i(10695),
        d = i(80657),
        h = i(73436),
        c = i(79191),
        u = i(46501)
      class p extends c.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._trendLineRendererPoints01 = new a.TrendLineRenderer()),
            (this._trendLineRendererPoints12 = new a.TrendLineRenderer()),
            (this._trendLineRendererPoints23 = new a.TrendLineRenderer()),
            (this._intersectionRenderer = new l.TriangleRenderer()),
            (this._aLabelRenderer = new d.TextRenderer()),
            (this._bLabelRenderer = new d.TextRenderer()),
            (this._cLabelRenderer = new d.TextRenderer()),
            (this._dLabelRenderer = new d.TextRenderer()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          super._updateImpl(), (this._renderer = null)
          const [e, t, i, a] = this._points
          let l, d, c
          if (4 === this._points.length) {
            if (Math.abs(i.x - e.x) < 1 || Math.abs(a.x - t.x) < 1) return
            let n = Math.min(e.x, t.x)
            ;(n = Math.min(n, i.x)), (n = Math.min(n, a.x))
            const s = (i.y - e.y) / (i.x - e.x),
              o = e.y + (n - e.x) * s,
              h = (a.y - t.y) / (a.x - t.x),
              u = t.y + (n - t.x) * h
            if (Math.abs(s - h) < 1e-6) return
            ;(d = new r.Point(n, o)), (c = new r.Point(n, u))
            const p = (t.y - e.y + (e.x * s - t.x * h)) / (s - h)
            if (p < n) {
              let n = Math.max(e.x, t.x)
              ;(n = Math.max(n, i.x)),
                (n = Math.max(n, a.x)),
                (d = new r.Point(n, e.y + (n - e.x) * s)),
                (c = new r.Point(n, t.y + (n - t.x) * h))
            }
            const _ = e.y + (p - e.x) * s
            l = new r.Point(p, _)
          }
          if (this._points.length < 2) return
          const p = this._source.properties().childs(),
            _ = new o.CompositeRenderer(),
            g = (e, t) => ({
              points: [e],
              text: t,
              color: p.textcolor.value(),
              vertAlign: 'middle',
              horzAlign: 'center',
              font: u.CHART_FONT_FAMILY,
              offsetX: 0,
              offsetY: 0,
              bold: p.bold && p.bold.value(),
              italic: p.italic && p.italic.value(),
              fontsize: p.fontsize.value(),
              backgroundColor: p.color.value(),
              backgroundRoundRect: 4,
            }),
            f = (e, t) => ({
              points: [e, t],
              color: p.color.value(),
              linewidth: p.linewidth.value(),
              linestyle: s.LINESTYLE_SOLID,
              extendleft: !1,
              extendright: !1,
              leftend: h.LineEnd.Normal,
              rightend: h.LineEnd.Normal,
            })
          if (
            (this._trendLineRendererPoints01.setData(f(e, t)),
            _.append(this._trendLineRendererPoints01),
            this._points.length >= 3 &&
              (this._trendLineRendererPoints12.setData(f(t, i)),
              _.append(this._trendLineRendererPoints12)),
            4 === this._points.length &&
              (this._trendLineRendererPoints23.setData(f(i, a)),
              _.append(this._trendLineRendererPoints23),
              l))
          ) {
            const e = {
              points: [(0, n.ensureDefined)(d), (0, n.ensureDefined)(c), l],
              color: p.color.value(),
              linewidth: p.linewidth.value(),
              backcolor: p.backgroundColor.value(),
              fillBackground: p.fillBackground.value(),
              transparency: p.transparency.value(),
              linestyle: s.LINESTYLE_DOTTED,
            }
            this._intersectionRenderer.setData(e),
              _.append(this._intersectionRenderer)
          }
          const v = g(e, 'A')
          t.y > e.y
            ? ((v.vertAlign = 'bottom'), (v.offsetY = 5))
            : ((v.vertAlign = 'top'), (v.offsetY = 5)),
            this._aLabelRenderer.setData(v),
            _.append(this._aLabelRenderer)
          const x = g(t, 'B')
          if (
            (t.y < e.y
              ? ((x.vertAlign = 'bottom'), (x.offsetY = 5))
              : ((x.vertAlign = 'top'), (x.offsetY = 5)),
            this._bLabelRenderer.setData(x),
            _.append(this._bLabelRenderer),
            this._points.length > 2)
          ) {
            const e = g(i, 'C')
            i.y < t.y
              ? ((e.vertAlign = 'bottom'), (e.offsetY = 5))
              : ((e.vertAlign = 'top'), (e.offsetY = 5)),
              this._cLabelRenderer.setData(e),
              _.append(this._cLabelRenderer)
          }
          if (this._points.length > 3) {
            const e = g(a, 'D')
            a.y < i.y
              ? ((e.vertAlign = 'bottom'), (e.offsetY = 5))
              : ((e.vertAlign = 'top'), (e.offsetY = 5)),
              this._dLabelRenderer.setData(e),
              _.append(this._dLabelRenderer)
          }
          this.addAnchors(_), (this._renderer = _)
        }
      }
    },
    97615: (e, t, i) => {
      var n = i(79191).LineSourcePaneView,
        r = i(19266).CompositeRenderer,
        s = i(10695).TriangleRenderer
      t.TrianglePaneView = class extends n {
        constructor(e, t) {
          super(e, t),
            (this._triangleRenderer = new s()),
            (this._renderer = null)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(), this._renderer
        }
        _updateImpl() {
          super._updateImpl(), (this._renderer = null)
          var e = {}
          ;(e.points = this._points),
            (e.color = this._source.properties().color.value()),
            (e.linewidth = this._source.properties().linewidth.value()),
            (e.backcolor = this._source.properties().backgroundColor.value()),
            (e.fillBackground = this._source
              .properties()
              .fillBackground.value()),
            (e.transparency = this._source.properties().transparency.value()),
            this._triangleRenderer.setData(e)
          var t = new r()
          t.append(this._triangleRenderer),
            this.addAnchors(t),
            (this._renderer = t)
        }
      }
    },
    77444: (e, t, i) => {
      i.r(t), i.d(t, { VertLinePaneView: () => u })
      var n = i(86441),
        r = i(19266),
        s = i(80657),
        o = i(66103),
        a = i(71254),
        l = i(46501),
        d = i(18807),
        h = i(33295)
      const c = [o.PaneCursorType.HorizontalResize]
      class u extends h.AlertableLineSourcePaneView {
        constructor(e, t, i) {
          super(e, t),
            (this._lineRenderer = new a.VerticalLineRenderer()),
            (this._labelRenderer = new s.TextRenderer()),
            (this._renderer = null),
            (this._pane = i)
        }
        renderer(e, t) {
          return this._invalidated && this._updateImpl(e, t), this._renderer
        }
        _validatePriceScale() {
          return !0
        }
        _updateImpl(e, t) {
          var i
          if (
            (super._updateImpl(),
            (this._renderer = null),
            0 === this._points.length)
          )
            return
          const o = this._source.properties().childs(),
            a = new r.CompositeRenderer()
          let h,
            u = !0
          if (1 === this._points.length) {
            const t = new n.Point(this._points[0].x, e / 2)
            this._addAlertRenderer(a, [t])
          }
          if (
            o.showLabel.value() &&
            o.text.value().length > 0 &&
            this._source.model().paneForSource(this._source) === this._pane
          ) {
            let r = 0,
              d = 5,
              c = 'center',
              p = 'middle'
            const _ = this._points[0].x
            let g = 0
            switch (o.vertLabelsAlign.value()) {
              case 'top':
                g = e
                break
              case 'middle':
                g = e / 2
                break
              case 'bottom':
                g = 0
            }
            if ('horizontal' === o.textOrientation.value()) {
              switch (o.horzLabelsAlign.value()) {
                case 'left':
                  c = 'right'
                  break
                case 'right':
                  c = 'left'
                  break
                case 'center':
                  c = 'center'
              }
              switch (o.vertLabelsAlign.value()) {
                case 'top':
                  p = 'bottom'
                  break
                case 'middle':
                  p = 'middle'
                  break
                case 'bottom':
                  p = 'top'
              }
            } else {
              switch (
                ((r = -Math.PI / 2), (d = 0), o.horzLabelsAlign.value())
              ) {
                case 'left':
                  p = 'bottom'
                  break
                case 'right':
                  p = 'top'
                  break
                case 'center':
                  p = 'middle'
              }
              switch (o.vertLabelsAlign.value()) {
                case 'top':
                  c = 'left'
                  break
                case 'middle':
                  c = 'center'
                  break
                case 'bottom':
                  c = 'right'
              }
            }
            const f = {
              points: [new n.Point(_, g)],
              text: o.text.value(),
              color: o.textcolor.value(),
              vertAlign: p,
              horzAlign: c,
              font: l.CHART_FONT_FAMILY,
              offsetX: d,
              offsetY: 0,
              bold: o.bold.value(),
              italic: o.italic.value(),
              fontsize: o.fontsize.value(),
              forceTextAlign: !0,
              angle: r,
            }
            this._labelRenderer.setData(f),
              a.append(this._labelRenderer),
              this._needLabelExclusionPath(this._labelRenderer) &&
                (h =
                  null !==
                    (i = (0, s.getTextBoundaries)(this._labelRenderer, t, e)) &&
                  void 0 !== i
                    ? i
                    : void 0),
              (u = this._labelRenderer.isOutOfScreen(t, e))
          }
          const p = {
              x: this._points[0].x,
              color: o.linecolor.value(),
              linewidth: o.linewidth.value(),
              linestyle: o.linestyle.value(),
              excludeBoundaries: h,
            },
            _ = p.linewidth / 2 + 1
          if (
            ((u = u && (p.x < -_ || p.x > t + _)),
            this._lineRenderer.setData(p),
            this._lineRenderer.setHitTest(
              new d.HitTestResult(d.HitTarget.MovePoint, {
                snappingIndex: this._source.points()[0].index,
              }),
            ),
            a.append(this._lineRenderer),
            !u)
          ) {
            if (1 === this._points.length) {
              const t = new n.Point(this._points[0].x, e / 2)
              ;(t.data = 0),
                (t.square = !0),
                (t.snappingIndex = this._source.points()[0].index),
                a.append(
                  this.createLineAnchor(
                    { points: [t], pointsCursorType: c },
                    0,
                  ),
                )
            }
            this._renderer = a
          }
        }
        _needLabelExclusionPath(e) {
          const t = this._source.properties().childs(),
            i = 'horizontal' === t.textOrientation.value(),
            n = t.text.value()
          if (i) return '' !== n.trim()
          if ('center' !== t.horzLabelsAlign.value()) return !1
          const r = e.getLinesInfo().lines
          if (('' === r[r.length - 1] && r.pop(), r.length % 2 == 0)) return !1
          if ('' === r[Math.floor(r.length / 2)].trim()) return !1
          return !0
        }
      }
    },
    21477: (e, t, i) => {
      i.d(t, { PaneRendererCachedImage: () => o })
      var n = i(86441),
        r = i(34026),
        s = i(18807)
      class o {
        constructor(e, t) {
          ;(this._cacheRect = null),
            (this._targetRect = null),
            (this._cacheProvider = e),
            (this._index = t)
        }
        draw(e, t) {
          const i = this._cacheProvider.getCacheRects(t, this._index)
          if (null === i)
            return (this._cacheRect = null), void (this._targetRect = null)
          if (
            ((this._cacheRect = i.cacheRect),
            (this._targetRect = i.targetRect),
            0 === this._cacheRect.width ||
              0 === this._cacheRect.height ||
              0 === this._targetRect.width ||
              0 === this._targetRect.height)
          )
            return
          e.save(), e.setTransform(1, 0, 0, 1, 0, 0)
          const n = t.pixelRatio,
            r = this._cacheProvider.getCacheCanvas(t)
          e.drawImage(
            r,
            Math.round(this._cacheRect.left * n),
            Math.round(this._cacheRect.top * n),
            this._cacheRect.width * n,
            this._cacheRect.height * n,
            Math.round(this._targetRect.left * n),
            Math.round(this._targetRect.top * n),
            this._targetRect.width * n,
            this._targetRect.height * n,
          ),
            e.restore()
        }
        hitTest(e) {
          if (null === this._targetRect) return null
          const t = new n.Point(this._targetRect.left, this._targetRect.top),
            i = t.add(
              new n.Point(this._targetRect.width, this._targetRect.height),
            )
          return (0, r.pointInBox)(e, (0, n.box)(t, i))
            ? new s.HitTestResult(s.HitTarget.Regular)
            : null
        }
      }
    },
    81139: (e, t, i) => {
      i.d(t, { ArcWedgeRenderer: () => o })
      var n = i(18807),
        r = i(87095),
        s = i(15187)
      class o extends s.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments),
            (this._data = null),
            (this._hitTest = new n.HitTestResult(n.HitTarget.MovePoint)),
            (this._backHitTest = new n.HitTestResult(
              n.HitTarget.MovePointBackground,
            ))
        }
        setData(e) {
          this._data = e
        }
        setHitTest(e) {
          this._hitTest = e
        }
        hitTest(e) {
          if (null === this._data) return null
          const t = e.subtract(this._data.center),
            i = t.length()
          if (Math.abs(i - this._data.radius) <= 4) {
            const t = e.subtract(this._data.p1).length(),
              i = e.subtract(this._data.p2).length()
            if (
              Math.max(t, i) <= this._data.p1.subtract(this._data.p2).length()
            )
              return this._hitTest
          }
          if (this._data.fillBackground && i <= this._data.radius) {
            const e = this._data.p1.subtract(this._data.center).normalized(),
              i = this._data.p2.subtract(this._data.center).normalized(),
              n = t.normalized(),
              r = e.dotProduct(i),
              s = n.dotProduct(e),
              o = n.dotProduct(i)
            if (s >= r && o >= r) return this._backHitTest
          }
          return null
        }
        _drawImpl(e) {
          if (null === this._data) return
          const t = e.context
          if (
            ((t.strokeStyle = this._data.color),
            (t.lineWidth = this._data.linewidth),
            t.beginPath(),
            t.arc(
              this._data.center.x,
              this._data.center.y,
              this._data.radius,
              this._data.angle1,
              this._data.angle2,
            ),
            t.stroke(),
            this._data.fillBackground)
          ) {
            if (
              (t.arc(
                this._data.center.x,
                this._data.center.y,
                this._data.prevRadius,
                this._data.angle2,
                this._data.angle1,
                !0,
              ),
              this._data.gradient)
            ) {
              const e = t.createRadialGradient(
                this._data.center.x,
                this._data.center.y,
                this._data.prevRadius,
                this._data.center.x,
                this._data.center.y,
                this._data.radius,
              )
              e.addColorStop(
                0,
                (0, r.generateColor)(
                  this._data.color1,
                  this._data.transparency,
                ),
              ),
                e.addColorStop(
                  1,
                  (0, r.generateColor)(
                    this._data.color2,
                    this._data.transparency,
                  ),
                ),
                (t.fillStyle = e)
            } else
              t.fillStyle = (0, r.generateColor)(
                this._data.color,
                this._data.transparency,
                !0,
              )
            t.fill()
          }
        }
      }
    },
    2436: (e, t, i) => {
      i.d(t, {
        cubicBezierHitTest: () => a,
        extendQuadroBezier: () => l,
        quadroBezierHitTest: () => s,
      })
      var n = i(4652),
        r = i(37160)
      function s(e, t, i, r, s) {
        const o = i.subtract(e).length() + i.subtract(t).length(),
          a = Math.max(3 / o, 0.02)
        let l
        for (let o = 0; ; o += a) {
          o > 1 && (o = 1)
          const a = e.scaled((1 - o) * (1 - o)),
            d = i.scaled(2 * o * (1 - o)),
            h = t.scaled(o * o),
            c = a.add(d).add(h)
          if (void 0 !== l) {
            if ((0, n.distanceToSegment)(c, l, r).distance < s) return !0
          } else if (c.subtract(r).length() < s) return !0
          if (((l = c), 1 === o)) break
        }
        return !1
      }
      function o(e, t, i, n, s) {
        s = (0, r.clamp)(s, 0, 1)
        const o = e.scaled((1 - s) * (1 - s) * (1 - s)),
          a = t.scaled(3 * (1 - s) * (1 - s) * s),
          l = i.scaled(3 * (1 - s) * s * s),
          d = n.scaled(s * s * s)
        return o.add(a).add(l).add(d)
      }
      function a(e, t, i, r, s, a) {
        const l =
            t.subtract(e).length() +
            i.subtract(t).length() +
            r.subtract(i).length(),
          d = Math.max(3 / l, 0.02)
        let h
        for (let l = 0; ; l += d) {
          const d = o(e, t, i, r, l)
          if (void 0 !== h) {
            if ((0, n.distanceToSegment)(d, h, s).distance < a) return !0
          } else if (d.subtract(s).length() < a) return !0
          if (((h = d), l >= 1)) break
        }
        return !1
      }
      function l(e, t, i, n, r) {
        const s = i.subtract(e).length() + i.subtract(t).length()
        if (!s) return []
        const o = ((e, t, i, n, r) => {
          const s = [],
            o = d(e.y, t.y, i.y, 0).concat(d(e.y, t.y, i.y, r))
          for (let r = 0; r < o.length; r++) {
            const a = h(e.x, t.x, i.x, o[r])
            a >= 0 && a <= n && s.push(o[r])
          }
          const a = d(e.x, t.x, i.x, 0).concat(d(e.x, t.x, i.x, n))
          for (let n = 0; n < a.length; n++) {
            const o = h(e.y, t.y, i.y, a[n])
            o >= 0 && o <= r && s.push(a[n])
          }
          return s
        })(e, t, i, n, r)
          .filter((e) => e > 1)
          .sort((e, t) => e - t)
        t.x >= 0 && t.x <= n && t.y >= 0 && t.y <= r && o.unshift(1)
        const a = 3 / s,
          l = []
        for (let n = 0; n < o.length - 1; n += 2) {
          let r = a,
            s = o[n],
            d = o[n + 1] + r
          const h = []
          while (s <= d) {
            const n = e.scaled((1 - s) * (1 - s)),
              o = i.scaled(2 * s * (1 - s)),
              a = t.scaled(s * s),
              l = n.add(o).add(a)
            if (h.length > 0) {
              h[h.length - 1].subtract(l).length() < 2 && ((d += r), (r *= 2))
            }
            h.push(l), (s += r)
          }
          h.length > 0 && l.push(h)
        }
        return l
      }
      function d(e, t, i, n) {
        const r = [],
          s = e - 2 * i + t,
          o = 2 * i - 2 * e,
          a = e - n
        if (Math.abs(s) > 1e-8) {
          const e = o * o - 4 * s * a
          e >= 0 &&
            (r.push((-o + Math.sqrt(e)) / (2 * s)),
            r.push((-o - Math.sqrt(e)) / (2 * s)))
        } else r.push(-a / o)
        return r
      }
      function h(e, t, i, n) {
        return (1 - n) * (1 - n) * e + 2 * (1 - n) * n * i + n * n * t
      }
    },
    14146: (e, t, i) => {
      i.d(t, { ChannelRenderer: () => u })
      var n = i(27714),
        r = i(50151),
        s = i(86441),
        o = i(34026),
        a = i(4652),
        l = i(18807),
        d = i(68441),
        h = i(87095),
        c = i(15187)
      class u extends c.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e, t) {
          if (null === this._data || !this._data.hittestOnBackground)
            return null
          const i = this._visiblePolygon(
            (0, n.size)({ width: t.cssWidth, height: t.cssHeight }),
          )
          return null !== i && (0, o.pointInPolygon)(e, i)
            ? new l.HitTestResult(l.HitTarget.MovePointBackground)
            : null
        }
        _drawImpl(e) {
          if (null === this._data) return
          const t = e.context,
            i = this._visiblePolygon(e.mediaSize)
          if (null !== i) {
            t.beginPath(), t.moveTo(i[0].x, i[0].y)
            for (let e = 1; e < i.length; e++) t.lineTo(i[e].x, i[e].y)
            ;(t.fillStyle = (0, h.generateColor)(
              this._data.color,
              this._data.transparency,
              !0,
            )),
              t.fill()
          }
        }
        _visiblePolygon(e) {
          const t = (0, r.ensureNotNull)(this._data),
            i = t.p1,
            n = t.p2,
            o = t.p3,
            l = t.p4
          if (
            (0, s.equalPoints)(i, n) ||
            (0, s.equalPoints)(o, l) ||
            ((0, a.distanceToLine)(i, n, o).distance < 1e-6 &&
              (0, a.distanceToLine)(i, n, l).distance < 1e-6)
          )
            return null
          if (e.width <= 0 || e.height <= 0) return null
          let h = [
            new s.Point(0, 0),
            new s.Point(e.width, 0),
            new s.Point(e.width, e.height),
            new s.Point(0, e.height),
          ]
          return (
            (h = (0, d.clipPolygonByEdge)(h, i, n, [l, o])),
            (h = (0, d.clipPolygonByEdge)(h, l, o, [i, n])),
            (0, s.equalPoints)(o, i) ||
              t.extendLeft ||
              (h = (0, d.clipPolygonByEdge)(h, o, i, [n, l])),
            h
          )
        }
      }
    },
    23966: (e, t, i) => {
      i.d(t, { DisjointChannelRenderer: () => g })
      var n = i(27714),
        r = i(50151),
        s = i(86441),
        o = i(34026),
        a = i(4652),
        l = i(5531),
        d = i(79849),
        h = i(18807),
        c = i(64308),
        u = i(68441),
        p = i(87095),
        _ = i(15187)
      class g {
        constructor() {
          ;(this._parallelChannelRenderer = new c.ParallelChannelRenderer()),
            (this._disjointChannelIntersectionRenderer = new f()),
            (this._selectedRenderer = this._disjointChannelIntersectionRenderer)
        }
        setData(e) {
          if (e.points.length < 4) return
          const [t, i, n, r] = e.points
          if (
            (0, s.equalPoints)(t, i) ||
            (0, s.equalPoints)(n, r) ||
            ((0, a.distanceToLine)(t, i, n).distance < 1e-6 &&
              (0, a.distanceToLine)(t, i, r).distance < 1e-6)
          )
            this._selectedRenderer = null
          else {
            null !==
            (0, l.intersectLines)(
              (0, s.lineThroughPoints)(t, i),
              (0, s.lineThroughPoints)(n, r),
            )
              ? (this._disjointChannelIntersectionRenderer.setData(e),
                (this._selectedRenderer =
                  this._disjointChannelIntersectionRenderer))
              : (this._parallelChannelRenderer.setData({
                  line1: {
                    color: 'rgba(0,0,0,0)',
                    lineStyle: d.LINESTYLE_SOLID,
                    lineWidth: 0,
                    points: [t, i],
                  },
                  line2: {
                    color: 'rgba(0,0,0,0)',
                    lineStyle: d.LINESTYLE_SOLID,
                    lineWidth: 0,
                    points: [r, n],
                  },
                  extendLeft: e.extendleft,
                  extendRight: e.extendright,
                  skipLines: !0,
                  fillBackground: !0,
                  backColor: (0, p.generateColor)(e.backcolor, e.transparency),
                  hittestOnBackground: e.hittestOnBackground,
                }),
                (this._selectedRenderer = this._parallelChannelRenderer))
          }
        }
        hitTest(e, t) {
          return null !== this._selectedRenderer
            ? this._selectedRenderer.hitTest(e, t)
            : null
        }
        draw(e, t) {
          null !== this._selectedRenderer && this._selectedRenderer.draw(e, t)
        }
      }
      class f extends _.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e, t) {
          if (null === this._data || !this._data.hittestOnBackground)
            return null
          for (const i of this._visiblePolygons(
            (0, n.size)({ width: t.cssWidth, height: t.cssHeight }),
          ))
            if ((0, o.pointInPolygon)(e, i))
              return new h.HitTestResult(h.HitTarget.MovePointBackground)
          return null
        }
        _drawImpl(e) {
          if (null === this._data || this._data.points.length < 4) return
          const t = e.context
          t.fillStyle = (0, p.generateColor)(
            this._data.backcolor,
            this._data.transparency,
          )
          for (const i of this._visiblePolygons(e.mediaSize)) {
            t.beginPath(), t.moveTo(i[0].x, i[0].y)
            for (let e = 1; e < i.length; e++) t.lineTo(i[e].x, i[e].y)
            t.fill()
          }
        }
        _visiblePolygons(e) {
          const t = (0, r.ensureNotNull)(this._data),
            [i, n, o, a] = t.points
          if (e.width <= 0 || e.height <= 0) return []
          const d = (0, l.intersectLines)(
            (0, s.lineThroughPoints)(i, n),
            (0, s.lineThroughPoints)(o, a),
          )
          if (null === d) return []
          const h = [
              new s.Point(0, 0),
              new s.Point(e.width, 0),
              new s.Point(e.width, e.height),
              new s.Point(0, e.height),
            ],
            c = []
          {
            let e = h
            const r = i.subtract(n).add(d),
              s = a.subtract(o).add(d)
            ;(e = (0, u.clipPolygonByEdge)(e, d, r, [s, s])),
              (e = x(e, t)),
              (e = (0, u.clipPolygonByEdge)(e, s, d, [r, r])),
              null !== e && c.push(e)
          }
          {
            let e = h
            const r = n.subtract(i).add(d),
              s = o.subtract(a).add(d)
            ;(e = (0, u.clipPolygonByEdge)(e, d, r, [s, s])),
              (e = x(e, t)),
              (e = (0, u.clipPolygonByEdge)(e, s, d, [r, r])),
              null !== e && c.push(e)
          }
          return c
        }
      }
      function v(e, t, i) {
        return null !== e
          ? (0, l.intersectPolygonAndHalfplane)(
              e,
              (0, s.halfplaneThroughPoint)(
                ((n = t), (0, s.line)(1, 0, -n)),
                new s.Point(i, 0),
              ),
            )
          : null
        var n
      }
      function x(e, t) {
        const [i, n] = t.points
        return (
          t.extendleft || (e = v(e, i.x, n.x)),
          t.extendright || (e = v(e, n.x, i.x)),
          e
        )
      }
    },
    70531: (e, t, i) => {
      i.d(t, {
        EllipseRendererSimple: () => d,
      })
      var n = i(18807),
        r = i(37160),
        s = i(86441),
        o = i(87095),
        a = i(15187),
        l = i(68441)
      class d extends a.MediaCoordinatesPaneRenderer {
        constructor(e, t, i) {
          super(),
            (this._data = e),
            (this._hitTest = t || new n.HitTestResult(n.HitTarget.MovePoint)),
            (this._backgroundHitTest =
              i || new n.HitTestResult(n.HitTarget.MovePointBackground))
        }
        hitTest(e) {
          if (this._data.points.length < 2) return null
          const t = this._data.points[0],
            i = this._data.points[1],
            n = 0.5 * Math.abs(t.x - i.x),
            o = Math.abs(t.x - i.x),
            a = Math.abs(t.y - i.y),
            l = t.add(i).scaled(0.5)
          let d = e.subtract(l)
          if (o < 1 || a < 1) return null
          const h = (i.y - t.y) / (i.x - t.x)
          d = new s.Point(d.x, d.y / h)
          let c = d.x * d.x + d.y * d.y - n * n
          return (
            (c = (0, r.sign)(c) * Math.sqrt(Math.abs(c / n))),
            Math.abs(c) < 3
              ? this._hitTest
              : this._data.fillBackground &&
                  !this._data.noHitTestOnBackground &&
                  c < 3
                ? this._backgroundHitTest
                : null
          )
        }
        _drawImpl(e) {
          const t = e.context
          ;(t.lineCap = 'butt'),
            (t.strokeStyle = this._data.color),
            (t.lineWidth = this._data.linewidth),
            void 0 !== this._data.linestyle &&
              (0, l.setLineStyle)(t, this._data.linestyle)
          const i = this._data.points[0],
            n = this._data.points[1],
            r = Math.abs(i.x - n.x),
            s = Math.abs(i.y - n.y),
            a = i.add(n).scaled(0.5)
          if (r < 1 || s < 1) return
          let d = 0
          if (this._data.wholePoints) {
            const e = this._data.wholePoints[0],
              t = this._data.wholePoints[1]
            d = Math.abs(e.x - t.x)
          }
          t.save(),
            t.translate(a.x, a.y),
            t.scale(1, s / r),
            t.beginPath(),
            t.arc(0, 0, r / 2, 0, 2 * Math.PI, !1),
            t.restore(),
            t.stroke(),
            this._data.fillBackground &&
              (this._data.wholePoints &&
                (t.translate(a.x, a.y),
                t.scale(1, s / r),
                t.arc(0, 0, d / 2, 0, 2 * Math.PI, !0)),
              (t.fillStyle = (0, o.generateColor)(
                this._data.backcolor,
                this._data.transparency,
                !0,
              )),
              t.fill())
        }
      }
    },
    18690: (e, t, i) => {
      i.d(t, { intersectLineWithViewport: () => o })
      var n = i(86441)
      function r(e, t, i) {
        return e >= t && e <= i ? e : null
      }
      function s(e, t, i, n) {
        return (
          Math.sign(e.x - t.x) === Math.sign(i.x - n.x) &&
          Math.sign(e.y - t.y) === Math.sign(i.y - n.y)
        )
      }
      function o(e, t, i, o, a, l, d) {
        const h = e.x >= 0 && e.x <= a && e.y >= 0 && e.y <= l,
          c = t.x >= 0 && t.x <= a && t.y >= 0 && t.y <= l
        if (h && c && !i && !o) return [e, t]
        if (
          (e.x < 0 && t.x < 0 && (e.x < t.x ? !o : !i)) ||
          (e.x > a && t.x > a && (e.x < t.x ? !i : !o)) ||
          (e.y < 0 && t.y < 0 && (e.y < t.y ? !o : !i)) ||
          (e.y > l && t.y > l && (e.y < t.y ? !i : !o))
        )
          return null
        const u = []
        if (e.x === t.x) {
          if (e.x < 0 || e.x > a) return null
          e.y < t.y
            ? u.push(
                new n.Point(
                  e.x,
                  0 === d ? 0 : e.y < 0 ? e.y % d : -(d - (e.y % d)),
                ),
                new n.Point(t.x, l),
              )
            : u.push(
                new n.Point(
                  e.x,
                  0 === d
                    ? l
                    : e.y > l
                      ? l + ((e.y - l) % d)
                      : l + (d - ((l - e.y) % d)),
                ),
                new n.Point(t.x, 0),
              )
        } else if (e.y === t.y) {
          if (e.y < 0 || e.y > l) return null
          e.x < t.x
            ? u.push(
                new n.Point(
                  0 === d ? 0 : e.x < 0 ? e.x % d : -(d - (e.x % d)),
                  e.y,
                ),
                new n.Point(a, t.y),
              )
            : u.push(
                new n.Point(
                  0 === d
                    ? a
                    : e.x > a
                      ? a + ((e.x - a) % d)
                      : a + (d - ((a - e.x) % d)),
                  e.y,
                ),
                new n.Point(0, t.y),
              )
        } else {
          const s = (t.y - e.y) / (t.x - e.x),
            o = e.y - s * e.x
          let h = 0,
            c = 0
          const p = r(o, 0, l)
          if (null !== p)
            if (d > 0 && (e.x <= 0 || (i && e.x < t.x))) {
              const t =
                e.x <= 0
                  ? Math.sqrt(Math.pow(0 - e.x, 2) + Math.pow(p - e.y, 2)) % d
                  : d -
                    (Math.sqrt(Math.pow(0 - e.x, 2) + Math.pow(p - e.y, 2)) % d)
              ;(h = Math.cos(Math.atan(s)) * t),
                (c = s * h),
                u.push(new n.Point(-h, p - c))
            } else u.push(new n.Point(0, p))
          const _ = r(s * a + o, 0, l)
          if (null !== _)
            if (d > 0 && (e.x >= a || (i && e.x > t.x))) {
              const t =
                e.x >= a
                  ? Math.sqrt(Math.pow(e.x - a, 2) + Math.pow(e.y - _, 2)) % d
                  : d -
                    (Math.sqrt(Math.pow(e.x - a, 2) + Math.pow(e.y - _, 2)) % d)
              ;(h = Math.cos(Math.atan(s)) * t),
                (c = s * h),
                u.push(new n.Point(a + h, _ + c))
            } else u.push(new n.Point(a, _))
          const g = r(-o / s, 0, a)
          if (null !== g && (0 !== g || 0 !== p))
            if (d > 0 && (e.y <= 0 || (i && e.y < t.y))) {
              const t =
                e.y <= 0
                  ? Math.sqrt(Math.pow(e.x - g, 2) + Math.pow(e.y - 0, 2)) % d
                  : d -
                    (Math.sqrt(Math.pow(e.x - g, 2) + Math.pow(e.y - 0, 2)) % d)
              ;(h = Math.cos(Math.atan(s)) * t),
                (c = s * h),
                u.push(new n.Point(g - Math.sign(s) * h, -Math.sign(s) * c))
            } else u.push(new n.Point(g, 0))
          const f = r((l - o) / s, 0, a)
          if (null !== f && (0 !== f || _ !== l))
            if (d > 0 && (e.y >= l || (i && e.y > t.y))) {
              const t =
                e.y >= l
                  ? Math.sqrt(Math.pow(e.x - f, 2) + Math.pow(e.y - l, 2)) % d
                  : d -
                    (Math.sqrt(Math.pow(e.x - f, 2) + Math.pow(e.y - l, 2)) % d)
              ;(h = Math.cos(Math.atan(s)) * t),
                (c = s * h),
                u.push(new n.Point(f + Math.sign(s) * h, l + Math.sign(s) * c))
            } else u.push(new n.Point(f, l))
        }
        if (u.length < 1) return null
        if ((u.length < 2 && u.push(u[0]), !i && h)) {
          return [e, s(u[0], u[1], e, t) ? u[1] : u[0]]
        }
        if (!o && c) {
          return [s(u[0], u[1], e, t) ? u[0] : u[1], t]
        }
        return s(u[0], u[1], e, t) ? [u[0], u[1]] : [u[1], u[0]]
      }
    },
    57352: (e, t, i) => {
      function n(e, t) {
        return e.pixelRatio === t.pixelRatio
      }
      i.d(t, { areEqualPaneRenderParams: () => n })
    },
    79059: (e, t, i) => {
      i.d(t, { LineAnchorRenderer: () => x })
      var n = i(86441),
        r = i(34026),
        s = i(50151),
        o = i(68441),
        a = i(1722),
        l = i(18807),
        d = i(66103),
        h = i(45197),
        c = i(59590)
      class u extends n.Point {
        constructor(e, t, i, n) {
          super(e, t), (this.data = i), (this.square = n)
        }
      }
      function p(e, t, i, n) {
        const r = i + n / 2
        ;(0, o.drawRoundRect)(e, t.x - r, t.y - r, 2 * r, 2 * r, (i + n) / 2),
          e.closePath(),
          (e.lineWidth = n)
      }
      function _(e, t, i, n) {
        ;(e.globalAlpha = 0.2), p(e, t, i, n), e.stroke(), (e.globalAlpha = 1)
      }
      function g(e, t, i, n) {
        p(e, t, i - n, n), e.fill(), e.stroke()
      }
      function f(e, t, i, n) {
        ;(e.globalAlpha = 0.2),
          e.beginPath(),
          e.arc(t.x, t.y, i + n / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = n),
          e.stroke(),
          (e.globalAlpha = 1)
      }
      function v(e, t, i, n) {
        e.beginPath(),
          e.arc(t.x, t.y, i - n / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = n),
          e.fill(),
          e.stroke()
      }
      class x extends c.BitmapCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = null != e ? e : null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          var t
          if (null === this._data || this._data.disableInteractions) return null
          const {
              radius: i,
              points: n,
              pointsCursorType: r,
              hittestResult: s,
            } = this._data,
            o = (0, h.interactionTolerance)().anchor
          for (let a = 0; a < n.length; ++a) {
            const h = n[a]
            if (h.subtract(e).length() <= i + o)
              return new l.HitTestResult(Array.isArray(s) ? s[a] : s, {
                pointIndex: h.data,
                cursorType:
                  null !== (t = null == r ? void 0 : r[a]) && void 0 !== t
                    ? t
                    : d.PaneCursorType.Default,
                activeItem: h.activeItem,
                snappingPrice: h.snappingPrice,
                snappingIndex: h.snappingIndex,
                nonDiscreteIndex: h.nonDiscreteIndex,
              })
          }
          return null
        }
        doesIntersectWithBox(e) {
          return (
            null !== this._data &&
            this._data.points.some((t) => (0, r.pointInBox)(t, e))
          )
        }
        _drawImpl(e) {
          if (null === this._data || !this._data.visible) return
          const t = [],
            i = [],
            n = [],
            r = []
          for (let e = 0; e < this._data.points.length; ++e) {
            const s = this._data.points[e],
              o = this._data.backgroundColors[e]
            s.square ? (t.push(s), i.push(o)) : (n.push(s), r.push(o))
          }
          t.length && this._drawPoints(e, t, i, g, _),
            n.length && this._drawPoints(e, n, r, v, f)
        }
        _drawPoints(e, t, i, n, r) {
          const {
              context: o,
              horizontalPixelRatio: l,
              verticalPixelRatio: d,
            } = e,
            c = (0, s.ensureNotNull)(this._data),
            p = c.currentPoint,
            _ = c.radius
          let g = Math.max(1, Math.floor((c.strokeWidth || 2) * l))
          c.selected && (g += Math.max(1, Math.floor(l / 2)))
          const f = Math.max(1, Math.floor(l))
          let v = Math.round(_ * l * 2)
          v % 2 != f % 2 && (v += 1)
          const x = (f % 2) / 2,
            m = (0, h.interactionTolerance)().anchor
          o.strokeStyle = c.color
          for (let e = 0; e < t.length; ++e) {
            const s = t[e]
            o.fillStyle = i[e]
            if (
              !((0, a.isInteger)(s.data) && c.linePointBeingEdited === s.data)
            ) {
              if (
                (n(
                  o,
                  new u(
                    Math.round(s.x * l) + x,
                    Math.round(s.y * d) + x,
                    s.data,
                    s.square,
                  ),
                  v / 2,
                  g,
                ),
                !c.disableInteractions)
              ) {
                if (s.subtract(p).length() <= _ + m) {
                  const e = Math.max(1, Math.floor(c.selectedStrokeWidth * l))
                  let t = Math.round(_ * l * 2)
                  t % 2 != f % 2 && (t += 1)
                  r(
                    o,
                    new u(
                      Math.round(s.x * l) + x,
                      Math.round(s.y * d) + x,
                      s.data,
                      s.square,
                    ),
                    t / 2,
                    e,
                  )
                }
              }
            }
          }
        }
      }
    },
    64308: (e, t, i) => {
      i.d(t, { ParallelChannelRenderer: () => f })
      const n = (e, t) => {
        for (var i, n = -1, r = e.length; ++n < r; ) {
          var s = t(e[n])
          void 0 !== s && (i = void 0 === i ? s : i + s)
        }
        return i
      }
      var r = i(99097)
      const s = (e) => (e && e.length ? n(e, r.default) : 0)
      var o = i(27714),
        a = i(34026),
        l = i(86441),
        d = i(4652),
        h = i(5531),
        c = i(18807),
        u = i(45197),
        p = i(15187),
        _ = i(68441),
        g = i(18690)
      class f extends p.MediaCoordinatesPaneRenderer {
        constructor(e, t) {
          super(),
            (this._data = null),
            (this._backgroundPolygon = null),
            (this._clippedLines = new Map()),
            (this._hittestResult =
              e || new c.HitTestResult(c.HitTarget.MovePoint)),
            (this._backHittestResult =
              t || new c.HitTestResult(c.HitTarget.MovePointBackground))
        }
        setData(e) {
          ;(this._data = e),
            (this._backgroundPolygon = null),
            this._clippedLines.clear()
        }
        hitTest(e, t) {
          if (null === this._data) return null
          const { line1: i, line2: n, middleLine: r } = this._data,
            s = (0, o.size)({ width: t.cssWidth, height: t.cssHeight }),
            l = (0, u.interactionTolerance)().line
          for (const t of [i, n, r]) {
            if (!t) continue
            const i = this._getClippedLine(t, this._data, s)
            if (i) {
              if (
                (0, d.distanceToSegment)(i.points[0], i.points[1], e)
                  .distance <= l
              )
                return this._hittestResult
            }
          }
          if (this._data.hittestOnBackground && this._data.fillBackground) {
            const t = this._getBackgroundPolygon(this._data, s)
            if (t.length > 0 && (0, a.pointInPolygon)(e, t))
              return this._backHittestResult
          }
          return null
        }
        _drawImpl(e) {
          if (null === this._data) return
          const {
              line1: t,
              line2: i,
              middleLine: n,
              skipLines: r,
              skipTopLine: s,
              fillBackground: o,
              backColor: a,
            } = this._data,
            l = e.context
          if (
            ((l.lineCap = 'round'),
            r || this._drawLine(l, t, this._data, e.mediaSize),
            r || s || !i || this._drawLine(l, i, this._data, e.mediaSize),
            o && i)
          ) {
            const t = this._getBackgroundPolygon(this._data, e.mediaSize)
            if (t.length > 0) {
              l.beginPath(), l.moveTo(t[0].x, t[0].y)
              for (let e = 1; e < t.length; e++) l.lineTo(t[e].x, t[e].y)
              ;(l.fillStyle = a), l.fill()
            }
          }
          n &&
            !this._data.skipLines &&
            this._drawLine(l, n, this._data, e.mediaSize)
        }
        _drawLine(e, t, i, n) {
          const r = this._getClippedLine(t, i, n)
          if (!r) return
          ;(e.strokeStyle = r.color),
            (e.lineWidth = r.lineWidth),
            (0, _.setLineStyle)(e, r.lineStyle),
            (e.strokeStyle = r.color)
          const [s, o] = r.points
          ;(0, _.drawPixelPerfectLine)(e, s.x, s.y, o.x, o.y)
        }
        _getClippedLine(e, t, i) {
          let n = this._clippedLines.get(e)
          if (void 0 === n) {
            const { lineWidth: r, lineStyle: o, points: a } = e,
              { extendLeft: l, extendRight: d } = t,
              h = (0, g.intersectLineWithViewport)(
                a[0],
                a[1],
                l,
                d,
                i.width,
                i.height,
                s((0, _.computeDashPattern)(r, o)),
              )
            ;(n = null == h ? null : { ...e, points: h }),
              this._clippedLines.set(e, n)
          }
          return n
        }
        _getBackgroundPolygon(e, t) {
          var i
          return (
            this._backgroundPolygon ||
              (this._backgroundPolygon =
                null !== (i = this._getBackgroundPolygonImpl(e, t)) &&
                void 0 !== i
                  ? i
                  : []),
            this._backgroundPolygon
          )
        }
        _getBackgroundPolygonImpl(e, t) {
          if (void 0 === e.line2) return null
          const [i, n] = e.line1.points,
            [r, s] = e.line2.points
          if (
            (0, l.equalPoints)(i, n) ||
            (0, l.equalPoints)(r, s) ||
            (0, d.distanceToLine)(i, n, r).distance < 1e-6 ||
            (0, d.distanceToLine)(i, n, s).distance < 1e-6
          )
            return null
          if (t.width <= 0 || t.height <= 0) return null
          let o = [
            new l.Point(0, 0),
            new l.Point(t.width, 0),
            new l.Point(t.width, t.height),
            new l.Point(0, t.height),
          ]
          return (
            (o = v(o, i, n, s)),
            e.extendRight || (o = v(o, n, s, r)),
            (o = v(o, s, r, i)),
            e.extendLeft || (o = v(o, r, i, n)),
            o
          )
        }
      }
      function v(e, t, i, n) {
        return null !== e
          ? (0, h.intersectPolygonAndHalfplane)(
              e,
              (0, l.halfplaneThroughPoint)((0, l.lineThroughPoints)(t, i), n),
            )
          : null
      }
    },
    79797: (e, t, i) => {
      i.d(t, { PolygonRenderer: () => p })
      var n = i(34026),
        r = i(4652),
        s = i(99031),
        o = i(73436),
        a = i(18807),
        l = i(87095),
        d = i(15187),
        h = i(45197),
        c = i(68441),
        u = i(79849)
      class p extends d.MediaCoordinatesPaneRenderer {
        constructor(e) {
          super(),
            (this._data = null),
            (this._backHittest = new a.HitTestResult(
              a.HitTarget.MovePointBackground,
            )),
            (this._points = []),
            (this._hittest =
              null != e ? e : new a.HitTestResult(a.HitTarget.MovePoint))
        }
        setData(e) {
          ;(this._data = e), (this._points = e.points)
        }
        hitTest(e) {
          if (
            null === this._data ||
            (void 0 !== this._data.mouseTouchable && !this._data.mouseTouchable)
          )
            return null
          const t = Math.max(
              (0, h.interactionTolerance)().line,
              Math.ceil(this._data.linewidth / 2),
            ),
            i = this._points.length
          if (1 === i) {
            return (0, n.pointInCircle)(e, this._points[0], t)
              ? this._hittest
              : null
          }
          for (let n = 1; n < i; n++) {
            const i = this._points[n - 1],
              s = this._points[n]
            if ((0, r.distanceToSegment)(i, s, e).distance <= t)
              return this._hittest
          }
          if (this._data.filled && this._data.fillBackground && i > 0) {
            const n = this._points[0],
              s = this._points[i - 1]
            if ((0, r.distanceToSegment)(n, s, e).distance <= t)
              return this._hittest
          }
          return this._data.filled &&
            this._data.fillBackground &&
            (0, n.pointInPolygon)(e, this._data.points)
            ? this._backHittest
            : null
        }
        _drawImpl(e) {
          var t, i
          const n = e.context,
            r = this._points.length
          if (null === this._data || 0 === r) return
          if (1 === r)
            return void this._drawPoint(
              n,
              this._points[0],
              this._data.linewidth / 2,
              this._data.color,
            )
          n.beginPath()
          const a =
              this._data.linestyle === u.LINESTYLE_SOLID ? 'round' : 'butt',
            d = null !== (t = this._data.linecap) && void 0 !== t ? t : a
          ;(n.lineCap = d),
            (n.strokeStyle = this._data.color),
            (n.lineWidth = this._data.linewidth),
            (n.lineJoin =
              null !== (i = this._data.linejoin) && void 0 !== i ? i : 'round'),
            (0, c.setLineStyle)(n, this._data.linestyle)
          const h = this._points[0]
          n.moveTo(h.x, h.y)
          for (const e of this._points) n.lineTo(e.x, e.y)
          if (
            (this._data.filled &&
              this._data.fillBackground &&
              ((n.fillStyle = (0, l.generateColor)(
                this._data.backcolor,
                this._data.transparency,
              )),
              n.fill()),
            this._data.filled && !this._data.skipClosePath && n.closePath(),
            r > 1)
          ) {
            if (this._data.leftend === o.LineEnd.Arrow) {
              const e = this._correctArrowPoints(
                this._points[1],
                this._points[0],
                n.lineWidth,
                d,
              )
              ;(0, s.drawArrow)(e[0], e[1], n, n.lineWidth, 1)
            }
            if (this._data.rightend === o.LineEnd.Arrow) {
              const e = this._correctArrowPoints(
                this._points[r - 2],
                this._points[r - 1],
                n.lineWidth,
                d,
              )
              ;(0, s.drawArrow)(e[0], e[1], n, n.lineWidth, 1)
            }
          }
          this._data.linewidth > 0 && n.stroke()
        }
        _drawPoint(e, t, i, n) {
          0 !== i &&
            (e.beginPath(),
            (e.fillStyle = n),
            e.arc(t.x, t.y, i, 0, 2 * Math.PI, !0),
            e.fill(),
            e.closePath())
        }
        _correctArrowPoints(e, t, i, n) {
          const r = t.subtract(e),
            s = r.length()
          if ('butt' === n || s < 1) return [e, t]
          const o = s + i / 2
          return [e, r.scaled(o / s).add(e)]
        }
      }
    },
    10695: (e, t, i) => {
      i.d(t, { TriangleRenderer: () => p })
      var n = i(86441),
        r = i(4652),
        s = i(34026),
        o = i(15187),
        a = i(18807),
        l = i(87095),
        d = i(45197),
        h = i(68441),
        c = i(79849),
        u = i(18690)
      class p extends o.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data || this._data.points.length < 2) return null
          const [t, i] = this._data.points
          let n = (0, r.distanceToSegment)(t, i, e)
          const o = (0, d.interactionTolerance)().line
          if (n.distance <= o) return new a.HitTestResult(a.HitTarget.MovePoint)
          if (3 !== this._data.points.length) return null
          const l = this._data.points[2]
          return (
            (n = (0, r.distanceToSegment)(i, l, e)),
            n.distance <= o
              ? new a.HitTestResult(a.HitTarget.MovePoint)
              : ((n = (0, r.distanceToSegment)(l, t, e)),
                n.distance <= o
                  ? new a.HitTestResult(a.HitTarget.MovePoint)
                  : this._data.fillBackground &&
                      (0, s.pointInTriangle)(e, t, i, l)
                    ? new a.HitTestResult(a.HitTarget.MovePointBackground)
                    : null)
          )
        }
        _drawImpl(e) {
          var t
          if (null === this._data || this._data.points.length < 2) return
          const i = e.context,
            r =
              (null !== (t = this._data.linestyle) && void 0 !== t
                ? t
                : c.LINESTYLE_SOLID) === c.LINESTYLE_SOLID
                ? 'round'
                : 'butt'
          ;(i.lineCap = r),
            (i.lineJoin = 'round'),
            (i.strokeStyle = this._data.color),
            (i.lineWidth = this._data.linewidth),
            void 0 !== this._data.linestyle &&
              (0, h.setLineStyle)(i, this._data.linestyle)
          const [s, o, a = o] = this._data.points,
            { mediaSize: d } = e
          if (
            this._data.fillBackground &&
            Math.abs((s.x - a.x) * (o.y - a.y) - (o.x - a.x) * (s.y - a.y)) >
              1e-10
          ) {
            let e = [
              new n.Point(0, 0),
              new n.Point(d.width, 0),
              new n.Point(d.width, d.height),
              new n.Point(0, d.height),
            ]
            if (
              ((e = (0, h.clipPolygonByEdge)(e, s, o, [o, a])),
              (e = (0, h.clipPolygonByEdge)(e, o, a, [a, s])),
              (e = (0, h.clipPolygonByEdge)(e, a, s, [s, o])),
              e && e.length > 1)
            ) {
              i.save(), i.beginPath(), i.moveTo(e[0].x, e[0].y)
              for (let t = 1; t < e.length; t++) i.lineTo(e[t].x, e[t].y)
              ;(i.fillStyle = (0, l.generateColor)(
                this._data.backcolor,
                this._data.transparency,
              )),
                i.fill(),
                i.restore()
            }
          }
          const p = [],
            _ = i.getLineDash().reduce((e, t) => e + t, 0)
          ;[
            [s, o],
            [o, a],
            [a, s],
          ].forEach(([e, t]) => {
            const i = (0, u.intersectLineWithViewport)(
              e,
              t,
              !1,
              !1,
              d.width,
              d.height,
              _,
            )
            i && p.push(i)
          }),
            p.length &&
              (i.beginPath(),
              p.forEach(([e, t]) => {
                i.moveTo(e.x, e.y), i.lineTo(t.x, t.y)
              }),
              i.stroke())
        }
      }
    },
    99620: (e, t, i) => {
      e.exports = i.p + 'prediction-clock-white.c4675d37769f1df4c9ec.png'
    },
    88249: (e, t, i) => {
      e.exports = i.p + 'prediction-failure-white.a838a6689f951970e715.png'
    },
    14012: (e, t, i) => {
      e.exports = i.p + 'prediction-success-white.2fb9966b4c0f3529a2ea.png'
    },
    91481: (e) => {
      e.exports = {
        ar: 'in',
        ca_ES: 'in',
        cs: ['za'],
        de: 'in',
        el: ['σε'],
        en: 'in',
        es: ['en'],
        fa: 'in',
        fr: ['en'],
        he_IL: ['בתוך'],
        hu_HU: ['-ban/ben'],
        id_ID: ['dalam'],
        it: 'in',
        ja: ['：'],
        ko: 'in',
        ms_MY: ['dalam'],
        nl_NL: 'in',
        pl: ['w'],
        pt: ['em'],
        ro: 'in',
        ru: ['за'],
        sv: 'in',
        th: ['ใน'],
        tr: ['za'],
        vi: ['trong'],
        zh: ['在'],
        zh_TW: ['內'],
      }
    },
    44143: (e) => {
      e.exports = {
        ar: ['أغلقت'],
        ca_ES: ['Tancat'],
        cs: ['Zavřený'],
        de: ['Geschlossen'],
        el: 'Closed',
        en: 'Closed',
        es: ['Cerrado'],
        fa: ['سود/زیان'],
        fr: ['Fermé'],
        he_IL: ['נסגר'],
        hu_HU: ['Záró'],
        id_ID: ['Tutup'],
        it: ['Chiuso'],
        ja: ['確定'],
        ko: ['포지션청산'],
        ms_MY: ['Tutup'],
        nl_NL: ['Gesloten'],
        pl: ['Zamknięte'],
        pt: ['Fechado'],
        ro: 'Closed',
        ru: ['Закр. поз.'],
        sv: 'Closed',
        th: ['ปิด'],
        tr: ['Kapalı'],
        vi: ['Đóng'],
        zh: ['已平仓'],
        zh_TW: ['已平倉'],
      }
    },
    50140: (e) => {
      e.exports = {
        ar: ['مفتوح'],
        ca_ES: ['Obertura'],
        cs: ['Otevřený'],
        de: ['Offener'],
        el: ['Opened'],
        en: 'Open',
        es: ['Apertura'],
        fa: ['سود/زیان'],
        fr: ['Ouverture'],
        he_IL: ['נפתח'],
        hu_HU: ['Nyitva'],
        id_ID: ['Pembukaan'],
        it: ['Aperto'],
        ja: ['未確定'],
        ko: ['포지션보유'],
        ms_MY: ['Buka'],
        nl_NL: ['Opened'],
        pl: ['Otwarte'],
        pt: ['Aberto'],
        ro: 'Open',
        ru: ['Откр. поз.'],
        sv: 'Open',
        th: ['เปิด'],
        tr: ['Açık'],
        vi: ['Mở'],
        zh: ['开仓'],
        zh_TW: ['未平倉'],
      }
    },
    16075: (e) => {
      e.exports = {
        ar: ['إلغاء أمر'],
        ca_ES: ['Cancel·lar ordre'],
        cs: 'Cancel Order',
        de: ['Auftrag abbrechen'],
        el: 'Cancel Order',
        en: 'Cancel Order',
        es: ['Cancelar orden'],
        fa: 'Cancel Order',
        fr: ['Annuler Ordre'],
        he_IL: ['בטל פקודה'],
        hu_HU: ['Megbízás Törlése'],
        id_ID: ['Batalkan Order'],
        it: ['Annulla ordine'],
        ja: ['注文をキャンセル'],
        ko: ['주문 취소'],
        ms_MY: ['Batalkan Pesanan'],
        nl_NL: 'Cancel Order',
        pl: ['Anuluj zlecenie'],
        pt: ['Cancelar ordem'],
        ro: 'Cancel Order',
        ru: ['Отменить заявку'],
        sv: ['Avbryt order'],
        th: ['ยกเลิกคำสั่ง'],
        tr: ['Emir İptal'],
        vi: ['Hủy Lệnh'],
        zh: ['取消订单'],
        zh_TW: ['取消報單'],
      }
    },
    37431: (e) => {
      e.exports = {
        ar: ['إغلاق صفقة'],
        ca_ES: 'Close Position',
        cs: 'Close Position',
        de: ['Position Schließen'],
        el: 'Close Position',
        en: 'Close Position',
        es: ['Cerrar posición'],
        fa: 'Close Position',
        fr: ['Fermer la Position'],
        he_IL: ['סגור פוזיציה'],
        hu_HU: ['Záró Pozíció'],
        id_ID: ['Tutup Posisi'],
        it: ['Chiudi posizione'],
        ja: ['ポジションを決済'],
        ko: ['포지션 닫기'],
        ms_MY: ['Kedudukan Penutup'],
        nl_NL: 'Close Position',
        pl: ['Zamknij pozycję'],
        pt: ['Fechar Posição'],
        ro: 'Close Position',
        ru: ['Закрыть позицию'],
        sv: ['Stäng position'],
        th: ['ปิดสถานะ'],
        tr: ['Pozisyonu Kapat'],
        vi: ['Đóng Trạng thái'],
        zh: ['平仓'],
        zh_TW: ['平倉'],
      }
    },
    968: (e) => {
      e.exports = {
        ar: ['لم تنجح'],
        ca_ES: 'FAILURE',
        cs: ['SELHÁNÍ'],
        de: ['FEHLER'],
        el: ['ΑΠΟΤΥΧΙΑ'],
        en: 'FAILURE',
        es: ['FALLO'],
        fa: ['شکست'],
        fr: ['ÉCHEC'],
        he_IL: ['כישלון'],
        hu_HU: ['VESZTESÉG'],
        id_ID: ['KEGAGALAN'],
        it: ['OPERAZIONE NON RIUSCITA'],
        ja: ['失敗'],
        ko: ['실패'],
        ms_MY: ['KEGAGALAN'],
        nl_NL: ['Mislukt!'],
        pl: ['PORAŻKA'],
        pt: ['FALHA'],
        ro: 'FAILURE',
        ru: ['НЕУДАЧА'],
        sv: ['MISSLYCKANDE'],
        th: ['ล้มเหลว'],
        tr: ['BAŞARISIZ'],
        vi: ['THẤT BẠI'],
        zh: ['失败'],
        zh_TW: ['失敗'],
      }
    },
    63706: (e) => {
      e.exports = {
        ar: ['رأس'],
        ca_ES: ['Cap'],
        cs: 'Head',
        de: ['Kopf'],
        el: 'Head',
        en: 'Head',
        es: ['Cabeza'],
        fa: 'Head',
        fr: ['Tête'],
        he_IL: ['ראש'],
        hu_HU: ['Fej'],
        id_ID: 'Head',
        it: ['Testa'],
        ja: ['ヘッド'],
        ko: ['머리'],
        ms_MY: ['Kepala'],
        nl_NL: 'Head',
        pl: ['Głowa'],
        pt: ['Cabeça'],
        ro: 'Head',
        ru: ['Голова'],
        sv: ['Huvud'],
        th: ['หัว'],
        tr: ['Baş'],
        vi: ['Đầu'],
        zh: ['头部'],
        zh_TW: ['頭'],
      }
    },
    68589: (e) => {
      e.exports = {
        ar: ['الكتف الأيسر'],
        ca_ES: ['Espatlla esquerra'],
        cs: 'Left Shoulder',
        de: ['Linke Schulter'],
        el: 'Left Shoulder',
        en: 'Left Shoulder',
        es: ['Hombro izquierdo'],
        fa: 'Left Shoulder',
        fr: ['Épaule gauche'],
        he_IL: ['כתף שמאל'],
        hu_HU: ['Bal Váll'],
        id_ID: 'Left Shoulder',
        it: ['Spalla sinistra'],
        ja: ['左ショルダー'],
        ko: ['왼어깨'],
        ms_MY: ['Bahu Kiri'],
        nl_NL: 'Left Shoulder',
        pl: ['Lewe ramię'],
        pt: ['Ombro Esquerdo'],
        ro: 'Left Shoulder',
        ru: ['Левое плечо'],
        sv: ['Vänster skuldra'],
        th: ['ไหล่ซ้าย'],
        tr: ['Sol Omuz'],
        vi: ['Vai trái'],
        zh: ['左肩'],
        zh_TW: ['左肩'],
      }
    },
    33241: (e) => {
      e.exports = {
        ar: ['تعديل الأمر'],
        ca_ES: ['Modifica ordre'],
        cs: 'Modify Order',
        de: ['Order modifizieren'],
        el: 'Modify Order',
        en: 'Modify Order',
        es: ['Modificar orden'],
        fa: 'Modify Order',
        fr: ["Modifier l'ordre"],
        he_IL: ['שנה הוראה'],
        hu_HU: 'Modify Order',
        id_ID: ['Memodifikasi Order'],
        it: ['Modifica ordine'],
        ja: ['注文の変更'],
        ko: ['오더 고치기'],
        ms_MY: ['Ubah Suai Pesanan'],
        nl_NL: 'Modify Order',
        pl: ['Modyfikuj zlecenie'],
        pt: ['Modificar ordem'],
        ro: 'Modify Order',
        ru: ['Изменить заявку'],
        sv: ['Ändra order'],
        th: ['แก้ไขออเดอร์'],
        tr: ['Emir Değiştir'],
        vi: ['Chỉnh Lệnh'],
        zh: ['修改订单'],
        zh_TW: ['修改訂單'],
      }
    },
    26787: (e) => {
      e.exports = {
        ar: ['نجاح'],
        ca_ES: 'SUCCESS',
        cs: ['ÚSPĚCH'],
        de: ['ERFOLG'],
        el: ['ΕΠΙΤΥΧΙΑ'],
        en: 'SUCCESS',
        es: ['ÉXITO'],
        fa: ['موفقیت'],
        fr: ['SUCCÈS'],
        he_IL: ['הצלחה'],
        hu_HU: ['NYERESÉG'],
        id_ID: ['SUKSES'],
        it: ['OPERAZIONE RIUSCITA'],
        ja: ['成功'],
        ko: ['성공'],
        ms_MY: ['BERJAYA'],
        nl_NL: ['Succes!'],
        pl: ['SUKCES'],
        pt: ['SUCESSO'],
        ro: 'SUCCESS',
        ru: ['УСПЕХ'],
        sv: ['FRAMGÅNG'],
        th: ['สำเร็จ'],
        tr: ['BAŞARILI'],
        vi: ['THÀNH CÔNG'],
        zh: ['成功'],
        zh_TW: ['成功'],
      }
    },
    438: (e) => {
      e.exports = {
        ar: [
          'وقف:{stopChange} ({stopChangePercent}) {stopChangePip}، الكمية:‎{amount}‎',
        ],
        ca_ES: [
          'Stop: {stopChange} ({stopChangePercent}) {stopChangePip}, Import: {amount}',
        ],
        cs: 'Stop: {stopChange} ({stopChangePercent}) {stopChangePip}, Amount: {amount}',
        de: [
          'Stop: {stopChange} ({stopChangePercent}) {stopChangePip}, Betrag: {amount}',
        ],
        el: 'Stop: {stopChange} ({stopChangePercent}) {stopChangePip}, Amount: {amount}',
        en: 'Stop: {stopChange} ({stopChangePercent}) {stopChangePip}, Amount: {amount}',
        es: [
          'Stop: {stopChange} ({stopChangePercent}) {stopChangePip}, Importe: {amount}',
        ],
        fa: 'Stop: {stopChange} ({stopChangePercent}) {stopChangePip}, Amount: {amount}',
        fr: [
          'Stop: {stopChange} ({stopChangePercent}) {stopChangePip}, Montant: {amount}',
        ],
        he_IL: [
          'סטופ: {stopChange} ({stopChangePercent}) {stopChangePip}, סכום: {amount}',
        ],
        hu_HU: [
          'Stop: {stopChange} ({stopChangePercent}) {stopChangePip}, Összeg: {amount}',
        ],
        id_ID: [
          'Stop: {stopChange} ({stopChangePercent}) {stopChangePip}, Jumlah: {amount}',
        ],
        it: [
          'Stop: {stopChange} ({stopChangePercent}) {stopChangePip}, Quantità: {amount}',
        ],
        ja: [
          'ストップ: {stopChange} ({stopChangePercent}) {stopChangePip}, 金額: {amount}',
        ],
        ko: [
          '스탑: {stopChange} ({stopChangePercent}) {stopChangePip}, 금액: {amount}',
        ],
        ms_MY: [
          'Berhenti: {stopChange} ({stopChangePercent}) {stopChangePip}, Jumlah: {amount}',
        ],
        nl_NL:
          'Stop: {stopChange} ({stopChangePercent}) {stopChangePip}, Amount: {amount}',
        pl: [
          'Stop: {stopChange} ({stopChangePercent}) {stopChangePip}, Kwota: {amount}',
        ],
        pt: [
          'Stop: {stopChange} ({stopChangePercent}) {stopChangePip}, Quantidade: {amount}',
        ],
        ro: 'Stop: {stopChange} ({stopChangePercent}) {stopChangePip}, Amount: {amount}',
        ru: [
          'Стоп: {stopChange} ({stopChangePercent}) {stopChangePip}, Сумма: {amount}',
        ],
        sv: [
          'Stopp: {stopChange} ({stopChangePercent}) {stopChangePip}, belopp: {amount}',
        ],
        th: [
          'หยุด: {stopChange} ({stopChangePercent}) {stopChangePip}, จำนวน: {amount}',
        ],
        tr: [
          'Durdurma: {stopChange} ({stopChangePercent}) {stopChangePip}, Miktar: {amount}',
        ],
        vi: [
          'Dừng: {stopChange} ({stopChangePercent}) {stopChangePip}, Số tiền: {amount}',
        ],
        zh: [
          '止损:{stopChange} ({stopChangePercent}) {stopChangePip}, 账户: {amount}',
        ],
        zh_TW: [
          '停損：{stopChange} ({stopChangePercent}) {stopChangePip}，賬戶：{amount}',
        ],
      }
    },
    11810: (e) => {
      e.exports = {
        ar: ['حماية المركز'],
        ca_ES: 'Protect Position',
        cs: 'Protect Position',
        de: ['Position absichern'],
        el: 'Protect Position',
        en: 'Protect Position',
        es: ['Proteger posición'],
        fa: 'Protect Position',
        fr: ['Protéger la position'],
        he_IL: ['הגן על הפוזיציה.'],
        hu_HU: 'Protect Position',
        id_ID: ['Lindungi Posisi'],
        it: ['Proteggi posizione'],
        ja: ['ポジション保護'],
        ko: ['프로텍트 포지션'],
        ms_MY: ['Melindungi Kedudukan'],
        nl_NL: 'Protect Position',
        pl: ['Zabezpiecz pozycję'],
        pt: ['Proteger a posição'],
        ro: 'Protect Position',
        ru: ['Защитить позицию'],
        sv: ['Skydda position'],
        th: ['ป้องกันโพซิชั่น'],
        tr: ['Pozisyonu Koru'],
        vi: ['Bảo vệ Vị thế'],
        zh: ['保护持仓'],
        zh_TW: ['保護倉位'],
      }
    },
    87061: (e) => {
      e.exports = {
        ar: ['كمية:‎{qty}‎'],
        ca_ES: ['Quantitat: {qty}'],
        cs: 'Qty: {qty}',
        de: ['Anz: {qty}'],
        el: 'Qty: {qty}',
        en: 'Qty: {qty}',
        es: ['Cantidad: {qty}'],
        fa: 'Qty: {qty}',
        fr: ['Qté: {qty}'],
        he_IL: ['כמות: {qty}'],
        hu_HU: ['Menny.: {qty}'],
        id_ID: ['Kuant: {qty}'],
        it: ['Q.tà: {qty}'],
        ja: ['数量: {qty}'],
        ko: ['수량: {qty}'],
        ms_MY: ['Kuantiti: {qty}'],
        nl_NL: 'Qty: {qty}',
        pl: ['Ilość: {qty}'],
        pt: ['Qtde: {qty}'],
        ro: 'Qty: {qty}',
        ru: ['Кол-во: {qty}'],
        sv: ['Kvt: {qty}'],
        th: ['จำนวน: {qty}'],
        tr: ['Mik: {qty}'],
        vi: ['S.Lg: {qty}'],
        zh: ['仓量:{qty}'],
        zh_TW: ['數量：{qty}'],
      }
    },
    19780: (e) => {
      e.exports = {
        ar: ['عكس الصفقة'],
        ca_ES: 'Reverse Position',
        cs: 'Reverse Position',
        de: ['Position Umkehren'],
        el: 'Reverse Position',
        en: 'Reverse Position',
        es: ['Revertir posición'],
        fa: 'Reverse Position',
        fr: ['Inverser la Position'],
        he_IL: ['הפוך פוזיציה'],
        hu_HU: ['Fordított Pozíció'],
        id_ID: ['Membalik Posisi'],
        it: ['Inverti posizione'],
        ja: ['ポジションを反転'],
        ko: ['리버스 포지션'],
        ms_MY: ['Kedudukan Terbalik'],
        nl_NL: 'Reverse Position',
        pl: ['Odwróć pozycje'],
        pt: ['Reverter Posição'],
        ro: 'Reverse Position',
        ru: ['Перевернуть позицию'],
        sv: ['Omvänd position'],
        th: ['ตำแหน่งการย้อนกลับ'],
        tr: ['Karşıt Pozisyon'],
        vi: ['Vị thế Đảo ngược'],
        zh: ['平仓反手'],
        zh_TW: ['平倉反手'],
      }
    },
    78934: (e) => {
      e.exports = {
        ar: ['الكتف الأيمن'],
        ca_ES: ['Espatlla dreta'],
        cs: 'Right Shoulder',
        de: ['Rechte Schulter'],
        el: 'Right Shoulder',
        en: 'Right Shoulder',
        es: ['Hombro derecho'],
        fa: 'Right Shoulder',
        fr: ['Epaule droite'],
        he_IL: ['כתף ימין'],
        hu_HU: ['Jobb Váll'],
        id_ID: 'Right Shoulder',
        it: ['Spalla destra'],
        ja: ['右ショルダー'],
        ko: ['오른어깨'],
        ms_MY: ['Bahu Kanan'],
        nl_NL: 'Right Shoulder',
        pl: ['Prawe ramię'],
        pt: ['Ombro Direito'],
        ro: 'Right Shoulder',
        ru: ['Правое плечо'],
        sv: ['Höger skuldra'],
        th: ['ไหล่ขวา'],
        tr: ['Sağ Omuz'],
        vi: ['Vai Phải'],
        zh: ['右肩'],
        zh_TW: ['右肩'],
      }
    },
    53115: (e) => {
      e.exports = {
        ar: ['نسبة المخاطرة/العائد: {ratio}'],
        ca_ES: ['Ràtio risc/benefici: {ratio}'],
        cs: ['Poměr rizika / odměny: {ratio}'],
        de: ['Chance/Risiko Verhältnis: {ratio}'],
        el: 'Risk/Reward Ratio: {ratio}',
        en: 'Risk/Reward Ratio: {ratio}',
        es: ['Relación riesgo/beneficio: {ratio}'],
        fa: ['‫نسبت ریسک به سود: {ratio}'],
        fr: ['Ratio Risque/Récompense: {ratio}'],
        he_IL: ['יחס סיכוי/סיכון: {ratio}'],
        hu_HU: ['Kockázat/Nyereség Arány: {ratio}'],
        id_ID: ['Rasio Risiko/Perolehan: {ratio}'],
        it: ['Rapporto rischio/rendimento: {ratio}'],
        ja: ['リスク／リワード比: {ratio}'],
        ko: ['위험/보상율: {ratio}'],
        ms_MY: ['Nisbah Risiko/Ganjaran: {ratio}'],
        nl_NL: ['Risico/opbrengst ratio: {ratio}'],
        pl: ['Współczynnik Ryzyko/Zysk: {ratio}'],
        pt: ['Razão risco/retorno: {ratio}'],
        ro: 'Risk/Reward Ratio: {ratio}',
        ru: ['Соотношение риск/прибыль: {ratio}'],
        sv: ['Risk/reward-kvot: {ratio}'],
        th: ['ความเสี่ยง/ผลตอบแทน : {ratio}'],
        tr: ['Risk/Ödül Oranı: {ratio}'],
        vi: ['Tỷ lệ Rủi ro/Lợi nhuận: {ratio}'],
        zh: ['盈亏比: {ratio}'],
        zh_TW: ['風險/報酬比：{ratio}'],
      }
    },
    15166: (e) => {
      e.exports = {
        ar: [
          'هدف:{profitChange} ({profitChangePercent}) {profitChangePip}، الكمية:‎{amount}‎',
        ],
        ca_ES: [
          'Objectiu: {profitChange} ({profitChangePercent}) {profitChangePip}, Import: {amount}',
        ],
        cs: 'Target: {profitChange} ({profitChangePercent}) {profitChangePip}, Amount: {amount}',
        de: [
          'Ziel: {profitChange} ({profitChangePercent}) {profitChangePip}, Betrag: {amount}',
        ],
        el: 'Target: {profitChange} ({profitChangePercent}) {profitChangePip}, Amount: {amount}',
        en: 'Target: {profitChange} ({profitChangePercent}) {profitChangePip}, Amount: {amount}',
        es: [
          'Objetivo: {profitChange} ({profitChangePercent}) {profitChangePip}, Importe: {amount}',
        ],
        fa: 'Target: {profitChange} ({profitChangePercent}) {profitChangePip}, Amount: {amount}',
        fr: [
          'Cible: {profitChange} ({profitChangePercent}) {profitChangePip},Montant: {amount}',
        ],
        he_IL: [
          'יעד: {profitChange} ({profitChangePercent}) {profitChangePip}, סכום: {amount}',
        ],
        hu_HU: [
          'Cél: {profitChange} ({profitChangePercent}) {profitChangePip}, Összeg: {amount}',
        ],
        id_ID: [
          'Target: {profitChange} ({profitChangePercent}) {profitChangePip}, Jumlah: {amount}',
        ],
        it: [
          'Target: {profitChange} ({profitChangePercent}) {profitChangePip}, Quantità: {amount}',
        ],
        ja: [
          'ターゲット: {profitChange} ({profitChangePercent}) {profitChangePip}, 金額: {amount}',
        ],
        ko: [
          '타겟: {profitChange} ({profitChangePercent}) {profitChangePip}, 금액: {amount}',
        ],
        ms_MY: [
          'Sasaran: {profitChange} ({profitChangePercent}) {profitChangePip}, Jumlah: {amount}',
        ],
        nl_NL:
          'Target: {profitChange} ({profitChangePercent}) {profitChangePip}, Amount: {amount}',
        pl: [
          'Cel: {profitChange} ({profitChangePercent}) {profitChangePip}, Kwota: {amount}',
        ],
        pt: [
          'Alvos: {profitChange} ({profitChangePercent}) {profitChangePip}, Quantidade: {amount}',
        ],
        ro: 'Target: {profitChange} ({profitChangePercent}) {profitChangePip}, Amount: {amount}',
        ru: [
          'Цель: {profitChange} ({profitChangePercent}) {profitChangePip}, Сумма: {amount}',
        ],
        sv: [
          'Mål: {profitChange} ({profitChangePercent}) {profitChangePip}, Belopp: {amount}',
        ],
        th: [
          'เป้าหมาย: {profitChange} ({profitChangePercent}) {profitChangePip}, จำนวน: {amount}',
        ],
        tr: [
          'Hedef: {profitChange} ({profitChangePercent}) {profitChangePip}, Miktar: {amount}',
        ],
        vi: [
          'Mục tiêu: {profitChange} ({profitChangePercent}) {profitChangePip}, Số tiền: {amount}',
        ],
        zh: [
          '目标: {profitChange} ({profitChangePercent}) {profitChangePip}, 账户: {amount}',
        ],
        zh_TW: [
          '目標：{profitChange} ({profitChangePercent}) {profitChangePip}，賬戶：{amount}',
        ],
      }
    },
    26273: (e) => {
      e.exports = {
        ar: ['مسافة: {number} px'],
        ca_ES: ['distància: {number} px'],
        cs: ['Vzdálenost: {number} px'],
        de: ['Abstand: {number} px'],
        el: ['απόσταση: {number} px'],
        en: 'distance: {number} px',
        es: ['distancia: {number} px'],
        fa: ['{number} px :فاصله مختصات'],
        fr: 'distance: {number} px',
        he_IL: ['מרחק: {number} px'],
        hu_HU: ['távolság: {number} px'],
        id_ID: ['jarak: {number} px'],
        it: ['distanza {number} px'],
        ja: ['距離: {number} px'],
        ko: ['거리: {number} px'],
        ms_MY: ['jarak: {number} px'],
        nl_NL: ['afstand: {number} px'],
        pl: ['dystans: {number} px'],
        pt: ['distância: {number} px'],
        ro: 'distance: {number} px',
        ru: ['Расстояние: {number} пк'],
        sv: ['avstånd: {number} px'],
        th: ['ระยะ: {number} px'],
        tr: ['mesafe: {number} px'],
        vi: ['khoảng cách: {number} px'],
        zh: ['距离: {number} px'],
        zh_TW: ['距離：{number} px'],
      }
    },
    72892: (e) => {
      e.exports = {
        ar: ['‎{status}‎ الهدف والخسارة:‎{pnl}‎'],
        ca_ES: ['{status} PiG: {pnl}'],
        cs: ['{status} Z&Z: {pnl}'],
        de: ['{status} G&V: {pnl}'],
        el: '{status} P&L: {pnl}',
        en: '{status} P&L: {pnl}',
        es: ['{status} PyG: {pnl}'],
        fa: ['‎{status} P&L {pnl}‎'],
        fr: ['{status} Gains&Pertes: {pnl}'],
        he_IL: ['{status} רווח/הפסד: {pnl}'],
        hu_HU: '{status} P&L: {pnl}',
        id_ID: '{status} P&L: {pnl}',
        it: '{status} P&L: {pnl}',
        ja: ['{status}損益: {pnl}'],
        ko: ['{status} 손익: {pnl}'],
        ms_MY: '{status} P&L: {pnl}',
        nl_NL: ['{status} winst & verlies: {pnl}'],
        pl: '{status} P&L: {pnl}',
        pt: ['{status} L&P: {pnl}'],
        ro: '{status} P&L: {pnl}',
        ru: ['ПР/УБ {status}: {pnl}'],
        sv: '{status} P&L: {pnl}',
        th: ['{status} กำไร&ขาดทุน: {pnl}'],
        tr: ['{status} Kar/Zarar: {pnl}'],
        vi: ['{status} Lợi nhuận & Thua lỗ: {pnl}'],
        zh: ['{status} 盈利&亏损: {pnl}'],
        zh_TW: ['{status}損益表：{pnl}'],
      }
    },
  },
])
