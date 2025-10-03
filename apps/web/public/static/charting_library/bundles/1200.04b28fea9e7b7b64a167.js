;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1200],
  {
    25422: (d, u, e) => {
      u.transformPoint =
        u.translationMatrix =
        u.scalingMatrix =
        u.rotationMatrix =
          void 0
      var f = e(86441)
      ;(u.rotationMatrix = (d) => {
        var u = Math.cos(d),
          e = Math.sin(d)
        return [
          [u, -e, 0],
          [e, u, 0],
          [0, 0, 1],
        ]
      }),
        (u.scalingMatrix = (d, u) => [
          [d, 0, 0],
          [0, u, 0],
          [0, 0, 1],
        ]),
        (u.translationMatrix = (d, u) => [
          [1, 0, d],
          [0, 1, u],
          [0, 0, 1],
        ]),
        (u.transformPoint = (d, u) => {
          for (var e = [u.x, u.y, 1], c = [0, 0, 0], t = 0; t < 3; t++)
            for (var i = 0; i < 3; i++) c[t] += e[i] * d[t][i]
          return new f.Point(c[0], c[1])
        })
    },
    6590: (d, u, e) => {
      e.d(u, { commonLineToolPropertiesStateKeys: () => f })
      const f = [
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
      var c, t, i
      !((d) => {
        ;(d[(d.NotShared = 0)] = 'NotShared'),
          (d[(d.SharedInLayout = 1)] = 'SharedInLayout'),
          (d[(d.GloballyShared = 2)] = 'GloballyShared')
      })(c || (c = {})),
        ((d) => {
          ;(d.BeforeAllAction = 'BeforeAll'), (d.CustomAction = 'CustomAction')
        })(t || (t = {})),
        ((d) => {
          ;(d.FloatingToolbarButton = 'FloatingToolbarButton'),
            (d.Default = 'Default')
        })(i || (i = {}))
    },
    38039: (d, u, e) => {
      e.d(u, { LineDataSourceProperty: () => a })
      var f = e(90054),
        c = e(16738),
        t = e(50151),
        i = e(32679)
      class a extends i.DefaultProperty {
        constructor({ templateKeys: d, ...u }) {
          super({
            ignoreAllowSavingDefaults: !0,
            saveNonDefaultUserPreferencesOnly: !0,
            ...u,
          }),
            (this._templateKeys = (0, t.ensureDefined)(
              d || this._allDefaultsKeys,
            ))
        }
        template() {
          return (0, i.extractState)(this.state(), this._templateKeys, [])
        }
        applyTemplate(d) {
          this.mergeAndFire(
            (0, i.extractState)(
              (0, c.default)(
                (0, f.default)(this._factoryDefaultsSupplier()),
                d,
              ),
              this._templateKeys,
            ),
          )
        }
      }
    },
    68498: (d, u, e) => {
      e.d(u, { SvgIconPaneView: () => p })
      var f = e(86441),
        c = e(25422),
        t = e(50151),
        i = e(19063),
        a = e(36036),
        n = e(95201),
        r = e(27916),
        s = e(19625),
        o = e(75919),
        l = e(56468)
      const b = (0, s.getHexColorByName)('color-tv-blue-600')
      class h extends o.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null)
        }
        setData(d) {
          this._data = d
        }
        hitTest(d) {
          if (null === this._data) return null
          const { size: u, angle: e, point: f } = this._data,
            t = (0, c.rotationMatrix)(-e),
            i = (0, c.transformPoint)(t, d.subtract(f))
          return Math.abs(i.y) <= u / 2 && Math.abs(i.x) <= u / 2
            ? new l.HitTestResult(l.HitTarget.MovePoint)
            : null
        }
        isOutOfScreen(d, u) {
          if (null === this._data) return !0
          const { size: e, point: f, angle: c } = this._data
          let t
          return (
            (t = c % (Math.PI / 2) == 0 ? e / 2 : Math.sqrt(e ** 2 * 2) / 2),
            f.x + t < 0 || f.x - t > u || f.y + t < 0 || f.y - t > d
          )
        }
        _drawImpl(d) {
          if (null === this._data) return
          const {
              size: u,
              svg: e,
              point: f,
              angle: c,
              color: t,
              background: i,
              selected: a,
            } = this._data,
            n = d.context
          n.translate(f.x, f.y)
          const r = c - Math.PI / 2
          n.rotate(r)
          const s = u / 2
          a &&
            ((n.fillStyle = i),
            (n.strokeStyle = b),
            n.beginPath(),
            n.rect(-s, -s, u, u),
            n.closePath(),
            n.fill(),
            n.stroke()),
            e &&
              (n.translate(-s, -s),
              null !== t && (n.fillStyle = t),
              e.render(n, {
                targetViewBox: { x: 0, y: 0, width: u, height: u },
                doNotApplyColors: null !== t,
              }))
        }
      }
      class p extends r.LineSourcePaneView {
        constructor(d, u, e) {
          super(d, u),
            (this._iconRenderer = new h()),
            (this._renderer = new n.CompositeRenderer()),
            (this._svg = e)
        }
        renderer(d) {
          return this._invalidated && this._updateImpl(d), this._renderer
        }
        _updateImpl(d) {
          if (
            (super._updateImpl(d),
            this._renderer.clear(),
            this._points.length < 1)
          )
            return
          const u = this._source.properties().childs(),
            e = u.size.value(),
            t = {
              point: this._points[0],
              color: this._iconColor(),
              size: e,
              svg: this._svg,
              angle: u.angle.value(),
              selected: this.areAnchorsVisible(),
              background: this._calculateBackgroundColor(),
            }
          this._iconRenderer.setData(t)
          const {
            mediaSize: { width: i, height: n },
          } = d
          this._iconRenderer.isOutOfScreen(n, i) ||
            this._renderer.append(this._iconRenderer)
          const [s] = this._points,
            o = this._source.getAnchorLimit()
          let l = new f.Point(Math.max(o, e) / 2, 0),
            b = new f.Point(0, Math.max(o, e) / 2)
          const h = (0, c.rotationMatrix)(u.angle.value())
          ;(l = (0, c.transformPoint)(h, l)), (b = (0, c.transformPoint)(h, b))
          const p = s.add(l),
            v = s.subtract(l),
            m = (0, r.thirdPointCursorType)(p, v),
            g = [
              (0, a.lineSourcePaneViewPointToLineAnchorPoint)(
                p,
                0,
                void 0,
                void 0,
                void 0,
                void 0,
                void 0,
                !0,
              ),
              (0, a.lineSourcePaneViewPointToLineAnchorPoint)(
                v,
                1,
                void 0,
                void 0,
                void 0,
                void 0,
                void 0,
                !0,
              ),
              (0, a.lineSourcePaneViewPointToLineAnchorPoint)(
                s.add(b),
                2,
                m,
                !0,
                void 0,
                void 0,
                void 0,
                !0,
              ),
              (0, a.lineSourcePaneViewPointToLineAnchorPoint)(
                s.subtract(b),
                3,
                m,
                !0,
                void 0,
                void 0,
                void 0,
                !0,
              ),
            ]
          this._renderer.append(this.createLineAnchor({ points: g }, 0))
        }
        _calculateBackgroundColor() {
          return (0, i.generateColor)(
            this._model.backgroundColorAtYPercentFromTop(
              this._points[0].y /
                (0, t.ensureNotNull)(
                  this._model.paneForSource(this._source),
                ).height(),
            ),
            60,
            !0,
          )
        }
      }
    },
    19365: (d, u, e) => {
      e.d(u, { getTwemojiUrl: () => c })
      var f = e(18438)
      function c(d, u) {
        let e = ''
        return (
          f.default.parse(
            d,
            (d) => (
              (e =
                f.default.base +
                ('svg' === u ? `svg/${d}.svg` : `72x72/${d}.png`)),
              !1
            ),
          ),
          e
        )
      }
      f.default.base = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/13.0.1/'
    },
    18438: (d, u, e) => {
      e.d(u, { default: () => f })
      const f = (() => {
        var d = {
            base: 'https://twemoji.maxcdn.com/v/13.0.1/',
            ext: '.png',
            size: '72x72',
            className: 'emoji',
            convert: {
              fromCodePoint: (d) => {
                var u = 'string' == typeof d ? Number.parseInt(d, 16) : d
                if (u < 65536) return a(u)
                return a(55296 + ((u -= 65536) >> 10), 56320 + (1023 & u))
              },
              toCodePoint: m,
            },
            onerror: function () {
              this.parentNode &&
                this.parentNode.replaceChild(n(this.alt, !1), this)
            },
            parse: (u, e) => {
              ;(e && 'function' != typeof e) || (e = { callback: e })
              return ('string' == typeof u ? b : l)(u, {
                callback: e.callback || r,
                attributes:
                  'function' == typeof e.attributes ? e.attributes : p,
                base: 'string' == typeof e.base ? e.base : d.base,
                ext: e.ext || d.ext,
                size:
                  e.folder ||
                  ((f = e.size || d.size),
                  'number' == typeof f ? f + 'x' + f : f),
                className: e.className || d.className,
                onerror: e.onerror || d.onerror,
              })
              var f
            },
            replace: v,
            test: (d) => {
              e.lastIndex = 0
              var u = e.test(d)
              return (e.lastIndex = 0), u
            },
          },
          u = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;',
          },
          e =
            /(?:\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d])|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udeeb\udeec\udef4-\udefc\udfe0-\udfeb]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78\udd7a-\uddb4\uddb7\uddba\uddbc-\uddcb\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7a\ude80-\ude86\ude90-\udea8\udeb0-\udeb6\udec0-\udec2\uded0-\uded6]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g,
          f = /\uFE0F/g,
          c = String.fromCharCode(8205),
          t = /[&<>'"]/g,
          i = /^(?:iframe|noframes|noscript|script|select|style|textarea)$/,
          a = String.fromCharCode
        return d
        function n(d, u) {
          return document.createTextNode(u ? d.replace(f, '') : d)
        }
        function r(d, u) {
          return ''.concat(u.base, u.size, '/', d, u.ext)
        }
        function s(d, u) {
          for (var e, f, c = d.childNodes, t = c.length; t--; )
            3 === (f = (e = c[t]).nodeType)
              ? u.push(e)
              : 1 !== f ||
                'ownerSVGElement' in e ||
                i.test(e.nodeName.toLowerCase()) ||
                s(e, u)
          return u
        }
        function o(d) {
          return m(d.indexOf(c) < 0 ? d.replace(f, '') : d)
        }
        function l(d, u) {
          for (
            var f,
              c,
              t,
              i,
              a,
              r,
              l,
              b,
              h,
              p,
              v,
              m,
              g,
              x = s(d, []),
              y = x.length;
            y--;
          ) {
            for (
              t = !1,
                i = document.createDocumentFragment(),
                r = (a = x[y]).nodeValue,
                b = 0;
              (l = e.exec(r));
            ) {
              if (
                ((h = l.index) !== b && i.appendChild(n(r.slice(b, h), !0)),
                (m = o((v = l[0]))),
                (b = h + v.length),
                (g = u.callback(m, u)),
                m && g)
              ) {
                for (c in (((p = new Image()).onerror = u.onerror),
                p.setAttribute('draggable', 'false'),
                (f = u.attributes(v, m))))
                  Object.hasOwn(f, c) &&
                    0 !== c.indexOf('on') &&
                    !p.hasAttribute(c) &&
                    p.setAttribute(c, f[c])
                ;(p.className = u.className),
                  (p.alt = v),
                  (p.src = g),
                  (t = !0),
                  i.appendChild(p)
              }
              p || i.appendChild(n(v, !1)), (p = null)
            }
            t &&
              (b < r.length && i.appendChild(n(r.slice(b), !0)),
              a.parentNode.replaceChild(i, a))
          }
          return d
        }
        function b(d, u) {
          return v(d, (d) => {
            var e,
              f,
              c = d,
              i = o(d),
              a = u.callback(i, u)
            if (i && a) {
              for (f in ((c = '<img '.concat(
                'class="',
                u.className,
                '" ',
                'draggable="false" ',
                'alt="',
                d,
                '"',
                ' src="',
                a,
                '"',
              )),
              (e = u.attributes(d, i))))
                Object.hasOwn(e, f) &&
                  0 !== f.indexOf('on') &&
                  -1 === c.indexOf(' ' + f + '=') &&
                  (c = c.concat(' ', f, '="', e[f].replace(t, h), '"'))
              c = c.concat('/>')
            }
            return c
          })
        }
        function h(d) {
          return u[d]
        }
        function p() {
          return null
        }
        function v(d, u) {
          return String(d).replace(e, u)
        }
        function m(d, u) {
          for (var e = [], f = 0, c = 0, t = 0; t < d.length; )
            (f = d.charCodeAt(t++)),
              c
                ? (e.push(
                    (65536 + ((c - 55296) << 10) + (f - 56320)).toString(16),
                  ),
                  (c = 0))
                : 55296 <= f && f <= 56319
                  ? (c = f)
                  : e.push(f.toString(16))
          return e.join(u || '-')
        }
      })()
    },
  },
])
