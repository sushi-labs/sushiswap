;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5128],
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
            i = [],
            r = !1,
            a = -1,
            l = void 0,
            c = void 0,
            u = (e) =>
              i.some(
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
              if (e && !i.some((t) => t.targetElement === e)) {
                var d = { targetElement: e, options: o || {} }
                ;(i = [].concat(t(i), [d])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (a = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var n, o, s, i
                    1 === t.targetTouches.length &&
                      ((o = e),
                      (i = (n = t).targetTouches[0].clientY - a),
                      !u(n.target) &&
                        ((o && 0 === o.scrollTop && 0 < i) ||
                        ((s = o) &&
                          s.scrollHeight - s.scrollTop <= s.clientHeight &&
                          i < 0)
                          ? h(n)
                          : n.stopPropagation()))
                  }),
                  r ||
                    (document.addEventListener(
                      'touchmove',
                      h,
                      n ? { passive: !1 } : void 0,
                    ),
                    (r = !0))
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
              i = [].concat(t(i), [m])
            }
            var p
          }),
            (e.clearAllBodyScrollLocks = () => {
              s
                ? (i.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  r &&
                    (document.removeEventListener(
                      'touchmove',
                      h,
                      n ? { passive: !1 } : void 0,
                    ),
                    (r = !1)),
                  (i = []),
                  (a = -1))
                : (d(), (i = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (s) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (i = i.filter((t) => t.targetElement !== e)),
                  r &&
                    0 === i.length &&
                    (document.removeEventListener(
                      'touchmove',
                      h,
                      n ? { passive: !1 } : void 0,
                    ),
                    (r = !1))
              } else
                1 === i.length && i[0].targetElement === e
                  ? (d(), (i = []))
                  : (i = i.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (s = 'function' == typeof n ? n.apply(t, o) : n) ||
          (e.exports = s)
    },
    70048: (e) => {
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
    25650: (e) => {
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
    44445: (e) => {
      e.exports = { accessible: 'accessible-rm8yeqY4' }
    },
    51331: (e) => {
      e.exports = {
        loaderWrap: 'loaderWrap-jGEARQlM',
        big: 'big-jGEARQlM',
        loader: 'loader-jGEARQlM',
      }
    },
    22436: (e) => {
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
    86838: (e) => {
      e.exports = {
        row: 'row-DFIg7eOh',
        line: 'line-DFIg7eOh',
        hint: 'hint-DFIg7eOh',
      }
    },
    36002: (e) => {
      e.exports = { menu: 'menu-Tx5xMZww' }
    },
    29122: (e) => {
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
    33927: (e) => {
      e.exports = { separator: 'separator-Ymxd0dt_' }
    },
    14877: (e) => {
      e.exports = {
        favorite: 'favorite-_FRQhM5Y',
        hovered: 'hovered-_FRQhM5Y',
        disabled: 'disabled-_FRQhM5Y',
        active: 'active-_FRQhM5Y',
        checked: 'checked-_FRQhM5Y',
      }
    },
    27306: (e) => {
      e.exports = {
        button: 'button-iLKiGOdQ',
        hovered: 'hovered-iLKiGOdQ',
        disabled: 'disabled-iLKiGOdQ',
        active: 'active-iLKiGOdQ',
        hidden: 'hidden-iLKiGOdQ',
      }
    },
    70673: (e, t, n) => {
      n.d(t, { CheckboxInput: () => u })
      var o = n(50959),
        s = n(97754),
        i = n(90186),
        r = n(9745),
        a = n(65890),
        l = n(70048),
        c = n.n(l)
      function u(e) {
        const t = s(c().box, c()[`intent-${e.intent}`], {
            [c().check]: !Boolean(e.indeterminate),
            [c().dot]: Boolean(e.indeterminate),
            [c().noOutline]: -1 === e.tabIndex,
          }),
          n = s(c().wrapper, e.className)
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
            ...(0, i.filterDataProps)(e),
          }),
          o.createElement(
            'span',
            { className: t },
            o.createElement(r.Icon, { icon: a, className: c().icon }),
          ),
        )
      }
    },
    26996: (e, t, n) => {
      n.d(t, { Loader: () => a })
      var o = n(50959),
        s = n(97754),
        i = n(25650),
        r = n.n(i)
      function a(e) {
        const {
            className: t,
            size: n = 'medium',
            staticPosition: i,
            color: a = 'black',
          } = e,
          l = s(r().item, r()[a], r()[n])
        return o.createElement(
          'span',
          {
            className: s(r().loader, i && r().static, t),
          },
          o.createElement('span', { className: l }),
          o.createElement('span', { className: l }),
          o.createElement('span', { className: l }),
        )
      }
    },
    10772: (e, t, n) => {
      n.d(t, { ContextMenuAction: () => x })
      var o = n(50959),
        s = n(50151),
        i = n(91561),
        r = n(59064),
        a = n(51768),
        l = n(38223)
      var c = n(83021),
        u = n(97754),
        h = n.n(u),
        d = n(26996),
        m = n(50267),
        p = n(51331)
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
      var b = n(3343),
        E = n(50238),
        g = n(16838),
        f = n(44445)
      const w = (0, o.forwardRef)((e, t) => {
        const { className: n, ...s } = e,
          [i, r] = (0, E.useRovingTabindexElement)(t)
        return o.createElement(m.ContextMenuItem, {
          ...s,
          className: h()(g.PLATFORM_ACCESSIBILITY_ENABLED && f.accessible, n),
          reference: i,
          tabIndex: r,
          onKeyDown: (e) => {
            if (
              !g.PLATFORM_ACCESSIBILITY_ENABLED ||
              e.target !== e.currentTarget
            )
              return
            const t = (0, b.hashFromEvent)(e)
            ;(13 !== t && 32 !== t) ||
              (e.preventDefault(),
              i.current instanceof HTMLElement && i.current.click())
          },
          'data-role': g.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          'aria-disabled':
            (g.PLATFORM_ACCESSIBILITY_ENABLED && e.disabled) || void 0,
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
                  : (this.state.doNotCloseOnClick || (0, r.globalCloseMenu)(),
                    this.props.action.execute(),
                    this._trackEvent(),
                    this.props.onExecute &&
                      this.props.onExecute(this.props.action)))
            }),
            (this._handleClickToolbox = () => {
              ;(0, r.globalCloseMenu)()
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
                    i = document.documentElement.clientWidth,
                    r = { x: n - e, y: s },
                    a = { x: o, y: s }
                  return (0, l.isRtl)() ? (n <= e ? a : r) : i - o >= e ? a : r
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
                o.createElement(i.ContextMenu, {
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
    50267: (e, t, n) => {
      n.d(t, {
        ContextMenuItem: () => f,
        DEFAUL_CONTEXT_MENU_ITEM_THEME: () => E,
      })
      var o = n(50959),
        s = n(97754),
        i = n(70673),
        r = n(49483),
        a = n(32563)
      var l = n(96040),
        c = n(36189),
        u = n(99025),
        h = n(25812),
        d = n(14483),
        m = n(90186),
        p = n(80802),
        v = n(14665),
        b = n(22436)
      const E = b,
        g = d.enabled('items_favoriting')
      class f extends o.PureComponent {
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
              invisibleHotkey: i,
              favourite: a,
              theme: l = b,
              size: h = 'normal',
              onKeyDown: d,
              label: p,
              jsxLabel: E,
              styledLabel: f,
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
              g &&
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
                    !E && f
                      ? f.map(({ text: e, ...t }, n) =>
                          o.createElement('span', { key: n, style: t }, e),
                        )
                      : null != E
                        ? E
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
                    !r.CheckMobile.any() &&
                    o.createElement(u.Hint, {
                      className: s(i && l.invisibleHotkey),
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
              return o.createElement(i.CheckboxInput, {
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
    91561: (e, t, n) => {
      n.d(t, { ContextMenu: () => M, OverlapContextMenu: () => y })
      var o = n(50959),
        s = n(97754),
        i = n.n(s),
        r = n(86431),
        a = n(27317),
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
      var u = n(28127),
        h = n(37558),
        d = n(90692),
        m = n(33927)
      function p(e) {
        return o.createElement('li', { className: m.separator })
      }
      var v = n(23829),
        b = n(41590),
        E = n(59064)
      function g(e) {
        var t
        const n =
            null !== (t = e.action.custom()) && void 0 !== t ? t : e.action,
          [s, i] = (0, o.useState)(() => n.getState()),
          [r, a] = (0, o.useState)(!1),
          l = !!s.subItems.length,
          c = l && r
        return (
          (0, o.useEffect)(() => {
            const e = () => i(n.getState())
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
                s.doNotCloseOnClick || (0, E.globalCloseMenu)()
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
      var f = n(54627),
        w = n(66493)
      function x(e) {
        const { items: t, parentAction: n, closeNested: s } = e,
          i =
            !Boolean(n) &&
            t.every(
              (e) =>
                !Boolean(
                  'separator' !== e.type &&
                    (e.getState().icon || e.getState().checkable),
                ),
            )
        return o.createElement(
          f.EmptyIconsContext.Provider,
          { value: i },
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
                  return o.createElement(g, { key: e.id, action: e })
                case 'separator':
                  return o.createElement(p, { key: e.id })
              }
            }),
          ),
        )
      }
      const k = o.createContext(null)
      var C = n(81261),
        _ = n(16838),
        I = n(36002)
      class M extends o.PureComponent {
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
            menuStatName: r,
            parentStatName: m,
            takeFocus: p,
            ...v
          } = this.props
          return e
            ? o.createElement(
                h.DrawerManager,
                null,
                o.createElement(c, {
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
                                  className: i()(I.menu, 'context-menu'),
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
                                  menuStatName: r,
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
      const y = (0, r.makeOverlapable)(M)
    },
    99025: (e, t, n) => {
      n.d(t, { Hint: () => a })
      var o = n(50959),
        s = n(97754),
        i = n.n(s),
        r = n(22436)
      function a(e) {
        const { text: t = '', className: n } = e
        return o.createElement('span', { className: i()(r.shortcut, n) }, t)
      }
    },
    23829: (e, t, n) => {
      n.d(t, { ContextMenuItem: () => p })
      var o = n(50959),
        s = n(97754),
        i = n.n(s),
        r = n(9745),
        a = n(26996),
        l = n(54627),
        c = n(99025),
        u = n(39750),
        h = n(79978),
        d = n(69311),
        m = n(29122)
      function p(e) {
        const {
            className: t,
            isTitle: n,
            isLoading: s,
            isHovered: p,
            active: v,
            checkable: b,
            disabled: E,
            checked: g,
            icon: f,
            iconChecked: w,
            hint: x,
            subItems: k,
            label: C,
            styledLabel: _,
            onClick: I,
            children: M,
            toolbox: y,
            jsxLabel: S,
            size: N = 'normal',
          } = e,
          L = (0, o.useContext)(l.EmptyIconsContext),
          D = !!k.length
        return s
          ? o.createElement(
              'li',
              { className: i()(t, m.item, m.loading, m[N]) },
              o.createElement(a.Loader, null),
            )
          : o.createElement(
              'li',
              {
                className: i()(
                  t,
                  m.item,
                  m.interactive,
                  n && m.title,
                  E && m.disabled,
                  p && m.hovered,
                  v && m.active,
                  L && m.emptyIcons,
                  m[N],
                ),
                onClick: I,
              },
              o.createElement(r.Icon, {
                className: i()(m.icon),
                icon: (() => {
                  if (b && g) return w || f || u
                  return f
                })(),
              }),
              o.createElement(
                'span',
                { className: i()(m.label) },
                !S && _
                  ? _.map(({ text: e, ...t }, n) =>
                      o.createElement('span', { key: n, style: t }, e),
                    )
                  : null != S
                    ? S
                    : C,
              ),
              !!y &&
                o.createElement(r.Icon, {
                  onClick: () => {
                    y && y.action()
                  },
                  className: m.remove,
                  icon: d,
                }),
              !D &&
                x &&
                o.createElement(c.Hint, { className: m.shortcut, text: x }),
              D && o.createElement(r.Icon, { className: m.nested, icon: h }),
              M,
            )
      }
    },
    54627: (e, t, n) => {
      n.d(t, { EmptyIconsContext: () => o })
      const o = n(50959).createContext(!1)
    },
    36189: (e, t, n) => {
      n.d(t, { FavoriteButton: () => h })
      var o = n(11542),
        s = n(50959),
        i = n(97754),
        r = n(9745),
        a = n(39146),
        l = n(48010),
        c = n(14877)
      const u = {
        add: o.t(null, void 0, n(44629)),
        remove: o.t(null, void 0, n(72482)),
      }
      function h(e) {
        const { className: t, isFilled: n, isActive: o, onClick: h, ...d } = e
        return s.createElement(r.Icon, {
          ...d,
          className: i(
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
    96040: (e, t, n) => {
      n.d(t, { RemoveButton: () => c })
      var o = n(11542),
        s = n(50959),
        i = n(97754),
        r = n(9745),
        a = n(33765),
        l = n(27306)
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
        return s.createElement(r.Icon, {
          ...v,
          'data-name': p,
          className: i(
            l.button,
            'apply-common-tooltip',
            c && l.active,
            m && l.hidden,
            t,
          ),
          icon: a,
          onClick: u,
          onMouseDown: h,
          title: d || o.t(null, void 0, n(34596)),
        })
      }
    },
    28127: (e, t, n) => {
      n.d(t, { ActionsTable: () => a })
      var o = n(50959),
        s = n(86838)
      function i(e) {
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
      var r = n(10772)
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
              return o.createElement(i, { key: e.id, hint: e.getHint() })
            case 'action':
              const n = null !== (t = e.custom()) && void 0 !== t ? t : e
              return o.createElement(r.ContextMenuAction, {
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
    65890: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>'
    },
    66493: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 20L11 14.5 16.5 9"/></svg>'
    },
    79978: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M8 5l3.5 3.5L8 12"/></svg>'
    },
    80802: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 14" width="18" height="14"><path fill="currentColor" d="M6 11.17l-4.17-4.17-1.42 1.41 5.59 5.59 12-12-1.41-1.41-10.59 10.58z"/></svg>'
    },
    39750: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M7 15l5 5L23 9"/></svg>'
    },
    33765: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="currentColor" d="M9.707 9l4.647-4.646-.707-.708L9 8.293 4.354 3.646l-.708.708L8.293 9l-4.647 4.646.708.708L9 9.707l4.646 4.647.708-.707L9.707 9z"/></svg>'
    },
    69311: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9.7 9l4.65-4.65-.7-.7L9 8.29 4.35 3.65l-.7.7L8.29 9l-4.64 4.65.7.7L9 9.71l4.65 4.64.7-.7L9.71 9z"/></svg>'
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
