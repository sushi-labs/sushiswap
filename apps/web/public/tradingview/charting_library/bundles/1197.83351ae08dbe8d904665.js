;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1197, 3637],
  {
    92229: (e) => {
      e.exports = {
        defaultsButtonText: 'defaultsButtonText-zcLkuEMM',
        defaultsButtonItem: 'defaultsButtonItem-zcLkuEMM',
        defaultsButtonIcon: 'defaultsButtonIcon-zcLkuEMM',
      }
    },
    518008: (e) => {
      e.exports = {
        themesButtonText: 'themesButtonText-AeBgp7zz',
        themesButtonIcon: 'themesButtonIcon-AeBgp7zz',
        defaultsButtonText: 'defaultsButtonText-AeBgp7zz',
        defaultsButtonItem: 'defaultsButtonItem-AeBgp7zz',
      }
    },
    445015: (e) => {
      e.exports = { 'link-item': 'link-item-eIA09f0e' }
    },
    685200: (e) => {
      e.exports = {
        'arrow-icon': 'arrow-icon-NIrWNOPk',
        dropped: 'dropped-NIrWNOPk',
        'size-xsmall': 'size-xsmall-NIrWNOPk',
        'size-small': 'size-small-NIrWNOPk',
        'size-medium': 'size-medium-NIrWNOPk',
        'size-large': 'size-large-NIrWNOPk',
        'size-xlarge': 'size-xlarge-NIrWNOPk',
      }
    },
    125164: (e) => {
      e.exports = {
        'underline-tab': 'underline-tab-cfYYXvwA',
        'disable-focus-outline': 'disable-focus-outline-cfYYXvwA',
        'enable-cursor-pointer': 'enable-cursor-pointer-cfYYXvwA',
        selected: 'selected-cfYYXvwA',
        'disable-active-state-styles': 'disable-active-state-styles-cfYYXvwA',
        'size-xsmall': 'size-xsmall-cfYYXvwA',
        'size-small': 'size-small-cfYYXvwA',
        'size-medium': 'size-medium-cfYYXvwA',
        'size-large': 'size-large-cfYYXvwA',
        'size-xlarge': 'size-xlarge-cfYYXvwA',
        fake: 'fake-cfYYXvwA',
        'margin-xsmall': 'margin-xsmall-cfYYXvwA',
        'margin-small': 'margin-small-cfYYXvwA',
        'margin-medium': 'margin-medium-cfYYXvwA',
        'margin-large': 'margin-large-cfYYXvwA',
        'margin-xlarge': 'margin-xlarge-cfYYXvwA',
        'ellipsis-children': 'ellipsis-children-cfYYXvwA',
      }
    },
    679877: (e) => {
      e.exports = {
        'scroll-wrap': 'scroll-wrap-SmxgjhBJ',
        'size-xlarge': 'size-xlarge-SmxgjhBJ',
        'enable-scroll': 'enable-scroll-SmxgjhBJ',
        'underline-tabs': 'underline-tabs-SmxgjhBJ',
        'size-large': 'size-large-SmxgjhBJ',
        'size-medium': 'size-medium-SmxgjhBJ',
        'size-small': 'size-small-SmxgjhBJ',
        'size-xsmall': 'size-xsmall-SmxgjhBJ',
        'make-grid-column': 'make-grid-column-SmxgjhBJ',
        'stretch-tabs': 'stretch-tabs-SmxgjhBJ',
        'equal-tab-size': 'equal-tab-size-SmxgjhBJ',
      }
    },
    810047: (e) => {
      e.exports = {
        underline: 'underline-Pun8HxCz',
        center: 'center-Pun8HxCz',
        corner: 'corner-Pun8HxCz',
        disabled: 'disabled-Pun8HxCz',
      }
    },
    429510: (e, t, n) => {
      var a
      n.d(t, { useCollapsible: () => r }),
        ((e) => {
          ;(e.StartFirst = 'start-first'), (e.EndFirst = 'end-first')
        })(a || (a = {}))
      var l = n(50959),
        i = n(708886)
      function r(e, t, n, r = a.EndFirst) {
        const o = (0, l.useCallback)(
          (n, l) => {
            const i = e.map((e) => {
              var a
              return null !== (a = n.widthsMap.get(t(e))) && void 0 !== a
                ? a
                : 0
            })
            return (({
              items: e,
              containerWidth: t,
              elementsWidths: n,
              menuItemWidth: l,
              keepVisible: i,
              direction: r,
            }) => {
              const o = [...e],
                s = [],
                c = []
              let u = 0
              for (const e of n) u += e
              if (u <= t) return { visible: o, hidden: c }
              const d = [...n]
              if (
                ((u = i.map((e) => d[e]).reduce((e, t) => e + t, 0) + l),
                r === a.EndFirst)
              )
                for (let e = 0; e < o.length; e++)
                  i.includes(e)
                    ? s.push(o[e])
                    : ((u += d[e]), u <= t ? s.push(o[e]) : c.push(o[e]))
              else
                for (let e = o.length - 1; e >= 0; e--)
                  i.includes(e)
                    ? s.unshift(o[e])
                    : ((u += d[e]), u <= t ? s.unshift(o[e]) : c.unshift(o[e]))
              return { visible: s, hidden: c }
            })({
              items: e,
              containerWidth: n.containerWidth,
              elementsWidths: i,
              menuItemWidth: n.moreButtonWidth,
              keepVisible: l,
              direction: r,
            })
          },
          [e],
        )
        return (0, i.useCollapsibleCommon)({
          itemsList: e,
          getItemId: t,
          calcVisibleAndHiddenItems: o,
          shouldKeepItemVisible: n,
        })
      }
    },
    708886: (e, t, n) => {
      n.d(t, { useCollapsibleCommon: () => c })
      var a = n(50959),
        l = n(664332),
        i = n(65160),
        r = n(457927),
        o = n(855393),
        s = n(273388)
      function c(e) {
        const {
            itemsList: t,
            getItemId: n,
            calcVisibleAndHiddenItems: c,
            shouldKeepItemVisible: d,
            onMeasureCallback: m,
            forceUpdate: f = !1,
          } = e,
          [p, b] = (0, r.useRefsMap)(),
          v = (0, a.useRef)(null),
          g = (0, a.useRef)({
            widthsMap: new Map(),
            containerWidth: 0,
            moreButtonWidth: 0,
          }),
          [h, T] = (0, a.useState)({ visible: t, hidden: [] }),
          E = (0, a.useMemo)(
            () => t.reduce((e, t, n) => (d(t) && e.push(n), e), []),
            [t, d],
          ),
          C = (0, a.useCallback)(() => {
            if (g.current.containerWidth) {
              const e = c(g.current, E)
              ;((e, t) => !u(e.visible, t.visible) || !u(e.hidden, t.hidden))(
                h,
                e,
              ) && T(e)
            }
          }, [g, T, h, E, c]),
          A = (0, a.useCallback)(() => {
            g.current.moreButtonWidth = v.current
              ? (0, i.outerWidth)(v.current, !0)
              : 0
            const e = new Map(g.current.widthsMap)
            for (const a of t) {
              const t = n(a),
                l = p.current.get(t)
              if (l) {
                const n = (0, i.outerWidth)(l, !0)
                e.set(t, n)
              }
            }
            ;(g.current.widthsMap = e), m && m()
          }, [g, t, n, p, m]),
          k = (0, a.useRef)(null),
          y = (0, a.useCallback)(
            ([e]) => {
              e.contentRect.width !== g.current.containerWidth &&
                (k.current && cancelAnimationFrame(k.current),
                (g.current.containerWidth = e.contentRect.width),
                (k.current = requestAnimationFrame(() => {
                  C()
                })))
            },
            [g, C],
          ),
          x = (0, a.useRef)(null),
          w = (0, a.useCallback)(
            ([e]) => {
              x.current && cancelAnimationFrame(x.current),
                A(),
                (x.current = requestAnimationFrame(() => {
                  C()
                }))
            },
            [A, C],
          ),
          S = (0, l.useResizeObserver)(w),
          M = (0, l.useResizeObserver)(y),
          B = (0, a.useRef)(null),
          R = (0, s.mergeRefs)([M, B]),
          N = (0, a.useRef)(t),
          I = (0, a.useRef)(!0),
          z = (0, a.useRef)([])
        return (
          (0, o.useIsomorphicLayoutEffect)(() => {
            ;(!f && !I.current && u(N.current, t) && u(E, z.current)) ||
              (C(), (I.current = !1), (N.current = t), (z.current = E))
          }, [t, C, E, f]),
          {
            containerRefCallback: R,
            moreButtonRef: v,
            innerContainerRefCallback: S,
            itemsRefs: p,
            setItemRef: b,
            hiddenItems: h.hidden,
            visibleItems: h.visible,
            itemsMeasurements: g,
          }
        )
      }
      function u(e, t) {
        return (
          e.length === t.length && e.reduce((e, n, a) => e && n === t[a], !0)
        )
      }
    },
    118965: (e, t, n) => {
      n.d(t, { useMobileTouchState: () => i })
      var a = n(50959),
        l = n(804395)
      function i() {
        const [e, t] = (0, a.useState)(!1)
        return (
          (0, a.useEffect)(() => {
            t(l.mobiletouch)
          }, []),
          e
        )
      }
    },
    984164: (e, t, n) => {
      n.d(t, { useTabs: () => p })
      var a = n(50959),
        l = n(897107),
        i = n(269842),
        r = n(383836),
        o = n(930617),
        s = n(650151),
        c = n(865968),
        u = n(648621)
      function d() {
        return !1
      }
      function m(e) {
        const { activationType: t = 'manual' } = e,
          n = (0, a.useMemo)(() => t, [])
        return (
          (0, s.assert)(t === n, 'Activation type must be invariant.'),
          'automatic' === t
            ? ((e) => {
                const {
                    isRtl: t,
                    items: n,
                    preventDefaultIfHandled: l = !0,
                    isHighlighted: i,
                    onHighlight: r,
                    onActivate: o,
                    isCollapsed: s = d,
                    orientation: m,
                  } = e,
                  f = (0, a.useCallback)(
                    (e) => {
                      r(e), s(e) || o(e)
                    },
                    [r, o, s],
                  )
                return (0, c.useKeyboardEventHandler)(
                  [(0, u.useItemsKeyboardNavigation)(m, t, n, i, f, !0)],
                  l,
                )
              })(e)
            : ((e) => {
                const {
                    isRtl: t,
                    items: n,
                    preventDefaultIfHandled: l = !0,
                    isHighlighted: i,
                    onHighlight: r,
                    onActivate: o,
                    orientation: s,
                  } = e,
                  d = n.find(i),
                  m = (0, a.useCallback)(() => {
                    void 0 !== d && o(d)
                  }, [d, o]),
                  f = (0, a.useCallback)((e) => r(e), [r]),
                  p = (0, u.useItemsKeyboardNavigation)(s, t, n, i, f, !0),
                  b = (0, c.useKeyboardActionHandler)([13, 32], m)
                return (0, c.useKeyboardEventHandler)([p, b], l)
              })(e)
        )
      }
      var f = n(118965)
      function p(e) {
        var t, n
        const {
            id: s,
            items: c,
            orientation: u,
            activationType: d = 'manual',
            disabled: p,
            tablistLabelId: b,
            tablistLabel: v,
            focusOnHighlight: g = !0,
            preventDefaultIfKeyboardActionHandled: h = !0,
            scrollIntoViewOptions: T,
            isActive: E,
            onActivate: C,
            isCollapsed: A,
            isRtl: k,
            isDisclosureOpened: y,
          } = e,
          x = (0, f.useMobileTouchState)(),
          w = y ? null : u || 'horizontal',
          S = (0, a.useRef)(
            null !==
              (n =
                null === (t = e.itemsRefs) || void 0 === t
                  ? void 0
                  : t.current) && void 0 !== n
              ? n
              : new Map(),
          ),
          [M, B] = (0, a.useState)(),
          [R, N] = (0, r.useFocus)(),
          I = c.find(E),
          z = (0, a.useCallback)((e) => !p && !e.disabled && e === M, [p, M]),
          L = (0, a.useCallback)(
            (e) => {
              const t = S.current.get(e)
              g && void 0 !== t && t !== document.activeElement && t.focus()
            },
            [g],
          ),
          P = (0, a.useRef)(),
          D = (0, a.useCallback)(
            (e, t) => {
              p ||
                e.disabled ||
                (B(e),
                'number' == typeof t
                  ? (clearTimeout(P.current),
                    (P.current = setTimeout(() => L(e), t)))
                  : L(e))
            },
            [p, B, L],
          ),
          O = (0, a.useCallback)(
            (e) => {
              p || e.disabled || (C(e), z(e) || D(e))
            },
            [p, C, z, D],
          ),
          _ = m({
            isRtl: k,
            items: (0, a.useMemo)(
              () => c.filter((e) => !p && !e.disabled),
              [c, p],
            ),
            activationType: d,
            preventDefaultIfHandled: h,
            onActivate: O,
            isHighlighted: z,
            onHighlight: D,
            isCollapsed: A,
            orientation: w,
          }),
          W = (0, a.useCallback)(
            (e) => {
              let t = null
              for (const [n, a] of S.current.entries())
                if (e.target === a) {
                  t = n
                  break
                }
              t && !z(t) && ('automatic' === d && A && !A(t) ? O(t) : D(t))
            },
            [d, z, D, O, A],
          )
        ;(0, a.useEffect)(() => {
          x || (void 0 !== I && B(I))
        }, [I, x]),
          (0, a.useEffect)(() => {
            R || B(void 0)
          }, [R]),
          (0, a.useEffect)(() => () => clearTimeout(P.current), [])
        const [H, Y] = (0, o.useKeepActiveItemIntoView)({
            ...T,
            activeItem: null != M ? M : I,
            getKey: (0, a.useCallback)((e) => e.id, []),
          }),
          F = (0, a.useCallback)(
            (e, t) => {
              Y(e, t), null !== t ? S.current.set(e, t) : S.current.delete(e)
            },
            [Y],
          ),
          X = c.map((e) => {
            var t, n
            const a = z(e),
              i = E(e),
              r =
                null !==
                  (n = null !== (t = e.disabled) && void 0 !== t ? t : p) &&
                void 0 !== n &&
                n,
              o = !r && (R ? a : i)
            return {
              ...(0, l.getTabAttributes)(e.id, o, i, e.tabpanelId, r),
              highlighted: a,
              active: i,
              handleItemRef: F,
            }
          })
        return {
          tabsBindings: X,
          tablistBinding: {
            ...(0, l.getTabListAttributes)((0, l.getTablistId)(s), u, p, b, v),
            onBlur: N.onBlur,
            onFocus: (0, i.createSafeMulticastEventHandler)(N.onFocus, W),
            onKeyDown: _,
          },
          scrollWrapBinding: { ref: H },
          onActivate: O,
          onHighlight: D,
          isHighlighted: z,
        }
      }
    },
    897107: (e, t, n) => {
      n.d(t, {
        TabNames: () => a,
        getTabAttributes: () => o,
        getTabListAttributes: () => r,
        getTablistId: () => i,
      })
      var a,
        l = n(414823)
      function i(e) {
        return (0, l.createDomId)(e, 'tablist')
      }
      function r(e, t = 'horizontal', n, a, l) {
        return {
          id: e,
          role: 'tablist',
          'aria-orientation': t,
          'aria-label': l,
          'aria-labelledby': a,
          'aria-disabled': n,
        }
      }
      function o(e, t, n, a, l) {
        return {
          id: e,
          role: 'tab',
          tabIndex: t ? 0 : -1,
          disabled: l,
          'aria-selected': n,
          'aria-controls': a,
          'aria-disabled': l,
        }
      }
      !((e) => {
        ;(e.SquareButtonTabs = 'square-button-tabs'),
          (e.UnderlineButtonTabs = 'underline-button-tabs'),
          (e.UnderlineAnchorTabs = 'underline-anchor-tabs'),
          (e.RoundAnchorTabs = 'round-anchor-tabs'),
          (e.RoundButtonTabs = 'round-button-tabs'),
          (e.LightButtonTabs = 'light-button-tabs')
      })(a || (a = {}))
    },
    65160: (e, t, n) => {
      function a(e) {
        const { paddingTop: t, paddingBottom: n } = window.getComputedStyle(e)
        return [t, n].reduce(
          (e, t) => e - Number((t || '').replace('px', '')),
          e.clientHeight,
        )
      }
      function l(e, t = !1) {
        const n = getComputedStyle(e),
          a = [n.height]
        return (
          'border-box' !== n.boxSizing &&
            a.push(
              n.paddingTop,
              n.paddingBottom,
              n.borderTopWidth,
              n.borderBottomWidth,
            ),
          t && a.push(n.marginTop, n.marginBottom),
          a.reduce((e, t) => e + (Number.parseFloat(t) || 0), 0)
        )
      }
      function i(e, t = !1) {
        const n = getComputedStyle(e),
          a = [n.width]
        return (
          'border-box' !== n.boxSizing &&
            a.push(
              n.paddingLeft,
              n.paddingRight,
              n.borderLeftWidth,
              n.borderRightWidth,
            ),
          t && a.push(n.marginLeft, n.marginRight),
          a.reduce((e, t) => e + (Number.parseFloat(t) || 0), 0)
        )
      }
      n.d(t, {
        contentHeight: () => a,
        outerHeight: () => l,
        outerWidth: () => i,
      })
    },
    839246: (e, t, n) => {
      n.d(t, { DialogTabs: () => i })
      var a = n(50959),
        l = n(873637)
      const i = a.forwardRef((e, t) => {
        const { id: n, tabs: i, activeTab: r, onChange: o, className: s } = e
        return a.createElement(
          'div',
          { className: s, ref: t },
          a.createElement(l.UnderlineButtonTabs, {
            id: n,
            items: i,
            isActive: (e) => e.id === r,
            onActivate: (e) => {
              o(e.id)
            },
          }),
        )
      })
    },
    674609: (e, t, n) => {
      n.d(t, { StudyDefaultsManager: () => f })
      var a = n(50959),
        l = n(497754),
        i = n.n(l),
        r = n(72571),
        o = n(609838),
        s = n(299120),
        c = n(192063),
        u = n(844996),
        d = n(92229)
      const m = {
        reset: o.t(null, void 0, n(79782)),
        saveAsDefault: o.t(null, void 0, n(418229)),
        defaults: o.t(null, void 0, n(698938)),
      }
      class f extends a.PureComponent {
        constructor() {
          super(...arguments),
            (this._handleResetToDefaults = () => {
              this.props.model.restorePropertiesForSource(this.props.source)
            }),
            (this._handleSaveAsDefaults = () => {
              this.props.source.properties().saveDefaults()
            })
        }
        render() {
          const { mode: e } = this.props
          return a.createElement(
            s.ControlDisclosure,
            {
              id: 'study-defaults-manager',
              className: i()('normal' === e && d.defaultsButtonText),
              hideArrowButton: 'compact' === e,
              buttonChildren: this._getPlaceHolderItem('compact' === e),
            },
            a.createElement(c.PopupMenuItem, {
              className: d.defaultsButtonItem,
              isActive: !1,
              label: m.reset,
              onClick: this._handleResetToDefaults,
            }),
            a.createElement(c.PopupMenuItem, {
              className: d.defaultsButtonItem,
              isActive: !1,
              label: m.saveAsDefault,
              onClick: this._handleSaveAsDefaults,
            }),
          )
        }
        _getPlaceHolderItem(e) {
          return e
            ? a.createElement(r.Icon, {
                className: d.defaultsButtonIcon,
                icon: u,
              })
            : m.defaults
        }
      }
    },
    944316: (e, t, n) => {
      n.d(t, { FooterMenu: () => z })
      var a = n(50959),
        l = n(386942),
        i = n(601227),
        r = n(986661),
        o = n(609838),
        s = n(664902),
        c = n(72571),
        u = n(299120),
        d = n(930052),
        m = n(518008),
        f = n(844996)
      function p(e) {
        return e.isTabletWidth
          ? a.createElement(c.Icon, { className: m.themesButtonIcon, icon: f })
          : a.createElement(a.Fragment, null, o.t(null, void 0, n(419611)))
      }
      function b(e) {
        return a.createElement(
          d.MatchMedia,
          { rule: 'screen and (max-width: 768px)' },
          (t) =>
            a.createElement(
              u.ControlDisclosure,
              {
                className: !t && m.themesButtonText,
                hideArrowButton: t,
                buttonChildren: a.createElement(p, { isTabletWidth: t }),
              },
              e.children,
            ),
        )
      }
      var v = n(192063),
        g = n(72621),
        h = n(522224),
        T = n(972535)
      function E(e) {
        const { name: t, onRemove: n, onClick: l } = e,
          [i, r] = (0, h.useHover)(),
          o = a.useCallback(() => l(t), [l, t]),
          s = a.useCallback(() => {
            n && n(t)
          }, [n, t])
        return a.createElement(
          'div',
          { ...r },
          a.createElement(v.PopupMenuItem, {
            className: m.defaultsButtonItem,
            isActive: !1,
            label: t,
            onClick: o,
            toolbox:
              n &&
              a.createElement(g.RemoveButton, {
                hidden: !T.mobiletouch && !i,
                onClick: s,
              }),
          }),
        )
      }
      var C = n(917850),
        A = n(153055),
        k = n(753327),
        y = n(350299),
        x = n(980458)
      var w = n(855342)
      const S = (0, l.connect)(
        (e, t) => ({ templates: e.templates[t.toolName] }),
        (e, t) => {
          const { toolName: n, applyTemplate: a, getSourceTemplate: l } = t
          return {
            getTemplates: () => e((0, w.getTemplates)(n)),
            loadTemplate: a ? (t) => e((0, w.loadTemplate)(n, t, a)) : void 0,
            removeTemplate: (t) => e((0, w.startRemoveTemplate)(n, t)),
            saveTemplate: l
              ? (t) => e((0, w.saveTemplate)(n, t, JSON.stringify(l())))
              : void 0,
          }
        },
      )((e) => {
        const {
            templates: t,
            getTemplates: l,
            applyDefaults: i,
            saveTemplate: r,
            applyTemplate: s,
          } = e,
          c = (0, a.useContext)(k.SlotContext)
        return (
          (0, a.useEffect)(() => {
            s && !t && l()
          }, [t, l, s]),
          a.createElement(
            b,
            null,
            r &&
              a.createElement(E, {
                onClick: () => {
                  window.runOrSignIn(
                    () => {
                      ;(0, A.showRename)(
                        {
                          title: o.t(null, void 0, n(504315)),
                          text: o.t(null, void 0, n(350912)) + ':',
                          maxLength: 64,
                          source: t || [],
                          autocompleteFilter: x.autocompleteFilter,
                          onRename: ({
                            newValue: a,
                            focusInput: l,
                            dialogClose: i,
                            innerManager: r,
                          }) => {
                            var s
                            if (t && -1 !== t.indexOf(a)) {
                              const t = o
                                .t(null, void 0, n(572405))
                                .format({ name: a })
                              ;(0, A.showConfirm)(
                                {
                                  text: t,
                                  onConfirm: ({ dialogClose: t }) => {
                                    var n
                                    null === (n = e.saveTemplate) ||
                                      void 0 === n ||
                                      n.call(e, a),
                                      t(),
                                      i()
                                  },
                                  onClose: l,
                                },
                                r,
                              )
                            } else
                              null === (s = e.saveTemplate) ||
                                void 0 === s ||
                                s.call(e, a),
                                i()
                          },
                        },
                        c,
                      )
                    },
                    { source: 'Save line tool template', sourceMeta: 'Chart' },
                  )
                },
                name: (0, y.appendEllipsis)(o.t(null, void 0, n(309908))),
              }),
            a.createElement(E, {
              onClick: i,
              name: o.t(null, void 0, n(473169)),
            }),
            s &&
              t &&
              t.length > 0 &&
              a.createElement(
                a.Fragment,
                null,
                a.createElement(C.PopupMenuSeparator, null),
                t.map((e) =>
                  a.createElement(E, {
                    key: e,
                    name: e,
                    onRemove: u,
                    onClick: d,
                  }),
                ),
              ),
          )
        )
        function u(t) {
          window.runOrSignIn(
            () => {
              const a = o.t(null, void 0, n(506705)).format({ name: t })
              ;(0, A.showConfirm)(
                {
                  text: a,
                  onConfirm: ({ dialogClose: n }) => {
                    e.removeTemplate(t), n()
                  },
                },
                c,
              )
            },
            { source: 'Delete line tool template' },
          )
        }
        function d(t) {
          var n
          null === (n = e.loadTemplate) || void 0 === n || n.call(e, t)
        }
      })
      var M = n(156963)
      const B = new s.TranslatedString(
          'apply drawing template',
          o.t(null, void 0, n(349037)),
        ),
        R = new s.TranslatedString(
          'apply drawing template',
          o.t(null, void 0, n(349037)),
        )
      function N(e) {
        const { sources: t, chartUndoModel: n } = e,
          l = (0, a.useMemo)(
            () => t.every((e) => e.toolname === t[0].toolname),
            [t],
          )
        return M.enabled('drawing_templates')
          ? a.createElement(S, {
              toolName: t[0].toolname,
              applyDefaults: i,
              applyTemplate: l
                ? (e) => {
                    1 === t.length
                      ? n.applyLineToolTemplate(t[0], e, B)
                      : (n.beginUndoMacro(R),
                        t.forEach((t) => {
                          n.applyLineToolTemplate(t, e, null)
                        }),
                        n.endUndoMacro())
                  }
                : void 0,
              getSourceTemplate:
                1 === t.length ? () => t[0].template() : void 0,
            })
          : a.createElement(S, { toolName: t[0].toolname, applyDefaults: i })
        function i() {
          n.restoreLineToolsFactoryDefaults(t)
        }
      }
      function I(e) {
        return a.createElement(
          b,
          null,
          a.createElement(E, {
            onClick: () => {
              const { sources: t, chartUndoModel: n } = e
              n.restoreLineToolsFactoryDefaults(t)
            },
            name: o.t(null, void 0, n(67049)),
          }),
        )
      }
      function z(e) {
        return (0, i.onWidget)()
          ? a.createElement(I, { ...e })
          : a.createElement(
              l.Provider,
              { store: r.store },
              a.createElement(N, { ...e }),
            )
      }
    },
    380865: (e, t, n) => {
      n.d(t, {
        PropertiesEditorTab: () => c,
      })
      var a = n(50959),
        l = n(633064)
      const i = {
          'Elliott Impulse Wave (12345)Degree': 'normal',
          'Elliott Triangle Wave (ABCDE)Degree': 'normal',
          'Elliott Triple Combo Wave (WXYXZ)Degree': 'normal',
          'Elliott Correction Wave (ABC)Degree': 'normal',
          'Elliott Double Combo Wave (WXY)Degree': 'normal',
          BarsPatternMode: 'normal',
          StudyInputSource: 'normal',
        },
        r = {
          TextText: 'big',
          AnchoredTextText: 'big',
          NoteText: 'big',
          AnchoredNoteText: 'big',
          CalloutText: 'big',
          BalloonText: 'big',
        }
      var o = n(459837),
        s = n(951612)
      function c(e) {
        const { page: t, pageRef: n, tableKey: c } = e
        return a.createElement(
          l.ControlCustomHeightContext.Provider,
          { value: r },
          a.createElement(
            l.ControlCustomWidthContext.Provider,
            { value: i },
            t &&
              a.createElement(
                o.PropertyTable,
                { reference: n, key: c },
                t.definitions
                  .value()
                  .map((e) =>
                    a.createElement(s.Section, { key: e.id, definition: e }),
                  ),
              ),
          ),
        )
      }
    },
    737402: (e, t, n) => {
      n.d(t, { useSafeMatchMedia: () => a.useSafeMatchMedia })
      var a = n(671129)
    },
    873637: (e, t, n) => {
      n.d(t, { UnderlineButtonTabs: () => K })
      var a = n(50959),
        l = n(497754),
        i = n.n(l),
        r = n(609838),
        o = n(429510),
        s = n(525388),
        c = n(269842),
        u = n(772069),
        d = n(984164),
        m = n(953517)
      const f = (0, a.createContext)('small')
      var p = n(234539),
        b = n(125164)
      function v(e) {
        const {
          size: t = 'xsmall',
          active: n,
          fake: a,
          enableActiveStateStyles: i,
          anchor: r = !1,
          hideFocusOutline: o = !1,
          equalTabSize: s,
          className: c,
        } = e
        return l(
          b['underline-tab'],
          b[`size-${t}`],
          n && b.selected,
          !i && b['disable-active-state-styles'],
          o && b['disable-focus-outline'],
          a && b.fake,
          r && b['enable-cursor-pointer'],
          s && b[`margin-${t}`],
          c,
        )
      }
      const g = (0, a.forwardRef)((e, t) => {
        const n = (0, a.useContext)(f),
          l = (0, a.useContext)(p.CustomBehaviourContext),
          {
            active: r,
            fake: o,
            className: s,
            enableActiveStateStyles: c = l.enableActiveStateStyles,
            hideFocusOutline: u = !1,
            equalTabSize: d,
            children: m,
            ...g
          } = e
        return a.createElement(
          'button',
          {
            ...g,
            ref: t,
            className: v({
              size: n,
              active: r,
              fake: o,
              enableActiveStateStyles: c,
              hideFocusOutline: u,
              equalTabSize: d,
              className: s,
            }),
          },
          d && 'string' == typeof m
            ? a.createElement(
                'span',
                {
                  className: i()(
                    b['ellipsis-children'],
                    'apply-overflow-tooltip',
                  ),
                },
                m,
              )
            : m,
        )
      })
      g.displayName = 'UnderlineTabsBaseButton'
      const h = (0, a.forwardRef)((e, t) => {
        const {
            item: n,
            highlighted: l,
            handleItemRef: i,
            onClick: r,
            'aria-disabled': o,
            ...s
          } = e,
          c = (0, a.useCallback)(() => {
            r && r(n)
          }, [r, n]),
          u = (0, a.useCallback)(
            (e) => {
              i && i(n, e),
                t && 'object' == typeof t
                  ? (t.current = e)
                  : 'function' == typeof t && t(e)
            },
            [n, i, t],
          )
        return a.createElement(
          g,
          { ...s, id: n.id, onClick: c, ref: u },
          n.label,
        )
      })
      h.displayName = 'UnderlineButtonTab'
      var T = n(650151),
        E = n(192063),
        C = n(904925),
        A = n(72571),
        k = n(347531),
        y = n(602948),
        x = n(863509),
        w = n(168874),
        S = n(685200)
      function M(e) {
        switch (e) {
          case 'xsmall':
            return k
          case 'small':
            return y
          case 'medium':
          case 'large':
            return x
          case 'xlarge':
            return w
        }
      }
      function B(e) {
        const { size: t, isDropped: n = !1 } = e
        return a.createElement(A.Icon, {
          icon: M(t),
          className: l(S['arrow-icon'], S[`size-${t}`], n && S.dropped),
        })
      }
      var R = n(445015)
      function N(e) {
        const {
            size: t,
            disabled: n,
            isOpened: l,
            enableActiveStateStyles: i,
            hideFocusOutline: r,
            fake: o,
            items: c,
            buttonContent: u,
            buttonRef: d,
            isAnchorTabs: m,
            isHighlighted: f,
            onButtonClick: p,
            onItemClick: b,
            onClose: v,
          } = e,
          h = (0, a.useRef)(null),
          A = (0, s.useMergedRefs)([d, h]),
          k = ((e, t) => {
            const n = (0, a.useRef)(z)
            return (
              (0, a.useEffect)(() => {
                const e = getComputedStyle((0, T.ensureNotNull)(t.current))
                n.current = {
                  xsmall: I(e, 'xsmall'),
                  small: I(e, 'small'),
                  medium: I(e, 'medium'),
                  large: I(e, 'large'),
                  xlarge: I(e, 'xlarge'),
                }
              }, [t]),
              (0, a.useCallback)(() => {
                const a = (0, T.ensureNotNull)(
                    t.current,
                  ).getBoundingClientRect(),
                  l = n.current[e]
                return {
                  x: a.left,
                  y: a.top + a.height + l + 4,
                  indentFromWindow: { top: 4, bottom: 4, left: 4, right: 4 },
                }
              }, [t, e])
            )
          })(t, h)
        return a.createElement(C.PopupMenuDisclosureView, {
          buttonRef: h,
          listboxTabIndex: -1,
          isOpened: l,
          onClose: v,
          listboxAria: { 'aria-hidden': !0 },
          popupPosition: k,
          button: a.createElement(
            g,
            {
              'aria-hidden': !0,
              disabled: n,
              active: l,
              onClick: p,
              ref: A,
              tabIndex: -1,
              enableActiveStateStyles: i,
              hideFocusOutline: r,
              fake: o,
            },
            u,
            a.createElement(B, { size: t, isDropped: l }),
          ),
          popupChildren: c.map((e) =>
            a.createElement(E.PopupMenuItem, {
              key: e.id,
              className: m ? R['link-item'] : void 0,
              onClick: b,
              onClickArg: e,
              isActive: f(e),
              label: e.label,
              isDisabled: e.disabled,
              link: 'href' in e ? e.href : void 0,
              rel: 'rel' in e ? e.rel : void 0,
              target: 'target' in e ? e.target : void 0,
              renderComponent:
                'renderComponent' in e ? e.renderComponent : void 0,
              dontClosePopup: !0,
            }),
          ),
        })
      }
      function I(e, t) {
        return Number.parseInt(
          e.getPropertyValue(`--ui-lib-underline-tabs-tab-margin-bottom-${t}`),
          10,
        )
      }
      const z = { xsmall: 0, small: 0, medium: 0, large: 0, xlarge: 0 }
      var L = n(804395),
        P = n(737402),
        D = n(586240),
        O = n(679877)
      function _(e) {
        const { size: t, overflowBehaviour: n, className: a } = e
        return l(
          O['scroll-wrap'],
          O[`size-${t}`],
          'scroll' === n && O['enable-scroll'],
          a,
        )
      }
      function W() {
        const [e, t] = (0, a.useState)(!1)
        return (
          (0, a.useEffect)(() => {
            t(L.mobiletouch)
          }, []),
          e
        )
      }
      var H = n(12481),
        Y = n(710263),
        F = n(810047),
        X = n.n(F)
      function V(e) {
        const { disabled: t, translateX: n } = e,
          i = e.scale / 100
        return a.createElement(
          'div',
          {
            className: l(X().underline, t && X().disabled),
            style: { transform: `translateX(${n}px) scaleX(${i})` },
          },
          a.createElement('div', {
            className: X().corner,
            style: { transform: `scaleX(${1 / i})` },
          }),
          a.createElement('div', {
            className: X().center,
            style: { transform: `scaleX(${1 - 30 / e.scale})` },
          }),
          a.createElement('div', {
            className: X().corner,
            style: { transform: `scaleX(${1 / i})` },
          }),
        )
      }
      function K(e) {
        const {
            id: t,
            items: l,
            activationType: p,
            orientation: b,
            disabled: v,
            moreButtonContent: g = r.t(null, void 0, n(141610)),
            size: T = 'small',
            onActivate: E,
            isActive: C,
            className: A,
            style: k,
            overflowBehaviour: y,
            enableActiveStateStyles: x,
            tablistLabelId: w,
            tablistLabel: S,
            'data-name': M = 'underline-tabs-buttons',
            stretchTabs: B,
            equalTabSize: R,
          } = e,
          I = W(),
          z = ((e) => {
            const t = (0, P.useSafeMatchMedia)(
                D['media-mf-phone-landscape'],
                !0,
              ),
              n = W()
            return null != e ? e : n || !t ? 'scroll' : 'collapse'
          })(y),
          L = (0, a.useRef)(!1),
          F = (0, a.useCallback)((e) => e.id, []),
          X = 'none' === z && B,
          K = 'none' === z && R,
          j = null != x ? x : !I,
          {
            visibleItems: q,
            hiddenItems: J,
            containerRefCallback: U,
            innerContainerRefCallback: $,
            moreButtonRef: G,
            setItemRef: Z,
          } = (0, o.useCollapsible)(l, F, C),
          Q = 'collapse' === z ? q : l,
          ee = 'collapse' === z ? J : [],
          te = (0, a.useCallback)((e) => ee.includes(e), [ee]),
          ne = (0, a.useRef)(new Map()),
          {
            isOpened: ae,
            open: le,
            close: ie,
            onButtonClick: re,
          } = (0, u.useDisclosure)({ id: t, disabled: v }),
          {
            tabsBindings: oe,
            tablistBinding: se,
            scrollWrapBinding: ce,
            onActivate: ue,
            onHighlight: de,
            isHighlighted: me,
          } = (0, d.useTabs)({
            id: t,
            items: [...Q, ...ee],
            activationType: p,
            orientation: b,
            disabled: v,
            tablistLabelId: w,
            tablistLabel: S,
            onActivate: E,
            isActive: C,
            isCollapsed: te,
            isRtl: Y.isRtl,
            itemsRefs: ne,
            isDisclosureOpened: ae,
          }),
          fe = l.find(C),
          pe = ee.find(me),
          be = (0, a.useCallback)(() => {
            fe && de(fe)
          }, [de, fe]),
          ve = (0, a.useCallback)(
            (e) => {
              var t
              return null !== (t = oe.find((t) => t.id === e.id)) &&
                void 0 !== t
                ? t
                : {}
            },
            [oe],
          ),
          ge = (0, a.useCallback)(() => {
            ie(), be(), (L.current = !0)
          }, [ie, be]),
          he = (0, a.useCallback)(() => {
            pe && (ue(pe), de(pe, 200))
          }, [ue, de, pe])
        ;(ce.ref = (0, s.useMergedRefs)([ce.ref, U])),
          (se.ref = (0, s.useMergedRefs)([se.ref, $])),
          (se.onKeyDown = (0, c.createSafeMulticastEventHandler)(
            (0, m.useKeyboardEventHandler)([
              (0, m.useKeyboardClose)(ae, ge),
              (0, m.useKeyboardActionHandler)(
                [13, 32],
                he,
                (0, a.useCallback)(() => Boolean(pe), [pe]),
              ),
            ]),
            se.onKeyDown,
          ))
        const Te = (0, a.useCallback)(
            (e) => {
              ;(L.current = !0), re(e)
            },
            [L, re],
          ),
          Ee = (0, a.useCallback)(
            (e) => {
              e && ue(e)
            },
            [ue],
          )
        ;(0, a.useEffect)(() => {
          L.current ? (L.current = !1) : (pe && !ae && le(), !pe && ae && ie())
        }, [pe, ae, le, ie])
        const Ce = ((e, t, n) => {
          const [l, i] = (0, a.useState)(),
            r = (0, a.useRef)(),
            o = (e) => {
              var t
              const n =
                null !== (t = e.parentElement) && void 0 !== t ? t : void 0
              if (void 0 === n) return
              const { left: a, right: l, width: r } = e.getBoundingClientRect(),
                { left: o, right: s } = n.getBoundingClientRect(),
                c = (0, Y.isRtl)() ? l - s : a - o
              i({ translateX: c, scale: r })
            }
          return (
            (0, a.useEffect)(() => {
              const e = (0, H.default)((e) => {
                const t = e[0].target
                void 0 !== t && o(t)
              }, 50)
              r.current = new ResizeObserver(e)
            }, []),
            (0, a.useEffect)(() => {
              var n
              if (void 0 === t) return
              const a = e.get(t)
              return void 0 !== a
                ? (o(a),
                  null === (n = r.current) || void 0 === n || n.observe(a),
                  () => {
                    var e
                    return null === (e = r.current) || void 0 === e
                      ? void 0
                      : e.disconnect()
                  })
                : void 0
            }, n),
            l
          )
        })(ne.current, null != fe ? fe : pe, [null != fe ? fe : pe, Q, T, X, z])
        return a.createElement(
          f.Provider,
          { value: T },
          a.createElement(
            'div',
            {
              ...ce,
              className: _({ size: T, overflowBehaviour: z, className: A }),
              style: k,
              'data-name': M,
            },
            a.createElement(
              'div',
              {
                ...se,
                className: i()(O['underline-tabs'], {
                  [O['make-grid-column']]: X || K,
                  [O['stretch-tabs']]: X,
                  [O['equal-tab-size']]: K,
                }),
              },
              Q.map((e) =>
                a.createElement(h, {
                  ...ve(e),
                  key: e.id,
                  item: e,
                  onClick: ue,
                  enableActiveStateStyles: j,
                  hideFocusOutline: I,
                  ref: Z(F(e)),
                  ...(e.dataId && { 'data-id': e.dataId }),
                  equalTabSize: K,
                }),
              ),
              ee.map((e) =>
                a.createElement(h, { ...ve(e), key: e.id, item: e, fake: !0 }),
              ),
              a.createElement(N, {
                size: T,
                disabled: v,
                isOpened: ae,
                items: ee,
                buttonContent: g,
                buttonRef: G,
                isHighlighted: me,
                onButtonClick: Te,
                onItemClick: Ee,
                onClose: ie,
                enableActiveStateStyles: j,
                hideFocusOutline: I,
                fake: 0 === ee.length,
              }),
              Ce && a.createElement(V, { ...Ce, disabled: v }),
            ),
          ),
        )
      }
      var j = n(409245)
      function q(e) {
        return a.createElement('a', { ...(0, j.renameRef)(e) })
      }
      ;(0, a.forwardRef)((e, t) => {
        var n
        const l = (0, a.useContext)(f),
          i = (0, a.useContext)(p.CustomBehaviourContext),
          {
            item: r,
            highlighted: o,
            handleItemRef: s,
            onClick: c,
            active: u,
            fake: d,
            className: m,
            enableActiveStateStyles: b = i.enableActiveStateStyles,
            hideFocusOutline: g = !1,
            disabled: h,
            'aria-disabled': T,
            ...E
          } = e,
          C = (0, a.useCallback)(
            (e) => {
              T ? e.preventDefault() : c && c(r)
            },
            [c, T, r],
          ),
          A = (0, a.useCallback)(
            (e) => {
              s && s(r, e),
                t && 'object' == typeof t
                  ? (t.current = e)
                  : 'function' == typeof t && t(e)
            },
            [r, s, t],
          ),
          k = null !== (n = r.renderComponent) && void 0 !== n ? n : q
        return a.createElement(
          k,
          {
            ...E,
            id: r.id,
            'aria-disabled': T,
            onClick: C,
            reference: A,
            href: r.href,
            rel: r.rel,
            target: r.target,
            className: v({
              size: l,
              active: u,
              fake: d,
              enableActiveStateStyles: b,
              anchor: !0,
              hideFocusOutline: g,
              className: m,
            }),
          },
          r.label,
        )
      }).displayName = 'UnderlineAnchorTab'
    },
    855342: (e, t, n) => {
      n.d(t, {
        addTemplate: () => r,
        getTemplates: () => l,
        loadTemplate: () => u,
        removeTemplate: () => s,
        saveTemplate: () => c,
        setTemplates: () => i,
        startRemoveTemplate: () => o,
      })
      var a = n(765827)
      function l(e, t) {
        return { type: a.GET_TEMPLATES, toolName: e, callback: t }
      }
      function i(e, t) {
        return { type: a.SET_TEMPLATES, templates: t, toolName: e }
      }
      function r(e, t) {
        return { type: a.ADD_TEMPLATE, templateName: t, toolName: e }
      }
      function o(e, t) {
        return { type: a.START_REMOVE_TEMPLATE, templateName: t, toolName: e }
      }
      function s(e, t) {
        return { type: a.REMOVE_TEMPLATE, templateName: t, toolName: e }
      }
      function c(e, t, n) {
        return {
          type: a.SAVE_TEMPLATE,
          templateName: t,
          toolName: e,
          content: n,
        }
      }
      function u(e, t, n) {
        return {
          type: a.LOAD_TEMPLATE,
          toolName: e,
          templateName: t,
          callback: n,
        }
      }
    },
    765827: (e, t, n) => {
      function a(e) {
        return 'LINE_TOOL_TEMPLATE__' + e
      }
      n.d(t, {
        ADD_TEMPLATE: () => c,
        GET_TEMPLATES: () => l,
        LOAD_TEMPLATE: () => u,
        REMOVE_TEMPLATE: () => o,
        SAVE_TEMPLATE: () => s,
        SET_TEMPLATES: () => i,
        START_REMOVE_TEMPLATE: () => r,
      })
      const l = a('GET_TEMPLATES'),
        i = a('SET_TEMPLATES'),
        r = a('START_REMOVE_TEMPLATE'),
        o = a('REMOVE_TEMPLATE'),
        s = a('SAVE_TEMPLATE'),
        c = a('ADD_TEMPLATE'),
        u = a('LOAD_TEMPLATE')
    },
    986661: (e, t, n) => {
      n.d(t, { store: () => A })
      var a = n(691622),
        l = n(254773),
        i = n(336349),
        r = n(650151),
        o = n(765827),
        s = n(6835),
        c = n(855342)
      function u(e, t) {
        return t
      }
      var d = n(362830)
      const m = (0, s.getLogger)('Chart.LineToolTemplatesList')
      function f(e, t) {
        return t
      }
      function* p() {
        for (;;) {
          const {
            toolName: e,
            templateName: t,
            content: n,
          } = f(o.SAVE_TEMPLATE, yield (0, i.take)(o.SAVE_TEMPLATE))
          try {
            yield (0, i.call)(d.backend.saveDrawingTemplate, e, t, n),
              yield (0, i.put)((0, c.addTemplate)(e, t))
          } catch (e) {
            m.logWarn(e)
          }
        }
      }
      function* b() {
        for (;;) {
          const { toolName: e, templateName: t } = f(
            o.START_REMOVE_TEMPLATE,
            yield (0, i.take)(o.START_REMOVE_TEMPLATE),
          )
          try {
            yield (0, i.call)(d.backend.removeDrawingTemplate, e, t),
              yield (0, i.put)((0, c.removeTemplate)(e, t))
          } catch (e) {
            m.logWarn(e)
          }
        }
      }
      function* v() {
        const e = new Map()
        for (;;) {
          const { toolName: n, callback: a } = f(
            o.GET_TEMPLATES,
            yield (0, i.take)(o.GET_TEMPLATES),
          )
          e.has(n)
            ? (0, r.ensureDefined)(e.get(n)).push(a)
            : (e.set(n, [a]), yield (0, i.fork)(t, n))
        }
        function* t(t) {
          try {
            const e = u(
              d.backend.getDrawingTemplates,
              yield (0, i.call)(d.backend.getDrawingTemplates, t),
            )
            yield (0, i.put)((0, c.setTemplates)(t, e))
          } catch (e) {
            m.logWarn(e)
          }
          ;(0, r.ensureDefined)(e.get(t)).forEach((e) =>
            null == e ? void 0 : e(),
          ),
            e.delete(t)
        }
      }
      function* g() {
        for (;;) {
          const {
            toolName: e,
            templateName: t,
            callback: n,
          } = f(o.LOAD_TEMPLATE, yield (0, i.take)(o.LOAD_TEMPLATE))
          try {
            const a = u(
              d.backend.loadDrawingTemplate,
              yield (0, i.call)(d.backend.loadDrawingTemplate, e, t),
            )
            n && n(a)
          } catch (e) {
            m.logWarn(e)
          }
        }
      }
      function* h() {
        yield (0, i.all)([
          (0, i.call)(v),
          (0, i.call)(p),
          (0, i.call)(b),
          (0, i.call)(g),
        ])
      }
      const T = {
        templates: {},
      }
      function E(e, t) {
        return e.localeCompare(t, void 0, { numeric: !0 })
      }
      function C(e = T, t) {
        switch (t.type) {
          case o.ADD_TEMPLATE: {
            const { toolName: n, templateName: a } = t
            if (!e.templates[n].includes(a)) {
              const t = [...e.templates[n], a].sort(E)
              return { ...e, templates: { ...e.templates, [n]: t } }
            }
            return e
          }
          case o.SET_TEMPLATES: {
            const { toolName: n, templates: a } = t
            return { ...e, templates: { ...e.templates, [n]: [...a].sort(E) } }
          }
          case o.REMOVE_TEMPLATE: {
            const { toolName: n, templateName: a } = t
            return {
              ...e,
              templates: {
                ...e.templates,
                [n]: e.templates[n].filter((e) => e !== a),
              },
            }
          }
          default:
            return e
        }
      }
      const A = (() => {
        const e = (0, l.default)(),
          t = (0, a.createStore)(C, (0, a.applyMiddleware)(e))
        return e.run(h), t
      })()
    },
    980458: (e, t, n) => {
      function a(e, t) {
        return Boolean(
          '' === e || (e && -1 !== t.toLowerCase().indexOf(e.toLowerCase())),
        )
      }
      n.d(t, { autocompleteFilter: () => a })
    },
    347531: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="m4.67 7.38.66-.76L9 9.84l3.67-3.22.66.76L9 11.16 4.67 7.38Z"/></svg>'
    },
    863509: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.57 7.85 9 12.62l5.43-4.77-1.32-1.5L9 9.95l-4.11-3.6-1.32 1.5Z"/></svg>'
    },
    168874: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M7.3 10.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z"/></svg>'
    },
  },
])
