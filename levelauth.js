var levelup = require('levelup')

// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
var db = levelup('./mydb')


module.exports = function(user, pass, cb) {
  var verified = false
  // 3) fetch by key
  console.log("verifying user:", user)

  db.get(user, function (err, value) {
    if (pass === value) verified = true
    cb(verified)
  })
}

// db.createReadStream()
//   .on('data', function (data) {
//     console.log(data.key, '=', data.value)
//   })