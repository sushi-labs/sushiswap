;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7563],
  {
    37968: (e, t, s) => {
      s.r(t), s.d(t, { LineToolGhostFeed: () => l })
      var i = s(32679),
        r = s(29875),
        n = s(50151),
        a = s(37265)
      class o {
        constructor(e, t, s) {
          ;(this._source = e), (this._segmentIndex = t), (this._bars = s ?? [])
        }
        setBars(e) {
          this._bars = e
        }
        clone(e) {
          return new o(e, this._segmentIndex, (0, a.clone)(this._bars))
        }
        generate() {
          this._bars = []
          const e = this._source.points(),
            t = e[this._segmentIndex],
            s = e[this._segmentIndex + 1]
          if (!t || !s || t.index === s.index) return
          const i = this._segmentIndex ? t.index + 1 : t.index,
            r = Math.sign(s.index - t.index)
          for (let e = i; e !== s.index; e += r)
            this._bars.push(this._createBar())
        }
        bars() {
          return this._bars
        }
        setSize(e) {
          if (e < this._bars.length) this._bars.splice(e, this._bars.length - e)
          else while (this._bars.length < e) this._bars.push(this._createBar())
        }
        _createBar() {
          const e = this._source.properties().averageHL.value(),
            t = this._source.properties().variance.value() / 100,
            s = (0, n.ensureNotNull)(this._source.ownerSource()).base()
          let i = Math.random()
          const r = e * (1 - 2 * i) * t
          i = Math.random()
          const a = e * (1 + (0.5 - i) * t),
            o = r - a / 2,
            h = o + a
          return {
            o: (o + Math.random() * a) / s,
            h: h / s,
            l: o / s,
            c: (o + Math.random() * a) / s,
          }
        }
      }
      var h = s(44672)
      class l extends r.LineDataSource {
        constructor(e, t, i, r) {
          const n =
            t ?? l.createProperties(e.backgroundTheme().spawnOwnership())
          if (
            (super(e, n, i, r),
            (this._segments = []),
            (this._finished = !1),
            (this._segmentsPixelsWhileMoving = null),
            !i)
          ) {
            const e = Math.round(this._calculateATR())
            n.childs().averageHL.setValue(e)
          }
          n.childs().averageHL.subscribe(this, this._regenerate),
            n.childs().variance.subscribe(this, this._regenerate),
            (this._currentAverageHL = n.childs().averageHL.value()),
            (this._currentVariance = n.childs().variance.value()),
            (this._currentInterval = e.mainSeries().interval()),
            this.properties()
              .onRestoreFactoryDefaults()
              .subscribe(this, this._handleRestoringFactoryDefaults),
            Promise.all([s.e(6290), s.e(9116), s.e(1200), s.e(1583)])
              .then(s.bind(s, 14049))
              .then((t) => {
                this._setPaneViews([new t.GhostFeedPaneView(this, e)])
              })
        }
        isSynchronizable() {
          return !1
        }
        destroy() {
          this.properties()
            .onRestoreFactoryDefaults()
            .unsubscribe(this, this._handleRestoringFactoryDefaults),
            super.destroy()
        }
        propertiesChanged() {
          super.propertiesChanged(),
            (this._currentAverageHL ===
              this.properties().childs().averageHL.value() &&
              this._currentVariance ===
                this.properties().childs().variance.value()) ||
              this._regenerate()
        }
        pointsCount() {
          return -1
        }
        name() {
          return 'Ghost Feed'
        }
        segmentBars(e) {
          return this._segments[e].bars()
        }
        segments() {
          return this._segments
        }
        generateBars(e) {
          this._segments.length <= e && this._segments.push(new o(this, e)),
            this._segments[e].generate()
        }
        addPoint(e, t, s) {
          if (this._finished) return !0
          if (this._points.length > 0) {
            const s = this._points[this._points.length - 1]
            if (!t?.isApiEvent() && s.index === e.index) {
              ;(this._lastPoint = null),
                this._normalizePoints(),
                this.createServerPoints()
              for (let e = 0; e < this._points.length; e++)
                this._createPointProperty(e)
              return !0
            }
          }
          const i = super.addPoint(e, t, s)
          return (
            this._points.length > 1 &&
              this.generateBars(this._points.length - 2),
            i
          )
        }
        finish() {
          ;(this._finished = !0),
            (this._lastPoint = null),
            this._normalizePoints(),
            this.createServerPoints()
        }
        setPoint(e, t, s, i) {
          if ((super.setPoint(e, t, s), e > 0)) {
            const s = this.points()[e - 1],
              i = t.index - s.index
            this._segments[e - 1].setSize(Math.abs(i))
          }
          if (e < this.points().length - 1) {
            const s = this.points()[e + 1].index - t.index
            this._segments[e].setSize(Math.abs(s))
          }
        }
        state(e) {
          const t = super.state(e)
          return (
            (t.segments = this._segments.map((e) => ({ bars: [...e.bars()] }))),
            t
          )
        }
        restoreData(e) {
          e.segments &&
            (this._segments = e.segments.map((e, t) => new o(this, t, e.bars))),
            (this._currentAverageHL = this.properties()
              .childs()
              .averageHL.value()),
            (this._currentVariance = this.properties()
              .childs()
              .variance.value())
        }
        onData(e) {
          super.onData(e)
          if (!this.pointsProperty().childs().points.child('0'))
            for (let e = 0; e < this._points.length; e++)
              this._createPointProperty(e)
          this._currentInterval !== this._model.mainSeries().interval() &&
            (this._regenerate(),
            (this._currentInterval = this._model.mainSeries().interval()))
        }
        cloneData(e) {
          this._segments = e._segments.map((e) => e.clone(this))
        }
        startMoving(e, t, s, i) {
          super.startMoving(e, t, s, i), this._preparePixelSegments()
        }
        move(e, t, s, i) {
          super.move(e, t, s, i), this._restoreSegmentsFromPixels()
        }
        endMoving(e, t) {
          return (this._segmentsPixelsWhileMoving = null), super.endMoving(e, t)
        }
        static createProperties(e, t) {
          const s = new i.DefaultProperty({
            defaultName: 'linetoolghostfeed',
            state: t,
            theme: e,
          })
          return this._configureProperties(s), s
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              s.e(6406),
              s.e(3889),
              s.e(8009),
              s.e(8056),
              s.e(8537),
            ]).then(s.bind(s, 9786))
          ).GhostFeedDefinitionsViewModel
        }
        _handleRestoringFactoryDefaults() {
          const e = Math.round(this._calculateATR())
          this.properties().childs().averageHL.setValue(e)
        }
        _regenerate() {
          ;(this._currentAverageHL = this.properties()
            .childs()
            .averageHL.value()),
            (this._currentVariance = this.properties()
              .childs()
              .variance.value()),
            this._segments.forEach((e) => e.generate()),
            this.updateAllViews((0, h.sourceChangeEvent)(this.id())),
            this._model.updateSource(this)
        }
        _calculateATR() {
          const e = this._model.mainSeries(),
            t = []
          e.bars().each((e, s) => {
            const i = s[2],
              r = s[3]
            return null != i && null != r && t.push(i - r), !1
          })
          let s = 0 === t.length ? 0 : t.reduce((e, t) => e + t, 0) / t.length
          return (s *= e.base()), s
        }
        _preparePixelSegments() {
          const e = this.priceScale(),
            t = this.ownerSource()?.firstValue() ?? null
          if (null === e || null === t || e.isEmpty() || !e.isLog()) return
          const s = this.points()
          this._segmentsPixelsWhileMoving = this._segments.map((i, r) => {
            const n = s[r].price,
              a = s[r + 1].price,
              o = e.priceToCoordinate(n, t),
              h = (e.priceToCoordinate(a, t) - o) / (i.bars().length - 1)
            return {
              bars: i.bars().map((s, i) => {
                const r = o + i * h,
                  n = e.coordinateToPrice(r, t)
                return {
                  open: e.priceToCoordinate(n + s.o, t) - r,
                  high: e.priceToCoordinate(n + s.h, t) - r,
                  low: e.priceToCoordinate(n + s.l, t) - r,
                  close: e.priceToCoordinate(n + s.c, t) - r,
                }
              }),
            }
          })
        }
        _restoreSegmentsFromPixels() {
          const e = this.priceScale(),
            t = this.ownerSource()?.firstValue() ?? null
          if (
            null === e ||
            null === t ||
            null === this._segmentsPixelsWhileMoving
          )
            return
          const s = this.points()
          this._segmentsPixelsWhileMoving.forEach((i, r) => {
            const n = this._segments[r],
              a = s[r].price,
              o = s[r + 1].price,
              h = e.priceToCoordinate(a, t),
              l = (e.priceToCoordinate(o, t) - h) / (i.bars.length - 1),
              c = n.bars().map((s, r) => {
                const n = i.bars[r],
                  a = h + r * l,
                  o = e.coordinateToPrice(a, t)
                return {
                  ...s,
                  o: e.coordinateToPrice(n.open + a, t) - o,
                  h: e.coordinateToPrice(n.high + a, t) - o,
                  l: e.coordinateToPrice(n.low + a, t) - o,
                  c: e.coordinateToPrice(n.close + a, t) - o,
                }
              })
            n.setBars(c)
          })
        }
      }
    },
  },
])
