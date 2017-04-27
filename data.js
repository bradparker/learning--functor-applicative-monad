module.exports = (constructor, ...values) =>
  (f) => f(constructor, ...values)
