;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1584],
  {
    470048: (e) => {
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
    966076: (e) => {
      e.exports = {
        'default-drawer-min-top-distance': '100px',
        wrap: 'wrap-_HnK0UIN',
        positionBottom: 'positionBottom-_HnK0UIN',
        backdrop: 'backdrop-_HnK0UIN',
        drawer: 'drawer-_HnK0UIN',
        positionLeft: 'positionLeft-_HnK0UIN',
      }
    },
    408323: (e, t, n) => {
      n.d(t, { CheckboxInput: () => l })
      var r = n(50959),
        o = n(497754),
        i = n(800417),
        a = n(72571),
        s = n(465890),
        c = n(470048),
        u = n.n(c)
      function l(e) {
        const t = o(u().box, u()[`intent-${e.intent}`], {
            [u().check]: !Boolean(e.indeterminate),
            [u().dot]: Boolean(e.indeterminate),
            [u().noOutline]: -1 === e.tabIndex,
          }),
          n = o(u().wrapper, e.className)
        return r.createElement(
          'span',
          { className: n, title: e.title, style: e.style },
          r.createElement('input', {
            id: e.id,
            tabIndex: e.tabIndex,
            className: u().input,
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
          r.createElement(
            'span',
            { className: t },
            r.createElement(a.Icon, { icon: s, className: u().icon }),
          ),
        )
      }
    },
    718736: (e, t, n) => {
      n.d(t, { useFunctionalRefObject: () => i })
      var r = n(50959),
        o = n(855393)
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
    855393: (e, t, n) => {
      n.d(t, { useIsomorphicLayoutEffect: () => o })
      var r = n(50959)
      function o(e, t) {
        ;('undefined' == typeof window ? r.useEffect : r.useLayoutEffect)(e, t)
      }
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
    738036: (e, t, n) => {
      n.d(t, { OutsideEvent: () => o })
      var r = n(908783)
      function o(e) {
        const { children: t, ...n } = e
        return t((0, r.useOutsideEvent)(n))
      }
    },
    865266: (e, t, n) => {
      n.d(t, { useRovingTabindexElement: () => a })
      var r = n(50959),
        o = n(718736),
        i = n(892932)
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
    163694: (e, t, n) => {
      n.d(t, { DrawerContext: () => a, DrawerManager: () => i })
      var r = n(50959),
        o = n(285089)
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
    759339: (e, t, n) => {
      n.d(t, { Drawer: () => h })
      var r = n(50959),
        o = n(650151),
        i = n(497754),
        a = n(189904),
        s = n(813113),
        c = n(163694),
        u = n(28466),
        l = n(742554),
        d = n(966076)
      function h(e) {
        const {
            position: t = 'Bottom',
            onClose: n,
            children: l,
            className: h,
            theme: v = d,
          } = e,
          f = (0, o.ensureNotNull)((0, r.useContext)(c.DrawerContext)),
          [p] = (0, r.useState)(() => (0, a.randomHash)()),
          _ = (0, r.useRef)(null),
          E = (0, r.useContext)(u.CloseDelegateContext)
        return (
          (0, r.useLayoutEffect)(
            () => (
              (0, o.ensureNotNull)(_.current).focus({ preventScroll: !0 }),
              E.subscribe(f, n),
              f.addDrawer(p),
              () => {
                f.removeDrawer(p), E.unsubscribe(f, n)
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
              p === f.currentDrawer &&
                r.createElement('div', { className: d.backdrop, onClick: n }),
              r.createElement(
                m,
                {
                  className: i(v.drawer, d[`position${t}`], h),
                  ref: _,
                  'data-name': e['data-name'],
                },
                l,
              ),
            ),
          )
        )
      }
      const m = (0, r.forwardRef)((e, t) => {
        const { className: n, ...o } = e
        return r.createElement(l.TouchScrollContainer, {
          className: i(d.drawer, n),
          tabIndex: -1,
          ref: t,
          ...o,
        })
      })
    },
    874485: (e, t, n) => {
      n.d(t, { makeOverlapable: () => i })
      var r = n(50959),
        o = n(813113)
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
    742554: (e, t, n) => {
      n.d(t, { TouchScrollContainer: () => s })
      var r = n(50959),
        o = n(259142),
        i = n(650151),
        a = n(601227)
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
    27164: (e, t, n) => {
      function r(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function o(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      n.d(t, { becomeMainElement: () => r, becomeSecondaryElement: () => o })
    },
    429107: (e, t, n) => {
      n.r(t), n.d(t, { ContextMenuRenderer: () => c })
      var r = n(50959),
        o = n(500962),
        i = n(820883),
        a = n(710263),
        s = n(753327)
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
                  availableWidth: h,
                  availableHeight: m,
                } = t
                let v
                if (void 0 !== e.box) v = e.box
                else {
                  v = {
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
                const f = null !== (s = e.marginX) && void 0 !== s ? s : 0,
                  p = null !== (c = e.marginY) && void 0 !== c ? c : 0
                let _, E
                switch (
                  ((_ =
                    void 0 === e.attachToXBy
                      ? (0, a.isRtl)()
                        ? 'right'
                        : 'left'
                      : 'auto' === e.attachToXBy
                        ? (0, a.isRtl)()
                          ? v.x - f - l >= 0
                            ? 'right'
                            : 'left'
                          : v.x + v.w + f + l <= h
                            ? 'left'
                            : 'right'
                        : e.attachToXBy),
                  _)
                ) {
                  case 'left':
                    E = v.x + v.w + f
                    break
                  case 'right':
                    E = v.x - l - f
                }
                let b,
                  w = null !== (u = e.attachToYBy) && void 0 !== u ? u : 'auto'
                'auto-strict' === w &&
                  (w = m < v.y + v.h + p + d ? 'bottom' : 'top')
                let g = v.y
                switch (w) {
                  case 'top':
                    ;(g = v.y + v.h + p), (b = d > m - g ? m - g : void 0)
                    break
                  case 'bottom':
                    ;(g = Math.max(0, v.y - p - d)),
                      (b = 0 === g ? v.y - p : void 0)
                }
                return { x: E, y: g, overrideHeight: b }
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
    465890: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>'
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
