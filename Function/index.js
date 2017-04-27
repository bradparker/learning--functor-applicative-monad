const id = a => a

const run = (env, instance) =>
  instance(env)

// Functor

const map = (fn, instance) => (env) =>
  fn(instance(env))

// Monad

const ret = (value) => _ => value

const bind = (instance, fn) =>
  (env) => {
    const result = instance(env)
    return fn(result)(env)
  }

// Convenience

const asks = fn => env => fn(env)

const ask = asks(id)

const withEnv = (instance, fn) => (
  bind(instance,
    value => bind(ask,
      env => ret(fn(env, value))
    )
  )
)

module.exports = {
  run,
  map,
  ret,
  bind,
  ask,
  withEnv
}
