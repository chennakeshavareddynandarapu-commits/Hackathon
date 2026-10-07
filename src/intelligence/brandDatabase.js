/**
 * Database of known global brands and their official legitimate registered domains.
 * Used for detecting brand impersonation and typo-squatting phishing attacks.
 */
const BRAND_DATABASE = [
  // ─── Tech Giants ────────────────────────────────────────────────────────────
  { name: 'Google',     keywords: ['google', 'gmail', 'youtube'],                  officialDomains: ['google.com', 'gmail.com', 'youtube.com', 'goo.gl', 'googleapis.com'] },
  { name: 'Microsoft',  keywords: ['microsoft', 'office365', 'outlook', 'hotmail', 'onedrive', 'azure', 'teams', 'sharepoint'], officialDomains: ['microsoft.com', 'office.com', 'outlook.com', 'live.com', 'azure.com', 'microsoftonline.com'] },
  { name: 'Apple',      keywords: ['apple', 'icloud', 'itunes', 'applestore'],     officialDomains: ['apple.com', 'icloud.com', 'me.com', 'itunes.com'] },
  { name: 'Amazon',     keywords: ['amazon', 'aws', 'primevideo'],                 officialDomains: ['amazon.com', 'amazonaws.com', 'primevideo.com', 'aws.amazon.com'] },
  { name: 'OpenAI',     keywords: ['openai', 'chatgpt', 'openai-api'],             officialDomains: ['openai.com', 'chatgpt.com'] },
  { name: 'Anthropic',  keywords: ['anthropic', 'claude'],                         officialDomains: ['anthropic.com', 'claude.ai'] },

  // ─── Social Media ────────────────────────────────────────────────────────────
  { name: 'Meta / Facebook', keywords: ['facebook', 'instagram', 'whatsapp', 'meta', 'oculus'], officialDomains: ['facebook.com', 'instagram.com', 'whatsapp.com', 'meta.com', 'fb.com'] },
  { name: 'Twitter / X',    keywords: ['twitter', 'x.com'],   officialDomains: ['twitter.com', 'x.com', 'twimg.com'] },
  { name: 'LinkedIn',        keywords: ['linkedin'],           officialDomains: ['linkedin.com', 'licdn.com'] },
  { name: 'TikTok',          keywords: ['tiktok', 'bytedance'],officialDomains: ['tiktok.com', 'tiktokcdn.com'] },
  { name: 'Snapchat',        keywords: ['snapchat', 'snap'],   officialDomains: ['snapchat.com', 'snap.com'] },
  { name: 'Pinterest',       keywords: ['pinterest'],          officialDomains: ['pinterest.com', 'pinimg.com'] },
  { name: 'Reddit',          keywords: ['reddit'],             officialDomains: ['reddit.com', 'redd.it'] },
  { name: 'Discord',         keywords: ['discord'],            officialDomains: ['discord.com', 'discordapp.com', 'discord.gg'] },
  { name: 'Telegram',        keywords: ['telegram'],           officialDomains: ['telegram.org', 't.me'] },

  // ─── Financial & Banking ────────────────────────────────────────────────────
  { name: 'PayPal',           keywords: ['paypal', 'pay-pal'],         officialDomains: ['paypal.com', 'paypal.me'] },
  { name: 'Stripe',           keywords: ['stripe'],                    officialDomains: ['stripe.com'] },
  { name: 'Wise',             keywords: ['wise', 'transferwise'],      officialDomains: ['wise.com', 'transferwise.com'] },
  { name: 'Revolut',          keywords: ['revolut'],                   officialDomains: ['revolut.com'] },
  { name: 'Visa',             keywords: ['visa'],                      officialDomains: ['visa.com'] },
  { name: 'Mastercard',       keywords: ['mastercard'],                officialDomains: ['mastercard.com'] },
  { name: 'American Express', keywords: ['americanexpress', 'amex'],  officialDomains: ['americanexpress.com'] },
  { name: 'Bank of America',  keywords: ['bankofamerica', 'bofa'],    officialDomains: ['bankofamerica.com'] },
  { name: 'Chase Bank',       keywords: ['chase', 'chasebank'],       officialDomains: ['chase.com', 'jpmorgan.com'] },
  { name: 'Wells Fargo',      keywords: ['wellsfargo'],               officialDomains: ['wellsfargo.com'] },
  { name: 'Citibank',         keywords: ['citi', 'citibank'],         officialDomains: ['citi.com', 'citibank.com'] },
  { name: 'HSBC',             keywords: ['hsbc'],                     officialDomains: ['hsbc.com'] },
  { name: 'Barclays',         keywords: ['barclays'],                 officialDomains: ['barclays.com'] },
  { name: 'Fidelity',         keywords: ['fidelity'],                 officialDomains: ['fidelity.com'] },
  { name: 'Robinhood',        keywords: ['robinhood'],                officialDomains: ['robinhood.com'] },

  // ─── Crypto & Web3 ──────────────────────────────────────────────────────────
  { name: 'Binance',   keywords: ['binance', 'bnb'],    officialDomains: ['binance.com', 'binance.us'] },
  { name: 'Coinbase',  keywords: ['coinbase'],          officialDomains: ['coinbase.com'] },
  { name: 'Kraken',    keywords: ['kraken'],            officialDomains: ['kraken.com'] },
  { name: 'KuCoin',    keywords: ['kucoin'],            officialDomains: ['kucoin.com'] },
  { name: 'MetaMask',  keywords: ['metamask'],          officialDomains: ['metamask.io'] },
  { name: 'OpenSea',   keywords: ['opensea'],           officialDomains: ['opensea.io'] },
  { name: 'Etherscan', keywords: ['etherscan'],         officialDomains: ['etherscan.io'] },

  // ─── Streaming & Entertainment ──────────────────────────────────────────────
  { name: 'Netflix',    keywords: ['netflix'],              officialDomains: ['netflix.com', 'nflxso.net'] },
  { name: 'Spotify',    keywords: ['spotify'],              officialDomains: ['spotify.com', 'scdn.co'] },
  { name: 'Disney+',    keywords: ['disney', 'disneyplus'], officialDomains: ['disneyplus.com', 'disney.com'] },
  { name: 'Hulu',       keywords: ['hulu'],                 officialDomains: ['hulu.com'] },
  { name: 'Max / HBO',  keywords: ['hbo', 'hbomax'],        officialDomains: ['max.com', 'hbo.com', 'hbomax.com'] },
  { name: 'YouTube',    keywords: ['youtube'],              officialDomains: ['youtube.com', 'youtu.be'] },
  { name: 'Twitch',     keywords: ['twitch'],               officialDomains: ['twitch.tv', 'twitchapps.com'] },

  // ─── E-Commerce & Retail ────────────────────────────────────────────────────
  { name: 'eBay',      keywords: ['ebay'],        officialDomains: ['ebay.com', 'ebaystatic.com'] },
  { name: 'Shopify',   keywords: ['shopify'],     officialDomains: ['shopify.com', 'myshopify.com'] },
  { name: 'Etsy',      keywords: ['etsy'],        officialDomains: ['etsy.com'] },
  { name: 'Walmart',   keywords: ['walmart'],     officialDomains: ['walmart.com'] },
  { name: 'Flipkart',  keywords: ['flipkart'],    officialDomains: ['flipkart.com'] },
  { name: 'AliExpress',keywords: ['aliexpress', 'alibaba', 'alipay'], officialDomains: ['aliexpress.com', 'alibaba.com', 'alipay.com'] },

  // ─── Cloud & Dev Tools ──────────────────────────────────────────────────────
  { name: 'GitHub',        keywords: ['github'],        officialDomains: ['github.com', 'githubusercontent.com'] },
  { name: 'GitLab',        keywords: ['gitlab'],        officialDomains: ['gitlab.com'] },
  { name: 'Cloudflare',    keywords: ['cloudflare'],    officialDomains: ['cloudflare.com', 'workers.dev'] },
  { name: 'Dropbox',       keywords: ['dropbox'],       officialDomains: ['dropbox.com', 'dropboxusercontent.com'] },
  { name: 'Zoom',          keywords: ['zoom'],          officialDomains: ['zoom.us', 'zoomgov.com'] },
  { name: 'Slack',         keywords: ['slack'],         officialDomains: ['slack.com'] },
  { name: 'Notion',        keywords: ['notion'],        officialDomains: ['notion.so', 'notion.com'] },
  { name: 'Figma',         keywords: ['figma'],         officialDomains: ['figma.com'] },
  { name: 'Adobe',         keywords: ['adobe', 'adobecc', 'acrobat'], officialDomains: ['adobe.com', 'adobecc.com'] },
  { name: 'Atlassian',     keywords: ['atlassian', 'jira', 'confluence', 'trello'], officialDomains: ['atlassian.com', 'jira.com', 'trello.com', 'confluence.com'] },
  { name: 'Salesforce',    keywords: ['salesforce', 'pardot'],  officialDomains: ['salesforce.com', 'force.com'] },
  { name: 'HubSpot',       keywords: ['hubspot'],               officialDomains: ['hubspot.com'] },
  { name: 'Okta',          keywords: ['okta'],                  officialDomains: ['okta.com', 'oktapreview.com'] },

  // ─── Gaming ─────────────────────────────────────────────────────────────────
  { name: 'Steam',       keywords: ['steam', 'steampowered'],   officialDomains: ['steampowered.com', 'store.steampowered.com', 'steamcommunity.com'] },
  { name: 'Epic Games',  keywords: ['epicgames', 'fortnite'],   officialDomains: ['epicgames.com', 'fortnite.com'] },
  { name: 'Roblox',      keywords: ['roblox'],                  officialDomains: ['roblox.com'] },
  { name: 'Riot Games',  keywords: ['riotgames', 'leagueoflegends', 'valorant'], officialDomains: ['riotgames.com', 'leagueoflegends.com', 'playvalorant.com'] },
  { name: 'Blizzard',    keywords: ['blizzard', 'battlenet'],   officialDomains: ['blizzard.com', 'battle.net'] },
  { name: 'Nintendo',    keywords: ['nintendo'],                officialDomains: ['nintendo.com'] },
  { name: 'PlayStation', keywords: ['playstation', 'psn'],      officialDomains: ['playstation.com', 'playstation.net'] },

  // ─── Security & Privacy ─────────────────────────────────────────────────────
  { name: 'NordVPN',    keywords: ['nordvpn'],    officialDomains: ['nordvpn.com'] },
  { name: 'ExpressVPN', keywords: ['expressvpn'],  officialDomains: ['expressvpn.com'] },
  { name: 'Proton',     keywords: ['proton', 'protonmail', 'protonvpn'], officialDomains: ['proton.me', 'protonmail.com', 'protonvpn.com'] },
  { name: '1Password',  keywords: ['1password'],  officialDomains: ['1password.com'] },
  { name: 'LastPass',   keywords: ['lastpass'],   officialDomains: ['lastpass.com'] },
  { name: 'Bitwarden',  keywords: ['bitwarden'],  officialDomains: ['bitwarden.com'] },

  // ─── Other Major Brands ─────────────────────────────────────────────────────
  { name: 'Wikipedia',  keywords: ['wikipedia'],  officialDomains: ['wikipedia.org', 'wikimedia.org'] },
  { name: 'WordPress',  keywords: ['wordpress'],  officialDomains: ['wordpress.com', 'wordpress.org', 'wp.com'] },
  { name: 'Airbnb',     keywords: ['airbnb'],     officialDomains: ['airbnb.com'] },
  { name: 'Booking.com',keywords: ['booking'],    officialDomains: ['booking.com'] },
  { name: 'Duolingo',   keywords: ['duolingo'],   officialDomains: ['duolingo.com'] },
  { name: 'Canva',      keywords: ['canva'],      officialDomains: ['canva.com'] },
  { name: 'Grammarly',  keywords: ['grammarly'],  officialDomains: ['grammarly.com'] },
];

/**
 * Checks for brand impersonation in a given target.
 * @param {string} hostname - Target hostname
 * @param {string} registeredDomain - Extracted registered domain
 * @param {string} fullUrl - Full input URL
 */
function detectBrandImpersonation(hostname, registeredDomain, fullUrl) {
  const result = {
    impersonationDetected: false,
    matchedBrand: null,
    reason: null,
    riskWeight: 0
  };

  const lowerHost = hostname.toLowerCase();
  const lowerUrl = fullUrl.toLowerCase();

  for (const brand of BRAND_DATABASE) {
    for (const kw of brand.keywords) {
      if (lowerHost.includes(kw) || lowerUrl.includes(kw)) {
        // Is the registered domain one of the official domains?
        const isOfficial = brand.officialDomains.some(official => registeredDomain === official || hostname.endsWith('.' + official));

        if (!isOfficial) {
          result.impersonationDetected = true;
          result.matchedBrand = brand.name;
          result.reason = `Possible ${brand.name} brand impersonation. Brand keyword "${kw}" detected on untrusted domain "${registeredDomain}".`;
          result.riskWeight = 40;
          return result;
        }
      }
    }
  }

  return result;
}

module.exports = {
  BRAND_DATABASE,
  detectBrandImpersonation
};
