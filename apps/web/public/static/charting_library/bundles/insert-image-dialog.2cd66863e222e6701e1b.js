;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7038],
  {
    45946: (e) => {
      e.exports = {
        button: 'button-D4RPB3ZC',
        content: 'content-D4RPB3ZC',
        iconOnly: 'iconOnly-D4RPB3ZC',
        link: 'link-D4RPB3ZC',
        brand: 'brand-D4RPB3ZC',
        primary: 'primary-D4RPB3ZC',
        secondary: 'secondary-D4RPB3ZC',
        gray: 'gray-D4RPB3ZC',
        green: 'green-D4RPB3ZC',
        red: 'red-D4RPB3ZC',
        black: 'black-D4RPB3ZC',
        'black-friday': 'black-friday-D4RPB3ZC',
        'cyber-monday': 'cyber-monday-D4RPB3ZC',
        slot: 'slot-D4RPB3ZC',
        xsmall: 'xsmall-D4RPB3ZC',
        withStartSlot: 'withStartSlot-D4RPB3ZC',
        withEndSlot: 'withEndSlot-D4RPB3ZC',
        startSlotWrap: 'startSlotWrap-D4RPB3ZC',
        endSlotWrap: 'endSlotWrap-D4RPB3ZC',
        small: 'small-D4RPB3ZC',
        medium: 'medium-D4RPB3ZC',
        large: 'large-D4RPB3ZC',
        xlarge: 'xlarge-D4RPB3ZC',
        animated: 'animated-D4RPB3ZC',
        stretch: 'stretch-D4RPB3ZC',
        grouped: 'grouped-D4RPB3ZC',
        adjustPosition: 'adjustPosition-D4RPB3ZC',
        firstRow: 'firstRow-D4RPB3ZC',
        firstCol: 'firstCol-D4RPB3ZC',
        'no-corner-top-left': 'no-corner-top-left-D4RPB3ZC',
        'no-corner-top-right': 'no-corner-top-right-D4RPB3ZC',
        'no-corner-bottom-right': 'no-corner-bottom-right-D4RPB3ZC',
        'no-corner-bottom-left': 'no-corner-bottom-left-D4RPB3ZC',
        textWrap: 'textWrap-D4RPB3ZC',
        multilineContent: 'multilineContent-D4RPB3ZC',
        secondaryText: 'secondaryText-D4RPB3ZC',
        primaryText: 'primaryText-D4RPB3ZC',
      }
    },
    85862: (e) => {
      e.exports = { disableSelfPositioning: 'disableSelfPositioning-dYiqkKAE' }
    },
    2182: (e) => {
      e.exports = {
        'small-height-breakpoint': '(max-height: 360px)',
        footer: 'footer-PhMf7PhQ',
        submitButton: 'submitButton-PhMf7PhQ',
        buttons: 'buttons-PhMf7PhQ',
      }
    },
    96108: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': '(max-width: 768px)',
        'small-height-breakpoint': '(max-height: 360px)',
        'tablet-small-breakpoint': '(max-width: 440px)',
      }
    },
    58189: (e) => {
      e.exports = {
        container: 'container-N4SM7hWm',
        textBlockHeadline: 'textBlockHeadline-N4SM7hWm',
        dropzone: 'dropzone-N4SM7hWm',
        textBlock: 'textBlock-N4SM7hWm',
        textBlockError: 'textBlockError-N4SM7hWm',
        img: 'img-N4SM7hWm',
        remove: 'remove-N4SM7hWm',
        backdrop: 'backdrop-N4SM7hWm',
        mainText: 'mainText-N4SM7hWm',
      }
    },
    50219: (e) => {
      e.exports = { wrap: 'wrap-b6_0ORMg', disabled: 'disabled-b6_0ORMg' }
    },
    94085: (e) => {
      e.exports = {
        opacity: 'opacity-EnWts7Xu',
        opacitySlider: 'opacitySlider-EnWts7Xu',
        opacitySliderGradient: 'opacitySliderGradient-EnWts7Xu',
        pointer: 'pointer-EnWts7Xu',
        dragged: 'dragged-EnWts7Xu',
        opacityPointerWrap: 'opacityPointerWrap-EnWts7Xu',
        opacityInputWrap: 'opacityInputWrap-EnWts7Xu',
        opacityInput: 'opacityInput-EnWts7Xu',
        opacityInputPercent: 'opacityInputPercent-EnWts7Xu',
        accessible: 'accessible-EnWts7Xu',
      }
    },
    67248: (e, t, n) => {
      var r, o, i
      function s(e = 'default') {
        switch (e) {
          case 'default':
            return 'primary'
          case 'stroke':
            return 'secondary'
        }
      }
      function a(e = 'primary') {
        switch (e) {
          case 'primary':
            return 'brand'
          case 'success':
            return 'green'
          case 'default':
            return 'gray'
          case 'danger':
            return 'red'
        }
      }
      function l(e = 'm') {
        switch (e) {
          case 's':
            return 'xsmall'
          case 'm':
            return 'small'
          case 'l':
            return 'large'
        }
      }
      n.d(t, { Button: () => S }),
        ((e) => {
          ;(e.Primary = 'primary'),
            (e.Success = 'success'),
            (e.Default = 'default'),
            (e.Danger = 'danger')
        })(r || (r = {})),
        ((e) => {
          ;(e.Small = 's'), (e.Medium = 'm'), (e.Large = 'l')
        })(o || (o = {})),
        ((e) => {
          ;(e.Default = 'default'), (e.Stroke = 'stroke')
        })(i || (i = {}))
      var c = n(50959),
        u = n(97754),
        d = n(95604)
      var p = n(45946),
        m = n.n(p)
      const h =
        'apply-overflow-tooltip apply-overflow-tooltip--check-children-recursively apply-overflow-tooltip--allow-text apply-common-tooltip'
      function g(e) {
        const {
            size: t = 'medium',
            variant: n = 'primary',
            stretch: r = !1,
            startSlot: o,
            endSlot: i,
            iconOnly: s = !1,
            className: a,
            isGrouped: l,
            cellState: c,
            disablePositionAdjustment: p = !1,
            primaryText: g,
            secondaryText: f,
            isAnchor: y = !1,
          } = e,
          v = ((e) => ('brand' === e ? 'black' : 'blue' === e ? 'brand' : e))(
            e.color ?? 'brand',
          ),
          b = ((e) => {
            let t = ''
            return (
              0 !== e &&
                (1 & e && (t = u(t, m()['no-corner-top-left'])),
                2 & e && (t = u(t, m()['no-corner-top-right'])),
                4 & e && (t = u(t, m()['no-corner-bottom-right'])),
                8 & e && (t = u(t, m()['no-corner-bottom-left']))),
              t
            )
          })((0, d.getGroupCellRemoveRoundBorders)(c)),
          C = s && (o || i)
        return u(
          a,
          m().button,
          m()[t],
          m()[v],
          m()[n],
          r && m().stretch,
          o && m().withStartIcon,
          i && m().withEndIcon,
          C && m().iconOnly,
          b,
          l && m().grouped,
          l && !p && m().adjustPosition,
          l && c.isTop && m().firstRow,
          l && c.isLeft && m().firstCol,
          g && f && m().multilineContent,
          y && m().link,
          h,
        )
      }
      function f(e) {
        const {
          startSlot: t,
          iconOnly: n,
          children: r,
          endSlot: o,
          primaryText: i,
          secondaryText: s,
        } = e
        if (t && o && n)
          return c.createElement(
            'span',
            { className: u(m().slot, m().startSlotWrap) },
            t,
          )
        const a = n && (t ?? o),
          l = !t && !o && !n && !r && i && s
        return c.createElement(
          c.Fragment,
          null,
          t &&
            c.createElement(
              'span',
              { className: u(m().slot, m().startSlotWrap) },
              t,
            ),
          r && !a && c.createElement('span', { className: m().content }, r),
          o &&
            c.createElement(
              'span',
              { className: u(m().slot, m().endSlotWrap) },
              o,
            ),
          l &&
            !a &&
            ((e) =>
              e.primaryText &&
              e.secondaryText &&
              c.createElement(
                'div',
                { className: u(m().textWrap, h) },
                c.createElement(
                  'span',
                  { className: m().primaryText },
                  ' ',
                  e.primaryText,
                  ' ',
                ),
                'string' == typeof e.secondaryText
                  ? c.createElement(
                      'span',
                      { className: m().secondaryText },
                      ' ',
                      e.secondaryText,
                      ' ',
                    )
                  : c.createElement(
                      'span',
                      { className: m().secondaryText },
                      c.createElement('span', null, e.secondaryText.firstLine),
                      c.createElement('span', null, e.secondaryText.secondLine),
                    ),
              ))(e),
        )
      }
      var y = n(34094),
        v = n(86332),
        b = n(90186)
      function C(e, t) {
        return (n) => {
          if (t) return n.preventDefault(), void n.stopPropagation()
          e?.(n)
        }
      }
      function E(e) {
        const {
          className: t,
          color: n,
          variant: r,
          size: o,
          stretch: i,
          animated: s,
          iconOnly: a,
          startSlot: l,
          endSlot: c,
          primaryText: u,
          secondaryText: d,
          ...p
        } = e
        return {
          ...p,
          ...(0, b.filterDataProps)(e),
          ...(0, b.filterAriaProps)(e),
        }
      }
      function _(e) {
        const {
            reference: t,
            tooltipText: n,
            disabled: r,
            onClick: o,
            onMouseOver: i,
            onMouseOut: s,
            onMouseDown: a,
            ...l
          } = e,
          {
            isGrouped: u,
            cellState: d,
            disablePositionAdjustment: p,
          } = (0, c.useContext)(v.ControlGroupContext),
          m = g({
            ...l,
            isGrouped: u,
            cellState: d,
            disablePositionAdjustment: p,
          }),
          h =
            n ??
            (e.primaryText
              ? [e.primaryText, e.secondaryText].join(' ')
              : (0, y.getTextForTooltip)(e.children))
        return c.createElement(
          'button',
          {
            ...E(l),
            'aria-disabled': r,
            tabIndex: e.tabIndex ?? (r ? -1 : 0),
            className: m,
            ref: t,
            onClick: C(o, r),
            onMouseDown: C(a, r),
            'data-overflow-tooltip-text': h,
          },
          c.createElement(f, { ...l }),
        )
      }
      n(49406)
      function x(e) {
        const {
          intent: t,
          size: n,
          appearance: r,
          useFullWidth: o,
          icon: i,
          ...c
        } = e
        return { ...c, color: a(t), size: l(n), variant: s(r), stretch: o }
      }
      function S(e) {
        return c.createElement(_, { ...x(e) })
      }
    },
    86332: (e, t, n) => {
      n.d(t, { ControlGroupContext: () => r })
      const r = n(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    95604: (e, t, n) => {
      function r(e) {
        let t = 0
        return (
          (e.isTop && e.isLeft) || (t += 1),
          (e.isTop && e.isRight) || (t += 2),
          (e.isBottom && e.isLeft) || (t += 8),
          (e.isBottom && e.isRight) || (t += 4),
          t
        )
      }
      n.d(t, { getGroupCellRemoveRoundBorders: () => r })
    },
    43010: (e, t, n) => {
      n.d(t, { useIsomorphicLayoutEffect: () => o })
      var r = n(50959)
      function o(e, t) {
        ;('undefined' == typeof window ? r.useEffect : r.useLayoutEffect)(e, t)
      }
    },
    27267: (e, t, n) => {
      function r(e, t, n, r, o) {
        function i(o) {
          if (e > o.timeStamp) return
          const i = o.target
          void 0 !== n &&
            null !== t &&
            null !== i &&
            i.ownerDocument === r &&
            (t.contains(i) || n(o))
        }
        return (
          o.click && r.addEventListener('click', i, !1),
          o.mouseDown && r.addEventListener('mousedown', i, !1),
          o.touchEnd && r.addEventListener('touchend', i, !1),
          o.touchStart && r.addEventListener('touchstart', i, !1),
          () => {
            r.removeEventListener('click', i, !1),
              r.removeEventListener('mousedown', i, !1),
              r.removeEventListener('touchend', i, !1),
              r.removeEventListener('touchstart', i, !1)
          }
        )
      }
      n.d(t, { addOutsideEventListener: () => r })
    },
    36383: (e, t, n) => {
      n.d(t, { useOutsideEvent: () => s })
      var r = n(50959),
        o = n(43010),
        i = n(27267)
      function s(e) {
        const {
            click: t,
            mouseDown: n,
            touchEnd: s,
            touchStart: a,
            handler: l,
            reference: c,
          } = e,
          u = (0, r.useRef)(null),
          d = (0, r.useRef)(
            'undefined' == typeof window
              ? 0
              : new window.CustomEvent('timestamp').timeStamp,
          )
        return (
          (0, o.useIsomorphicLayoutEffect)(() => {
            const e = { click: t, mouseDown: n, touchEnd: s, touchStart: a },
              r = c ? c.current : u.current
            return (0, i.addOutsideEventListener)(d.current, r, l, document, e)
          }, [t, n, s, a, l]),
          c || u
        )
      }
    },
    9745: (e, t, n) => {
      n.d(t, { Icon: () => o })
      var r = n(50959)
      const o = r.forwardRef((e, t) => {
        const {
            icon: n = '',
            title: o,
            ariaLabel: i,
            ariaLabelledby: s,
            ariaHidden: a,
            ...l
          } = e,
          c = !!(o || i || s)
        return r.createElement('span', {
          role: 'img',
          ...l,
          ref: t,
          'aria-label': i,
          'aria-labelledby': s,
          'aria-hidden': a || !c,
          title: o,
          dangerouslySetInnerHTML: { __html: n },
        })
      })
    },
    99663: (e, t, n) => {
      n.d(t, { Slot: () => o, SlotContext: () => i })
      var r = n(50959)
      class o extends r.Component {
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
      const i = r.createContext(null)
    },
    90186: (e, t, n) => {
      function r(e) {
        return i(e, s)
      }
      function o(e) {
        return i(e, a)
      }
      function i(e, t) {
        const n = Object.entries(e).filter(t),
          r = {}
        for (const [e, t] of n) r[e] = t
        return r
      }
      function s(e) {
        const [t, n] = e
        return 0 === t.indexOf('data-') && 'string' == typeof n
      }
      function a(e) {
        return 0 === e[0].indexOf('aria-')
      }
      n.d(t, {
        filterAriaProps: () => o,
        filterDataProps: () => r,
        filterProps: () => i,
        isAriaAttribute: () => a,
        isDataAttribute: () => s,
      })
    },
    34094: (e, t, n) => {
      n.d(t, { getTextForTooltip: () => s })
      var r = n(50959)
      const o = (e) => (0, r.isValidElement)(e) && Boolean(e.props.children),
        i = (e) =>
          null == e || 'boolean' == typeof e || '{}' === JSON.stringify(e)
            ? ''
            : e.toString() + ' ',
        s = (e) =>
          Array.isArray(e) || (0, r.isValidElement)(e)
            ? r.Children.toArray(e)
                .reduce((e, t) => {
                  let n = ''
                  return (
                    (n =
                      (0, r.isValidElement)(t) && o(t)
                        ? s(t.props.children)
                        : (0, r.isValidElement)(t) && !o(t)
                          ? ''
                          : i(t)),
                    e.concat(n)
                  )
                }, '')
                .trim()
            : i(e)
    },
    67961: (e, t, n) => {
      n.d(t, { OverlapManager: () => s, getRootOverlapManager: () => l })
      var r = n(50151),
        o = n(34811)
      class i {
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
          ;(this._storage = new i()),
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
        moveLastWindowToTop() {
          const e = this._storage.getItems(),
            t = e[e.length - 1]
          t && this.moveToTop(t)
        }
        moveToTop(e) {
          if (this.getZindex(e) !== this._index) {
            const t = this.ensureWindow(e)
            this._windows.forEach((e, n) => {
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
        if (null !== t) return (0, r.ensureDefined)(a.get(t))
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
          return a.set(n, t), t.setContainer(n), e.body.appendChild(n), t
        }
      }
      var c
      !((e) => {
        e[(e.BaseZindex = 150)] = 'BaseZindex'
      })(c || (c = {}))
    },
    99054: (e, t, n) => {
      n.d(t, { setFixedBodyState: () => c })
      const r = (() => {
        let e
        return () => {
          if (void 0 === e) {
            const t = document.createElement('div'),
              n = t.style
            ;(n.visibility = 'hidden'),
              (n.width = '100px'),
              (n.msOverflowStyle = 'scrollbar'),
              document.body.appendChild(t)
            const r = t.offsetWidth
            t.style.overflow = 'scroll'
            const o = document.createElement('div')
            ;(o.style.width = '100%'), t.appendChild(o)
            const i = o.offsetWidth
            t.parentNode?.removeChild(t), (e = r - i)
          }
          return e
        }
      })()
      function o(e, t, n) {
        null !== e && e.style.setProperty(t, n)
      }
      function i(e, t) {
        return getComputedStyle(e, null).getPropertyValue(t)
      }
      function s(e, t) {
        return Number.parseInt(i(e, t))
      }
      let a = 0,
        l = !1
      function c(e) {
        const { body: t } = document,
          n = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++a) {
          const e = i(t, 'overflow'),
            a = s(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            (o(n, 'right', `${r()}px`),
            (t.style.paddingRight = `${a + r()}px`),
            (l = !0)),
            t.classList.add('i-no-scroll')
        } else if (
          !e &&
          a > 0 &&
          0 == --a &&
          (t.classList.remove('i-no-scroll'), l)
        ) {
          o(n, 'right', '0px')
          let e = 0
          0,
            t.scrollHeight <= t.clientHeight && (e -= r()),
            (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'),
            (l = !1)
        }
      }
    },
    87896: (e, t, n) => {
      n.d(t, { createReactRoot: () => d })
      var r = n(50959),
        o = n(32227),
        i = n(4237)
      const s = (0, r.createContext)({
        isOnMobileAppPage: () => !1,
        isRtl: !1,
        locale: 'en',
      })
      var a = n(84015),
        l = n(63273)
      const c = {
        iOs: 'old',
        android: 'new',
        old: 'old',
        new: 'new',
        any: 'any',
      }
      function u(e) {
        const [t] = (0, r.useState)({
          isOnMobileAppPage: (e) => (0, a.isOnMobileAppPage)(c[e]),
          isRtl: (0, l.isRtl)(),
          locale: window.locale,
        })
        return r.createElement(s.Provider, { value: t }, e.children)
      }
      function d(e, t, n = 'legacy') {
        const s = r.createElement(u, null, e)
        if ('modern' === n) {
          const e = (0, i.createRoot)(t)
          return (
            e.render(s),
            {
              render(t) {
                e.render(r.createElement(u, null, t))
              },
              unmount() {
                e.unmount()
              },
            }
          )
        }
        return (
          o.render(s, t),
          {
            render(e) {
              o.render(r.createElement(u, null, e), t)
            },
            unmount() {
              o.unmountComponentAtNode(t)
            },
          }
        )
      }
    },
    50182: (e, t, n) => {
      n.d(t, { AdaptiveConfirmDialog: () => m })
      var r,
        o = n(50959),
        i = n(97754),
        s = n.n(i),
        a = n(67248),
        l = n(50151),
        c = n(11542),
        u = n(68335),
        d = n(79418),
        p = n(2182)
      !((e) => {
        ;(e.Submit = 'submit'), (e.Cancel = 'cancel'), (e.None = 'none')
      })(r || (r = {}))
      class m extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._dialogRef = o.createRef()),
            (this._handleClose = () => {
              const {
                defaultActionOnClose: e,
                onSubmit: t,
                onCancel: n,
                onClose: r,
              } = this.props
              switch (e) {
                case 'submit':
                  t()
                  break
                case 'cancel':
                  n()
              }
              r()
            }),
            (this._handleCancel = () => {
              this.props.onCancel(), this.props.onClose()
            }),
            (this._handleKeyDown = (e) => {
              const {
                onSubmit: t,
                submitButtonDisabled: n,
                submitOnEnterKey: r,
              } = this.props
              13 === (0, u.hashFromEvent)(e) &&
                r &&
                (e.preventDefault(), n || t())
            })
        }
        render() {
          const {
            render: e,
            onClose: t,
            onSubmit: n,
            onCancel: r,
            footerLeftRenderer: i,
            submitButtonText: s,
            submitButtonDisabled: a,
            defaultActionOnClose: l,
            submitOnEnterKey: c,
            ...u
          } = this.props
          return o.createElement(d.AdaptivePopupDialog, {
            ...u,
            ref: this._dialogRef,
            onKeyDown: this._handleKeyDown,
            render: this._renderChildren(),
            onClose: this._handleClose,
          })
        }
        focus() {
          ;(0, l.ensureNotNull)(this._dialogRef.current).focus()
        }
        _renderChildren() {
          return (e) => {
            const {
              render: t,
              footerLeftRenderer: r,
              additionalButtons: i,
              submitButtonText: l,
              submitButtonDisabled: u,
              onSubmit: d,
              cancelButtonText: m,
              showCancelButton: h = !0,
              showSubmitButton: g = !0,
              submitButtonClassName: f,
              cancelButtonClassName: y,
              buttonsWrapperClassName: v,
            } = this.props
            return o.createElement(
              o.Fragment,
              null,
              t(e),
              o.createElement(
                'div',
                { className: p.footer },
                r && r(e.isSmallWidth),
                o.createElement(
                  'div',
                  { className: s()(p.buttons, v) },
                  i,
                  h &&
                    o.createElement(
                      a.Button,
                      {
                        className: y,
                        name: 'cancel',
                        appearance: 'stroke',
                        onClick: this._handleCancel,
                      },
                      m ?? c.t(null, void 0, n(4543)),
                    ),
                  g &&
                    o.createElement(
                      'span',
                      { className: p.submitButton },
                      o.createElement(
                        a.Button,
                        {
                          className: f,
                          disabled: u,
                          name: 'submit',
                          onClick: d,
                          'data-name': 'submit-button',
                        },
                        l ?? c.t(null, void 0, n(19295)),
                      ),
                    ),
                ),
              ),
            )
          }
        }
      }
      m.defaultProps = { defaultActionOnClose: 'submit', submitOnEnterKey: !0 }
    },
    24437: (e, t, n) => {
      n.d(t, { DialogBreakpoints: () => o })
      var r = n(96108)
      const o = {
        SmallHeight: r['small-height-breakpoint'],
        TabletSmall: r['tablet-small-breakpoint'],
        TabletNormal: r['tablet-normal-breakpoint'],
      }
    },
    88601: (e, t, n) => {
      n.d(t, { Transparency: () => l })
      var r = n(50959),
        o = n(97754),
        i = n(54368),
        s = n(19625),
        a = n(50219)
      function l(e) {
        const { value: t, disabled: n, onChange: l, className: c } = e
        return r.createElement(
          'div',
          { className: o(a.wrap, c, { [a.disabled]: n }) },
          r.createElement(i.Opacity, {
            hideInput: !0,
            color: s.colorsPalette['color-tv-blue-500'],
            opacity: 1 - t / 100,
            onChange: (e) => {
              n || l(100 - 100 * e)
            },
            disabled: n,
          }),
        )
      }
    },
    54368: (e, t, n) => {
      n.d(t, { Opacity: () => c })
      var r = n(50959),
        o = n(97754),
        i = n(50151),
        s = n(9859),
        a = n(68335),
        l = n(94085)
      class c extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._container = null),
            (this._pointer = null),
            (this._raf = null),
            (this._refContainer = (e) => {
              this._container = e
            }),
            (this._refPointer = (e) => {
              this._pointer = e
            }),
            (this._handlePosition = (e) => {
              null === this._raf &&
                (this._raf = requestAnimationFrame(() => {
                  const t = (0, i.ensureNotNull)(this._container),
                    n = (0, i.ensureNotNull)(this._pointer),
                    r = t.getBoundingClientRect(),
                    o = n.offsetWidth,
                    a = e.clientX - o / 2 - r.left,
                    l = (0, s.clamp)(a / (r.width - o), 0, 1)
                  this.setState({
                    inputOpacity: Math.round(100 * l).toString(),
                  }),
                    this.props.onChange(l),
                    (this._raf = null)
                }))
            }),
            (this._onSliderClick = (e) => {
              this._handlePosition(e.nativeEvent), this._dragSubscribe()
            }),
            (this._mouseUp = (e) => {
              this.setState({ isPointerDragged: !1 }),
                this._dragUnsubscribe(),
                this._handlePosition(e)
            }),
            (this._mouseMove = (e) => {
              this.setState({ isPointerDragged: !0 }), this._handlePosition(e)
            }),
            (this._onTouchStart = (e) => {
              this._handlePosition(e.nativeEvent.touches[0])
            }),
            (this._handleTouch = (e) => {
              this.setState({ isPointerDragged: !0 }),
                this._handlePosition(e.nativeEvent.touches[0])
            }),
            (this._handleTouchEnd = () => {
              this.setState({ isPointerDragged: !1 })
            }),
            (this._handleInput = (e) => {
              const t = e.currentTarget.value,
                n = Number(t) / 100
              this.setState({ inputOpacity: t }),
                Number.isNaN(n) || n > 1 || this.props.onChange(n)
            }),
            (this._handleKeyDown = (e) => {
              const t = (0, a.hashFromEvent)(e)
              if (37 !== t && 39 !== t) return
              e.preventDefault()
              const n = Number(this.state.inputOpacity)
              37 === t && 0 !== n && this._changeOpacity(n - 1),
                39 === t && 100 !== n && this._changeOpacity(n + 1)
            }),
            (this.state = {
              inputOpacity: Math.round(100 * e.opacity).toString(),
              isPointerDragged: !1,
            })
        }
        componentWillUnmount() {
          null !== this._raf &&
            (cancelAnimationFrame(this._raf), (this._raf = null)),
            this._dragUnsubscribe()
        }
        render() {
          const {
              color: e,
              opacity: t,
              hideInput: n,
              disabled: i,
            } = this.props,
            { inputOpacity: s, isPointerDragged: a } = this.state,
            c = { color: e || void 0 }
          return r.createElement(
            'div',
            { className: l.opacity },
            r.createElement(
              'div',
              {
                className: o(l.opacitySlider, l.accessible),
                style: c,
                tabIndex: i ? -1 : 0,
                ref: this._refContainer,
                onMouseDown: this._onSliderClick,
                onTouchStart: this._onTouchStart,
                onTouchMove: this._handleTouch,
                onTouchEnd: this._handleTouchEnd,
                onKeyDown: this._handleKeyDown,
                'aria-disabled': i,
              },
              r.createElement('div', {
                className: l.opacitySliderGradient,
                style: {
                  backgroundImage: `linear-gradient(90deg, transparent, ${e})`,
                },
              }),
              r.createElement(
                'div',
                { className: l.opacityPointerWrap },
                r.createElement('div', {
                  className: o(l.pointer, a && l.dragged),
                  style: { left: 100 * t + '%' },
                  ref: this._refPointer,
                }),
              ),
            ),
            !n &&
              r.createElement(
                'div',
                { className: l.opacityInputWrap },
                r.createElement('input', {
                  type: 'text',
                  className: l.opacityInput,
                  value: s,
                  onChange: this._handleInput,
                }),
                r.createElement(
                  'span',
                  { className: l.opacityInputPercent },
                  '%',
                ),
              ),
          )
        }
        _dragSubscribe() {
          const e = (0, i.ensureNotNull)(this._container).ownerDocument
          e &&
            (e.addEventListener('mouseup', this._mouseUp),
            e.addEventListener('mousemove', this._mouseMove))
        }
        _dragUnsubscribe() {
          const e = (0, i.ensureNotNull)(this._container).ownerDocument
          e &&
            (e.removeEventListener('mousemove', this._mouseMove),
            e.removeEventListener('mouseup', this._mouseUp))
        }
        _changeOpacity(e) {
          this.setState({ inputOpacity: e.toString() }),
            this.props.onChange(e / 100)
        }
      }
    },
    90692: (e, t, n) => {
      n.d(t, { MatchMedia: () => o })
      var r = n(50959)
      class o extends r.PureComponent {
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
          e.addEventListener('change', this._handleChange)
        }
        _unsubscribe(e) {
          e.removeEventListener('change', this._handleChange)
        }
      }
    },
    42842: (e, t, n) => {
      n.d(t, { Portal: () => c, PortalContext: () => u })
      var r = n(50959),
        o = n(32227),
        i = n(55698),
        s = n(67961),
        a = n(34811),
        l = n(99663)
      class c extends r.PureComponent {
        constructor() {
          super(...arguments), (this._uuid = (0, i.nanoid)())
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
              r.createElement(u.Provider, { value: this }, this.props.children),
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
      c.contextType = l.SlotContext
      const u = r.createContext(null)
    },
    63932: (e, t, n) => {
      n.d(t, { Spinner: () => l })
      var r = n(50959),
        o = n(97754),
        i = n(58096),
        s = (n(15216), n(85862)),
        a = n.n(s)
      function l(e) {
        const {
          ariaLabel: t,
          ariaLabelledby: n,
          className: s,
          style: l,
          size: c,
          id: u,
          disableSelfPositioning: d,
        } = e
        return r.createElement('div', {
          className: o(
            s,
            'tv-spinner',
            'tv-spinner--shown',
            `tv-spinner--size_${i.spinnerSizeMap[c || i.DEFAULT_SIZE]}`,
            d && a().disableSelfPositioning,
          ),
          style: l,
          role: 'progressbar',
          id: u,
          'aria-label': t,
          'aria-labelledby': n,
        })
      }
    },
    53385: (e) => {
      e.exports = {
        dialog: 'dialog-Rg1Vw_8R',
        transparencyTitle: 'transparencyTitle-Rg1Vw_8R',
        transparencyControl: 'transparencyControl-Rg1Vw_8R',
        transparencyWrap: 'transparencyWrap-Rg1Vw_8R',
        column: 'column-Rg1Vw_8R',
        dropzone: 'dropzone-Rg1Vw_8R',
        content: 'content-Rg1Vw_8R',
      }
    },
    14653: (e, t, n) => {
      n.r(t), n.d(t, { renderImageDialog: () => w })
      var r = n(50959),
        o = n(97754),
        i = n.n(o),
        s = n(11542),
        a = n(88601),
        l = n(3503),
        c = n(50182),
        u = n(9745),
        d = n(63932),
        p = n(33849),
        m = n.n(p)
      const h = s.t(null, void 0, n(64789))
      function g(e, t = null, o, i, a, l) {
        const [c, u] = (0, r.useState)({
          imgUrl: t,
          error: null,
          isLoading: !1,
          isDragging: !1,
        })
        return (
          (0, r.useEffect)(() => {
            null === t &&
              null !== c.imgUrl &&
              u((e) => ({ ...e, imgUrl: null })),
              null !== t && null === c.imgUrl && u((e) => ({ ...e, imgUrl: t }))
          }, [t]),
          (0, r.useEffect)(() => {
            const t = ((e, t, r) => {
              let o
              const {
                  type: i,
                  autoProcessQueue: a = !0,
                  withCredentials: l = !1,
                  maxFileSize: c = 0.1,
                  maxSizeLabel: u = '100KB',
                  ...d
                } = r,
                p = new (m())(e, {
                  url: '/upload-image/',
                  maxFiles: 1,
                  maxFilesize: c,
                  paramName: 'file',
                  uploadMultiple: !1,
                  acceptedFiles:
                    'image/jpg,image/jpeg,image/png,image/webp,image',
                  dictDefaultMessage: s.t(null, void 0, n(32910)),
                  previewTemplate: '<div>',
                  dictFileTooBig: s.t(
                    null,
                    { replace: { value: u } },
                    n(93738),
                  ),
                  dictResponseError: h,
                  dictInvalidFileType: s.t(null, void 0, n(16992)),
                  params: i ? { type: i, meta: '{}' } : void 0,
                  autoProcessQueue: a,
                  withCredentials: l,
                  ...d,
                })
              return (
                p.on('addedfile', (e) => {
                  o && p.removeFile(o), (o = e), t.onAddedFile()
                }),
                p.on('thumbnail', () => {
                  t.onQueuedFile && t.onQueuedFile(o, p)
                }),
                p.on('success', (e, n) => {
                  t.onSuccess(e, n)
                }),
                p.on('error', (e, n) => {
                  t.onError(n)
                }),
                p.on('sending', (e, n, r) => {
                  t.onSending && t.onSending(e, n, r)
                }),
                p.on('canceled', (e) => {
                  t.onError(h)
                }),
                p
              )
            })(
              e.current,
              {
                onAddedFile: () =>
                  u({
                    error: null,
                    imgUrl: null,
                    isLoading: !0,
                    isDragging: !1,
                  }),
                onSuccess: (e, t) => {
                  i && i(t)
                  const n = t ? t.url : URL.createObjectURL(e)
                  u({ error: null, imgUrl: n, isLoading: !1, isDragging: !1 })
                },
                onError: (e) =>
                  u({ error: e, imgUrl: null, isLoading: !1, isDragging: !1 }),
                onQueuedFile: a,
                onSending: l,
              },
              o,
            )
            return (
              t.on('dragenter', () => {
                c.isDragging || u((e) => ({ ...e, isDragging: !0 }))
              }),
              t.on('drop', () => {
                u((e) => ({ ...e, isDragging: !1 }))
              }),
              t.on('dragleave', () => {
                u((e) => ({ ...e, isDragging: !1 }))
              }),
              () => t.destroy()
            )
          }, []),
          [c.imgUrl, c.error, c.isLoading, c.isDragging]
        )
      }
      var f = n(93544),
        y = n(58189)
      function v(e) {
        const {
            onFileUpload: t,
            onRemove: i,
            maxSizeLabel: a = '100KB',
            className: l,
            imgUrl: c,
            onQueuedFile: p,
            onSending: m,
            customErrorMessage: h,
            ...v
          } = e,
          b = (0, r.useRef)(null),
          C = { ...v, maxSizeLabel: a },
          [E, _, x, S] = g(b, c, C, t, p, m)
        return r.createElement(
          'div',
          { className: o(y.container, l) },
          x
            ? r.createElement(d.Spinner, null)
            : r.createElement(
                r.Fragment,
                null,
                !E || h
                  ? r.createElement(
                      'span',
                      { className: y.textBlock },
                      ((e) =>
                        Boolean(e)
                          ? r.createElement(
                              'span',
                              {
                                className: o(
                                  y.textBlockHeadline,
                                  y.textBlockError,
                                ),
                              },
                              e,
                            )
                          : r.createElement(
                              'span',
                              { className: y.textBlockHeadline },
                              s.t(null, void 0, n(32910)),
                            ))(h ?? _),
                      r.createElement(
                        'span',
                        null,
                        s.t(null, void 0, n(41667)),
                      ),
                      r.createElement(
                        'span',
                        null,
                        s.t(null, { replace: { value: a } }, n(7654)),
                      ),
                    )
                  : r.createElement('img', { className: y.img, src: E }),
              ),
          S &&
            r.createElement(
              'div',
              { className: y.backdrop },
              r.createElement(
                'p',
                { className: y.mainText },
                s.t(null, void 0, n(98918)),
              ),
            ),
          r.createElement('div', { ref: b, className: y.dropzone }),
          E &&
            i &&
            r.createElement(u.Icon, {
              className: y.remove,
              icon: f,
              onClick: i,
            }),
        )
      }
      var b = n(87896),
        C = n(53385)
      const E = s.t(null, void 0, n(68065)),
        _ = s.t(null, void 0, n(19788))
      let x = null,
        S = null
      function w(e) {
        x || (x = document.createElement('div'))
        const t = () => {
            null !== x && (S?.unmount(), (S = null), (x = null))
          },
          n = {
            onConfirm: (t) => {
              e.onConfirm(t), e.onClose()
            },
            onClose: e.onClose,
          },
          o = r.createElement(R, { ...n })
        return S ? (S.render(o), t) : ((S = (0, b.createReactRoot)(o, x)), t)
      }
      const P = { 'Cache-Control': void 0, 'X-Requested-With': void 0 }
      function R(e) {
        const { onConfirm: t, onClose: o } = e,
          [u, d] = (0, r.useState)(0),
          [p, m] = (0, r.useState)(void 0),
          [h, g] = (0, r.useState)(),
          f = (0, r.useRef)(null),
          y = (0, r.useRef)(null),
          b = (0, r.useRef)(null)
        return r.createElement(c.AdaptiveConfirmDialog, {
          dataName: 'create-image-drawing-dialog',
          title: E,
          isOpened: !0,
          onSubmit: R,
          onCancel: o,
          onClickOutside: () => {
            R(), o()
          },
          onClose: o,
          render: () =>
            r.createElement(
              'div',
              { className: C.content },
              r.createElement(v, {
                className: C.dropzone,
                imgUrl: p,
                onSending: w,
                onQueuedFile: x,
                onFileUpload: S,
                thumbnailWidth: 800,
                thumbnailHeight: 600,
                autoProcessQueue: !1,
                headers: P,
                customErrorMessage: h,
                maxSizeLabel: (0, l.getMaxImageSizeLabel)(),
                maxFileSize: (0, l.getMaxImageSizeInBytes)() / 1e3,
                trackProgress: !1,
              }),
              r.createElement(
                'div',
                { className: C.transparencyWrap },
                r.createElement(
                  'span',
                  { className: i()(C.transparencyTitle, C.column) },
                  _,
                ),
                r.createElement(a.Transparency, {
                  className: i()(C.transparencyControl, C.column),
                  value: u,
                  onChange: d,
                  disabled: !1,
                }),
              ),
            ),
          submitOnEnterKey: !1,
          wrapperClassName: C.dialog,
        })
        async function x(e, t) {
          if (!e) return
          if ((g(void 0), !(await (0, l.checkImageSize)(e))))
            return (
              g(s.t(null, void 0, n(73007))), t.cancelUpload(e), void m(void 0)
            )
          const r = URL.createObjectURL(e)
          ;(b.current = r),
            (0, l.generateLink)(e)
              .catch(() => (t.cancelUpload(e), m(void 0), null))
              .then((e) => {
                if (!e || b.current !== r) return
                const { data: n, filepath: o } = e,
                  { url: i } = n
                ;(t.options.url = i),
                  (f.current = e.data.fields),
                  (y.current = i + o),
                  t.processQueue()
              })
        }
        function S() {
          y.current && b.current && m(y.current)
        }
        function w(e, t, n) {
          if (!f.current) return
          const r = f.current
          for (const e of Object.keys(r)) n.append(e, r[e])
          f.current = null
        }
        function R() {
          p && b.current
            ? (h && g(void 0),
              t({
                blobUrl: b.current,
                url: Promise.resolve(p),
                transparency: u,
              }))
            : g(s.t(null, void 0, n(49580)))
        }
      }
    },
  },
])
