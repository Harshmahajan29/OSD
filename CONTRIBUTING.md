# Contributing

1. **Branch from `main`**: `feat/short-description`, `fix/short-description` or `content/short-description`.
2. **Keep PRs small**: one feature or fix per PR.
3. **Commit messages**: imperative and specific, e.g. `Add tombstone icons to footer`, `Fix countdown on Safari`.
4. **Before opening a PR**, from `frontend/` run:
   ```bash
   npm run lint && npm run format:check && npm run build
   ```
5. **Visual changes** need before/after screenshots on desktop **and** a phone-sized screen.
6. **At least one review** before merging. Squash-merge into `main`.

## Code style

- HTML: semantic elements first (`section`, `nav`, `button`, `details`); hooks for JavaScript use `data-*` attributes, not classes.
- CSS: BEM-style class names (`block__element--modifier`); colours and fonts come from `tokens.css` variables, never hard-coded in section files.
- JS: one feature per module, each exporting an `initX(root)` function that does nothing if its markup is missing.
