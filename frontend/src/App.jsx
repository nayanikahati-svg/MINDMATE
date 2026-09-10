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
  const [memoryGamesPlayed, setMemoryGamesPlayed] = useState(0)
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
  if (gameComplete) {
    setMemoryGamesPlayed(previous => previous + 1)
  }
}, [gameComplete])

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
        <h2>🧠 Memory Match</h2>
        <p>Games Played</p>
        <strong>{memoryGamesPlayed}</strong>
      </div>

      <div className="progress-card">
        <h2>🎯 Focus</h2>
        <p>Games Played</p>
        <strong>0</strong>
      </div>

      <div className="progress-card">
        <h2>⚡ Quick Recall</h2>
        <p>Games Played</p>
        <strong>0</strong>
      </div>

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