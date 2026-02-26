import { useState, useEffect } from 'react';
import { getLeaderboard } from './Leaderboard';
import { fetchCloudLeaderboard } from '../services/leaderboardService';

export default function StartScreen({ onStart, highScore, onLeaderboard }) {
  const [board, setBoard] = useState(() => getLeaderboard());

  useEffect(() => {
    fetchCloudLeaderboard().then((cloudData) => {
      if (cloudData !== null) setBoard(cloudData);
    });
  }, []);

  return (
    <div className="start-screen">
      <div className="start-bg">
        <div className="star-pattern" />
        <div className="start-bg-overlay" />
      </div>

      <div className="start-content">
        <div className="logo-container">
          <div className="cowboys-star">&#9733;</div>
        </div>
        <h1>Cowboys Trivia</h1>
        <p className="tagline">Test your knowledge of America's Team — 16 questions covering players, history, Super Bowls, coaches, and more</p>

        {highScore > 0 && <p className="high-score">Your Best: {highScore}%</p>}

        <button className="start-btn" onClick={onStart}>
          Play Now
        </button>

        {/* Top 10 Leaderboard */}
        <div className="start-leaderboard">
          <h3 className="start-lb-title">Top 10</h3>
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
      </div>
    </div>
  );
}
