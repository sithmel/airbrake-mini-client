/* eslint-env browser, mocha */
/* global assert */

var processor = require('../src/stacktrace')

describe('stacktrace', () => {
  var error

  describe('Error', () => {
    beforeEach(() => {
      try {
        throw new Error('BOOM')
      } catch (err) {
        error = processor(err)
      }
    })

    it('provides type and message', () => {
      assert.equal(error.type, 'Error')
      assert.equal(error.message, 'BOOM')
    })

    it('provides backtrace', () => {
      var backtrace = error.backtrace
      assert.equal(backtrace.length, 6)

      var frame = backtrace[0]
      assert.include(frame.file, 'stacktrace.test')
      assert.equal(frame.function, 'Context.beforeEach')
      assert.typeOf(frame.line, 'number')
      assert.typeOf(frame.column, 'number')
    })
  })

  describe('text', () => {
    beforeEach(() => {
      error = processor('BOOM')
    })

    it('uses text as error message', () => {
      assert.equal(error.type, '')
      assert.equal(error.message, 'BOOM')
    })

    it('provides backtrace', () => {
      var backtrace = error.backtrace
      assert.equal(backtrace.length, 5)
    })
  })
})
