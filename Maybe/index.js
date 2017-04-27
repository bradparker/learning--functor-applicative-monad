const data = require('../data')

const Just = (value) => data(Just, value)

const Nothing = () => data(Nothing)

const maybe = (fallback, f, instance) => (
  instance((c, value) => {
    switch (c) {
      case Just:
        return f(value)
      case Nothing:
        return fallback
    }
  })
)

// Functor

const map = (f, instance) => (
  instance((c, value) => {
    switch (c) {
      case Just:
        return Just(f(value))
      case Nothing:
        return Nothing()
    }
  })
)

// Monad

const ret = (value) => Just(value)

const join = (instance) => (
  instance((c, value) => {
    switch (c) {
      case Just:
        return value
      case Nothing:
        return Nothing()
    }
  })
)

const bind = (instance, f) => (
  join(map(f, instance))
)

// Applicative

const apply = (applicative, instance) => (
  bind(applicative, (f) => map(f, instance))
)

module.exports = {
  Just,
  Nothing,
  maybe,
  map,
  ret,
  join,
  bind,
  apply
}
