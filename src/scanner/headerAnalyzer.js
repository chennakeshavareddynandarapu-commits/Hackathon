const http = require('http');
const https = require('https');
const { URL } = require('url');

/**
 * Inspects HTTP security headers and cookies exposed by target server.
 * @param {string} targetUrl - Public target URL
 * @returns {Promise<object>} HTTP Security & Cookie telemetry
 */
async function analyzeHeaders(targetUrl) {
  const result = {
    statusCode: null,
    serverHeader: null,
    securityHeaders: {
      hsts: { present: false, value: null },
      csp: { present: false, value: null },
      xFrameOptions: { present: false, value: null },
      xContentTypeOptions: { present: false, value: null },
      referrerPolicy: { present: false, value: null },
      permissionsPolicy: { present: false, value: null }
    },
    cookieSecurity: {
      cookiesFound: 0,
      missingHttpOnly: 0,
      missingSecure: 0,
      missingSameSite: 0
    },
    error: null
  };

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch (e) {
    result.error = 'Invalid URL for header inspection';
    return result;
  }

  const client = parsed.protocol === 'https:' ? https : http;

  return new Promise((resolve) => {
    let settled = false;

    const req = client.request(
      parsed,
      { method: 'GET', timeout: 3500, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SAVEE-SecurityScanner/2.0' } },
      (res) => {
        if (settled) return;
        settled = true;

        result.statusCode = res.statusCode;
        result.serverHeader = res.headers['server'] || res.headers['x-powered-by'] || 'Undisclosed';

        const headers = res.headers;

        // Security headers
        if (headers['strict-transport-security']) {
          result.securityHeaders.hsts = { present: true, value: headers['strict-transport-security'] };
        }
        if (headers['content-security-policy']) {
          result.securityHeaders.csp = { present: true, value: headers['content-security-policy'] };
        }
        if (headers['x-frame-options']) {
          result.securityHeaders.xFrameOptions = { present: true, value: headers['x-frame-options'] };
        }
        if (headers['x-content-type-options']) {
          result.securityHeaders.xContentTypeOptions = { present: true, value: headers['x-content-type-options'] };
        }
        if (headers['referrer-policy']) {
          result.securityHeaders.referrerPolicy = { present: true, value: headers['referrer-policy'] };
        }
        if (headers['permissions-policy']) {
          result.securityHeaders.permissionsPolicy = { present: true, value: headers['permissions-policy'] };
        }

        // Cookie Security Analysis
        const setCookie = headers['set-cookie'];
        if (setCookie && Array.isArray(setCookie)) {
          result.cookieSecurity.cookiesFound = setCookie.length;
          setCookie.forEach((cookieStr) => {
            const lower = cookieStr.toLowerCase();
            if (!lower.includes('httponly')) result.cookieSecurity.missingHttpOnly++;
            if (!lower.includes('secure')) result.cookieSecurity.missingSecure++;
            if (!lower.includes('samesite')) result.cookieSecurity.missingSameSite++;
          });
        }

        req.destroy(); // End passive fetch quickly
        resolve(result);
      }
    );

    req.on('error', (err) => {
      if (!settled) {
        settled = true;
        result.error = err.message || 'Failed to fetch HTTP headers';
        resolve(result);
      }
    });

    req.on('timeout', () => {
      if (!settled) {
        settled = true;
        req.destroy();
        result.error = 'Header request timeout';
        resolve(result);
      }
    });

    req.end();
  });
}

module.exports = {
  analyzeHeaders
};
