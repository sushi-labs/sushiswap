;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8422],
  {
    6590: (e, t, i) => {
      i.d(t, { commonLineToolPropertiesStateKeys: () => s })
      const s = [
        'symbolStateVersion',
        'zOrderVersion',
        'frozen',
        'title',
        'interval',
        'symbol',
        'currencyId',
        'unitId',
        'visible',
        'intervalsVisibilities.ticks',
        'intervalsVisibilities.seconds',
        'intervalsVisibilities.secondsFrom',
        'intervalsVisibilities.secondsTo',
        'intervalsVisibilities.minutes',
        'intervalsVisibilities.minutesFrom',
        'intervalsVisibilities.minutesTo',
        'intervalsVisibilities.hours',
        'intervalsVisibilities.hoursFrom',
        'intervalsVisibilities.hoursTo',
        'intervalsVisibilities.days',
        'intervalsVisibilities.daysFrom',
        'intervalsVisibilities.daysTo',
        'intervalsVisibilities.weeks',
        'intervalsVisibilities.weeksFrom',
        'intervalsVisibilities.weeksTo',
        'intervalsVisibilities.months',
        'intervalsVisibilities.monthsFrom',
        'intervalsVisibilities.monthsTo',
        'intervalsVisibilities.ranges',
      ]
      var n, o, r
      !((e) => {
        ;(e[(e.NotShared = 0)] = 'NotShared'),
          (e[(e.SharedInLayout = 1)] = 'SharedInLayout'),
          (e[(e.GloballyShared = 2)] = 'GloballyShared')
      })(n || (n = {})),
        ((e) => {
          ;(e.BeforeAllAction = 'BeforeAll'), (e.CustomAction = 'CustomAction')
        })(o || (o = {})),
        ((e) => {
          ;(e.FloatingToolbarButton = 'FloatingToolbarButton'),
            (e.Default = 'Default')
        })(r || (r = {}))
    },
    24362: (e, t, i) => {
      i.d(t, {
        InplaceTextLineDataSource: () => g,
        InplaceTextUndoCommand: () => P,
      })
      var s = i(50279),
        n = i(50151),
        o = i(86441),
        r = i(19625),
        a = i(24377),
        l = i(11542),
        c = i(45126),
        h = i(88960),
        d = i(64147),
        u = i(60265),
        p = i(29875),
        _ = i(44672),
        x = i(85719)
      const T = {
          selectionColor: (0, r.getHexColorByName)('color-tv-blue-500'),
          cursorColor: (0, r.getHexColorByName)('color-black'),
        },
        b = {
          selectionColor: (0, r.getHexColorByName)('color-white'),
          cursorColor: (0, r.getHexColorByName)('color-white'),
        }
      class P extends u.UndoCommand {
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
      class g extends p.LineDataSource {
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
              this.updateAllViewsAndRedraw((0, _.sourceChangeEvent)(this.id()))
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
          return { ...(this._isDarkBackground.value() ? b : T) }
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
              text: h,
              textColor: d,
              wordWrap: u,
            } = this.editableTextProperties(),
            { forbidLineBreaks: p, maxLength: x } = this.editableTextStyle()
          this._editableText.setValue(h.value())
          const T = this.isFixed()
              ? (0, n.ensureDefined)(this.fixedPoint())
              : (0, n.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            b = {
              position: (0, o.point)(T.x, T.y),
              textInfo: t,
              placeholder: s,
              text: this._editableText,
              textColor: d,
              wordWrap: u,
              forbidLineBreaks: p,
              maxLength: x,
              onClose: r,
              onSelectionChange: a,
              onContextMenu: this.onContextMenu
                ? this.onContextMenu.bind(this)
                : void 0,
            }
          l(this._container, b),
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
          return new P(this._model, this, e, t)
        }
        _createDataSourceBackgroundColorWV() {
          return new d.WatchedValue(null).readonly().ownership()
        }
      }
    },
    38039: (e, t, i) => {
      i.d(t, { LineDataSourceProperty: () => a })
      var s = i(90054),
        n = i(16738),
        o = i(50151),
        r = i(32679)
      class a extends r.DefaultProperty {
        constructor({ templateKeys: e, ...t }) {
          super({
            ignoreAllowSavingDefaults: !0,
            saveNonDefaultUserPreferencesOnly: !0,
            ...t,
          }),
            (this._templateKeys = (0, o.ensureDefined)(
              e || this._allDefaultsKeys,
            ))
        }
        template() {
          return (0, r.extractState)(this.state(), this._templateKeys, [])
        }
        applyTemplate(e) {
          this.mergeAndFire(
            (0, r.extractState)(
              (0, n.default)(
                (0, s.default)(this._factoryDefaultsSupplier()),
                e,
              ),
              this._templateKeys,
            ),
          )
        }
      }
    },
    63397: (e, t, i) => {
      i.r(t), i.d(t, { Constants: () => A, LineToolRectangle: () => D })
      var s = i(50151),
        n = i(86441),
        o = i(88960),
        r = i(42752),
        a = i(12988),
        l = i(24362),
        c = i(73305),
        h = i(24633),
        d = i(49156),
        u = i(32679),
        p = i(11402),
        _ = i(31229),
        x = i(85904),
        T = i(30699),
        b = i(6590),
        P = i(38039),
        g = i(35578)
      const m = {
          intervalsVisibilities: { ..._.intervalsVisibilitiesDefaults },
          color: d.colors.colorGrapesPurple500,
          fillBackground: !0,
          backgroundColor: d.colors.colorGrapesPurple500Alpha20,
          linewidth: g.DEFAULT_LINE_TOOL_LINE_WIDTH,
          transparency: 50,
          showLabel: !1,
          horzLabelsAlign: T.HorizontalAlign.Center,
          vertLabelsAlign: T.VerticalAlign.Middle,
          textColor: d.colors.colorGrapesPurple500,
          fontSize: 14,
          bold: !1,
          italic: !1,
          extendLeft: !1,
          extendRight: !1,
          middleLine: {
            showLine: !1,
            lineWidth: 1,
            lineColor: d.colors.colorGrapesPurple500,
            lineStyle: x.LineStyle.Dashed,
          },
          linestyle: x.LineStyle.Solid,
        },
        y = new Map([
          [h.StdTheme.Light, {}],
          [h.StdTheme.Dark, {}],
        ]),
        w = (0, u.extractThemedColors)(
          (0, s.ensureDefined)(y.get(h.StdTheme.Light)),
          (0, s.ensureDefined)(y.get(h.StdTheme.Dark)),
        ),
        f = (0, u.extractAllPropertiesKeys)(
          (0, s.ensureDefined)(y.get(h.StdTheme.Light)),
        ),
        C = (0, u.extractAllPropertiesKeys)(m),
        v = [
          ...new Set([
            ...f,
            ...C,
            ...b.commonLineToolPropertiesStateKeys,
            'text',
          ]),
        ],
        V = [...new Set([...f, ...C, 'text'])]
      class S extends P.LineDataSourceProperty {
        constructor(e) {
          super(e), this.hasChild('text') || this.addProperty('text', '')
        }
        static create(e, t, i) {
          return new this({
            defaultName: 'linetoolrectangle',
            factoryDefaultsSupplier: () =>
              (0, p.factoryDefaultsForCurrentTheme)(m, y),
            nonThemedDefaultsKeys: C,
            themedDefaultsKeys: f,
            allStateKeys: v,
            themedColors: w,
            templateKeys: V,
            replaceThemedColorsOnThemeChange: !0,
            state: t,
            theme: e,
            useUserPreferences: i,
          })
        }
      }
      var A
      !((e) => {
        ;(e[(e.LeftTopAnchor = 0)] = 'LeftTopAnchor'),
          (e[(e.TopMiddleAnchor = 6)] = 'TopMiddleAnchor'),
          (e[(e.RightTopAnchor = 3)] = 'RightTopAnchor'),
          (e[(e.RightMiddleAnchor = 5)] = 'RightMiddleAnchor'),
          (e[(e.RightBottomAnchor = 1)] = 'RightBottomAnchor'),
          (e[(e.BottomMiddleAnchor = 7)] = 'BottomMiddleAnchor'),
          (e[(e.LeftBottomAnchor = 2)] = 'LeftBottomAnchor'),
          (e[(e.LeftMiddleAnchor = 4)] = 'LeftMiddleAnchor')
      })(A || (A = {}))
      class D extends l.InplaceTextLineDataSource {
        constructor(e, t, s, n) {
          super(
            e,
            t ?? D.createProperties(e.backgroundTheme().spawnOwnership()),
            s,
            n,
          ),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 41883))
              .then(({ RectanglePaneView: t }) => {
                const i = [
                  new t(
                    this,
                    e,
                    this._openTextEditor.bind(this),
                    this._closeTextEditor.bind(this),
                    this.onSelectionChange.bind(this),
                  ),
                ]
                this._setPaneViews(i)
              })
        }
        pointsCount() {
          return 2
        }
        textColorsProperty() {
          return this.properties().childs().showLabel.value()
            ? super.textColorsProperty()
            : null
        }
        name() {
          return 'Rectangle'
        }
        setPoint(e, t, i) {
          if (e < 2) return void super.setPoint(e, t, i)
          if (this._snapTo45DegreesApplicable(i)) {
            const i = this._getSnapTo45DegreesAnchorPoint(e)
            if (e >= 4)
              return (
                this._correctMiddlePoints(e, t, i), void this._normalizePoints()
              )
            this.snapPoint45Degree(t, i)
          }
          const s = this._model.mainSeries().interval()
          switch (e) {
            case 2:
              ;(this._points[1].price = t.price),
                (this._points[0].index = t.index),
                (this._points[0].interval = s)
              break
            case 3:
              ;(this._points[0].price = t.price),
                (this._points[1].index = t.index),
                (this._points[1].interval = s)
              break
            case 4:
              ;(this._points[0].index = t.index), (this._points[0].interval = s)
              break
            case 5:
              ;(this._points[1].index = t.index), (this._points[1].interval = s)
              break
            case 6:
              this._points[0].price = t.price
              break
            case 7:
              this._points[1].price = t.price
          }
          this._normalizePoints()
        }
        getPoint(e) {
          return e < 2 ? super.getPoint(e) : this._getAnchorPointForIndex(e)
        }
        template() {
          return this._properties.template()
        }
        snapTo45DegreesAvailable() {
          return !0
        }
        snapPoint45Degree(e, t, i) {
          const n = this._priceScale,
            o = this.ownerSource()
          if (null === n || null === o) return
          const r = o.firstValue()
          if (null === r) return
          const a = this._model.timeScale(),
            l = (0, s.ensureNotNull)(this.pointToScreenPoint(e)),
            c = (0, s.ensureNotNull)(this.pointToScreenPoint(t)),
            h = l.x - c.x,
            d = l.y - c.y,
            u = h < 0 ? -1 : 1,
            p = d < 0 ? -1 : 1,
            _ = Math.max(Math.abs(h), Math.abs(d)),
            x = Math.round(a.coordinateToIndex(c.x + _ * u)),
            T = Math.abs(a.indexToCoordinate(x) - c.x),
            b = n.coordinateToPrice(c.y + T * p, r)
          ;(e.index = x), (e.price = b)
        }
        editableTextProperties() {
          const e = this.properties().childs()
          return {
            text: e.text,
            textColor: e.textColor,
            textVisible: e.showLabel,
          }
        }
        static createProperties(e, t, i) {
          const s = S.create(e, t, i)
          return this._configureProperties(s), s
        }
        _getPropertyDefinitionsViewModelClass() {
          return Promise.all([
            i.e(6406),
            i.e(3889),
            i.e(8009),
            i.e(8056),
            i.e(8537),
          ])
            .then(i.bind(i, 15041))
            .then((e) => e.RectangleDefinitionsViewModel)
        }
        _applyTemplateImpl(e) {
          super._applyTemplateImpl(e),
            this.properties().childs().text.setValue(e.text)
        }
        _createDataSourceBackgroundColorWV() {
          const { fillBackground: e, backgroundColor: t } =
            this.properties().childs()
          return (0, o.combine)(
            () => (e.value() ? t.value() : null),
            (0, r.convertPropertyToWatchedValue)(e).ownership(),
            (0, r.convertPropertyToWatchedValue)(t).ownership(),
          ).ownership()
        }
        _correctMiddlePoints(e, t, i) {
          e < 6
            ? this._correctRightLeftMiddlePoint(e, t, i)
            : this._correctTopBottomMiddlePoint(e, t, i)
        }
        _correctRightLeftMiddlePoint(e, t, i) {
          const o = (0, s.ensureNotNull)(this.pointToScreenPoint(t)),
            r = (0, s.ensureNotNull)(this.pointToScreenPoint(i)),
            a = (0, s.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            l = (0, s.ensureNotNull)(this.pointToScreenPoint(this._points[1]))
          let c = o.x - r.x
          if (0 === c) return
          const h = a.x < l.x ? 1 : -1,
            d = a.y < l.y ? 1 : -1
          switch (((c *= h), e)) {
            case 4: {
              const e = l.y - (d * c) / 2,
                t = (0, s.ensureNotNull)(
                  this.screenPointToPoint(new n.Point(l.x, e)),
                )
              this._points[1].price = t.price
              const i = (0, s.ensureNotNull)(
                this.screenPointToPoint(
                  new n.Point(a.x + h * c, a.y + (d * c) / 2),
                ),
              )
              ;(this._points[0].price = i.price),
                (this._points[0].index = i.index)
              break
            }
            case 5: {
              const e = a.y - (d * c) / 2,
                t = (0, s.ensureNotNull)(
                  this.screenPointToPoint(new n.Point(a.x, e)),
                )
              this._points[0].price = t.price
              const i = (0, s.ensureNotNull)(
                this.screenPointToPoint(
                  new n.Point(l.x + h * c, l.y + (d * c) / 2),
                ),
              )
              ;(this._points[1].price = i.price),
                (this._points[1].index = i.index)
              break
            }
          }
        }
        _correctTopBottomMiddlePoint(e, t, i) {
          const o = this._priceScale,
            r = this.ownerSource()
          if (null === o || null === r) return
          const a = this._model.timeScale(),
            l = r.firstValue()
          if (null === l) return
          const c = (0, s.ensureNotNull)(this.pointToScreenPoint(t)),
            h = (0, s.ensureNotNull)(this.pointToScreenPoint(i)),
            d = (0, s.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            u = (0, s.ensureNotNull)(this.pointToScreenPoint(this._points[1])),
            p = c.y - h.y,
            _ = p < 0 ? -1 : 1,
            x = d.x < u.x ? 1 : -1,
            T = d.y < u.y ? 1 : -1
          switch (e) {
            case 6: {
              const e = Math.floor(u.x - (x * p) / 2),
                t = (0, s.ensureNotNull)(
                  this.screenPointToPoint(new n.Point(e, u.y)),
                ),
                i = Math.abs(this._points[1].index - t.index),
                r = x * T * _ * Math.ceil(i / 2)
              if (0 === r) return
              this._points[1].index = this._points[1].index - r
              const c =
                _ * Math.abs(a.indexToCoordinate(this._points[1].index) - u.x)
              ;(this._points[0].price = o.coordinateToPrice(d.y + c, l)),
                (this._points[0].index = this._points[0].index + r)
              break
            }
            case 7: {
              const e = Math.floor(d.x - (x * p) / 2),
                t = (0, s.ensureNotNull)(
                  this.screenPointToPoint(new n.Point(e, d.y)),
                ),
                i = Math.abs(this._points[0].index - t.index),
                r = x * T * _ * Math.ceil(i / 2)
              if (0 === r) return
              this._points[0].index = this._points[0].index - r
              const c =
                _ * Math.abs(a.indexToCoordinate(this._points[0].index) - d.x)
              ;(this._points[1].price = o.coordinateToPrice(u.y + c, l)),
                (this._points[1].index = this._points[1].index + r)
              break
            }
          }
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.hasChild('text') || e.addChild('text', new a.Property('')),
            e.addChild(
              'linesColors',
              new c.LineToolColorsProperty([e.childs().color]),
            ),
            e.addChild(
              'textsColors',
              new c.LineToolColorsProperty(
                [e.childs().textColor],
                e.childs().showLabel,
              ),
            ),
            e.addExcludedKey('text', 1),
            e.addExcludedKey('linesColors', 1),
            e.addExcludedKey('textsColors', 1)
        }
        _getAnchorPointForIndex(e) {
          const t = this.points(),
            i = t[0],
            s = t[1]
          let n = 0,
            o = 0
          switch (e) {
            case 0:
              ;(n = i.price), (o = i.index)
              break
            case 1:
              ;(n = s.price), (o = s.index)
              break
            case 2:
              ;(n = s.price), (o = i.index)
              break
            case 3:
              ;(n = i.price), (o = s.index)
              break
            case 4:
              ;(n = (s.price + i.price) / 2), (o = i.index)
              break
            case 5:
              ;(n = (s.price + i.price) / 2), (o = s.index)
              break
            case 6:
              ;(n = i.price), (o = (s.index + i.index) / 2)
              break
            case 7:
              ;(n = s.price), (o = (s.index + i.index) / 2)
          }
          return { index: o, price: n }
        }
        _getSnapTo45DegreesAnchorPoint(e) {
          if (e >= 4) return this._getAnchorPointForIndex(e)
          const t = this.points(),
            i = t[0],
            s = t[1]
          let n = 0,
            o = 0
          switch (e) {
            case 0:
              ;(n = s.price), (o = s.index)
              break
            case 1:
              ;(n = i.price), (o = i.index)
              break
            case 2:
              ;(n = i.price), (o = s.index)
              break
            case 3:
              ;(n = s.price), (o = i.index)
          }
          return { index: o, price: n }
        }
      }
    },
    11402: (e, t, i) => {
      i.d(t, { factoryDefaultsForCurrentTheme: () => l })
      var s = i(16738),
        n = i(90054),
        o = i(50151),
        r = i(45345),
        a = i(24633)
      function l(e, t) {
        const i = r.watchedTheme.value() ?? a.StdTheme.Light,
          l = (0, n.default)(e)
        return (0, s.default)(l, (0, o.ensureDefined)(t.get(i))), l
      }
    },
  },
])
