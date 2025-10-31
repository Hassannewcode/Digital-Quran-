import React from 'react';
import { Reciter, Translation } from '../types';

interface SettingsPanelProps {
    reciters: Reciter[];
    translations: Translation[];
    selectedReciterId: string;
    selectedTranslationId: string;
    onReciterChange: (id: string) => void;
    onTranslationChange: (id: string) => void;
    pitch: number;
    onPitchChange: (pitch: number) => void;
    speed: number;
    onSpeedChange: (speed: number) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
    reciters, 
    translations, 
    selectedReciterId, 
    selectedTranslationId, 
    onReciterChange, 
    onTranslationChange,
    pitch,
    onPitchChange,
    speed,
    onSpeedChange,
}) => {
    return (
        <div className="mb-6 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-slate-200 dark:border-zinc-800 flex flex-wrap items-center gap-x-6 gap-y-4 justify-center">
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="reciter-select" className="text-sm font-medium text-slate-600 dark:text-zinc-300">Reciter:</label>
                <select 
                    id="reciter-select"
                    value={selectedReciterId}
                    onChange={(e) => onReciterChange(e.target.value)}
                    className="block w-full sm:w-auto pl-3 pr-8 py-2 text-base bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                    {reciters.map(reciter => (
                        <option key={reciter.id} value={reciter.id}>{reciter.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="translation-select" className="text-sm font-medium text-slate-600 dark:text-zinc-300">Translation:</label>
                <select 
                    id="translation-select"
                    value={selectedTranslationId}
                    onChange={(e) => onTranslationChange(e.target.value)}
                    className="block w-full sm:w-auto pl-3 pr-8 py-2 text-base bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                    {translations.map(translation => (
                        <option key={translation.id} value={translation.id}>{translation.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="speed-control" className="text-sm font-medium text-slate-600 dark:text-zinc-300">Speed:</label>
                <input 
                    id="speed-control"
                    type="range"
                    min="0.5" max="2" step="0.05"
                    value={speed}
                    onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                    className="w-24 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700"
                />
                <span className="text-sm w-10 text-right">{speed.toFixed(2)}x</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="pitch-control" className="text-sm font-medium text-slate-600 dark:text-zinc-300">Pitch:</label>
                <input 
                    id="pitch-control"
                    type="range"
                    min="0.5" max="2" step="0.05"
                    value={pitch}
                    onChange={(e) => onPitchChange(parseFloat(e.target.value))}
                    className="w-24 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700"
                />
                <span className="text-sm w-10 text-right">{pitch.toFixed(2)}x</span>
            </div>
        </div>
    );
};

export default SettingsPanel;