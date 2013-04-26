/*
 * FuzzyStream performs a match on a line of text
 * assuming the first space seperated word on the line
 * is the key. Eventually make this configurable.
 */
var Transform = require('stream').Transform

var _transform = function(chunk, encoding, callback) {
  var self = this
  var matches = this.match.map(function (str) {return str.toLowerCase()})
  var string = chunk.toString('utf8')
  // console.log(string)
  // console.log('------')
  if (matches) {
    var fields = string.split(' ')
      , rstring = fields.slice(1,3).join(' ')
      , key = fields[0].toLowerCase()

    matches.forEach( function (matchstr) {
      if (key === matchstr) {
        var out = new Buffer(rstring, 'utf8')
        self.push(out)
      }
    })
  }
  callback()
}

module.exports = function (match) {
  var s = new Transform()
  s.match = match
  s._transform = _transform
  return s
}
