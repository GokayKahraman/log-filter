export const safeParseArrayJson = (array) => {
  try {
    return array.map(item => JSON.parse(item))
  } catch (error) {
    console.error(error + ' ' + array)
    return null
  }
}