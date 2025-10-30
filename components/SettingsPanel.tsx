import React from 'react';
import { Reciter, Translation } from '../types';

interface SettingsPanelProps {
    reciters: Reciter[];
    translations: Translation[];
    selectedReciterId: string;
    selectedTranslationId: string;
    onReciterChange: (id: string) => void;
    onTranslationChange: (id: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
    reciters, 
    translations, 
    selectedReciterId, 
    selectedTranslationId, 
    onReciterChange, 
    onTranslationChange 
}) => {
    return (
        <div className="mb-6 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-4 justify-center">
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="reciter-select" className="text-sm font-medium text-slate-600 dark:text-zinc-300">Reciter:</label>
                <select 
                    id="reciter-select"
                    value={selectedReciterId}
                    onChange={(e) => onReciterChange(e.target.value)}
                    className="block w-full sm:w-auto pl-3 pr-8 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
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
                    className="block w-full sm:w-auto pl-3 pr-8 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
                >
                    {translations.map(translation => (
                        <option key={translation.id} value={translation.id}>{translation.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SettingsPanel;