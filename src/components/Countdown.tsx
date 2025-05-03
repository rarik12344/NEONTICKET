import { useCountdown } from '@/hooks/useCountdown';

interface CountdownProps {
  targetDate: Date | null;
  onComplete?: () => void;
}

export const Countdown = ({ targetDate, onComplete }: CountdownProps) => {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  useEffect(() => {
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0 && onComplete) {
      onComplete();
    }
  }, [days, hours, minutes, seconds, onComplete]);

  return (
    <div className="flex gap-2">
      <div className="text-center">
        <div className="text-2xl font-bold">{days}</div>
        <div className="text-sm">Days</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{hours}</div>
        <div className="text-sm">Hours</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{minutes}</div>
        <div className="text-sm">Minutes</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{seconds}</div>
        <div className="text-sm">Seconds</div>
      </div>
    </div>
  );
};
