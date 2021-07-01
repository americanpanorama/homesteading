import * as React from 'react';
import { useAsync } from 'react-async';
import * as d3 from 'd3';
import { Link, useParams, useHistory } from "react-router-dom";
import DimensionsContext from '../DimensionsContext';
import TimelineDateHeader from './TimelineDateHeader';
import LineChart from './LineChart';
import { Dimensions, RouterParams, TimelineYearPlaceData, TimelinePlaceData } from '../index.d';
import { ProjectedTownship, TileData, CalculateTransform, CalculateCenterAndDXDY, TransformData, CalculateZ, Bounds, Point } from './VectorMap.d';
import { AsyncParams } from './Timeline.d';
import './LandOffice.css';

interface ChartPoint {
  year: number;
  value: number;
}

type LineData = ChartPoint[];

type ChartData = {
  linesData: {
    lineData: ChartPoint[];
    color: string;
    label: string;
  }[];
  yMax: number;
};

const loadData = async ({ place }: { place: string}) => {
  const res = await fetch(`/data/timelineData/${place}.json`);
  if (!res.ok) { console.log(res) }
  const rawData = await res.json();
  return rawData;
}

const Office = () => {
  const { useEffect, useContext, useState, useRef } = React;
  const params = useParams<RouterParams>();
  const { year, stateTerr, office } = params;
  const { width, height, leftAxisWidth } = (useContext(DimensionsContext) as Dimensions).timelineDimensions;
  const { data: TimelinePlaceData, error }: AsyncParams = useAsync({ 
    promiseFn: loadData,
    place: stateTerr,
    watch: stateTerr,
  });

  const x = d3.scaleLinear()
    .domain([1862, 1912])
    .range([260, width - 25]);

  const y = d3.scaleLinear()
    .domain([0, 500000])
    .range([200, 0]);

  const line = d3.line<ChartPoint>()
    .curve(d3.curveCatmullRom)
    .x((d: ChartPoint) => x(d.year))
    .y((d: ChartPoint) => y(d.value));


  if (TimelinePlaceData) {
    const landOfficeData: TimelinePlaceData = TimelinePlaceData.find(pt => pt.stateOrTerritory === stateTerr && pt.name.replace(/[^a-zA-Z]/g, '') === office);

    const acresClaimed: ChartPoint[] = landOfficeData.yearData
      .map(yd => ({
        year: yd.year,
        value: yd.acres_claimed,
      }));

    const acresPatented: ChartPoint[] = landOfficeData.yearData
      .map(yd => ({
        year: yd.year,
        value: yd.acres_patented,
      }));

    const acreageLineData: ChartData = {
      linesData: [
        {
          lineData: acresClaimed,
          color: 'yellow',
          label: 'acres claimed',
        },
        {
          lineData: acresPatented,
          color: 'silver',
          label: 'acres patented',
        },
      ],
      yMax: Math.max(...acresClaimed.map(d => d.value), ...acresPatented.map(d => d.value))
    } 

    const averageClaimSize: ChartPoint[] = landOfficeData.yearData
      .filter(yd => yd.claims > 0)
      .map(yd => ({
        year: yd.year,
        value: yd.acres_claimed / yd.claims,
      }));

    const averagePatentSize: ChartPoint[] = landOfficeData.yearData
      .filter(yd => yd.patents > 0)
      .map(yd => ({
        year: yd.year,
        value: yd.acres_patented / yd.patents,
      }));

    const averageAcreageData: ChartData = {
      linesData: [
        {
          lineData: averageClaimSize,
          color: 'yellow',
          label: 'average size of claim',
        },
        {
          lineData: averagePatentSize,
          color: 'silver',
          label: 'average size of patent',
        },
      ],
      yMax: Math.max(...averageClaimSize.map(d => d.value), ...averagePatentSize.map(d => d.value))
    } 

    const claims: ChartPoint[] = landOfficeData.yearData
      .map(yd => ({
        year: yd.year,
        value: yd.claims,
      }));

    const patents: ChartPoint[] = landOfficeData.yearData
      .map(yd => ({
        year: yd.year,
        value: yd.patents,
      }));

    const claimsAndPatents: ChartData = {
      linesData: [
        {
          lineData: claims,
          color: 'yellow',
          label: 'number of claims',
        },
        {
          lineData: patents,
          color: 'silver',
          label: 'number of patents',
        },
      ],
      yMax: Math.max(...claims.map(d => d.value), ...patents.map(d => d.value))
    } 


    return (
      <aside id='officeData'>
        <TimelineDateHeader />
        <LineChart
          chartData={claimsAndPatents}
          label='claims and patents'
        />
        <LineChart
          chartData={acreageLineData}
          label='acres'
        />
        <LineChart
          chartData={averageAcreageData}
          label='average size'
        />
        </aside>
    );
  }
  return null;
}

export default Office
