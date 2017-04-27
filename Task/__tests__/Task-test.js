const assert = require('assert')
const { describe, it } = require('mocha')

const {
  Left,
  Right
} = require('../../Either')

const {
  Task,
  run,
  map,
  bind
} = require('../')

describe('Task', () => {
  describe('run(instance, failure, success)', () => {
    describe('when result is a Right', () => {
      it('calls success with the result of the instance', (testDone) => {
        const instance = Task((done) => {
          setTimeout(() => {
            done(Right('Foo'))
          }, 10)
        })

        run(instance, testDone, (result) => {
          assert.equal('Foo', result)
          testDone()
        })
      })
    })

    describe('when result is a Left', () => {
      it('calls failure with the result of the instance', (testDone) => {
        const instance = Task((done) => {
          setTimeout(() => {
            done(Left('Foo'))
          }, 10)
        })

        run(instance, (result) => {
          assert.equal('Foo', result)
          testDone()
        }, testDone)
      })
    })
  })

  describe('Functor', () => {
    describe('map(function, instance)', () => {
      describe('when result is a Left', () => {
        it('returns a new Continuation(Left a), it does not call the provided function', (testDone) => {
          const a = Task((done) => {
            setTimeout(() => {
              done(Left('Foo'))
            }, 10)
          })

          const b = map((result) => (
            `${result}Bar`
          ), a)

          run(b, (result) => {
            assert.equal('Foo', result)
            testDone()
          }, testDone)
        })
      })

      describe('when result is a Right', () => {
        it('returns a new Task containing the value returned by calling the provided function with the old value', (testDone) => {
          const a = Task((done) => {
            setTimeout(() => {
              done(Right('Foo'))
            }, 10)
          })

          const b = map((result) => (
            `${result}Bar`
          ), a)

          run(b, testDone, (result) => {
            assert.equal('FooBar', result)
            testDone()
          })
        })
      })
    })
  })

  describe('Monad', () => {
    describe('bind(instance, function)', () => {
      describe('when result is a Left', () => {
        it('returns a new Task, it does not call the provided function', (testDone) => {
          const a = Task((done) => {
            setTimeout(() => {
              done(Left('Foo'))
            }, 10)
          })

          const b = bind(a, (result) => (
            Task((done) => {
              setTimeout(() => {
                done(Right(`${result}Bar`))
              }, 10)
            })
          ))

          run(b, (result) => {
            assert.equal('Foo', result)
            testDone()
          }, testDone)
        })
      })

      describe('when result is a Right', () => {
        it('returns a Task with the same contents as the one returned from calling the provided function with the old value', (testDone) => {
          const a = Task((done) => {
            setTimeout(() => {
              done(Right('Foo'))
            }, 10)
          })

          const b = bind(a, (result) => (
            Task((done) => {
              setTimeout(() => {
                done(Right(`${result}Bar`))
              }, 10)
            })
          ))

          run(b, testDone, (result) => {
            assert.equal('FooBar', result)
            testDone()
          })
        })
      })
    })
  })
})

