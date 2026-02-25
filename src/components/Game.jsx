import { useState, useEffect, useCallback } from 'react';
import StartScreen from './StartScreen';
import QuestionCard from './QuestionCard';
import ClassicQuestionCard from './ClassicQuestionCard';
import ResultScreen from './ResultScreen';
import ClassicResultScreen from './ClassicResultScreen';
import InitialsEntry from './InitialsEntry';
import Leaderboard, { saveToLeaderboard } from './Leaderboard';
import questions from '../data/questions.json';
import classicQuestions from '../data/classicQuestions.json';
import '../styles/classic.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QUESTION_COUNT = 20;
const CLASSIC_QUESTION_COUNT = 20;

export default function Game() {
  const [phase, setPhase] = useState('start');
  const [mode, setMode] = useState(null);
  const [leaderboardMode, setLeaderboardMode] = useState('modern');
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [categoryStats, setCategoryStats] = useState({});
  const [highScore, setHighScore] = useState(() =>
    parseInt(localStorage.getItem('49ers-high-score') || '0', 10)
  );
  const [classicHighScore, setClassicHighScore] = useState(() =>
    parseInt(localStorage.getItem('49ers-classic-high-score') || '0', 10)
  );

  const startGame = useCallback((selectedMode) => {
    setMode(selectedMode);
    const pool = selectedMode === 'classic' ? classicQuestions : questions;
    const count = selectedMode === 'classic' ? CLASSIC_QUESTION_COUNT : QUESTION_COUNT;
    setDeck(shuffle(pool).slice(0, count));
    setIndex(0);
    setScore(0);
    setCategoryStats({});
    setPhase('playing');
  }, []);

  const goHome = useCallback(() => {
    setPhase('start');
    setMode(null);
  }, []);

  const showLeaderboard = useCallback((lbMode) => {
    setLeaderboardMode(lbMode || mode || 'modern');
    setPhase('leaderboard');
  }, [mode]);

  const handleAnswer = useCallback((correct) => {
    const q = deck[index];
    if (correct) setScore((s) => s + 1);

    setCategoryStats((prev) => {
      const cat = q.category;
      const existing = prev[cat] || { correct: 0, total: 0 };
      return {
        ...prev,
        [cat]: {
          correct: existing.correct + (correct ? 1 : 0),
          total: existing.total + 1,
        },
      };
    });

    if (index + 1 >= deck.length) {
      setTimeout(() => setPhase('initials'), 300);
    } else {
      setIndex((i) => i + 1);
    }
  }, [deck, index]);

  const handleInitialsSubmit = useCallback((initials) => {
    const pct = Math.round((score / deck.length) * 100);

    // Save to leaderboard if initials provided
    if (initials) {
      const today = new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
      saveToLeaderboard(mode, {
        initials,
        score,
        total: deck.length,
        pct,
        date: today,
      });
    }

    // Update high score
    const key = mode === 'classic' ? '49ers-classic-high-score' : '49ers-high-score';
    const current = mode === 'classic' ? classicHighScore : highScore;
    if (pct > current) {
      if (mode === 'classic') setClassicHighScore(pct);
      else setHighScore(pct);
      localStorage.setItem(key, pct.toString());
    }

    setPhase('result');
  }, [score, deck.length, mode, highScore, classicHighScore]);

  if (phase === 'start') {
    return (
      <StartScreen
        onStart={startGame}
        highScore={highScore}
        classicHighScore={classicHighScore}
        onLeaderboard={showLeaderboard}
      />
    );
  }

  if (phase === 'playing') {
    const Card = mode === 'classic' ? ClassicQuestionCard : QuestionCard;
    return (
      <Card
        key={index}
        question={deck[index]}
        questionIndex={index}
        total={deck.length}
        onAnswer={handleAnswer}
      />
    );
  }

  if (phase === 'initials') {
    return (
      <InitialsEntry
        score={score}
        total={deck.length}
        mode={mode}
        onSubmit={handleInitialsSubmit}
      />
    );
  }

  if (phase === 'leaderboard') {
    return (
      <Leaderboard
        mode={leaderboardMode}
        onBack={goHome}
        onSwitchMode={(m) => setLeaderboardMode(m)}
      />
    );
  }

  if (mode === 'classic') {
    return (
      <ClassicResultScreen
        score={score}
        total={deck.length}
        categoryStats={categoryStats}
        onReplay={() => startGame('classic')}
        onHome={goHome}
        onNewGame={startGame}
        onLeaderboard={() => showLeaderboard('classic')}
      />
    );
  }

  return (
    <ResultScreen
      score={score}
      total={deck.length}
      categoryStats={categoryStats}
      onReplay={() => startGame('modern')}
      onHome={goHome}
      onNewGame={startGame}
      onLeaderboard={() => showLeaderboard('modern')}
    />
  );
}
