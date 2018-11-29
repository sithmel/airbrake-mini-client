var objectAssign = require('object-assign')
var Reporter = require('./reporter')
var stacktrace = require('./stacktrace')

var NOTIFIER = {
  name: 'airbrake-mini-client',
  version: '0.0.6',
  url: 'https://github.com/tes/airbrake-mini-client'
}

var DEFAULT_ENVIRONMENT = 'local'

function AirbrakeMini (config) {
  if (!(this instanceof AirbrakeMini)) {
    return new AirbrakeMini(config)
  }
  this.environment = config.environment || DEFAULT_ENVIRONMENT
  this.reporter = config.reporter || new Reporter(config)
  this.filters = []
}

AirbrakeMini.prototype.createInitialPayload = function airbrakeCreateInitialPayload () {
  return {
    id: '',
    context: {
      notifier: NOTIFIER,
      userAgent: window.navigator.userAgent,
      url: window.location.href,
      rootDirectory: window.location.protocol + '//' + window.location.host,
      language: 'JavaScript',
      environment: this.environment,
      severity: 'error',
      windowError: false,
      history: []
    },
    params: {},
    environment: {},
    session: {}
  }
}

AirbrakeMini.prototype.notify = function airbrakeMiniNotify (err) {
  var payload = this.createInitialPayload()

  if (err instanceof Error) {
    payload.errors = [stacktrace(err)]
  } else {
    payload.errors = [stacktrace(err.error)]
    objectAssign(payload.context, err.context || {})
    objectAssign(payload.params, err.params || {})
    objectAssign(payload.session, err.session || {})
    objectAssign(payload.environment, err.environment || {})
  }
  var filteredPayload = this._filter(payload)
  if (filteredPayload) {
    this.reporter.notify(filteredPayload)
  }
}

AirbrakeMini.prototype._filter = function _airbrakeFilter (payload) {
  for (var i = 0; i < this.filters.length; i++) {
    payload = this.filters[i](payload)
    if (!payload) break
  }
  return payload
}

AirbrakeMini.prototype.addFilter = function airbrakeMiniAddFilter (func) {
  this.filters.push(func)
  return this
}

module.exports = AirbrakeMini
