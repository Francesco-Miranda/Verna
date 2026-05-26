import it from '../locales/it.json'
import en from '../locales/en.json'

const locales: Record<string, any> = { it, en }
const currentLocale = ref('it')

if (typeof window !== 'undefined') {
  const savedLocale = localStorage.getItem('verna_locale')
  if (savedLocale && locales[savedLocale]) {
    currentLocale.value = savedLocale
  }
}

export const useI18n = () => {
  const setLocale = (newLocale: string) => {
    if (locales[newLocale]) {
      currentLocale.value = newLocale
      if (typeof window !== 'undefined') {
        localStorage.setItem('verna_locale', newLocale)
      }
    }
  }

  const t = (key: string, params: Record<string, string | number | undefined | null> = {}) => {
    let text = locales[currentLocale.value]?.[key] || locales['it']?.[key] || key
    for (const [pKey, pVal] of Object.entries(params)) {
      const valStr = pVal !== undefined && pVal !== null ? pVal.toString() : ''
      text = text.replaceAll(`{${pKey}}`, valStr)
    }
    return text
  }

  return {
    locale: currentLocale,
    setLocale,
    t,
    availableLocales: ['it', 'en']
  }
}
