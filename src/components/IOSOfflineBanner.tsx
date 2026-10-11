import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Cloud } from 'lucide-react';

export const IOSOfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div className="fixed top-[calc(env(safe-area-inset-top,0px)+4.5rem)] left-4 right-4 z-50 pointer-events-none flex justify-center animate-in slide-in-from-top duration-200">
      {!isOnline ? (
        <div className="bg-[#1c120c]/95 border border-amber-500/50 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 backdrop-blur-md">
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          <span>Modo sin conexión • Guardando datos en el dispositivo</span>
        </div>
      ) : (
        <div className="bg-[#0c1c14]/95 border border-emerald-500/50 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 backdrop-blur-md">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span>Conexión restablecida • Nube sincronizada</span>
        </div>
      )}
    </div>
  );
};
