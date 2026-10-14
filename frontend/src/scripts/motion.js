/**
 * Adds .is-offscreen to sections outside the viewport so their looping CSS
 * animations pause. Keeps the GPU idle for content nobody can see.
 */
export function initOffscreenPause(sections) {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-offscreen', !entry.isIntersecting);
      });
    },
    { rootMargin: '100px 0px' },
  );
  sections.forEach((section) => observer.observe(section));
}
