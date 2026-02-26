import { useState, useEffect } from 'react';
import { fetchCloudLeaderboard, postCloudScore } from '../services/leaderboardService';

export default function Leaderboard({ mode, onBack, onSwitchMode }) {
  const [board, setBoard] = useState(() => getLeaderboard(mode));
  const otherMode = mode === 'modern' ? 'classic' : 'modern';

  useEffect(() => {
    setBoard(getLeaderboard(mode));
    fetchCloudLeaderboard(mode).then((cloudData) => {
      if (cloudData !== null) setBoard(cloudData);
    });
  }, [mode]);

  if (mode === 'classic') {
    const divider = '\u2550'.repeat(38);
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
            <div className="classic-score-display">TOP 10 SCORES</div>
            <br />
            <div className="classic-divider">{divider}</div>
            <br />

            {board.length === 0 ? (
              <div>NO SCORES YET. PLAY A GAME!</div>
            ) : (
              <div className="classic-leaderboard-table">
                <div className="classic-lb-header-row">
                  <span className="classic-lb-rank">RNK</span>
                  <span className="classic-lb-name">NAME</span>
                  <span className="classic-lb-score">SCORE</span>
                  <span className="classic-lb-pct">PCT</span>
                  <span className="classic-lb-date">DATE</span>
                </div>
                <div className="classic-divider">{'\u2500'.repeat(38)}</div>
                {board.map((entry, i) => (
                  <div key={i} className="classic-lb-row">
                    <span className="classic-lb-rank">{String(i + 1).padStart(2, ' ')}.</span>
                    <span className="classic-lb-name">{entry.initials}</span>
                    <span className="classic-lb-score">{entry.score}/{entry.total}</span>
                    <span className="classic-lb-pct">{entry.pct}%</span>
                    <span className="classic-lb-date">{entry.date}</span>
                  </div>
                ))}
              </div>
            )}

            <br />
            <div className="classic-divider">{divider}</div>
            <br />
            <div className="classic-actions">
              <button className="classic-btn" onClick={onBack}>
                [B]ACK
              </button>
              <button className="classic-btn" onClick={() => onSwitchMode(otherMode)}>
                [M]ODERN SCORES
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modern mode leaderboard
  return (
    <div className="leaderboard-screen">
      <h2 className="lb-title">Leaderboard</h2>
      <div className="lb-mode-tabs">
        <button className="lb-tab active" disabled>Modern</button>
        <button className="lb-tab" onClick={() => onSwitchMode('classic')}>Classic</button>
      </div>

      {board.length === 0 ? (
        <p className="lb-empty">No scores yet. Play a game!</p>
      ) : (
        <div className="lb-table">
          <div className="lb-header">
            <span className="lb-col-rank">#</span>
            <span className="lb-col-name">Name</span>
            <span className="lb-col-score">Score</span>
            <span className="lb-col-pct">%</span>
            <span className="lb-col-date">Date</span>
          </div>
          {board.map((entry, i) => (
            <div key={i} className={`lb-row ${i === 0 ? 'lb-gold' : i === 1 ? 'lb-silver' : i === 2 ? 'lb-bronze' : ''}`}>
              <span className="lb-col-rank">{i + 1}</span>
              <span className="lb-col-name">{entry.initials}</span>
              <span className="lb-col-score">{entry.score}/{entry.total}</span>
              <span className="lb-col-pct">{entry.pct}%</span>
              <span className="lb-col-date">{entry.date}</span>
            </div>
          ))}
        </div>
      )}

      <button className="home-btn lb-back-btn" onClick={onBack}>Back</button>
    </div>
  );
}

export function getLeaderboard(mode) {
  try {
    return JSON.parse(localStorage.getItem(`49ers-leaderboard-${mode}`) || '[]');
  } catch {
    return [];
  }
}

export function saveToLeaderboard(mode, entry) {
  const board = getLeaderboard(mode);
  board.push(entry);
  board.sort((a, b) => b.pct - a.pct || new Date(b.date) - new Date(a.date));
  const top10 = board.slice(0, 10);
  localStorage.setItem(`49ers-leaderboard-${mode}`, JSON.stringify(top10));
  postCloudScore(mode, entry);
  return top10;
}
