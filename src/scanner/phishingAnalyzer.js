const { detectBrandImpersonation } = require('../intelligence/brandDatabase');
const { evaluateTldReputation } = require('../intelligence/tldDatabase');
const { checkKnownWebsiteList } = require('../intelligence/knownWebsitesDatabase');

/**
 * Contextual Phishing Keywords list
 */
const PHISHING_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'secure', 'account',
  'banking', 'wallet', 'payment', 'password', 'credential', 'recovery',
  'unlock', 'update', 'confirm', 'security', 'support', 'free-gift',
  'claim-reward', 'bonus', 'claim', 'winner', 'giftcard', 'admin'
];

/**
 * Comprehensive Middle Domain, Known Websites Database, Phishing, Brand Impersonation, IDN Homoglyph & Obfuscation Analyzer.
 */
function analyzePhishingAndObfuscation(urlInfo) {
  const { originalInput, normalizedUrl, hostname, middleDomain, secondLevelDomain, registeredDomain, subdomain, tld, isPunycode, length } = urlInfo;
  
  const result = {
    phishingRiskScore: 0,
    obfuscationRiskScore: 0,
    brandImpersonation: null,
    tldReputation: null,
    knownWebsiteMatch: null,
    middleDomainAnalysis: {
      middleDomain: middleDomain || hostname,
      secondLevelDomain: secondLevelDomain,
      subdomain: subdomain,
      tld: tld,
      status: 'SAFE',
      knownWebsite: null,
      issues: []
    },
    foundKeywords: [],
    anomalies: [],
    details: []
  };

  const lowerUrl = originalInput.toLowerCase();
  const lowerHost = hostname.toLowerCase();

  // 1. Known Website Database Lookup & Unverified Domain Risk Scoring
  const knownCheck = checkKnownWebsiteList(secondLevelDomain, middleDomain);
  result.knownWebsiteMatch = knownCheck;
  result.middleDomainAnalysis.knownWebsite = knownCheck;

  if (knownCheck.isKnownWebsite) {
    result.phishingRiskScore -= 10; // Verified global website trust reduction
    result.details.push(`✓ Verified Global Website Match: "${knownCheck.matchedSite}" (Core SLD: "${secondLevelDomain}") (-10 risk bonus)`);
  } else if (knownCheck.trustLevel === 'SUSPICIOUS_SPOOF_MATCH') {
    result.phishingRiskScore += 35; // Brand spoofing penalty
    result.middleDomainAnalysis.status = 'DANGEROUS';
    result.middleDomainAnalysis.issues.push(`Spoofed Brand Prefix: Brand "${knownCheck.matchedSite}" in subdomain, but core domain is "${secondLevelDomain}".`);
    result.details.push(`⚠ Known Website Name "${knownCheck.matchedSite}" detected in middle domain prefix, but core domain is "${secondLevelDomain}" (+35)`);
  } else {
    result.phishingRiskScore += 15; // Risk score penalty for unverified dynamic domain!
    result.middleDomainAnalysis.issues.push(`Unverified Domain: Middle domain "${secondLevelDomain}" is not in Verified Global Website Database`);
    result.details.push(`Unverified Target Domain: Middle domain "${secondLevelDomain}" is not listed in Verified Global Websites Database (+15)`);
  }

  // 2. Dedicated Middle Domain Inspection (Between scheme and TLD)
  if (middleDomain) {
    result.details.push(`Middle Domain Breakdown: "${middleDomain}" [Scheme: ${urlInfo.protocol} // TLD: ${tld || 'N/A'}]`);

    // A. Check if subdomains inside middle domain contain brand names while SLD is different
    const brandCheck = detectBrandImpersonation(hostname, registeredDomain, originalInput);
    if (brandCheck.impersonationDetected) {
      result.brandImpersonation = brandCheck;
      result.phishingRiskScore += brandCheck.riskWeight;
      result.middleDomainAnalysis.status = 'DANGEROUS';
      if (!result.middleDomainAnalysis.issues.some(i => i.includes('Brand'))) {
        result.middleDomainAnalysis.issues.push(`Brand "${brandCheck.matchedBrand}" found in middle domain prefix, but core domain is "${secondLevelDomain}".`);
      }
      result.details.push(`${brandCheck.reason} (+${brandCheck.riskWeight})`);
    }

    // B. Check if subdomains in middle domain contain phishing keywords
    if (subdomain) {
      const subKeywords = PHISHING_KEYWORDS.filter(kw => subdomain.toLowerCase().includes(kw));
      if (subKeywords.length > 0) {
        result.phishingRiskScore += 25;
        result.middleDomainAnalysis.issues.push(`Subdomain contains phishing keyword(s): ${subKeywords.join(', ')}`);
        result.details.push(`Phishing keyword(s) embedded in middle domain subdomain prefix (${subKeywords.join(', ')}) (+25)`);
      }

      // Check excessive subdomain depth in middle domain
      const subParts = subdomain.split('.');
      if (subParts.length >= 3) {
        result.obfuscationRiskScore += 15;
        result.middleDomainAnalysis.issues.push(`Excessive subdomain depth in middle domain (${subParts.length} levels)`);
        result.details.push(`Deeply nested middle domain subdomains (${subParts.length} levels) (+15)`);
      }
    }

    // C. Check hyphens in Second Level Domain portion of middle domain
    if (secondLevelDomain) {
      const sldHyphens = (secondLevelDomain.match(/-/g) || []).length;
      if (sldHyphens > 2) {
        result.obfuscationRiskScore += 15;
        result.middleDomainAnalysis.issues.push(`Multiple hyphens in core middle domain "${secondLevelDomain}"`);
        result.details.push(`Excessive hyphens in core middle domain SLD (${sldHyphens} hyphens) (+15)`);
      }
    }
  }

  // 3. Contextual Phishing Keywords
  PHISHING_KEYWORDS.forEach(word => {
    if (lowerUrl.includes(word) && !result.foundKeywords.includes(word)) {
      result.foundKeywords.push(word);
    }
  });

  if (result.foundKeywords.length > 0 && !result.brandImpersonation) {
    let keywordWeight = 0;
    const keywordsInDomain = result.foundKeywords.filter(kw => lowerHost.includes(kw));

    if (keywordsInDomain.length > 0) {
      keywordWeight += keywordsInDomain.length * 20;
    } else {
      keywordWeight += result.foundKeywords.length * 10;
    }

    const cappedKeywordWeight = Math.min(keywordWeight, 35);
    result.phishingRiskScore += cappedKeywordWeight;
    result.details.push(`Suspicious phishing keywords found (${result.foundKeywords.join(', ')}) (+${cappedKeywordWeight})`);
  }

  // 4. TLD Reputation Check
  const tldCheck = evaluateTldReputation(hostname);
  result.tldReputation = tldCheck;
  if (tldCheck.riskWeight !== 0) {
    result.phishingRiskScore += Math.max(0, tldCheck.riskWeight);
    result.details.push(`${tldCheck.description} (+${tldCheck.riskWeight})`);
  }

  // 5. Homoglyph / IDN Punycode Detection
  if (isPunycode) {
    result.obfuscationRiskScore += 25;
    result.anomalies.push('IDN_PUNYCODE');
    result.details.push('Internationalized Punycode middle domain detected (potential homoglyph attack) (+25)');
  }

  // Check mixed script or non-ASCII characters in raw input
  const nonAsciiRegex = /[^\x00-\x7F]/;
  if (nonAsciiRegex.test(originalInput) && !isPunycode) {
    result.obfuscationRiskScore += 20;
    result.anomalies.push('NON_ASCII_CHARS');
    result.details.push('Middle domain contains non-ASCII Unicode characters (+20)');
  }

  // 6. URL Obfuscation & Character Anomalies
  if (originalInput.includes('@')) {
    result.obfuscationRiskScore += 25;
    result.anomalies.push('USER_OBSCURING_AT');
    result.details.push('Contains user obscuring "@" character in URL (+25)');
  }

  // Double slash anomaly in URL path
  const pathPart = originalInput.replace(/^https?:\/\//i, '');
  if (pathPart.includes('//')) {
    result.obfuscationRiskScore += 15;
    result.anomalies.push('CONSECUTIVE_SLASHES');
    result.details.push('Contains consecutive slashes "//" in path (+15)');
  }

  // Hexadecimal or Decimal encoded IP representation
  if (/^0x[0-9a-f]+$/i.test(lowerHost) || /^\d{8,11}$/.test(lowerHost)) {
    result.obfuscationRiskScore += 35;
    result.anomalies.push('ENCODED_IP_OBFUSCATION');
    result.details.push('Middle domain uses Hexadecimal or Decimal IP obfuscation (+35)');
  }

  // URL Length Anomaly
  if (length > 120) {
    result.obfuscationRiskScore += 25;
    result.anomalies.push('EXTREME_LENGTH');
    result.details.push(`Extremely long URL (${length} characters) (+25)`);
  } else if (length > 75) {
    result.obfuscationRiskScore += 10;
    result.anomalies.push('SUSPICIOUS_LENGTH');
    result.details.push(`Suspiciously long URL (${length} characters) (+10)`);
  }

  if (result.middleDomainAnalysis.issues.length > 0 && result.middleDomainAnalysis.status === 'SAFE') {
    result.middleDomainAnalysis.status = 'SUSPICIOUS';
  }

  return result;
}

module.exports = {
  analyzePhishingAndObfuscation
};
