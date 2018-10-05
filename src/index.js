var objectAssign = require('object-assign')
var Reporter = require('./reporter')
var stacktrace = require('./stacktrace')

function AirbrakeMini (config) {
  if (!(this instanceof AirbrakeMini)) {
    return new AirbrakeMini(config)
  }
  this.reporter = config.reporter || new Reporter(config)
  this.filters = []
}

AirbrakeMini.prototype.notify = function airbrakeMiniNotify (err) {
  var payload = {
    id: '',
    context: {
      severity: 'error',
      windowError: false,
      history: []
    },
    params: {},
    environment: {},
    session: {}
  }

  if (err instanceof Error) {
    payload.errors = [stacktrace(err)]
  } else {
    payload.errors = [stacktrace(err.error)]
    objectAssign(payload.context, err.context || {})
    objectAssign(payload.params, err.params || {})
    objectAssign(payload.session, err.session || {})
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
