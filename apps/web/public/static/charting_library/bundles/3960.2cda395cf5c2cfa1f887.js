;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3960],
  {
    73174: (e, t, o) => {
      o.r(t),
        o.d(t, {
          getCoordinateXMetaInfo: () => b,
          getCoordinateYMetaInfo: () => T,
          getCoordinatesPropertiesDefinitions: () => x,
          getSelectionCoordinatesPropertyDefinition: () => C,
        })
      var i = o(50151),
        n = o(11542),
        r = o(45126),
        a = o(44672),
        l = o(60265)
      class s extends l.UndoCommand {
        constructor({ lineToolId: e, chartModel: t, newPositionPoints: o }) {
          super(null),
            (this._pointState = null),
            (this._lineToolId = e),
            (this._model = t),
            (this._newPositionPoints = o)
        }
        redo() {
          const e = (0, i.ensureNotNull)(
            this._model.dataSourceForId(this._lineToolId),
          )
          ;(this._pointState = [e.normalizedPoints(), e.points()]),
            e.startChanging(),
            e.moveLineTool(this._newPositionPoints),
            this._model.updateSource(e),
            e.updateAllViews((0, a.sourceChangeEvent)(e.id())),
            e.syncMultichartState(e.endChanging(!0, !1))
        }
        undo() {
          if (this._pointState) {
            const e = (0, i.ensureNotNull)(
              this._model.dataSourceForId(this._lineToolId),
            )
            e.startChanging(),
              e.restorePoints(...this._pointState),
              this._model.updateSource(e),
              e.updateAllViews((0, a.sourceChangeEvent)(e.id())),
              e.syncMultichartState(e.endChanging(!0, !1))
          }
        }
      }
      var d = o(32097),
        c = o(64147),
        u = o(12988),
        h = o(91682)
      const p = -5e4,
        m = 15e3,
        g = new r.TranslatedString(
          'change price Y coordinate',
          n.t(null, void 0, o(11737)),
        ),
        f = new r.TranslatedString(
          'change bar X coordinate',
          n.t(null, void 0, o(2066)),
        ),
        v = new r.TranslatedString('move drawings', n.t(null, void 0, o(76261)))
      function T(e, t, o) {
        return {
          property: (0, d.convertToDefinitionProperty)(e, t.price, g),
          info: { typeY: 1, stepY: o },
        }
      }
      function b(e, t) {
        return {
          property: (0, d.convertToDefinitionProperty)(e, t.bar, f),
          info: {
            typeX: 0,
            minX: new c.WatchedValue(p),
            maxX: new c.WatchedValue(m),
            stepX: new c.WatchedValue(1),
          },
        }
      }
      function x(e, t, o, i, n, r) {
        const a = b(e, t),
          l = T(e, t, i)
        return (0, d.createCoordinatesPropertyDefinition)(
          { x: a.property, y: l.property },
          {
            id: (0, h.removeSpaces)(`${r}Coordinates${n}`),
            title: n,
            ...a.info,
            ...l.info,
          },
        )
      }
      const _ = /^([+*\-\/]?)((?:\d*)|(?:\d+\.\d*))$/
      function y(e, t, o) {
        const n = new u.Property(''),
          r = (0, d.makeProxyDefinitionProperty)(n.weakReference())
        return (
          (r.setValue = (r) => {
            try {
              const n = r.match(_)
              if (!n) return
              const [, a, l] = n
              if (!l.length) return
              const d = o(Number.parseFloat(l))
              if ('/' === a && (0 === d.price || 0 === d.index)) return
              t.withMacro(v, () => {
                e.filter((e) => !e.isSourceHidden()).forEach((e) => {
                  const o = e.points()
                  let n
                  switch (a) {
                    case '': {
                      const e = (0, i.ensureDefined)(o[0])
                      let { index: t = e.index, price: r = e.price } = d
                      ;(r -= e.price),
                        (t -= e.index),
                        (n = o.map((e) => ({
                          ...e,
                          index: e.index + t,
                          price: e.price + r,
                        })))
                      break
                    }
                    case '-':
                    case '+': {
                      let { index: e = 0, price: t = 0 } = d
                      '-' === a && ((e *= -1), (t *= -1)),
                        (n = o.map((o) => ({
                          ...o,
                          index: o.index + e,
                          price: o.price + t,
                        })))
                      break
                    }
                    case '*': {
                      const { index: e = 1, price: t = 1 } = d
                      n = o.map((o) => ({
                        ...o,
                        index: o.index * e,
                        price: o.price * t,
                      }))
                      break
                    }
                    case '/': {
                      const { index: e = 1, price: t = 1 } = d
                      n = o.map((o) => ({
                        ...o,
                        index: o.index / e,
                        price: o.price / t,
                      }))
                      break
                    }
                  }
                  t.undoHistory().pushUndoCommand(
                    new s({
                      lineToolId: e.id(),
                      chartModel: t.model(),
                      newPositionPoints: n,
                    }),
                  )
                })
              })
            } finally {
              n.setValue('', !0)
            }
          }),
          r
        )
      }
      function C(e, t) {
        const i = y(e, t, (e) => ({ index: e })),
          r = y(e, t, (e) => ({ price: e }))
        return (0, d.createSelectionCoordinatesPropertyDefinition)(
          { x: i, y: r },
          {
            id: 'SourcesCoordinates',
            title: n.t(null, void 0, o(44272)),
            mathOperationsX: '+',
            mathOperationsY: '+/*',
            modeX: 'integer',
            modeY: 'float',
          },
        )
      }
    },
    91335: (e, t, o) => {
      o.d(t, { createTextStyleDefinition: () => P })
      var i = o(11542),
        n = o(45126),
        r = o(32097),
        a = o(91682)
      const l = new n.TranslatedString(
          'change {toolName} text visibility',
          i.t(null, void 0, o(56634)),
        ),
        s = new n.TranslatedString(
          'change {toolName} text color',
          i.t(null, void 0, o(64500)),
        ),
        d = new n.TranslatedString(
          'change {toolName} text font size',
          i.t(null, void 0, o(21781)),
        ),
        c = new n.TranslatedString(
          'change {toolName} text font bold',
          i.t(null, void 0, o(24701)),
        ),
        u = new n.TranslatedString(
          'change {toolName} text font italic',
          i.t(null, void 0, o(42694)),
        ),
        h = new n.TranslatedString(
          'change {toolName} text',
          i.t(null, void 0, o(66668)),
        ),
        p = new n.TranslatedString(
          'change {toolName} labels alignment vertical',
          i.t(null, void 0, o(31689)),
        ),
        m = new n.TranslatedString(
          'change {toolName} labels alignment horizontal',
          i.t(null, void 0, o(88277)),
        ),
        g = new n.TranslatedString(
          'change {toolName} labels direction',
          i.t(null, void 0, o(61160)),
        ),
        f = new n.TranslatedString(
          'change {toolName} text background visibility',
          i.t(null, void 0, o(31133)),
        ),
        v = new n.TranslatedString(
          'change {toolName} text background color',
          i.t(null, void 0, o(22231)),
        ),
        T = new n.TranslatedString(
          'change {toolName} text border visibility',
          i.t(null, void 0, o(58704)),
        ),
        b = new n.TranslatedString(
          'change {toolName} text border width',
          i.t(null, void 0, o(35423)),
        ),
        x = new n.TranslatedString(
          'change {toolName} text border color',
          i.t(null, void 0, o(36666)),
        ),
        _ = new n.TranslatedString(
          'change {toolName} text wrap',
          i.t(null, void 0, o(39587)),
        ),
        y = i.t(null, void 0, o(79468)),
        C = i.t(null, void 0, o(38408)),
        w = i.t(null, void 0, o(7560))
      function P(e, t, o, i) {
        const n = {},
          P = {
            id: `${(0, a.removeSpaces)(o.originalText())}Text`,
            title: (i.customTitles && i.customTitles.text) || '',
          }
        if (
          (void 0 !== t.showText &&
            (n.checked = (0, r.convertToDefinitionProperty)(
              e,
              t.showText,
              l.format({ toolName: o }),
            )),
          void 0 !== t.textColor &&
            (n.color = (0, r.getColorDefinitionProperty)(
              e,
              t.textColor,
              t.transparency || null,
              s.format({ toolName: o }),
            )),
          void 0 !== t.fontSize &&
            (n.size = (0, r.convertToDefinitionProperty)(
              e,
              t.fontSize,
              d.format({ toolName: o }),
            )),
          void 0 !== t.bold &&
            (n.bold = (0, r.convertToDefinitionProperty)(
              e,
              t.bold,
              c.format({ toolName: o }),
            )),
          void 0 !== t.italic &&
            (n.italic = (0, r.convertToDefinitionProperty)(
              e,
              t.italic,
              u.format({ toolName: o }),
            )),
          void 0 !== t.text &&
            ((n.text = (0, r.convertToDefinitionProperty)(
              e,
              t.text,
              h.format({ toolName: o }),
            )),
            (P.isEditable = Boolean(i.isEditable)),
            (P.isMultiLine = Boolean(i.isMultiLine))),
          void 0 !== t.vertLabelsAlign &&
            ((n.alignmentVertical = (0, r.convertToDefinitionProperty)(
              e,
              t.vertLabelsAlign,
              p.format({ toolName: o }),
            )),
            (P.alignmentVerticalItems = i.alignmentVerticalItems)),
          void 0 !== t.horzLabelsAlign &&
            ((n.alignmentHorizontal = (0, r.convertToDefinitionProperty)(
              e,
              t.horzLabelsAlign,
              m.format({ toolName: o }),
            )),
            (P.alignmentHorizontalItems = i.alignmentHorizontalItems)),
          void 0 !== t.textOrientation &&
            (n.orientation = (0, r.convertToDefinitionProperty)(
              e,
              t.textOrientation,
              g.format({ toolName: o }),
            )),
          void 0 !== t.backgroundVisible &&
            (n.backgroundVisible = (0, r.convertToDefinitionProperty)(
              e,
              t.backgroundVisible,
              f.format({ toolName: o }),
            )),
          void 0 !== t.backgroundColor)
        ) {
          let i = null
          void 0 !== t.backgroundTransparency && (i = t.backgroundTransparency),
            (n.backgroundColor = (0, r.getColorDefinitionProperty)(
              e,
              t.backgroundColor,
              i,
              v.format({ toolName: o }),
            ))
        }
        return (
          (void 0 === t.backgroundVisible && void 0 === t.backgroundColor) ||
            (P.backgroundTitle =
              (i.customTitles && i.customTitles.backgroundTitle) || y),
          void 0 !== t.borderVisible &&
            (n.borderVisible = (0, r.convertToDefinitionProperty)(
              e,
              t.borderVisible,
              T.format({ toolName: o }),
            )),
          void 0 !== t.borderWidth &&
            (n.borderWidth = (0, r.convertToDefinitionProperty)(
              e,
              t.borderWidth,
              b.format({ toolName: o }),
            )),
          void 0 !== t.borderColor &&
            (n.borderColor = (0, r.getColorDefinitionProperty)(
              e,
              t.borderColor,
              null,
              x.format({ toolName: o }),
            )),
          (void 0 === t.borderVisible &&
            void 0 === t.borderColor &&
            void 0 === t.borderWidth) ||
            (P.borderTitle =
              (i.customTitles && i.customTitles.borderTitle) || C),
          void 0 !== t.wrap &&
            ((n.wrap = (0, r.convertToDefinitionProperty)(
              e,
              t.wrap,
              _.format({ toolName: o }),
            )),
            (P.wrapTitle = (i.customTitles && i.customTitles.wrapTitle) || w)),
          (0, r.createTextPropertyDefinition)(n, P)
        )
      }
    },
    69113: (e, t, o) => {
      o.r(t), o.d(t, { LineToolBalloon: () => V })
      var i = o(50151),
        n = o(11542),
        r = o(32679),
        a = o(24362),
        l = o(12988),
        s = o(73305),
        d = o(45126),
        c = o(91335),
        u = o(18009)
      const h = n.t(null, void 0, o(70320))
      class p extends u.LineDataSourceDefinitionsViewModel {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, c.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.color,
                  fontSize: e.fontsize,
                  text: e.text,
                  backgroundColor: e.backgroundColor,
                  backgroundTransparency: e.transparency,
                  borderColor: e.borderColor,
                },
                new d.TranslatedString(
                  this._source.name(),
                  this._source.translatedType(),
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: h } },
              ),
            ],
          }
        }
      }
      var m,
        g = o(19063),
        f = o(68979),
        v = o(15938),
        T = o(27916),
        b = o(36036),
        x = o(95201),
        _ = o(11064),
        y = o(56468),
        C = o(86441),
        w = o(34026),
        P = o(63273),
        S = o(7114),
        N = o(75919)
      !((e) => {
        ;(e[(e.Radius = 15)] = 'Radius'),
          (e[(e.TailApexXOffsetFromTextStart = 20)] =
            'TailApexXOffsetFromTextStart'),
          (e[(e.TailHeight = 9)] = 'TailHeight')
      })(m || (m = {}))
      class k extends N.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments),
            (this._geometryCache = {
              innerHeight: Number.NaN,
              textHorizontalPadding: Number.NaN,
              innerWidth: Number.NaN,
              paddingLeft: Number.NaN,
            }),
            (this._geomertryCacheInvalidated = !0),
            (this._data = null)
        }
        setData(e) {
          ;(this._data = e), (this._geomertryCacheInvalidated = !0)
        }
        hitTest(e) {
          if (null === this._data || 0 === this._data.points.length) return null
          const t =
              this._data.points[0].x - (this._geometryCache.paddingLeft + 20),
            o = this._data.points[0].y - (this._geometryCache.innerHeight + 9),
            i = (0, C.box)(
              new C.Point(t, o),
              new C.Point(
                t + this._geometryCache.innerWidth,
                o + this._geometryCache.innerHeight,
              ),
            )
          return (0, w.pointInBox)(e, i)
            ? new y.HitTestResult(y.HitTarget.MovePoint, {
                areaName: y.AreaName.Text,
              })
            : null
        }
        _drawImpl(e) {
          if (null === this._data || 0 === this._data.points.length) return
          const t = e.context
          t.font = this._data.font
          const o = this._measureInfo(t, this._data.label, this._data.fontSize),
            {
              paddingLeft: i,
              innerHeight: n,
              innerWidth: r,
              textHorizontalPadding: a,
            } = o
          t.textAlign = (0, P.isRtl)() ? 'right' : 'left'
          const l = this._data.points[0].x - (i + 20),
            s = this._data.points[0].y - (n + 9)
          t.translate(l, s),
            t.beginPath(),
            t.moveTo(24, n),
            t.lineTo(15, n),
            t.arcTo(-1e3, 0, 1e3, 0, n / 2),
            t.lineTo(r - 15, 0),
            t.arcTo(1e3, n, -1e3, n, n / 2),
            t.lineTo(33, n),
            t.quadraticCurveTo(33, n + 4, 35, n + 9),
            t.quadraticCurveTo(27, n + 6, 24, n),
            (t.fillStyle = this._data.backgroundColor),
            t.fill(),
            (t.strokeStyle = this._data.borderColor),
            (t.lineWidth = 2),
            t.stroke(),
            t.closePath(),
            (t.textBaseline = 'middle'),
            (t.fillStyle = this._data.color),
            t.fillText(this._data.label, i + a, n / 2)
        }
        _measureInfo(e, t, o) {
          if (this._geomertryCacheInvalidated) {
            const i = e.measureText(t),
              n = o,
              r = 15,
              a = Math.round(n / 1.3),
              l = i.width + 2 * r,
              s = n + 2 * a,
              d = (0, S.calcTextHorizontalShift)(e, i.width)
            ;(this._geometryCache = {
              paddingLeft: r,
              innerWidth: l,
              innerHeight: s,
              textHorizontalPadding: d,
            }),
              (this._geomertryCacheInvalidated = !1)
          }
          return this._geometryCache
        }
      }
      class D extends T.LineSourcePaneView {
        constructor(e, t) {
          super(e, t),
            (this._balloonRenderer = new k()),
            (this._renderer = null)
        }
        renderer(e) {
          return this._invalidated && this._updateImpl(e), this._renderer
        }
        _updateImpl(e) {
          super._updateImpl(e)
          const t = this._source.properties().childs(),
            o = {
              points: this._points,
              color: t.color.value(),
              borderColor: t.borderColor.value(),
              backgroundColor: (0, g.generateColor)(
                t.backgroundColor.value(),
                t.transparency.value(),
              ),
              font: (0, f.makeFont)(t.fontsize.value(), v.CHART_FONT_FAMILY),
              fontSize: t.fontsize.value(),
              label: t.text.value(),
            }
          if ((this._balloonRenderer.setData(o), 1 === o.points.length)) {
            const e = new x.CompositeRenderer()
            return (
              e.append(this._balloonRenderer),
              e.append(
                new _.SelectionRenderer({
                  points: o.points.map(
                    b.mapLineSourcePaneViewPointToLineAnchorPoint,
                  ),
                  bgColors: this._lineAnchorColors(o.points),
                  visible: this.areAnchorsVisible(),
                  barSpacing: this._model.timeScale().barSpacing(),
                  hittestResult: y.HitTarget.MovePoint,
                }),
              ),
              void (this._renderer = e)
            )
          }
          this._renderer = this._balloonRenderer
        }
      }
      const I = n.t(null, void 0, o(9818))
      class V extends a.InplaceTextLineDataSource {
        constructor(e, t, o, i) {
          super(
            e,
            t ?? V.createProperties(e.backgroundTheme().spawnOwnership()),
            o,
            i,
          ),
            this._createPaneView()
        }
        pointsCount() {
          return 1
        }
        name() {
          return 'Balloon'
        }
        template() {
          const e = super.template()
          return (e.text = this.properties().childs().text.value()), e
        }
        shouldBeRemovedOnDeselect() {
          return '' === this._properties.childs().text.value().trim()
        }
        editableTextProperties() {
          ;(0, i.assert)(!1, 'unexpected method call')
        }
        static createProperties(e, t) {
          const o = new r.DefaultProperty({
            defaultName: 'linetoolballoon',
            state: t,
            theme: e,
          })
          return this._configureProperties(o), o
        }
        _applyTemplateImpl(e) {
          super._applyTemplateImpl(e),
            this.properties().childs().text.setValue(e.text)
        }
        async _getPropertyDefinitionsViewModelClass() {
          return p
        }
        _createPaneView() {
          this._setPaneViews([new D(this, this._model)])
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.hasChild('text') ||
              e.addChild('text', new l.Property(this._defaultText)),
            e.addExcludedKey('text', 1),
            e.addChild(
              'linesColors',
              new s.LineToolColorsProperty([e.childs().borderColor]),
            ),
            e.addChild(
              'textsColors',
              new s.LineToolColorsProperty([e.childs().color]),
            )
        }
      }
      V._defaultText = I
    },
  },
])
