import { NextConfig, NextApiHandler, NextApiResponse, NextApiRequest } from 'next';
import { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server';
import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { Logger, RequestReport } from './logger';
import { Rewrite } from 'next/dist/lib/load-custom-routes';
import { proxyPath, EndpointType, getIngestURL, vercelRegion } from './shared';

declare global {
  var EdgeRuntime: string;
}

function withAxiomNextConfig(nextConfig: NextConfig): NextConfig {
  return {
    ...nextConfig,
    rewrites: async () => {
      const rewrites = await nextConfig.rewrites?.();

      const webVitalsEndpoint = getIngestURL(EndpointType.webVitals);
      const logsEndpoint = getIngestURL(EndpointType.logs);
      if (!webVitalsEndpoint && !logsEndpoint) {
        const log = new Logger();
        log.warn(
          'axiom: Envvars not detected. If this is production please see https://github.com/axiomhq/next-axiom for help'
        );
        log.warn('axiom: Sending Web Vitals to /dev/null');
        log.warn('axiom: Sending logs to console');
        return rewrites || []; // nothing to do
      }

      const axiomRewrites: Rewrite[] = [
        {
          source: `${proxyPath}/web-vitals`,
          destination: webVitalsEndpoint,
          basePath: false,
        },
        {
          source: `${proxyPath}/logs`,
          destination: logsEndpoint,
          basePath: false,
        },
      ];

      if (!rewrites) {
        return axiomRewrites;
      } else if (Array.isArray(rewrites)) {
        return rewrites.concat(axiomRewrites);
      } else {
        rewrites.afterFiles = (rewrites.afterFiles || []).concat(axiomRewrites);
        return rewrites;
      }
    },
  };
}

// Sending logs after res.{json,send,end} is very unreliable.
// This function overwrites these functions and makes sure logs are sent out
// before the response is sent.
function interceptNextApiResponse(req: AxiomAPIRequest, res: NextApiResponse): [NextApiResponse, Promise<void>[]] {
  const allPromises: Promise<void>[] = [];

  const resSend = res.send;
  res.send = (body: any) => {
    allPromises.push(
      (async () => {
        req.log.attachResponseStatus(res.statusCode);
        await req.log.flush();
        resSend(body);
      })()
    );
  };

  const resJson = res.json;
  res.json = (json: any) => {
    allPromises.push(
      (async () => {
        req.log.attachResponseStatus(res.statusCode);
        await req.log.flush();
        resJson(json);
      })()
    );
  };

  const resEnd = res.end;
  res.end = (cb?: () => undefined): NextApiResponse => {
    allPromises.push(
      (async () => {
        req.log.attachResponseStatus(res.statusCode);
        await req.log.flush();
        resEnd(cb);
      })()
    );
    return res;
  };

  return [res, allPromises];
}

export type AxiomAPIRequest = NextApiRequest & { log: Logger };
export type AxiomApiHandler = (
  request: AxiomAPIRequest,
  response: NextApiResponse
) => NextApiHandler | Promise<NextApiHandler> | Promise<void>;

function withAxiomNextApiHandler(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const report: RequestReport = {
      startTime: new Date().getTime(),
      path: req.url!,
      method: req.method!,
      host: getHeaderOrDefault(req, 'host', ''),
      userAgent: getHeaderOrDefault(req, 'user-agent', ''),
      scheme: 'https',
      ip: getHeaderOrDefault(req, 'x-forwarded-for', ''),
      region: vercelRegion,
    };
    const logger = new Logger({}, report, false, 'lambda');
    const axiomRequest = req as AxiomAPIRequest;
    axiomRequest.log = logger;
    const [wrappedRes, allPromises] = interceptNextApiResponse(axiomRequest, res);

    try {
      await handler(axiomRequest, wrappedRes);
      await logger.flush();
      await Promise.all(allPromises);
    } catch (error: any) {
      logger.error('Error in API handler', { error });
      logger.attachResponseStatus(500);
      await logger.flush();
      await Promise.all(allPromises);
      throw error;
    }
  };
}

export type AxiomRequest = NextRequest & { log: Logger };
export type AxiomMiddleware = (
  request: AxiomRequest,
  event: NextFetchEvent
) => NextMiddlewareResult | Promise<NextMiddlewareResult>;

function withAxiomNextEdgeFunction(handler: NextMiddleware): NextMiddleware {
  return async (req, ev) => {
    const report: RequestReport = {
      startTime: new Date().getTime(),
      ip: req.ip,
      region: req.geo?.region,
      host: req.nextUrl.host,
      method: req.method,
      path: req.nextUrl.pathname,
      scheme: req.nextUrl.protocol.replace(':', ''),
      userAgent: req.headers.get('user-agent'),
    };

    const logger = new Logger({}, report, false, 'edge');
    const axiomRequest = req as AxiomRequest;
    axiomRequest.log = logger;

    try {
      const res = await handler(axiomRequest, ev);
      if (res) {
        logger.attachResponseStatus(res.status);
      }
      ev.waitUntil(logger.flush());
      logEdgeReport(report);
      return res;
    } catch (error: any) {
      logger.error('Error in edge function', { error });
      logger.attachResponseStatus(500);
      ev.waitUntil(logger.flush());
      logEdgeReport(report);
      throw error;
    }
  };
}

function logEdgeReport(report: any) {
  console.log(`AXIOM_EDGE_REPORT::${JSON.stringify(report)}`);
}

type WithAxiomParam = NextConfig | NextApiHandler | NextMiddleware;

function isNextConfig(param: WithAxiomParam): param is NextConfig {
  return typeof param == 'object';
}

function isApiHandler(param: WithAxiomParam): param is NextApiHandler {
  const isFunction = typeof param == 'function';

  return isFunction && typeof globalThis.EdgeRuntime === 'undefined';
}

// withAxiom can be called either with NextConfig, which will add proxy rewrites
// to improve deliverability of Web-Vitals and logs, or with NextApiRequest or
// NextMiddleware which will automatically log exceptions and flush logs.
export function withAxiom<T extends WithAxiomParam>(param: T): T {
  if (isNextConfig(param)) {
    return withAxiomNextConfig(param) as T;
  } else if (isApiHandler(param)) {
    return withAxiomNextApiHandler(param) as T;
  } else {
    return withAxiomNextEdgeFunction(param) as T;
  }
}

const getHeaderOrDefault = (req: NextApiRequest, headerName: string, defaultValue: any) =>
  req.headers[headerName] ? req.headers[headerName] : defaultValue;
