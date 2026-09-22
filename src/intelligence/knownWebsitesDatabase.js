/**
 * Database of Verified Top Global Websites & Popular Web Infrastructure Domains.
 * Used for verifying whether the target's middle domain/SLD belongs to an established legitimate global platform.
 */
const KNOWN_GLOBAL_WEBSITES = [
  // Top Search Engines & Tech Giants
  { id: 'google', name: 'Google', domains: ['google', 'gmail', 'youtube', 'googlevideo', 'blogspot', 'withgoogle', 'gstatic'] },
  { id: 'microsoft', name: 'Microsoft', domains: ['microsoft', 'office', 'outlook', 'live', 'azure', 'bing', 'msn', 'windows', 'visualstudio'] },
  { id: 'apple', name: 'Apple', domains: ['apple', 'icloud', 'itunes'] },
  { id: 'amazon', name: 'Amazon', domains: ['amazon', 'aws', 'media-amazon', 'primevideo'] },
  { id: 'meta', name: 'Meta / Facebook', domains: ['facebook', 'instagram', 'whatsapp', 'fb', 'meta'] },
  { id: 'wikipedia', name: 'Wikipedia / Wikimedia', domains: ['wikipedia', 'wikimedia', 'wiktionary'] },
  
  // Developer Platforms & Cloud Hosting
  { id: 'github', name: 'GitHub', domains: ['github', 'githubusercontent', 'githubpages'] },
  { id: 'gitlab', name: 'GitLab', domains: ['gitlab'] },
  { id: 'cloudflare', name: 'Cloudflare', domains: ['cloudflare', 'workers'] },
  { id: 'vercel', name: 'Vercel', domains: ['vercel', 'now'] },
  { id: 'netlify', name: 'Netlify', domains: ['netlify'] },
  { id: 'openai', name: 'OpenAI / ChatGPT', domains: ['openai', 'chatgpt'] },

  // Financial, Payment & E-Commerce
  { id: 'paypal', name: 'PayPal', domains: ['paypal', 'paypal-corp'] },
  { id: 'stripe', name: 'Stripe', domains: ['stripe'] },
  { id: 'binance', name: 'Binance', domains: ['binance'] },
  { id: 'coinbase', name: 'Coinbase', domains: ['coinbase'] },
  { id: 'ebay', name: 'eBay', domains: ['ebay'] },
  { id: 'shopify', name: 'Shopify', domains: ['shopify', 'myshopify'] },

  // Social & Media
  { id: 'x-twitter', name: 'X / Twitter', domains: ['twitter', 'x', 'twimg'] },
  { id: 'linkedin', name: 'LinkedIn', domains: ['linkedin'] },
  { id: 'reddit', name: 'Reddit', domains: ['reddit', 'redditmedia'] },
  { id: 'netflix', name: 'Netflix', domains: ['netflix', 'nflxso'] },
  { id: 'spotify', name: 'Spotify', domains: ['spotify', 'scdn'] },
  { id: 'pinterest', name: 'Pinterest', domains: ['pinterest'] },
  { id: 'yahoo', name: 'Yahoo', domains: ['yahoo', 'yimg'] }
];

/**
 * Checks whether a given secondLevelDomain or middleDomain exists in the verified global website database.
 * @param {string} secondLevelDomain - Core SLD (e.g. "google", "paypal", "example")
 * @param {string} middleDomain - Full middle domain string (e.g. "login.paypal.example")
 * @returns {object} Match result
 */
function checkKnownWebsiteList(secondLevelDomain, middleDomain) {
  if (!secondLevelDomain) {
    return { isKnownWebsite: false, matchedSite: null, trustLevel: 'UNVERIFIED_DOMAIN', description: 'Unverified / Dynamic Target Domain' };
  }

  const sldLower = secondLevelDomain.toLowerCase();
  const middleLower = (middleDomain || '').toLowerCase();

  // 1. Direct match on Second-Level Domain
  for (const site of KNOWN_GLOBAL_WEBSITES) {
    if (site.domains.includes(sldLower)) {
      return {
        isKnownWebsite: true,
        matchedSite: site.name,
        trustLevel: 'VERIFIED_GLOBAL_WEBSITE',
        description: `Middle domain matches verified global website database (${site.name})`
      };
    }
  }

  // 2. Check if a known site name appears in middle domain while SLD is different (Potential Spoof)
  for (const site of KNOWN_GLOBAL_WEBSITES) {
    for (const d of site.domains) {
      if (middleLower.includes(d) && d !== sldLower) {
        return {
          isKnownWebsite: false,
          matchedSite: site.name,
          trustLevel: 'SUSPICIOUS_SPOOF_MATCH',
          description: `Known website name "${site.name}" detected in middle domain prefix, but core domain is "${secondLevelDomain}"`
        };
      }
    }
  }

  return {
    isKnownWebsite: false,
    matchedSite: null,
    trustLevel: 'UNVERIFIED_DYNAMIC_DOMAIN',
    description: 'Target middle domain is an unverified / dynamic web domain'
  };
}

module.exports = {
  KNOWN_GLOBAL_WEBSITES,
  checkKnownWebsiteList
};
