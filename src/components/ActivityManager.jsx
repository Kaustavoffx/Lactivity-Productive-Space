import { useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import clsx from 'clsx';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// Map days to index 0-6 (Mon-Sun) if needed, but simple string matching works for display if consistent.
// Actually date-fns uses 0=Sun, 1=Mon. Let's align with that or just use string checking.
// Let's store days as indices: 1=Mon, ..., 6=Sat, 0=Sun.
const DAY_INDICES = [1, 2, 3, 4, 5, 6, 0];

export default function ActivityManager({ activities, setActivities }) {
    const [name, setName] = useState('');
    const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]); // Default Mon-Fri

    const toggleDay = (dayIndex) => {
        if (selectedDays.includes(dayIndex)) {
            setSelectedDays(selectedDays.filter(d => d !== dayIndex));
        } else {
            setSelectedDays([...selectedDays, dayIndex]);
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        const newActivity = {
            id: crypto.randomUUID(),
            name: name.trim(),
            days: selectedDays,
            createdAt: new Date().toISOString()
        };

        setActivities([...activities, newActivity]);
        setName('');
    };

    const handleDelete = (id) => {
        setActivities(activities.filter(a => a.id !== id));
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 bg-antigravity-surface/50 backdrop-blur-md rounded-2xl border border-antigravity-border shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-antigravity-purple" />
                Manage Activities
            </h2>

            <form onSubmit={handleAdd} className="mb-6 space-y-4">
                <div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Activity name (e.g. Gym)"
                        className="w-full bg-antigravity-dark/50 border border-antigravity-border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-antigravity-purple placeholder-gray-500"
                    />
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    {DAYS.map((dayLabel, index) => {
                        const dayIndex = DAY_INDICES[index];
                        const isSelected = selectedDays.includes(dayIndex);
                        return (
                            <button
                                key={dayIndex}
                                type="button"
                                onClick={() => toggleDay(dayIndex)}
                                className={clsx(
                                    "w-10 h-10 rounded-full text-xs font-bold transition-all duration-200",
                                    isSelected
                                        ? "bg-antigravity-purple text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                        : "bg-antigravity-card text-gray-400 hover:bg-white/10"
                                )}
                            >
                                {dayLabel}
                            </button>
                        );
                    })}
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-antigravity-purple to-antigravity-blue text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Activity
                </button>
            </form>

            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {activities.length === 0 && (
                    <p className="text-gray-500 text-sm italic">No activities yet.</p>
                )}
                {activities.map(activity => (
                    <li key={activity.id} className="flex justify-between items-center bg-antigravity-card p-3 rounded-lg border border-antigravity-border/50">
                        <div className="text-left">
                            <span className="text-white font-medium block">{activity.name}</span>
                            <span className="text-xs text-gray-400">
                                {activity.days.length === 7 ? 'Every day' :
                                    activity.days.length === 0 ? 'No days set' :
                                        activity.days.length === 5 && !activity.days.includes(0) && !activity.days.includes(6) ? 'Weekdays' :
                                            activity.days.map(d => DAYS[DAY_INDICES.indexOf(d)]).join(', ')}
                            </span>
                        </div>
                        <button
                            onClick={() => handleDelete(activity.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
