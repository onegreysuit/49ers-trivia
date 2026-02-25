import { useState, useEffect } from 'react';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function ClassicQuestionCard({ question, questionIndex, total, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (option) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
    setTimeout(() => {
      onAnswer(option === question.answer);
      setSelected(null);
      setRevealed(false);
    }, 1200);
  };

  // Keyboard support: press A, B, C, D
  useEffect(() => {
    if (revealed) return;
    const handler = (e) => {
      const key = e.key.toUpperCase();
      const idx = LETTERS.indexOf(key);
      if (idx !== -1 && idx < question.options.length) {
        handleSelect(question.options[idx]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const getOptionClass = (option) => {
    if (!revealed) return '';
    if (option === question.answer) return 'correct';
    if (option === selected && option !== question.answer) return 'incorrect';
    return 'dimmed';
  };

  return (
    <div className="classic-mode">
      <div className="classic-container">
        <div className="classic-header">
          <h2>COMPUTECH 49ERS TRIVIA</h2>
          <div className="version">v1.0 &mdash; (C) 1983</div>
        </div>

        <div className="classic-question-meta">
          QUESTION {questionIndex + 1} OF {total}
        </div>

        <div className="classic-question-text">
          {question.question.toUpperCase()}
        </div>

        <div className="classic-options">
          {question.options.map((option, i) => (
            <button
              key={i}
              className={`classic-option ${getOptionClass(option)}`}
              onClick={() => handleSelect(option)}
              disabled={revealed}
            >
              {LETTERS[i]}) {option.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="classic-prompt">
          {revealed
            ? (selected === question.answer ? 'CORRECT!' : `WRONG! ANSWER: ${question.answer.toUpperCase()}`)
            : <>ENTER YOUR ANSWER (A-D): <span className="blink">_</span></>
          }
        </div>
      </div>
    </div>
  );
}
