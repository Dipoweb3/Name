import React, { useState, useEffect } from 'react';
import { FrameLayout } from '../components/FrameLayout';
import { endVoting } from '../lib/gameLogic';

export default function VoteFrame({ roomId, submissions }) {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    async function fetchRoom() {
      const res = await fetch(`/api/room-status?roomId=${roomId}`);
      const data = await res.json();
      setRoom(data.room);
      if (data.room.state === 'done') {
        window.location.href = `/frames/results?roomId=${roomId}`;
      }
    }
    fetchRoom();
    const interval = setInterval(fetchRoom, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  const handleVotingEnd = async () => {
    await endVoting(roomId);
  };

  const handleVote = async (answerId, vote) => {
    await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, answerId, voterFid: 'user_fid', vote }),
    });
  };

  if (!room) return <FrameLayout>Loading...</FrameLayout>;

  return (
    <FrameLayout>
      <h1>Vote on Submissions</h1>
      {submissions.map((submission) => (
        <div key={submission.id}>
          <p>{submission.answer}</p>
          <button onClick={() => handleVote(submission.id, 'correct')}>✅ Correct</button>
          <button onClick={() => handleVote(submission.id, 'incorrect')}>❌ Incorrect</button>
        </div>
      ))}
      <button onClick={handleVotingEnd}>End Voting</button>
    </FrameLayout>
  );
} 