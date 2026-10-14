/** Live countdown to the event start; switches to a "gates are open" message when it hits zero. */
export function initCountdown(root, startsAt) {
  if (!root) return;
  const target = Date.parse(startsAt);
  if (Number.isNaN(target)) return;

  const units = {
    days: root.querySelector('[data-unit="days"]'),
    hours: root.querySelector('[data-unit="hours"]'),
    minutes: root.querySelector('[data-unit="minutes"]'),
    seconds: root.querySelector('[data-unit="seconds"]'),
  };
  const live = root.querySelector('[data-countdown-live]');
  const pad = (n) => String(n).padStart(2, '0');
  let timer = 0;

  function tick() {
    const diff = Math.max(0, target - Date.now());
    if (diff === 0) {
      root.dataset.live = '';
      if (live) live.hidden = false;
      clearInterval(timer);
      return;
    }
    units.days.textContent = pad(Math.floor(diff / 86_400_000));
    units.hours.textContent = pad(Math.floor(diff / 3_600_000) % 24);
    units.minutes.textContent = pad(Math.floor(diff / 60_000) % 60);
    units.seconds.textContent = pad(Math.floor(diff / 1000) % 60);
  }

  tick();
  timer = setInterval(tick, 1000);
}
