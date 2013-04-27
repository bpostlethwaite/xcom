var https = require('https')      // module for https
, fs =    require('fs')           // required to read certs and keys
, auth = require('./auth')
, st = require('st')


var options = {
    key:    fs.readFileSync('auth/ssl.key'),
    cert:   fs.readFileSync('auth/ssl.crt'),
    ca:     [fs.readFileSync('auth/ca.pem'), fs.readFileSync('auth/sub.class1.server.ca.pem')]
}

https.createServer(options, function (req, res) {
    if (req.client.authorized) {
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end('{"status":"approved"}')
    } else {
        res.writeHead(401, {"Content-Type": "application/json"})
        res.end('{"status":"denied"}')
    }
}).listen(443)
