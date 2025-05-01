import { useEffect, useState } from 'react';

interface CountdownProps {
  endTime?: number;
}

export default function Countdown({ endTime }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00');

  useEffect(() => {
    if (!endTime) return;

    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000);
      const distance = endTime - now;

      if (distance < 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const hours = Math.floor(distance / 3600);
      const minutes = Math.floor((distance % 3600) / 60);
      const seconds = Math.floor(distance % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="text-2xl font-bold text-center my-4">
      {timeLeft}
    </div>
  );
}
