;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8890],
  {
    21019: (e) => {
      e.exports = {
        'nav-button': 'nav-button-znwuaSC1',
        link: 'link-znwuaSC1',
        background: 'background-znwuaSC1',
        icon: 'icon-znwuaSC1',
        'flip-icon': 'flip-icon-znwuaSC1',
        'size-large': 'size-large-znwuaSC1',
        'preserve-paddings': 'preserve-paddings-znwuaSC1',
        'size-medium': 'size-medium-znwuaSC1',
        'size-small': 'size-small-znwuaSC1',
        'size-xsmall': 'size-xsmall-znwuaSC1',
        'size-xxsmall': 'size-xxsmall-znwuaSC1',
        'visually-hidden': 'visually-hidden-znwuaSC1',
      }
    },
    84928: (e) => {
      e.exports = {
        dialog: 'dialog-aRAWUDhF',
        rounded: 'rounded-aRAWUDhF',
        shadowed: 'shadowed-aRAWUDhF',
        fullscreen: 'fullscreen-aRAWUDhF',
        darker: 'darker-aRAWUDhF',
        backdrop: 'backdrop-aRAWUDhF',
      }
    },
    33233: (e) => {
      e.exports = {
        actionButton: 'actionButton-k53vexPa',
        small: 'small-k53vexPa',
        hiddenTitle: 'hiddenTitle-k53vexPa',
      }
    },
    4291: (e) => {
      e.exports = { label: 'label-nb7ji1l2' }
    },
    31336: (e) => {
      e.exports = {
        popupDialog: 'popupDialog-B02UUUN3',
        wrap: 'wrap-B02UUUN3',
        main: 'main-B02UUUN3',
        small: 'small-B02UUUN3',
        title: 'title-B02UUUN3',
        content: 'content-B02UUUN3',
        html: 'html-B02UUUN3',
        footer: 'footer-B02UUUN3',
        close: 'close-B02UUUN3',
        marginWithoutCloseButton: 'marginWithoutCloseButton-B02UUUN3',
      }
    },
    13100: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': '(max-width: 768px)',
        'tooltip-offset': '20px',
        dialog: 'dialog-qyCw0PaN',
        dragging: 'dragging-qyCw0PaN',
        mobile: 'mobile-qyCw0PaN',
        fullscreen: 'fullscreen-qyCw0PaN',
        dialogAnimatedAppearance: 'dialogAnimatedAppearance-qyCw0PaN',
        dialogAnimation: 'dialogAnimation-qyCw0PaN',
        dialogTooltip: 'dialogTooltip-qyCw0PaN',
      }
    },
    64388: (e, t, n) => {
      n.d(t, { NavButton: () => c })
      var i = n(50959),
        o = n(97754),
        s = n(9745),
        a = (n(49406), n(21019))
      function l(e) {
        const {
          size: t = 'large',
          preservePaddings: n,
          isLink: i,
          flipIconOnRtl: s,
          className: l,
        } = e
        return o(
          a['nav-button'],
          a[`size-${t}`],
          n && a['preserve-paddings'],
          s && a['flip-icon'],
          i && a.link,
          l,
        )
      }
      function r(e) {
        const { children: t, icon: n } = e
        return i.createElement(
          i.Fragment,
          null,
          i.createElement('span', { className: a.background }),
          i.createElement(s.Icon, {
            icon: n,
            className: a.icon,
            'aria-hidden': !0,
          }),
          t && i.createElement('span', { className: a['visually-hidden'] }, t),
        )
      }
      const c = (0, i.forwardRef)((e, t) => {
        const {
          icon: n,
          type: o = 'button',
          preservePaddings: s,
          flipIconOnRtl: a,
          size: c,
          'aria-label': u,
          ...d
        } = e
        return i.createElement(
          'button',
          { ...d, className: l({ ...e, children: u }), ref: t, type: o },
          i.createElement(r, { icon: n }, u),
        )
      })
      c.displayName = 'NavButton'
      var u = n(21593),
        d = n(53017)
      ;(0, i.forwardRef)((e, t) => {
        const { icon: n, renderComponent: o, 'aria-label': s, ...a } = e,
          c = o ?? u.CustomComponentDefaultLink
        return i.createElement(
          c,
          {
            ...a,
            className: l({ ...e, children: s, isLink: !0 }),
            reference: (0, d.isomorphicRef)(t),
          },
          i.createElement(r, { icon: n }, s),
        )
      }).displayName = 'NavAnchorButton'
    },
    49406: (e, t, n) => {
      var i, o, s, a
      !((e) => {
        ;(e.Primary = 'primary'),
          (e.QuietPrimary = 'quiet-primary'),
          (e.Secondary = 'secondary'),
          (e.Ghost = 'ghost')
      })(i || (i = {})),
        ((e) => {
          ;(e.XXSmall = 'xxsmall'),
            (e.XSmall = 'xsmall'),
            (e.Small = 'small'),
            (e.Medium = 'medium'),
            (e.Large = 'large'),
            (e.XLarge = 'xlarge'),
            (e.XXLarge = 'xxlarge')
        })(o || (o = {})),
        ((e) => {
          ;(e.Brand = 'brand'),
            (e.Blue = 'blue'),
            (e.Gray = 'gray'),
            (e.LightGray = 'light-gray'),
            (e.Green = 'green'),
            (e.Red = 'red'),
            (e.Black = 'black'),
            (e.Gradient = 'gradient'),
            (e.BlackFriday = 'black-friday'),
            (e.CyberMonday = 'cyber-monday')
        })(s || (s = {})),
        ((e) => {
          ;(e.Semibold18px = 'semibold18px'),
            (e.Semibold16px = 'semibold16px'),
            (e.Semibold14px = 'semibold14px'),
            (e.Medium16px = 'medium16px'),
            (e.Regular16px = 'regular16px'),
            (e.Regular14px = 'regular14px')
        })(a || (a = {}))
    },
    38952: (e, t, n) => {
      function i(e) {
        const { reference: t, ...n } = e
        return { ...n, ref: t }
      }
      n.d(t, { renameRef: () => i })
    },
    21593: (e, t, n) => {
      n.d(t, { CustomComponentDefaultLink: () => s })
      var i = n(50959),
        o = n(38952)
      function s(e) {
        return i.createElement('a', { ...(0, o.renameRef)(e) })
      }
      i.PureComponent
    },
    76974: (e, t, n) => {
      n.d(t, { useIsMounted: () => o })
      var i = n(50959)
      const o = () => {
        const e = (0, i.useRef)(!1)
        return (
          (0, i.useEffect)(
            () => (
              (e.current = !0),
              () => {
                e.current = !1
              }
            ),
            [],
          ),
          e
        )
      }
    },
    53017: (e, t, n) => {
      function i(e) {
        return (t) => {
          e.forEach((e) => {
            'function' == typeof e ? e(t) : null != e && (e.current = t)
          })
        }
      }
      function o(e) {
        return i([e])
      }
      n.d(t, { isomorphicRef: () => o, mergeRefs: () => i })
    },
    52778: (e, t, n) => {
      n.d(t, { OutsideEvent: () => o })
      var i = n(36383)
      function o(e) {
        const { children: t, ...n } = e
        return t((0, i.useOutsideEvent)(n))
      }
    },
    70493: (e, t, n) => {
      n.r(t),
        n.d(t, {
          confirmModule: () => z,
          renameModule: () => O,
          showSimpleDialog: () => U,
          warningModule: () => L,
        })
      var i = n(50959),
        o = n(11542),
        s = n(97754),
        a = n(64388),
        l = n(76422),
        r = n(82206),
        c = n(68335),
        u = n(90692),
        d = n(52092),
        h = n(24437),
        p = n(86656),
        m = n(67248),
        g = n(26996),
        f = n(50151),
        _ = n(76974),
        v = n(50655)
      const y = i.createContext({
        isSmallTablet: !1,
        dialogCloseHandler: () => {},
      })
      var E = n(33233)
      function x(e) {
        const {
            disabled: t,
            name: n,
            title: o,
            appearance: a,
            intent: l,
            handler: r,
            reference: c,
            type: u,
            className: d,
          } = e,
          { isSmallTablet: h, dialogCloseHandler: p } = (0, i.useContext)(y),
          x = (0, f.ensureNotNull)((0, i.useContext)(v.SlotContext)),
          C = (0, _.useIsMounted)(),
          [D, S] = (0, i.useState)(!1)
        return i.createElement(
          m.Button,
          {
            type: u,
            disabled: t,
            reference: c,
            className: s(E.actionButton, d, h && E.small),
            name: n,
            size: h ? 'l' : void 0,
            appearance: a,
            intent: l,
            onClick: () => {
              if (D) return
              const e = r({ dialogClose: p, innerManager: x })
              e &&
                (S(!0),
                e.then(() => {
                  C.current && S(!1)
                }))
            },
          },
          i.createElement('span', { className: s(D && E.hiddenTitle) }, o),
          D && i.createElement(g.Loader, { color: 'white' }),
        )
      }
      var C = n(7720),
        D = n(31336)
      function S(e) {
        const {
          title: t,
          onClose: n,
          actions: o,
          dataName: m,
          popupDialogClassName: g,
          contentClassName: f,
          wrapperClassName: _,
          backdrop: v,
          closeOnOutsideClick: E = !0,
          showCloseButton: S = !0,
          closeOnEscapePress: b = !0,
          events: w = !0,
          centeredOnResize: M,
        } = e
        ;(0, i.useEffect)(
          () => (
            l.subscribe(d.CLOSE_POPUPS_AND_DIALOGS_COMMAND, n, null),
            () => {
              l.unsubscribe(d.CLOSE_POPUPS_AND_DIALOGS_COMMAND, n, null)
            }
          ),
          [n],
        )
        const [T, k] = (0, i.useState)(!0),
          N = (0, i.useRef)(null),
          B = (0, i.useRef)(null)
        return (
          (0, i.useEffect)(
            () => (
              window.addEventListener('resize', A),
              () => {
                window.removeEventListener('resize', A)
              }
            ),
            [B, M],
          ),
          i.createElement(
            u.MatchMedia,
            { rule: h.DialogBreakpoints.TabletSmall },
            (l) =>
              i.createElement(
                y.Provider,
                { value: { isSmallTablet: l, dialogCloseHandler: n } },
                i.createElement(
                  r.PopupDialog,
                  {
                    className: s(D.popupDialog, g),
                    componentRef: B,
                    isOpened: T,
                    backdrop: v,
                    onClickBackdrop: w ? P : void 0,
                    onClickOutside: E ? P : void 0,
                    onKeyDown: F,
                    autofocus: !0,
                    fixedBody: !0,
                  },
                  i.createElement(
                    'div',
                    { className: s(D.wrap, _), 'data-name': m },
                    i.createElement(
                      'div',
                      {
                        className: s(
                          D.main,
                          !S && D.marginWithoutCloseButton,
                          l && D.small,
                        ),
                      },
                      t &&
                        i.createElement(
                          'div',
                          { className: s(D.title, l && D.small) },
                          t,
                        ),
                      ((t) => {
                        if ('html' in e)
                          return i.createElement(p.TouchScrollContainer, {
                            className: s(D.content, t && D.small, D.html, f),
                            dangerouslySetInnerHTML: { __html: e.html },
                          })
                        if ('content' in e)
                          return i.createElement(
                            p.TouchScrollContainer,
                            { className: s(D.content, t && D.small, f) },
                            e.content,
                          )
                        return null
                      })(l),
                      o &&
                        o.length > 0 &&
                        i.createElement(
                          'div',
                          { className: s(D.footer, l && D.small) },
                          o.map((e, t) =>
                            i.createElement(x, {
                              ...e,
                              key: e.name,
                              reference: 0 === t ? N : void 0,
                            }),
                          ),
                        ),
                    ),
                    S &&
                      i.createElement(a.NavButton, {
                        'aria-label': 'close',
                        size: 'medium',
                        preservePaddings: !0,
                        className: s(D.close, l && D.small),
                        icon: C,
                        onClick: P,
                        'data-name': 'close',
                        'data-role': 'button',
                      }),
                  ),
                ),
              ),
          )
        )
        function F(e) {
          switch ((0, c.hashFromEvent)(e)) {
            case 27:
              T && b && (e.preventDefault(), n())
              break
            case 13:
              const t = document.activeElement
              if (
                e.defaultPrevented ||
                (t instanceof HTMLButtonElement && 'submit' !== t.type)
              )
                return
              if (T && o && o.length) {
                e.preventDefault()
                const t = N.current
                t && t.click()
              }
          }
        }
        function P() {
          k(!1), n()
        }
        function A() {
          M && B.current?.centerAndFit?.()
        }
      }
      function b(e) {
        return 'html' in e
          ? { html: e.html }
          : 'text' in e
            ? { content: e.text }
            : { content: e.content }
      }
      var w = n(53680),
        M = n(16684),
        T = n(4291)
      function k(e) {
        const {
            maxLength: t,
            value: n,
            placeholder: o,
            onValueChange: s,
            nameInputRef: a,
            source: l = [],
            autocompleteFilter: r,
            emojiPicker: c,
          } = e,
          { isSmallTablet: u } = (0, i.useContext)(y),
          d = (0, M.useAutoSelect)()
        return i.createElement(
          i.Fragment,
          null,
          (() => {
            if ('content' in e)
              return i.createElement('div', { className: T.label }, e.content)
            if ('html' in e)
              return i.createElement('div', {
                className: T.label,
                dangerouslySetInnerHTML: { __html: e.html },
              })
            return null
          })(),
          i.createElement(w.Autocomplete, {
            maxLength: t,
            value: n,
            onChange: (e) => {
              s(e)
            },
            allowUserDefinedValues: !0,
            preventOnFocusOpen: !0,
            noEmptyText: !0,
            source: l,
            preventSearchOnEmptyQuery: !0,
            filter: r,
            setupHTMLInput: (e) => {
              ;(d.current = e), a && (a.current = e)
            },
            size: u ? 'large' : void 0,
            placeholder: o,
            suggestionsInPortal: !0,
            emojiPicker: c,
          }),
        )
      }
      function N(e) {
        return Boolean(e.trim())
      }
      function B(e) {
        const { buttonText: t, intentButton: i, actions: s, onConfirm: a } = e,
          l = [
            {
              name: 'ok',
              title: t || o.t(null, void 0, n(19295)),
              intent: i,
              handler: ({ dialogClose: e }) => {
                a?.(), e()
              },
            },
          ]
        return s && s.forEach((e) => l.push(e)), l
      }
      var F = n(51826),
        P = n(87896)
      const A = new F.DialogsOpenerManager()
      const z = (e) => {
          const {
              title: t,
              onClose: s = () => {},
              mainButtonText: a,
              mainButtonIntent: l,
              cancelButtonText: r,
              closeOnOutsideClick: c,
              onConfirm: u,
              onCancel: d,
              backdrop: h,
            } = e,
            p = b(e)
          return i.createElement(S, {
            ...p,
            backdrop: h,
            title: t || o.t(null, void 0, n(64770)),
            onClose: s,
            actions: [
              {
                name: 'yes',
                title: a || o.t(null, void 0, n(55512)),
                intent: l || 'success',
                handler: u,
              },
              {
                name: 'no',
                type: 'button',
                title: r || o.t(null, void 0, n(38733)),
                appearance: 'stroke',
                intent: 'default',
                handler: (e) => {
                  d ? d(e) : e.dialogClose()
                },
              },
            ],
            dataName: 'confirm-dialog',
            closeOnOutsideClick: c,
          })
        },
        O = (e) => {
          const {
              title: t,
              maxLength: s,
              initValue: a,
              placeholder: l,
              onClose: r = () => {},
              mainButtonText: c,
              mainButtonIntent: u,
              cancelButtonText: d,
              validator: h = N,
              onRename: p,
              source: m,
              autocompleteFilter: g,
              onCancel: f,
              emojiPicker: _,
            } = e,
            v = (0, i.useRef)(null),
            [y, E] = (0, i.useState)(a || ''),
            [x, C] = (0, i.useState)(() => h(y)),
            D = b(e)
          return i.createElement(S, {
            title: t || o.t(null, void 0, n(6321)),
            content: i.createElement(k, {
              ...D,
              nameInputRef: v,
              maxLength: s,
              placeholder: l,
              value: y,
              onValueChange: (e) => {
                E(e), C(h(e))
              },
              source: m,
              autocompleteFilter: g,
              emojiPicker: _,
            }),
            onClose: r,
            actions: [
              {
                disabled: !x,
                name: 'save',
                title: c || o.t(null, void 0, n(64e3)),
                intent: u || 'primary',
                handler: ({ dialogClose: e, innerManager: t }) =>
                  p({
                    newValue: y,
                    focusInput: w,
                    dialogClose: e,
                    innerManager: t,
                  }),
              },
              {
                name: 'cancel',
                type: 'button',
                title: d || o.t(null, void 0, n(4543)),
                appearance: 'stroke',
                intent: 'default',
                handler: (e) => {
                  f ? f(e) : e.dialogClose()
                },
              },
            ],
            dataName: 'rename-dialog',
          })
          function w() {
            v.current && v.current.focus()
          }
        },
        L = (e) => {
          const {
              title: t,
              closeOnOutsideClick: s,
              onClose: a = () => {},
              backdrop: l,
            } = e,
            r = b(e)
          return i.createElement(S, {
            ...r,
            title: t || o.t(null, void 0, n(66719)),
            onClose: a,
            backdrop: l,
            actions: B(e),
            dataName: 'warning-dialog',
            closeOnOutsideClick: s,
          })
        },
        U = (e, t, n) => {
          const { title: o } = e
          let s = `${o}_`
          if (
            ((s += 'text' in e ? e.text : 'html' in e ? e.html : e.id),
            A.isOpened(s))
          )
            return (0, f.ensureDefined)(A.getDialogPayload(s)).closeHandler
          const a = document.createElement('div'),
            l = () => {
              e.onClose?.(), r.unmount(), A.setAsClosed(s)
            },
            r = (0, P.createReactRoot)(
              i.createElement(
                v.SlotContext.Provider,
                { value: n || null },
                i.createElement(t, { ...e, onClose: l }),
              ),
              a,
            )
          return A.setAsOpened(s, { closeHandler: l }), l
        }
    },
    51826: (e, t, n) => {
      n.d(t, { DialogsOpenerManager: () => i, dialogsOpenerManager: () => o })
      class i {
        constructor() {
          this._storage = new Map()
        }
        setAsOpened(e, t) {
          this._storage.set(e, t)
        }
        setAsClosed(e) {
          this._storage.delete(e)
        }
        isOpened(e) {
          return this._storage.has(e)
        }
        getDialogPayload(e) {
          return this._storage.get(e)
        }
      }
      const o = new i()
    },
    95711: (e, t, n) => {
      n.d(t, { PopupContext: () => i })
      const i = n(50959).createContext(null)
    },
    82206: (e, t, n) => {
      n.d(t, { PopupDialog: () => A })
      var i = n(50959),
        o = n(97754),
        s = n(50151),
        a = n(99663),
        l = n(67961),
        r = n(90186),
        c = n(84928)
      class u extends i.PureComponent {
        constructor() {
          super(...arguments),
            (this._manager = new l.OverlapManager()),
            (this._handleSlot = (e) => {
              this._manager.setContainer(e)
            })
        }
        render() {
          const {
              rounded: e = !0,
              shadowed: t = !0,
              fullscreen: n = !1,
              darker: s = !1,
              className: l,
              backdrop: u,
              containerTabIndex: d = -1,
            } = this.props,
            h = o(
              l,
              c.dialog,
              e && c.rounded,
              t && c.shadowed,
              n && c.fullscreen,
              s && c.darker,
            ),
            p = (0, r.filterDataProps)(this.props),
            m = this.props.style
              ? { ...this._createStyles(), ...this.props.style }
              : this._createStyles()
          return i.createElement(
            i.Fragment,
            null,
            i.createElement(
              a.SlotContext.Provider,
              { value: this._manager },
              u &&
                i.createElement('div', {
                  onClick: this.props.onClickBackdrop,
                  className: c.backdrop,
                }),
              i.createElement(
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
                  tabIndex: d,
                  'aria-label': this.props.containerAriaLabel,
                },
                this.props.children,
              ),
            ),
            i.createElement(a.Slot, { reference: this._handleSlot }),
          )
        }
        _createStyles() {
          const {
            bottom: e,
            left: t,
            width: n,
            right: i,
            top: o,
            zIndex: s,
            height: a,
          } = this.props
          return {
            bottom: e,
            left: t,
            right: i,
            top: o,
            zIndex: s,
            maxWidth: n,
            height: a,
          }
        }
      }
      var d,
        h = n(86431),
        p = n(52778),
        m = n(9859),
        g = n(15754)
      function f(e, t, n, i) {
        return e + t > i && (e = i - t), e < n && (e = n), e
      }
      function _(e) {
        return {
          x: (0, m.clamp)(e.x, 20, document.documentElement.clientWidth - 20),
          y: (0, m.clamp)(e.y, 20, window.innerHeight - 20),
        }
      }
      function v(e) {
        return { x: e.clientX, y: e.clientY }
      }
      function y(e) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
      !((e) => {
        e[(e.MouseGuardZone = 20)] = 'MouseGuardZone'
      })(d || (d = {}))
      class E {
        constructor(e, t, n = { boundByScreen: !0 }) {
          ;(this._drag = null),
            (this._canBeTouchClick = !1),
            (this._frame = null),
            (this._onMouseDragStart = (e) => {
              if (0 !== e.button || this._isTargetNoDraggable(e)) return
              e.preventDefault(),
                document.addEventListener('mousemove', this._onMouseDragMove),
                document.addEventListener('mouseup', this._onMouseDragEnd)
              const t = _(v(e))
              this._dragStart(t)
            }),
            (this._onTouchDragStart = (e) => {
              if (this._isTargetNoDraggable(e)) return
              ;(this._canBeTouchClick = !0),
                e.preventDefault(),
                this._header.addEventListener(
                  'touchmove',
                  this._onTouchDragMove,
                  { passive: !1 },
                )
              const t = _(y(e))
              this._dragStart(t)
            }),
            (this._onMouseDragEnd = (e) => {
              e.target instanceof Node &&
                this._header.contains(e.target) &&
                e.preventDefault(),
                document.removeEventListener(
                  'mousemove',
                  this._onMouseDragMove,
                ),
                document.removeEventListener('mouseup', this._onMouseDragEnd),
                this._onDragStop()
            }),
            (this._onTouchDragEnd = (e) => {
              this._header.removeEventListener(
                'touchmove',
                this._onTouchDragMove,
              ),
                this._onDragStop(),
                this._canBeTouchClick &&
                  ((this._canBeTouchClick = !1),
                  ((e) => {
                    if (e instanceof SVGElement) {
                      const t = document.createEvent('SVGEvents')
                      t.initEvent('click', !0, !0), e.dispatchEvent(t)
                    }
                    e instanceof HTMLElement && e.click()
                  })(e.target))
            }),
            (this._onMouseDragMove = (e) => {
              const t = _(v(e))
              this._dragMove(t)
            }),
            (this._onTouchDragMove = (e) => {
              ;(this._canBeTouchClick = !1), e.preventDefault()
              const t = _(y(e))
              this._dragMove(t)
            }),
            (this._onDragStop = () => {
              ;(this._drag = null),
                this._header.classList.remove('dragging'),
                this._options.onDragEnd && this._options.onDragEnd()
            }),
            (this._dialog = e),
            (this._header = t),
            (this._options = n),
            this._header.addEventListener('mousedown', this._onMouseDragStart),
            this._header.addEventListener('touchstart', this._onTouchDragStart),
            this._header.addEventListener('touchend', this._onTouchDragEnd)
        }
        destroy() {
          null !== this._frame && cancelAnimationFrame(this._frame),
            this._header.removeEventListener(
              'mousedown',
              this._onMouseDragStart,
            ),
            document.removeEventListener('mouseup', this._onMouseDragEnd),
            this._header.removeEventListener(
              'touchstart',
              this._onTouchDragStart,
            ),
            this._header.removeEventListener('touchend', this._onTouchDragEnd),
            document.removeEventListener('mouseleave', this._onMouseDragEnd)
        }
        updateOptions(e) {
          this._options = e
        }
        _dragStart(e) {
          const t = this._dialog.getBoundingClientRect()
          this._drag = {
            startX: e.x,
            startY: e.y,
            finishX: e.x,
            finishY: e.y,
            dialogX: t.left,
            dialogY: t.top,
          }
          const n = Math.round(t.left),
            i = Math.round(t.top)
          ;(this._dialog.style.transform = `translate(${n}px, ${i}px)`),
            this._header.classList.add('dragging'),
            this._options.onDragStart && this._options.onDragStart()
        }
        _dragMove(e) {
          if (this._drag) {
            if (
              ((this._drag.finishX = e.x),
              (this._drag.finishY = e.y),
              null !== this._frame)
            )
              return
            this._frame = requestAnimationFrame(() => {
              if (this._drag) {
                const t = e.x - this._drag.startX,
                  n = e.y - this._drag.startY
                this._moveDialog(this._drag.dialogX + t, this._drag.dialogY + n)
              }
              this._frame = null
            })
          }
        }
        _moveDialog(e, t) {
          const n = this._dialog.getBoundingClientRect(),
            { boundByScreen: i } = this._options,
            o = f(e, n.width, i ? 0 : -1 / 0, i ? window.innerWidth : 1 / 0),
            s = f(t, n.height, i ? 0 : -1 / 0, i ? window.innerHeight : 1 / 0)
          this._dialog.style.transform = `translate(${Math.round(o)}px, ${Math.round(s)}px)`
        }
        _isTargetNoDraggable(e) {
          return (
            e.target instanceof Element &&
            null !== e.target.closest('[data-disable-drag]')
          )
        }
      }
      const x = { vertical: 0 }
      var C,
        D = n(42842),
        S = n(95711),
        b = n(99054),
        w = n(9343),
        M = n(92184)
      !((e) => {
        ;(e.Open = 'dialog-open'),
          (e.Close = 'dialog-close'),
          (e.FullscreenOn = 'dialog-fullscreen-on'),
          (e.FullscreenOff = 'dialog-fullscreen-off')
      })(C || (C = {}))
      const T = (0, w.getLogger)('DialogEventDispatcher')
      class k {
        constructor() {
          this._openSessionId = null
        }
        dispatch(e) {
          if ('dialog-open' === e) {
            if (null !== this._openSessionId)
              return void T.logError('Multiple calls to open dialog')
            this._openSessionId = (0, M.randomHash)()
          }
          null !== this._openSessionId
            ? (window.dispatchEvent(
                new CustomEvent(e, {
                  bubbles: !0,
                  detail: { dialogSessionId: this._openSessionId },
                }),
              ),
              'dialog-close' === e && (this._openSessionId = null))
            : T.logError('Empty open dialog session id')
        }
      }
      var N = n(84015),
        B = (n(56570), n(13100))
      B['tooltip-offset']
      const F = class {
        constructor(e, t) {
          ;(this._frame = null),
            (this._isFullscreen = !1),
            (this._handleResize = () => {
              null === this._frame &&
                (this._frame = requestAnimationFrame(() => {
                  this.recalculateBounds(), (this._frame = null)
                }))
            }),
            (this._dialog = e),
            (this._guard = t.guard || x),
            (this._calculateDialogPosition = t.calculateDialogPosition),
            (this._initialHeight = e.style.height),
            window.addEventListener('resize', this._handleResize)
        }
        updateOptions(e) {
          ;(this._guard = e.guard || x),
            (this._calculateDialogPosition = e.calculateDialogPosition)
        }
        setFullscreen(e) {
          this._isFullscreen !== e &&
            ((this._isFullscreen = e), this.recalculateBounds())
        }
        centerAndFit() {
          const { x: e, y: t } = this.getDialogsTopLeftCoordinates(),
            n = this._calcAvailableHeight(),
            i = this._calcDialogHeight()
          if (n === i)
            if (this._calculateDialogPosition) {
              const { left: e, top: t } = this._calculateDialogPosition(
                this._dialog,
                document.documentElement,
                this._guard,
              )
              this._dialog.style.transform = `translate(${Math.round(e)}px, ${Math.round(t)}px)`
            } else this._dialog.style.height = i + 'px'
          ;(this._dialog.style.top = '0px'),
            (this._dialog.style.left = '0px'),
            (this._dialog.style.transform = `translate(${e}px, ${t}px)`)
        }
        getDialogsTopLeftCoordinates() {
          const { clientWidth: e, clientHeight: t } =
              this._getClientDimensions(),
            n = this._calcDialogHeight(),
            i = e / 2 - this._dialog.clientWidth / 2,
            o = t / 2 - n / 2 + this._getTopOffset()
          return { x: Math.round(i), y: Math.round(o) }
        }
        recalculateBounds() {
          const { clientWidth: e, clientHeight: t } =
              this._getClientDimensions(),
            { vertical: n } = this._guard,
            i = this._calculateDialogPosition?.(
              this._dialog,
              { clientWidth: e, clientHeight: t },
              {
                vertical: n,
              },
            )
          if (this._isFullscreen) {
            if (
              ((this._dialog.style.top = '0px'),
              (this._dialog.style.left = '0px'),
              (this._dialog.style.width = '100%'),
              (this._dialog.style.height = '100%'),
              (this._dialog.style.transform = 'none'),
              i)
            ) {
              const { left: e, top: t, width: n, height: o } = i
              ;(this._dialog.style.transform = `translate(${Math.round(e)}px, ${Math.round(t)}px)`),
                n &&
                  ((this._dialog.style.width = `${n}px`),
                  (this._dialog.style.minWidth = 'unset')),
                o &&
                  ((this._dialog.style.height = `${o}px`),
                  (this._dialog.style.minHeight = 'unset'))
            }
          } else if (i) {
            const { left: e, top: t } = i
            this._dialog.style.transform = `translate(${Math.round(e)}px, ${Math.round(t)}px)`
          } else {
            ;(this._dialog.style.width = ''), (this._dialog.style.height = '')
            const i = this._dialog.getBoundingClientRect(),
              o = t - 2 * n,
              s = f(i.left, i.width, 0, e),
              a = f(i.top, i.height, n, t)
            ;(this._dialog.style.top = '0px'),
              (this._dialog.style.left = '0px'),
              (this._dialog.style.transform = `translate(${Math.round(s)}px, ${Math.round(a)}px)`),
              (this._dialog.style.height =
                o < i.height ? o + 'px' : this._initialHeight)
          }
        }
        destroy() {
          window.removeEventListener('resize', this._handleResize),
            null !== this._frame &&
              (cancelAnimationFrame(this._frame), (this._frame = null))
        }
        _getClientDimensions() {
          return {
            clientHeight: document.documentElement.clientHeight,
            clientWidth: document.documentElement.clientWidth,
          }
        }
        _getTopOffset() {
          return 0
        }
        _calcDialogHeight() {
          const e = this._calcAvailableHeight()
          return e < this._dialog.clientHeight ? e : this._dialog.clientHeight
        }
        _calcAvailableHeight() {
          return (
            this._getClientDimensions().clientHeight - 2 * this._guard.vertical
          )
        }
      }
      class P extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._dialog = null),
            (this._cleanUpFunctions = []),
            (this._prevActiveElement = null),
            (this._eventDispatcher = new k()),
            (this._handleDialogRef = (e) => {
              const { reference: t } = this.props
              ;(this._dialog = e), 'function' == typeof t && t(e)
            }),
            (this._handleFocus = () => {
              this._moveToTop()
            }),
            (this._handleMouseDown = (e) => {
              this._moveToTop()
            }),
            (this._handleTouchStart = (e) => {
              this._moveToTop()
            }),
            (this.state = { canFitTooltip: !1 }),
            (this._prevActiveElement = document.activeElement)
        }
        render() {
          return i.createElement(
            S.PopupContext.Provider,
            { value: this },
            i.createElement(
              p.OutsideEvent,
              {
                mouseDown: !0,
                touchStart: !0,
                handler: this.props.onClickOutside,
              },
              (e) =>
                i.createElement(
                  'div',
                  {
                    ref: e,
                    'data-outside-boundary-for': this.props.name,
                    onFocus: this._handleFocus,
                    onMouseDown: this._handleMouseDown,
                    onTouchStart: this._handleTouchStart,
                    'data-dialog-name': this.props['data-dialog-name'],
                    'data-tooltip-show-on-focus': 'true',
                  },
                  i.createElement(
                    u,
                    {
                      style: this._applyAnimationCSSVariables(),
                      ...this.props,
                      reference: this._handleDialogRef,
                      className: o(
                        B.dialog,
                        (0, N.isOnMobileAppPage)('any') &&
                          !this.props.noMobileAppShadows &&
                          B.mobile,
                        this.props.fullscreen && B.fullscreen,
                        this.props.className,
                      ),
                    },
                    !1,
                    this.props.children,
                  ),
                ),
            ),
          )
        }
        componentDidMount() {
          const { draggable: e, boundByScreen: t, onDragStart: n } = this.props,
            i = (0, s.ensureNotNull)(this._dialog)
          if ((this._eventDispatcher.dispatch('dialog-open'), e)) {
            const e = i.querySelector('[data-dragg-area]')
            if (e && e instanceof HTMLElement) {
              const o = new E(i, e, {
                boundByScreen: Boolean(t),
                onDragStart: n,
              })
              this._cleanUpFunctions.push(() => o.destroy()), (this._drag = o)
            }
          }
          this.props.autofocus &&
            !i.contains(document.activeElement) &&
            i.focus(),
            (this._isFullScreen() || this.props.fixedBody) &&
              (0, b.setFixedBodyState)(!0)
          const { guard: o, calculateDialogPosition: a } = this.props
          if (this.props.resizeHandler) this._resize = this.props.resizeHandler
          else {
            const e = new F(i, { guard: o, calculateDialogPosition: a })
            this._cleanUpFunctions.push(() => e.destroy()), (this._resize = e)
          }
          if (
            (this._isFullScreen() &&
              this._eventDispatcher.dispatch('dialog-fullscreen-on'),
            this.props.isAnimationEnabled &&
              this.props.growPoint &&
              this._applyAppearanceAnimation(this.props.growPoint),
            this.props.centeredOnMount && this._resize.centerAndFit(),
            this._resize.setFullscreen(this._isFullScreen()),
            this.props.shouldForceFocus)
          ) {
            if (this.props.onForceFocus) return void this.props.onForceFocus(i)
            i.focus()
          }
          if (!i.contains(document.activeElement)) {
            const e = ((e) => {
              const t = e.querySelector('[autofocus]:not([disabled])')
              if (t) return t
              if (e.tabIndex >= 0) return e
              const n = (0, g.getActiveElementSelectors)(),
                i = Array.from(e.querySelectorAll(n)).filter(
                  (0, g.createScopedVisibleElementFilter)(e),
                )
              let o = Number.NEGATIVE_INFINITY,
                s = null
              for (let e = 0; e < i.length; e++) {
                const t = i[e],
                  n = t.getAttribute('tabindex')
                if (null !== n) {
                  const e = Number.parseInt(n, 10)
                  !isNaN(e) && e > o && ((o = e), (s = t))
                }
              }
              return s
            })(i)
            e instanceof HTMLElement && e.focus()
          }
        }
        componentDidUpdate(e) {
          const t = e.fullscreen
          if (this._resize) {
            const { guard: e, calculateDialogPosition: t } = this.props
            this._resize.updateOptions({
              guard: e,
              calculateDialogPosition: t,
            }),
              this._resize.setFullscreen(this._isFullScreen())
          }
          if (
            (this._drag &&
              this._drag.updateOptions({
                boundByScreen: Boolean(this.props.boundByScreen),
                onDragStart: this.props.onDragStart,
              }),
            e.fullscreen !== this.props.fullscreen)
          ) {
            const e = this.props.fullscreen
            e && !t
              ? this._eventDispatcher.dispatch('dialog-fullscreen-on')
              : !e &&
                t &&
                this._eventDispatcher.dispatch('dialog-fullscreen-off')
          }
        }
        componentWillUnmount() {
          if (
            this.props.shouldReturnFocus &&
            this._prevActiveElement &&
            document.body.contains(this._prevActiveElement) &&
            (null === document.activeElement ||
              document.activeElement === document.body ||
              this._dialog?.contains(document.activeElement))
          )
            try {
              setTimeout(() => {
                this._prevActiveElement.focus({ preventScroll: !0 })
              })
            } catch {}
          for (const e of this._cleanUpFunctions) e()
          ;(this._isFullScreen() || this.props.fixedBody) &&
            (0, b.setFixedBodyState)(!1),
            this._isFullScreen() &&
              this._eventDispatcher.dispatch('dialog-fullscreen-off'),
            this._eventDispatcher.dispatch('dialog-close')
        }
        focus() {
          this._dialog && this._dialog.focus()
        }
        centerAndFit() {
          this._resize && this._resize.centerAndFit()
        }
        recalculateBounds() {
          this._resize && this._resize.recalculateBounds()
        }
        _moveToTop() {
          this.props.isZIndexFixed ||
            (null !== this.context && this.context.moveToTop())
        }
        _applyAnimationCSSVariables() {
          return {
            '--animationTranslateStartX': null,
            '--animationTranslateStartY': null,
            '--animationTranslateEndX': null,
            '--animationTranslateEndY': null,
          }
        }
        _applyAppearanceAnimation(e) {
          if (this._resize && this._dialog) {
            const { x: t, y: n } = e,
              { x: i, y: o } = this._resize.getDialogsTopLeftCoordinates()
            this._dialog.style.setProperty(
              '--animationTranslateStartX',
              `${t}px`,
            ),
              this._dialog.style.setProperty(
                '--animationTranslateStartY',
                `${n}px`,
              ),
              this._dialog.style.setProperty(
                '--animationTranslateEndX',
                `${i}px`,
              ),
              this._dialog.style.setProperty(
                '--animationTranslateEndY',
                `${o}px`,
              ),
              this._dialog.classList.add(B.dialogAnimatedAppearance)
          }
        }
        _handleTooltipFit() {
          0
        }
        _isFullScreen() {
          return Boolean(this.props.fullscreen)
        }
      }
      ;(P.contextType = D.PortalContext),
        (P.defaultProps = {
          boundByScreen: !0,
          draggable: !0,
          centeredOnMount: !0,
          shouldReturnFocus: !0,
        })
      const A = (0, h.makeOverlapable)(P, !0)
    },
    86431: (e, t, n) => {
      n.d(t, { makeOverlapable: () => s })
      var i = n(50959),
        o = n(42842)
      function s(e, t) {
        return class extends i.PureComponent {
          render() {
            const { isOpened: n, root: s } = this.props
            if (!n) return null
            const a = i.createElement(e, {
              ...this.props,
              ref: this.props.componentRef,
              zIndex: 150,
            })
            return 'parent' === s
              ? a
              : i.createElement(o.Portal, { shouldTrapFocus: t }, a)
          }
        }
      }
    },
    7720: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17" fill="currentColor"><path d="m.58 1.42.82-.82 15 15-.82.82z"/><path d="m.58 15.58 15-15 .82.82-15 15z"/></svg>'
    },
  },
])
