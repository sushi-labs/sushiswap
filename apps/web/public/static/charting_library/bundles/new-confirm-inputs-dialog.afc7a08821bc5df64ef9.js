;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3030],
  {
    59142: (e, t) => {
      var n, o, r
      ;(o = [t]),
        (n = (e) => {
          function t(e) {
            if (Array.isArray(e)) {
              for (var t = 0, n = Array(e.length); t < e.length; t++)
                n[t] = e[t]
              return n
            }
            return Array.from(e)
          }
          Object.defineProperty(e, '__esModule', { value: !0 })
          var n = !1
          if ('undefined' != typeof window) {
            var o = {
              get passive() {
                n = !0
              },
            }
            window.addEventListener('testPassive', null, o),
              window.removeEventListener('testPassive', null, o)
          }
          var r =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            i = [],
            l = !1,
            s = -1,
            c = void 0,
            a = void 0,
            u = (e) =>
              i.some(
                (t) =>
                  !(!t.options.allowTouchMove || !t.options.allowTouchMove(e)),
              ),
            d = (e) => {
              var t = e || window.event
              return (
                !!u(t.target) ||
                1 < t.touches.length ||
                (t.preventDefault && t.preventDefault(), !1)
              )
            },
            f = () => {
              setTimeout(() => {
                void 0 !== a &&
                  ((document.body.style.paddingRight = a), (a = void 0)),
                  void 0 !== c &&
                    ((document.body.style.overflow = c), (c = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, o) => {
            if (r) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !i.some((t) => t.targetElement === e)) {
                var f = { targetElement: e, options: o || {} }
                ;(i = [].concat(t(i), [f])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (s = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var n, o, r, i
                    1 === t.targetTouches.length &&
                      ((o = e),
                      (i = (n = t).targetTouches[0].clientY - s),
                      !u(n.target) &&
                        ((o && 0 === o.scrollTop && 0 < i) ||
                        ((r = o) &&
                          r.scrollHeight - r.scrollTop <= r.clientHeight &&
                          i < 0)
                          ? d(n)
                          : n.stopPropagation()))
                  }),
                  l ||
                    (document.addEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (l = !0))
              }
            } else {
              ;(p = o),
                setTimeout(() => {
                  if (void 0 === a) {
                    var e = !!p && !0 === p.reserveScrollBarGap,
                      t =
                        window.innerWidth - document.documentElement.clientWidth
                    e &&
                      0 < t &&
                      ((a = document.body.style.paddingRight),
                      (document.body.style.paddingRight = t + 'px'))
                  }
                  void 0 === c &&
                    ((c = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var m = { targetElement: e, options: o || {} }
              i = [].concat(t(i), [m])
            }
            var p
          }),
            (e.clearAllBodyScrollLocks = () => {
              r
                ? (i.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  l &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (l = !1)),
                  (i = []),
                  (s = -1))
                : (f(), (i = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (r) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (i = i.filter((t) => t.targetElement !== e)),
                  l &&
                    0 === i.length &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (l = !1))
              } else
                1 === i.length && i[0].targetElement === e
                  ? (f(), (i = []))
                  : (i = i.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (r = 'function' == typeof n ? n.apply(t, o) : n) ||
          (e.exports = r)
    },
    5305: (e) => {
      e.exports = {
        separator: 'separator-EI7Qsb2Q',
        scrollable: 'scrollable-EI7Qsb2Q',
      }
    },
    50238: (e, t, n) => {
      n.d(t, { useRovingTabindexElement: () => i })
      var o = n(50959),
        r = n(39416)
      function i(e, t = []) {
        const [n, i] = (0, o.useState)(!1),
          l = (0, r.useFunctionalRefObject)(e)
        return (
          (0, o.useLayoutEffect)(() => {
            const e = l.current
            if (null === e) return
            const t = (e) => {
              switch (e.type) {
                case 'roving-tabindex:main-element':
                  i(!0)
                  break
                case 'roving-tabindex:secondary-element':
                  i(!1)
              }
            }
            return (
              e.addEventListener('roving-tabindex:main-element', t),
              e.addEventListener('roving-tabindex:secondary-element', t),
              () => {
                e.removeEventListener('roving-tabindex:main-element', t),
                  e.removeEventListener('roving-tabindex:secondary-element', t)
              }
            )
          }, t),
          [l, n ? 0 : -1]
        )
      }
    },
    59369: (e, t, n) => {
      n.d(t, { useRowsNavigation: () => u })
      var o = n(50959),
        r = n(50151),
        i = n(19291),
        l = n(68335),
        s = n(57177),
        c = n(15754)
      const a = [37, 39, 38, 40]
      function u(e) {
        const t = (0, o.useRef)(null)
        return (
          (0, o.useLayoutEffect)(() => {
            const e = (0, r.ensureNotNull)(t.current),
              n = () => {
                const n = (0, i.queryTabbableElements)(e).sort(
                  i.navigationOrderComparator,
                )
                if (
                  0 === n.length ||
                  (n[0].parentElement &&
                    !m(n[0].parentElement, (0, r.ensureNotNull)(t.current)))
                ) {
                  const o = ((e) => {
                    const n = f(e).sort(i.navigationOrderComparator),
                      o = n.find((e) => m(e, (0, r.ensureNotNull)(t.current)))
                    if (!o) return null
                    const l = Array.from(o.children)
                    if (!l.length) return null
                    return l[0]
                  })(e)
                  if (null === o) return
                  if (((0, s.becomeMainElement)(o), n.length > 0))
                    for (const e of n) (0, s.becomeSecondaryElement)(e)
                }
              }
            return (
              window.addEventListener('keyboard-navigation-activation', n),
              n(),
              () =>
                window.removeEventListener('keyboard-navigation-activation', n)
            )
          }, []),
          [
            t,
            (t) => {
              if (t.defaultPrevented) return
              const n = (0, l.hashFromEvent)(t)
              if (!a.includes(n)) return
              const o = document.activeElement
              if (!(o instanceof HTMLElement)) return
              const r = t.currentTarget
              let s, u
              if (e) {
                const e = o.parentElement
                ;(s = e ? Array.from(e.children) : []), (u = s.indexOf(o))
              } else
                (s = ((m = r),
                Array.from(
                  m.querySelectorAll(
                    'button:not([disabled]):not([aria-disabled])',
                  ),
                ).filter((0, c.createScopedVisibleElementFilter)(m))).sort(
                  i.navigationOrderComparator,
                )),
                  (u = s.indexOf(o))
              var m
              if (0 === s.length || -1 === u) return
              const v = (0, i.mapKeyCodeToDirection)(n)
              switch (v) {
                case 'inlinePrev':
                  if ((t.preventDefault(), !e && 0 === u)) break
                  p(d(s, u, -1))
                  break
                case 'inlineNext':
                  if ((t.preventDefault(), !e && u === s.length - 1)) break
                  p(d(s, u, 1))
                  break
                case 'blockPrev':
                case 'blockNext':
                  ;((n) => {
                    if (!document.activeElement) return
                    const o = f(r),
                      i = document.activeElement.parentElement
                    if (!i) return
                    const l = Array.from(i.children).indexOf(
                      document.activeElement,
                    )
                    if (-1 === l) return
                    const s =
                      o['blockNext' === n ? o.indexOf(i) + 1 : o.indexOf(i) - 1]
                    if (!s) return
                    t.preventDefault()
                    const c = Array.from(s.children)
                    c.length && (!e && l <= c.length - 1 ? p(c[l]) : p(c[0]))
                  })(v)
              }
            },
          ]
        )
      }
      function d(e, t, n) {
        return e[(t + e.length + n) % e.length]
      }
      function f(e) {
        return Array.from(e.querySelectorAll('[data-role="row"]')).filter(
          (0, c.createScopedVisibleElementFilter)(e),
        )
      }
      function m(e, t) {
        const n = (0, r.ensureNotNull)(e.parentElement).offsetTop,
          o = n + (0, r.ensureNotNull)(e.parentElement).clientHeight,
          i = t.scrollTop,
          l = i + t.clientHeight
        return n >= i && o <= l
      }
      function p(e) {
        document.activeElement &&
          (0, s.becomeSecondaryElement)(document.activeElement),
          (0, s.becomeMainElement)(e),
          e.focus()
      }
    },
    29638: (e, t, n) => {
      n.r(t),
        n.d(t, {
          ConfirmInputsDialogRenderer: () => v,
        })
      var o = n(50959),
        r = n(11542),
        i = n(50182),
        l = n(59064),
        s = n(86656),
        c = n(33900),
        a = n(52033),
        u = n(49483),
        d = n(5305)
      function f(e) {
        const {
            title: t,
            confirmInputs: f,
            inputsProperty: m,
            studyMetaInfo: p,
            model: v,
            confirmInputsType: h,
            onCancel: y,
            onSubmit: g,
            onClose: b,
            onStudyInputChange: E,
          } = e,
          [w, S] = (0, o.useState)(!0),
          C = (0, o.useMemo)(() => {
            const e = new a.Delegate()
            return {
              isInputsStudy: !0,
              symbolsResolved: () => e,
              resolvedSymbolInfoBySymbol: () => null,
              tempProperties: m,
            }
          }, []),
          I = (0, o.useRef)(null),
          [T, _] = (0, o.useState)(M())
        return (
          (0, o.useEffect)(() => {
            if (!u.CheckMobile.any() && w && 'symbol' === h && I.current) {
              const e = I.current.querySelector('input')
              e && e.focus()
            }
          }, [w]),
          o.createElement(i.AdaptiveConfirmDialog, {
            dataName: 'confirm-inputs-dialog',
            title: t,
            isOpened: w,
            onSubmit: () => {
              g(m.state().inputs), D()
            },
            onCancel: y,
            onClickOutside: D,
            onClose: D,
            render: () =>
              o.createElement(
                o.Fragment,
                null,
                o.createElement('div', { className: d.separator }),
                o.createElement(
                  s.TouchScrollContainer,
                  { className: d.scrollable, onScroll: x },
                  o.createElement(c.InputsTabContent, {
                    reference: I,
                    property: m,
                    studyMetaInfo: p,
                    model: v,
                    study: C,
                    inputs: f,
                    onStudyInputChange: N,
                  }),
                ),
              ),
            defaultActionOnClose: 'none',
            submitButtonText: r.t(null, void 0, n(33391)),
            submitButtonDisabled: T,
            submitOnEnterKey: !1,
          })
        )
        function x() {
          l.globalCloseDelegate.fire()
        }
        function D() {
          S(!1), b()
        }
        function M() {
          const { inputs: e } = m.state()
          for (const t of f)
            if ('symbol' === t.type && !t.optional && '' === e[t.id]) return !0
          return !1
        }
        function N(e, t) {
          E?.(e, t), _(M())
        }
      }
      var m = n(29280),
        p = n(87896)
      class v extends m.DialogRenderer {
        constructor(e, t, n, o, r, i, l, s, c) {
          super(),
            (this._handleClose = () => {
              this._rootInstance?.unmount(),
                this._setVisibility(!1),
                this._onClose()
            }),
            (this._title = e),
            (this._confirmInputs = t),
            (this._model = i),
            (this._confirmInputsType = o),
            (this._studyMetaInfo = r),
            (this._onSubmit = l),
            (this._onClose = s),
            (this._onStudyInputChange = c),
            (this._inputsProperty = n)
        }
        show() {
          this.visible().value() ||
            ((this._rootInstance = (0, p.createReactRoot)(
              o.createElement(f, {
                title: this._title,
                confirmInputs: this._confirmInputs,
                inputsProperty: this._inputsProperty,
                studyMetaInfo: this._studyMetaInfo,
                model: this._model,
                confirmInputsType: this._confirmInputsType,
                onSubmit: this._onSubmit,
                onCancel: () => {},
                onClose: this._handleClose,
                onStudyInputChange: this._onStudyInputChange,
              }),
              this._container,
            )),
            this._setVisibility(!0))
        }
        hide() {
          this._handleClose()
        }
      }
    },
    73339: (e, t, n) => {
      n.r(t), n.d(t, { selectInputValuesOnChart: () => c })
      var o = n(50151),
        r = n(19625),
        i = n(11542),
        l = n(78839),
        s = n(928)
      r.colorsPalette['color-cold-gray-500']
      async function c(e, t, r, c, a) {
        let u,
          d = null
        const f = (0, l.getInputGroups)(t)
        e.model().model()
        for await (const e of f)
          await m(e).catch((e) => {
            throw new Error(e)
          })
        return { customSourceId: d?.id(), destPane: u }
        async function m(e) {
          if ((0, l.isGroup)(e))
            if ((0, l.isInputInlines)(e)) {
              const t = ((e) => {
                if (2 !== e.length || e[0].type === e[1].type) return null
                return 'price' === e[0].type
                  ? { price: e[0], time: e[1] }
                  : { price: e[1], time: e[0] }
              })(e.children)
              if (t) {
                const { time: o, price: r } = t,
                  l = o.inline
                    ? i.t(
                        null,
                        {
                          replace: {
                            inputInline: o.inline,
                            studyShortDescription: c,
                          },
                        },
                        n(10679),
                      )
                    : i.t(
                        null,
                        { replace: { studyShortDescription: c } },
                        n(92229),
                      ),
                  s = h(e.id)
                await v(e, 'all', s ?? l, o.id, r.id)
              } else for await (const t of e.children) await p(t)
            } else for await (const t of e.children) await m(t)
          else await p(e)
        }
        async function p(e) {
          const t = 'time' === e.type,
            o = t ? 'time' : 'price',
            r = (() => {
              if (e.inline) {
                const t = h(e.inline)
                if (t) return t
              }
              if (e.tooltip) return e.tooltip
              const o = e.name
                  ? i.t(
                      null,
                      {
                        replace: {
                          inputTitle: e.name,
                          studyShortDescription: c,
                        },
                      },
                      n(59451),
                    )
                  : i.t(
                      null,
                      { replace: { studyShortDescription: c } },
                      n(60935),
                    ),
                r = e.name
                  ? i.t(
                      null,
                      {
                        replace: {
                          inputTitle: e.name,
                          studyShortDescription: c,
                        },
                      },
                      n(94238),
                    )
                  : i.t(
                      null,
                      { replace: { studyShortDescription: c } },
                      n(24404),
                    )
              return t ? o : r
            })(),
            l = t ? e.id : void 0,
            s = t ? void 0 : e.id
          await v(e, o, r, l, s)
        }
        async function v(t, n, i, l, c) {
          const a = await e.requestSelectPoint(
            {
              pointType: n,
              pane: u,
              lineColor: void 0,
              selectPointMode: s.SelectPointMode.Study,
            },
            i,
          )
          void 0 === u && (u = a.pane)
          const d = r.childs().inputs
          d &&
            (l &&
              (0, o.ensureDefined)(d.child(l)).setValue(
                1e3 * (a.point.time || 0),
              ),
            c && (0, o.ensureDefined)(d.child(c)).setValue(a.point.price))
        }
        function h(e) {
          let t
          return (
            a
              .filter((t) => t.inline === e)
              .forEach((e) => {
                e.tooltip && (t = e.tooltip)
              }),
            t
          )
        }
      }
    },
    86656: (e, t, n) => {
      n.d(t, { TouchScrollContainer: () => a })
      var o = n(50959),
        r = n(59142),
        i = n(50151),
        l = n(49483)
      const s = CSS.supports('overscroll-behavior', 'none')
      let c = 0
      const a = (0, o.forwardRef)((e, t) => {
        const { children: n, ...i } = e,
          a = (0, o.useRef)(null)
        return (
          (0, o.useImperativeHandle)(t, () => a.current),
          (0, o.useLayoutEffect)(() => {
            if (l.CheckMobile.iOS())
              return (
                c++,
                null !== a.current &&
                  (s
                    ? 1 === c &&
                      (document.body.style.overscrollBehavior = 'none')
                    : (0, r.disableBodyScroll)(a.current, {
                        allowTouchMove: u(a),
                      })),
                () => {
                  c--,
                    null !== a.current &&
                      (s
                        ? 0 === c &&
                          (document.body.style.overscrollBehavior = '')
                        : (0, r.enableBodyScroll)(a.current))
                }
              )
          }, []),
          o.createElement('div', { ref: a, ...i }, n)
        )
      })
      function u(e) {
        return (t) => {
          const n = (0, i.ensureNotNull)(e.current),
            o = document.activeElement
          return (
            !n.contains(t) || (null !== o && n.contains(o) && o.contains(t))
          )
        }
      }
    },
    57177: (e, t, n) => {
      var o
      function r(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function i(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      n.d(t, { becomeMainElement: () => r, becomeSecondaryElement: () => i }),
        ((e) => {
          ;(e.MainElement = 'roving-tabindex:main-element'),
            (e.SecondaryElement = 'roving-tabindex:secondary-element')
        })(o || (o = {}))
    },
  },
])
