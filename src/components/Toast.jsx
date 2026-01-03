import { X, Trophy, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { BADGES } from '../utils/constants';

export default function Toast({ toast, onClose }) {
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [toast, onClose]);

    if (!toast) return null;

    const badge = Object.values(BADGES).find(b => b.id === toast.id);
    if (!badge) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[110] animate-in slide-in-from-right fade-in duration-300">
            <div className="glass-panel p-4 rounded-xl border-l-4 flex gap-4 items-start shadow-2xl max-w-sm"
                style={{ borderLeftColor: badge.isConsequence ? '#ef4444' : '#fbbf24' }}
            >
                <div className={`p-2 rounded-lg ${badge.isConsequence ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {badge.isConsequence ? <AlertTriangle className="w-6 h-6" /> : <Trophy className="w-6 h-6" />}
                </div>
                <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider opacity-60">
                        {badge.isConsequence ? 'Warning' : 'Achievement Unlocked'}
                    </h4>
                    <h3 className={`font-bold text-lg leading-tight ${badge.color}`}>
                        {badge.label}
                    </h3>
                    <p className="text-xs opacity-70 mt-1">{badge.description}</p>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full opacity-50 hover:opacity-100">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
