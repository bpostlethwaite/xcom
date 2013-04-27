var https = require('https')
  , http = require('http')
  , fs =    require('fs')
  , url = require('url')
  , st = require('st')
  , router = new require('routes').Router()

var SECURE = false

var staticOptions = {
  path: './static/'
, url: '/'
, index: 'index.html' // use 'index.html' file as the index
, dot: false // default: return 403 for any url with a dot-file part
, passthrough: false // calls next instead of returning a 404 error
}

var mount = st(staticOptions)

if (SECURE) {
  var Authoptions = {
    key:    fs.readFileSync('auth/ssl.key'),
    cert:   fs.readFileSync('auth/ssl.crt'),
    ca:     [fs.readFileSync('auth/ca.pem'), fs.readFileSync('auth/sub.class1.server.ca.pem')]
  }
  https.createServer(Authoptions, handler).listen(443)
  console.log("secure https server listening on port 443")

} else {

  http.createServer(handler).listen(8082)
  console.log("http server listening on port 8082")
}

function handler (req, res) {
  if (mount(req, res)) return //serve index.html
  else if (route(req, res)) return //route other requests
  else { // nothing worked
    // wtf?
    res.statusCode = 400
    res.end('bad')
  }
}

function route(req, res) {
  var urlp = url.parse(req.url, true)
  var go = router.match(urlp.path)
  if (go) return go.fn.apply(null, [req, res, urlp])
  else return false
}

router.addRoute("/authenticate", noop);

function noop() {
  var req = arguments[0]
    , res = arguments[1]
    , urlp = arguments[2]

  var data = ''

  if (req.method==="POST") {
    console.log("NOOP POST")
    req.on('data', function (chunk) {
      data += chunk
    })

    req.on("end", function() {
      var re =/^username=(.*)&password=(.*)$/;
      var match = data.match(re)
      console.log("username:", match[1])
      console.log("password:", match[2])
    })

    return true
  }

  return false
    //var json = qs.parse(data);
}
