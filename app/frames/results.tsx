import React, { useState, useEffect } from 'react';
import { FrameLayout } from '../components/FrameLayout';
import { Scoreboard } from '../components/Scoreboard';
import { startGame } from '../lib/gameLogic';
import { Score } from '../types';

interface ResultsFrameProps {
  roomId: string;
  scores: Score[];
}

export default function ResultsFrame({ roomId, scores }: ResultsFrameProps) {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    async function fetchRoom() {
      const res = await fetch(`/api/room-status?roomId=${roomId}`);
      const data = await res.json();
      setRoom(data.room);
      if (data.room.state === 'submitting') {
        window.location.href = `/frames/submit?roomId=${roomId}`;
      }
    }
    fetchRoom();
    const interval = setInterval(fetchRoom, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  const handlePlayAgain = async () => {
    await startGame(roomId);
  };

  if (!room) return <FrameLayout>Loading...</FrameLayout>;

  return (
    <FrameLayout>
      <h1>Game Results</h1>
      <Scoreboard scores={scores} />
      <button onClick={handlePlayAgain}>Play Again</button>
    </FrameLayout>
  );
} 