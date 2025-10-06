;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8061],
  {
    28904: (e, t, n) => {
      n.r(t), n.d(t, { LineToolBezierQuadro: () => s })
      var r = n(50151),
        o = n(32679),
        i = n(29875)
      class s extends i.LineDataSource {
        constructor(e, t, r, o) {
          super(
            e,
            t ?? s.createProperties(e.backgroundTheme().spawnOwnership()),
            r,
            o,
          ),
            (this._controlPoint = null),
            Promise.all([n.e(6290), n.e(9116), n.e(1200), n.e(1583)])
              .then(n.bind(n, 35246))
              .then((t) => {
                this._setPaneViews([new t.BezierQuadroPaneView(this, e)])
              })
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Curve'
        }
        normalizedPointsForCreating() {
          const e = super.normalizedPointsForCreating()
          return [e[0], e[e.length - 1]]
        }
        setLastPoint(e, t) {
          const n = super.setLastPoint(e, t)
          return (this._controlPoint = this._calculateControlPoint()), n
        }
        addPoint(e, t, n) {
          const r = super.addPoint(e, t, n)
          if (r) {
            const e = this._calculateControlPoint()
            this._points.push({
              ...e,
              interval: this._model.mainSeries().interval(),
            }),
              (this._controlPoint = null),
              n || (this._normalizePoints(), this.createServerPoints()),
              this._createPointProperty(2)
          }
          return r
        }
        restorePoints(e, t, n) {
          super.restorePoints(e, t, n), this._createPointProperty(2)
        }
        controlPoint() {
          return this._controlPoint
        }
        static createProperties(e, t) {
          const n = new o.DefaultProperty({
            defaultName: 'linetoolbezierquadro',
            state: t,
            theme: e,
          })
          return this._configureProperties(n), n
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            n.e(6406),
            n.e(3889),
            n.e(8009),
            n.e(8056),
            n.e(8537),
          ])
            .then(n.bind(n, 86622))
            .then((e) => e.GeneralBezierDefinitionsViewModel)
        }
        _calculateControlPoint() {
          const e = (0, r.ensureNotNull)(
              this.pointToScreenPoint(this.points()[0]),
            ),
            t = (0, r.ensureNotNull)(this.pointToScreenPoint(this.points()[1])),
            n = t.subtract(e).scaled(0.5).transposed().scaled(0.3),
            o = e.add(t).scaled(0.5).add(n)
          return (0, r.ensureNotNull)(this.screenPointToPoint(o))
        }
      }
    },
  },
])
