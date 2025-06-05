;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5695],
  {
    25937: (e, t, o) => {
      o.r(t), o.d(t, { LineToolFixedRangeVolumeProfile: () => p })
      var i = o(50151),
        s = o(71131),
        r = o(68159),
        n = o(43156),
        l = o(32679),
        a = o(37265),
        c = o(17534),
        d = o(16638),
        u = o(15491)
      const h = (0, i.ensureDefined)(
        u.lineToolsStudyIds.LineToolFixedRangeVolumeProfile,
      )
      class p extends s.LineToolVbPFixed {
        constructor(e, t, o, i, s) {
          super(
            e,
            t,
            o ||
              (0, d.studyMetaInfoRepository)().findByIdSync({
                type: 'java',
                studyId: h,
              }),
            i,
            s,
          )
        }
        calcIsActualSymbol() {
          n.StudyLineDataSource.prototype.calcIsActualSymbol.apply(this)
        }
        boundToSymbol() {
          return !0
        }
        isSynchronizable() {
          return this.priceScale() === this._model.mainSeries().priceScale()
        }
        static studyId() {
          return h
        }
        static createProperties(e, t) {
          const o = r.StudyMetaInfo.getStudyPropertyRootNameById(h),
            s = (0, i.ensureNotNull)(
              (0, d.studyMetaInfoRepository)().findByIdSync({
                type: 'java',
                studyId: h,
              }),
            ),
            n = (0, l.createDefaultsState)(
              !0,
              o,
              [],
              (0, d.studyMetaInfoRepository)().studyVersioning(),
            )
          return this.createPropertiesFromStudyMetaInfoAndState(
            s,
            s,
            (0, a.merge)((0, a.clone)(n), t ?? {}),
            (0, d.studyMetaInfoRepository)().studyVersioning(),
            e,
          )
        }
        static createPropertiesFromStudyMetaInfoAndState(e, t, o, i, s) {
          const r = (0, c.prepareStudyPropertiesForLoadChart)(
            e,
            t,
            o,
            i,
            void 0,
            s,
          )
          return this._configureProperties(r), r
        }
      }
    },
    71131: (e, t, o) => {
      o.r(t), o.d(t, { LineToolVbPFixed: () => P })
      const i = (e) => null === e
      var s = o(50151),
        r = o(68159),
        n = o(43156),
        l = o(14019),
        a = o(78198),
        c = o(44672),
        d = o(37265),
        u = o(32679),
        h = o(17534),
        p = o(47988),
        y = o(16638),
        g = o(15491)
      const f = (0, s.ensureDefined)(g.lineToolsStudyIds.LineToolVbPFixed)
      function m(e, t, o, i) {
        return (
          t.styles &&
            (_(t.styles.developingPoc),
            _(t.styles.developingVAHigh),
            _(t.styles.developingVALow)),
          t
        )
      }
      function _(e) {
        void 0 !== e &&
          void 0 !== e.visible &&
          ((e.display = e.visible ? 15 : 0), delete e.visible)
      }
      class P extends n.StudyLineDataSource {
        constructor(e, t, o, i, s) {
          super(
            e,
            o ||
              (0, y.studyMetaInfoRepository)().findByIdSync({
                type: 'java',
                studyId: f,
              }),
            'vbpfixed_',
            t ?? P.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            s,
          ),
            this._createPaneViews().then((e) => {
              this._setPaneViews(e),
                e.forEach((e) =>
                  e.update(
                    (0, c.sourceChangeEvent)({
                      sourceId: this.id(),
                      clearData: !0,
                    }),
                  ),
                )
            }),
            this.clearData()
        }
        pointsCount() {
          return 2
        }
        boundToSymbol() {
          return !1
        }
        offset(e) {
          return 0
        }
        getMinFirstBarIndexForPlot() {
          return -1 / 0
        }
        calcIsActualSymbol() {
          ;(this._isActualSymbol = !0),
            (this._isActualCurrency = !0),
            (this._isActualUnit = !0),
            this.calcIsActualInterval()
        }
        cloneable() {
          return !1
        }
        isSynchronizable() {
          return !1
        }
        isPlotVisibleAt(e, t) {
          return (
            (this.properties()
              .childs()
              .styles.childs()
              [e].childs()
              .display.value() &
              t) ===
            t
          )
        }
        preferredZOrder() {
          return 0
        }
        static createProperties(e, t) {
          const o = r.StudyMetaInfo.getStudyPropertyRootNameById(f),
            i = (0, s.ensureNotNull)(
              (0, y.studyMetaInfoRepository)().findByIdSync({
                type: 'java',
                studyId: f,
              }),
            ),
            n = (0, u.createDefaultsState)(
              !0,
              o,
              [],
              (0, y.studyMetaInfoRepository)().studyVersioning(),
            )
          return this.createPropertiesFromStudyMetaInfoAndState(
            i,
            i,
            (0, d.merge)((0, d.clone)(n), t ?? {}),
            (0, y.studyMetaInfoRepository)().studyVersioning(),
            e,
          )
        }
        static createPropertiesFromStudyMetaInfoAndState(e, t, o, i, s) {
          const r = (0, h.prepareStudyPropertiesForLoadChart)(e, t, o, i, m, s)
          return this._configureProperties(r), r
        }
        static studyId() {
          return f
        }
        _studyInputs(e) {
          ;(0, s.assert)(
            2 === e.length,
            'all the line tool points should be defined',
          )
          const [t, o] = e,
            i = Math.max(t.index, o.index),
            r = this._model.mainSeries().bars().lastIndex(),
            n = t.index <= o.index ? t : o,
            l = o.index >= t.index ? o : t,
            a = this._getPointTime(n, !1),
            c = this._getPointTime(l, !1)
          if (null === a || null === c)
            return this._subscribeApplyInputsOnSeriesCompleted(), null
          return {
            ...this.properties().childs().inputs.state(),
            first_bar_time: 1e3 * a,
            last_bar_time: 1e3 * c,
            subscribeRealtime: r === i,
            mapRightBoundaryToBarStartTime:
              !!this._needExtendToBarsEnding() || void 0,
          }
        }
        _isReady() {
          return !(0, l.isStudyGraphicsEmpty)(this.graphics())
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              o.e(9028),
              o.e(3889),
              o.e(8009),
              o.e(4482),
              o.e(607),
            ]).then(o.bind(o, 31507))
          ).StudyLineDataSourceDefinitionsViewModel
        }
        _onDataUpdated() {
          this._updateAnchors(),
            this.updateAllViews((0, c.sourceChangeEvent)(this.id())),
            this._model.updateSource(this)
        }
        _updateAnchors() {
          const e = this._calculateAnchors()
          if (!e) return
          const [{ price: t }, { price: o }] = e
          this._timePoint.length &&
            ((this._timePoint[0].price = t), (this._timePoint[1].price = o)),
            this._points.length &&
              ((this._points[0].price = t), (this._points[1].price = o))
        }
        _calculateAnchors() {
          let e = null,
            t = null,
            o = null,
            s = null
          if (
            (this.graphics()
              .hhists()
              .forEach((i) => {
                i.forEach((i) => {
                  const {
                    priceLow: r,
                    priceHigh: n,
                    firstBarTime: l,
                    lastBarTime: a,
                  } = i
                  ;(null === e || r < e) && (e = r),
                    (null === t || n > t) && (t = n),
                    null !== l && (null === o || l < o) && (o = l),
                    (null === s || a > s) && (s = a)
                })
              }),
            !(i(e) || i(t) || i(s) || i(o)))
          )
            return [
              { price: t, index: o },
              { price: e, index: s },
            ]
        }
        _updateAnchorsPrice() {
          const e = this._calculateAnchors()
          if (!e) return
          const [{ price: t }, { price: o }] = e
          this._timePoint.length &&
            ((this._timePoint[0].price = t), (this._timePoint[1].price = o)),
            this._points.length &&
              ((this._points[0].price = t), (this._points[1].price = o))
        }
        async _createPaneViews() {
          const e = this._metaInfo,
            t = e.graphics,
            i = [],
            s = this._needExtendToBarsEnding()
          if (t.hhists) {
            const { HHistPaneView: e } = await o.e(507).then(o.bind(o, 56208)),
              t = this.properties()
                .childs()
                .graphics.childs()
                .polygons?.childs()
            i.push(
              new e(this, this._model, void 0, t?.histBoxBg, s, () =>
                this._getLeftIndex(),
              ),
            )
          }
          if (t.horizlines) {
            const { HorizLinePaneView: e } = await o
              .e(507)
              .then(o.bind(o, 95258))
            i.push(
              new e(this, this._model, void 0, s, () => this._getLeftIndex()),
            )
          }
          return (
            e.plots.length > 0 &&
              i.push(this._createStudyPlotPaneView(e.plots[0].id, s)),
            e.plots.length > 1 &&
              i.push(this._createStudyPlotPaneView(e.plots[1].id, s)),
            e.plots.length > 2 &&
              i.push(this._createStudyPlotPaneView(e.plots[2].id, s)),
            i
          )
        }
        _createStudyPlotPaneView(e, t) {
          return new a.StudyPlotPaneView(
            this,
            this._model.mainSeries(),
            this._model,
            e,
            t,
          )
        }
        _needExtendToBarsEnding() {
          return (
            void 0 !==
            this.metaInfo().defaults.inputs?.mapRightBoundaryToBarStartTime
          )
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.setThemedColors(
              (0, p.volumeProfileThemedColors)(
                e.childs().graphics.childs().polygons?.hasChild('histBoxBg'),
              ),
            )
        }
        _getLeftIndex() {
          const e = this._getPointsetPoints()
          if (null === e) return null
          const [t, o] = e
          return t.index < o.index ? t.index : o.index
        }
      }
    },
    47988: (e, t, o) => {
      o.d(t, { volumeProfileThemedColors: () => p })
      var i = o(49156)
      const {
          colorColdGray200: s,
          colorColdGray900: r,
          colorBerryPink400Alpha50: n,
          colorBerryPink400Alpha75: l,
          colorSkyBlue400Alpha50: a,
          colorSkyBlue400Alpha5: c,
          colorSkyBlue400Alpha75: d,
          colorSkyBlue500: u,
        } = i.colors,
        h = {
          val: [r, s],
          poc: [r, s],
          vah: [r, s],
          developingPoc: [r, s],
          developingVA: [u, u],
          valuesColor: [r, s],
          volumeColorUp: [a, a],
          volumeColorDown: [n, n],
          valueAreaColorUp: [d, d],
          valueAreaColorDown: [l, l],
          histogramBoxColor: [c, c],
        }
      function p(e) {
        const t = 'graphics.horizlines',
          o = 'graphics.hhists',
          i = [
            { path: `${t}.pocLines.color`, colors: h.poc },
            { path: `${t}.vahLines.color`, colors: h.vah },
            { path: `${t}.valLines.color`, colors: h.val },
            { path: `${o}.histBars2.colors.0`, colors: h.volumeColorUp },
            { path: `${o}.histBars2.colors.1`, colors: h.volumeColorDown },
            { path: `${o}.histBars2.valuesColor`, colors: h.valuesColor },
            { path: `${o}.histBarsVA.colors.0`, colors: h.valueAreaColorUp },
            { path: `${o}.histBarsVA.colors.1`, colors: h.valueAreaColorDown },
            { path: `${o}.histBarsVA.valuesColor`, colors: h.valuesColor },
            { path: 'styles.developingPoc.color', colors: h.developingPoc },
            { path: 'styles.developingVAHigh.color', colors: h.developingVA },
            { path: 'styles.developingVALow.color', colors: h.developingVA },
          ]
        return (
          e &&
            i.push({
              path: 'graphics.polygons.histBoxBg.color',
              colors: h.histogramBoxColor,
            }),
          i
        )
      }
    },
  },
])
