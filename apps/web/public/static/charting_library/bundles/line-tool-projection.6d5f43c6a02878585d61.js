;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3945],
  {
    15399: (e, t, i) => {
      i.d(t, { LevelsProperty: () => x })
      var s = i(90054),
        n = i(16738),
        o = i(37265),
        r = i(32679),
        a = i(35039)
      const l = {
        prefixes: [''],
        range: [0, 0],
        names: ['coeff', 'color', 'visible', 'linestyle', 'linewidth'],
        typecheck: { pack: () => Object(), unpack: () => [] },
      }
      function c(e, t, i, s) {
        return s.push(i[t]), s
      }
      function u(e, t, i, s) {
        return (s[t] = i[e]), s
      }
      function h() {
        return []
      }
      function d() {
        return {}
      }
      function p(e, t, i) {
        return (
          i.prefixes.forEach((s) => {
            const n = s + 'level'
            for (let s = i.range[0]; s <= i.range[1]; s++)
              if (e[n + s] && (0, o.isSameType)(e[n + s], t.typecheck())) {
                let o = t.tpl()
                i.names.forEach((i, r) => {
                  o = t.fill('' + r, i, e[n + s], o)
                }),
                  (e[n + s] = o)
              }
          }),
          e
        )
      }
      function _(e, t, i) {
        return i(e, { tpl: d, fill: u, typecheck: t.typecheck.unpack }, t)
      }
      class x extends r.DefaultProperty {
        constructor(e) {
          const { levelsIterator: t = p, map: i = {}, ...s } = e,
            n = { ...l, ...i }
          s.state && (s.state = _(s.state, n, t)),
            super(s),
            (this._map = n),
            (this._levelsIterator = t)
        }
        state(e, t, i) {
          const s = super.state(e, t)
          return i
            ? s
            : ((n = s),
              (o = this._map),
              (0, this._levelsIterator)(
                n,
                { tpl: h, fill: c, typecheck: o.typecheck.pack },
                o,
              ))
          var n, o
        }
        preferences() {
          return (0, r.extractState)(
            this.state(this._excludedDefaultsKeys, void 0, !0),
            this._allDefaultsKeys,
          )
        }
        applyTemplate(e, t) {
          this.mergeAndFire(
            (0, r.extractState)(
              (0, n.default)(
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
    90882: (e, t, i) => {
      i.d(t, { LineToolFibWedgeBase: () => a })
      var s = i(50151),
        n = i(86441),
        o = i(24362),
        r = i(64147)
      class a extends o.InplaceTextLineDataSource {
        constructor() {
          super(...arguments),
            (this._hasEditableCoordinates = new r.WatchedValue(!1))
        }
        pointsCount() {
          return 3
        }
        setPoint(e, t) {
          if ((super.setPoint(e, t), !this._recursiveGuard))
            try {
              if (((this._recursiveGuard = !0), 2 === e)) {
                const e = (0, s.ensureNotNull)(
                  this.pointToScreenPoint(this._points[0]),
                )
                let t = (0, s.ensureNotNull)(
                  this.pointToScreenPoint(this._points[1]),
                )
                const i = (0, s.ensureNotNull)(
                  this.pointToScreenPoint(this._points[2]),
                )
                  .subtract(e)
                  .length()
                let o = t.subtract(e)
                o.length() <= 0 && (o = new n.Point(1, 0)),
                  (t = e.add(o.normalized().scaled(i)))
                const r = (0, s.ensureNotNull)(this.screenPointToPoint(t)),
                  a = this._pointsProperty.childs().points[1]
                a.childs().price.setValue(r.price),
                  a.childs().bar.setValue(r.index)
              } else {
                const e = (0, s.ensureNotNull)(
                    this.pointToScreenPoint(this._points[0]),
                  ),
                  t = (0, s.ensureNotNull)(
                    this.pointToScreenPoint(this._points[1]),
                  )
                let i = (0, s.ensureNotNull)(
                  this.pointToScreenPoint(this._points[2]),
                )
                const o = t.subtract(e).length()
                let r = i.subtract(e)
                r.length() <= 0 && (r = new n.Point(1, 0)),
                  (i = e.add(r.normalized().scaled(o)))
                const a = (0, s.ensureNotNull)(this.screenPointToPoint(i)),
                  l = this._pointsProperty.childs().points[2]
                l.childs().price.setValue(a.price),
                  l.childs().bar.setValue(a.index)
              }
            } finally {
              this._recursiveGuard = !1
            }
        }
        addPoint(e) {
          if (2 === this._points.length) {
            const t = (0, s.ensureNotNull)(
                this.pointToScreenPoint(this._points[0]),
              ),
              i = (0, s.ensureNotNull)(this.pointToScreenPoint(this._points[1]))
            let n = (0, s.ensureNotNull)(this.pointToScreenPoint(e))
            const o = i.subtract(t).length(),
              r = n.subtract(t).normalized()
            n = t.add(r.scaled(o))
            const a = (0, s.ensureNotNull)(this.ownerSource()),
              l = (0, s.ensureNotNull)(a.firstValue()),
              c = (0, s.ensureNotNull)(this.priceScale()).coordinateToPrice(
                n.y,
                l,
              )
            e = {
              index: Math.round(this._model.timeScale().coordinateToIndex(n.x)),
              price: c,
            }
          }
          return super.addPoint(e)
        }
        editableTextProperties() {
          ;(0, s.assert)(!1, 'unexpected method call')
        }
      }
    },
    24362: (e, t, i) => {
      i.d(t, {
        InplaceTextLineDataSource: () => m,
        InplaceTextUndoCommand: () => T,
      })
      var s = i(50279),
        n = i(50151),
        o = i(86441),
        r = i(19625),
        a = i(24377),
        l = i(11542),
        c = i(45126),
        u = i(88960),
        h = i(64147),
        d = i(60265),
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
      class T extends d.UndoCommand {
        constructor(e, t, s, n) {
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
      class m extends p.LineDataSource {
        constructor(e, t, s, n) {
          super(e, t, s, n),
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
            (this._isDarkBackground = (0, u.combine)(
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
        async _openTextEditor(e, t, s, r, a) {
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
              text: u,
              textColor: h,
              wordWrap: d,
            } = this.editableTextProperties(),
            { forbidLineBreaks: p, maxLength: x } = this.editableTextStyle()
          this._editableText.setValue(u.value())
          const P = this.isFixed()
              ? (0, n.ensureDefined)(this.fixedPoint())
              : (0, n.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            g = {
              position: (0, o.point)(P.x, P.y),
              textInfo: t,
              placeholder: s,
              text: this._editableText,
              textColor: h,
              wordWrap: d,
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
          return new T(this._model, this, e, t)
        }
        _createDataSourceBackgroundColorWV() {
          return new h.WatchedValue(null).readonly().ownership()
        }
      }
    },
    12120: (e, t, i) => {
      i.r(t), i.d(t, { LineToolProjection: () => a })
      var s,
        n = i(90882),
        o = i(15399),
        r = i(73305)
      !((e) => {
        e[(e.LevelsCount = 1)] = 'LevelsCount'
      })(s || (s = {}))
      class a extends n.LineToolFibWedgeBase {
        constructor(e, t, s, n) {
          super(
            e,
            t ?? a.createProperties(e.backgroundTheme().spawnOwnership()),
            s,
            n,
          ),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 31869))
              .then((e) => {
                this._setPaneViews([
                  new e.ProjectionLinePaneView(this, this._model),
                ])
              })
        }
        levelsCount() {
          return 1
        }
        name() {
          return 'Projection'
        }
        static createProperties(e, t) {
          const i = new o.LevelsProperty({
            defaultName: 'linetoolprojection',
            state: t,
            map: { range: [1, 1] },
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
            ]).then(i.bind(i, 48306))
          ).ProjectionDefinitionsViewModel
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.addChild(
              'linesColors',
              new r.LineToolColorsProperty([
                e.childs().trendline.childs().color,
              ]),
            )
        }
      }
    },
  },
])
