import { useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
  onComplete?: () => void;
}

const useCountdown = (targetDate: Date) => {
  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

export const Countdown = ({ targetDate, onComplete }: CountdownProps) => {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  useEffect(() => {
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0 && onComplete) {
      onComplete();
    }
  }, [days, hours, minutes, seconds, onComplete]);

  return (
    <div className="countdown">
      {days > 0 && <span>{days}d </span>}
      {hours > 0 && <span>{hours}h </span>}
      {minutes > 0 && <span>{minutes}m </span>}
      <span>{Math.floor(seconds)}s</span>
    </div>
  );
};
