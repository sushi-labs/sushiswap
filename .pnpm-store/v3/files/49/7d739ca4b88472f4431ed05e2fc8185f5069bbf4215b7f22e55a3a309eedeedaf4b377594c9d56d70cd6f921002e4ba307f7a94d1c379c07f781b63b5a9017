export const proxyPath = '/_axiom';

export const isBrowser = typeof window !== 'undefined';
export const isEnvVarsSet = process.env.AXIOM_INGEST_ENDPOINT || process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT;
export const isNoPrettyPrint = process.env.AXIOM_NO_PRETTY_PRINT == 'true' ? true : false;
export const vercelRegion = process.env.VERCEL_REGION || process.env.NEXT_PUBLIC_VERCEL_REGION;
export const vercelEnv = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV;

export enum EndpointType {
  webVitals = 'web-vitals',
  logs = 'logs',
}

export const getIngestURL = (t: EndpointType) => {
  const ingestEndpoint = process.env.AXIOM_INGEST_ENDPOINT || process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT;
  if (!ingestEndpoint) {
    return '';
  }

  const url = new URL(ingestEndpoint);
  // attach type query param based on passed EndpointType
  url.searchParams.set('type', t.toString());
  return url.toString();
};

export const throttle = (fn: Function, wait: number) => {
  let lastFn: ReturnType<typeof setTimeout>, lastTime: number;
  return function (this: any) {
    const context = this,
      args = arguments;

    // First call, set lastTime
    if (lastTime == null) {
      lastTime = Date.now();
    }

    clearTimeout(lastFn);
    lastFn = setTimeout(() => {
      if (Date.now() - lastTime >= wait) {
        fn.apply(context, args);
        lastTime = Date.now();
      }
    }, Math.max(wait - (Date.now() - lastTime), 0));
  };
};
