var levelup = require('levelup')
  , db = levelup(process.env.HOME + '/Dropbox/pxx', {encoding: 'json'})
  , net = require('net')
  , levnet = require('levelnet')

var PORT = 9988
  , server = net.createServer(handler).listen(PORT)

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


