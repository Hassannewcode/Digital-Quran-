import React from 'react';
import SettingsPanel from './SettingsPanel';
import { Reciter, Translation } from '../types';

interface SettingsViewProps {
    reciters: Reciter[];
    translations: Translation[];
    selectedReciterId: string;
    selectedTranslationId: string;
    onReciterChange: (id: string) => void;
    onTranslationChange: (id: string) => void;
}

const tableData = [
    { area: 'Textual Authority', inspiration: 'King Fahd Complex & Tanzil.net', weight: '100% of Core Data', value: 'Unquestionable Accuracy: Uses the official Madinah Mushaf standard for the raw Arabic text.' },
    { area: 'Core Experience', inspiration: 'Quran.com & KSU-Ayat', weight: '50% of Interface Features', value: 'Usability & Access: Modern, intuitive interface with fast loading, integrated high-quality audio recitations, and numerous translations.' },
    { area: 'Academic Depth', inspiration: 'Corpus.Quran.com', weight: '30% of Interface Features', value: 'Linguistic Study: In-depth word-by-word morphological analysis, syntax trees, and grammatical tagging for every word.' },
    { area: 'Learning & Practice', inspiration: 'UQU Maqraah & Al-Harmain Maqraa', weight: '20% of Interface Features', value: 'Recitation & Memorization: Structured modules for tajwīd practice, guided recitation sessions, and memorization aids.' },
];

const inspirationLinks = [
    { name: 'KSU-Electronic Moshaf project (Ayat)', url: 'https://quran.ksu.edu.sa' },
    { name: 'King Fahd Complex for the Printing of the Holy Quran', url: 'https://qurancomplex.gov.sa' },
    { name: 'Umm Al-Qura University Electronic Maqraah', url: 'https://uqu.edu.sa/en/coldawa/MaqraaUmmAlQura' },
    { name: 'Al-Harmain Maqraa', url: 'https://maqraa.prh.gov.sa' },
    { name: 'Quran.com', url: 'https://quran.com' },
    { name: 'Tanzil.net', url: 'https://tanzil.net' },
    { name: 'Corpus.Quran.com (The Quranic Arabic Corpus)', url: 'https://corpus.quran.com' },
    { name: 'Arabic101.org', url: 'https://arabic101.org' },
];

const SettingsView: React.FC<SettingsViewProps> = (props) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SettingsPanel {...props} />

      <section className="text-slate-700 dark:text-zinc-300">
        <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-6">Our Inspiration & Feature Breakdown</h2>
        <p className="mb-6 leading-relaxed">This application is inspired by the world's best Quranic platforms. Our goal is to blend authoritative text with powerful, modern study tools. The platform's design is guided by the following principles:</p>
        
        <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
                <div className="border rounded-lg shadow dark:border-zinc-700 bg-white dark:bg-zinc-800/20">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Functional Area</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Combined Feature Inspiration</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Percentage Weight</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Core Value Delivered</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700">
                            {tableData.map((row) => (
                                <tr key={row.area}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{row.area}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.inspiration}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.weight}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{row.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-6">Sources & Acknowledgements</h2>
        <p className="mb-6 leading-relaxed">This project would not be possible without the incredible work of many organizations dedicated to serving the Holy Quran. We are inspired by and grateful for their efforts:</p>
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
            <ul className="space-y-3">
                {inspirationLinks.map(link => (
                    <li key={link.name}>
                        <a 
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline flex items-center gap-2"
                        >
                            <span>{link.name}</span>
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;