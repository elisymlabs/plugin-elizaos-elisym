import {
  WATCHDOG_PROBE_INTERVAL_MS,
  WATCHDOG_SELF_PING_INTERVAL_MS,
  WATCHDOG_SLEEP_DETECT_MULTIPLIER,
} from '../constants';

export const SLEEP_DETECT_THRESHOLD_MS =
  Math.min(WATCHDOG_PROBE_INTERVAL_MS, WATCHDOG_SELF_PING_INTERVAL_MS) *
  WATCHDOG_SLEEP_DETECT_MULTIPLIER;

export interface SleepGapResult {
  tickedAt: number;
  gapMs: number;
  sleepDetected: boolean;
}

// Wall-clock gap detection. On macOS sleep / hibernation / container pause both
// `setInterval` callbacks freeze, so the first post-suspend tick sees a gap
// far larger than the configured cadence. The CLI's watchdog uses the same
// algorithm (packages/cli/src/watchdog.ts).
export function detectSleepGap(
  lastTickAt: number,
  now: number,
  thresholdMs: number = SLEEP_DETECT_THRESHOLD_MS,
): SleepGapResult {
  const gap = now - lastTickAt;
  return { tickedAt: now, gapMs: gap, sleepDetected: gap > thresholdMs };
}
