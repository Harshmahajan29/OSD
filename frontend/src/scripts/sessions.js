/**
 * "The spellbook": clicking a pumpkin house (or its sign) opens that session's
 * topic panel below the image. Clicking it again, or the ×, closes it.
 */
export function initSessions(root) {
  if (!root) return;
  const triggers = [...root.querySelectorAll('[data-session-trigger]')];
  const panels = [...root.querySelectorAll('[role="region"][id]')];
  const hint = root.querySelector('[data-session-hint]');
  let openId = null;

  function show(id) {
    openId = id;
    panels.forEach((panel) => {
      panel.hidden = panel.id !== id;
    });
    triggers.forEach((t) => {
      t.setAttribute('aria-expanded', String(t.dataset.sessionTrigger === id));
    });
    if (hint) hint.hidden = Boolean(id);
  }

  triggers.forEach((t) => {
    t.addEventListener('click', () => {
      const id = t.dataset.sessionTrigger;
      show(openId === id ? null : id);
    });
  });

  root.querySelectorAll('[data-session-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = openId;
      show(null);
      root.querySelector(`[data-session-trigger="${id}"].sign`)?.focus();
    });
  });

  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openId) show(null);
  });
}
