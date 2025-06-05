;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2464],
  {
    24654: (r) => {
      r.exports = (r) => {
        for (var e = [], n = r.length, t = 0; t < n; t++) {
          var i = r.charCodeAt(t)
          if (i >= 55296 && i <= 56319 && n > t + 1) {
            var u = r.charCodeAt(t + 1)
            u >= 56320 &&
              u <= 57343 &&
              ((i = 1024 * (i - 55296) + u - 56320 + 65536), (t += 1))
          }
          i < 128
            ? e.push(i)
            : i < 2048
              ? (e.push((i >> 6) | 192), e.push((63 & i) | 128))
              : i < 55296 || (i >= 57344 && i < 65536)
                ? (e.push((i >> 12) | 224),
                  e.push(((i >> 6) & 63) | 128),
                  e.push((63 & i) | 128))
                : i >= 65536 && i <= 1114111
                  ? (e.push((i >> 18) | 240),
                    e.push(((i >> 12) & 63) | 128),
                    e.push(((i >> 6) & 63) | 128),
                    e.push((63 & i) | 128))
                  : e.push(239, 191, 189)
        }
        return new Uint8Array(e).buffer
      }
    },
    9995: (r, e, n) => {
      var t = n(939340)
      r.exports = (r) => (
        (r = t((r ^= r >>> 16), 2246822507)),
        (r = t((r ^= r >>> 13), 3266489909)),
        (r ^= r >>> 16) >>> 0
      )
    },
    939340: (r) => {
      r.exports =
        Math.imul ||
        ((r, e) => {
          var n = 65535 & r,
            t = 65535 & e
          return (
            (n * t +
              (((((r >>> 16) & 65535) * t + n * ((e >>> 16) & 65535)) << 16) >>>
                0)) |
            0
          )
        })
    },
    116193: (r, e, n) => {
      n.d(e, { default: () => i })
      var t = n(390121)
      const i = (r) => (0, t.default)(r, 4)
    },
    855385: (r, e, n) => {
      var t = n(939340),
        i = n(9995),
        u = n(24654),
        o = new Uint32Array([3432918353, 461845907])
      function c(r, e) {
        return (r << e) | (r >>> (32 - e))
      }
      r.exports = (r, e) => {
        if (
          ((e = e ? 0 | e : 0),
          'string' == typeof r && (r = u(r)),
          !(r instanceof ArrayBuffer))
        )
          throw new TypeError('Expected key to be ArrayBuffer or string')
        var n = new Uint32Array([e])
        return (
          ((r, e) => {
            for (
              var n = (r.byteLength / 4) | 0,
                i = new Uint32Array(r, 0, n),
                u = 0;
              u < n;
              u++
            )
              (i[u] = t(i[u], o[0])),
                (i[u] = c(i[u], 15)),
                (i[u] = t(i[u], o[1])),
                (e[0] = e[0] ^ i[u]),
                (e[0] = c(e[0], 13)),
                (e[0] = t(e[0], 5) + 3864292196)
          })(r, n),
          ((r, e) => {
            var n = (r.byteLength / 4) | 0,
              i = r.byteLength % 4,
              u = 0,
              s = new Uint8Array(r, 4 * n, i)
            switch (i) {
              case 3:
                u ^= s[2] << 16
              case 2:
                u ^= s[1] << 8
              case 1:
                ;(u ^= s[0] << 0),
                  (u = c((u = t(u, o[0])), 15)),
                  (u = t(u, o[1])),
                  (e[0] = e[0] ^ u)
            }
          })(r, n),
          ((r, e) => {
            ;(e[0] = e[0] ^ r.byteLength), (e[0] = i(e[0]))
          })(r, n),
          n.buffer
        )
      }
    },
    265742: (r, e, n) => {
      var t = n(500962)
      ;(e.createRoot = t.createRoot), t.hydrateRoot
    },
    265728: (r, e, n) => {
      n.d(e, { ReplaySubject: () => o })
      var t = n(446685),
        i = n(737538),
        u = n(712813),
        o = ((r) => {
          function e(e, n, t) {
            void 0 === e && (e = 1 / 0),
              void 0 === n && (n = 1 / 0),
              void 0 === t && (t = u.dateTimestampProvider)
            var i = r.call(this) || this
            return (
              (i._bufferSize = e),
              (i._windowTime = n),
              (i._timestampProvider = t),
              (i._buffer = []),
              (i._infiniteTimeWindow = !0),
              (i._infiniteTimeWindow = n === 1 / 0),
              (i._bufferSize = Math.max(1, e)),
              (i._windowTime = Math.max(1, n)),
              i
            )
          }
          return (
            (0, t.__extends)(e, r),
            (e.prototype.next = function (e) {
              var t = this.isStopped,
                i = this._buffer,
                u = this._infiniteTimeWindow,
                o = this._timestampProvider,
                c = this._windowTime
              t || (i.push(e), !u && i.push(o.now() + c)),
                this._trimBuffer(),
                r.prototype.next.call(this, e)
            }),
            (e.prototype._subscribe = function (r) {
              this._throwIfClosed(), this._trimBuffer()
              for (
                var e = this._innerSubscribe(r),
                  n = this._infiniteTimeWindow,
                  t = this._buffer.slice(),
                  i = 0;
                i < t.length && !r.closed;
                i += n ? 1 : 2
              )
                r.next(t[i])
              return this._checkFinalizedStatuses(r), e
            }),
            (e.prototype._trimBuffer = function () {
              var e = this._bufferSize,
                n = this._timestampProvider,
                t = this._buffer,
                i = this._infiniteTimeWindow,
                u = (i ? 1 : 2) * e
              if (
                (e < 1 / 0 && u < t.length && t.splice(0, t.length - u), !i)
              ) {
                for (
                  var o = n.now(), c = 0, s = 1;
                  s < t.length && t[s] <= o;
                  s += 2
                )
                  c = s
                c && t.splice(0, c + 1)
              }
            }),
            e
          )
        })(i.Subject)
    },
    749401: (r, e, n) => {
      n.d(e, { firstValueFrom: () => u })
      var t = (0, n(530634).createErrorClass)(
          (r) =>
            function () {
              r(this),
                (this.name = 'EmptyError'),
                (this.message = 'no elements in sequence')
            },
        ),
        i = n(620210)
      function u(r, e) {
        var n = 'object' == typeof e
        return new Promise((u, o) => {
          var c = new i.SafeSubscriber({
            next: (r) => {
              u(r), c.unsubscribe()
            },
            error: o,
            complete: () => {
              n ? u(e.defaultValue) : o(new t())
            },
          })
          r.subscribe(c)
        })
      }
    },
    958261: (r, e, n) => {
      n.d(e, { combineLatest: () => h })
      var t = n(815544),
        i = Array.isArray,
        u = Object.getPrototypeOf,
        o = Object.prototype,
        c = Object.keys
      function s(r) {
        if (1 === r.length) {
          var e = r[0]
          if (i(e)) return { args: e, keys: null }
          if ((t = e) && 'object' == typeof t && u(t) === o) {
            var n = c(e)
            return { args: n.map((r) => e[r]), keys: n }
          }
        }
        var t
        return { args: r, keys: null }
      }
      var a = n(839874),
        f = n(472484),
        l = n(91034),
        b = n(595940)
      function p(r, e) {
        return r.reduce((r, n, t) => ((r[n] = e[t]), r), {})
      }
      var v = n(138966),
        d = n(72117)
      function h() {
        for (var r = [], e = 0; e < arguments.length; e++) r[e] = arguments[e]
        var n = (0, b.popScheduler)(r),
          i = (0, b.popResultSelector)(r),
          u = s(r),
          o = u.args,
          c = u.keys
        if (0 === o.length) return (0, a.from)([], n)
        var v = new t.Observable(m(o, n, c ? (r) => p(c, r) : f.identity))
        return i ? v.pipe((0, l.mapOneOrManyArgs)(i)) : v
      }
      function m(r, e, n) {
        return (
          void 0 === n && (n = f.identity),
          (t) => {
            w(
              e,
              () => {
                for (
                  var i = r.length,
                    u = new Array(i),
                    o = i,
                    c = i,
                    s = (i) => {
                      w(
                        e,
                        () => {
                          var s = (0, a.from)(r[i], e),
                            f = !1
                          s.subscribe(
                            new v.OperatorSubscriber(
                              t,
                              (r) => {
                                ;(u[i] = r),
                                  f || ((f = !0), c--),
                                  c || t.next(n(u.slice()))
                              },
                              () => {
                                --o || t.complete()
                              },
                            ),
                          )
                        },
                        t,
                      )
                    },
                    f = 0;
                  f < i;
                  f++
                )
                  s(f)
              },
              t,
            )
          }
        )
      }
      function w(r, e, n) {
        r ? (0, d.executeSchedule)(n, r, e) : e()
      }
    },
    423869: (r, e, n) => {
      n.d(e, { EMPTY: () => t })
      var t = new (n(815544).Observable)((r) => r.complete())
    },
    323002: (r, e, n) => {
      n.d(e, { merge: () => s })
      var t = n(925186),
        i = n(771035),
        u = n(423869),
        o = n(595940),
        c = n(839874)
      function s() {
        for (var r = [], e = 0; e < arguments.length; e++) r[e] = arguments[e]
        var n = (0, o.popScheduler)(r),
          s = (0, o.popNumber)(r, 1 / 0),
          a = r
        return a.length
          ? 1 === a.length
            ? (0, i.innerFrom)(a[0])
            : (0, t.mergeAll)(s)((0, c.from)(a, n))
          : u.EMPTY
      }
    },
    586639: (r, e, n) => {
      n.d(e, { of: () => u })
      var t = n(595940),
        i = n(839874)
      function u() {
        for (var r = [], e = 0; e < arguments.length; e++) r[e] = arguments[e]
        var n = (0, t.popScheduler)(r)
        return (0, i.from)(r, n)
      }
    },
    196573: (r, e, n) => {
      n.d(e, { catchError: () => o })
      var t = n(771035),
        i = n(138966),
        u = n(116217)
      function o(r) {
        return (0, u.operate)((e, n) => {
          var u,
            c = null,
            s = !1
          ;(c = e.subscribe(
            new i.OperatorSubscriber(n, void 0, void 0, (i) => {
              ;(u = (0, t.innerFrom)(r(i, o(r)(e)))),
                c ? (c.unsubscribe(), (c = null), u.subscribe(n)) : (s = !0)
            }),
          )),
            s && (c.unsubscribe(), (c = null), u.subscribe(n))
        })
      }
    },
    218286: (r, e, n) => {
      n.d(e, { distinctUntilChanged: () => o })
      var t = n(472484),
        i = n(116217),
        u = n(138966)
      function o(r, e) {
        return (
          void 0 === e && (e = t.identity),
          (r = null != r ? r : c),
          (0, i.operate)((n, t) => {
            var i,
              o = !0
            n.subscribe(
              new u.OperatorSubscriber(t, (n) => {
                var u = e(n)
                ;(!o && r(i, u)) || ((o = !1), (i = u), t.next(n))
              }),
            )
          })
        )
      }
      function c(r, e) {
        return r === e
      }
    },
    169977: (r, e, n) => {
      n.d(e, { filter: () => u })
      var t = n(116217),
        i = n(138966)
      function u(r, e) {
        return (0, t.operate)((n, t) => {
          var u = 0
          n.subscribe(
            new i.OperatorSubscriber(t, (n) => r.call(e, n, u++) && t.next(n)),
          )
        })
      }
    },
    312694: (r, e, n) => {
      n.d(e, { share: () => a })
      var t = n(446685),
        i = n(839874),
        u = n(346502),
        o = n(737538),
        c = n(620210),
        s = n(116217)
      function a(r) {
        void 0 === r && (r = {})
        var e = r.connector,
          n = void 0 === e ? () => new o.Subject() : e,
          t = r.resetOnError,
          u = void 0 === t || t,
          a = r.resetOnComplete,
          l = void 0 === a || a,
          b = r.resetOnRefCountZero,
          p = void 0 === b || b
        return (r) => {
          var e = null,
            t = null,
            o = null,
            a = 0,
            b = !1,
            v = !1,
            d = () => {
              null == t || t.unsubscribe(), (t = null)
            },
            h = () => {
              d(), (e = o = null), (b = v = !1)
            },
            m = () => {
              var r = e
              h(), null == r || r.unsubscribe()
            }
          return (0, s.operate)((r, s) => {
            a++, v || b || d()
            var w = (o = null != o ? o : n())
            s.add(() => {
              0 !== --a || v || b || (t = f(m, p))
            }),
              w.subscribe(s),
              e ||
                ((e = new c.SafeSubscriber({
                  next: (r) => w.next(r),
                  error: (r) => {
                    ;(v = !0), d(), (t = f(h, u, r)), w.error(r)
                  },
                  complete: () => {
                    ;(b = !0), d(), (t = f(h, l)), w.complete()
                  },
                })),
                (0, i.from)(r).subscribe(e))
          })(r)
        }
      }
      function f(r, e) {
        for (var n = [], i = 2; i < arguments.length; i++)
          n[i - 2] = arguments[i]
        return !0 === e
          ? (r(), null)
          : !1 === e
            ? null
            : e
                .apply(void 0, (0, t.__spreadArray)([], (0, t.__read)(n), !1))
                .pipe((0, u.take)(1))
                .subscribe(() => r())
      }
    },
    173587: (r, e, n) => {
      n.d(e, { skip: () => i })
      var t = n(169977)
      function i(r) {
        return (0, t.filter)((e, n) => r <= n)
      }
    },
    233064: (r, e, n) => {
      n.d(e, { switchMap: () => o })
      var t = n(771035),
        i = n(116217),
        u = n(138966)
      function o(r, e) {
        return (0, i.operate)((n, i) => {
          var o = null,
            c = 0,
            s = !1,
            a = () => s && !o && i.complete()
          n.subscribe(
            new u.OperatorSubscriber(
              i,
              (n) => {
                null == o || o.unsubscribe()
                var s = 0,
                  f = c++
                ;(0, t.innerFrom)(r(n, f)).subscribe(
                  (o = new u.OperatorSubscriber(
                    i,
                    (r) => i.next(e ? e(n, r, f, s++) : r),
                    () => {
                      ;(o = null), a()
                    },
                  )),
                )
              },
              () => {
                ;(s = !0), a()
              },
            ),
          )
        })
      }
    },
    346502: (r, e, n) => {
      n.d(e, { take: () => o })
      var t = n(423869),
        i = n(116217),
        u = n(138966)
      function o(r) {
        return r <= 0
          ? () => t.EMPTY
          : (0, i.operate)((e, n) => {
              var t = 0
              e.subscribe(
                new u.OperatorSubscriber(n, (e) => {
                  ++t <= r && (n.next(e), r <= t && n.complete())
                }),
              )
            })
      }
    },
    482165: (r, e, n) => {
      n.d(e, { tap: () => c })
      var t = n(38323),
        i = n(116217),
        u = n(138966),
        o = n(472484)
      function c(r, e, n) {
        var c =
          (0, t.isFunction)(r) || e || n
            ? { next: r, error: e, complete: n }
            : r
        return c
          ? (0, i.operate)((r, e) => {
              var n
              null === (n = c.subscribe) || void 0 === n || n.call(c)
              var t = !0
              r.subscribe(
                new u.OperatorSubscriber(
                  e,
                  (r) => {
                    var n
                    null === (n = c.next) || void 0 === n || n.call(c, r),
                      e.next(r)
                  },
                  () => {
                    var r
                    ;(t = !1),
                      null === (r = c.complete) || void 0 === r || r.call(c),
                      e.complete()
                  },
                  (r) => {
                    var n
                    ;(t = !1),
                      null === (n = c.error) || void 0 === n || n.call(c, r),
                      e.error(r)
                  },
                  () => {
                    var r, e
                    t &&
                      (null === (r = c.unsubscribe) ||
                        void 0 === r ||
                        r.call(c)),
                      null === (e = c.finalize) || void 0 === e || e.call(c)
                  },
                ),
              )
            })
          : o.identity
      }
    },
    712813: (r, e, n) => {
      n.d(e, { dateTimestampProvider: () => t })
      var t = { now: () => (t.delegate || Date).now(), delegate: void 0 }
    },
  },
])
