import { localeNames } from '../api.ts'

const flags: Record<string, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  de: '🇩🇪',
  es: '🇪🇸',
  it: '🇮🇹',
  pt: '🇵🇹',
  ru: '🇷🇺',
  zh: '🇨🇳',
  ja: '🇯🇵',
  ko: '🇰🇷',
  ar: '🇸🇦',
  hi: '🇮🇳',
  tr: '🇹🇷',
  id: '🇮🇩',
  vi: '🇻🇳',
}
function languageLabel(language: string) {
  return `${flags[language] ?? '🌐'} ${localeNames[language] ?? language}`
}
export const languageOptions: [string, string][] = Object.keys(localeNames).map(language => [
  language,
  languageLabel(language),
])
export function LanguageName({ language }: { language: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true">{flags[language] ?? '🌐'}</span>
      <span>{localeNames[language] ?? language}</span>
    </span>
  )
}
