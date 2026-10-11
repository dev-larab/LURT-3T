import React from 'react';
import { Share, PlusSquare, Smartphone, X, Check, Shield, Download, Sparkles } from 'lucide-react';

interface IOSInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallGuideModal: React.FC<IOSInstallGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-md bg-[#0f1712] border-t sm:border border-emerald-800/60 rounded-t-[28px] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Drag Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-10 h-1 rounded-full bg-zinc-600/70" />
        </div>

        {/* Modal Header */}
        <div className="p-5 pb-4 border-b border-emerald-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-black p-0.5 border border-emerald-400/40 shadow-lg flex items-center justify-center">
              <img src="/apple-touch-icon.png" alt="La Única RT" className="w-full h-full rounded-[14px] object-cover" />
            </div>
            <div>
              <h3 className="font-rugby font-bold text-lg text-white uppercase tracking-wide">
                Instalar en iOS
              </h3>
              <p className="text-xs text-emerald-400 font-medium">
                La Única RT • Tercer Tiempo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
            aria-label="Cerrar guía"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Steps */}
        <div className="p-5 space-y-4 overflow-y-auto ios-scroll flex-1 text-sm">
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Instala la aplicación en tu <strong className="text-white">iPhone</strong> o <strong className="text-white">iPad</strong> para disfrutar de una experiencia nativa a pantalla completa, sin barra de navegación de Safari y con acceso rápido en el campo o bar.
            </p>
          </div>

          <div className="space-y-3.5 pt-1">
            {/* Step 1 */}
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#142019] border border-emerald-900/40">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-500/30">
                1
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white text-xs sm:text-sm">
                  Pulsa el botón Compartir de Safari
                </p>
                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5 flex-wrap">
                  En la barra inferior de Safari, toca el icono 
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-[11px] border border-zinc-700">
                    <Share className="w-3 h-3 text-emerald-400" /> Compartir
                  </span>
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#142019] border border-emerald-900/40">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-500/30">
                2
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white text-xs sm:text-sm">
                  Selecciona "Añadir a pantalla de inicio"
                </p>
                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5 flex-wrap">
                  Desliza hacia abajo en el menú y selecciona 
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-[11px] border border-zinc-700">
                    <PlusSquare className="w-3 h-3 text-emerald-400" /> Añadir a pantalla de inicio
                  </span>
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#142019] border border-emerald-900/40">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-500/30">
                3
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white text-xs sm:text-sm">
                  Pulsa "Añadir" en la esquina superior
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  ¡Listo! El icono del club se colocará en tu pantalla de inicio junto al resto de tus apps nativas.
                </p>
              </div>
            </div>
          </div>

          {/* Features list */}
          <div className="pt-2 border-t border-emerald-950/60 grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pantalla completa iOS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Funciona sin conexión</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Respuesta táctil y haptics</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nube Firebase en tiempo real</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0a0f0c] border-t border-emerald-950/80">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
