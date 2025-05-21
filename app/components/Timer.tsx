import React, { useState, useEffect } from 'react';

export function Timer({ duration, onEnd }: { duration: number; onEnd: () => void }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onEnd]);

  return (
    <div>
      <h2>Time Left: {timeLeft} seconds</h2>
    </div>
  );
} 