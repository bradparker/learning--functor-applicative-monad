const Continuation = require('../Continuation')
const Either = require('../Either')

// Task a = Continuation (Either a)
const Task = Continuation.Continuation

const run = (instance, failure, success) => (
  Continuation.run(instance, (result) => (
    Either.run(result, failure, success)
  ))
)

const map = (fn, instance) => (
  Continuation.map((result) => (
    Either.map(fn, result)
  ), instance)
)

// const bind = (instance, fn) => (
//   Task((done) => (
//     run(instance, (error) => (
//       done(Either.Left(error))
//     ), (value) => (
//       Continuation.run(fn(value), done)
//     ))
//   ))
// )

const join = (instance) => (
  Task((done) => (
    run(instance, (error) => (
      done(Either.Left(error))
    ), (value) => (
      Continuation.run(value, done)
    ))
  ))
)

const bind = (instance, fn) => (
  join(map(fn, instance))
)

const ret = (value) => (
  Task((done) => done(Either.Right(value)))
)

const fail = (error) => (
  Task((done) => done(Either.Left(error)))
)

module.exports = {
  Task,
  run,
  map,
  bind,
  ret,
  fail
}
