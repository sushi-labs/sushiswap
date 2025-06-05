;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2283],
  {
    15399: (e, t, i) => {
      i.d(t, { LevelsProperty: () => x })
      var s = i(90054),
        n = i(16738),
        r = i(37265),
        o = i(32679),
        a = i(35039)
      const l = {
        prefixes: [''],
        range: [0, 0],
        names: ['coeff', 'color', 'visible', 'linestyle', 'linewidth'],
        typecheck: { pack: () => Object(), unpack: () => [] },
      }
      function h(e, t, i, s) {
        return s.push(i[t]), s
      }
      function c(e, t, i, s) {
        return (s[t] = i[e]), s
      }
      function u() {
        return []
      }
      function d() {
        return {}
      }
      function _(e, t, i) {
        return (
          i.prefixes.forEach((s) => {
            const n = s + 'level'
            for (let s = i.range[0]; s <= i.range[1]; s++)
              if (e[n + s] && (0, r.isSameType)(e[n + s], t.typecheck())) {
                let r = t.tpl()
                i.names.forEach((i, o) => {
                  r = t.fill('' + o, i, e[n + s], r)
                }),
                  (e[n + s] = r)
              }
          }),
          e
        )
      }
      function p(e, t, i) {
        return i(e, { tpl: d, fill: c, typecheck: t.typecheck.unpack }, t)
      }
      class x extends o.DefaultProperty {
        constructor(e) {
          const { levelsIterator: t = _, map: i = {}, ...s } = e,
            n = { ...l, ...i }
          s.state && (s.state = p(s.state, n, t)),
            super(s),
            (this._map = n),
            (this._levelsIterator = t)
        }
        state(e, t, i) {
          const s = super.state(e, t)
          return i
            ? s
            : ((n = s),
              (r = this._map),
              (0, this._levelsIterator)(
                n,
                { tpl: u, fill: h, typecheck: r.typecheck.pack },
                r,
              ))
          var n, r
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
              (0, n.default)(
                (0, s.default)(t),
                p(e, this._map, this._levelsIterator),
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
            this._map ? p(e, this._map, this._levelsIterator) : e,
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
    42851: (e, t, i) => {
      i.r(t), i.d(t, { LineToolFibChannel: () => _ })
      var s,
        n,
        r = i(50151),
        o = i(11542),
        a = i(45126),
        l = i(85719),
        h = i(15399),
        c = i(73305),
        u = i(24362)
      !((e) => {
        ;(e[(e.FibChannelWithReverse = 1)] = 'FibChannelWithReverse'),
          (e[(e.FibChannelWithoutReverse = 2)] = 'FibChannelWithoutReverse'),
          (e[(e.TheLatest = 2)] = 'TheLatest')
      })(s || (s = {})),
        ((e) => {
          e[(e.LevelsCount = 24)] = 'LevelsCount'
        })(n || (n = {}))
      const d = new a.TranslatedString(
        'erase level line',
        o.t(null, void 0, i(77114)),
      )
      class _ extends u.InplaceTextLineDataSource {
        constructor(e, t, s, n) {
          super(
            e,
            t ?? _.createProperties(e.backgroundTheme().spawnOwnership()),
            s,
            n,
          ),
            (this.version = 2),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 93143))
              .then(({ FibChannelPaneView: e }) => {
                this._setPaneViews([new e(this, this._model)])
              })
        }
        levelsCount() {
          return 24
        }
        migrateVersion(e, t, i) {
          i.properties.removeProperty('reverse')
        }
        pointsCount() {
          return 3
        }
        name() {
          return 'Fib Channel'
        }
        processErase(e, t) {
          const i = 'level' + t,
            s = (0, r.ensureDefined)(this.properties().child(i)).childs()
              .visible
          e.setProperty(s, !1, d, l.lineToolsDoNotAffectChartInvalidation)
        }
        editableTextProperties() {
          ;(0, r.assert)(!1, 'unexpected method call')
        }
        static createProperties(e, t) {
          const i = new h.LevelsProperty({
            defaultName: 'linetoolfibchannel',
            state: t,
            map: { range: [1, 24], names: ['coeff', 'color', 'visible'] },
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
        static _configureProperties(e) {
          super._configureProperties(e)
          const t = []
          for (let i = 1; i <= 24; i++) {
            const s = (0, r.ensureDefined)(e.child('level' + i))
            t.push((0, r.ensureDefined)(s.child('color')))
          }
          e.addChild('linesColors', new c.LineToolColorsProperty(t))
        }
      }
    },
    24362: (e, t, i) => {
      i.d(t, {
        InplaceTextLineDataSource: () => w,
        InplaceTextUndoCommand: () => m,
      })
      var s = i(50279),
        n = i(50151),
        r = i(86441),
        o = i(19625),
        a = i(24377),
        l = i(11542),
        h = i(45126),
        c = i(88960),
        u = i(64147),
        d = i(60265),
        _ = i(29875),
        p = i(44672),
        x = i(85719)
      const g = {
          selectionColor: (0, o.getHexColorByName)('color-tv-blue-500'),
          cursorColor: (0, o.getHexColorByName)('color-black'),
        },
        v = {
          selectionColor: (0, o.getHexColorByName)('color-white'),
          cursorColor: (0, o.getHexColorByName)('color-white'),
        }
      class m extends d.UndoCommand {
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
      class w extends _.LineDataSource {
        constructor(e, t, s, n) {
          super(e, t, s, n),
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
          return { ...(this._isDarkBackground.value() ? v : g) }
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
              text: c,
              textColor: u,
              wordWrap: d,
            } = this.editableTextProperties(),
            { forbidLineBreaks: _, maxLength: x } = this.editableTextStyle()
          this._editableText.setValue(c.value())
          const g = this.isFixed()
              ? (0, n.ensureDefined)(this.fixedPoint())
              : (0, n.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            v = {
              position: (0, r.point)(g.x, g.y),
              textInfo: t,
              placeholder: s,
              text: this._editableText,
              textColor: u,
              wordWrap: d,
              forbidLineBreaks: _,
              maxLength: x,
              onClose: o,
              onSelectionChange: a,
              onContextMenu: this.onContextMenu
                ? this.onContextMenu.bind(this)
                : void 0,
            }
          l(this._container, v),
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
          return new u.WatchedValue(null).readonly().ownership()
        }
      }
    },
  },
])
