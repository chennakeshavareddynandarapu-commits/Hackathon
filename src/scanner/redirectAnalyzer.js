const http = require('http');
const https = require('https');
const { URL } = require('url');

/**
 * Safe redirect chain analyzer. Max 5 hops, stops on loop or invalid target.
 * @param {string} initialUrl - Starting URL
 * @param {number} maxHops - Maximum redirect hops (default 5)
 * @returns {Promise<object>} Redirect telemetry
 */
async function analyzeRedirects(initialUrl, maxHops = 5) {
  const chain = [];
  let currentUrl = initialUrl;
  let hopsCount = 0;
  let isDowngrade = false;
  let finalDestination = initialUrl;
  let isReachable = false;
  let statusCode = null;

  const visited = new Set();

  while (hopsCount < maxHops) {
    if (visited.has(currentUrl)) {
      chain.push({ url: currentUrl, status: 'LOOP_DETECTED', error: 'Circular redirect loop detected' });
      break;
    }
    visited.add(currentUrl);

    let parsed;
    try {
      parsed = new URL(currentUrl);
    } catch (e) {
      chain.push({ url: currentUrl, status: 'INVALID_URL', error: 'Failed to parse redirect URL' });
      break;
    }

    const client = parsed.protocol === 'https:' ? https : http;

    const hopResult = await new Promise((resolve) => {
      let settled = false;

      const req = client.request(
        parsed,
        { method: 'HEAD', timeout: 3500, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SAVEE-SecurityScanner/2.0' } },
        (res) => {
          if (settled) return;
          settled = true;

          const code = res.statusCode;
          const location = res.headers.location;

          if (code >= 300 && code < 400 && location) {
            let nextUrl;
            try {
              nextUrl = new URL(location, currentUrl).href;
            } catch (e) {
              nextUrl = location;
            }

            // Detect HTTPS -> HTTP downgrade
            if (currentUrl.startsWith('https://') && nextUrl.startsWith('http://')) {
              isDowngrade = true;
            }

            resolve({
              url: currentUrl,
              statusCode: code,
              redirectsTo: nextUrl,
              isRedirect: true
            });
          } else {
            isReachable = code >= 200 && code < 500;
            statusCode = code;
            finalDestination = currentUrl;
            resolve({
              url: currentUrl,
              statusCode: code,
              isRedirect: false
            });
          }
        }
      );

      req.on('error', (err) => {
        if (!settled) {
          settled = true;
          resolve({
            url: currentUrl,
            error: err.message || 'Request connection failed',
            isRedirect: false
          });
        }
      });

      req.on('timeout', () => {
        if (!settled) {
          settled = true;
          req.destroy();
          resolve({
            url: currentUrl,
            error: 'HTTP request timeout',
            isRedirect: false
          });
        }
      });

      req.end();
    });

    chain.push(hopResult);

    if (hopResult.isRedirect && hopResult.redirectsTo) {
      currentUrl = hopResult.redirectsTo;
      hopsCount++;
    } else {
      break;
    }
  }

  return {
    initialUrl,
    finalDestination,
    redirectCount: Math.max(0, chain.length - 1),
    chain,
    isDowngrade,
    isReachable,
    finalStatusCode: statusCode
  };
}

module.exports = {
  analyzeRedirects
};
