var CryptoJS = require('./aes-crypt')
  , crypto = require('crypto') // todo: Need a browser compliant alternative


var pass = 'corrupt99'

var encrypted = CryptoJS.AES.encrypt("MessageABC", pass)

var decrypted = CryptoJS.AES.decrypt(encrypted, pass);

console.log(decrypted.toString(CryptoJS.enc.Utf8))
