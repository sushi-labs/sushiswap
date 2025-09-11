;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9748],
  {
    10986: (e, t, n) => {
      n.r(t), n.d(t, { LineToolRegressionTrend: () => f })
      var i = n(50151),
        s = n(50503),
        r = n(68159),
        a = n(43156),
        d = n(17534),
        o = n(73305),
        l = n(37265),
        u = n(32679),
        h = n(16638),
        c = n(15491)
      const _ = (0, i.ensureDefined)(
        c.lineToolsStudyIds.LineToolRegressionTrend,
      )
      function p(e) {
        return void 0 !== e.startPrice && void 0 !== e.endPrice
      }
      function D(e, t, n, i) {
        return (
          t.styles &&
            (y(t.styles.baseLine), y(t.styles.downLine), y(t.styles.upLine)),
          t
        )
      }
      function y(e) {
        void 0 !== e &&
          void 0 !== e.visible &&
          ((e.display = e.visible ? 15 : 0), delete e.visible)
      }
      class f extends a.StudyLineDataSource {
        constructor(e, t, s, r, a) {
          super(
            e,
            (s =
              s ??
              (0, i.ensureNotNull)(
                (0, h.studyMetaInfoRepository)().findByIdSync({
                  type: 'java',
                  studyId: _,
                }),
              )),
            'linreg_',
            t ?? f.createProperties(e.backgroundTheme().spawnOwnership()),
            r,
            a,
          ),
            (this.version = 2),
            (this._trendData = null),
            Promise.all([n.e(6290), n.e(9116), n.e(1200), n.e(1583)])
              .then(n.bind(n, 90185))
              .then((e) => {
                this._setPaneViews([
                  new e.RegressionTrendPaneView(this, this._model),
                ])
              })
        }
        formatter() {
          throw new Error('This method should never be called')
        }
        pointsCount() {
          return 2
        }
        clearData() {
          ;(this._trendData = null), super.clearData()
        }
        state(e) {
          const t = super.state(e)
          return e ? { ...t, nonseriesdata: this._trendData ?? void 0 } : t
        }
        restoreData(e) {
          super.restoreData(e), (this._trendData = e.nonseriesdata ?? null)
        }
        startIndex() {
          const e = this._indexes
          if (null === this._trendData || null === e) return null
          if (e.every((e) => e !== s.INVALID_TIME_POINT_INDEX))
            return e[this._trendData.startIndex]
          const t = this._getPointsetPoints()
          return null !== t ? t[this._trendData.startIndex].index : null
        }
        endIndex() {
          const e = this._indexes
          if (null === this._trendData || null === e) return null
          if (e.every((e) => e !== s.INVALID_TIME_POINT_INDEX))
            return e[this._trendData.endIndex]
          const t = this._getPointsetPoints()
          return null !== t ? t[this._trendData.endIndex].index : null
        }
        baseLine() {
          return null === this._trendData ? null : this._trendData.baseLine
        }
        downLine() {
          return null === this._trendData ? null : this._trendData.downLine
        }
        upLine() {
          return null === this._trendData ? null : this._trendData.upLine
        }
        pearsons() {
          return null === this._trendData ? null : this._trendData.pearsons
        }
        recalcStudyIfNeeded() {
          this._onStudyInputsMayChange()
        }
        cloneable() {
          return !1
        }
        static createProperties(e, t) {
          const n = r.StudyMetaInfo.getStudyPropertyRootNameById(_),
            s = (0, i.ensureNotNull)(
              (0, h.studyMetaInfoRepository)().findByIdSync({
                type: 'java',
                studyId: _,
              }),
            ),
            a = (0, u.createDefaultsState)(
              !0,
              n,
              [],
              (0, h.studyMetaInfoRepository)().studyVersioning(),
            )
          return this.createRegressionTrendPropertiesFromStudyMetaInfoAndState(
            s,
            s,
            (0, l.merge)((0, l.clone)(a), t ?? {}),
            (0, h.studyMetaInfoRepository)().studyVersioning(),
            e,
          )
        }
        static createRegressionTrendPropertiesFromStudyMetaInfoAndState(
          e,
          t,
          n,
          i,
          s,
        ) {
          const r = (0, d.prepareStudyPropertiesForLoadChart)(e, t, n, i, D, s)
          return this._configureProperties(r), r
        }
        static studyId() {
          return _
        }
        _studyInputs(e) {
          ;(0, i.assert)(
            2 === e.length,
            'all the line tool points should be defined',
          )
          const t = !0,
            n = this._getPointTime(
              ((e) => {
                const [t, n] = e
                return t.index <= n.index ? t : n
              })(e),
              t,
            ),
            s = this._getPointTime(
              ((e) => {
                const [t, n] = e
                return n.index >= t.index ? n : t
              })(e),
              t,
            )
          return null === n || null === s
            ? (this._subscribeApplyInputsOnSeriesCompleted(), null)
            : {
                ...this.properties().childs().inputs.state(),
                'first bar time': 1e3 * n,
                'last bar time': 1e3 * s,
              }
        }
        _onDataUpdated(e, t, n) {
          null !== t &&
            (t.indexes_replace || (this._trendData = t.data),
            'nochange' !== n && (this._indexes = n),
            super._onDataUpdated(e, t, n))
        }
        _isReady() {
          return (
            null !== this._trendData &&
            void 0 !== this._trendData.startIndex &&
            void 0 !== this._trendData.endIndex &&
            p(this._trendData.upLine) &&
            p(this._trendData.baseLine) &&
            p(this._trendData.downLine)
          )
        }
        _updateAnchorsPrice() {
          if (
            !this._trendData ||
            (0, l.isNaN)(this._trendData.baseLine.startPrice) ||
            (0, l.isNaN)(this._trendData.baseLine.endPrice)
          )
            return
          let { startPrice: e, endPrice: t } = this._trendData.baseLine
          if (2 === this._points.length) {
            if (this._points[0].index > this._points[1].index) {
              const n = e
              ;(e = t), (t = n)
            }
            ;(this._points[0].price = (0, i.ensureDefined)(e)),
              (this._points[1].price = (0, i.ensureDefined)(t)),
              (this._timePoint[0].price = (0, i.ensureDefined)(e)),
              (this._timePoint[1].price = (0, i.ensureDefined)(t))
          }
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              n.e(9028),
              n.e(3889),
              n.e(8009),
              n.e(4482),
              n.e(607),
            ]).then(n.bind(n, 42838))
          ).RegressionTrendDefinitionsViewModel
        }
        _getPointsetPoints() {
          return null
        }
        static _configureProperties(e) {
          super._configureProperties(e)
          const t = e.childs().styles.childs(),
            n = [
              t.upLine.childs().linewidth,
              t.downLine.childs().linewidth,
              t.baseLine.childs().linewidth,
            ]
          e.addChild('linesWidths', new o.LineToolWidthsProperty(n))
        }
      }
    },
  },
])
