var https = require('https')
  , http = require('http')
  , fs =    require('fs')
  , url = require('url')
  , st = require('st')
  , router = new require('routes').Router()
  , auth = require('./levelauth.js')
  , genKey = require('uid')

var SECURE = false

var staticOptions = {
  path: './static/'
, url: '/'
, index: 'index.html' // use 'index.html' file as the index
, dot: false // default: return 403 for any url with a dot-file part
, passthrough: false // calls next instead of returning a 404 error
}

var mount = st(staticOptions)
var keyring = [] // Keyring for monitoring allowed requests
/*
 * CREATE SERVERS
 *
 */
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
/*
 * RESPONSE HANDLER
 *
 */
function handler (req, res) {
  if (mount(req, res)) return //serve index.html
  else if (route(req, res)) return //route other requests
  else { // nothing worked
    // wtf?
    res.statusCode = 400
    res.end('bad')
  }
}
/*
 * ROUTER
 *
 */
function route(req, res) {
  var urlp = url.parse(req.url, true)
  var go = router.match(urlp.path)
  if (go) return go.fn.apply(null, [req, res, urlp])
  else return false
}

router.addRoute("/authenticate", login);

/*
 * Router Logic
 * Test API with
 * curl -X POST -d "username=Ben&password=secret" localhost:8082/authenticate()
 * etc
 */

function login() {
  var req = arguments[0]
    , res = arguments[1]
    , urlp = arguments[2]

  var data = ''

  if (req.method==="POST") {
    req.on('data', function (chunk) {
      data += chunk
    })

    req.on("end", function() {
      var re =/^username=(.*)&password=(.*)$/;
      var match = data.match(re)
      auth(match[1], match[2], handlelogin(res))

    })


    return true
  }

  return false
    //var json = qs.parse(data);
}

function handlelogin(res) {
  var minutes = 1000*60
  return function (loginStatus) {
    var passKey = null
    if (loginStatus) {
      passKey = genKey()
      keyring.push(passKey)
      setTimeout( invalidate(passKey), 2*minutes )
    }
    res.writeHead(200, {"Content-Type": "application/json"})
    var responseObject = {
      authenticated: loginStatus
    , passKey: passKey
    }
    res.write(JSON.stringify(responseObject))
    res.end()
  }
}

function invalidate(key) {
  keyring.filter( function(k) {return k !== key})
}