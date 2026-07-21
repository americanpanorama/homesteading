# Published Data Audit

This report compares the checked-in published files under `public/data/yearData` against the checked-in published state timeline files under `public/data/timelineData/national.json`.

It is intended to show where the published outputs disagree, not to decide
which side is historically correct.

## Summary

- State-year rows with at least one mismatch: 0
- Rows with claims mismatch: 0
- Rows with acres claimed mismatch: 0
- Rows with patents mismatch: 0
- Rows with acres patented mismatch: 0

## States With The Most Mismatches

| State | Mismatch rows |
| --- | ---: |

## Largest Claim Count Differences

| Year | State | Name | yearData claims | timeline claims | Diff |
| --- | --- | --- | ---: | ---: | ---: |

## Largest Acres Claimed Differences

| Year | State | Name | yearData acres | timeline acres | Diff |
| --- | --- | --- | ---: | ---: | ---: |

## Notes

- This audit only compares state-level aggregates against `national.json`.
- It does not yet compare office-level timeline files against district/year files.
- A zero on one side does not prove that side is wrong. In several cases, the
  discrepancy appears to come from data being dropped between generation stages.
