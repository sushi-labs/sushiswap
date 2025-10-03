;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3710],
  {
    73174: (e, t, i) => {
      i.r(t),
        i.d(t, {
          getCoordinateXMetaInfo: () => m,
          getCoordinateYMetaInfo: () => y,
          getCoordinatesPropertiesDefinitions: () => P,
          getSelectionCoordinatesPropertyDefinition: () => w,
        })
      var n = i(50151),
        r = i(11542),
        o = i(45126),
        l = i(44672),
        s = i(60265)
      class a extends s.UndoCommand {
        constructor({ lineToolId: e, chartModel: t, newPositionPoints: i }) {
          super(null),
            (this._pointState = null),
            (this._lineToolId = e),
            (this._model = t),
            (this._newPositionPoints = i)
        }
        redo() {
          const e = (0, n.ensureNotNull)(
            this._model.dataSourceForId(this._lineToolId),
          )
          ;(this._pointState = [e.normalizedPoints(), e.points()]),
            e.startChanging(),
            e.moveLineTool(this._newPositionPoints),
            this._model.updateSource(e),
            e.updateAllViews((0, l.sourceChangeEvent)(e.id())),
            e.syncMultichartState(e.endChanging(!0, !1))
        }
        undo() {
          if (this._pointState) {
            const e = (0, n.ensureNotNull)(
              this._model.dataSourceForId(this._lineToolId),
            )
            e.startChanging(),
              e.restorePoints(...this._pointState),
              this._model.updateSource(e),
              e.updateAllViews((0, l.sourceChangeEvent)(e.id())),
              e.syncMultichartState(e.endChanging(!0, !1))
          }
        }
      }
      var c = i(32097),
        d = i(64147),
        u = i(12988),
        h = i(91682)
      const p = -5e4,
        f = 15e3,
        v = new o.TranslatedString(
          'change price Y coordinate',
          r.t(null, void 0, i(11737)),
        ),
        _ = new o.TranslatedString(
          'change bar X coordinate',
          r.t(null, void 0, i(2066)),
        ),
        g = new o.TranslatedString('move drawings', r.t(null, void 0, i(76261)))
      function y(e, t, i) {
        return {
          property: (0, c.convertToDefinitionProperty)(e, t.price, v),
          info: { typeY: 1, stepY: i },
        }
      }
      function m(e, t) {
        return {
          property: (0, c.convertToDefinitionProperty)(e, t.bar, _),
          info: {
            typeX: 0,
            minX: new d.WatchedValue(p),
            maxX: new d.WatchedValue(f),
            stepX: new d.WatchedValue(1),
          },
        }
      }
      function P(e, t, i, n, r, o) {
        const l = m(e, t),
          s = y(e, t, n)
        return (0, c.createCoordinatesPropertyDefinition)(
          { x: l.property, y: s.property },
          {
            id: (0, h.removeSpaces)(`${o}Coordinates${r}`),
            title: r,
            ...l.info,
            ...s.info,
          },
        )
      }
      const x = /^([+*\-\/]?)((?:\d*)|(?:\d+\.\d*))$/
      function T(e, t, i) {
        const r = new u.Property(''),
          o = (0, c.makeProxyDefinitionProperty)(r.weakReference())
        return (
          (o.setValue = (o) => {
            try {
              const r = o.match(x)
              if (!r) return
              const [, l, s] = r
              if (!s.length) return
              const c = i(Number.parseFloat(s))
              if ('/' === l && (0 === c.price || 0 === c.index)) return
              t.withMacro(g, () => {
                e.filter((e) => !e.isSourceHidden()).forEach((e) => {
                  const i = e.points()
                  let r
                  switch (l) {
                    case '': {
                      const e = (0, n.ensureDefined)(i[0])
                      let { index: t = e.index, price: o = e.price } = c
                      ;(o -= e.price),
                        (t -= e.index),
                        (r = i.map((e) => ({
                          ...e,
                          index: e.index + t,
                          price: e.price + o,
                        })))
                      break
                    }
                    case '-':
                    case '+': {
                      let { index: e = 0, price: t = 0 } = c
                      '-' === l && ((e *= -1), (t *= -1)),
                        (r = i.map((i) => ({
                          ...i,
                          index: i.index + e,
                          price: i.price + t,
                        })))
                      break
                    }
                    case '*': {
                      const { index: e = 1, price: t = 1 } = c
                      r = i.map((i) => ({
                        ...i,
                        index: i.index * e,
                        price: i.price * t,
                      }))
                      break
                    }
                    case '/': {
                      const { index: e = 1, price: t = 1 } = c
                      r = i.map((i) => ({
                        ...i,
                        index: i.index / e,
                        price: i.price / t,
                      }))
                      break
                    }
                  }
                  t.undoHistory().pushUndoCommand(
                    new a({
                      lineToolId: e.id(),
                      chartModel: t.model(),
                      newPositionPoints: r,
                    }),
                  )
                })
              })
            } finally {
              r.setValue('', !0)
            }
          }),
          o
        )
      }
      function w(e, t) {
        const n = T(e, t, (e) => ({ index: e })),
          o = T(e, t, (e) => ({ price: e }))
        return (0, c.createSelectionCoordinatesPropertyDefinition)(
          { x: n, y: o },
          {
            id: 'SourcesCoordinates',
            title: r.t(null, void 0, i(44272)),
            mathOperationsX: '+',
            mathOperationsY: '+/*',
            modeX: 'integer',
            modeY: 'float',
          },
        )
      }
    },
    53749: (e, t, i) => {
      i.d(t, { createLineStyleDefinition: () => y })
      var n = i(11542),
        r = i(45126),
        o = i(32097),
        l = i(91682)
      const s = new r.TranslatedString(
          'change {toolName} line visibility',
          n.t(null, void 0, i(24550)),
        ),
        a = new r.TranslatedString(
          'change {toolName} line width',
          n.t(null, void 0, i(19541)),
        ),
        c = new r.TranslatedString(
          'change {toolName} line style',
          n.t(null, void 0, i(66429)),
        ),
        d = new r.TranslatedString(
          'change {toolName} line color',
          n.t(null, void 0, i(24059)),
        ),
        u = new r.TranslatedString(
          'change {toolName} line extending left',
          n.t(null, void 0, i(18773)),
        ),
        h = new r.TranslatedString(
          'change {toolName} line left end',
          n.t(null, void 0, i(21474)),
        ),
        p = new r.TranslatedString(
          'change {toolName} line extending right',
          n.t(null, void 0, i(43823)),
        ),
        f = new r.TranslatedString(
          'change {toolName} line right end',
          n.t(null, void 0, i(54827)),
        ),
        v = n.t(null, void 0, i(3554)),
        _ = n.t(null, void 0, i(61856)),
        g = n.t(null, void 0, i(87430))
      function y(e, t, i, n, r) {
        const y = {},
          m = {
            id: `${(0, l.removeSpaces)(i.originalText())}${n}`,
            title: (r && r.line) || v,
          }
        return (
          void 0 !== t.showLine &&
            (y.checked = (0, o.convertToDefinitionProperty)(
              e,
              t.showLine,
              s.format({ toolName: i }),
            )),
          void 0 !== t.lineWidth &&
            (y.width = (0, o.convertToDefinitionProperty)(
              e,
              t.lineWidth,
              a.format({ toolName: i }),
            )),
          void 0 !== t.lineStyle &&
            (y.style = (0, o.convertToDefinitionProperty)(
              e,
              t.lineStyle,
              c.format({ toolName: i }),
            )),
          void 0 !== t.lineColor &&
            (y.color = (0, o.getColorDefinitionProperty)(
              e,
              t.lineColor,
              null,
              d.format({ toolName: i }),
            )),
          void 0 !== t.extendLeft &&
            ((y.extendLeft = (0, o.convertToDefinitionProperty)(
              e,
              t.extendLeft,
              u.format({ toolName: i }),
            )),
            (m.extendLeftTitle = (r && r.extendLeftTitle) || _)),
          void 0 !== t.leftEnd &&
            (y.leftEnd = (0, o.convertToDefinitionProperty)(
              e,
              t.leftEnd,
              h.format({ toolName: i }),
            )),
          void 0 !== t.extendRight &&
            ((y.extendRight = (0, o.convertToDefinitionProperty)(
              e,
              t.extendRight,
              p.format({ toolName: i }),
            )),
            (m.extendRightTitle = (r && r.extendRightTitle) || g)),
          void 0 !== t.rightEnd &&
            (y.rightEnd = (0, o.convertToDefinitionProperty)(
              e,
              t.rightEnd,
              f.format({ toolName: i }),
            )),
          (0, o.createLinePropertyDefinition)(y, m)
        )
      }
    },
    15399: (e, t, i) => {
      i.d(t, { LevelsProperty: () => v })
      var n = i(90054),
        r = i(16738),
        o = i(37265),
        l = i(32679),
        s = i(35039)
      const a = {
        prefixes: [''],
        range: [0, 0],
        names: ['coeff', 'color', 'visible', 'linestyle', 'linewidth'],
        typecheck: { pack: () => Object(), unpack: () => [] },
      }
      function c(e, t, i, n) {
        return n.push(i[t]), n
      }
      function d(e, t, i, n) {
        return (n[t] = i[e]), n
      }
      function u() {
        return []
      }
      function h() {
        return {}
      }
      function p(e, t, i) {
        return (
          i.prefixes.forEach((n) => {
            const r = n + 'level'
            for (let n = i.range[0]; n <= i.range[1]; n++)
              if (e[r + n] && (0, o.isSameType)(e[r + n], t.typecheck())) {
                let o = t.tpl()
                i.names.forEach((i, l) => {
                  o = t.fill('' + l, i, e[r + n], o)
                }),
                  (e[r + n] = o)
              }
          }),
          e
        )
      }
      function f(e, t, i) {
        return i(e, { tpl: h, fill: d, typecheck: t.typecheck.unpack }, t)
      }
      class v extends l.DefaultProperty {
        constructor(e) {
          const { levelsIterator: t = p, map: i = {}, ...n } = e,
            r = { ...a, ...i }
          n.state && (n.state = f(n.state, r, t)),
            super(n),
            (this._map = r),
            (this._levelsIterator = t)
        }
        state(e, t, i) {
          const n = super.state(e, t)
          return i
            ? n
            : ((r = n),
              (o = this._map),
              (0, this._levelsIterator)(
                r,
                { tpl: u, fill: c, typecheck: o.typecheck.pack },
                o,
              ))
          var r, o
        }
        preferences() {
          return (0, l.extractState)(
            this.state(this._excludedDefaultsKeys, void 0, !0),
            this._allDefaultsKeys,
          )
        }
        applyTemplate(e, t) {
          this.mergeAndFire(
            (0, l.extractState)(
              (0, r.default)(
                (0, n.default)(t),
                f(e, this._map, this._levelsIterator),
              ),
              this._allStateKeys,
              this._excludedTemplateKeys,
            ),
          )
        }
        saveDefaults() {
          this._useUserPreferences &&
            (0, s.saveDefaults)(this._defaultName, this.preferences())
        }
        clone() {
          return new v(this._options())
        }
        merge(e, t) {
          return super.merge(
            this._map ? f(e, this._map, this._levelsIterator) : e,
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
    95166: (e, t, i) => {
      i.d(t, {
        CollectibleColorPropertyDirectWrapper: () => s,
        CollectibleColorPropertyUndoWrapper: () => l,
      })
      var n = i(50151),
        r = i(12988)
      class o extends r.Property {
        constructor(e) {
          super(),
            (this._listenersMappers = []),
            (this._isProcess = !1),
            (this._baseProperty = e)
        }
        destroy() {
          this._baseProperty.destroy(), super.destroy()
        }
        value() {
          const e = this._baseProperty.value()
          return 'mixed' === e ? '' : e
        }
        visible() {
          return this._baseProperty.visible()
        }
        setValue(e) {
          ;(this._isProcess = !0),
            this._baseProperty.setValue('' === e ? 'mixed' : e, void 0, {
              applyValue: this._applyValue.bind(this),
            }),
            (this._isProcess = !1),
            this._listenersMappers.forEach((e) => {
              e.method.call(e.obj, this, '')
            })
        }
        subscribe(e, t) {
          const i = (i) => {
              this._isProcess || t.call(e, this, '')
            },
            n = { obj: e, method: t, callback: i }
          this._listenersMappers.push(n), this._baseProperty.subscribe(e, i)
        }
        unsubscribe(e, t) {
          const i = (0, n.ensureDefined)(
            this._listenersMappers.find((i) => i.obj === e && i.method === t)
              ?.callback,
          )
          this._baseProperty.unsubscribe(e, i)
        }
        unsubscribeAll(e) {
          this._baseProperty.unsubscribeAll(e)
        }
      }
      class l extends o {
        constructor(e, t, i) {
          super(e), (this._propertyApplier = t), (this._undoText = i)
        }
        _applyValue(e, t) {
          this._propertyApplier.setProperty(e, t, this._undoText)
        }
      }
      class s extends o {
        _applyValue(e, t) {
          e.setValue(t)
        }
      }
    },
    72609: (e, t, i) => {
      i.d(t, {
        LineToolPaneViewFibWithLabels: () => u,
        labelEdgeOffset: () => d,
      })
      var n = i(50151),
        r = i(17330),
        o = i(56468),
        l = i(74079),
        s = i(15938),
        a = i(32211),
        c = i(62689)
      const d = 4
      class u extends a.InplaceTextLineSourcePaneView {
        constructor(e, t, i, s, d) {
          super(e, t, i, s, d),
            (this._labelsRenderers = {}),
            (this._numericFormatter = (0, l.getNumericFormatter)()),
            (this._percentageFormatter = (0, l.getPercentageFormatter)()),
            (this._textRenderers = {}),
            (this._inplaceEditLevelIndex = 1)
          for (let t = 1; t <= e.levelsCount(); t++)
            this._labelsRenderers[t] = new r.TextRenderer(
              void 0,
              new o.HitTestResult(o.HitTarget.MovePoint, { activeItem: t }),
            )
          if (i && s && d) {
            for (let t = 1; t <= e.levelsCount(); t++) {
              const e = new o.HitTestResult(o.HitTarget.MovePoint, {
                ...(0, a.inplaceEditHandlers)(
                  this._tryActivateEditMode.bind(this, t),
                ),
                activeItem: t,
              })
              this._textRenderers[t] = new c.LineToolTextRenderer(void 0, e)
            }
            this._source.setAdditionalCursorData(
              () => {
                const e = (0, n.ensureDefined)(
                  this._textRenderers[this._inplaceEditLevelIndex],
                )
                return {
                  color: this._source.editableTextStyle().cursorColor,
                  ...e.getTextInfo(),
                }
              },
              (e) =>
                (0, n.ensureDefined)(
                  this._textRenderers[this._inplaceEditLevelIndex],
                ).positionToCoordinate(e),
            )
          }
        }
        _tryActivateEditMode(e, t) {
          ;(this._inplaceEditLevelIndex = e), super._tryActivateEditMode(e, t)
        }
        _activateEditMode(e) {
          const t = (0, n.ensureDefined)(
            this._textRenderers[this._inplaceEditLevelIndex],
          )
          this._updateInplaceText(t.getTextInfo()), super._activateEditMode(e)
        }
        _updateLabelForLevel(e) {
          const t = this._labelsRenderers[e.levelIndex]
          if (void 0 === t) return null
          const i = this._source.priceScale()
          if (!i) return null
          const n = this._source.ownerSource()?.firstValue()
          if (null == n) return null
          const r = this._source.properties(),
            o = Boolean(r.showCoeffs?.value()),
            l = Boolean(r.showPrices?.value())
          if (!o && !l) return null
          const s = r['level' + e.levelIndex].coeff.value()
          let a = ''
          if (o) {
            a +=
              (r.coeffsAsPercents?.value() ?? !1)
                ? this._percentageFormatter.format(100 * s, {
                    signPositive: !1,
                    tailSize: 2,
                  })
                : this._numericFormatter.format(s)
          }
          return (
            l && (a += ' (' + i.formatPrice(e.price, n) + ')'),
            this._updateRendererLabel(e, t, a),
            t
          )
        }
        _updateRendererLabel(e, t, i) {
          if (!i && void 0 === e.decorator) return null
          const {
              leftPoint: n,
              rightPoint: o,
              horzAlign: l,
              extendLeft: a,
              extendRight: c,
              ...u
            } = e,
            h = this._source.properties(),
            [p, f] = (0, r.getTextAlignInBox)({
              horzAlign: l,
              extendLeft: a,
              extendRight: c,
              width: this._model.timeScale().width(),
              leftPoint: n,
              rightPoint: o,
            })
          return (
            t.setData({
              points: [p],
              text: i,
              horzAlign: f,
              offsetX: d,
              offsetY: 0,
              font: s.CHART_FONT_FAMILY,
              fontSize: h.labelFontSize?.value() ?? 12,
              ...u,
            }),
            t
          )
        }
      }
    },
    49145: (e, t, i) => {
      i.r(t), i.d(t, { LineToolFibSpeedResistanceArcs: () => Y })
      var n = i(50151),
        r = i(11542),
        o = i(45126),
        l = i(15399),
        s = i(73305),
        a = i(85719),
        c = i(24362),
        d = i(53749),
        u = i(32097),
        h = i(18009),
        p = i(91682),
        f = i(95166)
      const v = new o.TranslatedString(
          'change {title} level {index} line visibility',
          r.t(null, void 0, i(51403)),
        ),
        _ = new o.TranslatedString(
          'change {title} levels visibility',
          r.t(null, void 0, i(54517)),
        ),
        g = new o.TranslatedString(
          'change {title} level {index} line color',
          r.t(null, void 0, i(664)),
        ),
        y = new o.TranslatedString(
          'change {title} level {index} line width',
          r.t(null, void 0, i(97870)),
        ),
        m = new o.TranslatedString(
          'change {title} level {index} line coeff',
          r.t(null, void 0, i(27154)),
        ),
        P = new o.TranslatedString(
          'change {title} all lines color',
          r.t(null, void 0, i(59577)),
        ),
        x = new o.TranslatedString(
          'change {title} background visibility',
          r.t(null, void 0, i(30839)),
        ),
        T = new o.TranslatedString(
          'change {title} background transparency',
          r.t(null, void 0, i(13783)),
        ),
        w = new o.TranslatedString(
          'change {title} full circles visibility',
          r.t(null, void 0, i(30484)),
        ),
        b = r.t(null, void 0, i(51574)),
        S = r.t(null, void 0, i(28683)),
        C = r.t(null, void 0, i(79468)),
        D = r.t(null, void 0, i(79650)),
        L = r.t(null, void 0, i(95279))
      class I extends h.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            r = (0, p.removeSpaces)(i),
            l = new o.TranslatedString(i, this._source.translatedType()),
            s = t.trendline.childs(),
            a = (0, d.createLineStyleDefinition)(
              this._propertyApplier,
              {
                showLine: s.visible,
                lineColor: s.color,
                lineStyle: s.linestyle,
                lineWidth: s.linewidth,
              },
              l,
              'TrendLine',
              { line: b },
            )
          e.push(a)
          const c = this._source.levelsCount()
          for (let i = 1; i <= c; i++) {
            const n = t[`level${i}`].childs(),
              o = (0, u.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, u.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.visible,
                    v.format({ title: l, index: i }),
                  ),
                  color: (0, u.getColorDefinitionProperty)(
                    this._propertyApplier,
                    n.color,
                    null,
                    g.format({ title: l, index: i }),
                  ),
                  width: (0, u.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.linewidth,
                    y.format({ title: l, index: i }),
                  ),
                  level: (0, u.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.coeff,
                    m.format({ title: l, index: i }),
                  ),
                },
                { id: `${r}LineLevel${i}` },
              )
            e.push(o)
          }
          const h = (0, u.createColorPropertyDefinition)(
            {
              color: (0, u.getColorDefinitionProperty)(
                this._propertyApplier,
                new f.CollectibleColorPropertyUndoWrapper(
                  (0, n.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                P.format({ title: l }),
                !0,
              ),
            },
            { id: `${r}AllLineColor`, title: S },
          )
          e.push(h)
          const I = (0, u.createTransparencyPropertyDefinition)(
            {
              checked: (0, u.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                x.format({ title: l }),
              ),
              transparency: (0, u.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                T.format({ title: l }),
              ),
            },
            { id: `${r}Background`, title: C },
          )
          e.push(I)
          const k = (0, u.createCheckablePropertyDefinition)(
            {
              checked: (0, u.convertToDefinitionProperty)(
                this._propertyApplier,
                t.showCoeffs,
                _.format({ title: l }),
              ),
            },
            { id: `${r}Levels`, title: D },
          )
          e.push(k)
          const A = (0, u.createCheckablePropertyDefinition)(
            {
              checked: (0, u.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fullCircles,
                w.format({ title: l }),
              ),
            },
            { id: `${r}FullCircles`, title: L },
          )
          return e.push(A), { definitions: e }
        }
      }
      var k = i(86441),
        A = i(30699),
        R = i(9859),
        M = i(56468),
        E = i(95201),
        N = i(49857),
        V = i(91046),
        F = i(72609),
        H = i(19063),
        W = i(61993),
        $ = i(75919)
      class z extends $.MediaCoordinatesPaneRenderer {
        constructor(e, t, i) {
          super(),
            (this._data = e),
            (this._hittest = t || new M.HitTestResult(M.HitTarget.MovePoint)),
            (this._backHittest =
              i || new M.HitTestResult(M.HitTarget.MovePointBackground))
        }
        hitTest(e) {
          const t = this._data
          if (null === t) return null
          if ((0, R.sign)(e.y - t.center.y) !== t.dir && !t.fullCircles)
            return null
          const i = e.subtract(t.center).length(),
            n = (0, W.interactionTolerance)().curve
          return Math.abs(i - t.radius) < n
            ? this._hittest
            : t.hittestOnBackground && Math.abs(i) <= t.radius + n
              ? this._backHittest
              : null
        }
        _drawImpl(e) {
          const t = this._data
          if (null === t) return
          const i = e.context
          ;(i.lineCap = 'round'),
            (i.strokeStyle = t.color),
            (i.lineWidth = t.linewidth),
            i.translate(t.center.x, t.center.y),
            i.beginPath(),
            t.fullCircles
              ? i.arc(0, 0, t.radius, 2 * Math.PI, 0, !1)
              : t.dir > 0
                ? i.arc(0, 0, t.radius, 0, Math.PI, !1)
                : i.arc(0, 0, t.radius, Math.PI, 0, !1),
            i.stroke(),
            t.fillBackground &&
              (t.radius2 &&
                (t.fullCircles
                  ? i.arc(0, 0, t.radius2, 2 * Math.PI, 0, !0)
                  : t.dir > 0
                    ? i.arc(0, 0, t.radius2, Math.PI, 0, !0)
                    : i.arc(0, 0, t.radius2, 0, Math.PI, !0)),
              (i.fillStyle = (0, H.generateColor)(t.color, t.transparency, !0)),
              i.fill())
        }
      }
      class B extends F.LineToolPaneViewFibWithLabels {
        constructor() {
          super(...arguments),
            (this._trendLineRenderer = new V.TrendLineRenderer()),
            (this._renderer = null),
            (this._levels = [])
        }
        renderer(e) {
          return this._invalidated && this._updateImpl(e), this._renderer
        }
        _updateImpl(e) {
          if (
            (super._updateImpl(e),
            (this._renderer = null),
            this._points.length < 2)
          )
            return
          const t = this._source.priceScale()
          if (!t || t.isEmpty() || this._model.timeScale().isEmpty()) return
          const i = this._source.ownerSource()?.firstValue()
          if (null == i) return
          const r = this._points[0],
            o = this._points[1],
            l = r.subtract(o).length()
          this._levels = []
          const s = this._source.properties().childs(),
            a = this._source.levelsCount()
          for (let e = 1; e <= a; e++) {
            const t = 'level' + e,
              i = (0, n.ensureDefined)(
                this._source.properties().child(t),
              ).childs()
            if (!i.visible.value()) continue
            const s = i.coeff.value(),
              a = i.color.value(),
              c = Math.abs(o.subtract(r).length() * s),
              d = (0, R.sign)(o.y - r.y),
              u = new k.Point(r.x, r.y + d * l * Math.abs(s))
            this._levels.push({
              color: a,
              radius: c,
              dir: d,
              labelPoint: u,
              linewidth: i.linewidth.value(),
              linestyle: i.linestyle.value(),
              index: e,
            })
          }
          if (this._points.length < 2) return
          const c = new E.CompositeRenderer(),
            d = s.fillBackground.value(),
            u = s.transparency.value()
          for (let e = 0; e < this._levels.length; e++) {
            const t = this._levels[e],
              i = {
                center: r,
                color: t.color,
                linewidth: t.linewidth,
                radius: t.radius,
                dir: t.dir,
                transparency: u,
                fillBackground: d,
                hittestOnBackground: !0,
                fullCircles: s.fullCircles.value(),
                radius2: e > 0 ? this._levels[e - 1].radius : void 0,
              },
              n = new M.HitTestResult(M.HitTarget.MovePoint, void 0, t.index)
            c.append(new z(i, n))
            const o = this._updateLabelForLevel({
              levelIndex: this._levels[e].index,
              leftPoint: this._levels[e].labelPoint,
              rightPoint: this._levels[e].labelPoint,
              price: 0,
              color: this._levels[e].color,
              horzAlign: A.HorizontalAlign.Left,
              vertAlign: A.VerticalAlign.Middle,
            })
            null !== o && c.append(o)
          }
          const h = s.trendline.childs()
          if (h.visible.value()) {
            const e = {
              points: [this._points[0], this._points[1]],
              color: h.color.value(),
              linewidth: h.linewidth.value(),
              linestyle: h.linestyle.value(),
              extendleft: !1,
              extendright: !1,
              leftend: N.LineEnd.Normal,
              rightend: N.LineEnd.Normal,
            }
            this._trendLineRenderer.setData(e),
              c.append(this._trendLineRenderer)
          }
          this.addAnchors(c), (this._renderer = c)
        }
      }
      const X = new o.TranslatedString(
        'erase level line',
        r.t(null, void 0, i(77114)),
      )
      var O
      !((e) => {
        e[(e.LevelsCount = 11)] = 'LevelsCount'
      })(O || (O = {}))
      class Y extends c.InplaceTextLineDataSource {
        constructor(e, t, i, n) {
          super(
            e,
            t ?? Y.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            n,
          ),
            this._setPaneViews([new B(this, this._model)])
        }
        levelsCount() {
          return 11
        }
        pointsCount() {
          return 2
        }
        name() {
          return 'Fib Speed Resistance Arcs'
        }
        processErase(e, t) {
          const i = (0, n.ensureDefined)(
            this.properties().child(`level${t}`),
          ).childs().visible
          e.setProperty(i, !1, X, a.lineToolsDoNotAffectChartInvalidation)
        }
        editableTextProperties() {
          ;(0, n.assert)(!1, 'unexpected method call')
        }
        static createProperties(e, t) {
          const i = new l.LevelsProperty({
            defaultName: 'linetoolfibspeedresistancearcs',
            state: t,
            map: { range: [1, 11] },
            theme: e,
          })
          return this._configureProperties(i), i
        }
        async _getPropertyDefinitionsViewModelClass() {
          return I
        }
        static _configureProperties(e) {
          super._configureProperties(e)
          const t = e.childs().trendline.childs(),
            i = [t.linewidth],
            r = [t.color]
          for (let t = 1; t <= 11; t++) {
            const o = (0, n.ensureDefined)(e.child(`level${t}`)).childs()
            i.push(o.linewidth), r.push(o.color)
          }
          e.addChild('linesColors', new s.LineToolColorsProperty(r)),
            e.addChild('linesWidths', new s.LineToolWidthsProperty(i))
        }
      }
    },
    62689: (e, t, i) => {
      i.d(t, { LineToolTextRenderer: () => r })
      var n = i(17330)
      class r extends n.TextRenderer {
        getTextInfo() {
          const e = this._getInternalData(),
            t = this.fontStyle(),
            i = this._getFontInfo()
          return {
            ...e,
            lineHeight: this.lineHeight(),
            lineSpacing: this.lineSpacing(),
            font: t,
            fontSize: i.fontSize,
            centerRotation: this.centerTextRotation() ?? void 0,
          }
        }
        setCursorType(e) {
          this._hitTest.data()?.cursorType !== e &&
            this._hitTest.mergeData({ cursorType: e })
        }
      }
    },
  },
])
