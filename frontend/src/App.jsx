import { useState, useEffect } from 'react'
import './App.css'
import { getNextDifficulty } from './adaptiveDifficulty'

const cardsData = [
  '🎋', '🎋',
  '🌸', '🌸',
  '🐘', '🐘',
  '🦋', '🦋',
  '🍵', '🍵',
  '🌿', '🌿',
  '🥟', '🥟',
  '🍚', '🍚',
  '🌾', '🌾',
  '🐦', '🐦',
  '🏞️', '🏞️',
  '🥁', '🥁'
]

function shuffleCards(pairCount = 12) {
  const selectedCards = cardsData.slice(0, pairCount * 2)

  return [...selectedCards]
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
  const [memoryDifficulty, setMemoryDifficulty] = useState('easy')
  const [cards, setCards] = useState(shuffleCards())
  const [selected, setSelected] = useState([])
  const [moves, setMoves] = useState(0)
  const [memoryGamesPlayed, setMemoryGamesPlayed] = useState(0)
  const [focusStarted, setFocusStarted] = useState(false)
const [focusScore, setFocusScore] = useState(0)
const [patternQuestion, setPatternQuestion] = useState(0)
const [patternScore, setPatternScore] = useState(0)
const [patternAnswered, setPatternAnswered] = useState(false)
const [patternComplete, setPatternComplete] = useState(false)
const [patternDifficulty, setPatternDifficulty] = useState('easy')
const [storyRecallStarted, setStoryRecallStarted] = useState(false)
const [storyRecallQuestion, setStoryRecallQuestion] = useState(-1)
const [storyRecallComplete, setStoryRecallComplete] = useState(false)
const [storyRecallScore, setStoryRecallScore] = useState(0)
const [storyRecallHasPlayed, setStoryRecallHasPlayed] = useState(false)
const [storyRecallReplayUsed, setStoryRecallReplayUsed] = useState(false)
const [storyRecallIsPlaying, setStoryRecallIsPlaying] = useState(false)
const [storyRecallShowAnswers, setStoryRecallShowAnswers] = useState(false)
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
   const patternQuestions = [
  // 🟢 EASY — Simple Recognition

  {
    level: 'Easy',
    prompt: 'Complete the pattern:',
    sequence: ['🪙', '→', '🪙 🪙', '→', '🪙 🪙 🪙', '→', '?'],
    options: ['🪙 🪙 🪙 🪙', '🪙 🪙', '🪙 🪙 🪙 🪙 🪙'],
    answer: '🪙 🪙 🪙 🪙'
  },

  {
    level: 'Easy',
    prompt: 'Four bamboo baskets have the same weave pattern. One basket is different. Tap the different basket.',
    sequence: ['🧺', '🧺', '🧺', '🧺', '🧺'],
    options: ['🧺 1', '🧺 2', '🧺 3', '🧺 4', '🧺 5'],
    answer: '🧺 3'
  },

  {
    level: 'Easy',
    prompt: 'What comes next in the size pattern?',
    sequence: ['Small teacup', '→', 'Medium teacup', '→', 'Large teacup', '→', '?'],
    options: ['Extra-large teacup', 'Small kettle', 'Large plate'],
    answer: 'Extra-large teacup'
  },

  // 🟡 MEDIUM — Combine Information

  {
    level: 'Medium',
    prompt: 'Complete the pattern using both size and shade:',
    sequence: [
      'Small, light basket',
      '→',
      'Medium, darker basket',
      '→',
      'Large, darkest basket',
      '→',
      '?'
    ],
    options: [
      'Extra-large, darkest basket',
      'Small, light basket',
      'Medium, light basket'
    ],
    answer: 'Extra-large, darkest basket'
  },

  {
    level: 'Medium',
    prompt: 'Complete the number pattern:',
    sequence: ['🧵 1 spool', '→', '🧵 2 spools', '→', '🧵 4 spools', '→', '?'],
    options: ['🧵 6 spools', '🧵 8 spools', '🧵 10 spools'],
    answer: '🧵 8 spools'
  },

  {
    level: 'Medium',
    prompt: 'Which row comes next in the pattern?',
    sequence: [
      '🌸 🎋 🌸 🎋',
      '🎋 🌸 🎋 🌸',
      '🌸 🎋 🌸 🎋',
      '?'
    ],
    options: [
      '🌸 🎋 🌸 🎋',
      '🎋 🌸 🎋 🌸',
      '🌸 🌸 🎋 🎋'
    ],
    answer: '🎋 🌸 🎋 🌸'
  },

  // 🔴 HARD — Varied Reasoning

  {
    level: 'Hard',
    prompt: 'Dhol is used to create rhythm. Flute is used to create...?',
    sequence: ['🥁 Dhol', '→', 'Rhythm', '   |   ', '🪈 Flute', '→', '?'],
    options: ['Melody', 'Cooking', 'Farming'],
    answer: 'Melody'
  },

  {
    level: 'Hard',
    prompt: 'Brick is used to make a solid wall. Woven bamboo is used to make a...?',
    sequence: ['Brick', '→', 'Solid wall', '   |   ', 'Woven bamboo', '→', '?'],
    options: ['Mat or screen', 'Metal wheel', 'Toy car'],
    answer: 'Mat or screen'
  },

  {
    level: 'Hard',
    prompt: 'Rhinoceros lives in grassland. Red panda lives in...?',
    sequence: ['🦏 Rhinoceros', '→', 'Grassland', '   |   ', '🐼 Red panda', '→', '?'],
    options: ['Bamboo forest', 'Sandy beach', 'Open desert'],
    answer: 'Bamboo forest'
  }
]
const currentPatternQuestions = patternQuestions.filter(
  question => question.level.toLowerCase() === patternDifficulty
)
function getNextPatternDifficulty(currentDifficulty, score) {
  if (currentDifficulty === 'easy') {
    if (score === 3) return 'medium'
    return 'easy'
  }

  if (currentDifficulty === 'medium') {
    if (score === 3) return 'hard'
    if (score <= 1) return 'easy'
    return 'medium'
  }

  if (currentDifficulty === 'hard') {
    if (score >= 2) return 'hard'
    return 'medium'
  }

  return 'easy'
}
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

  const pairCount =
    memoryDifficulty === 'easy'
      ? 3
      : memoryDifficulty === 'medium'
      ? 6
      : 12

  setCards(shuffleCards(pairCount))

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
  if (gameComplete && cards.length > 0) {
    setMemoryGamesPlayed(previous => previous + 1)

    const pairCount = cards.length / 2

    const nextDifficulty = getNextDifficulty(
      memoryDifficulty,
      moves,
      pairCount
    )

    setMemoryDifficulty(nextDifficulty)
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
        onClick={() => setFocusStarted(true)}
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
        Your Score: {patternScore} / 3
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

      <p>{currentPatternQuestions[patternQuestion].prompt}</p>

      <strong>
        Question {patternQuestion + 1} / {currentPatternQuestions.length}
      </strong>

      <div className="pattern-sequence">
        {currentPatternQuestions[patternQuestion].sequence.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </div>
<h3>Answer Options</h3>
      <div className="pattern-options">
        {currentPatternQuestions[patternQuestion].options.map((option) => (
          <button
            key={option}
            className="pattern-option"
           onClick={() => {
  if (patternComplete) return

  const isCorrect =
    option === currentPatternQuestions[patternQuestion].answer

  const newScore = patternScore + (isCorrect ? 1 : 0)

  setPatternScore(newScore)

  if (patternQuestion < currentPatternQuestions.length - 1) {
    setPatternQuestion(prev => prev + 1)
  } else {
    const nextDifficulty = getNextPatternDifficulty(
      patternDifficulty,
      newScore
    )

    setPatternDifficulty(nextDifficulty)
    setPatternComplete(true)
  }
}}
          >
            {option}
          </button>
        ))}
      </div>

      <strong>Score: {patternScore} / {patternQuestions.length}</strong>
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
  setStoryRecallReplayUsed(false)
  
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
        setPage('games')
      }}
    >
      Back to Games
    </button>
  </>
) : storyRecallQuestion === -1 ? (
  <>
    <h2>📖 Listen to the Story</h2>

    <p>
      Listen carefully. Try to remember the important details.
    </p>

    <div className="story-box">
      <p>{storyRecallStories[0].story}</p>
    </div>

    <button
      className="primary-btn"
      onClick={() => setStoryRecallQuestion(0)}
    >
      Continue to Questions →
    </button>
  </>
) : (
  <>
    <h2>Question {storyRecallQuestion + 1}</h2>

    <h3>
      {storyRecallStories[0].questions[storyRecallQuestion].question}
    </h3>

    <div className="story-options">
      {storyRecallStories[0].questions[storyRecallQuestion].options.map(
        (option) => (
          <button
            key={option}
            className="story-option"
            onClick={() => {
              const currentQuestion =
                storyRecallStories[0].questions[storyRecallQuestion]

              if (option === currentQuestion.answer) {
                setStoryRecallScore(prev => prev + 1)
              }

              if (storyRecallQuestion < 1) {
                setStoryRecallQuestion(prev => prev + 1)
              } else {
                setStoryRecallComplete(true)
              }
            }}
          >
            {option}
          </button>
        )
      )}
    </div>

    <p>
      Question {storyRecallQuestion + 1} / 2
    </p>
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
             Pairs: {matchedCount / 2} / {cards.length / 2}
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

          <div className={`memory-grid ${memoryDifficulty}`}>
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