var router = new require('routes').Router()

var gitarg = function () {

  var that = {}
  that.cmd = process.argv[2]
  that.args = process.argv.slice(3)

  /*
   * Call the given function with nargs args as well as the additional argument array xargs
   */
  function addcmd(cmd, fn, nargs, xargs) {
    /*
     * Specific number of args
     */
    if (isNumber(nargs)) {
      router.addRoute(cmd, function () {
        var args = Array.prototype.slice.call(arguments)
        if (args.length !== parseInt(nargs))
          throw new Error("number of supplied arguments does not match command <" + cmd + "> requirements")
        fn.apply(null, args.concat(xargs))
      })
    }
    /*
     * any amount of args
     */
    else if (nargs === "*") {
      router.addRoute(cmd, function () {
        var args = Array.prototype.slice.call(arguments)
        fn.apply(null, args.concat(xargs))
      })
    }
    /*
     * 1 or more args
     */
    else if (nargs === "?") {
      router.addRoute(cmd, function () {
        var args = Array.prototype.slice.call(arguments)
        if (arguments.length === 0)
          throw new Error("Must have at least one argument to command <" + cmd+ ">")
        fn.apply(null, args.concat(xargs))
      })
    }
    else return new Error("Unknown nargs flag!")
  }


  function run() {
    var go = router.match(that.cmd)
    if (!go) throw new Error ("No DEFAULT LOGIC YET ENABLED")
    return go.fn.apply(null, that.args)
  }


  that.addcmd = addcmd
  that.run = run

  return that

}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = gitarg