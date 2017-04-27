const assert = require('assert')
const { describe, it } = require('mocha')
const id = a => a

const {
  map,
  ret,
  bind,
  ask,
  withEnv
} = require('../')

describe('Function', () => {
  describe('Functor', () => {
    describe('map(function, instance)', () => {
      it('returns a new Function containing the value returned by calling the provided function with the old value', () => {
        const func = e => e * 2
        const mapped = map(a => a + 2, func)
        assert.equal(mapped(1), 4)
      })
    })
  })

  describe('Monad', () => {
    describe('bind(instance, function)', () => {
      it('returns the Function returned from calling the provided function with the old value', () => {
        const func = e => e * 2
        const bound = bind(func,
          value => env => env + value
        )
        assert.equal(bound(1), 3)
      })
    })
  })

  describe('ask()', () => {
    it('conveniently fetches the environment into your current closure', () => {
      const func = env => env * 2
      const asked = bind(func,
        value => bind(ask,
          env => ret(env + value)
        )
      )

      assert.equal(asked(2), 6) // (env = 2) + (value = (env * 2))
    })
  })

  describe('withEnv', () => {
    it('makes ask even more convenient by allowing you to pass a binary function to accept env and the last value', () => {
      const func = env => env * 2
      const enved = withEnv(func,
        (env, value) => env + value
      )

      assert.equal(enved(2), 6) // (env = 2) + (value = (env * 2))
    })

    it('is composable', () => {
      const func = env => env * 2
      const enved = withEnv(func,
        (env, value) => env + value
      )
      const andAgain = withEnv(enved,
        (env, value) => env + value
      )

      assert.equal(andAgain(2), 8) // (env = 2) + ((value = (env * 2) + 2))
    })

    it('can be composed into pipelines with an environment', () => {
      const composeWithEnv = (...fns) => (
        fns.reduce((acc, fn) => (
          withEnv(acc, fn)
        ), id)
      )

      const myPipe = composeWithEnv(
        (e, _) => e + 2,
        (e, v) => e + v,
        (e, v) => e + v
      )

      assert.equal(myPipe(2), 8)
    })
  })
})
