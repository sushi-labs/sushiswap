;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3596],
  {
    708416: (e, t, i) => {
      i.r(t), i.d(t, { ChartPropertyDefinitionsViewModel: () => Qi })
      var n = i(650151),
        o = i(609838),
        r = i(156963),
        l = i(247905),
        a = i(382280),
        s = i(650802),
        c = i(308954),
        d = i(98361),
        u = i(493898),
        p = i(337951),
        h = i(482847),
        v = i(44520),
        g = i(213118),
        y = i(664902),
        P = i(681434),
        f = i(212903),
        b = i(648067),
        m = i(721356),
        w = i(144273)
      const T = new y.TranslatedString(
          'change symbol description visibility',
          o.t(null, void 0, i(26717)),
        ),
        S = new y.TranslatedString(
          'change symbol legend format',
          o.t(null, void 0, i(795071)),
        ),
        D = new y.TranslatedString(
          'change open market status visibility',
          o.t(null, void 0, i(118644)),
        ),
        C = new y.TranslatedString(
          'change OHLC values visibility',
          o.t(null, void 0, i(457889)),
        ),
        _ = new y.TranslatedString(
          'change last day change visibility',
          o.t(null, void 0, i(250058)),
        ),
        V = new y.TranslatedString(
          'change bar change visibility',
          o.t(null, void 0, i(845110)),
        ),
        L = new y.TranslatedString(
          'change indicator arguments visibility',
          o.t(null, void 0, i(96162)),
        ),
        k = new y.TranslatedString(
          'change indicator titles visibility',
          o.t(null, void 0, i(231325)),
        ),
        O = new y.TranslatedString(
          'change indicator values visibility',
          o.t(null, void 0, i(399774)),
        ),
        R = new y.TranslatedString(
          'change legend background visibility',
          o.t(null, void 0, i(761061)),
        ),
        E = new y.TranslatedString(
          'change legend background transparency',
          o.t(null, void 0, i(597956)),
        ),
        W = new y.TranslatedString(
          'change volume values visibility',
          o.t(null, void 0, i(709455)),
        ),
        x = new y.TranslatedString(
          'change symbol field visibility',
          o.t(null, void 0, i(606091)),
        ),
        M = o.t(null, void 0, i(515474)),
        A = o.t(null, void 0, i(767369)),
        N = o.t(null, void 0, i(199487)),
        G = o.t(null, void 0, i(37274)),
        I = o.t(null, void 0, i(22519)),
        F = o.t(null, void 0, i(101111)),
        H = o.t(null, void 0, i(331326)),
        B = o.t(null, void 0, i(768791)),
        Z = o.t(null, void 0, i(391322)),
        z = o.t(null, void 0, i(527331)),
        j = o.t(null, void 0, i(775991)),
        U = o.t(null, void 0, i(224248)),
        K = r.enabled('symbol_info_price_source'),
        J =
          r.enabled('show_symbol_logos') &&
          r.enabled('show_symbol_logo_in_legend')
      var q = i(619141),
        Y = i(849303),
        Q = i(122217),
        X = i(34648),
        $ = i(650835)
      const ee = r.enabled('show_average_close_price_line_and_label'),
        te = new y.TranslatedString(
          'change symbol labels visibility',
          o.t(null, void 0, i(109402)),
        ),
        ie = new y.TranslatedString(
          'change symbol last value visibility',
          o.t(null, void 0, i(253150)),
        ),
        ne = new y.TranslatedString(
          'change symbol last value mode',
          o.t(null, void 0, i(728741)),
        ),
        oe = new y.TranslatedString(
          'change symbol previous close value visibility',
          o.t(null, void 0, i(112707)),
        ),
        re = new y.TranslatedString(
          'change bid and ask labels visibility',
          o.t(null, void 0, i(805100)),
        ),
        le =
          (new y.TranslatedString(
            'change pre/post market price label visibility',
            o.t(null, void 0, i(549889)),
          ),
          new y.TranslatedString(
            'change high and low price labels visibility',
            o.t(null, void 0, i(466805)),
          )),
        ae = new y.TranslatedString(
          'change average close price label visibility',
          o.t(null, void 0, i(739402)),
        ),
        se =
          (new y.TranslatedString(
            'change indicators and financials name labels visibility',
            o.t(null, void 0, i(559820)),
          ),
          new y.TranslatedString(
            'change indicators name labels visibility',
            o.t(null, void 0, i(387027)),
          )),
        ce =
          (new y.TranslatedString(
            'change indicators and financials value labels visibility',
            o.t(null, void 0, i(90512)),
          ),
          new y.TranslatedString(
            'change indicators value labels visibility',
            o.t(null, void 0, i(114922)),
          )),
        de = new y.TranslatedString(
          'change no overlapping labels',
          o.t(null, void 0, i(783935)),
        ),
        ue = new y.TranslatedString(
          'change countdown to bar close visibility',
          o.t(null, void 0, i(58108)),
        ),
        pe = new y.TranslatedString(
          'change currency label visibility',
          o.t(null, void 0, i(284060)),
        ),
        he = new y.TranslatedString(
          'change scale modes buttons visibility',
          o.t(null, void 0, i(847361)),
        ),
        ve = new y.TranslatedString(
          'change unit label visibility',
          o.t(null, void 0, i(607011)),
        ),
        ge = new y.TranslatedString(
          'change currency and unit labels visibility',
          o.t(null, void 0, i(688161)),
        ),
        ye = new y.TranslatedString(
          'change plus button visibility',
          o.t(null, void 0, i(450190)),
        ),
        Pe = new y.TranslatedString(
          'toggle lock scale',
          o.t(null, void 0, i(121203)),
        ),
        fe = new y.TranslatedString(
          'change price to bar ratio',
          o.t(null, void 0, i(569510)),
        ),
        be = new y.TranslatedString(
          'change date format',
          o.t(null, void 0, i(50457)),
        ),
        me = new y.TranslatedString(
          'change time hours format',
          o.t(null, void 0, i(876991)),
        ),
        we =
          (new y.TranslatedString(
            'change day of week on labels',
            o.t(null, void 0, i(607104)),
          ),
          o.t(null, void 0, i(435383))),
        Te = o.t(null, void 0, i(327767)),
        Se = o.t(null, void 0, i(540847)),
        De = (o.t(null, void 0, i(25084)), o.t(null, void 0, i(409654))),
        Ce = (o.t(null, void 0, i(829687)), o.t(null, void 0, i(234905))),
        _e = o.t(null, void 0, i(947586)),
        Ve = (o.t(null, void 0, i(674823)), o.t(null, void 0, i(695036))),
        Le = o.t(null, void 0, i(760971)),
        ke = o.t(null, void 0, i(242502)),
        Oe = o.t(null, void 0, i(878905)),
        Re = o.t(null, void 0, i(894370)),
        Ee = o.t(null, void 0, i(50985)),
        We = o.t(null, void 0, i(677534)),
        xe = o.t(null, void 0, i(217319)),
        Me = o.t(null, void 0, i(847926)),
        Ae = o.t(null, void 0, i(897378)),
        Ne = o.t(null, void 0, i(753224)),
        Ge = o.t(null, void 0, i(518219)),
        Ie = o.t(null, void 0, i(164859)),
        Fe = o.t(null, void 0, i(625209)),
        He = o.t(null, void 0, i(997316)),
        Be = o.t(null, void 0, i(743637)),
        Ze =
          (o.t(null, void 0, i(555090)),
          [
            {
              value: q.PriceAxisLastValueMode.LastPriceAndPercentageValue,
              title: o.t(null, void 0, i(676523)),
            },
            {
              value: q.PriceAxisLastValueMode.LastValueAccordingToScale,
              title: o.t(null, void 0, i(680170)),
            },
          ])
      var ze = i(738102),
        je = i(444474),
        Ue = i(52167)
      const Ke = new y.TranslatedString(
          'change sessions breaks visibility',
          o.t(null, void 0, i(871589)),
        ),
        Je = new y.TranslatedString(
          'change sessions breaks color',
          o.t(null, void 0, i(501579)),
        ),
        qe = new y.TranslatedString(
          'change sessions breaks width',
          o.t(null, void 0, i(515035)),
        ),
        Ye = new y.TranslatedString(
          'change sessions breaks style',
          o.t(null, void 0, i(121460)),
        ),
        Qe = o.t(null, void 0, i(259827))
      const Xe = new y.TranslatedString(
          'change chart background color',
          o.t(null, void 0, i(899011)),
        ),
        $e = new y.TranslatedString(
          'change chart background type',
          o.t(null, void 0, i(972458)),
        ),
        et = new y.TranslatedString(
          'change vert grid lines color',
          o.t(null, void 0, i(722722)),
        ),
        tt = new y.TranslatedString(
          'change horz grid lines color',
          o.t(null, void 0, i(988096)),
        ),
        it = new y.TranslatedString(
          'change grid lines visibility',
          o.t(null, void 0, i(827764)),
        ),
        nt = new y.TranslatedString(
          'change scales text color',
          o.t(null, void 0, i(635065)),
        ),
        ot = new y.TranslatedString(
          'change scales font size',
          o.t(null, void 0, i(484382)),
        ),
        rt = new y.TranslatedString(
          'change scales lines color',
          o.t(null, void 0, i(512468)),
        ),
        lt = new y.TranslatedString(
          'change pane separators color',
          o.t(null, void 0, i(989032)),
        ),
        at = new y.TranslatedString(
          'change crosshair color',
          o.t(null, void 0, i(529951)),
        ),
        st = new y.TranslatedString(
          'change crosshair width',
          o.t(null, void 0, i(37034)),
        ),
        ct = new y.TranslatedString(
          'change crosshair style',
          o.t(null, void 0, i(792027)),
        ),
        dt = new y.TranslatedString(
          'change symbol watermark visibility',
          o.t(null, void 0, i(687159)),
        ),
        ut = new y.TranslatedString(
          'change symbol watermark color',
          o.t(null, void 0, i(225616)),
        ),
        pt = new y.TranslatedString(
          'change navigation buttons visibility',
          o.t(null, void 0, i(935646)),
        ),
        ht = new y.TranslatedString(
          'change pane buttons visibility',
          o.t(null, void 0, i(537730)),
        ),
        vt = new y.TranslatedString(
          'change top margin',
          o.t(null, void 0, i(598905)),
        ),
        gt = new y.TranslatedString(
          'change bottom margin',
          o.t(null, void 0, i(210349)),
        ),
        yt = new y.TranslatedString(
          'change right margin',
          o.t(null, void 0, i(135636)),
        ),
        Pt = new y.TranslatedString(
          'change right margin percentage',
          o.t(null, void 0, i(966601)),
        ),
        ft = o.t(null, void 0, i(527331)),
        bt = o.t(null, void 0, i(437174)),
        mt = o.t(null, void 0, i(199113)),
        wt = o.t(null, void 0, i(734403)),
        Tt = o.t(null, void 0, i(149199)),
        St = o.t(null, void 0, i(339392)),
        Dt = o.t(null, void 0, i(37229)),
        Ct = o.t(null, void 0, i(583182)),
        _t = o.t(null, void 0, i(373908)),
        Vt = o.t(null, void 0, i(46720)),
        Lt = o.t(null, void 0, i(577705)),
        kt = o.t(null, void 0, i(874343)),
        Ot = o.t(null, void 0, i(750446)),
        Rt = o.t(null, void 0, i(865994)),
        Et = o.t(null, void 0, i(691757)),
        Wt = o.t(null, void 0, i(221141)),
        xt = o.t(null, void 0, i(936014)),
        Mt = o.t(null, void 0, i(16812)),
        At = o.t(null, { context: 'unit' }, i(650831))
      function Nt(e, t, n, l, a, d, u, p, h, v) {
        const g = [],
          y = [],
          P = [],
          f = [],
          m = [],
          w = (0, c.createColorPropertyDefinition)(
            {
              color: (0, c.getColorDefinitionProperty)(
                e,
                t.background,
                null,
                Xe,
              ),
              gradientColor1: (0, c.getColorDefinitionProperty)(
                e,
                t.backgroundGradientStartColor,
                null,
                Xe,
              ),
              gradientColor2: (0, c.getColorDefinitionProperty)(
                e,
                t.backgroundGradientEndColor,
                null,
                Xe,
              ),
              type: (0, c.convertToDefinitionProperty)(e, t.backgroundType, $e),
            },
            { id: 'chartBackground', title: ft, noAlpha: !0 },
          ),
          T = t.vertGridProperties.childs(),
          S = t.horzGridProperties.childs(),
          D = (0, c.createOptionalTwoColorsPropertyDefinition)(
            {
              option: (0, c.convertToDefinitionProperty)(
                e,
                t.gridLinesMode,
                it,
              ),
              color1: (0, c.getColorDefinitionProperty)(e, T.color, null, et),
              color2: (0, c.getColorDefinitionProperty)(e, S.color, null, tt),
            },
            {
              id: 'gridLines',
              title: St,
              options: new s.WatchedValue([
                { title: bt, value: 'both' },
                {
                  title: mt,
                  value: 'vert',
                },
                { title: wt, value: 'horz' },
                { title: Tt, value: 'none' },
              ]),
              color1Visible: v.vertLinesVisible,
              color2Visible: v.horzLinesVisible,
            },
          ),
          C = (0, b.createWVFromGetterAndSubscription)(
            () => 1 !== e.model().panes().length,
            e.model().panesCollectionChanged(),
          ),
          _ = (0, c.createLinePropertyDefinition)(
            {
              visible: (0, c.convertFromReadonlyWVToDefinitionProperty)(
                C.ownership(),
              ),
              color: (0, c.getColorDefinitionProperty)(
                e,
                t.separatorColor,
                null,
                lt,
              ),
            },
            { id: 'paneSeparators', title: _t },
          ),
          V = t.crossHairProperties.childs(),
          L = (0, c.createLinePropertyDefinition)(
            {
              color: (0, c.getColorDefinitionProperty)(
                e,
                V.color,
                V.transparency,
                at,
              ),
              width: (0, c.convertToDefinitionProperty)(e, V.width, st),
              style: (0, c.convertToDefinitionProperty)(e, V.style, ct),
            },
            { id: 'crossHair', title: Vt },
          )
        g.push(w, D)
        {
          const t = ((e) => {
            const t = e
                .model()
                .sessions()
                .properties()
                .childs()
                .graphics.childs()
                .vertlines.childs()
                .sessBreaks.childs(),
              i = (0, ze.combineProperty)(
                (e) => !e,
                e.mainSeries().isDWMProperty().weakReference(),
              )
            return (0, Ue.createLinePropertyDefinition)(
              {
                visible: (0, je.makeProxyDefinitionProperty)(i.ownership()),
                checked: (0, c.convertToDefinitionProperty)(e, t.visible, Ke),
                color: (0, c.getColorDefinitionProperty)(e, t.color, null, Je),
                width: (0, c.convertToDefinitionProperty)(e, t.width, qe),
                style: (0, c.convertToDefinitionProperty)(e, t.style, Ye),
              },
              { id: 'sessionBeaks', title: Qe },
            )
          })(e)
          g.push(t)
        }
        if ((g.push(_, L), null !== n)) {
          const t = (0, c.createColorPropertyDefinition)(
            {
              checked: (0, c.convertToDefinitionProperty)(e, n.visibility, dt),
              color: (0, c.getColorDefinitionProperty)(e, n.color, null, ut),
            },
            { id: 'watermark', title: Lt },
          )
          g.push(t)
        }
        const k = (0, c.createTextPropertyDefinition)(
            {
              color: (0, c.getColorDefinitionProperty)(
                e,
                l.textColor,
                null,
                nt,
              ),
              size: (0, c.convertToDefinitionProperty)(e, l.fontSize, ot),
            },
            { id: 'scalesText', title: Dt },
          ),
          O = (0, c.createLinePropertyDefinition)(
            {
              color: (0, c.getColorDefinitionProperty)(
                e,
                l.lineColor,
                null,
                rt,
              ),
            },
            { id: 'scalesLine', title: Ct },
          )
        y.push(k, O)
        const R = (0, c.createOptionsPropertyDefinition)(
            { option: (0, c.convertToDefinitionProperty)(e, d.property, pt) },
            {
              id: 'navButtons',
              title: kt,
              options: new s.WatchedValue(d.values),
            },
          ),
          E = (0, c.createOptionsPropertyDefinition)(
            { option: (0, c.convertToDefinitionProperty)(e, u.property, ht) },
            {
              id: 'paneButtons',
              title: Ot,
              options: new s.WatchedValue(u.values),
            },
          )
        P.push(R, E)
        const W = (0, c.createNumberPropertyDefinition)(
            {
              value: (0, c.convertToDefinitionProperty)(e, t.topMargin, vt, [
                Y.floor,
              ]),
            },
            {
              type: 0,
              id: 'paneTopMargin',
              title: Rt,
              min: new s.WatchedValue(0),
              max: new s.WatchedValue(25),
              step: new s.WatchedValue(1),
              unit: new s.WatchedValue('%'),
            },
          ),
          x = (0, c.createNumberPropertyDefinition)(
            {
              value: (0, c.convertToDefinitionProperty)(e, t.bottomMargin, gt, [
                Y.floor,
              ]),
            },
            {
              type: 0,
              id: 'paneBottomMargin',
              title: Et,
              min: new s.WatchedValue(0),
              max: new s.WatchedValue(25),
              step: new s.WatchedValue(1),
              unit: new s.WatchedValue('%'),
            },
          )
        if (
          (f.push(W, x), r.enabled('chart_property_page_right_margin_editor'))
        ) {
          const t = {
              value: (0, c.convertFromWVToDefinitionProperty)(e, a.value, yt, [
                Y.floor,
              ]),
            },
            i = {
              type: 0,
              id: 'paneRightMargin',
              title: Wt,
              min: a.min,
              max: a.max,
              step: new s.WatchedValue(1),
              unit: new s.WatchedValue(At),
            }
          if (r.enabled('show_percent_option_for_right_margin')) {
            const n = (0, c.createNumberPropertyDefinition)(
                {
                  ...t,
                  checked: (0, c.convertFromWVToDefinitionProperty)(e, h, Pt, [
                    (e) => !e,
                    (e) => !e,
                  ]),
                },
                { ...i, title: Mt },
              ),
              o = (0, c.createNumberPropertyDefinition)(
                {
                  checked: (0, c.convertFromWVToDefinitionProperty)(e, h, Pt),
                  value: (0, c.convertFromWVToDefinitionProperty)(e, p, Pt, [
                    Y.floor,
                  ]),
                },
                {
                  type: 0,
                  id: 'paneRightMarginPercentage',
                  title: xt,
                  min: new s.WatchedValue(0),
                  max: new s.WatchedValue(99),
                  step: new s.WatchedValue(1),
                  unit: new s.WatchedValue('%'),
                },
              )
            m.push(n), m.push(o)
          } else {
            const e = (0, c.createNumberPropertyDefinition)(t, i)
            f.push(e)
          }
        }
        const M = [
          (0, c.createPropertyDefinitionsGeneralGroup)(
            g,
            'chartBasicStylesAppearanceGroup',
            o.t(null, void 0, i(288364)),
          ),
          (0, c.createPropertyDefinitionsGeneralGroup)(
            y,
            'scalesAppearanceGroup',
            o.t(null, void 0, i(643115)),
          ),
          (0, c.createPropertyDefinitionsGeneralGroup)(
            P,
            'buttonsAppearanceGroup',
            o.t(null, void 0, i(187845)),
          ),
          (0, c.createPropertyDefinitionsGeneralGroup)(
            f,
            'marginsAppearanceGroup',
            o.t(null, void 0, i(766653)),
          ),
        ]
        return (
          m.length > 0 &&
            M.push(
              (0, c.createPropertyDefinitionsGeneralGroup)(
                m,
                'rightMarginsAppearanceGroup',
                o.t(null, void 0, i(340187)),
              ),
            ),
          { definitions: M }
        )
      }
      var Gt = i(261456),
        It = i(556691),
        Ft = i(906355),
        Ht = i(565626)
      const Bt = new y.TranslatedString(
          'change buy/sell buttons visibility',
          o.t(null, void 0, i(477223)),
        ),
        Zt = o.t(null, void 0, i(217329))
      const zt = new y.TranslatedString(
          'change brackets PL visibility',
          o.t(null, void 0, i(151175)),
        ),
        jt = new y.TranslatedString(
          'change brackets PL display mode',
          o.t(null, void 0, i(154119)),
        ),
        Ut = new y.TranslatedString(
          'change positions PL visibility',
          o.t(null, void 0, i(792476)),
        ),
        Kt = new y.TranslatedString(
          'change positions PL display mode',
          o.t(null, void 0, i(485749)),
        ),
        Jt = new y.TranslatedString(
          'change reverse button visibility',
          o.t(null, void 0, i(569520)),
        ),
        qt = new y.TranslatedString(
          'change order confirmation state',
          o.t(null, void 0, i(177827)),
        ),
        Yt = new y.TranslatedString(
          'change play sound on order execution',
          o.t(null, void 0, i(641636)),
        ),
        Qt = new y.TranslatedString(
          'change notifications state',
          o.t(null, void 0, i(352164)),
        ),
        Xt = new y.TranslatedString(
          'change positions visibility',
          o.t(null, void 0, i(21181)),
        ),
        $t = new y.TranslatedString(
          'change orders visibility',
          o.t(null, void 0, i(469714)),
        ),
        ei = new y.TranslatedString(
          'change executions visibility',
          o.t(null, void 0, i(255496)),
        ),
        ti = new y.TranslatedString(
          'change executions labels visibility',
          o.t(null, void 0, i(995765)),
        ),
        ii = new y.TranslatedString(
          'change extend lines left',
          o.t(null, void 0, i(683269)),
        ),
        ni = new y.TranslatedString(
          'change position trading objects on chart',
          o.t(null, void 0, i(72970)),
        ),
        oi =
          (new y.TranslatedString(
            'change trading objects visibility on screenshots',
            o.t(null, void 0, i(992775)),
          ),
          o.t(null, void 0, i(948313))),
        ri = o.t(null, void 0, i(186921)),
        li = o.t(null, void 0, i(293104)),
        ai = o.t(null, void 0, i(790906)),
        si = o.t(null, void 0, i(41950)),
        ci = o.t(null, void 0, i(178106)),
        di = o.t(null, void 0, i(464848)),
        ui = o.t(null, void 0, i(344104)),
        pi = o.t(null, void 0, i(230163)),
        hi = o.t(null, void 0, i(412381)),
        vi = o.t(null, void 0, i(612698)),
        gi = o.t(null, void 0, i(507248)),
        yi = o.t(null, void 0, i(150609)),
        Pi = o.t(null, void 0, i(517538)),
        fi = o.t(null, void 0, i(619286)),
        bi = o.t(null, void 0, i(72171)),
        mi = o.t(null, void 0, i(221141)),
        wi = o.t(null, void 0, i(8892)),
        Ti = o.t(null, void 0, i(670919)),
        Si =
          (o.t(null, void 0, i(199192)),
          [
            { value: l.TradedGroupHorizontalAlignment.Left, title: fi },
            { value: l.TradedGroupHorizontalAlignment.Center, title: bi },
            { value: l.TradedGroupHorizontalAlignment.Right, title: mi },
          ]),
        Di = [
          { value: !1, title: hi },
          { value: !0, title: vi },
        ]
      function Ci(e, t, i, n) {
        const o = t.positionPL.childs(),
          l = (0, c.createOptionsPropertyDefinition)(
            {
              checked: (0, c.convertToDefinitionProperty)(e, o.visibility, Ut),
              option: (0, c.convertToDefinitionProperty)(e, o.display, Kt),
            },
            { id: 'positionPLDisplay', title: yi, options: n },
          ),
          a = (0, c.createCheckablePropertyDefinition)(
            {
              checked: (0, c.convertToDefinitionProperty)(e, t.showReverse, Jt),
            },
            { id: 'reverseButton', title: ri },
          ),
          d = [],
          u = ((e, t) => {
            if (null === t || !r.enabled('buy_sell_buttons')) return null
            const i = e.mainSeries().dataEvents(),
              n = (0, b.createWVFromGetterAndSubscriptions)(() => {
                var t
                return (
                  e.model().isInReplay() ||
                  'economic' ===
                    (null === (t = e.mainSeries().symbolInfo()) || void 0 === t
                      ? void 0
                      : t.type)
                )
              }, [
                i.symbolResolved(),
                i.symbolError(),
                e.model().onInReplayStateChanged(),
              ])
            return (0, c.createCheckablePropertyDefinition)(
              {
                disabled: (0, c.convertFromReadonlyWVToDefinitionProperty)(
                  n.ownership(),
                ),
                checked: (0, c.convertFromWVToDefinitionProperty)(
                  e,
                  t.showSellBuyButtons,
                  Bt,
                ),
              },
              { id: 'tradingSellBuyPanel', title: Zt },
            )
          })(e, i),
          p = (0, c.createCheckablePropertyDefinition)(
            {
              checked: (0, c.convertFromWVToDefinitionProperty)(
                e,
                i.noConfirmEnabled,
                qt,
              ),
            },
            { id: 'tradingConfirmEnabled', title: ui },
          )
        let h
        h = (0, c.createCheckablePropertyDefinition)(
          {
            checked: (0, c.convertFromWVToDefinitionProperty)(
              e,
              i.orderExecutedSoundParams.enabled,
              Yt,
            ),
          },
          { id: 'tradingSoundEnabled', title: gi },
        )
        const v = (0, c.createOptionsPropertyDefinition)(
          {
            option: (0, c.convertFromWVToDefinitionProperty)(
              e,
              i.showOnlyRejectionNotifications,
              Qt,
            ),
          },
          {
            id: 'tradingNotifications',
            title: pi,
            options: new s.WatchedValue(Di),
          },
        )
        null !== u && d.push(u), d.push(p), d.push(h), d.push(v)
        const g = (0, c.createPropertyDefinitionsGeneralGroup)(
            d,
            'generalVisibilityGroup',
            wi,
          ),
          y = [],
          P = (0, c.createCheckableSetPropertyDefinition)(
            {
              checked: (0, c.convertToDefinitionProperty)(
                e,
                t.showPositions,
                Xt,
              ),
            },
            { id: 'tradingPositions', title: oi },
            [l, a],
          )
        y.push(P)
        const f = (0, c.createCheckablePropertyDefinition)(
          { checked: (0, c.convertToDefinitionProperty)(e, t.showOrders, $t) },
          { id: 'tradingOrders', title: li },
        )
        y.push(f)
        {
          const i = t.bracketsPL.childs(),
            o = (0, c.createOptionsPropertyDefinition)(
              {
                checked: (0, c.convertToDefinitionProperty)(
                  e,
                  i.visibility,
                  zt,
                ),
                option: (0, c.convertToDefinitionProperty)(e, i.display, jt),
              },
              { id: 'bracketsPLDisplay', title: ai, options: n },
            )
          y.push(o)
        }
        const m = (0, c.createCheckablePropertyDefinition)(
            {
              checked: (0, c.convertToDefinitionProperty)(
                e,
                t.showExecutionsLabels,
                ti,
              ),
            },
            { id: 'tradingExecutionsLables', title: di },
          ),
          w = (0, c.createCheckableSetPropertyDefinition)(
            {
              checked: (0, c.convertToDefinitionProperty)(
                e,
                t.showExecutions,
                ei,
              ),
            },
            { id: 'tradingExecutions', title: ci },
            [m],
          )
        y.push(w),
          y.push(
            (0, c.createCheckablePropertyDefinition)(
              {
                checked: (0, c.convertToDefinitionProperty)(
                  e,
                  t.extendLeft,
                  ii,
                ),
              },
              { id: 'extendLeftTradingLine', title: si },
            ),
            (0, c.createOptionsPropertyDefinition)(
              {
                option: (0, c.convertToDefinitionProperty)(
                  e,
                  t.horizontalAlignment,
                  ni,
                ),
              },
              {
                id: 'positionPLDisplay',
                title: Pi,
                options: new s.WatchedValue(Si),
              },
            ),
          )
        return {
          definitions: [
            g,
            (0, c.createPropertyDefinitionsGeneralGroup)(
              y,
              'appearanceVisibilityGroup',
              Ti,
            ),
          ],
        }
      }
      var _i = i(656846),
        Vi = i(210696),
        Li = i(853078),
        ki = i(782038),
        Oi = i(384806),
        Ri = i(887717),
        Ei = i(305666),
        Wi = i(407621),
        xi = i(808021),
        Mi = i(760339),
        Ai = i(575709),
        Ni = i(520037),
        Gi = i(84504)
      const Ii = {
          symbol: { active: xi, default: Li },
          legend: { active: Mi, default: ki },
          scales: { active: Ai, default: Oi },
          canvas: { active: i(897660), default: Wi },
          events: { active: Gi, default: Ei },
          trading: { active: Ni, default: Ri },
        },
        Fi = o.t(null, void 0, i(589053)),
        Hi = o.t(null, void 0, i(779194)),
        Bi = o.t(null, void 0, i(643115)),
        Zi = o.t(null, void 0, i(723238)),
        zi = (o.t(null, void 0, i(226897)), o.t(null, void 0, i(890801))),
        ji = o.t(null, void 0, i(470500)),
        Ui = o.t(null, void 0, i(778621)),
        Ki = o.t(null, void 0, i(130973)),
        Ji = r.enabled('chart_property_page_trading')
      let qi = null
      Ji && (qi = (0, a.tradingService)())
      const Yi = [
        {
          id: 'symbol-text-source-description',
          value: 'description',
          title: o.t(null, void 0, i(629601)),
        },
        {
          id: 'symbol-text-source-ticker',
          value: 'ticker',
          title: o.t(null, void 0, i(423097)),
        },
        {
          id: 'symbol-text-source-ticker-and-description',
          value: 'ticker-and-description',
          title: o.t(null, void 0, i(182168)),
        },
      ]
      r.enabled('symbol_info_long_description') &&
        Yi.push({
          id: 'symbol-text-source-long-description',
          value: 'long-description',
          title: o.t(null, void 0, i(996073)),
        })
      class Qi {
        constructor(e, t, i) {
          ;(this._propertyPages = null),
            (this._maxRightOffsetPropertyObject = null),
            (this._defaultRightOffsetPercentageWatchedValue = null),
            (this._useRightOffsetPercentageWatchedValue = null),
            (this._profitLossOptions = null),
            (this._isDestroyed = !1),
            (this._availableDateFormatValues = null),
            (this._undoModel = e),
            (this._model = this._undoModel.model()),
            (this._series = this._model.mainSeries()),
            (this._chartWidgetProperties = t),
            (this._options = i),
            (this._seriesPropertyDefinitionViewModel =
              this._createSeriesViewModel())
          const n = this._chartWidgetProperties
              .childs()
              .paneProperties.childs(),
            o = (0, b.createWVFromProperty)(n.gridLinesMode)
          ;(this._gridColorsVisibilities = {
            gridLinesMode: o,
            vertLinesVisible: (0, w.combine)(
              (e) => 'both' === e || 'vert' === e,
              o.weakReference(),
            ),
            horzLinesVisible: (0, w.combine)(
              (e) => 'both' === e || 'horz' === e,
              o.weakReference(),
            ),
          }),
            (this._legendPropertyPage = this._createLegendPropertyPage()),
            (this._scalesPropertyPage = this._createScalesPropertyPage()),
            (this._appearancePropertyPage =
              this._createAppearancePropertyPage()),
            (this._tradingPropertyPage = this._createTradingPropertyPage()),
            (this._eventsPropertyPage = this._createEventsPropertyPage()),
            this._series
              .onStyleChanged()
              .subscribe(this, this._updateDefinitions),
            this._series
              .priceScaleChanged()
              .subscribe(this, this._updateDefinitions)
        }
        destroy() {
          var e, t
          null !== this._propertyPages &&
            this._propertyPages
              .filter((e, t) => 0 !== t)
              .forEach((e) => {
                ;(0, c.destroyDefinitions)(e.definitions.value())
              }),
            this._seriesPropertyDefinitionViewModel.destroy(),
            null === (e = this._pipValueTypeSubscription) ||
              void 0 === e ||
              e.unsubscribe(),
            null === (t = this._availableDateFormatValues) ||
              void 0 === t ||
              t.destroy(),
            this._series
              .onStyleChanged()
              .unsubscribe(this, this._updateDefinitions),
            this._series
              .priceScaleChanged()
              .unsubscribe(this, this._updateDefinitions)
          ;(0, n.ensureNotNull)(this._model.timeScale())
            .maxRightOffsetChanged()
            .unsubscribeAll(this),
            this._gridColorsVisibilities.vertLinesVisible.destroy(),
            this._gridColorsVisibilities.horzLinesVisible.destroy(),
            this._gridColorsVisibilities.gridLinesMode.destroy(),
            (this._isDestroyed = !0)
        }
        propertyPages() {
          return null === this._propertyPages
            ? this._seriesPropertyDefinitionViewModel
                .propertyPages()
                .then((e) => {
                  if (this._isDestroyed)
                    throw new Error(
                      'ChartPropertyDefinitionsViewModel already destroyed',
                    )
                  return (
                    null === this._propertyPages &&
                      ((this._propertyPages = [...e]),
                      this._propertyPages.push(
                        this._legendPropertyPage,
                        this._scalesPropertyPage,
                        this._appearancePropertyPage,
                      ),
                      null !== this._tradingPropertyPage &&
                        this._propertyPages.push(this._tradingPropertyPage),
                      null !== this._eventsPropertyPage &&
                        this._propertyPages.push(this._eventsPropertyPage)),
                    this._propertyPages
                  )
                })
            : Promise.resolve(this._propertyPages)
        }
        _updatePlDisplayOptions(e) {
          ;(0, n.ensureNotNull)(this._profitLossOptions).setValue(
            ((e) =>
              Ji
                ? [
                    { value: l.PlDisplay.Money, title: ji },
                    {
                      value: l.PlDisplay.Pips,
                      title: e === _i.PipValueType.Pips ? Ui : Ki,
                    },
                    { value: l.PlDisplay.Percentage, title: '%' },
                  ]
                : [])(e),
          )
        }
        _updateDefinitions() {
          ;(0, c.destroyDefinitions)(
            this._scalesPropertyPage.definitions.value(),
          )
          const e = this._createScalesDefinitions()
          this._scalesPropertyPage.definitions.setValue(e.definitions)
        }
        _createSeriesViewModel() {
          const e = {
            property: this._model.properties().childs().timezone,
            values: Vi.availableTimezones.map((e) => ({
              value: e.id,
              title: e.title,
            })),
          }
          return new v.SeriesPropertyDefinitionsViewModel(
            this._series,
            this._undoModel,
            'symbol',
            Fi,
            Ii.symbol,
            e,
          )
        }
        _createLegendPropertyPage() {
          const e = this._chartWidgetProperties
              .childs()
              .paneProperties.childs()
              .legendProperties.childs(),
            t = {
              property: this._series
                .properties()
                .childs()
                .statusViewStyle.childs().symbolTextSource,
              values: Yi,
            },
            n = ((e, t, n, r, l) => {
              const a = [],
                d = []
              if (J) {
                const i = (0, c.createCheckablePropertyDefinition)(
                  {
                    checked: (0, c.convertToDefinitionProperty)(
                      e,
                      t.showLogo,
                      D,
                    ),
                  },
                  { id: 'showLogo', title: M },
                )
                d.push(i)
              }
              const u = (0, c.createOptionsPropertyDefinition)(
                {
                  checked: (0, c.convertToDefinitionProperty)(
                    e,
                    t.showSeriesTitle,
                    T,
                  ),
                  option: (0, c.convertToDefinitionProperty)(e, n.property, S),
                },
                {
                  id: 'symbolTextSource',
                  title: A,
                  options: new s.WatchedValue(n.values),
                },
              )
              if ((d.push(u), null !== r)) {
                const t = (0, w.combineWithFilteredUpdate)(
                    (t, i) =>
                      'market' === t &&
                      !(0, P.isEconomicSymbol)(e.mainSeries().symbolInfo()),
                    (e, t) => null !== e,
                    e.mainSeries().marketStatusModel().status().weakReference(),
                    e.mainSeries().symbolResolvingActive().weakReference(),
                  ),
                  i = (0, c.createCheckablePropertyDefinition)(
                    {
                      checked: (0, c.convertToDefinitionProperty)(e, r, D),
                      visible: (0, c.convertFromReadonlyWVToDefinitionProperty)(
                        t.ownership(),
                      ),
                    },
                    { id: 'showOpenMarketStatus', title: j },
                  )
                d.push(i)
              }
              const p = (0, c.createCheckablePropertyDefinition)(
                {
                  checked: (0, c.convertToDefinitionProperty)(
                    e,
                    t.showSeriesOHLC,
                    C,
                  ),
                },
                { id: 'ohlcTitle', title: N },
              )
              if ((d.push(p), !f.alwaysShowLastPriceAndLastDayChange)) {
                const i = (0, c.createCheckablePropertyDefinition)(
                  {
                    checked: (0, c.convertToDefinitionProperty)(
                      e,
                      t.showBarChange,
                      V,
                    ),
                    visible: (0, c.makeProxyDefinitionProperty)(
                      (0, b.combineProperty)(
                        (e) => 12 !== e,
                        e
                          .mainSeries()
                          .properties()
                          .childs()
                          .style.weakReference(),
                      ).ownership(),
                    ),
                  },
                  { id: 'barChange', title: I },
                )
                d.push(i)
              }
              if (
                (d.push(
                  (0, c.createCheckablePropertyDefinition)(
                    {
                      checked: (0, c.convertToDefinitionProperty)(
                        e,
                        t.showVolume,
                        W,
                      ),
                    },
                    { id: 'barVolume', title: F },
                  ),
                ),
                f.lastDayChangeAvailable ||
                  f.alwaysShowLastPriceAndLastDayChange)
              ) {
                const i = f.alwaysShowLastPriceAndLastDayChange
                    ? t.showBarChange
                    : t.showLastDayChange,
                  n = (0, c.createCheckablePropertyDefinition)(
                    {
                      checked: (0, c.convertToDefinitionProperty)(e, i, _),
                      visible: (0, c.makeProxyDefinitionProperty)(
                        (0, b.combineProperty)(
                          (e) => 12 !== e,
                          e
                            .mainSeries()
                            .properties()
                            .childs()
                            .style.weakReference(),
                        ).ownership(),
                      ),
                    },
                    { id: 'lastDayChange', title: G },
                  )
                d.push(n)
              }
              if (K) {
                const i = (0, w.combineWithFilteredUpdate)(
                  () =>
                    e
                      .model()
                      .symbolSources()
                      .some((e) => {
                        var t
                        return (
                          void 0 !==
                          (null === (t = e.symbolInfo()) || void 0 === t
                            ? void 0
                            : t.price_source_id)
                        )
                      }),
                  (e) => !e,
                  e.model().symbolSourceResolvingActive().weakReference(),
                  (0, b.createWVFromGetterAndSubscription)(
                    () => e.model().symbolSources().length,
                    e.model().symbolSourceCollectionChanged(),
                  ).ownership(),
                )
                d.push(
                  (0, c.createCheckablePropertyDefinition)(
                    {
                      disabled: (0,
                      c.convertFromReadonlyWVToDefinitionProperty)(
                        e.model().symbolSourceResolvingActive().weakReference(),
                      ),
                      checked: (0, c.convertToDefinitionProperty)(
                        e,
                        t.showPriceSource,
                        x,
                      ),
                      visible: (0, c.convertFromReadonlyWVToDefinitionProperty)(
                        i.ownership(),
                      ),
                    },
                    { id: 'priceSource', title: U },
                  ),
                )
              }
              a.push(
                (0, c.createPropertyDefinitionsGeneralGroup)(
                  d,
                  'seriesLegendVisibilityGroup',
                  o.t(null, void 0, i(589053)),
                ),
              )
              const h = [],
                v = (0, c.createCheckablePropertyDefinition)(
                  {
                    checked: (0, c.convertToDefinitionProperty)(
                      e,
                      t.showStudyArguments,
                      L,
                    ),
                  },
                  { id: 'studyArguments', title: B },
                ),
                g = (0, c.createCheckableSetPropertyDefinition)(
                  {
                    checked: (0, c.convertToDefinitionProperty)(
                      e,
                      t.showStudyTitles,
                      k,
                    ),
                  },
                  { id: 'studyTitles', title: H },
                  [v],
                ),
                y = (0, c.createCheckablePropertyDefinition)(
                  {
                    checked: (0, c.convertToDefinitionProperty)(
                      e,
                      t.showStudyValues,
                      O,
                    ),
                  },
                  { id: 'studyValues', title: Z },
                ),
                q = (0, b.createWVFromGetterAndSubscription)(
                  () =>
                    e
                      .model()
                      .priceDataSources()
                      .some(
                        (e) =>
                          !(0, m.isActingAsSymbolSource)(e) &&
                          e.showInObjectTree(),
                      ),
                  e.model().dataSourceCollectionChanged(),
                )
              h.push(g, y),
                a.push(
                  (0, c.createPropertyDefinitionsGeneralGroup)(
                    h,
                    'studiesLegendVisibilityGroup',
                    o.t(null, void 0, i(561142)),
                    q,
                  ),
                )
              const Y = [],
                Q = (0, c.createTransparencyPropertyDefinition)(
                  {
                    checked: (0, c.convertToDefinitionProperty)(
                      e,
                      t.showBackground,
                      R,
                    ),
                    transparency: (0, c.convertToDefinitionProperty)(
                      e,
                      t.backgroundTransparency,
                      E,
                    ),
                  },
                  { id: 'legendBgTransparency', title: z },
                )
              return (
                Y.push(Q),
                a.push(
                  (0, c.createPropertyDefinitionsGeneralGroup)(
                    Y,
                    'generalLegendGroup',
                  ),
                ),
                { definitions: a }
              )
            })(
              this._undoModel,
              e,
              t,
              this._options.marketStatusWidgetEnabled
                ? g.showMarketOpenStatusProperty
                : null,
            )
          return (0, d.createPropertyPage)(n, 'legend', Hi, Ii.legend)
        }
        _createScalesPropertyPage() {
          const e = this._createScalesDefinitions()
          return (0, d.createPropertyPage)(e, 'scales', Bi, Ii.scales)
        }
        _createScalesDefinitions() {
          const e = this._chartWidgetProperties
              .childs()
              .scalesProperties.childs(),
            t = {
              property: this._model.properties().childs()
                .priceScaleSelectionStrategyName,
              values: (0, h.allPriceScaleSelectionStrategyInfo)().map((e) => ({
                value: e.name,
                title: e.title,
              })),
            }
          null === this._availableDateFormatValues &&
            (this._availableDateFormatValues = new s.WatchedValue(
              ((e = !1) => {
                const t = new Date(Date.UTC(1997, 8, 29))
                return Gt.availableDateFormats.map((i) => ({
                  value: i,
                  title: new Ft.DateFormatter(i, e).format(t),
                }))
              })(),
            ).spawn())
          const n = {
              property: It.dateFormatProperty,
              values: this._availableDateFormatValues,
            },
            l = {
              property: Ht.timeHoursFormatProperty,
              values: [
                { value: '24-hours', title: o.t(null, void 0, i(855838)) },
                { value: '12-hours', title: o.t(null, void 0, i(919648)) },
              ],
            },
            a = this._model.mainSeriesScaleRatioProperty()
          return ((e, t, i, n) => {
            const o = n.seriesPriceScale.properties().childs(),
              l = [],
              a = [],
              d = [],
              u = []
            if (n.seriesHasClosePrice) {
              const t = (0, c.createCheckablePropertyDefinition)(
                  {
                    checked: (0, c.convertToDefinitionProperty)(
                      e,
                      i.showSymbolLabels,
                      te,
                    ),
                  },
                  { id: 'symbolNameLabel', title: we },
                ),
                n = (0, c.createOptionsPropertyDefinition)(
                  {
                    checked: (0, c.convertToDefinitionProperty)(
                      e,
                      i.showSeriesLastValue,
                      ie,
                    ),
                    option: (0, c.convertToDefinitionProperty)(
                      e,
                      i.seriesLastValueMode,
                      ne,
                    ),
                  },
                  {
                    id: 'symbolLastValueLabel',
                    title: Te,
                    options: new s.WatchedValue(Ze),
                  },
                )
              a.push(t, n)
              {
                const t = (0, b.combineProperty)(
                    (e) => !e,
                    e.mainSeries().isDWMProperty().weakReference(),
                  ),
                  n = (0, c.createCheckablePropertyDefinition)(
                    {
                      checked: (0, c.convertToDefinitionProperty)(
                        e,
                        i.showSeriesPrevCloseValue,
                        oe,
                      ),
                      visible: (0, c.makeProxyDefinitionProperty)(
                        t.ownership(),
                      ),
                    },
                    { id: 'symbolPrevCloseValue', title: Se },
                  )
                a.push(n)
              }
            }
            if (e.model().hasCustomSource('bidask')) {
              const t = (0, c.createCheckablePropertyDefinition)(
                {
                  checked: (0, c.convertToDefinitionProperty)(
                    e,
                    i.showBidAskLabels,
                    re,
                  ),
                },
                { id: 'bidAskLabels', title: _e },
              )
              a.push(t)
            }
            const p = t.highLowAvgPrice.childs(),
              h = (0, c.createCheckablePropertyDefinition)(
                {
                  checked: (0, c.convertToDefinitionProperty)(
                    e,
                    p.highLowPriceLabelsVisible,
                    le,
                  ),
                },
                { id: 'highLowPriceLabels', title: Le },
              )
            if ((a.push(h), ee)) {
              const t = (0, c.createCheckablePropertyDefinition)(
                {
                  checked: (0, c.convertToDefinitionProperty)(
                    e,
                    p.averageClosePriceLabelVisible,
                    ae,
                  ),
                },
                { id: 'averageClosePriceLabel', title: Ve },
              )
              a.push(t)
            }
            {
              const t = (0, c.createCheckablePropertyDefinition)(
                {
                  visible: (0, c.convertFromReadonlyWVToDefinitionProperty)(
                    (0, b.createWVFromGetterAndSubscription)(
                      () =>
                        e
                          .model()
                          .priceDataSources()
                          .some(
                            (e) =>
                              !(0, m.isActingAsSymbolSource)(e) &&
                              e.showInObjectTree(),
                          ),
                      e.model().dataSourceCollectionChanged(),
                    ).ownership(),
                  ),
                  checked: (0, c.convertToDefinitionProperty)(
                    e,
                    i.showStudyPlotLabels,
                    se,
                  ),
                },
                { id: 'studyNameLabel', title: De },
              )
              a.push(t)
            }
            {
              const t = (0, c.createCheckablePropertyDefinition)(
                {
                  visible: (0, c.convertFromReadonlyWVToDefinitionProperty)(
                    (0, b.createWVFromGetterAndSubscription)(
                      () =>
                        e
                          .model()
                          .priceDataSources()
                          .some(
                            (e) =>
                              !(0, m.isActingAsSymbolSource)(e) &&
                              e.showInObjectTree(),
                          ),
                      e.model().dataSourceCollectionChanged(),
                    ).ownership(),
                  ),
                  checked: (0, c.convertToDefinitionProperty)(
                    e,
                    i.showStudyLastValue,
                    ce,
                  ),
                },
                { id: 'studyLastValueLabel', title: Ce },
              )
              a.push(t)
            }
            const v = (0, c.createCheckablePropertyDefinition)(
              {
                checked: (0, c.convertToDefinitionProperty)(
                  e,
                  o.alignLabels,
                  de,
                ),
              },
              { id: 'noOverlappingLabels', title: ke },
            )
            if (
              (a.push(v),
              l.push(
                (0, c.createPropertyDefinitionsGeneralGroup)(
                  a,
                  'scalesLabelsGroup',
                  Oe,
                ),
              ),
              n.countdownEnabled)
            ) {
              const i = (0, c.createCheckablePropertyDefinition)(
                {
                  checked: (0, c.convertToDefinitionProperty)(
                    e,
                    t.showCountdown,
                    ue,
                  ),
                },
                { id: 'countdown', title: Re },
              )
              d.push(i)
            }
            if (e.crossHairSource().isMenuEnabled()) {
              const t = (0, c.createCheckablePropertyDefinition)(
                {
                  checked: (0, c.convertToDefinitionProperty)(
                    e,
                    Q.addPlusButtonProperty,
                    ye,
                  ),
                },
                { id: 'addPlusButton', title: Ae, solutionId: void 0 },
              )
              d.push(t)
            }
            if (n.currencyConversionEnabled || n.unitConversionEnabled) {
              const t =
                  n.currencyConversionEnabled && n.unitConversionEnabled
                    ? xe
                    : n.currencyConversionEnabled
                      ? Ee
                      : We,
                i =
                  n.currencyConversionEnabled && n.unitConversionEnabled
                    ? ge
                    : n.currencyConversionEnabled
                      ? pe
                      : ve,
                o = (0, c.createOptionsPropertyDefinition)(
                  {
                    option: (0, c.convertToDefinitionProperty)(
                      e,
                      (0, X.currencyUnitVisibilityProperty)(),
                      i,
                    ),
                  },
                  {
                    id: 'scalesCurrencyUnit',
                    title: t,
                    options: new s.WatchedValue(
                      (0, X.currencyUnitVisibilityOptions)(),
                    ),
                  },
                )
              d.push(o)
            }
            const g = (0, c.createOptionsPropertyDefinition)(
                {
                  option: (0, c.convertToDefinitionProperty)(
                    e,
                    (0, $.autoLogButtonsVisibilityProperty)(),
                    he,
                  ),
                },
                {
                  id: 'autoLogButtonsVisibility',
                  title: Me,
                  options: new s.WatchedValue(
                    (0, $.autoLogButtonsVisibilityOptions)(),
                  ),
                },
              ),
              y = (0, c.createNumberPropertyDefinition)(
                {
                  checked: (0, c.getLockPriceScaleDefinitionProperty)(
                    e,
                    o.lockScale,
                    n.seriesPriceScale,
                    Pe,
                  ),
                  value: (0, c.getScaleRatioDefinitionProperty)(
                    e,
                    n.mainSeriesScaleRatioProperty,
                    fe,
                    [(0, Y.limitedPrecision)(7), (e) => e],
                  ),
                },
                {
                  id: 'lockScale',
                  title: Ge,
                  min: new s.WatchedValue(
                    n.mainSeriesScaleRatioProperty.getMinValue(),
                  ),
                  max: new s.WatchedValue(
                    n.mainSeriesScaleRatioProperty.getMaxValue(),
                  ),
                  step: new s.WatchedValue(
                    n.mainSeriesScaleRatioProperty.getStepChangeValue(),
                  ),
                },
              ),
              P = (0, c.createOptionsPropertyDefinition)(
                {
                  option: (0,
                  c.getPriceScaleSelectionStrategyDefinitionProperty)(
                    e,
                    n.scalesPlacementPropertyObj.property,
                  ),
                },
                {
                  id: 'scalesPlacement',
                  title: Ne,
                  options: new s.WatchedValue(
                    n.scalesPlacementPropertyObj.values,
                  ),
                },
              )
            if (
              (d.push(g, y, P),
              l.push(
                (0, c.createPropertyDefinitionsGeneralGroup)(
                  d,
                  'scalesPriceScaleGroup',
                  Ie,
                ),
              ),
              r.enabled('scales_date_format'))
            ) {
              const t = (0, c.createOptionsPropertyDefinition)(
                {
                  option: (0, c.convertToDefinitionProperty)(
                    e,
                    n.dateFormatPropertyObj.property,
                    be,
                  ),
                },
                {
                  id: 'dateFormat',
                  title: Fe,
                  options: n.dateFormatPropertyObj.values,
                },
              )
              u.push(t)
            }
            if (r.enabled('scales_time_hours_format')) {
              const t = (0, c.createOptionsPropertyDefinition)(
                {
                  option: (0, c.convertToDefinitionProperty)(
                    e,
                    n.timeHoursFormatPropertyObj.property,
                    me,
                  ),
                },
                {
                  id: 'timeHoursFormat',
                  title: He,
                  options: new s.WatchedValue(
                    n.timeHoursFormatPropertyObj.values,
                  ),
                },
              )
              u.push(t)
            }
            return (
              u.length > 0 &&
                l.push(
                  (0, c.createPropertyDefinitionsGeneralGroup)(
                    u,
                    'scalesTimeScaleGroup',
                    Be,
                  ),
                ),
              { definitions: l }
            )
          })(this._undoModel, this._series.properties().childs(), e, {
            disableSeriesPrevCloseValueProperty: this._series.isDWMProperty(),
            seriesHasClosePrice: this._series.hasClosePrice(),
            seriesPriceScale: this._series.priceScale(),
            mainSeriesScaleRatioProperty: a,
            scalesPlacementPropertyObj: t,
            dateFormatPropertyObj: n,
            timeHoursFormatPropertyObj: l,
            currencyConversionEnabled: this._options.currencyConversionEnabled,
            unitConversionEnabled: this._options.unitConversionEnabled,
            countdownEnabled: this._options.countdownEnabled,
            withWeekdayProperty: void 0,
          })
        }
        _createMaxOffsetPropertyObject() {
          const e = (0, n.ensureNotNull)(this._model.timeScale()),
            t = new s.WatchedValue(Math.floor(e.maxRightOffset()))
          e.maxRightOffsetChanged().subscribe(this, (e) => {
            t.setValue(Math.floor(e))
          }),
            (this._maxRightOffsetPropertyObject = {
              value: e.defaultRightOffset(),
              min: new s.WatchedValue(0),
              max: t,
            })
        }
        _createDefaultRightOffsetPercentageWatchedValue() {
          const e = (0, n.ensureNotNull)(this._model.timeScale())
          this._defaultRightOffsetPercentageWatchedValue =
            e.defaultRightOffsetPercentage()
        }
        _createUseRightOffsetPercentageWatchedValue() {
          const e = (0, n.ensureNotNull)(this._model.timeScale())
          this._useRightOffsetPercentageWatchedValue =
            e.usePercentageRightOffset()
        }
        _createAppearancePropertyPage() {
          const e = this._chartWidgetProperties.childs(),
            t = e.paneProperties.childs(),
            i = e.scalesProperties.childs(),
            o = this._model.watermarkSource()
          let r = null
          null !== o && (r = o.properties().childs())
          const l = { property: u.property(), values: u.availableValues() },
            a = { property: p.property(), values: p.availableValues() }
          null === this._maxRightOffsetPropertyObject &&
            this._createMaxOffsetPropertyObject(),
            null === this._defaultRightOffsetPercentageWatchedValue &&
              this._createDefaultRightOffsetPercentageWatchedValue(),
            null === this._useRightOffsetPercentageWatchedValue &&
              this._createUseRightOffsetPercentageWatchedValue()
          const s = (0, n.ensureNotNull)(this._maxRightOffsetPropertyObject),
            c = (0, n.ensureNotNull)(
              this._defaultRightOffsetPercentageWatchedValue,
            ),
            h = (0, n.ensureNotNull)(
              this._useRightOffsetPercentageWatchedValue,
            ),
            v = Nt(
              this._undoModel,
              t,
              r,
              i,
              s,
              l,
              a,
              c,
              h,
              this._gridColorsVisibilities,
            )
          return (0, d.createPropertyPage)(v, 'canvas', Zi, Ii.canvas)
        }
        _createTradingPropertyPage() {
          if (!Ji) return null
          if (null === qi) return null
          ;(this._profitLossOptions = new s.WatchedValue()),
            (this._pipValueTypeSubscription = qi
              .pipValueType()
              .subscribe(this._updatePlDisplayOptions.bind(this)))
          const e = this._model
              .properties()
              .childs()
              .tradingProperties.childs(),
            t = Ci(this._undoModel, e, qi, this._profitLossOptions)
          return (0, d.createPropertyPage)(t, 'trading', zi, Ii.trading)
        }
        _createEventsPropertyPage() {
          return null
        }
      }
    },
    656846: (e, t, i) => {
      var n, o, r, l, a, s, c, d, u, p, h, v, g, y, P
      i.d(t, {
        AccountType: () => v,
        BracketType: () => d,
        DisconnectType: () => g,
        OrderOrPositionMessageType: () => h,
        PipValueType: () => y,
        RestrictionType: () => P,
        TradingEntityType: () => s,
      }),
        ((e) => {
          ;(e[(e.CONNECTED = 1)] = 'CONNECTED'),
            (e[(e.CONNECTING = 2)] = 'CONNECTING'),
            (e[(e.DISCONNECTED = 3)] = 'DISCONNECTED'),
            (e[(e.ERROR = 4)] = 'ERROR')
        })(n || (n = {})),
        ((e) => {
          ;(e[(e.LIMIT = 1)] = 'LIMIT'),
            (e[(e.MARKET = 2)] = 'MARKET'),
            (e[(e.STOP = 3)] = 'STOP'),
            (e[(e.STOPLIMIT = 4)] = 'STOPLIMIT')
        })(o || (o = {})),
        ((e) => {
          ;(e[(e.BUY = 1)] = 'BUY'), (e[(e.SELL = -1)] = 'SELL')
        })(r || (r = {})),
        ((e) => {
          ;(e[(e.CANCELED = 1)] = 'CANCELED'),
            (e[(e.FILLED = 2)] = 'FILLED'),
            (e[(e.INACTIVE = 3)] = 'INACTIVE'),
            (e[(e.PLACING = 4)] = 'PLACING'),
            (e[(e.REJECTED = 5)] = 'REJECTED'),
            (e[(e.WORKING = 6)] = 'WORKING')
        })(l || (l = {})),
        ((e) => {
          ;(e[(e.ALL = 0)] = 'ALL'),
            (e[(e.CANCELED = 1)] = 'CANCELED'),
            (e[(e.FILLED = 2)] = 'FILLED'),
            (e[(e.INACTIVE = 3)] = 'INACTIVE'),
            (e[(e.REJECTED = 5)] = 'REJECTED'),
            (e[(e.WORKING = 6)] = 'WORKING')
        })(a || (a = {})),
        ((e) => {
          ;(e[(e.Order = 1)] = 'Order'), (e[(e.Position = 2)] = 'Position')
        })(s || (s = {})),
        ((e) => {
          ;(e[(e.ORDER = 1)] = 'ORDER'), (e[(e.POSITION = 2)] = 'POSITION')
        })(c || (c = {})),
        ((e) => {
          ;(e[(e.StopLoss = 0)] = 'StopLoss'),
            (e[(e.TakeProfit = 1)] = 'TakeProfit'),
            (e[(e.TrailingStop = 2)] = 'TrailingStop')
        })(d || (d = {})),
        ((e) => {
          ;(e[(e.LIMITPRICE = 1)] = 'LIMITPRICE'),
            (e[(e.STOPPRICE = 2)] = 'STOPPRICE'),
            (e[(e.TAKEPROFIT = 3)] = 'TAKEPROFIT'),
            (e[(e.STOPLOSS = 4)] = 'STOPLOSS')
        })(u || (u = {})),
        ((e) => {
          ;(e[(e.ERROR = 0)] = 'ERROR'), (e[(e.SUCCESS = 1)] = 'SUCCESS')
        })(p || (p = {})),
        ((e) => {
          ;(e.Information = 'information'),
            (e.Warning = 'warning'),
            (e.Error = 'error')
        })(h || (h = {})),
        ((e) => {
          ;(e.Demo = 'demo'), (e.Live = 'live')
        })(v || (v = {})),
        ((e) => {
          ;(e[(e.LogOut = 0)] = 'LogOut'),
            (e[(e.FailedRestoring = 1)] = 'FailedRestoring'),
            (e[(e.Offline = 2)] = 'Offline'),
            (e[(e.APIError = 3)] = 'APIError'),
            (e[(e.TwoFactorRequired = 4)] = 'TwoFactorRequired'),
            (e[(e.CancelAuthorization = 5)] = 'CancelAuthorization'),
            (e[(e.TimeOutForAuthorization = 6)] = 'TimeOutForAuthorization'),
            (e[(e.OauthError = 7)] = 'OauthError'),
            (e[(e.BrokenConnection = 8)] = 'BrokenConnection'),
            (e[(e.FailedSignIn = 9)] = 'FailedSignIn')
        })(g || (g = {})),
        ((e) => {
          ;(e[(e.None = 0)] = 'None'),
            (e[(e.Pips = 1)] = 'Pips'),
            (e[(e.Ticks = 2)] = 'Ticks')
        })(y || (y = {})),
        ((e) => {
          ;(e.Halted = 'HALTED'),
            (e.NotShortable = 'NOT-SHORTABLE'),
            (e.HardToBorrow = 'HARD-TO-BORROW')
        })(P || (P = {}))
    },
    84504: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M9.75 3c.41 0 .75.34.75.75V5h7V3.75a.75.75 0 0 1 1.5 0V5a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4V3.75c0-.41.34-.75.75-.75zM9 6.5h10A2.5 2.5 0 0 1 21.5 9v1.5h-15V9A2.5 2.5 0 0 1 9 6.5zM6.5 12v7A2.5 2.5 0 0 0 9 21.5h10a2.5 2.5 0 0 0 2.5-2.5v-7h-15z"/></svg>'
    },
    808021: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M12 7h-.75V4h-1.5v3H9a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h.75v3h1.5v-3H12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1ZM9.5 19.5v-11h2v11h-2Zm8-3v-5h2v5h-2Zm.24-6.5H17a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h.75v3h1.5v-3H20a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-.76V7h-1.5v3Z"/></svg>'
    },
    897660: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-width="1.5" d="m7.5 16.5-1 1v4h4l1-1m-4-4 9-9m-9 9 4 4m0 0 9-9m-4-4 .59-.59a2 2 0 0 1 2.82 0L21.1 8.1a2 2 0 0 1 0 2.82l-.59.59m-4-4 2 2 2 2"/></svg>'
    },
    575709: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-width="1.5" d="M10.5 20.5a2 2 0 1 1-2-2m2 2a2 2 0 0 0-2-2m2 2h14m-16-2v-14m16 16L21 17m3.5 3.5L21 24M8.5 4.5 12 8M8.5 4.5 5 8"/></svg>'
    },
    760339: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M7 7.5h14a.5.5 0 0 1 0 1H7a.5.5 0 0 1 0-1ZM5 8c0-1.1.9-2 2-2h14a2 2 0 1 1 0 4H7a2 2 0 0 1-2-2Zm13 5H6v1.5h12V13ZM6 17h12v1.5H6V17Zm12 4H6v1.5h12V21Z"/></svg>'
    },
    520037: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="m17.53 15.08.45.33.44-.33 6.65-4.92a2.3 2.3 0 0 0 .42-3.3 2.35 2.35 0 0 0-3.23-.4l-4.28 3.18-4.29-3.18a2.35 2.35 0 0 0-3.22.4 2.3 2.3 0 0 0 .42 3.3l6.64 4.92Zm6.64-6.1-6.2 4.59-6.19-4.6a.83.83 0 0 1-.15-1.18.85.85 0 0 1 1.17-.15l4.73 3.51.45.33.44-.33 4.74-3.5a.85.85 0 0 1 1.16.14c.3.37.23.9-.15 1.19Zm-13.7 3.94-.45-.33-.44.33-6.65 4.92a2.3 2.3 0 0 0-.42 3.3 2.35 2.35 0 0 0 3.23.4l4.28-3.18 4.29 3.18c1 .75 2.44.57 3.22-.4a2.3 2.3 0 0 0-.42-3.3l-6.64-4.92Zm-6.64 6.1 6.2-4.59 6.19 4.6c.38.27.45.81.15 1.18a.85.85 0 0 1-1.17.15l-4.73-3.51-.45-.33-.44.33-4.74 3.5a.85.85 0 0 1-1.16-.14.83.83 0 0 1 .15-1.19Z"/></svg>'
    },
    305666: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M10 5h8V3h1v2h.5A3.5 3.5 0 0 1 23 8.5v11a3.5 3.5 0 0 1-3.5 3.5h-11A3.5 3.5 0 0 1 5 19.5v-11A3.5 3.5 0 0 1 8.5 5H9V3h1v2Zm12 5V8.5A2.5 2.5 0 0 0 19.5 6h-11A2.5 2.5 0 0 0 6 8.5V10h16ZM6 11v8.5A2.5 2.5 0 0 0 8.5 22h11a2.5 2.5 0 0 0 2.5-2.5V11H6Z"/></svg>'
    },
    853078: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M11 4h-1v3H8.5a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5H10v3h1v-3h1.5a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5H11V4ZM9 8v12h3V8H9Zm10-1h-1v3h-1.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5H18v3h1v-3h1.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5H19V7Zm-2 10v-6h3v6h-3Z"/></svg>'
    },
    407621: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M16.73 6.56a2.5 2.5 0 0 1 3.54 0l1.17 1.17a2.5 2.5 0 0 1 0 3.54l-.59.58-9 9-1 1-.14.15H6v-4.7l.15-.15 1-1 9-9 .58-.59Zm2.83.7a1.5 1.5 0 0 0-2.12 0l-.23.24 3.29 3.3.23-.24a1.5 1.5 0 0 0 0-2.12l-1.17-1.17Zm.23 4.24L16.5 8.2l-8.3 8.3 3.3 3.3 8.3-8.3Zm-9 9L7.5 17.2l-.5.5V21h3.3l.5-.5Z"/></svg>'
    },
    384806: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M10.5 20.5a2 2 0 1 1-2-2m2 2a2 2 0 0 0-2-2m2 2h14m-16-2v-14m16 16L21 17m3.5 3.5L21 24M8.5 4.5L12 8M8.5 4.5L5 8"/></svg>'
    },
    782038: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M7 7h14a1 1 0 1 1 0 2H7a1 1 0 0 1 0-2ZM5 8c0-1.1.9-2 2-2h14a2 2 0 1 1 0 4H7a2 2 0 0 1-2-2Zm13 5H6v1h12v-1Zm0 4H6v1h12v-1ZM6 21h12v1H6v-1Z"/></svg>'
    },
    887717: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12.8441 8.61921C13.232 8.13425 13.9481 8.07567 14.4097 8.49112L18.1651 11.871L18.4996 12.172L18.8341 11.871L22.5896 8.49121C23.0512 8.07582 23.7672 8.13438 24.1551 8.61927C24.5188 9.07382 24.4567 9.73484 24.0147 10.1137L18.4996 14.8409L12.9845 10.1137C12.5425 9.73482 12.4804 9.07379 12.8441 8.61921ZM15.0787 7.74783C14.1896 6.94765 12.8104 7.06048 12.0632 7.99452C11.3628 8.87007 11.4824 10.1432 12.3338 10.8729L18.1742 15.879L18.4996 16.158L18.825 15.879L24.6655 10.8729C25.5168 10.1432 25.6364 8.87006 24.936 7.99454C24.1888 7.06061 22.8097 6.94781 21.9207 7.7479L18.4996 10.8267L15.0787 7.74783ZM15.1551 18.8798C14.7672 19.3647 14.0511 19.4233 13.5895 19.0078L9.83409 15.628L9.49962 15.3269L9.16514 15.6279L5.4096 19.0077C4.94802 19.4231 4.23205 19.3646 3.84411 18.8797C3.48044 18.4251 3.54256 17.7641 3.98455 17.3853L9.49961 12.6581L15.0147 17.3853C15.4567 17.7641 15.5188 18.4252 15.1551 18.8798ZM12.9205 19.7511C13.8096 20.5513 15.1888 20.4385 15.936 19.5044C16.6364 18.6289 16.5168 17.3557 15.6655 16.626L9.82501 11.6199L9.49961 11.341L9.17421 11.6199L3.33376 16.626C2.48244 17.3557 2.3628 18.6289 3.06327 19.5044C3.81047 20.4383 5.1895 20.5512 6.07854 19.7511L9.4996 16.6723L12.9205 19.7511Z"/></svg>'
    },
  },
])
