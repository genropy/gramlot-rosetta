# Keep the Rosetta versions aligned

The v1 baseline deliberately has no grid. The repository is a consumer experiment,
not the place to implement missing Genro widgets or a second reactive engine.

For every future revision:

1. Choose one concrete behavior and inspect the existing Genro component first.
   If it is unavailable, record the missing library capability here and keep v1
   unchanged. Consolidate work in its owning repository separately.
2. Update SPEC.md and shared browser contracts with the new expected behavior.
3. Implement the same behavior in each dedicated worktree. Use idiomatic framework
   code, the same backend semantics and the same data. Do not force identical
   internal architecture or compare versions at different feature levels.
4. Integrate all variants, build and run the common checks. A partial result stays
   marked partial; the comparison baseline advances only when parity is restored.
5. Re-run scripts/measure.py and record the change effort, affected files, new
   dependencies and any integration code. Preserve the prior report with its
   specification revision and commit.

## Candidate later revisions, not implemented

- A customer/status filter, after confirming suitable existing input behavior.
- Multiple order lines and an editable grid, only after the real component exists.
- A discount rule to compare how a cross-field behavior changes each application.
- Published standalone Pages installation, replacing local source overrides.
- Richer remote calls/push and lifecycle handling, compared as separate capabilities.

Current measurements must not claim these behaviors or their prospective benefits.
