;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2232],
  {
    81776: (t, e, i) => {
      i.d(e, { LineToolTradingPriceAxisView: () => r })
      var o = i(90793)
      class r extends o.LineToolPriceAxisView {
        _formatPrice(t, e) {
          return this._source.formatter().format(t)
        }
      }
    },
    64732: (t, e, i) => {
      var o = i(36009).LineToolTrading,
        r = i(81776).LineToolTradingPriceAxisView,
        n = i(91920),
        l = i(29875).LineDataSource,
        s = i(32679).DefaultProperty
      const a = i(56570),
        u = i(44672).sourceChangeEvent
      var c = i(2718).sortSourcesPreOrdered.LineToolOrder
      function h(t) {
        return null == t ? (t = '') : (t += ''), t
      }
      class d {
        constructor(t) {
          ;(this._line = t),
            (this._data = { bodyText: 'order', quantityText: '0' }),
            (this._editable = !0),
            (this._cancellable = !0),
            (this._mode = ''),
            (this._direction = 'buy'),
            (this._active = !0)
        }
        setMode(t) {
          return (
            (this._mode = t),
            this._line.updateAllViewsAndRedraw(u(this._line.id())),
            this
          )
        }
        setDirection(t) {
          return (
            (this._direction = t),
            this._line.updateAllViewsAndRedraw(u(this._line.id())),
            this
          )
        }
        setActive(t) {
          return (
            (this._active = t),
            this._line.updateAllViewsAndRedraw(u(this._line.id())),
            this
          )
        }
        setEditable(t) {
          return (
            (this._editable = t),
            this._line.updateAllViewsAndRedraw(u(this._line.id())),
            this
          )
        }
        getEditable() {
          return this._editable
        }
        setCancellable(t) {
          return (
            (this._cancellable = t),
            this._line.updateAllViewsAndRedraw(u(this._line.id())),
            this
          )
        }
        getCancellable() {
          return this._cancellable
        }
        hasMoveCallback() {
          return this.isFunction(this._onMoveCallback)
        }
        hasModifyCallback() {
          return this.isFunction(this._onModifyCallback)
        }
        getPrice() {
          return this._line.points().length > 0
            ? this._line.points()[0].price
            : this._line._timePoint.length > 0
              ? this._line._timePoint[0].price
              : void 0
        }
        setPrice(t) {
          if (this._line.points().length > 0) {
            var e = this._line.points()[0]
            ;(e.price = t),
              this._line.setPoint(0, e),
              this._line.updateAllViewsAndRedraw(u(this._line.id()))
          }
          return (
            this._line._timePoint.length > 0 &&
              (this._line._timePoint[0].price = t),
            this
          )
        }
        getText() {
          return this._data.bodyText
        }
        setText(t) {
          return (
            (this._data.bodyText = t || ''),
            this._line.updateAllViewsAndRedraw(u(this._line.id())),
            this
          )
        }
        setTooltip(t) {
          return this._line.properties().tooltip.setValue(h(t)), this
        }
        getTooltip() {
          return this._line.properties().tooltip.value()
        }
        setModifyTooltip(t) {
          return this._line.properties().modifyTooltip.setValue(h(t)), this
        }
        getModifyTooltip() {
          return this._line.properties().modifyTooltip.value()
        }
        setCancelTooltip(t) {
          return this._line.properties().cancelTooltip.setValue(h(t)), this
        }
        getCancelTooltip() {
          return this._line.properties().cancelTooltip.value()
        }
        getQuantity() {
          return this._data.quantityText
        }
        setQuantity(t) {
          return (
            (this._data.quantityText = t || ''),
            this._line.updateAllViewsAndRedraw(u(this._line.id())),
            this
          )
        }
        getExtendLeft() {
          var t = this._line.properties().extendLeft.value()
          return 'inherit' === t
            ? this._line._model
                .properties()
                .tradingProperties.extendLeft.value()
            : t
        }
        setExtendLeft(t) {
          return this._line.properties().extendLeft.setValue(t), this
        }
        getLineLength() {
          var t = this._line.properties().lineLength.value()
          return 'inherit' === t
            ? this._line._model
                .properties()
                .tradingProperties.lineLength.value()
            : t
        }
        setLineLength(t, e = 'percentage') {
          const i = e && 'pixel' === e ? t : Math.max(0, Math.min(t, 100))
          return (
            this._line.properties().lineLength.setValue(i),
            this._line.properties().lineLengthUnit.setValue(e),
            this
          )
        }
        getLineLengthUnit() {
          return this._line.properties().lineLengthUnit.value()
        }
        getLineColor() {
          var t = this._line.properties()
          return 'buy' === this._direction
            ? this._active
              ? t.lineActiveBuyColor.value()
              : t.lineInactiveBuyColor.value()
            : this._active
              ? t.lineActiveSellColor.value()
              : t.lineInactiveSellColor.value()
        }
        setLineColor(t) {
          return (
            'buy' === this._direction
              ? this._active
                ? this.setLineActiveBuyColor(t)
                : this.setLineInactiveBuyColor(t)
              : this._active
                ? this.setLineActiveSellColor(t)
                : this.setLineInactiveSellColor(t),
            this
          )
        }
        setLineActiveBuyColor(t) {
          return this._line.properties().lineActiveBuyColor.setValue(t), this
        }
        setLineInactiveBuyColor(t) {
          return this._line.properties().lineInactiveBuyColor.setValue(t), this
        }
        setLineActiveSellColor(t) {
          return this._line.properties().lineActiveSellColor.setValue(t), this
        }
        setLineInactiveSellColor(t) {
          return this._line.properties().lineInactiveSellColor.setValue(t), this
        }
        getLineStyle() {
          var t = this._line.properties().lineStyle.value()
          return 'inherit' === t
            ? this._line._model.properties().tradingProperties.lineStyle.value()
            : t
        }
        setLineStyle(t) {
          return this._line.properties().lineStyle.setValue(t), this
        }
        getLineWidth() {
          var t = this._line.properties().lineWidth.value()
          return 'inherit' === t
            ? this._line._model.properties().tradingProperties.lineWidth.value()
            : t
        }
        setLineWidth(t) {
          return this._line.properties().lineWidth.setValue(t), this
        }
        getBodyBorderColor() {
          var t = this._line.properties()
          return 'buy' === this._direction
            ? this._active
              ? t.bodyBorderActiveBuyColor.value()
              : t.bodyBorderInactiveBuyColor.value()
            : this._active
              ? t.bodyBorderActiveSellColor.value()
              : t.bodyBorderInactiveSellColor.value()
        }
        setBodyBorderColor(t) {
          return (
            'buy' === this._direction
              ? this._active
                ? this.setBodyBorderActiveBuyColor(t)
                : this.setBodyBorderInactiveBuyColor(t)
              : this._active
                ? this.setBodyBorderActiveSellColor(t)
                : this.setBodyBorderInactiveSellColor(t),
            this
          )
        }
        setBodyBorderActiveBuyColor(t) {
          return (
            this._line.properties().bodyBorderActiveBuyColor.setValue(t), this
          )
        }
        setBodyBorderInactiveBuyColor(t) {
          return (
            this._line.properties().bodyBorderInactiveBuyColor.setValue(t), this
          )
        }
        setBodyBorderActiveSellColor(t) {
          return (
            this._line.properties().bodyBorderActiveSellColor.setValue(t), this
          )
        }
        setBodyBorderInactiveSellColor(t) {
          return (
            this._line.properties().bodyBorderInactiveSellColor.setValue(t),
            this
          )
        }
        getBodyBackgroundColor() {
          return n.getColorFromProperties(
            this._line.properties().bodyBackgroundColor,
            this._line.properties().bodyBackgroundTransparency,
          )
        }
        setBodyBackgroundColor(t) {
          return (
            n.setColorToProperties(
              t,
              this._line.properties().bodyBackgroundColor,
              this._line.properties().bodyBackgroundTransparency,
            ),
            this
          )
        }
        getBodyTextColor() {
          var t = this._line.properties()
          return 'limit' === this._mode
            ? this._active
              ? t.bodyTextActiveLimitColor.value()
              : t.bodyTextInactiveLimitColor.value()
            : 'stop' === this._mode
              ? this._active
                ? t.bodyTextActiveStopColor.value()
                : t.bodyTextInactiveStopColor.value()
              : 'buy' === this._direction
                ? this._active
                  ? t.bodyTextActiveBuyColor.value()
                  : t.bodyTextInactiveBuyColor.value()
                : this._active
                  ? t.bodyTextActiveSellColor.value()
                  : t.bodyTextInactiveSellColor.value()
        }
        setBodyTextColor(t) {
          return (
            'limit' === this._mode
              ? this._active
                ? this.setBodyTextActiveLimitColor(t)
                : this.setBodyTextInactiveLimitColor(t)
              : 'stop' === this._mode
                ? this._active
                  ? this.setBodyTextActiveStopColor(t)
                  : this.setBodyTextInactiveStopColor(t)
                : 'buy' === this._direction
                  ? this._active
                    ? this.setBodyTextActiveBuyColor(t)
                    : this.setBodyTextInactiveBuyColor(t)
                  : this._active
                    ? this.setBodyTextActiveSellColor(t)
                    : this.setBodyTextInactiveSellColor(t),
            this
          )
        }
        setBodyTextInactiveLimitColor(t) {
          return (
            this._line.properties().bodyTextInactiveLimitColor.setValue(t), this
          )
        }
        setBodyTextActiveLimitColor(t) {
          return (
            this._line.properties().bodyTextActiveLimitColor.setValue(t), this
          )
        }
        setBodyTextInactiveStopColor(t) {
          return (
            this._line.properties().bodyTextInactiveStopColor.setValue(t), this
          )
        }
        setBodyTextActiveStopColor(t) {
          return (
            this._line.properties().bodyTextActiveStopColor.setValue(t), this
          )
        }
        setBodyTextInactiveBuyColor(t) {
          return (
            this._line.properties().bodyTextInactiveBuyColor.setValue(t), this
          )
        }
        setBodyTextActiveBuyColor(t) {
          return (
            this._line.properties().bodyTextActiveBuyColor.setValue(t), this
          )
        }
        setBodyTextInactiveSellColor(t) {
          return (
            this._line.properties().bodyTextInactiveSellColor.setValue(t), this
          )
        }
        setBodyTextActiveSellColor(t) {
          return (
            this._line.properties().bodyTextActiveSellColor.setValue(t), this
          )
        }
        getBodyFont() {
          return n.getFontFromProperties(
            this._line.properties().bodyFontFamily,
            this._line.properties().bodyFontSize,
            this._line.properties().bodyFontBold,
            this._line.properties().bodyFontItalic,
          )
        }
        setBodyFont(t) {
          return (
            n.setFontToProperties(
              t,
              this._line.properties().bodyFontFamily,
              this._line.properties().bodyFontSize,
              this._line.properties().bodyFontBold,
              this._line.properties().bodyFontItalic,
            ),
            this
          )
        }
        getQuantityBorderColor() {
          var t = this._line.properties()
          return 'buy' === this._direction
            ? this._active
              ? t.quantityBorderActiveBuyColor.value()
              : t.quantityBorderInactiveBuyColor.value()
            : this._active
              ? t.quantityBorderActiveSellColor.value()
              : t.quantityBorderInactiveSellColor.value()
        }
        setQuantityBorderColor(t) {
          return (
            'buy' === this._direction
              ? this._active
                ? this.setQuantityBorderActiveBuyColor(t)
                : this.setQuantityBorderInactiveBuyColor(t)
              : this._active
                ? this.setQuantityBorderActiveSellColor(t)
                : this.setQuantityBorderInactiveSellColor(t),
            this
          )
        }
        setQuantityBorderActiveBuyColor(t) {
          return (
            this._line.properties().quantityBorderActiveBuyColor.setValue(t),
            this
          )
        }
        setQuantityBorderInactiveBuyColor(t) {
          return (
            this._line.properties().quantityBorderInactiveBuyColor.setValue(t),
            this
          )
        }
        setQuantityBorderActiveSellColor(t) {
          return (
            this._line.properties().quantityBorderActiveSellColor.setValue(t),
            this
          )
        }
        setQuantityBorderInactiveSellColor(t) {
          return (
            this._line.properties().quantityBorderInactiveSellColor.setValue(t),
            this
          )
        }
        getQuantityBackgroundColor() {
          var t = this._line.properties()
          return 'buy' === this._direction
            ? this._active
              ? t.quantityBackgroundActiveBuyColor.value()
              : t.quantityBackgroundInactiveBuyColor.value()
            : this._active
              ? t.quantityBackgroundActiveSellColor.value()
              : t.quantityBackgroundInactiveSellColor.value()
        }
        setQuantityBackgroundColor(t) {
          return (
            'buy' === this._direction
              ? this._active
                ? this.setQuantityBackgroundActiveBuyColor(t)
                : this.setQuantityBackgroundInactiveBuyColor(t)
              : this._active
                ? this.setQuantityBackgroundActiveSellColor(t)
                : this.setQuantityBackgroundInactiveSellColor(t),
            this
          )
        }
        setQuantityBackgroundActiveBuyColor(t) {
          return (
            this._line
              .properties()
              .quantityBackgroundActiveBuyColor.setValue(t),
            this
          )
        }
        setQuantityBackgroundInactiveBuyColor(t) {
          return (
            this._line
              .properties()
              .quantityBackgroundInactiveBuyColor.setValue(t),
            this
          )
        }
        setQuantityBackgroundActiveSellColor(t) {
          return (
            this._line
              .properties()
              .quantityBackgroundActiveSellColor.setValue(t),
            this
          )
        }
        setQuantityBackgroundInactiveSellColor(t) {
          return (
            this._line
              .properties()
              .quantityBackgroundInactiveSellColor.setValue(t),
            this
          )
        }
        getQuantityTextColor() {
          return n.getColorFromProperties(
            this._line.properties().quantityTextColor,
            this._line.properties().quantityTextTransparency,
          )
        }
        setQuantityTextColor(t) {
          return (
            n.setColorToProperties(
              t,
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
        setQuantityFont(t) {
          return (
            n.setFontToProperties(
              t,
              this._line.properties().quantityFontFamily,
              this._line.properties().quantityFontSize,
              this._line.properties().quantityFontBold,
              this._line.properties().quantityFontItalic,
            ),
            this
          )
        }
        getCancelButtonBorderColor() {
          var t = this._line.properties()
          return 'buy' === this._direction
            ? this._active
              ? t.cancelButtonBorderActiveBuyColor.value()
              : t.cancelButtonBorderInactiveBuyColor.value()
            : this._active
              ? t.cancelButtonBorderActiveSellColor.value()
              : t.cancelButtonBorderInactiveSellColor.value()
        }
        setCancelButtonBorderColor(t) {
          return (
            'buy' === this._direction
              ? this._active
                ? this.setCancelButtonBorderActiveBuyColor(t)
                : this.setCancelButtonBorderInactiveBuyColor(t)
              : this._active
                ? this.setCancelButtonBorderActiveSellColor(t)
                : this.setCancelButtonBorderInactiveSellColor(t),
            this
          )
        }
        setCancelButtonBorderActiveBuyColor(t) {
          return (
            this._line
              .properties()
              .cancelButtonBorderActiveBuyColor.setValue(t),
            this
          )
        }
        setCancelButtonBorderInactiveBuyColor(t) {
          return (
            this._line
              .properties()
              .cancelButtonBorderInactiveBuyColor.setValue(t),
            this
          )
        }
        setCancelButtonBorderActiveSellColor(t) {
          return (
            this._line
              .properties()
              .cancelButtonBorderActiveSellColor.setValue(t),
            this
          )
        }
        setCancelButtonBorderInactiveSellColor(t) {
          return (
            this._line
              .properties()
              .cancelButtonBorderInactiveSellColor.setValue(t),
            this
          )
        }
        getCancelButtonBackgroundColor() {
          return n.getColorFromProperties(
            this._line.properties().cancelButtonBackgroundColor,
            this._line.properties().cancelButtonBackgroundTransparency,
          )
        }
        setCancelButtonBackgroundColor(t) {
          return (
            n.setColorToProperties(
              t,
              this._line.properties().cancelButtonBackgroundColor,
              this._line.properties().cancelButtonBackgroundTransparency,
            ),
            this
          )
        }
        getCancelButtonIconColor() {
          var t = this._line.properties()
          return 'buy' === this._direction
            ? this._active
              ? t.cancelButtonIconActiveBuyColor.value()
              : t.cancelButtonIconInactiveBuyColor.value()
            : this._active
              ? t.cancelButtonIconActiveSellColor.value()
              : t.cancelButtonIconInactiveSellColor.value()
        }
        setCancelButtonIconColor(t) {
          return (
            'buy' === this._direction
              ? this._active
                ? this.setCancelButtonIconActiveBuyColor(t)
                : this.setCancelButtonIconInactiveBuyColor(t)
              : this._active
                ? this.setCancelButtonIconActiveSellColor(t)
                : this.setCancelButtonIconInactiveSellColor(t),
            this
          )
        }
        setCancelButtonIconActiveBuyColor(t) {
          return (
            this._line.properties().cancelButtonIconActiveBuyColor.setValue(t),
            this
          )
        }
        setCancelButtonIconInactiveBuyColor(t) {
          return (
            this._line
              .properties()
              .cancelButtonIconInactiveBuyColor.setValue(t),
            this
          )
        }
        setCancelButtonIconActiveSellColor(t) {
          return (
            this._line.properties().cancelButtonIconActiveSellColor.setValue(t),
            this
          )
        }
        setCancelButtonIconInactiveSellColor(t) {
          return (
            this._line
              .properties()
              .cancelButtonIconInactiveSellColor.setValue(t),
            this
          )
        }
        block() {
          ;(this._blocked = !0),
            this._line.updateAllViewsAndRedraw(u(this._line.id()))
        }
        unblock() {
          ;(this._blocked = !1),
            this._line.updateAllViewsAndRedraw(u(this._line.id()))
        }
        getBlocked() {
          return this._blocked
        }
        isFunction(t) {
          return 'function' == typeof t
        }
        onCancel(t, e) {
          return (
            e
              ? this.isFunction(e) &&
                ((this._onCancelData = t), (this._onCancelCallback = e))
              : this.isFunction(t) && (this._onCancelCallback = t),
            this
          )
        }
        callOnCancel() {
          this.isFunction(this._onCancelCallback) &&
            this._onCancelCallback.call(this, this._onCancelData)
        }
        isOnCancelCallbackPresent() {
          return this.isFunction(this._onCancelCallback)
        }
        onModify(t, e) {
          return (
            e
              ? this.isFunction(e) &&
                ((this._onModifyData = t), (this._onModifyCallback = e))
              : this.isFunction(t) && (this._onModifyCallback = t),
            this
          )
        }
        callOnModify() {
          this.isFunction(this._onModifyCallback) &&
            this._onModifyCallback.call(this, this._onModifyData)
        }
        onMove(t, e) {
          return (
            e
              ? this.isFunction(e) &&
                ((this._onMoveData = t), (this._onMoveCallback = e))
              : this.isFunction(t) && (this._onMoveCallback = t),
            this
          )
        }
        callOnMove() {
          this.isFunction(this._onMoveCallback) &&
            this._onMoveCallback.call(this, this._onMoveData)
        }
        onMoving(t, e) {
          return (
            e
              ? this.isFunction(e) &&
                ((this._onMovingData = t), (this._onMovingCallback = e))
              : this.isFunction(t) && (this._onMovingCallback = t),
            this
          )
        }
        callOnMoving() {
          this.isFunction(this._onMovingCallback) &&
            this._onMovingCallback.call(this, this._onMovingData)
        }
        onContextMenu(t, e) {
          return (
            e
              ? this.isFunction(e) &&
                ((this._onContextMenuData = t),
                (this._onContextMenuCallback = e))
              : this.isFunction(t) && (this._onContextMenuCallback = t),
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
      class p extends o {
        constructor(t, e) {
          var o = e || p.createProperties(t.backgroundTheme().spawnOwnership())
          super(t, o),
            (this._adapter = new d(this)),
            this.setSelectionEnabled(!0),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 92281))
              .then(({ OrderPaneView: t }) => {
                this._setPaneViews([new t(this, this._model)])
              })
        }
        zorder() {
          return c
        }
        isSpeciallyZOrderedSource() {
          return !0
        }
        setPoint(t, e) {
          ;(this._points[t] = e), this._normalizePoints()
        }
        addPoint(t, e) {
          return (
            this._points.push(t),
            (this._lastPoint = null),
            this._normalizePoints(),
            this.createServerPoints(),
            !0
          )
        }
        name() {
          return 'Order'
        }
        move(t, e, i, o) {
          var r =
            this._startMovingPoint &&
            this._currentMovingPoint &&
            this._startMovingPoint.logical.price !==
              this._currentMovingPoint.logical.price
          super.move(t, e, i, o), r && this._adapter.callOnMoving()
        }
        endMoving(t) {
          var e =
            this._startMovingPoint &&
            this._currentMovingPoint &&
            this._startMovingPoint.logical.price !==
              this._currentMovingPoint.logical.price
          super.endMoving(), !t && e && this._adapter.callOnMove()
        }
        createPriceAxisView(t) {
          var e = {
            pointIndex: t,
            backgroundPropertyGetter: () => this._adapter.getLineColor(),
          }
          return (this._priceAxisView = new r(this, e)), this._priceAxisView
        }
        paneViews() {
          return TradingView.printing && !a.enabled('snapshot_trading_drawings')
            ? null
            : this._model.properties().tradingProperties.showOrders.value()
              ? l.prototype.paneViews.call(this)
              : null
        }
        priceAxisViews(t, e) {
          return TradingView.printing && !a.enabled('snapshot_trading_drawings')
            ? null
            : this._model.properties().tradingProperties.showOrders.value()
              ? l.prototype.priceAxisViews.call(this, t, e)
              : null
        }
        adapter() {
          return this._adapter
        }
        hasContextMenu() {
          return this._adapter.shouldShowContextMenu()
        }
        contextMenuItems() {
          return this._adapter.callOnContextMenu()
        }
        movable() {
          return Boolean(this._adapter._onMoveCallback)
        }
        formatter() {
          return this._formatter
        }
        static createProperties(t, e) {
          var i = new s({
            defaultName: 'linetoolorder',
            state: e,
            useUserPreferences: !1,
            theme: t,
          })
          return this._configureProperties(i), i
        }
      }
      e.LineToolOrder = p
    },
  },
])
