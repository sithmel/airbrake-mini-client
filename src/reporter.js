/* eslint-env browser */
var DEFAULT_HOST = 'https://api.airbrake.io'
var DEFAULT_TIMEOUT = 10000

var errors = {
  unauthorized: 'airbrake: unauthorized: project id or key are wrong',
  ipRateLimited: 'airbrake: IP is rate limited'
}

var rateLimitReset = 0

function Reporter (config) {
  if (!config.projectId || !config.projectKey) {
    throw new Error('Both projectId and projectKey are mandatory')
  }
  this.projectId = config.projectId
  this.projectKey = config.projectKey
  this.host = config.host || DEFAULT_HOST
  this.timeout = config.timeout || DEFAULT_TIMEOUT
}

Reporter.prototype.notify = function reporterNotify (payload) {
  let utime = Date.now() / 1000
  if (utime < rateLimitReset) {
    console.log(errors.ipRateLimited)
  }

  var url = this.host + '/api/v3/projects/' + this.projectId + '/notices?key=' + this.projectKey
  let req = new XMLHttpRequest()
  req.open('POST', url, true)
  req.timeout = this.timeout
  req.onreadystatechange = function () {
    if (req.readyState !== 4) {
      return
    }

    if (req.status === 401) {
      console.log(errors.unauthorized)
      return
    }

    if (req.status === 429) {
      console.log(errors.ipRateLimited)

      var s = req.getResponseHeader('X-RateLimit-Delay')
      if (!s) {
        return
      }

      var n = parseInt(s, 10)
      if (n > 0) {
        rateLimitReset = Date.now() / 1000 + n
      }
      return
    }

    if (req.status >= 200 && req.status < 500) {
      var resp
      try {
        resp = JSON.parse(req.responseText)
      } catch (err) {
        console.log('airbrake error: failed to deserialize response')
        return
      }
      if (resp.id) {
        console.log('airbrake: succesfully sent error id:' + resp.id)
        return
      }
      if (resp.message) {
        console.log('airbrake error: ' + resp.message)
        return
      }
    }

    var body = req.responseText
    console.log('airbrake: xhr: unexpected response: code=' + req.status + 'body=' + body)
  }

  req.send(JSON.stringify(payload))
}

module.exports = Reporter
