;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4482],
  {
    52305: (e, i, t) => {
      t.d(i, {
        convertToInt: () => r,
        floor: () => n,
        limitedPrecision: () => l,
      })
      var o = t(73866)
      function n(e) {
        return Math.floor(e)
      }
      function r(e) {
        return Number.parseInt(String(e))
      }
      function l(e) {
        const i = new o.LimitedPrecisionNumericFormatter(e, !0)
        return (e) => {
          if (null === e) return e
          const t = i.parse(i.format(e))
          return t.res ? t.value : null
        }
      }
    },
    74343: (e, i, t) => {
      t.d(i, {
        basePriceSources: () => d,
        createPriceSourceDefinition: () => u,
      })
      var o = t(11542),
        n = t(14139),
        r = t(64147),
        l = t(32097),
        s = t(23869),
        a = t(68805)
      const c = o.t(null, void 0, t(84684)),
        d = [
          {
            title: o.t(null, void 0, t(16610)),
            value: 'open',
            id: 'price-source-open',
          },
          {
            title: o.t(null, void 0, t(78254)),
            value: 'high',
            id: 'price-source-high',
          },
          {
            title: o.t(null, void 0, t(65318)),
            value: 'low',
            id: 'price-source-low',
          },
          {
            title: o.t(null, void 0, t(62578)),
            value: 'close',
            id: 'price-source-close',
          },
          {
            title: o.t(null, void 0, t(69303)),
            value: 'hl2',
            id: 'price-source-hl2',
          },
          {
            title: o.t(null, void 0, t(27311)),
            value: 'hlc3',
            id: 'price-source-hlc3',
          },
          {
            title: o.t(null, void 0, t(4348)),
            value: 'ohlc4',
            id: 'price-source-ohlc4',
          },
        ]
      function u(e, i, t, o, d, u) {
        const p = void 0,
          h = (0, s.createWVFromGetterAndSubscriptions)(
            () => !(0, a.isCloseBasedSymbol)(e.mainSeries().symbolInfo()),
            [
              e.mainSeries().dataEvents().symbolResolved(),
              e.mainSeries().dataEvents().symbolError(),
            ],
          )
        return (0, n.createOptionsPropertyDefinition)(
          {
            disabled:
              p &&
              (0, l.convertFromReadonlyWVToDefinitionProperty)(
                p.weakReference(),
              ),
            option: (0, l.convertToDefinitionProperty)(e, i.priceSource, u),
            visible: (0, l.convertFromReadonlyWVToDefinitionProperty)(
              h.ownership(),
            ),
          },
          { id: `${o}${d}`, title: c, options: new r.WatchedValue(t) },
        )
      }
    },
    18653: (e, i, t) => {
      t.d(i, { getSeriesStylePropertiesDefinitions: () => Te })
      var o = t(11542),
        n = t(45126),
        r = t(32097),
        l = (t(20596), t(64147)),
        s = t(56570),
        a = t(37265),
        c = t(52305),
        d = t(91682),
        u = t(74343)
      const p = new n.TranslatedString(
          'change line price source',
          o.t(null, void 0, t(41837)),
        ),
        h = new n.TranslatedString(
          'change line color',
          o.t(null, void 0, t(88640)),
        ),
        y = new n.TranslatedString(
          'change line width',
          o.t(null, void 0, t(48339)),
        ),
        f = o.t(null, void 0, t(3554))
      function v(e, i, t, o) {
        return [
          (0, u.createPriceSourceDefinition)(
            e,
            i,
            t,
            o,
            'SymbolLinePriceSource',
            p,
          ),
          (0, r.createColorPropertyDefinition)(
            {
              color: (0, r.getColorDefinitionProperty)(e, i.color, null, h),
              gradientColor1:
                i.gradientStartColor &&
                (0, r.getColorDefinitionProperty)(
                  e,
                  i.gradientStartColor,
                  null,
                  h,
                ),
              gradientColor2:
                i.gradientEndColor &&
                (0, r.getColorDefinitionProperty)(
                  e,
                  i.gradientEndColor,
                  null,
                  h,
                ),
              type:
                i.colorType &&
                (0, r.convertToDefinitionProperty)(e, i.colorType, h),
              width: (0, r.convertToDefinitionProperty)(e, i.linewidth, y),
            },
            { id: `${o}SymbolLineStyle`, title: f },
          ),
        ]
      }
      const g = new n.TranslatedString(
          'change color bars based on previous close',
          o.t(null, void 0, t(43090)),
        ),
        S = new n.TranslatedString(
          'change HLC bars',
          o.t(null, void 0, t(27068)),
        ),
        b = new n.TranslatedString(
          'change bar up color',
          o.t(null, void 0, t(33464)),
        ),
        w = new n.TranslatedString(
          'change bar down color',
          o.t(null, void 0, t(59622)),
        ),
        P = new n.TranslatedString(
          'change thin bars',
          o.t(null, void 0, t(60834)),
        ),
        m = new n.TranslatedString(
          'change area price source',
          o.t(null, void 0, t(4640)),
        ),
        T = new n.TranslatedString(
          'change area line color',
          o.t(null, void 0, t(29605)),
        ),
        D = new n.TranslatedString(
          'change area line width',
          o.t(null, void 0, t(89346)),
        ),
        C = new n.TranslatedString(
          'change area fill color',
          o.t(null, void 0, t(86866)),
        ),
        _ = new n.TranslatedString(
          'change baseline price source',
          o.t(null, void 0, t(68609)),
        ),
        k = new n.TranslatedString(
          'change baseline top line color',
          o.t(null, void 0, t(69044)),
        ),
        W = new n.TranslatedString(
          'change baseline top line width',
          o.t(null, void 0, t(68197)),
        ),
        $ = new n.TranslatedString(
          'change baseline bottom line color',
          o.t(null, void 0, t(71785)),
        ),
        M = new n.TranslatedString(
          'change baseline bottom line width',
          o.t(null, void 0, t(56175)),
        ),
        V = new n.TranslatedString(
          'change baseline fill top area color',
          o.t(null, void 0, t(92873)),
        ),
        L = new n.TranslatedString(
          'change baseline fill bottom area color',
          o.t(null, void 0, t(97216)),
        ),
        I = new n.TranslatedString(
          'change base level',
          o.t(null, void 0, t(42190)),
        ),
        O = new n.TranslatedString(
          'change high-low body visibility',
          o.t(null, void 0, t(73021)),
        ),
        B = new n.TranslatedString(
          'change high-low body color',
          o.t(null, void 0, t(6026)),
        ),
        E = new n.TranslatedString(
          'change high-low borders visibility',
          o.t(null, void 0, t(15801)),
        ),
        x = new n.TranslatedString(
          'change high-low border color',
          o.t(null, void 0, t(46844)),
        ),
        A = new n.TranslatedString(
          'change high-low labels visibility',
          o.t(null, void 0, t(72399)),
        ),
        F = new n.TranslatedString(
          'change high-low labels color',
          o.t(null, void 0, t(56961)),
        ),
        N =
          (new n.TranslatedString(
            'change renko wick visibility',
            o.t(null, void 0, t(79604)),
          ),
          new n.TranslatedString(
            'change renko wick up color',
            o.t(null, void 0, t(92277)),
          ),
          new n.TranslatedString(
            'change renko wick down color',
            o.t(null, void 0, t(75487)),
          ),
          new n.TranslatedString(
            'change the display of real prices on price scale (instead of Heiken-Ashi price)',
            o.t(null, void 0, t(16660)),
          ),
          new n.TranslatedString(
            'change range thin bars',
            o.t(null, void 0, t(65821)),
          ),
          new n.TranslatedString(
            'change range bars style',
            o.t(null, void 0, t(16241)),
          ),
          new n.TranslatedString(
            'change {candleType} body visibility',
            o.t(null, void 0, t(60608)),
          )),
        H = new n.TranslatedString(
          'change {candleType} up color',
          o.t(null, void 0, t(36697)),
        ),
        R = new n.TranslatedString(
          'change {candleType} down color',
          o.t(null, void 0, t(64571)),
        ),
        U = new n.TranslatedString(
          'change {candleType} border visibility',
          o.t(null, void 0, t(11114)),
        ),
        j = new n.TranslatedString(
          'change {candleType} up border color',
          o.t(null, void 0, t(17214)),
        ),
        z = new n.TranslatedString(
          'change {candleType} down border color',
          o.t(null, void 0, t(20291)),
        ),
        G = new n.TranslatedString(
          'change {candleType} wick visibility',
          o.t(null, void 0, t(94750)),
        ),
        J = new n.TranslatedString(
          'change {candleType} wick up color',
          o.t(null, void 0, t(47664)),
        ),
        q = new n.TranslatedString(
          'change {candleType} wick down color',
          o.t(null, void 0, t(48091)),
        ),
        K =
          (new n.TranslatedString(
            'change {chartType} up color',
            o.t(null, void 0, t(6970)),
          ),
          new n.TranslatedString(
            'change {chartType} down color',
            o.t(null, void 0, t(5012)),
          ),
          new n.TranslatedString(
            'change {chartType} projection bar up color',
            o.t(null, void 0, t(85032)),
          ),
          new n.TranslatedString(
            'change {chartType} projection bar down color',
            o.t(null, void 0, t(72545)),
          ),
          new n.TranslatedString(
            'change {chartType} border bar up color',
            o.t(null, void 0, t(28394)),
          ),
          new n.TranslatedString(
            'change {chartType} border bar down color',
            o.t(null, void 0, t(23053)),
          ),
          new n.TranslatedString(
            'change {chartType} projection border bar up color',
            o.t(null, void 0, t(42826)),
          ),
          new n.TranslatedString(
            'change {chartType} projection border bar up color',
            o.t(null, void 0, t(42826)),
          ),
          new n.TranslatedString(
            'change column up color',
            o.t(null, void 0, t(88324)),
          )),
        Q = new n.TranslatedString(
          'change column down color',
          o.t(null, void 0, t(93890)),
        ),
        X = new n.TranslatedString(
          'change column price source',
          o.t(null, void 0, t(4727)),
        ),
        Y = new n.TranslatedString(
          'change HLC bars color',
          o.t(null, void 0, t(21201)),
        ),
        Z = o.t(null, void 0, t(23111)),
        ee = o.t(null, void 0, t(886)),
        ie = o.t(null, void 0, t(23091)),
        te = o.t(null, void 0, t(23743)),
        oe = o.t(null, void 0, t(20215)),
        ne = o.t(null, void 0, t(74406)),
        re = o.t(null, void 0, t(333)),
        le = o.t(null, void 0, t(32163)),
        se = o.t(null, void 0, t(3554)),
        ae = o.t(null, void 0, t(89349)),
        ce = o.t(null, void 0, t(3159)),
        de = o.t(null, void 0, t(41129)),
        ue = o.t(null, void 0, t(61112)),
        pe = o.t(null, void 0, t(73185)),
        he =
          (o.t(null, void 0, t(36957)),
          o.t(null, void 0, t(17611)),
          o.t(null, void 0, t(77430)),
          o.t(null, void 0, t(73466)),
          o.t(null, void 0, t(88367)),
          o.t(null, void 0, t(6160)),
          o.t(null, void 0, t(28975))),
        ye = o.t(null, void 0, t(74406)),
        fe = o.t(null, void 0, t(333)),
        ve = o.t(null, void 0, t(5119)),
        ge = o.t(null, void 0, t(56359)),
        Se = o.t(null, void 0, t(84831)),
        be = o.t(null, void 0, t(34579)),
        we =
          (o.t(null, void 0, t(92516)),
          o.t(null, void 0, t(27377)),
          o.t(null, void 0, t(45054)),
          o.t(null, void 0, t(27377)))
      function Pe(e, i, t, o) {
        return (0, r.createCheckablePropertyDefinition)(
          {
            checked: (0, r.convertToDefinitionProperty)(
              e,
              i.barColorsOnPrevClose,
              g,
            ),
          },
          { id: `${t}${o}`, title: Z },
        )
      }
      function me(e, i, t, o) {
        const n = (0, d.removeSpaces)(t.originalText())
        return [
          (0, r.createTwoColorsPropertyDefinition)(
            {
              checked: (0, r.convertToDefinitionProperty)(
                e,
                i.drawBody,
                N.format({
                  candleType: t,
                }),
              ),
              color1: (0, r.getColorDefinitionProperty)(
                e,
                i.upColor,
                null,
                H.format({ candleType: t }),
              ),
              color2: (0, r.getColorDefinitionProperty)(
                e,
                i.downColor,
                null,
                R.format({ candleType: t }),
              ),
            },
            { id: `${o}Symbol${n}CandlesColor`, title: ne },
          ),
          (0, r.createTwoColorsPropertyDefinition)(
            {
              checked: (0, r.convertToDefinitionProperty)(
                e,
                i.drawBorder,
                U.format({ candleType: t }),
              ),
              color1: (0, r.getColorDefinitionProperty)(
                e,
                i.borderUpColor,
                null,
                j.format({ candleType: t }),
              ),
              color2: (0, r.getColorDefinitionProperty)(
                e,
                i.borderDownColor,
                null,
                z.format({ candleType: t }),
              ),
            },
            { id: `${o}Symbol${n}BordersColor`, title: re },
          ),
          (0, r.createTwoColorsPropertyDefinition)(
            {
              checked: (0, r.convertToDefinitionProperty)(
                e,
                i.drawWick,
                G.format({ candleType: t }),
              ),
              color1: (0, r.getColorDefinitionProperty)(
                e,
                i.wickUpColor,
                null,
                J.format({ candleType: t }),
              ),
              color2: (0, r.getColorDefinitionProperty)(
                e,
                i.wickDownColor,
                null,
                q.format({ candleType: t }),
              ),
            },
            { id: `${o}Symbol${n}WickColors`, title: le },
          ),
        ]
      }
      function Te(e, i, d, p, h) {
        switch (d) {
          case 0:
            return ((e, i, t) =>
              [
                Pe(e, i, t, 'SymbolBarStyleBarColorsOnPrevClose'),
                (0, r.createCheckablePropertyDefinition)(
                  {
                    checked: (0, r.convertToDefinitionProperty)(
                      e,
                      i.dontDrawOpen,
                      S,
                    ),
                  },
                  { id: `${t}SymbolDontDrawOpen`, title: ee },
                ),
                (0, r.createColorPropertyDefinition)(
                  {
                    color: (0, r.getColorDefinitionProperty)(
                      e,
                      i.upColor,
                      null,
                      b,
                    ),
                  },
                  { id: `${t}SymbolUpColor`, title: ie },
                ),
                (0, r.createColorPropertyDefinition)(
                  {
                    color: (0, r.getColorDefinitionProperty)(
                      e,
                      i.downColor,
                      null,
                      w,
                    ),
                  },
                  { id: `${t}SymbolDownColor`, title: te },
                ),
                (0, r.createCheckablePropertyDefinition)(
                  {
                    checked: (0, r.convertToDefinitionProperty)(
                      e,
                      i.thinBars,
                      P,
                    ),
                  },
                  { id: `${t}SymbolBarThinBars`, title: oe },
                ),
              ].filter(a.isExistent))(e, i.barStyle.childs(), h)
          case 1:
          case 19:
            return ((e, i, r) =>
              [
                Pe(e, i, r, 'SymbolCandleStyleBarColorsOnPrevClose'),
                ...me(
                  e,
                  i,
                  new n.TranslatedString('candle', o.t(null, void 0, t(21105))),
                  r,
                ),
              ].filter(a.isExistent))(
              e,
              1 === d ? i.candleStyle.childs() : i.volCandlesStyle.childs(),
              h,
            )
          case 2:
            return v(e, i.lineStyle.childs(), p.seriesPriceSources, h)
          case 14:
            return v(
              e,
              i.lineWithMarkersStyle.childs(),
              p.seriesPriceSources,
              h,
            )
          case 15:
            return v(e, i.steplineStyle.childs(), p.seriesPriceSources, h)
          case 3:
            return ((e, i, t, o) => [
              (0, u.createPriceSourceDefinition)(
                e,
                i,
                t,
                o,
                'SymbolAreaPriceSource',
                m,
              ),
              (0, r.createLinePropertyDefinition)(
                {
                  color: (0, r.getColorDefinitionProperty)(
                    e,
                    i.linecolor,
                    null,
                    T,
                  ),
                  width: (0, r.convertToDefinitionProperty)(e, i.linewidth, D),
                },
                { id: `${o}SymbolAreaLineStyle`, title: se },
              ),
              (0, r.createTwoColorsPropertyDefinition)(
                {
                  color1: (0, r.getColorDefinitionProperty)(
                    e,
                    i.color1,
                    i.transparency,
                    C,
                  ),
                  color2: (0, r.getColorDefinitionProperty)(
                    e,
                    i.color2,
                    i.transparency,
                    C,
                  ),
                },
                { id: `${o}SymbolAreaFills`, title: de },
              ),
            ])(e, i.areaStyle.childs(), p.seriesPriceSources, h)
          case 16:
            return ((e, i, t, o) => [
              (0, r.createLinePropertyDefinition)(
                {
                  color: (0, r.getColorDefinitionProperty)(
                    e,
                    i.highLineColor,
                    null,
                    T,
                  ),
                  width: (0, r.convertToDefinitionProperty)(
                    e,
                    i.highLineWidth,
                    D,
                  ),
                },
                { id: `${o}SymbolHLCAreaHighLineStyle`, title: ge },
              ),
              (0, r.createLinePropertyDefinition)(
                {
                  color: (0, r.getColorDefinitionProperty)(
                    e,
                    i.lowLineColor,
                    null,
                    T,
                  ),
                  width: (0, r.convertToDefinitionProperty)(
                    e,
                    i.lowLineWidth,
                    D,
                  ),
                },
                { id: `${o}SymbolHLCAreaLowLineStyle`, title: be },
              ),
              (0, r.createLinePropertyDefinition)(
                {
                  color: (0, r.getColorDefinitionProperty)(
                    e,
                    i.closeLineColor,
                    null,
                    T,
                  ),
                  width: (0, r.convertToDefinitionProperty)(
                    e,
                    i.closeLineWidth,
                    D,
                  ),
                },
                { id: `${o}SymbolHLCAreaCloseLineStyle`, title: Se },
              ),
              (0, r.createTwoColorsPropertyDefinition)(
                {
                  color1: (0, r.getColorDefinitionProperty)(
                    e,
                    i.highCloseFillColor,
                    null,
                    C,
                  ),
                  color2: (0, r.getColorDefinitionProperty)(
                    e,
                    i.closeLowFillColor,
                    null,
                    C,
                  ),
                },
                { id: `${o}SymbolHLCAreaFills`, title: de },
              ),
            ])(e, i.hlcAreaStyle.childs(), p.seriesPriceSources, h)
          case 9:
            return me(
              e,
              i.hollowCandleStyle.childs(),
              new n.TranslatedString(
                'hollow candles',
                o.t(null, void 0, t(92598)),
              ),
              h,
            )
          case 10:
            return ((e, i, t, o) => [
              (0, u.createPriceSourceDefinition)(
                e,
                i,
                t,
                o,
                'SymbolBaseLinePriceSource',
                _,
              ),
              (0, r.createLinePropertyDefinition)(
                {
                  color: (0, r.getColorDefinitionProperty)(
                    e,
                    i.topLineColor,
                    null,
                    k,
                  ),
                  width: (0, r.convertToDefinitionProperty)(
                    e,
                    i.topLineWidth,
                    W,
                  ),
                },
                { id: `${o}SymbolBaseLineTopLine`, title: ae },
              ),
              (0, r.createLinePropertyDefinition)(
                {
                  color: (0, r.getColorDefinitionProperty)(
                    e,
                    i.bottomLineColor,
                    null,
                    $,
                  ),
                  width: (0, r.convertToDefinitionProperty)(
                    e,
                    i.bottomLineWidth,
                    M,
                  ),
                },
                { id: `${o}SymbolBaseLineBottomLine`, title: ce },
              ),
              (0, r.createTwoColorsPropertyDefinition)(
                {
                  color1: (0, r.getColorDefinitionProperty)(
                    e,
                    i.topFillColor1,
                    null,
                    V,
                  ),
                  color2: (0, r.getColorDefinitionProperty)(
                    e,
                    i.topFillColor2,
                    null,
                    V,
                  ),
                },
                { id: `${o}SymbolBaseLineTopFills`, title: ue },
              ),
              (0, r.createTwoColorsPropertyDefinition)(
                {
                  color1: (0, r.getColorDefinitionProperty)(
                    e,
                    i.bottomFillColor1,
                    null,
                    L,
                  ),
                  color2: (0, r.getColorDefinitionProperty)(
                    e,
                    i.bottomFillColor2,
                    null,
                    L,
                  ),
                },
                { id: `${o}SymbolBaseLineBottomFills`, title: pe },
              ),
              (0, r.createNumberPropertyDefinition)(
                {
                  value: (0, r.convertToDefinitionProperty)(
                    e,
                    i.baseLevelPercentage,
                    I,
                    [c.floor],
                  ),
                },
                {
                  id: `${o}SymbolBaseLevelPercentage`,
                  title: he,
                  type: 0,
                  min: new l.WatchedValue(0),
                  max: new l.WatchedValue(100),
                  step: new l.WatchedValue(1),
                  unit: new l.WatchedValue('%'),
                },
              ),
            ])(e, i.baselineStyle.childs(), p.seriesPriceSources, h)
          case 13:
            return ((e, i, t, o) =>
              [
                (0, u.createPriceSourceDefinition)(
                  e,
                  i,
                  t,
                  o,
                  'SymbolColumnPriceSource',
                  X,
                ),
                Pe(e, i, o, 'SymbolColumnStyleColumnColorsOnPrevClose'),
                (0, r.createColorPropertyDefinition)(
                  {
                    color: (0, r.getColorDefinitionProperty)(
                      e,
                      i.upColor,
                      null,
                      K,
                    ),
                  },
                  { id: `${o}SymbolUpColor`, title: ie },
                ),
                (0, r.createColorPropertyDefinition)(
                  {
                    color: (0, r.getColorDefinitionProperty)(
                      e,
                      i.downColor,
                      null,
                      Q,
                    ),
                  },
                  { id: `${o}SymbolDownColor`, title: te },
                ),
              ].filter(a.isExistent))(
              e,
              i.columnStyle.childs(),
              p.seriesPriceSources,
              h,
            )
          case 21:
            return ((e, i, t) =>
              [
                (0, r.createColorPropertyDefinition)(
                  {
                    color: (0, r.getColorDefinitionProperty)(
                      e,
                      i.color,
                      null,
                      Y,
                    ),
                  },
                  { id: `${t}SymbolColor`, title: we },
                ),
                (0, r.createCheckablePropertyDefinition)(
                  {
                    checked: (0, r.convertToDefinitionProperty)(
                      e,
                      i.thinBars,
                      P,
                    ),
                  },
                  { id: `${t}SymbolBarThinBars`, title: oe },
                ),
              ].filter(a.isExistent))(e, i.hlcBarsStyle.childs(), h)
        }
        if (12 === d && s.enabled('chart_style_hilo')) {
          return ((e, i, t) => [
            (0, r.createColorPropertyDefinition)(
              {
                checked: (0, r.convertToDefinitionProperty)(e, i.drawBody, O),
                color: (0, r.getColorDefinitionProperty)(e, i.color, null, B),
              },
              { id: `${t}SymbolBodiesColor`, title: ye },
            ),
            (0, r.createColorPropertyDefinition)(
              {
                checked: (0, r.convertToDefinitionProperty)(
                  e,
                  i.showBorders,
                  E,
                ),
                color: (0, r.getColorDefinitionProperty)(
                  e,
                  i.borderColor,
                  null,
                  x,
                ),
              },
              { id: `${t}SymbolBorderColor`, title: fe },
            ),
            (0, r.createTextPropertyDefinition)(
              {
                checked: (0, r.convertToDefinitionProperty)(e, i.showLabels, A),
                color: (0, r.getColorDefinitionProperty)(
                  e,
                  i.labelColor,
                  null,
                  F,
                ),
              },
              {
                id: `${t}SymbolLabels`,
                title: ve,
                isEditable: !1,
                isMultiLine: !1,
              },
            ),
          ])(e, i.hiloStyle.childs(), h)
        }
        if (!Object.hasOwn(i, 'haStyle')) return []
        if (p.isJapaneseChartsAvailable && 8 === d) {
          return ((e, i, r) => {
            const l = []
            return (
              l.push(
                Pe(e, i, r, 'SymbolHAStyleBarColorsOnPrevClose'),
                ...me(
                  e,
                  i,
                  new n.TranslatedString(
                    'Heikin Ashi',
                    o.t(null, void 0, t(63876)),
                  ),
                  r,
                ),
              ),
              l
            )
          })(e, i.haStyle.childs(), h)
        }
        return (
          p.isJapaneseChartsAvailable && s.enabled('japanese_chart_styles'), []
        )
      }
    },
    64482: (e, i, t) => {
      t.d(i, {
        SeriesPropertyDefinitionsViewModel: () => N,
        seriesPrecisionValues: () => F,
      })
      var o = t(50151),
        n = t(9343),
        r = t(11542),
        l = t(45126),
        s = t(56570),
        a = t(32097),
        c = t(5171),
        d = t(64147),
        u = t(16638),
        p = t(68805),
        h = t(18653),
        y = t(56530),
        f = t(52305)
      const v = new l.TranslatedString(
        'change {inputName} property',
        r.t(null, void 0, t(66110)),
      )
      function g(e) {
        return e.map((e) => ({
          value: e,
          title: (0, y.getTranslatedInputTitle)(e),
        }))
      }
      const S = new Set(['percentageLTP'])
      function b(e, i, t, n, r, s, c) {
        const u = []
        return (
          t.forEach((t) => {
            if (
              !((e, i) =>
                !e.isHidden &&
                (void 0 === e.visible ||
                  ((e, i) => {
                    if (!e) return !0
                    const t = e.split('==')
                    return !(t.length < 2) && i[t[0]].value() === t[1]
                  })(e.visible, i)))(t, n)
            )
              return
            const h = t.id
            if (!Object.hasOwn(n, h)) return
            const b = n[h],
              w = ((e, i) =>
                'style' === e.id
                  ? 'Box size assignment method'
                  : 'boxSize' === e.id
                    ? 'Box size'
                    : i.childs().name.value())(t, r[h]),
              P = (0, y.getTranslatedInputTitle)(w),
              m = new l.TranslatedString(w, P)
            if ('options' in t) {
              const i = (0, o.ensure)(t.options)
              u.push(
                (0, a.createOptionsPropertyDefinition)(
                  {
                    option: (0, a.convertToDefinitionProperty)(
                      e,
                      b,
                      v.format({ inputName: m }),
                    ),
                  },
                  {
                    id: `${c}${t.name}`,
                    title: P,
                    options: new d.WatchedValue(g(i)),
                  },
                ),
              )
            } else if ('integer' !== t.type) {
              if ('float' === t.type) {
                let o
                return (
                  (o =
                    ((e, i) =>
                      !(
                        ((i === (0, p.chartStyleStudyId)(4) ||
                          i === (0, p.chartStyleStudyId)(6)) &&
                          'boxSize' === e) ||
                        (i === (0, p.chartStyleStudyId)(5) &&
                          'reversalAmount' === e)
                      ))(h, i) || null === s.value()
                      ? new d.WatchedValue(t.min)
                      : s),
                  void u.push(
                    (0, a.createNumberPropertyDefinition)(
                      {
                        value: (0, a.convertToDefinitionProperty)(
                          e,
                          b,
                          v.format({ inputName: m }),
                        ),
                      },
                      {
                        id: `${c}${t.name}`,
                        title: P,
                        type: 1,
                        min: o,
                        max: new d.WatchedValue(t.max),
                        unit: S.has(t.id) ? new d.WatchedValue('%') : void 0,
                        defval: t.defval,
                      },
                    ),
                  )
                )
              }
              'text' !== t.type
                ? 'bool' !== t.type ||
                  u.push(
                    (0, a.createCheckablePropertyDefinition)(
                      {
                        checked: (0, a.convertToDefinitionProperty)(
                          e,
                          b,
                          v.format({ inputName: m }),
                        ),
                      },
                      { id: `${c}${t.name}`, title: P },
                    ),
                  )
                : u.push(
                    (0, a.createTextPropertyDefinition)(
                      {
                        text: (0, a.convertToDefinitionProperty)(
                          e,
                          b,
                          v.format({ inputName: m }),
                        ),
                      },
                      {
                        id: `${c}${t.name}`,
                        title: P,
                        isEditable: !0,
                        isMultiLine: !1,
                      },
                    ),
                  )
            } else
              u.push(
                (0, a.createNumberPropertyDefinition)(
                  {
                    value: (0, a.convertToDefinitionProperty)(
                      e,
                      b,
                      v.format({ inputName: m }),
                      [f.floor],
                    ),
                  },
                  {
                    id: `${c}${t.name}`,
                    title: P,
                    type: 0,
                    min: new d.WatchedValue(t.min),
                    max: new d.WatchedValue(t.max),
                    unit: S.has(t.id) ? new d.WatchedValue('%') : void 0,
                    defval: t.defval,
                  },
                ),
              )
          }),
          u
        )
      }
      var w = t(14712),
        P = t(84425),
        m = t(88960),
        T = t(95700),
        D = t(74343)
      const C = (0, n.getLogger)('Chart.Definitions.Series'),
        _ = s.enabled('pre_post_market_sessions'),
        k = new l.TranslatedString(
          'change decimal places',
          r.t(null, void 0, t(82063)),
        ),
        W = new l.TranslatedString(
          'change timezone',
          r.t(null, void 0, t(20137)),
        ),
        $ =
          (new l.TranslatedString(
            'adjust data for dividends',
            r.t(null, void 0, t(18077)),
          ),
          new l.TranslatedString(
            'use settlement as close on daily interval',
            r.t(null, void 0, t(92978)),
          ),
          new l.TranslatedString(
            'adjust for contract changes',
            r.t(null, void 0, t(1433)),
          ),
          new l.TranslatedString(
            'change session',
            r.t(null, void 0, t(87041)),
          )),
        M = new l.TranslatedString(
          'change extended hours color',
          r.t(null, void 0, t(44223)),
        ),
        V = new l.TranslatedString(
          'change pre market color',
          r.t(null, void 0, t(44371)),
        ),
        L = new l.TranslatedString(
          'change post market color',
          r.t(null, void 0, t(38730)),
        ),
        I =
          (new l.TranslatedString(
            'change electronic trading hours',
            r.t(null, void 0, t(47393)),
          ),
          r.t(null, void 0, t(93020)),
          r.t(null, void 0, t(94031))),
        O =
          (r.t(null, void 0, t(68921)),
          r.t(null, void 0, t(49545)),
          r.t(null, void 0, t(88327))),
        B = (r.t(null, void 0, t(59777)), r.t(null, void 0, t(59766))),
        E = r.t(null, void 0, t(77073)),
        x = r.t(null, void 0, t(16564)),
        A = [
          { priceScale: 2, minMove: 1, frac: !0 },
          { priceScale: 4, minMove: 1, frac: !0 },
          { priceScale: 8, minMove: 1, frac: !0 },
          { priceScale: 16, minMove: 1, frac: !0 },
          { priceScale: 32, minMove: 1, frac: !0 },
          { priceScale: 64, minMove: 1, frac: !0 },
          { priceScale: 128, minMove: 1, frac: !0 },
          { priceScale: 320, minMove: 1, frac: !0 },
        ]
      function F() {
        const e = [{ title: x, value: 'default' }],
          i = ((e = 15) => {
            const i = []
            for (let t = 0; t <= e; t++)
              i.push({ priceScale: Math.pow(10, t), minMove: 1, frac: !1 })
            return i
          })()
        for (let o = 0; o < i.length; o++) {
          const n = Math.log10(i[o].priceScale),
            l =
              0 === n
                ? r.t(null, void 0, t(47326))
                : r.t(
                    null,
                    {
                      plural: '{value} decimals',
                      count: n,
                      replace: { value: n.toString() },
                    },
                    t(59644),
                  )
          e.push({
            title: l,
            value: `${i[o].priceScale},${i[o].minMove},${i[o].frac}`,
          })
        }
        for (let i = 0; i < A.length; i++)
          e.push({
            title: `${A[i].minMove}/${A[i].priceScale}`,
            value: `${A[i].priceScale},${A[i].minMove},${A[i].frac}`,
          })
        return e
      }
      class N {
        constructor(e, i, t, o, n, r) {
          ;(this._definitions = null),
            (this._inputsSubscriptions = null),
            (this._isDestroyed = !1),
            (this._propertyPages = null),
            (this._seriesMinTickWV = null),
            (this._sessionIdOptionsWV = new d.WatchedValue([])),
            (this._series = e),
            (this._undoModel = i),
            (this._model = this._undoModel.model()),
            (this._propertyPageId = t),
            (this._propertyPageName = o),
            (this._propertyPageIcon = n),
            (this._timezonePropertyObj = r),
            this._series
              .onStyleChanged()
              .subscribe(this, this._updateDefinitions),
            this._series
              .properties()
              .childs()
              .rangeStyle.childs()
              .barStyle.subscribe(this, this._updateDefinitions),
            this._series
              .dataEvents()
              .symbolResolved()
              .subscribe(this, this._updateSeriesMinTickWV),
            this._series
              .dataEvents()
              .symbolResolved()
              .subscribe(this, this._updateSessionIdOptionsWV),
            this._updateSeriesMinTickWV(),
            this._updateSessionIdOptionsWV()
        }
        destroy() {
          null !== this._propertyPages &&
            this._propertyPages.forEach((e) => {
              ;(0, a.destroyDefinitions)(e.definitions.value())
            }),
            this._series
              .onStyleChanged()
              .unsubscribe(this, this._updateDefinitions),
            this._series
              .properties()
              .childs()
              .rangeStyle.childs()
              .barStyle.unsubscribeAll(this),
            this._series.dataEvents().symbolResolved().unsubscribeAll(this),
            this._unsubscribeInputsUpdate(),
            (this._isDestroyed = !0)
        }
        propertyPages() {
          return null === this._propertyPages
            ? this._getDefinitions().then((e) => {
                if (this._isDestroyed)
                  throw new Error(
                    'SeriesPropertyDefinitionsViewModel already destroyed',
                  )
                return (
                  null === this._propertyPages &&
                    (this._propertyPages = [
                      {
                        id: this._propertyPageId,
                        title: this._propertyPageName,
                        icon: this._propertyPageIcon,
                        definitions: new d.WatchedValue(e.definitions),
                        visible: e.visible ?? new d.WatchedValue(!0).readonly(),
                      },
                    ]),
                  this._propertyPages
                )
              })
            : Promise.resolve(this._propertyPages)
        }
        _seriesMinTick() {
          const e = this._series.symbolInfo()
          return null !== e ? e.minmov / e.pricescale : null
        }
        _updateSeriesMinTickWV() {
          null === this._seriesMinTickWV
            ? (this._seriesMinTickWV = new d.WatchedValue(
                this._seriesMinTick(),
              ))
            : this._seriesMinTickWV.setValue(this._seriesMinTick())
        }
        _updateSessionIdOptionsWV() {
          if (!_) return
          const e = this._series.symbolInfo()
          if (null === e) return
          const i = (e.subsessions || [])
            .filter((e) => !e.private)
            .map((e) => ({
              title: (0, T.translateSessionDescription)(e.description),
              value: e.id,
            }))
          this._sessionIdOptionsWV.setValue(i)
        }
        _updateDefinitions() {
          null !== this._definitions &&
            (0, a.destroyDefinitions)(this._definitions.definitions),
            (this._definitions = null),
            this._createSeriesDefinitions().then((e) => {
              if (this._isDestroyed)
                throw new Error(
                  'SeriesPropertyDefinitionsViewModel already destroyed',
                )
              ;(0, o.ensureNotNull)(
                this._propertyPages,
              )[0].definitions.setValue(e.definitions)
            })
        }
        _getDefinitions() {
          return null === this._definitions
            ? this._createSeriesDefinitions()
            : Promise.resolve(this._definitions)
        }
        _unsubscribeInputsUpdate() {
          null !== this._inputsSubscriptions &&
            (this._inputsSubscriptions.forEach((e) => {
              e.unsubscribeAll(this)
            }),
            (this._inputsSubscriptions = null))
        }
        _subscribeInputsUpdate(e, i) {
          this._unsubscribeInputsUpdate()
          const t = []
          e.forEach((e) => {
            if (void 0 !== e.visible) {
              const o = e.visible.split('==')
              if (2 === o.length) {
                const e = i[o[0]]
                ;-1 === t.indexOf(e) &&
                  (e.subscribe(this, this._updateDefinitions), t.push(e))
              }
            }
          }),
            t.length > 0
              ? (this._inputsSubscriptions = t)
              : (this._inputsSubscriptions = null)
        }
        async _createSeriesDefinitions() {
          const e = this._series.properties().childs(),
            i = this._series.getInputsProperties(),
            n = this._series.getInputsInfoProperties(),
            l = e.style.value(),
            s = this._series.getStyleShortName(),
            y = c.chartStylesWithAttachedStudies.includes(l)
              ? null
              : (0, p.chartStyleStudyId)(l)
          let f,
            v = null
          if (null !== y) {
            let e
            try {
              e = await (0, u.studyMetaInfoRepository)().findById({
                type: 'java',
                studyId: y,
              })
              const t = (0, o.ensureNotNull)(this._seriesMinTickWV)
              ;(v = b(this._undoModel, e.id, e.inputs, i, n, t, s)),
                this._subscribeInputsUpdate(e.inputs, i)
            } catch (i) {
              C.logWarn(
                `Find meta info for create series definitions with error - ${(0, w.errorToString)(i)}`,
              ),
                (e = null)
            }
            if (this._isDestroyed)
              throw new Error(
                'SeriesPropertyDefinitionsViewModel already destroyed',
              )
          } else this._unsubscribeInputsUpdate()
          if (this._isDestroyed)
            throw new Error(
              'SeriesPropertyDefinitionsViewModel already destroyed',
            )
          if (c.chartStylesWithAttachedStudies.includes(l))
            throw new Error('unexpected chart style')
          {
            const i = (0, h.getSeriesStylePropertiesDefinitions)(
              this._undoModel,
              e,
              l,
              {
                seriesPriceSources: D.basePriceSources,
                isJapaneseChartsAvailable: true,
              },
              'mainSeries',
            )
            null !== v && i.push(...v),
              (f = (0, a.createPropertyDefinitionsGeneralGroup)(
                i,
                'generalSymbolStylesGroup',
                (0, p.getTranslatedChartStyleName)(l),
              ))
          }
          const g = (0, a.createOptionsPropertyDefinition)(
              {
                option: (0, a.convertToDefinitionProperty)(
                  this._undoModel,
                  e.minTick,
                  k,
                ),
                visible: (0, a.convertFromReadonlyWVToDefinitionProperty)(
                  new d.WatchedValue(!0).ownership(),
                ),
              },
              {
                id: `${s}SymbolMinTick`,
                title: B,
                options: new d.WatchedValue(F()),
              },
            ),
            S = (0, a.createOptionsPropertyDefinition)(
              {
                option: (0, a.convertToDefinitionProperty)(
                  this._undoModel,
                  this._timezonePropertyObj.property,
                  W,
                ),
              },
              {
                id: `${s}SymbolTimezone`,
                title: E,
                options: new d.WatchedValue(this._timezonePropertyObj.values),
              },
            )
          return (
            (this._definitions = {
              definitions: [
                f,
                (0, a.createPropertyDefinitionsGeneralGroup)(
                  [...(await this._seriesDataDefinitions(s)), g, S],
                  'dataModififcationGroup',
                  r.t(null, void 0, t(48225)),
                ),
              ],
            }),
            this._definitions
          )
        }
        async _seriesDataDefinitions(e) {
          const i = []
          if (_) {
            const t = this._series.sessionIdProxyProperty(),
              o = (0, m.combineWithFilteredUpdate)(
                (e, i) =>
                  !i &&
                  (0, p.symbolHasSeveralSessions)(this._series.symbolInfo()),
                (e, i) => i || !e,
                this._series.symbolResolvingActive().weakReference(),
                (0, P.createWVFromProperty)(
                  this._series.isDWMProperty(),
                ).ownership(),
              ),
              n = (0, a.createOptionsPropertyDefinition)(
                {
                  option: (0, a.convertToDefinitionProperty)(
                    this._undoModel,
                    t,
                    $,
                  ),
                  visible: (0, a.convertFromReadonlyWVToDefinitionProperty)(
                    o.ownership(),
                  ),
                },
                {
                  id: 'sessionId',
                  title: I,
                  options: this._sessionIdOptionsWV,
                },
              )
            i.push(n)
            const r = (await this._model.sessions().promise()).graphicsInfo()
            let l = !1
            r.backgrounds && (l = void 0 !== r.backgrounds.outOfSession)
            const s = await (l
              ? this._createOutOfSessionDefinition(e)
              : this._createPrePostMarketDefinition(e))
            i.push(s)
            const c = this._createElectronicSessionDefinition(e)
            c && i.push(c)
          }
          return i
        }
        _createOutOfSessionDefinition(e) {
          const i = this._model
            .sessions()
            .properties()
            .childs()
            .sessionHighlight.childs()
            .backgrounds.childs()
            .outOfSession.childs()
          return (0, a.createColorPropertyDefinition)(
            {
              color: (0, a.getColorDefinitionProperty)(
                this._undoModel,
                i.color,
                i.transparency,
                M,
              ),
            },
            { id: `${e}SymbolExtendedHoursColors`, title: O },
          )
        }
        _createPrePostMarketDefinition(e) {
          const i = (0, P.createWVFromGetterAndSubscription)(
              () => this._series.symbolInfo(),
              this._series.dataEvents().symbolResolved(),
            ),
            t = (0, m.combineWithFilteredUpdate)(
              (e, i) =>
                !e &&
                !!i &&
                (0, p.symbolHasPreOrPostMarket)(i) &&
                !(0, p.isRegularSessionId)(
                  this._series.sessionIdProxyProperty().value(),
                  i,
                ),
              (e, i) => e || !!i,
              (0, P.createWVFromProperty)(
                this._series.isDWMProperty(),
              ).ownership(),
              i.ownership(),
            ),
            o = this._model
              .sessions()
              .properties()
              .childs()
              .sessionHighlight.childs(),
            n = o.backgrounds.childs().preMarket.childs(),
            r = o.backgrounds.childs().postMarket.childs()
          return (0, a.createTwoColorsPropertyDefinition)(
            {
              color1: (0, a.getColorDefinitionProperty)(
                this._undoModel,
                n.color,
                n.transparency,
                V,
              ),
              color2: (0, a.getColorDefinitionProperty)(
                this._undoModel,
                r.color,
                r.transparency,
                L,
              ),
              visible: (0, a.convertFromReadonlyWVToDefinitionProperty)(
                t.ownership(),
              ),
            },
            { id: `${e}SymbolExtendedHoursColors`, title: O },
          )
        }
        _createElectronicSessionDefinition(e) {
          return null
        }
      }
    },
  },
])
