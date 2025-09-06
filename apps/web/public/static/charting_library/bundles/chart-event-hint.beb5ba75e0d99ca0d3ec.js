;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [6166],
  {
    97754: (e, t) => {
      var r
      !(() => {
        var n = {}.hasOwnProperty
        function o() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var r = arguments[t]
            if (r) {
              var s = typeof r
              if ('string' === s || 'number' === s) e.push(r)
              else if (Array.isArray(r) && r.length) {
                var i = o.apply(null, r)
                i && e.push(i)
              } else if ('object' === s)
                for (var a in r) n.call(r, a) && r[a] && e.push(a)
            }
          }
          return e.join(' ')
        }
        e.exports
          ? ((o.default = o), (e.exports = o))
          : void 0 === (r = (() => o).apply(t, [])) || (e.exports = r)
      })()
    },
    49931: (e) => {
      e.exports = {
        container: 'container-kfvcmk8t',
        centerElement: 'centerElement-kfvcmk8t',
        text: 'text-kfvcmk8t',
      }
    },
    55581: (e) => {
      e.exports = {
        container: 'container-zLVm6B4t',
        content: 'content-zLVm6B4t',
        arrowHolder: 'arrowHolder-zLVm6B4t',
        'arrowHolder--below': 'arrowHolder--below-zLVm6B4t',
        'arrowHolder--above': 'arrowHolder--above-zLVm6B4t',
        'arrowHolder--before': 'arrowHolder--before-zLVm6B4t',
        'arrowHolder--after': 'arrowHolder--after-zLVm6B4t',
        'arrowHolder--above-fix': 'arrowHolder--above-fix-zLVm6B4t',
        'arrowHolder--before-rtl-fix': 'arrowHolder--before-rtl-fix-zLVm6B4t',
        'arrowHolder--after-ltr-fix': 'arrowHolder--after-ltr-fix-zLVm6B4t',
        label: 'label-zLVm6B4t',
        closeButton: 'closeButton-zLVm6B4t',
      }
    },
    9745: (e, t, r) => {
      r.d(t, { Icon: () => o })
      var n = r(50959)
      const o = n.forwardRef((e, t) => {
        const {
            icon: r = '',
            title: o,
            ariaLabel: s,
            ariaLabelledby: i,
            ariaHidden: a,
            ...l
          } = e,
          d = !!(o || s || i)
        return n.createElement('span', {
          role: 'img',
          ...l,
          ref: t,
          'aria-label': s,
          'aria-labelledby': i,
          'aria-hidden': a || !d,
          title: o,
          dangerouslySetInnerHTML: { __html: r },
        })
      })
    },
    99663: (e, t, r) => {
      r.d(t, { Slot: () => o, SlotContext: () => s })
      var n = r(50959)
      class o extends n.Component {
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
    67961: (e, t, r) => {
      r.d(t, { OverlapManager: () => i, getRootOverlapManager: () => l })
      var n = r(50151),
        o = r(34811)
      class s {
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
      class i {
        constructor(e = document) {
          ;(this._storage = new s()),
            (this._windows = new Map()),
            (this._index = 0),
            (this._document = e),
            (this._container = e.createDocumentFragment())
        }
        setContainer(e) {
          const t = this._container,
            r = null === e ? this._document.createDocumentFragment() : e
          !((e, t) => {
            Array.from(e.childNodes).forEach((e) => {
              e.nodeType === Node.ELEMENT_NODE && t.appendChild(e)
            })
          })(t, r),
            (this._container = r)
        }
        registerWindow(e) {
          this._storage.has(e) || this._storage.add(e)
        }
        ensureWindow(e, t = { position: 'fixed', direction: 'normal' }) {
          const r = this._windows.get(e)
          if (void 0 !== r) return r
          this.registerWindow(e)
          const n = this._document.createElement('div')
          if (
            ((n.style.position = t.position),
            (n.style.zIndex = this._index.toString()),
            (n.dataset.id = e),
            void 0 !== t.index)
          ) {
            const e = this._container.childNodes.length
            if (t.index >= e) this._container.appendChild(n)
            else if (t.index <= 0)
              this._container.insertBefore(n, this._container.firstChild)
            else {
              const e = this._container.childNodes[t.index]
              this._container.insertBefore(n, e)
            }
          } else
            'reverse' === t.direction
              ? this._container.insertBefore(n, this._container.firstChild)
              : this._container.appendChild(n)
          return this._windows.set(e, n), ++this._index, n
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
        moveLastWindowToTop() {
          const e = this._storage.getItems(),
            t = e[e.length - 1]
          t && this.moveToTop(t)
        }
        moveToTop(e) {
          if (this.getZindex(e) !== this._index) {
            const t = this.ensureWindow(e)
            this._windows.forEach((e, r) => {
              e.hasAttribute(o.FOCUS_TRAP_DATA_ATTRIBUTE) &&
                e.setAttribute(
                  o.FOCUS_TRAP_DATA_ATTRIBUTE,
                  e === t ? 'true' : 'false',
                )
            }),
              (t.style.zIndex = (++this._index).toString())
          }
        }
        removeWindow(e) {
          this.unregisterWindow(e)
        }
      }
      const a = new WeakMap()
      function l(e = document) {
        const t = e.getElementById('overlap-manager-root')
        if (null !== t) return (0, n.ensureDefined)(a.get(t))
        {
          const t = new i(e),
            r = ((e) => {
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
          return a.set(r, t), t.setContainer(r), e.body.appendChild(r), t
        }
      }
      var d
      !((e) => {
        e[(e.BaseZindex = 150)] = 'BaseZindex'
      })(d || (d = {}))
    },
    5015: (e, t, r) => {
      r.r(t), r.d(t, { ChartEventHintRenderer: () => p })
      var n = r(50959),
        o = r(32227),
        s = r(97754),
        i = r(9745),
        a = (r(42842), r(33765)),
        l = r(55581)
      n.PureComponent
      function d(e) {
        const {
          className: t,
          containerClassName: r,
          contentClassName: o,
          reference: d,
          style: c,
          arrow: h = !0,
          arrowClassName: p,
          arrowReference: u,
          onClose: m,
          arrowStyle: f,
          children: _,
          role: w,
          ...v
        } = e
        return n.createElement(
          'div',
          { ...v, className: t, ref: d, style: c, 'data-role': w },
          h && n.createElement('div', { className: p, ref: u, style: f }),
          n.createElement(
            'div',
            { className: s(l.container, r) },
            n.createElement('div', { className: s(l.content, o) }, _),
            m &&
              n.createElement(i.Icon, {
                className: l.closeButton,
                icon: a,
                onClick: m,
              }),
          ),
        )
      }
      var c = r(49931)
      function h(e) {
        const { bottomOffset: t, text: r, onClose: o } = e
        return n.createElement(
          'div',
          { className: c.container, style: { bottom: t } },
          n.createElement(
            'div',
            { className: c.centerElement },
            n.createElement(
              d,
              { arrow: !1, onClose: o },
              n.createElement('div', { className: c.text }, r),
            ),
          ),
        )
      }
      class p {
        constructor(e) {
          ;(this.type = 0),
            (this._wrap = document.createElement('div')),
            (this._container = e)
        }
        show(e, t) {
          if (!this._wrap) return
          this.hide(), this._container.append(this._wrap)
          const r = {
            text: e,
            onClose: () => {
              t && t(), this.hide()
            },
            bottomOffset: Array.from(this._container.children).reduce(
              (e, t) => (
                t.getAttribute('data-is-chart-toolbar-component') &&
                  (e += t.clientHeight),
                e
              ),
              32,
            ),
          }
          o.render(n.createElement(h, { ...r }), this._wrap)
        }
        hide() {
          this._wrap &&
            (o.unmountComponentAtNode(this._wrap), this._wrap.remove())
        }
        destroy() {
          this.hide(), delete this._wrap
        }
      }
    },
    42842: (e, t, r) => {
      r.d(t, { Portal: () => d, PortalContext: () => c })
      var n = r(50959),
        o = r(32227),
        s = r(55698),
        i = r(67961),
        a = r(34811),
        l = r(99663)
      class d extends n.PureComponent {
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
          ;(e.style.top = this.props.top || ''),
            (e.style.bottom = this.props.bottom || ''),
            (e.style.left = this.props.left || ''),
            (e.style.right = this.props.right || ''),
            (e.style.pointerEvents = this.props.pointerEvents || '')
          const t = this.props.className
          return (
            t &&
              ('string' == typeof t
                ? e.classList.add(t)
                : e.classList.add(...t)),
            this.props.shouldTrapFocus &&
              !e.hasAttribute(a.FOCUS_TRAP_DATA_ATTRIBUTE) &&
              e.setAttribute(a.FOCUS_TRAP_DATA_ATTRIBUTE, 'true'),
            this.props['aria-hidden'] && e.setAttribute('aria-hidden', 'true'),
            o.createPortal(
              n.createElement(c.Provider, { value: this }, this.props.children),
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
      d.contextType = l.SlotContext
      const c = n.createContext(null)
    },
    33765: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="currentColor" d="M9.707 9l4.647-4.646-.707-.708L9 8.293 4.354 3.646l-.708.708L8.293 9l-4.647 4.646.708.708L9 9.707l4.646 4.647.708-.707L9.707 9z"/></svg>'
    },
    55698: (e, t, r) => {
      r.d(t, { nanoid: () => n })
      const n = (e = 21) =>
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
  },
])
