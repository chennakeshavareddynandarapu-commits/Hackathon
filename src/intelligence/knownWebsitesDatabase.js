/**
 * Database of Verified Top Global Websites & Popular Web Infrastructure Domains.
 * Used for verifying whether the target's middle domain/SLD belongs to an established legitimate global platform.
 */
const KNOWN_GLOBAL_WEBSITES = [
  // ─── Search Engines & Tech Giants ───────────────────────────────────────────
  { id: 'google',     name: 'Google',           domains: ['google', 'gmail', 'youtube', 'googlevideo', 'blogspot', 'withgoogle', 'gstatic', 'googleapis', 'googleusercontent', 'googlesyndication', 'doubleclick', 'ggpht', 'googleadservices', 'googletagmanager', 'googledomains'] },
  { id: 'microsoft',  name: 'Microsoft',         domains: ['microsoft', 'office', 'outlook', 'live', 'azure', 'bing', 'msn', 'windows', 'visualstudio', 'office365', 'onedrive', 'skype', 'xbox', 'microsoftonline', 'sharepoint', 'onenote', 'teams', 'msedge', 'windowsupdate', 'msftauth', 'azureedge', 'azurewebsites', 'powerapps', 'powerbi', 'dynamics'] },
  { id: 'apple',      name: 'Apple',             domains: ['apple', 'icloud', 'itunes', 'mzstatic', 'appleid'] },
  { id: 'amazon',     name: 'Amazon',            domains: ['amazon', 'aws', 'media-amazon', 'primevideo', 'amazonaws', 'alexa', 'twitch', 'audible', 'goodreads', 'imdb', 'woot', 'zappos'] },
  { id: 'meta',       name: 'Meta / Facebook',   domains: ['facebook', 'instagram', 'whatsapp', 'fb', 'meta', 'fbcdn', 'messenger', 'oculus', 'threads'] },
  { id: 'wikipedia',  name: 'Wikipedia',         domains: ['wikipedia', 'wikimedia', 'wiktionary', 'wikibooks', 'wikisource', 'wikinews', 'wikiversity', 'wikivoyage', 'wikidata', 'mediawiki'] },
  { id: 'baidu',      name: 'Baidu',             domains: ['baidu', 'baidubce', 'bdstatic'] },
  { id: 'yandex',     name: 'Yandex',            domains: ['yandex', 'ya', 'yandexcloud'] },
  { id: 'duckduckgo', name: 'DuckDuckGo',        domains: ['duckduckgo'] },

  // ─── Developer Platforms & Cloud Hosting ───────────────────────────────────
  { id: 'github',        name: 'GitHub',           domains: ['github', 'githubusercontent', 'githubpages', 'githubassets'] },
  { id: 'gitlab',        name: 'GitLab',           domains: ['gitlab'] },
  { id: 'bitbucket',     name: 'Bitbucket',        domains: ['bitbucket', 'atlassian', 'jira', 'confluence', 'trello', 'statuspage'] },
  { id: 'cloudflare',    name: 'Cloudflare',       domains: ['cloudflare', 'workers', 'cloudflareinsights', 'cloudflarestatus', 'cloudflare-dns'] },
  { id: 'vercel',        name: 'Vercel',           domains: ['vercel', 'now'] },
  { id: 'netlify',       name: 'Netlify',          domains: ['netlify'] },
  { id: 'heroku',        name: 'Heroku',           domains: ['heroku', 'herokuapp'] },
  { id: 'digitalocean',  name: 'DigitalOcean',     domains: ['digitalocean', 'digitaloceanspaces'] },
  { id: 'linode',        name: 'Linode / Akamai',  domains: ['linode', 'linodeobjects', 'akamai', 'akamaiedge', 'akamaihd'] },
  { id: 'openai',        name: 'OpenAI',           domains: ['openai', 'chatgpt'] },
  { id: 'anthropic',     name: 'Anthropic',        domains: ['anthropic', 'claude'] },
  { id: 'huggingface',   name: 'Hugging Face',     domains: ['huggingface'] },
  { id: 'docker',        name: 'Docker',           domains: ['docker', 'dockerhub'] },
  { id: 'stackoverflow', name: 'Stack Overflow',   domains: ['stackoverflow', 'stackexchange', 'sstatic', 'askubuntu', 'serverfault', 'superuser'] },
  { id: 'replit',        name: 'Replit',           domains: ['replit', 'repl'] },
  { id: 'codepen',       name: 'CodePen',          domains: ['codepen'] },
  { id: 'npmjs',         name: 'npm',              domains: ['npmjs', 'npm'] },
  { id: 'pypi',          name: 'PyPI',             domains: ['pypi'] },

  // ─── Cloud Providers ────────────────────────────────────────────────────────
  { id: 'ibm',    name: 'IBM Cloud',   domains: ['ibm', 'ibmcloud', 'bluemix'] },
  { id: 'oracle', name: 'Oracle Cloud',domains: ['oracle', 'oraclecloud', 'oraclevcn'] },
  { id: 'sap',    name: 'SAP',         domains: ['sap', 'hana'] },

  // ─── Financial, Payment & Banking ───────────────────────────────────────────
  { id: 'paypal',         name: 'PayPal',            domains: ['paypal', 'paypal-corp', 'paypalobjects', 'paypallabs'] },
  { id: 'stripe',         name: 'Stripe',            domains: ['stripe', 'stripecdn'] },
  { id: 'visa',           name: 'Visa',              domains: ['visa'] },
  { id: 'mastercard',     name: 'Mastercard',        domains: ['mastercard'] },
  { id: 'amex',           name: 'American Express',  domains: ['americanexpress', 'amex'] },
  { id: 'binance',        name: 'Binance',           domains: ['binance'] },
  { id: 'coinbase',       name: 'Coinbase',          domains: ['coinbase'] },
  { id: 'kraken',         name: 'Kraken',            domains: ['kraken'] },
  { id: 'kucoin',         name: 'KuCoin',            domains: ['kucoin'] },
  { id: 'etherscan',      name: 'Etherscan',         domains: ['etherscan'] },
  { id: 'ebay',           name: 'eBay',              domains: ['ebay', 'ebaystatic', 'ebaydesc', 'ebayimg'] },
  { id: 'shopify',        name: 'Shopify',           domains: ['shopify', 'myshopify', 'shopifycdn'] },
  { id: 'square',         name: 'Square',            domains: ['square', 'squareup'] },
  { id: 'wise',           name: 'Wise',              domains: ['wise', 'transferwise'] },
  { id: 'revolut',        name: 'Revolut',           domains: ['revolut'] },
  { id: 'bankofamerica',  name: 'Bank of America',   domains: ['bankofamerica'] },
  { id: 'chase',          name: 'Chase Bank',        domains: ['chase', 'jpmorgan'] },
  { id: 'wellsfargo',     name: 'Wells Fargo',       domains: ['wellsfargo'] },
  { id: 'citibank',       name: 'Citibank',          domains: ['citi', 'citibank', 'citigroup'] },
  { id: 'hsbc',           name: 'HSBC',              domains: ['hsbc'] },
  { id: 'barclays',       name: 'Barclays',          domains: ['barclays'] },
  { id: 'schwab',         name: 'Charles Schwab',    domains: ['schwab'] },
  { id: 'fidelity',       name: 'Fidelity',          domains: ['fidelity', 'fidelityinvestments'] },
  { id: 'robinhood',      name: 'Robinhood',         domains: ['robinhood'] },

  // ─── Social Media & Communication ───────────────────────────────────────────
  { id: 'x-twitter', name: 'X / Twitter', domains: ['twitter', 'x', 'twimg', 't'] },
  { id: 'linkedin',  name: 'LinkedIn',    domains: ['linkedin', 'licdn'] },
  { id: 'reddit',    name: 'Reddit',      domains: ['reddit', 'redditmedia', 'redditstatic', 'redd'] },
  { id: 'tiktok',    name: 'TikTok',      domains: ['tiktok', 'tiktokcdn', 'bytedance'] },
  { id: 'snapchat',  name: 'Snapchat',    domains: ['snapchat', 'snapkit', 'snap'] },
  { id: 'pinterest', name: 'Pinterest',   domains: ['pinterest', 'pinimg'] },
  { id: 'tumblr',    name: 'Tumblr',      domains: ['tumblr'] },
  { id: 'discord',   name: 'Discord',     domains: ['discord', 'discordapp', 'discordcdn'] },
  { id: 'slack',     name: 'Slack',       domains: ['slack', 'slackb'] },
  { id: 'telegram',  name: 'Telegram',    domains: ['telegram', 'telesco'] },
  { id: 'signal',    name: 'Signal',      domains: ['signal'] },
  { id: 'mastodon',  name: 'Mastodon',    domains: ['mastodon'] },
  { id: 'quora',     name: 'Quora',       domains: ['quora', 'qph'] },

  // ─── Streaming & Entertainment ──────────────────────────────────────────────
  { id: 'netflix',     name: 'Netflix',       domains: ['netflix', 'nflxso', 'nflximg', 'nflxvideo'] },
  { id: 'spotify',     name: 'Spotify',       domains: ['spotify', 'scdn', 'spotifycdn'] },
  { id: 'hulu',        name: 'Hulu',          domains: ['hulu', 'hulustream'] },
  { id: 'disney',      name: 'Disney+',       domains: ['disney', 'disneyplus', 'disneystreaming', 'bamgrid'] },
  { id: 'hbomax',      name: 'Max / HBO',     domains: ['hbo', 'hbomax', 'max'] },
  { id: 'peacock',     name: 'Peacock',       domains: ['peacocktv', 'peacock'] },
  { id: 'twitch',      name: 'Twitch',        domains: ['twitch', 'twitchapps', 'twitchsvc', 'jtvnw'] },
  { id: 'vimeo',       name: 'Vimeo',         domains: ['vimeo', 'vimeocdn'] },
  { id: 'dailymotion', name: 'Dailymotion',   domains: ['dailymotion', 'dmcdn'] },
  { id: 'soundcloud',  name: 'SoundCloud',    domains: ['soundcloud', 'sndcdn'] },
  { id: 'deezer',      name: 'Deezer',        domains: ['deezer'] },
  { id: 'pandora',     name: 'Pandora',       domains: ['pandora'] },
  { id: 'plex',        name: 'Plex',          domains: ['plex'] },
  { id: 'crunchyroll', name: 'Crunchyroll',   domains: ['crunchyroll'] },
  { id: 'roku',        name: 'Roku',          domains: ['roku'] },

  // ─── News & Media ───────────────────────────────────────────────────────────
  { id: 'yahoo',           name: 'Yahoo',              domains: ['yahoo', 'yimg', 'yahooinc'] },
  { id: 'nytimes',         name: 'NY Times',           domains: ['nytimes', 'nyti'] },
  { id: 'bbc',             name: 'BBC',                domains: ['bbc', 'bbci'] },
  { id: 'cnn',             name: 'CNN',                domains: ['cnn', 'turner'] },
  { id: 'theguardian',     name: 'The Guardian',       domains: ['theguardian', 'guardian'] },
  { id: 'reuters',         name: 'Reuters',            domains: ['reuters'] },
  { id: 'apnews',          name: 'AP News',            domains: ['apnews'] },
  { id: 'washingtonpost',  name: 'Washington Post',    domains: ['washingtonpost', 'wp'] },
  { id: 'forbes',          name: 'Forbes',             domains: ['forbes'] },
  { id: 'bloomberg',       name: 'Bloomberg',          domains: ['bloomberg', 'bwbx', 'businessweek'] },
  { id: 'wsj',             name: 'Wall Street Journal',domains: ['wsj', 'barrons', 'dowjones'] },
  { id: 'foxnews',         name: 'Fox News',           domains: ['foxnews', 'fox'] },
  { id: 'nbcnews',         name: 'NBC News',           domains: ['nbcnews', 'nbc', 'msnbc'] },
  { id: 'usatoday',        name: 'USA Today',          domains: ['usatoday'] },
  { id: 'medium',          name: 'Medium',             domains: ['medium'] },
  { id: 'substack',        name: 'Substack',           domains: ['substack'] },
  { id: 'vox',             name: 'Vox Media',          domains: ['vox', 'theverge', 'polygon', 'sbnation', 'eater'] },
  { id: 'huffpost',        name: 'HuffPost',           domains: ['huffpost', 'huffingtonpost'] },
  { id: 'buzzfeed',        name: 'BuzzFeed',           domains: ['buzzfeed'] },

  // ─── E-Commerce & Retail ────────────────────────────────────────────────────
  { id: 'walmart',    name: 'Walmart',    domains: ['walmart', 'walmartimages'] },
  { id: 'target',     name: 'Target',     domains: ['target'] },
  { id: 'bestbuy',    name: 'Best Buy',   domains: ['bestbuy'] },
  { id: 'costco',     name: 'Costco',     domains: ['costco'] },
  { id: 'etsy',       name: 'Etsy',       domains: ['etsy', 'etsystatic'] },
  { id: 'aliexpress', name: 'AliExpress', domains: ['aliexpress', 'alibaba', 'alipay', 'alicdn', 'taobao', 'tmall', 'aliyun'] },
  { id: 'flipkart',   name: 'Flipkart',   domains: ['flipkart', 'fkcdn'] },
  { id: 'wayfair',    name: 'Wayfair',    domains: ['wayfair'] },
  { id: 'ikea',       name: 'IKEA',       domains: ['ikea'] },
  { id: 'homedepot',  name: 'Home Depot', domains: ['homedepot'] },
  { id: 'newegg',     name: 'Newegg',     domains: ['newegg'] },
  { id: 'rakuten',    name: 'Rakuten',    domains: ['rakuten'] },

  // ─── Productivity & SaaS ────────────────────────────────────────────────────
  { id: 'notion',       name: 'Notion',       domains: ['notion'] },
  { id: 'airtable',     name: 'Airtable',     domains: ['airtable'] },
  { id: 'asana',        name: 'Asana',        domains: ['asana'] },
  { id: 'monday',       name: 'Monday.com',   domains: ['monday'] },
  { id: 'clickup',      name: 'ClickUp',      domains: ['clickup'] },
  { id: 'zendesk',      name: 'Zendesk',      domains: ['zendesk', 'zdassets'] },
  { id: 'salesforce',   name: 'Salesforce',   domains: ['salesforce', 'force', 'sfdcstatic', 'exacttarget', 'mktdns'] },
  { id: 'hubspot',      name: 'HubSpot',      domains: ['hubspot', 'hs-sites', 'hsforms', 'hubspotusercontent'] },
  { id: 'zoho',         name: 'Zoho',         domains: ['zoho', 'zohomail', 'zohodesk', 'zohopublic'] },
  { id: 'freshworks',   name: 'Freshworks',   domains: ['freshworks', 'freshdesk', 'freshservice'] },
  { id: 'intercom',     name: 'Intercom',     domains: ['intercom', 'intercomassets', 'intercomcdn'] },
  { id: 'mailchimp',    name: 'Mailchimp',    domains: ['mailchimp', 'list-manage', 'chimpstatic'] },
  { id: 'sendgrid',     name: 'SendGrid',     domains: ['sendgrid'] },
  { id: 'twilio',       name: 'Twilio',       domains: ['twilio'] },
  { id: 'docusign',     name: 'DocuSign',     domains: ['docusign'] },
  { id: 'dropbox',      name: 'Dropbox',      domains: ['dropbox', 'dropboxstatic', 'dropboxusercontent'] },
  { id: 'box',          name: 'Box',          domains: ['box'] },
  { id: 'evernote',     name: 'Evernote',     domains: ['evernote'] },
  { id: 'grammarly',    name: 'Grammarly',    domains: ['grammarly'] },
  { id: 'canva',        name: 'Canva',        domains: ['canva'] },
  { id: 'figma',        name: 'Figma',        domains: ['figma', 'figmacdn'] },
  { id: 'miro',         name: 'Miro',         domains: ['miro'] },
  { id: 'loom',         name: 'Loom',         domains: ['loom'] },
  { id: 'zoom',         name: 'Zoom',         domains: ['zoom', 'zoomgov'] },
  { id: 'webex',        name: 'Webex / Cisco',domains: ['webex', 'cisco', 'ciscospark'] },
  { id: 'typeform',     name: 'Typeform',     domains: ['typeform'] },
  { id: 'surveymonkey', name: 'SurveyMonkey', domains: ['surveymonkey'] },
  { id: 'squarespace',  name: 'Squarespace',  domains: ['squarespace', 'sqspcdn'] },
  { id: 'wix',          name: 'Wix',          domains: ['wix', 'wixstatic', 'wixsite'] },
  { id: 'wordpress',    name: 'WordPress',    domains: ['wordpress', 'wp', 'wpengine', 'wpseo'] },
  { id: 'ghost',        name: 'Ghost',        domains: ['ghost'] },

  // ─── Design, Media & Creative ───────────────────────────────────────────────
  { id: 'adobe',        name: 'Adobe',        domains: ['adobe', 'adobecc', 'adobespark', 'typekit', 'behance'] },
  { id: 'unsplash',     name: 'Unsplash',     domains: ['unsplash'] },
  { id: 'shutterstock', name: 'Shutterstock', domains: ['shutterstock'] },
  { id: 'gettyimages',  name: 'Getty Images', domains: ['gettyimages'] },
  { id: 'pexels',       name: 'Pexels',       domains: ['pexels'] },
  { id: 'pixabay',      name: 'Pixabay',      domains: ['pixabay'] },
  { id: 'dribbble',     name: 'Dribbble',     domains: ['dribbble'] },
  { id: 'deviantart',   name: 'DeviantArt',   domains: ['deviantart'] },
  { id: 'artstation',   name: 'ArtStation',   domains: ['artstation'] },

  // ─── Education & Research ───────────────────────────────────────────────────
  { id: 'coursera',     name: 'Coursera',     domains: ['coursera'] },
  { id: 'udemy',        name: 'Udemy',        domains: ['udemy', 'udemycdn'] },
  { id: 'edx',          name: 'edX',          domains: ['edx'] },
  { id: 'khanacademy',  name: 'Khan Academy', domains: ['khanacademy'] },
  { id: 'duolingo',     name: 'Duolingo',     domains: ['duolingo'] },
  { id: 'skillshare',   name: 'Skillshare',   domains: ['skillshare'] },
  { id: 'pluralsight',  name: 'Pluralsight',  domains: ['pluralsight', 'psod'] },
  { id: 'researchgate', name: 'ResearchGate', domains: ['researchgate'] },
  { id: 'arxiv',        name: 'arXiv',        domains: ['arxiv'] },
  { id: 'academia',     name: 'Academia.edu', domains: ['academia'] },
  { id: 'mit',          name: 'MIT',          domains: ['mit'] },
  { id: 'stanford',     name: 'Stanford',     domains: ['stanford'] },
  { id: 'harvard',      name: 'Harvard',      domains: ['harvard'] },

  // ─── Travel & Maps ──────────────────────────────────────────────────────────
  { id: 'mapbox',       name: 'Mapbox',         domains: ['mapbox', 'mapboxcdn'] },
  { id: 'openstreetmap',name: 'OpenStreetMap',  domains: ['openstreetmap'] },
  { id: 'here',         name: 'HERE Maps',      domains: ['here'] },
  { id: 'booking',      name: 'Booking.com',    domains: ['booking', 'bstatic'] },
  { id: 'airbnb',       name: 'Airbnb',         domains: ['airbnb'] },
  { id: 'expedia',      name: 'Expedia',        domains: ['expedia', 'hotels'] },
  { id: 'tripadvisor',  name: 'TripAdvisor',    domains: ['tripadvisor'] },
  { id: 'kayak',        name: 'Kayak',          domains: ['kayak'] },
  { id: 'skyscanner',   name: 'Skyscanner',     domains: ['skyscanner'] },
  { id: 'waze',         name: 'Waze',           domains: ['waze'] },

  // ─── Gaming ─────────────────────────────────────────────────────────────────
  { id: 'steam',       name: 'Steam / Valve',          domains: ['steam', 'steampowered', 'steamstatic', 'steamcommunity', 'valvesoftware', 'valve'] },
  { id: 'epicgames',   name: 'Epic Games',             domains: ['epicgames', 'fortnite', 'unrealengine'] },
  { id: 'riot',        name: 'Riot Games',             domains: ['riotgames', 'leagueoflegends', 'valorant'] },
  { id: 'blizzard',    name: 'Blizzard / Activision',  domains: ['blizzard', 'battle', 'battlenet', 'activision', 'callofduty'] },
  { id: 'ea',          name: 'EA / Origin',            domains: ['ea', 'origin', 'easports'] },
  { id: 'ubisoft',     name: 'Ubisoft',                domains: ['ubisoft', 'uplay'] },
  { id: 'gog',         name: 'GOG',                    domains: ['gog'] },
  { id: 'itch',        name: 'itch.io',                domains: ['itch'] },
  { id: 'roblox',      name: 'Roblox',                 domains: ['roblox', 'rbxcdn'] },
  { id: 'minecraft',   name: 'Minecraft / Mojang',     domains: ['minecraft', 'mojang'] },
  { id: 'nintendo',    name: 'Nintendo',               domains: ['nintendo'] },
  { id: 'playstation', name: 'PlayStation / Sony',     domains: ['playstation', 'sony', 'sonyentertainmentnetwork'] },
  { id: 'xbox',        name: 'Xbox',                   domains: ['xbox', 'xboxlive'] },

  // ─── Security & Privacy ─────────────────────────────────────────────────────
  { id: 'virustotal',     name: 'VirusTotal',    domains: ['virustotal'] },
  { id: 'haveibeenpwned', name: 'HaveIBeenPwned',domains: ['haveibeenpwned'] },
  { id: 'shodan',         name: 'Shodan',        domains: ['shodan'] },
  { id: 'malwarebytes',   name: 'Malwarebytes',  domains: ['malwarebytes'] },
  { id: 'kaspersky',      name: 'Kaspersky',     domains: ['kaspersky'] },
  { id: 'norton',         name: 'Norton',        domains: ['norton', 'nortonlifelock', 'lifelock'] },
  { id: 'avast',          name: 'Avast',         domains: ['avast'] },
  { id: 'bitdefender',    name: 'Bitdefender',   domains: ['bitdefender'] },
  { id: 'eset',           name: 'ESET',          domains: ['eset'] },
  { id: 'nordvpn',        name: 'NordVPN',       domains: ['nordvpn'] },
  { id: 'expressvpn',     name: 'ExpressVPN',    domains: ['expressvpn'] },
  { id: 'proton',         name: 'Proton',        domains: ['protonmail', 'proton', 'protondrive', 'protonvpn'] },
  { id: '1password',      name: '1Password',     domains: ['1password', 'agilebits'] },
  { id: 'lastpass',       name: 'LastPass',      domains: ['lastpass'] },
  { id: 'bitwarden',      name: 'Bitwarden',     domains: ['bitwarden'] },
  { id: 'dashlane',       name: 'Dashlane',      domains: ['dashlane'] },
  { id: 'okta',           name: 'Okta',          domains: ['okta', 'oktapreview'] },
  { id: 'auth0',          name: 'Auth0',         domains: ['auth0'] },

  // ─── Domain, DNS & Infrastructure ──────────────────────────────────────────
  { id: 'godaddy',    name: 'GoDaddy',      domains: ['godaddy', 'secureserver'] },
  { id: 'namecheap',  name: 'Namecheap',    domains: ['namecheap', 'registrar-servers'] },
  { id: 'porkbun',    name: 'Porkbun',      domains: ['porkbun'] },
  { id: 'fastly',     name: 'Fastly CDN',   domains: ['fastly', 'fastlylb'] },
  { id: 'sucuri',     name: 'Sucuri',       domains: ['sucuri'] },
  { id: 'incapsula',  name: 'Imperva',      domains: ['incapsula', 'imperva'] },

  // ─── Open Source & Communities ──────────────────────────────────────────────
  { id: 'mozilla',      name: 'Mozilla / Firefox',   domains: ['mozilla', 'firefox', 'moz'] },
  { id: 'apache',       name: 'Apache',              domains: ['apache'] },
  { id: 'debian',       name: 'Debian',              domains: ['debian'] },
  { id: 'ubuntu',       name: 'Ubuntu / Canonical',  domains: ['ubuntu', 'canonical', 'launchpad'] },
  { id: 'redhat',       name: 'Red Hat',             domains: ['redhat'] },
  { id: 'archlinux',    name: 'Arch Linux',          domains: ['archlinux'] },

  // ─── Email & Messaging Services ─────────────────────────────────────────────
  { id: 'fastmail',   name: 'Fastmail',          domains: ['fastmail'] },
  { id: 'tutanota',   name: 'Tuta / Tutanota',   domains: ['tutanota', 'tuta'] },
  { id: 'postmark',   name: 'Postmark',          domains: ['postmarkapp'] },
  { id: 'mailgun',    name: 'Mailgun',           domains: ['mailgun'] },
  { id: 'brevo',      name: 'Brevo / Sendinblue',domains: ['brevo', 'sendinblue'] },
  { id: 'sparkpost',  name: 'SparkPost',         domains: ['sparkpost'] },

  // ─── Healthcare ─────────────────────────────────────────────────────────────
  { id: 'webmd',      name: 'WebMD',       domains: ['webmd'] },
  { id: 'healthline', name: 'Healthline',  domains: ['healthline'] },
  { id: 'mayoclinic', name: 'Mayo Clinic', domains: ['mayoclinic'] },
  { id: 'nih',        name: 'NIH',         domains: ['nih', 'nlm', 'ncbi'] },
  { id: 'who',        name: 'WHO',         domains: ['who'] },
  { id: 'cdc',        name: 'CDC',         domains: ['cdc'] },

  // ─── Government & International Orgs ────────────────────────────────────────
  { id: 'un',    name: 'United Nations', domains: ['un', 'undp', 'unicef', 'unep'] },
  { id: 'icann', name: 'ICANN',          domains: ['icann'] },
  { id: 'iana',  name: 'IANA',           domains: ['iana'] },
  { id: 'ietf',  name: 'IETF',           domains: ['ietf'] },
  { id: 'w3c',   name: 'W3C',            domains: ['w3'] },

  // ─── Analytics & Marketing ──────────────────────────────────────────────────
  { id: 'segment',   name: 'Segment',   domains: ['segment', 'cdn.segment'] },
  { id: 'mixpanel',  name: 'Mixpanel',  domains: ['mixpanel'] },
  { id: 'hotjar',    name: 'Hotjar',    domains: ['hotjar'] },
  { id: 'amplitude', name: 'Amplitude', domains: ['amplitude'] },
  { id: 'heap',      name: 'Heap',      domains: ['heap'] },

  // ─── Sports Leagues & Governing Bodies ──────────────────────────────────────
  { id: 'nfl',         name: 'NFL (American Football)',   domains: ['nfl', 'nflcdn'] },
  { id: 'nba',         name: 'NBA (Basketball)',          domains: ['nba', 'nbcsports', 'nbagleague'] },
  { id: 'mlb',         name: 'MLB (Baseball)',            domains: ['mlb', 'mlbstatic'] },
  { id: 'nhl',         name: 'NHL (Ice Hockey)',          domains: ['nhl', 'nhlstatic'] },
  { id: 'nascar',      name: 'NASCAR',                   domains: ['nascar'] },
  { id: 'mls',         name: 'MLS (Major League Soccer)',domains: ['mlssoccer', 'mls'] },
  { id: 'fifa',        name: 'FIFA',                     domains: ['fifa'] },
  { id: 'uefa',        name: 'UEFA',                     domains: ['uefa'] },
  { id: 'premierleague', name: 'Premier League',         domains: ['premierleague'] },
  { id: 'laliga',      name: 'La Liga',                  domains: ['laliga'] },
  { id: 'bundesliga',  name: 'Bundesliga',               domains: ['bundesliga'] },
  { id: 'seriea',      name: 'Serie A',                  domains: ['legaseriea', 'seriea'] },
  { id: 'ligue1',      name: 'Ligue 1',                  domains: ['ligue1'] },
  { id: 'ipl',         name: 'IPL (Cricket)',            domains: ['iplt20', 'ipl'] },
  { id: 'bcci',        name: 'BCCI (Cricket)',           domains: ['bcci'] },
  { id: 'icc',         name: 'ICC (Cricket)',            domains: ['icc-cricket', 'icc'] },
  { id: 'espncricinfo', name: 'ESPNcricinfo',            domains: ['espncricinfo', 'cricinfo'] },
  { id: 'f1',          name: 'Formula 1',               domains: ['formula1', 'f1'] },
  { id: 'motogp',      name: 'MotoGP',                  domains: ['motogp'] },
  { id: 'indycar',     name: 'IndyCar',                 domains: ['indycar'] },
  { id: 'wwe',         name: 'WWE (Wrestling)',          domains: ['wwe'] },
  { id: 'ufc',         name: 'UFC (MMA)',               domains: ['ufc'] },
  { id: 'pga',         name: 'PGA Tour (Golf)',         domains: ['pga', 'pgachampionship', 'pgatour'] },
  { id: 'atp',         name: 'ATP (Tennis)',            domains: ['atptour', 'atp'] },
  { id: 'wta',         name: 'WTA (Tennis)',            domains: ['wtatennis', 'wta'] },
  { id: 'wimbledon',   name: 'Wimbledon',               domains: ['wimbledon'] },
  { id: 'olympics',    name: 'Olympics / IOC',          domains: ['olympics', 'ioc', 'olympic'] },

  // ─── Sports News & Media ─────────────────────────────────────────────────────
  { id: 'espn',        name: 'ESPN',                    domains: ['espn', 'espncdn', 'espnfc', 'espncricinfo'] },
  { id: 'skysports',   name: 'Sky Sports',             domains: ['skysports', 'sky'] },
  { id: 'btsport',     name: 'BT Sport / TNT Sports',  domains: ['btsport', 'tntsports'] },
  { id: 'theathletic', name: 'The Athletic',           domains: ['theathletic'] },
  { id: 'bleacherreport', name: 'Bleacher Report',     domains: ['bleacherreport'] },
  { id: 'sportsillustrated', name: 'Sports Illustrated', domains: ['si', 'sportsillustrated'] },
  { id: 'cbssports',   name: 'CBS Sports',             domains: ['cbssports'] },
  { id: 'foxsports',   name: 'Fox Sports',             domains: ['foxsports'] },
  { id: 'nbcsports',   name: 'NBC Sports',             domains: ['nbcsports'] },
  { id: 'goal',        name: 'Goal.com',               domains: ['goal'] },
  { id: 'transfermarkt', name: 'Transfermarkt',        domains: ['transfermarkt'] },
  { id: 'whoscored',   name: 'WhoScored',              domains: ['whoscored'] },
  { id: 'sofascore',   name: 'SofaScore',              domains: ['sofascore'] },
  { id: 'flashscore',  name: 'FlashScore',             domains: ['flashscore'] },
  { id: 'livescore',   name: 'LiveScore',              domains: ['livescore'] },
  { id: 'cricbuzz',    name: 'Cricbuzz',               domains: ['cricbuzz'] },
  { id: 'cricketworld', name: 'CricketWorld',          domains: ['cricketworld'] },

  // ─── Major Sports Clubs & Teams ─────────────────────────────────────────────
  { id: 'manutd',      name: 'Manchester United',      domains: ['manutd', 'manchesterunited'] },
  { id: 'mancity',     name: 'Manchester City',        domains: ['mancity'] },
  { id: 'chelsea',     name: 'Chelsea FC',             domains: ['chelseafc'] },
  { id: 'arsenal',     name: 'Arsenal FC',             domains: ['arsenal'] },
  { id: 'liverpool',   name: 'Liverpool FC',           domains: ['liverpoolfc'] },
  { id: 'tottenham',   name: 'Tottenham Hotspur',      domains: ['tottenhamhotspur', 'spurs'] },
  { id: 'realmadrid',  name: 'Real Madrid',            domains: ['realmadrid'] },
  { id: 'fcbarcelona', name: 'FC Barcelona',           domains: ['fcbarcelona'] },
  { id: 'juventus',    name: 'Juventus FC',            domains: ['juventus'] },
  { id: 'acmilan',     name: 'AC Milan',               domains: ['acmilan'] },
  { id: 'inter',       name: 'Inter Milan',            domains: ['inter'] },
  { id: 'psg',         name: 'Paris Saint-Germain',   domains: ['psg'] },
  { id: 'bvb',         name: 'Borussia Dortmund',     domains: ['bvb'] },
  { id: 'lakers',      name: 'LA Lakers',             domains: ['lakers', 'nba.com/lakers'] },
  { id: 'cowboys',     name: 'Dallas Cowboys',        domains: ['dallascowboys'] },
  { id: 'yankees',     name: 'New York Yankees',      domains: ['yankees'] },

  // ─── Sports Streaming & Ticketing ────────────────────────────────────────────
  { id: 'dazn',        name: 'DAZN',                  domains: ['dazn'] },
  { id: 'espnplus',    name: 'ESPN+',                 domains: ['espnplus', 'espn'] },
  { id: 'nflgamepass', name: 'NFL Game Pass',         domains: ['nflgamepass'] },
  { id: 'nba-league-pass', name: 'NBA League Pass',  domains: ['nba-league-pass'] },
  { id: 'ticketmaster', name: 'Ticketmaster',        domains: ['ticketmaster'] },
  { id: 'stubhub',     name: 'StubHub',              domains: ['stubhub'] },
  { id: 'seatgeek',    name: 'SeatGeek',             domains: ['seatgeek'] },
  { id: 'vividseats',  name: 'Vivid Seats',          domains: ['vividseats'] },

  // ─── Sports Betting & Fantasy ─────────────────────────────────────────────────
  { id: 'draftkings',  name: 'DraftKings',            domains: ['draftkings'] },
  { id: 'fanduel',     name: 'FanDuel',               domains: ['fanduel'] },
  { id: 'bet365',      name: 'Bet365',                domains: ['bet365'] },
  { id: 'betway',      name: 'Betway',                domains: ['betway'] },
  { id: 'williamhill', name: 'William Hill',          domains: ['williamhill'] },
  { id: 'betfair',     name: 'Betfair',               domains: ['betfair'] },
  { id: 'paddypower',  name: 'Paddy Power',           domains: ['paddypower'] },
  { id: 'ladbrokes',   name: 'Ladbrokes',             domains: ['ladbrokes'] },
  { id: 'bwin',        name: 'bwin',                  domains: ['bwin'] },
  { id: 'yahoo-fantasy', name: 'Yahoo Fantasy Sports', domains: ['yahoo-fantasy', 'yahoofantasy'] },
  { id: 'mlb-fantasy', name: 'MLB Fantasy',           domains: ['mlbfantasy'] },

  // ─── Sports Equipment & Apparel Brands ───────────────────────────────────────
  { id: 'nike',        name: 'Nike',                  domains: ['nike'] },
  { id: 'adidas',      name: 'Adidas',               domains: ['adidas'] },
  { id: 'puma',        name: 'Puma',                 domains: ['puma'] },
  { id: 'underarmour', name: 'Under Armour',         domains: ['underarmour'] },
  { id: 'newbalance',  name: 'New Balance',          domains: ['newbalance'] },
  { id: 'reebok',      name: 'Reebok',               domains: ['reebok'] },
  { id: 'asics',       name: 'ASICS',                domains: ['asics'] },
  { id: 'skechers',    name: 'Skechers',             domains: ['skechers'] },
  { id: 'wilson',      name: 'Wilson Sporting Goods',domains: ['wilson'] },
  { id: 'callaway',    name: 'Callaway Golf',        domains: ['callaway', 'callawaygolf'] },
  { id: 'titleist',    name: 'Titleist (Golf)',      domains: ['titleist'] },
  { id: 'yonex',       name: 'Yonex (Badminton/Tennis)', domains: ['yonex'] },
  { id: 'rawlings',    name: 'Rawlings (Baseball)',  domains: ['rawlings'] },
  { id: 'spalding',    name: 'Spalding',             domains: ['spalding'] },

  // ─── Fitness & Health Tracking ────────────────────────────────────────────────
  { id: 'strava',      name: 'Strava',               domains: ['strava'] },
  { id: 'garmin',      name: 'Garmin',               domains: ['garmin', 'garmincdn'] },
  { id: 'fitbit',      name: 'Fitbit',               domains: ['fitbit'] },
  { id: 'peloton',     name: 'Peloton',              domains: ['peloton', 'onepeloton'] },
  { id: 'whoop',       name: 'WHOOP',                domains: ['whoop'] },
  { id: 'polar',       name: 'Polar (Fitness)',      domains: ['polar'] },
  { id: 'myfitnesspal',name: 'MyFitnessPal',        domains: ['myfitnesspal'] },
  { id: 'runkeeper',   name: 'RunKeeper',            domains: ['runkeeper'] },
  { id: 'mapmyrun',    name: 'MapMyRun / UnderArmour', domains: ['mapmyrun', 'mapmyfitness'] },
  { id: 'nikerunning', name: 'Nike Run Club',        domains: ['nikerunning', 'nikeplus'] },
  { id: 'zwift',       name: 'Zwift (Cycling)',      domains: ['zwift'] },
  { id: 'trainerroad', name: 'TrainerRoad',          domains: ['trainerroad'] },
  { id: 'gymshark',    name: 'Gymshark',             domains: ['gymshark'] },
  { id: 'lululemon',   name: 'Lululemon',            domains: ['lululemon', 'lulu'] },
];

/**
 * Checks whether a given secondLevelDomain or middleDomain exists in the verified global website database.
 * @param {string} secondLevelDomain - Core SLD (e.g. "google", "paypal", "example")
 * @param {string} middleDomain - Full middle domain string (e.g. "login.paypal.example")
 * @returns {object} Match result
 */
function checkKnownWebsiteList(secondLevelDomain, middleDomain) {
  if (!secondLevelDomain) {
    return { isKnownWebsite: false, matchedSite: null, trustLevel: 'UNVERIFIED_DOMAIN', description: 'Unverified / Dynamic Target Domain' };
  }

  const sldLower = secondLevelDomain.toLowerCase();
  const middleLower = (middleDomain || '').toLowerCase();

  // 1. Direct match on Second-Level Domain
  for (const site of KNOWN_GLOBAL_WEBSITES) {
    if (site.domains.includes(sldLower)) {
      return {
        isKnownWebsite: true,
        matchedSite: site.name,
        trustLevel: 'VERIFIED_GLOBAL_WEBSITE',
        description: `Middle domain matches verified global website database (${site.name})`
      };
    }
  }

  // 2. Check if a known site name appears in middle domain while SLD is different (Potential Spoof)
  for (const site of KNOWN_GLOBAL_WEBSITES) {
    for (const d of site.domains) {
      if (middleLower.includes(d) && d !== sldLower) {
        return {
          isKnownWebsite: false,
          matchedSite: site.name,
          trustLevel: 'SUSPICIOUS_SPOOF_MATCH',
          description: `Known website name "${site.name}" detected in middle domain prefix, but core domain is "${secondLevelDomain}"`
        };
      }
    }
  }

  return {
    isKnownWebsite: false,
    matchedSite: null,
    trustLevel: 'UNVERIFIED_DYNAMIC_DOMAIN',
    description: 'Target middle domain is an unverified / dynamic web domain'
  };
}

/**
 * Verified Original Corporate Headquarters & Geolocation Database for Major Platforms.
 */
const WEBSITE_ORIGIN_LOCATIONS = {
  'google': { platform: 'Google / Alphabet', headquarters: 'Mountain View, California, United States', city: 'Mountain View', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.4220, lon: -122.0841, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '1998' },
  'microsoft': { platform: 'Microsoft Corporation', headquarters: 'Redmond, Washington, United States', city: 'Redmond', region: 'Washington', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 47.6740, lon: -122.1215, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '1975' },
  'apple': { platform: 'Apple Inc.', headquarters: 'Cupertino, California, United States', city: 'Cupertino', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.3349, lon: -122.0090, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters (Apple Park)', founded: '1976' },
  'amazon': { platform: 'Amazon.com, Inc.', headquarters: 'Seattle, Washington, United States', city: 'Seattle', region: 'Washington', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 47.6062, lon: -122.3321, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '1994' },
  'meta': { platform: 'Meta Platforms / Facebook', headquarters: 'Menlo Park, California, United States', city: 'Menlo Park', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.4538, lon: -122.1822, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2004' },
  'wikipedia': { platform: 'Wikimedia Foundation / Wikipedia', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7874, lon: -122.3996, timezone: 'America/Los_Angeles', originType: 'Global Non-Profit Headquarters', founded: '2001' },
  'baidu': { platform: 'Baidu, Inc.', headquarters: 'Beijing, China', city: 'Beijing', region: 'Beijing', country: 'China', countryCode: 'CN', flag: '🇨🇳', lat: 39.9042, lon: 116.4074, timezone: 'Asia/Shanghai', originType: 'Corporate Global Headquarters', founded: '2000' },
  'yandex': { platform: 'Yandex N.V.', headquarters: 'Moscow, Russia / Amsterdam, Netherlands', city: 'Moscow', region: 'Moscow', country: 'Russia', countryCode: 'RU', flag: '🇷🇺', lat: 55.7558, lon: 37.6173, timezone: 'Europe/Moscow', originType: 'Corporate Operational Headquarters', founded: '1997' },
  'duckduckgo': { platform: 'DuckDuckGo, Inc.', headquarters: 'Paoli, Pennsylvania, United States', city: 'Paoli', region: 'Pennsylvania', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 40.0426, lon: -75.4852, timezone: 'America/New_York', originType: 'Corporate Global Headquarters', founded: '2008' },
  'github': { platform: 'GitHub, Inc.', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2008' },
  'gitlab': { platform: 'GitLab Inc.', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2014' },
  'bitbucket': { platform: 'Atlassian / Bitbucket', headquarters: 'Sydney, New South Wales, Australia', city: 'Sydney', region: 'New South Wales', country: 'Australia', countryCode: 'AU', flag: '🇦🇺', lat: -33.8688, lon: 151.2093, timezone: 'Australia/Sydney', originType: 'Corporate Global Headquarters', founded: '2002' },
  'cloudflare': { platform: 'Cloudflare, Inc.', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2009' },
  'vercel': { platform: 'Vercel Inc.', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2015' },
  'netlify': { platform: 'Netlify, Inc.', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2014' },
  'heroku': { platform: 'Heroku / Salesforce', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Cloud Platform Headquarters', founded: '2007' },
  'digitalocean': { platform: 'DigitalOcean, LLC', headquarters: 'New York, New York, United States', city: 'New York', region: 'New York', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 40.7128, lon: -74.0060, timezone: 'America/New_York', originType: 'Corporate Global Headquarters', founded: '2011' },
  'linode': { platform: 'Linode / Akamai', headquarters: 'Philadelphia, Pennsylvania, United States', city: 'Philadelphia', region: 'Pennsylvania', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 39.9526, lon: -75.1652, timezone: 'America/New_York', originType: 'Cloud Operations HQ', founded: '2003' },
  'openai': { platform: 'OpenAI', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'AI Research Headquarters', founded: '2015' },
  'anthropic': { platform: 'Anthropic PBC', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'AI Safety & Research Headquarters', founded: '2021' },
  'huggingface': { platform: 'Hugging Face, Inc.', headquarters: 'New York, New York, United States / Paris, France', city: 'New York', region: 'New York', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 40.7128, lon: -74.0060, timezone: 'America/New_York', originType: 'Corporate Global Headquarters', founded: '2016' },
  'docker': { platform: 'Docker, Inc.', headquarters: 'Palo Alto, California, United States', city: 'Palo Alto', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.4419, lon: -122.1430, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2013' },
  'stackoverflow': { platform: 'Stack Overflow / Prosus', headquarters: 'New York, New York, United States', city: 'New York', region: 'New York', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 40.7128, lon: -74.0060, timezone: 'America/New_York', originType: 'Corporate Global Headquarters', founded: '2008' },
  'ibm': { platform: 'IBM (International Business Machines)', headquarters: 'Armonk, New York, United States', city: 'Armonk', region: 'New York', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 41.1070, lon: -73.7140, timezone: 'America/New_York', originType: 'Corporate Global Headquarters', founded: '1911' },
  'oracle': { platform: 'Oracle Corporation', headquarters: 'Austin, Texas, United States', city: 'Austin', region: 'Texas', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 30.2672, lon: -97.7431, timezone: 'America/Chicago', originType: 'Corporate Global Headquarters', founded: '1977' },
  'sap': { platform: 'SAP SE', headquarters: 'Walldorf, Baden-Württemberg, Germany', city: 'Walldorf', region: 'Baden-Württemberg', country: 'Germany', countryCode: 'DE', flag: '🇩🇪', lat: 49.3039, lon: 8.6439, timezone: 'Europe/Berlin', originType: 'Corporate Global Headquarters', founded: '1972' },
  'paypal': { platform: 'PayPal Holdings, Inc.', headquarters: 'San Jose, California, United States', city: 'San Jose', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.3382, lon: -121.8863, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '1998' },
  'stripe': { platform: 'Stripe, Inc.', headquarters: 'South San Francisco, California, United States / Dublin, Ireland', city: 'South San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.6547, lon: -122.4077, timezone: 'America/Los_Angeles', originType: 'Dual Global Headquarters', founded: '2010' },
  'visa': { platform: 'Visa Inc.', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '1958' },
  'mastercard': { platform: 'Mastercard Incorporated', headquarters: 'Purchase, New York, United States', city: 'Purchase', region: 'New York', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 41.0409, lon: -73.7132, timezone: 'America/New_York', originType: 'Corporate Global Headquarters', founded: '1966' },
  'shopify': { platform: 'Shopify Inc.', headquarters: 'Ottawa, Ontario, Canada', city: 'Ottawa', region: 'Ontario', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', lat: 45.4215, lon: -75.6972, timezone: 'America/Toronto', originType: 'Corporate Global Headquarters', founded: '2006' },
  'ebay': { platform: 'eBay Inc.', headquarters: 'San Jose, California, United States', city: 'San Jose', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.3382, lon: -121.8863, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '1995' },
  'wise': { platform: 'Wise plc', headquarters: 'London, England, United Kingdom', city: 'London', region: 'England', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London', originType: 'Corporate Global Headquarters', founded: '2011' },
  'revolut': { platform: 'Revolut Ltd', headquarters: 'London, England, United Kingdom', city: 'London', region: 'England', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London', originType: 'Corporate Global Headquarters', founded: '2015' },
  'coinbase': { platform: 'Coinbase Global, Inc.', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2012' },
  'binance': { platform: 'Binance Holdings', headquarters: 'George Town, Cayman Islands', city: 'George Town', region: 'Grand Cayman', country: 'Cayman Islands', countryCode: 'KY', flag: '🇰🇾', lat: 19.2869, lon: -81.3674, timezone: 'America/Cayman', originType: 'Global Web Entity Headquarters', founded: '2017' },
  'x-twitter': { platform: 'X Corp. / Twitter', headquarters: 'San Francisco, California / Bastrop, Texas, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2006' },
  'linkedin': { platform: 'LinkedIn Corporation', headquarters: 'Sunnyvale, California, United States', city: 'Sunnyvale', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.3688, lon: -122.0363, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2003' },
  'reddit': { platform: 'Reddit, Inc.', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2005' },
  'tiktok': { platform: 'TikTok / ByteDance', headquarters: 'Culver City, California, USA / Singapore', city: 'Culver City', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 34.0211, lon: -118.3965, timezone: 'America/Los_Angeles', originType: 'Global Operating Headquarters', founded: '2016' },
  'discord': { platform: 'Discord Inc.', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2015' },
  'slack': { platform: 'Slack Technologies / Salesforce', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2013' },
  'telegram': { platform: 'Telegram FZ-LLC', headquarters: 'Dubai, United Arab Emirates', city: 'Dubai', region: 'Dubai Emirate', country: 'United Arab Emirates', countryCode: 'AE', flag: '🇦🇪', lat: 25.2048, lon: 55.2708, timezone: 'Asia/Dubai', originType: 'Corporate Global Headquarters', founded: '2013' },
  'netflix': { platform: 'Netflix, Inc.', headquarters: 'Los Gatos, California, United States', city: 'Los Gatos', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.2266, lon: -121.9747, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '1997' },
  'spotify': { platform: 'Spotify Technology S.A.', headquarters: 'Stockholm, Sweden', city: 'Stockholm', region: 'Stockholm County', country: 'Sweden', countryCode: 'SE', flag: '🇸🇪', lat: 59.3293, lon: 18.0686, timezone: 'Europe/Stockholm', originType: 'Corporate Global Headquarters', founded: '2006' },
  'bbc': { platform: 'British Broadcasting Corporation (BBC)', headquarters: 'London, England, United Kingdom', city: 'London', region: 'England', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', lat: 51.5186, lon: -0.1437, timezone: 'Europe/London', originType: 'Broadcasting House Global HQ', founded: '1922' },
  'cnn': { platform: 'Cable News Network (CNN)', headquarters: 'Atlanta, Georgia, United States', city: 'Atlanta', region: 'Georgia', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 33.7490, lon: -84.3880, timezone: 'America/New_York', originType: 'Global Network Headquarters', founded: '1980' },
  'nytimes': { platform: 'The New York Times Company', headquarters: 'New York, New York, United States', city: 'New York', region: 'New York', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 40.7561, lon: -73.9903, timezone: 'America/New_York', originType: 'Corporate Global Headquarters', founded: '1851' },
  'walmart': { platform: 'Walmart Inc.', headquarters: 'Bentonville, Arkansas, United States', city: 'Bentonville', region: 'Arkansas', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 36.3729, lon: -94.2088, timezone: 'America/Chicago', originType: 'Corporate Global Headquarters', founded: '1962' },
  'aliexpress': { platform: 'Alibaba Group / AliExpress', headquarters: 'Hangzhou, Zhejiang, China', city: 'Hangzhou', region: 'Zhejiang', country: 'China', countryCode: 'CN', flag: '🇨🇳', lat: 30.2741, lon: 120.1551, timezone: 'Asia/Shanghai', originType: 'Corporate Global Headquarters', founded: '1999' },
  'flipkart': { platform: 'Flipkart Private Limited', headquarters: 'Bengaluru, Karnataka, India', city: 'Bengaluru', region: 'Karnataka', country: 'India', countryCode: 'IN', flag: '🇮🇳', lat: 12.9716, lon: 77.5946, timezone: 'Asia/Kolkata', originType: 'Corporate Operational Headquarters', founded: '2007' },
  'zoho': { platform: 'Zoho Corporation', headquarters: 'Chennai, Tamil Nadu, India', city: 'Chennai', region: 'Tamil Nadu', country: 'India', countryCode: 'IN', flag: '🇮🇳', lat: 12.8340, lon: 80.0480, timezone: 'Asia/Kolkata', originType: 'Corporate Global Headquarters', founded: '1996' },
  'freshworks': { platform: 'Freshworks Inc.', headquarters: 'San Mateo, California, USA / Chennai, India', city: 'San Mateo', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.5630, lon: -122.3255, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2010' },
  'notion': { platform: 'Notion Labs, Inc.', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2013' },
  'canva': { platform: 'Canva Pty Ltd', headquarters: 'Sydney, New South Wales, Australia', city: 'Sydney', region: 'New South Wales', country: 'Australia', countryCode: 'AU', flag: '🇦🇺', lat: -33.8830, lon: 151.2167, timezone: 'Australia/Sydney', originType: 'Corporate Global Headquarters', founded: '2012' },
  'figma': { platform: 'Figma, Inc.', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2012' },
  'zoom': { platform: 'Zoom Video Communications', headquarters: 'San Jose, California, United States', city: 'San Jose', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.3382, lon: -121.8863, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2011' },
  'adobe': { platform: 'Adobe Inc.', headquarters: 'San Jose, California, United States', city: 'San Jose', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.3382, lon: -121.8863, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '1982' },
  'coursera': { platform: 'Coursera, Inc.', headquarters: 'Mountain View, California, United States', city: 'Mountain View', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.3861, lon: -122.0839, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2012' },
  'udemy': { platform: 'Udemy, Inc.', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2010' },
  'duolingo': { platform: 'Duolingo, Inc.', headquarters: 'Pittsburgh, Pennsylvania, United States', city: 'Pittsburgh', region: 'Pennsylvania', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 40.4406, lon: -79.9959, timezone: 'America/New_York', originType: 'Corporate Global Headquarters', founded: '2011' },
  'harvard': { platform: 'Harvard University', headquarters: 'Cambridge, Massachusetts, United States', city: 'Cambridge', region: 'Massachusetts', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 42.3770, lon: -71.1167, timezone: 'America/New_York', originType: 'University Campus Origin', founded: '1636' },
  'mit': { platform: 'Massachusetts Institute of Technology (MIT)', headquarters: 'Cambridge, Massachusetts, United States', city: 'Cambridge', region: 'Massachusetts', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 42.3601, lon: -71.0942, timezone: 'America/New_York', originType: 'University Campus Origin', founded: '1861' },
  'stanford': { platform: 'Stanford University', headquarters: 'Stanford, California, United States', city: 'Stanford', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.4275, lon: -122.1697, timezone: 'America/Los_Angeles', originType: 'University Campus Origin', founded: '1885' },
  'airbnb': { platform: 'Airbnb, Inc.', headquarters: 'San Francisco, California, United States', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles', originType: 'Corporate Global Headquarters', founded: '2008' },
  'booking': { platform: 'Booking Holdings Inc.', headquarters: 'Amsterdam, North Holland, Netherlands', city: 'Amsterdam', region: 'North Holland', country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱', lat: 52.3676, lon: 4.9041, timezone: 'Europe/Amsterdam', originType: 'Global Operational Headquarters', founded: '1996' },
  'nintendo': { platform: 'Nintendo Co., Ltd.', headquarters: 'Kyoto, Japan', city: 'Kyoto', region: 'Kansai', country: 'Japan', countryCode: 'JP', flag: '🇯🇵', lat: 34.9698, lon: 135.7562, timezone: 'Asia/Tokyo', originType: 'Corporate Global Headquarters', founded: '1889' },
  'sony': { platform: 'Sony Group Corporation', headquarters: 'Minato, Tokyo, Japan', city: 'Tokyo', region: 'Kanto', country: 'Japan', countryCode: 'JP', flag: '🇯🇵', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo', originType: 'Corporate Global Headquarters', founded: '1946' },
  'proton': { platform: 'Proton AG', headquarters: 'Geneva, Switzerland', city: 'Geneva', region: 'Geneva Canton', country: 'Switzerland', countryCode: 'CH', flag: '🇨🇭', lat: 46.2044, lon: 6.1432, timezone: 'Europe/Zurich', originType: 'Corporate Global Headquarters', founded: '2014' },
  'mozilla': { platform: 'Mozilla Corporation', headquarters: 'Mountain View, California, United States', city: 'Mountain View', region: 'California', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.3861, lon: -122.0839, timezone: 'America/Los_Angeles', originType: 'Global Non-Profit & Tech HQ', founded: '1998' },
  'ipl': { platform: 'Indian Premier League (IPL) / BCCI', headquarters: 'Mumbai, Maharashtra, India', city: 'Mumbai', region: 'Maharashtra', country: 'India', countryCode: 'IN', flag: '🇮🇳', lat: 19.0760, lon: 72.8777, timezone: 'Asia/Kolkata', originType: 'Governing Sports League HQ (Wankhede)', founded: '2008' },
  'cricbuzz': { platform: 'Cricbuzz / Times Internet', headquarters: 'Bengaluru, Karnataka, India', city: 'Bengaluru', region: 'Karnataka', country: 'India', countryCode: 'IN', flag: '🇮🇳', lat: 12.9716, lon: 77.5946, timezone: 'Asia/Kolkata', originType: 'Operational Digital Media HQ', founded: '2004' }
};

/**
 * Authoritative National Origin Geolocation for Country-Code Top Level Domains (ccTLDs).
 */
const COUNTRY_TLD_ORIGINS = {
  'in': { country: 'India', countryCode: 'IN', flag: '🇮🇳', city: 'New Delhi', region: 'National Capital Territory', lat: 28.6139, lon: 77.2090, timezone: 'Asia/Kolkata' },
  'uk': { country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', city: 'London', region: 'England', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  'us': { country: 'United States', countryCode: 'US', flag: '🇺🇸', city: 'Washington, D.C.', region: 'District of Columbia', lat: 38.9072, lon: -77.0369, timezone: 'America/New_York' },
  'ca': { country: 'Canada', countryCode: 'CA', flag: '🇨🇦', city: 'Ottawa', region: 'Ontario', lat: 45.4215, lon: -75.6972, timezone: 'America/Toronto' },
  'au': { country: 'Australia', countryCode: 'AU', flag: '🇦🇺', city: 'Canberra', region: 'Australian Capital Territory', lat: -35.2809, lon: 149.1300, timezone: 'Australia/Sydney' },
  'de': { country: 'Germany', countryCode: 'DE', flag: '🇩🇪', city: 'Berlin', region: 'Berlin', lat: 52.5200, lon: 13.4050, timezone: 'Europe/Berlin' },
  'fr': { country: 'France', countryCode: 'FR', flag: '🇫🇷', city: 'Paris', region: 'Île-de-France', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
  'jp': { country: 'Japan', countryCode: 'JP', flag: '🇯🇵', city: 'Tokyo', region: 'Kanto', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
  'cn': { country: 'China', countryCode: 'CN', flag: '🇨🇳', city: 'Beijing', region: 'Beijing', lat: 39.9042, lon: 116.4074, timezone: 'Asia/Shanghai' },
  'br': { country: 'Brazil', countryCode: 'BR', flag: '🇧🇷', city: 'Brasília', region: 'Federal District', lat: -15.7975, lon: -47.8919, timezone: 'America/Sao_Paulo' },
  'sg': { country: 'Singapore', countryCode: 'SG', flag: '🇸🇬', city: 'Singapore', region: 'Central Region', lat: 1.3521, lon: 103.8198, timezone: 'Asia/Singapore' },
  'ch': { country: 'Switzerland', countryCode: 'CH', flag: '🇨🇭', city: 'Bern', region: 'Bern Canton', lat: 46.9480, lon: 7.4474, timezone: 'Europe/Zurich' },
  'nl': { country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱', city: 'Amsterdam', region: 'North Holland', lat: 52.3676, lon: 4.9041, timezone: 'Europe/Amsterdam' },
  'se': { country: 'Sweden', countryCode: 'SE', flag: '🇸🇪', city: 'Stockholm', region: 'Stockholm County', lat: 59.3293, lon: 18.0686, timezone: 'Europe/Stockholm' },
  'kr': { country: 'South Korea', countryCode: 'KR', flag: '🇰🇷', city: 'Seoul', region: 'Seoul Capital Area', lat: 37.5665, lon: 126.9780, timezone: 'Asia/Seoul' },
  'ru': { country: 'Russia', countryCode: 'RU', flag: '🇷🇺', city: 'Moscow', region: 'Central Federal District', lat: 55.7558, lon: 37.6173, timezone: 'Europe/Moscow' },
  'it': { country: 'Italy', countryCode: 'IT', flag: '🇮🇹', city: 'Rome', region: 'Lazio', lat: 41.9028, lon: 12.4964, timezone: 'Europe/Rome' },
  'es': { country: 'Spain', countryCode: 'ES', flag: '🇪🇸', city: 'Madrid', region: 'Community of Madrid', lat: 40.4168, lon: -3.7038, timezone: 'Europe/Madrid' },
  'ae': { country: 'United Arab Emirates', countryCode: 'AE', flag: '🇦🇪', city: 'Abu Dhabi', region: 'Abu Dhabi Emirate', lat: 24.4539, lon: 54.3773, timezone: 'Asia/Dubai' },
  'sa': { country: 'Saudi Arabia', countryCode: 'SA', flag: '🇸🇦', city: 'Riyadh', region: 'Riyadh Province', lat: 24.7136, lon: 46.6753, timezone: 'Asia/Riyadh' },
  'za': { country: 'South Africa', countryCode: 'ZA', flag: '🇿🇦', city: 'Pretoria', region: 'Gauteng', lat: -25.7479, lon: 28.2293, timezone: 'Africa/Johannesburg' },
  'nz': { country: 'New Zealand', countryCode: 'NZ', flag: '🇳🇿', city: 'Wellington', region: 'Wellington Region', lat: -41.2865, lon: 174.7762, timezone: 'Pacific/Auckland' },
  'ie': { country: 'Ireland', countryCode: 'IE', flag: '🇮🇪', city: 'Dublin', region: 'Leinster', lat: 53.3498, lon: -6.2603, timezone: 'Europe/Dublin' },
  'il': { country: 'Israel', countryCode: 'IL', flag: '🇮🇱', city: 'Jerusalem', region: 'Jerusalem District', lat: 31.7683, lon: 35.2137, timezone: 'Asia/Jerusalem' }
};

/**
 * Resolves the Authoritative Original Location / Headquarters for any website or domain.
 * @param {string} hostname - Target domain or hostname
 * @returns {object} Verified Original Location telemetry
 */
function getWebsiteOriginLocation(hostname) {
  if (!hostname || typeof hostname !== 'string') {
    return null;
  }

  const clean = hostname.toLowerCase().replace(/^[a-z]+:\/\//, '').split('/')[0].split(':')[0];
  const parts = clean.split('.');

  // 1. Check known websites database match
  for (const site of KNOWN_GLOBAL_WEBSITES) {
    for (const d of site.domains) {
      if (parts.includes(d) || clean === d || clean.startsWith(`${d}.`) || clean.endsWith(`.${d}`)) {
        const origin = WEBSITE_ORIGIN_LOCATIONS[site.id];
        if (origin) {
          return {
            isKnownWebsite: true,
            platform: origin.platform,
            headquarters: origin.headquarters,
            city: origin.city,
            region: origin.region,
            country: origin.country,
            countryCode: origin.countryCode,
            flag: origin.flag,
            lat: origin.lat,
            lon: origin.lon,
            timezone: origin.timezone,
            originType: origin.originType,
            founded: origin.founded,
            source: 'VERIFIED_CORPORATE_HEADQUARTERS'
          };
        }
      }
    }
  }

  // 2. Check Country-Code Top Level Domain (ccTLD)
  const lastPart = parts[parts.length - 1];
  const secondLastPart = parts.length > 1 ? parts[parts.length - 2] : null;

  let matchedTld = COUNTRY_TLD_ORIGINS[lastPart] || (secondLastPart ? COUNTRY_TLD_ORIGINS[secondLastPart] : null);
  if (matchedTld) {
    return {
      isKnownWebsite: false,
      platform: `${clean.toUpperCase()}`,
      headquarters: `${matchedTld.city}, ${matchedTld.country}`,
      city: matchedTld.city,
      region: matchedTld.region,
      country: matchedTld.country,
      countryCode: matchedTld.countryCode,
      flag: matchedTld.flag,
      lat: matchedTld.lat,
      lon: matchedTld.lon,
      timezone: matchedTld.timezone,
      originType: `National ccTLD Origin (.${lastPart})`,
      source: 'AUTHORITATIVE_CCTLD_REGISTRY'
    };
  }

  // 3. Special gTLDs (.gov, .mil, .edu)
  if (clean.endsWith('.gov') || clean.endsWith('.mil')) {
    return {
      isKnownWebsite: false,
      platform: 'United States Government',
      headquarters: 'Washington, D.C., United States',
      city: 'Washington, D.C.',
      region: 'District of Columbia',
      country: 'United States',
      countryCode: 'US',
      flag: '🇺🇸',
      lat: 38.9072,
      lon: -77.0369,
      timezone: 'America/New_York',
      originType: 'Federal Government Authority',
      source: 'US_GOVERNMENT_REGISTRY'
    };
  }

  if (clean.endsWith('.edu')) {
    return {
      isKnownWebsite: false,
      platform: 'Higher Education Institution',
      headquarters: 'United States Academic Network',
      city: 'Academic Institution',
      region: 'Accredited Higher Education',
      country: 'United States',
      countryCode: 'US',
      flag: '🇺🇸',
      lat: 38.9072,
      lon: -77.0369,
      timezone: 'America/New_York',
      originType: 'Accredited Higher Education Institution',
      source: 'EDUCAUSE_REGISTRY'
    };
  }

  return null;
}

module.exports = {
  KNOWN_GLOBAL_WEBSITES,
  WEBSITE_ORIGIN_LOCATIONS,
  COUNTRY_TLD_ORIGINS,
  checkKnownWebsiteList,
  getWebsiteOriginLocation
};
