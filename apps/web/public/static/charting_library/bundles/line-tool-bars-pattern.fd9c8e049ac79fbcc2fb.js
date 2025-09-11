;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5206],
  {
    81756: (t, e, i) => {
      i.r(e), i.d(e, { LineToolBarsPattern: () => w })
      var s,
        r = i(50151),
        n = i(11542),
        o = i(45126),
        a = i(37265),
        c = i(29023),
        l = i(32679),
        h = i(8025),
        p = i(29875),
        d = i(67467),
        u = i(44672),
        _ = i(85719),
        f = i(64147)
      !((t) => {
        ;(t[(t.InitialVersion = 1)] = 'InitialVersion'),
          (t[(t.CorrectedPrice = 2)] = 'CorrectedPrice'),
          (t[(t.TheLatest = 2)] = 'TheLatest')
      })(s || (s = {}))
      const P = new o.TranslatedString(
          'mirror bars pattern',
          n.t(null, void 0, i(20965)),
        ),
        m = new o.TranslatedString(
          'flip bars pattern',
          n.t(null, void 0, i(92479)),
        ),
        C = n.t(null, void 0, i(28941)),
        D = n.t(null, void 0, i(63271)),
        g = { 0: 2, 1: 4, 2: 1, 3: 1, 4: 2, 5: 3, 6: -1 },
        v = { 0: 3, 1: 4, 2: 4, 3: 1, 4: 2, 5: 3, 6: -1 }
      class w extends p.LineDataSource {
        constructor(
          t,
          e = w.createProperties(t.backgroundTheme().spawnOwnership()),
          s,
          r,
        ) {
          super(t, e, s, r),
            (this._hasEditableCoordinates = new f.WatchedValue(!1)),
            (this._pattern = []),
            (this._scale = 1),
            (this._pointsCoordinatePricesDiff = null)
          const n = e.childs().mode.value()
          ;(0, a.isString)(n) && e.childs().mode.setValue(Number.parseInt(n)),
            e.childs().mirrored.subscribe(this, this._mirror),
            e.childs().flipped.subscribe(this, this._flip),
            e.childs().mode.subscribe(this, this._updateLastPoint),
            (this.version = 2),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 52666))
              .then((e) => {
                this._setPaneViews([new e.BarsPatternPaneView(this, t)])
              })
        }
        pattern() {
          return this._pattern
        }
        isSynchronizable() {
          return !1
        }
        async additionalActions(t) {
          return {
            actions: [
              new c.Action({
                actionId: 'Chart.LineTool.BarsPattern.ToggleMirrored',
                options: {
                  checked: this.properties().childs().mirrored.value(),
                  checkable: !0,
                  label: C,
                  onExecute: () => {
                    t.setProperty(
                      this.properties().childs().mirrored,
                      !this.properties().childs().mirrored.value(),
                      P,
                      _.lineToolsDoNotAffectChartInvalidation,
                    ),
                      this.updateAllViews((0, u.sourceChangeEvent)(this.id())),
                      this._model.updateSource(this)
                  },
                },
              }),
              new c.Action({
                actionId: 'Chart.LineTool.BarsPattern.ToggleFlipped',
                options: {
                  checked: this.properties().childs().flipped.value(),
                  checkable: !0,
                  label: D,
                  onExecute: () => {
                    t.setProperty(
                      this.properties().childs().flipped,
                      !this.properties().childs().flipped.value(),
                      m,
                      _.lineToolsDoNotAffectChartInvalidation,
                    ),
                      this.updateAllViews((0, u.sourceChangeEvent)(this.id())),
                      this._model.updateSource(this)
                  },
                },
              }),
            ],
            placement: 'CustomAction',
          }
        }
        pointsCount() {
          return 2
        }
        state(t) {
          return {
            ...super.state(t),
            pattern: this._pattern,
            scale: this._scale,
            diff: this._pointsCoordinatePricesDiff,
          }
        }
        restoreData(t) {
          const {
            pattern: e = this._pattern,
            scale: i = this._scale,
            diff: s = this._pointsCoordinatePricesDiff,
          } = t
          ;(this._pattern = e),
            (this._scale = i),
            (this._pointsCoordinatePricesDiff = s)
        }
        name() {
          return 'Bars Pattern'
        }
        cloneData(t) {
          ;(this._pattern = (0, a.clone)(t._pattern)),
            (this._scale = t._scale),
            (this._pointsCoordinatePricesDiff = t._pointsCoordinatePricesDiff)
        }
        firstPatternPrice() {
          const { mode: t, flipped: e } = this.properties().childs(),
            i = this._pattern[0]
          return t.value() === d.LineToolBarsPatternMode.LineHL2
            ? (i[2] + i[3]) / 2
            : e.value()
              ? i[v[t.value()]]
              : i[g[t.value()]]
        }
        lastPatternPrice() {
          const { mode: t, flipped: e } = this.properties().childs(),
            i = this._pattern[this._pattern.length - 1]
          return t.value() === d.LineToolBarsPatternMode.LineHL2
            ? (i[2] + i[3]) / 2
            : e.value()
              ? i[g[t.value()]]
              : i[v[t.value()]]
        }
        addPoint(t, e, i) {
          const s = super.addPoint(t, e, !0)
          if (s) {
            const t = this._model.mainSeries(),
              [{ index: e }, { index: i }] = this.points(),
              s = (0, r.ensureDefined)(
                t.nearestIndex(
                  Math.min(e, i),
                  h.PlotRowSearchMode.NearestRight,
                ),
              ),
              n = (0, r.ensureDefined)(
                t.nearestIndex(Math.max(e, i), h.PlotRowSearchMode.NearestLeft),
              )
            ;(this._pattern = this._createPattern(s, n)),
              this._pattern.length > 0 &&
                (e > i && this._points.reverse(),
                (this._points[1].price =
                  this._points[0].price + this._patternPriceDiff()),
                (this._points[1].index = this._points[0].index + (n - s)),
                this._normalizePoints(),
                this.createServerPoints()),
              this._updatePointsCoordinatePricesDiff()
          }
          return s
        }
        setPoint(t, e, i, s) {
          1 === t &&
            e.index <= this._points[0].index &&
            (e.index = this._points[0].index + 1),
            0 === t &&
              e.index >= this._points[1].index &&
              (e.index = this._points[1].index - 1),
            super.setPoint(t, e, i),
            this._updatePointsCoordinatePricesDiff()
        }
        move(t, e, i, s) {
          super.move(t, e, i, s), this._updatePointsCoordinatePricesDiff()
        }
        migrateVersion(t, e, i) {
          if (1 === t && this._pattern.length > 0) {
            const t = this._patternPriceDiff()
            2 === this._timePoint.length &&
              (this._timePoint[1].price = this._timePoint[0].price + t),
              2 === this._points.length &&
                (this._points[1].price = this._points[0].price + t)
          }
        }
        getScale() {
          return (this._scale = this._calculateScale())
        }
        static createProperties(t, e) {
          const i = new l.DefaultProperty({
            defaultName: 'linetoolbarspattern',
            state: e,
            theme: t,
          })
          return this._configureProperties(i), i
        }
        _preparePoint(t, e) {
          const i = this._alignPointToRangeOfActualData(t),
            s = this._model.mainSeries(),
            n = (0, r.ensureNotNull)(s.bars().valueAt(i.index))
          this.properties().childs().mode.value() ===
          d.LineToolBarsPatternMode.Bars
            ? (i.price = (0, r.ensure)(n[2]))
            : (i.price = (0, r.ensure)(n[4]))
          const o = (0, r.ensureNotNull)(this.priceScale()),
            a = (0, r.ensure)(this.ownerSource()?.firstValue()),
            c = 0.05 * o.height(),
            l = o.priceToCoordinate(i.price, a) - c
          return (
            (i.price = o.coordinateToPrice(l, a)), super._preparePoint(i, e)
          )
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              i.e(6406),
              i.e(3889),
              i.e(8009),
              i.e(8056),
              i.e(8537),
            ]).then(i.bind(i, 1847))
          ).BarsPatternDefinitionsViewModel
        }
        static _configureProperties(t) {
          super._configureProperties(t),
            t.addExcludedKey('mirrored', 1),
            t.addExcludedKey('flipped', 1)
        }
        _calculatePatternCoordinatePricesDiff() {
          return this._pattern.length > 0
            ? (this._priceCoordinateDiff([
                this.firstPatternPrice(),
                this.lastPatternPrice(),
              ]) ?? null)
            : null
        }
        _updatePointsCoordinatePricesDiff() {
          this._pointsCoordinatePricesDiff =
            this._calculatePointsCoordinatePricesDiff()
        }
        _calculatePointsCoordinatePricesDiff() {
          if (2 === this._points.length) {
            const [{ price: t }, { price: e }] = this.points()
            return this._priceCoordinateDiff([t, e]) ?? null
          }
          return null
        }
        _createPattern(t, e) {
          const i = this._model.mainSeries().data(),
            s = []
          for (let n = t; n <= e; n++)
            s.push((0, a.clone)((0, r.ensureNotNull)(i.valueAt(n))))
          return s
        }
        _switchPointsPrice() {
          const t = this._points[0].price
          ;(this._timePoint[0].price = this._points[0].price =
            this._points[1].price),
            (this._timePoint[1].price = this._points[1].price = t)
        }
        _mirror() {
          const t = this._pattern
          let e = Math.min(t[0][3], t[0][2]),
            i = Math.max(t[0][3], t[0][2])
          for (let s = 1; s < t.length; s++)
            (e = Math.min(e, t[s][3])), (i = Math.max(i, t[s][2]))
          if (e < i) {
            const s = (e + i) / 2,
              r = (t) => s - (t - s)
            for (let e = 0; e < t.length; e++)
              (t[e][2] = r(t[e][2])),
                (t[e][3] = r(t[e][3])),
                (t[e][1] = r(t[e][1])),
                (t[e][4] = r(t[e][4]))
          }
          this._switchPointsPrice(),
            this.updateAllViews((0, u.sourceChangeEvent)(this.id()))
        }
        _flip() {
          const t = this._pattern,
            e = t.length
          for (let i = 0; i < e / 2; i++) {
            const s = t[i]
            ;(t[i] = t[e - i - 1]), (t[e - i - 1] = s)
          }
          this._switchPointsPrice(),
            this.updateAllViews((0, u.sourceChangeEvent)(this.id()))
        }
        _patternPriceDiff() {
          return this.lastPatternPrice() - this.firstPatternPrice()
        }
        _pricesToCoordinates(t) {
          const e = this.priceScale(),
            i = this.ownerSource()?.firstValue() ?? null
          if (null !== i && null !== e && !e.isEmpty())
            return t.map((t) => e.priceToCoordinate(t, i))
        }
        _priceCoordinateDiff(t) {
          const e = this._pricesToCoordinates(t)
          if (e) return e[1] - e[0]
        }
        _calculateScale() {
          let t = 1
          if (2 === this._points.length) {
            const e = this._calculatePatternCoordinatePricesDiff()
            if (!e) return t
            const i = this._calculatePointsCoordinatePricesDiff()
            if (
              (e && null !== i && (t = +(i / e).toFixed(8)),
              this._pointsCoordinatePricesDiff !== i)
            ) {
              if (this._scale !== t) return this._updateLastPoint(), this._scale
              this._updatePointsCoordinatePricesDiff()
            }
          }
          return t
        }
        _updateLastPoint() {
          if (this._points.length < 2) return
          const t = this.priceScale(),
            e = this.ownerSource()?.firstValue() ?? null
          if (null === e || null === t || t.isEmpty()) return
          const i = this._calculatePatternCoordinatePricesDiff(),
            s = this._pricesToCoordinates([this.points()[0].price])
          null !== i &&
            s &&
            ((this._timePoint[1].price = this._points[1].price =
              t.coordinateToPrice(+(this._scale * i).toFixed(8) + s[0], e)),
            this._updatePointsCoordinatePricesDiff())
        }
      }
    },
  },
])
