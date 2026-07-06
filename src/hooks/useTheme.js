import { useEffect, useState } from 'react'

export const THEMES = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
  { id: 'reading', label: 'Reading' },
]

const STORAGE_KEY = 'garageflow-theme'

export function applyTheme(theme) {
  const root = document.documentElement
  root.classList.remove('theme-light', 'theme-reading')
  if (theme !== 'dark') {
    root.classList.add(`theme-${theme}`)
  }
}

export default function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'dark'
  )

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return { theme, setTheme, themes: THEMES }
}
