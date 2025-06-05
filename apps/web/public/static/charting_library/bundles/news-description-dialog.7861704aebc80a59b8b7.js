;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4664],
  {
    531899: (e) => {
      e.exports = {
        'close-button': 'close-button-FuMQAaGA',
        'close-icon': 'close-icon-FuMQAaGA',
        'button-l': 'button-l-FuMQAaGA',
        'button-m': 'button-m-FuMQAaGA',
        'button-s': 'button-s-FuMQAaGA',
        'button-xs': 'button-xs-FuMQAaGA',
        'button-xxs': 'button-xxs-FuMQAaGA',
      }
    },
    705734: (e) => {
      e.exports = {
        dialog: 'dialog-aRAWUDhF',
        rounded: 'rounded-aRAWUDhF',
        shadowed: 'shadowed-aRAWUDhF',
        fullscreen: 'fullscreen-aRAWUDhF',
        darker: 'darker-aRAWUDhF',
        backdrop: 'backdrop-aRAWUDhF',
      }
    },
    937301: (e) => {
      e.exports = { description: 'description-JwsSKrC3' }
    },
    330233: (e) => {
      e.exports = { title: 'title-KX2tCBZq', body: 'body-KX2tCBZq' }
    },
    955677: (e) => {
      e.exports = {
        wrap: 'wrap-VeoIyDt4',
        container: 'container-VeoIyDt4',
        backdrop: 'backdrop-VeoIyDt4',
        modal: 'modal-VeoIyDt4',
        dialog: 'dialog-VeoIyDt4',
      }
    },
    80137: (e, t, n) => {
      n.d(t, { Dialog: () => d })
      var s = n(50959),
        r = n(497754),
        o = n(682925),
        i = n(801808),
        a = n(800417),
        c = n(705734)
      class d extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._manager = new i.OverlapManager()),
            (this._handleSlot = (e) => {
              this._manager.setContainer(e)
            })
        }
        render() {
          const {
              rounded: e = !0,
              shadowed: t = !0,
              fullscreen: n = !1,
              darker: i = !1,
              className: d,
              backdrop: l,
              containerTabIndex: u = -1,
            } = this.props,
            h = r(
              d,
              c.dialog,
              e && c.rounded,
              t && c.shadowed,
              n && c.fullscreen,
              i && c.darker,
            ),
            p = (0, a.filterDataProps)(this.props),
            m = this.props.style
              ? { ...this._createStyles(), ...this.props.style }
              : this._createStyles()
          return s.createElement(
            s.Fragment,
            null,
            s.createElement(
              o.SlotContext.Provider,
              { value: this._manager },
              l &&
                s.createElement('div', {
                  onClick: this.props.onClickBackdrop,
                  className: c.backdrop,
                }),
              s.createElement(
                'div',
                {
                  ...p,
                  className: h,
                  style: m,
                  ref: this.props.reference,
                  onFocus: this.props.onFocus,
                  onMouseDown: this.props.onMouseDown,
                  onMouseUp: this.props.onMouseUp,
                  onClick: this.props.onClick,
                  onKeyDown: this.props.onKeyDown,
                  tabIndex: u,
                  'aria-label': this.props.containerAriaLabel,
                },
                this.props.children,
              ),
            ),
            s.createElement(o.Slot, { reference: this._handleSlot }),
          )
        }
        _createStyles() {
          const {
            bottom: e,
            left: t,
            width: n,
            right: s,
            top: r,
            zIndex: o,
            height: i,
          } = this.props
          return {
            bottom: e,
            left: t,
            right: s,
            top: r,
            zIndex: o,
            maxWidth: n,
            height: i,
          }
        }
      }
    },
    778199: (e, t, n) => {
      function s(e, t, n, s, r) {
        function o(r) {
          if (e > r.timeStamp) return
          const o = r.target
          void 0 !== n &&
            null !== t &&
            null !== o &&
            o.ownerDocument === s &&
            (t.contains(o) || n(r))
        }
        return (
          r.click && s.addEventListener('click', o, !1),
          r.mouseDown && s.addEventListener('mousedown', o, !1),
          r.touchEnd && s.addEventListener('touchend', o, !1),
          r.touchStart && s.addEventListener('touchstart', o, !1),
          () => {
            s.removeEventListener('click', o, !1),
              s.removeEventListener('mousedown', o, !1),
              s.removeEventListener('touchend', o, !1),
              s.removeEventListener('touchstart', o, !1)
          }
        )
      }
      n.d(t, { addOutsideEventListener: () => s })
    },
    908783: (e, t, n) => {
      n.d(t, { useOutsideEvent: () => o })
      var s = n(50959),
        r = n(778199)
      function o(e) {
        const {
            click: t,
            mouseDown: n,
            touchEnd: o,
            touchStart: i,
            handler: a,
            reference: c,
            ownerDocument: d = document,
          } = e,
          l = (0, s.useRef)(null),
          u = (0, s.useRef)(new CustomEvent('timestamp').timeStamp)
        return (
          (0, s.useLayoutEffect)(() => {
            const e = { click: t, mouseDown: n, touchEnd: o, touchStart: i },
              s = c ? c.current : l.current
            return (0, r.addOutsideEventListener)(u.current, s, a, d, e)
          }, [t, n, o, i, a]),
          c || l
        )
      }
    },
    72571: (e, t, n) => {
      n.d(t, { Icon: () => r })
      var s = n(50959)
      const r = s.forwardRef((e, t) => {
        const { icon: n = '', ...r } = e
        return s.createElement('span', {
          ...r,
          ref: t,
          dangerouslySetInnerHTML: { __html: n },
        })
      })
    },
    682925: (e, t, n) => {
      n.d(t, { Slot: () => r, SlotContext: () => o })
      var s = n(50959)
      class r extends s.Component {
        shouldComponentUpdate() {
          return !1
        }
        render() {
          return s.createElement('div', {
            style: { position: 'fixed', zIndex: 150, left: 0, top: 0 },
            ref: this.props.reference,
          })
        }
      }
      const o = s.createContext(null)
    },
    800417: (e, t, n) => {
      function s(e) {
        return o(e, i)
      }
      function r(e) {
        return o(e, a)
      }
      function o(e, t) {
        const n = Object.entries(e).filter(t),
          s = {}
        for (const [e, t] of n) s[e] = t
        return s
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
        filterDataProps: () => s,
        filterProps: () => o,
        isAriaAttribute: () => a,
        isDataAttribute: () => i,
      })
    },
    738036: (e, t, n) => {
      n.d(t, { OutsideEvent: () => r })
      var s = n(908783)
      function r(e) {
        const { children: t, ...n } = e
        return t((0, s.useOutsideEvent)(n))
      }
    },
    801808: (e, t, n) => {
      n.d(t, { OverlapManager: () => o, getRootOverlapManager: () => a })
      var s = n(650151)
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
      class o {
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
          const s = this._document.createElement('div')
          if (
            ((s.style.position = t.position),
            (s.style.zIndex = this._index.toString()),
            (s.dataset.id = e),
            void 0 !== t.index)
          ) {
            const e = this._container.childNodes.length
            if (t.index >= e) this._container.appendChild(s)
            else if (t.index <= 0)
              this._container.insertBefore(s, this._container.firstChild)
            else {
              const e = this._container.childNodes[t.index]
              this._container.insertBefore(s, e)
            }
          } else
            'reverse' === t.direction
              ? this._container.insertBefore(s, this._container.firstChild)
              : this._container.appendChild(s)
          return this._windows.set(e, s), ++this._index, s
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
        if (null !== t) return (0, s.ensureDefined)(i.get(t))
        {
          const t = new o(e),
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
    249161: (e, t, n) => {
      n.d(t, { KeyboardDocumentListener: () => r })
      var s = n(50959)
      class r extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._handleKeyDown = (e) => {
              e.keyCode === this.props.keyCode && this.props.handler(e)
            })
        }
        componentDidMount() {
          document.addEventListener(
            this.props.eventType || 'keydown',
            this._handleKeyDown,
            !1,
          )
        }
        componentWillUnmount() {
          document.removeEventListener(
            this.props.eventType || 'keydown',
            this._handleKeyDown,
            !1,
          )
        }
        render() {
          return null
        }
      }
    },
    930052: (e, t, n) => {
      n.d(t, { MatchMedia: () => r })
      var s = n(50959)
      class r extends s.PureComponent {
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
    874485: (e, t, n) => {
      n.d(t, { makeOverlapable: () => o })
      var s = n(50959),
        r = n(813113)
      function o(e) {
        return class extends s.PureComponent {
          render() {
            const { isOpened: t, root: n } = this.props
            if (!t) return null
            const o = s.createElement(e, { ...this.props, zIndex: 150 })
            return 'parent' === n ? o : s.createElement(r.Portal, null, o)
          }
        }
      }
    },
    813113: (e, t, n) => {
      n.d(t, { Portal: () => c, PortalContext: () => d })
      var s = n(50959),
        r = n(500962),
        o = n(925931),
        i = n(801808),
        a = n(682925)
      class c extends s.PureComponent {
        constructor() {
          super(...arguments), (this._uuid = (0, o.nanoid)())
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
              s.createElement(d.Provider, { value: this }, this.props.children),
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
      c.contextType = a.SlotContext
      const d = s.createContext(null)
    },
    829766: (e) => {
      e.exports = {
        dialog: 'dialog-bqT9_WoX',
        closeButton: 'closeButton-bqT9_WoX',
        actions: 'actions-bqT9_WoX',
      }
    },
    863984: (e, t, n) => {
      n.r(t), n.d(t, { openLibraryNewsDescriptionDialogImpl: () => S })
      var s = n(50959),
        r = n(500962),
        o = n(609838),
        i = n(497754),
        a = n(930052),
        c = n(80137),
        d = n(874485),
        l = n(738036),
        u = n(955677)
      class h extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._containerRef = null),
            (this._handleContainerRef = (e) => {
              this._containerRef = e
            })
        }
        componentDidMount() {
          var e
          this.props.autofocus &&
            (null === (e = this._containerRef) || void 0 === e || e.focus())
        }
        render() {
          const {
            zIndex: e,
            onClickOutside: t,
            children: n,
            className: r,
          } = this.props
          return s.createElement(
            'div',
            {
              ref: this._handleContainerRef,
              style: { zIndex: e },
              'data-dialog-name': this.props['data-dialog-name'],
              tabIndex: -1,
            },
            s.createElement('div', { className: u.backdrop }),
            s.createElement(
              'div',
              { className: u.wrap },
              s.createElement(
                'div',
                { className: u.container },
                s.createElement(
                  l.OutsideEvent,
                  { mouseDown: !0, touchStart: !0, handler: t },
                  (e) =>
                    s.createElement(
                      'div',
                      { className: u.modal, ref: e },
                      s.createElement(
                        c.Dialog,
                        { ...this.props, className: i(r, u.dialog) },
                        n,
                      ),
                    ),
                ),
              ),
            ),
          )
        }
      }
      h.defaultProps = { width: 500 }
      const p = (0, d.makeOverlapable)(h)
      var m = n(72571),
        v = n(117105),
        w = n(315130),
        g = n(238822),
        f = n(663346),
        x = n(534983),
        _ = n(531899),
        y = n.n(_)
      function E(e = 'l') {
        switch (e) {
          case 'l':
            return v
          case 'm':
          default:
            return w
          case 's':
            return g
          case 'xs':
            return f
          case 'xxs':
            return x
        }
      }
      const C = s.forwardRef((e, t) => {
        const { className: n, size: r, ...o } = e,
          a = i(y()['close-button'], y()[`button-${r}`], n)
        return s.createElement(
          'button',
          { ...o, type: 'button', className: a, ref: t },
          s.createElement(m.Icon, {
            icon: E(r),
            className: y()['close-icon'],
            'aria-hidden': !0,
          }),
        )
      })
      var b = n(249161),
        k = n(586240),
        D = n(829766)
      function N(e) {
        const {
            className: t,
            children: r,
            isOpened: c,
            maxWidth: d,
            onCloseIntent: l,
            closeOnOutsideClick: u = !0,
            closeOnEsc: h = !0,
            showCloseButton: m = !0,
            actions: v,
            fullscreenMode: w = 1,
          } = e,
          g = o.t(null, { context: 'action' }, n(768508))
        return s.createElement(
          a.MatchMedia,
          { rule: k['media-phone-vertical'] },
          (e) => {
            const n = 0 === w || e
            return s.createElement(
              p,
              {
                width: M(d, n),
                className: i(D.dialog, t),
                isOpened: c,
                onClickOutside: u ? l : void 0,
                fullscreen: n,
                rounded: !n,
              },
              m &&
                s.createElement(C, {
                  className: D.closeButton,
                  'aria-label': g,
                  onClick: l,
                  size: 'm',
                }),
              l &&
                h &&
                s.createElement(b.KeyboardDocumentListener, {
                  keyCode: 27,
                  handler: l,
                }),
              'function' == typeof r ? r(n) : r,
              v && s.createElement('div', { className: D.actions }, v(n)),
            )
          },
        )
      }
      function M(e, t) {
        return t ? '100%' : e || '100%'
      }
      const A = n(330233)
      function I(e) {
        const { title: t, content: n, theme: r = A, header: o } = e
        return s.createElement(
          'article',
          { className: r.container },
          t && s.createElement('h2', { className: r.title }, t),
          o,
          s.createElement('div', { className: r.body }, n),
        )
      }
      var O = n(937301)
      function W(e) {
        const { title: t, description: n } = e
        return s.createElement(I, {
          title: t,
          content: s.createElement('div', { className: O.description }, n),
        })
      }
      function S(e) {
        const t = document.createElement('div')
        r.render(
          s.createElement(
            N,
            {
              isOpened: !0,
              onCloseIntent: () => r.unmountComponentAtNode(t),
              maxWidth: 800,
            },
            s.createElement(W, { ...e }),
          ),
          t,
        )
      }
    },
    117105: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 21 21m0-21-21 21"/></svg>'
    },
    315130: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 15 15m0-15-15 15"/></svg>'
    },
    238822: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 11 11m0-11-11 11"/></svg>'
    },
    663346: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 9 9m0-9-9 9"/></svg>'
    },
    534983: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="10" height="10"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 7 7m0-7-7 7"/></svg>'
    },
    925931: (e, t, n) => {
      n.d(t, { nanoid: () => s })
      const s = (e = 21) =>
        crypto
          .getRandomValues(new Uint8Array(e))
          .reduce(
            (e, t) =>
              (e +=
                (t &= 63) < 36
                  ? t.toString(36)
                  : t < 62
                    ? (t - 26).toString(36).toUpperCase()
                    : t > 62
                      ? '-'
                      : '_'),
            '',
          )
    },
    586240: (e) => {
      e.exports = JSON.parse(
        '{"size-header-height":"64px","media-phone-vertical":"screen and (max-width: 479px)","media-mf-phone-landscape":"screen and (min-width: 568px)"}',
      )
    },
    768508: (e) => {
      e.exports = {
        ar: ['إغلاق'],
        ca_ES: ['Tancament'],
        cs: 'Close',
        de: 'Close',
        el: 'Close',
        en: 'Close',
        es: ['Cierre'],
        fa: 'Close',
        fr: ['Fermeture'],
        he_IL: ['סגירה'],
        hu_HU: ['Zárás'],
        id_ID: ['Tutup'],
        it: ['Chiudi'],
        ja: ['閉じる'],
        ko: ['닫기'],
        ms_MY: ['Tutup'],
        nl_NL: 'Close',
        pl: ['Zamknij'],
        pt: ['Fechar'],
        ro: 'Close',
        ru: ['Закрыть'],
        sv: 'Close',
        th: ['ปิด'],
        tr: ['Kapat'],
        vi: ['Đóng'],
        zh: ['关闭'],
        zh_TW: ['關閉'],
      }
    },
  },
])
