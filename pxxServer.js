var levelup = require('levelup')
  , db = levelup('./pxx', {encoding: 'json'})
  , net = require('net')
  , levnet = require('levelnet')

var PORT = 5555
  , server = net.createServer(handler).listen(PORT)

console.log("levelUP server listening on port", PORT)

function handler(stream) {

  var lev = levnet.server(db)

  stream.pipe(lev).pipe(stream)

  lev.on('error', function () {
    stream.destroy()
  })
  stream.on('error', function () {
    lev.destroy()
  })
}
