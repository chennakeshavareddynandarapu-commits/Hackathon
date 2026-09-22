# SAVEE // Global AI Security & URL Risk Inspector

SAVEE is a high-fidelity, cyberpunk security investigation platform and global URL risk analyzer. Re-architected for dynamic multi-dimensional intelligence, SAVEE evaluates any user-supplied URL, domain, IP address, or internationalized Punycode target using live DNS resolution, TLS/HTTPS audit, HTTP security header inspection, redirect chain tracking, contextual phishing & brand impersonation detection, homoglyph/obfuscation analysis, and multi-provider threat intelligence aggregation.

---

## 🚀 Key Upgrades & Features

* **Global Dynamic Target Coverage:** Investigates arbitrary user-supplied URLs, registered domains, subdomains, raw IPv4/IPv6 addresses, Punycode targets (`xn--...`), and custom ports without relying on a hardcoded list of websites.
* **13-Dimension Security Pipeline:**
  1. **URL Normalization & Parsing:** Normalizes protocol, hostname, registered domain, subdomain, port, query params, and encoded characters.
  2. **SSRF & Network Safety:** Protects internal cloud/infrastructure by detecting loopback, private subnets (`10.x`, `172.16-31.x`, `192.168.x`), and link-local metadata IPs (`169.254.169.254`).
  3. **DNS Intelligence:** Resolves A, AAAA, MX, NS, TXT, and CNAME records via asynchronous DNS lookups.
  4. **TLS / HTTPS Audit:** Inspects SSL/TLS certificate validity, issuer, subject alternative names (SANs), expiration days remaining, and protocol security.
  5. **Redirect Tracking:** Follows up to 5 redirect hops, detecting HTTPS-to-HTTP security downgrades, cross-domain jumps, and circular loops.
  6. **HTTP & Cookie Security:** Audits security headers (`HSTS`, `CSP`, `X-Frame-Options`, `X-Content-Type-Options`) and cookie security flags (`HttpOnly`, `Secure`, `SameSite`).
  7. **Contextual Phishing Signals:** Evaluates keyword weight relative to domain boundaries (e.g. `paypal-login-secure.xyz` vs `example.com/login`).
  8. **Brand Impersonation Engine:** Detects unauthorized use of global brand trademarks outside legitimate registered domain boundaries.
  9. **Homoglyph & IDN Detection:** Identifies Punycode spoofing (`xn--...`) and non-ASCII Unicode visual character tricks.
  10. **URL Obfuscation:** Detects `@` user obscuring characters, excessive hyphens, consecutive slashes, and hex/dec IP encoding.
  11. **Multi-Source Threat Intelligence:** Integrates optional external providers (Google Safe Browsing, VirusTotal, URLScan, AbuseIPDB) alongside SAVEE's local intelligence core.
  12. **Analysis Confidence Metric:** Separates Risk Score (0–100) from Analysis Confidence Score (0–100%) so users know how much telemetry backed the verdict.
  13. **Target Reachability:** Classifies targets as `ONLINE`, `OFFLINE`, `DNS ERROR`, `LOCAL / PRIVATE TARGET`, or `UNREACHABLE`.

* **Cognitive Vocal Unit:** Audio synthesis verdict readouts and Web Speech Recognition for hands-free voice commands.
* **Inspection Ledger & Report Generator:** Persistent LocalStorage ledger with export options (JSON & formatted text reports).

---

## 🛠️ Technology Stack

* **Backend:** Node.js, Express.js, CORS, `dotenv`, built-in `dns`, `tls`, `http`, `https`, `url`, `net`
* **Frontend:** HTML5, Vanilla CSS3 (Cyberpunk design system, CSS grid, glassmorphism, animated scanlines), Vanilla JavaScript
* **APIs & Web Standards:** Web Speech Synthesis API, Web Speech Recognition API, Web LocalStorage

---

## 📁 Project Directory Structure

```text
savee-url-inspector/
├── public/
│   ├── index.html              # Cyberpunk Single Page Application
│   ├── css/
│   │   └── styles.css          # Design system, grid, glow & scanline styles
│   └── js/
│       ├── app.js              # Application entry point & event bindings
│       ├── scanner.js          # Scanner UI, terminal stream & score gauge controller
│       ├── voice.js            # Cognitive Vocal Unit (TTS & Voice recognition)
│       └── ledger.js           # LocalStorage inspection history manager
├── src/
│   ├── security/
│   │   ├── ssrfProtection.js   # SSRF safeguards & private IP classifier
│   │   └── validation.js       # URL normalizer & component parser
│   ├── scanner/
│   │   ├── dnsAnalyzer.js      # Asynchronous DNS record analyzer
│   │   ├── tlsAnalyzer.js      # TLS certificate & HTTPS inspector
│   │   ├── redirectAnalyzer.js # Safe redirect chain tracker
│   │   ├── headerAnalyzer.js   # HTTP security header & cookie inspector
│   │   └── phishingAnalyzer.js # Phishing, homoglyph, brand & obfuscation engine
│   ├── intelligence/
│   │   ├── brandDatabase.js    # Global brand database & impersonation rules
│   │   ├── tldDatabase.js      # TLD risk classification database
│   │   └── threatIntelManager.js # Multi-provider threat intelligence orchestrator
│   └── scoring/
│       └── riskEngine.js       # Correlation engine (Score, Verdict, Confidence)
├── server.js                   # Express Web Server & API gateway
├── package.json                # Project dependencies & scripts
├── .env.example                # Environment variables template
└── README.md                   # Project documentation
```

---

## 📥 Installation & Setup

1. **Clone/Extract Project:**
   ```bash
   cd Hackathon
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables (Optional):**
   Copy `.env.example` to `.env` and add optional external API keys:
   ```bash
   cp .env.example .env
   ```
4. **Start Application:**
   ```bash
   npm start
   ```
5. **Open Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🔌 API Reference

### 1. Health Status
* **Endpoint:** `/api/health` | **Method:** `GET`
* **Response:**
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-08-31T08:30:00.000Z",
    "uptime": 45.2,
    "system": "SAVEE AI Security & Global URL Inspector 2.0"
  }
  ```

### 2. URL Risk Scanner
* **Endpoint:** `/api/scan` | **Method:** `POST`
* **Request Body:** `{ "url": "paypal-login-secure.xyz" }`
* **Response:**
  ```json
  {
    "success": true,
    "url": "paypal-login-secure.xyz",
    "score": 90,
    "status": "Dangerous / Malicious",
    "confidence": 88,
    "targetStatus": "ONLINE",
    "checks": {
      "https": false,
      "suspiciousKeywords": true,
      "brandImpersonation": true
    },
    "details": [
      "Unencrypted connection (HTTP used instead of HTTPS) (+25)",
      "Possible PayPal brand impersonation on untrusted domain (+40)"
    ]
  }
  ```

### 3. Generate Security Report
* **Endpoint:** `/api/report` | **Method:** `POST`
* Downloads formatted TXT security investigation report.

---

## 🛡️ Security Disclaimer

SAVEE provides automated heuristic intelligence and threat correlation. A "Safe" score does not guarantee 100% immunity. Users should refrain from entering credentials or financial details into unknown third-party targets.
