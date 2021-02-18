import { connect } from 'react-redux';
import * as d3 from 'd3';
import Graph from './Graph.jsx';
import { selectYear } from '../store/actions';
import { getTotalClaimsByYear } from '../store/selectors';

const mapStateToProps = state => {
  const x = d3.scaleLinear()
    .domain([1864, 1913])
    .range([0.05, 0.95]);
  const y = d3.scaleLinear()
    .domain([0, 30000000])
    .range([0.5, 0]);
  const area = d3.area()
    .x(function(d) { return x(d.year); })
    .y0(0.5)
    .y1(function(d) { return y(d.claims_ac); })
    .curve(d3.curveCardinal);

  const areaPatents = d3.area()
    .x(function(d) { return x(d.year); })
    .y0(0)
    .y1(function(d) { return 0.5 - y(d.patents_ac); });

  const aggregateYearData = getTotalClaimsByYear();

  const decadeXs = [1870, 1880, 1890, 1900, 1910].map(year => ({
      label: year,
      x: x(year)
    }));
  const selectableRects = Array(1912 - 1864 + 1)
    .fill()
    .map((_, idx) => 1864 + idx)
    .map(year => ({
      x: x(year - 0.5),
      width: x(year + 0.5) - x(year - 0.5),
      year,
    }));
  return {
    selectedYear: state.selectedYear,
    selectedYearX: x(state.selectedYear),
    selectedYearY: y(aggregateYearData.find(ayd => ayd.year === state.selectedYear).claims_ac),
    claimsPath: area(aggregateYearData),
    patentsPath: areaPatents(aggregateYearData),
    decadeXs,
    selectableRects,
  };
};

const mapDispatchToProps = {
  selectYear,
};

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
