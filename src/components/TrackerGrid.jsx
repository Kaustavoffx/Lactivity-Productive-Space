import { useState } from 'react';
import { format, startOfWeek, addDays, isBefore, startOfToday, isSameDay, isAfter, subDays } from 'date-fns';
import { Plus, Trash2, ChevronLeft, ChevronRight, Scaling, Coins, Lock, Unlock } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import clsx from 'clsx';

export default function TrackerGrid({
    activities, entries, logActivity, addActivity, deleteActivity,
    currentDate, setCurrentDate, columnSize, setColumnSize,
    tokens, consumeToken
}) {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
    const today = startOfToday();
    const yesterday = subDays(today, 1);

    const handlePrevWeek = () => setCurrentDate(d => addDays(d, -7));
    const handleNextWeek = () => setCurrentDate(d => addDays(d, 7));
    const handleToday = () => setCurrentDate(new Date());

    const [newActivityName, setNewActivityName] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [unlockedCells, setUnlockedCells] = useState({});

    // Modal State
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: () => { } });

    const openModal = (config) => setModalConfig({ ...config, isOpen: true });
    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (newActivityName.trim()) {
            addActivity(newActivityName);
            setNewActivityName('');
            setIsAdding(false);
        }
    };

    return (
        <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden transition-all duration-300">
            {/* Header Controls */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--glass-tint)]">
                <div className="flex items-center gap-2">
                    <button onClick={handlePrevWeek} className="p-2 hover:bg-white/10 rounded-lg text-current transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={handleNextWeek} className="p-2 hover:bg-white/10 rounded-lg text-current transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-lg ml-2">
                        {format(weekStart, 'MMM d')} - {format(weekDays[6], 'MMM d')}
                    </span>
                    {!isSameDay(weekStart, startOfWeek(today, { weekStartsOn: 1 })) && (
                        <button onClick={handleToday} className="ml-4 text-xs text-[var(--accent)] hover:underline font-bold">
                            Return to Current Week
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {/* Token Display */}
                    <div className="flex items-center gap-2 px-3 py-1.5 glass-input rounded-lg border border-[var(--border-color)] bg-amber-500/5">
                        <Coins className={clsx("w-4 h-4", tokens.count > 0 ? "text-amber-400" : "text-gray-500")} />
                        <span className={clsx("font-bold font-mono", tokens.count > 0 ? "text-white" : "text-gray-500")}>{tokens.count}</span>
                        <span className="text-xs opacity-50">/ 3</span>
                    </div>

                    {/* Column Sizer */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsResizing(!isResizing)}
                            className={clsx("p-2 rounded-lg transition-colors", isResizing ? "bg-white/10 text-[var(--accent)]" : "text-gray-400 hover:text-white")}
                            title="Adjust Column Size"
                        >
                            <Scaling className="w-4 h-4" />
                        </button>
                        {isResizing && (
                            <input
                                type="range"
                                min="80"
                                max="300"
                                value={columnSize}
                                onChange={(e) => setColumnSize(parseInt(e.target.value))}
                                className="w-24 h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Grid Container */}
            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse" style={{ minWidth: activities.length * columnSize + 150 }}>
                    <thead>
                        <tr>
                            <th className="p-4 border-b border-r border-[var(--border-color)] bg-[var(--glass-tint)] sticky top-0 left-0 z-20 backdrop-blur-md w-32 shadow-lg">
                                <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">Date</span>
                            </th>
                            {activities.map(activity => (
                                <th
                                    key={activity.id}
                                    className="p-4 border-b border-[var(--border-color)] bg-[var(--glass-tint)] sticky top-0 z-10 backdrop-blur-md group"
                                    style={{ width: columnSize, minWidth: columnSize }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold truncate text-[var(--text-main)]" style={{ textShadow: `0 0 10px ${activity.color}40` }}>
                                            {activity.name}
                                        </span>
                                        <button
                                            onClick={() => deleteActivity(activity.id)}
                                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="h-0.5 w-full mt-2 rounded-full opacity-50" style={{ backgroundColor: activity.color }} />
                                </th>
                            ))}
                            <th className="p-4 border-b border-[var(--border-color)] bg-[var(--glass-tint)] sticky top-0 z-10 min-w-[150px] backdrop-blur-md">
                                {isAdding ? (
                                    <form onSubmit={handleAddSubmit} className="flex items-center gap-2">
                                        <input
                                            autoFocus
                                            type="text"
                                            value={newActivityName}
                                            onChange={(e) => setNewActivityName(e.target.value)}
                                            onBlur={() => !newActivityName && setIsAdding(false)}
                                            className="w-full glass-input rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                                            placeholder="Name..."
                                        />
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setIsAdding(true)}
                                        className="flex items-center gap-1 text-gray-400 hover:text-current transition-colors text-sm font-bold uppercase tracking-wider"
                                    >
                                        <Plus className="w-4 h-4" /> Add
                                    </button>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {weekDays.map(day => {
                            const isPast = isBefore(day, today);
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const isToday = isSameDay(day, today);
                            const isSelected = isSameDay(day, currentDate);

                            return (
                                <tr
                                    key={dateStr}
                                    onClick={() => setCurrentDate(day)}
                                    className={clsx(
                                        "border-b border-[var(--border-color)] transition-colors cursor-pointer",
                                        isSelected ? "bg-[var(--safe-bg)]" : isToday ? "bg-white/5" : "hover:bg-white/5"
                                    )}
                                >
                                    <td className={clsx(
                                        "p-4 border-r border-[var(--border-color)] sticky left-0 z-10 backdrop-blur-md transition-colors",
                                        isSelected ? "bg-[var(--glass-tint)] border-r-[var(--accent)]" : "bg-[var(--glass-tint)]"
                                    )}>
                                        <div className="flex flex-col">
                                            <span className={clsx("font-bold text-lg", isToday ? "text-[var(--accent)]" : "text-[var(--text-main)]")}>
                                                {format(day, 'EEE')}
                                            </span>
                                            <span className="text-xs opacity-60 font-mono">{format(day, 'MMM d')}</span>
                                        </div>
                                    </td>
                                    {activities.map(activity => {
                                        const value = entries[dateStr]?.[activity.id] || '';
                                        const isActive = value > 0;

                                        return (
                                            <td
                                                key={activity.id}
                                                className="p-2 relative group"
                                                onClick={(e) => {
                                                    const cellKey = `${dateStr}_${activity.id}`;
                                                    const isFuture = isAfter(day, today); // strict future handles everything after today
                                                    // "Time Travel" Lock: Only lock days BEFORE yesterday. Yesterday is free to edit.
                                                    const isLockedPast = isBefore(day, yesterday) && !unlockedCells[cellKey];

                                                    if (isFuture) return;

                                                    if (isLockedPast) {
                                                        e.stopPropagation();
                                                        if (tokens.count > 0) {
                                                            openModal({
                                                                title: 'Use Token?',
                                                                message: 'Using a token will unlock this cell for editing. You have ' + tokens.count + ' tokens remaining.',
                                                                confirmText: 'Use 1 Token',
                                                                type: 'warning',
                                                                onConfirm: () => {
                                                                    if (consumeToken()) {
                                                                        setUnlockedCells(prev => ({ ...prev, [cellKey]: true }));
                                                                    }
                                                                }
                                                            });
                                                        } else {
                                                            openModal({
                                                                title: 'No Tokens Remaining',
                                                                message: 'You have used all your daily tokens. You can no longer edit past activities today.',
                                                                confirmText: 'Understood',
                                                                cancelText: 'Close',
                                                                type: 'warning',
                                                                onConfirm: () => { }
                                                            });
                                                        }
                                                    }
                                                }}
                                            >
                                                <div className={clsx(
                                                    "relative w-full h-12 rounded-lg border transition-all duration-300 flex items-center justify-center overflow-hidden",
                                                    isActive
                                                        ? "border-[var(--accent)] shadow-[0_0_15px_rgba(255,255,255,0.1)] bg-[var(--accent)] bg-opacity-20"
                                                        : "border-transparent glass-input hover:border-[var(--border-color)]",
                                                    (isAfter(day, today) || (isBefore(day, yesterday) && !unlockedCells[`${dateStr}_${activity.id}`])) && "opacity-60"
                                                )}>
                                                    {isBefore(day, yesterday) && !unlockedCells[`${dateStr}_${activity.id}`] && (
                                                        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                            <Lock className="w-4 h-4 text-white/70" />
                                                        </div>
                                                    )}
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="24"
                                                        step="0.5"
                                                        disabled={isAfter(day, today) || (isBefore(day, yesterday) && !unlockedCells[`${dateStr}_${activity.id}`])}
                                                        value={value}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => logActivity(dateStr, activity.id, e.target.value)}
                                                        className={clsx(
                                                            "w-full h-full bg-transparent text-center font-mono font-bold focus:outline-none appearance-none text-lg",
                                                            // For contrast: Always use text-main unless active, then use brighter white if needed
                                                            // Actually, let's keep it simple: text-main is calculated for contrast in CSS.
                                                            isActive ? "text-[var(--text-main)] drop-shadow-md" : "text-gray-500",
                                                            (isAfter(day, today) || (isBefore(day, yesterday) && !unlockedCells[`${dateStr}_${activity.id}`])) ? "cursor-not-allowed" : "cursor-text"
                                                        )}
                                                    />
                                                </div>
                                            </td>
                                        );
                                    })}
                                    <td className="p-4"></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                {...modalConfig}
            />
        </div>
    );
}
