;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5231],
  {
    18181: (e, t, i) => {
      i.r(t),
        i.d(t, {
          LineToolImage: () => O,
          OriginPoints: () => y,
          buildAbsoluteUserImageUrl: () => L,
        })
      var n = i(50151),
        r = i(86441),
        s = i(9343),
        o = i(32679),
        a = i(12988),
        l = i(29875),
        u = i(44672),
        h = i(56840),
        c = i(51768),
        d = i(22980),
        g = i(11542),
        p = i(49483),
        m = i(68335),
        _ = i(56570)
      const b = g.t(null, void 0, i(15402))
      var f = i(77788),
        P = i(928)
      async function v(e, t) {
        return (async (e) => {
          const [t] = await Promise.all([
            Promise.all([
              i.e(5862),
              i.e(3703),
              i.e(4524),
              i.e(7939),
              i.e(9258),
              i.e(5387),
              i.e(6445),
              i.e(9325),
              i.e(8222),
              i.e(2440),
              i.e(8544),
              i.e(5058),
              i.e(2227),
              i.e(3746),
              i.e(9418),
              i.e(7038),
            ]).then(i.bind(i, 14653)),
          ])
          return t.renderImageDialog(e)
        })({ onConfirm: e, onClose: t })
      }
      let w = null
      function C(e) {
        if ('LineToolImage' !== e) return w?.then((e) => e()), void (w = null)
        ;(0, d.runOrSigninWithFeature)(
          () => {
            P.tool.setValue('LineToolImage'),
              (w = v(I, () => {
                w?.then((e) => e()),
                  (w = null),
                  'LineToolImage' === P.tool.value() && (0, P.resetToCursor)(!0)
              })),
              (0, c.trackEvent)('Image', 'Open image dialog')
          },
          { feature: 'drawings', source: 'Change drawing tool state' },
        )
      }
      function I(e) {
        const t = (0, f.chartWidgetCollectionService)()
        if (null === t) return
        const r = !Boolean(h.getBool('hint.pasteImage')),
          s = t.activeChartWidget.value()
        var o, a
        s
          .model()
          .pasteImageAsLineTool(
            e.url,
            e.blobUrl,
            (0, n.ensureNotNull)(
              s.model().model().paneForSource(s.model().mainSeries()),
            ),
            e.transparency,
          ),
          r &&
            ((o = t.getContainer()),
            (a = 'hint.pasteImage'),
            _.enabled('popup_hints') &&
              !p.CheckMobile.any() &&
              Promise.all([i.e(1737), i.e(2227), i.e(6166)])
                .then(i.bind(i, 5015))
                .then((e) => {
                  const t = new e.ChartEventHintRenderer(o),
                    i = b.format({
                      shortcut: (0, m.humanReadableHash)(m.Modifiers.Mod + 86),
                    })
                  let n = null
                  t.show(i, () => {
                    null !== n &&
                      (clearTimeout(n),
                      (n = null),
                      h.setValue(a, !0, { forceFlush: !0 }))
                  }),
                    (n = setTimeout(() => {
                      ;(n = null), t.hide()
                    }, 5e3))
                }))
      }
      var S = i(64147)
      const U = (0, s.getLogger)('Chart.LineToolImage')
      var y
      function N(e) {
        return e.toLowerCase().startsWith('blob:')
      }
      function T(e) {
        return e.toLowerCase().startsWith('data:')
      }
      !((e) => {
        ;(e[(e.LeftTopAnchor = 0)] = 'LeftTopAnchor'),
          (e[(e.RightTopAnchor = 1)] = 'RightTopAnchor'),
          (e[(e.LeftBottomAnchor = 2)] = 'LeftBottomAnchor'),
          (e[(e.RightBottomAnchor = 3)] = 'RightBottomAnchor'),
          (e[(e.Center = 4)] = 'Center')
      })(y || (y = {}))
      window.AWS_BBS3_DOMAIN
      function L(e) {
        return N(e) || T(e) ? e : null
      }
      function x(e) {
        return T(e) ? e : new URL(e).pathname
      }
      class O extends l.LineDataSource {
        constructor(e, t, n, r) {
          super(
            e,
            t || O.createProperties(e.backgroundTheme().spawnOwnership()),
            n,
            r,
          ),
            (this._hasEditableCoordinates = new S.WatchedValue(!1)),
            (this._image = null),
            (this._originPoint = 4)
          const s = this.properties().childs().url
          ;(this._absoluteUserImageUrl = new a.Property(
            L(this.properties().childs().url.value()) ?? '',
          )),
            this._absoluteUserImageUrl.subscribe(this, (e) => {
              const t = e.value()
              if (N(t)) return
              const i = L(t)
              null !== i && s.setValue(x(i))
            }),
            s.subscribe(this, () => {
              const e = L(s.value())
              null !== e && this._absoluteUserImageUrl.setValue(e)
            }),
            this._loadImage(),
            Promise.all([i.e(6290), i.e(9116), i.e(1200), i.e(1583)])
              .then(i.bind(i, 26087))
              .then(({ ImagePaneView: t }) => {
                this._setPaneViews([new t(this, e)])
              }),
            this.properties()
              .childs()
              .url.subscribe(this, () => {
                this._loadImage()
              })
        }
        absoluteUserImageUrl() {
          return this._absoluteUserImageUrl
        }
        cssWidth() {
          return this.properties().childs().cssWidth.value()
        }
        cssHeight() {
          return this.properties().childs().cssHeight.value()
        }
        angle() {
          return this.properties().childs().angle.value()
        }
        originPoint() {
          return this._originPoint
        }
        dOffsetX() {
          return this._dOffsetX || 0
        }
        pointsCount() {
          return 1
        }
        name() {
          return 'Image'
        }
        image() {
          return this._image
        }
        setBlobImageUrl(e) {
          this._image
        }
        getChangePointForSync(e) {
          return null
        }
        pointToScreenPoint({ index: e, price: t }, i = 0) {
          const s = this._model.timeScale(),
            o = (0, n.ensureNotNull)(this.priceScale()),
            a = (0, n.ensureNotNull)(
              (0, n.ensureNotNull)(this.ownerSource()).firstValue(),
            ),
            l = s.indexToCoordinate(e) + i,
            u = o.priceToCoordinate(t, a)
          return new r.Point(l, u)
        }
        setPoint(e, t, i) {
          if (null === this._image) return
          const { width: r, height: s } = this._image,
            o = (0, n.ensureNotNull)(this.pointToScreenPoint(t)),
            a = (0, n.ensureNotNull)(
              this.pointToScreenPoint(this._points[0], this.dOffsetX()),
            ),
            l = Math.max(Math.abs(a.x - o.x) / r, Math.abs(a.y - o.y) / s),
            u = Math.round(r * l),
            h = Math.round(s * l),
            c = this.properties().childs()
          c.cssWidth.setValue(u),
            c.cssHeight.setValue(h),
            this.propertiesChanged()
        }
        startChanging(e, t) {
          super.startChanging(e, t),
            this._changeOriginPoint(O._oppositePoints[e])
        }
        endChanging(e, t) {
          return this._changeOriginPoint(4), super.endChanging(e, t)
        }
        getPoint() {
          return null
        }
        syncLineStyleState() {
          const e = super.syncLineStyleState()
          return !e.url && this._blobUrl && (e.blobUrl = this._blobUrl), e
        }
        restoreExternalState(e) {
          const { blobUrl: t, ...i } = e
          t && this.setBlobImageUrl(t), super.restoreExternalState(i)
        }
        isSavedInChart() {
          return (
            super.isSavedInChart() && '' !== this.absoluteUserImageUrl().value()
          )
        }
        static createProperties(e, t) {
          const i = new o.DefaultProperty({
            defaultName: 'linetoolimage',
            state: t,
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
            ]).then(i.bind(i, 65504))
          ).ImageDefinitionsViewModel
        }
        static _configureProperties(e) {
          super._configureProperties(e),
            e.hasChild('url') || e.addChild('url', new a.Property('')),
            e.addExcludedKey('url', 1),
            e.addExcludedKey('cssWidth', 1),
            e.addExcludedKey('cssHeight', 1),
            e.addExcludedKey('angle', 1)
        }
        _loadImage() {
          const e = this.properties(),
            t = (0, n.ensureDefined)(e.child('url')).value()
          t && this._createImage(t)
        }
        _changeOriginPoint(e) {
          const t = this.originPoint(),
            i =
              4 === t
                ? O._correctOriginDirections[e]
                : O._correctOriginDirections[O._oppositePoints[t]],
            s = this.properties().childs().cssWidth.value() / 2,
            o = this.properties().childs().cssHeight.value() / 2,
            [a] = this._points,
            l = (0, n.ensureNotNull)(this.pointToScreenPoint(a)),
            u = new r.Point(l.x + s * i[0], l.y + o * i[1]),
            h = (0, n.ensureNotNull)(this.screenPointToPoint(u))
          ;(this._dOffsetX =
            4 === t
              ? u.x - (0, n.ensureNotNull)(this.pointToScreenPoint(h)).x
              : void 0),
            (a.index = h.index),
            (a.price = h.price),
            (this._originPoint = e)
        }
        _createImage(e) {
          const t = N(e),
            i = L(e)
          if (null === i) return void U.logWarn(`Invalid image URL: ${e}`)
          if (i === this._image?.src) return
          const r = document.createElement('img')
          ;(r.crossOrigin = 'anonymous'),
            (r.src = i),
            r.addEventListener('load', () => {
              this._image = r
              const e = this._model,
                s = this.properties().childs()
              if (!t) {
                const e = x(i)
                s.url.setValue(e), (this._blobUrl = void 0)
              }
              if (s.cssWidth.value() && s.cssHeight.value())
                return void this._model.updateSource(this)
              const o = e.timeScale().width() / 4,
                a = (0, n.ensureNotNull)(this.priceScale()).height() / 4,
                l = r.naturalWidth,
                h = r.naturalHeight,
                c = Math.min(1, o / l),
                d = Math.min(1, a / h),
                g = Math.min(c, d),
                p = Math.round(g * l),
                m = Math.round(g * h)
              s.cssWidth.setValue(p),
                s.cssHeight.setValue(m),
                this.updateAllViews((0, u.sourceChangeEvent)(this.id())),
                this._model.updateSource(this)
            }),
            r.addEventListener('error', () => {
              this.model().removeSource(this)
            })
        }
      }
      ;(O._correctOriginDirections = [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
        [0, 0],
      ]),
        (O._oppositePoints = [3, 2, 1, 0, 4]),
        (0, P.runOnDrawingStateReady)(() => {
          P.tool.subscribe(C)
        })
    },
  },
])
