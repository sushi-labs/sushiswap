;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7137, 4811, 8413],
  {
    470048: (e) => {
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
    869789: (e) => {
      e.exports = {
        checkbox: 'checkbox-vyj6oJxw',
        reverse: 'reverse-vyj6oJxw',
        label: 'label-vyj6oJxw',
        baseline: 'baseline-vyj6oJxw',
      }
    },
    625650: (e) => {
      e.exports = {
        loader: 'loader-UL6iwcBa',
        static: 'static-UL6iwcBa',
        item: 'item-UL6iwcBa',
        'tv-button-loader': 'tv-button-loader-UL6iwcBa',
        medium: 'medium-UL6iwcBa',
        small: 'small-UL6iwcBa',
        black: 'black-UL6iwcBa',
        white: 'white-UL6iwcBa',
        gray: 'gray-UL6iwcBa',
        primary: 'primary-UL6iwcBa',
      }
    },
    645300: (e) => {
      e.exports = {}
    },
    966076: (e) => {
      e.exports = {
        'default-drawer-min-top-distance': '100px',
        wrap: 'wrap-_HnK0UIN',
        positionBottom: 'positionBottom-_HnK0UIN',
        backdrop: 'backdrop-_HnK0UIN',
        drawer: 'drawer-_HnK0UIN',
        positionLeft: 'positionLeft-_HnK0UIN',
      }
    },
    540191: (e) => {
      e.exports = {
        menuWrap: 'menuWrap-Kq3ruQo8',
        isMeasuring: 'isMeasuring-Kq3ruQo8',
        scrollWrap: 'scrollWrap-Kq3ruQo8',
        momentumBased: 'momentumBased-Kq3ruQo8',
        menuBox: 'menuBox-Kq3ruQo8',
        isHidden: 'isHidden-Kq3ruQo8',
      }
    },
    671986: (e) => {
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
    934587: (e) => {
      e.exports = { icon: 'icon-WB2y0EnP', dropped: 'dropped-WB2y0EnP' }
    },
    408323: (e, t, n) => {
      n.d(t, { CheckboxInput: () => u })
      var o = n(50959),
        r = n(497754),
        s = n(800417),
        i = n(72571),
        a = n(465890),
        l = n(470048),
        c = n.n(l)
      function u(e) {
        const t = r(c().box, c()[`intent-${e.intent}`], {
            [c().check]: !Boolean(e.indeterminate),
            [c().dot]: Boolean(e.indeterminate),
            [c().noOutline]: -1 === e.tabIndex,
          }),
          n = r(c().wrapper, e.className)
        return o.createElement(
          'span',
          { className: n, title: e.title, style: e.style },
          o.createElement('input', {
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
            ...(0, s.filterDataProps)(e),
          }),
          o.createElement(
            'span',
            { className: t },
            o.createElement(i.Icon, { icon: a, className: c().icon }),
          ),
        )
      }
    },
    302946: (e, t, n) => {
      n.d(t, { Checkbox: () => c })
      var o = n(50959),
        r = n(497754),
        s = n(230789),
        i = n(408323),
        a = n(869789),
        l = n.n(a)
      class c extends o.PureComponent {
        render() {
          const { inputClassName: e, labelClassName: t, ...n } = this.props,
            s = r(this.props.className, l().checkbox, {
              [l().reverse]: Boolean(this.props.labelPositionReverse),
              [l().baseline]: Boolean(this.props.labelAlignBaseline),
            }),
            a = r(l().label, t, { [l().disabled]: this.props.disabled })
          let c = null
          return (
            this.props.label &&
              (c = o.createElement(
                'span',
                { className: a, title: this.props.title },
                this.props.label,
              )),
            o.createElement(
              'label',
              { className: s },
              o.createElement(i.CheckboxInput, { ...n, className: e }),
              c,
            )
          )
        }
      }
      c.defaultProps = { value: 'on' }
      ;(0, s.makeSwitchGroupItem)(c)
    },
    718736: (e, t, n) => {
      n.d(t, { useFunctionalRefObject: () => s })
      var o = n(50959),
        r = n(855393)
      function s(e) {
        const t = (0, o.useMemo)(
            () =>
              ((e) => {
                const t = (n) => {
                  e(n), (t.current = n)
                }
                return (t.current = null), t
              })((e) => {
                a.current(e)
              }),
            [],
          ),
          n = (0, o.useRef)(null),
          s = (t) => {
            if (null === t) return i(n.current, t), void (n.current = null)
            n.current !== e && ((n.current = e), i(n.current, t))
          },
          a = (0, o.useRef)(s)
        return (
          (a.current = s),
          (0, r.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return a.current(t.current), () => a.current(null)
          }, [e]),
          t
        )
      }
      function i(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    975228: (e, t, n) => {
      n.d(t, {
        hoverMouseEventFilter: () => s,
        useAccurateHover: () => i,
        useHover: () => r,
      })
      var o = n(50959)
      function r() {
        const [e, t] = (0, o.useState)(!1)
        return [
          e,
          {
            onMouseOver: (e) => {
              s(e) && t(!0)
            },
            onMouseOut: (e) => {
              s(e) && t(!1)
            },
          },
        ]
      }
      function s(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function i(e) {
        const [t, n] = (0, o.useState)(!1)
        return (
          (0, o.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return
              const o = e.current.contains(t.target)
              n(o)
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
    855393: (e, t, n) => {
      n.d(t, { useIsomorphicLayoutEffect: () => r })
      var o = n(50959)
      function r(e, t) {
        ;('undefined' == typeof window ? o.useEffect : o.useLayoutEffect)(e, t)
      }
    },
    778199: (e, t, n) => {
      function o(e, t, n, o, r) {
        function s(r) {
          if (e > r.timeStamp) return
          const s = r.target
          void 0 !== n &&
            null !== t &&
            null !== s &&
            s.ownerDocument === o &&
            (t.contains(s) || n(r))
        }
        return (
          r.click && o.addEventListener('click', s, !1),
          r.mouseDown && o.addEventListener('mousedown', s, !1),
          r.touchEnd && o.addEventListener('touchend', s, !1),
          r.touchStart && o.addEventListener('touchstart', s, !1),
          () => {
            o.removeEventListener('click', s, !1),
              o.removeEventListener('mousedown', s, !1),
              o.removeEventListener('touchend', s, !1),
              o.removeEventListener('touchstart', s, !1)
          }
        )
      }
      n.d(t, { addOutsideEventListener: () => o })
    },
    908783: (e, t, n) => {
      n.d(t, { useOutsideEvent: () => s })
      var o = n(50959),
        r = n(778199)
      function s(e) {
        const {
            click: t,
            mouseDown: n,
            touchEnd: s,
            touchStart: i,
            handler: a,
            reference: l,
            ownerDocument: c = document,
          } = e,
          u = (0, o.useRef)(null),
          d = (0, o.useRef)(new CustomEvent('timestamp').timeStamp)
        return (
          (0, o.useLayoutEffect)(() => {
            const e = { click: t, mouseDown: n, touchEnd: s, touchStart: i },
              o = l ? l.current : u.current
            return (0, r.addOutsideEventListener)(d.current, o, a, c, e)
          }, [t, n, s, i, a]),
          l || u
        )
      }
    },
    664332: (e, t, n) => {
      n.d(t, { useResizeObserver: () => a })
      var o = n(50959),
        r = n(159255),
        s = n(855393),
        i = n(718736)
      function a(e, t = []) {
        const { callback: n, ref: a = null } = ((e) =>
            'function' == typeof e ? { callback: e } : e)(e),
          l = (0, o.useRef)(null),
          c = (0, o.useRef)(n)
        c.current = n
        const u = (0, i.useFunctionalRefObject)(a),
          d = (0, o.useCallback)(
            (e) => {
              u(e),
                null !== l.current &&
                  (l.current.disconnect(), null !== e && l.current.observe(e))
            },
            [u, l],
          )
        return (
          (0, s.useIsomorphicLayoutEffect)(
            () => (
              (l.current = new r.default((e, t) => {
                c.current(e, t)
              })),
              u.current && d(u.current),
              () => {
                var e
                null === (e = l.current) || void 0 === e || e.disconnect()
              }
            ),
            [u, ...t],
          ),
          d
        )
      }
    },
    72571: (e, t, n) => {
      n.d(t, { Icon: () => r })
      var o = n(50959)
      const r = o.forwardRef((e, t) => {
        const { icon: n = '', ...r } = e
        return o.createElement('span', {
          ...r,
          ref: t,
          dangerouslySetInnerHTML: { __html: n },
        })
      })
    },
    234404: (e, t, n) => {
      n.d(t, { Loader: () => a })
      var o = n(50959),
        r = n(497754),
        s = n(625650),
        i = n.n(s)
      function a(e) {
        const {
            className: t,
            size: n = 'medium',
            staticPosition: s,
            color: a = 'black',
          } = e,
          l = r(i().item, i()[a], i()[n])
        return o.createElement(
          'span',
          { className: r(i().loader, s && i().static, t) },
          o.createElement('span', { className: l }),
          o.createElement('span', { className: l }),
          o.createElement('span', { className: l }),
        )
      }
    },
    823030: (e, t, n) => {
      n.d(t, { SubmenuContext: () => r, SubmenuHandler: () => s })
      var o = n(50959)
      const r = o.createContext(null)
      function s(e) {
        const [t, n] = (0, o.useState)(null),
          s = (0, o.useRef)(null),
          i = (0, o.useRef)(new Map())
        return (
          (0, o.useEffect)(
            () => () => {
              null !== s.current && clearTimeout(s.current)
            },
            [],
          ),
          o.createElement(
            r.Provider,
            {
              value: {
                current: t,
                setCurrent: (e) => {
                  null !== s.current &&
                    (clearTimeout(s.current), (s.current = null))
                  null === t
                    ? n(e)
                    : (s.current = setTimeout(() => {
                        ;(s.current = null), n(e)
                      }, 100))
                },
                registerSubmenu: (e, t) => (
                  i.current.set(e, t),
                  () => {
                    i.current.delete(e)
                  }
                ),
                isSubmenuNode: (e) =>
                  Array.from(i.current.values()).some((t) => t(e)),
              },
            },
            e.children,
          )
        )
      }
    },
    682925: (e, t, n) => {
      n.d(t, { Slot: () => r, SlotContext: () => s })
      var o = n(50959)
      class r extends o.Component {
        shouldComponentUpdate() {
          return !1
        }
        render() {
          return o.createElement('div', {
            style: { position: 'fixed', zIndex: 150, left: 0, top: 0 },
            ref: this.props.reference,
          })
        }
      }
      const s = o.createContext(null)
    },
    672511: (e, t, n) => {
      n.d(t, { Spinner: () => i })
      var o = n(50959),
        r = n(497754),
        s = n(843442)
      n(683135)
      function i(e) {
        const t = r(
          e.className,
          'tv-spinner',
          'tv-spinner--shown',
          `tv-spinner--size_${s.spinnerSizeMap[e.size || s.DEFAULT_SIZE]}`,
        )
        return o.createElement('div', {
          className: t,
          style: e.style,
          role: 'progressbar',
        })
      }
    },
    230789: (e, t, n) => {
      n.d(t, { SwitchGroup: () => i, makeSwitchGroupItem: () => a })
      var o = n(50959),
        r = n(174786)
      const s = (0, o.createContext)({
        getName: () => '',
        getValues: () => [],
        getOnChange: () => r.default,
        subscribe: r.default,
        unsubscribe: r.default,
      })
      class i extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._subscriptions = new Set()),
            (this._getName = () => this.props.name),
            (this._getValues = () => this.props.values),
            (this._getOnChange = () => this.props.onChange),
            (this._subscribe = (e) => {
              this._subscriptions.add(e)
            }),
            (this._unsubscribe = (e) => {
              this._subscriptions.delete(e)
            }),
            (this.state = {
              switchGroupContext: {
                getName: this._getName,
                getValues: this._getValues,
                getOnChange: this._getOnChange,
                subscribe: this._subscribe,
                unsubscribe: this._unsubscribe,
              },
            })
        }
        render() {
          return o.createElement(
            s.Provider,
            { value: this.state.switchGroupContext },
            this.props.children,
          )
        }
        componentDidUpdate(e) {
          this._notify(this._getUpdates(this.props.values, e.values))
        }
        _notify(e) {
          this._subscriptions.forEach((t) => t(e))
        }
        _getUpdates(e, t) {
          return [...t, ...e].filter((n) =>
            t.includes(n) ? !e.includes(n) : e.includes(n),
          )
        }
      }
      function a(e) {
        var t
        return (
          (t = class extends o.PureComponent {
            constructor() {
              super(...arguments),
                (this._onChange = (e) => {
                  this.context.getOnChange()(e)
                }),
                (this._onUpdate = (e) => {
                  e.includes(this.props.value) && this.forceUpdate()
                })
            }
            componentDidMount() {
              this.context.subscribe(this._onUpdate)
            }
            render() {
              return o.createElement(e, {
                ...this.props,
                name: this._getName(),
                onChange: this._onChange,
                checked: this._isChecked(),
              })
            }
            componentWillUnmount() {
              this.context.unsubscribe(this._onUpdate)
            }
            _getName() {
              return this.context.getName()
            }
            _isChecked() {
              return this.context.getValues().includes(this.props.value)
            }
          }),
          (t.contextType = s),
          t
        )
      }
    },
    800417: (e, t, n) => {
      function o(e) {
        return s(e, i)
      }
      function r(e) {
        return s(e, a)
      }
      function s(e, t) {
        const n = Object.entries(e).filter(t),
          o = {}
        for (const [e, t] of n) o[e] = t
        return o
      }
      function i(e) {
        const [t, n] = e
        return 0 === t.indexOf('data-') && 'string' == typeof n
      }
      function a(e) {
        return 0 === e[0].indexOf('aria-')
      }
      n.d(t, {
        filterAriaProps: () => r,
        filterDataProps: () => o,
        filterProps: () => s,
        isAriaAttribute: () => a,
        isDataAttribute: () => i,
      })
    },
    65160: (e, t, n) => {
      function o(e) {
        const { paddingTop: t, paddingBottom: n } = window.getComputedStyle(e)
        return [t, n].reduce(
          (e, t) => e - Number((t || '').replace('px', '')),
          e.clientHeight,
        )
      }
      function r(e, t = !1) {
        const n = getComputedStyle(e),
          o = [n.height]
        return (
          'border-box' !== n.boxSizing &&
            o.push(
              n.paddingTop,
              n.paddingBottom,
              n.borderTopWidth,
              n.borderBottomWidth,
            ),
          t && o.push(n.marginTop, n.marginBottom),
          o.reduce((e, t) => e + (Number.parseFloat(t) || 0), 0)
        )
      }
      function s(e, t = !1) {
        const n = getComputedStyle(e),
          o = [n.width]
        return (
          'border-box' !== n.boxSizing &&
            o.push(
              n.paddingLeft,
              n.paddingRight,
              n.borderLeftWidth,
              n.borderRightWidth,
            ),
          t && o.push(n.marginLeft, n.marginRight),
          o.reduce((e, t) => e + (Number.parseFloat(t) || 0), 0)
        )
      }
      n.d(t, {
        contentHeight: () => o,
        outerHeight: () => r,
        outerWidth: () => s,
      })
    },
    111706: (e, t, n) => {
      function o(e) {
        return 0 === e.detail
      }
      n.d(t, { isKeyboardClick: () => o })
    },
    273388: (e, t, n) => {
      function o(e) {
        return (t) => {
          e.forEach((e) => {
            'function' == typeof e ? e(t) : null != e && (e.current = t)
          })
        }
      }
      function r(e) {
        return o([e])
      }
      n.d(t, { isomorphicRef: () => r, mergeRefs: () => o })
    },
    801808: (e, t, n) => {
      n.d(t, { OverlapManager: () => s, getRootOverlapManager: () => a })
      var o = n(650151)
      class r {
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
      class s {
        constructor(e = document) {
          ;(this._storage = new r()),
            (this._windows = new Map()),
            (this._index = 0),
            (this._document = e),
            (this._container = e.createDocumentFragment())
        }
        setContainer(e) {
          const t = this._container,
            n = null === e ? this._document.createDocumentFragment() : e
          !((e, t) => {
            Array.from(e.childNodes).forEach((e) => {
              e.nodeType === Node.ELEMENT_NODE && t.appendChild(e)
            })
          })(t, n),
            (this._container = n)
        }
        registerWindow(e) {
          this._storage.has(e) || this._storage.add(e)
        }
        ensureWindow(e, t = { position: 'fixed', direction: 'normal' }) {
          const n = this._windows.get(e)
          if (void 0 !== n) return n
          this.registerWindow(e)
          const o = this._document.createElement('div')
          if (
            ((o.style.position = t.position),
            (o.style.zIndex = this._index.toString()),
            (o.dataset.id = e),
            void 0 !== t.index)
          ) {
            const e = this._container.childNodes.length
            if (t.index >= e) this._container.appendChild(o)
            else if (t.index <= 0)
              this._container.insertBefore(o, this._container.firstChild)
            else {
              const e = this._container.childNodes[t.index]
              this._container.insertBefore(o, e)
            }
          } else
            'reverse' === t.direction
              ? this._container.insertBefore(o, this._container.firstChild)
              : this._container.appendChild(o)
          return this._windows.set(e, o), ++this._index, o
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
      const i = new WeakMap()
      function a(e = document) {
        const t = e.getElementById('overlap-manager-root')
        if (null !== t) return (0, o.ensureDefined)(i.get(t))
        {
          const t = new s(e),
            n = ((e) => {
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
          return i.set(n, t), t.setContainer(n), e.body.appendChild(n), t
        }
      }
    },
    269842: (e, t, n) => {
      function o(...e) {
        return (t) => {
          for (const n of e) void 0 !== n && n(t)
        }
      }
      n.d(t, { createSafeMulticastEventHandler: () => o })
    },
    285089: (e, t, n) => {
      n.d(t, { setFixedBodyState: () => l })
      var o = n(735922)
      const r = () =>
          !window.matchMedia('screen and (min-width: 768px)').matches,
        s = () => !window.matchMedia('screen and (min-width: 1280px)').matches
      let i = 0,
        a = !1
      function l(e) {
        const { body: t } = document,
          n = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++i) {
          const e = (0, o.getCSSProperty)(t, 'overflow'),
            r = (0, o.getCSSPropertyNumericValue)(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            ((0, o.setStyle)(n, 'right', `${(0, o.getScrollbarWidth)()}px`),
            (t.style.paddingRight = `${r + ((0, o.getScrollbarWidth))()}px`),
            (a = !0)),
            t.classList.add('i-no-scroll')
        } else if (
          !e &&
          i > 0 &&
          0 == --i &&
          (t.classList.remove('i-no-scroll'), a)
        ) {
          ;(0, o.setStyle)(n, 'right', '0px')
          let e = 0
          ;(e = n
            ? ((l = (0, o.getContentWidth)(n)),
              r() ? 0 : s() ? 45 : Math.min(Math.max(l, 45), 450))
            : 0),
            t.scrollHeight <= t.clientHeight &&
              (e -= (0, o.getScrollbarWidth)()),
            (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'),
            (a = !1)
        }
        var l
      }
    },
    190410: (e, t, n) => {
      n.d(t, { DialogHeaderContext: () => o })
      const o = n(50959).createContext({ setHideClose: () => {} })
    },
    636080: (e, t, n) => {
      n.d(t, { CircleLogo: () => i, hiddenCircleLogoClass: () => s })
      var o = n(50959),
        r = n(439067)
      n(645300)
      const s = 'tv-circle-logo--visually-hidden'
      function i(e) {
        var t, n
        const s = (0, r.getStyleClasses)(e.size, e.className),
          i =
            null !== (n = null !== (t = e.alt) && void 0 !== t ? t : e.title) &&
            void 0 !== n
              ? n
              : ''
        return (0, r.isCircleLogoWithUrlProps)(e)
          ? o.createElement('img', {
              className: s,
              crossOrigin: '',
              src: e.logoUrl,
              alt: i,
              title: e.title,
              loading: e.loading,
              'aria-label': e['aria-label'],
              'aria-hidden': e['aria-hidden'],
            })
          : o.createElement(
              'span',
              {
                className: s,
                title: e.title,
                'aria-label': e['aria-label'],
                'aria-hidden': e['aria-hidden'],
              },
              e.placeholderLetter,
            )
      }
    },
    439067: (e, t, n) => {
      n.d(t, { getStyleClasses: () => r, isCircleLogoWithUrlProps: () => s })
      var o = n(497754)
      function r(e, t) {
        return o('tv-circle-logo', `tv-circle-logo--${e}`, t)
      }
      function s(e) {
        return 'logoUrl' in e && void 0 !== e.logoUrl && 0 !== e.logoUrl.length
      }
    },
    163694: (e, t, n) => {
      n.d(t, { DrawerContext: () => i, DrawerManager: () => s })
      var o = n(50959),
        r = n(285089)
      class s extends o.PureComponent {
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
            ((0, r.setFixedBodyState)(!0), (this._isBodyFixed = !0)),
            t.stack.length &&
              !this.state.stack.length &&
              this._isBodyFixed &&
              ((0, r.setFixedBodyState)(!1), (this._isBodyFixed = !1))
        }
        componentWillUnmount() {
          this.state.stack.length &&
            this._isBodyFixed &&
            (0, r.setFixedBodyState)(!1)
        }
        render() {
          return o.createElement(
            i.Provider,
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
      const i = o.createContext(null)
    },
    759339: (e, t, n) => {
      n.d(t, { Drawer: () => h })
      var o = n(50959),
        r = n(650151),
        s = n(497754),
        i = n(189904),
        a = n(813113),
        l = n(163694),
        c = n(28466),
        u = n(742554),
        d = n(966076)
      function h(e) {
        const {
            position: t = 'Bottom',
            onClose: n,
            children: u,
            className: h,
            theme: m = d,
          } = e,
          v = (0, r.ensureNotNull)((0, o.useContext)(l.DrawerContext)),
          [f] = (0, o.useState)(() => (0, i.randomHash)()),
          g = (0, o.useRef)(null),
          b = (0, o.useContext)(c.CloseDelegateContext)
        return (
          (0, o.useLayoutEffect)(
            () => (
              (0, r.ensureNotNull)(g.current).focus({ preventScroll: !0 }),
              b.subscribe(v, n),
              v.addDrawer(f),
              () => {
                v.removeDrawer(f), b.unsubscribe(v, n)
              }
            ),
            [],
          ),
          o.createElement(
            a.Portal,
            null,
            o.createElement(
              'div',
              { className: s(d.wrap, d[`position${t}`]) },
              f === v.currentDrawer &&
                o.createElement('div', { className: d.backdrop, onClick: n }),
              o.createElement(
                p,
                {
                  className: s(m.drawer, d[`position${t}`], h),
                  ref: g,
                  'data-name': e['data-name'],
                },
                u,
              ),
            ),
          )
        )
      }
      const p = (0, o.forwardRef)((e, t) => {
        const { className: n, ...r } = e
        return o.createElement(u.TouchScrollContainer, {
          className: s(d.drawer, n),
          tabIndex: -1,
          ref: t,
          ...r,
        })
      })
    },
    522224: (e, t, n) => {
      n.d(t, {
        hoverMouseEventFilter: () => o.hoverMouseEventFilter,
        useAccurateHover: () => o.useAccurateHover,
        useHover: () => o.useHover,
      })
      var o = n(975228)
    },
    930052: (e, t, n) => {
      n.d(t, { MatchMedia: () => r })
      var o = n(50959)
      class r extends o.PureComponent {
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
    230553: (e, t, n) => {
      n.d(t, { MenuContext: () => o })
      const o = n(50959).createContext(null)
    },
    510618: (e, t, n) => {
      n.d(t, { DEFAULT_MENU_THEME: () => f, Menu: () => g })
      var o = n(50959),
        r = n(497754),
        s = n.n(r),
        i = n(650151),
        a = n(44681),
        l = n(199663),
        c = n(753327),
        u = n(370981),
        d = n(801808),
        h = n(376202),
        p = n(823030),
        m = n(230553),
        v = n(540191)
      const f = v
      class g extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._containerRef = null),
            (this._scrollWrapRef = null),
            (this._raf = null),
            (this._scrollRaf = null),
            (this._scrollTimeout = void 0),
            (this._manager = new d.OverlapManager()),
            (this._hotkeys = null),
            (this._scroll = 0),
            (this._handleContainerRef = (e) => {
              ;(this._containerRef = e),
                this.props.reference &&
                  ('function' == typeof this.props.reference &&
                    this.props.reference(e),
                  'object' == typeof this.props.reference &&
                    (this.props.reference.current = e))
            }),
            (this._handleScrollWrapRef = (e) => {
              ;(this._scrollWrapRef = e),
                'function' == typeof this.props.scrollWrapReference &&
                  this.props.scrollWrapReference(e),
                'object' == typeof this.props.scrollWrapReference &&
                  (this.props.scrollWrapReference.current = e)
            }),
            (this._handleCustomRemeasureDelegate = () => {
              this._resizeForced(), this._handleMeasure()
            }),
            (this._handleMeasure = ({
              callback: e,
              forceRecalcPosition: t,
            } = {}) => {
              var n, o, r, s, l, c, u, d, h, p, m, v
              if (this.state.isMeasureValid && !t) return
              const { position: f } = this.props,
                g = (0, i.ensureNotNull)(this._containerRef)
              let b = g.getBoundingClientRect()
              const _ = document.documentElement.clientHeight,
                w = document.documentElement.clientWidth,
                C =
                  null !== (n = this.props.closeOnScrollOutsideOffset) &&
                  void 0 !== n
                    ? n
                    : 0
              let x = _ - 0 - C
              const E = b.height > x
              if (E) {
                ;((0, i.ensureNotNull)(this._scrollWrapRef).style.overflowY =
                  'scroll'),
                  (b = g.getBoundingClientRect())
              }
              const { width: y, height: k } = b,
                N =
                  'function' == typeof f
                    ? f({
                        contentWidth: y,
                        contentHeight: k,
                        availableWidth: w,
                        availableHeight: _,
                      })
                    : f,
                S =
                  null !==
                    (r =
                      null === (o = null == N ? void 0 : N.indentFromWindow) ||
                      void 0 === o
                        ? void 0
                        : o.left) && void 0 !== r
                    ? r
                    : 0,
                M =
                  w -
                  (null !== (s = N.overrideWidth) && void 0 !== s ? s : y) -
                  (null !==
                    (c =
                      null === (l = null == N ? void 0 : N.indentFromWindow) ||
                      void 0 === l
                        ? void 0
                        : l.right) && void 0 !== c
                    ? c
                    : 0),
                D = (0, a.clamp)(N.x, S, Math.max(S, M)),
                B =
                  (null !==
                    (d =
                      null === (u = null == N ? void 0 : N.indentFromWindow) ||
                      void 0 === u
                        ? void 0
                        : u.top) && void 0 !== d
                    ? d
                    : 0) + C,
                O =
                  _ -
                  (null !== (h = N.overrideHeight) && void 0 !== h ? h : k) -
                  (null !==
                    (m =
                      null === (p = null == N ? void 0 : N.indentFromWindow) ||
                      void 0 === p
                        ? void 0
                        : p.bottom) && void 0 !== m
                    ? m
                    : 0)
              let R = (0, a.clamp)(N.y, B, Math.max(B, O))
              if (
                (N.forbidCorrectYCoord &&
                  R < N.y &&
                  ((x -= N.y - R), (R = N.y)),
                t &&
                  void 0 !== this.props.closeOnScrollOutsideOffset &&
                  N.y <= this.props.closeOnScrollOutsideOffset)
              )
                return void this._handleGlobalClose(!0)
              const T =
                null !== (v = N.overrideHeight) && void 0 !== v
                  ? v
                  : E
                    ? x
                    : void 0
              this.setState(
                {
                  appearingMenuHeight: t ? this.state.appearingMenuHeight : T,
                  appearingMenuWidth: t
                    ? this.state.appearingMenuWidth
                    : N.overrideWidth,
                  appearingPosition: { x: D, y: R },
                  isMeasureValid: !0,
                },
                () => {
                  this._restoreScrollPosition(), e && e()
                },
              )
            }),
            (this._restoreScrollPosition = () => {
              const e = document.activeElement,
                t = (0, i.ensureNotNull)(this._containerRef)
              if (null !== e && t.contains(e))
                try {
                  e.scrollIntoView()
                } catch (e) {}
              else
                (0, i.ensureNotNull)(this._scrollWrapRef).scrollTop =
                  this._scroll
            }),
            (this._resizeForced = () => {
              this.setState({
                appearingMenuHeight: void 0,
                appearingMenuWidth: void 0,
                appearingPosition: void 0,
                isMeasureValid: void 0,
              })
            }),
            (this._resize = () => {
              null === this._raf &&
                (this._raf = requestAnimationFrame(() => {
                  this.setState({
                    appearingMenuHeight: void 0,
                    appearingMenuWidth: void 0,
                    appearingPosition: void 0,
                    isMeasureValid: void 0,
                  }),
                    (this._raf = null)
                }))
            }),
            (this._handleGlobalClose = (e) => {
              this.props.onClose(e)
            }),
            (this._handleSlot = (e) => {
              this._manager.setContainer(e)
            }),
            (this._handleScroll = () => {
              this._scroll = (0, i.ensureNotNull)(this._scrollWrapRef).scrollTop
            }),
            (this._handleScrollOutsideEnd = () => {
              clearTimeout(this._scrollTimeout),
                (this._scrollTimeout = setTimeout(() => {
                  this._handleMeasure({ forceRecalcPosition: !0 })
                }, 80))
            }),
            (this._handleScrollOutside = (e) => {
              e.target !== this._scrollWrapRef &&
                (this._handleScrollOutsideEnd(),
                null === this._scrollRaf &&
                  (this._scrollRaf = requestAnimationFrame(() => {
                    this._handleMeasure({ forceRecalcPosition: !0 }),
                      (this._scrollRaf = null)
                  })))
            }),
            (this.state = {})
        }
        componentDidMount() {
          this._handleMeasure({ callback: this.props.onOpen })
          const {
            customCloseDelegate: e = u.globalCloseDelegate,
            customRemeasureDelegate: t,
          } = this.props
          e.subscribe(this, this._handleGlobalClose),
            null == t || t.subscribe(null, this._handleCustomRemeasureDelegate),
            window.addEventListener('resize', this._resize)
          const n = null !== this.context
          this._hotkeys ||
            n ||
            ((this._hotkeys = h.createGroup({ desc: 'Popup menu' })),
            this._hotkeys.add({
              desc: 'Close',
              hotkey: 27,
              handler: () => {
                this.props.onKeyboardClose && this.props.onKeyboardClose(),
                  this._handleGlobalClose()
              },
            })),
            this.props.repositionOnScroll &&
              window.addEventListener('scroll', this._handleScrollOutside, {
                capture: !0,
              })
        }
        componentDidUpdate() {
          this._handleMeasure()
        }
        componentWillUnmount() {
          const {
            customCloseDelegate: e = u.globalCloseDelegate,
            customRemeasureDelegate: t,
          } = this.props
          e.unsubscribe(this, this._handleGlobalClose),
            null == t ||
              t.unsubscribe(null, this._handleCustomRemeasureDelegate),
            window.removeEventListener('resize', this._resize),
            window.removeEventListener('scroll', this._handleScrollOutside, {
              capture: !0,
            }),
            this._hotkeys && (this._hotkeys.destroy(), (this._hotkeys = null)),
            null !== this._raf &&
              (cancelAnimationFrame(this._raf), (this._raf = null)),
            null !== this._scrollRaf &&
              (cancelAnimationFrame(this._scrollRaf), (this._scrollRaf = null)),
            this._scrollTimeout && clearTimeout(this._scrollTimeout)
        }
        render() {
          const {
              id: e,
              role: t,
              'aria-label': n,
              'aria-labelledby': r,
              'aria-activedescendant': i,
              'aria-hidden': a,
              'aria-describedby': u,
              'aria-invalid': d,
              children: h,
              minWidth: f,
              theme: g = v,
              className: _,
              maxHeight: w,
              onMouseOver: C,
              onMouseOut: x,
              onKeyDown: E,
              onFocus: y,
              onBlur: k,
            } = this.props,
            {
              appearingMenuHeight: N,
              appearingMenuWidth: S,
              appearingPosition: M,
              isMeasureValid: D,
            } = this.state,
            B = {
              '--ui-kit-menu-max-width': `${M && M.x}px`,
              maxWidth: 'calc(100vw - var(--ui-kit-menu-max-width) - 6px)',
            }
          return o.createElement(
            m.MenuContext.Provider,
            { value: this },
            o.createElement(
              p.SubmenuHandler,
              null,
              o.createElement(
                c.SlotContext.Provider,
                { value: this._manager },
                o.createElement(
                  'div',
                  {
                    id: e,
                    role: t,
                    'aria-label': n,
                    'aria-labelledby': r,
                    'aria-activedescendant': i,
                    'aria-hidden': a,
                    'aria-describedby': u,
                    'aria-invalid': d,
                    className: s()(_, g.menuWrap, !D && g.isMeasuring),
                    style: {
                      height: N,
                      left: M && M.x,
                      minWidth: f,
                      position: 'fixed',
                      top: M && M.y,
                      width: S,
                      ...(this.props.limitMaxWidth && B),
                    },
                    'data-name': this.props['data-name'],
                    ref: this._handleContainerRef,
                    onScrollCapture: this.props.onScroll,
                    onContextMenu: l.preventDefaultForContextMenu,
                    tabIndex: this.props.tabIndex,
                    onMouseOver: C,
                    onMouseOut: x,
                    onKeyDown: E,
                    onFocus: y,
                    onBlur: k,
                  },
                  o.createElement(
                    'div',
                    {
                      className: s()(
                        g.scrollWrap,
                        !this.props.noMomentumBasedScroll && g.momentumBased,
                      ),
                      style: {
                        overflowY: void 0 !== N ? 'scroll' : 'auto',
                        maxHeight: w,
                      },
                      onScrollCapture: this._handleScroll,
                      ref: this._handleScrollWrapRef,
                    },
                    o.createElement(b, { className: g.menuBox }, h),
                  ),
                ),
              ),
              o.createElement(c.Slot, { reference: this._handleSlot }),
            ),
          )
        }
        update(e) {
          e ? this._resizeForced() : this._resize()
        }
        focus(e) {
          var t
          null === (t = this._containerRef) || void 0 === t || t.focus(e)
        }
        blur() {
          var e
          null === (e = this._containerRef) || void 0 === e || e.blur()
        }
      }
      function b(e) {
        const t = (0, i.ensureNotNull)((0, o.useContext)(p.SubmenuContext)),
          n = o.useRef(null)
        return o.createElement(
          'div',
          {
            ref: n,
            className: e.className,
            onMouseOver: (e) => {
              if (
                !(
                  null !== t.current &&
                  e.target instanceof Node &&
                  ((o = e.target),
                  null === (r = n.current) || void 0 === r
                    ? void 0
                    : r.contains(o))
                )
              )
                return
              var o, r
              t.isSubmenuNode(e.target) || t.setCurrent(null)
            },
            'data-name': 'menu-inner',
          },
          e.children,
        )
      }
      g.contextType = p.SubmenuContext
    },
    192063: (e, t, n) => {
      n.d(t, { DEFAULT_POPUP_MENU_ITEM_THEME: () => c, PopupMenuItem: () => d })
      var o = n(50959),
        r = n(497754),
        s = n(32133),
        i = n(370981),
        a = n(636080),
        l = n(671986)
      const c = l
      function u(e) {
        e.stopPropagation()
      }
      function d(e) {
        const {
            id: t,
            role: n,
            className: c,
            title: d,
            labelRowClassName: h,
            labelClassName: p,
            toolboxClassName: m,
            shortcut: v,
            forceShowShortcuts: f,
            icon: g,
            iconClassname: b,
            isActive: _,
            isDisabled: w,
            isHovered: C,
            appearAsDisabled: x,
            label: E,
            link: y,
            showToolboxOnHover: k,
            showToolboxOnFocus: N,
            target: S,
            rel: M,
            toolbox: D,
            reference: B,
            onMouseOut: O,
            onMouseOver: R,
            onKeyDown: T,
            suppressToolboxClick: W = !0,
            theme: L = l,
            tabIndex: F,
            tagName: P,
            renderComponent: I,
            roundedIcon: U,
            iconAriaProps: A,
            circleLogo: H,
            dontClosePopup: G,
            onClick: z,
            onClickArg: j,
            trackEventObject: q,
            trackMouseWheelClick: Q,
            trackRightClick: K,
            ...V
          } = e,
          J = (0, o.useRef)(null),
          Z = (0, o.useMemo)(
            () =>
              ((e) => {
                function t(t) {
                  const { reference: n, ...r } = t,
                    s = null != e ? e : r.href ? 'a' : 'div',
                    i =
                      'a' === s
                        ? r
                        : ((e) => {
                            const {
                              download: t,
                              href: n,
                              hrefLang: o,
                              media: r,
                              ping: s,
                              rel: i,
                              target: a,
                              type: l,
                              referrerPolicy: c,
                              ...u
                            } = e
                            return u
                          })(r)
                  return o.createElement(s, { ...i, ref: n })
                }
                return (t.displayName = `DefaultComponent(${e})`), t
              })(P),
            [P],
          ),
          $ = null != I ? I : Z
        return o.createElement(
          $,
          {
            ...V,
            id: t,
            role: n,
            className: r(c, L.item, g && L.withIcon, {
              [L.isActive]: _,
              [L.isDisabled]: w || x,
              [L.hovered]: C,
            }),
            title: d,
            href: y,
            target: S,
            rel: M,
            reference: (e) => {
              ;(J.current = e), 'function' == typeof B && B(e)
              'object' == typeof B && (B.current = e)
            },
            onClick: (e) => {
              if (w) return
              q && (0, s.trackEvent)(q.category, q.event, q.label)
              z && z(j, e)
              G || (0, i.globalCloseMenu)()
            },
            onContextMenu: (e) => {
              q &&
                K &&
                (0, s.trackEvent)(q.category, q.event, `${q.label}_rightClick`)
            },
            onMouseUp: (e) => {
              if (1 === e.button && y && q) {
                let e = q.label
                Q && (e += '_mouseWheelClick'),
                  (0, s.trackEvent)(q.category, q.event, e)
              }
            },
            onMouseOver: R,
            onMouseOut: O,
            onKeyDown: T,
            tabIndex: F,
          },
          H &&
            o.createElement(a.CircleLogo, {
              ...A,
              className: l['disclosure-item-circle-logo'],
              size: 'xxxsmall',
              logoUrl: H.logoUrl,
              placeholderLetter: H.placeholderLetter,
            }),
          g &&
            o.createElement('span', {
              'aria-label': A && A['aria-label'],
              'aria-hidden': A && Boolean(A['aria-hidden']),
              className: r(L.icon, U && l['round-icon'], b),
              dangerouslySetInnerHTML: { __html: g },
            }),
          o.createElement(
            'span',
            { className: r(L.labelRow, h) },
            o.createElement('span', { className: r(L.label, p) }, E),
          ),
          (void 0 !== v || f) &&
            o.createElement(
              'span',
              { className: L.shortcut },
              (Y = v) && Y.split('+').join(' + '),
            ),
          void 0 !== D &&
            o.createElement(
              'span',
              {
                onClick: W ? u : void 0,
                className: r(m, L.toolbox, {
                  [L.showOnHover]: k,
                  [L.showOnFocus]: N,
                }),
              },
              D,
            ),
        )
        var Y
      }
    },
    28466: (e, t, n) => {
      n.d(t, { CloseDelegateContext: () => s })
      var o = n(50959),
        r = n(370981)
      const s = o.createContext(r.globalCloseDelegate)
    },
    624216: (e, t, n) => {
      n.d(t, { PopupMenu: () => h })
      var o = n(50959),
        r = n(500962),
        s = n(162942),
        i = n(813113),
        a = n(510618),
        l = n(28466)
      const c = o.createContext(void 0)
      var u = n(908783)
      const d = o.createContext({ setMenuMaxWidth: !1 })
      function h(e) {
        const {
            controller: t,
            children: n,
            isOpened: h,
            closeOnClickOutside: p = !0,
            doNotCloseOn: m,
            onClickOutside: v,
            onClose: f,
            onKeyboardClose: g,
            'data-name': b = 'popup-menu-container',
            ..._
          } = e,
          w = (0, o.useContext)(l.CloseDelegateContext),
          C = o.useContext(d),
          x = (0, o.useContext)(c),
          E = (0, u.useOutsideEvent)({
            handler: (e) => {
              v && v(e)
              if (!p) return
              const t = (0, s.default)(m) ? m() : null == m ? [] : [m]
              if (t.length > 0 && e.target instanceof Node)
                for (const n of t) {
                  const t = r.findDOMNode(n)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              f()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return h
          ? o.createElement(
              i.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              o.createElement(
                'span',
                { ref: E, style: { pointerEvents: 'auto' } },
                o.createElement(
                  a.Menu,
                  {
                    ..._,
                    onClose: f,
                    onKeyboardClose: g,
                    onScroll: (t) => {
                      const { onScroll: n } = e
                      n && n(t)
                    },
                    customCloseDelegate: w,
                    customRemeasureDelegate: x,
                    ref: t,
                    'data-name': b,
                    limitMaxWidth: C.setMenuMaxWidth,
                  },
                  n,
                ),
              ),
            )
          : null
      }
    },
    813113: (e, t, n) => {
      n.d(t, { Portal: () => l, PortalContext: () => c })
      var o = n(50959),
        r = n(500962),
        s = n(925931),
        i = n(801808),
        a = n(682925)
      class l extends o.PureComponent {
        constructor() {
          super(...arguments), (this._uuid = (0, s.nanoid)())
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
            r.createPortal(
              o.createElement(c.Provider, { value: this }, this.props.children),
              e,
            )
          )
        }
        moveToTop() {
          this._manager().moveToTop(this._uuid)
        }
        _manager() {
          return null === this.context
            ? (0, i.getRootOverlapManager)()
            : this.context
        }
      }
      l.contextType = a.SlotContext
      const c = o.createContext(null)
    },
    753327: (e, t, n) => {
      n.d(t, { Slot: () => o.Slot, SlotContext: () => o.SlotContext })
      var o = n(682925)
    },
    132455: (e, t, n) => {
      n.d(t, { Spinner: () => o.Spinner })
      var o = n(672511)
    },
    515783: (e, t, n) => {
      n.d(t, { ToolWidgetCaret: () => l })
      var o = n(50959),
        r = n(497754),
        s = n(72571),
        i = n(934587),
        a = n(100578)
      function l(e) {
        const { dropped: t, className: n } = e
        return o.createElement(s.Icon, {
          className: r(n, i.icon, { [i.dropped]: t }),
          icon: a,
        })
      }
    },
    742554: (e, t, n) => {
      n.d(t, { TouchScrollContainer: () => a })
      var o = n(50959),
        r = n(259142),
        s = n(650151),
        i = n(601227)
      const a = (0, o.forwardRef)((e, t) => {
        const { children: n, ...s } = e,
          a = (0, o.useRef)(null)
        return (
          (0, o.useImperativeHandle)(t, () => a.current),
          (0, o.useLayoutEffect)(() => {
            if (i.CheckMobile.iOS())
              return (
                null !== a.current &&
                  (0, r.disableBodyScroll)(a.current, { allowTouchMove: l(a) }),
                () => {
                  null !== a.current && (0, r.enableBodyScroll)(a.current)
                }
              )
          }, []),
          o.createElement('div', { ref: a, ...s }, n)
        )
      })
      function l(e) {
        return (t) => {
          const n = (0, s.ensureNotNull)(e.current),
            o = document.activeElement
          return (
            !n.contains(t) || (null !== o && n.contains(o) && o.contains(t))
          )
        }
      }
    },
    278029: (e) => {
      e.exports = {
        button: 'button-GwQQdU8S',
        hover: 'hover-GwQQdU8S',
        clicked: 'clicked-GwQQdU8S',
        isInteractive: 'isInteractive-GwQQdU8S',
        accessible: 'accessible-GwQQdU8S',
        isGrouped: 'isGrouped-GwQQdU8S',
        isActive: 'isActive-GwQQdU8S',
        isOpened: 'isOpened-GwQQdU8S',
        isDisabled: 'isDisabled-GwQQdU8S',
        text: 'text-GwQQdU8S',
        icon: 'icon-GwQQdU8S',
        endIcon: 'endIcon-GwQQdU8S',
      }
    },
    442919: (e) => {
      e.exports = {
        button: 'button-merBkM5y',
        hover: 'hover-merBkM5y',
        clicked: 'clicked-merBkM5y',
        accessible: 'accessible-merBkM5y',
        arrow: 'arrow-merBkM5y',
        arrowWrap: 'arrowWrap-merBkM5y',
        isOpened: 'isOpened-merBkM5y',
      }
    },
    476853: (e, t, n) => {
      n.d(t, {
        HorizontalAttachEdge: () => r,
        HorizontalDropDirection: () => i,
        VerticalAttachEdge: () => o,
        VerticalDropDirection: () => s,
        getPopupPositioner: () => c,
      })
      var o,
        r,
        s,
        i,
        a = n(650151)
      !((e) => {
        ;(e[(e.Top = 0)] = 'Top'),
          (e[(e.Bottom = 1)] = 'Bottom'),
          (e[(e.AutoStrict = 2)] = 'AutoStrict')
      })(o || (o = {})),
        ((e) => {
          ;(e[(e.Left = 0)] = 'Left'), (e[(e.Right = 1)] = 'Right')
        })(r || (r = {})),
        ((e) => {
          ;(e[(e.FromTopToBottom = 0)] = 'FromTopToBottom'),
            (e[(e.FromBottomToTop = 1)] = 'FromBottomToTop')
        })(s || (s = {})),
        ((e) => {
          ;(e[(e.FromLeftToRight = 0)] = 'FromLeftToRight'),
            (e[(e.FromRightToLeft = 1)] = 'FromRightToLeft')
        })(i || (i = {}))
      const l = {
        verticalAttachEdge: o.Bottom,
        horizontalAttachEdge: r.Left,
        verticalDropDirection: s.FromTopToBottom,
        horizontalDropDirection: i.FromLeftToRight,
        verticalMargin: 0,
        horizontalMargin: 0,
        matchButtonAndListboxWidths: !1,
      }
      function c(e, t) {
        return (n) => {
          var c, u
          const { contentWidth: d, contentHeight: h, availableHeight: p } = n,
            m = (0, a.ensureNotNull)(e).getBoundingClientRect(),
            {
              horizontalAttachEdge: v = l.horizontalAttachEdge,
              horizontalDropDirection: f = l.horizontalDropDirection,
              horizontalMargin: g = l.horizontalMargin,
              verticalMargin: b = l.verticalMargin,
              matchButtonAndListboxWidths: _ = l.matchButtonAndListboxWidths,
            } = t
          let w =
              null !== (c = t.verticalAttachEdge) && void 0 !== c
                ? c
                : l.verticalAttachEdge,
            C =
              null !== (u = t.verticalDropDirection) && void 0 !== u
                ? u
                : l.verticalDropDirection
          w === o.AutoStrict &&
            (p < m.y + m.height + b + h
              ? ((w = o.Top), (C = s.FromBottomToTop))
              : ((w = o.Bottom), (C = s.FromTopToBottom)))
          const x = w === o.Top ? -1 * b : b,
            E = v === r.Right ? m.right : m.left,
            y = w === o.Top ? m.top : m.bottom,
            k = {
              x: E - (f === i.FromRightToLeft ? d : 0) + g,
              y: y - (C === s.FromBottomToTop ? h : 0) + x,
            }
          return _ && (k.overrideWidth = m.width), k
        }
      }
    },
    747633: (e, t, n) => {
      n.d(t, {
        DEFAULT_TOOL_WIDGET_BUTTON_THEME: () => a,
        ToolWidgetButton: () => l,
      })
      var o = n(50959),
        r = n(497754),
        s = n(72571),
        i = n(278029)
      const a = i,
        l = o.forwardRef((e, t) => {
          const {
              tag: n = 'div',
              icon: a,
              endIcon: l,
              isActive: c,
              isOpened: u,
              isDisabled: d,
              isGrouped: h,
              isHovered: p,
              isClicked: m,
              onClick: v,
              text: f,
              textBeforeIcon: g,
              title: b,
              theme: _ = i,
              className: w,
              forceInteractive: C,
              inactive: x,
              'data-name': E,
              'data-tooltip': y,
              ...k
            } = e,
            N = r(w, _.button, (b || y) && 'apply-common-tooltip', {
              [_.isActive]: c,
              [_.isOpened]: u,
              [_.isInteractive]: (C || Boolean(v)) && !d && !x,
              [_.isDisabled]: Boolean(d || x),
              [_.isGrouped]: h,
              [_.hover]: p,
              [_.clicked]: m,
            }),
            S =
              a &&
              ('string' == typeof a
                ? o.createElement(s.Icon, { className: _.icon, icon: a })
                : o.cloneElement(a, {
                    className: r(_.icon, a.props.className),
                  }))
          return 'button' === n
            ? o.createElement(
                'button',
                {
                  ...k,
                  ref: t,
                  type: 'button',
                  className: r(N, _.accessible),
                  disabled: d && !x,
                  onClick: v,
                  title: b,
                  'data-name': E,
                  'data-tooltip': y,
                },
                g &&
                  f &&
                  o.createElement(
                    'div',
                    { className: r('js-button-text', _.text) },
                    f,
                  ),
                S,
                !g &&
                  f &&
                  o.createElement(
                    'div',
                    { className: r('js-button-text', _.text) },
                    f,
                  ),
              )
            : o.createElement(
                'div',
                {
                  ...k,
                  ref: t,
                  'data-role': 'button',
                  className: N,
                  onClick: d ? void 0 : v,
                  title: b,
                  'data-name': E,
                  'data-tooltip': y,
                },
                g &&
                  f &&
                  o.createElement(
                    'div',
                    { className: r('js-button-text', _.text) },
                    f,
                  ),
                S,
                !g &&
                  f &&
                  o.createElement(
                    'div',
                    { className: r('js-button-text', _.text) },
                    f,
                  ),
                l && o.createElement(s.Icon, { icon: l, className: i.endIcon }),
              )
        })
    },
    518799: (e, t, n) => {
      n.d(t, {
        DEFAULT_TOOL_WIDGET_MENU_THEME: () => f,
        ToolWidgetMenu: () => g,
      })
      var o = n(50959),
        r = n(497754),
        s = n(930202),
        i = n(624216),
        a = n(515783),
        l = n(800417),
        c = n(163694),
        u = n(759339),
        d = n(476853),
        h = n(930052),
        p = n(156963),
        m = n(111706),
        v = n(442919)
      const f = v
      class g extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._wrapperRef = null),
            (this._controller = o.createRef()),
            (this._handleWrapperRef = (e) => {
              ;(this._wrapperRef = e),
                this.props.reference && this.props.reference(e)
            }),
            (this._handleOpen = () => {
              var e
              'div' !== this.props.tag &&
                (null === (e = this._controller.current) ||
                  void 0 === e ||
                  e.focus())
            }),
            (this._handleClick = (e) => {
              ;(p.enabled('skip_event_target_check') ||
                e.target instanceof Node) &&
                e.currentTarget.contains(e.target) &&
                (this._handleToggleDropdown(void 0, (0, m.isKeyboardClick)(e)),
                this.props.onClick &&
                  this.props.onClick(e, !this.state.isOpened))
            }),
            (this._handleToggleDropdown = (e, t = !1) => {
              const { onClose: n, onOpen: o } = this.props,
                { isOpened: r } = this.state,
                s = 'boolean' == typeof e ? e : !r
              this.setState({ isOpened: s, shouldReturnFocus: !!s && t }),
                s && o && o(),
                !s && n && n()
            }),
            (this._handleClose = () => {
              this.close()
            }),
            (this._handleKeyDown = (e) => {
              var t
              const { orientation: n = 'horizontal' } = this.props
              if (e.defaultPrevented) return
              if (!(e.target instanceof Node)) return
              const o = (0, s.hashFromEvent)(e)
              if (e.currentTarget.contains(e.target))
                switch (o) {
                  case 40:
                    if ('div' === this.props.tag || 'horizontal' !== n) return
                    if (this.state.isOpened) return
                    e.preventDefault(), this._handleToggleDropdown(!0, !0)
                    break
                  case 27:
                    if (!this.state.isOpened || !this.props.closeOnEsc) return
                    e.preventDefault(),
                      e.stopPropagation(),
                      this._handleToggleDropdown(!1)
                }
              else {
                if ('div' === this.props.tag) return
                switch (o) {
                  case 27: {
                    e.preventDefault()
                    const { shouldReturnFocus: n } = this.state
                    this._handleToggleDropdown(!1),
                      n &&
                        (null === (t = this._wrapperRef) ||
                          void 0 === t ||
                          t.focus())
                    break
                  }
                }
              }
            }),
            (this.state = { isOpened: !1, shouldReturnFocus: !1 })
        }
        render() {
          const {
              tag: e = 'div',
              id: t,
              arrow: n,
              content: s,
              isDisabled: i,
              isDrawer: c,
              isShowTooltip: u,
              title: d,
              className: p,
              hotKey: m,
              theme: v,
              drawerBreakpoint: f,
              tabIndex: g,
              isClicked: b,
            } = this.props,
            { isOpened: _ } = this.state,
            w = r(p, v.button, {
              'apply-common-tooltip': u || !i,
              [v.isDisabled]: i,
              [v.isOpened]: _,
              [v.clicked]: b,
            })
          return 'button' === e
            ? o.createElement(
                'button',
                {
                  type: 'button',
                  id: t,
                  className: r(w, v.accessible),
                  disabled: i,
                  onClick: this._handleClick,
                  title: d,
                  'data-tooltip-hotkey': m,
                  ref: this._handleWrapperRef,
                  onKeyDown: this._handleKeyDown,
                  tabIndex: g,
                  ...(0, l.filterDataProps)(this.props),
                  ...(0, l.filterAriaProps)(this.props),
                },
                s,
                n &&
                  o.createElement(
                    'div',
                    { className: v.arrow },
                    o.createElement(
                      'div',
                      { className: v.arrowWrap },
                      o.createElement(a.ToolWidgetCaret, { dropped: _ }),
                    ),
                  ),
                this.state.isOpened &&
                  (f
                    ? o.createElement(h.MatchMedia, { rule: f }, (e) =>
                        this._renderContent(e),
                      )
                    : this._renderContent(c)),
              )
            : o.createElement(
                'div',
                {
                  id: t,
                  className: w,
                  onClick: i ? void 0 : this._handleClick,
                  title: d,
                  'data-tooltip-hotkey': m,
                  ref: this._handleWrapperRef,
                  'data-role': 'button',
                  tabIndex: g,
                  onKeyDown: this._handleKeyDown,
                  ...(0, l.filterDataProps)(this.props),
                },
                s,
                n &&
                  o.createElement(
                    'div',
                    { className: v.arrow },
                    o.createElement(
                      'div',
                      { className: v.arrowWrap },
                      o.createElement(a.ToolWidgetCaret, { dropped: _ }),
                    ),
                  ),
                this.state.isOpened &&
                  (f
                    ? o.createElement(h.MatchMedia, { rule: f }, (e) =>
                        this._renderContent(e),
                      )
                    : this._renderContent(c)),
              )
        }
        close() {
          this._handleToggleDropdown(!1)
        }
        focus() {
          var e
          null === (e = this._wrapperRef) || void 0 === e || e.focus()
        }
        update() {
          null !== this._controller.current && this._controller.current.update()
        }
        _renderContent(e) {
          const {
              menuDataName: t,
              minWidth: n,
              menuClassName: r,
              maxHeight: s,
              drawerPosition: a = 'Bottom',
              children: l,
            } = this.props,
            { isOpened: h } = this.state,
            p = {
              horizontalMargin: this.props.horizontalMargin || 0,
              verticalMargin: this.props.verticalMargin || 2,
              verticalAttachEdge: this.props.verticalAttachEdge,
              horizontalAttachEdge: this.props.horizontalAttachEdge,
              verticalDropDirection: this.props.verticalDropDirection,
              horizontalDropDirection: this.props.horizontalDropDirection,
              matchButtonAndListboxWidths:
                this.props.matchButtonAndListboxWidths,
            },
            m = Boolean(h && e && a),
            v = ((e) => 'function' == typeof e)(l) ? l({ isDrawer: m }) : l
          return m
            ? o.createElement(
                c.DrawerManager,
                null,
                o.createElement(
                  u.Drawer,
                  { onClose: this._handleClose, position: a, 'data-name': t },
                  v,
                ),
              )
            : o.createElement(
                i.PopupMenu,
                {
                  reference: this.props.menuReference,
                  controller: this._controller,
                  closeOnClickOutside: this.props.closeOnClickOutside,
                  doNotCloseOn: this,
                  isOpened: h,
                  minWidth: n,
                  onClose: this._handleClose,
                  position: (0, d.getPopupPositioner)(this._wrapperRef, p),
                  className: r,
                  maxHeight: s,
                  'data-name': t,
                  tabIndex: 'div' !== this.props.tag ? -1 : void 0,
                  onOpen: this._handleOpen,
                  onKeyDown: this.props.onMenuKeyDown,
                  onFocus: this.props.onMenuFocus,
                },
                v,
              )
        }
      }
      g.defaultProps = { arrow: !0, closeOnClickOutside: !0, theme: v }
    },
    481853: (e, t, n) => {
      n.d(t, { BrokerService: () => r })
      var o = n(650151)
      class r {
        constructor(e) {
          ;(this._activeBroker = null),
            (this._trading = e),
            this._trading.onConnectionStatusChange.subscribe(
              this,
              this._onStatusChange,
            ),
            this._onStatusChange(this._trading.connectStatus())
        }
        activeBroker() {
          return this._activeBroker
        }
        trading() {
          return this._trading
        }
        _stopService() {
          this.stopService(),
            (0, o.ensureNotNull)(
              this._activeBroker,
            ).currentAccountUpdate.unsubscribeAll(this)
        }
        _startService() {
          this.startService(),
            (0, o.ensureNotNull)(
              this._activeBroker,
            ).currentAccountUpdate.subscribe(this, this._onCurrentAccountUpdate)
        }
        _onStatusChange(e) {
          const t = this._trading.activeBroker()
          ;(this._activeBroker === t && 1 === e) ||
            (null !== this._activeBroker &&
              (this._stopService(), (this._activeBroker = null)),
            null !== t &&
              1 === e &&
              ((this._activeBroker = t),
              this._startService(),
              (this._lastAccountId = t.currentAccount())))
        }
        _onCurrentAccountUpdate() {
          const e = (0, o.ensureNotNull)(this._activeBroker)
          this._lastAccountId !== e.currentAccount() &&
            (this.stopService(),
            this.startService(),
            (this._lastAccountId = e.currentAccount()))
        }
      }
    },
    465890: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>'
    },
    100578: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>'
    },
  },
])
