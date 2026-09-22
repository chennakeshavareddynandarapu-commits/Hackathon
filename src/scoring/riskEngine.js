/**
 * SAVEE Correlation & Risk Scoring Engine.
 * Combines signals from 13 security dimensions to generate:
 * - Risk Score (0-100)
 * - Security Verdict (Safe, Suspicious, Dangerous, UNKNOWN)
 * - Analysis Confidence Score (0-100%)
 * - Reachability Status (ONLINE, OFFLINE, DNS ERROR, LOCAL / PRIVATE TARGET)
 */

function evaluateRiskAndConfidence(analysisData) {
  const {
    urlInfo,
    ssrfCheck,
    dnsInfo,
    tlsInfo,
    redirectInfo,
    headerInfo,
    phishingObfuscation,
    threatIntel
  } = analysisData;

  let score = 0;
  const details = [];
  const recommendations = [];
  let confidencePoints = 20; // Base confidence

  // Determine Target Status
  let targetStatus = 'ONLINE';
  if (ssrfCheck.isLocal) {
    targetStatus = 'LOCAL / PRIVATE TARGET';
  } else if (!dnsInfo.resolvable && !dnsInfo.isRawIp) {
    targetStatus = 'DNS ERROR';
  } else if (!redirectInfo.isReachable && !tlsInfo.httpsAvailable) {
    targetStatus = 'OFFLINE';
  }

  // 1. SSRF & Local Address Signal
  if (ssrfCheck.isLocal) {
    details.push(`Target is a private/local network address (${ssrfCheck.reason}). Public routing unavailable.`);
    recommendations.push('Do not attempt public web transactions on local/internal IP addresses.');
  }

  // 2. DNS Telemetry
  if (dnsInfo.isRawIp) {
    score += 35;
    details.push('Host uses a raw IP address instead of a domain name (+35)');
    recommendations.push('Legitimate services almost always use domain names instead of raw IP host addresses.');
    confidencePoints += 15;
  } else if (dnsInfo.resolvable) {
    confidencePoints += 20;
    if (dnsInfo.ns.length === 0) {
      score += 10;
      details.push('Unusual DNS configuration: No NS records found (+10)');
    }
  } else {
    details.push('Domain failed DNS resolution (Domain does not resolve or is unregistered).');
  }

  // 3. Encryption / TLS Telemetry
  const isHttps = urlInfo.protocol === 'https:';
  if (!isHttps) {
    score += 25;
    details.push('Unencrypted connection (HTTP is used instead of secure HTTPS) (+25)');
    recommendations.push('Avoid submitting passwords or payment credentials over HTTP connections.');
  } else if (tlsInfo.httpsAvailable) {
    confidencePoints += 20;
    if (!tlsInfo.authorized && tlsInfo.error) {
      score += 30;
      details.push(`TLS Certificate invalid or untrusted (${tlsInfo.error}) (+30)`);
      recommendations.push('Do not proceed if browser shows SSL/TLS certificate warnings.');
    } else if (tlsInfo.daysRemaining !== null && tlsInfo.daysRemaining < 7) {
      score += 15;
      details.push(`TLS Certificate expiring soon (${tlsInfo.daysRemaining} days remaining) (+15)`);
    }
  }

  // 4. Phishing, Brand Impersonation & Obfuscation
  if (phishingObfuscation.phishingRiskScore > 0) {
    score += phishingObfuscation.phishingRiskScore;
    confidencePoints += 15;
  }
  if (phishingObfuscation.obfuscationRiskScore > 0) {
    score += phishingObfuscation.obfuscationRiskScore;
    confidencePoints += 10;
  }
  phishingObfuscation.details.forEach(d => details.push(d));

  if (phishingObfuscation.brandImpersonation && phishingObfuscation.brandImpersonation.impersonationDetected) {
    recommendations.push(`Verify official URL of ${phishingObfuscation.brandImpersonation.matchedBrand} before entering credentials.`);
  }

  // 5. Redirect Chain Telemetry
  if (redirectInfo.isDowngrade) {
    score += 25;
    details.push('Insecure redirect detected (Redirected from HTTPS to unencrypted HTTP) (+25)');
    recommendations.push('Insecure HTTP redirects expose traffic to man-in-the-middle eavesdropping.');
  }
  if (redirectInfo.redirectCount >= 3) {
    score += 15;
    details.push(`Excessive redirect chain (${redirectInfo.redirectCount} hops detected) (+15)`);
  }
  if (redirectInfo.chain.length > 0) {
    confidencePoints += 15;
  }

  // 6. HTTP Security Headers
  if (headerInfo.statusCode) {
    confidencePoints += 10;
    if (!headerInfo.securityHeaders.hsts.present && isHttps) {
      details.push('Security Hardening Notice: HSTS (Strict-Transport-Security) header missing.');
    }
    if (!headerInfo.securityHeaders.csp.present) {
      details.push('Security Hardening Notice: CSP (Content-Security-Policy) header missing.');
    }
  }

  // 7. External Threat Intel Providers
  if (threatIntel.maliciousMatches > 0) {
    score += threatIntel.maliciousMatches * 40;
    details.push(`External threat intelligence flagged target as malicious (${threatIntel.maliciousMatches} provider match) (+${threatIntel.maliciousMatches * 40})`);
  }
  confidencePoints += threatIntel.confidenceBonus;

  // Clamp final score 0 - 100
  const finalScore = Math.min(Math.max(score, 0), 100);

  // Clamp confidence 0 - 100%
  const finalConfidence = Math.min(Math.max(confidencePoints, 10), 100);

  // Determine Final Security Status
  let status = 'Safe';
  if (targetStatus === 'DNS ERROR' && details.length <= 1) {
    status = 'UNKNOWN';
  } else if (finalScore > 70) {
    status = 'Dangerous / Malicious';
  } else if (finalScore > 30) {
    status = 'Suspicious';
  }

  if (details.length === 0) {
    details.push('No vulnerabilities or suspicious threat signals detected with available intelligence.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Target exhibits standard baseline security parameters.');
  }

  return {
    score: finalScore,
    status: status,
    confidence: finalConfidence,
    targetStatus: targetStatus,
    details: details,
    recommendations: recommendations
  };
}

module.exports = {
  evaluateRiskAndConfidence
};
