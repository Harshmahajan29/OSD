/** Capability checks used to decide which effects to run. */

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Rough low-end detection: few CPU cores, little memory, or data-saver on. */
export function isLowPowerDevice() {
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const saveData = navigator.connection && navigator.connection.saveData;
  return cores <= 2 || memory <= 2 || Boolean(saveData);
}
