;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9418],
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
    77508: (e) => {
      e.exports = {
        dialog: 'dialog-b8SxMnzX',
        wrapper: 'wrapper-b8SxMnzX',
        separator: 'separator-b8SxMnzX',
        bounded: 'bounded-b8SxMnzX',
      }
    },
    10326: (e) => {
      e.exports = {
        'small-height-breakpoint': '(max-height: 360px)',
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
    36204: (e) => {
      e.exports = { separator: 'separator-Pf4rIzEt' }
    },
    57340: (e, t, i) => {
      i.d(t, { CloseButton: () => h })
      var s = i(50959),
        n = i(64388),
        o = i(17105),
        r = i(15130),
        a = i(38822),
        l = i(63346),
        c = i(34983)
      function d(e = 'large') {
        switch (e) {
          case 'large':
            return o
          case 'medium':
          default:
            return r
          case 'small':
            return a
          case 'xsmall':
            return l
          case 'xxsmall':
            return c
        }
      }
      const h = s.forwardRef((e, t) =>
        s.createElement(n.NavButton, { ...e, ref: t, icon: d(e.size) }),
      )
    },
    64388: (e, t, i) => {
      i.d(t, { NavButton: () => c })
      var s = i(50959),
        n = i(97754),
        o = i(9745),
        r = (i(49406), i(21019))
      function a(e) {
        const {
          size: t = 'large',
          preservePaddings: i,
          isLink: s,
          flipIconOnRtl: o,
          className: a,
        } = e
        return n(
          r['nav-button'],
          r[`size-${t}`],
          i && r['preserve-paddings'],
          o && r['flip-icon'],
          s && r.link,
          a,
        )
      }
      function l(e) {
        const { children: t, icon: i } = e
        return s.createElement(
          s.Fragment,
          null,
          s.createElement('span', { className: r.background }),
          s.createElement(o.Icon, {
            icon: i,
            className: r.icon,
            'aria-hidden': !0,
          }),
          t && s.createElement('span', { className: r['visually-hidden'] }, t),
        )
      }
      const c = (0, s.forwardRef)((e, t) => {
        const {
          icon: i,
          type: n = 'button',
          preservePaddings: o,
          flipIconOnRtl: r,
          size: c,
          'aria-label': d,
          ...h
        } = e
        return s.createElement(
          'button',
          { ...h, className: a({ ...e, children: d }), ref: t, type: n },
          s.createElement(l, { icon: i }, d),
        )
      })
      c.displayName = 'NavButton'
      var d = i(21593),
        h = i(53017)
      ;(0, s.forwardRef)((e, t) => {
        const { icon: i, renderComponent: n, 'aria-label': o, ...r } = e,
          c = n ?? d.CustomComponentDefaultLink
        return s.createElement(
          c,
          {
            ...r,
            className: a({ ...e, children: o, isLink: !0 }),
            reference: (0, h.isomorphicRef)(t),
          },
          s.createElement(l, { icon: i }, o),
        )
      }).displayName = 'NavAnchorButton'
    },
    49406: (e, t, i) => {
      var s, n, o, r
      !((e) => {
        ;(e.Primary = 'primary'),
          (e.QuietPrimary = 'quiet-primary'),
          (e.Secondary = 'secondary'),
          (e.Ghost = 'ghost')
      })(s || (s = {})),
        ((e) => {
          ;(e.XXSmall = 'xxsmall'),
            (e.XSmall = 'xsmall'),
            (e.Small = 'small'),
            (e.Medium = 'medium'),
            (e.Large = 'large'),
            (e.XLarge = 'xlarge'),
            (e.XXLarge = 'xxlarge')
        })(n || (n = {})),
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
        })(o || (o = {})),
        ((e) => {
          ;(e.Semibold18px = 'semibold18px'),
            (e.Semibold16px = 'semibold16px'),
            (e.Semibold14px = 'semibold14px'),
            (e.Medium16px = 'medium16px'),
            (e.Regular16px = 'regular16px'),
            (e.Regular14px = 'regular14px')
        })(r || (r = {}))
    },
    38952: (e, t, i) => {
      function s(e) {
        const { reference: t, ...i } = e
        return { ...i, ref: t }
      }
      i.d(t, { renameRef: () => s })
    },
    21593: (e, t, i) => {
      i.d(t, { CustomComponentDefaultLink: () => o })
      var s = i(50959),
        n = i(38952)
      function o(e) {
        return s.createElement('a', { ...(0, n.renameRef)(e) })
      }
      s.PureComponent
    },
    53017: (e, t, i) => {
      function s(e) {
        return (t) => {
          e.forEach((e) => {
            'function' == typeof e ? e(t) : null != e && (e.current = t)
          })
        }
      }
      function n(e) {
        return s([e])
      }
      i.d(t, { isomorphicRef: () => n, mergeRefs: () => s })
    },
    52778: (e, t, i) => {
      i.d(t, { OutsideEvent: () => n })
      var s = i(36383)
      function n(e) {
        const { children: t, ...i } = e
        return t((0, s.useOutsideEvent)(i))
      }
    },
    79418: (e, t, i) => {
      i.d(t, { AdaptivePopupDialog: () => M })
      var s = i(50959),
        n = i(50151),
        o = i(97754),
        r = i.n(o),
        a = i(68335),
        l = i(63273),
        c = i(35749),
        d = i(82206),
        h = i(1109),
        u = i(24437),
        p = i(90692),
        g = i(95711)
      var m = i(52092),
        _ = i(76422),
        f = i(11542),
        v = i(57340)
      const y = s.createContext({ setHideClose: () => {} })
      var w = i(10326)
      function x(e) {
        const {
            titleId: t,
            title: n,
            titleTextWrap: o = !1,
            subtitle: a,
            showCloseIcon: l = !0,
            onClose: c,
            onCloseButtonKeyDown: d,
            renderBefore: h,
            renderAfter: u,
            draggable: p,
            className: g,
            unsetAlign: m,
            closeAriaLabel: _ = f.t(null, void 0, i(47742)),
            closeButtonReference: x,
          } = e,
          [b, E] = (0, s.useState)(!1)
        return s.createElement(
          y.Provider,
          { value: { setHideClose: E } },
          s.createElement(
            'div',
            { className: r()(w.container, g, (a || m) && w.unsetAlign) },
            h,
            s.createElement(
              'div',
              { id: t, className: w.title, 'data-dragg-area': p },
              s.createElement(
                'div',
                { className: r()(o ? w.textWrap : w.ellipsis) },
                n,
              ),
              a &&
                s.createElement(
                  'div',
                  { className: r()(w.ellipsis, w.subtitle) },
                  a,
                ),
            ),
            u,
            l &&
              !b &&
              s.createElement(v.CloseButton, {
                className: w.close,
                'data-name': 'close',
                'aria-label': _,
                onClick: c,
                onKeyDown: d,
                ref: x,
                size: 'medium',
                preservePaddings: !0,
              }),
          ),
        )
      }
      var b = i(53017),
        E = i(90186),
        D = i(92184),
        S = i(56570),
        C = i(77508)
      const A = { vertical: 20 },
        F = { vertical: 0 }
      class M extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._controller = null),
            (this._reference = null),
            (this._orientationMediaQuery = null),
            (this._embedResizerOverridesEnabled = S.enabled(
              'embed_resizer_overrides',
            )),
            (this._titleId = `title_${(0, D.randomHash)()}`),
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
                    window.matchMedia(u.DialogBreakpoints.TabletSmall).matches,
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
                  const { activeElement: i } = document
                  if (null !== i) {
                    if (
                      (e.preventDefault(),
                      'true' === (t = i).getAttribute('data-haspopup') &&
                        'true' !== t.getAttribute('data-expanded'))
                    )
                      return void this._handleClose()
                    const s = this._reference
                    if (null !== s && (0, c.isTextEditingField)(i))
                      return void s.focus()
                    if (s?.contains(i))
                      return (
                        this.props.onKeyboardClose &&
                          this.props.onKeyboardClose(),
                        void this._handleClose()
                      )
                  }
                }
                var t, i
                ;((e) => {
                  if ('function' == typeof e) return e()
                  return Boolean(e)
                })(this.props.disableTabNavigationContainment) ||
                  ((i = e),
                  [9, a.Modifiers.Shift + 9].includes(
                    (0, a.hashFromEvent)(i),
                  ) && i.stopPropagation())
              }
            }),
            (this._requestResize = () => {
              null !== this._controller && this._controller.recalculateBounds()
            }),
            (this._centerAndFit = () => {
              null !== this._controller && this._controller.centerAndFit()
            }),
            (this._calculatePositionWithOffsets = (e, t) => {
              const i = (0, n.ensureDefined)(
                this.props.fullScreenViewOffsets,
              ).value()
              return {
                top: i.top,
                left: (0, l.isRtl)() ? -i.right : i.left,
                width: t.clientWidth - i.left - i.right,
                height: t.clientHeight - i.top - i.bottom,
              }
            })
        }
        componentDidMount() {
          this.props.ignoreClosePopupsAndDialog ||
            _.subscribe(
              m.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
              this._handleClose,
              null,
            ),
            this._handleOpen(),
            void 0 !== this.props.onOpen &&
              ((this._orientationMediaQuery = window.matchMedia(
                '(orientation: portrait)',
              )),
              this._orientationMediaQuery.addEventListener(
                'change',
                this._handleOpen,
              )),
            this.props.fullScreenViewOffsets &&
              this.props.fullScreen &&
              this.props.fullScreenViewOffsets.subscribe(this._requestResize)
          const {
            backdrop: e,
            draggable: t = !e,
            centerOnResize: i = !t,
          } = this.props
          i && window.addEventListener('resize', this._centerAndFit)
        }
        componentWillUnmount() {
          this.props.ignoreClosePopupsAndDialog ||
            _.unsubscribe(
              m.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
              this._handleClose,
              null,
            ),
            null !== this._orientationMediaQuery &&
              this._orientationMediaQuery.removeEventListener(
                'change',
                this._handleOpen,
              ),
            this.props.fullScreenViewOffsets &&
              this.props.fullScreen &&
              this.props.fullScreenViewOffsets.unsubscribe(this._requestResize),
            window.removeEventListener('resize', this._centerAndFit)
        }
        focus() {
          ;(0, n.ensureNotNull)(this._reference).focus()
        }
        getElement() {
          return this._reference
        }
        contains(e) {
          return this._reference?.contains(e) ?? !1
        }
        render() {
          const {
              className: e,
              wrapperClassName: t,
              headerClassName: i,
              isOpened: n,
              title: o,
              titleTextWrap: a,
              dataName: l,
              onClickOutside: c,
              additionalElementPos: m,
              additionalHeaderElement: _,
              backdrop: f,
              shouldForceFocus: v = !0,
              shouldReturnFocus: y,
              onForceFocus: w,
              showSeparator: D,
              subtitle: S,
              draggable: M = !f,
              fullScreen: k = !1,
              showCloseIcon: T = !0,
              rounded: B = !0,
              isAnimationEnabled: N,
              growPoint: P,
              dialogTooltip: z,
              unsetHeaderAlign: O,
              onDragStart: L,
              dataDialogName: R,
              closeAriaLabel: I,
              containerAriaLabel: H,
              reference: W,
              containerTabIndex: K,
              closeButtonReference: X,
              onCloseButtonKeyDown: $,
              shadowed: q,
              fullScreenViewOffsets: U,
              fixedBody: Y,
              onClick: G,
            } = this.props,
            V = 'after' !== m ? _ : void 0,
            Z = 'after' === m ? _ : void 0,
            Q = 'string' == typeof o ? o : R || '',
            j = (0, E.filterDataProps)(this.props),
            J = (0, b.mergeRefs)([this._handleReference, W])
          return s.createElement(
            p.MatchMedia,
            { rule: u.DialogBreakpoints.SmallHeight },
            (m) =>
              s.createElement(
                p.MatchMedia,
                { rule: u.DialogBreakpoints.TabletSmall },
                (u) =>
                  s.createElement(
                    d.PopupDialog,
                    {
                      rounded: !(u || k) && B,
                      className: r()(C.dialog, k && U && C.bounded, e),
                      isOpened: n,
                      reference: J,
                      onKeyDown: this._handleKeyDown,
                      onClickOutside: c,
                      onClickBackdrop: c,
                      fullscreen: u || k,
                      guard: m ? F : A,
                      boundByScreen: u || k,
                      shouldForceFocus: v,
                      onForceFocus: w,
                      shouldReturnFocus: y,
                      backdrop: f,
                      draggable: M,
                      isAnimationEnabled: N,
                      growPoint: P,
                      name: this.props.dataName,
                      dialogTooltip: z,
                      onDragStart: L,
                      containerAriaLabel: H,
                      containerTabIndex: K,
                      calculateDialogPosition:
                        k && U ? this._calculatePositionWithOffsets : void 0,
                      shadowed: q,
                      fixedBody: Y,
                      onClick: G,
                      ...j,
                    },
                    s.createElement(
                      'div',
                      {
                        role: 'dialog',
                        'aria-labelledby':
                          void 0 !== o ? this._titleId : void 0,
                        className: r()(C.wrapper, t),
                        'data-name': l,
                        'data-dialog-name': Q,
                      },
                      void 0 !== o &&
                        s.createElement(x, {
                          draggable: M && !(u || k),
                          onClose: this._handleCloseBtnClick,
                          renderAfter: Z,
                          renderBefore: V,
                          subtitle: S,
                          title: o,
                          titleId: this._titleId,
                          titleTextWrap: a,
                          showCloseIcon: T,
                          className: i,
                          unsetAlign: O,
                          closeAriaLabel: I,
                          closeButtonReference: X,
                          onCloseButtonKeyDown: $,
                        }),
                      D &&
                        s.createElement(h.Separator, {
                          className: C.separator,
                        }),
                      s.createElement(g.PopupContext.Consumer, null, (e) =>
                        this._renderChildren(e, u || k),
                      ),
                    ),
                  ),
              ),
          )
        }
      }
    },
    95711: (e, t, i) => {
      i.d(t, { PopupContext: () => s })
      const s = i(50959).createContext(null)
    },
    82206: (e, t, i) => {
      i.d(t, { PopupDialog: () => P })
      var s = i(50959),
        n = i(97754),
        o = i(50151),
        r = i(99663),
        a = i(67961),
        l = i(90186),
        c = i(84928)
      class d extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._manager = new a.OverlapManager()),
            (this._handleSlot = (e) => {
              this._manager.setContainer(e)
            })
        }
        render() {
          const {
              rounded: e = !0,
              shadowed: t = !0,
              fullscreen: i = !1,
              darker: o = !1,
              className: a,
              backdrop: d,
              containerTabIndex: h = -1,
            } = this.props,
            u = n(
              a,
              c.dialog,
              e && c.rounded,
              t && c.shadowed,
              i && c.fullscreen,
              o && c.darker,
            ),
            p = (0, l.filterDataProps)(this.props),
            g = this.props.style
              ? { ...this._createStyles(), ...this.props.style }
              : this._createStyles()
          return s.createElement(
            s.Fragment,
            null,
            s.createElement(
              r.SlotContext.Provider,
              { value: this._manager },
              d &&
                s.createElement('div', {
                  onClick: this.props.onClickBackdrop,
                  className: c.backdrop,
                }),
              s.createElement(
                'div',
                {
                  ...p,
                  className: u,
                  style: g,
                  ref: this.props.reference,
                  onFocus: this.props.onFocus,
                  onMouseDown: this.props.onMouseDown,
                  onMouseUp: this.props.onMouseUp,
                  onClick: this.props.onClick,
                  onKeyDown: this.props.onKeyDown,
                  tabIndex: h,
                  'aria-label': this.props.containerAriaLabel,
                },
                this.props.children,
              ),
            ),
            s.createElement(r.Slot, { reference: this._handleSlot }),
          )
        }
        _createStyles() {
          const {
            bottom: e,
            left: t,
            width: i,
            right: s,
            top: n,
            zIndex: o,
            height: r,
          } = this.props
          return {
            bottom: e,
            left: t,
            right: s,
            top: n,
            zIndex: o,
            maxWidth: i,
            height: r,
          }
        }
      }
      var h,
        u = i(86431),
        p = i(52778),
        g = i(9859),
        m = i(15754)
      function _(e, t, i, s) {
        return e + t > s && (e = s - t), e < i && (e = i), e
      }
      function f(e) {
        return {
          x: (0, g.clamp)(e.x, 20, document.documentElement.clientWidth - 20),
          y: (0, g.clamp)(e.y, 20, window.innerHeight - 20),
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
      })(h || (h = {}))
      class w {
        constructor(e, t, i = { boundByScreen: !0 }) {
          ;(this._drag = null),
            (this._canBeTouchClick = !1),
            (this._frame = null),
            (this._onMouseDragStart = (e) => {
              if (0 !== e.button || this._isTargetNoDraggable(e)) return
              e.preventDefault(),
                document.addEventListener('mousemove', this._onMouseDragMove),
                document.addEventListener('mouseup', this._onMouseDragEnd)
              const t = f(v(e))
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
              const t = f(y(e))
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
              const t = f(v(e))
              this._dragMove(t)
            }),
            (this._onTouchDragMove = (e) => {
              ;(this._canBeTouchClick = !1), e.preventDefault()
              const t = f(y(e))
              this._dragMove(t)
            }),
            (this._onDragStop = () => {
              ;(this._drag = null),
                this._header.classList.remove('dragging'),
                this._options.onDragEnd && this._options.onDragEnd()
            }),
            (this._dialog = e),
            (this._header = t),
            (this._options = i),
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
          const i = Math.round(t.left),
            s = Math.round(t.top)
          ;(this._dialog.style.transform = `translate(${i}px, ${s}px)`),
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
                  i = e.y - this._drag.startY
                this._moveDialog(this._drag.dialogX + t, this._drag.dialogY + i)
              }
              this._frame = null
            })
          }
        }
        _moveDialog(e, t) {
          const i = this._dialog.getBoundingClientRect(),
            { boundByScreen: s } = this._options,
            n = _(e, i.width, s ? 0 : -1 / 0, s ? window.innerWidth : 1 / 0),
            o = _(t, i.height, s ? 0 : -1 / 0, s ? window.innerHeight : 1 / 0)
          this._dialog.style.transform = `translate(${Math.round(n)}px, ${Math.round(o)}px)`
        }
        _isTargetNoDraggable(e) {
          return (
            e.target instanceof Element &&
            null !== e.target.closest('[data-disable-drag]')
          )
        }
      }
      const x = { vertical: 0 }
      var b,
        E = i(42842),
        D = i(95711),
        S = i(99054),
        C = i(9343),
        A = i(92184)
      !((e) => {
        ;(e.Open = 'dialog-open'),
          (e.Close = 'dialog-close'),
          (e.FullscreenOn = 'dialog-fullscreen-on'),
          (e.FullscreenOff = 'dialog-fullscreen-off')
      })(b || (b = {}))
      const F = (0, C.getLogger)('DialogEventDispatcher')
      class M {
        constructor() {
          this._openSessionId = null
        }
        dispatch(e) {
          if ('dialog-open' === e) {
            if (null !== this._openSessionId)
              return void F.logError('Multiple calls to open dialog')
            this._openSessionId = (0, A.randomHash)()
          }
          null !== this._openSessionId
            ? (window.dispatchEvent(
                new CustomEvent(e, {
                  bubbles: !0,
                  detail: { dialogSessionId: this._openSessionId },
                }),
              ),
              'dialog-close' === e && (this._openSessionId = null))
            : F.logError('Empty open dialog session id')
        }
      }
      var k = i(84015),
        T = (i(56570), i(13100))
      T['tooltip-offset']
      const B = class {
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
            i = this._calcAvailableHeight(),
            s = this._calcDialogHeight()
          if (i === s)
            if (this._calculateDialogPosition) {
              const { left: e, top: t } = this._calculateDialogPosition(
                this._dialog,
                document.documentElement,
                this._guard,
              )
              this._dialog.style.transform = `translate(${Math.round(e)}px, ${Math.round(t)}px)`
            } else this._dialog.style.height = s + 'px'
          ;(this._dialog.style.top = '0px'),
            (this._dialog.style.left = '0px'),
            (this._dialog.style.transform = `translate(${e}px, ${t}px)`)
        }
        getDialogsTopLeftCoordinates() {
          const { clientWidth: e, clientHeight: t } =
              this._getClientDimensions(),
            i = this._calcDialogHeight(),
            s = e / 2 - this._dialog.clientWidth / 2,
            n = t / 2 - i / 2 + this._getTopOffset()
          return { x: Math.round(s), y: Math.round(n) }
        }
        recalculateBounds() {
          const { clientWidth: e, clientHeight: t } =
              this._getClientDimensions(),
            { vertical: i } = this._guard,
            s = this._calculateDialogPosition?.(
              this._dialog,
              { clientWidth: e, clientHeight: t },
              { vertical: i },
            )
          if (this._isFullscreen) {
            if (
              ((this._dialog.style.top = '0px'),
              (this._dialog.style.left = '0px'),
              (this._dialog.style.width = '100%'),
              (this._dialog.style.height = '100%'),
              (this._dialog.style.transform = 'none'),
              s)
            ) {
              const { left: e, top: t, width: i, height: n } = s
              ;(this._dialog.style.transform = `translate(${Math.round(e)}px, ${Math.round(t)}px)`),
                i &&
                  ((this._dialog.style.width = `${i}px`),
                  (this._dialog.style.minWidth = 'unset')),
                n &&
                  ((this._dialog.style.height = `${n}px`),
                  (this._dialog.style.minHeight = 'unset'))
            }
          } else if (s) {
            const { left: e, top: t } = s
            this._dialog.style.transform = `translate(${Math.round(e)}px, ${Math.round(t)}px)`
          } else {
            ;(this._dialog.style.width = ''), (this._dialog.style.height = '')
            const s = this._dialog.getBoundingClientRect(),
              n = t - 2 * i,
              o = _(s.left, s.width, 0, e),
              r = _(s.top, s.height, i, t)
            ;(this._dialog.style.top = '0px'),
              (this._dialog.style.left = '0px'),
              (this._dialog.style.transform = `translate(${Math.round(o)}px, ${Math.round(r)}px)`),
              (this._dialog.style.height =
                n < s.height ? n + 'px' : this._initialHeight)
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
      class N extends s.PureComponent {
        constructor(e) {
          super(e),
            (this._dialog = null),
            (this._cleanUpFunctions = []),
            (this._prevActiveElement = null),
            (this._eventDispatcher = new M()),
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
          return s.createElement(
            D.PopupContext.Provider,
            { value: this },
            s.createElement(
              p.OutsideEvent,
              {
                mouseDown: !0,
                touchStart: !0,
                handler: this.props.onClickOutside,
              },
              (e) =>
                s.createElement(
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
                  s.createElement(
                    d,
                    {
                      style: this._applyAnimationCSSVariables(),
                      ...this.props,
                      reference: this._handleDialogRef,
                      className: n(
                        T.dialog,
                        (0, k.isOnMobileAppPage)('any') &&
                          !this.props.noMobileAppShadows &&
                          T.mobile,
                        this.props.fullscreen && T.fullscreen,
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
          const { draggable: e, boundByScreen: t, onDragStart: i } = this.props,
            s = (0, o.ensureNotNull)(this._dialog)
          if ((this._eventDispatcher.dispatch('dialog-open'), e)) {
            const e = s.querySelector('[data-dragg-area]')
            if (e && e instanceof HTMLElement) {
              const n = new w(s, e, {
                boundByScreen: Boolean(t),
                onDragStart: i,
              })
              this._cleanUpFunctions.push(() => n.destroy()), (this._drag = n)
            }
          }
          this.props.autofocus &&
            !s.contains(document.activeElement) &&
            s.focus(),
            (this._isFullScreen() || this.props.fixedBody) &&
              (0, S.setFixedBodyState)(!0)
          const { guard: n, calculateDialogPosition: r } = this.props
          if (this.props.resizeHandler) this._resize = this.props.resizeHandler
          else {
            const e = new B(s, { guard: n, calculateDialogPosition: r })
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
            if (this.props.onForceFocus) return void this.props.onForceFocus(s)
            s.focus()
          }
          if (!s.contains(document.activeElement)) {
            const e = ((e) => {
              const t = e.querySelector('[autofocus]:not([disabled])')
              if (t) return t
              if (e.tabIndex >= 0) return e
              const i = (0, m.getActiveElementSelectors)(),
                s = Array.from(e.querySelectorAll(i)).filter(
                  (0, m.createScopedVisibleElementFilter)(e),
                )
              let n = Number.NEGATIVE_INFINITY,
                o = null
              for (let e = 0; e < s.length; e++) {
                const t = s[e],
                  i = t.getAttribute('tabindex')
                if (null !== i) {
                  const e = Number.parseInt(i, 10)
                  !isNaN(e) && e > n && ((n = e), (o = t))
                }
              }
              return o
            })(s)
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
            (0, S.setFixedBodyState)(!1),
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
            const { x: t, y: i } = e,
              { x: s, y: n } = this._resize.getDialogsTopLeftCoordinates()
            this._dialog.style.setProperty(
              '--animationTranslateStartX',
              `${t}px`,
            ),
              this._dialog.style.setProperty(
                '--animationTranslateStartY',
                `${i}px`,
              ),
              this._dialog.style.setProperty(
                '--animationTranslateEndX',
                `${s}px`,
              ),
              this._dialog.style.setProperty(
                '--animationTranslateEndY',
                `${n}px`,
              ),
              this._dialog.classList.add(T.dialogAnimatedAppearance)
          }
        }
        _handleTooltipFit() {
          0
        }
        _isFullScreen() {
          return Boolean(this.props.fullscreen)
        }
      }
      ;(N.contextType = E.PortalContext),
        (N.defaultProps = {
          boundByScreen: !0,
          draggable: !0,
          centeredOnMount: !0,
          shouldReturnFocus: !0,
        })
      const P = (0, u.makeOverlapable)(N, !0)
    },
    1109: (e, t, i) => {
      i.d(t, { Separator: () => r })
      var s = i(50959),
        n = i(97754),
        o = i(36204)
      function r(e) {
        return s.createElement('div', {
          className: n(o.separator, e.className),
        })
      }
    },
    86431: (e, t, i) => {
      i.d(t, { makeOverlapable: () => o })
      var s = i(50959),
        n = i(42842)
      function o(e, t) {
        return class extends s.PureComponent {
          render() {
            const { isOpened: i, root: o } = this.props
            if (!i) return null
            const r = s.createElement(e, {
              ...this.props,
              ref: this.props.componentRef,
              zIndex: 150,
            })
            return 'parent' === o
              ? r
              : s.createElement(n.Portal, { shouldTrapFocus: t }, r)
          }
        }
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
