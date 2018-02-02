let express = require('express')
const spdy = require('spdy')
const fs = require('fs')
let path = require('path')
let app = express()
let bodyParser = require('body-parser')
let helmet = require('helmet')
let checkMe = require('cookie-session')
const options = {
  key: fs.readFileSync(__dirname + '/keys/server.key'),
  cert: fs.readFileSync(__dirname + '/keys/server.crt')
}
let ENV = require('./config/env')
let env = ENV().raw.NODE_ENV
let {
  getBlogTemplate
} = require('./tools/tools')
const conf = require('./src/conf/conf')
let {
  getBlog
} = require('./db/database')
const pages = {
  dev: {
    title: 'ZemuldO.COM-Development',
    description: 'Software Development and Programming articles and insights',
    imgSRC: '/static/img/banners/cap.png'
  },
  tech: {
    title: 'ZemuldO.COM-Technology',
    description: 'Technology related articles and insights',
    imgSRC: '/static/img/banners/techBanner.jpg'
  },
  business: {
    title: 'ZemuldO.COM-Business',
    description: 'Business related articles',
    imgSRC: '/static/img/banners/cap.png'
  },
  reviews: {
    title: 'ZemuldO.COM-Reviews',
    description: 'Reviews on new products and devices',
    imgSRC: '/static/img/banners/cap.png'
  },
  tuts: {
    title: 'ZemuldO.COM-Tutorials',
    description: 'Tutorials on Trending technologies and languages',
    imgSRC: '/static/img/banners/cap.png'
  },
  home: {
    title: 'ZemuldO.COM',
    description: 'Best Place for your reading, Tech and Business articles. Here you find featured content on current technologies like BigData, ML, AI, Deep Learning, DataScience and more',
    imgSRC: '/static/img/banners/cap.png'
  }
}
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept')
  res.header('Allow-Control-Access-Method', 'GET')
  next()
})

app.use(bodyParser.json())
app.use(helmet())
app.set('x-powered-by', false)
app.set('X-Powered-By', false)
app.use(helmet.ieNoOpen())
app.use(helmet.xssFilter())
app.use(helmet.noSniff())
app.use(helmet({
  frameguard: false,
  noCache: true
}))
app.use(function (req, res, next) {
  console.log(req.url)
  next()
})

app.get('/*service-worker.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'service-worker.js'))
})
app.get('/*sw.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'sw.js'))
})
app.get('/*manifest.json', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'manifest.json'))
})
app.get('/static/*.js', function (req, res, next) {
  req.url = req.url + '.gz'
  res.set('Content-Encoding', 'gzip')
  res.set('Content-Type', 'text/javascript')
  next()
})
app.get('/static/*.css', function (req, res, next) {
  req.url = req.url + '.gz'
  res.set('Content-Encoding', 'gzip')
  res.set('Content-Type', 'text/css')
  next()
})
let expiryDate = new Date(Date.now() + 60 * 60 * 1000)
app.use(checkMe({
  name: 'session',
  keys: ['themati#@tripple26=n26gohb()@#$$#$THF$%^$FGDFRFU', '#$THF$%^$FGDFRFU26gohb()@#i#@tripple26='],
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'zemuldo.com',
    path: '/',
    expires: expiryDate
  }
}))
app.use(function (req, res, next) {
  if (req.url[req.url.length - 1] === '/' && req.url !== '/') {
    res.redirect(req.url.slice(0, req.url.length - 1))
  } else {
    next()
  }
})
app.use('/static', express.static(path.join(__dirname, 'build')))
app.use(function (req, res, next) {
  res.locals.ua = req.get('User-Agent')
  next()
})
app.get('/*', async function (req, res) {
  let url = req.url.split('/').join('')
  let query = {id:null}
  let blog = null
  let incomingPath = ''
  let page = url.split('/')[0]
  if (url.indexOf('-') !== -1) {
    incomingPath = url.split('-')
  }

  if (incomingPath) {
    query.id = Number(incomingPath[incomingPath.length - 1])
  }

  let details = null
  if (pages[page]) {
    details = {
      title: pages[page].title,
      description: pages[page].description,
      imgSRC: pages[page].imgSRC
    }
  } else {
    blog = await getBlog(query)
    if (blog) {
      details = {
        title: blog.title,
        description: blog.about,
        imgSRC: pages['home'].imgSRC
      }
    } else {
      details = {
        title: pages['home'].title,
        description: pages['home'].description,
        imgSRC: pages['home'].imgSRC
      }
    }
  }
  let botPattern = '(googlebot/|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)'
  let re = new RegExp(botPattern, 'i')
  if (re.test(res.locals.ua)) {
    let html = getBlogTemplate(details)
    res.send(html)
    console.log('the user agent is a crawler!')
  } else {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  }
})

// app.listen(conf[conf].httpPort, () => {
//   console.log("**Server started at http://localhost:" + conf[conf].httpPort)
// });
spdy
    .createServer(options, app)
    .listen(process.env.PORT, (error) => {
      if (error) {
        console.error(error)
        return process.exit(1)
      } else {
        console.log('Listening on port: ' + process.env.PORT + '.')
      }
    })