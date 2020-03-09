import { connect } from 'react-redux';
import Map from './Map.jsx';
import { selectYear } from '../store/actions';
import { getStyledPolygonsForYear, getGeojsonForYear, getTileURLsForYear } from '../store/selectors';

const mapStateToProps = state => ({
  selectedYear: state.selectedYear,
  polygons: getStyledPolygonsForYear(state),
  features: getGeojsonForYear(state),
  tileUrls: getTileURLsForYear(state),
});

const mapDispatchToProps = {
  selectYear,
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
