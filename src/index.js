var objectAssign = require('object-assign')
var Reporter = require('./reporter')
var stacktrace = require('./stacktrace')

function AirbrakeMini (config) {
  if (!(this instanceof AirbrakeMini)) {
    return new AirbrakeMini(config)
  }
  this.reporter = config.reporter || new Reporter(config)
}

AirbrakeMini.prototype.notify = function notify (err) {
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
  this.reporter.notify(payload)
}

module.exports = AirbrakeMini
