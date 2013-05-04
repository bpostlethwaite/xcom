var request = require('request')
  , tap = require('tap')
  , test = require("tap").test

  , HOST = 'http://localhost'
  , PORT = 8082
  , URI = HOST+":"+PORT

test("Login success returns authentication object and token", function (t) {
  t.plan(3)

  request.post({
    url:URI
  , json: {
      username : 'hans'
    , password: 'solo'
    }
  }, function (e, r, body) {
       t.ok(body.authenticated, "authenticated")
       t.ok(typeof(body.token) === "string", "token is string")
       t.notok(body.error)
   })
})

test("Login with wrong username & password returns error object and null token", function (t) {
  t.plan(3)

  request.post({
    url:URI
  , json: {
      username : 'Lando'
    , password: 'Calrissian'
    }
  }, function (e, r, body) {
       t.notok(body.authenticated, "not authenticated")
       t.notok(body.token, "no token")
       t.equal(body.error, "username or password not recognized")
   })
})

test("Login JSON fields username and password malformed", function (t) {
  t.plan(3)

  request.post({
    url:URI
  , json: {
      usrnme : 'value'
    , passdrw: 'value'
    }
  }, function (e, r, body) {
       t.notok(body.authenticated, "not authenticated")
       t.notok(body.token, "no token")
       t.equal(body.error, "Login JSON requires 'username' and 'password' keys")
   })
})


// test("Login JSON is malformed", function (t) {
//   t.plan(3)

//   request.post({
//     url:URI
//   , json: {
//       usrnme : 'value'
//     , passdrw: 'value'
//     }
//   }, function (e, r, body) {
//        t.notok(body.authenticated, "not authenticated")
//        t.notok(body.token, "no token")
//        t.equal(body.error, "Login JSON is malformed. Does Not Parse")
//    })
// })
