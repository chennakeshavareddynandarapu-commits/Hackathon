/**
 * TLD Intelligence database for evaluating TLD risk weight.
 */
const HIGH_RISK_TLDS = [
  '.xyz', '.top', '.club', '.work', '.gq', '.cf', '.tk', '.ml',
  '.fit', '.date', '.click', '.link', '.zip', '.info', '.kim',
  '.rest', '.country', '.download', '.stream', '.review', '.party'
];

const TRUSTED_TLDS = [
  '.gov', '.edu', '.mil', '.gov.in', '.gov.uk', '.edu.au', '.ac.uk'
];

/**
 * Evaluates TLD reputation for a hostname.
 * @param {string} hostname 
 */
function evaluateTldReputation(hostname) {
  const lower = hostname.toLowerCase();

  for (const tld of HIGH_RISK_TLDS) {
    if (lower.endsWith(tld)) {
      return {
        level: 'SUSPICIOUS',
        tld: tld,
        riskWeight: 20,
        description: `Domain ends with a statistically high-risk/untrusted TLD "${tld}"`
      };
    }
  }

  for (const tld of TRUSTED_TLDS) {
    if (lower.endsWith(tld)) {
      return {
        level: 'HIGH_TRUST',
        tld: tld,
        riskWeight: -10, // Slight risk reduction for verified gov/edu domains
        description: `Domain uses a verified institutional/government TLD "${tld}"`
      };
    }
  }

  return {
    level: 'STANDARD',
    tld: lower.substring(lower.lastIndexOf('.')),
    riskWeight: 0,
    description: 'Standard generic TLD'
  };
}

module.exports = {
  HIGH_RISK_TLDS,
  TRUSTED_TLDS,
  evaluateTldReputation
};
