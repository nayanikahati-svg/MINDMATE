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
  const [memoryStartTime, setMemoryStartTime] = useState(null)
const [memoryTime, setMemoryTime] = useState(0)
const [memoryAccuracy, setMemoryAccuracy] = useState(0)
  const [memoryGamesPlayed, setMemoryGamesPlayed] = useState(() => {
  return Number(localStorage.getItem('memoryGamesPlayed')) || 0
})
const [memoryHistory, setMemoryHistory] = useState(() => {
  const saved = localStorage.getItem('mindmateMemoryHistory')

  if (!saved) return []

  try {
    const parsed = JSON.parse(saved)

    return parsed.filter(
      attempt =>
        typeof attempt === 'object' &&
        attempt !== null &&
        typeof attempt.moves === 'number'
    )
  } catch {
    return []
  }
})
const validMemoryHistory = memoryHistory.filter(
  attempt =>
    attempt &&
    typeof attempt === "object" &&
    typeof attempt.moves === "number" &&
    typeof attempt.score === "number" &&
    typeof attempt.accuracy === "number" &&
    typeof attempt.date === "string"
    
)

  const [focusStarted, setFocusStarted] = useState(false)
  const [focusScore, setFocusScore] = useState(0)
  const [patternQuestion, setPatternQuestion] = useState(0)
const [patternScore, setPatternScore] = useState(0)
const [patternAnswered, setPatternAnswered] = useState(false)
const [patternStartTime, setPatternStartTime] = useState(null)
const [storyRecallStarted, setStoryRecallStarted] = useState(false)
const [storyRecallQuestion, setStoryRecallQuestion] = useState(-1)
const [storyRecallComplete, setStoryRecallComplete] = useState(false)
const [storyRecallScore, setStoryRecallScore] = useState(0)
const [storyRecallStartTime, setStoryRecallStartTime] = useState(null)
const [storyRecallHistory, setStoryRecallHistory] = useState(() => {
  const saved = localStorage.getItem('mindmateStoryRecallHistory')
  return saved ? JSON.parse(saved) : []
})
const [storyRecallHasPlayed, setStoryRecallHasPlayed] = useState(false)
const [storyRecallReplayUsed, setStoryRecallReplayUsed] = useState(false)
const [storyRecallIsPlaying, setStoryRecallIsPlaying] = useState(false)
const [storyRecallShowAnswers, setStoryRecallShowAnswers] = useState(false)
 const [patternGamesPlayed, setPatternGamesPlayed] = useState(() => {
  const saved = localStorage.getItem('mindmatePatternGamesPlayed')
  return saved ? Number(saved) : 0
})
 const [patternHistory, setPatternHistory] = useState(() => {
  const saved = localStorage.getItem('mindmatePatternHistory')

  if (!saved) return []

  try {
    const parsed = JSON.parse(saved)

    return parsed.filter(
      attempt =>
        attempt &&
        typeof attempt === 'object' &&
        typeof attempt.score === 'number' &&
        typeof attempt.accuracy === 'number' &&
        typeof attempt.points === 'number' &&
        typeof attempt.time === 'number' &&
        typeof attempt.date === 'string'
    )
  } catch {
    return []
  }
})
const [patternComplete, setPatternComplete] = useState(false)
const patternQuestions = [
  {
    sequence: ['🎋', '🌸', '🎋', '🌸', '❓'],
    options: ['🎋', '🥟', '🐘'],
    answer: '🎋'
  },
  {
    sequence: ['🥟', '🍵', '🥟', '🍵', '❓'],
    options: ['🌸', '🍵', '🥟'],
    answer: '🥟'
  },
  {
    sequence: ['🐘', '🦋', '🐘', '🦋', '❓'],
    options: ['🥁', '🐘', '🌿'],
    answer: '🐘'
  },
  {
    sequence: ['🥁', '🎋', '🌸', '🥁', '🎋', '❓'],
    options: ['🌸', '🥟', '🥁'],
    answer: '🌸'
  },
  {
    sequence: ['🍵', '🌿', '🥟', '🍵', '🌿', '❓'],
    options: ['🍵', '🥟', '🌸'],
    answer: '🥟'
    }
]
const storyRecallStories = [
  {
    story:
      "Meitei went to the garden this morning. She picked three Memang Narang. Then she watered the flowers before going inside for tea.",
    questions: [
      {
        question: "What did Meitei pick?",
        options: ["Memang Narang", "Kaji Nemu", "Tezpur Litchi"],
        answer: "Memang Narang"
      },
      {
        question: "How many Memang Narang did Meitei pick?",
        options: ["Two", "Three", "Five"],
        answer: "Three"
      }
    ]
  }
]
useEffect(() => {
  if (patternComplete) {
    const accuracy = Math.round(
      (patternScore / patternQuestions.length) * 100
    )

    const points = patternScore * 20
   const timeTaken = patternStartTime
  ? Math.round((Date.now() - patternStartTime) / 1000)
  : 0
    const attempt = {
      score: patternScore,
      accuracy: accuracy,
      points: points,
      time: timeTaken,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }

    setPatternHistory(prev => {
      const updated = [...prev, attempt]

      localStorage.setItem(
        'mindmatePatternHistory',
        JSON.stringify(updated)
      )

      return updated
    })

    setPatternGamesPlayed(prev => {
      const updated = prev + 1

      localStorage.setItem(
        'mindmatePatternGamesPlayed',
        updated
      )

      return updated
    })
  }
}, [patternComplete, patternStartTime])

const speakText = (text, onFinished) => {
  window.speechSynthesis.cancel()

  const speech = new SpeechSynthesisUtterance(text)
  speech.lang = 'en-IN'
  speech.rate = 0.85
  speech.pitch = 1

  speech.onend = () => {
    setStoryRecallIsPlaying(false)

    if (onFinished) {
      onFinished()
    }
  }

  setStoryRecallIsPlaying(true)
  window.speechSynthesis.speak(speech)
}
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
  setMemoryStartTime(Date.now())
  setMemoryTime(0)
  setMemoryAccuracy(0)
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
    setMemoryGamesPlayed(previous => {
      const updated = previous + 1
      localStorage.setItem('memoryGamesPlayed', updated)
      return updated
    })

    setMemoryHistory(previous => {
  const timeTaken = memoryStartTime
  ? Math.round((Date.now() - memoryStartTime) / 1000)
  : 0

const updated = [
  ...previous,
  {
    name: 'Memory Match',
    moves: moves,
    score: Math.max(0, 150 - moves * 5),
    accuracy: Math.min(100, Math.round((6 / moves) * 100)),
    time: timeTaken,
    date: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }
]
  localStorage.setItem(
    'mindmateMemoryHistory',
    JSON.stringify(updated)
  )

  return updated
})
  }
}, [gameComplete, memoryStartTime])
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
              <h2>Pattern Recognition</h2>
              <p>Train your reasoning and
pattern recognition.</p>

              <button
  className="primary-btn"
  onClick={() => setPage('focus')}
>
  Play Game →
</button>
            </div>

            <div className="game-card">
              <div className="game-icon">⚡</div>
              <h2>Story Recall</h2>
              <p>Test how quickly you can remember.</p>

             <button
  className="primary-btn"
  onClick={() => setPage('story')}
>
  Play Game →
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

    {/* MEMORY MATCH */}
    <section className="progress-section">

      <h2 className="section-title">🧠 Memory Match</h2>

      <div className="memory-summary">

        <div className="summary-item">
          <span>Games Played</span>
          <strong>{validMemoryHistory.length}</strong>
        </div>

        <div className="summary-item">
          <span>Total Points</span>
          <strong>
            {validMemoryHistory.reduce(
              (total, attempt) => total + attempt.score,
              0
            )}
          </strong>
        </div>

        <div className="summary-item">
          <span>Average Accuracy</span>
          <strong>
            {validMemoryHistory.length
              ? (
                  validMemoryHistory.reduce(
                    (total, attempt) => total + attempt.accuracy,
                    0
                  ) / validMemoryHistory.length
                ).toFixed(1)
              : 0}
            %
          </strong>
        </div>

        <div className="summary-item">
          <span>Best Accuracy</span>
          <strong>
            {validMemoryHistory.length
              ? Math.max(
                  ...validMemoryHistory.map(
                    attempt => attempt.accuracy
                  )
                )
              : 0}
            %
          </strong>
        </div>

        <div className="summary-item">
          <span>Average Time</span>
          <strong>
            {validMemoryHistory.filter(
              attempt => typeof attempt.time === 'number'
            ).length
              ? (
                  validMemoryHistory
                    .filter(
                      attempt => typeof attempt.time === 'number'
                    )
                    .reduce(
                      (total, attempt) => total + attempt.time,
                      0
                    ) /
                  validMemoryHistory.filter(
                    attempt => typeof attempt.time === 'number'
                  ).length
                ).toFixed(1)
              : 0}
            s
          </strong>
        </div>

        <div className="summary-item">
          <span>Best Time</span>
          <strong>
            {validMemoryHistory.filter(
              attempt => typeof attempt.time === 'number'
            ).length
              ? Math.min(
                  ...validMemoryHistory
                    .filter(
                      attempt => typeof attempt.time === 'number'
                    )
                    .map(attempt => attempt.time)
                )
              : 0}
            s
          </strong>
        </div>

        <div className="summary-item">
          <span>Best Moves</span>
          <strong>
            {validMemoryHistory.length
              ? Math.min(
                  ...validMemoryHistory.map(
                    attempt => attempt.moves
                  )
                )
              : 0}
          </strong>
        </div>

        <div className="summary-item">
          <span>Average Moves</span>
          <strong>
            {validMemoryHistory.length
              ? (
                  validMemoryHistory.reduce(
                    (total, attempt) => total + attempt.moves,
                    0
                  ) / validMemoryHistory.length
                ).toFixed(1)
              : 0}
          </strong>
        </div>

        <div className="summary-item">
          <span>Latest Attempt</span>
          <strong>
            {validMemoryHistory.length
              ? validMemoryHistory[
                  validMemoryHistory.length - 1
                ].moves
              : 0}
          </strong>
        </div>
        <div className="summary-item">
  <span>Latest Accuracy</span>
  <strong>
    {validMemoryHistory.length
      ? validMemoryHistory[
          validMemoryHistory.length - 1
        ].accuracy
      : 0}
    %
  </strong>
</div>

      </div>

      <div className="progress-details">

        {/* RECENT ATTEMPTS */}
        <div className="progress-card">

          <h2>📋 Recent Attempts</h2>

          {validMemoryHistory.length === 0 ? (
            <p>No attempts yet.</p>
          ) : (
            <div className="attempt-list">

              {validMemoryHistory
                .slice(-5)
                .reverse()
                .map((attempt, index) => (

                  <div className="attempt-item" key={index}>

                    <div>
                      <strong>
                        Attempt {validMemoryHistory.length - index}
                      </strong>

                      <small>
                        {attempt.date}
                      </small>
                    </div>

                    <div className="attempt-stats">
                      <span>{attempt.moves} moves</span>
                      <span>{attempt.score} pts</span>
                      <span>{attempt.accuracy}% accuracy</span>

                      <span>
                        {typeof attempt.time === 'number'
                          ? `${attempt.time}s`
                          : 'Time not recorded'}
                      </span>
                    </div>

                  </div>

                ))}

            </div>
          )}

        </div>

        {/* PROGRESS CHART */}
        <div className="progress-card">

          <h2>📈 Performance Over Time</h2>

          {validMemoryHistory.length === 0 ? (
            <p>No progress data yet.</p>
          ) : (
            <div className="progress-chart">

              {validMemoryHistory.map((attempt, index) => (

                <div className="chart-item" key={index}>

                  <div className="chart-label">
                    Attempt {index + 1}
                  </div>

                  <div className="chart-bar-container">

                    <div
                      className="chart-bar"
                      style={{
                        width: `${attempt.accuracy}%`
                      }}
                    >
                      {attempt.accuracy}%
                    </div>

                  </div>

                  <small>
                    {attempt.moves} moves
                  </small>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>

    </section>

    {/* PATTERN RECOGNITION */}
<section className="progress-section">

  <h2 className="section-title">🎯 Pattern Recognition</h2>

  {/* SUMMARY */}
  <div className="memory-summary">
    

  {/* Games Played */}
  <div className="summary-item">
  <span>Games Played</span>
  <strong>{patternHistory.length}</strong>
</div>
<div className="summary-item">
  <span>Total Points</span>
  <strong>
    {patternHistory.reduce(
      (total, attempt) => total + attempt.points,
      0
    )}
  </strong>
</div>
<div className="summary-item">
  <span>Average Accuracy</span>
  <strong>
    {patternHistory.length
      ? (
          patternHistory.reduce(
            (total, attempt) => total + attempt.accuracy,
            0
          ) / patternHistory.length
        ).toFixed(1)
      : 0}
    %
  </strong>
</div>
  <div className="summary-item">
  <span>Best Accuracy</span>
  <strong>
    {patternHistory.length
      ? Math.max(
          ...patternHistory.map(
            attempt => attempt.accuracy
          )
        )
      : 0}
    %
  </strong>
</div>

 
  
  <div className="summary-item">
  <span>Average Time</span>
  <strong>
    {patternHistory.filter(
      attempt => typeof attempt.time === 'number'
    ).length
      ? (
          patternHistory
            .filter(
              attempt => typeof attempt.time === 'number'
            )
            .reduce(
              (total, attempt) => total + attempt.time,
              0
            ) /
          patternHistory.filter(
            attempt => typeof attempt.time === 'number'
          ).length
        ).toFixed(1)
      : 0}
    s
  </strong>
</div>
  
<div className="summary-item">
  <span>Best Time</span>
  <strong>
    {patternHistory.filter(
      attempt => typeof attempt.time === 'number'
    ).length
      ? Math.min(
          ...patternHistory
            .filter(
              attempt => typeof attempt.time === 'number'
            )
            .map(attempt => attempt.time)
        )
      : 0}
    s
  </strong>
</div>


<div className="summary-item">
  <span>Best Moves</span>
  <strong>
    {patternHistory.length
      ? Math.max(
          ...patternHistory.map(
            attempt => attempt.score
          )
        )
      : 0}
    /5
  </strong>
</div>

  
  <div className="summary-item">
  <span>Average Moves</span>
  <strong>
    {patternHistory.length
      ? (
          patternHistory.reduce(
            (total, attempt) => total + attempt.score,
            0
          ) / patternHistory.length
        ).toFixed(1)
      : 0}
    /5
  </strong>
</div>

  
  <div className="summary-item">
  <span>Latest Attempt</span>
  <strong>
    {patternHistory.length
      ? patternHistory[patternHistory.length - 1].score
      : 0}
    /5
  </strong>
</div>

  
  <div className="summary-item">
  <span>Latest Accuracy</span>
  <strong>
    {patternHistory.length
      ? patternHistory[patternHistory.length - 1].accuracy
      : 0}
    %
  </strong>
</div>

 
</div>
  {/* RECENT ATTEMPTS */}
  {/* RECENT ATTEMPTS + PERFORMANCE */}
<div className="progress-details">

  {/* RECENT ATTEMPTS */}
  <div className="progress-card">

    <h2>📋 Recent Attempts</h2>

    {patternHistory.length === 0 ? (
      <p>No attempts yet.</p>
    ) : (
      <div className="attempt-list">

        {patternHistory
          .slice(-5)
          .reverse()
          .map((attempt, index) => (

            <div
              className="attempt-item"
              key={index}
            >

              <div className="attempt-heading">

                <strong>
                  Attempt {patternHistory.length - index}
                </strong>

                <small>
                  {attempt.date}
                </small>

              </div>

              <div className="attempt-stats">

                <span>
                  {attempt.score}/5 score
                </span>

                <span>
                  {attempt.accuracy}% accuracy
                </span>

                <span>
                  {attempt.points} pts
                </span>
               <span>
  {typeof attempt.time === 'number'
    ? `${attempt.time}s`
    : 'Time not recorded'}
</span>

              </div>

            </div>

          ))}

      </div>
    )}

  </div>


  {/* PERFORMANCE OVER TIME */}
  <div className="progress-card">

    <h2>📈 Performance Over Time</h2>

    {patternHistory.length === 0 ? (
      <p>No progress data yet.</p>
    ) : (
      <div className="progress-chart">

        {patternHistory.map((attempt, index) => (

          <div
            className="chart-item"
            key={index}
          >

            <div className="chart-label">
              Attempt {index + 1}
            </div>

            <div className="chart-bar-container">

              <div
                className="chart-bar"
                style={{
                  width: `${attempt.accuracy}%`
                }}
              >
                {attempt.accuracy}%
              </div>

            </div>

            <small>
              {attempt.score}/5 score
            </small>

          </div>

        ))}

      </div>
    )}

  </div>

</div>

</section>

    {/* STORY RECALL */}
    <section className="progress-section">

  <h2 className="section-title">⚡ Story Recall</h2>

  <div className="memory-summary">

    <div className="summary-item">
      <span>Games Played</span>
      <strong>{storyRecallHistory.length}</strong>
    </div>

    <div className="summary-item">
      <span>Total Points</span>
      <strong>
        {storyRecallHistory.reduce(
          (total, attempt) => total + attempt.points,
          0
        )}
      </strong>
    </div>

    <div className="summary-item">
      <span>Average Accuracy</span>
      <strong>
        {storyRecallHistory.length
          ? (
              storyRecallHistory.reduce(
                (total, attempt) => total + attempt.accuracy,
                0
              ) / storyRecallHistory.length
            ).toFixed(1)
          : 0}
        %
      </strong>
    </div>

    <div className="summary-item">
      <span>Best Accuracy</span>
      <strong>
        {storyRecallHistory.length
          ? Math.max(
              ...storyRecallHistory.map(
                attempt => attempt.accuracy
              )
            )
          : 0}
        %
      </strong>
    </div>
    <div className="summary-item">
  <span>Average Time</span>
  <strong>
    {storyRecallHistory.filter(
      attempt => typeof attempt.time === 'number'
    ).length
      ? (
          storyRecallHistory
            .filter(
              attempt => typeof attempt.time === 'number'
            )
            .reduce(
              (total, attempt) => total + attempt.time,
              0
            ) /
          storyRecallHistory.filter(
            attempt => typeof attempt.time === 'number'
          ).length
        ).toFixed(1)
      : 0}
    s
  </strong>
</div>
<div className="summary-item">
  <span>Best Time</span>
  <strong>
    {storyRecallHistory.filter(
      attempt => typeof attempt.time === 'number'
    ).length
      ? Math.min(
          ...storyRecallHistory
            .filter(
              attempt => typeof attempt.time === 'number'
            )
            .map(attempt => attempt.time)
        )
      : 0}
    s
  </strong>
</div>

    <div className="summary-item">
      <span>Best Moves</span>
      <strong>
        {storyRecallHistory.length
          ? Math.max(
              ...storyRecallHistory.map(
                attempt => attempt.score
              )
            )
          : 0}
        /2
      </strong>
    </div>

    <div className="summary-item">
      <span>Average Moves</span>
      <strong>
        {storyRecallHistory.length
          ? (
              storyRecallHistory.reduce(
                (total, attempt) => total + attempt.score,
                0
              ) / storyRecallHistory.length
            ).toFixed(1)
          : 0}
        /2
      </strong>
    </div>

    <div className="summary-item">
      <span>Latest Attempt</span>
      <strong>
        {storyRecallHistory.length
          ? storyRecallHistory[
              storyRecallHistory.length - 1
            ].score
          : 0}
        /2
      </strong>
    </div>
    <div className="summary-item">
  <span>Latest Accuracy</span>
  <strong>
    {storyRecallHistory.length
      ? storyRecallHistory[
          storyRecallHistory.length - 1
        ].accuracy
      : 0}
    %
  </strong>
</div>

    

  </div>

  <div className="progress-details">

    <div className="progress-card">

      <h2>📋 Recent Attempts</h2>

      {storyRecallHistory.length === 0 ? (
        <p>No attempts yet.</p>
      ) : (
        <div className="attempt-list">

          {storyRecallHistory
            .slice(-5)
            .reverse()
            .map((attempt, index) => (

              <div
                className="attempt-item"
                key={index}
              >

                <div className="attempt-heading">

                  <strong>
                    Attempt {storyRecallHistory.length - index}
                  </strong>

                  <small>
                    {attempt.date}
                  </small>

                </div>

                <div className="attempt-stats">

                  <span>
                    {attempt.score}/2 score
                  </span>
                  <span>
  {typeof attempt.time === 'number'
    ? `${attempt.time}s`
    : 'Time not recorded'}
</span>

                  <span>
                    {attempt.accuracy}% accuracy
                  </span>

                  <span>
                    {attempt.points} pts
                  </span>

                </div>

              </div>

            ))}

        </div>
      )}

    </div>

    <div className="progress-card">

      <h2>📈 Performance Over Time</h2>

      {storyRecallHistory.length === 0 ? (
        <p>No progress data yet.</p>
      ) : (
        <div className="progress-chart">

          {storyRecallHistory.map((attempt, index) => (

            <div
              className="chart-item"
              key={index}
            >

              <div className="chart-label">
                Attempt {index + 1}
              </div>

              <div className="chart-bar-container">

                <div
                  className="chart-bar"
                  style={{
                    width: `${attempt.accuracy}%`
                  }}
                >
                  {attempt.accuracy}%
                </div>

              </div>

              <small>
                {attempt.score}/2 score
              </small>

            </div>

          ))}

        </div>
      )}

    </div>

  </div>

</section>

  </main>
)}
      {page === 'focus' && (
        <main className="focus-page">

          <button className="back-btn" onClick={goToGames}>
            ← Back to Games
          </button>

          <h1>Pattern Recognition 🧠</h1>

          <p>Train your reasoning, attention, and pattern recognition.</p>

          
            <div className="focus-game">

  {!focusStarted ? (
    <>
      <h2>Ready to Play?</h2>

      <p>
       Find the pattern and choose what comes next!
      </p>

      <button
  className="primary-btn"
  onClick={() => {
    setPatternQuestion(0)
    setPatternScore(0)
    setPatternComplete(false)
    setPatternStartTime(Date.now())
    setFocusStarted(true)
  }}
>
  Start Game →
</button>
    </>
  ) : (
    <>
  {patternComplete ? (
    <>
      <h2>🎉 Great Job!</h2>

      <p>You completed Pattern Recognition!</p>

      <strong>
        Your Score: {patternScore} / 5
      </strong>

      <br />
      <br />

      <button
        className="primary-btn"
        onClick={() => {
          setPatternQuestion(0)
          setPatternScore(0)
          setPatternComplete(false)
          setFocusStarted(false)
        }}
      >
        Play Again
      </button>

      <br />
      <br />

      <button
        className="secondary-btn"
        onClick={() => {
          setPatternQuestion(0)
          setPatternScore(0)
          setPatternComplete(false)
          setFocusStarted(false)
          setPage('games')
        }}
      >
        Back to Games
      </button>
    </>
  ) : (
    <>
      <h2>Pattern Recognition 🧠</h2>

      <p>What comes next in the pattern?</p>

      <strong>
        Question {patternQuestion + 1} / {patternQuestions.length}
      </strong>

      <div className="pattern-sequence">
        {patternQuestions[patternQuestion].sequence.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </div>
<h3>Answer Options</h3>
      <div className="pattern-options">
        {patternQuestions[patternQuestion].options.map((option) => (
          <button
            key={option}
            className="pattern-option"
            onClick={() => {
              if (patternComplete) return

              if (option === patternQuestions[patternQuestion].answer) {
                setPatternScore(prev => prev + 1)
              }

              if (patternQuestion < patternQuestions.length - 1) {
                setPatternQuestion(prev => prev + 1)
             } else {
  setPatternComplete(true)
}
            }}
          >
            {option}
          </button>
        ))}
      </div>

      <strong>Score: {patternScore} / 5</strong>
    </>
  )}
</>
  )}

</div>

        </main>
      )}
      {page === 'story' && (
  <main className="focus-page">

    <button className="back-btn" onClick={goToGames}>
      ← Back to Games
    </button>

    <h1>Story Recall 📖</h1>

    <p>
      Listen to a short story and remember the important details.
    </p>

    <div className="story-game">

      {!storyRecallStarted ? (
        <>
          <h2>Ready to Play?</h2>

          <p>
            Listen carefully to the story, then answer a few simple questions.
          </p>

          <button
            className="primary-btn"
            onClick={() => {
              setStoryRecallStarted(true)
              setStoryRecallQuestion(-1)
              setStoryRecallScore(0)
              setStoryRecallComplete(false)
              setStoryRecallStartTime(Date.now())
              setStoryRecallReplayUsed(false)
              setStoryRecallHasPlayed(false)
              setStoryRecallShowAnswers(false)
            }}
          >
            Start Game →
          </button>
        </>
      ) : storyRecallQuestion === -1 ? (
        <>
          <h2>Listen to the Story 🎧</h2>

          <p>
            Tap the speaker to hear the story. You can listen again anytime.
          </p>

          <button
            className="story-speaker"
            disabled={storyRecallReplayUsed}
            onClick={() => {
              if (!storyRecallHasPlayed) {
                speakText(storyRecallStories[0].story, () => {
                  setStoryRecallHasPlayed(true)
                })
              } else if (!storyRecallReplayUsed) {
                speakText(storyRecallStories[0].story, () => {
                  setStoryRecallReplayUsed(true)
                })
              }
            }}
          >
            <span className="speaker-icon">🔊</span>
            <span>
              {storyRecallHasPlayed ? 'Listen Again' : 'Hear the Story'}
            </span>
          </button>

          <br />
          <br />

          <button
            className="secondary-btn"
            onClick={() => {
              window.speechSynthesis.cancel()
              setStoryRecallQuestion(0)
            }}
          >
            Ask Questions →
          </button>
        </>
      ) : storyRecallComplete ? (
        <>
          <h2>
            {storyRecallScore === 2
              ? '🌟 Excellent!'
              : storyRecallScore === 1
              ? '👍 Good Effort!'
              : '🌱 Nice Try!'}
          </h2>

          <p>
            {storyRecallScore === 2
              ? 'You remembered all the important details!'
              : storyRecallScore === 1
              ? 'You remembered some of the important details.'
              : 'That was a tricky one. Keep practicing!'}
          </p>

          <strong>
            You answered {storyRecallScore} out of 2 questions correctly.
          </strong>

          <br />
          <br />

          <button
            className="secondary-btn"
            onClick={() => setStoryRecallShowAnswers(true)}
          >
            📖 View Answers
          </button>

          {storyRecallShowAnswers && (
            <div className="story-answers">
              <h3>Answers</h3>

              {storyRecallStories[0].questions.map((item, index) => (
                <div className="story-answer-card" key={index}>
                  <p>
                    <strong>Question {index + 1}</strong>
                  </p>

                  <p>{item.question}</p>

                  <p>✓ Correct answer: {item.answer}</p>
                </div>
              ))}
            </div>
          )}

          <br />
          <br />

          <button
            className="primary-btn"
            onClick={() => {
              setStoryRecallStarted(false)
              setStoryRecallQuestion(-1)
              setStoryRecallScore(0)
              setStoryRecallComplete(false)
              setStoryRecallHasPlayed(false)
              setStoryRecallReplayUsed(false)
              setStoryRecallShowAnswers(false)
            }}
          >
            Play Again
          </button>

          <br />
          <br />

          <button
            className="secondary-btn"
            onClick={() => {
              setStoryRecallStarted(false)
              setStoryRecallQuestion(-1)
              setStoryRecallScore(0)
              setStoryRecallComplete(false)
              setStoryRecallHasPlayed(false)
              setStoryRecallReplayUsed(false)
              setStoryRecallShowAnswers(false)
              setPage('games')
            }}
          >
            Back to Games
          </button>
        </>
      ) : (
        <>
          <h2>Question {storyRecallQuestion + 1}</h2>

          <p>
            {storyRecallStories[0].questions[storyRecallQuestion].question}
          </p>

          <div className="story-options">
            {storyRecallStories[0].questions[
              storyRecallQuestion
            ].options.map((option) => (
              <button
                key={option}
                className="story-option"
                onClick={() => {
                  const currentQuestion =
                    storyRecallStories[0].questions[storyRecallQuestion]

                  if (option === currentQuestion.answer) {
                    setStoryRecallScore(prev => prev + 1)
                  }

                  if (
                    storyRecallQuestion <
                    storyRecallStories[0].questions.length - 1
                  ) {
                    setStoryRecallQuestion(prev => prev + 1)
                  } else {
  const finalScore =
    storyRecallScore +
    (option === currentQuestion.answer ? 1 : 0)

  const accuracy = (finalScore / 2) * 100
  const timeTaken = storyRecallStartTime
  ? Math.round((Date.now() - storyRecallStartTime) / 1000)
  : 0

  setStoryRecallHistory(previous => {
  const updated = [
    ...previous,
    {
      score: finalScore,
      accuracy: accuracy,
      points: finalScore * 10,
      time: timeTaken,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
  ]

  localStorage.setItem(
    'mindmateStoryRecallHistory',
    JSON.stringify(updated)
  )

  return updated
})

  setStoryRecallComplete(true)
}
                }}
              >
                {option}
              </button>
            ))}
          </div>
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