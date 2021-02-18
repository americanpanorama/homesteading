import { connect } from 'react-redux';
import VectorMap from './VectorMap.jsx';
//import { selectYear } from '../store/actions';
import { getReservationsPolygonsForYear, getPolygonsForYear, getOfficePolygonsForYear, getTownshipTiles, getMapParameters } from '../store/selectors';

const mapStateToProps = state => ({
  //polygons: getPolygonsForYear(state),
  reservations: getReservationsPolygonsForYear(state),
  offices: getOfficePolygonsForYear(state),
  mapParameters: getMapParameters(state),
  tiles: getTownshipTiles(state),
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(VectorMap);
