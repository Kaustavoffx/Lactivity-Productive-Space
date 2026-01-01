import { useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { DEFAULT_SURVIVAL_CONFIG, STORAGE_KEYS, CHART_COLORS } from '../utils/constants';

export default function useAntigravityData() {
    const [survivalConfig, setSurvivalConfig] = useLocalStorage(STORAGE_KEYS.SURVIVAL, DEFAULT_SURVIVAL_CONFIG);
    const [activities, setActivities] = useLocalStorage(STORAGE_KEYS.ACTIVITIES, []);
    const [entries, setEntries] = useLocalStorage(STORAGE_KEYS.ENTRIES, {});

    const updateSurvivalConfig = (newConfig) => {
        setSurvivalConfig({ ...survivalConfig, ...newConfig });
    };

    const addActivity = (name) => {
        if (!name.trim()) return;
        const newActivity = {
            id: crypto.randomUUID(),
            name: name.trim(),
            color: CHART_COLORS.activities[activities.length % CHART_COLORS.activities.length],
            createdAt: new Date().toISOString()
        };
        setActivities([...activities, newActivity]);
    };

    const deleteActivity = (id) => {
        setActivities(activities.filter(a => a.id !== id));
        // Optional: Clean up entries for this activity? 
        // For a strict tracker, keeping history might be better, but removing column implies removing data visibility.
        // Let's keep data in 'entries' but it won't be visible in grid.
    };

    const logActivity = (dateStr, activityId, hours) => {
        setEntries(prev => {
            const dayEntries = prev[dateStr] || {};
            // If hours is 0 or empty, remove the entry to keep object clean
            if (!hours || hours === 0) {
                const newDayEntries = { ...dayEntries };
                delete newDayEntries[activityId];
                return { ...prev, [dateStr]: newDayEntries };
            }
            return {
                ...prev,
                [dateStr]: {
                    ...dayEntries,
                    [activityId]: parseFloat(hours)
                }
            };
        });
    };

    const getDailyStats = useCallback((dateStr) => {
        const dayEntries = entries[dateStr] || {};
        const survivalTotal = (parseFloat(survivalConfig.sleep) || 0) +
            (parseFloat(survivalConfig.mobile) || 0) +
            (parseFloat(survivalConfig.pass) || 0);

        const availableHours = 24 - survivalTotal;

        let totalLogged = 0;
        Object.values(dayEntries).forEach(duration => {
            totalLogged += (parseFloat(duration) || 0);
        });

        // Loss logic: Loss = Available - Logged. 
        // If Logged > Available (overtime?), Loss is 0.
        const loss = Math.max(0, availableHours - totalLogged);

        return {
            availableHours,
            totalLogged,
            loss,
            survivalTotal,
            entries: dayEntries
        };
    }, [entries, survivalConfig]);

    const [currentTheme, setCurrentTheme] = useLocalStorage('lactivity-theme', 'immense');
    const [columnSize, setColumnSize] = useLocalStorage('lactivity-col-size', 120);

    const updateTheme = (theme) => setCurrentTheme(theme);

    return {
        survivalConfig,
        updateSurvivalConfig,
        activities,
        addActivity,
        deleteActivity,
        entries,
        logActivity,
        getDailyStats,
        currentTheme,
        updateTheme,
        columnSize,
        setColumnSize
    };
}
