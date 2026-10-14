/**
 * The FAQ uses native <details name="faq">, which browsers already treat as an
 * exclusive accordion. This adds the same behaviour for older browsers.
 */
export function initFaq(root) {
  if (!root) return;
  const items = [...root.querySelectorAll('details')];
  const nativeExclusive = 'name' in HTMLDetailsElement.prototype;
  if (nativeExclusive) return;

  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
}
