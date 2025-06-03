;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9637],
  {
    98361: (e, t, r) => {
      r.r(t), r.d(t, { createPropertyPage: () => n })
      var i = r(650802)
      function n(e, t, r, n = null) {
        var o
        const s = {
          id: t,
          title: r,
          definitions: new i.WatchedValue(e.definitions),
          visible:
            null !== (o = e.visible) && void 0 !== o
              ? o
              : new i.WatchedValue(!0).readonly(),
        }
        return null !== n && (s.icon = n), s
      }
    },
    849303: (e, t, r) => {
      r.d(t, {
        convertToInt: () => o,
        floor: () => n,
        limitedPrecision: () => s,
      })
      var i = r(481045)
      function n(e) {
        return Math.floor(e)
      }
      function o(e) {
        return Number.parseInt(String(e))
      }
      function s(e) {
        const t = new i.LimitedPrecisionNumericFormatter(e)
        return (e) => {
          if (null === e) return e
          const r = t.parse(t.format(e))
          return r.res ? r.value : null
        }
      }
    },
    444474: (e, t, r) => {
      r.d(t, {
        convertToDefinitionProperty: () => o,
        makeProxyDefinitionProperty: () => n,
      })
      var i = r(32133)
      function n(e, t, r) {
        const i = new Map(),
          n = void 0 !== t ? t[0] : (e) => e,
          o = void 0 !== t ? (void 0 !== t[1] ? t[1] : t[0]) : (e) => e,
          s = {
            value: () => n(e.value()),
            setValue: (t) => {
              e.setValue(o(t))
            },
            subscribe: (t, r) => {
              const n = (e) => {
                r(s)
              }
              i.set(r, n), e.subscribe(t, n)
            },
            unsubscribe: (t, r) => {
              const n = i.get(r)
              n && (e.unsubscribe(t, n), i.delete(r))
            },
            unsubscribeAll: (t) => {
              e.unsubscribeAll(t), i.clear()
            },
            destroy: () => {
              e.release(), null == r || r()
            },
          }
        return s
      }
      function o(e, t, r, o, s, p, l) {
        const u = n(t.weakReference(), o, p),
          c = void 0 !== o ? (void 0 !== o[1] ? o[1] : o[0]) : (e) => e,
          a = null != s ? s : (i) => e.setProperty(t, c(i), r)
        return (
          (u.setValue = (e) => {
            var t
            l &&
              (0, i.trackEvent)(
                l.category,
                l.event,
                null === (t = l.label) || void 0 === t ? void 0 : t.call(l, e),
              ),
              a(e)
          }),
          u
        )
      }
    },
    52167: (e, t, r) => {
      r.d(t, { createLinePropertyDefinition: () => l })
      var i = r(243939),
        n = r(549696)
      const o = [n.LINESTYLE_SOLID, n.LINESTYLE_DOTTED, n.LINESTYLE_DASHED],
        s = [1, 2, 3, 4],
        p = [i.LineEnd.Normal, i.LineEnd.Arrow]
      function l(e, t) {
        const r = { propType: 'line', properties: e, ...t }
        return (
          void 0 !== r.properties.style && (r.styleValues = o),
          void 0 !== r.properties.width && (r.widthValues = s),
          (void 0 === r.properties.leftEnd &&
            void 0 === r.properties.rightEnd) ||
            void 0 !== r.endsValues ||
            (r.endsValues = p),
          void 0 !== r.properties.value &&
            void 0 === r.valueType &&
            (r.valueType = 1),
          r
        )
      }
    },
    308954: (e, t, r) => {
      function i(e, t) {
        return { propType: 'checkable', properties: e, ...t }
      }
      function n(e, t, r) {
        return {
          propType: 'checkableSet',
          properties: e,
          childrenDefinitions: r,
          ...t,
        }
      }
      function o(e, t) {
        return { propType: 'color', properties: e, noAlpha: !1, ...t }
      }
      r.d(t, {
        convertFromReadonlyWVToDefinitionProperty: () => H,
        convertFromWVToDefinitionProperty: () => N,
        convertToDefinitionProperty: () => z.convertToDefinitionProperty,
        createCheckablePropertyDefinition: () => i,
        createCheckableSetPropertyDefinition: () => n,
        createColorPropertyDefinition: () => o,
        createCoordinatesPropertyDefinition: () => k,
        createEmojiPropertyDefinition: () => O,
        createLeveledLinePropertyDefinition: () => c,
        createLinePropertyDefinition: () => s.createLinePropertyDefinition,
        createNumberPropertyDefinition: () => a,
        createOptionalTwoColorsPropertyDefinition: () => S,
        createOptionsPropertyDefinition: () => d,
        createPropertyDefinitionsGeneralGroup: () => x,
        createPropertyDefinitionsLeveledLinesGroup: () => W,
        createRangePropertyDefinition: () => E,
        createSelectionCoordinatesPropertyDefinition: () => L,
        createSessionPropertyDefinition: () => C,
        createStudyInputsPropertyDefinition: () => A,
        createSymbolPropertyDefinition: () => I,
        createTextPropertyDefinition: () => h,
        createTransparencyPropertyDefinition: () => V,
        createTwoColorsPropertyDefinition: () => w,
        createTwoOptionsPropertyDefinition: () => f,
        destroyDefinitions: () => te,
        getColorDefinitionProperty: () => B,
        getLockPriceScaleDefinitionProperty: () => Y,
        getPriceScaleSelectionStrategyDefinitionProperty: () => _,
        getScaleRatioDefinitionProperty: () => G,
        getSymbolDefinitionProperty: () => J,
        isCheckableListOptionsDefinition: () => ee,
        isColorDefinition: () => Z,
        isLineDefinition: () => X,
        isOptionsDefinition: () => $,
        isPropertyDefinition: () => K,
        isPropertyDefinitionsGroup: () => Q,
        makeProxyDefinitionProperty: () => z.makeProxyDefinitionProperty,
      })
      var s = r(52167),
        p = r(549696)
      const l = [p.LINESTYLE_SOLID, p.LINESTYLE_DOTTED, p.LINESTYLE_DASHED],
        u = [1, 2, 3, 4]
      function c(e, t) {
        const r = { propType: 'leveledLine', properties: e, ...t }
        return (
          void 0 !== r.properties.style && (r.styleValues = l),
          void 0 !== r.properties.width && (r.widthValues = u),
          r
        )
      }
      function a(e, t) {
        return { propType: 'number', properties: e, type: 1, ...t }
      }
      function d(e, t) {
        return { propType: 'options', properties: e, ...t }
      }
      function f(e, t) {
        return { propType: 'twoOptions', properties: e, ...t }
      }
      var y = r(609838)
      const v = [
          {
            id: 'bottom',
            value: 'bottom',
            title: y.t(null, void 0, r(865994)),
          },
          {
            id: 'middle',
            value: 'middle',
            title: y.t(null, void 0, r(876476)),
          },
          { id: 'top', value: 'top', title: y.t(null, void 0, r(691757)) },
        ],
        b = [
          { id: 'left', value: 'left', title: y.t(null, void 0, r(619286)) },
          { id: 'center', value: 'center', title: y.t(null, void 0, r(72171)) },
          { id: 'right', value: 'right', title: y.t(null, void 0, r(221141)) },
        ],
        P = [
          {
            id: 'horizontal',
            value: 'horizontal',
            title: y.t(null, void 0, r(577405)),
          },
          {
            id: 'vertical',
            value: 'vertical',
            title: y.t(null, void 0, r(944085)),
          },
        ],
        D = [10, 11, 12, 14, 16, 20, 24, 28, 32, 40].map((e) => ({
          title: String(e),
          value: e,
        })),
        T = [1, 2, 3, 4],
        m = y.t(null, void 0, r(792960)),
        g = y.t(null, void 0, r(390581))
      function h(e, t) {
        const r = {
          propType: 'text',
          properties: e,
          ...t,
          isEditable: t.isEditable || !1,
        }
        return (
          void 0 !== r.properties.size &&
            void 0 === r.sizeItems &&
            (r.sizeItems = D),
          void 0 !== r.properties.alignmentVertical &&
            void 0 === r.alignmentVerticalItems &&
            (r.alignmentVerticalItems = v),
          void 0 !== r.properties.alignmentHorizontal &&
            void 0 === r.alignmentHorizontalItems &&
            (r.alignmentHorizontalItems = b),
          (r.alignmentVerticalItems || r.alignmentHorizontalItems) &&
            void 0 === r.alignmentTitle &&
            (r.alignmentTitle = m),
          void 0 !== r.properties.orientation &&
            (void 0 === r.orientationItems && (r.orientationItems = P),
            void 0 === r.orientationTitle && (r.orientationTitle = g)),
          void 0 !== r.properties.borderWidth &&
            void 0 === r.borderWidthItems &&
            (r.borderWidthItems = T),
          r
        )
      }
      function w(e, t) {
        return {
          propType: 'twoColors',
          properties: e,
          noAlpha1: !1,
          noAlpha2: !1,
          ...t,
        }
      }
      function S(e, t) {
        return {
          propType: 'optionalTwoColors',
          properties: e,
          noAlpha1: !1,
          noAlpha2: !1,
          ...t,
        }
      }
      function k(e, t) {
        return { propType: 'coordinates', properties: e, ...t }
      }
      function L(e, t) {
        return { propType: 'selectionCoordinates', properties: e, ...t }
      }
      function E(e, t) {
        return { propType: 'range', properties: e, ...t }
      }
      function V(e, t) {
        return { propType: 'transparency', properties: e, ...t }
      }
      function I(e, t) {
        return { propType: 'symbol', properties: e, ...t }
      }
      function C(e, t) {
        return { propType: 'session', properties: e, ...t }
      }
      function O(e, t) {
        return { propType: 'emoji', properties: e, ...t }
      }
      function A(e, t) {
        return { propType: 'studyInputs', properties: e, ...t }
      }
      var R = r(650802)
      function x(e, t, r, i) {
        return {
          id: t,
          title: r,
          visible: i,
          groupType: 'general',
          definitions: new R.WatchedValue(e),
        }
      }
      function W(e, t, r) {
        return {
          id: t,
          title: r,
          groupType: 'leveledLines',
          definitions: new R.WatchedValue(e),
        }
      }
      var z = r(444474)
      function M(e, t, r) {
        const i = new Map(),
          n = void 0 !== t ? t[0] : (e) => e,
          o = void 0 !== t ? (void 0 !== t[1] ? t[1] : t[0]) : (e) => e,
          s = {
            value: () => n(e.value()),
            setValue: (t) => {
              var r
              null === (r = e.setValue) || void 0 === r || r.call(e, o(t))
            },
            subscribe: (t, r) => {
              const n = () => {
                r(s)
              }
              let o = i.get(t)
              void 0 === o
                ? ((o = new Map()), o.set(r, n), i.set(t, o))
                : o.set(r, n),
                e.subscribe(n)
            },
            unsubscribe: (t, r) => {
              const n = i.get(t)
              if (void 0 !== n) {
                const t = n.get(r)
                void 0 !== t && (e.unsubscribe(t), n.delete(r))
              }
            },
            unsubscribeAll: (t) => {
              const r = i.get(t)
              void 0 !== r &&
                (r.forEach((t, r) => {
                  e.unsubscribe(t)
                }),
                r.clear())
            },
          }
        return r && (s.destroy = () => r()), s
      }
      function N(e, t, r, i) {
        const n = M(t, i),
          o = void 0 !== i ? (void 0 !== i[1] ? i[1] : i[0]) : (e) => e
        return (n.setValue = (i) => e.setWatchedValue(t, o(i), r)), n
      }
      function H(e, t) {
        return ((e, t, r, i) => {
          const n = new Map()
          return M(
            {
              subscribe: (r, i) => {
                const o = (e) => r(t(e))
                n.set(r, o), e.subscribe(o, i)
              },
              unsubscribe: (t) => {
                if (t) {
                  const r = n.get(t)
                  r && (e.unsubscribe(r), n.delete(t))
                } else n.clear(), e.unsubscribe()
              },
              value: () => t(e.value()),
            },
            r,
            i,
          )
        })(
          e,
          (e) => e,
          t,
          () => e.release(),
        )
      }
      function _(e, t) {
        const r = (0, z.makeProxyDefinitionProperty)(t.weakReference())
        return (r.setValue = (t) => e.setPriceScaleSelectionStrategy(t)), r
      }
      function Y(e, t, r, i) {
        const n = (0, z.makeProxyDefinitionProperty)(t.weakReference())
        return (
          (n.setValue = (t) => {
            const n = { lockScale: t }
            e.setPriceScaleMode(n, r, i)
          }),
          n
        )
      }
      function G(e, t, r, i) {
        const n = (0, z.makeProxyDefinitionProperty)(t.weakReference(), i)
        return (
          (n.setValue = (i) => {
            e.setScaleRatioProperty(t, i, r)
          }),
          n
        )
      }
      var j = r(724377),
        F = r(32240),
        U = r(648067)
      function q(e, t) {
        if ((0, F.isHexColor)(e)) {
          const r = (0, j.parseRgb)(e)
          return (0, j.rgbaToString)((0, j.rgba)(r, (100 - t) / 100))
        }
        return e
      }
      function B(e, t, r, i, n) {
        let o
        if (null !== r) {
          const e = (0, U.combineProperty)(
            q,
            t.weakReference(),
            r.weakReference(),
          )
          o = (0, z.makeProxyDefinitionProperty)(e.ownership())
        } else
          o = (0, z.makeProxyDefinitionProperty)(t.weakReference(), [
            () => q(t.value(), 0),
            (e) => e,
          ])
        return (
          (o.setValue = (r) => {
            n && e.beginUndoMacro(i),
              e.setProperty(t, r, i),
              n && e.endUndoMacro()
          }),
          o
        )
      }
      function J(e, t, r, i, n, o) {
        const s = [
          ((p = r),
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
        const u = (0, z.convertToDefinitionProperty)(e, t, n, s)
        o && (u.setValue = o)
        const c = new Map()
        ;(u.subscribe = (e, r) => {
          const i = (e) => {
            r(u)
          }
          c.set(r, i), t.subscribe(e, i)
        }),
          (u.unsubscribe = (e, r) => {
            const i = c.get(r)
            i && (t.unsubscribe(e, i), c.delete(r))
          })
        const a = {}
        return (
          i.subscribe(a, () => {
            c.forEach((e, t) => {
              t(u)
            })
          }),
          (u.destroy = () => {
            i.unsubscribeAll(a), c.clear()
          }),
          u
        )
      }
      function K(e) {
        return Object.hasOwn(e, 'propType')
      }
      function Q(e) {
        return Object.hasOwn(e, 'groupType')
      }
      function X(e) {
        return 'line' === e.propType
      }
      function Z(e) {
        return 'color' === e.propType
      }
      function $(e) {
        return 'options' === e.propType
      }
      function ee(e) {
        return 'checkableListOptions' === e.groupType
      }
      function te(e) {
        e.forEach((e) => {
          var t
          if (K(e)) {
            Object.keys(e.properties).forEach((t) => {
              const r = e.properties[t]
              void 0 !== r && void 0 !== r.destroy && r.destroy()
            })
          } else
            te(e.definitions.value()),
              null === (t = e.visible) || void 0 === t || t.destroy()
        })
      }
    },
  },
])
