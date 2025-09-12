;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1667],
  {
    11667: (e, t, i) => {
      i.d(t, {
        LineToolRiskRewardBase: () => N,
        registerReversibleTool: () => E,
        roundValue: () => M,
      })
      var s = i(50279),
        r = i(50151),
        n = i(11542),
        o = i(8025),
        c = i(93280),
        a = i(74079),
        l = i(29875),
        u = i(76386),
        h = i(76050),
        d = i(98558),
        p = i(19063)
      class _ extends d.PriceAxisView {
        constructor(e, t) {
          super(), (this._source = e), (this._data = t)
        }
        _updateRendererData(e, t, i) {
          if (((e.visible = !1), !this._showAxisLabel())) return
          const s = this._source.priceScale()
          if (0 === this._source.points().length || null === s || s.isEmpty())
            return
          const r = this._source.ownerSource(),
            n = null !== r ? r.firstValue() : null
          if (null === n) return
          const o = this._data.priceProperty.value(),
            c = (0, p.resetTransparency)(this._data.colorProperty.value())
          ;(i.background = c),
            (i.textColor = this.generateTextColor(c)),
            (i.coordinate = s.priceToCoordinate(o, n)),
            (e.text = s.formatPrice(o, n)),
            (e.visible = !0)
        }
        _showAxisLabel() {
          return (
            this._source.properties().childs().showPriceLabels.value() ||
            this._source.model().selection().isSelected(this._source)
          )
        }
      }
      var y = i(12988)
      class P extends y.Property {
        constructor(e, t) {
          super(), (this._lineSource = e), (this._pointIndex = t)
        }
        value() {
          const e = this._lineSource.points(),
            t = e[this._pointIndex]
              ? e[this._pointIndex].price
              : this._lineSource.normalizedPoints()[this._pointIndex].price
          return this._formatAndParsePrice(t)
        }
        state() {
          return this.value()
        }
        merge(e, t) {
          return this.setValue(e), t ? [] : null
        }
        _formatAndParsePrice(e) {
          const t = (0, r.ensureNotNull)(this._lineSource.ownerSource()),
            i = t.defaultFormatter?.() || t.formatter()
          if (i.parse) {
            const t = i.format(e),
              s = i.parse(t)
            return s.res ? s.value : e
          }
          return e
        }
      }
      class S extends P {
        constructor(e) {
          super(e, 0)
        }
        setValue(e) {
          if (this._lineSource.isSourceHidden()) {
            const t = this._lineSource.normalizedPoints()
            return (
              (t[this._pointIndex].price = Number.parseFloat(e.toString())),
              void this._lineSource.restorePoints(t, [])
            )
          }
          const t = this._lineSource.points()[this._pointIndex]
          this._lineSource.startChanging(this._pointIndex, t),
            (t.price = Number.parseFloat(e.toString())),
            this._lineSource.setPoint(this._pointIndex, t),
            this._lineSource.recalculate(),
            this._lineSource.model().updateSource(this._lineSource),
            this._listeners.fire(this, ''),
            this._lineSource.endChanging(!1, !1),
            this._lineSource.syncPriceLevels()
        }
      }
      class v extends P {
        constructor(e) {
          super(e, 1)
        }
        value() {
          const e = this._lineSource.stopPrice()
          return this._formatAndParsePrice(e)
        }
        setValue(e) {
          const t = Math.round(
            Math.abs(e - this._lineSource.entryPrice()) *
              this._lineSource.ownerSourceBase(),
          )
          this._lineSource.properties().childs().stopLevel.setValue(t),
            this._lineSource.syncPriceLevels()
        }
      }
      class m extends P {
        constructor(e) {
          super(e, 2)
        }
        value() {
          const e = this._lineSource.profitPrice()
          return this._formatAndParsePrice(e)
        }
        setValue(e) {
          const t = Math.round(
            Math.abs(e - this._lineSource.entryPrice()) *
              this._lineSource.ownerSourceBase(),
          )
          this._lineSource.properties().childs().profitLevel.setValue(t),
            this._lineSource.syncPriceLevels()
        }
      }
      var f,
        g = i(37265),
        b = i(928),
        x = i(44672),
        w = i(77148),
        C = i(29023),
        k = i(45126),
        R = i(64147),
        L = i(92184),
        V = i(29137),
        A = i(19466)
      function M(e) {
        return Number.parseFloat(e.toFixed(2))
      }
      !((e) => {
        ;(e[(e.InitialVersion = 1)] = 'InitialVersion'),
          (e[(e.CurrentVersion = 2)] = 'CurrentVersion')
      })(f || (f = {}))
      const I = new Map()
      function E(e, t) {
        I.set(e, t)
      }
      const z = new k.TranslatedString(
        'reverse {tool}',
        n.t(null, void 0, i(66643)),
      )
      class N extends l.LineDataSource {
        constructor(e, t, s, n) {
          super(e, t, s, n),
            (this._hasEditableCoordinates = new R.WatchedValue(!1)),
            (this._studySource = null),
            (this._metaInfo = null),
            (this._riskInChange = !1),
            this._syncStateExclusions.push(
              'points',
              'entryPrice',
              'stopPrice',
              'targetPrice',
              'stopLevel',
              'profitLevel',
              'riskSize',
              'qty',
              'amountTarget',
              'amountStop',
            )
          const o = this._metaInfo?.inputs.find(
              (e) => 'account_currency' === e.id,
            ),
            a = t.childs().currency.value()
          o && !o.options.includes(a) && t.childs().currency.setValue(o.defval),
            o && t.childs().currency.subscribe(this, this._updateStudySource),
            (this.version = 2),
            t.hasChild('stopLevel') ||
              t.hasChild('profitLevel') ||
              (t.addProperty('stopLevel', 0),
              t.addProperty('profitLevel', 0),
              this.ownerSourceChanged().subscribe(
                this,
                () => {
                  const i = (0, r.ensureNotNull)(
                      e.timeScale().visibleBarsStrictRange(),
                    ),
                    s = i.firstBar(),
                    n = i.lastBar(),
                    o = (0, r.ensureNotNull)(this.ownerSource()),
                    a = o.priceScale()
                  if (a) {
                    let e = (0, r.ensureNotNull)(
                      o.priceRange(s, n, {
                        targetPriceScale: a,
                        scaleSeriesOnly: a?.isScaleSeriesOnly(),
                      }),
                    )
                    if (a.isLog()) {
                      const t = a.logicalToPrice(e.minValue()),
                        i = a.logicalToPrice(e.maxValue())
                      e = new c.PriceRange(t, i)
                    }
                    if (e && !e.isEmpty()) {
                      const i = Math.round(
                        0.2 * e.length() * this.ownerSourceBase(),
                      )
                      t.merge({ stopLevel: i, profitLevel: i })
                    }
                  }
                },
                !0,
              )),
            t.hasChild('entryPointCurrencyRate') ||
              t.addProperty('entryPointCurrencyRate', 1),
            t.hasChild('closePointCurrencyRate') ||
              t.addProperty('closePointCurrencyRate', 1)
          const l = t.childs()
          l.stopLevel.subscribe(this, this.recalculate),
            l.stopLevel.subscribe(null, () => {
              this.properties().childs().stopPrice.fireChanged()
            }),
            l.profitLevel.subscribe(this, this.recalculate),
            l.profitLevel.subscribe(null, () => {
              this.properties().childs().targetPrice.fireChanged()
            }),
            t.addChild('entryPrice', new S(this)),
            t.addChild('stopPrice', new v(this)),
            t.addChild('targetPrice', new m(this)),
            t.hasChild('riskSize') || t.addProperty('riskSize', 0),
            t.hasChild('qty') || t.addProperty('qty', 0),
            t.hasChild('amountTarget') ||
              t.addProperty('amountTarget', l.accountSize.value()),
            t.hasChild('amountStop') ||
              t.addProperty('amountStop', l.accountSize.value()),
            [
              'riskSize',
              'qty',
              'amountTarget',
              'amountStop',
              'currency',
              'entryPointCurrencyRate',
              'closePointCurrencyRate',
            ].forEach((e) => {
              t.addExcludedKey(e, 1)
            }),
            [
              'qty',
              'amountTarget',
              'amountStop',
              'currency',
              'entryPointCurrencyRate',
              'closePointCurrencyRate',
            ].forEach((e) => {
              t.addExcludedKey(e, 4)
            }),
            l.risk.subscribe(this, this._recalculateRiskSize),
            l.accountSize.subscribe(this, this._recalculateRiskSize),
            l.riskDisplayMode.subscribe(this, this._recalculateRisk),
            l.riskDisplayMode.subscribe(this, this._recalculateRiskSize),
            l.entryPrice.subscribe(this, this._recalculateRiskSize),
            l.stopPrice.subscribe(this, this._recalculateRiskSize),
            l.profitLevel.subscribe(this, this._recalculateRiskSize),
            l.profitLevel.subscribe(this, this.syncPriceLevels.bind(this)),
            l.stopLevel.subscribe(this, this._recalculateRiskSize),
            l.stopLevel.subscribe(this, this.syncPriceLevels.bind(this)),
            l.qty.subscribe(this, this._recalculateRiskSize),
            this.ownerSourceChanged().subscribe(null, (e, t) => {
              e && e.barsProvider().dataUpdated().unsubscribeAll(this),
                t &&
                  t
                    .barsProvider()
                    .dataUpdated()
                    .subscribe(this, this._onSeriesUpdated)
            }),
            this.pointAdded().subscribe(this, (e) => {
              switch (e) {
                case h.RiskRewardPointIndex.Entry:
                case h.RiskRewardPointIndex.Close:
                  this._recalculateRiskSize(), this._recalculateQty()
              }
              this._updateStudySource()
            }),
            this.pointChanged().subscribe(this, (e) => {
              switch (e) {
                case h.RiskRewardPointIndex.Entry:
                case h.RiskRewardPointIndex.Close:
                  this._recalculateRiskSize(), this._recalculateQty()
              }
              this._updateStudySource()
            }),
            l.riskDisplayMode.value() === u.RiskDisplayMode.Percentage &&
              l.risk.value() > 100 &&
              l.riskDisplayMode.setValueSilently(u.RiskDisplayMode.Money),
            l.entryPrice.subscribe(this, this._recalculateQty),
            l.stopPrice.subscribe(this, this._recalculateQty),
            l.riskSize.subscribe(this, this._recalculateQty),
            l.entryPrice.subscribe(this, this._recalculateAmount),
            l.profitLevel.subscribe(this, this._recalculateAmount),
            l.stopLevel.subscribe(this, this._recalculateAmount),
            l.accountSize.subscribe(this, this._recalculateAmount),
            l.riskSize.subscribe(this, this._recalculateAmount),
            l.qty.subscribe(this, this._recalculateAmount),
            (this._entryPriceAxisView = new _(this, {
              colorProperty: l.linecolor,
              priceProperty: l.entryPrice,
            })),
            (this._stopPriceAxisView = new _(this, {
              colorProperty: l.stopBackground,
              priceProperty: l.stopPrice,
            })),
            (this._profitPriceAxisView = new _(this, {
              colorProperty: l.profitBackground,
              priceProperty: l.targetPrice,
            })),
            [l.entryPointCurrencyRate, l.closePointCurrencyRate].forEach(
              (e) => {
                e.subscribe(this, () => {
                  this._recalculateAmount(),
                    this._recalculateRiskSize(),
                    this._recalculateQty()
                })
              },
            ),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 1971))
              .then(({ RiskRewardPaneView: t }) => {
                const i = [new t(this, e)]
                this._setPaneViews(i)
              })
        }
        destroy() {
          this.ownerSource()?.barsProvider().dataUpdated().unsubscribeAll(this),
            this.ownerSourceChanged().unsubscribeAll(this),
            this._studySource?.destroy(),
            super.destroy()
        }
        availableCurrencies() {
          const e = (0, r.ensureDefined)(
            this._metaInfo?.inputs.find((e) => 'account_currency' === e.id),
          )
          return (0, r.ensureDefined)(e.options)
        }
        setOwnerSource(e) {
          super.setOwnerSource(e)
          const t = this.ownerSource()
          t &&
            t.symbolSource().symbolInfo() &&
            (this._recalculateAmount(),
            this._recalculateRiskSize(),
            this._recalculateQty())
        }
        pointsCount() {
          return 2
        }
        priceAxisPoints() {
          if (!this._points.length) return []
          const e = this._points[0],
            t = this._properties.childs()
          return [
            { ...e, price: t.stopPrice.value() },
            { ...e, price: t.entryPrice.value() },
            { ...e, price: t.targetPrice.value() },
          ]
        }
        priceAxisViews(e, t) {
          return this.isSourceHidden() ||
            t !== this.priceScale() ||
            this._model.paneForSource(this) !== e
            ? null
            : [
                this._entryPriceAxisView,
                this._stopPriceAxisView,
                this._profitPriceAxisView,
              ]
        }
        updateAllViews(e) {
          this.isActualSymbol() &&
            this.properties().childs().visible.value() &&
            (((0, b.hideAllDrawings)().value() && this.userEditEnabled()) ||
              (super.updateAllViews(e),
              this._entryPriceAxisView.update(e),
              this._stopPriceAxisView.update(e),
              this._profitPriceAxisView.update(e)))
        }
        migrateVersion(e, t, i) {
          if (1 === e && this._points.length >= 1) {
            const e = []
            e.push(this._points[0])
            let t = this._points[0]
            if (
              ((t = {
                price: t.price,
                index: this._getClosePointIndex(t.index),
                interval: this._properties.childs().interval.value(),
              }),
              e.push(t),
              this._points[1] && e.push(this._points[1]),
              this._points[2] && e.push(this._points[2]),
              (this._points = e),
              this._timePoint.length >= 1)
            ) {
              const t = [],
                i = this._timePoint[0]
              t.push(i)
              const s = {
                price: i.price,
                time_t: i.time_t,
                offset: this._getClosePointIndex(i.offset),
              }
              t.push(s),
                this._timePoint[1] && e.push(this._points[1]),
                this._timePoint[2] && e.push(this._points[2]),
                (this._timePoint = t)
            }
          }
        }
        restoreExternalState(e) {
          if (!(0, g.isNumber)(e.entryPrice))
            return void super.restoreExternalState(e)
          let t
          if (this.isActualSymbol()) t = e
          else {
            const { entryPrice: i, ...s } = e,
              [r] = this._timePoint
            ;(r.price = i), (t = s)
          }
          this.properties().merge(t)
        }
        addPoint(e, t, i) {
          ;(e.price = this._roundPrice(e.price)), super.addPoint(e, void 0, !0)
          const s = { price: e.price, index: this._getClosePointIndex(e.index) }
          super._addPointIntenal(s, void 0, !0)
          const r = this._calculateActualEntry(e, s)
          if (r) {
            super._addPointIntenal(r, void 0, !0)
            const e = this._findClosePoint(r, s)
            e && super._addPointIntenal(e, void 0, !0)
          }
          return (
            (this._lastPoint = null),
            this._normalizePoints(),
            this.createServerPoints(),
            !0
          )
        }
        setPoint(e, t, i, s) {
          if (this.isSourceHidden()) return
          const r = this.properties().childs()
          switch ((this._muteSyncLineStyle(), e)) {
            case 0:
              this._changeEntryPoint({
                ...t,
                interval: this._model.mainSeries().interval(),
              })
              break
            case 2:
              r.stopPrice.setValue(this.prepareStopPrice(t.price))
              break
            case 3:
              r.targetPrice.setValue(this.prepareProfitPrice(t.price))
              break
            case 1:
              ;(t.price = this._points[0].price),
                super.setPoint(1, t),
                this.recalculate()
          }
          this._unmuteSyncLineStyleWithoutApplyingChanges(),
            s || this.syncPriceLevels()
        }
        getPoint(e) {
          if (this.isSourceHidden()) return null
          switch (e) {
            case 0:
              return this._points[0]
            case 1:
              return {
                index: this._points[1].index,
                price: this._points[0].price,
              }
            case 2:
              return { index: this._points[0].index, price: this.stopPrice() }
            case 3:
              return { index: this._points[0].index, price: this.profitPrice() }
          }
          return null
        }
        setPoints(e) {
          this.isSourceHidden() ||
            (this._muteSyncLineStyle(),
            super.setPoints(e),
            this.recalculate(),
            this._unmuteSyncLineStyleWithoutApplyingChanges(),
            this.syncPriceLevels())
        }
        start() {
          super.start(), this.recalculate()
        }
        startMoving(e, t, i, s) {
          const n = (0, r.ensureDefined)(e.logical)
          ;(n.price = this._roundPrice(n.price)), super.startMoving(e, t, i)
        }
        move(e, t, i, s) {
          const n = (0, r.ensureDefined)(e.logical)
          ;(n.price = this._roundPrice(n.price)),
            super.move(e, t, i),
            this.recalculate(),
            this._entryPriceAxisView.update((0, x.sourceChangeEvent)(this.id()))
        }
        axisPoints() {
          if (!this._points[h.RiskRewardPointIndex.ActualEntry]) return []
          const e = this._points[h.RiskRewardPointIndex.ActualEntry]
          let t = null
          if (4 === this._points.length)
            t = this._points[h.RiskRewardPointIndex.ActualClose]
          else {
            const e = this.lastBarData()
            if (!e) return []
            t = { index: e.index, price: e.closePrice }
          }
          return [e, t]
        }
        recalculateStateByData() {
          this.recalculate()
        }
        recalculate() {
          if (0 === this.points().length) return
          const e = this.properties().childs(),
            t = e.targetPrice.value(),
            i = e.stopPrice.value(),
            s = [this._points[0], this._points[1]],
            r = this._calculateActualEntry(this.points()[0], this.points()[1]),
            n = this._model.mainSeries().interval()
          if (r) {
            s.push({ ...r, interval: n })
            const e = this._findClosePoint(r, this.points()[1])
            e && s.push({ ...e, interval: n })
          }
          ;(this._points = s),
            t !== e.targetPrice.value() && e.targetPrice.fireChanged(),
            i !== e.stopPrice.value() && e.stopPrice.fireChanged()
        }
        syncPriceLevels() {
          const e = this.linkKey().value()
          if (e) {
            const t = this.properties().childs()
            this._syncLineStyleChanges(e, {
              entryPrice: t.entryPrice.value(),
              stopLevel: t.stopLevel.value(),
              profitLevel: t.profitLevel.value(),
            })
          }
        }
        entryPrice() {
          const e = this.points()
          return 0 === e.length ? this._timePoint[0].price : e[0].price
        }
        lastBarData() {
          const e = this.ownerSource()?.barsProvider()
          if (!e) return null
          const t = e.bars().firstIndex(),
            i = e.bars().lastIndex()
          if (null === t || null === i || isNaN(t) || isNaN(i)) return null
          const s = this.points()
          if (4 === s.length) {
            const e = s[h.RiskRewardPointIndex.ActualClose]
            return e.index < t
              ? null
              : { closePrice: e.price, index: Math.min(i, e.index) }
          }
          const n = s[h.RiskRewardPointIndex.Close]
          if (n.index < t) return null
          const c = Math.min(i, n.index),
            a = e.bars().search(c, o.PlotRowSearchMode.NearestLeft)
          return null === a
            ? null
            : { closePrice: (0, r.ensure)(a.value[4]), index: a.index }
        }
        ownerSourceBase() {
          const e = this.ownerSource()?.symbolSource().symbolInfo()
          return e ? e.pricescale / e.minmov : 100
        }
        getOrderTemplate() {
          return null
        }
        template() {
          const e = this.properties().childs(),
            t = super.template()
          return (
            (t.stopLevel = e.stopLevel.value()),
            (t.profitLevel = e.profitLevel.value()),
            t
          )
        }
        async additionalActions(e) {
          return {
            actions: [
              new C.Action({
                actionId: 'Chart.LineTool.RiskReward.Reverse',
                options: {
                  checkable: !1,
                  label: n.t(null, void 0, i(64489)),
                  onExecute: () => {
                    const t = z.format({
                      tool: (0, V.getTranslatedStringForSource)(
                        A.TitleDisplayTarget.StatusLine,
                        this,
                      ),
                    })
                    e.beginUndoMacro(t)
                    const i = ((e, t) => {
                      const i = e.points(),
                        s = e.zorder(),
                        n = (0, r.ensureNotNull)(t.model().paneForSource(e)),
                        o = (0, r.ensureNotNull)(e.ownerSource()),
                        c = (0, r.ensureDefined)(I.get(e.toolname)),
                        a = c.propertiesFactory(
                          t.model().backgroundTheme().spawnOwnership(),
                          e.properties().state(),
                        ),
                        l = e.linkKey().value(),
                        u = l
                          ? w.CreateLineToolSyncMode.ForceOn
                          : w.CreateLineToolSyncMode.ForceOff,
                        h = t.createLineTool({
                          pane: n,
                          point: i[0],
                          linkKey: l ? (0, L.randomHash)() : void 0,
                          linetool: c.targetToolName,
                          properties: a,
                          ownerSource: o,
                          synchronizationMode: u,
                          sharingMode: e.sharingMode().value(),
                        })
                      return (
                        h &&
                          (t.startChangingLinetool(h, h.points()[1], 1),
                          t.changeLinePoint(i[1]),
                          t.endChangingLinetool(!1),
                          t.insertBefore([h], e),
                          h.setZorder(s)),
                        t.removeSource(e, !1),
                        h
                      )
                    })(this, e)
                    e.endUndoMacro(),
                      i &&
                        e.model().selectionMacro((e) => {
                          e.addSourceToSelection(i, null)
                        })
                  },
                },
              }),
            ],
            placement: 'CustomAction',
          }
        }
        _entryPointCurrencyRate() {
          return this.properties().childs().entryPointCurrencyRate.value()
        }
        _closePointCurrencyRate() {
          return this.properties().childs().closePointCurrencyRate.value()
        }
        _ignoreSourceEvent(e) {
          return (
            super._ignoreSourceEvent(e) &&
            e.sourceId !== this._model.mainSeries().id()
          )
        }
        _applyTemplateImpl(e) {
          const { targetPrice: t, stopPrice: i, entryPrice: s, ...r } = e
          super._applyTemplateImpl(r)
          const n = this.properties().childs()
          void 0 !== e.stopLevel && n.stopLevel.setValue(e.stopLevel),
            void 0 !== e.profitLevel && n.profitLevel.setValue(e.profitLevel)
        }
        _propertiesStateExclusions() {
          return [
            ...super._propertiesStateExclusions(),
            'entryPrice',
            'stopPrice',
            'targetPrice',
          ]
        }
        _correctPoints(e, t) {
          if (!this.isActualSymbol()) return !1
          const i = super._correctPoints(e.slice(0, this.pointsCount()), t)
          for (let t = 0; t < e.length; t++) {
            const i = e[t]
            i.price = this._roundPrice(i.price)
          }
          return i
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              i.e(6406),
              i.e(3889),
              i.e(8009),
              i.e(8056),
              i.e(8537),
            ]).then(i.bind(i, 2243))
          ).RiskRewardDefinitionsViewModel
        }
        _recalculateRiskSize() {
          if (this._riskInChange) return
          const e = this.properties().childs(),
            t = e.risk.value(),
            i = e.riskDisplayMode.value(),
            s = e.accountSize.value()
          i === u.RiskDisplayMode.Percentage
            ? e.riskSize.setValue((t / 100) * s)
            : t > s
              ? (e.risk.setValue(s), e.riskSize.setValue(s))
              : e.riskSize.setValue(t)
        }
        _roundPrice(e) {
          const t = this.ownerSourceBase()
          return Math.round(e * t) / t
        }
        _ownerSourcePointValue() {
          return (
            this.ownerSource()?.symbolSource().symbolInfo()?.pointvalue ?? 1
          )
        }
        _onSourceHiddenMayChange() {
          super._onSourceHiddenMayChange(), this._updateStudySource()
        }
        static _configureProperties(e) {
          l.LineDataSource._configureProperties(e),
            e.addExcludedKey('stopLevel', 1),
            e.addExcludedKey('profitLevel', 1),
            e.addExcludedKey('stopPrice', 1),
            e.addExcludedKey('targetPrice', 1),
            e.addExcludedKey('entryPrice', 1)
        }
        _onSeriesUpdated(e, t, i) {
          this.isSourceHidden() ||
            this._points.length < 2 ||
            (null !== i &&
              i.index >
                Math.max(this._points[0].index, this._points[1].index)) ||
            this.recalculateStateByData()
        }
        _recalculateRisk() {
          const e = this.properties().childs(),
            t = e.riskDisplayMode.value(),
            i = e.riskSize.value(),
            s = e.accountSize.value()
          let r = e.risk.value()
          ;(r =
            t === u.RiskDisplayMode.Percentage
              ? M((i / s) * 100)
              : M((s / 100) * r)),
            (this._riskInChange = !0),
            e.risk.setValue(
              Number.parseFloat(
                this._riskFormatter(t).format(r, {
                  ignoreLocaleNumberFormat: !0,
                }),
              ),
            ),
            (this._riskInChange = !1)
        }
        _recalculateAmount() {
          if (0 === this.points().length) return
          const e = this.properties().childs(),
            t = e.accountSize.value(),
            i = e.entryPrice.value(),
            s = e.qty.value(),
            r = e.stopPrice.value(),
            n = e.targetPrice.value(),
            o = this._ownerSourcePointValue()
          e.amountTarget.setValue(this._amountTarget(t, n, i, s, o)),
            e.amountStop.setValue(this._amountStop(t, r, i, s, o))
        }
        _recalculateQty() {
          if (0 === this.points().length) return
          const e = this.properties().childs(),
            t = e.entryPrice.value(),
            i = e.stopPrice.value(),
            s = e.riskSize.value(),
            r = this._entryPointCurrencyRate(),
            n =
              null === r
                ? Number.NaN
                : s / (Math.abs(t - i) * this._ownerSourcePointValue() * r)
          e.qty.setValue(n)
        }
        _calculateActualEntry(e, t) {
          const i = this.ownerSource()
          if (!i) return null
          const s = i.barsProvider().bars()
          if (s.isEmpty()) return null
          const n = (0, r.ensureNotNull)(s.firstIndex()),
            o = Math.max(e.index, n),
            c = e.price,
            a = (0, r.ensureNotNull)(s.lastIndex()),
            l = Math.min(a, t.index - 1)
          for (const e of s.rangeIterator(o, l + 1)) {
            const t = e.value
            if (
              null !== t &&
              (0, r.ensure)(t[2]) >= c &&
              (0, r.ensure)(t[3]) <= c
            )
              return { index: e.index, price: c }
          }
          return null
        }
        _riskFormatter(e) {
          return e === u.RiskDisplayMode.Percentage
            ? (0, a.getNumericFormatter)(2)
            : (0, a.getNumericFormatter)()
        }
        _getClosePointIndex(e) {
          const t = this._model.timeScale(),
            i = Math.round(t.width() / t.barSpacing())
          return e + Math.max(3, Math.round(0.15 * i))
        }
        _findClosePoint(e, t) {
          const i = this.ownerSource()
          if (!i) return null
          const s = i.barsProvider().bars(),
            n = (0, r.ensureNotNull)(s.firstIndex()),
            o = Math.max(e.index, n),
            c = (0, r.ensureNotNull)(s.lastIndex()),
            a = Math.min(c, t.index - 1)
          for (const e of s.rangeIterator(o, a + 1)) {
            const t = e.value
            if (null === t) continue
            const i = this._checkStopPrice(t)
            if (null != i) return { index: e.index, price: i }
          }
          return null
        }
        _changeEntryPoint(e) {
          const t = this.properties().childs(),
            i = t.stopPrice.value(),
            s = t.targetPrice.value(),
            r = 1 / this.ownerSourceBase(),
            n = Math.min(i, s) + r,
            o = Math.max(i, s) - r
          ;(e.price = Math.max(n, Math.min(o, this._roundPrice(e.price)))),
            this.setPoints([e, { ...this._points[1], price: e.price }]),
            t.stopPrice.setValue(i),
            t.targetPrice.setValue(s)
        }
        _updateStudySource() {
          if (!this._metaInfo || this._isDestroyed) return
          const e = this._properties.childs().currency.value(),
            t = this._model.mainSeries(),
            i = 'NONE' !== e && e !== t.currency() && !this.isSourceHidden()
          if (
            (!i && this._studySource
              ? (this._studySource.destroy(),
                (this._studySource = null),
                this._properties.childs().entryPointCurrencyRate.setValue(1),
                this._properties.childs().closePointCurrencyRate.setValue(1))
              : i &&
                !this._studySource &&
                ((this._studySource = new RiskRewardStudyDataSource(
                  this._model.chartApi(),
                  t.seriesSource(),
                )),
                this._studySource.nonSeriesData().subscribe((e) => {
                  e &&
                    (this._properties
                      .childs()
                      .entryPointCurrencyRate.setValue(e.currency_ratio[0]),
                    this._properties
                      .childs()
                      .closePointCurrencyRate.setValue(
                        e.currency_ratio[1] ?? e.currency_ratio[0],
                      ))
                })),
            this._studySource && this._points.length >= 2)
          ) {
            const i = this._model.timeScale(),
              r = t.data().bars().firstIndex(),
              n = t.data().bars().lastIndex()
            if (null === r || null === n) return
            const o = Math.min(n, Math.max(r, this._points[0].index)),
              c = Math.min(n, Math.max(r, this._points[1].index)),
              a = i.indexToTimePoint(o),
              l = i.indexToTimePoint(c)
            if (null !== a && null !== l) {
              const t = {
                ...this._studySource.inputs(),
                start_time: 1e3 * a,
                end_time: 1e3 * l,
                entry_price: this.entryPrice(),
                target_price: this.profitPrice(),
                stop_price: this.stopPrice(),
                account_currency: e,
              }
              ;(0, s.default)(t, this._studySource.inputs()) ||
                this._studySource.setInputs(t),
                this._studySource.isStarted() || this._studySource.start()
            }
          }
        }
      }
    },
    76386: (e, t, i) => {
      var s
      i.d(t, { RiskDisplayMode: () => s }),
        ((e) => {
          ;(e.Percentage = 'percents'), (e.Money = 'money')
        })(s || (s = {}))
    },
    76050: (e, t, i) => {
      var s
      i.d(t, { RiskRewardPointIndex: () => s }),
        ((e) => {
          ;(e[(e.Entry = 0)] = 'Entry'),
            (e[(e.Close = 1)] = 'Close'),
            (e[(e.ActualEntry = 2)] = 'ActualEntry'),
            (e[(e.ActualClose = 3)] = 'ActualClose')
        })(s || (s = {}))
    },
  },
])
