var levnet = require('levelnet')
  , net = require('net')
  , prompt = require('prompt')
  , PORT = 9988
  , stream = net.connect(PORT)
  , lev = levnet.client()

if (process.argv.length !== 3) {
  console.log("usage: gp KEY")
  process.exit()
}

var KEY = process.argv[2]

prompt.message = "Enter you password: "
prompt.start()

prompt.get({
  properties: {
    password: {
      description: 'Enter your password',
      type: 'string',
      message: 'Password must be letters spaces or dashes',
      hidden: true,
      required: true
    }
  }
}, onPrompt)


function onPrompt (err, result) {

  var fuzzStream = require('./fuzzyStream')(KEY)
    , decryptStream = require('./decryptValueStream')('aes192', result.password)

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

