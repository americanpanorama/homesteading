# Regenerated Office-Level Audit

This report compares regenerated temporary office rows under `/var/folders/x5/mtxs7qx935b81b54ns0yb9_m0000gp/T/homesteads2-trial-j03AG5/build/data/yearData` against regenerated temporary office timeline files under `/var/folders/x5/mtxs7qx935b81b54ns0yb9_m0000gp/T/homesteads2-trial-j03AG5/build/data/timelineData`.

## Summary

- Office-year rows with at least one mismatch: 0

## States With The Most Office-Level Mismatches

| State | Mismatch rows |
| --- | ---: |

## Largest Claim Count Differences

| Year | State | Office | yearData claims | timeline claims | Diff |
| --- | --- | --- | ---: | ---: | ---: |

## Idaho Examples

| Year | Office | yearData claims | timeline claims | yearData acres | timeline acres |
| --- | --- | ---: | ---: | ---: | ---: |

## Oklahoma Examples

| Year | Office | yearData claims | timeline claims | yearData acres | timeline acres |
| --- | --- | ---: | ---: | ---: | ---: |

## Interpretation

- If an office mismatch appears here, the inconsistency already exists before state-level aggregation.
- Idaho is especially important because its mismatch exists in both `public/` and `build/` outputs.
- That strongly suggests the checked-in `build/data/yearData` and `build/data/timelineData` trees were not produced by one consistent run of the same pipeline.
