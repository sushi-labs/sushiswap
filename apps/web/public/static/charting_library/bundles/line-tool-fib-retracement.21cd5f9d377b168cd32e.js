;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3723],
  {
    15399: (e, t, i) => {
      i.d(t, { LevelsProperty: () => x })
      var s = i(90054),
        r = i(16738),
        n = i(37265),
        o = i(32679),
        a = i(35039)
      const l = {
        prefixes: [''],
        range: [0, 0],
        names: ['coeff', 'color', 'visible', 'linestyle', 'linewidth'],
        typecheck: { pack: () => Object(), unpack: () => [] },
      }
      function d(e, t, i, s) {
        return s.push(i[t]), s
      }
      function c(e, t, i, s) {
        return (s[t] = i[e]), s
      }
      function h() {
        return []
      }
      function u() {
        return {}
      }
      function p(e, t, i) {
        return (
          i.prefixes.forEach((s) => {
            const r = s + 'level'
            for (let s = i.range[0]; s <= i.range[1]; s++)
              if (e[r + s] && (0, n.isSameType)(e[r + s], t.typecheck())) {
                let n = t.tpl()
                i.names.forEach((i, o) => {
                  n = t.fill('' + o, i, e[r + s], n)
                }),
                  (e[r + s] = n)
              }
          }),
          e
        )
      }
      function _(e, t, i) {
        return i(e, { tpl: u, fill: c, typecheck: t.typecheck.unpack }, t)
      }
      class x extends o.DefaultProperty {
        constructor(e) {
          const { levelsIterator: t = p, map: i = {}, ...s } = e,
            r = { ...l, ...i }
          s.state && (s.state = _(s.state, r, t)),
            super(s),
            (this._map = r),
            (this._levelsIterator = t)
        }
        state(e, t, i) {
          const s = super.state(e, t)
          return i
            ? s
            : ((r = s),
              (n = this._map),
              (0, this._levelsIterator)(
                r,
                { tpl: h, fill: d, typecheck: n.typecheck.pack },
                n,
              ))
          var r, n
        }
        preferences() {
          return (0, o.extractState)(
            this.state(this._excludedDefaultsKeys, void 0, !0),
            this._allDefaultsKeys,
          )
        }
        applyTemplate(e, t) {
          this.mergeAndFire(
            (0, o.extractState)(
              (0, r.default)(
                (0, s.default)(t),
                _(e, this._map, this._levelsIterator),
              ),
              this._allStateKeys,
              this._excludedTemplateKeys,
            ),
          )
        }
        saveDefaults() {
          this._useUserPreferences &&
            (0, a.saveDefaults)(this._defaultName, this.preferences())
        }
        clone() {
          return new x(this._options())
        }
        merge(e, t) {
          return super.merge(
            this._map ? _(e, this._map, this._levelsIterator) : e,
            t,
          )
        }
        _options() {
          return {
            ...super._options(),
            map: { ...this._map },
            levelsIterator: this._levelsIterator,
          }
        }
      }
    },
    96851: (e, t, i) => {
      i.d(t, {
        LineToolFibWithInplaceTextBase: () => d,
        getLevelProps: () => a,
      })
      var s = i(50151),
        r = i(12988),
        n = i(24362)
      const o = new r.Property(!1)
      function a(e, t) {
        return (0, s.ensureDefined)(e.child(`level${t}`))
      }
      class l extends n.InplaceTextUndoCommand {
        constructor(e, t, i, s, r) {
          super(e, t, i, s), (this._levelIndex = r)
        }
        _textProperty(e) {
          return a(e.properties(), this._levelIndex).childs().text
        }
      }
      class d extends n.InplaceTextLineDataSource {
        constructor() {
          super(...arguments), (this._inplaceEditLevelIndex = 1)
        }
        editableTextStyle() {
          return {
            ...super.editableTextStyle(),
            forbidLineBreaks: !0,
            maxLength: 50,
          }
        }
        editableTextProperties() {
          const e = this.properties().childs()
          return {
            text: e.editableText,
            textColor: e.editableTextColor,
            wordWrap: o,
          }
        }
        setInplaceEditLevelIndex(e) {
          this._destroyEditableTextSubscriptions?.()
          const t = this.properties(),
            i = t.childs().editableText,
            r = t.childs().editableTextColor,
            n = a(t, e),
            o = (0, s.ensureDefined)(n).childs().text,
            l = (0, s.ensureDefined)(n).childs().color,
            d = {}
          i.setValue(o.value()),
            r.setValue(l.value()),
            i.subscribe(d, () => o.setValue(i.value())),
            o.subscribe(d, () => i.setValue(o.value())),
            r.subscribe(d, () => l.setValue(r.value())),
            l.subscribe(d, () => r.setValue(l.value())),
            (this._destroyEditableTextSubscriptions = () => {
              i.unsubscribeAll(d),
                o.unsubscribeAll(d),
                r.unsubscribeAll(d),
                l.unsubscribeAll(d)
            }),
            (this._inplaceEditLevelIndex = e),
            this._editableText.setValue(i.value())
        }
        _changeEditableTextUndoCommand(e, t) {
          return new l(this._model, this, e, t, this._inplaceEditLevelIndex)
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.addChild('editableText', new r.Property('')),
            e.addChild('editableTextColor', new r.Property('')),
            e.addExcludedKey('editableText', 3),
            e.addExcludedKey('editableTextColor', 3)
        }
      }
    },
    33168: (e, t, i) => {
      i.r(t), i.d(t, { LineToolFibRetracement: () => u })
      var s,
        r,
        n = i(11542),
        o = i(45126),
        a = i(15399),
        l = i(85719),
        d = i(73305),
        c = i(96851)
      !((e) => {
        ;(e[(e.FibRetracement = 1)] = 'FibRetracement'),
          (e[(e.FibRetracementV2 = 2)] = 'FibRetracementV2'),
          (e[(e.Latest = 2)] = 'Latest')
      })(s || (s = {})),
        ((e) => {
          ;(e[(e.LevelsCount = 24)] = 'LevelsCount'),
            (e[(e.PointsCount = 2)] = 'PointsCount'),
            (e.Name = 'Fib Retracement')
        })(r || (r = {}))
      const h = new o.TranslatedString(
        'erase level line',
        n.t(null, void 0, i(77114)),
      )
      class u extends c.LineToolFibWithInplaceTextBase {
        constructor(e, t, s, r) {
          super(
            e,
            t ?? u.createProperties(e.backgroundTheme().spawnOwnership()),
            s,
            r,
          ),
            (this.version = 2),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 65343))
              .then((e) => {
                ;(this._paneView = new e.FibRetracementPaneView(
                  this,
                  this._model,
                  this._openTextEditor.bind(this),
                  this._closeTextEditor.bind(this),
                  this.onSelectionChange.bind(this),
                )),
                  this._setPaneViews([this._paneView])
              })
        }
        levelsCount() {
          return 24
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Fib Retracement'
        }
        migrateVersion(e) {
          1 === e && this.properties().childs().extendLines.setValue(!0)
        }
        processErase(e, t) {
          const i = 'level' + t,
            { visible: s } = this.properties().childs()[i].childs()
          e.setProperty(s, !1, h, l.lineToolsDoNotAffectChartInvalidation)
        }
        fibLevelsBasedOnLogScale() {
          return (
            this.properties().childs().fibLevelsBasedOnLogScale.value() &&
            !!this.priceScale()?.isLog()
          )
        }
        template() {
          const e = super.template()
          for (let t = 1; t <= 24; t++) {
            const i = (0, c.getLevelProps)(this._properties, t)
            e[`level${t}`].text = i.childs().text.value()
          }
          return e
        }
        static createProperties(e, t) {
          const i = new a.LevelsProperty({
            defaultName: 'linetoolfibretracement',
            state: t,
            map: {
              range: [1, 24],
              names: ['coeff', 'color', 'visible', 'text'],
            },
            theme: e,
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
            ]).then(i.bind(i, 75450))
          ).FibDrawingsWith24LevelsDefinitionsViewModel
        }
        _applyTemplateImpl(e) {
          for (let t = 1; t <= 24; t++) {
            const i = (0, c.getLevelProps)(this._properties, t),
              s = e[`level${t}`]
            i.childs().text.setValue(s.text ?? s[3] ?? '')
          }
          super._applyTemplateImpl(e)
        }
        static _configureProperties(e) {
          super._configureProperties(e)
          const t = [
              e.childs().trendline.childs().linewidth,
              e.childs().levelsStyle.childs().linewidth,
            ],
            i = [e.childs().trendline.childs().color]
          for (let t = 1; t <= 24; t++) {
            const s = (0, c.getLevelProps)(e, t)
            i.push(s.childs().color), e.addExcludedKey(`level${t}.text`, 1)
          }
          e.addChild('linesColors', new d.LineToolColorsProperty(i)),
            e.addChild('linesWidths', new d.LineToolWidthsProperty(t))
        }
      }
    },
    24362: (e, t, i) => {
      i.d(t, {
        InplaceTextLineDataSource: () => g,
        InplaceTextUndoCommand: () => m,
      })
      var s = i(50279),
        r = i(50151),
        n = i(86441),
        o = i(19625),
        a = i(24377),
        l = i(11542),
        d = i(45126),
        c = i(88960),
        h = i(64147),
        u = i(60265),
        p = i(29875),
        _ = i(44672),
        x = i(85719)
      const b = {
          selectionColor: (0, o.getHexColorByName)('color-tv-blue-500'),
          cursorColor: (0, o.getHexColorByName)('color-black'),
        },
        v = {
          selectionColor: (0, o.getHexColorByName)('color-white'),
          cursorColor: (0, o.getHexColorByName)('color-white'),
        }
      class m extends u.UndoCommand {
        constructor(e, t, s, r) {
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
            (this._oldValue = s),
            (this._newValue = r),
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
          return (0, r.ensureNotNull)(
            this._model.dataSourceForId(this._sourceId),
          )
        }
      }
      class g extends p.LineDataSource {
        constructor(e, t, s, r) {
          super(e, t, s, r),
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
          return { ...(this._isDarkBackground.value() ? v : b) }
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
          const { updateChartEditorText: l, closeChartEditorText: d } =
            await Promise.all([i.e(4556), i.e(2227), i.e(5592)]).then(
              i.bind(i, 99514),
            )
          if (null === this._container || this._isDestroyed) return
          this._closeChartEditorText = d
          const {
              text: c,
              textColor: h,
              wordWrap: u,
            } = this.editableTextProperties(),
            { forbidLineBreaks: p, maxLength: x } = this.editableTextStyle()
          this._editableText.setValue(c.value())
          const b = this.isFixed()
              ? (0, r.ensureDefined)(this.fixedPoint())
              : (0, r.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            v = {
              position: (0, n.point)(b.x, b.y),
              textInfo: t,
              placeholder: s,
              text: this._editableText,
              textColor: h,
              wordWrap: u,
              forbidLineBreaks: p,
              maxLength: x,
              onClose: o,
              onSelectionChange: a,
              onContextMenu: this.onContextMenu
                ? this.onContextMenu.bind(this)
                : void 0,
            }
          l(this._container, v),
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
          return new m(this._model, this, e, t)
        }
        _createDataSourceBackgroundColorWV() {
          return new h.WatchedValue(null).readonly().ownership()
        }
      }
    },
  },
])
