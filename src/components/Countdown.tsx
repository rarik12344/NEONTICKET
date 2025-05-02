import React from 'react';

interface CountdownProps {
  endTime: number;
}

export const Countdown: React.FC<CountdownProps> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = React.useState<string>('00:00:00');

  React.useEffect(() => {
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
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="timer text-4xl md:text-5xl font-bold text-neon-pink text-shadow-neon-pink font-mono tracking-wider">
      {timeLeft}
    </div>
  );
};
