;(() => {
  var e,
    a,
    d,
    c,
    t,
    f = {},
    b = {}
  function r(e) {
    var a = b[e]
    if (void 0 !== a) return a.exports
    var d = (b[e] = { id: e, loaded: !1, exports: {} })
    return f[e].call(d.exports, d, d.exports, r), (d.loaded = !0), d.exports
  }
  ;(r.m = f),
    (r.c = b),
    (e = []),
    (r.O = (a, d, c, t) => {
      if (!d) {
        var f = 1 / 0
        for (i = 0; i < e.length; i++) {
          for (var [d, c, t] = e[i], b = !0, n = 0; n < d.length; n++)
            (!1 & t || f >= t) && Object.keys(r.O).every((e) => r.O[e](d[n]))
              ? d.splice(n--, 1)
              : ((b = !1), t < f && (f = t))
          if (b) {
            e.splice(i--, 1)
            var o = c()
            void 0 !== o && (a = o)
          }
        }
        return a
      }
      t = t || 0
      for (var i = e.length; i > 0 && e[i - 1][2] > t; i--) e[i] = e[i - 1]
      e[i] = [d, c, t]
    }),
    (r.n = (e) => {
      var a = e && e.__esModule ? () => e.default : () => e
      return r.d(a, { a }), a
    }),
    (d = Object.getPrototypeOf
      ? (e) => Object.getPrototypeOf(e)
      : (e) => e.__proto__),
    (r.t = function (e, c) {
      if ((1 & c && (e = this(e)), 8 & c)) return e
      if ('object' == typeof e && e) {
        if (4 & c && e.__esModule) return e
        if (16 & c && 'function' == typeof e.then) return e
      }
      var t = Object.create(null)
      r.r(t)
      var f = {}
      a = a || [null, d({}), d([]), d(d)]
      for (var b = 2 & c && e; 'object' == typeof b && !~a.indexOf(b); b = d(b))
        Object.getOwnPropertyNames(b).forEach((a) => (f[a] = () => e[a]))
      return (f.default = () => e), r.d(t, f), t
    }),
    (r.d = (e, a) => {
      for (var d in a)
        r.o(a, d) &&
          !r.o(e, d) &&
          Object.defineProperty(e, d, { enumerable: !0, get: a[d] })
    }),
    (r.f = {}),
    (r.e = (e) =>
      Promise.all(Object.keys(r.f).reduce((a, d) => (r.f[d](e, a), a), []))),
    (r.u = (e) =>
      9417 === e
        ? '__LANG__.9417.7ff64779d43389a1bb41.js'
        : 3175 === e
          ? '__LANG__.3175.e0a2c845c5cba23f42fb.js'
          : 3951 === e
            ? '__LANG__.3951.babac9be598102fb0d92.js'
            : 5362 === e
              ? '__LANG__.5362.311bfba5d2c84b13ec2b.js'
              : 2578 === e
                ? '__LANG__.2578.ab3178e0160c259eac53.js'
                : 2547 === e
                  ? '__LANG__.2547.28b713bedf796244795d.js'
                  : 2285 === e
                    ? '__LANG__.2285.1268ecef367debd2960b.js'
                    : 344 === e
                      ? '__LANG__.344.a9e566fa1091368f40c7.js'
                      : 178 === e
                        ? '__LANG__.178.dd03c0163a8373c0fc5b.js'
                        : 6306 === e
                          ? '__LANG__.6306.b88dcc3f0d7db89ebfc1.js'
                          : 3236 === e
                            ? '__LANG__.3236.e12bb9a536432e97ec0c.js'
                            : ({
                                92: 'chart-screenshot-hint',
                                139: 'get-error-card',
                                507: 'study-pane-views',
                                607: 'study-property-pages-with-definitions',
                                731: 'add-compare-dialog',
                                1583: 'lt-pane-views',
                                1584: 'context-menu-renderer',
                                1702: 'manage-drawings-dialog',
                                1754: 'symbol-search-dialog',
                                1859: 'go-to-date-dialog-impl',
                                1890: 'line-tools-icons',
                                2077: 'change-interval-dialog',
                                2183: 'study-inputs-pane-views',
                                2306: 'floating-toolbars',
                                2377: 'hammerjs',
                                2616: 'svg-renderer',
                                2704: 'currency-label-menu',
                                2878: 'drawing-toolbar',
                                3005: 'header-toolbar',
                                3030: 'new-confirm-inputs-dialog',
                                3596: 'general-property-page',
                                4013: 'custom-intervals-add-dialog',
                                4079: 'series-pane-views',
                                4389: 'take-chart-image-impl',
                                4665: 'share-chart-to-social-utils',
                                4862: 'object-tree-dialog',
                                5009: 'load-chart-dialog',
                                5093: 'chart-widget-gui',
                                5516: 'restricted-toolset',
                                5551: 'favorite-drawings-api',
                                5565: 'ichart-storage',
                                5598: 'lt-stickers-atlas',
                                6124: 'chart-storage-library-http',
                                6166: 'chart-event-hint',
                                6265: 'new-edit-object-dialog',
                                6456: 'study-market',
                                6631: 'study-template-dialog',
                                6780: 'source-properties-editor',
                                7078: 'general-chart-properties-dialog',
                                7129: 'line-tools-synchronizer',
                                7260: 'chart-bottom-toolbar',
                                7271: 'compare-model',
                                7648: 'show-theme-save-dialog',
                                7987: 'lt-icons-atlas',
                                8020: 'user-defined-bars-marks-tooltip',
                                8313: 'chart-storage-external-adapter',
                                8537: 'lt-property-pages-with-definitions',
                                8643: 'full-tooltips-popup',
                                8890: 'simple-dialog',
                                9039: 'lollipop-tooltip-renderer',
                                9374: 'symbol-info-dialog-impl',
                                9498: 'export-data',
                                9685: 'series-icons-map',
                                9754: 'global-search-dialog',
                              }[e] || e) +
                              '.' +
                              {
                                6: 'a03a8ff024d47ed075c6',
                                92: '795900ef9e075c847a64',
                                139: '83ba0cba4c0538851e0a',
                                507: '51d0897ba74454ec3423',
                                524: '2b350163c328ac8dce2e',
                                607: '1d3c58ff151a9c7c19a3',
                                731: '5039a5ac2f3556b18cb1',
                                750: '5d5f4dea4acc51a7ba4b',
                                826: '906374d84a8e6c40c6e8',
                                855: '61db310932f8af2c5989',
                                898: 'b63568700f1380e37b1a',
                                956: 'a325fc0a9a24da09a622',
                                962: '9f54d549868e21286372',
                                1033: 'bb804c64fe58de0bace7',
                                1109: '845f0f111ff830ab93c8',
                                1553: 'c076714f5e24887f0b94',
                                1583: '077de067da0763f84cb2',
                                1584: '4170e3d150582097504c',
                                1702: '5f8ccee744105adf029e',
                                1740: '4c61de525e940eee4f3c',
                                1754: 'e5850d7e02343ee54c52',
                                1762: '9511e5b410d7d629bc49',
                                1803: '5799aa316db71b2f13e5',
                                1859: '851f6bf2bf36fe8fbac4',
                                1890: 'ecc8d3a4af49afed6b6d',
                                2052: 'e9d07fdfb896fca26166',
                                2077: 'ebdeefbf84f9e033ed5b',
                                2109: '291fa715b6ded706c3dd',
                                2183: '6caf467f12b1d6ee408a',
                                2191: '2197cc1b66a1db8969cc',
                                2260: '95dc0a20b147b6b2eeed',
                                2306: '96ac7a46b7738535bc92',
                                2377: '6e30e0c48af40bf2f6c0',
                                2443: '66f44a8bfe8d49aaeaee',
                                2486: '2b718a16270e4168ea54',
                                2544: '225f38946afc6ad55a35',
                                2587: '615babc52637decdb6e2',
                                2616: 'f065beaf6b5b37da27d9',
                                2639: 'a55d77a7912be54f7b9d',
                                2666: 'd28c0fa0a323b8118f22',
                                2676: 'a9a5ede4d514162164fa',
                                2704: '8bac01cc43d3f2cbf903',
                                2731: '55eed17fefac5e82c077',
                                2846: 'fbbd62afe04b4f9387f2',
                                2878: '37a00c1b0c7a68cc1d44',
                                3005: 'df1a95078c18a5da785c',
                                3030: '5ce0d1c060e0d28cde15',
                                3066: '8b1d2ceb22d9fedde67b',
                                3263: '238cd2d620e004adee5a',
                                3353: 'de1d5e3e034ab68aa9fc',
                                3502: '1985af3fa836c4248178',
                                3596: 'e4f9354142134a911ace',
                                3610: 'c79c6bddd919cb78428a',
                                3717: '6f65e91a870250a6e450',
                                3780: 'ef366b87d104534e68d8',
                                3842: '8758110ab553b5368121',
                                3896: '14d9e7509c300245c219',
                                3914: '33b17e48eb923e015932',
                                3939: '2ee1e71dbe0bc0d85625',
                                3980: '9d7eeb2bacce45c508b3',
                                3986: 'b50fcad4f1b77533bda7',
                                4013: '1aa54900370f7317d3f0',
                                4015: '9b6607a6f543f077c5a5',
                                4062: '9229fac3ef3db26fd5bc',
                                4079: 'd3299bca6e9fad2c340a',
                                4102: '67b3d1107a6ec8d571eb',
                                4215: '8934b190aaed2663c300',
                                4370: '18ca7d93e5073f0446c0',
                                4389: '600804a9c180df6a83b1',
                                4403: 'bf44a542113a4440984b',
                                4648: '7172f75bb866b3438c6f',
                                4665: 'd7331dbca4a2aa0909e7',
                                4713: 'd82fc553d710da1606f0',
                                4781: 'e8294ba5c7c6aef1fce7',
                                4788: 'd3e8ad5f514051fcc835',
                                4862: '0b6cab4cb55e2cef2c40',
                                4894: '035fecc664874bb752b0',
                                4987: 'a23484dfcca6d5fae195',
                                5009: '9a37c608b4849a6f8a11',
                                5057: '5382614553878fcf337d',
                                5093: '75a373be3b6816e8b55a',
                                5128: '57de9f218989cee8119d',
                                5145: 'da831552b3b54ca47682',
                                5163: '953e65e04ed31b0ea0b3',
                                5164: 'a45b25a7ca6a0c16f810',
                                5166: '979eb8cba5281ffcb38b',
                                5516: '78732f5a01aa118efb81',
                                5551: '340e60e2342b0d93ebe7',
                                5565: '1144e5a1b4f8503ee572',
                                5598: '52ad6e6d7d7b134ab0ba',
                                5649: '5c1e55c9dad604880876',
                                5664: '87e81959e880fa8ba65d',
                                5866: '039e25226b82968cca61',
                                5940: 'c058b0e0ef421f740684',
                                5983: '3c0ae13972f5d3433a77',
                                5993: '0e5f49179c6a516963de',
                                6025: 'd669a0315da9d6fda6b3',
                                6036: '5b373caaaa6e1ba4495f',
                                6106: '1d31df88e63bf542ea7b',
                                6124: 'f1f53155460ee314f062',
                                6166: '9fb712c61440c609af69',
                                6214: '5a578175aab923a979dc',
                                6221: '56c4d15c823c019ddb39',
                                6265: 'b3553940c9159e24d8aa',
                                6408: 'e58aaf98d9306e8d9b77',
                                6456: '6dd3b88a86eba6172f5c',
                                6494: '7f264af8142cb9910c06',
                                6625: '364cf21fe24d7e675de8',
                                6631: '711ba6ae5b343ace8691',
                                6639: 'a1bd5bf1d51c681561a1',
                                6747: 'ae7a7ec28d22057d6d0d',
                                6752: '912872ffa56a7243d664',
                                6780: '3b96f58f66e0caa61b15',
                                6884: '07642217627127113fb0',
                                6918: 'c8f3265e9286a784038b',
                                6925: '665969c4af4481df0691',
                                6949: 'f50051a55eaa8dd5e780',
                                6985: '8d289318ce5fe6dc7763',
                                7051: 'ba50ecafb4527628fb40',
                                7078: 'cddce4ed266fd9e0629e',
                                7111: '4716f3208dc337521c10',
                                7129: '0bc2d3617dda7143f094',
                                7149: 'd450e8145ad7e6fbd67f',
                                7194: '098c1a8da1ddbbda98f6',
                                7260: '4d02fadc540256bf733e',
                                7271: 'da9eebe3af491996707c',
                                7350: 'aa555ff9e17c4029aedd',
                                7391: 'c63bd39c42093cc4130c',
                                7413: '3a52b91975b98e6fe8e4',
                                7550: '087936b2aa6ea51cd6bf',
                                7555: 'ea682716c26bc13db765',
                                7648: '02c87d9b20f743b5cf16',
                                7663: '6fabc58c7ddf7c2b076f',
                                7807: '6adfcf6c0792dc9c9363',
                                7871: 'df6a9177c293c0c53e80',
                                7987: '5d7c9d668ac98bd5bce1',
                                8020: '71213c4f755723965a80',
                                8056: 'c06a1c8fb4a1f18cf217',
                                8149: '9fb525d10e5c8ba95701',
                                8167: '3edae41386acc976c9f8',
                                8287: '7a7977ba76726177fb3c',
                                8313: '9c1267d07e48b8d8f53f',
                                8450: '757d38443ea38bd0165f',
                                8537: 'ae758430950906d90d11',
                                8643: '3a92633d0497afb5344c',
                                8882: '9838a8b1e0e6766b6408',
                                8890: '6a6e7744cd3263ce2887',
                                8904: '87e94e93ade13962a48f',
                                9039: '19bbb3fc39665da2e3e6',
                                9138: 'f516266ddcf6ca8c7064',
                                9327: '0c38440ca52f144413ac',
                                9374: '6ef1056ef156ddb4caf1',
                                9403: '61498701a4dae3f700c2',
                                9465: 'ca5284cff2560957cdd6',
                                9498: 'f43b3c60275506b2198a',
                                9685: 'f25fb7b89b7e831b726c',
                                9754: '91018047180ff0d9e40b',
                                9789: '458feb5c8c0263b0618b',
                                9842: '581808dd4a8651b16779',
                                9916: '0c2cb2d12479a20efce1',
                              }[e] +
                              '.js'),
    (r.miniCssF = (e) =>
      e +
      '.' +
      {
        6: '362fa6a7ab1f3e3b06c4',
        524: 'ef662c4bc3e57dd91171',
        826: '2effba57f47544e58368',
        855: '56a5e53c97d91a9f96f7',
        898: 'f909d7c1efc95f635922',
        956: '1e89775cfd644d656c56',
        1033: '5197f9f8b8500206d06c',
        1109: 'b1ced88f4a839badfff1',
        1762: '7ff6b353c441db2276da',
        1803: '4653bb65d2b0d594d6af',
        2109: '4d5de3fbde1cd7dc5e9f',
        2191: 'bb0aa12f5e562fd483f3',
        2260: 'b98824e4829a1aa9b444',
        2486: '82c7dba4839761a57f28',
        2587: '1f1100dc01693edfe269',
        2639: '7b1d42eef7b89e0e96d3',
        2666: 'fbb750fd312778403036',
        2676: '2d3cabbd39a3b0d6e9ea',
        2731: 'ec19f123cabf8efd03a4',
        3066: '58a325f25b087530293d',
        3353: '860146c59230ab4bd938',
        3502: 'c49903f7222870ff8aca',
        3610: '11b7ad14e26429fdfa5d',
        3717: '856421c70a4dff35762a',
        3780: 'a289557f2e0bcabcc4ca',
        3842: '8cf6b523fd5a5b6fb022',
        3896: '96db838d3467bcf68051',
        3914: 'd2b6c577f350629b6837',
        3939: '4d0187960a564ff5a557',
        3980: 'b2ff45a2d8bb6a131d7c',
        4015: '1d0e3a62a59d173c81f3',
        4102: '4abd8542fa3aa3e7fd5d',
        4215: 'd24836a292b1969ab4bb',
        4781: 'cf1365a3bf51d9989978',
        4788: '3cff897925f7a8dbc837',
        4894: '99d4c2794da9feef3c70',
        4987: 'ca5d16a7e990d39bfb0e',
        5145: 'a2b224fd27ab2941c565',
        5163: '950dd1d584f76da1ed3b',
        5166: 'a12c50ad6225ca6de843',
        5649: 'b60ed09c5ea8c55827d4',
        5866: 'f164dd2a584ab0f493cf',
        5940: 'aedc1bdbd324e6042b17',
        5993: '4705829d0834140ee3f2',
        6025: '263b457b1a7f9ca139b2',
        6036: '3b493a9f0ab052e6447c',
        6106: 'f01163745d787b60c86c',
        6214: '65b7dbf8be6cca5ac143',
        6221: 'bc53670dfb8f982908a2',
        6494: '4c212043f24336e170d5',
        6625: '0ed88fc3a989c98408cc',
        6639: '885b5577e3fb71ee2bea',
        6747: 'c7d403ae692f88568278',
        6752: '207eb3cc75b3ed2c6754',
        6884: 'bb7d30a7bbbe5af36556',
        6925: 'a3a09d7303a96edb77cb',
        6949: '19355e81a60b640ea097',
        6985: '2cd225354e2fd236e8e9',
        7111: 'b16b4eb739a7e8577559',
        7149: '12adbb19fdefe9b66b18',
        7194: 'e04f69c8933166966874',
        7350: '00632eec360f0cf2d9a0',
        7391: '9c809fa91ed0c8f75bc0',
        7413: 'f830ad1ad6ee6f9b1cb3',
        7555: '8c1e3939e7666b0f8c69',
        7807: '8577632fdab29ee53ddf',
        7871: 'fff454908cba03863eb7',
        8056: '1f54f717d8e522c55c89',
        8149: '21f2b01074a4d082e268',
        8287: '2b6f71ec5c0064590ffd',
        8450: 'f75ab24e1ecb22d29183',
        8904: 'a302177fe7e3ccd50cb0',
        9138: '03b8fbcfabcae851949a',
        9327: '97be240031495a68333f',
        9403: 'db9859ab09623682562c',
        9465: 'fd61e82b3c912f2e9fad',
        9789: 'cb5ad20bc727d3820b6c',
        9842: 'ceaeabba258d065497c8',
        9916: '60c48148a54dba9504a0',
      }[e] +
      '.css'),
    (r.g = (function () {
      if ('object' == typeof globalThis) return globalThis
      try {
        return this || new Function('return this')()
      } catch (e) {
        if ('object' == typeof window) return window
      }
    })()),
    (r.hmd = (e) => (
      (e = Object.create(e)).children || (e.children = []),
      Object.defineProperty(e, 'exports', {
        enumerable: !0,
        set: () => {
          throw new Error(
            'ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' +
              e.id,
          )
        },
      }),
      e
    )),
    (r.o = (e, a) => Object.hasOwn(e, a)),
    (c = {}),
    (t = 'tradingview:'),
    (r.l = (e, a, d, f) => {
      if (c[e]) c[e].push(a)
      else {
        var b, n
        if (void 0 !== d)
          for (
            var o = document.getElementsByTagName('script'), i = 0;
            i < o.length;
            i++
          ) {
            var l = o[i]
            if (
              l.getAttribute('src') == e ||
              l.getAttribute('data-webpack') == t + d
            ) {
              b = l
              break
            }
          }
        b ||
          ((n = !0),
          ((b = document.createElement('script')).charset = 'utf-8'),
          (b.timeout = 120),
          r.nc && b.setAttribute('nonce', r.nc),
          b.setAttribute('data-webpack', t + d),
          (b.src = e),
          0 !== b.src.indexOf(window.location.origin + '/') &&
            (b.crossOrigin = 'anonymous')),
          (c[e] = [a])
        var s = (a, d) => {
            ;(b.onerror = b.onload = null), clearTimeout(u)
            var t = c[e]
            if (
              (delete c[e],
              b.parentNode && b.parentNode.removeChild(b),
              t && t.forEach((e) => e(d)),
              a)
            )
              return a(d)
          },
          u = setTimeout(
            s.bind(null, void 0, { type: 'timeout', target: b }),
            12e4,
          )
        ;(b.onerror = s.bind(null, b.onerror)),
          (b.onload = s.bind(null, b.onload)),
          n && document.head.appendChild(b)
      }
    }),
    (r.r = (e) => {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 })
    }),
    (r.nmd = (e) => ((e.paths = []), e.children || (e.children = []), e)),
    (() => {
      var e
      r.g.importScripts && (e = r.g.location + '')
      var a = r.g.document
      if (!e && a && (a.currentScript && (e = a.currentScript.src), !e)) {
        var d = a.getElementsByTagName('script')
        d.length && (e = d[d.length - 1].src)
      }
      if (!e)
        throw new Error('Automatic publicPath is not supported in this browser')
      ;(e = e
        .replace(/#.*$/, '')
        .replace(/\?.*$/, '')
        .replace(/\/[^\/]+$/, '/')),
        (r.p = e)
    })(),
    r.g.location &&
      r.p.startsWith(r.g.location.origin) &&
      (r.p = r.p.slice(r.g.location.origin.length)),
    (() => {
      const e = r.u
      r.u = (a) => e(a).replace('__LANG__', r.g.language)
    })(),
    (() => {
      const e = {
        ca_ES: (e = 1) => +(1 != e),
        cs: (e = 1) => +(1 == e ? 0 : e >= 2 && e <= 4 ? 1 : 2),
        el: (e = 1) => +(1 != e),
        da_DK: (e = 1) => +(1 != e),
        en: (e = 1) => +(1 != e),
        et_EE: (e = 1) => +(1 != e),
        fa: (e = 1) => 0,
        hu_HU: (e = 1) => 0,
        id_ID: (e = 1) => 0,
        it: (e = 1) => +(1 != e),
        ms_MY: (e = 1) => 0,
        no: (e = 1) => +(1 != e),
        nl_NL: (e = 1) => +(1 != e),
        ro: (e = 1) =>
          +(1 == e ? 0 : e % 100 > 19 || (e % 100 == 0 && 0 != e) ? 2 : 1),
        sk_SK: (e = 1) => +(1 == e ? 0 : e >= 2 && e <= 4 ? 1 : 2),
        sv: (e = 1) => +(1 != e),
        zh: (e = 1) => 0,
        zh_TW: (e = 1) => 0,
        de: (e = 1) => +(1 != e),
        es: (e = 1) => +(1 != e),
        fr: (e = 1) => +(e > 1),
        he_IL: (e = 1) =>
          +(1 == e ? 0 : 2 == e ? 1 : e > 10 && e % 10 == 0 ? 2 : 3),
        ko: (e = 1) => 0,
        ja: (e = 1) => 0,
        pl: (e = 1) =>
          +(1 == e
            ? 0
            : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20)
              ? 1
              : 2),
        pt: (e = 1) => +(1 != e),
        tr: (e = 1) => +(1 != e),
        vi: (e = 1) => 0,
        ar: (e = 1) =>
          +(0 == e
            ? 0
            : 1 == e
              ? 1
              : 2 == e
                ? 2
                : e % 100 >= 3 && e % 100 <= 10
                  ? 3
                  : e % 100 >= 11 && e % 100 <= 99
                    ? 4
                    : 5),
        ru: (e = 1) =>
          +(e % 10 == 1 && e % 100 != 11
            ? 0
            : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20)
              ? 1
              : 2),
        th: (e = 1) => 0,
      }
      r.tf = (a, d = {}, c) => {
        if (null === a) {
          if (Array.isArray(c)) {
            if (r.g.customTranslateFunction) {
              const e = r.g.customTranslateFunction(
                c[0],
                d.plural
                  ? { ...d, plural: c.length > 2 ? c.slice(1) : c[1] }
                  : d,
                !0,
              )
              if (null !== e) return e
            }
            return (c[e[r.g.language](d.count)] || c[0]).replace(
              /{(\w+)}/g,
              (e, a) =>
                void 0 !== (d.replace || d)[a] ? (d.replace || d)[a] : e,
            )
          }
          return 'object' == typeof c
            ? r.tf(null, d, c[r.g.language || 'en'])
            : r.tf(c, d)
        }
        if (c && a) {
          const e = `${a}${d.context ? `_${d.context}` : ''}`
          if (c[e]) return r.tf(null, d, c[e])
        }
        if ('number' == typeof a) return a.toString()
        if ('string' != typeof a) return ''
        if (r.g.customTranslateFunction) {
          const e = r.g.customTranslateFunction(a, d, !1)
          if (null !== e) return e
        }
        return (d.plural && 1 != +d.count ? d.plural : a).replace(
          /{(\w+)}/g,
          (e, a) => (void 0 !== (d.replace || d)[a] ? (d.replace || d)[a] : e),
        )
      }
    })(),
    (r.p = r.g.WEBPACK_PUBLIC_PATH || r.p)
  var n = r.e,
    o = Object.create(null)
  function i(e, a) {
    return n(e).catch(
      () =>
        new Promise((d) => {
          var c = () => {
            self.removeEventListener('online', c, !1),
              !1 === navigator.onLine
                ? self.addEventListener('online', c, !1)
                : d(a < 2 ? i(e, a + 1) : n(e))
          }
          setTimeout(c, a * a * 1e3)
        }),
    )
  }
  ;(r.e = (e) => {
    if (!o[e]) {
      o[e] = i(e, 0)
      var a = () => {
        delete o[e]
      }
      o[e].then(a, a)
    }
    return o[e]
  }),
    (() => {
      if ('undefined' != typeof document) {
        var e = (e) =>
            new Promise((a, d) => {
              var c = r.miniCssF(e),
                t = r.p + c
              if (
                ((e, a) => {
                  for (
                    var d = document.getElementsByTagName('link'), c = 0;
                    c < d.length;
                    c++
                  ) {
                    var t =
                      (b = d[c]).getAttribute('data-href') ||
                      b.getAttribute('href')
                    if ('stylesheet' === b.rel && (t === e || t === a)) return b
                  }
                  var f = document.getElementsByTagName('style')
                  for (c = 0; c < f.length; c++) {
                    var b
                    if (
                      (t = (b = f[c]).getAttribute('data-href')) === e ||
                      t === a
                    )
                      return b
                  }
                })(c, t)
              )
                return a()
              ;((e, a, d, c, t) => {
                var f = document.createElement('link')
                ;(f.rel = 'stylesheet'),
                  (f.type = 'text/css'),
                  (f.onerror = f.onload =
                    (d) => {
                      if (((f.onerror = f.onload = null), 'load' === d.type))
                        c()
                      else {
                        var b = d && ('load' === d.type ? 'missing' : d.type),
                          r = (d && d.target && d.target.href) || a,
                          n = new Error(
                            'Loading CSS chunk ' + e + ' failed.\n(' + r + ')',
                          )
                        ;(n.code = 'CSS_CHUNK_LOAD_FAILED'),
                          (n.type = b),
                          (n.request = r),
                          f.parentNode && f.parentNode.removeChild(f),
                          t(n)
                      }
                    }),
                  (f.href = a),
                  0 !== f.href.indexOf(window.location.origin + '/') &&
                    (f.crossOrigin = 'anonymous'),
                  d
                    ? d.parentNode.insertBefore(f, d.nextSibling)
                    : document.head.appendChild(f)
              })(e, t, null, a, d)
            }),
          a = { 3666: 0 }
        r.f.miniCss = (d, c) => {
          a[d]
            ? c.push(a[d])
            : 0 !== a[d] &&
              {
                6: 1,
                524: 1,
                826: 1,
                855: 1,
                898: 1,
                956: 1,
                1033: 1,
                1109: 1,
                1762: 1,
                1803: 1,
                2109: 1,
                2191: 1,
                2260: 1,
                2486: 1,
                2587: 1,
                2639: 1,
                2666: 1,
                2676: 1,
                2731: 1,
                3066: 1,
                3353: 1,
                3502: 1,
                3610: 1,
                3717: 1,
                3780: 1,
                3842: 1,
                3896: 1,
                3914: 1,
                3939: 1,
                3980: 1,
                4015: 1,
                4102: 1,
                4215: 1,
                4781: 1,
                4788: 1,
                4894: 1,
                4987: 1,
                5145: 1,
                5163: 1,
                5166: 1,
                5649: 1,
                5866: 1,
                5940: 1,
                5993: 1,
                6025: 1,
                6036: 1,
                6106: 1,
                6214: 1,
                6221: 1,
                6494: 1,
                6625: 1,
                6639: 1,
                6747: 1,
                6752: 1,
                6884: 1,
                6925: 1,
                6949: 1,
                6985: 1,
                7111: 1,
                7149: 1,
                7194: 1,
                7350: 1,
                7391: 1,
                7413: 1,
                7555: 1,
                7807: 1,
                7871: 1,
                8056: 1,
                8149: 1,
                8287: 1,
                8450: 1,
                8904: 1,
                9138: 1,
                9327: 1,
                9403: 1,
                9465: 1,
                9789: 1,
                9842: 1,
                9916: 1,
              }[d] &&
              c.push(
                (a[d] = e(d).then(
                  () => {
                    a[d] = 0
                  },
                  (e) => {
                    throw (delete a[d], e)
                  },
                )),
              )
        }
      }
    })(),
    (() => {
      var e = { 3666: 0, 6150: 0 }
      ;(r.f.j = (a, d) => {
        var c = r.o(e, a) ? e[a] : void 0
        if (0 !== c)
          if (c) d.push(c[2])
          else if (
            /^(1(033|109|762|803)|2(6(39|66|76)|109|191|260|486|587|731)|3(9(14|39|80)|(06|66|89)6|353|502|610|717|780|842)|4(78[18]|[02]15|102|894|987)|5(1(45|63|66)|24|649|866|940|993)|6(9(25|49|85)|[06]25|(21|49|88)4||036|106|150|221|639|747|752)|7(1(11|49|94)|350|391|413|555|807|871)|8(056|149|26|287|450|55|904|98)|9(138|327|403|465|56|789|842|916))$/.test(
              a,
            )
          )
            e[a] = 0
          else {
            var t = new Promise((d, t) => (c = e[a] = [d, t]))
            d.push((c[2] = t))
            var f = r.p + r.u(a),
              b = new Error()
            r.l(
              f,
              (d) => {
                if (r.o(e, a) && (0 !== (c = e[a]) && (e[a] = void 0), c)) {
                  var t = d && ('load' === d.type ? 'missing' : d.type),
                    f = d && d.target && d.target.src
                  ;(b.message =
                    'Loading chunk ' + a + ' failed.\n(' + t + ': ' + f + ')'),
                    (b.name = 'ChunkLoadError'),
                    (b.type = t),
                    (b.request = f),
                    c[1](b)
                }
              },
              'chunk-' + a,
              a,
            )
          }
      }),
        (r.O.j = (a) => 0 === e[a])
      var a = (a, d) => {
          var c,
            t,
            [f, b, n] = d,
            o = 0
          if (f.some((a) => 0 !== e[a])) {
            for (c in b) r.o(b, c) && (r.m[c] = b[c])
            if (n) var i = n(r)
          }
          for (a && a(d); o < f.length; o++)
            (t = f[o]), r.o(e, t) && e[t] && e[t][0](), (e[t] = 0)
          return r.O(i)
        },
        d = (self.webpackChunktradingview = self.webpackChunktradingview || [])
      d.forEach(a.bind(null, 0)), (d.push = a.bind(null, d.push.bind(d)))
    })(),
    (() => {
      const { miniCssF: e } = r
      r.miniCssF = (a) =>
        self.document && 'rtl' === self.document.dir
          ? e(a).replace(/\.css$/, '.rtl.css')
          : e(a)
    })()
})()
