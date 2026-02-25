import { useEffect } from 'react';

export default function ClassicResultScreen({ score, total, categoryStats, onReplay, onHome, onNewGame, onLeaderboard }) {
  const pct = Math.round((score / total) * 100);

  const getMessage = () => {
    if (pct === 100) return 'PERFECT SCORE! YOU ARE A TRUE FAITHFUL!';
    if (pct >= 80) return 'EXCELLENT! YOU KNOW YOUR NINERS!';
    if (pct >= 60) return 'GOOD JOB, KEEP STUDYING!';
    if (pct >= 40) return 'NOT BAD. HIT THE ARCHIVES!';
    return 'ROOKIE! TIME TO STUDY UP!';
  };

  const divider = '\u2550'.repeat(38);

  // Keyboard support: R to replay, H to go home, L for leaderboard
  useEffect(() => {
    const handler = (e) => {
      const key = e.key.toUpperCase();
      if (key === 'R') onReplay();
      if (key === 'H') onHome();
      if (key === 'L') onLeaderboard();
      if (key === 'M') onNewGame('modern');
      if (key === 'C') onNewGame('classic');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onReplay, onHome, onLeaderboard, onNewGame]);

  return (
    <div className="classic-mode">
      <div className="classic-container">
        <div className="classic-header">
          <h2>COMPUTECH 49ERS TRIVIA</h2>
          <div className="version">v1.0 &mdash; (C) 1983</div>
        </div>

        <div className="classic-result">
          <div className="classic-divider">{divider}</div>
          <br />
          <div className="classic-score-display">
            GAME OVER
            <br /><br />
            SCORE: {score} OUT OF {total}
            <br />
            PERCENTAGE: {pct}%
          </div>
          <br />
          <div className="classic-divider">{divider}</div>
          <br />
          <div className="classic-rating">{getMessage()}</div>
          <br />
          <div className="classic-divider">{divider}</div>

          {Object.keys(categoryStats).length > 0 && (
            <div className="classic-categories">
              <br />
              RESULTS BY CATEGORY:
              <br /><br />
              {Object.entries(categoryStats).map(([cat, stats]) => (
                <div key={cat} className="classic-cat-row">
                  <span className="classic-cat-name">{cat.toUpperCase()}</span>
                  <span className="classic-cat-dots">
                    {'.'.repeat(Math.max(1, 24 - cat.length))}
                  </span>
                  <span className="classic-cat-score">{stats.correct}/{stats.total}</span>
                </div>
              ))}
            </div>
          )}

          <br />
          <div className="classic-actions">
            <button className="classic-btn" onClick={onReplay}>
              [R]UN AGAIN
            </button>
            <button className="classic-btn" onClick={onLeaderboard}>
              [L]EADERBOARD
            </button>
            <button className="classic-btn" onClick={onHome}>
              [H]OME
            </button>
          </div>

          <br />
          <div className="classic-divider">{divider}</div>
          <br />
          <div className="classic-new-game">
            START NEW GAME:
            <br /><br />
            <button className="classic-btn" onClick={() => onNewGame('modern')}>
              [M]ODERN MODE
            </button>
            <button className="classic-btn" onClick={() => onNewGame('classic')}>
              [C]LASSIC MODE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
