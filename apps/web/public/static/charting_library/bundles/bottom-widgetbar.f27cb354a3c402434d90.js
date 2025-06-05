;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4193],
  {
    904585: (t) => {
      t.exports = {}
    },
    174924: (t) => {
      t.exports = {
        'css-value-chart-controls-bar-height': '38px',
        'css-value-chart-controls-bar-border': '1px',
        'css-value-chart-controls-bar-height-with-border': '39px',
      }
    },
    165719: (t) => {
      t.exports = {}
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
    496818: (t, e, i) => {
      i.d(e, { Draggable: () => o, PointerBackend: () => h })
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
              const h =
                'x' === this._axis || !1 === this._axis || 0 !== i.movementY
              if (h) {
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
                  h &&
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
            (this._backend = new h({
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
      class h {
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
    306643: (t, e, i) => {
      i.r(e), i.d(e, { Bottomwidgetbar: () => c })
      var s = i(650151),
        n = i(650802),
        a = i(870122),
        r = i(116719),
        o = i(955613),
        h = i(821205),
        l = i(496818),
        d = i(174924)
      i(904585)
      const g = Number.parseInt(
        d['css-value-chart-controls-bar-height-with-border'],
      )
      class c {
        constructor(t, e) {
          ;(this._draggable = null),
            (this._inited = !1),
            (this._widgetContents = new WeakMap()),
            (this._minHeight = 30),
            (this._paddingTop = r.footerWidgetHeight),
            (this.open = () => {
              'minimized' === this._mode.value() &&
                this._mode.setValue('normal')
            }),
            (this.close = () => {
              this._mode.setValue('minimized')
            }),
            (this.toggleMaximize = () => {
              switch (this._mode.value()) {
                case 'minimized':
                case 'normal':
                  this._trackResizeClick('maximize', 'on'),
                    this._mode.setValue('maximized')
                  break
                case 'maximized':
                  this._trackResizeClick('maximize', 'off'),
                    this._mode.setValue('normal')
              }
            }),
            (this.toggleMinimize = () => {
              switch (this._mode.value()) {
                case 'minimized':
                  this._trackResizeClick('show'), this.open()
                  break
                case 'normal':
                case 'maximized':
                  this._trackResizeClick('hide'), this.close()
              }
            }),
            (this._mode = new n.WatchedValue()),
            (this._isOverlap = new n.WatchedValue()),
            (this._isVisible = new n.WatchedValue()),
            (this._activeWidget = new n.WatchedValue()),
            (this._widgets = {}),
            (this._widgetsProperties = {}),
            (this._normalHeight = new n.WatchedValue()),
            (this._actualHeight = new n.WatchedValue()),
            (this._userSettings = e),
            (this._options = t || {}),
            (this._config = t.config),
            (this._enabledWidgets = ((t && t.widgets) || []).filter(
              (t) => t && Boolean(this._config[t]),
            )),
            this._init(t)
        }
        activeWidget() {
          return this._activeWidget.readonly()
        }
        footerWidgetContainer() {
          return this._footerWidgetContainer
        }
        toggleWidget(t, e, i) {
          return new Promise((s) => {
            'boolean' == typeof t
              ? t
                ? this.open()
                : this.close()
              : this.isWidgetEnabled(t) &&
                (e
                  ? this.open()
                  : this.activeWidget().value() === t &&
                      'minimized' !== this.mode().value()
                    ? this.close()
                    : i || this.open(),
                this._activeWidget.setValue(t)),
              s()
          })
        }
        getWidgetByName(t) {
          return this._widgets[t] || null
        }
        mode() {
          return this._mode.readonly()
        }
        isOverlap() {
          return this._isOverlap.readonly()
        }
        setNormalHeight(t) {
          this._normalHeight.setValue(t)
        }
        destroy() {
          this._draggable &&
            (this._draggable.destroy(), (this._draggable = null))
        }
        isWidgetEnabled(t) {
          return this._enabledWidgets.includes(t)
        }
        activateTradingTab() {
          return this.toggleWidget('paper_trading', !0).then(() => {
            const t = this.getWidgetByName('paper_trading')
            t && t.activate && t.activate()
          })
        }
        activateScriptEditorTab(t, e) {
          this.toggleWidget('scripteditor', !0).then(() => {
            const i = this._config.scripteditor
            i && i.ctor.open(t, e)
          })
        }
        turnOffMaximize() {
          'maximized' === this._mode.value() && this.toggleMaximize()
        }
        enabledWidgets() {
          return this._enabledWidgets.map((t) => this._config[t])
        }
        activeWidgetName() {
          return this._activeWidget.value()
        }
        isVisible() {
          return this._isVisible.readonly()
        }
        _init(t) {
          if (!this._enabledWidgets.length || this._inited) return
          this._createLayout(this._options.resizerBridge.container.value())
          const e = () => {
              let t = 0
              switch (this._mode.value()) {
                case 'normal':
                  t = this._normalHeight.value()
                  break
                case 'maximized':
                  t = this._resizerAvailHeight()
              }
              const e = {
                min: Math.min(
                  this._getPaddingBoxHeight(t),
                  this._getPaddingBoxHeight(this._minHeight),
                ),
                max: this._getPaddingBoxHeight(t),
              }
              this._options.resizerBridge.negotiateHeight(e)
            },
            i = () => {
              var i
              const a = this._activeWidget.value()
              if ('minimized' !== this._mode.value()) {
                let e
                if (
                  (this._container.classList.remove('js-hidden'),
                  (this._container.style.height =
                    this._actualHeight.value() + 'px'),
                  Array.from(
                    this._container.querySelectorAll(
                      '.bottom-widgetbar-content',
                    ),
                    (t) => {
                      t.classList.add('js-hidden')
                    },
                  ),
                  Object.keys(this._widgets).forEach((t) => {
                    if (t === a) return
                    const e = this._widgets[t]
                    e && e.hide && e.hide()
                  }),
                  this._widgets[a])
                ) {
                  const t = this._widgets[a]
                  t &&
                    this._widgetContents.has(t) &&
                    ((e = (0, s.ensureDefined)(this._widgetContents.get(t))),
                    e.classList.remove('js-hidden'),
                    t.show && t.show())
                } else {
                  ;(e = document.createElement('div')),
                    (e.className = 'bottom-widgetbar-content ' + a),
                    this._container.append(e),
                    this._initWidgetProperties(a)
                  const i = new n.WatchedValue()
                  this._activeWidget.subscribe(
                    (t) => {
                      i.setValue(t === a)
                    },
                    { callWithLast: !0 },
                  )
                  const s = () => {
                      this.toggleWidget(a, !0)
                    },
                    r = this._config[a]
                  if (r) {
                    const n = r.ctor
                    this._widgets[a] = new n({
                      container: e,
                      bottomAreaContainer: this._container,
                      height: this._actualHeight.readonly(),
                      width: this._options.resizerBridge.width,
                      bottomToolbarMode: this.mode(),
                      visible: i.readonly(),
                      properties: this._widgetsProperties[a],
                      activate: s,
                      close: () => this.close(),
                      chartWidgetCollection: t.chartWidgetCollection || null,
                      originalStandalone: 'screener' === a,
                      backtestingStrategyDispatcher:
                        this._options.backtestingStrategyDispatcher,
                      studyMarket: this._options.studyMarket,
                    })
                  }
                  const o = this._widgets[a]
                  o &&
                    (this._widgetContents.set(o, e),
                    o.disabled &&
                      o.disabled.subscribe((t) => {
                        this._loadingOverlay.classList.toggle('js-hidden', !t)
                      }))
                }
              } else {
                const t = this._widgets[a]
                t &&
                  this._widgetContents.has(t) &&
                  (null === (i = this._widgetContents.get(t)) ||
                    void 0 === i ||
                    i.classList.add('js-hidden'))
              }
              this._normalHeight.unsubscribe(e),
                this._normalHeight.subscribe(e),
                this._mode.unsubscribe(e),
                this._mode.subscribe(e),
                this._options.resizerBridge.availHeight.unsubscribe(e),
                this._options.resizerBridge.availHeight.subscribe(e),
                e(),
                this._save()
            }
          this._mode.subscribe(i),
            this._activeWidget.subscribe(i),
            this._normalHeight.subscribe(() => {
              this._save()
            }),
            this._mode.subscribe(() => {
              this._save()
            }),
            this._options.resizerBridge.height.subscribe(
              () => {
                const t = this._options.resizerBridge.height.value(),
                  e = Math.max(this._getContentBoxHeight(t), 1)
                ;(this._container.style.height = e + 'px'),
                  this._actualHeight.setValue(e)
              },
              { callWithLast: !0 },
            )
          const { mode: a } = this._userSettings
          this._mode.setValue(a),
            this._registerWidgets(),
            this._loadState(),
            this._subscribeCheckOverlap(),
            this._subscribeVisibility(),
            (this._inited = !0)
        }
        _getContentBoxHeight(t) {
          return t - this._paddingTop
        }
        _getPaddingBoxHeight(t) {
          return t + this._paddingTop
        }
        _subscribeCheckOverlap() {
          this._checkOverlap(),
            this._actualHeight.subscribe(() => {
              this._checkOverlap()
            }),
            this._mode.subscribe(() => {
              this._checkOverlap()
            }),
            this._options.resizerBridge.availHeight.subscribe(() => {
              this._checkOverlap()
            })
        }
        _updateVisibility() {
          this._isVisible.setValue(this._options.resizerBridge.visible.value())
        }
        _subscribeVisibility() {
          this._updateVisibility(),
            this._options.resizerBridge.visible.subscribe(() => {
              this._updateVisibility()
            })
        }
        _createLayout(t) {
          ;(t.innerHTML = ''),
            (this._footerWidgetContainer = document.createElement('div')),
            (this._footerWidgetContainer.style.height =
              r.footerWidgetHeight + 'px'),
            t.append(this._footerWidgetContainer),
            (this._container = document.createElement('div')),
            (this._container.id = 'bottom-area'),
            t.append(this._container)
          const e = document.createElement('div')
          ;(e.className = 'bottom-widgetbar-handle'),
            this._container.append(e),
            e.addEventListener('contextmenu', (t) => {
              t.preventDefault()
            })
          let i = null
          ;(this._draggable = new l.PointerBackend({
            handle: e,
            onDragStart: (t) => {
              const e = this._mode.value(),
                s = this._normalHeight.value(),
                n =
                  'minimized' === this._mode.value()
                    ? 0
                    : (0, h.contentHeight)(this._container)
              i = { startMode: e, lastNormalHeight: s, startHeight: n }
            },
            onDragMove: (t) => {
              if (null === i) return
              const { startHeight: e } = i,
                { initial: s, current: n } = t.detail
              let a,
                r = e - (n.pageY - s.pageY)
              r <= 0 ? ((r = e), (a = !0)) : (a = !1),
                (r = Math.max(r, this._minHeight)),
                isFinite(r) &&
                  (('minimized' === this._mode.value()) !== a
                    ? a
                      ? (this._mode.setValue('minimized'),
                        this.setNormalHeight(Math.max(e, this._minHeight)))
                      : (this._mode.setValue('normal'), this.setNormalHeight(r))
                    : this._normalHeight.value() !== r &&
                      (r >=
                      this._getContentBoxHeight(this._resizerAvailHeight())
                        ? (this._mode.setValue('maximized'),
                          this.setNormalHeight(e))
                        : (this._mode.setValue('normal'),
                          this.setNormalHeight(r))))
            },
            onDragStop: () => {
              if (null === i) return
              const { lastNormalHeight: t, startMode: e } = i
              ;(i = null),
                t > 0 &&
                  'normal' !== this._mode.value() &&
                  'normal' !== e &&
                  this.setNormalHeight(t),
                this._save()
            },
          })),
            (this._loadingOverlay = document.createElement('div')),
            (this._loadingOverlay.className =
              'bottom-widgetbar-loading-overlay js-hidden'),
            this._container.append(this._loadingOverlay)
        }
        _checkOverlap() {
          const t = this._getPaddingBoxHeight(this._actualHeight.value()),
            e = this._mode.value()
          this._isOverlap.setValue(
            'maximized' === e ||
              ('normal' === e && this._resizerAvailHeight() - t <= 300 + g),
          )
        }
        _resizerAvailHeight() {
          return this._options.resizerBridge.availHeight.value()
        }
        _initWidgetProperties(t) {
          const e = 'bottom' + t + 'widget',
            i = new n.WatchedValue(a.getJSON(e, null))
          i.subscribe((t) => {
            t ? a.setJSON(e, t) : a.remove(e)
          }),
            (this._widgetsProperties[t] = i)
        }
        _loadState() {
          const t = this._userSettings
          this._activeWidget.setValue(
            this.isWidgetEnabled(t.activeWidget)
              ? t.activeWidget
              : this._enabledWidgets[0],
          ),
            this.setNormalHeight(Math.max(t.height, this._minHeight))
        }
        _save() {
          this._inited &&
            (0, o.setUserSettings)({
              activeWidget: this._activeWidget.value(),
              height: this._normalHeight.value(),
              mode: this._mode.value(),
            })
        }
        _registerWidgets() {
          this._enabledWidgets.forEach((t) => {
            const e = this._config[t]
            if (!e || 'function' != typeof e.onRegister) return
            e.onRegister.call(null, {
              name: t,
              bottomToolbarMode: this._mode,
              activate: () => {
                this.toggleWidget(t, !0)
              },
            })
          })
        }
        _trackResizeClick(t, e) {
          0
        }
      }
    },
  },
])
