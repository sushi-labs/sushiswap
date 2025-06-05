;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7539],
  {
    83943: (e, t, s) => {
      s.r(t), s.d(t, { Sessions: () => p })
      var i = s(50151),
        r = s(68159),
        l = s(71838),
        o = s(14019),
        a = s(725),
        n = s(28120),
        h = s(56570),
        c = s(44672),
        u = s(16638)
      const d = new a.PriceFormatter()
      class p extends n.CustomSourceBase {
        constructor(e, t, s, i) {
          super(e, t),
            (this._studySource = null),
            (this._paneViews = []),
            (this._metaInfo = null),
            (this._destroyed = !1),
            (this._isStarted = !1),
            (this._loadedGraphics = null),
            (this._doubleClickHandler = i),
            (this._properties = s),
            this._properties.subscribe(this, this._onPropertiesChanged),
            this._requestAndProcessMetaInfo(),
            t.timeScale().onReset().subscribe(this, this._clearData),
            t
              .timeScale()
              .logicalRangeChanged()
              .subscribe(
                this,
                this.updateAllViews.bind(this, (0, c.viewportChangeEvent)()),
              ),
            t
              .mainSeries()
              .properties()
              .childs()
              .interval.subscribe(this, this._processHibernate)
        }
        start() {
          ;(this._isStarted = !0), this._processHibernate()
        }
        restart() {
          this._clearData(),
            h.enabled('stop_study_on_restart') && this.stop(),
            this.start()
        }
        isStarted() {
          return this._isStarted
        }
        stop() {
          ;(this._isStarted = !1),
            null !== this._studySource && this._studySource.stop()
        }
        isHoveredEnabled() {
          return !1
        }
        paneViews(e) {
          return this._paneViews
        }
        updateAllViews(e) {
          this._paneViews.forEach((t) => t.update(e))
        }
        updateViewsForPane(e, t) {
          this.updateAllViews(t)
        }
        destroy() {
          ;(this._destroyed = !0),
            null !== this._studySource &&
              (this._studySource.dataCleared().unsubscribeAll(this),
              this._studySource.dataUpdated().unsubscribeAll(this),
              this._studySource.destroy(),
              (this._studySource = null)),
            this._model.timeScale().logicalRangeChanged().unsubscribeAll(this),
            this._model.timeScale().onReset().unsubscribeAll(this),
            this._model
              .mainSeries()
              .properties()
              .childs()
              .interval.unsubscribeAll(this),
            this._properties.unsubscribeAll(this)
        }
        series() {
          return this._model.mainSeries()
        }
        priceScale() {
          return this.series().priceScale()
        }
        graphics() {
          return (
            this._loadedGraphics ||
            (0, i.ensureNotNull)(this._studySource).graphics()
          )
        }
        valueAt(e, t) {
          return null
        }
        properties() {
          return this._properties
        }
        graphicsInfo() {
          return (0, i.ensureNotNull)(this._metaInfo).graphics
        }
        firstValue(e) {
          return this._model.mainSeries().firstValue()
        }
        formatter() {
          return d
        }
        stateData() {
          return null !== this._metaInfo
            ? {
                graphics: (0, o.saveStudyGraphics)(
                  this.graphics(),
                  this._model.timeScale().visibleBarsStrictRange(),
                ),
                metaInfo: this._metaInfo.state(),
              }
            : null
        }
        restoreStateData(e) {
          void 0 !== e &&
            (this._loadStudyGraphics(e.graphics),
            this._setMetaInfo(new r.StudyMetaInfo(e.metaInfo)),
            this._createPaneViews())
        }
        metaInfo() {
          return (0, i.ensureNotNull)(this._metaInfo)
        }
        async _requestAndProcessMetaInfo() {
          if (this._model.isSnapshot()) return
          const e = await (0, u.studyMetaInfoRepository)().findById({
            type: 'java',
            studyId: 'Sessions@tv-basicstudies',
          })
          this._destroyed ||
            (null === this._loadedGraphics &&
              (this._setMetaInfo(e),
              null !== this._metaInfo &&
                ((this._studySource = new l.StudyDataSource(
                  this._model.chartApi(),
                  this._model.mainSeries().seriesSource(),
                  'sessions_',
                  this._metaInfo,
                )),
                this._createPaneViews(),
                this._studySource
                  .dataCleared()
                  .subscribe(
                    this,
                    this.updateAllViews.bind(
                      this,
                      (0, c.sourceChangeEvent)(this.id()),
                    ),
                  ),
                this._studySource
                  .dataUpdated()
                  .subscribe(
                    this,
                    this.updateAllViews.bind(
                      this,
                      (0, c.sourceChangeEvent)(this.id()),
                    ),
                  ),
                this._studySource.setInputs({}),
                this._processHibernate())))
        }
        _loadStudyGraphics(e) {
          const t = e.backgrounds
          if (void 0 !== t) {
            const e = t.findIndex((e) => 'inSession' === e.styleId)
            ;-1 !== e && t.splice(e, 1)
          }
          this._loadedGraphics = (0, o.loadStudyGraphics)(e)
        }
        _setMetaInfo(e) {
          const t = e.graphics.backgrounds
          void 0 !== t && void 0 !== t.inSession && delete t.inSession,
            (this._metaInfo = e)
        }
        _clearData() {
          null !== this._studySource && this._studySource.clearData()
        }
        _createPaneViews() {
          const e = { doubleClickHandler: this._doubleClickHandler }
          ;(0, o.createGraphicsPaneViews)(this, this._model, e).then((e) => {
            ;(this._paneViews = e.regularPaneViews), this._model.lightUpdate()
          })
        }
        _onPropertiesChanged() {
          this._processHibernate(),
            this.updateAllViews((0, c.sourceChangeEvent)(this.id()))
        }
        _processHibernate() {
          if (null !== this._studySource) {
            const e = this._canBeHibernated(),
              t = this._isHibernated(),
              s = this._studySource.isStarted()
            !t && e && s
              ? this._studySource.stop()
              : !t || e || s || this._studySource.start()
          }
        }
        _canBeHibernated() {
          const e = this._model.mainSeries(),
            t = this._properties.childs().sessionHighlight.childs(),
            s = t.backgrounds.childs(),
            i =
              s.preMarket.childs().visible.value() &&
              s.postMarket.childs().visible.value() &&
              s.electronic.childs().visible.value() &&
              s.outOfSession.childs().visible.value()
          return (
            e.isDWM() ||
            (!i && !t.vertlines.childs().sessBreaks.childs().visible.value())
          )
        }
        _isHibernated() {
          return (
            this._isStarted &&
            (null === this._studySource || !this._studySource.isStarted())
          )
        }
      }
    },
    93378: (e, t, s) => {
      s.r(t), s.d(t, { study_PivotPointsStandard: () => L })
      var i = s(50151),
        r = s(25149),
        l = s(27714),
        o = s(7114)
      class a {
        constructor(e, t, s, i) {
          ;(this._priceAxisFontSize = 11),
            (this._prices = []),
            (this._labelWidth = 0),
            (this._pixelRatioParams = e),
            this._recreateCanvasAndContext(
              (0, l.size)({ width: 0, height: 0 }),
            ),
            this.reset({ font: t, fontSize: s, backColors: i })
        }
        destroy() {
          delete this._canvas, delete this._cache
        }
        canvas() {
          return this._canvas
        }
        reset(e) {
          ;(this._renderParams = e),
            (this._prices = []),
            (this._cache.font = e.fontSize + 'px ' + e.font),
            (this._labelWidth = [
              'P',
              'S1',
              'R1',
              'S2',
              'R2',
              'S3',
              'R3',
              'S4',
              'R4',
              'S5',
              'R5',
              '/',
            ].reduce((e, t) => {
              const s = this._cache.measureText(t).width
              return Math.max(s, e)
            }, 0))
        }
        rowHeight() {
          return this._priceAxisFontSize + 4
        }
        labelRectByIndex(e) {
          return {
            left: 0,
            top: Math.round(this._topByIndex(e)),
            width: Math.round(this._labelWidth + 4),
            height: Math.round(this._renderParams.fontSize + 8),
          }
        }
        setPrices(e) {
          let t = !1
          const s = (e, t) => {
            const s = void 0 === e,
              r = void 0 === t
            return (
              ((!s && !r) || s === r) &&
              (0, i.ensureDefined)(e).formatted ===
                (0, i.ensureDefined)(t).formatted
            )
          }
          if (e.length !== this._prices.length) t = !0
          else
            for (let i = 0; i < this._prices.length; i++)
              if (!s(this._prices[i], e[i])) {
                t = !0
                break
              }
          if (t) {
            const t = this._labelWidth + 6,
              s = this._renderParams.fontSize,
              i = Math.max(e.length, 22) * (s + 8)
            this._recreateCanvasAndContext(
              (0, l.size)({ width: t, height: i }),
            ),
              (this._prices = e),
              this._cache.save(),
              (0, o.drawScaled)(
                this._cache,
                this._pixelRatioParams.horizontalPixelRatio,
                this._pixelRatioParams.verticalPixelRatio,
                () => {
                  this._cache.translate(0.5, 0.5),
                    (this._cache.font =
                      this._renderParams.fontSize +
                      'px ' +
                      this._renderParams.font),
                    (this._cache.textBaseline = 'middle')
                  for (let e = 0; e < this._prices.length; e++) {
                    if (!this._prices[e]) continue
                    const t = [
                      'P',
                      'S1',
                      'R1',
                      'S2',
                      'R2',
                      'S3',
                      'R3',
                      'S4',
                      'R4',
                      'S5',
                      'R5',
                    ][e]
                    ;(this._cache.fillStyle = this._renderParams.backColors[e]),
                      this._cache.fillText(t, 0, this._centerByIndex(e)),
                      this._cache.fillText('/', 0, this._centerByIndex(e + 11))
                  }
                },
              ),
              this._cache.restore(),
              (this._prices = e)
          }
        }
        _recreateCanvasAndContext(e) {
          ;(this._canvas = document.createElement('canvas')),
            (this._canvas.width =
              e.width * this._pixelRatioParams.horizontalPixelRatio),
            (this._canvas.height =
              e.height * this._pixelRatioParams.verticalPixelRatio),
            (this._cache = (0, i.ensureNotNull)(this._canvas.getContext('2d')))
        }
        _centerByIndex(e) {
          return Math.round((e + 0.5) * (this._renderParams.fontSize + 8))
        }
        _topByIndex(e) {
          return Math.round(e * (this._renderParams.fontSize + 8))
        }
      }
      var n = s(15938),
        h = s(98558),
        c = s(19063)
      const u = [
        'P',
        'S1',
        'R1',
        'S2',
        'R2',
        'S3',
        'R3',
        'S4',
        'R4',
        'S5',
        'R5',
      ]
      class d extends h.PriceAxisView {
        constructor(e, t) {
          super(), (this._source = e), (this._data = t)
          const s = t.name
          this._completeName =
            'P' === s.toUpperCase() ? 'P' : `S${s[1]}/R${s[1]}`
        }
        _updateRendererData(e, t, s) {
          ;(e.visible = !1), (t.visible = !1)
          const i = this._source.properties().childs()
          if (!i.visible.value()) return
          const r = this._completeName,
            l = i.levelsStyle.childs().visibility.childs()
          if (!l[r] || !l[r].value()) return
          const o = this._source.model().timeScale(),
            a = this._source.priceScale()
          if (
            o.isEmpty() ||
            null === o.visibleBarsStrictRange() ||
            (null !== a && a.isEmpty())
          )
            return
          const n = this._source.customData()
          if (!n || !n.pivots) return
          const h = this._source.pricesView().prices()[
            u.indexOf(this._data.name.toUpperCase())
          ]
          if (!h) return
          ;(s.background = (0, c.resetTransparency)(h.color)),
            (s.textColor = this.generateTextColor(s.background)),
            (s.coordinate = h.coordinate),
            (s.floatCoordinate = h.coordinate)
          const d = this._source
            .model()
            .properties()
            .childs()
            .scalesProperties.childs()
          d.showStudyLastValue.value() &&
            ((e.text = h.formatted), (e.visible = !0)),
            d.showStudyPlotLabels.value() &&
              ((t.text = this._source.priceLabelText(this._data.name)),
              (t.visible = !0))
        }
      }
      var p = s(65458),
        _ = s(22839),
        y = s(49936),
        v = s(8025)
      const m = [
          'p',
          's1',
          'r1',
          's2',
          'r2',
          's3',
          'r3',
          's4',
          'r4',
          's5',
          'r5',
        ],
        S = {
          P: 'P',
          S1: 'S1/R1',
          S2: 'S2/R2',
          S3: 'S3/R3',
          S4: 'S4/R4',
          S5: 'S5/R5',
          R1: 'S1/R1',
          R2: 'S2/R2',
          R3: 'S3/R3',
          R4: 'S4/R4',
          R5: 'S5/R5',
        }
      class b {
        constructor(e) {
          ;(this._visiblePivots = new Set()),
            (this._invidated = !0),
            (this._prices = []),
            (this._source = e)
        }
        visiblePivots() {
          return this._visiblePivots
        }
        update() {
          this._invidated = !0
        }
        prices() {
          return (
            this._invidated && (this._updateImpl(), (this._invidated = !1)),
            this._prices
          )
        }
        _updateImpl() {
          this._visiblePivots.clear()
          const e = this._source.model(),
            t = this._source.priceScale()
          if (null === t) return
          if (e.timeScale().isEmpty() || t.isEmpty()) return
          const s = e.timeScale().visibleBarsStrictRange()
          if (null === s) return
          if (!this._source.customData() || !this._source.customData().pivots)
            return
          const i = e
            .mainSeries()
            .bars()
            .search(s.lastBar(), v.PlotRowSearchMode.NearestLeft)
          if (null === i) return
          const r = this._source.indexes()
          if (!r) return
          const l = i.index,
            o = this._source.customData().pivots,
            a = this._source.properties().childs(),
            n = this._source.firstValue()
          for (let e = 0; e < o.length; e++) {
            if (!o[e]) continue
            const s = r[o[e].startIndex],
              i = r[o[e].endIndex],
              h = a.inputs.childs().showHistoricalPivots.value()
            if (s <= l && (i >= l || h)) {
              this._visiblePivots.add(o[e]), (this._prices = [])
              for (let s = 0; s < m.length; s++) {
                const i = m[s],
                  r = o[e][i]
                if (void 0 === r || null === n) continue
                const l = t.priceToCoordinate(r, n),
                  h = i.toUpperCase(),
                  c = S[h],
                  u = a.levelsStyle.childs().colors.childs()[c].value()
                this._prices.push({
                  formatted: t.formatPrice(r, n),
                  price: r,
                  coordinate: l,
                  color: u,
                })
              }
            }
          }
        }
      }
      var g = s(86441),
        f = s(51056),
        w = s(95201),
        P = s(50600),
        C = s(56468),
        x = s(30125)
      class R extends x.BitmapCoordinatesPaneRenderer {
        constructor(e, t, s) {
          super(),
            (this._drawRects = []),
            (this._cacheProvider = e),
            (this._point = t),
            (this._label = s)
        }
        hitTest(e) {
          for (const t of this._drawRects)
            if (
              e.x >= t.left &&
              e.x <= t.left + t.width &&
              e.y >= t.top &&
              e.y <= t.top + t.height
            )
              return new C.HitTestResult(C.HitTarget.Regular)
          return null
        }
        _drawImpl(e) {
          const t = this._cacheProvider(e),
            { horizontalPixelRatio: s, verticalPixelRatio: i, context: r } = e
          this._drawRects = []
          const l = (e) => {
              const l = t.labelRectByIndex(e),
                o = {
                  left: Math.round(this._point.x - l.width + a),
                  top: Math.round(this._point.y - l.height / 2),
                  width: l.width,
                  height: l.height,
                }
              return (
                r.drawImage(
                  t.canvas(),
                  Math.round(l.left * s),
                  Math.round(l.top * i),
                  l.width * s,
                  l.height * i,
                  Math.round(o.left * s),
                  Math.round(o.top * i),
                  o.width * s,
                  o.height * i,
                ),
                this._drawRects.push(o),
                l.width
              )
            },
            o = this._label.split('/')
          let a = 0
          for (let e = 0; e < o.length; e++) {
            const t = [
              'P',
              'S1',
              'R1',
              'S2',
              'R2',
              'S3',
              'R3',
              'S4',
              'R4',
              'S5',
              'R5',
            ].indexOf(o[e])
            e > 0 && (a += l(t + 11) / 2), (a += l(t) / 2)
          }
        }
      }
      function V(e) {
        return 'P' === e ? e : 'S' + e[1] + '/R' + e[1]
      }
      function I(e, t, s) {
        const i = t
        void 0 === e[i]
          ? (e[i] = { text: s, ids: [V(s)] })
          : ((e[i].text += '/' + s), e[i].ids.push(V(s)))
      }
      class T {
        constructor(e, t) {
          ;(this._pivots = []),
            (this._invalidated = !0),
            (this._renderer = new w.CompositeRenderer()),
            (this._model = e),
            (this._source = t),
            (this._cacheProvider = this._source.getCache.bind(this._source))
        }
        update(e) {
          this._invalidated = !0
        }
        renderer() {
          return (
            this._invalidated && (this._updateImpl(), (this._invalidated = !1)),
            this._renderer
          )
        }
        _updateImpl() {
          this._renderer.clear()
          const e = this._source.ownerSource()
          if (null === e) return
          this._source.pricesView().prices(), (this._pivots = [])
          const t = this._source.customData()
          if (!t || !t.pivots) return
          const s = this._source.properties().childs()
          if (!s.visible.value()) return
          const r = t.pivots,
            l = this._source.indexes(),
            o = this._model.timeScale(),
            a = this._source.priceScale(),
            n = e.firstValue()
          if (!a || a.isEmpty() || o.isEmpty() || !r || !l || null === n) return
          const h = (0, i.ensureNotNull)(o.visibleBarsStrictRange()),
            c = h.firstBar(),
            u = h.lastBar()
          for (let e = 0; e < r.length; e++) {
            if (!r[e]) continue
            const t = l[r[e].startIndex],
              i = l[r[e].endIndex]
            if (i < c || t > u) continue
            const h = {},
              d = s.levelsStyle.childs().visibility.childs()
            d.P.value() && I(h, r[e].p, 'P'),
              d['S1/R1'].value() && (I(h, r[e].s1, 'S1'), I(h, r[e].r1, 'R1')),
              d['S2/R2'].value() && (I(h, r[e].s2, 'S2'), I(h, r[e].r2, 'R2')),
              d['S3/R3'].value() && (I(h, r[e].s3, 'S3'), I(h, r[e].r3, 'R3')),
              d['S4/R4'].value() && (I(h, r[e].s4, 'S4'), I(h, r[e].r4, 'R4')),
              d['S5/R5'].value() && (I(h, r[e].s5, 'S5'), I(h, r[e].r5, 'R5'))
            const p = o.indexToCoordinate(t),
              _ = o.indexToCoordinate(i)
            for (const t of Object.keys(h)) {
              const s = Number.parseFloat(t),
                i = a.priceToCoordinate(s, n)
              this._pivots.push({
                x1: p,
                x2: _,
                y: i,
                label: h[t].text,
                labelIds: h[t].ids,
                src: r[e],
              })
            }
          }
          const d = s.levelsStyle.childs().colors,
            p = s.levelsStyle.childs().widths,
            _ = this._source.visiblePivots()
          for (let e = 0; e < this._pivots.length; e++) {
            const t = this._pivots[e]
            if (!_.has(t.src)) continue
            const i = {
                color: d.childs()[t.labelIds[0]].value(),
                linewidth: p.childs()[t.labelIds[0]].value(),
                linestyle: f.LINESTYLE_SOLID,
                y: t.y,
                left: t.x1,
                right: t.x2,
              },
              r = new P.HorizontalLineRenderer()
            r.setData(i),
              r.setHitTest(new C.HitTestResult(C.HitTarget.Regular)),
              this._renderer.append(r),
              s.levelsStyle.childs().showLabels.value() &&
                this._renderer.append(
                  new R(this._cacheProvider, new g.Point(t.x1, t.y), t.label),
                )
          }
        }
      }
      var A = s(93280)
      class L extends r.NonSeriesStudy {
        constructor(e, t, s, i, r) {
          super(e, t, s, i, r),
            (this._cache = null),
            (this._cachedPixelRatioParams = null)
          const l = ['P', 'S1/R1', 'S2/R2', 'S3/R3', 'S4/R4', 'S5/R5'],
            o = this.properties().childs().levelsStyle.childs().visibility
          for (let e = 0; e < l.length; e++)
            o.childs()[l[e]].subscribe(this, () => this.processHibernate())
        }
        pricesView() {
          return this._pricesView
        }
        indexes() {
          return this._indexes
        }
        properties() {
          return this._properties
        }
        getCache(e) {
          if (
            null === this._cache ||
            null == this._cachedPixelRatioParams ||
            ((t = e),
            (s = this._cachedPixelRatioParams),
            t.horizontalPixelRatio !== s.horizontalPixelRatio ||
              t.verticalPixelRatio !== s.verticalPixelRatio)
          ) {
            this._cache && this._cache.destroy()
            const t = this._getActualCacheParams(),
              s = {
                horizontalPixelRatio: e.horizontalPixelRatio,
                verticalPixelRatio: e.verticalPixelRatio,
              }
            ;(this._cache = new a(s, t.font, t.fontSize, t.backColors)),
              this._cache.setPrices(
                (0, i.ensureNotNull)(this._pricesView).prices(),
              ),
              (this._cachedPixelRatioParams = s),
              this._cache.reset(t)
          }
          var t, s
          return this._cache
        }
        priceLabelText(e) {
          return this._metaInfo.shortDescription + ':' + e.toUpperCase()
        }
        updateAllViews(e) {
          super.updateAllViews(e), this._pricesView.update()
        }
        visiblePivots() {
          return this._pricesView.visiblePivots()
        }
        isVisible() {
          if (
            !this.properties().childs().visible.value() ||
            !this.isActualInterval()
          )
            return !1
          const e = ['P', 'S1/R1', 'S2/R2', 'S3/R3', 'S4/R4', 'S5/R5'],
            t = this.properties().childs().levelsStyle.childs().visibility
          for (let s = 0; s < e.length; s++)
            if (t.childs()[e[s]].value()) return !0
          return !1
        }
        stop() {
          super.stop(),
            this._cache && (this._cache.destroy(), (this._cache = null))
        }
        priceRange(e, t, s) {
          if (s.targetPriceScale !== this.priceScale()) return null
          const i = this.customData()?.pivots
          if (!i || !this._indexes) return null
          if (!this.priceScale()) return null
          const r = i,
            l = this._indexes
          let o = null
          for (let s = 0; s < r.length; s++) {
            if (!r[s]) continue
            const i = l[r[s].startIndex]
            if (l[r[s].endIndex] < e || i > t) continue
            const a = [],
              n = this.properties()
                .childs()
                .levelsStyle.childs()
                .visibility.childs()
            n.P.value() && a.push(r[s].p),
              n['S1/R1'].value() && a.push(r[s].s1, r[s].r1),
              n['S2/R2'].value() && a.push(r[s].s2, r[s].r2),
              n['S3/R3'].value() && a.push(r[s].s3, r[s].r3),
              n['S4/R4'].value() && a.push(r[s].s4, r[s].r4),
              n['S5/R5'].value() && a.push(r[s].s5, r[s].r5)
            for (let e = 0; e < a.length; e++)
              a[e] &&
                (null === o
                  ? (o = new A.PriceRange(a[e], a[e]))
                  : o.apply(a[e], a[e]))
          }
          const a = this.priceScale()
          return a && a.isLog() && o
            ? new A.PriceRange(
                a.priceToLogical(o.minValue()),
                a.priceToLogical(o.maxValue()),
              )
            : o
        }
        _createViews() {
          this._cache && (this._cache.destroy(), (this._cache = null)),
            (this._priceAxisViews = [])
          const e = [
            'P',
            'S1',
            'R1',
            'S2',
            'R2',
            'S3',
            'R3',
            'S4',
            'R4',
            'S5',
            'R5',
          ]
          ;(this._paneViews.length = 0), (this._labelPaneViews = [])
          const t = new T(this._model, this)
          this._paneViews.push(t)
          for (let t = 0; t < e.length; t++) {
            const s = new d(this, { name: e[t] })
            this._priceAxisViews.push(s),
              this._labelPaneViews.push(
                new p.PanePriceAxisView(s, this, this._model),
              )
          }
          this._dataWindowView ||
            (this._dataWindowView = new _.StudyDataWindowView(
              this,
              this._model,
            )),
            this._statusView ||
              (this._statusView = new y.StudyStatusView(this)),
            (this._legendView = null),
            (this._pricesView = new b(this))
        }
        _postProcessGraphics() {}
        _getActualCacheParams() {
          const e = this.properties().childs(),
            t = e.levelsStyle.childs().colors.childs()
          return {
            font: n.CHART_FONT_FAMILY,
            fontSize: e.fontsize.value(),
            backColors: [
              t.P.value(),
              t['S1/R1'].value(),
              t['S1/R1'].value(),
              t['S2/R2'].value(),
              t['S2/R2'].value(),
              t['S3/R3'].value(),
              t['S3/R3'].value(),
              t['S4/R4'].value(),
              t['S4/R4'].value(),
              t['S5/R5'].value(),
              t['S5/R5'].value(),
            ],
          }
        }
      }
    },
    31257: (e, t, s) => {
      s.r(t), s.d(t, { study_ScriptWithDataOffset: () => n })
      var i = s(50151),
        r = s(97085),
        l = s(64755),
        o = s(46806),
        a = s(82349)
      class n extends o.Study {
        constructor(e, t, s, i, r) {
          super(e, t, s, i, r),
            (this._underlyingData = new l.PlotList(
              (0, a.studyPlotFunctionMap)(i),
              a.studyEmptyPlotValuePredicate,
            ))
        }
        clearData() {
          super.clearData(), this._underlyingData.clear()
        }
        _mergeData(e) {
          this._invalidateLastNonEmptyPlotRowCache()
          const t = this._underlyingData.firstIndex()
          this._underlyingData.merge(e),
            t !== this._underlyingData.firstIndex() &&
              (this._data = new l.PlotList(
                (0, a.studyPlotFunctionMap)(this._metaInfo),
                a.studyEmptyPlotValuePredicate,
              ))
          let s = null
          const i = this._data.lastIndex() ?? this._underlyingData.firstIndex(),
            o = this._underlyingData.lastIndex()
          if (null !== i && null !== o)
            for (const e of this._underlyingData.rangeIterator(i, o))
              null === s && (s = e),
                this._data.add(e.index, (0, r.clone)(e.value))
          for (const e of this._plotsForStrategyProcessing()) {
            new h(e.strategyIndex, e.targetIndex, i).rebuildData(this._data)
          }
          return s
        }
        _plotsForStrategyProcessing() {
          const e = []
          return (
            this._metaInfo.plots.forEach((t, s) => {
              if ('dataoffset' !== t.type) return
              const r = this._metaInfo.plots.findIndex((e) => e.id === t.target)
              ;(0, i.assert)(
                r >= 0,
                `target plot not found for strategy plot ${t.id}`,
              ),
                e.push({ strategyIndex: s, targetIndex: r })
            }),
            e
          )
        }
      }
      class h {
        constructor(e, t, s) {
          ;(this._strategyPlotIndex = e),
            (this._targetPlotIndex = t),
            (this._startIndex = s)
        }
        rebuildData(e) {
          const t = this._targetPlotIndex + 1,
            s = this._strategyPlotIndex + 1
          let i = null,
            r = null
          const l = this._startIndex ?? e.firstIndex(),
            o = e.lastIndex()
          if (null !== l && null !== o)
            for (const { index: a, value: n } of e.rangeIterator(l, o)) {
              const l = n[t],
                o = n[s] ? Math.round(n[s]) : null
              if (((n[t] = null), (n[s] = null), !o || o > 0)) continue
              const h = a + o,
                c = { pointIndex: h, value: l }
              if (r) {
                if (r.pointIndex !== c.pointIndex) {
                  if (h >= 0) {
                    const s = e.valueAt(h)
                    s && (s[t] = l)
                  }
                  let s = !1
                  if (
                    (i &&
                      r &&
                      (s =
                        (i.value <= r.value && r.value <= l) ||
                        (i.value >= r.value && r.value >= l)),
                    s)
                  ) {
                    if (r.pointIndex >= 0) {
                      const s = e.valueAt(r.pointIndex)
                      s && (s[t] = null)
                    }
                  } else i = r
                  r = c
                }
              } else r = c
            }
        }
      }
    },
    34425: (e, t, s) => {
      s.r(t),
        s.d(t, {
          VbPVisibleWrapper: () => y,
          VolumeProfileBaseStudy: () => d,
          VolumeProfileStudyWithThemedColors: () => p,
          VolumeProfileWithPriceRangeStudy: () => _,
        })
      var i = s(50151),
        r = s(64147),
        l = s(93280)
      var o = s(98558),
        a = s(19063)
      class n extends o.PriceAxisView {
        constructor(e, t) {
          super(), (this._source = e), (this._styleId = t)
        }
        _updateRendererData(e, t, s) {
          e.visible = !1
          const i = this._source.priceScale(),
            r = this._source.properties().childs()
          if (!i || i.isEmpty() || !r.visible.value()) return
          const l = this._source
            .properties()
            .childs()
            .graphics.childs()
            .horizlines?.childs()
            [this._styleId].childs()
          if (
            !(
              l &&
              l.visible &&
              l.visible.value() &&
              this._isLabelVisibleAccordinglyToProperties()
            )
          )
            return
          const o = this._source.model().timeScale().logicalRange(),
            n = this._source.firstValue()
          if (null === n || null === o) return
          const h = { price: Number.NaN, time: -1 / 0 },
            c = this._source.graphics().horizlines().get(this._styleId)
          if (void 0 === c) return
          for (const e of c) {
            if (void 0 === e.level) continue
            const t = o.contains(e.startIndex, !0)
            ;(t === o.contains(e.endIndex, !0) && 0 !== t) ||
              (h.time < e.endIndex &&
                ((h.time = e.endIndex), (h.price = e.level)))
          }
          if (isNaN(h.price)) return
          const u = (0, a.resetTransparency)(l.color.value())
          ;(s.background = u),
            (s.textColor = this.generateTextColor(u)),
            (s.coordinate = i.priceToCoordinate(h.price, n)),
            (e.text = i.formatPrice(h.price, n, {
              signPositive: i.isPercentage(),
            })),
            (e.visible = !0)
        }
        _isLabelVisibleAccordinglyToProperties() {
          return (
            !!this._source
              .model()
              .properties()
              .childs()
              .scalesProperties.childs()
              .showStudyLastValue.value() &&
            this._source.properties().childs().showLabelsOnPriceScale.value()
          )
        }
      }
      var h = s(46806),
        c = s(78198),
        u = s(47988)
      class d extends h.Study {
        preferredZOrder() {
          return 0
        }
        async _createGraphicsPaneViews() {
          const e = this.metaInfo().graphics,
            t = this.model(),
            i = { regularPaneViews: [], forceOverlayPaneViews: [] },
            r = this._needExtendToBarsEnding()
          if (e.hhists) {
            const { HHistPaneView: e } = await s.e(507).then(s.bind(s, 56208)),
              l = this.properties()
                .childs()
                .graphics.childs()
                .polygons?.childs()
            i.regularPaneViews.push(new e(this, t, void 0, l?.histBoxBg, r))
          }
          if (e.horizlines) {
            const { HorizLinePaneView: e } = await s
              .e(507)
              .then(s.bind(s, 95258))
            i.regularPaneViews.push(new e(this, t, void 0, r))
          }
          return i
        }
        _createGraphicsPriceAxisViews() {
          return Object.keys(this.metaInfo().graphics.horizlines ?? {}).map(
            (e) => new n(this, e),
          )
        }
        _createStudyPlotPaneView(e) {
          return new c.StudyPlotPaneView(
            this,
            this._series,
            this._model,
            e,
            this._needExtendToBarsEnding(),
          )
        }
        _apiInputs() {
          return {
            ...super._apiInputs(),
            mapRightBoundaryToBarStartTime:
              !!this._needExtendToBarsEnding() || void 0,
          }
        }
        _needExtendToBarsEnding() {
          return (
            void 0 !==
            this.metaInfo().defaults.inputs?.mapRightBoundaryToBarStartTime
          )
        }
      }
      class p extends d {
        constructor(e, t, s, i, r) {
          t.setThemedColors(
            (0, u.volumeProfileThemedColors)(
              t.childs().graphics.childs().polygons?.hasChild('histBoxBg'),
            ),
          ),
            super(e, t, s, i, r)
        }
      }
      class _ extends p {
        priceRange(e, t, s) {
          if (s.targetPriceScale !== this.priceScale()) return null
          let r = !1
          this.graphics()
            .hhists()
            .forEach((e, t) => {
              r =
                r ||
                (0, i.ensureDefined)(
                  this.properties().childs().graphics.childs().hhists?.childs()[
                    t
                  ],
                ).value()
            })
          const o = ((e, t, s, i) => {
            let r = null
            return (
              e.forEach((e) => {
                e.forEach((e) => {
                  const i = e.firstBarTime
                  null !== i &&
                    i <= s &&
                    e.lastBarTime >= t &&
                    (null === r
                      ? (r = {
                          low: { l: e.priceLow, h: e.priceHigh },
                          high: { h: e.priceHigh },
                        })
                      : (e.priceLow < r.low.l &&
                          ((r.low.l = e.priceLow), (r.low.h = e.priceHigh)),
                        (r.high.h = Math.max(r.high.h, e.priceHigh))))
                })
              }),
              null === r
                ? null
                : i
                  ? new l.PriceRange(
                      r.low.l - 0.8 * (r.low.h - r.low.l),
                      r.high.h,
                    )
                  : new l.PriceRange(r.low.l, r.high.h)
            )
          })(this.graphics().hhists(), e, t, r)
          if (null === o) return null
          const a = (0, i.ensureNotNull)(this.priceScale())
          return a.isLog()
            ? new l.PriceRange(
                a.priceToLogical(o.minValue()),
                a.priceToLogical(o.maxValue()),
              )
            : o
        }
      }
      class y extends _ {
        alertCreationAvailable() {
          return new r.WatchedValue(!1).readonly()
        }
        _needExtendToBarsEnding() {
          return !1
        }
      }
    },
    47988: (e, t, s) => {
      s.d(t, { volumeProfileThemedColors: () => p })
      var i = s(49156)
      const {
          colorColdGray200: r,
          colorColdGray900: l,
          colorBerryPink400Alpha50: o,
          colorBerryPink400Alpha75: a,
          colorSkyBlue400Alpha50: n,
          colorSkyBlue400Alpha5: h,
          colorSkyBlue400Alpha75: c,
          colorSkyBlue500: u,
        } = i.colors,
        d = {
          val: [l, r],
          poc: [l, r],
          vah: [l, r],
          developingPoc: [l, r],
          developingVA: [u, u],
          valuesColor: [l, r],
          volumeColorUp: [n, n],
          volumeColorDown: [o, o],
          valueAreaColorUp: [c, c],
          valueAreaColorDown: [a, a],
          histogramBoxColor: [h, h],
        }
      function p(e) {
        const t = 'graphics.horizlines',
          s = 'graphics.hhists',
          i = [
            { path: `${t}.pocLines.color`, colors: d.poc },
            { path: `${t}.vahLines.color`, colors: d.vah },
            { path: `${t}.valLines.color`, colors: d.val },
            { path: `${s}.histBars2.colors.0`, colors: d.volumeColorUp },
            { path: `${s}.histBars2.colors.1`, colors: d.volumeColorDown },
            { path: `${s}.histBars2.valuesColor`, colors: d.valuesColor },
            { path: `${s}.histBarsVA.colors.0`, colors: d.valueAreaColorUp },
            { path: `${s}.histBarsVA.colors.1`, colors: d.valueAreaColorDown },
            { path: `${s}.histBarsVA.valuesColor`, colors: d.valuesColor },
            { path: 'styles.developingPoc.color', colors: d.developingPoc },
            { path: 'styles.developingVAHigh.color', colors: d.developingVA },
            { path: 'styles.developingVALow.color', colors: d.developingVA },
          ]
        return (
          e &&
            i.push({
              path: 'graphics.polygons.histBoxBg.color',
              colors: d.histogramBoxColor,
            }),
          i
        )
      }
    },
    7021: (e, t, s) => {
      s.r(t), s.d(t, { VolumeStudy: () => l })
      var i = s(46806),
        r = s(11542)
      class l extends i.Study {
        base() {
          return 1
        }
        destroy() {
          super.destroy()
        }
        showOnTopOnHovering() {
          return !1
        }
        _titleInParts(e, t, s, i, r, l) {
          const o = super._titleInParts(e, t, s, i, r),
            a = this._getVolumeUnit()
          return a && !l && (o[0] += ` · ${a}`), o
        }
        _skippedTitleInputs() {
          return super._skippedTitleInputs()
        }
        _getVolumeUnit() {
          const e = this.symbolSource().symbolInfo()
          return e
            ? ((e) => {
                switch (e.volume_type) {
                  case 'base':
                    return e.base_currency || void 0
                  case 'quote':
                    return e.currency || void 0
                  case 'tick':
                    return r.t(null, void 0, s(24821))
                }
              })({
                ...e,
                currency: e.original_currency_code || e.currency_code,
              })
            : void 0
        }
      }
    },
    38496: (e, t, s) => {
      s.r(t), s.d(t, { study_Overlay: () => De })
      var i = s(50151),
        r = s(49483),
        l = s(9343),
        o = s(46806),
        a = s(15716),
        n = s(50788),
        h = s(3070),
        c = s(68805),
        u = s(12988),
        d = s(73698),
        p = s(56570),
        _ = s(76742),
        y = s(76350),
        v = s(52270),
        m = s(64755),
        S = s(8025),
        b = s(37265),
        g = s(93280),
        f = s(64147),
        w = s(24526),
        P = s(49936),
        C = s(12374),
        x = s(98558),
        R = s(94164),
        V = s(49256),
        I = s(19063)
      const T = p.enabled('force_exchange_as_title')
      class A extends x.PriceAxisView {
        constructor(e) {
          super(), (this._source = e)
        }
        _updateRendererData(e, t, s) {
          ;(e.visible = !1), (t.visible = !1)
          const r = this._source.lastValueData('close', !1)
          if (r.noData) return
          const l = this._source.model(),
            o = this._source.priceScale()
          if (null === o) return
          if (!l.isPriceScaleVisible(o)) return
          const a = l.timeScale().visibleBarsStrictRange(),
            n = l.mainSeries().bars().lastIndex()
          if (null === a || null === n) return
          if (n <= a.lastBar())
            (s.background = (0, I.resetTransparency)(r.color)),
              (s.textColor = this.generateTextColor(r.color)),
              (e.borderVisible = !1),
              (t.borderVisible = !1)
          else {
            const o = l.backgroundColorAtYPercentFromTop(
              r.coordinate /
                (0, i.ensureNotNull)(l.paneForSource(this._source)).height(),
            )
            ;(s.background = o),
              (s.textColor = (0, I.resetTransparency)(r.color)),
              (s.borderColor = s.textColor),
              (e.borderVisible = !0),
              (t.borderVisible = !0)
          }
          ;(s.coordinate = r.coordinate),
            (s.floatCoordinate = r.floatCoordinate)
          const h = this._source
            .model()
            .properties()
            .childs()
            .scalesProperties.childs()
          h.showSeriesLastValue.value() &&
            ((e.text = (0, V.getCurrentModePriceText)(o, r)),
            h.seriesLastValueMode.value() !==
            R.PriceAxisLastValueMode.LastPriceAndPercentageValue
              ? (e.secondLine = '')
              : (e.secondLine = (0, V.getOppositeModePriceText)(o, r)),
            (e.visible = !0)),
            (t.text = ''),
            h.showSymbolLabels.value() &&
              ((t.text = this._paneText()), (t.visible = t.text.length > 0))
        }
        _paneText() {
          let e = ''
          const t = this._source.symbolInfo()
          return (
            T
              ? (e = (0, c.displayedSymbolExchange)(t))
              : this._source
                  .model()
                  .properties()
                  .childs()
                  .scalesProperties.childs()
                  .showSymbolLabels.value() &&
                (e = (0, c.displayedSymbolName)(t)),
            e
          )
        }
      }
      var L = s(37626)
      class B extends L.PriceLineAxisView {
        constructor(e) {
          super(), (this._study = e)
        }
        _value() {
          return this._study.lastValueData('', !0)
        }
        _priceLineColor(e) {
          return e
        }
        _lineWidth() {
          return 1
        }
        _isVisible() {
          const e = this._study
            .model()
            .properties()
            .childs()
            .scalesProperties.childs()
            .showSeriesLastValue.value()
          return this._study.properties().childs().showPriceLine.value() && e
        }
      }
      var k = s(51056),
        D = s(50600)
      class E {
        constructor(e) {
          ;(this._lineRenderer = new D.HorizontalLineRenderer()),
            (this._visible = !1),
            (this._source = e)
        }
        update() {
          if (
            ((this._visible = !1),
            !this._source.properties().childs().showPriceLine.value())
          )
            return
          const e = this._source.lastValueData('', !0)
          e.noData ||
            ((this._visible = !0),
            this._lineRenderer.setData({
              y: e.coordinate,
              color: e.color,
              linewidth: 1,
              linestyle: k.LINESTYLE_DOTTED,
              visible: this._visible,
            }))
        }
        renderer() {
          return this._visible ? this._lineRenderer : null
        }
      }
      var F = s(15764),
        N = s(928),
        M = s(19466),
        O = s(50335),
        H = s(11542),
        z = s(63273),
        U = s(74079),
        W = s(76748),
        $ = s(23486),
        G = s(90799),
        q = s(41991),
        j = s(82587)
      const Q =
          $.lastDayChangeAvailable || $.alwaysShowLastPriceAndLastDayChange,
        Y = r.CheckMobile.any(),
        K = (0, U.getPercentageFormatter)()
      var Z
      !((e) => {
        ;(e[(e.Open = 0)] = 'Open'),
          (e[(e.High = 1)] = 'High'),
          (e[(e.Low = 2)] = 'Low'),
          (e[(e.Close = 3)] = 'Close'),
          (e[(e.Source = 4)] = 'Source'),
          (e[(e.LastPrice = 5)] = 'LastPrice'),
          (e[(e.Change = 6)] = 'Change'),
          (e[(e.LastDayChange = 7)] = 'LastDayChange')
      })(Z || (Z = {}))
      const J = j.notAvailable,
        X = `${J} (${J}%)`
      class ee {
        constructor(e, t) {
          ;(this._study = e),
            (this._model = t),
            (this._emptyValues = [
              {
                title: H.t(null, void 0, s(16610)),
                visible: !1,
                value: '',
                index: 0,
                id: '',
              },
              {
                title: H.t(null, void 0, s(78254)),
                visible: !1,
                value: '',
                index: 1,
                id: '',
              },
              {
                title: H.t(null, void 0, s(65318)),
                visible: !1,
                value: '',
                index: 2,
                id: '',
              },
              {
                title: H.t(null, void 0, s(62578)),
                visible: !1,
                value: '',
                index: 3,
                id: '',
              },
              { title: '', visible: !1, value: '', index: 4, id: '' },
              { title: '', visible: !1, value: '', index: 5, id: '' },
              {
                title: H.t(null, void 0, s(37276)),
                visible: !1,
                value: '',
                index: 6,
                id: '',
              },
              {
                title: H.t(null, void 0, s(63815)),
                visible: !1,
                value: '',
                index: 7,
                id: '',
              },
            ])
        }
        getItems() {
          return this._emptyValues
        }
        getValues(e) {
          const t = this._emptyValues.map((e) => ({ ...e }))
          if (this._model.timeScale().isEmpty()) return t
          const s = this._study.data(),
            i = s.lastIndex()
          if (0 === s.size() || null === i) return t
          const r = s.search(i, S.PlotRowSearchMode.NearestLeft, 1)
          if (null === r) return t
          const l = this._showLastPriceAndChangeOnly()
          if (
            ((0, O.isNumber)(e) ||
              (l
                ? (e = i)
                : ((e = this._model.crosshairSource().appliedIndex()),
                  (0, O.isNumber)(e) || (e = i))),
            null === e || !(0, O.isNumber)(e))
          )
            return t
          const o = s.search(e, S.PlotRowSearchMode.NearestLeft, 1),
            a = this._model.backgroundTopColor().value()
          if (null === o) return t
          const n = o.index,
            h = o.value,
            c = h[1],
            u = h[2],
            d = h[3],
            p = h[4]
          ;(t[0].value = J),
            (t[1].value = J),
            (t[2].value = J),
            (t[3].value = J),
            (t[7].value = X),
            (t[6].value = X)
          for (const e of t) e.visible = !l
          const _ = t[4]
          _.visible = !1
          const { barChange: y, lastDayChange: v } = (0, W.changesData)(
              s,
              this._study.quotes(),
              o.value,
              o.index,
              r.value,
            ),
            m = (0, q.getPriceValueFormatterForSource)(this._study)
          if (
            (0, q.shouldBeFormattedAsPercent)(this._study) ||
            (0, q.shouldBeFormattedAsIndexedTo100)(this._study)
          )
            (t[7].value = ''), (t[6].value = '')
          else {
            const e = this._study.formatter(),
              s = { signPositive: !0 }
            if (void 0 !== y) {
              const { currentPrice: i, prevPrice: r, change: l } = y,
                o = e.formatChange?.(i, r, s) ?? e.format(l, s)
              t[6].value = (0, z.forceLTRStr)(
                `${o} (${K.format(y.percentChange, s)})`,
              )
            }
            if (void 0 !== v) {
              const {
                  currentPrice: i,
                  prevPrice: r,
                  change: l,
                  percentChange: o,
                } = v,
                a = e.formatChange?.(i, r, s) ?? e.format(l, s)
              t[7].value = (0, z.forceLTRStr)(`${a} (${K.format(o, s)})`)
            }
          }
          let b = null
          if (l)
            (t[5].value = null == p ? J : m(p)),
              (t[5].visible = !0),
              (b = this._getChangeColor(y?.change)),
              (t[6].visible = void 0 !== y),
              (t[7].visible = void 0 !== v || Q)
          else {
            ;(t[0].value = null == c ? J : m(c)),
              (t[1].value = null == u ? J : m(u)),
              (t[2].value = null == d ? J : m(d)),
              (t[3].value = null == p ? J : m(p)),
              (_.value = m(this._study.barFunction()(h))),
              (t[5].visible = !1)
            const e = this._model.mainSeries().intervalObj().is1Tick(),
              s = 21 !== this._study.properties().childs().style.value()
            ;(t[0].visible = !e && s),
              (t[1].visible = !e),
              (t[2].visible = !e),
              (t[7].visible = void 0 !== v || Q),
              (t[6].visible = void 0 !== y)
            const i = this._study.barColorer().barStyle(n, !1),
              r = i.barBorderColor ?? i.barColor
            b = (0, W.calculateColor)(a, r)
          }
          b = (0, I.resetTransparency)((0, W.calculateColor)(a, b))
          for (const e of t) e.color || (e.color = b)
          return (
            t[7].visible &&
              (t[7].color = (0, I.resetTransparency)(
                (0, W.calculateColor)(a, this._getChangeColor(v?.change)),
              )),
            t
          )
        }
        _mobileNonTrackingMode() {
          return (
            Y &&
            (null === this._model.crosshairSource().pane ||
              (0, F.isLineToolName)(N.tool.value()) ||
              null !== this._model.lineBeingEdited())
          )
        }
        _showLastPriceAndChangeOnly() {
          return (
            $.alwaysShowLastPriceAndLastDayChange ||
            this._mobileNonTrackingMode()
          )
        }
        _getChangeColor(e) {
          const t =
            void 0 === e || e >= 0
              ? G.SeriesBarColorer.upColor(this._study.properties())
              : G.SeriesBarColorer.downColor(this._study.properties())
          return t.barBorderColor ?? t.barColor
        }
      }
      var te = s(22839)
      const se = r.CheckMobile.any()
      class ie extends te.StudyDataWindowView {
        _updateImpl() {
          this._header = this._study.title(M.TitleDisplayTarget.DataWindow)
          let e
          this._showLastPriceAndChangeOnly()
            ? (e = this._study.data().lastIndex())
            : ((e = this._model.crosshairSource().appliedIndex()),
              (null === e || isNaN(e)) &&
                ((e = this._study.data().lastIndex()),
                p.enabled('use_last_visible_bar_value_in_legend') &&
                  (e =
                    this._model
                      .timeScale()
                      .visibleBarsStrictRange()
                      ?.lastBar() ?? Number.NaN)))
          const t = this._valueProvider.getValues(e)
          for (let e = 0; e < t.length; ++e) {
            const s = t[e],
              i = this._items[e]
            i.setValue(s.value), i.setVisible(s.visible), i.setColor(s.color)
          }
        }
        _showLastPriceAndChangeOnly() {
          return (
            se &&
            (null === this._model.crosshairSource().pane ||
              (0, F.isLineToolName)(N.tool.value()) ||
              null !== this._model.lineBeingEdited())
          )
        }
        _createValuesProvider(e, t) {
          return new ee(e, t)
        }
      }
      var re = s(44672)
      class le extends ee {
        constructor(e, t) {
          super(e, t)
          const s = t
            .properties()
            .childs()
            .paneProperties.childs()
            .legendProperties.childs()
          ;(this._showBarChange = s.showBarChange),
            (this._showLastDayChange = s.showLastDayChange),
            (this._showSeriesOHLC = s.showSeriesOHLC)
        }
        getValues(e) {
          const t = super.getValues(e),
            s = this._study.properties().childs(),
            i = s.style.value(),
            r = 12 !== i,
            l = this._showSeriesOHLC.value(),
            o = r && this._showBarChange.value(),
            a = r && this._showLastDayChange.value()
          if (this._showLastPriceAndChangeOnly())
            return (t[6].visible &&= o), (t[7].visible = !1), t
          const n = (0, c.isPriceSourceStyle)(i),
            h = 12 !== i && 16 !== i && 21 !== i,
            u = 12 !== i,
            d = this._model.mainSeries().intervalObj().is1Tick(),
            p = l && !n,
            _ = l && n
          if (
            ((t[0].visible = p && h && !d),
            (t[1].visible = p && !d),
            (t[2].visible = p && !d),
            (t[3].visible = p && u),
            (t[7].visible &&= a),
            (t[6].visible &&= o),
            (t[4].visible = _),
            16 === i)
          ) {
            const e = s.hlcAreaStyle.childs()
            ;(t[1].color = e.highLineColor.value()),
              (t[2].color = e.lowLineColor.value()),
              (t[3].color = e.closeLineColor.value())
          }
          return t
        }
      }
      var oe = s(84425)
      class ae extends ie {
        constructor(e, t) {
          super(e, t),
            (this._additional = null),
            (this._studyOverlay = e),
            (this._backgroundColorSpawn = t.backgroundTopColor().spawn()),
            this._backgroundColorSpawn.subscribe(
              this.update.bind(this, (0, re.sourceChangeEvent)(e.id())),
            )
          const s = t
            .properties()
            .childs()
            .paneProperties.childs()
            .legendProperties.childs()
          ;(this._visibilityProperty = (0, oe.combineProperty)(
            (e, t) => e || t,
            s.showBarChange.weakReference(),
            s.showSeriesOHLC.weakReference(),
          )),
            this._visibilityProperty.subscribe(
              this,
              this.update.bind(this, (0, re.sourceChangeEvent)(e.id())),
            )
        }
        areValuesVisible() {
          return this._visibilityProperty.value()
        }
        additional() {
          return this._additional
        }
        destroy() {
          this._backgroundColorSpawn.destroy(),
            this._visibilityProperty.destroy()
        }
        _updateImpl() {
          super._updateImpl()
        }
        _createValuesProvider(e, t) {
          return new le(e, t)
        }
      }
      var ne = s(65458),
        he = s(99800),
        ce = s(72476),
        ue = s(80941),
        de = s(84626),
        pe = s(70527),
        _e = s(93250),
        ye = s(15599),
        ve = s(53766),
        me = s(83379),
        Se = s(42989),
        be = s(44158)
      class ge extends be.StudyStatusProvider {
        getSplitTitle() {
          return this._source.titleInParts(
            M.TitleDisplayTarget.StatusLine,
            !0,
            void 0,
            !1,
            !1,
          )
        }
        text() {
          return this._source.isActualInterval()
            ? this._source.isFailed()
              ? `${this._source.title(M.TitleDisplayTarget.StatusLine, !0, void 0, !1, !1)}: ${this.sourceStatusText()}`
              : `${this._source.title(M.TitleDisplayTarget.StatusLine, !0, void 0, !1, !1)} ${this.sourceStatusText()}`
            : this._source.title(
                M.TitleDisplayTarget.StatusLine,
                !0,
                void 0,
                !1,
                !1,
              )
        }
      }
      var fe = s(18032),
        we = s(85856)
      const Pe =
          p.enabled('show_symbol_logos') &&
          p.enabled('show_symbol_logo_in_legend') &&
          p.enabled('show_symbol_logo_for_compare_studies'),
        Ce = p.enabled('legend_last_day_change'),
        xe = (r.CheckMobile.any() || Pe || Ce) && !1,
        Re = p.enabled('study_overlay_compare_legend_option'),
        Ve = p.enabled('secondary_series_extend_time_scale'),
        Ie = p.enabled('hide_unresolved_symbols_in_legend'),
        Te = !p.enabled('hide_study_overlay_legend_item'),
        Ae = p.enabled('symbol_info_price_source'),
        Le = (0, l.getLogger)('Chart.StudyOverlay')
      var Be
      function ke(e, t) {
        return null == e[t]
      }
      !((e) => {
        e.SnapShotSymbolInfoKey = '___snapshot'
      })(Be || (Be = {}))
      class De extends o.Study {
        constructor(e, t, s, i, r) {
          super(
            e,
            ((e) => {
              e.hasChild('currencyId') ||
                e.addChild('currencyId', new u.Property(null)),
                e.hasChild('unitId') ||
                  e.addChild('unitId', new u.Property(null)),
                (0, Se.allChartStyles)().includes(e.childs().style.value()) ||
                  e.childs().style.setValueSilently(2)
              const t = e.childs()
              if (t.lineStyle.hasChild('styleType')) {
                const e = t.lineStyle.childs(),
                  s = e.styleType.value()
                let i, r
                0 === s && ((r = 14), (i = t.lineWithMarkersStyle.childs())),
                  1 === s && ((r = 15), (i = t.steplineStyle.childs())),
                  i &&
                    (i.color.setValueSilently(e.color.value()),
                    i.linestyle.setValueSilently(e.linestyle.value()),
                    i.linewidth.setValueSilently(e.linewidth.value()),
                    i.priceSource.setValueSilently(e.priceSource.value())),
                  void 0 !== r &&
                    2 === t.style.value() &&
                    t.style.setValueSilently(r),
                  t.lineStyle.removeProperty('styleType')
              }
              return (
                e.addExcludedKey('currencyId', 1),
                e.addExcludedKey('unitId', 1),
                e
              )
            })(t),
            s,
            i,
            r,
          ),
            (this._symbolResolvingActive = new f.WatchedValue(!1)),
            (this._symbolHibernated = new f.WatchedValue(!1)),
            (this._styleToRecover = null),
            (this._isActingAsSymbolSource = new f.WatchedValue(!0)),
            (this._realignToolsLastParams = null),
            (this._precomputedBarStyles = new WeakMap()),
            (this._lastResolvedSymbolSource = ''),
            (this._data = new m.PlotList((0, h.seriesPlotFunctionMap)(), ke)),
            (this._quotesProvider = new _.QuotesProvider(
              void 0,
              e.collapsed().spawnOwnership(),
            )),
            xe &&
              this._quotesProvider
                .quotesUpdate()
                .subscribe(this, this._onQuotesUpdate)
          const l = this.properties().childs()
          l.currencyId.subscribe(this, this._onCurrencyChanged),
            l.unitId.subscribe(this, this._onUnitChanged),
            l.allowExtendTimeScale.subscribe(
              this,
              this._onAllowExtendTimeScaleChanged,
            ),
            this._onAllowExtendTimeScaleChanged(),
            l.style.subscribe(this, this._onChartStyleChanged),
            l.lineStyle
              .childs()
              .priceSource.subscribe(this, this._updateBarFunction),
            l.lineWithMarkersStyle
              .childs()
              .priceSource.subscribe(this, this._updateBarFunction),
            l.steplineStyle
              .childs()
              .priceSource.subscribe(this, this._updateBarFunction),
            l.areaStyle
              .childs()
              .priceSource.subscribe(this, this._updateBarFunction),
            l.baselineStyle
              .childs()
              .priceSource.subscribe(this, this._updateBarFunction),
            l.columnStyle
              .childs()
              .priceSource.subscribe(this, this._updateBarFunction),
            this._updateBarFunction(),
            l.minTick.subscribe(this, this._onMinTickChanged),
            (this._formatter = null),
            (this._defaultFormatter = null),
            e
              .mainSeries()
              .onIntervalChanged()
              .subscribe(this, () => e.realignLineTools(this)),
            e
              .mainSeries()
              .onIntervalChanged()
              .subscribe(this, () => this._checkStyle()),
            (this._conflatedChunksBuilder = new we.ConflatedChunksBuilder(
              this._data,
              (e) => h.barFunctions[e],
            ))
        }
        destroy() {
          this._model.mainSeries().onIntervalChanged().unsubscribeAll(this),
            this._quotesProvider.destroy(),
            super.destroy()
        }
        isActingAsSymbolSource() {
          return this._isActingAsSymbolSource.readonly()
        }
        precomputedBarStyle(e) {
          return this._precomputedBarStyles.get(e)
        }
        setPrecomputedBarStyle(e, t) {
          this._precomputedBarStyles.set(e, t)
        }
        properties() {
          return this._properties
        }
        barColorer() {
          return new G.SeriesBarColorer({
            data: () => this.data(),
            bars: () => this.data(),
            nsBars: () => new m.PlotList(),
            priceScale: () => (0, i.ensureNotNull)(this.priceScale()),
            properties: () => this.properties(),
            firstValue: () => this.firstValue(),
            barFunction: () => this.barFunction(),
            lineColorAtYPercentFromTop: (e) =>
              this.lineColorAtYPercentFromTop(e),
          })
        }
        symbolParams() {
          return (0, y.symbolParams)(this)
        }
        compareSymbolParams(e) {
          return (0, y.compareSymbolParams)(
            this,
            e,
            this._model.unitConversionEnabled(),
          )
        }
        async setSymbolParams(e) {
          this._setSymbolParamsInternal(e)
        }
        symbol() {
          return this.properties().childs().inputs.childs().symbol.value()
        }
        symbolChanged() {
          return this.properties().childs().inputs.childs().symbol
        }
        setSymbol(e) {
          this.setSymbolParams({ symbol: e })
        }
        symbolInfo() {
          if (!this._resolvedSymbols) return null
          const e = this._properties.childs().inputs.childs().symbol.value()
          if (!e) return null
          let t
          return (
            (t = this._resolvedSymbols[this._getSymbolForResolve(e)] || null), t
          )
        }
        supportsConflatedChunks() {
          return !0
        }
        conflatedChunks(e, t) {
          return this._conflatedChunksBuilder.conflatedChunks(e, t)
        }
        symbolResolved() {
          return this.symbolsResolved()
        }
        symbolResolvingActive() {
          return this._symbolResolvingActive
        }
        symbolHibernated() {
          return this._symbolHibernated
        }
        isVisible() {
          const e = super.isVisible()
          return this._symbolHibernated.setValue(!e), e
        }
        symbolSameAsCurrent(e) {
          return (0, y.symbolSameAsCurrent)(e, this.symbolInfo())
        }
        symbolSameAsResolved(e) {
          return (0, v.symbolSameAsResolved)(
            e,
            this._lastResolvedSymbolSource,
            this.symbol(),
          )
        }
        priceSource() {
          const e = this.properties().childs()
          switch (e.style.value()) {
            case 2:
              return e.lineStyle.childs().priceSource.value()
            case 14:
              return e.lineWithMarkersStyle.childs().priceSource.value()
            case 15:
              return e.steplineStyle.childs().priceSource.value()
            case 3:
              return e.areaStyle.childs().priceSource.value()
            case 10:
              return e.baselineStyle.childs().priceSource.value()
            case 13:
              return e.columnStyle.childs().priceSource.value()
          }
          return null
        }
        barFunction() {
          return this._barFunction
        }
        quotesProvider() {
          return this._quotesProvider
        }
        quotes() {
          return this._quotesProvider.quotes()
        }
        currency() {
          return this.properties().childs().currencyId.value() || null
        }
        setCurrency(e) {
          this.setSymbolParams({ currency: e })
        }
        isConvertedToOtherCurrency() {
          return (0, c.isConvertedToOtherCurrency)(this.symbolInfo())
        }
        unit() {
          return this.properties().childs().unitId.value() || null
        }
        setUnit(e) {
          this.setSymbolParams({ unit: e })
        }
        isConvertedToOtherUnit() {
          return (0, c.isConvertedToOtherUnit)(
            this.symbolInfo(),
            this._model.unitConversionEnabled(),
          )
        }
        style() {
          return this.properties().childs().style.value()
        }
        setStyle(e) {
          this.setSymbolParams({ style: e })
        }
        interval() {
          return this._model.mainSeries().interval()
        }
        setInterval(e) {}
        valueAt(e, t) {
          return this.data().search(e)?.value[t] ?? null
        }
        symbolSource() {
          return this
        }
        barsProvider() {
          return this
        }
        state(e, t) {
          const s = super.state(e, t)
          this._model.unitConversionEnabled() || delete s.state.unitId
          const r = this.symbol()
          return (
            (s.state.inputs.symbol = (0, c.symbolToSaveInState)(
              this.symbolInfo() ??
                this._model.chartApi().lastSymbolResolveInfo(r),
              r,
            )),
            e &&
              ((0, i.ensureDefined)(s.data).symbols = {
                ___snapshot: this.symbolInfo() || void 0,
              }),
            s
          )
        }
        symbolTitle(e, t, s) {
          return this.title(e, !0, {}, !1, t)
        }
        title(e, t, s, i, r) {
          const l = this._titleInParts(e, t, s, i, r)
          return [l[0], ...(l[1] ?? [])].join(` ${c.symbolTitleSeparator} `)
        }
        titleInParts(e, t, s, i, r) {
          return [this.title(e, t, s, i, r)]
        }
        firstValue() {
          const e = this._model.timeScale().visibleBarsStrictRange()
          if (null === e) return null
          const t = e.firstBar()
          if (0 === this.data().size()) return this._ownFirstValue
          const s = this.data().search(t, S.PlotRowSearchMode.NearestRight, 1)
          return (
            (this._ownFirstValue =
              null !== s ? this._barFunction(s.value, 0) : null),
            this._ownFirstValue
          )
        }
        lineColorAtYPercentFromTop(e) {
          switch (this.style()) {
            case 2:
              return this.properties().childs().lineStyle.childs().color.value()
            case 14:
              return this.properties()
                .childs()
                .lineWithMarkersStyle.childs()
                .color.value()
            case 15:
              return this.properties()
                .childs()
                .steplineStyle.childs()
                .color.value()
          }
          return null
        }
        lastValueData(e, t, s) {
          const i = { noData: !0 },
            r = this.priceScale()
          if (
            this._model.timeScale().isEmpty() ||
            null === r ||
            r.isEmpty() ||
            this.data().isEmpty()
          )
            return i
          const l = this._model.timeScale().visibleBarsStrictRange()
          if (null === l) return i
          const o = this.properties().childs()
          if (!o.visible.value()) return i
          const a = this.nearestIndex(
            l.lastBar(),
            S.PlotRowSearchMode.NearestLeft,
            1,
          )
          if (void 0 === a) return i
          const n = this.firstValue()
          if (null === n) return i
          const h = this._lastNonEmptyPlotRow(4),
            c = null !== h && l.contains(h.index),
            u = null !== h ? h.value : null,
            d = t || c ? u : this.data().valueAt(a)
          if (null === d) return i
          const p = this._barFunction(d, 2)
          if (!(0, b.isNumber)(p)) return i
          const _ = r.priceToCoordinate(p, n)
          let y
          switch (o.style.value()) {
            case 0:
              y =
                d[1] <= d[4]
                  ? o.barStyle.childs().upColor.value()
                  : o.barStyle.childs().downColor.value()
              break
            case 1:
              y =
                d[1] <= d[4]
                  ? o.candleStyle.childs().upColor.value()
                  : o.candleStyle.childs().downColor.value()
              break
            case 9:
              y =
                d[1] <= d[4]
                  ? o.hollowCandleStyle.childs().upColor.value()
                  : o.hollowCandleStyle.childs().downColor.value()
              break
            case 13:
              y =
                d[1] <= d[4]
                  ? o.columnStyle.childs().upColor.value()
                  : o.columnStyle.childs().downColor.value()
              break
            case 2:
              y = o.lineStyle.childs().color.value()
              break
            case 14:
              y = o.lineWithMarkersStyle.childs().color.value()
              break
            case 15:
              y = o.steplineStyle.childs().color.value()
              break
            case 3:
              y = o.areaStyle.childs().linecolor.value()
              break
            case 16:
              y = o.hlcAreaStyle.childs().closeLineColor.value()
              break
            case 10: {
              const e = o.baselineStyle.childs()
              y =
                _ <
                Math.round(
                  r.height() *
                    (Math.abs(100 - e.baseLevelPercentage.value()) / 100),
                )
                  ? e.topLineColor.value()
                  : e.bottomLineColor.value()
              break
            }
            case 12:
              y = o.hiloStyle.childs().color.value()
              break
            case 21:
              y = o.hlcBarsStyle.childs().color.value()
              break
            default:
              throw new Error('Not supported overlay style')
          }
          const v = {
            ...r.getFormattedValues(p, n, !0),
            noData: !1,
            floatCoordinate: _,
            coordinate: _,
            color: y,
          }
          return s && (v.price = p), v
        }
        priceRange(e, t, s) {
          if (s.forceOverlayOnly) return null
          if (!(0, b.isInteger)(e))
            return Le.logDebug('priceRange: incorrect startBar'), null
          if (!(0, b.isInteger)(t))
            return Le.logDebug('priceRange: incorrect endBar'), null
          if (0 === this.data().size()) return null
          const i = this.priceSource()
          let r
          r =
            null !== i
              ? this.data().minMaxOnRangeCached(e, t, [{ name: i, offset: 0 }])
              : this.data().minMaxOnRangeCached(e, t, [
                  { name: 'low', offset: 0 },
                  { name: 'high', offset: 0 },
                ])
          const l = null !== r ? new g.PriceRange(r.min, r.max) : null
          return this._postProcessPriceRange(l, s)
        }
        bars() {
          return this.data()
        }
        open(e) {
          return (0, i.ensureNotNull)(this.bars().valueAt(e))[1]
        }
        high(e) {
          return (0, i.ensureNotNull)(this.bars().valueAt(e))[2]
        }
        low(e) {
          return (0, i.ensureNotNull)(this.bars().valueAt(e))[3]
        }
        close(e) {
          return (0, i.ensureNotNull)(this.bars().valueAt(e))[4]
        }
        hl2(e) {
          return (this.high(e) + this.low(e)) / 2
        }
        hlc3(e) {
          return (this.high(e) + this.low(e) + this.close(e)) / 3
        }
        ohlc4(e) {
          return (this.open(e) + this.high(e) + this.low(e) + this.close(e)) / 4
        }
        canBeHiddenByGlobalFlag() {
          return !1
        }
        async start(e, t) {
          ;(this._formatter = null), (this._defaultFormatter = null)
          const s = super.start(e, t)
          return (
            this.priceScale()?.updateFormatter(),
            xe &&
              this._setQuotesSymbol(
                (0, d.encodeExtendedSymbolOrGetSimpleSymbolString)(
                  this._getSymbolObject(this.symbol()),
                ),
              ),
            s
          )
        }
        stop(e) {
          super.stop(e), this._quotesProvider.setQuotesSessionSymbol(null)
        }
        formatter() {
          return (
            this._formatter || this._recreateFormatter(),
            (0, i.ensureNotNull)(this._formatter)
          )
        }
        statusView() {
          return Te ? super.statusView() : null
        }
        moveItem(e, t, s) {
          if (10 === this.style() && 0 === t) {
            const t = (0, i.ensureNotNull)(this.priceScale()),
              s = this.properties().childs().baselineStyle,
              r = t.height(),
              l = 100 - (e.y / r) * 100,
              o = l < 0 ? 0 : Math.round(10 * l) / 10
            s.childs().baseLevelPercentage.setValue(
              Math.max(Math.min(o, 100), 0),
            )
          }
        }
        measureUnitId() {
          return (0, c.measureUnitId)(this.symbolInfo())
        }
        dataUpdated() {
          return this._dataUpdated
        }
        alertCreationAvailable() {
          return new f.WatchedValue(
            !this.priceScale()?.isPercentage() &&
              super.alertCreationAvailable().value(),
          ).readonly()
        }
        legendValuesProvider() {
          return new le(this, this.model())
        }
        defaultPlotIdForAlert() {
          return ''
        }
        tags() {
          const e = [],
            t = this.symbolInfo()
          if (t) e.push(t.name)
          else {
            const t = this.symbol()
            t && e.push(t)
          }
          return e
        }
        statusProvider(e) {
          return new ge(this)
        }
        _onPropertiesChanged() {
          super._onPropertiesChanged(),
            (this._precomputedBarStyles = new WeakMap())
        }
        async _tryChangeInputs() {
          await super._tryChangeInputs(),
            (this._formatter = null),
            (this._defaultFormatter = null),
            this.priceScale()?.updateFormatter()
        }
        _tryCreateFormatter() {
          const e =
            w.customFormatters?.priceFormatterFactory?.(
              this.symbolInfo(),
              this.properties().childs().minTick.value(),
            ) ?? null
          return null !== e
            ? e
            : (0, c.createSeriesFormatter)(
                this.symbolInfo(),
                this.properties().childs().minTick.value(),
              )
        }
        _tryCreateDefaultFormatter() {
          return (0, c.createSeriesFormatter)(this.symbolInfo(), 'default')
        }
        _onUnitChanged() {
          'alwaysOff' !== (0, n.currencyUnitVisibilityProperty)().value() &&
            this._model.fullUpdate(),
            this._model.unitConversionEnabled() &&
              this.isStarted() &&
              this._tryChangeInputs(),
            this._unitChanged.fire()
        }
        _getSymbolObject(e) {
          const t = super._getSymbolObject(e),
            s = this.currency()
          null !== s && (t['currency-id'] = s)
          const i = this.unit()
          return (
            this._model.unitConversionEnabled() &&
              null !== i &&
              (t['unit-id'] = i),
            t
          )
        }
        _onSymbolResolvingStart(e, t) {
          ;(this._lastResolvedSymbolSource = t),
            super._onSymbolResolvingStart(e, t),
            this._symbolResolvingActive.setValue(!0)
        }
        _onSymbolError() {
          super._onSymbolError(), this._symbolResolvingActive.setValue(!1)
        }
        _onSymbolResolved(e, t, s) {
          super._onSymbolResolved(e, t, s),
            this._recreatePriceFormattingDependencies()
          const i =
              t === this.symbol()
                ? (0, c.extractSymbolNameFromSymbolInfo)(s, this.symbol())
                : null,
            r = (0, c.symbolCurrency)(s),
            l = (0, c.symbolUnit)(s, this._model.unitConversionEnabled())
          this._setSymbolParamsInternal(
            { symbol: i ?? void 0, currency: r, unit: l },
            s,
          ),
            xe &&
              this._setQuotesSymbol(
                (0, d.encodeExtendedSymbolOrGetSimpleSymbolString)(
                  this._getSymbolObject(this.symbol()),
                ),
              ),
            this._checkStyle(),
            this._symbolResolvingActive.setValue(!1)
        }
        async _changeInputsImpl(e, t) {
          await super._changeInputsImpl(e, t),
            this._realignLineToolsIfParamsChanged()
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            s.e(9028),
            s.e(3889),
            s.e(8009),
            s.e(4482),
            s.e(607),
          ])
            .then(s.bind(s, 15306))
            .then((e) => e.StudyOverlayDefinitionsViewModel)
        }
        _setQuotesSymbol(e) {
          const t = this.symbolInfo(),
            s = (0, c.extractSymbolNameFromSymbolInfo)(t, e)
          this._quotesProvider.setQuotesSessionSymbol(s)
        }
        _onQuotesUpdate(e, t) {
          !this._legendView ||
            (void 0 === t.values.change &&
              void 0 === t.values.change_percent) ||
            (this._legendView.update((0, re.sourceChangeEvent)(this.id())),
            this._model.updateSource(this))
        }
        _createViews() {
          this._priceAxisViews = []
          const e = new A(this)
          this._priceAxisViewsBase = [e]
          const t = new B(this)
          ;(this._priceLinesAxisViews = [t]),
            (this._paneViews = []),
            (this._labelPaneViews = [])
          let s = null,
            r = null
          switch (this.properties().childs().style.value()) {
            case 0:
              r = new he.SeriesBarsPaneView(this, this._model)
              break
            case 1:
              r = new ce.SeriesCandlesPaneView(this, this._model)
              break
            case 9:
              r = new ye.SeriesHollowCandlesPaneView(this, this._model)
              break
            case 13:
              r = new ve.SeriesColumnsPaneView(this, this._model)
              break
            case 2:
            case 14:
            case 15:
              r = new ue.SeriesLinePaneView(this, this._model)
              break
            case 3:
              r = new de.SeriesAreaPaneView(this, this._model)
              break
            case 16:
              r = new pe.SeriesHLCAreaPaneView(this, this._model)
              break
            case 10: {
              r = new _e.SeriesBaselinePaneView(this, this._model)
              const e = this.properties().childs().baselineStyle.childs()
              s = new C.SeriesWaterlinePaneView({
                paneHeight: () =>
                  (0, i.ensureNotNull)(this.priceScale()).height(),
                color: () => e.baselineColor.value(),
                baseLevelPercentage: () => e.baseLevelPercentage.value(),
              })
              break
            }
            case 12:
              r = new me.SeriesHiLoPaneView(this, this._model)
              break
            case 21:
              r = new fe.SeriesHLCBarsPaneView(this, this._model)
          }
          r && this._paneViews.push(r),
            null !== s && this._paneViews.push(s),
            this._paneViews.push(new E(this)),
            this._dataWindowView ||
              (this._dataWindowView = new ie(this, this._model)),
            this._legendView || (this._legendView = new ae(this, this._model)),
            this._statusView ||
              (this._statusView = new P.StudyStatusView(this)),
            (this._priceAxisViews = [...this._priceAxisViewsBase]),
            this._labelPaneViews.push(
              new ne.PanePriceAxisView(e, this, this._model),
            )
        }
        _createStudyOnServer() {
          const e = super._createStudyOnServer()
          return this._realignLineToolsIfParamsChanged(), e
        }
        _modifyStudyOnServer(e) {
          super._modifyStudyOnServer(e, 0)
        }
        _titleInParts(e, t, s, i, r) {
          const l = this.symbolInfo()
          return [
            this._getSymbolTitlePart(l),
            [
              this._getExchangeTitlePart(l, r),
              this._getPriceSourceTitlePart(l),
            ].filter((e) => null !== e),
          ]
        }
        _mergeData(e) {
          return (
            this._invalidateLastNonEmptyPlotRowCache(),
            this._conflatedChunksBuilder.mergeData(e)
          )
        }
        _clearData() {
          this._conflatedChunksBuilder.clearData()
        }
        _moveData(e) {
          this._conflatedChunksBuilder.moveData(e)
        }
        _getSymbolTitlePart(e) {
          if (null === e)
            return Ie
              ? ''
              : this.properties().childs().inputs.childs().symbol.value()
          if (Re)
            switch (
              this._model.mainSeries().symbolTextSourceProxyProperty().value()
            ) {
              case 'description':
                return e.description
              case 'ticker-and-description':
                return `${e.name}, ${e.description}`
              case 'long-description':
                return e.long_description ?? e.description
            }
          return e.name
        }
        _getExchangeTitlePart(e, t) {
          return null === e || t ? null : (0, c.getSymbolExchange)(e)
        }
        _getPriceSourceTitlePart(e) {
          return Ae &&
            !1 !==
              this._model
                .properties()
                .childs()
                .paneProperties.childs()
                .legendProperties.childs()
                .showPriceSource.value() &&
            void 0 !== e?.price_source_id
            ? (this._model
                .availablePriceSources(
                  this.getSymbolString(this._getSymbolForApi(this.symbol())),
                )
                .name(e.price_source_id) ?? null)
            : null
        }
        _onAllowExtendTimeScaleChanged() {
          if (!Ve) return
          const e = this.isStarted()
          e && this.stop(!0)
          const t = this.properties().childs().allowExtendTimeScale.value()
          this.properties()
            .childs()
            .inputs.childs()
            .extendTimeScale.setValue(t),
            e && this.start(!0)
        }
        _setSymbolParamsInternal(e, t) {
          const { symbol: s, currency: i, unit: r, style: l } = e,
            o = this.properties().childs(),
            a = o.inputs.childs().symbol.value(),
            n = o.currencyId.value(),
            h = o.unitId.value(),
            u = o.style.value()
          if (
            (void 0 !== s && o.inputs.childs().symbol.setValueSilently(s),
            void 0 !== i && o.currencyId.setValueSilently(i),
            void 0 !== r && o.unitId.setValueSilently(r),
            void 0 !== l && o.style.setValueSilently(l),
            t)
          )
            (this._resolvedSymbolsByInput[this.symbol()] = t),
              (this._resolvedSymbols[this._getSymbolForResolve(this.symbol())] =
                t),
              (this._realignToolsLastParams = null)
          else {
            const e = this.symbolInfo()
            null !== e &&
              (o.currencyId.setValueSilently((0, c.symbolCurrency)(e)),
              o.unitId.setValueSilently(
                (0, c.symbolUnit)(e, this._model.unitConversionEnabled()),
              ))
          }
          o.inputs.childs().symbol.value() !== a &&
            o.inputs.childs().symbol.fireChanged(),
            o.currencyId.value() !== n && o.currencyId.fireChanged(),
            o.unitId.value() !== h && o.unitId.fireChanged(),
            o.style.value() !== u && o.style.fireChanged(),
            this._checkStyle(),
            this._realignLineToolsIfParamsChanged()
        }
        _updateBarFunction() {
          this._barFunction = (0, a.barFunctionByStyle)(
            this.style(),
            this.priceSource(),
          )
        }
        _onMinTickChanged() {
          this._recreatePriceFormattingDependencies(),
            this.updateAllViews({ type: 'global-change' }),
            this._model.fullUpdate()
        }
        _onChartStyleChanged() {
          this._updateBarFunction(),
            this._styleToRecover?.originalStyle !== this.style() &&
              (this._styleToRecover = null)
        }
        _checkStyle() {
          const e = this.style()
          ;(0, c.isCloseBasedSymbol)(this.symbolInfo()) ||
          this.model().mainSeries().intervalObj().is1Tick()
            ? (0, c.isSingleValueBasedStyle)(e) ||
              (this.setStyle(2),
              (this._styleToRecover = {
                correctedStyle: this.style(),
                originalStyle: e,
              }))
            : null !== this._styleToRecover &&
              (this.setStyle(this._styleToRecover.originalStyle),
              (this._styleToRecover = null))
        }
        _realignLineToolsIfParamsChanged() {
          let e = null === this._realignToolsLastParams
          if (null !== this._realignToolsLastParams) {
            const t = this.compareSymbolParams(this._realignToolsLastParams)
            e =
              t.symbolChanged ||
              t.intervalChanged ||
              t.currencyChanged ||
              t.unitChanged
          }
          e &&
            (this._model.realignLineTools(this),
            (this._realignToolsLastParams = this.symbolParams()))
        }
      }
    },
  },
])
