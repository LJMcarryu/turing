// 动效能力判定的纯核：根据 matchMedia 读数算出是否允许高级动效。
// 唯一来源，被 lenis 插件、首页 arc、TheReel、TheCursor、useScrollReveal 共用。
export interface MotionState {
  finePointer: boolean
  reducedMotion: boolean
  allowed: boolean
}

export function readMotion(matchMedia: (q: string) => { matches: boolean }): MotionState {
  const finePointer = matchMedia('(pointer: fine)').matches
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  return { finePointer, reducedMotion, allowed: finePointer && !reducedMotion }
}
