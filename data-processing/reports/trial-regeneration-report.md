# Trial Regeneration Report

This report summarizes a safe trial run of the current top-level data
generation scripts into a temporary output directory.

The goal was to answer a narrow question:

- does the current top-level pipeline reproduce the bad checked-in `yearData`
- or does it generate corrected values for the known mismatch cases

The trial was intentionally limited to:

- `1868`
- `1902`

Those years cover the two traced mismatch families:

- Idaho / Boise in 1868
- Oklahoma / El Reno / Oklahoma City / Perry in 1902

## Command

The trial was run with:

```bash
node data-processing/scripts/diagnostics/runTrialRegeneration.mjs 1868,1902
```

The wrapper:

- compiles the current TypeScript generators into a temporary run root
- reuses the workspace dependency trees
- writes outputs into a temporary `build/data` and `public/data`
- does not modify checked-in app data

## Trial Output Root

Example run root from the audited trial:

```text
/var/folders/x5/mtxs7qx935b81b54ns0yb9_m0000gp/T/homesteads2-trial-jzYhiG
```

That exact path is ephemeral and should not be treated as permanent.

## Result

The current top-level pipeline generated the corrected office values for the
known mismatch cases.

## Idaho 1868

Regenerated `build/data/yearData/1868.json` contains an Idaho office row for
`Boise` with:

- `claims: 43`
- `acres_claimed: 6187.67`

Regenerated `build/data/timelineData/ID.json` also contains:

- `Boise`
- `1868`
- `claims: 43`
- `acres_claimed: 6187.67`

This is the behavior we wanted.

It differs from the checked-in published `yearData`, where the Boise City
geometry row is present but the values are zeroed.

## Oklahoma 1902

Regenerated `build/data/yearData/1902.json` contains populated office rows for:

- `El Reno` with `claims: 9078`
- `Oklahoma City` with `claims: 1564`
- `Perry` with `claims: 65`

It also still contains a zero-valued `Oklahoma` row, which appears to be the
special geometry stub, but the actual office rows are now present and
populated.

Regenerated `build/data/timelineData/OK.json` also contains the expected
matching entries for:

- `El Reno`
- `Oklahoma City`
- `Perry`

This differs from the checked-in published `yearData`, where:

- `El Reno` was present with zero values
- `Oklahoma` was present with zero values
- `Perry` was not represented as a populated row

## Conclusion

This trial strongly supports the following conclusion:

- the current top-level generator scripts can produce corrected Idaho and
  Oklahoma outputs
- the checked-in `yearData` files were likely produced by an older or different
  generation path
- the checked-in `timelineData` and `yearData` trees should not be assumed to
  come from one coherent run

This is stronger evidence than the earlier code-reading hypothesis because it
comes from an actual safe regeneration run.

## Recommended Next Step

The next sensible step is to regenerate a broader year range into a temporary
output tree and compare it against the checked-in published files before
replacing anything.

That comparison should focus on:

- how many of the `201` state-year mismatches disappear
- how many of the `193` office-year mismatches disappear
- whether any new regressions appear in the regenerated outputs
