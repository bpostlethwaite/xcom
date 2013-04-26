var crypto = require('crypto')
  , pwrd = 'secret password'
  , fs = require('fs')
  , splitStream = require('split')
  , argv = require('optimist').argv

var fuzzStream = require('./fuzzyStream')(argv._)

var file = "testfile"
  , algorithm = 'aes192'

var encryptStream = crypto.createCipher(algorithm, pwrd)
var decryptStream = crypto.createDecipher(algorithm, pwrd)

var fstream = fs.createReadStream(file)

fstream.pipe(encryptStream).pipe(decryptStream).pipe(splitStream()).pipe(fuzzStream).pipe(process.stdout)