export function loggerMiddleware(eventName, ...args) {
  const printableArgs = args.map(arg =>
    typeof arg === 'object' && arg !== null
      ? arg.constructor?.name || 'object'
      : typeof arg
  )

  console.log(`[⚡ Event] ${eventName} triggered with args:`, printableArgs)
}
