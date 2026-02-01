export function safeParseArrayJson(array) {
  try {
    return array.map((item) => JSON.parse(item))
  } catch (err) {
    console.error(err?.message || err, array)
    return null
  }
}
