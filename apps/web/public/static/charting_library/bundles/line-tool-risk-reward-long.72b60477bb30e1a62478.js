;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2277],
  {
    21986: (e, r, t) => {
      t.r(r), t.d(r, { LineToolRiskRewardLong: () => n })
      var i = t(50151),
        o = t(11667),
        s = t(32679)
      class n extends o.LineToolRiskRewardBase {
        constructor(e, r, t, i) {
          super(
            e,
            r ?? n.createProperties(e.backgroundTheme().spawnOwnership()),
            t,
            i,
          )
        }
        name() {
          return 'Risk/Reward long'
        }
        stopPrice() {
          return (
            this.entryPrice() -
            this.properties().childs().stopLevel.value() /
              this.ownerSourceBase()
          )
        }
        profitPrice() {
          return (
            this.entryPrice() +
            this.properties().childs().profitLevel.value() /
              this.ownerSourceBase()
          )
        }
        calculatePL(e) {
          return e - this.entryPrice()
        }
        prepareStopPrice(e) {
          e = this._roundPrice(e)
          const r = this.entryPrice() - 1 / this.ownerSourceBase()
          return Math.min(e, r)
        }
        prepareProfitPrice(e) {
          e = this._roundPrice(e)
          const r = this.entryPrice() + 1 / this.ownerSourceBase()
          return Math.max(e, r)
        }
        static createProperties(e, r) {
          const t = new s.DefaultProperty({
            defaultName: 'linetoolriskrewardlong',
            state: r,
            theme: e,
          })
          return this._configureProperties(t), t
        }
        _amountTarget(e, r, t, i, s) {
          const n = this._closePointCurrencyRate()
          return null === n
            ? Number.NaN
            : (0, o.roundValue)(e + ((r - t) * i * s) / n)
        }
        _amountStop(e, r, t, i, s) {
          const n = this._closePointCurrencyRate()
          return null === n
            ? Number.NaN
            : (0, o.roundValue)(e - ((t - r) * i * s) / n)
        }
        _checkStopPrice(e) {
          const r = this.stopPrice(),
            t = this.profitPrice()
          return (0, i.ensure)(e[3]) <= r
            ? this.stopPrice()
            : (0, i.ensure)(e[2]) >= t
              ? this.profitPrice()
              : null
        }
        _orderSide() {
          throw new Error('not supported')
        }
      }
      ;(0, o.registerReversibleTool)('LineToolRiskRewardShort', {
        targetToolName: 'LineToolRiskRewardLong',
        propertiesFactory: (e, r) => n.createProperties(e, r),
      })
    },
  },
])
