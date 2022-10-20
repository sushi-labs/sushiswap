const BaseChecker = require('../base-checker')
const { severityDescription, formatEnum } = require('../../doc/utils')

const ruleId = 'quotes'
const DEFAULT_SEVERITY = 'error'
const DEFAULT_QUOTES_TYPE = 'double'
const QUOTE_TYPES = ['single', 'double']
const meta = {
  type: 'miscellaneous',

  docs: {
    description: `Use double quotes for string literals. Values must be 'single' or 'double'.`,
    category: 'Style Guide Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY
      },
      {
        description: `Type of quotes. Must be one of ${formatEnum(QUOTE_TYPES)}`,
        default: DEFAULT_QUOTES_TYPE
      }
    ],
    examples: {
      good: [
        {
          description: 'String with double quotes',
          code: require('../../../test/fixtures/miscellaneous/string-with-double-quotes')
        }
      ],
      bad: [
        {
          description: 'String with single quotes',
          code: require('../../../test/fixtures/miscellaneous/string-with-single-quotes')
        }
      ]
    }
  },

  isDefault: false,
  recommended: true,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_QUOTES_TYPE],

  schema: [
    {
      type: 'array',
      items: [
        {
          type: 'string',
          enum: QUOTE_TYPES
        }
      ],
      uniqueItems: true,
      minItems: 2
    }
  ]
}

class QuotesChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    const quoteType = config && config.rules && config.rules.quotes && config.rules.quotes[1]
    this.quoteType = (QUOTE_TYPES.includes(quoteType) && quoteType) || DEFAULT_QUOTES_TYPE
    this.incorrectQuote = this.quoteType === 'single' ? '"' : "'"
  }

  exitPrimaryExpression(ctx) {
    this.validateQuotes(ctx)
  }

  exitAssemblyLiteral(ctx) {
    this.validateQuotes(ctx)
  }

  exitImportDirective(ctx) {
    const children = ctx.children

    if (children && children.length >= 2) {
      this.validateQuotes(children[1])
    }

    for (let i = 0; i < children.length; i += 1) {
      const curChild = children[i]

      if (curChild.getText && curChild.getText() === 'from' && i + 1 < children.length) {
        this.validateQuotes(children[i + 1])
      }
    }
  }

  validateQuotes(ctx) {
    if (ctx.getText().startsWith(this.incorrectQuote)) {
      this._error(ctx)
    }
  }

  _error(ctx) {
    this.error(ctx, `Use ${this.quoteType} quotes for string literals`)
  }
}

module.exports = QuotesChecker
