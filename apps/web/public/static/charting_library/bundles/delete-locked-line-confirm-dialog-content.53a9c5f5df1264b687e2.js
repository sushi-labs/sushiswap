;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4598],
  {
    97754: (e, t) => {
      var r
      !(() => {
        var n = {}.hasOwnProperty
        function o() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var r = arguments[t]
            if (r) {
              var s = typeof r
              if ('string' === s || 'number' === s) e.push(r)
              else if (Array.isArray(r) && r.length) {
                var a = o.apply(null, r)
                a && e.push(a)
              } else if ('object' === s)
                for (var i in r) n.call(r, i) && r[i] && e.push(i)
            }
          }
          return e.join(' ')
        }
        e.exports
          ? ((o.default = o), (e.exports = o))
          : void 0 === (r = (() => o).apply(t, [])) || (e.exports = r)
      })()
    },
    11362: (e) => {
      e.exports = {
        wrapper: 'wrapper-GZajBGIm',
        input: 'input-GZajBGIm',
        view: 'view-GZajBGIm',
        danger: 'danger-GZajBGIm',
      }
    },
    4052: (e) => {
      e.exports = {
        box: 'box-ywH2tsV_',
        noOutline: 'noOutline-ywH2tsV_',
        disabled: 'disabled-ywH2tsV_',
        'intent-danger': 'intent-danger-ywH2tsV_',
        checked: 'checked-ywH2tsV_',
        check: 'check-ywH2tsV_',
        icon: 'icon-ywH2tsV_',
        dot: 'dot-ywH2tsV_',
        disableActiveStyles: 'disableActiveStyles-ywH2tsV_',
      }
    },
    65592: (e) => {
      e.exports = {
        checkbox: 'checkbox-vyj6oJxw',
        reverse: 'reverse-vyj6oJxw',
        label: 'label-vyj6oJxw',
        baseline: 'baseline-vyj6oJxw',
      }
    },
    73903: (e) => {
      e.exports = { checkbox: 'checkbox-WcA5vXoU' }
    },
    70673: (e, t, r) => {
      r.d(t, { CheckboxInput: () => c })
      var n = r(50959),
        o = r(97754),
        s = r(90186),
        a = r(5811),
        i = r(11362),
        u = r.n(i)
      function c(e) {
        const t = o(u().wrapper, e.className)
        return n.createElement(
          'span',
          { className: t, title: e.title, style: e.style },
          n.createElement('input', {
            id: e.id,
            tabIndex: e.tabIndex,
            className: o(e.intent && u()[e.intent], u().input),
            type: 'checkbox',
            name: e.name,
            checked: e.checked,
            disabled: e.disabled,
            value: e.value,
            autoFocus: e.autoFocus,
            role: e.role,
            onChange: () => {
              e.onChange?.(e.value)
            },
            ref: e.reference,
            'aria-required': e['aria-required'],
            'aria-describedby': e['aria-describedby'],
            'aria-invalid': e['aria-invalid'],
            ...(0, s.filterDataProps)(e),
          }),
          n.createElement(a.CheckboxView, {
            className: u().view,
            indeterminate: e.indeterminate,
            checked: e.checked,
            disabled: e.disabled,
            intent: e.intent,
            tabIndex: e.tabIndex,
          }),
        )
      }
    },
    5811: (e, t, r) => {
      r.d(t, { CheckboxView: () => c })
      var n = r(50959),
        o = r(97754),
        s = r(9745),
        a = r(65890),
        i = r(4052),
        u = r.n(i)
      function c(e) {
        const {
            indeterminate: t,
            checked: r,
            tabIndex: i,
            className: c,
            disabled: l,
            disableActiveStyles: f,
            intent: p,
            hideIcon: d,
            ...h
          } = e,
          b = t || !r || d ? '' : a,
          y = o(
            u().box,
            u()[`intent-${p}`],
            !t && u().check,
            !!t && u().dot,
            -1 === i && u().noOutline,
            c,
            r && u().checked,
            l && u().disabled,
            f && u().disableActiveStyles,
          )
        return n.createElement(
          'span',
          { className: y, ...h },
          n.createElement(s.Icon, { icon: b, className: u().icon }),
        )
      }
    },
    15294: (e, t, r) => {
      r.d(t, { Checkbox: () => c })
      var n = r(50959),
        o = r(97754),
        s = r(59416),
        a = r(70673),
        i = r(65592),
        u = r.n(i)
      class c extends n.PureComponent {
        render() {
          const { inputClassName: e, labelClassName: t, ...r } = this.props,
            s = o(this.props.className, u().checkbox, {
              [u().reverse]: Boolean(this.props.labelPositionReverse),
              [u().baseline]: Boolean(this.props.labelAlignBaseline),
            }),
            i = o(u().label, t, { [u().disabled]: this.props.disabled })
          let c = null
          return (
            this.props.label &&
              (c = n.createElement(
                'span',
                { className: i, title: this.props.title },
                this.props.label,
              )),
            n.createElement(
              'label',
              { className: s },
              n.createElement(a.CheckboxInput, { ...r, className: e }),
              c,
            )
          )
        }
      }
      c.defaultProps = { value: 'on' }
      ;(0, s.makeSwitchGroupItem)(c)
      r(5811)
    },
    9745: (e, t, r) => {
      r.d(t, { Icon: () => o })
      var n = r(50959)
      const o = n.forwardRef((e, t) => {
        const {
            icon: r = '',
            title: o,
            ariaLabel: s,
            ariaLabelledby: a,
            ariaHidden: i,
            ...u
          } = e,
          c = !!(o || s || a)
        return n.createElement('span', {
          role: 'img',
          ...u,
          ref: t,
          'aria-label': s,
          'aria-labelledby': a,
          'aria-hidden': i || !c,
          title: o,
          dangerouslySetInnerHTML: { __html: r },
        })
      })
    },
    59416: (e, t, r) => {
      r.d(t, { SwitchGroup: () => a, makeSwitchGroupItem: () => i })
      var n = r(50959),
        o = r(55883)
      const s = (0, n.createContext)({
        getName: () => '',
        getValues: () => [],
        getOnChange: () => o.default,
        subscribe: o.default,
        unsubscribe: o.default,
      })
      class a extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._subscriptions = new Set()),
            (this._getName = () => this.props.name),
            (this._getValues = () => this.props.values),
            (this._getOnChange = () => this.props.onChange),
            (this._subscribe = (e) => {
              this._subscriptions.add(e)
            }),
            (this._unsubscribe = (e) => {
              this._subscriptions.delete(e)
            }),
            (this.state = {
              switchGroupContext: {
                getName: this._getName,
                getValues: this._getValues,
                getOnChange: this._getOnChange,
                subscribe: this._subscribe,
                unsubscribe: this._unsubscribe,
              },
            })
        }
        render() {
          return n.createElement(
            s.Provider,
            { value: this.state.switchGroupContext },
            this.props.children,
          )
        }
        componentDidUpdate(e) {
          this._notify(this._getUpdates(this.props.values, e.values))
        }
        _notify(e) {
          this._subscriptions.forEach((t) => t(e))
        }
        _getUpdates(e, t) {
          return [...t, ...e].filter((r) =>
            t.includes(r) ? !e.includes(r) : e.includes(r),
          )
        }
      }
      function i(e) {
        var t
        return (
          (t = class extends n.PureComponent {
            constructor() {
              super(...arguments),
                (this._onChange = (e) => {
                  this.context.getOnChange()(e)
                }),
                (this._onUpdate = (e) => {
                  e.includes(this.props.value) && this.forceUpdate()
                })
            }
            componentDidMount() {
              this.context.subscribe(this._onUpdate)
            }
            render() {
              return n.createElement(e, {
                ...this.props,
                name: this._getName(),
                onChange: this._onChange,
                checked: this._isChecked(),
              })
            }
            componentWillUnmount() {
              this.context.unsubscribe(this._onUpdate)
            }
            _getName() {
              return this.context.getName()
            }
            _isChecked() {
              return this.context.getValues().includes(this.props.value)
            }
          }),
          (t.contextType = s),
          t
        )
      }
    },
    90186: (e, t, r) => {
      function n(e) {
        return s(e, a)
      }
      function o(e) {
        return s(e, i)
      }
      function s(e, t) {
        const r = Object.entries(e).filter(t),
          n = {}
        for (const [e, t] of r) n[e] = t
        return n
      }
      function a(e) {
        const [t, r] = e
        return 0 === t.indexOf('data-') && 'string' == typeof r
      }
      function i(e) {
        return 0 === e[0].indexOf('aria-')
      }
      r.d(t, {
        filterAriaProps: () => o,
        filterDataProps: () => n,
        filterProps: () => s,
        isAriaAttribute: () => i,
        isDataAttribute: () => a,
      })
    },
    43982: (e, t, r) => {
      r.d(t, { useProperty: () => o })
      var n = r(50959)
      const o = (e) => {
        const [t, r] = (0, n.useState)(e.value())
        return (
          (0, n.useEffect)(() => {
            const t = (e) => {
              r(e.value())
            }
            t(e)
            const n = {}
            return e.subscribe(n, t), () => e.unsubscribe(n, t)
          }, [e]),
          t
        )
      }
    },
    95257: (e, t) => {
      var r = Symbol.for('react.element'),
        n = Symbol.for('react.portal'),
        o = Symbol.for('react.fragment'),
        s = Symbol.for('react.strict_mode'),
        a = Symbol.for('react.profiler'),
        i = Symbol.for('react.provider'),
        u = Symbol.for('react.context'),
        c = Symbol.for('react.forward_ref'),
        l = Symbol.for('react.suspense'),
        f = Symbol.for('react.memo'),
        p = Symbol.for('react.lazy'),
        d = Symbol.iterator
      var h = {
          isMounted: () => !1,
          enqueueForceUpdate: () => {},
          enqueueReplaceState: () => {},
          enqueueSetState: () => {},
        },
        b = Object.assign,
        y = {}
      function m(e, t, r) {
        ;(this.props = e),
          (this.context = t),
          (this.refs = y),
          (this.updater = r || h)
      }
      function v() {}
      function _(e, t, r) {
        ;(this.props = e),
          (this.context = t),
          (this.refs = y),
          (this.updater = r || h)
      }
      ;(m.prototype.isReactComponent = {}),
        (m.prototype.setState = function (e, t) {
          if ('object' != typeof e && 'function' != typeof e && null != e)
            throw Error(
              'setState(...): takes an object of state variables to update or a function which returns an object of state variables.',
            )
          this.updater.enqueueSetState(this, e, t, 'setState')
        }),
        (m.prototype.forceUpdate = function (e) {
          this.updater.enqueueForceUpdate(this, e, 'forceUpdate')
        }),
        (v.prototype = m.prototype)
      var g = (_.prototype = new v())
      ;(g.constructor = _), b(g, m.prototype), (g.isPureReactComponent = !0)
      var w = Array.isArray,
        x = Object.prototype.hasOwnProperty,
        k = { current: null },
        C = { key: !0, ref: !0, __self: !0, __source: !0 }
      function S(e, t, n) {
        var o,
          s = {},
          a = null,
          i = null
        if (null != t)
          for (o in (void 0 !== t.ref && (i = t.ref),
          void 0 !== t.key && (a = '' + t.key),
          t))
            x.call(t, o) && !Object.hasOwn(C, o) && (s[o] = t[o])
        var u = arguments.length - 2
        if (1 === u) s.children = n
        else if (1 < u) {
          for (var c = Array(u), l = 0; l < u; l++) c[l] = arguments[l + 2]
          s.children = c
        }
        if (e && e.defaultProps)
          for (o in (u = e.defaultProps)) void 0 === s[o] && (s[o] = u[o])
        return {
          $$typeof: r,
          type: e,
          key: a,
          ref: i,
          props: s,
          _owner: k.current,
        }
      }
      function E(e) {
        return 'object' == typeof e && null !== e && e.$$typeof === r
      }
      var N = /\/+/g
      function j(e, t) {
        return 'object' == typeof e && null !== e && null != e.key
          ? ((e) => {
              var t = { '=': '=0', ':': '=2' }
              return '$' + e.replace(/[=:]/g, (e) => t[e])
            })('' + e.key)
          : t.toString(36)
      }
      function I(e, t, o, s, a) {
        var i = typeof e
        ;('undefined' !== i && 'boolean' !== i) || (e = null)
        var u = !1
        if (null === e) u = !0
        else
          switch (i) {
            case 'string':
            case 'number':
              u = !0
              break
            case 'object':
              switch (e.$$typeof) {
                case r:
                case n:
                  u = !0
              }
          }
        if (u)
          return (
            (a = a((u = e))),
            (e = '' === s ? '.' + j(u, 0) : s),
            w(a)
              ? ((o = ''),
                null != e && (o = e.replace(N, '$&/') + '/'),
                I(a, t, o, '', (e) => e))
              : null != a &&
                (E(a) &&
                  (a = ((e, t) => ({
                    $$typeof: r,
                    type: e.type,
                    key: t,
                    ref: e.ref,
                    props: e.props,
                    _owner: e._owner,
                  }))(
                    a,
                    o +
                      (!a.key || (u && u.key === a.key)
                        ? ''
                        : ('' + a.key).replace(N, '$&/') + '/') +
                      e,
                  )),
                t.push(a)),
            1
          )
        if (((u = 0), (s = '' === s ? '.' : s + ':'), w(e)))
          for (var c = 0; c < e.length; c++) {
            var l = s + j((i = e[c]), c)
            u += I(i, t, o, l, a)
          }
        else if (
          ((l = ((e) =>
            null === e || 'object' != typeof e
              ? null
              : 'function' == typeof (e = (d && e[d]) || e['@@iterator'])
                ? e
                : null)(e)),
          'function' == typeof l)
        )
          for (e = l.call(e), c = 0; !(i = e.next()).done; )
            u += I((i = i.value), t, o, (l = s + j(i, c++)), a)
        else if ('object' === i)
          throw (
            ((t = String(e)),
            Error(
              'Objects are not valid as a React child (found: ' +
                ('[object Object]' === t
                  ? 'object with keys {' + Object.keys(e).join(', ') + '}'
                  : t) +
                '). If you meant to render a collection of children, use an array instead.',
            ))
          )
        return u
      }
      function P(e, t, r) {
        if (null == e) return e
        var n = [],
          o = 0
        return I(e, n, '', '', (e) => t.call(r, e, o++)), n
      }
      function O(e) {
        if (-1 === e._status) {
          var t = e._result
          ;(t = t()).then(
            (t) => {
              ;(0 !== e._status && -1 !== e._status) ||
                ((e._status = 1), (e._result = t))
            },
            (t) => {
              ;(0 !== e._status && -1 !== e._status) ||
                ((e._status = 2), (e._result = t))
            },
          ),
            -1 === e._status && ((e._status = 0), (e._result = t))
        }
        if (1 === e._status) return e._result.default
        throw e._result
      }
      var R = { current: null },
        V = { transition: null },
        $ = {
          ReactCurrentDispatcher: R,
          ReactCurrentBatchConfig: V,
          ReactCurrentOwner: k,
        }
      ;(t.Children = {
        map: P,
        forEach: (e, t, r) => {
          P(
            e,
            function () {
              t.apply(this, arguments)
            },
            r,
          )
        },
        count: (e) => {
          var t = 0
          return (
            P(e, () => {
              t++
            }),
            t
          )
        },
        toArray: (e) => P(e, (e) => e) || [],
        only: (e) => {
          if (!E(e))
            throw Error(
              'React.Children.only expected to receive a single React element child.',
            )
          return e
        },
      }),
        (t.Component = m),
        (t.Fragment = o),
        (t.Profiler = a),
        (t.PureComponent = _),
        (t.StrictMode = s),
        (t.Suspense = l),
        (t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = $),
        (t.cloneElement = (e, t, n) => {
          if (null == e)
            throw Error(
              'React.cloneElement(...): The argument must be a React element, but you passed ' +
                e +
                '.',
            )
          var o = b({}, e.props),
            s = e.key,
            a = e.ref,
            i = e._owner
          if (null != t) {
            if (
              (void 0 !== t.ref && ((a = t.ref), (i = k.current)),
              void 0 !== t.key && (s = '' + t.key),
              e.type && e.type.defaultProps)
            )
              var u = e.type.defaultProps
            for (c in t)
              x.call(t, c) &&
                !Object.hasOwn(C, c) &&
                (o[c] = void 0 === t[c] && void 0 !== u ? u[c] : t[c])
          }
          var c = arguments.length - 2
          if (1 === c) o.children = n
          else if (1 < c) {
            u = Array(c)
            for (var l = 0; l < c; l++) u[l] = arguments[l + 2]
            o.children = u
          }
          return {
            $$typeof: r,
            type: e.type,
            key: s,
            ref: a,
            props: o,
            _owner: i,
          }
        }),
        (t.createContext = (e) => (
          ((e = {
            $$typeof: u,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
            _defaultValue: null,
            _globalName: null,
          }).Provider = { $$typeof: i, _context: e }),
          (e.Consumer = e)
        )),
        (t.createElement = S),
        (t.createFactory = (e) => {
          var t = S.bind(null, e)
          return (t.type = e), t
        }),
        (t.createRef = () => ({ current: null })),
        (t.forwardRef = (e) => ({ $$typeof: c, render: e })),
        (t.isValidElement = E),
        (t.lazy = (e) => ({
          $$typeof: p,
          _payload: { _status: -1, _result: e },
          _init: O,
        })),
        (t.memo = (e, t) => ({
          $$typeof: f,
          type: e,
          compare: void 0 === t ? null : t,
        })),
        (t.startTransition = (e) => {
          var t = V.transition
          V.transition = {}
          try {
            e()
          } finally {
            V.transition = t
          }
        }),
        (t.unstable_act = () => {
          throw Error(
            'act(...) is not supported in production builds of React.',
          )
        }),
        (t.useCallback = (e, t) => R.current.useCallback(e, t)),
        (t.useContext = (e) => R.current.useContext(e)),
        (t.useDebugValue = () => {}),
        (t.useDeferredValue = (e) => R.current.useDeferredValue(e)),
        (t.useEffect = (e, t) => R.current.useEffect(e, t)),
        (t.useId = () => R.current.useId()),
        (t.useImperativeHandle = (e, t, r) =>
          R.current.useImperativeHandle(e, t, r)),
        (t.useInsertionEffect = (e, t) => R.current.useInsertionEffect(e, t)),
        (t.useLayoutEffect = (e, t) => R.current.useLayoutEffect(e, t)),
        (t.useMemo = (e, t) => R.current.useMemo(e, t)),
        (t.useReducer = (e, t, r) => R.current.useReducer(e, t, r)),
        (t.useRef = (e) => R.current.useRef(e)),
        (t.useState = (e) => R.current.useState(e)),
        (t.useSyncExternalStore = (e, t, r) =>
          R.current.useSyncExternalStore(e, t, r)),
        (t.useTransition = () => R.current.useTransition()),
        (t.version = '18.2.0')
    },
    50959: (e, t, r) => {
      e.exports = r(95257)
    },
    27215: (e) => {
      e.exports = { description: 'description-CQ7tC6Wp' }
    },
    20307: (e, t, r) => {
      r.r(t), r.d(t, { getContent: () => h })
      var n = r(50959),
        o = r(7029),
        s = r(11542),
        a = r(15294),
        i = r(73903)
      function u(e) {
        return n.createElement(a.Checkbox, {
          checked: e.checked,
          onChange: e.onChange,
          label: e.label || s.t(null, void 0, r(27328)),
          className: i.checkbox,
        })
      }
      var c = r(43982),
        l = r(69293)
      function f() {
        const e = (0, c.useProperty)(l.doNotShowDeleteLockedLineConfirmProperty)
        return n.createElement(u, {
          checked: e,
          onChange: () => {
            l.doNotShowDeleteLockedLineConfirmProperty.setValue(!e)
          },
          label: o.t(null, void 0, r(27328)),
        })
      }
      var p = r(27215)
      function d(e) {
        const { text: t } = e
        return n.createElement(
          n.Fragment,
          null,
          n.createElement('p', { className: p.description }, t),
          n.createElement(f, null),
        )
      }
      function h(e) {
        return n.createElement(d, { text: e })
      }
    },
    65890: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke="currentColor" stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>'
    },
    55883: (e, t, r) => {
      r.d(t, { default: () => n })
      const n = () => {}
    },
  },
])
