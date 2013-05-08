/*
 * Cryptographic encyption and decrpytion stream
 * for JSON object keys and values
 */
var Transform = require('stream').Transform
  , crypto = require('crypto') // todo: Need a browser compliant alternative


var _transform = function(dbobj, encoding, callback) {

  var self = this
  Object.keys(dbobj.value).forEach( function (key) {
    var crypt = self.crypt(self.alg, self.pwd)
    var car = crypt.update(dbobj.value[key], self.inEnc, self.outEnc)
    var cdr = crypt.final(self.outEnc)
    dbobj.value[key] = car + cdr
  })
  this.push(dbobj, self.outEnc)

  callback()
}


function setupStream(options, cryptfn) {
  if (!options)
    throw new Error('Must pass in an options object with #alg and #pwd properties')

  var s = new Transform({objectMode:true})
  s.inEnc = options.inEnc || 'hex'
  s.outEnc = options.outEnc || 'utf8'
  s.alg = options.alg
  s.pwd = options.pwd
  s.crypt = cryptfn
  s._transform = _transform

  return s
}


module.exports = {

  createCipher: function(options) {
    return setupStream(options, crypto.createCipher)
  }

, createDecipher: function (options) {
    return setupStream(options, crypto.createDecipher)
  }

}
