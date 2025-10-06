;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9116, 1277],
  {
    32211: (e, t, i) => {
      i.d(t, {
        InplaceTextLineSourcePaneView: () => _,
        inplaceEditHandlers: () => u,
      })
      var n = i(50151),
        o = i(11542),
        s = i(19063),
        r = i(91676),
        a = i(27916),
        l = i(56468),
        d = i(69186),
        h = i(72791)
      const c = o.t(null, void 0, i(6060))
      function u(e) {
        const t = (t, i) => {
          i.sourceWasSelected && e(t)
        }
        return {
          areaName: l.AreaName.Text,
          executeDefaultAction: {
            doubleClickHandler: !0,
            doubleTapHandler: !0,
          },
          clickHandler: t,
          tapHandler: t,
        }
      }
      class _ extends a.LineSourcePaneView {
        constructor(e, t, i, n, o) {
          super(e, t),
            (this._textInfo = new r.WatchedObject({})),
            (this._isTextEditModeActivated = !1),
            (this._textWasEdited = !1),
            (this._showTextEditor = i),
            (this._hideTextEditor = n),
            (this._onSelectionChangeCb = o),
            (this._editableTextSpawn = this._source.editableText().spawn()),
            this._editableTextSpawn.subscribe(() =>
              this._updateTextWasEditable(),
            )
        }
        destroy() {
          this._editableTextSpawn.destroy()
        }
        setSelectionRange(e) {
          this._selectionRange = e
        }
        closeTextEditor() {
          ;(this._textWasEdited = !1),
            (this._isTextEditModeActivated = !1),
            this._hideTextEditor?.()
        }
        _placeHolderMode(e) {
          return (
            !this._isTextEditMode() &&
            this._model.hoveredSource() === this._source &&
            0 === this._model.hoveredSourceOrigin() &&
            (!e ||
              this._model.lastHittestData()?.areaName !==
                l.AreaName.AnchorPoint) &&
            !(0, d.lastMouseOrTouchEventInfo)().isTouch &&
            !this._source.editableTextProperties().text.value() &&
            this._model.selection().isSelected(this._source)
          )
        }
        _updateTextWasEditable() {
          this._textWasEdited = !0
        }
        _textCursorType() {
          return this._model.selection().isSelected(this._source) &&
            !this._model.sourcesBeingMoved().includes(this._source)
            ? h.PaneCursorType.Text
            : void 0
        }
        _updateInplaceText(e) {
          this._textInfo.setValue(e),
            this._model.selection().isSelected(this._source) ||
              this.closeTextEditor()
          const t = this._source.textEditingEl()
          t && this._activateEditMode(t)
        }
        _tryActivateEditMode(e, t) {
          const i = (0, n.ensureNotNull)(
            t.target instanceof HTMLElement
              ? t.target.closest('.chart-gui-wrapper')
              : null,
          )
          this._activateEditMode(i)
        }
        _isTextEditMode() {
          return this._isTextEditModeActivated
        }
        _textData() {
          return this._text() || (this._textWasEdited ? '​' : c)
        }
        _textColor() {
          const e = this._source.editableTextProperties().textColor.value()
          return this._text() ? e : (0, s.generateColor)(e, 50, !0)
        }
        _inplaceTextHighlight() {
          const e = this._source.editableTextStyle()
          return this._selectionRange
            ? {
                selectionHighlight: {
                  start: this._selectionRange[0],
                  end: this._selectionRange[1],
                  color: (0, s.generateColor)(e.selectionColor, 80, !0),
                },
              }
            : {}
        }
        _activateEditMode(e) {
          this._showTextEditor?.(
            e,
            this._textInfo,
            c,
            this.closeTextEditor.bind(this),
            (e) => this._onSelectionChangeCb?.(e),
          ),
            (this._isTextEditModeActivated = !0)
        }
        _text() {
          return this._isTextEditMode()
            ? this._source.editableText().value()
            : this._source.editableTextProperties().text.value()
        }
      }
    },
    24362: (e, t, i) => {
      i.d(t, {
        InplaceTextLineDataSource: () => b,
        InplaceTextUndoCommand: () => P,
      })
      var n = i(50279),
        o = i(50151),
        s = i(86441),
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
      const g = {
          selectionColor: (0, r.getHexColorByName)('color-tv-blue-500'),
          cursorColor: (0, r.getHexColorByName)('color-black'),
        },
        T = {
          selectionColor: (0, r.getHexColorByName)('color-white'),
          cursorColor: (0, r.getHexColorByName)('color-white'),
        }
      class P extends u.UndoCommand {
        constructor(e, t, n, o) {
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
            (this._newValue = o),
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
          return (0, o.ensureNotNull)(
            this._model.dataSourceForId(this._sourceId),
          )
        }
      }
      class b extends _.LineDataSource {
        constructor(e, t, n, o) {
          super(e, t, n, o),
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
          return { ...(this._isDarkBackground.value() ? T : g) }
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
          const g = this.isFixed()
              ? (0, o.ensureDefined)(this.fixedPoint())
              : (0, o.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            T = {
              position: (0, s.point)(g.x, g.y),
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
          l(this._container, T),
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
    27916: (e, t, i) => {
      i.d(t, {
        LineSourcePaneView: () => x,
        createLineSourcePaneViewPoint: () => p,
        thirdPointCursorType: () => _,
      })
      var n = i(19625),
        o = i(50151),
        s = i(69186),
        r = i(56468),
        a = i(11064),
        l = i(36036),
        d = i(72791),
        h = i(17330)
      const c = n.colorsPalette['color-tv-blue-600']
      var u
      function _(e, t) {
        const i = t.x - e.x,
          n = t.y - e.y,
          o = Math.abs(Math.atan2(i, n))
        return o > Math.PI / 4 && o < (3 * Math.PI) / 4
          ? d.PaneCursorType.VerticalResize
          : d.PaneCursorType.HorizontalResize
      }
      function p(e, t) {
        return (e.pointIndex = t), e
      }
      !((e) => {
        ;(e[(e.RegularAnchorRadius = 6)] = 'RegularAnchorRadius'),
          (e[(e.TouchAnchorRadius = 13)] = 'TouchAnchorRadius'),
          (e[(e.RegularStrokeWidth = 1)] = 'RegularStrokeWidth'),
          (e[(e.TouchStrokeWidth = 3)] = 'TouchStrokeWidth'),
          (e[(e.RegularSelectedStrokeWidth = 3)] =
            'RegularSelectedStrokeWidth'),
          (e[(e.TouchSelectedStrokeWidth = 0)] = 'TouchSelectedStrokeWidth')
      })(u || (u = {}))
      class x {
        constructor(e, t) {
          ;(this._invalidated = !0),
            (this._points = []),
            (this._middlePoint = null),
            (this._selectionRenderers = []),
            (this._lineAnchorRenderers = []),
            (this._source = e),
            (this._model = t)
        }
        priceToCoordinate(e) {
          const t = this._source.priceScale()
          if (null === t) return null
          const i = this._source.ownerSource(),
            n = null !== i ? i.firstValue() : null
          return null === n ? null : t.priceToCoordinate(e, n)
        }
        anchorColor() {
          return c
        }
        isHoveredSource() {
          return this._source === this._model.hoveredSource()
        }
        isSelectedSource() {
          return this._model.selection().isSelected(this._source)
        }
        isBeingEdited() {
          return this._model.lineBeingEdited() === this._source
        }
        isEditMode() {
          return !this._model.isSnapshot()
        }
        areAnchorsVisible() {
          return (
            ((this.isHoveredSource() && !this.isLocked()) ||
              this.isSelectedSource()) &&
            this.isEditMode()
          )
        }
        update() {
          this._invalidated = !0
        }
        isLocked() {
          return Boolean(this._source.isLocked && this._source.isLocked())
        }
        addAnchors(e, t = {}) {
          let i = this._getPoints()
          this._model.lineBeingCreated() === this._source &&
            (i = i.slice(0, -1))
          const n = this._source.points(),
            o = i.map((e, t) => {
              const i = n[t],
                o = (0, l.lineSourcePaneViewPointToLineAnchorPoint)(e)
              return (
                i && ((o.snappingPrice = i.price), (o.snappingIndex = i.index)),
                o
              )
            })
          e.append(this.createLineAnchor({ ...t, points: o }, 0))
        }
        createLineAnchor(e, t) {
          const i = e.points.map((e) => e.point)
          if (this.isLocked()) {
            const n = this._getSelectionRenderer(t)
            return (
              n.setData({
                bgColors: this._lineAnchorColors(i),
                points: e.points,
                visible: this.areAnchorsVisible(),
                hittestResult: r.HitTarget.Regular,
                barSpacing: this._model.timeScale().barSpacing(),
              }),
              n
            )
          }
          const n = (0, s.lastMouseOrTouchEventInfo)().isTouch,
            o = this._getLineAnchorRenderer(t),
            a = this.isHoveredSource()
              ? (this._model.lastHittestData()?.pointIndex ?? null)
              : null
          return (
            o.setData({
              ...e,
              color: this.anchorColor(),
              backgroundColors: this._lineAnchorColors(i),
              hoveredPointIndex: a,
              linePointBeingEdited: this.isBeingEdited()
                ? this._model.linePointBeingEdited()
                : null,
              radius: this._anchorRadius(),
              strokeWidth: n ? u.TouchStrokeWidth : u.RegularStrokeWidth,
              selected: this.isSelectedSource(),
              selectedStrokeWidth: n
                ? u.TouchSelectedStrokeWidth
                : u.RegularSelectedStrokeWidth,
              visible: this.areAnchorsVisible(),
              clickHandler: e.clickHandler,
            }),
            o
          )
        }
        _anchorRadius() {
          return (0, s.lastMouseOrTouchEventInfo)().isTouch
            ? u.TouchAnchorRadius
            : u.RegularAnchorRadius
        }
        _lineAnchorColors(e) {
          const t = (0, o.ensureNotNull)(
            this._model.paneForSource(this._source),
          ).height()
          return e.map((e) =>
            this._model.backgroundColorAtYPercentFromTop(e.y / t),
          )
        }
        _updateImpl(e) {
          this._points = []
          this._model.timeScale().isEmpty() ||
            (this._validatePriceScale() &&
              (this._source.points().forEach((e, t) => {
                const i = this._source.pointToScreenPoint(e)
                i && this._points.push(p(i, t))
              }),
              2 === this._points.length &&
                (this._middlePoint = this._source.calcMiddlePoint(
                  this._points[0],
                  this._points[1],
                )),
              (this._invalidated = !1)))
        }
        _validatePriceScale() {
          const e = this._source.priceScale()
          return null !== e && !e.isEmpty()
        }
        _getSource() {
          return this._source
        }
        _getPoints() {
          return this._points
        }
        _getModel() {
          return this._model
        }
        _height() {
          const e = this._source.priceScale()
          return null !== e ? e.height() : 0
        }
        _width() {
          return this._model.timeScale().width()
        }
        _needLabelExclusionPath(e, t) {
          const i = this._source.properties().childs()
          return (
            'middle' === (t ?? i.vertLabelsAlign.value()) &&
            (0, h.needTextExclusionPath)(e)
          )
        }
        _addAlertRenderer(
          e,
          t,
          i = this._source.properties().linecolor.value(),
        ) {}
        _getAlertRenderer(
          e,
          t = this._source.properties().linecolor.value(),
          i,
        ) {
          return null
        }
        _getSelectionRenderer(e) {
          while (this._selectionRenderers.length <= e)
            this._selectionRenderers.push(new a.SelectionRenderer())
          return this._selectionRenderers[e]
        }
        _getLineAnchorRenderer(e) {
          while (this._lineAnchorRenderers.length <= e)
            this._lineAnchorRenderers.push(new l.LineAnchorRenderer())
          return this._lineAnchorRenderers[e]
        }
      }
    },
    36036: (e, t, i) => {
      i.d(t, {
        LineAnchorRenderer: () => T,
        lineSourcePaneViewPointToLineAnchorPoint: () => P,
        mapLineSourcePaneViewPointToLineAnchorPoint: () => b,
      })
      var n = i(86441),
        o = i(34026),
        s = i(50151),
        r = i(37743),
        a = i(37265),
        l = i(56468),
        d = i(72791),
        h = i(61993),
        c = i(30125)
      function u(e, t, i, n) {
        const { point: o } = t,
          s = i + n / 2
        ;(0, r.drawRoundRect)(e, o.x - s, o.y - s, 2 * s, 2 * s, (i + n) / 2),
          e.closePath(),
          (e.lineWidth = n)
      }
      function _(e, t, i, n) {
        ;(e.globalAlpha = 0.2), u(e, t, i, n), e.stroke(), (e.globalAlpha = 1)
      }
      function p(e, t, i, n) {
        u(e, t, i - n, n), e.fill(), e.stroke()
      }
      function x(e, t, i, n) {
        const { point: o } = t
        ;(e.globalAlpha = 0.2),
          e.beginPath(),
          e.arc(o.x, o.y, i + n / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = n),
          e.stroke(),
          (e.globalAlpha = 1)
      }
      function g(e, t, i, n) {
        const { point: o } = t
        e.beginPath(),
          e.arc(o.x, o.y, i - n / 2, 0, 2 * Math.PI, !0),
          e.closePath(),
          (e.lineWidth = n),
          e.fill(),
          e.stroke()
      }
      class T extends c.BitmapCoordinatesPaneRenderer {
        constructor(e) {
          super(), (this._data = e ?? null)
        }
        setData(e) {
          this._data = e
        }
        hitTest(e) {
          if (null === this._data || this._data.disableInteractions) return null
          const { radius: t, points: i } = this._data,
            n = t + (0, h.interactionTolerance)().anchor
          for (const t of i) {
            if (t.point.subtract(e).length() <= n)
              return new l.HitTestResult(
                t.hitTarget ?? l.HitTarget.ChangePoint,
                {
                  areaName: l.AreaName.AnchorPoint,
                  pointIndex: t.pointIndex,
                  cursorType: t.cursorType ?? d.PaneCursorType.Default,
                  activeItem: t.activeItem,
                  snappingPrice: t.snappingPrice,
                  snappingIndex: t.snappingIndex,
                  nonDiscreteIndex: t.nonDiscreteIndex,
                  possibleMovingDirections: t.possibleMovingDirections,
                  clickHandler: this._data.clickHandler,
                  tapHandler: this._data.clickHandler,
                },
              )
          }
          return null
        }
        doesIntersectWithBox(e) {
          return (
            null !== this._data &&
            this._data.points.some((t) => (0, o.pointInBox)(t.point, e))
          )
        }
        _drawImpl(e) {
          if (null === this._data || !this._data.visible) return
          const t = [],
            i = [],
            n = [],
            o = []
          for (let e = 0; e < this._data.points.length; ++e) {
            const s = this._data.points[e],
              r = this._data.backgroundColors[e]
            s.square ? (t.push(s), i.push(r)) : (n.push(s), o.push(r))
          }
          t.length && this._drawPoints(e, t, i, p, _),
            n.length && this._drawPoints(e, n, o, g, x)
        }
        _drawPoints(e, t, i, o, r) {
          const {
              context: l,
              horizontalPixelRatio: d,
              verticalPixelRatio: h,
            } = e,
            c = (0, s.ensureNotNull)(this._data),
            u = c.radius
          let _ = Math.max(1, Math.floor((c.strokeWidth || 2) * d))
          c.selected && (_ += Math.max(1, Math.floor(d / 2)))
          const p = Math.max(1, Math.floor(d))
          let x = Math.round(u * d * 2)
          x % 2 != p % 2 && (x += 1)
          const g = (p % 2) / 2
          l.strokeStyle = c.color
          for (let e = 0; e < t.length; ++e) {
            const s = t[e]
            if (
              !(
                (0, a.isInteger)(s.pointIndex) &&
                c.linePointBeingEdited === s.pointIndex
              )
            ) {
              l.fillStyle = i[e]
              if (
                (o(
                  l,
                  {
                    ...s,
                    point: new n.Point(
                      Math.round(s.point.x * d) + g,
                      Math.round(s.point.y * h) + g,
                    ),
                  },
                  x / 2,
                  _,
                ),
                !c.disableInteractions)
              ) {
                if (
                  null !== c.hoveredPointIndex &&
                  s.pointIndex === c.hoveredPointIndex
                ) {
                  const e = Math.max(1, Math.floor(c.selectedStrokeWidth * d))
                  let t = Math.round(u * d * 2)
                  t % 2 != p % 2 && (t += 1)
                  r(
                    l,
                    {
                      ...s,
                      point: new n.Point(
                        Math.round(s.point.x * d) + g,
                        Math.round(s.point.y * h) + g,
                      ),
                    },
                    t / 2,
                    e,
                  )
                }
              }
            }
          }
        }
      }
      function P(e, t = e.pointIndex, i, n, o, s, r, a, l, d) {
        return {
          point: e,
          pointIndex: t,
          cursorType: i,
          square: n,
          hitTarget: o,
          snappingPrice: s,
          snappingIndex: r,
          nonDiscreteIndex: a,
          activeItem: l,
          possibleMovingDirections: d,
        }
      }
      function b(e) {
        return P(e)
      }
    },
  },
])
