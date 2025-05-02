import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 backdrop-blur-sm overflow-y-auto p-5"
      onClick={onClose}
    >
      <div 
        className="bg-card-bg rounded-2xl p-6 w-full max-w-md relative border border-white/10 shadow-lg shadow-neon-blue/30 animate-modalFadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 text-neon-pink text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-transform hover:rotate-90"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl md:text-2xl font-semibold text-neon-blue mb-5 flex items-center justify-center gap-2">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};
