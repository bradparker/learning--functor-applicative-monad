const data = require('../data')

const Continuation = (k) => data(Continuation, k)

const run = (instance, done) => (
  instance((_, k) => k(done))
)

// Functor

const map = (fn, instance) => (
  Continuation((done) => (
    run(instance, (result) => (
      done(fn(result))
    ))
  ))
)

// Monad

const join = (instance) => (
  Continuation((done) => (
    run(instance, (result) => (
      run(result, done)
    ))
  ))
)

const bind = (instance, fn) => (
  join(map(fn, instance))
)

// const bind = (instance, fn) => (
//   Continuation((done) => (
//     run(instance, (result) => (
//       run(fn(result), done)
//     ))
//   ))
// )

module.exports = {
  Continuation,
  run,
  map,
  bind
}
