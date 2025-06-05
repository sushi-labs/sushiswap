;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1282],
  {
    24362: (e, t, i) => {
      i.d(t, {
        InplaceTextLineDataSource: () => P,
        InplaceTextUndoCommand: () => g,
      })
      var n = i(50279),
        s = i(50151),
        r = i(86441),
        o = i(19625),
        a = i(24377),
        l = i(11542),
        d = i(45126),
        h = i(88960),
        u = i(64147),
        c = i(60265),
        _ = i(29875),
        p = i(44672),
        x = i(85719)
      const w = {
          selectionColor: (0, o.getHexColorByName)('color-tv-blue-500'),
          cursorColor: (0, o.getHexColorByName)('color-black'),
        },
        V = {
          selectionColor: (0, o.getHexColorByName)('color-white'),
          cursorColor: (0, o.getHexColorByName)('color-white'),
        }
      class g extends c.UndoCommand {
        constructor(e, t, n, s) {
          super(
            new d.TranslatedString(
              'change {title} text',
              l.t(null, void 0, i(57122)),
            ).format({
              title: new d.TranslatedString(t.name(), t.translatedType()),
            }),
            !0,
            !x.lineToolsDoNotAffectChartInvalidation,
          ),
            (this._sourceId = t.id()),
            (this._model = e),
            (this._oldValue = n),
            (this._newValue = s),
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
          return (0, s.ensureNotNull)(
            this._model.dataSourceForId(this._sourceId),
          )
        }
      }
      class P extends _.LineDataSource {
        constructor(e, t, n, s) {
          super(e, t, n, s),
            (this._container = null),
            (this._editableText = new u.WatchedValue('')),
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
            (this._isDarkBackground = (0, h.combine)(
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
          return { ...(this._isDarkBackground.value() ? V : w) }
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
            const { start: i, end: n } = e
            i === n
              ? (t.cursorPosition = i)
              : (t.selectionRange = [Math.min(i, n), Math.max(i, n)])
          }
          ;(0, n.default)(t, this._selectionData) ||
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
        async _openTextEditor(e, t, n, o, a) {
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
          const { updateChartEditorText: l, closeChartEditorText: d } =
            await Promise.all([i.e(4556), i.e(2227), i.e(5592)]).then(
              i.bind(i, 99514),
            )
          if (null === this._container || this._isDestroyed) return
          this._closeChartEditorText = d
          const {
              text: h,
              textColor: u,
              wordWrap: c,
            } = this.editableTextProperties(),
            { forbidLineBreaks: _, maxLength: x } = this.editableTextStyle()
          this._editableText.setValue(h.value())
          const w = this.isFixed()
              ? (0, s.ensureDefined)(this.fixedPoint())
              : (0, s.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            V = {
              position: (0, r.point)(w.x, w.y),
              textInfo: t,
              placeholder: n,
              text: this._editableText,
              textColor: u,
              wordWrap: c,
              forbidLineBreaks: _,
              maxLength: x,
              onClose: o,
              onSelectionChange: a,
              onContextMenu: this.onContextMenu
                ? this.onContextMenu.bind(this)
                : void 0,
            }
          l(this._container, V),
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
          return new g(this._model, this, e, t)
        }
        _createDataSourceBackgroundColorWV() {
          return new u.WatchedValue(null).readonly().ownership()
        }
      }
    },
    52690: (e, t, i) => {
      i.d(t, { LineToolVertLineTimeAxisView: () => s })
      var n = i(14169)
      class s extends n.LineDataSourceTimeAxisView {
        constructor(e) {
          super(e, 0)
        }
        _getBgColor() {
          return this._source.properties().linecolor.value()
        }
        _getAlwaysInViewPort() {
          return !1
        }
        _getIndex() {
          const e = this._source.points()
          return 0 === e.length ? null : e[0].index
        }
      }
    },
    56096: (e, t, i) => {
      i.r(t), i.d(t, { LineToolVertLine: () => d })
      var n = i(50151),
        s = i(86441),
        r = i(32679),
        o = i(12988),
        a = i(24362),
        l = i(52690)
      class d extends a.InplaceTextLineDataSource {
        constructor(e, t, n, s) {
          super(
            e,
            t ?? d.createProperties(e.backgroundTheme().spawnOwnership()),
            n,
            s,
          ),
            (this._verticalLinePaneViews = new WeakMap()),
            (this._timeAxisView = new l.LineToolVertLineTimeAxisView(this)),
            (this._paneViewFactory = null),
            this.properties()
              .childs()
              .extendLine.subscribe(this, () => e.lightUpdate()),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 63307))
              .then((t) => {
                ;(this._paneViewFactory = (i) =>
                  new t.VertLinePaneView(
                    this,
                    e,
                    i,
                    this._openTextEditor.bind(this),
                    this._closeTextEditor.bind(this),
                    this.onSelectionChange.bind(this),
                  )),
                  this._model.lightUpdate()
              }),
            this.setAdditionalCursorData(
              this._additionalCursorData.bind(this),
              this._positionToCoordinate.bind(this),
            )
        }
        destroy() {
          this.properties().childs().extendLine.unsubscribeAll(this),
            super.destroy()
        }
        pointsCount() {
          return 1
        }
        name() {
          return 'Vertical Line'
        }
        timeAxisViews() {
          return this.isSourceHidden()
            ? null
            : this.properties().childs().showTime.value()
              ? [this._timeAxisView]
              : null
        }
        updateAllViews(e) {
          super.updateAllViews(e), this._timeAxisView.update(e)
        }
        canHasAlert() {
          return !0
        }
        template() {
          const e = super.template()
          return (e.text = this.properties().childs().text.value()), e
        }
        isMultiPaneAvailable() {
          return !0
        }
        isMultiPaneEnabled() {
          return this.properties().childs().extendLine.value()
        }
        paneViews(e) {
          if (
            ((e = (0, n.ensureDefined)(e)),
            !this.isMultiPaneEnabled() && this._model.paneForSource(this) !== e)
          )
            return null
          if (
            null === this._getPaneViews(e) &&
            null !== this._paneViewFactory
          ) {
            const t = this._paneViewFactory(e)
            this._verticalLinePaneViews.set(e, t),
              this._setPaneViews([t], e, !0)
          }
          return super.paneViews(e)
        }
        priceAxisViews() {
          return null
        }
        priceAxisPoints() {
          return []
        }
        pointToScreenPoint(e) {
          const t = this._model.timeScale()
          if (t.isEmpty()) return null
          const i = t.indexToCoordinate(e.index)
          return new s.Point(i, 0)
        }
        convertYCoordinateToPriceForMoving(e) {
          return 0
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
          null != t &&
            (void 0 === t.textOrientation && (t.textOrientation = 'horizontal'),
            void 0 === t.extendLine && (t.extendLine = !1))
          const i = new r.DefaultProperty({
            defaultName: 'linetoolvertline',
            state: t,
            theme: e,
          })
          return this._configureProperties(i), i
        }
        _normalizePoint(e, t) {
          return (
            super._normalizePointWithoutOffset(e) ?? super._normalizePoint(e, t)
          )
        }
        _getAlertPlots() {
          const e = this._points[0],
            t = { index: e.index, price: e.price + 1 },
            i = this._linePointsToAlertPlot([e, t], null, !0, !0)
          return null === i ? [] : [i]
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            i.e(6406),
            i.e(3889),
            i.e(8009),
            i.e(8056),
            i.e(8537),
          ])
            .then(i.bind(i, 34353))
            .then((e) => e.VerticalLineDefinitionsViewModel)
        }
        _applyTemplateImpl(e) {
          super._applyTemplateImpl(e),
            this.properties()
              .childs()
              .text.setValue(e.text || '')
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.hasChild('text') || e.addChild('text', new o.Property('')),
            e.addExcludedKey('text', 1)
        }
        _additionalCursorData() {
          return (0, n.ensureDefined)(
            this._verticalLinePaneViews.get(
              (0, n.ensureNotNull)(this._model.paneForSource(this)),
            ),
          ).additionalCursorData()
        }
        _positionToCoordinate(e) {
          return (0, n.ensureDefined)(
            this._verticalLinePaneViews.get(
              (0, n.ensureNotNull)(this._model.paneForSource(this)),
            ),
          ).positionToCoordinate(e)
        }
      }
    },
  },
])
