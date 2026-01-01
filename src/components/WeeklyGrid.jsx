import { startOfWeek, addDays, format, getDay, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WeeklyGrid({ activities, completions, setCompletions }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Start week on Monday (1)
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    const toggleCompletion = (dateStr, activityId) => {
        const key = `${dateStr}-${activityId}`;
        setCompletions(prev => {
            const newCompletions = { ...prev };
            if (newCompletions[key]) {
                delete newCompletions[key];
            } else {
                newCompletions[key] = true;
            }
            return newCompletions;
        });
    };

    const handlePrevWeek = () => setCurrentDate(d => addDays(d, -7));
    const handleNextWeek = () => setCurrentDate(d => addDays(d, 7));
    const handleToday = () => setCurrentDate(new Date());

    const today = new Date();

    return (
        <div className="w-full flex flex-col h-full bg-antigravity-surface/30 backdrop-blur-sm rounded-none md:rounded-2xl border-0 md:border border-antigravity-border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-antigravity-border bg-antigravity-dark/50">
                <button onClick={handlePrevWeek} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-white font-bold text-lg">
                        {format(weekStart, 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
                    </span>
                    <button onClick={handleToday} className="text-xs text-antigravity-purple hover:underline mt-1">
                        Jump to Today
                    </button>
                </div>
                <button onClick={handleNextWeek} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto custom-scrollbar">
                <div className="min-w-[800px] md:min-w-0"> {/* Ensure scrolling on mobile if squashed */}

                    {/* Days Header */}
                    <div className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-antigravity-border bg-antigravity-dark/30 sticky top-0 z-10">
                        <div className="p-3 text-left font-semibold text-gray-400 text-sm flex items-center">Activity</div>
                        {weekDays.map((day, i) => {
                            const isToday = isSameDay(day, today);
                            return (
                                <div key={i} className={clsx("p-3 text-center border-l border-antigravity-border/30", isToday && "bg-white/5")}>
                                    <div className="text-xs text-gray-500 uppercase">{format(day, 'EEE')}</div>
                                    <div className={clsx("text-lg font-bold", isToday ? "text-antigravity-purple" : "text-white")}>
                                        {format(day, 'd')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Activity Rows */}
                    {activities.length === 0 ? (
                        <div className="p-10 text-gray-500 italic">Add activities to start tracking!</div>
                    ) : (
                        activities.map(activity => (
                            <div key={activity.id} className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-antigravity-border/30 hover:bg-white/5 transition-colors group">
                                <div className="p-3 text-left text-white font-medium flex items-center border-r border-antigravity-border/30 truncate">
                                    {activity.name}
                                </div>
                                {weekDays.map((day, i) => {
                                    const dayIndex = getDay(day); // 0=Sun, 1=Mon...
                                    const isScheduled = activity.days.includes(dayIndex);
                                    const dateStr = format(day, 'yyyy-MM-dd');
                                    const isCompleted = completions[`${dateStr}-${activity.id}`];

                                    return (
                                        <div key={i} className="p-2 flex items-center justify-center border-l border-antigravity-border/30 relative">
                                            {isScheduled ? (
                                                <button
                                                    onClick={() => toggleCompletion(dateStr, activity.id)}
                                                    className={clsx(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                                                        isCompleted
                                                            ? "bg-gradient-to-br from-antigravity-purple to-antigravity-blue shadow-[0_0_15px_rgba(139,92,246,0.5)] scale-100"
                                                            : "bg-antigravity-card border-2 border-gray-600 hover:border-antigravity-purple/50 scale-90 opacity-70 hover:opacity-100"
                                                    )}
                                                >
                                                    {isCompleted && <Check className="w-5 h-5 text-white stroke-[3]" />}
                                                </button>
                                            ) : (
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-800/50" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
