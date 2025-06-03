;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1205],
  {
    169545: (e) => {
      e.exports = {
        view: 'view-_gbYDtbd',
        hover: 'hover-_gbYDtbd',
        hoverEnable: 'hoverEnable-_gbYDtbd',
        hidden: 'hidden-_gbYDtbd',
        button: 'button-_gbYDtbd',
        header: 'header-_gbYDtbd',
        headerTitle: 'headerTitle-_gbYDtbd',
        headerIcon: 'headerIcon-_gbYDtbd',
        values: 'values-_gbYDtbd',
        item: 'item-_gbYDtbd',
        active: 'active-_gbYDtbd',
        itemTitle: 'itemTitle-_gbYDtbd',
      }
    },
    656658: (e) => {
      e.exports = {
        container: 'container-UNtFS6lU',
        divider: 'divider-UNtFS6lU',
      }
    },
    982434: (e) => {
      e.exports = { scrollWrap: 'scrollWrap-FaOvTD2r' }
    },
    252693: (e) => {
      e.exports = {
        container: 'container-Tv7LSjUz',
        overlayScrollWrap: 'overlayScrollWrap-Tv7LSjUz',
        wrapper: 'wrapper-Tv7LSjUz',
      }
    },
    977253: (e) => {
      e.exports = {
        wrap: 'wrap-vSb6C0Bj',
        'wrap--horizontal': 'wrap--horizontal-vSb6C0Bj',
        bar: 'bar-vSb6C0Bj',
        barInner: 'barInner-vSb6C0Bj',
        'barInner--horizontal': 'barInner--horizontal-vSb6C0Bj',
        'bar--horizontal': 'bar--horizontal-vSb6C0Bj',
      }
    },
    186928: (e) => {
      e.exports = {
        button: 'button-w6lVe_oI',
        hovered: 'hovered-w6lVe_oI',
        disabled: 'disabled-w6lVe_oI',
      }
    },
    792199: (e, t, n) => {
      n.r(t), n.d(t, { DataWindow: () => j })
      var r = n(50959),
        o = n(650151),
        l = n(965800),
        i = n(609838),
        a = n(562051),
        s = n(108354),
        c = n(188372),
        u = n(717871),
        d = n(664902),
        v = n(786129),
        h = n(962852),
        m = n(462056),
        p = n(973602),
        f = n(634121),
        g = n(497754),
        b = n.n(g),
        w = n(72571),
        S = n(724377),
        N = n(149962),
        z = n(357739),
        E = n(800296),
        C = n(111982),
        D = n(94007),
        M = n(962766),
        y = n(169545)
      const P = {
        [C.StdTheme.Light]: N.colorsPalette['color-white'],
        [C.StdTheme.Dark]: N.colorsPalette['color-cold-gray-900'],
      }
      function T(e) {
        const {
            view: t,
            onClick: l,
            isActive: a,
            isVisible: s = !0,
            onVisibilityChange: c,
            onContextMenu: u,
            onHeaderDoubleClick: d,
            isHovered: v,
            icon: h,
            theme: m = C.StdTheme.Light,
            isHoverEnable: p = !1,
            ...f
          } = e,
          g = (0, z.clean)(t.header(), !0),
          S = t.items().filter((e) => e.visible())
        return r.createElement(
          'div',
          {
            className: b()(
              y.view,
              a && y.active,
              !s && y.hidden,
              p && y.hoverEnable,
              p && v && y.hover,
            ),
            onClick: l,
            onContextMenu: (e) => {
              if (!u) return
              e.preventDefault(), u(e)
            },
            onDoubleClick: d,
            ...f,
          },
          g &&
            r.createElement(
              'div',
              { className: y.header },
              h &&
                r.createElement(w.Icon, { className: y.headerIcon, icon: h }),
              r.createElement(
                'span',
                {
                  className: b()(y.headerTitle, 'apply-common-tooltip'),
                  title: (0, z.clean)(t.title(), !0),
                },
                g,
              ),
              c &&
                r.createElement(E.ListItemButton, {
                  icon: s ? D : M,
                  className: b()(y.button, 'apply-common-tooltip'),
                  onClick: (e) => {
                    e.stopPropagation(), (0, o.ensureDefined)(c)()
                  },
                  title: s
                    ? i.t(null, void 0, n(526705))
                    : i.t(null, void 0, n(817582)),
                }),
            ),
          s &&
            S.length > 0 &&
            r.createElement(
              'div',
              { className: y.values },
              S.map((e, t) =>
                r.createElement(H, { key: t, item: e, theme: m }),
              ),
            ),
        )
      }
      function H(e) {
        const { item: t, theme: n } = e,
          o = t.color(),
          l = P[n]
        return r.createElement(
          'div',
          { className: y.item },
          r.createElement(
            'div',
            { className: b()(y.itemTitle, 'apply-overflow-tooltip') },
            (0, z.clean)(t.title(), !0),
          ),
          r.createElement(
            'div',
            null,
            r.createElement(
              'span',
              { style: { color: o && W(o, l) ? o : void 0 } },
              t.value(),
            ),
          ),
        )
      }
      function W(e, t) {
        const n = (0, S.rgbToGrayscale)((0, S.parseRgb)(e)),
          r = (0, S.rgbToGrayscale)((0, S.parseRgb)(t))
        return Math.abs(n - r) >= 25
      }
      var _ = n(109955),
        L = n(593194),
        k = n(416911),
        x = n(728824),
        V = n(607295),
        I = n(14083),
        B = n(656658)
      function j(e) {
        const { chartWidget: t, updateDelegate: g, selectedSourcesWV: b } = e,
          [w, S] = (0, r.useState)([]),
          [N, z] = (0, r.useState)(null),
          E = (0, r.useRef)(null),
          C = (0, l.useTheme)()
        return (
          (0, r.useEffect)(() => {
            function e() {
              t.hasModel() || S([])
              const e = t.model().model().dataSources()
              S(e.map((e) => e.dataWindowView()).filter(R))
            }
            return (
              e(),
              g.subscribe(null, e),
              () => {
                g.unsubscribe(null, e)
              }
            )
          }, [t]),
          (0, r.useEffect)(() => {
            function e(e) {
              var t, n
              const r = e[0]
              if (!r) return void z(null)
              const o =
                  null === (t = E.current) || void 0 === t
                    ? void 0
                    : t.querySelector(`[data-id="${r.id()}"]`),
                l = null == o ? void 0 : o.getBoundingClientRect(),
                i =
                  null === (n = E.current) || void 0 === n
                    ? void 0
                    : n.getBoundingClientRect()
              o &&
                i &&
                l &&
                (i.top > l.top || i.bottom < l.bottom) &&
                o.scrollIntoView({ block: 'nearest' }),
                z(r)
            }
            return (
              b.subscribe(e, { callWithLast: !0 }),
              () => {
                b.unsubscribe(e)
              }
            )
          }, [b]),
          r.createElement(
            _.OverlayScrollWrapper,
            { scrollContainerRef: E, className: 'chart-data-window' },
            r.createElement(
              'div',
              { className: B.container },
              w.map((e, l) => {
                let p, f
                return (
                  e instanceof s.SeriesDataWindowView
                    ? ((p = e.series()), (f = I))
                    : (e instanceof c.StudyDataWindowView ||
                        e instanceof u.OverlayDataWindowView) &&
                      ((p = e.study()),
                      (f = (0, L.isStudyStrategy)(p) ? V : x)),
                  r.createElement(
                    r.Fragment,
                    { key: l },
                    0 !== l && r.createElement('div', { className: B.divider }),
                    p
                      ? r.createElement(T, {
                          'data-id': p.id(),
                          view: e,
                          theme: C,
                          icon: f,
                          onClick: () => D((0, o.ensureDefined)(p)),
                          onHeaderDoubleClick: () =>
                            ((e) => {
                              t.showChartPropertiesForSource(e)
                            })((0, o.ensureDefined)(p)),
                          isActive: p === N,
                          isVisible: p.properties().childs().visible.value(),
                          isHovered: p === t.model().hoveredSource(),
                          onVisibilityChange: () =>
                            ((e) => {
                              const r = e.properties().childs().visible,
                                o = !r.value()
                              t.model().setProperty(
                                r,
                                o,
                                (o
                                  ? new d.TranslatedString(
                                      'show {title}',
                                      i.t(null, void 0, n(787358)),
                                    )
                                  : new d.TranslatedString(
                                      'hide {title}',
                                      i.t(null, void 0, n(470301)),
                                    )
                                ).format({
                                  title: new d.TranslatedString(
                                    e.name(),
                                    e.title(a.TitleDisplayTarget.DataWindow),
                                  ),
                                }),
                              )
                            })((0, o.ensureDefined)(p)),
                          onContextMenu: (e) =>
                            ((e, n) => {
                              if (t.readOnly() || !n.hasContextMenu()) return
                              D(n),
                                n instanceof v.Series
                                  ? ((e, n) => {
                                      const r = t.actions(),
                                        l = n.properties().visible.value(),
                                        i = l ? void 0 : M(n)
                                      m.ContextMenuManager.showMenu(
                                        [
                                          r.format,
                                          l
                                            ? r.seriesHide
                                            : (0, o.ensureDefined)(i),
                                        ],
                                        e,
                                        void 0,
                                        {
                                          menuName:
                                            'DataWindowWidgetSeriesContextMenu',
                                          detail: {
                                            type: 'series',
                                            id: n.instanceId(),
                                          },
                                        },
                                        () => {
                                          var e
                                          null ===
                                            (e =
                                              null == i
                                                ? void 0
                                                : i.getBinding()) ||
                                            void 0 === e ||
                                            e.destroy()
                                        },
                                      )
                                    })(e, n)
                                  : n instanceof h.Study &&
                                    ((e, n) => {
                                      const r = t.actions(),
                                        l = n.properties().visible.value(),
                                        i = l ? void 0 : M(n)
                                      m.ContextMenuManager.showMenu(
                                        [
                                          r.format,
                                          l
                                            ? r.studyHide
                                            : (0, o.ensureDefined)(i),
                                          r.studyRemove,
                                        ],
                                        e,
                                        void 0,
                                        {
                                          menuName:
                                            'DataWindowWidgetStudyContextMenu',
                                          detail: { type: 'study', id: n.id() },
                                        },
                                        () => {
                                          var e
                                          null ===
                                            (e =
                                              null == i
                                                ? void 0
                                                : i.getBinding()) ||
                                            void 0 === e ||
                                            e.destroy()
                                        },
                                      )
                                    })(e, n)
                            })(e, (0, o.ensureDefined)(p)),
                          isHoverEnable: p.isHoveredEnabled(),
                        })
                      : r.createElement(T, { view: e, theme: C }),
                  )
                )
              }),
            ),
          )
        )
        function D(e) {
          t.model().selectionMacro((t) => {
            t.addSourceToSelection(e)
          })
        }
        function M(e) {
          const r = new p.Action({
            actionId: 'Chart.SelectedObject.Show',
            options: {
              label: i.t(null, void 0, n(581428)),
              icon: k,
              checkable: !0,
            },
          })
          return (
            r.setBinding(
              new f.ActionBinder(
                r,
                e.properties().visible,
                t.model(),
                new d.TranslatedString(
                  'change visibility',
                  i.t(null, void 0, n(521511)),
                ),
              ),
            ),
            r.getBinding().setValue(e.properties().visible.value()),
            r
          )
        }
      }
      function R(e) {
        return null !== e && e.items().length > 0
      }
    },
    73288: (e, t, n) => {
      n.d(t, { OverlayScrollContainer: () => p })
      var r = n(50959),
        o = n(497754),
        l = n.n(o),
        i = n(710263),
        a = n(650151),
        s = n(44681)
      const c = n(977253),
        u = {
          0: {
            isHorizontal: !1,
            isNegative: !1,
            sizePropName: 'height',
            minSizePropName: 'minHeight',
            startPointPropName: 'top',
            currentMousePointPropName: 'clientY',
            progressBarTransform: 'translateY',
          },
          1: {
            isHorizontal: !0,
            isNegative: !1,
            sizePropName: 'width',
            minSizePropName: 'minWidth',
            startPointPropName: 'left',
            currentMousePointPropName: 'clientX',
            progressBarTransform: 'translateX',
          },
          2: {
            isHorizontal: !0,
            isNegative: !0,
            sizePropName: 'width',
            minSizePropName: 'minWidth',
            startPointPropName: 'right',
            currentMousePointPropName: 'clientX',
            progressBarTransform: 'translateX',
          },
        },
        d = 40
      function v(e) {
        const {
            size: t,
            scrollSize: n,
            clientSize: o,
            scrollProgress: i,
            onScrollProgressChange: v,
            scrollMode: h,
            theme: m = c,
            onDragStart: p,
            onDragEnd: f,
            minBarSize: g = d,
          } = e,
          b = (0, r.useRef)(null),
          w = (0, r.useRef)(null),
          [S, N] = (0, r.useState)(!1),
          z = (0, r.useRef)(0),
          {
            isHorizontal: E,
            isNegative: C,
            sizePropName: D,
            minSizePropName: M,
            startPointPropName: y,
            currentMousePointPropName: P,
            progressBarTransform: T,
          } = u[h]
        ;(0, r.useEffect)(() => {
          const e = (0, a.ensureNotNull)(b.current).ownerDocument
          return (
            S
              ? (p && p(),
                e &&
                  (e.addEventListener('mousemove', B),
                  e.addEventListener('mouseup', j)))
              : f && f(),
            () => {
              e &&
                (e.removeEventListener('mousemove', B),
                e.removeEventListener('mouseup', j))
            }
          )
        }, [S])
        const H = t / n || 0,
          W = o * H || 0,
          _ = Math.max(W, g),
          L = (t - _) / (t - W),
          k = n - t,
          x = C ? -k : 0,
          V = C ? 0 : k,
          I = Y((0, s.clamp)(i, x, V)) || 0
        return r.createElement(
          'div',
          {
            ref: b,
            className: l()(m.wrap, E && m['wrap--horizontal']),
            style: { [D]: t },
            onMouseDown: (e) => {
              if (e.isDefaultPrevented()) return
              e.preventDefault()
              const t = R(e.nativeEvent, (0, a.ensureNotNull)(b.current)),
                n = Math.sign(t),
                r = (0, a.ensureNotNull)(w.current).getBoundingClientRect()
              z.current = (n * r[D]) / 2
              let o = Math.abs(t) - Math.abs(z.current)
              const l = Y(k)
              o < 0
                ? ((o = 0), (z.current = t))
                : o > l && ((o = l), (z.current = t - n * l))
              v(O(n * o)), N(!0)
            },
          },
          r.createElement(
            'div',
            {
              ref: w,
              className: l()(m.bar, E && m['bar--horizontal']),
              style: { [M]: g, [D]: _, transform: `${T}(${I}px)` },
              onMouseDown: (e) => {
                e.preventDefault(),
                  (z.current = R(
                    e.nativeEvent,
                    (0, a.ensureNotNull)(w.current),
                  )),
                  N(!0)
              },
            },
            r.createElement('div', {
              className: l()(m.barInner, E && m['barInner--horizontal']),
            }),
          ),
        )
        function B(e) {
          const t = R(e, (0, a.ensureNotNull)(b.current)) - z.current
          v(O(t))
        }
        function j() {
          N(!1)
        }
        function R(e, t) {
          const n = t.getBoundingClientRect()[y]
          return e[P] - n
        }
        function Y(e) {
          return e * H * L
        }
        function O(e) {
          return e / H / L
        }
      }
      var h = n(522224),
        m = n(982434)
      function p(e) {
        const {
            reference: t,
            className: n,
            containerHeight: l = 0,
            containerWidth: a = 0,
            contentHeight: s = 0,
            contentWidth: c = 0,
            scrollPosTop: u = 0,
            scrollPosLeft: d = 0,
            onVerticalChange: p,
            onHorizontalChange: f,
            visible: g,
          } = e,
          [b, w] = (0, h.useHover)(),
          [S, N] = (0, r.useState)(!1),
          z = l < s,
          E = a < c,
          C = z && E ? 8 : 0
        return r.createElement(
          'div',
          {
            ...w,
            ref: t,
            className: o(n, m.scrollWrap),
            style: {
              visibility: g || b || S ? 'visible' : 'hidden',
            },
          },
          z &&
            r.createElement(v, {
              size: l - C,
              scrollSize: s - C,
              clientSize: l - C,
              scrollProgress: u,
              onScrollProgressChange: (e) => {
                p && p(e)
              },
              onDragStart: D,
              onDragEnd: M,
              scrollMode: 0,
            }),
          E &&
            r.createElement(v, {
              size: a - C,
              scrollSize: c - C,
              clientSize: a - C,
              scrollProgress: d,
              onScrollProgressChange: (e) => {
                f && f(e)
              },
              onDragStart: D,
              onDragEnd: M,
              scrollMode: (0, i.isRtl)() ? 2 : 1,
            }),
        )
        function D() {
          N(!0)
        }
        function M() {
          N(!1)
        }
      }
    },
    109955: (e, t, n) => {
      n.d(t, { OverlayScrollWrapper: () => c })
      var r = n(50959),
        o = n(497754),
        l = n.n(o),
        i = n(73288),
        a = n(139043),
        s = n(252693)
      function c(e) {
        const {
            children: t,
            className: n,
            reference: o,
            hasCustomTouchScrollAnimation: c,
            scrollContainerRef: u,
            isForceVisible: d,
            ...v
          } = e,
          [h, m, p, f] = (0, a.useOverlayScroll)(u, c)
        return (
          (0, r.useImperativeHandle)(o, () => ({ updateScrollState: f })),
          r.createElement(
            'div',
            { ...v, ...m, className: l()(s.container, n) },
            r.createElement(i.OverlayScrollContainer, {
              ...h,
              visible: null != d ? d : h.visible,
              className: s.overlayScrollWrap,
            }),
            r.createElement(
              'div',
              { className: s.wrapper, ref: p, onScroll: f },
              t,
            ),
          )
        )
      }
    },
    139043: (e, t, n) => {
      n.d(t, { useOverlayScroll: () => s })
      var r = n(50959),
        o = n(650151),
        l = n(522224),
        i = n(601227)
      const a = { onMouseOver: () => {}, onMouseOut: () => {} }
      function s(e, t = i.CheckMobile.any()) {
        const n = (0, r.useRef)(null),
          s = e || (0, r.useRef)(null),
          [c, u] = (0, l.useHover)(),
          [d, v] = (0, r.useState)({
            reference: n,
            containerHeight: 0,
            containerWidth: 0,
            contentHeight: 0,
            contentWidth: 0,
            scrollPosTop: 0,
            scrollPosLeft: 0,
            onVerticalChange: (e) => {
              v((t) => ({ ...t, scrollPosTop: e })),
                ((0, o.ensureNotNull)(s.current).scrollTop = e)
            },
            onHorizontalChange: (e) => {
              v((t) => ({ ...t, scrollPosLeft: e })),
                ((0, o.ensureNotNull)(s.current).scrollLeft = e)
            },
            visible: c,
          }),
          h = (0, r.useCallback)(() => {
            if (!s.current) return
            const {
                clientHeight: e,
                scrollHeight: t,
                scrollTop: r,
                clientWidth: o,
                scrollWidth: l,
                scrollLeft: i,
              } = s.current,
              a = n.current ? n.current.offsetTop : 0
            v((n) => ({
              ...n,
              containerHeight: e - a,
              contentHeight: t - a,
              scrollPosTop: r,
              containerWidth: o,
              contentWidth: l,
              scrollPosLeft: i,
            }))
          }, [])
        function m() {
          v((e) => ({
            ...e,
            scrollPosTop: (0, o.ensureNotNull)(s.current).scrollTop,
            scrollPosLeft: (0, o.ensureNotNull)(s.current).scrollLeft,
          }))
        }
        return (
          (0, r.useEffect)(() => {
            c && h(), v((e) => ({ ...e, visible: c }))
          }, [c]),
          (0, r.useEffect)(() => {
            const e = s.current
            return (
              e && e.addEventListener('scroll', m),
              () => {
                e && e.removeEventListener('scroll', m)
              }
            )
          }, [s]),
          [d, t ? a : u, s, h]
        )
      }
    },
    965800: (e, t, n) => {
      n.d(t, { useTheme: () => l })
      var r = n(297265),
        o = n(702054)
      function l() {
        return (0, r.useWatchedValueReadonly)({ watchedValue: o.watchedTheme })
      }
    },
    297265: (e, t, n) => {
      n.d(t, { useWatchedValueReadonly: () => o })
      var r = n(50959)
      const o = (e, t = !1) => {
        const n = 'watchedValue' in e ? e.watchedValue : void 0,
          o = 'defaultValue' in e ? e.defaultValue : e.watchedValue.value(),
          [l, i] = (0, r.useState)(n ? n.value() : o)
        return (
          (t ? r.useLayoutEffect : r.useEffect)(() => {
            if (n) {
              i(n.value())
              const e = (e) => i(e)
              return n.subscribe(e), () => n.unsubscribe(e)
            }
            return () => {}
          }, [n]),
          l
        )
      }
    },
    800296: (e, t, n) => {
      n.d(t, { ListItemButton: () => s })
      var r = n(50959),
        o = n(497754),
        l = n.n(o),
        i = n(72571),
        a = n(186928)
      function s(e) {
        const { className: t, disabled: n, ...o } = e
        return r.createElement(i.Icon, {
          className: l()(a.button, n && a.disabled, t),
          ...o,
        })
      }
    },
    14083: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"/><path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z"/><path d="M9 8v12h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5z"/><path d="M10 4h1v3.5h-1zm0 16.5h1V24h-1z"/></svg>'
    },
    94007: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M2.448 10.124a10.82 10.82 0 0 1-.336-.609L2.105 9.5l.007-.015a12.159 12.159 0 0 1 1.686-2.466C5.002 5.665 6.752 4.373 9.05 4.373c2.297 0 4.047 1.292 5.25 2.646a12.166 12.166 0 0 1 1.687 2.466l.007.015-.007.015a12.163 12.163 0 0 1-1.686 2.466c-1.204 1.354-2.954 2.646-5.251 2.646-2.298 0-4.048-1.292-5.252-2.646a12.16 12.16 0 0 1-1.35-1.857zm14.558-.827l-.456.203.456.203v.002l-.003.005-.006.015-.025.052a11.813 11.813 0 0 1-.461.857 13.163 13.163 0 0 1-1.463 2.011c-1.296 1.46-3.296 2.982-5.998 2.982-2.703 0-4.703-1.522-6-2.982a13.162 13.162 0 0 1-1.83-2.677 7.883 7.883 0 0 1-.118-.243l-.007-.015-.002-.005v-.001l.456-.204-.456-.203v-.002l.002-.005.007-.015a4.66 4.66 0 0 1 .119-.243 13.158 13.158 0 0 1 1.83-2.677c1.296-1.46 3.296-2.982 5.999-2.982 2.702 0 4.702 1.522 5.998 2.981a13.158 13.158 0 0 1 1.83 2.678 8.097 8.097 0 0 1 .119.243l.006.015.003.005v.001zm-.456.203l.456-.203.09.203-.09.203-.456-.203zM1.092 9.297l.457.203-.457.203-.09-.203.09-.203zm9.958.203c0 1.164-.917 2.07-2 2.07-1.084 0-2-.906-2-2.07 0-1.164.916-2.07 2-2.07 1.083 0 2 .906 2 2.07zm1 0c0 1.695-1.344 3.07-3 3.07-1.657 0-3-1.375-3-3.07 0-1.695 1.343-3.07 3-3.07 1.656 0 3 1.375 3 3.07z"/></svg>'
    },
    607295: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M4.5 12.5l4.59-4.59a2 2 0 0 1 2.83 0l3.17 3.17a2 2 0 0 0 2.83 0L22.5 6.5m-8 9.5v5.5M12 19l2.5 2.5L17 19m4.5 3v-5.5M19 19l2.5-2.5L24 19"/></svg>'
    },
    728824: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 16.5l4.586-4.586a2 2 0 0 1 2.828 0l3.172 3.172a2 2 0 0 0 2.828 0L23.5 10.5"/></svg>'
    },
    962766: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M14.692 3.012l-12 12.277.715.699 12-12.277-.715-.699zM9.05 15.627a7.042 7.042 0 0 1-3.144-.741l.742-.76c.72.311 1.52.5 2.402.5 2.297 0 4.047-1.29 5.25-2.645a12.168 12.168 0 0 0 1.687-2.466l.007-.015-.007-.015A12.166 12.166 0 0 0 14.3 7.019c-.11-.124-.225-.247-.344-.37l.699-.715c.137.14.268.28.392.42a13.16 13.16 0 0 1 1.83 2.678 8.117 8.117 0 0 1 .119.243l.006.015.003.005v.001l-.456.204.456.203v.002l-.003.005-.006.015-.025.052a11.762 11.762 0 0 1-.461.857 13.158 13.158 0 0 1-1.463 2.011c-1.296 1.46-3.296 2.982-5.998 2.982zm7.5-6.127l.456-.203.09.203-.09.203-.456-.203zm-7.5 3.07c-.27 0-.53-.037-.778-.105l.879-.899c.999-.052 1.833-.872 1.895-1.938l.902-.923c.066.253.102.52.102.795 0 1.695-1.344 3.07-3 3.07zM6.15 10.294l.902-.923c.063-1.066.896-1.886 1.895-1.938l.879-.9a2.94 2.94 0 0 0-.777-.103c-1.657 0-3 1.374-3 3.069 0 .275.035.541.101.795zM9.05 4.373c.88 0 1.68.19 2.4.5l.743-.759a7.043 7.043 0 0 0-3.143-.74c-2.703 0-4.703 1.521-6 2.98a13.159 13.159 0 0 0-1.83 2.678 7.886 7.886 0 0 0-.118.243l-.007.015-.002.005v.001l.456.204-.457-.203-.09.203.09.203.457-.203-.456.203v.002l.002.005.007.015a4.5 4.5 0 0 0 .119.243 13.152 13.152 0 0 0 1.83 2.677c.124.14.255.28.392.42l.7-.715c-.12-.122-.235-.245-.345-.369a12.156 12.156 0 0 1-1.686-2.466L2.105 9.5l.007-.015a12.158 12.158 0 0 1 1.686-2.466C5.002 5.665 6.752 4.373 9.05 4.373z"/></svg>'
    },
    526705: (e) => {
      e.exports = {
        ar: ['إخفاء البيانات'],
        ca_ES: 'Hide data',
        cs: 'Hide data',
        de: ['Daten verbergen'],
        el: 'Hide data',
        en: 'Hide data',
        es: ['Ocultar datos'],
        fa: ['مخفی کردن داده ها'],
        fr: ['Cacher les données'],
        he_IL: ['הסתר נתונים'],
        hu_HU: ['Adatok elrejtése'],
        id_ID: ['Sembunyikan data'],
        it: ['Nascondi dati'],
        ja: ['データを非表示'],
        ko: ['데이터숨김'],
        ms_MY: ['Sembunyi data'],
        nl_NL: 'Hide data',
        pl: ['Ukryj dane'],
        pt: ['Ocultar os dados'],
        ro: 'Hide data',
        ru: ['Скрыть данные'],
        sv: ['Dölj data'],
        th: ['ซ่อนข้อมูล'],
        tr: ['Verileri gizle'],
        vi: ['Ẩn dữ liệu'],
        zh: ['隐藏数据'],
        zh_TW: ['隱藏數據'],
      }
    },
    817582: (e) => {
      e.exports = {
        ar: ['عرض البيانات'],
        ca_ES: 'Show data',
        cs: 'Show data',
        de: ['Daten anzeigen'],
        el: 'Show data',
        en: 'Show data',
        es: ['Mostrar datos'],
        fa: 'Show data',
        fr: ['Montrer les données'],
        he_IL: ['הצג נתונים'],
        hu_HU: ['Adatok mutatása'],
        id_ID: ['Perlihatkan data'],
        it: ['Mostra dati'],
        ja: ['データを表示'],
        ko: ['데이터 보기'],
        ms_MY: ['Tunjuk data'],
        nl_NL: 'Show data',
        pl: ['Pokaż dane'],
        pt: ['Mostrar dados'],
        ro: 'Show data',
        ru: ['Показать данные'],
        sv: ['Visa information'],
        th: ['แสดงข้อมูล'],
        tr: ['Verileri Göster'],
        vi: ['Hiển thị dữ liệu'],
        zh: ['显示数据'],
        zh_TW: ['顯示數據'],
      }
    },
    787358: (e) => {
      e.exports = {
        ar: ['عرض ‎{title}‎'],
        ca_ES: ['mostra {title}'],
        cs: 'show {title}',
        de: ['{title} anzeigen'],
        el: 'show {title}',
        en: 'show {title}',
        es: ['mostrar {title}'],
        fa: 'show {title}',
        fr: ['afficher {title}'],
        he_IL: ['הצג ‎{title}‎'],
        hu_HU: 'show {title}',
        id_ID: ['tampilkan {title}'],
        it: ['mostra {title}'],
        ja: ['{title}の表示'],
        ko: ['{title} 보이기'],
        ms_MY: ['tunjuk {title}'],
        nl_NL: 'show {title}',
        pl: ['pokaż {title}'],
        pt: ['exibir {title}'],
        ro: 'show {title}',
        ru: ['отображение: {title}'],
        sv: ['visa {title}'],
        th: ['แสดง {title}'],
        tr: ['{title} göster'],
        vi: ['hiện {title}'],
        zh: ['显示{title}'],
        zh_TW: ['顯示{title}'],
      }
    },
  },
])
