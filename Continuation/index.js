const data = require('../data')
const { Just, Nothing } = require('../Maybe')

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

const concurrent = (left, right) => (
  Continuation((done) => {
    let l = Nothing()
    let r = Nothing()

    run(left, (resultL) => {
      l = Just(resultL)
      r((c, resultR) => {
        switch (c) {
          case Nothing:
            return
          case Just:
            return done([resultL, resultR])
        }
      })
    })

    run(right, (resultR) => {
      r = Just(resultR)
      l((c, resultL) => {
        switch (c) {
          case Nothing:
            return
          case Just:
            return done([resultL, resultR])
        }
      })
    })
  })
)

// Applicative

const apply = (applicative, instance) => (
  Continuation((done) => (
    run(concurrent(applicative, instance), ([f, value]) => (
      done(f(value))
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
  concurrent,
  map,
  apply,
  bind
}
