/**
 * SAVEE Application Entry Point & Event Bindings
 */
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const scanBtn = document.getElementById('scan-btn');
  const micBtn = document.getElementById('mic-btn');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  const exportReportBtn = document.getElementById('export-report-btn');

  // Trigger Scan on Button Click
  if (scanBtn && searchInput) {
    scanBtn.addEventListener('click', () => {
      window.scannerUI.runScan(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        window.scannerUI.runScan(searchInput.value);
      }
    });
  }

  // Voice Assistant Mic Trigger
  if (micBtn && window.voiceManager) {
    micBtn.addEventListener('click', () => {
      window.voiceManager.startListening(
        (transcript) => {
          // Command parser (e.g. "Scan google.com", "Check paypal.com")
          let cleaned = transcript.replace(/^(scan|check|analyze|investigate)\s+/i, '').trim();
          if (searchInput) searchInput.value = cleaned;
          window.scannerUI.runScan(cleaned);
        },
        (isListening) => {
          const panel = document.getElementById('voice-assistant-panel');
          const statusText = document.getElementById('mic-status-text');
          if (panel) {
            if (isListening) panel.classList.add('listening');
            else panel.classList.remove('listening');
          }
          if (statusText) {
            statusText.textContent = isListening ? 'LISTENING... SPEAK URL' : 'CLICK TO SPEAK COMMAND';
          }
        }
      );
    });
  }

  // Audio Mute/Unmute Toggle
  if (audioToggleBtn && window.voiceManager) {
    audioToggleBtn.addEventListener('click', () => {
      const muted = window.voiceManager.toggleMute();
      if (muted) audioToggleBtn.classList.add('muted');
      else audioToggleBtn.classList.remove('muted');
    });
  }

  // Clear History Button
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      window.scannerUI.clearHistory();
    });
  }

  // Export Report Button
  if (exportReportBtn) {
    exportReportBtn.addEventListener('click', () => {
      window.scannerUI.downloadReport();
    });
  }

  // Render initial history ledger
  if (window.ledgerManager && window.scannerUI) {
    window.scannerUI.renderHistory(window.ledgerManager.getHistory());
  }
});
