import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Settings, CloudSun, Palette } from 'lucide-react';
import clsx from 'clsx';

import useAntigravityData from './hooks/useAntigravityData';
import TrackerGrid from './components/TrackerGrid';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SurvivalConfig from './components/SurvivalConfig';

const THEMES = [
  { id: 'immense', label: 'Immense (Amber)', color: '#d97706' },
  { id: 'glacier', label: 'Breeze (Peach/Pink)', color: '#fb7185' },
  { id: 'viper', label: 'Viper (Neon Green)', color: '#84cc16' },
  { id: 'abyss', label: 'Abyss (Deep Teal)', color: '#2dd4bf' },
  { id: 'magma', label: 'Magma (Red)', color: '#ef4444' },
];

function App() {
  const {
    survivalConfig, updateSurvivalConfig,
    activities, addActivity, deleteActivity,
    entries, logActivity,
    getDailyStats,
    currentTheme, updateTheme,
    columnSize, setColumnSize
  } = useAntigravityData();

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  // Apply theme to body so global CSS variables work
  useEffect(() => {
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <div
      className="min-h-screen bg-[var(--bg-gradient)] text-[var(--text-main)] font-sans selection:bg-[var(--accent)] selection:text-white overflow-hidden flex flex-col relative transition-colors duration-500"
    >
      <div className="relative z-10 w-full max-w-[1600px] mx-auto p-4 md:p-6 flex flex-col gap-6 flex-1 h-screen">
        {/* Header Dashboard */}
        <header className="glass-panel flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl shrink-0 shadow-lg relative z-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-blue-500 rounded-xl shadow-lg flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform">
              <span className="text-2xl font-bold text-white">L</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
                Lactivity
              </h1>
              <div className="text-xs opacity-70 font-mono">
                {format(currentDate, 'MMMM yyyy')} • Week {format(currentDate, 'w')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Theme Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 glass-input hover:bg-white/10 rounded-lg transition-all text-sm font-medium border border-[var(--border-color)]"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Theme</span>
              </button>

              {isThemeMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 glass-panel rounded-xl overflow-hidden z-50 flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-100">
                  {THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => { updateTheme(theme.id); setIsThemeMenuOpen(false); }}
                      className={clsx(
                        "px-4 py-2 text-left text-sm hover:bg-white/10 flex items-center gap-2 transition-colors",
                        currentTheme === theme.id && "bg-white/10 font-bold text-[var(--accent)]"
                      )}
                    >
                      <div className="w-3 h-3 rounded-full border border-white/20" style={{ background: theme.color }} />
                      {theme.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Weather Widget Placeholder */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 glass-input rounded-lg text-sm opacity-80 border border-[var(--border-color)]">
              <CloudSun className="w-4 h-4 text-amber-400" />
              <span>24°C</span>
            </div>

            <button
              onClick={() => setIsConfigOpen(true)}
              className="flex items-center gap-2 px-4 py-2 glass-input hover:bg-white/10 rounded-lg transition-all text-sm font-medium border border-[var(--border-color)]"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Config</span>
            </button>
          </div>
        </header>

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 overflow-hidden min-h-0">
          {/* Main Tracker Area */}
          <div className="h-full min-h-0">
            <TrackerGrid
              activities={activities}
              entries={entries}
              logActivity={logActivity}
              addActivity={addActivity}
              deleteActivity={deleteActivity}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              columnSize={columnSize}
              setColumnSize={setColumnSize}
            />
          </div>

          {/* Analytics Sidebar */}
          <div className="h-full min-h-0">
            <AnalyticsDashboard
              entries={entries}
              activities={activities}
              survivalConfig={survivalConfig}
              currentDate={currentDate}
            />
          </div>
        </main>
      </div>

      <SurvivalConfig
        config={survivalConfig}
        updateConfig={updateSurvivalConfig}
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </div>
  );
}

export default App;
