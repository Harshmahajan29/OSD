import { hasFinePointer } from './device.js';

/**
 * Writes the pointer position into --mx / --my on the hero (range -0.5 … 0.5).
 * CSS uses them for the cat tilt, title tilt and depth layers, so the browser
 * does all the animating. Updates are batched to one per frame.
 * The latest position is also shared with the fog shader through heroPointer.
 */

/** Pointer position over the hero, 0..1 from the top-left. Read by fog.js. */
export const heroPointer = { x: 0.7, y: 0.45 };

export function initHeroParallax(hero) {
  if (!hero || !hasFinePointer()) return;

  let frame = 0;
  let next = null;

  function apply() {
    frame = 0;
    if (!next) return;
    hero.style.setProperty('--mx', (next.x - 0.5).toFixed(3));
    hero.style.setProperty('--my', (next.y - 0.5).toFixed(3));
    heroPointer.x = next.x;
    heroPointer.y = next.y;
  }

  hero.addEventListener(
    'pointermove',
    (e) => {
      const r = hero.getBoundingClientRect();
      next = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
      if (!frame) frame = requestAnimationFrame(apply);
    },
    { passive: true },
  );

  hero.addEventListener('pointerleave', () => {
    next = null;
    hero.style.setProperty('--mx', '0');
    hero.style.setProperty('--my', '0');
    heroPointer.x = 0.7;
    heroPointer.y = 0.45;
  });
}
