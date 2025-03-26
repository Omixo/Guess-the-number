import React, { useState, useEffect } from "react";
import "./styles.css";

const getRandomNumber = () => Math.floor(Math.random() * 10) + 1;

const animeQuotes = [
  "Believe in yourself! - Naruto",
  "Hard work beats talent! - Rock Lee",
  "Plus Ultra! - All Might",
  "I won’t give up, no matter what! - Luffy",
  "The future is ours to shape! - Eren Yeager",
  "Even a small spark can start a fire! - Izuku Midoriya",
];

const AnimeMotivationGame = () => {
  const [targetNumber, setTargetNumber] = useState(getRandomNumber());
  const [guess, setGuess] = useState("");
  const [chances, setChances] = useState(5);
  const [message, setMessage] = useState("Let's play!");
  const [progress, setProgress] = useState(100);
  const [winners, setWinners] = useState(() => {
    const savedWinners = localStorage.getItem("animeGameWinners");
    return savedWinners ? JSON.parse(savedWinners) : [];
  });
  const [playerName, setPlayerName] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(
    animeQuotes[Math.floor(Math.random() * animeQuotes.length)]
  );

  useEffect(() => {
    localStorage.setItem("animeGameWinners", JSON.stringify(winners));
  }, [winners]);

  useEffect(() => {
    if (chances === 0) {
      setMessage(`Game Over! The correct number was ${targetNumber}`);
      setGameOver(true);
    }
  }, [chances, targetNumber]);

  const getRandomQuote = () => {
    return animeQuotes[Math.floor(Math.random() * animeQuotes.length)];
  };

  const handleGuess = () => {
    if (!playerName) {
      setMessage("Please enter your name to play.");
      return;
    }
    if (!guess) {
      setMessage("Please enter a guess!");
      return;
    }

    const numGuess = parseInt(guess, 10);
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 10) {
      setMessage("Enter a valid number between 1 and 10.");
      return;
    }

    if (numGuess === targetNumber) {
      setMessage(`Congratulations ${playerName}! You guessed it right! 🎉`);
      setWinners([...winners, { name: playerName, attempts: 5 - chances + 1 }]);
      setGameOver(true);
    } else {
      const newChances = chances - 1;
      setChances(newChances);
      setProgress((newChances / 5) * 100);
      setMessage(
        numGuess > targetNumber ? "Too high! Try again." : "Too low! Try again."
      );
      setCurrentQuote(getRandomQuote());
    }
    setGuess("");
  };

  const resetGame = () => {
    setTargetNumber(getRandomNumber());
    setChances(5);
    setProgress(100);
    setGuess("");
    setPlayerName("");
    setMessage("Let's play!");
    setGameOver(false);
    setCurrentQuote(getRandomQuote());
  };

  const clearWinners = () => {
    setWinners([]);
    localStorage.removeItem("animeGameWinners");
  };

  return (
    <div className="site-container">
      <header className="fade-in-down">
        <h1>Anime Motivation Game 🎮</h1>
        <p className="anime-quote fade-in">{currentQuote}</p>
      </header>

      <main>
        <section className="game-section">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              disabled={chances < 5 || gameOver}
              aria-label="Player name"
            />
            <input
              type="number"
              min="1"
              max="10"
              placeholder="Enter your guess (1-10)"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={gameOver}
              aria-label="Guess input"
            />
          </div>
          <div className="button-group">
            <button
              onClick={handleGuess}
              disabled={gameOver}
              className={gameOver ? "" : "bounce"}
            >
              Guess
            </button>
            <button onClick={resetGame} className="reset-btn bounce">
              Reset
            </button>
          </div>
          <p
            className={`hint ${message.includes("Too") ? "shake" : ""}`}
            key={message}
          >
            {message}
          </p>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="chances">Chances Left: {chances}</p>
        </section>

        <section className="winners-section">
          <h2>Winners List</h2>
          <div className="winners-list">
            {winners.length > 0 ? (
              winners
                .sort((a, b) => a.attempts - b.attempts)
                .map((winner, index) => (
                  <div
                    key={index}
                    className="winner-item slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="winner-rank">#{index + 1}</span>
                    <span className="winner-name">{winner.name}</span>
                    <span className="winner-details">
                      Attempts: {winner.attempts}
                    </span>
                  </div>
                ))
            ) : (
              <p>No winners yet!</p>
            )}
          </div>
          {winners.length > 0 && (
            <button
              onClick={clearWinners}
              className="reset-btn bounce"
              style={{ marginTop: "1rem" }}
            >
              Clear Winners
            </button>
          )}
        </section>
      </main>
    </div>
  );
};

export default AnimeMotivationGame;
