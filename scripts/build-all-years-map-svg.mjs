import fs from 'fs';
import path from 'path';

const DEFAULT_START_YEAR = 1863;
const DEFAULT_END_YEAR = 1912;
const DEFAULT_VIEWBOX = [0, 0, 1024, 1024];
const FULL_STATE_OFFICE_STATES = new Set(['IL', 'IN', 'MS', 'OH']);

const METRIC_FIELDS = {
  claims: ['acres_claimed'],
  'claims-all': ['acres_claimed', 'acres_claimed_indian_lands'],
  patents: ['acres_patented'],
  'patents-all': ['acres_patented', 'acres_patented_indian_lands'],
  commutations: ['acres_commuted_2301', 'acres_commuted_18800615', 'acres_commuted_indian_lands'],
};

const usage = `Usage: node scripts/build-all-years-map-svg.mjs [options]

Options:
  --mode yearly|grouped       Render every district/year path, or group identical boundaries. Default: yearly.
  --metric <name>             One of: ${Object.keys(METRIC_FIELDS).join(', ')}. Default: claims.
  --fields <a,b,c>            Custom acre fields to sum instead of --metric.
  --start-year <year>         First year to read. Default: ${DEFAULT_START_YEAR}.
  --end-year <year>           Last year to read. Default: ${DEFAULT_END_YEAR}.
  --fill <color>              SVG fill color. Default: #000.
  --background <color>        SVG background color. Default: #d9d9d9.
  --base-fill <color>         US base-layer fill color. Default: #fff.
  --base-stroke <color>       US base-layer stroke color. Default: #c8c8c8.
  --no-base-layer             Omit the white US base layer.
  --output <path>             Output SVG path. Default: public/static/all-years-<metric>-<mode>.svg.
  --max-opacity <number>      Upper clamp for each emitted path opacity. Default: 1.
  --opacity-scale <number>    Multiplier applied after acres / area. Default: 1.
  --include-zero              Emit paths whose calculated opacity is 0. Default: omit them.
  --no-clamp                  Do not clamp opacity to [0, max-opacity].
  --help                      Show this message.

Examples:
  npm run build-all-years-map-svg
  node scripts/build-all-years-map-svg.mjs --mode grouped --metric patents
  node scripts/build-all-years-map-svg.mjs --metric claims-all --output public/static/all-years-claims-all.svg
`;

const parseArgs = (argv) => {
  const options = {
    mode: 'yearly',
    metric: 'claims',
    fields: null,
    startYear: DEFAULT_START_YEAR,
    endYear: DEFAULT_END_YEAR,
    fill: '#000',
    background: '#d9d9d9',
    baseFill: '#fff',
    baseStroke: '#c8c8c8',
    baseLayer: true,
    output: null,
    maxOpacity: 1,
    opacityScale: 1,
    includeZero: false,
    clamp: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      index += 1;
      if (index >= argv.length) {
        throw new Error(`Missing value after ${arg}`);
      }
      return argv[index];
    };

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--mode') {
      options.mode = next();
    } else if (arg === '--metric') {
      options.metric = next();
    } else if (arg === '--fields') {
      options.fields = next().split(',').map(field => field.trim()).filter(Boolean);
    } else if (arg === '--start-year') {
      options.startYear = parseInteger(next(), arg);
    } else if (arg === '--end-year') {
      options.endYear = parseInteger(next(), arg);
    } else if (arg === '--fill') {
      options.fill = next();
    } else if (arg === '--background') {
      options.background = next();
    } else if (arg === '--base-fill') {
      options.baseFill = next();
    } else if (arg === '--base-stroke') {
      options.baseStroke = next();
    } else if (arg === '--no-base-layer') {
      options.baseLayer = false;
    } else if (arg === '--output') {
      options.output = next();
    } else if (arg === '--max-opacity') {
      options.maxOpacity = parseNumber(next(), arg);
    } else if (arg === '--opacity-scale') {
      options.opacityScale = parseNumber(next(), arg);
    } else if (arg === '--include-zero') {
      options.includeZero = true;
    } else if (arg === '--no-clamp') {
      options.clamp = false;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (!['yearly', 'grouped'].includes(options.mode)) {
    throw new Error('--mode must be "yearly" or "grouped"');
  }
  if (!options.fields && !METRIC_FIELDS[options.metric]) {
    throw new Error(`Unknown metric "${options.metric}". Use one of: ${Object.keys(METRIC_FIELDS).join(', ')}`);
  }
  if (options.startYear > options.endYear) {
    throw new Error('--start-year must be less than or equal to --end-year');
  }
  if (options.maxOpacity < 0) {
    throw new Error('--max-opacity must be 0 or greater');
  }

  return options;
};

function parseInteger(value, optionName) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed)) {
    throw new Error(`${optionName} must be an integer`);
  }
  return parsed;
}

function parseNumber(value, optionName) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${optionName} must be a number`);
  }
  return parsed;
}

const xmlEscape = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const formatOpacity = (value) => {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return Number.parseFloat(value.toFixed(6)).toString();
};

const getOfficeStats = (office) => {
  if (!Array.isArray(office.data)) {
    return office;
  }

  return office.data.find(datum => datum.adjustedForMap)
    || office.data.find(datum => !datum.adjustedForMap)
    || null;
};

const getOfficeBoundary = (year, office) => {
  if (!Array.isArray(office.office_boundaries)) {
    return office;
  }

  if (FULL_STATE_OFFICE_STATES.has(office.state)) {
    return office.office_boundaries[0] || null;
  }

  return office.office_boundaries.find(boundary => (
    boundary.tile_id && boundary.tile_id.slice(-8) >= `${year}0630`
  )) || null;
};

const normalizeOffice = (year, office) => {
  const stats = getOfficeStats(office);
  const boundary = getOfficeBoundary(year, office);

  if (!stats || !boundary || !boundary.d) {
    return null;
  }

  if (
    !Array.isArray(office.office_boundaries)
    && office.tile_id
    && office.tile_id.slice(-8) < `${year}0630`
    && !FULL_STATE_OFFICE_STATES.has(office.state)
  ) {
    return null;
  }

  const { adjustedForMap, ...statsWithoutFlag } = stats;
  void adjustedForMap;

  return {
    ...boundary,
    ...statsWithoutFlag,
    office: office.office,
    state: office.state,
  };
};

const getAcreValue = (office, fields) => fields.reduce((total, field) => (
  total + (Number.isFinite(office[field]) ? office[field] : 0)
), 0);

const getRawOpacity = (office, fields, opacityScale) => {
  const area = Number.isFinite(office.area) ? office.area : 0;
  if (area <= 0) {
    return 0;
  }

  return (getAcreValue(office, fields) / area) * opacityScale;
};

const clampOpacity = (opacity, maxOpacity) => Math.min(maxOpacity, Math.max(0, opacity));

const pathIdentity = (office) => office.d;

const getBounds = (entries) => entries.reduce((bounds, entry) => {
  const officeBounds = entry.bounds;
  if (!Array.isArray(officeBounds) || officeBounds.length !== 2) {
    return bounds;
  }

  return [
    [
      Math.min(bounds[0][0], officeBounds[0][0]),
      Math.min(bounds[0][1], officeBounds[0][1]),
    ],
    [
      Math.max(bounds[1][0], officeBounds[1][0]),
      Math.max(bounds[1][1], officeBounds[1][1]),
    ],
  ];
}, [[Infinity, Infinity], [-Infinity, -Infinity]]);

const loadBaseLayerPaths = () => {
  const continentalUsPath = path.join(process.cwd(), 'data', 'continentalUS.json');
  const statesPath = path.join(process.cwd(), 'public', 'data', 'states.json');
  const continentalUs = JSON.parse(fs.readFileSync(continentalUsPath, 'utf8'));
  const states = JSON.parse(fs.readFileSync(statesPath, 'utf8'));
  const alaska = states.find(state => state.abbr === 'AK');

  return [
    ...continentalUs.map((d, index) => ({
      d,
      title: index === 0 ? 'Continental United States' : `Continental United States ${index + 1}`,
    })),
    ...(alaska ? [{
      d: alaska.d,
      title: 'Alaska inset',
    }] : []),
  ];
};

const buildYearlyEntries = (yearOffices, fields, options) => yearOffices.flatMap(({ year, offices }) => (
  offices.reduce((entries, office) => {
    const rawOpacity = getRawOpacity(office, fields, options.opacityScale);
    const opacity = options.clamp ? clampOpacity(rawOpacity, options.maxOpacity) : rawOpacity;
    if (!options.includeZero && opacity <= 0) {
      return entries;
    }

    entries.push({
      d: office.d,
      bounds: office.bounds,
      opacity,
      rawOpacity,
      title: `${year} ${office.state || ''} ${office.office || ''}`.trim(),
    });
    return entries;
  }, [])
));

const buildGroupedEntries = (yearOffices, fields, options) => {
  const grouped = new Map();

  yearOffices.forEach(({ year, offices }) => {
    offices.forEach((office) => {
      const key = pathIdentity(office);
      const existing = grouped.get(key) || {
        d: office.d,
        bounds: office.bounds,
        labels: new Set(),
        years: [],
        rawOpacity: 0,
      };

      existing.labels.add(`${office.state || ''} ${office.office || ''}`.trim());
      existing.years.push(year);
      existing.rawOpacity += getRawOpacity(office, fields, options.opacityScale);
      grouped.set(key, existing);
    });
  });

  return [...grouped.values()].reduce((entries, entry) => {
    const opacity = options.clamp ? clampOpacity(entry.rawOpacity, options.maxOpacity) : entry.rawOpacity;
    if (!options.includeZero && opacity <= 0) {
      return entries;
    }

    const firstYear = Math.min(...entry.years);
    const lastYear = Math.max(...entry.years);
    const labels = [...entry.labels].filter(Boolean).slice(0, 3);
    const labelSuffix = entry.labels.size > labels.length ? ` +${entry.labels.size - labels.length} more` : '';
    entries.push({
      d: entry.d,
      bounds: entry.bounds,
      opacity,
      rawOpacity: entry.rawOpacity,
      title: `${labels.join('; ')}${labelSuffix} ${firstYear}-${lastYear}`.trim(),
    });
    return entries;
  }, []);
};

const buildSvg = ({ baseLayerPaths, entries, fields, options, bounds }) => {
  const [x, y, width, height] = DEFAULT_VIEWBOX;
  const metadata = [
    `Generated by scripts/build-all-years-map-svg.mjs`,
    `Years: ${options.startYear}-${options.endYear}`,
    `Mode: ${options.mode}`,
    `Fields: ${fields.join(', ')}`,
    `Fill: ${options.fill}`,
    `Background: ${options.background}`,
    `Base layer: ${options.baseLayer ? `${options.baseFill} fill, ${options.baseStroke} stroke` : 'none'}`,
    `Opacity: sum(fields) / area * ${options.opacityScale}${options.clamp ? `, clamped to ${options.maxOpacity}` : ', unclamped'}`,
    `Paths: ${entries.length}`,
    `Data bounds: ${JSON.stringify(bounds)}`,
  ];

  const paths = entries.map(entry => (
    `  <path d="${xmlEscape(entry.d)}" fill="${xmlEscape(options.fill)}" fill-opacity="${formatOpacity(entry.opacity)}"><title>${xmlEscape(entry.title)}; opacity ${formatOpacity(entry.opacity)}</title></path>`
  ));
  const basePaths = baseLayerPaths.map(entry => (
    `    <path d="${xmlEscape(entry.d)}"><title>${xmlEscape(entry.title)}</title></path>`
  ));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    ...metadata.map(line => `<!-- ${xmlEscape(line)} -->`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${width} ${height}" width="${width}" height="${height}">`,
    `  <rect width="100%" height="100%" fill="${xmlEscape(options.background)}"/>`,
    ...(options.baseLayer ? [
      `  <g id="us-base-layer" fill="${xmlEscape(options.baseFill)}" stroke="${xmlEscape(options.baseStroke)}" stroke-width="1" stroke-linejoin="round">`,
      ...basePaths,
      '  </g>',
    ] : []),
    '  <g id="activity-layer">',
    ...paths,
    '  </g>',
    '</svg>',
    '',
  ].join('\n');
};

const main = () => {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage);
    return;
  }

  const fields = options.fields || METRIC_FIELDS[options.metric];
  const yearDataDir = path.join(process.cwd(), 'public', 'data', 'yearData');
  const output = options.output || path.join(
    process.cwd(),
    'public',
    'static',
    `all-years-${options.fields ? 'custom' : options.metric}-${options.mode}.svg`,
  );

  const yearOffices = [];
  for (let year = options.startYear; year <= options.endYear; year += 1) {
    const yearDataPath = path.join(yearDataDir, `${year}.json`);
    if (!fs.existsSync(yearDataPath)) {
      throw new Error(`Missing year data: ${yearDataPath}`);
    }

    const yearData = JSON.parse(fs.readFileSync(yearDataPath, 'utf8'));
    const offices = (Array.isArray(yearData.offices) ? yearData.offices : [])
      .map(office => normalizeOffice(year, office))
      .filter(Boolean);

    yearOffices.push({ year, offices });
  }

  const entries = options.mode === 'grouped'
    ? buildGroupedEntries(yearOffices, fields, options)
    : buildYearlyEntries(yearOffices, fields, options);
  const baseLayerPaths = options.baseLayer ? loadBaseLayerPaths() : [];
  const bounds = getBounds(entries);
  const svg = buildSvg({ baseLayerPaths, entries, fields, options, bounds });

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, svg);

  const rawOpacityMax = entries.reduce((max, entry) => Math.max(max, entry.rawOpacity), 0);
  console.log(`Wrote ${entries.length} paths to ${output}`);
  console.log(`Years: ${options.startYear}-${options.endYear}; mode: ${options.mode}; fields: ${fields.join(', ')}`);
  console.log(`Largest raw opacity before clamp: ${formatOpacity(rawOpacityMax)}`);
};

try {
  main();
} catch (error) {
  console.error(error.message);
  console.error('');
  console.error(usage);
  process.exit(1);
}
