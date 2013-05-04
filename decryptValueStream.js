/*
 * FuzzyStream performs a match on a line of text
 * assuming the first space seperated word on the line
 * is the key. Eventually make this configurable.
 */
var Transform = require('stream').Transform
  , inEnc = 'hex'
  , outEnc = 'utf8'
  , crypto = require('crypto')


var _transform = function(dbobj, encoding, callback) {

  var self = this
  var  decrypted = {}
  Object.keys(dbobj.value).forEach( function (key) {
    var decrypt = crypto.createDecipher(self.alg, self.pwrd)
    var car = decrypt.update(dbobj.value[key], inEnc, outEnc)
    var cdr = decrypt.final(outEnc)
    dbobj.value[key] = car + cdr
  })
  this.push(dbobj, outEnc)

  callback()
}



module.exports = function (algorithm, pwrd) {
  var s = new Transform({objectMode:true})
  s.decrypt = crypto.createDecipher(algorithm, pwrd)
  s.alg = algorithm
  s.pwrd = pwrd
  s._transform = _transform
  return s
}
