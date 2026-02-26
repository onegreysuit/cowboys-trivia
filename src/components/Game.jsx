import { useState, useCallback } from 'react';
import StartScreen from './StartScreen';
import QuestionCard from './QuestionCard';
import ResultScreen from './ResultScreen';
import InitialsEntry from './InitialsEntry';
import Leaderboard, { saveToLeaderboard } from './Leaderboard';
import questions from '../data/questions.json';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QUESTION_COUNT = 16;

export default function Game() {
  const [phase, setPhase] = useState('start');
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [categoryStats, setCategoryStats] = useState({});
  const [highScore, setHighScore] = useState(() =>
    parseInt(localStorage.getItem('cowboys-high-score') || '0', 10)
  );

  const startGame = useCallback(() => {
    setDeck(shuffle(questions).slice(0, QUESTION_COUNT));
    setIndex(0);
    setScore(0);
    setCategoryStats({});
    setPhase('playing');
  }, []);

  const goHome = useCallback(() => {
    setPhase('start');
  }, []);

  const showLeaderboard = useCallback(() => {
    setPhase('leaderboard');
  }, []);

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

    if (initials) {
      const today = new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
      saveToLeaderboard({
        initials,
        score,
        total: deck.length,
        pct,
        date: today,
      });
    }

    const key = 'cowboys-high-score';
    if (pct > highScore) {
      setHighScore(pct);
      localStorage.setItem(key, pct.toString());
    }

    setPhase('result');
  }, [score, deck.length, highScore]);

  if (phase === 'start') {
    return (
      <StartScreen
        onStart={startGame}
        highScore={highScore}
        onLeaderboard={showLeaderboard}
      />
    );
  }

  if (phase === 'playing') {
    return (
      <QuestionCard
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
        onSubmit={handleInitialsSubmit}
      />
    );
  }

  if (phase === 'leaderboard') {
    return (
      <Leaderboard onBack={goHome} />
    );
  }

  return (
    <ResultScreen
      score={score}
      total={deck.length}
      categoryStats={categoryStats}
      onReplay={startGame}
      onHome={goHome}
      onLeaderboard={showLeaderboard}
    />
  );
}
