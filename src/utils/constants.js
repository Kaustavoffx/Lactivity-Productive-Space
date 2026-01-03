export const CHART_COLORS = {
    loss: '#ef4444', // Red-500
    activities: [
        '#8b5cf6', // Violet-500
        '#3b82f6', // Blue-500
        '#10b981', // Emerald-500
        '#f59e0b', // Amber-500
        '#ec4899', // Pink-500
        '#06b6d4', // Cyan-500
        '#84cc16', // Lime-500
        '#d946ef', // Fuchsia-500
    ]
};

export const DEFAULT_SURVIVAL_CONFIG = {
    sleep: 8,
    mobile: 2,
    pass: 2
};

export const STORAGE_KEYS = {
    ACTIVITIES: 'lactivity-activities',
    ENTRIES: 'lactivity-entries',
    SURVIVAL: 'lactivity-survival-config',
    TOKENS: 'lactivity-tokens',
    ACHIEVEMENTS: 'lactivity-achievements'
};

export const BADGES = {
    SPARK: {
        id: 'spark',
        label: 'The Spark',
        description: 'Completed Day 1 (1st Strike)',
        icon: 'Sparkles',
        color: 'text-yellow-400',
    },
    MOMENTUM: {
        id: 'momentum',
        label: 'Momentum',
        description: '3 Day Strike',
        icon: 'Flame',
        color: 'text-orange-500',
    },
    ORBIT: {
        id: 'orbit',
        label: 'Orbit',
        description: '7 Day Strike',
        icon: 'Orbit',
        color: 'text-purple-500',
    }
};
