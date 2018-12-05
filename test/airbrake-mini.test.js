/* eslint-env browser, mocha */
/* global assert */

var AirbrakeMini = require('../src')
var sinon = require('sinon')

describe('airbrake mini', () => {
  var airbrake
  var reporter

  beforeEach(() => {
    reporter = { notify: sinon.spy() }
    airbrake = new AirbrakeMini({
      projectId: '123',
      projectKey: '456',
      reporter: reporter
    })
  })

  it('is an object', () => {
    assert.instanceOf(airbrake, AirbrakeMini)
  })

  it('notifies an error', () => {
    airbrake.notify(new Error('BOOM!'))
    assert.isTrue(reporter.notify.calledOnce)
    var payload = reporter.notify.args[0][0]
    assert.equal(payload.id, '')
    assert.equal(payload.context.severity, 'error')
  })

  it('notifies using an object', () => {
    airbrake.notify({ error: new Error('BOOM!'), context: { severity: 'warning' } })
    assert.isTrue(reporter.notify.calledOnce)
    var payload = reporter.notify.args[0][0]
    assert.equal(payload.id, '')
    assert.equal(payload.context.severity, 'warning')
  })

  it('filters out', () => {
    airbrake.addFilter(function (notice) { // passthrough
      if (notice.context.severity === 'error') return null
      return notice
    })
    airbrake.addFilter(function (notice) { // filter out
      if (notice.context.severity === 'warning') return null
      return notice
    })
    airbrake.notify({ error: new Error('BOOM!'), context: { severity: 'warning' } })
    assert.isFalse(reporter.notify.calledOnce)
  })

  it('add data', () => {
    airbrake.addFilter(function (notice) {
      return Object.assign({}, notice, { id: 1 })
    })
    airbrake.notify({ error: new Error('BOOM!'), context: { severity: 'warning' } })
    assert.isTrue(reporter.notify.calledOnce)
    var payload = reporter.notify.args[0][0]
    assert.equal(payload.id, 1)
    assert.equal(payload.context.severity, 'warning')
  })

  it('generate initial payload', () => {
    var enrichedObject = airbrake.createInitialPayload()
    assert.equal(enrichedObject.context.environment, 'local')
    assert.equal(enrichedObject.context.notifier.name, 'airbrake-mini-client')
    assert.typeOf(enrichedObject.context.userAgent, 'string')
  })

  it('allows override of window', () => {
    var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
    var href = 'https://github.com/tes/airbrake-mini-client'
    var protocol = 'https:'
    var host = 'github.com'
    var windowOverride = { navigator: { userAgent }, location: { href, protocol, host } }
    airbrake = new AirbrakeMini({
      projectId: '123',
      projectKey: '456',
      reporter: reporter,
      window: windowOverride
    })
    var enrichedObject = airbrake.createInitialPayload()

    assert.equal(enrichedObject.context.userAgent, userAgent)
    assert.equal(enrichedObject.context.url, href)
    assert.equal(enrichedObject.context.rootDirectory, `${protocol}//${host}`)
  })
})
