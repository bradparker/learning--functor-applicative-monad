const data = require('../data')
const id = a => a

const Reader = (ea) => data(Reader, ea)

const run = (env, instance) => (
  instance((_, ea) => ea(env))
)

// Functor

const map = (fn, instance) => (
  instance((_, ea) => (
    Reader(e => fn(ea(e)))
  ))
)

// Monad

const ret = (value) => Reader(_ => value)

const bind = (instance, fn) => (
  Reader((env) => {
    const result = run(env, instance)
    return run(env, fn(result))
  })
)

// Convenience

const asks = (fn) => Reader(env => fn(env))

const ask = asks(id)

const withEnv = (instance, fn) => (
  bind(instance,
    value => bind(ask,
      env => ret(fn(env, value))
    )
  )
)

module.exports = {
  Reader,

  run,
  map,
  ret,
  bind,
  ask,
  withEnv
}
