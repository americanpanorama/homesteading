import * as React from 'react';
import axios from 'axios';
import * as d3 from 'd3';
// @ts-ignore
import us from '../us.js';
import { useParams } from "react-router-dom";
import BarChartLegendItem from './BarChartLegendItem';
import DistrictText from './DistrictText';
import BarChart from './BarChart';
import BarChartPatents from './BarChartPatents';
import { RouterParams, TimelineYearPlaceData, TimelinePlaceData, TimelineYearPlaceDataWithStats, TimelinePlaceDataWithStats, PlaceType } from '../index.d';
import { calculateDistrictYearStats } from '../utilities';
import './LandOffice.css';

type SelectedView = 'number' | 'acres' | 'average_size';

const Office = () => {
  const { useState, useEffect } = React;
  const params = useParams<RouterParams>();
  const { stateTerr, office } = params;
  const year = params.year || '1863';

  const [timelinePlaceData, setTimelinePlaceData] = useState<TimelinePlaceData[]>([])
  const [stacked, setStacked] = useState(true);
  const [selectedView, setSelectedView] = useState<SelectedView>('number');

  useEffect(() => {
    axios(`${process.env.PUBLIC_URL}/data/timelineData/${stateTerr}.json`)
      .then(response => {
        setTimelinePlaceData(response.data as TimelinePlaceData[]);
      });
  }, [stateTerr]);

  if (timelinePlaceData && timelinePlaceData.length > 0) {
    console.log(timelinePlaceData);
    const dataWithoutStats: TimelinePlaceData = (office)
      ? timelinePlaceData.find(pt => pt.stateOrTerritory === stateTerr && pt.name.replace(/[^a-zA-Z]/g, '') === office)
      : (() => {
        const yearData: TimelineYearPlaceData[] = [];
        timelinePlaceData.forEach(districtData => {
          districtData.yearData.forEach(dyd => {
            const idx = yearData.findIndex(yd => yd.year === dyd.year);
            if (idx === -1) {
              yearData.push({
                ...dyd,
                conflicts: dyd.conflicts || [],
              });
            } else {
              yearData[idx].claims += dyd.claims;
              yearData[idx].claims_indian_lands += dyd.claims_indian_lands;
              yearData[idx].acres_claimed += dyd.acres_claimed;
              yearData[idx].acres_claimed_indian_lands += dyd.acres_claimed_indian_lands;
              yearData[idx].patents += dyd.patents;
              yearData[idx].patents_indian_lands += dyd.patents_indian_lands;
              yearData[idx].acres_patented += dyd.acres_patented;
              yearData[idx].acres_patented_indian_lands += dyd.acres_patented_indian_lands;
              yearData[idx].commutations_2301 += dyd.commutations_2301;
              yearData[idx].acres_commuted_2301 += dyd.acres_commuted_2301;
              yearData[idx].commutations_18800615 += dyd.commutations_18800615;
              yearData[idx].acres_commuted_18800615 += dyd.acres_commuted_18800615;
              yearData[idx].commutations_indian_lands += dyd.commutations_indian_lands;
              yearData[idx].acres_commuted_indian_lands += dyd.acres_commuted_indian_lands;
              yearData[idx].area += dyd.area;
              yearData[idx].conflicts = yearData[idx].conflicts
                .concat(dyd.conflicts)
                .filter(d => typeof d !== 'undefined')
                .sort((a, b) => {
                  if (b.start_date.month !== a.start_date.month) {
                    return a.start_date.month - b.start_date.month;
                  }
                  if (b.start_date.day !== b.start_date.day) {
                    return a.start_date.day - b.start_date.day;
                  }
                  return 0;
                });
            }
          })
        });
        return {
          name: us.lookup(stateTerr).name,
          stateOrTerritory: stateTerr,
          type: 'stateOrTerritory' as PlaceType,
          medianYearClaimsAcres: 2000,
          yearData,
        };
      })();
    console.log(dataWithoutStats);
    const landOfficeData: TimelinePlaceDataWithStats = {
      ...dataWithoutStats,
      total_claims_federal_lands: dataWithoutStats.yearData.reduce((acc, curr) => curr.claims + acc, 0),
      total_claims_indian_lands: dataWithoutStats.yearData.reduce((acc, curr) => curr.claims_indian_lands + acc, 0),
      total_patents_federal_lands: dataWithoutStats.yearData.reduce((acc, curr) => curr.patents + acc, 0),
      total_patents_indian_lands: dataWithoutStats.yearData.reduce((acc, curr) => curr.patents_indian_lands + acc, 0),
      total_commutations_2301: dataWithoutStats.yearData.reduce((acc, curr) => curr.commutations_2301 + acc, 0),
      total_commutations_18800615: dataWithoutStats.yearData.reduce((acc, curr) => curr.commutations_18800615 + acc, 0),
      total_commutations_indian_lands: dataWithoutStats.yearData.reduce((acc, curr) => curr.commutations_indian_lands + acc, 0),
      yearData: dataWithoutStats.yearData.map(yd => calculateDistrictYearStats(yd)),
    };

    const syd: TimelineYearPlaceDataWithStats = landOfficeData.yearData.find(yd => yd.year === parseInt(year));
    const earliestYear: number = Math.min(...landOfficeData.yearData.map(d => d.year));
    const latestYear: number = Math.max(...landOfficeData.yearData.map(d => d.year));
    const earliestYearSYBoundaries = Math.min(...landOfficeData.yearData.filter(d => d && syd && d.area === syd.area).map(d => d.year));
    const latestYearSYBoundaries = Math.max(...landOfficeData.yearData.filter(d => d && syd && d.area === syd.area).map(d => d.year));
    // are there both federal and indian lands or only one or the other?
    const hasMultipleClaimTypes: boolean = landOfficeData.total_claims_federal_lands > 0 && landOfficeData.total_claims_indian_lands > 0;
    // are there both federal and indian lands or only one or the other?
    const hasMultiplePatentTypes: boolean = [
      landOfficeData.total_patents_federal_lands > 0,
      landOfficeData.total_claims_indian_lands > 0,
      landOfficeData.total_commutations_2301 > 0,
      landOfficeData.total_commutations_18800615 > 0,
      landOfficeData.total_commutations_indian_lands > 0
    ].filter(d => d).length > 1;

    return (
      <aside id='officeData'>

        <DistrictText
          office={landOfficeData.name}
          type={landOfficeData.type}
          year={year}
          earliestYear={earliestYear}
          latestYear={latestYear}
          earliestYearSYBoundaries={earliestYearSYBoundaries}
          latestYearSYBoundaries={latestYearSYBoundaries}
          selectedYearData={syd}
        />

        <div
          className='barLegend'
        >
          {(landOfficeData.total_claims_federal_lands > 0 || landOfficeData.total_patents_federal_lands > 0) && (
            <BarChartLegendItem
              className='federal_lands'
              label='claims or patents on federal land'
            />
          )}
          {(landOfficeData.total_claims_indian_lands > 0 || landOfficeData.total_patents_indian_lands > 0) && (
            <BarChartLegendItem
              className='indian_lands'
              label='claims or patents on Indian land'
            />
          )}
          {(landOfficeData.total_commutations_2301 > 0) && (
            <BarChartLegendItem
              className='commutations_2301'
              label='commutations on federal land under 2301'
            />
          )}
          {(landOfficeData.total_commutations_18800615 > 0) && (
            <BarChartLegendItem
              className='commutations_18800615'
              label='commutations on federal land under 1880'
            />
          )}
          {(landOfficeData.total_commutations_indian_lands > 0) && (
            <BarChartLegendItem
              className='commutations_indian_lands'
              label='commutations on Indian land'
            />
          )}
        </div>

        <nav className='chart'>
          <div>
            <button
              onClick={() => { setStacked(true); }}
              className={(stacked) ? 'selected' : ''}
              disabled={selectedView === 'average_size'}
            >
              Stacked
            </button>
            <button
              onClick={() => { setStacked(false); }}
              className={(!stacked) ? 'selected' : ''}
            >
              Grouped
            </button>
          </div>
          <div>
            <button
              onClick={() => { setSelectedView('number'); }}
              className={(selectedView === 'number') ? 'selected' : ''}
            >
              Number
            </button>
            <button
              onClick={() => { setSelectedView('acres'); }}
              className={(selectedView === 'acres') ? 'selected' : ''}
            >
              Acres
            </button>
            <button
              onClick={() => { setSelectedView('average_size'); setStacked(false); }}
              className={(selectedView === 'average_size') ? 'selected' : ''}
            >
              Average Size
            </button>
          </div>
        </nav>
        <BarChart
          chartData={landOfficeData}
          stacked={stacked || !hasMultipleClaimTypes}
          selectedView={selectedView}
          label='claims'
        />
        <BarChartPatents
          chartData={landOfficeData}
          stacked={stacked || !hasMultiplePatentTypes}
          selectedView={selectedView}
          label='claims'
        />
      </aside>
    );
  }
  return null;
}

export default Office
