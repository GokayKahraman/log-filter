export function getCompleteLinesAndBuffer(content) {
  const lastNewlineIndex = content.lastIndexOf('\n')

  if (lastNewlineIndex < 0) {
    return { completePart: '', lineBuffer: content }
  }

  const completePart = content.slice(0, lastNewlineIndex + 1)
  const lineBuffer = lastNewlineIndex < content.length - 1
    ? content.slice(lastNewlineIndex + 1)
    : ''

  return { completePart, lineBuffer }
}
