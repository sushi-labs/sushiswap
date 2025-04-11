export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Kadena Token Info API',
    version: '1.0.0',
    description: 'API for retrieving Kadena token information',
  },
  servers: [
    {
      url: '/',
      description: 'API server',
    },
  ],
  paths: {
    '/kadena/token-info': {
      get: {
        summary: 'Get token information',
        description: 'Retrieve information about a specific Kadena token',
        parameters: [
          {
            name: 'tokenAddress',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'The address of the token to retrieve information for',
            example: 'free.wiza',
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      type: 'object',
                      properties: {
                        tokenAddress: {
                          type: 'string',
                          example: 'coin',
                        },
                        tokenSymbol: {
                          type: 'string',
                          example: 'KDA',
                        },
                        tokenDecimals: {
                          type: 'number',
                          example: 12,
                        },
                        tokenImage: {
                          type: 'string',
                          example:
                            'https://sushi-swapassets.blob.core.windows.net/public/tokens/K%20Logo%20Dark%20Blue%20Backround.png',
                        },
                        name: {
                          type: 'string',
                          example: 'Kadena',
                        },
                        validated: {
                          type: 'boolean',
                          example: true,
                        },
                        tokenInfo: {
                          type: 'object',
                          properties: {
                            decimalsToDisplay: {
                              type: 'number',
                              example: 12,
                            },
                            description: {
                              type: 'string',
                              example:
                                'The native token of the Kadena blockchain',
                            },
                            discordUrl: {
                              type: 'string',
                              example: 'https://discord.gg/kadena',
                            },
                            websiteUrl: {
                              type: 'string',
                              example: 'https://kadena.io',
                            },
                            twitterUrl: {
                              type: 'string',
                              example: 'https://twitter.com/kadena_io',
                            },
                            themeColor: {
                              type: 'string',
                              example: '86, 188, 247',
                            },
                            telegramUrl: {
                              type: 'string',
                              example: 'https://t.me/kadena_io',
                            },
                            mediumUrl: {
                              type: 'string',
                              example: 'https://medium.com/kadena-io',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request - Token address is required',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    error: {
                      type: 'string',
                      example: 'Token address is required',
                    },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Not Found - Token not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    error: {
                      type: 'string',
                      example: 'Token not found',
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    error: {
                      type: 'string',
                      example: 'Internal server error',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}
