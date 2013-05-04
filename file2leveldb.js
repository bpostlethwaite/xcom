var crypto = require('crypto')
  , pwrd = ''
  , fs = require('fs')
  , splitStream = require('split')
  , levelup = require('levelup')
  , file = ""
  , algorithm = 'aes192'
  , inEnc = 'hex'
  , outEnc = 'utf8'


var db = levelup('/home/bpostlet/Dropbox/pxx', {'encoding': 'json'})


var fstream = fs.createReadStream(file)
var splitter = splitStream()
fstream.pipe(splitter)
splitter.on('data', function (data) {

  var field = data.split(',')
  var key = field[0].trim()
  var vobj = {}
  var values = field.slice(1)
  if (key.length > 0) {
    values.forEach( function (value, index) {
      if (value) {
        var fieldname = (index === 0) ? "user" :
          (index === 1) ? "pxx" : "other"
        var encrypt = crypto.createCipher(algorithm, pwrd)
        var car = encrypt.update(value.trim(), outEnc, inEnc)
        var cdr = encrypt.final(inEnc)
        vobj[fieldname] = car + cdr
      }
    })

    db.put(key, vobj, function (err) {
      if (err) return console.log('Ooops!', err) // some kind of I/O error
    })
  }
})
