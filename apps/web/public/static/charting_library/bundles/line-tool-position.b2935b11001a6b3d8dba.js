;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1314],
  {
    81776: (e, t, r) => {
      r.d(t, { LineToolTradingPriceAxisView: () => o })
      var i = r(90793)
      class o extends i.LineToolPriceAxisView {
        _formatPrice(e, t) {
          return this._source.formatter().format(e)
        }
      }
    },
    40265: (e, t, r) => {
      var i = r(36009).LineToolTrading,
        o = r(29875).LineDataSource,
        s = r(81776).LineToolTradingPriceAxisView,
        n = r(91920),
        l = r(32679).DefaultProperty
      const u = r(56570),
        a = r(44672).sourceChangeEvent
      var h = r(2718).sortSourcesPreOrdered.LineToolPosition
      function p(e) {
        return null == e ? (e = '') : (e += ''), e
      }
      class d {
        constructor(e) {
          ;(this._line = e),
            (this._data = { bodyText: 'position', quantityText: '0' }),
            (this._closeEnabled = !0),
            (this._direction = 'buy'),
            (this._profitState = 'neutral')
        }
        setDirection(e) {
          return (
            (this._direction = e),
            this._line.updateAllViewsAndRedraw(a(this._line.id())),
            this
          )
        }
        setProfitState(e) {
          return (
            (this._profitState = e),
            this._line.updateAllViewsAndRedraw(a(this._line.id())),
            this
          )
        }
        getPrice() {
          return this._line.points().length > 0
            ? this._line.points()[0].price
            : this._line._timePoint.length > 0
              ? this._line._timePoint[0].price
              : void 0
        }
        setPrice(e) {
          if (this._line.points().length > 0) {
            var t = this._line.points()[0]
            ;(t.price = e),
              this._line.setPoint(0, t),
              this._line.updateAllViewsAndRedraw(a(this._line.id()))
          }
          return (
            this._line._timePoint.length > 0 &&
              (this._line._timePoint[0].price = e),
            this
          )
        }
        getText() {
          return this._data.bodyText
        }
        setText(e) {
          return (
            (this._data.bodyText = e || ''),
            this._line.updateAllViewsAndRedraw(a(this._line.id())),
            this
          )
        }
        setTooltip(e) {
          return this._line.properties().tooltip.setValue(p(e)), this
        }
        getTooltip() {
          return this._line.properties().tooltip.value()
        }
        setProtectTooltip(e) {
          return this._line.properties().protectTooltip.setValue(p(e)), this
        }
        getProtectTooltip() {
          return this._line.properties().protectTooltip.value()
        }
        setCloseTooltip(e) {
          return this._line.properties().closeTooltip.setValue(p(e)), this
        }
        getCloseTooltip() {
          return this._line.properties().closeTooltip.value()
        }
        setReverseTooltip(e) {
          return this._line.properties().reverseTooltip.setValue(p(e)), this
        }
        getReverseTooltip() {
          return this._line.properties().reverseTooltip.value()
        }
        getQuantity() {
          return this._data.quantityText
        }
        setQuantity(e) {
          return (
            (this._data.quantityText = e || ''),
            this._line.updateAllViewsAndRedraw(a(this._line.id())),
            this
          )
        }
        getExtendLeft() {
          var e = this._line.properties().extendLeft.value()
          return 'inherit' === e
            ? this._line._model
                .properties()
                .tradingProperties.extendLeft.value()
            : e
        }
        setExtendLeft(e) {
          return this._line.properties().extendLeft.setValue(e), this
        }
        getLineLength() {
          var e = this._line.properties().lineLength.value()
          return 'inherit' === e
            ? this._line._model
                .properties()
                .tradingProperties.lineLength.value()
            : e
        }
        getLineLengthUnit() {
          return this._line.properties().lineLengthUnit.value()
        }
        setLineLength(e, t = 'percentage') {
          const r = t && 'pixel' === t ? e : Math.max(0, Math.min(e, 100))
          return (
            this._line.properties().lineLength.setValue(r),
            this._line.properties().lineLengthUnit.setValue(t),
            this
          )
        }
        getLineColor() {
          var e = this._line.properties()
          return (
            'buy' === this._direction ? e.lineBuyColor : e.lineSellColor
          ).value()
        }
        setLineColor(e) {
          return (
            'buy' === this._direction
              ? this.setLineBuyColor(e)
              : this.setLineSellColor(e),
            this
          )
        }
        setLineBuyColor(e) {
          return this._line.properties().lineBuyColor.setValue(e), this
        }
        setLineSellColor(e) {
          return this._line.properties().lineSellColor.setValue(e), this
        }
        getLineStyle() {
          var e = this._line.properties().lineStyle.value()
          return 'inherit' === e
            ? this._line._model.properties().tradingProperties.lineStyle.value()
            : e
        }
        setLineStyle(e) {
          return this._line.properties().lineStyle.setValue(e), this
        }
        getLineWidth() {
          var e = this._line.properties().lineWidth.value()
          return 'inherit' === e
            ? this._line._model.properties().tradingProperties.lineWidth.value()
            : e
        }
        setLineWidth(e) {
          return this._line.properties().lineWidth.setValue(e), this
        }
        getBodyBorderColor() {
          var e = this._line.properties()
          return (
            'buy' === this._direction
              ? e.bodyBorderBuyColor
              : e.bodyBorderSellColor
          ).value()
        }
        setBodyBorderColor(e) {
          return (
            'buy' === this._direction
              ? this.setBodyBorderBuyColor(e)
              : this.setBodyBorderSellColor(e),
            this
          )
        }
        setBodyBorderBuyColor(e) {
          return this._line.properties().bodyBorderBuyColor.setValue(e), this
        }
        setBodyBorderSellColor(e) {
          return this._line.properties().bodyBorderSellColor.setValue(e), this
        }
        getBodyBackgroundColor() {
          return n.getColorFromProperties(
            this._line.properties().bodyBackgroundColor,
            this._line.properties().bodyBackgroundTransparency,
          )
        }
        setBodyBackgroundColor(e) {
          return (
            n.setColorToProperties(
              e,
              this._line.properties().bodyBackgroundColor,
              this._line.properties().bodyBackgroundTransparency,
            ),
            this
          )
        }
        getBodyTextColor() {
          var e = this._line.properties()
          return (
            'positive' === this._profitState
              ? e.bodyTextPositiveColor
              : 'negative' === this._profitState
                ? e.bodyTextNegativeColor
                : e.bodyTextNeutralColor
          ).value()
        }
        setBodyTextColor(e) {
          return (
            'positive' === this._profitState
              ? this.setBodyTextPositiveColor(e)
              : 'negative' === this._profitState
                ? this.setBodyTextNegativeColor(e)
                : this.setBodyTextNeutralColor(e),
            this
          )
        }
        setBodyTextPositiveColor(e) {
          return this._line.properties().bodyTextPositiveColor.setValue(e), this
        }
        setBodyTextNegativeColor(e) {
          return this._line.properties().bodyTextNegativeColor.setValue(e), this
        }
        setBodyTextNeutralColor(e) {
          return this._line.properties().bodyTextNeutralColor.setValue(e), this
        }
        getBodyFont() {
          return n.getFontFromProperties(
            this._line.properties().bodyFontFamily,
            this._line.properties().bodyFontSize,
            this._line.properties().bodyFontBold,
            this._line.properties().bodyFontItalic,
          )
        }
        setBodyFont(e) {
          return (
            n.setFontToProperties(
              e,
              this._line.properties().bodyFontFamily,
              this._line.properties().bodyFontSize,
              this._line.properties().bodyFontBold,
              this._line.properties().bodyFontItalic,
            ),
            this
          )
        }
        getQuantityBorderColor() {
          var e = this._line.properties()
          return (
            'buy' === this._direction
              ? e.quantityBorderBuyColor
              : e.quantityBorderSellColor
          ).value()
        }
        setQuantityBorderColor(e) {
          return (
            'buy' === this._direction
              ? this.setQuantityBorderBuyColor(e)
              : this.setQuantityBorderSellColor(e),
            this
          )
        }
        setQuantityBorderBuyColor(e) {
          return (
            this._line.properties().quantityBorderBuyColor.setValue(e), this
          )
        }
        setQuantityBorderSellColor(e) {
          return (
            this._line.properties().quantityBorderSellColor.setValue(e), this
          )
        }
        getQuantityBackgroundColor() {
          var e = this._line.properties()
          return (
            'buy' === this._direction
              ? e.quantityBackgroundBuyColor
              : e.quantityBackgroundSellColor
          ).value()
        }
        setQuantityBackgroundColor(e) {
          return (
            'buy' === this._direction
              ? this.setQuantityBackgroundBuyColor(e)
              : this.setQuantityBackgroundSellColor(e),
            this
          )
        }
        setQuantityBackgroundBuyColor(e) {
          return (
            this._line.properties().quantityBackgroundBuyColor.setValue(e), this
          )
        }
        setQuantityBackgroundSellColor(e) {
          return (
            this._line.properties().quantityBackgroundSellColor.setValue(e),
            this
          )
        }
        getQuantityTextColor() {
          return n.getColorFromProperties(
            this._line.properties().quantityTextColor,
            this._line.properties().quantityTextTransparency,
          )
        }
        setQuantityTextColor(e) {
          return (
            n.setColorToProperties(
              e,
              this._line.properties().quantityTextColor,
              this._line.properties().quantityTextTransparency,
            ),
            this
          )
        }
        getQuantityFont() {
          return n.getFontFromProperties(
            this._line.properties().quantityFontFamily,
            this._line.properties().quantityFontSize,
            this._line.properties().quantityFontBold,
            this._line.properties().quantityFontItalic,
          )
        }
        setQuantityFont(e) {
          return (
            n.setFontToProperties(
              e,
              this._line.properties().quantityFontFamily,
              this._line.properties().quantityFontSize,
              this._line.properties().quantityFontBold,
              this._line.properties().quantityFontItalic,
            ),
            this
          )
        }
        getReverseButtonBorderColor() {
          var e = this._line.properties()
          return (
            'buy' === this._direction
              ? e.reverseButtonBorderBuyColor
              : e.reverseButtonBorderSellColor
          ).value()
        }
        setReverseButtonBorderColor(e) {
          return (
            'buy' === this._direction
              ? this.setReverseButtonBorderBuyColor(e)
              : this.setReverseButtonBorderSellColor(e),
            this
          )
        }
        setReverseButtonBorderBuyColor(e) {
          return (
            this._line.properties().reverseButtonBorderBuyColor.setValue(e),
            this
          )
        }
        setReverseButtonBorderSellColor(e) {
          return (
            this._line.properties().reverseButtonBorderSellColor.setValue(e),
            this
          )
        }
        getReverseButtonBackgroundColor() {
          return n.getColorFromProperties(
            this._line.properties().reverseButtonBackgroundColor,
            this._line.properties().reverseButtonBackgroundTransparency,
          )
        }
        setReverseButtonBackgroundColor(e) {
          return (
            n.setColorToProperties(
              e,
              this._line.properties().reverseButtonBackgroundColor,
              this._line.properties().reverseButtonBackgroundTransparency,
            ),
            this
          )
        }
        getReverseButtonIconColor() {
          var e = this._line.properties()
          return (
            'buy' === this._direction
              ? e.reverseButtonIconBuyColor
              : e.reverseButtonIconSellColor
          ).value()
        }
        setReverseButtonIconColor(e) {
          return (
            'buy' === this._direction
              ? this.setReverseButtonIconBuyColor(e)
              : this.setReverseButtonIconSellColor(e),
            this
          )
        }
        setReverseButtonIconBuyColor(e) {
          return (
            this._line.properties().reverseButtonIconBuyColor.setValue(e), this
          )
        }
        setReverseButtonIconSellColor(e) {
          return (
            this._line.properties().reverseButtonIconSellColor.setValue(e), this
          )
        }
        getCloseButtonBorderColor() {
          var e = this._line.properties()
          return (
            'buy' === this._direction
              ? e.closeButtonBorderBuyColor
              : e.closeButtonBorderSellColor
          ).value()
        }
        setCloseButtonBorderColor(e) {
          return (
            'buy' === this._direction
              ? this.setCloseButtonBorderBuyColor(e)
              : this.setCloseButtonBorderSellColor(e),
            this
          )
        }
        setCloseButtonBorderBuyColor(e) {
          return (
            this._line.properties().closeButtonBorderBuyColor.setValue(e), this
          )
        }
        setCloseButtonBorderSellColor(e) {
          return (
            this._line.properties().closeButtonBorderSellColor.setValue(e), this
          )
        }
        getCloseButtonBackgroundColor() {
          return n.getColorFromProperties(
            this._line.properties().closeButtonBackgroundColor,
            this._line.properties().closeButtonBackgroundTransparency,
          )
        }
        setCloseButtonBackgroundColor(e) {
          return (
            n.setColorToProperties(
              e,
              this._line.properties().closeButtonBackgroundColor,
              this._line.properties().closeButtonBackgroundTransparency,
            ),
            this
          )
        }
        getCloseButtonIconColor() {
          var e = this._line.properties()
          return (
            'buy' === this._direction
              ? e.closeButtonIconBuyColor
              : e.closeButtonIconSellColor
          ).value()
        }
        setCloseButtonIconColor(e) {
          return (
            'buy' === this._direction
              ? this.setCloseButtonIconBuyColor(e)
              : this.setCloseButtonIconSellColor(e),
            this
          )
        }
        setCloseButtonIconBuyColor(e) {
          return (
            this._line.properties().closeButtonIconBuyColor.setValue(e), this
          )
        }
        setCloseButtonIconSellColor(e) {
          return (
            this._line.properties().closeButtonIconSellColor.setValue(e), this
          )
        }
        block() {
          ;(this._blocked = !0),
            this._line.updateAllViewsAndRedraw(a(this._line.id()))
        }
        unblock() {
          ;(this._blocked = !1),
            this._line.updateAllViewsAndRedraw(a(this._line.id()))
        }
        isFunction(e) {
          return 'function' == typeof e
        }
        onReverse(e, t) {
          return (
            t
              ? this.isFunction(t) &&
                ((this._onReverseData = e), (this._onReverseCallback = t))
              : this.isFunction(e) && (this._onReverseCallback = e),
            this
          )
        }
        callOnReverse() {
          this.isFunction(this._onReverseCallback) &&
            this._onReverseCallback.call(this, this._onReverseData)
        }
        isOnReverseCallbackPresent() {
          return this.isFunction(this._onReverseCallback)
        }
        onClose(e, t) {
          return (
            t
              ? this.isFunction(t) &&
                ((this._onCloseData = e), (this._onCloseCallback = t))
              : this.isFunction(e) && (this._onCloseCallback = e),
            this
          )
        }
        setCloseEnabled(e) {
          return (
            this._closeEnabled === e ||
              ((this._closeEnabled = e),
              this._onCloseCallback &&
                this._line.updateAllViewsAndRedraw(a(this._line.id()))),
            this
          )
        }
        isCloseEnabled() {
          return this._closeEnabled
        }
        callOnClose() {
          this.isFunction(this._onCloseCallback) &&
            this._closeEnabled &&
            this._onCloseCallback.call(this, this._onCloseData)
        }
        isOnCloseCallbackPresent() {
          return this._closeEnabled && this.isFunction(this._onCloseCallback)
        }
        onModify(e, t) {
          return (
            t
              ? this.isFunction(t) &&
                ((this._onModifyData = e), (this._onModifyCallback = t))
              : this.isFunction(e) && (this._onModifyCallback = e),
            this
          )
        }
        callOnModify() {
          this.isFunction(this._onModifyCallback) &&
            this._onModifyCallback.call(this, this._onModifyData)
        }
        onContextMenu(e, t) {
          return (
            t
              ? this.isFunction(t) &&
                ((this._onContextMenuData = e),
                (this._onContextMenuCallback = t))
              : this.isFunction(e) && (this._onContextMenuCallback = e),
            this
          )
        }
        shouldShowContextMenu() {
          return this.isFunction(this._onContextMenuCallback)
        }
        callOnContextMenu() {
          if (this.isFunction(this._onContextMenuCallback))
            return this._onContextMenuCallback.call(
              this,
              this._onContextMenuData,
            )
        }
        remove() {
          this._line._model.removeSource(this._line), delete this._line
        }
      }
      class _ extends i {
        constructor(e, t) {
          var i = t || _.createProperties(e.backgroundTheme().spawnOwnership())
          super(e, i),
            (this._adapter = new d(this)),
            Promise.all([r.e(6290), r.e(9116), r.e(1200), r.e(1583)])
              .then(r.t.bind(r, 38420, 19))
              .then(({ PositionPaneView: e }) => {
                this._setPaneViews([new e(this, this._model)])
              })
        }
        adapter() {
          return this._adapter
        }
        zorder() {
          return h
        }
        isSpeciallyZOrderedSource() {
          return !0
        }
        setPoint(e, t) {
          ;(this._points[e] = t), this._normalizePoints()
        }
        addPoint(e, t) {
          return (
            this._points.push(e),
            (this._lastPoint = null),
            this._normalizePoints(),
            this.createServerPoints(),
            !0
          )
        }
        name() {
          return 'Position'
        }
        createPriceAxisView(e) {
          return (
            (this._priceAxisView = new s(this, {
              pointIndex: e,
              backgroundPropertyGetter: () => this._adapter.getLineColor(),
            })),
            this._priceAxisView
          )
        }
        paneViews() {
          return TradingView.printing && !u.enabled('snapshot_trading_drawings')
            ? null
            : this._model.properties().tradingProperties.showPositions.value()
              ? o.prototype.paneViews.call(this)
              : null
        }
        priceAxisViews(e, t) {
          return TradingView.printing && !u.enabled('snapshot_trading_drawings')
            ? null
            : this._model.properties().tradingProperties.showPositions.value()
              ? o.prototype.priceAxisViews.call(this, e, t)
              : null
        }
        hasContextMenu() {
          return this._adapter.shouldShowContextMenu()
        }
        contextMenuItems() {
          return this._adapter.callOnContextMenu()
        }
        formatter() {
          return this._formatter
        }
        static createProperties(e, t) {
          var r = new l({
            defaultName: 'linetoolposition',
            state: t,
            useUserPreferences: !1,
            theme: e,
          })
          return this._configureProperties(r), r
        }
      }
      t.LineToolPosition = _
    },
  },
])
