;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [961],
  {
    14150: (e, i, t) => {
      t.r(i), t.d(i, { LineToolPath: () => d })
      var n = t(50151),
        s = t(86441),
        r = t(32679),
        o = t(61993),
        a = t(29875),
        h = t(73305),
        l = t(64147)
      class d extends a.LineDataSource {
        constructor(e, i, n, s) {
          super(
            e,
            i ?? d.createProperties(e.backgroundTheme().spawnOwnership()),
            n,
            s,
          ),
            (this._hasEditableCoordinates = new l.WatchedValue(!1)),
            (this._finished = !1),
            Promise.all([t.e(6290), t.e(9116), t.e(1200), t.e(1583)])
              .then(t.bind(t, 99035))
              .then((i) => {
                this._setPaneViews([new i.PathPaneView(this, e)])
              })
        }
        pointsCount() {
          return -1
        }
        name() {
          return 'Path'
        }
        finish() {
          ;(this._finished = !0),
            (this._lastPoint = null),
            this._normalizePoints(),
            this.createServerPoints()
        }
        addPoint(e, i, t, r) {
          if (this._finished) return !0
          const a = (0, n.ensureNotNull)(this.priceScale()),
            h = this._model.timeScale().indexToCoordinate(e.index),
            l = e.price,
            d = (0, n.ensure)(this.ownerSource()?.firstValue()),
            c = a.priceToCoordinate(l, d)
          if (this._points.length > 0) {
            const e = this._points[this._points.length - 1],
              t = this._model.timeScale().indexToCoordinate(e.index),
              n = e.price,
              l = a.priceToCoordinate(n, d),
              u = new s.Point(h, c).subtract(new s.Point(t, l)).length()
            if (
              !i?.isApiEvent() &&
              u < (0, o.interactionTolerance)().minDistanceBetweenPoints &&
              !r
            )
              return (
                (this._lastPoint = null),
                this._normalizePoints(),
                this.createServerPoints(),
                !0
              )
          }
          return super.addPoint(e, i, t)
        }
        static createProperties(e, i) {
          const t = new r.DefaultProperty({
            defaultName: 'linetoolpath',
            state: i,
            theme: e,
          })
          return this._configureProperties(t), t
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            t.e(6406),
            t.e(3889),
            t.e(8009),
            t.e(8056),
            t.e(8537),
          ])
            .then(t.bind(t, 39878))
            .then((e) => e.PathDefinitionsViewModel)
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.addChild(
              'linesWidths',
              new h.LineToolWidthsProperty([
                (0, n.ensureDefined)(e.child('lineWidth')),
              ]),
            ),
            e.addChild(
              'linesColors',
              new h.LineToolColorsProperty([e.childs().lineColor]),
            )
        }
      }
    },
  },
])
