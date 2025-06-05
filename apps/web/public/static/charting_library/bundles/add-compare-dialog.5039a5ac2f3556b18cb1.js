;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [731],
  {
    59142: (e, t) => {
      var o, r, a
      ;(r = [t]),
        (o = (e) => {
          function t(e) {
            if (Array.isArray(e)) {
              for (var t = 0, o = Array(e.length); t < e.length; t++)
                o[t] = e[t]
              return o
            }
            return Array.from(e)
          }
          Object.defineProperty(e, '__esModule', { value: !0 })
          var o = !1
          if ('undefined' != typeof window) {
            var r = {
              get passive() {
                o = !0
              },
            }
            window.addEventListener('testPassive', null, r),
              window.removeEventListener('testPassive', null, r)
          }
          var a =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            n = [],
            s = !1,
            i = -1,
            l = void 0,
            c = void 0,
            d = (e) =>
              n.some(
                (t) =>
                  !(!t.options.allowTouchMove || !t.options.allowTouchMove(e)),
              ),
            u = (e) => {
              var t = e || window.event
              return (
                !!d(t.target) ||
                1 < t.touches.length ||
                (t.preventDefault && t.preventDefault(), !1)
              )
            },
            m = () => {
              setTimeout(() => {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== l &&
                    ((document.body.style.overflow = l), (l = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, r) => {
            if (a) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !n.some((t) => t.targetElement === e)) {
                var m = { targetElement: e, options: r || {} }
                ;(n = [].concat(t(n), [m])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (i = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var o, r, a, n
                    1 === t.targetTouches.length &&
                      ((r = e),
                      (n = (o = t).targetTouches[0].clientY - i),
                      !d(o.target) &&
                        ((r && 0 === r.scrollTop && 0 < n) ||
                        ((a = r) &&
                          a.scrollHeight - a.scrollTop <= a.clientHeight &&
                          n < 0)
                          ? u(o)
                          : o.stopPropagation()))
                  }),
                  s ||
                    (document.addEventListener(
                      'touchmove',
                      u,
                      o ? { passive: !1 } : void 0,
                    ),
                    (s = !0))
              }
            } else {
              ;(p = r),
                setTimeout(() => {
                  if (void 0 === c) {
                    var e = !!p && !0 === p.reserveScrollBarGap,
                      t =
                        window.innerWidth - document.documentElement.clientWidth
                    e &&
                      0 < t &&
                      ((c = document.body.style.paddingRight),
                      (document.body.style.paddingRight = t + 'px'))
                  }
                  void 0 === l &&
                    ((l = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var h = { targetElement: e, options: r || {} }
              n = [].concat(t(n), [h])
            }
            var p
          }),
            (e.clearAllBodyScrollLocks = () => {
              a
                ? (n.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  s &&
                    (document.removeEventListener(
                      'touchmove',
                      u,
                      o ? { passive: !1 } : void 0,
                    ),
                    (s = !1)),
                  (n = []),
                  (i = -1))
                : (m(), (n = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (a) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (n = n.filter((t) => t.targetElement !== e)),
                  s &&
                    0 === n.length &&
                    (document.removeEventListener(
                      'touchmove',
                      u,
                      o ? { passive: !1 } : void 0,
                    ),
                    (s = !1))
              } else
                1 === n.length && n[0].targetElement === e
                  ? (m(), (n = []))
                  : (n = n.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (a = 'function' == typeof o ? o.apply(t, r) : o) ||
          (e.exports = a)
    },
    70048: (e) => {
      e.exports = {
        wrapper: 'wrapper-GZajBGIm',
        input: 'input-GZajBGIm',
        box: 'box-GZajBGIm',
        icon: 'icon-GZajBGIm',
        noOutline: 'noOutline-GZajBGIm',
        'intent-danger': 'intent-danger-GZajBGIm',
        check: 'check-GZajBGIm',
        dot: 'dot-GZajBGIm',
      }
    },
    57222: (e) => {
      e.exports = {
        button: 'button-Rc93kXa8',
        bordersVisible: 'bordersVisible-Rc93kXa8',
        selected: 'selected-Rc93kXa8',
      }
    },
    17723: (e) => {
      e.exports = { footer: 'footer-dwINHZFL' }
    },
    85286: (e) => {
      e.exports = {
        wrap: 'wrap-oc7l8ZQg',
        header: 'header-oc7l8ZQg',
        item: 'item-oc7l8ZQg',
      }
    },
    44467: (e) => {
      e.exports = { label: 'label-lVJKBKVk' }
    },
    78724: (e) => {
      e.exports = {
        scrollable: 'scrollable-sXALjK1u',
        spinnerWrap: 'spinnerWrap-sXALjK1u',
        item: 'item-sXALjK1u',
        heading: 'heading-sXALjK1u',
        checkboxWrap: 'checkboxWrap-sXALjK1u',
        checkbox: 'checkbox-sXALjK1u',
        emptyState: 'emptyState-sXALjK1u',
        image: 'image-sXALjK1u',
        text: 'text-sXALjK1u',
      }
    },
    10341: (e) => {
      e.exports = {
        dialog: 'dialog-IKuIIugL',
        tabletDialog: 'tabletDialog-IKuIIugL',
        desktopDialog: 'desktopDialog-IKuIIugL',
      }
    },
    66076: (e) => {
      e.exports = {
        'default-drawer-min-top-distance': '100px',
        wrap: 'wrap-_HnK0UIN',
        positionBottom: 'positionBottom-_HnK0UIN',
        backdrop: 'backdrop-_HnK0UIN',
        drawer: 'drawer-_HnK0UIN',
        positionLeft: 'positionLeft-_HnK0UIN',
      }
    },
    71986: (e) => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        item: 'item-jFqVJoPk',
        hovered: 'hovered-jFqVJoPk',
        isDisabled: 'isDisabled-jFqVJoPk',
        isActive: 'isActive-jFqVJoPk',
        shortcut: 'shortcut-jFqVJoPk',
        toolbox: 'toolbox-jFqVJoPk',
        withIcon: 'withIcon-jFqVJoPk',
        'round-icon': 'round-icon-jFqVJoPk',
        icon: 'icon-jFqVJoPk',
        labelRow: 'labelRow-jFqVJoPk',
        label: 'label-jFqVJoPk',
        showOnHover: 'showOnHover-jFqVJoPk',
        'disclosure-item-circle-logo': 'disclosure-item-circle-logo-jFqVJoPk',
        showOnFocus: 'showOnFocus-jFqVJoPk',
      }
    },
    70673: (e, t, o) => {
      o.d(t, { CheckboxInput: () => d })
      var r = o(50959),
        a = o(97754),
        n = o(90186),
        s = o(9745),
        i = o(65890),
        l = o(70048),
        c = o.n(l)
      function d(e) {
        const t = a(c().box, c()[`intent-${e.intent}`], {
            [c().check]: !Boolean(e.indeterminate),
            [c().dot]: Boolean(e.indeterminate),
            [c().noOutline]: -1 === e.tabIndex,
          }),
          o = a(c().wrapper, e.className)
        return r.createElement(
          'span',
          { className: o, title: e.title, style: e.style },
          r.createElement('input', {
            id: e.id,
            tabIndex: e.tabIndex,
            className: c().input,
            type: 'checkbox',
            name: e.name,
            checked: e.checked,
            disabled: e.disabled,
            value: e.value,
            autoFocus: e.autoFocus,
            role: e.role,
            onChange: () => {
              e.onChange && e.onChange(e.value)
            },
            ref: e.reference,
            'aria-required': e['aria-required'],
            'aria-describedby': e['aria-describedby'],
            'aria-invalid': e['aria-invalid'],
            ...(0, n.filterDataProps)(e),
          }),
          r.createElement(
            'span',
            { className: t },
            r.createElement(s.Icon, { icon: i, className: c().icon }),
          ),
        )
      }
    },
    36383: (e, t, o) => {
      o.d(t, { useOutsideEvent: () => n })
      var r = o(50959),
        a = o(27267)
      function n(e) {
        const {
            click: t,
            mouseDown: o,
            touchEnd: n,
            touchStart: s,
            handler: i,
            reference: l,
            ownerDocument: c = document,
          } = e,
          d = (0, r.useRef)(null),
          u = (0, r.useRef)(new CustomEvent('timestamp').timeStamp)
        return (
          (0, r.useLayoutEffect)(() => {
            const e = { click: t, mouseDown: o, touchEnd: n, touchStart: s },
              r = l ? l.current : d.current
            return (0, a.addOutsideEventListener)(u.current, r, i, c, e)
          }, [t, o, n, s, i]),
          l || d
        )
      }
    },
    9745: (e, t, o) => {
      o.d(t, { Icon: () => a })
      var r = o(50959)
      const a = r.forwardRef((e, t) => {
        const { icon: o = '', ...a } = e
        return r.createElement('span', {
          ...a,
          ref: t,
          dangerouslySetInnerHTML: { __html: o },
        })
      })
    },
    99663: (e, t, o) => {
      o.d(t, {
        Slot: () => a,
        SlotContext: () => n,
      })
      var r = o(50959)
      class a extends r.Component {
        shouldComponentUpdate() {
          return !1
        }
        render() {
          return r.createElement('div', {
            style: { position: 'fixed', zIndex: 150, left: 0, top: 0 },
            ref: this.props.reference,
          })
        }
      }
      const n = r.createContext(null)
    },
    67961: (e, t, o) => {
      o.d(t, { OverlapManager: () => n, getRootOverlapManager: () => i })
      var r = o(50151)
      class a {
        constructor() {
          this._storage = []
        }
        add(e) {
          this._storage.push(e)
        }
        remove(e) {
          this._storage = this._storage.filter((t) => e !== t)
        }
        has(e) {
          return this._storage.includes(e)
        }
        getItems() {
          return this._storage
        }
      }
      class n {
        constructor(e = document) {
          ;(this._storage = new a()),
            (this._windows = new Map()),
            (this._index = 0),
            (this._document = e),
            (this._container = e.createDocumentFragment())
        }
        setContainer(e) {
          const t = this._container,
            o = null === e ? this._document.createDocumentFragment() : e
          !((e, t) => {
            Array.from(e.childNodes).forEach((e) => {
              e.nodeType === Node.ELEMENT_NODE && t.appendChild(e)
            })
          })(t, o),
            (this._container = o)
        }
        registerWindow(e) {
          this._storage.has(e) || this._storage.add(e)
        }
        ensureWindow(e, t = { position: 'fixed', direction: 'normal' }) {
          const o = this._windows.get(e)
          if (void 0 !== o) return o
          this.registerWindow(e)
          const r = this._document.createElement('div')
          if (
            ((r.style.position = t.position),
            (r.style.zIndex = this._index.toString()),
            (r.dataset.id = e),
            void 0 !== t.index)
          ) {
            const e = this._container.childNodes.length
            if (t.index >= e) this._container.appendChild(r)
            else if (t.index <= 0)
              this._container.insertBefore(r, this._container.firstChild)
            else {
              const e = this._container.childNodes[t.index]
              this._container.insertBefore(r, e)
            }
          } else
            'reverse' === t.direction
              ? this._container.insertBefore(r, this._container.firstChild)
              : this._container.appendChild(r)
          return this._windows.set(e, r), ++this._index, r
        }
        unregisterWindow(e) {
          this._storage.remove(e)
          const t = this._windows.get(e)
          void 0 !== t &&
            (null !== t.parentElement && t.parentElement.removeChild(t),
            this._windows.delete(e))
        }
        getZindex(e) {
          const t = this.ensureWindow(e)
          return Number.parseInt(t.style.zIndex || '0')
        }
        moveToTop(e) {
          if (this.getZindex(e) !== this._index) {
            this.ensureWindow(e).style.zIndex = (++this._index).toString()
          }
        }
        removeWindow(e) {
          this.unregisterWindow(e)
        }
      }
      const s = new WeakMap()
      function i(e = document) {
        const t = e.getElementById('overlap-manager-root')
        if (null !== t) return (0, r.ensureDefined)(s.get(t))
        {
          const t = new n(e),
            o = ((e) => {
              const t = e.createElement('div')
              return (
                (t.style.position = 'absolute'),
                (t.style.zIndex = (150).toString()),
                (t.style.top = '0px'),
                (t.style.left = '0px'),
                (t.id = 'overlap-manager-root'),
                t
              )
            })(e)
          return s.set(o, t), t.setContainer(o), e.body.appendChild(o), t
        }
      }
    },
    99054: (e, t, o) => {
      o.d(t, { setFixedBodyState: () => c })
      const r = (() => {
        let e
        return () => {
          var t
          if (void 0 === e) {
            const o = document.createElement('div'),
              r = o.style
            ;(r.visibility = 'hidden'),
              (r.width = '100px'),
              (r.msOverflowStyle = 'scrollbar'),
              document.body.appendChild(o)
            const a = o.offsetWidth
            o.style.overflow = 'scroll'
            const n = document.createElement('div')
            ;(n.style.width = '100%'), o.appendChild(n)
            const s = n.offsetWidth
            null === (t = o.parentNode) || void 0 === t || t.removeChild(o),
              (e = a - s)
          }
          return e
        }
      })()
      function a(e, t, o) {
        null !== e && e.style.setProperty(t, o)
      }
      function n(e, t) {
        return getComputedStyle(e, null).getPropertyValue(t)
      }
      function s(e, t) {
        return Number.parseInt(n(e, t))
      }
      let i = 0,
        l = !1
      function c(e) {
        const { body: t } = document,
          o = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++i) {
          const e = n(t, 'overflow'),
            i = s(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            (a(o, 'right', `${r()}px`),
            (t.style.paddingRight = `${i + r()}px`),
            (l = !0)),
            t.classList.add('i-no-scroll')
        } else if (
          !e &&
          i > 0 &&
          0 == --i &&
          (t.classList.remove('i-no-scroll'), l)
        ) {
          a(o, 'right', '0px')
          let e = 0
          0,
            t.scrollHeight <= t.clientHeight && (e -= r()),
            (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'),
            (l = !1)
        }
      }
    },
    45601: (e, t, o) => {
      o.d(t, { Measure: () => a })
      var r = o(67842)
      function a(e) {
        const { children: t, onResize: o } = e
        return t((0, r.useResizeObserver)(o || (() => {}), [null === o]))
      }
    },
    39362: (e, t, o) => {
      o.d(t, { SymbolSearchDialogFooter: () => i })
      var r = o(50959),
        a = o(97754),
        n = o.n(a),
        s = o(17723)
      function i(e) {
        const { className: t, children: o } = e
        return r.createElement('div', { className: n()(s.footer, t) }, o)
      }
    },
    14283: (e, t, o) => {
      o.r(t), o.d(t, { getCompareDialogRenderer: () => se })
      var r = o(50959),
        a = o(11542),
        n = o(32563),
        s = o(14483),
        i = o(65106),
        l = o(97754),
        c = o.n(l),
        d = o(50151),
        u = o(9745),
        m = o(86656),
        h = o(77975),
        p = o(63932),
        v = o(26843),
        f = o(45345),
        b = o(45601),
        g = o(84524),
        y = o(17531)
      const _ = r.createContext(null)
      var S = o(70412),
        k = o(77762)
      const x = r.createContext(null)
      var w = o(16396),
        I = o(41590),
        C = o(37558),
        N = o(57222)
      function E(e) {
        const {
          theme: t = N,
          children: o,
          onClick: a,
          isSelected: n,
          areBordersVisible: s,
          isItemSelected: i,
          className: l,
          value: d,
          name: u,
        } = e
        return r.createElement(
          'button',
          {
            type: 'button',
            className: c()(
              l,
              t.button,
              n && t.selected,
              s && !n && !i && t.bordersVisible,
            ),
            name: u,
            value: d,
            onClick: a,
          },
          o,
        )
      }
      function M(e) {
        const { value: t, onClick: o, ...a } = e,
          n = (0, r.useCallback)((e) => o(t, e), [t, o])
        return r.createElement(E, { ...a, value: String(t), onClick: n })
      }
      var D = o(46148)
      function z(e) {
        const { compareModel: t, selectedCompareOptionIndex: n } = (0,
          k.useEnsuredContext)(_),
          s = t.comparableOnSameScale({ isYield: e }),
          i = (0, r.useMemo)(
            () =>
              ((e) => [
                {
                  label: e
                    ? a.t(null, void 0, o(17547))
                    : a.t(null, void 0, o(82642)),
                  compareOption: e
                    ? D.CompareOption.SameScale
                    : D.CompareOption.SamePctScale,
                },
                {
                  label: a.t(null, void 0, o(34420)),
                  compareOption: D.CompareOption.NewPriceScale,
                },
                {
                  label: a.t(null, void 0, o(67242)),
                  compareOption: D.CompareOption.NewPane,
                },
              ])(s),
            [s],
          )
        return [
          (0, r.useMemo)(() => {
            var e, t
            return null !==
              (t =
                null === (e = i[n]) || void 0 === e
                  ? void 0
                  : e.compareOption) && void 0 !== t
              ? t
              : i[0].compareOption
          }, [i, n]),
          i,
        ]
      }
      var L = o(85286)
      function T(e) {
        const {
            fullSymbolName: t,
            isSelected: n,
            className: s,
            isYield: l,
          } = e,
          {
            isMobile: d,
            searchRef: u,
            setMode: m,
          } = (0, k.useEnsuredContext)(g.SymbolSearchItemsDialogContext),
          {
            compareModel: h,
            setHoveredItemId: p,
            clearInput: v,
            allowExtendTimeScale: f,
          } = (0, k.useEnsuredContext)(_),
          { callback: b } = (0, k.useEnsuredContext)(x),
          [y, S] = z(l)
        return d
          ? r.createElement(
              C.DrawerManager,
              null,
              r.createElement(
                I.Drawer,
                { position: 'Bottom', onClose: N.bind(null, !1) },
                r.createElement(
                  'div',
                  { className: L.header },
                  a.t(null, void 0, o(79589)),
                ),
                S.map(({ label: e, compareOption: t }) =>
                  r.createElement(w.PopupMenuItem, {
                    key: t,
                    className: L.item,
                    onClick: E,
                    onClickArg: t,
                    label: e,
                  }),
                ),
              ),
            )
          : r.createElement(
              'div',
              {
                className: c()(L.wrap, s),
                'data-name': 'compare-buttons-group',
              },
              S.map(({ label: e, compareOption: t }) =>
                r.createElement(
                  M,
                  {
                    key: t,
                    onClick: E,
                    value: t,
                    isItemSelected: Boolean(n),
                    isSelected: n && y === t,
                  },
                  e,
                ),
              ),
            )
        function N(e) {
          d && b && b(), v && e && v(u, m)
        }
        function E(e, o) {
          if ((o.preventDefault(), h && t && void 0 !== e)) {
            ;(0, i.getSymbolSearchCompleteOverrideFunction)()(t).then((t) => {
              h.applyStudy(t.symbol, e, f), p(''), N(!0)
            })
          }
        }
      }
      function A(e) {
        const {
            isSelected: t,
            fullSymbolName: o,
            onExpandClick: a,
            actions: s,
            id: l,
            isOffset: c,
            isYield: d,
          } = e,
          {
            isMobile: u,
            toggleExpand: m,
            searchSpreads: h,
            searchRef: p,
            setMode: v,
            mode: f,
          } = (0, k.useEnsuredContext)(g.SymbolSearchItemsDialogContext),
          {
            compareModel: b,
            hoveredItemId: w,
            setHoveredItemId: I,
            clearInput: C,
            allowExtendTimeScale: N,
          } = (0, k.useEnsuredContext)(_),
          [E, M] = (0, r.useState)(!1),
          z = (0, r.useRef)(null),
          L = (0, S.useAccurateHover)(z),
          A = (0, r.useMemo)(() => ({ callback: P }), [P]),
          B = !Boolean(a) && !Boolean(s),
          j = l === w
        return r.createElement(
          x.Provider,
          { value: A },
          r.createElement(y.SymbolSearchDialogContentItem, {
            hideMarkedListFlag: 'compare' === f,
            ...e,
            reference: z,
            onClick: (t) => {
              if (Boolean(a) && l && !c)
                return null == t || t.preventDefault(), void m(l)
              if (!E && u) return void M(!0)
              if (h && e.onClick) return void e.onClick(t)
              if ((n.mobiletouch ? j : !E) && o) {
                ;(0, i.getSymbolSearchCompleteOverrideFunction)()(o).then(
                  (e) => {
                    const t = b.comparableOnSameScale({ isYield: d })
                      ? D.CompareOption.SameScale
                      : D.CompareOption.SamePctScale
                    b.applyStudy(e.symbol, t, N)
                  },
                ),
                  I(''),
                  C && C(p, v)
              }
              n.mobiletouch && !u && !j && l && I(l)
            },
            hoverComponent: (() => {
              if (!B) return !1
              if (u) return E
              if (n.mobiletouch) return j
              return Boolean(L || t)
            })()
              ? T
              : void 0,
          }),
        )
        function P() {
          M(!1)
        }
      }
      var B = o(15550),
        j = o(93986),
        P = o(39750),
        H = o(78724)
      function R(e) {
        const { handleListWidth: t } = (0, d.ensureNotNull)(
            (0, r.useContext)(g.SymbolSearchItemsDialogContext),
          ),
          {
            compareModel: n,
            selectedCompareIndex: s,
            selectedItemRef: i,
          } = (0, d.ensureNotNull)((0, r.useContext)(_)),
          l = (0, h.useWatchedValueReadonly)({ watchedValue: n.isDataReady() }),
          S = (0, h.useWatchedValueReadonly)({ watchedValue: n.studies() }),
          k = (0, h.useWatchedValueReadonly)({
            watchedValue: n.highlightedSymbol(),
          }),
          x = (0, r.useMemo)(() => S.filter((e) => e.checked), [S]),
          w = (0, r.useMemo)(() => S.filter((e) => !e.checked), [S])
        return (
          (0, r.useEffect)(
            () => (
              n
                .chartModel()
                .dataSourceCollectionChanged()
                .subscribe(n, n.handleSourcesChange),
              () =>
                n
                  .chartModel()
                  .dataSourceCollectionChanged()
                  .unsubscribe(n, n.handleSourcesChange)
            ),
            [n],
          ),
          r.createElement(
            b.Measure,
            {
              onResize: ([e]) => {
                t(e.contentRect.width)
              },
            },
            (e) =>
              r.createElement(
                m.TouchScrollContainer,
                { className: H.scrollable, ref: e },
                (() => {
                  if (!l)
                    return r.createElement(
                      'div',
                      { className: H.spinnerWrap },
                      r.createElement(p.Spinner, null),
                    )
                  if (!Boolean(x.length) && !Boolean(w.length)) {
                    const e = f.watchedTheme.value() === v.StdTheme.Dark ? j : B
                    return r.createElement(
                      'div',
                      { className: H.emptyState },
                      r.createElement(u.Icon, { className: H.image, icon: e }),
                      r.createElement(
                        'div',
                        { className: H.text },
                        a.t(null, void 0, o(42078)),
                      ),
                    )
                  }
                  return r.createElement(
                    r.Fragment,
                    null,
                    Boolean(x.length) &&
                      r.createElement(
                        r.Fragment,
                        null,
                        r.createElement(
                          'div',
                          { className: H.heading },
                          a.t(null, void 0, o(46580)),
                        ),
                        x.map((e, t) =>
                          r.createElement(y.SymbolSearchDialogContentItem, {
                            'data-role': 'added-symbol-item',
                            className: H.item,
                            key: e.id,
                            id: e.id,
                            shortName: e.title,
                            title: e.title,
                            logoId: e.logoId,
                            currencyLogoId: e.currencyLogoId,
                            baseCurrencyLogoId: e.baseCurrencyLogoId,
                            dangerousDescriptionHTML: e.description,
                            exchangeName: e.exchangeName,
                            marketType: e.marketType,
                            country: e.country,
                            providerId: e.providerId,
                            onClick: I.bind(null, e),
                            isHighlighted: e.id === k,
                            isSelected: C(e),
                            itemRef: C(e) ? i : void 0,
                            isYield: e.isYield,
                            actions: r.createElement(
                              'div',
                              { className: H.checkboxWrap },
                              r.createElement(
                                E,
                                {
                                  className: H.checkbox,
                                  onClick: I.bind(null, e),
                                  isSelected: C(e),
                                },
                                r.createElement(u.Icon, { icon: P }),
                              ),
                            ),
                          }),
                        ),
                      ),
                    Boolean(w.length) &&
                      r.createElement(
                        r.Fragment,
                        null,
                        r.createElement(
                          'div',
                          { className: H.heading },
                          a.t(null, void 0, o(57570)),
                        ),
                        w.map((e) =>
                          r.createElement(A, {
                            'data-role': 'recent-symbol-item',
                            className: c()(H.item, e.id === k && H.highlighted),
                            key: e.id,
                            id: e.id,
                            shortName: e.title,
                            logoId: e.logoId,
                            currencyLogoId: e.currencyLogoId,
                            baseCurrencyLogoId: e.baseCurrencyLogoId,
                            title: e.title,
                            dangerousDescriptionHTML: e.description,
                            exchangeName: e.exchangeName,
                            marketType: e.marketType,
                            country: e.country,
                            providerId: e.providerId,
                            fullSymbolName: e.symbol,
                            isSelected: C(e),
                            itemRef: C(e) ? i : void 0,
                            isYield: e.isYield,
                          }),
                        ),
                      ),
                  )
                })(),
              ),
          )
        )
        function I(e, t) {
          null == t || t.preventDefault(), n.removeStudy(e)
        }
        function C(e) {
          return S.indexOf(e) === s
        }
      }
      var O = o(56840)
      class W extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._selectedItemRef = r.createRef()),
            (this._getContextValue = () => {
              const { compareModel: e } = this.props,
                {
                  selectedCompareOptionIndex: t,
                  selectedCompareIndex: o,
                  hoveredItemId: r,
                  allowExtendTimeScale: a,
                } = this.state
              return {
                compareModel: e,
                selectedCompareOptionIndex: t,
                setSelectedCompareOptionIndex:
                  this._setSelectedCompareOptionIndex,
                hoveredItemId: r,
                setHoveredItemId: this._setHoveredItemId,
                selectedCompareIndex: o,
                setSelectedCompareIndex: this._setSelectedCompareIndex,
                selectedItemRef: this._selectedItemRef,
                clearInput: this._clearInput,
                allowExtendTimeScale: a,
                toggleAllowExtendTimeScale: this._toggleAllowExtendTimeScale,
              }
            }),
            (this._clearInput = (e, t) => {
              e && e.current && ((e.current.value = ''), t('compare'))
            }),
            (this._setSelectedCompareOptionIndex = (e) => {
              this.setState({ selectedCompareOptionIndex: e })
            }),
            (this._setHoveredItemId = (e) => {
              this.setState({ hoveredItemId: e })
            }),
            (this._setSelectedCompareIndex = (e, t) => {
              this.setState({ selectedCompareIndex: e }, t)
            }),
            (this._toggleAllowExtendTimeScale = () => {
              const e = !this.state.allowExtendTimeScale
              O.setValue('showAddSymbolDialog.extendCheckboxState', e),
                this.setState({ allowExtendTimeScale: e })
            }),
            (this.state = {
              selectedCompareOptionIndex: 0,
              selectedCompareIndex: -1,
              hoveredItemId: void 0,
              allowExtendTimeScale: Boolean(
                O.getBool('showAddSymbolDialog.extendCheckboxState'),
              ),
            })
        }
        render() {
          const { children: e } = this.props
          return r.createElement(
            _.Provider,
            { value: this._getContextValue() },
            e,
          )
        }
      }
      var F = o(68335),
        U = o(35057),
        Y = o(16838),
        q = o(10341)
      function K(e) {
        const {
            openedItems: t,
            searchRef: o,
            feedItems: a,
            selectedIndex: n,
            toggleExpand: s,
            onSearchComplete: i,
            mode: c,
            setMode: d,
            setSelectedIndex: u,
            isMobile: m,
            isTablet: p,
            onClose: v,
            upperCaseEnabled: f,
            symbolSearchState: b,
          } = (0, k.useEnsuredContext)(g.SymbolSearchItemsDialogContext),
          {
            compareModel: y,
            hoveredItemId: S,
            setHoveredItemId: x,
            selectedCompareOptionIndex: w,
            setSelectedCompareOptionIndex: I,
            selectedCompareIndex: C,
            setSelectedCompareIndex: N,
            selectedItemRef: E,
            clearInput: M,
            allowExtendTimeScale: D,
          } = (0, k.useEnsuredContext)(_),
          L = (0, h.useWatchedValueReadonly)({ watchedValue: y.studies() }),
          T = a[n],
          A = 'compare' === c,
          B = 'exchange' === c,
          j = A ? C : n,
          P = A ? L : a,
          H = P[j],
          [R, O] = z(null == H ? void 0 : H.isYield)
        return (
          (0, r.useEffect)(() => {
            S && x(''), C && N(-1)
          }, [c]),
          r.createElement(U.AdaptivePopupDialog, {
            ...e,
            className: l(
              q.dialog,
              !m && (p ? q.tabletDialog : q.desktopDialog),
            ),
            onKeyDown: (e) => {
              var r
              const a = (0, F.hashFromEvent)(e)
              switch (a) {
                case 13: {
                  if (A)
                    return void (() => {
                      if (-1 === C) return
                      const e = L[C]
                      e.checked
                        ? y.removeStudy(e)
                        : y.applyStudy(e.symbol, R, D)
                      N(-1)
                    })()
                  const t = V()
                  if (t) return e.preventDefault(), void s(t)
                  e.preventDefault()
                  const a =
                    null === (r = null == o ? void 0 : o.current) ||
                    void 0 === r
                      ? void 0
                      : r.value.trim()
                  return void (
                    a &&
                    M &&
                    (i([
                      {
                        symbol: f ? a.toUpperCase() : a,
                        resolved: !1,
                        compareOption: R,
                        allowExtendTimeScale: D,
                      },
                    ]),
                    M(o, d))
                  )
                }
                case 27:
                  return (
                    e.preventDefault(), B ? void d('symbolSearch') : void v()
                  )
              }
              if (!A && 'good' !== b) return
              switch ((0, Y.mapKeyCodeToDirection)(a)) {
                case 'blockPrev':
                  if ((e.preventDefault(), 0 === j)) return
                  if (-1 === j) return void W(0)
                  W(j - 1)
                  break
                case 'blockNext':
                  if ((e.preventDefault(), j === P.length - 1)) return
                  W(j + 1)
                  break
                case 'inlinePrev': {
                  const o = V()
                  if (o && t.has(o)) return e.preventDefault(), void s(o)
                  if (!w || o) return
                  e.preventDefault(), I(w - 1)
                  break
                }
                case 'inlineNext': {
                  const o = V()
                  if (o && !t.has(o)) return e.preventDefault(), void s(o)
                  if (w === O.length - 1 || o) return
                  e.preventDefault(), I(w + 1)
                  break
                }
              }
            },
            dataName: 'compare-dialog',
            draggable: !0,
          })
        )
        function W(e) {
          A ? N(e, K) : u(e)
        }
        function K() {
          var e
          null === (e = E.current) ||
            void 0 === e ||
            e.scrollIntoView({ block: 'nearest' })
        }
        function V() {
          if (!T) return
          const { id: e, isOffset: t, onExpandClick: o } = T
          return !t && Boolean(o) && e ? e : void 0
        }
      }
      var V = o(962),
        Z = o(22350),
        G = o(85067)
      class J extends G.DialogRenderer {
        constructor(e) {
          super(), (this._props = e)
        }
        show(e) {
          if (this.visible().value()) return
          const t = r.createElement(Z.SymbolSearchItemsDialog, {
            ...this._props,
            shouldReturnFocus: null == e ? void 0 : e.shouldReturnFocus,
            initialMode: this._props.initialMode || 'symbolSearch',
            onClose: () => this.hide(),
          })
          V.render(t, this._container), this._setVisibility(!0)
        }
        hide() {
          var e, t
          V.unmountComponentAtNode(this._container),
            this._visibility.setValue(!1),
            null === (t = (e = this._props).onClose) ||
              void 0 === t ||
              t.call(e)
        }
      }
      var X = o(81319),
        Q = o(69654),
        $ = o(70613)
      function ee(e) {
        const { searchRef: t, setMode: o } = (0, k.useEnsuredContext)(
            g.SymbolSearchItemsDialogContext,
          ),
          { currentMode: a } = (0, k.useEnsuredContext)(
            $.SymbolSearchDialogBodyContext,
          )
        return (
          (0, r.useEffect)(() => {
            const e = t.current
            if (e)
              return (
                e.addEventListener('input', n),
                () => {
                  e && e.removeEventListener('input', n)
                }
              )
          }, []),
          r.createElement(Q.DialogSearch, { ...e })
        )
        function n() {
          var e, r, n, s
          t.current &&
            a &&
            ('compare' !== a.current ||
            '' ===
              (null ===
                (r =
                  null === (e = null == t ? void 0 : t.current) || void 0 === e
                    ? void 0
                    : e.value) || void 0 === r
                ? void 0
                : r.trim())
              ? 'symbolSearch' === a.current &&
                '' ===
                  (null ===
                    (s =
                      null === (n = null == t ? void 0 : t.current) ||
                      void 0 === n
                        ? void 0
                        : n.value) || void 0 === s
                    ? void 0
                    : s.trim()) &&
                o('compare')
              : o('symbolSearch'))
        }
      }
      var te = o(70673),
        oe = o(39362),
        re = o(44467)
      function ae(e) {
        const { allowExtendTimeScale: t, toggleAllowExtendTimeScale: n } = (0,
        d.ensureNotNull)((0, r.useContext)(_))
        return r.createElement(
          oe.SymbolSearchDialogFooter,
          null,
          r.createElement(
            'label',
            { 'data-name': 'allow-extend-time-scale-checkbox' },
            r.createElement(te.CheckboxInput, {
              checked: t,
              value: t ? 'on' : 'off',
              onChange: n,
            }),
            r.createElement(
              'span',
              { className: re.label },
              a.t(null, void 0, o(71046)),
            ),
          ),
        )
      }
      const ne = s.enabled('secondary_series_extend_time_scale')
      function se(e) {
        return new J({
          wrapper:
            ((t = e), (e) => r.createElement(W, { ...e, compareModel: t })),
          dialog: K,
          contentItem: A,
          initialScreen: R,
          searchInput: ee,
          footer: ne ? r.createElement(ae) : void 0,
          initialMode: 'compare',
          dialogTitle: a.t(null, void 0, o(22320)),
          autofocus: !n.mobiletouch,
          dialogWidth: 'fixed',
          onSearchComplete: (t) => {
            const { compareOption: o, allowExtendTimeScale: r } = t[0]
            if (void 0 !== o) {
              ;(0, i.getSymbolSearchCompleteOverrideFunction)()(
                t[0].symbol,
                t[0].result,
              ).then((t) => {
                e.applyStudy(t.symbol, o, r)
              })
            }
          },
          symbolTypes: (0, X.getAvailableSymbolTypes)(),
          showSpreadActions:
            s.enabled('show_spread_operators') &&
            s.enabled('compare_symbol_search_spread_operators'),
        })
        var t
      }
    },
    46148: (e, t, o) => {
      var r
      o.d(t, { CompareOption: () => r }),
        ((e) => {
          ;(e[(e.SamePctScale = 0)] = 'SamePctScale'),
            (e[(e.NewPriceScale = 1)] = 'NewPriceScale'),
            (e[(e.NewPane = 2)] = 'NewPane'),
            (e[(e.SameScale = 3)] = 'SameScale')
        })(r || (r = {}))
    },
    37558: (e, t, o) => {
      o.d(t, { DrawerContext: () => s, DrawerManager: () => n })
      var r = o(50959),
        a = o(99054)
      class n extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._isBodyFixed = !1),
            (this._addDrawer = (e) => {
              this.setState((t) => ({ stack: [...t.stack, e] }))
            }),
            (this._removeDrawer = (e) => {
              this.setState((t) => ({ stack: t.stack.filter((t) => t !== e) }))
            }),
            (this.state = { stack: [] })
        }
        componentDidUpdate(e, t) {
          !t.stack.length &&
            this.state.stack.length &&
            ((0, a.setFixedBodyState)(!0), (this._isBodyFixed = !0)),
            t.stack.length &&
              !this.state.stack.length &&
              this._isBodyFixed &&
              ((0, a.setFixedBodyState)(!1), (this._isBodyFixed = !1))
        }
        componentWillUnmount() {
          this.state.stack.length &&
            this._isBodyFixed &&
            (0, a.setFixedBodyState)(!1)
        }
        render() {
          return r.createElement(
            s.Provider,
            {
              value: {
                addDrawer: this._addDrawer,
                removeDrawer: this._removeDrawer,
                currentDrawer: this.state.stack.length
                  ? this.state.stack[this.state.stack.length - 1]
                  : null,
              },
            },
            this.props.children,
          )
        }
      }
      const s = r.createContext(null)
    },
    41590: (e, t, o) => {
      o.d(t, { Drawer: () => m })
      var r = o(50959),
        a = o(50151),
        n = o(97754),
        s = o(36174),
        i = o(42842),
        l = o(37558),
        c = o(29197),
        d = o(86656),
        u = o(66076)
      function m(e) {
        const {
            position: t = 'Bottom',
            onClose: o,
            children: d,
            className: m,
            theme: p = u,
          } = e,
          v = (0, a.ensureNotNull)((0, r.useContext)(l.DrawerContext)),
          [f] = (0, r.useState)(() => (0, s.randomHash)()),
          b = (0, r.useRef)(null),
          g = (0, r.useContext)(c.CloseDelegateContext)
        return (
          (0, r.useLayoutEffect)(
            () => (
              (0, a.ensureNotNull)(b.current).focus({
                preventScroll: !0,
              }),
              g.subscribe(v, o),
              v.addDrawer(f),
              () => {
                v.removeDrawer(f), g.unsubscribe(v, o)
              }
            ),
            [],
          ),
          r.createElement(
            i.Portal,
            null,
            r.createElement(
              'div',
              { className: n(u.wrap, u[`position${t}`]) },
              f === v.currentDrawer &&
                r.createElement('div', { className: u.backdrop, onClick: o }),
              r.createElement(
                h,
                {
                  className: n(p.drawer, u[`position${t}`], m),
                  ref: b,
                  'data-name': e['data-name'],
                },
                d,
              ),
            ),
          )
        )
      }
      const h = (0, r.forwardRef)((e, t) => {
        const { className: o, ...a } = e
        return r.createElement(d.TouchScrollContainer, {
          className: n(u.drawer, o),
          tabIndex: -1,
          ref: t,
          ...a,
        })
      })
    },
    70412: (e, t, o) => {
      o.d(t, {
        hoverMouseEventFilter: () => n,
        useAccurateHover: () => s,
        useHover: () => a,
      })
      var r = o(50959)
      function a() {
        const [e, t] = (0, r.useState)(!1)
        return [
          e,
          {
            onMouseOver: (e) => {
              n(e) && t(!0)
            },
            onMouseOut: (e) => {
              n(e) && t(!1)
            },
          },
        ]
      }
      function n(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function s(e) {
        const [t, o] = (0, r.useState)(!1)
        return (
          (0, r.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return
              const r = e.current.contains(t.target)
              o(r)
            }
            return (
              document.addEventListener('mouseover', t),
              () => document.removeEventListener('mouseover', t)
            )
          }, []),
          t
        )
      }
    },
    90692: (e, t, o) => {
      o.d(t, { MatchMedia: () => a })
      var r = o(50959)
      class a extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._handleChange = () => {
              this.forceUpdate()
            }),
            (this.state = { query: window.matchMedia(this.props.rule) })
        }
        componentDidMount() {
          this._subscribe(this.state.query)
        }
        componentDidUpdate(e, t) {
          this.state.query !== t.query &&
            (this._unsubscribe(t.query), this._subscribe(this.state.query))
        }
        componentWillUnmount() {
          this._unsubscribe(this.state.query)
        }
        render() {
          return this.props.children(this.state.query.matches)
        }
        static getDerivedStateFromProps(e, t) {
          return e.rule !== t.query.media
            ? { query: window.matchMedia(e.rule) }
            : null
        }
        _subscribe(e) {
          e.addListener(this._handleChange)
        }
        _unsubscribe(e) {
          e.removeListener(this._handleChange)
        }
      }
    },
    16396: (e, t, o) => {
      o.d(t, { DEFAULT_POPUP_MENU_ITEM_THEME: () => c, PopupMenuItem: () => u })
      var r = o(50959),
        a = o(97754),
        n = o(51768),
        s = o(59064),
        i = o(76068),
        l = o(71986)
      const c = l
      function d(e) {
        e.stopPropagation()
      }
      function u(e) {
        const {
            id: t,
            role: o,
            className: c,
            title: u,
            labelRowClassName: m,
            labelClassName: h,
            toolboxClassName: p,
            shortcut: v,
            forceShowShortcuts: f,
            icon: b,
            iconClassname: g,
            isActive: y,
            isDisabled: _,
            isHovered: S,
            appearAsDisabled: k,
            label: x,
            link: w,
            showToolboxOnHover: I,
            showToolboxOnFocus: C,
            target: N,
            rel: E,
            toolbox: M,
            reference: D,
            onMouseOut: z,
            onMouseOver: L,
            onKeyDown: T,
            suppressToolboxClick: A = !0,
            theme: B = l,
            tabIndex: j,
            tagName: P,
            renderComponent: H,
            roundedIcon: R,
            iconAriaProps: O,
            circleLogo: W,
            dontClosePopup: F,
            onClick: U,
            onClickArg: Y,
            trackEventObject: q,
            trackMouseWheelClick: K,
            trackRightClick: V,
            ...Z
          } = e,
          G = (0, r.useRef)(null),
          J = (0, r.useMemo)(
            () =>
              ((e) => {
                function t(t) {
                  const { reference: o, ...a } = t,
                    n = null != e ? e : a.href ? 'a' : 'div',
                    s =
                      'a' === n
                        ? a
                        : ((e) => {
                            const {
                              download: t,
                              href: o,
                              hrefLang: r,
                              media: a,
                              ping: n,
                              rel: s,
                              target: i,
                              type: l,
                              referrerPolicy: c,
                              ...d
                            } = e
                            return d
                          })(a)
                  return r.createElement(n, { ...s, ref: o })
                }
                return (t.displayName = `DefaultComponent(${e})`), t
              })(P),
            [P],
          ),
          X = null != H ? H : J
        return r.createElement(
          X,
          {
            ...Z,
            id: t,
            role: o,
            className: a(c, B.item, b && B.withIcon, {
              [B.isActive]: y,
              [B.isDisabled]: _ || k,
              [B.hovered]: S,
            }),
            title: u,
            href: w,
            target: N,
            rel: E,
            reference: (e) => {
              ;(G.current = e), 'function' == typeof D && D(e)
              'object' == typeof D && (D.current = e)
            },
            onClick: (e) => {
              if (_) return
              q && (0, n.trackEvent)(q.category, q.event, q.label)
              U && U(Y, e)
              F || (0, s.globalCloseMenu)()
            },
            onContextMenu: (e) => {
              q &&
                V &&
                (0, n.trackEvent)(q.category, q.event, `${q.label}_rightClick`)
            },
            onMouseUp: (e) => {
              if (1 === e.button && w && q) {
                let e = q.label
                K && (e += '_mouseWheelClick'),
                  (0, n.trackEvent)(q.category, q.event, e)
              }
            },
            onMouseOver: L,
            onMouseOut: z,
            onKeyDown: T,
            tabIndex: j,
          },
          W &&
            r.createElement(i.CircleLogo, {
              ...O,
              className: l['disclosure-item-circle-logo'],
              size: 'xxxsmall',
              logoUrl: W.logoUrl,
              placeholderLetter: W.placeholderLetter,
            }),
          b &&
            r.createElement('span', {
              'aria-label': O && O['aria-label'],
              'aria-hidden': O && Boolean(O['aria-hidden']),
              className: a(B.icon, R && l['round-icon'], g),
              dangerouslySetInnerHTML: { __html: b },
            }),
          r.createElement(
            'span',
            { className: a(B.labelRow, m) },
            r.createElement('span', { className: a(B.label, h) }, x),
          ),
          (void 0 !== v || f) &&
            r.createElement(
              'span',
              { className: B.shortcut },
              (Q = v) && Q.split('+').join(' + '),
            ),
          void 0 !== M &&
            r.createElement(
              'span',
              {
                onClick: A ? d : void 0,
                className: a(p, B.toolbox, {
                  [B.showOnHover]: I,
                  [B.showOnFocus]: C,
                }),
              },
              M,
            ),
        )
        var Q
      }
    },
    29197: (e, t, o) => {
      o.d(t, { CloseDelegateContext: () => n })
      var r = o(50959),
        a = o(59064)
      const n = r.createContext(a.globalCloseDelegate)
    },
    42842: (e, t, o) => {
      o.d(t, { Portal: () => l, PortalContext: () => c })
      var r = o(50959),
        a = o(962),
        n = o(25931),
        s = o(67961),
        i = o(99663)
      class l extends r.PureComponent {
        constructor() {
          super(...arguments), (this._uuid = (0, n.nanoid)())
        }
        componentWillUnmount() {
          this._manager().removeWindow(this._uuid)
        }
        render() {
          const e = this._manager().ensureWindow(
            this._uuid,
            this.props.layerOptions,
          )
          return (
            (e.style.top = this.props.top || ''),
            (e.style.bottom = this.props.bottom || ''),
            (e.style.left = this.props.left || ''),
            (e.style.right = this.props.right || ''),
            (e.style.pointerEvents = this.props.pointerEvents || ''),
            this.props.className && e.classList.add(this.props.className),
            this.props['aria-hidden'] && e.setAttribute('aria-hidden', 'true'),
            a.createPortal(
              r.createElement(c.Provider, { value: this }, this.props.children),
              e,
            )
          )
        }
        moveToTop() {
          this._manager().moveToTop(this._uuid)
        }
        _manager() {
          return null === this.context
            ? (0, s.getRootOverlapManager)()
            : this.context
        }
      }
      l.contextType = i.SlotContext
      const c = r.createContext(null)
    },
    86656: (e, t, o) => {
      o.d(t, { TouchScrollContainer: () => i })
      var r = o(50959),
        a = o(59142),
        n = o(50151),
        s = o(49483)
      const i = (0, r.forwardRef)((e, t) => {
        const { children: o, ...n } = e,
          i = (0, r.useRef)(null)
        return (
          (0, r.useImperativeHandle)(t, () => i.current),
          (0, r.useLayoutEffect)(() => {
            if (s.CheckMobile.iOS())
              return (
                null !== i.current &&
                  (0, a.disableBodyScroll)(i.current, { allowTouchMove: l(i) }),
                () => {
                  null !== i.current && (0, a.enableBodyScroll)(i.current)
                }
              )
          }, []),
          r.createElement('div', { ref: i, ...n }, o)
        )
      })
      function l(e) {
        return (t) => {
          const o = (0, n.ensureNotNull)(e.current),
            r = document.activeElement
          return (
            !o.contains(t) || (null !== r && o.contains(r) && r.contains(t))
          )
        }
      }
    },
    65890: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>'
    },
    39750: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M7 15l5 5L23 9"/></svg>'
    },
    93986: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121 120" width="121" height="120"><path fill="#D1D4DC" d="M53.88 18.36a43.4 43.4 0 0 1 11.24 0 1 1 0 0 0 .26-1.98 45.42 45.42 0 0 0-11.76 0 1 1 0 1 0 .26 1.98zM43.04 21.26a1 1 0 0 0-.77-1.85A44.95 44.95 0 0 0 32.1 25.3a1 1 0 0 0 1.22 1.58 42.95 42.95 0 0 1 9.72-5.62zM75.42 19.96a1 1 0 0 1 1.3-.55A44.95 44.95 0 0 1 86.9 25.3a1 1 0 0 1-1.22 1.58 42.95 42.95 0 0 0-9.72-5.62 1 1 0 0 1-.54-1.3zM25.38 34.82a1 1 0 1 0-1.58-1.22 44.95 44.95 0 0 0-5.89 10.17 1 1 0 0 0 1.85.77 42.95 42.95 0 0 1 5.62-9.72zM16.86 55.38a1 1 0 0 0-1.98-.26 45.42 45.42 0 0 0 0 11.76 1 1 0 1 0 1.98-.26 43.4 43.4 0 0 1 0-11.24zM103 54.26a1 1 0 0 1 1.12.86 45.4 45.4 0 0 1 0 11.76 1 1 0 0 1-1.98-.26 43.37 43.37 0 0 0 0-11.24 1 1 0 0 1 .86-1.12zM19.76 77.46a1 1 0 0 0-1.85.77A44.95 44.95 0 0 0 23.8 88.4a1 1 0 0 0 1.58-1.22 42.95 42.95 0 0 1-5.62-9.72zM100.54 76.92a1 1 0 0 1 .54 1.3A44.95 44.95 0 0 1 95.2 88.4a1 1 0 0 1-1.58-1.22 42.95 42.95 0 0 0 5.62-9.72 1 1 0 0 1 1.3-.54zM33.32 95.12a1 1 0 1 0-1.22 1.58 44.94 44.94 0 0 0 10.17 5.88 1 1 0 0 0 .77-1.84 42.97 42.97 0 0 1-9.72-5.62zM87.08 95.3a1 1 0 0 1-.18 1.4 44.94 44.94 0 0 1-10.17 5.88 1 1 0 0 1-.77-1.84 42.98 42.98 0 0 0 9.72-5.62 1 1 0 0 1 1.4.18zM53.88 103.64a1 1 0 0 0-.26 1.98 45.4 45.4 0 0 0 11.76 0 1 1 0 0 0-.26-1.98 43.37 43.37 0 0 1-11.24 0zM62.81 53.17a1 1 0 0 0-.78 1.84 6.62 6.62 0 0 1 3.49 3.5 1 1 0 1 0 1.84-.78 8.62 8.62 0 0 0-4.55-4.56z"/><path fill="#D1D4DC" d="M45.5 61a14 14 0 1 1 24.28 9.5l7.92 7.92a1 1 0 0 1-1.42 1.42l-7.96-7.97A14 14 0 0 1 45.5 61zm14-12a12 12 0 1 0 0 24 12 12 0 0 0 0-24z"/><circle fill="#1976D2" cx="97.5" cy="39" r="13"/><path fill="#D1D4DC" d="M98.5 34a1 1 0 1 0-2 0v4h-4a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 0 0 0-2h-4v-4z"/></svg>'
    },
    15550: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121 120" width="121" height="120"><path fill="#1E222D" d="M53.88 18.36a43.4 43.4 0 0 1 11.24 0 1 1 0 0 0 .26-1.98 45.42 45.42 0 0 0-11.76 0 1 1 0 1 0 .26 1.98zM43.04 21.26a1 1 0 0 0-.77-1.85A44.95 44.95 0 0 0 32.1 25.3a1 1 0 0 0 1.22 1.58 42.95 42.95 0 0 1 9.72-5.62zM75.42 19.96a1 1 0 0 1 1.3-.55A44.95 44.95 0 0 1 86.9 25.3a1 1 0 0 1-1.22 1.58 42.95 42.95 0 0 0-9.72-5.62 1 1 0 0 1-.54-1.3zM25.38 34.82a1 1 0 1 0-1.58-1.22 44.95 44.95 0 0 0-5.89 10.17 1 1 0 0 0 1.85.77 42.95 42.95 0 0 1 5.62-9.72zM16.86 55.38a1 1 0 0 0-1.98-.26 45.42 45.42 0 0 0 0 11.76 1 1 0 1 0 1.98-.26 43.4 43.4 0 0 1 0-11.24zM103 54.26a1 1 0 0 1 1.12.86 45.4 45.4 0 0 1 0 11.76 1 1 0 0 1-1.98-.26 43.37 43.37 0 0 0 0-11.24 1 1 0 0 1 .86-1.12zM19.76 77.46a1 1 0 0 0-1.85.77A44.95 44.95 0 0 0 23.8 88.4a1 1 0 0 0 1.58-1.22 42.95 42.95 0 0 1-5.62-9.72zM100.54 76.92a1 1 0 0 1 .54 1.3A44.95 44.95 0 0 1 95.2 88.4a1 1 0 0 1-1.58-1.22 42.95 42.95 0 0 0 5.62-9.72 1 1 0 0 1 1.3-.54zM33.32 95.12a1 1 0 1 0-1.22 1.58 44.94 44.94 0 0 0 10.17 5.88 1 1 0 0 0 .77-1.84 42.97 42.97 0 0 1-9.72-5.62zM87.08 95.3a1 1 0 0 1-.18 1.4 44.94 44.94 0 0 1-10.17 5.88 1 1 0 0 1-.77-1.84 42.98 42.98 0 0 0 9.72-5.62 1 1 0 0 1 1.4.18zM53.88 103.64a1 1 0 0 0-.26 1.98 45.4 45.4 0 0 0 11.76 0 1 1 0 0 0-.26-1.98 43.37 43.37 0 0 1-11.24 0zM62.81 53.17a1 1 0 0 0-.78 1.84 6.62 6.62 0 0 1 3.49 3.5 1 1 0 1 0 1.84-.78 8.62 8.62 0 0 0-4.55-4.56z"/><path fill="#1E222D" d="M45.5 61a14 14 0 1 1 24.28 9.5l7.92 7.92a1 1 0 0 1-1.42 1.42l-7.96-7.97A14 14 0 0 1 45.5 61zm14-12a12 12 0 1 0 0 24 12 12 0 0 0 0-24z"/><circle fill="#2196F3" cx="97.5" cy="39" r="13"/><path fill="#fff" d="M98.5 34a1 1 0 1 0-2 0v4h-4a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 0 0 0-2h-4v-4z"/></svg>'
    },
    16936: (e) => {
      e.exports = {
        ar: ['عودة'],
        ca_ES: ['Enrere'],
        cs: 'Back',
        de: ['Zurück'],
        el: 'Back',
        en: 'Back',
        es: ['Atrás'],
        fa: 'Back',
        fr: ['Retour'],
        he_IL: ['חזור'],
        hu_HU: 'Back',
        id_ID: ['Kembali'],
        it: ['Indietro'],
        ja: ['戻る'],
        ko: ['뒤로'],
        ms_MY: ['Kembali'],
        nl_NL: 'Back',
        pl: ['Cofnij'],
        pt: ['Voltar'],
        ro: 'Back',
        ru: ['Назад'],
        sv: ['Tillbaka'],
        th: ['กลับไป'],
        tr: ['Geri'],
        vi: ['Quay lại'],
        zh: ['返回'],
        zh_TW: ['返回'],
      }
    },
    9898: (e) => {
      e.exports = {
        ar: ['حق'],
        ca_ES: ['Right (dret de subscripció)'],
        cs: 'Right',
        de: ['Rechter'],
        el: 'Right',
        en: 'Right',
        es: ['Right (derecho de suscripción)'],
        fa: 'Right',
        fr: ['De droite'],
        he_IL: ['זכות Right'],
        hu_HU: 'Right',
        id_ID: ['Kanan'],
        it: ['Diritto'],
        ja: ['ストックオプション'],
        ko: ['라이트'],
        ms_MY: ['Benar'],
        nl_NL: 'Right',
        pl: ['Prawo do udostępniania'],
        pt: ['Direita'],
        ro: 'Right',
        ru: ['Право на акцию'],
        sv: ['Höger'],
        th: ['สิทธิ'],
        tr: ['Sağ'],
        vi: ['Phải'],
        zh: ['认股权'],
        zh_TW: ['認股權'],
      }
    },
    22320: (e) => {
      e.exports = {
        ar: ['مقارنة الرمز'],
        ca_ES: ['Compara el símbol'],
        cs: 'Compare symbol',
        de: ['Symbol vergleichen'],
        el: 'Compare symbol',
        en: 'Compare symbol',
        es: ['Comparar el símbolo'],
        fa: 'Compare symbol',
        fr: ['Comparer le symbole'],
        he_IL: ['השווה סימול'],
        hu_HU: 'Compare symbol',
        id_ID: ['Bandingkan simbol'],
        it: ['Confronta simbolo'],
        ja: ['シンボルを比較'],
        ko: ['심볼 견주기'],
        ms_MY: ['Bandingkan simbol'],
        nl_NL: 'Compare symbol',
        pl: ['Porównaj symbol'],
        pt: ['Comparar símbolos'],
        ro: 'Compare symbol',
        ru: ['Сравнить символ'],
        sv: ['Jämför symbol'],
        th: ['เปรียบเทียบสัญลักษณ์'],
        tr: ['Sembolü karşılaştır'],
        vi: ['So sánh mã'],
        zh: ['比较商品'],
        zh_TW: ['比較商品'],
      }
    },
    20036: (e) => {
      e.exports = {
        ar: ['إلغاء'],
        ca_ES: ['Cancel·la'],
        cs: ['Zrušit'],
        de: ['Abbrechen'],
        el: ['Άκυρο'],
        en: 'Cancel',
        es: ['Cancelar'],
        fa: ['لغو'],
        fr: ['Annuler'],
        he_IL: ['ביטול'],
        hu_HU: ['Törlés'],
        id_ID: ['Batal'],
        it: ['Annulla'],
        ja: ['キャンセル'],
        ko: ['취소'],
        ms_MY: ['Batal'],
        nl_NL: ['Annuleren'],
        pl: ['Anuluj'],
        pt: ['Cancelar'],
        ro: 'Cancel',
        ru: ['Отмена'],
        sv: ['Avbryt'],
        th: ['ยกเลิก'],
        tr: ['İptal'],
        vi: ['Hủy bỏ'],
        zh: ['取消'],
        zh_TW: ['取消'],
      }
    },
    80395: (e) => {
      e.exports = {
        ar: ['إغلاق القائمة'],
        ca_ES: 'Close menu',
        cs: 'Close menu',
        de: ['Menü schließen'],
        el: 'Close menu',
        en: 'Close menu',
        es: ['Cerrar menú'],
        fa: 'Close menu',
        fr: ['Fermer le menu'],
        he_IL: ['סגור תפריט'],
        hu_HU: 'Close menu',
        id_ID: ['Pilih menu'],
        it: ['Chiudere menù'],
        ja: ['メニューを閉じる'],
        ko: ['메뉴 닫기'],
        ms_MY: ['Tutup menu'],
        nl_NL: 'Close menu',
        pl: ['Zamknij menu'],
        pt: ['Fechar menu'],
        ro: 'Close menu',
        ru: ['Закрыть меню'],
        sv: ['Stäng menyn'],
        th: ['ปิดเมนู'],
        tr: ['Menüyü kapat'],
        vi: ['Đóng menu'],
        zh: ['关闭菜单'],
        zh_TW: ['關閉選單'],
      }
    },
    79589: (e) => {
      e.exports = {
        ar: ['إضافة إلى'],
        ca_ES: ['Afegeix a'],
        cs: 'Add to',
        de: ['hinzufügen zu'],
        el: 'Add to',
        en: 'Add to',
        es: ['Añadir a'],
        fa: 'Add to',
        fr: ['Ajouter à'],
        he_IL: ['הוסף ל'],
        hu_HU: 'Add to',
        id_ID: ['Tambahkan ke'],
        it: ['Aggiungi a'],
        ja: ['追加先'],
        ko: ['~에 넣기:'],
        ms_MY: ['Tambah kepada'],
        nl_NL: 'Add to',
        pl: ['Dodaj do'],
        pt: ['Adicionar'],
        ro: 'Add to',
        ru: ['Добавить'],
        sv: ['Lägg till'],
        th: ['เพิ่มไปที่'],
        tr: ['Buna ekle:'],
        vi: ['Thêm vào'],
        zh: ['添加到'],
        zh_TW: ['增加到'],
      }
    },
    46580: (e) => {
      e.exports = {
        ar: ['الرموز المضافة'],
        ca_ES: ['Símbols afegits'],
        cs: 'Added symbols',
        de: ['Hinzugefügte Symbole'],
        el: 'Added symbols',
        en: 'Added symbols',
        es: ['Símbolos añadidos'],
        fa: 'Added symbols',
        fr: ['Symboles ajoutés'],
        he_IL: ['נוספו סימולים'],
        hu_HU: 'Added symbols',
        id_ID: ['Simbol yang ditambahkan'],
        it: ['Simboli aggiunti'],
        ja: ['追加されているシンボル'],
        ko: ['더해진 심볼들'],
        ms_MY: ['Tambah simbol-simbol'],
        nl_NL: 'Added symbols',
        pl: ['Dodane symbole'],
        pt: ['Símbolos adicionados'],
        ro: 'Added symbols',
        ru: ['Добавленные инструменты'],
        sv: ['Tillagda symboler'],
        th: ['สัญลักษณ์ที่ถูกเพิ่มมา'],
        tr: ['Semboller eklendi'],
        vi: ['Các mã đã thêm'],
        zh: ['添加商品'],
        zh_TW: ['增加商品'],
      }
    },
    64498: (e) => {
      e.exports = {
        ar: ['كل المصادر'],
        ca_ES: ['Totes les fonts'],
        cs: 'All sources',
        de: ['Alle Quellen'],
        el: 'All sources',
        en: 'All sources',
        es: ['Todas las fuentes'],
        fa: 'All sources',
        fr: ['Toutes les sources'],
        he_IL: ['כל המקורות'],
        hu_HU: 'All sources',
        id_ID: ['Seluruh sumber'],
        it: ['Tutte le fonti'],
        ja: ['すべての提供元'],
        ko: ['모든 자료'],
        ms_MY: ['Kesemua sumber'],
        nl_NL: 'All sources',
        pl: ['Wszystkie źródła'],
        pt: ['Todas as fontes'],
        ro: 'All sources',
        ru: ['Все источники'],
        sv: ['Samtliga källor'],
        th: ['แหล่งที่มาทั้งหมด'],
        tr: ['Tüm kaynaklar'],
        vi: ['Tất cả các nguồn'],
        zh: ['全部来源'],
        zh_TW: ['全部來源'],
      }
    },
    71046: (e) => {
      e.exports = {
        ar: ['السماح بتمديد النطاق الزمني'],
        ca_ES: ["Permet ampliar l'escala de temps"],
        cs: 'Allow extend time scale',
        de: ['Zeitskala verlängern lassen'],
        el: 'Allow extend time scale',
        en: 'Allow extend time scale',
        es: ['Permitir ampliar la escala de tiempo'],
        fa: 'Allow extend time scale',
        fr: ["Permettre d'étendre l'échelle de temps"],
        he_IL: ['אפשר להאריך את סולם הזמן'],
        hu_HU: 'Allow extend time scale',
        id_ID: ['Izinkan ekstensi skala waktu'],
        it: ['Permetti estensione scala temporale'],
        ja: ['時間軸の延長を許可'],
        ko: ['타임 스케일 확장을 허용합니다'],
        ms_MY: ['Benarkan pemanjangan skala masa'],
        nl_NL: 'Allow extend time scale',
        pl: ['Zezwól na rozszerzenie osi czasu'],
        pt: ['Prolongar a escala de tempo'],
        ro: 'Allow extend time scale',
        ru: ['Разрешить продолжение временной шкалы'],
        sv: ['Tillåt att förlängd tidsskala'],
        th: ['อนุญาตให้ขยายมาตราส่วนเวลา'],
        tr: ['Zaman ölçeğini uzatmaya izin ver'],
        vi: ['Cho phép mở rộng quy mô thời gian'],
        zh: ['允许延长时间坐标'],
        zh_TW: ['允許延長時間刻度'],
      }
    },
    79852: (e) => {
      e.exports = {
        ar: ['سند'],
        ca_ES: ['Bo'],
        cs: 'Bond',
        de: ['Anleihe'],
        el: 'Bond',
        en: 'Bond',
        es: ['Bono'],
        fa: 'Bond',
        fr: ['Obligation'],
        he_IL: ['אגרת חוב'],
        hu_HU: 'Bond',
        id_ID: ['Surat hutang'],
        it: ['Obbligazione'],
        ja: ['債券'],
        ko: ['채권'],
        ms_MY: ['Bon'],
        nl_NL: 'Bond',
        pl: ['Obligacja'],
        pt: ['Título'],
        ro: 'Bond',
        ru: ['Облигации'],
        sv: ['Obligation'],
        th: ['พันธบัตร'],
        tr: ['Tahvil'],
        vi: ['Trái phiếu'],
        zh: ['债券'],
        zh_TW: ['債券'],
      }
    },
    29601: (e) => {
      e.exports = {
        ar: ['الوصف'],
        ca_ES: ['Descripció'],
        cs: ['Popis'],
        de: ['Beschreibung'],
        el: 'Description',
        en: 'Description',
        es: ['Descripción'],
        fa: ['شرح'],
        fr: 'Description',
        he_IL: ['תיאור'],
        hu_HU: ['Leírás'],
        id_ID: ['Deskripsi'],
        it: ['Descrizione'],
        ja: ['詳細'],
        ko: ['설명'],
        ms_MY: ['Huraian'],
        nl_NL: ['Beschrijving'],
        pl: ['Opis'],
        pt: ['Descrição'],
        ro: 'Description',
        ru: ['Описание'],
        sv: ['Beskrivning'],
        th: ['คำอธิบาย'],
        tr: ['Açıklama'],
        vi: ['Mô tả'],
        zh: ['描述'],
        zh_TW: ['描述'],
      }
    },
    29673: (e) => {
      e.exports = {
        ar: ['لا توجد أسواق تطابق المعايير التي عينتها'],
        ca_ES: [
          'No hi ha mercats de valors que coincideixin amb els vostres criteris.',
        ],
        cs: 'No exchanges match your criteria',
        de: ['Keine Börsen entsprechen Ihren Kriterien'],
        el: 'No exchanges match your criteria',
        en: 'No exchanges match your criteria',
        es: ['No hay mercados de valores que coincidan con sus criterios.'],
        fa: 'No exchanges match your criteria',
        fr: ['Aucun échange ne correspond à vos critères'],
        he_IL: ['אין בורסות התואמות את הקריטריונים שלך'],
        hu_HU: 'No exchanges match your criteria',
        id_ID: ['Tidak ada bursa yang sesuai dengan kriteria anda'],
        it: ['Nessuna borsa corrisponde ai tuoi criteri'],
        ja: ['条件に合致する取引所はありません'],
        ko: ['조건에 맞는 익스체인지가 없음'],
        ms_MY: ['Tiada bursa saham yang memenuhi kriteria anda.'],
        nl_NL: 'No exchanges match your criteria',
        pl: ['Brak giełd spełniających Twoje kryteria'],
        pt: ['Nenhuma exchange corresponde ao seu critério'],
        ro: 'No exchanges match your criteria',
        ru: ['Нет подходящих бирж'],
        sv: ['Inga börser matchar dina kriterier'],
        th: ['ไม่มีตลาดแลกเปลี่ยนใดๆ ตรงตามเงื่อนไขของคุณ'],
        tr: ['Kriterlerinize uygun borsa yok'],
        vi: ['Không có sàn giao dịch nào khớp với yêu cầu của bạn'],
        zh: ['没有交易所符合您的条件'],
        zh_TW: ['沒有交易所符合您的條件'],
      }
    },
    42078: (e) => {
      e.exports = {
        ar: ['لا توجد رموز هنا حالياً — قم بإضافة الرموز'],
        ca_ES: ['Encara no hi ha símbols aquí, en voleu afegir algun?'],
        cs: 'No symbols here yet — why not add some?',
        de: [
          'Hier gibt es noch keine Symbole - warum nicht welche hinzufügen?',
        ],
        el: 'No symbols here yet — why not add some?',
        en: 'No symbols here yet — why not add some?',
        es: ['Todavía no hay símbolos aquí, ¿por qué no añadir algunos?'],
        fa: 'No symbols here yet — why not add some?',
        fr: ['Pas encore de symboles ici - pourquoi ne pas en ajouter ?'],
        he_IL: ['עדיין אין כאן סימולים - למה לא להוסיף כמה?'],
        hu_HU: 'No symbols here yet — why not add some?',
        id_ID: [
          'Belum ada simbol di sini — mengapa tidak menambahkan beberapa?',
        ],
        it: ['Non ci sono simboli qui. Perchè non aggiungerne alcuni?'],
        ja: ['まだシンボルがありません — 追加してみませんか？'],
        ko: ['아직 종목이 없습니다. 종목을 추가하시겠습니까?'],
        ms_MY: ['Belum ada simbol di sini - mengapa tidak menambahkannya?'],
        nl_NL: 'No symbols here yet — why not add some?',
        pl: ['Nie ma tu jeszcze żadnych symboli — chcesz coś dodać?'],
        pt: ['Não há símbolos aqui - por que não acrescentar alguns?'],
        ro: 'No symbols here yet — why not add some?',
        ru: ['Здесь еще нет инструментов — почему бы их не добавить?'],
        sv: ['Inga symboler här — ska du ta och lägga till några?'],
        th: ['ยังไม่มีสัญลักษณ์ - ทำไมไม่เพิ่มมันบ้างล่ะ?'],
        tr: ['Burada henüz sembol yok - neden biraz eklemiyorsunuz?'],
        vi: ['Không có mã giao dịch nào ở đây - tại sao không thêm một số?'],
        zh: ['这里还没有商品 — 为什么不添加一些呢？'],
        zh_TW: ['這裡還沒有商品 — 為什麼不增加一些呢？'],
      }
    },
    41379: (e) => {
      e.exports = {
        ar: ['لا توجد رموز تطابق معاييرك'],
        ca_ES: ['Cap símbol coincideix amb els vostres criteris'],
        cs: 'No symbols match your criteria',
        de: ['Für Ihre Kriterien gibt es keine übereinstimmenden Symbole'],
        el: 'No symbols match your criteria',
        en: 'No symbols match your criteria',
        es: ['Ningún símbolo coincide con sus criterios'],
        fa: 'No symbols match your criteria',
        fr: ['Aucun symbole ne correspond à vos critères'],
        he_IL: ['אין סימולים תואמים את הקריטריונים שלך'],
        hu_HU: 'No symbols match your criteria',
        id_ID: ['Tidak ada Simbol yang sesuai dengan kriteria anda'],
        it: ['Nessun simbolo corrisponde ai criteri'],
        ja: ['条件に合致するシンボルはありません'],
        ko: ['조건에 맞는 심볼이 없음'],
        ms_MY: ['Tiada Simbol yang menepati kriteria anda'],
        nl_NL: 'No symbols match your criteria',
        pl: ['Brak symboli spełniających Twoje kryteria'],
        pt: ['Nenhum símbolo compatível com seu critério'],
        ro: 'No symbols match your criteria',
        ru: ['Нет подходящих символов'],
        sv: ['Inga symboler matchar dina kriterier'],
        th: ['ไม่มีสัญลักษณ์ที่ตรงกับการค้นหาของคุณ'],
        tr: ['Kriterlerinize uygun sembol yok'],
        vi: ['Không có mã giao dịch nào khớp với tiêu chí của bạn'],
        zh: ['没有代码符合您的条件'],
        zh_TW: ['沒有商品符合您的條件'],
      }
    },
    67242: (e) => {
      e.exports = {
        ar: ['جزء جديد'],
        ca_ES: ['Nou quadre'],
        cs: 'New pane',
        de: ['Neuer Bereich'],
        el: 'New pane',
        en: 'New pane',
        es: ['Nuevo panel'],
        fa: 'New pane',
        fr: ['Nouveau volet'],
        he_IL: ['חלונית חדשה'],
        hu_HU: 'New pane',
        id_ID: ['Panel baru'],
        it: ['Nuovo pannello'],
        ja: ['新規ペイン'],
        ko: ['새 페인'],
        ms_MY: ['Panel baru'],
        nl_NL: 'New pane',
        pl: ['Nowy panel'],
        pt: ['Novo Painel'],
        ro: 'New pane',
        ru: ['Новая панель'],
        sv: ['Ny ruta'],
        th: ['หน้าต่างใหม่'],
        tr: ['Yeni bölme'],
        vi: ['Ngăn mới'],
        zh: ['新窗格'],
        zh_TW: ['新窗格'],
      }
    },
    34420: (e) => {
      e.exports = {
        ar: ['مقياس سعر جديد'],
        ca_ES: ['Nova escala de preus'],
        cs: 'New price scale',
        de: ['Neue Preisskala'],
        el: 'New price scale',
        en: 'New price scale',
        es: ['Nueva escala de precios'],
        fa: 'New price scale',
        fr: ['Nouvelle échelle de prix'],
        he_IL: ['סולם מחירים חדש'],
        hu_HU: 'New price scale',
        id_ID: ['Skala harga baru'],
        it: ['Nuova scala di prezzo'],
        ja: ['新しい価格スケール'],
        ko: ['새 프라이스 스케일'],
        ms_MY: ['Skala harga baru'],
        nl_NL: 'New price scale',
        pl: ['Nowa skala cen'],
        pt: ['Nova escala de preço'],
        ro: 'New price scale',
        ru: ['Новая ценовая шкала'],
        sv: ['Ny prisskala'],
        th: ['สเกลราคาใหม่'],
        tr: ['Yeni fiyat ölçeği'],
        vi: ['Khung giá mới'],
        zh: ['新价格坐标'],
        zh_TW: ['新的價格刻度'],
      }
    },
    19724: (e) => {
      e.exports = {
        ar: ['مصادر'],
        ca_ES: ['Fonts'],
        cs: 'Sources',
        de: ['Quellen'],
        el: 'Sources',
        en: 'Sources',
        es: ['Fuentes'],
        fa: 'Sources',
        fr: 'Sources',
        he_IL: ['מקורות'],
        hu_HU: 'Sources',
        id_ID: ['Sumber'],
        it: ['Fonti'],
        ja: ['情報源'],
        ko: ['자료'],
        ms_MY: ['Sumber-sumber'],
        nl_NL: 'Sources',
        pl: ['Źródła'],
        pt: ['Fontes'],
        ro: 'Sources',
        ru: ['Источники'],
        sv: ['Källor'],
        th: ['แหล่งที่มา'],
        tr: ['Kaynak'],
        vi: ['Nguồn'],
        zh: ['来源'],
        zh_TW: ['來源'],
      }
    },
    82642: (e) => {
      e.exports = {
        ar: ['نفس مقياس %'],
        ca_ES: ['Mateixa escala de %'],
        cs: 'Same % scale',
        de: ['Selbe % Skala'],
        el: 'Same % scale',
        en: 'Same % scale',
        es: ['Misma escala de %'],
        fa: 'Same % scale',
        fr: ['Même échelle %'],
        he_IL: ['אותו סולם%'],
        hu_HU: 'Same % scale',
        id_ID: ['% skala yang sama'],
        it: ['Stessa scala %'],
        ja: ['同じ％スケール'],
        ko: ['같은 % 스케일'],
        ms_MY: ['Skala % yang sama'],
        nl_NL: 'Same % scale',
        pl: ['Ta sama skala %'],
        pt: ['Mesma escala %'],
        ro: 'Same % scale',
        ru: ['Та же % шкала'],
        sv: ['Samma %-skala'],
        th: ['เหมือน % สเกล'],
        tr: ['Aynı % ölçek'],
        vi: ['Cùng % quy mô'],
        zh: ['相同%坐标'],
        zh_TW: ['相同%刻度'],
      }
    },
    17547: (e) => {
      e.exports = {
        ar: ['نفس المقياس'],
        ca_ES: ['Mateixa escala'],
        cs: 'Same scale',
        de: ['Selbe Skala'],
        el: 'Same scale',
        en: 'Same scale',
        es: ['Misma escala'],
        fa: 'Same scale',
        fr: ['Même échelle'],
        he_IL: ['אותו קנה מידה'],
        hu_HU: 'Same scale',
        id_ID: ['Skala yang sama'],
        it: ['Stessa scala'],
        ja: ['同じスケール'],
        ko: ['같은 스케일'],
        ms_MY: ['Skala sama'],
        nl_NL: 'Same scale',
        pl: ['Ta sama skala'],
        pt: ['Mesma escala'],
        ro: 'Same scale',
        ru: ['Та же шкала'],
        sv: ['Samma skala'],
        th: ['เหมือน % สเกล'],
        tr: ['Aynı ölçek'],
        vi: ['Thang tương tự'],
        zh: ['相同坐标'],
        zh_TW: ['相同的刻度'],
      }
    },
    52298: (e) => {
      e.exports = {
        ar: ['بحث'],
        ca_ES: ['Cercar'],
        cs: ['Hledat'],
        de: ['Suche'],
        el: ['Αναζήτησή'],
        en: 'Search',
        es: ['Buscar'],
        fa: ['جستجو'],
        fr: ['Chercher'],
        he_IL: ['חפש'],
        hu_HU: ['Keresés'],
        id_ID: ['Cari'],
        it: ['Cerca'],
        ja: ['検索'],
        ko: ['찾기'],
        ms_MY: ['Cari'],
        nl_NL: ['Zoeken'],
        pl: ['Szukaj'],
        pt: ['Pesquisar'],
        ro: 'Search',
        ru: ['Поиск'],
        sv: ['Sök'],
        th: ['ค้นหา'],
        tr: ['Ara'],
        vi: ['Tìm kiếm'],
        zh: ['搜索'],
        zh_TW: ['搜尋'],
      }
    },
    13269: (e) => {
      e.exports = {
        ar: ['اختر مصدراً'],
        ca_ES: ['Selecciona font'],
        cs: 'Select source',
        de: ['Quelle wählen'],
        el: 'Select source',
        en: 'Select source',
        es: ['Seleccionar fuente'],
        fa: 'Select source',
        fr: ['Sélectionner la source'],
        he_IL: ['בחר מקור'],
        hu_HU: 'Select source',
        id_ID: ['Pilih sumber'],
        it: ['Seleziona fonte'],
        ja: ['情報源を選択'],
        ko: ['자료 선택'],
        ms_MY: ['Pilih sumber'],
        nl_NL: 'Select source',
        pl: ['Wybierz źródło'],
        pt: ['Selecionar fonte'],
        ro: 'Select source',
        ru: ['Выбрать источник'],
        sv: ['Välj källa'],
        th: ['เลือกแหล่งที่มา'],
        tr: ['Kaynak seç'],
        vi: ['Chọn nguồn'],
        zh: ['选择来源'],
        zh_TW: ['選擇來源'],
      }
    },
    89053: (e) => {
      e.exports = {
        ar: ['رمز'],
        ca_ES: ['Símbol'],
        cs: 'Symbol',
        de: 'Symbol',
        el: ['Σύμβολο'],
        en: 'Symbol',
        es: ['Símbolo'],
        fa: ['نماد'],
        fr: ['Symbole'],
        he_IL: ['סימול'],
        hu_HU: ['Szimbólum'],
        id_ID: ['Simbol'],
        it: ['Simbolo'],
        ja: ['シンボル'],
        ko: ['심볼'],
        ms_MY: ['Simbol'],
        nl_NL: ['Symbool'],
        pl: 'Symbol',
        pt: ['Símbolo'],
        ro: 'Symbol',
        ru: ['Инструмент'],
        sv: 'Symbol',
        th: ['สัญลักษณ์'],
        tr: ['Sembol'],
        vi: ['Mã'],
        zh: ['商品代码'],
        zh_TW: ['商品代碼'],
      }
    },
    48490: (e) => {
      e.exports = {
        ar: ['الرمز والوصف'],
        ca_ES: ['Símbol i descripció'],
        cs: 'Symbol & description',
        de: ['Symbol & Beschreibung'],
        el: 'Symbol & description',
        en: 'Symbol & description',
        es: ['Símbolo y descripción'],
        fa: 'Symbol & description',
        fr: ['Symbole & description'],
        he_IL: ['סימול ותיאור'],
        hu_HU: 'Symbol & description',
        id_ID: ['Simbol & deskripsi'],
        it: ['Simbolo e descrizione'],
        ja: ['シンボル & 詳細'],
        ko: ['심볼 & 설명'],
        ms_MY: ['Simbol & penjelasan'],
        nl_NL: 'Symbol & description',
        pl: ['Symbol i opis'],
        pt: ['Símbolo & descrição'],
        ro: 'Symbol & description',
        ru: ['Инструмент и описание'],
        sv: ['Symbol & beskrivning'],
        th: ['สัญลักษณ์และคำอธิบาย'],
        tr: ['Sembol ve açıklama'],
        vi: ['Mã giao dịch & mô tả'],
        zh: ['商品和描述'],
        zh_TW: ['商品&描述'],
      }
    },
    99983: (e) => {
      e.exports = {
        ar: ['بحث عن الرموز'],
        ca_ES: ['Cerca de símbols'],
        cs: 'Symbol Search',
        de: ['Symbol Suche'],
        el: 'Symbol Search',
        en: 'Symbol Search',
        es: ['Búsqueda de símbolos'],
        fa: 'Symbol Search',
        fr: ['Recherche de symbole'],
        he_IL: ['חיפוש סימולים'],
        hu_HU: 'Symbol Search',
        id_ID: ['Pencarian Simbol'],
        it: ['Ricerca simbolo'],
        ja: ['シンボル検索'],
        ko: ['심볼 찾기'],
        ms_MY: ['Cari simbol'],
        nl_NL: 'Symbol Search',
        pl: ['Wyszukiwanie symboli'],
        pt: ['Pesquisa de Símbolo'],
        ro: 'Symbol Search',
        ru: ['Поиск инструментов'],
        sv: ['Symbolsök'],
        th: ['ค้นหาตัวย่อ'],
        tr: ['Sembol Arama'],
        vi: ['Tìm kiếm Mã giao dịch'],
        zh: ['商品代码搜索'],
        zh_TW: ['商品搜尋'],
      }
    },
    57570: (e) => {
      e.exports = {
        ar: ['الرموز الحديثة'],
        ca_ES: ['Símbols recents'],
        cs: 'Recent symbols',
        de: ['Letzte Symbole'],
        el: 'Recent symbols',
        en: 'Recent symbols',
        es: ['Símbolos recientes'],
        fa: 'Recent symbols',
        fr: ['Symboles récents'],
        he_IL: ['סימולים אחרונים'],
        hu_HU: 'Recent symbols',
        id_ID: ['Simbol terbaru'],
        it: ['Simboli recenti'],
        ja: ['最近のシンボル'],
        ko: ['최근 심볼들'],
        ms_MY: ['Simbol-simbol terbaru'],
        nl_NL: 'Recent symbols',
        pl: ['Niedawne symbole'],
        pt: ['Símbolos recentes'],
        ro: 'Recent symbols',
        ru: ['Недавние инструменты'],
        sv: ['Senaste symboler'],
        th: ['สัญลักษณ์ล่าสุด'],
        tr: ['Son semboller'],
        vi: ['Các mã gần đây'],
        zh: ['最近的商品'],
        zh_TW: ['最近的商品'],
      }
    },
    12629: (e) => {
      e.exports = {
        ar: ['السلع'],
        ca_ES: 'commodity',
        cs: 'commodity',
        de: ['Rohstoff'],
        el: 'commodity',
        en: 'commodity',
        es: ['materia prima'],
        fa: 'commodity',
        fr: ['produit de base'],
        he_IL: ['סחורה'],
        hu_HU: 'commodity',
        id_ID: ['komiditas'],
        it: ['materia prima'],
        ja: ['コモディティ'],
        ko: ['상품'],
        ms_MY: ['komoditi'],
        nl_NL: 'commodity',
        pl: ['towar'],
        pt: 'commodity',
        ro: 'commodity',
        ru: ['товары'],
        sv: ['Råvaror'],
        th: ['คอมมอดิตี้'],
        tr: ['Emtia'],
        vi: ['hàng hóa'],
        zh: ['商品'],
        zh_TW: ['商品'],
      }
    },
    87592: (e) => {
      e.exports = {
        ar: ['عقود الفروقات'],
        ca_ES: 'cfd',
        cs: 'cfd',
        de: 'cfd',
        el: 'cfd',
        en: 'cfd',
        es: 'cfd',
        fa: 'cfd',
        fr: 'cfd',
        he_IL: ['חוזה הפרשים cfd'],
        hu_HU: 'cfd',
        id_ID: 'cfd',
        it: 'cfd',
        ja: ['CFD'],
        ko: ['씨에프디'],
        ms_MY: 'cfd',
        nl_NL: 'cfd',
        pl: 'cfd',
        pt: 'cfd',
        ro: 'cfd',
        ru: 'cfd',
        sv: 'cfd',
        th: 'cfd',
        tr: 'cfd',
        vi: 'cfd',
        zh: ['差价合约'],
        zh_TW: 'cfd',
      }
    },
    8448: (e) => {
      e.exports = {
        ar: ['العملات الرقمية'],
        ca_ES: ['cripto'],
        cs: 'crypto',
        de: 'crypto',
        el: 'crypto',
        en: 'crypto',
        es: ['cripto'],
        fa: 'crypto',
        fr: 'crypto',
        he_IL: ['קריפטו'],
        hu_HU: ['kripto'],
        id_ID: 'crypto',
        it: ['cripto'],
        ja: ['暗号'],
        ko: ['크립토'],
        ms_MY: ['kripto'],
        nl_NL: 'crypto',
        pl: ['krypto'],
        pt: ['Cripto'],
        ro: 'crypto',
        ru: ['криптовалюты'],
        sv: ['krypto'],
        th: ['คริปโต'],
        tr: ['kripto'],
        vi: ['tiền điện tử'],
        zh: ['加密'],
        zh_TW: 'crypto',
      }
    },
    67245: (e) => {
      e.exports = {
        ar: ['إيصال إيداع'],
        ca_ES: 'dr',
        cs: 'dr',
        de: 'dr',
        el: 'dr',
        en: 'dr',
        es: 'dr',
        fa: 'dr',
        fr: 'dr',
        he_IL: 'dr',
        hu_HU: 'dr',
        id_ID: 'dr',
        it: 'dr',
        ja: ['預託証券'],
        ko: 'dr',
        ms_MY: 'dr',
        nl_NL: 'dr',
        pl: ['Potwierdzenie wpłaty'],
        pt: 'dr',
        ro: 'dr',
        ru: ['Депоз. расписки'],
        sv: 'dr',
        th: 'dr',
        tr: 'dr',
        vi: 'dr',
        zh: 'dr',
        zh_TW: 'dr',
      }
    },
    88720: (e) => {
      e.exports = {
        ar: ['اقتصاد'],
        ca_ES: ['economia'],
        cs: 'economy',
        de: ['Wirtschaft'],
        el: 'economy',
        en: 'economy',
        es: ['economía'],
        fa: 'economy',
        fr: ['économie'],
        he_IL: ['כַּלְכָּלָה'],
        hu_HU: 'economy',
        id_ID: ['ekonomi'],
        it: ['economia'],
        ja: ['経済指標'],
        ko: ['경제'],
        ms_MY: ['ekonomi'],
        nl_NL: 'economy',
        pl: ['gospodarka'],
        pt: ['economia'],
        ro: 'economy',
        ru: ['экономические данные'],
        sv: ['ekonomi'],
        th: ['เศรษฐกิจ'],
        tr: ['ekonomi'],
        vi: ['kinh tế'],
        zh: ['经济'],
        zh_TW: ['經濟'],
      }
    },
    39512: (e) => {
      e.exports = {
        ar: ['فوركس'],
        ca_ES: ['Forex'],
        cs: 'forex',
        de: ['Devisen'],
        el: 'forex',
        en: 'forex',
        es: ['Forex'],
        fa: 'forex',
        fr: ['Forex'],
        he_IL: ['מט"ח'],
        hu_HU: 'forex',
        id_ID: 'forex',
        it: 'forex',
        ja: ['FX'],
        ko: ['외환'],
        ms_MY: 'forex',
        nl_NL: 'forex',
        pl: 'forex',
        pt: 'forex',
        ro: 'forex',
        ru: ['форекс'],
        sv: ['valutor'],
        th: ['ฟอเร็กซ์'],
        tr: ['döviz'],
        vi: 'forex',
        zh: ['外汇'],
        zh_TW: ['外匯'],
      }
    },
    81859: (e) => {
      e.exports = {
        ar: ['العقود الآجلة'],
        ca_ES: ['futurs'],
        cs: 'futures',
        de: ['Futures'],
        el: 'futures',
        en: 'futures',
        es: ['futuros'],
        fa: 'futures',
        fr: 'futures',
        he_IL: ['חוזים עתידיים'],
        hu_HU: 'futures',
        id_ID: ['kontrak berjangka'],
        it: ['future'],
        ja: ['先物'],
        ko: ['퓨쳐스'],
        ms_MY: ['pasaran hadapan'],
        nl_NL: 'futures',
        pl: ['Kontrakty terminowe'],
        pt: ['futuros'],
        ro: 'futures',
        ru: ['фьючерсы'],
        sv: ['terminer'],
        th: ['ฟิวเจอร์ส'],
        tr: ['vadeli'],
        vi: ['hợp đồng tương lai'],
        zh: ['期货'],
        zh_TW: ['期貨'],
      }
    },
    12754: (e) => {
      e.exports = {
        ar: ['مؤشر'],
        ca_ES: ['índex'],
        cs: 'index',
        de: ['Index'],
        el: 'index',
        en: 'index',
        es: ['índice'],
        fa: 'index',
        fr: ['indice'],
        he_IL: ['מדד'],
        hu_HU: 'index',
        id_ID: ['indeks'],
        it: ['indice'],
        ja: ['指数'],
        ko: ['지수'],
        ms_MY: ['indeks'],
        nl_NL: 'index',
        pl: ['indeks'],
        pt: ['índice'],
        ro: 'index',
        ru: ['индексы'],
        sv: 'index',
        th: ['ดัชนี'],
        tr: ['endeks'],
        vi: ['chỉ số'],
        zh: ['指数'],
        zh_TW: ['指數'],
      }
    },
    60804: (e) => {
      e.exports = {
        ar: ['المؤشرات'],
        ca_ES: 'indices',
        cs: 'indices',
        de: ['Indizes'],
        el: 'indices',
        en: 'indices',
        es: ['índices'],
        fa: 'indices',
        fr: 'indices',
        he_IL: ['מדדים'],
        hu_HU: 'indices',
        id_ID: ['indeks'],
        it: ['Indici'],
        ja: ['指数'],
        ko: ['지수'],
        ms_MY: ['indeks'],
        nl_NL: ['indexen'],
        pl: ['indeksy'],
        pt: ['índices'],
        ro: 'indices',
        ru: ['индексы'],
        sv: ['index'],
        th: ['ดัชนี'],
        tr: ['endeks'],
        vi: ['các chỉ báo'],
        zh: ['指数'],
        zh_TW: ['指數'],
      }
    },
    36931: (e) => {
      e.exports = {
        ar: ['سهم'],
        ca_ES: ['accions'],
        cs: 'stock',
        de: ['Aktie'],
        el: 'stock',
        en: 'stock',
        es: ['acciones'],
        fa: 'stock',
        fr: 'stock',
        he_IL: ['מניה'],
        hu_HU: 'stock',
        id_ID: ['saham'],
        it: ['azione'],
        ja: ['株式'],
        ko: ['스탁'],
        ms_MY: ['saham'],
        nl_NL: 'stock',
        pl: ['akcja'],
        pt: ['ação'],
        ro: 'stock',
        ru: ['акция'],
        sv: ['aktier'],
        th: ['หุ้น'],
        tr: ['hisse'],
        vi: ['cổ phiếu'],
        zh: ['股票'],
        zh_TW: ['股票'],
      }
    },
  },
])
