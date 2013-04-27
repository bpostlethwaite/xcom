/*
 * FuzzyStream performs a match on a line of text
 * assuming the first space seperated word on the line
 * is the key. Eventually make this configurable.
 */
var Transform = require('stream').Transform
var fuzzy = require('fuzzy')

var _transform = function(chunk, encoding, callback) {
  var self = this
  var keys = this.keys
  var string = chunk.toString('utf8')
  // console.log(string)
  // console.log('------')
  if (keys) {
    var fields = string.split(' ')
    //  , rstring = fields.slice(1,3).join(' ')

    keys.forEach( function (key) {
      var results = fuzzy.filter(key, fields)
      if (results.length > 0) {
        console.log("RESULTS:", results)
        var out = new Buffer(string, 'utf8')
        self.push(out)
      }
    })
  }
  callback()
}

module.exports = function (keys) {
  var s = new Transform()
  s.keys = keys
  s._transform = _transform
  return s
}
