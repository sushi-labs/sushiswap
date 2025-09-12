;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8402],
  {
    59142: (d, u) => {
      var e, f, c
      ;(f = [u]),
        (e = (d) => {
          function u(d) {
            if (Array.isArray(d)) {
              for (var u = 0, e = Array(d.length); u < d.length; u++)
                e[u] = d[u]
              return e
            }
            return Array.from(d)
          }
          Object.defineProperty(d, '__esModule', { value: !0 })
          var e = !1
          if ('undefined' != typeof window) {
            var f = {
              get passive() {
                e = !0
              },
            }
            window.addEventListener('testPassive', null, f),
              window.removeEventListener('testPassive', null, f)
          }
          var c =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            t = [],
            n = !1,
            r = -1,
            o = void 0,
            a = void 0,
            i = (d) =>
              t.some(
                (u) =>
                  !(!u.options.allowTouchMove || !u.options.allowTouchMove(d)),
              ),
            s = (d) => {
              var u = d || window.event
              return (
                !!i(u.target) ||
                1 < u.touches.length ||
                (u.preventDefault && u.preventDefault(), !1)
              )
            },
            l = () => {
              setTimeout(() => {
                void 0 !== a &&
                  ((document.body.style.paddingRight = a), (a = void 0)),
                  void 0 !== o &&
                    ((document.body.style.overflow = o), (o = void 0))
              })
            }
          ;(d.disableBodyScroll = (d, f) => {
            if (c) {
              if (!d)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (d && !t.some((u) => u.targetElement === d)) {
                var l = { targetElement: d, options: f || {} }
                ;(t = [].concat(u(t), [l])),
                  (d.ontouchstart = (d) => {
                    1 === d.targetTouches.length &&
                      (r = d.targetTouches[0].clientY)
                  }),
                  (d.ontouchmove = (u) => {
                    var e, f, c, t
                    1 === u.targetTouches.length &&
                      ((f = d),
                      (t = (e = u).targetTouches[0].clientY - r),
                      !i(e.target) &&
                        ((f && 0 === f.scrollTop && 0 < t) ||
                        ((c = f) &&
                          c.scrollHeight - c.scrollTop <= c.clientHeight &&
                          t < 0)
                          ? s(e)
                          : e.stopPropagation()))
                  }),
                  n ||
                    (document.addEventListener(
                      'touchmove',
                      s,
                      e ? { passive: !1 } : void 0,
                    ),
                    (n = !0))
              }
            } else {
              ;(p = f),
                setTimeout(() => {
                  if (void 0 === a) {
                    var d = !!p && !0 === p.reserveScrollBarGap,
                      u =
                        window.innerWidth - document.documentElement.clientWidth
                    d &&
                      0 < u &&
                      ((a = document.body.style.paddingRight),
                      (document.body.style.paddingRight = u + 'px'))
                  }
                  void 0 === o &&
                    ((o = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var b = { targetElement: d, options: f || {} }
              t = [].concat(u(t), [b])
            }
            var p
          }),
            (d.clearAllBodyScrollLocks = () => {
              c
                ? (t.forEach((d) => {
                    ;(d.targetElement.ontouchstart = null),
                      (d.targetElement.ontouchmove = null)
                  }),
                  n &&
                    (document.removeEventListener(
                      'touchmove',
                      s,
                      e ? { passive: !1 } : void 0,
                    ),
                    (n = !1)),
                  (t = []),
                  (r = -1))
                : (l(), (t = []))
            }),
            (d.enableBodyScroll = (d) => {
              if (c) {
                if (!d)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(d.ontouchstart = null),
                  (d.ontouchmove = null),
                  (t = t.filter((u) => u.targetElement !== d)),
                  n &&
                    0 === t.length &&
                    (document.removeEventListener(
                      'touchmove',
                      s,
                      e ? { passive: !1 } : void 0,
                    ),
                    (n = !1))
              } else
                1 === t.length && t[0].targetElement === d
                  ? (l(), (t = []))
                  : (t = t.filter((u) => u.targetElement !== d))
            })
        }),
        void 0 === (c = 'function' == typeof e ? e.apply(u, f) : e) ||
          (d.exports = c)
    },
    97754: (d, u) => {
      var e
      !(() => {
        var f = {}.hasOwnProperty
        function c() {
          for (var d = [], u = 0; u < arguments.length; u++) {
            var e = arguments[u]
            if (e) {
              var t = typeof e
              if ('string' === t || 'number' === t) d.push(e)
              else if (Array.isArray(e) && e.length) {
                var n = c.apply(null, e)
                n && d.push(n)
              } else if ('object' === t)
                for (var r in e) f.call(e, r) && e[r] && d.push(r)
            }
          }
          return d.join(' ')
        }
        d.exports
          ? ((c.default = c), (d.exports = c))
          : void 0 === (e = (() => c).apply(u, [])) || (d.exports = e)
      })()
    },
    6132: (d, u, e) => {
      var f = e(22134)
      function c() {}
      function t() {}
      ;(t.resetWarningCache = c),
        (d.exports = () => {
          function d(d, u, e, c, t, n) {
            if (n !== f) {
              var r = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types',
              )
              throw ((r.name = 'Invariant Violation'), r)
            }
          }
          function u() {
            return d
          }
          d.isRequired = d
          var e = {
            array: d,
            bool: d,
            func: d,
            number: d,
            object: d,
            string: d,
            symbol: d,
            any: d,
            arrayOf: u,
            element: d,
            elementType: d,
            instanceOf: u,
            node: d,
            objectOf: u,
            oneOf: u,
            oneOfType: u,
            shape: u,
            exact: u,
            checkPropTypes: t,
            resetWarningCache: c,
          }
          return (e.PropTypes = e), e
        })
    },
    19036: (d, u, e) => {
      d.exports = e(6132)()
    },
    22134: (d) => {
      d.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
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
                if (u < 65536) return r(u)
                return r(55296 + ((u -= 65536) >> 10), 56320 + (1023 & u))
              },
              toCodePoint: g,
            },
            onerror: function () {
              this.parentNode &&
                this.parentNode.replaceChild(o(this.alt, !1), this)
            },
            parse: (u, e) => {
              ;(e && 'function' != typeof e) || (e = { callback: e })
              return ('string' == typeof u ? b : l)(u, {
                callback: e.callback || a,
                attributes:
                  'function' == typeof e.attributes ? e.attributes : v,
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
            replace: h,
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
          n = /^(?:iframe|noframes|noscript|script|select|style|textarea)$/,
          r = String.fromCharCode
        return d
        function o(d, u) {
          return document.createTextNode(u ? d.replace(f, '') : d)
        }
        function a(d, u) {
          return ''.concat(u.base, u.size, '/', d, u.ext)
        }
        function i(d, u) {
          for (var e, f, c = d.childNodes, t = c.length; t--; )
            3 === (f = (e = c[t]).nodeType)
              ? u.push(e)
              : 1 !== f ||
                'ownerSVGElement' in e ||
                n.test(e.nodeName.toLowerCase()) ||
                i(e, u)
          return u
        }
        function s(d) {
          return g(d.indexOf(c) < 0 ? d.replace(f, '') : d)
        }
        function l(d, u) {
          for (
            var f,
              c,
              t,
              n,
              r,
              a,
              l,
              b,
              p,
              v,
              h,
              g,
              m,
              y = i(d, []),
              w = y.length;
            w--;
          ) {
            for (
              t = !1,
                n = document.createDocumentFragment(),
                a = (r = y[w]).nodeValue,
                b = 0;
              (l = e.exec(a));
            ) {
              if (
                ((p = l.index) !== b && n.appendChild(o(a.slice(b, p), !0)),
                (g = s((h = l[0]))),
                (b = p + h.length),
                (m = u.callback(g, u)),
                g && m)
              ) {
                for (c in (((v = new Image()).onerror = u.onerror),
                v.setAttribute('draggable', 'false'),
                (f = u.attributes(h, g))))
                  Object.hasOwn(f, c) &&
                    0 !== c.indexOf('on') &&
                    !v.hasAttribute(c) &&
                    v.setAttribute(c, f[c])
                ;(v.className = u.className),
                  (v.alt = h),
                  (v.src = m),
                  (t = !0),
                  n.appendChild(v)
              }
              v || n.appendChild(o(h, !1)), (v = null)
            }
            t &&
              (b < a.length && n.appendChild(o(a.slice(b), !0)),
              r.parentNode.replaceChild(n, r))
          }
          return d
        }
        function b(d, u) {
          return h(d, (d) => {
            var e,
              f,
              c = d,
              n = s(d),
              r = u.callback(n, u)
            if (n && r) {
              for (f in ((c = '<img '.concat(
                'class="',
                u.className,
                '" ',
                'draggable="false" ',
                'alt="',
                d,
                '"',
                ' src="',
                r,
                '"',
              )),
              (e = u.attributes(d, n))))
                Object.hasOwn(e, f) &&
                  0 !== f.indexOf('on') &&
                  -1 === c.indexOf(' ' + f + '=') &&
                  (c = c.concat(' ', f, '="', e[f].replace(t, p), '"'))
              c = c.concat('/>')
            }
            return c
          })
        }
        function p(d) {
          return u[d]
        }
        function v() {
          return null
        }
        function h(d, u) {
          return String(d).replace(e, u)
        }
        function g(d, u) {
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
    55698: (d, u, e) => {
      e.d(u, { nanoid: () => f })
      const f = (d = 21) =>
        crypto
          .getRandomValues(new Uint8Array(d))
          .reduce(
            (d, u) =>
              (d +=
                (u &= 63) < 36
                  ? u.toString(36)
                  : u < 62
                    ? (u - 26).toString(36).toUpperCase()
                    : u > 62
                      ? '-'
                      : '_'),
            '',
          )
    },
  },
])
