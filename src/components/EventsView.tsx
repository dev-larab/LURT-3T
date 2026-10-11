import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Sparkles, 
  ShoppingBag,
  Check,
  Trophy,
  X,
  Home,
  CalendarRange,
  Search,
  RotateCcw,
  Filter,
  Shield,
  Swords,
  Lock
} from 'lucide-react';
import { RugbyEvent, Product, TabType, User } from '../types';
import { EventModal, TEAM_CATEGORIES, DEFAULT_ORGANIZATION_NOTES } from './EventModal';

interface EventsViewProps {
  events: RugbyEvent[];
  products: Product[];
  currentUser: User | null;
  onAddEvent: (eventData: Omit<RugbyEvent, 'id'>) => void;
  onEditEvent: (event: RugbyEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onToggleChecklistItem: (eventId: string, productId: string) => void;
  onToggleEventComplete: (eventId: string) => void;
  onNavigateTab: (tab: TabType) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  products,
  currentUser,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onToggleChecklistItem,
  onToggleEventComplete,
  onNavigateTab
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const isDutyManagerOnly = !isAdmin;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<RugbyEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<RugbyEvent | null>(null);
  
  // Filters state
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed'>('upcoming');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [homeOnly, setHomeOnly] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const productMap = new Map<string, Product>(products.map(p => [p.id, p]));

  // Helper to detect if a match is played at home (Pamplona / UPNA / local)
  const isHomeMatch = (evt: RugbyEvent): boolean => {
    if (evt.type === 'partido_local') return true;
    if (evt.type === 'partido_visitante') return false;
    const loc = (evt.location || '').toLowerCase();
    return loc.includes('upna') || loc.includes('pamplona') || loc.includes('sede') || loc.includes('local');
  };

  // Combine default categories with any custom category present in events
  const availableCategories = useMemo(() => {
    const fromEvents = events.map(e => e.teamCategory).filter(Boolean);
    const set = new Set([...TEAM_CATEGORIES, ...fromEvents]);
    return Array.from(set);
  }, [events]);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  // Apply all filters: Status + Date Range + Home/Away + Category + Search
  const filteredEvents = useMemo(() => {
    return sortedEvents.filter((evt) => {
      // 1. Status Filter
      if (filterStatus === 'upcoming' && evt.isCompleted) return false;
      if (filterStatus === 'completed' && !evt.isCompleted) return false;

      // 2. Date Range Filter (entre dos fechas)
      if (startDate && evt.date < startDate) return false;
      if (endDate && evt.date > endDate) return false;

      // 3. Home Matches Filter (partidos en casa)
      if (homeOnly && !isHomeMatch(evt)) return false;

      // 4. Team Category Filter (Sub-18, Sub-16, Senior, etc.)
      if (selectedCategory !== 'all') {
        const cat = evt.teamCategory.toLowerCase();
        const target = selectedCategory.toLowerCase();
        if (cat !== target && !cat.startsWith(target)) return false;
      }

      // 5. Search Text Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match = 
          evt.title.toLowerCase().includes(q) ||
          (evt.rival && evt.rival.toLowerCase().includes(q)) ||
          evt.location.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [sortedEvents, filterStatus, startDate, endDate, homeOnly, selectedCategory, searchQuery]);

  const hasActiveFilters = Boolean(
    startDate || 
    endDate || 
    homeOnly || 
    selectedCategory !== 'all' || 
    searchQuery || 
    filterStatus !== 'upcoming'
  );

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setHomeOnly(false);
    setSelectedCategory('all');
    setSearchQuery('');
    setFilterStatus('upcoming');
  };

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: RugbyEvent) => {
    setEditingEvent(evt);
    setIsModalOpen(true);
  };

  const handleSaveModal = (data: Omit<RugbyEvent, 'id'> & { id?: string }) => {
    if (data.id) {
      const existing = events.find(e => e.id === data.id);
      if (existing) {
        onEditEvent({ ...existing, ...data });
      }
    } else {
      onAddEvent(data);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101713] border border-emerald-900/50 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-rugby text-2xl sm:text-3xl text-white font-bold tracking-wide">
              CALENDARIO DE PARTIDOS & TERCEROS TIEMPOS
            </h1>
            {isDutyManagerOnly && (
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Edición: Solo Detalles & Organización</span>
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            {isDutyManagerOnly 
              ? 'Consulta los partidos del club, revisa los equipos rivales y completa los detalles de organización y menú del tercer tiempo.'
              : 'Programación de jornadas, equipos rivales, afluencia prevista y checklists de compras para cada evento de La Única.'}
          </p>
        </div>

        {isAdmin ? (
          <button
            id="btn-add-event"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Programar Partido / Evento</span>
          </button>
        ) : (
          <div className="text-xs text-zinc-400 bg-[#0c130f] px-3.5 py-2 rounded-xl border border-emerald-950 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Modo Responsable de Turno activo</span>
          </div>
        )}
      </div>

      {/* Interactive Filters Panel */}
      <div className="bg-[#101713] border border-emerald-900/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        {/* Row 1: Status pills, Home match toggle & Reset button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-[#090e0b] p-1.5 rounded-xl border border-emerald-950 text-xs">
            <button
              onClick={() => setFilterStatus('upcoming')}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all ${
                filterStatus === 'upcoming'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Próximos ({events.filter(e => !e.isCompleted).length})
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all ${
                filterStatus === 'all'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Todos ({events.length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all ${
                filterStatus === 'completed'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Finalizados ({events.filter(e => e.isCompleted).length})
            </button>
          </div>

          {/* Quick Action Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filtro en Casa Button Toggle */}
            <button
              id="filter-home-matches"
              onClick={() => setHomeOnly(!homeOnly)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                homeOnly
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-[#090e0b] text-zinc-300 border-emerald-900/40 hover:border-emerald-700/60 hover:text-white'
              }`}
              title="Filtrar únicamente partidos disputados como local en Pamplona / UPNA"
            >
              <Home className={`w-4 h-4 ${homeOnly ? 'stroke-[2.5]' : 'text-emerald-400'}`} />
              <span>Solo en Casa (Local)</span>
              {homeOnly && (
                <span className="w-2 h-2 rounded-full bg-black animate-ping" />
              )}
            </button>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-950/80 border border-rose-900/50 rounded-xl transition-colors cursor-pointer"
                title="Restablecer todos los filtros"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpiar filtros</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Date Range (Entre dos fechas) & Category & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-3 border-t border-emerald-950/70 text-xs">
          {/* Date Range: Entre dos fechas */}
          <div className="lg:col-span-5 bg-[#090e0b] p-2.5 rounded-xl border border-emerald-900/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                <CalendarRange className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rango de fechas (Entre dos fechas)</span>
              </span>
              {(startDate || endDate) && (
                <button
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                  className="text-[10px] text-zinc-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                  title="Quitar rango de fechas"
                >
                  <X className="w-3 h-3" />
                  <span>Borrar fechas</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-[10px] text-zinc-400 font-medium mb-0.5">Desde</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#121a16] border border-emerald-900/50 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
              <span className="text-zinc-600 font-bold self-end pb-2">—</span>
              <div className="flex-1">
                <label className="block text-[10px] text-zinc-400 font-medium mb-0.5">Hasta</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#121a16] border border-emerald-900/50 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Categoría Selector (Sub-18, Sub-16, Senior...) */}
          <div className="lg:col-span-4 bg-[#090e0b] p-2.5 rounded-xl border border-emerald-900/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                <span>Filtrar por Categoría</span>
              </span>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-[10px] text-zinc-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Todas</span>
                </button>
              )}
            </div>

            <div className="mt-1">
              <select
                id="filter-category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#121a16] border border-emerald-900/50 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">Todas las Categorías ({events.length})</option>
                {availableCategories.map((cat) => {
                  const count = events.filter(e => e.teamCategory.toLowerCase() === cat.toLowerCase()).length;
                  return (
                    <option key={cat} value={cat}>
                      {cat} {count > 0 ? `(${count})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Search Rival / Partido */}
          <div className="lg:col-span-3 bg-[#090e0b] p-2.5 rounded-xl border border-emerald-900/40 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-zinc-300 block mb-1">
              Buscar Rival o Jornada
            </span>
            <div className="relative mt-1">
              <input
                type="text"
                placeholder="Rival, UPNA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121a16] border border-emerald-900/50 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-white cursor-pointer"
                  title="Borrar búsqueda"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Quick Category Chips (Sub-18, Sub-16, etc.) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-[11px] scrollbar-thin">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <span>Categorías rápidas:</span>
          </span>
          {[
            { label: 'Todas', value: 'all' },
            { label: 'Sub-18', value: 'Sub-18' },
            { label: 'Sub-16', value: 'Sub-16' },
            { label: 'Sub-14', value: 'Sub-14' },
            { label: 'Sub-12', value: 'Sub-12' },
            { label: 'Senior Masc A', value: 'Senior Masculino A' },
            { label: 'Senior Fem', value: 'Senior Femenino' },
            { label: 'Senior Masc B', value: 'Senior Masculino B' },
            { label: 'Veteranos', value: 'Veteranos' }
          ].map((chip) => {
            const isChipSelected = selectedCategory === chip.value || (chip.value !== 'all' && selectedCategory.toLowerCase().startsWith(chip.value.toLowerCase()));
            return (
              <button
                key={chip.value}
                onClick={() => setSelectedCategory(isChipSelected && chip.value !== 'all' ? 'all' : chip.value)}
                className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition-all cursor-pointer ${
                  isChipSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'bg-[#090e0b] text-zinc-400 hover:text-white border border-emerald-950 hover:border-emerald-800'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-emerald-950/60">
          <div>
            Mostrando <strong className="text-emerald-400 font-bold">{filteredEvents.length}</strong> de <strong className="text-zinc-200">{events.length}</strong> partidos
            {hasActiveFilters && (
              <span className="ml-2 text-emerald-300/80 italic font-medium">
                (filtros aplicados)
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {homeOnly && (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                Partidos en Casa
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="text-emerald-300 font-medium">
                Cat: <strong>{selectedCategory}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="bg-[#101713] border border-emerald-900/40 rounded-2xl p-12 text-center">
          <CalendarIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="font-rugby text-lg text-zinc-300 font-bold">
            No se encontraron partidos con los filtros seleccionados
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto mb-4">
            Prueba a ampliar el rango de fechas, cambiar la categoría o desactivar el filtro de partidos en casa.
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer filtros</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((evt) => {
            const eventDate = new Date(evt.date);
            const isToday = new Date().toISOString().split('T')[0] === evt.date;
            const isHome = isHomeMatch(evt);

            // Check if any required item in this event is currently out of stock
            let missingStockItemsCount = 0;
            evt.checklist.forEach((item) => {
              const p = productMap.get(item.productId);
              if (p && p.currentStock < item.quantityNeeded) {
                missingStockItemsCount++;
              }
            });

            const completedChecklistCount = evt.checklist.filter(c => c.checked).length;

            return (
              <div
                key={evt.id}
                className={`rounded-2xl border p-5 transition-all ${
                  evt.isCompleted
                    ? 'bg-[#0f1411]/60 border-zinc-900 opacity-75'
                    : isToday
                    ? 'bg-gradient-to-r from-[#17251e] to-[#0f1713] border-emerald-500 shadow-xl shadow-emerald-950/40'
                    : 'bg-[#101713] border-emerald-900/40 hover:border-emerald-700/60'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-950/80">
                  {/* Left: Date Badge + Title */}
                  <div className="flex items-start gap-4">
                    {/* Date Block */}
                    <div className="w-16 h-16 rounded-xl bg-[#090d0b] border border-emerald-900/60 flex flex-col items-center justify-center text-center shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        {eventDate.toLocaleDateString('es-ES', { month: 'short' })}
                      </span>
                      <span className="font-rugby text-2xl font-bold text-white leading-none">
                        {eventDate.getDate()}
                      </span>
                      <span className="text-[9px] text-zinc-400 font-medium">
                        {eventDate.toLocaleDateString('es-ES', { weekday: 'short' })}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-800/60">
                          {evt.teamCategory}
                        </span>
                        {evt.rival && (
                          <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/60 flex items-center gap-1.5 shadow-sm">
                            <Swords className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>Rival: <strong className="text-white font-extrabold">{evt.rival}</strong></span>
                          </span>
                        )}
                        {isHome ? (
                          <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                            <Home className="w-3 h-3 text-emerald-400" />
                            <span>En Casa</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium uppercase px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-700/60">
                            Fuera
                          </span>
                        )}
                        {isToday && (
                          <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500 text-black animate-pulse">
                            ¡Jornada de Hoy!
                          </span>
                        )}
                        {evt.isCompleted && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            Finalizado
                          </span>
                        )}
                      </div>

                      <h3 className="font-rugby text-xl font-bold text-white tracking-wide mt-1.5 flex items-center gap-2 flex-wrap">
                        <span>{evt.title}</span>
                      </h3>

                      {evt.rival && (
                        <div className="text-xs text-amber-300/90 mt-1 flex items-center gap-1.5 font-medium">
                          <Swords className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Partido contra: <strong className="text-white font-semibold">{evt.rival}</strong></span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          {evt.time} h
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          {evt.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-zinc-300">
                          <Users className="w-3.5 h-3.5 text-emerald-400" />
                          Previsión: {evt.expectedAttendees} personas
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    <button
                      onClick={() => onToggleEventComplete(evt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        evt.isCompleted
                          ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                          : 'bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{evt.isCompleted ? 'Reabrir Evento' : 'Marcar Tercer Tiempo Realizado'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(evt)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs ${
                        isDutyManagerOnly 
                          ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/80 px-2.5' 
                          : 'text-zinc-400 hover:text-emerald-400 hover:bg-emerald-950/40'
                      }`}
                      title={isDutyManagerOnly ? 'Editar Detalles & Organización' : 'Editar evento'}
                    >
                      <Edit3 className="w-4 h-4" />
                      {isDutyManagerOnly && <span>Detalles</span>}
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => setEventToDelete(evt)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar partido"
                        aria-label={`Eliminar partido ${evt.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Event Notes & Supplies Checklist */}
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Left 4 cols: Notes */}
                  <div className="lg:col-span-4 bg-[#0a0f0d] p-3.5 rounded-xl border border-emerald-950/60 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <span>Detalles & Organización</span>
                        </span>
                        {isDutyManagerOnly && (
                          <button
                            onClick={() => handleOpenEdit(evt)}
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-semibold cursor-pointer"
                          >
                            Modificar
                          </button>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed ${
                        !evt.notes || evt.notes === DEFAULT_ORGANIZATION_NOTES 
                          ? 'italic text-zinc-400 font-light' 
                          : 'text-zinc-200'
                      }`}>
                        {evt.notes || DEFAULT_ORGANIZATION_NOTES}
                      </p>
                    </div>

                    {isDutyManagerOnly && (!evt.notes || evt.notes === DEFAULT_ORGANIZATION_NOTES) && (
                      <button
                        onClick={() => handleOpenEdit(evt)}
                        className="mt-3 text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-800/80 px-2.5 py-1.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-emerald-900 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Añadir notas del tercer tiempo</span>
                      </button>
                    )}
                  </div>

                  {/* Right 8 cols: Supplies Checklist */}
                  <div className="lg:col-span-8 bg-[#0a0f0d] p-3 rounded-xl border border-emerald-950/60">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          Checklist de Suministros para el Tercer Tiempo:
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-bold">
                          {completedChecklistCount}/{evt.checklist.length} listos
                        </span>
                      </div>

                      {missingStockItemsCount > 0 && (
                        <button
                          onClick={() => onNavigateTab('shopping')}
                          className="text-[10px] font-bold text-rose-300 hover:text-rose-200 flex items-center gap-1 underline"
                        >
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>{missingStockItemsCount} productos faltan en stock</span>
                        </button>
                      )}
                    </div>

                    {evt.checklist.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic">No hay productos vinculados a este evento.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {evt.checklist.map((item, idx) => {
                          const prod = productMap.get(item.productId);
                          const isShort = prod && prod.currentStock < item.quantityNeeded;

                          return (
                            <div
                              key={`${item.productId}-${idx}`}
                              onClick={() => onToggleChecklistItem(evt.id, item.productId)}
                              className={`cursor-pointer p-2 rounded-lg border text-xs flex items-center justify-between transition-all ${
                                item.checked
                                  ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200 line-through opacity-75'
                                  : isShort
                                  ? 'bg-rose-950/30 border-rose-800/60 text-zinc-200 hover:border-rose-600'
                                  : 'bg-[#121915] border-zinc-800 text-zinc-200 hover:border-emerald-700'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                                  item.checked ? 'bg-emerald-500 text-black' : 'border border-zinc-600'
                                }`}>
                                  {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className="truncate">{prod?.name || 'Producto'}</span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
                                <span className="font-bold text-white">
                                  {item.quantityNeeded} {prod?.unit || 'ud'}
                                </span>
                                {isShort && (
                                  <span className="text-[10px] font-extrabold text-rose-400 bg-rose-950 px-1 py-0.2 rounded border border-rose-800">
                                    Stock: {prod?.currentStock}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for adding/editing event */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveModal}
        initialEvent={editingEvent}
        products={products}
        isDutyManagerOnly={isDutyManagerOnly}
      />

      {/* Confirmation Modal to Delete Event */}
      {eventToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="w-full max-w-md bg-[#0e1612] border border-rose-900/60 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-rose-950/60 bg-[#160f11]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-950/90 border border-rose-800/60 text-rose-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    ¿Eliminar este partido?
                  </h3>
                  <p className="text-xs text-rose-300/80">
                    Confirmación de eliminación
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div className="p-3.5 rounded-xl bg-[#131b16] border border-emerald-950/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                    {eventToDelete.teamCategory}
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
                    {eventToDelete.date} • {eventToDelete.time} h
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  {eventToDelete.title}
                </h4>
                {eventToDelete.location && (
                  <p className="text-xs text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {eventToDelete.location}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/40 text-xs text-rose-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  ¿Estás seguro de que deseas eliminar este partido de la programación? Esta acción no se puede deshacer y se borrará también su previsión de tercer tiempo.
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-rose-950/60 bg-[#121915] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (eventToDelete) {
                    onDeleteEvent(eventToDelete.id);
                    setEventToDelete(null);
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-lg shadow-rose-950/50 cursor-pointer active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirmar y eliminar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
