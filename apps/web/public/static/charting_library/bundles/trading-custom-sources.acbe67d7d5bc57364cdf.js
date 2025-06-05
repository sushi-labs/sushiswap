;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2650],
  {
    289705: (t, e, i) => {
      i.r(e), i.d(e, { ExecutionsService: () => c })
      var s = i(650151),
        r = i(372605),
        o = i(918114),
        n = i(481853),
        a = i(466052),
        l = i(481330)
      class c extends n.BrokerService {
        constructor(t, e, i) {
          super(t),
            (this._allExecutionsID = new Set()),
            (this._executions = []),
            (this._executionsAdded = new a.Delegate()),
            (this._executionsCleared = new a.Delegate()),
            (this._formatter = new o.PriceFormatter()),
            (this._symbol = ''),
            (this._dataEvents = e),
            (this._getSymbolName = i),
            (this._initialized = !0),
            this._tryToStart()
        }
        destroy() {
          this.stopService()
        }
        formatter() {
          return this._formatter
        }
        executions() {
          return this._executions
        }
        executionsAdded() {
          return this._executionsAdded
        }
        executionsCleared() {
          return this._executionsCleared
        }
        startService() {
          var t
          ;(null === (t = this.activeBroker()) || void 0 === t
            ? void 0
            : t.config.supportExecutions) &&
            ((this._canBeStarted = !0), this._tryToStart())
        }
        stopService() {
          ;(this._canBeStarted = !1), this._isStarted && this._stop()
        }
        _tryToStart() {
          ;(0, s.assert)(
            !this._isStarted,
            "Execution's service has already started",
          ),
            this._canBeStarted && this._initialized && this._start()
        }
        _start() {
          ;(0, s.assert)(
            !this._isStarted,
            "Execution's service has already started",
          ),
            (this._isStarted = !0),
            this._dataEvents
              .symbolResolved()
              .subscribe(this, this._createExecutions),
            this._dataEvents
              .symbolError()
              .subscribe(this, this._createExecutions),
            this._createExecutions()
        }
        _stop() {
          ;(this._isStarted = !1), this._clearExecutions()
          ;(0, s.ensure)(this.activeBroker()).executionUpdate.unsubscribeAll(
            this,
          ),
            this._dataEvents.symbolResolved().unsubscribeAll(this),
            this._dataEvents.symbolError().unsubscribeAll(this)
        }
        _createExecutions() {
          var t
          this._clearExecutions(), (this._symbol = '')
          const e = this._getSymbolName()
          e &&
            (this._actualTradingSymbolSubscription =
              null === (t = this.trading().makeActualSymbolObservable(e)) ||
              void 0 === t
                ? void 0
                : t.subscribe(({ symbol: t }) => {
                    t !== this._symbol &&
                      ((this._symbol = t),
                      this._requestFormatterAndExecutions())
                  }))
        }
        _clearExecutions() {
          var t
          null === (t = this._actualTradingSymbolSubscription) ||
            void 0 === t ||
            t.unsubscribe(),
            (this._allExecutionsID = new Set()),
            (this._executions = []),
            this._executionsCleared.fire()
        }
        async _requestFormatterAndExecutions() {
          const t = this.activeBroker()
          if (!t) return
          if (!this._symbol) return
          if (!(await t.isTradable(this._symbol)).tradable) return
          const e = this._symbol
          Promise.all([
            t.formatter(this._symbol, !1),
            t.executions(this._symbol),
          ]).then(([i, s]) => {
            this._symbol === e &&
              ((this._formatter = i),
              (this._executions = s
                .map((t) => this._createExecutionData(t))
                .filter(r.notNull)),
              this._executionsAdded.fire(this._executions),
              t.executionUpdate.unsubscribeAll(this),
              t.executionUpdate.subscribe(this, this._addExecution))
          })
        }
        _addExecution(t) {
          const e = this._createExecutionData(t)
          null !== e && this._executionsAdded.fire([e])
        }
        _createExecutionData(t) {
          return t.symbol !== this._symbol || this._allExecutionsID.has(t.id)
            ? null
            : (this._allExecutionsID.add(t.id),
              { ...t, tooltip: (0, l.executionText)(t, this._formatter) })
        }
      }
    },
    564209: (t, e, i) => {
      i.r(e), i.d(e, { ExecutionsPointsManager: () => n })
      var s = i(680974),
        r = i(466052)
      function o(t) {
        return void 0 !== t.index
      }
      class n {
        constructor(t, e, i) {
          ;(this._points = []),
            (this._existingExecutionPointsCache = null),
            (this._offsetOfFirstExistingPoint = null),
            (this._existingPointsChanged = new r.Delegate()),
            (this._pointsets = []),
            (this._pointsetManagerFactory = e),
            (this._firstSeriesTimePointWV = i),
            this._firstSeriesTimePointWV.subscribe(
              this._updateExistingPoints.bind(this),
            ),
            (this._executionsService = t),
            this._addPoints(this._executionsService.executions()),
            this._executionsService
              .executionsAdded()
              .subscribe(this, this._addPoints),
            this._executionsService
              .executionsCleared()
              .subscribe(this, this._clearPoints)
        }
        destroy() {
          this._clearPoints(),
            this._firstSeriesTimePointWV.destroy(),
            this._executionsService.executionsAdded().unsubscribeAll(this),
            this._executionsService.executionsCleared().unsubscribeAll(this),
            this._executionsService.destroy()
        }
        existingPoints() {
          return null === this._offsetOfFirstExistingPoint
            ? []
            : (null === this._existingExecutionPointsCache &&
                (this._existingExecutionPointsCache = this._points
                  .slice(this._offsetOfFirstExistingPoint)
                  .filter(o)),
              this._existingExecutionPointsCache)
        }
        existingPointsChanged() {
          return this._existingPointsChanged
        }
        _onExistingStartPointChanged() {
          ;(this._existingExecutionPointsCache = null),
            this._existingPointsChanged.fire(this.existingPoints())
        }
        _addPoints(t) {
          if (0 === t.length) return
          const e = ((t) =>
            t.map((t) => {
              const e = Math.round(t.time / 1e3)
              return {
                id: t.id,
                price: t.price,
                time_t: e,
                index: void 0,
                isBuyDirection: 1 === t.side,
                tooltip: t.tooltip,
              }
            }))(t)
          e.sort((t, e) => t.time_t - e.time_t)
          let i = 0
          const r = this._points.length > 0
          r &&
            (i = (0, s.upperbound)(
              this._points,
              e[0].time_t,
              (t, e) => e.time_t > t,
              0,
            )),
            (this._points = this._points
              .slice(0, i)
              .concat(e)
              .concat(this._points.slice(i)))
          const o = this._firstSeriesTimePointWV.value()
          null !== this._offsetOfFirstExistingPoint &&
          null !== o &&
          e[0].time_t < o
            ? (this._offsetOfFirstExistingPoint =
                this._offsetOfFirstExistingPoint + e.length)
            : ((null === this._offsetOfFirstExistingPoint ||
                e[0].time_t <
                  this._points[this._offsetOfFirstExistingPoint].time_t) &&
                (this._offsetOfFirstExistingPoint =
                  this._calcOffsetOfFirstExistingPoint()),
              null !== this._offsetOfFirstExistingPoint &&
                (r
                  ? i >= this._offsetOfFirstExistingPoint &&
                    this._sendPointsToServer(i, i + e.length)
                  : this._sendPointsToServer(
                      this._offsetOfFirstExistingPoint,
                      this._points.length,
                    )))
        }
        _updateExistingPoints() {
          if (0 === this._points.length) return
          const t = this._calcOffsetOfFirstExistingPoint()
          null !== t &&
            (null === this._offsetOfFirstExistingPoint &&
              (this._offsetOfFirstExistingPoint = this._points.length),
            t < this._offsetOfFirstExistingPoint &&
              (this._sendPointsToServer(t, this._offsetOfFirstExistingPoint),
              (this._offsetOfFirstExistingPoint = t)))
        }
        _clearPoints() {
          for (const t of this._pointsets)
            t.onUpdate().unsubscribeAll(this), t.destroy()
          ;(this._pointsets = []),
            (this._points = []),
            (this._offsetOfFirstExistingPoint = null),
            this._onExistingStartPointChanged()
        }
        _sendPointsToServer(t, e) {
          const i = this._points
            .slice(t, e)
            .map((t) => ({ time_t: t.time_t, offset: 0 }))
          if (0 === i.length) return
          const s = this._pointsetManagerFactory(i)
          null !== s &&
            (s.onUpdate().subscribe(this, this._updatePointsFromServer),
            this._pointsets.push(s))
        }
        _updatePointsFromServer(t) {
          if (null === this._offsetOfFirstExistingPoint) return
          const e = (0, s.lowerbound)(
            this._points,
            t[0].time_t,
            (t, e) => t.time_t < e,
            this._offsetOfFirstExistingPoint,
          )
          let i = Math.max(this._offsetOfFirstExistingPoint, e)
          for (const e of t)
            for (
              let t = i;
              t < this._points.length &&
              ((i = t), !(this._points[t].time_t > e.time_t));
              t++
            )
              this._points[t].time_t === e.time_t &&
                (this._points[t].index = e.index)
          this._onExistingStartPointChanged()
        }
        _calcOffsetOfFirstExistingPoint() {
          const t = this._firstSeriesTimePointWV.value()
          return null === t
            ? null
            : (0, s.upperbound)(
                this._points,
                t,
                (t, e) => e.time_t > t,
                0,
                this._offsetOfFirstExistingPoint || this._points.length,
              )
        }
      }
    },
    856628: (t, e, i) => {
      i.r(e), i.d(e, { ExecutionsSource: () => H })
      var s = i(938351),
        r = i(364124),
        o = i(966949)
      class n extends s.CustomSourceBase {
        constructor(t, e, i) {
          super(t, e),
            (this._paneViews = []),
            (this._executionsPointsManager = i),
            this._executionsPointsManager
              .existingPointsChanged()
              .subscribe(this, this.redraw),
            this._createPaneViews()
        }
        redraw() {
          this.updateAllViews((0, r.sourceChangeEvent)(this.id())),
            this._model.updateSource(this)
        }
        points() {
          return this._executionsPointsManager.existingPoints()
        }
        updateAllViews(t) {
          for (const e of this._paneViews) e.update(t)
        }
        paneViews(t) {
          return this._isSourceShouldBeShown(t) ? this._paneViews : []
        }
        hoveredExecution() {
          const t =
            (this._model.hoveredSource() === this &&
              this._model.lastHittestData()) ||
            null
          return null === t || void 0 === t.activeItem ? null : t.activeItem
        }
        destroy() {
          this._executionsPointsManager
            .existingPointsChanged()
            .unsubscribe(this, this.redraw),
            this._executionsPointsManager.destroy()
        }
        _isSourceShouldBeShown(t) {
          return (
            !!t.containsMainSeries() &&
            !(
              window.TradingView.printing &&
              !(0, o.isTradingObjVisibleOnScreenshot)()
            )
          )
        }
      }
      var a = i(650151),
        l = i(944017),
        c = i(848801),
        h = i(680974),
        u = i(149962),
        d = i(32240),
        _ = i(316167)
      const p = u.colorsPalette['color-tv-blue-500'],
        x = u.colorsPalette['color-ripe-red-500'],
        b = {
          textColor: u.colorsPalette['color-cold-gray-200'],
          overlayColor: (0, d.generateColor)(
            u.colorsPalette['color-cold-gray-900'],
            50,
          ),
          outlineColor: u.colorsPalette['color-cold-gray-900'],
        },
        f = {
          textColor: u.colorsPalette['color-cold-gray-900'],
          overlayColor: (0, d.generateColor)(
            u.colorsPalette['color-white'],
            50,
          ),
          outlineColor: u.colorsPalette['color-white'],
        }
      function m(t) {
        const e = t ? b : f,
          { textColor: i, outlineColor: s } = e,
          r = (0, _.blendColors)(p, e.overlayColor),
          o = (0, _.blendColors)(x, e.overlayColor)
        return {
          buyArrowColor: p,
          sellArrowColor: x,
          inactiveBuyArrowColor: r,
          inactiveSellArrowColor: o,
          textColor: i,
          outlineColor: s,
        }
      }
      var v = i(384341),
        w = i(353795),
        P = i(526019),
        S = i(945298),
        g = i(645254)
      const y = 3,
        C = 12,
        E = 2,
        A = 6,
        T = 10,
        V = 'normal'
      class k {
        constructor() {
          ;(this._data = {
            points: [],
            labels: [],
            arrowHeight: 0,
            arrowSpacing: 0,
          }),
            (this._textWidthCache = new S.TextWidthCache()),
            (this._font = (0, v.makeFont)(C, P.CHART_FONT_FAMILY, V))
        }
        setData(t) {
          this._data = t
        }
        hitTest(t) {
          for (const e of this._data.points) {
            const i = Math.round(e.x),
              s = Math.round(e.y),
              r = 2 * y
            let o, n
            if (
              (e.arrowUp
                ? ((o = s),
                  (n = s + this._data.arrowHeight + this._data.arrowSpacing))
                : ((o = s - this._data.arrowHeight - this._data.arrowSpacing),
                  (n = s)),
              t.x >= i - y &&
                t.x <= i + y &&
                t.y >= o &&
                t.y <= n &&
                '' !== e.tooltip)
            ) {
              const t = {
                activeItem: e.id,
                equals: (t) => t.activeItem === e.id,
              }
              return (
                e.tooltip &&
                  (t.tooltip = {
                    below: e.arrowUp,
                    text: e.tooltip,
                    rect: { x: i - y, y: o, w: r, h: n - o },
                  }),
                new w.HitTestResult(w.HitTarget.Custom, t)
              )
            }
          }
          return null
        }
        draw(t, e) {
          const i = e.pixelRatio
          t.save(), (t.lineWidth = Math.max(E, Math.floor(E * i)))
          const s = 2 * y,
            r = Math.max(1, Math.round(s * i)),
            o = Math.max(1, Math.round(this._data.arrowHeight * i))
          for (const e of this._data.points) {
            const s = Math.round((e.x - y) * i),
              n = Math.round(e.y * i)
            ;(0, g.drawArrow)(
              t,
              s,
              n,
              e.arrowColor,
              e.outlineColor,
              !e.arrowUp,
              o,
              r,
              !0,
            )
          }
          for (const e of this._data.labels) {
            const s = Math.round((e.x - y) * i),
              r = Math.round(e.y * i)
            ;(0, g.drawOutlinedText)(
              t,
              i,
              e.text,
              s,
              r,
              this._textYMidCorrection(t, e.text),
              e.color,
              this._font,
              e.outlineColor,
            )
          }
          if (this._data.executionEntryPoint) {
            const e = Math.round(
                (this._data.executionEntryPoint.x - A / 2) * i,
              ),
              s = Math.round(this._data.executionEntryPoint.y * i),
              r = Math.max(1, Math.round(T * i)),
              o = Math.max(1, Math.round(A * i))
            ;(0, g.drawOutlinedArrowHead)(
              t,
              e,
              s,
              this._data.executionEntryPoint.arrowColor,
              this._data.executionEntryPoint.outlineColor,
              r,
              o,
            )
          }
          t.restore()
        }
        _textYMidCorrection(t, e) {
          if (!e) return 0
          const i = t.font
          t.font = (0, a.ensureNotNull)(this._font)
          const s = Math.ceil(this._textWidthCache.yMidCorrection(t, e))
          return (t.font = i), s
        }
      }
      const M = 14,
        D = 5,
        L = 9,
        B = 15,
        F = 10
      class O extends class {
        constructor(t) {
          ;(this._invalidated = !0), (this._chartModel = t)
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
          this._renderer.setData({
            points: [],
            labels: [],
            arrowHeight: 0,
            arrowSpacing: 0,
          })
          const t = this._chartModel.timeScale().visibleBarsStrictRange()
          if (null === t) return
          const e = this._source.points()
          if (0 === e.length) return
          const i = (0, h.lowerbound)(
              e,
              t.firstBar(),
              (t, e) => t.index < e,
              0,
            ),
            s = (0, h.upperbound)(e, t.lastBar(), (t, e) => e.index > t, i)
          if (i >= s) return
          const r = e.slice(i, s),
            o = this._createRenderData(r)
          this._renderer.setData(o)
        }
        _getXCoordinate(t) {
          const e = this._chartModel.mainSeries().bars().lastIndex()
          return null === e || t > e
            ? null
            : this._chartModel.timeScale().indexToCoordinate(t)
        }
        _getYCoordinate(t, e) {
          let i = null
          const s = this._chartModel.mainSeries(),
            r = s.priceSource(),
            o = null !== r ? r : e ? 'low' : 'high',
            n = (0, l.barFunction)(o),
            a = s.nearestData(t, c.PlotRowSearchMode.NearestLeft)
          if (void 0 !== a) {
            const t = n(a.value)
            Number.isNaN(t) || (i = this._priceToCoordinate(t))
          }
          return i
        }
        _priceToCoordinate(t) {
          const e = this._chartModel.mainSeries(),
            i = e.firstValue()
          return i ? e.priceScale().priceToCoordinate(t, i) : null
        }
        _isPriceScaleInverted() {
          return this._chartModel.mainSeries().priceScale().isInverted()
        }
        _styleGetter() {
          return m(this._chartModel.dark().value())
        }
      } {
        constructor(t, e) {
          super(t),
            (this._renderer = new k()),
            (this._points = []),
            (this._source = e)
        }
        _createRenderData(t) {
          let e
          this._points = []
          const i = this._isPriceScaleInverted(),
            s = new Map(),
            r = m(this._chartModel.dark().value()),
            o = t.find((t) => this._source.hoveredExecution() === t.id)
          for (const n of t) {
            const t = s.get(n.index) || I(i, r)
            if (void 0 === t.x) {
              const e = this._getXCoordinate(n.index)
              if (null === e) continue
              t.x = e
            }
            const l = n.isBuyDirection !== i,
              c = l ? 'arrowUp' : 'arrowDown',
              h = l ? 1 : -1,
              u = t[c].y
            if (void 0 === u) {
              const e = this._getYCoordinate(n.index, n.isBuyDirection)
              if (null === e) continue
              t[c].y = e + h * L
            } else t[c].y = u + h * (M + D)
            s.set(n.index, t),
              o &&
                o === n &&
                (e = {
                  x: (0, a.ensureDefined)(t.x),
                  y: (0, a.ensureNotNull)(this._priceToCoordinate(o.price)),
                  arrowColor: t[c].color,
                  outlineColor: r.outlineColor,
                }),
              this._points.push({
                id: n.id,
                x: (0, a.ensureDefined)(t.x),
                y: (0, a.ensureDefined)(t[c].y),
                arrowUp: l,
                arrowColor: t[c].color,
                outlineColor: r.outlineColor,
                tooltip: this._source.isLabelsVisible() ? void 0 : n.tooltip,
              })
          }
          const n = []
          if (this._source.isLabelsVisible())
            for (const e of t) {
              const t = s.get(e.index)
              if (t) {
                const s = e.isBuyDirection !== i,
                  o = s ? 'arrowUp' : 'arrowDown',
                  l = t[o].y,
                  c = t.x
                if (void 0 !== l && void 0 !== c) {
                  const i = s ? 1 : -1
                  ;(t[o].y = l + i * B),
                    n.push({
                      x: c,
                      y: (0, a.ensureDefined)(t[o].y) + i * F,
                      text: e.tooltip,
                      color: r.textColor,
                      outlineColor: r.outlineColor,
                    })
                }
              }
            }
          return {
            points: this._points,
            labels: n,
            executionEntryPoint: e,
            arrowHeight: M,
            arrowSpacing: D,
          }
        }
      }
      function I(t, e) {
        let i, s
        return (
          t
            ? ((i = e.sellArrowColor), (s = e.buyArrowColor))
            : ((i = e.buyArrowColor), (s = e.sellArrowColor)),
          {
            x: void 0,
            arrowUp: { y: void 0, color: i },
            arrowDown: { y: void 0, color: s },
          }
        )
      }
      class H extends n {
        constructor(t, e, i, s, r) {
          super(t, e, r),
            (this._showExecutions = i.arrowVisibility),
            (this._showExecutionLabels = i.labelVisibility),
            (this._globalVisibility = s),
            this._globalVisibility.subscribe(this.redraw.bind(this))
        }
        destroy() {
          super.destroy(),
            this._showExecutions.destroy(),
            this._globalVisibility.unsubscribe()
        }
        isLabelsVisible() {
          return this._showExecutionLabels.value()
        }
        _createPaneViews() {
          this._paneViews = [new O(this._model, this)]
        }
        _isSourceShouldBeShown(t) {
          return (
            !!this._globalVisibility.value() &&
            !!this._showExecutions.value() &&
            super._isSourceShouldBeShown(t)
          )
        }
      }
    },
    132193: (t, e, i) => {
      i.r(e), i.d(e, { TradedItemsChartCollectionFacade: () => a })
      var s = i(650151),
        r = i(247905),
        o = i(353795),
        n = i(281969)
      class a {
        constructor(t) {
          this._chartWidgetCollection = t
        }
        dropHoveredItem() {
          this._activeWidgetChartModel().setHoveredSource(null, null)
        }
        setHoveredItem(t) {
          this._setItemState(t, (t, e) => {
            this._activeWidgetChartModel().setHoveredSource(t, e)
          })
        }
        setSelectedItem(t) {
          this._setItemState(t, (t, e) => {
            this._activeWidgetChartModel().selectionMacro((i) => {
              if (t) i.clearSelection(), i.addSourceToSelection(t, e)
              else {
                i
                  .selection()
                  .customSources()
                  .find(n.isTradedGroupCustomSource) && i.clearSelection()
              }
            })
          })
        }
        _setItemState(t, e) {
          const { source: i, item: s } = this._findSourceAndItem(t.id, t.type)
          if (!i || !s) return void e(null, null)
          e(
            i,
            new o.HitTestResult(o.HitTarget.Custom, {
              activeItem: { id: s.id(), part: 8 },
            }).data(),
          )
        }
        _activeWidgetChartModel() {
          return (0, s.ensureNotNull)(
            this._chartWidgetCollection.activeChartWidget.value(),
          )
            .model()
            .model()
        }
        _findSourceAndItem(t, e) {
          for (const i of this._activeWidgetChartModel().customSources(
            r.CustomSourceLayer.Topmost,
          ))
            if ((0, n.isTradedGroupCustomSource)(i)) {
              const s = i.findItemWithType(t, e)
              if (s) return { source: i, item: s }
            }
          return {}
        }
      }
    },
    13042: (t, e, i) => {
      i.r(e), i.d(e, { BidAsk: () => f })
      var s = i(650151),
        r = i(372605),
        o = i(622224),
        n = i(938351),
        a = i(377884)
      class l extends a.PriceLineAxisView {
        constructor(t, e, i) {
          super(), (this._model = t), (this._source = e), (this._priceType = i)
        }
        _value() {
          const t = this._model.mainSeries(),
            e = t.priceScale(),
            i = t.firstValue()
          if (null === i) return { noData: !0 }
          const s = this._source.getPrice(this._priceType)
          if (null === s) return { noData: !0 }
          const r = e.priceToCoordinate(s, i)
          return {
            noData: !1,
            floatCoordinate: r,
            coordinate: r,
            color: '',
            formattedPricePercentage: '',
            formattedPriceAbsolute: '',
            formattedPriceIndexedTo100: '',
            text: '',
            index: 0,
          }
        }
        _priceLineColor(t) {
          const e = this._source.properties().childs()
          return 0 === this._priceType
            ? e.bidLineColor.value()
            : e.askLineColor.value()
        }
        _lineWidth() {
          return this._source.properties().childs().lineWidth.value()
        }
        _lineStyle() {
          return this._source.properties().childs().lineStyle.value()
        }
        _isVisible() {
          return this._source.properties().childs().visible.value()
        }
      }
      var c = i(609838),
        h = i(630432),
        u = i(32240)
      class d extends h.PriceAxisView {
        constructor(t, e, i) {
          super(), (this._model = t), (this._source = e), (this._priceType = i)
        }
        _updateRendererData(t, e, s) {
          if (
            ((t.visible = !1),
            (e.visible = !1),
            !this._model
              .properties()
              .childs()
              .scalesProperties.childs()
              .showBidAskLabels.value())
          )
            return
          const r = this._model.mainSeries(),
            o = r.priceScale(),
            n = r.firstValue()
          if (null === n) return
          const a = this._source.getPrice(this._priceType)
          if (null === a) return
          const l = this._source.properties().childs(),
            h =
              0 === this._priceType
                ? (0, u.resetTransparency)(l.bidLineColor.value())
                : (0, u.resetTransparency)(l.askLineColor.value())
          ;(t.visible = !0),
            (e.visible = !0),
            (t.text = o.formatPriceAbsolute(a)),
            (e.text =
              0 === this._priceType
                ? c.t(null, void 0, i(6205))
                : c.t(null, void 0, i(987300))),
            (s.coordinate = o.priceToCoordinate(a, n)),
            (s.background = h),
            (s.textColor = this.generateTextColor(h))
        }
      }
      var _ = i(543905),
        p = i(353795)
      class x extends _.HorizontalLinePaneView {
        constructor(t, e, i, s) {
          super(), (this._model = t), (this._source = e), (this._priceType = i)
          const r = { doubleClickHandler: s, doubleTapHandler: s }
          this._lineRenderer.setHitTest(
            new p.HitTestResult(p.HitTarget.Regular, r),
          )
        }
        _updateImpl() {
          const t = this._lineRendererData
          t.visible = !1
          const e = this._source.properties().childs()
          if (!e.visible.value()) return
          const i = this._model.mainSeries(),
            s = i.priceScale(),
            r = i.firstValue()
          if (null === r) return
          const o = this._source.getPrice(this._priceType)
          null !== o &&
            ((t.visible = !0),
            (t.y = s.priceToCoordinate(o, r)),
            (t.linestyle = e.lineStyle.value()),
            (t.linewidth = e.lineWidth.value()),
            (t.color =
              0 === this._priceType
                ? e.bidLineColor.value()
                : e.askLineColor.value()))
        }
      }
      var b = i(364124)
      class f extends n.CustomSourceBase {
        constructor(t, e, i, s) {
          super(t, e),
            (this._ask = null),
            (this._bid = null),
            (this._symbol = null),
            (this._realtimeProvider = i),
            (this._bidLinesPaneView = new x(e, this, 0, s)),
            (this._askLinesPaneView = new x(e, this, 1, s)),
            (this._bidPriceAxisView = new d(e, this, 0)),
            (this._askPriceAxisView = new d(e, this, 1)),
            (this._regularPriceAxisViews = [
              this._bidPriceAxisView,
              this._askPriceAxisView,
            ]),
            (this._bidLabelPaneView = new o.PanePriceAxisView(
              this._bidPriceAxisView,
              e.mainSeries(),
              e,
            )),
            (this._askLabelPaneView = new o.PanePriceAxisView(
              this._askPriceAxisView,
              e.mainSeries(),
              e,
            )),
            (this._bidPriceLineAxisView = new l(e, this, 0)),
            (this._askPriceLineAxisView = new l(e, this, 1)),
            (this._externalPriceAxisViews = [
              this._bidPriceLineAxisView,
              this._askPriceLineAxisView,
            ]),
            (this._updateRealtimeDataHandler =
              this._updateRealtimeData.bind(this))
          const r = e.mainSeries().dataEvents()
          r.symbolResolved().subscribe(this, this._createTradedSymbol),
            r.symbolError().subscribe(this, this._createTradedSymbol),
            (this._hibernated = e.collapsed().spawn()),
            this._hibernated.subscribe((t) => {
              t ? this._clearTradedSymbol() : this._createTradedSymbol()
            }),
            this._createTradedSymbol()
        }
        destroy() {
          const t = this._model.mainSeries().dataEvents()
          t.symbolResolved().unsubscribeAll(this),
            t.symbolError().unsubscribeAll(this),
            this._hibernated.destroy(),
            this._clearTradedSymbol()
        }
        paneViews(t) {
          return this._isMainSourcePane(t)
            ? [this._bidLinesPaneView, this._askLinesPaneView]
            : []
        }
        labelPaneViews(t) {
          return this._isMainSourcePane(t)
            ? [this._bidLabelPaneView, this._askLabelPaneView]
            : []
        }
        priceAxisViews(t, e) {
          return this._isMainSourcePane(t)
            ? t.findTargetPriceAxisViews(
                this,
                e,
                this._regularPriceAxisViews,
                this._externalPriceAxisViews,
              )
            : []
        }
        priceScale() {
          return this._model.mainSeries().priceScale()
        }
        updateAllViews(t) {
          this._bidLinesPaneView.update(t),
            this._askLinesPaneView.update(t),
            this._bidPriceAxisView.update(t),
            this._askPriceAxisView.update(t),
            this._bidPriceLineAxisView.update(t),
            this._askPriceLineAxisView.update(t),
            this._bidLabelPaneView.update(t),
            this._askLabelPaneView.update(t)
        }
        getPrice(t) {
          return 1 === t ? this._ask : this._bid
        }
        properties() {
          return this._model.mainSeries().properties().childs().bidAsk
        }
        _createTradedSymbol() {
          const t = ((t) => {
            if (t.isConvertedToOtherCurrency() || t.isConvertedToOtherUnit())
              return null
            const e = t.symbolInfo()
            return null === e
              ? t.proSymbol()
              : e.pro_name || e.full_name || e.name || null
          })(this._model.mainSeries())
          t !== this._symbol &&
            (this._clearTradedSymbol(),
            null === t || this._hibernated.value() || this._initTradedSymbol(t))
        }
        _initTradedSymbol(t) {
          ;(this._symbol = t),
            this._realtimeProvider.subscribeRealtime(
              this._symbol,
              this._updateRealtimeDataHandler,
            )
        }
        _clearTradedSymbol() {
          ;(this._ask = null),
            (this._bid = null),
            null !== this._symbol &&
              (this._realtimeProvider.unsubscribeRealtime(
                (0, s.ensureNotNull)(this._symbol),
                this._updateRealtimeDataHandler,
              ),
              (this._symbol = null))
        }
        _updateRealtimeData(t, e, i) {
          const s = e.ask,
            o = e.bid
          s === o
            ? ((this._ask = null), (this._bid = null))
            : ((0, r.isNumber)(s) && (this._ask = s),
              (0, r.isNumber)(o) && (this._bid = o)),
            (this._model
              .mainSeries()
              .properties()
              .childs()
              .bidAsk.childs()
              .visible.value() ||
              this._model
                .properties()
                .childs()
                .scalesProperties.childs()
                .showBidAskLabels.value()) &&
              (this.updateAllViews((0, b.sourceChangeEvent)(this.id())),
              this._model.updateSource(this))
        }
        _isMainSourcePane(t) {
          return this._model.paneForSource(this._model.mainSeries()) === t
        }
      }
    },
    987300: (t) => {
      t.exports = {
        ar: ['سعر الشراء'],
        ca_ES: 'Ask',
        cs: 'Ask',
        de: 'Ask',
        el: 'Ask',
        en: 'Ask',
        es: 'Ask',
        fa: 'Ask',
        fr: ['Demande'],
        he_IL: ['מחיר ביקוש'],
        hu_HU: ['Vételi ár'],
        id_ID: 'Ask',
        it: ['Lettera'],
        ja: 'Ask',
        ko: ['매도호가'],
        ms_MY: ['Tawar'],
        nl_NL: 'Ask',
        pl: ['Cena Ask'],
        pt: ['Venda'],
        ro: 'Ask',
        ru: ['Аск'],
        sv: ['Fråga'],
        th: ['เสนอซื้อ'],
        tr: ['Al'],
        vi: 'Ask',
        zh: 'Ask',
        zh_TW: 'Ask',
      }
    },
    6205: (t) => {
      t.exports = {
        ar: ['سعر البيع'],
        ca_ES: 'Bid',
        cs: 'Bid',
        de: 'Bid',
        el: 'Bid',
        en: 'Bid',
        es: 'Bid',
        fa: 'Bid',
        fr: ['Offre'],
        he_IL: ['מחיר היצע'],
        hu_HU: ['Kínálati ár'],
        id_ID: 'Bid',
        it: ['Denaro'],
        ja: 'Bid',
        ko: ['매수호가'],
        ms_MY: ['Bida'],
        nl_NL: 'Bid',
        pl: ['Cena Bid'],
        pt: ['Compra'],
        ro: 'Bid',
        ru: ['Бид'],
        sv: 'Bid',
        th: ['เสนอขาย'],
        tr: ['Sat'],
        vi: 'Bid',
        zh: 'Bid',
        zh_TW: 'Bid',
      }
    },
  },
])
