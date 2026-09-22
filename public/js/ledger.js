/**
 * SAVEE Inspection Ledger Manager (LocalStorage)
 */
class LedgerManager {
  constructor() {
    this.STORAGE_KEY = 'SAVEE_INSPECTION_LEDGER_V2';
  }

  getHistory() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  addEntry(scanResult) {
    const history = this.getHistory();
    const newEntry = {
      id: Date.now().toString(),
      url: scanResult.url,
      normalizedUrl: scanResult.normalizedUrl,
      score: scanResult.score,
      status: scanResult.status,
      confidence: scanResult.confidence,
      targetStatus: scanResult.targetStatus,
      timestamp: scanResult.timestamp || new Date().toISOString(),
      raw: scanResult
    };

    // Filter out duplicates of same URL if re-scanned
    const filtered = history.filter(item => item.url !== scanResult.url);
    filtered.unshift(newEntry);

    // Keep max 25 history entries
    const trimmed = filtered.slice(0, 25);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed));
    return trimmed;
  }

  deleteEntry(id) {
    const history = this.getHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
    return [];
  }
}

window.ledgerManager = new LedgerManager();
