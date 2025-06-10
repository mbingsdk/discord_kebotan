// utils/runMiddleware.js
export async function runMiddleware(interaction, middleware, handler) {
  let i = 0
  const next = async () => {
    const fn = middleware[i++]
    if (fn) return fn(interaction, next)
    await handler()
  }
  await next()
}
