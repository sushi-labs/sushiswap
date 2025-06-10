;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3889],
  {
    57717: (e, t, i) => {
      i.r(t), i.d(t, { createPropertyPage: () => o })
      var r = i(64147)
      function o(e, t, i, o = null) {
        const n = {
          id: t,
          title: i,
          definitions: new r.WatchedValue(e.definitions),
          visible: e.visible ?? new r.WatchedValue(!0).readonly(),
        }
        return null !== o && (n.icon = o), n
      }
    },
    23351: (e, t, i) => {
      i.d(t, {
        convertToDefinitionProperty: () => n,
        makeProxyDefinitionProperty: () => o,
      })
      var r = i(51768)
      function o(e, t, i) {
        const r = new Map(),
          o = void 0 !== t ? t[0] : (e) => e,
          n = void 0 !== t ? (void 0 !== t[1] ? t[1] : t[0]) : (e) => e,
          s = {
            value: () => o(e.value()),
            setValue: (t) => {
              e.setValue(n(t))
            },
            subscribe: (t, i) => {
              const o = (e) => {
                i(s)
              }
              r.set(i, o), e.subscribe(t, o)
            },
            unsubscribe: (t, i) => {
              const o = r.get(i)
              o && (e.unsubscribe(t, o), r.delete(i))
            },
            unsubscribeAll: (t) => {
              e.unsubscribeAll(t), r.clear()
            },
            destroy: () => {
              e.release(), i?.()
            },
          }
        return s
      }
      function n(e, t, i, n, s, p, l) {
        const a = o(t.weakReference(), n, p),
          c = void 0 !== n ? (void 0 !== n[1] ? n[1] : n[0]) : (e) => e,
          u = s ?? ((r) => e.setProperty(t, c(r), i))
        return (
          (a.setValue = (e) => {
            l && (0, r.trackEvent)(l.category, l.event, l.label?.(e)), u(e)
          }),
          a
        )
      }
    },
    59411: (e, t, i) => {
      i.d(t, { createLinePropertyDefinition: () => l })
      var r = i(49857),
        o = i(51056)
      const n = [o.LINESTYLE_SOLID, o.LINESTYLE_DOTTED, o.LINESTYLE_DASHED],
        s = [1, 2, 3, 4],
        p = [r.LineEnd.Normal, r.LineEnd.Arrow]
      function l(e, t) {
        const i = { propType: 'line', properties: e, ...t }
        return (
          void 0 !== i.properties.style && (i.styleValues = n),
          void 0 !== i.properties.width && (i.widthValues = s),
          (void 0 === i.properties.leftEnd &&
            void 0 === i.properties.rightEnd) ||
            void 0 !== i.endsValues ||
            (i.endsValues = p),
          void 0 !== i.properties.value &&
            void 0 === i.valueType &&
            (i.valueType = 1),
          i
        )
      }
    },
    14608: (e, t, i) => {
      var r
      function o(e, t) {
        return { propType: 'number', properties: e, type: 1, ...t }
      }
      i.d(t, { createNumberPropertyDefinition: () => o }),
        ((e) => {
          ;(e[(e.Integer = 0)] = 'Integer'), (e[(e.Float = 1)] = 'Float')
        })(r || (r = {}))
    },
    14139: (e, t, i) => {
      function r(e, t) {
        return { propType: 'options', properties: e, ...t }
      }
      i.d(t, { createOptionsPropertyDefinition: () => r })
    },
    32097: (e, t, i) => {
      function r(e, t) {
        return {
          propType: 'checkable',
          properties: e,
          notFormatedTitle: !1,
          ...t,
        }
      }
      function o(e, t, i) {
        return {
          propType: 'checkableSet',
          properties: e,
          childrenDefinitions: i,
          ...t,
        }
      }
      function n(e, t) {
        return { propType: 'color', properties: e, noAlpha: !1, ...t }
      }
      i.d(t, {
        convertFromReadonlyWVToDefinitionProperty: () => G,
        convertFromWVToDefinitionProperty: () => F,
        convertToDefinitionProperty: () => _.convertToDefinitionProperty,
        createCheckablePropertyDefinition: () => r,
        createCheckableSetPropertyDefinition: () => o,
        createColorPropertyDefinition: () => n,
        createCoordinatesPropertyDefinition: () => S,
        createEmojiPropertyDefinition: () => H,
        createImagePropertyDefinition: () => z,
        createLeveledLinePropertyDefinition: () => c,
        createLinePropertyDefinition: () => s.createLinePropertyDefinition,
        createNumberPropertyDefinition: () => u.createNumberPropertyDefinition,
        createOptionalTwoColorsPropertyDefinition: () => L,
        createOptionsPropertyDefinition: () =>
          f.createOptionsPropertyDefinition,
        createPropertyDefinitionsCheckableListOptionsGroup: () => M,
        createPropertyDefinitionsGeneralGroup: () => W,
        createPropertyDefinitionsLeveledLinesGroup: () => N,
        createRangePropertyDefinition: () => I,
        createSelectionCoordinatesPropertyDefinition: () => E,
        createSessionPropertyDefinition: () => O,
        createStudyInputsPropertyDefinition: () => R,
        createSymbolPropertyDefinition: () => C,
        createTextPropertyDefinition: () => V,
        createTransparencyPropertyDefinition: () => A,
        createTwoColorsPropertyDefinition: () => k,
        createTwoOptionsPropertyDefinition: () => d,
        destroyDefinitions: () => se,
        getColorDefinitionProperty: () => X,
        getLockPriceScaleDefinitionProperty: () => B,
        getPriceScaleSelectionStrategyDefinitionProperty: () => j,
        getScaleRatioDefinitionProperty: () => U,
        getSymbolDefinitionProperty: () => Z,
        isCheckableListOptionsDefinition: () => ne,
        isColorDefinition: () => ie,
        isLineDefinition: () => te,
        isOptionsDefinition: () => oe,
        isPropertyDefinition: () => $,
        isPropertyDefinitionsGroup: () => ee,
        isTwoColorDefinition: () => re,
        makeProxyDefinitionProperty: () => _.makeProxyDefinitionProperty,
      })
      var s = i(59411),
        p = i(51056)
      const l = [p.LINESTYLE_SOLID, p.LINESTYLE_DOTTED, p.LINESTYLE_DASHED],
        a = [1, 2, 3, 4]
      function c(e, t) {
        const i = { propType: 'leveledLine', properties: e, ...t }
        return (
          void 0 !== i.properties.style && (i.styleValues = l),
          void 0 !== i.properties.width && (i.widthValues = a),
          i
        )
      }
      var u = i(14608),
        f = i(14139)
      function d(e, t) {
        return { propType: 'twoOptions', properties: e, ...t }
      }
      var y,
        v = i(11542),
        b = i(30699)
      !((e) => {
        ;(e.Horizontal = 'horizontal'), (e.Vertical = 'vertical')
      })(y || (y = {}))
      const P = [
          {
            id: b.VerticalAlign.Top,
            value: b.VerticalAlign.Bottom,
            title: v.t(null, void 0, i(97118)),
          },
          {
            id: b.VerticalAlign.Middle,
            value: b.VerticalAlign.Middle,
            title: v.t(null, void 0, i(68833)),
          },
          {
            id: b.VerticalAlign.Bottom,
            value: b.VerticalAlign.Top,
            title: v.t(null, void 0, i(27567)),
          },
        ],
        D = [
          {
            id: b.HorizontalAlign.Left,
            value: b.HorizontalAlign.Left,
            title: v.t(null, void 0, i(11626)),
          },
          {
            id: b.HorizontalAlign.Center,
            value: b.HorizontalAlign.Center,
            title: v.t(null, void 0, i(24197)),
          },
          {
            id: b.HorizontalAlign.Right,
            value: b.HorizontalAlign.Right,
            title: v.t(null, void 0, i(50421)),
          },
        ],
        T = [
          {
            id: 'horizontal',
            value: 'horizontal',
            title: v.t(null, void 0, i(95406)),
          },
          {
            id: 'vertical',
            value: 'vertical',
            title: v.t(null, void 0, i(69526)),
          },
        ],
        g = [8, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 40].map((e) => ({
          title: String(e),
          value: e,
        })),
        m = [1, 2, 3, 4],
        h = v.t(null, void 0, i(25485)),
        w = v.t(null, void 0, i(67781))
      function V(e, t) {
        const i = {
          propType: 'text',
          properties: e,
          ...t,
          isEditable: t.isEditable || !1,
        }
        return (
          void 0 !== i.properties.size &&
            void 0 === i.sizeItems &&
            (i.sizeItems = g),
          void 0 !== i.properties.alignmentVertical &&
            void 0 === i.alignmentVerticalItems &&
            (i.alignmentVerticalItems = P),
          void 0 !== i.properties.alignmentHorizontal &&
            void 0 === i.alignmentHorizontalItems &&
            (i.alignmentHorizontalItems = D),
          (i.alignmentVerticalItems || i.alignmentHorizontalItems) &&
            void 0 === i.alignmentTitle &&
            (i.alignmentTitle = h),
          void 0 !== i.properties.orientation &&
            (void 0 === i.orientationItems && (i.orientationItems = T),
            void 0 === i.orientationTitle && (i.orientationTitle = w)),
          void 0 !== i.properties.borderWidth &&
            void 0 === i.borderWidthItems &&
            (i.borderWidthItems = m),
          i
        )
      }
      function k(e, t) {
        return {
          propType: 'twoColors',
          properties: e,
          noAlpha1: !1,
          noAlpha2: !1,
          ...t,
        }
      }
      function L(e, t) {
        return {
          propType: 'optionalTwoColors',
          properties: e,
          noAlpha1: !1,
          noAlpha2: !1,
          ...t,
        }
      }
      function S(e, t) {
        return { propType: 'coordinates', properties: e, ...t }
      }
      function E(e, t) {
        return { propType: 'selectionCoordinates', properties: e, ...t }
      }
      function I(e, t) {
        return { propType: 'range', properties: e, ...t }
      }
      function A(e, t) {
        return { propType: 'transparency', properties: e, ...t }
      }
      function C(e, t) {
        return { propType: 'symbol', properties: e, ...t }
      }
      function O(e, t) {
        return { propType: 'session', properties: e, ...t }
      }
      function z(e, t) {
        return { propType: 'image', properties: e, ...t }
      }
      function H(e, t) {
        return { propType: 'emoji', properties: e, ...t }
      }
      function R(e, t) {
        return { propType: 'studyInputs', properties: e, ...t }
      }
      var x = i(64147)
      function W(e, t, i, r) {
        return {
          id: t,
          title: i,
          visible: r,
          groupType: 'general',
          definitions: new x.WatchedValue(e),
        }
      }
      function M(e, t, i, r, o, n) {
        return {
          id: r,
          title: o,
          visible: n,
          groupType: 'checkableListOptions',
          checked: t,
          definitions: new x.WatchedValue(i),
          checkableListOptions: e,
        }
      }
      function N(e, t, i) {
        return {
          id: t,
          title: i,
          groupType: 'leveledLines',
          definitions: new x.WatchedValue(e),
        }
      }
      var _ = i(23351)
      function Y(e, t, i) {
        const r = new Map(),
          o = void 0 !== t ? t[0] : (e) => e,
          n = void 0 !== t ? (void 0 !== t[1] ? t[1] : t[0]) : (e) => e,
          s = {
            value: () => o(e.value()),
            setValue: (t) => {
              e.setValue?.(n(t))
            },
            subscribe: (t, i) => {
              const o = () => {
                i(s)
              }
              let n = r.get(t)
              void 0 === n
                ? ((n = new Map()), n.set(i, o), r.set(t, n))
                : n.set(i, o),
                e.subscribe(o)
            },
            unsubscribe: (t, i) => {
              const o = r.get(t)
              if (void 0 !== o) {
                const t = o.get(i)
                void 0 !== t && (e.unsubscribe(t), o.delete(i))
              }
            },
            unsubscribeAll: (t) => {
              const i = r.get(t)
              void 0 !== i &&
                (i.forEach((t, i) => {
                  e.unsubscribe(t)
                }),
                i.clear())
            },
          }
        return i && (s.destroy = () => i()), s
      }
      function F(e, t, i, r) {
        const o = Y(t, r),
          n = void 0 !== r ? (void 0 !== r[1] ? r[1] : r[0]) : (e) => e
        return (o.setValue = (r) => e.setWatchedValue(t, n(r), i)), o
      }
      function G(e, t) {
        return ((e, t, i, r) => {
          const o = new Map(),
            n = {
              subscribe: (i, r) => {
                const n = (e) => i(t(e))
                o.set(i, n), e.subscribe(n, r)
              },
              unsubscribe: (t) => {
                if (t) {
                  const i = o.get(t)
                  i && (e.unsubscribe(i), o.delete(t))
                } else o.clear(), e.unsubscribe()
              },
              value: () => t(e.value()),
            }
          return Y(n, i, r)
        })(
          e,
          (e) => e,
          t,
          () => e.release(),
        )
      }
      function j(e, t) {
        const i = (0, _.makeProxyDefinitionProperty)(t.weakReference())
        return (i.setValue = (t) => e.setPriceScaleSelectionStrategy(t)), i
      }
      function B(e, t, i, r) {
        const o = (0, _.makeProxyDefinitionProperty)(t.weakReference())
        return (
          (o.setValue = (t) => {
            const o = { lockScale: t }
            e.setPriceScaleMode(o, i, r)
          }),
          o
        )
      }
      function U(e, t, i, r) {
        const o = (0, _.makeProxyDefinitionProperty)(t.weakReference(), r)
        return (
          (o.setValue = (r) => {
            e.setScaleRatioProperty(t, r, i)
          }),
          o
        )
      }
      var q = i(24377),
        J = i(19063),
        K = i(84425)
      function Q(e, t) {
        if ((0, J.isHexColor)(e)) {
          const i = (0, q.parseRgb)(e)
          return (0, q.rgbaToString)((0, q.rgba)(i, (100 - t) / 100))
        }
        return e
      }
      function X(e, t, i, r, o) {
        let n
        if (null !== i) {
          const e = (0, K.combineProperty)(
            Q,
            t.weakReference(),
            i.weakReference(),
          )
          n = (0, _.makeProxyDefinitionProperty)(e.ownership())
        } else
          n = (0, _.makeProxyDefinitionProperty)(t.weakReference(), [
            () => Q(t.value(), 0),
            (e) => e,
          ])
        return (
          (n.setValue = (i) => {
            o && e.beginUndoMacro(r),
              e.setProperty(t, i, r),
              o && e.endUndoMacro()
          }),
          n
        )
      }
      function Z(e, t, i, r, o, n) {
        const s = [
          ((p = i),
          (l = t),
          (e) => {
            const t = p(l)
            if (e === l.value() && null !== t) {
              const e = t.ticker || t.full_name
              if (e) return e
            }
            return e
          }),
          (e) => e,
        ]
        var p, l
        const a = (0, _.convertToDefinitionProperty)(e, t, o, s)
        n && (a.setValue = n)
        const c = new Map()
        ;(a.subscribe = (e, i) => {
          const r = (e) => {
            i(a)
          }
          c.set(i, r), t.subscribe(e, r)
        }),
          (a.unsubscribe = (e, i) => {
            const r = c.get(i)
            r && (t.unsubscribe(e, r), c.delete(i))
          })
        const u = {}
        return (
          r.subscribe(u, () => {
            c.forEach((e, t) => {
              t(a)
            })
          }),
          (a.destroy = () => {
            r.unsubscribeAll(u), c.clear()
          }),
          a
        )
      }
      function $(e) {
        return Object.hasOwn(e, 'propType')
      }
      function ee(e) {
        return Object.hasOwn(e, 'groupType')
      }
      function te(e) {
        return 'line' === e.propType
      }
      function ie(e) {
        return 'color' === e.propType
      }
      function re(e) {
        return 'twoColors' === e.propType
      }
      function oe(e) {
        return 'options' === e.propType
      }
      function ne(e) {
        return 'checkableListOptions' === e.groupType
      }
      function se(e) {
        e.forEach((e) => {
          if ($(e)) {
            Object.keys(e.properties).forEach((t) => {
              const i = e.properties[t]
              void 0 !== i && void 0 !== i.destroy && i.destroy()
            })
          } else se(e.definitions.value()), e.visible?.destroy()
        })
      }
    },
  },
])
