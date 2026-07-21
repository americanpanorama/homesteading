import fs from 'fs';
import path from 'path';
import area from '@turf/area';

const ROOT = process.cwd();
const FIRST_YEAR = 1863;
const LAST_YEAR = 1912;
const SQ_METERS_PER_ACRE = 4046.8564224;
const RESERVATION_YEAR_DIR = path.join(ROOT, 'data-processing/data-input/Reservation_Year');
const RESERVATIONS_FILE = path.join(ROOT, 'data-processing/data-input/reservation.json');
const CESSIONS_FILE = path.join(ROOT, 'data-processing/data-input/Indian_Land_Cessions_in_the_United_States.geojson');
const OUTPUT_DIR = path.join(ROOT, 'public/data/mapData');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'indianLandsByYear.json');

const FIELD_PREFIX = 'edws_usaBdyPol_TribalCededLandsTable';

const acresFromGeometry = (geometry) => {
  if (!geometry) {
    return 0;
  }

  try {
    return area({ type: 'Feature', properties: {}, geometry }) / SQ_METERS_PER_ACRE;
  } catch (_error) {
    return 0;
  }
};

const fiscalYearForDate = (dateString) => {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const calendarYear = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  return month >= 7 ? calendarYear + 1 : calendarYear;
};

const dateValue = (dateString, fallback) => {
  if (!dateString) {
    return fallback;
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return (date.getUTCFullYear() * 10000) + ((date.getUTCMonth() + 1) * 100) + date.getUTCDate();
};

const overlapsFiscalYear = (startDate, endDate, fiscalYear) => {
  const startValue = dateValue(startDate, Number.NEGATIVE_INFINITY);
  const endValue = dateValue(endDate, Number.POSITIVE_INFINITY);
  const fiscalStart = ((fiscalYear - 1) * 10000) + 701;
  const fiscalEnd = (fiscalYear * 10000) + 630;

  return startValue <= fiscalEnd && endValue >= fiscalStart;
};

const formatDate = (dateString) => {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
};

const splitList = (value) => (
  typeof value === 'string'
    ? value.split(';').map(part => part.trim()).filter(Boolean)
    : []
);

const compact = (value) => (typeof value === 'string' ? value.trim() : '');

const buildLayerSummary = (year) => {
  const filename = path.join(RESERVATION_YEAR_DIR, `res_${year}.geojson`);
  if (!fs.existsSync(filename)) {
    return {};
  }

  const geojson = JSON.parse(fs.readFileSync(filename, 'utf8'));
  const summary = {};

  (geojson.features || []).forEach((feature) => {
    const type = feature.properties?.type || 'unknown';
    const existing = summary[type] || {
      type,
      dissolvedFeatures: 0,
      sourceFeatures: 0,
      acres: 0,
    };

    existing.dissolvedFeatures += 1;
    existing.sourceFeatures += Number(feature.properties?.COUNT || 1);
    existing.acres += acresFromGeometry(feature.geometry);
    summary[type] = existing;
  });

  return summary;
};

const buildCessionRecords = () => {
  if (!fs.existsSync(CESSIONS_FILE)) {
    return [];
  }

  const geojson = JSON.parse(fs.readFileSync(CESSIONS_FILE, 'utf8'));

  return (geojson.features || []).map((feature, index) => {
    const properties = feature.properties || {};
    const date = formatDate(properties[`${FIELD_PREFIX}cessdate1`]);
    const fiscalYear = fiscalYearForDate(properties[`${FIELD_PREFIX}cessdate1`]);

    return {
      id: compact(properties.edws_usaBdyPol_TribalCededLandscessnum) || `cession-${index + 1}`,
      cessionNumber: compact(properties[`${FIELD_PREFIX}cessnum`]) || compact(properties.edws_usaBdyPol_TribalCededLandscessnum),
      cessionDate: date,
      fiscalYear,
      presentDayTribes: splitList(properties[`${FIELD_PREFIX}presdaytrb`]),
      scheduledTribes: compact(properties[`${FIELD_PREFIX}schdtrb`]),
      states: splitList(properties[`${FIELD_PREFIX}state`]),
      counties: splitList(properties[`${FIELD_PREFIX}county`]),
      stateCounties: splitList(properties[`${FIELD_PREFIX}statecounty`]),
      mapName: compact(properties[`${FIELD_PREFIX}mapname`]),
      citation1: compact(properties[`${FIELD_PREFIX}citation1`]),
      citation2: compact(properties[`${FIELD_PREFIX}citation2`]),
      royceScheduleUrl: compact(properties[`${FIELD_PREFIX}date1link_royce_schedule`]),
      kapplerTreatyUrl: compact(properties[`${FIELD_PREFIX}date1link_kappler_treaty`]),
      federalStatuteUrl: compact(properties[`${FIELD_PREFIX}link_federal_statute`]),
      executiveOrderUrl: compact(properties[`${FIELD_PREFIX}link_executive_order`]),
      otherTreatyUrl: compact(properties[`${FIELD_PREFIX}link_other_treaty`]),
      acres: acresFromGeometry(feature.geometry),
    };
  });
};

const buildReservationRecords = () => {
  if (!fs.existsSync(RESERVATIONS_FILE)) {
    return [];
  }

  const geojson = JSON.parse(fs.readFileSync(RESERVATIONS_FILE, 'utf8'));

  return (geojson.features || [])
    .filter(feature => {
      const type = compact(feature.properties?.type);
      return type === 'reservation' || type === 'reservation (never ratified)';
    })
    .map((feature, index) => {
      const properties = feature.properties || {};
      return {
        id: compact(properties.cartodb_id?.toString()) || compact(properties.fid?.toString()) || `reservation-${index + 1}`,
        type: compact(properties.type),
        startDate: formatDate(properties.date_start),
        endDate: formatDate(properties.date_end),
        openDate: formatDate(properties.date_open),
        correction: compact(properties.doc_corr),
        acres: acresFromGeometry(feature.geometry),
      };
    });
};

const cessionsByYear = new Map();
buildCessionRecords().forEach((cession) => {
  if (!cession.fiscalYear || cession.fiscalYear < FIRST_YEAR || cession.fiscalYear > LAST_YEAR) {
    return;
  }

  const yearCessions = cessionsByYear.get(cession.fiscalYear) || [];
  yearCessions.push(cession);
  cessionsByYear.set(cession.fiscalYear, yearCessions);
});

const reservationRecords = buildReservationRecords();

const years = {};
for (let year = FIRST_YEAR; year <= LAST_YEAR; year += 1) {
  years[year] = {
    layerSummary: buildLayerSummary(year),
    reservations: reservationRecords
      .filter(reservation => overlapsFiscalYear(reservation.startDate, reservation.endDate, year))
      .sort((a, b) => (
        b.acres - a.acres
        || a.startDate.localeCompare(b.startDate)
        || a.id.localeCompare(b.id)
      )),
    cessions: (cessionsByYear.get(year) || []).sort((a, b) => (
      a.cessionDate.localeCompare(b.cessionDate)
      || a.cessionNumber.localeCompare(b.cessionNumber)
    )),
  };
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify({ years }, null, 2)}\n`);
console.log(`Wrote ${OUTPUT_FILE}`);
