;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4876],
  {
    665197: (t) => {
      t.exports = {
        'css-value-widgetbar-tabs-width': '45px',
        'css-value-widgetbar-border-width': '1px',
      }
    },
    345350: (t) => {
      t.exports = {
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
    690784: (t) => {
      t.exports = {
        counter: 'counter-napy2vLF',
        'size-xxxsmall': 'size-xxxsmall-napy2vLF',
        'size-xxsmall': 'size-xxsmall-napy2vLF',
        'size-xsmall': 'size-xsmall-napy2vLF',
        'size-small': 'size-small-napy2vLF',
        'size-medium': 'size-medium-napy2vLF',
        'size-large': 'size-large-napy2vLF',
        'size-xlarge': 'size-xlarge-napy2vLF',
        'color-danger': 'color-danger-napy2vLF',
        'color-accent': 'color-accent-napy2vLF',
        'color-accent-light': 'color-accent-light-napy2vLF',
        'color-neutral-bold': 'color-neutral-bold-napy2vLF',
        'color-neutral': 'color-neutral-napy2vLF',
        'borderColor-primary': 'borderColor-primary-napy2vLF',
        'borderColor-secondary': 'borderColor-secondary-napy2vLF',
        'borderColor-tertiary': 'borderColor-tertiary-napy2vLF',
      }
    },
    147023: (t) => {
      t.exports = {
        'css-value-widgets-margin': '4px',
        widget: 'widget-X9EuSe_t',
        widgetHeader: 'widgetHeader-X9EuSe_t',
        widgetTitle: 'widgetTitle-X9EuSe_t',
        headerSpace: 'headerSpace-X9EuSe_t',
      }
    },
    415336: (t) => {
      t.exports = {}
    },
    901574: (t) => {
      t.exports = {}
    },
    842039: (t) => {
      t.exports = {}
    },
    285778: (t) => {
      t.exports = { wrapper: 'wrapper-PQ5O_1M7', touch: 'touch-PQ5O_1M7' }
    },
    165719: (t) => {
      t.exports = {}
    },
    389986: (t, e, i) => {
      i.d(e, { CloseButton: () => c })
      var s = i(50959),
        n = i(270762),
        a = i(117105),
        r = i(315130),
        o = i(238822),
        l = i(663346),
        h = i(534983)
      function d(t = 'large') {
        switch (t) {
          case 'large':
            return a
          case 'medium':
          default:
            return r
          case 'small':
            return o
          case 'xsmall':
            return l
          case 'xxsmall':
            return h
        }
      }
      const c = s.forwardRef((t, e) =>
        s.createElement(n.NavButton, { ...t, ref: e, icon: d(t.size) }),
      )
    },
    270762: (t, e, i) => {
      i.d(e, { NavButton: () => h })
      var s = i(50959),
        n = i(497754),
        a = i(72571),
        r = i(345350)
      function o(t) {
        const {
          size: e = 'large',
          preservePaddings: i,
          isLink: s,
          flipIconOnRtl: a,
          className: o,
        } = t
        return n(
          r['nav-button'],
          r[`size-${e}`],
          i && r['preserve-paddings'],
          a && r['flip-icon'],
          s && r.link,
          o,
        )
      }
      function l(t) {
        const { children: e, icon: i } = t
        return s.createElement(
          s.Fragment,
          null,
          s.createElement('span', { className: r.background }),
          s.createElement(a.Icon, {
            icon: i,
            className: r.icon,
            'aria-hidden': !0,
          }),
          e && s.createElement('span', { className: r['visually-hidden'] }, e),
        )
      }
      const h = (0, s.forwardRef)((t, e) => {
        const {
          icon: i,
          type: n = 'button',
          preservePaddings: a,
          flipIconOnRtl: r,
          size: h,
          'aria-label': d,
          ...c
        } = t
        return s.createElement(
          'button',
          { ...c, className: o({ ...t, children: d }), ref: e, type: n },
          s.createElement(l, { icon: i }, d),
        )
      })
      h.displayName = 'NavButton'
      var d = i(591365),
        c = i(273388)
      ;(0, s.forwardRef)((t, e) => {
        const { icon: i, renderComponent: n, 'aria-label': a, ...r } = t,
          h = null != n ? n : d.CustomComponentDefaultLink
        return s.createElement(
          h,
          {
            ...r,
            className: o({ ...t, children: a, isLink: !0 }),
            reference: (0, c.isomorphicRef)(e),
          },
          s.createElement(l, { icon: i }, a),
        )
      }).displayName = 'NavAnchorButton'
    },
    409245: (t, e, i) => {
      function s(t) {
        const { reference: e, ...i } = t
        return { ...i, ref: e }
      }
      i.d(e, { renameRef: () => s })
    },
    591365: (t, e, i) => {
      i.d(e, { CustomComponentDefaultLink: () => a })
      var s = i(50959),
        n = i(409245)
      function a(t) {
        return s.createElement('a', { ...(0, n.renameRef)(t) })
      }
      s.PureComponent
    },
    718736: (t, e, i) => {
      i.d(e, { useFunctionalRefObject: () => a })
      var s = i(50959),
        n = i(855393)
      function a(t) {
        const e = (0, s.useMemo)(
            () =>
              ((t) => {
                const e = (i) => {
                  t(i), (e.current = i)
                }
                return (e.current = null), e
              })((t) => {
                o.current(t)
              }),
            [],
          ),
          i = (0, s.useRef)(null),
          a = (e) => {
            if (null === e) return r(i.current, e), void (i.current = null)
            i.current !== t && ((i.current = t), r(i.current, e))
          },
          o = (0, s.useRef)(a)
        return (
          (o.current = a),
          (0, n.useIsomorphicLayoutEffect)(() => {
            if (null !== e.current)
              return o.current(e.current), () => o.current(null)
          }, [t]),
          e
        )
      }
      function r(t, e) {
        null !== t && ('function' == typeof t ? t(e) : (t.current = e))
      }
    },
    975228: (t, e, i) => {
      i.d(e, {
        hoverMouseEventFilter: () => a,
        useAccurateHover: () => r,
        useHover: () => n,
      })
      var s = i(50959)
      function n() {
        const [t, e] = (0, s.useState)(!1)
        return [
          t,
          {
            onMouseOver: (t) => {
              a(t) && e(!0)
            },
            onMouseOut: (t) => {
              a(t) && e(!1)
            },
          },
        ]
      }
      function a(t) {
        return !t.currentTarget.contains(t.relatedTarget)
      }
      function r(t) {
        const [e, i] = (0, s.useState)(!1)
        return (
          (0, s.useEffect)(() => {
            const e = (e) => {
              if (null === t.current) return
              const s = t.current.contains(e.target)
              i(s)
            }
            return (
              document.addEventListener('mouseover', e),
              () => document.removeEventListener('mouseover', e)
            )
          }, []),
          e
        )
      }
    },
    855393: (t, e, i) => {
      i.d(e, { useIsomorphicLayoutEffect: () => n })
      var s = i(50959)
      function n(t, e) {
        ;('undefined' == typeof window ? s.useEffect : s.useLayoutEffect)(t, e)
      }
    },
    664332: (t, e, i) => {
      i.d(e, { useResizeObserver: () => o })
      var s = i(50959),
        n = i(159255),
        a = i(855393),
        r = i(718736)
      function o(t, e = []) {
        const { callback: i, ref: o = null } = ((t) =>
            'function' == typeof t ? { callback: t } : t)(t),
          l = (0, s.useRef)(null),
          h = (0, s.useRef)(i)
        h.current = i
        const d = (0, r.useFunctionalRefObject)(o),
          c = (0, s.useCallback)(
            (t) => {
              d(t),
                null !== l.current &&
                  (l.current.disconnect(), null !== t && l.current.observe(t))
            },
            [d, l],
          )
        return (
          (0, a.useIsomorphicLayoutEffect)(
            () => (
              (l.current = new n.default((t, e) => {
                h.current(t, e)
              })),
              d.current && c(d.current),
              () => {
                var t
                null === (t = l.current) || void 0 === t || t.disconnect()
              }
            ),
            [d, ...e],
          ),
          c
        )
      }
    },
    72571: (t, e, i) => {
      i.d(e, { Icon: () => n })
      var s = i(50959)
      const n = s.forwardRef((t, e) => {
        const { icon: i = '', ...n } = t
        return s.createElement('span', {
          ...n,
          ref: e,
          dangerouslySetInnerHTML: { __html: i },
        })
      })
    },
    65160: (t, e, i) => {
      function s(t) {
        const { paddingTop: e, paddingBottom: i } = window.getComputedStyle(t)
        return [e, i].reduce(
          (t, e) => t - Number((e || '').replace('px', '')),
          t.clientHeight,
        )
      }
      function n(t, e = !1) {
        const i = getComputedStyle(t),
          s = [i.height]
        return (
          'border-box' !== i.boxSizing &&
            s.push(
              i.paddingTop,
              i.paddingBottom,
              i.borderTopWidth,
              i.borderBottomWidth,
            ),
          e && s.push(i.marginTop, i.marginBottom),
          s.reduce((t, e) => t + (Number.parseFloat(e) || 0), 0)
        )
      }
      function a(t, e = !1) {
        const i = getComputedStyle(t),
          s = [i.width]
        return (
          'border-box' !== i.boxSizing &&
            s.push(
              i.paddingLeft,
              i.paddingRight,
              i.borderLeftWidth,
              i.borderRightWidth,
            ),
          e && s.push(i.marginLeft, i.marginRight),
          s.reduce((t, e) => t + (Number.parseFloat(e) || 0), 0)
        )
      }
      i.d(e, {
        contentHeight: () => s,
        outerHeight: () => n,
        outerWidth: () => a,
      })
    },
    111706: (t, e, i) => {
      function s(t) {
        return 0 === t.detail
      }
      i.d(e, { isKeyboardClick: () => s })
    },
    273388: (t, e, i) => {
      function s(t) {
        return (e) => {
          t.forEach((t) => {
            'function' == typeof t ? t(e) : null != t && (t.current = e)
          })
        }
      }
      function n(t) {
        return s([t])
      }
      i.d(e, { isomorphicRef: () => n, mergeRefs: () => s })
    },
    269842: (t, e, i) => {
      function s(...t) {
        return (e) => {
          for (const i of t) void 0 !== i && i(e)
        }
      }
      i.d(e, { createSafeMulticastEventHandler: () => s })
    },
    247465: (t, e, i) => {
      i.d(e, { isCancelled: () => a, makeCancelable: () => n })
      class s extends Error {
        constructor() {
          super('CancelToken')
        }
      }
      function n(t) {
        let e = !1
        return {
          promise: new Promise((i, n) => {
            t.then((t) => (e ? n(new s()) : i(t))),
              t.catch((t) => n(e ? new s() : t))
          }),
          cancel() {
            e = !0
          },
        }
      }
      function a(t) {
        return t instanceof s
      }
    },
    32349: (t, e, i) => {
      i.r(e), i.d(e, { DataWindowRenderer: () => a })
      var s = i(48547),
        n = i(466052)
      class a extends s.WidgetbarWidgetRenderer {
        constructor(t) {
          var e, i
          super(t),
            (this._mounted = !1),
            (this._contentRenderer = null),
            (this._updateDelegate = new n.Delegate()),
            (this.fullUpdate = () => {
              var t
              this._updateChartWidget(),
                this._mounted &&
                  (null === (t = this._contentRenderer) ||
                    void 0 === t ||
                    t.call(this))
            }),
            (this._activityChangeHandler = (t) => {
              t
                ? this._chartWidgetCollection.activeChartWidget.subscribe(
                    this.fullUpdate,
                    { callWithLast: !0 },
                  )
                : this._chartWidgetCollection.activeChartWidget.unsubscribe(
                    this.fullUpdate,
                  )
            }),
            (this._props = t)
          const s =
            null === (i = (e = this._props).getChartWidgetCollection) ||
            void 0 === i
              ? void 0
              : i.call(e)
          if (!s) throw new Error('ChartWidgetCollection is required')
          ;(this._chartWidgetCollection = s),
            (this._chartWidget =
              this._chartWidgetCollection.activeChartWidget.value()),
            this._props.active.subscribe(this._activityChangeHandler, {
              callWithLast: !0,
            })
        }
        mount() {
          if (this._mounted) return
          this._mounted = !0
          const t = (this._loadModulePromise = Promise.all([
            Promise.resolve().then(i.t.bind(i, 50959, 19)),
            Promise.resolve().then(i.t.bind(i, 500962, 19)),
            Promise.all([
              i.e(6747),
              i.e(5542),
              i.e(2567),
              i.e(3141),
              i.e(1205),
            ]).then(i.bind(i, 792199)),
          ]).then(([e, i, s]) => {
            this._loadModulePromise === t &&
              ((this._contentRenderer = () => {
                i.render(
                  e.createElement(s.DataWindow, {
                    selectedSourcesWV:
                      this._chartWidgetCollection.selectedSources,
                    chartWidget: this._chartWidget,
                    updateDelegate: this._updateDelegate,
                  }),
                  this._container,
                )
              }),
              this._contentRenderer())
          }))
        }
        unmount() {
          this._mounted &&
            ((this._mounted = !1),
            super.unmount(),
            (this._loadModulePromise = null))
        }
        unmountBody() {
          this._mounted &&
            ((this._mounted = !1),
            super.unmountBody(),
            (this._loadModulePromise = null))
        }
        destroy() {
          this._props.active.unsubscribe(this._activityChangeHandler),
            super.destroy()
        }
        update() {
          this._mounted && this._updateDelegate.fire()
        }
        _updateChartWidget() {
          const t = this._chartWidget,
            e = this._chartWidgetCollection.activeChartWidget.value()
          t && t.removeDataWindowWidget(),
            e && ((this._chartWidget = e), e.setDataWindowWidget(this))
        }
      }
    },
    476702: (t, e, i) => {
      i.r(e), i.d(e, { WidgetBar: () => Ht })
      var s = i(914314),
        n = i(650151),
        a = (i(665197), i(609838)),
        r = i(144273),
        o = i(50959),
        l = i(500962),
        h = i(650802)
      const d = {
        isActive: !1,
        notificationCount: 0,
        notificationCounterAriaLabel: '',
      }
      class c {
        constructor(t) {
          const e = { ...d, ...t }
          ;(this.isActive = new h.WatchedValue(e.isActive)),
            (this.notificationsCount = new h.WatchedValue(e.notificationCount)),
            (this.notificationCounterAriaLabel = new h.WatchedValue(
              e.notificationCounterAriaLabel,
            )),
            (this.icon = new h.WatchedValue(e.icon)),
            (this.hint = new h.WatchedValue(e.hint)),
            (this.onClick = new h.WatchedValue(e.onClick)),
            (this.TabButtonComponent = t.TabButtonComponent)
        }
        onActiveStateChange(t) {
          this.isActive.setValue(t)
        }
        updateNotifications(t) {
          this.notificationsCount.setValue(t)
        }
        updateNotificationCounterAriaLabel(t) {
          this.notificationCounterAriaLabel.setValue(t)
        }
      }
      var u = i(191085),
        g = i(452970),
        p = i(981132),
        _ = i(147023)
      const m = Number.parseInt(_['css-value-widgets-margin']),
        v = {
          reuters_calendar: {
            title: a.t(null, void 0, i(570779)),
            emptyHeader: !0,
            ctor: null,
            lazyLoad: !0,
            widgetClass: _.widget,
            headerClass: _.widgetHeader,
            noHeaderSpace: !0,
            options: { trackAction: undefined, showTableHeader: !0 },
          },
          earnings_calendar: {
            title: a.t(null, void 0, i(713823)),
            ctor: null,
            lazyLoad: !0,
            emptyHeader: !0,
            widgetClass: _.widget,
            headerClass: _.widgetHeader,
            margin: m,
          },
          watchlist: {
            title: a.t(null, void 0, i(213402)),
            ctor: null,
            lazyLoad: !0,
            chartWidgetAllowed: !0,
            emptyHeader: !0,
            widgetClass: _.widget,
            headerClass: _.widgetHeader,
            margin: m,
            preloadDelay: 6e4,
          },
          hotlist: {
            title: a.t(null, void 0, i(20931)),
            ctor: null,
            lazyLoad: !0,
            chartWidgetAllowed: !0,
            emptyHeader: !0,
            widgetClass: _.widget,
            headerClass: _.widgetHeader,
            margin: m,
          },
          detail: {
            title: a.t(null, void 0, i(557027)),
            ctor: null,
            lazyLoad: !0,
            chartWidgetAllowed: !0,
            widgetClass: _.widget,
            headerClass: _.widgetHeader,
            margin: m,
            emptyHeader: !0,
            noHeaderSpace: !0,
          },
          news: {
            title: a.t(null, void 0, i(303160)),
            ctor: null,
            noHeaderSpace: !0,
            widgetClass: _.widget,
            headerClass: _.widgetHeader,
            titleClass: _.widgetTitle,
            margin: m,
          },
          notifications_user: {
            title: a.t(null, void 0, i(230163)),
            ctor: null,
            options: { type: 'user' },
            chartWidgetAllowed: !0,
          },
          notifications_following: {
            title: a.t(null, void 0, i(406501)),
            ctor: null,
            options: { type: 'following' },
            chartWidgetAllowed: !0,
          },
          datawindow: {
            title: a.t(null, void 0, i(409068)),
            ctor: null,
            chartWidgetAllowed: !0,
            chartWidgetRequired: !0,
          },
          notes: {
            title: a.t(null, void 0, i(137706)),
            ctor: null,
            lazyLoad: !0,
            chartWidgetAllowed: !0,
          },
          alerts_manage: {
            ctor: null,
            lazyLoad: !0,
            chartWidgetAllowed: !0,
            emptyHeader: !0,
            noHeaderSpace: !0,
            doNotClearNotifications: !0,
            doNotClearNotificationsOnVisibilityChange: !0,
            widgetClass: _.widget,
            headerClass: _.widgetHeader,
            margin: m,
          },
          alerts_log: {
            ctor: null,
            chartWidgetAllowed: !0,
            emptyHeader: !0,
            noHeaderSpace: !0,
            doNotClearNotifications: !0,
            doNotClearNotificationsOnVisibilityChange: !0,
            widgetClass: _.widget,
            headerClass: _.widgetHeader,
            margin: m,
          },
          market_summary: { title: a.t(null, void 0, i(102467)), ctor: null },
          object_tree: {
            title: a.t(null, void 0, i(960534)),
            ctor: null,
            noHeader: !0,
            chartWidgetAllowed: !0,
            chartWidgetRequired: !0,
          },
          streams: {
            title: a.t(null, void 0, i(841888)),
            ctor: null,
            emptyHeader: !0,
            widgetClass: _.widget,
            headerClass: _.widgetHeader,
            margin: m,
            doNotClearNotifications: !0,
            doNotClearNotificationsOnVisibilityChange: !0,
          },
          unionchats: {
            ctor: null,
            emptyHeader: !0,
            widgetClass: _.widget,
            headerClass: _.widgetHeader,
            margin: m,
            chartWidgetAllowed: !0,
            noHeaderSpace: !0,
          },
          pine_logs: {
            title: a.t(null, void 0, i(639434)),
            ctor: null,
            chartWidgetAllowed: !0,
            noHeader: !0,
            widgetClass: _.widget,
            margin: m,
          },
        },
        w = { base: u }
      ;(w['object-tree'] = g), (w.datawindow = p)
      var b = i(497754),
        f = i.n(b),
        y = i(852752),
        C = i(466052),
        S = i(688401),
        L = i(98454),
        W = i(32133),
        T = i(870122)
      class B {
        constructor(t) {
          ;(this._settingsKey = null),
            (this._value = null),
            (this._watchedValue = new h.WatchedValue(null)),
            t &&
              t.settingsKey &&
              ((this._settingsKey = t.settingsKey),
              (this._value = T.getJSON(this._settingsKey, null)),
              (this._watchedValue = new h.WatchedValue(this._value))),
            t &&
              t.widgetBarWidget &&
              Object.defineProperty(this, 'widgetBarWidget', {
                value: t.widgetBarWidget,
                configurable: !0,
              })
        }
        value() {
          return this._value
        }
        setValue(t, e) {
          return (
            (this._value = t),
            this._watchedValue.setValue(this._value),
            this._settingsKey &&
              (null == t
                ? ((0, W.trackEvent)(
                    'Settings debug',
                    'WigdetProperties.setValue: ' + this._settingsKey,
                    window.user.username,
                  ),
                  T.remove(this._settingsKey))
                : T.setJSON(this._settingsKey, t, e)),
            this._value
          )
        }
        readonly() {
          return this._watchedValue.readonly()
        }
        destroy() {
          this._watchedValue.destroy()
        }
      }
      var E,
        H = i(821205)
      const M = new (((E = class {
        postMessage(t, e) {
          E._handlers.forEach((i) => {
            i.handler(t, e)
          })
        }
        onMessage(t) {
          'function' == typeof t &&
            E._handlers.push({ handler: t, widget: this })
        }
        offMessage(t) {
          if ('function' == typeof t) {
            const e = E._handlers.findIndex((e) => e.handler === t)
            ;-1 !== e && E._handlers.splice(e, 1)
          }
        }
        offWidget(t) {
          E._handlers = E._handlers.filter((e) => e.widget !== t)
        }
      })._handlers = []),
      E)()
      var z = i(189904),
        x = i(496818)
      class k {
        constructor(t) {
          ;(this.heightRatio = k.heightRatio),
            (this.minHeight = 0),
            (this.widgetConfig = null),
            (this.widgetActive = new h.WatchedValue()),
            (this.widgetMaximized = new h.WatchedValue()),
            (this.widgetVisible = null),
            (this.symbolLinking = null),
            (this.intervalLinking = null),
            (this._header = null),
            (this._widget = null),
            (this._headerIcon = null),
            (this._headerspace = null),
            (this._title = null),
            (this._resizehandle = null),
            (this._widgetStarted = new C.Delegate()),
            (this._resizer = null),
            (this._internalState = {
              alive: new h.WatchedValue(!0),
              container: new h.WatchedValue(),
              width: new h.WatchedValue(),
              height: new h.WatchedValue(),
              detachable: new h.WatchedValue(!1),
            }),
            t && t.widgetBarPage && (this.widgetBarPage = t.widgetBarPage),
            (this._rdState = new y.ResizerDetacherState(this._internalState)),
            this._rdState.owner.subscribe((t) => {
              t !== this._internalState &&
                (this._internalState.container.value().innerHTML = '')
            })
        }
        element(t) {
          switch (t) {
            case 'widget':
              return this._widget
            case 'header':
              return this._header
            case 'resize-handle':
              return this._resizehandle
            default:
              return null
          }
        }
        setHeight(t) {
          this._internalState.container.value() &&
            (this._internalState.container.value().style.height = t + 'px'),
            this._internalState.height.setValue(t)
        }
        onWidthChange(t) {
          this._internalState.width.setValue(t)
        }
        remove() {
          this.widgetBarPage && this.widgetBarPage.removeWidget(this)
        }
        destroy() {
          var t, e, i, s, n, a
          this.widgetObject &&
            'destroy' in this.widgetObject &&
            this.widgetObject.destroy(),
            this.remove(),
            this.symbolLinking &&
              (this.symbolLinking.destroy(), (this.symbolLinking = null)),
            this.intervalLinking &&
              (this.intervalLinking.destroy(), (this.intervalLinking = null)),
            this.widgetVisible &&
              (this.widgetVisible.unsubscribe(), (this.widgetVisible = null)),
            this.widgetActive &&
              (this.widgetActive.unsubscribe(), (this.widgetActive = null)),
            this.widgetMaximized &&
              (this.widgetMaximized.unsubscribe(),
              (this.widgetMaximized = null)),
            this.properties &&
              (this.properties.destroy(), delete this.properties),
            null === (t = this._header) || void 0 === t || t.remove(),
            null === (e = this._widget) || void 0 === e || e.remove(),
            null === (i = this._headerIcon) || void 0 === i || i.remove(),
            null === (s = this._headerspace) || void 0 === s || s.remove(),
            null === (n = this._title) || void 0 === n || n.remove(),
            null === (a = this._resizehandle) || void 0 === a || a.remove(),
            (this._header = null),
            (this._widget = null),
            (this._headerIcon = null),
            (this._headerspace = null),
            (this._title = null),
            (this._resizehandle = null),
            M.offWidget(this),
            this._preloadTimeout && clearTimeout(this._preloadTimeout)
        }
        rdState() {
          return this._rdState
        }
        onActiveStateChange(t) {
          var e
          const i = (this.getWidgetBarOption('widgetConfig') || v)[this.type]
          t && !i.doNotClearNotifications && this.clearNotifications(),
            this.updateVisibleWatchedValue(),
            null === (e = this.widgetActive) || void 0 === e || e.setValue(!!t)
        }
        toggleMaximize(t) {
          var e, i, s
          const n =
            'boolean' != typeof t
              ? !(null === (e = this.widgetMaximized) || void 0 === e
                  ? void 0
                  : e.value())
              : t
          n !==
            (null === (i = this.widgetMaximized) || void 0 === i
              ? void 0
              : i.value()) &&
            (null === (s = this.widgetMaximized) ||
              void 0 === s ||
              s.setValue(n),
            this.widgetBarPage &&
              this.widgetBarPage.widgetBarLayout &&
              this.widgetBarPage.widgetBarLayout.widgetBar &&
              this.widgetBarPage.widgetBarLayout.widgetBar.saveToTVSettings(),
            this.widgetBarPage && this.widgetBarPage.updateWidgetsHeight())
        }
        startWidget() {
          var t
          if (this.widgetObject || this.widgetStartDelayed) return
          if (!this.id) return
          const e = this.getWidgetBarOption('widgetConfig') || v
          if (!this.type) return
          const i = e[this.type]
          if (!i) return
          const s = i.ctor
          if (!s) return
          if (
            ((this.widgetVisible = this.widgetVisible || new h.WatchedValue()),
            this.updateVisibleWatchedValue(),
            i.lazyLoad && !this.widgetVisible.value())
          )
            return (
              (this.widgetStartDelayed = !0),
              this.widgetVisible.when(() => {
                delete this.widgetStartDelayed,
                  this.startWidget(),
                  clearTimeout(this._preloadTimeout)
              }),
              void (
                i.preloadDelay &&
                (this._preloadTimeout = setTimeout(() => {
                  s.preload && s.preload()
                }, i.preloadDelay))
              )
            )
          ;(this.symbolLinking = S.linking.proSymbol.spawn()),
            (this.intervalLinking = S.linking.interval.spawn())
          const a = this._rdState.bridge(),
            r = {
              ...{},
              header: (0, n.ensureNotNull)(this._header),
              headerspace: this._headerspace,
              widget: (0, n.ensureNotNull)(this._widget),
              container: a.container.value(),
              properties: this.properties,
              notify: this.notify.bind(this),
              clearNotifications: this.clearNotifications.bind(this),
              visible: this.widgetVisible.readonly(),
              active: (0, n.ensureNotNull)(this.widgetActive).readonly(),
              symbol: this.symbolLinking,
              interval: this.intervalLinking,
              height: a.height,
              setMinHeight: this.setMinHeight.bind(this),
              width: a.width,
              setTitle: this.setTitle.bind(this),
              setTitleHtml: this.setTitleHtml.bind(this),
              id: this.id,
              toggleMaximize: this.toggleMaximize.bind(this),
              maximized: (0, n.ensureNotNull)(this.widgetMaximized).readonly(),
              postMessage: M.postMessage.bind(this),
              onMessage: M.onMessage.bind(this),
              offMessage: M.offMessage.bind(this),
              hideDetach: !1,
              unAuthEditable: this.unAuthEditable,
            }
          if (i.chartWidgetAllowed) {
            const t = () =>
              this.widgetBarPage &&
              this.widgetBarPage.widgetBarLayout &&
              this.widgetBarPage.widgetBarLayout.widgetBar &&
              this.widgetBarPage.widgetBarLayout.widgetBar.chartWidgetCollection
            ;(r.getChartWidget = () => {
              const e = t()
              return e ? e.activeChartWidget.value() : null
            }),
              (r.getChartWidgetCollection = () => t() || null)
          }
          void 0 !== this.readonly
            ? this.readonly && (r.readonly = !0)
            : this.getWidgetBarOption('readonly') && (r.readonly = !0),
            void 0 !== i.options && (r.options = i.options),
            null != this.stateData
              ? (r.data = this.stateData)
              : null != i.data && (r.data = i.data)
          const o = (this.widgetObject = new s(r))
          'hasLifecycle' in o &&
            (null === (t = this.widgetActive) ||
              void 0 === t ||
              t.readonly().subscribe(
                (t) => {
                  t ? o.mount() : o.unmount()
                },
                { callWithLast: !i.lazyLoad },
              )),
            this._widgetStarted.fire(this)
        }
        widgetStarted() {
          return this._widgetStarted
        }
        notify(t, e = {}) {
          if (
            this.widgetBarPage &&
            (!this.widgetBarPage.isActiveAndVisible() || e.force)
          )
            return this.widgetBarPage.notify(t, e)
        }
        clearNotifications() {
          if (this.widgetBarPage) return this.widgetBarPage.clearNotifications()
        }
        onVisibilityChange() {
          this.updateVisibleWatchedValue()
        }
        updateVisibleWatchedValue() {
          this.widgetVisible &&
            this.widgetVisible.setValue(
              !!this.widgetBarPage && this.widgetBarPage.isActiveAndVisible(),
            )
        }
        setTitle(t) {
          ;(this.customTitle = String(t)),
            this._title && (this._title.textContent = this.getTitle())
        }
        setTitleHtml(t) {
          this._title && (0, H.html)(this._title, t)
        }
        setMinHeight(t) {
          const e = this.widgetBarPage
          e &&
            ((this.minHeight = 0),
            (this.minHeight = Math.min(t, e.getAvailableHeight())),
            e.updateWidgetsHeight())
        }
        getWidgetBarOption(t) {
          if (
            this.widgetBarPage &&
            this.widgetBarPage.widgetBarLayout &&
            this.widgetBarPage.widgetBarLayout.widgetBar &&
            t in this.widgetBarPage.widgetBarLayout.widgetBar
          )
            return this.widgetBarPage.widgetBarLayout.widgetBar[t]
        }
        getTitle(t) {
          const e = ((t, e) => {
            var i, s
            try {
              let n =
                null === (i = (e = e || v)[t]) || void 0 === i
                  ? void 0
                  : i.title
              return (
                !n &&
                  t &&
                  (n =
                    null ===
                      (s = String(t).match(
                        /[A-Z]{2,}|\d+(?:\.\d+)?|[A-Z]?[a-z]+/g,
                      )) || void 0 === s
                      ? void 0
                      : s.join(' ').replace(/^.|\s./g, (t) => t.toUpperCase())),
                n || void 0
              )
            } catch (t) {
              return
            }
          })(this.type, this.getWidgetBarOption('widgetConfig'))
          return t && this.customTitle && e
            ? this.customTitle.substring(0, e.length) === e
              ? this.customTitle
              : e + ': ' + this.customTitle
            : this.customTitle || e || a.t(null, void 0, i(819065))
        }
        createHTML() {
          const t =
              !!this.widgetConfig &&
              !!this.widgetConfig.icon &&
              this.widgetConfig.icon,
            e = this.widgetConfig && this.widgetConfig.emptyHeader,
            i = this.widgetConfig && this.widgetConfig.noHeader,
            s = this.widgetConfig && this.widgetConfig.noHeaderSpace,
            n = (this.widgetConfig && this.widgetConfig.widgetClass) || '',
            a = (this.widgetConfig && this.widgetConfig.headerClass) || '',
            r = (this.widgetConfig && this.widgetConfig.titleClass) || '',
            o = (this._widget = document.createElement('div'))
          o.classList.value = f()(
            n,
            'widgetbar-widget',
            'widgetbar-widget-' + this.type,
          )
          const l = (this._header = document.createElement('div'))
          if (
            ((l.classList.value = a || 'widgetbar-widgetheader'),
            l.addEventListener('contextmenu', (t) => {
              'input' !== t.target.tagName.toLowerCase() && t.preventDefault()
            }),
            i || o.appendChild(l),
            t)
          ) {
            const e = (this._headerIcon = document.createElement('div'))
            ;(e.classList.value =
              'widgetbar-widgetheader-icon widgetbar-widgetheader-icon-' + t),
              e.appendChild((0, L.parseHtml)(w[t])),
              l.appendChild(e)
          }
          if (!s) {
            const t = (this._headerspace = document.createElement('div'))
            ;(t.classList.value = 'widgetbar-headerspace'),
              t.addEventListener('click', (t) => t.preventDefault()),
              l.appendChild(t)
          }
          if (!e) {
            const t = (this._title = document.createElement('div'))
            ;(t.classList.value = f()('widgetbar-widgettitle', r)),
              (t.dataset.name = this.type + '_header'),
              (t.textContent = this.getTitle()),
              l.prepend(t)
          }
          const h = document.createElement('div')
          ;(h.classList.value = 'widgetbar-widgetbody'),
            h.addEventListener('contextmenu', (t) => {
              t.target === h && t.preventDefault()
            }),
            o.appendChild(h),
            this._internalState.container.setValue(h)
          const d = (this._resizehandle = document.createElement('div'))
          ;(d.classList.value = 'widgetbar-widgethandle'),
            d.addEventListener('contextmenu', (t) => {
              t.target === d && t.preventDefault()
            }),
            null !== this._resizer && this._resizer.destroy(),
            (this._resizer = new x.PointerBackend({
              handle: d,
              onDragStart: (t) => {
                var e
                null === (e = this.widgetBarPage) ||
                  void 0 === e ||
                  e.handleWidgetResizeStart(this, t)
              },
              onDragMove: (t) => {
                var e
                null === (e = this.widgetBarPage) ||
                  void 0 === e ||
                  e.handleWidgetResizeChange(this, t)
              },
              onDragStop: (t) => {
                var e
                null === (e = this.widgetBarPage) ||
                  void 0 === e ||
                  e.handleWidgetResizeStop(this, t)
              },
            })),
            o.appendChild(d),
            !0 === this.maximized &&
              (this.toggleMaximize(!0), delete this.maximized)
        }
        demarshal(t) {
          if ('string' == typeof t)
            try {
              t = JSON.parse(t)
            } catch (t) {}
          if (!t || 'object' != typeof t) return null
          let e
          if (
            ('id' in t
              ? ((this.id = String(t.id)),
                (this.type = this.id.replace(/\..*/, '')))
              : 'type' in t
                ? ((this.type = String(t.type)),
                  (this.id = this.type + '.' + (0, z.randomHash)()))
                : (delete this.type, delete this.id),
            null != t.readonly
              ? (this.readonly = !!t.readonly)
              : delete this.readonly,
            (this.stateData = t.data),
            isFinite(Number(t.heightRatio)) && Number(t.heightRatio) >= 0
              ? (this.heightRatio = Number(t.heightRatio))
              : (this.heightRatio = k.heightRatio),
            !0 === t.maximized && (this.maximized = !0),
            !0 === t.unAuthEditable && (this.unAuthEditable = !0),
            t.settingsKey)
          )
            e = String(t.settingsKey)
          else if (this.id) {
            const t = this.getWidgetBarOption('_settingsPrefix')
            t && (e = t + '.widget.' + this.id)
          }
          if (
            ((this.properties = new B({
              widgetBarWidget: this,
              settingsKey: e,
            })),
            null == t.properties ||
              (e && null !== this.properties.value()) ||
              this.properties.setValue(t.properties),
            ('news' !== this.type && 'hotlist' !== this.type) ||
              !e ||
              this.properties.setValue(
                (0, s.default)({}, t.properties, this.properties.value()),
              ),
            'hotlist' === this.type)
          )
            if (!e && t.properties) this.properties.setValue(t.properties)
            else {
              const t = this.properties.value()
              ;('exchangeByLocale' in t || 'groupByLocale' in t) &&
                (delete t.exchangeByLocale,
                delete t.groupByLocale,
                this.properties.setValue(t))
            }
          this.widgetConfig = null
          const i = this.getWidgetBarOption('widgetConfig')
          return (
            this.type &&
              i &&
              i[this.type] &&
              (this.widgetConfig = i[this.type]),
            this
          )
        }
        marshal() {
          var t
          const e = {}
          return (
            this.id && (e.id = this.id),
            this.type && (e.type = this.type),
            this.heightRatio !== k.heightRatio &&
              (e.heightRatio = this.heightRatio),
            (null === (t = this.widgetMaximized) || void 0 === t
              ? void 0
              : t.value()) && (e.maximized = !0),
            e
          )
        }
      }
      k.heightRatio = 1
      class P {
        constructor(t) {
          ;(this.widgets = []),
            (this.notificationCounter = 0),
            (this._page = null),
            (this._invalidated = !1),
            (this._resizeOperations = new WeakMap()),
            (this.widgets = []),
            t && t.widgetBarLayout && (this.widgetBarLayout = t.widgetBarLayout)
        }
        widget(t) {
          for (const e of this.widgets) if (e.type === t) return e
          return null
        }
        element() {
          return this._page
        }
        gaEvent() {
          return this._gaEvent
        }
        onActiveStateChange(t) {
          var e
          ;(t = !!t),
            null === (e = this._page) ||
              void 0 === e ||
              e.classList.toggle('active', !!t),
            (0, n.ensure)(this.tab).onActiveStateChange(t),
            t && this.updateWidgetsHeight({ skipIfHeightUnchanged: !0 }),
            this.widgets.forEach((e) => {
              e.onActiveStateChange(t)
            })
        }
        getAvailableHeight() {
          var t, e
          let i =
            (null ===
              (e =
                null === (t = this.widgetBarLayout) || void 0 === t
                  ? void 0
                  : t.widgetBar) || void 0 === e
              ? void 0
              : e.resizerBridge.height.value()) || 0
          if (!i) return 0
          let s = 0
          return (
            this.widgets.forEach((t, e) => {
              if (((i -= t.minHeight), e > 0)) {
                const e = (t.widgetConfig && t.widgetConfig.margin) || 1
                i -= e
              }
              const n = t.element('header')
              n && (s || (s = (0, H.outerHeight)(n, !0)), (i -= s))
            }),
            Math.max(i, 0)
          )
        }
        updateWidgetsHeight(t = {}) {
          if (!this._page) return
          if (!this.widgetBarLayout || !this.widgetBarLayout.widgetBar) return
          if (this.widgetBarLayout.getActivePage() !== this)
            return void (this._invalidated = !0)
          const e = this.widgetBarLayout.widgetBar.resizerBridge.height.value()
          if (
            ((this._pageHeight === e && t.skipIfHeightUnchanged) ||
              ((this._invalidated = !0), (this._pageHeight = e)),
            !this._invalidated)
          )
            return
          let i,
            s = e,
            a = 0,
            r = this.widgets,
            o = null
          const l = r.every((t) => 0 === t.heightRatio)
          for (let t = this.widgets.length; t--; )
            if ((0, n.ensureNotNull)(this.widgets[t].widgetMaximized).value()) {
              o = this.widgets[t]
              break
            }
          if (r.length > 0 && null === o && l) {
            const t = r[r.length - 1]
            ;(t.heightRatio = 1), (o = t)
          }
          if (o) {
            for (let t = this.widgets.length; t--; ) {
              const e = r[t]
              e !== o && e.setHeight(0)
            }
            r = [o]
          }
          for (let t = r.length - 1; t > 0; t--) {
            const e = r[t]
            s -= (e.widgetConfig && e.widgetConfig.margin) || 1
          }
          for (let t = r.length; t--; ) {
            const e = r[t],
              n = e.element('header')
            n &&
              (void 0 === i && (i = (0, H.outerHeight)(n, !0)),
              (s -= i),
              (a += e.heightRatio))
          }
          const h = s / a
          this._recalculateWidgetsHeightRatio(h)
          const d = r.length - 1
          for (let t = 0; t <= d; t++) {
            const e = r[t]
            let i
            ;(i = t === d ? s : Math.round(h * e.heightRatio)),
              (i = Math.max(i, e.minHeight)),
              e.setHeight(i),
              (s -= i)
          }
        }
        handleWidgetResizeStart(t, e) {
          let i, s
          for (let e = this.widgets.length - 1; e > 0; e--)
            this.widgets[e] === t &&
              ((i = this.widgets[e]), (s = this.widgets[e - 1]))
          ;(0, n.assert)(void 0 !== i), (0, n.assert)(void 0 !== s)
          const a = s.rdState().bridge().height.value(),
            r = s.heightRatio + i.heightRatio,
            o = a + i.rdState().bridge().height.value()
          0 === o && e.preventDefault(),
            this._resizeOperations.set(t, {
              bottomWidget: i,
              topWidget: s,
              summaryHeight: o,
              summaryRatio: r,
              startTopWidgetHeight: a,
              prevTopWidgetHeight: void 0,
            })
        }
        handleWidgetResizeChange(t, e) {
          var i
          const s = this._resizeOperations.get(t)
          if (void 0 === s) return
          null === (i = this._page) ||
            void 0 === i ||
            i.classList.add('widget-resize-mode')
          const { current: n, initial: a } = e.detail,
            r = n.pageY - a.pageY,
            o = Math.max(
              s.topWidget.minHeight,
              Math.min(
                s.startTopWidgetHeight + r,
                s.summaryHeight - s.bottomWidget.minHeight,
              ),
            )
          s.prevTopWidgetHeight !== o &&
            ((s.prevTopWidgetHeight = o),
            (s.topWidget.heightRatio = (o / s.summaryHeight) * s.summaryRatio),
            (s.bottomWidget.heightRatio =
              s.summaryRatio - s.topWidget.heightRatio),
            s.topWidget.setHeight(o),
            s.bottomWidget.setHeight(s.summaryHeight - o))
        }
        handleWidgetResizeStop(t, e) {
          var i
          const s = this._resizeOperations.get(t)
          void 0 !== s &&
            (this._resizeOperations.delete(t),
            null === (i = this._page) ||
              void 0 === i ||
              i.classList.remove('widget-resize-mode'),
            s.prevTopWidgetHeight !== s.startTopWidgetHeight &&
              (this.normalizeRatios(),
              this.widgetBarLayout &&
                this.widgetBarLayout.widgetBar &&
                this.widgetBarLayout.widgetBar.saveToTVSettings()))
        }
        normalizeRatios() {
          let t = 1 / 0
          for (let e = this.widgets.length; e--; ) {
            const i = this.widgets[e].heightRatio
            i <= 0 || !isFinite(i) || (i < t && (t = i))
          }
          if (!isFinite(t)) return
          let e = 1
          while (t < 1) (t *= 2), (e *= 2)
          while (t >= 2) (t /= 2), (e /= 2)
          for (let t = this.widgets.length; t--; )
            this.widgets[t].heightRatio *= e
        }
        attachWidget(t, e) {
          var i
          e = Number(e)
          const s = this.widgets.indexOf(t)
          ;-1 !== s
            ? this.widgets.splice(s, 1)
            : t.widgetBarPage &&
              t.widgetBarPage !== this &&
              t.widgetBarPage.removeWidget(t),
            e < this.widgets.length
              ? e < 0 && (e = 0)
              : (e = this.widgets.length),
            delete t.widgetBarPage,
            Object.defineProperty(t, 'widgetBarPage', {
              value: this,
              configurable: !0,
            }),
            this.widgets.splice(e, 0, t)
          const n = this.widgets[e + 1],
            a = t.element('widget')
          n
            ? a && a.insertAdjacentElement('beforebegin', n.element('widget'))
            : a &&
              (null === (i = this._page) || void 0 === i || i.appendChild(a)),
            this.updateWidgetsHeight(),
            t.updateVisibleWatchedValue()
        }
        removeWidget(t) {
          var e
          const i = this.widgets.indexOf(t)
          ;-1 !== i &&
            (delete t.widgetBarPage,
            this.widgets.splice(i, 1),
            null === (e = t.element('widget')) || void 0 === e || e.remove(),
            this.updateWidgetsHeight())
        }
        remove() {
          this.widgetBarLayout && this.widgetBarLayout.removePage(this)
        }
        destroy() {
          var t
          this.remove(), null === (t = this._page) || void 0 === t || t.remove()
        }
        onVisibilityChange(t) {
          const e =
            t &&
            this.widgetBarLayout &&
            this.widgetBarLayout.getActivePage() === this
          this.widgets.forEach((t) => {
            const i = t.getWidgetBarOption('widgetConfig')[t.type]
            e &&
              !i.doNotClearNotificationsOnVisibilityChange &&
              t.clearNotifications(),
              t.onVisibilityChange()
          })
        }
        notify(t, e = {}) {
          !0 !== e.clear
            ? e.stopHighlightTab ||
              ((this.notificationCounter =
                this.notificationCounter + (~~t || 1)),
              this.updateNotifications(e.notificationValue))
            : this.clearNotifications()
        }
        clearNotifications() {
          ;(this.notificationCounter = 0),
            (0, n.ensure)(this.tab).updateNotifications(
              this.notificationCounter,
            ),
            this._clearNotificationsCounterAriaLabel()
        }
        updateNotifications(t) {
          const e = 'number' == typeof t ? t : this.notificationCounter
          ;(0, n.ensure)(this.tab).updateNotifications(e),
            this._updateNotificationsCounterAriaLabel(e)
        }
        getWidgets(t) {
          const e = []
          for (let i = 0; i < this.widgets.length; ++i) {
            const s = this.widgets[i]
            s.type === t && e.push(s)
          }
          return e
        }
        isActiveAndVisible() {
          const t = this.widgetBarLayout
          return !(!t || !t.visible) && t.getActivePage() === this
        }
        createHTML() {
          const t = (this._page = document.createElement('div'))
          ;(t.classList.value = 'widgetbar-page'),
            this.widgets.forEach((e) => {
              e.createHTML()
              const i = e.element('widget')
              i && t.appendChild(i)
            })
        }
        createTabButtonViewModel() {
          this.tab = new c({
            icon: w[this.icon],
            hint: this.title,
            onClick: (t) => {
              this.widgetBarLayout && this.widgetBarLayout.onTabClick(t, this)
            },
            TabButtonComponent: this.TabButtonComponent,
          })
        }
        demarshal(t) {
          if ('string' == typeof t)
            try {
              t = JSON.parse(t)
            } catch (t) {}
          if ('object' != typeof t || !t.widgets || !Array.isArray(t.widgets))
            return null
          const e = this.widgets
          return (
            e.splice(0, e.length),
            (this._gaEvent = t._gaEvent),
            (this.title = t.title),
            (this.name = t.name),
            (this.icon = t.icon),
            (this.spaceBottom = t.spaceBottom),
            (this.spaceBottomText = t.spaceBottomText),
            (this.onBottom = t.onBottom),
            (this.TabButtonComponent = t.TabButtonComponent),
            (this._createNotificationCounterAriaLabel =
              t.createCounterAriaLabel),
            this.createTabButtonViewModel(),
            t.widgets.forEach((t) => {
              const i = new k({ widgetBarPage: this }).demarshal(t)
              i && e.push(i)
            }),
            0 === e.length ? null : this
          )
        }
        marshal() {
          const t = []
          return (
            this.widgets.forEach((e) => {
              const i = e.marshal()
              i && t.push(i)
            }),
            0 === t.length ? null : t
          )
        }
        _recalculateWidgetsHeightRatio(t) {
          const e = this.widgets
          e.length <= 1 ||
            e.forEach((i, s) => {
              if (t * i.heightRatio >= i.minHeight) return
              let n = i.minHeight / t - i.heightRatio
              for (let i = 0; i < e.length; i++) {
                if (i === s) continue
                const a = e[i],
                  r = a.heightRatio - a.minHeight / t
                if (
                  !(r <= 0) &&
                  ((a.heightRatio -= Math.min(n, r)),
                  (e[s].heightRatio += Math.min(n, r)),
                  (n -= r),
                  n <= 0)
                )
                  break
              }
            })
        }
        _updateNotificationsCounterAriaLabel(t) {
          this._createNotificationCounterAriaLabel &&
            ((this.notificationCounterAriaLabel =
              this._createNotificationCounterAriaLabel(t)),
            (0, n.ensure)(this.tab).updateNotificationCounterAriaLabel(
              this.notificationCounterAriaLabel,
            ))
        }
        _clearNotificationsCounterAriaLabel() {
          ;(this.notificationCounterAriaLabel = ''),
            (0, n.ensure)(this.tab).updateNotificationCounterAriaLabel(
              this.notificationCounterAriaLabel,
            )
        }
      }
      var I = i(156963),
        N = i(719036),
        A = i(972535),
        D = i(389986),
        V = i(124526)
      function R(t) {
        return o.createElement(D.CloseButton, {
          className: b(t.className, V.button),
          onClick: t.onClick,
          'aria-label': a.t(null, { context: 'action' }, i(768508)),
          size: 'medium',
          preservePaddings: !0,
          'data-role': 'button',
          'data-name': t.name,
        })
      }
      var O = i(19139),
        j = i(881182)
      function F(t) {
        return o.createElement('div', {
          className: b(t.className, j.separator),
        })
      }
      var U = i(107516)
      function Y(t) {
        return o.createElement('div', { className: b(U.filler, t.className) })
      }
      function q(t, e) {
        return class extends o.PureComponent {
          constructor(t) {
            super(t),
              (this._bindedForceUpdate = () => this.forceUpdate()),
              (this.state = { viewModel: e })
          }
          componentDidMount() {
            const { viewModel: t } = this.state
            t.notificationsCount.subscribe(this._bindedForceUpdate),
              t.notificationCounterAriaLabel.subscribe(this._bindedForceUpdate),
              t.isActive.subscribe(this._bindedForceUpdate)
          }
          componentWillUnmount() {
            const { viewModel: t } = this.state
            t.notificationsCount.unsubscribe(this._bindedForceUpdate),
              t.notificationCounterAriaLabel.unsubscribe(
                this._bindedForceUpdate,
              ),
              t.isActive.unsubscribe(this._bindedForceUpdate)
          }
          render() {
            const { viewModel: e } = this.state,
              i = e.notificationsCount.value(),
              s = e.notificationCounterAriaLabel.value()
            return o.createElement(t, {
              ...this.props,
              icon: e.icon.value(),
              isActive: e.isActive.value(),
              onClick: e.onClick.value(),
              hint: e.hint.value(),
              count: i,
              counterAriaLabel: s,
            })
          }
        }
      }
      var Z = i(72571),
        K = i(690784),
        G = i.n(K)
      function X(t) {
        const {
          className: e,
          count: i,
          compact: s = !0,
          size: n = 'xlarge',
          color: a = 'danger',
          'aria-label': r,
          sign: l,
          borderColor: h = 'none',
        } = t
        let d
        d =
          !('xxsmall' === n || 'xxxsmall' === n) && i
            ? s && i >= 100
              ? '99+'
              : l && i > 0
                ? `+${i}`
                : i
            : ''
        const c = f()(
          e,
          G().counter,
          G()[`size-${n}`],
          G()[`color-${a}`],
          'none' !== h && G()[`borderColor-${h}`],
        )
        return o.createElement('span', { className: c, 'aria-label': r }, d)
      }
      var J = i(892932),
        $ = i(865266),
        Q = i(359332)
      const tt = (0, o.forwardRef)((t, e) => {
        const {
            theme: i = Q,
            className: s,
            name: n,
            count: a,
            onClick: r,
            hint: l,
            icon: h,
            isActive: d,
            counterAriaLabel: c,
            NotificationComponent: u = et,
            ...g
          } = t,
          p = J.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
          [_, m] = (0, $.useRovingTabindexElement)(e),
          v = b(
            s,
            i.button,
            d && i.isActive,
            l && 'apply-common-tooltip common-tooltip-vertical',
          ),
          w = o.createElement(
            o.Fragment,
            null,
            o.createElement('div', { className: i.hoverMask }),
            o.createElement(Z.Icon, { icon: h }),
            a
              ? o.createElement(
                  'div',
                  { className: i.counterRow },
                  o.createElement(u, {
                    className: i.counter,
                    count: a,
                    ariaLabel: c,
                  }),
                )
              : null,
          )
        return 'button' === p
          ? o.createElement(
              'button',
              {
                ...g,
                'aria-label': l,
                ref: _,
                type: 'button',
                className: b(v, i.accessible),
                onClick: r,
                'data-name': n,
                'aria-pressed': d,
                'data-tooltip': l,
                tabIndex: m,
              },
              w,
            )
          : o.createElement(
              'div',
              {
                ...g,
                className: v,
                title: l,
                onClick: r,
                ref: _,
                'data-role': 'button',
                'data-name': n,
              },
              w,
            )
      })
      function et(t) {
        const { className: e, count: i, ariaLabel: s = '' } = t
        return o.createElement(X, {
          'aria-label': s,
          count: i,
          size: 'small',
          className: e,
          compact: !0,
        })
      }
      var it = i(199663),
        st = i(6835),
        nt = i(522224),
        at = i(261401),
        rt = i(622614),
        ot = i(115963)
      const lt = (0, st.getLogger)('Platform.GUI.RightToolbar'),
        ht = (0, at.registryContextType)()
      class dt extends o.PureComponent {
        constructor(t, e) {
          super(t, e),
            (this._pages = {}),
            (this._isOpeningTradingPanelAvailable = null),
            (this._tradingActivePage = null),
            (this._isTradingPanelOpened = null),
            (this._handleMouseOver = (t) => {
              ;(0, nt.hoverMouseEventFilter)(t) &&
                this.setState({ isHovered: !0 })
            }),
            (this._handleMouseOut = (t) => {
              ;(0, nt.hoverMouseEventFilter)(t) &&
                this.setState({ isHovered: !1 })
            }),
            (this._handleFullscreenChange = (t) => {
              this.setState({ isFullscreen: t })
            }),
            (this._handleCloseClick = () => {
              const { widgetBar: t } = this.context
              ;(0, n.ensureDefined)(t.layout).setMinimizedState(!0)
            }),
            (0, at.validateRegistry)(e, { widgetBar: N.any.isRequired })
          const { widgetBar: i } = this.context
          if (
            ((this._isMinimized = (0, n.ensureDefined)(
              i.layout,
            ).isMinimized.spawn()),
            (this._isFullscreen = i.resizerBridge.fullscreen.spawn()),
            i.tradingPanelAccessor)
          ) {
            const t = i.tradingPanelAccessor.tradingPanel
            ;(this._isOpeningTradingPanelAvailable =
              t.isOpeningAvailable.spawn()),
              (this._tradingActivePage = t.activePage.spawn()),
              (this._isTradingPanelOpened = t.isOpened.spawn())
          }
          ;(this.state = {
            isHovered: !1,
            isFullscreen: this._isFullscreen.value(),
          }),
            (0, n.ensureDefined)(i.layout).pages.forEach((t) => {
              var e
              void 0 === t.name &&
                lt.logWarn('Page does not provide required field "name"')
              const i = t.tab
              this._pages[t.name] = q(
                null !== (e = i.TabButtonComponent) && void 0 !== e ? e : tt,
                i,
              )
            }),
            (this._toolset = this._createToolset())
        }
        componentDidMount() {
          this._isFullscreen.subscribe(this._handleFullscreenChange)
        }
        componentWillUnmount() {
          this._isFullscreen.destroy(),
            this._isMinimized.destroy(),
            null !== this._isOpeningTradingPanelAvailable &&
              this._isOpeningTradingPanelAvailable.destroy(),
            null !== this._tradingActivePage &&
              this._tradingActivePage.destroy(),
            null !== this._isTradingPanelOpened &&
              this._isTradingPanelOpened.destroy()
        }
        render() {
          const { className: t } = this.props,
            { isHovered: e, isFullscreen: i } = this.state,
            { widgetBar: s } = this.context,
            n = this._toolset
          return o.createElement(
            O.VerticalScroll,
            {
              isVisibleFade: A.mobiletouch,
              isVisibleButtons: !A.mobiletouch && e,
              isVisibleScrollbar: !1,
              onMouseOver: this._handleMouseOver,
              onMouseOut: this._handleMouseOut,
            },
            o.createElement(
              rt.Toolbar,
              {
                className: b(t, ot.toolbar),
                onContextMenu: it.preventDefaultForContextMenu,
                orientation: 'vertical',
                'data-name': 'right-toolbar',
              },
              s.adaptive &&
                i &&
                o.createElement(R, {
                  name: 'close-button',
                  onClick: this._handleCloseClick,
                }),
              this._renderPages(),
              o.createElement(Y, null),
              this._renderPages(!0),
              n.SupportTicketButton &&
                o.createElement(n.SupportTicketButton, {
                  name: 'bug-report-button',
                }),
              n.HelpButton &&
                o.createElement(n.HelpButton, { name: 'help-button' }),
            ),
          )
        }
        _renderPages(t) {
          const e = [],
            { widgetBar: i } = this.context,
            { pages: s } = (0, n.ensureDefined)(i.layout)
          return (
            s.forEach((i) => {
              const s = i.name
              if (s in this._pages && Boolean(i.onBottom) === Boolean(t)) {
                const t = this._pages[s]
                e.push(o.createElement(t, { name: s, key: s })),
                  i.spaceBottom &&
                    e.push(o.createElement(F, { key: i.spaceBottomText }))
              }
            }),
            e
          )
        }
        _createToolset() {
          const { widgetBar: t } = this.context
          return {
            SupportTicketButton: this.props.isSupportTicketButtonAvailable
              ? q(tt, t.ensureSupportTicketButtonViewModel())
              : void 0,
            HelpButton: this.props.isHelpButtonAvailable
              ? q(tt, t.ensureHelpButtonViewModel())
              : void 0,
          }
        }
      }
      dt.contextType = ht
      const ct = { widgetBar: N.any }
      class ut extends o.PureComponent {
        constructor(t) {
          super(t), (this._registry = { widgetBar: this.props.widgetBar })
        }
        render() {
          return o.createElement(
            at.RegistryProvider,
            { validation: ct, value: this._registry },
            this.props.children,
          )
        }
      }
      const gt = I.enabled('hide_right_toolbar_tabs')
      class pt {
        constructor(t, e, i) {
          ;(this._widgetBar = t),
            (this._container = e),
            (this._options = i),
            gt || this._render()
        }
        updateOptions(t) {
          ;(this._options = t), gt || this._render()
        }
        destroy() {
          l.unmountComponentAtNode(this._container)
        }
        _render() {
          l.render(
            o.createElement(
              ut,
              { widgetBar: this._widgetBar },
              o.createElement(dt, {
                isHelpButtonAvailable: this._options.isHelpButtonAvailable,
                isSupportTicketButtonAvailable:
                  this._options.isSupportTicketButtonAvailable,
              }),
            ),
            this._container,
          )
        }
      }
      var _t = i(960732)
      const mt = a.t(null, void 0, i(943435)),
        vt = a.t(null, void 0, i(538163))
      function wt(t) {
        const e = b(
          t.className,
          'apply-common-tooltip',
          'common-tooltip-vertical',
          'common-tooltip-otl',
        )
        return o.createElement(
          'div',
          { className: e, onClick: t.onClick, title: t.isMinimized ? vt : mt },
          o.createElement(_t.VerticalToolbarHider, {
            direction: t.isMinimized ? 'left' : 'right',
          }),
        )
      }
      class bt {
        constructor(t = {}) {
          ;(this.MIN_WIDTH = 200),
            (this.MINIMIZE_THRESHOLD = 50),
            (this.activeIndex = bt.activeIndex),
            (this.activeName = bt.activeName),
            (this.minimized = bt.minimized),
            (this.visible = bt.visible),
            (this.width = bt.width),
            (this.version = bt.version),
            (this.pages = []),
            (this.isMinimized = new h.WatchedValue()),
            (this.activePageIndex = new h.WatchedValue(this.activeIndex)),
            (this.tabRenderer = null),
            (this._tabs = null),
            (this._pages = null),
            (this._pagescontent = null),
            (this._handle = null),
            (this._deviceButton = null),
            (this._hider = null),
            (this._draggable = null),
            (this._rightToolbarOptions = {
              isSupportTicketButtonAvailable: I.enabled('bugreport_button'),
              isHelpButtonAvailable:
                !I.enabled('widget') && !I.enabled('charting_library_base'),
            }),
            (this._shouldHideWidgetBar = I.enabled('hide_right_toolbar')),
            (this._shouldHideWidgetBarTabs = I.enabled(
              'hide_right_toolbar_tabs',
            )),
            (this.widgetBar = t.widgetBar),
            (this._rightToolbar = Boolean(t.rightToolbar))
        }
        element(t) {
          switch (t) {
            case 'tabs':
              return this._tabs
            case 'pages':
              return this._pages
            case 'pages-content':
              return this._pagescontent
            case 'handle':
              return this._handle
            case 'device-button':
              return this._deviceButton
            case 'hider':
              return this._hider
            default:
              return null
          }
        }
        widget(t) {
          for (const e of this.pages) {
            const i = e.widget(t)
            if (i) return i
          }
          return null
        }
        startWidgets() {
          this.pages.forEach((t) => {
            t.widgets.forEach((t) => {
              t.widgetObject ||
                t.widgetStartDelayed ||
                setTimeout(() => {
                  t.startWidget()
                }, 0)
            })
          })
          const t = this.getActivePage()
          t && t.onActiveStateChange(!0)
        }
        syncHeight() {
          const t = (0, n.ensureDefined)(
            this.widgetBar,
          ).resizerBridge.height.value()
          if (
            (null !== this._pages && (this._pages.style.height = t + 'px'),
            !this.minimized)
          ) {
            const t = this.getActivePage()
            t && t.updateWidgetsHeight()
          }
        }
        tabsWidth() {
          return this._shouldHideWidgetBarTabs
            ? 0
            : this._rightToolbar
              ? 45
              : this.minimized
                ? 5
                : 0
        }
        borderWidth() {
          return 1 * (this.minimized ? 0 : 1)
        }
        canOpen() {
          if (this._shouldHideWidgetBar) return !1
          const t = (0, n.ensureDefined)(this.widgetBar)
          return (
            t.affectsLayout() &&
            this.MIN_WIDTH + this.tabsWidth() + this.borderWidth() <=
              t.resizerBridge.availWidth.value()
          )
        }
        requestWidth(t) {
          const e = (0, n.ensureDefined)(this.widgetBar).resizerBridge
          let i = this.tabsWidth()
          i > 0 && (i += this.borderWidth())
          const s = t + i
          this.canOpen()
            ? e.width.value() !== s &&
              e.negotiateWidth([
                { min: i, max: i },
                { min: this.MIN_WIDTH + i, max: s },
              ])
            : e.negotiateWidth(0)
        }
        requestOptimalWidth() {
          this.minimized ? this.requestWidth(0) : this.requestWidth(this.width)
        }
        updateResponsiveness() {
          var t, e
          const i = !this.canOpen()
          null === (t = this._tabs) ||
            void 0 === t ||
            t.classList.toggle('js-hidden', i),
            null === (e = this._pages) ||
              void 0 === e ||
              e.classList.toggle('js-hidden', i)
        }
        changeWidgetBarVisibility(t) {
          ;(this._shouldHideWidgetBar = !t), this.updateResponsiveness()
        }
        syncWidth() {
          const t = (0, n.ensureDefined)(this.widgetBar).resizerBridge,
            e = this.tabsWidth(),
            i = this.borderWidth(),
            s = t.width.value(),
            a = Math.max(s - e - i, 0) || 0
          a < this.MINIMIZE_THRESHOLD
            ? this.setMinimizedState(!0)
            : this.setMinimizedState(!1)
          const r = this._pages
          if (
            (r &&
              ((r.style.width = a + 'px'),
              r.classList.toggle('hidden', !!this.minimized)),
            !this.minimized)
          ) {
            const t = this.getActivePage()
            t &&
              t.widgets.forEach((t) => {
                t.onWidthChange(a)
              }),
              this.widgetBar && this.widgetBar.loadWidgets()
          }
          const o = !this.canOpen()
          this._deviceButton &&
            this._deviceButton.classList.toggle(
              'js-hidden',
              !o || !this.minimized,
            )
        }
        setMinimizedState(t) {
          const e = Boolean(t)
          !!this.minimized !== e &&
            ((this.minimized = e),
            this.isMinimized.setValue(this.minimized),
            e &&
              (0, n.ensureDefined)(
                this.widgetBar,
              ).resizerBridge.exitFullscreen(),
            this.requestOptimalWidth(),
            this.activeIndex >= 0 &&
              this.pages[this.activeIndex].onActiveStateChange(!this.minimized))
        }
        switchPage(t) {
          if (-1 === t || 0 === this.pages.length)
            return (
              (this.activeIndex = -1),
              void this.activePageIndex.setValue(this.activeIndex)
            )
          let e
          if (t instanceof P) {
            if (((e = this.pages.indexOf(t)), -1 === e)) return
          } else e = +t
          const i = this.pages[this.activeIndex]
          ;(this.activeIndex = Math.min(this.pages.length - 1, Math.max(0, e))),
            this.activePageIndex.setValue(this.activeIndex)
          const s = this.pages[this.activeIndex]
          ;(this.activeName = s.name || ''),
            this.minimized ||
              (i && i === s) ||
              (i && i.onActiveStateChange(!1),
              s && (s.onActiveStateChange(!0), this.syncWidth()))
        }
        getActivePage() {
          return this.minimized ? null : this.pages[this.activeIndex] || null
        }
        getWidgetByType(t) {
          var e
          const i =
            null === (e = this.getActivePage()) || void 0 === e
              ? void 0
              : e.widgets
          if (i) return i.find((e) => e.type === t)
        }
        onTabClick(t, e) {
          if (t.isDefaultPrevented()) return
          const i = this.pages.indexOf(e)
          if (-1 !== i) {
            if (
              (t.preventDefault(),
              this._trackClick(e.name),
              i !== this.activeIndex || this.minimized)
            ) {
              const t = e.gaEvent()
              t && (0, W.trackEvent)('Platform Widgets', t),
                this.switchPage(i),
                this.minimized && this.setMinimizedState(!1)
            } else this.setMinimizedState(!0)
            this.widgetBar && this.widgetBar.saveToTVSettings()
          }
        }
        removePage(t) {
          const e = this.pages.indexOf(t)
          if (-1 === e) return
          delete t.widgetBarLayout, this.pages.splice(e, 1)
          const i = t.element()
          null == i || i.remove(),
            this.activeIndex === e && this.switchPage(e - 1)
        }
        createPage() {
          var t
          const e = new P({ widgetBarLayout: this })
          this.pages.push(e), e.createHTML()
          const i = (0, n.ensureNotNull)(e.element())
          return (
            null === (t = this._pagescontent) || void 0 === t || t.append(i), e
          )
        }
        createWidget(t, e) {
          if (e) {
            if (-1 === this.pages.indexOf(e)) return null
          } else e = this.createPage()
          const i = new k({ widgetBarPage: e })
          return i.demarshal({ type: t }), i.createHTML(), e.attachWidget(i), i
        }
        onVisibilityChange() {
          const t = !(
            !this.widgetBar || !this.widgetBar.resizerBridge.visible.value()
          )
          ;(this.visible = t),
            this.pages.forEach((e) => {
              e.onVisibilityChange(t)
            })
        }
        destroy() {
          var t, e, i, s, n, a
          this.widgetBar &&
            this.widgetBar.layout === this &&
            delete this.widgetBar.layout,
            this.tabRenderer &&
              (this.tabRenderer.destroy(), (this.tabRenderer = null)),
            this._hider && l.unmountComponentAtNode(this._hider)
          for (let t = this.pages.length; t--; ) {
            const e = this.pages[t]
            for (let t = e.widgets.length; t--; ) e.widgets[t].destroy()
          }
          null === (t = this._tabs) || void 0 === t || t.remove(),
            null === (e = this._pages) || void 0 === e || e.remove(),
            null === (i = this._pagescontent) || void 0 === i || i.remove(),
            null === (s = this._handle) || void 0 === s || s.remove(),
            null === (n = this._deviceButton) || void 0 === n || n.remove(),
            null === (a = this._hider) || void 0 === a || a.remove()
        }
        updateRightToolbar() {
          var t
          null === (t = this.tabRenderer) ||
            void 0 === t ||
            t.updateOptions(this._rightToolbarOptions)
        }
        createHTML() {
          const t = (0, n.ensureDefined)(this.widgetBar)
          if (this._rightToolbar) {
            const e = (this._tabs = document.createElement('div'))
            this._shouldHideWidgetBarTabs ||
              (e.classList.value = 'widgetbar-tabs'),
              this.tabRenderer &&
                (this.tabRenderer.destroy(), (this.tabRenderer = null)),
              this._shouldHideWidgetBarTabs ||
                (this.tabRenderer = new pt(t, e, this._rightToolbarOptions))
          }
          const e = (this._pages = document.createElement('div'))
          this._shouldHideWidgetBarTabs
            ? ((e.classList.value = 'widgetbar-pages-no-tabs'),
              e.setAttribute('data-name', 'widgetbar-pages-no-tabs'))
            : ((e.classList.value = 'widgetbar-pages'),
              e.setAttribute('data-name', 'widgetbar-pages-with-tabs'))
          const i = (this._pagescontent = document.createElement('div'))
          ;(i.classList.value = 'widgetbar-pagescontent'),
            e.appendChild(i),
            this._rightToolbar || (this._pages.style.right = '-1px')
          const s = (this._handle = document.createElement('div'))
          if (
            ((s.classList.value = 'widgetbar-handle'),
            e.appendChild(s),
            s.addEventListener('contextmenu', (t) => {
              t.target === s && t.preventDefault()
            }),
            this._createDraggable(s),
            t.showCloseButton)
          ) {
            const t = (this._hider = document.createElement('div'))
            t.classList.value = 'widgetbar-hider'
            const e = () => {
              t.classList.toggle(
                'widgetbar-hider--closed',
                this.isMinimized.value(),
              ),
                t.classList.toggle(
                  'js-hidden',
                  this._rightToolbar && this.isMinimized.value(),
                ),
                l.render(
                  o.createElement(wt, {
                    isMinimized: this.isMinimized.value(),
                    onClick: () => {
                      this.setMinimizedState(!this.minimized)
                    },
                  }),
                  t,
                )
            }
            this.isMinimized.subscribe(e), e()
          }
          this.pages.forEach((t) => {
            t.createHTML()
            const e = t.element()
            e && i.appendChild(e)
          })
        }
        demarshal(t) {
          if ('string' == typeof t)
            try {
              t = JSON.parse(t)
            } catch (t) {}
          if ('object' != typeof t) return null
          ;(this.width = Number(t.width)),
            !isFinite(this.width) || this.width <= 0
              ? (this.width = bt.width)
              : this.width < this.MIN_WIDTH && (this.width = this.MIN_WIDTH),
            'minimized' in t
              ? ((this.minimized = Boolean(t.minimized)),
                this.isMinimized.setValue(this.minimized))
              : ((this.minimized = bt.minimized),
                this.isMinimized.setValue(this.minimized)),
            'version' in t && (this.version = t.version)
          let e = Number(t.activeIndex)
          const i = t.activeName
          let s = !1
          const n = this.pages
          return (
            n.splice(0, this.pages.length),
            Array.isArray(t.pages) &&
              t.pages.forEach((t, a) => {
                const r = new P({ widgetBarLayout: this }).demarshal(t)
                i
                  ? t.name === i && r && ((e = a), (s = !0))
                  : r || a !== e || e--,
                  r && n.push(r)
              }),
            i && !s && (e = 0),
            0 === n.length
              ? ((this.activeIndex = -1),
                this.activePageIndex.setValue(this.activeIndex))
              : e >= 0 &&
                e < n.length &&
                ((this.activeIndex = e),
                this.activePageIndex.setValue(this.activeIndex)),
            this
          )
        }
        marshal() {
          let t = []
          this.pages.forEach((e) => {
            const i = e.marshal()
            i && (t = t.concat(i))
          })
          const e = {}
          for (let i = 0; i < t.length; i++) {
            const s = t[i].type
            s &&
              (t[i].id && delete t[i].type,
              e[s] ? e[s].push(t[i]) : (e[s] = [t[i]]))
          }
          const i = { widgets: e, settings: {} }
          return (
            this.minimized !== bt.minimized &&
              (i.settings.minimized = this.minimized),
            this.width !== bt.width && (i.settings.width = this.width),
            this.activeIndex !== bt.activeIndex &&
              (i.settings.activeIndex = this.activeIndex),
            this.activeName !== bt.activeName &&
              (i.settings.activeName = this.activeName),
            this.version !== bt.version && (i.settings.version = this.version),
            i
          )
        }
        _createDraggable(t) {
          null !== this._draggable && this._draggable.destroy()
          const e = { initialWidth: 0 }
          this._draggable = new x.PointerBackend({
            handle: t,
            onDragStart: (t) => {
              this.widgetBar
                ? (e.initialWidth = Math.max(
                    this.widgetBar.resizerBridge.width.value() -
                      this.tabsWidth() -
                      this.borderWidth(),
                    0,
                  ))
                : t.preventDefault()
            },
            onDragMove: (t) => {
              const { current: i, initial: s } = t.detail,
                n = i.pageX - s.pageX
              let a = e.initialWidth - n
              a < this.MINIMIZE_THRESHOLD
                ? this.setMinimizedState(!0)
                : (a < this.MIN_WIDTH && (a = this.MIN_WIDTH),
                  (this.width = a),
                  this.minimized
                    ? this.setMinimizedState(!1)
                    : this.requestWidth(a))
            },
            onDragStop: (t) => {
              this.widgetBar && this.widgetBar.saveToTVSettings()
            },
          })
        }
        _trackClick(t) {
          0
        }
      }
      ;(bt.width = 290),
        (bt.minimized = !I.enabled('show_right_widgets_panel_by_default')),
        (bt.activeIndex = 0),
        (bt.activeName = ''),
        (bt.visible = !0),
        (bt.version = void 0)
      var ft = i(247465),
        yt = i(382280),
        Ct = i(235354),
        St = i(148442),
        Lt = i(731503),
        Wt = i(178911)
      const Tt = I.enabled('right_toolbar'),
        Bt = I.enabled('keep_object_tree_widget_in_right_toolbar'),
        Et = I.enabled('show_object_tree')
      class Ht {
        constructor(t) {
          ;(this._wrap = null),
            (this._tradingServiceCancelable = null),
            (this.options = t),
            (this._load = () => {})
          const e = new Promise((t) => {
              this._load = t
            }),
            i = this.options.configuration
          this._configuration = Promise.race([(0, St.delay)(null, 5e3), e])
            .then(() => i())
            .then((t) => {
              const e = this.widgetConfig
              return (
                (e.reuters_calendar.ctor = t.ReutersCalendarWidget),
                (e.earnings_calendar.ctor = t.CalendarWidget),
                (e.watchlist.ctor = t.Watchlist),
                (e.hotlist.ctor = t.HotlistWidget),
                (e.detail.ctor = t.Detail && t.Detail.Widget),
                (e.news.ctor = t.NewsWidget),
                (e.notifications_following.ctor = t.IdeasFeedWidget),
                (e.unionchats.ctor = t.UnionChatsWidget),
                (e.notes.ctor = t.NotesWidget),
                (e.alerts_manage.ctor = t.AlertsManageWidget),
                (e.alerts_log.ctor = t.AlertsLogWidget),
                (e.streams.ctor = t.StreamsWidget),
                (e.datawindow.ctor = t.DataWindowWidget),
                ((0, n.ensure)(e.object_tree).ctor = t.ObjectTreeWidget),
                t
              )
            })
          const a = (this.resizerBridge = t.resizerBridge)
          ;(this.adaptive = Boolean(t.adaptive)),
            (this.tradingPanelAccessor = t.tradingPanelAccessor || null),
            (this._visible = (0, r.combine)(
              (t, e, i) => Boolean(t && e && i),
              a.width.weakReference(),
              a.height.weakReference(),
              a.visible.weakReference(),
            )),
            (this.widgetConfig = (0, s.default)({}, v)),
            t.widgetConfig &&
              (this.widgetConfig = (0, s.default)(
                this.widgetConfig,
                t.widgetConfig,
              )),
            (this.layout = new bt({ widgetBar: this, rightToolbar: Tt })),
            (this._customization = t.customization || {}),
            t.chartWidgetCollection &&
              (this.chartWidgetCollection = t.chartWidgetCollection),
            t.state
              ? this.layout.demarshal(t.state)
              : t.settingsPrefix &&
                ((this._settingsPrefix = String(t.settingsPrefix)),
                this.loadFromTVSettings()),
            t.readonly && (this.readonly = !0),
            t.fixedMode && (this.fixedMode = !0),
            t.showCloseButton && (this.showCloseButton = !0),
            (this._container = this.resizerBridge.container.value()),
            this.createHTML(),
            this.initLayout(),
            window.loginStateChange.subscribe(this, this.onLoginStateChange),
            this.resizerBridge.width.subscribe(() => {
              var t
              null === (t = this.layout) || void 0 === t || t.syncWidth()
            }),
            this.resizerBridge.height.subscribe(() => {
              var t
              null === (t = this.layout) || void 0 === t || t.syncHeight()
            }),
            this.resizerBridge.visible.subscribe(() => {
              var t, e
              null === (t = this.layout) ||
                void 0 === t ||
                t.onVisibilityChange(),
                null === (e = this.layout) ||
                  void 0 === e ||
                  e.requestOptimalWidth()
            }),
            this.resizerBridge.availWidth.subscribe(() => {
              var t, e
              null === (t = this.layout) ||
                void 0 === t ||
                t.requestOptimalWidth(),
                null === (e = this.layout) ||
                  void 0 === e ||
                  e.updateResponsiveness()
            }),
            (this._tradingServiceCancelable = (0, ft.makeCancelable)(
              (0, yt.waitTradingService)(),
            )),
            this._tradingServiceCancelable.promise.then((t) => {
              ;(this._tradingServiceCancelable = null),
                t.onConnectionStatusChange.subscribe(
                  this,
                  this._onBrokerConnectionStatusChanged,
                )
            })
        }
        destroy() {
          var t
          if (null !== this._tradingServiceCancelable)
            this._tradingServiceCancelable.cancel(),
              (this._tradingServiceCancelable = null)
          else {
            ;(0, n.ensureNotNull)(
              (0, yt.tradingService)(),
            ).onConnectionStatusChange.unsubscribe(
              this,
              this._onBrokerConnectionStatusChanged,
            )
          }
          null === (t = this.layout) || void 0 === t || t.destroy()
        }
        widget(t) {
          return this.layout ? this.layout.widget(t) : null
        }
        isVisible() {
          const t = this.resizerBridge
          return Boolean(
            t.visible.value() && t.height.value() && t.width.value(),
          )
        }
        affectsLayout() {
          return this.options.affectsLayout()
        }
        visible() {
          return this._visible
        }
        initLayout() {
          var t
          this.options.instantLoad && this._load(),
            this.layout &&
              (this._configuration.then(() => {
                var t
                null === (t = this.layout) || void 0 === t || t.startWidgets()
              }),
              0 === this.layout.pages.length &&
                (this.layout.setMinimizedState(!0),
                null === (t = this.layout.element('handle')) ||
                  void 0 === t ||
                  t.classList.add('js-hidden')),
              this.layout.requestOptimalWidth(),
              this.layout.syncWidth(),
              this.layout.syncHeight(),
              this.layout.onVisibilityChange(),
              this.layout.updateResponsiveness())
        }
        loadWidgets() {
          this._widgetsLoadRequested ||
            ((this._widgetsLoadRequested = !0), this._load())
        }
        onLoginStateChange(t) {
          t ||
            (window.is_authenticated &&
              (this.dropWidgetData(), this.refreshFromTVSettings()))
        }
        dropWidgetData() {
          for (const t in this.widgetConfig)
            delete (0, n.ensure)(this.widgetConfig[t]).data
        }
        refreshFromTVSettings() {
          var t, e, i
          if (!this._settingsPrefix) return
          this.layout && this.layout.destroy(),
            (this.layout = new bt({ widgetBar: this, rightToolbar: Tt })),
            this.loadFromTVSettings(),
            this.layout.createHTML()
          const s = this.layout.element('pages')
          s && (null === (t = this._wrap) || void 0 === t || t.appendChild(s))
          const n = this.layout.element('tabs')
          n && (null === (e = this._wrap) || void 0 === e || e.appendChild(n))
          const a = this.layout.element('hider')
          a && (null === (i = this._wrap) || void 0 === i || i.appendChild(a)),
            this.initLayout()
        }
        getWidgets(t) {
          let e = []
          if (!this.layout) return e
          for (let i = 0; i < this.layout.pages.length; ++i)
            e = e.concat(this.layout.pages[i].getWidgets(t))
          return e
        }
        loadFromTVSettings() {
          if (!this._settingsPrefix) return
          if (!this.layout) return
          let t = this.getLayoutState()
          ;(t = this.mergeProperties(t)),
            this.layout.demarshal(t),
            this.saveToTVSettings()
          const e = this._getSerializedStateFromSetting()
          if (e) {
            let t = []
            for (const i in e.widgets) {
              const s = e.widgets[i]
              t = t.concat(s.map((t) => t.id))
            }
            const i = T.keysMask(this._settingsPrefix + '.widget.*.*')
            i &&
              i.forEach((e) => {
                const i = e.replace(this._settingsPrefix + '.widget.', '')
                ;-1 === t.indexOf(i) &&
                  0 === e.indexOf(this._settingsPrefix + '.widget.') &&
                  ((0, W.trackEvent)(
                    'Settings debug',
                    'loadFromTVSettings: ' + e,
                    window.user.username,
                  ),
                  T.remove(e))
              })
          }
        }
        mergeProperties(t) {
          const e = this._getSerializedStateFromSetting()
          if (!e) return t
          e.settings && Object.assign(t, e.settings)
          const i = {}
          for (let s = 0; s < t.pages.length; s++)
            for (let n = 0; n < t.pages[s].widgets.length; n++) {
              const a = t.pages[s].widgets[n],
                r = i[a.type] || 0
              e.widgets[a.type] &&
                e.widgets[a.type][r] &&
                Object.assign(a, e.widgets[a.type][r]),
                (i[a.type] = r + 1)
            }
          return t
        }
        saveToTVSettings() {
          if (!this._settingsPrefix) return
          if (!this.layout) return
          const t = this.layout.marshal()
          this._setSerializedStateToSettings(t)
        }
        getWidgetProperties(t, e = 0) {
          const i =
            (0, n.ensure)(this._settingsPrefix).replace(/\W/g, '\\$&') +
            '.widget.'
          let s = T.keysMask(i + t + '.*')
          return s && s.length && ((s = s.sort()), s[e])
            ? { id: s[e].replace(i, '') }
            : null
        }
        getGenericLayoutState(t) {
          const e = (0, Ct.getDefaultState)(),
            s = [
              {
                _gaEvent: 'General Widget',
                title: a.t(null, void 0, i(855102)),
                name: 'base',
                icon: 'base',
                widgets: [
                  {
                    type: 'watchlist',
                    properties: t && t.length ? { list: t } : void 0,
                  },
                  { type: 'detail' },
                  { type: 'news', isEnabled: !0 },
                ],
              },
              I.enabled('alerts')
                ? {
                    _gaEvent: 'Alerts',
                    title: a.t(null, void 0, i(363764)),
                    name: 'alerts',
                    icon: 'alarm-clock',
                    widgets: [
                      { type: 'alerts_manage', properties: {} },
                      { type: 'alerts_log', properties: {} },
                    ],
                    createCounterAriaLabel: void 0,
                  }
                : null,
              {
                _gaEvent: 'Data Window',
                title: a.t(null, void 0, i(409068)),
                name: 'data-window',
                icon: 'datawindow',
                TabButtonComponent: void 0,
                widgets: [{ type: 'datawindow' }],
              },
              null,
              {
                _gaEvent: 'Hotlists',
                title: a.t(null, void 0, i(225669)),
                name: 'hotlist',
                icon: 'hotlists',
                widgets: [
                  { type: 'hotlist', properties: { group: 'volume_gainers' } },
                  {
                    type: 'hotlist',
                    properties: { group: 'percent_change_gainers' },
                  },
                  {
                    type: 'hotlist',
                    properties: { group: 'percent_change_loosers' },
                  },
                ],
              },
              {
                _gaEvent: 'Calendar',
                title: a.t(null, void 0, i(825034)),
                name: 'calendar',
                icon: 'calendar',
                widgets: [
                  { type: 'reuters_calendar', properties: {} },
                  { type: 'earnings_calendar', properties: {} },
                ],
              },
              {
                _gaEvent: 'My Ideas',
                title: a.t(null, void 0, i(137706)),
                name: 'notes',
                icon: 'notes',
                spaceBottom: !0,
                spaceBottomText: a.t(null, void 0, i(912997)),
                widgets: [{ type: 'notes' }],
              },
              {
                _gaEvent: 'Chats',
                title: a.t(null, void 0, i(62313)),
                name: 'union_chats',
                icon: 'messages',
                widgets: [{ type: 'unionchats' }],
              },
              {
                _gaEvent: 'Ideas Stream',
                title: a.t(null, void 0, i(406501)),
                name: 'ideas_stream',
                icon: 'ideas-stream',
                widgets: [{ type: 'notifications_following' }],
              },
              null,
              null,
              null,
            ]
          for (let t = 0; t < s.length; t++) {
            const i = s[t]
            i && e.pages.push(i)
          }
          return e
        }
        getChartingPlatformLayoutState(t, e) {
          const s = (0, Ct.getDefaultState)()
          if (
            this._customization.watchlist ||
            this._customization.details ||
            this._customization.news
          ) {
            let n = ''
            const r = []
            this._customization.watchlist &&
              ((n = a.t(null, void 0, i(213402))),
              r.push({
                type: 'watchlist',
                id: 'watchlist.' + e,
                properties: t && t.length ? { list: t } : void 0,
              })),
              this._customization.details &&
                ((n = this._customization.watchlist
                  ? a.t(null, void 0, i(687351))
                  : a.t(null, void 0, i(557027))),
                r.push({ type: 'detail' })),
              this._customization.news &&
                ((n =
                  this._customization.watchlist && this._customization.details
                    ? a.t(null, void 0, i(334422))
                    : this._customization.watchlist
                      ? a.t(null, void 0, i(785719))
                      : a.t(null, void 0, i(923278))),
                r.push({ type: 'news', id: 'news.' + e })),
              s.pages.push({ name: 'base', title: n, icon: 'base', widgets: r })
          }
          return (
            this._customization.datawindow &&
              s.pages.push({
                title: a.t(null, void 0, i(409068)),
                name: 'data-window',
                icon: 'datawindow',
                widgets: [{ type: 'datawindow' }],
              }),
            (Tt || (Bt && !Tt)) &&
              Et &&
              this.chartWidgetCollection &&
              !this.chartWidgetCollection.readOnly() &&
              s.pages.push({
                title: a.t(null, void 0, i(495824)),
                name: 'object_tree',
                icon: 'object-tree',
                onBottom: !1,
                widgets: [{ type: 'object_tree' }],
              }),
            s
          )
        }
        getLayoutState() {
          const t = T.getJSON('watchlist.list', [])
          let e
          e = I.enabled('trading_terminal')
            ? this.getChartingPlatformLayoutState(t, 'terminal')
            : this.getGenericLayoutState(t)
          const i = (t) =>
            !(void 0 !== t.isEnabled && !t.isEnabled) &&
            (this.chartWidgetCollection ||
              !(0, n.ensure)(v[t.type]).chartWidgetRequired)
          for (let t = e.pages.length - 1; t >= 0; t--) {
            const s = e.pages[t]
            s.widgets = s.widgets.filter(i)
          }
          return (
            (e.pages = e.pages.filter((t) => t.widgets && t.widgets.length)), e
          )
        }
        createWidgetId(t) {
          return t + '.' + (0, z.randomHash)()
        }
        setPage(t) {
          if (!this.layout) return null
          this.layout.setMinimizedState(!1)
          let e = this.layout.activeIndex
          return (
            this.layout.pages.forEach((i, s) => {
              i.name === t && (e = s)
            }),
            this.layout.switchPage(e),
            this.layout.getActivePage()
          )
        }
        ensureSupportTicketButtonViewModel() {
          return (
            this._supportTicketButtonViewModel ||
              (this._supportTicketButtonViewModel = new c({
                icon: Lt,
                hint: a.t(null, void 0, i(788911)),
                onClick: () => {
                  this._configuration.then((t) => {
                    const e = t.showSupportDialog
                    e && e()
                  }),
                    this._load()
                },
              })),
            this._supportTicketButtonViewModel
          )
        }
        ensureHelpButtonViewModel() {
          if (this._helpButtonViewModel) return this._helpButtonViewModel
          const t = this.ensureSupportTicketButtonViewModel()
          return (
            (this._helpButtonViewModel = new c({
              icon: Wt,
              hint: a.t(null, void 0, i(788911)),
              onClick: t.onClick.value(),
            })),
            this._helpButtonViewModel
          )
        }
        createHTML() {
          const t = this._container
          if (!t) return
          if (!this.layout) return
          ;(t.innerHTML = ''), this.layout.createHTML()
          const e = (this._wrap = document.createElement('div'))
          ;(e.classList.value =
            'widgetbar-wrap unselectable js-right-boundary'),
            e.setAttribute('data-name', 'widgetbar-wrap'),
            t.appendChild(e)
          const i = this.layout.element('tabs')
          Tt && i && this._wrap.appendChild(i)
          const s = this.layout.element('pages')
          s && this._wrap.appendChild(s)
          const n = this.layout.element('device-button')
          n && this._wrap.appendChild(n)
          const a = this.layout.element('hider')
          a && this._wrap.appendChild(a)
        }
        getWrapElement() {
          return this._wrap
        }
        _getSerializedStateFromSetting() {
          return this._settingsPrefix
            ? T.getJSON(this._settingsPrefix + '.layout-settings', null)
            : null
        }
        _setSerializedStateToSettings(t) {
          this._settingsPrefix &&
            T.setJSON(this._settingsPrefix + '.layout-settings', t)
        }
        _onBrokerConnectionStatusChanged() {}
      }
    },
    496818: (t, e, i) => {
      i.d(e, { Draggable: () => o, PointerBackend: () => l })
      var s = i(650151),
        n = i(821205),
        a = i(601227),
        r = i(972535)
      i(165719)
      class o {
        constructor(t) {
          var e, i
          ;(this._helper = null),
            (this._handleDragStart = (t) => {
              var e
              if (null !== this._helper) return
              const i = this._source
              i.classList.add('ui-draggable-dragging')
              const [s, a] = [(0, n.outerWidth)(i), (0, n.outerHeight)(i)]
              ;(this._helper = {
                startTop: Number.parseFloat(i.style.top) || 0,
                startLeft: Number.parseFloat(i.style.left) || 0,
                nextTop: null,
                nextLeft: null,
                raf: null,
                size: [s, a],
                containment:
                  this._containment instanceof HTMLElement
                    ? [
                        Number.parseInt(
                          getComputedStyle(this._containment).borderLeftWidth,
                        ) +
                          Number.parseInt(
                            getComputedStyle(this._containment).paddingLeft,
                          ),
                        Number.parseInt(
                          getComputedStyle(this._containment).borderTopWidth,
                        ) +
                          Number.parseInt(
                            getComputedStyle(this._containment).paddingTop,
                          ),
                        this._containment.offsetWidth -
                          Number.parseInt(
                            getComputedStyle(this._containment)
                              .borderRightWidth,
                          ) -
                          Number.parseInt(
                            getComputedStyle(this._containment).paddingRight,
                          ) -
                          Number.parseInt(getComputedStyle(i).marginLeft) -
                          Number.parseInt(getComputedStyle(i).marginRight) -
                          s,
                        this._containment.offsetHeight -
                          Number.parseInt(
                            getComputedStyle(this._containment)
                              .borderBottomWidth,
                          ) -
                          Number.parseInt(
                            getComputedStyle(this._containment).paddingBottom,
                          ) -
                          Number.parseInt(getComputedStyle(i).marginTop) -
                          Number.parseInt(getComputedStyle(i).marginBottom) -
                          a,
                      ]
                    : 'window' === this._containment
                      ? [
                          window.scrollX,
                          window.scrollY,
                          window.scrollX +
                            document.documentElement.offsetWidth -
                            s,
                          window.scrollY +
                            document.documentElement.offsetHeight -
                            a,
                        ]
                      : null,
              }),
                null === (e = this._start) || void 0 === e || e.call(this)
            }),
            (this._handleDragMove = (t) => {
              var e
              if (null === this._helper) return
              const { current: i, initial: s } = t.detail,
                n = this._source,
                a = this._helper.nextTop,
                r = this._helper.nextLeft,
                o = 'y' === this._axis || !1 === this._axis || 0 !== i.movementY
              if (o) {
                const t = this._helper.startTop
                isFinite(t) &&
                  (this._helper.nextTop = i.clientY - s.clientY + t)
              }
              const l =
                'x' === this._axis || !1 === this._axis || 0 !== i.movementY
              if (l) {
                const t = this._helper.startLeft
                isFinite(t) &&
                  (this._helper.nextLeft = i.clientX - s.clientX + t)
              }
              if (null !== this._helper.containment) {
                const [t, e, i, s] = this._helper.containment
                o &&
                  this._helper.nextTop &&
                  ((this._helper.nextTop = Math.min(this._helper.nextTop, s)),
                  (this._helper.nextTop = Math.max(this._helper.nextTop, e))),
                  l &&
                    this._helper.nextLeft &&
                    ((this._helper.nextLeft = Math.min(
                      this._helper.nextLeft,
                      i,
                    )),
                    (this._helper.nextLeft = Math.max(
                      this._helper.nextLeft,
                      t,
                    )))
              }
              null !== this._helper.raf ||
                (a === this._helper.nextTop && r === this._helper.nextLeft) ||
                (this._helper.raf = requestAnimationFrame(() => {
                  null !== this._helper &&
                    (null !== this._helper.nextTop &&
                      ((n.style.top = this._helper.nextTop + 'px'),
                      (this._helper.nextTop = null)),
                    null !== this._helper.nextLeft &&
                      ((n.style.left = this._helper.nextLeft + 'px'),
                      (this._helper.nextLeft = null)),
                    (this._helper.raf = null))
                })),
                null === (e = this._drag) || void 0 === e || e.call(this)
            }),
            (this._handleDragStop = (t) => {
              var e
              if (null === this._helper) return
              this._source.classList.remove('ui-draggable-dragging'),
                (this._helper = null),
                null === (e = this._stop) || void 0 === e || e.call(this)
            })
          const s = (this._source = t.source)
          s.classList.add('ui-draggable')
          const a = (this._handle =
            null !== (e = t.handle ? s.querySelector(t.handle) : null) &&
            void 0 !== e
              ? e
              : s)
          a.classList.add('ui-draggable-handle'),
            (this._start = t.start),
            (this._stop = t.stop),
            (this._drag = t.drag),
            (this._backend = new l({
              handle: a,
              onDragStart: this._handleDragStart,
              onDragMove: this._handleDragMove,
              onDragStop: this._handleDragStop,
            })),
            (this._axis = null !== (i = t.axis) && void 0 !== i && i),
            (this._containment = t.containment)
        }
        destroy() {
          const t = this._source
          t.classList.remove('ui-draggable'),
            t.classList.remove('ui-draggable-dragging')
          this._handle.classList.remove('ui-draggable-handle'),
            this._backend.destroy(),
            null !== this._helper &&
              (this._helper.raf && cancelAnimationFrame(this._helper.raf),
              (this._helper = null))
        }
      }
      class l {
        constructor(t) {
          ;(this._initial = null),
            (this._handlePointerDown = (t) => {
              if (null !== this._initial) return
              if (
                !(
                  t.target instanceof Element && this._handle.contains(t.target)
                )
              )
                return
              if (
                ((this._initial = t),
                !this._dispatchEvent(
                  this._createEvent('pointer-drag-start', t),
                ))
              )
                return void (this._initial = null)
              t.preventDefault()
              const e = this._getEventTarget()
              e.addEventListener('pointermove', this._handlePointerMove),
                e.addEventListener('pointerup', this._handlePointerUp),
                e.addEventListener('pointercancel', this._handlePointerUp),
                e.addEventListener('lostpointercapture', this._handlePointerUp),
                e.setPointerCapture(t.pointerId)
            }),
            (this._handlePointerMove = (t) => {
              null !== this._initial &&
                this._initial.pointerId === t.pointerId &&
                (t.preventDefault(),
                this._dispatchEvent(this._createEvent('pointer-drag-move', t)))
            }),
            (this._handlePointerUp = (t) => {
              if (
                null === this._initial ||
                this._initial.pointerId !== t.pointerId
              )
                return
              t.preventDefault()
              const e = this._getEventTarget()
              e.removeEventListener('pointermove', this._handlePointerMove),
                e.removeEventListener('pointerup', this._handlePointerUp),
                e.removeEventListener('pointercancel', this._handlePointerUp),
                e.removeEventListener(
                  'lostpointercapture',
                  this._handlePointerUp,
                ),
                e.releasePointerCapture(this._initial.pointerId),
                this._dispatchEvent(this._createEvent('pointer-drag-stop', t)),
                (this._initial = null)
            })
          const e = (this._handle = t.handle)
          ;(this._onDragStart = t.onDragStart),
            (this._onDragMove = t.onDragMove),
            (this._onDragStop = t.onDragStop),
            (e.style.touchAction = 'none')
          this._getEventTarget().addEventListener(
            'pointerdown',
            this._handlePointerDown,
          )
        }
        destroy() {
          this._handle.style.touchAction = ''
          const t = this._getEventTarget()
          t.removeEventListener('pointerdown', this._handlePointerDown),
            t.removeEventListener('pointermove', this._handlePointerMove),
            t.removeEventListener('pointerup', this._handlePointerUp),
            t.removeEventListener('pointercancel', this._handlePointerUp),
            t.removeEventListener('lostpointercapture', this._handlePointerUp),
            null !== this._initial &&
              (t.releasePointerCapture(this._initial.pointerId),
              (this._initial = null))
        }
        _getEventTarget() {
          return a.CheckMobile.iOS() || ((0, a.isMac)() && r.touch)
            ? window.document.documentElement
            : this._handle
        }
        _dispatchEvent(t) {
          switch (t.type) {
            case 'pointer-drag-start':
              this._onDragStart(t)
              break
            case 'pointer-drag-move':
              this._onDragMove(t)
              break
            case 'pointer-drag-stop':
              this._onDragStop(t)
          }
          return !t.defaultPrevented
        }
        _createEvent(t, e) {
          return (
            (0, s.assert)(null !== this._initial),
            new CustomEvent(t, {
              bubbles: !0,
              cancelable: !0,
              detail: { backend: this, initial: this._initial, current: e },
            })
          )
        }
      }
    },
    902374: (t, e, i) => {
      i.d(e, { retries: () => a, retriesWithDelays: () => r })
      var s = i(148442)
      async function n(t, e, i) {
        let s
        for (let n = 0; n < e; ++n)
          try {
            return await t(s)
          } catch (t) {
            ;(s = t), await i(n)
          }
        throw s
      }
      async function a(t, e) {
        return n(t, e, () => Promise.resolve())
      }
      async function r(t, e) {
        return n(t, e.length + 1, (t) =>
          t < e.length ? (0, s.delay)(null, e[t]) : Promise.resolve(),
        )
      }
    },
    821205: (t, e, i) => {
      i.d(e, {
        contentHeight: () => n.contentHeight,
        html: () => a,
        outerHeight: () => n.outerHeight,
        outerWidth: () => n.outerWidth,
        position: () => o,
      })
      var s = i(650151),
        n = i(65160)
      function a(t, e) {
        return (
          void 0 === e ||
            (null === e && (t.innerHTML = ''),
            ('string' != typeof e && 'number' != typeof e) ||
              (t.innerHTML = String(e))),
          t
        )
      }
      function r(t) {
        if (!t.getClientRects().length) return { top: 0, left: 0 }
        const e = t.getBoundingClientRect(),
          i = (0, s.ensureNotNull)(t.ownerDocument.defaultView)
        return { top: e.top + i.pageYOffset, left: e.left + i.pageXOffset }
      }
      function o(t) {
        const e = getComputedStyle(t)
        let i,
          s = { top: 0, left: 0 }
        if ('fixed' === e.position) i = t.getBoundingClientRect()
        else {
          i = r(t)
          const e = t.ownerDocument
          let n = t.offsetParent || e.documentElement
          while (
            n &&
            (n === e.body || n === e.documentElement) &&
            'static' === getComputedStyle(n).position
          )
            n = n.parentElement
          n &&
            n !== t &&
            1 === n.nodeType &&
            ((s = r(n)),
            (s.top += Number.parseFloat(getComputedStyle(n).borderTopWidth)),
            (s.left += Number.parseFloat(getComputedStyle(n).borderLeftWidth)))
        }
        return {
          top: i.top - s.top - Number.parseFloat(e.marginTop),
          left: i.left - s.left - Number.parseFloat(e.marginLeft),
        }
      }
    },
    438980: (t, e, i) => {
      i.d(e, { Measure: () => n })
      var s = i(664332)
      function n(t) {
        const { children: e, onResize: i } = t
        return e((0, s.useResizeObserver)(i || (() => {}), [null === i]))
      }
    },
    479796: (t, e, i) => {
      i.r(e), i.d(e, { DetailsContainer: () => l, Widget: () => h })
      var s = i(6835),
        n = i(48547),
        a = i(650802)
      const r = new a.WatchedValue(!1),
        o = (0, s.getLogger)('Platform.GUI.Widgetbar.DetailsWidget')
      class l extends n.WidgetbarWidgetRenderer {
        constructor(t) {
          super(t),
            (this._history = null),
            (this._mounted = !1),
            (this._contentRenderer = null),
            (this._mindsFormState = new a.WatchedValue({ opened: !1 })),
            (this._bridge = t),
            this.mount()
        }
        navigate(t, e) {
          var i
          null === (i = this._history) || void 0 === i || i.replace(t, e)
        }
        mount() {
          this._mounted
            ? o.logWarn('Mount was called on already mounted widget')
            : ((this._mounted = !0), this._load())
        }
        unmount() {
          this._mounted
            ? ((this._mounted = !1),
              r.setValue(!1),
              this._mindsFormState.setValue({ opened: !1 }),
              super.unmount(),
              (this._loadModulePromise = null))
            : o.logWarn('Unmount was called on already unmounted widget')
        }
        destroy() {
          super.destroy()
        }
        openMindForm() {
          this._mindsFormState.setValue({ opened: !0 }, !0)
        }
        _load() {
          if (this._contentRenderer)
            return r.setValue(!0), void this._contentRenderer()
          const t = (this._loadModulePromise = Promise.all([
            Promise.all([
              i.e(4011),
              i.e(4015),
              i.e(9842),
              i.e(1625),
              i.e(6747),
              i.e(1631),
              i.e(2567),
              i.e(293),
              i.e(1375),
              i.e(6991),
            ]).then(i.bind(i, 93351)),
            Promise.resolve().then(i.t.bind(i, 50959, 19)),
            Promise.resolve().then(i.t.bind(i, 500962, 19)),
          ]).then(([e, i, s]) => {
            t === this._loadModulePromise &&
              ((this._contentRenderer = () => {
                s.render(
                  i.createElement(e.DetailsWrapper, {
                    bridge: this._bridge,
                    widgetHeaderElement: this._headerContainer,
                    history: this._history,
                    mindsFormState: this._mindsFormState,
                  }),
                  this._container,
                )
              }),
              this._contentRenderer(),
              r.setValue(!0))
          }))
        }
        _handleLoginStateChange() {
          0
        }
      }
      const h = l
    },
    865266: (t, e, i) => {
      i.d(e, { useRovingTabindexElement: () => r })
      var s = i(50959),
        n = i(718736),
        a = i(892932)
      function r(t, e = []) {
        const [i, r] = (0, s.useState)(!1),
          o = (0, n.useFunctionalRefObject)(t)
        return (
          (0, s.useLayoutEffect)(() => {
            if (!a.PLATFORM_ACCESSIBILITY_ENABLED) return
            const t = o.current
            if (null === t) return
            const e = (t) => {
              switch (t.type) {
                case 'roving-tabindex:main-element':
                  r(!0)
                  break
                case 'roving-tabindex:secondary-element':
                  r(!1)
              }
            }
            return (
              t.addEventListener('roving-tabindex:main-element', e),
              t.addEventListener('roving-tabindex:secondary-element', e),
              () => {
                t.removeEventListener('roving-tabindex:main-element', e),
                  t.removeEventListener('roving-tabindex:secondary-element', e)
              }
            )
          }, e),
          [o, a.PLATFORM_ACCESSIBILITY_ENABLED ? (i ? 0 : -1) : void 0]
        )
      }
    },
    704095: (t, e, i) => {
      i.r(e), i.d(e, { ObjectTreeRenderer: () => r })
      var s = i(33290),
        n = i(557883),
        a = i(561604)
      class r {
        constructor(t) {
          ;(this._viewModel = null),
            (this._promise = null),
            (this._activityChangeHandler = (t) => {
              t ? this.mount() : this.destroy()
            }),
            (this._container = t.container),
            t.active.value() && this.mount(),
            t.active.subscribe(this._activityChangeHandler)
        }
        mount() {
          const t = (this._promise = Promise.all([
            Promise.resolve().then(i.t.bind(i, 50959, 19)),
            Promise.resolve().then(i.t.bind(i, 500962, 19)),
            Promise.all([
              i.e(2666),
              i.e(4015),
              i.e(3842),
              i.e(580),
              i.e(6),
              i.e(8194),
              i.e(5649),
              i.e(8056),
              i.e(5993),
              i.e(7080),
              i.e(6747),
              i.e(5518),
              i.e(5542),
              i.e(1494),
              i.e(6525),
              i.e(1810),
              i.e(8044),
              i.e(1371),
              i.e(8210),
              i.e(5416),
              i.e(4811),
              i.e(8413),
              i.e(9144),
              i.e(5031),
            ]).then(i.bind(i, 420779)),
            Promise.all([
              i.e(2666),
              i.e(4015),
              i.e(3842),
              i.e(580),
              i.e(6),
              i.e(8194),
              i.e(5649),
              i.e(8056),
              i.e(5993),
              i.e(7080),
              i.e(6747),
              i.e(5518),
              i.e(5542),
              i.e(1494),
              i.e(6525),
              i.e(1810),
              i.e(8044),
              i.e(1371),
              i.e(8210),
              i.e(5416),
              i.e(4811),
              i.e(8413),
              i.e(9144),
              i.e(5031),
            ]).then(i.bind(i, 993321)),
            Promise.all([
              i.e(2666),
              i.e(4015),
              i.e(3842),
              i.e(580),
              i.e(6),
              i.e(8194),
              i.e(5649),
              i.e(8056),
              i.e(5993),
              i.e(7080),
              i.e(6747),
              i.e(5518),
              i.e(5542),
              i.e(1494),
              i.e(6525),
              i.e(1810),
              i.e(8044),
              i.e(1371),
              i.e(8210),
              i.e(5416),
              i.e(4811),
              i.e(8413),
              i.e(9144),
              i.e(5031),
            ]).then(i.bind(i, 715489)),
            (0, a.loadAllSourcesIcons)(),
          ]).then(([e, i, a, r, o]) => {
            if (this._promise === t) {
              const t = (0, s.service)(n.CHART_WIDGET_COLLECTION_SERVICE)
              null === this._viewModel &&
                (this._viewModel = new o.ObjectTree(t.activeChartWidget)),
                i.render(
                  e.createElement(r.ObjectTree, {
                    nodeRenderer: a.NodeRenderer,
                    viewModel: this._viewModel,
                    hideHeaderTitle: this._hideHeaderTitle,
                  }),
                  this._container,
                )
            }
          }))
        }
        unmount() {
          this.unmountBody()
        }
        unmountBody() {
          this._promise = null
          const t = i.c[500962]
          if (t) {
            t.exports.unmountComponentAtNode(this._container)
          }
        }
        destroy() {
          this.unmount(),
            null !== this._viewModel &&
              (this._viewModel.destroy(), (this._viewModel = null))
        }
      }
    },
    626800: (t, e, i) => {
      i.d(e, { safeShortName: () => n })
      var s = i(949345)
      function n(t) {
        try {
          return (0, s.shortName)(t)
        } catch (e) {
          return t
        }
      }
    },
    522224: (t, e, i) => {
      i.d(e, {
        hoverMouseEventFilter: () => s.hoverMouseEventFilter,
        useAccurateHover: () => s.useAccurateHover,
        useHover: () => s.useHover,
      })
      var s = i(975228)
    },
    181436: (t, e, i) => {
      i.d(e, { getPixelsFromEvent: () => n })
      const s = [
        () =>
          navigator.userAgent.includes('Win') &&
          navigator.userAgent.includes('Chrome')
            ? 1 / window.devicePixelRatio
            : 1,
        () => 16,
        (t = () => 0) => {
          var e
          return 0.8 * (null !== (e = t()) && void 0 !== e ? e : 0)
        },
      ]
      function n(t, e = () => ({})) {
        return {
          x: t.deltaX * s[t.deltaMode](() => e().width),
          y: t.deltaY * s[t.deltaMode](() => e().height),
        }
      }
    },
    906132: (t, e, i) => {
      var s = i(522134)
      function n() {}
      function a() {}
      ;(a.resetWarningCache = n),
        (t.exports = () => {
          function t(t, e, i, n, a, r) {
            if (r !== s) {
              var o = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types',
              )
              throw ((o.name = 'Invariant Violation'), o)
            }
          }
          function e() {
            return t
          }
          t.isRequired = t
          var i = {
            array: t,
            bool: t,
            func: t,
            number: t,
            object: t,
            string: t,
            symbol: t,
            any: t,
            arrayOf: e,
            element: t,
            elementType: t,
            instanceOf: e,
            node: t,
            objectOf: e,
            oneOf: e,
            oneOfType: e,
            shape: e,
            exact: e,
            checkPropTypes: a,
            resetWarningCache: n,
          }
          return (i.PropTypes = i), i
        })
    },
    719036: (t, e, i) => {
      t.exports = i(906132)()
    },
    522134: (t) => {
      t.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
    },
    27334: (t) => {
      t.exports = {
        container: 'container-Wp9adlfh',
        mirror: 'mirror-Wp9adlfh',
        background: 'background-Wp9adlfh',
        arrow: 'arrow-Wp9adlfh',
      }
    },
    530261: (t) => {
      t.exports = {
        wrap: 'wrap-Z4M3tWHb',
        scrollWrap: 'scrollWrap-Z4M3tWHb',
        noScrollBar: 'noScrollBar-Z4M3tWHb',
        content: 'content-Z4M3tWHb',
        icon: 'icon-Z4M3tWHb',
        scrollBot: 'scrollBot-Z4M3tWHb',
        scrollTop: 'scrollTop-Z4M3tWHb',
        isVisible: 'isVisible-Z4M3tWHb',
        iconWrap: 'iconWrap-Z4M3tWHb',
        fadeBot: 'fadeBot-Z4M3tWHb',
        fadeTop: 'fadeTop-Z4M3tWHb',
      }
    },
    124526: (t) => {
      t.exports = { button: 'button-c8sm3pCb' }
    },
    107516: (t) => {
      t.exports = { filler: 'filler-GfsAWtWz' }
    },
    115963: (t) => {
      t.exports = { toolbar: 'toolbar-S4V6IoxY' }
    },
    881182: (t) => {
      t.exports = { separator: 'separator-gZVyfVJP' }
    },
    359332: (t) => {
      t.exports = {
        button: 'button-I_wb5FjE',
        hover: 'hover-I_wb5FjE',
        clicked: 'clicked-I_wb5FjE',
        hoverMask: 'hoverMask-I_wb5FjE',
        icon: 'icon-I_wb5FjE',
        counterRow: 'counterRow-I_wb5FjE',
        counter: 'counter-I_wb5FjE',
        isActive: 'isActive-I_wb5FjE',
        accessible: 'accessible-I_wb5FjE',
      }
    },
    27164: (t, e, i) => {
      function s(t) {
        t.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function n(t) {
        t.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      i.d(e, { becomeMainElement: () => s, becomeSecondaryElement: () => n })
    },
    869194: (t, e, i) => {
      i.d(e, { useMouseClickAutoBlur: () => r })
      var s = i(50959),
        n = i(111706),
        a = i(892932)
      function r(t, e = !0) {
        ;(0, s.useEffect)(() => {
          if (!a.PLATFORM_ACCESSIBILITY_ENABLED || !e) return
          const i = (e) => {
            const i = t.current
            null !== i &&
              document.activeElement instanceof HTMLElement &&
              ((0, n.isKeyboardClick)(e) ||
                (i.contains(document.activeElement) &&
                  'INPUT' !== document.activeElement.tagName &&
                  document.activeElement.blur()))
          }
          return (
            window.addEventListener('click', i, !0),
            () => window.removeEventListener('click', i, !0)
          )
        }, [e])
      }
    },
    960732: (t, e, i) => {
      i.d(e, {
        DEFAULT_VERTICAL_TOOLBAR_HIDER_THEME: () => o,
        VerticalToolbarHider: () => h,
      })
      var s = i(50959),
        n = i(497754),
        a = i(199663),
        r = i(27334)
      const o = r,
        l = 'http://www.w3.org/2000/svg'
      function h(t) {
        const { direction: e, theme: i = r } = t
        return s.createElement(
          'svg',
          {
            xmlns: l,
            width: '9',
            height: '27',
            viewBox: '0 0 9 27',
            className: n(i.container, 'right' === e ? i.mirror : null),
            onContextMenu: a.preventDefault,
          },
          s.createElement(
            'g',
            { fill: 'none', fillRule: 'evenodd' },
            s.createElement('path', {
              className: i.background,
              d: 'M4.5.5a4 4 0 0 1 4 4v18a4 4 0 1 1-8 0v-18a4 4 0 0 1 4-4z',
            }),
            s.createElement('path', {
              className: i.arrow,
              d: 'M5.5 10l-2 3.5 2 3.5',
            }),
          ),
        )
      }
    },
    622614: (t, e, i) => {
      i.d(e, { Toolbar: () => c })
      var s = i(50959),
        n = i(650151),
        a = i(269842),
        r = i(930202),
        o = i(892932),
        l = i(27164),
        h = i(718736),
        d = i(869194)
      const c = (0, s.forwardRef)((t, e) => {
        const {
            onKeyDown: i,
            orientation: c,
            blurOnEscKeydown: u = !0,
            blurOnClick: g = !0,
            ...p
          } = t,
          _ = o.PLATFORM_ACCESSIBILITY_ENABLED
            ? { role: 'toolbar', 'aria-orientation': c }
            : {},
          m = (0, h.useFunctionalRefObject)(e)
        return (
          (0, s.useLayoutEffect)(() => {
            if (!o.PLATFORM_ACCESSIBILITY_ENABLED) return
            const t = (0, n.ensureNotNull)(m.current),
              e = () => {
                const e = (0, o.queryTabbableElements)(t).sort(
                  o.navigationOrderComparator,
                )
                if (0 === e.length) {
                  const [e] = (0, o.queryFocusableElements)(t).sort(
                    o.navigationOrderComparator,
                  )
                  if (void 0 === e) return
                  ;(0, l.becomeMainElement)(e)
                }
                if (e.length > 1) {
                  const [, ...t] = e
                  for (const e of t) (0, l.becomeSecondaryElement)(e)
                }
              }
            return (
              window.addEventListener('keyboard-navigation-activation', e),
              () =>
                window.removeEventListener('keyboard-navigation-activation', e)
            )
          }, []),
          (0, d.useMouseClickAutoBlur)(m, g),
          s.createElement('div', {
            ...p,
            ..._,
            ref: m,
            onKeyDown: (0, a.createSafeMulticastEventHandler)((t) => {
              if (!o.PLATFORM_ACCESSIBILITY_ENABLED) return
              if (t.defaultPrevented) return
              if (!(document.activeElement instanceof HTMLElement)) return
              const e = (0, r.hashFromEvent)(t)
              if (u && 27 === e)
                return t.preventDefault(), void document.activeElement.blur()
              if ('vertical' !== c && 37 !== e && 39 !== e) return
              if ('vertical' === c && 38 !== e && 40 !== e) return
              const i = t.currentTarget,
                s = (0, o.queryFocusableElements)(i).sort(
                  o.navigationOrderComparator,
                )
              if (0 === s.length) return
              const n = s.indexOf(document.activeElement)
              if (-1 === n) return
              t.preventDefault()
              const a = () => {
                  const t = (n + s.length - 1) % s.length
                  ;(0, l.becomeSecondaryElement)(s[n]),
                    (0, l.becomeMainElement)(s[t]),
                    s[t].focus()
                },
                h = () => {
                  const t = (n + s.length + 1) % s.length
                  ;(0, l.becomeSecondaryElement)(s[n]),
                    (0, l.becomeMainElement)(s[t]),
                    s[t].focus()
                }
              switch ((0, o.mapKeyCodeToDirection)(e)) {
                case 'inlinePrev':
                  'vertical' !== c && a()
                  break
                case 'inlineNext':
                  'vertical' !== c && h()
                  break
                case 'blockPrev':
                  'vertical' === c && a()
                  break
                case 'blockNext':
                  'vertical' === c && h()
              }
            }, i),
          })
        )
      })
    },
    19139: (t, e, i) => {
      i.d(e, { VerticalScroll: () => u })
      var s = i(50959),
        n = i(497754),
        a = i.n(n),
        r = i(72571),
        o = i(350136),
        l = i(49630),
        h = i(438980),
        d = i(530261),
        c = i(661380)
      class u extends s.PureComponent {
        constructor(t) {
          super(t),
            (this._scroll = null),
            (this._handleScrollTop = () => {
              this.animateTo(
                Math.max(
                  0,
                  this.currentPosition() - (this.state.heightWrap - 50),
                ),
              )
            }),
            (this._handleScrollBot = () => {
              this.animateTo(
                Math.min(
                  (this.state.heightContent || 0) -
                    (this.state.heightWrap || 0),
                  this.currentPosition() + (this.state.heightWrap - 50),
                ),
              )
            }),
            (this._handleResizeWrap = ([t]) => {
              this.setState({ heightWrap: t.contentRect.height })
            }),
            (this._handleResizeContent = ([t]) => {
              this.setState({ heightContent: t.contentRect.height })
            }),
            (this._handleScroll = () => {
              const { onScroll: t } = this.props
              t && t(this.currentPosition(), this.isAtTop(), this.isAtBot()),
                this._checkButtonsVisibility()
            }),
            (this._checkButtonsVisibility = () => {
              const { isVisibleTopButton: t, isVisibleBotButton: e } =
                  this.state,
                i = this.isAtTop(),
                s = this.isAtBot()
              i || t
                ? i && t && this.setState({ isVisibleTopButton: !1 })
                : this.setState({ isVisibleTopButton: !0 }),
                s || e
                  ? s && e && this.setState({ isVisibleBotButton: !1 })
                  : this.setState({ isVisibleBotButton: !0 })
            }),
            (this.state = {
              heightContent: 0,
              heightWrap: 0,
              isVisibleBotButton: !1,
              isVisibleTopButton: !1,
            })
        }
        componentDidMount() {
          this._checkButtonsVisibility()
        }
        componentDidUpdate(t, e) {
          ;(e.heightWrap === this.state.heightWrap &&
            e.heightContent === this.state.heightContent) ||
            this._handleScroll()
        }
        currentPosition() {
          return this._scroll ? this._scroll.scrollTop : 0
        }
        isAtTop() {
          return this.currentPosition() <= 1
        }
        isAtBot() {
          return (
            this.currentPosition() + this.state.heightWrap >=
            this.state.heightContent - 1
          )
        }
        animateTo(t, e = l.dur) {
          const i = this._scroll
          i &&
            (0, o.doAnimate)({
              onStep(t, e) {
                i.scrollTop = e
              },
              from: i.scrollTop,
              to: Math.round(t),
              easing: l.easingFunc.easeInOutCubic,
              duration: e,
            })
        }
        render() {
          const {
              children: t,
              isVisibleScrollbar: e,
              isVisibleFade: i,
              isVisibleButtons: n,
              onMouseOver: o,
              onMouseOut: l,
            } = this.props,
            {
              heightContent: u,
              heightWrap: g,
              isVisibleBotButton: p,
              isVisibleTopButton: _,
            } = this.state
          return s.createElement(
            h.Measure,
            { onResize: this._handleResizeWrap },
            (m) =>
              s.createElement(
                'div',
                { className: d.wrap, onMouseOver: o, onMouseOut: l, ref: m },
                s.createElement(
                  'div',
                  {
                    className: a()(d.scrollWrap, { [d.noScrollBar]: !e }),
                    onScroll: this._handleScroll,
                    ref: (t) => (this._scroll = t),
                  },
                  s.createElement(
                    h.Measure,
                    { onResize: this._handleResizeContent },
                    (e) =>
                      s.createElement(
                        'div',
                        { className: d.content, ref: e },
                        t,
                      ),
                  ),
                ),
                i &&
                  s.createElement('div', {
                    className: a()(d.fadeTop, { [d.isVisible]: _ && u > g }),
                  }),
                i &&
                  s.createElement('div', {
                    className: a()(d.fadeBot, { [d.isVisible]: p && u > g }),
                  }),
                n &&
                  s.createElement(
                    'div',
                    {
                      className: a()(d.scrollTop, {
                        [d.isVisible]: _ && u > g,
                      }),
                      onClick: this._handleScrollTop,
                    },
                    s.createElement(
                      'div',
                      { className: d.iconWrap },
                      s.createElement(r.Icon, { icon: c, className: d.icon }),
                    ),
                  ),
                n &&
                  s.createElement(
                    'div',
                    {
                      className: a()(d.scrollBot, {
                        [d.isVisible]: p && u > g,
                      }),
                      onClick: this._handleScrollBot,
                    },
                    s.createElement(
                      'div',
                      { className: d.iconWrap },
                      s.createElement(r.Icon, { icon: c, className: d.icon }),
                    ),
                  ),
              ),
          )
        }
      }
      u.defaultProps = { isVisibleScrollbar: !0 }
    },
    261401: (t, e, i) => {
      i.d(e, {
        RegistryProvider: () => l,
        registryContextType: () => h,
        validateRegistry: () => o,
      })
      var s = i(50959),
        n = i(719036),
        a = i.n(n)
      const r = s.createContext({})
      function o(t, e) {
        a().checkPropTypes(e, t, 'context', 'RegistryContext')
      }
      function l(t) {
        const { validation: e, value: i } = t
        return o(i, e), s.createElement(r.Provider, { value: i }, t.children)
      }
      function h() {
        return r
      }
    },
    561604: (t, e, i) => {
      i.d(e, { getAllSourcesIcons: () => d, loadAllSourcesIcons: () => h })
      var s = i(902374)
      const n = (0, i(6835).getLogger)('DataSourcesIcons')
      let a = null
      function r() {
        const t = i.c[259517]
        return t
          ? Promise.resolve(t.exports.lineToolsIcons)
          : i
              .e(1890)
              .then(i.bind(i, 259517))
              .then((t) => t.lineToolsIcons)
      }
      function o() {
        const t = i.c[583798]
        return t
          ? Promise.resolve(t.exports.SERIES_ICONS)
          : i
              .e(9685)
              .then(i.bind(i, 583798))
              .then((t) => t.SERIES_ICONS)
      }
      let l = null
      function h() {
        return (
          null === l &&
            (l = (() => {
              const t = (0, s.retries)(r, 2)
                  .then((t) => t)
                  .catch((t) => (n.logWarn(t), {})),
                e = (0, s.retries)(o, 2)
                  .then((t) => t)
                  .catch((t) => (n.logWarn(t), {}))
              return Promise.all([t, e])
            })()),
          l.then((t) => ((a = { linetool: t[0], series: t[1] }), a))
        )
      }
      function d() {
        return a
      }
    },
    256928: (t, e, i) => {
      i.r(e), i.d(e, { WidgetBarNews: () => T })
      var s = i(650151),
        n = i(972535),
        a = i(466052),
        r = i(821205),
        o = i(350136),
        l = i(496818),
        h = i(181436),
        d = (i(901574), i(285778))
      const c = {
        headerHeight: 0,
        additionalClass: '',
        alwaysVisible: !1,
        showBottomShadow: !0,
        scrollMarginTop: 1,
        bubbleScrollEvent: !1,
      }
      class u {
        constructor(t, e, i = {}) {
          if (
            ((this.scrolled = new a.Delegate()),
            (this.scrolltoend = new a.Delegate()),
            (this.scrolltostart = new a.Delegate()),
            (this.visibilityCallbacks = []),
            (this._scrollTargetTop = 0),
            (this._scrollSpeed = 40),
            (this._shadowOffset = 10),
            (this._shadowTop = null),
            (this._shadowBottom = null),
            (this._dragInitialized = !1),
            (this._dragging = !1),
            (this._draggable = null),
            (this._atStart = !1),
            (this._atEnd = !1),
            (this._stickyBottom = null),
            (this._animation = null),
            (this._saved = null),
            (this._options = { ...c, ...i }),
            (this._wrapper = t),
            this._wrapper.classList.add(d.wrapper),
            (this._content = e),
            (this._headerHeight = this._options.headerHeight),
            (this._scrollMarginTop = this._options.scrollMarginTop),
            (this._scrollBar = document.createElement('div')),
            this._scrollBar.classList.add('sb-scrollbar', 'sb-scrollbar-body'),
            this._options.additionalClass &&
              this._scrollBar.classList.add(this._options.additionalClass),
            this._scrollBar.classList.toggle(
              'active-always',
              this._options.alwaysVisible,
            ),
            (this._scrollBarWrapper = document.createElement('div')),
            this._scrollBarWrapper.classList.add('sb-scrollbar-wrap'),
            (this._touch = n.touch),
            this._touch)
          )
            return (
              (this._content.style.position = 'relative'),
              this._wrapper.classList.add(d.touch),
              void this._wrapper.addEventListener('scroll', () =>
                this._onScroll(),
              )
            )
          ;(this._wrapper.style.overflow = 'hidden'),
            (this._unsubscribe = (() => {
              const t = () => {
                  this._dragging ||
                    (this._options.alwaysVisible ||
                      this._scrollBar.classList.add('active'),
                    this._onScroll())
                },
                e = () => {
                  this._dragging ||
                    (this._options.alwaysVisible ||
                      this._scrollBar.classList.remove('active'),
                    this._onScroll())
                },
                i = (t) => {
                  const e = t.target instanceof HTMLElement ? t.target : null
                  if (
                    (!!!(null == e
                      ? void 0
                      : e.closest('.ignore-horizontal-scroll')) ||
                      t.deltaY) &&
                    !t.defaultPrevented
                  ) {
                    const e = (0, h.getPixelsFromEvent)(t, () => ({
                      height: this._wrapper.clientHeight,
                    })).y
                    this.scroll(-e, 1) ||
                      (t.stopPropagation(), t.preventDefault())
                  }
                }
              return (
                this._wrapper.addEventListener('mouseenter', t),
                this._wrapper.addEventListener('mouseleave', e),
                this._wrapper.addEventListener('wheel', i),
                () => {
                  this._wrapper.removeEventListener('mouseenter', t),
                    this._wrapper.removeEventListener('mouseleave', e),
                    this._wrapper.removeEventListener('wheel', i)
                }
              )
            })()),
            !1 !== this._options.showTopShadow &&
              ((this._shadowTop = document.createElement('div')),
              this._shadowTop.classList.add(
                'sb-inner-shadow',
                'top',
                'i-invisible',
              ),
              this._wrapper.appendChild(this._shadowTop)),
            !1 !== this._options.showBottomShadow &&
              ((this._shadowBottom = document.createElement('div')),
              this._shadowBottom.classList.add('sb-inner-shadow'),
              this._wrapper.appendChild(this._shadowBottom)),
            this._shadowTop &&
              this._headerHeight &&
              (this._shadowTop.style.top =
                this._headerHeight - this._shadowOffset + 'px'),
            this._wrapper.appendChild(this._scrollBarWrapper),
            this._scrollBarWrapper.appendChild(this._scrollBar),
            this._onScroll()
        }
        isTouch() {
          return this._touch
        }
        getScrollBar() {
          return this._scrollBar
        }
        initDraggable() {
          return (
            this._dragInitialized ||
              ((this._draggable = new l.Draggable({
                axis: 'y',
                source: this._scrollBar,
                containment: this._scrollBarWrapper,
                start: () => {
                  this._dragging = !0
                },
                stop: () => {
                  this._dragging = !1
                },
                drag: () => {
                  this.updateScroll()
                },
              })),
              (this._dragInitialized = !0)),
            this
          )
        }
        updateScroll() {
          if (this._touch) return this
          const t = Math.ceil(
              (0, r.position)(this._scrollBar).top -
                this._scrollMarginTop -
                this._headerHeight,
            ),
            e = this.getContainerHeightWithoutHeader(),
            i = (0, r.outerHeight)(this._content),
            s = i - e - 1
          return (
            e <= 0 ||
              ((this._scrollTargetTop =
                s <= 0
                  ? this._headerHeight
                  : Math.min(
                      (-t * i) / e + this._headerHeight,
                      this._headerHeight,
                    )),
              t + (0, r.contentHeight)(this._scrollBar) + 2 >= e
                ? this.scrollToEnd()
                : ((this._content.style.top = this._scrollTargetTop + 'px'),
                  this._onScroll())),
            this
          )
        }
        getContainerHeightWithoutHeader() {
          return (
            this._wrapper.getBoundingClientRect().height - this._headerHeight
          )
        }
        getContainerHeight() {
          return this._wrapper.getBoundingClientRect().height
        }
        getContentHeight() {
          return this._content.getBoundingClientRect().height
        }
        updateScrollBar() {
          if (this._touch) return this
          const t = (0, r.position)(this._content).top,
            e = this.getContentHeight(),
            i = this.getContainerHeight(),
            s = this.getContainerHeightWithoutHeader(),
            n = 1 + this._headerHeight,
            a = s - 2,
            o = ((Math.abs(t) - this._headerHeight) * a) / e,
            l = (i * i) / e
          return (
            this.isContentShort()
              ? (this._scrollBar.classList.add('js-hidden'),
                this._wrapper.classList.remove('sb-scroll-active'))
              : (this._scrollBar.classList.remove('js-hidden'),
                (this._scrollBar.style.height = l + 'px'),
                (this._scrollBar.style.top = n + o + 'px'),
                this._wrapper.classList.add('sb-scroll-active'),
                this.initDraggable()),
            this
          )
        }
        scroll(t, e) {
          const i = (0, r.position)(this._content).top,
            s =
              (0, r.outerHeight)(this._content) -
              this.getContainerHeightWithoutHeader() -
              1,
            n = e || this._scrollSpeed
          return (
            s <= 0 ||
            ((this._scrollTargetTop = Math.max(
              -s + this._headerHeight,
              Math.min(this._headerHeight, i + t * n),
            )),
            this.setContentTop(this._scrollTargetTop),
            this._onScroll())
          )
        }
        animateTo(t) {
          if (this._touch) return this
          const e =
            (0, r.outerHeight)(this._content) -
            this.getContainerHeightWithoutHeader() -
            1
          if (e <= 0) return !0
          ;(this._scrollTargetTop = Math.max(
            -e + this._headerHeight,
            Math.min(this._headerHeight, -t),
          )),
            this._animation && this._animation.stop(),
            (this._animation = (0, o.doAnimate)({
              duration: 500,
              from: Number.parseFloat(getComputedStyle(this._content).top),
              to: this._scrollTargetTop,
              onStep: (t, e) => {
                this._content.style.top = e + 'px'
              },
              onComplete: () => {
                this._onScroll()
              },
            }))
        }
        resize() {
          const t = (0, r.outerHeight)(this._content),
            e = (0, r.outerHeight)(this._wrapper)
          !this._options.vAlignBottom && t < e
            ? this.atStart() || this.scrollToStart()
            : this.atEnd()
              ? this.scrollToEnd()
              : 'number' == typeof this._stickyBottom &&
                this.setContentTop(
                  Math.min(
                    0,
                    this._stickyBottom +
                      (0, r.outerHeight)(this._wrapper) -
                      (0, r.outerHeight)(this._content),
                  ),
                )
        }
        resizeHeader(t) {
          const e = t - this._headerHeight
          ;(this._headerHeight = t),
            (this._scrollTargetTop += e),
            this._shadowTop &&
              (this._shadowTop.style.top =
                this._headerHeight - this._shadowOffset + 'px'),
            this.resize()
        }
        scrollTo(t, e) {
          const i = {
            position: 'visible',
            areaHeight: t instanceof HTMLElement ? (0, r.contentHeight)(t) : 0,
            ...e,
          }
          t instanceof HTMLElement &&
            (t = i.offsetTop || (0, r.position)(t).top)
          const s = (0, r.position)(this._content).top,
            n = this._content.getBoundingClientRect().height,
            a = this.getContainerHeightWithoutHeader()
          if (n - a - 1 <= 0) return !0
          const o = -1 * (s - this._headerHeight),
            l = o + a
          let h = 0
          if ('visible' === i.position) {
            if (t > o && t + i.areaHeight < l) return !1
            h = t + i.areaHeight > l ? l - t - i.areaHeight : o - t
          } else 'top' === i.position && (h = o - t)
          return this.scroll(h, 1), this._onScroll(), !1
        }
        scrollToEnd() {
          const t = (0, r.position)(this._content).top,
            e = (0, r.outerHeight)(this._content),
            i = (0, r.outerHeight)(this._wrapper),
            s = e > i ? t + (i - (e + t)) + 1 : 1
          return this.setContentTop(s), this._onScroll(), this
        }
        scrollToStart() {
          return this.setContentTop(this._headerHeight), this._onScroll(), this
        }
        currentPosition() {
          return Math.round((0, r.position)(this._content).top)
        }
        atStart() {
          return (
            Math.round((0, r.position)(this._content).top) >= this._headerHeight
          )
        }
        atEnd(t) {
          ;('number' == typeof t && isFinite(t)) || (t = 0)
          const e = Math.round((0, r.position)(this._content).top),
            i = Math.floor((0, r.outerHeight)(this._content)),
            s = Math.floor((0, r.outerHeight)(this._wrapper))
          return i - Math.abs(e) - 1 <= s + t
        }
        checkContentVisibility() {
          this._onContentVisible()
        }
        subscribeToContentVisible(t, e, i) {
          this.visibilityCallbacks.push({ id: t, element: e, callback: i })
        }
        triggerVisibilityCallbacks(t) {
          this._onContentVisible(t)
        }
        save() {
          return (
            (this._saved = {
              top: (0, r.position)(this._content).top,
              height: (0, r.outerHeight)(this._content),
            }),
            this
          )
        }
        restore() {
          if (this._saved) {
            if (
              this._saved.top === (0, r.position)(this._content).top &&
              this._saved.height === (0, r.outerHeight)(this._content)
            )
              return (this._saved = null), this
            this._options.vAlignBottom &&
              ((this._saved.top -=
                (0, r.outerHeight)(this._content) - this._saved.height),
              this._saved.top > this._headerHeight &&
                (this._saved.top = this._headerHeight)),
              this.setContentTop(this._saved.top),
              (this._saved = null),
              this._onScroll(!0)
          }
          return this
        }
        setContentTop(t) {
          return (
            this._touch
              ? this._options.vAlignBottom &&
                (0, r.outerHeight)(this._content) <
                  (0, r.outerHeight)(this._wrapper)
                ? ((this._wrapper.style.overflowY = 'visible'),
                  (this._content.style.position = 'absolute'),
                  (this._content.style.bottom = '0px'))
                : ((this._content.style.position = 'relative'),
                  (this._content.style.position = 'auto'),
                  (this._wrapper.style.overflowY = 'auto'),
                  (this._wrapper.scrollTop = -t))
              : (this._content.style.top = t + 'px'),
            this
          )
        }
        isContentShort() {
          return (
            this.getContentHeight() <= this.getContainerHeightWithoutHeader()
          )
        }
        destroy() {
          var t
          this._animation && this._animation.stop(),
            this._scrollBarWrapper && this._scrollBarWrapper.remove(),
            this._shadowBottom && this._shadowBottom.remove(),
            this._shadowTop && this._shadowTop.remove(),
            this._draggable &&
              (this._draggable.destroy(), (this._draggable = null)),
            (this._content.style.cssText = ''),
            (this._wrapper.style.cssText = ''),
            null === (t = this._unsubscribe) || void 0 === t || t.call(this)
        }
        _onScroll(t) {
          this._touch || (this._content.style.bottom = 'auto'),
            this.scrolled.fire(),
            (this._dragging && !0 !== t) || this.updateScrollBar()
          const e = this.atStart(),
            i = this.atEnd()
          return (
            this._shadowTop &&
              this._shadowTop.classList.toggle('i-invisible', !!e),
            this._shadowBottom &&
              this._shadowBottom.classList.toggle('i-invisible', !!i),
            this._onContentVisible(),
            !this._atStart && e
              ? ((this._atStart = !0), this.scrolltostart.fire())
              : this._atStart && !e && (this._atStart = !1),
            !this._atEnd && i
              ? ((this._atEnd = !0), this.scrolltoend.fire())
              : this._atEnd && !i && (this._atEnd = !1),
            this._options.vAlignBottom &&
              (this._stickyBottom =
                (0, r.outerHeight)(this._content) -
                Math.abs((0, r.position)(this._content).top) -
                (0, r.outerHeight)(this._wrapper)),
            (this._atStart || this._atEnd) &&
              ('function' == typeof this._options.bubbleScrollEvent
                ? Boolean(this._options.bubbleScrollEvent())
                : Boolean(this._options.bubbleScrollEvent))
          )
        }
        _contentIsVisible(t) {
          return (0, r.position)(t.element).top > -1 * this.currentPosition()
        }
        _onContentVisible(t) {
          if (!this.visibilityCallbacks.length) return
          const e = t || this._contentIsVisible.bind(this),
            i = [],
            s = this.visibilityCallbacks.filter((t, s) => {
              if (!this._content.contains(t.element)) return !1
              const n = e(t)
              return n && i.push(s), !n
            })
          i.forEach((e) => {
            this.visibilityCallbacks[e].callback(!!t)
          }),
            (this.visibilityCallbacks = s)
        }
      }
      var g = i(382563)
      var p = i(247465),
        _ = i(156963),
        m = i(172419)
      function v(t) {
        return ((t) => {
          let e,
            i = 0
          if (0 === t.length) return i
          for (var s = 0; s < t.length; s++)
            (e = t.charCodeAt(s)), (i = (i << 5) - i + e), (i &= i)
          return i
        })(t.title + t.published)
      }
      var w = i(6835),
        b = i(795703)
      const f = new Set([
        '.',
        '۔',
        '܁',
        '܂',
        '…',
        '、',
        '。',
        '．',
        ',',
        ':',
        ';',
        '-',
        'ー',
        ' ',
        '(',
        ')',
      ])
      function y(t, e) {
        if (e <= 0) return t
        const i = t.length
        if (i <= e) return t
        if (i > e) {
          const i = t[e],
            s = t[e - 1]
          if (f.has(i) && !f.has(s)) return C(t, e)
        }
        let s = null
        for (let i = e - 1; i > 0; i--) {
          const e = t[i]
          if (f.has(e)) s = i
          else if (null !== s) return C(t, s)
        }
        return t + '…'
      }
      function C(t, e) {
        return t.slice(0, e) + '…'
      }
      var S = i(626800),
        L = (i(415336), i(842039), i(764153))
      const W = (0, w.getLogger)('News.Widget')
      class T {
        constructor(t) {
          ;(this.widgetName = 'widgetbar'),
            (this._newsScrollIterator = null),
            (this._newsDiffResolver = null),
            (this._updateWhenVisible = null),
            (this._pendingNewsRequest = null),
            (this._updateIntervalHandle = null),
            (this._needsFullUpdate = !0),
            (this._dataProvider = null),
            (this._resize = this.resize.bind(this)),
            (this._onSymbolChange = this.onSymbolChange.bind(this)),
            (this._quoteSymbol = null),
            (this._quoteMetaInfo = null),
            (this._symbolName = null),
            (this._bridge = t),
            (this._widgetTitle = (0, s.ensureNotNull)(
              this._bridge.header.querySelector('.widgetbar-widgettitle'),
            )),
            (this._spinner = new b.Spinner()),
            (this._container = t.container),
            this._prepareLayout(this._container)
          const e = (() => {
            if (_.enabled('charting_library_base'))
              return new m.LibraryNewsProvider()
          })()
          e && (this._dataProvider = e),
            this._bridge.symbol.subscribe(this._onSymbolChange, {
              callWithLast: !0,
            }),
            window.loginStateChange.subscribe(this, this._onLoginChange)
        }
        refresh() {
          this.update(!0)
        }
        update(t) {
          if (!this._dataProvider) return
          if (!this._bridge.visible.value())
            return void (
              null === this._updateWhenVisible &&
              ((this._updateWhenVisible = (t) => {
                t &&
                  (null !== this._updateIntervalHandle &&
                    this._setUpdateInterval(),
                  this._bridge.visible.unsubscribe(this._updateWhenVisible),
                  (this._updateWhenVisible = null),
                  this.update())
              }),
              this._bridge.visible.subscribe(this._updateWhenVisible),
              this._updateIntervalHandle &&
                clearInterval(this._updateIntervalHandle))
            )
          const e = this._quoteMetaInfo
          if (!e) return this._clear(), void this._stopLoading()
          const i = e.short_name
          ;(this._needsFullUpdate = t || i !== this._symbolName),
            (this._symbolName = i),
            this._needsFullUpdate &&
              (this._startLoading(),
              this._updateIntervalHandle &&
                clearInterval(this._updateIntervalHandle),
              this._setUpdateInterval()),
            this._pendingNewsRequest && this._pendingNewsRequest.cancel(),
            (this._pendingNewsRequest = (0, p.makeCancelable)(
              this._dataProvider.getNews(e),
            )),
            this._pendingNewsRequest.promise
              .then((t) => {
                ;(this._pendingNewsRequest = null),
                  this._stopLoading(),
                  this._setTitle(t.title),
                  this.updateData(t.newsItems)
              })
              .catch((t) => {
                if (!(0, p.isCancelled)(t))
                  throw (
                    ((this._pendingNewsRequest = null), this._stopLoading(), t)
                  )
              })
        }
        updateData(t) {
          var e
          if (t && t.length)
            if (this._needsFullUpdate) {
              this._clear(),
                (this._newsScrollIterator = ((t, e) => {
                  if (!Number.isInteger(e))
                    throw new TypeError('Chunks size must be an integer')
                  if (e <= 0)
                    throw new RangeError('Chunk size must be a positive number')
                  const i = t.slice()
                  return {
                    next() {
                      const t = i.splice(0, e)
                      return { value: t, done: !t.length }
                    },
                  }
                })(t, 20))
              const i = this._newsScrollIterator.next().value,
                s = v(i[0])
              ;(this._newsDiffResolver =
                ((e = s),
                {
                  getDiff(t) {
                    if (0 === t.length) return []
                    const i = t.findIndex((t) => v(t) === e)
                    return (e = v(t[0])), t.slice(0, -1 === i ? t.length : i)
                  },
                })),
                this._renderItems(i, !1)
            } else {
              if (!this._newsDiffResolver)
                return void W.logError(
                  'Attempt to perform partial update before full update was committed',
                )
              const e = this._newsDiffResolver.getDiff(t)
              this._renderItems(e, !0)
            }
        }
        resize() {
          this._scroll.resize()
        }
        highlight(t) {
          t.classList.add(L['news-item--highlight'])
          const e = () => {
            t.classList.remove(L['news-item--highlight']),
              t.removeEventListener('animationend', e)
          }
          t.addEventListener('animationend', e)
        }
        onSymbolChange(t) {
          if ((0, S.safeShortName)(t) === this._symbolName) return
          const e = (0, g.getQuoteSessionInstance)('full')
          if (
            (this._quoteSymbol &&
              e.unsubscribe(this._bridge.id, this._quoteSymbol),
            (this._quoteMetaInfo = null),
            !t)
          )
            return void (this._quoteSymbol = null)
          ;(this._quoteSymbol = t),
            this._needsFullUpdate && this.update(),
            this._bridge.clearNotifications()
          let i = !1
          e.subscribe(this._bridge.id, t, (s) => {
            i ||
              ('permission_denied' === s.status &&
              s.values &&
              s.values.alternative
                ? this.onSymbolChange(s.values.alternative)
                : s.values &&
                  s.values.short_name &&
                  ((this._quoteMetaInfo = {
                    pro_name: s.values.pro_name,
                    short_name: s.values.short_name,
                    type: s.values.type,
                    typespecs: s.values.typespecs,
                    exchange: s.values.exchange,
                  }),
                  this.update(),
                  (i = !0),
                  setTimeout(() => {
                    e.unsubscribe(this._bridge.id, t)
                  }, 0)))
          })
        }
        destroy() {
          this._quoteSymbol &&
            (0, g.getQuoteSessionInstance)('full').unsubscribe(
              this._bridge.id,
              this._quoteSymbol,
            ),
            this._updateIntervalHandle &&
              (clearInterval(this._updateIntervalHandle),
              (this._updateIntervalHandle = null)),
            this._scroll.scrolltoend.unsubscribe(this, this._onScrollToEnd),
            this._updateWhenVisible &&
              this._bridge.visible.unsubscribe(this._updateWhenVisible),
            this._unmountAllNewsItems(),
            this._bridge.height.unsubscribe(this._resize),
            this._bridge.visible.unsubscribe(this._resize),
            this._bridge.symbol.unsubscribe(this._onSymbolChange),
            window.loginStateChange.unsubscribe(this, this._onLoginChange)
        }
        _setTitle(t) {
          this._dataProvider && (this._widgetTitle.textContent = t)
        }
        _clear() {
          this._clearListUI(),
            this._scroll.scrolltoend.unsubscribe(this, this._onScrollToEnd),
            this._scroll.scrollToStart(),
            this._scroll.scrolltoend.subscribe(this, this._onScrollToEnd)
        }
        _prepareLayout(t) {
          this._container = t
          const e = (this._widget = document.createElement('div'))
          e.classList.add('tv-news'), this._container.appendChild(e)
          const i = (this._data = document.createElement('div'))
          i.classList.add('ns-data'),
            i.setAttribute('data-name', 'news_list'),
            e.appendChild(i),
            (this._scroll = new u(this._widget, this._data)),
            this._bridge.height.subscribe(this._resize),
            this._bridge.visible.subscribe(this._resize)
        }
        _setUpdateInterval() {
          if (!this._dataProvider) return
          const t = this._dataProvider.timeout()
          t &&
            (this._updateIntervalHandle = setInterval(
              this.update.bind(this),
              t,
            ))
        }
        _renderItems(t, e = !1) {
          if (!this._dataProvider) return
          const i = document.createDocumentFragment()
          for (const s of t) {
            const t = { ...s }
            t.shortDescription = y(s.shortDescription, 170)
            const n = this._dataProvider.renderItem(t)
            s.clickHandler && n.addEventListener('click', s.clickHandler),
              e && this.highlight(n),
              i.appendChild(n)
          }
          e ? this._data.prepend(i) : this._data.append(i)
        }
        _onScrollToEnd() {
          this._newsScrollIterator &&
            this._renderItems(this._newsScrollIterator.next().value, !1)
        }
        _onLoginChange() {
          window.is_authenticated || this.update(!0)
        }
        _startLoading() {
          this._spinner.spin(this._widget)
        }
        _stopLoading() {
          this._spinner.stop()
        }
        _clearListUI() {
          ;(this._data.innerHTML = ''), this._unmountAllNewsItems()
        }
        _unmountAllNewsItems() {
          this._dataProvider && this._dataProvider.unmountItems()
        }
      }
    },
    117105: (t) => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 21 21m0-21-21 21"/></svg>'
    },
    315130: (t) => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 15 15m0-15-15 15"/></svg>'
    },
    238822: (t) => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 11 11m0-11-11 11"/></svg>'
    },
    663346: (t) => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 9 9m0-9-9 9"/></svg>'
    },
    534983: (t) => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="10" height="10"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 7 7m0-7-7 7"/></svg>'
    },
    661380: (t) => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" width="20" height="10"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M2 1l8 8 8-8"/></svg>'
    },
    452970: (t) => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><path fill="currentColor" d="M21.34 12.13a1 1 0 0 1 .98 0l10.41 5.93a1 1 0 0 1 0 1.73l-10.4 5.93a1 1 0 0 1-.99 0L10.78 19.8a1 1 0 0 1 0-1.75l10.56-5.92Zm.49.87-10.56 5.93 10.56 5.93 10.4-5.93L21.84 13ZM33.5 24.86l-11.66 6.8L10 25l.5-.87 11.33 6.38L32.99 24l.5.87Z"/></svg>'
    },
    731503: (t) => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45"><g fill="none" stroke="currentColor"><path d="M14.5 27.5c0 4.97 3.03 8 8 8 4.97 0 8-3.03 8-8v-6a3 3 0 0 0-3-3h-10a3 3 0 0 0-3 3v6z"/><path stroke-linecap="square" d="M22.5 19v16"/><path d="M27.5 18.5a5 5 0 1 0-10 0m13 3h2a2 2 0 0 1 2 2V25m-4 2.5h2a2 2 0 0 1 2 2V31M29 32.5h1.5a2 2 0 0 1 2 2V36m-18-14.5h-2a2 2 0 0 0-2 2V25m4 2.5h-2a2 2 0 0 0-2 2V31m5.5 1.5h-1.5a2 2 0 0 0-2 2V36"/><g transform="translate(12 8)"><circle cx="2.5" cy="2.5" r="2"/><path d="M3.911 3.911L7 7"/></g><g transform="translate(26 8)"><circle cx="4.5" cy="2.5" r="2"/><path d="M3.115 3.885L0 7"/></g></g></svg>'
    },
    981132: (t) => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><path fill="currentColor" d="M16 13h-4v4h-1v-4H7v-1h4V8h1v4h4v1Zm14.5-1H19v-1h11.5a3.5 3.5 0 0 1 3.5 3.5v16a3.5 3.5 0 0 1-3.5 3.5h-17a3.5 3.5 0 0 1-3.5-3.5V20h1v10.5a2.5 2.5 0 0 0 2.5 2.5h17a2.5 2.5 0 0 0 2.5-2.5v-16a2.5 2.5 0 0 0-2.5-2.5ZM14 18.5a2.5 2.5 0 0 1 2.5-2.5h11a2.5 2.5 0 0 1 0 5h-11a2.5 2.5 0 0 1-2.5-2.5Zm2.5-1.5a1.5 1.5 0 0 0 0 3h11a1.5 1.5 0 0 0 0-3h-11ZM29 25H15v-1h14v1Zm0 4H15v-1h14v1Z"/></svg>'
    },
    178911: (t) => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><path fill="currentColor" d="M10 21.5a11.5 11.5 0 1 1 23 0 11.5 11.5 0 0 1-23 0ZM21.5 9a12.5 12.5 0 1 0 0 25 12.5 12.5 0 0 0 0-25ZM18 17c0-.87.32-1.6.9-2.13a3.78 3.78 0 0 1 2.6-.87c2.32 0 3.5 1.37 3.5 2.5 0 1.23-.8 1.96-1.8 2.7l-.27.2c-.4.3-.83.61-1.16.95-.42.42-.77.95-.77 1.65v2h1v-2c0-.32.15-.62.48-.95.27-.27.62-.52 1.01-.81l.3-.23c1-.74 2.21-1.74 2.21-3.51 0-1.87-1.82-3.5-4.5-3.5-1.35 0-2.48.4-3.27 1.13A3.8 3.8 0 0 0 17 17h1Zm4.5 11c0 .55-.46 1-1 1s-1-.45-1-1 .46-1 1-1 1 .45 1 1Zm-1 2c1.08 0 2-.9 2-2s-.92-2-2-2-2 .9-2 2 .92 2 2 2Z"/></svg>'
    },
    191085: (t) => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><path fill="currentColor" d="M13 11h18a2 2 0 0 1 2 2v17a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2V13c0-1.1.9-2 2-2Zm18-1H13a3 3 0 0 0-3 3v17a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3V13a3 3 0 0 0-3-3Zm-2 11H15v1h14v-1Zm-14-5h14v1H15v-1Zm14 10H15v1h14v-1Z"/></svg>'
    },
    768508: (t) => {
      t.exports = {
        ar: ['إغلاق'],
        ca_ES: ['Tancament'],
        cs: 'Close',
        de: 'Close',
        el: 'Close',
        en: 'Close',
        es: ['Cierre'],
        fa: 'Close',
        fr: ['Fermeture'],
        he_IL: ['סגירה'],
        hu_HU: ['Zárás'],
        id_ID: ['Tutup'],
        it: ['Chiudi'],
        ja: ['閉じる'],
        ko: ['닫기'],
        ms_MY: ['Tutup'],
        nl_NL: 'Close',
        pl: ['Zamknij'],
        pt: ['Fechar'],
        ro: 'Close',
        ru: ['Закрыть'],
        sv: 'Close',
        th: ['ปิด'],
        tr: ['Kapat'],
        vi: ['Đóng'],
        zh: ['关闭'],
        zh_TW: ['關閉'],
      }
    },
    825034: (t) => {
      t.exports = {
        ar: ['التقويم'],
        ca_ES: ['Calendari'],
        cs: ['Kalendář'],
        de: ['Kalender'],
        el: 'Calendar',
        en: 'Calendar',
        es: ['Calendario'],
        fa: 'Calendar',
        fr: ['Calendrier'],
        he_IL: ['יומן כלכלי'],
        hu_HU: ['Naptár'],
        id_ID: ['Kalender'],
        it: ['Calendario'],
        ja: ['カレンダー'],
        ko: ['달력'],
        ms_MY: ['Kalendar'],
        nl_NL: ['Kalender'],
        pl: ['Kalendarz'],
        pt: ['Calendário'],
        ro: 'Calendar',
        ru: ['Календарь'],
        sv: ['Kalender'],
        th: ['ปฏิทิน'],
        tr: ['Takvim'],
        vi: ['Lịch'],
        zh: ['日历'],
        zh_TW: ['日曆'],
      }
    },
    62313: (t) => {
      t.exports = {
        ar: ['الدردشة'],
        ca_ES: 'Chats',
        cs: 'Chats',
        de: 'Chats',
        el: 'Chats',
        en: 'Chats',
        es: 'Chats',
        fa: 'Chats',
        fr: 'Chats',
        he_IL: ["צ'אטים"],
        hu_HU: 'Chats',
        id_ID: ['Obrolan'],
        it: ['Chat'],
        ja: ['チャット'],
        ko: ['챗'],
        ms_MY: ['Sembang'],
        nl_NL: 'Chats',
        pl: ['Czaty'],
        pt: ['Bate-papos'],
        ro: 'Chats',
        ru: ['Чаты'],
        sv: ['Chattar'],
        th: ['แชท'],
        tr: ['Sohbetler'],
        vi: ['Trò chuyện'],
        zh: ['聊天'],
        zh_TW: ['聊天'],
      }
    },
    363764: (t) => {
      t.exports = {
        ar: ['تنبيهات'],
        ca_ES: ['Alertes'],
        cs: ['Upozornění'],
        de: ['Alarme'],
        el: 'Alerts',
        en: 'Alerts',
        es: ['Alertas'],
        fa: 'Alerts',
        fr: ['Alertes'],
        he_IL: ['התראות'],
        hu_HU: ['Riasztások'],
        id_ID: ['Peringatan'],
        it: ['Alert'],
        ja: ['アラート'],
        ko: ['얼러트'],
        ms_MY: ['Pemberitahuan'],
        nl_NL: ['Alarmeringen'],
        pl: ['Alerty'],
        pt: ['Alertas'],
        ro: 'Alerts',
        ru: ['Оповещения'],
        sv: ['Alarm'],
        th: ['การแจ้งเตือน'],
        tr: ['Alarmlar'],
        vi: ['Cảnh báo'],
        zh: ['警报'],
        zh_TW: ['快訊'],
      }
    },
    557027: (t) => {
      t.exports = {
        ar: ['التفاصيل'],
        ca_ES: ['Detalls'],
        cs: 'Details',
        de: 'Details',
        el: 'Details',
        en: 'Details',
        es: ['Detalles'],
        fa: 'Details',
        fr: ['Détails'],
        he_IL: ['פרטים'],
        hu_HU: ['Részletek'],
        id_ID: ['Rincian'],
        it: ['Dettagli'],
        ja: ['詳細'],
        ko: ['자세한 내역'],
        ms_MY: ['Butiran'],
        nl_NL: 'Details',
        pl: ['Szczegóły'],
        pt: ['Detalhes'],
        ro: 'Details',
        ru: ['Об инструменте'],
        sv: ['Detaljer'],
        th: ['รายละเอียด'],
        tr: ['Ayrıntılar'],
        vi: ['Thông tin chi tiết'],
        zh: ['详细资料'],
        zh_TW: ['詳細資料'],
      }
    },
    713823: (t) => {
      t.exports = {
        ar: ['جدول العوائد ومواعيدها'],
        ca_ES: ['Calendari de beneficis'],
        cs: 'Earnings Calendar',
        de: ['Earnings-Kalender'],
        el: 'Earnings Calendar',
        en: 'Earnings Calendar',
        es: ['Calendario de beneficios'],
        fa: 'Earnings Calendar',
        fr: ['Calendrier des bénéfices'],
        he_IL: ['יומן דוחות רווחי חברות'],
        hu_HU: ['Bevételi Naptár'],
        id_ID: ['Kalender Perolehan'],
        it: ['Calendario utili'],
        ja: ['決算カレンダー'],
        ko: ['실적 캘린더'],
        ms_MY: ['Kalendar Perolehan'],
        nl_NL: ['Verdiensten kalender'],
        pl: ['Kalendarz wyników'],
        pt: ['Calendário de Resultados'],
        ro: 'Earnings Calendar',
        ru: ['Календарь отчётности'],
        sv: ['Intäktskalender'],
        th: ['ปฏิทินการรายงานผลประกอบการ'],
        tr: ['Kazanç Takvimi'],
        vi: ['Lịch lợi tức'],
        zh: ['财报日历'],
        zh_TW: ['財報日曆'],
      }
    },
    570779: (t) => {
      t.exports = {
        ar: ['جدول الأعمال الاقتصادي'],
        ca_ES: ['Calendari econòmic'],
        cs: ['Ekonomický kalendář'],
        de: ['Wirtschaftskalender'],
        el: 'Economic Calendar',
        en: 'Economic Calendar',
        es: ['Calendario económico'],
        fa: 'Economic Calendar',
        fr: ['Calendrier économique'],
        he_IL: ['יומן כלכלי'],
        hu_HU: ['Gazdasági Naptár'],
        id_ID: ['Kalender Ekonomi'],
        it: ['Calendario economico'],
        ja: ['経済指標カレンダー'],
        ko: ['경제 캘린더'],
        ms_MY: ['Kalendar Ekonomi'],
        nl_NL: ['Economische kalender'],
        pl: ['Kalendarz ekonomiczny'],
        pt: ['Calendário Econômico'],
        ro: 'Economic Calendar',
        ru: ['Экономический календарь'],
        sv: ['Ekonomisk kalender'],
        th: ['ปฏิทินเศรษฐกิจ'],
        tr: ['Ekonomik Takvim'],
        vi: ['Lịch kinh tế'],
        zh: ['财经日历'],
        zh_TW: ['全球財經日曆'],
      }
    },
    20931: (t) => {
      t.exports = {
        ar: ['قائمة الرموز الشائعة'],
        ca_ES: ["Llista d'interès"],
        cs: 'Hotlist',
        de: 'Hotlist',
        el: 'Hotlist',
        en: 'Hotlist',
        es: ['Lista de interés'],
        fa: 'Hotlist',
        fr: 'Hotlist',
        he_IL: ['רשימה חמה'],
        hu_HU: ['Gyorslista'],
        id_ID: 'Hotlist',
        it: 'Hotlist',
        ja: ['ホットリスト'],
        ko: ['핫리스트'],
        ms_MY: ['Senarai Kegemaran'],
        nl_NL: 'Hotlist',
        pl: ['Lista Najpopularniejszych'],
        pt: ['Destaques do mercado'],
        ro: 'Hotlist',
        ru: ['Лидеры рынка'],
        sv: ['Topplista'],
        th: ['รายการร้อนแรง'],
        tr: ['Etkin Liste'],
        vi: ['Danh sách Nóng'],
        zh: ['热门榜'],
        zh_TW: ['熱門榜'],
      }
    },
    225669: (t) => {
      t.exports = {
        ar: ['قوائم الرموز الشائعة'],
        ca_ES: ["Llistes d'interès"],
        cs: 'Hotlists',
        de: ['Toplisten'],
        el: 'Hotlists',
        en: 'Hotlists',
        es: ['Listas de interés'],
        fa: 'Hotlists',
        fr: ['Favoris'],
        he_IL: ['רשימה חמה'],
        hu_HU: ['Gyorslisták'],
        id_ID: 'Hotlists',
        it: ['Hotlist'],
        ja: ['ホットリスト'],
        ko: ['핫리스트'],
        ms_MY: ['Senarai Utama'],
        nl_NL: 'Hotlists',
        pl: ['Listy Najpopularniejszych'],
        pt: ['Destaques'],
        ro: 'Hotlists',
        ru: ['Лидеры рынка'],
        sv: ['Topplistor'],
        th: ['รายการร้อนแรง'],
        tr: ['Etkin Listeler'],
        vi: ['Danh sách Nóng'],
        zh: ['热门榜'],
        zh_TW: ['熱門榜'],
      }
    },
    303160: (t) => {
      t.exports = {
        ar: ['العناوين الرئيسية'],
        ca_ES: ['Titulars'],
        cs: 'Headlines',
        de: ['Titelzeilen'],
        el: 'Headlines',
        en: 'Headlines',
        es: ['Titulares'],
        fa: 'Headlines',
        fr: ['A la une'],
        he_IL: ['כותרות'],
        hu_HU: ['Főcímek'],
        id_ID: ['Berita Utama'],
        it: ['Titoli'],
        ja: ['ヘッドライン'],
        ko: ['헤드라인'],
        ms_MY: ['Tajuk Utama'],
        nl_NL: 'Headlines',
        pl: ['Nagłówki'],
        pt: ['Manchetes'],
        ro: 'Headlines',
        ru: ['Новости'],
        sv: ['Rubriker'],
        th: ['พาดหัว'],
        tr: ['Haber Başlıkları'],
        vi: ['Tiêu đề'],
        zh: ['新闻提要'],
        zh_TW: ['新聞提要'],
      }
    },
    788911: (t) => {
      t.exports = {
        ar: ['مركز المساعدة'],
        ca_ES: ["Centre d'ajuda"],
        cs: ['Centrum nápovědy'],
        de: ['Hilfe Center'],
        el: 'Help Center',
        en: 'Help Center',
        es: ['Centro de ayuda'],
        fa: 'Help Center',
        fr: ["Centre d'aide"],
        he_IL: ['מרכז תמיכה'],
        hu_HU: 'Help Center',
        id_ID: ['Pusat Bantuan'],
        it: ['Centro di supporto'],
        ja: ['ヘルプセンター'],
        ko: ['헬프 센터'],
        ms_MY: ['Pusat Bantuan'],
        nl_NL: 'Help Center',
        pl: ['Centrum Pomocy'],
        pt: ['Central de Ajuda'],
        ro: 'Help Center',
        ru: ['Справочный центр'],
        sv: ['Hjälpcenter'],
        th: ['ศูนย์ช่วยเหลือ'],
        tr: ['Destek Merkezi'],
        vi: ['Trung tâm Trợ giúp'],
        zh: ['帮助中心'],
        zh_TW: ['幫助中心'],
      }
    },
    943435: (t) => {
      t.exports = {
        ar: ['إخفاء علامة تبويب'],
        ca_ES: ['Amaga pestanya'],
        cs: 'Hide Tab',
        de: ['Tab verstecken'],
        el: 'Hide Tab',
        en: 'Hide Tab',
        es: ['Ocultar pestaña'],
        fa: 'Hide Tab',
        fr: ["Cacher l'onglet"],
        he_IL: 'Hide Tab',
        hu_HU: 'Hide Tab',
        id_ID: ['Sembunyikan Tab'],
        it: ['Nascondi pannello'],
        ja: ['タブを非表示'],
        ko: ['탭 숨기기'],
        ms_MY: ['Sembunyi Tab'],
        nl_NL: 'Hide Tab',
        pl: ['Ukryj zakładkę'],
        pt: ['Ocultar aba'],
        ro: 'Hide Tab',
        ru: ['Скрыть вкладку'],
        sv: ['Dölj flik'],
        th: ['ซ่อนแถบ'],
        tr: ['Sekmeyi Gizle'],
        vi: ['Tab Ẩn'],
        zh: ['隐藏标签'],
        zh_TW: 'Hide Tab',
      }
    },
    406501: (t) => {
      t.exports = {
        ar: ['تدفق التحليلات المنشورة'],
        ca_ES: ["Transmissió d'idees"],
        cs: 'Ideas Stream',
        de: ['Ideen-Stream'],
        el: 'Ideas Stream',
        en: 'Ideas Stream',
        es: ['Transmisión de ideas'],
        fa: 'Ideas Stream',
        fr: ['Flux d’idées'],
        he_IL: ['תזרים רעיונות'],
        hu_HU: ['Ötletfolyam'],
        id_ID: ['Aliran Ide'],
        it: ['Stream idee'],
        ja: ['アイデアストリーム'],
        ko: ['아이디어스트림'],
        ms_MY: ['Aliran Idea'],
        nl_NL: 'Ideas Stream',
        pl: ['Strumień pomysłów'],
        pt: ['Central de Ideias'],
        ro: 'Ideas Stream',
        ru: ['Лента идей'],
        sv: ['Idéflöde'],
        th: ['ไอเดียสตรีม'],
        tr: ['Fikir Yayınları'],
        vi: ['Dòng Ý tưởng'],
        zh: ['观点流'],
        zh_TW: ['想法串流'],
      }
    },
    960534: (t) => {
      t.exports = {
        ar: ['شجرة كائنات. أدوات رسم متعددة الاختيارات'],
        ca_ES: ["Arbre d'objectes. Dibuixos amb selecció múltiple"],
        cs: 'Object tree. Multi-select drawings',
        de: ['Objekt Baum. Multi-Selektion von Zeichenwerkzeugen'],
        el: 'Object tree. Multi-select drawings',
        en: 'Object tree. Multi-select drawings',
        es: ['Árbol de objetos. Dibujos con selección múltiple'],
        fa: 'Object tree. Multi-select drawings',
        fr: ["Arborescence d'objets. Outils de dessin multi-sélection"],
        he_IL: ['עץ אובייקט. כלי רישום רב-בחירה'],
        hu_HU: 'Object tree. Multi-select drawings',
        id_ID: ['Pohon objek. Memilih beberapa alat gambar sekaligus.'],
        it: ['Albero oggetti. Selezione multipla disegni'],
        ja: ['オブジェクトツリー（描画の複数選択が可能）'],
        ko: ['오브젝트 트리. 멀티-셀렉트 드로잉 툴'],
        ms_MY: ['Salasilah objek. Pilih pelbagai lukisan'],
        nl_NL: 'Object tree. Multi-select drawings',
        pl: ['Drzewo obiektów. Wybierz wiele narzędzi rysowania'],
        pt: ['Árvore de objetos. Multi-seleção de ferramentas de desenho'],
        ro: ['Object tree. Multi-select drawings tools'],
        ru: ['Дерево объектов. Выбирайте несколько объектов рисования'],
        sv: ['Objektträd. Ritverktyg med flerval'],
        th: ['Object tree เลือกเครื่องมือหลายอันพร้อมกัน'],
        tr: ['Nesne ağacı. Çok-seçimli çizim araçları'],
        vi: ['Cây đối tượng. Công cụ vẽ nhiều lựa chọn'],
        zh: ['对象树。多选绘图工具'],
        zh_TW: ['物件樹。多選圖形工具'],
      }
    },
    538163: (t) => {
      t.exports = {
        ar: ['فتح علامة التبويب'],
        ca_ES: ['Obre pestanya'],
        cs: 'Open Tab',
        de: ['Tab öffnen'],
        el: 'Open Tab',
        en: 'Open Tab',
        es: ['Abrir Pestaña'],
        fa: 'Open Tab',
        fr: ["Ouvrir l'onglet"],
        he_IL: ['פתח כרטיסייה'],
        hu_HU: 'Open Tab',
        id_ID: ['Buka Tab'],
        it: ['Apri pannello'],
        ja: ['タブを開く'],
        ko: ['탭 열기'],
        ms_MY: ['Buka Tab'],
        nl_NL: 'Open Tab',
        pl: ['Otwórz zakładkę'],
        pt: ['Abrir Aba'],
        ro: 'Open Tab',
        ru: ['Открыть вкладку'],
        sv: ['Öppna flik'],
        th: ['เปิดแถบ'],
        tr: ['Sekme Aç'],
        vi: ['Mở Tab'],
        zh: ['打开标签'],
        zh_TW: ['打開頁籤'],
      }
    },
    102467: (t) => {
      t.exports = {
        ar: ['ملخص السوق'],
        ca_ES: ['Resum de mercat'],
        cs: 'Market Summary',
        de: ['Marktübersicht'],
        el: 'Market Summary',
        en: 'Market Summary',
        es: ['Resumen de mercado'],
        fa: 'Market Summary',
        fr: ['Résumé des Marchés'],
        he_IL: ['סיכום שוק'],
        hu_HU: ['Paci Összefoglaló'],
        id_ID: ['Ringkasan Pasar'],
        it: ['Sintesi mercati'],
        ja: ['マーケットサマリー'],
        ko: ['마켓요약'],
        ms_MY: ['Rumusan Pasaran'],
        nl_NL: 'Market Summary',
        pl: ['Podsumowanie rynku'],
        pt: ['Resumo do Mercado'],
        ro: 'Market Summary',
        ru: ['Обзор рынка'],
        sv: ['Marknadsöversikt'],
        th: ['สรุปภาพรวมตลาด'],
        tr: ['Piyasa Özeti'],
        vi: ['Tổng hợp Thị trường'],
        zh: ['市场一览'],
        zh_TW: ['市場概要'],
      }
    },
    137706: (t) => {
      t.exports = {
        ar: ['تحاليلي'],
        ca_ES: ['Les meves idees'],
        cs: 'My Ideas',
        de: ['Meine Ideen'],
        el: 'My Ideas',
        en: 'My Ideas',
        es: ['Mis ideas'],
        fa: 'My Ideas',
        fr: ['Mes Idées'],
        he_IL: ['הרעיונות שלי'],
        hu_HU: ['Ötleteim'],
        id_ID: ['Ide-Ide Saya'],
        it: ['Le mie idee'],
        ja: ['自分のアイデア'],
        ko: ['내아이디어'],
        ms_MY: ['Idea Saya'],
        nl_NL: 'My Ideas',
        pl: ['Moje pomysły'],
        pt: ['Minhas Ideias'],
        ro: 'My Ideas',
        ru: ['Мои идеи'],
        sv: ['Mina idéer'],
        th: ['ไอเดียของฉัน'],
        tr: ['Benim Fikirlerim'],
        vi: ['Ý tưởng của tôi'],
        zh: ['我的观点'],
        zh_TW: ['我的想法'],
      }
    },
    230163: (t) => {
      t.exports = {
        ar: ['إشعارات'],
        ca_ES: ['Notificacions'],
        cs: ['Oznámení'],
        de: ['Benachrichtigungen'],
        el: 'Notifications',
        en: 'Notifications',
        es: ['Notificaciones'],
        fa: 'Notifications',
        fr: 'Notifications',
        he_IL: ['הודעות'],
        hu_HU: ['Értesítések'],
        id_ID: ['Pemberitahuan'],
        it: ['Notifiche'],
        ja: ['通知'],
        ko: ['알림'],
        ms_MY: ['Notifikasi'],
        nl_NL: ['Meldingen'],
        pl: ['Powiadomienia'],
        pt: ['Notificações'],
        ro: 'Notifications',
        ru: ['Уведомления'],
        sv: ['Notifikationer'],
        th: ['การแจ้งเตือน'],
        tr: ['Bildirimler'],
        vi: ['Thông báo'],
        zh: ['通知'],
        zh_TW: ['通知'],
      }
    },
    923278: (t) => {
      t.exports = {
        ar: ['الأخبار'],
        ca_ES: ['Notícies'],
        cs: 'News',
        de: ['Nachrichten'],
        el: 'News',
        en: 'News',
        es: ['Noticias'],
        fa: 'News',
        fr: ['Actualités'],
        he_IL: ['חדשות'],
        hu_HU: ['Hírek'],
        id_ID: ['Berita'],
        it: ['Notizie'],
        ja: ['ニュース'],
        ko: ['뉴스'],
        ms_MY: ['Berita'],
        nl_NL: ['Nieuws'],
        pl: ['Wiadomości'],
        pt: ['Notícias'],
        ro: 'News',
        ru: ['Новости'],
        sv: ['Nyheter'],
        th: ['ข่าว'],
        tr: ['Haberler'],
        vi: ['Tin tức'],
        zh: ['新闻'],
        zh_TW: ['新聞'],
      }
    },
    912997: (t) => {
      t.exports = {
        ar: ['التواصل الاجتماعي'],
        ca_ES: 'Social',
        cs: 'Social',
        de: 'Social',
        el: 'Social',
        en: 'Social',
        es: 'Social',
        fa: 'Social',
        fr: 'Social',
        he_IL: ['חברתי'],
        hu_HU: ['Közösségi'],
        id_ID: ['Sosial'],
        it: 'Social',
        ja: ['SNS'],
        ko: ['소셜'],
        ms_MY: ['Sosial'],
        nl_NL: ['Sociaal'],
        pl: ['Społeczność'],
        pt: 'Social',
        ro: 'Social',
        ru: ['Социальная сеть'],
        sv: ['Socialt'],
        th: ['โซเชียล'],
        tr: ['Sosyal'],
        vi: ['Xã hội'],
        zh: ['社交'],
        zh_TW: ['社交'],
      }
    },
    495824: (t) => {
      t.exports = {
        ar: ['إظهار عناصر الرسم البياني'],
        ca_ES: ["Mostra arbre d'objectes"],
        cs: 'Show Object tree',
        de: ['Objektbaum anzeigen'],
        el: 'Show Object tree',
        en: 'Show Object tree',
        es: ['Mostrar árbol de objetos'],
        fa: 'Show Object tree',
        fr: ["Afficher l'arborescence des objets"],
        he_IL: ['הצג עץ אובייקטים'],
        hu_HU: 'Show Object tree',
        id_ID: ['Tampilkan Pohon Objek'],
        it: ['Mostra albero oggetti'],
        ja: ['オブジェクトツリーを表示'],
        ko: ['오브젝트 트리 보기'],
        ms_MY: ['Tunjuk Salasilah Objek'],
        nl_NL: 'Show Object tree',
        pl: ['Pokaż drzewo obiektów'],
        pt: ['Mostrar Lista de Objetos'],
        ro: 'Show Object tree',
        ru: ['Показать дерево объектов'],
        sv: ['Visa objektträd'],
        th: ['แสดงแผนผังวัตถุ'],
        tr: ['Nesnelerin Ağacını Göster'],
        vi: ['Hiện Danh sách đối tượng'],
        zh: ['显示对象树'],
        zh_TW: ['顯示物件樹'],
      }
    },
    841888: (t) => {
      t.exports = {
        ar: ['البث'],
        ca_ES: 'Streams',
        cs: 'Streams',
        de: 'Streams',
        el: 'Streams',
        en: 'Streams',
        es: 'Streams',
        fa: 'Streams',
        fr: 'Streams',
        he_IL: ['סטרימים Streams'],
        hu_HU: 'Streams',
        id_ID: ['Stream'],
        it: ['Dirette'],
        ja: ['配信'],
        ko: ['스트림'],
        ms_MY: ['Strim'],
        nl_NL: 'Streams',
        pl: ['Streamy'],
        pt: 'Streams',
        ro: 'Streams',
        ru: ['Трансляции'],
        sv: ['Flöden'],
        th: ['สตรีม'],
        tr: ['Yayınlar'],
        vi: ['Phát sóng'],
        zh: ['直播'],
        zh_TW: ['直播'],
      }
    },
    665298: (t) => {
      t.exports = {
        ar: ['سجلات Pine'],
        ca_ES: 'Pine Logs',
        cs: 'Pine Logs',
        de: ['Pine-Protokolle'],
        el: 'Pine Logs',
        en: 'Pine Logs',
        es: ['Registros de Pine'],
        fa: 'Pine Logs',
        fr: ['Pine logs'],
        he_IL: ['יומני Pine'],
        hu_HU: 'Pine Logs',
        id_ID: ['Log Pine'],
        it: ['Log di Pine'],
        ja: ['Pineログ'],
        ko: ['파인 로그'],
        ms_MY: ['Log Pine'],
        nl_NL: 'Pine Logs',
        pl: ['Logi Pine'],
        pt: ['Logs do Pine'],
        ro: 'Pine Logs',
        ru: ['Логи Pine'],
        sv: ['Pineloggar'],
        th: 'Pine Logs',
        tr: ['Pine Günlükleri'],
        vi: ['Nhật ký Pine'],
        zh: ['脚本日志'],
        zh_TW: ['腳本日誌'],
      }
    },
    639434: (t) => {
      t.exports = {
        ar: ['سجلات Pine'],
        ca_ES: 'Pine logs',
        cs: 'Pine logs',
        de: ['Pine-Protokolle'],
        el: 'Pine logs',
        en: 'Pine logs',
        es: ['Registros de Pine'],
        fa: 'Pine logs',
        fr: 'Pine logs',
        he_IL: ['יומני Pine'],
        hu_HU: 'Pine logs',
        id_ID: ['Log Pine'],
        it: ['Log di Pine'],
        ja: ['Pineログ'],
        ko: ['파인 로그'],
        ms_MY: ['Log Pine'],
        nl_NL: 'Pine logs',
        pl: ['Logi Pine'],
        pt: ['Logs do Pine'],
        ro: 'Pine logs',
        ru: ['Логи Pine'],
        sv: ['Pineloggar'],
        th: 'Pine logs',
        tr: ['Pine günlükleri'],
        vi: ['Nhật ký Pine'],
        zh: ['脚本日志'],
        zh_TW: ['腳本日誌'],
      }
    },
    687351: (t) => {
      t.exports = {
        ar: ['قائمة المراقبة والتفاصيل'],
        ca_ES: ['Llista de seguiment i informació'],
        cs: 'Watchlist and details',
        de: ['Watchlist und Details'],
        el: 'Watchlist and details',
        en: 'Watchlist and details',
        es: ['Lista de seguimiento e información'],
        fa: 'Watchlist and details',
        fr: ['Liste de surveillance et détails'],
        he_IL: ['רשימת מעקב ופרטים'],
        hu_HU: 'Watchlist and details',
        id_ID: ['Daftar pantau dan rincian'],
        it: ['Watchlist e dettagli'],
        ja: ['ウォッチリストと詳細'],
        ko: ['왓치리스트 및 디테일'],
        ms_MY: ['Senarai pantau dan perincian'],
        nl_NL: 'Watchlist and details',
        pl: ['Lista obserwowanych i szczegóły'],
        pt: ['Lista de observação e detalhes'],
        ro: 'Watchlist and details',
        ru: ['Список котировок и информация'],
        sv: ['Bevakningslista och detaljer'],
        th: ['รายการเฝ้าติดตาม และรายละเอียด'],
        tr: ['İzleme Listesi ve ayrıntılar'],
        vi: ['Danh sách theo dõi và chi tiết'],
        zh: ['观察清单和详情'],
        zh_TW: ['觀察清單和詳情'],
      }
    },
    334422: (t) => {
      t.exports = {
        ar: ['قائمة المراقبة والتفاصيل والأخبار'],
        ca_ES: ['Llista de seguiment, detalls i notícies'],
        cs: 'Watchlist and details and news',
        de: ['Watchlist und Details und Nachrichten'],
        el: 'Watchlist and details and news',
        en: 'Watchlist and details and news',
        es: ['Lista de seguimiento, detalles y noticias'],
        fa: 'Watchlist and details and news',
        fr: ['Liste de surveillance, détails et actualités'],
        he_IL: ['רשימת מעקב ופרטים וחדשות'],
        hu_HU: 'Watchlist and details and news',
        id_ID: ['Daftar pantau dan detailnya serta berita'],
        it: ['Watchlist, dettagli e notizie'],
        ja: ['ウォッチリストと詳細、ニュース'],
        ko: ['와치리스트와 세부 항목 및 뉴스'],
        ms_MY: ['Senarai amatan dan perincian dan berita'],
        nl_NL: 'Watchlist and details and news',
        pl: ['Lista obserwowanych, szczegóły i wiadomości'],
        pt: ['Lista de observação e detalhes e notícias'],
        ro: 'Watchlist and details and news',
        ru: ['Списки котировок, подробная информация и новости'],
        sv: ['Bevakningslista, detaljer och nyheter'],
        th: ['รายการที่เฝ้าติดตาม รายละเอียดและข่าวสาร'],
        tr: ['İzleme listesi ve detaylar ve haberler'],
        vi: ['Danh sách theo dõi; thông tin chi tiết và tin tức'],
        zh: ['自选表、详情和新闻'],
        zh_TW: ['觀察清單、詳細資料和新聞'],
      }
    },
    785719: (t) => {
      t.exports = {
        ar: ['قائمة المراقبة والأخبار'],
        ca_ES: ['Lista de seguiment i notícies'],
        cs: 'Watchlist and news',
        de: ['Watchlist und Nachrichten'],
        el: 'Watchlist and news',
        en: 'Watchlist and news',
        es: ['Lista de seguimiento y noticias'],
        fa: 'Watchlist and news',
        fr: ['Liste de surveillance et actualités'],
        he_IL: ['רשימת מעקב וחדשות'],
        hu_HU: 'Watchlist and news',
        id_ID: ['Daftar pantau dan berita'],
        it: ['Watchlist e notizie'],
        ja: ['ウォッチリストとニュース'],
        ko: ['와치리스트와 뉴스'],
        ms_MY: ['Senarai amatan dan berita'],
        nl_NL: 'Watchlist and news',
        pl: ['Lista obserwowanych i wiadomości'],
        pt: ['Lista de Observação e notícias'],
        ro: 'Watchlist and news',
        ru: ['Списки котировок и новости'],
        sv: ['Bevakningslista och nyheter'],
        th: ['รายการที่เฝ้าติดตามและข่าวสาร'],
        tr: ['İzleme listesi ve haberler'],
        vi: ['Danh sách theo dõi và tin tức'],
        zh: ['自选表和新闻'],
        zh_TW: ['觀察清單和新聞'],
      }
    },
    855102: (t) => {
      t.exports = {
        ar: ['قائمة متابعة، التفاصيل والأخبار'],
        ca_ES: ['Llista de seguiment, detalls i notícies'],
        cs: 'Watchlist, details and news',
        de: ['Watchlist, Details und Nachrichten'],
        el: 'Watchlist, details and news',
        en: 'Watchlist, details and news',
        es: ['Lista de seguimiento, detalles y noticias'],
        fa: 'Watchlist, details and news',
        fr: ['Liste de surveillance, détails et nouvelles'],
        he_IL: ['רשימות מעקב, פרטים וחדשות'],
        hu_HU: ['Figyelőlista, részletek és hírek'],
        id_ID: ['Daftar Pantau, rincian dan berita'],
        it: ['Watchlist, dettagli e notizie'],
        ja: ['ウォッチリスト、詳細、ニュース'],
        ko: ['왓치리스트, 세부내역 및 뉴스'],
        ms_MY: ['Senarai Amatan, butiran dan berita'],
        nl_NL: ['Volglijst, details en nieuws'],
        pl: ['Lista Obserwowanych, szczegóły i nowości'],
        pt: ['Lista de observação, detalhes e novidades'],
        ro: 'Watchlist, details and news',
        ru: ['Котировки, информация и новости'],
        sv: ['Bevakningslista, detaljer och nyheter'],
        th: ['รายการที่ติดตาม, รายละเอียด และข่าวสาร'],
        tr: ['İzleme listesi, ayrıntılar ve haberler'],
        vi: ['Danh sách theo dõi, thông tin chi tiết và tin tức'],
        zh: ['自选表、详情和新闻'],
        zh_TW: ['觀察清單、詳情和新聞'],
      }
    },
    819065: (t) => {
      t.exports = {
        ar: ['أداة'],
        ca_ES: 'Widget',
        cs: 'Widget',
        de: 'Widget',
        el: 'Widget',
        en: 'Widget',
        es: 'Widget',
        fa: 'Widget',
        fr: 'Widget',
        he_IL: ["וידג'ט"],
        hu_HU: 'Widget',
        id_ID: 'Widget',
        it: 'Widget',
        ja: ['ウィジェット'],
        ko: ['위젯'],
        ms_MY: 'Widget',
        nl_NL: 'Widget',
        pl: ['Widżet'],
        pt: ['Plataforma'],
        ro: 'Widget',
        ru: ['Виджет'],
        sv: 'Widget',
        th: ['วิดเจ็ต'],
        tr: 'Widget',
        vi: 'Widget',
        zh: ['插件'],
        zh_TW: 'Widget',
      }
    },
  },
])
