const assert = require('assert')
const { describe, it } = require('mocha')
const id = a => a

const {
  Reader,
  run,
  map,
  ret,
  bind,
  ask,
  withEnv
} = require('../')

describe('Reader', () => {
  describe('run(value, instance)', () => {
    it('returns the return-value of calling the contained function with the provided value', () => {
      const reader = Reader(e => e + 1)
      assert.equal(run(1, reader), 2)
    })
  })

  describe('Functor', () => {
    describe('map(function, instance)', () => {
      it('returns a new Reader containing the value returned by calling the provided function with the old value', () => {
        const reader = Reader(e => e * 2)
        const mapped = map(a => a + 2, reader)
        assert.equal(run(1, mapped), 4)
      })
    })
  })

  describe('Monad', () => {
    describe('bind(instance, function)', () => {
      it('returns the Reader returned from calling the provided function with the old value', () => {
        const reader = Reader(e => e * 2)
        const bound = bind(reader,
          value => Reader(
            env => env + value
          )
        )
        assert.equal(run(1, bound), 3)
      })
    })
  })

  describe('ask()', () => {
    it('conveniently fetches the environment into your current closure', () => {
      const reader = Reader(env => env * 2)
      const asked = bind(reader,
        value => bind(ask,
          env => ret(env + value)
        )
      )

      assert.equal(run(2, asked), 6) // (env = 2) + (value = (env * 2))
    })
  })

  describe('withEnv', () => {
    it('makes ask even more convenient by allowing you to pass a binary function to accept env and the last value', () => {
      const reader = Reader(env => env * 2)
      const enved = withEnv(reader,
        (env, value) => env + value
      )

      assert.equal(run(2, enved), 6) // (env = 2) + (value = (env * 2))
    })

    it('is composable', () => {
      const reader = Reader(env => env * 2)
      const enved = withEnv(reader,
        (env, value) => env + value
      )
      const andAgain = withEnv(enved,
        (env, value) => env + value
      )

      assert.equal(run(2, andAgain), 8) // (env = 2) + ((value = (env * 2) + 2))
    })

    it('can compose pipelines with injected dependancies', () => {
      const pipeline = (...fns) => (
        fns.reduce((acc, fn) => (
          withEnv(acc, fn)
        ), Reader(id))
      )

      const myPipe = pipeline(
        (e, _) => e * 2,
        (e, v) => e + v,
        (e, v) => e + v
      )

      assert.equal(run(2, myPipe), 8)
    })
  })
})
