import { useState, useEffect } from 'react';
import { getLeaderboard } from './Leaderboard';
import { fetchCloudLeaderboard } from '../services/leaderboardService';

export default function StartScreen({ onStart, highScore, classicHighScore, onLeaderboard }) {
  const [lbMode, setLbMode] = useState('modern');
  const [board, setBoard] = useState(() => getLeaderboard('modern'));

  useEffect(() => {
    setBoard(getLeaderboard(lbMode));
    fetchCloudLeaderboard(lbMode).then((cloudData) => {
      if (cloudData !== null) setBoard(cloudData);
    });
  }, [lbMode]);

  return (
    <div className="start-screen">
      {/* Background GIF — The Catch */}
      <div className="start-bg-video">
        <img
          src={`${import.meta.env.BASE_URL}the-catch.gif`}
          alt="The Catch — Dwight Clark, 1982 NFC Championship"
        />
        <div className="start-bg-overlay" />
      </div>

      <div className="start-content">
        <div className="logo-container">
          <img src={`${import.meta.env.BASE_URL}49ers-helmet.png`} alt="San Francisco 49ers Helmet" className="helmet-logo" />
        </div>
        <h1>49ers Trivia</h1>
        <p className="tagline">Test your Faithful knowledge by answering 16 questions in honor of the jersey number of the greatest quarterback of all time, Joe Montana</p>

        <div className="mode-select">
          <button className="mode-card modern-card" onClick={() => onStart('modern')}>
            <h2>Modern Mode</h2>
            <p className="mode-desc">Post-1984 questions</p>
            {highScore > 0 && <p className="mode-score">Best: {highScore}%</p>}
          </button>

          <button className="mode-card classic-card" onClick={() => onStart('classic')}>
            <div className="classic-preview">
              <div className="crt-text">
                <span className="prompt-symbol">&gt;</span> LOAD "TRIVIA.BAS"
              </div>
              <h2>Classic Mode aka<br />4th Grade AY Mode</h2>
              <p className="mode-desc">PRE-1984 QUESTIONS ONLY</p>
              {classicHighScore > 0 && <p className="mode-score">BEST: {classicHighScore}%</p>}
              <div className="crt-text">
                <span className="prompt-symbol">&gt;</span> RUN<span className="blink">_</span>
              </div>
            </div>
          </button>
        </div>

        {/* Persistent Top 10 Leaderboard */}
        <div className={`start-leaderboard ${lbMode === 'classic' ? 'start-leaderboard-classic' : ''}`}>
          <h3 className="start-lb-title">Top 10</h3>
          <div className="start-lb-tabs">
            <button
              className={`start-lb-tab ${lbMode === 'modern' ? 'active' : ''}`}
              onClick={() => setLbMode('modern')}
            >
              Modern
            </button>
            <button
              className={`start-lb-tab ${lbMode === 'classic' ? 'active' : ''}`}
              onClick={() => setLbMode('classic')}
            >
              Classic
            </button>
          </div>
          {board.length === 0 ? (
            <p className="start-lb-empty">No scores yet — play a game!</p>
          ) : (
            <div className="start-lb-table">
              <div className="start-lb-header">
                <span className="start-lb-rank">#</span>
                <span className="start-lb-name">Name</span>
                <span className="start-lb-score">Score</span>
                <span className="start-lb-pct">%</span>
              </div>
              {board.map((entry, i) => (
                <div key={i} className={`start-lb-row ${i === 0 ? 'lb-gold' : i === 1 ? 'lb-silver' : i === 2 ? 'lb-bronze' : ''}`}>
                  <span className="start-lb-rank">{i + 1}</span>
                  <span className="start-lb-name">{entry.initials}</span>
                  <span className="start-lb-score">{entry.score}/{entry.total}</span>
                  <span className="start-lb-pct">{entry.pct}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="origin-note">
          Inspired by a 4th grader's BASIC program, circa 1983
        </p>
      </div>
    </div>
  );
}
