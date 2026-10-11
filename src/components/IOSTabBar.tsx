import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Zap, 
  ClipboardCheck, 
  Menu,
  Calendar,
  Sparkles
} from 'lucide-react';
import { TabType } from '../types';

interface IOSTabBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenQuickBar: () => void;
  onOpenMore: () => void;
  isMoreOpen: boolean;
  lowStockCount: number;
}

export const IOSTabBar: React.FC<IOSTabBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickBar,
  onOpenMore,
  isMoreOpen,
  lowStockCount,
}) => {
  // Trigger subtle tactile feedback
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(10);
      } catch {
        // ignore
      }
    }
  };

  const isMoreTabActive = isMoreOpen || activeTab === 'suppliers' || activeTab === 'shopping' || activeTab === 'events';

  return (
    <nav 
      aria-label="Navegación principal iOS"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#090e0b]/92 ios-blur border-t border-emerald-950/70 pb-safe select-none shadow-[0_-8px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="max-w-lg mx-auto px-2">
        <div className="grid grid-cols-5 items-center h-16 relative">
          {/* Tab 1: Inicio (Dashboard) */}
          <button
            onClick={() => {
              triggerHaptic();
              onSelectTab('dashboard');
            }}
            className={`flex flex-col items-center justify-center h-full transition-all ios-active ${
              activeTab === 'dashboard' && !isMoreOpen
                ? 'text-emerald-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <LayoutDashboard className={`w-5 h-5 transition-transform ${
                activeTab === 'dashboard' && !isMoreOpen ? 'scale-110 text-emerald-400 stroke-[2.3]' : 'stroke-[1.8]'
              }`} />
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Inicio</span>
          </button>

          {/* Tab 2: Stock (Inventory) */}
          <button
            onClick={() => {
              triggerHaptic();
              onSelectTab('inventory');
            }}
            className={`flex flex-col items-center justify-center h-full transition-all ios-active ${
              activeTab === 'inventory' && !isMoreOpen
                ? 'text-emerald-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <Package className={`w-5 h-5 transition-transform ${
                activeTab === 'inventory' && !isMoreOpen ? 'scale-110 text-emerald-400 stroke-[2.3]' : 'stroke-[1.8]'
              }`} />
              {lowStockCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-[#0a0e0b]">
                  {lowStockCount > 9 ? '9+' : lowStockCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Stock</span>
          </button>

          {/* Tab 3: Central Elevated Quick Bar Action Button (Rugby Matchday Mode) */}
          <div className="flex flex-col items-center justify-center -mt-5">
            <button
              onClick={() => {
                triggerHaptic();
                onOpenQuickBar();
              }}
              className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-emerald-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-[#090e0b] ios-active transition-transform"
              aria-label="Abrir modo Bar Rápido para partido"
              title="Modo Bar Rápido"
            >
              <Zap className="w-6 h-6 fill-emerald-950 stroke-emerald-950 stroke-[1.5]" />
            </button>
            <span className="text-[10px] font-bold text-emerald-300 mt-1 tracking-tight">
              Bar Rápido
            </span>
          </div>

          {/* Tab 4: Cierre (Shift Closure) */}
          <button
            onClick={() => {
              triggerHaptic();
              onSelectTab('closure');
            }}
            className={`flex flex-col items-center justify-center h-full transition-all ios-active ${
              activeTab === 'closure' && !isMoreOpen
                ? 'text-emerald-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <ClipboardCheck className={`w-5 h-5 transition-transform ${
                activeTab === 'closure' && !isMoreOpen ? 'scale-110 text-emerald-400 stroke-[2.3]' : 'stroke-[1.8]'
              }`} />
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Cierre</span>
          </button>

          {/* Tab 5: Más (More Menu / Events / Suppliers / Shopping) */}
          <button
            onClick={() => {
              triggerHaptic();
              onOpenMore();
            }}
            className={`flex flex-col items-center justify-center h-full transition-all ios-active ${
              isMoreTabActive
                ? 'text-emerald-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <Menu className={`w-5 h-5 transition-transform ${
                isMoreTabActive ? 'scale-110 text-emerald-400 stroke-[2.3]' : 'stroke-[1.8]'
              }`} />
              {activeTab === 'events' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">
              {activeTab === 'events' ? 'Partidos' : 'Más'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
