;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3566],
  {
    83073: (e) => {
      e.exports = {
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        footer: 'footer-PhMf7PhQ',
        submitButton: 'submitButton-PhMf7PhQ',
        buttons: 'buttons-PhMf7PhQ',
      }
    },
    30507: (e) => {
      e.exports = {
        actionButton: 'actionButton-k53vexPa',
        small: 'small-k53vexPa',
        hiddenTitle: 'hiddenTitle-k53vexPa',
      }
    },
    955021: (e) => {
      e.exports = { label: 'label-nb7ji1l2' }
    },
    854936: (e) => {
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
    902774: (e) => {
      e.exports = { icon: 'icon-EoSJnnki' }
    },
    252130: (e, t, n) => {
      n.d(t, { useIsMounted: () => o })
      var a = n(50959)
      const o = () => {
        const e = (0, a.useRef)(!1)
        return (
          (0, a.useEffect)(
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
    976669: (e, t, n) => {
      n.r(t), n.d(t, { AdaptiveConfirmDialog: () => d })
      var a = n(50959),
        o = n(497754),
        l = n.n(o),
        s = n(805184),
        i = n(650151),
        r = n(609838),
        c = n(180185),
        u = n(533408),
        m = n(83073)
      class d extends a.PureComponent {
        constructor() {
          super(...arguments),
            (this._dialogRef = a.createRef()),
            (this._handleClose = () => {
              const {
                defaultActionOnClose: e,
                onSubmit: t,
                onCancel: n,
                onClose: a,
              } = this.props
              switch (e) {
                case 'submit':
                  t()
                  break
                case 'cancel':
                  n()
              }
              a()
            }),
            (this._handleCancel = () => {
              this.props.onCancel(), this.props.onClose()
            }),
            (this._handleKeyDown = (e) => {
              const {
                onSubmit: t,
                submitButtonDisabled: n,
                submitOnEnterKey: a,
              } = this.props
              13 === (0, c.hashFromEvent)(e) &&
                a &&
                (e.preventDefault(), n || t())
            })
        }
        render() {
          const {
            render: e,
            onClose: t,
            onSubmit: n,
            onCancel: o,
            footerLeftRenderer: l,
            submitButtonText: s,
            submitButtonDisabled: i,
            defaultActionOnClose: r,
            submitOnEnterKey: c,
            ...m
          } = this.props
          return a.createElement(u.AdaptivePopupDialog, {
            ...m,
            ref: this._dialogRef,
            onKeyDown: this._handleKeyDown,
            render: this._renderChildren(),
            onClose: this._handleClose,
          })
        }
        focus() {
          ;(0, i.ensureNotNull)(this._dialogRef.current).focus()
        }
        _renderChildren() {
          return (e) => {
            const {
              render: t,
              footerLeftRenderer: o,
              additionalButtons: i,
              submitButtonText: c,
              submitButtonDisabled: u,
              onSubmit: d,
              cancelButtonText: h,
              showCancelButton: p = !0,
              submitButtonClassName: f,
              cancelButtonClassName: g,
              buttonsWrapperClassName: C,
            } = this.props
            return a.createElement(
              a.Fragment,
              null,
              t(e),
              a.createElement(
                'div',
                { className: m.footer },
                o && o(e.isSmallWidth),
                a.createElement(
                  'div',
                  { className: l()(m.buttons, C) },
                  i,
                  p &&
                    a.createElement(
                      s.Button,
                      {
                        className: g,
                        name: 'cancel',
                        appearance: 'stroke',
                        onClick: this._handleCancel,
                      },
                      null != h ? h : r.t(null, void 0, n(620036)),
                    ),
                  a.createElement(
                    'span',
                    { className: m.submitButton },
                    a.createElement(
                      s.Button,
                      {
                        className: f,
                        disabled: u,
                        name: 'submit',
                        onClick: d,
                        'data-name': 'submit-button',
                      },
                      null != c ? c : r.t(null, void 0, n(468988)),
                    ),
                  ),
                ),
              ),
            )
          }
        }
      }
      d.defaultProps = { defaultActionOnClose: 'submit', submitOnEnterKey: !0 }
    },
    531275: (e, t, n) => {
      n.d(t, { SimpleDialogContext: () => a })
      const a = n(50959).createContext({
        isSmallTablet: !1,
        dialogCloseHandler: () => {},
      })
    },
    480994: (e, t, n) => {
      n.r(t),
        n.d(t, {
          confirmModule: () => C,
          renameModule: () => b,
          showSimpleDialog: () => k,
          warningModule: () => v,
        })
      var a = n(50959),
        o = n(609838),
        l = n(859878)
      function s(e) {
        return 'html' in e
          ? { html: e.html }
          : 'text' in e
            ? { content: e.text }
            : { content: e.content }
      }
      var i = n(531275),
        r = n(73007),
        c = n(955021)
      function u(e) {
        const {
            maxLength: t,
            value: n,
            placeholder: o,
            onValueChange: l,
            nameInputRef: s,
            source: u = [],
            autocompleteFilter: m,
          } = e,
          { isSmallTablet: d } = (0, a.useContext)(i.SimpleDialogContext),
          h = a.useRef(null)
        return (
          (0, a.useLayoutEffect)(() => {
            h.current && h.current.select()
          }, []),
          a.createElement(
            a.Fragment,
            null,
            (() => {
              if ('content' in e)
                return a.createElement('div', { className: c.label }, e.content)
              if ('html' in e)
                return a.createElement('div', {
                  className: c.label,
                  dangerouslySetInnerHTML: { __html: e.html },
                })
              return null
            })(),
            a.createElement(r.Autocomplete, {
              maxLength: t,
              value: n,
              onChange: (e) => {
                l(e)
              },
              allowUserDefinedValues: !0,
              preventOnFocusOpen: !0,
              noEmptyText: !0,
              source: u,
              preventSearchOnEmptyQuery: !0,
              filter: m,
              setupHTMLInput: (e) => {
                ;(h.current = e), s && (s.current = e)
              },
              size: d ? 'large' : void 0,
              placeholder: o,
              suggestionsInPortal: !0,
            }),
          )
        )
      }
      function m(e) {
        return Boolean(e.trim())
      }
      function d(e) {
        const { buttonText: t, intentButton: a, actions: l } = e,
          s = [
            {
              name: 'ok',
              title: t || o.t(null, void 0, n(468988)),
              intent: a,
              handler: ({ dialogClose: e }) => {
                e()
              },
            },
          ]
        return l && l.forEach((e) => s.push(e)), s
      }
      var h = n(500962),
        p = n(650151),
        f = n(753327)
      const g = new (n(63192).DialogsOpenerManager)()
      const C = (e) => {
          const {
              title: t,
              onClose: i = () => {},
              mainButtonText: r,
              mainButtonIntent: c,
              cancelButtonText: u,
              closeOnOutsideClick: m,
              onConfirm: d,
              onCancel: h,
            } = e,
            p = s(e)
          return a.createElement(l.SimpleDialog, {
            ...p,
            title: t || o.t(null, void 0, n(994443)),
            onClose: i,
            actions: [
              {
                name: 'yes',
                title: r || o.t(null, void 0, n(879831)),
                intent: c || 'success',
                handler: d,
              },
              {
                name: 'no',
                type: 'button',
                title: u || o.t(null, void 0, n(606255)),
                appearance: 'stroke',
                intent: 'default',
                handler: (e) => {
                  h ? h(e) : e.dialogClose()
                },
              },
            ],
            dataName: 'confirm-dialog',
            closeOnOutsideClick: m,
          })
        },
        b = (e) => {
          const {
              title: t,
              maxLength: i,
              initValue: r,
              placeholder: c,
              onClose: d = () => {},
              mainButtonText: h,
              mainButtonIntent: p,
              cancelButtonText: f,
              validator: g = m,
              onRename: C,
              source: b,
              autocompleteFilter: v,
              onCancel: k,
            } = e,
            x = (0, a.useRef)(null),
            [E, N] = (0, a.useState)(r || ''),
            [_, D] = (0, a.useState)(() => g(E)),
            B = s(e)
          return a.createElement(l.SimpleDialog, {
            title: t || o.t(null, void 0, n(435038)),
            content: a.createElement(u, {
              ...B,
              nameInputRef: x,
              maxLength: i,
              placeholder: c,
              value: E,
              onValueChange: (e) => {
                N(e), D(g(e))
              },
              source: b,
              autocompleteFilter: v,
            }),
            onClose: d,
            actions: [
              {
                disabled: !_,
                name: 'save',
                title: h || o.t(null, void 0, n(185520)),
                intent: p || 'primary',
                handler: ({ dialogClose: e, innerManager: t }) =>
                  C({
                    newValue: E,
                    focusInput: S,
                    dialogClose: e,
                    innerManager: t,
                  }),
              },
              {
                name: 'cancel',
                type: 'button',
                title: f || o.t(null, void 0, n(620036)),
                appearance: 'stroke',
                intent: 'default',
                handler: (e) => {
                  k ? k(e) : e.dialogClose()
                },
              },
            ],
            dataName: 'rename-dialog',
          })
          function S() {
            x.current && x.current.focus()
          }
        },
        v = (e) => {
          const { title: t, closeOnOutsideClick: i, onClose: r = () => {} } = e,
            c = s(e)
          return a.createElement(l.SimpleDialog, {
            ...c,
            title: t || o.t(null, void 0, n(533603)),
            onClose: r,
            actions: d(e),
            dataName: 'warning-dialog',
            closeOnOutsideClick: i,
          })
        },
        k = (e, t, n) => {
          const { title: o } = e
          let l = `${o}_`
          if (
            ((l += 'text' in e ? e.text : 'html' in e ? e.html : e.id),
            g.isOpened(l))
          )
            return (0, p.ensureDefined)(g.getDialogPayload(l)).closeHandler
          const s = document.createElement('div'),
            i = () => {
              var t
              null === (t = e.onClose) || void 0 === t || t.call(e),
                h.unmountComponentAtNode(s),
                g.setAsClosed(l)
            }
          return (
            h.render(
              a.createElement(
                f.SlotContext.Provider,
                { value: n || null },
                a.createElement(t, { ...e, onClose: i }),
              ),
              s,
            ),
            g.setAsOpened(l, { closeHandler: i }),
            i
          )
        }
    },
    859878: (e, t, n) => {
      n.d(t, { SimpleDialog: () => N })
      var a = n(50959),
        o = n(497754),
        l = n(72571),
        s = n(559410),
        i = n(40766),
        r = n(180185),
        c = n(930052),
        u = n(206594),
        m = n(996038),
        d = n(742554),
        h = n(805184),
        p = n(234404),
        f = n(650151),
        g = n(252130),
        C = n(753327),
        b = n(531275),
        v = n(30507)
      function k(e) {
        const {
            disabled: t,
            name: n,
            title: l,
            appearance: s,
            intent: i,
            handler: r,
            reference: c,
            type: u,
          } = e,
          { isSmallTablet: m, dialogCloseHandler: d } = (0, a.useContext)(
            b.SimpleDialogContext,
          ),
          k = (0, f.ensureNotNull)((0, a.useContext)(C.SlotContext)),
          x = (0, g.useIsMounted)(),
          [E, N] = (0, a.useState)(!1)
        return a.createElement(
          h.Button,
          {
            type: u,
            disabled: t,
            reference: c,
            className: o(v.actionButton, m && v.small),
            name: n,
            size: m ? 'l' : void 0,
            appearance: s,
            intent: i,
            onClick: () => {
              if (E) return
              const e = r({ dialogClose: d, innerManager: k })
              e &&
                (N(!0),
                e.then(() => {
                  x.current && N(!1)
                }))
            },
          },
          a.createElement('span', { className: o(E && v.hiddenTitle) }, l),
          E && a.createElement(p.Loader, { color: 'white' }),
        )
      }
      var x = n(507720),
        E = n(854936)
      function N(e) {
        const {
          title: t,
          onClose: n,
          actions: h,
          dataName: p,
          popupDialogClassName: f,
          contentClassName: g,
          wrapperClassName: C,
          backdrop: v,
          closeOnOutsideClick: N = !0,
          showCloseButton: _ = !0,
          closeOnEscapePress: D = !0,
          events: B = !0,
        } = e
        ;(0, a.useEffect)(
          () => (
            s.subscribe(u.CLOSE_POPUPS_AND_DIALOGS_COMMAND, n, null),
            () => {
              s.unsubscribe(u.CLOSE_POPUPS_AND_DIALOGS_COMMAND, n, null)
            }
          ),
          [n],
        )
        const [S, O] = (0, a.useState)(!0),
          w = (0, a.useRef)(null)
        return a.createElement(
          c.MatchMedia,
          { rule: m.DialogBreakpoints.TabletSmall },
          (s) =>
            a.createElement(
              b.SimpleDialogContext.Provider,
              { value: { isSmallTablet: s, dialogCloseHandler: n } },
              a.createElement(
                i.PopupDialog,
                {
                  className: o(E.popupDialog, f),
                  isOpened: S,
                  backdrop: v,
                  onClickBackdrop: B ? U : void 0,
                  onClickOutside: N ? U : void 0,
                  onKeyDown: y,
                  autofocus: !0,
                  fixedBody: !0,
                },
                a.createElement(
                  'div',
                  { className: o(E.wrap, C), 'data-name': p },
                  a.createElement(
                    'div',
                    {
                      className: o(
                        E.main,
                        !_ && E.marginWithoutCloseButton,
                        s && E.small,
                      ),
                    },
                    t &&
                      a.createElement(
                        'div',
                        { className: o(E.title, s && E.small) },
                        t,
                      ),
                    ((t) => {
                      if ('html' in e)
                        return a.createElement(d.TouchScrollContainer, {
                          className: o(E.content, t && E.small, E.html, g),
                          dangerouslySetInnerHTML: { __html: e.html },
                        })
                      if ('content' in e)
                        return a.createElement(
                          d.TouchScrollContainer,
                          { className: o(E.content, t && E.small, g) },
                          e.content,
                        )
                      return null
                    })(s),
                    h &&
                      h.length > 0 &&
                      a.createElement(
                        'div',
                        { className: o(E.footer, s && E.small) },
                        h.map((e, t) =>
                          a.createElement(k, {
                            ...e,
                            key: e.name,
                            reference: 0 === t ? w : void 0,
                          }),
                        ),
                      ),
                  ),
                  _ &&
                    a.createElement(l.Icon, {
                      className: o(E.close, s && E.small),
                      icon: x,
                      onClick: U,
                      'data-name': 'close',
                      'data-role': 'button',
                    }),
                ),
              ),
            ),
        )
        function y(e) {
          switch ((0, r.hashFromEvent)(e)) {
            case 27:
              S && D && (e.preventDefault(), n())
              break
            case 13:
              const t = document.activeElement
              if (
                e.defaultPrevented ||
                (t instanceof HTMLButtonElement && 'submit' !== t.type)
              )
                return
              if (S && h && h.length) {
                e.preventDefault()
                const t = w.current
                t && t.click()
              }
          }
        }
        function U() {
          O(!1), n()
        }
      }
    },
    63192: (e, t, n) => {
      n.d(t, { DialogsOpenerManager: () => a, dialogsOpenerManager: () => o })
      class a {
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
      const o = new a()
    },
    225770: (e) => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        dialog: 'dialog-aurqyvd9',
        message: 'message-aurqyvd9',
        messageWithCheckbox: 'messageWithCheckbox-aurqyvd9',
        checkbox: 'checkbox-aurqyvd9',
        messageBlock: 'messageBlock-aurqyvd9',
      }
    },
    102865: (e) => {
      e.exports = {
        text: 'text-I_at_Nau',
        checkbox: 'checkbox-I_at_Nau',
        footer: 'footer-I_at_Nau',
      }
    },
    941668: (e, t, n) => {
      n.d(t, { CreateConfirmDialog: () => s })
      var a = n(50959),
        o = n(973044)
      const l = a.lazy(async () => ({
          default: (
            await Promise.all([
              n.e(580),
              n.e(8194),
              n.e(4215),
              n.e(3610),
              n.e(3717),
              n.e(1282),
              n.e(7084),
              n.e(3566),
            ]).then(n.bind(n, 976669))
          ).AdaptiveConfirmDialog,
        })),
        s = (0, o.withDialogLazyLoad)(l)
    },
    537954: (e, t, n) => {
      n.r(t), n.d(t, { ConfirmDialogRenderer: () => d })
      var a = n(500962),
        o = n(50959),
        l = n(609838),
        s = n(302946),
        i = n(941668),
        r = n(180185),
        c = n(998018),
        u = n(148442),
        m = n(225770)
      class d {
        constructor(e) {
          ;(this._root = document.createElement('div')),
            (this._disabledConfirmations = e)
        }
        open(e) {
          return new Promise((t, n) => {
            var a, o
            ;(null === (a = e.abortSignal) || void 0 === a ? void 0 : a.aborted)
              ? n((0, u.createAbortError)())
              : (this._open(t, e),
                null === (o = e.abortSignal) ||
                  void 0 === o ||
                  o.addEventListener(
                    'abort',
                    () => {
                      this._close(), n((0, u.createAbortError)())
                    },
                    { once: !0 },
                  ))
          })
        }
        _open(e, t) {
          const {
              title: n,
              message: l,
              confirmButton: s,
              closeButton: i,
              showDisableConfirmationsCheckbox: u,
              onOpen: d,
              onClose: p,
            } = t,
            f = () => {
              e({ status: !1 }), null == p || p(), this._close()
            },
            g = {
              className: m.dialog,
              isOpened: !0,
              backdrop: !0,
              showSeparator: !0,
              title: n,
              cancelButtonText: i,
              submitButtonText: s,
              onSubmit: (t) => {
                if (t) {
                  const e = (0, c.makeConfirmation)(l)
                  void 0 !== e && this._disabledConfirmations.add(e)
                }
                e({ status: !0 }), null == p || p(), this._close()
              },
              onOpen: d,
              onClose: f,
              onKeyDown: (e) => {
                27 === (0, r.hashFromEvent)(e) && f()
              },
              onCancel: () => {},
              dataName: 'trading-confirm-dialog',
              defaultActionOnClose: 'none',
              showDisableConfirmationsCheckbox: u,
              message: l,
            }
          a.render(o.createElement(h, { ...g }), this._root)
        }
        _close() {
          a.unmountComponentAtNode(this._root)
        }
      }
      function h(e) {
        const {
            showDisableConfirmationsCheckbox: t,
            message: a,
            onSubmit: r,
            ...c
          } = e,
          [u, d] = (0, o.useState)(!1),
          h = () => d(!u)
        return o.createElement(i.CreateConfirmDialog, {
          ...c,
          render: () =>
            o.createElement(
              o.Fragment,
              null,
              o.createElement(
                'div',
                { className: t ? m.messageWithCheckbox : m.message },
                Array.isArray(a)
                  ? a.map((e, t) =>
                      o.createElement(
                        'span',
                        { className: m.messageBlock, key: t },
                        e,
                      ),
                    )
                  : a,
              ),
              e.showDisableConfirmationsCheckbox &&
                o.createElement(s.Checkbox, {
                  className: m.checkbox,
                  label: l.t(null, void 0, n(237233)),
                  checked: u,
                  onChange: h,
                }),
            ),
          onSubmit: () => r(u),
          isOpen: !0,
        })
      }
    },
    210795: (e, t, n) => {
      n.r(t), n.d(t, { SimpleConfirmDialog: () => m })
      var a = n(50959),
        o = n(609838),
        l = n(302946),
        s = n(859878),
        i = n(72571),
        r = n(902774)
      function c(e) {
        return a.createElement(
          a.Fragment,
          null,
          a.createElement(i.Icon, { icon: e.icon, className: r.icon }),
          e.text,
        )
      }
      var u = n(102865)
      function m(e) {
        const {
            disabledConfirmations: t,
            title: i,
            titleIcon: r,
            text: m,
            mainButtonText: d,
            mainButtonIntent: h,
            cancelButtonText: p,
            showDisableConfirmationsCheckbox: f,
            checkboxLabel: g,
            showCancelButton: C = !0,
            onClose: b = () => {},
            onConfirm: v,
            onCancel: k,
            showBackdrop: x,
            closeOnOutsideClick: E,
            showCloseButton: N,
            closeOnEscapePress: _,
            footer: D,
            closeOnBackDropClick: B,
          } = e,
          [S, O] = (0, a.useState)(!1),
          w = a.createElement(
            a.Fragment,
            null,
            a.createElement('div', {
              className: u.text,
              dangerouslySetInnerHTML: { __html: m },
            }),
            f &&
              a.createElement(l.Checkbox, {
                className: u.checkbox,
                label: null != g ? g : o.t(null, void 0, n(237233)),
                checked: S,
                tabIndex: -1,
                onChange: () => O((e) => !e),
              }),
            D && a.createElement('div', { className: u.footer }, D),
          )
        return a.createElement(s.SimpleDialog, {
          title: (() => {
            const e = null != i ? i : o.t(null, void 0, n(994443))
            if (void 0 === r) return e
            return a.createElement(c, { text: e, icon: r })
          })(),
          content: w,
          onClose: b,
          actions: (() => {
            const e = [
              {
                name: 'yes',
                title: null != d ? d : o.t(null, void 0, n(879831)),
                intent: null != h ? h : 'success',
                handler: y,
              },
            ]
            C &&
              e.push({
                name: 'no',
                title: null != p ? p : o.t(null, void 0, n(606255)),
                appearance: 'stroke',
                intent: 'default',
                handler: U,
              })
            return e
          })(),
          dataName: 'simple-confirm-dialog',
          backdrop: x,
          closeOnOutsideClick: E,
          showCloseButton: N,
          closeOnEscapePress: _,
          events: B,
        })
        function y(e) {
          void 0 !== t && S && t.add(m), v(e)
        }
        function U(e) {
          void 0 !== k ? k(e) : e.dialogClose()
        }
      }
    },
    973044: (e, t, n) => {
      n.d(t, { withDialogLazyLoad: () => l })
      var a = n(50959),
        o = n(252130)
      function l(e) {
        return (t) => {
          const n = (0, o.useIsMounted)()
          return (((e) => {
            const [t, n] = (0, a.useState)(!1)
            return (
              (0, a.useEffect)(() => {
                !t && e && n(!0)
              }, [e]),
              t
            )
          })(t.isOpen) ||
            t.isOpen) &&
            n
            ? a.createElement(
                a.Suspense,
                { fallback: null },
                a.createElement(e, { ...t }),
              )
            : null
        }
      }
    },
    507720: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17" fill="currentColor"><path d="m.58 1.42.82-.82 15 15-.82.82z"/><path d="m.58 15.58 15-15 .82.82-15 15z"/></svg>'
    },
    994443: (e) => {
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
    237233: (e) => {
      e.exports = {
        ar: ['لا تسألني مرة أخرى'],
        ca_ES: "Don't ask again",
        cs: "Don't ask again",
        de: ['Nicht erneut fragen'],
        el: "Don't ask again",
        en: "Don't ask again",
        es: ['No volver a preguntar'],
        fa: "Don't ask again",
        fr: ['Ne plus demander'],
        he_IL: ['אל תשאל שוב'],
        hu_HU: "Don't ask again",
        id_ID: ['Jangan tanyakan kembali'],
        it: ['Non chiedere più'],
        ja: ['再度尋ねない'],
        ko: ['다시 묻지 않기'],
        ms_MY: ['Jangan bertanya lagi'],
        nl_NL: "Don't ask again",
        pl: ['Nie pytaj ponownie'],
        pt: ['Não perguntar novamente'],
        ro: "Don't ask again",
        ru: ['Больше не спрашивать'],
        sv: ['Fråga inte igen'],
        th: ['ไม่ต้องถามอีก'],
        tr: ['Bir daha sorma'],
        vi: ['Không hỏi lại'],
        zh: ['不再询问'],
        zh_TW: ['不再詢問'],
      }
    },
    435038: (e) => {
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
  },
])
