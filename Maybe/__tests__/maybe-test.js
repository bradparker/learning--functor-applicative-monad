const assert = require('assert')
const { describe, it } = require('mocha')

const id = a => a

const {
  Just,
  Nothing,
  map,
  bind,
  apply,
  maybe
} = require('../')

const double = n => n * 2

describe('Maybe', () => {
  describe('maybe(fallbackValue, successFunction, instance)', () => {
    describe('when instance is a Nothing', () => {
      it('returns the fallbackValue', () => {
        assert.equal('Woot!', maybe('Woot!', id, Nothing()))
      })
    })

    describe('when instance is a Just', () => {
      it('returns the value transformed by the provided successFunction', () => {
        assert.equal(6, maybe(1, double, Just(3)))
      })
    })
  })

  describe('Functor', () => {
    describe('map(function, instance)', () => {
      describe('when instance is a Just', () => {
        it('returns a new Just containing the value returned by calling the provided function with the old value', () => {
          const m = map(double, Just(3))
          assert.equal(6, maybe(0, id, m))
        })
      })

      describe('when instance is a Nothing', () => {
        it('returns a new Nothing, it does not call the provided function', () => {
          const m = map(double, Nothing())
          assert.equal(7, maybe(7, id, m))
        })
      })
    })
  })

  describe('Applicative', () => {
    describe('apply(applicative, instance)', () => {
      describe('when applicative is a Nothing', () => {
        describe('when instance is a Nothing', () => {
          it('returns a new nothing', () => {
            const applicative = Nothing()
            const instance = Nothing()
            const result = apply(applicative, instance)
            assert.equal(-1, maybe(-1, id, result))
          })
        })

        describe('when instance is a Just', () => {
          it('returns a new nothing', () => {
            const applicative = Nothing()
            const instance = Just(4)
            const result = apply(applicative, instance)
            assert.equal(-1, maybe(-1, id, result))
          })
        })
      })

      describe('when applicative is a Just', () => {
        describe('when instance is a Nothing', () => {
          it('returns a new nothing', () => {
            const applicative = Just(a => a + 2)
            const instance = Nothing()
            const result = apply(applicative, instance)
            assert.equal(-1, maybe(-1, id, result))
          })
        })

        describe('when instance is a Just', () => {
          it('returns the applicative applied to the value', () => {
            const applicative = Just(a => a + 2)
            const instance = Just(4)
            const result = apply(applicative, instance)
            assert.equal(6, maybe(-1, id, result))
          })
        })
      })
    })
  })

  describe('Monad', () => {
    const safeDivide = a => b => (
      b === 0
        ? Nothing()
        : Just(a / b)
    )

    describe('bind(instance, function)', () => {
      describe('when instance is a Just', () => {
        it('returns the Maybe returned from calling the provided function with the old value', () => {
          const just = bind(Just(5), safeDivide(10))
          assert.equal(2, maybe(0, id, just))

          const nothing = bind(Just(0), safeDivide(10))
          assert.equal(-1, maybe(-1, id, nothing))
        })
      })

      describe('when instance is a Nothing', () => {
        it('returns a new Nothing, it does not call the provided function', () => {
          const nothing = bind(Nothing(), (n) => Just(n))
          assert.equal(0, maybe(0, id, nothing))
        })
      })
    })
  })
})

