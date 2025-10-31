
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
    // Fix: Add missing properties required by SettingsPanel.
    pitch: number;
    onPitchChange: (pitch: number) => void;
    speed: number;
    onSpeedChange: (speed: number) => void;
}

const inspirationLinks = [
    { name: 'KSU-Electronic Moshaf project (Ayat)', url: 'https://quran.ksu.edu.sa' },
    { name: 'King Fahd Complex for the Printing of the Holy Quran', url: 'https://qurancomplex.gov.sa' },
    { name: 'Umm Al-Qura University Electronic Maqraah', url: 'https://uqu.edu.sa/en/coldawa/MaqraaUmmAlQura' },
    { name: 'Al-Harmain Maqraa', url: 'https://maqraa.prh.gov.sa' },
    { name: 'Quran.com', url: 'https://quran.com' },
    { name: 'Tanzil.net', url: 'https://tanzil.net' },
    { name: 'Corpus.Quran.com (The Quranic Arabic Corpus)', url: 'https://corpus.quran.com' },
];

const SettingsView: React.FC<SettingsViewProps> = (props) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 text-slate-700 dark:text-zinc-300">
      <SettingsPanel {...props} />

      {/* Section 1: Recitation Styles */}
      <section>
        <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-6">Recitation Styles: Mujawwad vs. Murattal</h2>
        <div className="space-y-4 text-base leading-relaxed">
          <p>The Holy Quran can be recited in several styles, each with its own unique characteristics and purpose. Two of the most prominent styles are Mujawwad and Murattal. Understanding their differences can enrich your listening experience.</p>
        </div>
        
        <div className="mt-8 overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="border rounded-lg shadow dark:border-zinc-700 bg-white dark:bg-zinc-900">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-zinc-700">
                <div className="font-semibold p-4 bg-slate-50 dark:bg-zinc-800 rounded-t-lg md:rounded-tr-none md:rounded-l-lg">Feature</div>
                <div className="font-semibold p-4 bg-slate-50 dark:bg-zinc-800">Mujawwad (Melodic)</div>
                <div className="font-semibold p-4 bg-slate-50 dark:bg-zinc-800 rounded-t-lg md:rounded-tr-lg">Murattal (Measured)</div>
                
                <div className="font-semibold p-4 md:bg-slate-50 md:dark:bg-zinc-800">Pacing</div>
                 <div className="p-4 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x dark:divide-zinc-700">
                    <div className="p-4 md:p-0 md:px-4">Slower and more ornamental, allowing for extensive vocal performance.</div>
                    <div className="p-4 md:p-0 md:px-4">Faster, with a measured and even tone.</div>
                </div>

                <div className="font-semibold p-4 md:bg-slate-50 md:dark:bg-zinc-800">Emphasis</div>
                 <div className="p-4 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x dark:divide-zinc-700">
                    <div className="p-4 md:p-0 md:px-4">Focuses on melody and the artistic beauty of the recitation.</div>
                    <div className="p-4 md:p-0 md:px-4">Emphasizes proper pronunciation (tajweed), clarity, and understanding.</div>
                </div>

                <div className="font-semibold p-4 rounded-b-lg md:rounded-bl-lg md:rounded-br-none md:bg-slate-50 md:dark:bg-zinc-800">Use Case</div>
                 <div className="p-4 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x dark:divide-zinc-700 rounded-b-lg">
                    <div className="p-4 md:p-0 md:px-4">Typically used for formal events and spiritual gatherings.</div>
                    <div className="p-4 md:p-0 md:px-4">Common for personal recitation, teaching, and memorization.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

       <section>
        <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-6">Our Inspiration &amp; Feature Breakdown</h2>
        <p className="mb-6 leading-relaxed">This application is inspired by the world's best Quranic platforms. Our goal is to blend authoritative text with powerful, modern study tools. The platform's design is guided by the following principles:</p>

        <div className="space-y-8">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">1. Core Textual Integrity (100% of Data)</h3>
                <p className="mt-2 leading-relaxed">The single most important component is the raw, authoritative Quranic text, sourced from highly-verified digital text projects like Tanzil.net.</p>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">2. Core Experience & Interface (50% of Features)</h3>
                <p className="mt-2 leading-relaxed">The platform must be universally accessible, intuitive, and modern, making the authoritative text easy to use for everyone.</p>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">3. Advanced Study & Learning Tools (50% of Features)</h3>
                 <ul className="mt-4 space-y-3 list-disc list-inside">
                    <li><span className="font-semibold">Recitation & Memorization (20%):</span> High-quality audio from multiple renowned reciters, customizable looping, and an integrated system for tracking memorization.</li>
                    <li><span className="font-semibold">Linguistic & Translational Study (30%):</span> Side-by-side access to multiple top-tier translations and word-by-word analysis tools.</li>
                </ul>
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
