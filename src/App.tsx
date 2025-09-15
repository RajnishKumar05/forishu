import { useState, useMemo, type FormEvent } from 'react';
import './App.css'; // Import the styles

// ========================================================================
// === STEP 1: ADD YOUR PHOTOS & PROMPTS HERE ===
// ========================================================================
// INSTRUCTIONS:
// 1. In your project, create a folder named `public` at the top level (next to `src`).
// 2. Place your image files inside this new `public` folder (e.g., `photo1.jpg`, `our-trip.png`).
// 3. Update the `imageUrl` for each item below to point to your photos (e.g., '/photo1.jpg').
// 4. Customize the `prompt` for each image.
//
const memoriesData = [
  {
    id: 1,
    imageUrl: '/love.jpg',
    prompt: "What do you remember about this day?"
  },
  {
    id: 2,
    imageUrl: '/love1.jpg',
    prompt: "Tell me about this moment?"
  },
  {
    id: 3,
    imageUrl: '/love3.jpg',
    prompt: "Tell me about this picture."
  },
  {
    id: 4,
    imageUrl: '/love2.jpg',
    prompt: "This was such a fun trip! What was your favorite moment?"
  },  
];
// ========================================================================


const HeartRain = () => {
  const hearts = useMemo(() => {
    const heartArray = [];
    const numberOfHearts = 25;
    for (let i = 0; i < numberOfHearts; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${5 + Math.random() * 5}s`,
        fontSize: `${1 + Math.random()}rem`,
      };
      heartArray.push(<div key={i} className="heart" style={style}>♥</div>);
    }
    return heartArray;
  }, []);
  return <div className="heart-rain-container">{hearts}</div>;
};

const quizData = [
  { question: "Which of your adorable traits makes my heart flutter?", options: ["Your humor", "Your cute chubby face", "Your singing", "Your fashion"], correctAnswer: "Your cute cubby face" },
  { question: "What quality of yours do I find the most beautiful?", options: ["Your kindness", "Your intelligence", "Your beautiful innocence", "Your confidence"], correctAnswer: "Your beautiful innocence" },
  { question: "Besides your heart, what am I completely in love with?", options: ["Your voice", "Your hands", "Your amazing body shape", "Your hair"], correctAnswer: "Your amazing body shape" },
  { question: "What final sweet quality makes you perfect to me?", options: ["Your politeness", "Your ambition", "Your laugh", "Your taste in movies"], correctAnswer: "Your politeness" },
];

// --- NEW: Memory Album Component ---
const MemoryAlbum = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    // We create a state to hold the text she writes for each photo.
    const [userMemories, setUserMemories] = useState(Array(memoriesData.length).fill(''));
    const [albumFinished, setAlbumFinished] = useState(false);

    const handleMemoryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newMemories = [...userMemories];
        newMemories[currentIndex] = event.target.value;
        setUserMemories(newMemories);
    };

    const handleNext = () => {
        if (currentIndex < memoriesData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (albumFinished) {
        return (
            <div className="final-message">
  <h1 className="title">Forever Unlocked</h1>
  <p className="poem">
    My heart was always waiting for you to open it. <br/>
    Step inside and relive the story of us.
  </p>
</div>
        )
    }

    return (
        <div className="album-container">
            <div className="album-content">
                <h2 className="album-title">Our Memories</h2>
                <img
                    key={currentIndex} // This makes the animation re-trigger on change
                    src={memoriesData[currentIndex].imageUrl}
                    alt="Our Memory"
                    className="album-image"
                />
                <p className="memory-prompt">{memoriesData[currentIndex].prompt}</p>
                <textarea
                    className="memory-textarea"
                    placeholder="Write what you remember here..."
                    value={userMemories[currentIndex]}
                    onChange={handleMemoryChange}
                />
            </div>
            <div className="album-navigation">
                <button onClick={handlePrev} className="nav-button" disabled={currentIndex === 0}>
                    Previous
                </button>
                <p className="progress-indicator">{currentIndex + 1} / {memoriesData.length}</p>
                {currentIndex === memoriesData.length - 1 ? (
                     <button onClick={() => setAlbumFinished(true)} className="nav-button finish-button">
                        Finish
                    </button>
                ) : (
                    <button onClick={handleNext} className="nav-button" disabled={currentIndex === memoriesData.length - 1}>
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};


// --- Main App Component ---
function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  // --- Updated Game State for New Animations ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState<string[]>([]);
  const [heartBurst, setHeartBurst] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const handleAnswerClick = (answer: string) => {
    if (isAnswering) return;

    if (answer === quizData[currentQuestionIndex].correctAnswer) {
      setIsAnswering(true);
      setHeartBurst(answer); // Trigger the heart burst animation

      setTimeout(() => {
        if (currentQuestionIndex < quizData.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setIncorrectAnswers([]); // Reset faded buttons for the next question
          setHeartBurst(null);
          setIsAnswering(false);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    } else {
      // Add the incorrect answer to the list of faded buttons
      setIncorrectAnswers(prev => [...prev, answer]);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (inputValue.trim().toLowerCase() === 'ishika dubey') {
      setAuthenticated(true);
      setError('');
    } else {
      setError("That name doesn't unlock my heart...");
      setInputValue('');
    }
  };

  return (
    <div className="container">
      <HeartRain />
      <div className="shimmer-effect">{[...Array(10)].map((_, i) => <span key={i}></span>)}</div>

      {!isAuthenticated ? (
        <div className="login-container">
          <h2 className="login-prompt">What is the name of my love?</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <input type="text" className="name-input" placeholder="Enter your full name" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <button type="submit" className="submit-button">Unlock My Heart</button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      ) : (
        <div className="game-container">
          {!gameFinished ? (
            // --- Game View ---
            <>
              <p className="question-text">{quizData[currentQuestionIndex].question}</p>
              <div className="options-grid">
                {quizData[currentQuestionIndex].options.map((option) => (
                  <div key={option} className="option-button-container">
                    <button
                      className={`option-button ${incorrectAnswers.includes(option) ? 'faded' : ''}`}
                      onClick={() => handleAnswerClick(option)}
                      disabled={incorrectAnswers.includes(option) || isAnswering}
                    >
                      {option}
                    </button>
                    {heartBurst === option && <div className="heart-burst">♥</div>}
                  </div>
                ))}
              </div>
              <div className="feedback-message"></div> {/* Placeholder for alignment */}
            </>
          ) : (
            // When the game is finished, render the Memory Album instead of the text message
            <MemoryAlbum />
          )}
        </div>
      )}
    </div>
  );
}

export default App;