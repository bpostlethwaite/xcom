var request = require('request')
  , tap = require('tap')
  , test = require("tap").test

  , HOST = 'http://localhost'
  , PORT = 8082


test("Login success returns authentication object and token", function (t) {
  t.plan(3)
  var ROUTE = "/authenticate"
  var URI = HOST+":"+PORT+ROUTE

  request.post({
    url:URI
  , form: {
      username : 'hans'
    , password: 'solo'
    }
  }, function (e, r, body) {
       var resp = JSON.parse(body)
       t.ok(resp.authenticated, "authenticated")
       t.ok(typeof(resp.token) === "string", "token is string")
       t.notok(resp.error)
   })
})

test("Login with wrong username & password returns error object and null token", function (t) {
  t.plan(3)
  var ROUTE = "/authenticate"
  var URI = HOST+":"+PORT+ROUTE

  request.post({
    url:URI
  , form: {
      username : 'Lando'
    , password: 'Calrissian'
    }
  }, function (e, r, body) {
       var resp = JSON.parse(body)
       t.notok(resp.authenticated, "not authenticated")
       t.notok(resp.token, "no token")
       t.equal(resp.error, "username or password not recognized")
   })
})

test("Login with mangled keys returns error object and null token", function (t) {
  t.plan(3)
  var ROUTE = "/authenticate"
  var URI = HOST+":"+PORT+ROUTE

  request.post({
    url:URI
  , form: {
      usrnme : 'value'
    , passdrw: 'value'
    }
  }, function (e, r, body) {
       var resp = JSON.parse(body)
       t.notok(resp.authenticated, "not authenticated")
       t.notok(resp.token, "no token")
       t.equal(resp.error, "mangled keynames: keys = username=<user>&password=<pass>")
   })
})
