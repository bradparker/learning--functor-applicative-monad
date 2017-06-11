const data = require('../data')

const Nil = () => data(Nil)
const List = (head, tail) => data(List, head, tail)

// Eq

const eq = (a, b) => (
  a((ca, x, xs) => (
    b((cb, y, ys) => {
      if (ca === Nil || cb === Nil) {
        return ca === cb
      } else if (x === y) {
        return eq(xs, ys)
      } else {
        return false
      }
    })
  ))
)

// Show

const show = (instance) => (
  instance((c, head, tail) => {
    switch (c) {
      case Nil:
        return `Nil()`
      case List:
        return `List(${head}, ${show(tail)})`
    }
  })
)

// Foldable

const fold = (f, instance, acc) => (
  instance((c, head, tail) => {
    switch (c) {
      case Nil:
        return acc
      case List:
        return fold(f, tail, f(acc, head))
    }
  })
)

const foldr = (f, instance, acc) => (
  fold(f, reverse(instance), acc)
)

// Monoid

const concat = (a, b) => (
  a((c, head, tail) => {
    switch (c) {
      case Nil:
        return b
      case List:
        return List(
          head,
          concat(tail, b)
        )
    }
  })
)

// Functor

// const map = (f, instance) => (
//   instance((c, head, tail) => {
//     switch (c) {
//       case Nil:
//         return Nil()
//       case List:
//         return List(
//           f(head),
//           map(f, tail)
//         )
//     }
//   })
// )

const map = (f, instance) => (
  foldr((acc, elem) => (
    List(f(elem), acc)
  ), instance, Nil())
)

// Applicative

const pure = (f) => List(f, Nil())

// const apply = (applicative, instance) => (
//   applicative((c, f, fs) => {
//     switch (c) {
//       case Nil:
//         return Nil()
//       case List:
//         return concat(
//           map(f, instance),
//           apply(fs, instance)
//         )
//     }
//   })
// )

const apply = (applicative, instance) => (
  foldr((acc, f) => (
    concat(map(f, instance), acc)
  ), applicative, Nil())
)

// Monad

const ret = pure

// const bind = (instance, f) => (
//   instance((c, head, tail) => {
//     switch (c) {
//       case Nil:
//         return Nil()
//       case List:
//         return concat(
//           f(head),
//           bind(tail, f)
//         )
//     }
//   })
// )

const bind = (instance, f) => (
  foldr((acc, elem) => (
    concat(f(elem), acc)
  ), instance, Nil())
)

// Utils

const reverse = (instance) => (
  fold((acc, head) => (List(head, acc)), instance, Nil())
)

module.exports = {
  List,
  Nil,
  eq,
  show,
  fold,
  foldr,
  concat,
  map,
  pure,
  apply,
  ret,
  bind,
  reverse
}
