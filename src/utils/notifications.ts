import { useState } from 'react';

type Notification = {
  id: string;
  message: string;
  type: 'success' | 'error';
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeNotification(id);
    }, type === 'error' ? 5000 : 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, showNotification, removeNotification };
};
