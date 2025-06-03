;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5164],
  {
    88803: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
      }
    },
    82434: (e) => {
      e.exports = { scrollWrap: 'scrollWrap-FaOvTD2r' }
    },
    77253: (e) => {
      e.exports = {
        wrap: 'wrap-vSb6C0Bj',
        'wrap--horizontal': 'wrap--horizontal-vSb6C0Bj',
        bar: 'bar-vSb6C0Bj',
        barInner: 'barInner-vSb6C0Bj',
        'barInner--horizontal': 'barInner--horizontal-vSb6C0Bj',
        'bar--horizontal': 'bar--horizontal-vSb6C0Bj',
      }
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
    67842: (e, t, r) => {
      r.d(t, { useResizeObserver: () => a })
      var n = r(50959),
        o = r(59255),
        i = r(43010),
        s = r(39416)
      function a(e, t = []) {
        const { callback: r, ref: a = null } = ((e) =>
            'function' == typeof e ? { callback: e } : e)(e),
          l = (0, n.useRef)(null),
          c = (0, n.useRef)(r)
        c.current = r
        const u = (0, s.useFunctionalRefObject)(a),
          v = (0, n.useCallback)(
            (e) => {
              u(e),
                null !== l.current &&
                  (l.current.disconnect(), null !== e && l.current.observe(e))
            },
            [u, l],
          )
        return (
          (0, i.useIsomorphicLayoutEffect)(
            () => (
              (l.current = new o.default((e, t) => {
                c.current(e, t)
              })),
              u.current && v(u.current),
              () => {
                var e
                null === (e = l.current) || void 0 === e || e.disconnect()
              }
            ),
            [u, ...t],
          ),
          v
        )
      }
    },
    24437: (e, t, r) => {
      r.d(t, { DialogBreakpoints: () => o })
      var n = r(88803)
      const o = {
        SmallHeight: n['small-height-breakpoint'],
        TabletSmall: n['tablet-small-breakpoint'],
        TabletNormal: n['tablet-normal-breakpoint'],
      }
    },
    3085: (e, t, r) => {
      r.d(t, { OverlayScrollContainer: () => f })
      var n = r(50959),
        o = r(97754),
        i = r.n(o),
        s = r(38223),
        a = r(50151),
        l = r(37160)
      const c = r(77253),
        u = {
          0: {
            isHorizontal: !1,
            isNegative: !1,
            sizePropName: 'height',
            minSizePropName: 'minHeight',
            startPointPropName: 'top',
            currentMousePointPropName: 'clientY',
            progressBarTransform: 'translateY',
          },
          1: {
            isHorizontal: !0,
            isNegative: !1,
            sizePropName: 'width',
            minSizePropName: 'minWidth',
            startPointPropName: 'left',
            currentMousePointPropName: 'clientX',
            progressBarTransform: 'translateX',
          },
          2: {
            isHorizontal: !0,
            isNegative: !0,
            sizePropName: 'width',
            minSizePropName: 'minWidth',
            startPointPropName: 'right',
            currentMousePointPropName: 'clientX',
            progressBarTransform: 'translateX',
          },
        },
        v = 40
      function d(e) {
        const {
            size: t,
            scrollSize: r,
            clientSize: o,
            scrollProgress: s,
            onScrollProgressChange: d,
            scrollMode: h,
            theme: m = c,
            onDragStart: f,
            onDragEnd: p,
            minBarSize: g = v,
          } = e,
          b = (0, n.useRef)(null),
          z = (0, n.useRef)(null),
          [N, k] = (0, n.useState)(!1),
          P = (0, n.useRef)(0),
          {
            isHorizontal: w,
            isNegative: C,
            sizePropName: L,
            minSizePropName: S,
            startPointPropName: M,
            currentMousePointPropName: E,
            progressBarTransform: T,
          } = u[h]
        ;(0, n.useEffect)(() => {
          const e = (0, a.ensureNotNull)(b.current).ownerDocument
          return (
            N
              ? (f && f(),
                e &&
                  (e.addEventListener('mousemove', O),
                  e.addEventListener('mouseup', W)))
              : p && p(),
            () => {
              e &&
                (e.removeEventListener('mousemove', O),
                e.removeEventListener('mouseup', W))
            }
          )
        }, [N])
        const x = t / r || 0,
          _ = o * x || 0,
          H = Math.max(_, g),
          R = (t - H) / (t - _),
          D = r - t,
          B = C ? -D : 0,
          y = C ? 0 : D,
          F = j((0, l.clamp)(s, B, y)) || 0
        return n.createElement(
          'div',
          {
            ref: b,
            className: i()(m.wrap, w && m['wrap--horizontal']),
            style: { [L]: t },
            onMouseDown: (e) => {
              if (e.isDefaultPrevented()) return
              e.preventDefault()
              const t = I(e.nativeEvent, (0, a.ensureNotNull)(b.current)),
                r = Math.sign(t),
                n = (0, a.ensureNotNull)(z.current).getBoundingClientRect()
              P.current = (r * n[L]) / 2
              let o = Math.abs(t) - Math.abs(P.current)
              const i = j(D)
              o < 0
                ? ((o = 0), (P.current = t))
                : o > i && ((o = i), (P.current = t - r * i))
              d(A(r * o)), k(!0)
            },
          },
          n.createElement(
            'div',
            {
              ref: z,
              className: i()(m.bar, w && m['bar--horizontal']),
              style: { [S]: g, [L]: H, transform: `${T}(${F}px)` },
              onMouseDown: (e) => {
                e.preventDefault(),
                  (P.current = I(
                    e.nativeEvent,
                    (0, a.ensureNotNull)(z.current),
                  )),
                  k(!0)
              },
            },
            n.createElement('div', {
              className: i()(m.barInner, w && m['barInner--horizontal']),
            }),
          ),
        )
        function O(e) {
          const t = I(e, (0, a.ensureNotNull)(b.current)) - P.current
          d(A(t))
        }
        function W() {
          k(!1)
        }
        function I(e, t) {
          const r = t.getBoundingClientRect()[M]
          return e[E] - r
        }
        function j(e) {
          return e * x * R
        }
        function A(e) {
          return e / x / R
        }
      }
      var h = r(70412),
        m = r(82434)
      function f(e) {
        const {
            reference: t,
            className: r,
            containerHeight: i = 0,
            containerWidth: a = 0,
            contentHeight: l = 0,
            contentWidth: c = 0,
            scrollPosTop: u = 0,
            scrollPosLeft: v = 0,
            onVerticalChange: f,
            onHorizontalChange: p,
            visible: g,
          } = e,
          [b, z] = (0, h.useHover)(),
          [N, k] = (0, n.useState)(!1),
          P = i < l,
          w = a < c,
          C = P && w ? 8 : 0
        return n.createElement(
          'div',
          {
            ...z,
            ref: t,
            className: o(r, m.scrollWrap),
            style: { visibility: g || b || N ? 'visible' : 'hidden' },
          },
          P &&
            n.createElement(d, {
              size: i - C,
              scrollSize: l - C,
              clientSize: i - C,
              scrollProgress: u,
              onScrollProgressChange: (e) => {
                f && f(e)
              },
              onDragStart: L,
              onDragEnd: S,
              scrollMode: 0,
            }),
          w &&
            n.createElement(d, {
              size: a - C,
              scrollSize: c - C,
              clientSize: a - C,
              scrollProgress: v,
              onScrollProgressChange: (e) => {
                p && p(e)
              },
              onDragStart: L,
              onDragEnd: S,
              scrollMode: (0, s.isRtl)() ? 2 : 1,
            }),
        )
        function L() {
          k(!0)
        }
        function S() {
          k(!1)
        }
      }
    },
    36189: (e, t, r) => {
      r.d(t, { FavoriteButton: () => v })
      var n = r(11542),
        o = r(50959),
        i = r(97754),
        s = r(9745),
        a = r(39146),
        l = r(48010),
        c = r(14877)
      const u = {
        add: n.t(null, void 0, r(44629)),
        remove: n.t(null, void 0, r(72482)),
      }
      function v(e) {
        const { className: t, isFilled: r, isActive: n, onClick: v, ...d } = e
        return o.createElement(s.Icon, {
          ...d,
          className: i(
            c.favorite,
            'apply-common-tooltip',
            r && c.checked,
            n && c.active,
            t,
          ),
          icon: r ? a : l,
          onClick: v,
          title: r ? u.remove : u.add,
        })
      }
    },
    898: (e, t, r) => {
      r.d(t, { useDimensions: () => i })
      var n = r(50959),
        o = r(67842)
      function i(e) {
        const [t, r] = (0, n.useState)(null),
          i = (0, n.useCallback)(
            ([e]) => {
              const n = e.target.getBoundingClientRect()
              ;(n.width === (null == t ? void 0 : t.width) &&
                n.height === t.height) ||
                r(n)
            },
            [t],
          )
        return [(0, o.useResizeObserver)({ callback: i, ref: e }), t]
      }
    },
    70412: (e, t, r) => {
      r.d(t, {
        hoverMouseEventFilter: () => i,
        useAccurateHover: () => s,
        useHover: () => o,
      })
      var n = r(50959)
      function o() {
        const [e, t] = (0, n.useState)(!1)
        return [
          e,
          {
            onMouseOver: (e) => {
              i(e) && t(!0)
            },
            onMouseOut: (e) => {
              i(e) && t(!1)
            },
          },
        ]
      }
      function i(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function s(e) {
        const [t, r] = (0, n.useState)(!1)
        return (
          (0, n.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return
              const n = e.current.contains(t.target)
              r(n)
            }
            return (
              document.addEventListener('mouseover', t),
              () => document.removeEventListener('mouseover', t)
            )
          }, []),
          t
        )
      }
    },
    33127: (e, t, r) => {
      r.d(t, { useOverlayScroll: () => l })
      var n = r(50959),
        o = r(50151),
        i = r(70412),
        s = r(49483)
      const a = { onMouseOver: () => {}, onMouseOut: () => {} }
      function l(e, t = s.CheckMobile.any()) {
        const r = (0, n.useRef)(null),
          l = e || (0, n.useRef)(null),
          [c, u] = (0, i.useHover)(),
          [v, d] = (0, n.useState)({
            reference: r,
            containerHeight: 0,
            containerWidth: 0,
            contentHeight: 0,
            contentWidth: 0,
            scrollPosTop: 0,
            scrollPosLeft: 0,
            onVerticalChange: (e) => {
              d((t) => ({ ...t, scrollPosTop: e })),
                ((0, o.ensureNotNull)(l.current).scrollTop = e)
            },
            onHorizontalChange: (e) => {
              d((t) => ({ ...t, scrollPosLeft: e })),
                ((0, o.ensureNotNull)(l.current).scrollLeft = e)
            },
            visible: c,
          }),
          h = (0, n.useCallback)(() => {
            if (!l.current) return
            const {
                clientHeight: e,
                scrollHeight: t,
                scrollTop: n,
                clientWidth: o,
                scrollWidth: i,
                scrollLeft: s,
              } = l.current,
              a = r.current ? r.current.offsetTop : 0
            d((r) => ({
              ...r,
              containerHeight: e - a,
              contentHeight: t - a,
              scrollPosTop: n,
              containerWidth: o,
              contentWidth: i,
              scrollPosLeft: s,
            }))
          }, [])
        function m() {
          d((e) => ({
            ...e,
            scrollPosTop: (0, o.ensureNotNull)(l.current).scrollTop,
            scrollPosLeft: (0, o.ensureNotNull)(l.current).scrollLeft,
          }))
        }
        return (
          (0, n.useEffect)(() => {
            c && h(), d((e) => ({ ...e, visible: c }))
          }, [c]),
          (0, n.useEffect)(() => {
            const e = l.current
            return (
              e && e.addEventListener('scroll', m),
              () => {
                e && e.removeEventListener('scroll', m)
              }
            )
          }, [l]),
          [v, t ? a : u, l, h]
        )
      }
    },
    96040: (e, t, r) => {
      r.d(t, { RemoveButton: () => c })
      var n = r(11542),
        o = r(50959),
        i = r(97754),
        s = r(9745),
        a = r(33765),
        l = r(27306)
      function c(e) {
        const {
          className: t,
          isActive: c,
          onClick: u,
          onMouseDown: v,
          title: d,
          hidden: h,
          'data-name': m = 'remove-button',
          ...f
        } = e
        return o.createElement(s.Icon, {
          ...f,
          'data-name': m,
          className: i(
            l.button,
            'apply-common-tooltip',
            c && l.active,
            h && l.hidden,
            t,
          ),
          icon: a,
          onClick: u,
          onMouseDown: v,
          title: d || n.t(null, void 0, r(34596)),
        })
      }
    },
    33765: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="currentColor" d="M9.707 9l4.647-4.646-.707-.708L9 8.293 4.354 3.646l-.708.708L8.293 9l-4.647 4.646.708.708L9 9.707l4.646 4.647.708-.707L9.707 9z"/></svg>'
    },
    39146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>'
    },
    48010: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>'
    },
    80395: (e) => {
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
