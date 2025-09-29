import { useState, useCallback } from 'react';
import { Toast } from '../components/Toast';

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: number): void => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void => {
    const id = Date.now();
    const newToast: ToastData = {
      id,
      message,
      type,
      onClose: () => removeToast(id)
    };
    
    setToasts(prev => [...prev, newToast]);
  }, [removeToast]);

  const ToastContainer = useCallback(() => (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] space-y-3 pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <div key={toast.id} className="mb-3">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={toast.onClose}
            />
          </div>
        ))}
      </div>
    </div>
  ), [toasts]);

  return { showToast, ToastContainer };
};