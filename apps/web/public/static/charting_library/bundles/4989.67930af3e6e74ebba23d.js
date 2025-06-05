;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4989],
  {
    259142: (e, t) => {
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
            i = !1,
            a = -1,
            l = void 0,
            c = void 0,
            u = (e) =>
              r.some(
                (t) =>
                  !(!t.options.allowTouchMove || !t.options.allowTouchMove(e)),
              ),
            h = (e) => {
              var t = e || window.event
              return (
                !!u(t.target) ||
                1 < t.touches.length ||
                (t.preventDefault && t.preventDefault(), !1)
              )
            },
            d = () => {
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
                var d = { targetElement: e, options: o || {} }
                ;(r = [].concat(t(r), [d])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (a = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var n, o, s, r
                    1 === t.targetTouches.length &&
                      ((o = e),
                      (r = (n = t).targetTouches[0].clientY - a),
                      !u(n.target) &&
                        ((o && 0 === o.scrollTop && 0 < r) ||
                        ((s = o) &&
                          s.scrollHeight - s.scrollTop <= s.clientHeight &&
                          r < 0)
                          ? h(n)
                          : n.stopPropagation()))
                  }),
                  i ||
                    (document.addEventListener(
                      'touchmove',
                      h,
                      n ? { passive: !1 } : void 0,
                    ),
                    (i = !0))
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
                  i &&
                    (document.removeEventListener(
                      'touchmove',
                      h,
                      n ? { passive: !1 } : void 0,
                    ),
                    (i = !1)),
                  (r = []),
                  (a = -1))
                : (d(), (r = []))
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
                  i &&
                    0 === r.length &&
                    (document.removeEventListener(
                      'touchmove',
                      h,
                      n ? { passive: !1 } : void 0,
                    ),
                    (i = !1))
              } else
                1 === r.length && r[0].targetElement === e
                  ? (d(), (r = []))
                  : (r = r.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (s = 'function' == typeof n ? n.apply(t, o) : n) ||
          (e.exports = s)
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
    844445: (e) => {
      e.exports = { accessible: 'accessible-rm8yeqY4' }
    },
    351331: (e) => {
      e.exports = {
        loaderWrap: 'loaderWrap-jGEARQlM',
        big: 'big-jGEARQlM',
        loader: 'loader-jGEARQlM',
      }
    },
    522436: (e) => {
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
        checkmark: 'checkmark-GJX1EXhk',
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
    886838: (e) => {
      e.exports = {
        row: 'row-DFIg7eOh',
        line: 'line-DFIg7eOh',
        hint: 'hint-DFIg7eOh',
      }
    },
    36002: (e) => {
      e.exports = { menu: 'menu-Tx5xMZww' }
    },
    829122: (e) => {
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
    333927: (e) => {
      e.exports = { separator: 'separator-Ymxd0dt_' }
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
    927306: (e) => {
      e.exports = {
        button: 'button-iLKiGOdQ',
        hovered: 'hovered-iLKiGOdQ',
        disabled: 'disabled-iLKiGOdQ',
        active: 'active-iLKiGOdQ',
        hidden: 'hidden-iLKiGOdQ',
      }
    },
    234404: (e, t, n) => {
      n.d(t, { Loader: () => a })
      var o = n(50959),
        s = n(497754),
        r = n(625650),
        i = n.n(r)
      function a(e) {
        const {
            className: t,
            size: n = 'medium',
            staticPosition: r,
            color: a = 'black',
          } = e,
          l = s(i().item, i()[a], i()[n])
        return o.createElement(
          'span',
          { className: s(i().loader, r && i().static, t) },
          o.createElement('span', { className: l }),
          o.createElement('span', { className: l }),
          o.createElement('span', { className: l }),
        )
      }
    },
    879091: (e, t, n) => {
      n.d(t, { ContextMenuAction: () => x })
      var o = n(50959),
        s = n(650151),
        r = n(820883),
        i = n(370981),
        a = n(32133),
        l = n(730743),
        c = n(823030),
        u = n(497754),
        h = n.n(u),
        d = n(234404),
        m = n(194646),
        p = n(351331)
      function v(e) {
        const { size: t = 'normal' } = e
        return o.createElement(m.ContextMenuItem, {
          size: t,
          jsxLabel: o.createElement(
            'div',
            { className: h()(p.loaderWrap, p[t]) },
            o.createElement(d.Loader, { className: p.loader }),
          ),
          noInteractive: !0,
          onMouseOver: e.onMouseOver,
        })
      }
      var b = n(930202),
        f = n(865266),
        E = n(892932),
        g = n(844445)
      const w = (0, o.forwardRef)((e, t) => {
        const { className: n, ...s } = e,
          [r, i] = (0, f.useRovingTabindexElement)(t)
        return o.createElement(m.ContextMenuItem, {
          ...s,
          className: h()(E.PLATFORM_ACCESSIBILITY_ENABLED && g.accessible, n),
          reference: r,
          tabIndex: i,
          onKeyDown: (e) => {
            if (
              !E.PLATFORM_ACCESSIBILITY_ENABLED ||
              e.target !== e.currentTarget
            )
              return
            const t = (0, b.hashFromEvent)(e)
            ;(13 !== t && 32 !== t) ||
              (e.preventDefault(),
              r.current instanceof HTMLElement && r.current.click())
          },
          'data-role': E.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          'aria-disabled':
            (E.PLATFORM_ACCESSIBILITY_ENABLED && e.disabled) || void 0,
        })
      })
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
                  : (this.state.doNotCloseOnClick || (0, i.globalCloseMenu)(),
                    this.props.action.execute(),
                    this._trackEvent(),
                    this.props.onExecute &&
                      this.props.onExecute(this.props.action)))
            }),
            (this._handleClickToolbox = () => {
              ;(0, i.globalCloseMenu)()
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
              (0, l.calcSubMenuPos)(e.contentWidth, this._itemRef)),
            (this._updateState = (e) => {
              this.setState(e.getState())
            }),
            (this._setItemRef = (e) => {
              this._itemRef = e
            }),
            (this._handleMenuRef = (e) => {
              this._menuRef = e
            }),
            (this._registerSubmenu = () => {
              var e
              return null === (e = this.context) || void 0 === e
                ? void 0
                : e.registerSubmenu(
                    this.props.action.id,
                    (e) =>
                      (0, s.ensureNotNull)(this._itemRef).contains(e) ||
                      (null !== this._menuElementRef.current &&
                        this._menuElementRef.current.contains(e)),
                  )
            }),
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
          var n, o, s
          t.loading !== this.state.loading &&
            (null === (o = (n = this.props).onRequestUpdate) ||
              void 0 === o ||
              o.call(n)),
            0 === t.subItems.length &&
              this.state.subItems.length > 0 &&
              (this._unsubscribe = this._registerSubmenu()),
            t.subItems.length > 0 &&
              0 === this.state.subItems.length &&
              (null === (s = this._unsubscribe) ||
                void 0 === s ||
                s.call(this)),
            t.subItems !== this.state.subItems &&
              null !== this._menuRef &&
              this._menuRef.update()
        }
        componentWillUnmount() {
          this.props.action.onUpdate().unsubscribe(this, this._updateState),
            this._unsubscribe && this._unsubscribe()
        }
        render() {
          var e, t
          const n = (
            null === (e = this.context) || void 0 === e
              ? void 0
              : e.current
          )
            ? this.context.current === this.props.action.id
            : this.props.isSubMenuOpened
          return this.state.loading
            ? o.createElement(v, { size: this.state.size })
            : o.createElement(
                w,
                {
                  theme: this.props.theme,
                  ref:
                    null !== (t = this.props.reference) && void 0 !== t
                      ? t
                      : this._setItemRef,
                  onClick: this._handleClick,
                  onClickToolbox: this._handleClickToolbox,
                  onMouseOver: this._handleItemMouseOver,
                  hovered: n,
                  hasSubItems: this._hasSubItems(),
                  actionName: this.state.name,
                  checkboxInput: this.props.checkboxInput,
                  selected: this.props.selected,
                  ...this.state,
                },
                o.createElement(r.ContextMenu, {
                  isOpened: n,
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
          var e
          this.state.subItems.length &&
            (null === (e = this.context) ||
              void 0 === e ||
              e.setCurrent(this.props.action.id))
        }
        _hasSubItems() {
          return this.state.subItems.length > 0
        }
        _trackEvent() {
          const e = this._getStatName()
          ;(0, a.trackEvent)(
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
    194646: (e, t, n) => {
      n.d(t, {
        ContextMenuItem: () => g,
        DEFAUL_CONTEXT_MENU_ITEM_THEME: () => f,
      })
      var o = n(50959),
        s = n(497754),
        r = n(408323),
        i = n(601227),
        a = n(972535)
      var l = n(72621),
        c = n(577687),
        u = n(68620),
        h = n(76821),
        d = n(156963),
        m = n(800417),
        p = n(80802),
        v = n(214665),
        b = n(522436)
      const f = b,
        E = d.enabled('items_favoriting')
      class g extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._handleMouseOver = (e) => {
              ;((e) => {
                const t = e.sourceCapabilities
                let n = t && t.firesTouchEvents
                return void 0 === n && (n = a.touch), n
              })(e.nativeEvent) ||
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
              favourite: a,
              theme: l = b,
              size: h = 'normal',
              onKeyDown: d,
              label: p,
              jsxLabel: f,
              styledLabel: g,
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
                className: s(
                  this.props.className,
                  l.item,
                  !this.props.noInteractive && l.interactive,
                  this.props.hovered && l.hovered,
                  this.props.disabled && l.disabled,
                  this.props.active && l.active,
                  this.props.selected && l.selected,
                  l[h],
                ),
                onClick: this.props.onClick,
                onMouseOver: this._handleMouseOver,
                ref: this.props.reference,
                'data-action-name': this.props.actionName,
                tabIndex: this.props.tabIndex,
                onKeyDown: d,
              },
              E &&
                void 0 !== a &&
                o.createElement(
                  'td',
                  null,
                  o.createElement(c.FavoriteButton, {
                    className: l.favourite,
                    isFilled: a,
                    onClick: this.props.onFavouriteClick,
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
                    !f && g
                      ? g.map(({ text: e, ...t }, n) =>
                          o.createElement('span', { key: n, style: t }, e),
                        )
                      : null != f
                        ? f
                        : p,
                  ),
                  this._toolbox(l),
                  e &&
                    o.createElement('span', {
                      className: l.arrowIcon,
                      dangerouslySetInnerHTML: { __html: v },
                      'data-submenu-arrow': !0,
                    }),
                  !e &&
                    t &&
                    !i.CheckMobile.any() &&
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
                n = this.props.iconChecked || this.props.icon || p
              return o.createElement('span', {
                className: s(e.icon, t && e.checkmark),
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
            this.props.toolbox.type === h.ToolboxType.Delete
            ? o.createElement(l.RemoveButton, {
                onClick: this.props.toolbox.action,
              })
            : null
        }
      }
    },
    820883: (e, t, n) => {
      n.d(t, { ContextMenu: () => y, OverlapContextMenu: () => S })
      var o = n(50959),
        s = n(497754),
        r = n.n(s),
        i = n(874485),
        a = n(510618),
        l = n(738036),
        c = n(249161),
        u = n(800553),
        h = n(163694),
        d = n(930052),
        m = n(333927)
      function p(e) {
        return o.createElement('li', { className: m.separator })
      }
      var v = n(729624),
        b = n(759339),
        f = n(370981)
      function E(e) {
        var t
        const n =
            null !== (t = e.action.custom()) && void 0 !== t ? t : e.action,
          [s, r] = (0, o.useState)(() => n.getState()),
          [i, a] = (0, o.useState)(!1),
          l = !!s.subItems.length,
          c = l && i
        return (
          (0, o.useEffect)(() => {
            const e = () => r(n.getState())
            return (
              n.onUpdate().subscribe(null, e),
              () => {
                n.onUpdate().unsubscribe(null, e)
              }
            )
          }, []),
          o.createElement(
            v.ContextMenuItem,
            {
              ...s,
              onClick: (e) => {
                if (s.disabled || e.defaultPrevented) return
                if (l) return void a(!0)
                s.doNotCloseOnClick || (0, f.globalCloseMenu)()
                n.execute()
              },
              isLoading: s.loading,
              isHovered: c,
            },
            c &&
              o.createElement(
                b.Drawer,
                { onClose: u },
                o.createElement(x, {
                  items: s.subItems,
                  parentAction: n,
                  closeNested: u,
                }),
              ),
          )
        )
        function u(e) {
          e && e.preventDefault(), a(!1)
        }
      }
      var g = n(134064),
        w = n(366493)
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
      var C = n(179807),
        _ = n(892932),
        M = n(36002)
      class y extends o.PureComponent {
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
              var e, t
              ;(null === (e = this.props.menuElementReference) || void 0 === e
                ? void 0
                : e.current) &&
                this.props.takeFocus &&
                (null === (t = this.props.menuElementReference) ||
                  void 0 === t ||
                  t.current.focus({ preventScroll: !0 }))
            }),
            (this._handleFocus = (e) => {
              this.props.isKeyboardEvent &&
                e.target &&
                _.PLATFORM_ACCESSIBILITY_ENABLED &&
                (0, C.focusFirstMenuItem)(e.target)
            }),
            (this.state = {})
        }
        render() {
          const {
            isOpened: e,
            onClose: t,
            items: n,
            doNotCloseOn: s,
            menuStatName: i,
            parentStatName: m,
            takeFocus: p,
            ...v
          } = this.props
          return e
            ? o.createElement(
                h.DrawerManager,
                null,
                o.createElement(c.KeyboardDocumentListener, {
                  keyCode: 27,
                  eventType: 'keyup',
                  handler: this._handleClose,
                }),
                o.createElement(
                  d.MatchMedia,
                  { rule: 'screen and (max-width: 430px)' },
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
                                a.Menu,
                                {
                                  ...v,
                                  reference: t,
                                  className: r()(M.menu, 'context-menu'),
                                  onClose: this._handleClose,
                                  noMomentumBasedScroll: !0,
                                  ref: this._menuRef,
                                  tabIndex: p ? -1 : void 0,
                                  onOpen: this._handleFocusOnOpen,
                                  onFocus: this._handleFocus,
                                  onKeyDown: C.handleAccessibleMenuKeyDown,
                                },
                                o.createElement(u.ActionsTable, {
                                  items: n,
                                  menuStatName: i,
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
          var e
          this._menuRef.current && this._menuRef.current.update(),
            this.props.isKeyboardEvent &&
              (null === (e = this.props.menuElementReference) || void 0 === e
                ? void 0
                : e.current) &&
              document.activeElement ===
                this.props.menuElementReference.current &&
              (0, C.focusFirstMenuItem)(this.props.menuElementReference.current)
        }
        _isDrawer(e) {
          return void 0 === this.props.mode ? e : 'drawer' === this.props.mode
        }
      }
      const S = (0, i.makeOverlapable)(y)
    },
    68620: (e, t, n) => {
      n.d(t, { Hint: () => a })
      var o = n(50959),
        s = n(497754),
        r = n.n(s),
        i = n(522436)
      function a(e) {
        const { text: t = '', className: n } = e
        return o.createElement('span', { className: r()(i.shortcut, n) }, t)
      }
    },
    729624: (e, t, n) => {
      n.d(t, { ContextMenuItem: () => p })
      var o = n(50959),
        s = n(497754),
        r = n.n(s),
        i = n(72571),
        a = n(234404),
        l = n(134064),
        c = n(68620),
        u = n(339750),
        h = n(379978),
        d = n(69311),
        m = n(829122)
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
            label: C,
            styledLabel: _,
            onClick: M,
            children: y,
            toolbox: S,
            jsxLabel: I,
            size: N = 'normal',
          } = e,
          L = (0, o.useContext)(l.EmptyIconsContext),
          D = !!k.length
        return s
          ? o.createElement(
              'li',
              { className: r()(t, m.item, m.loading, m[N]) },
              o.createElement(a.Loader, null),
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
                  L && m.emptyIcons,
                  m[N],
                ),
                onClick: M,
              },
              o.createElement(i.Icon, {
                className: r()(m.icon),
                icon: (() => {
                  if (b && E) return w || g || u
                  return g
                })(),
              }),
              o.createElement(
                'span',
                { className: r()(m.label) },
                !I && _
                  ? _.map(({ text: e, ...t }, n) =>
                      o.createElement('span', { key: n, style: t }, e),
                    )
                  : null != I
                    ? I
                    : C,
              ),
              !!S &&
                o.createElement(i.Icon, {
                  onClick: () => {
                    S && S.action()
                  },
                  className: m.remove,
                  icon: d,
                }),
              !D &&
                x &&
                o.createElement(c.Hint, { className: m.shortcut, text: x }),
              D && o.createElement(i.Icon, { className: m.nested, icon: h }),
              y,
            )
      }
    },
    134064: (e, t, n) => {
      n.d(t, { EmptyIconsContext: () => o })
      const o = n(50959).createContext(!1)
    },
    577687: (e, t, n) => {
      n.d(t, { FavoriteButton: () => h })
      var o = n(609838),
        s = n(50959),
        r = n(497754),
        i = n(72571),
        a = n(239146),
        l = n(648010),
        c = n(214877)
      const u = {
        add: o.t(null, void 0, n(44629)),
        remove: o.t(null, void 0, n(572482)),
      }
      function h(e) {
        const { className: t, isFilled: n, isActive: o, onClick: h, ...d } = e
        return s.createElement(i.Icon, {
          ...d,
          className: r(
            c.favorite,
            'apply-common-tooltip',
            n && c.checked,
            o && c.active,
            t,
          ),
          icon: n ? a : l,
          onClick: h,
          title: n ? u.remove : u.add,
        })
      }
    },
    249161: (e, t, n) => {
      n.d(t, { KeyboardDocumentListener: () => s })
      var o = n(50959)
      class s extends o.PureComponent {
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
    730743: (e, t, n) => {
      n.d(t, { calcSubMenuPos: () => s })
      var o = n(710263)
      function s(e, t, n = { x: 0, y: 10 }) {
        if (t) {
          const { left: n, right: s, top: r } = t.getBoundingClientRect(),
            i = document.documentElement.clientWidth,
            a = { x: n - e, y: r },
            l = { x: s, y: r }
          return (0, o.isRtl)() ? (n <= e ? l : a) : i - s >= e ? l : a
        }
        return n
      }
    },
    72621: (e, t, n) => {
      n.d(t, { RemoveButton: () => c })
      var o = n(609838),
        s = n(50959),
        r = n(497754),
        i = n(72571),
        a = n(333765),
        l = n(927306)
      function c(e) {
        const {
          className: t,
          isActive: c,
          onClick: u,
          onMouseDown: h,
          title: d,
          hidden: m,
          'data-name': p = 'remove-button',
          ...v
        } = e
        return s.createElement(i.Icon, {
          ...v,
          'data-name': p,
          className: r(
            l.button,
            'apply-common-tooltip',
            c && l.active,
            m && l.hidden,
            t,
          ),
          icon: a,
          onClick: u,
          onMouseDown: h,
          title: d || o.t(null, void 0, n(734596)),
        })
      }
    },
    179807: (e, t, n) => {
      n.d(t, {
        focusFirstMenuItem: () => c,
        handleAccessibleMenuFocus: () => a,
        handleAccessibleMenuKeyDown: () => l,
        queryMenuElements: () => d,
      })
      var o = n(892932),
        s = n(27164),
        r = n(180185)
      const i = [37, 39, 38, 40]
      function a(e, t) {
        e.target &&
          o.PLATFORM_ACCESSIBILITY_ENABLED &&
          e.relatedTarget === t.current &&
          c(e.target)
      }
      function l(e) {
        var t
        if (!o.PLATFORM_ACCESSIBILITY_ENABLED) return
        if (e.defaultPrevented) return
        const n = (0, r.hashFromEvent)(e)
        if (!i.includes(n)) return
        const a = document.activeElement
        if (!(document.activeElement instanceof HTMLElement)) return
        const l = d(e.currentTarget).sort(o.navigationOrderComparator)
        if (0 === l.length) return
        const c =
          document.activeElement.closest('[data-role="menuitem"]') ||
          (null === (t = document.activeElement.parentElement) || void 0 === t
            ? void 0
            : t.querySelector('[data-role="menuitem"]'))
        if (!(c instanceof HTMLElement)) return
        const p = l.indexOf(c)
        if (-1 === p) return
        const v = m(c),
          b = v.indexOf(document.activeElement),
          f = -1 !== b,
          E = (e) => {
            a && (0, s.becomeSecondaryElement)(a),
              (0, s.becomeMainElement)(e),
              e.focus()
          }
        switch ((0, o.mapKeyCodeToDirection)(n)) {
          case 'inlinePrev':
            if (!v.length) return
            e.preventDefault(),
              E(0 === b ? l[p] : f ? u(v, b, -1) : v[v.length - 1])
            break
          case 'inlineNext':
            if (!v.length) return
            e.preventDefault(),
              b === v.length - 1 ? E(l[p]) : E(f ? u(v, b, 1) : v[0])
            break
          case 'blockPrev': {
            e.preventDefault()
            const t = u(l, p, -1)
            if (f) {
              const e = h(t, b)
              E(e || t)
              break
            }
            E(t)
            break
          }
          case 'blockNext': {
            e.preventDefault()
            const t = u(l, p, 1)
            if (f) {
              const e = h(t, b)
              E(e || t)
              break
            }
            E(t)
          }
        }
      }
      function c(e) {
        const [t] = d(e)
        t && ((0, s.becomeMainElement)(t), t.focus())
      }
      function u(e, t, n) {
        return e[(t + e.length + n) % e.length]
      }
      function h(e, t) {
        const n = m(e)
        return n.length ? n[(t + n.length) % n.length] : null
      }
      function d(e) {
        return Array.from(
          e.querySelectorAll(
            '[data-role="menuitem"]:not([disabled]):not([aria-disabled])',
          ),
        ).filter((0, o.createScopedVisibleElementFilter)(e))
      }
      function m(e) {
        return Array.from(
          e.querySelectorAll('[tabindex]:not([disabled]):not([aria-disabled])'),
        ).filter((0, o.createScopedVisibleElementFilter)(e))
      }
    },
    800553: (e, t, n) => {
      n.d(t, { ActionsTable: () => a })
      var o = n(50959),
        s = n(886838)
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
      var i = n(879091)
      class a extends o.PureComponent {
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
          var t
          switch (e.type) {
            case 'separator':
              return o.createElement(r, { key: e.id, hint: e.getHint() })
            case 'action':
              const n = null !== (t = e.custom()) && void 0 !== t ? t : e
              return o.createElement(i.ContextMenuAction, {
                key: n.id,
                action: n,
                onShowSubMenu: this._handleShowSubMenu,
                isSubMenuOpened: this.state.showSubMenuOf === n,
                menuStatName: this.props.menuStatName,
                parentStatName: this.props.parentStatName,
                onRequestUpdate: this.props.onRequestUpdate,
              })
          }
        }
      }
    },
    366493: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 20L11 14.5 16.5 9"/></svg>'
    },
    379978: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M8 5l3.5 3.5L8 12"/></svg>'
    },
    80802: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 14" width="18" height="14"><path fill="currentColor" d="M6 11.17l-4.17-4.17-1.42 1.41 5.59 5.59 12-12-1.41-1.41-10.59 10.58z"/></svg>'
    },
    339750: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M7 15l5 5L23 9"/></svg>'
    },
    333765: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="currentColor" d="M9.707 9l4.647-4.646-.707-.708L9 8.293 4.354 3.646l-.708.708L8.293 9l-4.647 4.646.708.708L9 9.707l4.646 4.647.708-.707L9.707 9z"/></svg>'
    },
    69311: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9.7 9l4.65-4.65-.7-.7L9 8.29 4.35 3.65l-.7.7L8.29 9l-4.64 4.65.7.7L9 9.71l4.65 4.64.7-.7L9.71 9z"/></svg>'
    },
    214665: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16" width="10" height="16"><path d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"/></svg>'
    },
    239146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>'
    },
    648010: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>'
    },
  },
])
