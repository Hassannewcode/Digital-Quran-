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
        <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-6">Quranic Recitation: Styles & Methods</h2>
        <div className="space-y-4 text-base leading-relaxed">
            <p>The recitation of the Quran is an art and a science, with various styles and methods developed over centuries to preserve its pronunciation and melody. This application uses advanced AI to simulate some of these styles. Understanding them can enrich your listening experience.</p>
        </div>
        
        <div className="mt-8 space-y-6">
            <div>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-zinc-200 mb-2 border-b dark:border-zinc-700 pb-2">Styles Defined by Melody</h4>
                <dl className="space-y-4 mt-4">
                    <div className="pl-4 border-l-4 border-blue-500">
                        <dt className="font-semibold text-md text-slate-800 dark:text-zinc-200">Murattal (Clear & Measured)</dt>
                        <dd className="text-slate-600 dark:text-zinc-400">A clear, measured pace with a steady tone. It emphasizes proper pronunciation (tajweed) and is the most common style for personal recitation, teaching, and memorization.</dd>
                    </div>
                    <div className="pl-4 border-l-4 border-blue-500">
                        <dt className="font-semibold text-md text-slate-800 dark:text-zinc-200">Mujawwad (Melodic & Emotive)</dt>
                        <dd className="text-slate-600 dark:text-zinc-400">A slower, more ornamental style that focuses on the artistic beauty and emotional depth of the recitation. It is often used in formal events and spiritual gatherings.</dd>
                    </div>
                </dl>
            </div>

            <div>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-zinc-200 mb-2 border-b dark:border-zinc-700 pb-2">Styles Defined by Pace</h4>
                <p className="text-sm text-slate-500 dark:text-zinc-500 my-4">Recitation can also be distinguished by its speed, all while maintaining the rules of tajweed.</p>
                <dl className="space-y-4">
                    <div className="pl-4 border-l-4 border-green-500">
                        <dt className="font-semibold text-md text-slate-800 dark:text-zinc-200">Tahqiq (Slow & Meticulous)</dt>
                        <dd className="text-slate-600 dark:text-zinc-400">The slowest, most deliberate pace, ensuring each letter is pronounced perfectly. This style is most often used for teaching and practice.</dd>
                    </div>
                    <div className="pl-4 border-l-4 border-green-500">
                        <dt className="font-semibold text-md text-slate-800 dark:text-zinc-200">Tadwir (Moderate)</dt>
                        <dd className="text-slate-600 dark:text-zinc-400">A measured pace between the slow Tahqiq and fast Hadr, often used in daily prayers for its balance of clarity and flow.</dd>
                    </div>
                </dl>
            </div>
        </div>
      </section>

      <section className="text-slate-700 dark:text-zinc-300">
        <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-6">Our Inspiration & Feature Breakdown</h2>
        <p className="mb-6 leading-relaxed">This application is inspired by the world's best Quranic platforms. Our goal is to blend authoritative text with powerful, modern study tools. The platform's design is guided by the following principles:</p>
        
        <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
                <div className="border rounded-lg shadow dark:border-zinc-700">
                    <div className="grid grid-cols-1 md:grid-cols-4 font-semibold text-left text-sm text-slate-800 dark:text-zinc-200 bg-slate-50 dark:bg-zinc-800/50 rounded-t-lg">
                        <div className="p-4">Functional Area</div>
                        <div className="p-4 border-t md:border-t-0 md:border-l dark:border-zinc-700">Inspiration</div>
                        <div className="p-4 border-t md:border-t-0 md:border-l dark:border-zinc-700">Feature Weight</div>
                        <div className="p-4 border-t md:border-t-0 md:border-l dark:border-zinc-700">Core Value</div>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-zinc-700">
                        {tableData.map((row, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 text-sm">
                                <div className="p-4 font-medium text-slate-900 dark:text-zinc-100">{row.area}</div>
                                <div className="p-4 text-slate-600 dark:text-zinc-400 border-t md:border-t-0 md:border-l dark:border-zinc-700">{row.inspiration}</div>
                                <div className="p-4 text-slate-600 dark:text-zinc-400 border-t md:border-t-0 md:border-l dark:border-zinc-700">{row.weight}</div>
                                <div className="p-4 text-slate-600 dark:text-zinc-400 border-t md:border-t-0 md:border-l dark:border-zinc-700">{row.value}</div>
                            </div>
                        ))}
                    </div>
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