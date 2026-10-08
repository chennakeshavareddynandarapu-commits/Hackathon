const dns = require('dns').promises;
const net = require('net');
const http = require('http');
const https = require('https');
const { checkIpRestricted } = require('../security/ssrfProtection');

// In-memory cache for IP Geolocation & Telemetry to ensure fast repeated queries
const ipGeoCache = new Map();

/**
 * Built-in Heuristic Database for popular IP ranges & Cloud/CDN providers.
 * Guarantees immediate response and offline resiliency.
 */
const KNOWN_IP_RANGES = [
  // Cloudflare
  { match: ip => ip.startsWith('104.16.') || ip.startsWith('104.17.') || ip.startsWith('104.18.') || ip.startsWith('104.19.') || ip.startsWith('104.20.') || ip.startsWith('104.21.') || ip.startsWith('172.64.') || ip.startsWith('172.65.') || ip.startsWith('172.66.') || ip.startsWith('172.67.') || ip.startsWith('1.1.1.') || ip.startsWith('1.0.0.'),
    provider: 'Cloudflare', org: 'Cloudflare, Inc.', asn: 'AS13335 Cloudflare', isCdn: true, isCloud: true, networkType: 'CDN / Global Anycast Edge', country: 'United States', countryCode: 'US', city: 'San Francisco' },
  // Google
  { match: ip => ip.startsWith('142.250.') || ip.startsWith('172.217.') || ip.startsWith('142.251.') || ip.startsWith('216.58.') || ip.startsWith('8.8.8.') || ip.startsWith('8.8.4.') || ip.startsWith('74.125.'),
    provider: 'Google LLC', org: 'Google Cloud / Global Cache', asn: 'AS15169 Google LLC', isCdn: true, isCloud: true, networkType: 'Hyperscale Cloud & CDN Edge', country: 'United States', countryCode: 'US', city: 'Mountain View' },
  // AWS (Amazon)
  { match: ip => ip.startsWith('52.') || ip.startsWith('54.') || ip.startsWith('3.') || ip.startsWith('18.') || ip.startsWith('13.') || ip.startsWith('34.') || ip.startsWith('35.') || ip.startsWith('99.84.') || ip.startsWith('99.86.') || ip.startsWith('15.197.') || ip.startsWith('65.8.') || ip.startsWith('65.9.'),
    provider: 'Amazon AWS', org: 'Amazon Web Services / CloudFront', asn: 'AS16509 Amazon.com, Inc.', isCdn: true, isCloud: true, networkType: 'AWS Cloud & Edge Infrastructure', country: 'United States', countryCode: 'US', city: 'Seattle' },
  // Microsoft / Azure
  { match: ip => ip.startsWith('20.') || ip.startsWith('40.') || ip.startsWith('13.') || ip.startsWith('51.') || ip.startsWith('104.40.') || ip.startsWith('104.41.') || ip.startsWith('137.116.') || ip.startsWith('137.117.'),
    provider: 'Microsoft Azure', org: 'Microsoft Corporation', asn: 'AS8075 Microsoft Corporation', isCdn: true, isCloud: true, networkType: 'Azure Cloud Infrastructure', country: 'United States', countryCode: 'US', city: 'Redmond' },
  // Fastly
  { match: ip => ip.startsWith('151.101.') || ip.startsWith('199.232.') || ip.startsWith('146.75.'),
    provider: 'Fastly', org: 'Fastly Edge Cloud', asn: 'AS54113 Fastly, Inc.', isCdn: true, isCloud: true, networkType: 'Edge CDN Network', country: 'United States', countryCode: 'US', city: 'San Francisco' },
  // Akamai
  { match: ip => ip.startsWith('23.') || ip.startsWith('104.64.') || ip.startsWith('104.65.') || ip.startsWith('104.66.') || ip.startsWith('184.24.') || ip.startsWith('184.25.'),
    provider: 'Akamai Technologies', org: 'Akamai Intelligent Edge', asn: 'AS20940 Akamai Technologies', isCdn: true, isCloud: true, networkType: 'Edge Delivery & CDN', country: 'United States', countryCode: 'US', city: 'Cambridge' },
  // DigitalOcean
  { match: ip => ip.startsWith('159.65.') || ip.startsWith('167.99.') || ip.startsWith('178.62.') || ip.startsWith('188.166.') || ip.startsWith('206.189.') || ip.startsWith('138.68.') || ip.startsWith('165.22.'),
    provider: 'DigitalOcean', org: 'DigitalOcean Cloud Droplets', asn: 'AS14061 DigitalOcean, LLC', isCdn: false, isCloud: true, networkType: 'Cloud VPS Infrastructure', country: 'United States', countryCode: 'US', city: 'New York' },
  // Vercel
  { match: ip => ip.startsWith('76.76.21.') || ip.startsWith('76.76.19.'),
    provider: 'Vercel', org: 'Vercel Edge Network', asn: 'AS396982 Vercel, Inc.', isCdn: true, isCloud: true, networkType: 'Serverless Edge Platform', country: 'United States', countryCode: 'US', city: 'San Francisco' },
  // GitHub Pages
  { match: ip => ip.startsWith('185.199.108.') || ip.startsWith('185.199.109.') || ip.startsWith('185.199.110.') || ip.startsWith('185.199.111.'),
    provider: 'GitHub / Fastly', org: 'GitHub Pages CDN', asn: 'AS36459 GitHub, Inc.', isCdn: true, isCloud: true, networkType: 'Static CDN Hosting', country: 'United States', countryCode: 'US', city: 'San Francisco' }
];

/**
 * Country code to emoji flag helper.
 */
function getCountryFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Fetch IP Geolocation from public API with timeout and fallback.
 */
function fetchIpGeoHttp(ip) {
  return new Promise((resolve) => {
    // Check in-memory cache first
    if (ipGeoCache.has(ip)) {
      return resolve(ipGeoCache.get(ip));
    }

    const timer = setTimeout(() => {
      resolve(null);
    }, 2000);

    const req = http.get(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        clearTimeout(timer);
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed.status === 'success') {
            ipGeoCache.set(ip, parsed);
            resolve(parsed);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => {
      clearTimeout(timer);
      resolve(null);
    });

    req.setTimeout(2000, () => {
      req.destroy();
      clearTimeout(timer);
      resolve(null);
    });
  });
}

/**
 * Measure TCP round-trip latency to the resolved IP (port 443 or 80).
 */
function probeIpLatency(ip) {
  return new Promise((resolve) => {
    const isLocal = checkIpRestricted(ip).isPrivate;
    if (isLocal) {
      return resolve({ responsive: true, latencyMs: 1 });
    }

    const start = Date.now();
    const socket = net.createConnection({ host: ip, port: 443, timeout: 1200 }, () => {
      const latencyMs = Date.now() - start;
      socket.destroy();
      resolve({ responsive: true, latencyMs });
    });

    socket.on('error', () => {
      // Try fallback to port 80
      const socket80 = net.createConnection({ host: ip, port: 80, timeout: 1000 }, () => {
        const latencyMs = Date.now() - start;
        socket80.destroy();
        resolve({ responsive: true, latencyMs });
      });
      socket80.on('error', () => resolve({ responsive: false, latencyMs: null }));
      socket80.on('timeout', () => {
        socket80.destroy();
        resolve({ responsive: false, latencyMs: null });
      });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ responsive: false, latencyMs: null });
    });
  });
}

/**
 * Tracks and analyzes an IP address using DNS resolution from a target hostname or web URL.
 * @param {string} hostname - Target hostname
 * @param {object} [existingDnsInfo] - Optional pre-resolved DNS info to optimize execution
 */
async function trackIpFromDns(hostname, existingDnsInfo = null) {
  const startTime = Date.now();
  let cleanHost = hostname;

  // Strip protocol and path if passed a full URL
  if (cleanHost.includes('://')) {
    try {
      const u = new URL(cleanHost);
      cleanHost = u.hostname;
    } catch (e) {
      cleanHost = cleanHost.replace(/^[a-zA-Z]+:\/\//, '').split('/')[0].split(':')[0];
    }
  } else if (cleanHost.includes('/')) {
    cleanHost = cleanHost.split('/')[0].split(':')[0];
  } else if (cleanHost.includes(':') && !net.isIPv6(cleanHost)) {
    cleanHost = cleanHost.split(':')[0];
  }

  const isDirectIp = net.isIP(cleanHost) !== 0;
  let resolvedIps = [];
  let aRecords = [];
  let aaaaRecords = [];
  let cnameRecords = [];
  let dnsResolutionError = null;

  if (isDirectIp) {
    resolvedIps = [cleanHost];
    if (net.isIPv4(cleanHost)) aRecords.push(cleanHost);
    if (net.isIPv6(cleanHost)) aaaaRecords.push(cleanHost);
  } else if (existingDnsInfo && (existingDnsInfo.a?.length || existingDnsInfo.aaaa?.length)) {
    aRecords = [...(existingDnsInfo.a || [])];
    aaaaRecords = [...(existingDnsInfo.aaaa || [])];
    cnameRecords = [...(existingDnsInfo.cname || [])];
    resolvedIps = [...aRecords, ...aaaaRecords];
  } else {
    // Perform active DNS lookup
    try {
      const addresses = await dns.lookup(cleanHost, { all: true });
      if (Array.isArray(addresses)) {
        addresses.forEach(item => {
          if (item.family === 4 && !aRecords.includes(item.address)) aRecords.push(item.address);
          if (item.family === 6 && !aaaaRecords.includes(item.address)) aaaaRecords.push(item.address);
        });
      }
      resolvedIps = [...aRecords, ...aaaaRecords];
    } catch (err) {
      dnsResolutionError = err.message;
      // Fallback to resolve4 / resolve6
      try {
        const r4 = await dns.resolve4(cleanHost);
        aRecords = r4 || [];
        resolvedIps.push(...aRecords);
      } catch (e) {}
    }

    try {
      const cnames = await dns.resolveCname(cleanHost);
      cnameRecords = cnames || [];
    } catch (e) {}
  }

  const dnsLookupDurationMs = Date.now() - startTime;
  const primaryIp = resolvedIps.length > 0 ? resolvedIps[0] : null;

  if (!primaryIp) {
    return {
      success: false,
      targetHost: cleanHost,
      isDirectIp,
      dnsLookupTimeMs: dnsLookupDurationMs,
      error: dnsResolutionError || 'No A or AAAA records resolved by DNS',
      resolvedIps: [],
      allTrackedIps: [],
      primaryIp: null,
      reverseDns: 'None',
      geo: {
        country: 'Unknown',
        countryCode: 'XX',
        flag: '❓',
        city: 'Unresolved',
        region: 'Unresolved',
        lat: 0,
        lon: 0,
        timezone: 'UTC',
        isp: 'DNS Unresolved',
        org: 'Unassigned',
        asn: 'N/A'
      },
      infrastructure: {
        provider: 'Unresolved Target',
        networkType: 'Unresolved DNS Domain',
        isCdn: false,
        isCloud: false
      },
      latencyMs: null,
      status: 'DNS_FAILED'
    };
  }

  const ipVersion = net.isIPv6(primaryIp) ? 'IPv6' : 'IPv4';
  const restriction = checkIpRestricted(primaryIp);

  // 1. Reverse DNS Lookup (PTR)
  let reverseDnsName = 'No PTR Record';
  try {
    const ptrHosts = await dns.reverse(primaryIp);
    if (Array.isArray(ptrHosts) && ptrHosts.length > 0) {
      reverseDnsName = ptrHosts[0];
    }
  } catch (e) {
    // Reverse DNS ENOTFOUND or not configured
    reverseDnsName = isDirectIp ? 'Direct IP Target' : `${cleanHost} (A/AAAA Pointer)`;
  }

  // 2. IP Geolocation & ASN Intelligence
  let geoData = null;
  let heuristicMatch = KNOWN_IP_RANGES.find(item => item.match(primaryIp));

  if (!restriction.isPrivate) {
    geoData = await fetchIpGeoHttp(primaryIp);
  }

  // Build Normalized Geo Telemetry
  const geoResult = {
    country: geoData?.country || heuristicMatch?.country || (restriction.isPrivate ? 'Internal Network' : 'Global Anycast'),
    countryCode: geoData?.countryCode || heuristicMatch?.countryCode || (restriction.isPrivate ? 'LOC' : 'XX'),
    flag: getCountryFlag(geoData?.countryCode || heuristicMatch?.countryCode || (restriction.isPrivate ? '' : '')),
    region: geoData?.regionName || (restriction.isPrivate ? 'Local Subnet' : 'Distributed Edge'),
    city: geoData?.city || heuristicMatch?.city || (restriction.isPrivate ? 'Localhost / Intranet' : 'Global Edge'),
    zip: geoData?.zip || 'N/A',
    lat: geoData?.lat !== undefined ? geoData.lat : (heuristicMatch ? 37.7749 : 0),
    lon: geoData?.lon !== undefined ? geoData.lon : (heuristicMatch ? -122.4194 : 0),
    timezone: geoData?.timezone || 'UTC',
    isp: geoData?.isp || heuristicMatch?.provider || (restriction.isPrivate ? restriction.description : 'Global Network'),
    org: geoData?.org || heuristicMatch?.org || (restriction.isPrivate ? 'Local Network Gateway' : 'Cloud / Web Host'),
    asn: geoData?.as || heuristicMatch?.asn || (restriction.isPrivate ? 'RFC 1918 Private' : 'AS-UNKNOWN')
  };

  // 3. Infrastructure & Network Classification
  const infraResult = {
    provider: heuristicMatch?.provider || (geoData?.org ? geoData.org.split(' ')[0] : (restriction.isPrivate ? 'Private Infrastructure' : 'Web Hosting Provider')),
    networkType: heuristicMatch?.networkType || (restriction.isPrivate ? 'Private / Internal Host' : 'Public Web Server'),
    isCdn: heuristicMatch ? heuristicMatch.isCdn : (geoResult.isp.toLowerCase().includes('cloudflare') || geoResult.isp.toLowerCase().includes('akamai') || geoResult.isp.toLowerCase().includes('fastly') || geoResult.isp.toLowerCase().includes('cdn')),
    isCloud: heuristicMatch ? heuristicMatch.isCloud : (geoResult.org.toLowerCase().includes('amazon') || geoResult.org.toLowerCase().includes('google') || geoResult.org.toLowerCase().includes('microsoft') || geoResult.org.toLowerCase().includes('cloud')),
    isPrivate: restriction.isPrivate,
    restrictionType: restriction.type
  };

  // 4. Ping / Latency Probe
  const probe = await probeIpLatency(primaryIp);

  // 5. Structure All Resolved IP Trackers
  const allTrackedIps = resolvedIps.map(ip => {
    const isV6 = net.isIPv6(ip);
    const matched = KNOWN_IP_RANGES.find(m => m.match(ip));
    return {
      ip,
      version: isV6 ? 'IPv6' : 'IPv4',
      isPrivate: checkIpRestricted(ip).isPrivate,
      provider: matched?.provider || (ip === primaryIp ? infraResult.provider : 'Associated Host IP')
    };
  });

  return {
    success: true,
    targetHost: cleanHost,
    isDirectIp,
    primaryIp,
    ipVersion,
    isPrivate: restriction.isPrivate,
    dnsLookupTimeMs: dnsLookupDurationMs,
    totalIpsCount: resolvedIps.length,
    resolvedIps,
    allTrackedIps,
    cnameRecords,
    reverseDns: reverseDnsName,
    geo: geoResult,
    infrastructure: infraResult,
    latencyMs: probe.latencyMs,
    status: restriction.isPrivate ? 'LOCAL' : (probe.responsive ? 'ONLINE' : 'UNRESPONSIVE')
  };
}

module.exports = {
  trackIpFromDns,
  probeIpLatency,
  fetchIpGeoHttp
};
