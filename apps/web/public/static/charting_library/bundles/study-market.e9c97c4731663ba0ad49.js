;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [6456, 9790],
  {
    97754: (e, t) => {
      var i
      !(() => {
        var n = {}.hasOwnProperty
        function r() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var i = arguments[t]
            if (i) {
              var s = typeof i
              if ('string' === s || 'number' === s) e.push(i)
              else if (Array.isArray(i) && i.length) {
                var o = r.apply(null, i)
                o && e.push(o)
              } else if ('object' === s)
                for (var a in i) n.call(i, a) && i[a] && e.push(a)
            }
          }
          return e.join(' ')
        }
        e.exports
          ? ((r.default = r), (e.exports = r))
          : void 0 === (i = (() => r).apply(t, [])) || (e.exports = i)
      })()
    },
    85862: (e) => {
      e.exports = { disableSelfPositioning: 'disableSelfPositioning-dYiqkKAE' }
    },
    96108: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': '(max-width: 768px)',
        'small-height-breakpoint': '(max-height: 360px)',
        'tablet-small-breakpoint': '(max-width: 440px)',
      }
    },
    33090: (e) => {
      e.exports = {
        wrapper: 'wrapper-nGEmjtaX',
        container: 'container-nGEmjtaX',
        tab: 'tab-nGEmjtaX',
        active: 'active-nGEmjtaX',
        title: 'title-nGEmjtaX',
        icon: 'icon-nGEmjtaX',
        withoutIcon: 'withoutIcon-nGEmjtaX',
        titleText: 'titleText-nGEmjtaX',
        nested: 'nested-nGEmjtaX',
        isTablet: 'isTablet-nGEmjtaX',
        isMobile: 'isMobile-nGEmjtaX',
        showLastDivider: 'showLastDivider-nGEmjtaX',
        medium: 'medium-nGEmjtaX',
        large: 'large-nGEmjtaX',
        withoutArrow: 'withoutArrow-nGEmjtaX',
        accessible: 'accessible-nGEmjtaX',
      }
    },
    67646: (e) => {
      e.exports = {
        title: 'title-z9fs4j4t',
        small: 'small-z9fs4j4t',
        normal: 'normal-z9fs4j4t',
        large: 'large-z9fs4j4t',
      }
    },
    14360: (e) => {
      e.exports = { container: 'container-XOHpda28', mobile: 'mobile-XOHpda28' }
    },
    29646: (e) => {
      e.exports = {
        title: 'title-cIIj4HrJ',
        disabled: 'disabled-cIIj4HrJ',
        icon: 'icon-cIIj4HrJ',
        locked: 'locked-cIIj4HrJ',
        open: 'open-cIIj4HrJ',
        actionIcon: 'actionIcon-cIIj4HrJ',
        selected: 'selected-cIIj4HrJ',
        codeIcon: 'codeIcon-cIIj4HrJ',
        solutionIcon: 'solutionIcon-cIIj4HrJ',
      }
    },
    818: (e) => {
      e.exports = {
        'tablet-small-breakpoint': '(max-width: 440px)',
        container: 'container-WeNdU0sq',
        mobile: 'mobile-WeNdU0sq',
        selected: 'selected-WeNdU0sq',
        disabled: 'disabled-WeNdU0sq',
        favorite: 'favorite-WeNdU0sq',
        highlighted: 'highlighted-WeNdU0sq',
        'highlight-animation': 'highlight-animation-WeNdU0sq',
        badge: 'badge-WeNdU0sq',
        main: 'main-WeNdU0sq',
        paddingLeft: 'paddingLeft-WeNdU0sq',
        author: 'author-WeNdU0sq',
        likes: 'likes-WeNdU0sq',
        actions: 'actions-WeNdU0sq',
        isActive: 'isActive-WeNdU0sq',
        mobileText: 'mobileText-WeNdU0sq',
      }
    },
    92724: (e) => {
      e.exports = { container: 'container-hrZZtP0J' }
    },
    3602: (e) => {
      e.exports = {
        container: 'container-jiYDR9Eu',
        centerElement: 'centerElement-jiYDR9Eu',
        contentWrap: 'contentWrap-jiYDR9Eu',
        noticeShowed: 'noticeShowed-jiYDR9Eu',
        icon: 'icon-jiYDR9Eu',
        textWrap: 'textWrap-jiYDR9Eu',
      }
    },
    3292: (e) => {
      e.exports = {
        'tablet-small-breakpoint': '(max-width: 440px)',
        dialog: 'dialog-I087YV6b',
        dialogLibrary: 'dialogLibrary-I087YV6b',
        contentContainer: 'contentContainer-I087YV6b',
        listContainer: 'listContainer-I087YV6b',
        scroll: 'scroll-I087YV6b',
        sidebarContainer: 'sidebarContainer-I087YV6b',
        noContentBlock: 'noContentBlock-I087YV6b',
        tabWithHint: 'tabWithHint-I087YV6b',
        solution: 'solution-I087YV6b',
        mobileSidebarItem: 'mobileSidebarItem-I087YV6b',
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
    39416: (e, t, i) => {
      i.d(t, { useFunctionalRefObject: () => s })
      var n = i(50959),
        r = i(43010)
      function s(e) {
        const t = (0, n.useMemo)(
            () =>
              ((e) => {
                const t = (i) => {
                  e(i), (t.current = i)
                }
                return (t.current = null), t
              })((e) => {
                a.current(e)
              }),
            [],
          ),
          i = (0, n.useRef)(null),
          s = (t) => {
            if (null === t) return o(i.current, t), void (i.current = null)
            i.current !== e && ((i.current = e), o(i.current, t))
          },
          a = (0, n.useRef)(s)
        return (
          (a.current = s),
          (0, r.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return a.current(t.current), () => a.current(null)
          }, [e]),
          t
        )
      }
      function o(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    43010: (e, t, i) => {
      i.d(t, { useIsomorphicLayoutEffect: () => r })
      var n = i(50959)
      function r(e, t) {
        ;('undefined' == typeof window ? n.useEffect : n.useLayoutEffect)(e, t)
      }
    },
    27267: (e, t, i) => {
      function n(e, t, i, n, r) {
        function s(r) {
          if (e > r.timeStamp) return
          const s = r.target
          void 0 !== i &&
            null !== t &&
            null !== s &&
            s.ownerDocument === n &&
            (t.contains(s) || i(r))
        }
        return (
          r.click && n.addEventListener('click', s, !1),
          r.mouseDown && n.addEventListener('mousedown', s, !1),
          r.touchEnd && n.addEventListener('touchend', s, !1),
          r.touchStart && n.addEventListener('touchstart', s, !1),
          () => {
            n.removeEventListener('click', s, !1),
              n.removeEventListener('mousedown', s, !1),
              n.removeEventListener('touchend', s, !1),
              n.removeEventListener('touchstart', s, !1)
          }
        )
      }
      i.d(t, { addOutsideEventListener: () => n })
    },
    36383: (e, t, i) => {
      i.d(t, { useOutsideEvent: () => o })
      var n = i(50959),
        r = i(43010),
        s = i(27267)
      function o(e) {
        const {
            click: t,
            mouseDown: i,
            touchEnd: o,
            touchStart: a,
            handler: l,
            reference: c,
          } = e,
          d = (0, n.useRef)(null),
          u = (0, n.useRef)(
            'undefined' == typeof window
              ? 0
              : new window.CustomEvent('timestamp').timeStamp,
          )
        return (
          (0, r.useIsomorphicLayoutEffect)(() => {
            const e = { click: t, mouseDown: i, touchEnd: o, touchStart: a },
              n = c ? c.current : d.current
            return (0, s.addOutsideEventListener)(u.current, n, l, document, e)
          }, [t, i, o, a, l]),
          c || d
        )
      }
    },
    9745: (e, t, i) => {
      i.d(t, { Icon: () => r })
      var n = i(50959)
      const r = n.forwardRef((e, t) => {
        const {
            icon: i = '',
            title: r,
            ariaLabel: s,
            ariaLabelledby: o,
            ariaHidden: a,
            ...l
          } = e,
          c = !!(r || s || o)
        return n.createElement('span', {
          role: 'img',
          ...l,
          ref: t,
          'aria-label': s,
          'aria-labelledby': o,
          'aria-hidden': a || !c,
          title: r,
          dangerouslySetInnerHTML: { __html: i },
        })
      })
    },
    99663: (e, t, i) => {
      i.d(t, { Slot: () => r, SlotContext: () => s })
      var n = i(50959)
      class r extends n.Component {
        shouldComponentUpdate() {
          return !1
        }
        render() {
          return n.createElement('div', {
            style: { position: 'fixed', zIndex: 150, left: 0, top: 0 },
            ref: this.props.reference,
          })
        }
      }
      const s = n.createContext(null)
    },
    90186: (e, t, i) => {
      function n(e) {
        return s(e, o)
      }
      function r(e) {
        return s(e, a)
      }
      function s(e, t) {
        const i = Object.entries(e).filter(t),
          n = {}
        for (const [e, t] of i) n[e] = t
        return n
      }
      function o(e) {
        const [t, i] = e
        return 0 === t.indexOf('data-') && 'string' == typeof i
      }
      function a(e) {
        return 0 === e[0].indexOf('aria-')
      }
      i.d(t, {
        filterAriaProps: () => r,
        filterDataProps: () => n,
        filterProps: () => s,
        isAriaAttribute: () => a,
        isDataAttribute: () => o,
      })
    },
    67961: (e, t, i) => {
      i.d(t, { OverlapManager: () => o, getRootOverlapManager: () => l })
      var n = i(50151),
        r = i(34811)
      class s {
        constructor() {
          this._storage = []
        }
        add(e) {
          this._storage.push(e)
        }
        remove(e) {
          this._storage = this._storage.filter((t) => e !== t)
        }
        has(e) {
          return this._storage.includes(e)
        }
        getItems() {
          return this._storage
        }
      }
      class o {
        constructor(e = document) {
          ;(this._storage = new s()),
            (this._windows = new Map()),
            (this._index = 0),
            (this._document = e),
            (this._container = e.createDocumentFragment())
        }
        setContainer(e) {
          const t = this._container,
            i = null === e ? this._document.createDocumentFragment() : e
          !((e, t) => {
            Array.from(e.childNodes).forEach((e) => {
              e.nodeType === Node.ELEMENT_NODE && t.appendChild(e)
            })
          })(t, i),
            (this._container = i)
        }
        registerWindow(e) {
          this._storage.has(e) || this._storage.add(e)
        }
        ensureWindow(e, t = { position: 'fixed', direction: 'normal' }) {
          const i = this._windows.get(e)
          if (void 0 !== i) return i
          this.registerWindow(e)
          const n = this._document.createElement('div')
          if (
            ((n.style.position = t.position),
            (n.style.zIndex = this._index.toString()),
            (n.dataset.id = e),
            void 0 !== t.index)
          ) {
            const e = this._container.childNodes.length
            if (t.index >= e) this._container.appendChild(n)
            else if (t.index <= 0)
              this._container.insertBefore(n, this._container.firstChild)
            else {
              const e = this._container.childNodes[t.index]
              this._container.insertBefore(n, e)
            }
          } else
            'reverse' === t.direction
              ? this._container.insertBefore(n, this._container.firstChild)
              : this._container.appendChild(n)
          return this._windows.set(e, n), ++this._index, n
        }
        unregisterWindow(e) {
          this._storage.remove(e)
          const t = this._windows.get(e)
          void 0 !== t &&
            (null !== t.parentElement && t.parentElement.removeChild(t),
            this._windows.delete(e))
        }
        getZindex(e) {
          const t = this.ensureWindow(e)
          return Number.parseInt(t.style.zIndex || '0')
        }
        moveLastWindowToTop() {
          const e = this._storage.getItems(),
            t = e[e.length - 1]
          t && this.moveToTop(t)
        }
        moveToTop(e) {
          if (this.getZindex(e) !== this._index) {
            const t = this.ensureWindow(e)
            this._windows.forEach((e, i) => {
              e.hasAttribute(r.FOCUS_TRAP_DATA_ATTRIBUTE) &&
                e.setAttribute(
                  r.FOCUS_TRAP_DATA_ATTRIBUTE,
                  e === t ? 'true' : 'false',
                )
            }),
              (t.style.zIndex = (++this._index).toString())
          }
        }
        removeWindow(e) {
          this.unregisterWindow(e)
        }
      }
      const a = new WeakMap()
      function l(e = document) {
        const t = e.getElementById('overlap-manager-root')
        if (null !== t) return (0, n.ensureDefined)(a.get(t))
        {
          const t = new o(e),
            i = ((e) => {
              const t = e.createElement('div')
              return (
                (t.style.position = 'absolute'),
                (t.style.zIndex = (150).toString()),
                (t.style.top = '0px'),
                (t.style.left = '0px'),
                (t.id = 'overlap-manager-root'),
                t
              )
            })(e)
          return a.set(i, t), t.setContainer(i), e.body.appendChild(i), t
        }
      }
      var c
      !((e) => {
        e[(e.BaseZindex = 150)] = 'BaseZindex'
      })(c || (c = {}))
    },
    29196: (e, t, i) => {
      i.d(t, { useHintShowAnimation: () => o })
      var n = i(50959)
      const r = 50,
        s = 2500
      function o(e) {
        const [t, i] = (0, n.useState)(!1)
        return (
          (0, n.useLayoutEffect)(() => {
            const t = setTimeout(() => i(!0), r),
              n = setTimeout(() => i(!1), e ?? s)
            return () => {
              clearTimeout(t), clearTimeout(n)
            }
          }, []),
          t
        )
      }
    },
    99054: (e, t, i) => {
      i.d(t, { setFixedBodyState: () => c })
      const n = (() => {
        let e
        return () => {
          if (void 0 === e) {
            const t = document.createElement('div'),
              i = t.style
            ;(i.visibility = 'hidden'),
              (i.width = '100px'),
              (i.msOverflowStyle = 'scrollbar'),
              document.body.appendChild(t)
            const n = t.offsetWidth
            t.style.overflow = 'scroll'
            const r = document.createElement('div')
            ;(r.style.width = '100%'), t.appendChild(r)
            const s = r.offsetWidth
            t.parentNode?.removeChild(t), (e = n - s)
          }
          return e
        }
      })()
      function r(e, t, i) {
        null !== e && e.style.setProperty(t, i)
      }
      function s(e, t) {
        return getComputedStyle(e, null).getPropertyValue(t)
      }
      function o(e, t) {
        return Number.parseInt(s(e, t))
      }
      let a = 0,
        l = !1
      function c(e) {
        const { body: t } = document,
          i = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++a) {
          const e = s(t, 'overflow'),
            a = o(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            (r(i, 'right', `${n()}px`),
            (t.style.paddingRight = `${a + n()}px`),
            (l = !0)),
            t.classList.add('i-no-scroll')
        } else if (
          !e &&
          a > 0 &&
          0 == --a &&
          (t.classList.remove('i-no-scroll'), l)
        ) {
          r(i, 'right', '0px')
          let e = 0
          0,
            t.scrollHeight <= t.clientHeight && (e -= n()),
            (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'),
            (l = !1)
        }
      }
    },
    24437: (e, t, i) => {
      i.d(t, { DialogBreakpoints: () => r })
      var n = i(96108)
      const r = {
        SmallHeight: n['small-height-breakpoint'],
        TabletSmall: n['tablet-small-breakpoint'],
        TabletNormal: n['tablet-normal-breakpoint'],
      }
    },
    22265: (e, t, i) => {
      i.d(t, { DialogSidebarItem: () => h, DialogSidebarWrapper: () => u })
      var n,
        r = i(50959),
        s = i(97754),
        o = i.n(s),
        a = i(9745),
        l = i(65631),
        c = i(68648),
        d = i(33090)
      function u(e) {
        return r.createElement('div', { className: d.wrapper, ...e })
      }
      function h(e) {
        const {
            mode: t,
            title: i,
            icon: n,
            isActive: s,
            onClick: u,
            tag: h = 'div',
            reference: p,
            className: m,
            mobileFontSize: f = 'medium',
            showLastDivider: v,
            useBoldIconsForMobile: g,
            hideArrow: b,
            ..._
          } = e,
          { isMobile: y, isTablet: w } = (0, l.getSidebarMode)(t),
          E = (() => {
            if (y && g) return n?.bold
            return s ? n?.bold : n?.default
          })()
        return r.createElement(
          h,
          {
            ..._,
            ref: p,
            title: w ? i : '',
            className: o()(
              d.tab,
              w && d.isTablet,
              y && d.isMobile,
              s && d.active,
              b && d.withoutArrow,
              m,
              w && 'apply-common-tooltip',
            ),
            onClick: u,
          },
          n && r.createElement(a.Icon, { className: d.icon, icon: E }),
          !w &&
            r.createElement(
              'span',
              {
                className: o()(
                  d.title,
                  !n && d.withoutIcon,
                  'medium' === f ? d.medium : d.large,
                  v && d.showLastDivider,
                ),
              },
              r.createElement(
                'span',
                { className: o()(d.titleText, 'apply-overflow-tooltip') },
                i,
              ),
              y &&
                !b &&
                r.createElement(a.Icon, { className: d.nested, icon: c }),
            ),
        )
      }
      !((e) => {
        ;(e.Medium = 'medium'), (e.Large = 'large')
      })(n || (n = {}))
    },
    65631: (e, t, i) => {
      var n, r
      function s(e) {
        return { isMobile: 'mobile' === e, isTablet: 'tablet' === e }
      }
      i.d(t, { getSidebarMode: () => s }),
        ((e) => {
          ;(e.Bold = 'bold'), (e.Default = 'default')
        })(n || (n = {})),
        ((e) => {
          ;(e.Tablet = 'tablet'), (e.Mobile = 'mobile')
        })(r || (r = {}))
    },
    37020: (e, t, i) => {
      i.r(t), i.d(t, { IndicatorsLibraryContainer: () => fe })
      var n = i(50959),
        r = i(11542),
        s = i(928)
      const o = r.t(null, void 0, i(69644))
      var a, l, c, d, u, h, p
      !((e) => {
        ;(e.Title = 'Title'), (e.Item = 'Item'), (e.Loader = 'Loader')
      })(a || (a = {})),
        ((e) => {
          ;(e.User = 'Script$USER'),
            (e.Public = 'Script$PUB'),
            (e.InviteOnly = 'Script$INVITE'),
            (e.Favorite = 'Script$FAVORITE'),
            (e.BuiltIn = 'tv-basicstudies'),
            (e.CandlestickPatterns = 'candlestick-patterns'),
            (e.Standard = 'Script$STD'),
            (e.VolumeProfile = 'tv-volumebyprice'),
            (e.Strategies = 'strategies'),
            (e.EditorsPicks = 'editorsPicks'),
            (e.Trending = 'trending'),
            (e.AutoJava = 'auto-java'),
            (e.AutoStandard = 'auto-standard'),
            (e.Auto = 'auto'),
            (e.OldChartPatterns = 'tv-chartpatterns'),
            (e.ChartPatterns = 'tv-chart_patterns')
        })(l || (l = {})),
        ((e) => {
          ;(e.Favorites = 'favorites'),
            (e.BuiltIns = 'built-ins'),
            (e.PublicLibrary = 'public-library'),
            (e.UserScripts = 'my-scripts'),
            (e.InviteOnlyScripts = 'invite-only-scripts'),
            (e.Addons = 'addons'),
            (e.Financials = 'financials')
        })(c || (c = {})),
        ((e) => {
          ;(e.Indicators = 'indicators'),
            (e.Strategies = 'strategies'),
            (e.Patterns = 'patterns'),
            (e.Profiles = 'profiles')
        })(d || (d = {})),
        ((e) => {
          ;(e.Top = 'top'),
            (e.EditorsPicks = 'editorsPicks'),
            (e.Trending = 'trending')
        })(u || (u = {})),
        ((e) => {
          ;(e.Top = 'top'), (e.Trending = 'trending')
        })(h || (h = {})),
        ((e) => {
          ;(e.Favorites = 'favorites'),
            (e.IncomeStatement = 'income statements'),
            (e.BalanceSheet = 'balance sheet'),
            (e.CashFlow = 'cash flow'),
            (e.Ratios = 'ratios'),
            (e.Statistics = 'statistics')
        })(p || (p = {}))
      var m = i(68159),
        f = i(56570),
        v = i(32755)
      function g(e, t) {
        const i = e.title.toLowerCase(),
          n = t.title.toLowerCase()
        return i < n ? -1 : i > n ? 1 : 0
      }
      const b = {
        earning: /EPS/,
        earnings: /EPS/,
        'trailing twelve months': /TTM/,
      }
      function _(e) {
        const {
            id: t,
            description: n,
            shortDescription: s,
            description_localized: a,
            is_hidden_study: l,
            version: c,
            extra: d,
            tags: u,
          } = e,
          h =
            f.enabled('graying_disabled_tools_enabled') &&
            window.ChartApiInstance?.studiesAccessController.isToolGrayed(n)
        return {
          id: t,
          title: a || r.t(n, { context: 'study' }, i(83477)),
          shortDescription: s,
          shortTitle: s,
          isStrategy: m.StudyMetaInfo.isScriptStrategy(e),
          isHidden: l,
          isNew: d?.isNew,
          isUpdated: d?.isUpdated,
          isBeta: d?.isBeta,
          isPro: d?.isPro,
          proBadgeTitle: o,
          isFundamental: !1,
          isOverlay: e.is_price_study,
          studyData: {
            id: t,
            version: c,
            descriptor: { type: 'java', studyId: e.id },
            packageName: y(t, d),
          },
          isGrayed: h,
          tags: u,
        }
      }
      function y(e, t) {
        return t?.isChartPattern
          ? 'tv-chart_patterns'
          : t?.isAuto
            ? 'auto-java'
            : m.StudyMetaInfo.getPackageName(e)
      }
      var w = i(97754),
        E = i.n(w),
        S = i(63932),
        I = i(79418),
        x = i(49483),
        C = i(69654),
        T = i(22265),
        R = i(92724)
      function N(e) {
        const { reference: t, className: i, ...r } = e
        return n.createElement('div', {
          ref: t,
          className: E()(R.container, i),
          ...r,
          'data-role': 'dialog-content',
        })
      }
      var k = i(29646)
      function D(e) {
        const { children: t, className: i, disabled: r } = e
        return n.createElement(
          'span',
          { className: E()(k.title, r && k.disabled, i) },
          t,
        )
      }
      const F = n.createContext(null)
      var L = i(24637),
        A = i(36189),
        P = i(68335),
        M = i(818)
      function W(e) {
        const t = (0, n.useContext)(F),
          {
            id: s,
            role: o,
            style: a,
            isMobile: l,
            item: c,
            query: d,
            regExpRules: u,
            isBeta: h,
            isNew: p,
            isUpdated: m,
            isSelected: f,
            isHighlighted: v,
            reference: g,
            onClick: b,
            renderActions: _,
            isPro: y,
            proBadgeTitle: w,
            onItemActionsClick: S,
            favoriteClickHandler: I,
            hideEP: x,
          } = e,
          { isFavorite: C, isLocked: T, public: R, editorsPick: N } = c,
          k = void 0 !== C,
          P = j(b, c),
          W = (0, n.useCallback)(
            (e) => {
              e.stopPropagation(), S?.()
            },
            [S],
          ),
          B = (0, n.useCallback)(
            (e) => {
              if (I) return S?.(), void I(e)
              if (t?.toggleFavorite) {
                j((e) => {
                  S?.(), t.toggleFavorite(e)
                }, c)(e)
              }
            },
            [I, S, t?.toggleFavorite],
          ),
          O = E()(
            M.container,
            l && M.mobile,
            c.isGrayed && M.disabled,
            f && M.selected,
            v && M.highlighted,
          )
        return n.createElement(
          'div',
          {
            id: s,
            role: o,
            ref: g,
            className: O,
            onClick: P,
            style: a,
            'data-role': 'list-item',
            'data-disabled': c.isGrayed,
            'data-title': c.title,
            'data-id': c.id,
          },
          n.createElement(
            'div',
            { className: E()(M.main, !k && M.paddingLeft) },
            k &&
              n.createElement(A.FavoriteButton, {
                className: E()(M.favorite, C && M.isActive),
                isFilled: C,
                onClick: B,
              }),
            n.createElement(
              D,
              {
                disabled: c.isGrayed,
                className: E()(l && M.mobileText),
              },
              n.createElement(L.HighlightedText, {
                queryString: d,
                rules: u,
                text: c.title,
              }),
            ),
            !1,
            h &&
              n.createElement(BadgeStatus, {
                type: 'beta',
                className: M.badge,
              }),
            p &&
              n.createElement(BadgeStatus, { type: 'new', className: M.badge }),
            m &&
              n.createElement(BadgeStatus, {
                type: 'updated',
                className: M.badge,
              }),
            Boolean(N && !x) &&
              n.createElement(BadgeStatus, {
                type: 'ep',
                className: M.badge,
                tooltip: r.t(null, void 0, i(10640)),
              }),
            !1,
          ),
          R &&
            n.createElement(
              'a',
              {
                href: R.authorLink,
                className: M.author,
                target: '_blank',
                onClick: W,
              },
              R.authorName,
            ),
          !l &&
            R &&
            n.createElement(
              'span',
              { className: M.likes },
              compactNumberFormat(R.likesCount),
            ),
          !1,
        )
      }
      function j(e, t) {
        return (i) => {
          const n = 0 === (0, P.modifiersFromEvent)(i) && 0 === i.button
          !i.defaultPrevented && e && n && (i.preventDefault(), e(t))
        }
      }
      var B,
        O = i(67646)
      function U(e) {
        const { title: t, type: i, className: r } = e
        return n.createElement(
          'h3',
          {
            className: E()(
              O.title,
              'Small' === i && O.small,
              'Normal' === i && O.normal,
              'Large' === i && O.large,
              r,
            ),
          },
          t,
        )
      }
      !((e) => {
        ;(e.Small = 'Small'), (e.Normal = 'Normal'), (e.Large = 'Large')
      })(B || (B = {}))
      var H = i(14360)
      function q(e) {
        const { style: t, children: i, isMobile: r } = e
        return n.createElement(
          'div',
          { style: t, className: E()(H.container, r && H.mobile) },
          i,
        )
      }
      var G = i(92164)
      function Y(e) {
        const [t, i] = (0, n.useState)(null)
        function r(e) {
          return e.findIndex((e) => t?.id === e.id)
        }
        return [
          t,
          i,
          () => {
            i(
              (() => {
                const i = r(e),
                  n = i === e.length - 1
                return null === t || -1 === i
                  ? (e[0] ?? null)
                  : n
                    ? e[i]
                    : e[i + 1]
              })(),
            )
          },
          () => {
            i(
              (() => {
                const i = r(e)
                return null === t || 0 === i || -1 === i
                  ? (e[0] ?? null)
                  : e[i - 1]
              })(),
            )
          },
        ]
      }
      var V = i(97006),
        X = i(23390),
        J = i(3292)
      function z(e) {
        const {
            reference: t,
            data: s,
            isOpened: o,
            onClose: a,
            applyStudy: l,
            shouldReturnFocus: c,
          } = e,
          [d, u] = (0, n.useState)(''),
          h = (0, n.useMemo)(() => (0, V.createRegExpList)(d, b), [d]),
          p = (0, n.useMemo)(
            () =>
              d
                ? (0, V.rankedSearch)({
                    data: s,
                    rules: h,
                    queryString: d,
                    primaryKey: 'shortDescription',
                    secondaryKey: 'title',
                    optionalPrimaryKey: 'shortTitle',
                    tertiaryKey: 'tags',
                  })
                : s,
            [d, h, s],
          ),
          m = (0, n.useMemo)(() => p.slice().sort($), [p]),
          {
            highlightedItem: f,
            selectedItem: v,
            selectedNodeReference: g,
            scrollContainerRef: _,
            searchInputRef: y,
            onClickStudy: w,
            handleKeyDown: R,
          } = ((e, t, i, r) => {
            let s = 0
            const [o, a] = (0, n.useState)(null),
              l = (0, n.useRef)(null),
              c = (0, n.useRef)(null),
              [d, u, h, p] = Y(t),
              m = (0, n.useRef)(null)
            return (
              (0, n.useEffect)(() => {
                e ? f(0) : u(null)
              }, [e]),
              (0, n.useEffect)(() => {
                void 0 !== r && (f(0), u(null))
              }, [r]),
              (0, n.useEffect)(
                () => (
                  o &&
                    (s = setTimeout(() => {
                      a(null)
                    }, 1500)),
                  () => {
                    clearInterval(s)
                  }
                ),
                [o],
              ),
              {
                highlightedItem: o,
                scrollContainerRef: l,
                selectedNodeReference: c,
                selectedItem: d,
                searchInputRef: m,
                onClickStudy: (e) => {
                  i && (i(e), u(e), a(e))
                },
                handleKeyDown: (e) => {
                  const [t, n] = ((e, t) => {
                    if (null === e.current || null === t.current) return [0, 0]
                    const i = e.current.getBoundingClientRect(),
                      n = t.current.getBoundingClientRect(),
                      { height: r } = i,
                      s = i.top - n.top,
                      o = i.bottom - n.bottom + r < 0 ? 0 : r,
                      a = s - r > 0 ? 0 : r,
                      { scrollTop: l } = t.current
                    return [l - a, l + o]
                  })(c, l)
                  if (
                    (40 === (0, P.hashFromEvent)(e) &&
                      (e.preventDefault(), h(), f(n)),
                    38 === (0, P.hashFromEvent)(e) &&
                      (e.preventDefault(), p(), f(t)),
                    13 === (0, P.hashFromEvent)(e) && d)
                  ) {
                    if (!i) return
                    i(d), a(d)
                  }
                },
              }
            )
            function f(e) {
              null !== l.current &&
                l.current.scrollTo &&
                l.current.scrollTo(0, e)
            }
          })(o, m, l),
          k = '' === d && !m.length
        ;(0, n.useEffect)(() => {
          o || u(''), x.CheckMobile.any() || y.current?.focus()
        }, [o])
        const D = (0, n.useId)()
        return n.createElement(I.AdaptivePopupDialog, {
          className: E()(J.dialogLibrary),
          isOpened: o,
          onClose: a,
          onClickOutside: a,
          title: r.t(null, void 0, i(84549)),
          dataName: 'indicators-dialog',
          onKeyDown: R,
          shouldReturnFocus: c,
          ref: t,
          render: () =>
            n.createElement(
              n.Fragment,
              null,
              n.createElement(C.DialogSearch, {
                reference: y,
                placeholder: r.t(null, void 0, i(8573)),
                onChange: F,
                onFocus: L,
                'aria-controls': D,
                'aria-owns': D,
                'aria-haspopup': 'listbox',
                activeDescendant: K(v?.id),
              }),
              n.createElement(
                T.DialogSidebarWrapper,
                null,
                n.createElement(
                  N,
                  { id: D, reference: _, role: 'listbox', className: J.scroll },
                  k
                    ? n.createElement(S.Spinner, null)
                    : m.length
                      ? n.createElement(
                          n.Fragment,
                          null,
                          n.createElement(
                            q,
                            null,
                            n.createElement(U, {
                              title: r.t(null, void 0, i(7378)),
                            }),
                          ),
                          m.map((e) =>
                            n.createElement(W, {
                              key: e.id,
                              id: K(e.id),
                              role: 'option',
                              item: e,
                              onClick: () => w(e),
                              query: d,
                              regExpRules: h,
                              reference: v?.id === e.id ? g : void 0,
                              isSelected: v?.id === e.id,
                              isHighlighted: f?.id === e.id,
                              favoriteClickHandler: (t) => {
                                t.stopPropagation(),
                                  (0, X.toggleFavorite)(e.title)
                              },
                            }),
                          ),
                        )
                      : n.createElement(G.ContentIsNotFound, {
                          className: J.noContentBlock,
                          description: r.t(null, void 0, i(70269)),
                        }),
                ),
              ),
            ),
        })
        function F(e) {
          u(e.target.value)
        }
        function L() {
          d.length > 0 && y.current?.select()
        }
      }
      function $(e, t) {
        return e.isFavorite === t.isFavorite ? 0 : e.isFavorite ? -1 : 1
      }
      const Z = 'indicators_dialog_item'
      function K(e) {
        if (void 0 !== e) return `${Z}_${e}`
      }
      var Q = i(76422),
        ee = i(16638),
        te = i(64147),
        ie = i(24437),
        ne = i(32227),
        re = i(90484),
        se = i(9745),
        oe = i(29196),
        ae = i(3602),
        le = i(99084)
      function ce(e) {
        const { text: t } = e,
          i = (0, oe.useHintShowAnimation)(2500)
        return n.createElement(
          'div',
          { className: ae.container },
          n.createElement(
            'div',
            { className: ae.centerElement },
            n.createElement(
              'div',
              { className: w(ae.contentWrap, i && ae.noticeShowed) },
              n.createElement(se.Icon, { icon: le, className: ae.icon }),
              n.createElement('div', { className: ae.textWrap }, t),
            ),
          ),
        )
      }
      class de {
        constructor(e) {
          ;(this._showed = !1),
            (this._wrap = document.createElement('div')),
            (this._container = e),
            (this._debouncedHide = (0, re.default)(() => this.hide(), 3e3))
        }
        show(e) {
          this._wrap &&
            !this._showed &&
            ((this._showed = !0),
            this._container.appendChild(this._wrap),
            ne.render(
              n.createElement(ce, {
                text: r.t(null, { replace: { studyTitle: e } }, i(33673)),
              }),
              this._wrap,
            ),
            this._debouncedHide())
        }
        hide() {
          this._wrap &&
            ((this._showed = !1),
            ne.unmountComponentAtNode(this._wrap),
            this._wrap.remove())
        }
        destroy() {
          this.hide(), delete this._wrap
        }
      }
      var ue = i(79036)
      class he {
        constructor(e) {
          ;(this._searchInputRef = n.createRef()),
            (this._dialog = n.createRef()),
            (this._rootInstance = null),
            (this._visibility = new te.WatchedValue(!1)),
            (this._container = document.createElement('div')),
            (this._isForceRender = !1),
            (this._parentSources = []),
            (this._isDestroyed = !1),
            (this._deepFundamentalsHistoryNotificationHasBeenShown = !1),
            (this._hintRenderer = null),
            (this._showDeepFundamentalsHistoryNotification = () => {}),
            (this._chartWidgetCollection = e)
        }
        isDestroyed() {
          return this._isDestroyed
        }
        visible() {
          return this._visibility.readonly()
        }
        resetAllStudies() {}
        updateFavorites() {}
        open(e, t, i, n, r) {
          ;(this._parentSources = e),
            this._updateSymbol(),
            this._setProps({
              isOpened: !0,
              shouldReturnFocus: r?.shouldReturnFocus,
            }),
            this._visibility.setValue(!0),
            Q.emit('indicators_dialog')
        }
        show(e) {
          this.open([], void 0, void 0, void 0, e)
        }
        hide() {
          ;(this._parentSources = []),
            this._setProps({ isOpened: !1 }),
            this._visibility.setValue(!1),
            this._hintRenderer?.destroy(),
            (this._hintRenderer = null)
        }
        destroy() {
          ;(this._isDestroyed = !0),
            this._hintRenderer?.destroy(),
            this._rootInstance?.unmount(),
            (this._rootInstance = null)
        }
        _shouldPreventRender() {
          return (
            this._isDestroyed ||
            (!this._isForceRender && !this._getProps().value().isOpened)
          )
        }
        _getRenderData() {
          return {
            props: this._getProps().value(),
            container: this._getContainer(),
          }
        }
        _applyStudy(e, t) {
          e.isGrayed
            ? Q.emit('onGrayedObjectClicked', {
                type: 'study',
                name: e.shortDescription,
              })
            : (x.CheckMobile.any() || this._searchInputRef.current?.select(),
              (async (e, t, i, n, r, o) => {
                const a = e.activeChartWidget.value()
                if (!a) return null
                const { studyData: l } = t
                if (!l) return Promise.resolve(null)
                const c = l.descriptor
                if ('java' === c.type) {
                  const e = (0, v.tryFindStudyLineToolNameByStudyId)(c.studyId)
                  if (null !== e)
                    return (
                      await (0, v.initLineTool)(e), s.tool.setValue(e), null
                    )
                }
                return a.insertStudy(
                  l.descriptor,
                  i,
                  {
                    stubTitle: t.shortDescription,
                    isFundamental: t.isFundamental,
                    isOverlay: t.isOverlay,
                  },
                  void 0,
                  o,
                )
              })(
                this._chartWidgetCollection,
                e,
                this._parentSources,
                0,
                this._symbol,
                () => this._showHint(e.title),
              ).then((t) => {
                null === t && this._hintRenderer?.hide(),
                  null !== t &&
                    ((0, ue.hasConfirmInputs)(t.metaInfo().inputs) ||
                      (0, ue.isSymbolicStudy)(t.metaInfo())) &&
                    this._hintRenderer?.show(e.title)
                window.is_authenticated
                x.CheckMobile.any() ||
                  ((null === document.activeElement ||
                    document.activeElement === document.body ||
                    (null !== this._dialog.current &&
                      this._dialog.current.contains(document.activeElement))) &&
                    this._searchInputRef.current?.focus())
              }))
        }
        _setProps(e) {
          const t = this._getProps().value(),
            { isOpened: i } = t
          this._isForceRender = i && 'isOpened' in e && !e.isOpened
          const n = { ...t, ...e }
          this._getProps().setValue(n)
        }
        _requestBuiltInJavaStudies() {
          return (0, ee.studyMetaInfoRepository)().findAllJavaStudies()
        }
        _focus() {
          this._getProps().value().isOpened && this._dialog.current?.focus()
        }
        _getContainer() {
          return this._container
        }
        _getDialog() {
          return this._dialog
        }
        _getSymbol() {
          return this._symbol
        }
        _updateSymbol() {
          this._symbol = void 0
        }
        _showHint(e) {
          if (window.matchMedia(ie.DialogBreakpoints.TabletSmall).matches) {
            if ((this._hintRenderer?.hide(), !this._hintRenderer)) {
              const e = this._dialog.current?.getElement()
              e && (this._hintRenderer = new de(e))
            }
            this._hintRenderer?.show(e)
          }
        }
      }
      function pe(e, t) {
        return e[t] || []
      }
      var me = i(87896)
      class fe extends he {
        constructor(e, t) {
          super(e),
            (this._options = { onWidget: !1 }),
            (this._indicatorData = []),
            t && (this._options = t),
            (this._props = new te.WatchedValue({
              data: [],
              applyStudy: this._applyStudy.bind(this),
              isOpened: !1,
              reference: this._getDialog(),
              onClose: this.hide.bind(this),
            })),
            this._getProps().subscribe(this._render.bind(this)),
            this._init()
        }
        _getProps() {
          return this._props
        }
        async _init() {
          const e = ((e) => {
            const t = {}
            return (
              e.forEach((e) => {
                const { studyData: i } = e
                if (!i) return
                const { packageName: n } = i
                n in t ? t[n].push(e) : (t[n] = [e])
              }),
              t
            )
          })(
            ((e, t = !0) =>
              e.filter((e) => {
                const i = !!t || !((e) => e.isStrategy)(e)
                return !e.isHidden && i
              }))((await this._requestBuiltInJavaStudies()).map(_)),
          )
          ;(this._indicatorData = await (async (e, t) => {
            const i = { ...t }
            return [
              ...pe(i, 'tv-basicstudies'),
              ...pe(i, 'Script$STD'),
              ...pe(i, 'tv-volumebyprice'),
            ]
              .filter((e) => !e.isStrategy)
              .sort(g)
          })(this._options.onWidget, e)),
            this._setFavorites(),
            this._setProps({ data: this._indicatorData }),
            X.favoriteAdded.subscribe(null, () => this._refreshFavorites()),
            X.favoriteRemoved.subscribe(null, () => this._refreshFavorites())
        }
        _setFavorites() {
          f.enabled('items_favoriting') &&
            this._indicatorData.forEach((e) => {
              e.isFavorite = (0, X.isFavorite)(e.title)
            })
        }
        _refreshFavorites() {
          this._setFavorites(), this._setProps({ data: this._indicatorData })
        }
        _render() {
          if (this._shouldPreventRender()) return
          const { props: e, container: t } = this._getRenderData(),
            i = n.createElement(z, { ...e })
          this._rootInstance
            ? this._rootInstance.render(i)
            : (this._rootInstance = (0, me.createReactRoot)(i, t))
        }
      }
    },
    74670: (e, t, i) => {
      i.d(t, { useActiveDescendant: () => s })
      var n = i(50959),
        r = i(39416)
      function s(e, t = []) {
        const [i, s] = (0, n.useState)(!1),
          o = (0, r.useFunctionalRefObject)(e)
        return (
          (0, n.useLayoutEffect)(() => {
            const e = o.current
            if (null === e) return
            const t = (e) => {
              switch (e.type) {
                case 'active-descendant-focus':
                  s(!0)
                  break
                case 'active-descendant-blur':
                  s(!1)
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
          [o, i]
        )
      }
    },
    71402: (e, t, i) => {
      i.d(t, { RemoveTitleType: () => n, removeTitlesMap: () => s })
      var n,
        r = i(11542)
      !((e) => {
        ;(e.Add = 'add'), (e.Remove = 'remove')
      })(n || (n = {}))
      const s = {
        [n.Add]: r.t(null, void 0, i(69207)),
        [n.Remove]: r.t(null, void 0, i(85106)),
      }
    },
    36189: (e, t, i) => {
      i.d(t, { FavoriteButton: () => h })
      var n = i(50959),
        r = i(97754),
        s = i.n(r),
        o = i(9745),
        a = i(71402),
        l = i(74670),
        c = i(39146),
        d = i(48010),
        u = i(22413)
      function h(e) {
        const {
            className: t,
            isFilled: i,
            isActive: r,
            onClick: h,
            title: p,
            ...m
          } = e,
          [f, v] = (0, l.useActiveDescendant)(null),
          g =
            p ??
            (i
              ? a.removeTitlesMap[a.RemoveTitleType.Remove]
              : a.removeTitlesMap[a.RemoveTitleType.Add])
        return (
          (0, n.useLayoutEffect)(() => {
            const e = f.current
            e instanceof HTMLElement &&
              g &&
              e.dispatchEvent(new CustomEvent('common-tooltip-update'))
          }, [g, f]),
          n.createElement(o.Icon, {
            ...m,
            className: s()(
              u.favorite,
              'apply-common-tooltip',
              i && u.checked,
              r && u.active,
              v && u.focused,
              t,
            ),
            onClick: h,
            icon: i ? c : d,
            title: g,
            ariaLabel: g,
            ref: f,
          })
        )
      }
    },
    90692: (e, t, i) => {
      i.d(t, { MatchMedia: () => r })
      var n = i(50959)
      class r extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._handleChange = () => {
              this.forceUpdate()
            }),
            (this.state = { query: window.matchMedia(this.props.rule) })
        }
        componentDidMount() {
          this._subscribe(this.state.query)
        }
        componentDidUpdate(e, t) {
          this.state.query !== t.query &&
            (this._unsubscribe(t.query), this._subscribe(this.state.query))
        }
        componentWillUnmount() {
          this._unsubscribe(this.state.query)
        }
        render() {
          return this.props.children(this.state.query.matches)
        }
        static getDerivedStateFromProps(e, t) {
          return e.rule !== t.query.media
            ? {
                query: window.matchMedia(e.rule),
              }
            : null
        }
        _subscribe(e) {
          e.addEventListener('change', this._handleChange)
        }
        _unsubscribe(e) {
          e.removeEventListener('change', this._handleChange)
        }
      }
    },
    42842: (e, t, i) => {
      i.d(t, { Portal: () => c, PortalContext: () => d })
      var n = i(50959),
        r = i(32227),
        s = i(55698),
        o = i(67961),
        a = i(34811),
        l = i(99663)
      class c extends n.PureComponent {
        constructor() {
          super(...arguments), (this._uuid = (0, s.nanoid)())
        }
        componentWillUnmount() {
          this._manager().removeWindow(this._uuid)
        }
        render() {
          const e = this._manager().ensureWindow(
            this._uuid,
            this.props.layerOptions,
          )
          ;(e.style.top = this.props.top || ''),
            (e.style.bottom = this.props.bottom || ''),
            (e.style.left = this.props.left || ''),
            (e.style.right = this.props.right || ''),
            (e.style.pointerEvents = this.props.pointerEvents || '')
          const t = this.props.className
          return (
            t &&
              ('string' == typeof t
                ? e.classList.add(t)
                : e.classList.add(...t)),
            this.props.shouldTrapFocus &&
              !e.hasAttribute(a.FOCUS_TRAP_DATA_ATTRIBUTE) &&
              e.setAttribute(a.FOCUS_TRAP_DATA_ATTRIBUTE, 'true'),
            this.props['aria-hidden'] && e.setAttribute('aria-hidden', 'true'),
            r.createPortal(
              n.createElement(d.Provider, { value: this }, this.props.children),
              e,
            )
          )
        }
        moveToTop() {
          this._manager().moveToTop(this._uuid)
        }
        _manager() {
          return null === this.context
            ? (0, o.getRootOverlapManager)()
            : this.context
        }
      }
      c.contextType = l.SlotContext
      const d = n.createContext(null)
    },
    63932: (e, t, i) => {
      i.d(t, { Spinner: () => l })
      var n = i(50959),
        r = i(97754),
        s = i(58096),
        o = (i(15216), i(85862)),
        a = i.n(o)
      function l(e) {
        const {
          ariaLabel: t,
          ariaLabelledby: i,
          className: o,
          style: l,
          size: c,
          id: d,
          disableSelfPositioning: u,
        } = e
        return n.createElement('div', {
          className: r(
            o,
            'tv-spinner',
            'tv-spinner--shown',
            `tv-spinner--size_${s.spinnerSizeMap[c || s.DEFAULT_SIZE]}`,
            u && a().disableSelfPositioning,
          ),
          style: l,
          role: 'progressbar',
          id: d,
          'aria-label': t,
          'aria-labelledby': i,
        })
      }
    },
    23390: (e, t, i) => {
      i.r(t),
        i.d(t, {
          favoriteAdded: () => s,
          favoriteRemoved: () => o,
          favoritesSynced: () => a,
          isFavorite: () => d,
          saveFavorites: () => p,
          toggleFavorite: () => c,
        })
      var n = i(52033),
        r = i(56840)
      const s = new n.Delegate(),
        o = new n.Delegate(),
        a = new n.Delegate()
      let l = []
      function c(e) {
        return -1 === u(e)
          ? (((e) => {
              !d(e) && (l.push(e), p(), s.fire(e))
            })(e),
            !0)
          : (((e) => {
              const t = u(e)
              ;-1 !== t && (l.splice(t, 1), p(), o.fire(e))
            })(e),
            !1)
      }
      function d(e) {
        return -1 !== u(e)
      }
      function u(e) {
        return l.indexOf(e)
      }
      function h() {
        l = []
        const e = Boolean(
            void 0 === (0, r.getValue)('chart.favoriteLibraryIndicators'),
          ),
          t = (0, r.getJSON)('chart.favoriteLibraryIndicators', [])
        if (
          (l.push(...t), 0 === l.length && e && 'undefined' != typeof window)
        ) {
          const e = JSON.parse(window.urlParams?.favorites ?? '{}').indicators
          e && Array.isArray(e) && l.push(...e)
        }
        a.fire()
      }
      function p() {
        const e = l.slice()
        ;(0, r.setJSON)('chart.favoriteLibraryIndicators', e)
      }
      h(), r.onSync.subscribe(null, h)
    },
    99084: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm4-9.97L11.9 6 8.3 9.82 6.1 7.46 4.99 8.5 8.32 12 13 7.03Z"/></svg>'
    },
    68648: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentcolor" stroke-width="1.3" d="M12 9l5 5-5 5"/></svg>'
    },
    39146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>'
    },
    48010: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>'
    },
    55698: (e, t, i) => {
      i.d(t, { nanoid: () => n })
      const n = (e = 21) =>
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
  },
])
