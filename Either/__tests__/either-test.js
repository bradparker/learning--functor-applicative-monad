const assert = require('assert')
const { describe, it } = require('mocha')

const id = a => a

const {
  Right,
  Left,
  map,
  bind,
  apply,
  run
} = require('../')

const double = n => n * 2

describe('Either', () => {
  describe('run(failureFunction, successFunction, instance)', () => {
    describe('when instance is a Left', () => {
      it('returns the value returned by calling the failureFunction with the value', () => {
        assert.equal(4, run(Left(2), double, id))
      })
    })

    describe('when instance is a Right', () => {
      it('returns the value returned by calling the successFunction with the value', () => {
        assert.equal(6, run(Right(3), id, double))
      })
    })
  })

  describe('Functor', () => {
    describe('map(function, instance)', () => {
      describe('when instance is a Right', () => {
        it('returns a new Right containing the value returned by calling the provided function with the old value', () => {
          const m = map(double, Right(3))
          assert.equal(6, run(m, id, id))
        })
      })

      describe('when instance is a Left', () => {
        it('returns a new Left, it does not call the provided function', () => {
          const m = map(double, Left(7))
          assert.equal(7, run(m, id, id))
        })
      })
    })
  })

  describe('Applicative', () => {
    describe('apply(applicative, instance)', () => {
      describe('when applicative is a Left', () => {
        describe('when instance is a Left', () => {
          it('returns a new Left', () => {
            const applicative = Left(-1)
            const instance = Left(-1)
            const result = apply(applicative, instance)
            assert.equal(-1, run(result, id, id))
          })
        })

        describe('when instance is a Right', () => {
          it('returns a new Left', () => {
            const applicative = Left(-1)
            const instance = Right(4)
            const result = apply(applicative, instance)
            assert.equal(-1, run(result, id, id))
          })
        })
      })

      describe('when applicative is a Right', () => {
        describe('when instance is a Left', () => {
          it('returns a new Left', () => {
            const applicative = Right(a => a + 2)
            const instance = Left(-1)
            const result = apply(applicative, instance)
            assert.equal(-1, run(result, id, id))
          })
        })

        describe('when instance is a Right', () => {
          it('returns the applicative applied to the value', () => {
            const applicative = Right(a => a + 2)
            const instance = Right(4)
            const result = apply(applicative, instance)
            assert.equal(6, run(result, id, id))
          })
        })
      })
    })
  })

  describe('Monad', () => {
    const safeDivide = a => b => (
      b === 0
        ? Left('Divide by zero error')
        : Right(a / b)
    )

    describe('bind(instance, function)', () => {
      describe('when instance is a Right', () => {
        it('returns the Maybe returned from calling the provided function with the old value', () => {
          const right = bind(Right(5), safeDivide(10))
          assert.equal(2, run(right, id, id))

          const left = bind(Right(0), safeDivide(10))
          assert.equal('Divide by zero error', run(left, id, id))
        })
      })

      describe('when instance is a Left', () => {
        it('returns a new Left, it does not call the provided function', () => {
          const left = bind(Left(0), (n) => Right(n))
          assert.equal(0, run(left, id, id))
        })
      })
    })
  })
})

