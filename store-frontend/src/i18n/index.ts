import type { Lang } from '../types/user'
import ja from './ja.json'
import en from './en.json'
import zh from './zh.json'
import ko from './ko.json'
import th from './th.json'

export type Messages = typeof ja

const messages: Record<Lang, Messages> = { ja, en, zh, ko, th }

export function useT(lang: Lang): Messages {
  return messages[lang] ?? ja
}
