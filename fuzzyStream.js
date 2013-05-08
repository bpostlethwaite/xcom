/*
 * FuzzyStream performs a match on a line of text
 * assuming the first space seperated word on the line
 * is the key. Eventually make this configurable.
 */
var Transform = require('stream').Transform
var Fuse = require('./fuse')
var options = {
  keys: ['key']
, threshold: 0.334
}


var _transform = function(dbobj, encoding, callback) {

  var self = this
  var f = new Fuse([dbobj], options)
  var result = f.search(this.matcher)
  if (result.length > 0) {
    result.forEach( function (k) {
      self.push(dbobj)
    })
  }
  callback()
}



module.exports = function (matcher) {
  var s = new Transform({objectMode:true})
  s.matcher = matcher
  s._transform = _transform
  return s
}
