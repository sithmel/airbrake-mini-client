
var ErrorStackParser = require('error-stack-parser')

function parse (err) {
  try {
    return ErrorStackParser.parse(err)
  } catch (parseErr) {
    if (err.stack) {
      console.log('ErrorStackParser:', parseErr.toString(), err.stack)
    }
  }

  if (err.fileName) {
    return [err]
  }

  return []
}

function processor (err) {
  var backtrace = []

  if (!err.noStack) {
    var frames = parse(err)
    if (frames.length === 0) {
      try {
        throw new Error('fake')
      } catch (fakeErr) {
        frames = parse(fakeErr)
        frames.shift()
        frames.shift()
      }
    }

    for (var i = 0; i < frames.length; i++) {
      backtrace.push({
        function: frames[i].functionName || '',
        file: frames[i].fileName || '',
        line: frames[i].lineNumber || 0,
        column: frames[i].columnNumber || 0
      })
    }
  }

  return {
    type: err.name || '',
    message: err.message ? String(err.message) : String(err),
    backtrace: backtrace
  }
}

module.exports = processor
