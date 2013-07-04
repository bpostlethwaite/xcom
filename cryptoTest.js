var CryptoJS = require('./aes-crypt')
  , crypto = require('crypto') // todo: Need a browser compliant alternative

var pass = "this is secret"







    var JsonFormatter = {
        stringify: function (cipherParams) {
            // create json object with ciphertext
            var jsonObj = {
                ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
            };

            // optionally add iv and salt
            if (cipherParams.iv) {
                jsonObj.iv = cipherParams.iv.toString();
            }
            if (cipherParams.salt) {
                jsonObj.s = cipherParams.salt.toString();
            }

            // stringify json object
            return JSON.stringify(jsonObj);
        },

        parse: function (jsonStr) {
            // parse json string
            var jsonObj = JSON.parse(jsonStr);

            // extract ciphertext from json object, and create cipher params object
            var cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
            });

            // optionally extract iv and salt
            if (jsonObj.iv) {
                cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv)
            }
            if (jsonObj.s) {
                cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s)
            }

            return cipherParams;
        }
    };

    var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase", { format: JsonFormatter });

    console(encrypted); // {"ct":"tZ4MsEnfbcDOwqau68aOrQ==","iv":"8a8c8fd8fe33743d3638737ea4a00698","s":"ba06373c8f57179c"}

    var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase", { format: JsonFormatter });

    alert(decrypted.toString(CryptoJS.enc.Utf8)); // Message











var iv  = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');


var encrypted = CryptoJS.AES.encrypt("MessageABC", pass, { iv: iv });


var hexValue = CryptoJS.enc.Hex.stringify(encrypted.ciphertext)

var cipherParams = CryptoJS.lib.CipherParams.create({
  ciphertext: CryptoJS.enc.Hex.parse(hexValue)
, iv: iv
})


var decrypted = CryptoJS.AES.decrypt(cipherParams, pass)

console.log(decrypted)

console.log(decrypted.toString(CryptoJS.enc.Utf8)); // Message




var Transform = require('stream').Transform


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
