;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1584],
  {
    66076: (e) => {
      e.exports = {
        'default-drawer-min-top-distance': '100px',
        wrap: 'wrap-_HnK0UIN',
        positionBottom: 'positionBottom-_HnK0UIN',
        backdrop: 'backdrop-_HnK0UIN',
        drawer: 'drawer-_HnK0UIN',
        positionLeft: 'positionLeft-_HnK0UIN',
      }
    },
    39416: (e, t, n) => {
      n.d(t, { useFunctionalRefObject: () => i })
      var r = n(50959),
        o = n(43010)
      function i(e) {
        const t = (0, r.useMemo)(
            () =>
              ((e) => {
                const t = (n) => {
                  e(n), (t.current = n)
                }
                return (t.current = null), t
              })((e) => {
                s.current(e)
              }),
            [],
          ),
          n = (0, r.useRef)(null),
          i = (t) => {
            if (null === t) return a(n.current, t), void (n.current = null)
            n.current !== e && ((n.current = e), a(n.current, t))
          },
          s = (0, r.useRef)(i)
        return (
          (s.current = i),
          (0, o.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return s.current(t.current), () => s.current(null)
          }, [e]),
          t
        )
      }
      function a(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
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
    90186: (e, t, n) => {
      function r(e) {
        return i(e, a)
      }
      function o(e) {
        return i(e, s)
      }
      function i(e, t) {
        const n = Object.entries(e).filter(t),
          r = {}
        for (const [e, t] of n) r[e] = t
        return r
      }
      function a(e) {
        const [t, n] = e
        return 0 === t.indexOf('data-') && 'string' == typeof n
      }
      function s(e) {
        return 0 === e[0].indexOf('aria-')
      }
      n.d(t, {
        filterAriaProps: () => o,
        filterDataProps: () => r,
        filterProps: () => i,
        isAriaAttribute: () => s,
        isDataAttribute: () => a,
      })
    },
    52778: (e, t, n) => {
      n.d(t, { OutsideEvent: () => o })
      var r = n(36383)
      function o(e) {
        const { children: t, ...n } = e
        return t((0, r.useOutsideEvent)(n))
      }
    },
    50238: (e, t, n) => {
      n.d(t, { useRovingTabindexElement: () => a })
      var r = n(50959),
        o = n(39416),
        i = n(16838)
      function a(e, t = []) {
        const [n, a] = (0, r.useState)(!1),
          s = (0, o.useFunctionalRefObject)(e)
        return (
          (0, r.useLayoutEffect)(() => {
            if (!i.PLATFORM_ACCESSIBILITY_ENABLED) return
            const e = s.current
            if (null === e) return
            const t = (e) => {
              switch (e.type) {
                case 'roving-tabindex:main-element':
                  a(!0)
                  break
                case 'roving-tabindex:secondary-element':
                  a(!1)
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
          [s, i.PLATFORM_ACCESSIBILITY_ENABLED ? (n ? 0 : -1) : void 0]
        )
      }
    },
    37558: (e, t, n) => {
      n.d(t, { DrawerContext: () => a, DrawerManager: () => i })
      var r = n(50959),
        o = n(99054)
      class i extends r.PureComponent {
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
            ((0, o.setFixedBodyState)(!0), (this._isBodyFixed = !0)),
            t.stack.length &&
              !this.state.stack.length &&
              this._isBodyFixed &&
              ((0, o.setFixedBodyState)(!1), (this._isBodyFixed = !1))
        }
        componentWillUnmount() {
          this.state.stack.length &&
            this._isBodyFixed &&
            (0, o.setFixedBodyState)(!1)
        }
        render() {
          return r.createElement(
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
      const a = r.createContext(null)
    },
    41590: (e, t, n) => {
      n.d(t, { Drawer: () => m })
      var r = n(50959),
        o = n(50151),
        i = n(97754),
        a = n(36174),
        s = n(42842),
        c = n(37558),
        u = n(29197),
        l = n(86656),
        d = n(66076)
      function m(e) {
        const {
            position: t = 'Bottom',
            onClose: n,
            children: l,
            className: m,
            theme: f = d,
          } = e,
          v = (0, o.ensureNotNull)((0, r.useContext)(c.DrawerContext)),
          [p] = (0, r.useState)(() => (0, a.randomHash)()),
          E = (0, r.useRef)(null),
          _ = (0, r.useContext)(u.CloseDelegateContext)
        return (
          (0, r.useLayoutEffect)(
            () => (
              (0, o.ensureNotNull)(E.current).focus({ preventScroll: !0 }),
              _.subscribe(v, n),
              v.addDrawer(p),
              () => {
                v.removeDrawer(p), _.unsubscribe(v, n)
              }
            ),
            [],
          ),
          r.createElement(
            s.Portal,
            null,
            r.createElement(
              'div',
              { className: i(d.wrap, d[`position${t}`]) },
              p === v.currentDrawer &&
                r.createElement('div', { className: d.backdrop, onClick: n }),
              r.createElement(
                h,
                {
                  className: i(f.drawer, d[`position${t}`], m),
                  ref: E,
                  'data-name': e['data-name'],
                },
                l,
              ),
            ),
          )
        )
      }
      const h = (0, r.forwardRef)((e, t) => {
        const { className: n, ...o } = e
        return r.createElement(l.TouchScrollContainer, {
          className: i(d.drawer, n),
          tabIndex: -1,
          ref: t,
          ...o,
        })
      })
    },
    86431: (e, t, n) => {
      n.d(t, { makeOverlapable: () => i })
      var r = n(50959),
        o = n(42842)
      function i(e) {
        return class extends r.PureComponent {
          render() {
            const { isOpened: t, root: n } = this.props
            if (!t) return null
            const i = r.createElement(e, { ...this.props, zIndex: 150 })
            return 'parent' === n ? i : r.createElement(o.Portal, null, i)
          }
        }
      }
    },
    86656: (e, t, n) => {
      n.d(t, { TouchScrollContainer: () => s })
      var r = n(50959),
        o = n(59142),
        i = n(50151),
        a = n(49483)
      const s = (0, r.forwardRef)((e, t) => {
        const { children: n, ...i } = e,
          s = (0, r.useRef)(null)
        return (
          (0, r.useImperativeHandle)(t, () => s.current),
          (0, r.useLayoutEffect)(() => {
            if (a.CheckMobile.iOS())
              return (
                null !== s.current &&
                  (0, o.disableBodyScroll)(s.current, { allowTouchMove: c(s) }),
                () => {
                  null !== s.current && (0, o.enableBodyScroll)(s.current)
                }
              )
          }, []),
          r.createElement('div', { ref: s, ...i }, n)
        )
      })
      function c(e) {
        return (t) => {
          const n = (0, i.ensureNotNull)(e.current),
            r = document.activeElement
          return (
            !n.contains(t) || (null !== r && n.contains(r) && r.contains(t))
          )
        }
      }
    },
    81261: (e, t, n) => {
      n.d(t, {
        focusFirstMenuItem: () => u,
        handleAccessibleMenuFocus: () => s,
        handleAccessibleMenuKeyDown: () => c,
        queryMenuElements: () => m,
      })
      var r = n(16838),
        o = n(71468),
        i = n(68335)
      const a = [37, 39, 38, 40]
      function s(e, t) {
        e.target &&
          r.PLATFORM_ACCESSIBILITY_ENABLED &&
          e.relatedTarget === t.current &&
          u(e.target)
      }
      function c(e) {
        var t
        if (!r.PLATFORM_ACCESSIBILITY_ENABLED) return
        if (e.defaultPrevented) return
        const n = (0, i.hashFromEvent)(e)
        if (!a.includes(n)) return
        const s = document.activeElement
        if (!(document.activeElement instanceof HTMLElement)) return
        const c = m(e.currentTarget).sort(r.navigationOrderComparator)
        if (0 === c.length) return
        const u =
          document.activeElement.closest('[data-role="menuitem"]') ||
          (null === (t = document.activeElement.parentElement) || void 0 === t
            ? void 0
            : t.querySelector('[data-role="menuitem"]'))
        if (!(u instanceof HTMLElement)) return
        const f = c.indexOf(u)
        if (-1 === f) return
        const v = h(u),
          p = v.indexOf(document.activeElement),
          E = -1 !== p,
          _ = (e) => {
            s && (0, o.becomeSecondaryElement)(s),
              (0, o.becomeMainElement)(e),
              e.focus()
          }
        switch ((0, r.mapKeyCodeToDirection)(n)) {
          case 'inlinePrev':
            if (!v.length) return
            e.preventDefault(),
              _(0 === p ? c[f] : E ? l(v, p, -1) : v[v.length - 1])
            break
          case 'inlineNext':
            if (!v.length) return
            e.preventDefault(),
              p === v.length - 1 ? _(c[f]) : _(E ? l(v, p, 1) : v[0])
            break
          case 'blockPrev': {
            e.preventDefault()
            const t = l(c, f, -1)
            if (E) {
              const e = d(t, p)
              _(e || t)
              break
            }
            _(t)
            break
          }
          case 'blockNext': {
            e.preventDefault()
            const t = l(c, f, 1)
            if (E) {
              const e = d(t, p)
              _(e || t)
              break
            }
            _(t)
          }
        }
      }
      function u(e) {
        const [t] = m(e)
        t && ((0, o.becomeMainElement)(t), t.focus())
      }
      function l(e, t, n) {
        return e[(t + e.length + n) % e.length]
      }
      function d(e, t) {
        const n = h(e)
        return n.length ? n[(t + n.length) % n.length] : null
      }
      function m(e) {
        return Array.from(
          e.querySelectorAll(
            '[data-role="menuitem"]:not([disabled]):not([aria-disabled])',
          ),
        ).filter((0, r.createScopedVisibleElementFilter)(e))
      }
      function h(e) {
        return Array.from(
          e.querySelectorAll('[tabindex]:not([disabled]):not([aria-disabled])'),
        ).filter((0, r.createScopedVisibleElementFilter)(e))
      }
    },
    71468: (e, t, n) => {
      function r(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function o(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      n.d(t, { becomeMainElement: () => r, becomeSecondaryElement: () => o })
    },
    20323: (e, t, n) => {
      n.r(t), n.d(t, { ContextMenuRenderer: () => c })
      var r = n(50959),
        o = n(962),
        i = n(91561),
        a = n(38223),
        s = n(50655)
      class c {
        constructor(e, t, n, o) {
          ;(this._root = document.createElement('div')),
            (this._isShown = !1),
            (this._manager = null),
            (this._props = {
              isOpened: !1,
              items: e,
              position: { x: 0, y: 0 },
              menuStatName: t.statName,
              mode: t.mode,
              'data-name': t['data-name'],
              isKeyboardEvent: t.isKeyboardEvent,
            }),
            (this._onDestroy = n),
            (this._onShow = o),
            (this._activeElement = document.activeElement),
            (this._returnFocus = t.returnFocus),
            (this._takeFocus = t.takeFocus),
            (this._menuElementRef = r.createRef()),
            (this._doNotCloseOn = t.doNotCloseOn),
            t.manager && (this._manager = t.manager)
        }
        show(e) {
          this._onShow && this._onShow(),
            (this._isShown = !0),
            this._render({
              ...this._props,
              position: (t) => {
                var n, r, o, i, s, c, u
                const {
                  contentWidth: l,
                  contentHeight: d,
                  availableWidth: m,
                  availableHeight: h,
                } = t
                let f
                if (void 0 !== e.box) f = e.box
                else {
                  f = {
                    x:
                      null !==
                        (r =
                          null === (n = e.touches) || void 0 === n
                            ? void 0
                            : n[0].clientX) && void 0 !== r
                        ? r
                        : e.clientX,
                    y:
                      null !==
                        (i =
                          null === (o = e.touches) || void 0 === o
                            ? void 0
                            : o[0].clientY) && void 0 !== i
                        ? i
                        : e.clientY,
                    w: 0,
                    h: 0,
                  }
                }
                const v = null !== (s = e.marginX) && void 0 !== s ? s : 0,
                  p = null !== (c = e.marginY) && void 0 !== c ? c : 0
                let E, _
                switch (
                  ((E =
                    void 0 === e.attachToXBy
                      ? (0, a.isRtl)()
                        ? 'right'
                        : 'left'
                      : 'auto' === e.attachToXBy
                        ? (0, a.isRtl)()
                          ? f.x - v - l >= 0
                            ? 'right'
                            : 'left'
                          : f.x + f.w + v + l <= m
                            ? 'left'
                            : 'right'
                        : e.attachToXBy),
                  E)
                ) {
                  case 'left':
                    _ = f.x + f.w + v
                    break
                  case 'right':
                    _ = f.x - l - v
                }
                let b,
                  g = null !== (u = e.attachToYBy) && void 0 !== u ? u : 'auto'
                'auto-strict' === g &&
                  (g = h < f.y + f.h + p + d ? 'bottom' : 'top')
                let w = f.y
                switch (g) {
                  case 'top':
                    ;(w = f.y + f.h + p), (b = d > h - w ? h - w : void 0)
                    break
                  case 'bottom':
                    ;(w = Math.max(0, f.y - p - d)),
                      (b = 0 === w ? f.y - p : void 0)
                }
                return { x: _, y: w, overrideHeight: b }
              },
              isOpened: !0,
              onClose: () => {
                this.hide(), this._unmount()
              },
              doNotCloseOn: this._doNotCloseOn,
              takeFocus: this._takeFocus,
              menuElementReference: this._menuElementRef,
            })
        }
        hide() {
          ;(this._isShown = !1), this._render({ ...this._props, isOpened: !1 })
        }
        isShown() {
          return this._isShown
        }
        _unmount() {
          ;(this._isShown = !1),
            o.unmountComponentAtNode(this._root),
            this._onDestroy && this._onDestroy(),
            this._returnFocus &&
              this._activeElement instanceof HTMLElement &&
              this._activeElement.focus({ preventScroll: !0 })
        }
        _render(e) {
          o.render(
            r.createElement(
              s.SlotContext.Provider,
              { value: this._manager },
              r.createElement(i.OverlapContextMenu, { ...e }),
            ),
            this._root,
          )
        }
      }
    },
    25931: (e, t, n) => {
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
    72482: (e) => {
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
