import { useState, useEffect } from 'react';
import { fetchCloudLeaderboard, postCloudScore } from '../services/leaderboardService';

export default function Leaderboard({ onBack }) {
  const [board, setBoard] = useState(() => getLeaderboard());

  useEffect(() => {
    fetchCloudLeaderboard().then((cloudData) => {
      if (cloudData !== null) setBoard(cloudData);
    });
  }, []);

  return (
    <div className="leaderboard-screen">
      <h2 className="lb-title">Leaderboard</h2>

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

export function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem('cowboys-leaderboard') || '[]');
  } catch {
    return [];
  }
}

export function saveToLeaderboard(entry) {
  const board = getLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.pct - a.pct || new Date(b.date) - new Date(a.date));
  const top10 = board.slice(0, 10);
  localStorage.setItem('cowboys-leaderboard', JSON.stringify(top10));
  postCloudScore(entry);
  return top10;
}
