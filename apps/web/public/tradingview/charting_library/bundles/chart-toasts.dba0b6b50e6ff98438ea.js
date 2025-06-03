;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3088],
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
    274099: (e) => {
      e.exports = {
        toast: 'toast-ggQH9Zyp',
        'intent-success': 'intent-success-ggQH9Zyp',
        'intent-warning': 'intent-warning-ggQH9Zyp',
        'intent-danger': 'intent-danger-ggQH9Zyp',
        image: 'image-ggQH9Zyp',
        'main-content': 'main-content-ggQH9Zyp',
        'toast-close-button': 'toast-close-button-ggQH9Zyp',
        title: 'title-ggQH9Zyp',
        'header-text': 'header-text-ggQH9Zyp',
        'header-text_margin-top': 'header-text_margin-top-ggQH9Zyp',
        'main-text': 'main-text-ggQH9Zyp',
        actions: 'actions-ggQH9Zyp',
        'with-close-button': 'with-close-button-ggQH9Zyp',
      }
    },
    389986: (e, t, s) => {
      s.d(t, { CloseButton: () => d })
      var n = s(50959),
        o = s(270762),
        a = s(117105),
        i = s(315130),
        r = s(238822),
        l = s(663346),
        c = s(534983)
      function u(e = 'large') {
        switch (e) {
          case 'large':
            return a
          case 'medium':
          default:
            return i
          case 'small':
            return r
          case 'xsmall':
            return l
          case 'xxsmall':
            return c
        }
      }
      const d = n.forwardRef((e, t) =>
        n.createElement(o.NavButton, { ...e, ref: t, icon: u(e.size) }),
      )
    },
    270762: (e, t, s) => {
      s.d(t, { NavButton: () => c })
      var n = s(50959),
        o = s(497754),
        a = s(72571),
        i = s(345350)
      function r(e) {
        const {
          size: t = 'large',
          preservePaddings: s,
          isLink: n,
          flipIconOnRtl: a,
          className: r,
        } = e
        return o(
          i['nav-button'],
          i[`size-${t}`],
          s && i['preserve-paddings'],
          a && i['flip-icon'],
          n && i.link,
          r,
        )
      }
      function l(e) {
        const { children: t, icon: s } = e
        return n.createElement(
          n.Fragment,
          null,
          n.createElement('span', { className: i.background }),
          n.createElement(a.Icon, {
            icon: s,
            className: i.icon,
            'aria-hidden': !0,
          }),
          t && n.createElement('span', { className: i['visually-hidden'] }, t),
        )
      }
      const c = (0, n.forwardRef)((e, t) => {
        const {
          icon: s,
          type: o = 'button',
          preservePaddings: a,
          flipIconOnRtl: i,
          size: c,
          'aria-label': u,
          ...d
        } = e
        return n.createElement(
          'button',
          { ...d, className: r({ ...e, children: u }), ref: t, type: o },
          n.createElement(l, { icon: s }, u),
        )
      })
      c.displayName = 'NavButton'
      var u = s(591365),
        d = s(273388)
      ;(0, n.forwardRef)((e, t) => {
        const { icon: s, renderComponent: o, 'aria-label': a, ...i } = e,
          c = null != o ? o : u.CustomComponentDefaultLink
        return n.createElement(
          c,
          {
            ...i,
            className: r({ ...e, children: a, isLink: !0 }),
            reference: (0, d.isomorphicRef)(t),
          },
          n.createElement(l, { icon: s }, a),
        )
      }).displayName = 'NavAnchorButton'
    },
    409245: (e, t, s) => {
      function n(e) {
        const { reference: t, ...s } = e
        return { ...s, ref: t }
      }
      s.d(t, { renameRef: () => n })
    },
    591365: (e, t, s) => {
      s.d(t, { CustomComponentDefaultLink: () => a })
      var n = s(50959),
        o = s(409245)
      function a(e) {
        return n.createElement('a', { ...(0, o.renameRef)(e) })
      }
      n.PureComponent
    },
    118965: (e, t, s) => {
      s.d(t, { useMobileTouchState: () => a })
      var n = s(50959),
        o = s(804395)
      function a() {
        const [e, t] = (0, n.useState)(!1)
        return (
          (0, n.useEffect)(() => {
            t(o.mobiletouch)
          }, []),
          e
        )
      }
    },
    72571: (e, t, s) => {
      s.d(t, { Icon: () => o })
      var n = s(50959)
      const o = n.forwardRef((e, t) => {
        const { icon: s = '', ...o } = e
        return n.createElement('span', {
          ...o,
          ref: t,
          dangerouslySetInnerHTML: { __html: s },
        })
      })
    },
    642761: (e, t, s) => {
      s.r(t), s.d(t, { ChartToasts: () => N })
      var n = s(50959),
        o = s(609838),
        a = s(529158),
        i = s(497754),
        r = s(118965),
        l = s(389986),
        c = s(863697),
        u = s(274099),
        d = s.n(u)
      function h(e) {
        const {
            children: t,
            role: s,
            className: o,
            intent: a = c.ToastIntent.Default,
            ...r
          } = e,
          l = i(d().toast, a !== c.ToastIntent.Default && d()[`intent-${a}`], o)
        return n.createElement('article', { className: l, role: s, ...r }, t)
      }
      function m(e) {
        const { children: t, className: s } = e
        return n.createElement(
          'div',
          { className: i(d().image, s), 'aria-hidden': !0 },
          t,
        )
      }
      function p(e) {
        const { children: t, className: s, ...o } = e
        return n.createElement('h2', { ...o, className: i(d().title, s) }, t)
      }
      function g(e) {
        const { children: t, className: s, ...o } = e
        return n.createElement(
          'h3',
          { ...o, className: i(d()['header-text'], s) },
          t,
        )
      }
      function w(e) {
        const { children: t, className: s, ...o } = e
        return n.createElement(
          'p',
          { ...o, className: i(d()['main-text'], s) },
          t,
        )
      }
      function v(e) {
        const { children: t, className: s } = e
        return n.createElement('div', { className: i(d().actions, s) }, t)
      }
      const C = n.memo((e) => {
        const {
            title: t,
            text: s,
            headerText: o,
            image: a,
            actions: c,
            intent: u,
            role: C = 'alertdialog',
            showCloseButton: _ = !1,
            onClose: f,
            onAutoFocus: b,
            className: y,
            closeButtonProps: x,
            actionsClassName: T,
            mainTextClassName: N,
            headerTextClassName: E,
            titleClassName: z,
            isRtl: k = () => !1,
            imageClassName: S,
          } = e,
          L = (0, n.useId)(),
          R = (0, n.useId)(),
          B = (0, n.useId)(),
          H = (0, n.useRef)(null),
          I = _ && d()['with-close-button'],
          [Q, Z] = (0, n.useState)(null),
          [M, O] = (0, n.useState)(null),
          W = i(t && I, z),
          A = i(t && o && s && d()['header-text_margin-top'], o && !t && I, E),
          P = i(s && !t && !o && I, N),
          D = (0, r.useMobileTouchState)()
        ;(0, n.useEffect)(() => {
          'alertdialog' === C && void 0 !== b && b()
        }, [])
        const $ = (0, n.useMemo)(
          () => (o || s ? `${o ? B : ''} ${s ? R : ''}` : void 0),
          [o, B, s, R],
        )
        return n.createElement(
          h,
          {
            role: C,
            intent: u,
            'aria-labelledby': L,
            'aria-describedby': $,
            className: y,
            ...(D && {
              onTouchStart: (e) => {
                O(null), Z(e.targetTouches[0].clientX)
              },
              onTouchMove: (e) => O(e.targetTouches[0].clientX),
              onTouchEnd: () => {
                if (!Q || !M) return
                const e = Q - M,
                  t = e > 20,
                  s = e < -20
                ;(k() ? s : t) && f && f()
              },
            }),
          },
          a && n.createElement(m, { className: S }, a),
          n.createElement(
            'div',
            { className: i(d()['main-content']) },
            t && n.createElement(p, { id: L, className: W }, t),
            o && n.createElement(g, { id: B, className: A }, o),
            s && n.createElement(w, { id: R, className: P }, s),
            c && n.createElement(v, { className: T }, c),
          ),
          _ &&
            x &&
            n.createElement(l.CloseButton, {
              ref: H,
              onClick: f,
              size: 'medium',
              ...x,
              className: i(d()['toast-close-button'], x.className),
            }),
        )
      })
      var _ = s(521097),
        f = s(972535),
        b = s(710263)
      const y = _.mobileFirstLegacyBreakpoints['media-mf-legacy-phone'],
        x = `screen and (min-width: ${y}px)`,
        T = 1e4
      class N {
        constructor(e, t, s, n = 0) {
          ;(this._mediaQuery = window.matchMedia(x)),
            (this._areToastsHovered = !1),
            (this._pipedToasts = null),
            (this._handleContainerUpdate = () => {
              if (this._isWindowWide()) {
                null !== this._pipedToasts &&
                  (this._globalToasts.split(this._toastsLayer), this.unpipe())
                const e = {
                  suggestedLayout: this._getSuggestedLayout(),
                  rootContainerOptions: this._getRootContainerOptions(),
                }
                this._toastsLayer.update(e)
              } else {
                if (this._pipedToasts === this._globalToasts) return
                this._globalToasts.merge(this._toastsLayer),
                  this.pipe(this._globalToasts)
              }
            }),
            (this._resizerBridge = e),
            (this._container = t),
            (this._globalToasts = s),
            (this._bottomOffset = n),
            (this._toastsLayer = new a.ToastsLayer(
              this._getSuggestedLayout(),
              this._container,
              this._getRootContainerOptions(),
              void 0,
              true,
            )),
            this._resizerBridge.width.subscribe(this._handleContainerUpdate),
            this._isWindowWide() || this.pipe(this._globalToasts)
        }
        destroy() {
          this._toastsLayer.destroy(),
            this._resizerBridge.width.unsubscribe(this._handleContainerUpdate)
        }
        reset() {
          this._toastsLayer.reset(), this._globalToasts.reset()
        }
        showCustomToast(e) {
          if (null !== this._pipedToasts)
            return this._pipedToasts.showCustomToast({
              origin: this._toastsLayer,
              ...e,
            })
          const { render: t, onRemoveEnd: s, ...n } = e
          return this._toastsLayer.showToast({
            render: t,
            onRemoveEnd: e.onRemoveEnd,
            ...n,
          }).remove
        }
        showSimpleToast(e) {
          const {
            time: t = T,
            inactivityThreshold: s,
            removalDelegate: n,
            onAutoClose: o,
            ...a
          } = e
          return new Promise((i) => {
            let r,
              l,
              c = !1
            const u = this.showCustomToast({
                render: z(a),
                index: e.index,
                priority: e.priority,
                onRemoveEnd: () => {
                  ;(c = !0),
                    i(),
                    null == n || n.unsubscribe(null, p),
                    void 0 !== l && clearInterval(l),
                    r && (r.unsubscribe(g), r.destroy())
                },
                onMouseOver: () => {
                  this._setAreToastsHovered(!0)
                },
                onMouseOut: () => {
                  this._setAreToastsHovered(!1)
                },
              }),
              d = () => {
                c || u()
              },
              h = () => {
                this._areToastsHovered || (null == o || o(), d())
              },
              m = () => {
                !1 !== t && (l = setInterval(h, t))
              }
            m(),
              void 0 !== s &&
                ((r = new ActivityStatus(s)),
                r.subscribe(g),
                r.value() || g(!1))
            const p = (e) => {
              var t
              d(),
                e || null === (t = a.onClose) || void 0 === t || t.call(a, !0)
            }
            function g(e) {
              e ? m() : clearInterval(l)
            }
            n && n.subscribe(null, p)
          })
        }
        forceRender() {
          null !== this._pipedToasts
            ? this._pipedToasts.forceRender()
            : this._toastsLayer.forceRender()
        }
        merge(e) {
          this._toastsLayer.merge(e)
        }
        split(e) {
          this._toastsLayer.split(e)
        }
        pipe(e) {
          this._pipedToasts = e
        }
        unpipe() {
          this._pipedToasts = null
        }
        _isWindowWide() {
          return this._mediaQuery.matches
        }
        _isContainerWide() {
          return this._resizerBridge.width.value() >= y
        }
        _getRootContainerOptions() {
          const e = this._isContainerWide() ? 8 : 0
          return {
            position: 'absolute',
            zIndex: 150,
            left: '0',
            right: '0',
            bottom: `${this._bottomOffset + 31 + e}px`,
          }
        }
        _getSuggestedLayout() {
          return this._isContainerWide() ? 'loose' : 'compact'
        }
        _setAreToastsHovered(e) {
          f.mobiletouch || (this._areToastsHovered = e)
        }
      }
      function E(e) {
        const { onClose: t, showCloseButton: a, closeButtonProps: i, ...r } = e,
          l = (0, n.useCallback)(() => {
            void 0 !== t && t()
          }, [t]),
          c = (0, n.useMemo)(
            () => ({
              'aria-label': o.t(null, { context: 'accessibility' }, s(656824)),
            }),
            [],
          )
        return n.createElement(C, {
          ...r,
          onClose: l,
          showCloseButton: null == a || a,
          closeButtonProps: null != i ? i : c,
          isRtl: b.isRtl,
        })
      }
      function z(e) {
        const { onClose: t } = e
        return ({ onRemove: s }) =>
          n.createElement(E, {
            ...e,
            onClose: () => {
              s(), null == t || t()
            },
          })
      }
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
    656824: (e) => {
      e.exports = {
        ar: 'Close',
        ca_ES: 'Close',
        cs: 'Close',
        de: ['Schließen'],
        el: 'Close',
        en: 'Close',
        es: ['Cerrar'],
        fa: 'Close',
        fr: ['Fermer'],
        he_IL: ['סגור'],
        hu_HU: 'Close',
        id_ID: ['Tutup'],
        it: ['Chiudi'],
        ja: ['終了'],
        ko: ['클로즈'],
        ms_MY: ['Tutup'],
        nl_NL: 'Close',
        pl: ['Zamknij'],
        pt: ['Fechar'],
        ro: 'Close',
        ru: ['Закрыть'],
        sv: 'Close',
        th: 'Close',
        tr: ['Kapat'],
        vi: ['Đóng'],
        zh: ['关闭'],
        zh_TW: ['關閉'],
      }
    },
  },
])
