export type Role = 'admin' | 'user' | 'viewer'
export type Lang = 'ja' | 'en' | 'zh' | 'ko' | 'th'

export interface UserGroup {
  dept: string
  deptEn: string
  role: Role
  icon: string
}

export interface CurrentUser {
  id: string
  name: string
  nameEn: string
  groups: UserGroup[]
}
