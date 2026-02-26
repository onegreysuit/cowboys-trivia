import { useState, useRef, useEffect } from 'react';

export default function InitialsEntry({ score, total, onSubmit }) {
  const [initials, setInitials] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    if (val.length <= 3) setInitials(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && initials.length > 0) onSubmit(initials);
  };

  const pct = Math.round((score / total) * 100);

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
          onClick={() => onSubmit(initials)}
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
