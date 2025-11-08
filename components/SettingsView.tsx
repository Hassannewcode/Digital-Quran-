import React from 'react';
import { ThemeSetting } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { locales } from '../i18n/locales';

interface SettingsViewProps {
    installPrompt: BeforeInstallPromptEvent | null;
    handleInstall: () => void;
    themeSetting: ThemeSetting;
    setThemeSetting: (theme: ThemeSetting) => void;
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

const OptionButton: React.FC<{
  label: string;
  icon?: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    role="radio"
    aria-checked={isActive}
    className={`flex-1 p-3 rounded-lg transition-colors flex flex-col items-center justify-center gap-2 text-sm font-semibold ${
      isActive
        ? 'bg-blue-600 text-white shadow'
        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300'
    }`}
  >
    {icon && <span className="material-symbols-outlined">{icon}</span>}
    <span>{label}</span>
  </button>
);

const SettingsView: React.FC<SettingsViewProps> = ({ installPrompt, handleInstall, themeSetting, setThemeSetting }) => {
  const { t, lang, setLang } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-12 text-slate-700 dark:text-zinc-300">
      
      <section>
        <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-6">{t('about_this_app')}</h2>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 rtl:border-l-0 rtl:border-r-4 border-yellow-500 rounded-r-lg rtl:rounded-r-none rtl:rounded-l-lg text-yellow-800 dark:text-yellow-300 space-y-2 mb-8">
            <p className="font-semibold">{t('disclaimer_title')}</p>
            <p className="text-sm">{t('disclaimer_ai_warning')}</p>
            <p className="text-sm">{t('disclaimer_purpose')}</p>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-6">{t('appearance')}</h2>
        <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
          <fieldset className="mb-6">
            <legend className="text-sm text-slate-600 dark:text-zinc-400 mb-4">{t('choose_theme_prompt')}</legend>
            <div className="flex gap-2 p-1 bg-slate-200 dark:bg-zinc-800/50 rounded-xl" role="radiogroup">
              <OptionButton label={t('light')} icon="light_mode" isActive={themeSetting === 'light'} onClick={() => setThemeSetting('light')} />
              <OptionButton label={t('dark')} icon="dark_mode" isActive={themeSetting === 'dark'} onClick={() => setThemeSetting('dark')} />
              <OptionButton label={t('system')} icon="desktop_windows" isActive={themeSetting === 'system'} onClick={() => setThemeSetting('system')} />
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm text-slate-600 dark:text-zinc-400 mb-4">{t('choose_language_prompt')}</legend>
            <div className="flex gap-2 p-1 bg-slate-200 dark:bg-zinc-800/50 rounded-xl" role="radiogroup">
              {(Object.keys(locales) as Array<keyof typeof locales>).map((locale) => (
                <OptionButton
                  key={locale}
                  label={locales[locale].title}
                  isActive={lang === locale}
                  onClick={() => setLang(locale)}
                />
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-6">{t('install_app')}</h2>
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800 space-y-4">
          <p className="leading-relaxed text-center">{t('install_prompt_desc')}</p>
          {installPrompt ? (
            <div className="text-center">
              <button
                onClick={handleInstall}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                aria-label={t('install_app_aria')}
              >
                <span className="material-symbols-outlined">download</span>
                <span>{t('install_app')}</span>
              </button>
            </div>
          ) : (
             <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-lg text-center">
                <p>{t('app_installed_or_unsupported')}</p>
              </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-6">{t('recitation_styles_title')}</h2>
        <div className="space-y-4 text-base leading-relaxed">
          <p>{t('recitation_styles_desc')}</p>
        </div>
        
        {/* Mobile-first layout: Stacked cards */}
        <div className="md:hidden mt-8 space-y-6">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
            <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">{t('mujawwad')}</h3>
            <dl className="mt-2 space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-slate-600 dark:text-zinc-400">{t('pacing')}</dt>
                <dd className="text-slate-700 dark:text-zinc-300">{t('mujawwad_pacing')}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-600 dark:text-zinc-400">{t('emphasis')}</dt>
                <dd className="text-slate-700 dark:text-zinc-300">{t('mujawwad_emphasis')}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-600 dark:text-zinc-400">{t('use_case')}</dt>
                <dd className="text-slate-700 dark:text-zinc-300">{t('mujawwad_use_case')}</dd>
              </div>
            </dl>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
            <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">{t('murattal')}</h3>
            <dl className="mt-2 space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-slate-600 dark:text-zinc-400">{t('pacing')}</dt>
                <dd className="text-slate-700 dark:text-zinc-300">{t('murattal_pacing')}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-600 dark:text-zinc-400">{t('emphasis')}</dt>
                <dd className="text-slate-700 dark:text-zinc-300">{t('murattal_emphasis')}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-600 dark:text-zinc-400">{t('use_case')}</dt>
                <dd className="text-slate-700 dark:text-zinc-300">{t('murattal_use_case')}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Desktop layout: Table/Grid */}
        <div className="hidden md:block mt-8 overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="border rounded-lg shadow dark:border-zinc-700 bg-white dark:bg-zinc-900">
              <div className="grid grid-cols-3 divide-x dark:divide-zinc-700">
                <div className="font-semibold p-4 bg-slate-50 dark:bg-zinc-800 rounded-tl-lg">{t('feature')}</div>
                <div className="font-semibold p-4 bg-slate-50 dark:bg-zinc-800">{t('mujawwad')}</div>
                <div className="font-semibold p-4 bg-slate-50 dark:bg-zinc-800 rounded-tr-lg">{t('murattal')}</div>
              </div>
              <div className="grid grid-cols-3 divide-x dark:divide-zinc-700 border-t dark:border-zinc-700">
                <div className="font-semibold p-4">{t('pacing')}</div>
                <div className="p-4">{t('mujawwad_pacing')}</div>
                <div className="p-4">{t('murattal_pacing')}</div>
              </div>
              <div className="grid grid-cols-3 divide-x dark:divide-zinc-700 border-t dark:border-zinc-700">
                <div className="font-semibold p-4">{t('emphasis')}</div>
                <div className="p-4">{t('mujawwad_emphasis')}</div>
                <div className="p-4">{t('murattal_emphasis')}</div>
              </div>
              <div className="grid grid-cols-3 divide-x dark:divide-zinc-700 border-t dark:border-zinc-700">
                <div className="font-semibold p-4 rounded-bl-lg">{t('use_case')}</div>
                <div className="p-4">{t('mujawwad_use_case')}</div>
                <div className="p-4 rounded-br-lg">{t('murattal_use_case')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

       <section>
        <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-6">{t('inspiration_title')}</h2>
        <p className="mb-6 leading-relaxed">{t('inspiration_desc')}</p>

        <div className="space-y-8">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{t('inspiration_core_text_title')}</h3>
                <p className="mt-2 leading-relaxed">{t('inspiration_core_text_desc')}</p>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{t('inspiration_core_experience_title')}</h3>
                <p className="mt-2 leading-relaxed">{t('inspiration_core_experience_desc')}</p>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{t('inspiration_advanced_tools_title')}</h3>
                 <ul className="mt-4 space-y-3 list-disc list-inside">
                    <li><span className="font-semibold">{t('inspiration_recitation_title')}</span> {t('inspiration_recitation_desc')}</li>
                    <li><span className="font-semibold">{t('inspiration_linguistic_title')}</span> {t('inspiration_linguistic_desc')}</li>
                </ul>
            </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-6">{t('sources_acknowledgements')}</h2>
        <p className="mb-6 leading-relaxed">{t('sources_desc')}</p>
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
            <ul className="space-y-3">
                {inspirationLinks.map(link => (
                    <li key={link.name}>
                        <a 
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-2"
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