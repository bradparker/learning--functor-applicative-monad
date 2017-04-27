const assert = require('assert')
const { describe, it } = require('mocha')

const {
  Continuation,
  run,
  map,
  bind
} = require('../')

describe('Continuation', () => {
  describe('run(instance, done)', () => {
    it('calls done with the result of the instance', (testDone) => {
      const instance = Continuation((done) => {
        setTimeout(() => {
          done('Foo')
        }, 10)
      })

      run(instance, (result) => {
        assert.equal('Foo', result)
        testDone()
      })
    })
  })

  describe('Functor', () => {
    describe('map(function, instance)', () => {
      it('returns a new Just containing the value returned by calling the provided function with the old value', (testDone) => {
        const a = Continuation((done) => {
          setTimeout(() => {
            done('Foo')
          }, 10)
        })

        const b = map((result) => (
          `${result}Bar`
        ), a)

        run(b, (result) => {
          assert.equal('FooBar', result)
          testDone()
        })
      })
    })
  })

  describe('Monad', () => {
    describe('bind(instance, function)', () => {
      it('returns a Continuation with the same contents as the one returned from calling the provided function with the old value', (testDone) => {
        const a = Continuation((done) => {
          setTimeout(() => {
            done('Foo')
          }, 10)
        })

        const b = bind(a, (result) => (
          Continuation((done) => {
            setTimeout(() => {
              done(`${result}Bar`)
            }, 10)
          })
        ))

        run(b, (result) => {
          assert.equal('FooBar', result)
          testDone()
        })
      })
    })
  })
})

