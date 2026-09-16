// 依證據等級排序（高到低），只列出對讀者有意義的研究類型
// 刻意排除 Journal Article、English Abstract 等 PubMed 通用標籤
export const EVIDENCE_TYPE_PRIORITY = [
  'Systematic Review',
  'Meta-Analysis',
  'Randomized Controlled Trial',
  'Multicenter Study',
  'Clinical Trial',
  'Comparative Study',
  'Observational Study',
  'Case Reports',
  'Review',
] as const

export type EvidenceType = typeof EVIDENCE_TYPE_PRIORITY[number]

export type EvidenceTier = 'high' | 'mid' | 'low'

const EVIDENCE_TIER: Record<EvidenceType, EvidenceTier> = {
  'Systematic Review': 'high',
  'Meta-Analysis': 'high',
  'Randomized Controlled Trial': 'high',
  'Multicenter Study': 'mid',
  'Clinical Trial': 'mid',
  'Comparative Study': 'mid',
  'Observational Study': 'low',
  'Case Reports': 'low',
  'Review': 'low',
}

const EVIDENCE_TYPE_LABEL: Record<EvidenceType, string> = {
  'Systematic Review': 'SYSTEMATIC REVIEW',
  'Meta-Analysis': 'META-ANALYSIS',
  'Randomized Controlled Trial': 'RCT',
  'Multicenter Study': 'MULTICENTER',
  'Clinical Trial': 'CLINICAL TRIAL',
  'Comparative Study': 'COMPARATIVE',
  'Observational Study': 'OBSERVATIONAL',
  'Case Reports': 'CASE REPORT',
  'Review': 'REVIEW',
}

// 從文章的 publication_types 陣列裡，挑出證據等級最高的一個顯示；
// 找不到任何有意義的類型（例如只有 Journal Article）就回傳 null，不顯示徽章
export function getPrimaryEvidenceType(types: string[] | null | undefined): EvidenceType | null {
  if (!types || types.length === 0) return null
  for (const candidate of EVIDENCE_TYPE_PRIORITY) {
    if (types.includes(candidate)) return candidate
  }
  return null
}

export function getEvidenceLabel(type: EvidenceType): string {
  return EVIDENCE_TYPE_LABEL[type]
}

// 刻意用「外框、不填色」而不是實心色塊——避免跟期刊來源徽章（實心螢光綠底）撞色混淆
export function evidenceBadgeStyle(type: EvidenceType): { borderColor: string; color: string } {
  const tier = EVIDENCE_TIER[type]
  if (tier === 'high') return { borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }
  if (tier === 'mid') return { borderColor: 'var(--brand-accent-dark)', color: 'var(--brand-accent-dark)' }
  return { borderColor: 'var(--brand-text-faint)', color: 'var(--brand-text-muted)' }
}
