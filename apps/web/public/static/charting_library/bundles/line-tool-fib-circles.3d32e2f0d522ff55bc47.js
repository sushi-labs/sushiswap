;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2816],
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
      function d() {
        return []
      }
      function u() {
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
        return i(e, { tpl: u, fill: c, typecheck: t.typecheck.unpack }, t)
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
                { tpl: d, fill: h, typecheck: r.typecheck.pack },
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
    57994: (e, t, i) => {
      i.r(t), i.d(t, { LineToolFibCircles: () => u })
      var s = i(50151),
        n = i(11542),
        r = i(45126),
        o = i(15399),
        a = i(73305),
        l = i(85719),
        h = i(24362)
      const c = new r.TranslatedString(
        'erase level line',
        n.t(null, void 0, i(77114)),
      )
      var d
      !((e) => {
        e[(e.LevelsCount = 11)] = 'LevelsCount'
      })(d || (d = {}))
      class u extends h.InplaceTextLineDataSource {
        constructor(e, t, s, n) {
          super(
            e,
            t ?? u.createProperties(e.backgroundTheme().spawnOwnership()),
            s,
            n,
          ),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 83201))
              .then((e) => {
                this._setPaneViews([
                  new e.FibCirclesPaneView(this, this._model),
                ])
              })
        }
        levelsCount() {
          return 11
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Fib Circles'
        }
        processErase(e, t) {
          const i = (0, s.ensureDefined)(this.properties().child(`level${t}`))
          e.setProperty(i, !1, c, l.lineToolsDoNotAffectChartInvalidation)
        }
        editableTextProperties() {
          ;(0, s.assert)(!1, 'unexpected method call')
        }
        snapTo45DegreesAvailable() {
          return !0
        }
        static createProperties(e, t) {
          const i = new o.LevelsProperty({
            defaultName: 'linetoolfibcircles',
            state: t,
            map: { range: [1, 11] },
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
            ]).then(i.bind(i, 41618))
          ).FibCirclesDefinitionsViewModel
        }
        static _configureProperties(e) {
          super._configureProperties(e)
          const t = e.childs(),
            i = [t.trendline.childs().linewidth],
            n = [t.trendline.childs().color]
          for (let t = 1; t <= 11; t++)
            i.push(
              (0, s.ensureDefined)(e.child('level' + t)?.child('linewidth')),
            ),
              n.push((0, s.ensureDefined)(e.child('level' + t)?.child('color')))
          e.addChild('linesColors', new a.LineToolColorsProperty(n)),
            e.addChild('linesWidths', new a.LineToolWidthsProperty(i))
        }
      }
    },
    24362: (e, t, i) => {
      i.d(t, {
        InplaceTextLineDataSource: () => v,
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
        d = i(64147),
        u = i(60265),
        _ = i(29875),
        p = i(44672),
        x = i(85719)
      const g = {
          selectionColor: (0, o.getHexColorByName)('color-tv-blue-500'),
          cursorColor: (0, o.getHexColorByName)('color-black'),
        },
        w = {
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
      class v extends _.LineDataSource {
        constructor(e, t, s, n) {
          super(e, t, s, n),
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
          return { ...(this._isDarkBackground.value() ? w : g) }
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
              textColor: d,
              wordWrap: u,
            } = this.editableTextProperties(),
            { forbidLineBreaks: _, maxLength: x } = this.editableTextStyle()
          this._editableText.setValue(c.value())
          const g = this.isFixed()
              ? (0, n.ensureDefined)(this.fixedPoint())
              : (0, n.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            w = {
              position: (0, r.point)(g.x, g.y),
              textInfo: t,
              placeholder: s,
              text: this._editableText,
              textColor: d,
              wordWrap: u,
              forbidLineBreaks: _,
              maxLength: x,
              onClose: o,
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
          return new m(this._model, this, e, t)
        }
        _createDataSourceBackgroundColorWV() {
          return new d.WatchedValue(null).readonly().ownership()
        }
      }
    },
  },
])
