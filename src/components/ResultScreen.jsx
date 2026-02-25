export default function ResultScreen({ score, total, categoryStats, onReplay, onHome, onNewGame, onLeaderboard }) {
  const pct = Math.round((score / total) * 100);

  const getMessage = () => {
    if (pct === 100) return "Perfect! You're a true member of the Faithful!";
    if (pct >= 80) return "Impressive! You bleed scarlet and gold!";
    if (pct >= 60) return "Solid! You know your Niners history.";
    if (pct >= 40) return "Not bad — time to rewatch some game film.";
    return "Rookie numbers! Hit the 49ers archives and try again.";
  };

  return (
    <div className="result-screen">
      <div className="score-ring">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" className="ring-bg" />
          <circle
            cx="60" cy="60" r="52"
            className="ring-fill"
            strokeDasharray={`${pct * 3.27} 327`}
            strokeDashoffset="0"
          />
        </svg>
        <div className="score-text">
          <span className="score-pct">{pct}%</span>
          <span className="score-fraction">{score}/{total}</span>
        </div>
      </div>
      <p className="result-message">{getMessage()}</p>

      <div className="category-breakdown">
        <h3>By Category</h3>
        {Object.entries(categoryStats).map(([cat, stats]) => (
          <div key={cat} className="cat-row">
            <span className="cat-name">{cat}</span>
            <div className="cat-bar">
              <div
                className="cat-bar-fill"
                style={{ width: `${stats.total > 0 ? (stats.correct / stats.total) * 100 : 0}%` }}
              />
            </div>
            <span className="cat-score">{stats.correct}/{stats.total}</span>
          </div>
        ))}
      </div>

      <div className="result-actions">
        <button className="replay-btn" onClick={onReplay}>
          Play Again
        </button>
        <button className="home-btn" onClick={onLeaderboard}>
          Leaderboard
        </button>
        <button className="home-btn" onClick={onHome}>
          Home
        </button>
      </div>

      <div className="new-game-section">
        <p className="new-game-label">Start a new game:</p>
        <div className="new-game-actions">
          <button className="new-game-btn modern-btn" onClick={() => onNewGame('modern')}>
            Modern Mode
          </button>
          <button className="new-game-btn classic-btn" onClick={() => onNewGame('classic')}>
            Classic Mode
          </button>
        </div>
      </div>
    </div>
  );
}
