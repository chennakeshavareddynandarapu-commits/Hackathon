const dns = require('dns').promises;
const net = require('net');

/**
 * Investigates DNS records for a target hostname.
 * @param {string} hostname - Target hostname to resolve
 * @returns {Promise<object>} DNS analysis telemetry
 */
async function analyzeDns(hostname) {
  const result = {
    resolvable: false,
    a: [],
    aaaa: [],
    mx: [],
    ns: [],
    txt: [],
    cname: [],
    error: null,
    isRawIp: net.isIP(hostname) !== 0
  };

  // If host is a raw IP, skip DNS resolution
  if (result.isRawIp) {
    result.resolvable = true;
    if (net.isIPv4(hostname)) result.a.push(hostname);
    if (net.isIPv6(hostname)) result.aaaa.push(hostname);
    return result;
  }

  try {
    // Primary address resolution via system lookup (A & AAAA)
    try {
      const addresses = await dns.lookup(hostname, { all: true });
      if (Array.isArray(addresses)) {
        addresses.forEach(item => {
          if (item.family === 4 && !result.a.includes(item.address)) result.a.push(item.address);
          if (item.family === 6 && !result.aaaa.includes(item.address)) result.aaaa.push(item.address);
        });
      }
    } catch (e) {
      // Direct resolve4 fallback
      try {
        const aRecords = await dns.resolve4(hostname);
        result.a = aRecords || [];
      } catch (errResolve) {}
    }

    // Attempt MX records
    try {
      const mxRecords = await dns.resolveMx(hostname);
      result.mx = (mxRecords || []).map(m => m.exchange);
    } catch (e) {
      // Ignore
    }

    // Attempt NS records
    try {
      const nsRecords = await dns.resolveNs(hostname);
      result.ns = nsRecords || [];
    } catch (e) {
      // Ignore
    }

    // Attempt TXT records
    try {
      const txtRecords = await dns.resolveTxt(hostname);
      result.txt = (txtRecords || []).map(t => t.join(''));
    } catch (e) {
      // Ignore
    }

    // Attempt CNAME records
    try {
      const cnameRecords = await dns.resolveCname(hostname);
      result.cname = cnameRecords || [];
    } catch (e) {
      // Ignore
    }

    result.resolvable = result.a.length > 0 || result.aaaa.length > 0 || result.cname.length > 0;
  } catch (err) {
    result.resolvable = false;
    result.error = err.message || 'DNS resolution failed';
  }

  return result;
}

module.exports = {
  analyzeDns
};
