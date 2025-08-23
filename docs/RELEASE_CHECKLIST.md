# Release Checklist: Countdown Rollover Update

This checklist ensures a safe rollout of the new countdown rollover behavior.

## Pre‑Release

- [ ] On branch `feature/countdown-rollover-backend-only-after-deadline`
- [ ] All tests performed per `TESTING.md`
- [ ] Stress scenarios validated with `countdown-stress.html`
- [ ] No console errors (missing assets, etc.) on `index.html` and `winners.html`
- [ ] Verify post‑deadline polling only hits `data/next_deadline.json`
- [ ] Confirm rollover works after updating backend JSON locally

## Backup & Safety

- [ ] Create/update backup tag on `main` (if needed):
  ```bash
  git checkout main
  git pull
  git tag pre-countdown-rollover-$(date +%Y%m%d-%H%M%S)
  git push --tags
  ```

## Merge

- [ ] Open PR from feature branch → main
- [ ] PR description includes summary of changes and test plan
- [ ] Squash merge after approval

## Post‑Deploy Validation

- [ ] Load production `index.html` with `?test=true` to view QA/test badges
- [ ] Confirm countdown state reflects reality (countdown vs LIVE)
- [ ] After real backend JSON updates post-deadline, confirm rollover to next GW occurs
- [ ] No network errors; polling interval reasonable

## Rollback Plan

- If needed, revert to backup tag:
  ```bash
  git checkout main
  git reset --hard <backup_tag>
  git push --force
  ```

## Notes

- Backend JSON is the single source of truth for next GW post‑deadline.
- Proxies are not used during the post‑deadline window to avoid premature switchovers.
