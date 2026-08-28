const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// URL Scanner API Endpoint
app.post('/api/scan', (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'A valid URL string is required.' });
  }

  const originalUrl = url.trim();
  let normalizedUrl = originalUrl;

  // Prepend protocol if missing so we can parse it
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = 'http://' + normalizedUrl;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(normalizedUrl);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL format. Please enter a valid URL.' });
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const pathname = parsedUrl.pathname;
  
  // Heuristics variables
  let score = 0;
  const details = [];
  
  // 1. HTTPS Check
  const isHttps = parsedUrl.protocol === 'https:';
  if (!isHttps) {
    score += 25;
    details.push('Unencrypted connection (HTTP is used instead of secure HTTPS) (+25)');
  }

  // 2. IP Hostname Check
  const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const isIpv4 = ipv4Regex.test(hostname);
  const isIpv6 = hostname.includes(':') && !hostname.includes('.'); // Simplistic IPv6 check
  const isRawIp = isIpv4 || isIpv6;

  let domainReputation = 'Good';
  if (isRawIp) {
    score += 35;
    domainReputation = 'Dangerous (Raw IP Host)';
    details.push('Host uses a raw IP address instead of a domain name (+35)');
  } else {
    // Check for suspicious TLDs
    const suspiciousTlds = ['.xyz', '.top', '.club', '.work', '.gq', '.cf', '.tk', '.ml', '.fit', '.date', '.click', '.link', '.zip', '.info'];
    const hasSuspiciousTld = suspiciousTlds.some(tld => hostname.endsWith(tld));
    if (hasSuspiciousTld) {
      score += 20;
      domainReputation = 'Suspicious (Untrusted TLD)';
      const tldMatch = suspiciousTlds.find(tld => hostname.endsWith(tld));
      details.push(`Domain ends with a highly suspicious/untrusted TLD "${tldMatch}" (+20)`);
    }
  }

  // 3. Phishing Keywords Check
  const suspiciousKeywords = [
    'login', 'verify', 'secure', 'webscr', 'signin', 'banking', 'free-gift', 
    'claim-reward', 'update-account', 'paypal', 'giftcard', 'admin', 'credential',
    'account-update', 'recovery', 'support-login', 'bonus', 'claim', 'winner'
  ];
  
  let keywordPenalty = 0;
  const foundKeywords = [];
  suspiciousKeywords.forEach(word => {
    if (originalUrl.toLowerCase().includes(word)) {
      foundKeywords.push(word);
      keywordPenalty += 15;
    }
  });

  if (keywordPenalty > 0) {
    const cappedPenalty = Math.min(keywordPenalty, 45);
    score += cappedPenalty;
    details.push(`Suspicious phishing keywords found: ${foundKeywords.join(', ')} (+${cappedPenalty})`);
  }

  // 4. Anomalous Characters & Formatting
  let anomalousPenalty = 0;
  let hasAtCharacter = false;
  let hasExcessiveHyphens = false;
  let hasDoubleSlashInPath = false;

  if (originalUrl.includes('@')) {
    anomalousPenalty += 25;
    hasAtCharacter = true;
    details.push('Contains URL user obscuring character "@" (+25)');
  }

  // Count hyphens in the hostname
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount > 3) {
    anomalousPenalty += 15;
    hasExcessiveHyphens = true;
    details.push(`Excessive hyphens in hostname (${hyphenCount} found) (+15)`);
  }

  // Double slash anomaly in path (excluding the initial http:// or https://)
  const pathPart = originalUrl.replace(/^https?:\/\//i, '');
  if (pathPart.includes('//')) {
    anomalousPenalty += 15;
    hasDoubleSlashInPath = true;
    details.push('Contains suspicious consecutive slashes "//" in path (+15)');
  }

  const hasAnomalousCharacters = hasAtCharacter || hasExcessiveHyphens || hasDoubleSlashInPath;
  score += anomalousPenalty;

  // 5. URL Length Anomaly
  let isLongUrl = false;
  if (originalUrl.length > 120) {
    score += 25;
    isLongUrl = true;
    details.push(`Extremely long URL (${originalUrl.length} characters) (+25)`);
  } else if (originalUrl.length > 75) {
    score += 10;
    isLongUrl = true;
    details.push(`Suspiciously long URL (${originalUrl.length} characters) (+10)`);
  }

  // Clamp risk score to max 100 and min 0
  const finalScore = Math.min(Math.max(score, 0), 100);

  // Categorize risk status
  let status = 'Safe';
  if (finalScore > 70) {
    status = 'Dangerous / Malicious';
  } else if (finalScore > 30) {
    status = 'Suspicious';
  }

  res.json({
    url: originalUrl,
    score: finalScore,
    status: status,
    checks: {
      https: isHttps,
      suspiciousKeywords: foundKeywords.length > 0,
      domainReputation: domainReputation,
      urlLengthAnomaly: isLongUrl,
      anomalousCharacters: hasAnomalousCharacters
    },
    details: details.length > 0 ? details : ['No vulnerabilities or suspicious patterns detected.'],
    timestamp: new Date().toISOString()
  });
});

// Fallback to serving index.html for single page app routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 SAVEE - AI Security Server running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});
