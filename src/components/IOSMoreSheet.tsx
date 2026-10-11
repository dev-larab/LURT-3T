import React from 'react';
import { 
  Calendar, 
  Truck, 
  ShoppingCart, 
  Users, 
  Smartphone, 
  Zap, 
  LogOut, 
  RotateCcw, 
  ChevronRight, 
  X, 
  ShieldCheck, 
  Crown,
  Cloud,
  Download
} from 'lucide-react';
import { User, TabType } from '../types';

interface IOSMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  lowStockCount: number;
  onNavigateTab: (tab: TabType) => void;
  onOpenQuickBar: () => void;
  onOpenUserModal: () => void;
  onOpenInstallGuide: () => void;
  onLogout: () => void;
  onResetData: () => void;
}

export const IOSMoreSheet: React.FC<IOSMoreSheetProps> = ({
  isOpen,
  onClose,
  currentUser,
  lowStockCount,
  onNavigateTab,
  onOpenQuickBar,
  onOpenUserModal,
  onOpenInstallGuide,
  onLogout,
  onResetData,
}) => {
  if (!isOpen) return null;

  const isAdmin = currentUser.role === 'admin';

  const handleSelectNav = (tab: TabType) => {
    onNavigateTab(tab);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-md bg-[#0e1612] border-t sm:border border-emerald-900/60 rounded-t-[28px] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Drag Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-10 h-1 rounded-full bg-zinc-600/70" />
        </div>

        {/* Sheet Header */}
        <div className="px-5 py-3.5 border-b border-emerald-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white ${
              isAdmin ? 'bg-amber-600' : 'bg-emerald-600'
            }`}>
              {isAdmin ? <Crown className="w-4 h-4" /> : currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{currentUser.name}</p>
              <p className="text-[11px] text-zinc-400 font-mono">
                {isAdmin ? '👑 Directiva / Admin' : '🏉 Responsable de Turno'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable list grouped like iOS Settings */}
        <div className="p-4 space-y-4 overflow-y-auto ios-scroll flex-1">
          {/* Group 1: Matchdays & Rugby Operations */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/80 px-2 mb-1.5">
              Tercer Tiempo & Partidos
            </p>
            <div className="rounded-2xl bg-[#142019] border border-emerald-900/50 divide-y divide-emerald-950/60 overflow-hidden">
              <button
                onClick={() => handleSelectNav('events')}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-emerald-950/40 transition-colors ios-active"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">
                      Partidos & Eventos
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Calendario, tercer tiempo y rivales
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenQuickBar();
                }}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-emerald-950/40 transition-colors ios-active"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Zap className="w-4 h-4 fill-amber-400" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">
                      Modo Bar Rápido
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Botones gigantes para días de partido
                    </span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Directo
                </span>
              </button>
            </div>
          </div>

          {/* Group 2: Administration (Suppliers & Shopping) */}
          {isAdmin ? (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 px-2 mb-1.5">
                Gestión Directiva (Admin)
              </p>
              <div className="rounded-2xl bg-[#142019] border border-amber-900/30 divide-y divide-emerald-950/60 overflow-hidden">
                <button
                  onClick={() => handleSelectNav('suppliers')}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-emerald-950/40 transition-colors ios-active"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        Proveedores de Bebidas
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Distribuidores, llamadas directas y pedidos
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>

                <button
                  onClick={() => handleSelectNav('shopping')}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-emerald-950/40 transition-colors ios-active"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center relative">
                      <ShoppingCart className="w-4 h-4" />
                      {lowStockCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        Lista de Compras
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        {lowStockCount > 0 ? `${lowStockCount} artículos bajo mínimo` : 'Sin compras pendientes'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenUserModal();
                  }}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-emerald-950/40 transition-colors ios-active"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        Gestión de Usuarios
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Crear usuarios y permisos
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
              <span className="font-semibold text-zinc-300">Modo Responsable de Turno:</span> Las pestañas de Proveedores, Compras y Usuarios son gestionadas por la Directiva.
            </div>
          )}

          {/* Group 3: App & Device */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-2 mb-1.5">
              Aplicación & Ajustes
            </p>
            <div className="rounded-2xl bg-[#142019] border border-emerald-900/50 divide-y divide-emerald-950/60 overflow-hidden">
              <button
                onClick={() => {
                  onClose();
                  onOpenInstallGuide();
                }}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-emerald-950/40 transition-colors ios-active"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">
                      Instalar en iPhone / iPad
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Guía paso a paso para la pantalla de inicio
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  iOS
                </span>
              </button>

              {/* Direct Download of iOS Xcode / App Store Project Zip */}
              <a
                href="/la-unica-rt-ios-appstore.zip"
                download="la-unica-rt-ios-appstore.zip"
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-emerald-950/40 transition-colors ios-active"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">
                      Descargar Paquete App Store (.zip)
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Proyecto Xcode con iconos y configuración (1.2 MB)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ZIP
                </span>
              </a>

              {isAdmin && (
                <button
                  onClick={() => {
                    onClose();
                    onResetData();
                  }}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-emerald-950/40 transition-colors ios-active"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 flex items-center justify-center">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-zinc-300 block">
                        Reiniciar datos de muestra
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        Cargar valores por defecto del club
                      </span>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Logout button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-rose-950/40 hover:bg-rose-950/80 border border-rose-900/50 text-rose-300 font-bold text-sm flex items-center justify-center gap-2 transition-colors ios-active"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          {/* App footer info */}
          <div className="text-center pt-2 text-[11px] text-zinc-500 space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-medium">
              <Cloud className="w-3.5 h-3.5" />
              <span>Sincronizado con Firebase</span>
            </div>
            <p>La Única Rugby Taldea • Iruña 1983</p>
          </div>
        </div>
      </div>
    </div>
  );
};
