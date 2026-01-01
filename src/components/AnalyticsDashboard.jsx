import { useState, useMemo } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    ScatterChart, Scatter, ZAxis
} from 'recharts';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { PieChart as PieIcon, TrendingUp, CircleDot, Calendar, CalendarDays } from 'lucide-react';
import clsx from 'clsx';
import { CHART_COLORS } from '../utils/constants';

const TABS = [
    { id: 'pie', icon: PieIcon, label: 'Distribution' },
    { id: 'line', icon: TrendingUp, label: 'Trend' },
    { id: 'scatter', icon: CircleDot, label: 'Scatter' },
];

const VIEWS = [
    { id: 'daily', icon: Calendar, label: 'Daily' },
    { id: 'monthly', icon: CalendarDays, label: 'Monthly' }
];

export default function AnalyticsDashboard({ entries, activities, survivalConfig, currentDate }) {
    const [activeTab, setActiveTab] = useState('pie');
    const [viewMode, setViewMode] = useState('daily');

    // Calculate Data based on View Mode
    const data = useMemo(() => {
        let dateRange = [];
        let pieRangeMatches = false; // Flag to filter Pie data specifically if daily

        if (viewMode === 'monthly') {
            const start = startOfMonth(currentDate);
            const end = endOfMonth(currentDate);
            dateRange = eachDayOfInterval({ start, end });
        } else {
            // Daily Mode
            const start = startOfWeek(currentDate, { weekStartsOn: 1 });
            dateRange = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
            pieRangeMatches = true;
        }

        const survivalTotal = (parseFloat(survivalConfig.sleep) || 0) +
            (parseFloat(survivalConfig.mobile) || 0) +
            (parseFloat(survivalConfig.pass) || 0);
        const availablePerDay = 24 - survivalTotal;

        // Aggregate for Pie
        const activityTotals = {};
        let totalLogged = 0;
        let totalLoss = 0;
        let pieAvailableTotal = 0;

        // Iterate for Line/Scatter Series (and Pie accumulation)
        const dailySeries = dateRange.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayEntries = entries[dateStr] || {};

            let dayLogged = 0;
            const dayData = { name: format(day, 'd'), date: dateStr, fullDate: format(day, 'MMM d'), Loss: 0 };

            activities.forEach(act => {
                const duration = parseFloat(dayEntries[act.id]) || 0;
                dayData[act.name] = duration;
                dayLogged += duration;

                const shouldAccumulate = viewMode === 'monthly' || isSameDay(day, currentDate);
                if (shouldAccumulate) {
                    activityTotals[act.name] = (activityTotals[act.name] || 0) + duration;
                }
            });

            const dayLoss = Math.max(0, availablePerDay - dayLogged);
            dayData.Loss = dayLoss;

            // Accumulate Totals for Efficiency Display
            const shouldAccumulateTotals = viewMode === 'monthly' || isSameDay(day, currentDate);
            if (shouldAccumulateTotals) {
                totalLogged += dayLogged;
                totalLoss += dayLoss;
                pieAvailableTotal += availablePerDay; // 1 day worth or month worth
            }

            return dayData;
        });

        // Pie Data preparation
        const pieData = [
            ...activities.map(act => ({
                name: act.name,
                value: activityTotals[act.name] || 0,
                color: act.color
            })),
            { name: 'Loss', value: totalLoss, color: CHART_COLORS.loss }
        ].filter(d => d.value > 0);

        // Scatter Data (Flattened)
        const scatterData = [];
        dateRange.forEach((day, dayIdx) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayEntries = entries[dateStr] || {};
            activities.forEach((act, actIdx) => {
                if (dayEntries[act.id]) {
                    scatterData.push({
                        day: dayIdx + 1,
                        dayName: format(day, 'd'),
                        activityName: act.name,
                        duration: dayEntries[act.id],
                        index: actIdx,
                        date: format(day, 'MMM d')
                    });
                }
            });
        });

        return { dailySeries, pieData, scatterData, totalLogged, totalLoss, availableTotal: pieAvailableTotal };
    }, [entries, activities, survivalConfig, currentDate, viewMode]);

    const efficiency = data.availableTotal > 0
        ? Math.round((data.totalLogged / data.availableTotal) * 100)
        : 0;

    return (
        <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">

            {/* Header */}
            <div className="flex flex-col gap-3 p-4 border-b border-[var(--border-color)] bg-[var(--glass-tint)]">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                        {viewMode === 'daily' ? 'Daily Analysis' : 'Monthly Analysis'}
                        <span className={clsx("text-xs px-2 py-0.5 rounded-full border font-mono",
                            efficiency >= 70 ? "border-green-500/50 text-green-400 bg-green-500/10" :
                                efficiency >= 40 ? "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" :
                                    "border-red-500/50 text-red-400 bg-red-500/10"
                        )}>
                            {efficiency}% Eff.
                        </span>
                    </h2>

                    {/* View Toggle */}
                    <div className="flex glass-input p-1 rounded-lg border border-[var(--border-color)]">
                        {VIEWS.map(view => (
                            <button
                                key={view.id}
                                onClick={() => setViewMode(view.id)}
                                className={clsx(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200",
                                    viewMode === view.id
                                        ? "bg-[var(--accent)] text-white shadow-lg"
                                        : "text-gray-400 hover:text-[var(--text-main)] hover:bg-white/5"
                                )}
                            >
                                <view.icon className="w-3 h-3" />
                                {view.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart Type Toggle */}
                <div className="flex justify-end">
                    <div className="flex glass-input p-1 rounded-lg border border-[var(--border-color)]">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "p-1.5 rounded-md transition-all duration-200",
                                    activeTab === tab.id
                                        ? "bg-[var(--accent)] text-white shadow-lg"
                                        : "text-gray-400 hover:text-[var(--text-main)] hover:bg-white/5"
                                )}
                                title={tab.label}
                            >
                                <tab.icon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                    {activeTab === 'pie' ? (
                        <PieChart>
                            <Pie
                                data={data.pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <ReTooltip
                                contentStyle={{
                                    backgroundColor: 'var(--glass-tint)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-main)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(12px)'
                                }}
                                itemStyle={{ color: 'var(--text-main)' }}
                            />
                            <Legend />
                        </PieChart>
                    ) : activeTab === 'line' ? (
                        <LineChart data={data.dailySeries}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.3} />
                            <XAxis
                                dataKey="name"
                                stroke="var(--text-main)"
                                interval={viewMode === 'monthly' ? 2 : 0}
                            />
                            <YAxis stroke="var(--text-main)" />
                            <ReTooltip
                                contentStyle={{
                                    backgroundColor: 'var(--glass-tint)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-main)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(12px)'
                                }}
                                labelFormatter={(label, payload) => payload[0]?.payload.fullDate || label}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="Loss" stroke={CHART_COLORS.loss} strokeWidth={2} dot={false} strokeDasharray="5 5" />
                            {activities.map(act => (
                                <Line
                                    key={act.id}
                                    type="monotone"
                                    dataKey={act.name}
                                    stroke={act.color}
                                    strokeWidth={2}
                                    dot={viewMode === 'daily' ? { r: 4, strokeWidth: 0, fill: act.color } : false}
                                />
                            ))}
                        </LineChart>
                    ) : (
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.3} />
                            <XAxis
                                type="number"
                                dataKey="day"
                                name="Day"
                                tickFormatter={d => viewMode === 'daily' ? ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d] : d}
                                stroke="var(--text-main)"
                                domain={viewMode === 'daily' ? [0.5, 7.5] : [0, 32]}
                            />
                            <YAxis type="number" dataKey="duration" name="Hours" unit="h" stroke="var(--text-main)" />
                            <ReTooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{
                                    backgroundColor: 'var(--glass-tint)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-main)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(12px)'
                                }}
                                formatter={(value, name, props) => [`${value}h`, props.payload.date]}
                            />
                            <Legend />
                            {activities.map((act, i) => (
                                <Scatter
                                    key={act.id}
                                    name={act.name}
                                    data={data.scatterData.filter(d => d.activityName === act.name)}
                                    fill={act.color}
                                />
                            ))}
                        </ScatterChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
