;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2704],
  {
    345350: (e) => {
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
    488803: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
      }
    },
    755596: (e) => {
      e.exports = {
        dialog: 'dialog-b8SxMnzX',
        wrapper: 'wrapper-b8SxMnzX',
        separator: 'separator-b8SxMnzX',
        bounded: 'bounded-b8SxMnzX',
      }
    },
    869827: (e) => {
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
    140281: (e) => {
      e.exports = {
        container: 'container-qm7Rg5MB',
        inputContainer: 'inputContainer-qm7Rg5MB',
        withCancel: 'withCancel-qm7Rg5MB',
        input: 'input-qm7Rg5MB',
        icon: 'icon-qm7Rg5MB',
        cancel: 'cancel-qm7Rg5MB',
      }
    },
    316734: (e) => {
      e.exports = { scrollWrap: 'scrollWrap-a62DpCum' }
    },
    440211: (e) => {
      e.exports = {
        container: 'container-c8Hkfy8e',
        separator: 'separator-c8Hkfy8e',
        section: 'section-c8Hkfy8e',
      }
    },
    155002: (e) => {
      e.exports = {
        action: 'action-peI7w0K1',
        hovered: 'hovered-peI7w0K1',
        active: 'active-peI7w0K1',
        label: 'label-peI7w0K1',
        description: 'description-peI7w0K1',
        selected: 'selected-peI7w0K1',
        small: 'small-peI7w0K1',
        withDescription: 'withDescription-peI7w0K1',
        action__favoriteIcon: 'action__favoriteIcon-peI7w0K1',
        action__favoriteIcon_active: 'action__favoriteIcon_active-peI7w0K1',
        labelAndDescription: 'labelAndDescription-peI7w0K1',
        icon: 'icon-peI7w0K1',
        fakeIcon: 'fakeIcon-peI7w0K1',
        highlighted: 'highlighted-peI7w0K1',
      }
    },
    705826: (e) => {
      e.exports = {
        menu: 'menu-kJ5smAAE',
        withDescriptions: 'withDescriptions-kJ5smAAE',
        header: 'header-kJ5smAAE',
        title: 'title-kJ5smAAE',
        container: 'container-kJ5smAAE',
        icon: 'icon-kJ5smAAE',
        clear: 'clear-kJ5smAAE',
        input: 'input-kJ5smAAE',
        highlighted: 'highlighted-kJ5smAAE',
        active: 'active-kJ5smAAE',
        section: 'section-kJ5smAAE',
      }
    },
    645300: (e) => {
      e.exports = {}
    },
    214877: (e) => {
      e.exports = {
        favorite: 'favorite-_FRQhM5Y',
        hovered: 'hovered-_FRQhM5Y',
        disabled: 'disabled-_FRQhM5Y',
        active: 'active-_FRQhM5Y',
        checked: 'checked-_FRQhM5Y',
      }
    },
    275623: (e) => {
      e.exports = { highlighted: 'highlighted-cwp8YRo6' }
    },
    345719: (e) => {
      e.exports = { separator: 'separator-Pf4rIzEt' }
    },
    92910: (e) => {
      e.exports = {
        separator: 'separator-QjUlCDId',
        small: 'small-QjUlCDId',
        normal: 'normal-QjUlCDId',
        large: 'large-QjUlCDId',
      }
    },
    934587: (e) => {
      e.exports = { icon: 'icon-WB2y0EnP', dropped: 'dropped-WB2y0EnP' }
    },
    389986: (e, t, n) => {
      n.d(t, { CloseButton: () => d })
      var r = n(50959),
        o = n(270762),
        i = n(117105),
        s = n(315130),
        a = n(238822),
        l = n(663346),
        c = n(534983)
      function u(e = 'large') {
        switch (e) {
          case 'large':
            return i
          case 'medium':
          default:
            return s
          case 'small':
            return a
          case 'xsmall':
            return l
          case 'xxsmall':
            return c
        }
      }
      const d = r.forwardRef((e, t) =>
        r.createElement(o.NavButton, { ...e, ref: t, icon: u(e.size) }),
      )
    },
    270762: (e, t, n) => {
      n.d(t, { NavButton: () => c })
      var r = n(50959),
        o = n(497754),
        i = n(72571),
        s = n(345350)
      function a(e) {
        const {
          size: t = 'large',
          preservePaddings: n,
          isLink: r,
          flipIconOnRtl: i,
          className: a,
        } = e
        return o(
          s['nav-button'],
          s[`size-${t}`],
          n && s['preserve-paddings'],
          i && s['flip-icon'],
          r && s.link,
          a,
        )
      }
      function l(e) {
        const { children: t, icon: n } = e
        return r.createElement(
          r.Fragment,
          null,
          r.createElement('span', { className: s.background }),
          r.createElement(i.Icon, {
            icon: n,
            className: s.icon,
            'aria-hidden': !0,
          }),
          t && r.createElement('span', { className: s['visually-hidden'] }, t),
        )
      }
      const c = (0, r.forwardRef)((e, t) => {
        const {
          icon: n,
          type: o = 'button',
          preservePaddings: i,
          flipIconOnRtl: s,
          size: c,
          'aria-label': u,
          ...d
        } = e
        return r.createElement(
          'button',
          { ...d, className: a({ ...e, children: u }), ref: t, type: o },
          r.createElement(l, { icon: n }, u),
        )
      })
      c.displayName = 'NavButton'
      var u = n(591365),
        d = n(273388)
      ;(0, r.forwardRef)((e, t) => {
        const { icon: n, renderComponent: o, 'aria-label': i, ...s } = e,
          c = null != o ? o : u.CustomComponentDefaultLink
        return r.createElement(
          c,
          {
            ...s,
            className: a({ ...e, children: i, isLink: !0 }),
            reference: (0, d.isomorphicRef)(t),
          },
          r.createElement(l, { icon: n }, i),
        )
      }).displayName = 'NavAnchorButton'
    },
    409245: (e, t, n) => {
      function r(e) {
        const { reference: t, ...n } = e
        return { ...n, ref: t }
      }
      n.d(t, { renameRef: () => r })
    },
    591365: (e, t, n) => {
      n.d(t, { CustomComponentDefaultLink: () => i })
      var r = n(50959),
        o = n(409245)
      function i(e) {
        return r.createElement('a', { ...(0, o.renameRef)(e) })
      }
      r.PureComponent
    },
    778199: (e, t, n) => {
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
    72571: (e, t, n) => {
      n.d(t, { Icon: () => o })
      var r = n(50959)
      const o = r.forwardRef((e, t) => {
        const { icon: n = '', ...o } = e
        return r.createElement('span', {
          ...o,
          ref: t,
          dangerouslySetInnerHTML: { __html: n },
        })
      })
    },
    800417: (e, t, n) => {
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
    273388: (e, t, n) => {
      function r(e) {
        return (t) => {
          e.forEach((e) => {
            'function' == typeof e ? e(t) : null != e && (e.current = t)
          })
        }
      }
      function o(e) {
        return r([e])
      }
      n.d(t, { isomorphicRef: () => o, mergeRefs: () => r })
    },
    996038: (e, t, n) => {
      n.d(t, {
        DialogBreakpoints: () => o,
      })
      var r = n(488803)
      const o = {
        SmallHeight: r['small-height-breakpoint'],
        TabletSmall: r['tablet-small-breakpoint'],
        TabletNormal: r['tablet-normal-breakpoint'],
      }
    },
    533408: (e, t, n) => {
      n.d(t, { AdaptivePopupDialog: () => N })
      var r = n(50959),
        o = n(650151),
        i = n(660538),
        s = n(497754),
        a = n.n(s),
        l = n(180185),
        c = n(710263),
        u = n(698043),
        d = n(40766),
        h = n(494707),
        m = n(996038),
        p = n(930052),
        v = n(910549)
      var f = n(206594),
        g = n(559410),
        C = n(609838),
        E = n(389986),
        w = n(190410),
        x = n(869827)
      function b(e) {
        const {
            title: t,
            titleTextWrap: o = !1,
            subtitle: i,
            showCloseIcon: s = !0,
            onClose: l,
            onCloseButtonKeyDown: c,
            renderBefore: u,
            renderAfter: d,
            draggable: h,
            className: m,
            unsetAlign: p,
            closeAriaLabel: v = C.t(null, void 0, n(680395)),
            closeButtonReference: f,
          } = e,
          [g, b] = (0, r.useState)(!1)
        return r.createElement(
          w.DialogHeaderContext.Provider,
          { value: { setHideClose: b } },
          r.createElement(
            'div',
            { className: a()(x.container, m, (i || p) && x.unsetAlign) },
            u,
            r.createElement(
              'div',
              { 'data-dragg-area': h, className: x.title },
              r.createElement(
                'div',
                { className: a()(o ? x.textWrap : x.ellipsis) },
                t,
              ),
              i &&
                r.createElement(
                  'div',
                  { className: a()(x.ellipsis, x.subtitle) },
                  i,
                ),
            ),
            d,
            s &&
              !g &&
              r.createElement(E.CloseButton, {
                className: x.close,
                'data-name': 'close',
                'aria-label': v,
                onClick: l,
                onKeyDown: c,
                ref: f,
                size: 'medium',
                preservePaddings: !0,
              }),
          ),
        )
      }
      var y = n(273388),
        k = n(800417),
        _ = n(755596)
      const S = { vertical: 20 },
        A = { vertical: 0 }
      class N extends r.PureComponent {
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
                    window.matchMedia(m.DialogBreakpoints.TabletSmall).matches,
                )
            }),
            (this._handleKeyDown = (e) => {
              if (!e.defaultPrevented) {
                if (
                  (this.props.onKeyDown && this.props.onKeyDown(e),
                  27 === (0, l.hashFromEvent)(e))
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
                    r = (0, o.ensureNotNull)(this._reference)
                  if (null !== n) {
                    if (
                      (e.preventDefault(),
                      'true' === (t = n).getAttribute('data-haspopup') &&
                        'true' !== t.getAttribute('data-expanded'))
                    )
                      return void this._handleClose()
                    if ((0, u.isTextEditingField)(n)) return void r.focus()
                    if (r.contains(n))
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
                  [9, l.Modifiers.Shift + 9].includes(
                    (0, l.hashFromEvent)(n),
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
              const n = (0, o.ensureDefined)(
                this.props.fullScreenViewOffsets,
              ).value()
              return {
                top: n.top,
                left: (0, c.isRtl)() ? -n.right : n.left,
                width: t.clientWidth - n.left - n.right,
                height: t.clientHeight - n.top - n.bottom,
              }
            })
        }
        componentDidMount() {
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
              (0, i.mediaQueryAddEventListener)(
                this._orientationMediaQuery,
                this._handleOpen,
              )),
            this.props.fullScreenViewOffsets &&
              this.props.fullScreen &&
              this.props.fullScreenViewOffsets.subscribe(this._requestResize)
        }
        componentWillUnmount() {
          this.props.ignoreClosePopupsAndDialog ||
            g.unsubscribe(
              f.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
              this._handleClose,
              null,
            ),
            null !== this._orientationMediaQuery &&
              (0, i.mediaQueryRemoveEventListener)(
                this._orientationMediaQuery,
                this._handleOpen,
              ),
            this.props.fullScreenViewOffsets &&
              this.props.fullScreen &&
              this.props.fullScreenViewOffsets.unsubscribe(this._requestResize)
        }
        focus() {
          ;(0, o.ensureNotNull)(this._reference).focus()
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
              isOpened: o,
              title: i,
              titleTextWrap: s,
              dataName: l,
              onClickOutside: c,
              additionalElementPos: u,
              additionalHeaderElement: f,
              backdrop: g,
              shouldForceFocus: C = !0,
              shouldReturnFocus: E,
              onForceFocus: w,
              showSeparator: x,
              subtitle: N,
              draggable: D = !0,
              fullScreen: z = !1,
              showCloseIcon: I = !0,
              rounded: B = !0,
              isAnimationEnabled: R,
              growPoint: L,
              dialogTooltip: M,
              unsetHeaderAlign: T,
              onDragStart: F,
              dataDialogName: P,
              closeAriaLabel: O,
              containerAriaLabel: K,
              reference: U,
              containerTabIndex: H,
              closeButtonReference: W,
              onCloseButtonKeyDown: j,
              shadowed: Q,
              fullScreenViewOffsets: V,
              fixedBody: q,
            } = this.props,
            J = 'after' !== u ? f : void 0,
            Y = 'after' === u ? f : void 0,
            Z = 'string' == typeof i ? i : P || '',
            G = (0, k.filterDataProps)(this.props),
            $ = (0, y.mergeRefs)([this._handleReference, U])
          return r.createElement(
            p.MatchMedia,
            { rule: m.DialogBreakpoints.SmallHeight },
            (u) =>
              r.createElement(
                p.MatchMedia,
                { rule: m.DialogBreakpoints.TabletSmall },
                (m) =>
                  r.createElement(
                    d.PopupDialog,
                    {
                      rounded: !(m || z) && B,
                      className: a()(_.dialog, z && V && _.bounded, e),
                      isOpened: o,
                      reference: $,
                      onKeyDown: this._handleKeyDown,
                      onClickOutside: c,
                      onClickBackdrop: c,
                      fullscreen: m || z,
                      guard: u ? A : S,
                      boundByScreen: m || z,
                      shouldForceFocus: C,
                      onForceFocus: w,
                      shouldReturnFocus: E,
                      backdrop: g,
                      draggable: D,
                      isAnimationEnabled: R,
                      growPoint: L,
                      name: this.props.dataName,
                      dialogTooltip: M,
                      onDragStart: F,
                      containerAriaLabel: K,
                      containerTabIndex: H,
                      calculateDialogPosition:
                        z && V ? this._calculatePositionWithOffsets : void 0,
                      shadowed: Q,
                      fixedBody: q,
                      ...G,
                    },
                    r.createElement(
                      'div',
                      {
                        className: a()(_.wrapper, t),
                        'data-name': l,
                        'data-dialog-name': Z,
                      },
                      void 0 !== i &&
                        r.createElement(b, {
                          draggable: D && !(m || z),
                          onClose: this._handleCloseBtnClick,
                          renderAfter: Y,
                          renderBefore: J,
                          subtitle: N,
                          title: i,
                          titleTextWrap: s,
                          showCloseIcon: I,
                          className: n,
                          unsetAlign: T,
                          closeAriaLabel: O,
                          closeButtonReference: W,
                          onCloseButtonKeyDown: j,
                        }),
                      x &&
                        r.createElement(h.Separator, {
                          className: _.separator,
                        }),
                      r.createElement(v.PopupContext.Consumer, null, (e) =>
                        this._renderChildren(e, m || z),
                      ),
                    ),
                  ),
              ),
          )
        }
      }
    },
    190410: (e, t, n) => {
      n.d(t, { DialogHeaderContext: () => r })
      const r = n(50959).createContext({ setHideClose: () => {} })
    },
    231862: (e, t, n) => {
      n.d(t, { DialogSearch: () => u })
      var r = n(50959),
        o = n(497754),
        i = n.n(o),
        s = n(609838),
        a = n(72571),
        l = n(969859),
        c = n(140281)
      function u(e) {
        const {
          children: t,
          renderInput: o,
          onCancel: u,
          containerClassName: h,
          inputContainerClassName: m,
          iconClassName: p,
          ...v
        } = e
        return r.createElement(
          'div',
          { className: i()(c.container, h) },
          r.createElement(
            'div',
            { className: i()(c.inputContainer, m, u && c.withCancel) },
            o || r.createElement(d, { ...v }),
          ),
          t,
          r.createElement(a.Icon, { className: i()(c.icon, p), icon: l }),
          u &&
            r.createElement(
              'div',
              { className: c.cancel, onClick: u },
              s.t(null, void 0, n(620036)),
            ),
        )
      }
      function d(e) {
        const {
          className: t,
          reference: n,
          value: o,
          onChange: s,
          onFocus: a,
          onBlur: l,
          onKeyDown: u,
          onSelect: d,
          placeholder: h,
          ...m
        } = e
        return r.createElement('input', {
          ...m,
          ref: n,
          type: 'text',
          className: i()(t, c.input),
          autoComplete: 'off',
          'data-role': 'search',
          placeholder: h,
          value: o,
          onChange: s,
          onFocus: a,
          onBlur: l,
          onSelect: d,
          onKeyDown: u,
        })
      }
    },
    350930: (e, t, n) => {
      n.r(t), n.d(t, { UnitConversionRenderer: () => O })
      var r = n(50959),
        o = n(500962),
        i = n(410958),
        s = n(930052),
        a = n(512991),
        l = n(26845),
        c = n(855417),
        u = n(116491),
        d = n(996038),
        h = n(476853),
        m = n(497754),
        p = n.n(m),
        v = n(609838),
        f = n(72571),
        g = n(624216),
        C = n(510618),
        E = n(493173),
        w = n(917850),
        x = n(475747),
        b = n(577687),
        y = n(636080),
        k = n(260598),
        _ = n(155002)
      const S = r.memo(
        (e) => {
          const {
              label: t,
              icon: n,
              rules: o,
              search: i,
              description: s,
              onClick: a,
              onClose: l,
              isActive: c,
              isSmallSize: u,
              isSelected: d,
              selectedRef: h,
              hasDescriptions: m,
              hasIcons: v,
              isFavorite: f,
              onFavoriteClick: g,
            } = e,
            C = (0, r.useCallback)(() => {
              a(), l && l()
            }, [a, l]),
            E = u && _.small
          return r.createElement(
            'div',
            {
              className: p()(
                _.action,
                c && _.active,
                E,
                m && _.withDescription,
                d && _.selected,
              ),
              onClick: C,
              ref: h,
            },
            v &&
              (void 0 !== n
                ? r.createElement(y.CircleLogo, {
                    logoUrl: n,
                    size: m ? 'xsmall' : 'xxxsmall',
                    className: p()(_.icon, E),
                  })
                : r.createElement('span', { className: p()(_.fakeIcon, E) })),
            r.createElement(
              'div',
              { className: p()(_.labelAndDescription, E) },
              r.createElement('span', { className: p()(_.label, E) }, w(t)),
              m && r.createElement('br', null),
              m &&
                r.createElement(
                  'span',
                  { className: p()(_.description, E) },
                  s ? w(s) : '',
                ),
            ),
            void 0 !== f &&
              r.createElement(
                'div',
                {
                  className: p()(
                    _.action__favoriteIcon,
                    f && _.action__favoriteIcon_active,
                  ),
                },
                r.createElement(b.FavoriteButton, {
                  isActive: c,
                  isFilled: f,
                  onClick: (e) => {
                    e.stopPropagation(), null == g || g()
                  },
                }),
              ),
          )
          function w(e) {
            return r.createElement(k.HighlightedText, {
              text: e,
              rules: o,
              queryString: i,
              className: p()(c && _.highlighted, c && _.active),
            })
          }
        },
        (e, t) =>
          Object.keys(t)
            .filter(
              (e) => !['onClick', 'onClose', 'onFavoriteClick'].includes(e),
            )
            .every((n) => t[n] === e[n]),
      )
      var A = n(51417),
        N = n(69311),
        D = n(705826),
        z = n(316734)
      const I = (0, E.mergeThemes)(C.DEFAULT_MENU_THEME, z)
      function B(e) {
        const {
            title: t,
            sections: o,
            onClose: i,
            selectedId: s,
            selectedRef: a,
            search: l,
            setSearch: c,
            items: u,
            rules: d,
            searchRef: h,
            hasDescriptions: m,
            hasIcons: C,
            ...E
          } = e,
          [b, y] = (0, r.useState)(() =>
            o.reduce((e, t, n) => (t.name && (e[t.id] = !0), e), {}),
          )
        function k(e) {
          const { id: t, ...n } = e
          return r.createElement(S, {
            key: t,
            rules: d,
            search: l,
            onClose: i,
            isSmallSize: !0,
            isSelected: t === s,
            selectedRef: t === s ? a : void 0,
            hasDescriptions: m,
            hasIcons: C,
            ...n,
          })
        }
        return r.createElement(
          g.PopupMenu,
          {
            ...E,
            onClose: i,
            className: p()(D.menu, m && D.withDescriptions),
            theme: I,
            maxHeight: m ? 313 : 280,
            noMomentumBasedScroll: !0,
            isOpened: !0,
            onOpen: () => {
              var e
              null === (e = h.current) || void 0 === e || e.focus()
            },
          },
          r.createElement(
            'div',
            { className: D.header },
            r.createElement('div', { className: D.title }, t),
            r.createElement(
              'div',
              { className: D.container },
              r.createElement(f.Icon, { icon: A, className: D.icon }),
              r.createElement('input', {
                size: 1,
                type: 'text',
                className: D.input,
                placeholder: v.t(null, void 0, n(252298)),
                autoComplete: 'off',
                'data-role': 'search',
                onChange: (e) => {
                  c(e.target.value)
                },
                value: l,
                ref: h,
              }),
              Boolean(l) &&
                r.createElement(f.Icon, {
                  icon: N,
                  className: D.clear,
                  onClick: () => {
                    c('')
                  },
                }),
            ),
          ),
          l
            ? u.map(k)
            : o.map((e, t) =>
                r.createElement(
                  r.Fragment,
                  { key: e.id },
                  Boolean(t) && r.createElement(w.PopupMenuSeparator, null),
                  e.name
                    ? r.createElement(
                        x.CollapsibleSection,
                        {
                          summary: e.name,
                          className: D.section,
                          open: b[e.id],
                          onStateChange: (t) => y({ ...b, [e.id]: t }),
                        },
                        e.actions.map(k),
                      )
                    : e.actions.map(k),
                ),
              ),
        )
      }
      var R = n(533408),
        L = n(231862),
        M = n(440211)
      function T(e) {
        const {
          title: t,
          onClose: o,
          sections: i,
          selectedId: s,
          selectedRef: a,
          search: l,
          setSearch: c,
          items: u,
          rules: d,
          searchRef: h,
          hasIcons: m,
          hasDescriptions: p,
        } = e
        return r.createElement(R.AdaptivePopupDialog, {
          title: t,
          onClose: o,
          render: () =>
            r.createElement(
              r.Fragment,
              null,
              r.createElement(L.DialogSearch, {
                placeholder: v.t(null, void 0, n(252298)),
                onChange: f,
                reference: h,
              }),
              r.createElement(
                'div',
                { className: M.container },
                l
                  ? u.map((e) => {
                      const { id: t, isActive: n, ...i } = e
                      return r.createElement(S, {
                        key: t,
                        isActive: n,
                        onClose: o,
                        rules: d,
                        search: l,
                        isSelected: t === s,
                        selectedRef: t === s ? a : void 0,
                        hasIcons: m,
                        hasDescriptions: p,
                        ...i,
                      })
                    })
                  : i.map((e, t) =>
                      r.createElement(
                        r.Fragment,
                        { key: e.id },
                        e.name &&
                          r.createElement(
                            'div',
                            { className: M.section },
                            e.name,
                          ),
                        e.actions.map((n, c) => {
                          const { id: u, ...h } = n,
                            v = c === e.actions.length - 1,
                            f = t === i.length - 1
                          return r.createElement(
                            r.Fragment,
                            { key: u },
                            r.createElement(S, {
                              rules: d,
                              search: l,
                              onClose: o,
                              isSelected: u === s,
                              selectedRef: u === s ? a : void 0,
                              hasIcons: m,
                              hasDescriptions: p,
                              ...h,
                            }),
                            !f &&
                              v &&
                              r.createElement('div', {
                                className: M.separator,
                              }),
                          )
                        }),
                      ),
                    ),
              ),
            ),
          dataName: 'unit-conversion-dialog',
          draggable: !1,
          fullScreen: !0,
          isOpened: !0,
        })
        function f(e) {
          c(e.target.value)
        }
      }
      const F = {
        horizontalAttachEdge: h.HorizontalAttachEdge.Right,
        horizontalDropDirection: h.HorizontalDropDirection.FromRightToLeft,
      }
      function P(e) {
        const { element: t, ...n } = e,
          [o, i] = (0, r.useState)(x()),
          [m, p] = (0, r.useState)(''),
          v = (0, r.useRef)(null),
          f = (0, r.useRef)(null),
          g = (0, r.useMemo)(() => (0, a.createRegExpList)(m), [m]),
          { activeIdx: C, setActiveIdx: E } = (0, l.useKeyboardNavigation)(
            v.current,
            o,
            (e) => {
              e && (e.onClick(), n.onClose())
            },
          )
        ;(0, u.useResetActiveIdx)(E, [o]),
          (0, c.useScrollToRef)(f, C),
          (0, r.useEffect)(() => {
            i(
              m
                ? ((e, t, n) => {
                    const r = e.reduce((e, t) => [...e, ...t.actions], [])
                    return (0, a.rankedSearch)({
                      data: r,
                      rules: n,
                      queryString: t,
                      primaryKey: 'label',
                      secondaryKey: 'description',
                    })
                  })(n.sections, m, g)
                : x(),
            )
          }, [m, n.sections, g])
        const w = (0, r.useMemo)(
          () => ({
            selectedId: Boolean(C >= 0 && o[C]) ? o[C].id : '',
            selectedRef: f,
            search: m,
            setSearch: p,
            searchRef: v,
            items: o,
            rules: g,
            hasIcons: o.some((e) => void 0 !== e.icon),
            hasDescriptions: o.some((e) => void 0 !== e.description),
          }),
          [C, f, m, p, v, o, g],
        )
        return r.createElement(
          s.MatchMedia,
          { rule: d.DialogBreakpoints.TabletSmall },
          (e) =>
            e
              ? r.createElement(T, { ...n, ...w })
              : r.createElement(B, {
                  ...n,
                  ...w,
                  position: (0, h.getPopupPositioner)(t, F),
                  doNotCloseOn: t,
                }),
        )
        function x() {
          return n.sections.reduce((e, t) => (e.push(...t.actions), e), [])
        }
      }
      class O {
        constructor(e, t, n, r) {
          ;(this._rootElem = document.createElement('div')),
            (this.close = () => {
              null !== this._rootElem &&
                (o.unmountComponentAtNode(this._rootElem),
                i.favoriteCurrencyUnitConversionService
                  .getOnChange()
                  .unsubscribe(this, this._render),
                (this._rootElem = null),
                this._menuClosedCallback())
            }),
            (this.isOpened = () => null !== this._rootElem),
            (this._title = e),
            (this._element = t),
            (this._sectionsGetter = n),
            (this._menuClosedCallback = r),
            this._render(),
            i.favoriteCurrencyUnitConversionService
              .getOnChange()
              .subscribe(this, this._render)
        }
        _render() {
          const e = {
            title: this._title,
            sections: this._sectionsGetter(),
            element: this._element,
            onClose: this.close,
          }
          o.render(r.createElement(P, { ...e }), this._rootElem)
        }
      }
    },
    26845: (e, t, n) => {
      n.d(t, { useKeyboardNavigation: () => i })
      var r = n(50959),
        o = n(180185)
      function i(e, t, n, i = 'keydown') {
        const [s, a] = (0, r.useState)(-1)
        return (
          (0, r.useEffect)(() => {
            if (!e) return
            const n = (e) => {
              switch ((0, o.hashFromEvent)(e)) {
                case 40:
                  if (s === t.length - 1) break
                  e.preventDefault(), a(s + 1)
                  break
                case 38:
                  if (s <= 0) break
                  e.preventDefault(), a(s - 1)
                  break
              }
            }
            return (
              e.addEventListener('keydown', n),
              () => {
                e.removeEventListener('keydown', n)
              }
            )
          }, [e, s, t]),
          (0, r.useEffect)(() => {
            if (!e || !n) return
            const r = (e) => {
              var r
              e.repeat ||
                (13 === (0, o.hashFromEvent)(e) &&
                  n(null !== (r = t[s]) && void 0 !== r ? r : null, e))
            }
            return (
              e.addEventListener(i, r),
              () => {
                e.removeEventListener(i, r)
              }
            )
          }, [e, s, t, n, i]),
          { activeIdx: s, setActiveIdx: a }
        )
      }
    },
    116491: (e, t, n) => {
      n.d(t, { useResetActiveIdx: () => o })
      var r = n(50959)
      function o(e, t = []) {
        ;(0, r.useEffect)(() => {
          e(-1)
        }, [...t])
      }
    },
    855417: (e, t, n) => {
      n.d(t, { useScrollToRef: () => o })
      var r = n(50959)
      function o(e, t) {
        ;(0, r.useEffect)(() => {
          var n
          t >= 0 &&
            (null === (n = e.current) ||
              void 0 === n ||
              n.scrollIntoView({ block: 'nearest' }))
        }, [t])
      }
    },
    636080: (e, t, n) => {
      n.d(t, { CircleLogo: () => s, hiddenCircleLogoClass: () => i })
      var r = n(50959),
        o = n(439067)
      n(645300)
      const i = 'tv-circle-logo--visually-hidden'
      function s(e) {
        var t, n
        const i = (0, o.getStyleClasses)(e.size, e.className),
          s =
            null !== (n = null !== (t = e.alt) && void 0 !== t ? t : e.title) &&
            void 0 !== n
              ? n
              : ''
        return (0, o.isCircleLogoWithUrlProps)(e)
          ? r.createElement('img', {
              className: i,
              crossOrigin: '',
              src: e.logoUrl,
              alt: s,
              title: e.title,
              loading: e.loading,
              'aria-label': e['aria-label'],
              'aria-hidden': e['aria-hidden'],
            })
          : r.createElement(
              'span',
              {
                className: i,
                title: e.title,
                'aria-label': e['aria-label'],
                'aria-hidden': e['aria-hidden'],
              },
              e.placeholderLetter,
            )
      }
    },
    439067: (e, t, n) => {
      n.d(t, { getStyleClasses: () => o, isCircleLogoWithUrlProps: () => i })
      var r = n(497754)
      function o(e, t) {
        return r('tv-circle-logo', `tv-circle-logo--${e}`, t)
      }
      function i(e) {
        return 'logoUrl' in e && void 0 !== e.logoUrl && 0 !== e.logoUrl.length
      }
    },
    577687: (e, t, n) => {
      n.d(t, { FavoriteButton: () => d })
      var r = n(609838),
        o = n(50959),
        i = n(497754),
        s = n(72571),
        a = n(239146),
        l = n(648010),
        c = n(214877)
      const u = {
        add: r.t(null, void 0, n(44629)),
        remove: r.t(null, void 0, n(572482)),
      }
      function d(e) {
        const { className: t, isFilled: n, isActive: r, onClick: d, ...h } = e
        return o.createElement(s.Icon, {
          ...h,
          className: i(
            c.favorite,
            'apply-common-tooltip',
            n && c.checked,
            r && c.active,
            t,
          ),
          icon: n ? a : l,
          onClick: d,
          title: n ? u.remove : u.add,
        })
      }
    },
    512991: (e, t, n) => {
      n.d(t, {
        createRegExpList: () => i,
        getHighlightedChars: () => s,
        rankedSearch: () => o,
      })
      var r = n(372605)
      function o(e) {
        const {
          data: t,
          rules: n,
          queryString: o,
          isPreventedFromFiltering: i,
          primaryKey: s,
          secondaryKey: a = s,
          optionalPrimaryKey: l,
          tertiaryKey: c,
        } = e
        return t
          .map((e) => {
            const t = l && e[l] ? e[l] : e[s],
              i = e[a],
              u = c && e[c]
            let d,
              h = 0
            return (
              n.forEach((e) => {
                var n, s, a, l, c
                const { re: m, fullMatch: p } = e
                if (
                  ((m.lastIndex = 0),
                  (0, r.isString)(t) &&
                    t &&
                    t.toLowerCase() === o.toLowerCase())
                )
                  return (
                    (h = 4),
                    void (d =
                      null === (n = t.match(p)) || void 0 === n
                        ? void 0
                        : n.index)
                  )
                if ((0, r.isString)(t) && p.test(t))
                  return (
                    (h = 3),
                    void (d =
                      null === (s = t.match(p)) || void 0 === s
                        ? void 0
                        : s.index)
                  )
                if ((0, r.isString)(i) && p.test(i))
                  return (
                    (h = 2),
                    void (d =
                      null === (a = i.match(p)) || void 0 === a
                        ? void 0
                        : a.index)
                  )
                if ((0, r.isString)(i) && m.test(i))
                  return (
                    (h = 2),
                    void (d =
                      null === (l = i.match(m)) || void 0 === l
                        ? void 0
                        : l.index)
                  )
                if (Array.isArray(u))
                  for (const e of u)
                    if (p.test(e))
                      return (
                        (h = 1),
                        void (d =
                          null === (c = e.match(p)) || void 0 === c
                            ? void 0
                            : c.index)
                      )
              }),
              { matchPriority: h, matchIndex: d, item: e }
            )
          })
          .filter((e) => i || e.matchPriority)
          .sort((e, t) => {
            if (e.matchPriority < t.matchPriority) return 1
            if (e.matchPriority > t.matchPriority) return -1
            if (e.matchPriority === t.matchPriority) {
              if (void 0 === e.matchIndex || void 0 === t.matchIndex) return 0
              if (e.matchIndex > t.matchIndex) return 1
              if (e.matchIndex < t.matchIndex) return -1
            }
            return 0
          })
          .map(({ item: e }) => e)
      }
      function i(e, t) {
        const n = [],
          r = e.toLowerCase(),
          o =
            e
              .split('')
              .map((e, t) => `(${0 !== t ? `[/\\s-]${a(e)}` : a(e)})`)
              .join('(.*?)') + '(.*)'
        return (
          n.push({
            fullMatch: new RegExp(`(${a(e)})`, 'i'),
            re: new RegExp(`^${o}`, 'i'),
            reserveRe: new RegExp(o, 'i'),
            fuzzyHighlight: !0,
          }),
          t &&
            Object.hasOwn(t, r) &&
            n.push({ fullMatch: t[r], re: t[r], fuzzyHighlight: !1 }),
          n
        )
      }
      function s(e, t, n) {
        const r = []
        return e && n
          ? (n.forEach((e) => {
              const { fullMatch: n, re: o, reserveRe: i } = e
              ;(n.lastIndex = 0), (o.lastIndex = 0)
              const s = n.exec(t),
                a = s || o.exec(t) || (i && i.exec(t))
              if (((e.fuzzyHighlight = !s), a))
                if (e.fuzzyHighlight) {
                  let e = a.index
                  for (let t = 1; t < a.length; t++) {
                    const n = a[t],
                      o = a[t].length
                    if (t % 2) {
                      const t =
                        n.startsWith(' ') ||
                        n.startsWith('/') ||
                        n.startsWith('-')
                      r[t ? e + 1 : e] = !0
                    }
                    e += o
                  }
                } else for (let e = 0; e < a[0].length; e++) r[a.index + e] = !0
            }),
            r)
          : r
      }
      function a(e) {
        return e.replace(/[!-/[-^{-}?]/g, '\\$&')
      }
    },
    260598: (e, t, n) => {
      n.d(t, { HighlightedText: () => a })
      var r = n(50959),
        o = n(497754),
        i = n(512991),
        s = n(275623)
      function a(e) {
        const { queryString: t, rules: n, text: a, className: l } = e,
          c = (0, r.useMemo)(
            () => (0, i.getHighlightedChars)(t, a, n),
            [t, n, a],
          )
        return r.createElement(
          r.Fragment,
          null,
          c.length
            ? a
                .split('')
                .map((e, t) =>
                  r.createElement(
                    r.Fragment,
                    { key: t },
                    c[t]
                      ? r.createElement(
                          'span',
                          { className: o(s.highlighted, l) },
                          e,
                        )
                      : r.createElement('span', null, e),
                  ),
                )
            : a,
        )
      }
    },
    494707: (e, t, n) => {
      n.d(t, { Separator: () => s })
      var r = n(50959),
        o = n(497754),
        i = n(345719)
      function s(e) {
        return r.createElement('div', {
          className: o(i.separator, e.className),
        })
      }
    },
    917850: (e, t, n) => {
      n.d(t, { PopupMenuSeparator: () => a })
      var r = n(50959),
        o = n(497754),
        i = n.n(o),
        s = n(92910)
      function a(e) {
        const { size: t = 'normal', className: n, ariaHidden: o = !1 } = e
        return r.createElement('div', {
          className: i()(
            s.separator,
            'small' === t && s.small,
            'normal' === t && s.normal,
            'large' === t && s.large,
            n,
          ),
          role: 'separator',
          'aria-hidden': o,
        })
      }
    },
    624216: (e, t, n) => {
      n.d(t, { PopupMenu: () => h })
      var r = n(50959),
        o = n(500962),
        i = n(162942),
        s = n(813113),
        a = n(510618),
        l = n(28466)
      const c = r.createContext(void 0)
      var u = n(908783)
      const d = r.createContext({ setMenuMaxWidth: !1 })
      function h(e) {
        const {
            controller: t,
            children: n,
            isOpened: h,
            closeOnClickOutside: m = !0,
            doNotCloseOn: p,
            onClickOutside: v,
            onClose: f,
            onKeyboardClose: g,
            'data-name': C = 'popup-menu-container',
            ...E
          } = e,
          w = (0, r.useContext)(l.CloseDelegateContext),
          x = r.useContext(d),
          b = (0, r.useContext)(c),
          y = (0, u.useOutsideEvent)({
            handler: (e) => {
              v && v(e)
              if (!m) return
              const t = (0, i.default)(p) ? p() : null == p ? [] : [p]
              if (t.length > 0 && e.target instanceof Node)
                for (const n of t) {
                  const t = o.findDOMNode(n)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              f()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return h
          ? r.createElement(
              s.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              r.createElement(
                'span',
                { ref: y, style: { pointerEvents: 'auto' } },
                r.createElement(
                  a.Menu,
                  {
                    ...E,
                    onClose: f,
                    onKeyboardClose: g,
                    onScroll: (t) => {
                      const { onScroll: n } = e
                      n && n(t)
                    },
                    customCloseDelegate: w,
                    customRemeasureDelegate: b,
                    ref: t,
                    'data-name': C,
                    limitMaxWidth: x.setMenuMaxWidth,
                  },
                  n,
                ),
              ),
            )
          : null
      }
    },
    515783: (e, t, n) => {
      n.d(t, { ToolWidgetCaret: () => l })
      var r = n(50959),
        o = n(497754),
        i = n(72571),
        s = n(934587),
        a = n(100578)
      function l(e) {
        const { dropped: t, className: n } = e
        return r.createElement(i.Icon, {
          className: o(n, s.icon, { [s.dropped]: t }),
          icon: a,
        })
      }
    },
    493173: (e, t, n) => {
      function r(e, t, n = {}) {
        return Object.assign(
          {},
          e,
          ((e, t, n = {}) => {
            const r = Object.assign({}, t)
            for (const o of Object.keys(t)) {
              const i = n[o] || o
              i in e && (r[o] = [e[i], t[o]].join(' '))
            }
            return r
          })(e, t, n),
        )
      }
      n.d(t, { mergeThemes: () => r })
    },
    212989: (e) => {
      e.exports = {
        summary: 'summary-ynHBVe1n',
        hovered: 'hovered-ynHBVe1n',
        caret: 'caret-ynHBVe1n',
      }
    },
    475747: (e, t, n) => {
      n.d(t, { CollapsibleSection: () => l })
      var r = n(50959),
        o = n(497754),
        i = n.n(o),
        s = n(515783),
        a = n(212989)
      const l = (0, r.forwardRef)((e, t) => {
        const {
          open: n,
          summary: o,
          children: l,
          onStateChange: c,
          tabIndex: u,
          className: d,
          ...h
        } = e
        return r.createElement(
          r.Fragment,
          null,
          r.createElement(
            'div',
            {
              ...h,
              className: i()(d, a.summary),
              onClick: () => {
                c && c(!n)
              },
              'data-open': n,
              ref: t,
              tabIndex: u,
            },
            o,
            r.createElement(s.ToolWidgetCaret, {
              className: a.caret,
              dropped: Boolean(n),
            }),
          ),
          n && l,
        )
      })
    },
    476853: (e, t, n) => {
      n.d(t, {
        HorizontalAttachEdge: () => o,
        HorizontalDropDirection: () => s,
        VerticalAttachEdge: () => r,
        VerticalDropDirection: () => i,
        getPopupPositioner: () => c,
      })
      var r,
        o,
        i,
        s,
        a = n(650151)
      !((e) => {
        ;(e[(e.Top = 0)] = 'Top'),
          (e[(e.Bottom = 1)] = 'Bottom'),
          (e[(e.AutoStrict = 2)] = 'AutoStrict')
      })(r || (r = {})),
        ((e) => {
          ;(e[(e.Left = 0)] = 'Left'), (e[(e.Right = 1)] = 'Right')
        })(o || (o = {})),
        ((e) => {
          ;(e[(e.FromTopToBottom = 0)] = 'FromTopToBottom'),
            (e[(e.FromBottomToTop = 1)] = 'FromBottomToTop')
        })(i || (i = {})),
        ((e) => {
          ;(e[(e.FromLeftToRight = 0)] = 'FromLeftToRight'),
            (e[(e.FromRightToLeft = 1)] = 'FromRightToLeft')
        })(s || (s = {}))
      const l = {
        verticalAttachEdge: r.Bottom,
        horizontalAttachEdge: o.Left,
        verticalDropDirection: i.FromTopToBottom,
        horizontalDropDirection: s.FromLeftToRight,
        verticalMargin: 0,
        horizontalMargin: 0,
        matchButtonAndListboxWidths: !1,
      }
      function c(e, t) {
        return (n) => {
          var c, u
          const { contentWidth: d, contentHeight: h, availableHeight: m } = n,
            p = (0, a.ensureNotNull)(e).getBoundingClientRect(),
            {
              horizontalAttachEdge: v = l.horizontalAttachEdge,
              horizontalDropDirection: f = l.horizontalDropDirection,
              horizontalMargin: g = l.horizontalMargin,
              verticalMargin: C = l.verticalMargin,
              matchButtonAndListboxWidths: E = l.matchButtonAndListboxWidths,
            } = t
          let w =
              null !== (c = t.verticalAttachEdge) && void 0 !== c
                ? c
                : l.verticalAttachEdge,
            x =
              null !== (u = t.verticalDropDirection) && void 0 !== u
                ? u
                : l.verticalDropDirection
          w === r.AutoStrict &&
            (m < p.y + p.height + C + h
              ? ((w = r.Top), (x = i.FromBottomToTop))
              : ((w = r.Bottom), (x = i.FromTopToBottom)))
          const b = w === r.Top ? -1 * C : C,
            y = v === o.Right ? p.right : p.left,
            k = w === r.Top ? p.top : p.bottom,
            _ = {
              x: y - (f === s.FromRightToLeft ? d : 0) + g,
              y: k - (x === i.FromBottomToTop ? h : 0) + b,
            }
          return E && (_.overrideWidth = p.width), _
        }
      }
    },
    648997: (e, t, n) => {
      n.r(t), n.d(t, { currencyActions: () => a })
      var r = n(650151),
        o = n(609838),
        i = n(121322),
        s = n(410958)
      function a(e, t, a) {
        if (null === t || t.readOnly) return []
        const l = [],
          c = (t) => {
            e.setPriceScaleCurrency(a, t)
          },
          u = t.selectedCurrency,
          d = t.originalCurrencies,
          h = t.baseCurrencies,
          m = t.displayedValues,
          p = s.favoriteCurrencyUnitConversionService.get().currencies,
          v = { id: 'first_section', actions: [] }
        if (d.size > 1) {
          const e = (0, i.createAction)(
            'Mixed',
            o.t(null, void 0, n(795093)),
            void 0,
            void 0,
            null === t.selectedCurrency,
            () => c(null),
          )
          v.actions.push(e)
        }
        const f = e.model().availableCurrencies()
        if (null !== u) {
          const e = (0, r.ensureNotNull)(f.item(u)),
            t = (0, i.createAction)(
              u,
              (0, r.ensureDefined)(m.get(u)),
              e.logoUrl,
              e.description,
              !0,
              () => {},
              p.has(u),
              () =>
                s.favoriteCurrencyUnitConversionService.toggle('currencies', u),
            )
          v.actions.push(t)
        }
        const g = f.filterConvertible(h, (e) => e !== u && d.has(e))
        for (const e of g) {
          const n = (0, r.ensureNotNull)(f.item(e.id))
          v.actions.push(
            (0, i.createAction)(
              e.id,
              e.code,
              n.logoUrl,
              n.description,
              t.selectedCurrency === e.id,
              () => c(e.id),
              p.has(e.id),
              () =>
                s.favoriteCurrencyUnitConversionService.toggle(
                  'currencies',
                  e.id,
                ),
            ),
          )
        }
        v.actions.length > 0 && l.push(v)
        const C = f.filterConvertible(h, (e) => e !== u && !d.has(e)),
          E = [],
          w = []
        for (const e of C) {
          const n = (0, r.ensureNotNull)(f.item(e.id)),
            o = p.has(e.id),
            a = (0, i.createAction)(
              e.id,
              e.code,
              n.logoUrl,
              n.description,
              t.selectedCurrency === e.id,
              () => c(e.id),
              o,
              () =>
                s.favoriteCurrencyUnitConversionService.toggle(
                  'currencies',
                  e.id,
                ),
            )
          o ? E.push(a) : w.push(a)
        }
        return (
          (w.length > 0 || E.length > 0) &&
            l.push({ id: 'second_section', actions: E.concat(w) }),
          l
        )
      }
    },
    410958: (e, t, n) => {
      n.d(t, { favoriteCurrencyUnitConversionService: () => a })
      var r = n(870122),
        o = n(717866),
        i = n(584776)
      class s extends i.AbstractJsonStoreService {
        constructor(e, t) {
          super(
            e,
            t,
            'FAVORITE_CURRENCY_UNIT_CONVERSION_CHANGED',
            'currencyUnitConversion.favorites',
            { currencies: new Set(), units: new Set() },
          )
        }
        add(e, t) {
          const n = this.get()
          n[e].add(t), this.set(n)
        }
        remove(e, t) {
          const n = this.get()
          n[e].delete(t) && this.set(n)
        }
        toggle(e, t) {
          this.get()[e].has(t) ? this.remove(e, t) : this.add(e, t)
        }
        _serialize(e) {
          return [[...e.currencies], [...e.units]]
        }
        _deserialize(e) {
          return { currencies: new Set(e[0]), units: new Set(e[1]) }
        }
      }
      const a = new s(o.TVXWindowEvents, r)
    },
    22265: (e, t, n) => {
      n.r(t), n.d(t, { unitActions: () => a })
      var r = n(650151),
        o = n(609838),
        i = n(121322),
        s = n(410958)
      function a(e, t, a) {
        if (null === t || 0 === t.availableGroups.size) return []
        const l = [],
          c = (t) => {
            e.setPriceScaleUnit(a, t)
          },
          u = t.selectedUnit,
          d = t.originalUnits,
          h = t.names,
          m = t.descriptions,
          p = s.favoriteCurrencyUnitConversionService.get().units,
          v = { actions: [], id: 'first_section' }
        if (d.size > 1) {
          const e = (0, i.createAction)(
            'Mixed',
            o.t(null, void 0, n(795093)),
            void 0,
            void 0,
            null === t.selectedUnit,
            () => c(null),
          )
          v.actions.push(e)
        }
        const f = e.model().availableUnits()
        if (null !== u) {
          const e = (0, i.createAction)(
            u,
            (0, r.ensureDefined)(h.get(u)),
            void 0,
            (0, r.ensureDefined)(m.get(u)),
            !0,
            () => {},
            p.has(u),
            () => s.favoriteCurrencyUnitConversionService.toggle('units', u),
          )
          v.actions.push(e)
        }
        const g = f.unitsByGroups(t.availableGroups),
          C = [],
          E = []
        for (const e of g)
          for (const t of e.units) {
            const e = p.has(t.id)
            if (t.id === u || (!e && !d.has(t.id))) continue
            const n = (0, i.createAction)(
              t.id,
              t.name,
              void 0,
              t.description,
              !1,
              () => c(t.id),
              e,
              () =>
                s.favoriteCurrencyUnitConversionService.toggle('units', t.id),
            )
            e ? E.push(n) : C.push(n)
          }
        ;(C.length > 0 || E.length > 0) &&
          v.actions.push(
            ...E.sort((e, t) =>
              e.label.toLowerCase().localeCompare(t.label.toLowerCase()),
            ),
            ...C,
          ),
          v.actions.length > 0 && l.push(v)
        const w = u && f.unitGroupById(u)
        if (null !== w)
          for (const e of g) {
            if (e.name !== w) continue
            const t = []
            for (const n of e.units)
              n.id === u ||
                d.has(n.id) ||
                p.has(n.id) ||
                t.push(
                  (0, i.createAction)(
                    n.id,
                    n.name,
                    void 0,
                    n.description,
                    !1,
                    () => c(n.id),
                    !1,
                    () =>
                      s.favoriteCurrencyUnitConversionService.toggle(
                        'units',
                        n.id,
                      ),
                  ),
                )
            t.length > 0 && l.push({ id: e.name, name: e.name, actions: t })
          }
        for (const e of g) {
          if (e.name === w) continue
          const t = []
          for (const n of e.units)
            n.id === u ||
              d.has(n.id) ||
              p.has(n.id) ||
              t.push(
                (0, i.createAction)(
                  n.id,
                  n.name,
                  void 0,
                  n.description,
                  !1,
                  () => c(n.id),
                  !1,
                  () =>
                    s.favoriteCurrencyUnitConversionService.toggle(
                      'units',
                      n.id,
                    ),
                ),
              )
          t.length > 0 && l.push({ id: e.name, name: e.name, actions: t })
        }
        return l
      }
    },
    121322: (e, t, n) => {
      function r(e, t, n, r, o, i, s, a) {
        return {
          id: e,
          label: t,
          icon: n,
          description: r,
          isActive: o,
          onClick: i,
          isFavorite: s,
          onFavoriteClick: a,
        }
      }
      n.d(t, { createAction: () => r })
    },
    660538: (e, t, n) => {
      n.d(t, {
        mediaQueryAddEventListener: () => r,
        mediaQueryRemoveEventListener: () => o,
      })
      const r = (e, t) => {
          ;(null == e ? void 0 : e.addEventListener)
            ? e.addEventListener('change', t)
            : e.addListener(t)
        },
        o = (e, t) => {
          ;(null == e ? void 0 : e.removeEventListener)
            ? e.removeEventListener('change', t)
            : e.removeListener(t)
        }
    },
    51417: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M11.85 11.93A5.48 5.48 0 0 0 8 2.5a5.5 5.5 0 1 0 3.85 9.43zm0 0L16 16"/></svg>'
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
    100578: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>'
    },
    69311: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9.7 9l4.65-4.65-.7-.7L9 8.29 4.35 3.65l-.7.7L8.29 9l-4.64 4.65.7.7L9 9.71l4.65 4.64.7-.7L9.71 9z"/></svg>'
    },
    969859: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><path stroke="currentColor" d="M12.4 12.5a7 7 0 1 0-4.9 2 7 7 0 0 0 4.9-2zm0 0l5.101 5"/></svg>'
    },
    239146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>'
    },
    648010: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>'
    },
    925931: (e, t, n) => {
      n.d(t, { nanoid: () => r })
      const r = (e = 21) =>
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
    620036: (e) => {
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
    680395: (e) => {
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
    44629: (e) => {
      e.exports = {
        ar: ['اضف إلى القائمة التفضيلات'],
        ca_ES: ['Afegeix a preferits'],
        cs: ['Přidat do oblíbených'],
        de: ['Zu Favoriten hinzufügen'],
        el: ['Προσθήκη στα αγαπημένα'],
        en: 'Add to favorites',
        es: ['Añadir a favoritos'],
        fa: ['افزودن به موارد مورد علاقه'],
        fr: ['Ajouter aux favoris'],
        he_IL: ['הוסף למועדפים'],
        hu_HU: ['Hozzáadás kedvencekhez'],
        id_ID: ['Tambah ke daftar favorit'],
        it: ['Aggiungi ai preferiti'],
        ja: ['お気に入りに追加'],
        ko: ['즐겨찾기에 넣기'],
        ms_MY: ['Tambah kepada kegemaran'],
        nl_NL: ['Voeg toe aan favorieten'],
        pl: ['Dodaj do ulubionych'],
        pt: ['Adicionar aos favoritos'],
        ro: 'Add to favorites',
        ru: ['Добавить в избранное'],
        sv: ['Lägg till som favorit'],
        th: ['เพิ่มลงรายการโปรด'],
        tr: ['Favorilere ekle'],
        vi: ['Thêm vào mục yêu thích'],
        zh: ['添加到收藏'],
        zh_TW: ['加入收藏'],
      }
    },
    252298: (e) => {
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
    572482: (e) => {
      e.exports = {
        ar: ['حذف من القائمة المفضلة'],
        ca_ES: ['Treure de preferits'],
        cs: ['Odebrat z oblíbených'],
        de: ['Aus Favoriten entfernen'],
        el: ['Διαγραφή απο τα αγαπημένα'],
        en: 'Remove from favorites',
        es: ['Quitar de favoritos'],
        fa: ['حذف از موارد مورد علاقه'],
        fr: ['Retirer des favoris'],
        he_IL: ['הסר ממועדפים'],
        hu_HU: ['Eltávolít kedvencek közül'],
        id_ID: ['Hilangkan dari favorit'],
        it: ['Rimuovi dai preferiti'],
        ja: ['お気に入りから削除'],
        ko: ['즐겨찾기지움'],
        ms_MY: ['Buang dari kegemaran'],
        nl_NL: ['Verwijder van favorieten'],
        pl: ['Usuń z ulubionych'],
        pt: ['Remover dos favoritos'],
        ro: 'Remove from favorites',
        ru: ['Удалить из предпочтений'],
        sv: ['Ta bort från favoriter'],
        th: ['ลบออกจากรายการโปรด'],
        tr: ['Favorilerimden çıkar'],
        vi: ['Loại bỏ khỏi mục yêu thích'],
        zh: ['从收藏中移除'],
        zh_TW: ['從收藏移除'],
      }
    },
  },
])
