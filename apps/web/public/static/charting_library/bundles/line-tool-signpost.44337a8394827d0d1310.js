;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4674],
  {
    24362: (e, t, i) => {
      i.d(t, {
        InplaceTextLineDataSource: () => m,
        InplaceTextUndoCommand: () => C,
      })
      var n = i(50279),
        o = i(50151),
        s = i(86441),
        r = i(19625),
        a = i(24377),
        l = i(11542),
        c = i(45126),
        d = i(88960),
        h = i(64147),
        u = i(60265),
        p = i(29875),
        _ = i(44672),
        x = i(85719)
      const P = {
          selectionColor: (0, r.getHexColorByName)('color-tv-blue-500'),
          cursorColor: (0, r.getHexColorByName)('color-black'),
        },
        g = {
          selectionColor: (0, r.getHexColorByName)('color-white'),
          cursorColor: (0, r.getHexColorByName)('color-white'),
        }
      class C extends u.UndoCommand {
        constructor(e, t, n, o) {
          super(
            new c.TranslatedString(
              'change {title} text',
              l.t(null, void 0, i(57122)),
            ).format({
              title: new c.TranslatedString(t.name(), t.translatedType()),
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
      class m extends p.LineDataSource {
        constructor(e, t, n, o) {
          super(e, t, n, o),
            (this._container = null),
            (this._editableText = new h.WatchedValue('')),
            (this._activateTextEditingEl = null),
            (this._paneView = null),
            (this._selectionData = {}),
            (this._cursorPaneView = null),
            (this._cursorPosition = null),
            (this._editingOnCreation = !1),
            (this._editingActivationTime = null),
            this._editableText.subscribe(() => {
              this.updateAllViewsAndRedraw((0, _.sourceChangeEvent)(this.id()))
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
          return { ...(this._isDarkBackground.value() ? g : P) }
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
            ? (this._cursorPaneView.update((0, _.sourceChangeEvent)(this.id())),
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
            this.updateAllViewsAndRedraw((0, _.sourceChangeEvent)(this.id()))
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
            this.updateAllViewsAndRedraw((0, _.sourceChangeEvent)(this.id())))
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
          const { updateChartEditorText: l, closeChartEditorText: c } =
            await Promise.all([i.e(4556), i.e(2227), i.e(5592)]).then(
              i.bind(i, 99514),
            )
          if (null === this._container || this._isDestroyed) return
          this._closeChartEditorText = c
          const {
              text: d,
              textColor: h,
              wordWrap: u,
            } = this.editableTextProperties(),
            { forbidLineBreaks: p, maxLength: x } = this.editableTextStyle()
          this._editableText.setValue(d.value())
          const P = this.isFixed()
              ? (0, o.ensureDefined)(this.fixedPoint())
              : (0, o.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            g = {
              position: (0, s.point)(P.x, P.y),
              textInfo: t,
              placeholder: n,
              text: this._editableText,
              textColor: h,
              wordWrap: u,
              forbidLineBreaks: p,
              maxLength: x,
              onClose: r,
              onSelectionChange: a,
              onContextMenu: this.onContextMenu
                ? this.onContextMenu.bind(this)
                : void 0,
            }
          l(this._container, g),
            this.updateAllViewsAndRedraw((0, _.sourceChangeEvent)(this.id()))
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
            this.updateAllViewsAndRedraw((0, _.sourceChangeEvent)(this.id())))
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
          return new C(this._model, this, e, t)
        }
        _createDataSourceBackgroundColorWV() {
          return new h.WatchedValue(null).readonly().ownership()
        }
      }
    },
    15511: (e, t, i) => {
      i.d(t, {
        LineToolWithRelativePriceCoordinate: () => P,
        getNoDataPosition: () => _,
        getSeriesPosition: () => x,
        positionToCoordinate: () => h,
      })
      var n,
        o,
        s = i(50151),
        r = i(8025),
        a = i(24362)
      function l(e, t, i) {
        const n = e.barFunction()
        switch (e.style()) {
          case 3:
          case 10:
          case 2:
          case 14:
          case 15:
            return n(t.value)
          default:
            return t.value[-1 === i ? 3 : 2]
        }
      }
      function c(e) {
        return e >= 0 ? 1 : -1
      }
      function d(e, t) {
        return (-1 === c(e)) !== t ? -1 : 1
      }
      function h(e, t, i, n) {
        const o = Math.min(t, Math.max(0, 1 === n ? i : t - i))
        return i - n * Math.abs((o * e) / 100)
      }
      function u(e, t, i) {
        const n = e.index()
        return null === n
          ? null
          : { index: n, price: t.coordinateToPrice(t.height() / 2, i) }
      }
      function p(e, t) {
        const i = e.data().bars(),
          n = i.first(),
          o = i.last()
        if (null === n || null === o) return null
        let s
        const a = t.index()
        if (null === a) {
          if (void 0 === t.time) return null
          const e = t.time(),
            a = n.value[0],
            l = o.value[0]
          if (e < a - 86400 || e > l) return null
          s = i.searchByTime(e, r.PlotRowSearchMode.NearestRight, 4)
        } else s = i.search(a)
        return null === s
          ? null
          : { index: s.index, price: l(e, s, c(t.position())) }
      }
      function _(e, t, i, n) {
        const o = u(e, t, n)
        if (null === o) return null
        const s = d(e.position(), t.isInverted())
        return {
          index: o.index,
          price: o.price,
          poleStartY: t.height(),
          visualDirection: 1,
          positionPointDirection: s,
          startsOnSeriesData: !1,
          priceCoordinate: t.priceToCoordinate(o.price, n),
          indexCoordinate: i.indexToCoordinate(o.index),
        }
      }
      function x(e, t, i = !0) {
        const n = p(e, t),
          o = e.priceScale(),
          r = e.model().timeScale(),
          a = (0, s.ensureNotNull)(e.firstValue())
        if (null === n) return _(t, o, r, a)
        let l = 0
        const c = e.properties().childs(),
          h = o.priceToCoordinate(n.price, a),
          u = d(t.position(), o.isInverted())
        if (i)
          switch (e.style()) {
            case 16:
              l =
                1 === u
                  ? c.hlcAreaStyle.childs().highLineWidth.value() / 2
                  : c.hlcAreaStyle.childs().lowLineWidth.value() / 2
              break
            case 3:
              l = c.areaStyle.childs().linewidth.value() / 2
              break
            case 2:
              l = c.lineStyle.childs().linewidth.value() / 2
              break
            case 14:
              l = c.lineWithMarkersStyle.childs().linewidth.value() / 2
              break
            case 15:
              l = c.steplineStyle.childs().linewidth.value() / 2
              break
            case 10:
              const e = Math.abs(
                100 - c.baselineStyle.childs().baseLevelPercentage.value(),
              )
              l =
                (o.height() * e) / 100 > h
                  ? c.baselineStyle.childs().topLineWidth.value() / 2
                  : c.baselineStyle.childs().bottomLineWidth.value() / 2
              break
            case 1:
            case 9:
            case 8:
            case 12:
            case 4:
            case 7:
              l = 3
              break
            case 0:
              l = c.barStyle.childs().thinBars.value()
                ? 3
                : Math.max(3, 0.25 * r.barSpacing())
              break
            case 11:
              l = c.rangeStyle.childs().thinBars.value()
                ? 3
                : Math.max(3, 0.25 * r.barSpacing())
              break
            case 5:
              l = Math.max(4, 0.25 * r.barSpacing())
              break
            case 6:
              l = Math.max(5, 0.25 * r.barSpacing())
          }
        const x = h - u * l
        return {
          index: n.index,
          price: n.price,
          poleStartY: x,
          visualDirection: u,
          positionPointDirection: u,
          startsOnSeriesData: !0,
          priceCoordinate: h,
          indexCoordinate: r.indexToCoordinate(n.index),
        }
      }
      !((e) => {
        ;(e[(e.Label = 0)] = 'Label'), (e[(e.Body = 1)] = 'Body')
      })(n || (n = {})),
        ((e) => {
          e[(e.OneDaySeconds = 86400)] = 'OneDaySeconds'
        })(o || (o = {}))
      class P extends a.InplaceTextLineDataSource {
        constructor() {
          super(...arguments), (this._startMovingAnchorY = Number.NaN)
        }
        priceSource() {
          return this.ownerSource()
        }
        editableTextProperties() {
          ;(0, s.assert)(!1, 'unexpected method call')
        }
        addPoint(e, t, i) {
          return super.addPoint(this._updatePositionAndCorrectPoint(e), t, i)
        }
        setPoint(e, t, i, n) {
          n
            ? super.setPoint(e, t, i, n)
            : (super.setPoint(
                e,
                this._updatePositionAndCorrectPoint(
                  t,
                  !this.isPhantom() && !this._allowChangeAnchorHorizontally(),
                ),
                i,
              ),
              this._syncPosition())
        }
        setPointAndChangeIndex(e, t, i) {
          super.setPoint(e, this._updatePositionAndCorrectPoint(t), i),
            this._syncPosition()
        }
        startMoving(e, t, i, n) {
          n ||
            (this._startMovingAnchorY = (0, s.ensureNotNull)(
              this._anchorYCoordinate(),
            )),
            super.startMoving(e, t, i)
        }
        move(e, t, i, n) {
          const o = (0, s.ensureDefined)(
              (0, s.ensureNotNull)(this.startMovingPoint()).logical,
            ),
            r = (0, s.ensureDefined)(e.logical)
          if (!n && 0 === t) {
            const e = this._points[0],
              t = r.index - o.index,
              i = (0, s.ensureNotNull)(this.priceScale()),
              n = (0, s.ensure)(this.ownerSource()?.firstValue()),
              a =
                i.priceToCoordinate(r.price, n) -
                i.priceToCoordinate(o.price, n),
              l = this._startMovingAnchorY + a,
              c = i.coordinateToPrice(l, n)
            this._updatePositionAndCorrectPoint({
              index: e.index + t,
              price: c,
            })
          }
          super.move(e, t, i), n || this._syncPosition()
        }
        _allowChangeAnchorHorizontally() {
          return !1
        }
        _updatePositionAndCorrectPoint(e, t = !1) {
          t && (e.index = this._points[0].index)
          const i = this.priceSource()
          if (null === i) return e
          const n = i.priceScale(),
            o = i.firstValue()
          if (null === n || n.isEmpty() || null === o) return e
          const s = n.height()
          let r = s / 2,
            a = e.price >= n.coordinateToPrice(r, o) ? 1 : -1
          const c = this._model.mainSeries()
          if (i === c) {
            const t = c.data().search(this._baseSeriesIndexForPoint(e))
            if (null !== t) {
              const i = l(c, t, -1),
                s = l(c, t, 1)
              ;(a = e.price >= i ? 1 : -1),
                (r = n.priceToCoordinate(1 === a ? s : i, o)),
                (e.price = 1 === a ? Math.max(s, e.price) : e.price)
            }
          }
          const d = 1 === ((-1 === a) !== n.isInverted() ? -1 : 1) ? r : s - r,
            h = n.priceToCoordinate(e.price, o),
            u = Math.min(s, Math.abs(h - r)),
            p = Math.max(0, Math.min(100, (100 * u) / d)) * a
          return this.properties().childs().position.setValue(p), e
        }
        _baseSeriesIndexForPoint(e) {
          return e.index
        }
        _syncPosition() {
          const e = this.linkKey().value()
          null !== e &&
            this._syncLineStyleChanges(e, {
              position: this.properties().childs().position.value(),
            })
        }
        _anchorYCoordinate() {
          const e = this.priceSource()
          if (null === e) return null
          const t = e.priceScale(),
            i = e.firstValue()
          if (null === t || t.isEmpty() || null === i) return null
          const n = this._model.mainSeries(),
            o = this.customEvent()
          if (null === o) return null
          let s = null
          if (
            (e === n && (s = p(n, o)),
            null === s && (s = u(o, t, i)),
            null === s)
          )
            return null
          const r = o.position(),
            a = t.priceToCoordinate(s.price, i)
          return h(r, t.height(), a, d(r, t.isInverted()))
        }
      }
    },
    28820: (e, t, i) => {
      i.r(t), i.d(t, { LineToolSignpost: () => u })
      var n = i(19625),
        o = i(32679),
        s = i(12988),
        r = i(29875),
        a = i(73305),
        l = i(15511)
      class c extends s.Property {
        constructor(e) {
          super(),
            (this._source = e),
            e.pointAdded().subscribe(this, () => this.fireChanged()),
            e.pointChanged().subscribe(this, () => this.fireChanged())
        }
        value() {
          const e = this._source.properties().childs().position.value()
          return Number.parseFloat(e.toFixed(2))
        }
        setValue(e) {
          this._source.properties().childs().position.setValue(e),
            this._source.model().updateSource(this._source),
            this.fireChanged(),
            this._source.syncMultichartState({
              pricesChanged: !1,
              indexesChanged: !1,
            })
        }
      }
      var d = i(20834)
      class h extends d.LineDataSourcePointIndexProperty {
        constructor(e, t) {
          super(e, t), (this._source = e)
        }
        _setPointImpl(e) {
          this._source.setPointAndChangeIndex(this._pointIndex, e)
        }
      }
      class u extends l.LineToolWithRelativePriceCoordinate {
        constructor(
          e,
          t = u.createProperties(e.backgroundTheme().spawnOwnership()),
          o,
          r,
        ) {
          super(e, t, o, r),
            (this._textColorProperty = new s.Property('transparent')),
            (this._setTextColorByTheme = (e) => {
              this._textColorProperty.setValue(
                e
                  ? (0, n.getHexColorByName)('color-cold-gray-200')
                  : (0, n.getHexColorByName)('color-cold-gray-900'),
              )
            }),
            e.dark().subscribe(this._setTextColorByTheme, { callWithLast: !0 }),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 93751))
              .then((t) => {
                this._setPaneViews([
                  new t.SignpostPaneView(
                    this,
                    e,
                    this._openTextEditor.bind(this),
                    this._closeTextEditor.bind(this),
                    this.onSelectionChange.bind(this),
                  ),
                ])
              })
        }
        destroy() {
          this._model.dark().unsubscribe(this._setTextColorByTheme),
            super.destroy()
        }
        pointsCount() {
          return 1
        }
        name() {
          return 'Signpost'
        }
        customEvent() {
          return {
            index: () => this.points()[0]?.index ?? null,
            position: () => this.properties().childs().position.value(),
          }
        }
        showInObjectTree() {
          return !this.isPhantom() && super.showInObjectTree()
        }
        isPhantom() {
          return this._model.isPhantomLine(this)
        }
        clonePositionOffset() {
          return { barOffset: 1, xCoordOffset: 0, yCoordOffset: 0 }
        }
        template() {
          const e = super.template(),
            t = this.properties().childs()
          return (e.text = t.text.value()), (e.position = t.position.value()), e
        }
        shouldBeRemovedOnDeselect() {
          const e = this._properties.childs()
          if (e.showImage.value()) return !1
          return '' === e.text.value().trim()
        }
        editableTextProperties() {
          return {
            text: this.properties().childs().text,
            textColor: this._textColorProperty,
          }
        }
        activateEditingOnCreation() {
          return !0
        }
        static createProperties(e, t) {
          const i = new o.DefaultProperty({
            defaultName: 'linetoolsignpost',
            state: t,
            theme: e,
          })
          return this._configureProperties(i), i
        }
        _createPointProperty(e) {
          super._createPointProperty(e)
          const t = this._pointsProperty.childs().points[e]
          t.removeProperty('price'),
            t.removeProperty('bar'),
            t.addChild('price', new c(this)),
            t.addChild('bar', new h(this, 0))
        }
        _applyTemplateImpl(e) {
          super._applyTemplateImpl(e),
            this.properties().childs().text.setValue(e.text),
            this.properties().childs().position.setValue(e.position)
        }
        _normalizePoint(e, t) {
          return (
            super._normalizePointWithoutOffset(e) ?? super._normalizePoint(e, t)
          )
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            i.e(6406),
            i.e(3889),
            i.e(8009),
            i.e(8056),
            i.e(8537),
          ])
            .then(i.bind(i, 91051))
            .then((e) => e.SignpostDefinitionsViewModel)
        }
        static _configureProperties(e) {
          r.LineDataSource._configureProperties(e),
            e.hasChild('text') || e.addChild('text', new s.Property('')),
            e.hasChild('position') ||
              e.addChild('position', new s.Property(50)),
            e.addExcludedKey('text', 1),
            e.addExcludedKey('position', 1),
            e.addChild(
              'backgroundsColors',
              new a.LineToolColorsProperty([e.childs().plateColor]),
            )
        }
      }
      u.supportPhantomMode = !0
    },
  },
])
