import { useState, useEffect } from 'react';

export const useTimer = (endTime: number | undefined) => {
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (!endTime) return;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const distance = endTime - now;

      if (distance < 0) {
        setTimeLeft('00:00:00');
        setIsEnded(true);
        return;
      }

      setIsEnded(false);
      const hours = Math.floor(distance / 3600);
      const minutes = Math.floor((distance % 3600) / 60);
      const seconds = Math.floor(distance % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return { timeLeft, isEnded };
};
