import { useState } from 'react';
import { Settings, X } from 'lucide-react';

export default function SurvivalConfig({ config, updateConfig, isOpen, onClose }) {
    if (!isOpen) return null;

    const handleChange = (key, value) => {
        updateConfig({ [key]: parseFloat(value) || 0 });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-antigravity-surface border border-antigravity-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-antigravity-border bg-antigravity-dark/50">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Settings className="w-5 h-5 text-antigravity-purple" />
                        Survival Configuration
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <p className="text-sm text-gray-400">
                        Define your necessary time expenditure. These hours are deducted from 24h to calculate your <span className="text-antigravity-blue font-bold">Opportunity Window</span>.
                    </p>

                    {[
                        { key: 'sleep', label: 'Sleep', desc: 'Rest & Recovery' },
                        { key: 'mobile', label: 'Mobile / Utilities', desc: 'Essential device time' },
                        { key: 'pass', label: 'Time Pass', desc: 'Leisure & Unproductive' }
                    ].map(({ key, label, desc }) => (
                        <div key={key} className="space-y-1">
                            <label className="flex justify-between text-sm font-medium text-white">
                                {label}
                                <span className="text-antigravity-purple font-mono">{config[key]}h</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="12"
                                step="0.5"
                                value={config[key]}
                                onChange={(e) => handleChange(key, e.target.value)}
                                className="w-full h-2 bg-antigravity-dark rounded-lg appearance-none cursor-pointer accent-antigravity-purple hover:accent-antigravity-accent"
                            />
                            <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                    ))}

                    <div className="mt-6 pt-6 border-t border-antigravity-border">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Available "Opportunity" Window:</span>
                            <span className="text-xl font-bold text-white font-mono">
                                {24 - (config.sleep + config.mobile + config.pass)}h
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-antigravity-dark/30">
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-antigravity-purple hover:bg-antigravity-accent text-white font-bold rounded-lg transition-colors"
                    >
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}
