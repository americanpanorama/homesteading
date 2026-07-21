# SVG And Spatial Asset Generation

This directory contains scripts that project GeoJSON into SVG path data and related static assets.

Some of these assets are still used by the app. Others appear to be legacy or were used to build intermediate JSON files that are no longer consumed directly.

## Main Categories

There are two broad kinds of scripts here:

1. scripts that print JSON/SVG-friendly path data to stdout
2. scripts that write year-based outputs to disk

## Current Relevance

The scripts that still look most important are:

1. `createStatesSVGs.js`
2. `createNorthAmericaBackgroundSVG.js`
3. `createReservationsDissolvdSVGs.js`

The scripts that look more legacy or optional are:

- `createGLOs.js`
- `createReservationsSVGs.js`
- `createTownshipSVGs.js`
- `createIndianCountry.js`
- `createOpenReservations.js`
- `createSliverSVGs.js`

## Inputs

Common inputs in `../data-input/` include:

- `homestead_states.json`
- `North_America_Great_Lakes.json`
- `Reservation_Year/*.geojson`
- `reservationSimplified.json`
- `open_reservations_full.json`
- `townships.json`
- `join_table.json`
- state-specific township meshes such as `IL_townships_mesh.json`

## Script Notes

### `createStatesSVGs.js`

Reads:

- `../../data-input/homestead_states.json`

Prints to stdout:

- projected state/territory SVG path data
- label coordinates
- label rotations
- bounds

This appears to be the source for the static states asset stored in:

- `data/states.json`

The script does not write that file directly. It prints JSON, so the original workflow was likely shell redirection.

### `createNorthAmericaBackgroundSVG.js`

Reads:

- `../../data-input/North_America_Great_Lakes.json`

Prints to stdout:

- an array of projected SVG path strings for the basemap/background

This appears to correspond to:

- `data/northAmerica.json`

### `createReservationsDissolvdSVGs.js`

Reads:

- `../../data-input/Reservation_Year/*.geojson`

Writes:

- `../../../build/data/indianLandsYearData/<year>.json`

What it does:

- reads year-specific reservation/unceded/open reservation geometry
- projects it to the app map projection
- converts features into SVG path data
- preserves type metadata and open dates where available

This is the clearest generator for the year-based Indian lands files used by the app.

Important note:

Like `makeStateTimelineData.ts` in the sibling `scripts/` directory, this writes to `build/data/...`. The app, however, reads from `public/data/indianLandsYearData/...`, so a publish/copy step is implied.

### `createReservationsSVGs.js`

Reads:

- `../../data-input/reservationSimplified.json`

Prints to stdout:

- projected reservation SVG paths with date metadata

This looks like a static reservation export, probably older than the year-based dissolved output used today.

### `createOpenReservations.js`

Reads:

- `../../data-input/open_reservations_full.json`

Prints to stdout:

- projected open-reservation path data
- label coordinates
- opening year

This appears useful for the text/essay maps rather than the main year-by-year app map.

### `createTownshipSVGs.js`

Reads:

- `../../data-input/townships.json`
- `../../data-input/join_table.json`

Prints to stdout:

- projected township path data
- bounds
- label coordinates
- sliver IDs

This looks more like a preprocessing/debugging export than something the current app loads directly.

### `createGLOs.js`

Reads:

- `../../../data/states.json`
- state-specific full-state township mesh files in `../../data-input/`
- `../../data-input/townships_data.json`

Writes:

- `../../../data/GLOs/IL.json`
- `../../../data/GLOs/IN.json`
- `../../../data/GLOs/OH.json`
- `../../../data/GLOs/MS.json`
- `../../../data/GLOs/FL.json`

This script generated special full-state overlay assets for general land offices.

At the time of this audit, those overlays appear to be legacy:

- the current app no longer references `data/GLOs/...`
- the old raster-like/hatching full-state overlays were recently removed from the runtime map

So this script is still historically important, but probably not part of the active pipeline anymore.

## Running These Scripts

Most of the JavaScript scripts can be run directly from `data-processing/svgs` or from the repo root using `node`.

For the scripts that print JSON to stdout, the workflow was likely:

```bash
cd data-processing/svgs
node scripts/createStatesSVGs.js > ../../data/states.json
node scripts/createNorthAmericaBackgroundSVG.js > ../../data/northAmerica.json
```

For disk-writing scripts such as `createReservationsDissolvdSVGs.js`, no redirection is needed:

```bash
cd data-processing/svgs
node scripts/createReservationsDissolvdSVGs.js
```

## Known Gaps

These are still unresolved after the audit:

- there is no single documented command sequence that rebuilds every asset the app reads
- several scripts print JSON but do not encode their output target in the script itself
- some assets in `data/` are clearly checked in, but their exact originating command was reconstructed rather than directly documented

So the safest way to use this directory is to treat it as a map of how assets were likely produced, not yet as a guaranteed one-command reproducible build system.
