/**
 * SAVEE Scanner UI Controller
 * Manages API calls, live terminal animations, gauge updates, breakdown cards, and report exports.
 */
class ScannerUI {
  constructor() {
    this.currentScanResult = null;
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
      'AUDITING TLS / HTTPS ENCRYPTION CERTIFICATE',
      'TRACKING REDIRECT CHAINS & PROBING HEADERS',
      'ANALYZING PHISHING SIGNALS & BRAND IMPERSONATION',
      'QUERYING THREAT INTELLIGENCE REPUTATION PROVIDERS',
      'CORRELATING SECURITY SIGNALS & GENERATING VERDICT'
    ];

    for (const step of steps) {
      this.logTerminal(`[${this.getTimestamp()}] ${step}...`);
      await new Promise(r => setTimeout(r, 120));
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
      this.logTerminal(`[${this.getTimestamp()}] ANALYSIS COMPLETE. SCORE: ${data.score}/100 [${data.status}]`);

      // Vocal Feedback
      if (window.voiceManager) {
        const vocalMessage = `Scan complete for ${data.components ? data.components.registeredDomain : 'target'}. Security score ${data.score} out of 100. Verdict: ${data.status}. Confidence ${data.confidence} percent.`;
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
      tbody.innerHTML = '<tr><td colspan="5" class="empty-ledger-text">No inspection history recorded.</td></tr>';
      return;
    }

    history.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><a href="#" style="color: var(--neon-blue); font-weight:700; text-decoration:none;" onclick="window.scannerUI.runScan('${item.url}'); return false;">${item.url}</a></td>
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
