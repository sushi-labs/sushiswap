;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5057],
  {
    45350: (e) => {
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
    55596: (e) => {
      e.exports = {
        dialog: 'dialog-b8SxMnzX',
        wrapper: 'wrapper-b8SxMnzX',
        separator: 'separator-b8SxMnzX',
        bounded: 'bounded-b8SxMnzX',
      }
    },
    69827: (e) => {
      e.exports = {
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        container: 'container-BZKENkhT',
        unsetAlign: 'unsetAlign-BZKENkhT',
        title: 'title-BZKENkhT',
        subtitle: 'subtitle-BZKENkhT',
        textWrap: 'textWrap-BZKENkhT',
        ellipsis: 'ellipsis-BZKENkhT',
        close: 'close-BZKENkhT',
        icon: 'icon-BZKENkhT',
      }
    },
    45719: (e) => {
      e.exports = { separator: 'separator-Pf4rIzEt' }
    },
    57340: (e, t, n) => {
      n.d(t, { CloseButton: () => u })
      var s = n(50959),
        r = n(64388),
        o = n(17105),
        i = n(15130),
        a = n(38822),
        l = n(63346),
        c = n(34983)
      function d(e = 'large') {
        switch (e) {
          case 'large':
            return o
          case 'medium':
          default:
            return i
          case 'small':
            return a
          case 'xsmall':
            return l
          case 'xxsmall':
            return c
        }
      }
      const u = s.forwardRef((e, t) =>
        s.createElement(r.NavButton, { ...e, ref: t, icon: d(e.size) }),
      )
    },
    64388: (e, t, n) => {
      n.d(t, { NavButton: () => c })
      var s = n(50959),
        r = n(97754),
        o = n(9745),
        i = n(45350)
      function a(e) {
        const {
          size: t = 'large',
          preservePaddings: n,
          isLink: s,
          flipIconOnRtl: o,
          className: a,
        } = e
        return r(
          i['nav-button'],
          i[`size-${t}`],
          n && i['preserve-paddings'],
          o && i['flip-icon'],
          s && i.link,
          a,
        )
      }
      function l(e) {
        const { children: t, icon: n } = e
        return s.createElement(
          s.Fragment,
          null,
          s.createElement('span', { className: i.background }),
          s.createElement(o.Icon, {
            icon: n,
            className: i.icon,
            'aria-hidden': !0,
          }),
          t && s.createElement('span', { className: i['visually-hidden'] }, t),
        )
      }
      const c = (0, s.forwardRef)((e, t) => {
        const {
          icon: n,
          type: r = 'button',
          preservePaddings: o,
          flipIconOnRtl: i,
          size: c,
          'aria-label': d,
          ...u
        } = e
        return s.createElement(
          'button',
          { ...u, className: a({ ...e, children: d }), ref: t, type: r },
          s.createElement(l, { icon: n }, d),
        )
      })
      c.displayName = 'NavButton'
      var d = n(21593),
        u = n(53017)
      ;(0, s.forwardRef)((e, t) => {
        const { icon: n, renderComponent: r, 'aria-label': o, ...i } = e,
          c = null != r ? r : d.CustomComponentDefaultLink
        return s.createElement(
          c,
          {
            ...i,
            className: a({ ...e, children: o, isLink: !0 }),
            reference: (0, u.isomorphicRef)(t),
          },
          s.createElement(l, { icon: n }, o),
        )
      }).displayName = 'NavAnchorButton'
    },
    38952: (e, t, n) => {
      function s(e) {
        const { reference: t, ...n } = e
        return { ...n, ref: t }
      }
      n.d(t, { renameRef: () => s })
    },
    21593: (e, t, n) => {
      n.d(t, { CustomComponentDefaultLink: () => o })
      var s = n(50959),
        r = n(38952)
      function o(e) {
        return s.createElement('a', { ...(0, r.renameRef)(e) })
      }
      s.PureComponent
    },
    35057: (e, t, n) => {
      n.d(t, { AdaptivePopupDialog: () => B })
      var s = n(50959),
        r = n(50151)
      var o = n(97754),
        i = n.n(o),
        a = n(68335),
        l = n(38223),
        c = n(35749),
        d = n(16181),
        u = n(1109),
        h = n(24437),
        p = n(90692),
        m = n(95711)
      var f = n(52092),
        g = n(76422),
        v = n(11542),
        w = n(57340)
      const C = s.createContext({ setHideClose: () => {} })
      var b = n(69827)
      function _(e) {
        const {
            title: t,
            titleTextWrap: r = !1,
            subtitle: o,
            showCloseIcon: a = !0,
            onClose: l,
            onCloseButtonKeyDown: c,
            renderBefore: d,
            renderAfter: u,
            draggable: h,
            className: p,
            unsetAlign: m,
            closeAriaLabel: f = v.t(null, void 0, n(80395)),
            closeButtonReference: g,
          } = e,
          [_, E] = (0, s.useState)(!1)
        return s.createElement(
          C.Provider,
          { value: { setHideClose: E } },
          s.createElement(
            'div',
            { className: i()(b.container, p, (o || m) && b.unsetAlign) },
            d,
            s.createElement(
              'div',
              { 'data-dragg-area': h, className: b.title },
              s.createElement(
                'div',
                { className: i()(r ? b.textWrap : b.ellipsis) },
                t,
              ),
              o &&
                s.createElement(
                  'div',
                  { className: i()(b.ellipsis, b.subtitle) },
                  o,
                ),
            ),
            u,
            a &&
              !_ &&
              s.createElement(w.CloseButton, {
                className: b.close,
                'data-name': 'close',
                'aria-label': f,
                onClick: l,
                onKeyDown: c,
                ref: g,
                size: 'medium',
                preservePaddings: !0,
              }),
          ),
        )
      }
      var E = n(53017),
        x = n(90186),
        N = n(55596)
      const k = { vertical: 20 },
        S = { vertical: 0 }
      class B extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._controller = null),
            (this._reference = null),
            (this._orientationMediaQuery = null),
            (this._renderChildren = (e, t) => (
              (this._controller = e),
              this.props.render({
                requestResize: this._requestResize,
                centerAndFit: this._centerAndFit,
                isSmallWidth: t,
              })
            )),
            (this._handleReference = (e) => (this._reference = e)),
            (this._handleCloseBtnClick = () => {
              this.props.onKeyboardClose && this.props.onKeyboardClose(),
                this._handleClose()
            }),
            (this._handleClose = () => {
              this.props.onClose()
            }),
            (this._handleOpen = () => {
              void 0 !== this.props.onOpen &&
                this.props.isOpened &&
                this.props.onOpen(
                  this.props.fullScreen ||
                    window.matchMedia(h.DialogBreakpoints.TabletSmall).matches,
                )
            }),
            (this._handleKeyDown = (e) => {
              if (!e.defaultPrevented) {
                if (
                  (this.props.onKeyDown && this.props.onKeyDown(e),
                  27 === (0, a.hashFromEvent)(e))
                ) {
                  if (e.defaultPrevented) return
                  if (
                    this.props.forceCloseOnEsc &&
                    this.props.forceCloseOnEsc()
                  )
                    return (
                      this.props.onKeyboardClose &&
                        this.props.onKeyboardClose(),
                      void this._handleClose()
                    )
                  const { activeElement: n } = document,
                    s = (0, r.ensureNotNull)(this._reference)
                  if (null !== n) {
                    if (
                      (e.preventDefault(),
                      'true' === (t = n).getAttribute('data-haspopup') &&
                        'true' !== t.getAttribute('data-expanded'))
                    )
                      return void this._handleClose()
                    if ((0, c.isTextEditingField)(n)) return void s.focus()
                    if (s.contains(n))
                      return (
                        this.props.onKeyboardClose &&
                          this.props.onKeyboardClose(),
                        void this._handleClose()
                      )
                  }
                }
                var t, n
                ;((e) => {
                  if ('function' == typeof e) return e()
                  return Boolean(e)
                })(this.props.disableTabNavigationContainment) ||
                  ((n = e),
                  [9, a.Modifiers.Shift + 9].includes(
                    (0, a.hashFromEvent)(n),
                  ) && n.stopPropagation())
              }
            }),
            (this._requestResize = () => {
              null !== this._controller && this._controller.recalculateBounds()
            }),
            (this._centerAndFit = () => {
              null !== this._controller && this._controller.centerAndFit()
            }),
            (this._calculatePositionWithOffsets = (e, t) => {
              const n = (0, r.ensureDefined)(
                this.props.fullScreenViewOffsets,
              ).value()
              return {
                top: n.top,
                left: (0, l.isRtl)() ? -n.right : n.left,
                width: t.clientWidth - n.left - n.right,
                height: t.clientHeight - n.top - n.bottom,
              }
            })
        }
        componentDidMount() {
          var e, t
          this.props.ignoreClosePopupsAndDialog ||
            g.subscribe(
              f.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
              this._handleClose,
              null,
            ),
            this._handleOpen(),
            void 0 !== this.props.onOpen &&
              ((this._orientationMediaQuery = window.matchMedia(
                '(orientation: portrait)',
              )),
              (e = this._orientationMediaQuery),
              (t = this._handleOpen),
              (null == e ? void 0 : e.addEventListener)
                ? e.addEventListener('change', t)
                : e.addListener(t)),
            this.props.fullScreenViewOffsets &&
              this.props.fullScreen &&
              this.props.fullScreenViewOffsets.subscribe(this._requestResize)
        }
        componentWillUnmount() {
          var e, t
          this.props.ignoreClosePopupsAndDialog ||
            g.unsubscribe(
              f.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
              this._handleClose,
              null,
            ),
            null !== this._orientationMediaQuery &&
              ((e = this._orientationMediaQuery),
              (t = this._handleOpen),
              (null == e ? void 0 : e.removeEventListener)
                ? e.removeEventListener('change', t)
                : e.removeListener(t)),
            this.props.fullScreenViewOffsets &&
              this.props.fullScreen &&
              this.props.fullScreenViewOffsets.unsubscribe(this._requestResize)
        }
        focus() {
          ;(0, r.ensureNotNull)(this._reference).focus()
        }
        getElement() {
          return this._reference
        }
        contains(e) {
          var t, n
          return (
            null !==
              (n =
                null === (t = this._reference) || void 0 === t
                  ? void 0
                  : t.contains(e)) &&
            void 0 !== n &&
            n
          )
        }
        render() {
          const {
              className: e,
              wrapperClassName: t,
              headerClassName: n,
              isOpened: r,
              title: o,
              titleTextWrap: a,
              dataName: l,
              onClickOutside: c,
              additionalElementPos: f,
              additionalHeaderElement: g,
              backdrop: v,
              shouldForceFocus: w = !0,
              shouldReturnFocus: C,
              onForceFocus: b,
              showSeparator: B,
              subtitle: z,
              draggable: y = !0,
              fullScreen: D = !1,
              showCloseIcon: O = !0,
              rounded: A = !0,
              isAnimationEnabled: P,
              growPoint: K,
              dialogTooltip: R,
              unsetHeaderAlign: M,
              onDragStart: L,
              dataDialogName: T,
              closeAriaLabel: F,
              containerAriaLabel: I,
              reference: W,
              containerTabIndex: Z,
              closeButtonReference: H,
              onCloseButtonKeyDown: V,
              shadowed: q,
              fullScreenViewOffsets: Q,
              fixedBody: X,
            } = this.props,
            U = 'after' !== f ? g : void 0,
            G = 'after' === f ? g : void 0,
            $ = 'string' == typeof o ? o : T || '',
            j = (0, x.filterDataProps)(this.props),
            J = (0, E.mergeRefs)([this._handleReference, W])
          return s.createElement(
            p.MatchMedia,
            { rule: h.DialogBreakpoints.SmallHeight },
            (f) =>
              s.createElement(
                p.MatchMedia,
                { rule: h.DialogBreakpoints.TabletSmall },
                (h) =>
                  s.createElement(
                    d.PopupDialog,
                    {
                      rounded: !(h || D) && A,
                      className: i()(N.dialog, D && Q && N.bounded, e),
                      isOpened: r,
                      reference: J,
                      onKeyDown: this._handleKeyDown,
                      onClickOutside: c,
                      onClickBackdrop: c,
                      fullscreen: h || D,
                      guard: f ? S : k,
                      boundByScreen: h || D,
                      shouldForceFocus: w,
                      onForceFocus: b,
                      shouldReturnFocus: C,
                      backdrop: v,
                      draggable: y,
                      isAnimationEnabled: P,
                      growPoint: K,
                      name: this.props.dataName,
                      dialogTooltip: R,
                      onDragStart: L,
                      containerAriaLabel: I,
                      containerTabIndex: Z,
                      calculateDialogPosition:
                        D && Q ? this._calculatePositionWithOffsets : void 0,
                      shadowed: q,
                      fixedBody: X,
                      ...j,
                    },
                    s.createElement(
                      'div',
                      {
                        className: i()(N.wrapper, t),
                        'data-name': l,
                        'data-dialog-name': $,
                      },
                      void 0 !== o &&
                        s.createElement(_, {
                          draggable: y && !(h || D),
                          onClose: this._handleCloseBtnClick,
                          renderAfter: G,
                          renderBefore: U,
                          subtitle: z,
                          title: o,
                          titleTextWrap: a,
                          showCloseIcon: O,
                          className: n,
                          unsetAlign: M,
                          closeAriaLabel: F,
                          closeButtonReference: H,
                          onCloseButtonKeyDown: V,
                        }),
                      B &&
                        s.createElement(u.Separator, {
                          className: N.separator,
                        }),
                      s.createElement(m.PopupContext.Consumer, null, (e) =>
                        this._renderChildren(e, h || D),
                      ),
                    ),
                  ),
              ),
          )
        }
      }
    },
    1109: (e, t, n) => {
      n.d(t, { Separator: () => i })
      var s = n(50959),
        r = n(97754),
        o = n(45719)
      function i(e) {
        return s.createElement('div', {
          className: r(o.separator, e.className),
        })
      }
    },
    17105: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 21 21m0-21-21 21"/></svg>'
    },
    15130: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 15 15m0-15-15 15"/></svg>'
    },
    38822: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 11 11m0-11-11 11"/></svg>'
    },
    63346: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 9 9m0-9-9 9"/></svg>'
    },
    34983: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="10" height="10"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 7 7m0-7-7 7"/></svg>'
    },
  },
])
