;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3999],
  {
    56057: (e) => {
      e.exports = {
        logo: 'logo-PsAlMQQF',
        hidden: 'hidden-PsAlMQQF',
        xxceptionallysmalldonotusebrv1023:
          'xxceptionallysmalldonotusebrv1023-PsAlMQQF',
        xxxsmall: 'xxxsmall-PsAlMQQF',
        xxsmall: 'xxsmall-PsAlMQQF',
        xsmall: 'xsmall-PsAlMQQF',
        small: 'small-PsAlMQQF',
        medium: 'medium-PsAlMQQF',
        large: 'large-PsAlMQQF',
        xlarge: 'xlarge-PsAlMQQF',
        xxlarge: 'xxlarge-PsAlMQQF',
        xxxlarge: 'xxxlarge-PsAlMQQF',
        skeleton: 'skeleton-PsAlMQQF',
        letter: 'letter-PsAlMQQF',
      }
    },
    55679: (e) => {
      e.exports = {
        wrapper: 'wrapper-TJ9ObuLF',
        animated: 'animated-TJ9ObuLF',
        pulsation: 'pulsation-TJ9ObuLF',
      }
    },
    96108: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': '(max-width: 768px)',
        'small-height-breakpoint': '(max-height: 360px)',
        'tablet-small-breakpoint': '(max-width: 440px)',
      }
    },
    13996: (e) => {
      e.exports = {
        emoji: 'emoji-BsERGcZ1',
        clearButton: 'clearButton-BsERGcZ1',
      }
    },
    80859: (e) => {
      e.exports = { wrapper: 'wrapper-mz0866M2', hovered: 'hovered-mz0866M2' }
    },
    39453: (e) => {
      e.exports = {
        emojiWrap: 'emojiWrap-R2CTpmHr',
        emoji: 'emoji-R2CTpmHr',
        tooltipEmoji: 'tooltipEmoji-R2CTpmHr',
        tooltipEmojiWrap: 'tooltipEmojiWrap-R2CTpmHr',
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
    9059: (e) => {
      e.exports = {
        'tablet-small-breakpoint': '(max-width: 440px)',
        item: 'item-jFqVJoPk',
        hovered: 'hovered-jFqVJoPk',
        isDisabled: 'isDisabled-jFqVJoPk',
        isActive: 'isActive-jFqVJoPk',
        shortcut: 'shortcut-jFqVJoPk',
        toolbox: 'toolbox-jFqVJoPk',
        withIcon: 'withIcon-jFqVJoPk',
        'round-icon': 'round-icon-jFqVJoPk',
        icon: 'icon-jFqVJoPk',
        labelRow: 'labelRow-jFqVJoPk',
        label: 'label-jFqVJoPk',
        showOnHover: 'showOnHover-jFqVJoPk',
        'disclosure-item-circle-logo': 'disclosure-item-circle-logo-jFqVJoPk',
        showOnFocus: 'showOnFocus-jFqVJoPk',
      }
    },
    35990: (e) => {
      e.exports = {
        button: 'button-iLKiGOdQ',
        hovered: 'hovered-iLKiGOdQ',
        disabled: 'disabled-iLKiGOdQ',
        focused: 'focused-iLKiGOdQ',
        active: 'active-iLKiGOdQ',
        hidden: 'hidden-iLKiGOdQ',
      }
    },
    53885: (e, t, n) => {
      n.d(t, { getStyleClasses: () => i, isCircleLogoWithUrlProps: () => c })
      var o = n(97754),
        r = n(52292),
        l = n(56057),
        a = n.n(l)
      function i(e, t = 2, n) {
        return o(
          a().logo,
          a()[e],
          n,
          0 === t || 1 === t
            ? o(r.skeletonTheme.wrapper, a().skeleton)
            : a().letter,
          1 === t && r.skeletonTheme.animated,
        )
      }
      function c(e) {
        return (
          'logoUrl' in e &&
          null !== e.logoUrl &&
          void 0 !== e.logoUrl &&
          0 !== e.logoUrl.length
        )
      }
    },
    39416: (e, t, n) => {
      n.d(t, { useFunctionalRefObject: () => l })
      var o = n(50959),
        r = n(43010)
      function l(e) {
        const t = (0, o.useMemo)(
            () =>
              ((e) => {
                const t = (n) => {
                  e(n), (t.current = n)
                }
                return (t.current = null), t
              })((e) => {
                i.current(e)
              }),
            [],
          ),
          n = (0, o.useRef)(null),
          l = (t) => {
            if (null === t) return a(n.current, t), void (n.current = null)
            n.current !== e && ((n.current = e), a(n.current, t))
          },
          i = (0, o.useRef)(l)
        return (
          (i.current = l),
          (0, r.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return i.current(t.current), () => i.current(null)
          }, [e]),
          t
        )
      }
      function a(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t))
      }
    },
    27267: (e, t, n) => {
      function o(e, t, n, o, r) {
        function l(r) {
          if (e > r.timeStamp) return
          const l = r.target
          void 0 !== n &&
            null !== t &&
            null !== l &&
            l.ownerDocument === o &&
            (t.contains(l) || n(r))
        }
        return (
          r.click && o.addEventListener('click', l, !1),
          r.mouseDown && o.addEventListener('mousedown', l, !1),
          r.touchEnd && o.addEventListener('touchend', l, !1),
          r.touchStart && o.addEventListener('touchstart', l, !1),
          () => {
            o.removeEventListener('click', l, !1),
              o.removeEventListener('mousedown', l, !1),
              o.removeEventListener('touchend', l, !1),
              o.removeEventListener('touchstart', l, !1)
          }
        )
      }
      n.d(t, { addOutsideEventListener: () => o })
    },
    52292: (e, t, n) => {
      n.d(t, { skeletonTheme: () => r })
      var o = n(55679)
      const r = o
    },
    90186: (e, t, n) => {
      function o(e) {
        return l(e, a)
      }
      function r(e) {
        return l(e, i)
      }
      function l(e, t) {
        const n = Object.entries(e).filter(t),
          o = {}
        for (const [e, t] of n) o[e] = t
        return o
      }
      function a(e) {
        const [t, n] = e
        return 0 === t.indexOf('data-') && 'string' == typeof n
      }
      function i(e) {
        return 0 === e[0].indexOf('aria-')
      }
      n.d(t, {
        filterAriaProps: () => r,
        filterDataProps: () => o,
        filterProps: () => l,
        isAriaAttribute: () => i,
        isDataAttribute: () => a,
      })
    },
    47201: (e, t, n) => {
      function o(...e) {
        return (t) => {
          for (const n of e) void 0 !== n && n(t)
        }
      }
      n.d(t, { createSafeMulticastEventHandler: () => o })
    },
    24437: (e, t, n) => {
      n.d(t, { DialogBreakpoints: () => r })
      var o = n(96108)
      const r = {
        SmallHeight: o['small-height-breakpoint'],
        TabletSmall: o['tablet-small-breakpoint'],
        TabletNormal: o['tablet-normal-breakpoint'],
      }
    },
    74670: (e, t, n) => {
      n.d(t, { useActiveDescendant: () => l })
      var o = n(50959),
        r = n(39416)
      function l(e, t = []) {
        const [n, l] = (0, o.useState)(!1),
          a = (0, r.useFunctionalRefObject)(e)
        return (
          (0, o.useLayoutEffect)(() => {
            const e = a.current
            if (null === e) return
            const t = (e) => {
              switch (e.type) {
                case 'active-descendant-focus':
                  l(!0)
                  break
                case 'active-descendant-blur':
                  l(!1)
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
          [a, n]
        )
      }
    },
    50238: (e, t, n) => {
      n.d(t, { useRovingTabindexElement: () => l })
      var o = n(50959),
        r = n(39416)
      function l(e, t = []) {
        const [n, l] = (0, o.useState)(!1),
          a = (0, r.useFunctionalRefObject)(e)
        return (
          (0, o.useLayoutEffect)(() => {
            const e = a.current
            if (null === e) return
            const t = (e) => {
              switch (e.type) {
                case 'roving-tabindex:main-element':
                  l(!0)
                  break
                case 'roving-tabindex:secondary-element':
                  l(!1)
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
          [a, n ? 0 : -1]
        )
      }
    },
    59695: (e, t, n) => {
      n.d(t, { CircleLogo: () => i, hiddenCircleLogoClass: () => a })
      var o = n(50959),
        r = n(53885),
        l = n(56057)
      const a = n.n(l)().hidden
      function i(e) {
        const t = (0, r.isCircleLogoWithUrlProps)(e),
          [n, l] = (0, o.useState)(0),
          a = (0, o.useRef)(null),
          i = (0, r.getStyleClasses)(e.size, n, e.className),
          c = e.alt ?? e.title ?? '',
          s = t ? c[0] : e.placeholderLetter
        return (
          (0, o.useEffect)(() => l((a.current?.complete ?? !t) ? 2 : 1), [t]),
          t && 3 !== n
            ? o.createElement('img', {
                ref: a,
                className: i,
                crossOrigin: '',
                src: e.logoUrl,
                alt: c,
                title: e.title,
                loading: e.loading,
                onLoad: () => l(2),
                onError: () => l(3),
                'aria-label': e['aria-label'],
                'aria-hidden': e['aria-hidden'],
              })
            : o.createElement(
                'span',
                {
                  className: i,
                  title: e.title,
                  'aria-label': e['aria-label'],
                  'aria-hidden': e['aria-hidden'],
                },
                s,
              )
        )
      }
    },
    88160: (e, t, n) => {
      n.d(t, { EMPTY_EMOJI: () => o })
      const o = ''
    },
    173: (e, t, n) => {
      n.d(t, {
        emojiGroups: () => T,
        isSupportedEmoji: () => A,
        localeCompareEmojiTitles: () => y,
        removeUnavailableEmoji: () => k,
        separateEmoji: () => F,
      })
      var o = n(50959),
        r = n(11542),
        l = n(91682),
        a = n(50151),
        i = n(99616),
        c = n(37603),
        s = n(32386),
        u = n(1759),
        m = n(5474),
        d = n(92177),
        v = n(83137),
        h = n(86209),
        p = n(14082),
        g = n(93826)
      const f = [
          '😀',
          '😃',
          '😄',
          '😁',
          '😆',
          '😅',
          '😂',
          '🤣',
          '☺️',
          '😊',
          '😇',
          '🙂',
          '🙃',
          '😉',
          '😌',
          '😍',
          '🥰',
          '😘',
          '😗',
          '😙',
          '😚',
          '😋',
          '😛',
          '😝',
          '😜',
          '🤪',
          '🤨',
          '🧐',
          '🤓',
          '😎',
          '🤩',
          '🥳',
          '😏',
          '😒',
          '😞',
          '😔',
          '😟',
          '😕',
          '🙁',
          '☹️',
          '😣',
          '😖',
          '😫',
          '😩',
          '🥺',
          '😢',
          '😭',
          '😤',
          '😠',
          '😡',
          '🤬',
          '🤯',
          '😳',
          '🥵',
          '🥶',
          '😱',
          '😨',
          '😰',
          '😥',
          '😓',
          '🤗',
          '🤔',
          '🤭',
          '🤫',
          '🤥',
          '😶',
          '😐',
          '😑',
          '😬',
          '🙄',
          '😯',
          '😦',
          '😧',
          '😮',
          '😲',
          '🥱',
          '😴',
          '🤤',
          '😪',
          '😵',
          '🤐',
          '🥴',
          '🤢',
          '🤮',
          '🤧',
          '😷',
          '🤒',
          '🤕',
          '🤑',
          '🤠',
          '😈',
          '👿',
          '👹',
          '👺',
          '🤡',
          '💩',
          '👻',
          '💀',
          '☠️',
          '👽',
          '👾',
          '🤖',
          '🎃',
          '😺',
          '😸',
          '😹',
          '😻',
          '😼',
          '😽',
          '🙀',
          '😿',
          '😾',
          '👋',
          '🤚',
          '🖐',
          '✋',
          '🖖',
          '👌',
          '🤏',
          '✌️',
          '🤞',
          '🤟',
          '🤘',
          '🤙',
          '👈',
          '👉',
          '👆',
          '🖕',
          '👇',
          '☝️',
          '👍',
          '👎',
          '✊',
          '👊',
          '🤛',
          '🤜',
          '👏',
          '🙌',
          '👐',
          '🤲',
          '🤝',
          '🙏',
          '✍️',
          '💅',
          '🤳',
          '💪',
          '🦾',
          '🦵',
          '🦿',
          '🦶',
          '👂',
          '🦻',
          '👃',
          '🧠',
          '🦷',
          '🦴',
          '👀',
          '👁',
          '👅',
          '👄',
          '💋',
          '🩸',
          '👶',
          '🧒',
          '👦',
          '👧',
          '🧑',
          '👱',
          '👨',
          '🧔',
          '👨‍🦰',
          '👨‍🦱',
          '👨‍🦳',
          '👨‍🦲',
          '👩',
          '👩‍🦰',
          '🧑‍🦰',
          '👩‍🦱',
          '🧑‍🦱',
          '👩‍🦳',
          '🧑‍🦳',
          '👩‍🦲',
          '🧑‍🦲',
          '👱‍♀️',
          '👱‍♂️',
          '🧓',
          '👴',
          '👵',
          '🙍',
          '🙍‍♂️',
          '🙍‍♀️',
          '🙎',
          '🙎‍♂️',
          '🙎‍♀️',
          '🙅',
          '🙅‍♂️',
          '🙅‍♀️',
          '🙆',
          '🙆‍♂️',
          '🙆‍♀️',
          '💁',
          '💁‍♂️',
          '💁‍♀️',
          '🙋',
          '🙋‍♂️',
          '🙋‍♀️',
          '🧏',
          '🧏‍♂️',
          '🧏‍♀️',
          '🙇',
          '🙇‍♂️',
          '🙇‍♀️',
          '🤦',
          '🤦‍♂️',
          '🤦‍♀️',
          '🤷',
          '🤷‍♂️',
          '🤷‍♀️',
          '🧑‍⚕️',
          '👨‍⚕️',
          '👩‍⚕️',
          '🧑‍🎓',
          '👨‍🎓',
          '👩‍🎓',
          '🧑‍🏫',
          '👨‍🏫',
          '👩‍🏫',
          '🧑‍⚖️',
          '👨‍⚖️',
          '👩‍⚖️',
          '🧑‍🌾',
          '👨‍🌾',
          '👩‍🌾',
          '🧑‍🍳',
          '👨‍🍳',
          '👩‍🍳',
          '🧑‍🔧',
          '👨‍🔧',
          '👩‍🔧',
          '🧑‍🏭',
          '👨‍🏭',
          '👩‍🏭',
          '🧑‍💼',
          '👨‍💼',
          '👩‍💼',
          '🧑‍🔬',
          '👨‍🔬',
          '👩‍🔬',
          '🧑‍💻',
          '👨‍💻',
          '👩‍💻',
          '🧑‍🎤',
          '👨‍🎤',
          '👩‍🎤',
          '🧑‍🎨',
          '👨‍🎨',
          '👩‍🎨',
          '🧑‍✈️',
          '👨‍✈️',
          '👩‍✈️',
          '🧑‍🚀',
          '👨‍🚀',
          '👩‍🚀',
          '🧑‍🚒',
          '👨‍🚒',
          '👩‍🚒',
          '👮',
          '👮‍♂️',
          '👮‍♀️',
          '🕵',
          '🕵️‍♂️',
          '🕵️‍♀️',
          '💂',
          '💂‍♂️',
          '💂‍♀️',
          '👷',
          '👷‍♂️',
          '👷‍♀️',
          '🤴',
          '👸',
          '👳',
          '👳‍♂️',
          '👳‍♀️',
          '👲',
          '🧕',
          '🤵',
          '👰',
          '🤰',
          '🤱',
          '👼',
          '🎅',
          '🤶',
          '🦸',
          '🦸‍♂️',
          '🦸‍♀️',
          '🦹',
          '🦹‍♂️',
          '🦹‍♀️',
          '🧙',
          '🧙‍♂️',
          '🧙‍♀️',
          '🧚',
          '🧚‍♂️',
          '🧚‍♀️',
          '🧛',
          '🧛‍♂️',
          '🧛‍♀️',
          '🧜',
          '🧜‍♂️',
          '🧜‍♀️',
          '🧝',
          '🧝‍♂️',
          '🧝‍♀️',
          '🧞',
          '🧞‍♂️',
          '🧞‍♀️',
          '🧟',
          '🧟‍♂️',
          '🧟‍♀️',
          '💆',
          '💆‍♂️',
          '💆‍♀️',
          '💇',
          '💇‍♂️',
          '💇‍♀️',
          '🚶',
          '🚶‍♂️',
          '🚶‍♀️',
          '🧍',
          '🧍‍♂️',
          '🧍‍♀️',
          '🧎',
          '🧎‍♂️',
          '🧎‍♀️',
          '🧑‍🦯',
          '👨‍🦯',
          '👩‍🦯',
          '🧑‍🦼',
          '👨‍🦼',
          '👩‍🦼',
          '🧑‍🦽',
          '👨‍🦽',
          '👩‍🦽',
          '🏃',
          '🏃‍♂️',
          '🏃‍♀️',
          '💃',
          '🕺',
          '🕴',
          '👯',
          '👯‍♂️',
          '👯‍♀️',
          '🧖',
          '🧖‍♂️',
          '🧖‍♀️',
          '🧑‍🤝‍🧑',
          '👭',
          '👫',
          '👬',
          '💏',
          '👨‍❤️‍💋‍👨',
          '👩‍❤️‍💋‍👩',
          '💑',
          '👨‍❤️‍👨',
          '👩‍❤️‍👩',
          '👪',
          '👨‍👩‍👦',
          '👨‍👩‍👧',
          '👨‍👩‍👧‍👦',
          '👨‍👩‍👦‍👦',
          '👨‍👩‍👧‍👧',
          '👨‍👨‍👦',
          '👨‍👨‍👧',
          '👨‍👨‍👧‍👦',
          '👨‍👨‍👦‍👦',
          '👨‍👨‍👧‍👧',
          '👩‍👩‍👦',
          '👩‍👩‍👧',
          '👩‍👩‍👧‍👦',
          '👩‍👩‍👦‍👦',
          '👩‍👩‍👧‍👧',
          '👨‍👦',
          '👨‍👦‍👦',
          '👨‍👧',
          '👨‍👧‍👦',
          '👨‍👧‍👧',
          '👩‍👦',
          '👩‍👦‍👦',
          '👩‍👧',
          '👩‍👧‍👦',
          '👩‍👧‍👧',
          '🗣',
          '👤',
          '👥',
          '👣',
        ],
        x = [
          '🐶',
          '🐱',
          '🐭',
          '🐹',
          '🐰',
          '🦊',
          '🐻',
          '🐼',
          '🐨',
          '🐯',
          '🦁',
          '🐮',
          '🐷',
          '🐽',
          '🐸',
          '🐵',
          '🙈',
          '🙉',
          '🙊',
          '🐒',
          '🐔',
          '🐧',
          '🐦',
          '🐤',
          '🐣',
          '🐥',
          '🦆',
          '🦅',
          '🦉',
          '🦇',
          '🐺',
          '🐗',
          '🐴',
          '🦄',
          '🐝',
          '🐛',
          '🦋',
          '🐌',
          '🐞',
          '🐜',
          '🦟',
          '🦗',
          '🕷',
          '🕸',
          '🦂',
          '🐢',
          '🐍',
          '🦎',
          '🦖',
          '🦕',
          '🐙',
          '🦑',
          '🦐',
          '🦞',
          '🦀',
          '🐡',
          '🐠',
          '🐟',
          '🐬',
          '🐳',
          '🐋',
          '🦈',
          '🐊',
          '🐅',
          '🐆',
          '🦓',
          '🦍',
          '🦧',
          '🐘',
          '🦛',
          '🦏',
          '🐪',
          '🐫',
          '🦒',
          '🦘',
          '🐃',
          '🐂',
          '🐄',
          '🐎',
          '🐖',
          '🐏',
          '🐑',
          '🦙',
          '🐐',
          '🦌',
          '🐕',
          '🐩',
          '🦮',
          '🐕‍🦺',
          '🐈',
          '🐓',
          '🦃',
          '🦚',
          '🦜',
          '🦢',
          '🦩',
          '🕊',
          '🐇',
          '🦝',
          '🦨',
          '🦡',
          '🦦',
          '🦥',
          '🐁',
          '🐀',
          '🐿',
          '🦔',
          '🐾',
          '🐉',
          '🐲',
          '🌵',
          '🎄',
          '🌲',
          '🌳',
          '🌴',
          '🌱',
          '🌿',
          '☘️',
          '🍀',
          '🎍',
          '🎋',
          '🍃',
          '🍂',
          '🍁',
          '🍄',
          '🐚',
          '🌾',
          '💐',
          '🌷',
          '🌹',
          '🥀',
          '🌺',
          '🌸',
          '🌼',
          '🌻',
          '🌞',
          '🌝',
          '🌛',
          '🌜',
          '🌚',
          '🌕',
          '🌖',
          '🌗',
          '🌘',
          '🌑',
          '🌒',
          '🌓',
          '🌔',
          '🌙',
          '🌎',
          '🌍',
          '🌏',
          '🪐',
          '💫',
          '⭐️',
          '🌟',
          '✨',
          '⚡️',
          '☄️',
          '💥',
          '🔥',
          '🌪',
          '🌈',
          '☀️',
          '🌤',
          '⛅️',
          '🌥',
          '☁️',
          '🌦',
          '🌧',
          '⛈',
          '🌩',
          '🌨',
          '❄️',
          '☃️',
          '⛄️',
          '🌬',
          '💨',
          '💧',
          '💦',
          '☔️',
          '🌊',
          '🌫',
        ],
        E = [
          '🍏',
          '🍎',
          '🍐',
          '🍊',
          '🍋',
          '🍌',
          '🍉',
          '🍇',
          '🍓',
          '🍈',
          '🍒',
          '🍑',
          '🥭',
          '🍍',
          '🥥',
          '🥝',
          '🍅',
          '🍆',
          '🥑',
          '🥦',
          '🥬',
          '🥒',
          '🌶',
          '🌽',
          '🥕',
          '🧄',
          '🧅',
          '🥔',
          '🍠',
          '🥐',
          '🥯',
          '🍞',
          '🥖',
          '🥨',
          '🧀',
          '🥚',
          '🍳',
          '🧈',
          '🥞',
          '🧇',
          '🥓',
          '🥩',
          '🍗',
          '🍖',
          '🌭',
          '🍔',
          '🍟',
          '🍕',
          '🥪',
          '🥙',
          '🧆',
          '🌮',
          '🌯',
          '🥗',
          '🥘',
          '🥫',
          '🍝',
          '🍜',
          '🍲',
          '🍛',
          '🍣',
          '🍱',
          '🥟',
          '🦪',
          '🍤',
          '🍙',
          '🍚',
          '🍘',
          '🍥',
          '🥠',
          '🥮',
          '🍢',
          '🍡',
          '🍧',
          '🍨',
          '🍦',
          '🥧',
          '🧁',
          '🍰',
          '🎂',
          '🍮',
          '🍭',
          '🍬',
          '🍫',
          '🍿',
          '🍩',
          '🍪',
          '🌰',
          '🥜',
          '🍯',
          '🥛',
          '🍼',
          '☕️',
          '🍵',
          '🧃',
          '🥤',
          '🍶',
          '🍺',
          '🍻',
          '🥂',
          '🍷',
          '🥃',
          '🍸',
          '🍹',
          '🧉',
          '🍾',
          '🧊',
          '🥄',
          '🍴',
          '🍽',
          '🥣',
          '🥡',
          '🥢',
          '🧂',
        ],
        b = [
          '⚽️',
          '🏀',
          '🏈',
          '⚾️',
          '🥎',
          '🎾',
          '🏐',
          '🏉',
          '🥏',
          '🎱',
          '🪀',
          '🏓',
          '🏸',
          '🏒',
          '🏑',
          '🥍',
          '🏏',
          '🥅',
          '⛳️',
          '🪁',
          '🏹',
          '🎣',
          '🤿',
          '🥊',
          '🥋',
          '🎽',
          '🛹',
          '🛷',
          '⛸',
          '🥌',
          '🎿',
          '⛷',
          '🏂',
          '🪂',
          '🏋️',
          '🏋️‍♂️',
          '🏋️‍♀️',
          '🤼',
          '🤼‍♂️',
          '🤼‍♀️',
          '🤸‍♀️',
          '🤸',
          '🤸‍♂️',
          '⛹️',
          '⛹️‍♂️',
          '⛹️‍♀️',
          '🤺',
          '🤾',
          '🤾‍♂️',
          '🤾‍♀️',
          '🏌️',
          '🏌️‍♂️',
          '🏌️‍♀️',
          '🏇',
          '🧘',
          '🧘‍♂️',
          '🧘‍♀️',
          '🏄',
          '🏄‍♂️',
          '🏄‍♀️',
          '🏊',
          '🏊‍♂️',
          '🏊‍♀️',
          '🤽',
          '🤽‍♂️',
          '🤽‍♀️',
          '🚣',
          '🚣‍♂️',
          '🚣‍♀️',
          '🧗',
          '🧗‍♂️',
          '🧗‍♀️',
          '🚵',
          '🚵‍♂️',
          '🚵‍♀️',
          '🚴',
          '🚴‍♂️',
          '🚴‍♀️',
          '🏆',
          '🥇',
          '🥈',
          '🥉',
          '🏅',
          '🎖',
          '🏵',
          '🎗',
          '🎫',
          '🎟',
          '🎪',
          '🤹',
          '🤹‍♂️',
          '🤹‍♀️',
          '🎭',
          '🎨',
          '🎬',
          '🎤',
          '🎧',
          '🎼',
          '🎹',
          '🥁',
          '🎷',
          '🎺',
          '🎸',
          '🪕',
          '🎻',
          '🎲',
          '🎯',
          '🎳',
          '🎮',
          '🎰',
          '🧩',
        ],
        w = [
          '🚗',
          '🚕',
          '🚙',
          '🚌',
          '🚎',
          '🏎',
          '🚓',
          '🚑',
          '🚒',
          '🚐',
          '🚚',
          '🚛',
          '🚜',
          '🦯',
          '🦽',
          '🦼',
          '🛴',
          '🚲',
          '🛵',
          '🏍',
          '🛺',
          '🚨',
          '🚔',
          '🚍',
          '🚘',
          '🚖',
          '🚡',
          '🚠',
          '🚟',
          '🚃',
          '🚋',
          '🚞',
          '🚝',
          '🚄',
          '🚅',
          '🚈',
          '🚂',
          '🚆',
          '🚇',
          '🚊',
          '🚉',
          '✈️',
          '🛫',
          '🛬',
          '🛩',
          '💺',
          '🛰',
          '🚀',
          '🛸',
          '🚁',
          '🛶',
          '⛵️',
          '🚤',
          '🛥',
          '🛳',
          '⛴',
          '🚢',
          '⚓️',
          '⛽️',
          '🚧',
          '🚦',
          '🚥',
          '🚏',
          '🗺',
          '🗿',
          '🗽',
          '🗼',
          '🏰',
          '🏯',
          '🏟',
          '🎡',
          '🎢',
          '🎠',
          '⛲️',
          '⛱',
          '🏖',
          '🏝',
          '🏜',
          '🌋',
          '⛰',
          '🏔',
          '🗻',
          '🏕',
          '⛺️',
          '🏠',
          '🏡',
          '🏘',
          '🏚',
          '🏗',
          '🏭',
          '🏢',
          '🏬',
          '🏣',
          '🏤',
          '🏥',
          '🏦',
          '🏨',
          '🏪',
          '🏫',
          '🏩',
          '💒',
          '🏛',
          '⛪️',
          '🕌',
          '🕍',
          '🛕',
          '🕋',
          '⛩',
          '🛤',
          '🛣',
          '🗾',
          '🎑',
          '🏞',
          '🌅',
          '🌄',
          '🌠',
          '🎇',
          '🎆',
          '🌇',
          '🌆',
          '🏙',
          '🌃',
          '🌌',
          '🌉',
          '🌁',
        ],
        M = [
          '⌚️',
          '📱',
          '📲',
          '💻',
          '⌨️',
          '🖥',
          '🖨',
          '🖱',
          '🖲',
          '🕹',
          '🗜',
          '💽',
          '💾',
          '💿',
          '📀',
          '📼',
          '📷',
          '📸',
          '📹',
          '🎥',
          '📽',
          '🎞',
          '📞',
          '☎️',
          '📟',
          '📠',
          '📺',
          '📻',
          '🎙',
          '🎚',
          '🎛',
          '🧭',
          '⏱',
          '⏲',
          '⏰',
          '🕰',
          '⌛️',
          '⏳',
          '📡',
          '🔋',
          '🔌',
          '💡',
          '🔦',
          '🕯',
          '🪔',
          '🧯',
          '🛢',
          '💸',
          '💵',
          '💴',
          '💶',
          '💷',
          '💰',
          '💳',
          '💎',
          '⚖️',
          '🧰',
          '🔧',
          '🔨',
          '⚒',
          '🛠',
          '⛏',
          '🔩',
          '⚙️',
          '🧱',
          '⛓',
          '🧲',
          '🔫',
          '💣',
          '🧨',
          '🪓',
          '🔪',
          '🗡',
          '⚔️',
          '🛡',
          '🚬',
          '⚰️',
          '⚱️',
          '🏺',
          '🔮',
          '📿',
          '🧿',
          '💈',
          '⚗️',
          '🔭',
          '🔬',
          '🕳',
          '🩹',
          '🩺',
          '💊',
          '💉',
          '🧬',
          '🦠',
          '🧫',
          '🧪',
          '🌡',
          '🧹',
          '🧺',
          '🧻',
          '🚽',
          '🚰',
          '🚿',
          '🛁',
          '🛀',
          '🧼',
          '🪒',
          '🧽',
          '🧴',
          '🛎',
          '🔑',
          '🗝',
          '🚪',
          '🪑',
          '🛋',
          '🛏',
          '🛌',
          '🧸',
          '🖼',
          '🛍',
          '🛒',
          '🎁',
          '🎈',
          '🎏',
          '🎀',
          '🎊',
          '🎉',
          '🎎',
          '🏮',
          '🎐',
          '🧧',
          '✉️',
          '📩',
          '📨',
          '📧',
          '💌',
          '📥',
          '📤',
          '📦',
          '🏷',
          '📪',
          '📫',
          '📬',
          '📭',
          '📮',
          '📯',
          '📜',
          '📃',
          '📄',
          '📑',
          '🧾',
          '📊',
          '📈',
          '📉',
          '🗒',
          '🗓',
          '📆',
          '📅',
          '🗑',
          '📇',
          '🗃',
          '🗳',
          '🗄',
          '📋',
          '📁',
          '📂',
          '🗂',
          '🗞',
          '📰',
          '📓',
          '📔',
          '📒',
          '📕',
          '📗',
          '📘',
          '📙',
          '📚',
          '📖',
          '🔖',
          '🧷',
          '🔗',
          '📎',
          '🖇',
          '📐',
          '📏',
          '🧮',
          '📌',
          '📍',
          '✂️',
          '🖊',
          '🖋',
          '✒️',
          '🖌',
          '🖍',
          '📝',
          '✏️',
          '🔍',
          '🔎',
          '🔏',
          '🔐',
          '🔒',
          '🔓',
          '🧳',
          '🌂',
          '☂️',
          '🧵',
          '🧶',
          '👓',
          '🕶',
          '🥽',
          '🥼',
          '🦺',
          '👔',
          '👕',
          '👖',
          '🧣',
          '🧤',
          '🧥',
          '🧦',
          '👗',
          '👘',
          '🥻',
          '🩱',
          '🩲',
          '🩳',
          '👙',
          '👚',
          '👛',
          '👜',
          '👝',
          '🎒',
          '👞',
          '👟',
          '🥾',
          '🥿',
          '👠',
          '👡',
          '🩰',
          '👢',
          '👑',
          '👒',
          '🎩',
          '🎓',
          '🧢',
          '⛑',
          '💄',
          '💍',
          '💼',
        ],
        C = [
          '❤️',
          '🧡',
          '💛',
          '💚',
          '💙',
          '💜',
          '🖤',
          '🤍',
          '🤎',
          '💔',
          '❣️',
          '💕',
          '💞',
          '💓',
          '💗',
          '💖',
          '💘',
          '💝',
          '💟',
          '☮️',
          '✝️',
          '☪️',
          '🕉',
          '☸️',
          '✡️',
          '🔯',
          '🕎',
          '☯️',
          '☦️',
          '🛐',
          '⛎',
          '♈️',
          '♉️',
          '♊️',
          '♋️',
          '♌️',
          '♍️',
          '♎️',
          '♏️',
          '♐️',
          '♑️',
          '♒️',
          '♓️',
          '🆔',
          '⚛️',
          '🉑',
          '☢️',
          '☣️',
          '📴',
          '📳',
          '🈶',
          '🈚️',
          '🈸',
          '🈺',
          '🈷️',
          '✴️',
          '🆚',
          '💮',
          '🉐',
          '㊙️',
          '㊗️',
          '🈴',
          '🈵',
          '🈹',
          '🈲',
          '🅰️',
          '🅱️',
          '🆎',
          '🆑',
          '🅾️',
          '🆘',
          '❌',
          '⭕️',
          '🛑',
          '⛔️',
          '📛',
          '🚫',
          '💯',
          '💢',
          '♨️',
          '🚷',
          '🚯',
          '🚳',
          '🚱',
          '🔞',
          '📵',
          '🚭',
          '❗️',
          '❕',
          '❓',
          '❔',
          '‼️',
          '⁉️',
          '🔅',
          '🔆',
          '〽️',
          '⚠️',
          '🚸',
          '🔱',
          '⚜️',
          '🔰',
          '♻️',
          '✅',
          '🈯️',
          '💹',
          '❇️',
          '✳️',
          '❎',
          '🌐',
          '💠',
          'Ⓜ️',
          '🌀',
          '💤',
          '🏧',
          '🚾',
          '♿️',
          '🅿️',
          '🈳',
          '🈂️',
          '🛂',
          '🛃',
          '🛄',
          '🛅',
          '🚹',
          '🚺',
          '🚼',
          '🚻',
          '🚮',
          '🎦',
          '📶',
          '🈁',
          '🔣',
          'ℹ️',
          '🔤',
          '🔡',
          '🔠',
          '🆖',
          '🆗',
          '🆙',
          '🆒',
          '🆕',
          '🆓',
          '0️⃣',
          '1️⃣',
          '2️⃣',
          '3️⃣',
          '4️⃣',
          '5️⃣',
          '6️⃣',
          '7️⃣',
          '8️⃣',
          '9️⃣',
          '🔟',
          '🔢',
          '#️⃣',
          '*️⃣',
          '⏏️',
          '▶️',
          '⏸',
          '⏯',
          '⏹',
          '⏺',
          '⏭',
          '⏮',
          '⏩',
          '⏪',
          '⏫',
          '⏬',
          '◀️',
          '🔼',
          '🔽',
          '➡️',
          '⬅️',
          '⬆️',
          '⬇️',
          '↗️',
          '↘️',
          '↙️',
          '↖️',
          '↕️',
          '↔️',
          '↪️',
          '↩️',
          '⤴️',
          '⤵️',
          '🔀',
          '🔁',
          '🔂',
          '🔄',
          '🔃',
          '🎵',
          '🎶',
          '➕',
          '➖',
          '➗',
          '✖️',
          '♾',
          '💲',
          '💱',
          '™️',
          '©️',
          '®️',
          '〰️',
          '➰',
          '➿',
          '🔚',
          '🔙',
          '🔛',
          '🔝',
          '🔜',
          '✔️',
          '☑️',
          '🔘',
          '🔴',
          '🟠',
          '🟡',
          '🟢',
          '🔵',
          '🟣',
          '⚫️',
          '⚪️',
          '🟤',
          '🔺',
          '🔻',
          '🔸',
          '🔹',
          '🔶',
          '🔷',
          '🔳',
          '🔲',
          '▪️',
          '▫️',
          '◾️',
          '◽️',
          '◼️',
          '◻️',
          '🟥',
          '🟧',
          '🟨',
          '🟩',
          '🟦',
          '🟪',
          '⬛️',
          '⬜️',
          '🟫',
          '🔈',
          '🔇',
          '🔉',
          '🔊',
          '🔔',
          '🔕',
          '📣',
          '📢',
          '👁‍🗨',
          '💬',
          '💭',
          '🗯',
          '♠️',
          '♣️',
          '♥️',
          '♦️',
          '🃏',
          '🎴',
          '🀄️',
          '🕐',
          '🕑',
          '🕒',
          '🕓',
          '🕔',
          '🕕',
          '🕖',
          '🕗',
          '🕘',
          '🕙',
          '🕚',
          '🕛',
          '🕜',
          '🕝',
          '🕞',
          '🕟',
          '🕠',
          '🕡',
          '🕢',
          '🕣',
          '🕤',
          '🕥',
          '🕦',
          '🕧',
        ],
        j = [
          '🏳️',
          '🏴',
          '🏁',
          '🚩',
          '🏳️‍🌈',
          '🏴‍☠️',
          '🇦🇫',
          '🇦🇽',
          '🇦🇱',
          '🇩🇿',
          '🇦🇸',
          '🇦🇩',
          '🇦🇴',
          '🇦🇮',
          '🇦🇶',
          '🇦🇬',
          '🇦🇷',
          '🇦🇲',
          '🇦🇼',
          '🇦🇺',
          '🇦🇹',
          '🇦🇿',
          '🇧🇸',
          '🇧🇭',
          '🇧🇩',
          '🇧🇧',
          '🇧🇾',
          '🇧🇪',
          '🇧🇿',
          '🇧🇯',
          '🇧🇲',
          '🇧🇹',
          '🇧🇴',
          '🇧🇦',
          '🇧🇼',
          '🇧🇷',
          '🇮🇴',
          '🇻🇬',
          '🇧🇳',
          '🇧🇬',
          '🇧🇫',
          '🇧🇮',
          '🇰🇭',
          '🇨🇲',
          '🇨🇦',
          '🇮🇨',
          '🇨🇻',
          '🇧🇶',
          '🇰🇾',
          '🇨🇫',
          '🇹🇩',
          '🇨🇱',
          '🇨🇳',
          '🇨🇽',
          '🇨🇨',
          '🇨🇴',
          '🇰🇲',
          '🇨🇬',
          '🇨🇩',
          '🇨🇰',
          '🇨🇷',
          '🇨🇮',
          '🇭🇷',
          '🇨🇺',
          '🇨🇼',
          '🇨🇾',
          '🇨🇿',
          '🇩🇰',
          '🇩🇯',
          '🇩🇲',
          '🇩🇴',
          '🇪🇨',
          '🇪🇬',
          '🇸🇻',
          '🇬🇶',
          '🇪🇷',
          '🇪🇪',
          '🇪🇹',
          '🇪🇺',
          '🇫🇰',
          '🇫🇴',
          '🇫🇯',
          '🇫🇮',
          '🇫🇷',
          '🇬🇫',
          '🇵🇫',
          '🇹🇫',
          '🇬🇦',
          '🇬🇲',
          '🇬🇪',
          '🇩🇪',
          '🇬🇭',
          '🇬🇮',
          '🇬🇷',
          '🇬🇱',
          '🇬🇩',
          '🇬🇵',
          '🇬🇺',
          '🇬🇹',
          '🇬🇬',
          '🇬🇳',
          '🇬🇼',
          '🇬🇾',
          '🇭🇹',
          '🇭🇳',
          '🇭🇰',
          '🇭🇺',
          '🇮🇸',
          '🇮🇳',
          '🇮🇩',
          '🇮🇷',
          '🇮🇶',
          '🇮🇪',
          '🇮🇲',
          '🇮🇱',
          '🇮🇹',
          '🇯🇲',
          '🇯🇵',
          '🎌',
          '🇯🇪',
          '🇯🇴',
          '🇰🇿',
          '🇰🇪',
          '🇰🇮',
          '🇽🇰',
          '🇰🇼',
          '🇰🇬',
          '🇱🇦',
          '🇱🇻',
          '🇱🇧',
          '🇱🇸',
          '🇱🇷',
          '🇱🇾',
          '🇱🇮',
          '🇱🇹',
          '🇱🇺',
          '🇲🇴',
          '🇲🇰',
          '🇲🇬',
          '🇲🇼',
          '🇲🇾',
          '🇲🇻',
          '🇲🇱',
          '🇲🇹',
          '🇲🇭',
          '🇲🇶',
          '🇲🇷',
          '🇲🇺',
          '🇾🇹',
          '🇲🇽',
          '🇫🇲',
          '🇲🇩',
          '🇲🇨',
          '🇲🇳',
          '🇲🇪',
          '🇲🇸',
          '🇲🇦',
          '🇲🇿',
          '🇲🇲',
          '🇳🇦',
          '🇳🇷',
          '🇳🇵',
          '🇳🇱',
          '🇳🇨',
          '🇳🇿',
          '🇳🇮',
          '🇳🇪',
          '🇳🇬',
          '🇳🇺',
          '🇳🇫',
          '🇰🇵',
          '🇲🇵',
          '🇳🇴',
          '🇴🇲',
          '🇵🇰',
          '🇵🇼',
          '🇵🇸',
          '🇵🇦',
          '🇵🇬',
          '🇵🇾',
          '🇵🇪',
          '🇵🇭',
          '🇵🇳',
          '🇵🇱',
          '🇵🇹',
          '🇵🇷',
          '🇶🇦',
          '🇷🇪',
          '🇷🇴',
          '🇷🇺',
          '🇷🇼',
          '🇼🇸',
          '🇸🇲',
          '🇸🇦',
          '🇸🇳',
          '🇷🇸',
          '🇸🇨',
          '🇸🇱',
          '🇸🇬',
          '🇸🇽',
          '🇸🇰',
          '🇸🇮',
          '🇬🇸',
          '🇸🇧',
          '🇸🇴',
          '🇿🇦',
          '🇰🇷',
          '🇸🇸',
          '🇪🇸',
          '🇱🇰',
          '🇧🇱',
          '🇸🇭',
          '🇰🇳',
          '🇱🇨',
          '🇵🇲',
          '🇻🇨',
          '🇸🇩',
          '🇸🇷',
          '🇸🇿',
          '🇸🇪',
          '🇨🇭',
          '🇸🇾',
          '🇹🇼',
          '🇹🇯',
          '🇹🇿',
          '🇹🇭',
          '🇹🇱',
          '🇹🇬',
          '🇹🇰',
          '🇹🇴',
          '🇹🇹',
          '🇹🇳',
          '🇹🇷',
          '🇹🇲',
          '🇹🇨',
          '🇹🇻',
          '🇻🇮',
          '🇺🇬',
          '🇺🇦',
          '🇦🇪',
          '🇬🇧',
          '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
          '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
          '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
          '🇺🇳',
          '🇺🇸',
          '🇺🇾',
          '🇺🇿',
          '🇻🇺',
          '🇻🇦',
          '🇻🇪',
          '🇻🇳',
          '🇼🇫',
          '🇪🇭',
          '🇾🇪',
          '🇿🇲',
          '🇿🇼',
        ],
        z = [...f, ...x, ...E, ...b, ...w, ...M, ...C, ...j],
        L = new Set(z)
      function k(e) {
        return e.filter((e) => L.has(e))
      }
      function A(e) {
        return L.has(e)
      }
      function F(e) {
        const t = (0, l.getFirstSegmentOrCodePointString)(e),
          n = null !== t && A(t) ? t : ''
        return { emoji: n, emojiLessString: e.replace(n, '') }
      }
      function y(e, t, ...n) {
        const o = F((0, a.ensureNotNull)(e)).emojiLessString.trim(),
          r = F((0, a.ensureNotNull)(t)).emojiLessString.trim()
        return o.localeCompare(r, ...n) || e.localeCompare(t, ...n)
      }
      const T = () => [
        {
          title: r.t(null, { context: 'emoji_group' }, n(88906)),
          emojis: [],
          content: o.createElement(i.IconItem, { icon: c }),
        },
        {
          title: r.t(null, { context: 'emoji_group' }, n(43438)),
          emojis: f,
          content: o.createElement(i.IconItem, { icon: s }),
        },
        {
          title: r.t(null, { context: 'emoji_group' }, n(53288)),
          emojis: x,
          content: o.createElement(i.IconItem, { icon: u }),
        },
        {
          title: r.t(null, { context: 'emoji_group' }, n(90678)),
          emojis: E,
          content: o.createElement(i.IconItem, { icon: m }),
        },
        {
          title: r.t(null, { context: 'emoji_group' }, n(21311)),
          emojis: b,
          content: o.createElement(i.IconItem, { icon: d }),
        },
        {
          title: r.t(null, { context: 'emoji_group' }, n(28562)),
          emojis: w,
          content: o.createElement(i.IconItem, { icon: v }),
        },
        {
          title: r.t(null, { context: 'emoji_group' }, n(98355)),
          emojis: M,
          content: o.createElement(i.IconItem, { icon: h }),
        },
        {
          title: r.t(null, { context: 'emoji_group' }, n(40457)),
          emojis: C,
          content: o.createElement(i.IconItem, { icon: p }),
        },
        {
          title: r.t(null, { context: 'emoji_group' }, n(6715)),
          emojis: j,
          content: o.createElement(i.IconItem, { icon: g }),
        },
      ]
    },
    37285: (e, t, n) => {
      n.d(t, { EmojiItem: () => d })
      var o = n(50959),
        r = n(97754),
        l = n.n(r),
        a = n(9745),
        i = n(11542),
        c = n(19365),
        s = n(88160),
        u = n(13996),
        m = n(6138)
      function d(e) {
        const { emoji: t, className: r } = e
        if (t === s.EMPTY_EMOJI)
          return o.createElement(a.Icon, {
            className: l()(r, u.clearButton, 'apply-common-tooltip'),
            icon: m,
            title: i.t(null, void 0, n(47550)),
          })
        const d = (0, c.getTwemojiUrl)(t, 'png')
        return o.createElement('img', {
          className: l()(r, u.emoji),
          src: d,
          decoding: 'async',
          width: '24',
          height: '24',
          alt: '',
          draggable: !1,
          onContextMenu: (e) => {
            e.preventDefault()
          },
        })
      }
    },
    99616: (e, t, n) => {
      n.d(t, { IconItem: () => c })
      var o = n(50959),
        r = n(97754),
        l = n.n(r),
        a = n(9745),
        i = n(80859)
      function c(e) {
        return o.createElement(
          'div',
          { className: l()(i.wrapper, e.className) },
          o.createElement(a.Icon, { icon: e.icon }),
        )
      }
    },
    56127: (e, t, n) => {
      n.d(t, { LeadingEmojiText: () => i })
      var o = n(50959),
        r = n(63472),
        l = n(37285),
        a = n(39453)
      function i(e) {
        const { text: t, textRender: n, firstSegmentOnly: i = !1 } = e,
          { leadingEmoji: c, processedText: s } = (0, o.useMemo)(
            () =>
              (0, r.processTextWithLeadingEmoji)({
                text: t,
                textRender: n,
                firstSegmentOnly: i,
              }),
            [t, n, i],
          )
        return c
          ? o.createElement(
              o.Fragment,
              null,
              o.createElement(
                'span',
                { className: a.emojiWrap },
                ' ',
                o.createElement(l.EmojiItem, { className: a.emoji, emoji: c }),
              ),
              '' !== s && o.createElement(o.Fragment, null, ' ', s),
            )
          : o.createElement(o.Fragment, null, s)
      }
    },
    63472: (e, t, n) => {
      n.d(t, {
        getLeadingEmojiHtml: () => m,
        processTextWithLeadingEmoji: () => u,
      })
      var o = n(91682),
        r = n(173),
        l = n(88160),
        a = n(56570),
        i = n(19365),
        c = n(39453)
      const s = a.enabled('advanced_emoji_in_titles')
      function u(e) {
        const {
            text: t,
            textRender: n = (e) => e,
            firstSegmentOnly: a = !1,
          } = e,
          i = (0, o.getFirstSegmentOrCodePointString)(t),
          c = null !== i && (0, r.isSupportedEmoji)(i) ? i : l.EMPTY_EMOJI,
          u = a ? i || '' : t
        if (!s || c === l.EMPTY_EMOJI)
          return { leadingEmoji: '', processedText: n(u) }
        return { leadingEmoji: c, processedText: n(u.replace(c, '')) }
      }
      function m(e) {
        const { processedText: t, leadingEmoji: n } = u({ text: e }),
          r = (0, o.htmlEscape)(t)
        if (!n) return r
        return `${((e) => {
          const t = (0, i.getTwemojiUrl)(e, 'png')
          return `<span class=${c.tooltipEmojiWrap}>&nbsp<img class=${c.tooltipEmoji} src=${t} decoding="async" width="12" height="12" alt="" draggable="false"/></span>`
        })(n)}&nbsp;${r}`
      }
    },
    71402: (e, t, n) => {
      n.d(t, { RemoveTitleType: () => o, removeTitlesMap: () => l })
      var o,
        r = n(11542)
      !((e) => {
        ;(e.Add = 'add'), (e.Remove = 'remove')
      })(o || (o = {}))
      const l = {
        [o.Add]: r.t(null, void 0, n(69207)),
        [o.Remove]: r.t(null, void 0, n(85106)),
      }
    },
    36189: (e, t, n) => {
      n.d(t, { FavoriteButton: () => d })
      var o = n(50959),
        r = n(97754),
        l = n.n(r),
        a = n(9745),
        i = n(71402),
        c = n(74670),
        s = n(39146),
        u = n(48010),
        m = n(22413)
      function d(e) {
        const {
            className: t,
            isFilled: n,
            isActive: r,
            onClick: d,
            title: v,
            ...h
          } = e,
          [p, g] = (0, c.useActiveDescendant)(null),
          f =
            v ??
            (n
              ? i.removeTitlesMap[i.RemoveTitleType.Remove]
              : i.removeTitlesMap[i.RemoveTitleType.Add])
        return (
          (0, o.useLayoutEffect)(() => {
            const e = p.current
            e instanceof HTMLElement &&
              f &&
              e.dispatchEvent(new CustomEvent('common-tooltip-update'))
          }, [f, p]),
          o.createElement(a.Icon, {
            ...h,
            className: l()(
              m.favorite,
              'apply-common-tooltip',
              n && m.checked,
              r && m.active,
              g && m.focused,
              t,
            ),
            onClick: d,
            icon: n ? s : u,
            title: f,
            ariaLabel: f,
            ref: p,
          })
        )
      }
    },
    70412: (e, t, n) => {
      n.d(t, {
        hoverMouseEventFilter: () => l,
        useAccurateHover: () => a,
        useHover: () => r,
      })
      var o = n(50959)
      function r() {
        const [e, t] = (0, o.useState)(!1)
        return [
          e,
          {
            onMouseOver: (e) => {
              l(e) && t(!0)
            },
            onMouseOut: (e) => {
              l(e) && t(!1)
            },
          },
        ]
      }
      function l(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function a(e) {
        const [t, n] = (0, o.useState)(!1)
        return (
          (0, o.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return
              const o = e.current.contains(t.target)
              n(o)
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
    16396: (e, t, n) => {
      n.d(t, { DEFAULT_POPUP_MENU_ITEM_THEME: () => u, PopupMenuItem: () => d })
      var o = n(50959),
        r = n(97754),
        l = n(51768),
        a = n(59064),
        i = n(59695),
        c = n(76460),
        s = n(9059)
      const u = s
      function m(e) {
        e.stopPropagation()
      }
      function d(e) {
        const {
            id: t,
            role: n,
            className: u,
            title: d,
            labelRowClassName: v,
            labelClassName: h,
            toolboxClassName: p,
            shortcut: g,
            forceShowShortcuts: f,
            icon: x,
            iconClassname: E,
            isActive: b,
            isDisabled: w,
            isHovered: M,
            appearAsDisabled: C,
            label: j,
            link: z,
            showToolboxOnHover: L,
            showToolboxOnFocus: k,
            target: A,
            rel: F,
            toolbox: y,
            toolboxRole: T,
            reference: P,
            onMouseOut: O,
            onMouseOver: I,
            onKeyDown: N,
            suppressToolboxClick: Q = !0,
            theme: S = s,
            tabIndex: R,
            tagName: H,
            renderComponent: D,
            roundedIcon: _,
            iconAriaProps: V,
            circleLogo: B,
            dontClosePopup: J,
            onClick: q,
            onClickArg: U,
            trackEventObject: W,
            trackMouseWheelClick: K,
            trackRightClick: Y,
            ...G
          } = e,
          $ = (0, o.useRef)(null),
          Z = (0, o.useMemo)(
            () =>
              ((e) => {
                function t(t) {
                  const { reference: n, ...r } = t,
                    l = e ?? (r.href ? 'a' : 'div'),
                    a =
                      'a' === l
                        ? r
                        : ((e) => {
                            const {
                              download: t,
                              href: n,
                              hrefLang: o,
                              media: r,
                              ping: l,
                              rel: a,
                              target: i,
                              type: c,
                              referrerPolicy: s,
                              ...u
                            } = e
                            return u
                          })(r)
                  return o.createElement(l, { ...a, ref: n })
                }
                return (t.displayName = `DefaultComponent(${e})`), t
              })(H),
            [H],
          ),
          X = D ?? Z
        return o.createElement(
          X,
          {
            ...G,
            id: t,
            role: n,
            className: r(u, S.item, x && S.withIcon, {
              [S.isActive]: b,
              [S.isDisabled]: w || C,
              [S.hovered]: M,
            }),
            title: d,
            href: z,
            target: A,
            rel: F,
            reference: (e) => {
              ;($.current = e), 'function' == typeof P && P(e)
              'object' == typeof P && (P.current = e)
            },
            onClick: (e) => {
              if (w) return
              W && (0, l.trackEvent)(W.category, W.event, W.label)
              q && q(U, e)
              J ||
                (e.currentTarget.dispatchEvent(
                  new CustomEvent('popup-menu-close-event', {
                    bubbles: !0,
                    detail: {
                      clickType: (0, c.isKeyboardClick)(e)
                        ? 'keyboard'
                        : 'mouse',
                    },
                  }),
                ),
                (0, a.globalCloseMenu)())
            },
            onContextMenu: (e) => {
              W &&
                Y &&
                (0, l.trackEvent)(W.category, W.event, `${W.label}_rightClick`)
            },
            onMouseUp: (e) => {
              if (1 === e.button && z && W) {
                let e = W.label
                K && (e += '_mouseWheelClick'),
                  (0, l.trackEvent)(W.category, W.event, e)
              }
            },
            onMouseOver: I,
            onMouseOut: O,
            onKeyDown: N,
            tabIndex: R,
          },
          B &&
            o.createElement(i.CircleLogo, {
              ...V,
              className: s['disclosure-item-circle-logo'],
              size: 'xxxsmall',
              logoUrl: B.logoUrl,
              placeholderLetter:
                'placeholderLetter' in B ? B.placeholderLetter : void 0,
            }),
          x &&
            o.createElement('span', {
              'aria-label': V && V['aria-label'],
              'aria-hidden': V && Boolean(V['aria-hidden']),
              className: r(S.icon, _ && s['round-icon'], E),
              dangerouslySetInnerHTML: { __html: x },
            }),
          o.createElement(
            'span',
            { className: r(S.labelRow, v) },
            o.createElement('span', { className: r(S.label, h) }, j),
          ),
          (void 0 !== g || f) &&
            o.createElement(
              'span',
              { className: S.shortcut },
              (ee = g) && ee.split('+').join(' + '),
            ),
          void 0 !== y &&
            o.createElement(
              'span',
              {
                role: T,
                onClick: Q ? m : void 0,
                className: r(p, S.toolbox, {
                  [S.showOnHover]: L,
                  [S.showOnFocus]: k,
                }),
              },
              y,
            ),
        )
        var ee
      }
    },
    20520: (e, t, n) => {
      n.d(t, { PopupMenu: () => d })
      var o = n(50959),
        r = n(32227),
        l = n(88987),
        a = n(42842),
        i = n(27317),
        c = n(29197)
      const s = o.createContext(void 0)
      var u = n(36383)
      const m = o.createContext({ setMenuMaxWidth: !1 })
      function d(e) {
        const {
            controller: t,
            children: n,
            isOpened: d,
            closeOnClickOutside: v = !0,
            doNotCloseOn: h,
            onClickOutside: p,
            onClose: g,
            onKeyboardClose: f,
            'data-name': x = 'popup-menu-container',
            ...E
          } = e,
          b = (0, o.useContext)(c.CloseDelegateContext),
          w = o.useContext(m),
          M = (0, o.useContext)(s),
          C = (0, u.useOutsideEvent)({
            handler: (e) => {
              p && p(e)
              if (!v) return
              const t = (0, l.default)(h) ? h() : null == h ? [] : [h]
              if (t.length > 0 && e.target instanceof Node)
                for (const n of t) {
                  const t = r.findDOMNode(n)
                  if (t instanceof Node && t.contains(e.target)) return
                }
              g()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return d
          ? o.createElement(
              a.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              o.createElement(
                'span',
                { ref: C, style: { pointerEvents: 'auto' } },
                o.createElement(
                  i.Menu,
                  {
                    ...E,
                    onClose: g,
                    onKeyboardClose: f,
                    onScroll: (t) => {
                      const { onScroll: n } = e
                      n && n(t)
                    },
                    customCloseDelegate: b,
                    customRemeasureDelegate: M,
                    ref: t,
                    'data-name': x,
                    limitMaxWidth: w.setMenuMaxWidth,
                    'data-tooltip-show-on-focus': 'true',
                  },
                  n,
                ),
              ),
            )
          : null
      }
    },
    96040: (e, t, n) => {
      n.d(t, { RemoveButton: () => m })
      var o = n(11542),
        r = n(50959),
        l = n(97754),
        a = n.n(l),
        i = n(9745),
        c = n(74670),
        s = n(33765),
        u = n(35990)
      function m(e) {
        const {
            className: t,
            isActive: l,
            onClick: m,
            onMouseDown: d,
            title: v,
            hidden: h,
            'data-name': p = 'remove-button',
            icon: g,
            ...f
          } = e,
          [x, E] = (0, c.useActiveDescendant)(null)
        return r.createElement(i.Icon, {
          ...f,
          'data-name': p,
          className: a()(
            u.button,
            'apply-common-tooltip',
            l && u.active,
            h && u.hidden,
            E && u.focused,
            t,
          ),
          icon: g || s,
          onClick: m,
          onMouseDown: d,
          title: v ?? o.t(null, void 0, n(67410)),
          ariaLabel: v ?? o.t(null, void 0, n(67410)),
          ref: x,
        })
      }
    },
    26448: (e) => {
      e.exports = {
        accessible: 'accessible-NQERJsv9',
        active: 'active-NQERJsv9',
      }
    },
    20243: (e, t, n) => {
      n.d(t, {
        focusFirstMenuItem: () => u,
        handleAccessibleMenuFocus: () => c,
        handleAccessibleMenuKeyDown: () => s,
        queryMenuElements: () => v,
      })
      var o = n(19291),
        r = n(57177),
        l = n(68335),
        a = n(15754)
      const i = [37, 39, 38, 40]
      function c(e, t) {
        if (!e.target) return
        const n = e.relatedTarget?.getAttribute('aria-activedescendant')
        if (e.relatedTarget !== t.current) {
          const e = n && document.getElementById(n)
          if (!e || e !== t.current) return
        }
        u(e.target)
      }
      function s(e) {
        if (e.defaultPrevented) return
        const t = (0, l.hashFromEvent)(e)
        if (!i.includes(t)) return
        const n = document.activeElement
        if (!(document.activeElement instanceof HTMLElement)) return
        const a = v(e.currentTarget).sort(o.navigationOrderComparator)
        if (0 === a.length) return
        const c =
          document.activeElement.closest('[data-role="menuitem"]') ||
          document.activeElement.parentElement?.querySelector(
            '[data-role="menuitem"]',
          )
        if (!(c instanceof HTMLElement)) return
        const s = a.indexOf(c)
        if (-1 === s) return
        const u = h(c),
          p = u.indexOf(document.activeElement),
          g = -1 !== p,
          f = (e) => {
            n && (0, r.becomeSecondaryElement)(n),
              (0, r.becomeMainElement)(e),
              e.focus()
          }
        switch ((0, o.mapKeyCodeToDirection)(t)) {
          case 'inlinePrev':
            if (!u.length) return
            e.preventDefault(),
              f(0 === p ? a[s] : g ? m(u, p, -1) : u[u.length - 1])
            break
          case 'inlineNext':
            if (!u.length) return
            e.preventDefault(),
              p === u.length - 1 ? f(a[s]) : f(g ? m(u, p, 1) : u[0])
            break
          case 'blockPrev': {
            e.preventDefault()
            const t = m(a, s, -1)
            if (g) {
              const e = d(t, p)
              f(e || t)
              break
            }
            f(t)
            break
          }
          case 'blockNext': {
            e.preventDefault()
            const t = m(a, s, 1)
            if (g) {
              const e = d(t, p)
              f(e || t)
              break
            }
            f(t)
          }
        }
      }
      function u(e) {
        const [t] = v(e)
        t && ((0, r.becomeMainElement)(t), t.focus())
      }
      function m(e, t, n) {
        return e[(t + e.length + n) % e.length]
      }
      function d(e, t) {
        const n = h(e)
        return n.length ? n[(t + n.length) % n.length] : null
      }
      function v(e) {
        return Array.from(
          e.querySelectorAll(
            '[data-role="menuitem"]:not([disabled]):not([aria-disabled])',
          ),
        ).filter((0, a.createScopedVisibleElementFilter)(e))
      }
      function h(e) {
        return Array.from(
          e.querySelectorAll('[tabindex]:not([disabled]):not([aria-disabled])'),
        ).filter((0, a.createScopedVisibleElementFilter)(e))
      }
    },
    57177: (e, t, n) => {
      var o
      function r(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:main-element'))
      }
      function l(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'))
      }
      n.d(t, { becomeMainElement: () => r, becomeSecondaryElement: () => l }),
        ((e) => {
          ;(e.MainElement = 'roving-tabindex:main-element'),
            (e.SecondaryElement = 'roving-tabindex:secondary-element')
        })(o || (o = {}))
    },
    10838: (e, t, n) => {
      n.d(t, { AccessibleMenuItem: () => u })
      var o = n(50959),
        r = n(97754),
        l = n.n(r),
        a = n(3343),
        i = n(50238),
        c = n(16396),
        s = n(26448)
      function u(e) {
        const { className: t, ...n } = e,
          [r, u] = (0, i.useRovingTabindexElement)(null)
        return o.createElement(c.PopupMenuItem, {
          ...n,
          className: l()(s.accessible, e.isActive && s.active, t),
          reference: r,
          tabIndex: u,
          onKeyDown: (e) => {
            if (e.target !== e.currentTarget) return
            const t = (0, a.hashFromEvent)(e)
            ;(13 !== t && 32 !== t) ||
              (e.preventDefault(),
              r.current instanceof HTMLElement && r.current.click())
          },
          'data-role': 'menuitem',
          'aria-disabled': e.isDisabled || void 0,
          toolboxRole: 'toolbar',
        })
      }
    },
    27830: (e, t, n) => {
      n.d(t, { showFavoriteLayouts: () => o })
      const o = !1
    },
    19365: (e, t, n) => {
      n.d(t, { getTwemojiUrl: () => r })
      var o = n(18438)
      function r(e, t) {
        let n = ''
        return (
          o.default.parse(
            e,
            (e) => (
              (n =
                o.default.base +
                ('svg' === t ? `svg/${e}.svg` : `72x72/${e}.png`)),
              !1
            ),
          ),
          n
        )
      }
      o.default.base = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/13.0.1/'
    },
    60925: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M12 4h3v1h-1.04l-.88 9.64a1.5 1.5 0 0 1-1.5 1.36H6.42a1.5 1.5 0 0 1-1.5-1.36L4.05 5H3V4h3v-.5C6 2.67 6.67 2 7.5 2h3c.83 0 1.5.67 1.5 1.5V4ZM7.5 3a.5.5 0 0 0-.5.5V4h4v-.5a.5.5 0 0 0-.5-.5h-3ZM5.05 5l.87 9.55a.5.5 0 0 0 .5.45h5.17a.5.5 0 0 0 .5-.45L12.94 5h-7.9Z"/></svg>'
    },
    6138: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M7.332 6.548 21.42 20.704A9.962 9.962 0 0 0 24 14c0-5.523-4.477-10-10-10a9.961 9.961 0 0 0-6.668 2.548Zm13.381 14.864L6.621 7.252A9.962 9.962 0 0 0 4 14c0 5.523 4.477 10 10 10 2.584 0 4.938-.98 6.713-2.588ZM6.263 6.181A10.967 10.967 0 0 1 14 3c6.075 0 11 4.925 11 11 0 3.036-1.23 5.785-3.218 7.775A10.967 10.967 0 0 1 14 25C7.925 25 3 20.075 3 14c0-3.058 1.249-5.826 3.263-7.82Z"/></svg>'
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
    92177: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M13.98 6.02L14.5 6c2.18 0 4.16.8 5.66 2.14l-5.66 5.65-2.31-2.3a8.43 8.43 0 0 0 1.55-3.64 14.01 14.01 0 0 0 .24-1.83zm-1.01.12a8.45 8.45 0 0 0-4.13 2l2.64 2.63a7.59 7.59 0 0 0 1.28-3.12c.12-.59.18-1.12.2-1.51zm-4.83 2.7a8.45 8.45 0 0 0-2 4.13c.39-.03.92-.1 1.51-.21a7.59 7.59 0 0 0 3.12-1.28L8.14 8.84zm-2.12 5.14a8.48 8.48 0 0 0 2.12 6.18l5.65-5.66-2.3-2.31a8.43 8.43 0 0 1-3.64 1.55 14.03 14.03 0 0 1-1.83.24zm2.82 6.88a8.46 8.46 0 0 0 5.13 2.12v-.07A8.95 8.95 0 0 1 16.3 17l-1.8-1.8-5.66 5.65zM14.97 23c2-.1 3.8-.9 5.19-2.13L17 17.72a7.94 7.94 0 0 0-2.04 5.27zm5.9-2.83a8.46 8.46 0 0 0 2.11-5.13h-.02a10.62 10.62 0 0 0-5.2 2l3.1 3.13zm2.12-6.13c-.1-2-.9-3.8-2.13-5.19l-5.65 5.66 1.83 1.83a11.6 11.6 0 0 1 5.95-2.3zM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5z"/></svg>'
    },
    1759: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M4.54 3.2l.78-.59 5.49 4.5 1.43 1.07a5.28 5.28 0 0 1 2.19-2.3 9.19 9.19 0 0 1 1.88-.85h.04l.01-.01.14.48.42-.28v.01l.01.02a3.14 3.14 0 0 1 .16.26l.37.72c.2.45.4 1.02.5 1.64a2.13 2.13 0 0 1 1.89.46l.18.16.03.02.18.16c.22.16.42.27.81.25a5.9 5.9 0 0 0 2.2-.86l.66-.36.09.75a5.98 5.98 0 0 1-1.7 5.1 6.87 6.87 0 0 1-1.7 1.23 19.97 19.97 0 0 1 .48 2.48c.25 1.73.42 4.08.06 6.5A1.46 1.46 0 0 1 19.68 25h-7.71a1.5 1.5 0 0 1-1.4-2.06l1-2.47c-.18.02-.37.03-.58.03a3 3 0 0 1-1.53-.4 6.84 6.84 0 0 1-1.6.64c-1.08.27-2.55.29-3.72-.89a4.06 4.06 0 0 1-.96-3 5.1 5.1 0 0 1 2-3.74 98.5 98.5 0 0 0 2.7-2.24L4.55 3.2zM16.5 5.5l-.14-.48.35-.1.2.3-.41.28zm-7.87 6.06a57.48 57.48 0 0 1-2.19 1.82l.49.26c.65.37 1.48.9 1.97 1.56a5.78 5.78 0 0 1 1.14 4.07l.06.03c.19.1.49.2.9.2.68 0 .95-.11 1.03-.16v-.03l.97.19h-.5.5v.03a.75.75 0 0 1-.01.1.74.74 0 0 1-.09.21l-1.39 3.47a.5.5 0 0 0 .47.69h7.71c.24 0 .43-.17.47-.38a22 22 0 0 0-.06-6.22 24.4 24.4 0 0 0-.56-2.71 11.35 11.35 0 0 0-.94-1.52 7.1 7.1 0 0 0-2.31-2.22l-.62-.31.49-.5A3.03 3.03 0 0 0 17 8.6a1.2 1.2 0 0 0 .01-.1c0-.65-.22-1.33-.46-1.86-.1-.21-.18-.4-.26-.54a8.07 8.07 0 0 0-1.34.64c-.9.54-1.74 1.32-1.95 2.36v.03l-.02.03L12.5 9l.47.16v.02a2.97 2.97 0 0 1-.1.26 5.9 5.9 0 0 1-.31.62c-.27.46-.7 1.07-1.34 1.39-.63.31-1.38.3-1.9.23a5.83 5.83 0 0 1-.7-.12zm3.26-2.39L10.2 7.9l-.02-.01L6.3 4.7l2.57 5.88h.01c.14.04.34.08.57.11.47.06.97.05 1.34-.14.36-.18.68-.57.91-.99.08-.14.15-.27.2-.39zm8.32 4.68a5.47 5.47 0 0 0 1.37-1.02 4.88 4.88 0 0 0 1.46-3.53c-.8.39-1.41.58-1.92.61-.7.05-1.14-.18-1.49-.45a5.6 5.6 0 0 1-.22-.19l-.03-.03-.17-.13a1.4 1.4 0 0 0-.33-.22c-.18-.07-.44-.12-.93 0l-.1.4c-.1.3-.28.69-.58 1.09.87.59 1.6 1.46 2.14 2.2a14.92 14.92 0 0 1 .8 1.27zM9.05 19.19v-.09a4.78 4.78 0 0 0-.96-3.3 5.56 5.56 0 0 0-1.65-1.29c-.3-.17-.6-.3-.8-.4l-.05-.03a4.05 4.05 0 0 0-1.4 2.82 3.1 3.1 0 0 0 .66 2.25c.83.82 1.86.84 2.78.62a5.71 5.71 0 0 0 1.42-.58zm4.26-5.87c-.3.24-.74.54-1.18.66-.37.1-.81.1-1.12.08a6.95 6.95 0 0 1-.54-.06h-.05l.08-.5.08-.5.03.01a5.02 5.02 0 0 0 1.26 0c.24-.06.54-.25.83-.47a6.1 6.1 0 0 0 .42-.37l.02-.02.36.35.35.36h-.01l-.03.04a6.09 6.09 0 0 1-.5.42zM6 17h1v-1H6v1z"/></svg>'
    },
    93826: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M7.5 24v-5.5m0 0s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1v-6m-14 6v-6m0 0v-6s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1v6m-14 0s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1"/></svg>'
    },
    5474: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M12.5 8h1.36l-.85-3.38.98-.24.9 3.62h7.64a1.34 1.34 0 0 1 .2.02c.13.02.31.07.5.16.18.09.38.24.53.46.15.24.24.52.24.86 0 .34-.09.62-.24.86a1.38 1.38 0 0 1-.79.56L22 24.54l-.03.46H6.5c-1 0-1.64-.68-1.99-1.23a4.4 4.4 0 0 1-.38-.78l-.01-.04c-.1-.03-.22-.07-.34-.13a1.36 1.36 0 0 1-.54-.46A1.51 1.51 0 0 1 3 21.5c0-.34.09-.62.24-.86.15-.22.35-.37.54-.46.1-.05.2-.09.28-.11a6.6 6.6 0 0 1 .96-2.34C5.92 16.35 7.56 15 10.5 15c.72 0 1.36.08 1.93.22l-.4-4.3a1.38 1.38 0 0 1-.8-.57A1.51 1.51 0 0 1 11 9.5c0-.34.09-.62.24-.86.15-.22.35-.37.54-.46a1.73 1.73 0 0 1 .7-.18h.02v.5V8zm.96 7.57a5.73 5.73 0 0 1 2.52 2.16 6.86 6.86 0 0 1 .95 2.34 1.38 1.38 0 0 1 .82.58c.16.23.25.51.25.85 0 .34-.09.62-.24.86-.15.22-.35.37-.54.46-.12.06-.24.1-.34.13l-.01.04a4.4 4.4 0 0 1-.54 1.01h4.7l.93-13h-8.91l.41 4.57zM14.5 9h8a.73.73 0 0 1 .28.07c.06.04.11.08.15.13.03.05.07.14.07.3 0 .16-.04.25-.07.3a.38.38 0 0 1-.15.13.73.73 0 0 1-.27.07H12.5a.73.73 0 0 1-.28-.07.38.38 0 0 1-.15-.13.52.52 0 0 1-.07-.3c0-.16.04-.25.07-.3.04-.05.09-.1.15-.13A.73.73 0 0 1 12.5 9h2.01zm1.4 11a5.8 5.8 0 0 0-.76-1.73C14.41 17.15 13.06 16 10.5 16c-2.56 0-3.91 1.15-4.64 2.27A5.86 5.86 0 0 0 5.1 20h10.78zM4.5 21a.72.72 0 0 0-.28.07.38.38 0 0 0-.15.13.52.52 0 0 0-.07.3c0 .16.04.25.07.3.04.05.09.1.15.13a.73.73 0 0 0 .27.07H16.5a.72.72 0 0 0 .28-.07.38.38 0 0 0 .15-.13.52.52 0 0 0 .07-.3.52.52 0 0 0-.07-.3.38.38 0 0 0-.15-.13.73.73 0 0 0-.27-.07H4.5zm.73 2l.13.23c.28.45.65.77 1.14.77h8c.5 0 .86-.32 1.14-.77.05-.07.1-.15.13-.23H5.23zM11 17v1h-1v-1h1zm-3 1h1v1H8v-1zm4 1v-1h1v1h-1z"/></svg>'
    },
    86209: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M9.5 21H9h.5zm8 0H17h.5zm-6-10H11v1h.5v-1zm4 1h.5v-1h-.5v1zm2 7.5h.5-.5zm.29-1.59A7.97 7.97 0 0 0 21 11.5h-1a6.97 6.97 0 0 1-2.79 5.59l.58.82zM21 11.5A7.5 7.5 0 0 0 13.5 4v1a6.5 6.5 0 0 1 6.5 6.5h1zM13.5 4A7.5 7.5 0 0 0 6 11.5h1A6.5 6.5 0 0 1 13.5 5V4zM6 11.5a7.98 7.98 0 0 0 3.21 6.41l.57-.82A6.98 6.98 0 0 1 7 11.5H6zM9 21a1 1 0 0 0 1 1v-1H9zm8 1a1 1 0 0 0 1-1h-1v1zm-6-.5V23h1v-1.5h-1zm0 1.5a1 1 0 0 0 1 1v-1h-1zm1 1h3v-1h-3v1zm3 0a1 1 0 0 0 1-1h-1v1zm1-1v-1.5h-1V23h1zm-3-11.5v6h1v-6h-1zM9.5 20h8v-1h-8v1zM9 17.5v2h1v-2H9zm0 2V21h1v-1.5H9zm9 1.5v-1.5h-1V21h1zm0-1.5v-2h-1v2h1zM9.5 18h4v-1h-4v1zm4 0h4v-1h-4v1zm-2-6h2v-1h-2v1zm2 0h2v-1h-2v1zM10 22h1.5v-1H10v1zm1.5 0h4v-1h-4v1zm4 0H17v-1h-1.5v1z"/></svg>'
    },
    37603: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M6 14.5C6 9.78 9.78 6 14.5 6c4.72 0 8.5 3.78 8.5 8.5 0 4.72-3.78 8.5-8.5 8.5A8.46 8.46 0 0 1 6 14.5zM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5zM14 16V9h1v6h4v1h-5z"/></svg>'
    },
    32386: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M6 14.5C6 9.78 9.78 6 14.5 6c4.72 0 8.5 3.78 8.5 8.5 0 4.72-3.78 8.5-8.5 8.5A8.46 8.46 0 0 1 6 14.5zM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5zM12 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-6 4l-.43.26v.01l.03.03a3.55 3.55 0 0 0 .3.4 5.7 5.7 0 0 0 9.22 0 5.42 5.42 0 0 0 .28-.4l.02-.03v-.01L19 17l-.43-.26v.02a2.45 2.45 0 0 1-.24.32c-.17.21-.43.5-.78.79a4.71 4.71 0 0 1-6.88-.8 4.32 4.32 0 0 1-.23-.31l-.01-.02L10 17z"/></svg>'
    },
    14082: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M5.6 15.43A6.19 6.19 0 0 1 14 6.36a6.19 6.19 0 0 1 8.4 9.08l-.03.02-7.3 7.31a1.5 1.5 0 0 1-2.13 0l-7.3-7.3-.03-.03m.71-.7v-.01a5.19 5.19 0 0 1 7.33-7.34v.01c.2.2.51.19.7 0a5.19 5.19 0 0 1 7.34 7.33l-.03.02-7.3 7.31a.5.5 0 0 1-.71 0l-7.3-7.3-.03-.02z"/></svg>'
    },
    83137: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M22.87 6.44c.09-.78-.53-1.4-1.3-1.31-1.43.15-3.43.48-5.42 1.2a11.8 11.8 0 0 0-5.23 3.44L9.86 11.9l6.24 6.24 2.13-1.06a11.8 11.8 0 0 0 3.44-5.23c.72-1.99 1.05-4 1.2-5.41zm-4.93 11.9l-1.72.86-.04.02h-.04l-2.2.67v.01a19.68 19.68 0 0 0-.13 3.33c.01.14.08.22.17.26.08.04.2.05.32-.03a18.83 18.83 0 0 0 2.79-2.26 8.18 8.18 0 0 0 .44-1.1c.16-.51.33-1.12.41-1.76zm-.44 3.16l.35.35-.01.02-.05.05a16.85 16.85 0 0 1-.83.76c-.54.47-1.3 1.08-2.1 1.61a1.3 1.3 0 0 1-2.05-.98 16.46 16.46 0 0 1 .09-3.08l-.16.05a1.5 1.5 0 0 1-1.53-.36l-3.13-3.13c-.4-.4-.54-1-.36-1.53l.05-.16-.36.04c-.7.06-1.62.11-2.54.06a1.3 1.3 0 0 1-1.13-.8c-.18-.42-.13-.94.17-1.35a87.55 87.55 0 0 1 2.15-2.8l.04-.04v-.02l.4.31-.22-.45.03-.01a5.93 5.93 0 0 1 .34-.16c.23-.1.55-.22.94-.35A9.77 9.77 0 0 1 10.26 9a12.9 12.9 0 0 1 5.55-3.61c2.09-.76 4.18-1.1 5.65-1.26 1.41-.15 2.56 1 2.4 2.41a24.04 24.04 0 0 1-1.25 5.65A12.9 12.9 0 0 1 19 17.74a9.77 9.77 0 0 1-.88 3.61 9.18 9.18 0 0 1-.16.34v.03h-.01l-.45-.22zm0 0l.45.22-.04.08-.06.05-.35-.35zm-11-11l-.4-.31.08-.09.1-.05.22.45zm3.16-.44a9.61 9.61 0 0 0-2.84.84l-.13.16a109.83 109.83 0 0 0-1.97 2.58.4.4 0 0 0-.06.38c.04.1.12.17.27.18a16.05 16.05 0 0 0 3.18-.15l.66-2.2.01-.03.02-.04.86-1.72zm5.4 8.45l-5.57-5.56-.51 1.7-.31.92a.5.5 0 0 0 .12.51l3.13 3.13a.5.5 0 0 0 .5.12l.92-.3h.02l1.7-.52zm-10.91.64l2-2 .7.7-2 2-.7-.7zm0 4l4-4 .7.7-4 4-.7-.7zm4 0l2-2 .7.7-2 2-.7-.7zM16 10.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM17.5 8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/></svg>'
    },
  },
])
