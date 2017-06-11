const assert = require('assert')
const { describe, it } = require('mocha')
const {
  List,
  Nil,
  eq,
  concat,
  map,
  apply,
  bind
} = require('../')

const add = (a) => (b) => a + b

describe('List', () => {
  describe('Eq', () => {
    describe('eq(a, b)', () => {
      it('returns true when a and b have the same members in the same order', () => {
        const a = List(2, List(3, List(5, List(1, Nil()))))
        const b = List(2, List(3, List(5, List(1, Nil()))))
        assert(eq(a, b))
      })

      it('returns false when a and b have the same members in a different order', () => {
        const a = List(2, List(3, List(5, List(1, Nil()))))
        const b = List(3, List(2, List(5, List(1, Nil()))))
        assert(!eq(a, b))
      })

      it('returns false when a and b have different members', () => {
        const a = List(4, List(3, List(5, List(1, Nil()))))
        const b = List(2, List(3, List(5, List(1, Nil()))))
        assert(!eq(a, b))
      })
    })
  })

  describe('Monoid', () => {
    describe('concat(a, b)', () => {
      it('returns b appended to a', () => {
        const a = List(4, List(3, List(5, Nil())))
        const b = List(2, List(1, Nil()))
        assert(eq(
          concat(a, b),
          List(4, List(3, List(5, List(2, List(1, Nil())))))
        ))
      })
    })
  })

  describe('Functor', () => {
    describe('map', () => {
      it('returns a List which is f applied to each element of the input list', () => {
        const input = List(2, List(4, List(1, Nil())))
        const f = (n) => n * 2
        const result = map(f, input)
        assert(eq(
          result,
          List(4, List(8, List(2, Nil())))
        ))
      })
    })
  })

  describe('Applicative', () => {
    describe('ap(applicative, instance)', () => {
      it('applies each element of applicative to each element of instance', () => {
        const applicative = List(add(2), List(add(1), Nil()))
        const instance = List(2, List(4, Nil()))
        const result = apply(applicative, instance)
        assert(eq(
          result,
          List(4, List(6, List(3, List(5, Nil()))))
        ))
      })
    })
  })

  describe('Monad', () => {
    describe('bind(instance, f)', () => {
      it('returns a list comprised of the results of calling f on each element of the input list', () => {
        const instance = List(2, List(27, Nil()))
        const f = (a) => List((a * 2), List((a * 3), Nil()))
        const result = bind(instance, f)
        assert(eq(
          result,
          List(4, List(6, List(54, List(81, Nil()))))
        ))
      })
    })
  })
})
