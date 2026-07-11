// Similarity between two strings via token-level Dice coefficient.
// Used for: (a) grading how much an accepted suggestion was edited
// (negotiated authorship), (b) detecting post-acceptance modification.
// ponytail: a real diff lib (rung 5 would need a NEW dependency) is not
// justified — Dice over word bigrams is standard, explainable in a methods
// chapter, and ~20 lines.

function bigrams(s: string): Map<string, number> {
  const words = s.toLowerCase().split(/\s+/).filter(Boolean)
  const grams = new Map<string, number>()
  for (let i = 0; i < words.length - 1; i++) {
    const g = words[i] + ' ' + words[i + 1]
    grams.set(g, (grams.get(g) ?? 0) + 1)
  }
  if (words.length === 1) grams.set(words[0], 1)
  return grams
}

export function similarity(a: string, b: string): number {
  if (a === b) return 1
  if (!a.trim() || !b.trim()) return 0
  const ga = bigrams(a)
  const gb = bigrams(b)
  let overlap = 0
  let total = 0
  ga.forEach((count, gram) => {
    overlap += Math.min(count, gb.get(gram) ?? 0)
    total += count
  })
  gb.forEach((count) => {
    total += count
  })
  return total === 0 ? 0 : (2 * overlap) / total
}
