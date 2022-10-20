import { NextWebVitalsMetric } from 'next/app';
import { isBrowser, proxyPath, isEnvVarsSet, throttle, vercelEnv } from './shared';

const url = `${proxyPath}/web-vitals`;

export declare type WebVitalsMetric = NextWebVitalsMetric & { route: string };

const throttledSendMetrics = throttle(sendMetrics, 1000);
let collectedMetrics: WebVitalsMetric[] = [];

export function reportWebVitals(metric: NextWebVitalsMetric) {
  collectedMetrics.push({ route: window.__NEXT_DATA__?.page, ...metric });
  // if Axiom env vars are not set, do nothing,
  // otherwise devs will get errors on dev environments
  if (!isEnvVarsSet) {
    return;
  }
  throttledSendMetrics();
}

function sendMetrics() {
  const body = JSON.stringify({
    webVitals: collectedMetrics,
    environment: vercelEnv,
  });

  function sendFallback() {
    // Do not leak network errors; does not affect the running app
    fetch(url, { body, method: 'POST', keepalive: true }).catch(console.error);
  }

  if (isBrowser && navigator.sendBeacon) {
    try {
      // See https://github.com/vercel/next.js/pull/26601
      // Navigator has to be bound to ensure it does not error in some browsers
      // https://xgwang.me/posts/you-may-not-know-beacon/#it-may-throw-error%2C-be-sure-to-catch
      navigator.sendBeacon.bind(navigator)(url, body);
    } catch (err) {
      sendFallback();
    }
  } else {
    sendFallback();
  }

  collectedMetrics = [];
}
