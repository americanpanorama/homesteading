import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { useTimelineData, useURLParams, useYearData } from '../../hooks';
import { Conflict } from '../../index.d';
import * as Styled from './styled';
import {
  ACTIVITY_METRICS,
  FIRST_MAP_DATA_YEAR,
  LAST_MAP_DATA_YEAR,
  formatAcres,
  formatDate,
  formatNumber,
  percentChangeLabel,
  summarizeNationalActivity,
  summarizePlacesForYear,
  totalAcres,
  totalClaims,
  totalCommutations,
  totalPatents,
} from './utilities';
import {
  ActivityTotals,
  IndianLandsDataFile,
  IndianLandsLayerSummary,
  IndianLandsReservation,
  IndianLandsYearData,
  PlaceActivitySummary,
} from './types';

const INDIAN_LANDS_LABELS: Record<string, string> = {
  'unceded land': 'Unceded lands',
  reservation: 'Reservations',
  open_res: 'Opened reservations',
};

const loadIndianLandsData = (): Promise<IndianLandsDataFile> => (
  axios(`${process.env.PUBLIC_URL}/data/mapData/indianLandsByYear.json`)
    .then(response => response.data as IndianLandsDataFile)
);

const isYearInRange = (year: number) => year >= FIRST_MAP_DATA_YEAR && year <= LAST_MAP_DATA_YEAR;

const compactList = (values: string[], fallback = 'Not listed') => (
  values.length > 0 ? values.join('; ') : fallback
);

const changeFor = (
  current: number,
  previousTotals: ActivityTotals | null,
  getPreviousValue: (totals: ActivityTotals) => number,
) => percentChangeLabel(current, previousTotals ? getPreviousValue(previousTotals) : null);

const metricHasCurrentData = (
  current: ActivityTotals,
  metric: typeof ACTIVITY_METRICS[number],
) => (
  Number(current[metric.countKey as keyof ActivityTotals] || 0) > 0
  || Number(current[metric.acresKey as keyof ActivityTotals] || 0) > 0
);

const summaryHasCurrentData = (summary: PlaceActivitySummary) => (
  totalClaims(summary.current) > 0
  || totalPatents(summary.current) > 0
  || summary.conflicts.length > 0
);

const placeKindLabel = (summary: PlaceActivitySummary) => (
  summary.place.name.includes('Terr') ? 'territory' : 'state'
);

const SummaryMetric = ({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) => (
  <Styled.Metric>
    <Styled.MetricLabel>{label}</Styled.MetricLabel>
    <Styled.MetricValue>{value}</Styled.MetricValue>
    <Styled.Muted>{change}</Styled.Muted>
  </Styled.Metric>
);

const ActivityBreakdownTable = ({
  current,
  previous,
}: {
  current: ActivityTotals;
  previous: ActivityTotals | null;
}) => {
  const activeMetrics = ACTIVITY_METRICS.filter(metric => metricHasCurrentData(current, metric));

  if (activeMetrics.length === 0) {
    return <Styled.EmptyMessage>No homesteading activity is listed for this year.</Styled.EmptyMessage>;
  }

  return (
    <Styled.TableWrap>
      <Styled.DataTable>
        <thead>
          <tr>
            <th scope='col'>Category</th>
            <th scope='col' className='numeric'>Count</th>
            <th scope='col'>Count change</th>
            <th scope='col' className='numeric'>Acres</th>
            <th scope='col'>Acres change</th>
          </tr>
        </thead>
        <tbody>
          {activeMetrics.map(metric => {
            const count = Number(current[metric.countKey as keyof ActivityTotals] || 0);
            const acres = Number(current[metric.acresKey as keyof ActivityTotals] || 0);
            const previousCount = previous ? Number(previous[metric.countKey as keyof ActivityTotals] || 0) : null;
            const previousAcres = previous ? Number(previous[metric.acresKey as keyof ActivityTotals] || 0) : null;

            return (
              <tr key={metric.label}>
                <th scope='row'>{metric.label}</th>
                <td className='numeric'>{formatNumber(count)}</td>
                <td>{percentChangeLabel(count, previousCount)}</td>
                <td className='numeric'>{formatNumber(acres)}</td>
                <td>{percentChangeLabel(acres, previousAcres)}</td>
              </tr>
            );
          })}
        </tbody>
      </Styled.DataTable>
    </Styled.TableWrap>
  );
};

const DistrictActivity = ({
  stateTerr,
  year,
}: {
  stateTerr: string;
  year: number;
}) => {
  const districtData = useTimelineData(stateTerr);
  const summaries = useMemo(() => (
    summarizePlacesForYear(districtData, year)
      .filter(summaryHasCurrentData)
      .sort((a, b) => totalAcres(b.current) - totalAcres(a.current))
  ), [districtData, year]);
  const hasConflicts = summaries.some(summary => summary.conflicts.length > 0);

  if (summaries.length === 0) {
    return <Styled.EmptyMessage>No district activity is listed for this year.</Styled.EmptyMessage>;
  }

  return (
    <Styled.TableWrap>
      <Styled.DataTable>
        <thead>
          <tr>
            <th scope='col'>District</th>
            <th scope='col' className='numeric'>Claims</th>
            <th scope='col' className='numeric'>Patents</th>
            <th scope='col' className='numeric'>Commutations</th>
            <th scope='col' className='numeric'>Total acres</th>
            {hasConflicts && <th scope='col' className='numeric'>Clashes</th>}
          </tr>
        </thead>
        <tbody>
          {summaries.map(summary => (
            <tr key={summary.place.name}>
              <th scope='row'>{summary.place.name}</th>
              <td className='numeric'>{formatNumber(totalClaims(summary.current))}</td>
              <td className='numeric'>{formatNumber(totalPatents(summary.current))}</td>
              <td className='numeric'>{formatNumber(totalCommutations(summary.current))}</td>
              <td className='numeric'>{formatNumber(totalAcres(summary.current))}</td>
              {hasConflicts && <td className='numeric'>{formatNumber(summary.conflicts.length)}</td>}
            </tr>
          ))}
        </tbody>
      </Styled.DataTable>
    </Styled.TableWrap>
  );
};

const StateActivityDetails = ({
  summary,
  year,
}: {
  summary: PlaceActivitySummary;
  year: number;
}) => {
  const stateTerr = summary.place.abbr;
  const hasConflicts = summary.conflicts.length > 0;

  return (
    <Styled.StateDetails>
      <summary>
        <Styled.StateName>{summary.place.name}</Styled.StateName>
        <SummaryMetric
          label='Claims'
          value={formatNumber(totalClaims(summary.current))}
          change={changeFor(totalClaims(summary.current), summary.previous, totalClaims)}
        />
        <SummaryMetric
          label='Patents'
          value={formatNumber(totalPatents(summary.current))}
          change={changeFor(totalPatents(summary.current), summary.previous, totalPatents)}
        />
        <SummaryMetric
          label='Total acres'
          value={formatNumber(totalAcres(summary.current))}
          change={changeFor(totalAcres(summary.current), summary.previous, totalAcres)}
        />
        {hasConflicts && (
          <SummaryMetric
            label='Clashes'
            value={formatNumber(summary.conflicts.length)}
            change={`In this ${placeKindLabel(summary)}`}
          />
        )}
      </summary>
      <Styled.DetailsBody>
        <Styled.SubsectionTitle>Districts</Styled.SubsectionTitle>
        {stateTerr ? (
          <DistrictActivity stateTerr={stateTerr} year={year} />
        ) : (
          <Styled.EmptyMessage>No state or territory abbreviation is available for this row.</Styled.EmptyMessage>
        )}
      </Styled.DetailsBody>
    </Styled.StateDetails>
  );
};

const IndianLandsSummaryTable = ({
  current,
  previous,
}: {
  current?: IndianLandsYearData;
  previous?: IndianLandsYearData;
}) => {
  const types = Array.from(new Set([
    ...Object.keys(current?.layerSummary || {}),
    ...Object.keys(previous?.layerSummary || {}),
  ]));

  if (types.length === 0) {
    return <Styled.EmptyMessage>No Indian lands layer data is listed for this year.</Styled.EmptyMessage>;
  }

  return (
    <Styled.TableWrap>
      <Styled.DataTable>
        <thead>
          <tr>
            <th scope='col'>Layer</th>
            <th scope='col' className='numeric'>Source features</th>
            <th scope='col' className='numeric'>Acres</th>
            <th scope='col'>Acre change</th>
          </tr>
        </thead>
        <tbody>
          {types.map(type => {
            const currentSummary: IndianLandsLayerSummary | undefined = current?.layerSummary[type];
            const previousSummary: IndianLandsLayerSummary | undefined = previous?.layerSummary[type];
            const acres = currentSummary?.acres || 0;

            return (
              <tr key={type}>
                <th scope='row'>{INDIAN_LANDS_LABELS[type] || type}</th>
                <td className='numeric'>{formatNumber(currentSummary?.sourceFeatures || 0)}</td>
                <td className='numeric'>{formatNumber(acres)}</td>
                <td>{percentChangeLabel(acres, previousSummary?.acres ?? null)}</td>
              </tr>
            );
          })}
        </tbody>
      </Styled.DataTable>
    </Styled.TableWrap>
  );
};

const CessionTable = ({ yearData }: { yearData?: IndianLandsYearData }) => {
  const cessions = yearData?.cessions || [];

  if (cessions.length === 0) {
    return <Styled.EmptyMessage>No land cession records in the source dataset are dated to this fiscal year.</Styled.EmptyMessage>;
  }

  return (
    <Styled.TableWrap>
      <Styled.DataTable>
        <thead>
          <tr>
            <th scope='col'>Date</th>
            <th scope='col' className='numeric'>Acres</th>
            <th scope='col'>States/Territories</th>
            <th scope='col'>Counties</th>
            <th scope='col'>Nations</th>
            <th scope='col'>Source links</th>
          </tr>
        </thead>
        <tbody>
          {cessions.map(cession => (
            <tr key={`${cession.cessionNumber}-${cession.cessionDate}`}>
              <th scope='row'>{formatDate(cession.cessionDate)}</th>
              <td className='numeric'>{formatNumber(cession.acres)}</td>
              <td>{compactList(cession.states)}</td>
              <td>{compactList(cession.counties)}</td>
              <td>{cession.scheduledTribes || compactList(cession.presentDayTribes)}</td>
              <td>
                {cession.royceScheduleUrl && (
                  <Styled.ExternalLink href={cession.royceScheduleUrl} target='_blank' rel='noopener noreferrer'>Royce schedule</Styled.ExternalLink>
                )}
                {cession.kapplerTreatyUrl && (
                  <>
                    {cession.royceScheduleUrl ? '; ' : ''}
                    <Styled.ExternalLink href={cession.kapplerTreatyUrl} target='_blank' rel='noopener noreferrer'>Kappler treaty</Styled.ExternalLink>
                  </>
                )}
                {!cession.royceScheduleUrl && !cession.kapplerTreatyUrl && 'No link listed'}
              </td>
            </tr>
          ))}
        </tbody>
      </Styled.DataTable>
    </Styled.TableWrap>
  );
};

const ReservationRecordsTable = ({ reservations }: { reservations: IndianLandsReservation[] }) => {
  if (reservations.length === 0) {
    return <Styled.EmptyMessage>No individual reservation records are listed for this year.</Styled.EmptyMessage>;
  }

  return (
    <Styled.DataDisclosure>
      <summary>Show individual reservation records ({formatNumber(reservations.length)})</summary>
      <Styled.DetailsBody>
        <Styled.TableWrap>
          <Styled.DataTable>
            <thead>
              <tr>
                <th scope='col'>Record</th>
                <th scope='col'>Type</th>
                <th scope='col'>Start date</th>
                <th scope='col'>End date</th>
                <th scope='col'>Opened date</th>
                <th scope='col' className='numeric'>Acres</th>
                <th scope='col'>Notes</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(reservation => (
                <tr key={reservation.id}>
                  <th scope='row'>Reservation record {reservation.id}</th>
                  <td>{reservation.type}</td>
                  <td>{formatDate(reservation.startDate)}</td>
                  <td>{formatDate(reservation.endDate)}</td>
                  <td>{reservation.openDate ? formatDate(reservation.openDate) : 'Not listed'}</td>
                  <td className='numeric'>{formatAcres(reservation.acres)}</td>
                  <td>{reservation.correction || 'No notes listed'}</td>
                </tr>
              ))}
            </tbody>
          </Styled.DataTable>
        </Styled.TableWrap>
      </Styled.DetailsBody>
    </Styled.DataDisclosure>
  );
};

const ConflictTable = ({ conflicts }: { conflicts: Conflict[] }) => {
  if (conflicts.length === 0) {
    return <Styled.EmptyMessage>No clashes are listed for this year.</Styled.EmptyMessage>;
  }

  return (
    <Styled.TableWrap>
      <Styled.DataTable>
        <thead>
          <tr>
            <th scope='col'>Clash</th>
            <th scope='col'>Date</th>
            <th scope='col'>State/Territory</th>
            <th scope='col'>District</th>
            <th scope='col'>Nations listed</th>
            <th scope='col' className='numeric'>U.S. casualties</th>
            <th scope='col' className='numeric'>Native casualties</th>
          </tr>
        </thead>
        <tbody>
          {conflicts.map((conflict, index) => (
            <tr key={`${conflict.names}-${index}`}>
              <th scope='row'>{conflict.names}</th>
              <td>{formatDate(`${conflict.start_date.year}-${String(conflict.start_date.month).padStart(2, '0')}-${String(conflict.start_date.day).padStart(2, '0')}`)}</td>
              <td>{conflict.state}</td>
              <td>{conflict.office}</td>
              <td>{conflict.nations.join('; ') || 'Not listed'}</td>
              <td className='numeric'>{formatNumber(conflict.us_casualties)}</td>
              <td className='numeric'>{formatNumber(conflict.native_casualties)}</td>
            </tr>
          ))}
        </tbody>
      </Styled.DataTable>
    </Styled.TableWrap>
  );
};

const MapData = () => {
  const { yearNum } = useURLParams();
  const nationalTimelineData = useTimelineData('national');
  const yearData = useYearData(yearNum);
  const [indianLandsData, setIndianLandsData] = useState<IndianLandsDataFile | null>(null);

  useEffect(() => {
    let isMounted = true;
    loadIndianLandsData()
      .then(data => {
        if (isMounted) {
          setIndianLandsData(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIndianLandsData(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isYearInRange(yearNum)) {
    return <Navigate to={`/map-data/year/${FIRST_MAP_DATA_YEAR}`} replace />;
  }

  const stateSummaries = useMemo(() => (
    summarizePlacesForYear(nationalTimelineData, yearNum)
      .filter(summaryHasCurrentData)
      .sort((a, b) => a.place.name.localeCompare(b.place.name))
  ), [nationalTimelineData, yearNum]);
  const nationalSummary = useMemo(() => (
    summarizeNationalActivity(stateSummaries)
  ), [stateSummaries]);
  const currentIndianLands = indianLandsData?.years[yearNum.toString()];
  const previousIndianLands = indianLandsData?.years[(yearNum - 1).toString()];
  const usCasualties = yearData.conflicts.reduce((sum, conflict) => sum + conflict.us_casualties, 0);
  const nativeCasualties = yearData.conflicts.reduce((sum, conflict) => sum + conflict.native_casualties, 0);

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Eyebrow>Accessible map data</Styled.Eyebrow>
        <Styled.Title>{yearNum} Map Data</Styled.Title>
        <Styled.Description>
          This page presents the map&apos;s yearly data in structured text form. It includes homesteading activity, Indian lands layers, and clashes for the fiscal year ending June 30, {yearNum}. <Styled.InlineLink to={`/year/${yearNum}`}>Return to the map visualization.</Styled.InlineLink>
        </Styled.Description>
        <Styled.YearNav aria-label='Map data year navigation'>
          <Styled.YearLink
            to={`/map-data/year/${yearNum - 1}`}
            $disabled={yearNum <= FIRST_MAP_DATA_YEAR}
            aria-disabled={yearNum <= FIRST_MAP_DATA_YEAR}
          >
            Previous year
          </Styled.YearLink>
          <Styled.YearLink
            to={`/map-data/year/${yearNum + 1}`}
            $disabled={yearNum >= LAST_MAP_DATA_YEAR}
            aria-disabled={yearNum >= LAST_MAP_DATA_YEAR}
          >
            Next year
          </Styled.YearLink>
          <Styled.InlineLink as={Link} to={`/table/year/${yearNum}`}>Open homesteading table</Styled.InlineLink>
        </Styled.YearNav>
      </Styled.Header>

      <Styled.Section aria-labelledby='homesteading-activity-heading'>
        <Styled.SectionTitle id='homesteading-activity-heading'>Homesteading Activity</Styled.SectionTitle>
        <Styled.SubsectionTitle>United States totals</Styled.SubsectionTitle>
        <ActivityBreakdownTable current={nationalSummary.current} previous={nationalSummary.previous} />

        <Styled.SubsectionTitle>States and territories</Styled.SubsectionTitle>
        {stateSummaries.length > 0 ? (
          <Styled.DetailsList>
            {stateSummaries.map(summary => (
              <StateActivityDetails
                key={summary.place.abbr || summary.place.name}
                summary={summary}
                year={yearNum}
              />
            ))}
          </Styled.DetailsList>
        ) : (
          <Styled.EmptyMessage>No states or territories have homesteading activity or clashes listed for this year.</Styled.EmptyMessage>
        )}
      </Styled.Section>

      <Styled.Section aria-labelledby='indian-lands-heading'>
        <Styled.SectionTitle id='indian-lands-heading'>Indian Lands</Styled.SectionTitle>
        <Styled.SubsectionTitle>Layer totals</Styled.SubsectionTitle>
        <IndianLandsSummaryTable current={currentIndianLands} previous={previousIndianLands} />
        <ReservationRecordsTable reservations={currentIndianLands?.reservations || []} />
        <Styled.SubsectionTitle>Cession records dated to this fiscal year</Styled.SubsectionTitle>
        <Styled.Description>
          These rows come from the Indian Land Cessions source dataset and provide state, county, nation, citation, and source-link context. The map layer totals above come from the yearly reservation and unceded-land geometries used by the visualization.
        </Styled.Description>
        <CessionTable yearData={currentIndianLands} />
      </Styled.Section>

      <Styled.Section aria-labelledby='clashes-heading'>
        <Styled.SectionTitle id='clashes-heading'>Clashes</Styled.SectionTitle>
        <Styled.SubsectionTitle>United States totals</Styled.SubsectionTitle>
        <Styled.TableWrap>
          <Styled.DataTable>
            <thead>
              <tr>
                <th scope='col'>Measure</th>
                <th scope='col' className='numeric'>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope='row'>Clashes</th>
                <td className='numeric'>{formatNumber(yearData.conflicts.length)}</td>
              </tr>
              <tr>
                <th scope='row'>U.S. casualties</th>
                <td className='numeric'>{formatNumber(usCasualties)}</td>
              </tr>
              <tr>
                <th scope='row'>Native casualties</th>
                <td className='numeric'>{formatNumber(nativeCasualties)}</td>
              </tr>
            </tbody>
          </Styled.DataTable>
        </Styled.TableWrap>

        <Styled.SubsectionTitle>Clash records</Styled.SubsectionTitle>
        <ConflictTable conflicts={yearData.conflicts} />
      </Styled.Section>
    </Styled.Container>
  );
};

export default MapData;
