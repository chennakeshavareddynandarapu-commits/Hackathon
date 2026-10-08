require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Modular Security & Intelligence Scanners
const { isSsrfSafeHost } = require('./src/security/ssrfProtection');
const { normalizeAndParseUrl } = require('./src/security/validation');
const { analyzeDns } = require('./src/scanner/dnsAnalyzer');
const { analyzeTls } = require('./src/scanner/tlsAnalyzer');
const { analyzeRedirects } = require('./src/scanner/redirectAnalyzer');
const { analyzeHeaders } = require('./src/scanner/headerAnalyzer');
const { analyzePhishingAndObfuscation } = require('./src/scanner/phishingAnalyzer');
const { trackIpFromDns } = require('./src/scanner/ipTracker');
const threatIntelManager = require('./src/intelligence/threatIntelManager');
const { evaluateRiskAndConfidence } = require('./src/scoring/riskEngine');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS & JSON Parsing
app.use(cors());
app.use(express.json());

// Serve Static Frontend Assets
app.use(express.static(path.join(__dirname, 'public')));

// 1. Health Status API Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    system: 'SAVEE AI Security & Global URL Inspector 2.0'
  });
});

// 2. Main URL Investigation API Endpoint
app.post('/api/scan', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'A valid URL or domain string is required.' }
      });
    }

    // A. URL Normalization & Component Extraction
    let urlInfo;
    try {
      urlInfo = normalizeAndParseUrl(url);
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: { code: 'PARSE_ERROR', message: err.message }
      });
    }

    // B. SSRF Safety & Local Host Check
    const ssrfCheck = isSsrfSafeHost(urlInfo.hostname);

    // C. Concurrent Diagnostic Investigations including DNS & IP Tracking
    const [dnsInfo, tlsInfo, redirectInfo, headerInfo, threatIntel] = await Promise.all([
      analyzeDns(urlInfo.hostname),
      analyzeTls(urlInfo.hostname, urlInfo.port),
      analyzeRedirects(urlInfo.normalizedUrl),
      analyzeHeaders(urlInfo.normalizedUrl),
      threatIntelManager.queryAll(urlInfo.normalizedUrl, urlInfo.hostname)
    ]);

    // D. DNS-based IP Tracking & Geolocation Telemetry
    const ipTracking = await trackIpFromDns(urlInfo.hostname, dnsInfo);

    // E. Phishing, Brand Impersonation & Obfuscation Analysis
    const phishingObfuscation = analyzePhishingAndObfuscation(urlInfo);

    // F. Risk Correlation & Confidence Scoring Engine
    const verdict = evaluateRiskAndConfidence({
      urlInfo,
      ssrfCheck,
      dnsInfo,
      ipTracking,
      tlsInfo,
      redirectInfo,
      headerInfo,
      phishingObfuscation,
      threatIntel
    });

    // G. Construct Final Intelligence Response
    const responsePayload = {
      success: true,
      url: urlInfo.originalInput,
      normalizedUrl: urlInfo.normalizedUrl,
      score: verdict.score,
      status: verdict.status,
      confidence: verdict.confidence,
      targetStatus: verdict.targetStatus,
      components: {
        protocol: urlInfo.protocol,
        hostname: urlInfo.hostname,
        middleDomain: urlInfo.middleDomain,
        secondLevelDomain: urlInfo.secondLevelDomain,
        registeredDomain: urlInfo.registeredDomain,
        subdomain: urlInfo.subdomain,
        tld: urlInfo.tld,
        port: urlInfo.port,
        path: urlInfo.path,
        query: urlInfo.query
      },
      checks: {
        https: urlInfo.protocol === 'https:' && tlsInfo.httpsAvailable,
        suspiciousKeywords: phishingObfuscation.foundKeywords.length > 0,
        domainReputation: phishingObfuscation.tldReputation ? phishingObfuscation.tldReputation.description : 'Standard',
        urlLengthAnomaly: urlInfo.length > 75,
        anomalousCharacters: phishingObfuscation.anomalies.length > 0,
        brandImpersonation: phishingObfuscation.brandImpersonation ? phishingObfuscation.brandImpersonation.impersonationDetected : false,
        middleDomainStatus: phishingObfuscation.middleDomainAnalysis.status,
        middleDomainIssues: phishingObfuscation.middleDomainAnalysis.issues,
        knownWebsiteMatch: phishingObfuscation.knownWebsiteMatch,
        ipResolved: !!ipTracking.primaryIp,
        ipPrivate: ipTracking.isPrivate
      },
      dns: {
        resolvable: dnsInfo.resolvable,
        a: dnsInfo.a,
        aaaa: dnsInfo.aaaa,
        mx: dnsInfo.mx,
        ns: dnsInfo.ns,
        txt: dnsInfo.txt,
        cname: dnsInfo.cname
      },
      ipTracking,
      tls: {
        httpsAvailable: tlsInfo.httpsAvailable,
        authorized: tlsInfo.authorized,
        issuer: tlsInfo.issuer,
        subject: tlsInfo.subject,
        daysRemaining: tlsInfo.daysRemaining,
        protocol: tlsInfo.protocol,
        error: tlsInfo.error
      },
      redirects: {
        count: redirectInfo.redirectCount,
        isDowngrade: redirectInfo.isDowngrade,
        finalDestination: redirectInfo.finalDestination,
        chain: redirectInfo.chain
      },
      headers: {
        statusCode: headerInfo.statusCode,
        serverHeader: headerInfo.serverHeader,
        securityHeaders: headerInfo.securityHeaders,
        cookieSecurity: headerInfo.cookieSecurity
      },
      threatIntel: threatIntel.providers,
      details: verdict.details,
      recommendations: verdict.recommendations,
      timestamp: new Date().toISOString()
    };

    return res.json(responsePayload);
  } catch (error) {
    console.error('Unhandled scan error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'An internal error occurred during analysis.' }
    });
  }
});

// 3. Standalone DNS IP Tracker API Endpoint
app.post('/api/track-ip', async (req, res) => {
  try {
    const { url, host } = req.body;
    const target = url || host;

    if (!target || typeof target !== 'string') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Target URL or host domain string is required.' }
      });
    }

    const ipTracking = await trackIpFromDns(target);
    return res.json({
      success: true,
      target,
      ipTracking
    });
  } catch (err) {
    console.error('IP tracking error:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'IP_TRACK_ERROR', message: 'Failed to track IP address from target URL.' }
    });
  }
});

// 4. Security Investigation Report Generator Endpoint
app.post('/api/report', (req, res) => {
  const data = req.body;
  if (!data || !data.url) {
    return res.status(400).json({ error: 'Scan result data is required to generate a report.' });
  }

  const ipt = data.ipTracking || {};
  const geo = ipt.geo || {};
  const infra = ipt.infrastructure || {};

  const reportText = `===================================================================
SAVEE // GLOBAL AI SECURITY INVESTIGATION REPORT
===================================================================
Target URL:      ${data.url}
Normalized URL:  ${data.normalizedUrl || data.url}
Scan Time:       ${data.timestamp || new Date().toISOString()}

-------------------------------------------------------------------
VERDICT & RISK METRICS
-------------------------------------------------------------------
Risk Score:      ${data.score} / 100
Security Status: ${data.status}
Confidence:      ${data.confidence}%
Target Status:   ${data.targetStatus || 'ONLINE'}

-------------------------------------------------------------------
DNS IP TRACKING & GEOLOCATION TELEMETRY
-------------------------------------------------------------------
• Primary Resolved IP:  ${ipt.primaryIp || (data.dns && data.dns.a ? data.dns.a[0] : 'N/A')} (${ipt.ipVersion || 'IPv4'})
• Reverse DNS (PTR):    ${ipt.reverseDns || 'N/A'}
• DNS Resolution Time:  ${ipt.dnsLookupTimeMs ? `${ipt.dnsLookupTimeMs}ms` : 'N/A'}
• Total Resolved IPs:   ${ipt.totalIpsCount || (data.dns ? (data.dns.a.length + data.dns.aaaa.length) : 'N/A')}
• Geo Location:         ${geo.city ? `${geo.city}, ${geo.region}, ${geo.country}` : 'N/A'}
• Coordinates:          ${geo.lat !== undefined ? `${geo.lat}, ${geo.lon}` : 'N/A'}
• Timezone:             ${geo.timezone || 'N/A'}
• ISP / Organization:   ${geo.isp || geo.org || 'N/A'}
• Autonomous System:    ${geo.asn || 'N/A'}
• Infrastructure:       ${infra.networkType || 'N/A'}
• Network Latency:      ${ipt.latencyMs !== null && ipt.latencyMs !== undefined ? `${ipt.latencyMs}ms` : 'N/A'}
• Private/SSRF Safe:    ${ipt.isPrivate ? 'PRIVATE ADDRESS (SSRF RESTRICTED)' : 'PUBLICLY ROUTED IP'}

-------------------------------------------------------------------
COMPONENT BREAKDOWN
-------------------------------------------------------------------
• Protocol:          ${data.components ? data.components.protocol : 'N/A'}
• Hostname:          ${data.components ? data.components.hostname : 'N/A'}
• Registered Domain: ${data.components ? data.components.registeredDomain : 'N/A'}
• HTTPS Status:      ${data.checks ? (data.checks.https ? 'SECURE (HTTPS)' : 'UNENCRYPTED (HTTP)') : 'N/A'}
• DNS Resolvability: ${data.dns ? (data.dns.resolvable ? 'RESOLVABLE' : 'UNRESOLVED') : 'N/A'}

-------------------------------------------------------------------
RISK INDICATORS & ANOMALIES
-------------------------------------------------------------------
${(data.details || []).map((d, i) => `${i + 1}. ${d}`).join('\n')}

-------------------------------------------------------------------
SECURITY RECOMMENDATIONS
-------------------------------------------------------------------
${(data.recommendations || []).map((r, i) => `${i + 1}. ${r}`).join('\n')}

===================================================================
Report generated by SAVEE AI Security Engine v2.0
===================================================================`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename=SAVEE_Report_${Date.now()}.txt`);
  res.send(reportText);
});

// Fallback single page application route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 SAVEE - Global AI Security Server running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});
