;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9534],
  {
    27442: (t, e, i) => {
      var s, r
      i.d(e, { AlertStatus: () => s, Direction: () => r }),
        ((t) => {
          ;(t[(t.Waiting = 0)] = 'Waiting'),
            (t[(t.Success = 1)] = 'Success'),
            (t[(t.Failure = 2)] = 'Failure')
        })(s || (s = {})),
        ((t) => {
          ;(t[(t.Up = 1)] = 'Up'), (t[(t.Down = 2)] = 'Down')
        })(r || (r = {}))
    },
    29356: (t, e, i) => {
      i.r(e), i.d(e, { LineToolPrediction: () => u })
      var s = i(50151),
        r = i(32679),
        n = i(12988),
        a = i(29875),
        o = i(27442)
      class u extends a.LineDataSource {
        constructor(t, e, s, r) {
          super(
            t,
            e ?? u.createProperties(t.backgroundTheme().spawnOwnership()),
            s,
            r,
          ),
            (this._predictionPaneView = null)
          const n = this._model.mainSeries()
          n
            .properties()
            .childs()
            .interval.subscribe(this, () => {
              this.setStatus(o.AlertStatus.Waiting)
            }),
            n
              .dataEvents()
              .dataUpdated()
              .subscribe(this, this.recalculateStateByData),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 75872))
              .then((e) => {
                ;(this._predictionPaneView = new e.PredictionPaneView(this, t)),
                  this._setPaneViews([this._predictionPaneView])
              })
        }
        destroy() {
          const t = this._model.mainSeries()
          t.properties().childs().interval.unsubscribeAll(this),
            t.dataEvents().dataUpdated().unsubscribeAll(this),
            super.destroy()
        }
        dataAndViewsReady() {
          return (
            super.dataAndViewsReady() &&
            Boolean(
              this._predictionPaneView && this._predictionPaneView.iconsReady(),
            )
          )
        }
        cloneable() {
          return !1
        }
        isSynchronizable() {
          return !1
        }
        status() {
          return this._properties.childs().status.value()
        }
        setStatus(t) {
          return this._properties.childs().status.setValue(t)
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Forecast'
        }
        restorePoints(t, e, i) {
          super.restorePoints(t, e, i), this.recalculateStateByData()
        }
        recalculateStateByData() {
          if (this.isSourceHidden()) return
          if (this._points.length < 2) return
          if (this._model.mainSeries().bars().isEmpty()) return
          const t = this._points[1]
          if (this.status())
            return void (
              t.index > this._model.timeScale().baseIndex() &&
              this.setStatus(o.AlertStatus.Waiting)
            )
          const e = this._model.mainSeries().bars().valueAt(t.index)
          if (null === e) return
          const i = this.direction()
          if (i === o.Direction.Up && (0, s.ensure)(e[2]) >= t.price)
            this.setStatus(o.AlertStatus.Success)
          else if (i === o.Direction.Down && (0, s.ensure)(e[3]) <= t.price)
            this.setStatus(o.AlertStatus.Success)
          else {
            const e = (0, s.ensureNotNull)(
              this._model.mainSeries().bars().lastIndex(),
            )
            t.index !== e && this.setStatus(o.AlertStatus.Failure)
          }
        }
        addPoint(t, e, i) {
          const s = super.addPoint(t, e, i)
          return s && this.recalculateStateByData(), s
        }
        endChanging(t, e) {
          const i = super.endChanging(t, e)
          return (
            this.setStatus(o.AlertStatus.Waiting),
            this.recalculateStateByData(),
            i
          )
        }
        onData(t) {
          super.onData(t), this.recalculateStateByData()
        }
        endMoving(t, e, i) {
          const s = super.endMoving(t, e, i)
          return (
            this.setStatus(o.AlertStatus.Waiting),
            this.recalculateStateByData(),
            s
          )
        }
        direction() {
          if (this._points.length < 2) return o.Direction.Up
          const t = this._points[0]
          return this._points[1].price > t.price
            ? o.Direction.Up
            : o.Direction.Down
        }
        static createProperties(t, e) {
          const i = new r.DefaultProperty({
            defaultName: 'linetoolprediction',
            state: e,
            theme: t,
          })
          return this._configureProperties(i), i
        }
        _ignoreSourceEvent(t) {
          return (
            super._ignoreSourceEvent(t) &&
            t.sourceId !== this._model.mainSeries().id()
          )
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            i.e(6406),
            i.e(3889),
            i.e(8009),
            i.e(8056),
            i.e(8537),
          ])
            .then(i.bind(i, 26486))
            .then((t) => t.PredictionDefinitionsViewModel)
        }
        static _configureProperties(t) {
          super._configureProperties(t),
            t.hasChild('status') ||
              t.addChild('status', new n.Property(o.AlertStatus.Waiting))
        }
      }
    },
  },
])
