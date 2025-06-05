;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5500],
  {
    13099: (e, t, s) => {
      s.r(t), s.d(t, { LineToolAnchoredVWAP: () => L })
      var i = s(50151),
        r = s(68159),
        n = s(37265),
        a = s(12988),
        l = s(17534),
        o = s(93280),
        u = s(73305),
        d = s(16227)
      class h extends d.StudyPriceAxisView {
        _showPaneLabel() {
          return !1
        }
        _showAxisLabel() {
          const e = this._model.properties().childs().scalesProperties.childs()
          return (
            this._visible() &&
            'VWAP' === this._data.plotIndex &&
            e.showStudyLastValue.value()
          )
        }
        _visible() {
          const e = this._source
            .properties()
            .childs()
            .styles.childs()
            [this._data.plotIndex].childs()
            .display.value()
          return (
            this._source.properties().childs().axisLabelVisible.value() &&
            Boolean(4 & e)
          )
        }
      }
      var c = s(78198)
      class p extends c.StudyPlotPaneView {
        constructor(e, t, s, i) {
          super(e, t, s, i), (this._line = e)
        }
        _makeSureRendererIsValid() {
          ;(this._dataInvalidated || this._viewportInvalidated) &&
            this._updateImplFull(this._viewportInvalidated) &&
            (this._dataInvalidated = null),
            (this._viewportInvalidated = !1)
        }
        _updateRenderer(e, t) {
          super._updateRenderer(e, t), this._addAlertsRenderer()
        }
        _addAlertsRenderer() {
          return !1
        }
      }
      var _ = s(9343),
        y = s(32679),
        P = s(46463),
        f = (s(86129), s(44672)),
        w = s(69708),
        A = s(43156),
        b = s(8025)
      class I extends A.StudyLineDataSource {
        lastValueData(e, t, s) {
          const r = { noData: !0 },
            n = this.priceScale()
          if (
            this._model.timeScale().isEmpty() ||
            null === this.priceScale() ||
            null === n ||
            n.isEmpty() ||
            this.plots().isEmpty()
          )
            return r
          const a = this._model.timeScale().visibleBarsStrictRange()
          if (null === a) return r
          const l = this._studyProps()
          if (!l.childs().visible.value()) return r
          const o = this.plots().search(
            a.lastBar(),
            b.PlotRowSearchMode.NearestLeft,
            1,
          )
          if (null === o) return r
          const u = a.contains(o.index),
            d = !t && u ? o : (0, i.ensureNotNull)(this.plots().last()),
            h = this.metaInfo().plots.findIndex((t) => t.id === e)
          if (h < 0 || !d || !(0, w.default)(d.value[h + 1])) return r
          const c = d.value[h + 1]
          if (null == c) return r
          const p = (0, i.ensureDefined)(l.childs().styles.child(e)),
            _ = (0, i.ensureNotNull)(this.firstValue()),
            y = n.priceToCoordinate(c, _)
          return {
            ...n.getFormattedValues(c, _),
            noData: !1,
            price: c,
            color: p.childs().color.value(),
            coordinate: y,
            floatCoordinate: y,
            index: d.index,
          }
        }
        priceLabelText(e) {
          const t = (0, i.ensureDefined)(this._metaInfo.styles)
          return (0, i.ensureDefined)(t[e]).title
        }
        offset(e) {
          return 0
        }
        getMinFirstBarIndexForPlot() {
          return -1 / 0
        }
        isPlotVisibleAt(e, t) {
          return (
            (this._studyProps()
              .childs()
              .styles.childs()
              [e].childs()
              .display.value() &
              t) ===
            t
          )
        }
        _studyProps() {
          return this.properties()
        }
      }
      var S = s(65458),
        V = s(16638),
        m = s(15491)
      const v = (0, _.getLogger)('Chart.AnchoredVWAP'),
        g = (0, i.ensureDefined)(m.lineToolsStudyIds.LineToolAnchoredVWAP),
        C = !0
      function x(e, t, s, r) {
        return (
          'calculate_stDev' in (0, i.ensureDefined)(e.inputs) ||
            void 0 === r.inputs.find((e) => 'calculate_stDev' === e.id) ||
            ((0, i.ensureDefined)(t.inputs).calculate_stDev = !1),
          t.styles &&
            (R(t.styles.VWAP),
            R(t.styles.UpperBand),
            R(t.styles.LowerBand),
            R(t.styles.UpperBand_2),
            R(t.styles.LowerBand_2),
            R(t.styles.UpperBand_3),
            R(t.styles.LowerBand_3)),
          t
        )
      }
      function R(e) {
        void 0 !== e &&
          void 0 !== e.visible &&
          ((e.display = e.visible ? 15 : 0), delete e.visible)
      }
      class L extends I {
        constructor(e, t, s, r, n) {
          s =
            s ||
            (0, i.ensureNotNull)(
              (0, V.studyMetaInfoRepository)().findByIdSync({
                type: 'java',
                studyId: g,
              }),
            )
          const a =
            t ?? L.createProperties(e.backgroundTheme().spawnOwnership())
          super(e, s, 'anchoredvwap', a, r, n)
          const [l, o, u, d, _, y, f] = this.metaInfo().plots,
            w = e.mainSeries(),
            A = [new p(this, w, e, l.id)]
          o &&
            u &&
            (A.push(new c.StudyPlotPaneView(this, w, e, o.id)),
            A.push(new c.StudyPlotPaneView(this, w, e, u.id))),
            d &&
              _ &&
              y &&
              f &&
              (A.push(new c.StudyPlotPaneView(this, w, e, d.id)),
              A.push(new c.StudyPlotPaneView(this, w, e, _.id)),
              A.push(new c.StudyPlotPaneView(this, w, e, y.id)),
              A.push(new c.StudyPlotPaneView(this, w, e, f.id))),
            this._properties.childs().areaBackground &&
              A.splice(0, 0, new P.AreaBackgroundPaneView(this, e)),
            (this._priceAxisViews = this.metaInfo().plots.map(
              (e) => new h(this, { plotIndex: e.id }),
            )),
            A.push(
              ...this._priceAxisViews.map(
                (e) => new S.PanePriceAxisView(e, this, this._model),
              ),
            ),
            (this._anchorPriceCalculated = !1),
            (this._onInputsReadyCallbacks = []),
            this._setPaneViews(A),
            e
              .properties()
              .childs()
              .scalesProperties.childs()
              .showStudyLastValue.subscribe(
                this,
                this._onShowStudyLastValueChanged,
              ),
            a
              .onRestoreFactoryDefaults()
              .subscribe(this, this._onRestoreFactoryDefaults),
            this._hasAlert.subscribe(this.processHibernate.bind(this), {
              callWithLast: !0,
            })
        }
        destroy() {
          this.properties().onRestoreFactoryDefaults().unsubscribeAll(this),
            this.model()
              .properties()
              .childs()
              .scalesProperties.childs()
              .showStudyLastValue.unsubscribeAll(this),
            (this._onInputsReadyCallbacks = []),
            super.destroy()
        }
        cloneable() {
          return !1
        }
        canHasAlert() {
          return !0
        }
        pointsCount() {
          return 1
        }
        updateAllViews(e) {
          super.updateAllViews(e),
            this._priceAxisViews.forEach((t) => t.update(e))
        }
        firstValue() {
          return this._model.mainSeries().firstValue()
        }
        priceRange(e, t, s) {
          if (
            !this._isReady() ||
            this.isSourceHidden() ||
            s.targetPriceScale !== this.priceScale()
          )
            return null
          const r = this.plots().minMaxOnRangeCached(e, t, [
            { name: this.metaInfo().plots[0].id, offset: 0 },
          ])
          if (null === r) return null
          const n = (0, i.ensureNotNull)(this.priceScale())
          return n.isLog()
            ? new o.PriceRange(n.priceToLogical(r.min), n.priceToLogical(r.max))
            : new o.PriceRange(r.min, r.max)
        }
        isIncludedInAutoScale() {
          return !0
        }
        restoreData(e) {
          super.restoreData(e),
            void 0 !== e.data && (this._anchorPriceCalculated = !0)
        }
        properties() {
          return super.properties()
        }
        sourceId() {
          return this._studyId()
        }
        hasStateForAlert() {
          return !1
        }
        stateForAlert() {
          throw new Error('Not implemented')
        }
        inputsForAlertState() {
          return (
            null === this._inputs &&
              v.logWarn(
                'Could not get inputsForAlertState if VWAP has no inputs',
              ),
            { ...this.inputs() }
          )
        }
        inputs() {
          return (0, i.ensureNotNull)(this._inputs)
        }
        idForAlert() {
          return super.idForAlert()
        }
        defaultPlotIdForAlert() {
          return this.metaInfo().plots[0].id
        }
        canBeHibernated() {
          return super.canBeHibernated() && !this._hasAlert.value()
        }
        static createProperties(e, t) {
          const s = r.StudyMetaInfo.getStudyPropertyRootNameById(g),
            a = (0, i.ensureNotNull)(
              (0, V.studyMetaInfoRepository)().findByIdSync({
                type: 'java',
                studyId: g,
              }),
            ),
            l = (0, y.createDefaultsState)(
              !0,
              s,
              [],
              (0, V.studyMetaInfoRepository)().studyVersioning(),
            )
          return this.createPropertiesFromStudyMetaInfoAndState(
            a,
            a,
            (0, n.merge)((0, n.clone)(l), t ?? {}),
            (0, V.studyMetaInfoRepository)().studyVersioning(),
            e,
          )
        }
        static studyId() {
          return g
        }
        static createPropertiesFromStudyMetaInfoAndState(e, t, s, i, r) {
          const n = (0, l.prepareStudyPropertiesForLoadChart)(e, t, s, i, x, r)
          return this._configureProperties(n), n
        }
        _onPointsetUpdated(e) {
          super._onPointsetUpdated(e), this._onStudyInputsMayChange()
        }
        _studyInputs(e) {
          ;(0, i.assert)(
            1 === e.length,
            'all the line tool points should be defined',
          )
          const t = e[0],
            s = this._getPointTime(t, !1)
          return null === s
            ? (this._subscribeApplyInputsOnSeriesCompleted(), null)
            : {
                ...this.properties().childs().inputs.state(['start_time']),
                start_time: 1e3 * s,
              }
        }
        _isReady() {
          return (
            super._isReady() &&
            (null !== this._inputs || this._anchorPriceCalculated) &&
            this.model().lineBeingEdited() !== this
          )
        }
        _onDataCleared() {
          super._onDataCleared(), (this._anchorPriceCalculated = !1)
        }
        _onInputsChanged() {
          if (
            (super._onInputsChanged(),
            this._updateAlertCreationAvailable(),
            null !== this._inputs)
          ) {
            for (const e of this._onInputsReadyCallbacks)
              try {
                e(this._inputs)
              } catch (e) {
                v.logError(e.stack || e.message)
              }
            this._onInputsReadyCallbacks = []
          }
        }
        _clearAllDataExceptPointsetPoints() {
          super._clearAllDataExceptPointsetPoints(),
            this._updateAlertCreationAvailable()
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              s.e(6406),
              s.e(3889),
              s.e(8009),
              s.e(8056),
              s.e(8537),
            ]).then(s.bind(s, 27873))
          ).AnchoredVWAPDefinitionsViewModel
        }
        _updateAnchorsPrice(e) {
          if (!e && (this._anchorPriceCalculated || !this.isActualSymbol()))
            return
          const t = this.firstValue(),
            s = this.points()
          if (null === t || 0 === s.length) return
          const i = s[0].index,
            r = this.plots().valueAt(i)
          if (null === r) return
          const n = r[1]
          null != n &&
            ((this._points[0].price = n),
            (this._timePoint[0].price = n),
            (this._anchorPriceCalculated = !0))
        }
        _synchronizeAlert(e) {
          this._onInputsReady(() => super._synchronizeAlert(e))
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.hasChild('axisLabelVisible') ||
              e.addChild('axisLabelVisible', new a.Property(C))
          const t = e.childs().styles.childs().VWAP.childs().linewidth,
            s = e.childs().styles.childs().VWAP.childs().color
          e.addChild('linesWidths', new u.LineToolWidthsProperty([t])),
            e.addChild('linesColors', new u.LineToolColorsProperty([s]))
        }
        _onInputsReady(e) {
          null !== this._inputs
            ? e(this._inputs)
            : this._onInputsReadyCallbacks.push(e)
        }
        _onShowStudyLastValueChanged() {
          this._priceAxisViews.forEach((e) =>
            e.update((0, f.sourceChangeEvent)(this.id())),
          ),
            this.model().updateSource(this)
        }
        _onRestoreFactoryDefaults() {
          this.properties().childs().axisLabelVisible.setValue(C)
        }
      }
    },
  },
])
