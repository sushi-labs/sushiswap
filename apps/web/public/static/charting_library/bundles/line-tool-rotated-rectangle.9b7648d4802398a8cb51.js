;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4015],
  {
    23550: (e, t, n) => {
      n.r(t), n.d(t, { LineToolRotatedRectangle: () => c })
      var i = n(86441),
        s = n(4652),
        o = n(50151),
        r = n(29875),
        a = n(32679),
        l = n(73305),
        u = n(64147)
      class c extends r.LineDataSource {
        constructor(e, t, i, s) {
          super(
            e,
            t ?? c.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            s,
          ),
            (this._hasEditableCoordinates = new u.WatchedValue(!1)),
            (this._distance = null),
            Promise.all([n.e(6290), n.e(9116), n.e(1200), n.e(1583)])
              .then(n.bind(n, 78270))
              .then(({ RotatedRectanglePaneView: e }) => {
                this._setPaneViews([new e(this, this._model)])
              })
        }
        startChanging(e, t) {
          if ((super.startChanging(e, t), 0 === e || 1 === e)) {
            const e = this._points,
              t = (0, o.ensureNotNull)(this.pointToScreenPoint(e[0])),
              n = (0, o.ensureNotNull)(this.pointToScreenPoint(e[1])),
              i = (0, o.ensureNotNull)(this.pointToScreenPoint(e[2]))
            this._distance = (0, s.distanceToLine)(t, n, i).distance
          }
        }
        setPoint(e, t, n, s) {
          if ((super.setPoint(e, t, n), 0 === e || 1 === e)) {
            const e = this._points,
              t = (0, o.ensureNotNull)(this.pointToScreenPoint(e[0])),
              n = (0, o.ensureNotNull)(this.pointToScreenPoint(e[1])).subtract(
                t,
              ),
              s = new i.Point(n.y, -n.x)
                .normalized()
                .scaled((0, o.ensureNotNull)(this._distance)),
              r = t.add(s),
              a = (0, o.ensureNotNull)(this.screenPointToPoint(r)),
              l = this._model.mainSeries().interval()
            this._points[2] = { ...a, interval: l }
          }
        }
        endChanging(e, t, n) {
          return (this._distance = null), super.endChanging(e, t)
        }
        pointsCount() {
          return 3
        }
        name() {
          return 'Rotated Rectangle'
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              n.e(6406),
              n.e(3889),
              n.e(8009),
              n.e(8056),
              n.e(8537),
            ]).then(n.bind(n, 90490))
          ).GeneralFiguresDefinitionsViewModelBase
        }
        snapTo45DegreesAvailable() {
          return !0
        }
        static createProperties(e, t) {
          const n = new a.DefaultProperty({
            defaultName: 'linetoolrotatedrectangle',
            state: t,
            theme: e,
          })
          return this._configureProperties(n), n
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.addChild(
              'linesColors',
              new l.LineToolColorsProperty([e.childs().color]),
            )
        }
      }
    },
  },
])
