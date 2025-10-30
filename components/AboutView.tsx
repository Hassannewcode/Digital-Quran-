import React from 'react';

const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 text-slate-700 dark:text-zinc-300">
      
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
                <div className="font-semibold p-4 bg-slate-50 dark:bg-zinc-800 md:rounded-t-lg">Mujawwad (powerful and melodic)</div>
                <div className="font-semibold p-4 bg-slate-50 dark:bg-zinc-800 rounded-t-lg md:rounded-tr-lg">Murattal (measured and clear)</div>
                
                <div className="font-semibold p-4 md:bg-slate-50 md:dark:bg-zinc-800">Pacing</div>
                <div className="p-4 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x dark:divide-zinc-700">
                    <div className="p-4 md:p-0 md:px-4">Slower and more ornamental, allowing for extensive vocal performance.</div>
                    <div className="p-4 md:p-0 md:px-4">Faster, with a measured and even tone.</div>
                </div>

                <div className="font-semibold p-4 md:bg-slate-50 md:dark:bg-zinc-800">Vocal quality</div>
                 <div className="p-4 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x dark:divide-zinc-700">
                    <div className="p-4 md:p-0 md:px-4">Can vary between relaxed and tense to achieve a dramatic or emotional effect.</div>
                    <div className="p-4 md:p-0 md:px-4">Generally steady and flowing, with little melodic variation.</div>
                </div>

                <div className="font-semibold p-4 md:bg-slate-50 md:dark:bg-zinc-800">Emphasis</div>
                 <div className="p-4 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x dark:divide-zinc-700">
                    <div className="p-4 md:p-0 md:px-4">Focuses on melody and the artistic beauty of the recitation.</div>
                    <div className="p-4 md:p-0 md:px-4">Emphasizes proper pronunciation (tajweed), clarity, and understanding the meaning of the verses.</div>
                </div>

                <div className="font-semibold p-4 rounded-b-lg md:rounded-bl-lg md:rounded-br-none md:bg-slate-50 md:dark:bg-zinc-800">Use case</div>
                 <div className="p-4 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x dark:divide-zinc-700 rounded-b-lg">
                    <div className="p-4 md:p-0 md:px-4">Typically used for formal events, spiritual gatherings, and Qur'an competitions.</div>
                    <div className="p-4 md:p-0 md:px-4">Common for personal recitation, teaching, and memorization.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold">The Importance of Tajweed</h3>
          <p className="leading-relaxed">Both Mujawwad and Murattal are governed by the rules of tajweed, which means "proper articulation". These rules dictate the correct pronunciation, intonation, and rhythm of the Qur'an. The perceived "powerfulness" of a recitation is a result of a reciter's masterful application of tajweed combined with their unique vocal gifts.</p>
        </div>
      </section>

      {/* Section 2: Our Inspiration */}
      <section>
        <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-6">Our Inspiration: An Optimal Digital Quran Platform</h2>
        <p className="mb-6 leading-relaxed">The ultimate platform, blending authority with powerful study tools, would be structured around the following features and their approximate representation:</p>

        <div className="space-y-8">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">1. The Core Text: Authoritative Standard (50%)</h3>
                <p className="mt-2 leading-relaxed">The single most important component is the raw, authoritative Quranic text. This must be sourced directly from or meticulously verified against the official standard to ensure absolute accuracy.</p>
                <p className="mt-4"><span className="font-semibold">Inspiration:</span> King Fahd Complex (for ultimate authority/source text), Tanzil.net (for highly-accurate digital text structure), and KSU-Ayat (for the visual representation of the Madinah Mushaf).</p>
                <p className="mt-2"><span className="font-semibold">Focus:</span> A beautiful, high-resolution rendering of the Madinah Mushaf's Uthmani script that matches the printed version perfectly on all devices. The underlying digital text must be a top-tier, verified data set.</p>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">2. User Experience and Accessibility (25%)</h3>
                <p className="mt-2 leading-relaxed">The platform must be universally accessible, intuitive, and modern, making the authoritative text easy to use for everyone.</p>
                <p className="mt-4"><span className="font-semibold">Inspiration:</span> Quran.com (for clean, intuitive, multi-platform design) and KSU-Ayat (for web and dedicated mobile app presence).</p>
                <p className="mt-2"><span className="font-semibold">Focus:</span> Fast loading, clean interface, powerful search, seamless navigation, and dedicated, highly-rated mobile applications. This includes robust personalization options (font size, themes, dark mode).</p>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">3. Advanced Study & Learning Tools (25%)</h3>
                <p className="mt-2 leading-relaxed">To go beyond a simple reader, the platform needs integrated tools for deep study, recitation, and memorization.</p>
                <ul className="mt-4 space-y-3 list-disc list-inside">
                    <li><span className="font-semibold">Recitation & Memorization (10%):</span> High-quality audio from multiple renowned reciters, customizable looping, and an integrated system for tracking memorization. <br/><em className="text-sm text-slate-500 dark:text-zinc-400">Inspiration: KSU-Ayat, Al-Harmain Maqraa.</em></li>
                    <li><span className="font-semibold">Linguistic & Translational Study (10%):</span> Side-by-side access to multiple top-tier translations and a word-by-word analysis tool. <br/><em className="text-sm text-slate-500 dark:text-zinc-400">Inspiration: Corpus.Quran.com, Quran.com.</em></li>
                    <li><span className="font-semibold">Teaching & Correction (5%):</span> An optional feature for connecting with certified teachers for recitation correction. <br/><em className="text-sm text-slate-500 dark:text-zinc-400">Inspiration: Umm Al-Qura Electronic Maqraah, Al-Harmain Maqraa.</em></li>
                </ul>
            </div>
        </div>
        <p className="mt-8 text-center text-lg font-semibold italic">In short: Build the authoritative text engine of King Fahd/Tanzil, layer on the beautiful visual of KSU-Ayat, wrap it in the user-experience of Quran.com, and integrate the linguistic depth of Corpus.Quran.com.</p>
      </section>

    </div>
  );
};

export default AboutView;
