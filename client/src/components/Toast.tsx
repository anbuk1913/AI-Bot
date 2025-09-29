// src/components/Toast.tsx
import { useState, useEffect, useCallback } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const Toast = ({ 
  message, 
  type = 'info', 
  duration = 4000, 
  onClose 
}: ToastProps) => {
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const handleClose = useCallback((): void => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  const getToastStyles = (): string => {
    const baseStyles = "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 transform";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50/90 border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50/90 border-red-200 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50/90 border-yellow-200 text-yellow-800`;
      default:
        return `${baseStyles} bg-blue-50/90 border-blue-200 text-blue-800`;
    }
  };

  const getIcon = () => {
    const iconProps = { size: 18, className: "flex-shrink-0" };
    
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className="text-green-600" />;
      case 'error':
        return <AlertCircle {...iconProps} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle {...iconProps} className="text-yellow-600" />;
      default:
        return <Info {...iconProps} className="text-blue-600" />;
    }
  };

  return (
    <div 
      className={`${getToastStyles()} ${
        isExiting 
          ? 'opacity-0 translate-x-full scale-95' 
          : 'opacity-100 translate-x-0 scale-100'
      }`}
      style={{ maxWidth: '400px', minWidth: '300px' }}
    >
      {getIcon()}
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors duration-200"
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};