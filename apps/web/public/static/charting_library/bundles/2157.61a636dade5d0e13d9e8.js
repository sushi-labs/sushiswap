;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2157],
  {
    59142: (e, t) => {
      var n, o, s
      ;(o = [t]),
        (n = (e) => {
          function t(e) {
            if (Array.isArray(e)) {
              for (var t = 0, n = Array(e.length); t < e.length; t++)
                n[t] = e[t]
              return n
            }
            return Array.from(e)
          }
          Object.defineProperty(e, '__esModule', { value: !0 })
          var n = !1
          if ('undefined' != typeof window) {
            var o = {
              get passive() {
                n = !0
              },
            }
            window.addEventListener('testPassive', null, o),
              window.removeEventListener('testPassive', null, o)
          }
          var s =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            r = [],
            a = !1,
            i = -1,
            l = void 0,
            c = void 0,
            u = (e) =>
              r.some(
                (t) =>
                  !(!t.options.allowTouchMove || !t.options.allowTouchMove(e)),
              ),
            d = (e) => {
              var t = e || window.event
              return (
                !!u(t.target) ||
                1 < t.touches.length ||
                (t.preventDefault && t.preventDefault(), !1)
              )
            },
            h = () => {
              setTimeout(() => {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== l &&
                    ((document.body.style.overflow = l), (l = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, o) => {
            if (s) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !r.some((t) => t.targetElement === e)) {
                var h = { targetElement: e, options: o || {} }
                ;(r = [].concat(t(r), [h])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (i = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var n, o, s, r
                    1 === t.targetTouches.length &&
                      ((o = e),
                      (r = (n = t).targetTouches[0].clientY - i),
                      !u(n.target) &&
                        ((o && 0 === o.scrollTop && 0 < r) ||
                        ((s = o) &&
                          s.scrollHeight - s.scrollTop <= s.clientHeight &&
                          r < 0)
                          ? d(n)
                          : n.stopPropagation()))
                  }),
                  a ||
                    (document.addEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (a = !0))
              }
            } else {
              ;(p = o),
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
              var m = { targetElement: e, options: o || {} }
              r = [].concat(t(r), [m])
            }
            var p
          }),
            (e.clearAllBodyScrollLocks = () => {
              s
                ? (r.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  a &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (a = !1)),
                  (r = []),
                  (i = -1))
                : (h(), (r = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (s) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (r = r.filter((t) => t.targetElement !== e)),
                  a &&
                    0 === r.length &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (a = !1))
              } else
                1 === r.length && r[0].targetElement === e
                  ? (h(), (r = []))
                  : (r = r.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (s = 'function' == typeof n ? n.apply(t, o) : n) ||
          (e.exports = s)
    },
    11362: (e) => {
      e.exports = {
        wrapper: 'wrapper-GZajBGIm',
        input: 'input-GZajBGIm',
        view: 'view-GZajBGIm',
        danger: 'danger-GZajBGIm',
      }
    },
    4052: (e) => {
      e.exports = {
        box: 'box-ywH2tsV_',
        noOutline: 'noOutline-ywH2tsV_',
        disabled: 'disabled-ywH2tsV_',
        'intent-danger': 'intent-danger-ywH2tsV_',
        checked: 'checked-ywH2tsV_',
        check: 'check-ywH2tsV_',
        icon: 'icon-ywH2tsV_',
        dot: 'dot-ywH2tsV_',
        disableActiveStyles: 'disableActiveStyles-ywH2tsV_',
      }
    },
    4665: (e) => {
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
    36110: (e) => {
      e.exports = { accessible: 'accessible-rm8yeqY4' }
    },
    22846: (e) => {
      e.exports = {
        loaderWrap: 'loaderWrap-jGEARQlM',
        big: 'big-jGEARQlM',
        loader: 'loader-jGEARQlM',
      }
    },
    31668: (e) => {
      e.exports = {
        item: 'item-GJX1EXhk',
        interactive: 'interactive-GJX1EXhk',
        hovered: 'hovered-GJX1EXhk',
        disabled: 'disabled-GJX1EXhk',
        active: 'active-GJX1EXhk',
        shortcut: 'shortcut-GJX1EXhk',
        normal: 'normal-GJX1EXhk',
        big: 'big-GJX1EXhk',
        iconCell: 'iconCell-GJX1EXhk',
        icon: 'icon-GJX1EXhk',
        content: 'content-GJX1EXhk',
        label: 'label-GJX1EXhk',
        checked: 'checked-GJX1EXhk',
        toolbox: 'toolbox-GJX1EXhk',
        showToolboxOnHover: 'showToolboxOnHover-GJX1EXhk',
        arrowIcon: 'arrowIcon-GJX1EXhk',
        subMenu: 'subMenu-GJX1EXhk',
        invisibleHotkey: 'invisibleHotkey-GJX1EXhk',
      }
    },
    21320: (e) => {
      e.exports = {
        row: 'row-DFIg7eOh',
        line: 'line-DFIg7eOh',
        hint: 'hint-DFIg7eOh',
      }
    },
    37399: (e) => {
      e.exports = { menu: 'menu-Tx5xMZww' }
    },
    70159: (e) => {
      e.exports = {
        item: 'item-WJDah4zD',
        emptyIcons: 'emptyIcons-WJDah4zD',
        loading: 'loading-WJDah4zD',
        disabled: 'disabled-WJDah4zD',
        interactive: 'interactive-WJDah4zD',
        hovered: 'hovered-WJDah4zD',
        normal: 'normal-WJDah4zD',
        big: 'big-WJDah4zD',
        icon: 'icon-WJDah4zD',
        label: 'label-WJDah4zD',
        title: 'title-WJDah4zD',
        nested: 'nested-WJDah4zD',
        shortcut: 'shortcut-WJDah4zD',
        remove: 'remove-WJDah4zD',
      }
    },
    20669: (e) => {
      e.exports = { separator: 'separator-Ymxd0dt_' }
    },
    36718: (e) => {
      e.exports = {
        'default-drawer-min-top-distance': '100px',
        wrap: 'wrap-_HnK0UIN',
        positionBottom: 'positionBottom-_HnK0UIN',
        backdrop: 'backdrop-_HnK0UIN',
        drawer: 'drawer-_HnK0UIN',
        positionLeft: 'positionLeft-_HnK0UIN',
      }
    },
    22413: (e) => {
      e.exports = {
        favorite: 'favorite-_FRQhM5Y',
        hovered: 'hovered-_FRQhM5Y',
        disabled: 'disabled-_FRQhM5Y',
        focused: 'focused-_FRQhM5Y',
        active: 'active-_FRQhM5Y',
        checked: 'checked-_FRQhM5Y',
      }
    },
    35990: (e) => {
      e.exports = {
        button: 'button-iLKiGOdQ',
        hovered: 'hovered-iLKiGOdQ',
        disabled: 'disabled-iLKiGOdQ',
        focused: 'focused-iLKiGOdQ',
        active: 'active-iLKiGOdQ',
        hidden: 'hidden-iLKiGOdQ',
      }
    },
    70673: (e, t, n) => {
      n.d(t, { CheckboxInput: () => c })
      var o = n(50959),
        s = n(97754),
        r = n(90186),
        a = n(5811),
        i = n(11362),
        l = n.n(i)
      function c(e) {
        const t = s(l().wrapper, e.className)
        return o.createElement(
          'span',
          { className: t, title: e.title, style: e.style },
          o.createElement('input', {
            id: e.id,
            tabIndex: e.tabIndex,
            className: s(e.intent && l()[e.intent], l().input),
            type: 'checkbox',
            name: e.name,
            checked: e.checked,
            disabled: e.disabled,
            value: e.value,
            autoFocus: e.autoFocus,
            role: e.role,
            onChange: () => {
              e.onChange?.(e.value)
            },
            ref: e.reference,
            'aria-required': e['aria-required'],
            'aria-describedby': e['aria-describedby'],
            'aria-invalid': e['aria-invalid'],
            ...(0, r.filterDataProps)(e),
          }),
          o.createElement(a.CheckboxView, {
            className: l().view,
            indeterminate: e.indeterminate,
            checked: e.checked,
            disabled: e.disabled,
            intent: e.intent,
            tabIndex: e.tabIndex,
          }),
        )
      }
    },
    5811: (e, t, n) => {
      n.d(t, { CheckboxView: () => c })
      var o = n(50959),
        s = n(97754),
        r = n(9745),
        a = n(65890),
        i = n(4052),
        l = n.n(i)
      function c(e) {
        const {
            indeterminate: t,
            checked: n,
            tabIndex: i,
            className: c,
            disabled: u,
            disableActiveStyles: d,
            intent: h,
            hideIcon: m,
            ...p
          } = e,
          v = t || !n || m ? '' : a,
          b = s(
            l().box,
            l()[`intent-${h}`],
            !t && l().check,
            !!t && l().dot,
            -1 === i && l().noOutline,
            c,
            n && l().checked,
            u && l().disabled,
            d && l().disableActiveStyles,
          )
        return o.createElement(
          'span',
          { className: b, ...p },
          o.createElement(r.Icon, { icon: v, className: l().icon }),
        )
      }
    },
    26996: (e, t, n) => {
      n.d(t, { Loader: () => l })
      var o,
        s = n(50959),
        r = n(97754),
        a = n(4665),
        i = n.n(a)
      function l(e) {
        const {
            className: t,
            size: n = 'medium',
            staticPosition: o,
            color: a = 'black',
          } = e,
          l = r(i().item, i()[a], i()[n])
        return s.createElement(
          'span',
          { className: r(i().loader, o && i().static, t) },
          s.createElement('span', { className: l }),
          s.createElement('span', { className: l }),
          s.createElement('span', { className: l }),
        )
      }
      !((e) => {
        ;(e.Medium = 'medium'), (e.Small = 'small')
      })(o || (o = {}))
    },
    74670: (e, t, n) => {
      n.d(t, { useActiveDescendant: () => r })
      var o = n(50959),
        s = n(39416)
      function r(e, t = []) {
        const [n, r] = (0, o.useState)(!1),
          a = (0, s.useFunctionalRefObject)(e)
        return (
          (0, o.useLayoutEffect)(() => {
            const e = a.current
            if (null === e) return
            const t = (e) => {
              switch (e.type) {
                case 'active-descendant-focus':
                  r(!0)
                  break
                case 'active-descendant-blur':
                  r(!1)
              }
            }
            return (
              e.addEventListener('active-descendant-focus', t),
              e.addEventListener('active-descendant-blur', t),
              () => {
                e.removeEventListener('active-descendant-focus', t),
                  e.removeEventListener('active-descendant-blur', t)
              }
            )
          }, t),
          [a, n]
        )
      }
    },
    50238: (e, t, n) => {
      n.d(t, { useRovingTabindexElement: () => r })
      var o = n(50959),
        s = n(39416)
      function r(e, t = []) {
        const [n, r] = (0, o.useState)(!1),
          a = (0, s.useFunctionalRefObject)(e)
        return (
          (0, o.useLayoutEffect)(() => {
            const e = a.current
            if (null === e) return
            const t = (e) => {
              switch (e.type) {
                case 'roving-tabindex:main-element':
                  r(!0)
                  break
                case 'roving-tabindex:secondary-element':
                  r(!1)
              }
            }
            return (
              e.addEventListener('roving-tabindex:main-element', t),
              e.addEventListener('roving-tabindex:secondary-element', t),
              () => {
                e.removeEventListener('roving-tabindex:main-element', t),
                  e.removeEventListener('roving-tabindex:secondary-element', t)
              }
            )
          }, t),
          [a, n ? 0 : -1]
        )
      }
    },
    10772: (e, t, n) => {
      n.d(t, { ContextMenuAction: () => x })
      var o = n(50959),
        s = n(50151),
        r = n(91561),
        a = n(59064),
        i = n(51768),
        l = n(63273)
      var c = n(83021),
        u = n(97754),
        d = n.n(u),
        h = n(26996),
        m = n(5304),
        p = n(22846)
      function v(e) {
        const { size: t = 'normal' } = e
        return o.createElement(m.ContextMenuItem, {
          size: t,
          jsxLabel: o.createElement(
            'div',
            { className: d()(p.loaderWrap, p[t]) },
            o.createElement(h.Loader, { className: p.loader }),
          ),
          noInteractive: !0,
          onMouseOver: e.onMouseOver,
        })
      }
      var b = n(3343),
        f = n(50238),
        E = n(36110)
      const g = (0, o.forwardRef)((e, t) => {
        const { className: n, ...s } = e,
          [r, a] = (0, f.useRovingTabindexElement)(t)
        return o.createElement(m.ContextMenuItem, {
          ...s,
          className: d()(E.accessible, n),
          reference: r,
          tabIndex: a,
          onKeyDown: (e) => {
            if (e.target !== e.currentTarget) return
            const t = (0, b.hashFromEvent)(e)
            ;(13 !== t && 32 !== t) ||
              (e.preventDefault(),
              r.current instanceof HTMLElement && r.current.click())
          },
          'data-role': 'menuitem',
          'aria-disabled': e.disabled || void 0,
        })
      })
      var w = n(90186)
      class x extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._itemRef = null),
            (this._menuElementRef = o.createRef()),
            (this._menuRef = null),
            (this._handleClick = (e) => {
              e.isDefaultPrevented() ||
                this.state.disabled ||
                (this._hasSubItems()
                  ? this._showSubMenu()
                  : (this.state.doNotCloseOnClick || (0, a.globalCloseMenu)(),
                    this.props.action.execute(),
                    this._trackEvent(),
                    this.props.onExecute &&
                      this.props.onExecute(this.props.action)))
            }),
            (this._handleClickToolbox = () => {
              ;(0, a.globalCloseMenu)()
            }),
            (this._handleItemMouseOver = () => {
              this._showSubMenu(), this._setCurrentContextValue()
            }),
            (this._handleMenuMouseOver = () => {
              this._setCurrentContextValue()
            }),
            (this._showSubMenu = () => {
              this.props.onShowSubMenu(this.props.action)
            }),
            (this._calcSubMenuPos = (e) =>
              ((e, t, n = { x: 0, y: 10 }) => {
                if (t) {
                  const {
                      left: n,
                      right: o,
                      top: s,
                    } = t.getBoundingClientRect(),
                    r = document.documentElement.clientWidth,
                    a = { x: n - e, y: s },
                    i = { x: o, y: s }
                  return (0, l.isRtl)() ? (n <= e ? i : a) : r - o >= e ? i : a
                }
                return n
              })(e.contentWidth, this._itemRef)),
            (this._updateState = (e) => {
              this.setState(e.getState())
            }),
            (this._setItemRef = (e) => {
              this._itemRef = e
            }),
            (this._handleMenuRef = (e) => {
              this._menuRef = e
            }),
            (this._registerSubmenu = () =>
              this.context?.registerSubmenu(
                this.props.action.id,
                (e) =>
                  (0, s.ensureNotNull)(this._itemRef).contains(e) ||
                  (null !== this._menuElementRef.current &&
                    this._menuElementRef.current.contains(e)),
              )),
            (this.state = { ...this.props.action.getState() })
        }
        componentDidMount() {
          this.props.action.onUpdate().subscribe(this, this._updateState),
            this.state.subItems.length &&
              (this._unsubscribe = this._registerSubmenu()),
            this.props.reference &&
              (this._itemRef = this.props.reference.current)
        }
        componentDidUpdate(e, t) {
          t.loading !== this.state.loading && this.props.onRequestUpdate?.(),
            0 === t.subItems.length &&
              this.state.subItems.length > 0 &&
              (this._unsubscribe = this._registerSubmenu()),
            t.subItems.length > 0 &&
              0 === this.state.subItems.length &&
              this._unsubscribe?.(),
            t.subItems !== this.state.subItems &&
              null !== this._menuRef &&
              this._menuRef.update()
        }
        componentWillUnmount() {
          this.props.action.onUpdate().unsubscribe(this, this._updateState),
            this._unsubscribe && this._unsubscribe()
        }
        render() {
          const e = this.context?.current
            ? this.context.current === this.props.action.id
            : this.props.isSubMenuOpened
          return this.state.loading
            ? o.createElement(v, { size: this.state.size })
            : o.createElement(
                g,
                {
                  ...(0, w.filterDataProps)(this.props),
                  theme: this.props.theme,
                  ref: this.props.reference ?? this._setItemRef,
                  onClick: this._handleClick,
                  onClickToolbox: this._handleClickToolbox,
                  onMouseOver: this._handleItemMouseOver,
                  hovered: e,
                  hasSubItems: this._hasSubItems(),
                  actionName: this.state.name,
                  checkboxInput: this.props.checkboxInput,
                  selected: this.props.selected,
                  className: this.props.className,
                  ...this.state,
                },
                o.createElement(r.ContextMenu, {
                  isOpened: e,
                  items: this.state.subItems,
                  position: this._calcSubMenuPos,
                  menuStatName: this.props.menuStatName,
                  parentStatName: this._getStatName(),
                  menuElementReference: this._menuElementRef,
                  onMouseOver: this.state.subItems.length
                    ? this._handleMenuMouseOver
                    : void 0,
                  ref: this._handleMenuRef,
                }),
              )
        }
        _setCurrentContextValue() {
          this.state.subItems.length &&
            this.context?.setCurrent(this.props.action.id)
        }
        _hasSubItems() {
          return this.state.subItems.length > 0
        }
        _trackEvent() {
          const e = this._getStatName()
          ;(0, i.trackEvent)(
            'ContextMenuClick',
            this.props.menuStatName || '',
            e,
          )
        }
        _getStatName() {
          return [this.props.parentStatName, this.state.statName]
            .filter((e) => Boolean(e))
            .join('.')
        }
      }
      x.contextType = c.SubmenuContext
    },
    5304: (e, t, n) => {
      n.d(t, {
        ContextMenuItem: () => w,
        DEFAUL_CONTEXT_MENU_ITEM_THEME: () => E,
      })
      var o = n(50959),
        s = n(97754),
        r = n(70673),
        a = n(49483),
        i = n(71382),
        l = n(96040),
        c = n(36189),
        u = n(99025),
        d = n(25812),
        h = n(56570),
        m = n(90186),
        p = n(60925),
        v = n(60004),
        b = n(14665),
        f = n(31668)
      const E = f,
        g = h.enabled('items_favoriting')
      class w extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._handleMouseOver = (e) => {
              ;(0, i.isTouchEvent)(e.nativeEvent) ||
                (this.props.onMouseOver && this.props.onMouseOver())
            }),
            (this._handleClickToolbox = (e) => {
              e.stopPropagation(),
                this.props.onClickToolbox && this.props.onClickToolbox()
            })
        }
        render() {
          const {
              hasSubItems: e,
              shortcutHint: t,
              hint: n,
              invisibleHotkey: r,
              favourite: i,
              theme: l = f,
              size: d = 'normal',
              onKeyDown: h,
              label: p,
              jsxLabel: v,
              styledLabel: E,
            } = this.props,
            w =
              this.props.checkable && this.props.checkboxInput ? 'label' : 'div'
          return o.createElement(
            o.Fragment,
            null,
            o.createElement(
              'tr',
              {
                ...(0, m.filterDataProps)(this.props),
                ...(0, m.filterAriaProps)(this.props),
                id: this.props.id,
                className: s(
                  this.props.className,
                  l.item,
                  !this.props.noInteractive && l.interactive,
                  this.props.hovered && l.hovered,
                  this.props.disabled && l.disabled,
                  this.props.active && l.active,
                  this.props.selected && l.selected,
                  l[d],
                ),
                onClick: this.props.onClick,
                onMouseOver: this._handleMouseOver,
                ref: this.props.reference,
                'data-action-name': this.props.actionName,
                tabIndex: this.props.tabIndex,
                onKeyDown: h,
              },
              g &&
                void 0 !== i &&
                o.createElement(
                  'td',
                  { className: l.favoriteActionCell },
                  o.createElement(c.FavoriteButton, {
                    id: `${this.props.id}-favorite`,
                    className: l.favourite,
                    isFilled: i,
                    onClick: this.props.onFavouriteClick,
                    'data-role': 'list-item-action',
                  }),
                ),
              o.createElement(
                'td',
                { className: s(l.iconCell), 'data-icon-cell': !0 },
                this._icon(l),
              ),
              o.createElement(
                'td',
                { className: l.contentCell },
                o.createElement(
                  w,
                  { className: l.content },
                  o.createElement(
                    'span',
                    {
                      className: s(l.label, this.props.checked && l.checked),
                      'data-label': !0,
                    },
                    !v && E
                      ? E.map(({ text: e, ...t }, n) =>
                          o.createElement('span', { key: n, style: t }, e),
                        )
                      : (v ?? p),
                  ),
                  this._toolbox(l),
                  e &&
                    o.createElement('span', {
                      className: l.arrowIcon,
                      dangerouslySetInnerHTML: { __html: b },
                      'data-submenu-arrow': !0,
                    }),
                  !e &&
                    t &&
                    !a.CheckMobile.any() &&
                    o.createElement(u.Hint, {
                      className: s(r && l.invisibleHotkey),
                      text: t,
                    }),
                  !e && !t && n && o.createElement(u.Hint, { text: n }),
                ),
              ),
            ),
            o.createElement(
              'tr',
              { className: l.subMenu },
              o.createElement('td', null, this.props.children),
            ),
          )
        }
        _icon(e) {
          if (this.props.checkable) {
            if (this.props.checkboxInput)
              return o.createElement(r.CheckboxInput, {
                className: s(e.icon, e.checkboxInput),
                checked: this.props.checked,
              })
            if (this.props.checked) {
              const t = !this.props.icon && !this.props.iconChecked,
                n = this.props.iconChecked || this.props.icon || v
              return o.createElement('span', {
                className: e.icon,
                dangerouslySetInnerHTML: { __html: n },
                'data-icon-checkmark': t,
              })
            }
            return this.props.icon
              ? o.createElement('span', {
                  className: e.icon,
                  dangerouslySetInnerHTML: { __html: this.props.icon },
                })
              : o.createElement('span', { className: e.icon })
          }
          return this.props.icon
            ? o.createElement('span', {
                className: e.icon,
                dangerouslySetInnerHTML: { __html: this.props.icon },
              })
            : null
        }
        _toolbox(e) {
          return this.props.toolbox
            ? o.createElement(
                'span',
                {
                  className: s(
                    e.toolbox,
                    this.props.showToolboxOnHover && e.showToolboxOnHover,
                  ),
                  onClick: this._handleClickToolbox,
                  'data-toolbox': !0,
                },
                this._renderToolboxContent(),
              )
            : null
        }
        _renderToolboxContent() {
          return this.props.toolbox &&
            this.props.toolbox.type === d.ToolboxType.Delete
            ? o.createElement(l.RemoveButton, {
                icon: p,
                onClick: this.props.toolbox.action,
              })
            : null
        }
      }
    },
    91561: (e, t, n) => {
      n.d(t, { ContextMenu: () => _, OverlapContextMenu: () => M })
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        a = n(86431),
        i = n(27317),
        l = n(52778)
      class c extends o.PureComponent {
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
      var u = n(75535),
        d = n(37558),
        h = n(90692),
        m = n(20669)
      function p(e) {
        return o.createElement('li', { className: m.separator })
      }
      var v = n(23829),
        b = n(41590),
        f = n(59064)
      function E(e) {
        const t = e.action.custom() ?? e.action,
          [n, s] = (0, o.useState)(() => t.getState()),
          [r, a] = (0, o.useState)(!1),
          i = !!n.subItems.length,
          l = i && r
        return (
          (0, o.useEffect)(() => {
            const e = () => s(t.getState())
            return (
              t.onUpdate().subscribe(null, e),
              () => {
                t.onUpdate().unsubscribe(null, e)
              }
            )
          }, []),
          o.createElement(
            v.ContextMenuItem,
            {
              ...n,
              onClick: (e) => {
                if (n.disabled || e.defaultPrevented) return
                if (i) return void a(!0)
                n.doNotCloseOnClick || (0, f.globalCloseMenu)()
                t.execute()
              },
              isLoading: n.loading,
              isHovered: l,
            },
            l &&
              o.createElement(
                b.Drawer,
                { onClose: c },
                o.createElement(x, {
                  items: n.subItems,
                  parentAction: t,
                  closeNested: c,
                }),
              ),
          )
        )
        function c(e) {
          e && e.preventDefault(), a(!1)
        }
      }
      var g = n(54627),
        w = n(66493)
      function x(e) {
        const { items: t, parentAction: n, closeNested: s } = e,
          r =
            !Boolean(n) &&
            t.every(
              (e) =>
                !Boolean(
                  'separator' !== e.type &&
                    (e.getState().icon || e.getState().checkable),
                ),
            )
        return o.createElement(
          g.EmptyIconsContext.Provider,
          { value: r },
          o.createElement(
            'ul',
            null,
            n &&
              o.createElement(
                o.Fragment,
                null,
                o.createElement(v.ContextMenuItem, {
                  label: n.getState().label,
                  isTitle: !0,
                  active: !1,
                  disabled: !1,
                  subItems: [],
                  checkable: !1,
                  checked: !1,
                  doNotCloseOnClick: !1,
                  icon: w,
                  onClick: s,
                }),
                o.createElement(p, null),
              ),
            t.map((e) => {
              switch (e.type) {
                case 'action':
                  return o.createElement(E, { key: e.id, action: e })
                case 'separator':
                  return o.createElement(p, { key: e.id })
              }
            }),
          ),
        )
      }
      const k = o.createContext(null)
      var y = n(20243),
        C = n(37399)
      class _ extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._menuRef = o.createRef()),
            (this._handleRequestUpdate = () => {
              this.update()
            }),
            (this._handleClose = () => {
              this.props.onClose && this.props.onClose()
            }),
            (this._handleOutsideClickClose = (e) => {
              const { doNotCloseOn: t, onClose: n } = this.props
              !n || (void 0 !== t && t.contains(e.target)) || n()
            }),
            (this._handleFocusOnOpen = () => {
              this.props.menuElementReference?.current &&
                this.props.takeFocus &&
                this.props.menuElementReference?.current.focus({
                  preventScroll: !0,
                })
            }),
            (this._handleFocus = (e) => {
              this.props.isKeyboardEvent &&
                e.target &&
                (0, y.focusFirstMenuItem)(e.target)
            }),
            (this.state = {})
        }
        render() {
          const {
            isOpened: e,
            onClose: t,
            items: n,
            doNotCloseOn: s,
            menuStatName: a,
            parentStatName: m,
            takeFocus: p,
            ...v
          } = this.props
          return e && n.length > 0
            ? o.createElement(
                d.DrawerManager,
                null,
                o.createElement(c, {
                  keyCode: 27,
                  eventType: 'keyup',
                  handler: this._handleClose,
                }),
                o.createElement(
                  h.MatchMedia,
                  { rule: '(max-width: 440px)' },
                  (t) =>
                    this._isDrawer(t)
                      ? o.createElement(
                          k.Provider,
                          { value: { type: 'drawer' } },
                          o.createElement(
                            b.Drawer,
                            {
                              onClose: this._handleClose,
                              position: 'Bottom',
                              'data-name': v['data-name'],
                            },
                            o.createElement(x, { items: n }),
                          ),
                        )
                      : o.createElement(
                          k.Provider,
                          { value: { type: 'menu' } },
                          o.createElement(
                            l.OutsideEvent,
                            {
                              handler: this._handleOutsideClickClose,
                              mouseDown: !0,
                              touchStart: !0,
                              reference: this.props.menuElementReference,
                            },
                            (t) =>
                              o.createElement(
                                i.Menu,
                                {
                                  ...v,
                                  reference: t,
                                  className: r()(C.menu, 'context-menu'),
                                  onClose: this._handleClose,
                                  noMomentumBasedScroll: !0,
                                  ref: this._menuRef,
                                  tabIndex: p ? -1 : void 0,
                                  onOpen: this._handleFocusOnOpen,
                                  onFocus: this._handleFocus,
                                  onKeyDown: y.handleAccessibleMenuKeyDown,
                                },
                                o.createElement(u.ActionsTable, {
                                  items: n,
                                  menuStatName: a,
                                  parentStatName: m,
                                  parentIsOpened: e,
                                  onRequestUpdate: this._handleRequestUpdate,
                                }),
                              ),
                          ),
                        ),
                ),
              )
            : null
        }
        update() {
          this._menuRef.current && this._menuRef.current.update(),
            this.props.isKeyboardEvent &&
              this.props.menuElementReference?.current &&
              document.activeElement ===
                this.props.menuElementReference.current &&
              (0, y.focusFirstMenuItem)(this.props.menuElementReference.current)
        }
        _isDrawer(e) {
          return void 0 === this.props.mode ? e : 'drawer' === this.props.mode
        }
      }
      const M = (0, a.makeOverlapable)(_)
    },
    99025: (e, t, n) => {
      n.d(t, { Hint: () => i })
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        a = n(31668)
      function i(e) {
        const { text: t = '', className: n } = e
        return o.createElement('span', { className: r()(a.shortcut, n) }, t)
      }
    },
    23829: (e, t, n) => {
      n.d(t, { ContextMenuItem: () => p })
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        a = n(9745),
        i = n(26996),
        l = n(54627),
        c = n(99025),
        u = n(39750),
        d = n(79978),
        h = n(60925),
        m = n(70159)
      function p(e) {
        const {
            className: t,
            isTitle: n,
            isLoading: s,
            isHovered: p,
            active: v,
            checkable: b,
            disabled: f,
            checked: E,
            icon: g,
            iconChecked: w,
            hint: x,
            subItems: k,
            label: y,
            styledLabel: C,
            onClick: _,
            children: M,
            toolbox: S,
            jsxLabel: N,
            size: I = 'normal',
          } = e,
          D = (0, o.useContext)(l.EmptyIconsContext),
          L = !!k.length
        return s
          ? o.createElement(
              'li',
              { className: r()(t, m.item, m.loading, m[I]) },
              o.createElement(i.Loader, null),
            )
          : o.createElement(
              'li',
              {
                className: r()(
                  t,
                  m.item,
                  m.interactive,
                  n && m.title,
                  f && m.disabled,
                  p && m.hovered,
                  v && m.active,
                  D && m.emptyIcons,
                  m[I],
                ),
                onClick: _,
              },
              o.createElement(a.Icon, {
                className: r()(m.icon),
                icon: (() => {
                  if (b && E) return w || g || u
                  return g
                })(),
              }),
              o.createElement(
                'span',
                { className: r()(m.label) },
                !N && C
                  ? C.map(({ text: e, ...t }, n) =>
                      o.createElement('span', { key: n, style: t }, e),
                    )
                  : (N ?? y),
              ),
              !!S &&
                o.createElement(a.Icon, {
                  onClick: () => {
                    S && S.action()
                  },
                  className: m.remove,
                  icon: h,
                }),
              !L &&
                x &&
                o.createElement(c.Hint, { className: m.shortcut, text: x }),
              L && o.createElement(a.Icon, { className: m.nested, icon: d }),
              M,
            )
      }
    },
    54627: (e, t, n) => {
      n.d(t, { EmptyIconsContext: () => o })
      const o = n(50959).createContext(!1)
    },
    37558: (e, t, n) => {
      n.d(t, { DrawerContext: () => a, DrawerManager: () => r })
      var o = n(50959),
        s = n(99054)
      class r extends o.PureComponent {
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
            ((0, s.setFixedBodyState)(!0), (this._isBodyFixed = !0)),
            t.stack.length &&
              !this.state.stack.length &&
              this._isBodyFixed &&
              ((0, s.setFixedBodyState)(!1), (this._isBodyFixed = !1))
        }
        componentWillUnmount() {
          this.state.stack.length &&
            this._isBodyFixed &&
            (0, s.setFixedBodyState)(!1)
        }
        render() {
          return o.createElement(
            a.Provider,
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
      const a = o.createContext(null)
    },
    41590: (e, t, n) => {
      n.d(t, { Drawer: () => m })
      var o = n(50959),
        s = n(50151),
        r = n(97754),
        a = n(92184),
        i = n(42842),
        l = n(37558),
        c = n(29197),
        u = n(86656),
        d = n(36718)
      var h
      function m(e) {
        const {
            position: t = 'Bottom',
            onClose: n,
            children: u,
            reference: h,
            className: m,
            theme: v = d,
          } = e,
          b = (0, s.ensureNotNull)((0, o.useContext)(l.DrawerContext)),
          [f] = (0, o.useState)(() => (0, a.randomHash)()),
          E = (0, o.useRef)(null),
          g = (0, o.useContext)(c.CloseDelegateContext)
        return (
          (0, o.useLayoutEffect)(
            () => (
              (0, s.ensureNotNull)(E.current).focus({ preventScroll: !0 }),
              g.subscribe(b, n),
              b.addDrawer(f),
              () => {
                b.removeDrawer(f), g.unsubscribe(b, n)
              }
            ),
            [],
          ),
          o.createElement(
            i.Portal,
            null,
            o.createElement(
              'div',
              { ref: h, className: r(d.wrap, d[`position${t}`]) },
              f === b.currentDrawer &&
                o.createElement('div', { className: d.backdrop, onClick: n }),
              o.createElement(
                p,
                {
                  className: r(v.drawer, d[`position${t}`], m),
                  ref: E,
                  'data-name': e['data-name'],
                },
                u,
              ),
            ),
          )
        )
      }
      !((e) => {
        ;(e.Left = 'Left'), (e.Bottom = 'Bottom')
      })(h || (h = {}))
      const p = (0, o.forwardRef)((e, t) => {
        const { className: n, ...s } = e
        return o.createElement(u.TouchScrollContainer, {
          className: r(d.drawer, n),
          tabIndex: -1,
          ref: t,
          ...s,
        })
      })
    },
    71402: (e, t, n) => {
      n.d(t, { RemoveTitleType: () => o, removeTitlesMap: () => r })
      var o,
        s = n(11542)
      !((e) => {
        ;(e.Add = 'add'), (e.Remove = 'remove')
      })(o || (o = {}))
      const r = {
        [o.Add]: s.t(null, void 0, n(69207)),
        [o.Remove]: s.t(null, void 0, n(85106)),
      }
    },
    36189: (e, t, n) => {
      n.d(t, { FavoriteButton: () => h })
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        a = n(9745),
        i = n(71402),
        l = n(74670),
        c = n(39146),
        u = n(48010),
        d = n(22413)
      function h(e) {
        const {
            className: t,
            isFilled: n,
            isActive: s,
            onClick: h,
            title: m,
            ...p
          } = e,
          [v, b] = (0, l.useActiveDescendant)(null),
          f =
            m ??
            (n
              ? i.removeTitlesMap[i.RemoveTitleType.Remove]
              : i.removeTitlesMap[i.RemoveTitleType.Add])
        return (
          (0, o.useLayoutEffect)(() => {
            const e = v.current
            e instanceof HTMLElement &&
              f &&
              e.dispatchEvent(new CustomEvent('common-tooltip-update'))
          }, [f, v]),
          o.createElement(a.Icon, {
            ...p,
            className: r()(
              d.favorite,
              'apply-common-tooltip',
              n && d.checked,
              s && d.active,
              b && d.focused,
              t,
            ),
            onClick: h,
            icon: n ? c : u,
            title: f,
            ariaLabel: f,
            ref: v,
          })
        )
      }
    },
    96040: (e, t, n) => {
      n.d(t, { RemoveButton: () => d })
      var o = n(11542),
        s = n(50959),
        r = n(97754),
        a = n.n(r),
        i = n(9745),
        l = n(74670),
        c = n(33765),
        u = n(35990)
      function d(e) {
        const {
            className: t,
            isActive: r,
            onClick: d,
            onMouseDown: h,
            title: m,
            hidden: p,
            'data-name': v = 'remove-button',
            icon: b,
            ...f
          } = e,
          [E, g] = (0, l.useActiveDescendant)(null)
        return s.createElement(i.Icon, {
          ...f,
          'data-name': v,
          className: a()(
            u.button,
            'apply-common-tooltip',
            r && u.active,
            p && u.hidden,
            g && u.focused,
            t,
          ),
          icon: b || c,
          onClick: d,
          onMouseDown: h,
          title: m ?? o.t(null, void 0, n(67410)),
          ariaLabel: m ?? o.t(null, void 0, n(67410)),
          ref: E,
        })
      }
    },
    86656: (e, t, n) => {
      n.d(t, { TouchScrollContainer: () => c })
      var o = n(50959),
        s = n(59142),
        r = n(50151),
        a = n(49483)
      const i = CSS.supports('overscroll-behavior', 'none')
      let l = 0
      const c = (0, o.forwardRef)((e, t) => {
        const { children: n, ...r } = e,
          c = (0, o.useRef)(null)
        return (
          (0, o.useImperativeHandle)(t, () => c.current),
          (0, o.useLayoutEffect)(() => {
            if (a.CheckMobile.iOS())
              return (
                l++,
                null !== c.current &&
                  (i
                    ? 1 === l &&
                      (document.body.style.overscrollBehavior = 'none')
                    : (0, s.disableBodyScroll)(c.current, {
                        allowTouchMove: u(c),
                      })),
                () => {
                  l--,
                    null !== c.current &&
                      (i
                        ? 0 === l &&
                          (document.body.style.overscrollBehavior = '')
                        : (0, s.enableBodyScroll)(c.current))
                }
              )
          }, []),
          o.createElement('div', { ref: c, ...r }, n)
        )
      })
      function u(e) {
        return (t) => {
          const n = (0, r.ensureNotNull)(e.current),
            o = document.activeElement
          return (
            !n.contains(t) || (null !== o && n.contains(o) && o.contains(t))
          )
        }
      }
    },
    20243: (e, t, n) => {
      n.d(t, {
        focusFirstMenuItem: () => u,
        handleAccessibleMenuFocus: () => l,
        handleAccessibleMenuKeyDown: () => c,
        queryMenuElements: () => m,
      })
      var o = n(19291),
        s = n(57177),
        r = n(68335),
        a = n(15754)
      const i = [37, 39, 38, 40]
      function l(e, t) {
        if (!e.target) return
        const n = e.relatedTarget?.getAttribute('aria-activedescendant')
        if (e.relatedTarget !== t.current) {
          const e = n && document.getElementById(n)
          if (!e || e !== t.current) return
        }
        u(e.target)
      }
      function c(e) {
        if (e.defaultPrevented) return
        const t = (0, r.hashFromEvent)(e)
        if (!i.includes(t)) return
        const n = document.activeElement
        if (!(document.activeElement instanceof HTMLElement)) return
        const a = m(e.currentTarget).sort(o.navigationOrderComparator)
        if (0 === a.length) return
        const l =
          document.activeElement.closest('[data-role="menuitem"]') ||
          document.activeElement.parentElement?.querySelector(
            '[data-role="menuitem"]',
          )
        if (!(l instanceof HTMLElement)) return
        const c = a.indexOf(l)
        if (-1 === c) return
        const u = p(l),
          v = u.indexOf(document.activeElement),
          b = -1 !== v,
          f = (e) => {
            n && (0, s.becomeSecondaryElement)(n),
              (0, s.becomeMainElement)(e),
              e.focus()
          }
        switch ((0, o.mapKeyCodeToDirection)(t)) {
          case 'inlinePrev':
            if (!u.length) return
            e.preventDefault(),
              f(0 === v ? a[c] : b ? d(u, v, -1) : u[u.length - 1])
            break
          case 'inlineNext':
            if (!u.length) return
            e.preventDefault(),
              v === u.length - 1 ? f(a[c]) : f(b ? d(u, v, 1) : u[0])
            break
          case 'blockPrev': {
            e.preventDefault()
            const t = d(a, c, -1)
            if (b) {
              const e = h(t, v)
              f(e || t)
              break
            }
            f(t)
            break
          }
          case 'blockNext': {
            e.preventDefault()
            const t = d(a, c, 1)
            if (b) {
              const e = h(t, v)
              f(e || t)
              break
            }
            f(t)
          }
        }
      }
      function u(e) {
        const [t] = m(e)
        t && ((0, s.becomeMainElement)(t), t.focus())
      }
      function d(e, t, n) {
        return e[(t + e.length + n) % e.length]
      }
      function h(e, t) {
        const n = p(e)
        return n.length ? n[(t + n.length) % n.length] : null
      }
      function m(e) {
        return Array.from(
          e.querySelectorAll(
            '[data-role="menuitem"]:not([disabled]):not([aria-disabled])',
          ),
        ).filter((0, a.createScopedVisibleElementFilter)(e))
      }
      function p(e) {
        return Array.from(
          e.querySelectorAll('[tabindex]:not([disabled]):not([aria-disabled])'),
        ).filter((0, a.createScopedVisibleElementFilter)(e))
      }
    },
    57177: (e, t, n) => {
      var o
      function s(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function r(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      n.d(t, { becomeMainElement: () => s, becomeSecondaryElement: () => r }),
        ((e) => {
          ;(e.MainElement = 'roving-tabindex:main-element'),
            (e.SecondaryElement = 'roving-tabindex:secondary-element')
        })(o || (o = {}))
    },
    75535: (e, t, n) => {
      n.d(t, { ActionsTable: () => i })
      var o = n(50959),
        s = n(21320)
      function r(e) {
        return o.createElement(
          'tr',
          { className: s.row },
          o.createElement(
            'td',
            null,
            o.createElement('div', { className: s.line }),
          ),
          o.createElement(
            'td',
            null,
            o.createElement('div', { className: s.line }),
            e.hint
              ? o.createElement('div', { className: s.hint }, e.hint)
              : null,
          ),
        )
      }
      var a = n(10772)
      class i extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._handleShowSubMenu = (e) => {
              const t = e.getState()
              this.setState({ showSubMenuOf: t.subItems.length ? e : void 0 })
            }),
            (this.state = {})
        }
        render() {
          return o.createElement(
            'table',
            null,
            o.createElement(
              'tbody',
              null,
              this.props.items.map((e) => this._item(e)),
            ),
          )
        }
        static getDerivedStateFromProps(e, t) {
          return !e.parentIsOpened && t.showSubMenuOf
            ? { showSubMenuOf: void 0 }
            : null
        }
        _item(e) {
          switch (e.type) {
            case 'separator':
              return o.createElement(r, { key: e.id, hint: e.getHint() })
            case 'action':
              const t = e.custom() ?? e
              return o.createElement(a.ContextMenuAction, {
                key: t.id,
                action: t,
                onShowSubMenu: this._handleShowSubMenu,
                isSubMenuOpened: this.state.showSubMenuOf === t,
                menuStatName: this.props.menuStatName,
                parentStatName: this.props.parentStatName,
                onRequestUpdate: this.props.onRequestUpdate,
              })
          }
        }
      }
    },
    60925: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M12 4h3v1h-1.04l-.88 9.64a1.5 1.5 0 0 1-1.5 1.36H6.42a1.5 1.5 0 0 1-1.5-1.36L4.05 5H3V4h3v-.5C6 2.67 6.67 2 7.5 2h3c.83 0 1.5.67 1.5 1.5V4ZM7.5 3a.5.5 0 0 0-.5.5V4h4v-.5a.5.5 0 0 0-.5-.5h-3ZM5.05 5l.87 9.55a.5.5 0 0 0 .5.45h5.17a.5.5 0 0 0 .5-.45L12.94 5h-7.9Z"/></svg>'
    },
    60004: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M22 9.06 11 20 6 14.7l1.09-1.02 3.94 4.16L20.94 8 22 9.06Z"/></svg>'
    },
    65890: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke="currentColor" stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>'
    },
    66493: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 20L11 14.5 16.5 9"/></svg>'
    },
    79978: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M8 5l3.5 3.5L8 12"/></svg>'
    },
    39750: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M7 15l5 5L23 9"/></svg>'
    },
    33765: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="currentColor" d="M9.707 9l4.647-4.646-.707-.708L9 8.293 4.354 3.646l-.708.708L8.293 9l-4.647 4.646.708.708L9 9.707l4.646 4.647.708-.707L9.707 9z"/></svg>'
    },
    14665: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16" width="10" height="16"><path d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"/></svg>'
    },
    39146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>'
    },
    48010: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>'
    },
  },
])
