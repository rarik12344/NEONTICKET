import { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  duration?: number;
  onClose?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type = 'success', 
  duration = 3000,
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 bg-card-bg px-6 py-3 rounded-xl flex items-center gap-2 z-50 shadow-lg animate-slideIn ${
      type === 'error' 
        ? 'border border-error shadow-error/50' 
        : 'border border-success shadow-success/50'
    }`}>
      <span className={type === 'error' ? 'text-error' : 'text-success'}>
        {type === 'error' ? '⚠️' : '✓'}
      </span>
      <span>{message}</span>
    </div>
  );
};
