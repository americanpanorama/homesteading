# Data Processing Overview

This directory is the project's working area for historical data preparation.
It is not a single clean pipeline. It mixes:

- current-ish scripts that still appear to generate app data
- older copies of those scripts
- one-off cleanup utilities
- experimental directories for tiling, hexbins, and trial runs

This README is meant to document what appears to matter now, based on an audit of the files that are currently checked in.

## Short Version

If you want to understand the app data, start here:

1. [`scripts/README.md`](./scripts/README.md) for the core app data pipeline
2. [`svgs/README.md`](./svgs/README.md) for static SVG and spatial asset generation

The most important scripts appear to be:

1. `scripts/createYearGeojsonFilesWithClashes.ts`
2. `scripts/makeStateTimelineData.ts`
3. `scripts/createYearRangeForPlaces.ts`
4. `scripts/buildPlacesDateRanges.mjs`
5. `scripts/publishBuildData.mjs`
6. `svgs/scripts/createReservationsDissolvdSVGs.js`

## Directory Guide

- `data-input/`: source tables, source geometry, and intermediate inputs
- `scripts/`: TypeScript/JavaScript scripts that generate app-facing data
- `svgs/`: scripts that project geometry into SVG path data or year-based Indian lands data
- `reports/`: generated audit output and other derived review artifacts
- `tiling/`: raster/tile workflow for historical map tiles; looks separate from the main app data flow
- `hexbins/`: hexbin experiments/outputs
- `detritus/`, `trials/`: likely exploratory or archival work

## Outputs That Matter To The App

These are the main outputs the current app reads:

- `public/data/yearData/*.json`
- `public/data/timelineData/*.json`
- `public/data/indianLandsYearData/*.json`
- `public/data/districtsData/*.json`
- `data/placesDateRanges.json`
- `data/states.json`
- `data/northAmerica.json`

One important complication: not every script writes directly to the final app location. Some write to `build/data/...`, and the publish/copy step into `public/data/...` is not fully documented in the repo.

## What The Pipeline Seems To Be

At a high level, the pipeline appears to be:

1. Maintain or patch tabular homesteading input data in `data-input/townships_data.json`
2. Combine tabular data, township geometry, GLO/full-state geometry, and clashes into year-based outputs
3. Aggregate those yearly outputs into state and office timeline files
4. Rebuild the place-range lookup file for routing and UI availability
5. Build Indian lands year files
6. Generate static SVG assets such as states and basemap paths
7. Publish build outputs into the flattened `public/data` shape the app reads

That is the conceptual flow, but the checked-in scripts and checked-in outputs no longer line up perfectly.

## Important Audit Findings

These are the issues worth knowing before trying to regenerate data.

### 1. Generated and published `yearData` use different intentional shapes

The TypeScript generator scripts still work with a nested `ProjectedTownship` shape:

- `office_boundaries: [...]`
- `data: [...]`

But the checked-in files under `public/data/yearData/*.json` are flattened in the current app:

- top-level `bounds`
- top-level `tile_id`
- top-level `claims`, `acres_claimed`, etc.

This is intentional. `scripts/publishBuildData.mjs` selects the June 30 boundary and map-adjusted metrics from the nested build output, then writes the flattened application format.

### 2. Timeline publishing is under-documented

`scripts/makeStateTimelineData.ts` writes to:

- `build/data/timelineData/<STATE>.json`
- `build/data/timelineData/national.json`

During this audit, no script was found that clearly copies those outputs into:

- `public/data/timelineData/...`

Yet the app reads from `public/data/timelineData`.

That gap is now covered by `scripts/publishBuildData.mjs`, which copies
generated timeline outputs into `public/data/timelineData` and also keeps the
legacy `public/timelineData` mirror in sync for compatibility.

### 3. There are duplicate timeline data trees

The repo contains both:

- `public/data/timelineData`
- `public/timelineData`

Historically they were not identical. They disagreed on important values,
including Idaho in 1868.

For the current app, `public/data/timelineData` should be treated as the
canonical checked-in timeline data tree. `public/timelineData` is now a synced
legacy mirror and should not be edited independently.

### 4. `functions.ts` previously contained a hard-coded absolute path

During the 2026 audit/documentation pass, `data-processing/functions.ts` was
updated to resolve its own directory dynamically.

That removes one obvious blocker to rerunning the helper code from this repo
location.

### 5. State-year activity is conserved across the two published views

As part of this audit, `public/data/yearData` totals were compared against `public/data/timelineData/national.json`.

The pipeline now preserves two intentional views:

- raw reported-office totals in timeline data
- June 30 district allocations in map data

Office-level values can differ during transition years, but their state-year totals must agree. The generator now fails if a closed office cannot be allocated or if any state-year metric is lost or duplicated. The published data test enforces the same invariant after publication; the current state-level audit reports zero mismatches.

The generated report lives at:

- [`reports/published-data-audit.md`](./reports/published-data-audit.md)
- [`reports/published-office-audit.md`](./reports/published-office-audit.md)
- [`reports/mismatch-trace-notes.md`](./reports/mismatch-trace-notes.md)
- [`reports/trial-regeneration-report.md`](./reports/trial-regeneration-report.md)

### 6. There are clearly legacy copies of scripts

The following look like older duplicates and should not be treated as canonical without verification:

- `scripts/scripts/...`
- `scripts/createYearGeojsonFilesWithClashes (original).ts`

See the historical investigation notes for context on why these copies were retained:

- [`reports/mismatch-trace-notes.md`](./reports/mismatch-trace-notes.md)
- [`reports/trial-regeneration-report.md`](./reports/trial-regeneration-report.md)

### 7. A safe trial regeneration now exists

During the 2026 documentation pass, a limited trial wrapper was added at:

- `scripts/diagnostics/runTrialRegeneration.mjs`

It runs the current top-level generators into a temporary output tree instead
of overwriting `build/data` or `public/data`.

Use this wrapper for targeted or full-range validation before replacing checked-in outputs. It now also produces allocation and conservation diagnostics in its temporary tree.

### 8. A broader regeneration comparison now exists

A higher-level wrapper was added at:

- `scripts/diagnostics/runRegenerationComparison.mjs`

It:

- runs a safe temporary regeneration
- audits the regenerated `yearData` and `timelineData`
- compares those mismatch counts against the checked-in published outputs

Historical comparison reports predate the current June 30 allocation and publication fixes. For release validation, use the current state-level conservation audit and data tests rather than the historical mismatch counts in those reports.

## Practical Advice Before Regenerating Anything

If we decide to rebuild the data, the safest approach is:

1. rerun the pipeline into a clean temporary output directory
2. confirm that allocation and conservation diagnostics are clean
3. compare regenerated outputs against the checked-in app data
4. publish with `scripts/publishBuildData.mjs`
5. rebuild place ranges and run the full data/browser test suite

## Practical Commands

For the current repo/tooling, these are the most useful repeatable commands:

1. Rebuild the place ranges used by the router:

```bash
npm run build-places-date-ranges
```

2. Audit that the rebuilt ranges still match the canonical timeline data:

```bash
npm run audit-places-date-ranges
```

3. From inside `data-processing/`, the same steps are:

```bash
npm run audit-places-date-ranges
npm run build-places-date-ranges
```

4. After regenerating `public/data/timelineData`, rerun the place-range build and
   then rerun the audit so route validation stays aligned with the canonical timeline data.

## Recorded Manual Data Fixes

These are manual source-data corrections identified during the 2026 audit.

### Carson City, Nevada geometry gap

`data-input/townshipssimplified.json` originally had a Carson City boundary gap
between:

- `1885-01-01`
- `1893-09-10`

That caused `no boundaries for Carson City NV 1886` through `1893` warnings in
trial regeneration runs even though `townships_data.json` had Carson City
activity in those fiscal years.

The fix was:

- extend the earlier Carson City feature with `OBJECTID_1: 507`
- change its `End` from `1884-12-31` to `1893-09-10`
- keep the full-territory Carson City feature with `OBJECTID_1: 512`
- with `Start` at `1893-09-11`

That removed the boundary warnings in the full `1863-1912` regeneration sweep.

Related tiling assets were also renamed to keep the Carson City date ranges in
sync:

- `NV-CarsonCity-18730701-18930910`
- `NV-CarsonCity-18930911-19000630`
