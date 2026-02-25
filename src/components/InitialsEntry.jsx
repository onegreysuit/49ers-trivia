import { useState, useRef, useEffect } from 'react';

export default function InitialsEntry({ score, total, mode, onSubmit }) {
  const [initials, setInitials] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    if (val.length <= 3) setInitials(val);
  };

  const handleSubmit = () => {
    if (initials.length > 0) onSubmit(initials);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && initials.length > 0) onSubmit(initials);
  };

  const pct = Math.round((score / total) * 100);

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
            <div className="classic-score-display">
              SCORE: {score}/{total} ({pct}%)
            </div>
            <br />
            <div className="classic-divider">{divider}</div>
            <br />
            <div>ENTER YOUR INITIALS (3 LETTERS):</div>
            <br />
            <div className="classic-initials-input-wrap">
              <span className="prompt-symbol">&gt; </span>
              <input
                ref={inputRef}
                type="text"
                className="classic-initials-input"
                value={initials}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                maxLength={3}
                autoFocus
              />
              <span className="blink">_</span>
            </div>
            <br />
            <button
              className="classic-btn"
              onClick={handleSubmit}
              disabled={initials.length === 0}
            >
              [ENTER] SAVE SCORE
            </button>
            <br /><br />
            <button className="classic-btn classic-btn-skip" onClick={() => onSubmit(null)}>
              [S]KIP
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modern mode
  return (
    <div className="initials-screen">
      <div className="initials-score-preview">
        <span className="initials-pct">{pct}%</span>
        <span className="initials-fraction">{score}/{total}</span>
      </div>
      <h2 className="initials-title">Enter Your Initials</h2>
      <p className="initials-subtitle">Save your score to the leaderboard</p>
      <input
        ref={inputRef}
        type="text"
        className="initials-input"
        value={initials}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        maxLength={3}
        placeholder="AAA"
        autoFocus
      />
      <div className="initials-actions">
        <button
          className="replay-btn"
          onClick={handleSubmit}
          disabled={initials.length === 0}
        >
          Save Score
        </button>
        <button className="home-btn" onClick={() => onSubmit(null)}>
          Skip
        </button>
      </div>
    </div>
  );
}
