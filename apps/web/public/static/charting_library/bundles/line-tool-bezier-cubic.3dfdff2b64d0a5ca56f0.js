;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9014],
  {
    73174: (e, t, n) => {
      n.r(t),
        n.d(t, {
          getCoordinateXMetaInfo: () => P,
          getCoordinateYMetaInfo: () => m,
          getCoordinatesPropertiesDefinitions: () => S,
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
      var d = n(32097),
        c = n(64147),
        h = n(12988),
        u = n(91682)
      const p = -5e4,
        g = 15e3,
        _ = new r.TranslatedString(
          'change price Y coordinate',
          o.t(null, void 0, n(11737)),
        ),
        f = new r.TranslatedString(
          'change bar X coordinate',
          o.t(null, void 0, n(2066)),
        ),
        x = new r.TranslatedString('move drawings', o.t(null, void 0, n(76261)))
      function m(e, t, n) {
        return {
          property: (0, d.convertToDefinitionProperty)(e, t.price, _),
          info: { typeY: 1, stepY: n },
        }
      }
      function P(e, t) {
        return {
          property: (0, d.convertToDefinitionProperty)(e, t.bar, f),
          info: {
            typeX: 0,
            minX: new c.WatchedValue(p),
            maxX: new c.WatchedValue(g),
            stepX: new c.WatchedValue(1),
          },
        }
      }
      function S(e, t, n, i, o, r) {
        const s = P(e, t),
          a = m(e, t, i)
        return (0, d.createCoordinatesPropertyDefinition)(
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
      function y(e, t, n) {
        const o = new h.Property(''),
          r = (0, d.makeProxyDefinitionProperty)(o.weakReference())
        return (
          (r.setValue = (r) => {
            try {
              const o = r.match(v)
              if (!o) return
              const [, s, a] = o
              if (!a.length) return
              const d = n(Number.parseFloat(a))
              if ('/' === s && (0 === d.price || 0 === d.index)) return
              t.withMacro(x, () => {
                e.filter((e) => !e.isSourceHidden()).forEach((e) => {
                  const n = e.points()
                  let o
                  switch (s) {
                    case '': {
                      const e = (0, i.ensureDefined)(n[0])
                      let { index: t = e.index, price: r = e.price } = d
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
                      let { index: e = 0, price: t = 0 } = d
                      '-' === s && ((e *= -1), (t *= -1)),
                        (o = n.map((n) => ({
                          ...n,
                          index: n.index + e,
                          price: n.price + t,
                        })))
                      break
                    }
                    case '*': {
                      const { index: e = 1, price: t = 1 } = d
                      o = n.map((n) => ({
                        ...n,
                        index: n.index * e,
                        price: n.price * t,
                      }))
                      break
                    }
                    case '/': {
                      const { index: e = 1, price: t = 1 } = d
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
        const i = y(e, t, (e) => ({ index: e })),
          r = y(e, t, (e) => ({ price: e }))
        return (0, d.createSelectionCoordinatesPropertyDefinition)(
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
    53749: (e, t, n) => {
      n.d(t, { createLineStyleDefinition: () => m })
      var i = n(11542),
        o = n(45126),
        r = n(32097),
        s = n(91682)
      const a = new o.TranslatedString(
          'change {toolName} line visibility',
          i.t(null, void 0, n(24550)),
        ),
        l = new o.TranslatedString(
          'change {toolName} line width',
          i.t(null, void 0, n(19541)),
        ),
        d = new o.TranslatedString(
          'change {toolName} line style',
          i.t(null, void 0, n(66429)),
        ),
        c = new o.TranslatedString(
          'change {toolName} line color',
          i.t(null, void 0, n(24059)),
        ),
        h = new o.TranslatedString(
          'change {toolName} line extending left',
          i.t(null, void 0, n(18773)),
        ),
        u = new o.TranslatedString(
          'change {toolName} line left end',
          i.t(null, void 0, n(21474)),
        ),
        p = new o.TranslatedString(
          'change {toolName} line extending right',
          i.t(null, void 0, n(43823)),
        ),
        g = new o.TranslatedString(
          'change {toolName} line right end',
          i.t(null, void 0, n(54827)),
        ),
        _ = i.t(null, void 0, n(3554)),
        f = i.t(null, void 0, n(61856)),
        x = i.t(null, void 0, n(87430))
      function m(e, t, n, i, o) {
        const m = {},
          P = {
            id: `${(0, s.removeSpaces)(n.originalText())}${i}`,
            title: (o && o.line) || _,
          }
        return (
          void 0 !== t.showLine &&
            (m.checked = (0, r.convertToDefinitionProperty)(
              e,
              t.showLine,
              a.format({ toolName: n }),
            )),
          void 0 !== t.lineWidth &&
            (m.width = (0, r.convertToDefinitionProperty)(
              e,
              t.lineWidth,
              l.format({ toolName: n }),
            )),
          void 0 !== t.lineStyle &&
            (m.style = (0, r.convertToDefinitionProperty)(
              e,
              t.lineStyle,
              d.format({ toolName: n }),
            )),
          void 0 !== t.lineColor &&
            (m.color = (0, r.getColorDefinitionProperty)(
              e,
              t.lineColor,
              null,
              c.format({ toolName: n }),
            )),
          void 0 !== t.extendLeft &&
            ((m.extendLeft = (0, r.convertToDefinitionProperty)(
              e,
              t.extendLeft,
              h.format({ toolName: n }),
            )),
            (P.extendLeftTitle = (o && o.extendLeftTitle) || f)),
          void 0 !== t.leftEnd &&
            (m.leftEnd = (0, r.convertToDefinitionProperty)(
              e,
              t.leftEnd,
              u.format({ toolName: n }),
            )),
          void 0 !== t.extendRight &&
            ((m.extendRight = (0, r.convertToDefinitionProperty)(
              e,
              t.extendRight,
              p.format({ toolName: n }),
            )),
            (P.extendRightTitle = (o && o.extendRightTitle) || x)),
          void 0 !== t.rightEnd &&
            (m.rightEnd = (0, r.convertToDefinitionProperty)(
              e,
              t.rightEnd,
              g.format({ toolName: n }),
            )),
          (0, r.createLinePropertyDefinition)(m, P)
        )
      }
    },
    86622: (e, t, n) => {
      n.r(t), n.d(t, { GeneralBezierDefinitionsViewModel: () => u })
      var i = n(11542),
        o = n(45126),
        r = n(53749),
        s = n(18009),
        a = n(32097),
        l = n(91682)
      const d = new o.TranslatedString(
          'change {title} background visibility',
          i.t(null, void 0, n(30839)),
        ),
        c = new o.TranslatedString(
          'change {title} background color',
          i.t(null, void 0, n(49765)),
        ),
        h = i.t(null, void 0, n(79468))
      class u extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            n = new o.TranslatedString(t, this._source.translatedType())
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._undoModel,
                {
                  lineColor: e.linecolor,
                  lineWidth: e.linewidth,
                  lineStyle: e.linestyle,
                  extendLeft: e.extendLeft,
                  extendRight: e.extendRight,
                  leftEnd: e.leftEnd,
                  rightEnd: e.rightEnd,
                },
                n,
                'Line',
              ),
              (0, a.createColorPropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._undoModel,
                    e.fillBackground,
                    d.format({ title: n }),
                  ),
                  color: (0, a.getColorDefinitionProperty)(
                    this._undoModel,
                    e.backgroundColor,
                    e.transparency,
                    c.format({ title: n }),
                  ),
                },
                { id: (0, l.removeSpaces)(`${t}BackgroundColor`), title: h },
              ),
            ],
          }
        }
      }
    },
    54696: (e, t, n) => {
      n.r(t), n.d(t, { LineToolBezierCubic: () => y })
      var i = n(50151),
        o = n(32679),
        r = n(29875),
        s = n(86622),
        a = n(19063),
        l = n(27916),
        d = n(75919),
        c = n(56468),
        h = n(64034),
        u = n(66825),
        p = n(91046),
        g = n(49857),
        _ = n(6298),
        f = n(61993),
        x = n(37743)
      class m extends d.MediaCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = e || null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          const t = this._data
          if (null === t) return null
          if (4 === t.points.length) {
            const n = (0, f.interactionTolerance)().curve,
              [i, o, r, s] = t.points,
              a = s.subtract(i),
              l = r.subtract(a.scaled(0.25)),
              d = r.add(a.scaled(0.25)),
              h = o.subtract(r),
              p = s.subtract(h.scaled(0.25)),
              g = s.add(h.scaled(0.25))
            if (
              (0, u.quadroBezierHitTest)(r, i, l, e, n) ||
              (0, u.cubicBezierHitTest)(r, d, p, s, e, n) ||
              (0, u.quadroBezierHitTest)(s, o, g, e, n)
            )
              return new c.HitTestResult(c.HitTarget.MovePoint)
            let x = (0, _.hitTestExtendedPoints)(e, n, t.extendLeftPoints)
            return (
              null === x &&
                (x = (0, _.hitTestExtendedPoints)(e, n, t.extendRightPoints)),
              x
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
            (0, x.setLineStyle)(t, this._data.lineStyle)
          const n = this._data.points[0],
            i = this._data.points[1]
          if (2 === this._data.points.length)
            t.beginPath(),
              t.moveTo(n.x, n.y),
              t.lineTo(i.x, i.y),
              t.stroke(),
              this._data.leftEnd === g.LineEnd.Arrow &&
                (0, p.drawArrow)(i, n, t, t.lineWidth, h.dpr1PixelRatioInfo),
              this._data.rightEnd === g.LineEnd.Arrow &&
                (0, p.drawArrow)(n, i, t, t.lineWidth, h.dpr1PixelRatioInfo)
          else {
            const e = this._data.points[2],
              o = this._data.points[3],
              r = o.subtract(n),
              s = e.subtract(r.scaled(0.25)),
              a = e.add(r.scaled(0.25)),
              l = i.subtract(e),
              d = o.subtract(l.scaled(0.25)),
              c = o.add(l.scaled(0.25))
            this._data.fillBack &&
              this._data.points.length > 2 &&
              ((t.fillStyle = this._data.backColor),
              t.beginPath(),
              t.moveTo(n.x, n.y),
              t.quadraticCurveTo(s.x, s.y, e.x, e.y),
              t.bezierCurveTo(a.x, a.y, d.x, d.y, o.x, o.y),
              t.quadraticCurveTo(c.x, c.y, i.x, i.y),
              t.fill()),
              t.beginPath(),
              (0, _.buildExtendedSegments)(t, this._data.extendLeftPoints),
              t.moveTo(n.x, n.y),
              t.quadraticCurveTo(s.x, s.y, e.x, e.y),
              t.bezierCurveTo(a.x, a.y, d.x, d.y, o.x, o.y),
              t.quadraticCurveTo(c.x, c.y, i.x, i.y),
              (0, _.buildExtendedSegments)(t, this._data.extendRightPoints),
              this._data.leftEnd === g.LineEnd.Arrow &&
                (0, p.drawArrow)(s, n, t, t.lineWidth, h.dpr1PixelRatioInfo),
              this._data.rightEnd === g.LineEnd.Arrow &&
                (0, p.drawArrow)(c, i, t, t.lineWidth, h.dpr1PixelRatioInfo),
              t.stroke()
          }
        }
      }
      var P = n(95201),
        S = n(35246)
      class v extends l.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._bezierCubicRenderer = new m()),
            (this._renderer = new P.CompositeRenderer()),
            (this._extendedSegmentLeftCache = null),
            (this._extendedSegmentRightCache = null)
        }
        renderer(e) {
          return this._invalidated && this._updateImpl(e), this._renderer
        }
        _updateImpl(e) {
          if (
            (super._updateImpl(e),
            this._renderer.clear(),
            this._points.length < 2)
          )
            return
          const t = this._source.properties().childs()
          let n = [],
            o = []
          if (4 === this._source.points().length) {
            const r = (0, i.ensureNotNull)(
                this._source.pointToScreenPoint(this._source.points()[0]),
              ),
              s = (0, i.ensureNotNull)(
                this._source.pointToScreenPoint(this._source.points()[1]),
              ),
              a = (0, i.ensureNotNull)(
                this._source.pointToScreenPoint(this._source.points()[2]),
              ),
              l = (0, i.ensureNotNull)(
                this._source.pointToScreenPoint(this._source.points()[3]),
              ),
              d = l.subtract(r),
              c = a.subtract(d.scaled(0.25)),
              h = s.subtract(a),
              u = l.add(h.scaled(0.25)),
              {
                mediaSize: { width: p, height: g },
              } = e
            t.extendLeft.value() &&
              (n = this._extendSegmentLeft(a, r, c, p, g)),
              t.extendRight.value() &&
                (o = this._extendSegmentRight(l, s, u, p, g))
          }
          const r = this._points.slice(),
            s = this._source.controlPoints()
          null !== s &&
            (r.push(
              (0, i.ensureNotNull)(this._source.pointToScreenPoint(s[0])),
            ),
            r.push((0, i.ensureNotNull)(this._source.pointToScreenPoint(s[1]))))
          const l = {
            points: r,
            color: t.linecolor.value(),
            lineWidth: t.linewidth.value(),
            lineStyle: t.linestyle.value(),
            leftEnd: t.leftEnd.value(),
            rightEnd: t.rightEnd.value(),
            fillBack: t.fillBackground.value(),
            backColor: (0, a.generateColor)(
              t.backgroundColor.value(),
              t.transparency.value(),
            ),
            extendLeftPoints: n,
            extendRightPoints: o,
          }
          this._bezierCubicRenderer.setData(l),
            this._renderer.append(this._bezierCubicRenderer),
            this.addAnchors(this._renderer)
        }
        _extendSegmentLeft(e, t, n, o, r) {
          return (
            (0, S.cacheIsValid)(
              this._extendedSegmentLeftCache,
              e,
              t,
              n,
              o,
              r,
            ) ||
              (this._extendedSegmentLeftCache = {
                p1: e,
                p2: t,
                p3: n,
                width: o,
                height: r,
                segment: (0, u.extendQuadroBezier)(e, t, n, o, r),
              }),
            (0, i.ensureNotNull)(this._extendedSegmentLeftCache).segment
          )
        }
        _extendSegmentRight(e, t, n, o, r) {
          return (
            (0, S.cacheIsValid)(
              this._extendedSegmentRightCache,
              e,
              t,
              n,
              o,
              r,
            ) ||
              (this._extendedSegmentRightCache = {
                p1: e,
                p2: t,
                p3: n,
                width: o,
                height: r,
                segment: (0, u.extendQuadroBezier)(e, t, n, o, r),
              }),
            (0, i.ensureNotNull)(this._extendedSegmentRightCache).segment
          )
        }
      }
      class y extends r.LineDataSource {
        constructor(e, t, n, i) {
          super(
            e,
            t ?? y.createProperties(e.backgroundTheme().spawnOwnership()),
            n,
            i,
          ),
            (this._controlPoints = null),
            this._setPaneViews([new v(this, e)])
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Double Curve'
        }
        normalizedPointsForCreating() {
          const e = super.normalizedPointsForCreating()
          return [e[0], e[e.length - 1]]
        }
        setLastPoint(e, t) {
          const n = super.setLastPoint(e, t)
          return (this._controlPoints = this._calculateControlPoints()), n
        }
        addPoint(e, t, n) {
          const i = super.addPoint(e, t, n)
          if (i) {
            const e = this._calculateControlPoints(),
              t = this._model.mainSeries().interval()
            ;(this._controlPoints = null),
              this._points.push({ ...e[0], interval: t }),
              this._points.push({ ...e[1], interval: t }),
              n || (this._normalizePoints(), this.createServerPoints()),
              this._createPointProperty(2),
              this._createPointProperty(3)
          }
          return i
        }
        restorePoints(e, t, n) {
          super.restorePoints(e, t, n),
            this._createPointProperty(2),
            this._createPointProperty(3)
        }
        controlPoints() {
          return this._controlPoints
        }
        static createProperties(e, t) {
          const n = new o.DefaultProperty({
            defaultName: 'linetoolbeziercubic',
            state: t,
            theme: e,
          })
          return this._configureProperties(n), n
        }
        async _getPropertyDefinitionsViewModelClass() {
          return s.GeneralBezierDefinitionsViewModel
        }
        _calculateControlPoints() {
          const e = (0, i.ensureNotNull)(
              this.pointToScreenPoint(this.points()[0]),
            ),
            t = (0, i.ensureNotNull)(this.pointToScreenPoint(this.points()[1])),
            n = t.subtract(e).scaled(0.5).transposed().scaled(0.3),
            o = e.add(t).scaled(0.33),
            r = e.add(t).scaled(0.67),
            s = o.add(n),
            a = r.subtract(n)
          return [
            (0, i.ensureNotNull)(this.screenPointToPoint(s)),
            (0, i.ensureNotNull)(this.screenPointToPoint(a)),
          ]
        }
      }
    },
    35246: (e, t, n) => {
      n.r(t), n.d(t, { BezierQuadroPaneView: () => c, cacheIsValid: () => d })
      var i = n(50151),
        o = n(19063),
        r = n(27916),
        s = n(95201),
        a = n(66825),
        l = n(6298)
      function d(e, t, n, i, o, r) {
        return (
          null !== e &&
          e.p1.x === t.x &&
          e.p1.y === t.y &&
          e.p2.x === n.x &&
          e.p2.y === n.y &&
          e.p3.x === i.x &&
          e.p3.y === i.y &&
          e.width === o &&
          e.height === r
        )
      }
      class c extends r.LineSourcePaneView {
        constructor() {
          super(...arguments),
            (this._bezierQuadroRenderer = new l.BezierQuadroRenderer()),
            (this._renderer = null),
            (this._extendedSegmentLeftCache = null),
            (this._extendedSegmentRightCache = null)
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
          const t = this._source.properties().childs()
          let n = [],
            r = []
          if (3 === this._source.points().length) {
            const o = (0, i.ensureNotNull)(
                this._source.pointToScreenPoint(this._source.points()[0]),
              ),
              s = (0, i.ensureNotNull)(
                this._source.pointToScreenPoint(this._source.points()[1]),
              ),
              a = (0, i.ensureNotNull)(
                this._source.pointToScreenPoint(this._source.points()[2]),
              ),
              l = s.subtract(o),
              d = a.subtract(l.scaled(0.25)),
              c = a.add(l.scaled(0.25)),
              {
                mediaSize: { width: h, height: u },
              } = e
            t.extendLeft.value() &&
              (n = this._extendSegmentLeft(a, o, d, h, u)),
              t.extendRight.value() &&
                (r = this._extendSegmentRight(a, s, c, h, u))
          }
          const a = this._points.slice(),
            l = this._source.controlPoint()
          null !== l &&
            a.push((0, i.ensureNotNull)(this._source.pointToScreenPoint(l)))
          const d = {
            points: a,
            color: t.linecolor.value(),
            lineWidth: t.linewidth.value(),
            lineStyle: t.linestyle.value(),
            leftEnd: t.leftEnd.value(),
            rightEnd: t.rightEnd.value(),
            fillBack: t.fillBackground.value(),
            backColor: (0, o.generateColor)(
              t.backgroundColor.value(),
              t.transparency.value(),
            ),
            extendLeftSegments: n,
            extendRightSegments: r,
          }
          this._bezierQuadroRenderer.setData(d)
          const c = new s.CompositeRenderer()
          c.append(this._bezierQuadroRenderer),
            this.addAnchors(c),
            (this._renderer = c)
        }
        _extendSegmentLeft(e, t, n, o, r) {
          return (
            d(this._extendedSegmentLeftCache, e, t, n, o, r) ||
              (this._extendedSegmentLeftCache = {
                p1: e,
                p2: t,
                p3: n,
                width: o,
                height: r,
                segment: (0, a.extendQuadroBezier)(e, t, n, o, r),
              }),
            (0, i.ensureNotNull)(this._extendedSegmentLeftCache).segment
          )
        }
        _extendSegmentRight(e, t, n, o, r) {
          return (
            d(this._extendedSegmentRightCache, e, t, n, o, r) ||
              (this._extendedSegmentRightCache = {
                p1: e,
                p2: t,
                p3: n,
                width: o,
                height: r,
                segment: (0, a.extendQuadroBezier)(e, t, n, o, r),
              }),
            (0, i.ensureNotNull)(this._extendedSegmentRightCache).segment
          )
        }
      }
    },
    6298: (e, t, n) => {
      n.d(t, {
        BezierQuadroRenderer: () => g,
        buildExtendedSegments: () => p,
        hitTestExtendedPoints: () => u,
      })
      var i = n(4652),
        o = n(75919),
        r = n(49857),
        s = n(56468),
        a = n(64034),
        l = n(66825),
        d = n(91046),
        c = n(61993),
        h = n(37743)
      function u(e, t, n) {
        for (const o of n)
          for (let n = 1; n < o.length; n++) {
            const r = o[n - 1],
              a = o[n]
            if ((0, i.distanceToSegment)(r, a, e).distance < t)
              return new s.HitTestResult(s.HitTarget.MovePoint)
          }
        return null
      }
      function p(e, t) {
        for (let n = 0; n < t.length; n++) {
          const i = t[n],
            o = i[0]
          e.moveTo(o.x, o.y)
          for (let t = 1; t < i.length; t++) {
            const n = i[t]
            e.lineTo(n.x, n.y)
          }
        }
      }
      class g extends o.MediaCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = e || null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null !== this._data && 3 === this._data.points.length) {
            const t = (0, c.interactionTolerance)().curve,
              [n, i, o] = this._data.points,
              r = i.subtract(n),
              a = o.subtract(r.scaled(0.25)),
              d = o.add(r.scaled(0.25))
            if (
              (0, l.quadroBezierHitTest)(o, n, a, e, t) ||
              (0, l.quadroBezierHitTest)(o, i, d, e, t)
            )
              return new s.HitTestResult(s.HitTarget.MovePoint)
            let h = u(e, t, this._data.extendLeftSegments)
            return (
              null === h && (h = u(e, t, this._data.extendRightSegments)), h
            )
          }
          return null
        }
        _drawImpl(e) {
          if (null === this._data) return
          const [t, n, i] = this._data.points,
            o = e.context
          if (
            ((o.lineCap = 'round'),
            (o.strokeStyle = this._data.color),
            (o.lineWidth = this._data.lineWidth),
            (0, h.setLineStyle)(o, this._data.lineStyle),
            2 === this._data.points.length)
          )
            o.beginPath(), o.moveTo(t.x, t.y), o.lineTo(n.x, n.y), o.stroke()
          else {
            const e = n.subtract(t),
              s = i.subtract(e.scaled(0.25)),
              l = i.add(e.scaled(0.25))
            this._data.fillBack &&
              this._data.points.length > 2 &&
              ((o.fillStyle = this._data.backColor),
              o.beginPath(),
              o.moveTo(t.x, t.y),
              o.quadraticCurveTo(s.x, s.y, i.x, i.y),
              o.quadraticCurveTo(l.x, l.y, n.x, n.y),
              o.fill()),
              o.beginPath(),
              p(o, this._data.extendLeftSegments),
              o.moveTo(t.x, t.y),
              o.quadraticCurveTo(s.x, s.y, i.x, i.y),
              o.quadraticCurveTo(l.x, l.y, n.x, n.y),
              p(o, this._data.extendRightSegments),
              this._data.leftEnd === r.LineEnd.Arrow &&
                (0, d.drawArrow)(s, t, o, o.lineWidth, a.dpr1PixelRatioInfo),
              this._data.rightEnd === r.LineEnd.Arrow &&
                (0, d.drawArrow)(l, n, o, o.lineWidth, a.dpr1PixelRatioInfo),
              o.stroke()
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
        d = n(72791),
        c = n(17330)
      const h = i.colorsPalette['color-tv-blue-600']
      var u
      function p(e, t) {
        const n = t.x - e.x,
          i = t.y - e.y,
          o = Math.abs(Math.atan2(n, i))
        return o > Math.PI / 4 && o < (3 * Math.PI) / 4
          ? d.PaneCursorType.VerticalResize
          : d.PaneCursorType.HorizontalResize
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
            (0, c.needTextExclusionPath)(e)
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
    66825: (e, t, n) => {
      n.d(t, {
        cubicBezierHitTest: () => l,
        extendQuadroBezier: () => d,
        quadroBezierHitTest: () => s,
      })
      var i,
        o = n(4652),
        r = n(9859)
      function s(e, t, n, i, r) {
        const s = n.subtract(e).length() + n.subtract(t).length(),
          a = Math.max(3 / s, 0.02)
        let l
        for (let s = 0; ; s += a) {
          s > 1 && (s = 1)
          const a = e.scaled((1 - s) * (1 - s)),
            d = n.scaled(2 * s * (1 - s)),
            c = t.scaled(s * s),
            h = a.add(d).add(c)
          if (void 0 !== l) {
            if ((0, o.distanceToSegment)(h, l, i).distance < r) return !0
          } else if (h.subtract(i).length() < r) return !0
          if (((l = h), 1 === s)) break
        }
        return !1
      }
      function a(e, t, n, i, o) {
        o = (0, r.clamp)(o, 0, 1)
        const s = e.scaled((1 - o) * (1 - o) * (1 - o)),
          a = t.scaled(3 * (1 - o) * (1 - o) * o),
          l = n.scaled(3 * (1 - o) * o * o),
          d = i.scaled(o * o * o)
        return s.add(a).add(l).add(d)
      }
      function l(e, t, n, i, r, s) {
        const l =
            t.subtract(e).length() +
            n.subtract(t).length() +
            i.subtract(n).length(),
          d = Math.max(3 / l, 0.02)
        let c
        for (let l = 0; ; l += d) {
          const d = a(e, t, n, i, l)
          if (void 0 !== c) {
            if ((0, o.distanceToSegment)(d, c, r).distance < s) return !0
          } else if (d.subtract(r).length() < s) return !0
          if (((c = d), l >= 1)) break
        }
        return !1
      }
      function d(e, t, n, i, o) {
        const r = n.subtract(e).length() + n.subtract(t).length()
        if (!r) return []
        const s = ((e, t, n, i, o) => {
          const r = [],
            s = c(e.y, t.y, n.y, 0).concat(c(e.y, t.y, n.y, o))
          for (let o = 0; o < s.length; o++) {
            const a = h(e.x, t.x, n.x, s[o])
            a >= 0 && a <= i && r.push(s[o])
          }
          const a = c(e.x, t.x, n.x, 0).concat(c(e.x, t.x, n.x, i))
          for (let i = 0; i < a.length; i++) {
            const s = h(e.y, t.y, n.y, a[i])
            s >= 0 && s <= o && r.push(a[i])
          }
          return r
        })(e, t, n, i, o)
          .filter((e) => e > 1)
          .sort((e, t) => e - t)
        t.x >= 0 && t.x <= i && t.y >= 0 && t.y <= o && s.unshift(1)
        const a = 3 / r,
          l = []
        for (let i = 0; i < s.length - 1; i += 2) {
          let o = a,
            r = s[i],
            d = s[i + 1] + o
          const c = []
          while (r <= d) {
            const i = e.scaled((1 - r) * (1 - r)),
              s = n.scaled(2 * r * (1 - r)),
              a = t.scaled(r * r),
              l = i.add(s).add(a)
            if (c.length > 0) {
              c[c.length - 1].subtract(l).length() < 2 && ((d += o), (o *= 2))
            }
            c.push(l), (r += o)
          }
          c.length > 0 && l.push(c)
        }
        return l
      }
      function c(e, t, n, i) {
        const o = [],
          r = e - 2 * n + t,
          s = 2 * n - 2 * e,
          a = e - i
        if (Math.abs(r) > 1e-8) {
          const e = s * s - 4 * r * a
          e >= 0 &&
            (o.push((-s + Math.sqrt(e)) / (2 * r)),
            o.push((-s - Math.sqrt(e)) / (2 * r)))
        } else o.push(-a / s)
        return o
      }
      function h(e, t, n, i) {
        return (1 - i) * (1 - i) * e + 2 * (1 - i) * i * n + i * i * t
      }
      !((e) => {
        e[(e.MaxHitTestSegments = 50)] = 'MaxHitTestSegments'
      })(i || (i = {}))
    },
    36036: (e, t, n) => {
      n.d(t, {
        LineAnchorRenderer: () => x,
        lineSourcePaneViewPointToLineAnchorPoint: () => m,
        mapLineSourcePaneViewPointToLineAnchorPoint: () => P,
      })
      var i = n(86441),
        o = n(34026),
        r = n(50151),
        s = n(37743),
        a = n(37265),
        l = n(56468),
        d = n(72791),
        c = n(61993),
        h = n(30125)
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
      function f(e, t, n, i) {
        const { point: o } = t
        e.beginPath(),
          e.arc(o.x, o.y, n - i / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = i),
          e.fill(),
          e.stroke()
      }
      class x extends h.BitmapCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = e ?? null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data || this._data.disableInteractions) return null
          const { radius: t, points: n } = this._data,
            i = t + (0, c.interactionTolerance)().anchor
          for (const t of n) {
            if (t.point.subtract(e).length() <= i)
              return new l.HitTestResult(
                t.hitTarget ?? l.HitTarget.ChangePoint,
                {
                  areaName: l.AreaName.AnchorPoint,
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
          t.length && this._drawPoints(e, t, n, g, p),
            i.length && this._drawPoints(e, i, o, f, _)
        }
        _drawPoints(e, t, n, o, s) {
          const {
              context: l,
              horizontalPixelRatio: d,
              verticalPixelRatio: c,
            } = e,
            h = (0, r.ensureNotNull)(this._data),
            u = h.radius
          let p = Math.max(1, Math.floor((h.strokeWidth || 2) * d))
          h.selected && (p += Math.max(1, Math.floor(d / 2)))
          const g = Math.max(1, Math.floor(d))
          let _ = Math.round(u * d * 2)
          _ % 2 != g % 2 && (_ += 1)
          const f = (g % 2) / 2
          l.strokeStyle = h.color
          for (let e = 0; e < t.length; ++e) {
            const r = t[e]
            if (
              !(
                (0, a.isInteger)(r.pointIndex) &&
                h.linePointBeingEdited === r.pointIndex
              )
            ) {
              l.fillStyle = n[e]
              if (
                (o(
                  l,
                  {
                    ...r,
                    point: new i.Point(
                      Math.round(r.point.x * d) + f,
                      Math.round(r.point.y * c) + f,
                    ),
                  },
                  _ / 2,
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
                  t % 2 != g % 2 && (t += 1)
                  s(
                    l,
                    {
                      ...r,
                      point: new i.Point(
                        Math.round(r.point.x * d) + f,
                        Math.round(r.point.y * c) + f,
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
      function m(e, t = e.pointIndex, n, i, o, r, s, a, l, d) {
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
          possibleMovingDirections: d,
        }
      }
      function P(e) {
        return m(e)
      }
    },
  },
])
