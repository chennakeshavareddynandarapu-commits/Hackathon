/**
 * Database of known global brands and their official legitimate registered domains.
 * Used for detecting brand impersonation and typo-squatting phishing attacks.
 */
const BRAND_DATABASE = [
  { name: 'PayPal', keywords: ['paypal', 'pay-pal'], officialDomains: ['paypal.com', 'paypal.me'] },
  { name: 'Google', keywords: ['google', 'gmail'], officialDomains: ['google.com', 'gmail.com', 'youtube.com', 'goo.gl'] },
  { name: 'Microsoft', keywords: ['microsoft', 'office365', 'outlook', 'hotmail', 'live.com', 'onedrive', 'azure'], officialDomains: ['microsoft.com', 'office.com', 'outlook.com', 'live.com', 'azure.com'] },
  { name: 'Apple', keywords: ['apple', 'icloud', 'itunes'], officialDomains: ['apple.com', 'icloud.com', 'me.com'] },
  { name: 'Amazon', keywords: ['amazon', 'aws'], officialDomains: ['amazon.com', 'aws.amazon.com', 'primevideo.com'] },
  { name: 'Meta / Facebook', keywords: ['facebook', 'instagram', 'whatsapp', 'meta'], officialDomains: ['facebook.com', 'instagram.com', 'whatsapp.com', 'meta.com'] },
  { name: 'Netflix', keywords: ['netflix'], officialDomains: ['netflix.com'] },
  { name: 'LinkedIn', keywords: ['linkedin'], officialDomains: ['linkedin.com'] },
  { name: 'GitHub', keywords: ['github'], officialDomains: ['github.com'] },
  { name: 'Twitter / X', keywords: ['twitter'], officialDomains: ['twitter.com', 'x.com'] },
  { name: 'Binance', keywords: ['binance'], officialDomains: ['binance.com'] },
  { name: 'Coinbase', keywords: ['coinbase'], officialDomains: ['coinbase.com'] },
  { name: 'Bank of America', keywords: ['bankofamerica', 'bofa'], officialDomains: ['bankofamerica.com'] },
  { name: 'Chase Bank', keywords: ['chase', 'chasebank'], officialDomains: ['chase.com'] },
  { name: 'Wells Fargo', keywords: ['wellsfargo'], officialDomains: ['wellsfargo.com'] }
];

/**
 * Checks for brand impersonation in a given target.
 * @param {string} hostname - Target hostname
 * @param {string} registeredDomain - Extracted registered domain
 * @param {string} fullUrl - Full input URL
 */
function detectBrandImpersonation(hostname, registeredDomain, fullUrl) {
  const result = {
    impersonationDetected: false,
    matchedBrand: null,
    reason: null,
    riskWeight: 0
  };

  const lowerHost = hostname.toLowerCase();
  const lowerUrl = fullUrl.toLowerCase();

  for (const brand of BRAND_DATABASE) {
    for (const kw of brand.keywords) {
      if (lowerHost.includes(kw) || lowerUrl.includes(kw)) {
        // Is the registered domain one of the official domains?
        const isOfficial = brand.officialDomains.some(official => registeredDomain === official || hostname.endsWith('.' + official));

        if (!isOfficial) {
          result.impersonationDetected = true;
          result.matchedBrand = brand.name;
          result.reason = `Possible ${brand.name} brand impersonation. Brand keyword "${kw}" detected on untrusted domain "${registeredDomain}".`;
          result.riskWeight = 40;
          return result;
        }
      }
    }
  }

  return result;
}

module.exports = {
  BRAND_DATABASE,
  detectBrandImpersonation
};
