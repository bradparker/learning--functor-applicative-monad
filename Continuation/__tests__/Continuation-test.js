const assert = require('assert')
const { describe, it } = require('mocha')

const {
  Continuation,
  run,
  map,
  apply,
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
      it('returns a new Continuation containing the value returned by calling the provided function with the old value', (testDone) => {
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

  describe('Applicative', () => {
    describe('apply(applicative, instance)', () => {
      it('applies the eventual value of applicative to the eventual value of instance', (testDone) => {
        const applicative = Continuation((done) => {
          setTimeout(() => {
            done(x => x * 2)
          }, 10)
        })
        const instance = Continuation((done) => {
          setTimeout(() => {
            done(2)
          }, 10)
        })

        run(apply(applicative, instance), (result) => {
          assert.equal(4, result)
          testDone()
        })
      })

      it('executes applicative and instance concurrently', (testDone) => {
        const start = new Date()

        const applicative = Continuation((done) => {
          setTimeout(() => {
            done(x => x * 2)
          }, 100)
        })
        const instance = Continuation((done) => {
          setTimeout(() => {
            done(2)
          }, 100)
        })

        run(apply(applicative, instance), (_) => {
          const end = new Date()
          assert(end - start < 200)
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

