/**
 * SAVEE Scanner UI Controller
 * Manages API calls, live terminal animations, gauge updates, breakdown cards,
 * DNS IP Tracking telemetry, and report exports.
 */
class ScannerUI {
  constructor() {
    this.currentScanResult = null;
    this.currentIpTracking = null;
  }

  async runScan(urlInput) {
    if (!urlInput || !urlInput.trim()) {
      alert('Please enter a target URL or domain to investigate.');
      return;
    }

    const trimmedUrl = urlInput.trim();
    this.logTerminal(`[${this.getTimestamp()}] INITIALIZING GLOBAL URL ANALYSIS: ${trimmedUrl}`);

    // Sequential terminal diagnostic steps animation
    const steps = [
      'NORMALIZING TARGET & EXTRACTING DOMAIN',
      'VALIDATING SSRF & IP BOUNDARIES',
      'RESOLVING DNS RECORDS (A, AAAA, MX, NS, TXT)',
      'TRACKING HOST IP ADDRESS & GEOLOCATION (ASN/ISP)',
      'AUDITING TLS / HTTPS ENCRYPTION CERTIFICATE',
      'TRACKING REDIRECT CHAINS & PROBING HEADERS',
      'ANALYZING PHISHING SIGNALS & BRAND IMPERSONATION',
      'QUERYING THREAT INTELLIGENCE REPUTATION PROVIDERS',
      'CORRELATING SECURITY SIGNALS & GENERATING VERDICT'
    ];

    for (const step of steps) {
      this.logTerminal(`[${this.getTimestamp()}] ${step}...`);
      await new Promise(r => setTimeout(r, 110));
    }

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.error ? data.error.message : 'Analysis request failed.';
        this.logTerminal(`[${this.getTimestamp()}] ERROR: ${errorMsg}`);
        alert(`Scan Error: ${errorMsg}`);
        return;
      }

      this.currentScanResult = data;
      this.renderResults(data);

      if (data.ipTracking) {
        this.currentIpTracking = data.ipTracking;
        this.renderIpTracking(data.ipTracking);
        const orig = data.ipTracking.originalLocation;
        if (orig?.headquarters) {
          this.logTerminal(`[${this.getTimestamp()}] [ORIGINAL HQ] ${orig.platform}: ${orig.headquarters} ${orig.flag || ''}`);
        }
        const geoInfo = data.ipTracking.geo?.country ? ` (${data.ipTracking.geo.city || 'Edge'}, ${data.ipTracking.geo.country})` : '';
        this.logTerminal(`[${this.getTimestamp()}] [DNS EDGE PoP] Resolved: ${data.ipTracking.primaryIp}${geoInfo} | Latency: ${data.ipTracking.latencyMs || 'N/A'}ms`);
        if (data.ipTracking.routingInsight) {
          this.logTerminal(`[${this.getTimestamp()}] [ROUTING] ${data.ipTracking.routingInsight}`);
        }
      }

      this.logTerminal(`[${this.getTimestamp()}] ANALYSIS COMPLETE. SCORE: ${data.score}/100 [${data.status}]`);

      // Vocal Feedback
      if (window.voiceManager) {
        const origReadout = data.ipTracking?.originalLocation?.headquarters 
          ? ` Originally located in ${data.ipTracking.originalLocation.headquarters}.` 
          : '';
        const vocalMessage = `Scan complete for ${data.components ? data.components.registeredDomain : 'target'}.${origReadout} Security score ${data.score} out of 100. Verdict: ${data.status}.`;
        window.voiceManager.speak(vocalMessage);
      }

      // Add to Ledger History
      if (window.ledgerManager) {
        const updatedHistory = window.ledgerManager.addEntry(data);
        this.renderHistory(updatedHistory);
      }

    } catch (err) {
      this.logTerminal(`[${this.getTimestamp()}] NETWORK ERROR: Failed to connect to security gateway.`);
      alert('Network Error: Server unreachable.');
    }
  }

  /**
   * Dedicated DNS IP Tracking mode for instant domain/URL resolution
   */
  async trackIpOnly(urlInput) {
    if (!urlInput || !urlInput.trim()) {
      alert('Please enter a target URL or domain to track its IP.');
      return;
    }

    const trimmedUrl = urlInput.trim();
    this.logTerminal(`[${this.getTimestamp()}] TRACKING IP ADDRESS VIA DNS: ${trimmedUrl}`);

    const steps = [
      'PARSING WEB TARGET HOSTNAME',
      'QUERYING DNS NAMESERVERS (A & AAAA ADDRESSES)',
      'PERFORMING REVERSE DNS (PTR) LOOKUP',
      'FETCHING GEOLOCATION & AUTONOMOUS SYSTEM INTEL',
      'PROBING TCP ENDPOINT LATENCY'
    ];

    for (const step of steps) {
      this.logTerminal(`[${this.getTimestamp()}] ${step}...`);
      await new Promise(r => setTimeout(r, 90));
    }

    try {
      const response = await fetch('/api/track-ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.error ? data.error.message : 'IP tracking failed.';
        this.logTerminal(`[${this.getTimestamp()}] DNS IP TRACK ERROR: ${errorMsg}`);
        alert(`DNS IP Track Error: ${errorMsg}`);
        return;
      }

      const ipData = data.ipTracking;
      this.currentIpTracking = ipData;
      this.renderIpTracking(ipData);

      // Scroll smoothly to IP tracker section
      const ipSection = document.getElementById('ip-tracker-section');
      if (ipSection) {
        ipSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      const geoStr = ipData.geo?.city ? `${ipData.geo.city}, ${ipData.geo.country}` : (ipData.geo?.country || 'Location mapped');
      if (ipData.originalLocation?.headquarters) {
        this.logTerminal(`[${this.getTimestamp()}] [ORIGINAL HQ] ${ipData.originalLocation.platform}: ${ipData.originalLocation.headquarters} ${ipData.originalLocation.flag || ''}`);
      }
      this.logTerminal(`[${this.getTimestamp()}] [DNS EDGE PoP] ${ipData.primaryIp} (${geoStr}) via ${ipData.infrastructure?.provider || 'Host'}`);
      if (ipData.routingInsight) {
        this.logTerminal(`[${this.getTimestamp()}] [ROUTING] ${ipData.routingInsight}`);
      }

      if (window.voiceManager) {
        const origReadout = ipData.originalLocation?.headquarters ? ` Originally headquartered in ${ipData.originalLocation.headquarters}.` : '';
        window.voiceManager.speak(`DNS resolved target to IP address ${ipData.primaryIp}.${origReadout} Edge server in ${ipData.geo?.country || 'global network'}.`);
      }

    } catch (err) {
      this.logTerminal(`[${this.getTimestamp()}] NETWORK ERROR: Failed to connect to IP tracking service.`);
      alert('Network Error: Server unreachable.');
    }
  }

  renderResults(data) {
    // Score & Gauge
    const scoreVal = document.getElementById('gauge-score-value');
    const gaugeFill = document.getElementById('gauge-fill-circle');
    const verdictBadge = document.getElementById('verdict-badge');
    const confidenceVal = document.getElementById('confidence-val');
    const confidenceFill = document.getElementById('confidence-fill');
    const targetStatusElem = document.getElementById('target-status-val');

    if (scoreVal) scoreVal.textContent = data.score;
    if (confidenceVal) confidenceVal.textContent = `${data.confidence}%`;
    if (confidenceFill) confidenceFill.style.width = `${data.confidence}%`;
    if (targetStatusElem) targetStatusElem.textContent = data.targetStatus || 'ONLINE';

    // Update gauge stroke offset (circumference ~ 415)
    if (gaugeFill) {
      const strokeOffset = 415 - (415 * (data.score / 100));
      gaugeFill.style.strokeDashoffset = strokeOffset;

      if (data.score > 70) {
        gaugeFill.style.stroke = '#ff007f';
      } else if (data.score > 30) {
        gaugeFill.style.stroke = '#b500ff';
      } else {
        gaugeFill.style.stroke = '#00f0ff';
      }
    }

    // Verdict Badge styling
    if (verdictBadge) {
      verdictBadge.textContent = data.status;
      verdictBadge.className = 'verdict-badge';
      if (data.status.includes('Safe')) verdictBadge.classList.add('safe');
      else if (data.status.includes('Suspicious')) verdictBadge.classList.add('suspicious');
      else if (data.status.includes('Dangerous')) verdictBadge.classList.add('danger');
      else verdictBadge.classList.add('unknown');
    }

    // Breakdown Cards
    this.updateCheckCard('card-encryption', data.checks.https, data.checks.https ? 'Encrypted Connection' : 'Unencrypted Connection', data.checks.https ? 'Safe' : 'High Risk');
    this.updateCheckCard('card-domain', data.dns.resolvable, data.dns.resolvable ? 'DNS Resolvable' : 'Unresolved Domain', data.dns.resolvable ? 'Normal' : 'Warning');
    this.updateCheckCard('card-phishing', !data.checks.suspiciousKeywords, data.checks.suspiciousKeywords ? 'Keywords Detected' : 'Clean Content', data.checks.suspiciousKeywords ? 'Warning' : 'Low Risk');
    this.updateCheckCard('card-brand', !data.checks.brandImpersonation, data.checks.brandImpersonation ? 'Possible Impersonation' : 'No Impersonation', data.checks.brandImpersonation ? 'Dangerous' : 'Safe');

    const isMiddleSafe = data.checks.middleDomainStatus === 'SAFE';
    const middleText = isMiddleSafe ? 'Structure Verified' : (data.checks.middleDomainStatus === 'DANGEROUS' ? 'Brand Spoofing Anomaly' : 'Subdomain Anomaly');
    this.updateCheckCard('card-middle-domain', isMiddleSafe, middleText, isMiddleSafe ? 'Safe' : 'Warning');

    // Detailed Log list
    const detailsList = document.getElementById('details-log-list');
    if (detailsList) {
      detailsList.innerHTML = '';
      (data.details || []).forEach(detail => {
        const li = document.createElement('li');
        li.className = 'details-log-item';
        if (detail.includes('(+') || detail.includes('Dangerous') || detail.includes('Suspicious')) {
          li.classList.add('danger-text');
        } else {
          li.classList.add('safe-text');
        }
        li.textContent = detail;
        detailsList.appendChild(li);
      });
    }
  }

  /**
   * Renders DNS IP Tracking and Geolocation HUD
   */
  renderIpTracking(ipData) {
    if (!ipData) return;

    // Elements
    const primaryIpElem = document.getElementById('tracked-primary-ip');
    const versionBadge = document.getElementById('ip-version-badge');
    const routeBadge = document.getElementById('ip-route-badge');
    const reverseDnsElem = document.getElementById('tracked-reverse-dns');
    const dnsResolutionPill = document.getElementById('dns-resolution-pill');
    const pingText = document.getElementById('ip-ping-text');
    const coordsText = document.getElementById('tracked-coords-text');
    const timezoneText = document.getElementById('tracked-timezone-text');

    const geoFlag = document.getElementById('tracked-geo-flag');
    const geoLocation = document.getElementById('tracked-geo-location');
    const geoRegion = document.getElementById('tracked-geo-region');

    const ispElem = document.getElementById('tracked-isp');
    const orgElem = document.getElementById('tracked-org');
    const asnElem = document.getElementById('tracked-asn');
    const networkTypeElem = document.getElementById('tracked-network-type');

    const infraBadge = document.getElementById('tracked-infra-badge');
    const infraDetail = document.getElementById('tracked-infra-detail');

    const poolList = document.getElementById('dns-pool-list');
    const poolCount = document.getElementById('dns-pool-count');

    // Dual Location Pipeline Elements
    const origPlatformElem = document.getElementById('origin-platform-name');
    const origFlagElem = document.getElementById('origin-geo-flag');
    const origGeoElem = document.getElementById('origin-geo-text');
    const origCoordsElem = document.getElementById('origin-coords');
    const origTimezoneElem = document.getElementById('origin-timezone');
    const origFoundedBadge = document.getElementById('origin-founded-badge');

    const edgeIspElem = document.getElementById('edge-isp-name');
    const edgeFlagElem = document.getElementById('edge-geo-flag');
    const edgeGeoElem = document.getElementById('edge-geo-text');
    const edgeCoordsElem = document.getElementById('edge-coords');
    const edgeTimezoneElem = document.getElementById('edge-timezone');
    const edgeLatencyBadge = document.getElementById('edge-latency-badge');
    const routingTag = document.getElementById('routing-edge-tag');
    const routingInsightText = document.getElementById('routing-insight-text');

    const orig = ipData.originalLocation || {};
    const resLoc = ipData.resolvedLocation || ipData.geo || {};

    // Populate Original Headquarters
    if (origPlatformElem) origPlatformElem.textContent = orig.platform || ipData.targetHost;
    if (origFlagElem) origFlagElem.textContent = orig.flag || '🌐';
    if (origGeoElem) origGeoElem.textContent = orig.headquarters || `${orig.city || 'Origin'}, ${orig.country || 'Global'}`;
    if (origCoordsElem) {
      const oLat = orig.lat !== undefined ? Number(orig.lat).toFixed(4) : '--';
      const oLon = orig.lon !== undefined ? Number(orig.lon).toFixed(4) : '--';
      origCoordsElem.textContent = `LAT: ${oLat} | LON: ${oLon}`;
    }
    if (origTimezoneElem) origTimezoneElem.textContent = `TZ: ${orig.timezone || 'UTC'}`;
    if (origFoundedBadge) {
      origFoundedBadge.textContent = orig.founded ? `FOUNDED ${orig.founded}` : (orig.originType ? orig.originType.slice(0, 15) : 'ORIGIN');
    }

    // Populate Resolved DNS Edge
    if (edgeIspElem) edgeIspElem.textContent = `${resLoc.isp || ipData.infrastructure?.provider || 'DNS Edge Server'}`;
    if (edgeFlagElem) edgeFlagElem.textContent = resLoc.flag || '🌐';
    if (edgeGeoElem) edgeGeoElem.textContent = `${resLoc.city || 'Edge'}, ${resLoc.region || ''}, ${resLoc.country || ''}`;
    if (edgeCoordsElem) {
      const eLat = resLoc.lat !== undefined ? Number(resLoc.lat).toFixed(4) : '--';
      const eLon = resLoc.lon !== undefined ? Number(resLoc.lon).toFixed(4) : '--';
      edgeCoordsElem.textContent = `LAT: ${eLat} | LON: ${eLon}`;
    }
    if (edgeTimezoneElem) edgeTimezoneElem.textContent = `TZ: ${resLoc.timezone || 'UTC'}`;
    if (edgeLatencyBadge) {
      edgeLatencyBadge.textContent = ipData.latencyMs ? `${ipData.latencyMs}ms ROUTE` : 'DNS ROUTE';
    }
    if (routingTag) {
      routingTag.textContent = ipData.infrastructure?.isCdn ? 'ANYCAST CDN' : 'DIRECT ROUTE';
    }
    if (routingInsightText) {
      routingInsightText.textContent = ipData.routingInsight || `Traffic resolved to ${resLoc.country} via ${ipData.infrastructure?.provider || 'host'}.`;
    }

    // 1. Primary IP
    if (primaryIpElem) {
      primaryIpElem.textContent = ipData.primaryIp || 'Unresolved';
    }

    // 2. Badges
    if (versionBadge) {
      versionBadge.textContent = ipData.ipVersion || 'IPv4';
    }
    if (routeBadge) {
      if (ipData.isPrivate) {
        routeBadge.textContent = 'PRIVATE IP (SSRF GUARD)';
        routeBadge.className = 'ip-tech-badge route-private';
      } else {
        routeBadge.textContent = 'PUBLIC ROUTE';
        routeBadge.className = 'ip-tech-badge route-safe';
      }
    }

    // 3. Reverse DNS
    if (reverseDnsElem) {
      reverseDnsElem.textContent = ipData.reverseDns || 'No PTR Record';
    }

    // 4. Pills (DNS duration & Latency ping)
    if (dnsResolutionPill) {
      dnsResolutionPill.textContent = ipData.dnsLookupTimeMs !== undefined 
        ? `DNS RESOLVED (${ipData.dnsLookupTimeMs}ms)` 
        : 'DNS RESOLVED';
      dnsResolutionPill.className = 'pill-badge amber-badge';
    }
    if (pingText) {
      if (ipData.latencyMs !== null && ipData.latencyMs !== undefined) {
        pingText.textContent = `LATENCY: ${ipData.latencyMs}ms`;
      } else {
        pingText.textContent = ipData.status === 'LOCAL' ? 'LATENCY: <1ms (LOCAL)' : 'LATENCY: PROBE TIMEOUT';
      }
    }

    // 5. Coordinates & Timezone
    const geo = ipData.geo || {};
    if (coordsText) {
      const lat = geo.lat !== undefined ? Number(geo.lat).toFixed(4) : '--';
      const lon = geo.lon !== undefined ? Number(geo.lon).toFixed(4) : '--';
      coordsText.textContent = `LAT: ${lat} | LON: ${lon}`;
    }
    if (timezoneText) {
      timezoneText.textContent = `TIMEZONE: ${geo.timezone || 'UTC'}`;
    }

    // 6. Geolocation Tiles
    if (geoFlag) geoFlag.textContent = geo.flag || '🌐';
    if (geoLocation) {
      geoLocation.textContent = geo.city && geo.country 
        ? `${geo.city}, ${geo.country}` 
        : (geo.country || 'Global Anycast');
    }
    if (geoRegion) {
      geoRegion.textContent = geo.region 
        ? `${geo.region} (${geo.countryCode || 'INT'})` 
        : 'Distributed Region';
    }

    // 7. ISP & Org
    if (ispElem) ispElem.textContent = geo.isp || 'Global Network';
    if (orgElem) orgElem.textContent = geo.org || 'Cloud Infrastructure';

    // 8. ASN & Routing
    if (asnElem) asnElem.textContent = geo.asn || 'AS-UNKNOWN';
    if (networkTypeElem) {
      networkTypeElem.textContent = ipData.infrastructure?.networkType || 'BGP Routing';
    }

    // 9. Infrastructure
    if (infraBadge) {
      infraBadge.textContent = ipData.infrastructure?.provider || 'Web Host';
    }
    if (infraDetail) {
      const cdnTag = ipData.infrastructure?.isCdn ? 'CDN Active' : 'Direct Host';
      const cloudTag = ipData.infrastructure?.isCloud ? 'Cloud Architecture' : 'Dedicated Server';
      infraDetail.textContent = `${cdnTag} • ${cloudTag}`;
    }

    // 10. DNS Resolved Address Pool Chips
    if (poolList && poolCount) {
      poolList.innerHTML = '';
      const resolvedList = ipData.resolvedIps || (ipData.primaryIp ? [ipData.primaryIp] : []);
      poolCount.textContent = `${resolvedList.length} IP ADDRESS${resolvedList.length === 1 ? '' : 'ES'}`;

      if (resolvedList.length === 0) {
        poolList.innerHTML = '<span class="pool-empty-text">No IP addresses returned by DNS.</span>';
      } else {
        resolvedList.forEach((ip, idx) => {
          const isPrimary = ip === ipData.primaryIp;
          const isV6 = ip.includes(':');
          const chip = document.createElement('div');
          chip.className = `dns-ip-chip ${isPrimary ? 'primary-chip' : ''}`;
          chip.title = `Click to copy IP: ${ip}`;
          chip.innerHTML = `
            <span>${ip}</span>
            <span class="chip-v-tag">${isV6 ? 'v6' : 'v4'}</span>
            ${isPrimary ? '<span style="font-size:0.6rem; color:var(--neon-blue); font-weight:800;">PRIMARY</span>' : ''}
          `;
          chip.addEventListener('click', () => {
            this.copyTextToClipboard(ip, `Copied IP ${ip} to clipboard`);
          });
          poolList.appendChild(chip);
        });
      }
    }
  }

  copyPrimaryIp() {
    if (!this.currentIpTracking || !this.currentIpTracking.primaryIp) {
      alert('No IP address tracked yet. Investigate a URL first.');
      return;
    }
    this.copyTextToClipboard(this.currentIpTracking.primaryIp, 'Primary IP copied to clipboard!');
  }

  copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.logTerminal(`[${this.getTimestamp()}] CLIPBOARD: ${successMsg}`);
      }).catch(() => {
        prompt('Copy IP manually:', text);
      });
    } else {
      prompt('Copy IP manually:', text);
    }
  }

  updateCheckCard(cardId, isSafe, text, riskLabel) {
    const card = document.getElementById(cardId);
    if (!card) return;
    const statusText = card.querySelector('.check-status-text');
    const indicator = card.querySelector('.vector-indicator');

    if (statusText) statusText.textContent = text;
    if (indicator) {
      indicator.className = 'vector-indicator ' + (isSafe ? 'safe' : 'danger');
    }
  }

  logTerminal(msg) {
    const output = document.getElementById('terminal-output');
    if (!output) return;
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = msg;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  renderHistory(history) {
    const tbody = document.getElementById('history-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (history.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-ledger-text">No inspection history recorded.</td></tr>';
      return;
    }

    history.forEach(item => {
      const primaryIp = item.raw?.ipTracking?.primaryIp || item.raw?.dns?.a?.[0] || 'Unresolved';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><a href="#" style="color: var(--neon-blue); font-weight:700; text-decoration:none;" onclick="window.scannerUI.runScan('${item.url}'); return false;">${item.url}</a></td>
        <td><span style="font-family: var(--font-mono); font-size: 0.85rem; color: #ffffff;">${primaryIp}</span></td>
        <td><span style="font-weight:800; color: ${item.score > 70 ? '#ff007f' : item.score > 30 ? '#b500ff' : '#00f0ff'};">${item.score}/100</span></td>
        <td>${item.status}</td>
        <td>${new Date(item.timestamp).toLocaleTimeString()}</td>
        <td>
          <button class="amber-pill-btn secondary sm" onclick="window.scannerUI.downloadReportDirect(${JSON.stringify(item.raw).replace(/"/g, '&quot;')})">Report</button>
          <button class="amber-pill-btn outline danger sm" onclick="window.scannerUI.deleteHistoryItem('${item.id}')">✕</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  deleteHistoryItem(id) {
    if (window.ledgerManager) {
      const updated = window.ledgerManager.deleteEntry(id);
      this.renderHistory(updated);
    }
  }

  clearHistory() {
    if (window.ledgerManager && confirm('Clear all recorded inspection history?')) {
      const updated = window.ledgerManager.clearAll();
      this.renderHistory(updated);
    }
  }

  downloadReport() {
    if (!this.currentScanResult) {
      alert('Please perform a URL scan first to generate a report.');
      return;
    }
    this.downloadReportDirect(this.currentScanResult);
  }

  async downloadReportDirect(data) {
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SAVEE_Report_${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      alert('Failed to generate report file.');
    }
  }

  getTimestamp() {
    return new Date().toTimeString().split(' ')[0];
  }
}

window.scannerUI = new ScannerUI();
