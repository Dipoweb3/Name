import React, { useState, useEffect } from 'react';
import { FrameLayout } from '../components/FrameLayout';
import { Timer } from '../components/Timer';
import { endSubmission } from '../lib/gameLogic';

interface SubmitFrameProps {
  roomId: string;
  category: string;
}

export default function SubmitFrame({ roomId, category }: SubmitFrameProps) {
  const [answer, setAnswer] = useState('');
  const [room, setRoom] = useState(null);

  useEffect(() => {
    async function fetchRoom() {
      const res = await fetch(`/api/room-status?roomId=${roomId}`);
      const data = await res.json();
      setRoom(data.room);
      if (data.room.state === 'voting') {
        window.location.href = `/frames/vote?roomId=${roomId}`;
      }
    }
    fetchRoom();
    const interval = setInterval(fetchRoom, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  const handleTimerEnd = async () => {
    await endSubmission(roomId);
  };

  const handleSubmit = async () => {
    if (!answer) return;
    await fetch('/api/submit-name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, fid: 'user_fid', answer }),
    });
    setAnswer('');
  };

  if (!room) return <FrameLayout>Loading...</FrameLayout>;

  return (
    <FrameLayout>
      <h1>Submit Your Answer</h1>
      <p>Category: {category}</p>
      <Timer duration={60} onEnd={handleTimerEnd} />
      <input type="text" placeholder="Enter your answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
    </FrameLayout>
  );
} 