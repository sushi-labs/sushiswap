;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5248],
  {
    55288: (e, s, t) => {
      t.r(s), t.d(s, { study_MovingAverage: () => a })
      var l = t(64147),
        r = t(12988),
        i = t(68805),
        o = t(46806),
        n = t(76350),
        u = t(52270)
      class a extends o.Study {
        constructor(e, s, t, i, o) {
          super(
            e,
            ((e) => (
              e.hasChild('currencyId') ||
                e.addChild('currencyId', new r.Property(null)),
              e.hasChild('unitId') ||
                e.addChild('unitId', new r.Property(null)),
              e.addExcludedKey('currencyId', 1),
              e.addExcludedKey('unitId', 1),
              e
            ))(s),
            t,
            i,
            o,
          ),
            (this._isActingAsSymbolSource = new l.WatchedValue(!1)),
            (this._symbolHibernated = new l.WatchedValue(!1)),
            (this._symbolResolvingActive = new l.WatchedValue(!1)),
            (this._realignToolsLastParams = null),
            (this._lastResolvedSymbolSource = ''),
            (this._onIsActingAsSymbolSourceChanged = () => {
              this._recreatePriceFormattingDependencies(),
                this._realignLineToolsIfParamsChanged()
            }),
            this._recalculateIsActingAsSymbolSource(),
            this._isActingAsSymbolSource.subscribe(
              this._onIsActingAsSymbolSourceChanged,
            )
          const n = this.properties().childs().inputs.childs().symbol
          this._previousSymbolInputValue = n.value()
        }
        isActingAsSymbolSource() {
          return this._isActingAsSymbolSource.readonly()
        }
        properties() {
          return this._properties
        }
        symbol() {
          return this._isActingAsSymbolSource.value()
            ? this.properties().childs().inputs.childs().symbol.value()
            : this.symbolSource().symbol()
        }
        symbolChanged() {
          return this._isActingAsSymbolSource.value()
            ? this.properties().childs().inputs.childs().symbol
            : this.symbolSource().symbolChanged()
        }
        interval() {
          return this.model().mainSeries().interval()
        }
        style() {
          return this._firstSourceOrSeries().symbolSource().style()
        }
        currency() {
          return this._isActingAsSymbolSource.value()
            ? this.properties().childs().currencyId.value() || null
            : this.symbolSource().currency()
        }
        unit() {
          return this._isActingAsSymbolSource.value()
            ? this.properties().childs().unitId.value() || null
            : this.symbolSource().unit()
        }
        symbolParams() {
          return (0, n.symbolParams)(this)
        }
        compareSymbolParams(e) {
          return (0, n.compareSymbolParams)(
            this,
            e,
            this._model.unitConversionEnabled(),
          )
        }
        async setSymbolParams(e) {
          this._setSymbolParamsInternal(e)
        }
        setSymbol(e) {
          this.setSymbolParams({ symbol: e })
        }
        symbolInfo() {
          if (!this._isActingAsSymbolSource.value())
            return super.symbolSource().symbolInfo()
          const e = this._getSymbolForResolve(this.symbol())
          return this._resolvedSymbols[e] ?? null
        }
        symbolSource() {
          return this._isActingAsSymbolSource.value()
            ? this
            : super.symbolSource()
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
          return (0, n.symbolSameAsCurrent)(e, this.symbolInfo())
        }
        symbolSameAsResolved(e) {
          return (0, u.symbolSameAsResolved)(
            e,
            this._lastResolvedSymbolSource,
            this.symbol(),
          )
        }
        setCurrency(e) {
          this.setSymbolParams({ currency: e })
        }
        isConvertedToOtherCurrency() {
          return (0, i.isConvertedToOtherCurrency)(this.symbolInfo())
        }
        setUnit(e) {
          this.setSymbolParams({ unit: e })
        }
        isConvertedToOtherUnit() {
          return (0, i.isConvertedToOtherUnit)(
            this.symbolInfo(),
            this._model.unitConversionEnabled(),
          )
        }
        setInterval(e) {}
        setStyle(e) {}
        symbolTitle(e, s, t) {
          return this.title(e, !0, {}, !1, s)
        }
        measureUnitId() {
          return (0, i.measureUnitId)(this.symbolInfo())
        }
        bars() {
          return super.data()
        }
        dataUpdated() {
          return this._dataUpdated
        }
        _onPropertiesChanged() {
          this._recalculateIsActingAsSymbolSource(),
            super._onPropertiesChanged(),
            this._realignLineToolsIfParamsChanged()
        }
        async _tryChangeInputs() {
          const e = this._resolvedSymbolsByInput[this.symbol()] || null
          ;(0, n.symbolSameAsCurrent)(this._previousSymbolInputValue, e) ||
            this._setSymbolParamsInternal({ currency: null, unit: null }),
            await super._tryChangeInputs(),
            (this._formatter = null),
            (this._defaultFormatter = null),
            this.priceScale()?.updateFormatter(),
            (this._previousSymbolInputValue = this.properties()
              .childs()
              .inputs.childs()
              .symbol.value())
        }
        _getSymbolObject(e) {
          const s = { symbol: e },
            t = this.currency()
          null !== t && (s['currency-id'] = t)
          const l = this.unit()
          return (
            this._model.unitConversionEnabled() &&
              null !== l &&
              (s['unit-id'] = l),
            s
          )
        }
        _onSymbolResolved(e, s, t) {
          super._onSymbolResolved(e, s, t),
            this._recreatePriceFormattingDependencies()
          const l =
            s === this.symbol()
              ? (0, i.extractSymbolNameFromSymbolInfo)(t, this.symbol())
              : null
          null !== l && (this._previousSymbolInputValue = l)
          const r = (0, i.symbolCurrency)(t),
            o = (0, i.symbolUnit)(t, this._model.unitConversionEnabled())
          this._setSymbolParamsInternal(
            { symbol: l ?? void 0, currency: r, unit: o },
            t,
          ),
            this._symbolResolvingActive.setValue(!1)
        }
        _onSymbolResolvingStart(e, s) {
          ;(this._lastResolvedSymbolSource = s),
            super._onSymbolResolvingStart(e, s),
            this._symbolResolvingActive.setValue(!0)
        }
        _onSymbolError() {
          super._onSymbolError(), this._symbolResolvingActive.setValue(!1)
        }
        _onCurrencyMayChange() {
          this.isActingAsSymbolSource()
            ? super._onCurrencyMayChange()
            : this._onCurrencyChanged()
        }
        _recalculateIsActingAsSymbolSource() {
          const e =
            '' !== this._currencySourceSymbolInputProperty?.value() ?? !1
          this._isActingAsSymbolSource.setValue(e)
        }
        _setSymbolParamsInternal(e, s) {
          const { symbol: t, currency: l, unit: r } = e,
            o = this.properties().childs(),
            n = o.inputs.childs().symbol.value(),
            u = o.currencyId.value(),
            a = o.unitId.value()
          if (
            (void 0 !== t && o.inputs.childs().symbol.setValueSilently(t),
            void 0 !== l && o.currencyId.setValueSilently(l),
            void 0 !== r && o.unitId.setValueSilently(r),
            s)
          )
            (this._resolvedSymbolsByInput[this.symbol()] = s),
              (this._resolvedSymbols[this._getSymbolForResolve(this.symbol())] =
                s),
              (this._realignToolsLastParams = null)
          else {
            const e = this.symbolInfo()
            null !== e &&
              (o.currencyId.setValueSilently((0, i.symbolCurrency)(e)),
              o.unitId.setValueSilently(
                (0, i.symbolUnit)(e, this._model.unitConversionEnabled()),
              ))
          }
          o.inputs.childs().symbol.value() !== n &&
            o.inputs.childs().symbol.fireChanged(),
            o.currencyId.value() !== u && o.currencyId.fireChanged(),
            o.unitId.value() !== a && o.unitId.fireChanged(),
            this._realignLineToolsIfParamsChanged()
        }
        _realignLineToolsIfParamsChanged() {
          let e = null === this._realignToolsLastParams
          if (null !== this._realignToolsLastParams) {
            const s = this.compareSymbolParams(this._realignToolsLastParams)
            e =
              s.symbolChanged ||
              s.intervalChanged ||
              s.currencyChanged ||
              s.unitChanged
          }
          e &&
            (this._model.realignLineTools(this),
            (this._realignToolsLastParams = this.symbolParams()))
        }
      }
    },
  },
])
