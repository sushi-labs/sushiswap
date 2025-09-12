;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3866],
  {
    51691: (e, i, t) => {
      t.r(i), t.d(i, { LineToolPolyline: () => h })
      var n = t(50151),
        s = t(86441),
        o = t(32679),
        r = t(61993),
        l = t(29875),
        a = t(64147)
      class h extends l.LineDataSource {
        constructor(e, i, n, s) {
          super(
            e,
            i ?? h.createProperties(e.backgroundTheme().spawnOwnership()),
            n,
            s,
          ),
            (this._hasEditableCoordinates = new a.WatchedValue(!1)),
            (this._finished = !1),
            Promise.all([t.e(6290), t.e(9116), t.e(1200), t.e(1583)])
              .then(t.bind(t, 65765))
              .then((i) => {
                this._setPaneViews([new i.PolylinePaneView(this, e)])
              })
        }
        pointsCount() {
          return -1
        }
        name() {
          return 'Polyline'
        }
        finish() {
          ;(this._finished = !0),
            (this._lastPoint = null),
            this._normalizePoints(),
            this.createServerPoints()
        }
        addPoint(e, i, t, o) {
          if (this._finished) return !0
          const l = (0, n.ensureNotNull)(this.priceScale()),
            a = this._model.timeScale().indexToCoordinate(e.index),
            h = e.price,
            c = (0, n.ensure)(this.ownerSource()?.firstValue()),
            d = l.priceToCoordinate(h, c),
            p = (0, r.interactionTolerance)().minDistanceBetweenPoints
          if (this._points.length > 0) {
            const e = this._points[this._points.length - 1],
              t = this._model.timeScale().indexToCoordinate(e.index),
              n = e.price,
              r = l.priceToCoordinate(n, c),
              h = new s.Point(a, d).subtract(new s.Point(t, r)).length()
            if (!i?.isApiEvent() && h < p && !o)
              return (
                (this._lastPoint = null),
                this._normalizePoints(),
                this.createServerPoints(),
                !0
              )
            const u = this._points[0],
              P = this._model.timeScale().indexToCoordinate(u.index),
              _ = l.priceToCoordinate(u.price, c),
              m = new s.Point(a, d).subtract(new s.Point(P, _)).length()
            if (!i?.isApiEvent() && m < p && !o)
              return (
                this.properties().childs().filled.setValue(!0),
                (this._lastPoint = null),
                this._normalizePoints(),
                this.createServerPoints(),
                !0
              )
          }
          return super.addPoint(e, i, t)
        }
        setPoint(e, i, t) {
          super.setPoint(e, i, t)
          const o = this.priceScale()
          if (
            !(
              this._model.timeScale().isEmpty() ||
              null === o ||
              o.isEmpty() ||
              (e !== this._points.length - 1 && 0 !== e)
            )
          ) {
            const t = (0, n.ensure)(this.ownerSource()?.firstValue()),
              l = this._model.timeScale().indexToCoordinate(i.index),
              a = o.priceToCoordinate(i.price, t),
              h =
                e === this._points.length - 1
                  ? this._points[0]
                  : this._points[this._points.length - 1],
              c = this._model.timeScale().indexToCoordinate(h.index),
              d = o.priceToCoordinate(h.price, t)
            new s.Point(l, a).subtract(new s.Point(c, d)).length() <
              (0, r.interactionTolerance)().minDistanceBetweenPoints &&
              this.properties().childs().filled.setValue(!0)
          }
        }
        static createProperties(e, i) {
          const t = new o.DefaultProperty({
            defaultName: 'linetoolpolyline',
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
            .then(t.bind(t, 16963))
            .then((e) => e.PolylinesDefinitionsViewModel)
        }
        static _configureProperties(e) {
          super._configureProperties(e), e.addExcludedKey('filled', 1)
        }
      }
    },
  },
])
