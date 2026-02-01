/**
 * Parça içeriğini tam satırlar ve yarım satır (buffer) olarak ayırır.
 * Parça sınırı satır ortasında kalabileceği için son satırı sonraki parçaya taşır.
 *
 * @param {string} content - Önceki buffer + mevcut parça metni
 * @returns {{ completePart: string, lineBuffer: string }}
 */
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
