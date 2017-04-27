const data = require('../data')

const Left = (value) => data(Left, value)
const Right = (value) => data(Right, value)

const run = (instance, failure, success) => (
  instance((c, value) => {
    switch (c) {
      case Right:
        return success(value)
      case Left:
        return failure(value)
    }
  })
)

// Functor

const map = (f, instance) => (
  instance((c, value) => {
    switch (c) {
      case Right:
        return Right(f(value))
      case Left:
        return Left(value)
    }
  })
)

// Monad

const ret = (value) => Right(value)

const join = (instance) => (
  instance((c, value) => {
    switch (c) {
      case Right:
        return value
      case Left:
        return Left(value)
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
  Left,
  Right,
  run,
  map,
  ret,
  join,
  bind,
  apply
}
