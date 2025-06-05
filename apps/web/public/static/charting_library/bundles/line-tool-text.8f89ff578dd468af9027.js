;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2312],
  {
    24362: (e, t, i) => {
      i.d(t, {
        InplaceTextLineDataSource: () => T,
        InplaceTextUndoCommand: () => P,
      })
      var n = i(50279),
        s = i(50151),
        o = i(86441),
        r = i(19625),
        a = i(24377),
        l = i(11542),
        d = i(45126),
        h = i(88960),
        c = i(64147),
        u = i(60265),
        _ = i(29875),
        p = i(44672),
        x = i(85719)
      const C = {
          selectionColor: (0, r.getHexColorByName)('color-tv-blue-500'),
          cursorColor: (0, r.getHexColorByName)('color-black'),
        },
        w = {
          selectionColor: (0, r.getHexColorByName)('color-white'),
          cursorColor: (0, r.getHexColorByName)('color-white'),
        }
      class P extends u.UndoCommand {
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
      class T extends _.LineDataSource {
        constructor(e, t, n, s) {
          super(e, t, n, s),
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
          return { ...(this._isDarkBackground.value() ? w : C) }
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
        async _openTextEditor(e, t, n, r, a) {
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
              textColor: c,
              wordWrap: u,
            } = this.editableTextProperties(),
            { forbidLineBreaks: _, maxLength: x } = this.editableTextStyle()
          this._editableText.setValue(h.value())
          const C = this.isFixed()
              ? (0, s.ensureDefined)(this.fixedPoint())
              : (0, s.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            w = {
              position: (0, o.point)(C.x, C.y),
              textInfo: t,
              placeholder: n,
              text: this._editableText,
              textColor: c,
              wordWrap: u,
              forbidLineBreaks: _,
              maxLength: x,
              onClose: r,
              onSelectionChange: a,
              onContextMenu: this.onContextMenu
                ? this.onContextMenu.bind(this)
                : void 0,
            }
          l(this._container, w),
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
          return new P(this._model, this, e, t)
        }
        _createDataSourceBackgroundColorWV() {
          return new c.WatchedValue(null).readonly().ownership()
        }
      }
    },
    424: (e, t, i) => {
      i.r(t), i.d(t, { LineToolText: () => p, LineToolTextAbsolute: () => x })
      var n,
        s = i(50151),
        o = i(86441),
        r = i(88960),
        a = i(42752),
        l = i(64147),
        d = i(12988),
        h = i(32679),
        c = i(73305),
        u = i(44672),
        _ = i(24362)
      !((e) => {
        e[(e.MinWidth = 100)] = 'MinWidth'
      })(n || (n = {}))
      class p extends _.InplaceTextLineDataSource {
        constructor(e, t, n, s) {
          const o =
            t ?? p.createProperties(e.backgroundTheme().spawnOwnership())
          super(e, o, n, s),
            (this._hasEditableCoordinates = new l.WatchedValue(!1)),
            (this._recalculatePointsOnCenter = !1),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 13589))
              .then(({ TextPaneView: t }) => {
                const i = this._recalculatePointsOnCenter
                  ? (e, t) => {
                      this._recalculatePointsOnCenter &&
                        this._recalculateCenterPosition(e, t)
                    }
                  : void 0
                ;(this._paneView = new t(
                  this,
                  e,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  i,
                  this._openTextEditor.bind(this),
                  this._closeTextEditor.bind(this),
                  this.onSelectionChange.bind(this),
                )),
                  this._setPaneViews([this._paneView])
              }),
            o
              .childs()
              .anchored.subscribe(this, this._onAnchoredChange.bind(this))
        }
        centerPosition() {
          this._recalculatePointsOnCenter = !0
        }
        setPoint(e, t, i) {
          if (1 !== e) return void super.setPoint(e, t, i)
          const n = this.properties().childs()
          let o
          if (n.wordWrapWidth.value()) {
            const e = this.model().timeScale()
            o = this.isFixed()
              ? (0, s.ensureDefined)(this.fixedPoint()).x
              : e.indexToCoordinate(this.points()[0].index)
            const i =
              e.indexToCoordinate(t.index) - o - ~~(n.fontsize.value() / 6)
            if (!isFinite(i)) return
            n.wordWrapWidth.setValue(Math.max(100, i))
          }
        }
        pointsCount() {
          return 1
        }
        name() {
          return 'Text'
        }
        editableTextProperties() {
          const e = this.properties().childs()
          return { text: e.text, textColor: e.color, wordWrap: e.wordWrap }
        }
        removeIfEditableTextIsEmpty() {
          return !0
        }
        activateEditingOnCreation() {
          return !0
        }
        template() {
          const e = super.template()
          return (e.text = this.properties().childs().text.value()), e
        }
        state(e) {
          const t = super.state(e)
          return (
            e && (t.state.barSpacing = this._model.timeScale().barSpacing()), t
          )
        }
        shouldBeRemovedOnDeselect() {
          return '' === this._properties.childs().text.value().trim()
        }
        isFixed() {
          return this._properties.childs().anchored.value()
        }
        anchorable() {
          return !0
        }
        static createProperties(e, t) {
          const i = new h.DefaultProperty({
            defaultName: this._defaultName(),
            state: t,
            theme: e,
          })
          return this._configureProperties(i), i
        }
        _applyTemplateImpl(e) {
          super._applyTemplateImpl(e),
            this.properties().childs().text.setValue(e.text)
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            i.e(6406),
            i.e(3889),
            i.e(8009),
            i.e(8056),
            i.e(8537),
          ])
            .then(i.bind(i, 27975))
            .then((e) => e.TextDefinitionsViewModel)
        }
        _createDataSourceBackgroundColorWV() {
          const { fillBackground: e, backgroundColor: t } =
            this.properties().childs()
          return (0, r.combine)(
            () => (e.value() ? t.value() : null),
            (0, a.convertPropertyToWatchedValue)(e).ownership(),
            (0, a.convertPropertyToWatchedValue)(t).ownership(),
          ).ownership()
        }
        static _defaultName() {
          return 'linetooltext'
        }
        static _anchoredDefaultValue() {
          return !1
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.hasChild('text') || e.addChild('text', new d.Property('')),
            e.hasChild('anchored') ||
              e.addChild(
                'anchored',
                new d.Property(this._anchoredDefaultValue()),
              ),
            e.addChild(
              'linesColors',
              new c.LineToolColorsProperty([e.childs().borderColor]),
            ),
            e.addChild(
              'textsColors',
              new c.LineToolColorsProperty([e.childs().color]),
            ),
            e.addExcludedKey('text', 1),
            e.addExcludedKey('anchored', 1),
            e.addExcludedKey('linesColors', 3),
            e.addExcludedKey('textsColors', 3)
        }
        _recalculateCenterPosition(e, t) {
          const i = this.isFixed()
              ? (0, s.ensureDefined)(this.fixedPoint())
              : (0, s.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            n = new o.Point(i.x - e / 2, i.y - t / 2),
            r = (0, s.ensureNotNull)(this.screenPointToPoint(n))
          this.setPoints([
            { ...r, interval: this._model.mainSeries().interval() },
          ]),
            this._normalizePoints(),
            this.createServerPoints(),
            this.updateAllViewsAndRedraw((0, u.sourceChangeEvent)(this.id()))
        }
      }
      class x extends p {
        constructor(e, t, i, n) {
          super(
            e,
            t ?? x.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            n,
          )
        }
        name() {
          return 'Anchored Text'
        }
        static _defaultName() {
          return 'linetooltextabsolute'
        }
        static _anchoredDefaultValue() {
          return !0
        }
      }
    },
  },
])
