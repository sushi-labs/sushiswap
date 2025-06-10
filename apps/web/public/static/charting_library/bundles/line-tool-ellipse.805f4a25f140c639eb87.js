;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7660],
  {
    59002: (t, e, i) => {
      i.r(e), i.d(e, { LineToolEllipse: () => _ })
      var s = i(50151),
        n = i(4652),
        o = i(86441),
        r = i(12988),
        a = i(32679),
        l = i(88960),
        h = i(42752),
        c = i(73305),
        d = i(24362),
        u = i(64147)
      class _ extends d.InplaceTextLineDataSource {
        constructor(t, e, s, n) {
          super(
            t,
            e ?? _.createProperties(t.backgroundTheme().spawnOwnership()),
            s,
            n,
          ),
            (this._hasEditableCoordinates = new u.WatchedValue(!1)),
            (this._radius2 = 0),
            (this._fakePoint = null),
            (this.version = 2),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 75649))
              .then(({ EllipsePaneView: t }) => {
                this._setPaneViews([
                  new t(
                    this,
                    this._model,
                    this._openTextEditor.bind(this),
                    this._closeTextEditor.bind(this),
                    this.onSelectionChange.bind(this),
                  ),
                ])
              })
        }
        snapTo45DegreesAvailable() {
          return !0
        }
        startChanging(t, e) {
          super.startChanging(t, e),
            (this._radius2 = (0, n.distanceToLine)(
              this._screenPoint(0),
              this._screenPoint(1),
              this._screenPoint(2),
            ).distance)
        }
        addPoint(t, e, i) {
          let s
          const n = 1 === this._points.length ? this._preparePoint(t, e) : t
          return (
            (s = this._addPointIntenal(n, e, i)),
            2 === this._points.length &&
              this._snapTo45DegreesApplicable(e) &&
              (s = this._addPointIntenal(this._calcPoint2(), e, i)),
            s && (this._fakePoint = null),
            s
          )
        }
        setPoint(t, e, i, r) {
          const a = { ...e },
            l = this._model.mainSeries().interval()
          switch (t) {
            case 0:
            case 1:
              const e = this._snapTo45DegreesApplicable(i)
              e && this.snapPoint45Degree(a, this._points[0 === t ? 1 : 0]),
                this._setPoint(t, { ...a, interval: l }),
                this._setPoint(2, {
                  ...this._calcPoint2(
                    void 0,
                    void 0,
                    e ? void 0 : this._radius2,
                  ),
                  interval: l,
                }),
                e &&
                  this._points[0].index === this._points[1].index &&
                  this._fixVerticalDiameterPoints(
                    this._points[0 === t ? 0 : 1],
                    this._points[0 === t ? 1 : 0],
                    this._points[2],
                  )
              break
            case 2:
            case 3:
              const r = this._screenPoint(0),
                h = this._screenPoint(1),
                c = (0, s.ensureNotNull)(this.pointToScreenPoint(a)),
                d = (0, n.distanceToLine)(r, h, c).distance,
                u = h.subtract(r),
                _ = r.add(h).scaled(0.5),
                p = new o.Point(-u.y, u.x).normalized(),
                P = _.add(p.scaled(d))
              this._setPoint(2, {
                ...(0, s.ensureNotNull)(this.screenPointToPoint(P)),
                interval: l,
              })
          }
          this._normalizePoints()
        }
        points() {
          const t = super.points()
          return 2 === t.length && this._fakePoint && t.push(this._fakePoint), t
        }
        pointsCount() {
          return 3
        }
        name() {
          return 'Ellipse'
        }
        migrateVersion(t, e, i) {
          if (1 === t && 2 === this._points.length) {
            const t = this._model.mainSeries().interval(),
              e = this._points[0].price,
              i = 0.5 * (this._points[0].price + this._points[1].price)
            ;(this._points[0] = {
              price: i,
              index: this._points[0].index,
              interval: t,
            }),
              (this._points[1] = {
                price: i,
                index: this._points[1].index,
                interval: t,
              }),
              this._points.push({
                price: e,
                index: this._points[0].index,
                interval: t,
              })
          }
          if (1 === t && 2 === this._timePoint.length) {
            const t = this._timePoint[0].price,
              e = 0.5 * (this._timePoint[0].price + this._timePoint[1].price)
            ;(this._timePoint[0].price = e), (this._timePoint[1].price = e)
            const i = {
              price: t,
              offset: this._timePoint[0].offset,
              time_t: this._timePoint[0].time_t,
              interval: this._properties.childs().interval.value(),
            }
            this._timePoint.push(i)
          }
        }
        template() {
          const t = super.template()
          return (t.text = this.properties().childs().text.value()), t
        }
        editableTextProperties() {
          const t = this.properties().childs()
          return {
            text: t.text,
            textColor: t.textColor,
            textVisible: t.showLabel,
          }
        }
        static createProperties(t, e) {
          const i = new a.DefaultProperty({
            defaultName: 'linetoolellipse',
            state: e,
            theme: t,
          })
          return this._configureProperties(i), i
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              i.e(6406),
              i.e(3889),
              i.e(8009),
              i.e(8056),
              i.e(8537),
            ]).then(i.bind(i, 99458))
          ).EllipseCircleDefinitionsViewModel
        }
        _preparePoint(t, e) {
          const i = this._preparePointInternal(t, this._points[0], e),
            s = this._points[1] ?? this._lastPoint
          return (
            this._snapTo45DegreesApplicable(e) &&
              this._points[0].index === s.index &&
              this._fixVerticalDiameterPoints(s, this._points[0], i),
            i
          )
        }
        _applyTemplateImpl(t) {
          super._applyTemplateImpl(t),
            this.properties().childs().text.setValue(t.text)
        }
        _createDataSourceBackgroundColorWV() {
          const { fillBackground: t, backgroundColor: e } =
            this.properties().childs()
          return (0, l.combine)(
            () => (t.value() ? e.value() : null),
            (0, h.convertPropertyToWatchedValue)(t).ownership(),
            (0, h.convertPropertyToWatchedValue)(e).ownership(),
          ).ownership()
        }
        static _configureProperties(t) {
          super._configureProperties(t),
            t.hasChild('text') || t.addChild('text', new r.Property('')),
            t.addChild(
              'linesColors',
              new c.LineToolColorsProperty([t.childs().color]),
            ),
            t.addChild(
              'textsColors',
              new c.LineToolColorsProperty(
                [t.childs().textColor],
                t.childs().showLabel,
              ),
            ),
            t.addExcludedKey('text', 1)
        }
        _preparePointInternal(t, e, i) {
          const n = { ...t }
          return (
            (this._fakePoint = null),
            this._snapTo45DegreesApplicable(i) &&
              1 === this._points.length &&
              (this.snapPoint45Degree(n, e),
              (this._fakePoint = this._calcPoint2(
                (0, s.ensureNotNull)(this.pointToScreenPoint(e)),
                (0, s.ensureNotNull)(this.pointToScreenPoint(n)),
              ))),
            n
          )
        }
        _fixVerticalDiameterPoints(t, e, i) {
          const n = (0, s.ensureNotNull)(this.pointToScreenPoint(t)),
            r = (0, s.ensureNotNull)(this.pointToScreenPoint(e)),
            a = this._model.timeScale(),
            l = a.indexToCoordinate(t.index),
            h = a.indexToCoordinate(i.index)
          let c = 2 * Math.abs(l - h)
          ;(c *= e.price > t.price ? 1 : -1),
            (t.price = (0, s.ensureNotNull)(
              this.screenPointToPoint(new o.Point(n.x, r.y + c)),
            ).price)
        }
        _calcPoint2(t, e, i) {
          ;(t = t ?? this._screenPoint(0)), (e = e ?? this._screenPoint(1))
          const n = Math.atan2(e.y - t.y, e.x - t.x) + Math.PI / 2
          i = i ?? e.subtract(t).length() / 2
          const r = t
            .add(e)
            .scaled(0.5)
            .add(new o.Point(Math.cos(n) * i, Math.sin(n) * i))
          return (0, s.ensureNotNull)(this.screenPointToPoint(r))
        }
        _screenPoint(t) {
          return (0, s.ensureNotNull)(this.pointToScreenPoint(this._points[t]))
        }
      }
    },
    24362: (t, e, i) => {
      i.d(e, {
        InplaceTextLineDataSource: () => m,
        InplaceTextUndoCommand: () => T,
      })
      var s = i(50279),
        n = i(50151),
        o = i(86441),
        r = i(19625),
        a = i(24377),
        l = i(11542),
        h = i(45126),
        c = i(88960),
        d = i(64147),
        u = i(60265),
        _ = i(29875),
        p = i(44672),
        P = i(85719)
      const x = {
          selectionColor: (0, r.getHexColorByName)('color-tv-blue-500'),
          cursorColor: (0, r.getHexColorByName)('color-black'),
        },
        g = {
          selectionColor: (0, r.getHexColorByName)('color-white'),
          cursorColor: (0, r.getHexColorByName)('color-white'),
        }
      class T extends u.UndoCommand {
        constructor(t, e, s, n) {
          super(
            new h.TranslatedString(
              'change {title} text',
              l.t(null, void 0, i(57122)),
            ).format({
              title: new h.TranslatedString(e.name(), e.translatedType()),
            }),
            !0,
            !P.lineToolsDoNotAffectChartInvalidation,
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
      class m extends _.LineDataSource {
        constructor(t, e, s, n) {
          super(t, e, s, n),
            (this._container = null),
            (this._editableText = new d.WatchedValue('')),
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
            (this._isDarkBackground = (0, c.combine)(
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
          return { ...(this._isDarkBackground.value() ? g : x) }
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
        async _openTextEditor(t, e, s, r, a) {
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
              text: c,
              textColor: d,
              wordWrap: u,
            } = this.editableTextProperties(),
            { forbidLineBreaks: _, maxLength: P } = this.editableTextStyle()
          this._editableText.setValue(c.value())
          const x = this.isFixed()
              ? (0, n.ensureDefined)(this.fixedPoint())
              : (0, n.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            g = {
              position: (0, o.point)(x.x, x.y),
              textInfo: e,
              placeholder: s,
              text: this._editableText,
              textColor: d,
              wordWrap: u,
              forbidLineBreaks: _,
              maxLength: P,
              onClose: r,
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
          return new T(this._model, this, t, e)
        }
        _createDataSourceBackgroundColorWV() {
          return new d.WatchedValue(null).readonly().ownership()
        }
      }
    },
  },
])
