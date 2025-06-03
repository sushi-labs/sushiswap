;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1652],
  {
    16951: (e, t, i) => {
      i.r(t),
        i.d(t, {
          TradedSourcesManager: () => Q,
          canCreateOrUpdateSourceByContext: () => z,
        })
      var r,
        s = i(822914),
        o = i(650151),
        a = i(372605),
        n = i(409432),
        d = i(648067),
        l = i(6835),
        c = i(817680),
        h = i(656846),
        u = i(864348),
        p = i(690839),
        _ = i(583705),
        m = i(247905),
        y = i(144273),
        b = i(650802)
      !((e) => {
        e[(e.Threshold = 4)] = 'Threshold'
      })(r || (r = {}))
      class v {
        constructor() {
          ;(this._prevPixelRatio = null),
            (this._prevCssWidth = null),
            (this._horizontalBorderPoint = null),
            (this._renderers = []),
            (this._visibleItemsRenderers = null),
            (this._sortedItemRenderers = null),
            (this._isNoOverlapMode = new b.WatchedValue(!1)),
            (this._isItemsOverlap = !1),
            (this._invalidated = !1)
        }
        registerRenderer(e) {
          this._renderers.push(e)
        }
        removeRenderer(e) {
          if (null !== e)
            for (let t = 0; t < this._renderers.length; t++) {
              if (this._renderers[t] === e) {
                this._renderers.splice(t, 1)
                break
              }
            }
        }
        invalidateCache() {
          this._renderers.forEach((e) => e.clearCache()),
            (this._horizontalBorderPoint = null),
            (this._visibleItemsRenderers = null),
            (this._sortedItemRenderers = null),
            (this._invalidated = !0)
        }
        isItemsOverlap() {
          return this._isItemsOverlap
        }
        setNoOverlapMode(e) {
          this.invalidateCache(), this._isNoOverlapMode.setValue(e)
        }
        isNoOverlapMode() {
          return this._isNoOverlapMode.value()
        }
        noOverlapModeChanged() {
          return this._isNoOverlapMode
        }
        getBorderPoint(e) {
          return this._horizontalBorderPoint
        }
        alignItems(e) {
          if (this._invalidated) {
            if (
              (this._checkCacheValid(e),
              this._alignItemsHorizontally(e),
              this._checkIfItemsOverlap(e),
              this._isNoOverlapMode.value())
            ) {
              if (!this._isItemsOverlap) return void this.setNoOverlapMode(!1)
              this._alignItemsVertically(e)
            }
            this._invalidated = !1
          }
        }
        _checkCacheValid(e) {
          const t = this._prevPixelRatio !== e.pixelRatio,
            i = this._prevCssWidth !== e.cssWidth
          ;(t || i) &&
            ((this._prevPixelRatio = e.pixelRatio),
            (this._prevCssWidth = e.cssWidth),
            t && this._renderers.forEach((e) => e.clearTextCache()),
            this.invalidateCache())
        }
        _alignItemsHorizontally(e) {
          if (null === this._horizontalBorderPoint) {
            const t = this._getVisibleItemRenderers(e)
            if (0 === t.length) return
            const i = t.map((t) => t.rect(e))
            let r = i[0].right,
              s = i[0].left
            for (const e of i)
              e.right > r && (r = e.right), e.left < s && (s = e.left)
            ;(this._horizontalBorderPoint = {
              rightmostBorder: r,
              leftmostBorder: s,
            }),
              this._renderers.forEach((t) =>
                t.applyHorizontalOffset(
                  (0, o.ensureNotNull)(this._horizontalBorderPoint),
                  e,
                ),
              )
          }
        }
        _checkIfItemsOverlap(e) {
          const t = this._getSortedRenderers(e)
          let i = !1
          for (let s = 1; s < t.length; s++) {
            const o = t[s],
              a = t[s - 1]
            if (o.rect(e).top - a.rect(e).bottom + r.Threshold <= 0) {
              i = !0
              break
            }
          }
          this._isItemsOverlap = i
        }
        _alignItemsVertically(e) {
          const t = this._getSortedRenderers(e)
          for (let i = 1; i < t.length; i++) {
            const s = t[i],
              o = t[i - 1]
            s.rectWithOffsets(e).top -
              o.rectWithOffsets(e).bottom +
              r.Threshold <=
              0 &&
              (s.clearCache(),
              s.setAlignedTopCoordinate(o.rectWithOffsets(e).bottom))
          }
        }
        _getSortedRenderers(e) {
          return (
            null === this._sortedItemRenderers &&
              (this._sortedItemRenderers = this._getVisibleItemRenderers(
                e,
              ).sort((e, t) => t.data().sortingIndex - e.data().sortingIndex)),
            this._sortedItemRenderers
          )
        }
        _getVisibleItemRenderers(e) {
          if (null === this._visibleItemsRenderers) {
            this._visibleItemsRenderers = []
            for (const t of this._renderers) {
              const i = t.itemRenderers().filter((t) => {
                const i = t.rect(e)
                return (
                  t.data().visible && i.top < e.physicalHeight && i.bottom > 0
                )
              })
              this._visibleItemsRenderers.push(...i)
            }
          }
          return this._visibleItemsRenderers
        }
      }
      var f = i(807107),
        g = i(814127),
        S = i(918114),
        k = i(466052)
      const P = (0, l.getLogger)('Trading.Source.SymbolDataProvider')
      class T {
        constructor(e, t, i, r, s) {
          ;(this._symbol = null),
            (this._actualTradingSymbol = null),
            (this._isStarted = !1),
            (this._isSubscribed = !1),
            (this._symbolData = null),
            (this._last = null),
            (this._currencies = {}),
            (this._specificTradingOptions = null),
            (this._pipValueType = null),
            (this._pipValuesSpawn = null),
            (this._onUpdate = new k.Delegate()),
            (this._mainSeries = e),
            (this._realtimeProvider = t),
            (this._symbolSpecificTradingOptionsGetter =
              s.symbolSpecificTradingOptionsGetter),
            (this._positionSupportReverseGetter =
              s.positionSupportReverseGetter),
            (this._positionSupportBracketsGetter =
              s.positionSupportBracketsGetter),
            (this._symbolData = {
              minTick: 1 / this._mainSeries.base(),
              pipSize: 1,
              lotSize: 1,
              priceMagnifier: 1,
              quantityFormatter: new g.QuantityFormatter(),
              priceFormatter: new S.PriceFormatter(),
            }),
            (this._currencyGetters = {
              1: s.positionCurrencyGetter,
              0: s.orderCurrencyGetter,
            }),
            (this._pipValueType$ = i),
            P.logNormal(
              `[Symbol_${this._symbol}] Init with default values: minTick ${this._symbolData.minTick}, pipSize ${this._symbolData.pipSize}, pipValue: ${JSON.stringify(this.pipValue())}, pipValueType ${this._pipValueType}`,
            ),
            (this._updateLastHandler = this._updateLast.bind(this)),
            (this._makeActualTradingSymbolObservable = r),
            this._mainSeries
              .dataEvents()
              .symbolResolved()
              .subscribe(this, () => this._updateActualTradingSymbol()),
            this._mainSeries
              .dataEvents()
              .symbolError()
              .subscribe(this, () => this._updateActualTradingSymbol()),
            (this._hibernated = e.model().collapsed().spawn()),
            this._hibernated.subscribe((e) => {
              this.isActualSymbol() && !e
                ? this._subscribe()
                : this._unsubscribe()
            }),
            this._updateActualTradingSymbol()
        }
        start(e) {
          null !== this._symbol &&
            null === e &&
            (this._stop(), P.logNormal('Current symbol null')),
            (this._symbol = e)
          const t = this.isActualSymbol()
          if (
            (t && !this._hibernated.value()
              ? this._subscribe()
              : this._unsubscribe(),
            !t || this._isStarted)
          )
            return
          const i = (0, o.ensureNotNull)(this._symbol)
          P.logNormal(`Start symbol ${i}`),
            (this._isStarted = !0),
            this._updateSymbolData(),
            this._updateCurrencies(),
            this._updateSpecificTradingOptions()
        }
        destroy() {
          this._stop(),
            this._mainSeries.dataEvents().symbolResolved().unsubscribeAll(this),
            this._mainSeries.dataEvents().symbolError().unsubscribeAll(this),
            this._hibernated.destroy()
        }
        symbol() {
          return this._symbol
        }
        isActualSymbol() {
          if (null === this._symbol) return !1
          if (null === this._mainSeries.symbolInfo()) return !1
          if (this._actualTradingSymbol === this._symbol) return !0
          return (
            !(
              this._mainSeries.isConvertedToOtherCurrency() ||
              this._mainSeries.isConvertedToOtherUnit()
            ) && this._mainSeries.symbolSameAsCurrent(this._symbol)
          )
        }
        onUpdate() {
          return this._onUpdate
        }
        positionCurrency() {
          return this._currencies[1]
        }
        orderCurrency() {
          return this._currencies[0]
        }
        supportOrderBrackets() {
          var e, t, i, r
          return (
            null !==
              (r =
                (null === (e = this._specificTradingOptions) || void 0 === e
                  ? void 0
                  : e.supportOrderBrackets) &&
                (null === (t = this._specificTradingOptions) || void 0 === t
                  ? void 0
                  : t.supportModifyBrackets) &&
                (null === (i = this._specificTradingOptions) || void 0 === i
                  ? void 0
                  : i.supportAddBracketsToExistingOrder)) &&
            void 0 !== r &&
            r
          )
        }
        supportPositionBrackets() {
          return (
            null !== this._specificTradingOptions &&
            this._positionSupportBracketsGetter(this._specificTradingOptions)
          )
        }
        supportPositionReverse() {
          return (
            null !== this._specificTradingOptions &&
            this._positionSupportReverseGetter(this._specificTradingOptions)
          )
        }
        async qtyInfo() {
          return null === this._symbol
            ? null
            : (await this._realtimeProvider.symbolInfo(this._symbol)).qty
        }
        lastData() {
          return this._last
        }
        symbolData() {
          return this._symbolData
        }
        pipValue() {
          var e, t
          return null !==
            (t =
              null === (e = this._pipValuesSpawn) || void 0 === e
                ? void 0
                : e.value()) && void 0 !== t
            ? t
            : null
        }
        pipValueType() {
          return this._pipValueType
        }
        getMinTick(e) {
          const t = (0, o.ensureNotNull)(this._symbolData)
          return (0, f.getMinTick)({
            minTick: t.minTick,
            price: e,
            variableMinTickData: t.variableMinTickData,
          })
        }
        _subscribe() {
          this._isSubscribed ||
            ((this._isSubscribed = !0),
            this._realtimeProvider.subscribeRealtime(
              (0, o.ensureNotNull)(this._symbol),
              this._updateLastHandler,
            ),
            this._realtimeProvider.onStatusChanged.subscribe(
              this,
              this._updateSymbolData,
            ),
            this._createPipsHelpersSpawns())
        }
        _unsubscribe() {
          this._isSubscribed &&
            ((this._isSubscribed = !1),
            this._realtimeProvider.unsubscribeRealtime(
              (0, o.ensureNotNull)(this._symbol),
              this._updateLastHandler,
            ),
            this._realtimeProvider.onStatusChanged.unsubscribeAll(this),
            this._removePipsHelpersSpawns())
        }
        _updateActualTradingSymbol() {
          var e
          ;(this._actualTradingSymbol = null),
            null === (e = this._actualTradingSymbolSubscription) ||
              void 0 === e ||
              e.unsubscribe()
          const t = this._mainSeries.symbolInfo()
          null !== t
            ? (this._actualTradingSymbolSubscription =
                this._makeActualTradingSymbolObservable(t.pro_name).subscribe(
                  ({ symbol: e }) => {
                    e !== this._actualTradingSymbol &&
                      ((this._actualTradingSymbol = e),
                      this.start(this._symbol))
                  },
                ))
            : this.start(this._symbol)
        }
        _stop() {
          var e
          P.logNormal(`Stop symbol ${this._symbol}`),
            this._unsubscribe(),
            null === (e = this._actualTradingSymbolSubscription) ||
              void 0 === e ||
              e.unsubscribe(),
            (this._symbolData = null),
            (this._last = null),
            (this._currencies = {}),
            (this._symbol = null),
            (this._isStarted = !1)
        }
        async _updateSymbolData() {
          var e
          if (!this._isValidSymbol())
            return void P.logNormal(
              `Can't update symbol data because symbol '${this._symbol}' not valid (isActualSymbol ${this.isActualSymbol()})`,
            )
          const t = (0, o.ensureNotNull)(this._symbol),
            [i, r, s] = await Promise.all([
              this._realtimeProvider.quantityFormatter(t),
              this._realtimeProvider.formatter(t),
              this._realtimeProvider.symbolInfo(t),
            ])
          ;(this._symbolData = {
            quantityFormatter: i,
            priceFormatter: r,
            minTick: s.minTick,
            pipSize: s.pipSize,
            variableMinTickData: s.variableMinTick
              ? (0, f.makeVariableMinTickData)(s.minTick, s.variableMinTick)
              : void 0,
            lotSize: s.lotSize,
            priceMagnifier:
              null !== (e = s.priceMagnifier) && void 0 !== e ? e : 1,
          }),
            P.logNormal(
              `[Symbol_${this._symbol}] Update symbol data values: minTick ${this._symbolData.minTick}, pipSize ${this._symbolData.pipSize}, pipValue: ${JSON.stringify(this.pipValue())}, pipValueType ${this._pipValueType}`,
            ),
            this._onUpdate.fire()
        }
        _updateLast(e, t) {
          var i, r, s, o, a, n
          ;((null === (i = this._last) || void 0 === i ? void 0 : i.ask) !==
            t.ask ||
            (null === (r = this._last) || void 0 === r ? void 0 : r.bid) !==
              t.bid ||
            (null === (s = this._last) || void 0 === s ? void 0 : s.trade) !==
              t.trade) &&
            this._isValidSymbol() &&
            ((this._last = {
              trade: null !== (o = t.trade) && void 0 !== o ? o : Number.NaN,
              ask: null !== (a = t.ask) && void 0 !== a ? a : Number.NaN,
              bid: null !== (n = t.bid) && void 0 !== n ? n : Number.NaN,
            }),
            this._onUpdate.fire())
        }
        _updateCurrencies() {
          this._updateCurrency(1), this._updateCurrency(0)
        }
        async _updateCurrency(e) {
          void 0 === this._currencies[e] &&
            this._isValidSymbol() &&
            ((this._currencies[e] = ''),
            (this._currencies[e] = await this._currencyGetters[e](
              (0, o.ensureNotNull)(this._symbol),
            )),
            this._onUpdate.fire())
        }
        async _updateSpecificTradingOptions() {
          var e
          null === this._specificTradingOptions &&
            this._isValidSymbol() &&
            ((this._specificTradingOptions = {}),
            (this._specificTradingOptions =
              null !==
                (e = await this._symbolSpecificTradingOptionsGetter(
                  (0, o.ensureNotNull)(this._symbol),
                )) && void 0 !== e
                ? e
                : null),
            this._onUpdate.fire())
        }
        _createPipsHelpersSpawns() {
          if (!this._isValidSymbol()) return
          const e = null === this._pipValuesSpawn
          if (e) {
            const e = (0, o.ensureNotNull)(
              this._realtimeProvider.activeBroker(),
            )
            ;(this._pipValuesSpawn = ((e, t, i, r) => {
              const s = (e) => ({ sellPipValue: e, buyPipValue: e }),
                o = new b.WatchedValue(s(1))
              let a = !1
              ;(async () => {
                if (!a) {
                  const i = await t(e)
                  o.setValue(s(i.pipValue))
                }
              })()
              const n = (e, t) => {
                ;(a = !0), o.setValue(t)
              }
              return i(e, n), o.readonly().spawn(() => r(e, n))
            })(
              (0, o.ensureNotNull)(this._symbol),
              this._realtimeProvider.symbolInfo.bind(this._realtimeProvider),
              e.subscribePipValue.bind(e),
              e.unsubscribePipValue.bind(e),
            )),
              this._pipValuesSpawn.subscribe((e) => {
                P.logNormal(
                  `[Symbol_${this._symbol}] Update pipValues ${JSON.stringify(this.pipValue())}`,
                ),
                  this._onUpdate.fire()
              })
          }
          const t = void 0 === this._pipValueTypeSubscription
          t &&
            (this._pipValueTypeSubscription = this._pipValueType$.subscribe(
              (e) => this._updatePipValueType(e),
            )),
            (e || t) && this._onUpdate.fire()
        }
        _removePipsHelpersSpawns() {
          var e, t
          null === (e = this._pipValuesSpawn) || void 0 === e || e.destroy(),
            (this._pipValuesSpawn = null),
            null === (t = this._pipValueTypeSubscription) ||
              void 0 === t ||
              t.unsubscribe(),
            (this._pipValueTypeSubscription = void 0)
        }
        _updatePipValueType(e) {
          ;(this._pipValueType = e),
            P.logNormal(
              `[Symbol_${this._symbol}] Update pipValueType ${this._pipValueType}`,
            ),
            this._onUpdate.fire()
        }
        _isValidSymbol() {
          return Boolean(this._symbol && this.isActualSymbol())
        }
      }
      const O = () => {},
        C = () => {}
      function I(e, t, i, r, s) {
        const a = ((e) => {
            const t = e.properties().childs().tradingProperties.childs(),
              i = (0, d.combineProperty)(
                (e, t) => t,
                (0, d.createPrimitivePropertyFromGetterAndSubscription)(
                  e.isInReplay.bind(e),
                  e.onInReplayStateChanged(),
                ).ownership(),
                t.showOrders.weakReference(),
              ),
              r = (0, d.combineProperty)(
                (e, t) => t,
                (0, d.createPrimitivePropertyFromGetterAndSubscription)(
                  e.isInReplay.bind(e),
                  e.onInReplayStateChanged(),
                ).ownership(),
                t.showPositions.weakReference(),
              )
            return {
              lineProperties: {
                width: t.lineWidth,
                style: t.lineStyle,
                extend: t.extendLeft,
              },
              horizontalAlignment: t.horizontalAlignment,
              showOrders: i,
              showPositions: r,
              showReverse: t.showReverse,
              positionPL: t.positionPL.childs(),
              bracketsPL: t.bracketsPL.childs(),
            }
          })(t),
          n = ((e, t) => (
            e.has(t) || e.set(t, new v()), (0, o.ensureDefined)(e.get(t))
          ))(r, t),
          {
            realtimeProvider: l,
            qtySuggester: c,
            pipValueType$: h,
            positionSupportBracketsGetter: u,
            positionSupportReverseGetter: p,
            positionCurrencyGetter: _,
            orderCurrencyGetter: m,
            symbolSpecificTradingOptionsGetter: f,
            makeActualTradingSymbolObservable: g,
          } = i,
          S = new T(t.mainSeries(), l, h, g, {
            positionSupportReverseGetter: p,
            positionSupportBracketsGetter: u,
            positionCurrencyGetter: _,
            orderCurrencyGetter: m,
            symbolSpecificTradingOptionsGetter: f,
          }),
          k =
            void 0 !== window.widgetbar
              ? window.widgetbar.visible()
              : new b.WatchedValue(!1)
        return s(
          a,
          () => e.activeChartWidget.value().exitTrackingMode(),
          n,
          S,
          c,
          (0, y.combine)((e) => !e, k.weakReference()).ownership(),
        )
      }
      var D = i(637401),
        w = i(764533),
        G = i(86441)
      const B = document.createElement('div')
      async function R(e, t, r, s, o, a, n) {
        const [d, l] = await Promise.all([
          Promise.all([
            i.e(580),
            i.e(8194),
            i.e(7845),
            i.e(4474),
            i.e(17),
            i.e(7125),
            i.e(3809),
          ]).then(i.bind(i, 713191)),
          r(),
        ])
        if (null === l) return void d.render(!1, B)
        const c = {
          ...l,
          withInput: !0,
          valueGetter: s,
          position: (e) => new G.Point(t.x - e.contentWidth, t.y),
          targetEl: null,
          onClickOutside: (e) => {
            if (e) {
              const t = e.target.getBoundingClientRect() || { left: 0, top: 0 }
              a(new G.Point(e.clientX - t.left, e.clientY - t.top))
            }
          },
          onClose: () => {},
          onKeyboardClose: () => {
            n()
          },
          onValueChange: o,
        }
        e ? d.render(!0, B, c) : d.render(!1, B)
      }
      var M = i(281969),
        N = i(206318),
        V = i(566884),
        A = i(11933),
        L = i(829244),
        x = i(74516),
        W = i(113211)
      class E extends M.TradedGroupBase {
        constructor(e, t, i, r, s, o, a, n, d, l, c, h, p, _) {
          super(e, t, i, r, s, n, d, l, c),
            (this._supportedOrderTypes = []),
            (this._dataUpdated = new k.Delegate()),
            (this._confirmWidget = null),
            (this._confirmWidgetShown = !1),
            (this.onQtyModify = async (e) => {
              const t = this.mainItem().data()
              t.qty = e
              const i = this._makePreOrderData(t)
              this._callbacks.trackEvent(
                'Chart Place Order',
                'Change quantity',
              ),
                await this._modifyPlaceOrder(i),
                this.redraw()
            }),
            (this._modifyPlaceOrder = n.modifyOrder),
            (this._cancelPlaceOrder = n.cancelOrder),
            (this._sendOrder = n.sendOrder),
            (this._openOrderTicket = n.openOrderTicket),
            (this._supportedOrderTypes = h),
            this._setData(this._rawDataSpawn.value(), !1),
            this._rawDataSpawn.subscribe(() => this._dataUpdated.fire()),
            (this._isActiveSource = p),
            this._isActiveSource.subscribe(() =>
              this._updateConfirmButtonDisplay(),
            ),
            (this._isConfirmButtonOnDomWidgetWV = _),
            this._isConfirmButtonOnDomWidgetWV.subscribe(
              () => this._updateConfirmButtonDisplay(),
              { callWithLast: !0 },
            ),
            (this._disabled = (0, y.combine)(
              (e) => e === u.PlaceOrEditContextStatus.Loading,
              a.ownership(),
            )),
            this._disabled.subscribe(() => this.redraw()),
            (this._errors = (0, y.combine)((e) => e, o.ownership())),
            this._errors.subscribe(() => this.redraw())
        }
        destroy() {
          this._hideConfirmWidgetIfNeeded(),
            this._isActiveSource.release(),
            this._isConfirmButtonOnDomWidgetWV.release(),
            this._disabled.destroy(),
            this._errors.destroy(),
            super.destroy()
        }
        isPlaced() {
          return !1
        }
        disabled() {
          return this._disabled.value()
        }
        hasError() {
          return Object.keys(this._errors.value()).length > 0
        }
        isConfirmButtonOnDomWidget() {
          return this._isConfirmButtonOnDomWidgetWV.value()
        }
        mainItem() {
          return this.items().main
        }
        items(e = !1, t) {
          return super.items(e, t)
        }
        async setMainOrderType(e) {
          const t = this.mainItem().data()
          t.type = e
          const i = this._makePreOrderData(t),
            r = (0, D.orderTypeToText)({
              orderType: e,
              uppercase: !1,
              shorten: !1,
            })
          this._callbacks.trackEvent(
            'Chart Place Order',
            'Change order type',
            r,
          ),
            await this._modifyPlaceOrder(i),
            this.redraw()
        }
        onClose(e) {
          const {
            origin: t = 'Chart Place Order',
            event: i = 'Cancel order',
            label: r = '',
          } = e
          this._callbacks.trackEvent(t, i, r), this._cancelPlaceOrder()
        }
        onModify(e) {
          const {
            origin: t = 'Chart Place Order',
            event: i = 'Modify order',
            label: r = '',
          } = e
          this._callbacks.trackEvent(t, i, r), this._onOpenOrderTicket()
        }
        onMove(e, t) {
          super.onMove(e, t, !0), this.modifyAllItems(e)
        }
        async onFinishMove(e, t) {
          this.setIsBlocked(!1)
          const {
            origin: i = 'Chart Place Order',
            event: r = 'Move Order',
            label: s = '',
          } = t
          return (
            (t = (0, A.mergeGaParams)(
              { origin: i, event: r, label: s },
              { label: this._hadBeenModifiedAllItems ? 'group' : 'single' },
            )),
            await this.modifyAllItems(e, t),
            this.items(!0).forEach((e) => {
              e.setInEdit(!1)
            }),
            (this._hadBeenModifiedAllItems = !1),
            this.syncData(),
            this.redraw(),
            !0
          )
        }
        async onFinishMoveProjectionBracket(e, t) {
          return this.onFinishMove(e, t)
        }
        async onConfirm(e, t) {
          return !this.disabled() && !this.hasError() && this._sendOrder()
        }
        async modifyAllItems(e, t) {
          if (void 0 !== t) {
            const {
              origin: e = 'Chart Place Order',
              event: i = 'Modify order',
              label: r = '',
            } = t
            this._callbacks.trackEvent(e, i, r)
          }
          const i = this._makePreOrderData(this.mainItem().data())
          return await this._modifyPlaceOrder(i), !0
        }
        isActiveSource() {
          return this._isActiveSource.value()
        }
        _createMainItem(e) {
          const t = (0, o.ensureDefined)(e.main)
          if ('PreOrder' !== t.dataType)
            throw new Error(
              `Unexpected data type for main item, it should be pre-order, not ${t.dataType}`,
            )
          const i = (0, V.createItem)(
            V.TradedGroupItemType.PreOrder,
            t,
            this,
            this._model,
            {
              itemExternalServices: {
                symbolDataProvider: this._symbolDataProvider,
                qtySuggester: this._qtySuggester,
                tradedGroupRenderersController:
                  this._tradedGroupRenderersController,
              },
              visibilityGetters: {
                order: this._orderVisibilityGetter.bind(this),
                position: this._positionVisibilityGetter.bind(this),
              },
              sourceCallbacks: this._callbacks,
              menuCallbacks: {
                onToggleTypeMenuHandler: this._getToggleOrderTypeMenuHandler(),
                closeDropdownMenuHandler: w.closeDropdownMenu,
              },
              qtyModifyCallbacks: {
                onToggleQtyCalcHandler: R,
                onQtyApplyHandler: (e) => this.onQtyModify(e),
                qtyInfoGetter: () => this._symbolDataProvider.qtyInfo(),
              },
            },
          )
          return i.setSupportOrderType(this._supportedOrderTypes), i
        }
        _updateMainItem(e) {
          const t = this.items().main
          if (!(0, L.isPreOrderItemRawData)(e) || !(0, N.isPreOrderItem)(t))
            return
          const { dataType: i, ...r } = e
          t.setData(r)
        }
        _createStopLimitItem(e, t) {
          let i
          const r = (0, o.ensureDefined)(e.main)
          if ('PreOrder' !== r.dataType)
            throw new Error(
              `Unexpected data type for main item, it should be pre-order, not ${r.dataType}`,
            )
          if (4 === t.type()) {
            const e = this._dataForStopLimitOrder(r)
            i = (0, V.createItem)(
              V.TradedGroupItemType.LimitPartStopLimitOrder,
              e,
              this,
              this._model,
              {
                itemExternalServices: {
                  symbolDataProvider: this._symbolDataProvider,
                  qtySuggester: this._qtySuggester,
                  tradedGroupRenderersController:
                    this._tradedGroupRenderersController,
                },
                visibilityGetters: {
                  order: this._orderVisibilityGetter.bind(this),
                  position: this._positionVisibilityGetter.bind(this),
                },
                sourceCallbacks: this._callbacks,
                qtyModifyCallbacks: {
                  onToggleQtyCalcHandler: R,
                  onQtyApplyHandler: (e) => this.onQtyModify(e),
                  qtyInfoGetter: () => this._symbolDataProvider.qtyInfo(),
                },
              },
            )
          }
          return i
        }
        _dataForStopLimitOrder(e) {
          const { seenPrice: t, ...i } = (0, s.default)(e)
          return {
            ...i,
            id: 'projectionStopPartStopLimit',
            dataType: 'Order',
            status: 6,
            considerFilledQty: !1,
            price: (0, o.ensureDefined)(e.limitPrice),
            callbacks: { modifyOrder: () => this._onOpenOrderTicket() },
          }
        }
        _convertStopLimitOrderToMainItem(e, t) {
          const i = this.items().main
          if (
            void 0 === i ||
            !(0, L.isOrderLikeItem)(i) ||
            void 0 === e ||
            (0, L.isPositionItemRawData)(e)
          )
            return
          const r = this._calculateSeenPrice(e),
            o = this._getCurrentQuotes()
          i.setData({
            ...(0, s.default)(t.data()),
            seenPrice: r,
            currentQuotes: o,
            type: e.type,
            price: i.price(),
          })
        }
        _processedBracketData(e) {
          return (
            (e.callbacks.cancelOrder = async (e) => {
              const t = this.items().brackets,
                i = t.findIndex((t) => t.data().id === e)
              return (
                -1 !== i && t.splice(i, 1), await this.modifyAllItems(e), !0
              )
            }),
            (e.callbacks.modifyOrder = () => this._onOpenOrderTicket()),
            e
          )
        }
        _createBracketItem(e) {
          return (0, V.createItem)(
            V.TradedGroupItemType.Order,
            this._processedBracketData(e),
            this,
            this._model,
            {
              itemExternalServices: {
                symbolDataProvider: this._symbolDataProvider,
                qtySuggester: this._qtySuggester,
                tradedGroupRenderersController:
                  this._tradedGroupRenderersController,
              },
              visibilityGetters: {
                order: this._orderVisibilityGetter.bind(this),
                position: this._positionVisibilityGetter.bind(this),
              },
              sourceCallbacks: this._callbacks,
              gaOrigin: 'Chart Place Order',
            },
          )
        }
        async _onOpenOrderTicket() {
          const e = this._makePreOrderData(this.mainItem().data())
          return this._openOrderTicket(e), !0
        }
        async _updateConfirmButtonDisplay() {
          const e = this._isActiveSource.value(),
            t = this.isConfirmButtonOnDomWidget()
          if (e && t && !this._confirmWidgetShown) {
            this._confirmWidgetShown = !0
            const { ConfirmWidgetRenderer: e } = await Promise.all([
              i.e(3321),
              i.e(3989),
            ]).then(i.bind(i, 722131))
            if (this._confirmWidgetShown && !this._isDestroyed) {
              const t = (0, o.ensureDefined)(this.baseItem()),
                i = (0, d.createWVFromGetterAndSubscription)(
                  () => t.confirmText(!1),
                  this._dataUpdated,
                ),
                r = (0, d.createWVFromGetterAndSubscription)(
                  () => t.data().side,
                  this._dataUpdated,
                ),
                s = (0, y.combine)(
                  () => this.hasError(),
                  this._errors.weakReference(),
                )
              this._confirmWidget = new e(
                i.ownership(),
                r.ownership(),
                this._disabled.spawnOwnership(),
                s.ownership(),
                () => this.onConfirm(this.mainItem().id(), {}),
              )
            }
          } else (e && t) || this._hideConfirmWidgetIfNeeded()
          this.redraw()
        }
        _hideConfirmWidgetIfNeeded() {
          var e
          null === (e = this._confirmWidget) || void 0 === e || e.destroy(),
            (this._confirmWidget = null),
            (this._confirmWidgetShown = !1)
        }
        _makePreOrderData(e) {
          var t, i, r, s, a, n, d, l, c, h
          const u = this._calculateSeenPrice(e),
            p = this._getCurrentQuotes(),
            { symbol: _, type: m, side: y, qty: b, isClose: v } = e,
            f = {
              symbol: _,
              type: m,
              side: y,
              qty: b,
              isClose: v,
              seenPrice: u,
              currentQuotes: p,
            },
            g = (0, o.ensureNotNull)(e.price)
          switch (e.type) {
            case 4:
              f.stopPrice = null != g ? g : void 0
              const e = this._symbolDataProvider.getMinTick(g),
                r = 1 === f.side ? 1 : -1
              f.limitPrice =
                null !==
                  (i =
                    null === (t = this.items().stopLimit) || void 0 === t
                      ? void 0
                      : t.price()) && void 0 !== i
                  ? i
                  : g + r * e
              break
            case 1:
              f.limitPrice = null != g ? g : void 0
              break
            case 3:
              f.stopPrice = null != g ? g : void 0
          }
          const {
              takeProfit: S,
              stopLoss: k,
              trailingStop: P,
            } = (0, x.bracketsByType)(this.items().projectionBrackets),
            {
              takeProfit: T,
              stopLoss: O,
              trailingStop: C,
            } = (0, x.bracketsByType)(this.items().brackets)
          ;(f.takeProfit =
            null !==
              (s =
                null !== (r = null == T ? void 0 : T.price()) && void 0 !== r
                  ? r
                  : null == S
                    ? void 0
                    : S.price()) && void 0 !== s
              ? s
              : void 0),
            (f.stopLoss =
              null !==
                (n =
                  null !== (a = null == O ? void 0 : O.price()) && void 0 !== a
                    ? a
                    : null == k
                      ? void 0
                      : k.price()) && void 0 !== n
                ? n
                : void 0)
          const I = C || P,
            D =
              null !== (d = null == I ? void 0 : I.price()) && void 0 !== d
                ? d
                : void 0
          if (void 0 !== I && void 0 !== D) {
            const e = (0, o.ensureNotNull)(this._symbolDataProvider.lastData()),
              t =
                null !== (l = null == e ? void 0 : e.bid) && void 0 !== l
                  ? l
                  : void 0,
              i =
                null !== (c = null == e ? void 0 : e.ask) && void 0 !== c
                  ? c
                  : void 0,
              { pipSize: r } =
                null !== (h = this._symbolDataProvider.symbolData()) &&
                void 0 !== h
                  ? h
                  : {}
            if (void 0 !== t && void 0 !== i && void 0 !== r) {
              const e = I.data(),
                s = 1 === e.side ? t : i
              ;(f.trailingStopPips = (0, W.calcPipsByPrice)(D, s, e.side, r)),
                (f.trailingStopPrice = D)
            }
          }
          return f
        }
        _calculateSeenPrice(e) {
          var t
          const i = (0, o.ensureNotNull)(this._symbolDataProvider.lastData())
          return null !==
            (t =
              1 === e.side
                ? null == i
                  ? void 0
                  : i.ask
                : null == i
                  ? void 0
                  : i.bid) && void 0 !== t
            ? t
            : 0
        }
        _getCurrentQuotes() {
          const { ask: e, bid: t } = (0, o.ensureNotNull)(
            this._symbolDataProvider.lastData(),
          )
          return { ask: e, bid: t }
        }
        _getToggleOrderTypeMenuHandler() {
          return (e, t, i, r, s) => {
            var o
            const a = this.mainItem()
            if (a.canSwitchType()) {
              this._callbacks.trackEvent(
                'Chart Place Order',
                'Order type menu opening',
                null !== (o = i.label) && void 0 !== o ? o : '',
              )
              const n = a
                  .orderTypesItems()
                  .map(({ type: e, typeText: t }) => ({ title: t, value: e })),
                d = this._model.timeScale(),
                l = [
                  d.onScroll(),
                  d.barSpacingChanged(),
                  this._model.mainSeries().onSymbolIntervalChanged(),
                ]
              ;(0, w.updateDropdownMenu)(
                e,
                t,
                n,
                a.data().type,
                'Order type',
                l,
                (e) => this.setMainOrderType(e),
                r,
                s,
              )
            }
          }
        }
      }
      const F = [1, 3, 4]
      class $ extends M.TradedGroupBase {
        constructor(e, t, i, r, s, o, a, n, d) {
          super(e, t, i, r, s, o, a, n, d),
            (this._resetProjBracketsTimeout = null),
            this._setData(this._rawDataSpawn.value(), !1),
            this._callbacks.onDataUpdateRejected.subscribe(
              this,
              this._resetProjBracketsHandler,
            )
        }
        destroy() {
          this._clearResetProjBracketsTimeout(),
            this._callbacks.onDataUpdateRejected.unsubscribeAll(this),
            super.destroy()
        }
        isPlaced() {
          return !0
        }
        async onConfirm(e, t) {
          return !0
        }
        isActiveSource() {
          return !1
        }
        items(e = !1, t) {
          return super.items(e, t)
        }
        mainItem() {
          return this.items().main
        }
        async onFinishMove(e, t) {
          if (this._hadBeenModifiedAllItems) return this.modifyAllItems(e, t)
          this.setIsBlocked(!0)
          const i = this.findItem(e)
          ;(0, o.assert)(
            (0, L.isOrderLikeItem)(i),
            'This item does not support move',
          ),
            (t = (0, A.mergeGaParams)(t, {
              event: 'Move Order',
              label: 'single',
            }))
          const r = await i.onFinishMove(t)
          return (
            !this._isDestroyed &&
            (this.setIsBlocked(!1),
            this.syncData(),
            this.redraw(),
            this.allItemsSupportMove(this.items(!0)) &&
              this._callbacks.showChartHint(),
            r)
          )
        }
        cancelMove() {
          for (const e of this.items(!0))
            (0, L.isOrderLikeItem)(e) && e.setInEdit(!1)
          return (
            this._resetProjBracketsHandler(), this.syncData(), this.redraw(), !0
          )
        }
        async onFinishMoveProjectionBracket(e, t) {
          return this.modifyAllItems(e, t)
        }
        async modifyAllItems(e, t) {
          var i, r, s, a, n, d, l, c
          this.setIsBlocked(!0)
          const {
              takeProfit: u,
              stopLoss: p,
              trailingStop: _,
            } = (0, x.bracketsByType)(this.items().projectionBrackets),
            {
              takeProfit: m,
              stopLoss: y,
              trailingStop: b,
            } = (0, x.bracketsByType)(this.items().brackets),
            v = {
              limitPrice:
                null !==
                  (r =
                    null === (i = this.items().stopLimit) || void 0 === i
                      ? void 0
                      : i.price()) && void 0 !== r
                  ? r
                  : void 0,
              takeProfit:
                null !==
                  (a =
                    null !== (s = null == m ? void 0 : m.price()) &&
                    void 0 !== s
                      ? s
                      : null == u
                        ? void 0
                        : u.price()) && void 0 !== a
                  ? a
                  : void 0,
              stopLoss:
                null !==
                  (d =
                    null !== (n = null == y ? void 0 : y.price()) &&
                    void 0 !== n
                      ? n
                      : null == p
                        ? void 0
                        : p.price()) && void 0 !== d
                  ? d
                  : void 0,
              trailingStop:
                null !==
                  (c =
                    null !== (l = null == b ? void 0 : b.price()) &&
                    void 0 !== l
                      ? l
                      : null == _
                        ? void 0
                        : _.price()) && void 0 !== c
                  ? c
                  : void 0,
            },
            f = (0, o.ensureDefined)(this.items().main),
            g = this.findItem(e)
          ;(0, o.assert)(
            (0, L.isOrderLikeItem)(g),
            'This item does not support move',
          )
          const S = this._hadBeenModifiedAllItems
              ? 'Move Order'
              : 'Add bracket from button',
            k = ((e, t, i) =>
              (0, L.isPositionLikeItem)(i) || 'Move Order' === e
                ? 'group'
                : (0, N.isPositionItem)(t) && t.supportOnlyPairBrackets()
                  ? 'both bracket'
                  : i.bracketType() === h.BracketType.TakeProfit
                    ? 'take profit'
                    : i.bracketType() === h.BracketType.TrailingStop
                      ? 'trailing stop'
                      : 'stop loss')(S, f, g)
          t = (0, A.mergeGaParams)(t, { event: S, label: k })
          const P = this._ticketFocus(g)
          let T = !1
          return (
            (0, L.isPositionLikeItem)(f)
              ? (T = await f.onModifyWithBracket(t, v, !1, P))
              : ((T = await f.onFinishMove(t, v, !1, P)),
                this.items(!0).forEach((e) => {
                  e.setInEdit(!1)
                })),
            !this._isDestroyed &&
              (T
                ? this._resetProjectionBracketByTimeout()
                : (null == _ || _.setPrice(null),
                  null == u || u.setPrice(null),
                  null == p || p.setPrice(null)),
              this.setIsBlocked(!1),
              this.syncData(),
              this.redraw(),
              (this._hadBeenModifiedAllItems = !1),
              T)
          )
        }
        _createMainItem(e) {
          const t = e.main
          let i
          return (
            void 0 !== t &&
              ((0, L.isOrderItemRawData)(t)
                ? (i = (0, V.createItem)(
                    V.TradedGroupItemType.Order,
                    t,
                    this,
                    this._model,
                    {
                      itemExternalServices: {
                        symbolDataProvider: this._symbolDataProvider,
                        qtySuggester: this._qtySuggester,
                        tradedGroupRenderersController:
                          this._tradedGroupRenderersController,
                      },
                      visibilityGetters: {
                        order: this._orderVisibilityGetter.bind(this),
                        position: this._positionVisibilityGetter.bind(this),
                      },
                      sourceCallbacks: this._callbacks,
                    },
                  ))
                : (0, L.isPositionItemRawData)(t) &&
                  (i = (0, V.createItem)(
                    V.TradedGroupItemType.Position,
                    t,
                    this,
                    this._model,
                    {
                      itemExternalServices: {
                        symbolDataProvider: this._symbolDataProvider,
                        qtySuggester: this._qtySuggester,
                        tradedGroupRenderersController:
                          this._tradedGroupRenderersController,
                      },
                      visibilityGetters: {
                        order: this._orderVisibilityGetter.bind(this),
                        position: this._positionVisibilityGetter.bind(this),
                      },
                      sourceCallbacks: this._callbacks,
                    },
                  ))),
            i
          )
        }
        _updateMainItem(e) {
          const t = this.items().main
          if (void 0 !== t && void 0 !== e)
            if ((0, N.isPositionItem)(t) && (0, L.isPositionItemRawData)(e)) {
              const { dataType: i, ...r } = e
              t.setData(r)
            } else {
              if (!(0, L.isOrderLikeItem)(t) || !(0, L.isOrderItemRawData)(e))
                throw new Error(
                  `Main item and main data are incompatible, main item type ${typeof t}, main data type ${e.dataType}`,
                )
              {
                const { dataType: i, ...r } = e
                t.setData(r)
              }
            }
        }
        _dataForStopLimitOrder(e) {
          return (
            (0, o.assert)(
              !(0, L.isPositionItemRawData)(e) && void 0 !== e.limitPrice,
            ),
            { ...(0, s.default)(e), price: e.limitPrice, considerFilledQty: !1 }
          )
        }
        _convertStopLimitOrderToMainItem(e, t) {
          const i = this.items().main
          if (
            void 0 === i ||
            !(0, L.isOrderLikeItem)(i) ||
            void 0 === e ||
            (0, L.isPositionItemRawData)(e)
          )
            return
          const r = {
            ...(0, s.default)(t.data()),
            type: e.type,
            price: i.price(),
            callbacks: e.callbacks,
          }
          i.setData(r)
        }
        _createBracketItem(e) {
          return (0, V.createItem)(
            V.TradedGroupItemType.Order,
            this._processedBracketData(e),
            this,
            this._model,
            {
              itemExternalServices: {
                symbolDataProvider: this._symbolDataProvider,
                qtySuggester: this._qtySuggester,
                tradedGroupRenderersController:
                  this._tradedGroupRenderersController,
              },
              visibilityGetters: {
                order: this._orderVisibilityGetter.bind(this),
                position: this._positionVisibilityGetter.bind(this),
              },
              sourceCallbacks: this._callbacks,
              gaOrigin: 'Chart Order',
            },
          )
        }
        _resetProjectionBracketByTimeout() {
          this._clearResetProjBracketsTimeout(),
            (this._resetProjBracketsTimeout = setTimeout(
              () => this._resetProjBracketsHandler(),
              2e4,
            ))
        }
        _ticketFocus(e) {
          if (!(0, L.isPositionLikeItem)(e)) {
            if (null !== e.bracketType())
              return e.bracketType() === h.BracketType.TakeProfit ? 3 : 4
            switch (e.type()) {
              case 4:
                return (0, N.isLimitPartStopLimitOrderItem)(e) ? 1 : 2
              case 1:
                return 1
              case 3:
                return 2
            }
          }
          return 5
        }
        _clearResetProjBracketsTimeout() {
          null !== this._resetProjBracketsTimeout &&
            (clearTimeout(this._resetProjBracketsTimeout),
            (this._resetProjBracketsTimeout = null))
        }
        _resetProjBracketsHandler() {
          this._clearResetProjBracketsTimeout()
          const {
            takeProfit: e,
            stopLoss: t,
            trailingStop: i,
          } = (0, x.bracketsByType)(this.items().projectionBrackets)
          null == e || e.setPrice(null),
            null == t || t.setPrice(null),
            null == i || i.setPrice(null),
            this.redraw()
        }
      }
      var U = i(397728)
      const j = (0, l.getLogger)('Trading.Source.Manager')
      function q(e) {
        let t = '',
          i = '',
          r = ''
        return (
          e.main &&
            ('Position' === e.main.dataType
              ? ((t = 'Position'),
                (i = JSON.stringify((0, _.cropPositionData)(e.main))))
              : 'Order' === e.main.dataType
                ? ((t = 'Order'),
                  (i = JSON.stringify((0, p.cropOrderData)(e.main))))
                : ((t = 'PreOrder'), (i = JSON.stringify(e.main)))),
          e.brackets.forEach((e, t) => {
            const i = (0, x.getBracketType)(e),
              s = null !== i ? h.BracketType[i] : ''
            r =
              0 === t
                ? `\nbracketData: ${s} - ${JSON.stringify((0, p.cropOrderData)(e))}`
                : `${r};\n ${s} - ${JSON.stringify((0, p.cropOrderData)(e))}`
          }),
          `mainType: ${t};\nmainData: ${i};${r}`
        )
      }
      const H = 'preOrder'
      function z(e) {
        return 2 !== (null == e ? void 0 : e.data().type)
      }
      window.createPlaceContext = (e, t) =>
        (0, o.ensureNotNull)(e.activeBroker()).createPlaceOrderContext(
          t,
          'test',
        )
      class Q {
        constructor(e, t, i, r) {
          ;(this._tradedGroupData = new Map()),
            (this._tradedGroupPlaceData = null),
            (this._tradedGroupPlaceStatus = null),
            (this._ordersData = new Map()),
            (this._positionsData = new Map()),
            (this._positionsRealToParentIds = new Map()),
            (this._tradedGroupRenderersControllerMap = new WeakMap()),
            (this._ordersService = e),
            (this._positionsService = t),
            (this._chartWidgetCollection = i),
            (this._realtimeProvider = r.realtimeProvider),
            (this._qtySuggester = r.qtySuggester),
            (this._brokerCommandsUIGetter = r.brokerCommandsUI),
            (this._trackEvent = r.trackEvent),
            (this._showTradedGroup = r.showTradedSources),
            (this._pipValueType$ = r.pipValueType$),
            (this._makeActualTradingSymbolObservable =
              r.makeActualSymbolObservable),
            (this._symbolSpecificTradingOptionsGetter =
              r.getSymbolSpecificTradingOptions),
            (this._tradedContextLinking = r.activeTradedLinking),
            this._tradedContextLinking
              .onContextChanged()
              .subscribe(this, this._updateTradedGroupFromLinking),
            this._addOrderItems(this._ordersService.activeOrders()),
            this._ordersService
              .activeOrdersUpdated()
              .subscribe(this, (e) => this._addOrderItems([e])),
            this._ordersService
              .activeOrdersRemoved()
              .subscribe(this, (e) => this._removeTradedGroupItems(e)),
            this._addPositionItems(
              this._positionsService
                .positions()
                .map((e) => ({ data: e, type: _.PositionsUpdateType.Full })),
            ),
            this._positionsService
              .positionUpdate()
              .subscribe(this, (e) => this._addPositionItems([e])),
            this._positionsService
              .positionsRemoved()
              .subscribe(this, (e) => this._removeTradedGroupItems(e))
        }
        destroy() {
          this._tradedContextLinking.onContextChanged().unsubscribeAll(this),
            this._ordersService.activeOrdersUpdated().unsubscribeAll(this),
            this._ordersService.activeOrdersRemoved().unsubscribeAll(this),
            this._ordersData.clear(),
            this._positionsService.positionUpdate().unsubscribeAll(this),
            this._positionsService.positionsRemoved().unsubscribeAll(this),
            this._positionsData.clear(),
            this._tradedGroupData.clear()
        }
        _getBrackets(e) {
          const t = []
          if (!this._ordersData.has(e)) {
            const t = this._positionsRealToParentIds.get(e)
            void 0 !== t && (e = t)
          }
          return (
            this._ordersData.forEach((i) => {
              i.parentId === e &&
                t.push({
                  dataType: 'Order',
                  ...(0, s.default)(i),
                  callbacks: this._createCallbacksForOrder(i),
                })
            }),
            t
          )
        }
        _updateTradedGroupFromLinking(e) {
          if ((0, u.isContextPlaceOrderContext)(e) && z(e)) {
            const u = this._createPlaceSourceData(e)
            null !== this._tradedGroupPlaceData
              ? this._tradedGroupPlaceData.setValue(u)
              : ((this._tradedGroupPlaceData = new n.WatchedObject(u)),
                (t = this._tradedGroupPlaceData),
                (i = this._createProjectionOrderErrorWV().ownership()),
                (r = this._createProjectionOrderStatusW().ownership()),
                (s = this._ordersService.orderRejected()),
                (o = this._showTradedGroup),
                (a = this._chartWidgetCollection),
                (d = {
                  realtimeProvider: this._realtimeProvider,
                  qtySuggester: this._qtySuggester,
                  pipValueType$: this._pipValueType$,
                  positionSupportReverseGetter:
                    this._positionsService.supportReverse.bind(
                      this._positionsService,
                    ),
                  positionSupportBracketsGetter:
                    this._positionsService.supportBrackets.bind(
                      this._positionsService,
                    ),
                  positionCurrencyGetter:
                    this._positionsService.getCurrency.bind(
                      this._positionsService,
                    ),
                  orderCurrencyGetter: this._ordersService.getCurrency.bind(
                    this._ordersService,
                  ),
                  symbolSpecificTradingOptionsGetter:
                    this._symbolSpecificTradingOptionsGetter,
                  makeActualTradingSymbolObservable:
                    this._makeActualTradingSymbolObservable,
                }),
                (l = this._tradedGroupRenderersControllerMap),
                (c = this._createCallbacksForPlaceOrder()),
                (h = this._trackEvent),
                a.addCustomSource(
                  'tradedPlaceOrder',
                  (e, n) =>
                    I(a, n, d, l, (l, u, p, _, m, b) => {
                      const v = ((e) => {
                          if (null === e || 1 !== e.connectionStatus())
                            return [2]
                          const t = [],
                            {
                              supportMarketOrders: i,
                              supportLimitOrders: r,
                              supportStopOrders: s,
                              supportStopLimitOrders: o,
                            } = e.metainfo().configFlags
                          return (
                            i && t.push(2),
                            r && t.push(1),
                            s && t.push(3),
                            o && t.push(4),
                            t
                          )
                        })(d.realtimeProvider.activeBroker()).filter((e) =>
                          F.includes(e),
                        ),
                        f = (0, y.combine)(
                          (e) => e.model().model() === n,
                          a.activeChartWidget.weakReference(),
                        )
                      return new E(
                        e,
                        n,
                        l,
                        o,
                        t,
                        i.ownership(),
                        r.ownership(),
                        {
                          exitTrackingMode: u,
                          onDataUpdateRejected: s,
                          trackEvent: h,
                          showChartHint: O,
                          hideChartHint: C,
                          ...c,
                        },
                        _,
                        m,
                        p,
                        v,
                        f.ownership(),
                        b.ownership(),
                      )
                    }),
                  m.CustomSourceLayer.Topmost,
                ))
          } else
            null !== this._tradedGroupPlaceData &&
              (!((e) => {
                e.removeCustomSource('tradedPlaceOrder')
              })(this._chartWidgetCollection),
              (this._tradedGroupPlaceData = null))
          var t, i, r, s, o, a, d, l, c, h
        }
        _createProjectionOrderErrorWV() {
          return (0, d.createWVFromGetterAndSubscription)(() => {
            var e, t
            return null !==
              (t =
                null === (e = this._tradedContextLinking.context()) ||
                void 0 === e
                  ? void 0
                  : e.errors()) && void 0 !== t
              ? t
              : {}
          }, this._tradedContextLinking.onContextChanged())
        }
        _createProjectionOrderStatusW() {
          return (0, d.createWVFromGetterAndSubscription)(() => {
            var e, t
            return null !==
              (t =
                null === (e = this._tradedContextLinking.context()) ||
                void 0 === e
                  ? void 0
                  : e.status()) && void 0 !== t
              ? t
              : u.PlaceOrEditContextStatus.Undefined
          }, this._tradedContextLinking.onContextChanged())
        }
        _createTradedGroupData(e) {
          let t
          const i = this._ordersData.get(e),
            r = this._positionsData.get(e)
          return (
            void 0 !== i
              ? (t = {
                  dataType: 'Order',
                  ...(0, s.default)(i),
                  callbacks: this._createCallbacksForOrder(i),
                })
              : void 0 !== r &&
                (t = {
                  dataType: 'Position',
                  ...(0, s.default)(r),
                  callbacks: this._createCallbacksForPosition(),
                }),
            { main: t, brackets: this._getBrackets(e) }
          )
        }
        _createPlaceSourceData(e) {
          const t = (0, s.default)(e.data()),
            i = (0, x.getOrderPriceByType)(t)
          ;(0, a.isNumber)(i) || j.logError('pre-order price is not defined')
          const r = {
            dataType: 'PreOrder',
            ...t,
            price: i,
            callbacks: {},
            supportModify: !0,
            supportModifyOrderPrice: !0,
            supportMove: !0,
            supportCancel: !0,
            supportTrailingStop: (0, U.checkTrailingStopAvailability)(
              this._configFlags(),
            ),
            plBasedOnLast: !0,
          }
          return {
            main: r,
            brackets: this._createBracketsFromPlaceContextData(r),
          }
        }
        _createBracketsFromPlaceContextData(e) {
          const t = []
          return (
            void 0 !== e.takeProfit &&
              t.push(
                this._createBracketDataForPlaceOrder(
                  e,
                  h.BracketType.TakeProfit,
                  e.takeProfit,
                ),
              ),
            void 0 !== e.stopLoss &&
              t.push(
                this._createBracketDataForPlaceOrder(
                  e,
                  h.BracketType.StopLoss,
                  e.stopLoss,
                ),
              ),
            void 0 !== e.trailingStopPips &&
              t.push(
                this._createBracketDataForPlaceOrder(
                  e,
                  h.BracketType.TrailingStop,
                  (0, o.ensureDefined)(e.trailingStopPrice),
                ),
              ),
            t
          )
        }
        _createBracketDataForPlaceOrder(e, t, i) {
          return {
            ...(0, x.buildProjectionBracketData)(H, t, e),
            dataType: 'Order',
            price: i,
            parentId: H,
            parentType: 1,
            callbacks: {},
            supportModify: !0,
            supportMove: !0,
            supportCancel: !0,
            plBasedOnLast: !1,
          }
        }
        _recreateTradedGroupSource(e, t = !0, i = '') {
          const r = this._createTradedGroupData(e),
            s = this._tradedGroupData.get(e)
          if (void 0 !== s)
            s.setValue(r), t && j.logNormal(`Source updated${i}: ${q(r)}`)
          else {
            const t = new n.WatchedObject(r)
            ;(o = e),
              (a = t),
              (d = this._ordersService.orderRejected()),
              (l = this._showTradedGroup),
              (c = this._chartWidgetCollection),
              (h = {
                realtimeProvider: this._realtimeProvider,
                qtySuggester: this._qtySuggester,
                pipValueType$: this._pipValueType$,
                positionSupportReverseGetter:
                  this._positionsService.supportReverse.bind(
                    this._positionsService,
                  ),
                positionSupportBracketsGetter:
                  this._positionsService.supportBrackets.bind(
                    this._positionsService,
                  ),
                positionCurrencyGetter: this._positionsService.getCurrency.bind(
                  this._positionsService,
                ),
                orderCurrencyGetter: this._ordersService.getCurrency.bind(
                  this._ordersService,
                ),
                symbolSpecificTradingOptionsGetter:
                  this._symbolSpecificTradingOptionsGetter,
                makeActualTradingSymbolObservable:
                  this._makeActualTradingSymbolObservable,
              }),
              (u = this._tradedGroupRenderersControllerMap),
              (p = this._trackEvent),
              c.addCustomSource(
                `traded${o}`,
                (e, t) =>
                  I(
                    c,
                    t,
                    h,
                    u,
                    (i, r, s, o, n) =>
                      new $(
                        e,
                        t,
                        i,
                        l,
                        a,
                        {
                          exitTrackingMode: r,
                          onDataUpdateRejected: d,
                          trackEvent: p,
                          showChartHint: O,
                          hideChartHint: C,
                        },
                        o,
                        n,
                        s,
                      ),
                  ),
                m.CustomSourceLayer.Topmost,
              ),
              this._tradedGroupData.set(e, t),
              j.logNormal(`Source created: ${q(r)}`)
          }
          var o, a, d, l, c, h, u, p
        }
        _configFlags() {
          return (0, o.ensureNotNull)(
            this._realtimeProvider.activeBroker(),
          ).metainfo().configFlags
        }
        async _findPositionRealIdByParentId(e) {
          const t = this._positionsData.get(e)
          let i
          if (void 0 !== t) i = t.id
          else if (
            ((i = await this._positionsService.realIdFromBroker(e)), null === i)
          ) {
            const t = this._currentRealPositionIdByParentId(e)
            return null !== t && this._positionsRealToParentIds.delete(t), null
          }
          return this._positionsRealToParentIds.set(i, e), i
        }
        _currentRealPositionIdByParentId(e) {
          for (const t of Array.from(this._positionsRealToParentIds.keys()))
            if (this._positionsRealToParentIds.get(t) === e) return t
          return null
        }
        async _findAndUpdateParentPosition(e, t = !1) {
          const i = this._currentRealPositionIdByParentId(e),
            r = await this._findPositionRealIdByParentId(e)
          if (
            (null !== i &&
              null === r &&
              this._tradedGroupData.has(i) &&
              (j.logNormal(
                `Position update (brackets unlink from position), id: ${e}`,
              ),
              this._recreateTradedGroupSource(i)),
            null === i && null !== r)
          ) {
            const t = this._tradedGroupData.get(e)
            void 0 !== t &&
              void 0 === t.value().main &&
              (j.logNormal(
                `Position remove (brackets link to position), id: ${e}`,
              ),
              this._removeTradedGroupEditSource(e))
          }
          ;(t && i === r) ||
            this._recreateTradedGroupSource(
              r || e,
              void 0,
              ' after parent position been found (async operation)',
            )
        }
        _addOrderItems(e) {
          for (const t of e) {
            this._removeSourceIfChangedParent(t), this._ordersData.set(t.id, t)
            const e = void 0 !== t.parentId ? t.parentId : t.id
            2 !== t.parentType && 3 !== t.parentType
              ? this._recreateTradedGroupSource(e)
              : this._findAndUpdateParentPosition(e)
          }
        }
        _addPositionItems(e) {
          for (const t of e) {
            const e = t.data,
              i = e.id
            this._positionsData.set(i, e),
              this._recreateTradedGroupSource(
                i,
                t.type === _.PositionsUpdateType.Full,
              )
            this._ordersService
              .activeOrders()
              .filter(p.isBracketOrderRawData)
              .filter((t) => 2 === t.parentType && t.symbol === e.symbol)
              .forEach((e) => {
                this._findAndUpdateParentPosition(e.parentId, !0)
              })
          }
        }
        _removeSourceIfChangedParent(e) {
          const t = this._ordersData.get(e.id)
          void 0 === t ||
            (t.parentId === e.parentId && t.parentType === e.parentType) ||
            this._removeTradedGroupItems([t.id])
        }
        _removeTradedGroupItems(e) {
          for (const t of e) {
            let e = t
            if (!this._tradedGroupData.has(t))
              for (const i of this._tradedGroupData.keys()) {
                for (const r of (0, o.ensureDefined)(
                  this._tradedGroupData.get(i),
                ).value().brackets)
                  if (r.id === t) {
                    e = i
                    break
                  }
                if (e === i) break
              }
            this._positionsData.delete(t), this._ordersData.delete(t)
            const i = this._createTradedGroupData(e)
            if (void 0 === i.main && 0 === i.brackets.length)
              this._removeTradedGroupEditSource(e)
            else {
              const t = this._tradedGroupData.get(e)
              void 0 !== t &&
                (t.setValue(i), j.logNormal(`Source updated: ${q(i)}`))
            }
          }
        }
        _removeTradedGroupEditSource(e) {
          var t, i
          this._tradedGroupData.delete(e),
            (t = this._chartWidgetCollection),
            (i = e),
            t.removeCustomSource(`traded${i}`),
            j.logNormal(`Traded-source removed, mainItemId: ${e}`)
        }
        _createCallbacksForOrder(e) {
          const t = {}
          return (
            e.supportModify && (t.modifyOrder = this._modifyOrder.bind(this)),
            e.supportMove && (t.moveOrder = this._moveOrder.bind(this)),
            e.supportCancel && (t.cancelOrder = this._cancelOrder.bind(this)),
            t
          )
        }
        _createCallbacksForPlaceOrder() {
          return {
            modifyOrder: async (e) => {
              const t = (0, s.default)(e),
                i = await (0, o.ensureNotNull)(
                  this._realtimeProvider.activeBroker(),
                ).createPlaceOrderContext(t, 'traded-source')
              return this._tradedContextLinking.setContext(i), !0
            },
            openOrderTicket: (e) => {
              var t
              null === (t = this._brokerCommandsUIGetter()) ||
                void 0 === t ||
                t.placeOrder(e, !1)
            },
            cancelOrder: () => {
              this._tradedContextLinking.clear()
            },
            sendOrder: async () => {
              const e = await (0, o.ensureNotNull)(
                this._tradedContextLinking.context(),
              ).send()
              return this._tradedContextLinking.clear(), e
            },
          }
        }
        _createCallbacksForPosition() {
          return {
            reversePosition: this._reversePosition.bind(this),
            modifyPosition: this._modifyPosition.bind(this),
            closePosition: this._closePosition.bind(this),
          }
        }
        async _processingModifyOrder(e, t, i, r) {
          let s = !1
          try {
            s = await (0, o.ensureNotNull)(
              this._brokerCommandsUIGetter(),
            ).modifyOrder(e, i, r)
          } catch (e) {
            j.logError(
              `Try to modify order with error ${(0, c.errorToString)(e)}`,
            )
          }
          return s
        }
        _modifyOrder(e, t, i, r) {
          const s = (0, o.ensureNotNull)(this._ordersService.find(e))
          return this._processingModifyOrder(t, s, r, i)
        }
        _moveOrder(e, t, i) {
          const r = (0, o.ensureNotNull)(this._ordersService.find(e))
          return this._processingModifyOrder(t, r, !0, i)
        }
        _cancelOrder(e) {
          return (0, o.ensureNotNull)(
            this._brokerCommandsUIGetter(),
          ).cancelOrder(e)
        }
        _reversePosition(e) {
          return (0, o.ensureNotNull)(
            this._brokerCommandsUIGetter(),
          ).reversePosition(e)
        }
        _modifyPosition(e, t = {}, i, r) {
          const s = (0, o.ensureNotNull)(this._brokerCommandsUIGetter())
          return this._positionsService.isDisplayModeIndividualPositions()
            ? (0, o.ensureDefined)(s.editIndividualPositionBrackets).call(
                s,
                e,
                t,
                i,
                r,
              )
            : s.editPositionBrackets(e, t, i, r)
        }
        _closePosition(e) {
          const t = (0, o.ensureNotNull)(this._brokerCommandsUIGetter())
          return this._positionsService.isDisplayModeIndividualPositions()
            ? t.closeIndividualPosition(e)
            : t.closePosition(e)
        }
      }
    },
  },
])
