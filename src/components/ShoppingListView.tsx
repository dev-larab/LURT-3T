import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Truck, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  Copy, 
  Check, 
  AlertTriangle, 
  ArrowRight,
  PackageCheck,
  Printer,
  Sparkles
} from 'lucide-react';
import { Product, Supplier, TabType } from '../types';

interface ShoppingListViewProps {
  products: Product[];
  suppliers: Supplier[];
  onBatchRestock: (restockItems: { productId: string; quantity: number }[]) => void;
  onNavigateTab: (tab: TabType) => void;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  products,
  suppliers,
  onBatchRestock,
  onNavigateTab
}) => {
  const [copiedSupplierId, setCopiedSupplierId] = useState<string | null>(null);

  // Find all items below minimum stock
  const lowStockProducts = products.filter(p => p.currentStock < p.minStock);

  // Group by supplier
  const supplierGroups = suppliers.map((sup) => {
    const items = lowStockProducts.filter(p => p.supplierId === sup.id);
    const totalCost = items.reduce((sum, p) => {
      const deficit = p.minStock - p.currentStock;
      return sum + (p.costPerUnit ? p.costPerUnit * deficit : 0);
    }, 0);

    return {
      supplier: sup,
      items,
      totalCost,
    };
  }).filter(group => group.items.length > 0);

  // Unassigned low stock products
  const unassignedItems = lowStockProducts.filter(p => !p.supplierId || !suppliers.some(s => s.id === p.supplierId));

  // Generate clean message text for WhatsApp or Email
  const generateOrderMessage = (supplier: Supplier, items: Product[]) => {
    const lines = [
      `🏉 *LA ÚNICA RUGBY TALDEA*`,
      `Pedido para el próximo Tercer Tiempo`,
      `Proveedor: ${supplier.name} (Atn. ${supplier.contactPerson})`,
      `Fecha: ${new Date().toLocaleDateString('es-ES')}`,
      `---------------------------------------`,
      ...items.map(item => {
        const needed = item.minStock - item.currentStock;
        return `• ${needed} ${item.unit} - ${item.name}`;
      }),
      `---------------------------------------`,
      `Por favor, confirmar disponibilidad y día de entrega en el club (UPNA).`,
      `¡Muchas gracias y aupa La Única! 🟢⚫`
    ];
    return lines.join('\n');
  };

  const handleCopyOrder = (supplier: Supplier, items: Product[]) => {
    const text = generateOrderMessage(supplier, items);
    navigator.clipboard.writeText(text);
    setCopiedSupplierId(supplier.id);
    setTimeout(() => setCopiedSupplierId(null), 3000);
  };

  const handleOpenWhatsApp = (supplier: Supplier, items: Product[]) => {
    const text = generateOrderMessage(supplier, items);
    const cleanPhone = supplier.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendEmail = (supplier: Supplier, items: Product[]) => {
    const text = generateOrderMessage(supplier, items);
    const subject = `Pedido Tercer Tiempo - La Única Rugby Taldea`;
    window.location.href = `mailto:${supplier.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  };

  const handleRestockGroup = (items: Product[]) => {
    if (confirm(`¿Marcar como recibidos los ${items.length} productos de este proveedor y actualizar inventario?`)) {
      const restockPayload = items.map(p => ({
        productId: p.id,
        quantity: p.minStock - p.currentStock
      }));
      onBatchRestock(restockPayload);
    }
  };

  const handleRestockAll = () => {
    if (confirm(`¿Marcar como recibido TODO el pedido pendiente (${lowStockProducts.length} productos) y restaurar stock seguro?`)) {
      const restockPayload = lowStockProducts.map(p => ({
        productId: p.id,
        quantity: p.minStock - p.currentStock
      }));
      onBatchRestock(restockPayload);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101713] border border-emerald-900/50 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-rugby text-2xl sm:text-3xl text-white font-bold tracking-wide">
              LISTA DE COMPRA AUTOMÁTICA
            </h1>
            {lowStockProducts.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {lowStockProducts.length} artículos a reponer
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Calcula automáticamente el déficit respecto al stock mínimo y agrupa los pedidos por proveedor para enviar por WhatsApp o email.
          </p>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestockAll}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/60 transition-all active:scale-95"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Marcar Todo como Recibido</span>
            </button>
          </div>
        )}
      </div>

      {/* When no items are in low stock */}
      {lowStockProducts.length === 0 ? (
        <div className="bg-[#101713] border border-emerald-900/40 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-rugby text-2xl font-bold text-white tracking-wide">
              ¡STOCK AL 100% PARA EL TERCER TIEMPO!
            </h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto mt-1">
              Todos los artículos del almacén de La Única Rugby Taldea superan su nivel mínimo de seguridad. No hay compras pendientes en este momento.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <span>Ver Inventario Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Supplier Groups */}
          {supplierGroups.map(({ supplier, items, totalCost }) => {
            const isCopied = copiedSupplierId === supplier.id;

            return (
              <div
                key={supplier.id}
                className="bg-[#101713] border border-emerald-900/50 rounded-2xl p-6 shadow-xl space-y-4"
              >
                {/* Group Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-950">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-rugby text-xl font-bold text-white tracking-wide">
                        {supplier.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-0.5">
                        <span>Contacto: <strong className="text-zinc-200">{supplier.contactPerson}</strong></span>
                        <span>•</span>
                        <span>Tel: <strong className="text-zinc-200">{supplier.phone}</strong></span>
                        {supplier.email && (
                          <>
                            <span>•</span>
                            <span>{supplier.email}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions for this supplier */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleCopyOrder(supplier, items)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isCopied
                          ? 'bg-emerald-500 text-black font-bold'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                      }`}
                      title="Copiar texto formateado para pegar en WhatsApp o notas"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? '¡Copiado!' : 'Copiar Texto'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenWhatsApp(supplier, items)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    {supplier.email && (
                      <button
                        onClick={() => handleSendEmail(supplier, items)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleRestockGroup(items)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 flex items-center gap-1.5 transition-colors"
                      title="Actualizar stock sumando estas unidades como recibidas"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Recibido</span>
                    </button>
                  </div>
                </div>

                {/* Items Table for this supplier */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-900 text-zinc-500 uppercase tracking-wider text-[10px]">
                        <th className="py-2 pr-3">Producto</th>
                        <th className="py-2 px-3 text-center">Stock Actual</th>
                        <th className="py-2 px-3 text-center">Mínimo Seguro</th>
                        <th className="py-2 px-3 text-center font-bold text-rose-300">Cantidad a Pedir</th>
                        <th className="py-2 pl-3 text-right">Coste Estimado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/60">
                      {items.map((prod) => {
                        const needed = prod.minStock - prod.currentStock;
                        const lineCost = prod.costPerUnit ? prod.costPerUnit * needed : 0;

                        return (
                          <tr key={prod.id} className="hover:bg-emerald-950/20 transition-colors">
                            <td className="py-2.5 pr-3">
                              <span className="font-semibold text-white block">{prod.name}</span>
                              {prod.notes && <span className="text-[10px] text-zinc-500 italic">{prod.notes}</span>}
                            </td>
                            <td className="py-2.5 px-3 text-center text-rose-400 font-bold">
                              {prod.currentStock} {prod.unit}
                            </td>
                            <td className="py-2.5 px-3 text-center text-zinc-400">
                              {prod.minStock} {prod.unit}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2 py-0.5 rounded-md font-rugby text-sm font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 inline-block">
                                +{needed} {prod.unit}
                              </span>
                            </td>
                            <td className="py-2.5 pl-3 text-right font-medium text-zinc-300">
                              {lineCost > 0 ? `${lineCost.toFixed(2)}€` : 'Consultar'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Subtotal */}
                {totalCost > 0 && (
                  <div className="pt-2 flex justify-end text-xs text-zinc-400">
                    <span>Total estimado para este pedido: <strong className="text-emerald-400 font-rugby text-sm">{totalCost.toFixed(2)}€</strong></span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Unassigned products under min stock */}
          {unassignedItems.length > 0 && (
            <div className="bg-[#101713] border border-amber-900/50 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-950">
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-rugby text-lg font-bold uppercase tracking-wider text-white">
                    Artículos Sin Proveedor Asignado ({unassignedItems.length})
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateTab('inventory')}
                  className="text-xs text-emerald-400 hover:underline font-semibold"
                >
                  Asignar proveedor en inventario
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unassignedItems.map((prod) => {
                  const needed = prod.minStock - prod.currentStock;
                  return (
                    <div key={prod.id} className="p-3 bg-[#0a0f0d] rounded-xl border border-zinc-900 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{prod.name}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          Actual: {prod.currentStock} / Mín: {prod.minStock} {prod.unit}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                        Pedir +{needed}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
