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

module.exports = {
  KNOWN_GLOBAL_WEBSITES,
  checkKnownWebsiteList
};
