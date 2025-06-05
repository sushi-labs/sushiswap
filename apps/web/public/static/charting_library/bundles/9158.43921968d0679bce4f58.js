;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9158],
  {
    805912: (t) => {
      t.exports = {
        'overlap-manager-container': 'overlap-manager-container-txdnDvZo',
        compact: 'compact-txdnDvZo',
        'on-chart': 'on-chart-txdnDvZo',
        'toast-portal': 'toast-portal-txdnDvZo',
        added: 'added-txdnDvZo',
        'no-overflow': 'no-overflow-txdnDvZo',
        wrapper: 'wrapper-txdnDvZo',
        'location-bottom-left': 'location-bottom-left-txdnDvZo',
        'location-bottom-right': 'location-bottom-right-txdnDvZo',
        container: 'container-txdnDvZo',
        hidden: 'hidden-txdnDvZo',
        'reset-duration': 'reset-duration-txdnDvZo',
      }
    },
    813550: (t, e, o) => {
      o.d(e, { useForceUpdate: () => i })
      var n = o(50959)
      const i = () => {
        const [, t] = (0, n.useReducer)((t) => t + 1, 0)
        return t
      }
    },
    525388: (t, e, o) => {
      o.d(e, { useMergedRefs: () => s })
      var n = o(50959),
        i = o(273388)
      function s(t) {
        return (0, n.useCallback)((0, i.mergeRefs)(t), t)
      }
    },
    457927: (t, e, o) => {
      o.d(e, { useRefsMap: () => i })
      var n = o(50959)
      function i() {
        const t = (0, n.useRef)(new Map()),
          e = (0, n.useCallback)(
            (e) => (o) => {
              null !== o ? t.current.set(e, o) : t.current.delete(e)
            },
            [t],
          )
        return [t, e]
      }
    },
    682925: (t, e, o) => {
      o.d(e, { Slot: () => i, SlotContext: () => s })
      var n = o(50959)
      class i extends n.Component {
        shouldComponentUpdate() {
          return !1
        }
        render() {
          return n.createElement('div', {
            style: { position: 'fixed', zIndex: 150, left: 0, top: 0 },
            ref: this.props.reference,
          })
        }
      }
      const s = n.createContext(null)
    },
    65160: (t, e, o) => {
      function n(t) {
        const { paddingTop: e, paddingBottom: o } = window.getComputedStyle(t)
        return [e, o].reduce(
          (t, e) => t - Number((e || '').replace('px', '')),
          t.clientHeight,
        )
      }
      function i(t, e = !1) {
        const o = getComputedStyle(t),
          n = [o.height]
        return (
          'border-box' !== o.boxSizing &&
            n.push(
              o.paddingTop,
              o.paddingBottom,
              o.borderTopWidth,
              o.borderBottomWidth,
            ),
          e && n.push(o.marginTop, o.marginBottom),
          n.reduce((t, e) => t + (Number.parseFloat(e) || 0), 0)
        )
      }
      function s(t, e = !1) {
        const o = getComputedStyle(t),
          n = [o.width]
        return (
          'border-box' !== o.boxSizing &&
            n.push(
              o.paddingLeft,
              o.paddingRight,
              o.borderLeftWidth,
              o.borderRightWidth,
            ),
          e && n.push(o.marginLeft, o.marginRight),
          n.reduce((t, e) => t + (Number.parseFloat(e) || 0), 0)
        )
      }
      o.d(e, {
        contentHeight: () => n,
        outerHeight: () => i,
        outerWidth: () => s,
      })
    },
    273388: (t, e, o) => {
      function n(t) {
        return (e) => {
          t.forEach((t) => {
            'function' == typeof t ? t(e) : null != t && (t.current = e)
          })
        }
      }
      function i(t) {
        return n([t])
      }
      o.d(e, { isomorphicRef: () => i, mergeRefs: () => n })
    },
    801808: (t, e, o) => {
      o.d(e, { OverlapManager: () => s, getRootOverlapManager: () => a })
      var n = o(650151)
      class i {
        constructor() {
          this._storage = []
        }
        add(t) {
          this._storage.push(t)
        }
        remove(t) {
          this._storage = this._storage.filter((e) => t !== e)
        }
        has(t) {
          return this._storage.includes(t)
        }
        getItems() {
          return this._storage
        }
      }
      class s {
        constructor(t = document) {
          ;(this._storage = new i()),
            (this._windows = new Map()),
            (this._index = 0),
            (this._document = t),
            (this._container = t.createDocumentFragment())
        }
        setContainer(t) {
          const e = this._container,
            o = null === t ? this._document.createDocumentFragment() : t
          !((t, e) => {
            Array.from(t.childNodes).forEach((t) => {
              t.nodeType === Node.ELEMENT_NODE && e.appendChild(t)
            })
          })(e, o),
            (this._container = o)
        }
        registerWindow(t) {
          this._storage.has(t) || this._storage.add(t)
        }
        ensureWindow(t, e = { position: 'fixed', direction: 'normal' }) {
          const o = this._windows.get(t)
          if (void 0 !== o) return o
          this.registerWindow(t)
          const n = this._document.createElement('div')
          if (
            ((n.style.position = e.position),
            (n.style.zIndex = this._index.toString()),
            (n.dataset.id = t),
            void 0 !== e.index)
          ) {
            const t = this._container.childNodes.length
            if (e.index >= t) this._container.appendChild(n)
            else if (e.index <= 0)
              this._container.insertBefore(n, this._container.firstChild)
            else {
              const t = this._container.childNodes[e.index]
              this._container.insertBefore(n, t)
            }
          } else
            'reverse' === e.direction
              ? this._container.insertBefore(n, this._container.firstChild)
              : this._container.appendChild(n)
          return this._windows.set(t, n), ++this._index, n
        }
        unregisterWindow(t) {
          this._storage.remove(t)
          const e = this._windows.get(t)
          void 0 !== e &&
            (null !== e.parentElement && e.parentElement.removeChild(e),
            this._windows.delete(t))
        }
        getZindex(t) {
          const e = this.ensureWindow(t)
          return Number.parseInt(e.style.zIndex || '0')
        }
        moveToTop(t) {
          if (this.getZindex(t) !== this._index) {
            this.ensureWindow(t).style.zIndex = (++this._index).toString()
          }
        }
        removeWindow(t) {
          this.unregisterWindow(t)
        }
      }
      const r = new WeakMap()
      function a(t = document) {
        const e = t.getElementById('overlap-manager-root')
        if (null !== e) return (0, n.ensureDefined)(r.get(e))
        {
          const e = new s(t),
            o = ((t) => {
              const e = t.createElement('div')
              return (
                (e.style.position = 'absolute'),
                (e.style.zIndex = (150).toString()),
                (e.style.top = '0px'),
                (e.style.left = '0px'),
                (e.id = 'overlap-manager-root'),
                e
              )
            })(t)
          return r.set(o, e), e.setContainer(o), t.body.appendChild(o), e
        }
      }
    },
    585938: (t, e, o) => {
      o.d(e, { useForceUpdate: () => n.useForceUpdate })
      var n = o(813550)
    },
    813113: (t, e, o) => {
      o.d(e, { Portal: () => d, PortalContext: () => c })
      var n = o(50959),
        i = o(500962),
        s = o(925931),
        r = o(801808),
        a = o(682925)
      class d extends n.PureComponent {
        constructor() {
          super(...arguments), (this._uuid = (0, s.nanoid)())
        }
        componentWillUnmount() {
          this._manager().removeWindow(this._uuid)
        }
        render() {
          const t = this._manager().ensureWindow(
            this._uuid,
            this.props.layerOptions,
          )
          return (
            (t.style.top = this.props.top || ''),
            (t.style.bottom = this.props.bottom || ''),
            (t.style.left = this.props.left || ''),
            (t.style.right = this.props.right || ''),
            (t.style.pointerEvents = this.props.pointerEvents || ''),
            this.props.className && t.classList.add(this.props.className),
            this.props['aria-hidden'] && t.setAttribute('aria-hidden', 'true'),
            i.createPortal(
              n.createElement(c.Provider, { value: this }, this.props.children),
              t,
            )
          )
        }
        moveToTop() {
          this._manager().moveToTop(this._uuid)
        }
        _manager() {
          return null === this.context
            ? (0, r.getRootOverlapManager)()
            : this.context
        }
      }
      d.contextType = a.SlotContext
      const c = n.createContext(null)
    },
    753327: (t, e, o) => {
      o.d(e, { Slot: () => n.Slot, SlotContext: () => n.SlotContext })
      var n = o(682925)
    },
    106056: (t, e, o) => {
      var n, i, s
      o.d(e, {
        CloseTrigger: () => n,
        ToastAnimationStage: () => i,
        ToastPriority: () => s,
      }),
        ((t) => {
          ;(t.Swipe = 'swipe'), (t.Click = 'click')
        })(n || (n = {})),
        ((t) => {
          ;(t[(t.Add = 0)] = 'Add'),
            (t[(t.Remove = 1)] = 'Remove'),
            (t[(t.None = 2)] = 'None')
        })(i || (i = {})),
        ((t) => {
          ;(t[(t.Low = 0)] = 'Low'),
            (t[(t.Medium = 1)] = 'Medium'),
            (t[(t.High = 2)] = 'High')
        })(s || (s = {}))
    },
    529158: (t, e, o) => {
      o.d(e, { ToastsLayer: () => L })
      var n,
        i = o(50959),
        s = o(500962),
        r = o(189904),
        a = o(801808),
        d = o(106056)
      class c {
        constructor(t) {
          ;(this._animationStage = d.ToastAnimationStage.Add),
            (this._keys = new Map()),
            (this._element = null),
            (this.render = (t) => this._render(t)),
            (this.remove = (t) => {
              const e = this.getStaticData()
              return this._currentToastsLayer.removeToast(this).then(() => {
                e.onRemoveEnd && e.onRemoveEnd(t)
              })
            })
          const {
            priority: e,
            origin: o,
            currentLayer: n,
            onLayerChange: i,
            render: s,
            onMouseOver: r,
            onMouseOut: a,
            swipeToCloseDirection: c,
            onRemoveEnd: u,
          } = t
          ;(this._staticData = Object.freeze({
            priority: e,
            origin: o,
            onLayerChange: i,
            swipeToCloseDirection: c,
            onRemoveEnd: u,
            onMouseOver: r,
            onMouseOut: a,
          })),
            (this._currentToastsLayer = n || o),
            (this._render = s)
        }
        getStaticData() {
          return this._staticData
        }
        migrate(t) {
          ;(this._currentToastsLayer = t),
            (this._animationStage = d.ToastAnimationStage.Add)
        }
        getCurrentLayer() {
          return this._currentToastsLayer
        }
        isForeign() {
          return this._staticData.origin !== this._currentToastsLayer
        }
        getAnimationStage() {
          return this._animationStage
        }
        setAnimationStage(t) {
          this._animationStage = t
        }
        setKey(t, e) {
          this._keys.set(t, e)
        }
        getKey(t = this._currentToastsLayer) {
          return this._keys.get(t)
        }
        getElement() {
          return this._element
        }
        setElement(t) {
          this._element = t
        }
      }
      function u(t, e) {
        const o = (0, i.useRef)({ x: 0, y: 0 }),
          [s, r] = (0, i.useState)(n.Unset)
        return [
          s,
          {
            onTouchStart: (0, i.useCallback)((t) => {
              o.current = {
                x: t.changedTouches[0].clientX,
                y: t.changedTouches[0].clientY,
              }
            }, []),
            onTouchEnd: (0, i.useCallback)(
              (i) => {
                r(
                  ((t, e, o, i, s) => {
                    const r = t.currentTarget,
                      a = Math.abs(o.x - e.x),
                      d = Math.abs(o.y - e.y),
                      c = r.offsetWidth * i,
                      u = r.offsetHeight * s
                    return a > d && a > c
                      ? o.x > e.x
                        ? n.Right
                        : n.Left
                      : d > u
                        ? o.y > e.y
                          ? n.Down
                          : n.Up
                        : n.Unset
                  })(
                    i,
                    o.current,
                    {
                      x: i.changedTouches[0].clientX,
                      y: i.changedTouches[0].clientY,
                    },
                    t,
                    e,
                  ),
                )
              },
              [r, o, t, e],
            ),
          },
        ]
      }
      !((t) => {
        ;(t.Right = 'right'),
          (t.Left = 'left'),
          (t.Up = 'up'),
          (t.Down = 'down'),
          (t.Unset = 'unset')
      })(n || (n = {}))
      var h = o(710263),
        l = o(497754),
        g = o(813113),
        p = o(753327),
        m = o(585938),
        _ = o(65160),
        v = o(457927),
        y = o(525388),
        f = o(805912)
      function T(t) {
        const {
            toasts: e,
            suggestedLayout: o,
            location: n,
            manager: s,
            layer: r,
          } = t,
          a = (0, m.useForceUpdate)(),
          d = (0, i.useRef)(new Map()),
          [c, u] = (0, v.useRefsMap)()
        return (
          (0, i.useLayoutEffect)(() => {
            d.current.forEach((t, o) => {
              e.includes(o) || d.current.delete(o)
            }),
              e.forEach((t) => {
                if (!c.current.has(t)) return
                const e = (0, _.outerHeight)(c.current.get(t))
                d.current.set(t, e)
              })
          }),
          i.createElement(
            p.SlotContext.Provider,
            { value: s },
            e.map((t, s) =>
              i.createElement(x, {
                key: w(t, s, r),
                toast: t,
                toasts: e,
                layer: r,
                suggestedLayout: o,
                location: n,
                forceRender: a,
                reference: u(t),
                toastsHeightsMapRef: d,
              }),
            ),
          )
        )
      }
      function x(t) {
        const {
            toast: e,
            toasts: o,
            layer: s,
            suggestedLayout: r,
            location: a,
            forceRender: c,
            reference: p,
            toastsHeightsMapRef: m,
          } = t,
          _ = (0, i.useRef)(null),
          v = (0, y.useMergedRefs)([_, p]),
          T = e.getStaticData().swipeToCloseDirection,
          [x, w] = u(0.2, 0.7),
          C = e.getAnimationStage(),
          L = C !== d.ToastAnimationStage.None,
          S = ((t) => {
            const {
                animationStage: e,
                isHidden: o,
                toasts: n,
                toast: s,
                toastsHeightsMapRef: r,
                suggestedLayout: a,
                swipeDirection: c,
              } = t,
              u = (0, i.useRef)(!1),
              g = c === s.getStaticData().swipeToCloseDirection,
              p = g ? ((0, h.isRtl)() ? '100%' : '-100%') : 0,
              m = e === d.ToastAnimationStage.Add,
              _ = e === d.ToastAnimationStage.Remove
            let v = 0,
              y = '',
              T = !1,
              x = !1
            if (!g) {
              n.slice(n.indexOf(s) + 1, n.length).forEach((t) => {
                const e = r.current.get(t)
                e &&
                  t.getAnimationStage() !== d.ToastAnimationStage.None &&
                  ((v += e),
                  t.getAnimationStage() === d.ToastAnimationStage.Add
                    ? (T = !0)
                    : t.getAnimationStage() === d.ToastAnimationStage.Remove &&
                      (x = !0))
              }),
                (y = m || _ ? `calc(100% + ${v}px)` : `${v}px`)
            }
            const w = !m && !_ && !x && u.current,
              C = T || w,
              L = l(
                f.container,
                o && f.hidden,
                C && f['reset-duration'],
                m && f.added,
                'compact' === a && f.compact,
              )
            return (
              (0, i.useLayoutEffect)(() => {
                u.current = x
              }),
              {
                style: { transform: `translateX(${p}) translateY(${y})` },
                className: L,
              }
            )
          })({
            animationStage: C,
            isHidden: L,
            toasts: o,
            toast: e,
            toastsHeightsMapRef: m,
            suggestedLayout: r,
            swipeDirection: x,
          })
        return (
          (0, i.useLayoutEffect)(() => {
            if (
              e.getCurrentLayer() !== s ||
              null === _.current ||
              C !== d.ToastAnimationStage.Add
            )
              return
            const t = e.getElement()
            null === t || t !== _.current
              ? (e.setElement(_.current), c())
              : (e.setAnimationStage(d.ToastAnimationStage.None), c())
          }),
          (0, i.useEffect)(() => {
            x === T && x !== n.Unset && e.remove(d.CloseTrigger.Swipe)
          }, [x, e]),
          i.createElement(
            g.Portal,
            {
              layerOptions: { position: 'relative' },
              className: f['toast-portal'],
              'aria-hidden': !0,
            },
            i.createElement(
              'div',
              {
                className: l(
                  f.wrapper,
                  a && f[`location-${a}`],
                  L && f['no-overflow'],
                ),
              },
              i.createElement(
                'div',
                {
                  onTouchStart: T ? w.onTouchStart : void 0,
                  onTouchEnd: T ? w.onTouchEnd : void 0,
                  onMouseOver: e.getStaticData().onMouseOver,
                  onMouseOut: e.getStaticData().onMouseOut,
                  ref: v,
                  ...S,
                },
                e.render({ onRemove: e.remove, suggestedLayout: r }),
              ),
            ),
          )
        )
      }
      function w(t, e, o) {
        return t.getKey(o) || e.toString(10)
      }
      const C = { position: 'fixed', bottom: '0', zIndex: 145 }
      class L {
        constructor(t, e, o = C, n, i) {
          ;(this._toasts = {
            [d.ToastPriority.Low]: [],
            [d.ToastPriority.Medium]: [],
            [d.ToastPriority.High]: [],
          }),
            (this._container = void 0 !== e ? e : document.body),
            (this._suggestedLayout = void 0 !== t ? t : 'loose'),
            (this._location = null != n ? n : 'bottom-left'),
            (this._manager = new a.OverlapManager(document)),
            (this._overlapManagerContainer = ((t, e = {}, o, n) => {
              const i = t.createElement('div')
              ;(i.dataset.role = 'toast-container'),
                i.classList.add(f['overlap-manager-container']),
                'compact' === o && i.classList.add(f.compact)
              n && i.classList.add(f['on-chart'])
              return E(i, { ...C, ...e }), i
            })(document, o, this._suggestedLayout, i)),
            this._manager.setContainer(this._overlapManagerContainer),
            this._container.appendChild(this._overlapManagerContainer),
            (this._detachedContainer = document.createElement('div'))
        }
        showToast(t) {
          const {
              render: e,
              priority: o = d.ToastPriority.Medium,
              index: i,
              origin: s = this,
              onLayerChange: r,
              onRemoveEnd: a,
              onMouseOver: u,
              onMouseOut: l,
            } = t,
            g = ((t) => {
              const e = (0, h.isRtl)() ? n.Right : n.Left
              return void 0 === t ? e : null !== t ? t : void 0
            })(t.swipeToCloseDirection),
            p = new c({
              priority: o,
              origin: s,
              currentLayer: this,
              render: e,
              onLayerChange: r,
              swipeToCloseDirection: g,
              onRemoveEnd: a,
              onMouseOver: u,
              onMouseOut: l,
            }),
            m = this._getNextKey()
          return (
            p.setKey(this, m),
            'compact' === this._suggestedLayout && o === d.ToastPriority.Low
              ? Promise.all(
                  this._toasts[d.ToastPriority.Low].map((t) =>
                    this.removeToast(t),
                  ),
                ).then(() => {
                  this._add(p, i), this._render()
                })
              : (this._add(p, i), this._render()),
            p
          )
        }
        showExistingToast(t) {
          const e = this._getNextKey()
          return t.setKey(this, e), this._add(t), this._render(), t
        }
        removeToast(t) {
          return new Promise((e) => {
            t.setAnimationStage(d.ToastAnimationStage.Remove),
              this._render(),
              setTimeout(() => {
                this._remove(t), this._render(), e()
              }, 300)
          })
        }
        update(t) {
          const {
            suggestedLayout: e,
            location: o,
            container: n,
            rootContainerOptions: i,
          } = t
          let s = !1,
            r = !1
          void 0 !== e &&
            e !== this._suggestedLayout &&
            (this._setSuggestedLayout(e), (s = !0)),
            void 0 !== o && (this._setLocation(o), (r = !0)),
            void 0 !== n && (this._setContainer(n), (r = !0)),
            void 0 !== i && (this._updateRootContainer(i), (r = !0)),
            s
              ? 'compact' === this._suggestedLayout &&
                this._toasts[d.ToastPriority.Low]
                  .slice(0, -1)
                  .forEach((t) => this.removeToast(t))
              : r && this._render()
        }
        getToasts() {
          return this._toasts
        }
        forceRender() {
          this._render()
        }
        merge(t) {
          S(t.getToasts()).forEach(async (e) => {
            const o = e.getStaticData()
            await e.remove(),
              e.migrate(this),
              this.showExistingToast(e),
              void 0 !== o.onLayerChange && o.onLayerChange(t, this)
          })
        }
        split(t) {
          S(this._toasts)
            .filter((t) => t.isForeign())
            .forEach(async (e) => {
              const o = e.getStaticData()
              await e.remove(),
                e.migrate(t),
                t.showExistingToast(e),
                void 0 !== o.onLayerChange && o.onLayerChange(this, t)
            })
        }
        reset() {
          ;(this._toasts = {
            [d.ToastPriority.Low]: [],
            [d.ToastPriority.Medium]: [],
            [d.ToastPriority.High]: [],
          }),
            this._render()
        }
        destroy() {
          this._removeRootContainer()
        }
        _removeRootContainer() {
          s.unmountComponentAtNode(this._detachedContainer),
            this._detachedContainer.remove(),
            this._overlapManagerContainer.remove()
        }
        _getToastsList(t) {
          const e = t.getStaticData().priority
          return this._toasts[e]
        }
        _normalizeIndex(t, e) {
          return t < 0 ? 0 : t > e.length ? e.length : t
        }
        _add(t, e) {
          const o = this._getToastsList(t)
          if (void 0 !== e) {
            const n = this._normalizeIndex(e, o)
            o.splice(n, 0, t)
          } else o.push(t)
        }
        _remove(t) {
          const e = this._getToastsList(t),
            o = e.indexOf(t)
          o >= 0 && e.splice(o, 1)
        }
        _render() {
          const t = S(this._toasts)
          s.render(
            i.createElement(T, {
              toasts: t,
              suggestedLayout: this._suggestedLayout,
              location: this._location,
              manager: this._manager,
              layer: this,
            }),
            this._detachedContainer,
          )
        }
        _setSuggestedLayout(t) {
          t !== this._suggestedLayout &&
            ('compact' === t
              ? this._overlapManagerContainer.classList.add(f.compact)
              : this._overlapManagerContainer.classList.remove(f.compact),
            (this._suggestedLayout = t))
        }
        _setLocation(t) {
          t !== this._location && (this._location = t)
        }
        _setContainer(t) {
          t !== this._container &&
            ((this._container = t),
            this._container.appendChild(this._overlapManagerContainer))
        }
        _updateRootContainer(t) {
          E(this._overlapManagerContainer, t)
        }
        _getNextKey() {
          return (0, r.randomHashN)(5)
        }
      }
      function S(t) {
        return [
          ...t[d.ToastPriority.Low],
          ...t[d.ToastPriority.Medium],
          ...t[d.ToastPriority.High],
        ]
      }
      function E(t, e) {
        const {
          top: o,
          right: n,
          bottom: i,
          left: s,
          position: r,
          zIndex: a,
        } = e
        void 0 !== r && (t.style.position = r),
          void 0 !== a && (t.style.zIndex = String(a)),
          void 0 !== o && (t.style.top = o),
          void 0 !== n && (t.style.right = n),
          void 0 !== i && (t.style.bottom = i),
          void 0 !== s && (t.style.left = s)
      }
    },
    925931: (t, e, o) => {
      o.d(e, { nanoid: () => n })
      const n = (t = 21) =>
        crypto
          .getRandomValues(new Uint8Array(t))
          .reduce(
            (t, e) =>
              (t +=
                (e &= 63) < 36
                  ? e.toString(36)
                  : e < 62
                    ? (e - 26).toString(36).toUpperCase()
                    : e > 62
                      ? '-'
                      : '_'),
            '',
          )
    },
  },
])
