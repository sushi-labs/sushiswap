;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8890],
  {
    59142: (e, t) => {
      var n, o, l
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
          var l =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            a = [],
            r = !1,
            i = -1,
            s = void 0,
            c = void 0,
            u = (e) =>
              a.some(
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
            m = () => {
              setTimeout(() => {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== s &&
                    ((document.body.style.overflow = s), (s = void 0))
              })
            }
          ;(e.disableBodyScroll = (e, o) => {
            if (l) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (e && !a.some((t) => t.targetElement === e)) {
                var m = { targetElement: e, options: o || {} }
                ;(a = [].concat(t(a), [m])),
                  (e.ontouchstart = (e) => {
                    1 === e.targetTouches.length &&
                      (i = e.targetTouches[0].clientY)
                  }),
                  (e.ontouchmove = (t) => {
                    var n, o, l, a
                    1 === t.targetTouches.length &&
                      ((o = e),
                      (a = (n = t).targetTouches[0].clientY - i),
                      !u(n.target) &&
                        ((o && 0 === o.scrollTop && 0 < a) ||
                        ((l = o) &&
                          l.scrollHeight - l.scrollTop <= l.clientHeight &&
                          a < 0)
                          ? d(n)
                          : n.stopPropagation()))
                  }),
                  r ||
                    (document.addEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (r = !0))
              }
            } else {
              ;(v = o),
                setTimeout(() => {
                  if (void 0 === c) {
                    var e = !!v && !0 === v.reserveScrollBarGap,
                      t =
                        window.innerWidth - document.documentElement.clientWidth
                    e &&
                      0 < t &&
                      ((c = document.body.style.paddingRight),
                      (document.body.style.paddingRight = t + 'px'))
                  }
                  void 0 === s &&
                    ((s = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var f = { targetElement: e, options: o || {} }
              a = [].concat(t(a), [f])
            }
            var v
          }),
            (e.clearAllBodyScrollLocks = () => {
              l
                ? (a.forEach((e) => {
                    ;(e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null)
                  }),
                  r &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (r = !1)),
                  (a = []),
                  (i = -1))
                : (m(), (a = []))
            }),
            (e.enableBodyScroll = (e) => {
              if (l) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (a = a.filter((t) => t.targetElement !== e)),
                  r &&
                    0 === a.length &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0,
                    ),
                    (r = !1))
              } else
                1 === a.length && a[0].targetElement === e
                  ? (m(), (a = []))
                  : (a = a.filter((t) => t.targetElement !== e))
            })
        }),
        void 0 === (l = 'function' == typeof n ? n.apply(t, o) : n) ||
          (e.exports = l)
    },
    30507: (e) => {
      e.exports = {
        actionButton: 'actionButton-k53vexPa',
        small: 'small-k53vexPa',
        hiddenTitle: 'hiddenTitle-k53vexPa',
      }
    },
    55021: (e) => {
      e.exports = { label: 'label-nb7ji1l2' }
    },
    54936: (e) => {
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
    76974: (e, t, n) => {
      n.d(t, { useIsMounted: () => l })
      var o = n(50959)
      const l = () => {
        const e = (0, o.useRef)(!1)
        return (
          (0, o.useEffect)(
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
    70493: (e, t, n) => {
      n.r(t),
        n.d(t, {
          confirmModule: () => D,
          renameModule: () => L,
          showSimpleDialog: () => P,
          warningModule: () => I,
        })
      var o = n(50959),
        l = n(11542),
        a = n(97754),
        r = n(9745),
        i = n(76422),
        s = n(16181),
        c = n(68335),
        u = n(90692),
        d = n(52092),
        m = n(24437),
        f = n(86656),
        v = n(94720),
        h = n(26996),
        p = n(50151),
        g = n(76974),
        C = n(50655)
      const E = o.createContext({
        isSmallTablet: !1,
        dialogCloseHandler: () => {},
      })
      var N = n(30507)
      function w(e) {
        const {
            disabled: t,
            name: n,
            title: l,
            appearance: r,
            intent: i,
            handler: s,
            reference: c,
            type: u,
          } = e,
          { isSmallTablet: d, dialogCloseHandler: m } = (0, o.useContext)(E),
          f = (0, p.ensureNotNull)((0, o.useContext)(C.SlotContext)),
          w = (0, g.useIsMounted)(),
          [y, _] = (0, o.useState)(!1)
        return o.createElement(
          v.Button,
          {
            type: u,
            disabled: t,
            reference: c,
            className: a(N.actionButton, d && N.small),
            name: n,
            size: d ? 'l' : void 0,
            appearance: r,
            intent: i,
            onClick: () => {
              if (y) return
              const e = s({ dialogClose: m, innerManager: f })
              e &&
                (_(!0),
                e.then(() => {
                  w.current && _(!1)
                }))
            },
          },
          o.createElement('span', { className: a(y && N.hiddenTitle) }, l),
          y && o.createElement(h.Loader, { color: 'white' }),
        )
      }
      var y = n(7720),
        _ = n(54936)
      function b(e) {
        const {
          title: t,
          onClose: n,
          actions: l,
          dataName: v,
          popupDialogClassName: h,
          contentClassName: p,
          wrapperClassName: g,
          backdrop: C,
          closeOnOutsideClick: N = !0,
          showCloseButton: b = !0,
          closeOnEscapePress: S = !0,
          events: B = !0,
        } = e
        ;(0, o.useEffect)(
          () => (
            i.subscribe(d.CLOSE_POPUPS_AND_DIALOGS_COMMAND, n, null),
            () => {
              i.unsubscribe(d.CLOSE_POPUPS_AND_DIALOGS_COMMAND, n, null)
            }
          ),
          [n],
        )
        const [T, U] = (0, o.useState)(!0),
          k = (0, o.useRef)(null)
        return o.createElement(
          u.MatchMedia,
          { rule: m.DialogBreakpoints.TabletSmall },
          (i) =>
            o.createElement(
              E.Provider,
              { value: { isSmallTablet: i, dialogCloseHandler: n } },
              o.createElement(
                s.PopupDialog,
                {
                  className: a(_.popupDialog, h),
                  isOpened: T,
                  backdrop: C,
                  onClickBackdrop: B ? x : void 0,
                  onClickOutside: N ? x : void 0,
                  onKeyDown: O,
                  autofocus: !0,
                  fixedBody: !0,
                },
                o.createElement(
                  'div',
                  { className: a(_.wrap, g), 'data-name': v },
                  o.createElement(
                    'div',
                    {
                      className: a(
                        _.main,
                        !b && _.marginWithoutCloseButton,
                        i && _.small,
                      ),
                    },
                    t &&
                      o.createElement(
                        'div',
                        { className: a(_.title, i && _.small) },
                        t,
                      ),
                    ((t) => {
                      if ('html' in e)
                        return o.createElement(f.TouchScrollContainer, {
                          className: a(_.content, t && _.small, _.html, p),
                          dangerouslySetInnerHTML: { __html: e.html },
                        })
                      if ('content' in e)
                        return o.createElement(
                          f.TouchScrollContainer,
                          { className: a(_.content, t && _.small, p) },
                          e.content,
                        )
                      return null
                    })(i),
                    l &&
                      l.length > 0 &&
                      o.createElement(
                        'div',
                        { className: a(_.footer, i && _.small) },
                        l.map((e, t) =>
                          o.createElement(w, {
                            ...e,
                            key: e.name,
                            reference: 0 === t ? k : void 0,
                          }),
                        ),
                      ),
                  ),
                  b &&
                    o.createElement(r.Icon, {
                      className: a(_.close, i && _.small),
                      icon: y,
                      onClick: x,
                      'data-name': 'close',
                      'data-role': 'button',
                    }),
                ),
              ),
            ),
        )
        function O(e) {
          switch ((0, c.hashFromEvent)(e)) {
            case 27:
              T && S && (e.preventDefault(), n())
              break
            case 13:
              const t = document.activeElement
              if (
                e.defaultPrevented ||
                (t instanceof HTMLButtonElement && 'submit' !== t.type)
              )
                return
              if (T && l && l.length) {
                e.preventDefault()
                const t = k.current
                t && t.click()
              }
          }
        }
        function x() {
          U(!1), n()
        }
      }
      function S(e) {
        return 'html' in e
          ? { html: e.html }
          : 'text' in e
            ? { content: e.text }
            : { content: e.content }
      }
      var B = n(21788),
        T = n(55021)
      function U(e) {
        const {
            maxLength: t,
            value: n,
            placeholder: l,
            onValueChange: a,
            nameInputRef: r,
            source: i = [],
            autocompleteFilter: s,
          } = e,
          { isSmallTablet: c } = (0, o.useContext)(E),
          u = o.useRef(null)
        return (
          (0, o.useLayoutEffect)(() => {
            u.current && u.current.select()
          }, []),
          o.createElement(
            o.Fragment,
            null,
            (() => {
              if ('content' in e)
                return o.createElement('div', { className: T.label }, e.content)
              if ('html' in e)
                return o.createElement('div', {
                  className: T.label,
                  dangerouslySetInnerHTML: { __html: e.html },
                })
              return null
            })(),
            o.createElement(B.Autocomplete, {
              maxLength: t,
              value: n,
              onChange: (e) => {
                a(e)
              },
              allowUserDefinedValues: !0,
              preventOnFocusOpen: !0,
              noEmptyText: !0,
              source: i,
              preventSearchOnEmptyQuery: !0,
              filter: s,
              setupHTMLInput: (e) => {
                ;(u.current = e), r && (r.current = e)
              },
              size: c ? 'large' : void 0,
              placeholder: l,
              suggestionsInPortal: !0,
            }),
          )
        )
      }
      function k(e) {
        return Boolean(e.trim())
      }
      function O(e) {
        const { buttonText: t, intentButton: o, actions: a } = e,
          r = [
            {
              name: 'ok',
              title: t || l.t(null, void 0, n(68988)),
              intent: o,
              handler: ({ dialogClose: e }) => {
                e()
              },
            },
          ]
        return a && a.forEach((e) => r.push(e)), r
      }
      var x = n(962)
      const M = new (n(51826).DialogsOpenerManager)()
      const D = (e) => {
          const {
              title: t,
              onClose: a = () => {},
              mainButtonText: r,
              mainButtonIntent: i,
              cancelButtonText: s,
              closeOnOutsideClick: c,
              onConfirm: u,
              onCancel: d,
            } = e,
            m = S(e)
          return o.createElement(b, {
            ...m,
            title: t || l.t(null, void 0, n(94443)),
            onClose: a,
            actions: [
              {
                name: 'yes',
                title: r || l.t(null, void 0, n(79831)),
                intent: i || 'success',
                handler: u,
              },
              {
                name: 'no',
                type: 'button',
                title: s || l.t(null, void 0, n(6255)),
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
        L = (e) => {
          const {
              title: t,
              maxLength: a,
              initValue: r,
              placeholder: i,
              onClose: s = () => {},
              mainButtonText: c,
              mainButtonIntent: u,
              cancelButtonText: d,
              validator: m = k,
              onRename: f,
              source: v,
              autocompleteFilter: h,
              onCancel: p,
            } = e,
            g = (0, o.useRef)(null),
            [C, E] = (0, o.useState)(r || ''),
            [N, w] = (0, o.useState)(() => m(C)),
            y = S(e)
          return o.createElement(b, {
            title: t || l.t(null, void 0, n(35038)),
            content: o.createElement(U, {
              ...y,
              nameInputRef: g,
              maxLength: a,
              placeholder: i,
              value: C,
              onValueChange: (e) => {
                E(e), w(m(e))
              },
              source: v,
              autocompleteFilter: h,
            }),
            onClose: s,
            actions: [
              {
                disabled: !N,
                name: 'save',
                title: c || l.t(null, void 0, n(85520)),
                intent: u || 'primary',
                handler: ({ dialogClose: e, innerManager: t }) =>
                  f({
                    newValue: C,
                    focusInput: _,
                    dialogClose: e,
                    innerManager: t,
                  }),
              },
              {
                name: 'cancel',
                type: 'button',
                title: d || l.t(null, void 0, n(20036)),
                appearance: 'stroke',
                intent: 'default',
                handler: (e) => {
                  p ? p(e) : e.dialogClose()
                },
              },
            ],
            dataName: 'rename-dialog',
          })
          function _() {
            g.current && g.current.focus()
          }
        },
        I = (e) => {
          const { title: t, closeOnOutsideClick: a, onClose: r = () => {} } = e,
            i = S(e)
          return o.createElement(b, {
            ...i,
            title: t || l.t(null, void 0, n(33603)),
            onClose: r,
            actions: O(e),
            dataName: 'warning-dialog',
            closeOnOutsideClick: a,
          })
        },
        P = (e, t, n) => {
          const { title: l } = e
          let a = `${l}_`
          if (
            ((a += 'text' in e ? e.text : 'html' in e ? e.html : e.id),
            M.isOpened(a))
          )
            return (0, p.ensureDefined)(M.getDialogPayload(a)).closeHandler
          const r = document.createElement('div'),
            i = () => {
              var t
              null === (t = e.onClose) || void 0 === t || t.call(e),
                x.unmountComponentAtNode(r),
                M.setAsClosed(a)
            }
          return (
            x.render(
              o.createElement(
                C.SlotContext.Provider,
                { value: n || null },
                o.createElement(t, { ...e, onClose: i }),
              ),
              r,
            ),
            M.setAsOpened(a, { closeHandler: i }),
            i
          )
        }
    },
    51826: (e, t, n) => {
      n.d(t, { DialogsOpenerManager: () => o, dialogsOpenerManager: () => l })
      class o {
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
      const l = new o()
    },
    86656: (e, t, n) => {
      n.d(t, { TouchScrollContainer: () => i })
      var o = n(50959),
        l = n(59142),
        a = n(50151),
        r = n(49483)
      const i = (0, o.forwardRef)((e, t) => {
        const { children: n, ...a } = e,
          i = (0, o.useRef)(null)
        return (
          (0, o.useImperativeHandle)(t, () => i.current),
          (0, o.useLayoutEffect)(() => {
            if (r.CheckMobile.iOS())
              return (
                null !== i.current &&
                  (0, l.disableBodyScroll)(i.current, { allowTouchMove: s(i) }),
                () => {
                  null !== i.current && (0, l.enableBodyScroll)(i.current)
                }
              )
          }, []),
          o.createElement('div', { ref: i, ...a }, n)
        )
      })
      function s(e) {
        return (t) => {
          const n = (0, a.ensureNotNull)(e.current),
            o = document.activeElement
          return (
            !n.contains(t) || (null !== o && n.contains(o) && o.contains(t))
          )
        }
      }
    },
    7720: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17" fill="currentColor"><path d="m.58 1.42.82-.82 15 15-.82.82z"/><path d="m.58 15.58 15-15 .82.82-15 15z"/></svg>'
    },
    94443: (e) => {
      e.exports = {
        ar: ['تأكيد'],
        ca_ES: ['Confirmació'],
        cs: ['Potvrzení'],
        de: ['Bestätigung'],
        el: ['Επιβεβαίωση'],
        en: 'Confirmation',
        es: ['Confirmación'],
        fa: ['تاییدیه'],
        fr: 'Confirmation',
        he_IL: ['אישור'],
        hu_HU: ['Megerősítés'],
        id_ID: ['Konfirmasi'],
        it: ['Conferma'],
        ja: ['確認'],
        ko: ['확인'],
        ms_MY: ['Pengesahan'],
        nl_NL: ['Bevestig'],
        pl: ['Potwierdzenie'],
        pt: ['Confirmação'],
        ro: 'Confirmation',
        ru: ['Подтвердите действие'],
        sv: ['Bekräftelse'],
        th: ['การยืนยัน'],
        tr: ['Onaylama'],
        vi: ['Xác nhận'],
        zh: ['确认'],
        zh_TW: ['確認'],
      }
    },
    6255: (e) => {
      e.exports = {
        ar: ['لا'],
        ca_ES: 'No',
        cs: ['Ne'],
        de: ['Nein'],
        el: 'No',
        en: 'No',
        es: 'No',
        fa: 'No',
        fr: ['Non'],
        he_IL: ['לא'],
        hu_HU: ['Nem'],
        id_ID: ['Tidak'],
        it: 'No',
        ja: ['いいえ'],
        ko: ['아니오'],
        ms_MY: ['Tidak'],
        nl_NL: 'No',
        pl: ['Nie'],
        pt: ['Não'],
        ro: 'No',
        ru: ['Нет'],
        sv: ['Nej'],
        th: ['ไม่'],
        tr: ['Hayır'],
        vi: ['Không'],
        zh: ['否'],
        zh_TW: ['否'],
      }
    },
    35038: (e) => {
      e.exports = {
        ar: ['تغيير الأسم'],
        ca_ES: ['Reanomenar'],
        cs: 'Rename',
        de: ['Umbenennen'],
        el: 'Rename',
        en: 'Rename',
        es: ['Renombrar.'],
        fa: 'Rename',
        fr: ['Renommer'],
        he_IL: ['שנה שם'],
        hu_HU: ['Átnevezés'],
        id_ID: ['Mengganti Nama'],
        it: ['Rinomina'],
        ja: ['名前の変更'],
        ko: ['이름 바꾸기'],
        ms_MY: ['Namakan semula'],
        nl_NL: 'Rename',
        pl: ['Zmień nazwę'],
        pt: ['Renomear'],
        ro: 'Rename',
        ru: ['Переименовать'],
        sv: ['Döp om'],
        th: ['เปลี่ยนชื่อ'],
        tr: ['Yeni Ad Ver'],
        vi: ['Đổi tên'],
        zh: ['重命名'],
        zh_TW: ['重新命名'],
      }
    },
    79831: (e) => {
      e.exports = {
        ar: ['نعم'],
        ca_ES: ['Sí'],
        cs: ['Ano'],
        de: ['Ja'],
        el: 'Yes',
        en: 'Yes',
        es: ['Sí'],
        fa: 'Yes',
        fr: ['Oui'],
        he_IL: ['כן'],
        hu_HU: ['Igen'],
        id_ID: ['Ya'],
        it: ['Sì'],
        ja: ['はい'],
        ko: ['예'],
        ms_MY: ['Ya'],
        nl_NL: 'Yes',
        pl: ['Tak'],
        pt: ['Sim'],
        ro: 'Yes',
        ru: ['Да'],
        sv: ['Ja'],
        th: ['ใช่'],
        tr: ['Evet'],
        vi: ['Có'],
        zh: ['是'],
        zh_TW: ['是'],
      }
    },
  },
])
