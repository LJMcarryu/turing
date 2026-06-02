import type {MotionState} from '#shared/motion';
import {  readMotion } from '#shared/motion'

// 客户端动效能力判定：服务端安全返回不允许（避免 SSR 触碰 window）。
export function useMotionAllowed(): MotionState {
  if (import.meta.server)
    return { finePointer: false, reducedMotion: false, allowed: false }
  return readMotion(q => window.matchMedia(q))
}
