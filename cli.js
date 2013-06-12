var levnet = require('levelnet')
  , net = require('net')
  , prompt = require('prompt')
  , URL = "pxx.sparse.io"
  , stream = net.connect(80, URL)
  , lev = levnet.client()
  , gitarg = require('./gitarg')()



prompt.message = "Enter you password: "
prompt.start()

var passScheme = {
  properties: {
    password: {
      description: 'Enter your password',
      type: 'string',
      hidden: true,
      required: true
    }
  }
}

if (gitarg.cmd.toLowerCase() === "put")
  doublePrompt(passScheme, onPrompt)
else prompt.get(passScheme, onPrompt)

function onPrompt(err, result) {
  if (err) throw new Error ("password error")
  gitarg.addcmd("get", get, 1, [result.password])
  gitarg.addcmd("put", put, 3, [result.password])
  gitarg.run()
}

function doublePrompt(passScheme, onPrompt) {
  var pass1
  prompt.get(passScheme, function (err, result) {
    if (err) throw new Error ("password error")
    pass1 = result.password
    prompt.message = "Enter you password again: "
    prompt.get(passScheme, function (err, result2) {
      if (err) throw new Error ("password error")
      if (pass1 !== result2.password)
        throw new Error ("passwords do not match")
      onPrompt(null, result)
    })
  })
}

function get (key, password) {
  var fuzzStream = require('./fuzzyStream')(key)
    , decryptStream = require('./jcrypt').createDecipher({
      alg: 'aes192'
    , pwd: password
    })
  stream.pipe(lev).pipe(stream)
  lev.on('levelup', function () {
    var dataStream = lev.createReadStream()
    dataStream.pipe(fuzzStream).pipe(decryptStream)

    decryptStream.on('data', function (data) {
      console.log(data)
    })

    dataStream.on('end', function () {
      lev.end()
    })
  })
}

function put (key, user, pxx, password) {
  var fuzzStream = require('./fuzzyStream')(key)
    , encryptStream = require('./jcrypt').createCipher({
      alg: 'aes192'
    , pwd: password
    , inEnc: 'utf8'
    , outEnc: 'hex'
    })

  stream.pipe(lev).pipe(stream)

  lev.on('levelup', function () {

    encryptStream.on('data', function (data) {
      lev.put(data.key, data.value, function (err) {
        if (err) throw err
        lev.end()
      })
    })

    encryptStream.write({key:key, value: {user: user, pxx: pxx}})
  })
}
