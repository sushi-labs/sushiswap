;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1277, 4773],
  {
    254773: (n, t, e) => {
      e.d(t, { buffers: () => i.H, default: () => Q, eventChannel: () => N })
      var r = e(749209),
        c = e(315882),
        a = e(330950),
        o = e(375880),
        i = e(90932),
        u = e(721153)
      function f() {
        var n = {}
        return (
          (n.promise = new Promise((t, e) => {
            ;(n.resolve = t), (n.reject = e)
          })),
          n
        )
      }
      const s = f
      var l = [],
        v = 0
      function d(n) {
        try {
          g(), n()
        } finally {
          E()
        }
      }
      function h(n) {
        l.push(n), v || (g(), y())
      }
      function p(n) {
        try {
          return g(), n()
        } finally {
          y()
        }
      }
      function g() {
        v++
      }
      function E() {
        v--
      }
      function y() {
        var n
        for (E(); !v && void 0 !== (n = l.shift()); ) d(n)
      }
      var k = (n) => (t) => n.some((n) => b(n)(t)),
        m = (n) => (t) => n(t),
        C = (n) => (t) => t.type === String(n),
        A = (n) => (t) => t.type === n,
        T = () => i.k
      function b(n) {
        var t =
          '*' === n
            ? T
            : (0, o.string)(n)
              ? C
              : (0, o.array)(n)
                ? k
                : (0, o.stringableFunc)(n)
                  ? C
                  : (0, o.func)(n)
                    ? m
                    : (0, o.symbol)(n)
                      ? A
                      : null
        if (null === t) throw new Error('invalid pattern: ' + n)
        return t(n)
      }
      var S = { type: r.CHANNEL_END_TYPE },
        j = (n) => n && n.type === r.CHANNEL_END_TYPE
      function x(n) {
        void 0 === n && (n = (0, i.e)())
        var t = !1,
          e = []
        return {
          take: (r) => {
            t && n.isEmpty()
              ? r(S)
              : n.isEmpty()
                ? (e.push(r),
                  (r.cancel = () => {
                    ;(0, i.r)(e, r)
                  }))
                : r(n.take())
          },
          put: (r) => {
            if (!t) {
              if (0 === e.length) return n.put(r)
              e.shift()(r)
            }
          },
          flush: (e) => {
            t && n.isEmpty() ? e(S) : e(n.flush())
          },
          close: () => {
            if (!t) {
              t = !0
              var n = e
              e = []
              for (var r = 0, c = n.length; r < c; r++) {
                ;(0, n[r])(S)
              }
            }
          },
        }
      }
      function N(n, t) {
        void 0 === t && (t = (0, i.n)())
        var e,
          r = !1,
          c = x(t),
          a = () => {
            r || ((r = !0), (0, o.func)(e) && e(), c.close())
          }
        return (
          (e = n((n) => {
            j(n) ? a() : c.put(n)
          })),
          (e = (0, i.o)(e)),
          r && e(),
          { take: c.take, flush: c.flush, close: a }
        )
      }
      function R() {
        var n,
          t,
          e,
          c,
          a,
          o,
          u =
            ((t = !1),
            (c = e = []),
            (a = () => {
              c === e && (c = e.slice())
            }),
            (o = () => {
              t = !0
              var n = (e = c)
              ;(c = []),
                n.forEach((n) => {
                  n(S)
                })
            }),
            ((n = {})[r.MULTICAST] = !0),
            (n.put = (n) => {
              if (!t)
                if (j(n)) o()
                else
                  for (var a = (e = c), i = 0, u = a.length; i < u; i++) {
                    var f = a[i]
                    f[r.MATCH](n) && (f.cancel(), f(n))
                  }
            }),
            (n.take = (n, e) => {
              void 0 === e && (e = T),
                t
                  ? n(S)
                  : ((n[r.MATCH] = e),
                    a(),
                    c.push(n),
                    (n.cancel = (0, i.o)(() => {
                      a(), (0, i.r)(c, n)
                    })))
            }),
            (n.close = o),
            n),
          f = u.put
        return (
          (u.put = (n) => {
            n[r.SAGA_ACTION]
              ? f(n)
              : h(() => {
                  f(n)
                })
          }),
          u
        )
      }
      function M(n, t) {
        var e = n[r.CANCEL]
        ;(0, o.func)(e) && (t.cancel = e),
          n.then(t, (n) => {
            t(n, !0)
          })
      }
      var w,
        L = 0,
        _ = () => ++L
      function I(n) {
        n.isRunning() && n.cancel()
      }
      var O =
        (((w = {})[i.T] = (n, t, e) => {
          var c = t.channel,
            a = void 0 === c ? n.channel : c,
            i = t.pattern,
            u = t.maybe,
            f = (n) => {
              n instanceof Error ? e(n, !0) : !j(n) || u ? e(n) : e(r.TERMINATE)
            }
          try {
            a.take(f, (0, o.notUndef)(i) ? b(i) : null)
          } catch (n) {
            return void e(n, !0)
          }
          e.cancel = f.cancel
        }),
        (w[i.P] = (n, t, e) => {
          var r = t.channel,
            c = t.action,
            a = t.resolve
          h(() => {
            var t
            try {
              t = (r ? r.put : n.dispatch)(c)
            } catch (n) {
              return void e(n, !0)
            }
            a && (0, o.promise)(t) ? M(t, e) : e(t)
          })
        }),
        (w[i.A] = (n, t, e, r) => {
          var c = r.digestEffect,
            a = L,
            u = Object.keys(t)
          if (0 !== u.length) {
            var f = (0, i.l)(t, e)
            u.forEach((n) => {
              c(t[n], a, f[n], n)
            })
          } else e((0, o.array)(t) ? [] : {})
        }),
        (w[i.R] = (n, t, e, r) => {
          var c = r.digestEffect,
            a = L,
            u = Object.keys(t),
            f = (0, o.array)(t) ? (0, i.m)(u.length) : {},
            s = {},
            l = !1
          u.forEach((n) => {
            var t = (t, r) => {
              l ||
                (r || (0, i.s)(t)
                  ? (e.cancel(), e(t, r))
                  : (e.cancel(), (l = !0), (f[n] = t), e(f)))
            }
            ;(t.cancel = i.t), (s[n] = t)
          }),
            (e.cancel = () => {
              l || ((l = !0), u.forEach((n) => s[n].cancel()))
            }),
            u.forEach((n) => {
              l || c(t[n], a, s[n], n)
            })
        }),
        (w[i.C] = (n, t, e, r) => {
          var c = t.context,
            a = t.fn,
            u = t.args,
            f = r.task
          try {
            var s = a.apply(c, u)
            if ((0, o.promise)(s)) return void M(s, e)
            if ((0, o.iterator)(s))
              return void Y(n, s, f.context, L, (0, i.j)(a), !1, e)
            e(s)
          } catch (n) {
            e(n, !0)
          }
        }),
        (w[i.a] = (n, t, e) => {
          var r = t.context,
            c = t.fn,
            a = t.args
          try {
            var i = (n, t) => {
              ;(0, o.undef)(n) ? e(t) : e(n, !0)
            }
            c.apply(r, a.concat(i)), i.cancel && (e.cancel = i.cancel)
          } catch (n) {
            e(n, !0)
          }
        }),
        (w[i.F] = (n, t, e, r) => {
          var c = t.context,
            a = t.fn,
            u = t.args,
            f = t.detached,
            s = r.task,
            l = ((n) => {
              var t = n.context,
                e = n.fn,
                r = n.args
              try {
                var c = e.apply(t, r)
                if ((0, o.iterator)(c)) return c
                var a = !1
                return (0, i.q)((n) =>
                  a
                    ? { value: n, done: !0 }
                    : ((a = !0), { value: c, done: !(0, o.promise)(c) }),
                )
              } catch (n) {
                return (0, i.q)(() => {
                  throw n
                })
              }
            })({ context: c, fn: a, args: u }),
            v = ((n, t) =>
              n.isSagaIterator ? { name: n.meta.name } : (0, i.j)(t))(l, a)
          p(() => {
            var t = Y(n, l, s.context, L, v, f, void 0)
            f
              ? e(t)
              : t.isRunning()
                ? (s.queue.addTask(t), e(t))
                : t.isAborted()
                  ? s.queue.abort(t.error())
                  : e(t)
          })
        }),
        (w[i.J] = (n, t, e, r) => {
          var c = r.task,
            a = (n, t) => {
              if (n.isRunning()) {
                var e = { task: c, cb: t }
                ;(t.cancel = () => {
                  n.isRunning() && (0, i.r)(n.joiners, e)
                }),
                  n.joiners.push(e)
              } else n.isAborted() ? t(n.error(), !0) : t(n.result())
            }
          if ((0, o.array)(t)) {
            if (0 === t.length) return void e([])
            var u = (0, i.l)(t, e)
            t.forEach((n, t) => {
              a(n, u[t])
            })
          } else a(t, e)
        }),
        (w[i.b] = (n, t, e, c) => {
          var a = c.task
          t === r.SELF_CANCELLATION
            ? I(a)
            : (0, o.array)(t)
              ? t.forEach(I)
              : I(t),
            e()
        }),
        (w[i.S] = (n, t, e) => {
          var r = t.selector,
            c = t.args
          try {
            e(r.apply(void 0, [n.getState()].concat(c)))
          } catch (n) {
            e(n, !0)
          }
        }),
        (w[i.d] = (n, t, e) => {
          var r = t.pattern,
            c = x(t.buffer),
            a = b(r),
            o = function t(e) {
              j(e) || n.channel.take(t, a), c.put(e)
            },
            i = c.close
          ;(c.close = () => {
            o.cancel(), i()
          }),
            n.channel.take(o, a),
            e(c)
        }),
        (w[i.f] = (n, t, e, r) => {
          e(r.task.isCancelled())
        }),
        (w[i.g] = (n, t, e) => {
          t.flush(e)
        }),
        (w[i.G] = (n, t, e, r) => {
          e(r.task.context[t])
        }),
        (w[i.h] = (n, t, e, r) => {
          var c = r.task
          ;(0, i.p)(c.context, t), e()
        }),
        w)
      function D(n, t) {
        return n + '?' + t
      }
      function K(n) {
        var t = n.name,
          e = n.location
        return e ? t + '  ' + D(e.fileName, e.lineNumber) : t
      }
      function q(n) {
        var t = (0, i.u)((n) => n.cancelledTasks, n)
        return t.length
          ? ['Tasks cancelled due to error:'].concat(t).join('\n')
          : ''
      }
      var H = null,
        P = [],
        z = (n) => {
          ;(n.crashedEffect = H), P.push(n)
        },
        F = () => {
          ;(H = null), (P.length = 0)
        },
        G = () => {
          var n,
            t,
            e = P[0],
            r = P.slice(1),
            c = e.crashedEffect
              ? ((n = e.crashedEffect),
                (t = (0, i.v)(n))
                  ? t.code + '  ' + D(t.fileName, t.lineNumber)
                  : '')
              : null
          return [
            'The above error occurred in task ' +
              K(e.meta) +
              (c ? ' \n when executing effect ' + c : ''),
          ]
            .concat(
              r.map((n) => '    created by ' + K(n.meta)),
              [q(P)],
            )
            .join('\n')
        }
      function U(n, t, e, c, a, o, u) {
        var f
        void 0 === u && (u = i.t)
        var l,
          v,
          d = 0,
          h = null,
          p = [],
          g = Object.create(e),
          E = ((n, t, e) => {
            var r,
              c = [],
              a = !1
            function o(n) {
              t(), f(), e(n, !0)
            }
            function u(t) {
              c.push(t),
                (t.cont = (u, f) => {
                  a ||
                    ((0, i.r)(c, t),
                    (t.cont = i.t),
                    f
                      ? o(u)
                      : (t === n && (r = u), c.length || ((a = !0), e(r))))
                })
            }
            function f() {
              a ||
                ((a = !0),
                c.forEach((n) => {
                  ;(n.cont = i.t), n.cancel()
                }),
                (c = []))
            }
            return (
              u(n), { addTask: u, cancelAll: f, abort: o, getTasks: () => c }
            )
          })(
            t,
            () => {
              p.push.apply(
                p,
                E.getTasks().map((n) => n.meta.name),
              )
            },
            y,
          )
        function y(t, e) {
          if (e) {
            if (((d = 2), z({ meta: a, cancelledTasks: p }), k.isRoot)) {
              var c = G()
              F(), n.onError(t, { sagaStack: c })
            }
            ;(v = t), h && h.reject(t)
          } else
            t === r.TASK_CANCEL ? (d = 1) : 1 !== d && (d = 3),
              (l = t),
              h && h.resolve(t)
          k.cont(t, e),
            k.joiners.forEach((n) => {
              n.cb(t, e)
            }),
            (k.joiners = null)
        }
        var k =
          (((f = {})[r.TASK] = !0),
          (f.id = c),
          (f.meta = a),
          (f.isRoot = o),
          (f.context = g),
          (f.joiners = []),
          (f.queue = E),
          (f.cancel = () => {
            0 === d && ((d = 1), E.cancelAll(), y(r.TASK_CANCEL, !1))
          }),
          (f.cont = u),
          (f.end = y),
          (f.setContext = (n) => {
            ;(0, i.p)(g, n)
          }),
          (f.toPromise = () => (
            h || ((h = s()), 2 === d ? h.reject(v) : 0 !== d && h.resolve(l)),
            h.promise
          )),
          (f.isRunning = () => 0 === d),
          (f.isCancelled = () => 1 === d || (0 === d && 1 === t.status)),
          (f.isAborted = () => 2 === d),
          (f.result = () => l),
          (f.error = () => v),
          f)
        return k
      }
      function Y(n, t, e, c, a, u, f) {
        var s = n.finalizeRunEffect((t, e, c) => {
          if ((0, o.promise)(t)) M(t, c)
          else if ((0, o.iterator)(t)) Y(n, t, v.context, e, a, !1, c)
          else if (t && t[r.IO]) {
            ;(0, O[t.type])(n, t.payload, c, d)
          } else c(t)
        })
        h.cancel = i.t
        var l = {
            meta: a,
            cancel: () => {
              0 === l.status && ((l.status = 1), h(r.TASK_CANCEL))
            },
            status: 0,
          },
          v = U(n, l, e, c, a, u, f),
          d = { task: v, digestEffect: p }
        return f && (f.cancel = v.cancel), h(), v
        function h(n, e) {
          try {
            var a
            e
              ? ((a = t.throw(n)), F())
              : (0, i.y)(n)
                ? ((l.status = 1),
                  h.cancel(),
                  (a = (0, o.func)(t.return)
                    ? t.return(r.TASK_CANCEL)
                    : { done: !0, value: r.TASK_CANCEL }))
                : (a = (0, i.z)(n)
                    ? (0, o.func)(t.return)
                      ? t.return()
                      : { done: !0 }
                    : t.next(n)),
              a.done
                ? (1 !== l.status && (l.status = 3), l.cont(a.value))
                : p(a.value, c, h)
          } catch (n) {
            if (1 === l.status) throw n
            ;(l.status = 2), l.cont(n, !0)
          }
        }
        function p(t, e, r, c) {
          void 0 === c && (c = '')
          var a,
            o = _()
          function u(e, c) {
            a ||
              ((a = !0),
              (r.cancel = i.t),
              n.sagaMonitor &&
                (c
                  ? n.sagaMonitor.effectRejected(o, e)
                  : n.sagaMonitor.effectResolved(o, e)),
              c &&
                ((n) => {
                  H = n
                })(t),
              r(e, c))
          }
          n.sagaMonitor &&
            n.sagaMonitor.effectTriggered({
              effectId: o,
              parentEffectId: e,
              label: c,
              effect: t,
            }),
            (u.cancel = i.t),
            (r.cancel = () => {
              a ||
                ((a = !0),
                u.cancel(),
                (u.cancel = i.t),
                n.sagaMonitor && n.sagaMonitor.effectCancelled(o))
            }),
            s(t, o, u)
        }
      }
      function B(n, t) {
        var e = n.channel,
          r = void 0 === e ? R() : e,
          c = n.dispatch,
          a = n.getState,
          o = n.context,
          f = void 0 === o ? {} : o,
          s = n.sagaMonitor,
          l = n.effectMiddlewares,
          v = n.onError,
          d = void 0 === v ? i.B : v
        for (
          var h = arguments.length, g = new Array(h > 2 ? h - 2 : 0), E = 2;
          E < h;
          E++
        )
          g[E - 2] = arguments[E]
        var y = t.apply(void 0, g)
        var k,
          m = _()
        if (
          (s &&
            ((s.rootSagaStarted = s.rootSagaStarted || i.t),
            (s.effectTriggered = s.effectTriggered || i.t),
            (s.effectResolved = s.effectResolved || i.t),
            (s.effectRejected = s.effectRejected || i.t),
            (s.effectCancelled = s.effectCancelled || i.t),
            (s.actionDispatched = s.actionDispatched || i.t),
            s.rootSagaStarted({ effectId: m, saga: t, args: g })),
          l)
        ) {
          var C = u.compose.apply(void 0, l)
          k = (n) => (t, e, r) => C((t) => n(t, e, r))(t)
        } else k = i.E
        var A = {
          channel: r,
          dispatch: (0, i.D)(c),
          getState: a,
          sagaMonitor: s,
          onError: d,
          finalizeRunEffect: k,
        }
        return p(() => {
          var n = Y(A, y, f, m, (0, i.j)(t), !0, void 0)
          return s && s.effectResolved(m, n), n
        })
      }
      const J = (n) => {
          var t,
            e = void 0 === n ? {} : n,
            r = e.context,
            o = void 0 === r ? {} : r,
            u = e.channel,
            f = void 0 === u ? R() : u,
            s = e.sagaMonitor,
            l = (0, a.default)(e, ['context', 'channel', 'sagaMonitor'])
          function v(n) {
            var e = n.getState,
              r = n.dispatch
            return (
              (t = B.bind(
                null,
                (0, c.default)({}, l, {
                  context: o,
                  channel: f,
                  dispatch: r,
                  getState: e,
                  sagaMonitor: s,
                }),
              )),
              (n) => (t) => {
                s && s.actionDispatched && s.actionDispatched(t)
                var e = n(t)
                return f.put(t), e
              }
            )
          }
          return (
            (v.run = () => t.apply(void 0, arguments)),
            (v.setContext = (n) => {
              ;(0, i.p)(o, n)
            }),
            v
          )
        },
        Q = J
    },
    330950: (n, t, e) => {
      function r(n, t) {
        if (null == n) return {}
        var e,
          r,
          c = {},
          a = Object.keys(n)
        for (r = 0; r < a.length; r++)
          (e = a[r]), t.indexOf(e) >= 0 || (c[e] = n[e])
        return c
      }
      e.d(t, { default: () => r })
    },
  },
])
