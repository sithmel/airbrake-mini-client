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
    assert.deepEqual(payload.context, { severity: 'error', windowError: false, history: [] })
  })

  it('notifies using an object', () => {
    airbrake.notify({ error: new Error('BOOM!'), context: { severity: 'warning' } })
    assert.isTrue(reporter.notify.calledOnce)
    var payload = reporter.notify.args[0][0]
    assert.equal(payload.id, '')
    assert.deepEqual(payload.context, { severity: 'warning', windowError: false, history: [] })
  })
})
