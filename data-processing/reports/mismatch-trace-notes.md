# Mismatch Trace Notes

These notes summarize a few targeted investigations performed after the broad
published-data audits. They are intended to identify where the inconsistency
appears to enter the pipeline.

## Idaho: Boise / Boise City

This is the clearest case of office-level data loss.

Observed facts:

1. `data-processing/data-input/townships_data.json` contains:
   - `Boise City, ID`
   - `year: 1868`
   - `claims_num: 43`
   - `claims_ac: 6187.67`
2. `public/data/timelineData/ID.json` contains:
   - `Boise`
   - `year: 1868`
   - `claims: 43`
   - `acres_claimed: 6187.67`
3. `public/data/yearData/1868.json` contains:
   - `Boise City`
   - the correct geometry and `tile_id`
   - but `claims: 0`
   - and `acres_claimed: 0`
4. `build/data/yearData/1868.json` matches the published `yearData` result:
   - geometry present
   - values zero
5. `build/data/timelineData/ID.json` matches the published timeline result:
   - `Boise`
   - `claims: 43`

Interpretation:

- The mismatch already exists inside the checked-in `build/` outputs.
- That means this is not just a bad publish/copy step from `build/` to `public/`.
- It strongly suggests the checked-in `build/data/yearData` and
  `build/data/timelineData` trees did not come from one coherent run of the
  same pipeline state.

## Oklahoma: El Reno / Oklahoma City / Perry

Oklahoma looks different from Idaho. It appears less like simple zeroing of one
office's values and more like a mismatch in how offices are mapped into
`yearData`.

Observed facts for 1902:

1. `data-processing/data-input/townships_data.json` contains:
   - `El Reno, OK` with `claims_num: 9078`
   - `Oklahoma City, OK` with `claims_num: 1564`
   - `Perry, OK` with `claims_num: 65`
2. `public/data/timelineData/OK.json` contains the same offices and values:
   - `El Reno`: `9078`
   - `Oklahoma City`: `1564`
   - `Perry`: `65`
3. `public/data/yearData/1902.json` contains:
   - `El Reno ` geometry row with `claims: 0`
   - `Oklahoma` geometry row with `claims: 0`
   - no populated `Perry` row
4. `public/data/yearData/1902.json` does contain large nonzero Oklahoma rows for:
   - `Lawton`
   - `Woodward`
   - `Kingfisher`
   - `Mangum`
   - `Alva`
5. The raw `townships_data` row for `El Reno, OK` is unusual:
   - `land_office` is blank
   - `of_id` is `0`

Interpretation:

- Oklahoma does not look like a pure source-data problem.
- The raw table and the timeline agree on the missing offices.
- The loss appears to happen in the `yearData` generation/mapping stage.
- `El Reno` may be a special case because its raw row is missing the normal
  `land_office`/`of_id` values, but that alone does not explain why `Perry` and
  `Oklahoma City` are also absent or zeroed in the published `yearData`.

## Practical Conclusion

There appear to be at least two failure modes:

1. Idaho-style value loss on an office whose geometry is still present
2. Oklahoma-style office mapping/dropout where raw data and timeline agree, but
   published `yearData` does not

## Strong Hypothesis About The Generation Path

During this trace, the current top-level script
`data-processing/scripts/createYearGeojsonFilesWithClashes.ts` was compared with
the older duplicate at:

- `data-processing/scripts/scripts/createYearGeojsonFilesWithClashes.ts`

The legacy duplicate uses a much stricter matching rule:

- it looks up office rows by exact `land_office`
- it compares that directly to the geometry-derived office stub

That older logic would naturally fail cases such as:

- `Boise, ID` data row vs `Boise City` geometry
- `El Reno, OK` rows where `land_office` is blank
- `Oklahoma City, OK` rows paired with `Oklahoma` geometry stubs

By contrast, the current top-level script uses helper functions that are more
forgiving:

- `getDataForYearFromTileID(...)`
- `getTownshipFeaturesForOffice(...)`
- office-name exception mappings such as `Boise City -> Boise`

Manual tracing shows that with the current raw inputs and current top-level
helper logic:

- `Boise, ID` can match `Boise City` geometry
- `El Reno, OK` can match `El Reno` geometry
- `Oklahoma City, OK` can match `Oklahoma` geometry
- `Perry, OK` can match `Perry` geometry

That means the checked-in published `yearData` files are unlikely to have been
produced by the current top-level generator script in its present form.

The strongest working hypothesis is:

- the checked-in `yearData` was produced by an older generation path closer to
  the legacy duplicate script
- the checked-in `timelineData` was produced by a different or later path
- the two checked-in output trees were then committed together even though they
  were not internally consistent

That means the next repair step should focus on reconstructing and rerunning one
coherent `yearData` generation path, rather than trying to patch the app around
the published files one state at a time.

## Follow-up Trial Regeneration

A later safe trial run of the current top-level scripts was performed with:

```bash
node data-processing/scripts/diagnostics/runTrialRegeneration.mjs 1868,1902
```

That run generated corrected temporary outputs for the two traced cases:

- Idaho 1868 regenerated with `Boise` `claims: 43`
- Oklahoma 1902 regenerated with populated `El Reno`, `Oklahoma City`, and `Perry`

That moves the conclusion from "strong code-reading hypothesis" to "confirmed by
safe temporary regeneration":

- the current top-level generator is capable of producing corrected values for
  these mismatch cases
- the checked-in published `yearData` files are very unlikely to have come from
  the current top-level generator in its present form

See also:

- [`trial-regeneration-report.md`](./trial-regeneration-report.md)
