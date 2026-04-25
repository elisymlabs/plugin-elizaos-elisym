import { describe, expect, it } from 'vitest';
import { SLEEP_DETECT_THRESHOLD_MS, detectSleepGap } from '../../src/lib/watchdog';

describe('detectSleepGap', () => {
  it('does not flag a tick fired on schedule', () => {
    const lastTick = 1_000_000;
    const now = lastTick + 5 * 60 * 1000; // 5 minutes (= probe cadence)
    const result = detectSleepGap(lastTick, now);
    expect(result.sleepDetected).toBe(false);
    expect(result.tickedAt).toBe(now);
    expect(result.gapMs).toBe(5 * 60 * 1000);
  });

  it('does not flag a tick at exactly the threshold', () => {
    const lastTick = 1_000_000;
    const now = lastTick + SLEEP_DETECT_THRESHOLD_MS;
    expect(detectSleepGap(lastTick, now).sleepDetected).toBe(false);
  });

  it('flags a tick that fired after a wall-clock gap exceeding the threshold', () => {
    const lastTick = 1_000_000;
    // simulate a 30-minute laptop sleep
    const now = lastTick + 30 * 60 * 1000;
    const result = detectSleepGap(lastTick, now);
    expect(result.sleepDetected).toBe(true);
    expect(result.gapMs).toBe(30 * 60 * 1000);
  });

  it('respects a caller-supplied threshold', () => {
    const lastTick = 0;
    const now = 1_000;
    expect(detectSleepGap(lastTick, now, 999).sleepDetected).toBe(true);
    expect(detectSleepGap(lastTick, now, 1_000).sleepDetected).toBe(false);
  });
});
