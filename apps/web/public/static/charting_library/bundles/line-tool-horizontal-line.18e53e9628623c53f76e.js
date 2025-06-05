;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4201],
  {
    36590: (e, t, i) => {
      i.d(t, { LineToolHorzLinePriceAxisView: () => r })
      var s = i(98558),
        n = i(19063)
      class r extends s.PriceAxisView {
        constructor(e) {
          super(), (this._source = e)
        }
        _updateRendererData(e, t, i) {
          e.visible = !1
          const s = this._source.points(),
            r = this._source.priceScale()
          if (0 === s.length || null === r || r.isEmpty()) return
          const o = s[0]
          if (!isFinite(o.price)) return
          const a = this._source.ownerSource(),
            l = null !== a ? a.firstValue() : null
          if (null === l) return
          const h = (0, n.resetTransparency)(
            this._source.properties().linecolor.value(),
          )
          ;(i.background = h),
            (i.textColor = this.generateTextColor(h)),
            (i.coordinate = r.priceToCoordinate(o.price, l)),
            (e.text = r.formatPrice(o.price, l)),
            (e.visible = !0)
        }
      }
    },
    43636: (e, t, i) => {
      i.r(t), i.d(t, { LineToolHorzLine: () => a })
      var s = i(12988),
        n = i(32679),
        r = i(24362),
        o = i(36590)
      class a extends r.InplaceTextLineDataSource {
        constructor(e, t, s, n) {
          super(
            e,
            t ?? a.createProperties(e.backgroundTheme().spawnOwnership()),
            s,
            n,
          ),
            (this._priceAxisView = new o.LineToolHorzLinePriceAxisView(this)),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 38117))
              .then(({ HorzLinePaneView: e }) => {
                this._setPaneViews([
                  new e(
                    this,
                    this._model,
                    this._openTextEditor.bind(this),
                    this._closeTextEditor.bind(this),
                    this.onSelectionChange.bind(this),
                  ),
                ])
              })
        }
        state(e) {
          const t = super.state(e)
          return (
            t.points && 0 !== t.points.length && (t.points[0].offset = 0), t
          )
        }
        pointsCount() {
          return 1
        }
        name() {
          return 'Horizontal Line'
        }
        priceAxisViews(e, t) {
          return this.isSourceHidden() ||
            t !== this.priceScale() ||
            (!this._model.selection().isSelected(this) &&
              !this.properties().childs().showPrice.value()) ||
            e !== this._model.paneForSource(this)
            ? null
            : [this._priceAxisView]
        }
        timeAxisViews() {
          return null
        }
        timeAxisPoints() {
          return []
        }
        updateAllViews(e) {
          super.updateAllViews(e), this._priceAxisView.update(e)
        }
        canHasAlert() {
          return !0
        }
        template() {
          const e = super.template()
          return (e.text = this.properties().childs().text.value()), e
        }
        denormalizeTimePoints() {
          ;(this._points = []),
            this._timePoint.length > 0 &&
              this._points.push({
                price: this._timePoint[0].price,
                index: 0,
                interval: this._model.mainSeries().interval(),
              })
        }
        clearData() {
          const e = this._points
          super.clearData(), (this._points = e)
        }
        editableTextProperties() {
          const e = this.properties().childs()
          return {
            text: e.text,
            textColor: e.textcolor,
            textVisible: e.showLabel,
          }
        }
        static createProperties(e, t) {
          const i = new n.DefaultProperty({
            defaultName: 'linetoolhorzline',
            state: t,
            theme: e,
          })
          return this._configureProperties(i), i
        }
        _getAlertPlots() {
          return [this.points()[0].price]
        }
        _pointsForPointset() {
          return []
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            i.e(6406),
            i.e(3889),
            i.e(8009),
            i.e(8056),
            i.e(8537),
          ])
            .then(i.bind(i, 84190))
            .then((e) => e.HorizontalLineDefinitionsViewModel)
        }
        _applyTemplateImpl(e) {
          super._applyTemplateImpl(e),
            this.properties()
              .childs()
              .text.setValue(e.text || '')
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.hasChild('text') || e.addChild('text', new s.Property('')),
            e.addExcludedKey('text', 1)
        }
      }
    },
    24362: (e, t, i) => {
      i.d(t, {
        InplaceTextLineDataSource: () => P,
        InplaceTextUndoCommand: () => m,
      })
      var s = i(50279),
        n = i(50151),
        r = i(86441),
        o = i(19625),
        a = i(24377),
        l = i(11542),
        h = i(45126),
        d = i(88960),
        c = i(64147),
        u = i(60265),
        _ = i(29875),
        p = i(44672),
        x = i(85719)
      const w = {
          selectionColor: (0, o.getHexColorByName)('color-tv-blue-500'),
          cursorColor: (0, o.getHexColorByName)('color-black'),
        },
        g = {
          selectionColor: (0, o.getHexColorByName)('color-white'),
          cursorColor: (0, o.getHexColorByName)('color-white'),
        }
      class m extends u.UndoCommand {
        constructor(e, t, s, n) {
          super(
            new h.TranslatedString(
              'change {title} text',
              l.t(null, void 0, i(57122)),
            ).format({
              title: new h.TranslatedString(t.name(), t.translatedType()),
            }),
            !0,
            !x.lineToolsDoNotAffectChartInvalidation,
          ),
            (this._sourceId = t.id()),
            (this._model = e),
            (this._oldValue = s),
            (this._newValue = n),
            (this._changeVisibility =
              !1 === t.editableTextProperties().textVisible?.value())
        }
        redo() {
          const e = this._source()
          this._textProperty(e).setValue(this._newValue),
            this._changeVisibility &&
              this._textVisibilityProperty(e)?.setValue(!0)
        }
        undo() {
          const e = this._source()
          this._textProperty(e).setValue(this._oldValue),
            this._changeVisibility &&
              this._textVisibilityProperty(e)?.setValue(!1)
        }
        _textProperty(e) {
          return e.editableTextProperties().text
        }
        _textVisibilityProperty(e) {
          return e.editableTextProperties().textVisible
        }
        _source() {
          return (0, n.ensureNotNull)(
            this._model.dataSourceForId(this._sourceId),
          )
        }
      }
      class P extends _.LineDataSource {
        constructor(e, t, s, n) {
          super(e, t, s, n),
            (this._container = null),
            (this._editableText = new c.WatchedValue('')),
            (this._activateTextEditingEl = null),
            (this._paneView = null),
            (this._selectionData = {}),
            (this._cursorPaneView = null),
            (this._cursorPosition = null),
            (this._editingOnCreation = !1),
            (this._editingActivationTime = null),
            this._editableText.subscribe(() => {
              this.updateAllViewsAndRedraw((0, p.sourceChangeEvent)(this.id()))
            }),
            (this._isDarkBackground = (0, d.combine)(
              (e, t) => {
                if (null === t) return this._model.dark().value()
                const i = (0, a.blendRgba)(
                  (0, a.parseRgba)(e),
                  (0, a.parseRgba)(t),
                )
                return (
                  'black' ===
                  (0, a.rgbToBlackWhiteString)([i[0], i[1], i[2]], 150)
                )
              },
              this._model.backgroundColor().spawnOwnership(),
              this._createDataSourceBackgroundColorWV(),
            )),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 15852))
              .then((t) => {
                ;(this._cursorPaneView = new t.InplaceTextCursorPaneView(
                  this,
                  e,
                )),
                  this._additionalCursorDataGetters &&
                    (this._cursorPaneView.setAdditionalCursorData(
                      ...this._additionalCursorDataGetters,
                    ),
                    null !== this._cursorPosition &&
                      (this._cursorPaneView.setCursorPosition(
                        this._cursorPosition,
                      ),
                      e.updateSource(this)))
              })
        }
        destroy() {
          this._isDarkBackground.destroy(),
            this._editableText.unsubscribe(),
            this._closeTextEditor(),
            super.destroy()
        }
        editableTextStyle() {
          return { ...(this._isDarkBackground.value() ? g : w) }
        }
        removeIfEditableTextIsEmpty() {
          return !1
        }
        activateEditingOnCreation() {
          return !1
        }
        topPaneViews(e) {
          return e.hasDataSource(this) &&
            !window.TradingView.printing &&
            this._cursorPaneView
            ? (this._cursorPaneView.update((0, p.sourceChangeEvent)(this.id())),
              [this._cursorPaneView])
            : null
        }
        dataAndViewsReady() {
          return super.dataAndViewsReady() && null !== this._cursorPaneView
        }
        editableText() {
          return this._editableText
        }
        textEditingEl() {
          return this._activateTextEditingEl
        }
        activateTextEditingOn(e, t) {
          ;(this._activateTextEditingEl = e),
            (this._editingOnCreation = !!t),
            (this._editingActivationTime = performance.now()),
            this.updateAllViewsAndRedraw((0, p.sourceChangeEvent)(this.id()))
        }
        deactivateTextEditing() {
          this._closeTextEditor()
        }
        textEditingActivationTime() {
          return this._editingActivationTime
        }
        onSelectionChange(e) {
          const t = {}
          if (void 0 !== e) {
            const { start: i, end: s } = e
            i === s
              ? (t.cursorPosition = i)
              : (t.selectionRange = [Math.min(i, s), Math.max(i, s)])
          }
          ;(0, s.default)(t, this._selectionData) ||
            ((this._selectionData = t),
            this._paneViews.forEach((e) => {
              e.forEach((e) => {
                'setSelectionRange' in e &&
                  e.setSelectionRange(t.selectionRange)
              })
            }),
            this._cursorPaneView
              ? this._cursorPaneView.setCursorPosition(t.cursorPosition)
              : (this._cursorPosition = t.cursorPosition ?? null),
            this.updateAllViewsAndRedraw((0, p.sourceChangeEvent)(this.id())))
        }
        setAdditionalCursorData(e, t) {
          this._cursorPaneView
            ? this._cursorPaneView.setAdditionalCursorData(e, t)
            : (this._additionalCursorDataGetters = [e, t])
        }
        _updateAllPaneViews(e) {
          super._updateAllPaneViews(e), this._cursorPaneView?.update(e)
        }
        async _openTextEditor(e, t, s, o, a) {
          if (null !== this._container) return
          null === this._editingActivationTime &&
            (this._editingActivationTime = performance.now()),
            (this._activateTextEditingEl = null),
            (this._cursorPosition = null),
            (this._container = document.createElement('div')),
            (this._container.style.position = 'absolute'),
            (this._container.style.top = '0'),
            (this._container.style.bottom = '0'),
            (this._container.style.left = '0'),
            (this._container.style.right = '0'),
            (this._container.style.overflow = 'hidden'),
            (this._container.style.pointerEvents = 'none'),
            e.appendChild(this._container)
          const { updateChartEditorText: l, closeChartEditorText: h } =
            await Promise.all([i.e(4556), i.e(2227), i.e(5592)]).then(
              i.bind(i, 99514),
            )
          if (null === this._container || this._isDestroyed) return
          this._closeChartEditorText = h
          const {
              text: d,
              textColor: c,
              wordWrap: u,
            } = this.editableTextProperties(),
            { forbidLineBreaks: _, maxLength: x } = this.editableTextStyle()
          this._editableText.setValue(d.value())
          const w = this.isFixed()
              ? (0, n.ensureDefined)(this.fixedPoint())
              : (0, n.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            g = {
              position: (0, r.point)(w.x, w.y),
              textInfo: t,
              placeholder: s,
              text: this._editableText,
              textColor: c,
              wordWrap: u,
              forbidLineBreaks: _,
              maxLength: x,
              onClose: o,
              onSelectionChange: a,
              onContextMenu: this.onContextMenu
                ? this.onContextMenu.bind(this)
                : void 0,
            }
          l(this._container, g),
            this.updateAllViewsAndRedraw((0, p.sourceChangeEvent)(this.id()))
        }
        _closeTextEditor() {
          null === this._container ||
            this._isDestroyed ||
            ((this._editingActivationTime = null),
            this._saveEditedText(),
            (this._editingOnCreation = !1),
            this.onSelectionChange(),
            this._closeChartEditorText?.(this._container),
            (this._closeChartEditorText = void 0),
            this._container.remove(),
            (this._container = null),
            this.updateAllViewsAndRedraw((0, p.sourceChangeEvent)(this.id())))
        }
        _saveEditedText() {
          const e = this.editableTextProperties().text.value(),
            t = this._editableText.value()
          e !== t &&
            (this._editingOnCreation &&
              this.editableTextProperties().text.setValue(t),
            this._model
              .undoModel()
              .undoHistory()
              .pushUndoCommand(this._changeEditableTextUndoCommand(e, t)))
        }
        _changeEditableTextUndoCommand(e, t) {
          return new m(this._model, this, e, t)
        }
        _createDataSourceBackgroundColorWV() {
          return new c.WatchedValue(null).readonly().ownership()
        }
      }
    },
  },
])
