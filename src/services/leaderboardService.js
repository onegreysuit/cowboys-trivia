const DB_URL = import.meta.env.VITE_FIREBASE_DB_URL;

export async function fetchCloudLeaderboard() {
  if (!DB_URL) return null;
  try {
    const res = await fetch(`${DB_URL}/cowboys-leaderboard.json`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return [];
    return Object.values(data)
      .sort((a, b) => b.pct - a.pct || new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  } catch {
    return null;
  }
}

export async function postCloudScore(entry) {
  if (!DB_URL) return false;
  try {
    const res = await fetch(`${DB_URL}/cowboys-leaderboard.json`, {
      method: 'POST',
      body: JSON.stringify(entry),
      headers: { 'Content-Type': 'application/json' }
    });
    return res.ok;
  } catch {
    return false;
  }
}
