import type { Locale, StackTickerCopy } from './types'

export const stackTickerByLocale: Record<Locale, StackTickerCopy> = {
  ko: {
    kicker: '기술 스택',
    heading: '실무에서 사용하는 도구와 기술',
    items: [
      { icon: '🧠', label: 'Malware Analysis' },
      { icon: '🐍', label: 'Python' },
      { icon: '🔬', label: 'Reverse Engineering' },
      { icon: '🧩', label: 'Ghidra' },
      { icon: '🧰', label: 'IDA Pro' },
      { icon: '🐧', label: 'Linux' },
      { icon: '🧱', label: 'Docker' },
      { icon: '☁️', label: 'AWS' },
      { icon: '🗄️', label: 'MySQL' },
      { icon: '⚙️', label: 'Spring Boot' },
      { icon: '📦', label: 'TypeScript' },
      { icon: '🖥️', label: 'Vue 3' },
    ],
  },
  en: {
    kicker: 'Tech Stack',
    heading: 'Tools and technologies I use in production',
    items: [
      { icon: '🧠', label: 'Malware Analysis' },
      { icon: '🐍', label: 'Python' },
      { icon: '🔬', label: 'Reverse Engineering' },
      { icon: '🧩', label: 'Ghidra' },
      { icon: '🧰', label: 'IDA Pro' },
      { icon: '🐧', label: 'Linux' },
      { icon: '🧱', label: 'Docker' },
      { icon: '☁️', label: 'AWS' },
      { icon: '🗄️', label: 'MySQL' },
      { icon: '⚙️', label: 'Spring Boot' },
      { icon: '📦', label: 'TypeScript' },
      { icon: '🖥️', label: 'Vue 3' },
    ],
  },
}
