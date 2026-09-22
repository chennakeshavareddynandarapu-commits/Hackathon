const net = require('net');

/**
 * Checks if an IP address is a private, loopback, link-local, or restricted IP.
 * @param {string} ip - IPv4 or IPv6 string
 * @returns {object} { isPrivate: boolean, type: string }
 */
function checkIpRestricted(ip) {
  if (!ip) return { isPrivate: false, type: 'UNKNOWN' };

  // IPv4 Private Ranges & Reserved IPs
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);

    // Loopback (127.0.0.0/8)
    if (parts[0] === 127) {
      return { isPrivate: true, type: 'LOOPBACK', description: 'Loopback Localhost IP (127.0.0.0/8)' };
    }
    // Private Network 10.0.0.0/8
    if (parts[0] === 10) {
      return { isPrivate: true, type: 'PRIVATE_10', description: 'Private Local Network (10.0.0.0/8)' };
    }
    // Private Network 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
      return { isPrivate: true, type: 'PRIVATE_172', description: 'Private Subnet Network (172.16.0.0/12)' };
    }
    // Private Network 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) {
      return { isPrivate: true, type: 'PRIVATE_192', description: 'Private Home/Office Network (192.168.0.0/16)' };
    }
    // AWS / Cloud Link-Local Metadata (169.254.169.254)
    if (parts[0] === 169 && parts[1] === 254) {
      return { isPrivate: true, type: 'LINK_LOCAL_METADATA', description: 'Cloud Instance Link-Local Metadata Service (169.254.0.0/16)' };
    }
    // Carrier Grade NAT 100.64.0.0/10
    if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) {
      return { isPrivate: true, type: 'CGNAT', description: 'Carrier-Grade NAT (100.64.0.0/10)' };
    }
    // 0.0.0.0/8
    if (parts[0] === 0) {
      return { isPrivate: true, type: 'UNSPECIFIED', description: 'Unspecified Address (0.0.0.0)' };
    }
  }

  // IPv6 Private & Special Ranges
  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    if (normalized === '::1' || normalized === '0:0:0:0:0:0:0:1') {
      return { isPrivate: true, type: 'LOOPBACK_V6', description: 'IPv6 Loopback Address (::1)' };
    }
    if (normalized.startsWith('fe80:')) {
      return { isPrivate: true, type: 'LINK_LOCAL_V6', description: 'IPv6 Link-Local Address (fe80::/10)' };
    }
    if (normalized.startsWith('fc00:') || normalized.startsWith('fd00:')) {
      return { isPrivate: true, type: 'UNIQUE_LOCAL_V6', description: 'IPv6 Unique Local Address (fc00::/7)' };
    }
  }

  return { isPrivate: false, type: 'PUBLIC', description: 'Publicly Routable IP Address' };
}

/**
 * Validates target host for SSRF safety.
 * Returns information on whether outbound request should be restricted or handled safely.
 */
function isSsrfSafeHost(hostname) {
  if (!hostname) return { safe: false, reason: 'Empty host' };

  const lower = hostname.toLowerCase();

  // Localhost string checks
  if (lower === 'localhost' || lower.endsWith('.localhost') || lower.endsWith('.local') || lower.endsWith('.internal')) {
    return {
      safe: false,
      isLocal: true,
      reason: 'Host targets internal/local network name ("' + hostname + '")'
    };
  }

  // Direct IP check
  if (net.isIP(hostname)) {
    const ipCheck = checkIpRestricted(hostname);
    if (ipCheck.isPrivate) {
      return {
        safe: false,
        isLocal: true,
        ipType: ipCheck.type,
        reason: ipCheck.description
      };
    }
  }

  return { safe: true, isLocal: false };
}

module.exports = {
  checkIpRestricted,
  isSsrfSafeHost
};
