import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useClaimsAndPatentsTypes, useLinkBuilder, useTimelineData, useURLParams } from '../../hooks';
import { TimelinePlaceData, TimelineYearPlaceData } from '../../index.d';
import { acresValue } from '../../utilities';
import { getTimelineLabel, sortTimelinePlaces, TIMELINE_SELECTABLE_YEARS } from '../Timeline/utilities';
import { TimelineSortOption } from '../Timeline/types';
import TableControls from './Controls/Index';
import * as Styled from './styled';

interface TableYearCell {
  year: number;
  percent: number | null;
  acres: number | null;
  count: number | null;
}

interface TableRow {
  label: string;
  cells: TableYearCell[];
}

const formatPercent = (value: number | null): string => {
  if (value === null) {
    return 'No data';
  }

  if (value === 0) {
    return '0%';
  }

  if (value < 0.01) {
    return '<0.01%';
  }

  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: value < 1 ? 2 : 1,
    minimumFractionDigits: value < 1 ? 2 : 0,
  })}%`;
};

const formatNumber = (value: number | null): string => {
  if (value === null) {
    return 'No data';
  }

  const rounded = Math.round(value);
  return rounded.toLocaleString();
};

const getYearDatum = (place: TimelinePlaceData, year: number): TimelineYearPlaceData | undefined => (
  place.yearData.find(yearDatum => yearDatum.year === year)
);

const encodeCsvCell = (value: string): string => {
  if (!/[",\n]/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '""')}"`;
};

const TimelineTable = () => {
  const params = useURLParams();
  const buildMapLink = useLinkBuilder();
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const { stateTerr, stateTerrData, yearNum } = params;
  const [sortBy, setSortBy] = useState<TimelineSortOption>('alphabetical');
  const [showInactiveAreasForSelectedYear, setShowInactiveAreasForSelectedYear] = useState(true);
  const [csvHref, setCsvHref] = useState('');
  const placeKey = stateTerr || 'national';
  const placeData = useTimelineData(placeKey);
  const { acresTypes, countTypes, acresLabel, numberLabel } = useClaimsAndPatentsTypes();
  const title = 'Homesteading Activity Data';
  const mapLink = buildMapLink({
    stateTerr: stateTerr || null,
    view: params.view || null,
    year: params.year,
  });

  const rows = useMemo<TableRow[]>(() => {
    const sortedPlaces = sortTimelinePlaces(placeData, sortBy, yearNum, acresTypes)
      .filter(place => {
        if (showInactiveAreasForSelectedYear) {
          return true;
        }

        const dataForSelectedYear = getYearDatum(place, yearNum);
        return !!dataForSelectedYear && acresValue(dataForSelectedYear, acresTypes) > 0;
      });

    return sortedPlaces.map(place => ({
      label: getTimelineLabel(place, false, stateTerr, yearNum),
      cells: TIMELINE_SELECTABLE_YEARS.map(year => {
        const yearDatum = getYearDatum(place, year);

        if (!yearDatum) {
          return {
            year,
            percent: null,
            acres: null,
            count: null,
          };
        }

        const acres = acresValue(yearDatum, acresTypes);
        const count = countTypes.reduce((acc, type) => acc + yearDatum[type], 0);

        return {
          year,
          percent: yearDatum.area ? (acres / yearDatum.area) * 100 : null,
          acres,
          count,
        };
      }),
    }));
  }, [acresTypes, countTypes, placeData, showInactiveAreasForSelectedYear, sortBy, stateTerr, yearNum]);

  useEffect(() => {
    const wrapper = tableWrapRef.current;
    const yearHeader = document.getElementById(`table-year-${yearNum}`);

    if (!wrapper || !yearHeader) {
      return;
    }

    const stickyColumnWidth = 240;
    const targetLeft = Math.max(0, yearHeader.offsetLeft - stickyColumnWidth);

    wrapper.scrollTo({
      left: targetLeft,
      behavior: 'smooth',
    });
  }, [rows.length, yearNum]);

  const csv = useMemo(() => {
    const headers = ['Place'];

    TIMELINE_SELECTABLE_YEARS.forEach(year => {
      headers.push(
        `${year} percent`,
        `${year} acres`,
        `${year} count`,
      );
    });

    const csvRows = [
      headers,
      ...rows.map(row => [
        row.label,
        ...row.cells.reduce<string[]>((acc, cell) => {
          acc.push(
            formatPercent(cell.percent),
            cell.acres === null ? '' : Math.round(cell.acres).toString(),
            cell.count === null ? '' : Math.round(cell.count).toString(),
          );
          return acc;
        }, []),
      ]),
    ];
    return csvRows.map(row => row.map(value => encodeCsvCell(value)).join(',')).join('\n');
  }, [rows]);
  const csvFilename = `homesteads-table-${stateTerr || 'national'}-${yearNum}-${params.view || 'claims'}.csv`;

  useEffect(() => {
    if (!csv) {
      setCsvHref('');
      return undefined;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    setCsvHref(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [csv]);

  return (
    <Styled.Container id='timeline-data'>
      <Styled.Header>
        <Styled.Title>{title}</Styled.Title>
        <Styled.Description>
          This table presents the same timeline data in text form. For each year, the table lists the percentage of the area {acresLabel}, the acres {acresLabel}, and the number of {numberLabel}. <Styled.VisualizationLink as={Link} to={mapLink}>Return to the map visualization.</Styled.VisualizationLink>
        </Styled.Description>
      </Styled.Header>

      <TableControls
        sortBy={sortBy}
        onSortChange={setSortBy}
        showInactiveAreasForSelectedYear={showInactiveAreasForSelectedYear}
        onToggleInactiveAreasForSelectedYear={setShowInactiveAreasForSelectedYear}
        csvHref={csvHref}
        csvFilename={csvFilename}
      />

      {rows.length === 0 ? (
        <Styled.EmptyMessage>Loading timeline table data.</Styled.EmptyMessage>
      ) : (
        <Styled.TableWrap ref={tableWrapRef}>
          <Styled.DataTable>
            <colgroup>
              <col className='place-column' />
              {TIMELINE_SELECTABLE_YEARS.map(year => (
                <React.Fragment key={`columns-${year}`}>
                  <col className='metric-column year-start-column' />
                  <col className='metric-column' />
                  <col className='metric-column year-end-column' />
                </React.Fragment>
              ))}
            </colgroup>
            <thead>
              <tr>
                <th className='place-header' scope='col' rowSpan={2}>
                  Place
                </th>
                {TIMELINE_SELECTABLE_YEARS.map(year => (
                  <th id={`table-year-${year}`} scope='colgroup' colSpan={3} key={year}>
                    {year}
                  </th>
                ))}
              </tr>
              <tr>
                {TIMELINE_SELECTABLE_YEARS.map(year => (
                  <React.Fragment key={`metrics-${year}`}>
                    <th className='year-start' id={`table-year-${year}-percent`} scope='col'>Percent</th>
                    <th id={`table-year-${year}-acres`} scope='col'>Acres</th>
                    <th className='year-end' id={`table-year-${year}-count`} scope='col'>Count</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row.label}>
                  <th id={`table-row-${rowIndex}`} scope='row'>{row.label}</th>
                  {row.cells.map(cell => (
                    <React.Fragment key={`${row.label}-${cell.year}`}>
                      <td className='year-start' headers={`table-row-${rowIndex} table-year-${cell.year} table-year-${cell.year}-percent`}>{formatPercent(cell.percent)}</td>
                      <td headers={`table-row-${rowIndex} table-year-${cell.year} table-year-${cell.year}-acres`}>{formatNumber(cell.acres)}</td>
                      <td className='year-end' headers={`table-row-${rowIndex} table-year-${cell.year} table-year-${cell.year}-count`}>{formatNumber(cell.count)}</td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </Styled.DataTable>
        </Styled.TableWrap>
      )}
    </Styled.Container>
  );
};

export default TimelineTable;
