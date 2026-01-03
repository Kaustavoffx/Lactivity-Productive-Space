import { Flame, Zap, Sparkles, Snowflake } from 'lucide-react';
import clsx from 'clsx';

export default function StrikeIndicator({ productiveHours, lossHours }) {
    // Determine Streak Level
    let level = 'warmup';
    if (productiveHours >= 5) level = 'godmode';
    else if (productiveHours >= 2) level = 'active';

    const isVoid = lossHours > productiveHours && lossHours > 0;

    const getIcon = () => {
        if (isVoid) return <Snowflake className="w-5 h-5 text-blue-300 animate-pulse" />;
        switch (level) {
            case 'godmode': return <Zap className="w-5 h-5 text-red-500 fill-red-500 animate-bounce" />;
            case 'active': return <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />;
            case 'warmup': default: return <Sparkles className="w-5 h-5 text-yellow-300" />;
        }
    };

    const getStyles = () => {
        if (isVoid) return "text-blue-300 border-blue-500/30 bg-blue-500/10";
        switch (level) {
            case 'godmode': return "text-red-500 border-red-500/50 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.4)]";
            case 'active': return "text-orange-400 border-orange-400/30 bg-orange-400/10";
            case 'warmup': default: return "text-yellow-300 border-yellow-300/30 bg-yellow-300/10";
        }
    };

    return (
        <div className={clsx(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-md transition-all duration-300",
            getStyles()
        )}>
            {getIcon()}
            <span className="font-mono font-bold text-sm tracking-wider">
                {productiveHours.toFixed(1)}h
            </span>
            {isVoid && <span className="text-[10px] opacity-70 ml-1">VOID</span>}
        </div>
    );
}
