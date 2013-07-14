var CryptoJS = require('./aes-crypt')
  , Transform = require('stream').Transform


function encrypt (str, pass) {
  var encrypted = CryptoJS.AES.encrypt(str, pass);
  return encrypted.toString()
}

function decrypt (str, pass) {
  var decrypted = CryptoJS.AES.decrypt(str, pass)
  return decrypted.toString(CryptoJS.enc.Utf8)
}


var _transform = function(obj, encoding, callback) {

  var self = this

  if ( typeof obj === "string" ) {
    self.push(self.crypt(obj, self.pass))
  }

  else if (self.template) {
    /*
     * Only crypt keys in template
     */
    templateParse(self.template, obj, function (str) {
      self.push(self.crypt(str, self.pass))
    })
  }
  else {
    /*
     * crypt all keys in obj recursively
     */
    templateParse(true, obj, function (str) {
      self.push(self.crypt(str, self.pass))
    })
  }

  callback()
}



function templateParse(template, obj, fn) {
  var ii
  var okeys = Object.keys(obj)


  function parseObj (obj) {
    Object.keys(obj).forEach( function (key) {
      if (template[count] === key
      obj.value[key] = self.crypt(obj.value[key], self.pass)
    })
}


function check (x, y) {
  if ('string' === typeof x)
    return y == x
  else if ('boolean' === typeof x)
    return x
  return false
}



function setupStream(cryptfn, passphrase, template) {
  /*
   * template = {
   *   key1: false
   * , key2: true
   * , key3:
   */
  var s = new Transform({objectMode:true})
  s.crypt = cryptfn
  s.pass = passphrase
  s.template = template || false
  s._transform = _transform

  return s
}


module.exports = {

  createCipher: function(passphrase, template) {
    return setupStream(encrypt, passphrase, template)
  }

, createDecipher: function (passphrase, template) {
    return setupStream(decrypt, passphrase, template)
  }

}
