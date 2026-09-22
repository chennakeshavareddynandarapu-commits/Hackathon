const { URL } = require('url');

/**
 * Normalizes input text and parses it into URL components.
 * Explicitly extracts the Middle Domain between protocol (https://) and Top Level Domain (TLD).
 */
function normalizeAndParseUrl(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    throw new Error('Input URL string is required.');
  }

  let trimmed = rawInput.trim();
  if (!trimmed) {
    throw new Error('URL string cannot be empty.');
  }

  // Prepend protocol if missing so URL parser works cleanly
  let hasProtocol = /^https?:\/\//i.test(trimmed);
  let urlToParse = hasProtocol ? trimmed : 'http://' + trimmed;

  let parsed;
  try {
    parsed = new URL(urlToParse);
  } catch (err) {
    throw new Error('Invalid URL format. Unable to parse hostname or protocol.');
  }

  const protocol = parsed.protocol ? parsed.protocol.toLowerCase() : 'http:';
  const hostname = parsed.hostname.toLowerCase();
  const port = parsed.port ? parseInt(parsed.port, 10) : (protocol === 'https:' ? 443 : 80);
  const path = parsed.pathname || '/';
  const query = parsed.search || '';
  const hash = parsed.hash || '';
  const username = parsed.username || '';
  const password = parsed.password || '';

  // Extract registered domain, subdomain, second level domain, and top level domain (TLD)
  const domainParts = hostname.split('.');
  let registeredDomain = hostname;
  let subdomain = '';
  let secondLevelDomain = hostname;
  let tld = '';

  const isIp = /^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname.includes(':');

  if (!isIp && domainParts.length >= 2) {
    const secondLevelTlds = ['co.uk', 'com.au', 'gov.in', 'org.uk', 'co.in', 'ac.uk', 'com.br', 'co.jp', 'gov.uk'];
    const lastTwo = domainParts.slice(-2).join('.');

    if (secondLevelTlds.includes(lastTwo) && domainParts.length >= 3) {
      tld = '.' + lastTwo;
      registeredDomain = domainParts.slice(-3).join('.');
      secondLevelDomain = domainParts[domainParts.length - 3];
      subdomain = domainParts.slice(0, -3).join('.');
    } else {
      tld = '.' + domainParts[domainParts.length - 1];
      registeredDomain = domainParts.slice(-2).join('.');
      secondLevelDomain = domainParts[domainParts.length - 2];
      subdomain = domainParts.slice(0, -2).join('.');
    }
  } else if (isIp) {
    tld = 'IP_ADDRESS';
    secondLevelDomain = hostname;
    registeredDomain = hostname;
  }

  // Middle Domain: Everything between scheme (https://) and TLD
  // e.g. for https://login.paypal.example.com -> middleDomain is "login.paypal.example"
  let middleDomain = hostname;
  if (tld && tld !== 'IP_ADDRESS' && hostname.endsWith(tld)) {
    middleDomain = hostname.substring(0, hostname.length - tld.length);
  }

  // Check Punycode IDN
  const isPunycode = hostname.startsWith('xn--') || hostname.includes('.xn--');

  return {
    originalInput: rawInput,
    normalizedUrl: parsed.href,
    protocol,
    hostname,
    middleDomain,        // Everything between https:// and TLD (e.g. "subdomain.secondLevelDomain")
    secondLevelDomain,   // Core brand/site SLD (e.g. "paypal" in paypal.com)
    registeredDomain,    // SLD + TLD (e.g. "paypal.com")
    subdomain,           // Prefix before SLD (e.g. "login.verify")
    tld,                 // Top-level domain extension (e.g. ".com", ".xyz")
    port,
    path,
    query,
    hash,
    username,
    password,
    isPunycode,
    length: rawInput.length
  };
}

module.exports = {
  normalizeAndParseUrl
};
