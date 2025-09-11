;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [688],
  {
    62828: (t, e, i) => {
      i.r(e), i.d(e, { LineToolCallout: () => c })
      var s,
        n = i(88960),
        r = i(94784),
        o = i(12988),
        a = i(32679),
        l = i(42752),
        h = i(73305),
        d = i(24362)
      !((t) => {
        ;(t[(t.PointsCount = 2)] = 'PointsCount'), (t.Name = 'Callout')
      })(s || (s = {}))
      class c extends d.InplaceTextLineDataSource {
        constructor(t, e, s, n) {
          super(
            t,
            e || c.createProperties(t.backgroundTheme().spawnOwnership()),
            s,
            n,
          ),
            (this._barOffset = 0),
            (this._dragStartLeftEdgeIndex = Number.NaN),
            (this._timeScale = t.timeScale()),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 31463))
              .then((t) => {
                ;(this._paneView = new t.CalloutPaneView(
                  this,
                  this._model,
                  this._openTextEditor.bind(this),
                  this._closeTextEditor.bind(this),
                  this.onSelectionChange.bind(this),
                )),
                  this._setPaneViews([this._paneView])
              })
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Callout'
        }
        getBarOffset() {
          return this._barOffset
        }
        editableTextProperties() {
          const t = this.properties().childs()
          return { text: t.text, textColor: t.color, wordWrap: t.wordWrap }
        }
        removeIfEditableTextIsEmpty() {
          return !0
        }
        activateEditingOnCreation() {
          return !0
        }
        shouldBeRemovedOnDeselect() {
          const t = this._properties.childs().text.value().trim()
          return this._points.length === this.pointsCount() && '' === t
        }
        addPoint(t) {
          const e = super.addPoint(t)
          return e && this._calculateBarOffset(), e
        }
        setLastPoint(t) {
          const e = super.setLastPoint(t)
          return 2 === this.points().length && this._calculateBarOffset(), e
        }
        setPoint(t, e) {
          switch (t) {
            case 0:
              super.setPoint(t, e), this._calculateBarOffset()
              break
            case 1:
              const i = this.properties().childs()
              if (!i.wordWrapWidth) return
              const s = this._points,
                n = this._dragStartLeftEdgeIndex,
                r = Math.round((e.index - n) / 2),
                o = this._model.mainSeries().interval()
              if (isFinite(n) && isFinite(r)) {
                ;(s[1] = { index: n + r, price: s[1].price, interval: o }),
                  this._calculateBarOffset(),
                  this._normalizePoints()
                const t =
                  this._timeScale.indexToCoordinate(n + 2 * r) -
                  this._timeScale.indexToCoordinate(n) -
                  8 -
                  2
                if (!isFinite(t)) return
                i.wordWrapWidth.setValue(Math.max(100, t))
                break
              }
              ;(s[1] = { ...e, interval: o }),
                this._calculateBarOffset(),
                this._normalizePoints()
          }
        }
        setPoints(t) {
          super.setPoints(t)
          const e = this.properties().childs()
          if (!e.wordWrapWidth) return
          const i = this._dragStartLeftEdgeIndex,
            s = Math.round((t[1].index - i) / 2)
          if (
            (this._calculateBarOffset(),
            this._normalizePoints(),
            isFinite(i) && isFinite(s))
          ) {
            const t =
              this._timeScale.indexToCoordinate(i + 2 * s) -
              this._timeScale.indexToCoordinate(i) -
              8 -
              2
            if (!isFinite(t)) return
            e.wordWrapWidth.setValue(Math.max(100, t))
          }
        }
        move(t, e, i) {
          super.move(t, e, i), this._calculateBarOffset()
        }
        state(t) {
          const e = super.state(t)
          return (e.barOffset = this._barOffset), e
        }
        restoreData(t) {
          t.barOffset
            ? (this._barOffset = t.barOffset)
            : this._calculateBarOffset(),
            this.calculatePoint2()
        }
        setPriceScale(t) {
          super.setPriceScale(t), t && t.priceRange() && this.calculatePoint2()
        }
        template() {
          const t = super.template()
          return (t.text = this.properties().childs().text.value()), t
        }
        calculatePoint2() {
          if (
            this._model.lineBeingEdited() === this ||
            this._model.sourcesBeingMoved().includes(this)
          )
            return
          if (this._points.length < 2) return
          const [t, e] = this.points()
          this._points[1] = {
            price: e.price,
            index: t.index + this._barOffset,
            interval: this._model.mainSeries().interval(),
          }
        }
        static createProperties(t, e) {
          const i = new a.DefaultProperty({
            defaultName: 'linetoolcallout',
            state: e,
            theme: t,
          })
          return this._configureProperties(i), i
        }
        _applyTemplateImpl(t) {
          this.properties().childs().text.setValue(t.text),
            super._applyTemplateImpl(t)
        }
        _correctPoints(t, e) {
          if (
            t.length < this.pointsCount() ||
            null === this._currentMovingPoint ||
            void 0 === this._currentMovingPoint.logical ||
            null === this._startMovingPoint ||
            void 0 === this._startMovingPoint.logical
          )
            return !1
          const i =
              this._currentMovingPoint.logical.index -
              this._startMovingPoint.logical.index,
            s =
              this._currentMovingPoint.logical.price -
              this._startMovingPoint.logical.price,
            n = t[1]
          return (n.index = n.index + i), (n.price += s), (t[1] = n), !0
        }
        _onPointsetUpdated(t) {
          super._onPointsetUpdated(t),
            0 !== t.length &&
              (1 === this._points.length && this._points.push(this._points[0]),
              (this._dragStartLeftEdgeIndex = this.points()[1].index))
        }
        _normalizePoint(t, e) {
          return 0 === e
            ? (super._normalizePointWithoutOffset(t) ??
                super._normalizePoint(t, e))
            : super._normalizePoint(t, e)
        }
        _createDataSourceBackgroundColorWV() {
          const t = (0, r.generateColorCached)(),
            { backgroundColor: e, transparency: i } = this.properties().childs()
          return (0, n.combine)(
            () => t(e.value(), i.value()),
            (0, l.convertPropertyToWatchedValue)(e).ownership(),
            (0, l.convertPropertyToWatchedValue)(i).ownership(),
          ).ownership()
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              i.e(6406),
              i.e(3889),
              i.e(8009),
              i.e(8056),
              i.e(8537),
            ]).then(i.bind(i, 29908))
          ).CalloutDefinitionsViewModel
        }
        static _configureProperties(t) {
          super._configureProperties(t),
            t.hasChild('text') || t.addChild('text', new o.Property('')),
            t.addExcludedKey('text', 1),
            t.addChild(
              'textsColors',
              new h.LineToolColorsProperty([t.childs().color]),
            )
        }
        _calculateBarOffset() {
          this.points().length > 1 &&
            (this._barOffset = this.points()[1].index - this.points()[0].index)
        }
      }
    },
    24362: (t, e, i) => {
      i.d(e, {
        InplaceTextLineDataSource: () => f,
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
      const g = {
          selectionColor: (0, o.getHexColorByName)('color-tv-blue-500'),
          cursorColor: (0, o.getHexColorByName)('color-black'),
        },
        P = {
          selectionColor: (0, o.getHexColorByName)('color-white'),
          cursorColor: (0, o.getHexColorByName)('color-white'),
        }
      class m extends u.UndoCommand {
        constructor(t, e, s, n) {
          super(
            new h.TranslatedString(
              'change {title} text',
              l.t(null, void 0, i(57122)),
            ).format({
              title: new h.TranslatedString(e.name(), e.translatedType()),
            }),
            !0,
            !x.lineToolsDoNotAffectChartInvalidation,
          ),
            (this._sourceId = e.id()),
            (this._model = t),
            (this._oldValue = s),
            (this._newValue = n),
            (this._changeVisibility =
              !1 === e.editableTextProperties().textVisible?.value())
        }
        redo() {
          const t = this._source()
          this._textProperty(t).setValue(this._newValue),
            this._changeVisibility &&
              this._textVisibilityProperty(t)?.setValue(!0)
        }
        undo() {
          const t = this._source()
          this._textProperty(t).setValue(this._oldValue),
            this._changeVisibility &&
              this._textVisibilityProperty(t)?.setValue(!1)
        }
        _textProperty(t) {
          return t.editableTextProperties().text
        }
        _textVisibilityProperty(t) {
          return t.editableTextProperties().textVisible
        }
        _source() {
          return (0, n.ensureNotNull)(
            this._model.dataSourceForId(this._sourceId),
          )
        }
      }
      class f extends _.LineDataSource {
        constructor(t, e, s, n) {
          super(t, e, s, n),
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
              (t, e) => {
                if (null === e) return this._model.dark().value()
                const i = (0, a.blendRgba)(
                  (0, a.parseRgba)(t),
                  (0, a.parseRgba)(e),
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
              .then((e) => {
                ;(this._cursorPaneView = new e.InplaceTextCursorPaneView(
                  this,
                  t,
                )),
                  this._additionalCursorDataGetters &&
                    (this._cursorPaneView.setAdditionalCursorData(
                      ...this._additionalCursorDataGetters,
                    ),
                    null !== this._cursorPosition &&
                      (this._cursorPaneView.setCursorPosition(
                        this._cursorPosition,
                      ),
                      t.updateSource(this)))
              })
        }
        destroy() {
          this._isDarkBackground.destroy(),
            this._editableText.unsubscribe(),
            this._closeTextEditor(),
            super.destroy()
        }
        editableTextStyle() {
          return { ...(this._isDarkBackground.value() ? P : g) }
        }
        removeIfEditableTextIsEmpty() {
          return !1
        }
        activateEditingOnCreation() {
          return !1
        }
        topPaneViews(t) {
          return t.hasDataSource(this) &&
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
        activateTextEditingOn(t, e) {
          ;(this._activateTextEditingEl = t),
            (this._editingOnCreation = !!e),
            (this._editingActivationTime = performance.now()),
            this.updateAllViewsAndRedraw((0, p.sourceChangeEvent)(this.id()))
        }
        deactivateTextEditing() {
          this._closeTextEditor()
        }
        textEditingActivationTime() {
          return this._editingActivationTime
        }
        onSelectionChange(t) {
          const e = {}
          if (void 0 !== t) {
            const { start: i, end: s } = t
            i === s
              ? (e.cursorPosition = i)
              : (e.selectionRange = [Math.min(i, s), Math.max(i, s)])
          }
          ;(0, s.default)(e, this._selectionData) ||
            ((this._selectionData = e),
            this._paneViews.forEach((t) => {
              t.forEach((t) => {
                'setSelectionRange' in t &&
                  t.setSelectionRange(e.selectionRange)
              })
            }),
            this._cursorPaneView
              ? this._cursorPaneView.setCursorPosition(e.cursorPosition)
              : (this._cursorPosition = e.cursorPosition ?? null),
            this.updateAllViewsAndRedraw((0, p.sourceChangeEvent)(this.id())))
        }
        setAdditionalCursorData(t, e) {
          this._cursorPaneView
            ? this._cursorPaneView.setAdditionalCursorData(t, e)
            : (this._additionalCursorDataGetters = [t, e])
        }
        _updateAllPaneViews(t) {
          super._updateAllPaneViews(t), this._cursorPaneView?.update(t)
        }
        async _openTextEditor(t, e, s, o, a) {
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
            t.appendChild(this._container)
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
          const g = this.isFixed()
              ? (0, n.ensureDefined)(this.fixedPoint())
              : (0, n.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            P = {
              position: (0, r.point)(g.x, g.y),
              textInfo: e,
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
          l(this._container, P),
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
          const t = this.editableTextProperties().text.value(),
            e = this._editableText.value()
          t !== e &&
            (this._editingOnCreation &&
              this.editableTextProperties().text.setValue(e),
            this._model
              .undoModel()
              .undoHistory()
              .pushUndoCommand(this._changeEditableTextUndoCommand(t, e)))
        }
        _changeEditableTextUndoCommand(t, e) {
          return new m(this._model, this, t, e)
        }
        _createDataSourceBackgroundColorWV() {
          return new c.WatchedValue(null).readonly().ownership()
        }
      }
    },
  },
])
