import { useState } from 'react';

export default function QuestionCard({ question, questionIndex, total, onAnswer }) {
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

  const getOptionClass = (option) => {
    if (!revealed) return '';
    if (option === question.answer) return 'correct';
    if (option === selected && option !== question.answer) return 'incorrect';
    return 'dimmed';
  };

  const progress = ((questionIndex) / total) * 100;

  return (
    <div className="question-card">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="question-meta">
        <span className="question-number">Q{questionIndex + 1}/{total}</span>
        <span className={`difficulty ${question.difficulty}`}>{question.difficulty}</span>
        <span className="category">{question.category}</span>
      </div>
      <h2 className="question-text">{question.question}</h2>
      <div className="options">
        {question.options.map((option, i) => (
          <button
            key={i}
            className={`option-btn ${getOptionClass(option)}`}
            onClick={() => handleSelect(option)}
            disabled={revealed}
          >
            <span className="option-letter">{String.fromCharCode(65 + i)}</span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
