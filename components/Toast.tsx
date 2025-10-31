import React from 'react';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div 
      key={message} // Use message as key to re-trigger animation on new message
      className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-100 dark:bg-green-900/80 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 px-6 py-3 rounded-lg shadow-lg animate-fade-out-up z-50"
      role="alert"
    >
      <p className="font-semibold text-sm">{message}</p>
    </div>
  );
};

export default Toast;
