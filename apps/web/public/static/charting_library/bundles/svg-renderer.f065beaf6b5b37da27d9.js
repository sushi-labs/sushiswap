;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2616],
  {
    50765: (t, e, i) => {
      i.r(e), i.d(e, { svgRenderer: () => S })
      var s = i(50151),
        r = i(59224)
      const n = (0, r.getLogger)('Chart.SvgParser')
      function o(t, e) {
        const i = t.split(/[,\s]/).map((t) => Number.parseFloat(t.trim()))
        let s = 0
        for (const t of i) {
          if (!Number.isFinite(t) && s < e) return null
          s += 1
        }
        return i
      }
      const l = /([a-zA-Z]+)\((.*)\)/g
      function a(t) {
        var e
        const i =
          null === (e = t.getAttribute('transform')) || void 0 === e
            ? void 0
            : e.toLowerCase()
        if (void 0 === i) return null
        const s = []
        let r
        l.lastIndex = 0
        do {
          if (((r = l.exec(i)), null !== r)) {
            const t = r[1],
              e = r[2]
            switch (t) {
              case 'matrix':
                const i = o(e, 6)
                null !== i &&
                  s.push({
                    type: t,
                    a: i[0],
                    b: i[1],
                    c: i[2],
                    d: i[3],
                    e: i[4],
                    f: i[5],
                  })
                break
              case 'rotate':
                const r = o(e, 1)
                null !== r && s.push({ type: t, a: r[0], x: r[1], y: r[2] })
                break
              case 'translate':
                const l = o(e, 1)
                null !== l && s.push({ type: t, x: l[0], y: l[1] })
                break
              case 'scale':
                const a = o(e, 1)
                null !== a && s.push({ type: t, x: a[0], y: a[1] })
                break
              default:
                n.logWarn(`Unsupported transform operation: ${t}`)
            }
          }
        } while (null !== r)
        return 0 === s.length ? null : s
      }
      function c(t, e) {
        var i, s
        for (const r of e)
          switch (r.type) {
            case 'matrix':
              t.transform(r.a, r.b, r.c, r.d, r.e, r.f)
              break
            case 'rotate':
              void 0 !== r.x && void 0 !== r.y && t.translate(r.x, r.y),
                t.rotate((r.a * Math.PI) / 180),
                void 0 !== r.x && void 0 !== r.y && t.translate(-r.x, -r.y)
              break
            case 'scale':
              t.scale(r.x, null !== (i = r.y) && void 0 !== i ? i : r.x)
              break
            case 'translate':
              t.translate(r.x, null !== (s = r.y) && void 0 !== s ? s : 0)
          }
      }
      function u(t, e) {
        var i
        return Number.parseFloat(
          null !== (i = t.getAttribute(e)) && void 0 !== i ? i : '',
        )
      }
      const h = /^url\(#(.*)\)/
      function g(t) {
        var e, i
        return null !==
          (i = null === (e = h.exec(t)) || void 0 === e ? void 0 : e[1]) &&
          void 0 !== i
          ? i
          : null
      }
      function d(t, e, i) {
        const r = {},
          n = t.getAttribute('fill')
        if (null !== n) {
          const t = g(n)
          r.getFillStyle =
            null !== t
              ? (i) => (0, s.ensureDefined)(e.getStyle(t, i))
              : (t) => n
        }
        const o = t.getAttribute('stroke')
        if (null !== o) {
          const t = g(o)
          r.getStrokeStyle =
            null !== t
              ? (i) => (0, s.ensureDefined)(e.getStyle(t, i))
              : (t) => o
        }
        const l = u(t, 'stroke-width')
        Number.isFinite(l) && (r.strokeWidth = l)
        const c = u(t, 'opacity')
        Number.isFinite(c) && ((r.fillOpacity = c), (r.strokeOpacity = c))
        const h = u(t, 'stroke-opacity')
        Number.isFinite(h) && (r.strokeOpacity = h)
        const d = u(t, 'fill-opacity')
        if ((Number.isFinite(d) && (r.fillOpacity = d), i)) {
          const e = a(t)
          null !== e && (r.transform = e)
        }
        return r
      }
      class p {
        constructor(t) {
          this._transformOperations = t
        }
        apply(t, e) {
          null !== this._transformOperations
            ? (t.save(), c(t, this._transformOperations))
            : t.restore()
        }
      }
      class f {
        constructor(t, e, i) {
          this._styleData = { ...i, ...d(t, e, !0) }
        }
        apply(t, e) {
          if (!this._isValid()) return
          const {
              getFillStyle: i,
              getStrokeStyle: s,
              strokeWidth: r,
              transform: n,
              strokeOpacity: o,
              fillOpacity: l,
            } = this._styleData,
            a = void 0 !== n || void 0 !== o || void 0 !== l
          a && (t.save(), void 0 !== n && c(t, n)), this._render(t)
          const u = null == i ? void 0 : i(t)
          'none' !== u &&
            (e.doNotApplyColors ||
              (void 0 !== l && (t.globalAlpha = l),
              (t.fillStyle = null != u ? u : 'black')),
            this._fill(t))
          const h = null == s ? void 0 : s(t)
          void 0 !== h &&
            'none' !== h &&
            (void 0 !== r && (t.lineWidth = r),
            e.doNotApplyColors ||
              (void 0 !== l && (t.globalAlpha = l), (t.strokeStyle = h)),
            this._stroke(t)),
            a && t.restore()
        }
        _fill(t) {
          t.fill()
        }
        _stroke(t) {
          t.stroke()
        }
      }
      class y extends f {
        constructor(t, e, i) {
          var s
          super(t, e, i)
          const r = t.getAttribute('d')
          ;(this._path = null !== r ? new Path2D(r) : null),
            (this._fillRule =
              null !== (s = t.getAttribute('fill-rule')) && void 0 !== s
                ? s
                : void 0)
        }
        _fill(t) {
          t.fill((0, s.ensureNotNull)(this._path), this._fillRule)
        }
        _stroke(t) {
          t.stroke((0, s.ensureNotNull)(this._path))
        }
        _render(t) {}
        _isValid() {
          return null !== this._path
        }
      }
      class v extends f {
        constructor(t, e, i) {
          super(t, e, i),
            (this._cx = u(t, 'cx')),
            (this._cy = u(t, 'cy')),
            (this._r = u(t, 'r'))
        }
        _render(t) {
          t.beginPath(), t.arc(this._cx, this._cy, this._r, 0, 2 * Math.PI)
        }
        _isValid() {
          return (
            Number.isFinite(this._cx) &&
            Number.isFinite(this._cy) &&
            Number.isFinite(this._r)
          )
        }
      }
      class _ extends f {
        constructor(t, e, i) {
          super(t, e, i),
            (this._cx = u(t, 'cx')),
            (this._cy = u(t, 'cy')),
            (this._rx = u(t, 'rx')),
            (this._ry = u(t, 'ry'))
        }
        _render(t) {
          t.beginPath(),
            t.ellipse(this._cx, this._cy, this._rx, this._ry, 0, 0, 2 * Math.PI)
        }
        _isValid() {
          return (
            Number.isFinite(this._cx) &&
            Number.isFinite(this._cy) &&
            Number.isFinite(this._rx) &&
            Number.isFinite(this._ry)
          )
        }
      }
      class x {
        constructor(t) {
          this._originalViewBox = t
        }
        apply(t, e) {
          const i = e.targetViewBox
          t.translate(i.x, i.y),
            t.scale(
              i.width / this._originalViewBox.width,
              i.height / this._originalViewBox.height,
            ),
            t.beginPath(),
            t.rect(
              0,
              0,
              this._originalViewBox.width,
              this._originalViewBox.height,
            ),
            t.clip(),
            t.translate(-this._originalViewBox.x, -this._originalViewBox.y)
        }
      }
      const b = (0, r.getLogger)('Chart.SvgParser')
      function m(t) {
        const e = t.getAttribute('gradientUnits')
        if ('objectBoundingBox' === e)
          return void b.logWarn(
            `Unsupported linearGradient gradientUnits: ${e}`,
          )
        const i = [],
          s = t.getElementsByTagName('stop')
        for (let t = 0; t < s.length; ++t) {
          const e = s[t],
            r = u(e, 'offset'),
            n = e.getAttribute('stop-color')
          null !== n && i.push([Number.isFinite(r) ? r : 0, n])
        }
        const r = u(t, 'x1'),
          n = u(t, 'y1'),
          o = u(t, 'x2'),
          l = u(t, 'y2')
        return (t) => {
          const e = t.createLinearGradient(r, n, o, l)
          for (const t of i) e.addColorStop(t[0], t[1])
          return e
        }
      }
      const w = (0, r.getLogger)('Chart.SvgParser')
      const k = new DOMParser(),
        N = (0, r.getLogger)('Chart.SvgParser')
      function F(t, e, i, s) {
        var r
        const n = t.children
        let o,
          l = s
        ;('g' !== t.tagName && 'svg' !== t.tagName) ||
          ((l = { ...l, ...d(t, i, !1) }),
          (o = null !== (r = a(t)) && void 0 !== r ? r : void 0)),
          void 0 !== o && e.push(new p(o))
        for (let t = 0; t < n.length; ++t) {
          const s = n[t]
          'defs' !== s.tagName && F(s, e, i, l)
        }
        switch ((void 0 !== o && e.push(new p(null)), t.tagName)) {
          case 'g':
          case 'svg':
          case 'defs':
            break
          case 'path':
            e.push(new y(t, i, s))
            break
          case 'circle':
            e.push(new v(t, i, s))
            break
          case 'ellipse':
            e.push(new _(t, i, s))
            break
          default:
            N.logWarn(`Unsupported tag name: ${t.tagName}`)
        }
      }
      function S(t) {
        const e = k.parseFromString(t, 'application/xml'),
          i = [],
          r = e.getElementsByTagName('svg')[0],
          n = (0, s.ensureNotNull)(r.getAttribute('viewBox'))
            .split(' ')
            .map(Number.parseFloat),
          o = { x: n[0], y: n[1], width: n[2], height: n[3] }
        i.push(new x(o))
        let l = { getStyle: () => {} }
        const a = r.getElementsByTagName('defs')
        return (
          a.length > 0 &&
            (l = ((t) => {
              const e = {},
                i = t.children
              for (let t = 0; t < i.length; ++t) {
                const s = i[t],
                  r = s.getAttribute('id')
                r &&
                  ('linearGradient' === s.tagName
                    ? (e[r] = m(s))
                    : w.logWarn(`Unsupported defs tag: ${s.tagName}`))
              }
              const s = new WeakMap()
              return {
                getStyle: (t, i) => {
                  const r = e[t]
                  if (!r) return
                  let n = s.get(i)
                  void 0 === n && ((n = new Map()), s.set(i, n))
                  const o = n.get(t)
                  if (void 0 !== o) return o
                  const l = r(i)
                  return n.set(t, l), l
                },
              }
            })(a[0])),
          F(r, i, l),
          {
            viewBox: () => o,
            render: (t, e) => {
              t.save()
              for (const s of i) s.apply(t, e)
              t.restore()
            },
          }
        )
      }
    },
  },
])
