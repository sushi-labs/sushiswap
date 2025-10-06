;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2050],
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
    38039: (e, t, i) => {
      i.d(t, { LineDataSourceProperty: () => l })
      var s = i(90054),
        n = i(16738),
        o = i(50151),
        r = i(32679)
      class l extends r.DefaultProperty {
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
    56621: (e, t, i) => {
      i.r(t), i.d(t, { Constants: () => s, LineToolParallelChannel: () => p })
      var s,
        n = i(50151),
        o = i(86441),
        r = i(37265),
        l = i(29875),
        a = i(12988),
        c = i(14267)
      !((e) => {
        ;(e[(e.LeftBottomAnchor = 0)] = 'LeftBottomAnchor'),
          (e[(e.RightBottomAnchor = 1)] = 'RightBottomAnchor'),
          (e[(e.LeftTopAnchor = 2)] = 'LeftTopAnchor'),
          (e[(e.RightTopAnchor = 3)] = 'RightTopAnchor'),
          (e[(e.TopMiddleAnchor = 4)] = 'TopMiddleAnchor'),
          (e[(e.BottomMiddleAnchor = 5)] = 'BottomMiddleAnchor'),
          (e[(e.VirtualPriceOffsetPoint = 6)] = 'VirtualPriceOffsetPoint')
      })(s || (s = {}))
      class h extends a.Property {
        constructor(e) {
          super(0), (this._source = e)
        }
        value() {
          const e = this._source.points()
          if (3 !== e.length) return 0
          const t = e[2].price - e[0].price,
            i = this._source.ownerSource()?.symbolSource().symbolInfo(),
            s = i ? i.pricescale / i.minmov : 100
          return Math.round(t * s) / s
        }
        setValue(e) {
          const t = this._source.points()
          if (3 === t.length) {
            const i = { ...t[2], price: t[0].price + e },
              s = this._source.model()
            s.startChangingLinetool(this._source, { ...i }, 6),
              s.changeLinePoint({ ...i }),
              s.endChangingLinetool(!1),
              this._listeners.fire(this, '')
          }
        }
      }
      class p extends l.LineDataSource {
        constructor(e, t, s, n) {
          super(
            e,
            t ?? p.createProperties(e.backgroundTheme().spawnOwnership()),
            s,
            n,
          ),
            (this.version = 2),
            (this._priceOffsetProperty = new h(this)),
            this._priceAxisViews.push(this.createPriceAxisView(3)),
            (this._coordOffsetWhileMovingOrChanging = null),
            (this._pendingPriceOffset = null),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 86595))
              .then(({ ParallelChannelPaneView: e }) => {
                this._setPaneViews([new e(this, this._model)])
              })
        }
        levelsCount() {
          return c.coeffs.length
        }
        paneViews(e) {
          return (
            null !== this._pendingPriceOffset &&
              this._applyPendingPriceOffset(),
            super.paneViews(e)
          )
        }
        snapTo45DegreesAvailable() {
          return !0
        }
        setLastPoint(e, t) {
          this._snapTo45DegreesApplicable(t) &&
            2 === this.points().length &&
            this.snapPoint45Degree(e, this.points()[0])
          const i = (0, r.clone)(e)
          return super.setLastPoint(e, t, !1), i
        }
        startMoving(e, t, i, s) {
          super.startMoving(e, t, i, s),
            (this._coordOffsetWhileMovingOrChanging = this._findPixelsHeight())
        }
        endMoving(e, t, i) {
          return (
            (this._coordOffsetWhileMovingOrChanging = null),
            super.endMoving(e, t, i)
          )
        }
        startChanging(e, t) {
          super.startChanging(e, t),
            (this._coordOffsetWhileMovingOrChanging = this._findPixelsHeight())
        }
        endChanging(e, t, i) {
          return (
            (this._coordOffsetWhileMovingOrChanging = null),
            super.endChanging(e, t, i)
          )
        }
        restoreExternalPoints(e, t) {
          if (
            (super.restoreExternalPoints(e, t),
            t.pricesChanged && this._points.length === e.points.length)
          )
            for (let t = 0; t < e.points.length; t++)
              this._points[t].price = e.points[t].price
        }
        restorePoints(e, t, i) {
          ;(e[2] = { ...e[0], price: e[2].price }),
            super.restorePoints(e, t, i),
            this._alertCreationAvailable.setValue(
              super.alertCreationAvailable().value() &&
                this._isTimePointsValid(),
            )
        }
        setPoint(e, t, i, s) {
          if (this._points[0].index === this._points[1].index && e >= 4) return
          this._snapPointBeforeChange(e, t, i)
          const o = (0, n.ensureNotNull)(
              this.pointToScreenPoint(this._points[0]),
            ),
            r = (0, n.ensureNotNull)(this.pointToScreenPoint(this._points[1])),
            l = (0, n.ensureNotNull)(this.pointToScreenPoint(t)),
            a = (0, n.ensureNotNull)(this._coordOffsetWhileMovingOrChanging),
            c = (0, n.ensureNotNull)(this.priceScale()),
            h = (0, n.ensure)(this.ownerSource()?.firstValue()),
            p = this._model.mainSeries().interval()
          switch (e) {
            case 0:
              super._setPoint(e, { ...t, interval: p }),
                (this._points[2].price = c.coordinateToPrice(l.y + a, h)),
                (this._points[2].index = t.index),
                (this._points[2].interval = p)
              break
            case 1:
              super._setPoint(e, { ...t, interval: p })
              break
            case 2:
              super._setPoint(e, { ...t, interval: p }),
                (this._points[0].price = c.coordinateToPrice(l.y - a, h)),
                (this._points[0].index = t.index),
                (this._points[0].interval = p)
              break
            case 3:
              ;(this._points[1].price = c.coordinateToPrice(l.y - a, h)),
                (this._points[1].index = t.index),
                (this._points[1].interval = p)
              break
            case 4: {
              const e = r.subtract(o),
                t = (l.x - o.x) / e.x,
                i = o.addScaled(e, t),
                s = l.y - i.y
              this._points[2].price = c.coordinateToPrice(o.y + s, h)
              break
            }
            case 5: {
              const e = r.subtract(o),
                t = (l.x - o.x) / e.x,
                i = o.addScaled(e, t),
                s = l.y - i.y
              ;(this._points[0].price = c.coordinateToPrice(o.y + s, h)),
                (this._points[1].price = c.coordinateToPrice(r.y + s, h))
              break
            }
            case 6:
              this._points[2].price = t.price
          }
          const u = this.linkKey().value()
          u &&
            !s &&
            e < 4 &&
            this._syncLineStyleChanges(u, {
              prices: this._points.map((e) => e.price),
            })
        }
        state(e) {
          const t = super.state(e)
          return (
            this._pendingPriceOffset &&
              (t.priceOffset = this._pendingPriceOffset),
            t
          )
        }
        restoreExternalState(e) {
          const { prices: t, ...i } = e
          if (t && this.isActualSymbol())
            for (let e = 0; e < t.length; e++)
              this._points[e].price = this._timePoint[e].price = t[e]
          super.restoreExternalState(i)
        }
        restoreData(e) {
          void 0 !== e.priceOffset && (this._pendingPriceOffset = e.priceOffset)
        }
        getPoint(e) {
          if (e < 3) return super.getPoint(e)
          const t = this.pointToScreenPoint(this._points[0]),
            i = this.pointToScreenPoint(this._points[1]),
            s = this.pointToScreenPoint(this._points[2])
          if (!t || !i || !s) return null
          switch (e) {
            case 3: {
              const e = s.y - t.y,
                n = i.add(new o.Point(0, e))
              return this.screenPointToPoint(n)
            }
            case 4: {
              const e = s.y - t.y,
                n = i.add(new o.Point(0, e)),
                r = s.add(n).scaled(0.5)
              return this.screenPointToPoint(r)
            }
            case 5: {
              const e = t.add(i).scaled(0.5)
              return this.screenPointToPoint(e)
            }
          }
          return null
        }
        alignCrossHairToAnchor(e) {
          return e <= 3
        }
        pointsCount() {
          return 3
        }
        name() {
          return 'Parallel Channel'
        }
        addPoint(e, t, i) {
          return (
            this._snapTo45DegreesApplicable(t) &&
              1 === this._points.length &&
              this.snapPoint45Degree(e, this.points()[0]),
            2 === this._points.length &&
              (e = this._convertLastPointTo3rdPoint(
                (0, n.ensureNotNull)(this._lastPoint),
              )),
            this._addPointIntenal(e, t, i)
          )
        }
        timeAxisPoints() {
          return this._axisPoints()
        }
        priceAxisPoints() {
          return this._axisPoints()
        }
        canHasAlert() {
          return !0
        }
        template() {
          const e = super.template()
          return (e.labelText = this.properties().childs().labelText.value()), e
        }
        hasStateForAlert() {
          return !1
        }
        priceOffsetProperty() {
          return this._priceOffsetProperty
        }
        static createProperties(e, t) {
          const i = c.LineToolParallelChannelPropertiesImpl.create(e, t)
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
            ]).then(i.bind(i, 73653))
          ).ParallelChannelDefinitionsViewModel
        }
        _applyTemplateImpl(e) {
          super._applyTemplateImpl(e),
            this.properties()
              .childs()
              .labelText.setValue(e.labelText ?? '')
        }
        _getAlertPlots() {
          const e = this.getPoint(3)
          if (!e) return []
          const t = [this._points[0], this._points[1], this._points[2], e],
            i = (e, t) => (e.index <= t.index ? [e, t] : [t, e]),
            s = i(t[0], t[1]),
            n = i(t[2], t[3])
          let o, r, l, a
          t[2].price < t[0].price ? ((r = n), (o = s)) : ((r = s), (o = n))
          const c = this.properties().childs().extendLeft.value(),
            h = this.properties().childs().extendRight.value()
          return (
            t[0].index <= t[1].index ? ((l = c), (a = h)) : ((l = h), (a = c)),
            [
              this._linePointsToAlertPlot(o, 'Upper', l, a),
              this._linePointsToAlertPlot(r, 'Lower', l, a),
            ].filter((e) => null !== e)
          )
        }
        _correctLastPoint(e) {
          if (
            this._points.length < 2 ||
            this._points[1].index === this._points[0].index
          )
            return e
          const t = (0, n.ensureNotNull)(this.pointToScreenPoint(e)),
            i = (0, n.ensureNotNull)(this.pointToScreenPoint(this._points[1])),
            s = (0, n.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            r = i.subtract(s),
            l = (t.x - s.x) / r.x,
            a = s.addScaled(r, l),
            c = t.y - a.y,
            h = s.add(new o.Point(0, c))
          return (0, n.ensureNotNull)(this.screenPointToPoint(h))
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.hasChild('labelText') ||
              e.addChild('labelText', new a.Property('')),
            e.addExcludedKey('labelText', 1)
        }
        _isTimePointsValid() {
          return this._timePoint.every((e) => Number.isFinite(e.price))
        }
        _axisPoints() {
          const e = this.points(),
            t = this._points[0]
              ? this.pointToScreenPoint(this._points[0])
              : null,
            i = this._points[1]
              ? this.pointToScreenPoint(this._points[1])
              : null,
            s = this._points[2]
              ? this.pointToScreenPoint(this._points[2])
              : null
          if (t && i && s) {
            const r = i.y - t.y,
              l = s.add(new o.Point(0, r))
            e.push((0, n.ensureNotNull)(this.screenPointToPoint(l)))
          }
          return e
        }
        _convertLastPointTo3rdPoint(e) {
          const t = (0, n.ensureNotNull)(this.pointToScreenPoint(e)),
            i = (0, n.ensureNotNull)(this.pointToScreenPoint(this._points[1])),
            s = (0, n.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            r = i.subtract(s),
            l = (t.x - s.x) / r.x,
            a = s.addScaled(r, l),
            c = t.y - a.y,
            h = s.add(new o.Point(0, c))
          return (0, n.ensureNotNull)(this.screenPointToPoint(h))
        }
        _findPixelsHeight() {
          const e = this.pointToScreenPoint(this._points[2]),
            t = this.pointToScreenPoint(this._points[0])
          return e && t ? e.y - t.y : null
        }
        _applyPendingPriceOffset() {
          const e = this._pendingPriceOffset
          if (null === e || this._points.length < 3) return
          const t = this.priceScale(),
            i = (0, n.ensureNotNull)(this.ownerSource()).firstValue()
          if (!t || t.isEmpty() || null === i) return
          const s = e + this._points[0].price,
            o = e + this._points[1].price,
            r = 0.5 * (s + o) - e,
            l = 0.5 * (s + o),
            a = t.priceToCoordinate(r, i),
            c = t.priceToCoordinate(l, i) - a,
            h = t.priceToCoordinate(this._points[0].price, i) + c,
            p = t.coordinateToPrice(h, i)
          ;(this._points[2].price = p),
            (this._timePoint[2].price = p),
            (this._points[2].index = this._points[0].index),
            (this._timePoint[2].time_t = this._timePoint[0].time_t),
            (this._timePoint[2].offset = this._timePoint[0].offset),
            (this._pendingPriceOffset = null)
        }
        _snapPointBeforeChange(e, t, i) {
          if (this._snapTo45DegreesApplicable(i))
            switch (e) {
              case 0:
              case 1:
                this.snapPoint45Degree(t, this._points[1 - e])
                break
              case 2:
              case 3:
                const i = (0, n.ensureNotNull)(this.getPoint(5 - e))
                this.snapPoint45Degree(t, i)
            }
        }
      }
    },
    14267: (e, t, i) => {
      i.d(t, {
        LineToolParallelChannelPropertiesImpl: () => V,
        coeffs: () => g,
      })
      var s = i(90054),
        n = i(16738),
        o = i(50151),
        r = i(49156),
        l = i(24633),
        a = i(51056),
        c = i(30699),
        h = i(6590),
        p = i(31229),
        u = i(32679),
        d = i(38039),
        f = i(73305),
        P = i(11402),
        _ = i(45345)
      const g = [-0.25, 0, 0.25, 0.5, 0.75, 1, 1.25]
      const T = {
        intervalsVisibilities: { ...p.intervalsVisibilitiesDefaults },
        ...(() => {
          const e = {}
          return (
            g.forEach((t, i) => {
              e[`level${i + 1}`] = {
                visible: [1, 3, 5].includes(i),
                coeff: t,
                lineStyle: 3 === i ? a.LINESTYLE_DASHED : a.LINESTYLE_SOLID,
                lineWidth: [1, 5].includes(i) ? 2 : 1,
              }
            }),
            e
          )
        })(),
        extendLeft: !1,
        extendRight: !1,
        fillBackground: !0,
        transparency: 80,
        labelVisible: !1,
        labelHorzAlign: c.HorizontalAlign.Left,
        labelVertAlign: c.VerticalAlign.Bottom,
        labelFontSize: 14,
        labelBold: !1,
        labelItalic: !1,
        version: 2,
      }
      const m = {
          ...(() => {
            const e = {}
            for (let t = 0; t < g.length; t++)
              e[`level${t + 1}`] = { color: '#2962ff' }
            return e
          })(),
          labelTextColor: r.colors.colorTvBlue500,
          backgroundColor: r.colors.colorTvBlue500Alpha20,
        },
        y = new Map([
          [l.StdTheme.Light, m],
          [l.StdTheme.Dark, m],
        ]),
        v = 'linetoolparallelchannel',
        b = (0, u.extractAllPropertiesKeys)(
          (0, o.ensureDefined)(y.get(l.StdTheme.Light)),
        ),
        S = (0, u.extractAllPropertiesKeys)(T),
        x = [...b, ...S, 'labelText'],
        C = [...b, ...S, ...h.commonLineToolPropertiesStateKeys, 'labelText']
      function A(e) {
        const {
          linecolor: t,
          linestyle: i,
          linewidth: o,
          showMidline: r,
          midlinecolor: a,
          midlinestyle: c,
          midlinewidth: h,
          ...p
        } = e
        return {
          ...(0, n.default)(
            (0, s.default)(T),
            y.get(_.watchedTheme.value()) ?? y.get(l.StdTheme.Light),
          ),
          ...p,
          level4: {
            visible: r,
            color: a,
            lineStyle: c,
            lineWidth: h,
            coeff: 0.5,
          },
          level2: {
            color: t,
            lineStyle: i,
            lineWidth: o,
            visible: !0,
            coeff: 0,
          },
          level6: {
            color: t,
            lineStyle: i,
            lineWidth: o,
            visible: !0,
            coeff: 1,
          },
        }
      }
      class V extends d.LineDataSourceProperty {
        constructor(e) {
          1 === (e.state && 'version' in e.state ? e.state.version : 1) &&
            e.state &&
            ((e.state = A(e.state)),
            (e.state = (0, u.extractState)(e.state, e.allStateKeys))),
            super(e),
            this.addChild(
              'linesColors',
              new f.LineToolColorsProperty(
                g.map(
                  (e, t) =>
                    (0, o.ensureDefined)(this.child(`level${t + 1}`)).childs()
                      .color,
                ),
              ),
            ),
            this.addChild(
              'linesWidths',
              new f.LineToolWidthsProperty(
                g.map(
                  (e, t) =>
                    (0, o.ensureDefined)(this.child(`level${t + 1}`)).childs()
                      .lineWidth,
                ),
              ),
            )
        }
        applyTemplate(e) {
          1 === ('version' in e ? e.version : 1) &&
            ((e = A(e)), (e = (0, u.extractState)(e, this._templateKeys))),
            super.applyTemplate(e)
        }
        static create(e, t) {
          return new this({
            defaultName: v,
            factoryDefaultsSupplier: () =>
              (0, P.factoryDefaultsForCurrentTheme)(T, y),
            nonThemedDefaultsKeys: S,
            themedDefaultsKeys: b,
            templateKeys: x,
            allStateKeys: C,
            state: t,
            theme: e,
          })
        }
        _userSettings() {
          let e = (0, u.createDefaultsState)(!0, v, [], null)
          return (
            1 === (e && 'version' in e ? e.version : 1) && (e = A(e)),
            (0, u.extractState)(
              (0, s.default)(e),
              this._allDefaultsKeys,
              this._excludedDefaultsKeys,
            )
          )
        }
      }
    },
    11402: (e, t, i) => {
      i.d(t, { factoryDefaultsForCurrentTheme: () => a })
      var s = i(16738),
        n = i(90054),
        o = i(50151),
        r = i(45345),
        l = i(24633)
      function a(e, t) {
        const i = r.watchedTheme.value() ?? l.StdTheme.Light,
          a = (0, n.default)(e)
        return (0, s.default)(a, (0, o.ensureDefined)(t.get(i))), a
      }
    },
  },
])
