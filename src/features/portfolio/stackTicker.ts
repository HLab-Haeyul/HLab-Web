import type { Locale, StackTickerCopy } from './types'

export const stackTickerByLocale: Record<Locale, StackTickerCopy> = {
  ko: {
    kicker: '기술 스택',
    heading: '실무에서 사용하는 도구와 기술',
    viewAllCta: '더보기',
    items: [
      { icon: '🧠', label: 'Malware Analysis' },
      {
        imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
        imageAlt: 'Python',
        label: 'Python',
      },
      { icon: '🔬', label: 'Reverse Engineering' },
      { icon: '🧩', label: 'Ghidra' },
      { icon: '🧰', label: 'IDA Pro' },
      {
        imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
        imageAlt: 'Linux',
        label: 'Linux',
      },
      {
        imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
        imageAlt: 'Docker',
        label: 'Docker',
      },
      { icon: '☁️', label: 'AWS' },
      {
        imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg',
        imageAlt: 'MySQL',
        label: 'MySQL',
      },
      {
        imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
        imageAlt: 'Spring Boot',
        label: 'Spring Boot',
      },
      {
        imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
        imageAlt: 'TypeScript',
        label: 'TypeScript',
      },
      {
        imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
        imageAlt: 'Vue 3',
        label: 'Vue 3',
      },
    ],
  },
  en: {
    kicker: 'Tech Stack',
    heading: 'Tools and technologies I use in production',
    viewAllCta: 'View all',
    items: [
      { icon: '🧠', label: 'Malware Analysis' },
      {
        imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
        imageAlt: 'Python',
        label: 'Python',
      },
      { icon: '🔬', label: 'Reverse Engineering' },
      { icon: '🧩', label: 'Ghidra' },
      { icon: '🧰', label: 'IDA Pro' },
      {
        imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
        imageAlt: 'Linux',
        label: 'Linux',
      },
      {
        imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
        imageAlt: 'Docker',
        label: 'Docker',
      },
      { icon: '☁️', label: 'AWS' },
      {
        imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg',
        imageAlt: 'MySQL',
        label: 'MySQL',
      },
      {
        imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
        imageAlt: 'Spring Boot',
        label: 'Spring Boot',
      },
      {
        imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
        imageAlt: 'TypeScript',
        label: 'TypeScript',
      },
      {
        imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
        imageAlt: 'Vue 3',
        label: 'Vue 3',
      },
    ],
  },
}
