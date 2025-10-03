;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8949],
  {
    25422: (e, t, i) => {
      t.transformPoint =
        t.translationMatrix =
        t.scalingMatrix =
        t.rotationMatrix =
          void 0
      var s = i(86441)
      ;(t.rotationMatrix = (e) => {
        var t = Math.cos(e),
          i = Math.sin(e)
        return [
          [t, -i, 0],
          [i, t, 0],
          [0, 0, 1],
        ]
      }),
        (t.scalingMatrix = (e, t) => [
          [e, 0, 0],
          [0, t, 0],
          [0, 0, 1],
        ]),
        (t.translationMatrix = (e, t) => [
          [1, 0, e],
          [0, 1, t],
          [0, 0, 1],
        ]),
        (t.transformPoint = (e, t) => {
          for (var i = [t.x, t.y, 1], n = [0, 0, 0], r = 0; r < 3; r++)
            for (var o = 0; o < 3; o++) n[r] += i[o] * e[r][o]
          return new s.Point(n[0], n[1])
        })
    },
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
      var n, r, o
      !((e) => {
        ;(e[(e.NotShared = 0)] = 'NotShared'),
          (e[(e.SharedInLayout = 1)] = 'SharedInLayout'),
          (e[(e.GloballyShared = 2)] = 'GloballyShared')
      })(n || (n = {})),
        ((e) => {
          ;(e.BeforeAllAction = 'BeforeAll'), (e.CustomAction = 'CustomAction')
        })(r || (r = {})),
        ((e) => {
          ;(e.FloatingToolbarButton = 'FloatingToolbarButton'),
            (e.Default = 'Default')
        })(o || (o = {}))
    },
    38039: (e, t, i) => {
      i.d(t, { LineDataSourceProperty: () => a })
      var s = i(90054),
        n = i(16738),
        r = i(50151),
        o = i(32679)
      class a extends o.DefaultProperty {
        constructor({ templateKeys: e, ...t }) {
          super({
            ignoreAllowSavingDefaults: !0,
            saveNonDefaultUserPreferencesOnly: !0,
            ...t,
          }),
            (this._templateKeys = (0, r.ensureDefined)(
              e || this._allDefaultsKeys,
            ))
        }
        template() {
          return (0, o.extractState)(this.state(), this._templateKeys, [])
        }
        applyTemplate(e) {
          this.mergeAndFire(
            (0, o.extractState)(
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
    86915: (e, t, i) => {
      i.r(t), i.d(t, { LineToolSticker: () => S })
      var s = i(928),
        n = i(12027),
        r = i(22329),
        o = i(9343),
        a = i(90054),
        l = i(16738),
        c = i(38039),
        u = i(31229),
        h = i(32679),
        d = i(6590)
      const g = {
          intervalsVisibilities: { ...u.intervalsVisibilitiesDefaults },
          size: 110,
        },
        v = { sticker: 'bitcoin', angle: 0.5 * Math.PI },
        f = (0, h.extractAllPropertiesKeys)(g),
        p = (0, h.extractAllPropertiesKeys)(v),
        m = [...new Set([...p, ...f, ...d.commonLineToolPropertiesStateKeys])]
      class b extends c.LineDataSourceProperty {
        constructor(e) {
          super(e)
        }
        static create(e, t, i) {
          return new this({
            defaultName: 'linetoolsticker',
            factoryDefaultsSupplier: () => (0, a.default)(g),
            nonThemedDefaultsKeys: f,
            themedDefaultsKeys: [],
            allStateKeys: m,
            state: (0, l.default)({}, v, { sticker: i }, t ?? {}),
            theme: e,
          })
        }
      }
      const y = (0, o.getLogger)('Chart.LineToolSticker')
      var P
      !((e) => {
        e[(e.Version = 1)] = 'Version'
      })(P || (P = {}))
      class S extends r.LineToolSvgIconBase {
        constructor(e, t, i, s) {
          super(
            e,
            t ?? S.createProperties(e.backgroundTheme().spawnOwnership()),
            i,
            s,
          ),
            (this.version = 1),
            this._loadViews()
        }
        name() {
          return 'Sticker'
        }
        static createProperties(e, t) {
          const i = b.create(e, t, s.stickerTool.value())
          return S._configureProperties(i), i
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              i.e(6406),
              i.e(3889),
              i.e(8009),
              i.e(8056),
              i.e(8537),
            ]).then(i.bind(i, 18009))
          ).LineDataSourceDefinitionsViewModel
        }
        async _loadViews() {
          const [
            { getSvgContentForSticker: e, getSvgRenderer: t },
            { StickerPaneView: s },
          ] = await Promise.all([
            i.e(5598).then(i.bind(i, 47992)),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)]).then(
              i.bind(i, 44386),
            ),
          ])
          if (!this._isDestroyed) {
            const i = this._properties.childs().sticker.value()
            ;(this._svgContent = e(i)), this._onIconChanged.fire()
            const r = t(n.svgRenderer, i)
            null === r &&
              y.logWarn(`Couldn't create svg renderer for sticker ${i}`),
              this._setPaneViews([new s(this, this._model, r)])
          }
        }
      }
    },
    22329: (e, t, i) => {
      i.d(t, { LineToolSvgIconBase: () => u })
      var s,
        n = i(50151),
        r = i(86441),
        o = i(25422),
        a = i(52033),
        l = i(29875),
        c = i(64147)
      !((e) => {
        e[(e.AnchorLimit = 80)] = 'AnchorLimit'
      })(s || (s = {}))
      class u extends l.LineDataSource {
        constructor(e, t, i, s) {
          super(e, t, i, s),
            (this._onIconChanged = new a.Delegate()),
            (this._svgContent = null),
            (this._hasEditableCoordinates = new c.WatchedValue(!1)),
            (this._changePointData = null),
            this._loadViews()
        }
        pointsCount() {
          return 1
        }
        getAnchorLimit() {
          return 80
        }
        getChangePointForSync(e) {
          return null
        }
        startChanging(e, t) {
          const i = (0, n.ensureNotNull)(
              this.pointToScreenPoint(this._points[0]),
            ),
            s = this.properties().childs(),
            a = s.size.value()
          let l
          if (t) l = (0, n.ensureNotNull)(this.pointToScreenPoint(t))
          else {
            let e = new r.Point(0, Math.max(80, a) / 2)
            const t = (0, o.rotationMatrix)(s.angle.value())
            ;(e = (0, o.transformPoint)(t, e)), (l = i.add(e))
          }
          const c = i.subtract(l).length()
          ;(this._changePointData = {
            centerPoint: i,
            initialLength: c,
            initialSize: a,
          }),
            super.startChanging(e, t)
        }
        setPoint(e, t, i) {
          const {
              centerPoint: s,
              initialLength: r,
              initialSize: o,
            } = (0, n.ensureNotNull)(this._changePointData),
            a = (0, n.ensureNotNull)(this.pointToScreenPoint(t)),
            l = this.properties().childs()
          if (0 === e || 1 === e) {
            const t = a.subtract(s).normalized()
            let i = Math.acos(-t.x)
            Math.asin(t.y) > 0 && (i = 2 * Math.PI - i),
              0 === e && (i += Math.PI),
              l.angle.setValue(i)
          } else {
            const e = o * (s.subtract(a).length() / r)
            l.size.setValue(e)
          }
        }
        getSourceIcon() {
          const e = this.svgContent()
          return null === e ? null : { type: 'svgContent', content: e }
        }
        onSourceIconChanged() {
          return this._onIconChanged
        }
        svgContent() {
          return this._svgContent
        }
        static _configureProperties(e) {
          super._configureProperties(e), e.addExcludedKey('angle', 1)
        }
      }
    },
  },
])
