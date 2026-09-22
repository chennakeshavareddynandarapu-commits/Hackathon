const tls = require('tls');
const net = require('net');

/**
 * Inspects TLS/HTTPS certificate and security setup for a target host.
 * @param {string} hostname - Target domain or IP
 * @param {number} port - Port (default 443)
 * @returns {Promise<object>} TLS security telemetry
 */
async function analyzeTls(hostname, port = 443) {
  const result = {
    httpsAvailable: false,
    valid: false,
    authorized: false,
    issuer: null,
    subject: null,
    validFrom: null,
    validTo: null,
    daysRemaining: null,
    subjectAltNames: [],
    protocol: null,
    error: null
  };

  // If host is a raw IP, skip standard TLS cert validation or flag appropriately
  if (net.isIP(hostname)) {
    result.error = 'TLS analysis skipped for raw IP target';
    return result;
  }

  return new Promise((resolve) => {
    let socket;
    let settled = false;

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        if (socket) socket.destroy();
        result.error = 'TLS connection timed out';
        resolve(result);
      }
    }, 4000); // 4 sec timeout

    try {
      socket = tls.connect(
        {
          host: hostname,
          port: port || 443,
          servername: hostname,
          rejectUnauthorized: false // Allow inspecting untrusted/self-signed certs safely
        },
        () => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);

          result.httpsAvailable = true;
          result.authorized = socket.authorized;
          if (socket.authorizationError) {
            result.error = socket.authorizationError;
          }

          const cert = socket.getPeerCertificate(true);
          if (cert && Object.keys(cert).length > 0) {
            result.valid = true;
            result.issuer = cert.issuer ? (cert.issuer.O || cert.issuer.CN) : 'Unknown';
            result.subject = cert.subject ? (cert.subject.CN || cert.subject.O) : 'Unknown';
            result.validFrom = cert.valid_from;
            result.validTo = cert.valid_to;

            if (cert.valid_to) {
              const expiryDate = new Date(cert.valid_to);
              const now = new Date();
              const diffTime = expiryDate - now;
              result.daysRemaining = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            }

            if (cert.subjectaltname) {
              result.subjectAltNames = cert.subjectaltname
                .split(',')
                .map(s => s.trim().replace(/^DNS:/, ''));
            }

            result.protocol = socket.getProtocol();
          }

          socket.end();
          resolve(result);
        }
      );

      socket.on('error', (err) => {
        if (!settled) {
          settled = true;
          clearTimeout(timeout);
          result.httpsAvailable = false;
          result.error = err.message || 'TLS handshake failed';
          resolve(result);
        }
      });
    } catch (err) {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        result.error = err.message;
        resolve(result);
      }
    }
  });
}

module.exports = {
  analyzeTls
};
