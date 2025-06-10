;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8372],
  {
    24362: (e, t, i) => {
      i.d(t, {
        InplaceTextLineDataSource: () => T,
        InplaceTextUndoCommand: () => w,
      })
      var n = i(50279),
        s = i(50151),
        o = i(86441),
        r = i(19625),
        a = i(24377),
        l = i(11542),
        h = i(45126),
        c = i(88960),
        d = i(64147),
        u = i(60265),
        _ = i(29875),
        g = i(44672),
        p = i(85719)
      const P = {
          selectionColor: (0, r.getHexColorByName)('color-tv-blue-500'),
          cursorColor: (0, r.getHexColorByName)('color-black'),
        },
        x = {
          selectionColor: (0, r.getHexColorByName)('color-white'),
          cursorColor: (0, r.getHexColorByName)('color-white'),
        }
      class w extends u.UndoCommand {
        constructor(e, t, n, s) {
          super(
            new h.TranslatedString(
              'change {title} text',
              l.t(null, void 0, i(57122)),
            ).format({
              title: new h.TranslatedString(t.name(), t.translatedType()),
            }),
            !0,
            !p.lineToolsDoNotAffectChartInvalidation,
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
            (this._editableText = new d.WatchedValue('')),
            (this._activateTextEditingEl = null),
            (this._paneView = null),
            (this._selectionData = {}),
            (this._cursorPaneView = null),
            (this._cursorPosition = null),
            (this._editingOnCreation = !1),
            (this._editingActivationTime = null),
            this._editableText.subscribe(() => {
              this.updateAllViewsAndRedraw((0, g.sourceChangeEvent)(this.id()))
            }),
            (this._isDarkBackground = (0, c.combine)(
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
          return { ...(this._isDarkBackground.value() ? x : P) }
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
            ? (this._cursorPaneView.update((0, g.sourceChangeEvent)(this.id())),
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
            this.updateAllViewsAndRedraw((0, g.sourceChangeEvent)(this.id()))
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
            this.updateAllViewsAndRedraw((0, g.sourceChangeEvent)(this.id())))
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
            { forbidLineBreaks: _, maxLength: p } = this.editableTextStyle()
          this._editableText.setValue(c.value())
          const P = this.isFixed()
              ? (0, s.ensureDefined)(this.fixedPoint())
              : (0, s.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            x = {
              position: (0, o.point)(P.x, P.y),
              textInfo: t,
              placeholder: n,
              text: this._editableText,
              textColor: d,
              wordWrap: u,
              forbidLineBreaks: _,
              maxLength: p,
              onClose: r,
              onSelectionChange: a,
              onContextMenu: this.onContextMenu
                ? this.onContextMenu.bind(this)
                : void 0,
            }
          l(this._container, x),
            this.updateAllViewsAndRedraw((0, g.sourceChangeEvent)(this.id()))
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
            this.updateAllViewsAndRedraw((0, g.sourceChangeEvent)(this.id())))
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
          return new w(this._model, this, e, t)
        }
        _createDataSourceBackgroundColorWV() {
          return new d.WatchedValue(null).readonly().ownership()
        }
      }
    },
    83776: (e, t, i) => {
      i.r(t), i.d(t, { LineToolTrendAngle: () => c })
      var n = i(86441),
        s = i(50151),
        o = i(32679),
        r = i(24362),
        a = i(12988),
        l = i(44672)
      class h extends a.Property {
        constructor(e) {
          super(), (this._lineSource = e)
        }
        value() {
          return (
            Math.round((100 * this._lineSource.angle() * 180) / Math.PI) / 100
          )
        }
        setValue(e) {
          const t = ((e % 360) * Math.PI) / 180,
            i = this._lineSource.model().timeScale().barSpacing(),
            o = Math.cos(t),
            r = -Math.sin(t),
            a = this._lineSource.distance()
          let h
          if (1 !== Math.abs(r)) {
            const e = a * o,
              t = e % i,
              n = i - (e % i),
              s = Math.abs((e - t) / o),
              r = Math.abs((e + n) / o)
            h = Math.max(s, r)
          } else h = a
          const c = (0, s.ensureNotNull)(
              this._lineSource.pointToScreenPoint(this._lineSource.points()[0]),
            ).add(new n.Point(o * h, r * h)),
            d = (0, s.ensureNotNull)(this._lineSource.screenPointToPoint(c))
          this._lineSource.setPoint(1, d)
          const u = this._lineSource.model()
          u.updateSource(this._lineSource),
            this._lineSource.updateAllViews(
              (0, l.sourceChangeEvent)(this._lineSource.id()),
            ),
            u.updateSource(this._lineSource)
        }
        notifyChanged() {
          this._listeners.fire(this, '')
        }
      }
      class c extends r.InplaceTextLineDataSource {
        constructor(e, t, n, s) {
          const o =
            t ?? c.createProperties(e.backgroundTheme().spawnOwnership())
          super(e, o, n, s),
            (this._angle = 0),
            (this._distance = 0),
            o.addChild('angle', new h(this)),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 82595))
              .then(({ TrendAnglePaneView: t }) => {
                const i = [new t(this, e)]
                this._setPaneViews(i)
              })
        }
        isSynchronizable() {
          return !1
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Trend Angle'
        }
        angle() {
          return this._angle
        }
        distance() {
          return this._distance
        }
        addPoint(e, t) {
          const i = super.addPoint(e, t)
          return i && this._calculateAngle(), i
        }
        setLastPoint(e, t) {
          const i = super.setLastPoint(e, t)
          return this.points().length > 1 && this._calculateAngle(), i
        }
        axisPoints() {
          if (this.points().length < 2) return []
          const e = [this.points()[0]],
            t = (0, s.ensureNotNull)(this.pointToScreenPoint(this.points()[0])),
            i = Math.cos(this._angle) * this._distance,
            o = -Math.sin(this._angle) * this._distance,
            r = t.add(new n.Point(i, o)),
            a = (0, s.ensureNotNull)(this.screenPointToPoint(r))
          return e.push(a), e
        }
        timeAxisPoints() {
          return this.axisPoints()
        }
        priceAxisPoints() {
          return this.axisPoints()
        }
        setPoint(e, t, i) {
          super.setPoint(e, t, i),
            this.points().length > 1 && 1 === e && this._calculateAngle()
        }
        restoreData(e) {
          ;(this._angle = e.angle ?? 0), (this._distance = e.distance ?? 0)
        }
        state(e) {
          const t = super.state(e)
          return (t.angle = this._angle), (t.distance = this._distance), t
        }
        cloneData(e) {
          ;(this._angle = e.angle()), (this._distance = e.distance())
        }
        canHasAlert() {
          return !0
        }
        editableTextProperties() {
          ;(0, s.assert)(!1, 'unexpected method call')
        }
        snapTo45DegreesAvailable() {
          return !0
        }
        static createProperties(e, t) {
          t &&
            void 0 === t.showPercentPriceRange &&
            ((t.showPercentPriceRange = t.showPriceRange),
            (t.showPipsPriceRange = t.showPriceRange))
          const i = new o.DefaultProperty({
            defaultName: 'linetooltrendangle',
            state: t,
            theme: e,
          })
          return this._configureProperties(i), i
        }
        _getAlertPlots() {
          const e = this._linePointsToAlertPlot(
            this._points,
            null,
            this._properties.childs().extendLeft.value(),
            this._properties.childs().extendRight.value(),
          )
          return null === e ? [] : [e]
        }
        _calculateAngle() {
          const e = (0, s.ensureNotNull)(
            this.pointToScreenPoint(this.points()[0]),
          )
          let t = (0, s.ensureNotNull)(
            this.pointToScreenPoint(this.points()[1]),
          ).subtract(e)
          const i = t.length()
          i > 0
            ? ((t = t.normalized()),
              (this._angle = Math.acos(t.x)),
              t.y > 0 && (this._angle = -this._angle),
              (this._distance = i))
            : (this._angle = 0)
          this.properties().childs().angle.notifyChanged()
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            i.e(6406),
            i.e(3889),
            i.e(8009),
            i.e(8056),
            i.e(8537),
          ])
            .then(i.bind(i, 30574))
            .then((e) => e.TrendAngleDefinitionsViewModel)
        }
      }
    },
  },
])
