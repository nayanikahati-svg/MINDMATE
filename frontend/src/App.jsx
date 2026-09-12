import { useState, useEffect } from 'react'
import './App.css'

const cardsData = [
  '🧠', '🧠',
  '🌟', '🌟',
  '🍀', '🍀',
  '🚀', '🚀',
  '🎯', '🎯',
  '🦋', '🦋'
]

function shuffleCards() {
  return [...cardsData]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji: emoji,
      flipped: false,
      matched: false
    }))
}

function App() {
  const [page, setPage] = useState('home')
  const [cards, setCards] = useState(shuffleCards())
  const [selected, setSelected] = useState([])
  const [moves, setMoves] = useState(0)
 
  const [memoryResult, setMemoryResult] = useState(() => {
  const saved = localStorage.getItem('mindmateMemoryResult')
  return saved ? JSON.parse(saved) : null
})
const [memoryHistory, setMemoryHistory] = useState(() => {
  const saved = localStorage.getItem('mindmateMemoryHistory')
  return saved ? JSON.parse(saved) : []
})
  const [focusStarted, setFocusStarted] = useState(false)
  const [focusScore, setFocusScore] = useState(0)

  function handleCardClick(card) {
    if (
      card.flipped ||
      card.matched ||
      selected.length === 2
    ) {
      return
    }

    const newCards = cards.map(c =>
      c.id === card.id ? { ...c, flipped: true } : c
    )

    setCards(newCards)

    const newSelected = [...selected, card.id]
    setSelected(newSelected)

    if (newSelected.length === 2) {
      setMoves(moves + 1)

      const firstCard = cards.find(c => c.id === newSelected[0])
      const secondCard = card

      if (firstCard.emoji === secondCard.emoji) {
        setCards(currentCards =>
          currentCards.map(c =>
            newSelected.includes(c.id)
              ? { ...c, flipped: true, matched: true }
              : c
          )
        )

        setSelected([])
      } else {
        setTimeout(() => {
          setCards(currentCards =>
            currentCards.map(c =>
              newSelected.includes(c.id)
                ? { ...c, flipped: false }
                : c
            )
          )

          setSelected([])
        }, 800)
      }
    }
  }

  function startMemoryGame() {
    setCards(shuffleCards())
    setSelected([])
    setMoves(0)
    setPage('memory')
  }

  function goHome() {
    setPage('home')
  }

  function goToGames() {
    setPage('games')
  }

 const matchedCount = cards.filter(card => card.matched).length
const gameComplete = matchedCount === cards.length

useEffect(() => {
  if (gameComplete && moves > 0) {
    const gameResult = {
      name: 'Memory Match',
      moves: moves,
      score: Math.max(0, 120 - (moves - 12) * 5),
      accuracy: Math.max(0, Math.min(100, Math.round((12 / moves) * 100))),
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
    setMemoryResult(gameResult)
localStorage.setItem('mindmateMemoryResult', JSON.stringify(gameResult))

setMemoryHistory(previous => {
  const updated = [...previous, gameResult]
  localStorage.setItem('mindmateMemoryHistory', JSON.stringify(updated))
  return updated
})


  }
}, [gameComplete, moves])
  const sessionsPlayed = memoryHistory.length

  const totalPoints = memoryHistory.reduce(
    (total, game) => total + game.score,
    0
  )

  const averageAccuracy =
    sessionsPlayed > 0
      ? Math.round(
          memoryHistory.reduce(
            (total, game) => total + game.accuracy,
            0
          ) / sessionsPlayed
        )
      : 0

  const bestAccuracy =
    sessionsPlayed > 0
      ? Math.max(...memoryHistory.map(game => game.accuracy))
      : 0

  const bestMoves =
    sessionsPlayed > 0
      ? Math.min(...memoryHistory.map(game => game.moves))
      : 0

  const recentAttempts = [...memoryHistory].reverse()
  return (
    <div className="mindmate">

      <header className="header">
        <div className="logo">MINDMATE</div>
        <div className="tagline">Cognitive wellness companion</div>
      </header>

      {page === 'home' && (
        <main className="hero">

          <div className="badge">
            🧠 YOUR MIND, YOUR SUPERPOWER
          </div>

          <h1>
            Keep Your Mind
            <br />
            <span>Active &amp; Sharp.</span>
          </h1>

          <p>
            Fun cognitive activities designed to support memory,
            attention, focus, and mental wellness.
          </p>

          <div className="buttons">
            <button
              className="primary-btn"
              onClick={goToGames}
            >
              Start a Game →
            </button>

            <button
  className="secondary-btn"
  onClick={() => setPage('progress')}
>
  View Progress
</button>
          </div>

        </main>
      )}

      {page === 'games' && (
        <main className="games-page">

          <button className="back-btn" onClick={goHome}>
            ← Back
          </button>

          <h1>Choose Your Game</h1>

          <p>
            Pick a cognitive activity to get started.
          </p>

          <div className="game-cards">

            <div className="game-card">
              <div className="game-icon">🧠</div>
              <h2>Memory Match</h2>
              <p>Test and improve your memory.</p>

              <button
                className="primary-btn"
                onClick={startMemoryGame}
              >
                Play Game →
              </button>
            </div>

            <div className="game-card">
              <div className="game-icon">🎯</div>
              <h2>Focus Challenge</h2>
              <p>Challenge your attention and focus.</p>

              <button
  className="primary-btn"
  onClick={() => setPage('focus')}
>
  Play Game →
</button>
            </div>

            <div className="game-card">
              <div className="game-icon">⚡</div>
              <h2>Quick Recall</h2>
              <p>Test how quickly you can remember.</p>

              <button className="primary-btn">
                Coming Soon
              </button>
            </div>

          </div>

        </main>
      )}
{page === 'progress' && (
  <main className="progress-page">

    <button className="back-btn" onClick={goHome}>
      ← Back to Home
    </button>

    <h1>Your Progress</h1>

    <p>
      Track your cognitive activity and game performance.
    </p>

    <div className="progress-cards">

      <div className="progress-card">
        <h2>🎮 Games Played</h2>
        <strong>{sessionsPlayed}</strong>
      </div>

      <div className="progress-card">
        <h2>🎯 Average Accuracy</h2>
        <strong>
          {averageAccuracy}%
        </strong>
      </div>

      <div className="progress-card">
        <h2>⭐ Total Points</h2>
        <strong>
          {totalPoints}
          
        </strong>
      </div>

      <div className="progress-card">
        <h2>🏆 Best Accuracy</h2>
        <strong>
          {bestAccuracy}%
          
        </strong>
      </div>

    </div>

    <section className="section-card">
      <div className="section-heading">
        <div>
          <h2>Game-wise Performance</h2>
          <p>See how you are performing in each activity</p>
        </div>
      </div>

      <div className="games-list">
        <div className="game-row">

          <div className="game-info">
            <div className="game-icon">🧠</div>

            <div>
              <h3>Memory Match</h3>
              <p>Your completed Memory Match games</p>
              <p>
  Best: {bestMoves > 0 ? `${bestMoves} moves` : '—'}
</p>
            </div>
          </div>

          <div className="accuracy-section">
            <div className="accuracy-top">
              <span>Latest Accuracy</span>
              <strong>
                {memoryResult ? `${memoryResult.accuracy}%` : '0%'}
              </strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: memoryResult ? `${memoryResult.accuracy}%` : '0%'
                }}
              ></div>
            </div>
          </div>

          <div className="score">
            <span>Latest Score</span>
            <strong>
              {memoryResult ? memoryResult.score : '0'}
            </strong>
          </div>

        </div>
      </div>
    </section>

    <section className="section-card">

      <div className="section-heading">
        <div>
          <h2>Progress Insights</h2>
          <p>A simple summary of your recent game performance</p>
        </div>
      </div>

      <div className="insights-grid">

  <div className="insight-card">
    <span className="insight-icon">🏆</span>
    <div>
      <h3>Best Performance</h3>
      <p>
        {sessionsPlayed > 0
          ? `Your best Memory Match performance was ${bestMoves} moves with ${bestAccuracy}% accuracy.`
          : 'Complete a game to start tracking your performance.'}
      </p>
    </div>
  </div>

  <div className="insight-card">
    <span className="insight-icon">📈</span>
    <div>
      <h3>Average Accuracy</h3>
      <p>
        {sessionsPlayed > 0
          ? `Your average accuracy across ${sessionsPlayed} game${sessionsPlayed > 1 ? 's' : ''} is ${averageAccuracy}%.`
          : 'Your average accuracy will appear after you complete a game.'}
      </p>
    </div>
  </div>

  <div className="insight-card">
    <span className="insight-icon">🎯</span>
    <div>
      <h3>Recent Activity</h3>
      <p>
        {sessionsPlayed > 0
          ? `You have completed ${sessionsPlayed} Memory Match game${sessionsPlayed > 1 ? 's' : ''} and earned ${totalPoints} total points.`
          : 'Your recent activity will appear after you complete a game.'}
      </p>
    </div>
  </div>

</div>

    </section>

    <section className="section-card">

      <div className="section-heading">
        <div>
          <h2>Recent Activity</h2>
          <p>Your latest cognitive game sessions</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Game</th>
<th>Games Played</th>
<th>Score</th>
<th>Accuracy</th>
<th>Moves</th>
            </tr>
          </thead>

          <tbody>
  {recentAttempts.length > 0 ? (
  recentAttempts.map((game, index) => (
    <tr key={`${game.date}-${index}`}>
      <td>{game.name}</td>
      <td>{index + 1}</td>
      <td>{game.score}</td>
      <td>
        <span className="accuracy-badge">
          {game.accuracy}%
        </span>
      </td>
      <td>{game.moves ?? '—'}</td>
    </tr>
  ))
) : (
    <tr>
  <td>Memory Match</td>
  <td>0</td>
  <td>0</td>
  <td>
    <span className="accuracy-badge">0%</span>
  </td>
  <td>—</td>
</tr>
  )}
</tbody>
        </table>
      </div>

    </section>

    <div className="report-note">
      <span>💡</span>
      <p>
        This report shows your performance in cognitive activities over
        time. It is intended to track activity and progress, not to
        provide a medical diagnosis.
      </p>
    </div>

  </main>
)}
      {page === 'focus' && (
        <main className="focus-page">

          <button className="back-btn" onClick={goToGames}>
            ← Back to Games
          </button>

          <h1>Focus Challenge 🎯</h1>

          <p>
            Test your attention and reaction speed.
          </p>

          
            <div className="focus-game">

  {!focusStarted ? (
    <>
      <h2>Ready to Focus?</h2>

      <p>
        Click the target when it appears!
      </p>

      <button
        className="primary-btn"
        onClick={() => setFocusStarted(true)}
      >
        Start Challenge →
      </button>
    </>
  ) : (
    <>
      <h2>Find the Target! 🎯</h2>

      <p>Click the target as quickly as you can.</p>
<strong>Score: {focusScore} / 5</strong>
      <button
  className="focus-target"
  onClick={() => setFocusScore(focusScore + 1)}
>
  🎯
</button>
    </>
  )}

</div>

        </main>
      )}
      {page === 'memory' && (
        <main className="memory-page">

          <button className="back-btn" onClick={goToGames}>
            ← Back to Games
          </button>

          <h1>Memory Match 🧠</h1>

          <p>
            Find all the matching pairs.
          </p>

          <div className="game-info">
            <strong>Moves: {moves}</strong>
            <strong>
              Pairs: {matchedCount / 2} / 6
            </strong>
          </div>

          
            {gameComplete && (
  <div className="success-message">

    <h2>🎉 Great Job!</h2>

    <p>You completed Memory Match!</p>

    <div className="result-stats">
      <div>
        <strong>{moves}</strong>
        <span>Moves</span>
      </div>

      <div>
        <strong>6 / 6</strong>
        <span>Pairs</span>
      </div>

      <div>
        <strong>
          {moves <= 12 ? 'Excellent' : moves <= 18 ? 'Great' : 'Good'}
        </strong>
        <span>Performance</span>
      </div>
    </div>

    <div className="result-buttons">

      <button
        className="primary-btn"
        onClick={startMemoryGame}
      >
        🔄 Play Again
      </button>

      <button
        className="secondary-btn"
        onClick={goToGames}
      >
        🎮 Back to Games
      </button>

      <button
        className="secondary-btn"
        onClick={() => setPage('progress')}
      >
        📊 View Progress
      </button>

    </div>

  </div>
)}

          <div className="memory-grid">
            {cards.map(card => (
              <button
                key={card.id}
                className={`memory-card ${
                  card.flipped || card.matched ? 'flipped' : ''
                }`}
                onClick={() => handleCardClick(card)}
              >
                {card.flipped || card.matched ? card.emoji : '?'}
              </button>
            ))}
          </div>

        </main>
      )}

    </div>
  )
}

export default App