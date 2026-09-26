export function getNextDifficulty(currentDifficulty, moves, pairCount) {
  const movesPerPair = moves / pairCount

  if (movesPerPair <= 1.5) {
    if (currentDifficulty === 'easy') {
      return 'medium'
    }

    if (currentDifficulty === 'medium') {
      return 'hard'
    }

    return 'hard'
  }

  if (movesPerPair > 2.5) {
    if (currentDifficulty === 'hard') {
      return 'medium'
    }

    if (currentDifficulty === 'medium') {
      return 'easy'
    }

    return 'easy'
  }

  return currentDifficulty
}