;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5967],
  {
    25422: (t, i, e) => {
      i.transformPoint =
        i.translationMatrix =
        i.scalingMatrix =
        i.rotationMatrix =
          void 0
      var n = e(86441)
      ;(i.rotationMatrix = (t) => {
        var i = Math.cos(t),
          e = Math.sin(t)
        return [
          [i, -e, 0],
          [e, i, 0],
          [0, 0, 1],
        ]
      }),
        (i.scalingMatrix = (t, i) => [
          [t, 0, 0],
          [0, i, 0],
          [0, 0, 1],
        ]),
        (i.translationMatrix = (t, i) => [
          [1, 0, t],
          [0, 1, i],
          [0, 0, 1],
        ]),
        (i.transformPoint = (t, i) => {
          for (var e = [i.x, i.y, 1], s = [0, 0, 0], o = 0; o < 3; o++)
            for (var r = 0; r < 3; r++) s[o] += e[r] * t[o][r]
          return new n.Point(s[0], s[1])
        })
    },
    87654: (t, i, e) => {
      e.r(i), e.d(i, { LineToolArc: () => d })
      var n,
        s = e(50151),
        o = e(4652),
        r = e(86441),
        a = e(25422),
        l = e(32679),
        c = e(29875),
        h = e(73305),
        u = e(64147)
      !((t) => {
        ;(t[(t.ArcWithTwoPoints = 1)] = 'ArcWithTwoPoints'),
          (t[(t.ArcWithTheePoints = 2)] = 'ArcWithTheePoints'),
          (t[(t.TheLatest = 2)] = 'TheLatest')
      })(n || (n = {}))
      class d extends c.LineDataSource {
        constructor(t, i, n, s) {
          super(
            t,
            i ?? d.createProperties(t.backgroundTheme().spawnOwnership()),
            n,
            s,
          ),
            (this._hasEditableCoordinates = new u.WatchedValue(!1)),
            (this.version = 2),
            (this._dist = null),
            Promise.all([e.e(6290), e.e(9116), e.e(1200), e.e(1583)])
              .then(e.bind(e, 15190))
              .then(({ ArcPaneView: i }) => {
                const e = [new i(this, t)]
                this._setPaneViews(e)
              })
        }
        startChanging(t, i) {
          if ((super.startChanging(t, i), 0 === t || 1 === t)) {
            const t = (0, s.ensureNotNull)(
                this.pointToScreenPoint(this._points[0]),
              ),
              i = (0, s.ensureNotNull)(
                this.pointToScreenPoint(this._points[1]),
              ),
              e = (0, s.ensureNotNull)(this.pointToScreenPoint(this._points[2]))
            this._dist = (0, o.distanceToLine)(t, i, e).distance
            const n = i.subtract(t),
              a = new r.Point(-n.y, n.x),
              l = t.add(i).scaled(0.5)
            e.subtract(l).dotProduct(a) < 0 && (this._dist = -this._dist)
          }
        }
        endChanging(t, i) {
          return (this._dist = null), super.endChanging(t, i)
        }
        pointsCount() {
          return 3
        }
        name() {
          return 'Arc'
        }
        setPoint(t, i) {
          const e = { ...i },
            n = (0, s.ensureNotNull)(this.pointToScreenPoint(this._points[0])),
            l = (0, s.ensureNotNull)(this.pointToScreenPoint(this._points[1])),
            c = this._model.mainSeries().interval()
          switch (t) {
            case 0: {
              const t = (0, s.ensureNotNull)(this._dist),
                i = (0, s.ensureNotNull)(this.pointToScreenPoint(e)),
                n = l.subtract(i),
                o = i.add(l).scaled(0.5)
              let a = new r.Point(-n.y, n.x)
              a = a.normalized()
              const h = o.add(a.scaled(t))
              ;(this._points[0] = { ...e, interval: c }),
                (this._points[2] = {
                  ...(0, s.ensureNotNull)(this.screenPointToPoint(h)),
                  interval: c,
                })
              break
            }
            case 1: {
              const t = (0, s.ensureNotNull)(this._dist),
                i = (0, s.ensureNotNull)(this.pointToScreenPoint(e)),
                o = i.subtract(n),
                a = n.add(i).scaled(0.5),
                l = new r.Point(-o.y, o.x).normalized(),
                h = a.add(l.scaled(t))
              ;(this._points[1] = { ...e, interval: c }),
                (this._points[2] = {
                  ...(0, s.ensureNotNull)(this.screenPointToPoint(h)),
                  interval: c,
                })
              break
            }
            case 2: {
              let t = (0, s.ensureNotNull)(this.pointToScreenPoint(e))
              const i = (0, o.distanceToLine)(n, l, t).distance,
                h = l.subtract(n),
                u = n.add(l).scaled(0.5),
                d = new r.Point(-h.y, h.x).normalized(),
                P = u.add(d.scaled(i)),
                p = u.add(d.scaled(-i)),
                _ = h.length(),
                f = h.x / _,
                m = h.y / _
              let N = Math.acos(f)
              m < 0 && (N = -N)
              let w = (0, a.translationMatrix)(-u.x, -u.y)
              t = (0, a.transformPoint)(w, t)
              let g = (0, a.transformPoint)(w, P)
              ;(w = (0, a.rotationMatrix)(-N)),
                (t = (0, a.transformPoint)(w, t)),
                (g = (0, a.transformPoint)(w, g)),
                (w = (0, a.scalingMatrix)(1, _ / (2 * i))),
                (t = (0, a.transformPoint)(w, t)),
                (g = (0, a.transformPoint)(w, g))
              const T =
                t.y * g.y >= 0 ? new r.Point(P.x, P.y) : new r.Point(p.x, p.y)
              this._points[2] = {
                ...(0, s.ensureNotNull)(this.screenPointToPoint(T)),
                interval: c,
              }
              break
            }
          }
          this._normalizePoints()
        }
        migrateVersion(t, i, e) {
          if (1 === t && 2 === this._points.length) {
            const t = this._model.mainSeries().interval(),
              i = (2 * this._points[0].price + 3 * this._points[1].price) / 5
            this._points.push({
              price: i,
              index: this._points[1].index,
              interval: t,
            })
          }
          if (1 === t && 2 === this._timePoint.length) {
            const t = {
              price:
                (2 * this._timePoint[0].price + 3 * this._timePoint[1].price) /
                5,
              offset: this._timePoint[1].offset,
              time_t: this._timePoint[1].time_t,
              interval: this._properties.childs().interval.value(),
            }
            this._timePoint.push(t)
          }
        }
        static createProperties(t, i) {
          const e = new l.DefaultProperty({
            defaultName: 'linetoolarc',
            state: i,
            theme: t,
          })
          return this._configureProperties(e), e
        }
        async _getPropertyDefinitionsViewModelClass() {
          return (
            await Promise.all([
              e.e(6406),
              e.e(3889),
              e.e(8009),
              e.e(8056),
              e.e(8537),
            ]).then(e.bind(e, 90490))
          ).GeneralFiguresDefinitionsViewModelBase
        }
        static _configureProperties(t) {
          super._configureProperties(t),
            t.addChild(
              'linesColors',
              new h.LineToolColorsProperty([t.childs().color]),
            )
        }
      }
    },
  },
])
